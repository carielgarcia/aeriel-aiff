/* ==========================================================================
   TECHNO VARIANTS ENGINE v2 — raw Web Audio synthesis + look-ahead sequencer
   --------------------------------------------------------------------------
   - Sample-accurate scheduling: every event is placed with an explicit AudioContext time.
   - Look-ahead clock runs in a Worker (clock-worker.js) so background-tab timer throttling
     does not starve the scheduler; falls back to setInterval if Workers are unavailable.
   - Kick is tuned to the track key; bass/synth/FX returns are ducked by a scheduled sidechain.
   - Delay is tempo-synced; reverb is a generated stereo impulse response.
   - Metallic hats use band-limited native oscillators (no hand-rolled aliasing square waves).
   - Deterministic noise (seeded) so renders are repeatable and testable offline.
   Public API: window.TVEngine
   ========================================================================== */
(function (global) {
  'use strict';

  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  function noteToMidi(note) {
    const m = /^([A-G]#?)(-?\d)$/.exec(note || '');
    if (!m) return null;
    return (parseInt(m[2], 10) + 1) * 12 + NOTE_NAMES.indexOf(m[1]);
  }
  function noteToFreq(note) {
    const midi = noteToMidi(note);
    return midi === null ? 440 : 440 * Math.pow(2, (midi - 69) / 12);
  }
  function transposeNote(note, semitones) {
    const midi = noteToMidi(note);
    if (midi === null || !semitones) return note;
    const n = midi + semitones;
    return NOTE_NAMES[((n % 12) + 12) % 12] + (Math.floor(n / 12) - 1);
  }

  // Voice definitions (shared by engine and UI). `base` = per-voice output trim chosen by measurement.
  const VOICES = [
    { id: 'kick',      isTonal: true,  baseNote: 'G1', octave: 1, tune: 0, decay: 0.24, level: 0.95, pan: 0,    color: '#22c55e', base: 1.00 },
    { id: 'bass',      isTonal: true,  baseNote: 'G1', octave: 1, tune: 0, decay: 0.16, level: 0.88, pan: 0,    color: '#06b6d4', base: 0.17 },
    { id: 'congaHigh', isTonal: true,  baseNote: 'D3', octave: 3, tune: 0, decay: 0.16, level: 0.80, pan: 0.40, color: '#f59e0b', base: 0.17 },
    { id: 'congaLow',  isTonal: true,  baseNote: 'G2', octave: 2, tune: 0, decay: 0.22, level: 0.80, pan: -0.40, color: '#ea580c', base: 0.17 },
    { id: 'hat',       isTonal: false, baseNote: null, octave: 0, tune: 0, decay: 0.05, level: 0.80, pan: 0.45, color: '#38bdf8', base: 0.70, timbre: 'closed' },
    { id: 'openHat',   isTonal: false, baseNote: null, octave: 0, tune: 0, decay: 0.30, level: 0.80, pan: -0.35, color: '#818cf8', base: 1.00 },
    { id: 'clap',      isTonal: false, baseNote: null, octave: 0, tune: 0, decay: 0.16, level: 0.85, pan: 0.10, color: '#ec4899', base: 0.55 },
    { id: 'synth',     isTonal: true,  baseNote: 'G3', octave: 3, tune: 0, decay: 0.22, level: 0.78, pan: 0,    color: '#a855f7', base: 0.03, chordType: 'min9' }
  ];

  // Six-square metallic oscillator bank (classic analog-cymbal ratios, Hz).
  const METAL_FREQS = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0];
  const LOOKAHEAD = 0.20;     // seconds scheduled ahead
  const TICK_MS = 25;

  const E = {
    ctx: null,
    nodes: null,
    profile: null,
    state: {
      voices: VOICES.map(v => Object.assign({}, v)),
      pattern: {},
      pitches: {},
      tracks: {},
      bpm: 126,
      swing: 0.5          // MPC-style swing ratio: 0.50 = straight, 0.66 = triplet feel
    },
    playing: false,
    step: 0,
    nextTime: 0,
    activeBass: null,
    activeOpenHat: null,
    clock: null,
    onStep: null,
    timer: null,
    noise: null
  };
  E.state.voices.forEach(v => { E.state.tracks[v.id] = { muted: false, solo: false }; });

  /* ----------------------------------------------------------------------- utils */
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeNoiseBuffer(ctx, seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    const rnd = mulberry32(0x7EC4A0);
    for (let i = 0; i < len; i++) d[i] = rnd() * 2 - 1;
    return buf;
  }

  function driveCurve(drive) {
    const n = 2048, c = new Float32Array(n), k = Math.tanh(drive);
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * 2 - 1;
      c[i] = Math.tanh(x * drive) / k;
    }
    return c;
  }

  // Output ceiling: transparent below ~-3 dBFS, soft-limits towards -0.9 dBFS.
  function ceilingCurve() {
    const n = 4096, c = new Float32Array(n), knee = 0.7, ceil = 0.9;
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * 2 - 1, a = Math.abs(x);
      let y = a;
      if (a > knee) y = knee + (ceil - knee) * Math.tanh((a - knee) / (ceil - knee));
      c[i] = Math.sign(x) * y;
    }
    return c;
  }

  // Generated stereo impulse response: exponentially decaying decorrelated noise with
  // progressive high-frequency damping and a short pre-delay.
  function makeImpulse(ctx, seconds, damping) {
    const sr = ctx.sampleRate;
    const len = Math.max(1, Math.floor(sr * seconds));
    const pre = Math.floor(sr * 0.012);
    const buf = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      const rnd = mulberry32(0xC0FFEE + ch * 7919);
      let lp = 0;
      for (let i = pre; i < len; i++) {
        const t = (i - pre) / sr;
        const env = Math.pow(10, -3 * t / seconds);           // -60 dB at `seconds`
        const cutoff = 0.55 - damping * 0.5 * (t / seconds);   // one-pole coefficient shrinks over time
        lp += (rnd() * 2 - 1 - lp) * Math.max(0.04, cutoff);
        d[i] = lp * env;
      }
    }
    return buf;
  }

  /* ----------------------------------------------------------------------- graph */
  function buildGraph(ctx) {
    const N = {};
    N.master = ctx.createGain();
    N.master.gain.value = 1.3;

    N.dc = ctx.createBiquadFilter();
    N.dc.type = 'highpass'; N.dc.frequency.value = 22; N.dc.Q.value = 0.707;

    // gentle bus glue
    N.glue = ctx.createDynamicsCompressor();
    N.glue.threshold.value = -16; N.glue.knee.value = 8; N.glue.ratio.value = 2.2;
    N.glue.attack.value = 0.02; N.glue.release.value = 0.14;

    // true peak-style limiter
    N.limiter = ctx.createDynamicsCompressor();
    N.limiter.threshold.value = -3; N.limiter.knee.value = 0; N.limiter.ratio.value = 20;
    N.limiter.attack.value = 0.001; N.limiter.release.value = 0.08;

    N.ceiling = ctx.createWaveShaper();
    N.ceiling.curve = ceilingCurve();
    N.ceiling.oversample = '4x';

    N.out = ctx.createGain();
    N.out.gain.value = 0.95;

    N.analyser = ctx.createAnalyser();
    N.analyser.fftSize = 1024;

    N.master.connect(N.dc);
    N.dc.connect(N.glue);
    N.glue.connect(N.limiter);
    N.limiter.connect(N.ceiling);
    N.ceiling.connect(N.out);
    N.out.connect(N.analyser);
    N.analyser.connect(ctx.destination);

    // Bus that the sidechain ducks: bass, synth and FX returns.
    N.duck = ctx.createGain();
    N.duck.connect(N.master);
    // Kick and percussion bypass the duck.
    N.dry = ctx.createGain();
    N.dry.connect(N.master);

    // Reverb send -> HP -> convolver -> return (ducked)
    N.revSend = ctx.createGain();
    N.revHP = ctx.createBiquadFilter();
    N.revHP.type = 'highpass'; N.revHP.frequency.value = 260;
    N.conv = ctx.createConvolver();
    N.revReturn = ctx.createGain();
    N.revSend.connect(N.revHP); N.revHP.connect(N.conv); N.conv.connect(N.revReturn); N.revReturn.connect(N.duck);

    // Tempo-synced ping-pong delay
    N.dlySend = ctx.createGain();
    N.dlyL = ctx.createDelay(2); N.dlyR = ctx.createDelay(2);
    N.dlyFbL = ctx.createGain(); N.dlyFbR = ctx.createGain();
    N.dlyFbL.gain.value = 0.38; N.dlyFbR.gain.value = 0.38;
    N.dlyLP = ctx.createBiquadFilter(); N.dlyLP.type = 'lowpass'; N.dlyLP.frequency.value = 3400;
    N.dlyHP = ctx.createBiquadFilter(); N.dlyHP.type = 'highpass'; N.dlyHP.frequency.value = 320;
    N.dlyReturn = ctx.createGain();
    N.dlySend.connect(N.dlyHP); N.dlyHP.connect(N.dlyLP); N.dlyLP.connect(N.dlyL);
    N.dlyL.connect(N.dlyFbL); N.dlyFbL.connect(N.dlyR);
    N.dlyR.connect(N.dlyFbR); N.dlyFbR.connect(N.dlyL);
    const merger = ctx.createChannelMerger(2);
    N.dlyL.connect(merger, 0, 0);
    N.dlyR.connect(merger, 0, 1);
    merger.connect(N.dlyReturn);
    N.dlyReturn.connect(N.duck);

    E.noise = makeNoiseBuffer(ctx, 2);
    E.nodes = N;
  }

  /* ----------------------------------------------------------------------- profile / tempo */
  function applyProfile(sound) {
    E.profile = sound;
    if (!E.ctx) return;
    const N = E.nodes, ctx = E.ctx, t = ctx.currentTime;
    N.revSend.gain.setTargetAtTime(1, t, 0.01);
    N.revReturn.gain.setTargetAtTime(sound.reverbWet, t, 0.01);
    const key = sound.reverbSize + '@' + ctx.sampleRate;
    E.impulses = E.impulses || {};
    N.conv.buffer = E.impulses[key] || (E.impulses[key] = makeImpulse(ctx, sound.reverbSize, 0.9));
    N.dlyReturn.gain.setTargetAtTime(sound.delayWet, t, 0.01);
    setTempo(E.state.bpm);
  }

  function stepSeconds() { return 60 / E.state.bpm / 4; }

  function setTempo(bpm) {
    E.state.bpm = bpm;
    if (!E.ctx || !E.profile) return;
    const t = E.ctx.currentTime;
    const d = stepSeconds() * E.profile.delayDiv;           // 3 = dotted-eighth, 2 = eighth
    E.nodes.dlyL.delayTime.setTargetAtTime(d, t, 0.05);
    E.nodes.dlyR.delayTime.setTargetAtTime(d, t, 0.05);
  }

  /* ----------------------------------------------------------------------- helpers for voices */
  function pannerFor(ctx, pan, dest, t) {
    if (ctx.createStereoPanner && pan) {
      const p = ctx.createStereoPanner();
      p.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t);
      p.connect(dest);
      return p;
    }
    return dest;
  }

  function sendTo(ctx, src, bus, amount) {
    if (!amount) return;
    const g = ctx.createGain();
    g.gain.value = amount;
    src.connect(g); g.connect(bus);
  }

  function noiseSource(t, offset) {
    const s = E.ctx.createBufferSource();
    s.buffer = E.noise; s.loop = true;
    s.start(t, offset || 0);
    return s;
  }

  // Sidechain: dip the ducked bus at kick time, recover with a smooth exponential.
  function duckAt(t) {
    const P = E.profile || { duckDepth: 0.5, duckRelease: 0.14 };
    const g = E.nodes.duck.gain;
    g.setTargetAtTime(P.duckDepth, t, 0.002);
    g.setTargetAtTime(1, t + 0.012, P.duckRelease / 3);
  }

  /* ----------------------------------------------------------------------- voices */
  function playKick(t, vel, v) {
    const ctx = E.ctx, N = E.nodes, P = E.profile;
    const fEnd = noteToFreq(transposeNote(v.baseNote, v.tune));
    const decay = Math.max(0.08, v.decay);
    const tau = decay / 4.6;                                   // decay = time to -40 dB

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(Math.min(fEnd * 4.6, 280), t);
    osc.frequency.setTargetAtTime(fEnd * 1.04, t, 0.013);
    osc.frequency.setTargetAtTime(fEnd * 0.95, t + 0.05, decay * 0.4);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(1, t + 0.0012);
    amp.gain.setTargetAtTime(0, t + 0.0012, tau);

    const shaper = ctx.createWaveShaper();
    shaper.curve = driveCurve(P.kickDrive);
    shaper.oversample = '4x';

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 28; hp.Q.value = 0.707;

    const trim = ctx.createGain();
    trim.gain.value = v.base * v.level * vel * 0.32 / Math.sqrt(1 + 0.25 * Math.max(0, P.kickDrive - 1.5));   // heavier drive lifts the tail; compensate

    osc.connect(amp); amp.connect(shaper); shaper.connect(hp); hp.connect(trim);

    // Beater click: short band-passed noise burst
    if (P.kickClick > 0) {
      const n = noiseSource(t, 0.1);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 0.8;
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0, t);
      cg.gain.linearRampToValueAtTime(P.kickClick * 0.45, t + 0.0008);
      cg.gain.setTargetAtTime(0, t + 0.0008, 0.0016);
      n.connect(bp); bp.connect(cg); cg.connect(trim);
      n.stop(t + 0.03);
    }

    trim.connect(pannerFor(ctx, v.pan, N.dry, t));
    osc.start(t);
    osc.stop(t + decay * 1.9 + 0.05);
    duckAt(t);
  }

  function playBass(t, vel, v, step) {
    const ctx = E.ctx, N = E.nodes, S = E.state;
    if (E.activeBass) { E.activeBass.choke(t); E.activeBass = null; }

    const freq = noteToFreq(transposeNote((S.pitches.bass && S.pitches.bass[step]) || v.baseNote, v.tune));
    const len = stepLength(step);
    const nextActive = S.pattern.bass && S.pattern.bass[(step + 1) % 16] > 0;
    const gate = nextActive ? len : Math.max(0.05, len * 0.82);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(1, t + 0.003);
    env.gain.setValueAtTime(1, t + gate);
    env.gain.setTargetAtTime(0, t + gate, 0.010);

    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.setValueAtTime(freq, t);
    const subG = ctx.createGain(); subG.gain.value = 0.85;
    const s1 = ctx.createOscillator(), s2 = ctx.createOscillator();
    s1.type = s2.type = 'sawtooth';
    s1.frequency.setValueAtTime(freq, t); s2.frequency.setValueAtTime(freq, t);
    s1.detune.value = -6; s2.detune.value = 6;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 3.5;
    lp.frequency.setValueAtTime(260 + 900 * vel, t);
    lp.frequency.setTargetAtTime(200, t, 0.07);
    const sawG = ctx.createGain(); sawG.gain.value = 0.28;
    const sat = ctx.createWaveShaper(); sat.curve = driveCurve(1.8); sat.oversample = '4x';
    const trim = ctx.createGain(); trim.gain.value = v.base * v.level * vel;

    sub.connect(subG); subG.connect(env);
    s1.connect(lp); s2.connect(lp); lp.connect(sawG); sawG.connect(env);
    env.connect(sat); sat.connect(trim);
    trim.connect(pannerFor(ctx, v.pan, N.duck, t));

    const stopT = t + gate + 0.08;
    sub.start(t); s1.start(t); s2.start(t);
    sub.stop(stopT); s1.stop(stopT); s2.stop(stopT);

    E.activeBass = {
      choke(now) {
        try {
          env.gain.cancelScheduledValues(now);
          env.gain.setTargetAtTime(0, now, 0.0025);
          const e = now + 0.03;
          sub.stop(e); s1.stop(e); s2.stop(e);
        } catch (err) { /* already stopped */ }
      }
    };
  }

  function metalBank(t, level) {
    const ctx = E.ctx;
    const sum = ctx.createGain();
    sum.gain.value = level / METAL_FREQS.length;
    const oscs = METAL_FREQS.map(f => {
      const o = ctx.createOscillator();
      o.type = 'square'; o.frequency.setValueAtTime(f, t);
      o.connect(sum); o.start(t);
      return o;
    });
    return { out: sum, stop: (e) => oscs.forEach(o => { try { o.stop(e); } catch (x) {} }) };
  }

  function playHat(t, vel, v, step) {
    const ctx = E.ctx, N = E.nodes;
    if (E.activeOpenHat) { E.activeOpenHat.choke(t); E.activeOpenHat = null; }
    const pan = v.pan * (step % 2 === 0 ? 1 : -1);
    const trim = ctx.createGain();
    trim.gain.value = v.base * v.level * vel * (v.timbre === 'shaker' ? 0.40 : 1);
    trim.connect(pannerFor(ctx, pan, N.dry, t));
    const decay = Math.max(0.02, v.decay);
    const tau = decay / 4.6;

    if (v.timbre === 'shaker') {
      const n = noiseSource(t, (step * 0.137) % 1.2);
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 6800; bp.Q.value = 0.7;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3800;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(1.0, t + 0.006);
      g.gain.setTargetAtTime(0, t + 0.006, tau);
      n.connect(bp); bp.connect(hp); hp.connect(g); g.connect(trim);
      n.stop(t + decay * 2 + 0.02);
      sendTo(ctx, g, N.revSend, 0.05);
      return;
    }

    // Closed hat: metallic bank + a touch of noise
    const bank = metalBank(t, 1.0);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000; hp.Q.value = 0.7;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 10000; bp.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 0.0008);
    g.gain.setTargetAtTime(0, t + 0.0008, tau);
    bank.out.connect(hp); hp.connect(bp); bp.connect(g);
    const n = noiseSource(t, (step * 0.211) % 1.2);
    const nhp = ctx.createBiquadFilter(); nhp.type = 'highpass'; nhp.frequency.value = 9000;
    const ng = ctx.createGain(); ng.gain.value = 0.10;
    n.connect(nhp); nhp.connect(ng); ng.connect(g);
    g.connect(trim);
    bank.stop(t + decay * 2.2 + 0.02); n.stop(t + decay * 2.2 + 0.02);
    sendTo(ctx, g, N.revSend, 0.04);
  }

  function playOpenHat(t, vel, v, step) {
    const ctx = E.ctx, N = E.nodes;
    if (E.activeOpenHat) { E.activeOpenHat.choke(t); E.activeOpenHat = null; }
    const decay = Math.max(0.12, v.decay);
    const bank = metalBank(t, 1.0);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6000; hp.Q.value = 0.7;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 9000; bp.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 0.001);
    g.gain.setTargetAtTime(0.38, t + 0.001, 0.018);
    g.gain.setTargetAtTime(0, t + 0.045, Math.max(0.02, (decay - 0.045) / 4.6));
    const n = noiseSource(t, (step * 0.173) % 1.2);
    const nhp = ctx.createBiquadFilter(); nhp.type = 'highpass'; nhp.frequency.value = 8500;
    const ng = ctx.createGain(); ng.gain.value = 0.08;
    n.connect(nhp); nhp.connect(ng); ng.connect(g);
    bank.out.connect(hp); hp.connect(bp); bp.connect(g);
    const trim = ctx.createGain(); trim.gain.value = v.base * v.level * vel;
    g.connect(trim);
    trim.connect(pannerFor(ctx, v.pan, N.dry, t));
    sendTo(ctx, g, N.revSend, 0.06);
    const stopT = t + decay * 2.2 + 0.05;
    bank.stop(stopT); n.stop(stopT);
    E.activeOpenHat = {
      choke(now) {
        try {
          g.gain.cancelScheduledValues(now);
          g.gain.setTargetAtTime(0, now, 0.004);
          bank.stop(now + 0.04); n.stop(now + 0.04);
        } catch (e) { /* already stopped */ }
      }
    };
  }

  function playClap(t, vel, v) {
    const ctx = E.ctx, N = E.nodes;
    const tail = Math.max(0.06, v.decay);
    const n = noiseSource(t, 0.37);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1100; bp.Q.value = 1.1;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 520;
    const air = ctx.createBiquadFilter(); air.type = 'peaking'; air.frequency.value = 2600; air.gain.value = 4; air.Q.value = 0.9;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    // Four close noise bursts (~10 ms apart) followed by the decaying body
    for (let i = 0; i < 4; i++) {
      const b = t + i * 0.0105;
      g.gain.setValueAtTime(0.0001, b);
      g.gain.linearRampToValueAtTime(i === 3 ? 1 : 0.7, b + 0.0007);
      if (i < 3) g.gain.setTargetAtTime(0.0001, b + 0.0007, 0.0028);
    }
    g.gain.setTargetAtTime(0, t + 3 * 0.0105 + 0.0007, tail / 4.6);
    n.connect(hp); hp.connect(bp); bp.connect(air); air.connect(g);
    const trim = ctx.createGain(); trim.gain.value = v.base * v.level * vel;
    g.connect(trim);
    trim.connect(pannerFor(ctx, v.pan, N.dry, t));
    sendTo(ctx, g, N.revSend, 0.28);
    n.stop(t + tail * 2.2 + 0.08);
  }

  function playConga(t, vel, v, step, which) {
    const ctx = E.ctx, N = E.nodes;
    const f0 = noteToFreq(transposeNote((E.state.pitches[which] && E.state.pitches[which][step]) || v.baseNote, v.tune));
    const decay = Math.max(0.06, v.decay);
    const trim = ctx.createGain();
    trim.gain.value = v.base * v.level * vel;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 70;
    trim.connect(hp);
    hp.connect(pannerFor(ctx, v.pan, N.dry, t));
    // Circular-membrane modal partials (ideal-membrane ratios) with individual decays
    [[1, 1.0, 1.0], [1.593, 0.5, 0.55], [2.136, 0.26, 0.35]].forEach(([ratio, amp, dMul]) => {
      const o = ctx.createOscillator(); o.type = 'sine';
      const f = f0 * ratio;
      o.frequency.setValueAtTime(f * 1.07, t);
      o.frequency.setTargetAtTime(f, t, 0.012);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(amp, t + 0.0015);
      g.gain.setTargetAtTime(0, t + 0.0015, (decay * dMul) / 4.6);
      o.connect(g); g.connect(trim);
      o.start(t); o.stop(t + decay * dMul * 2 + 0.03);
    });
    // Slap transient
    const n = noiseSource(t, (step * 0.19 + (which === 'congaHigh' ? 0.05 : 0.4)) % 1.2);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = which === 'congaHigh' ? 2300 : 1400; bp.Q.value = 1.4;
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0, t);
    sg.gain.linearRampToValueAtTime(0.55, t + 0.0008);
    sg.gain.setTargetAtTime(0, t + 0.0008, 0.0035);
    n.connect(bp); bp.connect(sg); sg.connect(trim);
    n.stop(t + 0.05);
    sendTo(ctx, trim, N.revSend, 0.05);
  }

  function playSynth(t, vel, v, step) {
    const ctx = E.ctx, N = E.nodes;
    const root = transposeNote((E.state.pitches.synth && E.state.pitches.synth[step]) || v.baseNote, v.tune);
    const semis = v.chordType === 'min9' ? [0, 3, 7, 10, 14] : [0, 3, 7];
    const decay = Math.max(0.05, v.decay);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 3.0;
    lp.frequency.setValueAtTime(3200, t);
    lp.frequency.setTargetAtTime(380, t, decay / 3);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 140;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 0.003);
    g.gain.setTargetAtTime(0, t + 0.003, decay / 4.6);
    const trim = ctx.createGain();
    trim.gain.value = v.base * v.level * vel / Math.sqrt(semis.length);
    semis.forEach(s => {
      const f = noteToFreq(transposeNote(root, s));
      [-9, 9].forEach(c => {
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(f, t); o.detune.value = c;
        o.connect(lp); o.start(t); o.stop(t + decay * 2 + 0.05);
      });
    });
    lp.connect(hp); hp.connect(g); g.connect(trim);
    trim.connect(pannerFor(ctx, v.pan, N.duck, t));
    sendTo(ctx, g, N.dlySend, 0.55);
    sendTo(ctx, g, N.revSend, 0.35);
  }

  function trigger(voiceId, time, vel, step) {
    const ctx = E.ctx;
    if (!ctx) return;
    const v = E.state.voices.find(x => x.id === voiceId);
    if (!v) return;
    const t = Math.max(time, ctx.currentTime);
    switch (voiceId) {
      case 'kick': playKick(t, vel, v); break;
      case 'bass': playBass(t, vel, v, step); break;
      case 'congaHigh': playConga(t, vel, v, step, 'congaHigh'); break;
      case 'congaLow': playConga(t, vel, v, step, 'congaLow'); break;
      case 'hat': playHat(t, vel, v, step); break;
      case 'openHat': playOpenHat(t, vel, v, step); break;
      case 'clap': playClap(t, vel, v); break;
      case 'synth': playSynth(t, vel, v, step); break;
    }
  }

  /* ----------------------------------------------------------------------- sequencer */
  function swingDelayFraction() { return Math.max(0, 2 * E.state.swing - 1); }   // fraction of a step

  function stepLength(step) {
    const s = stepSeconds(), d = swingDelayFraction();
    return step % 2 === 0 ? s * (1 + d) : s * (1 - d);
  }

  function velocityOf(level) { return level === 2 ? 1.0 : 0.76; }

  function scheduleStep(step, baseTime) {
    const S = E.state;
    const t = baseTime + (step % 2 === 1 ? swingDelayFraction() * stepSeconds() : 0);
    const anySolo = S.voices.some(v => S.tracks[v.id].solo);
    S.voices.forEach(v => {
      const tr = S.tracks[v.id];
      if (anySolo ? !tr.solo : tr.muted) return;
      const lvl = S.pattern[v.id] && S.pattern[v.id][step];
      if (lvl > 0) trigger(v.id, t, velocityOf(lvl), step);
    });
    if (E.onStep) E.onStep(step, t);
  }

  function tick() {
    const ctx = E.ctx;
    while (E.nextTime < ctx.currentTime + LOOKAHEAD) {
      scheduleStep(E.step, E.nextTime);
      E.nextTime += stepSeconds();
      E.step = (E.step + 1) % 16;
    }
  }

  function startClock() {
    stopClock();
    try {
      const w = new Worker('clock-worker.js');
      w.onmessage = tick;
      w.postMessage('start');
      E.clock = { worker: w };
    } catch (err) {
      E.clock = { interval: setInterval(tick, TICK_MS) };
    }
  }

  function stopClock() {
    if (!E.clock) return;
    if (E.clock.worker) { E.clock.worker.postMessage('stop'); E.clock.worker.terminate(); }
    if (E.clock.interval) clearInterval(E.clock.interval);
    E.clock = null;
  }

  /* ----------------------------------------------------------------------- lifecycle */
  function init(externalCtx) {
    if (E.ctx) return E.ctx;
    const Ctor = global.AudioContext || global.webkitAudioContext;
    const ctx = externalCtx || new Ctor({ latencyHint: 'interactive' });
    E.ctx = ctx;
    buildGraph(ctx);
    if (E.profile) applyProfile(E.profile);
    return ctx;
  }

  // Must be invoked synchronously from a user-gesture handler (no await before it).
  function resume() {
    if (!E.ctx) init();
    if (E.ctx && E.ctx.state !== 'running' && E.ctx.resume) E.ctx.resume();
  }

  function start(onStep) {
    resume();
    if (E.playing) return;
    E.onStep = onStep || null;
    E.playing = true;
    E.nextTime = E.ctx.currentTime + 0.14;      // headroom for first-hit node creation / JIT warm-up
    startClock();
  }

  function pause() {
    E.playing = false;
    stopClock();
    const now = E.ctx ? E.ctx.currentTime : 0;
    if (E.activeBass) { E.activeBass.choke(now); E.activeBass = null; }
    if (E.activeOpenHat) { E.activeOpenHat.choke(now); E.activeOpenHat = null; }
  }

  function stop() { pause(); E.step = 0; }

  function latency() {
    const c = E.ctx;
    return c ? ((c.outputLatency || 0) + (c.baseLatency || 0)) : 0;
  }

  global.TVEngine = {
    VOICES, noteToFreq, transposeNote,
    state: E.state,
    init, resume, start, pause, stop, trigger, scheduleStep, applyProfile, setTempo, latency,
    get ctx() { return E.ctx; },
    get nodes() { return E.nodes; },
    get playing() { return E.playing; },
    get step() { return E.step; },
    set step(v) { E.step = v; },
    _internals: E
  };
})(typeof window !== 'undefined' ? window : globalThis);

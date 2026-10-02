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
    { id: 'synth',     isTonal: true,  baseNote: 'G3', octave: 3, tune: 0, decay: 0.22, level: 0.78, pan: 0,    color: '#a855f7', base: 0.11, chordType: 'min9' }
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
    noise: null,
    chains: {},
    metalBuf: null,
    lite: false,
    lagScore: 0,
    onLite: null,
    onState: null,
    wd: null,
    reinits: 0
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

    // Persistent per-voice FX sends (fixed amounts; muted in lite mode)
    const mkSend = (dest, amt) => { const g = ctx.createGain(); g.gain.value = amt; g.connect(dest); g.amt = amt; return g; };
    N.sendHat = mkSend(N.revSend, 0.04);
    N.sendOpen = mkSend(N.revSend, 0.06);
    N.sendClap = mkSend(N.revSend, 0.28);
    N.sendConga = mkSend(N.revSend, 0.05);
    N.sendSynthRev = mkSend(N.revSend, 0.35);
    N.sendSynthDly = mkSend(N.dlySend, 0.55);
    N.sends = [N.sendHat, N.sendOpen, N.sendClap, N.sendConga, N.sendSynthRev, N.sendSynthDly];

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

  /* ----------------------------------------------------------------------- helpers for voices
     Design rule: per-hit nodes are kept to the minimum (a source + an envelope gain, plus the few
     oscillators a voice truly needs). Filters, shapers, panners and FX sends are PERSISTENT shared
     chains, so a hit never builds (or leaves behind) a whole signal path. */
  function pannerFor(ctx, pan, dest) {
    if (ctx.createStereoPanner && pan) {
      const p = ctx.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, pan));
      p.connect(dest);
      return p;
    }
    return dest;
  }

  // Cache a persistent processing chain under `key`; rebuild only when its signature changes.
  function chainFor(key, sig, factory) {
    const c = E.chains[key];
    if (c && c.sig === sig) return c;
    if (c && c.nodes) {
      const old = c.nodes;
      setTimeout(() => old.forEach(n => { try { n.disconnect(); } catch (e) { /* gone */ } }), 2500);
    }
    const nc = factory();
    nc.sig = sig;
    E.chains[key] = nc;
    return nc;
  }

  function gainNode(ctx, value) { const g = ctx.createGain(); g.gain.value = value; return g; }
  function biquad(ctx, type, freq, q) {
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q !== undefined) f.Q.value = q; return f;
  }

  function noiseSource(t, offset) {
    const s = E.ctx.createBufferSource();
    s.buffer = E.noise; s.loop = true;
    s.start(t, offset || 0);
    return s;
  }

  // Band-limited "metallic bank": additive synthesis of the odd partials of six square waves
  // (classic analog-cymbal ratios), restricted to the hat band and to below Nyquist, plus a little
  // noise. Rendered ONCE per sample rate, then played back with a single buffer source per hit.
  function ensureMetalBuffer(ctx) {
    if (E.metalBuf && E.metalBuf.sampleRate === ctx.sampleRate) return E.metalBuf;
    const sr = ctx.sampleRate, len = Math.floor(sr * 1.5);
    const buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
    METAL_FREQS.forEach(f => {
      for (let h = 1; f * h < sr / 2 - 600; h += 2) {
        const fr = f * h;
        if (fr < 3500) continue;                       // below the hat band: removed by the HP anyway
        const w = 2 * Math.PI * fr / sr, c = Math.cos(w), s = Math.sin(w), a = (4 / Math.PI) / h;
        let re = 1, im = 0;
        for (let i = 0; i < len; i++) {
          d[i] += a * im;
          const nr = re * c - im * s; im = re * s + im * c; re = nr;
        }
      }
    });
    const rnd = mulberry32(0xBEEF);
    let peak = 0;
    for (let i = 0; i < len; i++) { d[i] += (rnd() * 2 - 1) * 0.35; const a = Math.abs(d[i]); if (a > peak) peak = a; }
    const k = 0.9 / (peak || 1);
    for (let i = 0; i < len; i++) d[i] *= k;
    E.metalBuf = buf;
    return buf;
  }

  // Sidechain: dip the ducked bus at kick time, recover with a smooth exponential.
  function duckAt(t) {
    const P = E.profile || { duckDepth: 0.5, duckRelease: 0.14 };
    const g = E.nodes.duck.gain;
    g.setTargetAtTime(P.duckDepth, t, 0.002);
    g.setTargetAtTime(1, t + 0.012, P.duckRelease / 3);
  }

  function chokeOpenHat(t) {
    if (E.activeOpenHat) { E.activeOpenHat.choke(t); E.activeOpenHat = null; }
  }

  /* ----------------------------------------------------------------------- voices */
  function kickChain(P, v) {
    const ctx = E.ctx, N = E.nodes;
    const shapeIn = gainNode(ctx, 1);
    const shaper = ctx.createWaveShaper(); shaper.curve = driveCurve(P.kickDrive); shaper.oversample = '4x';
    const hp = biquad(ctx, 'highpass', 28, 0.707);
    const clickIn = gainNode(ctx, 1);
    const bp = biquad(ctx, 'bandpass', 3200, 0.8);
    const comp = 1 / Math.sqrt(1 + 0.25 * Math.max(0, P.kickDrive - 1.5));   // heavier drive lifts the tail
    const mix = gainNode(ctx, 0.325 * comp);
    shapeIn.connect(shaper); shaper.connect(hp); hp.connect(mix);
    clickIn.connect(bp); bp.connect(mix);
    mix.connect(pannerFor(ctx, v.pan, N.dry));
    return { shapeIn, clickIn, nodes: [shapeIn, shaper, hp, clickIn, bp, mix] };
  }

  function playKick(t, vel, v) {
    const ctx = E.ctx, P = E.profile;
    const chain = chainFor('kick', P.kickDrive + '|' + v.pan, () => kickChain(P, v));
    const fEnd = noteToFreq(transposeNote(v.baseNote, v.tune));
    const decay = Math.max(0.08, v.decay);
    const peak = 0.5 + 0.5 * Math.min(1, vel * v.level / 0.95);     // level/velocity also shape the drive

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(Math.min(fEnd * 4.6, 280), t);
    osc.frequency.setTargetAtTime(fEnd * 1.04, t, 0.013);
    osc.frequency.setTargetAtTime(fEnd * 0.95, t + 0.05, decay * 0.4);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(peak, t + 0.0012);
    amp.gain.setTargetAtTime(0, t + 0.0012, decay / 4.6);        // decay = time to -40 dB
    osc.connect(amp); amp.connect(chain.shapeIn);
    osc.start(t); osc.stop(t + decay * 1.9 + 0.05);

    if (P.kickClick > 0) {
      const n = noiseSource(t, 0.1), cg = ctx.createGain();
      cg.gain.setValueAtTime(0, t);
      cg.gain.linearRampToValueAtTime(P.kickClick * 0.45 * peak, t + 0.0008);
      cg.gain.setTargetAtTime(0, t + 0.0008, 0.0016);
      n.connect(cg); cg.connect(chain.clickIn);
      n.stop(t + 0.03);
    }
    duckAt(t);
  }

  function playBass(t, vel, v, step) {
    const ctx = E.ctx, N = E.nodes, S = E.state;
    if (E.activeBass) { E.activeBass.choke(t); E.activeBass = null; }
    const chain = chainFor('bass', String(v.pan), () => {
      const sat = ctx.createWaveShaper(); sat.curve = driveCurve(1.8); sat.oversample = '2x';
      const trim = gainNode(ctx, v.base);
      sat.connect(trim); trim.connect(pannerFor(ctx, v.pan, N.duck));
      return { in: sat, nodes: [sat, trim] };
    });

    const freq = noteToFreq(transposeNote((S.pitches.bass && S.pitches.bass[step]) || v.baseNote, v.tune));
    const len = stepLength(step);
    const nextActive = S.pattern.bass && S.pattern.bass[(step + 1) % 16] > 0;
    const gate = nextActive ? len : Math.max(0.05, len * 0.82);
    const peak = v.level * vel;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(peak, t + 0.003);
    env.gain.setValueAtTime(peak, t + gate);
    env.gain.setTargetAtTime(0, t + gate, 0.010);

    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.setValueAtTime(freq, t);
    const saw = ctx.createOscillator(); saw.type = 'sawtooth'; saw.frequency.setValueAtTime(freq, t); saw.detune.value = 5;
    const lp = biquad(ctx, 'lowpass', 260 + 900 * vel, 3.5);
    lp.frequency.setTargetAtTime(200, t, 0.07);
    const sawG = gainNode(ctx, 0.34);
    sub.connect(env); saw.connect(lp); lp.connect(sawG); sawG.connect(env);
    env.connect(chain.in);

    const stopT = t + gate + 0.08;
    sub.start(t); saw.start(t); sub.stop(stopT); saw.stop(stopT);
    E.activeBass = {
      choke(now) {
        try {
          env.gain.cancelScheduledValues(now);
          env.gain.setTargetAtTime(0, now, 0.0025);
          const e = now + 0.03; sub.stop(e); saw.stop(e);
        } catch (err) { /* already stopped */ }
      }
    };
  }

  function hatChains(v) {
    const ctx = E.ctx, N = E.nodes;
    return chainFor('hat', v.timbre + '|' + v.pan, () => {
      const make = (pan) => {
        const input = gainNode(ctx, 1);
        let last;
        if (v.timbre === 'shaker') {
          const bp = biquad(ctx, 'bandpass', 6800, 0.7), hp = biquad(ctx, 'highpass', 3800);
          input.connect(bp); bp.connect(hp); last = hp;
        } else {
          const hp = biquad(ctx, 'highpass', 7000, 0.7), bp = biquad(ctx, 'bandpass', 10000, 0.8);
          input.connect(hp); hp.connect(bp); last = bp;
        }
        last.connect(N.sendHat);
        last.connect(pannerFor(ctx, pan, N.dry));
        return input;
      };
      const a = make(v.pan), b = make(-v.pan);
      return { a, b, nodes: [a, b] };
    });
  }

  function playHat(t, vel, v, step) {
    const ctx = E.ctx;
    chokeOpenHat(t);
    const chains = hatChains(v);
    const target = step % 2 === 0 ? chains.a : chains.b;
    const decay = Math.max(0.02, v.decay), tau = decay / 4.6;
    const g = ctx.createGain();
    if (v.timbre === 'shaker') {
      const n = noiseSource(t, (step * 0.137) % 1.2);
      const peak = v.base * v.level * vel * 0.40;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + 0.006);
      g.gain.setTargetAtTime(0, t + 0.006, tau);
      n.connect(g); g.connect(target);
      n.stop(t + decay * 2 + 0.02);
      return;
    }
    const src = ctx.createBufferSource();
    src.buffer = ensureMetalBuffer(ctx);
    const peak = v.base * v.level * vel * 1.85;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.0008);
    g.gain.setTargetAtTime(0, t + 0.0008, tau);
    src.connect(g); g.connect(target);
    src.start(t, (step * 0.137) % 0.9, decay * 2.2 + 0.02);
  }

  function playOpenHat(t, vel, v, step) {
    const ctx = E.ctx, N = E.nodes;
    chokeOpenHat(t);
    const chain = chainFor('openHat', String(v.pan), () => {
      const input = gainNode(ctx, 1);
      const hp = biquad(ctx, 'highpass', 6000, 0.7), bp = biquad(ctx, 'bandpass', 9000, 0.6);
      input.connect(hp); hp.connect(bp); bp.connect(N.sendOpen); bp.connect(pannerFor(ctx, v.pan, N.dry));
      return { in: input, nodes: [input, hp, bp] };
    });
    const decay = Math.max(0.12, v.decay);
    const src = ctx.createBufferSource();
    src.buffer = ensureMetalBuffer(ctx);
    const g = ctx.createGain();
    const peak = v.base * v.level * vel;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.001);
    g.gain.setTargetAtTime(peak * 0.38, t + 0.001, 0.018);
    g.gain.setTargetAtTime(0, t + 0.045, Math.max(0.02, (decay - 0.045) / 4.6));
    src.connect(g); g.connect(chain.in);
    src.start(t, (step * 0.173) % 0.9, decay * 2.2 + 0.05);
    E.activeOpenHat = {
      choke(now) {
        try {
          g.gain.cancelScheduledValues(now);
          g.gain.setTargetAtTime(0, now, 0.004);
          src.stop(now + 0.04);
        } catch (e) { /* already stopped */ }
      }
    };
  }

  function playClap(t, vel, v) {
    const ctx = E.ctx, N = E.nodes;
    const chain = chainFor('clap', String(v.pan), () => {
      const input = gainNode(ctx, 1);
      const hp = biquad(ctx, 'highpass', 520), bp = biquad(ctx, 'bandpass', 1100, 1.1);
      const air = biquad(ctx, 'peaking', 2600, 0.9); air.gain.value = 4;
      input.connect(hp); hp.connect(bp); bp.connect(air);
      air.connect(N.sendClap); air.connect(pannerFor(ctx, v.pan, N.dry));
      return { in: input, nodes: [input, hp, bp, air] };
    });
    const tail = Math.max(0.06, v.decay);
    const peak = v.base * v.level * vel;
    const n = noiseSource(t, 0.37), g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    // Four close noise bursts (~10 ms apart) followed by the decaying body
    for (let i = 0; i < 4; i++) {
      const b = t + i * 0.0105;
      g.gain.setValueAtTime(0.0001, b);
      g.gain.linearRampToValueAtTime(peak * (i === 3 ? 1 : 0.7), b + 0.0007);
      if (i < 3) g.gain.setTargetAtTime(0.0001, b + 0.0007, 0.0028);
    }
    g.gain.setTargetAtTime(0, t + 3 * 0.0105 + 0.0007, tail / 4.6);
    n.connect(g); g.connect(chain.in);
    n.stop(t + tail * 2.2 + 0.08);
  }

  function playConga(t, vel, v, step, which) {
    const ctx = E.ctx, N = E.nodes;
    const chain = chainFor(which, String(v.pan), () => {
      const input = gainNode(ctx, 1), hp = biquad(ctx, 'highpass', 70);
      const slapIn = gainNode(ctx, 1), bp = biquad(ctx, 'bandpass', which === 'congaHigh' ? 2300 : 1400, 1.4);
      input.connect(hp); slapIn.connect(bp); bp.connect(hp);
      hp.connect(N.sendConga); hp.connect(pannerFor(ctx, v.pan, N.dry));
      return { in: input, slapIn, nodes: [input, hp, slapIn, bp] };
    });
    const f0 = noteToFreq(transposeNote((E.state.pitches[which] && E.state.pitches[which][step]) || v.baseNote, v.tune));
    const decay = Math.max(0.06, v.decay), peak = v.base * v.level * vel;
    // Circular-membrane modal partials (ideal-membrane ratios) with individual decays
    [[1, 1.0, 1.0], [1.593, 0.5, 0.55], [2.136, 0.26, 0.35]].forEach(([ratio, amp, dMul]) => {
      const o = ctx.createOscillator(); o.type = 'sine';
      const f = f0 * ratio;
      o.frequency.setValueAtTime(f * 1.07, t);
      o.frequency.setTargetAtTime(f, t, 0.012);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(amp * peak, t + 0.0015);
      g.gain.setTargetAtTime(0, t + 0.0015, (decay * dMul) / 4.6);
      o.connect(g); g.connect(chain.in);
      o.start(t); o.stop(t + decay * dMul * 2 + 0.03);
    });
    const n = noiseSource(t, (step * 0.19 + (which === 'congaHigh' ? 0.05 : 0.4)) % 1.2), sg = ctx.createGain();
    sg.gain.setValueAtTime(0, t);
    sg.gain.linearRampToValueAtTime(0.55 * peak, t + 0.0008);
    sg.gain.setTargetAtTime(0, t + 0.0008, 0.0035);
    n.connect(sg); sg.connect(chain.slapIn);
    n.stop(t + 0.05);
  }

  function playSynth(t, vel, v, step) {
    const ctx = E.ctx, N = E.nodes;
    const chain = chainFor('synth', String(v.pan), () => {
      const input = gainNode(ctx, 1), hp = biquad(ctx, 'highpass', 140);
      input.connect(hp); hp.connect(N.sendSynthRev); hp.connect(N.sendSynthDly); hp.connect(pannerFor(ctx, v.pan, N.duck));
      return { in: input, nodes: [input, hp] };
    });
    const root = transposeNote((E.state.pitches.synth && E.state.pitches.synth[step]) || v.baseNote, v.tune);
    const semis = v.chordType === 'min9' ? [0, 3, 7, 10, 14] : [0, 3, 7];
    const decay = Math.max(0.05, v.decay);
    const lp = biquad(ctx, 'lowpass', 3200, 3.0);
    lp.frequency.setTargetAtTime(380, t, decay / 3);
    const g = ctx.createGain();
    const peak = v.base * v.level * vel / Math.sqrt(semis.length);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.003);
    g.gain.setTargetAtTime(0, t + 0.003, decay / 4.6);
    const stopT = t + decay * 2 + 0.05;
    semis.forEach((s, i) => {
      const f = noteToFreq(transposeNote(root, s));
      // the root gets a detuned pair for width; upper chord tones one oscillator each (lite mode: root only)
      if (E.lite && i > 0) return;
      (i === 0 ? [-9, 9] : [3]).forEach(c => {
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(f, t); o.detune.value = c;
        o.connect(lp); o.start(t); o.stop(stopT);
      });
    });
    lp.connect(g); g.connect(chain.in);
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
      if (lvl > 0 && t >= E.ctx.currentTime - 0.025) trigger(v.id, t, velocityOf(lvl), step);   // a note that is already late is dropped, not smeared
    });
    if (E.onStep) E.onStep(step, t);
  }

  function setLite(on) {
    if (E.lite === on) return;
    E.lite = on;
    if (E.nodes) E.nodes.sends.forEach(g => g.gain.setTargetAtTime(on ? 0 : g.amt, E.ctx.currentTime, 0.02));
    if (E.onLite) E.onLite(on);
  }

  // Tear the context down and build a fresh one (device lost / context stuck). Pattern state is kept.
  function reinit() {
    const old = E.ctx;
    E.ctx = null; E.nodes = null; E.chains = {}; E.metalBuf = null; E.impulses = {};
    try { if (old && old.close) old.close(); } catch (e) { /* ignore */ }
    E.activeBass = null; E.activeOpenHat = null;
    init();
    E.nextTime = E.ctx.currentTime + 0.14;
    E.wd = null;
  }

  // Detect a context whose clock stopped advancing while we are supposed to be playing.
  function watchdog(ctx) {
    const now = performance.now();
    if (!E.wd) { E.wd = { wall: now, ct: ctx.currentTime }; return false; }
    if (now - E.wd.wall < 1500) return false;
    const advanced = ctx.currentTime - E.wd.ct;
    E.wd = { wall: now, ct: ctx.currentTime };
    return advanced < 0.1;
  }

  function tick() {
    const ctx = E.ctx;
    if (!ctx || !E.playing) return;
    if (ctx.state !== 'running') {
      // suspended/interrupted: wait quietly (currentTime is frozen). A context needs a moment to resume
      // after a user gesture, so only report if it stays down for >0.7 s.
      const now = performance.now();
      if (!E.downSince) E.downSince = now;
      if (!E.suspendedReported && now - E.downSince > 700) { E.suspendedReported = true; if (E.onState) E.onState(ctx.state); }
      return;
    }
    E.downSince = 0;
    E.suspendedReported = false;
    if (watchdog(ctx)) {
      if (E.reinits < 2) { E.reinits++; reinit(); if (E.onState) E.onState('restarted'); }
      else if (E.onState) E.onState('stalled');
      return;
    }
    const sd = stepSeconds();
    const behind = ctx.currentTime - E.nextTime;
    if (behind > 0.08) {
      // The main thread stalled (GC pause, sleep, heavy tab). Skip the missed steps instead of
      // replaying them all at once, which would pile every note onto one instant and overload the graph.
      const n = Math.ceil(behind / sd);
      E.nextTime += n * sd;
      E.step = (E.step + n) % 16;
    }
    if (behind > 0.04) E.lagScore += 1; else E.lagScore = Math.max(0, E.lagScore - 0.05);
    if (E.lagScore >= 3) setLite(true);          // sustained overload: drop reverb/delay sends, thin the stab
    let guard = 6;
    while (E.nextTime < ctx.currentTime + LOOKAHEAD && guard-- > 0) {
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
    if (ctx.addEventListener) ctx.addEventListener('statechange', () => { if (ctx === E.ctx && ctx.state !== 'running' && E.playing && E.onState) E.onState(ctx.state); });
    ensureMetalBuffer(ctx);           // heavy one-off synthesis happens at init, never inside the scheduler
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
    E.lagScore = 0;
    E.wd = null;
    E.suspendedReported = false;
    E.downSince = 0;
    E.reinits = 0;
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

  function stop() { pause(); E.step = 0; setLite(false); }

  function latency() {
    const c = E.ctx;
    return c ? ((c.outputLatency || 0) + (c.baseLatency || 0)) : 0;
  }

  global.TVEngine = {
    VOICES, noteToFreq, transposeNote,
    state: E.state,
    init, resume, start, pause, stop, reinit, trigger, scheduleStep, applyProfile, setTempo, latency,
    get ctx() { return E.ctx; },
    get nodes() { return E.nodes; },
    get playing() { return E.playing; },
    get lite() { return E.lite; },
    set onLite(fn) { E.onLite = fn; },
    set onState(fn) { E.onState = fn; },
    get step() { return E.step; },
    set step(v) { E.step = v; },
    _internals: E
  };
})(typeof window !== 'undefined' ? window : globalThis);

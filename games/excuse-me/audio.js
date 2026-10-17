/* EXCUSE ME — raw Web Audio beat engine (no libraries).
   - Beat grid lives in the performance.now() domain so dance timing never depends on the audio device.
   - Look-ahead scheduler (>=150 ms) ticked by a Worker; setInterval fallback only if Workers are unavailable.
   - Persistent shared chains: hat/clap/bass buses, zone low-pass, reverb send, limiter. A hit creates only
     its source(s) and an envelope gain.
   - Band-limited oscillators only (native OscillatorNode types). Seeded noise for repeatable renders. */
'use strict';
(function () {
  const EM = window.EM;

  const STYLES = {
    /* kick/hat/clap/rim: step lists (0-15). bass: 16 entries, semitones above root or null. */
    warm:    { bpm: 120, kick: [0, 4, 8, 12], hat: [2, 6, 10, 14], clap: [4, 12], rim: [], bass: [null, null, 0, null, null, null, 0, null, null, null, 3, null, null, null, 0, 5], root: 49, pad: 0.0 },
    techno:  { bpm: 132, kick: [0, 4, 8, 12], hat: [2, 6, 10, 14], clap: [4, 12], rim: [7, 15], bass: [null, null, 0, null, null, null, 0, null, null, null, 0, null, null, null, 0, null], root: 41, pad: 0.0 },
    hard:    { bpm: 142, kick: [0, 4, 8, 12], hat: [2, 6, 10, 14, 1, 5, 9, 13], clap: [4, 12], rim: [3, 11], bass: [null, null, 0, 0, null, null, 0, 0, null, null, 0, 0, null, null, 0, 7], root: 38, pad: 0.0 },
    closing: { bpm: 124, kick: [0, 4, 8, 12], hat: [2, 6, 10, 14], clap: [], rim: [], bass: [0, null, null, null, null, null, 7, null, 5, null, null, null, 3, null, null, null], root: 43, pad: 1.0 },
    chill:   { bpm: 100, kick: [], hat: [], clap: [], rim: [], bass: [], root: 45, pad: 1.0 },
    /* variants: the DJ moves between these inside the same part of the night */
    house:   { bpm: 124, kick: [0, 4, 8, 12], hat: [2, 6, 10, 14], clap: [4, 12], rim: [7, 13], bass: [null, null, 0, null, null, null, null, 0, null, null, 3, null, null, null, 0, null], root: 45, pad: 0.6 },
    disco:   { bpm: 118, kick: [0, 4, 8, 12], hat: [2, 3, 6, 7, 10, 11, 14, 15], clap: [4, 12], rim: [], bass: [0, 12, 0, 12, 0, 12, 0, 12, 3, 15, 3, 15, 5, 17, 5, 17], root: 45, pad: 0.5 },
    trance:  { bpm: 138, kick: [0, 4, 8, 12], hat: [2, 6, 10, 14], clap: [4, 12], rim: [], bass: [null, 0, 0, 0, null, 0, 0, 0, null, 0, 0, 0, null, 0, 0, 0], root: 40, pad: 1.0 },
    acid:    { bpm: 128, kick: [0, 4, 8, 12], hat: [2, 6, 10, 14], clap: [4, 12], rim: [], bass: [0, null, 0, 12, null, 0, 3, null, 0, null, 7, null, 5, null, 3, 12], root: 38, pad: 0.0, sweep: true },
    minimal: { bpm: 126, kick: [0, 4, 8, 12], hat: [3, 7, 11, 15], clap: [], rim: [2, 6, 10, 13, 14], bass: [null, null, null, 0, null, null, null, null, null, null, 0, null, null, 5, null, null], root: 43, pad: 0.2 },
    dub:     { bpm: 140, kick: [0, 10], hat: [2, 6, 10, 14], clap: [8], rim: [], bass: [0, null, null, null, null, null, null, null, 0, null, null, null, 5, null, null, null], root: 34, pad: 0.0, wobble: true }
  };
  /* the pool of variants for each part of the night */
  const POOLS = {
    warm: ['warm', 'house', 'disco', 'house'], techno: ['techno', 'acid', 'minimal', 'techno'],
    hard: ['hard', 'trance', 'techno', 'hard', 'dub'], closing: ['closing'], chill: ['chill'],
    attic: ['trance', 'house', 'acid', 'disco']
  };
  EM.STYLES = STYLES;

  const A = EM.audio = {
    ctx: null, ready: false, style: 'warm', cat: 'warm', hold: false, lp: 18000, wet: 0.05, vol: 1.0,
    /* beat grid (performance.now seconds) */
    bpm: 120, anchorT: 0, anchorB: 0
  };

  function now() { return performance.now() / 1000; }
  A.beatPos = function () { return A.anchorB + (now() - A.anchorT) * A.bpm / 60; };
  A.beatDur = function () { return 60 / A.bpm; };
  A.setBpm = function (bpm) {
    const b = A.beatPos();
    A.anchorT = now(); A.anchorB = b; A.bpm = bpm;
  };
  A.anchorT = now();

  /* ------------------------------------------------------------ setup */
  let noiseBuf = null, bus = {}, worker = null, timer = null, nextStep = 0, nextStepT = 0, lite = false;

  A.ensure = function () {
    /* MUST be called synchronously from a user gesture handler (WebKit). */
    if (!A.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try { A.ctx = new AC({ latencyHint: 'interactive' }); } catch (e) { return false; }
      build(A.ctx);
      A.applyMute();
      startClock();
    }
    if (A.ctx.state === 'suspended') { try { A.ctx.resume(); } catch (e) { /* ignore */ } }
    return true;
  };

  function makeNoise(ctx) {
    const len = Math.floor(ctx.sampleRate * 1.0);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    const r = EM.mulberry32(0xAE51E1);
    for (let i = 0; i < len; i++) d[i] = r() * 2 - 1;
    return buf;
  }
  function makeIR(ctx, secs) {
    const len = Math.floor(ctx.sampleRate * secs);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    const r = EM.mulberry32(0x5EED);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return buf;
  }

  function build(ctx) {
    noiseBuf = makeNoise(ctx);
    const master = ctx.createGain(); master.gain.value = A.vol;
    const zoneLP = ctx.createBiquadFilter(); zoneLP.type = 'lowpass'; zoneLP.frequency.value = A.lp; zoneLP.Q.value = 0.5;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -6; limiter.knee.value = 0; limiter.ratio.value = 20; limiter.attack.value = 0.002; limiter.release.value = 0.09;
    const ceiling = ctx.createGain(); ceiling.gain.value = 0.89; /* ~ -1 dBFS */
    const mix = ctx.createGain();
    const rev = ctx.createConvolver(); rev.buffer = makeIR(ctx, 1.6);
    const revSend = ctx.createGain(); revSend.gain.value = A.wet;
    const revOut = ctx.createGain(); revOut.gain.value = 0.7;
    mix.connect(zoneLP); mix.connect(revSend); revSend.connect(rev); rev.connect(revOut); revOut.connect(zoneLP);
    zoneLP.connect(master); master.connect(limiter); limiter.connect(ceiling); ceiling.connect(ctx.destination);

    const hatBus = ctx.createBiquadFilter(); hatBus.type = 'highpass'; hatBus.frequency.value = 7000; hatBus.connect(mix);
    const clapBus = ctx.createBiquadFilter(); clapBus.type = 'bandpass'; clapBus.frequency.value = 1500; clapBus.Q.value = 0.8; clapBus.connect(mix);
    const bassBus = ctx.createBiquadFilter(); bassBus.type = 'lowpass'; bassBus.frequency.value = 420; bassBus.Q.value = 3; bassBus.connect(mix);
    const padBus = ctx.createBiquadFilter(); padBus.type = 'lowpass'; padBus.frequency.value = 1800; padBus.connect(mix);
    /* persistent chain for spatial cues (the dark room): band-pass -> panner -> master */
    const cueBP = ctx.createBiquadFilter(); cueBP.type = 'bandpass'; cueBP.frequency.value = 520; cueBP.Q.value = 2.2;
    const cuePan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (cuePan) { cueBP.connect(cuePan); cuePan.connect(master); } else cueBP.connect(master);
    bus = { cueBP: cueBP, cuePan: cuePan, master: master, zoneLP: zoneLP, mix: mix, revSend: revSend, hat: hatBus, clap: clapBus, bass: bassBus, pad: padBus, limiter: limiter };

  }

  function startClock() {
    if (window.Worker) {
      try {
        worker = new Worker('clock-worker.js');
        worker.onmessage = function () { tick(); };
      } catch (e) { worker = null; }
    }
    A.ready = true;
    nextStepT = now() + 0.05;
    nextStep = 0;
    if (worker) worker.postMessage('start'); else timer = setInterval(tick, 25);
  }

  A.applyMute = function () {
    if (!bus.master) return;
    bus.master.gain.setTargetAtTime(EM.settings.mute ? 0 : A.vol, A.ctx.currentTime, 0.05);
  };

  A.setZone = function (lp, wet) {
    A.lp = lp; A.wet = wet;
    if (!bus.zoneLP) return;
    const t = A.ctx.currentTime;
    bus.zoneLP.frequency.setTargetAtTime(lp, t, 0.12);
    bus.revSend.gain.setTargetAtTime(wet, t, 0.2);
  };
  A.setStyle = function (name) {
    const cat = POOLS[name] ? name : 'warm';
    if (cat === A.cat && STYLES[A.style]) return;
    A.cat = cat;
    useVariant(POOLS[cat][0]);
  };
  function useVariant(v) {
    A.style = v;
    const s = STYLES[v] || STYLES.warm;
    if (s.bpm !== A.bpm) A.setBpm(s.bpm);
    if (v === 'dub' && EM.hooks && EM.hooks.toast) EM.hooks.toast({ icon: 'note', text: EM.T('A wobble bass cuts through the room. Somewhere in the quiet room, ISI whispers: "FINALLY."', 'Un bajo wobble corta la sala. En algún lugar de la sala tranquila, ISI susurra: «POR FIN».', 'Um baixo wobble corta a sala. Em algum lugar da sala de calma, a ISI sussurra: «ATÉ QUE ENFIM».'), kind: 'good', ms: 5000 });
  }
  /* every few phrases the DJ moves to another record from the same part of the night (never while you are dancing) */
  let phrasesSince = 0;
  function maybeSwitch(phrase) {
    if (A.hold || lite) return;
    phrasesSince++;
    if (phrasesSince < 4 + Math.floor(EM.hash2(phrase, 3, 17) * 4)) return;
    const pool = POOLS[A.cat] || POOLS.warm;
    if (pool.length < 2) return;
    const next = pool.filter(function (v) { return v !== A.style; });
    useVariant(next[Math.floor(EM.hash2(phrase, 9, 23) * next.length) % next.length]);
    phrasesSince = 0;
  }

  /* ------------------------------------------------------------ voices */
  function tAt(perfT) { return A.ctx.currentTime + (perfT - now()); }

  function kick(t, g) {
    const c = A.ctx;
    const o = c.createOscillator(), e = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(155, t); o.frequency.exponentialRampToValueAtTime(46, t + 0.13);
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + 0.004); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(e); e.connect(bus.mix); o.start(t); o.stop(t + 0.3);
  }
  function noiseHit(t, g, len, dest, off) {
    const c = A.ctx;
    const s = c.createBufferSource(), e = c.createGain();
    s.buffer = noiseBuf;
    e.gain.setValueAtTime(g, t); e.gain.exponentialRampToValueAtTime(0.0001, t + len);
    s.connect(e); e.connect(dest); s.start(t, off || 0, len + 0.02);
  }
  function bass(t, f, len, g) {
    const c = A.ctx;
    const o = c.createOscillator(), e = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t);
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + 0.01); e.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(e); e.connect(bus.bass); o.start(t); o.stop(t + len + 0.02);
  }
  function pad(t, freqs, len, g) {
    const c = A.ctx;
    freqs.forEach(function (f) {
      const o = c.createOscillator(), e = c.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(f, t);
      e.gain.setValueAtTime(0.0001, t); e.gain.linearRampToValueAtTime(g, t + len * 0.4); e.gain.linearRampToValueAtTime(0.0001, t + len);
      o.connect(e); e.connect(bus.pad); o.start(t); o.stop(t + len + 0.05);
    });
  }
  function mtof(n) { return 440 * Math.pow(2, (n - 69) / 12); }

  A.blip = function (kind) {
    if (!A.ready || EM.settings.mute) return;
    const c = A.ctx, t = c.currentTime + 0.005;
    const o = c.createOscillator(), e = c.createGain();
    const spec = { select: [660, 880, 0.07], move: [440, 440, 0.04], bad: [180, 90, 0.18], good: [520, 1040, 0.16], warn: [300, 300, 0.12], care: [392, 784, 0.22], drink: [300, 200, 0.12] }[kind] || [500, 500, 0.05];
    o.type = 'square'; o.frequency.setValueAtTime(spec[0], t); o.frequency.linearRampToValueAtTime(spec[1], t + spec[2]);
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(0.09, t + 0.005); e.gain.exponentialRampToValueAtTime(0.0001, t + spec[2] + 0.03);
    o.connect(e); e.connect(bus.master); o.start(t); o.stop(t + spec[2] + 0.06);
  };

  /* Spatial cue: a soft breath / murmur / tap placed left or right of the listener. */
  A.cue = function (pan, gain, kind) {
    if (!A.ready || EM.settings.mute || !bus.cueBP) return;
    const c = A.ctx, t = c.currentTime + 0.01;
    if (bus.cuePan) bus.cuePan.pan.setValueAtTime(pan, t);
    if (kind === 'tap') {
      const o = c.createOscillator(), e = c.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.12);
      e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(gain, t + 0.01); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(e); e.connect(bus.master); o.start(t); o.stop(t + 0.2);
      return;
    }
    const s = c.createBufferSource(), e = c.createGain();
    s.buffer = noiseBuf;
    bus.cueBP.frequency.setValueAtTime(380 + Math.random() * 380, t);
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain * 5), t + 0.12); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    s.connect(e); e.connect(bus.cueBP); s.start(t, Math.random() * 0.4, 0.55);
  };

  /* ------------------------------------------------------------ scheduler */
  function tick() {
    if (!A.ready) return;
    const c = A.ctx;
    if (c.state !== 'running') return;
    const stepDur = 60 / A.bpm / 4;
    const horizon = now() + 0.18;
    let guard = 0;
    /* after a stall, skip missed steps instead of replaying them at once */
    if (nextStepT < now() - 0.1) {
      const missed = Math.ceil((now() - nextStepT) / stepDur);
      nextStep += missed; nextStepT += missed * stepDur;
    }
    while (nextStepT < horizon && guard++ < 8) {
      schedule(nextStep, tAt(nextStepT));
      nextStep++; nextStepT += stepDur;
    }
  }

  /* arrangement: 8-bar phrases that breathe (a break with a riser, a fill, a crash) so the room never loops flat */
  function phraseKind(phrase) {
    const r = EM.hash2(phrase, 11, 3);
    return r < 0.2 ? 'break' : (r < 0.34 ? 'groove' : 'full');
  }
  const ROOT_SHIFT = [0, 0, 3, 5, -2, 7, 0, 2];
  function schedule(step, t) {
    const st = STYLES[A.style] || STYLES.warm;
    const s16 = step % 16;
    const bar = Math.floor((step % 128) / 16);
    const phrase = Math.floor(step / 128);
    const kind = st.kick.length ? phraseKind(phrase) : 'full';
    const prevBreak = st.kick.length && step >= 128 && phraseKind(phrase - 1) === 'break';
    const lvl = lite ? 0.6 : 1;
    const inBreak = kind === 'break' && bar >= 4;
    const quiet = kind === 'groove' && bar < 2;
    if (step % 128 === 0 && step > 0) maybeSwitch(phrase);
    if (step % 128 === 0 && prevBreak && !lite) noiseHit(t, 0.3, 0.9, bus.hat, 0.05); /* crash after a break */
    if (!inBreak && st.kick.indexOf(s16) !== -1) kick(t, 0.9);
    if (st.hat.indexOf(s16) !== -1 && !quiet && !(inBreak && (s16 & 1))) noiseHit(t, 0.16 * lvl, 0.045, bus.hat, (s16 * 0.031) % 0.7);
    if (st.clap.indexOf(s16) !== -1 && !inBreak && !quiet) noiseHit(t, 0.28 * lvl, 0.11, bus.clap, 0.1);
    if (st.rim.indexOf(s16) !== -1 && !inBreak) noiseHit(t, 0.12 * lvl, 0.03, bus.clap, 0.4);
    /* the fill: a roll into the next phrase */
    if (bar === 7 && s16 >= 8 && st.kick.length) noiseHit(t, (0.05 + (s16 - 8) * 0.025) * lvl, 0.05, bus.clap, 0.2);
    if (!inBreak && !lite) {
      let bn = st.bass[s16];
      if (bn !== null && bn !== undefined && (phrase & 1) && (s16 === 12 || s16 === 14)) bn += s16 === 12 ? 5 : 7; /* alternate phrases answer back */
      if (bn !== null && bn !== undefined) {
        const root = st.root + ROOT_SHIFT[Math.floor(step / 256) % ROOT_SHIFT.length];
        const len = 60 / A.bpm / 4 * (st.wobble ? 3.4 : 1.7);
        if (st.wobble) { for (let k = 0; k < 6; k++) bus.bass.frequency.setValueAtTime(k % 2 ? 160 : 900, t + k * len / 6); bass(t, mtof(root + bn), len, 0.42); }
        else bass(t, mtof(root + bn), len, 0.35);
      }
    }
    if (st.sweep && s16 === 0) bus.bass.frequency.setTargetAtTime(260 + 900 * (0.5 + 0.5 * Math.sin(step / 96)), t, 0.4);
    if (st.pad && s16 === 0 && (step % 64) === 0) {
      const root = st.root + ROOT_SHIFT[Math.floor(step / 256) % ROOT_SHIFT.length];
      const prog = [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-5, -1, 2]][Math.floor(step / 64) % 4];
      pad(t, prog.map(function (n) { return mtof(root + 24 + n); }), 60 / A.bpm * 16, 0.05 * (inBreak ? 1.6 : 1) * (st.pad > 0.5 ? 1 : 0.7));
    } else if (inBreak && s16 === 0 && !st.pad) {
      /* a breakdown with no pad of its own borrows one */
      const root = st.root + 24;
      pad(t, [mtof(root), mtof(root + 7), mtof(root + 10)], 60 / A.bpm * 4, 0.04);
    }
  }

  /* offline helper: render n seconds of a style (used by the audio check) */
  A.renderOffline = function (style, secs) {
    const sr = 44100;
    const oc = new OfflineAudioContext(2, sr * secs, sr);
    const keep = { ctx: A.ctx, ready: A.ready, bus: bus, noise: noiseBuf, style: A.style, bpm: A.bpm };
    A.ctx = oc; build(oc);
    A.style = style; A.bpm = STYLES[style].bpm;
    const stepDur = 60 / A.bpm / 4;
    const n = Math.floor(secs / stepDur);
    for (let i = 0; i < n; i++) schedule(i, i * stepDur);
    return oc.startRendering().then(function (buf) {
      A.ctx = keep.ctx; A.ready = keep.ready; bus = keep.bus; noiseBuf = keep.noise; A.style = keep.style; A.bpm = keep.bpm;
      return buf;
    });
  };

  /* overload governor: the game calls this when frames get long */
  A.setLite = function (on) { lite = !!on; };

  /* watchdog: if the context is suspended while we are playing, try to resume once on next gesture */
  A.kick = function () {
    if (A.ctx && A.ctx.state === 'suspended') { try { A.ctx.resume(); } catch (e) { /* ignore */ } }
  };
})();

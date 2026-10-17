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
    chill:   { bpm: 100, kick: [], hat: [], clap: [], rim: [], bass: [], root: 45, pad: 1.0 }
  };
  EM.STYLES = STYLES;

  const A = EM.audio = {
    ctx: null, ready: false, style: 'warm', lp: 18000, wet: 0.05, vol: 1.0,
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
    bus = { master: master, zoneLP: zoneLP, mix: mix, revSend: revSend, hat: hatBus, clap: clapBus, bass: bassBus, pad: padBus, limiter: limiter };

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
    const s = STYLES[name] || STYLES.warm;
    A.style = name;
    if (s.bpm !== A.bpm) A.setBpm(s.bpm);
  };

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

  function schedule(step, t) {
    const st = STYLES[A.style] || STYLES.warm;
    const s16 = step % 16;
    const lvl = lite ? 0.6 : 1;
    if (st.kick.indexOf(s16) !== -1) kick(t, 0.9);
    if (st.hat.indexOf(s16) !== -1) noiseHit(t, 0.16 * lvl, 0.045, bus.hat, (s16 * 0.031) % 0.7);
    if (st.clap.indexOf(s16) !== -1) noiseHit(t, 0.28 * lvl, 0.11, bus.clap, 0.1);
    if (st.rim.indexOf(s16) !== -1) noiseHit(t, 0.12 * lvl, 0.03, bus.clap, 0.4);
    const bn = st.bass[s16];
    if (bn !== null && bn !== undefined && !lite) bass(t, mtof(st.root + bn), 60 / A.bpm / 4 * 1.7, 0.35);
    if (st.pad && s16 === 0 && (step % 64) === 0) {
      const prog = [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-5, -1, 2]][Math.floor(step / 64) % 4];
      pad(t, prog.map(function (n) { return mtof(st.root + 24 + n); }), 60 / A.bpm * 16, 0.05);
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

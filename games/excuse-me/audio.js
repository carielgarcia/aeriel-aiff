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
    /* 8-bit peak-time records: hardgroove (rolling, shuffled) and trance (arps over a gated pad). `lead` = pulse-wave voice, semitones above the root + 2 octaves. */
    hg1:     { bpm: 148, kick: [0, 4, 8, 12], hat: [2, 3, 6, 10, 11, 14], clap: [4, 12], rim: [7, 10, 15], bass: [null, 0, 0, null, null, 0, 0, null, null, 0, 0, null, null, 0, 3, 5], root: 36, pad: 0.0, lead: [null, null, 12, null, null, null, 12, 15, null, null, 12, null, null, 10, null, 12], leadLen: 1.2 },
    hg2:     { bpm: 152, kick: [0, 4, 8, 12, 15], hat: [1, 3, 5, 7, 9, 11, 13, 15], clap: [4, 12], rim: [2, 6, 10, 14], bass: [0, null, 0, 0, null, 0, null, 0, 0, null, 0, 0, null, 0, 5, null], root: 37, pad: 0.0, lead: [12, null, null, 15, null, null, 12, null, 17, null, null, 15, null, 12, null, null], leadLen: 1.5, sweep: true },
    tr1:     { bpm: 138, kick: [0, 4, 8, 12], hat: [2, 6, 10, 14], clap: [4, 12], rim: [], bass: [null, 0, 0, 0, null, 0, 0, 0, null, 0, 0, 0, null, 0, 0, 0], root: 40, pad: 1.0, lead: [0, 7, 12, 7, 0, 7, 12, 7, 3, 10, 15, 10, 3, 10, 15, 10], leadLen: 0.9 },
    tr2:     { bpm: 142, kick: [0, 4, 8, 12], hat: [2, 6, 10, 14, 15], clap: [4, 12], rim: [], bass: [null, 0, 0, null, null, 0, 0, null, null, 0, 0, null, null, 0, 0, null], root: 38, pad: 1.0, lead: [12, null, 15, null, 19, null, 15, null, 17, null, 14, null, 12, null, 10, null], leadLen: 2.2 },
    dub:     { bpm: 140, kick: [0, 10], hat: [2, 6, 10, 14], clap: [8], rim: [], bass: [0, null, null, null, null, null, null, null, 0, null, null, null, 5, null, null, null], root: 34, pad: 0.0, wobble: true },
    /* FRAMES SHELL (Sala 2, before 02:30): groovy techno & 90s trance */
    fs1:     {
      bpm: 132, root: 41, swing: 0.11,
      kick: [0, 4, 8, 12], kickStart: 150, kickEnd: 45, kickSweep: 0.12, kickDecay: 0.27, kickLevel: 0.9,
      hat: [2, 3, 6, 7, 10, 11, 14, 15], hatAccent: [2, 6, 10, 14], hatGain: 0.13, hatLen: 0.038,
      clap: [4, 12], clapGain: 0.22,
      rim: [3, 6, 9, 14, 15], rimFreq: 2100, rimQ: 1.9, rimPitch: 560, rimGain: 0.13,
      bass: [0, null, 0, 12, null, 0, null, 3, 0, null, 0, null, 5, null, 3, 0],
      bassWave: 'sawtooth', bassCut: 360, bassQ: 3.4, bassSteps: 1.35, bassGain: 0.34, bassExact: true,
      chords: [null, null, null, 0.8, null, null, null, null, null, null, 0.7, null, null, 0.6, null, null],
      prog: [[0, 3, 7, 10], [0, 3, 7, 10], [3, 7, 10, 14], [-2, 2, 5, 9]], progSteps: 32,
      chordWave: 'sawtooth', chordOct: 24, chordLen: 0.085, chordGain: 0.034, padCut: 1400, pad: 0.0
    },
    fs2:     {
      bpm: 134, root: 39, swing: 0.13,
      kick: [0, 4, 8, 12], kickStart: 158, kickEnd: 44, kickSweep: 0.13, kickDecay: 0.29, kickLevel: 0.9,
      hat: [1, 2, 5, 6, 9, 10, 13, 14], hatAccent: [2, 6, 10, 14], hatGain: 0.13, hatLen: 0.04,
      clap: [4, 12], clapGain: 0.20,
      rim: [2, 7, 10, 13, 15], rimFreq: 1850, rimQ: 2.0, rimPitch: 490, rimGain: 0.14,
      bass: [null, 0, 0, null, null, 0, 7, null, null, 0, 0, null, null, 3, null, 5, null, 0, 0, null, null, 0, 7, null, null, 0, 0, null, 10, null, 7, 3],
      bassWave: 'sawtooth', bassCut: 340, bassQ: 3.8, bassSteps: 1.4, bassGain: 0.35, bassExact: true,
      chords: [null, null, null, null, null, null, 0.9, null, null, null, null, null, null, null, null, 0.75],
      prog: [[0, 3, 7, 10], [0, 3, 7, 10], [-2, 2, 5, 9], [-4, 0, 3, 7]], progSteps: 32,
      chordWave: 'triangle', chordOct: 24, chordLen: 0.14, chordGain: 0.045, padCut: 1650, pad: 0.25, padSteps: 64
    },
    fs3:     {
      bpm: 138, root: 42, shifts: [0],
      kick: [0, 4, 8, 12], kickStart: 155, kickEnd: 47, kickSweep: 0.12, kickDecay: 0.27, kickLevel: 0.9,
      hat: [2, 3, 6, 7, 10, 11, 14, 15], hatAccent: [2, 6, 10, 14], hatGain: 0.15, hatLen: 0.046,
      clap: [4, 12], clapGain: 0.26, rim: [],
      bass: [null, 0, 12, 0, null, 0, 12, 0, null, 0, 12, 0, null, 0, 12, 0],
      bassWave: 'sawtooth', bassCut: 680, bassQ: 2.2, bassSteps: 1.25, bassGain: 0.31, bassExact: true,
      bassFollowsProg: true, bassProgRoots: [0, -4, 3, -2],
      prog: [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]], progSteps: 16,
      lead: [12, null, 7, 10, 12, null, 15, null, 14, null, 12, 10, 7, null, 10, null, 12, null, 15, 19, 15, null, 14, null, 12, null, 10, 7, 10, null, 12, null],
      leadWave: 'sawtooth', leadCut: 3600, leadQ: 1.4, leadLen: 1.6, leadGain: 0.048,
      pad: 0.95, padSteps: 16, padCut: 2100
    },
    /* APÜD (Sala 2, 02:30 onward): HardBounce, Hard Trance, Hard Techno */
    ap1:     {
      bpm: 148, root: 38,
      kick: [0, 4, 8, 12], kickStart: 170, kickEnd: 48, kickSweep: 0.11, kickDecay: 0.25, kickLevel: 0.92,
      hat: [2, 6, 10, 14, 15], hatAccent: [2, 6, 10, 14], hatGain: 0.17, hatLen: 0.042,
      clap: [4, 12], clapGain: 0.30, clapLen: 0.10,
      rim: [7, 15], rimFreq: 2600, rimQ: 1.6, rimPitch: 620, rimGain: 0.11,
      bass: [null, null, 0, 12, null, null, 7, 12, null, null, 0, 12, null, null, 7, 15, null, null, 0, 12, null, null, 7, 12, null, null, 5, 12, null, null, 7, 10],
      bassWave: 'square', bassCut: 1150, bassQ: 4.2, bassSteps: 1.1, bassPunch: 1.55, bassGain: 0.31, bassExact: true,
      lead: [0, null, 12, null, 7, null, 10, 12, null, null, 15, null, 12, null, 10, 7, 0, null, 12, null, 7, null, 10, 12, 15, null, 17, null, 15, null, 12, 10],
      leadWave: 'square', leadCut: 4800, leadQ: 0.8, leadLen: 1.15, leadGain: 0.046,
      chords: [null, null, 0.7, null, null, null, 0.7, null, null, null, 0.7, null, null, null, 0.8, null],
      prog: [[0, 3, 7], [0, 3, 7], [-2, 2, 5], [-4, 0, 3]], progSteps: 16,
      chordWave: 'sawtooth', chordOct: 24, chordLen: 0.10, chordGain: 0.032, pad: 0.0
    },
    ap2:     {
      bpm: 145, root: 40, shifts: [0, 0, 3, 0], sweep: true,
      kick: [0, 4, 8, 12], kickStart: 175, kickEnd: 46, kickSweep: 0.12, kickDecay: 0.27, kickLevel: 0.94,
      hat: [2, 3, 6, 7, 10, 11, 14, 15], hatAccent: [2, 6, 10, 14], hatGain: 0.16, hatLen: 0.044,
      clap: [4, 12], clapGain: 0.28, rim: [],
      bass: [null, 0, 0, 12, null, 0, 0, 12, null, 0, 0, 12, null, 0, 3, 7],
      bassWave: 'sawtooth', bassCut: 780, bassQ: 4.8, bassSteps: 1.1, bassGain: 0.33, bassExact: true,
      lead: [12, null, null, 15, null, null, 19, null, 17, null, 15, null, 14, null, 12, null, 12, null, null, 15, null, null, 19, null, 22, null, 19, null, 17, null, 15, 14],
      leadWave: 'sawtooth', leadCut: 4400, leadQ: 1.6, leadLen: 2.1, leadGain: 0.050,
      prog: [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [0, 3, 7]], progSteps: 16,
      pad: 0.9, padSteps: 16, padCut: 2200
    },
    ap3:     {
      bpm: 152, root: 36,
      kick: [0, 4, 8, 12], kickStart: 185, kickEnd: 48, kickSweep: 0.10, kickDecay: 0.25, kickLevel: 0.95,
      hat: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15], hatAccent: [2, 6, 10, 14], hatGain: 0.15, hatLen: 0.036,
      clap: [4, 12], clapGain: 0.34, clapLen: 0.12,
      rim: [3, 11, 15], rimFreq: 2800, rimQ: 2.2, rimGain: 0.13,
      bass: [null, 0, 0, 0, null, 0, 0, 0, null, 0, 0, 0, null, 0, 1, 0],
      bassWave: 'sawtooth', bassCut: 330, bassQ: 4.5, bassSteps: 1.35, bassGain: 0.38, bassExact: true,
      chords: [null, null, null, 0.85, null, null, 0.65, null, null, null, null, null, null, 0.8, null, null, null, null, null, 0.85, null, null, 0.65, null, null, null, 0.75, null, null, null, 0.9, null],
      prog: [[0, 1, 7], [0, 6, 7], [0, 1, 7], [0, 3, 6]], progSteps: 16,
      chordWave: 'square', chordOct: 24, chordLen: 0.075, chordGain: 0.034, padCut: 1900, pad: 0.0
    },
    /* THE AFTER: Hypnotic Techno, Hardgroove, Bossa Nova */
    af_hyp1: {
      bpm: 129, root: 38, noFill: true, crashGain: 0.25,
      kick: [0, 4, 8, 12], kickStart: 132, kickEnd: 43, kickSweep: 0.13, kickDecay: 0.30, kickLevel: 0.84,
      hat: [2, 6, 10, 14], hatGain: 0.10, hatLen: 0.04, clap: [],
      rim: [3, 10, 14], rimFreq: 1900, rimQ: 2.5, rimPitch: 440, rimGain: 0.08,
      bass: [null, null, 0, null, null, 0, null, null, null, null, 0, null, null, 0, null, 7],
      bassWave: 'triangle', bassCut: 280, bassQ: 1.6, bassSteps: 2.1, bassGain: 0.38, bassExact: true,
      lead: [0, null, null, 7, null, null, 10, null, null, 12, null, null, 7, null, null, 3, null, null, 0, null, null, 7, null, null, 14, null, null, 12, null, null, 10, null],
      leadWave: 'sine', leadCut: 2600, leadQ: 0.7, leadLen: 1.8, leadAttack: 0.008, leadGain: 0.055,
      prog: [[0, 7, 10], [-2, 5, 9], [0, 3, 7], [-5, 2, 5]], pad: 0.85, padSteps: 64, padCut: 1100
    },
    af_hyp2: {
      bpm: 131, root: 41, noFill: true, crashGain: 0.25,
      kick: [0, 4, 8, 12], kickStart: 138, kickEnd: 44, kickSweep: 0.14, kickDecay: 0.31, kickLevel: 0.85,
      hat: [2, 6, 10, 14, 15], hatGain: 0.095, hatLen: 0.035, clap: [],
      rim: [5, 11], rimFreq: 1650, rimQ: 2.8, rimPitch: 380, rimGain: 0.09,
      bass: [null, 0, null, 0, null, null, 0, null, null, 0, null, 0, null, null, 5, null],
      bassWave: 'sawtooth', bassCut: 250, bassQ: 3.2, bassSteps: 1.9, bassGain: 0.36, bassExact: true,
      lead: [12, null, null, null, null, 10, null, null, 7, null, null, 10, null, null, null, null, 15, null, null, null, null, 12, null, null, 10, null, 7, null, 3, null, null, null],
      leadWave: 'triangle', leadCut: 2200, leadQ: 1.1, leadLen: 2.4, leadAttack: 0.012, leadGain: 0.055,
      prog: [[0, 3, 10], [-2, 5, 9], [-4, 3, 7], [-5, 0, 7]], pad: 0.8, padSteps: 64, padCut: 950
    },
    af_hg1:  {
      bpm: 136, root: 40, swing: 0.12,
      kick: [0, 4, 8, 12], kickStart: 160, kickEnd: 46, kickSweep: 0.12, kickDecay: 0.26, kickLevel: 0.9,
      hat: [2, 3, 6, 7, 10, 11, 14, 15], hatAccent: [2, 6, 10, 14], hatGain: 0.15, hatLen: 0.04,
      clap: [4, 12], clapGain: 0.25, clapLen: 0.09,
      rim: [2, 5, 7, 10, 13, 15], rimFreq: 2350, rimQ: 2.1, rimPitch: 640, rimGain: 0.14,
      bass: [null, 0, 12, null, null, 0, 7, null, null, 0, 12, null, 3, null, 5, 7],
      bassWave: 'sawtooth', bassCut: 520, bassQ: 3.4, bassSteps: 1.15, bassGain: 0.34, bassExact: true,
      chords: [null, null, 0.8, null, null, 0.65, null, null, null, null, 0.8, null, null, null, 0.9, null],
      prog: [[0, 3, 7, 10], [0, 3, 7, 10], [2, 5, 9, 12], [-2, 2, 5, 9]], progSteps: 16,
      chordWave: 'sawtooth', chordOct: 24, chordLen: 0.08, chordGain: 0.032, padCut: 1550, pad: 0.0
    },
    af_hg2:  {
      bpm: 138, root: 38, swing: 0.10,
      kick: [0, 4, 8, 12, 15], kickStart: 164, kickEnd: 46, kickSweep: 0.11, kickDecay: 0.25, kickLevel: 0.9,
      hat: [1, 2, 5, 6, 9, 10, 13, 14], hatAccent: [2, 6, 10, 14], hatGain: 0.15, hatLen: 0.038,
      clap: [4, 12], clapGain: 0.26, clapLen: 0.095,
      rim: [3, 6, 9, 11, 14], rimFreq: 2500, rimQ: 1.9, rimPitch: 580, rimGain: 0.14,
      bass: [0, null, 0, 12, null, 0, null, 7, 0, null, 0, 12, null, 3, 5, null, 0, null, 0, 12, null, 0, null, 7, 0, null, 10, null, 7, null, 5, 3],
      bassWave: 'sawtooth', bassCut: 560, bassQ: 3.2, bassSteps: 1.2, bassGain: 0.34, bassExact: true,
      chords: [null, null, null, 0.8, null, null, null, null, null, 0.7, null, null, null, null, 0.85, null],
      prog: [[0, 3, 7, 10], [-2, 2, 5, 9], [3, 7, 10, 14], [0, 3, 7, 10]], progSteps: 16,
      chordWave: 'triangle', chordOct: 24, chordLen: 0.10, chordGain: 0.042, padCut: 1750, pad: 0.0
    },
    af_bossa: {
      bpm: 104, root: 41, patLen: 32, shifts: [0], noFill: true, crashGain: 0.12,
      kick: [0, 6, 8, 14, 16, 22, 24, 30], kickStart: 98, kickEnd: 42, kickSweep: 0.09, kickDecay: 0.34, kickLevel: 0.56,
      hat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], hatAccent: [2, 6, 10, 14, 18, 22, 26, 30], hatGain: 0.055, hatLen: 0.055,
      clap: [],
      rim: [0, 6, 12, 22, 28], rimFreq: 2100, rimQ: 2.2, rimPitch: 840, rimLen: 0.025, rimGain: 0.13,
      bass: [0, null, null, null, null, null, null, null, 7, null, null, null, null, null, null, null],
      bassWave: 'triangle', bassCut: 260, bassQ: 1.0, bassSteps: 2.3, bassGain: 0.40, bassExact: true,
      bassFollowsProg: true, bassProgRoots: [0, 2, -1, 4, -3, 2, 2, -5],
      chords: [0.95, null, null, 0.7, null, null, 0.9, null, null, null, 0.85, null, 0.8, null, null, null, 0.9, null, null, 0.7, null, null, 0.85, null, null, null, 0.8, null, 0.85, null, null, null],
      prog: [[0, 4, 7, 11], [2, 6, 9, 12], [-1, 2, 5, 9], [4, 8, 11, 14], [-3, 0, 4, 7], [2, 6, 9, 12], [2, 5, 9, 12], [-5, -1, 2, 5]],
      progSteps: 16, chordWave: 'triangle', chordOct: 12, chordLen: 0.24, chordGain: 0.044, padCut: 1500,
      lead: [
        7, null, null, 9, null, null, 7, null, null, null, 4, null, null, null, null, null,
        6, null, null, 9, null, null, 6, null, null, null, 4, null, null, null, null, null,
        5, null, null, 9, null, null, 5, null, null, null, 2, null, null, null, null, null,
        4, null, null, 8, null, null, 4, null, null, null, 2, null, null, null, null, null,
        0, null, null, 4, null, null, 7, null, null, null, 9, null, null, null, null, null,
        9, null, null, 6, null, null, 4, null, null, null, 2, null, null, null, null, null,
        5, null, null, 7, null, null, 5, null, null, null, 2, null, null, null, null, null,
        4, null, null, 2, null, null, 0, null, null, null, null, null, null, null, null, null
      ],
      leadWave: 'triangle', leadCut: 2800, leadQ: 0.6, leadLen: 2.2, leadAttack: 0.018, leadGain: 0.055,
      pad: 0.0
    }
  };
  /* the pool of variants for each part of the night */
  const POOLS = {
    warm: ['warm', 'house', 'disco', 'house'], techno: ['techno', 'acid', 'minimal', 'techno'],
    hard: ['hard', 'hg1', 'tr1', 'trance', 'hg2', 'tr2', 'techno', 'dub'], closing: ['closing'], chill: ['chill'],
    attic: ['trance', 'tr2', 'house', 'hg2', 'acid', 'disco'],
    frames: ['fs1', 'fs2', 'fs3'],
    apud: ['ap1', 'ap2', 'ap3'],
    after: ['af_hyp1', 'af_hg1', 'af_hyp2', 'af_hg2', 'af_bossa'],
    after_hypnotic: ['af_hyp1', 'af_hyp2'],
    after_hardgroove: ['af_hg1', 'af_hg2'],
    after_bossa: ['af_bossa']
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

  let appliedStyle = null;
  function applyStyleBus(s, t, immediate) {
    if (!A.ctx || !bus.bass) return;
    const bassFreq = s.bassCut || 420;
    const bassQ = s.bassQ !== undefined ? s.bassQ : 3;
    const leadFreq = s.leadCut || 4600;
    const leadQ = s.leadQ !== undefined ? s.leadQ : 0.6;
    const padFreq = s.padCut || 1800;
    const rimFreq = s.rimFreq || 2400;
    const rimQ = s.rimQ !== undefined ? s.rimQ : 1.8;
    if (immediate) {
      if (!s.sweep && !s.wobble) bus.bass.frequency.value = bassFreq;
      bus.bass.Q.value = bassQ;
      bus.lead.frequency.value = leadFreq;
      bus.lead.Q.value = leadQ;
      bus.pad.frequency.value = padFreq;
      if (bus.rim) { bus.rim.frequency.value = rimFreq; bus.rim.Q.value = rimQ; }
    } else {
      if (!s.sweep && !s.wobble) bus.bass.frequency.setTargetAtTime(bassFreq, t, 0.05);
      bus.bass.Q.setTargetAtTime(bassQ, t, 0.05);
      bus.lead.frequency.setTargetAtTime(leadFreq, t, 0.05);
      bus.lead.Q.setTargetAtTime(leadQ, t, 0.05);
      bus.pad.frequency.setTargetAtTime(padFreq, t, 0.05);
      if (bus.rim) { bus.rim.frequency.setTargetAtTime(rimFreq, t, 0.05); bus.rim.Q.setTargetAtTime(rimQ, t, 0.05); }
    }
    appliedStyle = A.style;
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
    const rimBus = ctx.createBiquadFilter(); rimBus.type = 'bandpass'; rimBus.frequency.value = 2400; rimBus.Q.value = 1.8; rimBus.connect(mix);
    const bassBus = ctx.createBiquadFilter(); bassBus.type = 'lowpass'; bassBus.frequency.value = 420; bassBus.Q.value = 3; bassBus.connect(mix);
    const leadBus = ctx.createBiquadFilter(); leadBus.type = 'lowpass'; leadBus.frequency.value = 4600; leadBus.Q.value = 0.6; leadBus.connect(mix);
    const padBus = ctx.createBiquadFilter(); padBus.type = 'lowpass'; padBus.frequency.value = 1800; padBus.connect(mix);
    /* persistent chain for spatial cues (the dark room): band-pass -> panner -> master */
    const cueBP = ctx.createBiquadFilter(); cueBP.type = 'bandpass'; cueBP.frequency.value = 520; cueBP.Q.value = 2.2;
    const cuePan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (cuePan) { cueBP.connect(cuePan); cuePan.connect(master); } else cueBP.connect(master);
    bus = { cueBP: cueBP, cuePan: cuePan, master: master, zoneLP: zoneLP, mix: mix, revSend: revSend, hat: hatBus, clap: clapBus, rim: rimBus, bass: bassBus, pad: padBus, lead: leadBus, limiter: limiter };
    appliedStyle = null;
    applyStyleBus(STYLES[A.style] || STYLES.warm, ctx.currentTime, true);
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
  let phrasesSince = 0;
  A.setStyle = function (name) {
    if (POOLS[name]) {
      if (name === A.cat && STYLES[A.style]) return;
      A.cat = name;
      phrasesSince = 0;
      useVariant(POOLS[name][0]);
      return;
    }
    if (STYLES[name]) {
      if (name === A.cat && A.style === name) return;
      A.cat = name;
      phrasesSince = 0;
      useVariant(name);
      return;
    }
    if (A.cat === 'warm' && STYLES[A.style]) return;
    A.cat = 'warm';
    phrasesSince = 0;
    useVariant('warm');
  };
  function useVariant(v) {
    A.style = v;
    const s = STYLES[v] || STYLES.warm;
    if (s.bpm !== A.bpm) A.setBpm(s.bpm);
    if (A.ctx && bus.bass) applyStyleBus(s, A.ctx.currentTime, false);
    if (v === 'dub' && EM.hooks && EM.hooks.toast) EM.hooks.toast({ icon: 'note', text: EM.T('A wobble bass cuts through the room. Somewhere in the quiet room, ISI whispers: "FINALLY."', 'Un bajo wobble corta la sala. En algún lugar de la sala tranquila, ISI susurra: «POR FIN».', 'Um baixo wobble corta a sala. Em algum lugar da sala de calma, a ISI sussurra: «ATÉ QUE ENFIM».'), kind: 'good', ms: 5000 });
  }
  /* every few phrases the DJ moves to another record from the same part of the night (never while you are dancing) */
  function maybeSwitch(phrase) {
    if (A.hold || lite) return;
    phrasesSince++;
    if (phrasesSince < 4 + Math.floor(EM.hash2(phrase, 3, 17) * 4)) return;
    const pool = POOLS[A.cat];
    if (!pool || pool.length < 2) return;
    const next = pool.filter(function (v) { return v !== A.style; });
    useVariant(next[Math.floor(EM.hash2(phrase, 9, 23) * next.length) % next.length]);
    phrasesSince = 0;
  }

  /* ------------------------------------------------------------ voices */
  function tAt(perfT) { return A.ctx.currentTime + (perfT - now()); }

  function kick(t, g, st) {
    const c = A.ctx;
    const start = (st && st.kickStart) || 155;
    const end = (st && st.kickEnd) || 46;
    const sweep = (st && st.kickSweep) || 0.13;
    const decay = (st && st.kickDecay) || 0.28;
    const o = c.createOscillator(), e = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(start, t); o.frequency.exponentialRampToValueAtTime(end, t + sweep);
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + 0.004); e.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(e); e.connect(bus.mix); o.start(t); o.stop(t + decay + 0.02);
  }
  function noiseHit(t, g, len, dest, off) {
    const c = A.ctx;
    const s = c.createBufferSource(), e = c.createGain();
    s.buffer = noiseBuf;
    e.gain.setValueAtTime(g, t); e.gain.exponentialRampToValueAtTime(0.0001, t + len);
    s.connect(e); e.connect(dest); s.start(t, off || 0, len + 0.02);
  }
  function rimHit(t, g, st) {
    const c = A.ctx;
    noiseHit(t, g, (st && st.rimLen) || 0.028, bus.rim || bus.clap, 0.42);
    if (st && st.rimPitch) {
      const o = c.createOscillator(), e = c.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(st.rimPitch, t);
      o.frequency.exponentialRampToValueAtTime(st.rimPitch * 0.72, t + 0.018);
      e.gain.setValueAtTime(0.0001, t);
      e.gain.exponentialRampToValueAtTime(g * 0.9, t + 0.002);
      e.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
      o.connect(e); e.connect(bus.rim || bus.clap); o.start(t); o.stop(t + 0.05);
    }
  }
  function bass(t, f, len, g, wave, punch) {
    const c = A.ctx;
    const o = c.createOscillator(), e = c.createGain();
    o.type = wave || 'sawtooth';
    if (punch && punch > 1) {
      o.frequency.setValueAtTime(f * punch, t);
      o.frequency.exponentialRampToValueAtTime(f, t + 0.018);
    } else {
      o.frequency.setValueAtTime(f, t);
    }
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + 0.01); e.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(e); e.connect(bus.bass); o.start(t); o.stop(t + len + 0.02);
  }
  /* the 8-bit / melodic lead: native oscillator (band-limited), pluck or lyrical envelope */
  function lead(t, f, len, g, wave, atk) {
    const c = A.ctx;
    const o = c.createOscillator(), e = c.createGain();
    const a = Math.min(atk || 0.005, len * 0.4);
    o.type = wave || 'square'; o.frequency.setValueAtTime(f, t);
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + a); e.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(e); e.connect(bus.lead); o.start(t); o.stop(t + len + 0.02);
  }
  function chordPluck(t, freqs, len, g, wave) {
    const c = A.ctx;
    const vg = g / Math.sqrt(Math.max(1, freqs.length));
    freqs.forEach(function (f) {
      const o = c.createOscillator(), e = c.createGain();
      o.type = wave || 'triangle'; o.frequency.setValueAtTime(f, t);
      e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(vg, t + 0.006); e.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(e); e.connect(bus.pad); o.start(t); o.stop(t + len + 0.03);
    });
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
    if (appliedStyle !== A.style && bus.bass) applyStyleBus(st, t, false);
    const stepDur = 60 / A.bpm / 4;
    const s16 = step % 16;
    const pStep = st.patLen ? (step % st.patLen) : s16;
    const sw = (st.swing && (step & 1)) ? stepDur * st.swing : 0;
    const bar = Math.floor((step % 128) / 16);
    const phrase = Math.floor(step / 128);
    const kind = st.kick.length ? phraseKind(phrase) : 'full';
    const prevBreak = st.kick.length && step >= 128 && phraseKind(phrase - 1) === 'break';
    const lvl = lite ? 0.6 : 1;
    const inBreak = kind === 'break' && bar >= 4;
    const quiet = kind === 'groove' && bar < 2;
    if (step % 128 === 0 && step > 0) maybeSwitch(phrase);
    if (step % 128 === 0 && prevBreak && !lite) noiseHit(t, 0.3 * (st.crashGain !== undefined ? st.crashGain : 1), 0.9, bus.hat, 0.05); /* crash after a break */
    if (!inBreak && st.kick.indexOf(pStep) !== -1) kick(t, st.kickLevel !== undefined ? st.kickLevel : 0.9, st);
    const hatBase = st.hatGain !== undefined ? st.hatGain : 0.16;
    if (st.hat.indexOf(pStep) !== -1 && !quiet && !(inBreak && (s16 & 1))) {
      const acc = st.hatAccent && st.hatAccent.indexOf(pStep) !== -1;
      const hg = (acc ? hatBase * 1.35 : hatBase) * lvl;
      const hlen = acc && !st.hatLen ? 0.085 : (acc && st.hatLen ? st.hatLen * 1.45 : (st.hatLen || 0.045));
      noiseHit(t + sw, hg, hlen, bus.hat, (s16 * 0.031) % 0.7);
    }
    if (st.clap.indexOf(pStep) !== -1 && !inBreak && !quiet) noiseHit(t, (st.clapGain !== undefined ? st.clapGain : 0.28) * lvl, st.clapLen || 0.11, bus.clap, 0.1);
    if (st.rim.indexOf(pStep) !== -1 && !inBreak) {
      if (st.rimFreq || st.rimPitch) rimHit(t + sw, (st.rimGain !== undefined ? st.rimGain : 0.14) * lvl, st);
      else noiseHit(t, 0.12 * lvl, 0.03, bus.clap, 0.4);
    }
    /* the fill: a roll into the next phrase */
    if (bar === 7 && s16 >= 8 && st.kick.length && !st.noFill) noiseHit(t, (0.05 + (s16 - 8) * 0.025) * lvl, 0.05, bus.clap, 0.2);

    const shifts = st.shifts || ROOT_SHIFT;
    const root = st.root + shifts[Math.floor(step / 256) % shifts.length];
    const progList = st.prog || [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-5, -1, 2]];
    const progSteps = st.progSteps || 16;
    const curChord = progList[Math.floor(step / progSteps) % progList.length];

    if (!inBreak && !lite && st.bass.length) {
      let bn = st.bass[step % st.bass.length];
      if (bn !== null && bn !== undefined && !st.bassExact && (phrase & 1) && (s16 === 12 || s16 === 14)) bn += s16 === 12 ? 5 : 7; /* alternate phrases answer back */
      if (bn !== null && bn !== undefined) {
        let bNote = root + (st.bassOct || 0) + bn;
        if (st.bassFollowsProg) {
          const prIdx = Math.floor(step / progSteps) % progList.length;
          const prOff = st.bassProgRoots ? st.bassProgRoots[prIdx % st.bassProgRoots.length] : curChord[0];
          if (bn === 7 && curChord.length >= 3 && curChord[2] - prOff === 6) bNote -= 1;
          bNote += prOff;
        }
        const len = st.wobble ? stepDur * 3.4 : (st.bassLen ? st.bassLen : stepDur * (st.bassSteps || 1.7));
        const bg = st.bassGain !== undefined ? st.bassGain : 0.35;
        if (st.wobble) { for (let k = 0; k < 6; k++) bus.bass.frequency.setValueAtTime(k % 2 ? 160 : 900, t + k * len / 6); bass(t, mtof(bNote), len, 0.42, st.bassWave); }
        else bass(t + sw, mtof(bNote), len, bg, st.bassWave, st.bassPunch);
      }
    }
    if (st.chords && !lite && st.chords.length) {
      const cv = st.chords[step % st.chords.length];
      if (cv) {
        const cOct = st.chordOct !== undefined ? st.chordOct : 24;
        const cLen = st.chordLen ? st.chordLen : stepDur * 1.5;
        const cGain = (st.chordGain !== undefined ? st.chordGain : 0.04) * (typeof cv === 'number' ? cv : 1) * (inBreak ? 1.25 : 1);
        chordPluck(t + sw, curChord.map(function (n) { return mtof(root + cOct + n); }), cLen, cGain, st.chordWave);
      }
    }
    if (st.lead && !lite && st.lead.length) {
      const ln = st.lead[step % st.lead.length];
      if (ln !== null && ln !== undefined && !quiet) {
        const lroot = root + (st.leadOct !== undefined ? st.leadOct : 24);
        const lg = (st.leadGain !== undefined ? st.leadGain : 0.05) * (inBreak ? 1.5 : 1);
        lead(t + sw, mtof(lroot + ln), stepDur * (st.leadLen || 1.2), lg, st.leadWave, st.leadAttack);
      }
    }
    if (st.sweep && s16 === 0) bus.bass.frequency.setTargetAtTime(260 + 900 * (0.5 + 0.5 * Math.sin(step / 96)), t, 0.4);
    const padSteps = st.padSteps || 64;
    if (st.pad && (step % padSteps) === 0) {
      const pChord = st.prog ? progList[Math.floor(step / padSteps) % progList.length] : [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-5, -1, 2]][Math.floor(step / 64) % 4];
      pad(t, pChord.map(function (n) { return mtof(root + 24 + n); }), stepDur * padSteps, 0.05 * (inBreak ? 1.6 : 1) * (st.pad > 0.5 ? 1 : 0.7));
    } else if (inBreak && s16 === 0 && !st.pad && !st.chords) {
      /* a breakdown with no pad of its own borrows one */
      const broot = st.root + 24;
      pad(t, [mtof(broot), mtof(broot + 7), mtof(broot + 10)], 60 / A.bpm * 4, 0.04);
    }
  }

  /* offline helper: render n seconds of a style (used by the audio check) */
  A.renderOffline = function (style, secs) {
    const sr = 44100;
    const oc = new OfflineAudioContext(2, Math.floor(sr * secs), sr);
    const keep = { ctx: A.ctx, ready: A.ready, bus: bus, noise: noiseBuf, style: A.style, bpm: A.bpm, applied: appliedStyle };
    A.ctx = oc;
    A.style = style; A.bpm = STYLES[style].bpm;
    build(oc);
    const stepDur = 60 / A.bpm / 4;
    const n = Math.floor(secs / stepDur);
    for (let i = 0; i < n; i++) schedule(i, i * stepDur);
    return oc.startRendering().then(function (buf) {
      A.ctx = keep.ctx; A.ready = keep.ready; bus = keep.bus; noiseBuf = keep.noise; A.style = keep.style; A.bpm = keep.bpm; appliedStyle = keep.applied;
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

/* EXCUSE ME — people, 16-bit: the head. Skin, ears, face (expressions, eyes, brows, nose, mouth), facial hair, hair (20 styles),
   hats, glasses and face accessories, in front, side (facing right) and back views. Coordinates are device pixels in the 32x64
   body box (x 0-31, y 0-63); the head sits at x 7-24, y 8-28 in front/back view, and x 7-23 in side view.
   Rules that keep any combination consistent live here: a hat covers the crown, so tall hair (afro, mohawk, buns, quiffs)
   is trimmed to what would stick out from under it. */
'use strict';
(function () {
  const EM = window.EM, C = EM.CHAR;
  const P = EM.PX = EM.PX || {};
  const tone = function (R, v) { return v > 0.64 ? R.h2 : v > 0.30 ? R.h : v > -0.16 ? R.b : v > -0.52 ? R.s : R.s2; };
  const dith = function (x, y, a) { return ((x + y) & 1) ? a : -a; };
  const hash = function (a, b) { return EM.hash2(a, b, 91); };

  /* ------------------------------------------------------------ head shapes (rows y -> [x0, x1]) */
  const HW = { 8: 4, 9: 6, 10: 7, 11: 8, 12: 9, 13: 9, 14: 9, 15: 9, 16: 9, 17: 9, 18: 9, 19: 9, 20: 9, 21: 9, 22: 9, 23: 8, 24: 8, 25: 7, 26: 6, 27: 5, 28: 3 };
  const SIDE = { 8: [11, 19], 9: [9, 21], 10: [8, 22], 11: [7, 23], 12: [7, 23], 13: [7, 23], 14: [7, 23], 15: [7, 23], 16: [7, 23], 17: [7, 23], 18: [7, 23], 19: [7, 23], 20: [7, 23], 21: [7, 23], 22: [7, 23], 23: [8, 23], 24: [8, 22], 25: [9, 22], 26: [10, 21], 27: [11, 20], 28: [13, 18] };
  function rowsOf(view) {
    const out = [];
    for (let y = 8; y <= 28; y++) out.push(view === 's' ? { y: y, x0: SIDE[y][0], x1: SIDE[y][1] } : { y: y, x0: 16 - HW[y], x1: 15 + HW[y] });
    return out;
  }
  const inHead = function (view, x, y) { const r = view === 's' ? SIDE[y] : (HW[y] ? [16 - HW[y], 15 + HW[y]] : null); return !!r && x >= r[0] && x <= r[1]; };
  const hcx = function (view) { return view === 's' ? 15 : 16; };

  /* ------------------------------------------------------------ expressions: [eyes, brows, mouth, blush] */
  const EXPR = [
    { eyes: 'open', brow: 'flat', mouth: 'flat', blush: 0 },     /* 0 neutral */
    { eyes: 'open', brow: 'soft', mouth: 'smile', blush: 1 },    /* 1 smile */
    { eyes: 'happy', brow: 'high', mouth: 'grin', blush: 1 },    /* 2 grin */
    { eyes: 'open', brow: 'smirk', mouth: 'smirk', blush: 0 },   /* 3 smirk */
    { eyes: 'tired', brow: 'low', mouth: 'low', blush: 0 },      /* 4 sleepy */
    { eyes: 'wide', brow: 'up', mouth: 'o', blush: 0 },          /* 5 wide-eyed */
    { eyes: 'closedsoft', brow: 'soft', mouth: 'calm', blush: 1 },/* 6 content */
    { eyes: 'wink', brow: 'smirk', mouth: 'tongue', blush: 1 },  /* 7 cheeky */
    { eyes: 'open', brow: 'worry', mouth: 'wavy', blush: 0 },    /* 8 worried */
    { eyes: 'deadpan', brow: 'flat', mouth: 'flat', blush: 0 }   /* 9 deadpan */
  ];

  /* ------------------------------------------------------------ the skin of the head, ears, neck */
  function neck(S, K, G) {
    const x = G.view === 's' ? 12 : 13, w = 6;
    S.rectS(x, 28, w, 5, G.skin, { vert: 0.2 });
    S.rect(x, 28, w, 2, G.skin.s); S.rect(x + 1, 30, w - 2, 1, G.skin.s);
  }
  function skinHead(S, K, G) {
    const R = G.skin, cx = hcx(G.view);
    /* ears first (they sit behind the head's edge) */
    if (G.view === 's') { S.rectS(11, 18, 3, 6, R, { round: 1 }); S.px(12, 20, R.s2); S.px(12, 21, R.s2); }
    else { S.rectS(5, 18, 3, 6, R, { round: 1 }); S.rectS(24, 18, 3, 6, R, { round: 1 }); S.px(6, 20, R.s2); S.px(6, 21, R.s2); S.px(25, 20, R.s2); S.px(25, 21, R.s2); }
    rowsOf(G.view).forEach(function (r) {
      for (let x = r.x0; x <= r.x1; x++) {
        const nx = (x + 0.5 - cx) / 9.6, ny = (r.y + 0.5 - 18.4) / 11.4;
        S.px(x, r.y, tone(R, -(nx * 0.62 + ny * 0.78) + dith(x, r.y, 0.08) + 0.04));
      }
    });
    if (G.view === 's') { S.px(24, 19, R.b); S.px(24, 20, R.h); S.px(24, 21, R.b); S.px(25, 20, R.b); S.px(24, 22, R.s); }
  }

  /* ------------------------------------------------------------ the face */
  const DARKLASH = '#241822';
  function eyeFront(S, G, x, y, mode, eyeC, flip) {
    const W = '#F6F6FA', Wd = '#D6D9E6', I = eyeC, Id = EM.shade(eyeC, -0.5), sk = G.skin;
    if (mode === 'open' || mode === 'deadpan' || mode === 'worry') {
      S.rect(x, y, 4, 1, DARKLASH);
      S.px(x, y + 1, W); S.px(x + 1, y + 1, I); S.px(x + 2, y + 1, I); S.px(x + 3, y + 1, W);
      S.px(x, y + 2, W); S.px(x + 1, y + 2, Id); S.px(x + 2, y + 2, Id); S.px(x + 3, y + 2, W);
      if (mode !== 'deadpan') { S.px(x, y + 3, sk.s); S.px(x + 1, y + 3, Wd); S.px(x + 2, y + 3, Wd); S.px(x + 3, y + 3, sk.s); }
      S.px(x + (flip ? 2 : 1), y + 1, '#FFFFFF');
    } else if (mode === 'wide') {
      S.rect(x - 1, y - 1, 5, 1, DARKLASH);
      for (let j = 0; j < 4; j++) { S.px(x - 1, y + j, W); S.px(x + 3, y + j, W); }
      S.rect(x, y, 3, 1, I); S.px(x, y + 1, I); S.px(x + 1, y + 1, Id); S.px(x + 2, y + 1, I); S.px(x, y + 2, I); S.px(x + 1, y + 2, Id); S.px(x + 2, y + 2, I); S.rect(x, y + 3, 3, 1, Wd);
      S.px(x, y, '#FFFFFF');
    } else if (mode === 'tired') {
      S.rect(x, y, 4, 1, DARKLASH); S.rect(x, y + 1, 4, 1, sk.s2);
      S.px(x, y + 2, W); S.px(x + 1, y + 2, I); S.px(x + 2, y + 2, I); S.px(x + 3, y + 2, W);
      S.px(x, y + 3, sk.s2); S.px(x + 2, y + 3, sk.s2); S.px(x + 1, y + 3, sk.s); S.px(x + 3, y + 3, sk.s);
    } else if (mode === 'happy') {
      S.px(x, y + 2, DARKLASH); S.px(x + 1, y + 1, DARKLASH); S.px(x + 2, y + 1, DARKLASH); S.px(x + 3, y + 2, DARKLASH);
    } else if (mode === 'closedsoft') {
      S.px(x, y + 1, DARKLASH); S.px(x + 1, y + 2, DARKLASH); S.px(x + 2, y + 2, DARKLASH); S.px(x + 3, y + 1, DARKLASH);
    }
  }
  function eyeSide(S, G, x, y, mode, eyeC) {
    const W = '#F6F6FA', I = eyeC, Id = EM.shade(eyeC, -0.5), sk = G.skin;
    if (mode === 'happy' || mode === 'closedsoft') { S.px(x, y + 2, DARKLASH); S.px(x + 1, y + 1, DARKLASH); S.px(x + 2, y + 1, DARKLASH); return; }
    if (mode === 'tired') { S.rect(x, y, 3, 1, DARKLASH); S.rect(x, y + 1, 3, 1, sk.s2); S.px(x, y + 2, W); S.px(x + 1, y + 2, I); S.px(x + 2, y + 2, Id); return; }
    const big = mode === 'wide';
    S.rect(x, y - (big ? 1 : 0), 3, 1, DARKLASH);
    S.px(x, y + 1, W); S.px(x + 1, y + 1, I); S.px(x + 2, y + 1, Id);
    S.px(x, y + 2, W); S.px(x + 1, y + 2, Id); S.px(x + 2, y + 2, Id);
    if (mode !== 'deadpan') S.px(x + 1, y + 3, sk.s);
    S.px(x + 1, y + 1, '#FFFFFF');
  }
  function brows(S, K, G, ex) {
    const c = EM.shade(EM.HAIRS[K.hc], -0.5), cc = EM.mix(c, G.skin.s2, 0.25);
    const bc = K.hair === 0 && K.hc >= 5 ? G.skin.s2 : cc;
    const b = ex.brow;
    const put = function (x, y, dy) { S.rect(x, y + dy, 4, 1, bc); };
    if (G.view === 's') {
      const y = b === 'up' ? 12 : (b === 'low' || b === 'flat' ? 14 : 13);
      S.rect(17, y, 4, 1, bc); if (b === 'worry' || b === 'smirk') S.px(20, y - 1, bc);
      return;
    }
    const L = { flat: 0, soft: 0, high: -1, smirk: 0, low: 1, up: -2, worry: 0 }[b], Rr = { flat: 0, soft: 0, high: -1, smirk: -2, low: 1, up: -2, worry: 0 }[b];
    put(10, 14, L); put(18, 14, Rr);
    if (b === 'worry') { S.px(13, 13, bc); S.px(18, 13, bc); S.px(10, 15, bc); S.px(21, 15, bc); }
    if (b === 'high') { S.px(10, 15, bc); S.px(21, 15, bc); }
  }
  function mouth(S, K, G, ex) {
    const sb = EM.rgb(G.skin.b), lum = (sb[0] * 0.3 + sb[1] * 0.59 + sb[2] * 0.11) / 255;
    const m = lum < 0.36 ? EM.mix(G.skin.h, '#C45A78', 0.55) : EM.mix(G.skin.b, '#4A1626', 0.72), mi = '#3A0E1C', tooth = '#F8F8FA', tongue = '#E8607A', lip = EM.mix(G.skin.b, '#B43A58', 0.35);
    const k = ex.mouth;
    if (G.view === 's') {
      const x = 20, y = 25;
      if (k === 'smile' || k === 'calm' || k === 'smirk') { S.px(x, y, m); S.px(x + 1, y, m); S.px(x + 2, y - 1, m); }
      else if (k === 'grin' || k === 'tongue') { S.px(x, y - 1, m); S.px(x + 1, y, tooth); S.px(x + 2, y, tooth); S.px(x + 1, y + 1, mi); S.px(x + 2, y + 1, k === 'tongue' ? tongue : mi); }
      else if (k === 'o') { S.px(x + 1, y, mi); S.px(x + 1, y + 1, mi); S.px(x + 2, y, lip); }
      else if (k === 'low') { S.px(x, y + 1, m); S.px(x + 1, y + 1, m); }
      else if (k === 'wavy') { S.px(x, y + 1, m); S.px(x + 1, y, m); S.px(x + 2, y + 1, m); }
      else { S.px(x, y, m); S.px(x + 1, y, m); S.px(x + 2, y, m); }
      return;
    }
    const x = 13, y = 25;
    if (k === 'flat') { S.rect(x + 1, y, 4, 1, m); }
    else if (k === 'smile') { S.px(x, y - 1, m); S.rect(x + 1, y, 4, 1, m); S.px(x + 5, y - 1, m); }
    else if (k === 'grin') { S.px(x, y - 1, m); S.rect(x + 1, y, 4, 1, tooth); S.px(x + 5, y - 1, m); S.rect(x + 1, y + 1, 4, 1, mi); S.px(x, y, m); S.px(x + 5, y, m); }
    else if (k === 'smirk') { S.px(x, y + 1, m); S.rect(x + 1, y, 4, 1, m); S.px(x + 5, y - 1, m); S.px(x + 6, y - 1, m); }
    else if (k === 'low') { S.rect(x + 2, y + 1, 3, 1, m); }
    else if (k === 'o') { S.rect(x + 2, y, 2, 2, mi); S.px(x + 2, y, lip); S.px(x + 3, y, lip); }
    else if (k === 'calm') { S.px(x + 1, y, m); S.rect(x + 2, y + 1, 2, 1, m); S.px(x + 4, y, m); }
    else if (k === 'tongue') { S.px(x, y - 1, m); S.rect(x + 1, y, 4, 1, tooth); S.px(x + 5, y - 1, m); S.rect(x + 1, y + 1, 4, 1, mi); S.rect(x + 2, y + 1, 2, 2, tongue); }
    else if (k === 'wavy') { S.px(x + 1, y + 1, m); S.px(x + 2, y, m); S.px(x + 3, y, m); S.px(x + 4, y + 1, m); }
  }
  function face(S, K, G) {
    const ex = EXPR[K.expr % EXPR.length], eyeC = EM.EYES[K.eye];
    if (G.view === 'b') return;
    if (G.view === 's') {
      eyeSide(S, G, 17, 17, ex.eyes === 'wink' ? 'open' : ex.eyes, eyeC);
      brows(S, K, G, ex); mouth(S, K, G, ex);
      S.px(23, 21, G.skin.s); S.px(22, 22, G.skin.s);
      if (ex.blush) { S.px(19, 22, EM.mix(G.skin.b, '#FF5E86', 0.42)); S.px(20, 22, EM.mix(G.skin.b, '#FF5E86', 0.42)); S.px(19, 23, EM.mix(G.skin.b, '#FF5E86', 0.30)); }
      return;
    }
    eyeFront(S, G, 10, 17, ex.eyes === 'wink' ? 'open' : ex.eyes, eyeC, false);
    eyeFront(S, G, 18, 17, ex.eyes === 'wink' ? 'happy' : ex.eyes, eyeC, true);
    brows(S, K, G, ex);
    /* nose: a soft shadow and a little light */
    S.px(15, 21, G.skin.h); S.px(16, 21, G.skin.h); S.px(15, 22, G.skin.s); S.px(16, 22, G.skin.s); S.px(14, 22, G.skin.s2); S.px(17, 22, G.skin.s2);
    mouth(S, K, G, ex);
    if (ex.blush) { const bl = EM.mix(G.skin.b, '#FF5E86', 0.40), bl2 = EM.mix(G.skin.b, '#FF5E86', 0.24); [[9, 22], [10, 22], [10, 23], [20, 22], [21, 22], [21, 23]].forEach(function (p) { S.px(p[0], p[1], bl); }); S.px(9, 23, bl2); S.px(22, 23, bl2); }
  }
  function facialHair(S, K, G) {
    const f = K.fhair; if (!f) return;
    const R = EM.ramp(EM.HAIRS[K.hc] === '#F2F2F2' || EM.HAIRS[K.hc] === '#A9A9B3' ? EM.HAIRS[K.hc] : EM.HAIRS[K.hc], 'hair');
    if (G.view === 'b') return;
    if (G.view === 's') {
      if (f === 1) { for (let y = 22; y <= 27; y++) for (let x = 14; x <= 22; x++) if (inHead('s', x, y) && ((x + y) & 1) && !(y <= 24 && x >= 19)) S.px(x, y, R.s); }
      if (f === 2) { S.rect(19, 23, 4, 1, R.b); S.rect(20, 24, 3, 1, R.s); }
      if (f === 3 || f === 5) { S.rect(20, 27, 2, 2, R.b); if (f === 3) { S.rect(19, 23, 4, 1, R.b); } }
      if (f === 4) { for (let y = 21; y <= 28; y++) for (let x = 12; x <= 23; x++) if (inHead('s', x, y) && !(y >= 24 && y <= 25 && x >= 20 && x <= 22) && (x >= 15 || y >= 24)) S.px(x, y, tone(R, -0.1 + dith(x, y, 0.1) - (y - 21) * 0.06)); }
      return;
    }
    if (f === 1) { for (let y = 22; y <= 28; y++) for (let x = 8; x <= 23; x++) if (inHead('f', x, y) && ((x + y) & 1) && !(y >= 24 && y <= 26 && x >= 13 && x <= 18)) S.px(x, y, R.s); }
    if (f === 2) { S.rect(12, 23, 8, 2, R.b); S.px(12, 25, R.s); S.px(19, 25, R.s); S.rect(14, 23, 4, 1, R.h); }
    if (f === 3) { S.rect(12, 23, 8, 1, R.b); S.rect(14, 27, 4, 2, R.b); S.px(15, 29, R.s); S.px(16, 29, R.s); S.rect(14, 26, 4, 1, R.s); }
    if (f === 4) {
      for (let y = 21; y <= 29; y++) { const r = HW[y] || (y === 29 ? 2 : 0); if (!r) continue; for (let x = 16 - r; x <= 15 + r; x++) {
        const edge = Math.min(x - (16 - r), 15 + r - x), face = y >= 24 && y <= 26 && x >= 13 && x <= 18;
        if (face || (y < 24 && edge > 3)) continue;
        S.px(x, y, tone(R, -0.05 + dith(x, y, 0.12) - (y - 21) * 0.05));
      } }
      S.rect(12, 23, 8, 1, R.b);
    }
    if (f === 5) { S.rect(15, 27, 2, 2, R.b); }
  }

  /* ------------------------------------------------------------ hair */
  /* hl = the hairline row; sides = 0..4 (none, to the ear, to the jaw, to the shoulder, to the chest); back = how far the hair
     hangs behind the head (0 none, 2 to the shoulders, 3 mid-back, 4 to the waist) */
  const HAIR = [
    {},
    { cap: 1, hl: 13, stub: 1, sides: 0 },
    { cap: 1, hl: 13, sides: 1, fringe: 'side' },
    { cap: 1, hl: 13, sides: 3, fringe: 'part', back: 3 },
    { puff: 1 },
    { mohawk: 1, stubCap: 1, hl: 13 },
    { cap: 1, hl: 13, sides: 1, fringe: 'part', bun: 'top' },
    { cap: 1, hl: 13, sides: 2, fringe: 'blunt', back: 2, inward: 1 },
    { cap: 1, hl: 13, sides: 1, fringe: 'blunt', tails: 2 },
    { cap: 1, hl: 12, sides: 1, fringe: 'sweep', tail: 1 },
    { cap: 1, hl: 12, sides: 1, curls: 1 },
    { cap: 1, hl: 12, quiff: 1, stubSides: 1 },
    { cap: 1, hl: 13, sides: 4, fringe: 'part', back: 4, wavy: 1 },
    { cap: 1, hl: 13, sides: 1, fringe: 'blunt', spaceBuns: 1 },
    { cap: 1, hl: 13, sides: 1, fringe: 'part', braids: 1 },
    { cap: 1, hl: 12, sides: 1, slick: 1 },
    { cap: 1, hl: 13, sides: 2, fringe: 'part', back: 2, wispy: 1 },
    { cap: 1, hl: 13, sides: 1, dreads: 1 },
    { cap: 1, hl: 12, sides: 1, pomp: 1 },
    { cap: 1, hl: 13, sides: 3, fringe: 'part', back: 3, bun: 'small' }
  ];
  /* what each hat covers: 'full' hides the crown and the fringe, 'band' leaves hair above it, 'none' sits on top of or around the hair */
  const HATCOVER = ['none', 'full', 'full', 'band', 'none', 'full', 'none', 'full', 'none', 'none'];
  P.hairParams = function (K) {
    const p = Object.assign({}, HAIR[K.hair % HAIR.length]);
    const cover = HATCOVER[K.hat] || 'none';
    if (cover === 'full') {
      /* a hat flattens whatever stands up: keep what hangs out from under it */
      p.fringe = 0; p.bun = p.bun ? 'low' : 0; p.spaceBuns = 0; p.mohawk = 0; p.quiff = 0; p.pomp = 0;
      if (p.puff) p.puff = 2;
      if (p.curls) { p.curls = 0; p.cap = 1; p.sides = 2; }
      if (p.mohawk === 0 && K.hair === 5) { p.cap = 1; p.sides = 0; p.stubSides = 1; }
    }
    if (cover === 'band') { p.fringe = p.fringe ? 'blunt' : 0; }
    p.cover = cover;
    return p;
  };

  function hairTone(G, x, y, nx, ny, extra) {
    const R = G.hair;
    const v = -(nx * 0.55 + ny * 0.8) + dith(x, y, 0.07) + (extra || 0);
    let c = tone(R, v);
    if (c === R.b && ((x * 5 + y * 3) % 11) === 0) c = R.s;
    if (c === R.h && ((x * 3 + y * 7) % 9) === 0) c = R.b;
    return c;
  }
  /* paint a pixel set: region(x, y) tells if the pixel is hair, centre (cx, cy, rx, ry) gives the lighting normal */
  function fill(S, G, x0, y0, x1, y1, region, cx, cy, rx, ry, extra) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (!region(x, y)) continue;
      S.px(x, y, hairTone(G, x, y, (x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry, extra));
    }
  }
  const inEll = function (x, y, cx, cy, rx, ry) { const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry; return nx * nx + ny * ny <= 1; };

  /* the hair that hangs behind the body: long back hair, pigtails, ponytail, braids, dreads (drawn before the torso) */
  P.hairBack = function (S, K, G) {
    const p = G.hp, view = G.view; if (!p) return;
    const hx = view === 's' ? 15 : 16;
    if (p.back && view !== 's') {
      const bottom = { 2: 31, 3: 41, 4: 47 }[p.back];
      fill(S, G, 5, 10, 26, bottom, function (x, y) {
        if (x < 6 || x > 25) return false;
        if (y > bottom - 2 && (x < 7 || x > 24)) return false;
        const wob = p.wavy ? Math.round(Math.sin(y * 0.9 + x * 0.2) * 1.2) : 0;
        return y <= bottom + wob || (p.wispy && ((x + y) % 4 === 0) && y <= bottom + 1);
      }, 16, 22, 13, 20, -0.15);
    }
    if (p.back && view === 's') {
      const bottom = { 2: 31, 3: 41, 4: 47 }[p.back];
      fill(S, G, 5, 10, 17, bottom, function (x, y) { if (x < 6 || x > 15 + (y < 20 ? 2 : -2)) return false; const wob = p.wavy ? Math.round(Math.sin(y * 0.9) * 1.2) : 0; return y <= bottom + wob; }, 11, 24, 8, 18, -0.15);
    }
    if (p.tails && view !== 's') {
      [[5, 1], [26, -1]].forEach(function (t) {
        const x0 = t[0];
        fill(S, G, x0 - 2, 12, x0 + 4, 36, function (x, y) { const k = 3 - Math.floor((y - 12) / 9); return x >= x0 - 1 + (t[1] > 0 ? 0 : 0) && x <= x0 + 3 && Math.abs(x - (x0 + 1)) <= Math.max(1, 2 - (y > 28 ? 1 : 0)); }, x0 + 1, 24, 3, 13, -0.1);
        S.rect(x0, 15, 3, 1, G.acc.b); S.px(x0, 15, G.acc.h); S.px(x0 + 2, 15, G.acc.s);
      });
    }
    if (p.tails && view === 's') { fill(S, G, 5, 13, 11, 34, function (x, y) { return x >= 6 && x <= 10 && Math.abs(x - 8) <= (y > 28 ? 1 : 2); }, 8, 24, 3, 12, -0.1); S.rect(7, 15, 3, 1, G.acc.b); }
    if (p.tail) {
      if (view === 'b') { fill(S, G, 12, 8, 20, 42, function (x, y) { return x >= 13 && x <= 18 && Math.abs(x - 15.5) <= 3 - Math.floor((y - 12) / 10); }, 16, 26, 4, 16, -0.1); S.rect(13, 12, 6, 2, G.acc.b); S.px(13, 12, G.acc.h); }
      else if (view === 's') { fill(S, G, 3, 8, 12, 38, function (x, y) { const cx = 8 - Math.floor((y - 12) / 6); return y >= 10 && x >= cx - 2 && x <= cx + 2; }, 8, 24, 4, 14, -0.1); S.rect(8, 11, 3, 3, G.acc.b); }
      else { fill(S, G, 23, 12, 30, 34, function (x, y) { return y >= 13 && x >= 24 && x <= 27 && Math.abs(x - 25.5) <= 2 - (y > 28 ? 1 : 0); }, 26, 24, 3, 11, -0.1); }
    }
    if (p.braids && view !== 's') {
      [[5, 0], [24, 1]].forEach(function (t) {
        for (let y = 14; y <= 46; y++) { const seg = Math.floor((y - 14) / 3) & 1; const x = t[0] + (seg ? 1 : 0); S.rect(x, y, 3, 1, seg ? G.hair.s : G.hair.b); if (!seg) S.px(x, y, G.hair.h); }
        S.rect(t[0], 46, 3, 2, G.acc.b);
      });
    }
    if (p.braids && view === 's') { for (let y = 14; y <= 46; y++) { const seg = Math.floor((y - 14) / 3) & 1; S.rect(7 + (seg ? 1 : 0), y, 3, 1, seg ? G.hair.s : G.hair.b); } S.rect(7, 46, 3, 2, G.acc.b); }
    if (p.dreads) {
      const xs = view === 's' ? [6, 8, 10, 12] : [5, 7, 24, 26, 9, 22];
      xs.forEach(function (x, i) { const len = 28 + ((i * 7) % 14); for (let y = 14; y <= len; y++) { const seg = Math.floor(y / 3) & 1; S.rect(x, y, 2, 1, seg ? G.hair.s : G.hair.b); if (seg === 0) S.px(x, y, G.hair.h); } });
    }
  };

  /* extras that sit on or in front of the head: buns, mohawk, quiff, pigtail ties, front locks */
  function hairFront(S, K, G) {
    const p = G.hp, view = G.view; if (!p || !p.cap && !p.puff && !p.mohawk) return;
    const hl = p.hl || 13;
    const hx = hcx(view);
    const face = function (x, y) { return view === 's' ? (x >= 15 && y >= hl) : (Math.abs(x + 0.5 - 16) < 8.4 && y >= hl && y < 29); };
    /* big puffs (afro) */
    if (p.puff) {
      const full = p.puff === 1;
      const cy = full ? 13 : 16, ry = full ? 11 : 6.5, rx = full ? 12.8 : 11.5;
      fill(S, G, 2, 0, 29, 30, function (x, y) {
        if (!inEll(x, y, hx, cy, rx, ry)) return false;
        if (view === 's') return !(x >= 14 && y >= hl && y < 29) && x <= 25;
        return view === 'b' ? y < 27 : !face(x, y);
      }, hx, 12, 13, 12);
      return;
    }
    /* the hair mass on the head */
    const side = [13, 19, 25, 34, 44][p.sides || 0];
    const capRy = p.pomp ? 9 : 8.6, capCy = 14.2;
    const stub = p.stub || p.stubCap;
    const region = function (x, y) {
      if (view === 'b') { return inHead('b', x, y) ? y <= (p.back || p.sides >= 2 ? 26 : 23) || inEll(x, y, 16, capCy, 10.4, capRy) : inEll(x, y, 16, capCy, 10.6, capRy) && y <= 22; }
      if (view === 's') {
        if (inEll(x, y, 14.5, capCy, 9.8, capRy) && y <= (x >= 19 ? hl : (x >= 15 ? hl + 2 : 21))) return true;
        if (x >= 7 && x <= 13 && y >= hl && y <= (p.back ? 27 : (p.sides >= 2 ? 25 : 21)) && inHead('s', x, y)) return true;
        return false;
      }
      if (inEll(x, y, 16, capCy, 10.4, capRy) && y <= hl) return true;
      if ((x <= 8 || x >= 23) && y >= 10 && y <= side && inEll(x, y, 16, 20, 11, 15)) return true;
      return false;
    };
    const lit = function (x, y) { return stub ? ((x + y) & 1) === 0 || y < hl - 4 : true; };
    const rx = 11.5, ryy = 10;
    for (let y = 0; y <= 36; y++) for (let x = 1; x <= 30; x++) {
      if (!region(x, y) || !lit(x, y)) continue;
      /* mohawk: shaved sides, keep only the central strip (and stubble on the rest) */
      if (p.mohawk && (view === 'f' || view === 'b') && Math.abs(x + 0.5 - 16) > 3.2) { if (((x + y) & 1) === 0 && y >= 9) S.px(x, y, G.hair.s2); continue; }
      if (p.mohawk && view === 's' && y > 12) { if (((x + y) & 1) === 0) S.px(x, y, G.hair.s2); continue; }
      if ((p.stubSides) && (view === 'f' || view === 'b') && Math.abs(x + 0.5 - 16) > 5.8 && y >= 12 && y <= 24) { if (((x + y) & 1) === 0) S.px(x, y, G.hair.s2); continue; }
      S.px(x, y, hairTone(G, x, y, (x + 0.5 - hx) / rx, (y + 0.5 - 13) / ryy, p.slick ? 0.12 : 0));
    }
    /* shiny strands */
    if (p.slick && view !== 'b') for (let x = 9; x <= 22; x += 3) for (let y = 6; y <= 11; y++) if (inEll(x, y, 16, capCy, 10.4, capRy)) S.px(x + (y > 8 ? 1 : 0), y, G.hair.h2);
    /* a mohawk's strip rises above the head */
    if (p.mohawk) {
      if (view === 's') { for (let x = 8; x <= 21; x++) { const top = 3 + Math.floor(Math.abs(Math.sin(x * 1.1)) * 3); for (let y = top; y <= 11; y++) S.px(x, y, hairTone(G, x, y, (x - 14) / 8, (y - 8) / 6)); } }
      else { for (let y = 0; y <= 12; y++) { const hw = y < 3 ? 1 : (y < 7 ? 2 : 3); for (let x = 16 - hw; x < 16 + hw; x++) { if (y < 2 && ((x + y) & 1)) continue; S.px(x, y, hairTone(G, x, y, (x - 16) / 4, (y - 6) / 7)); } } for (let y = 0; y <= 12; y += 4) { S.px(13, y + 1, G.hair.h2); } }
    }
    /* quiff / pompadour volume */
    if (p.quiff || p.pomp) {
      const cy = p.pomp ? 4.5 : 7, ry2 = p.pomp ? 8 : 6, cx2 = view === 's' ? 18 : 16, rx2 = view === 's' ? 8 : 8.5;
      fill(S, G, 4, -1, 29, 14, function (x, y) { return inEll(x, y, cx2, cy, rx2, ry2) && y <= 13 && (view !== 'b' || y < 12); }, cx2, cy, rx2, ry2);
    }
    /* buns */
    const bunAt = function (bx, by, r) { fill(S, G, bx - r - 1, by - r - 1, bx + r + 1, by + r + 1, function (x, y) { return inEll(x, y, bx, by, r, r); }, bx, by, r, r); S.rect(bx - r + 1, by + r - 1, r * 2 - 2, 1, G.acc.b); };
    if (p.bun === 'top') { if (view === 's') bunAt(11, 5, 4.2); else bunAt(16, 4.2, 4.6); }
    if (p.bun === 'small') { if (view === 's') bunAt(11, 5, 3); else bunAt(16, 4.5, 3.4); }
    if (p.bun === 'low') { if (view === 's') bunAt(8, 18, 3.2); else if (view === 'b') bunAt(16, 20, 4); }
    if (p.spaceBuns) { if (view === 's') bunAt(11, 5, 3.6); else { bunAt(9, 6, 3.8); bunAt(23, 6, 3.8); } }
    /* curls: a bumpy edge */
    if (p.curls) { for (let a = 0; a < 26; a++) { const ang = Math.PI * (1 + a / 25), r = 10.2; const x = Math.round(16 + Math.cos(ang) * r), y = Math.round(14 + Math.sin(ang) * 8.4); if (view === 's' && x > 21) continue; S.px(x, y, G.hair.h); S.px(x, y + 1, G.hair.b); S.px(x + (a & 1 ? 1 : -1), y, G.hair.s); } }
    /* fringe in front of the forehead */
    if (view !== 'b' && p.fringe) {
      const f = p.fringe;
      const fr = function (x, y) {
        if (view === 's') { if (x < 15 || x > 23) return false; if (f === 'blunt') return y >= hl && y <= hl + 3; if (f === 'part' || f === 'side' || f === 'sweep') return y >= hl && y <= hl + 4 - Math.floor((23 - x) / 3); return false; }
        const d = Math.abs(x + 0.5 - 16);
        if (d > 9) return false;
        if (f === 'blunt') return y >= hl && y <= hl + 3 - (d > 6.5 ? 1 : 0) && (y < hl + 3 || ((x + y) & 1) === 0);
        if (f === 'part') return y >= hl && y <= hl + 5 - Math.floor(Math.max(0, 5 - d) * 1.0 * 0.8) - (d < 1.1 ? 5 : 0);
        if (f === 'side') return y >= hl && (y <= hl + 2 || (x < 15 && y <= hl + 4 - Math.floor((15 - x) * 0.25)));
        if (f === 'sweep') return y >= hl && (y <= hl + 2 || (x > 16 && y <= hl + 4 - Math.floor((x - 16) * 0.25)));
        return false;
      };
      for (let y = hl; y <= hl + 6; y++) for (let x = 5; x <= 27; x++) if (fr(x, y) && (view === 's' || inHead('f', x, y) || Math.abs(x + 0.5 - 16) < 10)) S.px(x, y, hairTone(G, x, y, (x - hx) / 11, (y - 13) / 10, 0.1));
    }
    /* sides falling over the shoulders (long styles) */
    if ((p.sides || 0) >= 3 && view !== 's') {
      const end = p.sides === 3 ? 37 : 46;
      [[3, 8], [23, 28]].forEach(function (b) { fill(S, G, b[0], 14, b[1], end, function (x, y) { if (x < b[0] + 1 || x > b[1] - 1) return false; const wob = p.wavy ? Math.round(Math.sin(y * 0.9 + x) * 1) : 0; return y <= end + wob; }, (b[0] + b[1]) / 2, 28, 4, 15, 0.05); });
    }
    /* wispy shag edge */
    if (p.wispy && view !== 's') { for (let x = 6; x <= 25; x += 2) { S.px(x, 30 + (x % 3), G.hair.b); } }
    /* pigtail ties on the head */
    if (p.tails && view !== 'b') { S.rect(5, 14, 3, 1, G.acc.b); S.rect(24, 14, 3, 1, G.acc.b); }
  }

  /* ------------------------------------------------------------ hats and glasses */
  function hat(S, K, G) {
    const h = K.hat; if (!h) return;
    const R = G.acc, view = G.view, hx = hcx(view);
    const dome = function (cy, rx, ry, cut, rr) { for (let y = Math.floor(cy - ry); y <= cut; y++) for (let x = Math.floor(hx - rx); x <= Math.ceil(hx + rx); x++) { if (!inEll(x, y, hx, cy, rx, ry)) continue; const nx = (x + 0.5 - hx) / rx, ny = (y + 0.5 - cy) / ry; S.px(x, y, tone(rr || R, -(nx * 0.6 + ny * 0.8) + dith(x, y, 0.07))); } };
    if (h === 1 || h === 2) {
      dome(12.5, 10.4, 8.4, 14);
      S.px(hx, 4, R.h2);
      if (view === 'f') { if (h === 1) { S.rect(8, 14, 16, 2, EM.shade(K.accent, -0.35)); S.rect(9, 14, 14, 1, R.s); S.rect(9, 16, 14, 1, G.skin.s2); } else { S.rect(8, 14, 16, 1, R.s); S.rect(12, 8, 8, 1, R.h); } }
      else if (view === 'b') { S.rect(8, 14, 16, 1, R.s); if (h === 2) { S.rect(5, 14, 22, 2, EM.shade(K.accent, -0.35)); S.rect(6, 14, 20, 1, R.s); } else { S.rect(13, 12, 6, 1, R.s2); S.rect(14, 13, 4, 1, R.b); } }
      else { const fwd = h === 1; S.rect(fwd ? 22 : 3, 14, 7, 2, EM.shade(K.accent, -0.35)); S.rect(fwd ? 22 : 3, 14, 7, 1, R.s); S.rect(7, 14, 16, 1, R.s); S.px(fwd ? 28 : 3, 15, R.s2); }
    } else if (h === 3) {
      const y0 = view === 's' ? 11 : 10;
      S.rect(7, y0, view === 's' ? 17 : 18, 5, R.b); S.rect(7, y0, view === 's' ? 17 : 18, 1, R.h); S.rect(7, y0 + 4, view === 's' ? 17 : 18, 1, R.s);
      for (let x = 8; x < 24; x += 3) { S.px(x + (x % 2), y0 + 1, '#FFFFFF'); S.px(x + 1, y0 + 3, '#FFFFFF'); }
      if (view === 's') { S.rect(5, y0 + 1, 3, 4, R.b); S.px(4, y0 + 4, R.s); S.px(5, y0 + 5, R.s); } else if (view === 'f') { S.rect(24, y0 + 1, 3, 3, R.b); S.rect(25, y0 + 4, 2, 3, R.s); S.px(26, y0 + 7, R.s2); } else { S.rect(13, y0 + 1, 6, 5, R.b); S.rect(14, y0 + 6, 2, 3, R.s); S.rect(17, y0 + 6, 2, 2, R.s); }
    } else if (h === 4) {
      /* headphones: a band over the head and a cup on each ear */
      if (view === 's') { for (let a = 0; a <= 20; a++) { const ang = Math.PI * (0.18 + 0.64 * a / 20); S.px(Math.round(15 - Math.cos(ang) * 9.5), Math.round(17 - Math.sin(ang) * 11.5), '#16161C'); S.px(Math.round(15 - Math.cos(ang) * 9.5) + 1, Math.round(17 - Math.sin(ang) * 11.5) + 1, R.s); } S.rectS(9, 16, 7, 9, R, { round: 1 }); S.rect(10, 17, 5, 7, '#1B1B22'); S.rect(11, 18, 3, 5, R.b); S.px(11, 18, R.h2); }
      else { for (let a = 0; a <= 28; a++) { const ang = Math.PI * (0.02 + 0.96 * a / 28); const x = Math.round(16 - Math.cos(ang) * 10.8), y = Math.round(18 - Math.sin(ang) * 12.5); S.px(x, y, '#16161C'); S.px(x, y + 1, '#16161C'); S.px(x, y, R.b); } [[2, 7], [24, 29]].forEach(function (c) { S.rectS(c[0], 16, 6, 9, R, { round: 1 }); S.rect(c[0] + 1, 17, 4, 7, '#1B1B22'); S.rect(c[0] + 1, 18, 3, 5, R.b); S.px(c[0] + 1, 18, R.h2); }); }
    } else if (h === 5) {
      dome(12, 10.6, 9.6, 15);
      for (let x = 7; x <= 24; x++) { S.px(x, 12 + (x & 1), R.h); S.px(x, 14, R.s); }
      S.rect(7, 12, 18, 4, R.b); for (let x = 7; x <= 24; x += 2) { S.rect(x, 12, 1, 4, R.s); } S.rect(7, 12, 18, 1, R.h); S.px(hx, 2, R.h);
    } else if (h === 6) {
      S.rect(7, 11, view === 's' ? 17 : 18, 3, R.b); S.rect(7, 11, view === 's' ? 17 : 18, 1, R.h); S.rect(7, 13, view === 's' ? 17 : 18, 1, R.s);
    } else if (h === 7) {
      dome(11, 8.6, 6.8, 13, R);
      const bw = view === 's' ? 12 : 13.4;
      for (let y = 11; y <= 17; y++) for (let x = Math.floor(hx - bw); x <= Math.ceil(hx + bw); x++) { const nx = (x + 0.5 - hx) / bw, ny = (y + 0.5 - 14) / 3; if (nx * nx + ny * ny > 1 || y < 13) continue; S.px(x, y, ny > 0.2 ? R.s : (nx < -0.4 ? R.h : R.b)); }
    } else if (h === 8) {
      /* cat ears: two pointed triangles on a headband */
      const ear = function (ex) { for (let j = 0; j < 9; j++) { const w = 2 + Math.floor(j * 0.8); const x0 = ex + Math.floor((8 - w) / 2); S.rect(x0, 1 + j, w, 1, j > 5 ? R.s : R.b); if (w > 3 && j > 2) S.rect(x0 + 1, 1 + j, w - 2, 1, '#FF9CC4'); } S.px(ex + 2, 2, R.h2); };
      if (view === 's') { ear(7); ear(14); } else { ear(7); ear(17); }
      S.rect(7, 11, view === 's' ? 17 : 18, 2, R.b); S.rect(7, 11, view === 's' ? 17 : 18, 1, R.h);
    } else if (h === 9) {
      const pts = view === 's' ? [[8, 13], [11, 10], [15, 9], [19, 10], [22, 12]] : [[8, 14], [10, 11], [13, 9], [16, 8], [19, 9], [22, 11], [24, 14]];
      pts.forEach(function (p, i) { const cs = ['#FF9CC4', '#FFFFFF', '#FFD23F', '#C9A0FF'][i % 4]; S.rect(p[0] - 1, p[1] - 1, 3, 3, '#2E8B4A'); S.rect(p[0], p[1], 2, 2, cs); S.px(p[0], p[1], '#FFF6D0'); });
    }
  }
  function glasses(S, K, G) {
    const f = K.face; if (!f) return;
    const view = G.view, sk = G.skin;
    if (f === 1 || f === 6) {
      const lens = f === 1 ? '#0E0E14' : EM.shade(K.accent, -0.2), glint = f === 1 ? '#6C7390' : '#FFFFFF';
      if (view === 'f') {
        if (f === 1) { S.rect(9, 16, 6, 4, lens); S.rect(17, 16, 6, 4, lens); S.rect(15, 16, 2, 1, '#16161C'); S.rect(8, 16, 1, 1, '#16161C'); S.rect(23, 16, 1, 1, '#16161C'); S.px(10, 17, glint); S.px(18, 17, glint); S.px(11, 17, '#2A2E40'); S.px(19, 17, '#2A2E40'); }
        else { S.rect(8, 16, 16, 4, lens); S.rect(8, 16, 16, 1, EM.shade(K.accent, 0.2)); S.px(10, 17, glint); S.px(11, 17, glint); S.px(20, 18, glint); S.rect(15, 19, 2, 1, '#16161C'); }
      } else if (view === 's') { S.rect(16, 16, 6, 4, lens); S.rect(9, 16, 7, 1, '#16161C'); S.px(17, 17, glint); S.px(18, 17, '#2A2E40'); S.px(22, 17, '#16161C'); }
      return;
    }
    if (f === 2) {
      const fr = '#2A2230', gl = 'rgba(190,220,255,0.28)';
      const ring = function (cx, cy) { for (let a = 0; a < 24; a++) { const ang = a / 24 * Math.PI * 2; S.px(Math.round(cx + Math.cos(ang) * 3.3 - 0.5), Math.round(cy + Math.sin(ang) * 3.3 - 0.5), fr); } S.g.fillStyle = gl; S.g.fillRect(cx - 2 + S.ox, cy - 2 + S.oy, 3, 3); S.px(cx - 2, cy - 2, '#FFFFFF'); };
      if (view === 'f') { ring(12, 18.5); ring(20, 18.5); S.rect(15, 18, 2, 1, fr); S.px(7, 18, fr); S.px(24, 18, fr); }
      else if (view === 's') { ring(19, 18.5); S.rect(11, 18, 5, 1, fr); }
      return;
    }
    if (view === 'b') return;
    if (f === 3) {
      const c = K.accent;
      if (view === 'f') { S.rect(9, 22, 1, 4, c); S.rect(10, 23, 1, 3, EM.shade(c, -0.3)); S.rect(22, 22, 1, 4, c); S.rect(21, 23, 1, 3, EM.shade(c, -0.3)); S.px(12, 21, '#FFFFFF'); S.px(19, 21, '#FFFFFF'); }
      else { S.rect(19, 21, 1, 4, c); S.rect(20, 22, 1, 3, EM.shade(c, -0.3)); S.px(18, 21, '#FFFFFF'); }
    } else if (f === 4) {
      [[10, 21], [12, 22], [9, 24], [21, 21], [19, 23], [22, 24], [14, 20], [17, 20]].forEach(function (p, i) { if (view === 's' && p[0] < 15) return; S.px(p[0], p[1], i % 3 === 0 ? K.accent : '#FFFFFF'); });
    } else if (f === 5) {
      const fc = EM.shade(sk.b, -0.28);
      [[11, 21], [13, 22], [12, 23], [10, 22], [20, 21], [18, 22], [19, 23], [21, 22], [14, 21], [17, 21]].forEach(function (p) { if (view === 's' && p[0] < 16) return; S.px(p[0], p[1], fc); });
    }
  }

  /* ears: earrings */
  function earrings(S, K, G) {
    const e = K.ear; if (!e || G.view === 'b' && false) return;
    const gold = '#FFC83D', gh = '#FFF0A0';
    const at = G.view === 's' ? [[12, 23]] : [[6, 23], [25, 23]];
    at.forEach(function (p) {
      if (e === 1) { S.px(p[0], p[1], gold); S.px(p[0], p[1] - 1, gh); }
      if (e === 2) { S.px(p[0], p[1], gold); S.px(p[0] - 1, p[1] + 1, gold); S.px(p[0] + 1, p[1] + 1, gold); S.px(p[0], p[1] + 2, gold); S.px(p[0] - 1, p[1] + 1, gh); }
      if (e === 3) { S.px(p[0], p[1], gold); S.px(p[0], p[1] + 1, gold); S.px(p[0], p[1] + 2, K.accent); S.px(p[0], p[1] + 3, K.accent); S.px(p[0], p[1] + 2, gh); }
    });
  }

  /* everything from the neck up, in drawing order (the caller draws the body first) */
  P.head = function (S, K, G) {
    neck(S, K, G);
    skinHead(S, K, G);
    face(S, K, G);
    facialHair(S, K, G);
    earrings(S, K, G);
    hairFront(S, K, G);
    hat(S, K, G);
    glasses(S, K, G);
  };
  P.EXPR = EXPR;
})();

/* EXCUSE ME — people, 16-bit: the body and the assembly. Legs and bottoms (11), shoes (6), tops (18), arms and sleeves, neck
   accessories, the walk and dance poses, the four directions, the outline. EM.person(look, dir, frame, pose) returns a 36x68
   canvas (the old 18x34 logical box at the render scale), with .lw/.lh giving its logical size.
   frame: 0 stand, 1 and 2 the two walking steps, 3 the passing step (drawn like 0; the engine lifts it a pixel).
   pose: 'stand' | 'dance' | 'lie' | 'sit'. */
'use strict';
(function () {
  const EM = window.EM, C = EM.CHAR, P = EM.PX, RS = EM.RS;
  const W = 36, H = 68;
  const tone = function (R, v) { return v > 0.64 ? R.h2 : v > 0.30 ? R.h : v > -0.16 ? R.b : v > -0.52 ? R.s : R.s2; };

  /* ------------------------------------------------------------ everything a part needs to know */
  function prep(K, view, frame, pose) {
    const b = K.build, G = { view: view, frame: frame, pose: pose, b: b };
    G.skin = EM.ramp(EM.SKINS[K.skin], 'skin');
    G.hair = EM.ramp(EM.HAIRS[K.hc], 'hair');
    G.top = EM.ramp(EM.CLOTHES[K.tc]);
    G.bot = EM.ramp(EM.BOTTOMS[K.bc]);
    G.acc = EM.ramp(K.accent);
    G.hp = P.hairParams(K);
    if (view === 's') { G.tx0 = [11, 10, 9][b]; G.tx1 = [20, 21, 22][b]; } else { G.tx0 = [9, 8, 6][b]; G.tx1 = [22, 23, 25][b]; }
    G.legW = [5, 6, 7][b];
    G.lift = [0, 0]; G.armDy = [0, 0]; G.nearDx = 0; G.farDx = 0; G.swing = 0;
    if (view !== 's') {
      if (frame === 1) { G.lift = [3, 0]; G.armDy = [-2, 2]; } else if (frame === 2) { G.lift = [0, 3]; G.armDy = [2, -2]; }
    } else if (frame === 1) { G.nearDx = 3; G.farDx = -3; G.swing = -3; } else if (frame === 2) { G.nearDx = -3; G.farDx = 3; G.swing = 3; }
    return G;
  }

  /* ------------------------------------------------------------ shoes */
  function shoe(S, K, G, x, w, yTop, lead) {
    /* x: left edge of the leg; lead = the side view's toe direction (+1, always facing right) */
    const st = K.shoes, A = G.acc, view = G.view;
    const white = EM.ramp('#F4F4F6'), blk = EM.ramp('#17171E'), brown = EM.ramp('#6B4B2A');
    if (view === 's') {
      const x0 = x - 1, ww = w + 4;
      const body = function (R, h) { S.rectS(x0, yTop + (5 - h), ww, h, R, { round: 1 }); };
      if (st === 0) { body(white, 5); S.rect(x0, yTop + 4, ww, 1, A.b); S.rect(x0 + ww - 3, yTop + 1, 3, 2, white.h2); S.px(x0 + ww - 1, yTop + 3, white.s); }
      else if (st === 1) { S.rectS(x - 1, yTop - 4, w + 2, 9, blk, { round: 1 }); S.rectS(x0, yTop + 1, ww, 4, blk, { round: 1 }); S.rect(x0, yTop + 4, ww, 1, '#050508'); S.px(x, yTop - 3, blk.h2); S.px(x + 1, yTop + 1, blk.h); }
      else if (st === 2) { S.rectS(x - 1, yTop - 2, w + 2, 7, A, { round: 1 }); S.rectS(x0, yTop + 1, ww, 4, A, { round: 1 }); S.rect(x0 + ww - 3, yTop + 2, 3, 3, white.b); S.rect(x0, yTop + 4, ww, 1, white.h); for (let i = 0; i < 3; i++) S.px(x + 2 + i, yTop - 1 + i, '#FFFFFF'); }
      else if (st === 3) { S.rectS(x0, yTop, ww, 2, blk, { round: 1 }); S.rect(x0, yTop + 2, ww, 3, A.b); S.rect(x0, yTop + 2, ww, 1, A.h); S.rect(x0, yTop + 4, ww, 1, A.s); }
      else if (st === 4) { S.rectS(x0, yTop + 1, ww, 4, G.skin, { round: 1 }); S.rect(x0 + 1, yTop + 2, ww - 2, 1, '#3A2A1E'); S.rect(x0, yTop + 4, ww, 1, '#3A2A1E'); S.rect(x0 + ww - 3, yTop + 1, 1, 3, '#3A2A1E'); }
      else { S.rectS(x0, yTop + 1, ww, 4, brown, { round: 1 }); S.rect(x0 + 2, yTop + 1, 2, 1, brown.h2); S.rect(x0, yTop + 4, ww, 1, '#241810'); }
      return;
    }
    const x0 = x - (x < 16 ? 1 : 0), ww = w + 1;
    if (st === 0) {
      S.rectS(x0, yTop, ww, 5, white, { round: 1 }); S.rect(x0, yTop + 4, ww, 1, A.b); S.rect(x0, yTop + 3, ww, 1, A.h);
      if (G.view === 'f') { S.rect(x0 + 2, yTop, ww - 4, 1, '#D8D8E2'); S.px(x0 + ww - 2, yTop + 2, white.s); S.rect(x0 + 1, yTop + 1, 2, 1, white.h2); }
      else { S.rect(x0, yTop + 1, ww, 1, white.s); S.px(x0 + ww / 2 | 0, yTop + 2, A.b); }
    } else if (st === 1) {
      S.rectS(x0, yTop - 4, ww, 9, blk, { round: 1 }); S.rect(x0, yTop + 4, ww, 1, '#050508'); S.px(x0 + 1, yTop - 3, blk.h2); S.px(x0 + 1, yTop - 2, blk.h); S.rect(x0, yTop - 4, ww, 1, blk.s);
    } else if (st === 2) {
      S.rectS(x0, yTop - 2, ww, 7, A, { round: 1 }); S.rect(x0, yTop + 3, ww, 1, white.b); S.rect(x0, yTop + 4, ww, 1, white.h);
      if (G.view === 'f') { S.rect(x0 + 1, yTop + 1, ww - 2, 2, white.b); S.px(x0 + 2, yTop - 1, '#FFFFFF'); S.px(x0 + ww - 3, yTop - 1, '#FFFFFF'); S.px(x0 + 2, yTop + 1, '#FFFFFF'); S.px(x0 + ww - 3, yTop + 1, '#FFFFFF'); }
    } else if (st === 3) {
      S.rectS(x0, yTop, ww, 2, blk, { round: 1 }); S.rect(x0, yTop + 2, ww, 3, A.b); S.rect(x0, yTop + 2, ww, 1, A.h); S.rect(x0, yTop + 4, ww, 1, A.s);
    } else if (st === 4) {
      S.rectS(x0, yTop + 1, ww, 4, G.skin, { round: 1 }); S.rect(x0, yTop + 1, ww, 1, '#3A2A1E'); S.rect(x0, yTop + 3, ww, 1, '#3A2A1E'); S.rect(x0, yTop + 4, ww, 1, '#2A1C14');
    } else {
      S.rectS(x0, yTop + 1, ww, 4, brown, { round: 1 }); S.rect(x0 + 1, yTop + 1, ww - 2, 1, brown.h); S.rect(x0, yTop + 4, ww, 1, '#241810'); S.px(x0 + ww / 2 | 0, yTop + 2, '#E6C27A');
    }
  }

  /* ------------------------------------------------------------ legs and bottoms */
  const SKIRTS = { 3: 1, 8: 1, 10: 1 };
  function pant(S, K, G, x, w, y0, y1, R, idx, outerLeft) {
    S.rectS(x, y0, w, y1 - y0 + 1, R, { vert: 0.15 });
    const oc = outerLeft ? x : x + w - 1, ic = outerLeft ? x + w - 1 : x;
    if (idx === 0) { /* jeans: stitching, a worn knee, a rolled hem */
      for (let y = y0 + 2; y < y1 - 2; y += 2) S.px(oc + (outerLeft ? 1 : -1), y, R.h);
      S.rect(x + 1, 53, w - 2, 3, R.h); for (let i = 0; i < w - 2; i++) if (i & 1) S.px(x + 1 + i, 54, R.b);
      S.rect(x, y1 - 1, w, 1, R.h); S.rect(x, y1, w, 1, R.s2);
    } else if (idx === 1 || idx === 7) { /* pants / joggers: a crease */
      S.rect(x + (w >> 1), y0 + 3, 1, y1 - y0 - 4, R.h);
      S.rect(x, y1, w, 1, R.s);
    } else if (idx === 4) { /* cargo: a pocket on the outer thigh */
      const px = outerLeft ? x : x + w - 3; S.rect(px, 51, 3, 5, R.s); S.rect(px, 51, 3, 1, R.h); S.rect(px, 55, 3, 1, R.s2); S.px(px + 1, 52, R.h2);
      S.rect(x, y1, w, 1, R.s2);
    } else if (idx === 5) { /* leather: bright streaks */
      for (let y = y0 + 2; y < y1; y += 3) S.px(x + 1, y, R.h2); S.rect(x, y1, w, 1, '#050508'); S.px(x + 1, 52, R.h2);
    } else if (idx === 6) { S.rect(x, y1, w, 1, R.s2); S.rect(x, y1 - 1, w, 1, R.s); }
    if (idx === 7) { S.rect(x, y1 - 2, w, 3, R.s2); S.rect(oc, y0, 1, y1 - y0 - 2, G.acc.b); }
  }
  function legs(S, K, G) {
    const lw = G.legW, view = G.view, bot = K.bottom, dress = K.top === 7;
    const Rb = K.top === 16 ? G.top : G.bot, sk = G.skin;
    const wide = bot === 6;
    const list = [];
    if (view !== 's') { list.push({ x: 15 - lw, w: lw, lift: G.lift[0], left: true }); list.push({ x: 17, w: lw, lift: G.lift[1], left: false }); }
    else { const sw = lw; list.push({ x: 12 + G.farDx, w: sw, lift: 0, far: true }); list.push({ x: 12 + G.nearDx, w: sw, lift: 0, far: false }); }
    list.forEach(function (d) {
      let x = d.x, w = d.w, lift = d.lift || 0;
      const shoeTop = 59 - lift, yEnd = shoeTop - 1;
      const R = d.far ? { s2: Rb.s2, s: Rb.s2, b: Rb.s, h: Rb.b, h2: Rb.h } : Rb;
      const skR = d.far ? { s2: sk.s2, s: sk.s2, b: sk.s, h: sk.b, h2: sk.h } : sk;
      let kind;
      if (dress || SKIRTS[bot] || bot === 2 || bot === 9) kind = 'skin'; else kind = 'pant';
      if (kind === 'skin') {
        S.rectS(x, 47, w, yEnd - 47 + 1, skR, { vert: 0.1 });
        if (bot === 2 && !dress) { const top2 = 54; S.rectS(x - (wide ? 1 : 0), 47, w, top2 - 47 + 1, R, { vert: 0.1 }); S.rect(x, top2, w, 1, R.s2); S.rect(x, yEnd - 2, w, 2, '#F2F2F6'); S.rect(x, yEnd - 2, w, 1, '#C8C8D2'); }
        else if (bot === 9 && !dress) { S.rectS(x, 47, w, 7, R, { vert: 0.1 }); S.rect(x, 53, w, 1, G.acc.b); S.rect(d.left ? x : x + w - 1, 47, 1, 7, G.acc.b); }
        else if (!dress && (bot === 8)) { /* maxi skirt covers the legs to the shoe */ }
      } else {
        if (wide) { const xx = d.left ? x - 2 : x, ww = w + 2; pant(S, K, G, xx, ww, 47, yEnd, R, 6, d.left); }
        else pant(S, K, G, x, w, 47, yEnd, R, bot, d.left);
      }
      shoe(S, K, G, x, w, shoeTop, 1);
    });
    /* skirts hang over the tops of the legs */
    const x0 = G.tx0 - 1, x1 = G.tx1 + 1, midx = 16;
    const skirt = function (yTop, yBot, flare, R, pleats, plaid) {
      for (let y = yTop; y <= yBot; y++) {
        const t = (y - yTop) / Math.max(1, yBot - yTop), fx = Math.round(flare * t);
        const a = (view === 's' ? 8 : x0) - fx, b = (view === 's' ? 24 : x1) + fx;
        for (let x = a; x <= b; x++) {
          const u = (x - a) / Math.max(1, b - a);
          let c = tone(R, (0.42 - u) * 1.5 - t * 0.55 + (((x + y) & 1) ? 0.05 : -0.05));
          if (pleats && ((x - a) % 4 === 3)) c = R.s;
          if (plaid) { if ((y - yTop) % 5 === 2) c = G.acc.s; else if ((x - a) % 5 === 2) c = G.acc.b; if ((y - yTop) % 5 === 2 && (x - a) % 5 === 2) c = G.acc.h; }
          S.px(x, y, c);
        }
      }
      S.rect((view === 's' ? 8 : x0) - flare, yBot, (view === 's' ? 17 : x1 - x0 + 1) + flare * 2, 1, R.s2);
      S.rect((view === 's' ? 8 : x0) - flare, yBot - 1, (view === 's' ? 17 : x1 - x0 + 1) + flare * 2, 1, R.h);
    };
    if (dress) skirt(46, 57, 3, G.top, true, false);
    else if (bot === 3) skirt(46, 55, 2, Rb, true, false);
    else if (bot === 8) skirt(46, 62, 3, Rb, true, false);
    else if (bot === 10) skirt(46, 55, 2, Rb, false, true);
    /* belt line where the bottom meets the top */
    if (!dress) S.rect(G.tx0, 47, G.tx1 - G.tx0 + 1, 1, Rb.s2);
  }

  /* ------------------------------------------------------------ arms and sleeves */
  function hand(S, G, x, y) { S.rectS(x, y, 4, 4, G.skin, { round: 1 }); S.px(x + (x < 16 ? 3 : 0), y + 1, G.skin.s); }
  function arm(S, K, G, x, y0, sl, far) {
    const sk = far ? { s2: G.skin.s2, s: G.skin.s2, b: G.skin.s, h: G.skin.b, h2: G.skin.h } : G.skin;
    const R = sl && sl.R ? (far ? { s2: sl.R.s2, s: sl.R.s2, b: sl.R.s, h: sl.R.b, h2: sl.R.h } : sl.R) : null;
    const len = 18, L = sl ? sl.len : 0;
    S.rectS(x, y0, 4, len, sk, { vert: 0.1 });
    if (L > 0 && R) {
      if (sl.mesh) { for (let j = 0; j < L; j++) for (let i = 0; i < 4; i++) if (((i + j) & 1) === 0) S.px(x + i, y0 + j, R.b); }
      else {
        S.rectS(x, y0, 4, L, R, { vert: 0.1 });
        if (sl.cuff) { S.rect(x, y0 + L - 2, 4, 2, far ? R.s2 : sl.cuff); S.rect(x, y0 + L - 2, 4, 1, far ? R.s2 : R.s2); }
        if (sl.stripe) S.rect(G.view === 's' ? x + 3 : (x < 16 ? x : x + 3), y0, 1, L, sl.stripe);
      }
    }
    hand(S, G, x, y0 + len);
  }
  function armsFront(S, K, G, sl) {
    if (G.pose === 'dance') {
      [[G.tx0 - 5, 1], [G.tx1 + 2, -1]].forEach(function (a) {
        const x = a[0];
        S.rectS(x, 25, 4, 11, G.skin, { vert: 0.1 });
        if (sl && sl.len > 0 && sl.R) { S.rectS(x, 29, 4, 7, sl.R, { vert: 0.1 }); if (sl.len > 12) S.rectS(x, 25, 4, 5, sl.R, { vert: 0.1 }); }
        S.rectS(x + (a[1] > 0 ? 2 : -1), 33, 4, 4, sl && sl.len > 0 && sl.R ? sl.R : G.skin);
        hand(S, G, x, 21);
      });
      return;
    }
    arm(S, K, G, G.tx0 - 4, 32 + G.armDy[0], sl, false);
    arm(S, K, G, G.tx1 + 1, 32 + G.armDy[1], sl, false);
  }

  /* ------------------------------------------------------------ the 'RD' emblem and other tee prints */
  const TEE = { R: '111101111110101', D: '110101101101110', C: '011100100100011', O: '010101101101010' };
  function emblem(S, K, G) {
    if (!K.tee || G.view === 'b') return;
    const cs = K.teeC === 'neon' ? K.accent : (K.teeC || '#FFFFFF');
    const letters = K.tee.split('');
    const total = letters.length * 7 - 1, x0 = 16 - Math.floor(total / 2) + (G.view === 's' ? 2 : 0);
    letters.forEach(function (ch, li) {
      const pat = TEE[ch]; if (!pat) return;
      for (let i = 0; i < 15; i++) if (pat[i] === '1') S.rect(x0 + li * 7 + (i % 3) * 2, 36 + Math.floor(i / 3) * 2, 2, 2, cs);
    });
  }

  /* ------------------------------------------------------------ tops */
  function top(S, K, G) {
    const x0 = G.tx0, x1 = G.tx1, w = x1 - x0 + 1, view = G.view, fr = view === 'f', Rt = G.top, ac = G.acc, sk = G.skin, t = K.top;
    let sl = { len: 0, R: Rt, cuff: null };
    const base = function (R, h) { S.rectS(x0, 31, w, h || 18, R, { round: 1 }); };
    const skinTorso = function (h) { S.rectS(x0, 31, w, h || 18, sk, { round: 1 }); };
    const hem = function (c, rows) { S.rect(x0, 49 - rows, w, rows, c); for (let x = x0; x <= x1; x += 2) S.rect(x, 49 - rows, 1, rows, EM.shade(c, -0.25)); };
    switch (t) {
      case 0: sl.len = 8; base(Rt); if (fr) { S.rect(15, 37, 2, 3, ac.b); S.px(15, 37, ac.h2); S.px(16, 39, ac.s); } break;
      case 1: sl.len = 0; skinTorso(); S.rectS(x0, 33, w, 16, Rt, { round: 1 }); S.rectS(x0 + 1, 31, 3, 4, Rt); S.rectS(x1 - 3, 31, 3, 4, Rt); if (fr) { S.rect(x0 + 4, 33, w - 8, 1, Rt.s2); } break;
      case 2: sl.len = 8; base(Rt); for (let y = 34; y < 48; y += 4) { S.rect(x0, y, w, 2, ac.b); S.rect(x0, y + 1, w, 1, ac.s); } break;
      case 3: sl = { len: 18, R: Rt, cuff: Rt.s }; base(Rt); if (fr) { S.rect(x0 + 3, 42, w - 6, 5, Rt.s); S.rect(x0 + 3, 42, w - 6, 1, Rt.h); S.rect(16, 42, 1, 5, Rt.s2); S.rect(14, 32, 1, 6, Rt.h2); S.rect(17, 32, 1, 6, Rt.h2); S.px(14, 38, ac.b); S.px(17, 38, ac.b); S.rectS(11, 29, 10, 4, Rt.s, { round: 1 }); } else if (view === 'b') { S.rectS(11, 30, 10, 11, Rt.s, { round: 1 }); S.rect(16, 31, 1, 9, Rt.s2); } else S.rectS(11, 29, 6, 5, Rt.s, { round: 1 }); hem(Rt.s, 2); break;
      case 4: sl = { len: 18, R: Rt, mesh: true }; skinTorso(); for (let y = 31; y < 49; y++) for (let x = x0; x <= x1; x++) if (((x + y) & 1) === 0) S.px(x, y, Rt.b); S.rect(x0, 47, w, 2, Rt.s); break;
      case 5: sl.len = 0; skinTorso(); if (fr) { for (let i = 0; i < 10; i++) { S.rect(x0 + 1 + i, 32 + i, 2, 1, '#16161C'); S.rect(x1 - 2 - i, 32 + i, 2, 1, '#16161C'); } S.rect(14, 42, 4, 3, ac.b); S.rect(15, 43, 2, 1, '#16161C'); S.px(14, 42, ac.h2); } S.rect(x0, 46, w, 3, '#16161C'); S.rect(15, 46, 2, 3, ac.b); break;
      case 6: sl.len = 8; skinTorso(); S.rectS(x0, 31, w, 10, Rt, { round: 1 }); S.rect(x0, 40, w, 1, Rt.s2); if (fr) S.px(16, 45, sk.s2); break;
      case 7: sl.len = 0; skinTorso(); S.rectS(x0, 33, w, 15, Rt, { round: 1 }); S.rectS(x0 + 1, 31, 3, 4, Rt); S.rectS(x1 - 3, 31, 3, 4, Rt); S.rect(x0, 44, w, 1, Rt.s); break;
      case 8: { const Rd = EM.ramp('#1C1C24'); sl = { len: 8, R: Rd }; base(Rd); if (fr) { S.rectS(x0, 31, 4, 18, Rt); S.rectS(x1 - 3, 31, 4, 18, Rt); [38, 44].forEach(function (y) { S.rect(x0, y, 4, 2, '#F4F4F8'); S.rect(x1 - 3, y, 4, 2, '#F4F4F8'); }); } else { S.rectS(x0, 31, w, 18, Rt); [38, 44].forEach(function (y) { S.rect(x0, y, w, 2, '#F4F4F8'); }); } break; }
      case 9: sl = { len: 18, R: Rt, cuff: Rt.s2 }; base(Rt); if (fr) { for (let i = 0; i < 5; i++) { S.rect(x0 + 1 + i, 31 + i, 1, 1, Rt.h2); S.rect(x1 - 1 - i, 31 + i, 1, 1, Rt.h2); S.rect(x0 + 2 + i, 32 + i, 2, 1, Rt.h); S.rect(x1 - 3 - i, 32 + i, 2, 1, Rt.h); } S.rect(15, 33, 2, 16, '#17171E'); S.rect(16, 33, 1, 16, '#C8C8D2'); S.px(16, 34, '#FFFFFF'); S.px(x0, 32, '#E8E8F0'); S.px(x1, 32, '#E8E8F0'); } S.rect(x0, 46, w, 1, Rt.s2); S.rect(x0, 47, w, 2, Rt.s); break;
      case 10: { const Rw = EM.ramp('#F4F4F6'); sl = { len: 8, R: Rw }; base(Rw); if (fr) { S.rect(15, 37, 2, 6, '#E5332A'); S.rect(13, 39, 6, 2, '#E5332A'); S.px(15, 37, '#FF6A60'); S.px(13, 39, '#FF6A60'); } break; }
      case 11: sl = { len: 18, R: Rt, cuff: Rt.h }; base(Rt); if (fr) { S.rect(16, 33, 1, 15, Rt.h); [35, 39, 43].forEach(function (y) { S.px(16, y, Rt.h2); S.px(15, y, Rt.s); }); S.rect(x0 + 3, 37, 4, 4, Rt.s); S.rect(x0 + 3, 37, 4, 1, Rt.h); S.rect(13, 31, 2, 2, Rt.h2); S.rect(17, 31, 2, 2, Rt.h2); S.px(14, 33, Rt.h); S.px(17, 33, Rt.h); } else S.rect(12, 31, 8, 2, Rt.h); break;
      case 12: sl = { len: 18, R: Rt, cuff: Rt.s }; base(Rt); S.rect(12, 30, 8, 3, Rt.h); S.rect(12, 32, 8, 1, Rt.s); for (let x = x0 + 1; x <= x1 - 1; x += 3) { S.px(x, 39, ac.b); S.px(x + 1, 38, ac.s); S.px(x + 1, 40, ac.s); } hem(Rt.s, 3); break;
      case 13: { const Rs = EM.ramp(EM.shade(EM.CLOTHES[K.tc], -0.18)); sl = { len: 18, R: Rs, cuff: Rt.s2 }; base(Rt); S.rect(12, 30, 8, 3, Rt.s2); if (fr) { S.rect(16, 33, 1, 13, '#C8C8D2'); S.rect(x0 + 3, 37, 3, 3, ac.b); S.px(x0 + 3, 37, ac.h2); } hem(Rt.s2, 3); break; }
      case 14: sl = { len: 18, R: Rt, cuff: Rt.s, stripe: '#F4F4F8' }; base(Rt); S.rect(x0, 32, 1, 16, '#F4F4F8'); S.rect(x1, 32, 1, 16, '#F4F4F8'); if (fr) { S.rect(16, 31, 1, 17, '#C8C8D2'); } S.rect(12, 29, 8, 4, Rt.s); S.rect(12, 29, 8, 1, Rt.h); hem(Rt.s, 2); break;
      case 15: sl = { len: 8, R: Rt }; base(Rt); for (let y = 31; y < 49; y++) for (let x = x0; x <= x1; x++) { const h = EM.hash2(x, y, 33); if (h > 0.86) S.px(x, y, Rt.h2); else if (h < 0.1) S.px(x, y, ac.b); else if (((x + y) % 7) === 0) S.px(x, y, Rt.h); } break;
      case 16: { sl = { len: 8, R: ac }; base(ac); if (fr) { S.rectS(x0 + 2, 38, w - 4, 11, Rt); S.rect(x0 + 2, 31, 2, 8, Rt.b); S.rect(x1 - 3, 31, 2, 8, Rt.b); S.px(x0 + 2, 38, '#E8E8F0'); S.px(x1 - 2, 38, '#E8E8F0'); S.rect(15, 41, 3, 3, Rt.s); S.rect(15, 41, 3, 1, Rt.h); } else { S.rectS(x0 + 2, 38, w - 4, 11, Rt); S.rect(x0 + 2, 31, 2, 8, Rt.b); S.rect(x1 - 3, 31, 2, 8, Rt.b); } break; }
      case 17: { const Rc = EM.ramp('#F0E9DA'); sl = { len: 18, R: Rt, cuff: Rt.s }; base(Rt); if (fr) { S.rectS(13, 32, 6, 17, Rc); S.rect(12, 32, 1, 17, Rt.s2); S.rect(19, 32, 1, 17, Rt.s2); [36, 41].forEach(function (y) { S.px(12, y, '#E0E0E8'); S.px(19, y, '#E0E0E8'); }); } hem(Rt.s, 2); break; }
    }
    if (view === 's') { const far = {}; }
    return sl;
  }

  /* ------------------------------------------------------------ neck accessories (over the top, under the chin) */
  function neckAcc(S, K, G) {
    const n = K.neck; if (!n) return;
    const view = G.view, A = G.acc, gold = EM.ramp('#FFC83D');
    if (n === 1) { /* chains */
      if (view === 'b') return;
      const arc = function (y0, depth) { for (let i = 0; i <= 12; i++) { const x = view === 's' ? 14 + i - 6 : 10 + i + (i > 6 ? 0 : 0); const y = y0 + Math.round(Math.sin(i / 12 * Math.PI) * depth); S.px(view === 's' ? 14 + Math.round(i / 12 * 8) : x, y, i % 3 === 0 ? gold.h2 : gold.b); } };
      if (view === 'f') { arc(33, 5); arc(33, 8); S.rect(15, 42, 2, 2, gold.b); S.px(15, 42, gold.h2); } else { for (let y = 32; y < 42; y++) S.px(20, y, y % 3 ? gold.b : gold.h2); S.rect(19, 42, 2, 2, gold.b); }
    } else if (n === 2) { /* scarf */
      S.rectS(11, 28, 10, 5, A, { round: 1 }); for (let x = 12; x < 20; x += 3) S.rect(x, 28, 1, 5, A.s);
      if (view === 'f') { S.rectS(17, 32, 4, 11, A, { round: 1 }); S.rect(17, 40, 4, 1, A.s2); S.rect(18, 42, 2, 1, A.h); }
      else if (view === 's') { S.rectS(10, 32, 4, 9, A, { round: 1 }); }
      else { S.rectS(17, 32, 4, 9, A, { round: 1 }); }
    } else if (n === 3) { /* choker */
      S.rect(view === 's' ? 12 : 13, 30, 6, 1, '#16161C'); if (view === 'f') { S.rect(15, 31, 2, 2, A.b); S.px(15, 31, A.h2); }
    } else if (n === 4) { /* lanyard with a badge */
      if (view === 'b') { S.rect(13, 30, 6, 1, A.b); return; }
      if (view === 'f') { for (let i = 0; i < 9; i++) { S.px(13 + i * 0.4 | 0, 31 + i, A.b); S.px(18 - i * 0.4 | 0, 31 + i, A.b); } S.rect(13, 40, 6, 8, '#F4F4F8'); S.rect(13, 40, 6, 2, A.b); S.rect(14, 43, 4, 1, '#B0B0C0'); S.rect(14, 45, 3, 1, '#B0B0C0'); S.px(13, 47, '#C8C8D2'); }
      else { for (let i = 0; i < 9; i++) S.px(14 + i * 0.3 | 0, 31 + i, A.b); S.rect(13, 40, 3, 7, '#F4F4F8'); S.rect(13, 40, 3, 2, A.b); }
    } else if (n === 5) { /* neck bandana */
      S.rectS(11, 29, 10, 3, A, { round: 1 }); if (view === 'f') { for (let i = 0; i < 6; i++) S.rect(12 + i, 32 + i, 8 - i * 2 > 0 ? 8 - i * 2 : 0, 1, A.b); S.px(14, 33, '#FFFFFF'); S.px(17, 34, '#FFFFFF'); S.px(15, 35, '#FFFFFF'); S.px(15, 29, '#FFFFFF'); S.px(18, 30, '#FFFFFF'); }
    }
  }

  /* ------------------------------------------------------------ the whole person */
  function build(K, dir, frame, pose) {
    const view = dir === 'u' ? 'b' : (dir === 'l' || dir === 'r' ? 's' : 'f');
    const S = new EM.Surf(W, H, 2, 2), G = prep(K, view, frame, pose);
    if (view !== 'b') P.hairBack(S, K, G); /* from behind, long hair falls over the back instead */
    if (view === 's') {
      /* the far arm, behind the body */
      const cx = Math.round((G.tx0 + G.tx1) / 2) - 1;
      arm(S, K, G, cx - G.swing, 32, { len: 0 }, true);
    }
    legs(S, K, G);
    const sl = top(S, K, G);
    if (view === 's') {
      const cx = Math.round((G.tx0 + G.tx1) / 2) - 1;
      arm(S, K, G, cx + G.swing, 32, sl, false);
    } else armsFront(S, K, G, sl);
    emblem(S, K, G);
    neckAcc(S, K, G);
    if (view === 'b') P.hairBack(S, K, G);
    P.head(S, K, G);
    return { c: S.c, view: view };
  }

  /* ------------------------------------------------------------ the outline: the colour of the material it hugs, darkened and cooled */
  function outline(c, K) {
    const w = c.width, h = c.height, g = c.getContext('2d');
    const im = g.getImageData(0, 0, w, h), d = im.data, o = new Uint8ClampedArray(d);
    const on = function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0; };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (on(x, y)) continue;
      const nb = on(x, y - 1) ? [x, y - 1] : on(x - 1, y) ? [x - 1, y] : on(x + 1, y) ? [x + 1, y] : on(x, y + 1) ? [x, y + 1] : null;
      if (!nb) continue;
      const j = (y * w + x) * 4, i = (nb[1] * w + nb[0]) * 4;
      let col;
      if (K.ol) col = EM.rgb(K.ol);
      else if (nb[1] < y) col = [7, 6, 13];
      else col = EM.rgb(EM.shade(EM.hex(d[i], d[i + 1], d[i + 2]), -0.86));
      o[j] = col[0]; o[j + 1] = col[1]; o[j + 2] = col[2]; o[j + 3] = 255;
    }
    im.data.set(o); g.putImageData(im, 0, 0);
  }

  const cache = {};
  EM.PERSON_W = 18; EM.PERSON_H = 34;
  EM.person = function (look, dir, frame, pose) {
    dir = dir === 'u' || dir === 'l' || dir === 'r' ? dir : 'd';
    frame = frame | 0; pose = pose || 'stand';
    const key = C.key(look) + '|' + dir + frame + pose;
    let c = cache[key];
    if (c) return c;
    const K = C.normalize(look);
    const r = build(K, dir === 'l' ? 'r' : dir, frame, pose === 'dance' ? 'dance' : 'stand');
    let base = r.c;
    if (dir === 'l') { const f = document.createElement('canvas'); f.width = base.width; f.height = base.height; const fg = f.getContext('2d'); fg.translate(base.width, 0); fg.scale(-1, 1); fg.drawImage(base, 0, 0); base = f; }
    outline(base, K);
    if (pose === 'lie') {
      c = document.createElement('canvas'); c.width = base.height; c.height = base.width; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      g.translate(0, base.width); g.rotate(-Math.PI / 2); g.drawImage(base, 0, 0);
    } else if (pose === 'sit') {
      const cut = 12 * RS, keep = 5 * RS, hh = base.height - 7 * RS;
      c = document.createElement('canvas'); c.width = base.width; c.height = hh; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      g.drawImage(base, 0, 0, base.width, base.height - cut, 0, 0, base.width, base.height - cut);
      g.drawImage(base, 0, base.height - keep, base.width, keep, 0, base.height - cut, base.width, keep);
    } else c = base;
    c.lw = c.width / RS; c.lh = c.height / RS;
    cache[key] = c;
    return c;
  };
})();

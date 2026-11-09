/* EXCUSE ME — people, 16-bit: the extra options. Makeup, piercings, wrist and hand wear, bags, three more tops, four more hats and eight more
   hairstyles. They hook into the generator (people_head.js, people_draw.js) and use the same coordinates: device pixels in the 32x64 body
   box, three views (f front, s side facing right, b back). Everything is drawn from the player's own colours, so it stays consistent. */
'use strict';
(function () {
  const EM = window.EM, C = EM.CHAR, P = EM.PX;
  const GOLD = '#FFC83D', SILVER = '#DDE4F0', SILVERD = '#8C96AA', DARK = '#17171E';

  /* ------------------------------------------------------------ more hairstyles (rows added to the parametric table) */
  P.HAIR.push(
    { cap: 1, hl: 12, sides: 1, fringe: 'blunt', back: 3, wispy: 1 },          /* 20 mullet */
    { cap: 1, hl: 14, sides: 2, fringe: 'blunt' },                            /* 21 bowl cut */
    { cap: 1, hl: 12, sides: 4, fringe: 'part', back: 4 },                    /* 22 long straight */
    { cap: 1, hl: 12, sides: 2, fringe: 'sweep', back: 2 },                   /* 23 side sweep */
    { cap: 1, hl: 12, sides: 0, stubSides: 1, bun: 'top' },                   /* 24 topknot over shaved sides */
    { cap: 1, hl: 13, sides: 0, fringe: 'blunt', stubSides: 1 },              /* 25 cropped fringe */
    { puff: 2 },                                                              /* 26 small afro */
    { cap: 1, hl: 13, sides: 1, fringe: 'part', bun: 'low' }                  /* 27 low bun */
  );
  while (P.HATCOVER.length < 10) P.HATCOVER.push('none');
  P.HATCOVER.push('none', 'full', 'full', 'none');                            /* visor, beret, hood, party hat */

  /* ------------------------------------------------------------ hats 10-13 */
  P.hatExtra = function (S, K, G, dome) {
    const h = K.hat, R = G.acc, view = G.view, hx = view === 's' ? 15 : 16;
    if (h === 10) {
      /* visor: a band round the head and a brim; the hair shows above */
      const x1 = view === 's' ? 23 : 25;
      S.rect(7, 11, x1 - 6, 2, R.b); S.rect(7, 11, x1 - 6, 1, R.h);
      if (view === 'f') { S.rect(8, 13, 16, 2, R.s); S.rect(9, 13, 14, 1, R.b); S.rect(8, 15, 16, 1, G.skin.s2); }
      else if (view === 's') { S.rect(22, 12, 7, 2, R.b); S.rect(22, 14, 7, 1, R.s); S.rect(23, 15, 6, 1, G.skin.s2); }
      else { S.rect(13, 12, 6, 1, R.s2); }
    } else if (h === 11) {
      /* beret: a flat disc tipped to one side, with a little stalk */
      const cx = view === 's' ? 16 : 18;
      for (let y = 4; y <= 14; y++) for (let x = 2; x <= 30; x++) {
        const nx = (x + 0.5 - cx) / 10.5, ny = (y + 0.5 - 9.2 - (x - cx) * 0.12) / 4.6;
        if (nx * nx + ny * ny > 1) continue;
        S.px(x, y, ((x + y) & 1) && ny > 0.35 ? R.s : (nx < -0.2 && ny < 0.2 ? R.h : (ny > 0.5 ? R.s : R.b)));
      }
      S.rect(7, 12, view === 's' ? 15 : 17, 2, R.s); S.rect(7, 12, view === 's' ? 15 : 17, 1, R.b);
      S.rect(cx - 1, 3, 2, 2, R.s2); S.px(cx - 1, 3, R.b);
    } else if (h === 12) {
      /* hood up: the top colour round the head, the face in an oval */
      const T = G.top;
      for (let y = 0; y <= 31; y++) for (let x = 1; x <= 30; x++) {
        const nx = (x + 0.5 - hx) / 11.6, ny = (y + 0.5 - 15) / 14.6;
        if (nx * nx + ny * ny > 1) continue;
        if (view === 'f') { const fx = (x + 0.5 - 16) / 7.6, fy = (y + 0.5 - 19.5) / 8.4; if (fx * fx + fy * fy < 1) continue; }
        if (view === 's') { const fx = (x + 0.5 - 19.5) / 7.2, fy = (y + 0.5 - 19.5) / 8.4; if (fx * fx + fy * fy < 1 && x > 14) continue; }
        S.px(x, y, ((x + y) & 1) && ny > 0.4 ? T.s : (ny + nx * 0.4 < -0.5 ? T.h : (ny > 0.55 ? T.s2 : T.b)));
      }
      if (view === 'f') { S.rect(9, 11, 14, 1, T.s); }
    } else if (h === 13) {
      /* party hat: a cone in stripes with a pom-pom, on a chin strap */
      for (let j = 0; j <= 10; j++) {
        const y = 10 - j, hw = Math.max(1, Math.round((10 - j) * 0.62));
        for (let x = hx - hw; x <= hx + hw - (view === 's' ? 0 : 1); x++) S.px(x, y, ((j + (x > hx ? 1 : 0)) % 4 < 2) ? R.b : '#FFFFFF');
        S.px(hx - hw, y, R.s);
      }
      S.rect(hx - 1, 0, 3, 2, '#FFFFFF'); S.px(hx - 1, 0, '#FFE98A'); S.px(hx + 1, 1, '#C8C8D4');
      if (view === 'f') { S.px(8, 17, R.b); S.px(8, 19, R.b); S.px(8, 21, R.b); S.px(23, 17, R.b); S.px(23, 19, R.b); S.px(23, 21, R.b); }
    }
  };

  /* ------------------------------------------------------------ makeup */
  function lipRows(K) {
    const m = P.EXPR[K.expr % P.EXPR.length].mouth;
    return (m === 'grin' || m === 'tongue' || m === 'o') ? [24, 27] : [24, 26];
  }
  P.makeup = function (S, K, G) {
    const mk = K.makeup; if (!mk || G.view === 'b') return;
    const view = G.view, side = view === 's', sk = G.skin, A = G.acc;
    const lips = function (c, ch) {
      const r = lipRows(K);
      if (side) { S.rect(20, r[0], 3, 1, c); S.rect(20, r[1], 3, 1, ch); } else { S.rect(14, r[0], 5, 1, c); S.rect(13, r[1], 6, 1, ch); S.px(13, r[0] + 1, c); S.px(19, r[0] + 1, c); }
    };
    const liner = function (wing) {
      const c = '#0C0A12';
      if (side) { S.rect(16, 16, 5, 1, c); if (wing) { S.px(21, 15, c); S.px(22, 14, c); } return; }
      S.rect(10, 16, 4, 1, c); S.rect(18, 16, 4, 1, c);
      if (wing) { S.px(9, 16, c); S.px(8, 15, c); S.px(7, 14, c); S.px(22, 16, c); S.px(23, 15, c); S.px(24, 14, c); S.px(9, 17, c); S.px(22, 17, c); }
    };
    const shadow = function (c, c2) {
      if (side) { S.rect(16, 15, 6, 3, c); S.rect(17, 15, 4, 1, c2); return; }
      S.rect(9, 15, 6, 3, c); S.rect(17, 15, 6, 3, c); S.rect(10, 15, 4, 1, c2); S.rect(18, 15, 4, 1, c2);
    };
    const sparkle = function (pts) { pts.forEach(function (p, i) { if (side && p[0] < 15) return; S.px(p[0], p[1], ['#FFFFFF', '#9FEFFF', '#FFC6F0', '#FFF2A0'][i % 4]); }); };
    if (mk === 1) lips('#D4203C', '#A8142C');
    else if (mk === 2) lips('#5A1245', '#3A0C2E');
    else if (mk === 3) liner(true);
    else if (mk === 4) { shadow(EM.shade(A.b, -0.1), A.h); liner(false); }
    else if (mk === 5) { shadow('#E6B8FF', '#FFFFFF'); liner(false); sparkle([[10, 15], [13, 16], [19, 16], [22, 15], [11, 21], [20, 21], [8, 20], [23, 19]]); }
    else if (mk === 6) {
      lips('#E0244A', '#B01638'); liner(true); shadow(EM.shade(A.b, -0.05), A.h);
      const bl = EM.mix(sk.b, '#FF4F86', 0.55);
      if (side) { S.rect(18, 21, 3, 2, bl); } else { S.rect(8, 21, 3, 2, bl); S.rect(21, 21, 3, 2, bl); }
      sparkle([[9, 20], [22, 20], [12, 15], [19, 15]]);
    }
  };

  /* ------------------------------------------------------------ piercings */
  P.pierce = function (S, K, G) {
    const p = K.pierce; if (!p || G.view === 'b') return;
    const side = G.view === 's';
    if (p === 1) { if (side) { S.rect(22, 22, 2, 2, SILVER); S.px(22, 22, '#FFFFFF'); } else { S.rect(17, 22, 2, 2, SILVER); S.px(17, 22, '#FFFFFF'); S.px(18, 23, SILVERD); } }
    else if (p === 2) { if (side) { S.px(22, 23, SILVER); S.px(23, 24, SILVER); } else { S.px(14, 23, SILVER); S.px(14, 24, SILVERD); S.px(15, 24, SILVER); S.px(16, 24, SILVER); S.px(17, 24, SILVERD); S.px(17, 23, SILVER); } }
    else if (p === 3) { if (side) { S.px(21, 26, SILVER); S.px(22, 27, SILVER); S.px(21, 27, SILVERD); } else { S.px(18, 26, SILVER); S.px(19, 26, '#FFFFFF'); S.px(19, 27, SILVER); S.px(18, 27, SILVERD); } }
    else if (p === 4) { if (side) { S.px(21, 13, SILVER); S.px(21, 15, SILVER); S.px(21, 14, SILVERD); } else { S.px(21, 13, SILVER); S.px(21, 15, SILVER); S.px(21, 14, SILVERD); S.px(22, 13, '#FFFFFF'); } }
  };

  /* ------------------------------------------------------------ wrists and hands */
  function wristAt(S, K, G, x, y, left) {
    const w = K.wrist, A = G.acc;
    if (w === 1) { S.rect(x, y - 2, 4, 4, A.b); S.rect(x, y - 2, 4, 1, A.h); S.rect(x, y + 1, 4, 1, A.s); }
    else if (w === 2) { S.rect(x, y, 4, 1, GOLD); S.px(x, y, '#FFF6B8'); S.rect(x, y + 1, 4, 1, '#B8841A'); S.px(x + 1, y + 1, A.b); S.px(x + 3, y + 1, A.b); S.rect(x, y - 2, 4, 1, SILVER); S.px(x + 2, y - 2, SILVERD); }
    else if (w === 3) { if (!left) return; S.rect(x, y - 1, 4, 3, '#2A2A33'); S.rect(x + 1, y - 1, 2, 2, '#9FE8FF'); S.px(x + 1, y - 1, '#FFFFFF'); S.rect(x, y + 1, 4, 1, '#16161C'); }
    else if (w === 4) { S.rect(x, y - 2, 4, 1, '#19D3FF'); S.px(x + 1, y - 2, '#E4FBFF'); S.rect(x, y, 4, 1, '#FF2D95'); S.px(x + 2, y, '#FFD6EC'); S.rect(x, y + 2, 4, 1, '#B6FF3B'); }
    else if (w === 5) { S.rect(x, y - 1, 4, 5, DARK); S.rect(x, y - 1, 4, 1, '#2C2C38'); S.rect(x, y + 3, 4, 1, '#0A0A0F'); S.px(x + 1, y + 1, '#3A3A48'); S.px(x + 2, y + 1, '#3A3A48'); }
  }
  P.wrist = function (S, K, G) {
    if (!K.wrist) return;
    const view = G.view;
    if (view === 's') {
      const cx = Math.round((G.tx0 + G.tx1) / 2) - 1;
      wristAt(S, K, G, cx + G.swing, 32 + 17, true);
      return;
    }
    if (G.pose === 'dance') { wristAt(S, K, G, G.tx0 - 5, 26, view === 'f'); wristAt(S, K, G, G.tx1 + 2, 26, view !== 'f'); return; }
    wristAt(S, K, G, G.tx0 - 4, 32 + G.armDy[0] + 17, view === 'f');
    wristAt(S, K, G, G.tx1 + 1, 32 + G.armDy[1] + 17, view !== 'f');
  };

  /* ------------------------------------------------------------ bags */
  P.bag = function (S, K, G) {
    const b = K.bag; if (!b) return;
    const view = G.view, A = G.acc, x0 = G.tx0, x1 = G.tx1, w = x1 - x0 + 1, strap = EM.ramp('#2A2230'), cream = EM.ramp('#EFE6D2');
    if (b === 1) { /* fanny pack */
      S.rect(x0, 45, w, 2, strap.b); S.rect(x0, 45, w, 1, strap.h);
      if (view === 'f') { S.rectS(12, 45, 8, 5, A, { round: 1 }); S.rect(12, 47, 8, 1, A.s); S.px(18, 47, '#E8E8F0'); S.px(13, 46, A.h2); }
      else if (view === 's') { S.rectS(x1 - 1, 44, 6, 5, A, { round: 1 }); S.rect(x1 - 1, 46, 6, 1, A.s); }
    } else if (b === 2) { /* crossbody */
      for (let i = 0; i <= 16; i++) { const x = view === 'b' ? x0 + 1 + i * (w - 3) / 16 : x1 - 2 - i * (w - 3) / 16; S.rect(Math.round(x), 31 + i, 2, 1, strap.b); S.px(Math.round(x), 31 + i, strap.h); }
      if (view === 'f') { S.rectS(x0 - 1, 43, 8, 7, A, { round: 1 }); S.rect(x0 - 1, 45, 8, 1, A.s); S.rect(x0 + 2, 46, 2, 2, '#E8E8F0'); }
      else if (view === 's') { S.rectS(13, 43, 7, 7, A, { round: 1 }); S.rect(13, 45, 7, 1, A.s); }
      else { S.rectS(x1 - 5, 43, 8, 7, A, { round: 1 }); S.rect(x1 - 5, 45, 8, 1, A.s); }
    } else if (b === 3) { /* backpack */
      if (view === 'b') { S.rectS(x0 - 1, 31, w + 2, 19, A, { round: 1 }); S.rect(x0 + 1, 40, w - 2, 6, A.s); S.rect(x0 + 1, 40, w - 2, 1, A.h); S.rect(x0 + 2, 42, w - 4, 1, '#16161C'); S.rect(x0 + 1, 32, w - 2, 1, A.h2); S.rect(x0 - 1, 49, w + 2, 1, A.s2); }
      else if (view === 'f') { S.rect(x0 + 1, 31, 3, 15, '#2A2230'); S.rect(x1 - 3, 31, 3, 15, '#2A2230'); S.rect(x0 + 1, 31, 1, 15, '#4A3C58'); S.rect(x1 - 3, 31, 1, 15, '#4A3C58'); S.rect(x0 + 1, 38, w - 2, 1, '#2A2230'); S.px(16, 38, '#E8E8F0'); }
      else { S.rectS(x0 - 5, 31, 6, 17, A, { round: 1 }); S.rect(x0 - 5, 40, 6, 1, A.s); S.rect(x0 - 3, 45, 3, 1, '#16161C'); S.rect(x0, 31, 2, 14, '#2A2230'); }
    } else if (b === 4) { /* tote bag */
      if (view === 'f') { S.rect(x1 - 2, 31, 2, 14, cream.s); S.rectS(x1 - 1, 42, 8, 10, cream, { round: 1 }); S.rect(x1 - 1, 45, 8, 2, A.b); S.rect(x1, 42, 1, 3, cream.s2); S.rect(x1 + 5, 42, 1, 3, cream.s2); }
      else if (view === 's') { S.rect(13, 31, 2, 12, cream.s); S.rectS(12, 42, 8, 10, cream, { round: 1 }); S.rect(12, 45, 8, 2, A.b); }
      else { S.rect(x0 + 1, 31, 2, 12, cream.s); S.rectS(x0 - 6, 42, 8, 10, cream, { round: 1 }); S.rect(x0 - 6, 45, 8, 2, A.b); }
    }
  };

  /* ------------------------------------------------------------ tops 18-20 */
  P.topExtra = function (S, K, G, t, h) {
    const x0 = G.tx0, x1 = G.tx1, w = x1 - x0 + 1, fr = G.view === 'f', Rt = G.top, ac = G.acc, sk = G.skin;
    if (t === 18) { /* polo */
      h.base(Rt); S.rect(11, 29, 10, 3, '#F4F4F8'); S.rect(11, 31, 10, 1, '#C8C8D2'); S.rect(11, 29, 10, 1, ac.b);
      if (fr) { S.rect(16, 32, 1, 7, Rt.s2); S.px(15, 33, '#F4F4F8'); S.px(15, 36, '#F4F4F8'); S.px(17, 35, '#F4F4F8'); S.rect(x0, 38, w, 1, ac.b); S.rect(x0, 40, w, 1, ac.b); }
      else { S.rect(x0, 38, w, 1, ac.b); S.rect(x0, 40, w, 1, ac.b); }
      return { len: 8, R: Rt, cuff: null };
    }
    if (t === 19) { /* print shirt: blossoms in the accent colour on the top colour, open collar */
      h.base(Rt);
      for (let cy = 33; cy < 48; cy += 5) for (let cx = x0 + 1; cx <= x1 - 1; cx += 5) {
        const hh = EM.hash2(cx, cy, 57), ox = (hh * 7 | 0) % 2, oy = ((hh * 13) | 0) % 2, px = cx + ox, py = cy + oy;
        if (px < x0 + 1 || px > x1 - 1) continue;
        S.px(px, py, '#FFFFFF'); S.px(px - 1, py, ac.b); S.px(px + 1, py, ac.b); S.px(px, py - 1, ac.b); S.px(px, py + 1, ac.s);
        if (hh > 0.5) { S.px(px + 2, py + 2, ac.s); S.px(px - 2, py - 2, ac.s); }
      }
      S.rect(11, 30, 4, 3, Rt.h2); S.rect(17, 30, 4, 3, Rt.h2);
      if (fr) { S.rect(15, 31, 2, 7, sk.b); S.px(15, 31, sk.h); }
      return { len: 8, R: Rt, cuff: null };
    }
    if (t === 20) { /* corset: bare shoulders, a laced front */
      h.skinTorso(); S.rectS(x0, 36, w, 13, Rt, { round: 1 });
      S.rect(x0, 36, w, 1, Rt.h); S.rect(x0 + 1, 36, w - 2, 1, Rt.h2);
      for (let x = x0 + 3; x < x1 - 2; x += 4) S.rect(x, 37, 1, 11, Rt.s);
      if (fr) { for (let y = 38; y < 48; y += 2) { S.px(15, y, ac.b); S.px(17, y, ac.b); S.px(16, y + 1, ac.h); } S.rect(x0, 48, w, 1, Rt.s2); }
      return { len: 0, R: Rt, cuff: null };
    }
  };
})();

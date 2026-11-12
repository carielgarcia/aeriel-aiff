/* EXCUSE ME — tiles, 16-bit: 30 tile types drawn at 32x32 device pixels (the old 16x16 logical tile at the render scale), a black
   world with neon trim, dithered gradients, bevels and contact shadows where a wall meets the floor. The zone is drawn once into a
   canvas (engine.js buildStatic), so none of this runs per frame. th = { a, b } are the accent colours of the room. */
'use strict';
(function () {
  const EM = window.EM, RS = EM.RS, N = EM.NEON, shade = EM.shade;
  const TS = 16 * RS; /* a tile in device pixels */

  const TL = EM.TL = {
    VOID: 0, FLOOR: 1, DANCE: 2, WALL: 3, BAR: 4, SPEAKER: 5, PILLAR: 6, COUCH: 7, TILE: 8, STALL: 9,
    SINK: 10, GRASS: 11, CONC: 12, MATT: 13, LOCKER: 14, TABLE: 15, BOOTH: 16, RUG: 17, FENCE: 18,
    STAIRS: 19, BARREL: 20, PLANT: 21, DOORF: 22, BENCH: 23, ROAD: 24, SIDEWALK: 25, CURTAIN: 26,
    MIRROR: 27, RAIL: 28, CRATE: 29, SKY: 30,
    /* the home tileset (THE AFTER): a daytime flat, nothing like the club */
    HFLOOR: 31, HWALL: 32, HRUG: 33, HTILE: 34, HCOUCH: 35, HBED: 36, HTABLE: 37, HCOUNTER: 38, HSPEAKER: 39, HCOATS: 40,
    HPLANT: 41, HDOOR: 42, HTOILET: 43, HSINK: 44, HSKY: 45, HRAIL: 46, HBALC: 47
  };
  const SOLID = {};
  [TL.VOID, TL.WALL, TL.BAR, TL.SPEAKER, TL.PILLAR, TL.COUCH, TL.STALL, TL.SINK, TL.LOCKER, TL.TABLE, TL.FENCE,
    TL.BARREL, TL.PLANT, TL.BENCH, TL.ROAD, TL.MIRROR, TL.RAIL, TL.CRATE, TL.SKY,
    TL.HWALL, TL.HCOUCH, TL.HTABLE, TL.HCOUNTER, TL.HSPEAKER, TL.HCOATS, TL.HPLANT, TL.HTOILET, TL.HSINK, TL.HSKY, TL.HRAIL].forEach(function (t) { SOLID[t] = true; });
  EM.isSolidTile = function (t) { return !!SOLID[t]; };

  /* ------------------------------------------------------------ drawing helpers (g is the tile's context, origin at the tile) */
  let g = null, TX = 0, TY = 0;
  const R = function (x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const P = function (x, y, c) { g.fillStyle = c; g.fillRect(x, y, 1, 1); };
  const dim = function (hex, f) { return shade(hex, -f); };
  const hs = function (i, j, s) { return EM.hash2(TX * 31 + i, TY * 17 + j, s); };
  const BAY = EM.BAYER;
  /* scattered specks: n of them, w x h big */
  function spk(seed, n, c, w, h) {
    for (let i = 0; i < n; i++) { const x = Math.floor(hs(i, 3, seed) * (TS - (w || 1))), y = Math.floor(hs(5, i, seed + 9) * (TS - (h || 1))); R(x, y, w || 1, h || 1, c); }
  }
  /* a vertical dithered gradient between two colours */
  function grad(x, y, w, h, c0, c1) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const t = h > 1 ? j / (h - 1) : 0; P(x + i, y + j, t > BAY[((y + j) & 3) * 4 + ((x + i) & 3)] / 16 ? c1 : c0); }
  }
  /* light on the top and left, shadow on the bottom and right */
  function bevel(x, y, w, h, hi, lo, t) {
    t = t || 1; R(x, y, w, t, hi); R(x, y, t, h, hi); R(x, y + h - t, w, t, lo); R(x + w - t, y, t, h, lo);
  }
  function ellS(cx, cy, rx, ry, ramp) {
    for (let y = Math.floor(cy - ry); y < Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x < Math.ceil(cx + rx); x++) {
      const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry; if (nx * nx + ny * ny > 1) continue;
      const v = -(nx * 0.62 + ny * 0.78) + (((x + y) & 1) ? 0.08 : -0.08);
      P(x, y, v > 0.64 ? ramp.h2 : v > 0.30 ? ramp.h : v > -0.16 ? ramp.b : v > -0.52 ? ramp.s : ramp.s2);
    }
  }
  /* a wall casts a soft step of shadow onto the floor beside it */
  function contact(open, left, right) {
    if (!open(0, -1)) { R(0, 0, TS, 6, 'rgba(2,2,8,0.30)'); R(0, 0, TS, 3, 'rgba(2,2,8,0.30)'); R(0, 0, TS, 1, 'rgba(2,2,8,0.2)'); }
    if (left !== false && !open(-1, 0)) { R(0, 0, 3, TS, 'rgba(2,2,8,0.22)'); R(0, 0, 1, TS, 'rgba(2,2,8,0.18)'); }
    if (right !== false && !open(1, 0)) { R(TS - 2, 0, 2, TS, 'rgba(2,2,8,0.14)'); }
  }

  /* ------------------------------------------------------------ the tiles */
  const T = {};

  T[TL.FLOOR] = function (open, A, B) {
    R(0, 0, TS, TS, '#0B0B10');
    R(0, 0, 16, 16, '#0D0D13'); R(16, 16, 16, 16, '#0D0D13');
    spk(1, 7, '#171720', 2, 1); spk(2, 3, dim(A, 0.74), 1, 1); spk(4, 3, '#06060A', 2, 1);
    R(0, TS - 1, TS, 1, '#07070B'); R(TS - 1, 0, 1, TS, '#07070B'); R(0, 0, TS - 1, 1, '#14141C'); R(0, 0, 1, TS - 1, '#14141C');
    contact(open);
  };
  T[TL.DANCE] = function (open, A, B, alt) {
    R(0, 0, TS, TS, '#0A0A0F');
    const q = function (x, y, c) {
      const c0 = dim(c, 0.82), c1 = dim(c, 0.62), c2 = dim(c, 0.42);
      R(x, y, 16, 16, c0); R(x + 2, y + 2, 12, 12, c1); R(x + 5, y + 5, 6, 6, c2); grad(x + 2, y + 2, 12, 12, c1, c0);
      bevel(x, y, 16, 16, dim(c, 0.5), dim(c, 0.9), 1); P(x + 7, y + 7, dim(c, 0.2)); P(x + 8, y + 8, dim(c, 0.2)); P(x + 3, y + 3, dim(c, 0.28));
    };
    if (!alt) { q(0, 0, A); q(16, 16, B); } else { q(16, 0, B); q(0, 16, A); }
    spk(7, 2, dim(A, 0.3), 1, 1);
    R(0, 0, TS, 1, 'rgba(255,255,255,0.04)');
  };
  T[TL.WALL] = function (open, A, B) {
    R(0, 0, TS, TS, '#0E0E13');
    for (let r = 0; r < 4; r++) {
      const off = (r & 1) ? 8 : 0;
      for (let k = -1; k < 3; k++) {
        const x0 = off + k * 16, bx = Math.max(0, x0 + 1), bw = Math.min(TS, x0 + 15) - bx; if (bw <= 0) continue;
        const v = hs(k + 5, r, 61), c = v > 0.66 ? '#1B1B24' : v > 0.33 ? '#18181F' : '#15151C';
        R(bx, r * 8, bw, 7, c); R(bx, r * 8, bw, 1, '#26262F'); R(bx, r * 8 + 6, bw, 1, '#0C0C11'); R(bx, r * 8 + 1, 1, 5, '#202029');
        if (hs(k, r, 62) > 0.7) P(bx + 3 + Math.floor(hs(k, r, 63) * (bw - 6)), r * 8 + 3, '#0F0F14');
      }
      R(0, r * 8 + 7, TS, 1, '#09090D');
    }
    spk(3, 3, '#232330', 1, 1);
    if (open(0, -1)) { R(0, 0, TS, 2, A); R(0, 2, TS, 2, dim(A, 0.6)); R(0, 4, TS, 1, dim(A, 0.85)); }
    if (open(0, 1)) {
      R(0, 22, TS, 10, '#17171F'); R(0, 22, TS, 1, dim(B, 0.1)); R(0, 23, TS, 1, dim(B, 0.55)); R(0, 31, TS, 1, dim(B, 0.5));
      for (let x = 4; x < TS; x += 8) { R(x, 25, 1, 5, '#262630'); R(x + 1, 25, 1, 5, '#0F0F15'); }
      R(0, 24, TS, 1, 'rgba(0,0,0,0.35)');
    }
    if (open(-1, 0)) { R(0, 0, 2, TS, dim(A, 0.35)); R(2, 0, 1, TS, dim(A, 0.75)); }
    if (open(1, 0)) { R(TS - 2, 0, 2, TS, dim(A, 0.35)); R(TS - 3, 0, 1, TS, dim(A, 0.75)); }
  };
  T[TL.BAR] = function (open, A, B) {
    R(0, 0, TS, TS, '#0A0A0E');
    /* bottles on the counter, the counter top, the wooden front */
    [[3, '#2E8B57'], [9, N.amb], [14, '#8A5CFF'], [22, '#2F6BFF'], [27, '#E5332A']].forEach(function (b, i) { const h = 5 + (i * 3) % 4; R(b[0], 2 - Math.min(2, h - 3), 3, h, dim(b[1], 0.2)); R(b[0], 2 - Math.min(2, h - 3), 1, h, b[1]); P(b[0], 2 - Math.min(2, h - 3), '#FFFFFF'); });
    R(0, 5, TS, 14, '#5A3A22'); grad(0, 5, TS, 14, '#6A4529', '#4A2E1A'); R(0, 5, TS, 2, N.amb); R(0, 7, TS, 2, '#9A6A34'); R(0, 9, TS, 1, '#3A2412');
    for (let x = 3; x < TS; x += 7) R(x, 10, 4, 1, 'rgba(255,200,120,0.12)');
    R(0, 19, TS, 13, '#2A1810'); grad(0, 19, TS, 13, '#33201A', '#1E120C'); R(0, 19, TS, 2, N.amb);
    for (let i = 3; i < TS; i += 8) { R(i, 21, 1, 11, '#0F0A07'); R(i + 1, 21, 1, 11, '#3A2418'); }
    R(0, 29, TS, 3, 'rgba(0,0,0,0.4)'); P(8, 13, '#FFD27A'); P(23, 14, '#FFD27A'); R(2, 6, 4, 1, '#FFD9A0');
  };
  T[TL.SPEAKER] = function (open, A, B) {
    R(0, 0, TS, TS, '#0F0F14'); bevel(0, 0, TS, TS, dim(A, 0.3), '#06060A', 2); R(2, 2, TS - 4, TS - 4, '#13131A');
    for (let y = 0; y < TS; y++) for (let x = 0; x < TS; x++) {
      const d = Math.hypot(x - 15.5, y - 17);
      if (d < 3.2) P(x, y, '#06060A');
      else if (d < 7.4) P(x, y, ((x + y) & 1) && d > 6.4 ? '#14141B' : (d > 5.4 ? '#34343F' : '#252530'));
      else if (d < 9.2) P(x, y, '#0A0A0F');
      else if (d >= 11 && d < 13.2) P(x, y, ((x + y) & 1) ? A : dim(A, 0.4));
    }
    P(13, 14, '#4A4A58'); P(14, 13, '#4A4A58'); [[5, 5], [26, 5], [5, 27], [26, 27]].forEach(function (s) { R(s[0], s[1], 2, 2, '#3A3A46'); P(s[0], s[1], '#6A6A78'); });
  };
  T[TL.PILLAR] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D');
    R(4, 0, 24, TS, '#1A1A22');
    for (let x = 4; x < 28; x++) { const t = (x - 4) / 23; R(x, 0, 1, TS, t < 0.2 ? '#2E2E3A' : t < 0.55 ? '#22222C' : t < 0.8 ? '#181820' : '#0F0F15'); }
    R(4, 0, 2, TS, B); R(6, 0, 1, TS, dim(B, 0.5)); R(26, 0, 2, TS, '#07070B');
    R(4, 0, 24, 4, '#3A3A48'); R(4, 4, 24, 1, '#0C0C11'); R(4, 28, 24, 4, '#101016'); R(4, 28, 24, 1, '#34343F');
    R(10, 8, 2, 18, dim(B, 0.55)); P(10, 8, B); R(11, 8, 1, 18, dim(B, 0.3));
  };
  T[TL.COUCH] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D');
    R(0, 2, TS, 10, '#7A1E5A'); grad(0, 2, TS, 10, '#8E2468', '#661648'); R(0, 2, TS, 2, '#C0489A');
    R(0, 12, TS, 16, '#5B1646'); grad(0, 12, TS, 16, '#6C1C54', '#4A1038'); R(0, 12, TS, 1, '#2E0A24');
    R(0, 12, 5, 16, '#8A2A6A'); R(27, 12, 5, 16, '#7A2260'); R(0, 12, 5, 1, '#B0488A'); R(27, 12, 5, 1, '#B0488A');
    R(14, 12, 4, 16, '#3F0F30'); R(15, 12, 1, 16, '#2A0820'); R(0, 28, TS, 3, '#2A0A22'); R(0, 27, TS, 1, '#8A2A6A');
    for (let x = 9; x < 27; x += 8) P(x, 7, '#E070B8');
  };
  T[TL.TILE] = function (open, A, B) {
    R(0, 0, TS, TS, '#0C1A1E');
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { const x = i * 16, y = j * 16; R(x + 1, y + 1, 15, 15, hs(i, j, 8) > 0.5 ? '#10242A' : '#0F2127'); R(x + 1, y + 1, 15, 1, '#24626E'); R(x + 1, y + 1, 1, 15, '#1D5560'); P(x + 5, y + 5, '#2F8A99'); P(x + 6, y + 6, '#27707E'); R(x + 14, y + 14, 2, 2, '#0A161A'); }
    R(0, 0, TS, 1, '#071014'); R(0, 0, 1, TS, '#071014');
    contact(open);
  };
  T[TL.STALL] = function (open, A, B) {
    R(0, 0, TS, TS, '#14222E'); grad(0, 0, TS, TS, '#1A2E3C', '#0F1B25'); R(0, 0, TS, 4, N.cyn); R(0, 4, TS, 1, dim(N.cyn, 0.6));
    R(0, 0, 2, TS, '#0A1118'); R(TS - 2, 0, 2, TS, '#0A1118');
    for (let i = 6; i < 30; i += 6) { R(i, 6, 1, 26, '#0B141C'); R(i + 1, 6, 1, 26, '#243A4A'); }
    R(24, 16, 4, 4, '#9CE8FF'); R(24, 16, 4, 1, '#FFFFFF'); R(24, 19, 4, 1, '#4A8A99'); R(0, 30, TS, 2, 'rgba(0,0,0,0.4)');
  };
  T[TL.SINK] = function (open, A, B) {
    R(0, 0, TS, TS, '#0C1A1E'); R(0, 8, TS, 18, '#E2EAEE'); grad(0, 8, TS, 18, '#EEF4F6', '#BCC8CE'); R(2, 8, TS - 4, 2, '#FFFFFF');
    ellS(16, 18, 11, 6, EM.ramp('#1C3A44')); R(8, 15, 14, 1, '#0E2028');
    R(14, 2, 4, 9, '#B8C4CA'); R(14, 2, 2, 9, '#E4ECF0'); R(14, 2, 4, 2, '#8A98A0'); P(14, 2, '#FFFFFF'); R(15, 10, 2, 3, '#7A8890');
    R(0, 26, TS, 6, '#2B4A55'); R(0, 26, TS, 1, '#5A8A9A'); R(0, 30, TS, 2, '#16282F');
  };
  T[TL.GRASS] = function (open, A, B) {
    R(0, 0, TS, TS, '#0A140D'); grad(0, 0, TS, TS, '#0C1A10', '#08110B');
    spk(5, 24, '#14391F', 1, 2); spk(6, 10, '#2A8A46', 1, 2); spk(7, 8, '#1C5A2E', 1, 2); spk(8, 2, N.lim, 1, 1); spk(9, 1, '#FFFFFF', 1, 1);
    contact(open);
  };
  T[TL.CONC] = function (open, A, B) {
    R(0, 0, TS, TS, '#11131A'); grad(0, 0, TS, TS, '#14161E', '#0E1016');
    spk(7, 14, '#0A0B10', 2, 1); spk(8, 8, '#20242F', 2, 1); spk(10, 4, '#1A1D26', 3, 2);
    if (hs(2, 2, 14) > 0.75) { for (let i = 0; i < 14; i++) { P(4 + i, 10 + Math.floor(Math.sin(i * 0.8) * 2), '#07080C'); P(5 + i, 10 + Math.floor(Math.sin(i * 0.8) * 2), '#252A36'); } }
    R(0, TS - 1, TS, 1, '#0A0B10'); R(TS - 1, 0, 1, TS, '#0A0B10');
    contact(open);
  };
  T[TL.MATT] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D'); R(2, 2, 28, 28, '#2B4A6B'); grad(2, 2, 28, 28, '#33577C', '#223A56');
    R(2, 2, 28, 9, '#F4F4F8'); grad(2, 2, 28, 9, '#FFFFFF', '#D8DCE8'); R(2, 10, 28, 1, '#9AA2B8'); R(2, 2, 28, 1, '#FFFFFF');
    R(2, 17, 28, 1, '#1D3550'); R(2, 18, 28, 1, '#3D6890'); R(2, 28, 28, 2, '#14283C'); R(2, 2, 1, 28, '#4A78A0'); R(29, 2, 1, 28, '#14283C');
    for (let i = 8; i < 28; i += 8) { P(i, 22, '#14283C'); P(i, 23, '#5A88B0'); }
  };
  T[TL.LOCKER] = function (open, A, B) {
    R(0, 0, TS, TS, '#0D1518');
    [2, 17].forEach(function (x) {
      R(x, 2, 13, 28, '#2A5560'); grad(x, 2, 13, 28, '#33666F', '#1F414A'); R(x, 2, 13, 2, '#5A9AA8'); R(x, 2, 1, 28, '#4A8A99'); R(x + 12, 2, 1, 28, '#14303A');
      for (let y = 6; y < 12; y += 2) R(x + 3, y, 7, 1, '#0D1518'); R(x + 3, 12, 7, 1, '#5A9AA8');
      R(x + 10, 15, 2, 6, '#DCE6EA'); R(x + 10, 15, 1, 6, '#FFFFFF'); R(x, 29, 13, 1, '#0A1114');
    });
    R(15, 2, 2, 28, '#07100F');
  };
  T[TL.TABLE] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D'); R(2, 6, 28, 18, '#6B4A2E'); grad(2, 6, 28, 18, '#7A5535', '#5A3E26');
    for (let y = 9; y < 22; y += 4) { R(4, y, 24, 1, '#5A3E26'); R(6 + (y * 3) % 8, y + 1, 8, 1, '#8A6540'); }
    R(2, 6, 28, 2, '#B08A58'); R(2, 6, 28, 1, '#D6AE78'); R(2, 22, 28, 2, '#3B2616'); R(2, 24, 28, 6, '#2A190E'); R(2, 24, 28, 1, '#4A3220'); R(4, 26, 3, 5, '#1A0F08'); R(25, 26, 3, 5, '#1A0F08');
  };
  T[TL.BOOTH] = function (open, A, B) {
    R(0, 0, TS, TS, '#08080C'); R(0, 0, TS, 2, B); R(0, 2, TS, 1, dim(B, 0.6));
    for (let i = 0; i < TS; i += 8) { R(i, 3, 1, 29, '#16161D'); R(i + 1, 3, 1, 29, '#0C0C11'); P(i + 4, 10, '#26262F'); P(i + 4, 22, '#26262F'); }
    P(12, 16, A); P(28, 24, B); R(0, 30, TS, 2, 'rgba(0,0,0,0.5)');
  };
  T[TL.RUG] = function (open, A, B) {
    R(0, 0, TS, TS, '#1A0A12'); R(2, 2, 28, 28, '#2A0F1C'); grad(2, 2, 28, 28, '#33142A', '#220C16');
    R(4, 4, 24, 2, '#8A2E40'); R(4, 26, 24, 2, '#8A2E40'); R(4, 4, 2, 24, '#8A2E40'); R(26, 4, 2, 24, '#8A2E40');
    R(4, 4, 24, 1, '#C04A5E'); R(8, 8, 16, 16, '#3A1424');
    for (let i = 0; i < 8; i++) { P(16 - i, 16 - i, N.amb); P(15 + i, 16 - i, N.amb); P(16 - i, 15 + i, N.amb); P(15 + i, 15 + i, N.amb); }
    R(14, 14, 4, 4, '#6A2234'); P(15, 15, N.amb); P(16, 16, N.amb);
    for (let x = 2; x < 30; x += 3) { R(x, 0, 1, 2, '#C9A66B'); R(x, 30, 1, 2, '#C9A66B'); }
    contact(open);
  };
  T[TL.FENCE] = function (open, A, B) {
    T[TL.SIDEWALK](open, A, B, true);
    R(0, 10, TS, 2, A); R(0, 12, TS, 1, dim(A, 0.5)); R(0, 20, TS, 2, A); R(0, 22, TS, 1, dim(A, 0.5));
    [2, 12, 22].forEach(function (i) { R(i, 6, 4, 24, '#9A9AA8'); R(i, 6, 1, 24, '#E4E4EE'); R(i + 1, 6, 1, 24, '#C0C0CC'); R(i + 3, 6, 1, 24, '#5E5E6C'); R(i, 4, 4, 2, '#EDEDF5'); });
    R(0, 28, TS, 4, 'rgba(4,4,10,0.62)'); for (let x = 0; x < TS; x += 3) P(x, 31, dim(A, 0.55));
  };
  T[TL.STAIRS] = function (open, A, B) {
    for (let i = 0; i < 4; i++) { const y = i * 8, tr = i & 1 ? '#4A4A5A' : '#7A7A8E'; R(0, y, TS, 6, tr); R(0, y, TS, 1, i & 1 ? '#6A6A7C' : '#A0A0B4'); grad(0, y + 1, TS, 5, tr, dim(tr, 0.25)); R(0, y + 6, TS, 2, '#08080C'); }
    R(0, 0, TS, 2, N.lim); R(0, 2, TS, 1, dim(N.lim, 0.6));
  };
  T[TL.BARREL] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D');
    R(4, 12, 24, 20, '#3A3A44'); for (let x = 4; x < 28; x++) { const t = (x - 4) / 23; R(x, 12, 1, 20, t < 0.2 ? '#5A5A68' : t < 0.6 ? '#40404C' : t < 0.85 ? '#2C2C36' : '#1C1C24'); }
    R(4, 12, 24, 2, '#8A8A99'); R(4, 20, 24, 2, '#1A1A20'); R(4, 21, 24, 1, '#55555F'); R(4, 28, 24, 2, '#1A1A20');
    /* the fire in the drum */
    ellS(16, 8, 7, 6, EM.ramp(N.org)); ellS(16, 6, 4.5, 5, EM.ramp(N.yel)); R(15, 1, 3, 4, '#FFFFFF'); P(14, 3, N.yel); P(18, 4, N.yel);
    spk(4, 2, N.org, 1, 1); R(2, 30, 28, 2, 'rgba(0,0,0,0.4)');
  };
  T[TL.PLANT] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D');
    R(10, 20, 12, 12, '#5A3A28'); grad(10, 20, 12, 12, '#6A4430', '#46281A'); R(10, 20, 12, 2, '#8A5A3A'); R(9, 20, 14, 2, '#9A6A44'); R(10, 30, 12, 2, '#2A160C');
    const leaf = function (x, y, rx, ry, c) { ellS(x, y, rx, ry, EM.ramp(c)); };
    leaf(16, 12, 3.4, 8, '#1E8A48'); leaf(9, 12, 6, 2.6, N.grn); leaf(23, 11, 6, 2.6, N.grn); leaf(11, 6, 4, 2, '#1E8A48'); leaf(21, 7, 4, 2, '#1E8A48'); leaf(16, 4, 2.6, 3, N.grn);
    R(16, 14, 1, 7, '#14602F'); R(2, 30, 28, 2, 'rgba(0,0,0,0.3)');
  };
  T[TL.DOORF] = function (open, A, B) {
    R(0, 0, TS, TS, '#08080C'); R(0, 0, TS, 4, N.lim); R(0, 4, TS, 1, dim(N.lim, 0.55));
    [12, 20, 28].forEach(function (y) { R(4, y, 24, 1, dim(N.lim, 0.6)); R(4, y + 1, 24, 1, dim(N.lim, 0.85)); });
    R(0, 0, 2, TS, '#14141A'); R(TS - 2, 0, 2, TS, '#14141A');
  };
  T[TL.BENCH] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D');
    R(0, 10, TS, 8, '#8A5A3A'); grad(0, 10, TS, 8, '#9A6644', '#7A4F32'); R(0, 10, TS, 2, '#C08A5A'); R(0, 14, TS, 1, '#5A3A22'); R(0, 18, TS, 4, '#4A2E1A'); R(0, 18, TS, 1, '#6A4228');
    R(2, 22, 4, 8, '#2A1A10'); R(26, 22, 4, 8, '#2A1A10'); R(2, 22, 1, 8, '#4A3020'); R(26, 22, 1, 8, '#4A3020'); R(0, 30, TS, 2, 'rgba(0,0,0,0.4)');
    for (let x = 4; x < TS; x += 9) P(x, 12, '#B07A4A');
  };
  T[TL.ROAD] = function (open, A, B) {
    R(0, 0, TS, TS, '#0D0D12'); grad(0, 0, TS, TS, '#101016', '#0A0A0F');
    spk(9, 12, '#17171F', 2, 1); spk(10, 8, '#08080C', 2, 1); spk(11, 3, '#1E1E28', 3, 1);
    if (open(0, -1)) { R(0, 0, TS, 6, '#22222C'); R(0, 0, TS, 2, '#3B3B4A'); R(0, 6, TS, 2, '#06060A'); R(0, 8, TS, 2, '#101119'); }
    [[4, 10], [20, 10]].forEach(function (d, i) {
      R(d[0], 14, d[1], 4, N.amb); R(d[0], 14, d[1], 1, shade(N.amb, 0.3)); R(d[0] + 2, 18, d[1] - 4, 2, dim(N.amb, 0.78));
      if (hs(2 + i, 4, 55) > 0.55) P(d[0] + Math.floor(hs(5 + i, 6, 56) * d[1]), 14, '#0D0D12');
    });
    R(0, 28, TS, 2, 'rgba(25,211,255,0.04)');
  };
  T[TL.SIDEWALK] = function (open, A, B, noContact) {
    const tones = ['#15151C', '#17171F', '#13131A', '#191921'];
    for (let q = 0; q < 4; q++) { const qx = (q & 1) * 16, qy = (q >> 1) * 16; R(qx, qy, 16, 16, tones[Math.floor(hs(q & 1, q >> 1, 17) * 4)]); grad(qx, qy, 16, 16, tones[Math.floor(hs(q & 1, q >> 1, 17) * 4)], '#101017'); }
    R(0, 14, TS, 2, '#0C0C12'); R(14, 0, 2, TS, '#0C0C12'); R(0, 30, TS, 2, '#0C0C12'); R(30, 0, 2, TS, '#0C0C12');
    R(0, 0, 14, 1, '#2A2A38'); R(16, 0, 14, 1, '#2A2A38'); R(0, 16, 14, 1, '#2A2A38'); R(16, 16, 14, 1, '#2A2A38');
    R(0, 1, 1, 12, '#202030'); R(16, 1, 1, 12, '#202030'); R(0, 17, 1, 12, '#202030'); R(16, 17, 1, 12, '#202030');
    spk(5, 7, '#23232E', 1, 1); spk(6, 5, '#0F0F15', 2, 1);
    if (hs(2, 3, 23) > 0.84) { for (let i = 0; i < 16; i++) { P(4 + i, 6 + Math.floor(i * 0.9), '#09090E'); P(5 + i, 6 + Math.floor(i * 0.9), '#1F1F2B'); } }
    if (hs(4, 1, 29) > 0.93) R(20, 8, 3, 3, '#2B2233');
    if (!noContact) contact(open);
  };
  T[TL.CURTAIN] = function (open, A, B) {
    R(0, 0, TS, TS, '#14060A');
    for (let i = 0; i < TS; i += 8) { R(i, 3, 3, 29, '#9A2234'); R(i + 3, 3, 3, 29, '#5A1220'); R(i + 6, 3, 2, 29, '#2A0810'); R(i, 3, 1, 29, '#C4384C'); }
    R(0, 0, TS, 4, '#C9A66B'); R(0, 0, TS, 1, '#F0DCA0'); R(0, 4, TS, 1, '#6A5226');
  };
  T[TL.MIRROR] = function (open, A, B) {
    R(0, 0, TS, TS, '#0C1A1E'); R(2, 2, 28, 22, '#2F4F5A'); grad(2, 2, 28, 22, '#A8D0DC', '#4A7A8A');
    for (let i = 0; i < 8; i++) { R(6 + i * 4, 20 - i * 2, 3, 1, '#EAF8FF'); R(8 + i * 4, 21 - i * 2, 2, 1, '#FFFFFF'); }
    bevel(2, 2, 28, 22, '#E8F6FF', '#2A4650', 1); bevel(1, 1, 30, 24, '#6A8A96', '#0A1418', 1);
    R(0, 24, TS, 8, '#0C1A1E'); R(0, 30, TS, 2, '#2F8A99');
  };
  T[TL.RAIL] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D'); R(0, 12, TS, 4, '#E8E8F0'); R(0, 12, TS, 1, '#FFFFFF'); R(0, 15, TS, 1, '#9A9AAA');
    for (let i = 2; i < TS; i += 10) { R(i, 16, 2, 16, '#6A6A7C'); R(i, 16, 1, 16, '#9A9AAC'); }
    R(0, 30, TS, 2, 'rgba(0,0,0,0.4)');
  };
  T[TL.CRATE] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D'); R(2, 4, 28, 26, '#6B4A2E'); grad(2, 4, 28, 26, '#7A5535', '#5A3E26');
    R(2, 4, 28, 2, N.amb); R(2, 16, 28, 2, '#3B2616'); R(14, 4, 2, 26, '#3B2616'); R(2, 28, 28, 2, '#2A190E');
    for (let i = 0; i < 4; i++) { P(4 + i * 7, 8 + (i % 2) * 14, '#C0C0CC'); P(5 + i * 7, 20, '#2A190E'); }
    R(2, 6, 1, 22, '#8A6540'); R(29, 6, 1, 22, '#3B2616');
  };
  T[TL.SKY] = function (open, A, B) {
    R(0, 0, TS, TS, '#05060F'); grad(0, 0, TS, TS, '#05060F', '#0A0E24');
    spk(11, 4, '#6A7AA8', 1, 1);
    if (hs(1, 1, 3) > 0.7) { R(8, 8, 2, 2, '#FFFFFF'); P(7, 9, '#9AA8D8'); P(10, 9, '#9AA8D8'); P(9, 7, '#9AA8D8'); P(9, 10, '#9AA8D8'); }
  };

  /* ------------------------------------------------------------ the home tileset: daylight, wood, plaster, linen */
  function wood(i, j) {
    R(0, 0, TS, TS, '#B98A58');
    for (let r = 0; r < 2; r++) {
      const y = r * 16, v = hs(i + r, j, 21), c = v > 0.66 ? '#C29360' : v > 0.33 ? '#BA8C5A' : '#B38455';
      R(0, y, TS, 15, c); R(0, y, TS, 1, '#D3A674'); R(0, y + 15, TS, 1, '#8F6439');
      const off = Math.floor(hs(j, r, 22) * 20) + 6; R(off, y, 1, 15, '#8F6439');
      spk(24 + r, 3, '#A97B4B', 4, 1);
    }
  }
  T[TL.HFLOOR] = function (open) { wood(TX, TY); };
  T[TL.HWALL] = function (open) {
    R(0, 0, TS, TS, '#D9CFBF');
    if (open(0, 1)) {
      R(0, 0, TS, TS, '#EDE4D4'); R(0, 0, TS, 2, '#FAF4E8');
      spk(31, 4, '#E2D8C6', 3, 1);
      R(0, 24, TS, 8, '#F8F3EA'); R(0, 24, TS, 1, '#FFFFFF'); R(0, 31, TS, 1, '#B9AE9B'); R(0, 25, TS, 1, '#DAD0BE');
      R(0, 22, TS, 2, 'rgba(120,100,70,0.12)');
    } else { R(0, 0, TS, TS, '#CFC4B2'); R(0, 0, TS, 1, '#E8DFCF'); R(0, TS - 1, TS, 1, '#A89C86'); }
    if (open(-1, 0)) R(0, 0, 2, TS, '#BFB4A0');
    if (open(1, 0)) R(TS - 2, 0, 2, TS, '#BFB4A0');
  };
  T[TL.HRUG] = function (open) {
    /* seamless, so a large rug reads as one rug: cream weave, a blue lattice, a small terracotta diamond in every cell */
    R(0, 0, TS, TS, '#E4D8BE');
    for (let k = 0; k < TS; k += 4) { R(0, k, TS, 1, '#DCCFB2'); }
    R(0, 15, TS, 1, '#B4BFCB'); R(15, 0, 1, TS, '#B4BFCB');
    for (let i = 0; i < 5; i++) { P(8 - i, 8 - i, '#C8715A'); P(7 + i, 8 - i, '#C8715A'); P(8 - i, 7 + i, '#C8715A'); P(7 + i, 7 + i, '#C8715A'); }
    R(7, 7, 2, 2, '#EFE6D0');
    for (let i = 0; i < 5; i++) { P(24 - i, 24 - i, '#C8715A'); P(23 + i, 24 - i, '#C8715A'); P(24 - i, 23 + i, '#C8715A'); P(23 + i, 23 + i, '#C8715A'); }
    R(23, 23, 2, 2, '#EFE6D0');
  };
  T[TL.HTILE] = function (open) {
    R(0, 0, TS, TS, '#B9C9CE');
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { const x = i * 16, y = j * 16; R(x + 1, y + 1, 15, 15, hs(i, j, 8) > 0.5 ? '#F0F5F6' : '#E7EFF1'); R(x + 1, y + 1, 15, 1, '#FFFFFF'); R(x + 1, y + 15, 15, 1, '#CFDBDF'); }
  };
  T[TL.HCOUCH] = function (open) {
    wood(TX, TY);
    R(0, 4, TS, 24, '#5F8A78'); grad(0, 4, TS, 24, '#78A090', '#4A7060'); R(0, 4, TS, 3, '#9CC0AE'); R(0, 26, TS, 2, '#34504A');
    R(14, 8, 4, 18, '#4A7060'); R(0, 8, 4, 20, '#6C9684'); R(28, 8, 4, 20, '#6C9684'); R(0, 28, TS, 3, '#6E4A2A'); R(0, 4, TS, 1, '#C4DDCF');
    for (let x = 8; x < 28; x += 10) { R(x, 10, 6, 6, '#E8B46A'); R(x, 10, 6, 1, '#F6D49A'); }
  };
  T[TL.HBED] = function (open) {
    /* seamless: the bed is three tiles tall in every room (pillows on the first row, a quilted blanket below) */
    wood(TX, TY);
    R(0, 0, TS, TS, '#EDE6D8');
    if (TY === 3) { R(3, 4, 12, 10, '#FFFFFF'); R(17, 4, 12, 10, '#FFFFFF'); R(3, 13, 12, 1, '#D8D2C4'); R(17, 13, 12, 1, '#D8D2C4'); R(0, 18, TS, 14, '#7DA0C4'); R(0, 18, TS, 2, '#B7CEE4'); }
    else { R(0, 0, TS, TS, '#7DA0C4'); grad(0, 0, TS, TS, '#8FB0D0', '#6A8FB6'); }
    for (let k = 4; k < TS; k += 8) { R(k, 0, 1, TS, 'rgba(60,90,130,0.22)'); R(0, k, TS, 1, 'rgba(60,90,130,0.22)'); }
  };
  T[TL.HTABLE] = function (open) {
    wood(TX, TY);
    R(1, 4, 30, 18, '#D8B07A'); grad(1, 4, 30, 18, '#E2BC86', '#C99D66'); R(1, 4, 30, 2, '#F0D2A2'); R(1, 22, 30, 2, '#9C7444'); R(3, 24, 3, 7, '#8E653A'); R(26, 24, 3, 7, '#8E653A');
    spk(41, 3, '#B98A58', 5, 1);
  };
  T[TL.HCOUNTER] = function (open) {
    R(0, 0, TS, TS, '#C9D8D0');
    R(0, 2, TS, 10, '#F3EFE6'); R(0, 2, TS, 2, '#FFFFFF'); R(0, 12, TS, 1, '#C4BCAA');
    R(0, 13, TS, 19, '#8FB3A4'); grad(0, 13, TS, 19, '#9CBFB0', '#7AA190'); R(0, 13, TS, 1, '#6B9080');
    R(2, 16, 12, 13, '#86AA9A'); R(18, 16, 12, 13, '#86AA9A'); R(2, 16, 12, 1, '#B2D0C2'); R(18, 16, 12, 1, '#B2D0C2'); R(13, 22, 2, 3, '#F3EFE6'); R(17, 22, 2, 3, '#F3EFE6');
  };
  T[TL.HSPEAKER] = function (open) {
    wood(TX, TY);
    R(5, 2, 22, 28, '#6A4A2E'); grad(5, 2, 22, 28, '#7A583A', '#573B24'); R(5, 2, 22, 2, '#9A7650'); R(5, 28, 22, 2, '#3B2616');
    R(10, 6, 12, 12, '#26221E'); R(12, 8, 8, 8, '#3A342E'); R(15, 11, 2, 2, '#8A8070'); R(12, 21, 8, 6, '#26221E'); R(14, 23, 4, 2, '#3A342E');
  };
  T[TL.HCOATS] = function (open) {
    wood(TX, TY);
    R(3, 8, 26, 20, '#C75B4A'); R(8, 4, 18, 14, '#4B6A8C'); R(14, 10, 14, 14, '#E8B46A'); R(5, 20, 14, 8, '#6E8F72');
    R(3, 8, 26, 1, '#E08A78'); R(8, 4, 18, 1, '#7F9DBF'); R(14, 10, 14, 1, '#F6D49A'); R(3, 27, 26, 1, '#7A3328');
    for (let i = 8; i < 28; i += 6) P(i, 14, '#33201A');
  };
  T[TL.HPLANT] = function (open) {
    wood(TX, TY);
    R(10, 18, 12, 12, '#B8663F'); R(10, 18, 12, 2, '#D88A5E'); R(10, 28, 12, 2, '#7A3F22');
    ellS(16, 11, 10, 9, { h2: '#9ED79A', h: '#6FB46C', b: '#4C9455', s: '#357543', s2: '#245832' });
  };
  T[TL.HDOOR] = function (open) {
    wood(TX, TY);
    R(4, 0, 24, TS, '#8A5A34'); R(4, 0, 24, 2, '#B07C4C'); R(6, 4, 9, 11, '#9A6A40'); R(17, 4, 9, 11, '#9A6A40'); R(6, 18, 9, 11, '#9A6A40'); R(17, 18, 9, 11, '#9A6A40');
    R(24, 16, 3, 3, '#E8C46A'); R(0, 0, 4, TS, '#F3EFE6'); R(28, 0, 4, TS, '#F3EFE6');
  };
  T[TL.HTOILET] = function (open) {
    R(0, 0, TS, TS, '#E4EEF0');
    R(8, 2, 16, 10, '#FFFFFF'); R(8, 2, 16, 1, '#F3F7F8'); R(8, 11, 16, 1, '#C4D0D4'); R(10, 12, 12, 14, '#FFFFFF'); R(9, 24, 14, 4, '#E4EEF0'); R(10, 12, 1, 14, '#E4EEF0'); R(21, 12, 1, 14, '#C4D0D4');
  };
  T[TL.HSINK] = function (open) {
    R(0, 0, TS, TS, '#E4EEF0');
    R(4, 14, 24, 6, '#FFFFFF'); R(4, 14, 24, 1, '#F3F7F8'); R(6, 20, 20, 4, '#C4D0D4'); R(14, 8, 4, 6, '#9CAAB0'); R(10, 2, 12, 5, '#B4D2E0'); R(10, 2, 12, 1, '#E4F2F8');
  };
  T[TL.HSKY] = function (open) {
    R(0, 0, TS, TS, '#8FC4E8'); grad(0, 0, TS, TS, '#7AB6E2', '#BEDDF0');
    if (hs(2, 2, 5) > 0.55) { R(6, 10, 18, 5, '#FFFFFF'); R(10, 7, 10, 4, '#FFFFFF'); R(6, 14, 18, 1, '#D8E8F4'); }
  };
  T[TL.HRAIL] = function (open) {
    R(0, 0, TS, TS, '#BEDDF0'); R(0, 0, TS, 8, '#8FC4E8');
    R(0, 12, TS, 3, '#2F3438'); R(0, 12, TS, 1, '#5A6268'); for (let x = 3; x < TS; x += 8) R(x, 15, 2, 17, '#2F3438');
    R(0, 28, TS, 4, '#B07C4C');
  };
  T[TL.HBALC] = function (open) {
    R(0, 0, TS, TS, '#C98A62');
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { const x = i * 16, y = j * 16; R(x + 1, y + 1, 15, 15, hs(i, j, 9) > 0.5 ? '#D9966A' : '#D18F63'); R(x + 1, y + 1, 15, 1, '#E8B088'); R(x + 1, y + 15, 15, 1, '#A8714A'); }
  };

  /* th: { a, b } accent colours of the room. ox, oy: the tile's top-left in device pixels. */
  EM.drawTile = function (ctx, t, ox, oy, tx, ty, open, th) {
    th = th || { a: N.mag, b: N.cyn };
    g = ctx; TX = tx; TY = ty;
    g.save(); g.translate(ox, oy);
    if (t === 'DANCE_B') T[TL.DANCE](open, th.a, th.b, true);
    else if (T[t]) T[t](open, th.a, th.b);
    else R(0, 0, TS, TS, '#050508');
    g.restore();
  };

  /* the street scene's facade: lit and unlit windows, and a lamp over the door (device pixels) */
  EM.decorateZone = function (z, ctx) {
    if (z.id !== 'doors') return;
    g = ctx;
    const win = function (x, y, lit, tone) {
      const w = 24, h = 18;
      R(x - 2, y - 2, w + 4, h + 4, '#08080D'); R(x - 2, y + h, w + 4, 2, '#2A2A38'); R(x - 2, y + h + 2, w + 4, 1, '#14141C');
      if (lit) {
        R(x, y, w, h, shade(tone, -0.6)); grad(x + 1, y + 1, w - 2, h - 2, shade(tone, -0.1), shade(tone, -0.45)); R(x + 1, y + 1, w - 2, 3, tone);
        R(x + 11, y, 2, h, '#14121A'); R(x, y + 8, w, 1, '#14121A');
        R(x + 3, y + 9, 5, 7, shade(tone, -0.62)); R(x + 4, y + 7, 3, 3, shade(tone, -0.62)); R(x + 15, y + 8, 5, 8, shade(tone, -0.62)); R(x + 16, y + 6, 3, 3, shade(tone, -0.62));
        R(x - 4, y + h + 3, w + 8, 8, 'rgba(255,200,120,0.07)');
      } else { R(x, y, w, h, '#0C0E1A'); grad(x, y, w, h, '#10142A', '#080A14'); R(x + 11, y, 2, h, '#07070C'); R(x, y + 8, w, 1, '#07070C'); R(x + 2, y + 2, 8, 2, '#1E2442'); }
    };
    const tones = ['#FFB84A', '#FF5FB0', '#4FD8FF', '#FFB84A'];
    [6, 38, 70, 102, 236, 268, 300].forEach(function (lx, i) {
      const x = lx * RS, lit1 = EM.hash2(i, 1, 77) > 0.45, lit2 = EM.hash2(i, 2, 77) > 0.5;
      win(x, 14, lit1, tones[Math.floor(EM.hash2(i, 3, 77) * 4)]);
      if (lx < 120 || lx > 220) win(x, 58, lit2, tones[Math.floor(EM.hash2(i, 4, 77) * 4)]);
    });
    const lx = 27 * TS + 16;
    R(lx - 2, 92, 6, 4, '#222230'); R(lx - 6, 96, 14, 4, '#FFE9B0'); R(lx - 6, 96, 14, 1, '#FFFFFF'); R(lx - 28, 100, 58, 24, 'rgba(255,225,150,0.10)'); R(lx - 18, 100, 38, 14, 'rgba(255,225,150,0.10)');
  };
})();

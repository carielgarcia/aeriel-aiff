/* EXCUSE ME — procedural pixel art: people (tall, coloured, detailed), tiles, icons, mini font.
   The environment stays dark; the people are the colour. */
'use strict';
(function () {
  const EM = window.EM;
  const C = EM.PAL;

  function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  EM.mkCanvas = mk;

  /* ------------------------------------------------------------ colour helpers */
  const NAMED = { K: '#0A0A0A', D: '#121212', G: '#7F7F7F', W: '#FFFFFF' };
  function col(c) { return NAMED[c] || c; }
  const shadeCache = {};
  const ART16 = !!EM.ART16;
  function shade(hex, f) {
    const key = hex + f;
    if (shadeCache[key]) return shadeCache[key];
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    if (ART16) {
      /* 16-bit ramps: shadows drift toward cool blue-violet, highlights toward warm light, instead of just darker and lighter */
      if (f < 0) { const t = Math.min(1, -f); r = r * (1 + f) * (1 - 0.14 * t); g = g * (1 + f) * (1 - 0.06 * t); b = b * (1 + f) * (1 + 0.14 * t) + 12 * t; }
      else { r = r + (255 - r) * f; g = g + (255 - g) * f * 0.94; b = b + (255 - b) * f * 0.76; }
      r = Math.max(0, Math.min(255, Math.round(r))); g = Math.max(0, Math.min(255, Math.round(g))); b = Math.max(0, Math.min(255, Math.round(b)));
    } else if (f < 0) { r = Math.round(r * (1 + f)); g = Math.round(g * (1 + f)); b = Math.round(b * (1 + f)); }
    else { r = Math.round(r + (255 - r) * f); g = Math.round(g + (255 - g) * f); b = Math.round(b + (255 - b) * f); }
    return (shadeCache[key] = '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase());
  }
  EM.shade = shade;

  /* the palette: neon accents on a black world */
  const N = EM.NEON = { mag: '#FF2D95', cyn: '#19D3FF', lim: '#B6FF3B', amb: '#FFB020', vio: '#8A5CFF', red: '#FF3B30', org: '#FF6A00', blu: '#2F6BFF', teal: '#00C2A8', grn: '#2ED36A', pnk: '#FF7AB8', yel: '#FFD23F' };

  EM.SKINS = ['#FFE0C9', '#F4C79B', '#DDA66F', '#B97A4F', '#8A5634', '#5A3622'];
  EM.HAIRS = ['#171717', '#4A2E1A', '#7A4B2A', '#E9C46A', '#D9622B', '#A9A9B3', '#F2F2F2', '#FF4FA3', '#3D7BFF', '#14C8B0'];
  EM.CLOTHES = ['#F4F4F4', '#141414', '#FF2D95', '#19D3FF', '#B6FF3B', '#FFB020', '#8A5CFF', '#FF3B30', '#2F6BFF', '#00C2A8', '#FF6A00', '#E8DFC8'];
  EM.BOTTOMS = ['#2F4F9F', '#141414', '#555560', '#7A2E3A', '#2E5E3A', '#6B4B2A', '#FF2D95', '#19D3FF', '#8A5CFF', '#E8DFC8'];
  EM.LOOK = { skin: 6, hair: 9, hc: 10, expr: 6, top: 11, tc: 12, bottom: 6, bc: 10, acc: 8 };
  const DEFAULT_BC = [0, 1, 2, 3, 4, 1];

  /* ------------------------------------------------------------ people */
  function rectF(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
  function pxF(g, x, y, c) { g.fillStyle = c; g.fillRect(x, y, 1, 1); }
  /* a 3x5 pixel emblem on the chest (the volunteers' RD T-shirts): look.tee = letters, look.teeC = colour (default white; 'neon' uses the accent) */
  const TEE = { R: '111101111110101', D: '110101101101110', C: '011100100100011', O: '010101101101010' };
  function emblem(g, look, K, x0, x1, tc) {
    const t = look.tee; if (!t) return;
    const w = t.length * 4 - 1, x = x0 + Math.floor((x1 - x0 + 1 - w) / 2), y = 17;
    rectF(g, x0 + 1, y - 1, x1 - x0 - 1, 7, tc);
    const c = look.teeC === 'neon' ? K.accent : (look.teeC || '#FFFFFF');
    for (let n = 0; n < t.length; n++) { const gl = TEE[t[n]]; if (!gl) continue; for (let i = 0; i < 15; i++) if (gl[i] === '1') pxF(g, x + n * 4 + (i % 3), y + Math.floor(i / 3), c); }
  }

  /* Raw canvas is 16x32; feet end at row 31. Outline adds 1px all around. */
  function drawFront(g, look, dir, frame, pose, K) {
    const back = dir === 'u';
    const wide = !!look.wide;
    const tx0 = wide ? 2 : 3, tx1 = wide ? 13 : 12; /* torso columns, inclusive */
    const dance = pose === 'dance';
    const skin = K.skin, skinD = K.skinD, skinL = K.skinL;

    /* ---- legs and shoes ---- */
    const lUp = frame === 1 ? 1 : 0, rUp = frame === 2 ? 1 : 0;
    const bot = look.bottom | 0;
    const bc = K.bc, bcD = shade(bc, -0.3), bcL = shade(bc, 0.2);
    function leg(x0, up) {
      const top = 24, bottom = 29 - up;
      if (bot === 2) { rectF(g, x0, top, 4, 3, bc); rectF(g, x0, top + 3, 4, bottom - top - 2, skin); rectF(g, x0, bottom - 1, 4, 1, '#F4F4F4'); rectF(g, x0 + 3, top + 3, 1, bottom - top - 2, skinD); }
      else if (bot === 3) { rectF(g, x0, top + 3, 4, bottom - top - 2, skin); rectF(g, x0 + 3, top + 3, 1, bottom - top - 2, skinD); rectF(g, x0, bottom - 1, 4, 1, '#F4F4F4'); }
      else {
        rectF(g, x0, top, 4, bottom - top + 1, bc); rectF(g, x0 + 3, top, 1, bottom - top + 1, bcD);
        if (bot === 5) { rectF(g, x0 + 1, top + 1, 1, bottom - top - 1, shade(bc, 0.45)); }
        if (bot === 4) { rectF(g, x0, top + 2, 3, 2, bcL); rectF(g, x0, top + 2, 3, 1, bcD); pxF(g, x0 + 1, top + 3, shade(bc, 0.35)); }
        if (bot === 0) { pxF(g, x0 + 1, top + 3, bcL); pxF(g, x0 + 1, top + 4, bcL); }
      }
      /* shoes: sneakers with a coloured sole, or boots */
      const sy = bottom + 1;
      if (bot === 5) { rectF(g, x0 - (x0 < 8 ? 1 : 0), sy, 5, 2, '#0C0C0C'); pxF(g, x0 + 1, sy, '#9A9AA5'); }
      else { rectF(g, x0 - (x0 < 8 ? 1 : 0), sy, 5, 1, '#F2F2F2'); rectF(g, x0 - (x0 < 8 ? 1 : 0), sy + 1, 5, 1, K.accent); }
    }
    leg(4, lUp); leg(8, rUp);
    if (bot === 1 || bot === 0 || bot === 4 || bot === 5) rectF(g, 7, 24, 2, 1, bcD); /* crotch seam */
    /* skirt / dress hem */
    if (bot === 3 || look.top === 7) {
      const sc = look.top === 7 ? K.tc : bc;
      rectF(g, 2, 23, 12, 3, sc); rectF(g, 3, 26, 10, 1, sc); rectF(g, 2, 25, 12, 1, shade(sc, -0.25)); rectF(g, 3, 26, 10, 1, shade(sc, -0.25));
      for (let x = 3; x < 13; x += 3) pxF(g, x, 24, shade(sc, 0.25));
    }

    /* ---- torso ---- */
    const tc = K.tc, tcD = shade(tc, -0.3), tcL = shade(tc, 0.22);
    const ts = look.top | 0;
    const accent = K.accent;
    function torsoBase(c, h) { rectF(g, tx0, 15, tx1 - tx0 + 1, h || 9, c); rectF(g, tx0 + 1, 15, tx1 - tx0 - 1, 1, shade(c, 0.12)); rectF(g, tx1, 16, 1, (h || 9) - 1, shade(c, -0.22)); rectF(g, tx0, 16, 1, (h || 9) - 2, shade(c, 0.08)); }
    let sleeve = 'short', sleeveC = tc;
    if (ts === 0) { torsoBase(tc); pxF(g, 6, 18, accent); pxF(g, 7, 18, accent); pxF(g, 6, 19, accent); /* chest logo */ rectF(g, 7, 15, 2, 2, skin); pxF(g, 7, 17, skinD); }
    else if (ts === 1) { /* tank */ torsoBase(tc, 7); rectF(g, tx0, 15, 3, 2, skin); rectF(g, tx1 - 2, 15, 3, 2, skin); rectF(g, 6, 15, 4, 2, skin); sleeve = 'bare'; }
    else if (ts === 2) { torsoBase(tc); for (let y = 17; y < 24; y += 2) rectF(g, tx0, y, tx1 - tx0 + 1, 1, accent === tc ? '#F4F4F4' : accent); rectF(g, 7, 15, 2, 2, skin); }
    else if (ts === 3) { torsoBase(tc); rectF(g, 4, 14, 8, 2, tcL); rectF(g, 5, 19, 6, 3, tcD); pxF(g, 7, 16, '#F4F4F4'); pxF(g, 8, 16, '#F4F4F4'); pxF(g, 7, 17, '#F4F4F4'); pxF(g, 8, 17, '#F4F4F4'); sleeve = 'long'; }
    else if (ts === 4) { /* mesh over skin */ rectF(g, tx0, 15, tx1 - tx0 + 1, 9, skin); for (let y = 15; y < 24; y++) for (let x = tx0; x <= tx1; x++) if (((x + y) & 1) === 0) pxF(g, x, y, tc); rectF(g, tx1, 16, 1, 8, skinD); sleeve = 'mesh'; }
    else if (ts === 5) { /* harness */ rectF(g, tx0, 15, tx1 - tx0 + 1, 9, skin); rectF(g, tx1, 16, 1, 8, skinD); for (let i = 0; i < 8; i++) { pxF(g, tx0 + 1 + i, 16 + i, '#141414'); pxF(g, tx1 - 1 - i, 16 + i, '#141414'); } rectF(g, tx0, 22, tx1 - tx0 + 1, 2, '#141414'); pxF(g, 7, 22, tc); pxF(g, 8, 22, tc); pxF(g, 7, 19, tc); sleeve = 'bare'; }
    else if (ts === 6) { /* crop top */ torsoBase(tc, 5); rectF(g, tx0, 20, tx1 - tx0 + 1, 4, skin); rectF(g, tx1, 20, 1, 4, skinD); pxF(g, 7, 22, skinD); sleeve = 'short'; }
    else if (ts === 7) { torsoBase(tc, 8); rectF(g, 7, 15, 2, 2, skin); rectF(g, tx0, 22, tx1 - tx0 + 1, 1, tcD); sleeve = 'bare'; }
    else if (ts === 8) { /* hi-vis vest over dark tee */ torsoBase('#1B1B1B'); rectF(g, tx0 + 1, 15, 3, 9, K.tc); rectF(g, tx1 - 3, 15, 3, 9, K.tc); rectF(g, tx0 + 1, 19, 3, 1, '#F4F4F4'); rectF(g, tx1 - 3, 19, 3, 1, '#F4F4F4'); rectF(g, tx0, 22, tx1 - tx0 + 1, 1, '#F4F4F4'); sleeveC = '#1B1B1B'; }
    else if (ts === 9) { /* leather jacket */ torsoBase(tc); rectF(g, 4, 15, 2, 5, tcL); rectF(g, 10, 15, 2, 5, tcL); rectF(g, 7, 16, 2, 8, '#1B1B1B'); rectF(g, 8, 16, 1, 8, '#B8B8C0'); rectF(g, tx0, 15, 1, 2, tcL); rectF(g, tx1, 15, 1, 2, tcD); sleeve = 'long'; }
    else { /* volunteer vest with cross */ torsoBase('#F4F4F4'); rectF(g, 7, 17, 2, 5, '#FF3B30'); rectF(g, 5, 19, 6, 2, '#FF3B30'); sleeve = 'short'; sleeveC = '#F4F4F4'; }
    if (look.tee && !back) emblem(g, look, K, tx0, tx1, tc);

    /* ---- arms ---- */
    const shoulderY = 15;
    let lAy = shoulderY + 1, rAy = shoulderY + 1;
    if (frame === 1) { lAy -= 1; rAy += 1; } else if (frame === 2) { lAy += 1; rAy -= 1; }
    const armX0 = wide ? 0 : 1, armX1 = wide ? 14 : 13;
    function arm(x0, y0, side) {
      const len = 7;
      let sc = sleeveC;
      if (dance) { /* raised: bent up */
        const ys = side === 'l' ? 8 : 8;
        const hx = side === 'l' ? x0 - 1 : x0 + 1;
        rectF(g, x0, 12, 2, 4, sleeve === 'bare' || sleeve === 'short' ? skin : sc);
        rectF(g, hx, ys + 1, 2, 4, sleeve === 'bare' || sleeve === 'short' ? skin : sc);
        rectF(g, hx, ys - 1, 2, 2, skin);
        return;
      }
      const sleeveLen = sleeve === 'long' || sleeve === 'mesh' ? 6 : (sleeve === 'short' ? 3 : 0);
      rectF(g, x0, y0, 2, len, skin); rectF(g, x0 + (side === 'l' ? 0 : 1), y0, 1, len, skinD);
      if (sleeveLen) {
        if (sleeve === 'mesh') { for (let y = 0; y < sleeveLen; y++) for (let x = 0; x < 2; x++) if (((x + y) & 1) === 0) pxF(g, x0 + x, y0 + y, tc); }
        else { rectF(g, x0, y0, 2, sleeveLen, sc); rectF(g, x0 + (side === 'l' ? 0 : 1), y0, 1, sleeveLen, shade(sc, -0.22)); if (sleeve === 'long') { rectF(g, x0, y0 + sleeveLen - 1, 2, 1, shade(sc, -0.35)); } }
      }
      rectF(g, x0, y0 + len - 2, 2, 2, skin); /* hand */
      pxF(g, x0 + (side === 'l' ? 1 : 0), y0 + len - 1, skinD);
    }
    arm(armX0, lAy, 'l'); arm(armX1, rAy, 'r');

    /* ---- neck, head ---- */
    rectF(g, 7, 14, 2, 2, skinD);
    function head() {
      rectF(g, 4, 5, 8, 8, skin);
      rectF(g, 5, 4, 6, 1, skin); rectF(g, 5, 13, 6, 1, skin); rectF(g, 6, 14, 4, 1, skinD);
      rectF(g, 4, 5, 1, 8, skinL); rectF(g, 11, 5, 1, 8, skinD); rectF(g, 6, 13, 4, 1, skinD);
      rectF(g, 3, 8, 1, 3, skinD); rectF(g, 12, 8, 1, 3, skinD); /* ears */
    }
    head();

    /* ---- face (front only) ---- */
    const ex = look.expr | 0;
    if (!back) {
      const eyeDark = K.skinIdx >= 4 ? '#0A0A0A' : '#1B1B1B';
      const lid = skinD;
      function eye(x, big) {
        rectF(g, x, 8, 2, big ? 3 : 2, '#FFFFFF');
        rectF(g, x + 1, 8, 1, big ? 3 : 2, K.eye);
        pxF(g, x + 1, 8, eyeDark);
        if (K.hairIdx !== undefined) {}
      }
      if (ex === 4) { /* tired: heavy lids and bags */
        rectF(g, 5, 8, 2, 1, '#FFFFFF'); rectF(g, 9, 8, 2, 1, '#FFFFFF'); pxF(g, 6, 8, K.eye); pxF(g, 10, 8, K.eye);
        rectF(g, 5, 7, 2, 1, lid); rectF(g, 9, 7, 2, 1, lid); rectF(g, 5, 9, 2, 1, shade(skin, -0.12)); rectF(g, 9, 9, 2, 1, shade(skin, -0.12));
      } else if (ex === 5) { eye(5, true); eye(9, true); }
      else { eye(5, false); eye(9, false); }
      /* brows */
      const bw = K.hairBrow;
      if (ex === 3) { rectF(g, 5, 6, 2, 1, bw); rectF(g, 9, 5, 2, 1, bw); }
      else if (ex === 5) { rectF(g, 5, 5, 2, 1, bw); rectF(g, 9, 5, 2, 1, bw); }
      else if (ex === 4) { rectF(g, 5, 6, 2, 1, bw); rectF(g, 9, 6, 2, 1, bw); pxF(g, 5, 6, shade(bw, 0.3)); }
      else { rectF(g, 5, 6, 2, 1, bw); rectF(g, 9, 6, 2, 1, bw); }
      /* nose */
      pxF(g, 8, 10, skinD); pxF(g, 7, 10, skinL);
      /* mouth */
      const lip = '#B24A4A', mo = '#5A1E1E';
      if (ex === 0) { rectF(g, 7, 12, 2, 1, lip); }
      else if (ex === 1) { pxF(g, 6, 11, lip); rectF(g, 7, 12, 2, 1, lip); pxF(g, 9, 11, lip); pxF(g, 5, 10, shade(skin, -0.0)); }
      else if (ex === 2) { rectF(g, 6, 11, 4, 2, '#FFFFFF'); rectF(g, 6, 11, 4, 1, '#F4F4F4'); rectF(g, 6, 13, 4, 1, mo); pxF(g, 5, 11, mo); pxF(g, 10, 11, mo); rectF(g, 6, 12, 4, 1, '#E8E8E8'); }
      else if (ex === 3) { rectF(g, 7, 12, 2, 1, lip); pxF(g, 9, 11, lip); pxF(g, 10, 10, lip); }
      else if (ex === 4) { rectF(g, 7, 12, 2, 1, lip); pxF(g, 6, 13, lip); pxF(g, 9, 13, lip); }
      else { rectF(g, 7, 11, 2, 2, mo); pxF(g, 7, 11, lip); pxF(g, 8, 11, lip); }
      /* blush for smiles */
      if (ex === 1 || ex === 2) { pxF(g, 5, 10, '#FF8FA3'); pxF(g, 10, 10, '#FF8FA3'); }
    }

    /* ---- hair ---- */
    const hair = K.hair, hairD = shade(hair, -0.32), hairL = shade(hair, 0.28);
    const hs = look.hair | 0;
    function H(x, y, w, h, c) { rectF(g, x, y, w, h, c || hair); }
    function shine(x, y, w) { rectF(g, x, y, w, 1, hairL); }
    if (back) {
      /* the back of the head is all hair (or scalp) */
      if (hs === 0) { rectF(g, 5, 4, 6, 1, skinL); }
      else {
        H(4, 4, 8, 9); H(5, 3, 6, 1); H(3, 6, 1, 5); H(12, 6, 1, 5);
        if (hs === 3 || hs === 7) { H(3, 6, 10, 9); H(2, 8, 1, 8); H(13, 8, 1, 8); }
        if (hs === 4) { H(1, 0, 14, 12); H(2, 12, 2, 2); H(12, 12, 2, 2); }
        if (hs === 5) { H(7, 0, 2, 5, hair); rectF(g, 4, 5, 8, 6, skin); H(7, 1, 2, 10, hair); }
        if (hs === 6) { H(6, 0, 4, 3); }
        if (hs === 8) { H(1, 9, 3, 7); H(12, 9, 3, 7); }
        if (hs === 1) { rectF(g, 4, 9, 8, 4, skin); H(4, 4, 8, 5); }
        shine(6, 4, 3); rectF(g, 8, 8, 3, 1, hairD); rectF(g, 5, 10, 5, 1, hairD);
      }
    } else if (hs === 1) { H(5, 4, 6, 2); rectF(g, 4, 5, 1, 4, hair); rectF(g, 11, 5, 1, 4, hair); for (let x = 5; x < 11; x += 2) pxF(g, x, 6, hair); shine(6, 4, 2); }
    else if (hs === 2) { H(4, 3, 8, 4); H(5, 2, 6, 1); H(3, 5, 1, 5); H(12, 5, 1, 5); H(4, 7, 2, 1); H(10, 7, 2, 1); pxF(g, 7, 7, hair); shine(5, 3, 4); rectF(g, 8, 4, 3, 1, hairD); rectF(g, 11, 5, 1, 4, hairD); }
    else if (hs === 3) { H(4, 3, 8, 4); H(5, 2, 6, 1); H(2, 5, 2, 13); H(12, 5, 2, 13); H(4, 7, 2, 1); H(10, 7, 2, 1); shine(5, 3, 4); rectF(g, 13, 7, 1, 9, hairD); rectF(g, 2, 9, 1, 6, hairL); rectF(g, 8, 4, 3, 1, hairD); }
    else if (hs === 4) { H(2, 1, 12, 8); H(1, 3, 14, 5); H(3, 0, 10, 2); H(3, 9, 2, 3); H(11, 9, 2, 3); for (let i = 0; i < 12; i++) pxF(g, 2 + (i * 5) % 12, 1 + (i * 3) % 6, i % 2 ? hairL : hairD); rectF(g, 4, 6, 8, 1, hair); }
    else if (hs === 5) { H(7, 0, 2, 4); H(6, 2, 4, 3); rectF(g, 7, 0, 1, 3, hairL); H(4, 5, 8, 1, hairD); }
    else if (hs === 6) { H(4, 3, 8, 4); H(5, 2, 6, 1); H(3, 5, 1, 4); H(12, 5, 1, 4); H(6, 0, 4, 3); shine(6, 0, 2); shine(5, 3, 4); H(4, 7, 2, 1); H(10, 7, 2, 1); }
    else if (hs === 7) { H(4, 3, 8, 4); H(5, 2, 6, 1); H(3, 5, 2, 9); H(11, 5, 2, 9); H(4, 7, 3, 1); H(9, 7, 3, 1); H(7, 6, 2, 1); shine(5, 3, 4); rectF(g, 3, 9, 1, 4, hairL); rectF(g, 12, 9, 1, 4, hairD); }
    else if (hs === 8) { H(4, 3, 8, 4); H(5, 2, 6, 1); H(3, 5, 1, 4); H(12, 5, 1, 4); H(4, 7, 2, 1); H(10, 7, 2, 1); H(1, 8, 2, 7); H(13, 8, 2, 7); pxF(g, 2, 7, K.accent); pxF(g, 13, 7, K.accent); shine(5, 3, 4); rectF(g, 2, 14, 1, 2, hairD); rectF(g, 13, 14, 1, 2, hairD); }
    if (hs === 0 && !back) { rectF(g, 6, 4, 3, 1, skinL); }

    /* ---- accessories ---- */
    const ac = look.acc | 0;
    const A = K.accent;
    if (ac === 1 && !back) { rectF(g, 4, 7, 8, 3, '#101014'); rectF(g, 3, 7, 1, 1, '#101014'); rectF(g, 12, 7, 1, 1, '#101014'); rectF(g, 5, 8, 2, 1, A); rectF(g, 9, 8, 2, 1, A); pxF(g, 5, 7, '#FFFFFF'); pxF(g, 9, 7, '#FFFFFF'); rectF(g, 7, 8, 2, 1, '#101014'); }
    else if (ac === 1 && back) { rectF(g, 3, 7, 10, 1, '#101014'); }
    else if (ac === 2) { rectF(g, 4, 2, 8, 4, A); rectF(g, 5, 1, 6, 1, A); rectF(g, 4, 5, 8, 1, shade(A, -0.3)); if (!back) { rectF(g, 3, 6, 10, 1, shade(A, -0.4)); pxF(g, 7, 3, '#FFFFFF'); pxF(g, 8, 3, '#FFFFFF'); } rectF(g, 5, 2, 3, 1, shade(A, 0.3)); }
    else if (ac === 3) { rectF(g, 4, 4, 8, 2, A); pxF(g, 6, 4, '#FFFFFF'); pxF(g, 9, 5, '#FFFFFF'); pxF(g, 7, 5, '#101014'); rectF(g, 12, 5, 2, 2, A); pxF(g, 13, 7, shade(A, -0.3)); }
    else if (ac === 4) { rectF(g, 4, 2, 8, 1, '#1B1B1F'); rectF(g, 3, 3, 1, 6, '#1B1B1F'); rectF(g, 12, 3, 1, 6, '#1B1B1F'); rectF(g, 1, 6, 3, 5, A); rectF(g, 12, 6, 3, 5, A); rectF(g, 1, 6, 3, 1, shade(A, 0.3)); rectF(g, 13, 10, 1, 1, shade(A, -0.4)); }
    else if (ac === 5) { rectF(g, 5, 14, 6, 1, '#E7C65A'); rectF(g, 6, 15, 4, 1, '#E7C65A'); rectF(g, 7, 16, 2, 1, '#E7C65A'); rectF(g, 7, 17, 2, 2, '#FFD23F'); pxF(g, 7, 17, '#FFFFFF'); pxF(g, 3, 21, '#E7C65A'); pxF(g, 12, 21, '#E7C65A'); }
    else if (ac === 6 && !back) { rectF(g, 5, 10, 2, 1, A); rectF(g, 9, 10, 2, 1, N.cyn === A ? N.mag : N.cyn); pxF(g, 4, 9, '#FFFFFF'); pxF(g, 11, 9, '#FFFFFF'); pxF(g, 6, 11, N.yel); pxF(g, 10, 11, N.lim); }
    else if (ac === 7) { rectF(g, 4, 2, 8, 4, A); rectF(g, 5, 1, 6, 1, A); rectF(g, 4, 5, 8, 1, shade(A, -0.35)); for (let x = 4; x < 12; x += 2) pxF(g, x, 4, shade(A, -0.2)); pxF(g, 7, 0, '#FFFFFF'); pxF(g, 8, 0, '#FFFFFF'); }
    else if (ac === 8) { rectF(g, 15, 2, 1, 29, '#C9A66B'); rectF(g, 13, 28, 3, 3, '#BFBFC8'); rectF(g, 13, 30, 3, 1, '#7F7F88'); }
  }

  /* side view, facing right. Left is the mirror. */
  function drawSide(g, look, frame, pose, K) {
    const skin = K.skin, skinD = K.skinD, skinL = K.skinL;
    const dance = pose === 'dance';
    const bot = look.bottom | 0, bc = K.bc, bcD = shade(bc, -0.3);
    /* legs: back leg, front leg */
    const fwd = frame === 1 ? 2 : (frame === 2 ? -2 : 0);
    function leg(x0, up, back) {
      const top = 24, bottom = 29 - up;
      const c = back ? bcD : bc;
      if (bot === 2) { rectF(g, x0, top, 4, 3, c); rectF(g, x0, top + 3, 4, bottom - top - 2, back ? skinD : skin); }
      else if (bot === 3) { rectF(g, x0, top + 3, 4, bottom - top - 2, back ? skinD : skin); }
      else rectF(g, x0, top, 4, bottom - top + 1, c);
      const sy = bottom + 1;
      if (bot === 5) { rectF(g, x0, sy, 6, 2, '#0C0C0C'); }
      else { rectF(g, x0, sy, 6, 1, '#F2F2F2'); rectF(g, x0, sy + 1, 6, 1, K.accent); }
    }
    leg(6 - fwd, frame === 2 ? 1 : 0, true); leg(6 + fwd, frame === 1 ? 1 : 0, false);
    if (bot === 3 || look.top === 7) { const sc = look.top === 7 ? K.tc : bc; rectF(g, 4, 23, 9, 3, sc); rectF(g, 4, 25, 9, 1, shade(sc, -0.25)); }
    /* torso */
    const tc = K.tc, ts = look.top | 0;
    const bare = ts === 4 || ts === 5 || ts === 1;
    rectF(g, 5, 15, 7, 9, bare ? skin : tc); rectF(g, 5, 15, 1, 9, shade(bare ? skin : tc, 0.08)); rectF(g, 11, 16, 1, 8, shade(bare ? skin : tc, -0.22));
    if (ts === 2) for (let y = 17; y < 24; y += 2) rectF(g, 5, y, 7, 1, K.accent === tc ? '#F4F4F4' : K.accent);
    if (ts === 3) { rectF(g, 4, 14, 5, 2, shade(tc, 0.22)); rectF(g, 6, 19, 5, 3, shade(tc, -0.3)); }
    if (ts === 4) { for (let y = 15; y < 24; y++) for (let x = 5; x <= 11; x++) if (((x + y) & 1) === 0) pxF(g, x, y, tc); }
    if (ts === 5) { for (let i = 0; i < 7; i++) pxF(g, 5 + i, 16 + i, '#141414'); rectF(g, 5, 22, 7, 2, '#141414'); }
    if (ts === 6) { rectF(g, 5, 20, 7, 4, skin); }
    if (ts === 8) { rectF(g, 5, 15, 7, 9, '#1B1B1B'); rectF(g, 6, 15, 4, 9, tc); rectF(g, 6, 19, 4, 1, '#F4F4F4'); rectF(g, 5, 22, 7, 1, '#F4F4F4'); }
    if (ts === 9) { rectF(g, 5, 15, 7, 9, tc); rectF(g, 8, 16, 1, 8, '#B8B8C0'); rectF(g, 5, 15, 2, 4, shade(tc, 0.25)); }
    if (ts === 10) { rectF(g, 5, 15, 7, 9, '#F4F4F4'); rectF(g, 8, 18, 2, 4, '#FF3B30'); rectF(g, 7, 19, 4, 2, '#FF3B30'); }
    if (look.tee) emblem(g, look, K, 5, 11, tc);
    /* arm (front) */
    const swing = frame === 1 ? -2 : (frame === 2 ? 2 : 0);
    const sleeve = (ts === 3 || ts === 9) ? 6 : ((ts === 0 || ts === 2 || ts === 6 || ts === 8 || ts === 10) ? 3 : 0);
    const sc = ts === 8 ? '#1B1B1B' : (ts === 10 ? '#F4F4F4' : tc);
    if (dance) { rectF(g, 8, 8, 3, 8, sleeve ? sc : skin); rectF(g, 8, 6, 3, 3, skin); }
    else {
      rectF(g, 7 + swing, 16, 3, 7, skin); rectF(g, 9 + swing, 16, 1, 7, skinD);
      if (sleeve) { rectF(g, 7 + swing, 16, 3, sleeve, sc); rectF(g, 9 + swing, 16, 1, sleeve, shade(sc, -0.22)); }
      rectF(g, 7 + swing, 21, 3, 2, skin);
    }
    /* neck + head */
    rectF(g, 7, 14, 3, 2, skinD);
    rectF(g, 4, 5, 8, 8, skin); rectF(g, 5, 4, 6, 1, skin); rectF(g, 5, 13, 6, 1, skin);
    rectF(g, 4, 5, 1, 8, skinL); rectF(g, 11, 6, 1, 7, skinD);
    pxF(g, 12, 9, skin); pxF(g, 12, 10, skinD); /* nose */
    rectF(g, 6, 8, 2, 2, skinD); pxF(g, 6, 8, shade(skinD, -0.2)); /* ear */
    const ex = look.expr | 0;
    rectF(g, 9, 8, 2, ex === 5 ? 3 : 2, '#FFFFFF'); rectF(g, 10, 8, 1, ex === 5 ? 3 : 2, K.eye);
    if (ex === 4) { rectF(g, 9, 7, 2, 1, skinD); }
    rectF(g, 9, 6 - (ex === 5 ? 1 : 0), 2, 1, K.hairBrow);
    const lip = '#B24A4A';
    if (ex === 2) { rectF(g, 10, 11, 2, 2, '#FFFFFF'); pxF(g, 12, 11, '#5A1E1E'); } else if (ex === 1) { pxF(g, 10, 12, lip); pxF(g, 11, 12, lip); pxF(g, 12, 11, lip); } else if (ex === 5) { rectF(g, 10, 11, 2, 2, '#5A1E1E'); } else rectF(g, 10, 12, 2, 1, lip);
    /* hair: back volume, fringe */
    const hair = K.hair, hairD = shade(hair, -0.32), hairL = shade(hair, 0.28);
    const hs = look.hair | 0;
    function H(x, y, w, h, c) { rectF(g, x, y, w, h, c || hair); }
    if (hs === 1) { H(5, 4, 6, 2); H(4, 5, 2, 4); }
    else if (hs === 2) { H(4, 3, 8, 4); H(5, 2, 6, 1); H(3, 5, 3, 6); H(10, 6, 2, 1); rectF(g, 5, 3, 4, 1, hairL); }
    else if (hs === 3) { H(4, 3, 8, 4); H(5, 2, 6, 1); H(2, 5, 4, 13); H(10, 6, 2, 1); rectF(g, 5, 3, 4, 1, hairL); rectF(g, 2, 9, 1, 8, hairD); }
    else if (hs === 4) { H(2, 1, 11, 9); H(1, 3, 12, 6); H(3, 0, 9, 2); for (let i = 0; i < 10; i++) pxF(g, 2 + (i * 5) % 11, 1 + (i * 3) % 7, i % 2 ? hairL : hairD); }
    else if (hs === 5) { H(7, 0, 2, 4); H(5, 2, 5, 3); rectF(g, 7, 0, 1, 3, hairL); }
    else if (hs === 6) { H(4, 3, 8, 4); H(5, 2, 6, 1); H(3, 5, 3, 5); H(5, 0, 4, 3); rectF(g, 5, 0, 2, 1, hairL); }
    else if (hs === 7) { H(4, 3, 8, 4); H(5, 2, 6, 1); H(3, 5, 4, 9); H(10, 6, 2, 1); rectF(g, 5, 3, 4, 1, hairL); }
    else if (hs === 8) { H(4, 3, 8, 4); H(5, 2, 6, 1); H(3, 5, 3, 5); H(1, 8, 3, 7); pxF(g, 2, 7, K.accent); rectF(g, 5, 3, 4, 1, hairL); }
    /* accessories (side) */
    const ac = look.acc | 0, A = K.accent;
    if (ac === 1) { rectF(g, 8, 7, 4, 3, '#101014'); rectF(g, 4, 7, 5, 1, '#101014'); rectF(g, 10, 8, 1, 1, A); }
    else if (ac === 2) { rectF(g, 4, 2, 8, 4, A); rectF(g, 5, 1, 6, 1, A); rectF(g, 11, 5, 4, 1, shade(A, -0.35)); }
    else if (ac === 3) { rectF(g, 4, 4, 8, 2, A); rectF(g, 2, 5, 3, 2, A); }
    else if (ac === 4) { rectF(g, 4, 2, 8, 1, '#1B1B1F'); rectF(g, 5, 6, 3, 5, A); rectF(g, 5, 6, 3, 1, shade(A, 0.3)); }
    else if (ac === 5) { rectF(g, 6, 14, 5, 1, '#E7C65A'); rectF(g, 8, 15, 3, 1, '#E7C65A'); rectF(g, 9, 16, 2, 2, '#FFD23F'); }
    else if (ac === 6) { rectF(g, 9, 10, 2, 1, A); pxF(g, 9, 9, '#FFFFFF'); pxF(g, 10, 11, N.lim); }
    else if (ac === 7) { rectF(g, 4, 2, 8, 4, A); rectF(g, 5, 1, 6, 1, A); rectF(g, 4, 5, 8, 1, shade(A, -0.35)); pxF(g, 7, 0, '#FFFFFF'); }
    else if (ac === 8) { rectF(g, 13, 2, 1, 29, '#C9A66B'); rectF(g, 11, 28, 3, 3, '#BFBFC8'); }
  }

  function kit(look) {
    const sk = (look.skin | 0) % 6;
    const skin = EM.SKINS[sk];
    const hairIdx = (look.hc | 0) % 10;
    const hair = EM.HAIRS[hairIdx];
    const tcIdx = (look.tc === undefined ? 0 : look.tc) % 12;
    const bcIdx = (look.bc === undefined ? DEFAULT_BC[look.bottom | 0] : look.bc) % 10;
    const acc = [N.mag, N.cyn, N.lim, N.amb, N.vio, N.org, N.red, N.teal, N.yel][(look.ac === undefined ? (tcIdx + 3) : look.ac) % 9];
    return {
      skin: skin, skinD: shade(skin, -0.2), skinL: shade(skin, 0.12), skinIdx: sk,
      hair: hair, hairIdx: hairIdx, hairBrow: shade(hair, hairIdx === 6 || hairIdx === 3 ? -0.55 : -0.25),
      tc: EM.CLOTHES[tcIdx], bc: EM.BOTTOMS[bcIdx],
      eye: sk >= 4 ? '#1A0F0A' : (hairIdx === 3 || hairIdx === 6 ? '#2F6B9F' : '#2A1A10'),
      accent: look.accentHex || acc
    };
  }

  function drawRaw(look, dir, frame, pose) {
    const c = mk(16, 32); const g = c.getContext('2d');
    const K = kit(look);
    if (dir === 'l' || dir === 'r') {
      if (dir === 'l') { g.translate(16, 0); g.scale(-1, 1); }
      drawSide(g, look, frame, pose, K);
    } else drawFront(g, look, dir, frame, pose, K);
    return c;
  }

  /* 16-bit finishing pass on the raw 16x32 sprite:
     1. a checkerboard of the shadow tone beside every shadow line, inside big flat areas only (faces stay clean),
     2. a sheen on the hair, a little blush on the cheeks (front view),
     3. a two-tone neon rim light: magenta on the right edge, cyan on the left, like a club. */
  function finishPass(raw, look, dir, K) {
    const w = raw.width, h = raw.height, g = raw.getContext('2d');
    const im = g.getImageData(0, 0, w, h), d = im.data, o = new Uint8ClampedArray(d);
    const at = function (x, y) { if (x < 0 || y < 0 || x >= w || y >= h) return null; const i = (y * w + x) * 4; return d[i + 3] > 0 ? [d[i], d[i + 1], d[i + 2]] : null; };
    const same = function (a, b) { return !!a && !!b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; };
    const darker = function (a, b) { if (!a || !b) return false; const k = [0, 1, 2].map(function (c) { return a[c] > 20 ? b[c] / a[c] : 0.7; }); return Math.max.apply(null, k) < 0.93 && Math.min.apply(null, k) > 0.5 && Math.max.apply(null, k) - Math.min.apply(null, k) < 0.22; };
    const rgbOf = function (hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
    const put = function (x, y, c) { const i = (y * w + x) * 4; o[i] = c[0]; o[i + 1] = c[1]; o[i + 2] = c[2]; };
    const mixc = function (a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };
    const hair = rgbOf(K.hair), skin = rgbOf(K.skin);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const p = at(x, y); if (!p) continue;
      /* 1. dithered ramp, interior pixels only */
      if (((x + y) & 1) === 0 && same(p, at(x - 1, y)) && same(p, at(x, y - 1)) && (darker(p, at(x + 1, y)) || darker(p, at(x, y + 1)))) put(x, y, [p[0] * 0.9, p[1] * 0.93, Math.min(255, p[2] * 0.96 + 3)]);
      /* 2. hair sheen (top-left of the head), cheek blush */
      if (same(p, hair) && y >= 3 && y <= 8 && x >= 3 && x <= 8 && ((x + y * 2) % 4 === 0)) put(x, y, mixc(hair, [255, 244, 214], 0.34));
      if (dir === 'd' && same(p, skin) && y === 11 && (x === 5 || x === 10)) put(x, y, mixc(skin, [255, 96, 140], 0.34));
      /* 3. neon rim light on the silhouette edges (not on the sprite's darkest pixels) */
      if (p[0] + p[1] + p[2] > 90) {
        if (!at(x + 1, y)) put(x, y, mixc(p, [255, 80, 175], 0.30));
        else if (!at(x - 1, y)) put(x, y, mixc(p, [70, 215, 255], 0.26));
      }
    }
    im.data.set(o); g.putImageData(im, 0, 0);
  }
  function outline(raw, colr) {
    const w = raw.width, h = raw.height;
    const out = mk(w + 2, h + 2); const g = out.getContext('2d');
    const src = raw.getContext('2d').getImageData(0, 0, w, h).data;
    function on(x, y) { return x >= 0 && y >= 0 && x < w && y < h && src[(y * w + x) * 4 + 3] > 0; }
    /* 16-bit: the outline takes the colour of the material it hugs, darkened and cooled, instead of one black for everything */
    function hexAt(x, y) { const i = (y * w + x) * 4; return '#' + ((1 << 24) | (src[i] << 16) | (src[i + 1] << 8) | src[i + 2]).toString(16).slice(1).toUpperCase(); }
    g.fillStyle = colr || '#050508';
    for (let y = -1; y <= h; y++) for (let x = -1; x <= w; x++) {
      if (on(x, y)) continue;
      if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) {
        if (ART16 && !colr) {
          const nx = on(x - 1, y) ? x - 1 : (on(x + 1, y) ? x + 1 : x), ny = on(x, y - 1) ? y - 1 : (on(x, y + 1) ? y + 1 : y);
          g.fillStyle = on(x, y - 1) ? '#07060D' : shade(hexAt(on(x - 1, y) || on(x + 1, y) ? nx : x, on(x - 1, y) || on(x + 1, y) ? y : ny), -0.84);
        }
        g.fillRect(x + 1, y + 1, 1, 1);
      }
    }
    g.drawImage(raw, 1, 1);
    return out;
  }

  const cache = {};
  /* pose: 'stand' | 'dance' | 'lie' | 'sit'. Returns a canvas 18x34 (feet at the bottom row). */
  EM.PERSON_W = 18; EM.PERSON_H = 34;
  EM.person = function (look, dir, frame, pose) {
    const key = [look.skin, look.hair, look.hc, look.expr, look.top, look.tc, look.bottom, look.bc, look.acc, look.accentHex || '', look.tee || '', look.teeC || '', look.wide ? 1 : 0, look.ol || '', dir, frame, pose || ''].join(',');
    let c = cache[key];
    if (c) return c;
    const raw = drawRaw(look, dir === 'u' || dir === 'l' || dir === 'r' ? dir : 'd', frame, pose);
    if (ART16) finishPass(raw, look, dir, kit(look));
    const base = outline(raw, look.ol);
    if (pose === 'lie') {
      const r = mk(base.height, base.width); const g = r.getContext('2d');
      g.translate(0, base.width); g.rotate(-Math.PI / 2); g.drawImage(base, 0, 0);
      c = r;
    } else if (pose === 'sit') {
      const r = mk(base.width, base.height - 7); const g = r.getContext('2d');
      g.drawImage(base, 0, 0, base.width, base.height - 12, 0, 0, base.width, base.height - 12);
      g.drawImage(base, 0, base.height - 5, base.width, 5, 0, base.height - 12, base.width, 5);
      c = r;
    } else c = base;
    cache[key] = c;
    return c;
  };

  /* ------------------------------------------------------------ mini font 3x5 */
  const FONT = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
    E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
    I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100',
    Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
    U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111',
    '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '110001010001110',
    '4': '101101111001001', '5': '111100110001110', '6': '011100111101111', '7': '111001010010010',
    '8': '111101111101111', '9': '111101111001110', ':': '000010000010000', '-': '000000111000000',
    'Ñ': '110101101101101', '.': '000000000000010', '>': '100010001010100', '<': '001010100010001', '!': '010010010000010', ' ': '000000000000000'
  };
  EM.textWidth = function (s) { return s.length * 4 - 1; };
  EM.drawText = function (g, s, x, y, colr) {
    g.fillStyle = col(colr || 'W');
    for (let n = 0; n < s.length; n++) {
      const gl = FONT[s[n].toUpperCase()];
      if (!gl) continue;
      if (s[n].toUpperCase() === 'Ñ') { g.fillRect(x + n * 4, y - 1, 1, 1); g.fillRect(x + n * 4 + 1, y - 2, 1, 1); g.fillRect(x + n * 4 + 2, y - 1, 1, 1); }
      for (let i = 0; i < 15; i++) if (gl[i] === '1') g.fillRect(x + n * 4 + (i % 3), y + Math.floor(i / 3), 1, 1);
    }
  };

  /* ------------------------------------------------------------ icons 8x8 */
  const ICONS = {
    wave: ['..#.#.#.', '.##.#.#.', '.#######', '.#######', '.#######', '..######', '...####.', '...###..'],
    point: ['..#.....', '..#.....', '..#.....', '..###...', '..#####.', '..######', '...#####', '....###.'],
    hug: ['.##..##.', '########', '########', '########', '.######.', '..####..', '...##...', '........'],
    water: ['...##...', '...##...', '..####..', '..#..#..', '..####..', '..####..', '..####..', '..####..'],
    phone: ['.#####..', '.#...#..', '.#...#..', '.#...#..', '.#...#..', '.#...#..', '.#####..', '...#....'],
    thumb: ['...##...', '...##...', '..###...', '######..', '######..', '######..', '######..', '.####...'],
    palm: ['.#.#.#..', '.#.#.#.#', '.#####.#', '.######.', '.######.', '..#####.', '...###..', '...###..'],
    heart: ['.##..##.', '########', '########', '########', '.######.', '..####..', '...##...', '........'],
    skull: ['.######.', '########', '#.####.#', '########', '.######.', '..#..#..', '..####..', '........'],
    zzz: ['.####...', '...#....', '..#.....', '.####...', '.....###', '......#.', '.....###', '........'],
    note: ['...####.', '...#..#.', '...#....', '...#....', '.###....', '####....', '.##.....', '........'],
    exclam: ['...##...', '...##...', '...##...', '...##...', '...##...', '........', '...##...', '...##...'],
    question: ['..####..', '.##..##.', '.....##.', '....##..', '...##...', '........', '...##...', '...##...'],
    sweat: ['...#....', '..###...', '.#####..', '.#####..', '..###...', '........', '........', '........'],
    spark: ['...#....', '...#....', '.#####..', '...#....', '...#....', '........', '........', '........'],
    pill: ['..####..', '.#####..', '.####.#.', '.###.##.', '..#.###.', '...####.', '....###.', '........'],
    cig: ['........', '........', '........', '########', '########', '........', '........', '........'],
    drink: ['########', '.######.', '..####..', '...##...', '...##...', '...##...', '..####..', '........'],
    cross: ['..####..', '..####..', '########', '########', '########', '########', '..####..', '..####..'],
    shield: ['########', '########', '########', '########', '.######.', '..####..', '...##...', '........'],
    eyes: ['........', '.##..##.', '#..##..#', '#.#..#.#', '#..##..#', '.##..##.', '........', '........'],
    mute: ['..#.....', '.##...#.', '###..#..', '###.#...', '###..#..', '.##...#.', '..#.....', '........'],
    door: ['.######.', '.#....#.', '.#....#.', '.#....#.', '.#...##.', '.#....#.', '.#....#.', '.######.'],
    breath: ['.#....#.', '..#..#..', '...##...', '.######.', '...##...', '..#..#..', '.#....#.', '........'],
    up: ['...##...', '..####..', '.######.', '########', '...##...', '...##...', '...##...', '...##...'],
    star: ['...##...', '...##...', '########', '.######.', '..####..', '.##..##.', '.#....#.', '........'],
    hand: ['..#.#...', '..#.#.#.', '.##.#.#.', '.#######', '.#######', '..######', '...####.', '...###..'],
    anger: ['#..##..#', '.#....#.', '..#..#..', '#.#..#.#', '#.#..#.#', '..#..#..', '.#....#.', '#..##..#']
  };
  /* default colour per icon so signs of life are never grey */
  const ICON_COLOR = { heart: N.mag, hug: N.mag, water: N.cyn, spark: N.yel, note: N.mag, exclam: N.yel, question: N.cyn, skull: '#EDEDED', zzz: N.vio, eyes: N.cyn, cross: N.red, pill: N.lim, sweat: N.cyn, drink: N.amb, door: N.lim, star: N.yel, breath: N.cyn, anger: N.red };
  const iconCache = {};
  EM.icon = function (name, colr) {
    const k = name + (colr || '');
    if (iconCache[k]) return iconCache[k];
    const rows = ICONS[name] || ICONS.question;
    const c = mk(8, 8); const g = c.getContext('2d');
    g.fillStyle = col(colr && colr !== 'W' ? colr : (ICON_COLOR[name] || '#FFFFFF'));
    if (colr === 'G') g.fillStyle = '#7F7F7F';
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (rows[y][x] === '#') g.fillRect(x, y, 1, 1);
    iconCache[k] = c;
    return c;
  };
  EM.hasIcon = function (n) { return !!ICONS[n]; };

  /* arrows (11x11) for dance prompts, one colour per direction */
  const arrowCache = {};
  const ARROW_COLOR = { L: N.mag, R: N.cyn, U: N.lim, D: N.amb };
  EM.arrow = function (d, colr) {
    const k = d + (colr || 'W');
    if (arrowCache[k]) return arrowCache[k];
    const c = mk(11, 11); const g = c.getContext('2d');
    g.fillStyle = colr === 'G' ? '#6A6A75' : (colr === 'D' ? '#2A2A33' : ARROW_COLOR[d]);
    const rows = ['.....#.....', '....###....', '...#####...', '..#######..', '.....#.....', '.....#.....', '.....#.....', '.....#.....', '...........', '...........', '...........'];
    for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) {
      if (rows[y][x] !== '#') continue;
      let X = x, Y = y;
      if (d === 'D') Y = 10 - y; else if (d === 'L') { X = y; Y = x; } else if (d === 'R') { X = 10 - y; Y = x; }
      g.fillRect(X, Y, 1, 1);
    }
    arrowCache[k] = c;
    return c;
  };
  EM.arrowColor = function (d) { return ARROW_COLOR[d]; };

  /* ------------------------------------------------------------ tiles: a black world with neon trim */
  const TL = EM.TL = {
    VOID: 0, FLOOR: 1, DANCE: 2, WALL: 3, BAR: 4, SPEAKER: 5, PILLAR: 6, COUCH: 7, TILE: 8, STALL: 9,
    SINK: 10, GRASS: 11, CONC: 12, MATT: 13, LOCKER: 14, TABLE: 15, BOOTH: 16, RUG: 17, FENCE: 18,
    STAIRS: 19, BARREL: 20, PLANT: 21, DOORF: 22, BENCH: 23, ROAD: 24, SIDEWALK: 25, CURTAIN: 26,
    MIRROR: 27, RAIL: 28, CRATE: 29, SKY: 30
  };
  const SOLID = {};
  [TL.VOID, TL.WALL, TL.BAR, TL.SPEAKER, TL.PILLAR, TL.COUCH, TL.STALL, TL.SINK, TL.LOCKER, TL.TABLE, TL.FENCE,
    TL.BARREL, TL.PLANT, TL.BENCH, TL.ROAD, TL.MIRROR, TL.RAIL, TL.CRATE, TL.SKY].forEach(function (t) { SOLID[t] = true; });
  EM.isSolidTile = function (t) { return !!SOLID[t]; };

  function specks(g, seed, n, c, tx, ty) {
    for (let i = 0; i < n; i++) {
      const x = Math.floor(EM.hash2(tx * 7 + i, ty * 13 + i, seed) * 16);
      const y = Math.floor(EM.hash2(tx * 11 + i, ty * 5 + i * 3, seed + 9) * 16);
      pxF(g, x, y, c);
    }
  }
  function dim(hex, f) { return shade(hex, -f); }

  /* ------------------------------------------------------------ 16-bit tiles (prototype) */
  function slab16(g, tx, ty) {
    const tones = ['#15151C', '#17171F', '#13131A', '#191921'];
    for (let q = 0; q < 4; q++) { const qx = (q & 1) * 8, qy = (q >> 1) * 8; rectF(g, qx, qy, 8, 8, tones[Math.floor(EM.hash2(tx * 2 + (q & 1), ty * 2 + (q >> 1), 17) * 4)]); }
    rectF(g, 0, 7, 16, 1, '#0C0C12'); rectF(g, 7, 0, 1, 16, '#0C0C12'); rectF(g, 0, 15, 16, 1, '#0C0C12'); rectF(g, 15, 0, 1, 16, '#0C0C12');
    rectF(g, 0, 0, 7, 1, '#262633'); rectF(g, 8, 0, 7, 1, '#262633'); rectF(g, 0, 8, 7, 1, '#262633'); rectF(g, 8, 8, 7, 1, '#262633');
    rectF(g, 0, 1, 1, 6, '#1E1E29'); rectF(g, 8, 1, 1, 6, '#1E1E29'); rectF(g, 0, 9, 1, 6, '#1E1E29'); rectF(g, 8, 9, 1, 6, '#1E1E29');
    specks(g, 5, 4, '#23232E', tx, ty); specks(g, 6, 3, '#0F0F15', tx, ty);
    if (EM.hash2(tx, ty, 23) > 0.86) { for (let i = 0; i < 9; i++) { pxF(g, 2 + i, 3 + i + (i > 4 ? -1 : 0), '#0A0A0F'); pxF(g, 3 + i, 3 + i + (i > 4 ? -1 : 0), '#1F1F2A'); } }
    if (EM.hash2(tx, ty, 29) > 0.94) { rectF(g, 10, 4, 2, 2, '#2B2233'); }
  }
  /* returns true when the tile was drawn here */
  function art16Tile(g, t, tx, ty, open, A, B) {
    const h = function (i) { return EM.hash2(tx * 3 + i, ty * 5 + i * 2, 41); };
    if (t === TL.SIDEWALK) {
      slab16(g, tx, ty);
      return true;
    }
    if (t === TL.ROAD) {
      rectF(g, 0, 0, 16, 16, '#0D0D12'); specks(g, 9, 6, '#17171F', tx, ty); specks(g, 10, 4, '#08080C', tx, ty);
      if (open(0, -1)) { rectF(g, 0, 0, 16, 3, '#22222C'); rectF(g, 0, 0, 16, 1, '#3B3B4A'); rectF(g, 0, 3, 16, 1, '#06060A'); rectF(g, 0, 4, 16, 1, '#111119'); }
      [[2, 5], [10, 5]].forEach(function (d, i) {
        rectF(g, d[0], 7, d[1], 2, N.amb); rectF(g, d[0], 7, d[1], 1, shade(N.amb, 0.25)); rectF(g, d[0] + 1, 9, d[1] - 2, 1, shade(N.amb, -0.78));
        if (h(2 + i) > 0.55) pxF(g, d[0] + Math.floor(h(5 + i) * d[1]), 7, '#0D0D12');
      });
      return true;
    }
    if (t === TL.FENCE) {
      slab16(g, tx, ty);
      rectF(g, 0, 5, 16, 1, A); rectF(g, 0, 6, 16, 1, dim(A, 0.5)); rectF(g, 0, 10, 16, 1, A); rectF(g, 0, 11, 16, 1, dim(A, 0.5));
      [1, 6, 11].forEach(function (i) { rectF(g, i, 3, 2, 12, '#9A9AA8'); rectF(g, i, 3, 1, 12, '#D8D8E2'); rectF(g, i + 1, 3, 1, 12, '#5E5E6C'); rectF(g, i, 2, 2, 1, '#EDEDF5'); });
      rectF(g, 0, 14, 16, 2, 'rgba(4,4,10,0.62)');
      for (let x = 0; x < 16; x += 3) pxF(g, x, 15, dim(A, 0.55));
      return true;
    }
    return false;
  }
  /* bricks that are not all the same brick */
  function wall16(g, tx, ty) {
    for (let r = 0; r < 4; r++) for (let k = -1; k < 2; k++) {
      const x0 = ((r & 1) ? 4 : 0) + k * 8 + 0;
      const v = EM.hash2(tx * 5 + k, ty * 4 + r, 61) * 2 - 0.5;
      const cx = Math.max(0, x0 + 1), cw = Math.min(16, x0 + 8) - cx; if (cw <= 0) continue;
      g.fillStyle = v > 0 ? 'rgba(255,232,210,' + (0.05 * v).toFixed(3) + ')' : 'rgba(0,0,14,' + (-0.2 * v).toFixed(3) + ')';
      g.fillRect(cx, r * 4, cw, 3);
      g.fillStyle = 'rgba(255,236,216,0.06)'; g.fillRect(cx, r * 4, cw, 1);
    }
  }

  /* the facade of the street scene: lit and unlit windows and a lamp over the door */
  EM.decorate16 = function (z, g, TS) {
    if (z.id !== 'doors') return;
    const win = function (x, y, lit, tone) {
      rectF(g, x - 1, y - 1, 14, 11, '#08080D'); rectF(g, x - 1, y + 9, 14, 1, '#2A2A38');
      if (lit) {
        rectF(g, x, y, 12, 9, shade(tone, -0.55)); rectF(g, x + 1, y + 1, 10, 7, shade(tone, -0.15)); rectF(g, x + 1, y + 1, 10, 2, tone);
        rectF(g, x + 5, y, 2, 9, '#14121A'); /* the frame */
        rectF(g, x + 2, y + 4, 2, 3, shade(tone, -0.6)); rectF(g, x + 8, y + 3, 2, 4, shade(tone, -0.6)); /* people behind the curtain */
        g.fillStyle = 'rgba(255,200,120,0.07)'; g.fillRect(x - 2, y + 10, 16, 5);
      } else { rectF(g, x, y, 12, 9, '#0C0E1A'); rectF(g, x + 5, y, 2, 9, '#07070C'); rectF(g, x + 1, y + 1, 4, 1, '#1A1E34'); }
    };
    const tones = ['#FFB84A', '#FF5FB0', '#4FD8FF', '#FFB84A'];
    [6, 38, 70, 102, 236, 268, 300].forEach(function (x, i) {
      const lit1 = EM.hash2(i, 1, 77) > 0.45, lit2 = EM.hash2(i, 2, 77) > 0.5;
      win(x, 7, lit1, tones[Math.floor(EM.hash2(i, 3, 77) * 4)]);
      if (x < 120 || x > 220) win(x, 29, lit2, tones[Math.floor(EM.hash2(i, 4, 77) * 4)]);
    });
    /* a lamp over the door */
    const lx = 27 * TS + 8; rectF(g, lx - 1, 46, 3, 2, '#222230'); rectF(g, lx - 3, 48, 7, 2, '#FFE9B0'); g.fillStyle = 'rgba(255,225,150,0.10)'; g.fillRect(lx - 14, 50, 29, 12);
  };

  /* th: { a, b } accent colours of the room */
  EM.drawTile = function (g, t, ox, oy, tx, ty, open, th) {
    th = th || { a: N.mag, b: N.cyn };
    const A = th.a, Bc = th.b;
    g.save(); g.translate(ox, oy);
    if (ART16 && art16Tile(g, t, tx, ty, open, A, Bc)) { g.restore(); return; }
    switch (t) {
      case TL.FLOOR: rectF(g, 0, 0, 16, 16, '#0A0A0D'); specks(g, 1, 3, '#15151B', tx, ty); specks(g, 2, 1, dim(A, 0.72), tx, ty); break;
      case TL.DANCE: rectF(g, 0, 0, 16, 16, '#0B0B10'); rectF(g, 0, 0, 8, 8, dim(A, 0.8)); rectF(g, 8, 8, 8, 8, dim(Bc, 0.8)); rectF(g, 0, 0, 8, 1, dim(A, 0.55)); rectF(g, 8, 8, 8, 1, dim(Bc, 0.55)); pxF(g, 3, 3, dim(A, 0.3)); pxF(g, 11, 11, dim(Bc, 0.3)); break;
      case 'DANCE_B': rectF(g, 0, 0, 16, 16, '#0B0B10'); rectF(g, 8, 0, 8, 8, dim(Bc, 0.78)); rectF(g, 0, 8, 8, 8, dim(A, 0.78)); rectF(g, 8, 0, 8, 1, dim(Bc, 0.5)); rectF(g, 0, 8, 8, 1, dim(A, 0.5)); pxF(g, 11, 3, Bc); pxF(g, 3, 11, A); break;
      case TL.WALL: {
        rectF(g, 0, 0, 16, 16, '#111116');
        for (let r = 0; r < 4; r++) { rectF(g, 0, r * 4 + 3, 16, 1, '#0A0A0D'); const off = (r & 1) ? 4 : 0; rectF(g, off + 4, r * 4, 1, 3, '#0A0A0D'); rectF(g, off + 12, r * 4, 1, 3, '#0A0A0D'); }
        specks(g, 3, 4, '#1B1B24', tx, ty);
        if (open(0, -1)) { rectF(g, 0, 0, 16, 1, A); rectF(g, 0, 1, 16, 1, dim(A, 0.6)); }
        if (open(0, 1)) { rectF(g, 0, 11, 16, 5, '#18181F'); rectF(g, 0, 11, 16, 1, dim(Bc, 0.1)); rectF(g, 0, 15, 16, 1, dim(Bc, 0.5)); for (let x = 2; x < 16; x += 4) pxF(g, x, 13, '#26262F'); }
        if (open(-1, 0)) rectF(g, 0, 0, 1, 16, dim(A, 0.35));
        if (open(1, 0)) rectF(g, 15, 0, 1, 16, dim(A, 0.35));
        break;
      }
      case TL.BAR: rectF(g, 0, 0, 16, 16, '#0A0A0D'); rectF(g, 0, 2, 16, 7, '#4A3220'); rectF(g, 0, 2, 16, 1, N.amb); rectF(g, 0, 3, 16, 1, '#8A5A2A'); rectF(g, 0, 9, 16, 7, '#24160E'); for (let i = 1; i < 16; i += 4) rectF(g, i, 10, 1, 6, '#0F0A07'); rectF(g, 0, 9, 16, 1, N.amb); pxF(g, 4, 5, '#FFD27A'); pxF(g, 11, 6, '#FFD27A'); break;
      case TL.SPEAKER: {
        rectF(g, 0, 0, 16, 16, '#101015'); rectF(g, 0, 0, 16, 1, dim(A, 0.3)); rectF(g, 0, 15, 16, 1, '#06060A'); rectF(g, 0, 0, 1, 16, dim(A, 0.5)); rectF(g, 15, 0, 1, 16, '#06060A');
        for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
          const d = Math.hypot(x - 7.5, y - 8.5);
          if (d < 2) pxF(g, x, y, '#06060A'); else if (d < 3.6) pxF(g, x, y, '#2A2A34'); else if (d >= 5.5 && d < 6.6) pxF(g, x, y, A);
        }
        break;
      }
      case TL.PILLAR: rectF(g, 0, 0, 16, 16, '#0A0A0D'); rectF(g, 2, 0, 12, 16, '#1A1A22'); rectF(g, 2, 0, 1, 16, Bc); rectF(g, 13, 0, 1, 16, '#0A0A0D'); rectF(g, 2, 0, 12, 2, '#2A2A36'); rectF(g, 5, 4, 1, 10, dim(Bc, 0.6)); break;
      case TL.COUCH: rectF(g, 0, 0, 16, 16, '#0A0A0D'); rectF(g, 0, 1, 16, 5, '#7A1E5A'); rectF(g, 0, 1, 16, 1, '#B8408A'); rectF(g, 0, 6, 16, 8, '#5B1646'); rectF(g, 0, 6, 2, 8, '#8A2A6A'); rectF(g, 14, 6, 2, 8, '#8A2A6A'); rectF(g, 0, 14, 16, 1, '#2A0A22'); rectF(g, 7, 6, 1, 8, '#3F0F30'); break;
      case TL.TILE: rectF(g, 0, 0, 16, 16, '#0C1A1E'); rectF(g, 0, 0, 16, 1, '#1F5560'); rectF(g, 0, 0, 1, 16, '#1F5560'); pxF(g, 8, 8, '#2F8A99'); break;
      case TL.STALL: rectF(g, 0, 0, 16, 16, '#14222E'); rectF(g, 0, 0, 16, 2, N.cyn); rectF(g, 0, 0, 1, 16, '#0A1118'); rectF(g, 15, 0, 1, 16, '#0A1118'); for (let i = 3; i < 15; i += 3) rectF(g, i, 3, 1, 12, '#0B141C'); rectF(g, 12, 8, 2, 2, '#9CE8FF'); break;
      case TL.SINK: rectF(g, 0, 0, 16, 16, '#0C1A1E'); rectF(g, 1, 4, 14, 9, '#DCE6EA'); rectF(g, 3, 6, 10, 5, '#1C3A44'); rectF(g, 7, 1, 2, 4, '#B8C4CA'); pxF(g, 7, 1, '#FFFFFF'); rectF(g, 0, 13, 16, 3, '#2B4A55'); rectF(g, 1, 4, 14, 1, '#FFFFFF'); break;
      case TL.GRASS: rectF(g, 0, 0, 16, 16, '#0A140D'); specks(g, 5, 14, '#14391F', tx, ty); specks(g, 6, 4, '#2A8A46', tx, ty); specks(g, 8, 1, N.lim, tx, ty); break;
      case TL.CONC: rectF(g, 0, 0, 16, 16, '#101218'); specks(g, 7, 8, '#0A0B10', tx, ty); specks(g, 8, 4, '#1F232D', tx, ty); break;
      case TL.MATT: rectF(g, 0, 0, 16, 16, '#0A0A0D'); rectF(g, 1, 1, 14, 14, '#2B4A6B'); rectF(g, 1, 1, 14, 4, '#F2F2F2'); rectF(g, 1, 5, 14, 1, '#1D3550'); rectF(g, 1, 8, 14, 1, '#355A80'); rectF(g, 1, 14, 14, 1, '#1D3550'); break;
      case TL.LOCKER: rectF(g, 0, 0, 16, 16, '#0D1518'); rectF(g, 1, 1, 6, 14, '#2A5560'); rectF(g, 9, 1, 6, 14, '#2A5560'); rectF(g, 1, 1, 6, 1, '#4A8A99'); rectF(g, 9, 1, 6, 1, '#4A8A99'); rectF(g, 6, 7, 1, 3, '#DCE6EA'); rectF(g, 9, 7, 1, 3, '#DCE6EA'); rectF(g, 2, 3, 4, 1, '#0D1518'); rectF(g, 10, 3, 4, 1, '#0D1518'); break;
      case TL.TABLE: rectF(g, 0, 0, 16, 16, '#0A0A0D'); rectF(g, 1, 3, 14, 9, '#6B4A2E'); rectF(g, 1, 3, 14, 1, '#A07A4A'); rectF(g, 1, 12, 14, 3, '#3B2616'); break;
      case TL.BOOTH: rectF(g, 0, 0, 16, 16, '#08080B'); rectF(g, 0, 0, 16, 1, Bc); for (let i = 0; i < 16; i += 4) rectF(g, i, 0, 1, 16, '#14141A'); pxF(g, 6, 8, A); pxF(g, 14, 12, Bc); break;
      case TL.RUG: rectF(g, 0, 0, 16, 16, '#1A0A12'); rectF(g, 1, 1, 14, 14, '#2A0F1C'); rectF(g, 2, 2, 12, 1, '#7A2A3A'); rectF(g, 2, 13, 12, 1, '#7A2A3A'); rectF(g, 2, 2, 1, 12, '#7A2A3A'); rectF(g, 13, 2, 1, 12, '#7A2A3A'); pxF(g, 8, 8, N.amb); break;
      case TL.FENCE: rectF(g, 0, 0, 16, 16, '#0A0A0D'); for (let i = 1; i < 16; i += 5) rectF(g, i, 3, 1, 12, '#C9C9D2'); rectF(g, 0, 5, 16, 1, A); rectF(g, 0, 10, 16, 1, A); for (let i = 1; i < 16; i += 5) pxF(g, i, 3, '#FFFFFF'); break;
      case TL.STAIRS: for (let i = 0; i < 4; i++) { rectF(g, 0, i * 4, 16, 3, i & 1 ? '#3A3A48' : '#6A6A7C'); rectF(g, 0, i * 4 + 3, 16, 1, '#08080B'); } rectF(g, 0, 0, 16, 1, N.lim); break;
      case TL.BARREL: rectF(g, 0, 0, 16, 16, '#0A0A0D'); rectF(g, 2, 6, 12, 10, '#3A3A44'); rectF(g, 2, 6, 12, 1, '#8A8A99'); rectF(g, 2, 10, 12, 1, '#1A1A20'); rectF(g, 5, 2, 6, 5, N.org); rectF(g, 6, 1, 4, 3, N.yel); rectF(g, 7, 0, 2, 2, '#FFFFFF'); pxF(g, 4, 4, N.org); pxF(g, 11, 3, N.org); break;
      case TL.PLANT: rectF(g, 0, 0, 16, 16, '#0A0A0D'); rectF(g, 5, 10, 6, 6, '#5A3A28'); rectF(g, 5, 10, 6, 1, '#8A5A3A'); for (let i = 0; i < 6; i++) { pxF(g, 8 + (i % 2 ? 2 : -2) * ((i / 3 | 0) + 1), 9 - i, N.grn); pxF(g, 8, 9 - i, '#1E8A48'); } rectF(g, 3, 4, 3, 1, N.grn); rectF(g, 10, 5, 3, 1, N.grn); rectF(g, 4, 6, 2, 1, '#1E8A48'); break;
      case TL.DOORF: rectF(g, 0, 0, 16, 16, '#08080B'); rectF(g, 0, 0, 16, 2, N.lim); rectF(g, 2, 6, 12, 1, dim(N.lim, 0.6)); rectF(g, 2, 10, 12, 1, dim(N.lim, 0.6)); rectF(g, 2, 14, 12, 1, dim(N.lim, 0.6)); break;
      case TL.BENCH: rectF(g, 0, 0, 16, 16, '#0A0A0D'); rectF(g, 0, 5, 16, 4, '#8A5A3A'); rectF(g, 0, 5, 16, 1, '#C08A5A'); rectF(g, 0, 9, 16, 2, '#4A2E1A'); rectF(g, 1, 11, 2, 4, '#2A1A10'); rectF(g, 13, 11, 2, 4, '#2A1A10'); break;
      case TL.ROAD: rectF(g, 0, 0, 16, 16, '#0C0C0F'); rectF(g, 2, 7, 5, 2, N.amb); rectF(g, 10, 7, 5, 2, N.amb); specks(g, 9, 3, '#18181E', tx, ty); break;
      case TL.SIDEWALK: rectF(g, 0, 0, 16, 16, '#14141A'); rectF(g, 0, 0, 16, 1, '#23232C'); rectF(g, 0, 0, 1, 16, '#23232C'); specks(g, 4, 3, '#0C0C10', tx, ty); break;
      case TL.CURTAIN: rectF(g, 0, 0, 16, 16, '#14060A'); for (let i = 0; i < 16; i += 4) { rectF(g, i, 1, 2, 15, '#8A1E2E'); rectF(g, i + 2, 1, 2, 15, '#3A0A12'); } rectF(g, 0, 0, 16, 2, '#C9A66B'); break;
      case TL.MIRROR: rectF(g, 0, 0, 16, 16, '#0C1A1E'); rectF(g, 1, 1, 14, 11, '#9CC8D6'); rectF(g, 2, 2, 12, 9, '#4A7A8A'); for (let i = 0; i < 6; i++) pxF(g, 3 + i * 2, 9 - i, '#E8F6FF'); rectF(g, 0, 12, 16, 4, '#0C1A1E'); rectF(g, 0, 15, 16, 1, '#2F8A99'); break;
      case TL.RAIL: rectF(g, 0, 0, 16, 16, '#0A0A0D'); rectF(g, 0, 6, 16, 2, '#E8E8F0'); for (let i = 1; i < 16; i += 5) rectF(g, i, 8, 1, 8, '#6A6A7C'); break;
      case TL.CRATE: rectF(g, 0, 0, 16, 16, '#0A0A0D'); rectF(g, 1, 2, 14, 13, '#6B4A2E'); rectF(g, 1, 2, 14, 1, N.amb); rectF(g, 1, 8, 14, 1, '#3B2616'); rectF(g, 7, 2, 1, 13, '#3B2616'); break;
      case TL.SKY: rectF(g, 0, 0, 16, 16, '#05060F'); specks(g, 11, 2, '#6A7AA8', tx, ty); if (EM.hash2(tx, ty, 3) > 0.7) pxF(g, 4, 4, '#FFFFFF'); break;
      default: rectF(g, 0, 0, 16, 16, '#050508');
    }
    if (ART16 && t === TL.WALL) wall16(g, tx, ty);
    g.restore();
  };
})();

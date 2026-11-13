/* EXCUSE ME — tiles, 16-bit: 56 tile types (0..30 club, 31..47 flat/after, 48..55 upgraded furniture & equipment) drawn at
   32x32 device pixels (the 16x16 logical tile at RS=2). A black world with neon trim for the club, warm daylight tones
   for the flat, dithered gradients, bevels and contact shadows where walls meet the floor. Drawn once per zone into a
   static canvas (engine.js buildStatic). th = { a, b } are the accent colours of the room. */
'use strict';
(function () {
  const EM = window.EM, RS = EM.RS, N = EM.NEON, shade = EM.shade;
  const TS = 16 * RS; /* a tile in device pixels (32x32) */

  const TL = EM.TL = {
    VOID: 0, FLOOR: 1, DANCE: 2, WALL: 3, BAR: 4, SPEAKER: 5, PILLAR: 6, COUCH: 7, TILE: 8, STALL: 9,
    SINK: 10, GRASS: 11, CONC: 12, MATT: 13, LOCKER: 14, TABLE: 15, BOOTH: 16, RUG: 17, FENCE: 18,
    STAIRS: 19, BARREL: 20, PLANT: 21, DOORF: 22, BENCH: 23, ROAD: 24, SIDEWALK: 25, CURTAIN: 26,
    MIRROR: 27, RAIL: 28, CRATE: 29, SKY: 30,
    /* the home tileset (THE AFTER): a daytime flat, nothing like the club */
    HFLOOR: 31, HWALL: 32, HRUG: 33, HTILE: 34, HCOUCH: 35, HBED: 36, HTABLE: 37, HCOUNTER: 38, HSPEAKER: 39, HCOATS: 40,
    HPLANT: 41, HDOOR: 42, HTOILET: 43, HSINK: 44, HSKY: 45, HRAIL: 46, HBALC: 47,
    /* upgraded furniture & equipment tiles (club + flat) */
    ARMCHAIR: 48, LIGHTRIG: 49, COATRACK: 50, FRIDGE: 51, BOOKSHELF: 52, OTTOMAN: 53, SUBWOOFER: 54, RADIATOR: 55,
    HBATH: 56, TOILET: 57
  };
  const TL_NAMES = EM.TL_NAMES = {};
  Object.keys(TL).forEach(function (k) { TL_NAMES[TL[k]] = k; });

  const SOLID = {};
  [TL.VOID, TL.WALL, TL.BAR, TL.SPEAKER, TL.PILLAR, TL.COUCH, TL.STALL, TL.SINK, TL.LOCKER, TL.TABLE, TL.FENCE,
    TL.BARREL, TL.PLANT, TL.BENCH, TL.ROAD, TL.MIRROR, TL.RAIL, TL.CRATE, TL.SKY,
    TL.HWALL, TL.HCOUCH, TL.HTABLE, TL.HCOUNTER, TL.HSPEAKER, TL.HCOATS, TL.HPLANT, TL.HTOILET, TL.HSINK, TL.HSKY, TL.HRAIL,
    TL.ARMCHAIR, TL.LIGHTRIG, TL.COATRACK, TL.FRIDGE, TL.BOOKSHELF, TL.OTTOMAN, TL.SUBWOOFER, TL.RADIATOR,
    TL.HBATH, TL.TOILET].forEach(function (t) { SOLID[t] = true; });
  EM.isSolidTile = function (t) { return !!SOLID[t]; };

  /* ------------------------------------------------------------ drawing helpers (g is the tile's context, origin at the tile) */
  let g = null, TX = 0, TY = 0, CUR_TILE = 0, ZONE_ID = '', HAS_AT = false, AT_FN = null;
  const AT = function (dx, dy) { return HAS_AT ? AT_FN(dx, dy) : null; };
  const same = function (dx, dy) { return HAS_AT ? AT_FN(dx, dy) === CUR_TILE : (dx === 0 && dy === 0); };
  function interiorAt(dx, dy, open) {
    if (!HAS_AT) return open(dx, dy);
    const t = AT_FN(dx, dy);
    return t !== null && t !== TL.WALL && t !== TL.HWALL && t !== TL.VOID;
  }
  const R = function (x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const P = function (x, y, c) { g.fillStyle = c; g.fillRect(x, y, 1, 1); };
  const dim = function (hex, f) { return shade(hex, -f); };
  const hs = function (i, j, s) { return EM.hash2(TX * 31 + i, TY * 17 + j, s); };
  const BAY = EM.BAYER;

  function spk(seed, n, c, w, h) {
    for (let i = 0; i < n; i++) {
      const x = Math.floor(hs(i, 3, seed) * (TS - (w || 1))), y = Math.floor(hs(5, i, seed + 9) * (TS - (h || 1)));
      R(x, y, w || 1, h || 1, c);
    }
  }
  function grad(x, y, w, h, c0, c1) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const t = h > 1 ? j / (h - 1) : 0;
      P(x + i, y + j, t > BAY[((y + j) & 3) * 4 + ((x + i) & 3)] / 16 ? c1 : c0);
    }
  }
  function bevel(x, y, w, h, hi, lo, t) {
    t = t || 1;
    R(x, y, w, t, hi); R(x, y, t, h, hi); R(x, y + h - t, w, t, lo); R(x + w - t, y, t, h, lo);
  }
  function ellS(cx, cy, rx, ry, ramp) {
    for (let y = Math.floor(cy - ry); y < Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x < Math.ceil(cx + rx); x++) {
      const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry; if (nx * nx + ny * ny > 1) continue;
      const v = -(nx * 0.62 + ny * 0.78) + (((x + y) & 1) ? 0.08 : -0.08);
      P(x, y, v > 0.64 ? ramp.h2 : v > 0.30 ? ramp.h : v > -0.16 ? ramp.b : v > -0.52 ? ramp.s : ramp.s2);
    }
  }
  function contact(open, left, right) {
    if (!open(0, -1)) { R(0, 0, TS, 6, 'rgba(2,2,8,0.32)'); R(0, 0, TS, 3, 'rgba(2,2,8,0.30)'); R(0, 0, TS, 1, 'rgba(2,2,8,0.22)'); }
    if (left !== false && !open(-1, 0)) { R(0, 0, 3, TS, 'rgba(2,2,8,0.24)'); R(0, 0, 1, TS, 'rgba(2,2,8,0.18)'); }
    if (right !== false && !open(1, 0)) { R(TS - 2, 0, 2, TS, 'rgba(2,2,8,0.16)'); }
  }
  function warmContact(open) {
    if (!open(0, -1)) { R(0, 0, TS, 4, 'rgba(60,38,18,0.18)'); R(0, 0, TS, 2, 'rgba(40,24,10,0.16)'); }
    if (!open(-1, 0)) { R(0, 0, 2, TS, 'rgba(60,38,18,0.14)'); }
    if (!open(1, 0)) { R(TS - 2, 0, 2, TS, 'rgba(60,38,18,0.10)'); }
  }

  /* ------------------------------------------------------------ the tiles */
  const T = {};

  function drawUnderlay(open, A, B, floorTile) {
    let ft = floorTile;
    if (!ft || ft === CUR_TILE || !T[ft]) ft = (CUR_TILE >= 31 && CUR_TILE <= 47) || CUR_TILE === TL.HBATH ? TL.HFLOOR : TL.FLOOR;
    const prevT = CUR_TILE;
    CUR_TILE = ft;
    T[ft](open, A, B, true);
    CUR_TILE = prevT;
  }

  T[TL.FLOOR] = function (open, A, B, underlay) {
    /* dark industrial steel-plate / concrete club floor with bolts & cable grooves */
    R(0, 0, TS, TS, '#0B0B10');
    R(0, 0, 16, 16, '#0E0E14'); R(16, 16, 16, 16, '#0E0E14');
    R(16, 0, 16, 16, '#0A0A10'); R(0, 16, 16, 16, '#0A0A10');
    /* recessed steel seam & cable groove */
    R(0, 15, TS, 1, '#07070B'); R(15, 0, 1, TS, '#07070B');
    R(0, 16, TS, 1, '#15151E'); R(16, 0, 1, TS, '#15151E');
    if (hs(2, 1, 15) > 0.72) {
      /* subtle recessed cable conduit groove across tile */
      R(0, 22, TS, 2, '#060609'); R(0, 24, TS, 1, '#191924');
      R(6, 22, 4, 2, dim(B, 0.78)); R(20, 22, 4, 2, dim(A, 0.78));
    }
    /* corner plate rivets */
    [[2, 2], [13, 2], [2, 13], [18, 18], [29, 18], [18, 29]].forEach(function (b) {
      P(b[0], b[1], '#22222E'); P(b[0] + 1, b[1] + 1, '#06060A');
    });
    spk(1, 6, '#171721', 2, 1); spk(2, 3, dim(A, 0.72), 1, 1); spk(4, 3, '#06060A', 2, 1);
    R(0, TS - 1, TS, 1, '#07070B'); R(TS - 1, 0, 1, TS, '#07070B');
    R(0, 0, TS - 1, 1, '#15151F'); R(0, 0, 1, TS - 1, '#15151F');
    if (!underlay) contact(open);
  };

  T[TL.DANCE] = function (open, A, B, alt) {
    /* sub-floor LED / glass matrix with bevel frame, diffuser & corner specular glint */
    R(0, 0, TS, TS, '#08080D');
    const lit = function (x, y, c) {
      const c0 = dim(c, 0.80), c1 = dim(c, 0.56), c2 = dim(c, 0.25);
      R(x, y, 16, 16, c0);
      grad(x + 1, y + 1, 14, 14, c1, c0);
      R(x + 3, y + 3, 10, 10, dim(c, 0.45));
      R(x + 5, y + 5, 6, 6, c2);
      /* inner LED cross filament + center diode */
      R(x + 7, y + 2, 2, 12, dim(c, 0.36)); R(x + 2, y + 7, 12, 2, dim(c, 0.36));
      R(x + 7, y + 7, 2, 2, shade(c, 0.35));
      bevel(x, y, 16, 16, dim(c, 0.38), '#050508', 1);
      /* glass specular glint */
      P(x + 2, y + 2, '#FFFFFF'); P(x + 3, y + 2, shade(c, 0.45)); P(x + 2, y + 3, shade(c, 0.45));
    };
    const off = function (x, y, c) {
      R(x, y, 16, 16, '#0B0B11');
      bevel(x, y, 16, 16, '#181822', '#050508', 1);
      R(x + 2, y + 2, 12, 12, '#0E0E16');
      P(x + 7, y + 7, dim(c, 0.72)); P(x + 8, y + 8, dim(c, 0.72));
      P(x + 3, y + 3, '#1E1E2A');
    };
    if (!alt) { lit(0, 0, A); off(16, 0, B); off(0, 16, A); lit(16, 16, B); }
    else { off(0, 0, A); lit(16, 0, B); lit(0, 16, A); off(16, 16, B); }
    spk(7, 2, dim(A, 0.35), 1, 1);
    R(0, 0, TS, 1, 'rgba(255,255,255,0.06)');
    contact(open);
  };

  T[TL.WALL] = function (open, A, B) {
    /* industrial brick masonry + acoustic dado rail + baseboard shadow */
    const showBase = interiorAt(0, 1, open);
    const showTop = interiorAt(0, -1, open);
    R(0, 0, TS, TS, '#0C0C11');
    const maxR = showBase ? 3 : 4;
    for (let r = 0; r < maxR; r++) {
      const off = (r & 1) ? 8 : 0;
      for (let k = -1; k < 3; k++) {
        const x0 = off + k * 16, bx = Math.max(0, x0 + 1), bw = Math.min(TS, x0 + 15) - bx;
        if (bw <= 0) continue;
        const v = hs(k + 5, r, 61), c = v > 0.66 ? '#1D1D27' : v > 0.33 ? '#181821' : '#14141B';
        R(bx, r * 7, bw, 6, c);
        R(bx, r * 7, bw, 1, '#282834');
        R(bx, r * 7 + 5, bw, 1, '#0C0C11');
        R(bx, r * 7 + 1, 1, 4, '#22222D');
        if (hs(k, r, 62) > 0.65) P(bx + 3 + Math.floor(hs(k, r, 63) * Math.max(1, bw - 5)), r * 7 + 3, '#0F0F15');
      }
      R(0, r * 7 + 6, TS, 1, '#08080C');
    }
    spk(3, 3, '#262634', 1, 1);
    if (showTop) {
      R(0, 0, TS, 2, A); R(0, 2, TS, 2, dim(A, 0.62)); R(0, 4, TS, 1, dim(A, 0.85));
    }
    if (showBase) {
      /* acoustic dado rail + ribbed wainscoting + baseboard shadow */
      R(0, 19, TS, 1, '#07070A');
      R(0, 20, TS, 2, dim(B, 0.12)); R(0, 20, TS, 1, shade(B, 0.2)); R(0, 22, TS, 1, dim(B, 0.65));
      R(0, 23, TS, 7, '#15151D');
      for (let x = 2; x < TS; x += 4) { R(x, 23, 1, 7, '#21212B'); R(x + 1, 23, 1, 7, '#0D0D13'); }
      R(0, 30, TS, 2, '#07070B'); R(0, 30, TS, 1, dim(B, 0.55));
    }
    if (interiorAt(-1, 0, open)) { R(0, 0, 2, TS, dim(A, 0.35)); R(2, 0, 1, TS, dim(A, 0.75)); }
    if (interiorAt(1, 0, open)) { R(TS - 2, 0, 2, TS, dim(A, 0.35)); R(TS - 3, 0, 1, TS, dim(A, 0.75)); }
  };

  T[TL.BAR] = function (open, A, B) {
    /* backlit bottles, mahogany bar top with brass rim, paneled front & footrail */
    R(0, 0, TS, TS, '#09090D');
    [[2, '#2E8B57'], [8, N.amb], [14, '#8A5CFF'], [21, '#2F6BFF'], [27, '#E5332A']].forEach(function (b, i) {
      const h = 5 + (i * 3) % 3, topY = 5 - h;
      R(b[0], topY, 4, h, dim(b[1], 0.28));
      R(b[0], topY, 1, h, b[1]);
      R(b[0] + 1, topY - 1, 2, 1, '#DCE2EC');
      P(b[0] + 1, topY + 2, '#FFFFFF');
    });
    /* mahogany top with warm reflections & brass coasters */
    R(0, 5, TS, 14, '#5A3A22'); grad(0, 5, TS, 14, '#6E482B', '#482C18');
    R(0, 5, TS, 2, N.amb); R(0, 7, TS, 1, '#FFD9A0'); R(0, 8, TS, 1, '#9A6A34'); R(0, 9, TS, 1, '#3A2412');
    for (let x = 3; x < TS; x += 7) R(x, 11, 4, 1, 'rgba(255,210,140,0.16)');
    R(7, 12, 3, 3, '#2A1810'); P(8, 13, '#FFD27A');
    R(22, 13, 3, 3, '#2A1810'); P(23, 14, '#FFD27A');
    /* under-bar LED + slatted front + brass footrail */
    R(0, 19, TS, 13, '#28160E'); grad(0, 19, TS, 13, '#341E16', '#1B0E08');
    R(0, 19, TS, 2, N.amb); R(0, 21, TS, 1, dim(N.amb, 0.55));
    for (let i = 3; i < TS; i += 8) { R(i, 22, 1, 7, '#0E0805'); R(i + 1, 22, 1, 7, '#442A1B'); }
    R(0, 29, TS, 2, '#C9A66B'); R(0, 29, TS, 1, '#FFE4A8');
    R(0, 31, TS, 1, 'rgba(0,0,0,0.5)');
  };

  T[TL.SPEAKER] = function (open, A, B) {
    /* industrial horn tweeter + heavy bass woofer cabinet with corner hardware */
    R(0, 0, TS, TS, '#0D0D12');
    bevel(0, 0, TS, TS, dim(A, 0.35), '#050508', 2);
    R(2, 2, TS - 4, TS - 4, '#13131A');
    /* top horn tweeter */
    R(6, 4, 20, 6, '#09090E'); bevel(6, 4, 20, 6, '#282834', '#050508', 1);
    for (let x = 8; x < 24; x += 3) R(x, 5, 1, 4, '#2E2E3B');
    P(27, 4, A);
    /* main woofer */
    for (let y = 11; y < 30; y++) for (let x = 4; x < 28; x++) {
      const d = Math.hypot(x - 15.5, y - 20.5);
      if (d < 2.6) P(x, y, '#06060A');
      else if (d < 6.4) P(x, y, ((x + y) & 1) && d > 5.4 ? '#15151E' : (d > 4.4 ? '#383846' : '#262632'));
      else if (d < 8.0) P(x, y, '#09090F');
      else if (d >= 8.6 && d < 10.2) P(x, y, ((x + y) & 1) ? A : dim(A, 0.48));
    }
    P(14, 19, '#5A5A6B'); P(15, 18, '#5A5A6B');
    [[3, 3], [27, 3], [3, 27], [27, 27]].forEach(function (s) { R(s[0], s[1], 2, 2, '#3E3E4C'); P(s[0], s[1], '#7A7A8C'); });
  };

  T[TL.PILLAR] = function (open, A, B) {
    R(0, 0, TS, TS, '#08080C');
    R(4, 0, 24, TS, '#1A1A22');
    for (let x = 4; x < 28; x++) {
      const t = (x - 4) / 23;
      R(x, 0, 1, TS, t < 0.18 ? '#30303E' : t < 0.52 ? '#23232E' : t < 0.80 ? '#181820' : '#0E0E14');
    }
    R(4, 0, 2, TS, B); R(6, 0, 1, TS, dim(B, 0.5)); R(26, 0, 2, TS, '#06060A');
    R(3, 0, 26, 4, '#3A3A48'); R(3, 0, 26, 1, '#58586B'); R(3, 4, 26, 1, '#0A0A0F');
    R(3, 27, 26, 5, '#121219'); R(3, 27, 26, 1, '#3A3A48');
    R(10, 8, 2, 16, dim(B, 0.55)); P(10, 8, B); R(11, 8, 1, 16, dim(B, 0.3));
    [[5, 29], [25, 29]].forEach(function (b) { P(b[0], b[1], '#6A6A7A'); });
  };

  T[TL.COUCH] = function (open, A, B, floorTile) {
    /* neighbor-aware club velvet banquette: armrests & outer feet only on exposed ends */
    drawUnderlay(open, A, B, floorTile);
    const w = !same(-1, 0), e = !same(1, 0);
    const x0 = w ? 1 : 0, x1 = e ? 31 : 32, cw = x1 - x0;
    R(x0, 28, cw, 3, 'rgba(0,0,0,0.45)');
    /* tufted velvet backrest */
    R(x0, 2, cw, 10, '#7A1E5A'); grad(x0, 2, cw, 10, '#92266C', '#641446');
    R(x0, 2, cw, 2, '#C852A2'); R(x0, 1, cw, 1, '#09090D');
    /* seat cushions */
    R(x0, 12, cw, 16, '#5B1646'); grad(x0, 12, cw, 16, '#6E1E56', '#460E34'); R(x0, 12, cw, 1, '#2E0A24');
    /* subtle center cushion seam when joined or solo */
    R(15, 13, 1, 14, '#380C2A'); R(16, 13, 1, 14, '#24061B');
    /* rolled armrests & wooden legs only on exposed outer ends */
    if (w) {
      R(0, 8, 5, 20, '#8A2A6A'); bevel(0, 8, 5, 20, '#B84E94', '#380C2A', 1);
      R(2, 28, 3, 3, '#1A1016');
    }
    if (e) {
      R(27, 8, 5, 20, '#7A2260'); bevel(27, 8, 5, 20, '#B84E94', '#380C2A', 1);
      R(27, 28, 3, 3, '#1A1016');
    }
    R(x0, 27, cw, 1, '#923070'); R(x0, 28, cw, 1, '#2A0A22');
    for (let x = (w ? 9 : 4); x < (e ? 26 : 30); x += 8) { P(x, 6, '#EE84CA'); P(x, 7, '#3F0F30'); }
  };

  T[TL.TILE] = function (open, A, B, underlay) {
    /* dark ceramic 2x2 restroom floor with crisp grout & specular glaze sheen */
    R(0, 0, TS, TS, '#071216');
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
      const x = i * 16, y = j * 16;
      R(x + 1, y + 1, 14, 14, hs(i, j, 8) > 0.5 ? '#11272E' : '#0E2228');
      R(x + 1, y + 1, 14, 1, '#266A78'); R(x + 1, y + 1, 1, 14, '#1F5A66');
      R(x + 1, y + 14, 14, 1, '#09161B'); R(x + 14, y + 1, 1, 14, '#09161B');
      P(x + 4, y + 4, '#44A8B8'); P(x + 5, y + 5, '#2E7E8C'); P(x + 6, y + 4, '#246672');
    }
    if (!underlay) contact(open);
  };

  T[TL.STALL] = function (open, A, B, floorTile) {
    /* neighbor-aware stainless restroom cubicles: doors+latches only on front door tiles facing walkable aisle, structural partitions elsewhere */
    drawUnderlay(open, A, B, floorTile || TL.TILE);
    const hasN = same(0, -1), hasS = same(0, 1), hasW = same(-1, 0), hasE = same(1, 0);
    const sTile = AT(0, 1);
    const southWalkable = HAS_AT ? (sTile !== null && !SOLID[sTile] && sTile !== TL.VOID) : true;
    const isFrontDoor = !HAS_AT || (southWalkable && !hasN && (hasW || hasE || (!hasN && !hasS)));

    if (isFrontDoor) {
      /* brushed stainless cubicle front door + under-door gap + louvers + occupied/vacant latch */
      R(0, 29, TS, 3, 'rgba(2,4,8,0.45)');
      const dx = hasW ? 0 : 1, dw = (hasW ? 0 : 1) + (hasE ? 0 : 1);
      const x0 = dx, w = TS - dw;
      R(x0, 0, w, 28, '#12202B'); grad(x0, 0, w, 28, '#1E3546', '#101C26');
      R(x0, 0, w, 4, N.cyn); R(x0, 4, w, 1, dim(N.cyn, 0.58));
      R(x0, 5, w, 1, '#070D14');
      /* outer frame stile & hinges */
      if (!hasW) { R(0, 0, 2, 29, '#070D14'); R(1, 8, 2, 3, '#9CE8FF'); R(1, 21, 2, 3, '#9CE8FF'); }
      if (!hasE) { R(TS - 2, 0, 2, 29, '#070D14'); R(TS - 3, 8, 2, 3, '#9CE8FF'); R(TS - 3, 21, 2, 3, '#9CE8FF'); }
      /* center door meeting seam if 2-wide */
      if (hasW && !hasE) { R(0, 5, 1, 23, '#070D14'); R(1, 5, 1, 23, '#2B485C'); }
      if (hasE && !hasW) { R(TS - 1, 5, 1, 23, '#070D14'); }
      /* stamped steel louver vents */
      for (let ly = 8; ly <= 13; ly += 2) { R(x0 + 5, ly, w - 10, 1, '#081018'); R(x0 + 5, ly + 1, w - 10, 1, '#2D4D62'); }
      for (let i = x0 + 6; i < x0 + w - 4; i += 6) { R(i, 16, 1, 10, '#0A131B'); R(i + 1, 16, 1, 10, '#263E50'); }
      /* brushed chrome privacy latch (red occupied on closed stalls, green if !HAS_AT) */
      if (!hasW || !HAS_AT) {
        const lx = hasE ? TS - 7 : TS - 9;
        R(lx, 15, 6, 5, '#070D14'); R(lx + 1, 16, 4, 3, '#9CE8FF');
        P(lx + 1, 16, '#FFFFFF'); R(lx + 2, 17, 2, 1, HAS_AT ? N.red : N.grn);
      }
      R(x0, 27, w, 1, '#060C12');
    } else if ((hasN || hasS) && !hasW && !hasE) {
      /* vertical steel cubicle divider wall between stalls */
      R(10, 0, 12, TS, '#070D14');
      R(11, 0, 10, TS, '#172936'); R(12, 0, 2, TS, '#2A475A'); R(19, 0, 2, TS, '#0D1821');
      /* top brushed chrome capping rail */
      R(13, 0, 6, TS, '#4E7D8E'); R(14, 0, 2, TS, '#9CE8FF');
      if (!hasN) { R(10, 0, 12, 3, '#2D4F60'); R(11, 1, 10, 1, N.cyn); }
      if (!hasS) {
        /* floor-mounted stainless pilaster foot & bumper */
        R(9, 25, 14, 5, '#070D14'); R(10, 26, 12, 3, '#2B4A5A');
        R(10, 26, 12, 1, '#8CD8EC'); R(10, 30, 12, 2, 'rgba(2,4,8,0.5)');
      }
    } else {
      /* horizontal back/corner structural steel partition */
      R(0, 0, TS, TS, '#0B151D');
      R(0, 3, TS, 24, '#182C3A'); grad(0, 3, TS, 24, '#223D4E', '#11202B');
      R(0, 0, TS, 3, N.cyn); R(0, 3, TS, 1, dim(N.cyn, 0.55));
      for (let x = 4; x < TS; x += 8) { P(x, 6, '#3B6075'); P(x, 23, '#0B151D'); }
      R(0, 27, TS, 3, '#070D14'); R(0, 30, TS, 2, 'rgba(2,4,8,0.45)');
    }
  };

  T[TL.SINK] = function (open, A, B, floorTile) {
    /* neighbor-aware club porcelain trough/counter sink with chrome mixer tap & soap */
    drawUnderlay(open, A, B, floorTile || TL.TILE);
    const w = !same(-1, 0), e = !same(1, 0);
    const x0 = w ? 1 : 0, x1 = e ? 31 : 32, cw = x1 - x0;
    R(x0, 7, cw, 23, '#070D14');
    R(x0, 8, cw, 18, '#E2EAEE'); grad(x0, 8, cw, 18, '#F4F9FB', '#BAC8CF');
    R(x0 + (w ? 1 : 0), 8, cw - (w ? 1 : 0) - (e ? 1 : 0), 2, '#FFFFFF');
    if (!w) R(0, 8, 1, 18, '#B8C6CC');
    /* recessed dark glazed basin + chrome drain + water glint */
    ellS(16, 18, 10, 6, EM.ramp('#1A3A44'));
    R(15, 18, 2, 2, '#9CE8FF'); P(15, 18, '#FFFFFF');
    R(9, 15, 14, 1, '#0B1A20'); P(12, 17, '#44A8B8');
    /* chrome swan-neck mixer tap + hot/cold pips */
    R(13, 1, 6, 10, '#070D14');
    R(14, 2, 4, 9, '#B8C4CA'); R(14, 2, 2, 9, '#EEF6FA'); R(14, 2, 4, 2, '#8A98A0'); P(14, 2, '#FFFFFF');
    P(12, 6, '#FF3B5C'); P(19, 6, '#19D3FF');
    R(15, 10, 2, 3, '#19D3FF');
    /* soap dispenser on alternating counters */
    if ((TX & 1) === 0) {
      R(4, 9, 4, 5, '#070D14'); R(5, 10, 2, 3, A); P(5, 9, '#DCE6EC');
    } else {
      R(24, 9, 4, 5, '#070D14'); R(25, 10, 2, 3, B); P(25, 9, '#DCE6EC');
    }
    /* under-counter steel apron */
    R(x0, 26, cw, 5, '#27434D'); R(x0, 26, cw, 1, '#689AA8'); R(x0, 30, cw, 2, '#0A1418');
  };

  T[TL.GRASS] = function (open, A, B) {
    R(0, 0, TS, TS, '#0A140D'); grad(0, 0, TS, TS, '#0D1C12', '#08110B');
    spk(5, 24, '#14391F', 1, 2); spk(6, 12, '#2A8A46', 1, 2); spk(7, 8, '#1C5A2E', 1, 2);
    spk(8, 2, N.lim, 1, 1); spk(9, 1, '#FFFFFF', 1, 1);
    contact(open);
  };

  T[TL.CONC] = function (open, A, B) {
    R(0, 0, TS, TS, '#11131A'); grad(0, 0, TS, TS, '#151821', '#0E1016');
    spk(7, 14, '#0A0B10', 2, 1); spk(8, 8, '#222633', 2, 1); spk(10, 4, '#1A1D26', 3, 2);
    if (hs(2, 2, 14) > 0.72) {
      for (let i = 0; i < 14; i++) {
        const y = 10 + Math.floor(Math.sin(i * 0.8) * 2);
        P(4 + i, y, '#07080C'); P(5 + i, y, '#262B38');
      }
    }
    R(0, TS - 1, TS, 1, '#090A0F'); R(TS - 1, 0, 1, TS, '#090A0F');
    R(0, 0, TS - 1, 1, '#1A1D26');
    contact(open);
  };

  T[TL.MATT] = function (open, A, B, floorTile) {
    /* neighbor-aware plush quilted floor futons / recovery mattresses (never looks like a water pool) */
    drawUnderlay(open, A, B, floorTile);
    const n = !same(0, -1), s = !same(0, 1), w = !same(-1, 0), e = !same(1, 0);
    const padL = w ? 2 : 0, padR = e ? 2 : 0, padT = n ? 2 : 0, padB = s ? 2 : 0;
    const x0 = padL, y0 = padT, w0 = TS - padL - padR, h0 = TS - padT - padB;
    if (s) R(x0, TS - 2, w0, 2, 'rgba(0,0,0,0.48)');
    /* warm oatmeal/taupe quilted futon upholstery */
    R(x0, y0, w0, h0, '#C6B9A3');
    grad(x0, y0, w0, h0, '#D4C7B2', '#B2A48D');
    /* piped canvas & timber base trim ONLY on exposed outer perimeter */
    if (n) { R(x0, y0, w0, 2, '#5C4332'); R(x0, y0, w0, 1, '#8B6E55'); }
    if (s) { R(x0, y0 + h0 - 3, w0, 3, '#4A3324'); R(x0, y0 + h0 - 3, w0, 1, '#8B6E55'); }
    if (w) { R(x0, y0, 2, h0, '#5C4332'); R(x0, y0, 1, h0, '#8B6E55'); }
    if (e) { R(x0 + w0 - 2, y0, 2, h0, '#3D291C'); }
    /* subtle individual futon division seams & stitched bevels across contiguous pads */
    if (!w) { R(0, y0 + 2, 1, h0 - 4, 'rgba(74,51,36,0.28)'); R(1, y0 + 2, 1, h0 - 4, 'rgba(255,248,236,0.25)'); }
    if (!n) { R(x0 + 2, 0, w0 - 4, 1, 'rgba(74,51,36,0.28)'); R(x0 + 2, 1, w0 - 4, 1, 'rgba(255,248,236,0.25)'); }
    /* quilted button tufts across cushion body */
    for (let py = y0 + (n ? 13 : 6); py < y0 + h0 - (s ? 5 : 2); py += 9) {
      for (let px = x0 + (w ? 7 : 4); px < x0 + w0 - (e ? 5 : 2); px += 9) {
        P(px, py, '#756652'); P(px + 1, py, '#8B7B65'); P(px, py + 1, '#EDE3D0');
      }
    }
    /* plump linen pillows spaced along top row (!same(0, -1)) */
    if (n) {
      const pL = w ? 4 : 2, pW = w ? 11 : 13, pR = 17, pW2 = e ? 11 : 13;
      R(pL, 4, pW, 8, '#F4F1EA'); grad(pL, 4, pW, 8, '#FFFFFF', '#DDD6C8');
      R(pL, 12, pW, 1, '#7D6F5D'); R(pL + 2, 7, pW - 4, 1, '#E6DFD2');
      R(pR, 4, pW2, 8, '#EAE5DA'); grad(pR, 4, pW2, 8, '#FAF7F0', '#D5CDC0');
      R(pR, 12, pW2, 1, '#7D6F5D'); R(pR + 2, 7, pW2 - 4, 1, '#DFD8CA');
    }
    /* varied accent floor cushions & woven terracotta/rust throw blanket along bottom row */
    const thv = hs(2, 5, 88);
    if (s) {
      const tx = x0 + (w ? 2 : 0), tw = w0 - (w ? 2 : 0) - (e ? 2 : 0);
      R(tx, y0 + h0 - 12, tw, 9, '#A84836'); grad(tx, y0 + h0 - 12, tw, 9, '#C45B46', '#8E3829');
      R(tx, y0 + h0 - 12, tw, 2, '#DF866E');
      R(tx, y0 + h0 - 7, tw, 1, '#E2A878'); /* woven stripe */
      R(tx, y0 + h0 - 4, tw, 1, '#682419');
    } else if (!n) {
      if (thv > 0.64) {
        /* sage throw cushion */
        R(x0 + 6, 8, 12, 10, '#6B8872'); grad(x0 + 6, 8, 12, 10, '#82A08A', '#56705D');
        R(x0 + 6, 8, 12, 1, '#A9C4AF'); R(x0 + 6, 18, 12, 1, '#3D5243');
      } else if (thv < 0.30) {
        /* ochre bolster cushion */
        R(x0 + 10, 10, 12, 9, '#C89246'); grad(x0 + 10, 10, 12, 9, '#DDA85E', '#A87632');
        R(x0 + 10, 10, 12, 1, '#F2CA88'); R(x0 + 10, 19, 12, 1, '#75501E');
      }
    }
  };

  T[TL.LOCKER] = function (open, A, B) {
    R(0, 0, TS, TS, '#0D1518');
    [2, 17].forEach(function (x) {
      R(x, 2, 13, 28, '#2A5560'); grad(x, 2, 13, 28, '#346872', '#1D3E47');
      R(x, 2, 13, 2, '#5A9AA8'); R(x, 2, 1, 28, '#4A8A99'); R(x + 12, 2, 1, 28, '#14303A');
      for (let y = 5; y < 11; y += 2) R(x + 3, y, 7, 1, '#0D1518');
      R(x + 4, 12, 5, 2, '#DCE6EA');
      R(x + 10, 16, 2, 6, '#DCE6EA'); R(x + 10, 16, 1, 6, '#FFFFFF'); R(x, 29, 13, 1, '#0A1114');
    });
    R(15, 2, 2, 28, '#07100F');
  };

  T[TL.TABLE] = function (open, A, B, floorTile) {
    /* neighbor-aware solid timber table: legs & endcaps only on outer ends, continuous tabletop & subtle props */
    drawUnderlay(open, A, B, floorTile);
    const w = !same(-1, 0), e = !same(1, 0);
    const x0 = w ? 2 : 0, x1 = e ? 30 : 32, tw = x1 - x0;
    R(x0, 6, tw, 18, '#6B4A2E'); grad(x0, 6, tw, 18, '#7E5938', '#583B24');
    for (let y = 9; y < 22; y += 4) { R(x0 + 1, y, tw - 2, 1, '#5A3E26'); R(x0 + ((TX * 5 + y) % 7), y + 1, Math.min(8, tw - 4), 1, '#8A6540'); }
    R(x0, 6, tw, 2, '#B08A58'); R(x0, 6, tw, 1, '#D6AE78'); R(x0, 22, tw, 2, '#3B2616');
    if (w) R(x0, 6, 1, 18, '#9A7548');
    if (e) R(x1 - 1, 6, 1, 18, '#3B2616');
    R(x0, 24, tw, 5, '#2A190E'); R(x0, 24, tw, 1, '#4A3220');
    if (w) R(4, 26, 3, 5, '#1A0F08');
    if (e) R(25, 26, 3, 5, '#1A0F08');
    /* subtle tabletop props on varied columns */
    const pv = hs(3, 7, 91);
    if (pv > 0.72) {
      R(10, 11, 6, 5, '#E8E0D0'); R(11, 12, 4, 3, '#F8F4EC'); R(12, 12, 1, 3, '#A09080');
    } else if (pv > 0.45) {
      R(18, 12, 4, 4, '#2A2A38'); R(19, 11, 2, 3, '#A8E8F8'); P(19, 11, '#FFFFFF');
    }
  };

  T[TL.BOOTH] = function (open, A, B) {
    /* dual turntables + center 4-ch DJ mixer + glowing VU meter LEDs */
    R(0, 0, TS, TS, '#09090E');
    R(0, 0, TS, 2, B); R(0, 2, TS, 1, dim(B, 0.55));
    /* brushed deck plate */
    R(1, 4, 30, 22, '#14141D'); bevel(1, 4, 30, 22, '#2B2B38', '#07070B', 1);
    /* left & right turntables (circles + tonearms) */
    [7, 24].forEach(function (cx) {
      R(cx - 4, 7, 9, 12, '#1E1E28'); bevel(cx - 4, 7, 9, 12, '#343444', '#0A0A10', 1);
      for (let y = 8; y <= 17; y++) for (let x = cx - 3; x <= cx + 3; x++) {
        const d = Math.hypot(x - cx, y - 12.5);
        if (d < 1.2) P(x, y, A);
        else if (d < 3.6) P(x, y, d > 2.8 ? '#9AA0B0' : '#08080C');
      }
      R(cx + 3, 9, 1, 6, '#C8CEDC'); P(cx + 3, 15, B);
      P(cx - 3, 17, N.lim);
    });
    /* center mixer with EQ pots & green/amber/red VU meter LEDs */
    R(13, 6, 6, 17, '#1B1B26'); bevel(13, 6, 6, 17, '#323242', '#09090E', 1);
    [8, 11].forEach(function (y) { P(14, y, '#8A90A0'); P(17, y, '#8A90A0'); });
    [14, 16, 18].forEach(function (y, idx) {
      const c = idx === 0 ? N.red : idx === 1 ? N.amb : N.grn;
      P(15, y, c); P(16, y, c);
    });
    R(14, 21, 4, 1, '#FFFFFF');
    /* front fascia + headphone hook */
    for (let i = 0; i < TS; i += 8) { R(i, 26, 1, 5, '#1A1A24'); R(i + 1, 26, 1, 5, '#0C0C12'); }
    R(0, 26, TS, 1, dim(A, 0.35));
    R(0, 30, TS, 2, 'rgba(0,0,0,0.55)');
  };

  T[TL.RUG] = function (open, A, B, underlay) {
    /* neighbor-aware continuous club/welfare woven rug: outer border on perimeter only, fringe only on left/right edges */
    if (!underlay) drawUnderlay(open, A, B, TL.FLOOR);
    const n = !same(0, -1), s = !same(0, 1), w = !same(-1, 0), e = !same(1, 0);
    const x0 = w ? 2 : 0, x1 = e ? 30 : 32, y0 = n ? 2 : 0, y1 = s ? 30 : 32;
    const rw = x1 - x0, rh = y1 - y0;
    R(x0, y0, rw, rh, '#2A0F1C'); grad(x0, y0, rw, rh, '#381529', '#200A14');
    /* continuous global woven diamond & stripe motif */
    for (let py = y0; py < y1; py++) {
      const gy = TY * TS + py;
      for (let px = x0; px < x1; px++) {
        const gx = TX * TS + px;
        const dx = Math.abs((gx & 15) - 7.5), dy = Math.abs((gy & 15) - 7.5);
        if (dx + dy < 2.2) P(px, py, '#D49E48');
        else if (Math.abs(dx + dy - 5.5) < 0.9) P(px, py, '#6E263A');
        else if ((gy & 3) === 0 && (gx & 1) === 0) P(px, py, '#240C17');
      }
    }
    /* woven crimson border ONLY on exposed outer edges */
    if (n) { R(x0, y0, rw, 3, '#8A2E40'); R(x0, y0, rw, 1, '#C44E64'); }
    if (s) { R(x0, y1 - 3, rw, 3, '#8A2E40'); R(x0, y1 - 1, rw, 1, '#581A28'); }
    if (w) { R(x0, y0, 3, rh, '#8A2E40'); R(x0, y0, 1, rh, '#C44E64'); }
    if (e) { R(x1 - 3, y0, 3, rh, '#8A2E40'); R(x1 - 1, y0, 1, rh, '#581A28'); }
    /* tassel fringe ONLY on exposed left/right edges */
    if (w) for (let y = y0 + 2; y < y1 - 1; y += 3) R(0, y, 2, 1, '#C9A66B');
    if (e) for (let y = y0 + 2; y < y1 - 1; y += 3) R(30, y, 2, 1, '#C9A66B');
    if (!underlay) contact(open);
  };

  T[TL.FENCE] = function (open, A, B) {
    T[TL.SIDEWALK](open, A, B, true);
    R(0, 10, TS, 2, A); R(0, 12, TS, 1, dim(A, 0.5)); R(0, 20, TS, 2, A); R(0, 22, TS, 1, dim(A, 0.5));
    [2, 13, 24].forEach(function (i) {
      R(i, 6, 4, 24, '#9A9AA8'); R(i, 6, 1, 24, '#ECECF6'); R(i + 1, 6, 1, 24, '#C0C0CC'); R(i + 3, 6, 1, 24, '#5E5E6C');
      R(i, 4, 4, 2, '#F4F4FC');
    });
    R(0, 28, TS, 4, 'rgba(4,4,10,0.62)'); for (let x = 0; x < TS; x += 3) P(x, 31, dim(A, 0.55));
  };

  T[TL.STAIRS] = function (open, A, B) {
    /* 3D risers + anti-slip grooved nosing + brushed steel side handrails */
    R(0, 0, TS, TS, '#0B0B10');
    for (let i = 0; i < 4; i++) {
      const y = i * 8, tr = i & 1 ? '#4E4E60' : '#74748A';
      R(3, y, 26, 6, tr); grad(3, y + 2, 26, 4, tr, dim(tr, 0.28));
      /* anti-slip metallic nosing strip */
      R(3, y, 26, 2, i & 1 ? '#8C8CA2' : '#B4B4CA');
      for (let x = 5; x < 28; x += 4) P(x, y + 1, '#3E3E4E');
      /* vertical riser shadow */
      R(3, y + 6, 26, 2, '#07070B');
    }
    /* side stringers & handrails */
    R(0, 0, 3, TS, '#2A2A36'); R(1, 0, 1, TS, '#D8DCE8');
    R(29, 0, 3, TS, '#2A2A36'); R(30, 0, 1, TS, '#D8DCE8');
    /* top neon portal bar */
    R(0, 0, TS, 2, N.lim); R(0, 2, TS, 1, dim(N.lim, 0.6));
  };

  T[TL.BARREL] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D');
    R(4, 12, 24, 20, '#3A3A44');
    for (let x = 4; x < 28; x++) {
      const t = (x - 4) / 23;
      R(x, 12, 1, 20, t < 0.2 ? '#5A5A68' : t < 0.6 ? '#40404C' : t < 0.85 ? '#2C2C36' : '#1C1C24');
    }
    R(4, 12, 24, 2, '#8A8A99'); R(4, 20, 24, 2, '#1A1A20'); R(4, 21, 24, 1, '#55555F'); R(4, 28, 24, 2, '#1A1A20');
    ellS(16, 8, 7, 6, EM.ramp(N.org)); ellS(16, 6, 4.5, 5, EM.ramp(N.yel));
    R(15, 1, 3, 4, '#FFFFFF'); P(14, 3, N.yel); P(18, 4, N.yel);
    spk(4, 2, N.org, 1, 1); R(2, 30, 28, 2, 'rgba(0,0,0,0.45)');
  };

  T[TL.PLANT] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D');
    R(10, 20, 12, 12, '#5A3A28'); grad(10, 20, 12, 12, '#6E4832', '#46281A');
    R(9, 20, 14, 2, '#9A6A44'); R(10, 30, 12, 2, '#2A160C');
    const leaf = function (x, y, rx, ry, c) { ellS(x, y, rx, ry, EM.ramp(c)); };
    leaf(16, 12, 3.4, 8, '#1E8A48'); leaf(9, 12, 6, 2.6, N.grn); leaf(23, 11, 6, 2.6, N.grn);
    leaf(11, 6, 4, 2, '#1E8A48'); leaf(21, 7, 4, 2, '#1E8A48'); leaf(16, 4, 2.6, 3, N.grn);
    R(16, 14, 1, 7, '#14602F'); R(2, 30, 28, 2, 'rgba(0,0,0,0.35)');
  };

  T[TL.DOORF] = function (open, A, B) {
    /* unmistakable 16-bit club portal: steel jambs, glowing transom bar, diamond-plate threshold */
    R(0, 0, TS, TS, '#0B0B11');
    /* subtle dithered transom glow spill onto floor */
    grad(3, 5, 26, 10, dim(N.lim, 0.72), '#0B0B11');
    /* overhead illuminated transom header */
    R(0, 0, TS, 4, N.lim); R(0, 0, TS, 1, '#EEFFD0'); R(0, 4, TS, 1, dim(N.lim, 0.55));
    /* steel door jambs with rivet pips */
    R(0, 0, 3, TS, '#242432'); R(2, 4, 1, TS - 4, '#545468');
    R(29, 0, 3, TS, '#242432'); R(29, 4, 1, TS - 4, '#545468');
    [[1, 10], [1, 22], [30, 10], [30, 22]].forEach(function (r) { P(r[0], r[1], '#A4A4BC'); });
    /* ribbed threshold & subtle center portal arrow guide */
    R(3, 27, 26, 4, '#181822'); R(3, 27, 26, 1, '#444456');
    for (let x = 5; x < 27; x += 3) P(x, 29, dim(N.lim, 0.4));
    [12, 18].forEach(function (y) { R(6, y, 20, 1, dim(N.lim, 0.58)); });
    /* glowing threshold marker pips */
    R(14, 14, 4, 1, shade(N.lim, 0.2)); R(15, 13, 2, 3, N.lim);
  };

  T[TL.BENCH] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D');
    R(0, 10, TS, 8, '#8A5A3A'); grad(0, 10, TS, 8, '#9E6A46', '#7A4F32');
    R(0, 10, TS, 2, '#C89262'); R(0, 14, TS, 1, '#5A3A22');
    R(0, 18, TS, 4, '#4A2E1A'); R(0, 18, TS, 1, '#6A4228');
    R(2, 22, 4, 8, '#2A1A10'); R(26, 22, 4, 8, '#2A1A10');
    R(2, 22, 1, 8, '#4A3020'); R(26, 22, 1, 8, '#4A3020'); R(0, 30, TS, 2, 'rgba(0,0,0,0.45)');
    for (let x = 4; x < TS; x += 9) P(x, 12, '#B88454');
  };

  T[TL.ROAD] = function (open, A, B) {
    R(0, 0, TS, TS, '#0D0D12'); grad(0, 0, TS, TS, '#101016', '#0A0A0F');
    spk(9, 12, '#17171F', 2, 1); spk(10, 8, '#08080C', 2, 1); spk(11, 3, '#1E1E28', 3, 1);
    if (open(0, -1)) { R(0, 0, TS, 6, '#22222C'); R(0, 0, TS, 2, '#3E3E4E'); R(0, 6, TS, 2, '#06060A'); R(0, 8, TS, 2, '#101119'); }
    [[4, 10], [20, 10]].forEach(function (d, i) {
      R(d[0], 14, d[1], 4, N.amb); R(d[0], 14, d[1], 1, shade(N.amb, 0.3)); R(d[0] + 2, 18, d[1] - 4, 2, dim(N.amb, 0.78));
      if (hs(2 + i, 4, 55) > 0.55) P(d[0] + Math.floor(hs(5 + i, 6, 56) * d[1]), 14, '#0D0D12');
    });
    R(0, 28, TS, 2, 'rgba(25,211,255,0.05)');
  };

  T[TL.SIDEWALK] = function (open, A, B, noContact) {
    const tones = ['#15151C', '#181821', '#13131A', '#1A1A23'];
    for (let q = 0; q < 4; q++) {
      const qx = (q & 1) * 16, qy = (q >> 1) * 16, base = tones[Math.floor(hs(q & 1, q >> 1, 17) * 4)];
      R(qx, qy, 16, 16, base); grad(qx, qy, 16, 16, base, '#101017');
    }
    R(0, 14, TS, 2, '#0B0B11'); R(14, 0, 2, TS, '#0B0B11'); R(0, 30, TS, 2, '#0B0B11'); R(30, 0, 2, TS, '#0B0B11');
    R(0, 0, 14, 1, '#2C2C3A'); R(16, 0, 14, 1, '#2C2C3A'); R(0, 16, 14, 1, '#2C2C3A'); R(16, 16, 14, 1, '#2C2C3A');
    R(0, 1, 1, 12, '#202030'); R(16, 1, 1, 12, '#202030'); R(0, 17, 1, 12, '#202030'); R(16, 17, 1, 12, '#202030');
    spk(5, 7, '#242430', 1, 1); spk(6, 5, '#0F0F15', 2, 1);
    if (hs(2, 3, 23) > 0.84) { for (let i = 0; i < 16; i++) { P(4 + i, 6 + Math.floor(i * 0.9), '#09090E'); P(5 + i, 6 + Math.floor(i * 0.9), '#20202C'); } }
    if (hs(4, 1, 29) > 0.93) R(20, 8, 3, 3, '#2B2233');
    if (!noContact) contact(open);
  };

  T[TL.CURTAIN] = function (open, A, B) {
    R(0, 0, TS, TS, '#14060A');
    for (let i = 0; i < TS; i += 8) {
      R(i, 4, 3, 26, '#9A2234'); R(i + 3, 4, 3, 26, '#5A1220'); R(i + 6, 4, 2, 26, '#2A0810'); R(i, 4, 1, 26, '#CC3E54');
      R(i + 1, 2, 2, 2, '#E4C47A');
    }
    R(0, 0, TS, 3, '#C9A66B'); R(0, 0, TS, 1, '#F6E4AC'); R(0, 3, TS, 1, '#6A5226');
    R(0, 30, TS, 2, 'rgba(255,90,140,0.14)');
  };

  T[TL.MIRROR] = function (open, A, B) {
    /* neighbor-aware vanity mirror: warm oak/brass frame in apartment (a_*), backlit cyan/sticker mirror in club */
    const w = !same(-1, 0), e = !same(1, 0);
    const x0 = w ? 2 : 0, x1 = e ? 30 : 32, mw = x1 - x0;
    if (ZONE_ID.indexOf('a_') === 0) {
      T[TL.HWALL](open);
      R(x0, 2, mw, 22, '#7C5332');
      R(x0 + 1, 3, mw - 2, 20, '#96C2D2'); grad(x0 + 1, 3, mw - 2, 20, '#DAF2FA', '#7EAEC0');
      R(x0, 1, mw, 2, '#FFF2C6');
      for (let i = 0; i < 6; i++) {
        const sx = x0 + 4 + i * 3;
        if (sx + 3 < x1 - 1) { R(sx, 19 - i * 2, 3, 1, '#FFFFFF'); R(sx + 1, 20 - i * 2, 2, 1, '#EAF8FF'); }
      }
      R(x0, 2, mw, 1, '#B48454'); R(x0, 23, mw, 1, '#4A301A');
      if (w) { R(1, 2, 1, 22, '#B48454'); }
      if (e) { R(30, 2, 1, 22, '#4A301A'); }
      return;
    }
    R(0, 0, TS, TS, '#0C1A1E');
    R(x0, 2, mw, 22, '#2F4F5A'); grad(x0, 2, mw, 22, '#A8D0DC', '#3E6B7A');
    /* vanity LED strip along top frame */
    R(x0, 1, mw, 1, '#D8F8FF');
    for (let i = 0; i < 8; i++) {
      const sx = x0 + 4 + i * 3;
      if (sx + 3 < x1) { R(sx, 20 - i * 2, 3, 1, '#EAF8FF'); R(sx + 1, 21 - i * 2, 2, 1, '#FFFFFF'); }
    }
    /* club sticker on select tiles */
    if (hs(3, 5, 44) > 0.65) { R(x0 + 4, 17, 4, 3, A); P(x0 + 5, 18, '#FFFFFF'); }
    R(x0, 2, mw, 1, '#E8F6FF'); R(x0, 23, mw, 1, '#1E343D');
    if (w) { R(1, 1, 1, 24, '#6A8A96'); R(2, 2, 1, 22, '#E8F6FF'); }
    if (e) { R(30, 1, 1, 24, '#0A1418'); R(29, 2, 1, 22, '#2A4650'); }
    R(0, 24, TS, 8, '#0C1A1E'); R(0, 30, TS, 2, '#2F8A99');
  };

  T[TL.RAIL] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D');
    R(0, 12, TS, 4, '#E8E8F0'); R(0, 12, TS, 1, '#FFFFFF'); R(0, 15, TS, 1, '#9A9AAA');
    for (let i = 2; i < TS; i += 10) { R(i, 16, 2, 16, '#6A6A7C'); R(i, 16, 1, 16, '#9A9AAC'); }
    R(0, 30, TS, 2, 'rgba(0,0,0,0.45)');
  };

  T[TL.CRATE] = function (open, A, B) {
    R(0, 0, TS, TS, '#09090D'); R(2, 4, 28, 26, '#6B4A2E'); grad(2, 4, 28, 26, '#7C5736', '#583B24');
    R(2, 4, 28, 2, N.amb); R(2, 16, 28, 2, '#3B2616'); R(14, 4, 2, 26, '#3B2616'); R(2, 28, 28, 2, '#2A190E');
    for (let i = 0; i < 4; i++) { P(4 + i * 7, 8 + (i % 2) * 14, '#D0D0DC'); P(5 + i * 7, 20, '#2A190E'); }
    R(2, 6, 1, 22, '#926C44'); R(29, 6, 1, 22, '#3B2616');
  };

  T[TL.SKY] = function (open, A, B) {
    R(0, 0, TS, TS, '#05060F'); grad(0, 0, TS, TS, '#05060F', '#0A0E24');
    spk(11, 4, '#6A7AA8', 1, 1);
    if (hs(1, 1, 3) > 0.68) {
      R(8, 8, 2, 2, '#FFFFFF'); P(7, 9, '#9AA8D8'); P(10, 9, '#9AA8D8'); P(9, 7, '#9AA8D8'); P(9, 10, '#9AA8D8');
    }
  };

  /* ------------------------------------------------------------ the home tileset: daylight, oak, plaster, linen */
  function wood(i, j, open) {
    R(0, 0, TS, TS, '#B98A58');
    for (let r = 0; r < 2; r++) {
      const y = r * 16, v = hs(i + r, j, 21), c = v > 0.66 ? '#C49562' : v > 0.33 ? '#BA8C5A' : '#B18252';
      R(0, y, TS, 15, c);
      R(0, y, TS, 1, '#D8AC7A'); /* top plank bevel */
      R(0, y + 14, TS, 1, '#A47648');
      R(0, y + 15, TS, 1, '#7D552E'); /* tongue & groove seam */
      const off = Math.floor(hs(j, r, 22) * 20) + 6;
      R(off, y, 1, 15, '#885D34'); R(off + 1, y + 1, 1, 13, '#CEA06D');
      /* woodgrain streaks */
      R(4 + (r * 7) % 10, y + 5, 6, 1, '#AA7B4B');
      R(16 + (r * 5) % 8, y + 10, 7, 1, '#CFA170');
      spk(24 + r, 2, '#9E7042', 4, 1);
    }
    if (open) warmContact(open);
  }

  T[TL.HFLOOR] = function (open, A, B, underlay) { wood(TX, TY, underlay ? null : open); };

  T[TL.HWALL] = function (open) {
    /* warm sunlit plaster + picture rail + timber plinth baseboard (drawn even behind wall-hugging furniture) */
    const showBase = interiorAt(0, 1, open);
    R(0, 0, TS, TS, '#D9CFBF');
    if (showBase) {
      R(0, 0, TS, TS, '#EFE6D7'); R(0, 0, TS, 2, '#FAF4E8');
      /* picture rail molding */
      R(0, 4, TS, 1, '#F8F2E6'); R(0, 5, TS, 1, '#CBBFA9');
      spk(31, 4, '#E2D8C6', 3, 1);
      /* cream/timber plinth baseboard */
      R(0, 22, TS, 10, '#F7F1E7');
      R(0, 22, TS, 1, '#FFFFFF'); R(0, 23, TS, 1, '#D7CCB8');
      R(0, 29, TS, 2, '#DFD4C0');
      R(0, 31, TS, 1, '#9E907B');
    } else {
      R(0, 0, TS, TS, '#CFC4B2'); R(0, 0, TS, 1, '#EAE1D2'); R(0, TS - 1, TS, 1, '#A49882');
    }
    if (interiorAt(-1, 0, open)) R(0, 0, 2, TS, '#BFB4A0');
    if (interiorAt(1, 0, open)) R(TS - 2, 0, 2, TS, '#BFB4A0');
  };

  T[TL.HRUG] = function (open, A, B, floorTile) {
    /* neighbor-aware warm apartment kilim rug (or bathmat on HTILE): perimeter border & left/right tassels only */
    drawUnderlay(open, A, B, floorTile === TL.HTILE ? TL.HTILE : TL.HFLOOR);
    const n = !same(0, -1), s = !same(0, 1), w = !same(-1, 0), e = !same(1, 0);
    const x0 = w ? 2 : 0, x1 = e ? 30 : 32, y0 = n ? 2 : 0, y1 = s ? 30 : 32;
    const rw = x1 - x0, rh = y1 - y0;
    const isMat = n && s && w && e;
    R(x0, y0, rw, rh, isMat ? '#E8DFCE' : '#DFD2B8');
    /* continuous woven geometric kilim pattern across contiguous tiles */
    for (let py = y0; py < y1; py++) {
      const gy = TY * TS + py;
      for (let px = x0; px < x1; px++) {
        const gx = TX * TS + px;
        if (isMat) {
          if ((py & 3) === 0) P(px, py, '#D4C7AE');
        } else {
          const dx = Math.abs((gx & 15) - 7.5), dy = Math.abs((gy & 15) - 7.5);
          if (dx + dy < 2.2) P(px, py, '#C8715A');
          else if (Math.abs(dx + dy - 5.2) < 0.9) P(px, py, '#6E8596');
          else if ((py & 3) === 0) P(px, py, '#D5C7AA');
        }
      }
    }
    /* outer terracotta/slate border ONLY on exposed perimeter edges */
    const bc = isMat ? '#7A96A2' : '#B85D48', hi = isMat ? '#A2BDC8' : '#D98670';
    if (n) { R(x0, y0, rw, 3, bc); R(x0, y0, rw, 1, hi); }
    if (s) { R(x0, y1 - 3, rw, 3, bc); R(x0, y1 - 1, rw, 1, dim(bc, 0.28)); }
    if (w) { R(x0, y0, 3, rh, bc); R(x0, y0, 1, rh, hi); }
    if (e) { R(x1 - 3, y0, 3, rh, bc); R(x1 - 1, y0, 1, rh, dim(bc, 0.28)); }
    /* linen tassel fringe ONLY on outer left/right edges */
    if (w) for (let y = y0 + 2; y < y1 - 1; y += 3) R(0, y, 2, 1, '#F6EFE0');
    if (e) for (let y = y0 + 2; y < y1 - 1; y += 3) R(30, y, 2, 1, '#F6EFE0');
    warmContact(open);
  };

  T[TL.HTILE] = function (open, A, B, underlay) {
    /* warm sage-limestone ceramic grout with crisp contrast so white porcelain fixtures stand out */
    R(0, 0, TS, TS, '#99ACB4');
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
      const x = i * 16, y = j * 16;
      R(x + 1, y + 1, 14, 14, hs(i, j, 8) > 0.5 ? '#D4DFE2' : '#C9D6DA');
      R(x + 1, y + 1, 14, 1, '#E6EEF0'); R(x + 1, y + 1, 1, 14, '#E2ECEE');
      R(x + 1, y + 14, 14, 1, '#B0C0C6'); R(x + 14, y + 1, 1, 14, '#B0C0C6');
      P(x + 4, y + 4, '#EDF3F4'); P(x + 5, y + 5, '#E2ECEE');
    }
    if (!underlay) warmContact(open);
  };

  T[TL.HCOUCH] = function (open, A, B, floorTile) {
    /* neighbor-aware flat sage-velvet sofa: outer armrests & oak feet only on exposed ends */
    drawUnderlay(open, A, B, floorTile || TL.HFLOOR);
    const w = !same(-1, 0), e = !same(1, 0);
    const x0 = w ? 1 : 0, x1 = e ? 31 : 32, cw = x1 - x0;
    R(x0, 28, cw, 3, 'rgba(40,24,10,0.22)');
    R(x0, 3, cw, 25, '#5F8A78'); grad(x0, 3, cw, 25, '#7AA494', '#4A7060');
    R(x0, 3, cw, 3, '#A2C6B4'); R(x0, 3, cw, 1, '#CAE2D4'); R(x0, 26, cw, 2, '#34504A');
    /* seam between cushions */
    R(15, 8, 2, 18, '#466C5C');
    if (w) { R(0, 7, 4, 21, '#6C9684'); bevel(0, 7, 4, 21, '#A2C6B4', '#34504A', 1); R(2, 28, 3, 3, '#4A301A'); }
    if (e) { R(28, 7, 4, 21, '#6C9684'); bevel(28, 7, 4, 21, '#A2C6B4', '#34504A', 1); R(27, 28, 3, 3, '#4A301A'); }
    R(x0, 27, cw, 2, '#6E4A2A');
    /* warm mustard & terracotta throw cushions varied across width */
    const cx = w ? 8 : 4;
    if ((TX & 1) === 0) {
      R(cx, 9, 7, 7, '#E8B46A'); R(cx, 9, 7, 1, '#F8DA9F'); R(cx, 15, 7, 1, '#B88442');
    } else {
      R(18, 9, 7, 7, '#D47B5E'); R(18, 9, 7, 1, '#F0A48A'); R(18, 15, 7, 1, '#9A4D38');
    }
  };

  T[TL.HBED] = function (open, A, B, floorTile) {
    /* neighbor-aware cohesive oak bed: headboard + twin pillows on north edge, unified linen sheet, folded duvet throw at foot */
    drawUnderlay(open, A, B, floorTile || TL.HFLOOR);
    const n = !same(0, -1), s = !same(0, 1), w = !same(-1, 0), e = !same(1, 0);
    const x0 = w ? 2 : 0, x1 = e ? 30 : 32, y0 = n ? 1 : 0, y1 = s ? 30 : 32;
    const bw = x1 - x0, bh = y1 - y0;
    if (s) R(x0, 29, bw, 3, 'rgba(40,24,10,0.28)');
    /* base linen sheet */
    R(x0, y0, bw, bh, '#EDE6D8');
    if (n) {
      /* solid oak headboard along top */
      R(x0, 0, bw, 4, '#7C5332'); R(x0, 0, bw, 1, '#B48258'); R(x0, 3, bw, 1, '#4A301A');
      /* plump linen pillows */
      const pL = w ? 4 : 2, pW = w ? 11 : 13, pR = 17, pW2 = e ? 11 : 13;
      R(pL, 5, pW, 9, '#FFFFFF'); R(pL, 13, pW, 1, '#CFC8B8'); R(pL + 2, 8, pW - 4, 1, '#E2DCD0');
      R(pR, 5, pW2, 9, '#FFFFFF'); R(pR, 13, pW2, 1, '#CFC8B8'); R(pR + 2, 8, pW2 - 4, 1, '#E2DCD0');
      /* turned-down crisp white sheet fold */
      R(x0, 15, bw, 4, '#FAF6EE'); R(x0, 18, bw, 1, '#CFC8B8');
      /* upper cobalt duvet */
      R(x0, 19, bw, y1 - 19, '#7DA0C4'); R(x0, 19, bw, 2, '#BDD4EA');
    } else {
      /* cohesive cobalt quilted duvet across body & foot */
      R(x0, y0, bw, bh, '#7DA0C4'); grad(x0, y0, bw, bh, '#8EB0D2', '#688DB4');
      for (let k = 4; k < TS; k += 8) {
        if (k >= x0 && k < x1) R(k, y0, 1, bh, 'rgba(50,80,120,0.20)');
        if (k >= y0 && k < y1) R(x0, k, bw, 1, 'rgba(50,80,120,0.20)');
      }
      if (s) {
        /* folded warm terracotta/ochre throw blanket across foot of bed + oak footboard */
        R(x0, 14, bw, 11, '#C86D51'); grad(x0, 14, bw, 11, '#DC8266', '#AA563E');
        R(x0, 14, bw, 2, '#EEAA92'); R(x0, 24, bw, 1, '#7A3826');
        R(x0, 26, bw, 3, '#7C5332'); R(x0, 26, bw, 1, '#A4744A'); R(x0, 28, bw, 1, '#4A301A');
      }
    }
    /* oak side bed rails ONLY on outer left/right edges */
    if (w) { R(1, y0, 2, bh, '#7C5332'); R(1, y0, 1, bh, '#A4744A'); }
    if (e) { R(29, y0, 2, bh, '#6A4426'); R(30, y0, 1, bh, '#4A301A'); }
  };

  T[TL.HTABLE] = function (open, A, B, floorTile) {
    /* neighbor-aware warm oak flat table: outer legs & end trim only, continuous tabletop & lived-in surface props */
    drawUnderlay(open, A, B, floorTile || TL.HFLOOR);
    const w = !same(-1, 0), e = !same(1, 0);
    const x0 = w ? 2 : 0, x1 = e ? 30 : 32, tw = x1 - x0;
    R(x0, 4, tw, 18, '#D8B07A'); grad(x0, 4, tw, 18, '#E6C28E', '#C69960');
    R(x0, 4, tw, 2, '#F6DCAC'); R(x0, 21, tw, 2, '#9C7444');
    if (w) R(x0, 4, 1, 18, '#EED0A0');
    if (e) R(x1 - 1, 4, 1, 18, '#9C7444');
    if (w) R(3, 23, 3, 8, '#8E653A');
    if (e) R(26, 23, 3, 8, '#8E653A');
    spk(41, 3, '#B98A58', 5, 1);
    const pv = hs(2, 9, 93);
    if (pv > 0.72) {
      /* open paperback book */
      R(9, 9, 8, 6, '#3B5C78'); R(10, 10, 3, 4, '#FAF6EC'); R(14, 10, 3, 4, '#EFE9DA');
    } else if (pv > 0.45) {
      /* ceramic coaster + morning water glass */
      R(18, 11, 5, 5, '#9E543E'); R(19, 9, 3, 4, '#B8E4F2'); P(19, 9, '#FFFFFF');
    }
  };

  T[TL.HCOUNTER] = function (open, A, B, floorTile) {
    /* neighbor-aware kitchen counter; in a_kitchen includes inset stainless sink (TX=3..4) & 4-burner stovetop (TX=10) */
    const w = !same(-1, 0), e = !same(1, 0);
    R(0, 0, TS, TS, '#C9D8D0');
    R(0, 2, TS, 10, '#F3EFE6'); R(0, 2, TS, 2, '#FFFFFF'); spk(51, 4, '#DFD9CA', 2, 1); R(0, 12, TS, 1, '#C4BCAA');
    R(0, 13, TS, 19, '#8FB3A4'); grad(0, 13, TS, 19, '#9EC2B2', '#789E8E'); R(0, 13, TS, 1, '#6B9080');
    R(2, 16, 12, 13, '#84A898'); R(18, 16, 12, 13, '#84A898');
    R(2, 16, 12, 1, '#B4D4C6'); R(18, 16, 12, 1, '#B4D4C6');
    R(12, 22, 2, 3, '#E8C46A'); R(18, 22, 2, 3, '#E8C46A');
    if (w) R(0, 2, 1, 30, '#6B9080');
    if (e) R(TS - 1, 2, 1, 30, '#587A6B');
    if (ZONE_ID === 'a_kitchen') {
      if (TX === 3) {
        /* inset stainless-steel sink basin + chrome gooseneck faucet */
        R(3, 3, 26, 9, '#1C1A29'); R(4, 4, 24, 7, '#647680'); R(5, 5, 22, 5, '#42525C');
        R(15, 7, 2, 2, '#1C1A29'); P(15, 7, '#C8D8E0');
        R(14, 0, 4, 5, '#1C1A29'); R(15, 0, 2, 5, '#E4EEF4'); R(15, 4, 3, 1, '#A4D8EC');
        P(20, 3, '#D8E4EA');
      } else if (TX === 4) {
        /* stainless draining board & drying plate */
        R(2, 4, 20, 7, '#82949C'); R(3, 5, 18, 5, '#BCCAD0');
        for (let x = 5; x < 20; x += 3) R(x, 6, 1, 3, '#6C7E86');
        R(23, 5, 6, 5, '#FFFFFF'); R(24, 6, 4, 3, '#D8E2E6');
      } else if (TX === 10) {
        /* 4-burner black glass/cast-iron stovetop + copper kettle & skillet + oven front */
        R(2, 2, 28, 10, '#181A22'); R(3, 3, 26, 8, '#242834');
        [[7, 4], [19, 4], [7, 8], [19, 8]].forEach(function (b) {
          R(b[0], b[1], 6, 3, '#101218'); R(b[0] + 1, b[1] + 1, 4, 1, '#444B5A');
        });
        /* copper kettle on back-left burner + dark skillet on front-right */
        R(8, 2, 5, 4, '#C87042'); R(9, 2, 3, 1, '#F2A274'); P(13, 3, '#1C1A29');
        R(19, 7, 6, 3, '#2E3440'); R(25, 8, 4, 1, '#4A5262');
        /* oven front window & control knobs */
        R(3, 14, 26, 3, '#2A2F3A');
        [6, 10, 20, 24].forEach(function (kx) { P(kx, 15, '#E6ECF0'); });
        R(5, 18, 22, 11, '#1C2028'); R(7, 20, 18, 7, '#343C4A');
        R(6, 18, 20, 1, '#DCE4EA');
      }
    }
  };

  T[TL.HSPEAKER] = function (open) {
    wood(TX, TY);
    R(5, 2, 22, 28, '#6A4A2E'); grad(5, 2, 22, 28, '#7C5A3C', '#553922');
    R(5, 2, 22, 2, '#A27D56'); R(5, 28, 22, 2, '#3B2616');
    R(10, 6, 12, 12, '#221E1A'); R(12, 8, 8, 8, '#3B342E'); R(15, 11, 2, 2, '#C8925A');
    R(12, 21, 8, 6, '#221E1A'); R(14, 23, 4, 2, '#4A423A');
  };

  T[TL.HCOATS] = function (open) {
    wood(TX, TY);
    const v = hs(2, 4, 73);
    const c1 = v > 0.66 ? '#C75B4A' : v > 0.33 ? '#3F6388' : '#7E547A';
    const c2 = v > 0.50 ? '#4B6A8C' : '#9B5842';
    const c3 = v > 0.55 ? '#E8B46A' : '#588268';
    const ox = Math.floor(v * 3);
    R(3 + ox, 8, 25 - ox, 20, c1); R(7 + (ox ^ 1), 4, 18, 14, c2); R(13 - ox, 10, 15, 14, c3); R(5 + ox, 20, 14, 8, '#6E8F72');
    R(3 + ox, 8, 25 - ox, 1, shade(c1, 0.25)); R(7 + (ox ^ 1), 4, 18, 1, shade(c2, 0.25)); R(13 - ox, 10, 15, 1, shade(c3, 0.25));
    R(3 + ox, 27, 25 - ox, 1, dim(c1, 0.38));
    for (let i = 8 + ox; i < 27; i += 6) P(i, 14 + (i % 3), '#33201A');
  };

  T[TL.HPLANT] = function (open) {
    wood(TX, TY);
    R(10, 18, 12, 12, '#B8663F'); R(9, 18, 14, 2, '#DC8E62'); R(10, 28, 12, 2, '#7A3F22');
    ellS(16, 11, 10, 9, { h2: '#9ED79A', h: '#6FB46C', b: '#4C9455', s: '#357543', s2: '#245832' });
  };

  T[TL.HDOOR] = function (open) {
    /* unmistakable warm apartment portal: cream architrave jambs, warm amber transom indicator, brass hardware */
    wood(TX, TY);
    R(0, 0, 4, TS, '#F5EFE4'); R(28, 0, 4, TS, '#F5EFE4');
    R(3, 0, 1, TS, '#BFB39E'); R(28, 0, 1, TS, '#BFB39E');
    /* warm oak door leaf + subtle warm amber transom light header */
    R(4, 0, 24, 4, '#FFB020'); R(4, 0, 24, 1, '#FFF0BA'); R(4, 4, 24, 1, '#9E6814');
    R(4, 5, 24, 23, '#8A5A34');
    R(6, 7, 9, 9, '#9C6C42'); bevel(6, 7, 9, 9, '#B68454', '#6E4424', 1);
    R(17, 7, 9, 9, '#9C6C42'); bevel(17, 7, 9, 9, '#B68454', '#6E4424', 1);
    R(6, 18, 9, 9, '#9C6C42'); bevel(6, 18, 9, 9, '#B68454', '#6E4424', 1);
    R(17, 18, 9, 9, '#9C6C42'); bevel(17, 18, 9, 9, '#B68454', '#6E4424', 1);
    R(24, 15, 3, 3, '#FFD470'); P(25, 16, '#9E7422');
    /* brass threshold plate */
    R(4, 28, 24, 3, '#D8B258'); R(4, 28, 24, 1, '#F8E09A');
  };

  T[TL.HTOILET] = function (open, A, B, floorTile) {
    /* south-facing domestic porcelain toilet: wide tank + dual-flush against top wall, oval open seat + bowl pointing downward, side TP roll */
    drawUnderlay(open, A, B, floorTile || TL.HTILE);
    R(10, 27, 12, 3, 'rgba(28,26,41,0.22)');
    /* toilet paper holder on left */
    R(2, 9, 5, 8, '#1C1A29'); R(3, 10, 3, 6, '#FAF6EC'); R(3, 10, 3, 1, '#FFFFFF'); P(4, 12, '#8E98A0');
    /* wide porcelain cistern tank at top */
    R(7, 1, 18, 10, '#1C1A29');
    R(8, 2, 16, 8, '#F6FAFB'); R(8, 2, 16, 2, '#FFFFFF'); R(8, 9, 16, 1, '#B8C6CC');
    R(14, 4, 4, 2, '#7E8E96'); P(15, 4, '#FFFFFF');
    /* oval toilet seat & tapered porcelain bowl pointing south */
    R(11, 11, 10, 2, '#1C1A29');
    R(9, 12, 14, 11, '#1C1A29'); R(10, 23, 12, 3, '#1C1A29'); R(12, 26, 8, 2, '#1C1A29');
    R(10, 12, 12, 11, '#FFFFFF'); R(11, 23, 10, 2, '#F0F5F7'); R(12, 25, 8, 2, '#C8D6DC');
    /* shaded interior water basin so bowl silhouette is unmistakable */
    R(12, 14, 8, 7, '#7CA4B2'); R(13, 15, 6, 5, '#5C8A9A');
    P(14, 16, '#E8FAFF'); P(15, 17, '#B8E8F4');
  };

  T[TL.HSINK] = function (open, A, B, floorTile) {
    /* illuminated overhead mirror + porcelain basin + chrome faucet + warm oak vanity cabinet */
    drawUnderlay(open, A, B, floorTile || TL.HTILE);
    /* backlit wall mirror */
    R(6, 0, 20, 10, '#1C1A29');
    R(7, 1, 18, 8, '#98C4D4'); grad(7, 1, 18, 8, '#D8F2FA', '#76A6B8');
    R(7, 0, 18, 1, '#FFF4C8');
    R(9, 7, 3, 1, '#FFFFFF'); R(11, 5, 3, 1, '#FFFFFF'); P(13, 4, '#FFFFFF');
    /* marble/porcelain vanity top + recessed basin + chrome mixer + soap */
    R(3, 11, 26, 10, '#1C1A29');
    R(4, 12, 24, 8, '#FFFFFF'); R(4, 18, 24, 2, '#D0DCE0');
    R(8, 13, 16, 5, '#8BAAB6'); R(9, 14, 14, 3, '#5C8292'); R(15, 15, 2, 1, '#1C1A29');
    R(14, 9, 4, 5, '#1C1A29'); R(15, 10, 2, 4, '#E8F2F6'); P(15, 10, '#FFFFFF');
    R(5, 10, 3, 4, '#1C1A29'); R(6, 11, 1, 2, '#629E92');
    /* warm oak vanity cabinet below */
    R(4, 21, 24, 9, '#1C1A29');
    R(5, 21, 22, 8, '#96653C'); R(5, 21, 22, 1, '#B88456');
    R(15, 22, 2, 7, '#5A3A20');
    R(13, 24, 1, 3, '#E8C46A'); R(18, 24, 1, 3, '#E8C46A');
    R(5, 29, 22, 2, 'rgba(28,26,41,0.22)');
  };

  T[TL.HSKY] = function (open) {
    R(0, 0, TS, TS, '#8FC4E8'); grad(0, 0, TS, TS, '#7AB6E2', '#BEDDF0');
    if (hs(2, 2, 5) > 0.50) { R(6, 10, 18, 5, '#FFFFFF'); R(10, 7, 10, 4, '#FFFFFF'); R(6, 14, 18, 1, '#D8E8F4'); }
  };

  T[TL.HRAIL] = function (open) {
    R(0, 0, TS, TS, '#BEDDF0'); R(0, 0, TS, 8, '#8FC4E8');
    R(0, 12, TS, 3, '#2F3438'); R(0, 12, TS, 1, '#5A6268');
    for (let x = 3; x < TS; x += 8) R(x, 15, 2, 17, '#2F3438');
    R(0, 28, TS, 4, '#B07C4C');
  };

  T[TL.HBALC] = function (open) {
    R(0, 0, TS, TS, '#C98A62');
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
      const x = i * 16, y = j * 16;
      R(x + 1, y + 1, 14, 14, hs(i, j, 9) > 0.5 ? '#D9966A' : '#D18F63');
      R(x + 1, y + 1, 14, 1, '#E8B088'); R(x + 1, y + 14, 14, 1, '#A8714A');
    }
  };

  /* ------------------------------------------------------------ 48..55 NEW FURNITURE & EQUIPMENT TILES */
  T[TL.ARMCHAIR] = function (open, A, B, floorTile) {
    /* 48: plush club/flat tufted velvet armchair with rolled arms & walnut legs */
    drawUnderlay(open, A, B, floorTile);
    R(4, 28, 24, 3, 'rgba(0,0,0,0.45)');
    /* back rest */
    R(4, 2, 24, 12, '#6A2246'); grad(4, 2, 24, 12, '#86305B', '#541836');
    R(4, 2, 24, 2, '#B65486');
    P(11, 7, '#DDA0C0'); P(20, 7, '#DDA0C0');
    /* plush seat cushion */
    R(6, 13, 20, 12, '#7A2A52'); grad(6, 13, 20, 12, '#943A68', '#5E1E3E');
    R(6, 13, 20, 1, '#C86A9A'); R(6, 24, 20, 2, '#3C1026');
    /* rolled armrests */
    R(3, 10, 5, 16, '#84305A'); bevel(3, 10, 5, 16, '#B85A88', '#42122A', 1);
    R(24, 10, 5, 16, '#84305A'); bevel(24, 10, 5, 16, '#B85A88', '#42122A', 1);
    /* walnut feet */
    R(5, 26, 3, 4, '#5A3A22'); R(24, 26, 3, 4, '#5A3A22');
  };

  T[TL.LIGHTRIG] = function (open, A, B, floorTile) {
    /* 49: industrial truss lighting totem / synth flight case with glowing PAR cans */
    drawUnderlay(open, A, B, floorTile);
    R(4, 28, 24, 3, 'rgba(0,0,0,0.4)');
    /* heavy baseplate */
    R(5, 25, 22, 5, '#1D1D26'); bevel(5, 25, 22, 5, '#424254', '#08080C', 1);
    R(9, 26, 14, 3, '#101016'); P(11, 27, N.grn); P(14, 27, N.amb); P(19, 27, A);
    /* aluminum truss columns & cross-braces */
    R(10, 7, 2, 18, '#8E8EA2'); R(20, 7, 2, 18, '#8E8EA2');
    R(10, 7, 1, 18, '#D8D8EC'); R(20, 7, 1, 18, '#D8D8EC');
    for (let y = 9; y < 24; y += 5) { R(12, y, 8, 1, '#6C6C80'); R(12, y + 2, 8, 1, '#A4A4B8'); }
    /* top lighting T-bar + dual PAR cans glowing A & B */
    R(3, 4, 26, 3, '#3E3E4C'); R(3, 4, 26, 1, '#848498');
    R(4, 1, 6, 5, '#1B1B24'); R(5, 2, 4, 3, A); P(6, 3, '#FFFFFF');
    R(22, 1, 6, 5, '#1B1B24'); R(23, 2, 4, 3, B); P(24, 3, '#FFFFFF');
    R(13, 2, 6, 4, '#242430'); R(14, 3, 4, 2, N.amb);
  };

  T[TL.COATRACK] = function (open, A, B, floorTile) {
    /* 50: rolling chrome garment rail with winter coats & numbered check tags */
    drawUnderlay(open, A, B, floorTile);
    R(4, 29, 24, 2, 'rgba(0,0,0,0.35)');
    /* caster feet + side uprights */
    R(3, 28, 26, 2, '#545464'); R(3, 28, 26, 1, '#9A9AAC');
    R(4, 30, 2, 2, '#282834'); R(26, 30, 2, 2, '#282834');
    R(3, 4, 2, 24, '#8A8A9C'); R(3, 4, 1, 24, '#E8E8F4');
    R(27, 4, 2, 24, '#8A8A9C'); R(27, 4, 1, 24, '#E8E8F4');
    /* top chrome crossbar + hangers */
    R(3, 3, 26, 2, '#D8D8EC'); R(3, 3, 26, 1, '#FFFFFF');
    /* hanging coats with varied silhouettes & white coat-check tags */
    const coats = [
      [6, 5, 4, 19, '#B84A3C', '#DF7868'],
      [10, 6, 4, 20, '#365478', '#5C82AC'],
      [14, 5, 4, 17, '#D49A4A', '#F4C678'],
      [18, 6, 4, 20, '#2C6A50', '#4A9C78'],
      [22, 5, 4, 18, '#7A3E6A', '#AE669A']
    ];
    coats.forEach(function (c, i) {
      R(c[0] + 1, 4, 2, 2, '#E8E8F4'); /* hanger hook */
      R(c[0], c[1], c[2], c[3], c[4]);
      R(c[0], c[1], 1, c[3] - 1, c[5]);
      R(c[0] + 1, c[1] + 5, 2, 2, '#FFFFFF'); /* check tag */
      if (i % 2 === 0) R(c[0], c[1] + c[3] - 2, c[2], 2, dim(c[4], 0.4));
    });
  };

  T[TL.FRIDGE] = function (open, A, B, floorTile) {
    /* 51: illuminated glass-door beverage cooler / flat fridge */
    drawUnderlay(open, A, B, floorTile);
    R(4, 29, 24, 3, 'rgba(0,0,0,0.38)');
    R(4, 1, 24, 30, '#96A6AE'); bevel(4, 1, 24, 30, '#DCE6EA', '#4A565E', 1);
    /* backlit glass interior */
    R(6, 4, 18, 20, '#6BC8DC'); grad(6, 4, 18, 20, '#B2EEF8', '#4A9EB2');
    /* shelves & bottles */
    [9, 15, 21].forEach(function (sy, row) {
      R(6, sy, 18, 1, '#326A78');
      for (let x = 8; x < 22; x += 4) {
        const col = (x + row) % 3 === 0 ? '#2E8B57' : (x + row) % 3 === 1 ? N.amb : '#E5332A';
        R(x, sy - 4, 2, 4, col); P(x, sy - 4, '#FFFFFF');
      }
    });
    /* diagonal glass highlight & handle */
    for (let i = 0; i < 6; i++) P(8 + i, 10 - i, '#FFFFFF');
    R(25, 9, 2, 10, '#E8F2F6'); R(25, 9, 1, 10, '#FFFFFF');
    /* bottom compressor grille */
    R(6, 26, 20, 3, '#222830');
    for (let x = 8; x < 25; x += 3) R(x, 27, 1, 1, '#586672');
  };

  T[TL.BOOKSHELF] = function (open, A, B, floorTile) {
    /* 52: warm walnut bookshelf packed with varied vinyl LPs, art books & occasional trailing plant */
    drawUnderlay(open, A, B, floorTile);
    R(2, 30, 28, 2, 'rgba(0,0,0,0.38)');
    R(2, 1, 28, 30, '#6A462B'); bevel(2, 1, 28, 30, '#9C6D46', '#3A2414', 1);
    const shelves = [3, 12, 21];
    const cols = ['#E05848', '#3884B8', '#E8B84A', '#449A6A', '#D8D0C0', '#9A54A8', '#E47E3C'];
    const seed = TX * 7 + TY * 13;
    shelves.forEach(function (sy, idx) {
      R(4, sy, 24, 7, '#2A180E'); /* shelf recess */
      R(4, sy + 7, 24, 2, '#7D5434'); R(4, sy + 7, 24, 1, '#AE7C52');
      for (let x = 5; x < 25; x += 3) {
        if (hs(x, idx, 71) > 0.84) continue; /* occasional shelf gap */
        const h = 4 + ((x + idx * 3 + seed) % 3), c = cols[(x + idx * 2 + seed) % cols.length];
        R(x, sy + 7 - h, 2, h, c); P(x, sy + 7 - h, shade(c, 0.28));
      }
    });
    if (hs(1, 2, 72) > 0.42) {
      /* trailing pothos plant on alternating top-right or top-left */
      const px = (TX & 1) ? 8 : 25;
      ellS(px, 4, 4, 3, { h2: '#9ED79A', h: '#6FB46C', b: '#4C9455', s: '#357543', s2: '#245832' });
      R(px + 1, 6, 2, 5, '#4C9455'); P(px + 2, 11, '#6FB46C');
    } else {
      /* leaning framed photo / ceramic bookend */
      R(6, 4, 5, 6, '#E8DFCE'); R(7, 5, 3, 4, '#3884B8');
    }
  };

  T[TL.OTTOMAN] = function (open, A, B, floorTile) {
    /* 53: tufted teal-velvet pouf / ottoman with piping & dark feet */
    drawUnderlay(open, A, B, floorTile);
    R(6, 25, 20, 4, 'rgba(0,0,0,0.45)');
    ellS(16, 16, 10, 8, EM.ramp('#2C848E'));
    /* tufted rim & central button */
    R(8, 19, 16, 5, '#1D5860'); R(8, 19, 16, 1, '#58B6C0');
    P(15, 14, '#88DDE4'); P(16, 15, '#143C42');
    R(8, 25, 3, 3, '#4A301E'); R(21, 25, 3, 3, '#4A301E');
  };

  T[TL.SUBWOOFER] = function (open, A, B, floorTile) {
    /* 54: folded-horn club bass bin with W-horn baffle, handles & status LED */
    drawUnderlay(open, A, B, floorTile);
    R(2, 29, 28, 3, 'rgba(0,0,0,0.42)');
    R(2, 2, 28, 28, '#14141B'); bevel(2, 2, 28, 28, '#2C2C3A', '#060609', 2);
    /* steel corner plates */
    [[2, 2], [27, 2], [2, 27], [27, 27]].forEach(function (c) { R(c[0], c[1], 3, 3, '#3E3E4E'); P(c[0], c[1], '#7A7A8E'); });
    /* folded horn mouth */
    R(6, 7, 20, 18, '#07070B'); bevel(6, 7, 20, 18, '#22222E', '#040406', 1);
    R(8, 9, 16, 14, '#0D0D14');
    /* central horn phase wedge */
    R(12, 11, 8, 10, '#1D1D28'); bevel(12, 11, 8, 10, '#363646', '#07070A', 1);
    R(14, 13, 4, 6, '#282836');
    /* side carry handles + power LED */
    R(3, 13, 2, 6, '#07070B'); R(27, 13, 2, 6, '#07070B');
    P(25, 4, A); P(24, 4, N.grn);
  };

  T[TL.RADIATOR] = function (open, A, B, floorTile) {
    /* 55: cast-iron ribbed radiator with brass valve & wall brackets */
    drawUnderlay(open, A, B, floorTile);
    R(3, 26, 26, 4, 'rgba(0,0,0,0.4)');
    /* top & bottom manifolds */
    R(4, 8, 22, 2, '#9CA2AC'); R(4, 23, 22, 2, '#626872');
    /* 7 cast-iron vertical ribs */
    for (let x = 4; x <= 22; x += 3) {
      R(x, 6, 2, 20, '#8A909B'); R(x, 6, 1, 20, '#C6CCD6'); R(x + 2, 7, 1, 18, '#3E434B');
      P(x, 6, '#EAEFF6');
    }
    /* feet & brass thermostatic valve */
    R(6, 26, 2, 3, '#4A4F58'); R(22, 26, 2, 3, '#4A4F58');
    R(25, 10, 4, 3, '#D49E3C'); R(27, 8, 2, 3, '#F4D478');
  };

  T[TL.HBATH] = function (open, A, B, floorTile) {
    /* 56: porcelain alcove bathtub with dark outline, seamless aqua bathwater, brass faucet + clean shower curtain */
    drawUnderlay(open, A, B, floorTile || TL.HTILE);
    const hasW = same(-1, 0), hasE = same(1, 0), hasN = same(0, -1), hasS = same(0, 1);
    const solo = !hasW && !hasE && !hasN && !hasS;
    const x0 = hasW ? 0 : 2, x1 = hasE ? 32 : 30, y0 = hasN ? 0 : 3, y1 = hasS ? 32 : 29;
    const w = x1 - x0, h = y1 - y0;
    if (!hasS) R(x0, y1, w, 2, 'rgba(28,26,41,0.22)');
    /* dark outline + thick porcelain rim */
    R(x0, y0, w, h, '#1C1A29');
    const ix0 = x0 + (hasW ? 0 : 1), iy0 = y0 + (hasN ? 0 : 1);
    const ix1 = x1 - (hasE ? 0 : 1), iy1 = y1 - (hasS ? 0 : 1);
    R(ix0, iy0, ix1 - ix0, iy1 - iy0, '#F5F9FA');
    if (!hasN) R(ix0, iy0, ix1 - ix0, 1, '#FFFFFF');
    if (!hasS) R(ix0, iy1 - 2, ix1 - ix0, 2, '#C8D6DC');
    /* recessed aqua bathwater with continuous global horizontal shading (no seam nicks) */
    const wx0 = x0 + (hasW ? 0 : 4), wx1 = x1 - (hasE ? 0 : 4);
    const wy0 = y0 + (hasN ? 0 : 4), wy1 = y1 - (hasS ? 0 : 5);
    const ww = wx1 - wx0, wh = wy1 - wy0;
    R(wx0, wy0, ww, wh, '#4FAFC1');
    R(wx0, wy0, ww, 1, '#2D6C7C');
    R(wx0, wy0 + 1, ww, Math.max(1, Math.floor(wh * 0.4)), '#68CAD9');
    R(wx0, wy1 - Math.max(1, Math.floor(wh * 0.28)), ww, Math.max(1, Math.floor(wh * 0.28)), '#3F98AA');
    /* continuous water shimmer ripples in global pixel space */
    for (let px = wx0; px < wx1 - 1; px++) {
      const gx = TX * TS + px;
      if ((gx & 7) === 3) { P(px, wy0 + 4, '#B8F2FA'); P(px + 1, wy0 + 4, '#B8F2FA'); }
      if ((gx & 7) === 6) { P(px, wy0 + 9, '#9CE4F0'); P(px + 1, wy0 + 9, '#FFFFFF'); }
    }
    /* drain & brass faucet + wall showerhead on head end (!hasW) */
    if (!hasW) {
      R(wx0 + 2, Math.floor((wy0 + wy1) / 2), 2, 2, '#1C1A29');
      R(x0 + 2, 10, 4, 4, '#1C1A29'); R(x0 + 3, 11, 3, 2, '#E4B44C'); P(x0 + 3, 11, '#FFF2B2');
      R(x0 + 2, 1, 3, 7, '#1C1A29'); R(x0 + 3, 2, 1, 5, '#D8A842'); R(x0 + 4, 4, 3, 2, '#FFF2B2');
    }
    /* partially drawn patterned linen shower curtain cleanly tucked inside foot rim (!hasE) */
    if (!hasE || solo) {
      const cx = x1 - 7;
      R(cx, y0, 7, h, '#1C1A29');
      R(cx + 1, y0 + 1, 5, h - 2, '#E8DDD0');
      R(cx + 2, y0 + 1, 1, h - 2, '#C86D51'); R(cx + 4, y0 + 1, 1, h - 2, '#C86D51');
      R(cx + 1, y0 + 1, 5, 1, '#FFFFFF');
    }
  };

  T[TL.TOILET] = function (open, A, B, floorTile) {
    /* 57: unmistakable dark-club porcelain stall toilet with dark outline, cistern, open seat & TP roll */
    drawUnderlay(open, A, B, floorTile || TL.TILE);
    R(10, 26, 12, 4, 'rgba(2,2,8,0.45)');
    /* wall-mounted brushed steel toilet paper dispenser */
    R(2, 10, 5, 8, '#07060D'); R(3, 11, 3, 6, '#DCE4E8'); R(3, 13, 3, 3, '#F6FAFC');
    /* porcelain cistern with dark outline + chrome flush */
    R(7, 1, 18, 10, '#07060D');
    R(8, 2, 16, 8, '#DCE6EA'); R(8, 2, 16, 2, '#FFFFFF'); R(8, 9, 16, 1, '#8FA2AA');
    R(14, 4, 4, 2, '#788890'); P(15, 4, '#FFFFFF');
    /* porcelain seat ring + dark recessed bowl water shimmer */
    R(9, 11, 14, 15, '#07060D'); R(10, 26, 12, 2, '#07060D');
    R(10, 12, 12, 13, '#EFF6F8'); R(10, 24, 12, 2, '#9CB0B8');
    R(12, 14, 8, 8, '#0E2028'); R(13, 15, 6, 6, '#143440');
    P(15, 17, '#19D3FF'); P(16, 18, '#9CE8FF');
  };

  /* th: { a, b, floor, id, at } accent colours, base floor tile, zone id, neighbor accessor. */
  EM.drawTile = function (ctx, t, ox, oy, tx, ty, open, th) {
    th = th || { a: N.mag, b: N.cyn };
    g = ctx; TX = tx; TY = ty;
    CUR_TILE = t === 'DANCE_B' ? TL.DANCE : t;
    ZONE_ID = th.id || '';
    HAS_AT = typeof th.at === 'function';
    AT_FN = th.at || null;
    g.save(); g.translate(ox, oy);
    if (t === 'DANCE_B') T[TL.DANCE](open, th.a, th.b, true);
    else if (T[t]) T[t](open, th.a, th.b, th.floor);
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

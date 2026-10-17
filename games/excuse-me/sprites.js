/* EXCUSE ME — procedural pixel art: people, tiles, icons, mini font.
   Four values only: K #0A0A0A, D #121212, G #7F7F7F, W #FFFFFF. */
'use strict';
(function () {
  const EM = window.EM;
  const C = EM.PAL;

  function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  EM.mkCanvas = mk;

  /* ------------------------------------------------------------ primitives */
  function rect(g, x, y, w, h, a, b) {
    if (!b) { g.fillStyle = C[a]; g.fillRect(x, y, w, h); return; }
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      g.fillStyle = C[((x + i + y + j) & 1) ? b : a];
      g.fillRect(x + i, y + j, 1, 1);
    }
  }
  function px(g, x, y, a) { g.fillStyle = C[a]; g.fillRect(x, y, 1, 1); }
  EM.px = px; EM.rect = rect;

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
    '.': '000000000000010', '>': '100010001010100', '<': '001010100010001', '!': '010010010000010', ' ': '000000000000000'
  };
  EM.textWidth = function (s) { return s.length * 4 - 1; };
  EM.drawText = function (g, s, x, y, col) {
    g.fillStyle = C[col || 'W'];
    for (let n = 0; n < s.length; n++) {
      const gl = FONT[s[n].toUpperCase()];
      if (!gl) continue;
      for (let i = 0; i < 15; i++) if (gl[i] === '1') g.fillRect(x + n * 4 + (i % 3), y + Math.floor(i / 3), 1, 1);
    }
  };

  /* ------------------------------------------------------------ people */
  /* look: { skin 0-3, hair 0-8, hc 0-3, expr 0-5, top 0-10, bottom 0-5, acc 0-9, wide }
     Canvas 12x20 raw, 14x22 with outline. Feet are at the bottom row. */
  EM.LOOK = {
    skin: 4, hair: 9, hc: 4, expr: 6, top: 11, bottom: 6, acc: 8
  };
  const SKIN = [['W'], ['W', 'G'], ['G'], ['G', 'K']];
  const HAIRC = [['K'], ['G'], ['W'], ['W', 'G']];

  function fillS(g, x, y, w, h, skin) { const s = SKIN[skin]; rect(g, x, y, w, h, s[0], s[1]); }

  function drawRaw(look, dir, frame, pose) {
    const c = mk(12, 20); const g = c.getContext('2d');
    const sk = look.skin | 0;
    const eye = sk === 3 ? 'W' : 'K';
    const hc = HAIRC[look.hc | 0];
    const walking = frame === 1 || frame === 2;
    const dance = pose === 'dance';
    const wide = !!look.wide;
    const tx = wide ? 1 : 2, tw = wide ? 10 : 8;

    /* legs */
    const lShort = frame === 1 ? 1 : 0, rShort = frame === 2 ? 1 : 0;
    const bot = look.bottom | 0;
    const legCol = [['G'], ['K'], ['G'], ['W', 'G'], ['G', 'K'], ['K']][bot];
    function leg(x, short) {
      const top = 15, h = 5 - short;
      if (bot === 2) { rect(g, x, top, 3, 2, 'G'); fillS(g, x, top + 2, 3, h - 2, sk); }
      else if (bot === 3) { fillS(g, x, top + 2, 3, h - 2, sk); }
      else rect(g, x, top, 3, h, legCol[0], legCol[1]);
      rect(g, x, 19 - short, 3, 1, 'W');
    }
    leg(2, lShort); leg(7, rShort);
    if (bot === 3 || look.top === 7) rect(g, 1, 15, 10, 2, 'W', 'G');
    if (bot === 5) { px(g, 2, 16, 'W'); px(g, 9, 16, 'W'); }

    /* torso */
    const top = look.top | 0;
    let armCol = null, armSkinFrom = 11;
    if (top === 0) { rect(g, tx, 9, tw, 6, 'W'); armCol = ['W']; armSkinFrom = 11; }
    else if (top === 1) { rect(g, tx, 9, tw, 6, 'K'); px(g, 5, 9, 'W'); px(g, 6, 9, 'W'); armCol = ['K']; }
    else if (top === 2) { for (let j = 0; j < 6; j++) rect(g, tx, 9 + j, tw, 1, j & 1 ? 'K' : 'W'); armCol = ['W']; }
    else if (top === 3) { rect(g, tx, 9, tw, 6, 'G'); rect(g, 4, 13, 4, 1, 'W'); rect(g, 3, 8, 6, 1, 'W'); armCol = ['G']; armSkinFrom = 14; }
    else if (top === 4) { rect(g, tx, 9, tw, 6, 'W', 'K'); armCol = ['W', 'K']; armSkinFrom = 14; }
    else if (top === 5) { fillS(g, tx, 9, tw, 6, sk); px(g, 3, 9, 'K'); px(g, 4, 10, 'K'); px(g, 5, 11, 'K'); px(g, 6, 12, 'K'); px(g, 8, 9, 'K'); px(g, 7, 10, 'K'); px(g, 6, 11, 'K'); px(g, 5, 12, 'K'); rect(g, tx, 14, tw, 1, 'K'); armCol = null; }
    else if (top === 6) { rect(g, tx, 9, tw, 6, 'W', 'G'); armCol = null; }
    else if (top === 7) { rect(g, tx, 9, tw, 6, 'W'); rect(g, 1, 14, 10, 1, 'W'); armCol = null; }
    else if (top === 8) { rect(g, tx, 9, tw, 6, 'K'); rect(g, tx, 12, tw, 1, 'W'); rect(g, tx, 9, 1, 3, 'G'); rect(g, tx + tw - 1, 9, 1, 3, 'G'); armCol = ['K']; armSkinFrom = 14; }
    else if (top === 9) { rect(g, tx, 9, tw, 6, 'K'); rect(g, 5, 9, 1, 6, 'W'); rect(g, tx, 9, tw, 1, 'G'); armCol = ['K']; armSkinFrom = 14; }
    else { rect(g, tx, 9, tw, 6, 'W'); rect(g, 5, 10, 2, 4, 'K'); rect(g, 4, 11, 4, 2, 'K'); armCol = ['W']; armSkinFrom = 11; }

    /* arms */
    let lA = 9, rA = 9, aH = 5;
    if (frame === 1) { lA = 8; rA = 10; } else if (frame === 2) { lA = 10; rA = 8; }
    if (dance) { lA = 5; rA = 5; }
    function arm(x, y) {
      if (armCol) {
        const solid = Math.min(armSkinFrom - 9, aH);
        rect(g, x, y, wide && x === 0 ? 1 : (wide ? 1 : 2), solid, armCol[0], armCol[1]);
        if (solid < aH) fillS(g, x, y + solid, 2, aH - solid, sk);
      } else fillS(g, x, y, wide ? 1 : 2, aH, sk);
    }
    arm(0, lA); arm(wide ? 11 : 10, rA);

    /* head */
    fillS(g, 3, 3, 6, 6, sk);

    /* hair */
    const hs = look.hair | 0;
    function H(x, y, w, h) { rect(g, x, y, w, h, hc[0], hc[1]); }
    if (dir === 'u') {
      if (hs !== 0) { H(3, 2, 6, 7); if (hs === 3 || hs === 7) H(2, 3, 8, 8); if (hs === 4) H(1, 0, 10, 8); if (hs === 5) { fillS(g, 3, 3, 6, 6, sk); H(5, 0, 2, 7); } if (hs === 6) H(5, 0, 2, 2); if (hs === 8) { H(1, 5, 2, 4); H(9, 5, 2, 4); } }
    } else {
      if (hs === 1) { H(3, 3, 6, 1); px(g, 3, 4, hc[0]); px(g, 8, 4, hc[0]); }
      else if (hs === 2) { H(3, 2, 6, 3); H(3, 5, 1, 2); H(8, 5, 1, 2); }
      else if (hs === 3) { H(3, 2, 6, 3); H(2, 3, 1, 8); H(9, 3, 1, 8); H(3, 5, 1, 2); H(8, 5, 1, 2); }
      else if (hs === 4) { H(1, 0, 10, 5); H(2, 5, 2, 3); H(8, 5, 2, 3); }
      else if (hs === 5) { H(5, 0, 2, 4); }
      else if (hs === 6) { H(3, 2, 6, 3); H(5, 0, 2, 2); H(3, 5, 1, 2); H(8, 5, 1, 2); }
      else if (hs === 7) { H(3, 2, 6, 3); H(2, 3, 1, 6); H(9, 3, 1, 6); H(3, 5, 1, 2); H(8, 5, 1, 2); }
      else if (hs === 8) { H(3, 2, 6, 3); H(3, 5, 1, 2); H(8, 5, 1, 2); H(1, 5, 2, 4); H(9, 5, 2, 4); }
    }

    /* face */
    if (dir !== 'u') {
      let e1 = 4, e2 = 7, m0 = 5;
      if (dir === 'l') { e1 = 3; e2 = 5; m0 = 3; } else if (dir === 'r') { e1 = 6; e2 = 8; m0 = 6; }
      const ex = look.expr | 0;
      if (ex === 4) { px(g, e1, 6, eye); px(g, e2, 6, eye); }
      else if (ex === 5) { rect(g, e1, 5, 1, 2, eye); rect(g, e2, 5, 1, 2, eye); }
      else { px(g, e1, 5, eye); px(g, e2, 5, eye); }
      if (ex === 0) rect(g, m0, 7, 2, 1, eye);
      else if (ex === 1) { px(g, m0 - 1, 7, eye); px(g, m0, 8, eye); px(g, m0 + 1, 8, eye); px(g, m0 + 2, 7, eye); }
      else if (ex === 2) { rect(g, m0 - 1, 7, 4, 2, 'K'); rect(g, m0 - 1, 7, 4, 1, 'W'); }
      else if (ex === 3) { px(g, m0, 7, eye); px(g, m0 + 1, 7, eye); px(g, m0 + 2, 6, eye); }
      else if (ex === 4) rect(g, m0, 8, 2, 1, eye);
      else if (ex === 5) rect(g, m0, 7, 2, 2, 'K');
    }

    /* accessories */
    const ac = look.acc | 0;
    if (ac === 1 && dir !== 'u') { rect(g, 3, 5, 6, 1, 'K'); px(g, 4, 5, 'W'); }
    else if (ac === 2) { rect(g, 3, 2, 6, 2, 'W'); if (dir === 'd') rect(g, 2, 4, 8, 1, 'G'); else if (dir === 'l') rect(g, 1, 4, 5, 1, 'G'); else if (dir === 'r') rect(g, 6, 4, 5, 1, 'G'); }
    else if (ac === 3) { rect(g, 3, 3, 6, 1, 'W'); px(g, 9, 4, 'W'); px(g, 10, 5, 'W'); }
    else if (ac === 4) { rect(g, 3, 2, 6, 1, 'K'); rect(g, 2, 3, 1, 4, 'K'); rect(g, 9, 3, 1, 4, 'K'); rect(g, 1, 4, 2, 3, 'G'); rect(g, 9, 4, 2, 3, 'G'); }
    else if (ac === 5) { px(g, 4, 10, 'W'); px(g, 7, 10, 'W'); px(g, 5, 12, 'W'); px(g, 6, 11, 'W'); px(g, 3, 13, 'W'); px(g, 8, 13, 'W'); }
    else if (ac === 6 && dir !== 'u') { const pc = sk >= 2 ? 'W' : 'K'; rect(g, 3, 6, 1, 2, pc); rect(g, 8, 6, 1, 2, pc); }
    else if (ac === 7) { rect(g, 3, 2, 6, 3, 'G'); rect(g, 3, 4, 6, 1, 'W'); }
    else if (ac === 8) { rect(g, 11, 2, 1, 18, 'W'); rect(g, 10, 18, 2, 2, 'G'); }

    return c;
  }

  function outline(raw, col) {
    const w = raw.width, h = raw.height;
    const out = mk(w + 2, h + 2); const g = out.getContext('2d');
    const src = raw.getContext('2d').getImageData(0, 0, w, h).data;
    function on(x, y) { return x >= 0 && y >= 0 && x < w && y < h && src[(y * w + x) * 4 + 3] > 0; }
    g.fillStyle = C[col || 'G'];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (on(x, y)) continue;
      if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) g.fillRect(x + 1, y + 1, 1, 1);
    }
    /* edge pixels of the raw canvas need their outline too */
    for (let y = -1; y <= h; y++) for (let x = -1; x <= w; x++) {
      if (x >= 0 && x < w && y >= 0 && y < h) continue;
      if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) g.fillRect(x + 1, y + 1, 1, 1);
    }
    g.drawImage(raw, 1, 1);
    return out;
  }

  const cache = {};
  /* pose: 'stand' | 'dance' | 'lie' | 'sit'. Returns a canvas (anchor: feet centre bottom). */
  EM.person = function (look, dir, frame, pose) {
    const key = [look.skin, look.hair, look.hc, look.expr, look.top, look.bottom, look.acc, look.wide ? 1 : 0, look.ol || '', dir, frame, pose || ''].join(',');
    let c = cache[key];
    if (c) return c;
    const base = outline(drawRaw(look, dir === 'u' || dir === 'l' || dir === 'r' ? dir : 'd', frame, pose), look.ol);
    if (pose === 'lie') {
      const r = mk(base.height, base.width); const g = r.getContext('2d');
      g.translate(0, base.width); g.rotate(-Math.PI / 2); g.drawImage(base, 0, 0);
      c = r;
    } else if (pose === 'sit') {
      const r = mk(base.width, base.height - 3); const g = r.getContext('2d');
      g.drawImage(base, 0, 0, base.width, base.height - 6, 0, 0, base.width, base.height - 6);
      g.drawImage(base, 0, base.height - 3, base.width, 3, 0, base.height - 6, base.width, 3);
      c = r;
    } else c = base;
    cache[key] = c;
    return c;
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
    cig: ['........', '........', '........', '#########'.slice(0, 8), '########', '........', '........', '........'],
    drink: ['########', '.######.', '..####..', '...##...', '...##...', '...##...', '..####..', '........'],
    cross: ['..####..', '..####..', '########', '########', '########', '########', '..####..', '..####..'],
    shield: ['########', '########', '########', '########', '.######.', '..####..', '...##...', '........'],
    eyes: ['........', '.##..##.', '#..##..#', '#.#..#.#', '#..##..#', '.##..##.', '........', '........'],
    mute: ['..#.....', '.##...#.', '###..#..', '###.#...', '###..#..', '.##...#.', '..#.....', '........'],
    door: ['.######.', '.#....#.', '.#....#.', '.#....#.', '.#...##.', '.#....#.', '.#....#.', '.######.'],
    breath: ['.#....#.', '..#..#..', '...##...', '.######.', '...##...', '..#..#..', '.#....#.', '........'],
    up: ['...##...', '..####..', '.######.', '########', '...##...', '...##...', '...##...', '...##...'],
    star: ['...##...', '...##...', '########', '.######.', '..####..', '.##..##.', '.#....#.', '........']
  };
  const iconCache = {};
  EM.icon = function (name, col) {
    const k = name + (col || 'W');
    if (iconCache[k]) return iconCache[k];
    const rows = ICONS[name] || ICONS.question;
    const c = mk(8, 8); const g = c.getContext('2d');
    g.fillStyle = C[col || 'W'];
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (rows[y][x] === '#') g.fillRect(x, y, 1, 1);
    iconCache[k] = c;
    return c;
  };
  EM.hasIcon = function (n) { return !!ICONS[n]; };

  /* arrows (11x11) for dance prompts */
  const arrowCache = {};
  EM.arrow = function (d, col) {
    const k = d + (col || 'W');
    if (arrowCache[k]) return arrowCache[k];
    const c = mk(11, 11); const g = c.getContext('2d');
    g.fillStyle = C[col || 'W'];
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

  /* ------------------------------------------------------------ tiles */
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

  function specks(g, seed, n, col, tx, ty) {
    for (let i = 0; i < n; i++) {
      const x = Math.floor(EM.hash2(tx * 7 + i, ty * 13 + i, seed) * 16);
      const y = Math.floor(EM.hash2(tx * 11 + i, ty * 5 + i * 3, seed + 9) * 16);
      px(g, x, y, col);
    }
  }

  /* Draw one 16x16 tile at (ox,oy). open(dx,dy) tells whether the neighbour is walkable. */
  EM.drawTile = function (g, t, ox, oy, tx, ty, open) {
    g.save(); g.translate(ox, oy);
    switch (t) {
      case TL.FLOOR: rect(g, 0, 0, 16, 16, 'K'); specks(g, 1, 3, 'D', tx, ty); break;
      case TL.DANCE: rect(g, 0, 0, 16, 16, 'D'); rect(g, 0, 0, 8, 8, 'K'); rect(g, 8, 8, 8, 8, 'K'); px(g, 3, 3, 'G'); px(g, 11, 11, 'G'); break;
      case 'DANCE_B': rect(g, 0, 0, 16, 16, 'D'); rect(g, 8, 0, 8, 8, 'K'); rect(g, 0, 8, 8, 8, 'K'); px(g, 11, 3, 'W'); px(g, 3, 11, 'W'); break;
      case TL.WALL: {
        rect(g, 0, 0, 16, 16, 'D');
        for (let r = 0; r < 4; r++) { rect(g, 0, r * 4 + 3, 16, 1, 'K'); const off = (r & 1) ? 4 : 0; rect(g, off + 4, r * 4, 1, 3, 'K'); rect(g, off + 12, r * 4, 1, 3, 'K'); }
        specks(g, 3, 4, 'G', tx, ty);
        if (open(0, -1)) rect(g, 0, 0, 16, 1, 'W');
        if (open(0, 1)) { rect(g, 0, 15, 16, 1, 'W'); rect(g, 0, 11, 16, 4, 'G'); rect(g, 0, 11, 16, 1, 'W'); }
        if (open(-1, 0)) rect(g, 0, 0, 1, 16, 'W');
        if (open(1, 0)) rect(g, 15, 0, 1, 16, 'W');
        break;
      }
      case TL.BAR: rect(g, 0, 0, 16, 16, 'K'); rect(g, 0, 2, 16, 8, 'W'); rect(g, 0, 10, 16, 6, 'G'); for (let i = 1; i < 16; i += 4) rect(g, i, 11, 1, 5, 'D'); rect(g, 0, 2, 16, 1, 'W'); px(g, 3, 5, 'G'); px(g, 11, 6, 'G'); break;
      case TL.SPEAKER: {
        rect(g, 0, 0, 16, 16, 'D'); rect(g, 0, 0, 16, 1, 'W'); rect(g, 0, 15, 16, 1, 'W'); rect(g, 0, 0, 1, 16, 'W'); rect(g, 15, 0, 1, 16, 'W');
        for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
          const d = Math.hypot(x - 7.5, y - 8.5);
          if (d < 2) px(g, x, y, 'K'); else if (d < 3.5) px(g, x, y, 'G'); else if (d >= 5.5 && d < 6.5) px(g, x, y, 'W');
        }
        break;
      }
      case TL.PILLAR: rect(g, 0, 0, 16, 16, 'K'); rect(g, 2, 0, 12, 16, 'D'); rect(g, 2, 0, 1, 16, 'W'); rect(g, 13, 0, 1, 16, 'G'); rect(g, 2, 0, 12, 2, 'W'); rect(g, 5, 4, 1, 10, 'G'); break;
      case TL.COUCH: rect(g, 0, 0, 16, 16, 'K'); rect(g, 0, 1, 16, 5, 'W'); rect(g, 0, 6, 16, 8, 'G', 'D'); rect(g, 0, 6, 2, 8, 'W'); rect(g, 14, 6, 2, 8, 'W'); rect(g, 0, 14, 16, 1, 'W'); break;
      case TL.TILE: rect(g, 0, 0, 16, 16, 'D'); rect(g, 0, 0, 16, 1, 'G'); rect(g, 0, 0, 1, 16, 'G'); rect(g, 8, 8, 1, 1, 'W'); break;
      case TL.STALL: rect(g, 0, 0, 16, 16, 'D'); rect(g, 0, 0, 16, 2, 'W'); rect(g, 0, 0, 1, 16, 'W'); rect(g, 15, 0, 1, 16, 'W'); for (let i = 3; i < 15; i += 3) rect(g, i, 3, 1, 12, 'K'); rect(g, 12, 8, 2, 2, 'G'); break;
      case TL.SINK: rect(g, 0, 0, 16, 16, 'D'); rect(g, 1, 4, 14, 9, 'W'); rect(g, 3, 6, 10, 5, 'K'); rect(g, 7, 1, 2, 4, 'G'); px(g, 7, 1, 'W'); rect(g, 0, 13, 16, 3, 'G'); break;
      case TL.GRASS: rect(g, 0, 0, 16, 16, 'K'); specks(g, 5, 14, 'G', tx, ty); specks(g, 6, 2, 'W', tx, ty); break;
      case TL.CONC: rect(g, 0, 0, 16, 16, 'D'); specks(g, 7, 8, 'K', tx, ty); specks(g, 8, 4, 'G', tx, ty); break;
      case TL.MATT: rect(g, 0, 0, 16, 16, 'K'); rect(g, 1, 1, 14, 14, 'G', 'W'); rect(g, 1, 1, 14, 4, 'W'); rect(g, 1, 1, 14, 14, 'W', 'G'); rect(g, 1, 1, 14, 4, 'W'); break;
      case TL.LOCKER: rect(g, 0, 0, 16, 16, 'D'); rect(g, 1, 1, 6, 14, 'G'); rect(g, 9, 1, 6, 14, 'G'); rect(g, 6, 7, 1, 3, 'W'); rect(g, 9, 7, 1, 3, 'W'); rect(g, 2, 3, 4, 1, 'D'); rect(g, 10, 3, 4, 1, 'D'); break;
      case TL.TABLE: rect(g, 0, 0, 16, 16, 'K'); rect(g, 1, 3, 14, 9, 'W'); rect(g, 1, 12, 14, 3, 'G'); px(g, 5, 6, 'G'); px(g, 10, 7, 'G'); break;
      case TL.BOOTH: rect(g, 0, 0, 16, 16, 'K'); rect(g, 0, 0, 16, 1, 'G'); for (let i = 0; i < 16; i += 4) rect(g, i, 0, 1, 16, 'D'); break;
      case TL.RUG: rect(g, 0, 0, 16, 16, 'D'); rect(g, 1, 1, 14, 14, 'K'); rect(g, 2, 2, 12, 1, 'G'); rect(g, 2, 13, 12, 1, 'G'); rect(g, 2, 2, 1, 12, 'G'); rect(g, 13, 2, 1, 12, 'G'); break;
      case TL.FENCE: rect(g, 0, 0, 16, 16, 'K'); for (let i = 1; i < 16; i += 5) rect(g, i, 3, 1, 12, 'W'); rect(g, 0, 5, 16, 1, 'G'); rect(g, 0, 10, 16, 1, 'G'); break;
      case TL.STAIRS: for (let i = 0; i < 4; i++) { rect(g, 0, i * 4, 16, 3, i & 1 ? 'G' : 'W'); rect(g, 0, i * 4 + 3, 16, 1, 'K'); } break;
      case TL.BARREL: rect(g, 0, 0, 16, 16, 'K'); rect(g, 2, 5, 12, 10, 'G'); rect(g, 2, 5, 12, 1, 'W'); rect(g, 2, 9, 12, 1, 'D'); px(g, 6, 3, 'W'); px(g, 8, 2, 'W'); px(g, 9, 4, 'W'); px(g, 7, 4, 'G'); break;
      case TL.PLANT: rect(g, 0, 0, 16, 16, 'K'); rect(g, 5, 10, 6, 6, 'G'); for (let i = 0; i < 6; i++) { px(g, 8 + (i % 2 ? 2 : -2) * (i / 3 | 0 || 1), 9 - i, 'W'); px(g, 8, 9 - i, 'G'); } rect(g, 3, 4, 3, 1, 'W'); rect(g, 10, 5, 3, 1, 'W'); break;
      case TL.DOORF: rect(g, 0, 0, 16, 16, 'K'); rect(g, 0, 0, 16, 2, 'W'); rect(g, 2, 6, 12, 1, 'G'); rect(g, 2, 10, 12, 1, 'G'); rect(g, 2, 14, 12, 1, 'G'); break;
      case TL.BENCH: rect(g, 0, 0, 16, 16, 'K'); rect(g, 0, 5, 16, 4, 'W'); rect(g, 0, 9, 16, 2, 'G'); rect(g, 1, 11, 2, 4, 'G'); rect(g, 13, 11, 2, 4, 'G'); break;
      case TL.ROAD: rect(g, 0, 0, 16, 16, 'K'); rect(g, 2, 7, 5, 2, 'G'); rect(g, 10, 7, 5, 2, 'G'); break;
      case TL.SIDEWALK: rect(g, 0, 0, 16, 16, 'D'); rect(g, 0, 0, 16, 1, 'G'); rect(g, 0, 0, 1, 16, 'G'); specks(g, 4, 3, 'K', tx, ty); break;
      case TL.CURTAIN: rect(g, 0, 0, 16, 16, 'D'); for (let i = 0; i < 16; i += 4) { rect(g, i, 1, 2, 15, 'G'); rect(g, i + 2, 1, 2, 15, 'K'); } rect(g, 0, 0, 16, 2, 'W'); break;
      case TL.MIRROR: rect(g, 0, 0, 16, 16, 'D'); rect(g, 1, 1, 14, 11, 'W'); rect(g, 2, 2, 12, 9, 'G'); for (let i = 0; i < 6; i++) px(g, 3 + i * 2, 9 - i, 'W'); rect(g, 0, 12, 16, 4, 'D'); rect(g, 0, 15, 16, 1, 'W'); break;
      case TL.RAIL: rect(g, 0, 0, 16, 16, 'K'); rect(g, 0, 6, 16, 2, 'W'); for (let i = 1; i < 16; i += 5) rect(g, i, 8, 1, 8, 'G'); break;
      case TL.CRATE: rect(g, 0, 0, 16, 16, 'K'); rect(g, 1, 2, 14, 13, 'G'); rect(g, 1, 2, 14, 1, 'W'); rect(g, 1, 8, 14, 1, 'D'); rect(g, 7, 2, 1, 13, 'D'); break;
      case TL.SKY: rect(g, 0, 0, 16, 16, 'K'); specks(g, 11, 2, 'G', tx, ty); if (EM.hash2(tx, ty, 3) > 0.7) px(g, 4, 4, 'W'); break;
      default: rect(g, 0, 0, 16, 16, 'K');
    }
    g.restore();
  };

  /* little world props drawn on top of tiles */
  EM.drawDoorMark = function (g, x, y, w, h) {
    g.fillStyle = C.W;
    g.fillRect(x, y + h - 2, w, 1);
  };
})();

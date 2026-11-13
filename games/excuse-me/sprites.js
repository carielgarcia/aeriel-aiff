/* EXCUSE ME — small sprites & 16-bit world objects: neon palette, mini font, 8x8 icons, dance arrows, and 16x16 (32x32 at RS=2)
   object sprites (EM.objSprite(kind)). Icons/arrows use Scale2x + finish; world objects use EM.Surf shaded pixel art + dark outline.
   People are in people*.js and tiles in tiles.js; colour helpers and Surf are in gfx.js. */
'use strict';
(function () {
  const EM = window.EM, RS = EM.RS;

  function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  EM.mkCanvas = mk;
  const NAMED = { K: '#0A0A0A', D: '#121212', G: '#7F7F7F', W: '#FFFFFF' };
  function col(c) { return NAMED[c] || c; }

  /* the palette: neon accents on a black world */
  const N = EM.NEON = { mag: '#FF2D95', cyn: '#19D3FF', lim: '#B6FF3B', amb: '#FFB020', vio: '#8A5CFF', red: '#FF3B30', org: '#FF6A00', blu: '#2F6BFF', teal: '#00C2A8', grn: '#2ED36A', pnk: '#FF7AB8', yel: '#FFD23F' };

  /* draw a small sprite image at logical x, y. HD sprites carry lw/lh (logical size) and ox/oy (the outline margin). */
  EM.blit = function (g, img, x, y) { g.drawImage(img, x - (img.ox || 0), y - (img.oy || 0), img.lw || img.width, img.lh || img.height); };

  /* light the scaled sprite: a lighter edge on the top and left, a darker one on the bottom and right, then a dark outline */
  function finish(c16) {
    const w = c16.width, h = c16.height, g = c16.getContext('2d');
    const im = g.getImageData(0, 0, w, h), d = im.data, o = new Uint8ClampedArray(d);
    const on = function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0; };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!on(x, y)) continue;
      const i = (y * w + x) * 4;
      if (!on(x - 1, y) || !on(x, y - 1)) { o[i] = Math.min(255, d[i] + (255 - d[i]) * 0.42); o[i + 1] = Math.min(255, d[i + 1] + (255 - d[i + 1]) * 0.40); o[i + 2] = Math.min(255, d[i + 2] + (255 - d[i + 2]) * 0.30); }
      else if (!on(x + 1, y) || !on(x, y + 1)) { o[i] = d[i] * 0.62; o[i + 1] = d[i + 1] * 0.60; o[i + 2] = Math.min(255, d[i + 2] * 0.66 + 10); }
    }
    im.data.set(o); g.putImageData(im, 0, 0);
    const out = mk(w + 2, h + 2), og = out.getContext('2d'); og.imageSmoothingEnabled = false;
    og.fillStyle = '#07060D';
    for (let y = -1; y <= h; y++) for (let x = -1; x <= w; x++) { if (on(x, y)) continue; if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) og.fillRect(x + 1, y + 1, 1, 1); }
    og.drawImage(c16, 1, 1);
    out.lw = (w + 2) / RS; out.lh = (h + 2) / RS; out.ox = 1 / RS; out.oy = 1 / RS;
    return out;
  }

  /* add a crisp 1px #07060D silhouette outline around a Surf without altering its internal shading */
  function outlineSurf(surf) {
    const w = surf.w, h = surf.h, sg = surf.g;
    const im = sg.getImageData(0, 0, w, h), d = im.data;
    const on = function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0; };
    const out = mk(w + 2, h + 2), og = out.getContext('2d');
    og.imageSmoothingEnabled = false;
    og.fillStyle = '#07060D';
    for (let y = -1; y <= h; y++) for (let x = -1; x <= w; x++) {
      if (on(x, y)) continue;
      if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) og.fillRect(x + 1, y + 1, 1, 1);
    }
    og.drawImage(surf.c, 1, 1);
    out.lw = (w + 2) / RS; out.lh = (h + 2) / RS; out.ox = 0; out.oy = 0;
    return out;
  }

  /* ------------------------------------------------------------ mini font 3x5, drawn smooth (Scale2x) */
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
    '←': '010110111110010', '→': '010011111011010', '↑': '010111010010010', '↓': '010010010111010',
    'Ñ': '110101101101101', '.': '000000000000010', '>': '100010001010100', '<': '001010100010001', '!': '010010010000010', ' ': '000000000000000'
  };
  EM.textWidth = function (s) { return s.length * 4 - 1; };
  const textCache = {};
  function textImage(s, colr) {
    const key = s + '|' + colr;
    if (textCache[key]) return textCache[key];
    const w = Math.max(1, EM.textWidth(s)), c = mk(w, 8), g = c.getContext('2d');
    g.fillStyle = col(colr || 'W');
    for (let n = 0; n < s.length; n++) {
      const gl = FONT[s[n].toUpperCase()]; if (!gl) continue;
      if (s[n].toUpperCase() === 'Ñ') { g.fillRect(n * 4, 1, 1, 1); g.fillRect(n * 4 + 1, 0, 1, 1); g.fillRect(n * 4 + 2, 1, 1, 1); }
      for (let i = 0; i < 15; i++) if (gl[i] === '1') g.fillRect(n * 4 + (i % 3), 2 + Math.floor(i / 3), 1, 1);
    }
    const big = EM.scale2x(c); big.lw = w; big.lh = 8;
    return (textCache[key] = big);
  }
  EM.drawText = function (g, s, x, y, colr) {
    const sc = g.getTransform ? g.getTransform().a : 1;
    if (sc >= RS) { const t = textImage(s, colr); g.drawImage(t, x, y - 2, t.lw, t.lh); return; }
    g.fillStyle = col(colr || 'W');
    for (let n = 0; n < s.length; n++) {
      const gl = FONT[s[n].toUpperCase()]; if (!gl) continue;
      if (s[n].toUpperCase() === 'Ñ') { g.fillRect(x + n * 4, y - 1, 1, 1); g.fillRect(x + n * 4 + 1, y - 2, 1, 1); g.fillRect(x + n * 4 + 2, y - 1, 1, 1); }
      for (let i = 0; i < 15; i++) if (gl[i] === '1') g.fillRect(x + n * 4 + (i % 3), y + Math.floor(i / 3), 1, 1);
    }
  };

  /* ------------------------------------------------------------ icons: 8x8 grids, smooth and outlined */
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
  const ICON_COLOR = { heart: N.mag, hug: N.mag, water: N.cyn, spark: N.yel, note: N.mag, exclam: N.yel, question: N.cyn, skull: '#EDEDED', zzz: N.vio, eyes: N.cyn, cross: N.red, pill: N.lim, sweat: N.cyn, drink: N.amb, door: N.lim, star: N.yel, breath: N.cyn, anger: N.red };
  const iconCache = {};
  EM.icon = function (name, colr) {
    const k = name + (colr || '');
    if (iconCache[k]) return iconCache[k];
    const rows = ICONS[name] || ICONS.question;
    const c = mk(8, 8), g = c.getContext('2d');
    g.fillStyle = col(colr && colr !== 'W' ? colr : (ICON_COLOR[name] || '#FFFFFF'));
    if (colr === 'G') g.fillStyle = '#7F7F7F';
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (rows[y][x] === '#') g.fillRect(x, y, 1, 1);
    return (iconCache[k] = finish(EM.scale2x(c)));
  };
  EM.hasIcon = function (n) { return !!ICONS[n]; };
  EM.iconCanvas = function (name, colr) { const s = EM.icon(name, colr), c = mk(s.width, s.height); c.getContext('2d').drawImage(s, 0, 0); return c; };

  /* ------------------------------------------------------------ dance arrows (11x11 grids), one colour per direction */
  const arrowCache = {};
  const ARROW_COLOR = { L: N.mag, R: N.cyn, U: N.lim, D: N.amb };
  EM.arrow = function (d, colr) {
    const k = d + (colr || 'W');
    if (arrowCache[k]) return arrowCache[k];
    const c = mk(11, 11), g = c.getContext('2d');
    g.fillStyle = colr === 'G' ? '#6A6A75' : (colr === 'D' ? '#2A2A33' : ARROW_COLOR[d]);
    const rows = ['.....#.....', '....###....', '...#####...', '..#######..', '.....#.....', '.....#.....', '.....#.....', '.....#.....', '...........', '...........', '...........'];
    for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) {
      if (rows[y][x] !== '#') continue;
      let X = x, Y = y;
      if (d === 'D') Y = 10 - y; else if (d === 'L') { X = y; Y = x; } else if (d === 'R') { X = 10 - y; Y = x; }
      g.fillRect(X, Y, 1, 1);
    }
    return (arrowCache[k] = finish(EM.scale2x(c)));
  };
  EM.arrowColor = function (d) { return ARROW_COLOR[d]; };

  /* ------------------------------------------------------------ 16-bit world object sprites (30x30 Surf -> 32x32 outlined = 16x16 logical) */
  const ramp = EM.ramp, shade = EM.shade;
  const OBJ_DRAW = {
    water: function (S) {
      /* chilled water pitcher + cup */
      const glass = ramp(N.cyn), steel = ramp('#DCE8EE');
      S.rectS(11, 4, 6, 3, steel);
      S.rectS(8, 7, 12, 18, glass, { round: 1 });
      S.rect(10, 10, 8, 12, '#6FE4FF'); S.rect(10, 10, 8, 2, '#D8FAFF');
      S.rect(10, 12, 2, 10, '#FFFFFF');
      S.rectS(21, 17, 5, 8, glass); S.rect(22, 19, 3, 2, '#D8FAFF');
    },
    DJ: function (S) {
      /* compact rotary controller / portable deck */
      const chassis = ramp('#2A2B36');
      S.rectS(2, 7, 26, 17, chassis, { round: 1 });
      S.ellS(8, 15, 4.5, 4.5, ramp('#14141C')); S.px(8, 15, N.mag); S.px(10, 13, '#FFFFFF');
      S.ellS(22, 15, 4.5, 4.5, ramp('#14141C')); S.px(22, 15, N.cyn); S.px(24, 13, '#FFFFFF');
      S.rect(13, 10, 4, 11, '#121218');
      S.px(14, 12, N.grn); S.px(14, 14, N.amb); S.px(14, 16, N.red);
      S.rect(13, 19, 4, 1, '#FFFFFF');
    },
    poster: function (S) {
      /* wheatpasted club flyer with masking tape */
      const paper = ramp('#EFE8D8');
      S.rectS(6, 3, 18, 23, paper);
      S.rect(8, 6, 14, 6, N.mag); S.rect(9, 7, 6, 4, N.cyn);
      S.rect(8, 14, 12, 2, '#1A1A24'); S.rect(8, 18, 14, 2, '#1A1A24'); S.rect(8, 22, 9, 2, N.amb);
      S.rect(12, 2, 6, 2, '#E8D08A'); S.rect(12, 25, 6, 2, '#E8D08A');
    },
    phone: function (S) {
      /* lit smartphone screen */
      const body = ramp('#252734');
      S.rectS(9, 4, 12, 22, body, { round: 1 });
      S.rect(11, 6, 8, 16, '#143A52'); S.rect(11, 6, 8, 5, N.cyn);
      S.rect(12, 13, 6, 2, '#FFFFFF'); S.rect(12, 17, 4, 2, N.mag);
      S.px(15, 24, '#7A8094');
    },
    photo: function (S) {
      /* instant Polaroid print */
      const card = ramp('#F4EFE4');
      S.rectS(5, 4, 20, 22, card);
      S.rect(7, 6, 16, 13, '#19142B');
      S.ellS(15, 12, 4, 4, ramp(N.mag));
      S.rect(8, 15, 14, 4, N.amb); S.px(10, 8, '#FFFFFF');
    },
    vend: function (S) {
      /* illuminated beverage vending unit */
      const cab = ramp('#2A4A5A');
      S.rectS(5, 2, 20, 26, cab, { round: 1 });
      S.rect(7, 4, 12, 14, '#7CE8FF');
      [8, 13].forEach(function (y) {
        S.rect(8, y, 3, 3, N.mag); S.rect(12, y, 3, 3, N.lim); S.rect(16, y, 2, 3, N.amb);
      });
      S.rect(20, 6, 3, 8, '#16242C'); S.px(21, 8, N.red); S.px(21, 11, N.grn);
      S.rect(7, 21, 16, 4, '#0D1418');
    },
    mirror: function (S) {
      /* framed vanity mirror with glass reflection */
      const frame = ramp('#7C5A3A');
      S.rectS(5, 3, 20, 24, frame, { round: 1 });
      S.rect(7, 5, 16, 20, '#5A90A2');
      S.rect(7, 5, 16, 7, '#A6DCEB');
      S.line(9, 19, 19, 9, '#FFFFFF'); S.line(13, 21, 20, 14, '#E8FAFF');
    },
    note: function (S) {
      /* clipboard / handwritten guestlist note */
      const paper = ramp('#FAF0D2');
      S.rectS(6, 5, 18, 21, paper);
      S.rectS(11, 3, 8, 3, ramp('#C99A48'));
      [10, 14, 18, 22].forEach(function (y, i) { S.rect(9, y, 12 - (i % 2) * 3, 1, '#3A3446'); });
      S.px(19, 21, N.mag); S.px(20, 22, N.mag);
    },
    smoke: function (S) {
      /* cigarette pack + lit cig with rising smoke */
      const pack = ramp('#D84A38');
      S.rectS(6, 11, 12, 15, pack); S.rect(6, 11, 12, 5, '#F5F2EA');
      S.rect(14, 19, 11, 3, '#F4F4F6'); S.rect(14, 19, 3, 3, '#D8964A');
      S.rect(24, 19, 2, 3, N.org); S.px(25, 20, N.yel);
      S.px(25, 15, '#B8BCC8'); S.px(26, 12, '#9AA0AE'); S.px(24, 9, '#7A808E');
    },
    stash: function (S) {
      /* zip pouch & metallic mint tin */
      const tin = ramp('#8FA4B2');
      S.rectS(5, 10, 14, 14, tin, { round: 1 });
      S.rect(7, 13, 10, 4, N.lim);
      const bag = ramp('#C8E4EE');
      S.rectS(15, 7, 11, 14, bag);
      S.rect(16, 9, 9, 1, N.mag); S.rect(17, 14, 7, 5, '#EFEFEF');
    },
    test: function (S) {
      /* reagent testing kit: dropper bottle + spot plate */
      const amb = ramp('#C87828'), plate = ramp('#F4F6F8');
      S.rectS(5, 7, 9, 17, amb, { round: 1 }); S.rect(7, 4, 5, 3, '#22242C'); S.rect(7, 13, 5, 6, '#FFFFFF');
      S.rectS(14, 14, 12, 12, plate, { round: 1 });
      S.px(17, 18, N.vio); S.px(18, 18, N.vio);
      S.px(22, 18, N.cyn); S.px(23, 18, N.cyn);
      S.px(17, 22, N.lim); S.px(22, 22, N.mag);
    },
    lamp: function (S) {
      /* warm table lamp with glowing amber shade */
      const brass = ramp('#C89844'), shadeR = ramp('#FFC44D');
      S.rectS(13, 16, 4, 9, brass); S.rectS(9, 24, 12, 3, brass, { round: 1 });
      for (let y = 5; y < 17; y++) {
        const half = 4 + Math.floor((y - 5) * 0.6);
        S.rect(15 - half, y, half * 2, 1, y < 8 ? shadeR.h2 : y < 13 ? shadeR.h : shadeR.b);
      }
      S.rect(9, 16, 12, 2, '#FFF2B8');
    },
    rack: function (S) {
      /* rolling garment stand with hanging jackets */
      const steel = ramp('#A4AAB8');
      S.rect(4, 25, 22, 2, steel.b); S.rect(5, 5, 20, 2, steel.h2);
      S.rect(5, 5, 2, 20, steel.b); S.rect(23, 5, 2, 20, steel.b);
      S.rectS(8, 8, 6, 14, ramp('#C84C3C'));
      S.rectS(16, 8, 6, 15, ramp('#3E648E'));
    },
    records: function (S) {
      /* open LP record crate */
      const oak = ramp('#9A6A3E');
      S.rectS(4, 12, 22, 14, oak);
      [6, 9, 12, 15, 18, 21].forEach(function (x, i) {
        const cs = [N.mag, N.cyn, N.amb, '#F0E8D8', N.vio, N.grn];
        S.rect(x, 6 + (i % 2), 2, 8, cs[i]);
      });
      S.rect(6, 15, 18, 3, '#6B4624');
    },
    kettle: function (S) {
      /* stovetop gooseneck kettle with steam */
      const cop = ramp('#C8784A');
      S.ellS(15, 19, 8, 7, cop);
      S.rect(11, 11, 8, 3, '#2B2D36'); S.rect(13, 9, 4, 2, '#2B2D36');
      S.line(22, 19, 26, 12, '#D8A27A'); S.line(7, 14, 7, 21, '#1E2028');
      S.px(26, 8, '#FFFFFF'); S.px(25, 5, '#D8E2EC');
    },
    shoes: function (S) {
      /* pair of sneakers neatly left by the door */
      const snk = ramp('#EAEAF2');
      S.rectS(5, 12, 8, 12, snk, { round: 1 }); S.rect(5, 22, 8, 2, N.mag); S.rect(7, 14, 4, 2, '#FFFFFF');
      S.rectS(16, 11, 8, 12, snk, { round: 1 }); S.rect(16, 21, 8, 2, N.cyn); S.rect(18, 13, 4, 2, '#FFFFFF');
    },
    dishes: function (S) {
      /* stacked ceramic plates & mugs */
      const cer = ramp('#EEF2F4');
      S.ellS(11, 21, 7, 4, cer); S.ellS(11, 17, 7, 4, cer);
      S.rectS(19, 14, 6, 9, ramp('#E8A44A')); S.rect(25, 16, 2, 4, '#E8A44A');
      S.rect(20, 14, 4, 2, '#5E381E');
    },
    ashtray: function (S) {
      /* heavy glass ashtray + ember */
      const gl = ramp('#6A8A9A');
      S.ellS(15, 18, 9, 6, gl);
      S.rect(10, 16, 10, 4, '#2A363E');
      S.rect(14, 15, 10, 2, '#F4F4F6'); S.px(24, 15, N.org); S.px(25, 12, '#B0B4C0');
    },
    /* --- 6 NEW OBJECT SPRITE KINDS --- */
    vinyl_crate: function (S) {
      /* slotted wooden milk/vinyl crate stuffed with 12-inch sleeves */
      const woodR = ramp('#8A5A34');
      S.rectS(3, 12, 24, 15, woodR);
      [5, 8, 11, 14, 17, 20, 23].forEach(function (x, i) {
        const cs = [N.mag, '#F4EFE4', N.cyn, N.amb, N.vio, N.grn, '#E05848'];
        S.rect(x, 5 + (i % 3), 2, 9, cs[i]); P(S, x, 5 + (i % 3));
      });
      S.rect(5, 16, 20, 2, '#4A2C16'); S.rect(5, 21, 20, 2, '#4A2C16');
      S.rect(11, 13, 8, 2, '#2A180C');
    },
    synth_rack: function (S) {
      /* 19" studio synth / drum machine rack with patch cables & step LEDs */
      const rackR = ramp('#2A2C38');
      S.rectS(3, 6, 24, 20, rackR, { round: 1 });
      S.rect(5, 8, 20, 6, '#14151C');
      [6, 9, 12, 15, 18, 21].forEach(function (x, i) { S.px(x, 10, i % 2 ? N.cyn : N.mag); S.px(x, 12, '#8A90A0'); });
      S.rect(5, 16, 20, 7, '#181922');
      [6, 8, 10, 12, 14, 16, 18, 20].forEach(function (x, i) { S.px(x, 18, i < 4 ? N.amb : N.lim); });
      S.line(7, 22, 15, 24, N.red); S.line(18, 22, 22, 24, N.cyn);
    },
    espresso: function (S) {
      /* brushed chrome espresso machine + steaming cup */
      const ch = ramp('#B8C2CC');
      S.rectS(4, 5, 16, 21, ch, { round: 1 });
      S.rect(6, 7, 12, 5, '#2A3038'); S.px(8, 9, N.red); S.px(11, 9, N.grn);
      S.rect(8, 14, 8, 2, '#1A1E24'); S.rect(16, 14, 4, 2, '#1A1E24');
      S.rect(6, 22, 12, 3, '#4A525C');
      S.rectS(9, 17, 6, 5, ramp('#F5EFE4')); S.rect(10, 17, 4, 1, '#7A4624');
      S.rectS(22, 19, 5, 6, ramp('#E8B46A')); S.px(24, 16, '#FFFFFF');
    },
    candle_table: function (S) {
      /* low walnut side table + pillar candle + glowing flame */
      const wal = ramp('#7C5230'), wax = ramp('#F4EAD4');
      S.rectS(6, 15, 18, 5, wal, { round: 1 });
      S.rect(8, 20, 2, 7, '#4A2E1A'); S.rect(20, 20, 2, 7, '#4A2E1A');
      S.rectS(13, 8, 4, 8, wax);
      S.px(14, 5, N.yel); S.px(15, 5, N.yel); S.px(14, 4, '#FFFFFF'); S.px(15, 6, N.org);
    },
    coat_stand: function (S) {
      /* standing brass/wood coat tree with scarf & jacket */
      const woodR = ramp('#7A502E');
      S.rectS(14, 5, 2, 21, woodR);
      S.rect(9, 25, 12, 2, '#5A381E'); S.rect(11, 6, 8, 2, '#D8A84E');
      S.rectS(8, 8, 6, 12, ramp('#3E648E'));
      S.rectS(16, 8, 5, 10, ramp('#C85A4A'));
    },
    lava_lamp: function (S) {
      /* retro chrome-base lava lamp with glowing magenta/orange wax blobs */
      const chr = ramp('#9BA4B0');
      S.rectS(11, 21, 8, 6, chr); S.rectS(12, 4, 6, 3, chr);
      S.rect(10, 7, 10, 14, '#2A0E30');
      S.ellS(14, 17, 3, 2.5, ramp(N.mag));
      S.ellS(16, 11, 2.5, 2.5, ramp(N.org));
      S.px(13, 16, '#FFFFFF'); S.px(15, 10, '#FFE4A8');
    },
    /* --- helpful game aliases (club & flat) --- */
    cat: function (S) {
      /* sleeping courtyard ginger cat */
      const fur = ramp('#E08A3C');
      S.ellS(15, 19, 7, 5, fur);
      S.ellS(10, 15, 4, 3.5, fur);
      S.px(8, 11, fur.b); S.px(12, 11, fur.b);
      S.px(9, 15, '#141418'); S.px(11, 15, '#141418');
      S.rect(19, 21, 5, 2, fur.s);
    },
    aftoast: function (S) {
      /* plate of buttered toast + teacup */
      S.ellS(12, 19, 8, 5, ramp('#EEF2F4'));
      S.rectS(8, 14, 7, 6, ramp('#D8A25E')); S.rect(10, 16, 3, 2, '#FFE888');
      S.rectS(20, 16, 6, 6, ramp('#5F8A78')); S.px(22, 13, '#FFFFFF');
    },
    afbasket: function (S) {
      /* woven basket of silenced phones */
      S.rectS(6, 13, 18, 12, ramp('#B8844A'), { round: 1 });
      S.rect(9, 8, 5, 7, '#2A2C38'); S.rect(10, 9, 3, 4, N.cyn);
      S.rect(16, 9, 5, 7, '#2A2C38'); S.rect(17, 10, 3, 4, N.mag);
      S.rect(6, 16, 18, 2, '#7A522A');
    },
    afbowl: function (S) {
      /* ceramic bowl by the door with condoms & tissues */
      S.ellS(15, 19, 9, 6, ramp('#F2ECE0'));
      S.rect(10, 14, 5, 4, N.lim); S.rect(16, 15, 5, 4, N.mag);
      S.px(12, 15, '#FFFFFF'); S.px(18, 16, '#FFFFFF');
    },
    window_dawn: function (S) {
      /* warm apartment dawn window overlooking amber-pink morning sky with mullions & curtains */
      const fr = ramp('#E8DFCE');
      S.rectS(3, 3, 24, 22, fr, { round: 1 });
      /* amber-pink morning sky gradient inside panes */
      S.rect(5, 5, 20, 6, '#8EC0DE'); S.rect(5, 11, 20, 6, '#F4A27E'); S.rect(5, 17, 20, 5, '#FCE0A2');
      S.rect(12, 15, 6, 4, '#FFF6D6');
      /* distant rooftops silhouette */
      S.rect(5, 20, 6, 2, '#6A5468'); S.rect(17, 19, 8, 3, '#584458');
      /* timber window mullions */
      S.rect(14, 5, 2, 17, '#EFE8DA'); S.rect(5, 13, 20, 2, '#EFE8DA');
      /* softly drawn linen curtains on left & right + windowsill */
      S.rectS(4, 4, 4, 19, ramp('#D48066')); S.rectS(22, 4, 4, 19, ramp('#D48066'));
      S.rect(2, 23, 26, 3, '#D8C8B0'); S.rect(2, 23, 26, 1, '#FFFFFF');
    },
    wall_art: function (S) {
      /* framed graphic artwork / poster print */
      const oak = ramp('#7C5230');
      S.rectS(4, 3, 22, 24, oak);
      S.rect(6, 5, 18, 20, '#F6F0E4');
      S.rect(8, 7, 14, 16, '#1E2430');
      S.ellS(15, 13, 4.5, 4.5, ramp('#D95B43'));
      S.rect(9, 18, 12, 3, '#E8B84A');
      S.rect(10, 8, 2, 13, '#5EB8D4');
      S.px(7, 6, '#FFFFFF');
    },
    mop_bucket: function (S) {
      /* industrial club janitor mop & yellow wringer bucket */
      const ylw = ramp('#E8B828'), wd = ramp('#9E7246');
      S.rectS(7, 14, 15, 11, ylw, { round: 1 });
      S.rect(8, 14, 13, 2, '#2A2D36');
      S.rectS(14, 10, 7, 5, ramp('#D0A018'));
      S.rect(9, 25, 2, 2, '#1A1C22'); S.rect(19, 25, 2, 2, '#1A1C22');
      /* angled wooden mop handle + damp cotton mop head */
      for (let i = 0; i < 16; i++) {
        S.rect(19 - Math.floor(i * 0.45), 3 + i, 2, 2, wd.b);
      }
      S.rectS(9, 18, 6, 5, ramp('#D8D4C8'));
      S.px(10, 22, '#9AA8B0'); S.px(13, 22, '#9AA8B0');
    },
    hand_dryer: function (S) {
      /* brushed metal wall hand dryer & folded paper towel unit */
      const stl = ramp('#C8D2DC');
      S.rectS(5, 4, 20, 17, stl, { round: 1 });
      S.rect(6, 5, 18, 2, '#EEF6FA');
      S.rect(8, 9, 14, 3, '#222832'); S.px(20, 10, N.grn);
      S.rect(10, 18, 10, 3, '#1A2028');
      /* crisp folded paper towels hanging from bottom slot */
      S.rectS(9, 21, 12, 6, ramp('#F2F6F8'));
      S.rect(10, 23, 10, 1, '#C8D4DC'); S.px(11, 21, '#FFFFFF');
    },
    first_aid: function (S) {
      /* red-cross harm-reduction medical box + electrolyte packets & earplug case */
      const bx = ramp('#EEF2F4');
      S.rectS(4, 6, 17, 19, bx, { round: 1 });
      S.rect(5, 7, 15, 2, '#FFFFFF');
      S.rect(11, 10, 3, 9, '#E5332A'); S.rect(8, 13, 9, 3, '#E5332A');
      S.rect(10, 5, 5, 2, '#78848E');
      /* electrolyte bottle & earplug tin */
      S.rectS(22, 13, 5, 12, ramp('#3AB8D8')); S.rect(23, 11, 3, 2, '#FFFFFF');
      S.rectS(18, 21, 6, 5, ramp('#F0B83C'));
    },
    tea_urn: function (S) {
      /* warm herbal tea dispenser urn + cup stack + water jug */
      const chr = ramp('#B8C4CE');
      S.rectS(5, 5, 12, 18, chr, { round: 1 });
      S.rect(7, 4, 8, 2, '#2A2E38');
      S.rect(10, 9, 2, 8, '#D87A38');
      S.rect(10, 21, 2, 3, '#1C1E24');
      S.rect(4, 23, 14, 3, '#6A4A2E');
      /* cup stack + translucent water jug */
      S.rectS(19, 15, 5, 10, ramp('#F6EFE2')); S.rect(19, 18, 5, 1, '#C8BBA4'); S.rect(19, 21, 5, 1, '#C8BBA4');
      S.rectS(24, 11, 5, 14, ramp('#66B8E0')); S.rect(25, 9, 3, 2, '#FFFFFF');
    }
  };
  function P(S, x, y) { S.px(x, y, '#FFFFFF'); }
  OBJ_DRAW.afrecords = OBJ_DRAW.records;
  OBJ_DRAW.afdishes = OBJ_DRAW.dishes;

  EM.OBJ_KINDS = [
    'water', 'DJ', 'poster', 'phone', 'photo', 'vend', 'mirror', 'note', 'smoke',
    'stash', 'test', 'lamp', 'rack', 'records', 'kettle', 'shoes', 'dishes', 'ashtray',
    'vinyl_crate', 'synth_rack', 'espresso', 'candle_table', 'coat_stand', 'lava_lamp',
    'window_dawn', 'wall_art', 'mop_bucket', 'hand_dryer', 'first_aid', 'tea_urn'
  ];

  const objCache = {};
  EM.objSprite = function (kind) {
    const k = OBJ_DRAW[kind] ? kind : 'note';
    if (objCache[k]) return objCache[k];
    const s = new EM.Surf(30, 30);
    OBJ_DRAW[k](s);
    return (objCache[k] = outlineSurf(s));
  };
  EM.hasObjSprite = function (kind) { return !!OBJ_DRAW[kind]; };
})();

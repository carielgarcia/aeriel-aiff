/* EXCUSE ME — small sprites, 16-bit: the neon palette, the mini font, the icons and the dance arrows. They are authored on
   small pixel grids and scaled 2x with Scale2x (smooth diagonals), then lit and outlined, so they sit at the render scale.
   People are in people*.js and tiles in tiles.js; colour helpers and the pixel surface are in gfx.js. */
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
  function finish(c16, body) {
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
  /* a copy for the page (toasts, gesture buttons): the same image as a plain canvas */
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
})();

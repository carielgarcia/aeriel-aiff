/* EXCUSE ME — passage tags and the club map.
   1. EM.passage: one tag per doorway (arrow + destination), generated from the door entities so each tag
      sits on its own passage. engine.js draws them into the static zone canvas.
   2. Discovery: EM.state.disc records visited rooms and every door seen (with its last observed state).
      It lives on the state object, so the normal save carries it.
   3. The map overlay (key M, menu button): only what the player has seen, doors open or closed, ??? for
      rooms behind doors that have not been walked through. */
'use strict';
(function () {
  const EM = window.EM, U = EM.ui, E = EM.engine, T = EM.T;
  const TS = 16, TH = 9;

  /* ============================================================ passage tags */
  const SHORT = { restrooms: 'WC', main: 'MAIN', darkroom: 'DARK', backstage: 'STAFF', rooftop: 'ROOF', courtyard: 'SMOKE', tunnel: 'TUNNEL', welfare: 'CALM', foyer: 'FOYER', doors: 'OUT', attic: 'SALA 2' };
  /* hand-placed signs that only named a passage; the generated tags replace them */
  const OLD_SIGN = /^(<\s*)?(DANCE|SALA 2|WC|SMOKING|QUIET ROOM|EXIT|DARK ROOM|STAFF|ROOF|MAIN|DOWN|BALCONY|STAGE)(\s*>)?$/;
  const ASCII = { 'Á': 'A', 'À': 'A', 'Ã': 'A', 'Â': 'A', 'É': 'E', 'Ê': 'E', 'Í': 'I', 'Ó': 'O', 'Õ': 'O', 'Ô': 'O', 'Ú': 'U', 'Ü': 'U', 'Ç': 'C' };
  const plain = function (s) { return s.toUpperCase().replace(/[ÁÀÃÂÉÊÍÓÕÔÚÜÇ]/g, function (c) { return ASCII[c]; }); };

  /* the wall a doorway belongs to: the nearest edge of the zone */
  function side(z, d) {
    const dl = d.x, dr = z.w - (d.x + d.w), dt = d.y, db = z.h - (d.y + d.h);
    const m = Math.min(dl, dr, dt, db);
    return m === dt ? 'u' : (m === db ? 'd' : (m === dl ? 'l' : 'r'));
  }
  const ARROW = { l: '←', r: '→', u: '↑', d: '↓' };
  function label(to, short) {
    if (to === 'street_exit') return plain(EM.tr(T('EXIT', 'SALIDA', 'SAÍDA')));
    const zn = EM.zones[to]; if (!zn) return '';
    return plain(short ? (SHORT[to] || '') : EM.tr(zn.name).split('//')[0].trim());
  }
  function text(sd, name) {
    if (!name) return ARROW[sd];
    return sd === 'l' ? ARROW.l + ' ' + name : (sd === 'r' ? name + ' ' + ARROW.r : ARROW[sd] + ' ' + name);
  }
  const half = function (v) { return Math.round(v * 2) / 2; };
  function place(z, d, sd, str) {
    const w = EM.textWidth(str) + 4, h = TH;
    let x, y;
    if (sd === 'l' || sd === 'r') {
      y = (d.y + d.h / 2) * TS - h / 2;
      x = sd === 'l' ? (d.x + d.w) * TS + 2 : d.x * TS - 2 - w;
    } else {
      x = (d.x + d.w / 2) * TS - w / 2;
      y = sd === 'u' ? (d.y + d.h) * TS + (TS - h) / 2 : d.y * TS - (TS + h) / 2;
    }
    x = Math.max(2, Math.min(z.w * TS - w - 2, x));
    return { text: str, x: half(x), y: half(y), w: w, h: h, side: sd };
  }
  const free = function (z, r) {
    for (let ty = Math.floor(r.y / TS); ty <= Math.floor((r.y + r.h - 0.01) / TS); ty++) for (let tx = Math.floor(r.x / TS); tx <= Math.floor((r.x + r.w - 0.01) / TS); tx++) {
      const t = z.get(tx, ty); if (EM.isSolidTile(t) || t === EM.TL.VOID) return false;
    }
    return true;
  };
  /* tags for a zone: the full name if it fits on the floor beside the doorway, else the short name, else the arrow alone */
  function tags(z) {
    const out = [];
    z.ents.forEach(function (d) {
      if (d.type !== 'door') return;
      const sd = side(z, d);
      const tries = [text(sd, label(d.to, false)), text(sd, label(d.to, true)), text(sd, '')];
      let pick = null;
      for (let i = 0; i < tries.length && !pick; i++) { const p = place(z, d, sd, tries[i]); if (free(z, p)) pick = p; }
      out.push(pick || place(z, d, sd, tries[1]));
    });
    return out;
  }
  EM.passage = { side: side, tags: tags, isSign: function (s) { return OLD_SIGN.test(s); } };

  /* ============================================================ discovery */
  function observe(z) {
    const s = EM.state; if (!s || !z) return;
    const d = disc(s);
    d.rooms[z.id] = 1;
    z.ents.forEach(function (e) {
      if (e.type !== 'door' || !EM.zones[e.to]) return;
      const open = !e.when || !!e.when(s);
      const r = d.doors[e.id];
      if (r) r.open = open ? 1 : 0; else d.doors[e.id] = { from: z.id, to: e.to, open: open ? 1 : 0 };
    });
  }
  function disc(s) {
    if (s.disc && s.disc.rooms && s.disc.doors) return s.disc;
    s.disc = { rooms: {}, doors: {} };
    /* a save from before the map: rebuild what we can from the rooms already visited */
    Object.keys(s.seenZones || {}).forEach(function (id) { if (EM.zones[id]) observe(EM.zones[id]); });
    return s.disc;
  }
  const zoneEntered0 = EM.hooks.zoneEntered;
  EM.hooks.zoneEntered = function (z) { if (zoneEntered0) zoneEntered0.apply(this, arguments); observe(z); };
  /* a door that changes while you are standing in the room (the closing set, a flag) updates the memory */
  setInterval(function () { if (EM.state && (U.mode === 'play' || U.mode === 'dialog') && E.zone()) observe(E.zone()); }, 500);

  /* ============================================================ map layout */
  const POS = {
    rooftop: [2, 0], attic: [0, 1], backstage: [4, 1], darkroom: [0, 2], main: [2, 2], restrooms: [4, 2],
    welfare: [0, 3], foyer: [2, 3], tunnel: [4, 3], doors: [2, 4], courtyard: [4, 4]
  };
  const CW = 170, CH = 100, BW = 142, BH = 48, PAD = 24;
  const at = function (id) {
    let p = POS[id];
    if (!p) { const extra = Object.keys(EM.zones).filter(function (k) { return !POS[k]; }); p = [extra.indexOf(id), 5]; }
    return { x: PAD + BW / 2 + p[0] * CW, y: PAD + BH / 2 + p[1] * CH };
  };

  const S = {
    title: T('CLUB MAP // LA GRIETA', 'MAPA DEL CLUB // LA GRIETA', 'MAPA DO CLUB // LA GRIETA'),
    close: T('CLOSE [ESC / M]', 'CERRAR [ESC / M]', 'FECHAR [ESC / M]'),
    menu: T('MAP [M]', 'MAPA [M]', 'MAPA [M]'), menuT: T('MAP', 'MAPA', 'MAPA'),
    you: T('YOU ARE HERE', 'ESTÁS AQUÍ', 'VOCÊ ESTÁ AQUI'),
    open: T('OPEN PASSAGE', 'PASO ABIERTO', 'PASSAGEM ABERTA'), closed: T('CLOSED / LOCKED', 'CERRADA / CON LLAVE', 'FECHADA / TRANCADA'),
    unk: T('UNEXPLORED', 'SIN EXPLORAR', 'NÃO EXPLORADO'),
    note: T('Only what you have seen is drawn. Doors show the state you last saw.', 'Solo se dibuja lo que has visto. Las puertas muestran el estado de la última vez que las viste.', 'Só o que você viu é desenhado. As portas mostram o estado da última vez que você viu.'),
    aria: T('Club map', 'Mapa del club', 'Mapa do club'),
    sOpen: T('open to', 'abierta a', 'aberta para'), sClosed: T('closed to', 'cerrada a', 'fechada para'), sHere: T('you are here', 'estás aquí', 'você está aqui'),
    unkName: T('an unexplored room', 'una sala sin explorar', 'uma sala não explorada')
  };
  const tr = function (k) { return EM.tr(S[k]); };

  let root = null, body = null;
  function build() {
    if (root) return;
    const stage = document.getElementById('stage'); if (!stage) return;
    root = document.createElement('div'); root.id = 'map'; root.hidden = true;
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true');
    root.innerHTML = '<div class="map-head"><h2 id="map-h"></h2><button type="button" id="map-close"></button></div><div id="map-body"></div><p id="map-note" class="map-note"></p>';
    stage.appendChild(root);
    body = root.querySelector('#map-body');
    root.querySelector('#map-close').addEventListener('click', closeMap);
  }

  /* edges from every door ever seen; an edge is open if any seen door on that pair was open at last look */
  function graph() {
    const d = disc(EM.state), edges = {};
    Object.keys(d.doors).forEach(function (id) {
      const r = d.doors[id], k = [r.from, r.to].sort().join('|');
      const e = edges[k] || (edges[k] = { a: r.from, b: r.to, open: false });
      if (r.open) e.open = true;
    });
    return { d: d, edges: edges };
  }
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = function (name, attrs, txt) { const n = document.createElementNS(NS, name); Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); }); if (txt !== undefined) n.textContent = txt; return n; };

  function render() {
    const s = EM.state, g = graph(), cur = s.zone;
    root.setAttribute('aria-label', tr('aria'));
    root.querySelector('#map-h').textContent = tr('title');
    root.querySelector('#map-close').textContent = tr('close');
    root.querySelector('#map-note').textContent = tr('note');
    const rooms = {};
    Object.keys(g.d.rooms).forEach(function (id) { rooms[id] = 'seen'; });
    Object.keys(g.edges).forEach(function (k) { const e = g.edges[k]; if (!rooms[e.a]) rooms[e.a] = 'stub'; if (!rooms[e.b]) rooms[e.b] = 'stub'; });
    let mx = 0, my = 0;
    Object.keys(rooms).forEach(function (id) { const p = at(id); mx = Math.max(mx, p.x + BW / 2 + PAD); my = Math.max(my, p.y + BH / 2 + PAD); });
    const svg = svgEl('svg', { viewBox: '0 0 ' + mx + ' ' + my, role: 'img', 'aria-label': tr('aria'), class: 'map-svg' });
    const lines = svgEl('g'), boxes = svgEl('g'), marks = svgEl('g');
    svg.appendChild(lines); svg.appendChild(boxes); svg.appendChild(marks);
    const sr = document.createElement('ul'); sr.className = 'map-sr';

    Object.keys(g.edges).forEach(function (k) {
      const e = g.edges[k], a = at(e.a), b = at(e.b), mxp = a.x + (b.x - a.x) * 0.3, myp = a.y + (b.y - a.y) * 0.3; /* marker near the room it was seen from, so crossing edges do not stack markers */
      lines.appendChild(svgEl('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'map-edge ' + (e.open ? 'open' : 'closed') }));
      if (e.open) marks.appendChild(svgEl('rect', { x: mxp - 6, y: myp - 6, width: 12, height: 12, class: 'map-door open' }));
      else {
        marks.appendChild(svgEl('rect', { x: mxp - 8, y: myp - 8, width: 16, height: 16, class: 'map-door closed' }));
        marks.appendChild(svgEl('path', { d: 'M' + (mxp - 4) + ' ' + (myp - 4) + 'L' + (mxp + 4) + ' ' + (myp + 4) + 'M' + (mxp + 4) + ' ' + (myp - 4) + 'L' + (mxp - 4) + ' ' + (myp + 4), class: 'map-x' }));
      }
    });
    Object.keys(rooms).forEach(function (id) {
      const p = at(id), seen = rooms[id] === 'seen', here = id === cur, zn = EM.zones[id];
      const grp = svgEl('g', { class: 'map-room ' + (seen ? 'seen' : 'stub') + (here ? ' here' : '') });
      grp.appendChild(svgEl('rect', { x: p.x - BW / 2, y: p.y - BH / 2, width: BW, height: BH }));
      if (seen) {
        const parts = EM.tr(zn.name).split('//').map(function (x) { return x.trim().toUpperCase(); });
        grp.appendChild(svgEl('text', { x: p.x, y: p.y + (parts[1] ? -4 : 5), 'text-anchor': 'middle', class: 'n1' }, parts[0]));
        if (parts[1]) grp.appendChild(svgEl('text', { x: p.x, y: p.y + 12, 'text-anchor': 'middle', class: 'n2' }, parts[1]));
        if (here) grp.appendChild(svgEl('text', { x: p.x, y: p.y - BH / 2 - 5, 'text-anchor': 'middle', class: 'you' }, '▼ ' + tr('you')));
      } else grp.appendChild(svgEl('text', { x: p.x, y: p.y + 5, 'text-anchor': 'middle', class: 'n1' }, '???'));
      boxes.appendChild(grp);
      /* screen-reader list */
      const li = document.createElement('li');
      const conn = [];
      Object.keys(g.edges).forEach(function (k) {
        const e = g.edges[k]; if (e.a !== id && e.b !== id) return;
        const o = e.a === id ? e.b : e.a;
        conn.push(tr(e.open ? 'sOpen' : 'sClosed') + ' ' + (rooms[o] === 'seen' ? EM.tr(EM.zones[o].name).split('//')[0].trim() : tr('unkName')));
      });
      li.textContent = (seen ? EM.tr(zn.name) : '???') + (here ? ' (' + tr('sHere') + ')' : '') + (conn.length ? ': ' + conn.join(', ') : '');
      sr.appendChild(li);
    });

    const lg = document.createElement('div'); lg.className = 'map-legend';
    [['open', 'open'], ['closed', 'closed'], ['unk', 'stub'], ['you', 'here']].forEach(function (p) {
      const i = document.createElement('span'); i.className = 'lg ' + p[1]; i.textContent = tr(p[0]); lg.appendChild(i);
    });
    body.textContent = '';
    body.appendChild(svg); body.appendChild(lg); body.appendChild(sr);
  }

  /* ============================================================ open / close */
  let prevFocus = null;
  function openMap() {
    if (U.mode !== 'play' || !EM.state || EM.state.ended) return;
    build(); if (!root) return;
    observe(E.zone());
    U.mode = 'map'; E.paused = true; E.input.x = E.input.y = 0; U.keys = {};
    render(); root.hidden = false;
    prevFocus = document.activeElement;
    const c = root.querySelector('#map-close'); if (c && c.focus) c.focus({ preventScroll: true });
  }
  function closeMap() {
    if (U.mode !== 'map') return;
    root.hidden = true; U.mode = 'play'; E.paused = false;
    if (prevFocus && prevFocus.focus && document.body.contains(prevFocus)) prevFocus.focus({ preventScroll: true });
    prevFocus = null;
  }
  U.openMap = openMap; U.closeMap = closeMap;

  const isM = function (e) { return e.code === 'KeyM' || (e.key && e.key.toLowerCase() === 'm'); };
  window.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable)) return;
    if (U.mode === 'map') {
      if (isM(e) || e.code === 'Escape') { e.preventDefault(); if (!e.repeat) closeMap(); }
      else if (e.code === 'Tab') e.preventDefault(); /* the only control is the close button */
    } else if (U.mode === 'play' && isM(e) && !e.repeat) { e.preventDefault(); openMap(); }
  });

  /* menu access for touch and mouse: a MAP button beside the tabs */
  function menuButton() {
    const tabs = document.getElementById('menu-tabs'); if (!tabs) return;
    let b = document.getElementById('menu-map');
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'menu-map';
      b.addEventListener('click', function () { if (U.mode === 'menu') { U.closeMenu(); openMap(); } });
      tabs.insertBefore(b, document.getElementById('menu-close'));
    }
    const touch = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    b.textContent = EM.tr(touch ? S.menuT : S.menu);
  }
  const hud0 = U.hud; U.hud = function () { hud0.apply(this, arguments); menuButton(); };
  const open0 = U.openMenu; U.openMenu = function () { open0.apply(this, arguments); menuButton(); };

  /* ============================================================ style */
  const st = document.createElement('style');
  st.textContent =
    '#map { position: absolute; inset: 0; z-index: 8; background: #08080C; overflow: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }' +
    '#map[hidden] { display: none !important; }' +
    '#map .map-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; border-bottom: 1px solid var(--fg); padding-bottom: 8px; }' +
    '#map h2 { font-size: 14px; }' +
    '#map-body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }' +
    '.map-svg { display: block; width: 100%; flex: 1 1 auto; min-height: 0; }' +
    '.map-edge { stroke-width: 3; } .map-edge.open { stroke: var(--fg); } .map-edge.closed { stroke: var(--red); stroke-dasharray: 6 5; }' +
    '.map-door { stroke-width: 2; } .map-door.open { fill: #08080C; stroke: var(--grn); } .map-door.closed { fill: #08080C; stroke: var(--red); }' +
    '.map-x { stroke: var(--red); stroke-width: 2; fill: none; }' +
    '.map-room rect { fill: var(--panel); stroke: var(--fg); stroke-width: 1; }' +
    '.map-room.stub rect { fill: #08080C; stroke: var(--muted); stroke-dasharray: 5 4; }' +
    '.map-room.here rect { stroke: var(--yel); stroke-width: 3; }' +
    '.map-room text { fill: var(--fg); font-family: var(--font); letter-spacing: 1px; }' +
    '.map-room .n1 { font-size: 12px; font-weight: bold; } .map-room .n2 { font-size: 10px; fill: var(--muted); }' +
    '.map-room.stub text { fill: var(--muted); font-size: 14px; } .map-room .you { fill: var(--yel); font-size: 10px; font-weight: bold; }' +
    '.map-legend { flex: none; display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin-top: 6px; }' +
    '.map-legend .lg::before { content: ""; display: inline-block; width: 14px; height: 0; border-top: 3px solid var(--fg); vertical-align: middle; margin-right: 6px; }' +
    '.map-legend .lg.closed::before { border-top: 3px dashed var(--red); } .map-legend .lg.stub::before { border-top: 3px dashed var(--muted); } .map-legend .lg.here::before { border-top: 3px solid var(--yel); }' +
    '.map-note { color: var(--muted); font-size: 12px; }' +
    '.map-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }' +
    '@media (max-width: 700px) { #map { position: fixed; inset: 0; height: min(100dvh, var(--real-h, 100dvh)); z-index: 20; padding: max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left)); } }';
  document.head.appendChild(st);
})();

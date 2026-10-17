/* EXCUSE ME — the venue: LA GRIETA. 11 interconnected zones, built with a tiny DSL.
   Tile coordinates everywhere; the engine converts to pixels (16 px per tile).
   Entities reference story content by id (dialogues / scripts live in story_*.js). */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T;
  const TL = EM.TL;

  /* ------------------------------------------------------------ cast */
  /* look: skin 0-3, hair 0-8, hc 0-3, expr 0-5, top 0-10, bottom 0-5, acc 0-8 (8 = mop) */
  const SKIN_MAP = [0, 1, 3, 4], HC_MAP = [0, 5, 6, 3];
  function L(skin, hair, hc, expr, top, bottom, acc, wide) { return { skin: SKIN_MAP[skin], hair: hair, hc: HC_MAP[hc], expr: expr, top: top, bottom: bottom, acc: acc, wide: !!wide }; }
  const CAST = EM.CAST = {
    maru:    { name: 'MARU',    look: L(1, 7, 0, 1, 9, 0, 5) },
    dani:    { name: 'DANI',    look: L(3, 4, 0, 2, 4, 2, 1) },
    tato:    { name: 'TATO',    look: L(0, 2, 1, 4, 3, 1, 0) },
    broh:    { name: 'BROH',    look: L(1, 1, 0, 3, 0, 4, 2, true) },
    sofi:    { name: 'SOFI',    look: L(2, 3, 0, 4, 7, 0, 6) },
    brohF1:  { name: 'BROH CREW', look: L(0, 1, 0, 2, 0, 4, 2, true) },
    brohF2:  { name: 'BROH CREW', look: L(1, 0, 0, 3, 2, 5, 0, true) },
    tobi:    { name: 'TOBI',    look: L(0, 5, 3, 5, 2, 4, 0) },
    stomp1:  { name: 'STOMPER', look: L(2, 5, 2, 2, 1, 1, 4) },
    stomp2:  { name: 'STOMPER', look: L(1, 4, 0, 3, 4, 0, 0) },
    stomp3:  { name: 'STOMPER', look: L(3, 8, 2, 2, 5, 5, 6) },
    stomp4:  { name: 'STOMPER', look: L(0, 2, 1, 1, 6, 2, 3) },
    fernet:  { name: 'FERNET',  look: L(2, 1, 0, 0, 9, 1, 1) },
    hugo:    { name: 'HUGO',    look: L(1, 0, 0, 1, 2, 0, 0) },
    tristan: { name: 'TRISTAN', look: L(0, 2, 2, 0, 1, 1, 4) },
    nico:    { name: 'NICO',    look: L(3, 6, 0, 1, 1, 1, 3) },
    dragan:  { name: 'DRAGAN',  look: L(2, 0, 0, 0, 8, 1, 0, true) },
    kiki:    { name: 'KIKI',    look: L(1, 8, 2, 2, 6, 3, 6) },
    bruno:   { name: 'BRUNO',   look: L(0, 2, 1, 5, 0, 0, 0) },
    ana:     { name: 'ANA',     look: L(1, 3, 0, 3, 7, 0, 0) },
    leo:     { name: 'LEO',     look: L(0, 2, 0, 3, 1, 1, 0) },
    luca:    { name: 'LUCA',    look: L(2, 4, 0, 1, 3, 0, 4) },
    mika:    { name: 'MIKA',    look: L(1, 7, 3, 0, 8, 1, 5) },
    rosa:    { name: 'ROSA',    look: L(2, 6, 1, 4, 0, 1, 8) },
    marga:   { name: 'MARGA',   look: L(0, 3, 2, 5, 6, 2, 0) },
    ezra:    { name: 'EZRA',    look: L(3, 5, 3, 3, 4, 5, 6) },
    qpair1:  { name: 'QUEUE',   look: L(1, 1, 0, 1, 3, 0, 0) },
    qpair2:  { name: 'QUEUE',   look: L(2, 8, 1, 1, 6, 4, 0) },
    dario:   { name: 'DARIO',   look: L(1, 0, 0, 0, 5, 5, 1, true) },
    sofa1:   { name: 'COUPLE',  look: L(0, 3, 2, 1, 7, 0, 0) },
    sofa2:   { name: 'COUPLE',  look: L(3, 1, 0, 1, 1, 1, 0) },
    trio1:   { name: 'TRIO',    look: L(1, 4, 0, 2, 5, 5, 0) },
    trio2:   { name: 'TRIO',    look: L(2, 0, 0, 2, 6, 3, 6) },
    trio3:   { name: 'TRIO',    look: L(0, 5, 3, 1, 4, 1, 0) },
    newbie:  { name: 'NEWBIE',  look: L(0, 2, 1, 5, 0, 0, 0) },
    juno:    { name: 'JUNO',    look: L(0, 8, 0, 5, 3, 0, 0) },
    hk1:     { name: 'HOOKUP',  look: L(2, 1, 0, 1, 9, 1, 0) },
    hk2:     { name: 'HOOKUP',  look: L(1, 3, 0, 1, 7, 0, 0) },
    rico:    { name: 'RICO',    look: L(2, 2, 0, 0, 9, 1, 7) },
    ximena:  { name: 'XIMENA',  look: L(2, 1, 3, 3, 3, 1, 3) },
    recog:   { name: 'STRANGER', look: L(1, 2, 1, 2, 1, 4, 0) },
    jonas:   { name: 'JONAS',   look: L(0, 2, 2, 2, 0, 4, 0) },
    ida:     { name: 'IDA',     look: L(0, 7, 2, 2, 3, 1, 4) },
    pili:    { name: 'PILI',    look: L(1, 4, 0, 2, 6, 3, 6) },
    mateo:   { name: 'MATEO',   look: L(1, 2, 0, 3, 9, 1, 0) },
    sol:     { name: 'SOL',     look: L(2, 3, 2, 1, 6, 4, 5) },
    ofelia:  { name: 'OFELIA',  look: L(3, 0, 0, 0, 8, 1, 0, true) },
    dante:   { name: 'DANTE',   look: L(2, 7, 1, 1, 3, 1, 0) },
    nuri:    { name: 'ISI',    look: L(1, 6, 0, 0, 10, 0, 0) },
    teo:     { name: 'TEO',     look: L(3, 1, 0, 1, 10, 1, 0) },
    hazel:   { name: 'HAZEL',   look: L(0, 5, 2, 4, 1, 1, 1) },
    oz:      { name: 'OZ',      look: L(1, 0, 0, 5, 6, 3, 6) },
    beatriz: { name: 'BEATRIZ', look: L(2, 7, 0, 0, 9, 1, 0) },
    resident:{ name: 'ÆRIEL', look: L(0, 1, 2, 1, 1, 1, 4) },
    djattic: { name: 'DJ',      look: L(3, 5, 3, 0, 1, 1, 4) },
    dj:      { name: 'DJ',      look: L(1, 2, 0, 0, 1, 1, 4) }
  };

  /* colours: hc hair colour 0-9, tc top colour 0-11, bc bottom colour 0-9, skin 0-5 (overrides) */
  const STYLE = {
    maru:    { hc: 7, tc: 9, bc: 1, skin: 1 }, dani:  { hc: 0, tc: 5, bc: 6, skin: 4 }, tato:   { hc: 2, tc: 8, bc: 1, skin: 0 },
    broh:    { hc: 1, tc: 0, bc: 4, skin: 2 }, sofi:  { hc: 0, tc: 6, bc: 0, skin: 3 }, brohF1: { hc: 3, tc: 10, bc: 4, skin: 0 }, brohF2: { hc: 1, tc: 2, bc: 5, skin: 1 },
    tobi:    { hc: 8, tc: 4, bc: 5, skin: 0 }, stomp1: { hc: 9, tc: 1, bc: 1, skin: 3 }, stomp2: { hc: 4, tc: 3, bc: 0, skin: 2 }, stomp3: { hc: 7, tc: 5, bc: 6, skin: 5 }, stomp4: { hc: 2, tc: 9, bc: 4, skin: 1 },
    fernet:  { hc: 0, tc: 7, bc: 1, skin: 3 }, hugo:  { hc: 5, tc: 0, bc: 0, skin: 1 }, tristan: { hc: 3, tc: 1, bc: 1, skin: 0 }, nico: { hc: 0, tc: 1, bc: 1, skin: 4 },
    dragan:  { hc: 0, tc: 5, bc: 1, skin: 3 }, kiki: { hc: 7, tc: 3, bc: 6, skin: 1 }, bruno: { hc: 2, tc: 0, bc: 0, skin: 0 }, ana: { hc: 1, tc: 10, bc: 0, skin: 1 }, leo: { hc: 0, tc: 8, bc: 1, skin: 0 },
    luca:    { hc: 0, tc: 10, bc: 1, skin: 3 }, mika: { hc: 8, tc: 4, bc: 1, skin: 1 }, rosa: { hc: 5, tc: 9, bc: 1, skin: 3 }, marga: { hc: 6, tc: 2, bc: 2, skin: 0 }, ezra: { hc: 9, tc: 6, bc: 1, skin: 4 },
    qpair1:  { hc: 2, tc: 11, bc: 0, skin: 1 }, qpair2: { hc: 3, tc: 7, bc: 8, skin: 3 }, dario: { hc: 0, tc: 1, bc: 1, skin: 1 }, sofa1: { hc: 4, tc: 6, bc: 0, skin: 0 }, sofa2: { hc: 0, tc: 3, bc: 1, skin: 4 },
    trio1:   { hc: 7, tc: 2, bc: 1, skin: 1 }, trio2: { hc: 0, tc: 8, bc: 6, skin: 3 }, trio3: { hc: 9, tc: 5, bc: 1, skin: 5 }, newbie: { hc: 2, tc: 11, bc: 0, skin: 0 }, juno: { hc: 0, tc: 11, bc: 0, skin: 0 },
    hk1:     { hc: 0, tc: 1, bc: 1, skin: 3 }, hk2: { hc: 4, tc: 2, bc: 3, skin: 1 }, rico: { hc: 2, tc: 1, bc: 1, skin: 3 }, ximena: { hc: 7, tc: 10, bc: 1, skin: 3 }, recog: { hc: 1, tc: 4, bc: 4, skin: 1 },
    jonas:   { hc: 3, tc: 4, bc: 4, skin: 0 }, ida: { hc: 3, tc: 3, bc: 1, skin: 0 }, pili: { hc: 4, tc: 2, bc: 6, skin: 1 }, mateo: { hc: 0, tc: 1, bc: 1, skin: 1 }, sol: { hc: 3, tc: 5, bc: 4, skin: 3 },
    ofelia:  { hc: 0, tc: 5, bc: 1, skin: 5 }, dante: { hc: 5, tc: 4, bc: 5, skin: 3 }, nuri: { hc: 0, tc: 7, bc: 0, skin: 1 }, teo: { hc: 0, tc: 7, bc: 0, skin: 4 }, hazel: { hc: 6, tc: 1, bc: 1, skin: 0 },
    oz:      { hc: 0, tc: 6, bc: 8, skin: 1 }, beatriz: { hc: 0, tc: 1, bc: 1, skin: 3 }, resident: { hc: 6, tc: 1, bc: 1, skin: 0 }, djattic: { hc: 8, tc: 6, bc: 1, skin: 5 }, dj: { hc: 9, tc: 2, bc: 1, skin: 1 }
  };
  Object.keys(CAST).forEach(function (id) {
    const st = STYLE[id]; const lk = CAST[id].look;
    if (st) { lk.hc = st.hc; lk.tc = st.tc; lk.bc = st.bc; if (st.skin !== undefined) lk.skin = st.skin; }
    else { lk.tc = lk.tc === undefined ? 3 : lk.tc; }
  });

  /* ------------------------------------------------------------ zone DSL */
  const zones = EM.zones = {};
  function Zone(id, w, h, o) {
    this.id = id; this.w = w; this.h = h;
    this.tiles = new Uint8Array(w * h);
    this.crowd = new Uint8Array(w * h);
    this.name = o.name; this.audio = o.audio || { lp: 18000, wet: 0.05, style: 'auto' };
    this.theme = o.theme || { a: '#FF2D95', b: '#19D3FF' }; this.dark = o.dark || 0; this.quiet = o.quiet || 0; this.sky = !!o.sky; this.outdoor = !!o.outdoor;
    this.ents = []; this.signs = []; this.lights = []; this.friendAt = {};
    this.crowdRects = [];
    zones[id] = this;
  }
  const P = Zone.prototype;
  P.set = function (x, y, t) { if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.tiles[y * this.w + x] = t; return this; };
  P.get = function (x, y) { return (x < 0 || y < 0 || x >= this.w || y >= this.h) ? TL.VOID : this.tiles[y * this.w + x]; };
  P.fill = function (x, y, w, h, t) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, t); return this; };
  P.room = function (x, y, w, h, floor) { this.fill(x, y, w, h, TL.WALL); this.fill(x + 1, y + 2, w - 2, h - 3, floor); return this; };
  /* base: 0-3 crowd density at peak; rects are scaled by the time of night at runtime */
  P.crowdRect = function (x, y, w, h, base) { this.crowdRects.push({ x: x, y: y, w: w, h: h, base: base }); return this; };
  P.sign = function (x, y, text, scale) { this.signs.push({ x: x, y: y, text: text, scale: scale || 1 }); return this; };
  P.light = function (x, y, r, c) { this.lights.push({ x: x * 16 + 8, y: y * 16 + 8, r: r, c: c || null }); return this; };
  P.door = function (x, y, w, h, to, tx, ty, dir, o) {
    o = o || {};
    this.ents.push({ type: 'door', id: o.id || ('door_' + to + '_' + x + '_' + y), x: x, y: y, w: w, h: h, to: to, tx: tx, ty: ty, dir: dir || 'u', when: o.when, locked: o.locked, label: o.label });
    return this;
  };
  P.npc = function (d) { d.type = 'npc'; this.ents.push(d); return this; };
  P.obj = function (d) { d.type = 'obj'; this.ents.push(d); return this; };
  P.trig = function (d) { d.type = 'trig'; this.ents.push(d); return this; };
  P.friend = function (zoneKey, x, y) { this.friendAt[zoneKey] = { x: x, y: y }; return this; };

  const F = function (f) { return function (s) { return !!s.flags[f]; }; };
  const NF = function (f) { return function (s) { return !s.flags[f]; }; };
  EM.F = F; EM.NF = NF;

  /* ============================================================ 1. OUTSIDE */
  (function () {
    const Z = new Zone('doors', 32, 16, { theme: { a: '#FF2D95', b: '#19D3FF' }, name: T('OUTSIDE // LA GRIETA', 'AFUERA // LA GRIETA', 'FORA // LA GRIETA'), audio: { lp: 650, wet: 0.08, style: 'auto' }, dark: 0.18, outdoor: true });
    Z.fill(0, 0, 32, 4, TL.WALL);
    Z.fill(0, 4, 32, 6, TL.SIDEWALK);
    Z.fill(0, 10, 32, 4, TL.ROAD);
    Z.set(27, 3, TL.DOORF);
    Z.fill(16, 6, 9, 1, TL.FENCE);
    Z.set(26, 4, TL.FENCE); Z.set(28, 4, TL.FENCE);
    Z.sign(21, 1, 'LA GRIETA', 2);
    Z.sign(2, 7, 'BUS 14', 1);
    Z.sign(9, 2, '22:00 - 08:00', 1);
    Z.light(27, 5, 60).light(8, 6, 50).light(20, 7, 70);
    Z.door(27, 3, 1, 1, 'foyer', 4, 12, 'u', { id: 'door_in', when: F('bouncer_ok'), locked: T('The door is closed. The bouncer has the last word.', 'La puerta está cerrada. Manda el de la puerta.', 'A porta está fechada. Quem manda é o segurança.') });
    Z.npc({ id: 'dragan', x: 27, y: 4, dlg: 'dragan', gate: true, reach: 20, when: NF('bouncer_ok'), dir: 'd' });
    Z.npc({ id: 'kiki', x: 19, y: 5, dlg: 'kiki', dir: 'd', reach: 24 });
    Z.npc({ id: 'bruno', x: 22, y: 5, dlg: 'bruno', dir: 'd', reach: 24 });
    Z.npc({ id: 'qpair', x: 12, y: 7, pair: ['ana', 'leo'], dlg: 'argue_couple', dir: 'd', reach: 14 });
    [[17, 5, 'tristan'], [18, 5, 'luca'], [20, 5, 'stomp2'], [21, 5, 'qpair1'], [23, 5, 'qpair2'], [24, 5, 'stomp4']].forEach(function (q) {
      Z.npc({ id: 'extra_q_' + q[0], cast: q[2], x: q[0], y: q[1], dir: 'r', decor: true });
    });
  })();

  /* ============================================================ 2. FOYER */
  (function () {
    const Z = new Zone('foyer', 28, 14, { theme: { a: '#FFB020', b: '#FF2D95' }, name: T('FOYER // COAT CHECK', 'FOYER // GUARDARROPA', 'FOYER // CHAPELARIA'), audio: { lp: 900, wet: 0.12, style: 'auto' }, dark: 0.1 });
    Z.room(0, 0, 28, 14, TL.FLOOR);
    Z.fill(2, 2, 6, 1, TL.LOCKER); Z.fill(2, 3, 6, 1, TL.BAR);
    Z.fill(10, 9, 3, 1, TL.BENCH); Z.set(1, 11, TL.PLANT); Z.set(26, 12, TL.PLANT);
    Z.fill(21, 2, 3, 1, TL.STAIRS);
    Z.set(13, 1, TL.DOORF); Z.set(14, 1, TL.DOORF); Z.set(4, 13, TL.DOORF);
    Z.set(27, 5, TL.DOORF); Z.set(27, 10, TL.DOORF); Z.set(0, 8, TL.DOORF);
    Z.sign(12, 3, 'DANCE', 1).sign(23, 4, 'SALA 2', 1).sign(24, 6, 'WC >', 1).sign(23, 11, 'SMOKING >', 1).sign(1, 6, '< QUIET ROOM', 1);
    Z.door(13, 1, 2, 1, 'main', 21, 29, 'u', { id: 'door_main' });
    Z.door(4, 13, 1, 1, 'doors', 25, 8, 'd', { id: 'door_street' });
    Z.door(27, 5, 1, 1, 'restrooms', 2, 12, 'r', { id: 'door_wc' });
    Z.door(27, 10, 1, 1, 'tunnel', 2, 4, 'r', { id: 'door_tunnel' });
    Z.door(0, 8, 1, 1, 'welfare', 19, 7, 'l', { id: 'door_welfare' });
    Z.door(21, 1, 3, 1, 'attic', 3, 21, 'u', { id: 'door_attic', when: function (s) { return s.time >= 180; }, locked: T('SALA 2 opens at 01:00. The stairs have a chain across them.', 'SALA 2 abre a la 1:00. Hay una cadena cruzando la escalera.', 'A SALA 2 abre à 1:00. Tem uma corrente atravessando a escada.') });
    Z.npc({ id: 'luca', x: 4.5, y: 2.5, dlg: 'luca', reach: 36, dir: 'd' });
    Z.npc({ id: 'fernet', x: 19, y: 8, dlg: 'fernet', dir: 'l', when: function (s) { return !s.flags.fernet_left; }, reach: 16 });
    Z.friend('default', 15, 6);
    Z.crowdRect(14, 4, 8, 6, 1);
  })();

  /* ============================================================ 3. MAIN FLOOR */
  (function () {
    const Z = new Zone('main', 44, 32, { theme: { a: '#FF2D95', b: '#19D3FF' }, name: T('MAIN FLOOR', 'PISTA PRINCIPAL', 'PISTA PRINCIPAL'), audio: { lp: 18000, wet: 0.05, style: 'auto' }, dark: 0.0 });
    Z.room(0, 0, 44, 32, TL.FLOOR);
    Z.fill(9, 6, 26, 16, TL.DANCE);
    Z.fill(17, 2, 10, 3, TL.BOOTH); Z.fill(19, 5, 6, 1, TL.TABLE);
    Z.fill(13, 2, 2, 4, TL.SPEAKER); Z.fill(29, 2, 2, 4, TL.SPEAKER);
    Z.fill(1, 9, 2, 4, TL.SPEAKER); Z.fill(41, 2, 2, 4, TL.SPEAKER);
    Z.set(5, 15, TL.PILLAR); Z.set(5, 20, TL.PILLAR);
    Z.fill(38, 8, 1, 13, TL.BAR); Z.fill(41, 8, 1, 13, TL.LOCKER);
    /* partition with three gaps */
    Z.fill(1, 23, 42, 1, TL.WALL);
    Z.fill(6, 23, 2, 1, TL.FLOOR); Z.fill(20, 23, 4, 1, TL.FLOOR); Z.fill(33, 23, 2, 1, TL.FLOOR);
    /* toilet nook */
    Z.fill(41, 25, 2, 1, TL.WALL); Z.fill(41, 27, 2, 1, TL.WALL);
    Z.set(43, 26, TL.DOORF); Z.set(21, 31, TL.DOORF); Z.set(22, 31, TL.DOORF);
    Z.set(0, 26, TL.CURTAIN); Z.set(33, 1, TL.DOORF);
    Z.sign(21, 25, 'EXIT', 1).sign(39, 24, 'WC >', 1).sign(1, 24, '< DARK ROOM', 1).sign(31, 4, 'STAFF', 1);
    Z.light(22, 12, 90).light(22, 3, 70);
    /* crowd (base densities at peak) */
    Z.crowdRect(9, 6, 26, 16, 3);
    Z.crowdRect(3, 6, 6, 17, 2);
    Z.crowdRect(35, 6, 3, 16, 2);
    Z.crowdRect(2, 24, 40, 7, 1);
    Z.crowdRect(2, 14, 5, 6, 0); /* friends' corner */
    Z.door(21, 31, 2, 1, 'foyer', 13, 3, 'd', { id: 'door_foyer' });
    Z.door(43, 26, 1, 1, 'restrooms', 10, 19, 'u', { id: 'door_wc2' });
    Z.door(0, 26, 1, 1, 'darkroom', 13, 15, 'u', { id: 'door_dark' });
    Z.door(33, 1, 1, 1, 'backstage', 4, 9, 'u', { id: 'door_backstage', when: function (s) { return !!(s.flags.backstage_access || s.flags.rosa_ally || s.flags.resident_friend); }, locked: T('STAFF ONLY. A woman with a clipboard is looking at you.', 'SOLO STAFF. Una mujer con una carpeta te está mirando.', 'SÓ STAFF. Uma mulher com uma prancheta está te olhando.'), caught: 'beatriz_catch' });
    /* the three passages */
    Z.npc({ id: 'broh', pair: function (s) { return s.flags.broh_back ? ['broh', 'brohF1'] : ['broh', 'sofi']; }, x: 7, y: 23.5, box: { w: 2, h: 1 }, dlg: function (s) { return s.flags.broh_back ? 'broh_return' : 'broh1'; }, gate: true, reach: 26, dir: 'd', when: function (s) { return !s.res.broh; } });
    Z.npc({ id: 'stomp', ring: ['stomp1', 'stomp2', 'stomp3', 'stomp4'], x: 22, y: 23.5, box: { w: 4, h: 1 }, dlg: 'stomp', gate: true, reach: 30, dir: 'd', when: function (s) { return !s.res.stomp; } });
    Z.npc({ id: 'tobi', x: 34, y: 23.5, box: { w: 2, h: 1 }, dlg: 'tobi', gate: true, reach: 24, dir: 'd', when: function (s) { return !s.res.tobi; } });
    Z.npc({ id: 'broh_side', cast: 'broh', x: 7, y: 23.5, dir: 'd', decor: true, when: function (s) { return !!s.res.broh && !!s.flags.broh_friend; } });
    Z.npc({ id: 'sofa_nook', pair: ['sofa1', 'sofa2'], x: 41.5, y: 26.5, box: { w: 1, h: 1 }, dlg: 'sofa_nook', gate: true, reach: 20, dir: 'd', pose: 'hug', when: function (s) { return !s.res.sofa_nook; } });
    /* residents of the room */
    Z.npc({ id: 'nico', x: 39.5, y: 13.5, dlg: 'bar_menu', reach: 36, dir: 'l' });
    Z.npc({ id: 'hugo', x: 11, y: 5, dlg: 'hugo', dir: 'd', reach: 16 });
    Z.npc({ id: 'tristan', x: 31, y: 21.5, dlg: 'tristan', dir: 'l', reach: 16, when: NF('tristan_done') });
    Z.npc({ id: 'fernet2', cast: 'fernet', x: 36, y: 27, dlg: 'fernet', dir: 'd', reach: 16, when: function (s) { return !!s.flags.fernet_left; } });
    Z.npc({ id: 'dj', x: 21.5, y: 3.5, dir: 'd', decor: true, pose: 'dance' });
    Z.obj({ id: 'water_main', kind: 'water', x: 37, y: 8, w: 1, h: 1, label: T('WATER JUG', 'JARRA DE AGUA', 'JARRA DE ÁGUA') });
    Z.obj({ id: 'bar_main', kind: 'bar', x: 37, y: 13, w: 1, h: 2, label: T('BAR', 'BARRA', 'BAR') });
    [[15, 10], [27, 9], [14, 18], [29, 18], [21, 15]].forEach(function (p, i) {
      Z.obj({ id: 'dance_main_' + i, kind: 'dance', x: p[0], y: p[1], w: 1, h: 1, label: T('DANCE', 'BAILAR', 'DANÇAR') });
    });
    Z.obj({ id: 'peak_spot', kind: 'peak', x: 21, y: 12, w: 2, h: 2, label: T('THE CENTRE', 'EL CENTRO', 'O CENTRO'), when: function (s) { return s.quests.q7 === 'active'; } });
    Z.friend('main', 5, 17).friend('default', 15, 25);
    Z.friend('main2', 23, 25);
  })();

  /* ============================================================ 4. RESTROOMS */
  (function () {
    const Z = new Zone('restrooms', 34, 22, { theme: { a: '#19D3FF', b: '#00C2A8' }, name: T('TOILETS', 'BAÑOS', 'BANHEIROS'), audio: { lp: 520, wet: 0.2, style: 'auto' }, dark: 0.0 });
    Z.room(0, 0, 34, 22, TL.TILE);
    Z.fill(3, 1, 8, 1, TL.MIRROR); Z.fill(3, 2, 8, 1, TL.SINK);
    Z.fill(20, 2, 1, 8, TL.WALL); Z.fill(20, 12, 1, 9, TL.WALL);
    [22, 25, 28, 31].forEach(function (x) { Z.fill(x, 3, 1, 6, TL.STALL); });
    Z.fill(26, 9, 2, 1, TL.STALL); Z.fill(29, 9, 2, 1, TL.STALL);
    Z.fill(23, 3, 2, 1, TL.STALL); Z.fill(26, 3, 2, 1, TL.STALL); Z.fill(29, 3, 2, 1, TL.STALL);
    Z.set(0, 12, TL.DOORF); Z.set(10, 21, TL.DOORF); Z.set(11, 21, TL.DOORF); Z.set(0, 5, TL.DOORF);
    Z.sign(21, 11, 'ALL GENDERS', 1).sign(1, 8, 'STAFF ONLY', 1).sign(12, 19, 'MAIN >', 1);
    Z.door(0, 12, 1, 1, 'foyer', 25, 5, 'l', { id: 'door_foyer2' });
    Z.door(10, 21, 2, 1, 'main', 42, 26, 'l', { id: 'door_main2' });
    Z.door(0, 5, 1, 1, 'backstage', 2, 5, 'r', { id: 'door_service', when: F('rosa_ally'), locked: T('STAFF ONLY. The door is locked. Rosa has the key.', 'SOLO STAFF. La puerta tiene llave. Rosa la tiene.', 'SÓ STAFF. A porta está trancada. A Rosa tem a chave.') });
    Z.npc({ id: 'host', cast: 'mika', x: 20.5, y: 11, box: { w: 1, h: 2 }, dlg: 'host', gate: true, reach: 26, dir: 'r', when: function (s) { return !s.res.host; } });
    Z.npc({ id: 'host_side', cast: 'mika', x: 19, y: 12.5, dir: 'r', decor: true, when: function (s) { return !!s.res.host; } });
    Z.npc({ id: 'marga', x: 19, y: 10.5, dlg: 'marga', dir: 'r', reach: 14, when: NF('marga_done') });
    Z.npc({ id: 'ezra', x: 17, y: 10.5, dlg: 'ezra', dir: 'r', reach: 14 });
    Z.npc({ id: 'qwait1', pair: ['qpair1', 'qpair2'], x: 15, y: 10.5, dlg: 'queue_pair', dir: 'r', reach: 16 });
    Z.npc({ id: 'broh_q', pair: ['broh', 'brohF1'], x: 13, y: 10.5, dlg: 'broh_queue', dir: 'r', reach: 22, when: function (s) { return !!s.flags.broh_hostile; } });
    Z.npc({ id: 'rosa', x: 9, y: 7, dlg: function (s) { return s.flags.rosa_met ? 'rosa_again' : 'rosa_wait'; }, dir: 'd', reach: 18, when: function (s) { return !(s.quests.q4 === 'active' && !s.flags.rosa_met) || true; } });
    Z.obj({ id: 'sinks', kind: 'water', x: 3, y: 3, w: 8, h: 1, label: T('SINKS', 'LAVAMANOS', 'PIAS') });
    Z.obj({ id: 'stall_door', kind: 'stall', x: 23, y: 9, w: 2, h: 1, label: T('FREE STALL', 'CABINA LIBRE', 'CABINE LIVRE'), when: function (s) { return !!s.res.host && s.quests.q3 !== 'done'; } });
    Z.friend('default', 14, 14);
    Z.crowdRect(22, 11, 10, 9, 0);
  })();

  /* ============================================================ 5. DARKROOM */
  (function () {
    const Z = new Zone('darkroom', 26, 18, { theme: { a: '#FF3B30', b: '#8A5CFF' }, name: T('DARK ROOM', 'CUARTO OSCURO', 'DARK ROOM'), audio: { lp: 420, wet: 0.25, style: 'auto' }, dark: 0.5 });
    Z.room(0, 0, 26, 18, TL.RUG);
    Z.fill(2, 3, 3, 1, TL.COUCH); Z.fill(8, 11, 3, 1, TL.COUCH); Z.fill(2, 11, 3, 1, TL.COUCH);
    Z.fill(15, 3, 8, 6, TL.MATT);
    Z.set(13, 17, TL.CURTAIN);
    Z.sign(8, 15, 'ASK FIRST', 1).sign(14, 15, 'NO MEANS NO', 1).sign(19, 10, 'SLOW DOWN', 1);
    Z.light(6, 4, 46).light(18, 6, 56).light(13, 14, 46).light(8, 12, 40);
    Z.door(13, 17, 1, 1, 'main', 1, 26, 'r', { id: 'door_main3' });
    Z.npc({ id: 'dario', x: 11.5, y: 15, dlg: function (s) { return s.flags.dario_met ? 'dario_again' : 'dario'; }, dir: 'u', reach: 20 });
    Z.npc({ id: 'sofa_dr', pair: ['sofa1', 'sofa2'], x: 9, y: 11.8, dlg: 'sofa_dr', dir: 'd', pose: 'hug', reach: 18 });
    Z.npc({ id: 'trio', ring: ['trio1', 'trio2', 'trio3'], x: 19, y: 5.5, dlg: 'trio', dir: 'd', reach: 26 });
    Z.npc({ id: 'newbie', x: 4, y: 13.5, dlg: 'newbie', dir: 'r', reach: 14, when: NF('newbie_done') });
    Z.friend('darkroom', 6, 6).friend('default', 6, 8);
    Z.crowdRect(7, 5, 6, 6, 1);
  })();

  /* ============================================================ 6. TUNNEL */
  (function () {
    const Z = new Zone('tunnel', 44, 10, { theme: { a: '#00C2A8', b: '#2F6BFF' }, name: T('THE TUNNEL', 'EL TÚNEL', 'O TÚNEL'), audio: { lp: 380, wet: 0.5, style: 'auto' }, dark: 0.86 });
    Z.fill(0, 0, 44, 10, TL.WALL);
    Z.fill(1, 3, 42, 4, TL.CONC);
    Z.fill(10, 2, 3, 1, TL.CONC); Z.fill(22, 2, 3, 1, TL.CONC); Z.fill(33, 2, 3, 1, TL.CONC); Z.fill(16, 7, 4, 1, TL.CONC);
    Z.set(0, 4, TL.DOORF); Z.set(43, 4, TL.DOORF);
    Z.light(4, 4, 34).light(20, 4, 36).light(32, 4, 36).light(40, 4, 34).light(23, 2, 22);
    Z.door(0, 4, 1, 1, 'foyer', 26, 10, 'l', { id: 'door_foyer3' });
    Z.door(43, 4, 1, 1, 'courtyard', 2, 11, 'r', { id: 'door_court' });
    Z.npc({ id: 'recog', x: 7, y: 5, dlg: 'recog', dir: 'r', reach: 16, when: function (s) { return !!s.flags.sofa_invite && !s.flags.recog_done; } });
    Z.npc({ id: 'juno', x: 14, y: 5, dlg: 'juno', pose: 'lie', dir: 'r', reach: 22, when: NF('juno_done') });
    Z.npc({ id: 'hk', pair: ['hk1', 'hk2'], x: 23.5, y: 2.5, dlg: 'alcove', dir: 'd', pose: 'hug', reach: 20 });
    Z.npc({ id: 'rico', x: 29, y: 5, dlg: 'rico', dir: 'd', reach: 16 });
    Z.npc({ id: 'ximena', x: 38, y: 3.5, dlg: 'ximena', dir: 'u', reach: 16 });
    Z.obj({ id: 'rest_tunnel', kind: 'rest', x: 17, y: 7, w: 2, h: 1, label: T('SIT ON THE CURB', 'SENTARSE EN EL BORDE', 'SENTAR NO MEIO-FIO') });
    Z.friend('tunnel', 36, 5).friend('default', 3, 5);
  })();

  /* ============================================================ 7. COURTYARD */
  (function () {
    const Z = new Zone('courtyard', 40, 26, { theme: { a: '#FF6A00', b: '#2ED36A' }, name: T('SMOKING AREA', 'ZONA DE FUMAR', 'ÁREA DE FUMANTES'), audio: { lp: 420, wet: 0.22, style: 'auto' }, dark: 0.3, quiet: 0.04, outdoor: true });
    Z.fill(0, 0, 40, 26, TL.VOID);
    Z.fill(1, 0, 38, 2, TL.WALL);
    Z.fill(1, 2, 38, 23, TL.GRASS);
    Z.fill(1, 8, 14, 6, TL.CONC);
    Z.fill(0, 2, 1, 23, TL.FENCE); Z.fill(39, 2, 1, 23, TL.FENCE); Z.fill(1, 25, 38, 1, TL.FENCE);
    Z.set(0, 11, TL.DOORF); Z.set(39, 12, TL.DOORF); Z.set(20, 1, TL.DOORF);
    [[6, 5], [9, 5], [22, 20], [26, 20], [30, 6], [4, 21]].forEach(function (b) { Z.set(b[0], b[1], TL.BENCH); });
    [[14, 15], [28, 12], [10, 20], [33, 15]].forEach(function (b) { Z.set(b[0], b[1], TL.BARREL); });
    Z.set(36, 3, TL.CRATE); Z.set(37, 3, TL.CRATE); Z.set(2, 3, TL.PLANT); Z.set(37, 22, TL.PLANT);
    Z.sign(17, 1, 'QUIET ROOM', 1).sign(35, 11, 'EXIT >', 1);
    Z.light(14, 15, 60).light(28, 12, 60).light(10, 20, 50).light(33, 15, 50).light(20, 3, 40).light(2, 11, 40);
    Z.door(0, 11, 1, 1, 'tunnel', 41, 4, 'l', { id: 'door_tunnel2' });
    Z.door(20, 1, 1, 1, 'welfare', 11, 3, 'd', { id: 'door_welfare2' });
    Z.door(39, 12, 1, 1, 'street_exit', 0, 0, 'r', { id: 'door_leave' });
    Z.npc({ id: 'jonas', pair: ['jonas', 'ida'], x: 13, y: 17.5, dlg: 'tourists', dir: 'd', reach: 18 });
    Z.npc({ id: 'pili', x: 26, y: 17, dlg: 'pili', dir: 'l', reach: 16 });
    Z.npc({ id: 'dante', x: 31, y: 7.5, dlg: 'dante', dir: 'l', reach: 16 });
    Z.npc({ id: 'sol', x: 34, y: 20, dlg: function (s) { return s.flags.sol_met ? 'sol_again' : 'sol'; }, dir: 'l', reach: 16 });
    Z.npc({ id: 'ofelia', x: 36, y: 12, dlg: 'ofelia', dir: 'l', reach: 22 });
    Z.npc({ id: 'mateo', x: 19, y: 11, dlg: 'mateo', dir: 'r', reach: 16, when: function (s) { return s.away.tato === 'courtyard'; } });
    Z.obj({ id: 'cig', kind: 'smoke', x: 27, y: 12, w: 2, h: 1, label: T('LIGHT UP', 'PRENDER UNO', 'ACENDER UM') });
    Z.obj({ id: 'vend', kind: 'water', x: 36, y: 4, w: 2, h: 1, label: T('WATER TAP', 'CANILLA', 'TORNEIRA') });
    Z.obj({ id: 'rest_c1', kind: 'rest', x: 6, y: 6, w: 1, h: 1, label: T('SIT ON THE BENCH', 'SENTARSE EN EL BANCO', 'SENTAR NO BANCO') });
    Z.obj({ id: 'rest_c2', kind: 'rest', x: 9, y: 6, w: 1, h: 1, label: T('SIT ON THE BENCH', 'SENTARSE EN EL BANCO', 'SENTAR NO BANCO') });
    Z.obj({ id: 'rest_c3', kind: 'rest', x: 22, y: 21, w: 1, h: 1, label: T('SIT ON THE BENCH', 'SENTARSE EN EL BANCO', 'SENTAR NO BANCO') });
    Z.obj({ id: 'cat', kind: 'cat', x: 5, y: 22, w: 1, h: 1, label: T('PET THE CAT', 'ACARICIAR AL GATO', 'FAZER CARINHO NO GATO') });
    Z.friend('courtyard', 18, 12).friend('default', 6, 12);
  })();

  /* ============================================================ 8. WELFARE */
  (function () {
    const Z = new Zone('welfare', 22, 14, { theme: { a: '#2ED36A', b: '#19D3FF' }, name: T('QUIET ROOM // WELFARE', 'SALA TRANQUILA // CUIDADO', 'SALA DE CALMA // CUIDADO'), audio: { lp: 240, wet: 0.2, style: 'chill' }, dark: 0.0, quiet: 0.28 });
    Z.room(0, 0, 22, 14, TL.TILE);
    Z.fill(2, 8, 7, 4, TL.MATT);
    Z.fill(13, 4, 4, 1, TL.TABLE); Z.fill(18, 3, 2, 1, TL.CRATE); Z.fill(18, 4, 2, 1, TL.CRATE);
    Z.set(21, 7, TL.DOORF); Z.set(11, 1, TL.DOORF);
    Z.sign(13, 2, 'CHECK', 1).sign(2, 7, 'REST', 1).sign(17, 6, 'WATER', 1);
    Z.door(21, 7, 1, 1, 'foyer', 2, 8, 'r', { id: 'door_foyer4' });
    Z.door(11, 1, 1, 1, 'courtyard', 20, 3, 'd', { id: 'door_court2' });
    Z.npc({ id: 'nuri', x: 14.5, y: 3.5, dlg: function (s) { return s.pill.tested ? 'nuri_after' : 'nuri'; }, dir: 'd', reach: 34 });
    Z.npc({ id: 'teo', x: 5, y: 5, dlg: 'teo', dir: 'd', reach: 18 });
    Z.obj({ id: 'rest_w', kind: 'rest', x: 2, y: 8, w: 7, h: 4, label: T('LIE DOWN', 'ACOSTARSE', 'DEITAR'), strong: true });
    Z.obj({ id: 'water_w', kind: 'water', x: 18, y: 5, w: 2, h: 1, label: T('WATER STATION', 'ESTACIÓN DE AGUA', 'ESTAÇÃO DE ÁGUA') });
    Z.friend('welfare', 5, 9).friend('default', 8, 6);
  })();

  /* ============================================================ 9. ATTIC */
  (function () {
    const Z = new Zone('attic', 40, 24, { theme: { a: '#8A5CFF', b: '#B6FF3B' }, name: T('SALA 2 // THE ATTIC', 'SALA 2 // EL ÁTICO', 'SALA 2 // O SÓTÃO'), audio: { lp: 14000, wet: 0.25, style: 'attic' }, dark: 0.2 });
    Z.room(0, 0, 40, 24, TL.FLOOR);
    Z.fill(6, 6, 26, 12, TL.DANCE);
    Z.fill(34, 2, 5, 3, TL.BOOTH); Z.fill(34, 5, 5, 1, TL.TABLE);
    Z.fill(1, 5, 2, 4, TL.SPEAKER); Z.fill(36, 9, 2, 4, TL.SPEAKER); Z.fill(1, 14, 2, 4, TL.SPEAKER);
    Z.set(3, 22, TL.STAIRS); Z.set(3, 23, TL.DOORF); Z.set(20, 1, TL.DOORF);
    Z.sign(4, 20, 'DOWN', 1).sign(18, 2, 'BALCONY', 1);
    Z.light(18, 11, 90).light(36, 3, 50);
    Z.door(3, 23, 1, 1, 'foyer', 22, 3, 'd', { id: 'door_foyer5' });
    Z.door(20, 1, 1, 1, 'rooftop', 4, 11, 'u', { id: 'door_roof', when: F('roof_open'), locked: T('The balcony door is chained. Someone upstairs decides when it opens.', 'La puerta del balcón tiene cadena. Alguien arriba decide cuándo abre.', 'A porta da sacada está acorrentada. Alguém lá em cima decide quando abre.') });
    Z.crowdRect(6, 6, 26, 12, 3);
    Z.crowdRect(3, 3, 30, 3, 1);
    Z.crowdRect(14, 9, 10, 6, 1);
    Z.npc({ id: 'hazel', x: 8, y: 20.5, dlg: 'hazel', dir: 'r', reach: 16 });
    Z.npc({ id: 'cult', ring: ['stomp3', 'stomp1', 'stomp4', 'stomp2', 'oz'], x: 19, y: 11.5, box: { w: 3, h: 2 }, dlg: 'cult', gate: false, reach: 34, dir: 'd' });
    Z.npc({ id: 'oz', x: 31, y: 20.5, dlg: 'oz', dir: 'l', reach: 16 });
    Z.npc({ id: 'djattic', x: 36.5, y: 3.5, dir: 'd', decor: true, pose: 'dance' });
    [[10, 9], [26, 9], [10, 15], [27, 15]].forEach(function (p, i) { Z.obj({ id: 'dance_attic_' + i, kind: 'dance', x: p[0], y: p[1], w: 1, h: 1, label: T('DANCE', 'BAILAR', 'DANÇAR') }); });
    Z.friend('attic', 22, 14).friend('default', 6, 20);
  })();

  /* ============================================================ 10. BACKSTAGE */
  (function () {
    const Z = new Zone('backstage', 28, 12, { theme: { a: '#FFB020', b: '#FF6A00' }, name: T('BACKSTAGE', 'BACKSTAGE', 'BACKSTAGE'), audio: { lp: 1200, wet: 0.12, style: 'auto' }, dark: 0.1, quiet: 0.1 });
    Z.room(0, 0, 28, 12, TL.RUG);
    Z.fill(10, 8, 3, 1, TL.COUCH); Z.fill(20, 3, 3, 1, TL.CRATE); Z.fill(16, 5, 2, 1, TL.TABLE);
    Z.set(4, 10, TL.DOORF); Z.set(0, 5, TL.DOORF); Z.set(24, 1, TL.DOORF);
    Z.sign(22, 2, 'ROOF', 1).sign(2, 9, 'STAGE', 1);
    Z.door(4, 10, 1, 1, 'main', 33, 3, 'd', { id: 'door_main4' });
    Z.door(0, 5, 1, 1, 'restrooms', 2, 6, 'r', { id: 'door_service2' });
    Z.door(24, 1, 1, 1, 'rooftop', 14, 11, 'u', { id: 'door_roof2', when: F('roof_open'), locked: T('The roof stairs are chained. ÆRIEL has the key.', 'La escalera al techo tiene cadena. ÆRIEL tiene la llave.', 'A escada do terraço está acorrentada. ÆRIEL tem a chave.') });
    Z.npc({ id: 'beatriz', x: 7, y: 6, dlg: 'beatriz', dir: 'r', reach: 20 });
    Z.npc({ id: 'resident', x: 11, y: 7.5, dlg: 'resident', dir: 'd', reach: 18, pose: 'sit' });
    Z.obj({ id: 'water_bs', kind: 'water', x: 20, y: 4, w: 3, h: 1, label: T('WATER CRATE', 'CAJÓN DE AGUA', 'CAIXA DE ÁGUA') });
    Z.obj({ id: 'rest_bs', kind: 'rest', x: 10, y: 9, w: 3, h: 1, label: T('SIT ON THE SOFA', 'SENTARSE EN EL SOFÁ', 'SENTAR NO SOFÁ') });
    Z.friend('default', 14, 9);
  })();

  /* ============================================================ 11. ROOFTOP */
  (function () {
    const Z = new Zone('rooftop', 30, 14, { theme: { a: '#FF6A00', b: '#FF7AB8' }, name: T('THE ROOF', 'EL TECHO', 'O TERRAÇO'), audio: { lp: 900, wet: 0.35, style: 'closing' }, dark: 0.0, sky: true, outdoor: true, quiet: 0.1 });
    Z.fill(0, 0, 30, 14, TL.VOID);
    Z.fill(0, 0, 30, 2, TL.SKY);
    Z.fill(0, 2, 30, 1, TL.RAIL);
    Z.fill(1, 3, 28, 10, TL.CONC);
    Z.fill(0, 3, 1, 10, TL.RAIL); Z.fill(29, 3, 1, 10, TL.RAIL); Z.fill(0, 13, 30, 1, TL.RAIL);
    Z.set(14, 13, TL.DOORF); Z.set(4, 12, TL.DOORF);
    Z.fill(22, 4, 2, 1, TL.CRATE); Z.fill(5, 5, 1, 1, TL.BARREL); Z.set(25, 9, TL.BENCH); Z.set(26, 9, TL.BENCH);
    Z.door(14, 13, 1, 1, 'backstage', 24, 2, 'd', { id: 'door_bs2' });
    Z.door(4, 12, 1, 1, 'attic', 20, 2, 'd', { id: 'door_attic2' });
    Z.light(5, 5, 50);
    Z.obj({ id: 'sunrise_spot', kind: 'sunrise', x: 13, y: 5, w: 4, h: 3, label: T('WATCH THE SUNRISE', 'VER EL AMANECER', 'VER O AMANHECER'), when: function (s) { return s.quests.q9 === 'active'; } });
    Z.friend('default', 10, 8);
  })();
})();

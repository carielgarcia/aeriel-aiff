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
    dani:    { get name() { return EM.rename('DANI'); },   look: L(3, 4, 0, 2, 4, 2, 1) },
    tato:    { get name() { return EM.rename('TATO'); },   look: L(0, 2, 1, 4, 3, 1, 0) },
    vale:    { name: 'VALE',    look: L(2, 6, 2, 1, 5, 3, 2) },
    alex:    { name: 'ALEX',    look: L(1, 1, 1, 3, 10, 2, 4) },
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

  EM.Zone = Zone; /* story files that add rooms (THE AFTER) build them with the same DSL */
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };
  const NF = function (f) { return function (s) { return !s.flags[f]; }; };
  EM.F = F; EM.NF = NF;

  const bsGate = function (s) { return !!(s.flags.backstage_access || s.flags.rosa_lanyard || s.flags.rosa_ally || s.flags.resident_friend); };
  const bsHint = T("STAFF ONLY. Need a backstage pass or lanyard (help Rosa in the toilets, or earn the resident's trust).", "SOLO STAFF. Necesitas pase o credencial de backstage (ayuda a Rosa en los baños o gánate la confianza de la residente).", "SÓ STAFF. Precisa de passe ou credencial do backstage (ajude a Rosa nos banheiros ou ganhe a confiança da residente).");

  /* ============================================================ 1. OUTSIDE */
  (function () {
    const Z = new Zone('doors', 32, 16, { theme: { a: '#FF2D95', b: '#19D3FF' }, name: T('OUTSIDE // LA GRIETA', 'AFUERA // LA GRIETA', 'FORA // LA GRIETA'), audio: { lp: 650, wet: 0.08, style: 'auto' }, dark: 0.18, outdoor: true });
    Z.fill(0, 0, 32, 4, TL.WALL);
    Z.fill(0, 4, 32, 6, TL.SIDEWALK);
    Z.fill(0, 10, 32, 4, TL.ROAD);
    Z.set(27, 3, TL.DOORF);
    Z.fill(14, 3, 2, 1, TL.DOORF);
    Z.fill(16, 6, 9, 1, TL.FENCE);
    Z.set(26, 4, TL.FENCE); Z.set(28, 4, TL.FENCE);
    Z.sign(21, 1, 'LA GRIETA', 2);
    Z.sign(2, 7, 'BUS 14', 1);
    Z.sign(9, 2, '22:00 - 08:00', 1);
    Z.light(27, 5, 60).light(8, 6, 50).light(20, 7, 70);
    Z.door(27, 3, 1, 1, 'foyer', 4, 12, 'u', { id: 'door_in', when: F('bouncer_ok'), locked: T('The door is closed. The bouncer has the last word.', 'La puerta está cerrada. Manda el de la puerta.', 'A porta está fechada. Quem manda é o segurança.') });
    Z.door(14, 3, 2, 1, 'backstage', 2, 2, 'd', { id: 'door_doors_bs', when: bsGate, locked: bsHint, label: T('STAFF DOOR — BACKSTAGE', 'PUERTA DE STAFF — BACKSTAGE', 'PORTA DO STAFF — BACKSTAGE') });
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
    Z.fill(8, 2, 3, 1, TL.COATRACK); Z.set(18, 2, TL.RADIATOR);
    Z.fill(10, 9, 3, 1, TL.BENCH); Z.set(1, 11, TL.PLANT); Z.set(26, 12, TL.PLANT);
    Z.set(24, 12, TL.ARMCHAIR); Z.set(25, 12, TL.OTTOMAN);
    Z.obj({ id: 'foyer_coatstand', kind: 'coat_stand', x: 1, y: 10, w: 1, h: 1, decor: true });
    Z.fill(21, 2, 3, 1, TL.STAIRS);
    Z.set(13, 1, TL.DOORF); Z.set(14, 1, TL.DOORF); Z.set(4, 13, TL.DOORF);
    Z.fill(21, 1, 3, 1, TL.DOORF);
    Z.set(27, 5, TL.DOORF); Z.set(27, 6, TL.DOORF); Z.set(27, 7, TL.DOORF); Z.set(27, 10, TL.DOORF); Z.set(0, 8, TL.DOORF);
    Z.sign(12, 3, 'DANCE', 1).sign(23, 4, 'SALA 2', 1).sign(24, 6, 'WC >', 1).sign(23, 11, 'SMOKING >', 1).sign(1, 6, '< QUIET ROOM', 1);
    Z.door(13, 1, 2, 1, 'main', 21, 29, 'u', { id: 'door_main' });
    Z.door(4, 13, 1, 1, 'doors', 25, 8, 'd', { id: 'door_street' });
    Z.door(27, 5, 1, 1, 'restrooms', 2, 12, 'r', { id: 'door_wc' });
    Z.door(27, 6, 1, 2, 'backstage', 6, 2, 'd', { id: 'door_foyer_bs', when: bsGate, locked: bsHint, label: T('STAFF DOOR — BACKSTAGE', 'PUERTA DE STAFF — BACKSTAGE', 'PORTA DO STAFF — BACKSTAGE') });
    Z.door(27, 10, 1, 1, 'tunnel', 2, 4, 'r', { id: 'door_tunnel' });
    Z.door(0, 8, 1, 1, 'welfare', 19, 7, 'l', { id: 'door_welfare' });
    Z.door(21, 1, 3, 2, 'attic', 3, 20, 'u', { id: 'door_attic', when: function (s) { return s.time >= 180; }, locked: T('SALA 2 opens at 01:00. The stairs have a chain across them.', 'SALA 2 abre a la 1:00. Hay una cadena cruzando la escalera.', 'A SALA 2 abre à 1:00. Tem uma corrente atravessando a escada.'), label: T('STAIRS UP TO SALA 2', 'ESCALERA A SALA 2', 'ESCADA PARA A SALA 2') });
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
    Z.set(15, 2, TL.SUBWOOFER); Z.set(16, 2, TL.SUBWOOFER); Z.set(31, 2, TL.SUBWOOFER);
    Z.set(8, 2, TL.LIGHTRIG); Z.set(35, 2, TL.LIGHTRIG);
    Z.fill(1, 9, 2, 4, TL.SPEAKER); Z.fill(41, 2, 2, 4, TL.SPEAKER);
    Z.set(5, 15, TL.PILLAR); Z.set(5, 20, TL.PILLAR);
    Z.fill(38, 8, 1, 13, TL.BAR); Z.fill(41, 8, 1, 13, TL.LOCKER); Z.set(41, 21, TL.FRIDGE);
    /* partition with three gaps */
    Z.fill(1, 23, 42, 1, TL.WALL);
    Z.fill(6, 23, 2, 1, TL.FLOOR); Z.fill(20, 23, 4, 1, TL.FLOOR); Z.fill(33, 23, 2, 1, TL.FLOOR);
    /* toilet nook */
    Z.fill(41, 25, 2, 1, TL.WALL); Z.fill(41, 27, 2, 1, TL.WALL);
    Z.set(43, 26, TL.DOORF); Z.set(21, 31, TL.DOORF); Z.set(22, 31, TL.DOORF);
    Z.set(0, 26, TL.CURTAIN); Z.set(33, 1, TL.DOORF); Z.set(27, 1, TL.DOORF); Z.set(28, 1, TL.DOORF);
    Z.set(39, 6, TL.STAIRS); Z.set(39, 7, TL.STAIRS);
    Z.sign(21, 25, 'EXIT', 1).sign(39, 24, 'WC >', 1).sign(1, 24, '< DARK ROOM', 1).sign(31, 4, 'STAFF', 1).sign(27, 4, 'ROOF', 1);
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
    Z.door(39, 6, 1, 2, 'attic', 3, 12, 'l', { id: 'door_main_attic', when: function (s) { return s.time >= 180; }, locked: T('SALA 2 opens at 01:00. The stairs have a chain across them.', 'SALA 2 abre a la 1:00. Hay una cadena cruzando la escalera.', 'A SALA 2 abre à 1:00. Tem uma corrente atravessando a escada.'), label: T('STAIRS UP TO SALA 2', 'ESCALERA A SALA 2', 'ESCADA PARA A SALA 2') });
    /* roof stairs to the right of the DJ booth: the same closing-set door as the attic and backstage ones */
    Z.door(27, 1, 2, 1, 'rooftop', 24, 11, 'u', { id: 'door_roof3', when: F('roof_open'), locked: T('The roof stairs next to the booth are chained. The closing set opens them.', 'La escalera al techo junto a la cabina tiene cadena. El set de cierre la abre.', 'A escada do terraço ao lado da cabine está acorrentada. O set de encerramento abre ela.') });
    Z.door(33, 1, 1, 1, 'backstage', 2, 4, 'r', { id: 'door_backstage', when: bsGate, locked: bsHint, caught: 'beatriz_catch', label: T('STAFF DOOR — BACKSTAGE', 'PUERTA DE STAFF — BACKSTAGE', 'PORTA DO STAFF — BACKSTAGE') });
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
    Z.obj({ id: 'main_vinyl', kind: 'vinyl_crate', x: 25, y: 5, w: 1, h: 1, decor: true });
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
    /* full un-cut vanity mirror & sink bank (cols 5, 9..12 kept) + side mirror bay (cols 15, 17, 19 kept) */
    Z.fill(5, 1, 8, 1, TL.MIRROR); Z.fill(5, 2, 8, 1, TL.SINK);
    Z.fill(15, 1, 5, 1, TL.MIRROR);
    /* partition wall dividing vanity/queue from cubicle bay */
    Z.fill(20, 2, 1, 8, TL.WALL); Z.fill(20, 12, 1, 9, TL.WALL);
    /* 3 crisp restroom cubicles (y=2..5): stainless steel dividers, porcelain toilets at back, stall doors at front */
    [22, 25, 28, 31].forEach(function (x) { Z.fill(x, 2, 1, 4, TL.STALL); });
    Z.set(23, 2, TL.TOILET); Z.set(26, 2, TL.TOILET); Z.set(29, 2, TL.TOILET);
    Z.fill(26, 5, 2, 1, TL.STALL); Z.fill(29, 5, 2, 1, TL.STALL);
    /* waiting bench & corner greenery / maintenance fixtures well clear of queues and doors */
    Z.set(1, 17, TL.BENCH); Z.set(1, 19, TL.PLANT);
    Z.set(32, 14, TL.BENCH); Z.set(32, 19, TL.PLANT);
    Z.obj({ id: 'wc_dryer1', kind: 'hand_dryer', x: 1, y: 2, w: 1, h: 1, decor: true });
    Z.obj({ id: 'wc_dryer2', kind: 'hand_dryer', x: 19, y: 4, w: 1, h: 1, decor: true });
    Z.obj({ id: 'wc_mop1', kind: 'mop_bucket', x: 1, y: 14, w: 1, h: 1, decor: true });
    Z.obj({ id: 'wc_mop2', kind: 'mop_bucket', x: 21, y: 19, w: 1, h: 1, decor: true });
    Z.set(0, 12, TL.DOORF); Z.set(10, 21, TL.DOORF); Z.set(11, 21, TL.DOORF); Z.set(0, 5, TL.DOORF);
    Z.sign(21, 11, 'ALL GENDERS', 1).sign(1, 8, 'STAFF ONLY', 1).sign(12, 19, 'MAIN >', 1);
    Z.door(0, 12, 1, 1, 'foyer', 25, 5, 'l', { id: 'door_foyer2' });
    Z.door(10, 21, 2, 1, 'main', 42, 26, 'l', { id: 'door_main2' });
    Z.door(0, 5, 1, 1, 'backstage', 7, 10, 'u', { id: 'door_service', when: F('rosa_ally'), locked: T('STAFF ONLY. The door is locked. Rosa has the key.', 'SOLO STAFF. La puerta tiene llave. Rosa la tiene.', 'SÓ STAFF. A porta está trancada. A Rosa tem a chave.'), label: T('STAFF DOOR — BACKSTAGE', 'PUERTA DE STAFF — BACKSTAGE', 'PORTA DO STAFF — BACKSTAGE') });
    Z.npc({ id: 'host', cast: 'mika', x: 20.5, y: 11, box: { w: 1, h: 2 }, dlg: 'host', gate: true, reach: 26, dir: 'r', when: function (s) { return !s.res.host; } });
    Z.npc({ id: 'host_side', cast: 'mika', x: 19, y: 12.5, dir: 'r', decor: true, when: function (s) { return !!s.res.host; } });
    Z.npc({ id: 'marga', x: 19, y: 10.5, dlg: 'marga', dir: 'r', reach: 14, when: NF('marga_done') });
    Z.npc({ id: 'ezra', x: 17, y: 10.5, dlg: 'ezra', dir: 'r', reach: 14 });
    Z.npc({ id: 'qwait1', pair: ['qpair1', 'qpair2'], x: 15, y: 10.5, dlg: 'queue_pair', dir: 'r', reach: 16 });
    Z.npc({ id: 'broh_q', pair: ['broh', 'brohF1'], x: 13, y: 10.5, dlg: 'broh_queue', dir: 'r', reach: 22, when: function (s) { return !!s.flags.broh_hostile; } });
    Z.npc({ id: 'rosa', x: 9, y: 7, dlg: function (s) { return s.flags.rosa_met ? 'rosa_again' : 'rosa_wait'; }, dir: 'd', reach: 18, when: function (s) { return !(s.quests.q4 === 'active' && !s.flags.rosa_met) || true; } });
    Z.obj({ id: 'sinks', kind: 'water', x: 5, y: 3, w: 8, h: 1, label: T('SINKS', 'LAVAMANOS', 'PIAS') });
    Z.obj({ id: 'stall_door', kind: 'stall', x: 23, y: 5, w: 2, h: 1, label: T('FREE STALL', 'CABINA LIBRE', 'CABINE LIVRE'), when: function (s) { return !!s.res.host && s.quests.q3 !== 'done'; } });
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
    Z.fill(25, 4, 1, 2, TL.DOORF);
    Z.sign(8, 15, 'ASK FIRST', 1).sign(14, 15, 'NO MEANS NO', 1).sign(19, 10, 'SLOW DOWN', 1);
    Z.light(6, 4, 46).light(18, 6, 56).light(13, 14, 46).light(8, 12, 40);
    Z.door(13, 17, 1, 1, 'main', 1, 26, 'r', { id: 'door_main3' });
    Z.door(25, 4, 1, 2, 'backstage', 2, 8, 'r', { id: 'door_dark_bs', when: bsGate, locked: bsHint, label: T('STAFF DOOR — BACKSTAGE', 'PUERTA DE STAFF — BACKSTAGE', 'PORTA DO STAFF — BACKSTAGE') });
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
    Z.fill(29, 7, 2, 1, TL.DOORF);
    Z.light(4, 4, 34).light(20, 4, 36).light(32, 4, 36).light(40, 4, 34).light(23, 2, 22);
    Z.door(0, 4, 1, 1, 'foyer', 26, 10, 'l', { id: 'door_foyer3' });
    Z.door(43, 4, 1, 1, 'courtyard', 2, 11, 'r', { id: 'door_court' });
    Z.door(29, 7, 2, 1, 'backstage', 19, 10, 'u', { id: 'door_tunnel_bs', when: bsGate, locked: bsHint, label: T('STAFF DOOR — BACKSTAGE', 'PUERTA DE STAFF — BACKSTAGE', 'PORTA DO STAFF — BACKSTAGE') });
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
    Z.fill(0, 3, 1, 2, TL.DOORF);
    [[6, 5], [9, 5], [22, 20], [26, 20], [30, 6], [4, 21]].forEach(function (b) { Z.set(b[0], b[1], TL.BENCH); });
    [[14, 15], [28, 12], [10, 20], [33, 15]].forEach(function (b) { Z.set(b[0], b[1], TL.BARREL); });
    Z.set(36, 3, TL.CRATE); Z.set(37, 3, TL.CRATE); Z.set(2, 3, TL.PLANT); Z.set(37, 22, TL.PLANT);
    Z.sign(17, 1, 'QUIET ROOM', 1).sign(35, 11, 'EXIT >', 1);
    Z.light(14, 15, 60).light(28, 12, 60).light(10, 20, 50).light(33, 15, 50).light(20, 3, 40).light(2, 11, 40);
    Z.door(0, 11, 1, 1, 'tunnel', 41, 4, 'l', { id: 'door_tunnel2' });
    Z.door(0, 3, 1, 2, 'backstage', 25, 5, 'l', { id: 'door_court_bs', when: bsGate, locked: bsHint, label: T('STAFF DOOR — BACKSTAGE', 'PUERTA DE STAFF — BACKSTAGE', 'PORTA DO STAFF — BACKSTAGE') });
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
    /* warm acoustic dark floor + woven lounge rugs (no more cold cyan bathroom tile!) */
    Z.room(0, 0, 22, 14, TL.FLOOR);
    Z.fill(1, 7, 9, 6, TL.RUG);
    Z.fill(10, 7, 9, 6, TL.RUG);
    /* contiguous recovery daybed block + calm reading / resting corner */
    Z.fill(2, 8, 7, 4, TL.MATT);
    Z.set(1, 11, TL.PLANT); Z.set(1, 5, TL.ARMCHAIR);
    Z.set(2, 2, TL.RADIATOR); Z.set(5, 2, TL.BOOKSHELF); Z.set(7, 2, TL.PLANT);
    /* harm-reduction check-in table + tea & water care table (replacing industrial crates) */
    Z.fill(13, 4, 4, 1, TL.TABLE); Z.fill(18, 4, 2, 1, TL.TABLE); Z.set(20, 2, TL.PLANT);
    /* lounge armchair, ottoman & radiator */
    Z.set(12, 11, TL.ARMCHAIR); Z.set(13, 11, TL.OTTOMAN); Z.set(18, 12, TL.RADIATOR);
    /* cozy lamps, herbal tea urn, first-aid kit, wall art */
    Z.obj({ id: 'welfare_lamp', kind: 'lamp', x: 13, y: 4, w: 1, h: 1, decor: true });
    Z.obj({ id: 'welfare_aid', kind: 'first_aid', x: 14, y: 4, w: 1, h: 1, decor: true });
    Z.obj({ id: 'welfare_tea', kind: 'tea_urn', x: 18, y: 4, w: 1, h: 1, decor: true });
    Z.obj({ id: 'welfare_candle', kind: 'candle_table', x: 11, y: 11, w: 1, h: 1, decor: true });
    Z.obj({ id: 'welfare_lamp2', kind: 'lamp', x: 1, y: 6, w: 1, h: 1, decor: true });
    Z.obj({ id: 'welfare_art1', kind: 'wall_art', x: 8, y: 1, w: 1, h: 1, decor: true });
    Z.obj({ id: 'welfare_art2', kind: 'wall_art', x: 16, y: 1, w: 1, h: 1, decor: true });
    Z.set(21, 7, TL.DOORF); Z.set(11, 1, TL.DOORF);
    Z.fill(21, 4, 1, 2, TL.DOORF);
    Z.sign(13, 2, 'CHECK', 1).sign(2, 7, 'REST', 1).sign(17, 6, 'WATER', 1);
    Z.door(21, 7, 1, 1, 'foyer', 2, 8, 'r', { id: 'door_foyer4' });
    Z.door(21, 4, 1, 2, 'backstage', 25, 8, 'l', { id: 'door_welfare_bs', when: bsGate, locked: bsHint, label: T('STAFF DOOR — BACKSTAGE', 'PUERTA DE STAFF — BACKSTAGE', 'PORTA DO STAFF — BACKSTAGE') });
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

    /* ---- Sculpted 26x12 Industrial Dancefloor & Sound Stacks ---- */
    Z.fill(6, 6, 26, 12, TL.DANCE);
    Z.set(5, 6, TL.PILLAR).set(32, 6, TL.PILLAR).set(5, 17, TL.PILLAR).set(32, 17, TL.PILLAR);
    Z.set(12, 5, TL.LIGHTRIG).set(25, 5, TL.LIGHTRIG);
    /* West stacks: y=10..13 open for door_attic_main */
    Z.fill(1, 6, 2, 3, TL.SPEAKER).fill(1, 9, 2, 1, TL.SUBWOOFER);
    Z.fill(1, 14, 2, 1, TL.SUBWOOFER).fill(1, 15, 2, 3, TL.SPEAKER);
    /* East stacks: y=12..15 open for door_attic_bs; (34,9) clear for find_sg_attic */
    Z.fill(36, 8, 2, 1, TL.SUBWOOFER).fill(36, 9, 2, 3, TL.SPEAKER);

    /* ---- Elevated Northeast DJ Booth & Sound Stage ---- */
    Z.fill(34, 2, 5, 3, TL.BOOTH).fill(34, 5, 5, 1, TL.TABLE);
    Z.set(33, 2, TL.LIGHTRIG).set(39, 2, TL.LIGHTRIG);
    Z.set(39, 3, TL.FRIDGE);
    Z.set(33, 4, TL.SUBWOOFER).set(33, 5, TL.SUBWOOFER);
    Z.set(39, 4, TL.SUBWOOFER).set(39, 5, TL.SUBWOOFER);

    /* ---- Northwest Velvet Bass Lounge ---- */
    Z.fill(2, 2, 3, 3, TL.RUG);
    Z.set(1, 2, TL.PLANT).set(1, 3, TL.RADIATOR);
    Z.fill(2, 2, 2, 1, TL.COUCH).set(4, 2, TL.TABLE);
    Z.set(4, 3, TL.ARMCHAIR).set(3, 4, TL.OTTOMAN);

    /* ---- North Dubplate Bar ((9.5, 4.2) clear for celeste) ---- */
    Z.fill(7, 1, 3, 1, TL.MIRROR);
    Z.set(6, 2, TL.FRIDGE).fill(7, 2, 5, 1, TL.BAR).set(12, 2, TL.PLANT);

    /* ---- North-East Listening Lounge ((20,1..2) & (22.5, 4.2) clear) ---- */
    Z.fill(24, 2, 6, 2, TL.RUG);
    Z.fill(25, 2, 3, 1, TL.COUCH).set(28, 2, TL.TABLE).set(29, 2, TL.ARMCHAIR).set(30, 2, TL.PLANT);
    Z.set(24, 3, TL.ARMCHAIR).set(26, 3, TL.OTTOMAN);

    /* ---- Southwest Hazel Nook ---- */
    Z.fill(6, 19, 4, 3, TL.RUG);
    Z.set(1, 19, TL.RADIATOR).set(1, 20, TL.ARMCHAIR).set(1, 21, TL.TABLE).set(1, 22, TL.PLANT);
    Z.set(8, 22, TL.OTTOMAN).set(9, 22, TL.PLANT);

    /* ---- South-Center Couch Row ---- */
    Z.fill(17, 19, 7, 2, TL.RUG);
    Z.set(18, 19, TL.OTTOMAN).set(20, 19, TL.TABLE).set(22, 19, TL.OTTOMAN);
    Z.set(12, 22, TL.RADIATOR).fill(13, 22, 3, 1, TL.COUCH).set(16, 22, TL.TABLE);
    Z.fill(18, 22, 4, 1, TL.COUCH).set(22, 22, TL.TABLE);
    Z.fill(24, 22, 3, 1, TL.COUCH).set(27, 22, TL.PLANT).set(28, 22, TL.RADIATOR);

    /* ---- Southeast Afterhours Chill Alcove ---- */
    Z.fill(33, 19, 5, 3, TL.RUG);
    Z.set(38, 18, TL.PLANT).set(38, 19, TL.TABLE).set(38, 20, TL.ARMCHAIR).set(38, 21, TL.ARMCHAIR).set(38, 22, TL.RADIATOR);
    Z.set(33, 22, TL.TABLE).fill(34, 22, 3, 1, TL.COUCH).set(35, 20, TL.OTTOMAN);

    /* ---- Doors, Stairs & Signage ---- */
    Z.set(3, 22, TL.STAIRS).set(3, 23, TL.DOORF).set(20, 1, TL.DOORF);
    Z.set(0, 12, TL.STAIRS).set(0, 13, TL.STAIRS);
    Z.fill(39, 13, 1, 2, TL.DOORF);
    Z.sign(4, 20, 'DOWN', 1).sign(18, 2, 'BALCONY', 1);
    Z.light(18, 11, 95).light(36, 3, 55).light(9, 3, 45).light(27, 3, 40).light(3, 3, 40).light(20, 20, 45).light(35, 20, 40);
    Z.door(3, 23, 1, 1, 'foyer', 22, 3, 'd', { id: 'door_foyer5' });
    Z.door(0, 12, 1, 2, 'main', 37, 6, 'r', { id: 'door_attic_main', label: T('STAIRS DOWN TO MAIN FLOOR', 'ESCALERA A LA PISTA PRINCIPAL', 'ESCADA PARA A PISTA PRINCIPAL') });
    Z.door(39, 13, 1, 2, 'backstage', 19, 2, 'd', { id: 'door_attic_bs', when: bsGate, locked: bsHint, label: T('STAFF DOOR — BACKSTAGE', 'PUERTA DE STAFF — BACKSTAGE', 'PORTA DO STAFF — BACKSTAGE') });
    Z.door(20, 1, 1, 1, 'rooftop', 4, 11, 'u', { id: 'door_roof', when: F('roof_open'), locked: T('The balcony door is chained. Someone upstairs decides when it opens.', 'La puerta del balcón tiene cadena. Alguien arriba decide cuándo abre.', 'A porta da sacada está acorrentada. Alguém lá em cima decide quando abre.') });

    /* ---- Crowd Zones ---- */
    Z.crowdRect(6, 6, 26, 12, 3);
    Z.crowdRect(14, 9, 10, 6, 1);

    /* ---- NPCs & Dynamic Room 2 DJ Shift ---- */
    Z.npc({ id: 'hazel', x: 8, y: 20.5, dlg: 'hazel', dir: 'r', reach: 16 });
    Z.npc({ id: 'cult', ring: ['stomp3', 'stomp1', 'stomp4', 'stomp2', 'oz'], x: 19, y: 11.5, box: { w: 3, h: 2 }, dlg: 'cult', gate: false, reach: 34, dir: 'd' });
    Z.npc({ id: 'oz', x: 31, y: 20.5, dlg: 'oz', dir: 'l', reach: 16 });
    Z.npc({ id: 'frames_attic', cast: 'frames', x: 36.5, y: 4.4, dir: 'd', pose: 'dance', reach: 32, dlg: 'frames_attic', when: function (s) { return s.time < 270 && !s.flags.roof_open; } });
    Z.npc({ id: 'apud_attic', cast: 'apud', x: 36.5, y: 4.4, dir: 'd', pose: 'dance', reach: 32, dlg: 'apud_attic', when: function (s) { return s.time >= 270 && !s.flags.roof_open; } });

    /* ---- Dance Spots & Interactive / Architectural Props ---- */
    [[10, 9], [26, 9], [10, 15], [27, 15]].forEach(function (p, i) { Z.obj({ id: 'dance_attic_' + i, kind: 'dance', x: p[0], y: p[1], w: 1, h: 1, label: T('DANCE', 'BAILAR', 'DANÇAR') }); });
    Z.obj({ id: 'water_attic', kind: 'water', x: 7, y: 2, w: 1, h: 1, label: T('WATER STATION', 'ESTACIÓN DE AGUA', 'ESTAÇÃO DE ÁGUA') });
    Z.obj({ id: 'attic_synth', kind: 'synth_rack', x: 34, y: 5, w: 1, h: 1, decor: true });
    Z.obj({ id: 'dj_attic', kind: 'DJ', x: 35, y: 5, w: 1, h: 1, dlg: 'attic_booth_inspect', label: T('THE BOOTH', 'LA CABINA', 'A CABINE') });
    Z.obj({ id: 'attic_decks', kind: 'DJ', x: 36, y: 5, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_vinyl', kind: 'vinyl_crate', x: 38, y: 5, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_booth_water', kind: 'water', x: 37, y: 5, w: 1, h: 1, label: T('BOOTH WATER', 'AGUA DE CABINA', 'ÁGUA DA CABINE') });
    Z.obj({ id: 'attic_art_bar', kind: 'wall_art', x: 10, y: 1, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_art_ne', kind: 'wall_art', x: 26, y: 1, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_lava_nw', kind: 'lava_lamp', x: 4, y: 2, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_vinyl_ne', kind: 'vinyl_crate', x: 28, y: 2, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_lava_sw', kind: 'lava_lamp', x: 1, y: 21, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_candle_c', kind: 'candle_table', x: 20, y: 19, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_candle_sc', kind: 'candle_table', x: 16, y: 22, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_lava_sc', kind: 'lava_lamp', x: 22, y: 22, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_candle_se', kind: 'candle_table', x: 38, y: 19, w: 1, h: 1, decor: true });
    Z.obj({ id: 'attic_lava_se', kind: 'lava_lamp', x: 33, y: 22, w: 1, h: 1, decor: true });

    Z.friend('attic', 22, 14).friend('default', 6, 20);
  })();

  /* ============================================================ 10. BACKSTAGE */
  (function () {
    const Z = new Zone('backstage', 28, 12, { theme: { a: '#FFB020', b: '#FF6A00' }, name: T('BACKSTAGE', 'BACKSTAGE', 'BACKSTAGE'), audio: { lp: 1200, wet: 0.12, style: 'auto' }, dark: 0.1, quiet: 0.1 });
    Z.room(0, 0, 28, 12, TL.RUG);
    Z.fill(10, 8, 3, 1, TL.COUCH); Z.fill(20, 3, 3, 1, TL.CRATE); Z.fill(16, 5, 2, 1, TL.TABLE);
    Z.set(9, 2, TL.ARMCHAIR); Z.set(11, 2, TL.RADIATOR); Z.set(14, 2, TL.LIGHTRIG); Z.set(15, 2, TL.FRIDGE); Z.set(9, 8, TL.OTTOMAN);
    Z.obj({ id: 'bs_synth', kind: 'synth_rack', x: 16, y: 4, w: 1, h: 1, decor: true });
    Z.obj({ id: 'bs_lava', kind: 'lava_lamp', x: 17, y: 4, w: 1, h: 1, decor: true });
    Z.obj({ id: 'bs_vinyl', kind: 'vinyl_crate', x: 13, y: 7, w: 1, h: 1, decor: true });
    /* Top (y=1): doors (2..3), foyer (6..7), attic (19..20), rooftop (24..25 + stairs y=2) */
    Z.fill(2, 1, 2, 1, TL.DOORF); Z.fill(6, 1, 2, 1, TL.DOORF); Z.fill(19, 1, 2, 1, TL.DOORF);
    Z.fill(24, 1, 2, 1, TL.DOORF); Z.fill(24, 2, 2, 1, TL.STAIRS);
    /* Left (x=0): main (4..5), darkroom (8..9) */
    Z.fill(0, 4, 1, 2, TL.DOORF); Z.fill(0, 8, 1, 2, TL.DOORF);
    /* Right (x=27): courtyard (4..5), welfare (8..9) */
    Z.fill(27, 4, 1, 2, TL.DOORF); Z.fill(27, 8, 1, 2, TL.DOORF);
    /* Bottom (y=11): restrooms (6..7), tunnel (19..20) */
    Z.fill(6, 11, 2, 1, TL.DOORF); Z.fill(19, 11, 2, 1, TL.DOORF);
    Z.sign(22, 2, 'ROOF', 1).sign(2, 9, 'STAGE', 1);
    Z.door(2, 1, 2, 1, 'doors', 14, 4, 'd', { id: 'door_bs_doors', label: T('SERVICE EXIT — STREET', 'SALIDA DE SERVICIO — CALLE', 'SAÍDA DE SERVIÇO — RUA') });
    Z.door(6, 1, 2, 1, 'foyer', 25, 6, 'l', { id: 'door_bs_foyer', label: T('STAFF DOOR — FOYER', 'PUERTA DE STAFF — FOYER', 'PORTA DO STAFF — FOYER') });
    Z.door(19, 1, 2, 1, 'attic', 37, 13, 'l', { id: 'door_bs_attic', label: T('STAFF STAIRS — SALA 2', 'ESCALERA DE STAFF — SALA 2', 'ESCADA DO STAFF — SALA 2') });
    Z.door(24, 1, 2, 1, 'rooftop', 14, 11, 'u', { id: 'door_roof2', when: F('roof_open'), locked: T('The roof stairs are chained. ÆRIEL has the key.', 'La escalera al techo tiene cadena. ÆRIEL tiene la llave.', 'A escada do terraço está acorrentada. ÆRIEL tem a chave.'), label: T('STAIRS TO THE ROOFTOP', 'ESCALERA A LA AZOTEA', 'ESCADA PARA O TERRAÇO') });
    Z.door(0, 4, 1, 2, 'main', 33, 3, 'd', { id: 'door_main4', label: T('STAGE DOOR — MAIN FLOOR', 'PUERTA DEL ESCENARIO — PISTA PRINCIPAL', 'PORTA DO PALCO — PISTA PRINCIPAL') });
    Z.door(0, 8, 1, 2, 'darkroom', 23, 4, 'l', { id: 'door_bs_darkroom', label: T('CORRIDOR — DARK ROOM', 'PASILLO — CUARTO OSCURO', 'CORREDOR — DARK ROOM') });
    Z.door(27, 4, 1, 2, 'courtyard', 2, 4, 'r', { id: 'door_bs_courtyard', label: T('SIDE DOOR — SMOKING AREA', 'PUERTA LATERAL — PATIO', 'PORTA LATERAL — PÁTIO') });
    Z.door(27, 8, 1, 2, 'welfare', 20, 4, 'l', { id: 'door_bs_welfare', label: T('STAFF DOOR — QUIET ROOM', 'PUERTA DE STAFF — SALA TRANQUILA', 'PORTA DO STAFF — SALA CALMA') });
    Z.door(6, 11, 2, 1, 'restrooms', 2, 5, 'r', { id: 'door_service2', label: T('SERVICE CORRIDOR — TOILETS', 'PASILLO DE SERVICIO — BAÑOS', 'CORREDOR DE SERVIÇO — BANHEIROS') });
    Z.door(19, 11, 2, 1, 'tunnel', 29, 6, 'u', { id: 'door_bs_tunnel', label: T('UTILITY HATCH — TUNNEL', 'ESCOTILLA TÉCNICA — TÚNEL', 'ESCOTILHA TÉCNICA — TÚNEL') });
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
    Z.set(14, 13, TL.DOORF); Z.set(4, 12, TL.DOORF); Z.set(24, 13, TL.DOORF);
    Z.fill(22, 4, 2, 1, TL.CRATE); Z.fill(5, 5, 1, 1, TL.BARREL); Z.set(25, 9, TL.BENCH); Z.set(26, 9, TL.BENCH);
    Z.door(14, 13, 1, 1, 'backstage', 24, 3, 'd', { id: 'door_bs2' });
    Z.door(4, 12, 1, 1, 'attic', 20, 2, 'd', { id: 'door_attic2' });
    Z.door(24, 13, 1, 1, 'main', 27, 3, 'd', { id: 'door_main_roof' });
    Z.light(5, 5, 50);
    Z.obj({ id: 'sunrise_spot', kind: 'sunrise', x: 13, y: 5, w: 4, h: 3, label: T('WATCH THE SUNRISE', 'VER EL AMANECER', 'VER O AMANHECER'), when: function (s) { return s.quests.q9 === 'active'; } });
    Z.friend('default', 10, 8);
  })();
})();

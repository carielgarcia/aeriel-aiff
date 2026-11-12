/* EXCUSE ME — story v29, part 1: THE AFTER. The same night, the same save: after the sunrise on the roof the hosts (Anselm and Dot) take
   whoever has energy left to their flat. This file holds the plumbing: the six rooms, the guests who turn up (seeded from your night),
   the NOISE bar (the neighbours), who leaves and when, the sunrise choice, the new ending, and the host rule (a warning, then OUT).
   Missions and scenes are in story_v29b.js, the master bedroom, the phone and the morning in story_v29c.js. Nothing here rebuilds an
   existing mechanic: bars, drugs, items, seekers, quests and the morning thread are reused as they are. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine, TL = EM.TL;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story, Zone = EM.Zone;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const look = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  function cast(id, name, o) { EM.CAST[id] = { name: name, look: look(o) }; }
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };
  const NF = function (f) { return function (s) { return !s.flags[f]; }; };
  const AF = EM.AF = {};
  const FR = ['maru', 'dani', 'tato'];

  /* ============================================================ new people (Anselm and Dot already exist: story_v23.js) */
  cast('lio', 'LIO', { skin: 3, hair: 1, hc: 0, expr: 4, top: 1, tc: 5, bottom: 1, bc: 2 });
  cast('pasc', 'PASC', { skin: 1, hair: 5, hc: 2, expr: 3, top: 7, tc: 3, bottom: 0, bc: 4, acc: 1 });
  cast('mo', 'MO', { skin: 4, hair: 6, hc: 0, expr: 1, top: 6, tc: 6, bottom: 3, bc: 3, acc: 4 });
  cast('beto', 'BETO', { skin: 2, hair: 0, hc: 0, expr: 0, top: 10, tc: 7, bottom: 1, bc: 1 });
  cast('remedios', 'DOÑA REMEDIOS', { skin: 1, hair: 3, hc: 9, expr: 1, top: 7, tc: 10, bottom: 0, bc: 8 });
  cast('marcos', 'MARCOS', { skin: 0, hair: 2, hc: 3, expr: 0, top: 1, tc: 1, bottom: 1, bc: 4, acc: 2 });
  cast('quiroga', 'SR. QUIROGA', { skin: 2, hair: 0, hc: 5, expr: 0, top: 8, tc: 4, bottom: 1, bc: 1, wide: true });
  cast('tomi', 'TOMI', { skin: 3, hair: 4, hc: 1, expr: 4, top: 9, tc: 2, bottom: 2, bc: 1 });
  cast('sam', 'SAM', { skin: 1, hair: 7, hc: 6, expr: 4, top: 3, tc: 0, bottom: 1, bc: 1 });
  cast('rey', 'REY', { skin: 3, hair: 2, hc: 0, expr: 5, top: 4, tc: 9, bottom: 1, bc: 4 });
  cast('vik', 'VIK', { skin: 0, hair: 8, hc: 4, expr: 3, top: 5, tc: 8, bottom: 0, bc: 3 });
  cast('pax', 'PAX', { skin: 2, hair: 2, hc: 1, expr: 1, top: 0, tc: 6, bottom: 1, bc: 1 });
  cast('nell', 'NELL', { skin: 1, hair: 6, hc: 7, expr: 1, top: 6, tc: 3, bottom: 3, bc: 1, acc: 3 });
  cast('river', 'RIVER', { skin: 4, hair: 3, hc: 0, expr: 4, top: 2, tc: 8, bottom: 1, bc: 3 });
  cast('noor', 'NOOR', { skin: 2, hair: 4, hc: 2, expr: 3, top: 3, tc: 9, bottom: 1, bc: 1, acc: 1 });
  cast('cosmo', 'COSMO', { skin: 0, hair: 1, hc: 2, expr: 2, top: 5, tc: 9, bottom: 1, bc: 4, acc: 2 });

  /* ============================================================ the six rooms (daylight, quiet records) */
  const WARM = { a: '#FFB020', b: '#FF7AB8' };
  const mk = function (id, w, h, name, extra) {
    const z = new Zone(id, w, h, Object.assign({ theme: WARM, name: name, audio: { lp: 1500, wet: 0.1, style: 'closing' }, dark: 0 }, extra || {}));
    return z;
  };
  const NAME = {
    a_living: t('THE FLAT // LIVING ROOM', 'EL DEPARTAMENTO // SALA', 'O APÊ // SALA'),
    a_kitchen: t('THE FLAT // KITCHEN', 'EL DEPARTAMENTO // COCINA', 'O APÊ // COZINHA'),
    a_bedroom: t('THE FLAT // THE COATS', 'EL DEPARTAMENTO // LOS ABRIGOS', 'O APÊ // OS CASACOS'),
    a_bath: t('THE FLAT // BATHROOM', 'EL DEPARTAMENTO // BAÑO', 'O APÊ // BANHEIRO'),
    a_balcony: t('THE FLAT // BALCONY', 'EL DEPARTAMENTO // BALCÓN', 'O APÊ // VARANDA'),
    a_master: t('THE FLAT // MASTER BEDROOM', 'EL DEPARTAMENTO // DORMITORIO PRINCIPAL', 'O APÊ // QUARTO PRINCIPAL')
  };
  /* walls, then the floor: a home, in daylight (the home tileset in tiles.js; no neon, no dim lights) */
  const home = function (Z, w, h, floor) { Z.fill(0, 0, w, h, TL.HWALL); Z.fill(1, 2, w - 2, h - 3, floor); return Z; };
  const FLAT = ['a_living', 'a_kitchen', 'a_bedroom', 'a_bath', 'a_balcony', 'a_master'];
  AF.isFlat = function (z) { return FLAT.indexOf(z) !== -1; };

  /* living room: records, sofa, rug, the front door, five doors in the walls */
  (function () {
    const Z = mk('a_living', 28, 16, NAME.a_living);
    home(Z, 28, 16, TL.HFLOOR);
    Z.fill(6, 6, 14, 6, TL.HRUG);
    Z.fill(3, 3, 5, 1, TL.HCOUCH); Z.fill(20, 3, 4, 1, TL.HTABLE); Z.set(19, 3, TL.HSPEAKER); Z.set(24, 3, TL.HSPEAKER);
    Z.set(1, 13, TL.HPLANT); Z.set(26, 13, TL.HPLANT);
    Z.set(27, 8, TL.HDOOR); Z.set(8, 1, TL.HDOOR); Z.set(14, 1, TL.HDOOR); Z.set(22, 1, TL.HDOOR); Z.set(0, 8, TL.HDOOR); Z.set(13, 15, TL.HDOOR);
    Z.sign(12, 14, 'SHOES OFF', 1).sign(2, 7, '< BALCONY', 1).sign(23, 2, 'MASTER', 1).sign(26, 7, 'KITCHEN >', 1).sign(7, 2, 'COATS', 1).sign(14, 2, 'WC', 1);
    Z.door(27, 8, 1, 1, 'a_kitchen', 1, 8, 'r', { id: 'ad_kit' });
    Z.door(8, 1, 1, 1, 'a_bedroom', 7, 7, 'u', { id: 'ad_bed' });
    Z.door(14, 1, 1, 1, 'a_bath', 3, 5, 'u', { id: 'ad_bath' });
    Z.door(0, 8, 1, 1, 'a_balcony', 14, 5, 'l', { id: 'ad_balc' });
    /* the master bedroom door: free once you have heard the rules and are fit to agree; otherwise Dot walks over (story_v29c.js) */
    Z.door(22, 1, 1, 1, 'a_master', 3, 7, 'u', { id: 'ad_master', when: function (s) { return !!(s.flags.mb_met && AF.mbFit(s)); }, caught: 'af_mb_gate' });
    Z.door(13, 15, 1, 1, 'a_living', 13, 13, 'u', { id: 'ad_front', when: function () { return false; }, caught: 'af_front' });
    Z.obj({ id: 'af_records', kind: 'afrecords', x: 20, y: 3, w: 4, h: 1, label: t('THE RECORDS', 'LOS DISCOS', 'OS DISCOS') });
    Z.obj({ id: 'af_basket', kind: 'afbasket', x: 11, y: 13, w: 2, h: 1, label: t('PHONE BASKET', 'CANASTA DE CELULARES', 'CESTA DE CELULARES') });
    [[10, 8], [15, 8], [12, 10]].forEach(function (p, i) { Z.obj({ id: 'af_dance_' + i, kind: 'afdance', x: p[0], y: p[1], w: 1, h: 1, label: t('DANCE', 'BAILAR', 'DANÇAR') }); });
    Z.trig({ id: 'af_rules_trig', x: 12, y: 12, w: 3, h: 2, script: 'af_rules', when: function (s) { return !!s.flags.after_go && !s.flags.af_rules; } });
    Z.npc({ id: 'anselm', x: 21.5, y: 4.6, dlg: 'af_anselm', dir: 'd', reach: 16, when: F('after_go') });
    Z.npc({ id: 'dot_a', cast: 'dot', x: 15.5, y: 12.6, dlg: 'af_dot_door', dir: 'l', reach: 16, when: function (s) { return !!s.flags.after_go && !s.flags.af_rules; } });
    Z.npc({ id: 'dot_m', cast: 'dot', x: 20.5, y: 2.4, dlg: 'af_dot_mb', dir: 'd', reach: 16, when: F('mb_escort') });
    Z.npc({ id: 'pasc', x: 5.5, y: 4.8, dlg: 'af_pasc', dir: 'r', reach: 16, when: function (s) { return !!s.flags.after_go && !s.flags.one_done && !s.flags.pasc_spooked; } });
    Z.npc({ id: 'dot_sleep', cast: 'dot', x: 6.6, y: 4.2, dlg: 'af_dot_asleep', dir: 'd', pose: 'lie', reach: 14, when: F('dot_asleep') });
    Z.npc({ id: 'tato_sofa', cast: 'tato', x: 4.5, y: 4.2, dlg: 'af_tato_sofa', dir: 'd', pose: 'lie', reach: 16, when: F('tato_asleep') });
  })();

  /* kitchen: the aftercare, with no stand and no table of reagents */
  (function () {
    const Z = mk('a_kitchen', 14, 10, NAME.a_kitchen);
    home(Z, 14, 10, TL.HTILE);
    Z.fill(3, 2, 9, 1, TL.HCOUNTER); Z.fill(6, 5, 3, 1, TL.HTABLE); Z.set(12, 7, TL.HPLANT);
    Z.set(0, 8, TL.HDOOR);
    Z.sign(5, 1, 'TOAST', 1);
    Z.door(0, 8, 1, 1, 'a_living', 26, 8, 'l', { id: 'ad_kit_back' });
    Z.obj({ id: 'af_tap', kind: 'water', x: 3, y: 3, w: 2, h: 1, label: t('THE TAP', 'LA LLAVE', 'A TORNEIRA') });
    Z.obj({ id: 'af_toast', kind: 'aftoast', x: 9, y: 3, w: 3, h: 1, label: t('TOAST AND TEA', 'TOSTADAS Y TÉ', 'TORRADAS E CHÁ') });
    Z.obj({ id: 'af_dishes', kind: 'afdishes', x: 6, y: 3, w: 2, h: 1, label: t('THE DISHES', 'LOS PLATOS', 'A LOUÇA'), when: function (s) { return !!s.flags.af_rules && !s.flags.af_clean; } });
    Z.npc({ id: 'dot_k', cast: 'dot', x: 2.6, y: 4.8, dlg: 'af_dot_kitchen', dir: 'r', reach: 18, when: function (s) { return !!s.flags.af_rules && !s.flags.dot_asleep; } });
    Z.npc({ id: 'sam', x: 5.4, y: 7, dlg: 'af_sam', dir: 'r', reach: 16, when: function (s) { return !!s.flags.after_go && !s.flags.sam_done; } });
    Z.npc({ id: 'rey', x: 10.4, y: 6.6, dlg: 'af_rey', dir: 'l', reach: 16, when: function (s) { return !!s.flags.after_go && !s.flags.rey_done; } });
    Z.npc({ id: 'vik', x: 8.4, y: 7.6, dlg: 'af_vik', dir: 'u', reach: 16, when: function (s) { return !!s.flags.after_go && !s.flags.vik_done; } });
    Z.friend('default', 4, 6);
  })();

  /* the coats */
  (function () {
    const Z = mk('a_bedroom', 14, 10, NAME.a_bedroom, { quiet: 0.03 });
    home(Z, 14, 10, TL.HFLOOR);
    Z.fill(2, 3, 6, 3, TL.HBED); Z.fill(10, 3, 3, 2, TL.HCOATS);
    Z.set(7, 9, TL.HDOOR);
    Z.sign(10, 2, 'COATS', 1);
    Z.door(7, 9, 1, 1, 'a_living', 8, 3, 'd', { id: 'ad_bed_back' });
    Z.npc({ id: 'lio', x: 3.4, y: 4.6, dlg: 'af_lio', dir: 'd', pose: 'lie', reach: 18, when: function (s) { return !!s.flags.after_go && !s.flags.lio_done; } });
    Z.obj({ id: 'rest_bed', kind: 'rest', x: 6, y: 4, w: 2, h: 1, label: t('LIE DOWN ON THE COATS', 'ACOSTARSE SOBRE LOS ABRIGOS', 'DEITAR NOS CASACOS') });
    Z.friend('default', 9, 7);
  })();

  /* one toilet, one queue, one joke */
  (function () {
    const Z = mk('a_bath', 8, 8, NAME.a_bath);
    home(Z, 8, 8, TL.HTILE);
    Z.set(3, 2, TL.HTOILET); Z.set(5, 2, TL.HSINK); Z.set(3, 7, TL.HDOOR);
    Z.sign(2, 1, 'ONE TOILET', 1);
    Z.door(3, 7, 1, 1, 'a_living', 14, 3, 'd', { id: 'ad_bath_back' });
    Z.npc({ id: 'af_queue', cast: 'noor', x: 3.5, y: 4.6, dlg: 'af_queue', dir: 'u', reach: 18, when: F('after_go') });
    Z.friend('default', 5, 5);
  })();

  /* the balcony: the neighbours */
  (function () {
    const Z = mk('a_balcony', 16, 8, NAME.a_balcony, { outdoor: true, audio: { lp: 2400, wet: 0.2, style: 'closing' } });
    Z.fill(0, 0, 16, 8, TL.VOID); Z.fill(0, 0, 16, 2, TL.HSKY); Z.fill(0, 2, 16, 1, TL.HRAIL); Z.fill(1, 3, 14, 4, TL.HBALC);
    Z.fill(0, 3, 1, 4, TL.HRAIL); Z.fill(0, 7, 16, 1, TL.HRAIL); Z.fill(15, 3, 1, 4, TL.HRAIL); Z.set(15, 5, TL.HDOOR);
    Z.door(15, 5, 1, 1, 'a_living', 1, 8, 'r', { id: 'ad_balc_back' });
    Z.npc({ id: 'remedios', x: 4.5, y: 3.6, dlg: 'af_remedios', dir: 'd', reach: 22, when: F('after_go') });
    Z.obj({ id: 'rest_balc', kind: 'rest', x: 10, y: 6, w: 2, h: 1, label: t('SIT ON THE FLOOR', 'SENTARSE EN EL PISO', 'SENTAR NO CHÃO') });
    Z.friend('default', 9, 5);
  })();

  /* the master bedroom (designed in story_v29c.js) */
  (function () {
    const Z = mk('a_master', 14, 10, NAME.a_master, { quiet: 0.03, audio: { lp: 900, wet: 0.15, style: 'closing' } });
    home(Z, 14, 10, TL.HFLOOR);
    Z.fill(8, 3, 4, 3, TL.HBED); Z.fill(2, 3, 2, 1, TL.HCOUCH);
    Z.set(3, 9, TL.HDOOR);
    Z.sign(5, 2, 'ASK FIRST', 1).sign(6, 8, 'EVERYONE USES PROTECTION', 1);
    Z.door(3, 9, 1, 1, 'a_living', 22, 2, 'd', { id: 'ad_master_back' });
    Z.obj({ id: 'af_bowl', kind: 'afbowl', x: 1, y: 7, w: 2, h: 1, label: t('THE BOWL BY THE DOOR', 'EL BOL JUNTO A LA PUERTA', 'A TIGELA NA PORTA') });
    Z.npc({ id: 'pax', x: 7.5, y: 4.5, dlg: 'af_enc_pax', dir: 'r', reach: 14, when: function (s) { return !s.flags.pax_done; } });
    Z.npc({ id: 'nell', x: 6.6, y: 6.4, dlg: 'af_enc_nell', dir: 'u', reach: 14, when: function (s) { return !s.flags.nell_done; } });
    Z.npc({ id: 'river', x: 12.2, y: 7.2, dlg: 'af_enc_river', dir: 'l', reach: 14, when: function (s) { return !s.flags.river_done; } });
    Z.npc({ id: 'cosmo', x: 4.2, y: 5.8, dlg: 'af_enc_cosmo', dir: 'r', reach: 14, when: function (s) { return !s.flags.cosmo_done; } });
    Z.npc({ id: 'mo', x: 10.2, y: 7.6, dlg: 'af_mo', dir: 'u', reach: 16, when: F('mb_aftercare') });
    Z.friend('default', 5, 7);
  })();

  /* ============================================================ the guests: seeded from your night, a few you never met */
  /* id, zone, x, y: where each guest sits. Their exchanges live in story_v31.js and story_v31b.js */
  const CAM = [
    ['hugo', 'a_balcony', 9, 4.6],
    ['rosa', 'a_kitchen', 4.2, 5.6],
    ['luca', 'a_living', 20.5, 10.6],
    ['nuri', 'a_kitchen', 11.4, 4.4],
    ['mika', 'a_bath', 5.4, 5.2],
    ['dario', 'a_living', 16.5, 12.8],
    ['marga', 'a_balcony', 12.5, 5.2],
    ['ezra', 'a_balcony', 6.4, 5.8],
    ['juno', 'a_bedroom', 9.4, 5.8],
    ['ximena', 'a_living', 9.4, 13],
    ['kiki', 'a_living', 24.5, 12.4],
    ['sol', 'a_balcony', 8.4, 6.2],
    ['hazel', 'a_kitchen', 10.2, 7.4],
    ['oz', 'a_living', 24.5, 7.6],
    ['resident', 'a_living', 6.6, 6.4],
    ['frames', 'a_living', 5.4, 12.4],
  ];
  CAM.forEach(function (c) {
    const id = c[0];
    if (!EM.CAST[id]) return;
    EM.zones[c[1]].npc({ id: 'cam_' + id, cast: id, x: c[2], y: c[3], dlg: 'af_cam_' + id, dir: 'd', reach: 16, when: function (s) { return !!(s.after && s.after.cameos.indexOf(id) !== -1); } });
  });
  /* how much your night weighs for each (1 = anyone may turn up, more = you talked, helped or were thanked by them) */
  function cameoWeight(s, id) {
    let w = 1;
    if (s.res['talked_' + id] || (s.talked && s.talked[id])) w += 4;
    if (id === 'hugo' && s.quests.sq_roots === 'done') w += 3;
    if (id === 'rosa' && s.quests.sq_rosa === 'done') w += 3;
    if (id === 'resident' && s.quests.q11 === 'done') w += 4;
    if (id === 'frames' && s.quests.q12 === 'done') w += 4;
    if (s.flags.team_thanks_done && ['rosa', 'luca', 'nuri', 'mika', 'dario'].indexOf(id) !== -1) w += 2;
    return w;
  }
  function pickCameos(s) {
    const rnd = EM.mulberry32((s.seed | 0) + 2929), pool = CAM.map(function (c) { return c[0]; }).filter(function (id) { return !!EM.CAST[id]; }), out = [];
    while (out.length < 8 && pool.length) {
      const ws = pool.map(function (id) { return cameoWeight(s, id); }), tot = ws.reduce(function (a, b) { return a + b; }, 0);
      let r = rnd() * tot, i = 0;
      for (; i < pool.length - 1; i++) { r -= ws[i]; if (r <= 0) break; }
      out.push(pool.splice(i, 1)[0]);
    }
    return out;
  }

  /* ============================================================ the NOISE bar: what the walls hear */
  const NS = { thump: 25, marcos: 50, beto: 70, quiroga: 90 };
  const NOISE_LAB = t('NOISE', 'RUIDO', 'BARULHO');
  const NOISE_ARIA = t('Noise level the neighbours can hear', 'Nivel de ruido que escuchan los vecinos', 'Nível de barulho que os vizinhos ouvem');
  AF.noise = function (d) {
    const s = EM.state; if (!s || !s.after) return;
    if (d > 0 && s.flags.rem_ally) d *= 0.7;
    s.after.noise = EM.clamp(s.after.noise + d, 0, 100);
    AF.paintNoise();
  };
  AF.setNoise = function (v) { const s = EM.state; if (!s || !s.after) return; s.after.noise = EM.clamp(v, 0, 100); AF.paintNoise(); };
  AF.vol = function (v) { const s = EM.state; if (s && s.after) s.after.vol = v; };
  AF.paintNoise = function () {
    const s = EM.state, box = document.getElementById('noise-bar'); if (!box) return;
    const on = !!(s && s.after && !s.ended && U.mode !== 'ending');
    box.hidden = !on; if (!on) return;
    const v = Math.round(s.after.noise);
    box.querySelector('.fill').style.height = v + '%';
    box.querySelector('.num').textContent = v;
    box.querySelector('.lab').textContent = EM.tr(NOISE_LAB);
    box.setAttribute('aria-label', EM.tr(NOISE_ARIA) + ': ' + v);
    box.classList.toggle('alert', v >= NS.marcos);
  };
  (function () {
    const css = document.createElement('style');
    css.textContent = '#noise-bar { position: absolute; right: 4px; top: 8px; bottom: 8px; width: 22px; z-index: 5; display: flex; flex-direction: column; align-items: center; gap: 2px; pointer-events: none; font-size: 9px; letter-spacing: 1px; color: #FFFFFF; text-transform: uppercase; }' +
      '#noise-bar[hidden] { display: none !important; } #noise-bar .lab { writing-mode: vertical-rl; transform: rotate(180deg); font-weight: bold; }' +
      '#noise-bar .track { position: relative; flex: 1; width: 12px; border: 2px solid #FFFFFF; background: #0A0A0A; }' +
      '#noise-bar .fill { position: absolute; left: 0; right: 0; bottom: 0; height: 0; background: #FF8A1F; }' +
      '#noise-bar .tk { position: absolute; left: -4px; right: -4px; height: 0; border-top: 1px solid #FFFFFF; }' +
      '#noise-bar.alert .num { color: #FF8A1F; }';
    document.head.appendChild(css);
    const build = function () {
      const st = document.getElementById('stage'); if (!st || document.getElementById('noise-bar')) return;
      const b = document.createElement('div'); b.id = 'noise-bar'; b.hidden = true; b.setAttribute('role', 'img');
      b.innerHTML = '<span class="lab"></span><span class="track"><span class="fill"></span></span><span class="num">0</span>';
      [NS.thump, NS.marcos, NS.beto, NS.quiroga].forEach(function (v) { const k = document.createElement('i'); k.className = 'tk'; k.style.bottom = v + '%'; b.querySelector('.track').appendChild(k); });
      st.appendChild(b);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  })();
  const hud0 = U.hud;
  U.hud = function () { hud0.apply(this, arguments); AF.paintNoise(); };

  /* ============================================================ the sunrise choice: do you have the energy to keep going? */
  const SD = D.sunrise && D.sunrise.nodes;
  AF.invite = function (s) {
    if (s.flags.wed_done) return t(`Anselm and Dot find you at the rail, still in the clothes from the courtyard. "You signed our vow. Come eat something at ours. Shoes off, phones away, nobody has to be anyone."`, `Anselm y Dot te encuentran en la baranda, con la ropa del patio. «Firmaste nuestros votos. Ven a comer algo a casa. Zapatos afuera, celulares guardados, nadie tiene que ser nadie».`, `O Anselm e a Dot te encontram no parapeito, ainda com a roupa do pátio. «Você assinou os nossos votos. Vem comer alguma coisa lá em casa. Sapato fora, celular guardado, ninguém precisa ser ninguém».`);
    return t(`Two strangers find you at the rail: Anselm and Dot, who saw you at the back of the roof and liked how you stood there. "We live ten minutes away. There's bread, and a floor, and nobody will ask what you do for work. Shoes off, phones away."`, `Dos desconocidos te encuentran en la baranda: Anselm y Dot, que te vieron al fondo del techo y les gustó cómo te quedabas ahí. «Vivimos a diez minutos. Hay pan, y un piso, y nadie te va a preguntar en qué trabajas. Zapatos afuera, celulares guardados».`, `Dois desconhecidos te encontram no parapeito: o Anselm e a Dot, que te viram no fundo do terraço e gostaram de como você ficava ali. «A gente mora a dez minutos. Tem pão, e um chão, e ninguém vai perguntar o que você faz da vida. Sapato fora, celular guardado».`);
  };
  if (SD && SD.end) {
    SD.end.next = 'af_ask';
    SD.af_ask = {
      text: function (s) {
        return [AF.invite(s), t(`The sun is fully up. You have been awake for a day, more or less. If you go, you go knowing it will cost you the afternoon. Do you go?`, `El sol ya salió del todo. Llevas despierto un día, más o menos. Si vas, sabes que te costará la tarde. ¿Vas?`, `O sol já nasceu de vez. Você tá acordado faz um dia, mais ou menos. Se for, vai sabendo que isso custa a tarde. Você vai?`)];
      },
      choices: [
        K('care', t(`Go to the after. Toast, a sofa, more of the same people.`, `Ir al after. Tostadas, un sofá, más de la misma gente.`, `Ir pro after. Torrada, um sofá, mais da mesma galera.`), { free: true, do: { flag: 'after_go' }, next: null }),
        K('chill', t(`Go home. The night was enough.`, `Irte a casa. La noche alcanzó.`, `Ir pra casa. A noite bastou.`), { free: true, do: { flag: 'after_home' }, next: null })
      ]
    };
  }
  const fe0 = S.final_ending;
  S.final_ending = function () {
    const s = EM.state;
    AF.plan(s);
    if (s.flags.after_go) { setTimeout(function () { if (!EM.state.ended) S.af_begin(); }, 200); return; }
    fe0();
  };

  /* who comes, who sleeps, who goes home: decided once from your night and the seed, so BEGIN AGAIN repeats it */
  AF.plan = function (s) {
    if (s.afterPlan) return s.afterPlan;
    const rnd = EM.mulberry32((s.seed | 0) + 4141), p = { f: {} };
    FR.forEach(function (f) {
      const here = s.party.indexOf(f) !== -1, r = rnd(), r2 = rnd();
      /* 'came': the friend goes to the after. Friends with you come with you; friends away may turn up later and text you. */
      p.f[f] = { came: here || r < 0.45, hit: !here && r < 0.45, leave: 0, mode: null, r2: r2 };
    });
    s.afterPlan = p; return p;
  };

  S.af_begin = function () {
    const s = EM.state, p = AF.plan(s);
    const wk = EM.mulberry32((s.seed | 0) + 5151);
    s.after = { start: s.time, noise: 8, vol: 1, st: 0, pend: null, cameos: pickCameos(s), f: {}, texted: {}, tick: 0, wk: [wk(), wk(), wk()] };
    FR.forEach(function (f) {
      const x = p.f[f];
      if (!x.came || s.party.indexOf(f) === -1) { s.after.f[f] = { st: 'gone' }; return; }
      s.after.f[f] = { st: 'here', leave: 0, mode: null };
    });
    /* the schedule: Maru fades first, Feña falls asleep on the sofa, Benjamin wants the next thing */
    s.after.at = { door: s.time + 105 + Math.floor(s.after.wk[1] * 20), question: s.time + 150 + Math.floor(s.after.wk[0] * 40), tato: s.time + 70, dani: s.time + 115, lio: s.time + 55, pasc: s.time + 90, home: s.time + 215 + Math.floor(s.after.wk[1] * 30) };
    L.apply({ quest: { q_af1: 'active' } });
    U.startDialogue('af_travel', { npc: 'anselm' });
  };

  /* ============================================================ the minute: noise, the knock ladder, friends leaving, the schedule */
  const min0 = L.minute;
  L.minute = function () {
    min0.apply(this, arguments);
    const s = EM.state; if (!s || !s.after || s.ended) return;
    const a = s.after, here = AF.isFlat(s.zone);
    /* drift: the volume you chose, plus the floor while you dance */
    const rate = [-0.35, 0.1, 0.7][a.vol] || 0;
    AF.noise(rate);
    if (here && s.zone === 'a_living' && E.dancing) AF.noise(0.6);
    if (s.flags.door_yours && !s.flags.door_closed) AF.noise(0.2);
    if (here) AF.knock(s);
    AF.schedule(s);
  };

  AF.knock = function (s) {
    const a = s.after, v = a.noise;
    if (a.pend) return;
    if (a.st < 1 && v >= NS.thump) { a.st = 1; U.toast({ icon: 'note', kind: 'bad', ms: 6500, text: t(`THUMP, THUMP. A broom handle from the flat below. Someone has heard the bass.`, `TUM, TUM. Un palo de escoba desde el piso de abajo. Alguien escuchó el bajo.`, `TUM, TUM. Um cabo de vassoura vindo do andar de baixo. Alguém ouviu o grave.`) }); }
    else if (a.st < 2 && v >= NS.marcos) { a.st = 2; a.pend = 'af_marcos'; }
    else if (a.st < 3 && v >= NS.beto) { a.st = 3; a.pend = 'af_beto'; }
    else if (a.st < 4 && v >= NS.quiroga) { a.st = 4; a.pend = s.flags.quiroga_warned ? 'af_quiroga2' : 'af_quiroga1'; }
  };
  /* a knock waits until the player is free to answer it */
  AF.dispatch = function () {
    const s = EM.state; if (!s || !s.after || !s.after.pend || s.ended || U.D || U.mode !== 'play' || !AF.isFlat(s.zone)) return;
    const id = s.after.pend; s.after.pend = null;
    EM.audio.blip && EM.audio.blip('select');
    U.startDialogue(id, {});
  };
  setInterval(function () { if (EM.state && EM.state.after) AF.dispatch(); }, 600);

  /* friends' schedule and the missions that start by the clock */
  AF.schedule = function (s) {
    const a = s.after, at = a.at, now = s.time;
    /* Feña falls asleep on the sofa and is moved aside to sleep */
    if (a.f.tato && a.f.tato.st === 'here' && !s.flags.tato_asleep && now >= at.tato) {
      s.flags.tato_asleep = true; L.leave('tato', 'a_living'); a.f.tato.st = 'sofa';
      U.toast({ icon: 'zzz', kind: 'info', ms: 6000, text: t(`Fernando has lain down on the sofa, one shoe on, one off. He is asleep before you can say goodnight.`, `Feña se tendió en el sofá, un zapato puesto y otro no. Está dormido antes de que puedas darle las buenas noches.`, `O Fernando deitou no sofá, um sapato calçado e outro não. Dormiu antes de você dar boa noite.`) });
    }
    if (!s.quests.q_af4 && now >= at.lio) { L.setQuest('q_af4', 'active'); U.toast({ icon: 'exclam', kind: 'info', ms: 6500, text: t(`Dot, passing with a tray: "Somebody's lying in the coats room alone. Could you look in on them? I can't leave the stove."`, `Dot, pasando con una bandeja: «Hay alguien tirado solo en el cuarto de los abrigos. ¿Puedes ir a ver? No puedo dejar la cocina».`, `A Dot, passando com uma bandeja: «Tem alguém deitado sozinho no quarto dos casacos. Você pode dar uma olhada? Eu não posso largar o fogão».`) }); }
    if (!s.quests.q_af5 && now >= at.pasc) L.setQuest('q_af5', 'active');
    /* the door handoff: Dot asks you to hold the door while she sleeps for an hour */
    if (s.flags.af_rules && !s.flags.door_asked && !s.flags.dot_asleep && now >= at.door && !U.D && U.mode === 'play' && AF.isFlat(s.zone)) { s.flags.door_asked = true; U.startDialogue('af_dot_door2', { npc: 'dot' }); return; }
    /* Dot sleeps an hour, then takes the door back */
    if (s.flags.dot_asleep && now >= ((s.flagAt || {}).dot_asleep || now) + 60) { s.flags.dot_asleep = false; s.flags.door_closed = true; U.toast({ icon: 'heart', kind: 'good', ms: 6000, text: t(`Dot is up, hair flat on one side, taking the keys back. «Thank you for the hour.»`, `Dot se levantó, con el pelo aplastado de un lado, recuperando las llaves. «Gracias por la hora».`, `A Dot acordou, cabelo achatado de um lado, pegando as chaves de volta. «Obrigada pela hora».`) }); }
    /* Benjamin wants the next thing */
    if (a.f.dani && a.f.dani.st === 'here' && !s.flags.dani_next && now >= at.dani && !U.D && U.mode === 'play' && AF.isFlat(s.zone)) { s.flags.dani_next = true; U.startDialogue('af_dani_next', { npc: 'dani' }); return; }
    /* THE QUESTION: Maru is fading */
    if (!s.quests.q_af7 && now >= at.question && AF.present(s).length) { L.setQuest('q_af7', 'active'); }
    if (s.quests.q_af7 === 'active' && !s.flags.question_done && !U.D && U.mode === 'play' && AF.isFlat(s.zone) && now >= at.question + 4) { s.flags.question_done = true; U.startDialogue('af_question', { npc: AF.present(s)[0] || 'maru' }); return; }
    /* the rest leave on their own late in the morning: they text, you can text them */
    if (now >= at.home) FR.forEach(function (f) {
      const x = a.f[f]; if (!x || x.st === 'gone' || x.st === 'home') return;
      if (f === 'dani' && !s.flags.dani_next) return;
      const leaves = f === 'maru' ? true : (f === 'tato' ? a.wk[2] < 0.4 : a.wk[2] >= 0.5);
      if (!leaves) return;
      AF.sendHome(f, 'alone');
    });
  };
  AF.present = function (s) { return FR.filter(function (f) { return s.party.indexOf(f) !== -1; }); };
  /* a friend goes home: mode 'buddy' (somebody saw them out) or 'alone' (they just left) */
  AF.sendHome = function (f, mode) {
    const s = EM.state, a = s.after; if (!a || !a.f[f] || a.f[f].st === 'home') return;
    L.leave(f, 'home'); a.f[f] = { st: 'home', mode: mode, at: s.time }; delete s.flags[f + '_asleep'];
    if (f === 'tato') s.flags.tato_asleep = false;
    U.toast({ icon: 'phone', kind: 'info', ms: 6500, text: t(`${EM.CAST[f].name} has gone home. You can text them from MENU > ITEMS.`, `${EM.CAST[f].name} se fue a casa. Puedes escribirle desde MENÚ > OBJETOS.`, `${EM.CAST[f].name} foi pra casa. Você pode mandar mensagem em MENU > ITENS.`) });
  };

  /* Feña, asleep, is not a friend you can talk into rejoining */
  const fd0 = story.friendDialogue;
  story.friendDialogue = function (id, s) {
    if (s && s.flags.after_go && s.after && s.after.f[id] && s.after.f[id].st === 'sofa') return 'af_tato_sofa';
    return fd0 ? fd0(id, s) : null;
  };

  D.af_dot_asleep = {
    who: 'dot', role: t('ASLEEP', 'DORMIDA', 'DORMINDO'), start: 'a', nodes: {
      a: {
        text: t(`Dot is asleep on the sofa with the keys loose in one hand. She has given you the door, and with it an hour of her trust. You leave her be.`, `Dot duerme en el sofá con las llaves sueltas en una mano. Te dio la puerta, y con ella una hora de su confianza. La dejas en paz.`, `A Dot dorme no sofá com as chaves soltas numa mão. Ela te deu a porta, e com ela uma hora da confiança dela. Você deixa em paz.`),
        choices: [K('chill', t(`Step away quietly.`, `Alejarte sin hacer ruido.`, `Se afastar sem fazer barulho.`), { free: true, next: null })]
      }
    }
  };

  /* ============================================================ objects, entering rooms, objectives, quests */
  const O = EM.objects;
  O.afdance = function (ent) { O.dance(ent); };
  O.afrecords = function () { U.startDialogue('af_records', {}); };
  O.afbasket = function () { U.startDialogue('af_basket', {}); };
  O.aftoast = function () { U.startDialogue('af_toast', {}); };
  O.afdishes = function () { U.startDialogue('af_dishes', { npc: 'dot' }); };
  O.afbowl = function () { U.startDialogue('af_bowl', {}); };
  const enter0 = story.enter;
  story.enter = function (zone) {
    enter0(zone);
    const s = EM.state; if (!s || !s.after) return;
    AF.paintNoise();
    if (AF.isFlat(zone)) U.hint && U.hint();
  };
  const obj0 = story.objective;
  story.objective = function (s) {
    if (s.after && !s.ended) {
      const q = s.quests;
      if (q.q_af1 === 'active') return t('Get to Anselm and Dot\'s flat. Nobody drives tired.', 'Llega al departamento de Anselm y Dot. Nadie maneja con sueño.', 'Chegue ao apê do Anselm e da Dot. Ninguém dirige com sono.');
      if (q.q_af2 === 'active') return t('Meet the hosts at the door. Shoes off, phones in the basket.', 'Encuentra a los anfitriones en la puerta. Zapatos afuera, celulares en la canasta.', 'Encontre os anfitriões na porta. Sapato fora, celular na cesta.');
      if (q.q_af4 === 'active') return t('Look in on the person alone in the coats room (the bedroom off the living room).', 'Ve a ver a la persona sola en el cuarto de los abrigos (el dormitorio junto a la sala).', 'Vá ver a pessoa sozinha no quarto dos casacos (o quarto ao lado da sala).');
      if (q.q_af3 === 'active') return t('The kitchen needs you. Toast, water, a quiet word for whoever looks rough.', 'La cocina te necesita. Tostadas, agua, una palabra tranquila para quien se vea mal.', 'A cozinha precisa de você. Torrada, água, uma palavra calma pra quem parecer mal.');
      if (q.q_af7 === 'active') return t('Who goes home? Talk it over with your people.', '¿Quién se va a casa? Habla con tu gente.', 'Quem vai pra casa? Conversa com a sua galera.');
      return t('Stay as long as you like. Help Dot clean. Keep the walls happy (watch the NOISE bar).', 'Quédate lo que quieras. Ayuda a Dot a limpiar. Mantén contentas a las paredes (mira la barra de RUIDO).', 'Fique o quanto quiser. Ajude a Dot a limpar. Mantenha as paredes felizes (olhe a barra de BARULHO).');
    }
    return obj0(s);
  };
  EM.seekers.push(function (s) {
    if (!s.after || s.ended) return [];
    const q = s.quests, out = [];
    if (q.q_af4 === 'active' && !s.flags.lio_done) out.push({ key: 'lio', zone: 'a_bedroom', label: '★' });
    if (q.q_af3 === 'active') ['sam', 'rey', 'vik'].forEach(function (k) { if (!s.flags[k + '_done']) out.push({ key: k, zone: 'a_kitchen', label: '★' }); });
    if (q.q_af5 === 'active' && !s.flags.one_done) out.push({ key: 'pasc', zone: 'a_living', label: '★' });
    return out;
  });
  const mkq = function (id, title, desc, done) { EM.QUESTS[id] = { title: title, desc: desc, doneText: done }; };
  const mark = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };
  mkq('q_af1', t('GETTING THERE', 'LLEGAR', 'CHEGAR'), t(`The group chat splits on how to travel. Nobody who has not slept drives. Split a taxi or walk.`, `El chat grupal se divide sobre cómo ir. Nadie que no durmió maneja. Compartan un taxi o caminen.`, `O grupo se divide sobre como ir. Ninguém que não dormiu dirige. Dividam um táxi ou caminhem.`), t(`You got there in one piece, all of you.`, `Llegaron enteros, todos.`, `Chegaram inteiros, todo mundo.`));
  mkq('q_af2', t('HOUSE RULES', 'REGLAS DE LA CASA', 'REGRAS DA CASA'), t(`Shoes off. Phones in the basket. Ask before touching the records. No photos: the Æ000.X rule, in a living room.`, `Zapatos afuera. Celulares en la canasta. Pregunta antes de tocar los discos. Sin fotos: la regla de Æ000.X, en una sala.`, `Sapato fora. Celular na cesta. Pergunte antes de mexer nos discos. Sem fotos: a regra da Æ000.X, numa sala.`), t(`The flat knows how to treat you now.`, `El departamento ya sabe cómo tratarte.`, `O apê já sabe como te tratar.`));
  mkq('q_af3', t('THE KITCHEN', 'LA COCINA', 'A COZINHA'), function (s) { return t(`There is no stand and no table. You are the aftercare. ${mark(s, 'sam_done')} Sam. ${mark(s, 'rey_done')} Rey. ${mark(s, 'vik_done')} Vik. Two is enough.`, `No hay stand ni mesa. Tú eres el cuidado. ${mark(s, 'sam_done')} Sam. ${mark(s, 'rey_done')} Rey. ${mark(s, 'vik_done')} Vik. Con dos alcanza.`, `Não tem stand nem mesa. Você é o cuidado. ${mark(s, 'sam_done')} Sam. ${mark(s, 'rey_done')} Rey. ${mark(s, 'vik_done')} Vik. Duas já bastam.`); }, t(`Toast, water and a quiet word did the work.`, `Tostadas, agua y una palabra tranquila hicieron el trabajo.`, `Torrada, água e uma palavra calma fizeram o trabalho.`));
  mkq('q_af4', t('THE PERSON IN THE BEDROOM', 'LA PERSONA EN EL DORMITORIO', 'A PESSOA NO QUARTO'), t(`Somebody in the coats room is too high and alone. Stay, ask, bring water, call for help if they cannot be roused.`, `Alguien en el cuarto de los abrigos está muy arriba y solo. Quédate, pregunta, lleva agua, llama ayuda si no despierta.`, `Alguém no quarto dos casacos tá muito alto e sozinho. Fique, pergunte, leve água, chame ajuda se não acordar.`), t(`Lio is safe, and someone sat with them.`, `Lio está a salvo, y alguien se sentó con él o ella.`, `O Lio está seguro, e alguém ficou junto.`));
  mkq('q_af5', t('ONE MORE', 'UNA MÁS', 'MAIS UMA'), t(`Pasc is passing a bag around the sofa. You can say no without making it a speech.`, `Pasc pasa una bolsa por el sofá. Puedes decir que no sin dar un discurso.`, `O Pasc passa um saquinho pelo sofá. Você pode dizer não sem fazer discurso.`), t(`The bag went round without you, or with you, and everyone is still friends.`, `La bolsa dio la vuelta sin ti, o contigo, y todos siguen siendo amigos.`, `O saquinho rodou sem você, ou com você, e todo mundo continua amigo.`));
  mkq('q_af6', t('THE KNOCK', 'EL TOQUE', 'A BATIDA'), t(`The walls have neighbours. Lower the music, say sorry, keep the party. Watch the NOISE bar.`, `Las paredes tienen vecinos. Baja la música, pide perdón, salva el after. Mira la barra de RUIDO.`, `As paredes têm vizinhos. Baixe a música, peça desculpa, mantenha o after. Olhe a barra de BARULHO.`), t(`The building let the party carry on.`, `El edificio dejó seguir el after.`, `O prédio deixou o after continuar.`));
  mkq('q_af7', t('THE QUESTION', 'LA PREGUNTA', 'A PERGUNTA'), t(`Maru is fading, Fernando is asleep on the sofa, Benjamin wants the next thing. Decide who walks whom home.`, `Maru se apaga, Feña duerme en el sofá, Benjamin quiere lo siguiente. Decide quién acompaña a quién a casa.`, `A Maru tá apagando, o Fernando dorme no sofá, o Benjamin quer a próxima coisa. Decida quem leva quem pra casa.`), t(`Everyone who left got home. You checked.`, `Todos los que se fueron llegaron a casa. Lo comprobaste.`, `Todo mundo que saiu chegou em casa. Você conferiu.`));
  mkq('q_af8', t('THE MASTER BEDROOM', 'EL DORMITORIO PRINCIPAL', 'O QUARTO PRINCIPAL'), t(`Optional. The hosts opened their own room, with the dark room's rules and a bed. Ask first. Skip it and you lose nothing.`, `Opcional. Los anfitriones abrieron su propia habitación, con las reglas del cuarto oscuro y una cama. Pregunta primero. Si te lo saltas no pierdes nada.`, `Opcional. Os anfitriões abriram o próprio quarto, com as regras da dark room e uma cama. Pergunte primeiro. Se pular, não perde nada.`), t(`You left the room as you found it.`, `Dejaste la habitación como la encontraste.`, `Você deixou o quarto como encontrou.`));

  /* ============================================================ the ending: noon in the flat, the building, the door */
  const FRIEND_END = function (f, s) {
    const x = s.after && s.after.f[f], n = EM.CAST[f].name;
    if (!x || x.st === 'gone') return null;
    if (x.st === 'home') return x.mode === 'buddy' ? t(`${n} got home with someone beside them.`, `${n} llegó a casa con alguien al lado.`, `${n} chegou em casa com alguém ao lado.`) : t(`${n} went home alone and you texted${s.after.texted[f] ? '' : ' (or meant to)'}.`, `${n} se fue sola o solo a casa y le escribiste${s.after.texted[f] ? '' : ' (o pensabas hacerlo)'}.`, `${n} foi pra casa sozinho e você mandou mensagem${s.after.texted[f] ? '' : ' (ou ia mandar)'}.`);
    if (x.st === 'sofa') return t(`${n} is still asleep on the sofa under a blanket.`, `${n} sigue dormido en el sofá bajo una manta.`, `${n} ainda dorme no sofá debaixo de um cobertor.`);
    return t(`${n} stayed until the end.`, `${n} se quedó hasta el final.`, `${n} ficou até o fim.`);
  };
  EM.ENDINGS.after = {
    art: 'sunrise', music: 'chill', lp: 1500,
    lead: function (s) { return s.flags.after_out ? 'af_out' : (s.flags.after_evicted ? 'af_evicted' : 'af_noon'); },
    title: t('NOON, SOCKS ON', 'MEDIODÍA, EN CALCETINES', 'MEIO-DIA, DE MEIA'),
    text: [
      function (s) {
        if (s.flags.after_out) return t(`Anselm closes the door without a sound. You stand on the landing with your shoes in your hand, which is where they should have stayed. Their home was not yours to push. It stays theirs.`, `Anselm cierra la puerta sin ruido. Estás en el descanso con los zapatos en la mano, que es donde debieron quedarse. Su casa no era tuya para empujar. Sigue siendo de ellos.`, `O Anselm fecha a porta sem fazer barulho. Você está no patamar com os sapatos na mão, que é onde eles deviam ter ficado. A casa deles não era sua pra empurrar. Continua sendo deles.`);
        if (s.flags.after_early) return t(`You go down the stairs on tiptoe, shoes in hand, past the Alvarados' door, with your people beside you. The street is bright and ordinary. Home is a good place to be.`, `Bajas las escaleras de puntillas, zapatos en la mano, frente a la puerta de los Alvarado, con tu gente a tu lado. La calle es luminosa y común. La casa es un buen lugar para estar.`, `Você desce a escada na ponta dos pés, sapatos na mão, passando pela porta dos Alvarado, com sua galera ao lado. A rua é clara e comum. Casa é um bom lugar pra estar.`);
        if (s.flags.after_evicted) return t(`Quiroga stands in the corridor until the last guest is in the lift. Anselm and Dot stay inside with the records in their arms. Nobody blames anybody. Everybody is tired, and the building is quiet at last.`, `Quiroga espera en el pasillo hasta que el último invitado entra al ascensor. Anselm y Dot se quedan adentro con los discos en los brazos. Nadie culpa a nadie. Todos están cansados, y por fin el edificio está en silencio.`, `O Quiroga espera no corredor até o último convidado entrar no elevador. O Anselm e a Dot ficam dentro com os discos nos braços. Ninguém culpa ninguém. Todo mundo tá cansado, e o prédio finalmente tá em silêncio.`);
        return t(`At noon the flat is quiet. Sun on the floorboards, a kettle ticking as it cools, the records back in their sleeves in the order Anselm likes. Dot is asleep upright in a chair. You put the last mug on the rack and leave the place better than you found it.`, `A mediodía el departamento está en silencio. Sol en el piso de madera, una tetera que chasquea al enfriarse, los discos de vuelta en sus fundas en el orden que le gusta a Anselm. Dot duerme sentada en una silla. Dejas la última taza en el escurridor y el lugar mejor que como lo encontraste.`, `Ao meio-dia o apê tá quieto. Sol no assoalho, uma chaleira estalando enquanto esfria, os discos de volta nas capas na ordem que o Anselm gosta. A Dot dorme sentada numa cadeira. Você põe a última caneca no escorredor e deixa o lugar melhor do que encontrou.`);
      },
      function (s) {
        const lines = FR.map(function (f) { return FRIEND_END(f, s); }).filter(Boolean);
        return lines.length ? t(lines.map(function (l) { return l.en; }).join(' '), lines.map(function (l) { return l.es; }).join(' '), lines.map(function (l) { return l.pt; }).join(' ')) : t(`Your friends scattered over the morning in the ways friends do.`, `Tus amigos se dispersaron por la mañana como lo hacen los amigos.`, `Seus amigos se espalharam pela manhã do jeito que amigos fazem.`);
      },
      t(`The Night Report and the phone are the same ones you know. The thread now runs through noon and on to Tuesday.`, `El Reporte de la Noche y el celular son los que ya conoces. El hilo ahora corre hasta el mediodía y sigue hasta el martes.`, `O Relatório da Noite e o celular são os mesmos que você já conhece. O fio agora vai até o meio-dia e segue até a terça.`)
    ]
  };
  EM.AF_FRIEND_END = FRIEND_END;
})();

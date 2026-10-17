/* EXCUSE ME — story v17: a smaller smoking area with a cloud of its own, and more ways up to the roof.
   People smoking carry a lit cigarette above their head; standing close to them costs HEALTH and raises WEIRDNESS
   (the author's own taste: tobacco smoke is not a vibe). Two fire-escape stairs from the smoking area join the roof. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones, TL = EM.TL;
  const F = EM.F;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const C = Z.courtyard, R = Z.rooftop;

  /* ------------------------------------------------ a smaller smoking area: the south half is walled off */
  const W = C.w;
  for (let y = 17; y < C.h; y++) for (let x = 0; x < W; x++) C.set(x, y, TL.VOID);
  for (let x = 1; x < W - 1; x++) C.set(x, 17, TL.FENCE);
  C.set(0, 17, TL.FENCE); C.set(W - 1, 17, TL.FENCE);
  C.set(22, 15, TL.BENCH);
  C.lights = C.lights.filter(function (l) { return l.y < 17 * 16; });
  const MOVE = { jonas: [13, 15.5], pili: [26, 15.5], sol: [33, 15.5], rest_c3: [22, 16], cat: [4, 15], sia: [4.5, 12.5], vera_back: [35.5, 8.5], juniper: [13.5, 10.5], mambo: [19.5, 14.5], maya: [36.5, 15.5] };
  C.ents.forEach(function (e) { const m = MOVE[e.id]; if (m) { e.x = m[0]; e.y = m[1]; } });
  C.ents.forEach(function (e) { if (e.type === 'npc' && ['jonas', 'pili', 'dante', 'sol'].indexOf(e.id) !== -1) e.smoker = true; });

  /* ------------------------------------------------ more smokers near the lighter */
  const look = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  EM.CAST.smk1 = { name: 'SMOKER', look: look({ skin: 1, hair: 4, hc: 4, top: 9, tc: 7, bottom: 2 }) };
  EM.CAST.smk2 = { name: 'SMOKER', look: look({ skin: 3, hair: 6, hc: 8, top: 1, tc: 3, bottom: 3, acc: 3 }) };
  EM.CAST.smk3 = { name: 'SMOKER', look: look({ skin: 0, hair: 1, hc: 2, top: 2, tc: 10, bottom: 1 }) };
  [['smk1', 24.5, 10.5, 'r'], ['smk2', 31.5, 11, 'l'], ['smk3', 24.5, 14.5, 'u']].forEach(function (c) {
    C.npc({ id: c[0], x: c[1], y: c[2], dir: c[3], reach: 12, decor: true, smoker: true });
  });

  /* ------------------------------------------------ two fire-escape stairs to the roof */
  const closed = t('The fire escape is chained. The closing set opens it.', 'La escalera de incendios tiene cadena. El set de cierre la abre.', 'A escada de incêndio está acorrentada. O set de encerramento abre ela.');
  [[8, 9, 19, 'door_roof4', 'door_court_roof1'], [32, 19, 19, 'door_roof5', 'door_court_roof2']].forEach(function (d, i) {
    const cx = d[0], rx = i === 0 ? 9 : 19;
    C.set(cx, 1, TL.DOORF);
    C.door(cx, 1, 1, 1, 'rooftop', rx, 11, 'u', { id: d[3], when: F('roof_open'), locked: closed });
    R.set(rx, 13, TL.DOORF);
    R.door(rx, 13, 1, 1, 'courtyard', cx, 3, 'd', { id: d[4] });
    C.sign(cx - 1, 3, 'ROOF', 1);
  });

  /* ------------------------------------------------ the smoke: standing close to a smoker costs health and raises weirdness */
  let warn = 0;
  const tick0 = EM.story.tick;
  EM.story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state; if (!s || s.ended || s.zone !== 'courtyard') return;
    let near = false;
    C.ents.forEach(function (e) {
      if (!e.smoker || (e.when && !e.when(s))) return;
      const ex = e.x * 16, ey = e.y * 16 + 6;
      if (Math.hypot(ex - s.x, ey - s.y) < 46) near = true;
    });
    if (!near) { warn = Math.max(0, warn - dt); return; }
    L.stat('hp', -0.18 * dt); L.stat('weird', 0.1 * dt, true);
    warn -= dt;
    if (warn <= 0) { warn = 30; U.toast({ icon: 'cig', kind: 'bad', ms: 5200, text: t(`Smoke right in your face. Your lungs file a complaint, and your head goes a little strange. Step away from the cigarettes.`, `Humo directo a la cara. Tus pulmones presentan una queja y la cabeza se pone un poco rara. Aléjate de los cigarros.`, `Fumaça direto na cara. Seus pulmões registram uma reclamação e a cabeça fica meio estranha. Se afaste dos cigarros.`) }); }
  };
})();

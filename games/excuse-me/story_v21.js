/* EXCUSE ME — story v21: club environment & staff rules (consolidated from v17 + v19 + v21).
   1. Smaller smoking area with passive smoke penalty + fire escape stairs to roof.
   2. Staff rudeness strikes (Luca, Nico, Dragan, Rosa).
   3. 04:30 AM late-night fatigue greetings for working staff. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones, TL = EM.TL, D = EM.DIALOGUES;
  const F = EM.F;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const C = Z.courtyard, R = Z.rooftop;

  /* ------------------------------------------------ 1. smaller smoking area + fire-escape stairs */
  const W = C.w;
  for (let y = 17; y < C.h; y++) for (let x = 0; x < W; x++) C.set(x, y, TL.VOID);
  for (let x = 1; x < W - 1; x++) C.set(x, 17, TL.FENCE);
  C.set(0, 17, TL.FENCE); C.set(W - 1, 17, TL.FENCE);
  C.set(22, 15, TL.BENCH);
  C.lights = C.lights.filter(function (l) { return l.y < 17 * 16; });
  const MOVE = { jonas: [13, 15.5], pili: [26, 15.5], sol: [33, 15.5], rest_c3: [22, 16], cat: [4, 15], sia: [4.5, 12.5], vera_back: [35.5, 8.5], juniper: [13.5, 10.5], mambo: [19.5, 14.5], maya: [36.5, 15.5] };
  C.ents.forEach(function (e) { const m = MOVE[e.id]; if (m) { e.x = m[0]; e.y = m[1]; } });
  C.ents.forEach(function (e) { if (e.type === 'npc' && ['jonas', 'pili', 'dante', 'sol'].indexOf(e.id) !== -1) e.smoker = true; });

  const look = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  EM.CAST.smk1 = { name: 'SMOKER', look: look({ skin: 1, hair: 4, hc: 4, top: 9, tc: 7, bottom: 2 }) };
  EM.CAST.smk2 = { name: 'SMOKER', look: look({ skin: 3, hair: 6, hc: 8, top: 1, tc: 3, bottom: 3, acc: 3 }) };
  EM.CAST.smk3 = { name: 'SMOKER', look: look({ skin: 0, hair: 1, hc: 2, top: 2, tc: 10, bottom: 1 }) };
  [['smk1', 24.5, 10.5, 'r'], ['smk2', 31.5, 11, 'l'], ['smk3', 24.5, 14.5, 'u']].forEach(function (c) {
    C.npc({ id: c[0], x: c[1], y: c[2], dir: c[3], reach: 12, decor: true, smoker: true });
  });

  const closed = t('The fire escape is chained. The closing set opens it.', 'La escalera de incendios tiene cadena. El set de cierre la abre.', 'A escada de incêndio está acorrentada. O set de encerramento abre ela.');
  [[8, 9, 19, 'door_roof4', 'door_court_roof1'], [32, 19, 19, 'door_roof5', 'door_court_roof2']].forEach(function (d, i) {
    const cx = d[0], rx = i === 0 ? 9 : 19;
    C.set(cx, 1, TL.DOORF);
    C.door(cx, 1, 1, 1, 'rooftop', rx, 11, 'u', { id: d[3], when: F('roof_open'), locked: closed });
    R.set(rx, 13, TL.DOORF);
    R.door(rx, 13, 1, 1, 'courtyard', cx, 3, 'd', { id: d[4] });
    C.sign(cx - 1, 3, 'ROOF', 1);
  });

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
    if (warn <= 0) { warn = 30; U.toast({ icon: 'cig', kind: 'bad', ms: 5200, text: t(`Smoke right in your face. Your lungs object, and your head goes a little strange. Step away from the cigarettes.`, `Humo directo a la cara. Tus pulmones protestan y la cabeza se pone un poco rara. Aléjate de los cigarros.`, `Fumaça direto na cara. Seus pulmões reclamam e a cabeça fica meio estranha. Se afaste dos cigarros.`) }); }
  };

  /* ------------------------------------------------ 2. staff are not to be trampled */
  function addRude(id, node, choice) {
    const d = D[id]; if (!d || !d.nodes[node] || !d.nodes[node].choices) return;
    d.nodes[node].choices.push(Object.assign({ tone: 'push', bad: true, next: null }, choice));
  }
  addRude('luca', 'a', {
    t: T('"Coat. Now. I\'m in a hurry."', '«El abrigo. Ya. Tengo prisa».', '«O casaco. Agora. Tô com pressa.»'),
    react: T('Luca hangs your ticket back on the hook, very slowly. "Wait your turn." The whole queue heard it.', 'Luca cuelga tu ficha en el gancho, muy despacio. «Espera tu turno». Toda la fila lo escuchó.', 'Luca pendura sua ficha de volta no gancho, bem devagar. «Espera a sua vez.» A fila inteira ouviu.')
  });
  addRude('bar_menu', 'a', {
    t: T('"Hey. HEY. I\'ve been waiting forever."', '«Oye. OYE. Llevo una eternidad esperando».', '«Ei. EI. Tô esperando há uma eternidade.»'),
    react: T('Nico keeps polishing the glass without looking at you. "The tap jug is free. Manners are free too."', 'Nico sigue puliendo el vaso sin mirarte. «La jarra es gratis. Los modales también».', 'Nico continua polindo o copo sem te olhar. «A jarra é de graça. Boas maneiras também.»')
  });
  addRude('dragan', 'a', {
    t: T('"Move. I know the owner."', '«Muévete. Conozco al dueño».', '«Sai da frente. Eu conheço o dono.»'), next: 'a',
    react: T('Dragan crosses his arms. He does not move. He writes something on the clipboard, and this time it is not decorative.', 'Dragan se cruza de brazos. No se mueve. Anota algo en la carpeta, y esta vez no es decorativo.', 'Dragan cruza os braços. Não se mexe. Anota algo na prancheta, e dessa vez não é decorativo.')
  });
  addRude('rosa_wait', 'a', {
    t: T('"Could you hurry up with that mop?"', '«¿Puedes apurarte con ese trapeador?»', '«Dá pra andar logo com esse esfregão?»'),
    react: T('Rosa stops mopping. She looks at you the way she looks at a spill. "Walk around."', 'Rosa deja de trapear. Te mira como mira un derrame. «Rodea».', 'Rosa para de passar o pano. Olha pra você como olha pra uma poça. «Dá a volta.»')
  });

  /* ------------------------------------------------ 3. 04:30 AM late-night fatigue */
  const LATE = 390;
  function late(did, nid, lateText, add) {
    const n = D[did] && D[did].nodes[nid]; if (!n) return;
    const orig = n.text;
    n.text = function (s) {
      const o = typeof orig === 'function' ? orig(s) : orig;
      if (s.time < LATE) return o;
      return add ? [].concat(o, lateText) : lateText;
    };
  }
  late('bar_menu', 'a', t(`Nico counts the till by feel. "Tap's free. Ice isn't, anymore."`, `Nico cuenta la caja a tientas. «El agua de la llave es gratis. El hielo ya no».`, `O Nico conta o caixa no tato. «A água da torneira é de graça. O gelo acabou».`));
  const rosaLate = t(`Rosa sits on the upturned bucket, mop across her knees. "Floor's wet. I'm not getting up."`, `Rosa se sienta en el balde dado vuelta, el trapeador sobre las rodillas. «El piso está mojado. No me voy a parar».`, `A Rosa se senta no balde virado, o esfregão nos joelhos. «O chão tá molhado. Eu não vou levantar».`);
  late('rosa_wait', 'a', rosaLate);
  late('rosa_again', 'plain', rosaLate);
  late('nuri', 'a', t(`Isi is eating dry crackers. "Ask quick. That's the fortieth time I've said it tonight."`, `Isi come galletas secas. «Pregunta rápido. Es la cuadragésima vez que lo digo esta noche».`, `A Isi come bolacha seca. «Pergunta rápido. É a quadragésima vez que eu falo isso hoje».`), true);
  late('mina', 'a', t(`Mina has both palms flat on the wall. "Everything's a hiss now. Say it slower."`, `Mina tiene las dos palmas contra la pared. «Todo es un siseo ahora. Dilo más despacio».`, `A Mina está com as duas palmas na parede. «Tudo virou chiado agora. Fala mais devagar».`));
  late('kai', 'a', t(`Kai plays with one hand and rubs an ear with the other. "Requests are closed. I'm playing what my fingers remember."`, `Kai toca con una mano y se frota la oreja con la otra. «Las peticiones están cerradas. Toco lo que recuerdan mis dedos».`, `O Kai toca com uma mão e esfrega a orelha com a outra. «Os pedidos estão fechados. Toco o que meus dedos lembram».`));
})();

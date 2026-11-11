/* EXCUSE ME — story v26: a playtest pass. Rosa's scene is shorter and her errands show on the map; ÆRIEL greets you by where you are in the
   missions, pre-selects what your friends told you and always opens the backstage door; FRAMES SHELL writes down what you carry. And
   THE DARK ROOM: half the nights (seeded) Benjamin and Feña, instead of getting lost, announce they are splitting up and ask you to
   explore the dark room; they wait on the main floor and rejoin you when you come out. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const MOODS = ['warm', 'wild', 'soft'];
  const NEED = { maru: 'warm', dani: 'wild', tato: 'soft' };
  const ORDER = ['maru', 'dani', 'tato'];
  const mk = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };

  /* ============================================================ ROSA: a shorter scene, a plain gate, errands on the map */
  (function () {
    const rc = D.rosa_confront && D.rosa_confront.nodes.a.choices;
    if (rc) {
      const ib = rc.findIndex(function (c) { return c.tone === 'blunt'; });
      if (ib >= 0) rc.splice(ib, 1);
      const hon = rc.filter(function (c) { return c.tone === 'honest' && c.next === 'honest'; });
      if (hon.length >= 2) { const r0 = hon[0].req; hon[1].req = function (s) { return !L.req(r0); }; }
    }
    if (D.rosa_wait && D.rosa_wait.nodes.notyet) D.rosa_wait.nodes.notyet.text = t(`"Maybe." She does not stop mopping. "Bring me water, or ask me a real question first. I don't hand favours to strangers."`, `«Quizás». No deja de trapear. «Tráeme agua, o hazme primero una pregunta de verdad. No doy favores a desconocidos».`, `«Talvez». Ela não para de passar o esfregão. «Me traz água, ou faz primeiro uma pergunta de verdade. Não faço favor pra desconhecido».`);
  })();
  EM.seekers.push(function (s) {
    const f = s.flags, res = [];
    if (s.quests.sq_rosa !== 'active') return res;
    const need = f.rosa_probation ? 1 : 2, got = [1, 2, 3].filter(function (i) { return f['rosa_e' + i]; }).length;
    if (got >= need) { if ([1, 2, 3].some(function (i) { return f['rosa_e' + i] && !f['rr' + i]; })) res.push({ key: 'rosa', zone: 'restrooms', label: '★' }); return res; }
    if (!f.rosa_e1 && !f.tavi_ignored) res.push({ key: 'tavi', zone: 'main', label: '★' });
    if (!f.rosa_e2) res.push({ key: 'luca', zone: 'foyer', label: '★' });
    if (!f.rosa_e3) res.push({ key: 'water_w', zone: 'welfare', label: '★' });
    return res;
  });
  const enter0 = story.enter;
  story.enter = function (zone) {
    enter0(zone);
    const s = EM.state; if (!s) return;
    /* walking back into the toilets reports your errands: no need to find the right button */
    if (zone === 'restrooms' && s.quests.sq_rosa === 'active' && [1, 2, 3].some(function (i) { return s.flags['rosa_e' + i] && !s.flags['rr' + i]; })) {
      setTimeout(function () { if (!EM.state.ended && EM.state.quests.sq_rosa === 'active') S.rosa_report(); }, 700);
    }
    if (zone === 'main' && s.flags.dark_explored && s.quests.q8d === 'active') s.flags.dark_regroup_pending = true;
  };

  /* ============================================================ ÆRIEL: the booth greets you by where you are */
  const R = D.resident;
  if (R) {
    if (R.nodes.ae) R.nodes.ae.choices.push(K('chill', t(`"I'll let you mix."`, `«Te dejo mezclar».`, `«Te deixo mixar».`), { free: true, next: null }));
    delete R.nodes.noted;
    const base = R.nodes.a.choices;
    const thank = base.filter(function (c) { return c.req && c.req.quest && c.req.quest.q11 === 'active'; })[0];
    R.nodes.a_thank = {
      text: t(`The crowd lets you through. ÆRIEL lifts one headphone and nods at the gap in the dancers. "You came all this way. Say it."`, `La multitud te deja pasar. ÆRIEL levanta un auricular y asiente hacia el hueco entre los bailarines. «Llegaste hasta aquí. Dilo».`, `A multidão deixa você passar. A ÆRIEL levanta um fone e acena pro vão entre as pessoas dançando. «Você veio até aqui. Fala».`),
      choices: (thank ? [thank] : []).concat(base.filter(function (c) { return c !== thank; }))
    };
    R.nodes.after = {
      text: t(`ÆRIEL gives you two fingers off the fader, a salute. "Go be where your people are. I'll know more at five."`, `ÆRIEL te hace un saludo con dos dedos desde el fader. «Ve donde está tu gente. Sabré más a las cinco».`, `A ÆRIEL te faz uma continência com dois dedos do fader. «Vai onde tá sua galera. Eu sei mais às cinco».`),
      choices: [
        K('chill', t(`"Good luck."`, `«Suerte».`, `«Boa sorte».`), { free: true, next: null }),
        K('joke', t(`"A quick Æ000.X question."`, `«Una pregunta rápida sobre Æ000.X».`, `«Uma pergunta rápida sobre a Æ000.X».`), { free: true, next: 'ae' })
      ]
    };
    R.nodes.st = { branch: [{ req: { quest: { q11: 'active' } }, to: 'a_thank' }, { req: { flag: 'thanked_dj' }, to: 'after' }, { req: function () { return true; }, to: 'a' }] };
    R.start = 'st';

    /* what your friends told you comes first, so mashing Z answers truthfully */
    const SAY = {
      warm: t(`"Warm. A long chord."`, `«Cálido. Un acorde largo».`, `«Quente. Um acorde longo».`),
      wild: t(`"Loud."`, `«Fuerte».`, `«Alto».`),
      soft: t(`"Soft. Quiet."`, `«Suave. Tranquilo».`, `«Suave. Quieto».`)
    };
    const tone = function (m) { return m === 'wild' ? 'bold' : (m === 'soft' ? 'silent' : 'chill'); };
    ORDER.forEach(function (f, i) {
      const node = R.nodes['rp_' + f]; if (!node) return;
      const nextBr = i + 1 < ORDER.length ? 'rp_' + ORDER[i + 1] + '_br' : 'rp_done';
      const told = function (s) { return !!s.flags['learned_' + f]; };
      const one = function (m, req) { return K(tone(m), SAY[m], { req: req, do: { flag: ['told_' + f, 'told_' + f + '_' + m] }, next: nextBr }); };
      node.choices = MOODS.map(function (m) { return one(m, function (s) { return told(s) && NEED[f] === m; }); })
        .concat(MOODS.map(function (m) { return one(m, function (s) { return !(told(s) && NEED[f] === m); }); }))
        .concat([K('chill', t(`"I don't know."`, `«No sé».`, `«Não sei».`), { do: { flag: ['told_' + f, 'told_' + f + '_none'] }, next: nextBr })]);
    });
    /* the bug: the backstage door could stay locked for THE REQUEST LINE. Thanking ÆRIEL now opens it. */
    if (R.nodes.rp_done) {
      R.nodes.rp_done.do.flag = [].concat(R.nodes.rp_done.do.flag, 'backstage_access');
      R.nodes.rp_done.text = [R.nodes.rp_done.text, t(`"Staff door, right of the booth. Tell FRAMES I sent you."`, `«Puerta de staff, a la derecha de la cabina. Dile a FRAMES que te mandé yo».`, `«Porta do staff, à direita da cabine. Fala pro FRAMES que fui eu que mandei».`)];
    }
  }
  /* the quest log remembers what you learned */
  (function () {
    const q = EM.QUESTS.q11; if (!q) return;
    const base = q.desc;
    const NAMES = { maru: ['Maru', 'Maru', 'Maru'], dani: ['Benjamin', 'Benjamin', 'Benjamin'], tato: ['Fernando', 'Feña', 'Fernando'] };
    const W = { warm: ['warm', 'cálido', 'quente'], wild: ['loud', 'fuerte', 'alto'], soft: ['soft', 'suave', 'suave'] };
    q.desc = function (s) {
      const got = ORDER.filter(function (f) { return s.flags['learned_' + f]; });
      const b = typeof base === 'function' ? base(s) : base;
      if (!got.length) return b;
      const L3 = function (k) { return got.map(function (f) { return NAMES[f][k] + ': ' + W[NEED[f]][k]; }).join(', '); };
      return t(b.en + ' You learned: ' + L3(0) + '.', b.es + ' Aprendiste: ' + L3(1) + '.', b.pt + ' Você descobriu: ' + L3(2) + '.');
    };
  })();

  /* ============================================================ FRAMES SHELL writes down what you carry */
  const REQS = [['fr_req_sad', 'note_cleo'], ['fr_req_wobble', 'req_wobble'], ['fr_req_melody', 'hazel_tip'], ['fr_req_nervous', 'kai_song']];
  S.v26_auto_req = function () {
    const f = EM.state.flags;
    const held = REQS.filter(function (r) { return f[r[1]] && !f[r[0]]; });
    const slots = REQS.filter(function (r) { return f[r[0]]; }).length;
    if (held.length && held.length <= 2 - slots) {
      held.forEach(function (r) { f[r[0]] = true; });
      U.toast({ icon: 'spark', kind: 'info', ms: 4200, text: t(`FRAMES SHELL looks over what you carry and writes it on the sleeve.`, `FRAMES SHELL revisa lo que llevas y lo anota en la funda.`, `O FRAMES SHELL confere o que você carrega e anota na capa.`) });
    }
  };
  if (D.frames && D.frames.nodes.menu) D.frames.nodes.menu.do = { call: 'v26_auto_req' };

  /* ============================================================ THE DARK ROOM */
  EM.QUESTS.q8d = {
    title: t('THE DARK ROOM', 'EL CUARTO OSCURO', 'A DARK ROOM'),
    desc: function (s) {
      const n = darkCount(s);
      return t(`Benjamin and Fernando split off on purpose and asked you to explore the dark room (the door on the west side of the main floor). ${mk(s, 'dario_rules')} Get the rules from Dario at the curtain. ${n >= 2 ? '[X]' : '[ ]'} Talk to two people inside (${Math.min(n, 2)}/2). ${mk(s, 'regrouped')} Come out: your people are waiting on the main floor.`,
        `Benjamin y Feña se separaron a propósito y te pidieron que explores el cuarto oscuro (la puerta del lado oeste de la pista principal). ${mk(s, 'dario_rules')} Pide las reglas a Dario en la cortina. ${n >= 2 ? '[X]' : '[ ]'} Habla con dos personas adentro (${Math.min(n, 2)}/2). ${mk(s, 'regrouped')} Sal: tu gente te espera en la pista principal.`,
        `O Benjamin e o Fernando se separaram de propósito e pediram que você explore a dark room (a porta do lado oeste da pista principal). ${mk(s, 'dario_rules')} Pegue as regras com o Dario na cortina. ${n >= 2 ? '[X]' : '[ ]'} Converse com duas pessoas lá dentro (${Math.min(n, 2)}/2). ${mk(s, 'regrouped')} Saia: sua galera espera na pista principal.`);
    },
    doneText: t(`You came out of the dark with a story you can tell, and your people were waiting.`, `Saliste de la oscuridad con una historia para contar, y tu gente te esperaba.`, `Você saiu do escuro com uma história pra contar, e sua galera estava esperando.`)
  };
  (function () {
    const old = EM.QUESTS, ordered = {};
    Object.keys(old).forEach(function (k) { ordered[k] = old[k]; if (k === 'q8') ordered.q8d = EM.QUESTS.q8d; });
    EM.QUESTS = ordered;
  })();
  function darkCount(s) {
    return EM.zones.darkroom.ents.filter(function (e) { return e.type === 'npc' && e.dlg && e.id !== 'dario' && e.cast !== 'dario' && (s.res['talked_' + e.id] || (e.cast && s.res['talked_' + e.cast])); }).length;
  }
  const obj0 = story.objective;
  story.objective = function (s) {
    if (s.quests.q9 !== 'active' && s.quests.q8d === 'active') {
      if (!s.flags.dario_rules) return t('Go to the dark room: the door on the west side of the main floor. Dario gives you the rules.', 'Ve al cuarto oscuro: la puerta del lado oeste de la pista principal. Dario te da las reglas.', 'Vá à dark room: a porta do lado oeste da pista principal. O Dario te passa as regras.');
      if (!s.flags.dark_explored) return t('Explore the dark room: talk to two people inside (' + Math.min(darkCount(s), 2) + '/2).', 'Explora el cuarto oscuro: habla con dos personas adentro (' + Math.min(darkCount(s), 2) + '/2).', 'Explore a dark room: converse com duas pessoas lá dentro (' + Math.min(darkCount(s), 2) + '/2).');
      return t('Come out of the dark room. Benjamin and Fernando are waiting on the main floor.', 'Sal del cuarto oscuro. Benjamin y Feña te esperan en la pista principal.', 'Saia da dark room. O Benjamin e o Fernando esperam na pista principal.');
    }
    return obj0(s);
  };
  EM.seekers.push(function (s) {
    if (s.quests.q8d !== 'active') return [];
    if (!s.flags.dario_rules) return [{ key: 'dario', zone: 'darkroom', label: '★' }];
    if (s.flags.dark_explored) return [{ key: 'dark_wait', zone: 'main', label: '★' }];
    return [];
  });

  /* half the nights (seeded, so BEGIN AGAIN repeats it) they split on purpose instead of getting lost */
  const scatter0 = S.scatter;
  S.scatter = function () {
    const s = EM.state;
    if (EM.mulberry32((s.seed | 0) + 9911)() < 0.5) {
      if (S.decidePill) S.decidePill();
      delete s.quests.q8;
      s.flags.split_pending = true;
      L.setQuest('q8d', 'active');
      return;
    }
    scatter0();
  };
  D.split_dark = {
    who: 'dani', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GALERA'), forced: true, start: 'a', nodes: {
      a: {
        text: [
          t(`DANI, hand up, opening a meeting: "We are splitting up. Openly. On purpose. I'm announcing it so nobody has to find us by accident."`, `DANI, con la mano en alto como quien abre una reunión: «Nos separamos. Abiertamente. A propósito. Lo anuncio para que nadie tenga que encontrarnos por accidente».`, `O DANI, de mão erguida como quem abre uma reunião: «A gente vai se separar. Abertamente. De propósito. Tô anunciando pra ninguém ter que nos achar por acidente».`),
          t(`TATO, glowing and trying not to: "You take the dark room. Somebody has to, and it should be someone who asks first. We'll hold the wall out here, and we'll be right here when you come out." He looks across the floor at the black curtain. "I'm not jealous. I'm monitoring."`, `TATO, radiante y tratando de que no se note: «Tú te encargas del cuarto oscuro. Alguien tiene que ir y mejor que sea alguien que pregunta primero. Nosotros sostenemos la pared aquí afuera, y aquí estaremos cuando salgas». Mira hacia la cortina negra al otro lado de la pista. «No estoy celoso. Estoy monitoreando».`, `O TATO, radiante e tentando disfarçar: «Você cuida da dark room. Alguém tem que ir e melhor que seja alguém que pergunta primeiro. A gente segura a parede aqui fora, e vai tá aqui quando você sair». Ele olha pra cortina preta do outro lado da pista. «Não tô com ciúme. Tô monitorando».`)
        ],
        choices: [
          K('care', t(`"Go. I'll report back."`, `«Vayan. Les cuento al salir».`, `«Podem ir. Eu conto quando sair».`), { free: true, do: { bond: { dani: 1, tato: 1 } }, call: 'split_go', next: null }),
          K('joke', t(`"Reconnaissance. Respect."`, `«Reconocimiento. Respeto».`, `«Reconhecimento. Respeito».`), { free: true, do: { fun: 3 }, call: 'split_go', next: null })
        ]
      }
    }
  };
  S.split_go = function () {
    const s = EM.state;
    s.party = s.party.filter(function (x) { return x !== 'dani' && x !== 'tato'; });
    s.away.dani = 'main'; s.away.tato = 'main';
    s.flags.split_dark = true;
    U.toast({ icon: 'exclam', kind: 'info', ms: 6500, text: t(`NEW OBJECTIVE: the dark room. The door is on the west side of the main floor.`, `NUEVO OBJETIVO: el cuarto oscuro. La puerta está en el lado oeste de la pista principal.`, `NOVO OBJETIVO: a dark room. A porta fica no lado oeste da pista principal.`) });
  };
  D.dark_wait_dani = {
    who: 'dani', role: t('HOLDING THE WALL', 'SOSTENIENDO LA PARED', 'SEGURANDO A PAREDE'), start: 'a', nodes: {
      a: { text: t(`DANI is leaning on the wall exactly where he said he would. "Why are you here? The dark room is over there. We are performing 'holding the wall'. Report back!"`, `DANI está apoyado en la pared justo donde dijo que estaría. «¿Qué haces aquí? El cuarto oscuro está allá. Estamos haciendo 'sostener la pared'. ¡Informa luego!»`, `O DANI tá encostado na parede exatamente onde disse que estaria. «Por que você tá aqui? A dark room é lá. A gente tá fazendo 'segurar a parede'. Volta e conta!»`), choices: [K('chill', t(`"On my way."`, `«Voy».`, `«Já vou».`), { free: true, next: null })] }
    }
  };
  D.dark_wait_tato = {
    who: 'tato', role: t('HOLDING THE WALL', 'SOSTENIENDO LA PARED', 'SEGURANDO A PAREDE'), start: 'a', nodes: {
      a: { text: t(`TATO holds the wall with both hands and great dignity. "Go. I'm fine. I'm absolutely fine. I'm… monitoring the curtain from here."`, `TATO sostiene la pared con las dos manos y mucha dignidad. «Ve. Estoy bien. Estoy perfectamente bien. Estoy… monitoreando la cortina desde aquí».`, `O TATO segura a parede com as duas mãos e muita dignidade. «Vai. Eu tô bem. Tô absolutamente bem. Tô… monitorando a cortina daqui».`), choices: [K('chill', t(`"On my way."`, `«Voy».`, `«Já vou».`), { free: true, next: null })] }
    }
  };
  const REGROUP = { join: ['dani', 'tato'], quest: { q8d: 'done', q10: 'active' }, at: 400, flag: 'regrouped' };
  D.dark_regroup = {
    who: 'dani', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GALERA'), forced: true, start: 'a', nodes: {
      a: {
        text: [
          t(`DANI springs off the wall. "You're out! Did you see anything? You don't have to say. You can say."`, `DANI se despega de la pared de un salto. «¡Saliste! ¿Viste algo? No tienes que contar. Puedes contar».`, `O DANI desgruda da parede num pulo. «Você saiu! Viu alguma coisa? Não precisa contar. Pode contar».`),
          t(`TATO, right behind him: "Tell us nothing. Tell us everything. Tell us what it felt like."`, `TATO, justo detrás: «No nos cuentes nada. Cuéntanos todo. Cuéntanos cómo se sintió».`, `O TATO, logo atrás: «Não conta nada. Conta tudo. Conta como foi».`)
        ],
        choices: [
          K('honest', t(`"Quiet, and careful. They ask first. All of it."`, `«Tranquilo y cuidadoso. Preguntan primero. Todo».`, `«Quieto e cuidadoso. Perguntam primeiro. Tudo».`), { free: true, do: Object.assign({ soc: 3, fun: 2 }, REGROUP), next: null }),
          K('joke', t(`"I'm not allowed to say. Dario made me promise."`, `«No puedo decirlo. Dario me hizo prometer».`, `«Não posso dizer. O Dario me fez prometer».`), { free: true, do: Object.assign({ fun: 4 }, REGROUP), next: null }),
          K('care', t(`"You'd both like it. Slowly. When you're ready."`, `«A los dos les gustaría. Despacio. Cuando estén listos».`, `«Vocês dois iam gostar. Devagar. Quando estiverem prontos».`), { free: true, do: Object.assign({ soc: 2, bond: { dani: 1, tato: 1 } }, REGROUP), next: null })
        ]
      }
    }
  };
  const fd1 = story.friendDialogue;
  story.friendDialogue = function (id, s) {
    if (s.flags.split_dark && s.quests.q8d === 'active' && (id === 'dani' || id === 'tato')) return s.flags.dark_explored ? 'dark_regroup' : 'dark_wait_' + id;
    return fd1(id, s);
  };
  const tick0 = story.tick;
  story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state; if (!s || s.ended) return;
    if (s.flags.split_pending && !U.D && U.mode === 'play') { s.flags.split_pending = false; U.startDialogue('split_dark', { npc: 'dani' }); return; }
    if (s.quests.q8d === 'active') {
      if (s.flags.dario_rules && !s.flags.dark_explored && darkCount(s) >= 2) {
        s.flags.dark_explored = true;
        U.toast({ icon: 'star', kind: 'good', ms: 6500, text: t(`You have seen the dark room. Benjamin and Fernando are waiting on the main floor.`, `Ya conoces el cuarto oscuro. Benjamin y Feña te esperan en la pista principal.`, `Você conheceu a dark room. O Benjamin e o Fernando esperam na pista principal.`) });
      }
      if (s.flags.dark_regroup_pending && s.zone === 'main' && !U.D && U.mode === 'play') { s.flags.dark_regroup_pending = false; U.startDialogue('dark_regroup', { npc: 'dani' }); }
      /* if the roof opens first, they find their own way up */
      if (s.flags.roof_open) { L.join('dani'); L.join('tato'); L.setQuest('q8d', 'done'); }
    }
  };
})();

/* EXCUSE ME — late-club passes: playtest tweaks, team tribute, filmer, rave history (sq_roots), and licence (sq_licence). */
'use strict';
/* ---- consolidated from story_v26.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const MOODS = ['warm', 'wild', 'soft'];
  const NEED = { luisa: 'warm', benjamin: 'wild', fena: 'soft' };
  const ORDER = ['luisa', 'benjamin', 'fena'];
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
      const rp0 = R.nodes.rp_done.text;
      R.nodes.rp_done.do.flag = [].concat(R.nodes.rp_done.do.flag, 'backstage_access');
      R.nodes.rp_done.text = function (s) {
        return [rp0, s.time < 270
          ? t(`"Staff door, right of the booth. FRAMES is spinning Sala 2 until 02:30 AM, then brings the crate backstage."`, `«Puerta de staff, a la derecha de la cabina. FRAMES pincha en Sala 2 hasta las 02:30 AM y luego baja el cajón al backstage».`, `«Porta do staff, à direita da cabine. O FRAMES toca na Sala 2 até 02:30 AM e depois desce o caixote pro backstage».`)
          : t(`"Staff door, right of the booth. Tell FRAMES I sent you."`, `«Puerta de staff, a la derecha de la cabina. Dile a FRAMES que te mandé yo».`, `«Porta do staff, à direita da cabine. Fala pro FRAMES que fui eu que mandei».`)];
      };
    }
  }
  /* the quest log remembers what you learned */
  (function () {
    const q = EM.QUESTS.q11; if (!q) return;
    const base = q.desc;
    const NAMES = { luisa: ['Luisa', 'Luisa', 'Luisa'], benjamin: ['Benjamin', 'Benjamin', 'Benjamin'], fena: ['Fernando', 'Feña', 'Fernando'] };
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
    who: 'benjamin', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GALERA'), forced: true, start: 'a', nodes: {
      a: {
        text: [
          t(`BENJA, hand up, opening a meeting: "We are splitting up. Openly. On purpose. I'm announcing it so nobody has to find us by accident."`, `BENJA, con la mano en alto como quien abre una reunión: «Nos separamos. Abiertamente. A propósito. Lo anuncio para que nadie tenga que encontrarnos por accidente».`, `O BENJA, de mão erguida como quem abre uma reunião: «A gente vai se separar. Abertamente. De propósito. Tô anunciando pra ninguém ter que nos achar por acidente».`),
          t(`FEÑA, glowing and trying not to: "You take the dark room. Somebody has to, and it should be someone who asks first. We'll hold the wall out here, and we'll be right here when you come out." He looks across the floor at the black curtain. "I'm not jealous. I'm monitoring."`, `FEÑA, radiante y tratando de que no se note: «Tú te encargas del cuarto oscuro. Alguien tiene que ir y mejor que sea alguien que pregunta primero. Nosotros sostenemos la pared aquí afuera, y aquí estaremos cuando salgas». Mira hacia la cortina negra al otro lado de la pista. «No estoy celoso. Estoy monitoreando».`, `O FEÑA, radiante e tentando disfarçar: «Você cuida da dark room. Alguém tem que ir e melhor que seja alguém que pergunta primeiro. A gente segura a parede aqui fora, e vai tá aqui quando você sair». Ele olha pra cortina preta do outro lado da pista. «Não tô com ciúme. Tô monitorando».`)
        ],
        choices: [
          K('care', t(`"Go. I'll report back."`, `«Vayan. Les cuento al salir».`, `«Podem ir. Eu conto quando sair».`), { free: true, do: { bond: { benjamin: 1, fena: 1 } }, call: 'split_go', next: null }),
          K('joke', t(`"Reconnaissance. Respect."`, `«Reconocimiento. Respeto».`, `«Reconhecimento. Respeito».`), { free: true, do: { fun: 3 }, call: 'split_go', next: null })
        ]
      }
    }
  };
  S.split_go = function () {
    const s = EM.state;
    s.party = s.party.filter(function (x) { return x !== 'benjamin' && x !== 'fena'; });
    s.away.benjamin = 'main'; s.away.fena = 'main';
    s.flags.split_dark = true;
    U.toast({ icon: 'exclam', kind: 'info', ms: 6500, text: t(`NEW OBJECTIVE: the dark room. The door is on the west side of the main floor.`, `NUEVO OBJETIVO: el cuarto oscuro. La puerta está en el lado oeste de la pista principal.`, `NOVO OBJETIVO: a dark room. A porta fica no lado oeste da pista principal.`) });
  };
  D.dark_wait_benjamin = {
    who: 'benjamin', role: t('HOLDING THE WALL', 'SOSTENIENDO LA PARED', 'SEGURANDO A PAREDE'), start: 'a', nodes: {
      a: { text: t(`BENJA is leaning on the wall exactly where he said he would. "Why are you here? The dark room is over there. We are performing 'holding the wall'. Report back!"`, `BENJA está apoyado en la pared justo donde dijo que estaría. «¿Qué haces aquí? El cuarto oscuro está allá. Estamos haciendo 'sostener la pared'. ¡Informa luego!»`, `O BENJA tá encostado na parede exatamente onde disse que estaria. «Por que você tá aqui? A dark room é lá. A gente tá fazendo 'segurar a parede'. Volta e conta!»`), choices: [K('chill', t(`"On my way."`, `«Voy».`, `«Já vou».`), { free: true, next: null })] }
    }
  };
  D.dark_wait_fena = {
    who: 'fena', role: t('HOLDING THE WALL', 'SOSTENIENDO LA PARED', 'SEGURANDO A PAREDE'), start: 'a', nodes: {
      a: { text: t(`FEÑA holds the wall with both hands and great dignity. "Go. I'm fine. I'm absolutely fine. I'm… monitoring the curtain from here."`, `FEÑA sostiene la pared con las dos manos y mucha dignidad. «Ve. Estoy bien. Estoy perfectamente bien. Estoy… monitoreando la cortina desde aquí».`, `O FEÑA segura a parede com as duas mãos e muita dignidade. «Vai. Eu tô bem. Tô absolutamente bem. Tô… monitorando a cortina daqui».`), choices: [K('chill', t(`"On my way."`, `«Voy».`, `«Já vou».`), { free: true, next: null })] }
    }
  };
  const REGROUP = { join: ['benjamin', 'fena'], quest: { q8d: 'done', q10: 'active' }, at: 400, flag: 'regrouped' };
  D.dark_regroup = {
    who: 'benjamin', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GALERA'), forced: true, start: 'a', nodes: {
      a: {
        text: [
          t(`BENJA springs off the wall. "You're out! Did you see anything? You don't have to say. You can say."`, `BENJA se despega de la pared de un salto. «¡Saliste! ¿Viste algo? No tienes que contar. Puedes contar».`, `O BENJA desgruda da parede num pulo. «Você saiu! Viu alguma coisa? Não precisa contar. Pode contar».`),
          t(`FEÑA, right behind him: "Tell us nothing. Tell us everything. Tell us what it felt like."`, `FEÑA, justo detrás: «No nos cuentes nada. Cuéntanos todo. Cuéntanos cómo se sintió».`, `O FEÑA, logo atrás: «Não conta nada. Conta tudo. Conta como foi».`)
        ],
        choices: [
          K('honest', t(`"Quiet, and careful. They ask first. All of it."`, `«Tranquilo y cuidadoso. Preguntan primero. Todo».`, `«Quieto e cuidadoso. Perguntam primeiro. Tudo».`), { free: true, do: Object.assign({ soc: 3, fun: 2 }, REGROUP), next: null }),
          K('joke', t(`"I'm not allowed to say. Dario made me promise."`, `«No puedo decirlo. Dario me hizo prometer».`, `«Não posso dizer. O Dario me fez prometer».`), { free: true, do: Object.assign({ fun: 4 }, REGROUP), next: null }),
          K('care', t(`"You'd both like it. Slowly. When you're ready."`, `«A los dos les gustaría. Despacio. Cuando estén listos».`, `«Vocês dois iam gostar. Devagar. Quando estiverem prontos».`), { free: true, do: Object.assign({ soc: 2, bond: { benjamin: 1, fena: 1 } }, REGROUP), next: null })
        ]
      }
    }
  };
  const fd1 = story.friendDialogue;
  story.friendDialogue = function (id, s) {
    if (s.flags.split_dark && s.quests.q8d === 'active' && (id === 'benjamin' || id === 'fena')) return s.flags.dark_explored ? 'dark_regroup' : 'dark_wait_' + id;
    return fd1(id, s);
  };
  const tick0 = story.tick;
  story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state; if (!s || s.ended) return;
    if (s.flags.split_pending && !U.D && U.mode === 'play') { s.flags.split_pending = false; U.startDialogue('split_dark', { npc: 'benjamin' }); return; }
    if (s.quests.q8d === 'active') {
      if (s.flags.dario_rules && !s.flags.dark_explored && darkCount(s) >= 2) {
        s.flags.dark_explored = true;
        U.toast({ icon: 'star', kind: 'good', ms: 6500, text: t(`You have seen the dark room. Benjamin and Fernando are waiting on the main floor.`, `Ya conoces el cuarto oscuro. Benjamin y Feña te esperan en la pista principal.`, `Você conheceu a dark room. O Benjamin e o Fernando esperam na pista principal.`) });
      }
      if (s.flags.dark_regroup_pending && s.zone === 'main' && !U.D && U.mode === 'play') { s.flags.dark_regroup_pending = false; U.startDialogue('dark_regroup', { npc: 'benjamin' }); }
      /* if the roof opens first, they find their own way up */
      if (s.flags.roof_open) { L.join('benjamin'); L.join('fena'); L.setQuest('q8d', 'done'); }
    }
  };
})();

/* ---- consolidated from story_v27.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const arr = function (x) { return [].concat(x); };

  /* ============================================================ the log: every quest ends with a line */
  const DONE = {
    q9: t(`The sun came up on the roof with your people on it, and the set was theirs.`, `El sol salió sobre el techo con tu gente ahí arriba, y el set fue de ellos.`, `O sol nasceu no terraço com sua galera lá em cima, e o set foi deles.`),
    sq_kai: t(`Kai got the nine-volt and played a song for somebody nervous. Somebody nervous heard it.`, `Kai consiguió la pila de nueve voltios y tocó una canción para alguien nervioso. Alguien nervioso la oyó.`, `O Kai conseguiu a pilha de nove volts e tocou uma música pra alguém nervoso. Alguém nervoso ouviu.`),
    sq_lamp: t(`The attic went rose-pink. Benjamin was told, kindly, to say hello. He is practising.`, `El ático se volvió rosa. Le dijeron a Benjamin, con cariño, que saludara. Está practicando.`, `O sótão ficou rosa. Disseram ao Benjamin, com carinho, pra ele dizer oi. Ele tá treinando.`),
    sq_sia: t(`Sia finished the poem with a warm word, a brave word and a silly one.`, `Sia terminó el poema con una palabra cálida, una valiente y una tonta.`, `A Sia terminou o poema com uma palavra quente, uma corajosa e uma boba.`),
    sq_isi: t(`The quiet room ate. Isi's wristband is yours, and so is the cheese.`, `La sala tranquila comió. La pulsera de Isi es tuya, y el queso también.`, `A sala de calma comeu. A pulseira da Isi é sua, e o queijo também.`)
  };
  Object.keys(DONE).forEach(function (k) { if (EM.QUESTS[k]) EM.QUESTS[k].doneText = DONE[k]; });

  /* ============================================================ the pillar: somebody is filming */
  EM.CAST.filmer = { name: 'STRANGER', look: { skin: 0, hair: 5, hc: 4, expr: 3, top: 3, tc: 6, bottom: 1, bc: 2, acc: 0, wide: false } };
  D.filmer = {
    who: 'filmer', role: t('PHONE UP', 'CELULAR EN ALTO', 'CELULAR PRA CIMA'), start: 'a', nodes: {
      a: {
        text: t(`A stranger holds a phone over the dancers, panning slowly, mouthing a caption. "Sorry, it's for my story. It's a vibe." The camera sticker on the back is peeled off.`, `Un desconocido sostiene un celular sobre los bailarines, paneando despacio y murmurando un texto. «Perdón, es para mi historia. Es un vibe». La pegatina de la cámara está despegada.`, `Um desconhecido segura um celular acima de quem dança, fazendo uma panorâmica lenta e murmurando uma legenda. «Desculpa, é pro meu story. É uma vibe». O adesivo da câmera foi arrancado.`),
        choices: [
          K('honest', t(`"Ask first. They didn't agree to be in your story. Please put it away."`, `«Pregunta primero. Nadie aceptó salir en tu historia. Guárdalo, por favor».`, `«Pergunta primeiro. Ninguém aceitou aparecer no seu story. Guarda isso, por favor».`), { do: { soc: 2, fun: 3, flag: 'filmer_done', care: 1 }, next: null, react: t(`"Fine, chill." He locks the screen with a sharp click, pockets the phone, and drifts back toward the bar.`, `«Ya, tranquilo». Bloquea la pantalla con un clic seco, se guarda el celular y se pierde hacia la barra.`, `«Tá, calma». Ele trava a tela com um clique seco, guarda o celular no bolso e some pro lado do bar.`) }),
          K('joke', t(`"Nine percent battery. Mine. Yours is going to die in the first chorus."`, `«Nueve por ciento de batería. La mía. La tuya se muere en el primer estribillo».`, `«Nove por cento de bateria. A minha. A sua vai morrer no primeiro refrão».`), { do: { fun: 3, flag: 'filmer_done' }, next: null, react: t(`He checks his battery. It is at 4%. He lowers the phone with something like relief.`, `Mira su batería. Tiene 4%. Baja el celular con algo parecido al alivio.`, `Ele confere a bateria. Tá em 4%. Abaixa o celular com algo parecido com alívio.`) }),
          K('chill', t(`Let it go.`, `Dejarlo pasar.`, `Deixar pra lá.`), { free: true, next: null })
        ]
      }
    }
  };
  Z.main.npc({ id: 'filmer', x: 8.2, y: 11.5, dlg: 'filmer', dir: 'r', reach: 16, when: function (s) { return !s.flags.filmer_done && s.time < 300; } });

  /* ============================================================ Maru's bladder, and what she owes you */
  const MARU = [
    t(`LUISA: "I'm fine. Everything is fine. Where is the toilet. Is the toilet a myth."`, `LUISA: «Estoy bien. Todo está bien. ¿Dónde está el baño? ¿El baño es un mito?»`, `LUISA: «Tô bem. Tá tudo bem. Cadê o banheiro? O banheiro é um mito?»`),
    t(`LUISA: "I'm composing a eulogy for my bladder. It was brave. It was loved."`, `LUISA: «Estoy componiendo un elogio fúnebre para mi vejiga. Fue valiente. Fue querida».`, `LUISA: «Tô compondo um elogio fúnebre pra minha bexiga. Foi corajosa. Foi amada».`),
    t(`LUISA: "Tell my mother I was brave. Then tell her I need a stall."`, `LUISA: «Dile a mi mamá que fui valiente. Luego dile que necesito una cabina».`, `LUISA: «Fala pra minha mãe que eu fui corajosa. Depois fala que eu preciso de uma cabine».`)
  ];
  let q2t = 0, q2n = 0;
  /* ============================================================ Mika remembers a lie; Rosa nods on the short route */
  S.v27_rosa_nod = function () {
    U.toast({ icon: 'cross', kind: 'info', ms: 6000, text: t(`On the way out, Rosa nods at you over the mop. She has counted you once and decided to let it go.`, `Al salir, Rosa te asiente por encima del trapeador. Te contó una vez y decidió dejarlo pasar.`, `Na saída, a Rosa assente pra você por cima do esfregão. Ela te contou uma vez e decidiu deixar pra lá.`) });
  };
  ['agree', 'no'].forEach(function (n) {
    const node = D.stall_split && D.stall_split.nodes[n];
    if (node) node.do = Object.assign({}, node.do, { call: 'v27_rosa_nod' });
  });
  const enter0 = story.enter;
  story.enter = function (zone) {
    const prev = EM.state && EM.state.zone;
    enter0(zone);
    const s = EM.state; if (!s) return;
    if (s.flags.host_lied && !s.flags.host_lie_called && zone !== 'restrooms') {
      s.flags.host_lie_called = true;
      L.apply({ soc: -2, weird: 3 });
      U.toast({ icon: 'eyes', kind: 'bad', ms: 6500, text: t(`A radio crackles near you. MIKA: "I told you I'd know." That was Mika's whole sentence.`, `Una radio crepita cerca de ti. MIKA: «Te dije que lo sabría». Esa fue toda la frase de Mika.`, `Um rádio chia perto de você. MIKA: «Eu disse que ia saber». Essa foi a frase inteira do Mika.`) });
    }
    if (zone === 'rooftop' && s.flags.roof_open && !s.flags.team_thanks_done) s.flags.team_pending = true;
  };

  /* ============================================================ the drop: a sonic inquiry */
  if (D.the_drop && D.the_drop.nodes.after) {
    const aft = D.the_drop.nodes.after;
    aft.text = [].concat(aft.text, t(`Somewhere in the spiral a stranger in a bucket hat shouts "THIS IS A SONIC INQUIRY!" and about a hundred people answer "YES!" Nobody has read the FAQ. Everybody knows it.`, `En algún punto de la espiral un desconocido con gorro de pescador grita «¡ESTO ES UNA INDAGACIÓN SONORA!» y unas cien personas responden «¡SÍ!» Nadie leyó el FAQ. Todos lo saben.`, `Em algum ponto da espiral um desconhecido de chapéu de pescador grita «ISSO É UMA INVESTIGAÇÃO SONORA!» e umas cem pessoas respondem «SIM!» Ninguém leu o FAQ. Todo mundo sabe.`));
  }

  /* ============================================================ each lost friend gets a joke of their own */
  const JOKES = {
    found_benjamin_darkroom: ['benjamin', t(`"Is this a pile or a committee?"`, `«¿Esto es una pila o un comité?»`, `«Isso é uma pilha ou um comitê?»`), t(`"A pile with minutes!" He takes the minutes. They say: "hug".`, `«¡Una pila con actas!» Toma el acta. Dice: «abrazo».`, `«Uma pilha com ata!» Ele registra a ata. Diz: «abraço».`)],
    found_benjamin_attic: ['benjamin', t(`"Benja, the DJ asked who you were. I said a capybara."`, `«Benja, el DJ preguntó quién eras. Dije que un capibara».`, `«Benja, o DJ perguntou quem você era. Eu disse que uma capivara».`), t(`"…I AM." He bows to the whole cult, which bows back, wired and sincere.`, `«…LO SOY». Le hace una reverencia a toda la secta, que se la devuelve, acelerada y sincera.`, `«…EU SOU». Ele faz uma reverência pra seita inteira, que retribui, acelerada e sincera.`)],
    found_benjamin_welfare: ['benjamin', t(`"Is the chair for the vibes or for the dizziness?"`, `«¿La silla es por el vibe o por el mareo?»`, `«A cadeira é pela vibe ou pela tontura?»`), t(`"The vibes! Mostly vibes. Eighty per cent vibes." Teo, from across the room: "Sixty."`, `«¡El vibe! Casi todo vibe. Ochenta por ciento vibe». Teo, desde el otro lado: «Sesenta».`, `«A vibe! Quase tudo vibe. Oitenta por cento vibe». O Teo, do outro lado: «Sessenta».`)],
    found_benjamin_tunnel: ['benjamin', t(`"The acoustics in here are great. The acoustics on the main floor are better."`, `«La acústica aquí es genial. La de la pista principal es mejor».`, `«A acústica aqui é ótima. A da pista principal é melhor».`), t(`"BETTER?" He is already walking, shouting about reverb at his own echo, which agrees.`, `«¿MEJOR?» Ya camina, gritándole sobre reverb a su propio eco, que está de acuerdo.`, `«MELHOR?» Ele já tá andando, gritando sobre reverb pro próprio eco, que concorda.`)],
    found_benjamin_courtyard: ['benjamin', t(`Point at the lighter. "That's not yours."`, `Señalar el encendedor. «Ese no es tuyo».`, `Apontar o isqueiro. «Esse não é seu».`), t(`"I'M HOLDING IT FOR A FRIEND. THE FRIEND IS THE CAT." The cat looks at you. The cat is not a friend.`, `«LO TENGO PARA UN AMIGO. EL AMIGO ES EL GATO». El gato te mira. El gato no es amigo.`, `«TÔ SEGURANDO PRA UM AMIGO. O AMIGO É O GATO». O gato te olha. O gato não é amigo.`)],
    found_fena_courtyard: ['fena', t(`"Are you here for the conversations?"`, `«¿Estás aquí por las conversaciones?»`, `«Você tá aqui pelas conversas?»`), t(`"I'm collecting them. I have eleven. Nobody's counting." He is counting.`, `«Las estoy coleccionando. Tengo once. Nadie las cuenta». Las cuenta.`, `«Tô colecionando. Tenho onze. Ninguém tá contando». Ele tá contando.`)],
    found_fena_welfare: ['fena', t(`"Rank the mattresses."`, `«Ordena los colchones».`, `«Classifica os colchões».`), t(`"This one's a solid seven. The one by the plant is a nine, but it has a plant." He is better already.`, `«Este es un siete sólido. El de la planta es un nueve, pero tiene planta». Ya está mejor.`, `«Esse é um sete sólido. O da planta é um nove, mas tem planta». Ele já tá melhor.`)]
  };
  Object.keys(JOKES).forEach(function (id) {
    const d = D[id]; if (!d || !d.nodes.a || !d.nodes.a.choices) return;
    const j = JOKES[id], f = j[0], b = {}; b[f] = 1;
    d.nodes.a.choices.splice(d.nodes.a.choices.length - 1, 0, K('joke', j[1], { do: { join: f, call: 'regroup_check', fun: 5, bond: b }, next: null, react: j[2] }));
  });

  /* ============================================================ the capybara, in the set talk */
  if (D.need_tell_benjamin) {
    const nd = D.need_tell_benjamin.nodes.a;
    nd.text = [].concat(nd.text, t(`"Also: I'm a capybara now. I've been meaning to say. It's going well."`, `«Además: ahora soy un capibara. Quería decirlo. Me está yendo bien».`, `«Além disso: agora sou uma capivara. Eu queria dizer. Tá indo bem».`));
  }

  /* ============================================================ ÆRIEL says whom they listened to */
  if (D.sunrise) {
    const SD = D.sunrise.nodes;
    if (SD.src_frames) {
      const tf = SD.src_frames.text;
      SD.src_frames.text = function (s) { return arr(tf(s)).concat(t(`ÆRIEL, to the crate and nobody else: "I listened to FRAMES. FRAMES listened to you."`, `ÆRIEL, al cajón y a nadie más: «Escuché a FRAMES. FRAMES te escuchó a ti».`, `A ÆRIEL, pro caixote e mais ninguém: «Eu escutei o FRAMES. O FRAMES escutou você».`)); };
    }
    if (SD.src_friends) {
      const tr = SD.src_friends.text;
      SD.src_friends.text = function (s) { return arr(tr(s)).concat(t(`ÆRIEL, along the rail: "I listened to your people. Through you."`, `ÆRIEL, a lo largo de la baranda: «Escuché a tu gente. A través de ti».`, `A ÆRIEL, ao longo do parapeito: «Eu escutei sua galera. Através de você».`)); };
    }
  }

  /* ============================================================ the jacket: Tico, and Isi's reagent */
  if (D.tico) {
    D.tico.nodes.st = { branch: [{ req: function (s) { return !!(s.flags.pill_known && L.hasFriend('benjamin') && !s.flags.tico_jacket); }, to: 'jacket' }, { req: function () { return true; }, to: 'a' }] };
    D.tico.nodes.jacket = {
      text: [
        t(`BENJA, pointing, voice cracking with joy: "THAT'S THE JACKET."`, `BENJA, señalando, con la voz quebrada de alegría: «ESA ES LA CHAQUETA».`, `O BENJA, apontando, com a voz falhando de alegria: «ESSA É A JAQUETA».`),
        t(`Tico adjusts his collar, unhurried. "It's a very good jacket. Lots of pockets. I'm a menu, standing up." A beat. "Can I help you?"`, `Tico se ajusta el cuello, sin prisa. «Es una chaqueta muy buena. Muchos bolsillos. Soy un menú de pie». Una pausa. «¿Puedo ayudarte?»`, `O Tico ajeita a gola, sem pressa. «É uma jaqueta muito boa. Muitos bolsos. Sou um cardápio em pé». Uma pausa. «Posso ajudar?»`)
      ],
      choices: [
        K('care', t(`"Show your pockets to Isi's table. A free look, no names."`, `«Muéstrale tus bolsillos a la mesa de Isi. Una revisión gratis, sin nombres».`, `«Mostra seus bolsos pra mesa da Isi. Uma olhada de graça, sem nomes».`), { do: { care: 1, soc: 2, flag: ['tico_jacket', 'tico_isi'] }, next: null, react: t(`Tico looks at the jacket as if it had spoken. "Isi doesn't take names." A long pause. "I'll think about it. The jacket is not a reagent. I know."`, `Tico mira la chaqueta como si hubiera hablado. «Isi no toma nombres». Una pausa larga. «Lo voy a pensar. La chaqueta no es un reactivo. Lo sé».`, `O Tico olha a jaqueta como se ela tivesse falado. «A Isi não anota nomes». Uma pausa longa. «Vou pensar. Jaqueta não é reagente. Eu sei».`) }),
        K('joke', t(`"It is a good jacket. Sincerely."`, `«Es una buena chaqueta. En serio».`, `«É uma boa jaqueta. Sério».`), { do: { fun: 5, flag: 'tico_jacket' }, next: 'a', react: t(`"Thank you." For one second Tico is a man in a jacket and nothing else.`, `«Gracias». Por un segundo Tico es un hombre con una chaqueta y nada más.`, `«Obrigado». Por um segundo o Tico é um homem de jaqueta e mais nada.`) }),
        K('chill', t(`Walk away with Benja.`, `Alejarte con Benja.`, `Sair com o Benja.`), { free: true, do: { flag: 'tico_jacket' }, next: null })
      ]
    };
    D.tico.start = 'st';
  }
  if (D.nuri && D.nuri.nodes.bring) {
    const b = D.nuri.nodes.bring, old = b.text;
    b.text = function (s) {
      const out = arr(typeof old === 'function' ? old(s) : old).slice();
      out.push(t(`Isi, writing without a name in the notebook: "A nice jacket is not a reagent."`, `Isi, anotando sin nombre en el cuaderno: «Una chaqueta bonita no es un reactivo».`, `A Isi, anotando sem nome no caderno: «Jaqueta bonita não é reagente».`));
      if (s.flags.tico_isi) out.push(t(`"The jacket guy. Tico. He stands near my table and asks for nothing. That's why I let him."`, `«El de la chaqueta. Tico. Se para cerca de mi mesa y no pide nada. Por eso lo dejo».`, `«O cara da jaqueta. Tico. Fica perto da minha mesa e não pede nada. É por isso que eu deixo».`));
      return out;
    };
  }

  /* ============================================================ finales with a joke */
  if (D.sia && D.sia.nodes.final) {
    const f = D.sia.nodes.final, ot = f.text;
    f.text = function (s) { return arr(typeof ot === 'function' ? ot(s) : ot).concat(t(`The queue behind you has been listening. It claps. Ruth, not looking up: "It rhymes. Technically."`, `La fila detrás de ti estuvo escuchando. Aplaude. Ruth, sin levantar la vista: «Rima. Técnicamente».`, `A fila atrás de você ficou ouvindo. Aplaude. A Ruth, sem levantar o olhar: «Rima. Tecnicamente».`)); };
  }
  if (D.nuri && D.nuri.nodes.fed) {
    const f = D.nuri.nodes.fed, ot = f.text;
    f.text = function (s) { return arr(typeof ot === 'function' ? ot(s) : ot).concat(t(`On the table a new sign appears in marker: FREE WATER. FREE ADVICE. THE CHEESE IS NOT FREE, IT IS A GIFT.`, `En la mesa aparece un cartel nuevo en plumón: AGUA GRATIS. CONSEJOS GRATIS. EL QUESO NO ES GRATIS, ES UN REGALO.`, `Na mesa aparece uma placa nova de caneta: ÁGUA DE GRAÇA. CONSELHO DE GRAÇA. O QUEIJO NÃO É DE GRAÇA, É UM PRESENTE.`)); };
  }

  /* ============================================================ the team on the stairs of the roof */
  const TEAM = [
    { ok: function (s) { return !!(s.flags.rosa_lanyard || s.flags.rosa_ally); }, t: t(`ROSA, mop upright, a thermos at her feet: "The lanyard looks good on you. Don't tell them I said it."`, `ROSA, con el trapeador en vertical y un termo a los pies: «La credencial te queda bien. No les digas que lo dije».`, `A ROSA, de esfregão em pé e uma garrafa térmica aos pés: «O crachá combina com você. Não conta que eu disse».`) },
    { ok: function (s) { return !!(s.flags.phone_returned || s.flags.closet_key); }, t: t(`LUCA hands you a coat check ticket for nothing at all. "Your jacket is checked. Your dread is free."`, `LUCA te da un ticket de guardarropa por nada. «Tu abrigo está guardado. La angustia es gratis».`, `O LUCA te entrega um ticket de chapelaria por nada. «Sua jaqueta tá guardada. A angústia é de graça».`) },
    { ok: function (s) { return !!(s.flags.isi_fed || (s.pill && s.pill.tested)); }, t: t(`ISI, with a sandwich and a notebook: "I'm off the table until six. Water's on me. Nobody takes names."`, `ISI, con un sándwich y un cuaderno: «Estoy fuera de la mesa hasta las seis. El agua va por mi cuenta. Nadie toma nombres».`, `A ISI, com um sanduíche e um caderno: «Tô fora da mesa até as seis. A água é por minha conta. Ninguém anota nome».`) },
    { ok: function (s) { return !!(s.flags.host_ok_group && !s.flags.host_lied); }, t: t(`MIKA, clipboard under one arm: "One person per stall. You were good about it. I'll say it once."`, `MIKA, con la carpeta bajo un brazo: «Una persona por cabina. Te portaste bien. Lo digo una vez».`, `O MIKA, de prancheta debaixo do braço: «Uma pessoa por cabine. Você se saiu bem. Eu digo uma vez só».`) },
    { ok: function (s) { return !!s.flags.dario_rules; }, t: t(`DARIO, in the dark of the stairwell: "You asked first. Keep asking."`, `DARIO, en la oscuridad de la escalera: «Preguntaste primero. Sigue preguntando».`, `O DARIO, no escuro da escada: «Você perguntou primeiro. Continua perguntando».`) },
    { ok: function () { return true; }, t: t(`DRAGAN, from the bottom step: "Nobody in there owes you a good night. You gave a few anyway."`, `DRAGAN, desde el último escalón: «Nadie ahí adentro te debe una buena noche. Igual diste unas cuantas».`, `O DRAGAN, do último degrau: «Ninguém lá dentro te deve uma boa noite. Você deu algumas mesmo assim».`) }
  ];
  D.team_thanks = {
    role: t('THE TEAM', 'EL EQUIPO', 'A EQUIPE'), forced: true, start: 'a', nodes: {
      a: {
        text: function (s) {
          const lines = TEAM.filter(function (m) { return m.ok(s); }).map(function (m) { return m.t; });
          return [t(`The roof is open. On the stairs, in lanyards, with mops and clipboards and a first-aid bag, are the people who held the night up so everyone could dance on it.`, `El techo está abierto. En la escalera, con credenciales, trapeadores, carpetas y un botiquín, están quienes sostuvieron la noche para que todos bailaran encima.`, `O terraço tá aberto. Na escada, de crachá, com esfregões, pranchetas e uma maleta de primeiros socorros, estão as pessoas que sustentaram a noite pra todo mundo dançar em cima dela.`)]
            .concat(lines);
        },
        choices: [K('care', t(`"Thank you — Rosa, Luca, Isi, Mika, Dario, Dragan."`, `«Gracias — Rosa, Luca, Isi, Mika, Dario, Dragan».`, `«{Obrigado|Obrigada|Valeu} — Rosa, Luca, Isi, Mika, Dario, Dragan».`), { free: true, call: 'team_apply', next: null })]
      }
    }
  };
  S.team_apply = function () {
    const s = EM.state, n = TEAM.filter(function (m) { return m.ok(s); }).length;
    s.flags.team_thanks_done = true;
    L.apply({ fun: 2 * n, soc: n, care: 1 });
  };

  if (D.need_luisa && D.need_luisa.nodes && D.need_luisa.nodes.a) {
    D.need_luisa.nodes.tell = {
      text: t(`LUISA, smiling without stopping: "You got me to the toilet in time. I owe you one, no dance needed. What I need from the last hour: warm. A long chord. Nothing sudden."`, `LUISA, sonriendo sin detenerse: «Me llevaste al baño a tiempo. Te debo una, sin baile. Lo que necesito de la última hora: cálido. Un acorde largo. Nada brusco».`, `A LUISA, sorrindo sem parar: «Você me levou ao banheiro a tempo. Te devo uma, sem dança. O que eu preciso da última hora: quente. Um acorde longo. Nada brusco».`),
      choices: [
        K('care', t(`"Warm, a long chord. Got it."`, `«Cálido, un acorde largo. Entendido».`, `«Quente, um acorde longo. Entendi».`), { do: { flag: ['need_done_luisa', 'learned_luisa', 'luisa_owes_paid'], fun: 4, bond: { luisa: 1 } }, call: 'v22_q10check', next: null })
      ]
    };
    D.need_luisa.nodes.a.choices.splice(1, 0, K('care', t(`"You owe me one from the toilets. Tell me without the dance."`, `«Me debes una de los baños. Dímelo sin bailar».`, `«Você me deve uma do banheiro. Me fala sem dançar».`), { req: function (s) { return !!s.flags.luisa_owes && !s.flags.luisa_owes_paid; }, free: true, next: 'tell' }));
  }

  const tick0 = story.tick;
  story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state; if (!s || s.ended || U.mode !== 'play') return;
    /* Maru's emergency escalates while you cross the floor */
    if (s.quests.q2 === 'active' && L.hasFriend('luisa') && !U.D) {
      q2t += dt;
      const gate = [30, 80, 140][q2n];
      if (gate !== undefined && q2t >= gate) { U.toast({ icon: 'exclam', kind: 'info', ms: 5200, text: MARU[q2n] }); q2n++; }
    }
    if (s.quests.q2 === 'done' && !s.flags.luisa_owes) s.flags.luisa_owes = true;
    if (s.flags.team_pending && s.zone === 'rooftop' && !U.D) { s.flags.team_pending = false; U.startDialogue('team_thanks', {}); }
  };
})();

/* ---- consolidated from story_v28.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`"Later."`, `«Después».`, `«Depois».`), { free: true, next: null }); };
  const IT = EM.items16;
  const look = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  const arr = function (x) { return [].concat(x); };
  const mk = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };
  const high = function (s) { return !!(s.fx.mdma || s.fx.meth || s.fx.coke || s.fx.ket); };

  /* ============================================================ 2. DRUGS HAVE CONSEQUENCES YOU CAN FEEL */
  EM.FXNAME.hot = t('OVERHEATING', 'SOBRECALENTADO', 'SUPERAQUECIDO');
  const toastOnce = function (key, gap, o) {
    const s = EM.state; s.once28 = s.once28 || {};
    if (s.once28[key] !== undefined && s.time - s.once28[key] < gap) return;
    s.once28[key] = s.time; U.toast(o);
  };
  /* a second dose on top of a first: the body is still working */
  const ts0 = story.takeStash;
  story.takeStash = function (i) {
    const s = EM.state, e = (s.stash || [])[i], again = !!(e && e.kind === 'mdma' && s.fx.mdma > 0);
    ts0(i);
    if (!again || s.ended) return;
    s.flags.redosed = true;
    L.apply({ hp: -6, fun: 2 });
    L.startFx('hot', 60);
    U.toast({ icon: 'skull', kind: 'bad', ms: 7000, text: t(`You redosed on top of the first. It was not finished yet. Your temperature climbs and your jaw locks. Water, shade, and a long sit.`, `Tomaste otra encima de la primera. Todavía no había terminado. Te sube la temperatura y se te traba la mandíbula. Agua, sombra y un rato largo sentado.`, `Você tomou outra em cima da primeira. Ela ainda não tinha acabado. Sua temperatura sobe e a mandíbula trava. Água, sombra e um bom tempo sentado.`) });
  };
  /* alcohol on top of anything: two jobs done badly */
  const ap1 = L.apply;
  L.apply = function (e, ctx) {
    const s = EM.state, on = !!(e && e.drink && s && high(s));
    const ket = !!(on && s.fx.ket);
    const r = ap1.call(this, e, ctx);
    if (on && !s.ended) {
      s.flags.mixed_alc = true;
      ap1.call(this, { hp: -3 * e.drink });
      toastOnce('mix', 15, { icon: 'cross', kind: 'bad', ms: 6500, text: t(`Alcohol on top of what you took: the body is doing two jobs badly. Isi will tell you the same.`, `Alcohol encima de lo que tomaste: el cuerpo hace dos trabajos mal. Isi te dirá lo mismo.`, `Álcool em cima do que você tomou: o corpo faz dois trabalhos mal. A Isi vai te dizer o mesmo.`) });
      if (ket && Math.random() < 0.35 && !s.pendingFaint) { s.pendingFaint = s.time + 8 + Math.floor(Math.random() * 6); s.pendingFaintKind = 'ket'; }
    }
    return r;
  };
  /* too much water too fast is not safe either */
  const dr0 = EM.drink;
  EM.drink = function () {
    const ok = dr0.apply(this, arguments), s = EM.state;
    if (ok && s && s.fx.mdma) {
      s.sipLog = (s.sipLog || []).filter(function (m) { return s.time - m < 60; });
      s.sipLog.push(s.time);
      if (s.sipLog.length > 8) {
        s.sipLog = [];
        L.apply({ hp: -4, fun: -2 });
        U.toast({ icon: 'water', kind: 'bad', ms: 6500, text: t(`Too much water too fast. Your head swims. Sip, don't chug: about a bottle an hour while you dance, no more.`, `Demasiada agua demasiado rápido. Se te va la cabeza. Sorbos, no tragos largos: más o menos una botella por hora bailando, no más.`, `Água demais rápido demais. Sua cabeça gira. Goles, não golaços: mais ou menos uma garrafa por hora dançando, não mais.`) });
      }
    }
    return ok;
  };
  const minute0 = L.minute;
  L.minute = function () {
    const s0 = EM.state;
    const had = s0 ? { coke: !!s0.fx.coke, ket: !!s0.fx.ket } : {};
    minute0();
    const s = EM.state; if (!s || s.ended) return;
    /* the aftermath of the short drugs */
    if (had.coke && !s.fx.coke) { L.startFx('comedown', 45); U.toast({ icon: 'cross', kind: 'bad', ms: 6000, text: t(`The edge dulls and the wanting starts. That is the drug talking, not you.`, `El filo se apaga y empieza el querer más. Eso lo dice la droga, no tú.`, `O fio embota e começa a vontade de mais. Quem fala é a droga, não você.`) }); }
    if (had.ket && !s.fx.ket) { L.startFx('comedown', 30); U.toast({ icon: 'cross', kind: 'info', ms: 6000, text: t(`The drift ends. Your body feels like it was away and has come back with a headache.`, `Termina la deriva. Tu cuerpo siente que estuvo lejos y volvió con dolor de cabeza.`, `A deriva acaba. Seu corpo sente que esteve longe e voltou com dor de cabeça.`) }); }
    /* dancing hot on MDMA without water */
    if (s.fx.mdma && s.thirst > 50 && EM.engine && EM.engine.dancing && !s.fx.hot) {
      L.startFx('hot', 45);
      toastOnce('hot', 30, { icon: 'cross', kind: 'bad', ms: 6500, text: t(`You are overheating. Water, then somewhere cool and quiet. The quiet room is for this.`, `Te estás sobrecalentando. Agua y luego un lugar fresco y tranquilo. La sala tranquila es para esto.`, `Você tá superaquecendo. Água e depois um lugar fresco e calmo. A sala de calma é pra isso.`) });
    }
    if (s.fx.hot) {
      L.stat('hp', -0.15); L.stat('fun', -0.05);
      if (s.thirst < 10) s.fx.hot -= 3;
      const z = EM.zones[s.zone]; if (z && z.quiet) s.fx.hot -= 2;
    }
  };
  /* Isi explains it in her own plain voice */
  const SAFE = {
    text: [
      t(`"More? Plainly: don't chase it. Wait at least a couple of hours, and if you must, take less than the first. The second one never feels the same as the first. It only costs more."`, `«¿Más? Claro: no la persigas. Espera un par de horas y, si de verdad quieres, toma menos que la primera. La segunda nunca se siente como la primera. Solo cuesta más».`, `«Mais? Claro: não persiga. Espera umas duas horas e, se for tomar, toma menos que a primeira. A segunda nunca é igual à primeira. Só custa mais».`),
      t(`"Water: a sip, often. About a bottle an hour while you dance. Not litres. Too much water is its own emergency. If you're hot, sit down somewhere cool: the quiet room is cool."`, `«Agua: un sorbo, seguido. Más o menos una botella por hora bailando. No litros. Demasiada agua es su propia emergencia. Si tienes calor, siéntate en un lugar fresco: la sala tranquila es fresca».`, `«Água: um gole, sempre. Mais ou menos uma garrafa por hora dançando. Não litros. Água demais é uma emergência própria. Se tá com calor, senta num lugar fresco: a sala de calma é fresca».`),
      t(`"Alcohol on top doesn't make it better. It makes both worse, and with ketamine it can put you on the floor. And the day after is going to ask for its money. Eat. Sleep. Text somebody. I'm not a doctor. Teo is."`, `«El alcohol encima no mejora nada. Empeora las dos cosas y, con ketamina, te puede dejar en el piso. Y el día siguiente va a cobrar. Come. Duerme. Escríbele a alguien. No soy médica. Teo sí».`, `«Álcool em cima não melhora nada. Piora as duas coisas e, com ketamina, pode te deixar no chão. E o dia seguinte vai cobrar. Come. Dorme. Manda mensagem pra alguém. Não sou médica. O Teo é».`)
    ]
  };
  [D.nuri, D.nuri_after].forEach(function (d) {
    if (!d) return;
    d.nodes.safety = { text: SAFE.text, once: true, do: { soc: 2, flag: 'isi_safety' }, next: 'a' };
    d.nodes.a.choices.splice(1, 0, K('ask', t(`"Is it okay to take more, or to drink with it?"`, `«¿Está bien tomar más, o tomar alcohol con eso?»`, `«Pode tomar mais, ou beber junto?»`), { free: true, next: 'safety' }));
  });
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'after_feel', who: 'luisa', ok: function (s) { return !!(s.flags.drug_taken || s.flags.took_stash); }, t: t(`how do you feel? i'm at the "everything is slightly too loud" stage. water, a real meal, a long sleep. tuesday is coming for all of us and it is not your fault, it is chemistry.`, `¿cómo te sientes? yo estoy en la etapa de «todo es un poco demasiado fuerte». agua, una comida de verdad, un sueño largo. el martes viene por todos y no es tu culpa, es química.`, `como você tá? eu tô na fase «tudo tá um pouco alto demais». água, uma refeição de verdade, um sono longo. a terça vem pra todo mundo e não é culpa sua, é química.`) });
    R.push({ id: 'after_mix', who: 'benjamin', ok: function (s) { return !!(s.flags.redosed || s.flags.mixed_alc); }, t: t(`i heard you redosed or mixed. not judging. i'm a capybara, i have no standing. just: next time, no. next time you tell me and i sit with you.`, `me enteré de que repetiste o mezclaste. no juzgo. soy un capibara, no tengo autoridad. solo: la próxima, no. la próxima me avisas y me siento contigo.`, `fiquei sabendo que você repetiu ou misturou. não tô julgando. sou uma capivara, não tenho autoridade. só: da próxima, não. da próxima você me avisa e eu sento com você.`) });
  }

  /* ============================================================ 3. WHERE THE FLOOR COMES FROM: Hugo */
  EM.QUESTS.sq_roots = {
    title: t('WHERE THE FLOOR COMES FROM', 'DE DÓNDE VIENE LA PISTA', 'DE ONDE VEM A PISTA'),
    desc: function (s) { return t(`Hugo, who has been dancing for decades, has three stories about where this floor comes from. ${mk(s, 'hugo_s1')} Detroit. ${mk(s, 'hugo_s2')} Chicago. ${mk(s, 'hugo_s3')} Berlin and the free parties.`, `Hugo, que baila desde hace décadas, tiene tres historias sobre de dónde viene esta pista. ${mk(s, 'hugo_s1')} Detroit. ${mk(s, 'hugo_s2')} Chicago. ${mk(s, 'hugo_s3')} Berlín y las fiestas libres.`, `O Hugo, que dança há décadas, tem três histórias sobre de onde vem essa pista. ${mk(s, 'hugo_s1')} Detroit. ${mk(s, 'hugo_s2')} Chicago. ${mk(s, 'hugo_s3')} Berlim e as festas livres.`); },
    doneText: t(`You know whose floor this is. Hugo stands a little taller.`, `Sabes de quién es esta pista. Hugo se para un poco más derecho.`, `Você sabe de quem é essa pista. O Hugo se endireita um pouco.`)
  };
  const H = D.hugo.nodes;
  H.roots_gate = { branch: [{ req: { flag: 'hugo_roots_open' }, to: 'roots' }, { req: function () { return true; }, to: 'roots_start' }] };
  H.roots_start = {
    text: t(`Hugo puts down his drink. "Sit. It's a long story and it isn't mine. It belongs to everybody who ever needed somewhere to dance. Pick a thread."`, `Hugo deja su vaso. «Siéntate. Es una historia larga y no es mía. Es de todos los que alguna vez necesitaron un lugar para bailar. Elige un hilo».`, `O Hugo larga o copo. «Senta. É uma história longa e não é minha. É de todo mundo que um dia precisou de um lugar pra dançar. Escolhe um fio».`),
    once: true, do: { flag: 'hugo_roots_open', quest: { sq_roots: 'active' } }, next: 'roots'
  };
  H.roots = {
    text: function (s) {
      const n = [1, 2, 3].filter(function (i) { return s.flags['hugo_s' + i]; }).length;
      return n >= 3 ? t(`"That's the three. One more question, if you want it: what do we owe it?"`, `«Esas son las tres. Una pregunta más, si quieres: ¿qué le debemos?»`, `«São as três. Mais uma pergunta, se quiser: o que a gente deve a isso?»`) : t(`"Pick a thread."`, `«Elige un hilo».`, `«Escolhe um fio».`);
    },
    choices: [
      K('ask', t(`"Detroit."`, `«Detroit».`, `«Detroit».`), { req: { no: 'hugo_s1' }, next: 'detroit', free: true }),
      K('ask', t(`"Chicago."`, `«Chicago».`, `«Chicago».`), { req: { no: 'hugo_s2' }, next: 'chicago', free: true }),
      K('ask', t(`"Berlin and the free parties."`, `«Berlín y las fiestas libres».`, `«Berlim e as festas livres».`), { req: { no: 'hugo_s3' }, next: 'berlin', free: true }),
      K('ask', t(`"What do we owe it?"`, `«¿Qué le debemos?»`, `«O que a gente deve a isso?»`), { req: function (s) { return !!(s.flags.hugo_s1 && s.flags.hugo_s2 && s.flags.hugo_s3); }, next: 'owe', free: true }),
      K('chill', t(`"Another time."`, `«Otra vez».`, `«Outra hora».`), { free: true, next: null })
    ]
  };
  H.detroit = {
    text: t(`"Detroit, early eighties. Three Black kids from Belleville, outside the city: Juan Atkins, Derrick May, Kevin Saunderson. They listened to Kraftwerk, funk and the radio, and they built something that had no name yet. They called it techno. A city that had been told it was finished made the sound of the future. Remember that when somebody tells you a place is finished."`, `«Detroit, principios de los ochenta. Tres chicos negros de Belleville, a las afueras: Juan Atkins, Derrick May, Kevin Saunderson. Escuchaban Kraftwerk, funk y la radio, y construyeron algo que todavía no tenía nombre. Lo llamaron techno. Una ciudad a la que le habían dicho que estaba terminada hizo el sonido del futuro. Acuérdate de eso cuando alguien te diga que un lugar está terminado».`, `«Detroit, começo dos anos oitenta. Três garotos negros de Belleville, na periferia: Juan Atkins, Derrick May, Kevin Saunderson. Ouviam Kraftwerk, funk e rádio, e construíram algo que ainda não tinha nome. Chamaram de techno. Uma cidade a quem tinham dito que estava acabada fez o som do futuro. Lembra disso quando alguém disser que um lugar acabou».`),
    once: true, do: { soc: 3, fun: 2, flag: 'hugo_s1', call: 'hugo_check' }, next: 'roots'
  };
  H.chicago = {
    text: t(`"Chicago. A club called the Warehouse, and a DJ named Frankie Knuckles. Black and queer dancers made house music a home, because the street outside was not one. Disco had been declared dead, so the people who loved it kept dancing, and the floor kept them alive. 'House' comes from the Warehouse, the story goes. Nobody is sure, and everybody tells it."`, `«Chicago. Un club llamado el Warehouse y un DJ llamado Frankie Knuckles. Gente negra y queer hizo de la música house un hogar, porque la calle no lo era. Habían declarado muerto al disco, así que quienes lo amaban siguieron bailando, y la pista los mantuvo vivos. 'House' viene del Warehouse, dice la historia. Nadie está seguro y todos la cuentan».`, `«Chicago. Um clube chamado Warehouse e um DJ chamado Frankie Knuckles. Gente negra e queer fez da house music um lar, porque a rua lá fora não era. A disco tinha sido declarada morta, então quem amava continuou dançando, e a pista manteve essas pessoas vivas. 'House' vem do Warehouse, diz a história. Ninguém tem certeza e todo mundo conta».`),
    once: true, do: { soc: 3, fun: 2, flag: 'hugo_s2', call: 'hugo_check' }, next: 'roots'
  };
  H.berlin = {
    text: t(`"Berlin, 1989. The Wall opens and the empty buildings are suddenly nobody's. People dance in them. England, a few years before: warehouse parties, and sound systems that came with the Caribbean communities. Then, in 1994, the English government wrote a law about 'repetitive beats'. A law about a kind of music. The free parties did not stop. Every free party since owes them."`, `«Berlín, 1989. Cae el Muro y los edificios vacíos de pronto no son de nadie. La gente baila en ellos. Inglaterra, unos años antes: fiestas en bodegas y sound systems que llegaron con las comunidades del Caribe. Luego, en 1994, el gobierno inglés escribió una ley sobre los 'ritmos repetitivos'. Una ley sobre un tipo de música. Las fiestas libres no pararon. Toda fiesta libre desde entonces se lo debe».`, `«Berlim, 1989. O Muro cai e os prédios vazios de repente não são de ninguém. As pessoas dançam neles. Inglaterra, uns anos antes: festas em galpões e sound systems que chegaram com as comunidades caribenhas. Depois, em 1994, o governo inglês escreveu uma lei sobre 'batidas repetitivas'. Uma lei sobre um tipo de música. As festas livres não pararam. Toda festa livre desde então deve isso a elas».`),
    once: true, do: { soc: 3, fun: 2, flag: 'hugo_s3', call: 'hugo_check' }, next: 'roots'
  };
  H.owe = {
    text: t(`"Three things. Remember who built the floor: Black, queer, Latino, working-class people who needed somewhere safe. Keep it safe for whoever comes next. And never let a floor be shut because of what it sounds like. That's why we ask first. That's why we look after each other."`, `«Tres cosas. Recuerda quién construyó la pista: gente negra, queer, latina y trabajadora que necesitaba un lugar seguro. Mantenla segura para quien venga después. Y nunca dejes que cierren una pista por cómo suena. Por eso preguntamos primero. Por eso nos cuidamos».`, `«Três coisas. Lembra quem construiu a pista: gente negra, queer, latina e trabalhadora que precisava de um lugar seguro. Mantém ela segura pra quem vier depois. E nunca deixa fecharem uma pista por causa do som que ela tem. É por isso que a gente pergunta primeiro. É por isso que a gente cuida um do outro».`),
    choices: [
      K('care', t(`"We'll remember who built it."`, `«Nos acordaremos de quién la construyó».`, `«Vamos lembrar de quem construiu».`), { do: { soc: 4, fun: 3, care: 1, flag: 'hugo_roots', quest: { sq_roots: 'done' } }, next: null })
    ]
  };
  H.a.choices.splice(1, 0, K('ask', t(`"Where does all of this come from?"`, `«¿De dónde viene todo esto?»`, `«De onde vem tudo isso?»`), { free: true, next: 'roots_gate' }));
  S.hugo_check = function () {
    const s = EM.state;
    if (s.quests.sq_roots === 'active' && s.flags.hugo_s1 && s.flags.hugo_s2 && s.flags.hugo_s3 && !s.flags.hugo_roots && !s.flags.hugo_3_toast) {
      s.flags.hugo_3_toast = true;
      U.toast({ icon: 'star', kind: 'info', ms: 6000, text: t(`Three cities in your head. Ask Hugo what we owe them.`, `Tres ciudades en la cabeza. Pregúntale a Hugo qué les debemos.`, `Três cidades na cabeça. Pergunta pro Hugo o que a gente deve a elas.`) });
    }
  };
  if (story.morningRefs) story.morningRefs.push({ id: 'hugo_roots', who: 'hugo', ok: function (s) { return !!s.flags.hugo_roots; }, t: t(`you asked where it all comes from. that made an old man's week. go dance. remember who built the floor.`, `preguntaste de dónde viene todo. eso le hizo la semana a un viejo. ve a bailar. recuerda quién construyó la pista.`, `você perguntou de onde vem tudo. isso fez a semana de um velho. vai dançar. lembra quem construiu a pista.`) });

  /* ============================================================ 4. THE LICENCE: the challenge, at the club */
  EM.CAST.valdes = { name: 'SRA. VALDÉS', look: look({ skin: 3, hair: 7, hc: 0, expr: 1, top: 6, tc: 8, bottom: 0, bc: 4, acc: 0, ac: 0 }) };
  EM.QUESTS.sq_licence = {
    title: t('THE LICENCE', 'LA LICENCIA', 'A LICENÇA'),
    desc: function (s) {
      return t(`A neighbour has complained about the noise and the council reviews the late licence on Monday. If it goes, the room goes, and the jobs with it. Ofelia needs three letters. ${mk(s, 'lic_hugo')} Hugo (main floor). ${mk(s, 'lic_luca')} Luca (coat check). ${mk(s, 'lic_neigh')} The neighbour herself, Sra. Valdés (the pavement outside). Then tell Ofelia.`, `Una vecina se quejó del ruido y el consejo revisa la licencia nocturna el lunes. Si se cae, se cae el local y los empleos con él. Ofelia necesita tres cartas. ${mk(s, 'lic_hugo')} Hugo (pista principal). ${mk(s, 'lic_luca')} Luca (guardarropa). ${mk(s, 'lic_neigh')} La propia vecina, la Sra. Valdés (la banqueta de afuera). Luego avísale a Ofelia.`, `Uma vizinha reclamou do barulho e a prefeitura revisa a licença noturna na segunda. Se cair, cai o lugar, e os empregos junto. A Ofelia precisa de três cartas. ${mk(s, 'lic_hugo')} Hugo (pista principal). ${mk(s, 'lic_luca')} Luca (chapelaria). ${mk(s, 'lic_neigh')} A própria vizinha, a Sra. Valdés (a calçada lá fora). Depois avise a Ofelia.`);
    },
    doneText: t(`You listened to the person the music keeps awake, and the room got another chance.`, `Escuchaste a la persona a quien la música desvela, y el local tuvo otra oportunidad.`, `Você ouviu a pessoa que a música deixa acordada, e o lugar ganhou outra chance.`)
  };
  const OF = D.ofelia.nodes;
  OF.normal.choices.splice(1, 0, K('ask', t(`"You look worried."`, `«Te ves preocupada».`, `«Você parece preocupada».`), { req: function (s) { return !L.rave() && !s.flags.lic_open; }, free: true, next: 'lic' }),
    K('care', t(`"I have the letters."`, `«Tengo las cartas».`, `«Tenho as cartas».`), { req: function (s) { return s.quests.sq_licence === 'active'; }, free: true, next: 'lic_report' }));
  OF.lic = {
    text: t(`Ofelia stops walking, which she never does. "The people in the block over the street filed a complaint. Noise, smoke, people on the pavement at six. The council reviews our late licence on Monday. If it goes, this room goes. Forty people lose a night job. Rosa, Luca, Isi's crew, me." A beat. "They don't need us to be perfect. They need somebody to listen. Hugo, Luca and Sra. Valdés herself, on the pavement. Three letters."`, `Ofelia deja de caminar, algo que nunca hace. «La gente del edificio de enfrente presentó una queja. Ruido, humo, gente en la banqueta a las seis. El consejo revisa nuestra licencia nocturna el lunes. Si se cae, se cae el local. Cuarenta personas pierden un trabajo de noche. Rosa, Luca, el equipo de Isi, yo». Una pausa. «No necesitan que seamos perfectos. Necesitan que alguien escuche. Hugo, Luca y la propia Sra. Valdés, en la banqueta. Tres cartas».`, `A Ofelia para de andar, coisa que ela nunca faz. «O pessoal do prédio da frente fez uma reclamação. Barulho, fumaça, gente na calçada às seis. A prefeitura revisa a nossa licença noturna na segunda. Se cair, cai o lugar. Quarenta pessoas perdem um emprego de noite. Rosa, Luca, a equipe da Isi, eu». Uma pausa. «Eles não precisam que a gente seja perfeito. Precisam que alguém escute. Hugo, Luca e a própria Sra. Valdés, na calçada. Três cartas».`),
    once: true, do: { flag: 'lic_open' },
    choices: [
      K('care', t(`"I'll get them."`, `«Yo las consigo».`, `«Eu consigo».`), { do: { quest: { sq_licence: 'active' }, soc: 2 }, next: null }),
      K('chill', t(`"Not tonight."`, `«Esta noche no».`, `«Hoje não».`), { free: true, next: null })
    ]
  };
  /* the quest can be picked up on a second visit */
  OF.lic_again = { text: t(`"Three letters. Hugo, Luca, Sra. Valdés. I'll be here, walking."`, `«Tres cartas. Hugo, Luca, la Sra. Valdés. Aquí estaré, caminando».`, `«Três cartas. Hugo, Luca, a Sra. Valdés. Vou estar aqui, andando».`), choices: [K('care', t(`"I'll get them."`, `«Yo las consigo».`, `«Eu consigo».`), { do: { quest: { sq_licence: 'active' } }, next: null })] };
  OF.lic_report = {
    text: function (s) {
      const n = ['lic_hugo', 'lic_luca', 'lic_neigh'].filter(function (f) { return s.flags[f]; }).length;
      if (n >= 3) return t(`Ofelia reads all three twice. "Hugo wrote about the floor. Luca wrote about a job. And Sra. Valdés wrote that she wants a phone number that rings a person. They asked for that number at the council." She lets out a long breath. "We keep the licence."`, `Ofelia lee las tres dos veces. «Hugo escribió sobre la pista. Luca sobre un empleo. Y la Sra. Valdés escribió que quisiera un número de teléfono que conteste una persona. Ese número lo pidieron en el consejo». Suelta un suspiro largo. «Nos quedamos con la licencia».`, `A Ofelia lê as três duas vezes. «O Hugo escreveu sobre a pista. O Luca sobre um emprego. E a Sra. Valdés escreveu que gostaria de um telefone que uma pessoa atenda. Esse número foi pedido na prefeitura». Ela solta um longo suspiro. «A gente fica com a licença».`);
      if (n === 2) return t(`Ofelia reads the two letters. "A year, with conditions. It is not nothing. It is not the whole thing."`, `Ofelia lee las dos cartas. «Un año, con condiciones. No es nada. No es todo».`, `A Ofelia lê as duas cartas. «Um ano, com condições. Não é nada. Não é tudo».`);
      return t(`Ofelia turns the one letter over. "Under review. We'll know on Monday." She is kind about it. It does not help.`, `Ofelia da vuelta a la única carta. «En revisión. Lo sabremos el lunes». Lo dice con cariño. No ayuda.`, `A Ofelia vira a única carta. «Em revisão. A gente sabe na segunda». Ela diz com carinho. Não ajuda.`);
    },
    choices: [
      K('care', t(`"Thank you, Ofelia."`, `«Gracias, Ofelia».`, `«{Obrigado|Obrigada|Valeu}, Ofelia».`), { do: { call: 'lic_close' }, next: null })
    ]
  };
  S.lic_close = function () {
    const s = EM.state, n = ['lic_hugo', 'lic_luca', 'lic_neigh'].filter(function (f) { return s.flags[f]; }).length;
    if (s.flags.lic_closed) return;
    s.flags.lic_closed = true;
    if (n >= 2) s.flags.licence_ok = true; else s.flags.licence_risk = true;
    L.setQuest('sq_licence', 'done');
    L.apply({ fun: 2 * n, soc: 2 * n, care: n >= 2 ? 1 : 0 });
  };
  /* the letters */
  D.hugo.nodes.lic_gate = { branch: [{ req: function (s) { return !!(s.flags.hugo_s1 || s.flags.hugo_s2 || s.flags.hugo_s3); }, to: 'lic_yes' }, { req: function () { return true; }, to: 'lic_no' }] };
  D.hugo.nodes.lic_no = { text: t(`"A letter needs a reason. Ask me where it all comes from first, and then I'll write you one that Monday will read."`, `«Una carta necesita una razón. Pregúntame primero de dónde viene todo esto y entonces te escribo una que el lunes lea».`, `«Uma carta precisa de um motivo. Pergunta primeiro de onde vem tudo isso e aí eu escrevo uma que a segunda leia».`), next: 'a' };
  D.hugo.nodes.lic_yes = {
    text: t(`Hugo writes in pencil on the back of a flyer: "It was a floor, and then it was a home." He signs it: Hugo, forty years.`, `Hugo escribe a lápiz en el dorso de un volante: «Era una pista y luego fue un hogar». Firma: Hugo, cuarenta años.`, `O Hugo escreve a lápis no verso de um panfleto: «Era uma pista e depois virou um lar». Assina: Hugo, quarenta anos.`),
    choices: [K('care', t(`"Thank you, Hugo." [Take the letter]`, `«Gracias, Hugo». [Tomar la carta]`, `«{Obrigado|Obrigada|Valeu}, Hugo». [Pegar a carta]`), { do: { soc: 2, fun: 2, flag: 'lic_hugo' }, next: null })]
  };
  D.hugo.nodes.a.choices.splice(2, 0, K('care', t(`"Ofelia needs a letter for the licence."`, `«Ofelia necesita una carta para la licencia».`, `«A Ofelia precisa de uma carta pra licença».`), { req: function (s) { return s.quests.sq_licence === 'active' && !s.flags.lic_hugo; }, free: true, next: 'lic_gate' }));
  if (D.luca) {
    D.luca.nodes.lic = { text: t(`Luca folds his arms. "A letter. Fine. 'I have a job with a pension and a union card. It exists because this room does.'" He considers. "Sit. Let me describe my dread first. It is four chapters, and it is going to be in the letter."`, `Luca cruza los brazos. «Una carta. Bueno. 'Tengo un empleo con pensión y carnet sindical. Existe porque este local existe'». Lo piensa. «Siéntate. Primero déjame describirte mi angustia. Son cuatro capítulos y va a ir en la carta».`, `O Luca cruza os braços. «Uma carta. Tá. 'Tenho um emprego com previdência e carteirinha do sindicato. Ele existe porque esse lugar existe'». Ele pensa. «Senta. Primeiro deixa eu descrever minha angústia. São quatro capítulos e vai entrar na carta».`),
      choices: [
        K('care', t(`Sit and listen to all four chapters.`, `Sentarte y escuchar los cuatro capítulos.`, `Sentar e ouvir os quatro capítulos.`), { do: { time: 8, soc: -3, flag: 'lic_luca' }, next: null, react: t(`Four chapters later he signs it with a flourish. "It's the best thing I've written. I wrote a novel once. This is better."`, `Cuatro capítulos después la firma con un gesto grande. «Es lo mejor que he escrito. Una vez escribí una novela. Esto es mejor».`, `Quatro capítulos depois ele assina com um floreio. «É a melhor coisa que já escrevi. Uma vez escrevi um romance. Isso é melhor».`) }),
        K('chill', t(`"Another time."`, `«Otra vez».`, `«Outra hora».`), { free: true, next: null })
      ] };
    D.luca.nodes.a.choices.splice(2, 0, K('care', t(`"Ofelia needs a letter for the licence."`, `«Ofelia necesita una carta para la licencia».`, `«A Ofelia precisa de uma carta pra licença».`), { req: function (s) { return s.quests.sq_licence === 'active' && !s.flags.lic_luca; }, free: true, next: 'lic' }));
  }
  D.valdes = {
    who: 'valdes', role: t('NEIGHBOUR', 'VECINA', 'VIZINHA'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'lic_neigh' }, to: 'after' }, { req: function (s) { return ['lic_n1', 'lic_n2', 'lic_n3', 'lic_n4'].filter(function (f) { return s.flags[f]; }).length >= 2; }, to: 'ok' }, { req: function (s) { return (s.valdesShut || 0) > s.time; }, to: 'shut' }, { req: function () { return true; }, to: 'a' }] },
      after: { text: t(`Sra. Valdés raises the thermos a little. "Go home safe. And tell the one with the radio I'll call."`, `La Sra. Valdés levanta un poco el termo. «Vuelve a casa a salvo. Y dile a la de la radio que voy a llamar».`, `A Sra. Valdés levanta um pouco a garrafa térmica. «Volte pra casa em segurança. E diz pra da rádio que eu vou ligar».`), choices: [LEAVE()] },
      shut: { text: t(`"Not now." She does not look at you. "An hour. Then, if you still want to talk, I'll be here. I'm always here. It's my pavement."`, `«Ahora no». No te mira. «Una hora. Luego, si todavía quieres hablar, aquí estaré. Siempre estoy aquí. Es mi banqueta».`, `«Agora não». Ela não te olha. «Uma hora. Depois, se ainda quiser conversar, eu tô aqui. Eu sempre tô aqui. É a minha calçada».`), choices: [LEAVE()] },
      a: {
        text: t(`A woman in a dressing gown on the pavement, thermos in hand, eye mask pushed up on her forehead. "Six in the morning. Every Saturday. The bass comes up through the bed. I am not a monster. I get up at half past four."`, `Una mujer en bata en la banqueta, con un termo en la mano y el antifaz en la frente. «Las seis de la mañana. Todos los sábados. El bajo sube por la cama. No soy un monstruo. Soy una mujer que se levanta a las cuatro y media».`, `Uma mulher de roupão na calçada, garrafa térmica na mão, tapa-olho empurrado pra testa. «Seis da manhã. Todo sábado. O grave sobe pela cama. Eu não sou um monstro. Sou uma mulher que acorda às quatro e meia».`),
        choices: [
          K('honest', t(`"That sounds exhausting. Tell me what it's like."`, `«Suena agotador. Cuéntame cómo es».`, `«Parece exaustivo. Me conta como é».`), { do: { soc: -2, time: 6 }, next: 'listen' }),
          K('blunt', t(`"It's a nightclub. What did you expect?"`, `«Es un club. ¿Qué esperabas?»`, `«É uma balada. O que você esperava?»`), { bad: true, do: { soc: -3, flag: 'valdes_rude' }, call: 'valdes_shut', next: null, react: t(`"Good morning to you too." She pulls the eye mask down and turns her back.`, `«Buenos días para ti también». Se baja el antifaz y te da la espalda.`, `«Bom dia pra você também». Ela abaixa o tapa-olho e vira de costas.`) }),
          LEAVE()
        ]
      },
      listen: {
        text: t(`"I don't mind the music. I like it, on a good night, through the window. I mind that I can't sleep between eleven and four, that the smokers stand under my balcony, and that when I phone nobody picks up. I phoned the police twice. They did nothing. I'd rather speak to a person."`, `«La música no me molesta. Me gusta, en una buena noche, por la ventana. Me molesta no poder dormir entre las once y las cuatro, que los fumadores se paren bajo mi balcón y que cuando llamo nadie conteste. Llamé dos veces a la policía. No hicieron nada. Preferiría hablar con una persona».`, `«Eu não me incomodo com a música. Gosto, numa boa noite, pela janela. Me incomoda não conseguir dormir entre onze e quatro, os fumantes ficarem embaixo da minha varanda e, quando eu ligo, ninguém atender. Liguei duas vezes pra polícia. Não fizeram nada. Preferia falar com uma pessoa».`),
        next: 'help'
      },
      help: {
        text: t(`She waits. "What can you actually offer?"`, `Espera. «¿Qué puedes ofrecer de verdad?»`, `Ela espera. «O que você pode oferecer de verdade?»`),
        choices: [
          K('plan', t(`A number that rings a person: Ofelia's radio.`, `Un número que contesta una persona: la radio de Ofelia.`, `Um número que uma pessoa atende: o rádio da Ofelia.`), { req: { no: 'lic_n1' }, free: true, do: { flag: 'lic_n1', soc: 1 }, next: 'check' }),
          K('plan', t(`The smokers go to the courtyard side, not under your balcony.`, `Los fumadores van al lado del patio, no bajo tu balcón.`, `Os fumantes vão pro lado do pátio, não embaixo da sua varanda.`), { req: { no: 'lic_n2' }, free: true, do: { flag: 'lic_n2', soc: 1 }, next: 'check' }),
          K('plan', t(`The roof set after six stays low. ÆRIEL will agree.`, `El set del techo después de las seis se queda bajo. ÆRIEL va a aceptar.`, `O set do terraço depois das seis fica baixo. A ÆRIEL vai concordar.`), { req: { no: 'lic_n3' }, free: true, do: { flag: 'lic_n3', soc: 1 }, next: 'check' }),
          K('care', t(`A pair of foam earplugs from Reduciendo Daño.`, `Unos tapones de espuma de Reduciendo Daño.`, `Um par de protetores de espuma da Reduciendo Daño.`), { req: function (s) { return (IT.inv(s).earplugs || 0) > 0 && !s.flags.lic_n4; }, free: true, do: { flag: 'lic_n4', soc: 1 }, call: 'valdes_plugs', next: 'check' })
        ]
      },
      check: { branch: [{ req: function (s) { return ['lic_n1', 'lic_n2', 'lic_n3', 'lic_n4'].filter(function (f) { return s.flags[f]; }).length >= 2; }, to: 'ok' }, { req: function () { return true; }, to: 'help' }] },
      ok: {
        text: t(`Sra. Valdés writes three lines on a card and underlines twice: for tonight, she'll hold off until Monday. "Keep the smokers off my balcony and the roof low, and we'll see how Monday goes." She hands it over.`, `La Sra. Valdés escribe tres líneas en una tarjeta y subraya dos veces: por esta noche, espera hasta el lunes. «Saquen a los fumadores de mi balcón, bajen el techo, y el lunes vemos». Te la entrega.`, `A Sra. Valdés escreve três linhas num cartão e sublinha duas vezes: por hoje, ela segura até segunda. «Tirem os fumantes da minha varanda, baixem o terraço, e segunda a gente vê». Ela entrega.`),
        choices: [K('care', t(`"Thank you, Sra. Valdés." [Take the card]`, `«Gracias, Sra. Valdés». [Tomar la tarjeta]`, `«{Obrigado|Obrigada|Valeu}, Sra. Valdés». [Pegar o cartão]`), { do: { fun: 4, soc: 4, care: 1, flag: 'lic_neigh' }, next: null })]
      }
    }
  };
  S.valdes_shut = function () { const s = EM.state; s.valdesShut = s.time + 60; };
  S.valdes_plugs = function () { const i = IT.inv(EM.state); if (i.earplugs > 0) i.earplugs--; };
  Z.doors.npc({ id: 'valdes', x: 22.5, y: 8.5, dlg: 'valdes', dir: 'l', reach: 18, when: function (s) { return s.venue !== 'rave' && s.quests.sq_licence === 'active' && !s.flags.lic_closed; } });
  /* picking the quest up again after you walked away from Ofelia */
  OF.normal.choices.splice(2, 0, K('care', t(`"What was it about the licence again?"`, `«¿Qué era lo de la licencia?»`, `«Qual era a da licença mesmo?»`), { req: function (s) { return !!s.flags.lic_open && !s.quests.sq_licence; }, free: true, next: 'lic_again' }));
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'lic_ok', who: 'ofelia', ok: function (s) { return !!s.flags.licence_ok; }, t: t(`the council read the letters. the one from the woman in the dressing gown did it. we keep the late licence, with conditions, and she has our number. thank you for listening to her.`, `el consejo leyó las cartas. la de la mujer en bata fue la que lo logró. nos quedamos con la licencia nocturna, con condiciones, y ella tiene nuestro número. gracias por escucharla.`, `a prefeitura leu as cartas. a da mulher de roupão foi a que resolveu. a gente fica com a licença noturna, com condições, e ela tem nosso número. obrigada por ouvir ela.`) });
    R.push({ id: 'lic_risk', who: 'ofelia', ok: function (s) { return !!s.flags.licence_risk; }, t: t(`the licence is under review. we'll know monday. not your fault. next time we listen sooner.`, `la licencia está en revisión. lo sabremos el lunes. no es tu culpa. la próxima escuchamos antes.`, `a licença tá em revisão. a gente sabe na segunda. não é culpa sua. da próxima a gente escuta mais cedo.`) });
  }
})();

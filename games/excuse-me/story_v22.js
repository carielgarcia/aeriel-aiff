/* EXCUSE ME — story v22: from the dancefloor to the sunrise. Three main missions between NOBODY LEFT BEHIND and THE CLOSING SET:
   THE SET FOR YOUR PEOPLE (dance with each friend on the main floor, learn what they need),
   THANK ÆRIEL (reach the DJ in the booth, through the crowd, and say what you learned),
   THE REQUEST LINE (backstage, FRAMES SHELL takes the requests and the mood and pitches the set).
   ÆRIEL now works in the booth on the main floor. FRAMES SHELL, one of ÆRIEL's people, holds the crate backstage.
   At the sunrise ÆRIEL listens to FRAMES SHELL half the time and plays what the friends needed the other half (seeded, so
   BEGIN AGAIN rolls the same). Needs: Maru warm, Dani wild, Tato soft. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, S = EM.scripts, D = EM.DIALOGUES, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const mk = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };
  const CORE = ['maru', 'dani', 'tato'];
  const NEED = { maru: 'warm', dani: 'wild', tato: 'soft' };
  const MOODS = ['warm', 'wild', 'soft'];
  /* what each request asks the set to be */
  const REQ_MOOD = { fr_req_sad: 'soft', fr_req_wobble: 'wild', fr_req_melody: 'wild', fr_req_nervous: 'soft' };

  /* ============================================================ FRAMES SHELL */
  EM.CAST.frames = { name: 'FRAMES SHELL', look: { skin: 2, hair: 4, hc: 3, expr: 1, top: 3, tc: 2, bottom: 1, bc: 1, acc: 2, wide: false } };

  /* ============================================================ PLACEMENT
     The DJ is in the booth, at the top of the main floor, and can be talked to.
     FRAMES SHELL spins Sala 2 until 02:30 (270), then moves backstage with the crate when APÜD takes over. */
  const dj = EM.zones.main.ents.filter(function (e) { return e.id === 'dj'; })[0];
  if (dj) { dj.cast = 'resident'; dj.y = 4.4; dj.dlg = 'resident'; dj.reach = 30; dj.decor = false; }
  const bs = EM.zones.backstage.ents.filter(function (e) { return e.id === 'resident'; })[0];
  if (bs) {
    bs.id = 'frames'; bs.cast = 'frames'; bs.dlg = 'frames';
    bs.when = function (s) { return s.time >= 270 && !s.flags.roof_open; };
  }
  EM.zones.backstage.obj({
    id: 'frames_crate_early', kind: 'vinyl_crate', sp: 'vinyl_crate', x: 11, y: 7, w: 1, h: 1,
    dlg: 'frames_crate_early', label: t('RECORD CRATE', 'CAJÓN DE DISCOS', 'CAIXOTE DE DISCOS'),
    when: function (s) { return s.time < 270 && !s.flags.roof_open; }
  });
  EM.objects.vinyl_crate = function (ent) {
    if (ent && ent.def && ent.def.dlg) U.startDialogue(ent.def.dlg, {});
  };
  EM.objects.DJ = function (ent) {
    if (ent && ent.def && ent.def.dlg) U.startDialogue(ent.def.dlg, {});
  };

  /* ============================================================ THE QUESTS */
  const Q = {
    q10: {
      title: t('THE SET FOR YOUR PEOPLE', 'EL SET PARA TU GENTE', 'O SET PRA SUA GALERA'),
      desc: function (s) {
        return t(`ÆRIEL will ask what your people need from the last hour. Dance with each of them on the main floor and find out. ${mk(s, 'need_done_maru')} Maru ${mk(s, 'need_done_dani')} Dani ${mk(s, 'need_done_tato')} Tato`,
          `ÆRIEL va a preguntar qué necesita tu gente de la última hora. Baila con cada quien en la pista principal y averígualo. ${mk(s, 'need_done_maru')} Maru ${mk(s, 'need_done_dani')} Dani ${mk(s, 'need_done_tato')} Tato`,
          `A ÆRIEL vai perguntar do que sua galera precisa na última hora. Dance com cada pessoa na pista principal e descubra. ${mk(s, 'need_done_maru')} Maru ${mk(s, 'need_done_dani')} Dani ${mk(s, 'need_done_tato')} Tato`);
      },
      doneText: t(`You know what your people need, or you know you don't. Either way, ÆRIEL will ask.`, `Sabes qué necesita tu gente, o sabes que no lo sabes. De cualquier forma, ÆRIEL va a preguntar.`, `Você sabe do que sua galera precisa, ou sabe que não sabe. De qualquer jeito, a ÆRIEL vai perguntar.`)
    },
    q11: {
      title: t('THANK ÆRIEL', 'AGRADÉCELE A ÆRIEL', 'AGRADEÇA À ÆRIEL'),
      desc: t(`The DJ booth is at the top of the main floor, behind the crowd. Say thank you, and say what your people need.`, `La cabina del DJ está al fondo de la pista principal, detrás de la multitud. Da las gracias y di qué necesita tu gente.`, `A cabine do DJ fica no fundo da pista principal, atrás da multidão. Agradeça e diga do que sua galera precisa.`),
      doneText: t(`Said. ÆRIEL has what you know.`, `Dicho. ÆRIEL tiene lo que sabes.`, `Dito. A ÆRIEL ficou com o que você sabe.`)
    },
    q12: {
      title: t('THE REQUEST LINE', 'LA LÍNEA DE PEDIDOS', 'A LINHA DE PEDIDOS'),
      desc: function (s) {
        if (s && s.time < 270) return t(`ÆRIEL doesn't take requests. FRAMES SHELL is spinning Sala 2 until 02:30 AM, then brings the request crate backstage. Catch him upstairs or meet him backstage after 02:30.`, `ÆRIEL no acepta pedidos. FRAMES SHELL pincha en Sala 2 hasta las 02:30 AM y luego baja al backstage con el cajón. Alcánzalo arriba o encuéntralo en backstage después de las 02:30.`, `A ÆRIEL não aceita pedidos. O FRAMES SHELL toca na Sala 2 até 02:30 AM e depois desce pro backstage com o caixote. Fale com ele lá em cima ou encontre ele no backstage depois das 02:30.`);
        return t(`ÆRIEL doesn't take requests. Backstage, FRAMES SHELL does, and pitches the set to ÆRIEL. Bring what people asked you to carry, and say what the room needs.`, `ÆRIEL no acepta pedidos. En el backstage, FRAMES SHELL sí, y le propone el set a ÆRIEL. Lleva lo que te pidieron cargar y di qué necesita la sala.`, `A ÆRIEL não aceita pedidos. No backstage, quem recebe é FRAMES SHELL, que sugere o set pra ÆRIEL. Leve o que te pediram pra carregar e diga do que a sala precisa.`);
      },
      doneText: t(`Pitched. Whether ÆRIEL listens is ÆRIEL's call.`, `Propuesto. Que ÆRIEL escuche es decisión de ÆRIEL.`, `Sugerido. Se a ÆRIEL escuta é com a ÆRIEL.`)
    }
  };
  /* keep the MISSIONS list in the order you play it: ... NOBODY LEFT BEHIND, the three new ones, THE CLOSING SET */
  (function () {
    const old = EM.QUESTS, ordered = {};
    Object.keys(old).forEach(function (k) {
      if (k === 'q9') { ordered.q10 = Q.q10; ordered.q11 = Q.q11; ordered.q12 = Q.q12; }
      ordered[k] = old[k];
    });
    EM.QUESTS = ordered;
  })();

  const obj0 = story.objective;
  story.objective = function (s) {
    const q = s.quests;
    if (q.q9 !== 'active') {
      if (q.q10 === 'active') return t('Dance with your people on the main floor. Find out what each one needs.', 'Baila con tu gente en la pista principal. Averigua qué necesita cada quien.', 'Dance com sua galera na pista principal. Descubra do que cada pessoa precisa.');
      if (q.q11 === 'active') return t('Reach the booth at the top of the main floor. Thank ÆRIEL.', 'Llega a la cabina al fondo de la pista principal. Agradécele a ÆRIEL.', 'Chegue à cabine no fundo da pista principal. Agradeça à ÆRIEL.');
      if (q.q12 === 'active') return s.time < 270
        ? t('FRAMES SHELL spins Sala 2 until 02:30 AM, then moves backstage. Catch him upstairs or meet him backstage after 02:30.', 'FRAMES SHELL pincha en Sala 2 hasta las 02:30 AM y luego baja al backstage. Alcánzalo arriba o ve al backstage después de las 02:30.', 'O FRAMES SHELL toca na Sala 2 até 02:30 AM e depois desce pro backstage. Fale com ele lá em cima ou vá pro backstage depois das 02:30.')
        : t('Go backstage. Give FRAMES SHELL the requests.', 'Ve al backstage. Dale los pedidos a FRAMES SHELL.', 'Vá ao backstage. Entregue os pedidos pro FRAMES SHELL.');
    }
    return obj0(s);
  };

  /* the stars and arrows that lead you to the DJ and to FRAMES SHELL */
  EM.seekers.push(function (s) {
    const q = s.quests, res = [];
    if (q.q11 === 'active') res.push({ key: 'dj', zone: 'main', label: '★' });
    if (q.q12 === 'active') res.push(s.time < 270 ? { key: 'frames_attic', zone: 'attic', label: '★' } : { key: 'frames', zone: 'backstage', label: '★' });
    return res;
  });

  /* ============================================================ 1. THE SET FOR YOUR PEOPLE
     On the main floor, each friend asks you for one song. A good dance and they tell you what they need;
     "not tonight" skips them and you will have to guess. */
  const NEEDS = {
    maru: {
      ask: t(`MARU puts her phone in her back pocket. "Okay. One song with me. After that I'll tell you what I need from the rest of tonight."`, `MARU se guarda el celular en el bolsillo de atrás. «Bueno. Una canción conmigo. Después te digo qué necesito del resto de esta noche».`, `A MARU guarda o celular no bolso de trás. «Tá. Uma música comigo. Depois te digo do que eu preciso no resto da noite».`),
      dance: t(`Dance with Maru.`, `Bailar con Maru.`, `Dançar com a Maru.`),
      skip: t(`"Okay. Guess well."`, `«Bueno. Adivina bien».`, `«Tá. Chuta bem».`),
      tell: t(`MARU, out of breath: "Okay. I need everyone where I can count them. A long chord, nothing sudden. Warm. That's all."`, `MARU, sin aire: «Bueno. Necesito a todos donde pueda contarlos. Un acorde largo, nada brusco. Cálido. Eso es todo».`, `A MARU, sem fôlego: «Tá. Preciso de todo mundo onde eu possa contar. Um acorde longo, nada brusco. Quente. É só isso».`)
    },
    dani: {
      ask: t(`DANI: "ONE SONG. Then I'll tell you what I need. It's a secret and it's loud."`, `DANI: «UNA CANCIÓN. Después te digo qué necesito. Es un secreto y es fuerte».`, `DANI: «UMA MÚSICA. Depois eu falo do que preciso. É segredo e é alto».`),
      dance: t(`Dance with Dani.`, `Bailar con Dani.`, `Dançar com o Dani.`),
      skip: t(`"Okay! Guess right, though."`, `«¡Bueno! Pero adivina bien».`, `«Beleza! Mas chuta certo».`),
      tell: t(`DANI, still bouncing: "LOUD. I want to scream at the sky and have the sky scream back. Tell the DJ. Tell EVERYONE."`, `DANI, todavía rebotando: «FUERTE. Quiero gritarle al cielo y que el cielo me grite de vuelta. Dile al DJ. Díselo a TODOS».`, `O DANI, ainda pulando: «ALTO. Quero gritar pro céu e o céu gritar de volta. Fala pro DJ. Fala pra TODO MUNDO».`)
    },
    tato: {
      ask: t(`TATO: "Would you… one song? Slow. I'll tell you after."`, `TATO: «¿Podrías… una canción? Lenta. Después te cuento».`, `TATO: «Você poderia… uma música? Lenta. Depois eu conto».`),
      dance: t(`Dance with Tato.`, `Bailar con Tato.`, `Dançar com o Tato.`),
      skip: t(`"…Okay. Guess carefully."`, `«…Bueno. Adivina con cuidado».`, `«…Tá. Chuta com cuidado».`),
      tell: t(`TATO, low: "Something soft. I've been loud all night. I'd like the rest to be quiet. Not empty. Quiet."`, `TATO, bajito: «Algo suave. Estuve fuerte toda la noche. Quisiera que el resto fuera tranquilo. No vacío. Tranquilo».`, `O TATO, baixinho: «Algo suave. Fiquei alto a noite toda. Queria que o resto fosse quieto. Não vazio. Quieto».`)
    }
  };
  CORE.forEach(function (f) {
    const N = NEEDS[f];
    D['need_' + f] = {
      who: f, role: t('A SONG', 'UNA CANCIÓN', 'UMA MÚSICA'), start: 'a', nodes: {
        a: {
          text: N.ask,
          choices: [
            K('dance', N.dance, { free: true, call: 'need_dance_' + f, next: null }),
            K('chill', t(`"Not tonight. I'll guess."`, `«Esta noche no. Voy a adivinar».`, `«Hoje não. Vou chutar».`), { do: { flag: ['need_done_' + f, 'need_skip_' + f] }, call: 'v22_q10check', next: null, react: N.skip }),
            K('chill', t(`"Give me a minute."`, `«Dame un minuto».`, `«Me dá um minuto».`), { free: true, call: 'need_wait_' + f, next: null })
          ]
        }
      }
    };
    D['need_tell_' + f] = {
      who: f, role: t('A SONG', 'UNA CANCIÓN', 'UMA MÚSICA'), forced: true, start: 'a', nodes: {
        a: { text: N.tell, do: { flag: ['need_done_' + f, 'learned_' + f] }, next: null }
      }
    };
    S['need_dance_' + f] = function () {
      U.partnerDance(f, function (res) {
        const b = {}; b[f] = res.grade === 'win' ? 2 : (res.grade === 'partial' ? 1 : 0);
        L.apply(res.grade === 'win' ? { fun: 10, soc: 3, bond: b } : (res.grade === 'partial' ? { fun: 5, soc: 1, bond: b } : (res.grade === 'fail' ? { fun: 2 } : {})));
        L.spend(5);
        if (EM.state.ended) return;
        if (res.grade === 'win' || res.grade === 'partial') {
          setTimeout(function () { if (!EM.state.ended && !U.D) U.startDialogue('need_tell_' + f, { npc: f, onEnd: S.v22_q10check }); }, 150);
        } else if (res.grade === 'fail') {
          U.toast({ icon: 'sweat', kind: 'info', ms: 4500, text: t('That was not your best song. They will dance with you again.', 'No fue tu mejor canción. Van a volver a bailar contigo.', 'Não foi sua melhor música. Eles vão dançar com você de novo.') });
        }
      });
    };
    S['need_wait_' + f] = function () { const s = EM.state; (s.needWait = s.needWait || {})[f] = s.time + 8; };
  });
  S.v22_q10check = function () {
    const s = EM.state;
    if (s.quests.q10 !== 'active') return;
    const present = CORE.filter(function (f) { return L.hasFriend(f); });
    if (present.length && present.every(function (f) { return s.flags['need_done_' + f]; })) L.apply({ quest: { q10: 'done', q11: 'active' } });
  };

  const tick0 = story.tick;
  let needT = 12;
  story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state; if (!s || s.ended || U.mode !== 'play') return;
    /* the roof opens: whatever is unfinished stays unfinished, and the night goes on */
    if (s.flags.roof_open && !s.flags.v22_closed) {
      s.flags.v22_closed = true;
      const open = ['q10', 'q11', 'q12'].filter(function (q) { return s.quests[q] === 'active'; });
      open.forEach(function (q) { L.setQuest(q, 'done'); });
      if (open.length) U.toast({ icon: 'star', kind: 'info', ms: 6000, text: t('The roof is open. ÆRIEL plays with what ÆRIEL has.', 'El techo está abierto. ÆRIEL toca con lo que tiene.', 'O terraço está aberto. A ÆRIEL toca com o que tem.') });
    }
    if (s.quests.q12 === 'active' && s.flags.frames_told) L.setQuest('q12', 'done');
    /* your people ask you for a song, but only on the main floor */
    if (s.quests.q10 === 'active' && s.zone === 'main' && !U.D) {
      needT -= dt;
      if (needT > 0) return;
      needT = 35;
      const w = s.needWait || {};
      const f = CORE.filter(function (x) { return L.hasFriend(x) && !s.flags['need_done_' + x] && (w[x] || 0) <= s.time; })[0];
      if (f) U.startDialogue('need_' + f, { npc: f });
    }
  };

  /* ============================================================ 2. THANK ÆRIEL — the DJ in the booth */
  const R = D.resident;
  R.nodes.a.text = t(`ÆRIEL has one headphone on and both hands on the mixer. The booth is hot and smells of tea. "Short version: I'm mid-mix. If you're lost, the exit is behind you. If you're lucky, say it fast."`, `ÆRIEL tiene un auricular puesto y las dos manos en el mixer. La cabina está caliente y huele a té. «Versión corta: estoy a mitad de una mezcla. Si te perdiste, la salida está detrás de ti. Si tienes suerte, dilo rápido».`, `A ÆRIEL está com um fone no ouvido e as duas mãos no mixer. A cabine é quente e cheira a chá. «Versão curta: tô no meio de uma mixagem. Se você se perdeu, a saída fica atrás de você. Se teve sorte, fala rápido».`);
  R.nodes.a.choices.push(K('care', t(`"Thank you. For the drop."`, `«Gracias. Por el drop».`, `«Valeu. Pelo drop».`), { req: { quest: { q11: 'active' } }, next: 'thank' }));
  /* the old free pick of the closing mood is gone: the set comes from what you carried */
  R.nodes.play = {
    text: function (s) {
      if (s.time < 270) return t(`"I don't decide until I look at the room." ÆRIEL's eyes stay on the mixer. "FRAMES SHELL is spinning Sala 2 until 02:30 AM, then he brings the crate backstage and takes requests. I listen to him about half the time."`, `«No decido hasta mirar la sala». Los ojos de ÆRIEL siguen en el mixer. «FRAMES SHELL pincha en Sala 2 hasta las 02:30 AM, y luego baja al backstage con el cajón para recibir pedidos. Lo escucho más o menos la mitad de las veces».`, `«Eu só decido depois de olhar a sala». Os olhos da ÆRIEL continuam no mixer. «O FRAMES SHELL toca na Sala 2 até 02:30 AM e depois desce pro backstage com o caixote pra receber pedidos. Eu escuto ele mais ou menos metade das vezes».`);
      return t(`"I don't decide until I look at the room." ÆRIEL's eyes stay on the mixer. "FRAMES SHELL has the crate backstage now and takes requests. Tell FRAMES what you hear. I listen to FRAMES about half the time."`, `«No decido hasta mirar la sala». Los ojos de ÆRIEL siguen en el mixer. «FRAMES SHELL ya tiene el cajón en el backstage y recibe pedidos. Dile a FRAMES lo que oyes. Escucho a FRAMES más o menos la mitad de las veces».`, `«Eu só decido depois de olhar a sala». Os olhos da ÆRIEL continuam no mixer. «O FRAMES SHELL já tá com o caixote no backstage e recebe pedidos. Fala pro FRAMES o que você ouve. Eu escuto o FRAMES mais ou menos metade das vezes».`);
    },
    choices: [
      K('ask', t(`"How do I get backstage?"`, `«¿Cómo llego al backstage?»`, `«Como eu chego ao backstage?»`), { next: 'back' }),
      K('chill', t(`"Thanks."`, `«Gracias».`, `«Valeu».`), { free: true, next: null })
    ]
  };
  R.nodes.back = {
    text: t(`"Staff door, right of the booth. Rosa opens it for people she likes. I open it for people who bring water."`, `«Puerta de staff, a la derecha de la cabina. Rosa la abre para quien le cae bien. Yo la abro para quien trae agua».`, `«Porta do staff, à direita da cabine. A Rosa abre pra quem ela gosta. Eu abro pra quem traz água».`),
    next: null
  };
  R.nodes.friend = {
    text: function (s) {
      if (s.time < 270) return t(`ÆRIEL drinks half the bottle without looking up. "Nobody brings the DJ water. People bring the DJ shots." A pause. "The staff door is right of the booth. FRAMES is spinning Sala 2 until 02:30 AM; after that he's backstage with the crate."`, `ÆRIEL se toma la mitad de la botella sin levantar la vista. «Nadie le trae agua al DJ. La gente le trae shots». Una pausa. «La puerta de staff está a la derecha de la cabina. FRAMES pincha en Sala 2 hasta las 02:30 AM; después baja al backstage con el cajón».`, `A ÆRIEL bebe metade da garrafa sem levantar os olhos. «Ninguém traz água pro DJ. O pessoal traz shot». Uma pausa. «A porta do staff fica à direita da cabine. O FRAMES toca na Sala 2 até 02:30 AM; depois ele desce pro backstage com o caixote».`);
      return t(`ÆRIEL drinks half the bottle without looking up. "Nobody brings the DJ water. People bring the DJ shots." A pause. "The staff door is right of the booth. Tell FRAMES I sent you."`, `ÆRIEL se toma la mitad de la botella sin levantar la vista. «Nadie le trae agua al DJ. La gente le trae shots». Una pausa. «La puerta de staff está a la derecha de la cabina. Dile a FRAMES que te mando yo».`, `A ÆRIEL bebe metade da garrafa sem levantar os olhos. «Ninguém traz água pro DJ. O pessoal traz shot». Uma pausa. «A porta do staff fica à direita da cabine. Fala pro FRAMES que fui eu que mandei».`);
    },
    choices: [K('chill', t(`"Thanks."`, `«Gracias».`, `«Valeu».`), { free: true, next: null })]
  };

  R.nodes.thank = {
    text: t(`ÆRIEL takes one headphone off. "The floor did the drop. I held the door." A look at the crowd, then at you. "Your people. Who's with you?"`, `ÆRIEL se saca un auricular. «La pista hizo el drop. Yo sostuve la puerta». Una mirada a la multitud, luego a ti. «Tu gente. ¿Quién está contigo?»`, `A ÆRIEL tira um fone. «A pista fez o drop. Eu segurei a porta». Um olhar pra multidão, depois pra você. «Sua galera. Quem tá com você?»`),
    next: 'rp_maru_br'
  };
  /* one question per friend who is with you, in the same order every time */
  const ORDER = ['maru', 'dani', 'tato'];
  const ASK = {
    maru: t(`"Maru. What does she need from the last hour?"`, `«Maru. ¿Qué necesita de la última hora?»`, `«Maru. Do que ela precisa na última hora?»`),
    dani: t(`"Dani. And him?"`, `«Dani. ¿Y él?»`, `«Dani. E ele?»`),
    tato: t(`"Tato. And him?"`, `«Tato. ¿Y él?»`, `«Tato. E ele?»`)
  };
  const SAY = {
    warm: t(`"Warm. A long chord."`, `«Cálido. Un acorde largo».`, `«Quente. Um acorde longo».`),
    wild: t(`"Loud."`, `«Fuerte».`, `«Alto».`),
    soft: t(`"Soft. Quiet."`, `«Suave. Tranquilo».`, `«Suave. Quieto».`)
  };
  ORDER.forEach(function (f, i) {
    const nextBr = i + 1 < ORDER.length ? 'rp_' + ORDER[i + 1] + '_br' : 'rp_done';
    R.nodes['rp_' + f + '_br'] = { branch: [{ req: { with: f }, to: 'rp_' + f }, { req: function () { return true; }, to: nextBr }] };
    R.nodes['rp_' + f] = {
      text: ASK[f],
      choices: MOODS.map(function (m) {
        return K(m === 'wild' ? 'bold' : (m === 'soft' ? 'silent' : 'chill'), SAY[m], { do: { flag: ['told_' + f, 'told_' + f + '_' + m] }, next: nextBr });
      }).concat([K('chill', t(`"I don't know."`, `«No sé».`, `«Não sei».`), { do: { flag: ['told_' + f, 'told_' + f + '_none'] }, next: nextBr })])
    };
  });
  R.nodes.rp_done = {
    text: t(`"Noted. I'll know more at five." ÆRIEL puts the headphone back. "Go be where your people are."`, `«Anotado. Sabré más a las cinco». ÆRIEL se vuelve a poner el auricular. «Ve donde está tu gente».`, `«Anotado. Eu sei mais às cinco». A ÆRIEL põe o fone de volta. «Vai onde sua galera tá».`),
    do: { flag: ['thanked_dj', 'resident_met'], fun: 3, soc: 3, quest: { q11: 'done', q12: 'active' } }
  };

  /* ============================================================ 3. THE REQUEST LINE — FRAMES SHELL, backstage */
  const REQS = [
    { f: 'fr_req_sad', need: 'note_cleo', t: t(`Cleo's napkin: "the sad one at five".`, `La servilleta de Cleo: «la triste a las cinco».`, `O guardanapo da Cleo: «a triste às cinco».`) },
    { f: 'fr_req_wobble', need: 'req_wobble', t: t(`Isi's request: one wobble.`, `El pedido de Isi: un wobble.`, `O pedido da Isi: um wobble.`) },
    { f: 'fr_req_melody', need: 'hazel_tip', t: t(`Hazel's request: no melody, only the kick.`, `El pedido de Hazel: nada de melodía, solo el bombo.`, `O pedido da Hazel: sem melodia, só o bumbo.`) },
    { f: 'fr_req_nervous', need: 'kai_song', t: t(`Kai's song for somebody nervous.`, `La canción de Kai para alguien nervioso.`, `A música do Kai pra alguém nervoso.`) }
  ];
  const slots = function (s) { return REQS.filter(function (r) { return s.flags[r.f]; }).length; };
  const MOOD_SAY = {
    warm: t(`"The room needs something warm."`, `«La sala necesita algo cálido».`, `«A sala precisa de algo quente».`),
    wild: t(`"The room needs something loud."`, `«La sala necesita algo fuerte».`, `«A sala precisa de algo alto».`),
    soft: t(`"The room needs something soft."`, `«La sala necesita algo suave».`, `«A sala precisa de algo suave».`)
  };
  function menuChoices() {
    const c = [];
    MOODS.forEach(function (m) {
      c.push(K(m === 'wild' ? 'bold' : (m === 'soft' ? 'silent' : 'chill'), MOOD_SAY[m], {
        do: { flag: 'frames_' + m, unflag: MOODS.filter(function (x) { return x !== m; }).map(function (x) { return 'frames_' + x; }) }, next: 'menu2'
      }));
    });
    REQS.forEach(function (r) {
      c.push(K('yes', r.t, { req: function (s) { return !!s.flags[r.need] && !s.flags[r.f] && slots(s) < 2; }, do: { flag: r.f }, next: 'menu2' }));
    });
    c.push(K('chill', t(`"That's everything."`, `«Eso es todo».`, `«Es todo».`), { do: { flag: 'frames_told', fun: 2, soc: 2 }, call: 'v22_frames_told', next: 'done' }));
    c.push(K('chill', t(`"Clear what I told you."`, `«Borra lo que te dije».`, `«Apaga o que eu te falei».`), { call: 'v22_frames_clear', next: 'menu' }));
    return c;
  }
  D.frames = {
    who: 'frames', role: t('THE REQUEST LINE', 'LA LÍNEA DE PEDIDOS', 'A LINHA DE PEDIDOS'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'frames_met' }, to: 'again' }, { req: { flag: 'frames_told' }, to: 'again' }, { req: function () { return true; }, to: 'meet' }] },
      meet: {
        text: function (s) {
          if (s.flags.met_frames_attic) return t(`FRAMES SHELL is stretched out on a flight case by the couch, a thermos at his feet, the Sala 2 crate back between his knees. "Made it down at 02:30. APÜD has the upper decks on HardBounce now. Backstage is where the real request line lives — I carry for ÆRIEL and pitch the closing mood. ÆRIEL listens about half the time."`,
            `FRAMES SHELL está estirado en una caja de transporte junto al sofá, con un termo a los pies y el cajón de Sala 2 otra vez entre las rodillas. «Bajé a las 02:30. APÜD quedó arriba con el HardBounce. Aquí en backstage es donde va en serio la línea de pedidos: cargo para ÆRIEL y le propongo el pulso del cierre. Me hace caso más o menos la mitad de las veces».`,
            `O FRAMES SHELL tá esparramado numa caixa de transporte perto do sofá, com a garrafa térmica aos pés e o caixote da Sala 2 de volta entre os joelhos. «Desci às 02:30. O APÜD assumiu lá em cima com HardBounce. Aqui no backstage é que a linha de pedidos funciona de verdade: carrego pra ÆRIEL e sugiro o clima do encerramento. A ÆRIEL aceita mais ou menos metade das vezes».`);
          return t(`A person sits on a flight case by the couch, still catching his breath from upstairs, a thermos at his feet, a crate of records between his knees. The crate has a sticker: FRAMES SHELL. "Just came down from Sala 2 at 02:30 — APÜD took over up there. I'm one of ÆRIEL's people. I carry the crate and I take requests. ÆRIEL doesn't take requests, and takes my suggestions about half the time."`,
            `Una persona está sentada en una caja de transporte junto al sofá, recuperando el aire de arriba, con un termo a los pies y un cajón de discos entre las rodillas. El cajón tiene un sticker: FRAMES SHELL. «Acabo de bajar de Sala 2 a las 02:30 — APÜD tomó el relevo allá arriba. Soy de la gente de ÆRIEL. Cargo el cajón y recibo pedidos. ÆRIEL no recibe pedidos, y toma mis sugerencias más o menos la mitad de las veces».`,
            `Uma pessoa está sentada numa caixa de transporte perto do sofá, ainda tomando fôlego lá de cima, com uma garrafa térmica aos pés e um caixote de discos entre os joelhos. O caixote tem um adesivo: FRAMES SHELL. «Acabei de descer da Sala 2 às 02:30 — o APÜD assumiu lá em cima. Sou da turma da ÆRIEL. Eu carrego o caixote e recebo pedidos. A ÆRIEL não recebe pedidos, e aceita minhas sugestões mais ou menos metade das vezes».`);
        },
        do: { flag: 'frames_met', soc: 1 },
        choices: [
          K('ask', t(`"What do I tell you?"`, `«¿Qué te digo?»`, `«O que eu te falo?»`), { next: 'menu' }),
          K('chill', t(`"Just looking."`, `«Solo miro».`, `«Só olhando».`), { free: true, next: null })
        ]
      },
      again: {
        text: t(`"Back? The pitch is on the sleeve. I can change it."`, `«¿Volviste? El pedido está en la funda. Lo puedo cambiar».`, `«Voltou? O pedido tá na capa. Dá pra mudar».`),
        choices: [
          K('ask', t(`"Let me change it."`, `«Déjame cambiarlo».`, `«Deixa eu mudar».`), { next: 'menu' }),
          K('chill', t(`"No. Good luck."`, `«No. Suerte».`, `«Não. Boa sorte».`), { free: true, next: null })
        ]
      },
      menu: {
        text: t(`"Two things. What the room needs, in a word. And up to two requests people gave you to carry. I can't fit more than two."`, `«Dos cosas. Lo que necesita la sala, en una palabra. Y hasta dos pedidos que te dieron para cargar. No me caben más de dos».`, `«Duas coisas. O que a sala precisa, numa palavra. E até dois pedidos que te deram pra carregar. Não cabe mais que dois».`),
        choices: menuChoices()
      },
      menu2: {
        text: t(`"Written down. Anything else?"`, `«Anotado. ¿Algo más?»`, `«Anotado. Mais alguma coisa?»`),
        choices: menuChoices()
      },
      done: {
        text: t(`FRAMES SHELL writes it on the back of a record sleeve. "Pitched. ÆRIEL decides. I'll be on the roof, whichever way it goes."`, `FRAMES SHELL lo anota en el dorso de una funda de disco. «Propuesto. ÆRIEL decide. Estaré en el techo, salga como salga».`, `O FRAMES SHELL anota no verso de uma capa de disco. «Sugerido. A ÆRIEL decide. Vou estar no terraço, seja como for».`)
      }
    }
  };

  /* early backstage crate note (< 02:30) */
  D.frames_crate_early = {
    who: null, role: t('RECORD CRATE', 'CAJÓN DE DISCOS', 'CAIXOTE DE DISCOS'), start: 'a', nodes: {
      a: {
        text: t(`A heavy vinyl crate latched beside the backstage couch. White gaffer tape runs across the lid in black marker: "FRAMES SHELL — SPINNING SALA 2 UNTIL 02:30 AM. BACK HERE WITH THE CRATE AFTER 02:30 WHEN APÜD TAKES OVER. — F.S."`, `Un cajón pesado de vinilos cerrado junto al sofá del backstage. Una cinta gaffer blanca cruza la tapa en marcador negro: «FRAMES SHELL — PINCHANDO EN SALA 2 HASTA LAS 02:30 AM. VUELVO ACÁ CON EL CAJÓN DESPUÉS DE LAS 02:30 CUANDO TOMA EL MANDO APÜD. — F.S.»`, `Um caixote pesado de vinil travado ao lado do sofá do backstage. Uma fita gaffer branca cruza a tampa em pincel preto: «FRAMES SHELL — TOCANDO NA SALA 2 ATÉ 02:30 AM. VOLTO PRA CÁ COM O CAIXOTE DEPOIS DAS 02:30 QUANDO O APÜD ASSUME. — F.S.»`),
        choices: [K('chill', t(`Leave the latch alone.`, `Dejar el seguro quieto.`, `Deixar a trava quieta.`), { free: true, next: null })]
      }
    }
  };

  /* Sala 2 booth (01:00-02:30): FRAMES SHELL spinning percussive techno */
  D.frames_attic = {
    who: 'frames', role: t('SALA 2 // PERCUSSIVE TECHNO', 'SALA 2 // TECHNO PERCUSIVO', 'SALA 2 // TECHNO PERCUSSIVO'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'met_frames_attic' }, to: 'again' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`FRAMES SHELL locks a rolling percussive techno groove between two decks, shoulders loose over the mixer. "Warm-up duty upstairs until 02:30 AM — driving drums, no fluff, priming the room before APÜD brings HardBounce at half past two. Then I haul my crate down backstage for ÆRIEL's requests."`,
          `FRAMES SHELL encaja un groove de techno percusivo entre dos bandejas, hombros sueltos sobre el mixer. «Calentando Sala 2 hasta las 02:30 AM: pura percusión seca preparando el cuarto antes de que APÜD entre con HardBounce a las dos y media. Después bajo con mi cajón al backstage para los pedidos de ÆRIEL».`,
          `O FRAMES SHELL trava um groove de techno percussivo entre dois toca-discos, ombros soltos sobre o mixer. «Aquecendo a Sala 2 até 02:30 AM: bateria seca abrindo o caminho antes de o APÜD entrar com HardBounce às duas e meia. Depois desço com meu caixote pro backstage pros pedidos da ÆRIEL».`),
        do: { flag: 'met_frames_attic', soc: 1 },
        choices: [
          K('ask', t(`"About the track requests for ÆRIEL…"`, `«Sobre los pedidos de temas para ÆRIEL…»`, `«Sobre os pedidos de música pra ÆRIEL…»`), { req: function (s) { return s.quests.q12 === 'active' || !!s.flags.thanked_dj || !!s.flags.frames_told; }, next: 'req_info' }),
          K('chill', t(`"Keep the drums rolling."`, `«Sigue rodando esas percusiones».`, `«Continua rodando essa bateria».`), { free: true, next: null })
        ]
      },
      again: {
        text: t(`FRAMES SHELL cues the next percussive cut on one ear without missing a bar. "Holding Sala 2 tight until 02:30 AM, then passing the booth to APÜD and taking the crate backstage."`,
          `FRAMES SHELL preescucha el siguiente corte percusivo en un oído sin perder un compás. «Sosteniendo Sala 2 firme hasta las 02:30 AM; después le paso la cabina a APÜD y bajo el cajón al backstage».`,
          `O FRAMES SHELL pré-escuta o próximo corte percussivo num ouvido só sem perder o compasso. «Segurando a Sala 2 firme até 02:30 AM; depois passo a cabine pro APÜD e desço o caixote pro backstage».`),
        choices: [
          K('ask', t(`"About the track requests for ÆRIEL…"`, `«Sobre los pedidos de temas para ÆRIEL…»`, `«Sobre os pedidos de música pra ÆRIEL…»`), { req: function (s) { return s.quests.q12 === 'active' || !!s.flags.thanked_dj || !!s.flags.frames_told; }, next: 'req_info' }),
          K('chill', t(`"Let him mix."`, `«Dejarlo mezclar».`, `«Deixar ele mixar».`), { free: true, next: null })
        ]
      },
      req_info: {
        text: function (s) {
          if (s.flags.frames_told) return t(`"I have your sleeve tucked behind the channel strip. Meet me backstage after 02:30 if you want to swap anything once the big crate is open."`, `«Tengo tu funda guardada detrás de los canales. Búscame en el backstage después de las 02:30 si quieres cambiar algo cuando abra el cajón grande».`, `«Guardei sua capa atrás dos canais. Me procura no backstage depois das 02:30 se quiser mudar algo quando eu abrir o caixote grande».`);
          return t(`"At 02:30 AM I hand Sala 2 over to APÜD and bring the full crate backstage by the couch — that's where I normally take ÆRIEL's pitches. Want to catch me down there after 02:30, or lock your pitch onto a sleeve right now?"`, `«A las 02:30 AM le entrego Sala 2 a APÜD y bajo el cajón completo junto al sofá del backstage: ahí armo los pedidos para ÆRIEL. ¿Nos vemos abajo después de las 02:30 o dejamos tu pedido anotado en una funda ahora?»`, `«Às 02:30 AM entrego a Sala 2 pro APÜD e desço com o caixote completo pro sofá do backstage — é lá que eu monto os pedidos pra ÆRIEL. A gente se vê lá embaixo depois das 02:30 ou quer já deixar anotado numa capa agora?»`);
        },
        choices: [
          K('chill', t(`"I'll catch you backstage after 02:30."`, `«Te alcanzo en el backstage después de las 02:30».`, `«Te encontro no backstage depois das 02:30».`), { req: function (s) { return !s.flags.frames_told; }, free: true, next: null, react: t(`"Smart. See you by the couch as soon as APÜD drops the first HardBounce kick."`, `«Perfecto. Nos vemos junto al sofá en cuanto APÜD suelte el primer bombo de HardBounce».`, `«Fechou. A gente se vê perto do sofá assim que o APÜD soltar o primeiro bumbo de HardBounce».`) }),
          K('yes', t(`"Let me pitch the sleeve right now."`, `«Anotemos el pedido en la funda ahora».`, `«Vamos anotar o pedido na capa agora».`), { next: 'menu' }),
          K('chill', t(`"All set."`, `«Todo listo».`, `«Tudo certo».`), { req: function (s) { return !!s.flags.frames_told; }, free: true, next: null })
        ]
      },
      menu: {
        text: t(`"Quick then, two bars left on this record. What the room needs, in a word, and up to two requests people gave you to carry."`, `«Rápido entonces, quedan dos compases en este disco. Lo que necesita la sala en una palabra, y hasta dos pedidos que te dieron para cargar».`, `«Rápido então, faltam dois compassos nesse disco. O que a sala precisa numa palavra, e até dois pedidos que te deram pra carregar».`),
        choices: menuChoices()
      },
      menu2: {
        text: t(`"Pencilled in on a spare sleeve. Anything else before this loop runs out?"`, `«Anotado en una funda suelta. ¿Algo más antes de que se acabe este loop?»`, `«Anotado numa capa avulsa. Mais alguma coisa antes desse loop acabar?»`),
        choices: menuChoices()
      },
      done: {
        text: t(`FRAMES SHELL tucks the sleeve beside the cue headphones. "Pitched and locked in. I'll haul this down backstage at 02:30 AM and put it in front of ÆRIEL before sunrise."`, `FRAMES SHELL guarda la funda junto a los auriculares. «Propuesto y asegurado. Bajo esto al backstage a las 02:30 AM y lo pongo frente a ÆRIEL antes del amanecer».`, `O FRAMES SHELL guarda a capa perto dos fones. «Sugerido e garantido. Desço com isso pro backstage às 02:30 AM e coloco na frente da ÆRIEL antes do amanhecer».`)
      }
    }
  };

  /* Sala 2 front monitor / booth inspect & djattic fallback */
  S.talk_attic_dj = function () {
    const s = EM.state; if (!s || s.flags.roof_open) return;
    const id = s.time >= 270 ? 'apud_attic' : 'frames_attic';
    U.startDialogue(id, { npc: id });
  };
  D.attic_booth_inspect = {
    who: null, role: t('SALA 2 BOOTH', 'CABINA DE SALA 2', 'CABINE DA SALA 2'), start: 'st', nodes: {
      st: {
        branch: [
          { req: function (s) { return !!s.flags.roof_open; }, to: 'roof' },
          { req: function (s) { return s.time >= 270; }, to: 'apud' },
          { req: function () { return true; }, to: 'frames' }
        ]
      },
      frames: {
        text: t(`Twin turntables and a warm rotary monitor humming under green LEDs. FRAMES SHELL is riding percussive techno at the top of the booth until 02:30 AM.`,
          `Dos tornamesas y un monitor rotatorio zumbando bajo LEDs verdes. FRAMES SHELL lleva techno percusivo al frente de la cabina hasta las 02:30 AM.`,
          `Dois toca-discos e um monitor rotativo zumbindo sob LEDs verdes. O FRAMES SHELL conduz techno percussivo na cabine até 02:30 AM.`),
        choices: [
          K('ask', t(`Step closer and talk to FRAMES SHELL.`, `Acercarse a hablar con FRAMES SHELL.`, `Chegar mais perto pra falar com o FRAMES SHELL.`), { call: 'talk_attic_dj', next: null }),
          K('chill', t(`Leave him to the blend.`, `Dejarlo con la mezcla.`, `Deixar ele na mixagem.`), { free: true, next: null })
        ]
      },
      apud: {
        text: t(`The redliners on the Sala 2 monitor are bouncing hard: APÜD took over at 02:30 AM and is driving high-velocity HardBounce straight through the room until dawn.`,
          `Los vúmetros del monitor de Sala 2 rebotan fuerte: APÜD tomó el relevo a las 02:30 AM y empuja HardBounce de alta velocidad por toda la sala hasta el amanecer.`,
          `Os medidores do monitor da Sala 2 pulam forte: o APÜD assumiu às 02:30 AM e tá empurrando HardBounce em alta velocidade pela sala até o amanhecer.`),
        choices: [
          K('ask', t(`Step closer and talk to APÜD.`, `Acercarse a hablar con APÜD.`, `Chegar mais perto pra falar com o APÜD.`), { call: 'talk_attic_dj', next: null }),
          K('chill', t(`Let him ride the kick.`, `Dejarlo con el bombo.`, `Deixar ele seguir no bumbo.`), { free: true, next: null })
        ]
      },
      roof: {
        text: t(`The Sala 2 monitor is dark and the needles are lifted. Everyone moved upstairs for the closing set on the rooftop.`,
          `El monitor de Sala 2 está apagado y las agujas levantadas. Todo el equipo subió al techo para el set de cierre.`,
          `O monitor da Sala 2 tá desligado e as agulhas levantadas. Todo mundo subiu pro terraço pro set de encerramento.`),
        choices: [K('chill', t(`Step back.`, `Retroceder.`, `Voltar.`), { free: true, next: null })]
      }
    }
  };
  D.djattic = D.attic_booth_inspect;
  S.v22_frames_told = function () { if (EM.state.quests.q12 === 'active') L.setQuest('q12', 'done'); };
  S.v22_frames_clear = function () {
    L.apply({ unflag: ['frames_told', 'frames_warm', 'frames_wild', 'frames_soft'].concat(REQS.map(function (r) { return r.f; })) });
  };

  /* ============================================================ THE SUNRISE: who ÆRIEL listens to
     FRAMES SHELL and your report to ÆRIEL both reach the booth. With both, a seeded coin decides (BEGIN AGAIN rolls the same). */
  function pick(c) {
    let best = 'warm', n = -1, tie = false;
    MOODS.forEach(function (m) { if (c[m] > n) { best = m; n = c[m]; tie = false; } else if (c[m] === n) tie = true; });
    return n > 0 && !tie ? best : 'warm';
  }
  S.v22_decide = function () {
    const s = EM.state, f = s.flags;
    if (f.v22_decided) return;
    f.v22_decided = true;
    const told = {};
    CORE.forEach(function (x) { MOODS.forEach(function (m) { if (f['told_' + x + '_' + m]) told[x] = m; }); });
    const reported = CORE.filter(function (x) { return f['told_' + x]; }).length > 0;
    const framed = !!f.frames_told;
    let src = 'none';
    if (reported && framed) src = EM.mulberry32((s.seed | 0) + 7731)() < 0.5 ? 'frames' : 'friends';
    else if (framed) src = 'frames';
    else if (reported) src = 'friends';
    let mood = 'warm';
    if (src === 'friends') {
      const c = { warm: 0, wild: 0, soft: 0 };
      Object.keys(told).forEach(function (x) { c[told[x]]++; });
      mood = pick(c);
    } else if (src === 'frames') {
      const c = { warm: 0, wild: 0, soft: 0 };
      MOODS.forEach(function (m) { if (f['frames_' + m]) c[m] += 2; });
      Object.keys(REQ_MOOD).forEach(function (k) { if (f[k]) c[REQ_MOOD[k]]++; });
      mood = pick(c);
    }
    const flags = ['closing_' + mood, 'src_' + src];
    CORE.forEach(function (x) { flags.push((told[x] === NEED[x] ? 'hit_' : 'miss_') + x); });
    if (src === 'frames') {
      if (f.fr_req_wobble) flags.push('wobble_played');
      if (f.fr_req_melody) flags.push('melody_played');
      if (f.fr_req_nervous) flags.push('kai_played');
    }
    L.apply({ unflag: ['closing_warm', 'closing_wild', 'closing_soft'], flag: flags });
  };
  const sun0 = S.sunrise;
  S.sunrise = function () { S.v22_decide(); sun0(); };

  const SD = D.sunrise.nodes;
  ['warm', 'wild', 'soft'].forEach(function (m) { SD[m].next = 'src'; });
  SD.src = { branch: [{ req: { flag: 'src_frames' }, to: 'src_frames' }, { req: { flag: 'src_friends' }, to: 'src_friends' }, { req: function () { return true; }, to: 'mine' }] };
  SD.src_frames = {
    text: function (s) {
      const out = [t(`The set is the one FRAMES SHELL pitched. ÆRIEL glances at the crate, at the back of the roof, and nods.`, `El set es el que propuso FRAMES SHELL. ÆRIEL mira el cajón, al fondo del techo, y asiente.`, `O set é o que o FRAMES SHELL sugeriu. A ÆRIEL olha o caixote, no fundo do terraço, e assente.`)];
      if (s.flags.fr_req_wobble) out.push(t(`Near the end, one wobble. Four seconds. You know who asked for it.`, `Cerca del final, un wobble. Cuatro segundos. Sabes quién lo pidió.`, `Perto do fim, um wobble. Quatro segundos. Você sabe quem pediu.`));
      if (s.flags.fr_req_melody) out.push(t(`There is no melody in the last half hour. Only the kick, continuing. Somebody by the stairs approves without moving their face.`, `No hay melodía en la última media hora. Solo el bombo, que sigue. Alguien junto a la escalera aprueba sin mover la cara.`, `Não há melodia na última meia hora. Só o bumbo, que segue. Alguém perto da escada aprova sem mexer o rosto.`));
      if (s.flags.fr_req_nervous) out.push(t(`A song for somebody nervous plays in the middle of the set. Kai isn't here. You think of Kai anyway.`, `En medio del set suena una canción para alguien nervioso. Kai no está. Piensas en Kai igual.`, `No meio do set toca uma música pra alguém nervoso. O Kai não tá aqui. Você pensa no Kai mesmo assim.`));
      if (s.flags.fr_req_sad && !s.flags.note_delivered) out.push(t(`The sad one plays near the end, for a napkin that never reached the booth.`, `La triste suena cerca del final, para una servilleta que nunca llegó a la cabina.`, `A triste toca perto do fim, pra um guardanapo que nunca chegou à cabine.`));
      return out;
    },
    next: 'mine'
  };
  const HIT = {
    maru: t(`Maru gets the long chord and never says so. She counts the rail with her eyes: everyone, once.`, `Maru recibe el acorde largo y nunca lo menciona. Cuenta la baranda con los ojos: todos, una vez.`, `A Maru ganha o acorde longo e nunca fala nada. Ela conta o parapeito com os olhos: todo mundo, uma vez.`),
    dani: t(`Dani screams at the sky and the roof screams back. He looks at you, delighted.`, `Dani le grita al cielo y el techo le grita de vuelta. Te mira, feliz.`, `O Dani grita pro céu e o terraço grita de volta. Ele te olha, feliz.`),
    tato: t(`Tato closes his eyes. The set is quiet and it isn't empty.`, `Tato cierra los ojos. El set es tranquilo y no está vacío.`, `O Tato fecha os olhos. O set é quieto e não é vazio.`)
  };
  const MISS = {
    maru: t(`Maru gets something she didn't ask for. She counts the rail twice.`, `Maru recibe algo que no pidió. Cuenta la baranda dos veces.`, `A Maru ganha algo que não pediu. Ela conta o parapeito duas vezes.`),
    dani: t(`Dani waits for the loud part. It doesn't come. He holds the rail and decides it is fine.`, `Dani espera la parte fuerte. No llega. Se agarra a la baranda y decide que está bien.`, `O Dani espera a parte alta. Ela não vem. Ele se segura no parapeito e decide que tá bom.`),
    tato: t(`Tato flinches at the first kick, then lowers his shoulders on purpose.`, `Tato se sobresalta con el primer bombo y luego baja los hombros a propósito.`, `O Tato se assusta com o primeiro bumbo e depois abaixa os ombros de propósito.`)
  };
  SD.src_friends = {
    text: function (s) {
      const out = [t(`The set follows what you told ÆRIEL about your people. ÆRIEL looks along the rail for them, then at the crate, and sets it down.`, `El set sigue lo que le dijiste a ÆRIEL sobre tu gente. ÆRIEL los busca a lo largo de la baranda, luego mira el cajón y lo deja a un lado.`, `O set segue o que você contou pra ÆRIEL sobre sua galera. A ÆRIEL procura todo mundo ao longo do parapeito, depois olha o caixote e deixa de lado.`)];
      CORE.forEach(function (x) { if (L.hasFriend(x)) out.push(s.flags['hit_' + x] ? HIT[x] : MISS[x]); });
      return out;
    },
    next: 'mine'
  };

  /* the morning after: Isi hears her wobble */
  const MR = story.morningRefs || [];
  MR.forEach(function (r) { if (r.id === 'isi_dub') { const ok0 = r.ok; r.ok = function (s) { return ok0(s) && !s.flags.wobble_played; }; } });
  MR.push({ id: 'isi_wobble', who: '#ISI', ok: function (s) { return !!s.flags.wobble_played; }, t: t(`one wobble. four seconds. i heard it through the ceiling and i am not crying.`, `un wobble. cuatro segundos. lo oí a través del techo y no estoy llorando.`, `um wobble. quatro segundos. ouvi pelo teto e não tô chorando.`) });
})();

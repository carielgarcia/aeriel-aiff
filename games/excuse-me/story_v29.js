/* EXCUSE ME — story v29: the closing roof, and the afters.
   THE ROOF: a full crowd on both sides, a ring of the team (Rosa, Luca, Isi, Mika, Dario, Dragan) standing in a circle with
   an open middle where you and your friends watch the sunrise, and the DJ booth behind that circle looking at the sunrise,
   with ÆRIEL in the middle, FRAMES SHELL on one side and APÜD on the other. Nobody speaks to you until you choose to
   talk to them (the old barrage of thank-yous is gone; each member says theirs when you talk to them, once).
   THE AFTERS: after the sunrise the next main mission (q13) is to decide about the afters. FRAMES SHELL, with a golden star,
   has the invitation: yes, yes for an hour, or go home. Home ends the game. Yes starts the after (q14, zone `afters`, a
   kitchen under the studio): eggs, water, a sofa, a few people. Thanking FRAMES SHELL and going to sleep ends the game.
   Must load after story_v28.js and before compact.js. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones, TL = EM.TL, D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`"Later."`, `«Después».`, `«Depois».`), { free: true, next: null }); };
  const mk = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };

  /* ============================================================ APÜD */
  EM.CAST.apud = { name: 'APÜD', look: { skin: 1, hair: 6, hc: 0, expr: 1, top: 8, tc: 4, bottom: 1, bc: 1, acc: 4, wide: false } };

  /* ============================================================ THE ROOF */
  const R = Z.rooftop;
  if (R) {
    /* the booth is BEHIND the circle, at the south of the roof, and everyone on it faces north, to the sunrise */
    R.fill(11, 9, 8, 2, TL.BOOTH);
    R.fill(9, 9, 1, 2, TL.SPEAKER); R.fill(20, 9, 1, 2, TL.SPEAKER);
    R.npc({ id: 'frames_roof', cast: 'frames', x: 13.5, y: 9.6, dir: 'u', reach: 36, dlg: function (s) { return s.quests.q13 === 'active' ? 'afters_invite' : 'frames_roof_talk'; } });
    R.npc({ id: 'dj_roof', cast: 'resident', x: 15.5, y: 9.6, dir: 'u', decor: true });
    R.npc({ id: 'apud_roof', cast: 'apud', x: 17.5, y: 9.6, dir: 'u', reach: 36, dlg: 'apud_roof_talk' });
    /* the crowd: both sides, calm; the middle is for the circle and for you */
    R.crowdRect(1, 3, 9, 9, 3).crowdRect(21, 3, 8, 9, 3);
    [['trio1', 7, 12], ['qpair2', 22, 12], ['trio3', 2.5, 7.5]].forEach(function (p, i) {
      R.npc({ id: 'roof_sit' + i, cast: p[0], x: p[1], y: p[2], dir: i === 2 ? 'r' : 'u', decor: true, pose: 'sit' });
    });
    R.npc({ id: 'roof_hug', pair: ['sofa1', 'sofa2'], x: 26.5, y: 7.5, dir: 'u', decor: true, pose: 'hug' });
    R.npc({ id: 'roof_lie', cast: 'juno', x: 2.5, y: 10.5, dir: 'r', decor: true, pose: 'lie' });
    /* the team: a circle around the sunrise spot, open in the middle. You choose to talk to them. */
    const CX = 15, CY = 5.8, RX = 3.8, RY = 2.6;
    ['dragan', 'mika', 'dario', 'rosa', 'luca', 'nuri'].forEach(function (id, i) {
      const a = i * Math.PI / 3, x = CX + RX * Math.cos(a), y = CY + RY * Math.sin(a);
      const dir = Math.abs(CX - x) > Math.abs(CY - y) ? (x > CX ? 'l' : 'r') : (y > CY ? 'u' : 'd');
      R.npc({ id: 'roof_team_' + id, cast: id, x: Math.round(x * 2) / 2 + 0.01, y: Math.round(y * 2) / 2 + 0.01, dir: dir, reach: 24, dlg: 'roof_' + id });
    });
  }

  /* nobody barges in: the forced thank-you scene of story_v27.js no longer starts on its own */
  const enter0 = story.enter;
  story.enter = function (zone) { enter0(zone); const s = EM.state; if (s && zone === 'rooftop') s.flags.team_pending = false; };

  /* each member says their thanks when you talk to them, once; the lines depend on what you did */
  const LINES = {
    rosa: [function (s) { return !!(s.flags.rosa_lanyard || s.flags.rosa_ally); }, t(`ROSA, mop upright, a thermos at her feet: "The lanyard looks good on you. Don't tell them I said it."`, `ROSA, con el trapeador derecho y un termo a sus pies: «El pase te queda bien. No les digas que lo dije».`, `A ROSA, com o esfregão em pé e uma térmica aos pés: «O crachá combina com você. Não conta que eu disse».`), t(`ROSA, mop upright: "The toilets lasted the night. So did you. That is not nothing."`, `ROSA, con el trapeador derecho: «Los baños aguantaron la noche. Tú también. No es poco».`, `A ROSA, com o esfregão em pé: «Os banheiros aguentaram a noite. Você também. Não é pouco».`)],
    luca: [function (s) { return !!(s.flags.phone_returned || s.flags.closet_key); }, t(`LUCA hands you a coat check ticket for nothing at all. "Your jacket is checked. Your dread is free."`, `LUCA te da un ticket del guardarropa por nada. «Tu chaqueta está guardada. Tu angustia es gratis».`, `O LUCA te entrega uma ficha da chapelaria por nada. «Sua jaqueta está guardada. Sua angústia é grátis».`), t(`LUCA, ticket book closed for once: "Nobody lost anything on my watch tonight. Take a ticket anyway."`, `LUCA, con el talonario cerrado por una vez: «Nadie perdió nada en mi turno. Llévate un ticket igual».`, `O LUCA, com o talão fechado pela primeira vez: «Ninguém perdeu nada no meu turno. Leva uma ficha mesmo assim».`)],
    nuri: [function (s) { return !!(s.flags.isi_fed || (s.pill && s.pill.tested)); }, t(`ISI, with a sandwich and a notebook: "I'm off the table until six. Water's on me. Nobody takes names."`, `ISI, con un sándwich y un cuaderno: «Dejo la mesa hasta las seis. El agua va por mi cuenta. Nadie anota nombres».`, `A ISI, com um sanduíche e um caderno: «Saio da mesa até as seis. A água é por minha conta. Ninguém anota nome».`), t(`ISI, notebook shut: "If anything is still in your system: water, salt, sleep. If you need to talk, I'm here. No names."`, `ISI, con el cuaderno cerrado: «Si algo sigue en tu cuerpo: agua, sal, sueño. Si necesitas hablar, aquí estoy. Sin nombres».`, `A ISI, com o caderno fechado: «Se ainda tem algo no seu corpo: água, sal, sono. Se precisar conversar, tô aqui. Sem nome».`)],
    mika: [function (s) { return !!(s.flags.host_ok_group && !s.flags.host_lied); }, t(`MIKA, clipboard under one arm: "One person per stall. You were good about it. I'll say it once."`, `MIKA, con la carpeta bajo el brazo: «Una persona por cabina. Lo hiciste bien. Lo digo una sola vez».`, `A MIKA, com a prancheta debaixo do braço: «Uma pessoa por cabine. Você foi bem. Eu falo uma vez só».`), t(`MIKA, clipboard down: "The stalls held. That is all I wanted tonight."`, `MIKA, con la carpeta abajo: «Las cabinas resistieron. Es todo lo que quería esta noche».`, `A MIKA, com a prancheta baixada: «As cabines aguentaram. É tudo que eu queria hoje».`)],
    dario: [function (s) { return !!s.flags.dario_rules; }, t(`DARIO, quiet: "You asked first. Keep asking."`, `DARIO, en voz baja: «Preguntaste primero. Sigue preguntando».`, `O DARIO, baixinho: «Você perguntou primeiro. Continua perguntando».`), t(`DARIO, quiet: "The dark room closes at sunrise. Everyone left it the way they found it. That is the whole rule."`, `DARIO, en voz baja: «El cuarto oscuro cierra al amanecer. Todos lo dejaron como lo encontraron. Esa es toda la regla».`, `O DARIO, baixinho: «A dark room fecha com o amanhecer. Todo mundo deixou do jeito que encontrou. Essa é a regra toda».`)],
    dragan: [function () { return true; }, t(`DRAGAN, arms crossed, facing the light: "Nobody in there owes you a good night. You gave a few anyway."`, `DRAGAN, con los brazos cruzados, mirando la luz: «Nadie ahí adentro te debe una buena noche. Tú diste varias igual».`, `O DRAGAN, de braços cruzados, de frente pra luz: «Ninguém lá dentro te deve uma boa noite. Você deu algumas mesmo assim».`)]
  };
  const NAMES = { rosa: 'ROSA', luca: 'LUCA', nuri: 'ISI', mika: 'MIKA', dario: 'DARIO', dragan: 'DRAGAN' };
  Object.keys(LINES).forEach(function (id) {
    const ln = LINES[id];
    D['roof_' + id] = {
      who: id, role: t('THE TEAM', 'EL EQUIPO', 'A EQUIPE'), start: 'st', nodes: {
        st: { branch: [{ req: { flag: 'thanks_' + id }, to: 'again' }, { req: function () { return true; }, to: 'a' }] },
        a: {
          text: function (s) { return ln[0](s) ? ln[1] : ln[2]; },
          choices: [K('care', t(`"Thank you. By name."`, `«Gracias. Por tu nombre».`, `«Obrigado. Pelo seu nome».`), { free: true, do: { flag: 'thanks_' + id, fun: 2, soc: 1 }, next: null }), LEAVE()]
        },
        again: { text: t(`${NAMES[id]} nods at the sky. You said it already. It still counts.`, `${NAMES[id]} asiente hacia el cielo. Ya lo dijiste. Igual cuenta.`, `${NAMES[id]} assente pro céu. Você já disse. Ainda conta.`), choices: [LEAVE()] }
      }
    };
  });

  /* the booth: nobody pushes anything on you */
  D.frames_roof_talk = {
    who: 'frames', role: t('ÆRIEL\'S PEOPLE', 'LA GENTE DE ÆRIEL', 'A GALERA DA ÆRIEL'), start: 'a', nodes: {
      a: { text: t(`FRAMES SHELL, eyes on the sky: "After the sunrise I have something for you. Watch first."`, `FRAMES SHELL, con los ojos en el cielo: «Después del amanecer tengo algo para ti. Primero mira».`, `O FRAMES SHELL, de olho no céu: «Depois do amanhecer eu tenho uma coisa pra você. Primeiro olha».`), choices: [LEAVE()] }
    }
  };
  D.apud_roof_talk = {
    who: 'apud', role: t('THE CLOSING SET', 'EL SET DE CIERRE', 'O SET DE ENCERRAMENTO'), start: 'a', nodes: {
      a: { text: t(`APÜD, one hand on the mixer, not looking away from the horizon: "First light in a few minutes. Stand with your people. The middle is yours."`, `APÜD, con una mano en la mezcladora, sin apartar la vista del horizonte: «La primera luz llega en unos minutos. Párate con tu gente. El centro es tuyo».`, `O APÜD, com uma mão na mesa de mixagem, sem tirar os olhos do horizonte: «A primeira luz chega em poucos minutos. Fica com sua galera. O centro é de vocês».`), choices: [LEAVE()] }
    }
  };

  /* ============================================================ THE SUNRISE LEADS TO THE AFTERS */
  if (D.sunrise) {
    D.sunrise.after = 'afters_begin';
    if (D.sunrise.nodes.end) { D.sunrise.nodes.end.next = null; D.sunrise.nodes.end.do = { quest: { q9: 'done', q13: 'active' }, flag: 'afters_open' }; } /* one objective change: the sunrise is done and the afters begin */
  }
  EM.QUESTS.q13 = {
    title: t('THE AFTERS', 'EL AFTER', 'O AFTER'),
    desc: function (s) {
      return t(`The sun is up. FRAMES SHELL, by the booth, has an invitation for the people who stayed to the end. ${mk(s, 'afters_answered')} Decide: yes, yes for an hour, or home to sleep. Home ends the night.`,
        `Salió el sol. FRAMES SHELL, junto a la cabina, tiene una invitación para la gente que se quedó hasta el final. ${mk(s, 'afters_answered')} Decide: sí, sí por una hora, o a dormir a casa. Volver a casa termina la noche.`,
        `O sol nasceu. O FRAMES SHELL, perto da cabine, tem um convite pra quem ficou até o fim. ${mk(s, 'afters_answered')} Decida: sim, sim por uma hora, ou pra casa dormir. Ir pra casa termina a noite.`);
    },
    doneText: t(`You answered. The rest of the night is yours.`, `Respondiste. El resto de la noche es tuyo.`, `Você respondeu. O resto da noite é seu.`)
  };
  EM.QUESTS.q14 = {
    title: t('THE AFTERS, INSIDE', 'DENTRO DEL AFTER', 'DENTRO DO AFTER'),
    desc: function (s) {
      return t(`A kitchen under the studio: eggs, water, a sofa. Nobody has to take anything. ${mk(s, 'afters_eggs')} Eat something. ${mk(s, 'afters_drank')} Drink water. When you are ready, thank FRAMES SHELL and go to sleep.`,
        `Una cocina debajo del estudio: huevos, agua, un sofá. Nadie tiene que tomar nada. ${mk(s, 'afters_eggs')} Come algo. ${mk(s, 'afters_drank')} Toma agua. Cuando estés listo, agradécele a FRAMES SHELL y ve a dormir.`,
        `Uma cozinha embaixo do estúdio: ovos, água, um sofá. Ninguém precisa tomar nada. ${mk(s, 'afters_eggs')} Coma alguma coisa. ${mk(s, 'afters_drank')} Beba água. Quando estiver pronto, agradeça ao FRAMES SHELL e vá dormir.`);
    },
    doneText: t(`You went to sleep.`, `Te fuiste a dormir.`, `Você foi dormir.`)
  };
  const obj0 = story.objective;
  story.objective = function (s) {
    if (s.quests.q13 === 'active') return t(`The sun is up. FRAMES SHELL, by the booth, has an invitation to the afters. Talk to them and decide.`, `Salió el sol. FRAMES SHELL, junto a la cabina, tiene una invitación al after. Habla con esa persona y decide.`, `O sol nasceu. O FRAMES SHELL, perto da cabine, tem um convite pro after. Fale com a pessoa e decida.`);
    if (s.quests.q14 === 'active') return s.flags.afters_eggs && s.flags.afters_drank
      ? t(`You are fed and watered. Thank FRAMES SHELL when you are ready, and go to sleep.`, `Ya comiste y tomaste agua. Agradécele a FRAMES SHELL cuando quieras y ve a dormir.`, `Você comeu e bebeu água. Agradeça ao FRAMES SHELL quando quiser e vá dormir.`)
      : t(`Eat something, drink water, sit down. Then thank FRAMES SHELL.`, `Come algo, toma agua, siéntate. Luego agradécele a FRAMES SHELL.`, `Coma algo, beba água, sente. Depois agradeça ao FRAMES SHELL.`);
    return obj0(s);
  };
  /* the golden star: the inviter on the roof, then the host at the afters */
  EM.seekers.push(function (s) {
    if (s.quests.q13 === 'active') return [{ key: 'frames_roof', zone: 'rooftop', label: '★' }];
    if (s.quests.q14 === 'active') return [{ key: 'afters_host', zone: 'afters', label: '★' }];
    return [];
  });

  /* the sunrise is over: the night stays open past 08:00 until you answer */
  S.afters_begin = function () {
    const s = EM.state;
    s.flags.afters_open = true;
    U.toast({ icon: 'star', kind: 'good', ms: 6500, text: t(`NEW MISSION: THE AFTERS. FRAMES SHELL has an invitation. Follow the golden star.`, `NUEVA MISIÓN: EL AFTER. FRAMES SHELL tiene una invitación. Sigue la estrella dorada.`, `NOVA MISSÃO: O AFTER. O FRAMES SHELL tem um convite. Siga a estrela dourada.`) });
  };

  /* the invitation: from FRAMES SHELL, with the star. Yes starts the after; home ends the game. */
  D.afters_invite = {
    who: 'frames', role: t('THE AFTERS', 'EL AFTER', 'O AFTER'), start: 'a', nodes: {
      a: {
        text: function (s) {
          const out = [t(`FRAMES SHELL zips the crate shut at the back of the roof. "Some of us are going to the kitchen under the studio. Eggs, water, one speaker at conversation volume. Nobody has to take anything. We leave when we leave. Whoever stayed to the end is on the list. Bring nothing."`, `FRAMES SHELL cierra el cajón al fondo del techo. «Algunos vamos a la cocina debajo del estudio. Huevos, agua, un parlante a volumen de conversación. Nadie tiene que tomar nada. Nos vamos cuando nos vayamos. Quien se quedó hasta el final está en la lista. No traigas nada».`, `O FRAMES SHELL fecha o case com o zíper no fundo do terraço. «Alguns de nós vamos pra cozinha embaixo do estúdio. Ovos, água, uma caixa de som em volume de conversa. Ninguém precisa tomar nada. A gente sai quando sair. Quem ficou até o fim tá na lista. Não traga nada».`)];
          if (L.hasFriend('maru')) out.push(t(`Maru is already pulling at your sleeve. "Say yes. There's a sofa."`, `Maru ya te jala de la manga. «Di que sí. Hay un sofá».`, `A Maru já tá puxando sua manga. «Diz que sim. Tem um sofá».`));
          return out;
        },
        choices: [
          K('care', t(`"Yes. Water first, then eggs."`, `«Sí. Primero agua, luego huevos».`, `«Sim. Primeiro água, depois ovos».`), { do: { flag: ['afters_yes', 'afters_answered'], fun: 3, soc: 3, care: 1 }, call: 'afters_go', next: null }),
          K('chill', t(`"Yes, for an hour. Then I sleep."`, `«Sí, por una hora. Luego duermo».`, `«Sim, por uma hora. Depois eu durmo».`), { do: { flag: ['afters_yes', 'afters_short', 'afters_answered'], soc: 3, care: 1 }, call: 'afters_go', next: null }),
          K('chill', t(`"Thank you. I'm going home to sleep." (This ends the night.)`, `«Gracias. Me voy a casa a dormir». (Esto termina la noche.)`, `«Valeu. Vou pra casa dormir». (Isso termina a noite.)`), { do: { flag: ['afters_home', 'afters_answered'], hp: 5, soc: 1, care: 1 }, call: 'afters_home', next: null }),
          LEAVE()
        ]
      }
    }
  };
  S.afters_go = function () {
    const s = EM.state;
    L.setQuest('q13', 'done'); L.setQuest('q14', 'active');
    if (s.flags.afters_short) s.aftersUntil = s.time + 60;
    EM.hooks.travel({ zone: 'afters', x: 12, y: 10, dir: 'u' });
    U.toast({ icon: 'door', kind: 'good', ms: 6000, text: t(`The afters. A kitchen under the studio. Eggs, water, a sofa.`, `El after. Una cocina debajo del estudio. Huevos, agua, un sofá.`, `O after. Uma cozinha embaixo do estúdio. Ovos, água, um sofá.`) });
  };
  S.afters_home = function () {
    L.setQuest('q13', 'done');
    S.final_ending();
  };

  /* ============================================================ THE AFTERS (the zone) */
  const A = new EM.Zone('afters', 26, 14, { theme: { a: '#FFB020', b: '#FF7AB8' }, name: T('THE AFTERS // KITCHEN UNDER THE STUDIO', 'EL AFTER // COCINA DEBAJO DEL ESTUDIO', 'O AFTER // COZINHA EMBAIXO DO ESTÚDIO'), audio: { lp: 700, wet: 0.2, style: 'chill' }, dark: 0.05, quiet: 0.2 });
  A.room(0, 0, 26, 14, TL.RUG);
  A.fill(1, 2, 9, 11, TL.TILE);                       /* the kitchen */
  A.fill(2, 3, 7, 1, TL.BAR);                         /* the counter */
  A.fill(11, 6, 4, 2, TL.TABLE);                      /* the big table */
  A.fill(17, 3, 6, 1, TL.COUCH); A.fill(21, 6, 1, 4, TL.COUCH); /* the sofa */
  A.set(23, 12, TL.PLANT); A.set(1, 12, TL.PLANT);
  A.sign(11, 2, 'WELCOME', 1).sign(2, 1, 'EGGS', 1);
  A.light(5, 5, 70).light(15, 9, 60).light(19, 5, 50);
  A.friend('default', 12, 9).friend('afters', 12, 9);
  A.obj({ id: 'afters_cook', kind: 'find', x: 2, y: 3, w: 5, h: 1, label: t('MAKE EGGS', 'HACER HUEVOS', 'FAZER OVOS'), dlg: 'afters_cook' });
  A.obj({ id: 'afters_jug', kind: 'find', x: 7, y: 3, w: 2, h: 1, label: t('WATER JUG', 'JARRA DE AGUA', 'JARRA DE ÁGUA'), dlg: 'afters_jug' });
  A.obj({ id: 'afters_sofa', kind: 'rest', x: 17, y: 3, w: 6, h: 1, label: t('SIT ON THE SOFA', 'SENTARSE EN EL SOFÁ', 'SENTAR NO SOFÁ') });
  A.npc({ id: 'afters_host', cast: 'frames', x: 6.5, y: 5.5, dir: 'r', reach: 30, dlg: 'afters_host' });
  A.npc({ id: 'afters_apud', cast: 'apud', x: 12.5, y: 4.5, dir: 'd', reach: 20, dlg: 'afters_apud' });
  A.npc({ id: 'afters_aeriel', cast: 'resident', x: 19.5, y: 5.5, dir: 'd', reach: 20, pose: 'sit', dlg: 'afters_aeriel' });
  A.npc({ id: 'afters_isi', cast: 'nuri', x: 15.5, y: 9.5, dir: 'l', reach: 20, dlg: 'afters_isi' });
  A.npc({ id: 'afters_rosa', cast: 'rosa', x: 9.5, y: 9.5, dir: 'r', reach: 20, dlg: 'afters_rosa' });

  const WHO = function (who, role, nodes) { return { who: who, role: role, start: 'a', nodes: nodes }; };
  const AFTER = t('THE AFTERS', 'EL AFTER', 'O AFTER');
  D.afters_cook = {
    start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'afters_eggs' }, to: 'again' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`The counter has eggs, a pan, salt and a radio at conversation volume. Everyone is hungry the way people are who have not eaten since the afternoon.`, `En la barra hay huevos, una sartén, sal y una radio a volumen de conversación. Todos tienen el hambre de quien no come desde la tarde.`, `No balcão tem ovos, uma frigideira, sal e um rádio em volume de conversa. Todo mundo tá com a fome de quem não come desde a tarde.`),
        choices: [
          K('care', t(`Cook for everyone.`, `Cocinar para todos.`, `Cozinhar pra todo mundo.`), { do: { flag: 'afters_eggs', hp: 8, soc: 3, fun: 2, time: 15, care: 1 }, next: null, react: t(`Eggs, toast, a small serious cheer. Somebody says it is the best meal of the year.`, `Huevos, tostadas, un pequeño aplauso serio. Alguien dice que es la mejor comida del año.`, `Ovos, torrada, uma pequena comemoração séria. Alguém diz que é a melhor refeição do ano.`) }),
          K('chill', t(`Leave it for now.`, `Dejarlo por ahora.`, `Deixar por enquanto.`), { free: true, next: null })
        ]
      },
      again: { text: t(`The pan is clean. The plates are not.`, `La sartén está limpia. Los platos no.`, `A frigideira tá limpa. Os pratos não.`) }
    }
  };
  D.afters_jug = {
    start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'afters_drank' }, to: 'again' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`A jug of water with a slice of lemon, and a note: DRINK. NOBODY IS WATCHING YOU DRINK.`, `Una jarra de agua con una rodaja de limón y una nota: TOMA. NADIE TE MIRA TOMAR.`, `Uma jarra de água com uma rodela de limão e um bilhete: BEBA. NINGUÉM TÁ OLHANDO VOCÊ BEBER.`),
        choices: [
          K('care', t(`Drink a full glass.`, `Tomar un vaso lleno.`, `Beber um copo cheio.`), { do: { flag: 'afters_drank', water: true, hp: 6, time: 2 }, next: null, react: t(`Cold, plain, exactly right.`, `Fría, simple, exacta.`, `Gelada, simples, certinha.`) }),
          K('chill', t(`Not yet.`, `Todavía no.`, `Ainda não.`), { free: true, next: null })
        ]
      },
      again: { text: t(`The jug is lighter. There is still a lemon slice in it.`, `La jarra pesa menos. Todavía tiene una rodaja de limón.`, `A jarra tá mais leve. Ainda tem uma rodela de limão.`) }
    }
  };
  D.afters_apud = WHO('apud', AFTER, { a: { text: t(`APÜD, shoes off, feet on the table: "The sun is up. Nobody has to prove anything now."`, `APÜD, sin zapatos y con los pies en la mesa: «Ya salió el sol. Nadie tiene que demostrar nada ahora».`, `O APÜD, sem sapato e com os pés na mesa: «O sol já nasceu. Ninguém precisa provar nada agora».`), choices: [LEAVE()] } });
  D.afters_aeriel = WHO('resident', AFTER, { a: { text: t(`ÆRIEL, a plate on one knee, headphones around the neck: "Eat something. Then sleep."`, `ÆRIEL, con un plato en una rodilla y los audífonos en el cuello: «Come algo. Luego duerme».`, `A ÆRIEL, com um prato no joelho e o fone no pescoço: «Come alguma coisa. Depois dorme».`), choices: [LEAVE()] } });
  D.afters_isi = WHO('nuri', AFTER, { a: { text: t(`ISI, a mug in both hands: "If anything is still working in your system: water, salt, sleep. If the comedown scares you, tell somebody. Not alone."`, `ISI, con una taza en ambas manos: «Si algo sigue haciendo efecto: agua, sal, sueño. Si la bajada te asusta, díselo a alguien. Sola no».`, `A ISI, com uma caneca nas duas mãos: «Se ainda tem algo fazendo efeito: água, sal, sono. Se a descida te assusta, conta pra alguém. Sozinho não».`), choices: [LEAVE()] } });
  D.afters_rosa = WHO('rosa', AFTER, { a: { text: t(`ROSA, shoes off for the first time all night: "I don't dance. I sit with the eggs. Don't tell the DJ."`, `ROSA, sin zapatos por primera vez en toda la noche: «Yo no bailo. Me siento con los huevos. No le digas al DJ».`, `A ROSA, sem sapato pela primeira vez a noite toda: «Eu não danço. Eu sento com os ovos. Não conta pro DJ».`), choices: [LEAVE()] } });
  D.afters_host = {
    who: 'frames', role: AFTER, start: 'st', nodes: {
      st: { branch: [{ req: function (s) { return !!s.aftersUntil && s.time >= s.aftersUntil; }, to: 'late' }, { req: function (s) { return !!(s.flags.afters_eggs && s.flags.afters_drank); }, to: 'full' }, { req: function () { return true; }, to: 'a' }] },
      a: { text: t(`FRAMES SHELL, a plate on the arm of the chair: "There are eggs. There is water. The sofa is free. Nobody is keeping score."`, `FRAMES SHELL, con un plato en el brazo de la silla: «Hay huevos. Hay agua. El sofá está libre. Nadie lleva la cuenta».`, `O FRAMES SHELL, com um prato no braço da cadeira: «Tem ovos. Tem água. O sofá tá livre. Ninguém tá contando ponto».`), choices: [K('chill', t(`"Thank you for having us. I'm going to sleep."`, `«Gracias por recibirnos. Me voy a dormir».`, `«Valeu por receber a gente. Vou dormir».`), { call: 'afters_end', next: null }), K('chill', t(`"A little longer."`, `«Un rato más».`, `«Mais um pouquinho».`), { free: true, next: null })] },
      full: { text: t(`FRAMES SHELL looks at your plate, then at your glass. "Good. That is a night that lands softly."`, `FRAMES SHELL mira tu plato y luego tu vaso. «Bien. Esa es una noche que aterriza suave».`, `O FRAMES SHELL olha seu prato e depois seu copo. «Bom. Essa é uma noite que pousa macio».`), choices: [K('care', t(`"Thank you for having us. I'm going to sleep."`, `«Gracias por recibirnos. Me voy a dormir».`, `«Valeu por receber a gente. Vou dormir».`), { do: { fun: 3, soc: 2, care: 1 }, call: 'afters_end', next: null }), K('chill', t(`"A little longer."`, `«Un rato más».`, `«Mais um pouquinho».`), { free: true, next: null })] },
      late: { text: t(`FRAMES SHELL taps an imaginary watch. "Your hour is up. You said an hour, and we believe you."`, `FRAMES SHELL golpea un reloj imaginario. «Tu hora se acabó. Dijiste una hora, y te creemos».`, `O FRAMES SHELL bate num relógio imaginário. «Sua hora acabou. Você disse uma hora, e a gente acredita».`), choices: [K('care', t(`"Thank you. Going now."`, `«Gracias. Ya me voy».`, `«Valeu. Já tô indo».`), { do: { flag: 'afters_kept', soc: 3, care: 1 }, call: 'afters_end', next: null }), K('chill', t(`"Five more minutes."`, `«Cinco minutos más».`, `«Mais cinco minutos».`), { free: true, next: null })] }
    }
  };
  S.afters_end = function () {
    L.setQuest('q14', 'done');
    S.final_ending();
  };
  /* the one-hour promise: an alarm when it is up */
  const tick0 = story.tick;
  story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state; if (!s || s.ended || s.zone !== 'afters' || !s.aftersUntil || s.flags.afters_alarm || s.time < s.aftersUntil) return;
    s.flags.afters_alarm = true;
    U.toast({ icon: 'exclam', kind: 'info', ms: 7000, text: t(`Your alarm: one hour. You promised. Thank FRAMES SHELL whenever you are ready.`, `Tu alarma: una hora. Lo prometiste. Agradécele a FRAMES SHELL cuando estés listo.`, `Seu alarme: uma hora. Você prometeu. Agradeça ao FRAMES SHELL quando estiver pronto.`) });
  };

  /* ============================================================ the night report and the morning thread */
  const moments0 = story.moments;
  story.moments = function (s) {
    const out = moments0 ? moments0(s) : [];
    const extra = s.flags.afters_home ? t(`You turned the afters down kindly and went home to sleep.`, `Rechazaste el after con cariño y te fuiste a dormir a casa.`, `Você recusou o after com carinho e foi dormir em casa.`)
      : (s.flags.afters_kept ? t(`You gave the afters one hour and kept the promise.`, `Le diste una hora al after y cumpliste.`, `Você deu uma hora ao after e cumpriu.`)
      : (s.flags.afters_yes ? t(`You said yes to the afters and kept it gentle: water, eggs, a sofa.`, `Dijiste que sí al after y lo mantuviste suave: agua, huevos, un sofá.`, `Você disse sim ao after e manteve tudo leve: água, ovos, um sofá.`) : null));
    return extra ? [extra].concat(out).slice(0, 10) : out;
  };
  if (story.morningRefs) {
    const M = story.morningRefs;
    M.push({ id: 'afters_yes', who: 'maru', ok: function (s) { return !!s.flags.afters_yes && !s.flags.afters_short; }, t: t(`Afters report: eggs, water, the good sofa. At nine sleep got you on the sofa and we put Rosa's thermos in your hand. It was still warm. Nobody had to take anything and everybody laughed.`, `Reporte del after: huevos, agua, el sofá bueno. A las nueve te venció el sueño en el sofá y te pusimos el termo de Rosa en la mano. Seguía tibio. Nadie tuvo que tomar nada y todos se rieron.`, `Relatório do after: ovos, água, o sofá bom. Às nove o sono te venceu no sofá e a gente pôs a térmica da Rosa na sua mão. Ainda estava morna. Ninguém precisou tomar nada e todo mundo riu.`) });
    M.push({ id: 'afters_short', who: 'maru', ok: function (s) { return !!s.flags.afters_short; }, t: t(`You left after exactly one hour, as promised. The eggs got cold. We respect the alarm.`, `Te fuiste a la hora exacta, como prometiste. Los huevos se enfriaron. Respetamos la alarma.`, `Você saiu depois de exatamente uma hora, como prometeu. Os ovos esfriaram. A gente respeita o alarme.`) });
    M.push({ id: 'afters_home', who: 'maru', ok: function (s) { return !!s.flags.afters_home; }, t: t(`Good call. Sleep, water, a charger. The sofa will still be there next time. Text me when you wake up.`, `Buena decisión. Dormir, agua, un cargador. El sofá seguirá ahí la próxima vez. Escríbeme cuando despiertes.`, `Boa decisão. Dormir, água, carregador. O sofá vai continuar lá da próxima vez. Me manda mensagem quando acordar.`) });
  }
})();

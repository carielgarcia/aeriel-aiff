/* EXCUSE ME — story v30: the closing roof, and the mission that leads to THE AFTER.
   THE ROOF: a full crowd on both sides, a ring of the team (Rosa, Luca, Isi, Mika, Dario, Dragan) standing in a circle with an open
   middle where you and your friends watch the sunrise, and the DJ booth behind that circle looking at the sunrise, with ÆRIEL in
   the middle, FRAMES SHELL on one side and APÜD on the other. Nobody speaks to you until you choose to talk to them (each member
   says their thanks once, when you do).
   THE AFTERS (main mission q13): after the sunrise, whoever you talked to, the next mission is to decide about the afters. Anselm
   (with Dot beside him, golden star) has the invitation to their flat. Yes starts THE AFTER (story_v29*.js: the flat, the noise,
   the guests, the noon ending `after`). Home ends the game with the existing ending. Loads after story_v29c.js, before compact.js. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones, TL = EM.TL, D = EM.DIALOGUES, S = EM.scripts, story = EM.story, AF = EM.AF || {};
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
    R.npc({ id: 'frames_roof', cast: 'frames', x: 13.5, y: 9.6, dir: 'u', reach: 36, dlg: 'frames_roof_talk' });
    R.npc({ id: 'dj_roof', cast: 'resident', x: 15.5, y: 9.6, dir: 'u', decor: true });
    R.npc({ id: 'apud_roof', cast: 'apud', x: 17.5, y: 9.6, dir: 'u', reach: 36, dlg: 'apud_roof_talk' });
    /* the crowd: both sides, calm; the middle is for the circle and for you */
    R.crowdRect(1, 3, 7, 9, 3).crowdRect(21, 3, 8, 9, 3);
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
    /* the hosts of the afters, at the edge of the circle: Anselm holds the invitation (the golden star), Dot is beside him */
    R.npc({ id: 'af_inviter', cast: 'anselm', x: 9.5, y: 6.4, dir: 'r', reach: 26, dlg: function (s) { return s.quests.q13 === 'active' ? 'afters_invite' : 'afters_hosts_wait'; } });
    R.npc({ id: 'af_inviter_dot', cast: 'dot', x: 9.5, y: 7.6, dir: 'r', decor: true });
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
      a: { text: t(`FRAMES SHELL, eyes on the sky: "Face the light. Everything else can wait five minutes."`, `FRAMES SHELL, con los ojos en el cielo: «Mira la luz. Todo lo demás puede esperar cinco minutos».`, `O FRAMES SHELL, de olho no céu: «Olha pra luz. O resto pode esperar cinco minutos».`), choices: [LEAVE()] }
    }
  };
  D.apud_roof_talk = {
    who: 'apud', role: t('THE CLOSING SET', 'EL SET DE CIERRE', 'O SET DE ENCERRAMENTO'), start: 'a', nodes: {
      a: { text: t(`APÜD, one hand on the mixer, not looking away from the horizon: "First light in a few minutes. Stand with your people. The middle is yours."`, `APÜD, con una mano en la mezcladora, sin apartar la vista del horizonte: «La primera luz llega en unos minutos. Párate con tu gente. El centro es tuyo».`, `O APÜD, com uma mão na mesa de mixagem, sem tirar os olhos do horizonte: «A primeira luz chega em poucos minutos. Fica com sua galera. O centro é de vocês».`), choices: [LEAVE()] }
    }
  };
  D.afters_hosts_wait = {
    who: 'anselm', role: t('THE HOSTS', 'LOS ANFITRIONES', 'OS ANFITRIÕES'), start: 'a', nodes: {
      a: { text: t(`ANSELM, with Dot at his shoulder, facing the east: "Watch first. We will find you after."`, `ANSELM, con Dot al hombro, mirando al este: «Primero mira. Te buscamos después».`, `O ANSELM, com a Dot no ombro, olhando pro leste: «Primeiro olha. A gente te procura depois».`), choices: [LEAVE()] }
    }
  };

  /* ============================================================ THE SUNRISE LEADS TO THE AFTERS MISSION */
  if (D.sunrise) {
    D.sunrise.after = 'afters_begin';
    if (D.sunrise.nodes.end) { D.sunrise.nodes.end.next = null; D.sunrise.nodes.end.do = { quest: { q9: 'done', q13: 'active' }, flag: 'afters_open' }; } /* one objective change; the old choice inside the dialogue is now this mission */
  }
  EM.QUESTS.q13 = {
    title: t('THE AFTERS', 'EL AFTER', 'O AFTER'),
    desc: function (s) {
      return t(`The sun is up. Anselm and Dot, at the edge of the circle, are taking whoever has energy left to their flat: toast, a sofa, shoes off. ${mk(s, 'afters_answered')} Decide: go to the after, or go home. Home ends the night.`,
        `Salió el sol. Anselm y Dot, al borde del círculo, se llevan a quien tenga energía a su departamento: tostadas, un sofá, zapatos fuera. ${mk(s, 'afters_answered')} Decide: ir al after o irte a casa. Volver a casa termina la noche.`,
        `O sol nasceu. O Anselm e a Dot, na beira da roda, estão levando quem ainda tem energia pro apê deles: torrada, um sofá, sapato fora. ${mk(s, 'afters_answered')} Decida: ir pro after ou pra casa. Ir pra casa termina a noite.`);
    },
    doneText: t(`You answered. The rest of the night is yours.`, `Respondiste. El resto de la noche es tuyo.`, `Você respondeu. O resto da noite é seu.`)
  };
  const obj0 = story.objective;
  story.objective = function (s) {
    if (s.quests.q13 === 'active') return t(`The sun is up. Anselm and Dot are inviting people to the afters. Talk to Anselm and decide.`, `Salió el sol. Anselm y Dot invitan al after. Habla con Anselm y decide.`, `O sol nasceu. O Anselm e a Dot estão convidando pro after. Fale com o Anselm e decida.`);
    return obj0(s);
  };
  /* the golden star: the inviter on the roof */
  EM.seekers.push(function (s) { return s.quests.q13 === 'active' ? [{ key: 'af_inviter', zone: 'rooftop', label: '★' }] : []; });

  /* the sunrise is over: the night stays open past 08:00 until you answer */
  S.afters_begin = function () {
    EM.state.flags.afters_open = true;
    U.toast({ icon: 'star', kind: 'good', ms: 6500, text: t(`NEW MISSION: THE AFTERS. Anselm has an invitation. Follow the golden star.`, `NUEVA MISIÓN: EL AFTER. Anselm tiene una invitación. Sigue la estrella dorada.`, `NOVA MISSÃO: O AFTER. O Anselm tem um convite. Siga a estrela dourada.`) });
  };

  /* the invitation: yes starts THE AFTER (the flat); home ends the game with the existing ending */
  D.afters_invite = {
    who: 'anselm', role: t('THE AFTERS', 'EL AFTER', 'O AFTER'), start: 'a', nodes: {
      a: {
        text: function (s) {
          const out = [AF.invite ? AF.invite(s) : t(`Anselm and Dot: "Come to ours. Shoes off, no phones, no one has to do anything."`, `Anselm y Dot: «Vengan a casa. Zapatos fuera, sin celulares, nadie tiene que hacer nada».`, `Anselm e Dot: «Vem pra nossa casa. Sapato fora, sem celular, ninguém precisa fazer nada».`)];
          if (L.hasFriend('maru')) out.push(t(`Maru is already pulling at your sleeve. "Say yes. They said toast."`, `Maru ya te jala de la manga. «Di que sí. Dijeron tostadas».`, `A Maru já tá puxando sua manga. «Diz que sim. Eles falaram torrada».`));
          return out;
        },
        choices: [
          K('care', t(`"Yes. Toast, a sofa, more of the same people."`, `«Sí. Tostadas, un sofá, más de la misma gente».`, `«Sim. Torrada, um sofá, mais da mesma galera».`), { do: { flag: ['after_go', 'afters_answered'] }, call: 'afters_go', next: null }),
          K('chill', t(`"Thank you. I'm going home to sleep." (This ends the night.)`, `«Gracias. Me voy a casa a dormir». (Esto termina la noche.)`, `«Valeu. Vou pra casa dormir». (Isso termina a noite.)`), { do: { flag: ['after_home', 'afters_answered'], hp: 5, soc: 1, care: 1 }, call: 'afters_home', next: null }),
          LEAVE()
        ]
      }
    }
  };
  S.afters_go = function () { L.setQuest('q13', 'done'); S.final_ending(); };   /* final_ending (story_v29.js) starts THE AFTER when after_go is set */
  S.afters_home = function () { L.setQuest('q13', 'done'); S.final_ending(); }; /* without after_go it is the existing ending */
})();

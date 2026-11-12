/* EXCUSE ME — story v29, part 3: the master bedroom (a continuation of the dark room: a bed instead of a curtain, daylight instead of dark),
   the phone (text a friend who went home) and the morning: a noon thread and Tuesday. Tasteful, implied, never shown. Consent first: a
   pop-up where Dot walks in behind you and says the rules, a room that refuses anyone too high to agree (you included), water before
   pushing, and a courteous no that costs nothing beyond itself. Skip the room and you lose nothing. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, story = EM.story;
  const D = EM.DIALOGUES, S = EM.scripts, AF = EM.AF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const FR = ['maru', 'dani', 'tato'];
  const nm = function (f) { return EM.CAST[f].name; };

  /* ============================================================ the gate: fit to agree, and Dot behind you */
  /* fit: not past the point where "yes" means anything. The room says no, and so can you. */
  AF.mbFit = function (s) { return L.high() < 3 && s.stats.hp >= EM.LOW_HP && !s.fx.ket; };
  S.af_mb_gate = function () {
    const s = EM.state;
    if (!s.flags.mb_open) { U.toast({ icon: 'eyes', kind: 'info', text: t(`The door at the end is shut. Hear the house rules first.`, `La puerta del fondo está cerrada. Escucha primero las reglas de la casa.`, `A porta do fundo tá fechada. Ouça primeiro as regras da casa.`) }); return; }
    s.flags.mb_escort = true;
    U.startDialogue('af_mb', { npc: 'dot' });
  };
  S.af_mb_in = function () {
    const s = EM.state; s.flags.mb_escort = false; s.flags.mb_visit = true;
    EM.hooks.travel({ zone: 'a_master', x: 3, y: 7, dir: 'u' });
  };
  S.af_push = function () { L.hostRude(); };
  S.af_mb_noise = function () { AF.noise(6); EM.state.flags.mb_visit = true; };
  const unesc = { unflag: 'mb_escort' };
  D.af_dot_mb = { who: 'dot', role: t('HOST', 'ANFITRIONA', 'ANFITRIÃ'), start: 'a', nodes: { a: { text: t(`"Whenever you're ready. No hurry."`, `«Cuando quieras. Sin apuro».`, `«Quando quiser. Sem pressa».`), choices: [K('chill', t(`Back to the living room.`, `Volver a la sala.`, `Voltar pra sala.`), { free: true, do: unesc, next: null })] } } };
  D.af_mb = {
    forced: true, who: 'dot', role: t('HOST', 'ANFITRIONA', 'ANFITRIÃ'), start: 'st', nodes: {
      st: { branch: [{ req: function (s) { return !s.flags.mb_met; }, to: 'rules' }, { req: function () { return true; }, to: 'check' }] },
      rules: {
        text: [
          t(`A hand on your shoulder: Dot has followed you down the hall, silent in her socks. "I said I'd walk you in. Three rules, then it's yours."`, `Una mano en tu hombro: Dot te siguió por el pasillo, silenciosa en calcetines. «Dije que te acompañaría. Tres reglas, y después es tuyo».`, `Uma mão no seu ombro: a Dot te seguiu pelo corredor, silenciosa de meia. «Eu disse que te acompanhava. Três regras, e depois é seu».`),
          t(`"One: ask first. Two: a yes is a word and a no is a sentence. Three: nobody films, nobody pushes, and nobody stays where they aren't wanted. These are Dario's three, from the dark room at La Grieta. We borrowed them."`, `«Una: pregunta primero. Dos: un sí es una palabra y un no es una frase. Tres: nadie filma, nadie empuja y nadie se queda donde no lo quieren. Son las tres de Dario, del cuarto oscuro de La Grieta. Las tomamos prestadas».`, `«Uma: pergunta primeiro. Duas: um sim é uma palavra e um não é uma frase. Três: ninguém filma, ninguém empurra e ninguém fica onde não é querido. São as três do Dario, da dark room da La Grieta. A gente pegou emprestadas».`),
          t(`"Everyone uses protection. It's in the bowl by the door, free. And if you're too high to say yes, the room says no, and so do I. That's care, not judgment. You can look and leave. It costs nothing."`, `«Todos usan protección. Está en el bol junto a la puerta, gratis. Y si estás demasiado arriba para decir sí, la habitación dice no, y yo también. Es cuidado, no juicio. Puedes mirar e irte. No cuesta nada».`, `«Todo mundo usa proteção. Tá na tigela na porta, de graça. E se você tá alto demais pra dizer sim, o quarto diz não, e eu também. É cuidado, não julgamento. Pode olhar e sair. Não custa nada».`)
        ], do: { flag: 'mb_met' }, next: 'phone'
      },
      phone: { branch: [{ req: function (s) { return !!s.flags.phone_kept && !s.flags.phone_basket; }, to: 'basket' }, { req: function () { return true; }, to: 'check' }] },
      basket: {
        text: t(`"Phones stay at the door in here. You promised yours was off. In the basket it goes."`, `«Aquí los celulares se quedan en la puerta. Prometiste que el tuyo estaba apagado. A la canasta».`, `«Aqui o celular fica na porta. Você prometeu que o seu tava desligado. Pra cesta».`),
        choices: [
          K('care', t(`Put it in the basket.`, `Dejarlo en la canasta.`, `Pôr na cesta.`), { free: true, do: { flag: 'phone_basket', unflag: 'phone_kept', soc: 1 }, next: 'check' }),
          K('chill', t(`Not today. Back to the living room.`, `Hoy no. Volver a la sala.`, `Hoje não. Voltar pra sala.`), { free: true, do: unesc, next: null })
        ]
      },
      check: { branch: [{ req: function (s) { return !AF.mbFit(s); }, to: 'refuse' }, { req: function (s) { return L.high() >= 2; }, to: 'water' }, { req: function () { return true; }, to: 'enter' }] },
      refuse: {
        text: t(`Dot shakes her head, kindly. "You're too high to say yes to anyone right now, and the room says no. Water, a sit, an hour. It'll be here."`, `Dot niega con la cabeza, con cariño. «Estás demasiado arriba para decirle que sí a alguien ahora mismo, y la habitación dice no. Agua, sentarte, una hora. Va a estar aquí».`, `A Dot nega com a cabeça, com carinho. «Você tá alto demais pra dizer sim pra alguém agora, e o quarto diz não. Água, sentar, uma hora. Vai tá aqui».`),
        choices: [
          K('care', t(`Fair. Water and a sit.`, `Justo. Agua y sentarme.`, `Justo. Água e sentar.`), { free: true, do: { water: true, time: 6, unflag: 'mb_escort' }, next: null }),
          K('chill', t(`Okay. Another time.`, `Está bien. Otro día.`, `Tá bom. Outra hora.`), { free: true, do: unesc, next: null })
        ]
      },
      water: {
        text: t(`"You're rolling. That's fine. Do you want water first?"`, `«Estás en el viaje. Está bien. ¿Quieres agua primero?»`, `«Você tá no efeito. Tá tudo bem. Quer água primeiro?»`),
        choices: [
          K('care', t(`Water first.`, `Primero agua.`, `Primeiro a água.`), { do: { water: true, time: 10, flag: 'mb_water', care: 1 }, next: 'enter' }),
          K('chill', t(`I'm good. Let me in.`, `Estoy bien. Déjame pasar.`, `Tô bem. Me deixa entrar.`), { next: 'enter' }),
          K('chill', t(`Not today.`, `Hoy no.`, `Hoje não.`), { free: true, do: unesc, next: null })
        ]
      },
      enter: {
        text: t(`She opens the door and steps back. She stays at the threshold, arms folded, not watching. The room is lit by morning: a bed, a lamp, a bowl by the door, a jug of water. Nobody looks up. You can look, stay, or leave.`, `Abre la puerta y da un paso atrás. Se queda en el umbral, brazos cruzados, sin mirar. La habitación está iluminada por la mañana: una cama, una lámpara, un bol junto a la puerta, una jarra de agua. Nadie levanta la vista. Puedes mirar, quedarte o irte.`, `Ela abre a porta e dá um passo atrás. Fica na soleira, braços cruzados, sem olhar. O quarto tá iluminado pela manhã: uma cama, um abajur, uma tigela na porta, uma jarra de água. Ninguém levanta o olhar. Dá pra olhar, ficar ou sair.`),
        choices: [
          K('chill', t(`Go in.`, `Entrar.`, `Entrar.`), { free: true, call: 'af_mb_in', next: null }),
          K('chill', t(`Not today.`, `Hoy no.`, `Hoje não.`), { free: true, do: unesc, next: null })
        ]
      }
    }
  };

  D.af_bowl = {
    start: 'a', nodes: {
      a: {
        text: t(`A glass bowl of condoms and lube, a bin, a box of tissues, a jug of water, a folded blanket. A small sign above it says EVERYONE USES PROTECTION.`, `Un bol de vidrio con condones y lubricante, un tacho, una caja de pañuelos, una jarra de agua, una manta doblada. Un cartelito encima dice EVERYONE USES PROTECTION.`, `Uma tigela de vidro com camisinhas e lubrificante, uma lixeira, uma caixa de lenços, uma jarra de água, um cobertor dobrado. Uma plaquinha em cima diz EVERYONE USES PROTECTION.`),
        choices: [
          K('care', t(`Take a few. Better to have them.`, `Tomar unos cuantos. Mejor tenerlos.`, `Pegar algumas. Melhor ter.`), { req: function (s) { return !s.flags.mb_supplies; }, do: { flag: 'mb_supplies', soc: 1 }, next: null }),
          K('care', t(`Drink some water.`, `Tomar agua.`, `Beber água.`), { do: { water: true, time: 3 }, next: null }),
          K('chill', t(`Leave it as it is.`, `Dejarlo como está.`, `Deixar como tá.`), { free: true, next: null })
        ]
      }
    }
  };

  /* ============================================================ the encounters: four people, four conversations, then the ask.
     Talking first is what opens the room: a person you have listened to answers the same questions with a yes, so the outcome comes from
     what you said and asked, not from a roll. Without a conversation the old odds apply. Every step can still end in a courteous no. */
  const NO = [
    t(`They hold your eyes, then turn their shoulders away, kind and clear. A no, and a courteous one. You nod once, step back and breathe out.`, `Te sostienen la mirada y luego giran los hombros, con amabilidad y claridad. Un no, y uno cortés. Asientes una vez, das un paso atrás y sueltas el aire.`, `Seguram seu olhar e depois viram os ombros, gentis e claros. Um não, e um não educado. Você assente uma vez, dá um passo atrás e solta o ar.`),
    t(`The hand you were about to meet goes, politely, to a pocket. The gaze goes to the window. Nothing is said. Your ears are warm, and nobody saw.`, `La mano que ibas a encontrar se va, con educación, a un bolsillo. La mirada se va a la ventana. No se dice nada. Te arden las orejas, y nadie lo vio.`, `A mão que você ia encontrar vai, educadamente, pro bolso. O olhar vai pra janela. Nada é dito. Suas orelhas esquentam, e ninguém viu.`),
    t(`A small shake of the head and a squeeze of your forearm that says thank you for asking like that. It is a no, and a good one. It costs a little anyway, and you carry it back to the door.`, `Un pequeño movimiento de cabeza y un apretón en tu antebrazo que dice gracias por preguntar así. Es un no, y uno bueno. Igual cuesta un poco, y te lo llevas de vuelta a la puerta.`, `Um pequeno aceno de cabeça e um aperto no seu antebraço que diz obrigado por perguntar assim. É um não, e um bom não. Mesmo assim custa um pouco, e você leva isso de volta pra porta.`)
  ];
  const pickNo = function () { return NO[Math.floor(Math.random() * NO.length)]; };
  const FAIL = { hp: -6, fun: -8 };
  const WIN = { hp: 15, soc: 15, fun: 6, weird: -3, time: 35 };
  const HELD = { hp: 6, soc: 6, fun: 2 };
  const rollp = function (base, who) { return function (s) { return !!s.flags[who + '_talked'] || Math.random() < Math.min(0.98, L.makeoutChance(base, who) + (s.flags.mb_water ? 0.05 : 0)); }; };

  function enc(id, name, c) {
    const done = id + '_done', n = name, tk = id + '_talked';
    const noNode = { text: pickNo, do: Object.assign({}, FAIL, { flag: [done, 'mb_fail'] }), next: null };
    const nodes = {
      st: { branch: [{ req: function (s) { return !AF.mbFit(s); }, to: 'me' }, { req: c.high ? function (s) { return c.high(s); } : function () { return false; }, to: 'them' }, { req: function () { return true; }, to: 'a' }] },
      me: {
        text: t(`Your own head is somewhere near the ceiling. At the door Dot catches your eye. "Water," she says, gently. "Then ask again."`, `Tu cabeza está en algún lugar cerca del techo. En la puerta Dot te mira. «Agua», dice con suavidad. «Y después vuelves a preguntar».`, `Sua cabeça tá em algum lugar perto do teto. Na porta a Dot te olha. «Água», diz, com suavidade. «Depois pergunta de novo».`),
        choices: [
          K('care', t(`Drink water. Sit it out.`, `Tomar agua. Esperar sentado.`, `Beber água. Esperar sentado.`), { free: true, do: { water: true, time: 10 }, next: null }),
          K('chill', t(`Leave.`, `Irte.`, `Sair.`), { free: true, next: null })
        ]
      },
      them: {
        text: c.highText,
        choices: [
          K('care', t(`"Do you want some water first?"`, `«¿Quieres agua primero?»`, `«Quer água primeiro?»`), { do: { care: 1, soc: 4, time: 8, flag: id + '_water' }, next: 'water' }),
          K('chill', t(`Leave them be.`, `Dejarlos en paz.`, `Deixar em paz.`), { free: true, next: null }),
          K('push', t(`Lean in anyway. "You're fine."`, `Acercarte igual. «Estás bien».`, `Chegar perto mesmo assim. «Você tá bem».`), { bad: true, do: { soc: -8, weird: 6, call: 'af_push' }, next: 'pushed' })
        ]
      },
      water: { text: t(`${n} drinks slowly, and a little of the far-away leaves their face. "Ask me again in an hour. Thank you for asking about the water."`, `${n} bebe despacio, y algo de lo lejano se va de su cara. «Pregúntame otra vez en una hora. Gracias por preguntar por el agua».`, `${n} bebe devagar, e um pouco do longe sai do rosto. «Me pergunta de novo daqui a uma hora. Obrigado por perguntar da água».`), next: null },
      pushed: { text: t(`From the threshold Dot says one word, your name, in a voice that fills the flat. ${n} has already turned away. You were told, and you did it anyway.`, `Desde el umbral Dot dice una palabra, tu nombre, con una voz que llena el departamento. ${n} ya se dio vuelta. Te lo dijeron y lo hiciste igual.`, `Da soleira a Dot diz uma palavra, o seu nome, numa voz que enche o apê. ${n} já virou. Te avisaram e você fez mesmo assim.`), next: null },
      a: {
        text: c.intro,
        choices: [
          K('ask', t(`Sit down and talk first.`, `Sentarte y hablar primero.`, `Sentar e conversar primeiro.`), { do: { time: 12 }, next: 'talk' }),
          K('flirt', t(`Walk over. Slowly. Leave room to turn away.`, `Acercarte. Despacio. Dejar espacio para irse.`, `Se aproximar. Devagar. Dar espaço pra se afastar.`), { next: 'r1' }),
          K('chill', t(`Not this one. Not today.`, `A este no. Hoy no.`, `Esse não. Hoje não.`), { free: true, next: null })
        ]
      },
      talk: {
        text: c.talk,
        choices: [
          K('care', c.q1, { do: { soc: 3, care: 1, flag: [tk, 'mb_talked'] }, next: 'talk1' }),
          K('honest', c.q2, { do: { soc: 3, care: 1, flag: [tk, 'mb_talked'] }, next: 'talk2' }),
          K('chill', t(`Thank them and leave it at that.`, `Agradecer y dejarlo ahí.`, `Agradecer e deixar por aí.`), { free: true, do: { soc: 2, flag: [tk, 'mb_talked'] }, next: null })
        ]
      },
      talk1: { text: c.r1, next: 'ask' },
      talk2: { text: c.r2, next: 'ask' },
      ask: {
        text: t(`The room has gone quieter around the two of you. There is a question in the air and neither of you has asked it yet.`, `La habitación se volvió más silenciosa alrededor de los dos. Hay una pregunta en el aire y ninguno la hizo todavía.`, `O quarto ficou mais quieto em volta de vocês dois. Tem uma pergunta no ar e nenhum dos dois fez ainda.`),
        choices: [
          K('honest', t(`Say it out loud: "Would you like to?"`, `Decirlo en voz alta: «¿Quieres?»`, `Dizer em voz alta: «Você quer?»`), { next: 'rv' }),
          K('care', t(`Stay as you are. This was already good.`, `Quedarte así. Esto ya estuvo bien.`, `Ficar assim. Isso já foi bom.`), { do: Object.assign({}, HELD, { flag: done }), next: null, react: c.held })
        ]
      },
      r1: { branch: [{ req: rollp(0.9, id), to: 'eyes' }, { req: function () { return true; }, to: 'no1' }] },
      eyes: {
        text: t(`${n} looks up, and you hold the look a second longer than politeness asks. There is a question in it. ${n} lets it stay.`, `${n} levanta la vista, y sostienes la mirada un segundo más de lo que pide la cortesía. Hay una pregunta en ella. ${n} la deja ahí.`, `${n} levanta o olhar, e você sustenta o olhar um segundo a mais do que a educação pede. Tem uma pergunta nele. ${n} deixa ficar.`),
        choices: [
          K('smooth', t(`Hold the look. Let it ask.`, `Sostener la mirada. Que pregunte.`, `Sustentar o olhar. Deixar perguntar.`), { next: 'r2' }),
          K('chill', t(`Smile, look away, let it go.`, `Sonreír, desviar la vista, soltarlo.`, `Sorrir, desviar o olhar, deixar pra lá.`), { free: true, do: { soc: 2 }, next: null })
        ]
      },
      r2: { branch: [{ req: rollp(0.86, id), to: 'touch' }, { req: function () { return true; }, to: 'no2' }] },
      touch: {
        text: t(`Daylight on the sheets. You reach out and brush a hand, an arm, slowly, leaving room to pull away. ${n} answers with a hand of their own.`, `Luz de día sobre las sábanas. Extiendes la mano y rozas una mano, un brazo, despacio, dejando espacio para retirarte. ${n} responde con una mano propia.`, `Luz do dia nos lençóis. Você estende a mão e roça uma mão, um braço, devagar, deixando espaço pra recuar. ${n} responde com uma mão também.`),
        choices: [
          K('smooth', t(`Stay. Let the touch say it.`, `Quedarte. Que el roce lo diga.`, `Ficar. Deixar o toque dizer.`), { next: 'r3' }),
          K('chill', t(`Step back. That was enough.`, `Dar un paso atrás. Con eso alcanzó.`, `Dar um passo atrás. Isso bastou.`), { free: true, do: { soc: 2, fun: 1 }, next: null })
        ]
      },
      r3: { branch: [{ req: rollp(0.82, id), to: 'direct' }, { req: function () { return true; }, to: 'no3' }] },
      direct: {
        text: t(`The door is shut but not locked. Somewhere in the flat a kettle clicks. ${n} says, quietly, "Come here." It is not an order. It is a possibility.`, `La puerta está cerrada, pero sin llave. En algún lugar del departamento hace clic una tetera. ${n} dice, bajito, «ven». No es una orden. Es una posibilidad.`, `A porta tá fechada, mas sem chave. Em algum lugar do apê uma chaleira estala. ${n} diz, baixinho, «vem». Não é uma ordem. É uma possibilidade.`),
        choices: [
          K('makeout', t(`Nod. Follow.`, `Asentir. Seguir.`, `Assentir. Seguir.`), { next: 'r4' }),
          K('honest', t(`Say it out loud first: "Is this okay? Tell me what you want."`, `Decirlo en voz alta primero: «¿Está bien? Dime qué quieres».`, `Dizer em voz alta primeiro: «Tá bom assim? Me diz o que você quer».`), { next: 'rv' }),
          K('care', t(`Stop. Thank them. This is far enough.`, `Parar. Agradecer. Hasta aquí está bien.`, `Parar. Agradecer. Até aqui tá bom.`), { do: Object.assign({}, HELD, { flag: done }), next: null, react: c.held })
        ]
      },
      r4: { branch: [{ req: rollp(0.78, id), to: 'win' }, { req: function () { return true; }, to: 'no4' }] },
      rv: {
        text: t(`${n} breathes out, and the corner of the mouth moves. The question has been asked in a voice, and a voice is an answer.`, `${n} suelta el aire, y se mueve la comisura de la boca. La pregunta fue hecha en voz alta, y una voz es una respuesta.`, `${n} solta o ar, e o canto da boca se mexe. A pergunta foi feita em voz alta, e uma voz é uma resposta.`),
        next: 'rvb'
      },
      rvb: { branch: [{ req: function (s) { return !!s.flags[tk] || Math.random() < (c.vp || 0.96); }, to: 'rv_yes' }, { req: function () { return true; }, to: 'rv_no' }] },
      rv_yes: { text: c.yes, next: 'win' },
      rv_no: { text: t(`"Thank you for asking. Not today." ${n} says it plainly. A no is a sentence, and you heard all of it. You say thank you back.`, `«Gracias por preguntar. Hoy no». ${n} lo dice sin rodeos. Un no es una frase, y la escuchaste completa. Tú también das las gracias.`, `«Obrigado por perguntar. Hoje não». ${n} diz sem rodeio. Um não é uma frase, e você ouviu inteira. Você agradece de volta.`), do: { soc: 1, flag: done }, next: null },
      win: {
        text: c.win,
        do: Object.assign({}, WIN, { flag: [done, 'mb_aftercare'], call: 'af_mb_noise' }), next: null
      },
      no1: noNode, no2: noNode, no3: noNode, no4: noNode
    };
    D['af_enc_' + id] = { who: id, role: t('ACROSS THE ROOM', 'AL OTRO LADO DE LA HABITACIÓN', 'DO OUTRO LADO DO QUARTO'), start: 'st', nodes: nodes };
  }
  /* four people, four registers. A "yes" is a word; the room's tone stays tasteful and implied */
  enc('pax', 'PAX', {
    vp: 0.97,
    intro: t(`Pax sits on the edge of the bed with a mug, shirt half open, rested. He sees you and lifts the mug an inch.`, `Pax está en el borde de la cama con una taza, la camisa medio abierta, descansado. Te ve y levanta la taza un centímetro.`, `O Pax tá na beira da cama com uma caneca, camisa meio aberta, descansado. Ele te vê e levanta a caneca um centímetro.`),
    talk: t(`"Sit. I'm forty-one. Twelve years married, and it ended in March. Nobody has touched me since, except at the hairdresser's." He turns the mug in his hands. "I came here to find out whether I still know how to want something."`, `«Siéntate. Tengo cuarenta y uno. Doce años casado, y terminó en marzo. Nadie me ha tocado desde entonces, salvo en la peluquería». Gira la taza entre las manos. «Vine a ver si todavía sé cómo se desea algo».`, `«Senta. Tenho quarenta e um. Doze anos casado, e acabou em março. Ninguém me tocou desde então, só no cabeleireiro». Ele gira a caneca nas mãos. «Vim descobrir se ainda sei como é desejar alguma coisa».`),
    q1: t(`"And do you? Know how?"`, `«¿Y sabes?»`, `«E sabe?»`),
    q2: t(`"Take your time. Nobody here is keeping a clock."`, `«Tómate tu tiempo. Aquí nadie lleva un reloj».`, `«Leve o tempo que precisar. Aqui ninguém marca relógio».`),
    r1: t(`"I think so. It's coming back in pieces. That's allowed, isn't it?" He laughs, nervous and warm. "Saying it to you helped more than the room did."`, `«Creo que sí. Vuelve en pedazos. Eso se puede, ¿no?» Se ríe, nervioso y cálido. «Decírtelo a ti ayudó más que la habitación».`, `«Acho que sim. Tá voltando aos pedaços. Isso pode, né?» Ele ri, nervoso e caloroso. «Falar com você ajudou mais que o quarto».`),
    r2: t(`"No clocks." He breathes out slowly. "Okay. Then I can say that I'm scared, and that I want to anyway."`, `«Sin relojes». Suelta el aire despacio. «Bueno. Entonces puedo decir que tengo miedo, y que quiero igual».`, `«Sem relógio». Ele solta o ar devagar. «Tá. Então posso dizer que tô com medo, e que quero mesmo assim».`),
    held: t(`Pax puts a hand flat on his chest and nods at you. "That was the thing I needed. Thank you." He picks the mug back up, and he is a lot less alone than he was.`, `Pax se pone una mano plana en el pecho y te asiente. «Eso era lo que necesitaba. Gracias». Retoma la taza, y está bastante menos solo que antes.`, `O Pax põe a mão aberta no peito e assente pra você. «Era disso que eu precisava. Obrigado». Pega a caneca de novo, e tá bem menos sozinho do que antes.`),
    yes: t(`"Yes," Pax says, immediately and warmly, and sets down the mug. "Thank you for asking. That's the best part."`, `«Sí», dice Pax, de inmediato y con calidez, y deja la taza. «Gracias por preguntar. Es la mejor parte».`, `«Sim», diz o Pax, na hora e com calor, e larga a caneca. «Obrigado por perguntar. É a melhor parte».`),
    win: t(`Pax pulls the curtain halfway across. The light goes soft and the sheet goes warm. What happens next belongs to the two of you, and stays in the room. Later you lie listening to the flat: a kettle, a pipe, a neighbour's radio. He says, to the ceiling, "I still know how." You don't say anything. You don't need to.`, `Pax corre la cortina hasta la mitad. La luz se suaviza y la sábana se entibia. Lo que pasa después es de los dos, y se queda en la habitación. Más tarde están tumbados oyendo el departamento: una tetera, una cañería, la radio de un vecino. Dice, al techo: «Todavía sé cómo». No dices nada. No hace falta.`, `O Pax puxa a cortina até a metade. A luz suaviza e o lençol esquenta. O que acontece depois é dos dois, e fica no quarto. Mais tarde vocês ficam deitados ouvindo o apê: uma chaleira, um cano, o rádio de um vizinho. Ele diz, pro teto: «Ainda sei como». Você não diz nada. Não precisa.`)
  });
  enc('nell', 'NELL', {
    vp: 0.97,
    intro: t(`Nell lies on her back across the foot of the bed with her feet on the wall, reading a paperback upside down. She sees you and doesn't move the book.`, `Nell está tendida boca arriba a los pies de la cama con los pies en la pared, leyendo un libro al revés. Te ve y no mueve el libro.`, `A Nell tá deitada de costas aos pés da cama com os pés na parede, lendo um livro de cabeça pra baixo. Ela te vê e não mexe o livro.`),
    talk: t(`"I narrate everything," Nell says to the ceiling. "Every dinner, every walk, I'm already writing it. It stops in here. It's the one place I'm not describing it to somebody." She tilts her head to look at you. "My partner knows I'm here. He said to bring toast."`, `«Narro todo», dice Nell al techo. «Cada cena, cada paseo, ya lo estoy escribiendo. Aquí se detiene. Es el único lugar donde no se lo estoy describiendo a nadie». Inclina la cabeza para mirarte. «Mi pareja sabe que estoy aquí. Dijo que trajera tostadas».`, `«Eu narro tudo», diz a Nell pro teto. «Cada jantar, cada caminhada, já tô escrevendo. Aqui isso para. É o único lugar onde eu não tô descrevendo pra alguém». Ela inclina a cabeça pra te olhar. «Meu parceiro sabe que eu tô aqui. Mandou levar torrada».`),
    q1: t(`"What's it like when it stops?"`, `«¿Cómo es cuando se detiene?»`, `«Como é quando para?»`),
    q2: t(`"That sounds fair. To both of you."`, `«Suena justo. Para los dos».`, `«Parece justo. Pros dois».`),
    r1: t(`"Quiet. The fridge switches off and you realise it was humming all along." She laughs. "I didn't know I wanted that until I was in a room that asked for nothing."`, `«Silencio. La heladera se apaga y te das cuenta de que zumbaba todo el rato». Se ríe. «No sabía que lo quería hasta que estuve en una habitación que no pedía nada».`, `«Silêncio. A geladeira desliga e você percebe que ela zumbia o tempo todo». Ela ri. «Eu não sabia que queria isso até estar num quarto que não pedia nada».`),
    r2: t(`"It took us three years of arguments to get there." She turns the page without reading it. "Most of what's good in my life is a boring agreement made out loud."`, `«Nos tomó tres años de discusiones llegar ahí». Pasa la página sin leerla. «Casi todo lo bueno de mi vida es un acuerdo aburrido dicho en voz alta».`, `«Levou três anos de briga pra chegar lá». Ela vira a página sem ler. «Quase tudo de bom na minha vida é um acordo chato dito em voz alta».`),
    held: t(`Nell closes the book on her finger and smiles at the ceiling. "Come back to me later if you want. Or don't. I'm good either way." She means it. It is the best part.`, `Nell cierra el libro con el dedo y le sonríe al techo. «Vuelve más tarde si quieres. O no. Estoy bien de las dos formas». Lo dice en serio. Esa es la mejor parte.`, `A Nell fecha o livro no dedo e sorri pro teto. «Volta mais tarde se quiser. Ou não. Tô bem de qualquer jeito». Ela fala sério. É a melhor parte.`),
    yes: t(`"Yes," Nell says, and closes the book on her finger. "Say it again when you're closer. I like hearing it."`, `«Sí», dice Nell, y cierra el libro con el dedo. «Dilo otra vez cuando estés más cerca. Me gusta oírlo».`, `«Sim», diz a Nell, e fecha o livro no dedo. «Fala de novo quando tiver mais perto. Gosto de ouvir».`),
    win: t(`Nell puts the book on the pillow, spine up, and holds a hand out. The rest is quiet, and slow, and entirely agreed. Afterwards she says, to the ceiling, "I wasn't narrating." You hear how much that cost to say and how much it was worth.`, `Nell deja el libro sobre la almohada, con el lomo hacia arriba, y extiende una mano. El resto es tranquilo, y lento, y totalmente acordado. Después dice, al techo: «No estaba narrando». Oyes cuánto costó decirlo y cuánto valía.`, `A Nell põe o livro no travesseiro, lombada pra cima, e estende uma mão. O resto é calmo, e lento, e totalmente combinado. Depois ela diz, pro teto: «Eu não tava narrando». Você ouve quanto custou dizer isso e quanto valeu.`)
  });
  enc('river', 'RIVER', {
    vp: 0.97,
    high: function (s) { const at = (s.flagAt || {}).river_water; return !(at !== undefined && s.time >= at + 60); },
    highText: t(`River is swaying a little, eyes soft and far, pupils wide. They look at you and smile at someone standing behind you. Whatever they are saying yes to, it is not you.`, `River se mece un poco, ojos suaves y lejanos, pupilas anchas. Te mira y le sonríe a alguien que está detrás de ti. A lo que sea que estén diciendo sí, no es a ti.`, `O River balança um pouco, olhos suaves e longe, pupilas largas. Olha pra você e sorri pra alguém atrás de você. Seja a que for que estejam dizendo sim, não é a você.`),
    intro: t(`River is sitting on the floor with a glass of water and a clear head. "Rough hour," they say. "I'm good now. Hello."`, `River está sentado en el piso con un vaso de agua y la cabeza clara. «Una hora difícil», dicen. «Ahora estoy bien. Hola».`, `O River tá sentado no chão com um copo de água e a cabeça limpa. «Uma hora difícil», diz. «Agora tô bem. Oi».`),
    talk: t(`"I get like that when it's good," River says. "Too much, too fast, and then I'm sure everyone saw and I have to leave." They look into the glass. "Every room I'm in, I'm either invisible or a lot. I never know which until it's too late."`, `«Me pasa cuando está bueno», dice River. «Demasiado, demasiado rápido, y luego estoy seguro de que todos lo vieron y tengo que irme». Miran dentro del vaso. «En cada habitación estoy o invisible o soy demasiado. Nunca sé cuál hasta que es tarde».`, `«Acontece quando tá bom», diz o River. «Demais, rápido demais, e aí tenho certeza que todo mundo viu e preciso ir embora». Olham pro copo. «Em cada sala eu sou ou invisível ou demais. Nunca sei qual até ser tarde».`),
    q1: t(`"You're neither right now. You're just here."`, `«Ahora no eres ninguna de las dos. Estás aquí».`, `«Agora você não é nenhum dos dois. Você tá aqui».`),
    q2: t(`"I've left rooms for the same reason."`, `«Yo también me he ido de habitaciones por lo mismo».`, `«Eu também já saí de salas pelo mesmo motivo».`),
    r1: t(`River lets out a surprised breath. "Just here." They try the phrase again, quieter. "I'm going to remember that when it starts."`, `River suelta un aire sorprendido. «Solo aquí». Prueban la frase otra vez, más bajito. «Voy a acordarme de eso cuando empiece».`, `O River solta um ar surpreso. «Só aqui». Tentam a frase de novo, mais baixo. «Vou lembrar disso quando começar».`),
    r2: t(`"Did it help? Leaving?" River asks, and when you shrug, they grin. "Right. It never does. Okay. We both stay, then."`, `«¿Ayudó? ¿Irte?», pregunta River, y cuando te encoges de hombros, sonríen. «Claro. Nunca ayuda. Bueno. Entonces nos quedamos los dos».`, `«Ajudou? Sair?», pergunta o River, e quando você dá de ombros, sorriem. «Pois é. Nunca ajuda. Tá. Então a gente fica os dois».`),
    held: t(`River leans their shoulder against yours and stays there. Nothing else is needed. For a long minute neither of you is a lot, and neither is invisible.`, `River apoya su hombro contra el tuyo y se queda ahí. No hace falta nada más. Por un minuto largo ninguno de los dos es demasiado, y ninguno es invisible.`, `O River encosta o ombro no seu e fica ali. Não precisa de mais nada. Por um minuto longo nenhum dos dois é demais, e nenhum é invisível.`),
    yes: t(`"Yes," River says, clearly, with a small laugh. "I'd have said no an hour ago. You asked about the water, and then you asked me."`, `«Sí», dice River, con claridad y una risita. «Hace una hora habría dicho que no. Preguntaste por el agua, y después me preguntaste a mí».`, `«Sim», diz o River, com clareza e uma risadinha. «Uma hora atrás eu teria dito não. Você perguntou da água, e depois me perguntou».`),
    win: t(`River takes your hand and doesn't let go. It's gentle, a little funny, and theirs to set the pace of. You follow it. At the end they say, "I wasn't too much," checking, and you say no, you weren't, and mean it.`, `River te toma la mano y no la suelta. Es suave, un poco gracioso, y el ritmo lo marcan ellos. Lo sigues. Al final dicen: «No fui demasiado», comprobándolo, y dices que no, que no lo fuiste, y lo dices en serio.`, `O River pega sua mão e não solta. É suave, um pouco engraçado, e o ritmo é deles. Você segue. No fim dizem: «Eu não fui demais», conferindo, e você diz que não, não foi, e fala sério.`)
  });
  enc('cosmo', 'COSMO', {
    vp: 0.7,
    intro: t(`Cosmo is propped against the headboard in the morning light, quiet, arms folded, watching the ceiling. He keeps a friendly distance, and the distance is on purpose.`, `Cosmo está apoyado contra el respaldo en la luz de la mañana, callado, los brazos cruzados, mirando el techo. Mantiene una distancia amable, y la distancia es a propósito.`, `O Cosmo tá encostado na cabeceira na luz da manhã, quieto, braços cruzados, olhando o teto. Mantém uma distância amigável, e a distância é de propósito.`),
    talk: t(`"I come to rooms like this to watch," Cosmo says. "Not in a creepy way. I used to be with someone for whom no was a negotiation. Here I watch people say no and be fine, and be thanked for it. It's the best thing I know." He glances at you. "I'm still deciding whether I'm allowed to want something here."`, `«Vengo a habitaciones así a mirar», dice Cosmo. «No de forma rara. Estuve con alguien para quien el no era una negociación. Aquí miro a la gente decir que no y estar bien, y que se lo agradezcan. Es lo mejor que conozco». Te echa un vistazo. «Todavía estoy decidiendo si tengo permiso para querer algo aquí».`, `«Eu venho em salas assim pra olhar», diz o Cosmo. «Não de um jeito estranho. Eu já fui com alguém pra quem não era negociável. Aqui eu vejo pessoas dizerem não e ficarem bem, e serem agradecidas por isso. É a melhor coisa que eu conheço». Ele te olha de lado. «Ainda tô decidindo se eu tenho permissão pra querer alguma coisa aqui».`),
    q1: t(`"You're allowed. And you can say no to me too."`, `«Tienes permiso. Y a mí también me puedes decir que no».`, `«Você tem permissão. E pode me dizer não também».`),
    q2: t(`"I'm sorry that happened. Thank you for telling me."`, `«Siento que te haya pasado. Gracias por contármelo».`, `«Sinto muito que isso tenha acontecido. Obrigado por me contar».`),
    r1: t(`"Okay." He unfolds his arms, one at a time. "Then I'll say it plainly: I'd like to be close to someone, slowly, and I'd like to be the one who says when to stop."`, `«Bueno». Desdobla los brazos, uno a uno. «Entonces lo digo claro: quisiera estar cerca de alguien, despacio, y quisiera ser quien dice cuándo parar».`, `«Tá». Ele desdobra os braços, um de cada vez. «Então eu digo claro: queria ficar perto de alguém, devagar, e queria ser quem diz quando parar».`),
    r2: t(`He looks at you for a while. "Most people rush to fix it. You didn't." He lets out a long breath. "That's the first time I've said it aloud in this room."`, `Te mira un rato. «La mayoría se apura en arreglarlo. Tú no». Suelta un largo suspiro. «Es la primera vez que lo digo en voz alta en esta habitación».`, `Ele te olha por um tempo. «A maioria corre pra consertar. Você não». Solta um longo suspiro. «É a primeira vez que eu digo isso em voz alta nesse quarto».`),
    held: t(`Cosmo nods, and the nod is a thank-you. He settles back against the headboard, arms open at last. "That was enough," he says. "More than enough. Come and sit by me till the kettle goes."`, `Cosmo asiente, y el asentimiento es un gracias. Se acomoda contra el respaldo, por fin con los brazos abiertos. «Eso fue suficiente», dice. «Más que suficiente. Ven a sentarte a mi lado hasta que hierva la tetera».`, `O Cosmo assente, e o aceno é um obrigado. Ele se ajeita na cabeceira, enfim de braços abertos. «Foi suficiente», diz. «Mais que suficiente. Vem sentar do meu lado até a chaleira apitar».`),
    yes: t(`"Yes." Cosmo says it carefully, trying the word. "Slowly. And I'll say if I want to stop."`, `«Sí». Cosmo lo dice con cuidado, probando la palabra. «Despacio. Y si quiero parar, lo digo».`, `«Sim». O Cosmo diz com cuidado, experimentando a palavra. «Devagar. E se eu quiser parar, eu falo».`),
    win: t(`Cosmo goes slowly, and says so twice. He stops once, to breathe, and you stop with him. Nobody hurries and nobody apologises. At the end he lets out a long breath and says, "That was mine. I chose all of it. Thank you for the pace."`, `Cosmo va despacio, y lo dice dos veces. Para una vez, para respirar, y paras con él. Nadie se apura y nadie pide perdón. Al final suelta un largo suspiro y dice: «Fue mío. Elegí todo. Gracias por el ritmo».`, `O Cosmo vai devagar, e diz isso duas vezes. Para uma vez, pra respirar, e você para junto. Ninguém se apressa e ninguém pede desculpa. No fim ele solta um longo suspiro e diz: «Foi meu. Escolhi tudo. Obrigado pelo ritmo».`)
  });

  /* aftercare: someone sits by the door with water and a blanket, and the room's after-conversation happens here */
  D.af_mo = {
    who: 'mo', role: t('AFTERCARE', 'CUIDADO POSTERIOR', 'CUIDADO DEPOIS'), start: 'a', nodes: {
      a: {
        text: t(`Mo sits by the door with a jug of water, a folded blanket and a book they aren't reading. "I do this shift. Anybody who comes out of that room gets water and ten minutes of nobody asking anything. That includes people who only looked."`, `Mo está sentado junto a la puerta con una jarra de agua, una manta doblada y un libro que no lee. «Yo hago este turno. Quien sale de esa habitación recibe agua y diez minutos sin que nadie le pregunte nada. Incluso quien solo miró».`, `A Mo tá sentada junto à porta com uma jarra de água, um cobertor dobrado e um livro que não lê. «Eu faço esse turno. Quem sai daquele quarto ganha água e dez minutos sem ninguém perguntar nada. Inclusive quem só olhou».`),
        choices: [
          K('care', t(`Take the water. Sit a few minutes under the blanket.`, `Tomar el agua. Sentarte unos minutos bajo la manta.`, `Pegar a água. Sentar uns minutos debaixo do cobertor.`), { req: function (s) { return !s.flags.mo_sat; }, do: { hp: 6, soc: 4, fun: 1, time: 10, flag: 'mo_sat', quest: { q_af8: 'done' } }, next: 'sat' }),
          K('ask', t(`"Why do you do this shift?"`, `«¿Por qué haces este turno?»`, `«Por que você faz esse turno?»`), { do: { soc: 2, time: 6 }, next: 'why' }),
          K('care', t(`Thank Mo for taking the shift.`, `Agradecerle a Mo por tomar el turno.`, `Agradecer à Mo por assumir o turno.`), { do: { care: 1, soc: 2 }, next: null }),
          K('chill', t(`Go back out.`, `Volver a salir.`, `Voltar pra fora.`), { free: true, next: null })
        ]
      },
      why: { text: t(`"Because at my first one of these nobody did it, and I sat in a stairwell for an hour deciding whether what I'd done was okay." Mo turns a page. "It was. But nobody told me. Now somebody tells everyone."`, `«Porque en la primera de estas fiestas nadie lo hizo, y me senté en una escalera una hora decidiendo si lo que había hecho estaba bien». Mo pasa una página. «Lo estaba. Pero nadie me lo dijo. Ahora alguien se lo dice a todos».`, `«Porque na minha primeira festa dessas ninguém fez, e eu fiquei numa escada uma hora decidindo se o que eu tinha feito tava certo». A Mo vira uma página. «Tava. Mas ninguém me falou. Agora alguém fala pra todo mundo».`), next: 'a' },
      sat: { text: t(`The blanket weighs exactly enough. The water is cold. Mo turns a page without reading it. Ten minutes later you stand up, and your legs agree with you again.`, `La manta pesa justo lo suficiente. El agua está fría. Mo pasa una página sin leerla. Diez minutos después te levantas, y tus piernas vuelven a estar de acuerdo contigo.`, `O cobertor pesa exatamente o bastante. A água tá gelada. A Mo vira uma página sem ler. Dez minutos depois você levanta, e suas pernas voltam a concordar com você.`), next: null }
    }
  };

  /* ============================================================ friends, privacy and the sign: barks on entering, the quest closes by itself */
  const BARK = {
    maru: t(`Maru reads the sign twice, nods at it, and takes the chair by the jug with a book she found. Her night in here is hers.`, `Maru lee el cartel dos veces, le asiente, y toma la silla junto a la jarra con un libro que encontró. Su rato aquí es suyo.`, `A Maru lê a plaquinha duas vezes, assente pra ela, e pega a cadeira junto à jarra com um livro que achou. A noite dela aqui é dela.`),
    dani: t(`Benjamin announces "I love consent!" to the whole room, then whispers "sorry" and sits on the floor. Everyone laughs, kindly.`, `Benjamin anuncia «¡Amo el consentimiento!» a toda la habitación, después susurra «perdón» y se sienta en el piso. Todos se ríen, con cariño.`, `O Benjamin anuncia «Eu amo consentimento!» pro quarto inteiro, depois sussurra «desculpa» e senta no chão. Todo mundo ri, com carinho.`),
    tato: t(`Fernando waves at Cosmo, raises an eyebrow at the bed, and takes one slow lap of the room. What he does next is his business.`, `Feña saluda a Cosmo, levanta una ceja ante la cama y da una lenta vuelta por la habitación. Lo que haga después es asunto suyo.`, `O Fernando acena pro Cosmo, levanta uma sobrancelha pra cama e dá uma volta lenta no quarto. O que ele fizer depois é problema dele.`)
  };
  const enter0 = story.enter;
  story.enter = function (zone) {
    enter0(zone);
    const s = EM.state; if (!s || !s.after) return;
    if (zone === 'a_master') {
      FR.forEach(function (f) { if (L.hasFriend(f) && !s.flags['mb_bark_' + f]) { s.flags['mb_bark_' + f] = true; U.toast({ icon: 'eyes', kind: 'info', ms: 6000, text: BARK[f] }); } });
      if (!s.flags.mb_arrive) { s.flags.mb_arrive = true; U.toast({ icon: 'eyes', kind: 'info', ms: 6500, text: t(`Daylight on a bed. A bowl by the door. A small sign: EVERYONE USES PROTECTION. Phones stay in the basket. Nobody films. You can look and leave.`, `Luz de día sobre una cama. Un bol junto a la puerta. Un cartelito: EVERYONE USES PROTECTION. Los celulares se quedan en la canasta. Nadie filma. Puedes mirar e irte.`, `Luz do dia numa cama. Uma tigela na porta. Uma plaquinha: EVERYONE USES PROTECTION. Os celulares ficam na cesta. Ninguém filma. Dá pra olhar e sair.`) }); }
    }
    if (zone === 'a_living' && s.flags.mb_visit && s.quests.q_af8 === 'active') L.setQuest('q_af8', 'done');
  };

  /* ============================================================ the phone: text a friend who went home */
  const REPLY = {
    maru: { alone: t(`home. shoes off. the cat is judging me. thank you for asking. i'm sleeping until tuesday.`, `en casa. zapatos afuera. el gato me juzga. gracias por preguntar. voy a dormir hasta el martes.`, `em casa. sapato fora. o gato tá me julgando. obrigada por perguntar. vou dormir até terça.`), buddy: t(`home. someone made me drink water and ate half my toast. i'm in bed. i think i'm going to say yes to the thing. don't tell the others yet.`, `en casa. alguien me hizo tomar agua y se comió la mitad de mi tostada. estoy en la cama. creo que voy a decir que sí a lo otro. no les digas todavía.`, `em casa. alguém me fez beber água e comeu metade da minha torrada. tô na cama. acho que vou dizer sim pra outra coisa. não conta pros outros ainda.`) },
    dani: { alone: t(`home. i walked past a dog and said good morning to it. lying on the floor now. thanks for last night. thanks for asking me the thing.`, `en casa. pasé junto a un perro y le dije buenos días. ahora estoy acostado en el piso. gracias por anoche. gracias por preguntarme lo otro.`, `em casa. passei por um cachorro e dei bom dia. deitado no chão agora. valeu pela noite. valeu por me perguntar aquilo.`), buddy: t(`home. we got here and i said thank you to the doorframe. someone is making tea. i'm going to tell maru about the contract tomorrow. with food.`, `en casa. llegamos y le di las gracias al marco de la puerta. alguien hace té. mañana le cuento a maru lo del contrato. con comida.`, `em casa. a gente chegou e eu agradeci o batente da porta. alguém tá fazendo chá. amanhã eu conto pra maru do contrato. com comida.`) },
    tato: { alone: t(`home. i think. there's a plant here i don't recognise. oh. it's mine. fine. i meant what i said on the sofa.`, `en casa. creo. hay una planta que no reconozco. ah. es mía. bien. lo que dije en el sofá lo dije en serio.`, `em casa. acho. tem uma planta aqui que eu não reconheço. ah. é minha. beleza. o que eu disse no sofá eu falei sério.`), buddy: t(`home. someone walked me up the stairs. i slept in my coat and one shoe. i feel great and i've never been so tired. thank you for not making me decide.`, `en casa. alguien me subió las escaleras. dormí con el abrigo y un zapato. me siento genial y nunca estuve tan cansado. gracias por no hacerme decidir.`, `em casa. alguém me levou escada acima. dormi de casaco e um sapato. tô ótimo e nunca tive tanto sono. obrigado por não me fazer decidir.`) }
  };
  const replyChoices = function (f) {
    return [
      K('care', t(`Send a heart and "sleep well".`, `Mandar un corazón y «que descanses».`, `Mandar um coração e «bom descanso».`), { free: true, do: { care: 1, bond: (function (o) { o[f] = 1; return o; })({}), soc: 2, time: 2, flag: 'af_texted_' + f, call: 'af_t_' + f }, next: null }),
      K('chill', t(`Just read it.`, `Solo leerlo.`, `Só ler.`), { free: true, do: { flag: 'af_texted_' + f, call: 'af_t_' + f }, next: null })
    ];
  };
  FR.forEach(function (f) {
    D['af_text_' + f] = {
      who: f, role: t('YOUR PHONE', 'TU CELULAR', 'SEU CELULAR'), start: 'st', nodes: {
        st: { branch: [{ req: function (s) { return !!(s.after && s.after.f[f] && s.after.f[f].mode === 'buddy'); }, to: 'b' }, { req: function () { return true; }, to: 'a' }] },
        a: { text: [t(`You type: "home? text me when you're in." Three dots appear and vanish. Then:`, `Escribes: «¿en casa? avísame cuando llegues». Aparecen tres puntitos y se van. Luego:`, `Você digita: «em casa? me avisa quando chegar». Aparecem três pontinhos e somem. Depois:`), REPLY[f].alone], choices: replyChoices(f) },
        b: { text: [t(`You type: "all good?" The answer comes fast:`, `Escribes: «¿todo bien?». La respuesta llega rápido:`, `Você digita: «tudo bem?». A resposta chega rápido:`), REPLY[f].buddy], choices: replyChoices(f) }
      }
    };
    S['af_t_' + f] = function () { const s = EM.state; if (s.after) s.after.texted[f] = true; };
  });
  EM.menuItems = EM.menuItems || [];
  EM.menuItems.push(function (box, s) {
    if (!s.after) return;
    FR.forEach(function (f) {
      const x = s.after.f[f]; if (!x || x.st !== 'home' || s.after.texted[f]) return;
      const row = U.el('div', 'stashrow');
      row.appendChild(U.el('span', 'stl', EM.tr(t('PHONE: ', 'CELULAR: ', 'CELULAR: ')) + nm(f) + ' ' + EM.tr(t('went home. Check on them.', 'se fue a casa. Pregúntale cómo llegó.', 'foi pra casa. Veja se chegou bem.'))));
      const b = U.el('button', '', EM.tr(t('TEXT', 'ESCRIBIR', 'MANDAR MENSAGEM'))); b.type = 'button';
      b.addEventListener('click', function () { U.closeMenu(); U.startDialogue('af_text_' + f, { npc: f }); });
      row.appendChild(b); box.appendChild(row);
    });
  });

  /* ============================================================ the morning: if you went home, friends who hit the after text you */
  const PLAN = function (s) { return s.afterPlan; };
  const HIT = {
    maru: t(`we went to anselm and dot's. toast, a sofa, a conversation i needed. someone put a blanket on me. you'd have liked it. sleep well.`, `fuimos a lo de Anselm y Dot. tostadas, un sofá, una conversación que necesitaba. alguien me tapó con una manta. te habría gustado. que descanses.`, `a gente foi na casa do Anselm e da Dot. torrada, um sofá, uma conversa que eu precisava. alguém me cobriu com um cobertor. você ia gostar. bom descanso.`),
    dani: t(`WE WENT TO THE AFTER. there was a record about a bird. i cried a bit. someone asked how i was and i told the truth. 10/10. (also toast.)`, `FUIMOS AL AFTER. había un disco sobre un pájaro. lloré un poco. alguien me preguntó cómo estaba y dije la verdad. 10/10. (también tostadas.)`, `A GENTE FOI NO AFTER. tinha um disco sobre um pássaro. chorei um pouco. alguém perguntou como eu tava e eu falei a verdade. 10/10. (e torrada.)`),
    tato: t(`i ended up at a flat with socks and a sofa. there was a quiet room with rules. i'm not saying more. everyone was kind. you'd have been fine.`, `terminé en un departamento con calcetines y un sofá. había una habitación tranquila con reglas. no digo más. todos fueron amables. habrías estado bien.`, `acabei num apê com meias e um sofá. tinha um quarto calmo com regras. não falo mais. todo mundo foi gentil. você ia ficar bem.`)
  };
  (story.morningRefs = story.morningRefs || []);
  FR.forEach(function (f) {
    story.morningRefs.push({ id: 'af_hit_' + f, who: f, top: true, ok: function (s) { const p = PLAN(s); return !!(s.flags.after_home && p && p.f[f] && p.f[f].hit && s.party.indexOf(f) === -1); }, t: HIT[f] });
  });
  story.morningRefs.push({ id: 'af_host_home', who: 'dot', ok: function (s) { return !!s.flags.after_home; }, t: t(`we asked you to come and you were tired and said so. that's the best answer. there's toast whenever.`, `te invitamos y estabas cansado y lo dijiste. es la mejor respuesta. hay tostadas cuando quieras.`, `a gente convidou e você tava cansado e disse. é a melhor resposta. tem torrada quando quiser.`) });

  /* the noon thread and Tuesday, for the new ending: the night's choices come back as texts, including people you listened to */
  const mm = function (h, m) { return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2); };
  const OUT = {
    maru: { walked: t(`Tuesday: i slept 14 hours and cried at a yoghurt advert. i told my mother about montevideo. she said "finally." thank you for the walk, it's where i said it out loud first.`, `Martes: dormí 14 horas y lloré con una publicidad de yogur. le conté a mi madre lo de Montevideo. dijo «por fin». gracias por el camino, ahí lo dije en voz alta por primera vez.`, `Terça: dormi 14 horas e chorei num comercial de iogurte. contei pra minha mãe de Montevidéu. ela disse «finalmente». obrigada pela caminhada, foi onde eu falei em voz alta pela primeira vez.`), taxi: t(`Tuesday: the taxi driver had a lullaby on the radio and i napped through a whole red light. i'm okay. i'll decide about montevideo this week. thank you for waiting with me.`, `Martes: el taxista tenía una canción de cuna en la radio y me dormí en un semáforo entero. estoy bien. esta semana decido lo de Montevideo. gracias por esperar conmigo.`, `Terça: o motorista tinha uma canção de ninar no rádio e eu cochilei um sinal inteiro. tô bem. essa semana eu decido sobre Montevidéu. obrigada por esperar comigo.`), alone: t(`Tuesday: i got home, texted you, slept two days in a row. i'm a bit quiet. i think i needed it. i'll tell you about montevideo when i can.`, `Martes: llegué a casa, te escribí, dormí dos días seguidos. estoy un poco callada. creo que lo necesitaba. te cuento lo de Montevideo cuando pueda.`, `Terça: cheguei em casa, te mandei mensagem, dormi dois dias seguidos. tô um pouco quieta. acho que eu precisava. te conto de Montevidéu quando eu conseguir.`), stayed: t(`Tuesday: i'm good. long week. thank you for the weekend.`, `Martes: estoy bien. semana larga. gracias por el fin de semana.`, `Terça: tô bem. semana longa. obrigada pelo fim de semana.`) },
    dani: { chase: t(`Tuesday: i'm paying for the park. everything is heavy and i said "the next thing" out loud in a meeting. i'm okay. next time i'm taking the toast.`, `Martes: estoy pagando el parque. todo pesa y dije «lo siguiente» en voz alta en una reunión. estoy bien. la próxima me quedo con las tostadas.`, `Terça: tô pagando o parque. tudo pesa e eu disse «a próxima coisa» em voz alta numa reunião. tô bem. da próxima eu fico com a torrada.`), toast: t(`Tuesday: toast. it was toast. it was the next thing. i'm rested. i love toast and i love you.`, `Martes: tostadas. eran tostadas. era lo siguiente. estoy descansado. quiero a las tostadas y te quiero a ti.`, `Terça: torrada. era torrada. era a próxima coisa. tô descansado. amo torrada e amo você.`), admit: t(`Tuesday: you said it out loud and i've been saying it since. "i'm tired." it works. i also told maru about the contract. she was kind. it was the worst part. thanks for the permission.`, `Martes: lo dijiste en voz alta y desde entonces lo digo yo. «estoy cansado». funciona. también le conté a maru lo del contrato. fue amable. fue lo peor. gracias por el permiso.`, `Terça: você disse em voz alta e desde então eu digo. «tô cansado». funciona. também contei pra maru do contrato. ela foi gentil. foi a pior parte. obrigado pela permissão.`), plain: t(`Tuesday: fine. slept. ate a banana. a good morning. thank you.`, `Martes: bien. dormí. comí un plátano. una buena mañana. gracias.`, `Terça: bem. dormi. comi uma banana. uma boa manhã. obrigado.`) },
    tato: { stays: t(`Tuesday: woke up under a blanket on a stranger's sofa and nobody minded. best sleep of the year. i'm sending them a plant. thirty-four and i finally own my own body. wild.`, `Martes: desperté bajo una manta en el sofá de unos desconocidos y a nadie le molestó. el mejor sueño del año. les voy a mandar una planta. treinta y cuatro años y por fin tengo mi cuerpo. una locura.`, `Terça: acordei debaixo de um cobertor no sofá de uns desconhecidos e ninguém ligou. melhor sono do ano. vou mandar uma planta. trinta e quatro anos e finalmente tenho meu corpo. uma loucura.`), walked: t(`Tuesday: thank you for taking me home. i woke up in my own bed with one shoe on and a note in my own handwriting: "good job". i'm lighter.`, `Martes: gracias por llevarme a casa. desperté en mi cama con un zapato y una nota con mi letra: «buen trabajo». estoy más liviano.`, `Terça: obrigado por me levar pra casa. acordei na minha cama com um sapato e um bilhete na minha letra: «bom trabalho». tô mais leve.`), plain: t(`Tuesday: good. quiet. a bit tender. thank you for the sofa and for asking if i wanted to go.`, `Martes: bien. tranquilo. un poco sensible. gracias por el sofá y por preguntar si quería irme.`, `Terça: bem. quieto. um pouco sensível. obrigado pelo sofá e por perguntar se eu queria ir.`) }
  };
  const BASE = {
    dot_ok: t(`thank you for leaving it better than you found it. the alvarados sent down a note: "next time, a lullaby." we will.`, `gracias por dejarlo mejor de como lo encontraste. los Alvarado mandaron una nota: «la próxima, una canción de cuna». lo haremos.`, `obrigada por deixar melhor do que achou. os Alvarado mandaram um bilhete: «da próxima, uma canção de ninar». a gente vai.`),
    dot_warn: t(`the landlord has put the folder in a drawer. we're putting the records in another one. thank you for being part of why we got to stay.`, `el dueño guardó la carpeta en un cajón. nosotros guardamos los discos en otro. gracias por ser parte de por qué pudimos quedarnos.`, `o dono guardou a pasta numa gaveta. a gente guardou os discos em outra. obrigada por fazer parte do motivo da gente poder ficar.`),
    dot_yours: t(`you took the warning in your name so that we could stay, and i haven't found how to thank you properly. there's a key on the hook with your name on it. come whenever you like. we'll just be quiet.`, `tomaste la advertencia a tu nombre para que pudiéramos quedarnos, y no encuentro cómo agradecértelo bien. hay una llave en el gancho con tu nombre. ven cuando quieras. solo seremos silenciosos.`, `você assumiu o aviso no seu nome pra gente poder ficar, e eu não acho como agradecer direito. tem uma chave no gancho com o seu nome. venha quando quiser. a gente só vai ser silencioso.`),
    dot_evict: t(`we got the second warning, and that was fair. we'll play at the club next week instead. thank you for helping carry the records down.`, `recibimos la segunda advertencia, y fue justa. la semana que viene tocamos en el club. gracias por ayudar a bajar los discos.`, `a gente recebeu o segundo aviso, e foi justo. semana que vem a gente toca no club. obrigada por ajudar a levar os discos.`),
    dot_out: t(`we need some space. i hope you're okay. it was our home, and that's all i'll say.`, `necesitamos espacio. espero que estés bien. era nuestra casa, y eso es todo lo que digo.`, `a gente precisa de espaço. espero que você esteja bem. era a nossa casa, e é só isso que eu digo.`),
    anselm: t(`i put the records away in the order i like. i didn't cry. okay, once. thank you for asking before you touched them.`, `guardé los discos en el orden que me gusta. no lloré. bueno, una vez. gracias por preguntar antes de tocarlos.`, `guardei os discos na ordem que eu gosto. não chorei. tá, uma vez. obrigado por perguntar antes de encostar neles.`),
    lio_ok: t(`this is lio. someone sat with me. i don't know your name. thank you. i'm okay and i drank the water.`, `soy lio. alguien se sentó conmigo. no sé cómo te llamas. gracias. estoy bien y me tomé el agua.`, `aqui é o lio. alguém ficou comigo. não sei seu nome. obrigado. tô bem e bebi a água.`),
    lio_called: t(`this is lio. i'm out of the hospital. they said calling was right. thank you for yelling for dot.`, `soy lio. ya salí del hospital. dijeron que llamar fue lo correcto. gracias por gritarle a dot.`, `aqui é o lio. já saí do hospital. disseram que ligar foi o certo. obrigado por gritar pela dot.`)
  };
  /* Tuesday texts from guests you opened up with: one line each, in their own register */
  const GUEST = [
    ['hugo', 'g_hugo_open', t(`i said it to you and i said it to my brother on the phone yesterday. the second one was harder. thanks for the first.`, `te lo dije a ti y se lo dije ayer a mi hermano por teléfono. la segunda fue más difícil. gracias por la primera.`, `eu disse pra você e ontem disse pro meu irmão no telefone. a segunda foi mais difícil. valeu pela primeira.`)],
    ['rosa', 'g_rosa_open', t(`i asked for the raise. i got half. half is more than zero, and zero was the plan. thank you for the kitchen.`, `pedí el aumento. me dieron la mitad. la mitad es más que cero, y cero era el plan. gracias por la cocina.`, `pedi o aumento. ganhei metade. metade é mais que zero, e zero era o plano. obrigada pela cozinha.`)],
    ['luca', 'g_luca_open', t(`slept eleven hours. didn't dream about cables. first time in a month. you were right about the floor.`, `dormí once horas. no soñé con cables. primera vez en un mes. tenías razón con lo del piso.`, `dormi onze horas. não sonhei com cabo. primeira vez em um mês. você tinha razão sobre o chão.`)],
    ['nuri', 'g_isi_open', t(`i took a day off. an actual day. my mum asked who died. nobody. i went to the sea. thank you for asking what i do when i'm not testing things.`, `me tomé un día libre. un día de verdad. mi mamá preguntó quién se murió. nadie. fui al mar. gracias por preguntarme qué hago cuando no analizo cosas.`, `tirei um dia de folga. um dia de verdade. minha mãe perguntou quem morreu. ninguém. fui ao mar. obrigada por perguntar o que eu faço quando não tô testando coisas.`)],
    ['mika', 'g_mika_open', t(`i told my manager i'm done with doors at 4am. she didn't fire me. she moved my shifts. people are sometimes decent when you ask.`, `le dije a mi jefa que se acabaron las puertas a las 4am. no me despidió. me cambió los turnos. a veces la gente es decente si pides.`, `falei pra minha chefe que acabaram as portas às 4h. ela não me demitiu. mudou meus turnos. às vezes as pessoas são decentes quando a gente pede.`)],
    ['dario', 'g_dario_open', t(`i opened a window in my flat. it's been shut since march. thank you for the question about what i keep for myself.`, `abrí una ventana en mi departamento. estaba cerrada desde marzo. gracias por la pregunta sobre lo que guardo para mí.`, `abri uma janela no meu apê. tava fechada desde março. obrigado pela pergunta sobre o que eu guardo pra mim.`)],
    ['marga', 'g_marga_open', t(`i called my daughter. we talked for an hour and neither of us mentioned the thing. that's progress for my family.`, `llamé a mi hija. hablamos una hora y ninguna mencionó lo otro. eso es progreso para mi familia.`, `liguei pra minha filha. falamos uma hora e nenhuma mencionou aquilo. isso é progresso pra minha família.`)],
    ['ezra', 'g_ezra_open', t(`i finally did the thing and booked the flight. i'm scared. it's booked. thanks for the nudge on the balcony.`, `por fin lo hice y reservé el vuelo. tengo miedo. está reservado. gracias por el empujón en el balcón.`, `finalmente fiz e comprei a passagem. tô com medo. tá comprada. valeu pelo empurrão na varanda.`)],
    ['ximena', 'g_ximena_open', t(`slept fine. woke up and i missed the floor. that's how you know.`, `dormí bien. desperté y extrañé la pista. así sabes.`, `dormi bem. acordei e senti falta da pista. é assim que você sabe.`)],
    ['sol', 'g_sol_open', t(`i found the lighter in my other coat. it was never lost. i think i needed a reason to talk to you.`, `encontré el encendedor en mi otro abrigo. nunca se perdió. creo que necesitaba una razón para hablar contigo.`, `achei o isqueiro no meu outro casaco. nunca tinha perdido. acho que eu precisava de um motivo pra falar com você.`)],
    ['kiki', 'g_kiki_open', t(`played in front of people again. my hands shook for the first minute and then they didn't. thank you for asking Anselm.`, `toqué frente a gente otra vez. las manos me temblaron el primer minuto y luego no. gracias por preguntarle a Anselm.`, `toquei na frente de gente de novo. minhas mãos tremeram no primeiro minuto e depois não. obrigada por perguntar pro Anselm.`)],
    ['hazel', 'g_hazel_open', t(`i went to the doctor about the thing. it was nothing. i'd carried it for three months. thank you for staying on the balcony.`, `fui al médico por lo otro. no era nada. lo cargué tres meses. gracias por quedarte en el balcón.`, `fui ao médico por causa daquilo. não era nada. carreguei três meses. obrigada por ficar na varanda.`)],
    ['oz', 'g_oz_open', t(`i deleted the group chat. all of it. it feels like moving house.`, `borré el grupo de chat. todo. se siente como mudarse de casa.`, `apaguei o grupo do chat. tudo. parece mudança de casa.`)],
    ['resident', 'g_aeriel_open', t(`thank you for the conversation at the booth. i played the record you asked about last night. it hit different.`, `gracias por la conversación en la cabina. anoche puse el disco por el que preguntaste. sonó distinto.`, `obrigado pela conversa na cabine. ontem à noite toquei o disco que você perguntou. soou diferente.`)]
  ];
  const baseNoon = function (s) {
    const f = s.flags;
    if (f.after_out) return BASE.dot_out;
    if (f.after_evicted) return BASE.dot_evict;
    if (f.warning_yours) return BASE.dot_yours;
    return f.quiroga_warned ? BASE.dot_warn : BASE.dot_ok;
  };
  const friendOut = function (f, s) {
    const fl = s.flags, x = s.after && s.after.f[f];
    if (f === 'maru') return fl.maru_walked ? OUT.maru.walked : (fl.maru_taxi ? OUT.maru.taxi : (x && x.st === 'home' ? OUT.maru.alone : OUT.maru.stayed));
    if (f === 'dani') return fl.dani_chase ? OUT.dani.chase : (fl.dani_toast ? OUT.dani.toast : (fl.dani_admit ? OUT.dani.admit : OUT.dani.plain));
    return fl.tato_stays || fl.tato_blanket ? OUT.tato.stays : (fl.tato_walked ? OUT.tato.walked : OUT.tato.plain);
  };
  const noonFriend = function (f, s) {
    const x = s.after && s.after.f[f]; if (!x || x.st === 'gone') return null;
    return x.st === 'home' ? REPLY[f][x.mode === 'buddy' ? 'buddy' : 'alone'] : (x.st === 'sofa' ? t(`still on the sofa. under a blanket. do not wake me. (i'm fine.)`, `sigo en el sofá. bajo una manta. no me despierten. (estoy bien.)`, `ainda no sofá. debaixo de um cobertor. não me acorda. (tô bem.)`) : t(`still here. toast count: four. i would stay for a fifth.`, `sigo aquí. tostadas: cuatro. me quedaría por una quinta.`, `ainda aqui. torradas: quatro. eu ficava por uma quinta.`));
  };
  const morning0 = story.morning;
  story.morning = function (s) {
    if (s.ended !== 'after') return morning0(s);
    const msgs = [], f = s.flags, push = function (who, tx, time) { msgs.push({ who: who, name: null, t: tx, time: time }); };
    let min = 12 * 60 + 10;
    const nextT = function () { const h = Math.floor(min / 60), m = min % 60; min += 9 + Math.floor(EM.hash2((s.seed | 0) + msgs.length, 5, 11) * 30); return mm(h, m); };
    push('dot', baseNoon(s), nextT());
    if (!f.after_out) push('anselm', BASE.anselm, nextT());
    FR.forEach(function (fr) { const tx = noonFriend(fr, s); if (tx) push(fr, tx, nextT()); });
    if (f.lio_ok) push('lio', BASE.lio_ok, nextT());
    else if (f.lio_called) push('lio', BASE.lio_called, nextT());
    FR.forEach(function (fr) { if (s.after && s.after.f[fr] && s.after.f[fr].st !== 'gone') push(fr, friendOut(fr, s), 'TUE ' + mm(17 + Math.floor(EM.hash2((s.seed | 0), fr.length, 13) * 4), Math.floor(EM.hash2((s.seed | 0), fr.length, 14) * 59))); });
    let n = 0;
    GUEST.forEach(function (g) {
      if (n >= 4 || !f[g[1]] || !EM.CAST[g[0]]) return;
      n++; push(g[0], g[2], 'TUE ' + mm(8 + n * 2 + Math.floor(EM.hash2((s.seed | 0), g[0].length, 15) * 2), Math.floor(EM.hash2((s.seed | 0), n, 16) * 59)));
    });
    return msgs;
  };
})();

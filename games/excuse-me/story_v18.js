/* EXCUSE ME — story v18: A SWEET CONFESSION, the first side quest written by a friend of the author who asked to be a character.
   Side quests (quest ids starting with sq_) are small stories that characters hand you on top of the main missions: Rosa's
   errands, Biscuit's phone, Kai's battery and so on. They get their own section in MISSIONS and a NEW SIDE QUEST toast.
   Lalo (smoking area) has loved Fran (quiet room) for four years. Fran only talks about whisky honey and honey-cinnamon tea.
   Lupano dances on the main floor and gives a whisky-honey-cinnamon gum to anyone who follows every arrow. The gum is the courage. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const F = EM.F, NF = EM.NF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`"Later."`, `«Después».`, `«Depois».`), { free: true, next: null }); };
  const FRIEND = 'LUPANO'; /* the friend who asked to be in the game (he, light brown skin, long hair) */
  const look = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  EM.CAST.lalo = { name: 'LALO', look: look({ skin: 1, hair: 3, hc: 1, expr: 3, top: 9, tc: 1, bottom: 1, acc: 0 }) };
  EM.CAST.fran = { name: 'FRAN', look: look({ skin: 2, hair: 6, hc: 6, expr: 4, top: 6, tc: 5, bottom: 3, bc: 6, acc: 0 }) };
  EM.CAST.rumi = { name: FRIEND, look: look({ skin: 3, hair: 3, hc: 1, expr: 2, top: 4, tc: 3, bottom: 2, acc: 6, ac: 2 }) };

  const open = function (s) { return s.quests.sq_honey === 'active'; };
  const mk = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };

  /* ============================================================ the side quest in the mission log */
  EM.QUESTS.sq_honey = {
    title: t(`A SWEET CONFESSION`, `UNA CONFESIÓN DULCE`, `UMA CONFISSÃO DOCE`),
    desc: function (s) {
      return t(`Lalo, in the smoking area, has loved somebody in the quiet room for four years and never said a word. ${mk(s, 'fran_met')} Meet Fran in the quiet room. ${mk(s, 'have_honeygum')} ${FRIEND} is dancing on the main floor: dance with ${FRIEND} and hit every arrow. ${mk(s, 'honey_given')} Give Lalo the gum and cheer them on.`, `Lalo, en la zona de fumar, quiere hace cuatro años a alguien de la sala tranquila y nunca dijo una palabra. ${mk(s, 'fran_met')} Conoce a Fran en la sala tranquila. ${mk(s, 'have_honeygum')} ${FRIEND} baila en la pista principal: baila con ${FRIEND} y pulsa todas las flechas. ${mk(s, 'honey_given')} Dale el chicle a Lalo y dale ánimos.`, `O Lalo, na área de fumantes, ama alguém da sala de calma há quatro anos e nunca disse uma palavra. ${mk(s, 'fran_met')} Conheça a Fran na sala de calma. ${mk(s, 'have_honeygum')} ${FRIEND} está dançando na pista principal: dance com ${FRIEND} e acerte todas as setas. ${mk(s, 'honey_given')} Dê o chiclete ao Lalo e dê força pra ele.`);
    },
    doneText: t(`Lalo asked, Fran said yes, and now they are holding hands in the quiet room with a heart between them.`, `Lalo preguntó, Fran dijo que sí, y ahora están tomados de la mano en la sala tranquila con un corazón entre ambos.`, `O Lalo perguntou, a Fran disse sim, e agora eles estão de mãos dadas na sala de calma com um coração entre eles.`)
  };

  /* ============================================================ 1. LALO, in the smoking area */
  D.lalo = {
    who: 'lalo', role: t('IN THE SMOKING AREA', 'EN LA ZONA DE FUMAR', 'NA ÁREA DE FUMANTES'), start: 'st', nodes: {
      st: { branch: [
        { req: function (s) { return !!s.flags.have_honeygum; }, to: 'give' },
        { req: function (s) { return open(s) && !!s.flags.fran_met; }, to: 'back' },
        { req: function (s) { return open(s); }, to: 'wait' },
        { req: function () { return true; }, to: 'a' }
      ] },
      a: {
        text: t(`A person leans on the fence with a cigarette burning down to the filter, staring at nothing in particular, which turns out to be the wall of the quiet room. "Mind the smoke. I mind it too. I just don't know what else to do with my hands." A pause. "I've been in love with somebody for four years. They're in the quiet room right now, resting. I have never said a word."`, `Una persona se apoya en la reja con un cigarro que se consume hasta el filtro, mirando a nada en particular, que resulta ser la pared de la sala tranquila. «Cuidado con el humo. A mí también me molesta. Solo no sé qué más hacer con las manos». Una pausa. «Llevo cuatro años enamorado de alguien. Está ahora mismo en la sala tranquila, descansando. Nunca le dije una palabra».`, `Uma pessoa se apoia na grade com um cigarro queimando até o filtro, olhando pra nada em particular, que acaba sendo a parede da sala de calma. «Cuidado com a fumaça. Me incomoda também. Só não sei o que fazer com as mãos». Uma pausa. «Eu amo alguém há quatro anos. Essa pessoa tá na sala de calma agora, descansando. Nunca disse uma palavra».`),
        choices: [
          K('ask', t(`"Why not tell them?"`, `«¿Por qué no se lo dices?»`, `«Por que você não conta?»`), { next: 'why' }),
          K('care', t(`"I'll help you. Let me go and see them."`, `«Te ayudo. Déjame ir a verle».`, `«Eu te ajudo. Deixa eu ir ver a pessoa».`), { do: { quest: { sq_honey: 'active' }, flag: 'honey_start', soc: 2 }, next: 'accept' }),
          K('chill', t(`"Good luck out here."`, `«Suerte por aquí».`, `«Boa sorte por aqui».`), { free: true, next: null })
        ]
      },
      why: { text: t(`"Because they deserve a good moment, and all I have is a cigarette, a fence and a lot of silence." Lalo laughs without sound. "Maybe it's silly."`, `«Porque merece un buen momento, y yo solo tengo un cigarro, una reja y mucho silencio». Lalo se ríe sin sonido. «Quizás es una tontería».`, `«Porque merece um bom momento, e eu só tenho um cigarro, uma grade e muito silêncio». O Lalo ri sem som. «Talvez seja bobagem».`), next: 'a' },
      accept: { text: t(`"You would? Okay." Lalo takes a breath that goes all the way down. "Go and see them. Don't say I sent you. Just say hi and see what they need. Their name is Fran."`, `«¿Lo harías? Bueno». Lalo toma un aire que llega hasta el fondo. «Ve a verle. No digas que te mandé. Solo saluda y mira qué necesita. Se llama Fran».`, `«Você faria isso? Tá». O Lalo respira fundo, até o fim. «Vai ver a pessoa. Não diga que eu mandei. Só dá um oi e vê do que precisa. O nome é Fran».`), next: null },
      wait: { text: t(`"Did you see them? Fran. In the quiet room. They'll be on a mattress, probably pretending to sleep."`, `«¿Les viste? Fran. En la sala tranquila. Estará en un colchón, probablemente fingiendo dormir».`, `«Você viu a pessoa? Fran. Na sala de calma. Deve estar num colchão, provavelmente fingindo que dorme».`), choices: [LEAVE()] },
      back: {
        text: t(`"And? What did they say?" You tell Lalo: whisky honey, honey-cinnamon tea, and a bar with neither. Lalo covers their mouth. "Whisky honey. And honey-cinnamon tea. They always smell like cinnamon. Where would you even find that in a place like this?" A glance at the dance floor. "There's somebody out there who's the sweetest person in the building. Might be worth asking."`, `«¿Y? ¿Qué dijo?» Le cuentas a Lalo: whisky miel, té de miel y canela, y un bar sin ninguno de los dos. Lalo se tapa la boca. «Whisky miel. Y té de miel y canela. Siempre huele a canela. ¿Dónde se consigue eso en un lugar así?» Una mirada a la pista. «Allá afuera hay alguien que es la persona más dulce del local. Quizás valga la pena preguntar».`, `«E aí? O que disse?» Você conta pro Lalo: whisky com mel, chá de mel e canela, e um bar sem nenhum dos dois. O Lalo cobre a boca. «Whisky com mel. E chá de mel e canela. Sempre cheira a canela. Onde se acha isso num lugar assim?» Um olhar pra pista. «Lá fora tem uma pessoa que é a mais doce do prédio. Talvez valha perguntar».`),
        do: { flag: 'lalo_hint', soc: 1 }, choices: [K('chill', t(`"I'll ask around."`, `«Voy a preguntar».`, `«Vou perguntar por aí».`), { free: true, next: null })]
      },
      give: {
        text: t(`You hold out a stick of gum in a wrapper that smells like a pub, a beehive and a cinnamon stick. Lalo reads it twice. "Whisky honey cinnamon. It's the thing they couldn't find. That's... that's the thing." Their hands shake. "I can't. I can't just go over there."`, `Le extiendes un chicle en un envoltorio que huele a bar, colmena y rama de canela. Lalo lo lee dos veces. «Whisky miel y canela. Es lo que no encontró. Es… es esa cosa». Le tiemblan las manos. «No puedo. No puedo simplemente ir hasta allá».`, `Você estende um chiclete num papel que cheira a bar, colmeia e pau de canela. O Lalo lê duas vezes. «Whisky com mel e canela. É o que a pessoa não achou. É… é isso». As mãos tremem. «Não consigo. Não consigo simplesmente ir lá».`),
        choices: [
          K('care', t(`"You can. Say it, and ask first: 'Can I kiss you?' If they say yes, then yes. If they say no, you still said something true."`, `«Puedes. Dilo, y pregunta primero: “¿Puedo besarte?” Si dicen que sí, entonces sí. Si dicen que no, igual dijiste algo verdadero».`, `«Você consegue. Fala, e pergunta primeiro: "Posso te beijar?" Se disserem sim, então sim. Se disserem não, você ainda disse algo verdadeiro».`), { do: { flag: 'honey_given', unflag: 'have_honeygum', soc: 8, fun: 6, bond: {} }, call: 'honey_go', next: 'courage' }),
          K('chill', t(`"Hold on to it for now."`, `«Guárdalo por ahora».`, `«Guarda por enquanto».`), { free: true, next: null })
        ]
      },
      courage: { text: t(`Lalo puts the gum in their mouth, breathes in cinnamon, honey and something that feels like a decision, and stubs out the cigarette. "Ask first. Say it. Okay." They stand up straight, thank you with their whole face, and walk toward the quiet room with the courage held in both hands.`, `Lalo se pone el chicle en la boca, respira canela, miel y algo que se siente como una decisión, y apaga el cigarro. «Preguntar primero. Decirlo. Bueno». Se pone derecho, te da las gracias con toda la cara y camina hacia la sala tranquila con el coraje sostenido con las dos manos.`, `O Lalo põe o chiclete na boca, respira canela, mel e algo que parece uma decisão, e apaga o cigarro. «Perguntar primeiro. Falar. Tá». Se endireita, te agradece com o rosto todo e caminha pra sala de calma com a coragem segurada nas duas mãos.`), next: null }
    }
  };
  S.honey_go = function () {
    const s = EM.state;
    s.flags.sq_honey_done = true;
    L.setQuest('sq_honey', 'done');
    U.toast({ icon: 'heart', kind: 'good', ms: 6500, text: t(`Lalo has gone to the quiet room. Go and see.`, `Lalo se fue a la sala tranquila. Ve a ver.`, `O Lalo foi pra sala de calma. Vai ver.`) });
  };

  /* ============================================================ 2. FRAN, resting in the quiet room */
  D.fran = {
    who: 'fran', role: t('RESTING', 'DESCANSANDO', 'DESCANSANDO'), start: 'a', nodes: {
      a: {
        text: t(`Someone lies on a mattress under a blanket, an untouched paper cup next to their hand, talking to the ceiling in a soft, dreamy voice. "My favourite drink is whisky honey. Did you know? I looked for it at the bar and they said no. It's a clandestine place, of course there's no whisky honey. So I came here, because somebody said they give tea. My second favourite is honey-and-cinnamon tea. There wasn't any. It's fine. I'm just... thinking about honey."`, `Alguien yace en un colchón bajo una manta, con un vaso de papel sin tocar junto a la mano, hablándole al techo con una voz suave y soñadora. «Mi trago favorito es el whisky miel. ¿Lo sabías? Lo busqué en la barra y me dijeron que no. Es un lugar clandestino, claro que no hay whisky miel. Así que vine aquí, porque escuché que daban té. Mi segunda bebida favorita es el té de miel y canela. Tampoco había. Está bien. Solo estoy… pensando en miel».`, `Alguém está deitada num colchão sob um cobertor, com um copo de papel intocado do lado da mão, falando pro teto numa voz suave e sonhadora. «Minha bebida favorita é whisky com mel. Sabia? Procurei no bar e disseram que não. É um lugar clandestino, claro que não tem whisky com mel. Aí vim pra cá, porque ouvi dizer que davam chá. Minha segunda bebida favorita é chá de mel e canela. Também não tinha. Tá tudo bem. Eu só tô… pensando em mel».`),
        do: { flag: 'fran_met', soc: 2 },
        choices: [
          K('care', t(`"I'll see what I can find."`, `«Voy a ver qué consigo».`, `«Vou ver o que consigo».`), { free: true, next: null, react: t(`A very small smile under the blanket. "Thanks. No hurry. Honey is patient."`, `Una sonrisa muy pequeña bajo la manta. «Gracias. Sin apuro. La miel es paciente».`, `Um sorriso bem pequeno sob o cobertor. «Valeu. Sem pressa. O mel é paciente».`) }),
          K('chill', t(`"Rest well."`, `«Descansa bien».`, `«Descansa bem».`), { free: true, next: null })
        ]
      }
    }
  };

  /* ============================================================ 3. LUPANO, dancing on the main floor */
  EM.PARTNERS.rumi = {
    tempo: 600, moves: ['shuffle', 'wave', 'spiral', 'sway'],
    win: t(`${FRIEND} stops, breathless, hands on his knees, laughing. "That was SO fun! And you're not doing badly at all!"`, `${FRIEND} se detiene sin aire, con las manos en las rodillas, riendo. «¡Eso fue DIVERTIDÍSIMO! ¡Y no lo haces nada mal!»`, `${FRIEND} para sem fôlego, com as mãos nos joelhos, rindo. «Isso foi MUITO divertido! E você não dança nada mal!»`),
    lose: t(`${FRIEND} cheers anyway. "Almost! Again, again, no pressure, it's a dance floor!"`, `${FRIEND} celebra igual. «¡Casi! De nuevo, de nuevo, sin presión, ¡es una pista de baile!»`, `${FRIEND} comemora do mesmo jeito. «Quase! De novo, de novo, sem pressão, é uma pista de dança!»`)
  };
  D.rumi = {
    who: 'rumi', role: t('DANCING', 'BAILANDO', 'DANÇANDO'), start: 'st', nodes: {
      st: { branch: [
        { req: function (s) { return open(s) && !!s.flags.fran_met && !s.flags.have_honeygum && !s.flags.honey_given; }, to: 'sweet' },
        { req: function () { return true; }, to: 'a' }
      ] },
      a: {
        text: t(`Lupano is dancing with his entire body, arms up, eyes shut, a huge smile. He opens one eye and spots you. "You look so excited! Come and dance with me! No pretence: nobody here is watching, and if they are, they're jealous."`, `Lupano baila con el cuerpo entero, los brazos arriba, los ojos cerrados y una sonrisa enorme. Abre un ojo y te ve. «¡Se nota que tienes ganas de bailar! ¡Ven a bailar conmigo! Sin tapujos: nadie mira, y si miran, es de envidia».`, `O Lupano dança com o corpo inteiro, braços pro alto, olhos fechados, um sorrisão. Ele abre um olho e te vê. «Dá pra ver que você tá com vontade de dançar! Vem dançar comigo! Sem frescura: ninguém tá olhando, e se tiver, é de inveja».`),
        choices: [
          K('dance', t(`Dance with ${FRIEND}.`, `Bailar con ${FRIEND}.`, `Dançar com ${FRIEND}.`), { call: 'pd_rumi', free: true, next: null }),
          K('chill', t(`"Maybe later."`, `«Quizás luego».`, `«Talvez depois».`), { free: true, next: null })
        ]
      },
      sweet: {
        text: t(`"You look so excited! Come and dance with me, no pretence. And hey..." ${FRIEND} pats a pocket with a secret smile. "If you can follow every one of my moves, I might have something sweet for a great dancer."`, `«¡Se nota que tienes ganas de bailar! Ven a bailar conmigo, sin tapujos. Y oye…» ${FRIEND} se palmea un bolsillo con una sonrisa secreta. «Si logras seguir todos mis pasos, quizás tenga algo dulce para quien baila genial».`, `«Dá pra ver que você tá com vontade de dançar! Vem dançar comigo, sem frescura. E olha…» ${FRIEND} bate num bolso com um sorriso secreto. «Se você conseguir seguir todos os meus passos, talvez eu tenha algo doce pra quem dança muito bem».`),
        choices: [
          K('dance', t(`Dance with ${FRIEND}.`, `Bailar con ${FRIEND}.`, `Dançar com ${FRIEND}.`), { call: 'pd_rumi', free: true, next: null }),
          K('chill', t(`"Maybe later."`, `«Quizás luego».`, `«Talvez depois».`), { free: true, next: null })
        ]
      }
    }
  };
  D.rumi_gum = {
    who: 'rumi', role: t('DANCING', 'BAILANDO', 'DANÇANDO'), forced: true, start: 'a', nodes: {
      a: {
        text: t(`${FRIEND} digs in a pocket and produces a single wrapper that smells like a pub, a beehive and a cinnamon stick. "A stick of whisky-honey-cinnamon gum. Long story. I think it's for someone who's missing it." A wink. "Give it to whoever needs the courage."`, `${FRIEND} hurga en un bolsillo y saca un único envoltorio que huele a bar, colmena y rama de canela. «Un chicle sabor whisky miel y canela. Larga historia. Creo que es para alguien que lo echa de menos». Un guiño. «Dáselo a quien necesite el coraje».`, `${FRIEND} fuça num bolso e tira um único papel que cheira a bar, colmeia e pau de canela. «Um chiclete sabor whisky com mel e canela. Longa história. Acho que é pra alguém que tá com saudade disso». Uma piscadinha. «Dá pra quem precisar de coragem».`),
        do: { flag: 'have_honeygum', soc: 3, fun: 3 },
        choices: [K('yes', t(`"Thank you, ${FRIEND}!"`, `«¡Gracias, ${FRIEND}!»`, `«{Obrigado|Obrigada|Valeu}, ${FRIEND}!»`), { free: true, next: null })]
      }
    }
  };
  S.pd_rumi = function () {
    U.partnerDance('rumi', function (res) {
      const s = EM.state;
      L.apply(res.grade === 'win' ? { fun: 10, soc: 3 } : (res.grade === 'partial' ? { fun: 5, soc: 1 } : (res.grade === 'fail' ? { fun: 2 } : {})));
      L.spend(5);
      if (res.grade === 'win' && open(s) && s.flags.fran_met && !s.flags.have_honeygum && !s.flags.honey_given && !s.ended) {
        U.startDialogue('rumi_gum', { npc: 'rumi' });
        U.toast({ icon: 'spark', kind: 'good', ms: 6000, text: t(`You got a whisky-honey-cinnamon gum. Take it to Lalo. (ITEMS: I)`, `Conseguiste un chicle de whisky miel y canela. Llévaselo a Lalo. (OBJETOS: I)`, `Você ganhou um chiclete de whisky com mel e canela. Leve pro Lalo. (ITENS: I)`) });
      } else if (!EM.state.ended) U.startDialogue('rumi', { npc: 'rumi' });
    });
  };

  /* the gum is a quest item: it shows in ITEMS, for Lalo */
  EM.menuItems = EM.menuItems || [];
  EM.menuItems.push(function (box, s) {
    if (!s.flags.have_honeygum) return;
    const r = U.el('div', 'stashrow');
    r.appendChild(U.el('span', 'stl', EM.tr(t('WHISKY-HONEY-CINNAMON GUM — for Lalo, in the smoking area', 'CHICLE DE WHISKY MIEL Y CANELA — para Lalo, en la zona de fumar', 'CHICLETE DE WHISKY COM MEL E CANELA — pro Lalo, na área de fumantes'))));
    box.appendChild(r);
  });

  /* ============================================================ 4. THE COUPLE, hand in hand with a heart above them */
  Z.courtyard.npc({ id: 'lalo', x: 29.5, y: 15.5, dlg: 'lalo', dir: 'l', reach: 16, smoker: true, when: NF('sq_honey_done') });
  Z.welfare.npc({ id: 'fran', x: 10.5, y: 9.5, dlg: 'fran', dir: 'r', reach: 16, pose: 'lie', when: NF('sq_honey_done') });
  Z.welfare.npc({ id: 'lalofran', pair: ['lalo', 'fran'], x: 12.5, y: 8.5, dir: 'd', reach: 14, pose: 'hug', heart: true, decor: true, when: F('sq_honey_done') });
  Z.main.npc({ id: 'rumi', x: 3.5, y: 18.5, dlg: 'rumi', dir: 'd', reach: 16, pose: 'dance' });
  const enter0 = story.enter;
  story.enter = function (zone) {
    enter0(zone);
    const s = EM.state;
    if (zone === 'welfare' && s && s.flags.sq_honey_done && !s.flags.honey_seen) {
      s.flags.honey_seen = true;
      L.apply({ fun: 6, soc: 4 });
      U.toast({ icon: 'heart', kind: 'good', ms: 7000, text: t(`In the corner of the quiet room, Lalo and Fran are holding hands, a heart floating between them. A paper cup of tea sits half-drunk between their feet.`, `En la esquina de la sala tranquila, Lalo y Fran van de la mano, con un corazón flotando entre ambos. Un vaso de té a medio tomar descansa entre sus pies.`, `No canto da sala de calma, o Lalo e a Fran estão de mãos dadas, com um coração flutuando entre eles. Um copo de chá pela metade descansa entre os pés.`) });
    }
  };

  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'honey_rumi', who: 'rumi', ok: function (s) { return !!s.flags.sq_honey_done; }, t: t(`i heard a rumour about a gum and two people holding hands in the quiet room. i'm just saying: whisky honey cinnamon is a love language. thanks for dancing with me, you were great.`, `escuché un rumor sobre un chicle y dos personas tomadas de la mano en la sala tranquila. solo digo: whisky miel y canela es un lenguaje del amor. gracias por bailar conmigo, estuviste genial.`, `ouvi um boato sobre um chiclete e duas pessoas de mãos dadas na sala de calma. só tô dizendo: whisky com mel e canela é uma linguagem do amor. valeu por dançar comigo, você mandou bem.`) });
    R.push({ id: 'honey_lalo', who: 'lalo', ok: function (s) { return !!s.flags.sq_honey_done; }, t: t(`fran and i are having honey-cinnamon tea this morning. I asked first. they said yes. i owe you a pack of gum and a whole life.`, `fran y yo estamos tomando té de miel y canela esta mañana. pregunté primero. dijeron que sí. te debo un paquete de chicles y una vida entera.`, `a fran e eu estamos tomando chá de mel e canela hoje de manhã. perguntei primeiro. disseram que sim. te devo um pacote de chiclete e uma vida inteira.`) });
  }
})();

/* EXCUSE ME — club side quests: A Sweet Confession (sq_honey) and Eloy K (sq_eloy). */
'use strict';
/* ---- consolidated from story_v18.js ---- */
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
        text: t(`You hold out a stick of gum in a wrapper that smells like a pub, a beehive and a cinnamon stick. Lalo reads it twice. "Whisky honey cinnamon. It's the thing they couldn't find. That's… that's the thing." Their hands shake. "I can't. I can't just go over there."`, `Le extiendes un chicle en un envoltorio que huele a bar, colmena y rama de canela. Lalo lo lee dos veces. «Whisky miel y canela. Es lo que no encontró. Es… es esa cosa». Le tiemblan las manos. «No puedo. No puedo simplemente ir hasta allá».`, `Você estende um chiclete num papel que cheira a bar, colmeia e pau de canela. O Lalo lê duas vezes. «Whisky com mel e canela. É o que a pessoa não achou. É… é isso». As mãos tremem. «Não consigo. Não consigo simplesmente ir lá».`),
        choices: [
          K('care', t(`"Ask first. If it's a no, you still said it."`, `«Pregunta primero. Si es un no, igual lo dijiste».`, `«Pergunta primeiro. Se for não, você ainda disse».`), { do: { flag: 'honey_given', unflag: 'have_honeygum', soc: 8, fun: 6, bond: {} }, call: 'honey_go', next: 'courage' }),
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
        text: t(`Someone lies on a mattress under a blanket, an untouched paper cup next to their hand, talking to the ceiling in a soft, dreamy voice. "My favourite drink is whisky honey. Did you know? I looked for it at the bar and they said no. It's a clandestine place, of course there's no whisky honey. So I came here, because somebody said they give tea. My second favourite is honey-and-cinnamon tea. There wasn't any. It's fine. I'm just… thinking about honey."`, `Alguien yace en un colchón bajo una manta, con un vaso de papel sin tocar junto a la mano, hablándole al techo con una voz suave y soñadora. «Mi trago favorito es el whisky miel. ¿Lo sabías? Lo busqué en la barra y me dijeron que no. Es un lugar clandestino, claro que no hay whisky miel. Así que vine aquí, porque escuché que daban té. Mi segunda bebida favorita es el té de miel y canela. Tampoco había. Está bien. Solo estoy… pensando en miel».`, `Alguém está deitada num colchão sob um cobertor, com um copo de papel intocado do lado da mão, falando pro teto numa voz suave e sonhadora. «Minha bebida favorita é whisky com mel. Sabia? Procurei no bar e disseram que não. É um lugar clandestino, claro que não tem whisky com mel. Aí vim pra cá, porque ouvi dizer que davam chá. Minha segunda bebida favorita é chá de mel e canela. Também não tinha. Tá tudo bem. Eu só tô… pensando em mel».`),
        do: { flag: 'fran_met', soc: 2 },
        choices: [
          K('care', t(`"I'll see what I can find."`, `«Voy a ver qué consigo».`, `«Vou ver o que consigo».`), { free: true, next: null, react: t(`A small smile under the blanket. "Thanks. No hurry. Honey is patient."`, `Una sonrisa pequeña bajo la manta. «Gracias. Sin apuro. La miel es paciente».`, `Um sorriso pequeno sob o cobertor. «Valeu. Sem pressa. O mel é paciente».`) }),
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
        text: t(`"You look so excited! Come and dance with me, no pretence. And hey…" ${FRIEND} pats a pocket with a secret smile. "If you can follow every one of my moves, I might have something sweet for a great dancer."`, `«¡Se nota que tienes ganas de bailar! Ven a bailar conmigo, sin tapujos. Y oye…» ${FRIEND} se palmea un bolsillo con una sonrisa secreta. «Si logras seguir todos mis pasos, quizás tenga algo dulce para quien baila genial».`, `«Dá pra ver que você tá com vontade de dançar! Vem dançar comigo, sem frescura. E olha…» ${FRIEND} bate num bolso com um sorriso secreto. «Se você conseguir seguir todos os meus passos, talvez eu tenha algo doce pra quem dança muito bem».`),
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

/* ---- consolidated from story_v37.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, S = EM.scripts, D = EM.DIALOGUES, E = EM.engine;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };
  const LEAVE = function () { return K('chill', t(`Leave him to the floor.`, `Dejarlo con la pista.`, `Deixar ele com a pista.`), { free: true, next: null }); };

  /* ---------------------------------------------------------------- who he is */
  EM.CAST.eloy = { name: 'ELOY K', look: { skin: 6, build: 1, expr: 3, hair: 22, hc: 3, top: 20, tc: 2, bottom: 8, bc: 6, shoes: 3, ac: 8, hat: 0, face: 4, neck: 3, ear: 3, makeup: 6, wrist: 2 } };

  /* the longest dance in the game: five rounds, the last one sixteen arrows (THE LONG WAY ROUND is eight on its own) */
  EM.MOVES.longway = { seq: 'ULDRDLUR', name: t('THE LONG WAY ROUND', 'EL LARGO CAMINO', 'O CAMINHO LONGO') };
  EM.PARTNERS.eloy = {
    tempo: 600, moves: ['wave', 'spiral', 'sway', 'shuffle', 'longway'],
    rounds: function (pick) { return [[pick()], [pick(), pick()], [pick(), pick()], [pick(), pick(), pick()], ['longway', pick(), pick()]]; },
    win: t(`Eloy K goes down on one knee, rises, and bows to the note on the floor instead of you. "No one has ever finished that. I'm not sure I have."`, `Eloy K baja sobre una rodilla, se levanta y hace una reverencia a la nota del piso en vez de a ti. «Nadie lo ha terminado nunca. No estoy seguro de haberlo hecho yo».`, `O Eloy K se ajoelha, levanta e faz uma reverência pra nota do chão em vez de pra você. «Ninguém nunca terminou isso. Não tenho certeza se eu terminei».`)
  };

  /* the blessing pays: partner dances ... */
  const pd0 = U.partnerDance;
  U.partnerDance = function (who, cb) {
    pd0.call(this, who, function (res) {
      if (cb) cb(res);
      const s = EM.state;
      if (s && !s.ended && s.flags.eloy_blessed && res && res.grade !== 'bail' && res.grade !== 'fail') {
        L.apply({ fun: res.grade === 'win' ? 5 : 3, weird: -2 });
        U.toast({ icon: 'star', kind: 'good', ms: 3800, text: t(`ELOY'S KISS: that dance paid extra.`, `EL BESO DE ELOY: ese baile rindió más.`, `O BEIJO DO ELOY: essa dança rendeu mais.`) });
      }
    });
  };
  /* ... and every minute on the beat (freestyle's own bonus is in rhythm.js) */
  const m0 = L.minute;
  L.minute = function () {
    m0.apply(this, arguments);
    const s = EM.state;
    if (s && !s.ended && s.flags.eloy_blessed && E.dancing) { L.stat('fun', 0.4); L.stat('weird', -0.35); }
  };

  /* ---------------------------------------------------------------- the side quest */
  const mk = function (s, f) { return s.flags[f] ? '✓' : '·'; };
  EM.QUESTS.sq_eloy = {
    title: t('ELOY K: THE LONG DANCE', 'ELOY K: EL BAILE LARGO', 'ELOY K: A DANÇA LONGA'),
    desc: function (s) {
      return t(`Eloy K dances by a glowing note on the main floor. ${mk(s, 'eloy_danced')} Dance the long dance with him. ${mk(s, 'eloy_drink_given')} Bring him a drink from the bar. ${mk(s, 'eloy_blessed')} Accept his offer: a kiss, or the cheek, or nothing at all. Saying no costs you nothing.`,
        `Eloy K baila junto a una nota luminosa en la pista principal. ${mk(s, 'eloy_danced')} Baila con él el baile largo. ${mk(s, 'eloy_drink_given')} Llévale un trago de la barra. ${mk(s, 'eloy_blessed')} Acepta su oferta: un beso, la mejilla, o nada. Decir que no no te cuesta nada.`,
        `O Eloy K dança junto a uma nota luminosa na pista principal. ${mk(s, 'eloy_danced')} Dance a dança longa com ele. ${mk(s, 'eloy_drink_given')} Leve uma bebida do bar pra ele. ${mk(s, 'eloy_blessed')} Aceite a oferta: um beijo, a bochecha, ou nada. Dizer não não custa nada.`);
    },
    doneText: t(`From now on dancing pays more FUN, and WEIRDNESS drops while you move. Eloy K calls it the floor's way of saying thank you.`, `Desde ahora bailar rinde más DIVERSIÓN, y la RAREZA baja mientras te mueves. Eloy K lo llama la manera que tiene la pista de dar las gracias.`, `A partir de agora dançar rende mais DIVERSÃO, e a ESTRANHEZA cai enquanto você se mexe. O Eloy K chama isso de jeito da pista de agradecer.`)
  };

  /* ---------------------------------------------------------------- the conversation */
  const N = {};
  N.st = { branch: [
    { req: F('eloy_blessed'), to: 'after' },
    { req: F('eloy_drink_given'), to: 'kiss_offer' },
    { req: function (s) { return s.quests.sq_eloy === 'active' && !!s.flags.eloy_danced; }, to: 'drink_gate' },
    { req: function (s) { return s.quests.sq_eloy === 'active'; }, to: 'need_dance' },
    { req: function () { return true; }, to: 'a' }
  ] };
  N.a = {
    text: t(`A few steps from one of the glowing notes on the floor, a man in a long pink sequinned coat dances alone and unhurried: lashes, a silk scarf, heels he has plainly agreed to. Each time the song changes he moves exactly one step, never closer to the note. He sees you and lowers his arms without losing the sway. "Love. Come into the light. Not that light. The good one."`, `A unos pasos de una de las notas luminosas del piso, un hombre con un abrigo largo rosa de lentejuelas baila solo y sin apuro: pestañas, un pañuelo de seda, tacones con los que claramente ha llegado a un acuerdo. Cada vez que cambia la canción se mueve exactamente un paso, sin acercarse nunca a la nota. Te ve y baja los brazos sin perder el balanceo. «Amor. Entra en la luz. Esa no. La buena».`, `A poucos passos de uma das notas luminosas do chão, um homem de casaco longo rosa de lantejoulas dança sozinho e sem pressa: cílios, um lenço de seda, saltos com os quais claramente fez um acordo. Cada vez que a música muda ele se mexe exatamente um passo, nunca mais perto da nota. Ele te vê e abaixa os braços sem perder o balanço. «Amor. Entra na luz. Essa não. A boa».`),
    choices: [
      K('ask', t(`"Why do you always stay a step from the note?"`, `«¿Por qué te quedas siempre a un paso de la nota?»`, `«Por que você fica sempre a um passo da nota?»`), { next: 'note' }),
      K('plan', t(`"Could you teach me to dance like that?"`, `«¿Podrías enseñarme a bailar así?»`, `«Você poderia me ensinar a dançar assim?»`), { next: 'offer' }),
      K('smooth', t(`"You're the best-dressed thing in this building."`, `«Eres lo mejor vestido de este edificio».`, `«Você é a coisa mais bem vestida desse prédio».`), { next: 'praise' }),
      LEAVE()
    ]
  };
  N.praise = { text: t(`He presses a hand to the sequins over his heart. "Thank you. It took the afternoon and a long, private argument with a zip." A beat. "Come closer, I've something to say that requires eye contact."`, `Se lleva una mano a las lentejuelas sobre el corazón. «Gracias. Me tomó la tarde y una discusión muy privada con un cierre». Una pausa. «Acércate, tengo algo que decir que requiere contacto visual».`, `Ele leva uma mão às lantejoulas sobre o coração. «Obrigado. Levou a tarde e uma discussão muito particular com um zíper». Uma pausa. «Chega mais perto, tenho uma coisa pra dizer que exige contato visual».`), once: true, do: { soc: 3, fun: 2 }, next: 'a' };
  N.note = { text: t(`"The note is where the floor says yes." He doesn't look at it. "Everyone steps on it and takes the yes for free. I've stayed one step away for years. You honour something by leaving it room to be asked."`, `«La nota es donde la pista dice que sí». No la mira. «Todos la pisan y se llevan el sí gratis. Yo llevo años a un paso de distancia. Honras algo cuando le dejas espacio para que se lo pidan».`, `«A nota é onde a pista diz sim». Ele não olha pra ela. «Todo mundo pisa e leva o sim de graça. Eu fico a um passo de distância há anos. Você honra uma coisa quando deixa espaço pra ela ser pedida».`), once: true, do: { soc: 3, care: 1, flag: 'g_eloy_open' }, next: 'a' };
  N.offer = {
    text: t(`He tilts his head and assesses you with a tailor's patience. "Teach it? That isn't how it works, love. I can give you three things, in order, and you may refuse each one. One: dance with me, all of it. It's long. Nobody finishes it the first time. Two: bring me a drink from the bar. I don't leave the floor; it's a rule I made for myself." He smiles. "Three, when you've done the first two, I'll offer you a kiss. It's an old kind of magic. Everyone who's had it dances better. That is all I know about it."`, `Inclina la cabeza y te evalúa con paciencia de sastre. «¿Enseñarlo? Así no funciona, amor. Puedo darte tres cosas, en orden, y puedes rechazar cada una. Uno: baila conmigo, todo. Es largo. Nadie lo termina la primera vez. Dos: tráeme un trago de la barra. No dejo la pista; es una regla que me puse». Sonríe. «Tres, cuando hayas hecho las dos primeras, te ofrezco un beso. Es una magia antigua. Quien lo ha recibido baila mejor. Eso es todo lo que sé».`, `Ele inclina a cabeça e avalia você com paciência de alfaiate. «Ensinar? Não funciona assim, amor. Posso te dar três coisas, em ordem, e você pode recusar cada uma. Um: dança comigo, tudo. É longa. Ninguém termina de primeira. Dois: me traz uma bebida do bar. Eu não saio da pista; é uma regra que eu mesmo fiz». Ele sorri. «Três, quando você tiver feito as duas primeiras, eu te ofereço um beijo. É uma magia antiga. Todo mundo que recebeu dança melhor. É tudo que eu sei sobre isso».`),
    choices: [
      K('yes', t(`"Yes. The dance first."`, `«Sí. Primero el baile».`, `«Sim. Primeiro a dança».`), { do: { soc: 2, flag: 'eloy_met', quest: { sq_eloy: 'active' } }, next: 'need_dance' }),
      K('chill', t(`"That's a lot. Let me think."`, `«Es mucho. Déjame pensarlo».`, `«É muita coisa. Deixa eu pensar».`), { free: true, next: null })
    ]
  };
  N.need_dance = {
    text: function (s) {
      return s.flags.eloy_has_drink
        ? t(`"I see the glass, love. It can wait: a drink is for the end of a dance. Whenever you're ready. It has a beginning, a middle, and a long, long end."`, `«Veo el vaso, amor. Puede esperar: un trago es para el final de un baile. Cuando quieras. Tiene un principio, un medio y un final larguísimo».`, `«Estou vendo o copo, amor. Pode esperar: bebida é pro fim de uma dança. Quando quiser. Tem começo, meio e um fim longuíssimo».`)
        : t(`"Whenever you're ready. The dance has a beginning, a middle, and a long, long end."`, `«Cuando quieras. El baile tiene un principio, un medio y un final larguísimo».`, `«Quando quiser. A dança tem começo, meio e um fim longuíssimo».`);
    },
    choices: [
      K('dance', t(`Dance with Eloy K.`, `Bailar con Eloy K.`, `Dançar com o Eloy K.`), { call: 'pd_eloy', free: true, next: null }),
      K('chill', t(`"Not yet."`, `«Todavía no».`, `«Ainda não».`), { free: true, next: null })
    ]
  };
  N.drink_gate = { branch: [{ req: F('eloy_has_drink'), to: 'give' }, { req: function () { return true; }, to: 'need_drink' }] };
  N.need_drink = {
    text: t(`He is still catching his breath, which on him reads as a pose. "That was the dance. Dreadful and glorious. Now the glass. The bar is on the east wall; tell Nico it's for the one by the note. He knows mine."`, `Todavía recupera el aliento, que en él parece una pose. «Eso fue el baile. Terrible y glorioso. Ahora el vaso. La barra está en la pared este; dile a Nico que es para el de la nota. Conoce el mío».`, `Ele ainda recupera o fôlego, que nele parece uma pose. «Essa foi a dança. Terrível e gloriosa. Agora o copo. O bar fica na parede leste; diz pro Nico que é pro da nota. Ele conhece o meu».`),
    choices: [K('chill', t(`"On my way."`, `«Voy».`, `«Já vou».`), { free: true, next: null })]
  };
  N.give = {
    text: t(`You hold out the glass. He takes it with both hands, closes his eyes over the lime, and drinks half of it in one long breath. "Cold. Correct. In all these years the floor has never once sent me a glass."`, `Le tiendes el vaso. Lo toma con las dos manos, cierra los ojos sobre el limón y se bebe la mitad en un largo respiro. «Frío. Correcto. En todos estos años la pista nunca me mandó un vaso».`, `Você estende o copo. Ele pega com as duas mãos, fecha os olhos sobre o limão e bebe metade num longo respiro. «Gelado. Certo. Em todos esses anos a pista nunca me mandou um copo».`),
    once: true, do: { flag: 'eloy_drink_given', unflag: 'eloy_has_drink', soc: 3, fun: 2 }, next: 'kiss_offer'
  };
  N.kiss_offer = {
    text: t(`He sets the glass on the nearest speaker with great care. "Two out of three, love. The third is yours to refuse. May I offer you a kiss?" He waits. He means the waiting.`, `Deja el vaso sobre el parlante más cercano con mucho cuidado. «Dos de tres, amor. La tercera es tuya para rechazarla. ¿Puedo ofrecerte un beso?». Espera. Le importa la espera.`, `Ele apoia o copo na caixa de som mais próxima com muito cuidado. «Dois de três, amor. A terceira é sua pra recusar. Posso te oferecer um beijo?». Ele espera. A espera é de verdade.`),
    choices: [
      K('makeout', t(`"Yes. Kiss me."`, `«Sí. Bésame».`, `«Sim. Me beija».`), { next: 'kiss' }),
      K('care', t(`"On the cheek, please."`, `«En la mejilla, por favor».`, `«Na bochecha, por favor».`), { next: 'cheek' }),
      K('chill', t(`"Not a kiss. Thank you for asking."`, `«Un beso no. Gracias por preguntar».`, `«Beijo não. Obrigado por perguntar».`), { free: true, next: 'nokiss' })
    ]
  };
  N.nokiss = { text: t(`"Thank you for saying it plainly." He picks up the glass again. "That's the whole of the magic, if I'm honest: someone asked, someone answered. The offer stays open all night. So does the floor."`, `«Gracias por decirlo con claridad». Recoge el vaso otra vez. «Esa es toda la magia, si soy honesto: alguien preguntó, alguien respondió. La oferta sigue abierta toda la noche. La pista también».`, `«Obrigado por dizer com clareza». Ele pega o copo de novo. «Essa é a magia toda, se eu for honesto: alguém perguntou, alguém respondeu. A oferta fica aberta a noite inteira. A pista também».`), next: null };
  N.kiss = {
    text: t(`Eloy K takes your face in both hands, asks once more with his eyebrows, and kisses you: unhurried, warm, lime and glitter. Something loosens behind your knees. "There. Go and dance. Don't think about your feet; they know."`, `Eloy K toma tu cara con las dos manos, pregunta una vez más con las cejas y te besa: sin prisa, cálido, lima y brillo. Algo se afloja detrás de tus rodillas. «Listo. Ve a bailar. No pienses en tus pies; ellos saben».`, `O Eloy K pega seu rosto com as duas mãos, pergunta mais uma vez com as sobrancelhas e te beija: sem pressa, quente, limão e glitter. Alguma coisa se solta atrás dos seus joelhos. «Pronto. Vai dançar. Não pensa nos pés; eles sabem».`),
    do: { fun: 12, soc: 3, weird: -1, flag: ['kiss_eloy', 'eloy_blessed', 'made_out'], quest: { sq_eloy: 'done' }, call: 'eloy_kiss' }, next: 'blessed'
  };
  N.cheek = {
    text: t(`He kisses the air an inch from your cheek, then the cheek itself, lightly, with a scented formality. "The cheek works. The magic was never in the mouth, love. It's in the asking."`, `Besa el aire a un centímetro de tu mejilla, y luego la mejilla, con ligereza y formalidad perfumada. «La mejilla funciona. La magia nunca estuvo en la boca, amor. Está en preguntar».`, `Ele beija o ar a um centímetro da sua bochecha, e depois a bochecha, de leve, com uma formalidade perfumada. «A bochecha funciona. A magia nunca esteve na boca, amor. Tá em perguntar».`),
    do: { fun: 8, soc: 3, flag: ['eloy_blessed'], quest: { sq_eloy: 'done' } }, next: 'blessed'
  };
  N.blessed = { text: t(`A small bow. "From tonight the floor will pay you more, and whatever has been weighing on you will weigh less while you move. I don't make the rules. I just stand one step from them."`, `Una pequeña reverencia. «Desde esta noche la pista te pagará más, y lo que te pesaba pesará menos mientras te mueves. Yo no hago las reglas. Solo me quedo a un paso de ellas».`, `Uma pequena reverência. «A partir de hoje a pista vai te pagar mais, e o que pesava em você vai pesar menos enquanto você se mexe. Eu não faço as regras. Só fico a um passo delas».`), once: true, do: { soc: 2 }, next: null };
  N.after = {
    text: t(`Eloy K spins once on one heel and lands exactly a step from the note. "You're dancing differently. I can see it from here."`, `Eloy K gira una vez sobre un tacón y aterriza exactamente a un paso de la nota. «Bailas distinto. Lo veo desde aquí».`, `O Eloy K gira uma vez num salto e pousa exatamente a um passo da nota. «Você tá dançando diferente. Eu vejo daqui».`),
    choices: [
      K('dance', t(`"Dance with me again."`, `«Baila conmigo otra vez».`, `«Dança comigo de novo».`), { call: 'pd_eloy', free: true, next: null }),
      K('ask', t(`"Why a step from the note?"`, `«¿Por qué a un paso de la nota?»`, `«Por que a um passo da nota?»`), { req: function (s) { return !s.flags.g_eloy_open; }, next: 'note_after' }),
      LEAVE()
    ]
  };
  N.note_after = Object.assign({}, N.note, { next: 'after' });
  D.eloy = { who: 'eloy', role: t('GLAM // ON THE FLOOR', 'GLAM // EN LA PISTA', 'GLAM // NA PISTA'), start: 'st', nodes: N };

  /* the dance and the kiss */
  S.pd_eloy = function () {
    U.partnerDance('eloy', function (res) {
      const s = EM.state;
      if (res.grade === 'win') L.apply({ fun: 12, soc: 3, flag: ['eloy_danced', 'eloy_dwin'] });
      else if (res.grade === 'partial') L.apply({ fun: 6, soc: 1, flag: 'eloy_danced' });
      else if (res.grade === 'fail') L.apply({ fun: 2, weird: 1, soc: -1 });
      else L.apply({ soc: -1 });
      L.spend(8);
      if (!s.ended) U.startDialogue('eloy', { npc: 'eloy' });
    });
  };
  S.eloy_kiss = function () {
    const s = EM.state;
    s.makeouts = (s.makeouts || 0) + 1; s.makeoutsOk = (s.makeoutsOk || 0) + 1;
    s.flagAt = s.flagAt || {}; s.flagAt.kiss_eloy = s.time;
    setTimeout(function () { if (EM.story.kissReact && !s.ended) EM.story.kissReact(true, 'eloy'); }, 2600);
    U.toast({ icon: 'star', kind: 'good', ms: 6500, text: t(`ELOY'S KISS: dancing now pays more FUN and takes WEIRDNESS off.`, `EL BESO DE ELOY: bailar ahora rinde más DIVERSIÓN y baja la RAREZA.`, `O BEIJO DO ELOY: dançar agora rende mais DIVERSÃO e reduz a ESTRANHEZA.`) });
  };

  /* the drink, from the bar */
  (function () {
    const bm = D.bar_menu; if (!bm || !Array.isArray(bm.nodes.a.choices)) return;
    const c = K('care', t(`A drink for Eloy K.`, `Un trago para Eloy K.`, `Uma bebida pro Eloy K.`), { free: true, req: function (s) { return s.quests.sq_eloy === 'active' && !s.flags.eloy_has_drink && !s.flags.eloy_drink_given; }, next: 'eloy_drink' });
    bm.nodes.a.choices.splice(Math.max(0, bm.nodes.a.choices.length - 2), 0, c);
    bm.nodes.eloy_drink = { text: t(`Nico already has the glass out: tall, pink, a lime wheel, no alcohol. "For the one dancing by the note. He's sent a runner every night for years. Tonight he's sent you." He slides it across with two fingers. "Don't spill. He'll know."`, `Nico ya tiene el vaso afuera: alto, rosa, una rodaja de limón, sin alcohol. «Para el que baila junto a la nota. Lleva años mandando a alguien cada noche. Esta noche te mandó a ti». Lo desliza con dos dedos. «No lo derrames. Se entera».`, `O Nico já tá com o copo na mão: alto, rosa, uma rodela de limão, sem álcool. «Pro que dança junto da nota. Faz anos que ele manda alguém toda noite. Hoje mandou você». Ele desliza com dois dedos. «Não derrama. Ele fica sabendo».`), do: { flag: 'eloy_has_drink', time: 3 }, next: null };
  })();

  /* what you carry, and what the kiss gave you */
  EM.menuItems = EM.menuItems || [];
  EM.menuItems.push(function (box, s) {
    const row = function (label) { const r = U.el('div', 'stashrow'); r.appendChild(U.el('span', 'stl', EM.tr(label))); box.appendChild(r); };
    if (s.flags.eloy_has_drink) row(t(`A DRINK FOR ELOY K: tall, pink, no alcohol. He is on the main floor, a step from a note.`, `UN TRAGO PARA ELOY K: alto, rosa, sin alcohol. Está en la pista principal, a un paso de una nota.`, `UMA BEBIDA PRO ELOY K: alta, rosa, sem álcool. Ele tá na pista principal, a um passo de uma nota.`));
    if (s.flags.eloy_blessed) row(t(`ELOY'S KISS: dancing pays more FUN and takes WEIRDNESS off.`, `EL BESO DE ELOY: bailar rinde más DIVERSIÓN y baja la RAREZA.`, `O BEIJO DO ELOY: dançar rende mais DIVERSÃO e reduz a ESTRANHEZA.`));
  });

  /* on the main floor, dancing a few steps from one of the glowing notes (the dance spot at 15,10) */
  (function () {
    const z = EM.zones && EM.zones.main;
    if (z) z.npc({ id: 'eloy', cast: 'eloy', x: 17.6, y: 11.6, dlg: 'eloy', dir: 'l', pose: 'dance', reach: 24 });
  })();
})();

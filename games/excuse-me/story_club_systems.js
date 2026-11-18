/* EXCUSE ME — club systems: ÆRIEL on decks, hostile dancers, blind darkroom, hard reset memory, powder mix-ups, illegal rave. */
'use strict';
/* ---- consolidated from story_v3.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  function B(f, n) { const o = {}; o[f] = n; return o; }

  /* ============================================================ ÆRIEL, THE CLOSING DJ */
  D.resident = {
    who: 'resident', role: T('THE CLOSING SET', 'EL SET DE CIERRE', 'O SET DE ENCERRAMENTO'), start: 'a', nodes: {
      a: {
        text: T('"Don\'t look at me like that. I\'m hydrating." ÆRIEL is sitting on a flight case with a thermos of tea, headphones around the neck, shoes off. They have the posture of someone who has been awake for twenty hours and is at peace about it. "You\'re not staff. You\'re not press. You\'re lost, or lucky. Or, heaven help us, on a list."', '«No me mires así. Estoy hidratándome». ÆRIEL está sobre un flight case con un termo de té, auriculares al cuello, sin zapatos. Tiene la postura de alguien que lleva veinte horas sin dormir y lo lleva en paz. «No eres staff. No eres prensa. Te perdiste, o tuviste suerte. O, que dios nos ayude, estás en una lista».', '«Não me olha assim. Eu tô me hidratando». ÆRIEL está num flight case com uma garrafa térmica de chá, fones no pescoço, sem sapatos. Tem a postura de quem está há vinte horas sem dormir e em paz com isso. «Você não é staff. Não é imprensa. Se perdeu, ou teve sorte. Ou, Deus nos ajude, tá numa lista».'),
        choices: [
          { tone: 'care', t: T('Offer your water. "You\'ve been working all night."', 'Ofrecer tu agua. «Llevas toda la noche trabajando».', 'Oferecer sua água. «Você tá trabalhando a noite toda».'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, soc: 3, flag: 'resident_friend' }, next: 'friend' },
          { tone: 'joke', t: T('"Wait. You\'re ÆRIEL. THE ÆRIEL. Æ000.X."', '«Espera. Eres ÆRIEL. ÆRIEL de verdad. Æ000.X».', '«Peraí. Você é ÆRIEL. ÆRIEL de verdade. Æ000.X».'), next: 'ae' },
          { tone: 'ask', t: T('"What are you going to play at the end?"', '«¿Qué vas a tocar al final?»', '«O que você vai tocar no final?»'), next: 'play' },
          { tone: 'chill', t: T('"Sorry. Just passing through. Good luck tonight."', '«Perdón. Solo paso. Suerte esta noche».', '«Desculpa. Só passando. Boa sorte hoje».'), do: { soc: 2 }, next: null }
        ]
      },
      ae: {
        text: [
          T(`"Allegedly." They take a sip of tea. "Æ000.X is a party. I say 'curated dancefloor' with a straight face. Don't tell anyone I know how it sounds."`, `«Presuntamente». Toma un sorbo de té. «Æ000.X es una fiesta. Digo “pista curada” con la cara seria. No le digas a nadie que sé cómo suena».`, `«Supostamente». Toma um gole de chá. «A Æ000.X é uma festa. Eu digo “pista curada” com a cara séria. Não conta pra ninguém que eu sei como isso soa».`)
        ],
        choices: [
          { tone: 'ask', t: T('"How do I get on the list?"', '«¿Cómo entro a la lista?»', '«Como eu entro na lista?»'), next: 'list' },
          { tone: 'ask', t: T('"Is it true you read every single submission?"', '«¿Es verdad que leen cada solicitud?»', '«É verdade que vocês leem cada pedido?»'), next: 'sheet' },
          { tone: 'ask', t: T('"What are the rules?"', '«¿Cuáles son las reglas?»', '«Quais são as regras?»'), next: 'rules' },
          { tone: 'chill', t: T('"I love your parties."', '«Amo tus fiestas».', '«Amo suas festas».'), next: 'love' },
          { tone: 'ask', t: T('"What are you going to play at the end?"', '«¿Qué vas a tocar al final?»', '«O que você vai tocar no final?»'), next: 'play' }
        ]
      },
      list: {
        text: T('"You register. Registration does not guarantee an invitation. An invitation does not guarantee a ticket: it guarantees the right to buy one. Yes. I know. We are the only people in the world who made paying feel like winning." A pause. "And we don\'t explain decisions. Partly principle. Partly I lost the spreadsheet."', '«Te registras. El registro no garantiza una invitación. Una invitación no garantiza una entrada: garantiza el derecho a comprarla. Sí. Lo sé. Somos las únicas personas del mundo que hicieron que pagar se sienta como ganar». Una pausa. «Y no explicamos las decisiones. En parte por principio. En parte porque perdí la planilla».', '«Você se cadastra. O cadastro não garante convite. Um convite não garante ingresso: garante o direito de comprar um. Sim. Eu sei. Somos as únicas pessoas do mundo que fizeram pagar parecer ganhar». Uma pausa. «E a gente não explica as decisões. Em parte por princípio. Em parte porque eu perdi a planilha».'),
        once: true, do: { fun: 3, soc: 1, flag: 'ae_list' },
        next: 'ae'
      },
      sheet: {
        text: T('"We read every single one. By \'we\' I mean one very tired person with a spreadsheet and half a sandwich. By \'read\' I mean: I read. I truly read. I read at three in the morning, with feelings." They look at the middle distance. "Somebody once wrote us a poem. We said yes. It was a good poem."', '«Leemos cada una. Por “leemos” quiero decir: una persona muy cansada con una planilla y medio sándwich. Por “leer” quiero decir: leo. De verdad leo. Leo a las tres de la mañana, con sentimientos». Mira un punto lejano. «Una vez nos escribieron un poema. Dijimos que sí. Era un buen poema».', '«A gente lê cada uma. Por “a gente” quero dizer: uma pessoa muito cansada com uma planilha e meio sanduíche. Por “lê” quero dizer: eu leio. Leio de verdade. Leio às três da manhã, com sentimentos». Olha pro vazio. «Uma vez alguém nos mandou um poema. A gente disse sim. Era um bom poema».'),
        once: true, do: { fun: 3, soc: 1, flag: 'ae_sheet' },
        next: 'ae'
      },
      rules: {
        text: [
          T('"Rule one: no photos. Rule two: we do not discuss the no-photo rule on the dancefloor. Rule three: drink water. I will know." They lift the thermos like evidence.', '«Regla uno: sin fotos. Regla dos: no discutimos la regla de las fotos en la pista. Regla tres: toma agua. Lo voy a saber». Levanta el termo como evidencia.', '«Regra um: sem fotos. Regra dois: a gente não discute a regra das fotos na pista. Regra três: beba água. Eu vou saber». Levanta a garrafa térmica como prova.'),
          T('"The FAQ is longer than some constitutions. Nobody has ever read it start to finish. I wrote it. I have not read it start to finish." A beat. "We call it sonic inquiry. It is a kick drum. The inquiry is whether you\'ll dance."', '«El FAQ es más largo que algunas constituciones. Nadie lo ha leído de principio a fin. Lo escribí yo. No lo he leído de principio a fin». Un momento. «Lo llamamos indagación sonora. Es un bombo. La indagación es si vas a bailar».', '«O FAQ é maior do que algumas constituições. Ninguém nunca leu do começo ao fim. Fui eu que escrevi. Eu não li do começo ao fim». Um instante. «A gente chama de investigação sonora. É um bumbo. A investigação é se você vai dançar».')
        ],
        once: true, do: { fun: 3, soc: 1, flag: 'ae_rules' },
        next: 'ae'
      },
      love: {
        text: T('"Stop. I\'ll cry into my tea." They do not stop looking pleased. "One more secret, since you\'re kind: we take the dancing seriously and ourselves lightly. Mostly. In theory. On good nights."', '«Para. Voy a llorar en mi té». No dejan de verse contentes. «Un secreto más, ya que eres amable: nos tomamos la pista en serio y a nosotros mismos a la ligera. Casi siempre. En teoría. En las buenas noches».', '«Para. Vou chorar no meu chá». Não param de parecer contentes. «Mais um segredo, já que você é gentil: a gente leva a dança a sério e a si mesmo de leve. Quase sempre. Em teoria. Nas boas noites».'),
        once: true, do: { soc: 4, fun: 3, flag: 'ae_love' },
        next: 'ae'
      },
      play: {
        text: T('"I never decide until I look at the room." They look at you for a moment. "Tell me what you need from the last hour. I won\'t promise anything, but I listen. It is, regrettably, my whole personality."', '«Nunca decido hasta que miro la sala». ÆRIEL te mira un momento. «Dime qué necesitas de la última hora. No prometo nada, pero escucho. Es, lamentablemente, toda mi personalidad».', '«Eu nunca decido até olhar a sala». ÆRIEL olha pra você por um momento. «Me diz o que você precisa da última hora. Não prometo nada, mas escuto. É, infelizmente, minha personalidade inteira».'),
        choices: [
          { tone: 'chill', t: T('"Something warm. For a room that has been through a lot."', '«Algo cálido. Para una sala que pasó por mucho».', '«Algo quente. Pra uma sala que passou por muita coisa».'), do: { flag: 'closing_warm' }, next: 'noted' },
          { tone: 'bold', t: T('"Something wild. Let\'s end loud."', '«Algo salvaje. Terminemos fuerte».', '«Algo selvagem. Vamos terminar alto».'), do: { flag: 'closing_wild' }, next: 'noted' },
          { tone: 'silent', t: T('"Something soft. People are tired."', '«Algo suave. La gente está cansada».', '«Algo suave. As pessoas estão cansadas».'), do: { flag: 'closing_soft' }, next: 'noted' }
        ]
      },
      friend: {
        text: T('They drink half the bottle and look at you with new interest. "Nobody brings the DJ water. People bring the DJ shots. I\'m opening the roof at half past five. If you bring your people, I\'ll play something for them." A slow breath. "What do they need from the last hour?"', 'ÆRIEL se toma la mitad de la botella y te mira con interés nuevo. «Nadie le trae agua a ÆRIEL. Le traen shots. Voy a abrir el techo a las cinco y media. Si traes a tu gente, tocaré algo para ellos». Respiran lento. «¿Qué necesitan de la última hora?»', 'ÆRIEL bebe metade da garrafa e te olha com interesse novo. «Ninguém traz água pra ÆRIEL. Trazem shots. Eu vou abrir o terraço às cinco e meia. Se você trouxer sua galera, toco algo pra eles». Respiram devagar. «O que eles precisam da última hora?»'),
        choices: [
          { tone: 'chill', t: T('"Something warm."', '«Algo cálido».', '«Algo quente».'), do: { flag: ['closing_warm', 'roof_promise'] }, next: 'noted' },
          { tone: 'bold', t: T('"Something wild."', '«Algo salvaje».', '«Algo selvagem».'), do: { flag: ['closing_wild', 'roof_promise'] }, next: 'noted' },
          { tone: 'silent', t: T('"Something soft."', '«Algo suave».', '«Algo suave».'), do: { flag: ['closing_soft', 'roof_promise'] }, next: 'noted' },
          { tone: 'joke', t: T('"Can I ask about Æ000.X first?"', '«¿Puedo preguntar primero por Æ000.X?»', '«Posso perguntar da Æ000.X primeiro?»'), next: 'ae' }
        ]
      },
      noted: {
        text: T(`"Noted." ÆRIEL closes their eyes for a second. "Go find your people. See you at sunrise. And a vouching is a serious thing. Don't set it on fire in the toilets."`, `«Anotado». ÆRIEL cierra los ojos un segundo. «Ve a buscar a tu gente. Nos vemos al amanecer. Y un aval es algo serio. No lo incendies en los baños».`, `«Anotado». A ÆRIEL fecha os olhos por um segundo. «Vai atrás da sua galera. A gente se vê no nascer do sol. E um aval é coisa séria. Não bota fogo nele nos banheiros».`),
        do: { flag: 'resident_met', fun: 3, soc: 3 }
      }
    }
  };
  EM.CAST.resident.name = 'ÆRIEL';

  /* ============================================================ Æ000.X JOKES ELSEWHERE */
  D.dragan.nodes.a.choices.push({ tone: 'joke', t: T('"I\'m on the list for the list."', '«Estoy en la lista de la lista».', '«Tô na lista da lista».'), next: 'b', do: { fun: 2 }, react: T('"Æ000.X people. Always the list for the list." He writes something down that is probably the weather.', '«Gente de Æ000.X. Siempre la lista de la lista». Anota algo que probablemente es el clima.', '«Gente da Æ000.X. Sempre a lista da lista». Ele anota algo que provavelmente é o tempo.') });
  D.hugo.nodes.a.choices.push({ tone: 'ask', t: T('"Ever been to an Æ000.X?"', '«¿Alguna vez fuiste a una Æ000.X?»', '«Já foi numa Æ000.X?»'), next: 'ae' });
  D.hugo.nodes.ae = {
    text: T('"Once. They made me fill in a form to dance. I filled it in three languages." He wipes an eye. "Best night I never expected."', '«Una vez. Me hicieron llenar un formulario para bailar. Lo llené en tres idiomas». Se seca un ojo. «La mejor noche que no esperaba».', '«Uma vez. Me fizeram preencher um formulário pra dançar. Preenchi em três idiomas». Ele enxuga um olho. «A melhor noite que eu não esperava».'),
    do: { fun: 4, soc: 2, flag: 'hugo_ae' }
  };
  D.luca.nodes.a.choices.push({ tone: 'joke', t: T('"Is this coat check also invitation only?"', '«¿Este guardarropa también es solo por invitación?»', '«Essa chapelaria também é só por convite?»'), next: 'ae' });
  D.luca.nodes.ae = {
    text: T(`"Only at the Æ000.X ones. They call it a trust-based jacket ecosystem. I'm on the team. It was not my idea. I hang a lot of jackets and pretend it's deeply meaningful." He hands you a ticket with a small flourish. "It is a little meaningful."`, `«Solo en las de Æ000.X. Lo llaman un ecosistema de abrigos basado en la confianza. Estoy en el equipo. No fue idea mía. Cuelgo muchos abrigos y finjo que es profundamente significativo». Te da un ticket con un pequeño floreo. «Es un poco significativo».`, `«Só nas da Æ000.X. Eles chamam de ecossistema de casacos baseado em confiança. Eu tô na equipe. Não foi ideia minha. Penduro muitos casacos e finjo que é profundamente significativo». Ele te entrega uma ficha com um pequeno floreio. «É um pouquinho significativo».`),
    do: { fun: 3, soc: 1 }
  };
  D.hazel.nodes.a.choices.push({ tone: 'joke', t: T('"Did you ever go to an Æ000.X?"', '«¿Alguna vez fuiste a una Æ000.X?»', '«Você já foi numa Æ000.X?»'), next: 'ae' });
  D.hazel.nodes.ae = {
    text: T('"I got in once." She says it like a confession. "I hated every word on the form. I stayed till six." Her foot is on the beat.', '«Entré una vez». Lo dice como una confesión. «Odié cada palabra del formulario. Me quedé hasta las seis». Su pie sigue el pulso.', '«Entrei uma vez». Ela fala como quem confessa. «Odiei cada palavra do formulário. Fiquei até as seis». O pé dela marca o tempo.'),
    do: { fun: 4, soc: 1, flag: 'hazel_ae' }
  };

  /* barks about Æ000.X from your friends */
  story.extraBarks = {
    maru: [T('LUISA: "I got onto the Æ000.X list once. I told everyone for a month."', 'LUISA: «Una vez entré a la lista de Æ000.X. Se lo conté a todo el mundo durante un mes».', 'LUISA: «Uma vez entrei na lista da Æ000.X. Contei pra todo mundo por um mês».')],
    dani: [T('BENJA: "Æ000.X rejected me twice and I respect it so much."', 'BENJA: «Æ000.X me rechazó dos veces y lo respeto muchísimo».', 'BENJA: «A Æ000.X me recusou duas vezes e eu respeito demais».')],
    tato: [T('FEÑA: "I read the Æ000.X FAQ. It cared about me more than my last relationship."', 'FEÑA: «Leí el FAQ de Æ000.X. Se preocupó más por mí que mi última relación».', 'FEÑA: «Li o FAQ da Æ000.X. Ele se preocupou mais comigo do que meu último relacionamento».')]
  };

  /* posters you can read */
  EM.objects.poster = function (ent) { U.startDialogue(ent.def.poster, {}); };
  Z.foyer.obj({ id: 'poster_foyer', kind: 'poster', x: 17, y: 2, w: 2, h: 1, label: T('READ THE POSTER', 'LEER EL AFICHE', 'LER O CARTAZ'), poster: 'poster_foyer' });
  Z.restrooms.obj({ id: 'poster_wc', kind: 'poster', x: 13, y: 2, w: 2, h: 1, label: T('READ THE NOTICE', 'LEER EL AVISO', 'LER O AVISO'), poster: 'poster_wc' });
  Z.courtyard.obj({ id: 'poster_court', kind: 'poster', x: 30, y: 2, w: 2, h: 1, label: T('READ THE FLYER', 'LEER EL FLYER', 'LER O FLYER'), poster: 'poster_court' });
  D.poster_foyer = {
    start: 'a', nodes: {
      a: {
        text: T('POSTER: "Æ000.X. Access by invitation. Request access online. Every submission is reviewed one by one. Explanations for admission decisions are not provided." Underneath, in smaller print: "Vibes: required. Self-seriousness: capped at forty percent."', 'AFICHE: «Æ000.X. Acceso por invitación. Solicita acceso en nuestra web. Cada registro se revisa uno por uno. No se entregan explicaciones sobre las decisiones de admisión». Más abajo, en letra chica: «Vibras: requeridas. Seriedad: limitada al cuarenta por ciento».', 'CARTAZ: «Æ000.X. Acesso por convite. Solicite acesso no site. Cada cadastro é analisado um a um. Não damos explicações sobre decisões de admissão». Embaixo, em letra miúda: «Vibes: obrigatórias. Seriedade: limitada a quarenta por cento».'),
        choices: [
          { tone: 'joke', t: T('Mentally request access.', 'Solicitar acceso mentalmente.', 'Solicitar acesso mentalmente.'), do: { fun: 2 }, free: true, next: null, react: T(`Form received. You are number 4,812 in a kind queue. A confirmation email you will never receive arrives in your heart.`, `Formulario recibido. Eres el número 4.812 de una fila amable. Un correo de confirmación que nunca recibirás llega a tu corazón.`, `Formulário recebido. Você é o número 4.812 numa fila gentil. Um e-mail de confirmação que você nunca vai receber chega ao seu coração.`) },
          { tone: 'ask', t: T('Read the fine print.', 'Leer la letra chica.', 'Ler a letra miúda.'), do: { fun: 1 }, free: true, next: null, react: T('"An invitation grants you access to purchase a ticket." You read it three times. You admire the nerve.', '«Una invitación te habilita a comprar una entrada». Lo lees tres veces. Admiras el descaro.', '«Um convite concede a você o acesso para comprar um ingresso». Você lê três vezes. Admira a coragem.') }
        ]
      }
    }
  };
  D.poster_wc = {
    start: 'a', nodes: {
      a: {
        text: T('A notice taped beside the sinks. "Q: What should I do if I feel unwell? A: Approach any member of staff. You will never be penalised, judged or thrown out for asking for medical attention, emotional support or a safe place to rest." Below it someone has written, in eyeliner: "also wash your hands." And below that, in a different hand: "Q: What if I need the toilet? A: Please see: the queue."', 'Un aviso pegado junto a los lavamanos. «P: ¿Qué debo hacer si me siento mal? R: Acércate a cualquier integrante del equipo. Nunca serás penalizado, juzgado ni expulsado por pedir atención médica, contención emocional o un lugar seguro para descansar». Debajo alguien escribió, con delineador: «y lávate las manos». Y debajo, con otra letra: «P: ¿Y si necesito el baño? R: Por favor, consulta: la fila».', 'Um aviso colado ao lado das pias. «P: O que devo fazer se eu não me sentir bem? R: Procure qualquer integrante da equipe. Você nunca será penalizado, julgado ou expulso por pedir atendimento médico, apoio emocional ou um local seguro para descansar». Embaixo alguém escreveu, de delineador: «e lave as mãos». E embaixo disso, com outra letra: «P: E se eu precisar do banheiro? R: Por favor, consulte: a fila».'),
        do: { soc: 3, fun: 1 }
      }
    }
  };
  D.poster_court = {
    start: 'a', nodes: {
      a: {
        text: T(`A flyer zip-tied to the fence. "ÆRIEL // THE CLOSING SET. 06:00. THE ROOF. Curated by ÆRIEL." Someone has drawn a tiny, accurate cat in the corner. Underneath: "ask first. drink water. be kind to Rosa."`, `Un flyer atado a la reja con precintos. «ÆRIEL // EL SET DE CIERRE. 06:00. EL TECHO. Curado por ÆRIEL». Alguien dibujó un gato diminuto y preciso en la esquina. Debajo: «pregunta primero. toma agua. sé amable con Rosa».`, `Um flyer preso na grade com abraçadeira. «ÆRIEL // O SET DE ENCERRAMENTO. 06:00. O TERRAÇO. Curadoria de ÆRIEL». Alguém desenhou um gato minúsculo e preciso no canto. Embaixo: «pergunte primeiro. beba água. seja gentil com a Rosa».`),
        do: { soc: 2, fun: 1 }
      }
    }
  };

  /* ============================================================ HOSTILE DANCERS */
  /* Not everybody moves when you say excuse me. A small, annoying minority takes it personally. */
  S.hostile_dancer = function (ctx) {
    EM.CAST.hostile = { name: 'STRANGER', look: ctx.look };
    const id = 'hostile_' + (ctx.kind || 0);
    U.startDialogue(id, { npc: 'hostile' });
  };
  const HCH = {
    sorry: { tone: 'sorry', t: T('"Sorry, my bad. I\'ll go around."', '«Perdón, mi error. Voy por otro lado».', '«Desculpa, foi mal. Vou por outro lado».'), do: { soc: -1, fun: 1 }, call: 'hostile_ok', next: null, react: T('A long, suspicious look. "…Fine. Thank you." They shift six centimetres. That is a victory.', 'Una mirada larga y desconfiada. «…Bueno. Gracias». Se corren seis centímetros. Eso es una victoria.', 'Um olhar longo e desconfiado. «…Tá. Valeu». Eles se mexem seis centímetros. Isso é uma vitória.') },
    chill: { tone: 'chill', t: T('"Totally fair. I\'ll wait for the next gap."', '«Totalmente justo. Espero el próximo hueco».', '«Totalmente justo. Espero a próxima brecha».'), do: { soc: -2, time: 3 }, call: 'hostile_ok', next: null, react: T('You wait. The gap arrives. Nobody thanks you.', 'Esperas. Llega el hueco. Nadie te lo agradece.', 'Você espera. A brecha chega. Ninguém agradece.') },
    bold: { tone: 'bold', t: T('"Dance with me for one song and I\'ll leave you alone?"', '«¿Bailas conmigo una canción y te dejo en paz?»', '«Dança comigo uma música e eu te deixo em paz?»'), call: 'hostile_gamble', next: null, free: true },
    blunt: { tone: 'blunt', t: T('"I\'m asking for a gap. It\'s a nightclub."', '«Pido un hueco. Es un club».', '«Tô pedindo uma brecha. É um club».'), do: { soc: -3, weird: 3, bad: 1 }, next: 'esc', bad: true },
    water: { tone: 'care', t: T('Offer them your water. "You look like you need this more than I do."', 'Ofrecerles tu agua. «Parece que la necesitas más que yo».', 'Oferecer sua água. «Parece que você precisa mais do que eu».'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1 }, call: 'hostile_ok', next: null, react: T('They look at the bottle like it is a foreign object, drink half in one pull, and say, in a completely different voice: "…oh. Sorry. It\'s been a long night." They move.', 'Miran la botella como si fuera un objeto extranjero, toman la mitad de un trago y dicen, con una voz completamente distinta: «…ay. Perdón. Fue una noche larga». Se mueven.', 'Eles olham a garrafa como se fosse um objeto estrangeiro, bebem metade num gole e dizem, com uma voz completamente diferente: «…ai. Desculpa. Foi uma noite longa». Eles saem do caminho.') }
  };
  /* Each opener is a different grievance, so the same five answers cost and pay differently.
     kind 0: the square metre. 1: THE PART. 2: my spot. 3: drunk and baiting. */
  function hch(kind) {
    const o = Object.assign({}, HCH);
    o.sorry = Object.assign({}, HCH.sorry, [
      { do: { soc: -2 } },
      { do: { soc: -3, weird: 1 }, react: T('They do not open their eyes. "You did it again." You go around, quieter.', 'No abren los ojos. «Lo hiciste otra vez». Das la vuelta, más callado.', 'Eles não abrem os olhos. «Você fez de novo». Você dá a volta, mais quieto.') },
      {},
      { do: { soc: -1 }, call: undefined, next: 'esc', react: T('"Sorry." They say it back to you in your own voice. "Sorry. Sorry." Somebody lifts a phone.', '«Perdón». Te lo repiten con tu propia voz. «Perdón. Perdón». Alguien levanta un celular.', '«Desculpa». Eles repetem na sua própria voz. «Desculpa. Desculpa». Alguém levanta um celular.') }
    ][kind]);
    o.chill = Object.assign({}, HCH.chill, [
      { do: { time: 4 } },
      { do: { time: 8, fun: 2 }, react: T('You wait through THE PART with them, eyes shut, until the drop lands. For eight minutes it is the only room in the world.', 'Esperas LA PARTE con ellos, ojos cerrados, hasta que cae el drop. Durante ocho minutos es el único lugar del mundo.', 'Você espera A PARTE com eles, olhos fechados, até o drop cair. Por oito minutos é o único lugar do mundo.') },
      { do: { time: 6 }, react: T('You take the long way round their spot. It takes a while. The spot does not notice.', 'Das la vuelta larga a su lugar. Tarda. El lugar no se da cuenta.', 'Você dá a volta longa no lugar deles. Demora. O lugar nem percebe.') },
      { do: { time: 4 }, react: T('You stand still and study your shoes. They get bored before you do.', 'Te quedas quieto mirando tus zapatos. Se aburren antes que tú.', 'Você fica parado olhando os sapatos. Eles enjoam antes de você.') }
    ][kind]);
    o.water = Object.assign({}, HCH.water, [
      {},
      { do: { item: { water: -1 } }, react: T('They drink without opening their eyes and hand it back. It was not the water they wanted. They shift anyway, to be rid of you.', 'Toman sin abrir los ojos y te la devuelven. No era agua lo que querían. Se mueven igual, para sacarte de encima.', 'Eles bebem sem abrir os olhos e devolvem. Não era água que queriam. Mesmo assim saem do lugar, pra se livrar de você.') },
      { do: { item: { water: -1 } }, react: T('"I\'m not thirsty. I\'m located." They sip anyway and move one step, as a favour.', '«No tengo sed. Estoy ubicado». Toman igual y se mueven un paso, como favor.', '«Não tô com sede. Tô posicionado». Eles bebem mesmo assim e dão um passo, como favor.') },
      {}
    ][kind]);
    return [o.sorry, o.chill, o.bold, o.blunt, o.water];
  }
  function hostile(kind, line) {
    D['hostile_' + kind] = {
      who: 'hostile', role: T('YOU ASKED THEM TO MOVE', 'LES PEDISTE QUE SE MOVIERAN', 'VOCÊ PEDIU PRA ELES SE MOVEREM'), start: 'a', nodes: {
        a: { text: line, choices: hch(kind) },
        esc: {
          text: kind === 3 ? T('They square up. "Sorry. SORRY. Louder." The three people around them stop dancing to watch. Somebody films.', 'Se plantan frente a ti. «Perdón. PERDÓN. Más fuerte». Las tres personas a su alrededor dejan de bailar para mirar. Alguien filma.', 'Eles se plantam na sua frente. «Desculpa. DESCULPA. Mais alto». As três pessoas em volta param de dançar pra olhar. Alguém filma.') : T('They square up. The three people around them stop dancing to watch. "Oh, NOW it\'s a nightclub." Somebody films. Somebody else says "ey, ey, ey."', 'Se plantan frente a ti. Las tres personas a su alrededor dejan de bailar para mirar. «Ah, AHORA es un club». Alguien filma. Otra persona dice «ey, ey, ey».', 'Eles se plantam na sua frente. As três pessoas em volta param de dançar pra olhar. «Ah, AGORA é um club». Alguém filma. Outra pessoa diz «ei, ei, ei».'),
          choices: [
            { tone: 'sorry', t: T('"You\'re right. I was rude. I\'m sorry. Truly."', '«Tienes razón. Fui grosero. Perdón. De verdad».', '«Você tem razão. Fui grosseiro. Desculpa. De verdade».'), do: { soc: -2, weird: -1 }, call: 'hostile_ok', next: null, react: T('The air goes out of them. "…Whatever. Go." The people around them resume dancing as if nothing happened.', 'Se les va el aire. «…Da igual. Pasa». Las personas alrededor vuelven a bailar como si nada.', 'O ar sai deles. «…Tanto faz. Vai». As pessoas em volta voltam a dançar como se nada tivesse acontecido.') },
            { tone: 'push', t: T('Shove them out of the way.', 'Empujarlos para pasar.', 'Empurrar pra passar.'), do: { weird: 12, hp: -5, soc: -4, bad: 2, flag: 'shoved_dancer' }, call: 'hostile_ok', next: null, bad: true, react: T('It works for exactly one second. Then somebody shoves back, somebody shouts for security, and you leave through the gap with your ribs ringing and your name in a very small book.', 'Funciona exactamente un segundo. Luego alguien empuja de vuelta, alguien grita por seguridad, y sales por el hueco con las costillas zumbando y tu nombre en un libro muy pequeño.', 'Funciona por exatamente um segundo. Depois alguém empurra de volta, alguém grita pela segurança, e você sai pela brecha com as costelas zunindo e seu nome num livro bem pequeno.') },
            { tone: 'silent', t: T('Back away with your hands up. Find another route.', 'Retroceder con las manos arriba. Buscar otra ruta.', 'Recuar com as mãos pra cima. Procurar outra rota.'), do: { soc: -2, weird: 1 }, next: null }
          ]
        }
      }
    };
  }
  hostile(0, T('"Excuse YOU. I paid. You paid. Same square metre." A shoulder rises to meet yours.', '«Con permiso TÚ. Yo pagué. Tú pagaste. El mismo metro cuadrado». Un hombro sube a recibir el tuyo.', '«Com licença VOCÊ. Eu paguei. Você pagou. O mesmo metro quadrado». Um ombro sobe pra encontrar o seu.'));
  hostile(1, T('"You said excuse me during THE PART. Eleven minutes I\'ve waited for this." Eyes shut again.', '«Dijiste con permiso durante LA PARTE. Llevo once minutos esperándola». Ojos cerrados otra vez.', '«Você disse com licença durante A PARTE. Faz onze minutos que eu espero». Olhos fechados de novo.'));
  hostile(2, T('"I\'ve been here since eleven. This is my spot." They plant their feet like they misread a book on boundaries.', '«Llevo aquí desde las once. Este es mi lugar». Plantan los pies como quien entendió mal un libro sobre límites.', '«Tô aqui desde as onze. Esse é o meu lugar». Plantam os pés como quem entendeu errado um livro sobre limites.'));
  hostile(3, T('"Polite. You think you\'re better than me? Say it again." The glass tilts like physics is optional.', '«Educado. ¿Te crees mejor que yo? Dilo otra vez». El vaso se inclina como si la física fuera opcional.', '«Educado. Você se acha melhor que eu? Fala de novo». O copo inclina como se a física fosse opcional.'));
  S.hostile_ok = function () { const h = EM.state.hostile; if (h) E.settle(h.id); };
  S.hostile_gamble = function (ctx) {
    const h = EM.state.hostile;
    /* the part-lover is easier to dance with, the drunk one is not */
    const hk = parseInt(String(ctx && ctx.dialogue || '').replace('hostile_', ''), 10);
    const odds = hk === 1 ? 0.70 : hk === 3 ? 0.35 : 0.55;
    const ok = Math.random() < odds || L.hasFriend('dani');
    if (h) E.settle(h.id);
    if (ok) {
      L.apply({ fun: 4, soc: 1 });
      U.toast({ icon: 'star', text: T('They stare at you. Then they laugh, loudly, and spin you once. "One song." You dance for a bar and a half and slip through, grinning.', 'Te miran fijo. Luego se ríen, fuerte, y te giran una vez. «Una canción». Bailas compás y medio y te cuelas, sonriendo.', 'Eles te encaram. Depois riem, alto, e giram você uma vez. «Uma música». Você dança um compasso e meio e passa, sorrindo.'), kind: 'good', ms: 5200 });
    } else {
      L.apply({ weird: 3, soc: -3, bad: 1 });
      U.toast({ text: T(`"Absolutely not." A shut face. Somebody nearby snickers. You go around, face hot.`, `«Absolutamente no». Una cara cerrada. Alguien cerca se ríe por lo bajo. Das la vuelta, con la cara caliente.`, `«De jeito nenhum». Um rosto fechado. Alguém por perto dá risada. Você dá a volta, com o rosto quente.`), kind: 'bad', ms: 5200 });
    }
  };

  /* ============================================================ THE DARK ROOM: BLIND, WITH SUBTLE CUES */
  Z.darkroom.cues = [
    { x: 11.5, y: 14.5, r: 3, icon: 'door', text: T('A quiet voice near the curtain. Someone leaning on a doorframe, calm. A lanyard ticks against a belt buckle.', 'Una voz tranquila junto a la cortina. Alguien apoyado en un marco, sereno. Una credencial golpea suave contra una hebilla.', 'Uma voz calma perto da cortina. Alguém encostado num batente, sereno. Um crachá bate de leve numa fivela.') },
    { x: 13.5, y: 16.5, r: 2.5, icon: 'door', text: T('A thread of warm light under heavy cloth. Behind you, the way out.', 'Un hilo de luz tibia bajo una tela pesada. Detrás de ti, la salida.', 'Um fio de luz morna sob um tecido pesado. Atrás de você, a saída.') },
    { x: 9, y: 11.5, r: 3.2, icon: 'heart', text: T('Velvet under your fingers. The low, unhurried sounds of two people with all the time in the world.', 'Terciopelo bajo tus dedos. Los sonidos bajos y sin prisa de dos personas con todo el tiempo del mundo.', 'Veludo sob seus dedos. Os sons baixos e sem pressa de duas pessoas com todo o tempo do mundo.') },
    { x: 19, y: 5.5, r: 4.5, icon: 'spark', text: T('Warm air. Breathing in a rhythm of three. Something sweet in the dark: grapes.', 'Aire tibio. Respiración en un ritmo de tres. Algo dulce en la oscuridad: uvas.', 'Ar morno. Respiração num ritmo de três. Algo doce no escuro: uvas.') },
    { x: 4, y: 13.5, r: 2.6, icon: 'sweat', text: T('A small, tight breath by the wall. Someone trying to take up less space than they have.', 'Una respiración pequeña y tensa junto a la pared. Alguien tratando de ocupar menos espacio del que tiene.', 'Uma respiração pequena e tensa perto da parede. Alguém tentando ocupar menos espaço do que tem.') },
    { x: 3, y: 4.5, r: 3, icon: 'zzz', text: T('An empty couch. Old leather, somebody\'s quiet afternoon. A place to sit and let your eyes learn the dark.', 'Un sofá vacío. Cuero viejo, la tarde tranquila de alguien. Un lugar para sentarse y dejar que los ojos aprendan la oscuridad.', 'Um sofá vazio. Couro velho, a tarde tranquila de alguém. Um lugar pra sentar e deixar os olhos aprenderem o escuro.') },
    { x: 6.5, y: 6.5, r: 5, icon: 'hug', text: T('A laugh you know. A hug that smells like mesh and sunglasses. That is Benja.', 'Una risa que conoces. Un abrazo que huele a malla y a lentes. Eso es Benja.', 'Uma risada que você conhece. Um abraço que cheira a tela e óculos. Esse é o Benja.'), when: function (s) { return s.away.dani === 'darkroom'; } }
  ];
  Z.darkroom.obj({ id: 'rest_dr', kind: 'rest', x: 2, y: 4, w: 3, h: 1, label: T('SIT ON THE COUCH', 'SENTARSE EN EL SOFÁ', 'SENTAR NO SOFÁ') });
  S.enter_darkroom = function () {
    const s = EM.state;
    if (!s.flags.dark_first) {
      s.flags.dark_first = true;
      U.toast({ icon: 'eyes', text: T('You cannot see here. Press Z to REACH OUT: the room answers for a moment. Listen: sounds come from the left or the right. Ask before you touch anyone.', 'Aquí no ves. Presiona Z para EXTENDER LA MANO: la sala responde un momento. Escucha: los sonidos vienen de la izquierda o de la derecha. Pregunta antes de tocar a alguien.', 'Aqui você não enxerga. Aperte Z para ESTENDER A MÃO: a sala responde por um momento. Escute: os sons vêm da esquerda ou da direita. Pergunte antes de tocar em alguém.'), kind: 'info', ms: 9000 });
    }
    if (!s.flags.dario_met) { s.flags.dario_met = true; U.startDialogue('dario', { npc: 'dario' }); }
  };
  D.dario.nodes.a.text = [].concat(D.dario.nodes.a.text, [
    T('"One more thing. It is dark on purpose, and I will not fix that. Reach out with your hand before you step. Listen for left and right. Velvet is a couch, warm air is people, cool air is the way out. If you touch someone by accident, say sorry, then say it again."', '«Una cosa más. Es oscuro a propósito y no lo voy a arreglar. Extiende la mano antes de dar un paso. Escucha izquierda y derecha. Terciopelo es un sofá, aire tibio son personas, aire fresco es la salida. Si tocas a alguien sin querer, pide perdón, y luego otra vez».', '«Mais uma coisa. É escuro de propósito e eu não vou consertar isso. Estenda a mão antes de dar um passo. Escute esquerda e direita. Veludo é sofá, ar morno é gente, ar fresco é a saída. Se você encostar em alguém sem querer, peça desculpa, e depois peça de novo».')
  ]);

  /* ============================================================ THE NIGHT COLLAPSES */
  S.fed_up = function () { U.startDialogue('fed_up', { npc: 'maru' }); };
  D.fed_up = {
    forced: true, who: 'maru', after: 'end_fedup', start: 'a', nodes: {
      a: {
        branch: [
          { req: function (s) { return s.party.length > 0; }, to: 'group' },
          { req: function () { return true; }, to: 'alone' }
        ]
      },
      group: {
        text: [
          T(`Luisa says your name softly. "I love you. I can't do this tonight."`, `Luisa dice tu nombre bajito. «Te quiero. No puedo con esto esta noche».`, `A Luisa diz seu nome baixinho. «Eu te amo. Eu não consigo com isso hoje».`),
          T('Benja looks at his shoes. Feña has already put his hood up. Nobody shouts. They go out through the foyer, in a line, with the dignity of people leaving a theatre. Luisa looks back once, and her face says: call me when you are yourself again.', 'Benja mira sus zapatos. Feña ya se puso la capucha. Nadie grita. Salen por el foyer, en fila, con la dignidad de quienes dejan un teatro. Luisa mira atrás una vez, y su cara dice: llámame cuando vuelvas a ser tú.', 'O Benja olha pros sapatos. O Feña já pôs o capuz. Ninguém grita. Eles saem pelo foyer, em fila, com a dignidade de quem deixa um teatro. A Luisa olha pra trás uma vez, e o rosto dela diz: me liga quando você voltar a ser você.')
        ]
      },
      alone: {
        text: T('Your phone buzzes in your pocket. LUISA: "we left. we love you. call me when you\'re yourself again." BENJA: "( ◡̀_◡́)ᕤ i am sorry and also not sorry." FEÑA: "get home safe."', 'Tu celular vibra en el bolsillo. LUISA: «nos fuimos. te queremos. llámame cuando vuelvas a ser tú». BENJA: «( ◡̀_◡́)ᕤ perdón y tampoco perdón». FEÑA: «llega bien a casa».', 'Seu celular vibra no bolso. LUISA: «a gente foi. a gente te ama. me liga quando você voltar a ser você». BENJA: «( ◡̀_◡́)ᕤ desculpa e também não desculpa». FEÑA: «chega bem em casa».')
      }
    }
  };
  S.end_fedup = function () { L.end('fedup'); };

  /* ============================================================ BEGINNING AGAIN */
  D.intro.nodes.start = { branch: [{ req: function (s) { return s.attempt > 1; }, to: 'again' }, { req: function () { return true; }, to: 'a' }] };
  D.intro.start = 'start';
  D.intro.nodes.again = {
    text: [
      T('22:00. LA GRIETA. A line of people under a neon crack in the wall. You have been here before. The door, the queue, the shoes: all exactly where you left them. Something in your hands remembers the night, the way a body remembers stairs in the dark.', '22:00. LA GRIETA. Una fila de gente bajo una grieta de neón en la pared. Ya estuviste aquí. La puerta, la fila, los zapatos: todo exactamente donde lo dejaste. Algo en tus manos recuerda la noche, como el cuerpo recuerda escaleras en la oscuridad.', '22:00. LA GRIETA. Uma fila de gente sob uma rachadura de neon na parede. Você já esteve aqui. A porta, a fila, os sapatos: tudo exatamente onde você deixou. Algo nas suas mãos lembra da noite, do jeito que o corpo lembra de degraus no escuro.')
    ],
    next: 'a'
  };
  D.intro.after = 'show_lessons';
  S.show_lessons = function () {
    const s = EM.state;
    (s.lessons || []).slice(-3).forEach(function (l, i) { setTimeout(function () { U.toast({ icon: 'question', text: l, kind: 'info', ms: 7500 }); }, 500 + i * 900); });
  };
  /* Dragan remembers, a little */
  D.dragan.nodes.start = { branch: [{ req: function (s) { return s.attempt > 1; }, to: 'again' }, { req: function () { return true; }, to: 'a' }] };
  D.dragan.start = 'start';
  D.dragan.nodes.again = {
    text: T('He looks at you for a beat too long. "You again." He frowns. "Strange. I don\'t know why I said that." He taps the clipboard twice. "Name?"', 'Te mira un segundo de más. «Tú otra vez». Frunce el ceño. «Qué raro. No sé por qué dije eso». Golpea la carpeta dos veces. «¿Nombre?»', 'Ele te olha um segundo a mais. «Você de novo». Franze a testa. «Estranho. Não sei por que eu disse isso». Bate na prancheta duas vezes. «Nome?»'),
    next: 'a'
  };

  /* ============================================================ MORE ENDINGS FLAGS */
  EM.ENDINGS.banned.reset = true;
  EM.ENDINGS.banned.lesson = T('Last time, security walked you out. Weirdness climbs faster when you push, shove, film, or lie.', 'La última vez, seguridad te sacó. La rareza sube más rápido cuando empujas, filmas o mientes.', 'Da última vez, a segurança te levou pra fora. A estranheza sobe mais rápido quando você empurra, filma ou mente.');
  EM.ENDINGS.ambulance.reset = true;
  EM.ENDINGS.ambulance.lesson = T('Last time you passed out twice. Water, a seat and the quiet room are free.', 'La última vez te desmayaste dos veces. El agua, un asiento y la sala tranquila son gratis.', 'Da última vez você apagou duas vezes. Água, um lugar pra sentar e a sala de calma são de graça.');
  EM.ENDINGS.fedup = {
    art: 'road', music: 'chill', lp: 800, reset: true,
    title: T('EVERYONE LEFT AT FOUR', 'TODOS SE FUERON A LAS CUATRO', 'TODO MUNDO FOI EMBORA ÀS QUATRO'),
    lesson: T('Last time your friends left. The night is long; goodwill is not.', 'La última vez tus amigos se fueron. La noche es larga; la buena voluntad no.', 'Da última vez seus amigos foram embora. A noite é longa; a boa vontade não é.'),
    text: [
      T('Nobody raised their voice. Over three hours you spent more goodwill than the night could print, and at four in the morning the people who love you looked at the account and found it empty.', 'Nadie levantó la voz. En tres horas gastaste más buena voluntad de la que la noche podía imprimir, y a las cuatro de la mañana las personas que te quieren miraron la cuenta y la encontraron vacía.', 'Ninguém levantou a voz. Em três horas você gastou mais boa vontade do que a noite podia imprimir, e às quatro da manhã as pessoas que te amam olharam a conta e encontraram vazia.'),
      T(`You stand on the pavement outside LA GRIETA watching a taxi light turn the corner with three of the people you love in it. The neon crack buzzes behind you. It is a long time until morning. It is also, somehow, 22:00.`, `Estás en la acera afuera de LA GRIETA viendo cómo una luz de taxi dobla la esquina con tres de las personas que quieres adentro. La grieta de neón zumba detrás de ti. Falta mucho para la mañana. Y también, de algún modo, son las 22:00.`, `Você está na calçada fora da LA GRIETA vendo a luz de um táxi dobrar a esquina com três das pessoas que você ama dentro. A rachadura de neon zumbe atrás de você. Falta muito pra manhã. E também, de algum jeito, são 22:00.`)
    ]
  };

})();

/* ---- consolidated from story_v4.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;

  /* ============================================================ THE WHITE POWDERS */
  /* Two white powders look the same in the dark. Whatever you were told, about one time in five it is the other one. */
  function takePowder(told) {
    const swap = Math.random() < 0.2;
    L.dealerHeat();
    story.applyPowder(swap ? (told === 'coke' ? 'ket' : 'coke') : told, told);
  }
  /* what actually happens: used by dealers and by things you bought and carried */
  story.applyPowder = function (real, told) {
    const s = EM.state;
    const swap = real !== told;
    s.flags['told_' + told] = true;
    if (swap) s.flags.powder_mixup = true;
    s.impaired = s.impaired || real === 'ket';
    if (real === 'coke') {
      L.apply({ fx: 'coke', fun: 6, hp: -2, weird: 2, time: 3, flag: 'took_coke' });
      U.toast({ icon: 'spark', text: T('A bitter drip down the back of your throat. Your teeth go numb and every thought arrives under its own spotlight. Your head is clear and fast, and dancing is going to cost you.', 'Un goteo amargo por el fondo de la garganta. Los dientes se te duermen y cada pensamiento llega con su propio reflector. Tienes la cabeza clara y rápida, y bailar te va a costar.', 'Um gotejar amargo no fundo da garganta. Os dentes ficam dormentes e cada pensamento chega com seu próprio holofote. Sua cabeça fica clara e rápida, e dançar vai te custar.'), kind: 'info', ms: 7000 });
    } else if (Math.random() < 0.5) {
      L.apply({ flag: ['took_ket', 'ket_faint'], time: 3 });
      s.pendingFaint = s.time + 3 + Math.floor(Math.random() * 3);
      s.pendingFaintKind = 'ket';
      U.toast({ icon: 'zzz', text: T(`Your hands arrive late. The floor starts doing a gentle impression of a wall. You should sit down. You should have sat down a minute ago.`, `Tus manos llegan tarde. El piso empieza a hacer una imitación suave de una pared. Deberías sentarte. Deberías haberte sentado hace un minuto.`, `Suas mãos chegam atrasadas. O chão começa a fazer uma imitação suave de uma parede. Você devia sentar. Devia ter sentado um minuto atrás.`), kind: 'bad', ms: 6000 });
    } else {
      L.apply({ fx: 'ket', fun: 12, soc: 14, weird: 3, time: 3, flag: ['took_ket', 'ket_ok'] });
      U.toast({ icon: 'heart', text: T('The room goes soft and kind. Everyone\'s sentences have beautiful edges. Talking to people is suddenly very easy. Things you say land. The floor is a nice distance away.', 'El cuarto se vuelve suave y amable. Las frases de todos tienen bordes hermosos. Hablar con la gente es de pronto muy fácil. Lo que dices cae bien. El piso está a una distancia agradable.', 'A sala fica macia e gentil. As frases de todo mundo têm bordas lindas. Conversar com as pessoas de repente é muito fácil. O que você diz cai bem. O chão está a uma distância agradável.'), kind: 'good', ms: 7000 });
    }
    if (swap) setTimeout(function () {
      U.toast({ icon: 'question', text: T('…that was not what you were told it was. Two white powders look exactly alike in the dark.', '…eso no era lo que te dijeron que era. Dos polvos blancos se ven exactamente iguales en la oscuridad.', '…isso não era o que te disseram que era. Dois pós brancos são exatamente iguais no escuro.'), kind: 'info', ms: 6500 });
    }, 2500);
  };
  S.powder_coke = function () { takePowder('coke'); };
  S.powder_ket = function () { takePowder('ket'); };

  /* other people offer, too */
  function offer(dlg, node, choice) {
    const n = D[dlg] && D[dlg].nodes[node];
    if (n) n.choices = (n.choices || []).concat([choice]);
  }
  offer('rico', 'what', { tone: 'bold', t: T('"What\'s in the little bag?"', '«¿Qué hay en la bolsita?»', '«O que tem no saquinho?»'), req: { no: 'rico_powder' }, do: { flag: 'rico_powder' }, call: 'powder_ket', next: null, react: T(`"K. For the back. Or the soul. Whichever hurts." He taps a small mound onto the back of your hand.`, `«K. Para la espalda. O para el alma. Lo que duela más». Te deja un montoncito en el dorso de la mano.`, `«K. Pra coluna. Ou pra alma. O que doer mais». Ele deixa um montinho no dorso da sua mão.`) });
  offer('hugo', 'a', { tone: 'bold', t: T('He taps a little tin on his belt. "…Is that what I think it is?"', 'Golpea una latita en su cinturón. «…¿Eso es lo que pienso?»', 'Ele bate numa latinha no cinto. «…Isso é o que eu tô pensando?»'), req: { no: 'hugo_powder' }, do: { flag: 'hugo_powder', rep: 0 }, call: 'powder_coke', next: null, react: T('"Ninety-four," Hugo says, very gravely. "The good old recipe." He is, you suspect, an unreliable narrator of his own tin.', '«Noventa y cuatro», dice Hugo, muy grave. «La receta de antes». Sospechas que es un narrador poco confiable de su propia latita.', '«Noventa e quatro», diz o Hugo, muito grave. «A receita de antigamente». Você suspeita que ele seja um narrador pouco confiável da própria latinha.') });

  /* ============================================================ HOSTILE DANCERS: EVERYTHING HAS A PRICE */
  function patch(id, k, extra) { const c = D[id] && D[id].nodes; if (!c) return; }
  ['hostile_0', 'hostile_1', 'hostile_2', 'hostile_3'].forEach(function (id) {
    const a = D[id].nodes.a.choices, esc = D[id].nodes.esc.choices;
    a.forEach(function (c) {
      if (c.tone === 'sorry') { c.do = Object.assign({}, c.do, { time: 2, rep: -0.3, hp: -1, pb: { tato: 1 }, flag: 'hostile_kind' }); }
      else if (c.tone === 'chill') { c.do = Object.assign({}, c.do, { rep: -0.6, pb: { tato: 1 }, flag: 'hostile_kind' }); }
      else if (c.tone === 'blunt') { c.do = Object.assign({}, c.do, { rep: 0.5, pb: { maru: -1, tato: -1 }, flag: 'hostile_rude' }); }
      else if (c.tone === 'care') { c.do = Object.assign({}, c.do, c.do && c.do.care ? { rep: -1.2, pb: { maru: 1, dani: 1, tato: 1 }, flag: 'hostile_kind' } : { rep: -0.2, flag: 'hostile_kind' }); } /* a sip they did not need earns only a nod */
    });
    esc.forEach(function (c) {
      if (c.tone === 'sorry') { c.do = Object.assign({}, c.do, { rep: -0.3, time: 3, pb: { tato: 1 }, flag: 'hostile_kind' }); }
      else if (c.tone === 'push') { c.do = Object.assign({}, c.do, { rep: 2, pb: { tato: -2, dani: -1, maru: -1 }, flag: ['hostile_rude', 'sec_noted'] }); }
      else if (c.tone === 'silent') { c.do = Object.assign({}, c.do, { rep: 0.2, time: 4, hp: -1 }); }
    });
  });
  const oldGamble = S.hostile_gamble;
  S.hostile_gamble = function () {
    const before = EM.state.stats.fun;
    oldGamble();
    const s = EM.state;
    if (s.stats.fun > before) { L.rep(-1); s.flags.hostile_kind = true; L.apply({ pb: { dani: 1 } }); }
    else { L.rep(1); s.flags.hostile_rude = true; L.apply({ pb: { tato: -1 } }); }
  };

  /* ============================================================ RUNNING GAGS THAT ESCALATE */
  /* addGag(dialogue, node, key, lines): from the 2nd time (across all nights) a new line is appended. */
  function addGag(dlg, node, key, lines) {
    const n = D[dlg] && D[dlg].nodes[node]; if (!n) return;
    const orig = [].concat(n.text || []);
    const base = n.text;
    n.text = function (s) {
      const lvl = (s.gags && s.gags[key]) || 0;
      const base2 = typeof base === 'function' ? [].concat(base(s)) : orig;
      return lvl >= 2 ? base2.concat([lines[Math.min(lvl - 2, lines.length - 1)]]) : base2;
    };
    n.do = Object.assign({}, n.do, { gag: key });
  }
  story.gagLevel = function (s, k) { return (s.gags && s.gags[k]) || 0; };

  addGag('resident', 'a', 'ae', [
    T('ÆRIEL squints. "Hold on. We\'ve met. I\'d remember, but I never remember. I put you on a list anyway, under \'seems familiar\'."', 'ÆRIEL entrecierra los ojos. «Espera. Ya nos conocemos. Me acordaría, pero yo nunca me acuerdo. De todos modos te puse en una lista, bajo “me suena”».', 'ÆRIEL aperta os olhos. «Peraí. A gente já se conheceu. Eu lembraria, mas eu nunca lembro. Te coloquei numa lista mesmo assim, em “parece familiar”».'),
    T('"Third time. The list now has a list of people who keep finding me. You are item three. Item one is a raccoon. We do not talk about the raccoon."', '«Tercera vez. La lista ahora tiene una lista de gente que sigue encontrándome. Eres el número tres. El uno es un mapache. No hablamos del mapache».', '«Terceira vez. A lista agora tem uma lista de gente que não para de me encontrar. Você é o item três. O item um é um guaxinim. A gente não fala do guaxinim».'),
    T('"Fourth. I formed a committee to decide whether you count as a regular. The committee is me wearing a different hat. The hat has a logo."', '«Cuarta. Formé un comité para decidir si cuentas como habitual. El comité soy yo con otro sombrero. El sombrero tiene logo».', '«Quarta. Montei um comitê pra decidir se você conta como frequentador. O comitê sou eu com outro chapéu. O chapéu tem logo».'),
    T('"Fifth. Æ000.X has no loyalty programme. I\'m starting one. The reward is that I do not make you fill in the form."', '«Quinta. Æ000.X no tiene programa de lealtad. Voy a crear uno. El premio es que no te hago llenar el formulario».', '«Quinta. A Æ000.X não tem programa de fidelidade. Vou criar um. O prêmio é eu não te fazer preencher o formulário».'),
    T('"Sixth. I told the spreadsheet about you. The spreadsheet asked for a spreadsheet about you. We are two levels deep and nobody has had water."', '«Sexta. Le conté a la hoja de cálculo sobre ti. La hoja de cálculo pidió una hoja de cálculo sobre ti. Estamos a dos niveles de profundidad y nadie tomó agua».', '«Sexta. Contei da planilha sobre você. A planilha pediu uma planilha sobre você. Estamos dois níveis abaixo e ninguém bebeu água».'),
    T('"Seventh. You\'re in the FAQ now. Question nine: \'Who is that person who keeps coming back?\' Answer: \'Please drink water.\'"', '«Séptima. Ya estás en el FAQ. Pregunta nueve: “¿Quién es esa persona que siempre vuelve?” Respuesta: “Por favor, tome agua”».', '«Sétima. Você já está no FAQ. Pergunta nove: “Quem é essa pessoa que sempre volta?” Resposta: “Por favor, beba água”».'),
    T('"Eighth. I\'ve stopped pretending the door policy is a policy. It is a personality. You\'ve got through it so many times I\'m thinking of asking YOU to run it."', '«Octava. Dejé de fingir que la política de puerta es una política. Es una personalidad. Entraste tantas veces que estoy pensando en pedirte A TI que la manejes».', '«Oitava. Parei de fingir que a política da porta é uma política. É uma personalidade. Você passou tantas vezes que tô pensando em pedir pra VOCÊ cuidar dela».'),
    T(`"Ninth, tenth, I lost count. You know where the water is. Come in. Stay."`, `«Novena, décima, perdí la cuenta. Ya sabes dónde está el agua. Pasa. Quédate».`, `«Nona, décima, perdi a conta. Você já sabe onde fica a água. Entra. Fica».`)
  ]);
  addGag('luca', 'a', 'coat', [
    T(`"Same coat, different night? The dread is still free. Now it has a loyalty card."`, `«¿Mismo abrigo, otra noche? La angustia sigue siendo gratis. Ahora tiene tarjeta de cliente frecuente».`, `«Mesmo casaco, outra noite? A angústia continua de graça. Agora ela tem cartão fidelidade».`),
    T('"I hired a second jacket to supervise the first. The first jacket is not taking it well."', '«Contraté una segunda chaqueta para supervisar a la primera. La primera no lo está tomando bien».', '«Contratei um segundo casaco pra supervisionar o primeiro. O primeiro não tá levando bem».'),
    T('"The coats formed a union. They want an air-conditioned hook. I told them this is Æ000.X, nothing here is air-conditioned, including the hook\'s feelings."', '«Los abrigos formaron un sindicato. Quieren un gancho con aire acondicionado. Les dije que esto es Æ000.X, nada aquí tiene aire acondicionado, incluidos los sentimientos del gancho».', '«Os casacos fundaram um sindicato. Querem um cabide com ar-condicionado. Eu disse que aqui é Æ000.X, nada tem ar-condicionado, nem os sentimentos do cabide».'),
    T(`"The cloakroom has a waiting list now. You are on it. Position one."`, `«El guardarropa ahora tiene lista de espera. Estás en ella. Puesto uno».`, `«A chapelaria agora tem lista de espera. Você está nela. Posição um».`)
  ]);
  addGag('hugo', 'a', 'old', [
    T('"Ninety-four. I know, I know. Last time I said that I added a minute. It\'s ninety-four and a half now."', '«Noventa y cuatro. Ya sé, ya sé. La última vez que lo dije le agregué un minuto. Ahora es noventa y cuatro y medio».', '«Noventa e quatro. Eu sei, eu sei. Da última vez que falei isso acrescentei um minuto. Agora é noventa e quatro e meio».'),
    T('"In ninety-four there was no list. Now there is a list for the list. Back then we called that \'a friend with a flyer\'."', '«En el noventa y cuatro no había lista. Ahora hay una lista para la lista. Antes eso se llamaba “un amigo con un volante”».', '«Em noventa e quatro não tinha lista. Agora tem lista pra lista. Antigamente isso se chamava “um amigo com um flyer”».'),
    T(`"I've been on the list since the list was a napkin. I still have the napkin."`, `«Estoy en la lista desde que la lista era una servilleta. Todavía tengo la servilleta».`, `«Tô na lista desde que a lista era um guardanapo. Ainda tenho o guardanapo».`),
    T('"They made a list of founding members. Four of us. One is the napkin. The napkin did not RSVP."', '«Hicieron una lista de miembros fundadores. Somos cuatro. Uno es la servilleta. La servilleta no confirmó asistencia».', '«Fizeram uma lista dos membros fundadores. Somos quatro. Um é o guardanapo. O guardanapo não confirmou presença».')
  ]);
  /* Dragan, by night count */
  D.dragan.nodes.again.text = function (s) {
    const n = s.attempt || 2;
    if (n <= 2) return T('He looks at you for a beat too long. "You again." He frowns. "Strange. I don\'t know why I said that." He taps the clipboard twice. "Name?"', 'Te mira un segundo de más. «Tú otra vez». Frunce el ceño. «Qué raro. No sé por qué dije eso». Golpea la carpeta dos veces. «¿Nombre?»', 'Ele te olha um segundo a mais. «Você de novo». Franze a testa. «Estranho. Não sei por que eu disse isso». Bate na prancheta duas vezes. «Nome?»');
    if (n === 3) return T('He lowers the clipboard. "Third time tonight. I do not have a third time in my notes. I made a tally on the back. Left column: names. Right column: you." The right column is only you.', 'Baja la carpeta. «Tercera vez esta noche. No tengo una tercera vez en mis notas. Hice un conteo atrás. Columna izquierda: nombres. Columna derecha: tú». La columna derecha eres solo tú.', 'Ele abaixa a prancheta. «Terceira vez esta noite. Não tenho uma terceira vez nas minhas anotações. Fiz uma contagem atrás. Coluna esquerda: nomes. Coluna direita: você». A coluna direita é só você.');
    if (n === 4) return T(`"Fourth. I asked management for the list of people who come back. It's this list. You're on it twice." He seems moved.`, `«Cuarta. Le pedí a la gerencia la lista de la gente que vuelve. Es esta lista. Estás dos veces». Parece conmovido.`, `«Quarta. Pedi pra gerência a lista das pessoas que voltam. É esta lista. Você está nela duas vezes». Ele parece emocionado.`);
    return T('He hands you the clipboard. "I\'m just going to pretend you\'re the one checking me in. Name?" A pause. "…Exactly. This is your door."', 'Te pasa la carpeta. «Voy a fingir que tú eres quien me registra a mí. ¿Nombre?» Una pausa. «…Exacto. Esta es tu puerta».', 'Ele te entrega a prancheta. «Vou fingir que é você quem tá me registrando. Nome?» Uma pausa. «…Exatamente. Essa é a sua porta».');
  };
  /* friends get déjà vu */
  const oldTick = story.tick;
  story.tick = function (dt) {
    oldTick(dt);
    const s = EM.state; if (!s || (s.attempt || 1) < 2 || !s.party.length) return;
    story._dvT = (story._dvT || 60) - dt;
    if (story._dvT > 0) return;
    story._dvT = 70 + Math.random() * 60;
    const lvl = Math.min(4, s.attempt - 1);
    const f = EM.pick(s.party);
    const LINES = {
      maru: [
        T('LUISA: "Weird. I\'ve had this exact thought about the queue before."', 'LUISA: «Qué raro. Ya tuve exactamente este pensamiento sobre la fila».', 'LUISA: «Estranho. Já tive exatamente esse pensamento sobre a fila antes».'),
        T('LUISA: "Have we done this before? Do not answer. I will get sad."', 'LUISA: «¿Ya hicimos esto antes? No contestes. Me voy a poner triste».', 'LUISA: «A gente já fez isso antes? Não responde. Vou ficar triste».'),
        T('LUISA: "I am going to start writing notes to myself on my arm. The note says: believe them."', 'LUISA: «Voy a empezar a escribirme notas en el brazo. La nota dice: créeles».', 'LUISA: «Vou começar a escrever bilhetes pra mim no braço. O bilhete diz: acredita neles».'),
        T('LUISA: "At this point I should just run the door."', 'LUISA: «A estas alturas debería manejar yo la puerta».', 'LUISA: «A essa altura eu devia tocar a porta».')
      ],
      dani: [
        T('BENJA: "Have we done this before? I have the strangest feeling about the toilets."', 'BENJA: «¿Ya hicimos esto antes? Tengo la sensación más rara con los baños».', 'BENJA: «A gente já fez isso antes? Tô com a sensação mais estranha sobre os banheiros».'),
        T('BENJA: "I think I\'ve already hugged that exact person. It was great both times."', 'BENJA: «Creo que ya abracé a esa persona exacta. Estuvo genial las dos veces».', 'BENJA: «Acho que eu já abracei exatamente essa pessoa. Foi ótimo nas duas vezes».'),
        T('BENJA: "Déjà vu is just the universe going: you again! I love that for us."', 'BENJA: «El déjà vu es el universo diciendo: ¡tú otra vez! Eso me encanta para nosotros».', 'BENJA: «Déjà vu é o universo falando: você de novo! Eu amo isso pra nós».'),
        T('BENJA: "Okay but what if it\'s the same night forever and it keeps being good?"', 'BENJA: «Pero ¿y si es la misma noche para siempre y sigue siendo buena?»', 'BENJA: «Mas e se for a mesma noite pra sempre e continuar sendo boa?»')
      ],
      tato: [
        T('FEÑA: "I know I said I\'m fine. I\'m fine in a way that feels rehearsed."', 'FEÑA: «Sé que dije que estoy bien. Estoy bien de una forma que se siente ensayada».', 'FEÑA: «Sei que falei que tô bem. Tô bem de um jeito que parece ensaiado».'),
        T('FEÑA: "Is it weird that I know where the water is?"', 'FEÑA: «¿Es raro que sepa dónde está el agua?»', 'FEÑA: «É estranho eu saber onde tá a água?»'),
        T('FEÑA: "I think the DJ knows us. That\'s not a thing, right?"', 'FEÑA: «Creo que el DJ nos conoce. Eso no es una cosa, ¿verdad?»', 'FEÑA: «Acho que a DJ conhece a gente. Isso não é uma coisa, né?»'),
        T('FEÑA: "Next time I want a different coat. For continuity."', 'FEÑA: «La próxima quiero otra chaqueta. Por continuidad».', 'FEÑA: «Da próxima quero outro casaco. Por continuidade».')
      ]
    };
    const pool = LINES[f]; if (pool) U.toast({ text: pool[lvl - 1], kind: 'bark', ms: 4200 });
  };


  /* ============================================================ THE ILLEGAL RAVE */
  (function () {
    const n = D.intro.nodes.a, orig = [].concat(n.text);
    const RAVE0 = T('LA GRIETA. 23:00. The licence ran out at nine and nobody told the speakers. No door, no list, no guards: a neon crack in the wall, a crowd under it, and you, an hour late. The group chat is a graveyard of "where r u".', 'LA GRIETA. 23:00. La licencia venció a las nueve y nadie se lo dijo a los parlantes. Sin puerta, sin lista, sin guardias: una grieta de neón en la pared, una multitud debajo, y tú, una hora tarde. El chat del grupo es un cementerio de «dónde estás».', 'LA GRIETA. 23:00. A licença venceu às nove e ninguém avisou as caixas de som. Sem porta, sem lista, sem seguranças: uma rachadura de neon na parede, uma multidão embaixo, e você, com uma hora de atraso. O grupo no chat é um cemitério de «cadê você».');
    const RAVE2 = T('Four bars matter: FUN, SOCIAL BATTERY, HEALTH, and WEIRDNESS. There is no security here. Let WEIRDNESS fill up and the crowd closes around you and the night is over. In a crowd, press Z to say EXCUSE ME. It is cheap. It is also a whole philosophy.', 'Cuatro barras importan: DIVERSIÓN, BATERÍA SOCIAL, SALUD y RAREZA. Aquí no hay seguridad. Si la RAREZA se llena, la multitud se cierra a tu alrededor y la noche termina. En una multitud, presiona Z para decir CON PERMISO. Es barato. También es una filosofía entera.', 'Quatro barras importam: DIVERSÃO, BATERIA SOCIAL, SAÚDE e ESTRANHEZA. Aqui não tem segurança. Se a ESTRANHEZA encher, a multidão se fecha em volta de você e a noite acaba. Na multidão, aperte Z para dizer COM LICENÇA. É barato. Também é uma filosofia inteira.');
    n.text = function (s) { return s.venue === 'rave' ? [RAVE0, orig[1], RAVE2] : orig; };
  })();
  EM.ENDINGS.frozenout = {
    art: 'road', music: 'chill', lp: 800, reset: true,
    title: T('THE CROWD CLOSES UP', 'LA MULTITUD SE CIERRA', 'A MULTIDÃO SE FECHA'),
    lesson: T('Last time the crowd closed up. No guards here: your own strangeness is the only door policy.', 'La última vez la multitud se cerró. Aquí no hay guardias: tu propia rareza es la única política de puerta.', 'Da última vez a multidão se fechou. Aqui não tem segurança: a sua própria estranheza é a única política de porta.'),
    text: [
      T('Nobody throws you out, because nobody is in charge. It is simply that the circle around you widens by a step, and then another, and every face turns politely toward the speaker. At the edge of the warehouse a stranger hands you a cup of water without a word.', 'Nadie te echa, porque nadie manda. Es solo que el círculo a tu alrededor se ensancha un paso, y luego otro, y todas las caras se vuelven con cortesía hacia el parlante. En el borde del galpón un desconocido te da un vaso de agua sin decir nada.', 'Ninguém te expulsa, porque ninguém manda. É só que o círculo em volta de você se alarga um passo, e depois outro, e todos os rostos se voltam com educação pro alto-falante. No canto do galpão um estranho te entrega um copo d\'água sem dizer nada.'),
      T(`You walk out under the stars with your friends' footsteps behind you. It is a long time until morning. It is also, somehow, 22:00.`, `Sales bajo las estrellas con los pasos de tus amigos detrás. Falta mucho para la mañana. Y también, de algún modo, son las 22:00.`, `Você sai sob as estrelas com os passos dos seus amigos atrás. Falta muito pra manhã. E também, de algum jeito, são 22:00.`)
    ]
  };

  /* ============================================================ MEMORY: ONLY THE CLEAR-HEADED LEARN */
  /* what to carry into the next night */
  story.memory = function (old, ed) {
    const lessons = (old.lessons || []).slice();
    const mem = { lessons: lessons, forgot: false, recap: [] }; /* a stimulant keeps your head clear: you keep the same lessons a sober person would */
    if (ed && ed.lesson) {
      if (!old.impaired || old.remembers) lessons.push(ed.lesson); else mem.forgot = true;
    }
    return mem;
  };
  S.show_lessons = function () {
    const s = EM.state;
    let i = 0;
    const say = function (txt, kind) { setTimeout(function () { U.toast({ icon: 'question', text: txt, kind: kind || 'info', ms: 7500 }); }, 500 + (i++) * 900); };
    (s.lessons || []).slice(-3).forEach(function (l) { say(l); });
    if (s.forgot) say(T('You wake up with the feeling that something went badly last time. You cannot remember what. It was warm, it was loud, and the details were poured out of you.', 'Despiertas con la sensación de que la última vez salió mal. No recuerdas qué. Fue cálido, fue ruidoso, y los detalles se te escurrieron.', 'Você acorda com a sensação de que da última vez deu errado. Não lembra o quê. Foi quente, foi barulhento, e os detalhes escorreram de você.'), 'bad');
  };
})();

/* EXCUSE ME — story v3: ÆRIEL on the decks (and the Æ000.X jokes), hostile dancers, the blind dark room,
   the night that collapses (hard reset), begin-again memory, posters. */
'use strict';
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
          T('"Allegedly." They take a sip of tea with the dignity of a person who has been recognised in a corridor. "Æ000.X is a party. I say \'curated dancefloor\' the way other people say \'friends\'. Don\'t tell anyone I know how it sounds."', '«Presuntamente». Toma un sorbo de té con la dignidad de quien oyó su propio nombre en un pasillo. «Æ000.X es una fiesta. Yo digo “pista curada” como otra gente dice “amigos”. No le digas a nadie que sé cómo suena».', '«Supostamente». Toma um gole de chá com a dignidade de quem ouviu o próprio nome num corredor. «A Æ000.X é uma festa. Eu digo “pista curada” do jeito que as outras pessoas dizem “amigos”. Não conta pra ninguém que eu sei como isso soa».')
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
        do: { fun: 3, soc: 1, flag: 'ae_list' },
        next: 'ae'
      },
      sheet: {
        text: T('"We read every single one. By \'we\' I mean one very tired person with a spreadsheet and half a sandwich. By \'read\' I mean: I read. I truly read. I read at three in the morning, with feelings." They look at the middle distance. "Somebody once wrote us a poem. We said yes. It was a good poem."', '«Leemos cada una. Por “leemos” quiero decir: una persona muy cansada con una planilla y medio sándwich. Por “leer” quiero decir: leo. De verdad leo. Leo a las tres de la mañana, con sentimientos». Mira un punto lejano. «Una vez nos escribieron un poema. Dijimos que sí. Era un buen poema».', '«A gente lê cada uma. Por “a gente” quero dizer: uma pessoa muito cansada com uma planilha e meio sanduíche. Por “lê” quero dizer: eu leio. Leio de verdade. Leio às três da manhã, com sentimentos». Olha pro vazio. «Uma vez alguém nos mandou um poema. A gente disse sim. Era um bom poema».'),
        do: { fun: 3, soc: 1, flag: 'ae_sheet' },
        next: 'ae'
      },
      rules: {
        text: [
          T('"Rule one: no photos. Rule two: we do not discuss the no-photo rule on the dancefloor. Rule three: drink water. I will know." They lift the thermos like evidence.', '«Regla uno: sin fotos. Regla dos: no discutimos la regla de las fotos en la pista. Regla tres: toma agua. Lo voy a saber». Levanta el termo como evidencia.', '«Regra um: sem fotos. Regra dois: a gente não discute a regra das fotos na pista. Regra três: beba água. Eu vou saber». Levanta a garrafa térmica como prova.'),
          T('"The FAQ is longer than some constitutions. Nobody has ever read it start to finish. I wrote it. I have not read it start to finish." A beat. "We call it sonic inquiry. It is a kick drum. The inquiry is whether you\'ll dance."', '«El FAQ es más largo que algunas constituciones. Nadie lo ha leído de principio a fin. Lo escribí yo. No lo he leído de principio a fin». Un momento. «Lo llamamos indagación sonora. Es un bombo. La indagación es si vas a bailar».', '«O FAQ é maior do que algumas constituições. Ninguém nunca leu do começo ao fim. Fui eu que escrevi. Eu não li do começo ao fim». Um instante. «A gente chama de investigação sonora. É um bumbo. A investigação é se você vai dançar».')
        ],
        do: { fun: 3, soc: 1, flag: 'ae_rules' },
        next: 'ae'
      },
      love: {
        text: T('"Stop. I\'ll cry into my tea." They do not stop looking pleased. "One more secret, since you\'re kind: we take the dancing seriously and ourselves lightly. Mostly. In theory. On good nights."', '«Para. Voy a llorar en mi té». No dejan de verse contentes. «Un secreto más, ya que eres amable: nos tomamos la pista en serio y a nosotros mismos a la ligera. Casi siempre. En teoría. En las buenas noches».', '«Para. Vou chorar no meu chá». Não param de parecer contentes. «Mais um segredo, já que você é gentil: a gente leva a dança a sério e a si mesmo de leve. Quase sempre. Em teoria. Nas boas noites».'),
        do: { soc: 4, fun: 3, flag: 'ae_love' },
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
        text: T('"Noted." ÆRIEL closes their eyes for a second, like someone filing a thing in the most careful drawer. "Go find your people. See you at sunrise. And a vouching is a serious thing. Don\'t set it on fire in the toilets."', '«Anotado». ÆRIEL cierra los ojos un segundo, como quien archiva algo en el cajón más cuidadoso. «Ve a buscar a tu gente. Nos vemos al amanecer. Y avalar a alguien es algo serio. No lo incendies en los baños».', '«Anotado». ÆRIEL fecha os olhos por um segundo, como quem arquiva algo na gaveta mais cuidadosa. «Vai buscar sua galera. A gente se vê no amanhecer. E avalizar alguém é coisa séria. Não incendeia isso nos banheiros».'),
        do: { flag: 'resident_met', fun: 3, soc: 3 }
      }
    }
  };
  EM.CAST.resident.name = 'ÆRIEL';

  /* ============================================================ Æ000.X JOKES ELSEWHERE */
  D.dragan.nodes.a.choices.push({ tone: 'joke', t: T('"I\'m on the list for the list."', '«Estoy en la lista de la lista».', '«Tô na lista da lista».'), next: 'b', do: { fun: 2 }, react: T('"Æ000.X people. Always the list for the list." He writes something down that is probably the weather.', '«Gente de Æ000.X. Siempre la lista de la lista». Anota algo que probablemente es el clima.', '«Gente da Æ000.X. Sempre a lista da lista». Ele anota algo que provavelmente é o tempo.') });
  D.hugo.nodes.a.choices.push({ tone: 'ask', t: T('"Ever been to an Æ000.X?"', '«¿Alguna vez fuiste a una Æ000.X?»', '«Já foi numa Æ000.X?»'), next: 'ae' });
  D.hugo.nodes.ae = {
    text: T('"Once. They made me fill in a form so I could dance. I loved it. I filled it in three languages. The coat check was \'invitation only\' too. I said, I have a coat. They said, we\'re not a coat check, we\'re a trust-based jacket ecosystem." He wipes an eye. "Best night I never expected."', '«Una vez. Me hicieron llenar un formulario para poder bailar. Me encantó. Lo llené en tres idiomas. El guardarropa también era “solo por invitación”. Dije: tengo un abrigo. Dijeron: no somos un guardarropa, somos un ecosistema de abrigos basado en la confianza». Se seca un ojo. «La mejor noche que no esperaba».', '«Uma vez. Me fizeram preencher um formulário pra poder dançar. Eu amei. Preenchi em três idiomas. A chapelaria também era “só por convite”. Eu disse: tenho um casaco. Eles disseram: a gente não é chapelaria, a gente é um ecossistema de casacos baseado em confiança». Ele enxuga um olho. «A melhor noite que eu não esperava».'),
    do: { fun: 4, soc: 2, flag: 'hugo_ae' }
  };
  D.luca.nodes.a.choices.push({ tone: 'joke', t: T('"Is this coat check also invitation only?"', '«¿Este guardarropa también es solo por invitación?»', '«Essa chapelaria também é só por convite?»'), next: 'ae' });
  D.luca.nodes.ae = {
    text: T('"Only at the Æ000.X ones. They call it a trust-based jacket ecosystem. I\'m on the team. It was not my idea. I hang a lot of jackets and pretend it\'s deeply meaningful." He hands you a ticket with a very small flourish. "It is a little meaningful."', '«Solo en las de Æ000.X. Lo llaman un ecosistema de abrigos basado en la confianza. Estoy en el equipo. No fue idea mía. Cuelgo muchos abrigos y finjo que es profundamente significativo». Te da un ticket con un floreo mínimo. «Es un poco significativo».', '«Só nas da Æ000.X. Eles chamam de ecossistema de casacos baseado em confiança. Eu tô na equipe. Não foi ideia minha. Penduro muitos casacos e finjo que é profundamente significativo». Ele te entrega uma ficha com um floreio mínimo. «É um pouquinho significativo».'),
    do: { fun: 3, soc: 1 }
  };
  D.hazel.nodes.a.choices.push({ tone: 'joke', t: T('"Did you ever go to an Æ000.X?"', '«¿Alguna vez fuiste a una Æ000.X?»', '«Você já foi numa Æ000.X?»'), next: 'ae' });
  D.hazel.nodes.ae = {
    text: T('"I got in once." She says it like a confession. "They say \'friction\' and \'sanctuary\' and \'ritual\' and then there is a spreadsheet, and then a kick drum, and then I cried at four a.m. on a stranger\'s shoulder. I hate that I loved it." She does not smile. Her foot is on the beat.', '«Entré una vez». Lo dice como una confesión. «Dicen “fricción” y “santuario” y “ritual” y después hay una planilla, y después un bombo, y después lloré a las cuatro de la mañana en el hombro de un desconocido. Odio haberlo amado». No sonríe. Su pie está al ritmo.', '«Eu entrei uma vez». Ela diz como quem confessa. «Eles dizem “fricção” e “santuário” e “ritual” e depois tem uma planilha, e depois um bumbo, e depois eu chorei às quatro da manhã no ombro de um desconhecido. Odeio ter amado». Ela não sorri. O pé dela tá no tempo.'),
    do: { fun: 4, soc: 1, flag: 'hazel_ae' }
  };

  /* barks about Æ000.X from your friends */
  story.extraBarks = {
    maru: [T('MARU: "I got onto the Æ000.X list once. I told everyone for a month."', 'MARU: «Una vez entré a la lista de Æ000.X. Se lo conté a todo el mundo durante un mes».', 'MARU: «Uma vez entrei na lista da Æ000.X. Contei pra todo mundo por um mês».')],
    dani: [T('DANI: "Æ000.X rejected me twice and I respect it so much."', 'DANI: «Æ000.X me rechazó dos veces y lo respeto muchísimo».', 'DANI: «A Æ000.X me recusou duas vezes e eu respeito demais».')],
    tato: [T('TATO: "I read the Æ000.X FAQ. It cared about me more than my last relationship."', 'TATO: «Leí el FAQ de Æ000.X. Se preocupó más por mí que mi última relación».', 'TATO: «Li o FAQ da Æ000.X. Ele se preocupou mais comigo do que meu último relacionamento».')]
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
          { tone: 'joke', t: T('Mentally request access.', 'Solicitar acceso mentalmente.', 'Solicitar acesso mentalmente.'), do: { fun: 2 }, free: true, next: null, react: T('Form received. You are number 4,812 in a very kind queue. A confirmation email you will never receive arrives in your heart.', 'Formulario recibido. Eres el número 4.812 de una fila muy amable. Un correo de confirmación que nunca recibirás llega a tu corazón.', 'Formulário recebido. Você é o número 4.812 numa fila muito gentil. Um e-mail de confirmação que você nunca vai receber chega ao seu coração.') },
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
        text: T('A flyer zip-tied to the fence. "ÆRIEL // THE CLOSING SET. 06:00. THE ROOF. Curated by ÆRIEL." Someone has drawn a very small, very accurate cat in the corner. Underneath: "ask first. drink water. be kind to Rosa."', 'Un flyer atado a la reja con precintos. «ÆRIEL // EL SET DE CIERRE. 06:00. EL TECHO. Curado por ÆRIEL». Alguien dibujó un gato muy pequeño y muy preciso en la esquina. Debajo: «pregunta primero. toma agua. sé amable con Rosa».', 'Um flyer preso na grade com abraçadeira. «ÆRIEL // O SET DE ENCERRAMENTO. 06:00. O TERRAÇO. Curadoria de ÆRIEL». Alguém desenhou um gato bem pequeno e bem preciso no canto. Embaixo: «pergunte primeiro. beba água. seja gentil com a Rosa».'),
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
  function hostile(kind, line) {
    D['hostile_' + kind] = {
      who: 'hostile', role: T('YOU ASKED THEM TO MOVE', 'LES PEDISTE QUE SE MOVIERAN', 'VOCÊ PEDIU PRA ELES SE MOVEREM'), start: 'a', nodes: {
        a: { text: line, choices: [HCH.sorry, HCH.chill, HCH.bold, HCH.blunt, HCH.water] },
        esc: {
          text: T('They square up. The three people around them stop dancing to watch. "Oh, NOW it\'s a nightclub." Somebody films. Somebody else says "ey, ey, ey."', 'Se plantan frente a ti. Las tres personas a su alrededor dejan de bailar para mirar. «Ah, AHORA es un club». Alguien filma. Otra persona dice «ey, ey, ey».', 'Eles se plantam na sua frente. As três pessoas em volta param de dançar pra olhar. «Ah, AGORA é um club». Alguém filma. Outra pessoa diz «ei, ei, ei».'),
          choices: [
            { tone: 'sorry', t: T('"You\'re right. I was rude. I\'m sorry. Truly."', '«Tienes razón. Fui grosero. Perdón. De verdad».', '«Você tem razão. Fui grosseiro. Desculpa. De verdade».'), do: { soc: -2, weird: -1 }, call: 'hostile_ok', next: null, react: T('The air goes out of them. "…Whatever. Go." The people around them resume dancing as if nothing happened.', 'Se les va el aire. «…Da igual. Pasa». Las personas alrededor vuelven a bailar como si nada.', 'O ar sai deles. «…Tanto faz. Vai». As pessoas em volta voltam a dançar como se nada tivesse acontecido.') },
            { tone: 'push', t: T('Shove them out of the way.', 'Empujarlos para pasar.', 'Empurrar pra passar.'), do: { weird: 12, hp: -5, soc: -4, bad: 2, flag: 'shoved_dancer' }, call: 'hostile_ok', next: null, bad: true, react: T('It works for exactly one second. Then somebody shoves back, somebody shouts for security, and you leave through the gap with your ribs ringing and your name in a very small book.', 'Funciona exactamente un segundo. Luego alguien empuja de vuelta, alguien grita por seguridad, y sales por el hueco con las costillas zumbando y tu nombre en un libro muy pequeño.', 'Funciona por exatamente um segundo. Depois alguém empurra de volta, alguém grita pela segurança, e você sai pela brecha com as costelas zunindo e seu nome num livro bem pequeno.') },
            { tone: 'silent', t: T('Back away with your hands up. Find another route.', 'Retroceder con las manos arriba. Buscar otra ruta.', 'Recuar com as mãos pra cima. Procurar outra rota.'), do: { soc: -2, weird: 1 }, next: null }
          ]
        }
      }
    };
  }
  hostile(0, T('"EXCUSE ME? Excuse YOU. I paid to be here, you paid to be here, and we are both exactly as entitled to this square metre." A shoulder rises to meet yours like a drawbridge.', '«¿CON PERMISO? Con permiso TÚ. Yo pagué para estar aquí, tú pagaste para estar aquí, y los dos tenemos exactamente el mismo derecho a este metro cuadrado». Un hombro sube para recibir el tuyo como un puente levadizo.', '«COM LICENÇA? Com licença VOCÊ. Eu paguei pra estar aqui, você pagou pra estar aqui, e nós dois temos exatamente o mesmo direito a esse metro quadrado». Um ombro sobe pra encontrar o seu como uma ponte levadiça.'));
  hostile(1, T('"Did you just say \'excuse me\' during THE PART? Do you know what you interrupted? This is the part. I have been waiting for this part for eleven minutes." Their eyes are closed again. They are speaking through a trance and a grievance.', '«¿Acabas de decir “con permiso” durante LA PARTE? ¿Sabes lo que interrumpiste? Esta es la parte. Llevo once minutos esperando esta parte». Tienen los ojos cerrados otra vez. Hablan a través de un trance y un agravio.', '«Você acabou de dizer “com licença” durante A PARTE? Sabe o que interrompeu? Essa é a parte. Eu espero essa parte faz onze minutos». Os olhos já estão fechados de novo. Falam através de um transe e de um ressentimento.'));
  hostile(2, T('"I was here first. I\'ve been here since eleven. This is MY spot. I have a feeling about this spot." They have planted their feet like a person who has read a book about boundaries and misunderstood the title.', '«Yo estaba primero. Estoy aquí desde las once. Este es MI lugar. Tengo un presentimiento sobre este lugar». Han plantado los pies como alguien que leyó un libro sobre límites y entendió mal el título.', '«Eu cheguei primeiro. Tô aqui desde as onze. Esse é o MEU lugar. Eu tenho um sentimento sobre esse lugar». Eles plantaram os pés como quem leu um livro sobre limites e entendeu errado o título.'));
  hostile(3, T('"You think you\'re better than me because you\'re POLITE? Say it again. Say it ONE more time." They sway gently, a glass of something at an angle that suggests physics is optional tonight.', '«¿Crees que eres mejor que yo porque eres EDUCADO? Dilo otra vez. Dilo UNA vez más». Se mecen con suavidad, un vaso de algo en un ángulo que sugiere que la física es opcional esta noche.', '«Você acha que é melhor que eu porque é EDUCADO? Fala de novo. Fala MAIS uma vez». Eles balançam de leve, um copo de algo num ângulo que sugere que a física é opcional hoje.'));
  S.hostile_ok = function () { const h = EM.state.hostile; if (h) E.settle(h.id); };
  S.hostile_gamble = function () {
    const h = EM.state.hostile;
    const ok = Math.random() < 0.55 || L.hasFriend('dani');
    if (h) E.settle(h.id);
    if (ok) {
      L.apply({ fun: 4, soc: 1 });
      U.toast({ icon: 'star', text: T('They stare at you. Then they laugh, loudly, and spin you once. "One song." You dance for a bar and a half and slip through, grinning.', 'Te miran fijo. Luego se ríen, fuerte, y te giran una vez. «Una canción». Bailas compás y medio y te cuelas, sonriendo.', 'Eles te encaram. Depois riem, alto, e giram você uma vez. «Uma música». Você dança um compasso e meio e passa, sorrindo.'), kind: 'good', ms: 5200 });
    } else {
      L.apply({ weird: 3, soc: -3, bad: 1 });
      U.toast({ text: T('"Absolutely not." A look like a closed door. Somebody nearby snickers. You go around, face hot.', '«Absolutamente no». Una mirada como una puerta cerrada. Alguien cerca se ríe por lo bajo. Das la vuelta, con la cara caliente.', '«De jeito nenhum». Um olhar como uma porta fechada. Alguém por perto dá risada. Você dá a volta, com o rosto quente.'), kind: 'bad', ms: 5200 });
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
    { x: 6.5, y: 6.5, r: 5, icon: 'hug', text: T('A laugh you know. A hug that smells like mesh and sunglasses. That is Dani.', 'Una risa que conoces. Un abrazo que huele a malla y a lentes. Eso es Dani.', 'Uma risada que você conhece. Um abraço que cheira a tela e óculos. Esse é o Dani.'), when: function (s) { return s.away.dani === 'darkroom'; } }
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
          T('Maru says your name softly, the way you say a name to someone standing near an edge. "I love you. I can\'t do this tonight."', 'Maru dice tu nombre bajito, como se dice un nombre a alguien parado cerca de un borde. «Te quiero. No puedo con esto esta noche».', 'A Maru diz seu nome baixinho, do jeito que se diz um nome pra alguém parado perto de uma beira. «Eu te amo. Eu não consigo com isso hoje».'),
          T('Dani looks at his shoes. Tato has already put his hood up. Nobody shouts. They go out through the foyer, in a line, with the dignity of people leaving a theatre. Maru looks back once, and her face says: call me when you are yourself again.', 'Dani mira sus zapatos. Tato ya se puso la capucha. Nadie grita. Salen por el foyer, en fila, con la dignidad de quienes dejan un teatro. Maru mira atrás una vez, y su cara dice: llámame cuando vuelvas a ser tú.', 'O Dani olha pros sapatos. O Tato já pôs o capuz. Ninguém grita. Eles saem pelo foyer, em fila, com a dignidade de quem deixa um teatro. A Maru olha pra trás uma vez, e o rosto dela diz: me liga quando você voltar a ser você.')
        ]
      },
      alone: {
        text: T('Your phone buzzes in your pocket. MARU: "we left. we love you. call me when you\'re yourself again." DANI: "( ◡̀_◡́)ᕤ i am sorry and also not sorry." TATO: "get home safe."', 'Tu celular vibra en el bolsillo. MARU: «nos fuimos. te queremos. llámame cuando vuelvas a ser tú». DANI: «( ◡̀_◡́)ᕤ perdón y tampoco perdón». TATO: «llega bien a casa».', 'Seu celular vibra no bolso. MARU: «a gente foi. a gente te ama. me liga quando você voltar a ser você». DANI: «( ◡̀_◡́)ᕤ desculpa e também não desculpa». TATO: «chega bem em casa».')
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
      T('You stand on the pavement outside LA GRIETA watching a taxi light turn the corner with three of the people you love in it. The neon crack buzzes behind you. It is a very long time until morning. It is also, somehow, 22:00.', 'Estás en la acera afuera de LA GRIETA viendo cómo una luz de taxi dobla la esquina con tres de las personas que quieres adentro. La grieta de neón zumba detrás de ti. Falta muchísimo para la mañana. Y también, de algún modo, son las 22:00.', 'Você está na calçada fora da LA GRIETA vendo a luz de um táxi dobrar a esquina com três das pessoas que você ama dentro. A rachadura de neon zumbe atrás de você. Falta muito tempo pra manhã. E também, de algum jeito, são 22:00.')
    ]
  };

})();

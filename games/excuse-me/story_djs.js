/* EXCUSE ME — DJs & stylist: FRAMES SHELL, APÜD, Leonidas, and ÆRIEL up close. */
'use strict';
/* ---- consolidated from story_v35.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, S = EM.scripts, D = EM.DIALOGUES;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };
  const LEAVE = function () { return K('chill', t(`Leave it there.`, `Dejarlo ahí.`, `Deixar por aqui.`), { free: true, next: null }); };

  /* ---------------------------------------------------------------- FRAMES SHELL: three questions */
  const FQ = {
    nm: { text: t(`"My name is my name: Marcos Concha is Frames Shell; don't you get it?"`, `«Mi nombre es mi nombre: Marcos Concha es Frames Shell; ¿no lo entiendes?»`, `«Meu nome é o meu nome: Marcos Concha é Frames Shell; não entendeu?»`), choices: [
      K('joke', t(`"Marcos. Concha. Frames. Shell."`, `«Marcos. Concha. Frames. Shell».`, `«Marcos. Concha. Frames. Shell».`), { next: 'nm2' }),
      K('honest', t(`"I don't get it."`, `«No lo entiendo».`, `«Não entendi».`), { next: 'nm3' })
    ] },
    nm2: { text: t(`He points at you with both hands. "There it is. Marcos is frames, concha is shell. Say it in English and it's a DJ name. Say it in Spanish and it's my mother calling me to dinner."`, `Te señala con las dos manos. «Ahí está. Marcos es frames, concha es shell. Dilo en inglés y es un nombre de DJ. Dilo en español y es mi madre llamándome a cenar».`, `Ele aponta pra você com as duas mãos. «Aí está. Marcos é frames, concha é shell. Diga em inglês e é nome de DJ. Diga em espanhol e é minha mãe me chamando pro jantar».`), once: true, do: { soc: 2, fun: 2, flag: 'frames_name' }, next: null },
    nm3: { text: t(`"Marcos: frames. Concha: shell. It's a translation." A satisfied pause. "I'm the only DJ who is his own subtitle."`, `«Marcos: frames. Concha: shell. Es una traducción». Una pausa satisfecha. «Soy el único DJ que es su propio subtítulo».`, `«Marcos: frames. Concha: shell. É uma tradução». Uma pausa satisfeita. «Sou o único DJ que é a própria legenda».`), once: true, do: { soc: 2, fun: 2, flag: 'frames_name' }, next: null },
    dj: { text: t(`"I'm a DJ too. Tonight I'm just helping ÆRIEL. The crate doesn't carry itself."`, `«Yo también soy DJ. Esta noche solo ayudo a ÆRIEL. El cajón no se carga solo».`, `«Eu também sou DJ. Hoje só tô ajudando o ÆRIEL. A caixa não se carrega sozinha».`), choices: [
      K('ask', t(`"How long have you known ÆRIEL?"`, `«¿Hace cuánto conoces a ÆRIEL?»`, `«Faz quanto tempo que você conhece o ÆRIEL?»`), { next: 'dj2' }),
      K('chill', t(`"That's a good friend to be."`, `«Es buena forma de ser amigo».`, `«É um bom jeito de ser amigo».`), { do: { soc: 2 }, next: null })
    ] },
    dj2: { text: t(`"Long enough that saying the number would give away both our ages, and we agreed years ago never to do that." He taps the crate. "Next question."`, `«Lo bastante como para que decir el número delate la edad de los dos, y hace años acordamos no hacerlo jamás». Golpea el cajón. «Siguiente pregunta».`, `«Tempo o bastante pra dizer o número entregar a idade dos dois, e a gente combinou anos atrás de nunca fazer isso». Ele bate na caixa. «Próxima pergunta».`), once: true, do: { soc: 2, flag: 'frames_friends' }, next: null },
    job: { text: [t(`"I am a professional reality show competitor… maybe I'm an influencer… maybe I'm just a psychologist."`, `«Soy un competidor profesional de reality shows… quizá soy influencer… quizá solo soy psicólogo».`, `«Sou um competidor profissional de reality show… talvez eu seja influenciador… talvez seja só psicólogo».`),
      t(`"I can do a few things… but what always stays is being a son of a bitch."`, `«Puedo hacer varias cosas… pero lo que siempre se mantiene es ser un conchadesumadre».`, `«Eu consigo fazer várias coisas… mas o que sempre fica é ser um filho da puta».`)], choices: [
      K('joke', t(`"Which one is it today?"`, `«¿Cuál es hoy?»`, `«Qual é hoje?»`), { next: 'job2' }),
      K('chill', t(`"All three sound exhausting."`, `«Las tres suenan agotadoras».`, `«As três parecem exaustivas».`), { do: { soc: 1 }, next: null })
    ] },
    job2: { text: t(`"Today I'm a man carrying a crate, and that's the only job I'm sure about." A beat. "Ask me again on Tuesday. The answer will have changed."`, `«Hoy soy un hombre cargando un cajón, y es el único trabajo del que estoy seguro». Una pausa. «Pregúntame otra vez el martes. La respuesta habrá cambiado».`, `«Hoje sou um homem carregando uma caixa, e é o único trabalho de que tenho certeza». Uma pausa. «Pergunta de novo na terça. A resposta vai ter mudado».`), once: true, do: { soc: 2, fun: 1, flag: 'frames_job' }, next: null }
  };
  const framesOn = function (id, nodes) {
    const d = D[id]; if (!d) return;
    Object.keys(FQ).forEach(function (k) { d.nodes[k] = FQ[k]; });
    nodes.forEach(function (from) {
      const n = d.nodes[from]; if (!n || !Array.isArray(n.choices)) return;
      if (n.choices.some(function (c) { return c.__fq; })) return;
      [
        K('ask', t(`Ask about his name.`, `Preguntarle por su nombre.`, `Perguntar do nome dele.`), { next: 'nm', __fq: true, do: { time: 2 } }),
        K('ask', t(`"Are you a DJ too?"`, `«¿Tú también eres DJ?»`, `«Você também é DJ?»`), { next: 'dj', __fq: true, do: { time: 2 } }),
        K('ask', t(`"Do you have a day job?"`, `«¿Tienes un trabajo diurno?»`, `«Você tem um trabalho diurno?»`), { next: 'job', __fq: true, do: { time: 2 } })
      ].forEach(function (c) { n.choices.splice(Math.max(0, n.choices.length - 1), 0, c); });
    });
  };
  framesOn('frames', ['meet', 'again']);
  framesOn('frames_attic', ['a', 'again']);
  framesOn('frames_roof_talk', ['a']);
  framesOn('af_cam_frames', ['a']);
  /* FRAMES is he */
  ['They tap the sticker.'].forEach(function () { /* handled in story_v34b.js */ });

  /* ---------------------------------------------------------------- APÜD: three questions + Sala 2 booth + Afterparty care */
  const AQ = {
    dj: { text: t(`"HardBounce. I'm a DJ, same as FRAMES, and tonight I took Sala 2 at 02:30 to help ÆRIEL out. Someone has to keep the floor honest while FRAMES makes speeches about names."`, `«HardBounce. Soy DJ, igual que FRAMES, y esta noche tomé Sala 2 a las 02:30 para ayudar a ÆRIEL. Alguien tiene que mantener honesta la pista mientras FRAMES da discursos sobre nombres».`, `«HardBounce. Sou DJ, que nem o FRAMES, e hoje peguei a Sala 2 às 02:30 pra ajudar o ÆRIEL. Alguém precisa manter a pista honesta enquanto o FRAMES faz discurso sobre nomes».`), once: true, do: { soc: 2, flag: 'apud_dj' }, next: null },
    love: { text: t(`He keeps his eyes steady. "The love of my life lives on an island in the Mediterranean. Far from here. I hold the horizon at sunrise because it's the one edge that touches both of us."`, `Mantiene la mirada serena. «El amor de mi vida vive en una isla del Mediterráneo. Lejos de aquí. Sostengo el horizonte al amanecer porque es el único borde que nos toca a los dos».`, `Ele mantém o olhar sereno. «O amor da minha vida mora numa ilha do Mediterrâneo. Longe daqui. Eu seguro o horizonte no nascer do sol porque é a única borda que toca nós dois».`), choices: [
      K('ask', t(`"Which island?"`, `«¿Qué isla?»`, `«Qual ilha?»`), { next: 'love2' }),
      K('care', t(`"That sounds heavy to carry."`, `«Suena pesado de cargar».`, `«Parece pesado de carregar».`), { next: 'love3' })
    ] },
    love2: { text: t(`"I don't say the name. If I say it out loud I book a flight." A short, rueful laugh. "Ask me when my next payment lands."`, `«No digo el nombre. Si lo digo en voz alta, compro un pasaje». Una risa breve y resignada. «Pregúntame cuando me llegue el próximo pago».`, `«Não digo o nome. Se eu falar em voz alta, compro uma passagem». Uma risada breve e resignada. «Me pergunta quando cair meu próximo pagamento».`), once: true, do: { soc: 3, care: 1, flag: 'apud_love' }, next: null },
    love3: { text: t(`"It is. And it's the lightest thing I own." He finally looks at you. "Thank you for not telling me it'll work out. People do that."`, `«Lo es. Y es lo más liviano que tengo». Por fin te mira. «Gracias por no decirme que va a salir bien. La gente lo hace».`, `«É. E é a coisa mais leve que eu tenho». Ele finalmente te olha. «Obrigado por não me dizer que vai dar certo. As pessoas dizem».`), once: true, do: { soc: 3, care: 1, flag: 'apud_love' }, next: null },
    psy: { text: t(`"I'm a psychologist." A beat. "But my real passion is bouncing around."`, `«Soy psicólogo». Una pausa. «Pero mi verdadera pasión es rebotar por ahí».`, `«Sou psicólogo». Uma pausa. «Mas minha verdadeira paixão é ficar pulando por aí».`), choices: [
      K('joke', t(`"As in HardBounce?"`, `«¿Como en HardBounce?»`, `«Tipo HardBounce?»`), { next: 'psy2' }),
      K('chill', t(`"You'd get on well with FRAMES."`, `«Te llevarías bien con FRAMES».`, `«Você ia se dar bem com o FRAMES».`), { do: { soc: 1 }, next: null })
    ] },
    psy2: { text: t(`"I said what I said." The corner of his mouth moves. "The diploma is for Monday. The bounce is for the floor."`, `«Dije lo que dije». Se le mueve la comisura de la boca. «El diploma es para el lunes. El rebote es para la pista».`, `«Falei o que falei». O canto da boca dele se mexe. «O diploma é pra segunda. O pulo é pra pista».`), once: true, do: { soc: 2, fun: 2, flag: 'apud_psy' }, next: null }
  };
  const apudOn = function (id, nodes) {
    const d = D[id]; if (!d) return;
    Object.keys(AQ).forEach(function (k) { d.nodes[k] = AQ[k]; });
    nodes.forEach(function (from) {
      const n = d.nodes[from]; if (!n || !Array.isArray(n.choices)) return;
      if (n.choices.some(function (c) { return c.__aq; })) return;
      [
        K('ask', t(`"Are you a DJ too?"`, `«¿Tú también eres DJ?»`, `«Você também é DJ?»`), { next: 'dj', __aq: true, do: { time: 2 } }),
        K('ask', t(`"Is there someone waiting for you?"`, `«¿Hay alguien que te espere?»`, `«Tem alguém esperando você?»`), { next: 'love', __aq: true, do: { time: 2 } }),
        K('ask', t(`"What do you do when you're not DJing?"`, `«¿Qué haces cuando no estás pinchando?»`, `«O que você faz quando não tá discotecando?»`), { next: 'psy', __aq: true, do: { time: 2 } })
      ].forEach(function (c) { n.choices.splice(Math.max(0, n.choices.length - 1), 0, c); });
    });
  };

  /* Sala 2 booth (02:30-05:30): APÜD spinning HardBounce */
  D.apud_attic = {
    who: 'apud', role: t('SALA 2 // HARDBOUNCE', 'SALA 2 // HARDBOUNCE', 'SALA 2 // HARDBOUNCE'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'met_apud_attic' }, to: 'again' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`APÜD grins behind the Sala 2 decks over a ferocious 148-BPM HardBounce bassline, eyes moving between the dancers and the faders. "Took the upper floor from FRAMES at 02:30. Heavy kicks, high bounce, warm room — I'm riding Sala 2 at full tilt until it's time to climb to the rooftop."`,
          `APÜD sonríe detrás de las bandejas de Sala 2 sobre un bajo feroz de HardBounce a 148 BPM, moviendo la vista entre la pista y los faders. «Tomé el piso de arriba después de FRAMES a las 02:30. Bombos firmes, rebote alto, sala cálida — sostengo Sala 2 a toda velocidad hasta que toque subir al techo».`,
          `O APÜD sorri atrás dos toca-discos da Sala 2 em cima de um baixo feroz de HardBounce a 148 BPM, os olhos indo da pista pros faders. «Assumi o andar de cima depois do FRAMES às 02:30. Bumbos fortes, pulo alto, sala quente — tô levando a Sala 2 no talo até a hora de subir pro terraço».`),
        do: { flag: 'met_apud_attic', soc: 1 },
        choices: [
          K('care', t(`"The bounce up here gave the room a second wind."`, `«El rebote acá arriba le dio un segundo aire a la sala».`, `«O pulo aqui em cima deu um segundo fôlego pra sala».`), { do: { fun: 2 }, free: true, next: null }),
          LEAVE()
        ]
      },
      again: {
        text: t(`APÜD taps his chest over the kick without missing the transition. "Still bouncing up here until the roof opens. Hydrate and keep your knees loose."`,
          `APÜD se da un toque en el pecho al ritmo del bombo sin soltar la transición. «Seguimos rebotando aquí arriba hasta que abra el techo. Hidrátate y suelta las rodillas».`,
          `O APÜD bate no peito no tempo do bumbo sem perder a virada. «Seguimos pulando aqui em cima até abrir o terraço. Hidrata e solta os joelhos».`),
        choices: [LEAVE()]
      }
    }
  };
  apudOn('apud_attic', ['a', 'again']);
  apudOn('apud_roof_talk', ['a']);

  /* Afterparty cameo (a_living): APÜD sits with warm tea and genuinely checks in on how you're feeling — NO mission */
  D.af_cam_apud = {
    who: 'apud', role: t('AFTERHOURS // WARM TEA', 'AFTERHOURS // TÉ TIBIO', 'AFTERHOURS // CHÁ QUENTINHO'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'apud_validated' }, to: 'again' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`APÜD sits near the edge of the rug cradling two chipped mugs of chamomile tea, steam rising slow in the daylight. He slides one toward you without rushing. "No decks left to hold. No favors, no schedules. Just sit a second — how are you actually feeling after carrying tonight?"`,
          `APÜD está sentado cerca del borde de la alfombra sosteniendo dos tazas desportilladas de té de manzanilla, con el vapor subiendo lento en la luz del día. Te desliza una sin apuro. «Ya no quedan cabinas que sostener. Sin favores, sin horarios. Siéntate un segundo: ¿cómo te sientes de verdad después de cargar con toda esta noche?»`,
          `O APÜD tá sentado perto da ponta do tapete segurando duas canecas lascadas de chá de camomila, o vapor subindo devagar na luz do dia. Ele desliza uma pra você sem pressa. «Não sobrou cabine pra segurar. Sem favores, sem horários. Senta um segundo — como você tá se sentindo de verdade depois de carregar essa noite?»`),
        choices: [
          K('care', t(`"Honestly? Tired down to my bones."`, `«¿De verdad? Cansado hasta los huesos».`, `«Sinceramente? Cansado até os ossos».`), { next: 'feel_tired' }),
          K('honest', t(`"Raw and tender — everything from tonight still feels loud."`, `«Sensible y a flor de piel — todo lo de esta noche sigue sonando fuerte».`, `«Sensível e à flor da pele — tudo de hoje ainda tá ecoando alto».`), { next: 'feel_tender' }),
          K('silent', t(`"A little lonely, even with all these people around."`, `«Un poco solo, incluso con toda esta gente alrededor».`, `«Um pouco sozinho, mesmo com toda essa gente por perto».`), { next: 'feel_lonely' }),
          K('chill', t(`"Surprisingly full. Grateful for everyone who made it to morning."`, `«Sorprendentemente lleno. Agradecido por cada persona que llegó a la mañana».`, `«Surpreendentemente cheio. Grato por todo mundo que chegou até a manhã».`), { next: 'feel_full' }),
          LEAVE()
        ]
      },
      again: {
        text: t(`APÜD wraps both hands around his mug and gives you an unhurried nod. "Tea's still warm if you need somewhere quiet to set things down."`,
          `APÜD rodea la taza con ambas manos y te asiente sin apuro. «El té sigue tibio si necesitas un lugar tranquilo donde soltar peso».`,
          `O APÜD envolve a caneca com as duas mãos e faz um aceno calmo. «O chá ainda tá quentinho se você precisar de um canto tranquilo pra descansar a cabeça».`),
        choices: [
          K('care', t(`"Can I check in on how I'm feeling again?"`, `«¿Te cuento cómo me siento ahora?»`, `«Posso te contar como tô me sentindo agora?»`), { next: 'a' }),
          LEAVE()
        ]
      },
      feel_tired: {
        text: t(`APÜD lets out a soft breath and nods slowly, not rushing to cheer you up. "Of course you are. You held people together for six hours on concrete floors and borrowed sleep. Nobody asks how heavy it is to be the reliable one until morning hits."`,
          `APÜD suelta un suspiro suave y asiente despacio, sin apurarse a animarte. «Claro que sí. Sostuviste a la gente seis horas sobre cemento y sueño prestado. Casi nadie pregunta cuánto pesa ser quien siempre responde hasta que cae la mañana».`,
          `O APÜD solta um suspiro leve e assente devagar, sem correr pra te animar. «Claro que tá. Você segurou as pontas de todo mundo por seis horas no concreto e sono emprestado. Quase ninguém pergunta quanto pesa ser quem resolve tudo até amanhecer».`),
        choices: [
          K('honest', t(`"It really did feel like everyone leaned on me at once."`, `«Sí sentí que todos se apoyaron en mí al mismo tiempo».`, `«Pareceu mesmo que todo mundo se apoiou em mim de uma vez».`), { next: 'hold_rest' }),
          K('chill', t(`"Drinking the tea helps. I don't have to fix anything right now."`, `«Tomar el té ayuda. No tengo que arreglar nada ahora».`, `«Tomar esse chá ajuda. Não preciso resolver nada agora».`), { next: 'hold_rest' })
        ]
      },
      feel_tender: {
        text: t(`He listens with steady, unhurried patience, watching the steam curl between you. "That openness is real. Bass strips off the armor we wear all week, and daylight meets us before the skin closes back up. Being bruised-open doesn't mean you fell apart."`,
          `Escucha con paciencia serena y sin apuro, mirando el vapor subir entre ustedes. «Esa sensibilidad es real. Los graves quitan la armadura que usamos toda la semana, y la luz del día nos encuentra antes de que la piel vuelva a cerrarse. Quedar a flor de piel no significa haberte roto».`,
          `Ele escuta com paciência serena e sem pressa, olhando o vapor subir entre vocês. «Essa sensibilidade é real. O grave tira a armadura que a gente usa a semana inteira, e a luz do dia encontra a gente antes da pele fechar de novo. Ficar à flor da pele não quer dizer que você desmontou».`),
        choices: [
          K('care', t(`"Thank you for saying that without making it clinical."`, `«Gracias por decirlo así, sin ponerte clínico».`, `«Obrigado por dizer isso assim, sem soar clínico».`), { next: 'hold_tender' }),
          K('honest', t(`"What do you do when a night lingers under your skin?"`, `«¿Qué haces tú cuando una noche se te queda bajo la piel?»`, `«O que você faz quando uma noite fica embaixo da pele?»`), { next: 'hold_tender' })
        ]
      },
      feel_lonely: {
        text: t(`APÜD softens at the shoulders and meets your eyes squarely. "That's the quietest hangover in nightlife: being surrounded by warmth and still feeling ten centimeters outside your own chest. You showed up for everyone else tonight. Who checked on you before now?"`,
          `APÜD afloja los hombros y te sostiene la mirada de frente. «Esa es la resaca más silenciosa de la noche: estar rodeado de calor y aun así sentirte diez centímetros fuera de tu propio pecho. Estuviste para todos esta noche. ¿Quién preguntó por ti antes de ahora?»`,
          `O APÜD solta os ombros e encontra seu olhar de frente. «Essa é a ressaca mais silenciosa da noite: estar cercado de calor e ainda se sentir dez centímetros fora do próprio peito. Você apareceu pra todo mundo hoje. Quem perguntou por você antes de agora?»`),
        choices: [
          K('care', t(`"Sitting here with you makes the room feel closer again."`, `«Estar aquí contigo hace que la sala se sienta cerca otra vez».`, `«Sentar aqui com você faz a sala parecer perto de novo».`), { next: 'hold_lonely' }),
          K('honest', t(`"Mostly I just kept moving so I wouldn't notice."`, `«Más que nada seguí moviéndome para no notarlo».`, `«Mais do que tudo eu continuei me mexendo pra não notar».`), { next: 'hold_lonely' })
        ]
      },
      feel_full: {
        text: t(`APÜD's face breaks into a genuine, unguarded smile. "Hold onto that without questioning it. Most of life rushes past the good nights before we're allowed to enjoy them. You looked after your people and didn't lose yourself doing it."`,
          `La cara de APÜD se abre en una sonrisa genuina y sin defensa. «Guarda eso sin dudar de ello. Casi toda la vida pasa de largo sobre las buenas noches antes de dejarnos disfrutarlas. Cuidaste a tu gente y no te perdiste en el camino».`,
          `O rosto do APÜD se abre num sorriso genuíno e sem defesa. «Guarda isso sem desconfiar. Quase sempre a vida passa correndo pelas noites boas antes de deixar a gente sentir. Você cuidou da sua galera sem se perder no caminho».`),
        choices: [
          K('care', t(`"I didn't expect to still be standing here this happy."`, `«No esperaba seguir aquí tan contento a esta hora».`, `«Eu não esperava ainda tá aqui tão bem a essa hora».`), { next: 'hold_full' }),
          K('chill', t(`"Now I just want warm tea and a couch."`, `«Ahora solo quiero té tibio y un sofá».`, `«Agora só quero chá morno e um sofá».`), { next: 'hold_full' })
        ]
      },
      hold_rest: {
        text: t(`"Then set the pack down here." He taps his mug lightly against yours. "Rest isn't quitting. You're allowed to only be held until noon — nothing asks anything more of you today."`,
          `«Entonces suelta la carga aquí». Choca suave su taza con la tuya. «Descansar no es rendirse. Tienes permiso de dejarte cuidar hasta el mediodía — hoy nada te pide nada más».`,
          `«Então larga o peso aqui». Ele encosta leve a caneca na sua. «Descansar não é desistir. Você tem permissão pra só ser acolhido até o meio-dia — hoje nada te pede mais nada».`),
        next: 'validate_done'
      },
      hold_tender: {
        text: t(`"I wash my hands in warm water, drink something without ice, and sit beside someone I don't have to impress." He nudges your knee lightly. "You carried real care tonight. Let some of it land back on you."`,
          `«Me lavo las manos con agua tibia, tomo algo sin hielo y me siento junto a alguien a quien no tengo que impresionar». Te da un toque leve en la rodilla. «Cargaste cuidado real esta noche. Deja que algo de eso vuelva hacia ti».`,
          `«Eu lavo as mãos com água morna, tomo algo sem gelo e sento do lado de alguém que eu não preciso impressionar». Ele encosta leve no seu joelho. «Você carregou cuidado de verdade hoje. Deixa um pouco disso voltar pra você».`),
        next: 'validate_done'
      },
      hold_lonely: {
        text: t(`"Then stay right here as long as the kettle lasts." His voice stays easy and grounded. "I'm glad you're in this room, exactly at this speed. You didn't disappear on yourself, and someone noticed."`,
          `«Entonces quédate aquí todo lo que dure la pava». Su voz sigue tranquila y firme. «Me alegra que estés en esta sala, exactamente a este ritmo. No te abandonaste, y alguien lo vio».`,
          `«Então fica bem aqui enquanto durar a chaleira». A voz dele segue calma e firme. «Fico feliz que você esteja nessa sala, exatamente nesse ritmo. Você não se abandonou, e alguém viu».`),
        next: 'validate_done'
      },
      hold_full: {
        text: t(`"Tea and a couch are an undefeated closing set." He lifts his mug toward the window. "You earned a soft morning — keep this feeling in your pocket for Monday."`,
          `«Té y sofá son un set de cierre invicto». Levanta la taza hacia la ventana. «Te ganaste una mañana suave — guarda esta sensación en el bolsillo para el lunes».`,
          `«Chá e sofá são um set de encerramento invicto». Ele ergue a caneca pra janela. «Você mereceu uma manhã leve — guarda essa sensação no bolso pra segunda».`),
        next: 'validate_done'
      },
      validate_done: {
        text: t(`You drink the chamomile slow while the morning sun warms the floor. Your shoulders finally drop two inches. APÜD doesn't fill the quiet — he just stays beside you until you feel steady again.`,
          `Tomas la manzanilla despacio mientras el sol de la mañana entibia el suelo. Por fin te bajan los hombros cinco centímetros. APÜD no llena el silencio — solo se queda a tu lado hasta que vuelves a sentirte firme.`,
          `Você bebe a camomila devagar enquanto o sol da manhã aquece o chão. Seus ombros finalmente baixam dois dedos. O APÜD não preenche o silêncio — ele só fica do seu lado até você se sentir firme de novo.`),
        once: true,
        do: { soc: 4, care: 2, fun: 3, weird: -5, hp: 4, flag: ['g_apud_open', 'apud_validated'] },
        next: null
      }
    }
  };
  apudOn('af_cam_apud', ['a', 'again']);

  /* 02:30 AM Sala 2 handover notification */
  const tick0 = EM.story.tick;
  EM.story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state;
    if (!s || s.ended || s.flags.after_go || s.flags.roof_open) return;
    if (s.time >= 270 && !s.flags.sala2_shift_toast) {
      s.flags.sala2_shift_toast = true;
      if (EM.engine && EM.engine.applyAudio) EM.engine.applyAudio();
      U.toast({
        icon: 'note',
        kind: 'info',
        ms: 6500,
        text: t(`02:30 AM — APÜD just took over Sala 2 with HardBounce. FRAMES SHELL moved downstairs to Backstage with the request crate.`, `02:30 AM — APÜD acaba de tomar Sala 2 con HardBounce. FRAMES SHELL bajó al Backstage con el cajón de pedidos.`, `02:30 AM — O APÜD acabou de assumir a Sala 2 com HardBounce. O FRAMES SHELL desceu pro Backstage com o caixote de pedidos.`)
      });
    }
  };

  /* ---------------------------------------------------------------- LEONIDAS */
  /* a man in full glam: ink pompadour, open green satin vest, wide-leg black trousers, platform boots, chains, hoops, winged liner and glitter */
  EM.CAST.leonidas = { name: 'LEONIDAS', look: { skin: 3, build: 1, expr: 3, hair: 18, hc: 13, top: 8, tc: 13, bottom: 6, bc: 1, shoes: 3, ac: 8, hat: 0, face: 4, neck: 1, ear: 2, makeup: 3, wrist: 3 } };
  const LEO_ROLE = t('GLAM // FRIEND OF ÆRIEL', 'GLAM // AMIGO DE ÆRIEL', 'GLAM // AMIGO DO ÆRIEL');

  /* the creator, as a pop-up: opened after the dialogue closes */
  S.leo_remake = function () {
    const wait = function () {
      if (EM.state && EM.state.ended) return;
      if (U.D) { setTimeout(wait, 150); return; }
      U.openRemake(function (changed) {
        const s = EM.state; if (!s) return;
        s.flags.leo_remade = true;
        U.toast({ icon: 'heart', kind: 'good', ms: 6500, text: changed
          ? t(`LEONIDAS steps back and looks at you for a long time. "Don't touch anything. Walk."`, `LEONIDAS da un paso atrás y te mira un buen rato. «No toques nada. Camina».`, `O LEONIDAS dá um passo atrás e te olha por um bom tempo. «Não encosta em nada. Anda».`)
          : t(`LEONIDAS shrugs, wounded. "Fine. Keep it. The offer stands."`, `LEONIDAS se encoge de hombros, herido. «Bueno. Quédatelo. La oferta sigue en pie».`, `O LEONIDAS dá de ombros, ferido. «Tá. Fica com ele. A oferta continua de pé».`) });
      });
    };
    setTimeout(wait, 250);
  };

  const buildLeo = function (after) {
    const nice = function (s) { return !!s.flags.leo_nice; };
    const N = {};
    N.a = {
      text: function (s) {
        const out = [after
          ? t(`Leonidas has claimed the one good lamp in the flat and stands in it, satin coat open over a bare chest and a rhinestone brooch the size of a coaster. "This flat has exactly one lighting decision and it's this corner. ÆRIEL says I may stay in it. Nobody told the flat."`, `Leonidas se apropió de la única buena lámpara del departamento y se queda de pie en ella, el abrigo de satén abierto sobre el pecho desnudo y un broche de strass del tamaño de un posavasos. «Este departamento tiene exactamente una decisión de iluminación y es esta esquina. ÆRIEL dice que puedo quedarme en ella. Nadie se lo dijo al departamento».`, `O Leonidas tomou posse do único abajur bom do apê e fica de pé nele, casaco de cetim aberto sobre o peito nu e um broche de strass do tamanho de um porta-copos. «Esse apê tem exatamente uma decisão de iluminação e é esse canto. O ÆRIEL diz que eu posso ficar nele. Ninguém avisou o apê».`)
          : t(`Next to the coat check stands a figure in a floor-length satin coat, a rhinestone brooch the size of a coaster, lashes with their own weather. He studies the queue with a doctor's frown. "Darling. Don't move. The jacket is fine. The face is fine. The collar is a crime."`, `Junto al guardarropa hay una figura con un abrigo de satén hasta el suelo, un broche de strass del tamaño de un posavasos y pestañas con clima propio. Estudia la fila con el ceño de un médico. «Cariño. No te muevas. La chaqueta está bien. La cara está bien. El cuello es un delito».`, `Do lado da chapelaria está uma figura de casaco de cetim até o chão, um broche de strass do tamanho de um porta-copos e cílios com clima próprio. Ele estuda a fila com a testa franzida de médico. «Querido. Não se mexe. A jaqueta tá boa. O rosto tá bom. A gola é um crime».`)];
        if (s.flags.leo_remade) out.push(t(`He circles you once, slowly. "Mm. My work. I'm allowed to be proud of my work."`, `Te rodea una vez, despacio. «Mm. Mi trabajo. Tengo permiso para estar orgulloso de mi trabajo».`, `Ele dá uma volta em você, devagar. «Hum. Meu trabalho. Tenho permissão pra ter orgulho do meu trabalho».`));
        return out;
      },
      choices: [
        K('ask', t(`"Who are you, and why are you here?"`, `«¿Quién eres y por qué estás aquí?»`, `«Quem é você e por que tá aqui?»`), { next: 'who' }),
        K('smooth', t(`"That coat is magnificent."`, `«Ese abrigo es magnífico».`, `«Esse casaco é magnífico».`), { next: 'coat' }),
        K('ask', t(`"What's wrong with the photo rule?"`, `«¿Qué tiene de malo la regla de las fotos?»`, `«O que tem de errado com a regra das fotos?»`), { next: 'photo' }),
        K('plan', t(`"Could you help me with my look?"`, `«¿Podrías ayudarme con mi look?»`, `«Você poderia me ajudar com o meu visual?»`), { next: 'makeover' }),
        K('blunt', t(`"Nobody needs photos. Move along."`, `«Nadie necesita fotos. Sigue».`, `«Ninguém precisa de foto. Segue».`), { do: { soc: -1, flag: 'leo_rude' }, next: 'rude' }),
        LEAVE()
      ]
    };
    N.who = { text: t(`"Leonidas. One name. Anything more is greed." He adjusts the brooch. "I'm here for ÆRIEL. We go back. I dress them when they allow it, which is on a schedule I find personally hurtful. Someone has to stand by the coats and tell the truth about collars."`, `«Leonidas. Un solo nombre. Cualquier cosa más es codicia». Se ajusta el broche. «Estoy aquí por ÆRIEL. Nos conocemos desde hace mucho. Visto a ÆRIEL cuando me deja, que es con un calendario que encuentro personalmente hiriente. Alguien tiene que estar junto a los abrigos y decir la verdad sobre los cuellos».`, `«Leonidas. Um nome só. Qualquer coisa a mais é ganância». Ele ajeita o broche. «Tô aqui pelo ÆRIEL. A gente se conhece faz tempo. Eu visto o ÆRIEL quando deixa, num calendário que acho pessoalmente ofensivo. Alguém precisa ficar do lado dos casacos e dizer a verdade sobre as golas».`), once: true, do: { soc: 2, flag: 'leo_met' }, next: 'a' };
    N.coat = { text: t(`He closes his eyes briefly, as one does at a sacrament. "Thank you. It took me four hours to be this subtle." He opens them. "You have taste. I can see it fighting for its life under that collar."`, `Cierra los ojos un momento, como ante un sacramento. «Gracias. Me tomó cuatro horas ser así de sutil». Los abre. «Tienes gusto. Lo veo luchando por su vida bajo ese cuello».`, `Ele fecha os olhos por um momento, como num sacramento. «Obrigado. Levei quatro horas pra ser tão sutil». Ele abre. «Você tem gosto. Eu vejo ele lutando pela vida embaixo dessa gola».`), once: true, do: { soc: 3, fun: 2, flag: 'leo_nice' }, next: 'a' };
    N.rude = { text: t(`Leonidas lowers one eyebrow by a precise centimetre. "Darling. Photos are the only thing I'm appalled by, and now you're second." He turns back to the queue.`, `Leonidas baja una ceja un centímetro exacto. «Cariño. Las fotos son lo único que me horroriza, y ahora tú eres la segunda». Se vuelve hacia la fila.`, `O Leonidas abaixa uma sobrancelha um centímetro exato. «Querido. Foto é a única coisa que me horroriza, e agora você é a segunda». Ele volta pra fila.`), next: null };
    N.photo = {
      text: t(`"A room full of people at their most beautiful, at four in the morning, sweat doing what no highlighter can, and I am told: no cameras. NO. CAMERAS." He presses a hand to the brooch. "I have a body of work, darling. It's called Everyone Looked Incredible And Nobody Can Prove It."`, `«Una sala llena de gente en su momento más hermoso, a las cuatro de la mañana, con un sudor que ningún iluminador logra, y me dicen: nada de cámaras. NADA. DE. CÁMARAS». Se lleva una mano al broche. «Tengo una obra, cariño. Se llama Todos Se Veían Increíbles Y Nadie Puede Probarlo».`, `«Uma sala cheia de gente no momento mais bonito, às quatro da manhã, com um suor que nenhum iluminador consegue, e me dizem: nada de câmera. NADA. DE. CÂMERA». Ele leva uma mão ao broche. «Eu tenho uma obra, querido. Chama Todo Mundo Estava Incrível E Ninguém Pode Provar».`),
      choices: [
        K('care', t(`"The rule is why anyone dares to look that good."`, `«La regla es la razón por la que alguien se atreve a verse así».`, `«A regra é o motivo de alguém ousar ficar bonito assim».`), { next: 'photo2' }),
        K('joke', t(`"Then the archive is memory. Keep it."`, `«Entonces el archivo es la memoria. Consérvala».`, `«Então o arquivo é a memória. Guarda».`), { next: 'photo3' }),
        K('blunt', t(`"It's the rule. Get over it."`, `«Es la regla. Supéralo».`, `«É a regra. Supera».`), { do: { soc: -2, flag: 'leo_rude' }, next: 'rude' })
      ]
    };
    N.photo2 = { text: t(`He is quiet for a full second, which for him is a speech. "…Yes. I know. I know. It's maddening how right that is." He dabs under one lash with a knuckle. "You may ask me for things."`, `Se queda callado un segundo entero, que para él es un discurso. «…Sí. Lo sé. Lo sé. Es exasperante lo cierto que es». Se toca bajo una pestaña con un nudillo. «Puedes pedirme cosas».`, `Ele fica quieto por um segundo inteiro, que pra ele é um discurso. «…É. Eu sei. Eu sei. É exasperante o quanto isso é verdade». Ele toca embaixo de um cílio com o nó do dedo. «Você pode me pedir coisas».`), once: true, do: { soc: 4, care: 1, flag: ['leo_nice', 'g_leonidas_open'] }, next: 'a' };
    N.photo3 = { text: t(`"Memory," he repeats, delighted and a little betrayed. "Oh, that's worse. It has no resolution." A slow smile. "I keep every look I've ever made. None of them are in a drawer. Ask me for something."`, `«Memoria», repite, encantado y un poco traicionado. «Ay, eso es peor. No tiene resolución». Una sonrisa lenta. «Guardo cada look que he hecho. Ninguno está en un cajón. Pídeme algo».`, `«Memória», repete, encantado e um pouco traído. «Ai, isso é pior. Não tem resolução». Um sorriso lento. «Guardo cada visual que já fiz. Nenhum tá numa gaveta. Me pede alguma coisa».`), once: true, do: { soc: 3, fun: 2, flag: ['leo_nice', 'g_leonidas_open'] }, next: 'a' };
    N.makeover = { branch: [{ req: nice, to: 'magic' }, { req: F('leo_rude'), to: 'no_rude' }, { req: function () { return true; }, to: 'no_yet' }] };
    N.no_yet = { text: t(`"Hm." He looks you over, head to toe, with professional neutrality. "I only work on people I like. Say something kind about my coat or my cause, and then we'll talk about your sleeves."`, `«Mm». Te mira de pies a cabeza con neutralidad profesional. «Solo trabajo con gente que me cae bien. Di algo amable sobre mi abrigo o mi causa, y luego hablamos de tus mangas».`, `«Hum». Ele te olha da cabeça aos pés com neutralidade profissional. «Só trabalho com gente de quem gosto. Fala algo gentil do meu casaco ou da minha causa, e aí a gente conversa sobre suas mangas».`), next: 'a' };
    N.no_rude = { text: t(`"After what you said?" He raises a palm. "Apologise to the coat. Then we'll see."`, `«¿Después de lo que dijiste?». Levanta una palma. «Pídele perdón al abrigo. Luego vemos».`, `«Depois do que você disse?». Ele levanta uma palma. «Pede desculpa pro casaco. Aí a gente vê».`), choices: [
      K('care', t(`"I'm sorry. The coat is magnificent, and so is the cause."`, `«Perdón. El abrigo es magnífico, y la causa también».`, `«Desculpa. O casaco é magnífico, e a causa também».`), { do: { soc: 1, flag: 'leo_nice', unflag: 'leo_rude' }, next: 'magic' }),
      LEAVE()
    ] };
    N.magic = {
      text: t(`He claps once. "Sit. Eyes closed. No mirrors until I say. I'm putting my magic to work." Thirty minutes of pins, powder and murmured opinions about your posture follow. When he lets you look, the whole world has moved a little to the left.`, `Aplaude una vez. «Siéntate. Ojos cerrados. Nada de espejos hasta que yo diga. Voy a poner mi magia a trabajar». Siguen treinta minutos de alfileres, polvo y opiniones murmuradas sobre tu postura. Cuando te deja mirar, el mundo entero se movió un poco a la izquierda.`, `Ele bate palma uma vez. «Senta. Olhos fechados. Nada de espelho até eu mandar. Vou pôr minha magia pra trabalhar». Seguem trinta minutos de alfinete, pó e opiniões murmuradas sobre sua postura. Quando ele deixa você olhar, o mundo inteiro se mexeu um pouco pra esquerda.`),
      do: { time: 30, soc: 2, fun: 2, call: 'leo_remake' }, next: null
    };
    if (after) {
      N.a.choices.splice(3, 0, K('ask', t(`"Do you miss the photos here too?"`, `«¿Aquí también extrañas las fotos?»`, `«Aqui você também sente falta das fotos?»`), { next: 'af_miss' }));
      N.af_miss = { text: t(`"Every night. I keep a list in my head: the green satin at 4:12, the rain-wet eyeliner on the stairs. I can't prove any of it." He turns the brooch. "Everyone I tell believes me, and that is the real archive. I'd never admit that in the foyer."`, `«Cada noche. Llevo una lista en la cabeza: el satén verde a las 4:12, el delineador mojado de lluvia en la escalera. No puedo probar nada». Gira el broche. «Todos a los que se lo cuento me creen, y ese es el verdadero archivo. Nunca lo admitiría en el foyer».`, `«Toda noite. Eu guardo uma lista na cabeça: o cetim verde às 4:12, o delineador molhado de chuva na escada. Não consigo provar nada». Ele gira o broche. «Todo mundo pra quem eu conto acredita, e esse é o arquivo de verdade. Eu nunca admitiria isso no foyer».`), choices: [
        K('care', t(`"Why do you look after ÆRIEL's look?"`, `«¿Por qué cuidas el look de ÆRIEL?»`, `«Por que você cuida do visual do ÆRIEL?»`), { next: 'af_ae' }),
        K('chill', t(`"Thank you for telling me."`, `«Gracias por contármelo».`, `«Obrigado por me contar».`), { do: { soc: 2 }, next: 'a' })
      ] };
      N.af_ae = { text: t(`"Because they won't. A thermos of tea, the same black, and a face that would carry anything. I'm not changing them." He flattens a crease on his sleeve. "I'm leaving a window open. That's the whole job."`, `«Porque ÆRIEL no lo hace. Un termo de té, el mismo negro, y una cara que cargaría cualquier cosa. No estoy cambiando a ÆRIEL». Aplana un pliegue de su manga. «Dejo una ventana abierta. Ese es todo el trabajo».`, `«Porque o ÆRIEL não faz. Uma garrafa de chá, o mesmo preto, e um rosto que carregaria qualquer coisa. Eu não tô mudando o ÆRIEL». Ele alisa uma dobra da manga. «Deixo uma janela aberta. Esse é o trabalho todo».`), once: true, do: { soc: 4, care: 1, flag: 'g_leonidas_open' }, next: 'a' };
    }
    return N;
  };
  D.leonidas = { who: 'leonidas', role: LEO_ROLE, start: 'a', nodes: buildLeo(false) };
  D.af_leonidas = { who: 'leonidas', role: LEO_ROLE, start: 'a', nodes: buildLeo(true) };

  /* beside the coat check, and always at the after party (the one good lamp) */
  (function () {
    const z = EM.zones && EM.zones.foyer; if (z) z.npc({ id: 'leonidas', cast: 'leonidas', x: 8.8, y: 3.6, dlg: 'leonidas', dir: 'l', reach: 28 });
    const a = EM.zones && EM.zones.a_living; if (a) a.npc({ id: 'leonidas_a', cast: 'leonidas', x: 4.5, y: 10.4, dlg: 'af_leonidas', dir: 'r', reach: 28, when: F('after_go') });
  })();

  /* his Tuesday text */
  const m0 = EM.story.morning;
  EM.story.morning = function (s) {
    const msgs = m0(s);
    if (s.ended === 'after' && Array.isArray(msgs)) {
      if (s.flags.g_leonidas_open) {
        msgs.push({ who: 'leonidas', name: null, time: 'TUE 19:40', t: t(`darling. i have been thinking about the green satin at 4:12. i am describing it to everyone. nobody can prove it. i've never been happier. kisses. do not touch your hair.`, `cariño. he estado pensando en el satén verde de las 4:12. se lo describo a todos. nadie puede probarlo. nunca he sido más feliz. besos. no te toques el pelo.`, `querido. fiquei pensando no cetim verde das 4:12. tô descrevendo pra todo mundo. ninguém pode provar. nunca fui tão feliz. beijos. não mexe no cabelo.`) });
      }
      if (s.flags.frames_perra_learned) {
        msgs.push({ who: 'frames', name: null, time: 'TUE 14:15', t: t(`morning. hope nobody tried your patience today. remember: drop the smile, keep your spine straight, let them choke on the silence. crate stays shut till friday.`, `buen día. espero que nadie haya probado tu paciencia hoy. acuérdate: cero sonrisa, espalda recta, que ellos se atraganten con el silencio. el cajón sigue cerrado hasta el viernes.`, `bom dia. espero que ninguém tenha testado sua paciência hoje. lembra: corta o sorriso, coluna reta, deixa eles se engasgarem com o silêncio. o caixote fica fechado até sexta.`) });
      } else if (s.flags.g_frames_open) {
        msgs.push({ who: 'frames', name: null, time: 'TUE 14:15', t: t(`morning. finally spun that 1979 brazilian pressing with coffee. sounded right for daylight. thanks for helping carry the night.`, `buen día. por fin puse ese disco brasileño de 1979 con café. sonó perfecto para la luz del día. gracias por ayudar a sostener la noche.`, `bom dia. finalmente toquei aquele disco brasileiro de 1979 com café. soou perfeito pra luz do dia. valeu por ajudar a segurar a noite.`) });
      }
      if (s.flags.apud_validated || s.flags.g_apud_open) {
        msgs.push({ who: 'apud', name: null, time: 'TUE 16:05', t: t(`hey. chamomile kettle is still warm on this side. hope your tuesday moved gently, without anyone handing you their weight to carry.`, `hola. la pava de manzanilla sigue tibia de este lado. espero que tu martes haya ido suave, sin que nadie te ponga encima su propio peso.`, `oi. a chaleira de camomila ainda tá morna desse lado. espero que sua terça tenha ido leve, sem ninguém jogar o próprio peso nas suas costas.`) });
      }
    }
    return msgs;
  };
})();

/* ---- consolidated from story_v36.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, S = EM.scripts, D = EM.DIALOGUES, AF = EM.AF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`Leave it there.`, `Dejarlo ahí.`, `Deixar por aqui.`), { free: true, next: null }); };
  const Q = function (s, id) { return s.quests[id]; };
  const flagsAny = function (s, ks) { return ks.some(function (k) { return !!s.flags[k]; }); };
  const opened = function (s) { return Object.keys(s.flags).filter(function (k) { return /^g_.*_open$/.test(k); }).length; };

  /* ÆRIEL is always at the after: the seeded guest list always includes them */
  const b0 = S.af_begin;
  S.af_begin = function () {
    b0.apply(this, arguments);
    const a = EM.state && EM.state.after; if (!a || !a.cameos) return;
    if (a.cameos.indexOf('resident') === -1) { a.cameos.pop(); a.cameos.push('resident'); }
  };

  /* ---------------------------------------------------------------- the four quests */
  const mk = function (s, f) { return s.flags[f] ? '✓' : '·'; };
  EM.QUESTS.sq_ae1 = {
    title: t('ÆRIEL: THE SANCTUARY', 'ÆRIEL: EL SANTUARIO', 'ÆRIEL: O SANTUÁRIO'),
    desc: t(`ÆRIEL is on the sofa, off duty. Ask about the project. They will tell you what a dancefloor is for once you have looked after somebody in this flat.`, `ÆRIEL está en el sofá, fuera de turno. Pregunta por el proyecto. Te dirá para qué sirve una pista de baile cuando hayas cuidado a alguien en este departamento.`, `O ÆRIEL tá no sofá, fora de turno. Pergunte sobre o projeto. O ÆRIEL vai te dizer pra que serve uma pista quando você tiver cuidado de alguém nesse apê.`),
    doneText: t(`A dancefloor is a sanctuary because people look after each other. ÆRIEL says it plainly.`, `Una pista es un santuario porque la gente se cuida. ÆRIEL lo dice con sencillez.`, `Uma pista é um santuário porque as pessoas cuidam umas das outras. O ÆRIEL diz com simplicidade.`)
  };
  EM.QUESTS.sq_ae2 = {
    title: t('ÆRIEL: THREE CITIES', 'ÆRIEL: TRES CIUDADES', 'ÆRIEL: TRÊS CIDADES'),
    desc: function (s) { return t(`ÆRIEL lived in Paris and has spent long stretches in São Paulo and Buenos Aires. ${mk(s, 'ae_paris')} Paris. ${mk(s, 'ae_sp')} São Paulo. ${mk(s, 'ae_ba')} Buenos Aires. They will tell you each once you have heard what a few of the guests came to say.`, `ÆRIEL vivió en París y ha pasado largas temporadas en São Paulo y Buenos Aires. ${mk(s, 'ae_paris')} París. ${mk(s, 'ae_sp')} São Paulo. ${mk(s, 'ae_ba')} Buenos Aires. Te contará cada una cuando hayas escuchado lo que algunos invitados vinieron a decir.`, `O ÆRIEL morou em Paris e passou longas temporadas em São Paulo e Buenos Aires. ${mk(s, 'ae_paris')} Paris. ${mk(s, 'ae_sp')} São Paulo. ${mk(s, 'ae_ba')} Buenos Aires. O ÆRIEL vai contar cada uma quando você tiver ouvido o que alguns convidados vieram dizer.`); },
    doneText: t(`Paris was elegant, São Paulo was bombastic, Buenos Aires was irreverent. ÆRIEL carries all three.`, `París fue elegante, São Paulo fue explosivo, Buenos Aires fue irreverente. ÆRIEL carga las tres.`, `Paris foi elegante, São Paulo foi bombástico, Buenos Aires foi irreverente. O ÆRIEL carrega as três.`)
  };
  EM.QUESTS.sq_ae3 = {
    title: t('ÆRIEL: THE PARTY WITH THE DOOR', 'ÆRIEL: LA FIESTA CON PUERTA', 'ÆRIEL: A FESTA COM PORTA'),
    desc: t(`Æ000.X is an invitation-only party. ÆRIEL will say why, once the neighbours are settled and the flat is quiet.`, `Æ000.X es una fiesta solo con invitación. ÆRIEL dirá por qué, cuando los vecinos estén tranquilos y el departamento en silencio.`, `A Æ000.X é uma festa só com convite. O ÆRIEL vai dizer por quê, quando os vizinhos estiverem calmos e o apê em silêncio.`),
    doneText: t(`Principle, care and experimentation: ÆRIEL's answer to the gentrification and commodification of techno.`, `Principios, cuidado y experimentación: la respuesta de ÆRIEL a la gentrificación y mercantilización del techno.`, `Princípios, cuidado e experimentação: a resposta do ÆRIEL à gentrificação e mercantilização do techno.`)
  };
  EM.QUESTS.sq_ae4 = {
    title: t('ÆRIEL: AWAY FROM THE DECKS', 'ÆRIEL: FUERA DE LA CABINA', 'ÆRIEL: LONGE DA CABINE'),
    desc: t(`What does ÆRIEL do when they are not playing? Ask once your friends are looked after.`, `¿Qué hace ÆRIEL cuando no toca? Pregunta cuando tus amigos estén atendidos.`, `O que o ÆRIEL faz quando não toca? Pergunte quando seus amigos estiverem bem.`),
    doneText: t(`Essays, 35mm and Polaroid, a boring day job, and a rider that says look after the ears. That is the whole person.`, `Ensayos, 35 mm y Polaroid, un trabajo diurno aburrido, y un rider que pide cuidar los oídos. Esa es toda la persona.`, `Ensaios, 35 mm e Polaroid, um trabalho diurno chato, e um rider que pede cuidar dos ouvidos. Essa é a pessoa inteira.`)
  };

  /* ---------------------------------------------------------------- the conversation, on the sofa */
  const gate1 = function (s) { return flagsAny(s, ['sam_ok', 'rey_ok', 'vik_ok', 'lio_ok', 'lio_called', 'brought_food', 'af_clean', 'af_trash', 'tato_blanket']); };
  const gate2 = function (s) { return opened(s) >= 2; };
  const gate3 = function (s) { return Q(s, 'q_af6') === 'done' || !!s.flags.quiroga_warned; };
  const gate4 = function (s) { return Q(s, 'q_af7') === 'done'; };

  const N = {
    ae_st: { branch: [
      { req: function (s) { return Q(s, 'sq_ae4') === 'done'; }, to: 'ae_fin' },
      { req: function (s) { return Q(s, 'sq_ae4') === 'active'; }, to: 'ae4g' },
      { req: function (s) { return Q(s, 'sq_ae3') === 'active'; }, to: 'ae3g' },
      { req: function (s) { return Q(s, 'sq_ae2') === 'active'; }, to: 'ae2g' },
      { req: function () { return true; }, to: 'ae1g' }
    ] },
    ae_fin: { text: t(`ÆRIEL nods at the thermos. "You asked all the questions that matter. The rest is a rider and a day job." A tired smile. "Come to an Æ000.X. Fill in the form. I read it with feelings."`, `ÆRIEL asiente al termo. «Hiciste todas las preguntas que importan. Lo demás es un rider y un trabajo diurno». Una sonrisa cansada. «Ven a un Æ000.X. Llena el formulario. Lo leo con sentimientos».`, `O ÆRIEL assente pra garrafa. «Você fez todas as perguntas que importam. O resto é um rider e um trabalho diurno». Um sorriso cansado. «Vem num Æ000.X. Preenche o formulário. Eu leio com sentimentos».`), next: null },

    /* 1. THE SANCTUARY: the Intent paragraph */
    ae1g: { branch: [{ req: gate1, to: 'ae1' }, { req: function () { return true; }, to: 'ae1w' }] },
    ae1w: { text: t(`ÆRIEL looks at you for a while. "Ask me when you've looked after somebody in here. Everything I'd say about a dancefloor is easier once you've done it."`, `ÆRIEL te mira un rato. «Pregúntame cuando hayas cuidado a alguien aquí. Todo lo que diría sobre una pista es más fácil cuando ya lo hiciste».`, `O ÆRIEL te olha por um tempo. «Pergunta de novo quando você tiver cuidado de alguém aqui. Tudo o que eu diria sobre uma pista é mais fácil depois que você fez».`), do: { quest: { sq_ae1: 'active' } }, once: true, next: null },
    ae1: {
      text: t(`"A dancefloor is an ephemeral sanctuary built on sweat, friction and desire." ÆRIEL turns the thermos once in their hands. "On it, individual sovereignty and collective freedom can coexist, and safer spaces can be built and kept. It's somewhere to reclaim, even briefly, your body and your desire."`, `«Una pista de baile es un santuario efímero hecho de sudor, fricción y deseo». ÆRIEL gira una vez el termo entre las manos. «En ella pueden coexistir la soberanía individual y la libertad colectiva, y es posible construir y sostener espacios más seguros. Es un lugar para recuperar, aunque sea un momento, tu cuerpo y tu deseo».`, `«Uma pista é um santuário efêmero feito de suor, fricção e desejo». O ÆRIEL gira a garrafa uma vez nas mãos. «Nela podem coexistir a soberania individual e a liberdade coletiva, e dá pra construir e manter espaços mais seguros. É um lugar pra recuperar, mesmo que por um momento, seu corpo e seu desejo».`),
      choices: [
        K('ask', t(`"You reject joy as resistance. Why?"`, `«Rechazas el goce como resistencia. ¿Por qué?»`, `«Você rejeita a alegria como resistência. Por quê?»`), { next: 'ae1b' }),
        K('care', t(`"That's what the flat did tonight."`, `«Eso hizo el departamento esta noche».`, `«Foi o que o apê fez hoje».`), { next: 'ae1c' })
      ]
    },
    ae1b: { text: t(`"Because it asks pleasure to justify itself. A floor doesn't need to win anything to matter." They look at the room: a sleeper, a kettle, a stranger drying a mug. "But dancefloors have shown that other ways of organising and living together are possible. As a DJ, I'm honoured to help build them and look after them."`, `«Porque le pide al placer que se justifique. Una pista no necesita ganar nada para importar». Miran la sala: un durmiente, una tetera, un desconocido secando una taza. «Pero las pistas de baile han demostrado que existen otras formas de organizarnos y convivir. Como DJ, me honra ayudar a construirlas y cuidarlas».`, `«Porque pede pro prazer se justificar. Uma pista não precisa ganhar nada pra importar». O ÆRIEL olha a sala: alguém dormindo, uma chaleira, um desconhecido secando uma caneca. «Mas as pistas mostraram que existem outras formas de organizar e conviver. Como DJ, é uma honra ajudar a construí-las e cuidar delas».`), next: 'ae1d' },
    ae1c: { text: t(`ÆRIEL lets that sit. "Yes. Nobody here needed to be rescued. They needed a floor, a kettle and a door that stays shut." A small, private nod. "I'm honoured to help build those, and to look after them."`, `ÆRIEL deja que eso se asiente. «Sí. Nadie aquí necesitaba ser rescatado. Necesitaban un piso, una tetera y una puerta que se mantiene cerrada». Un asentimiento pequeño y privado. «Me honra ayudar a construirlos y cuidarlos».`, `O ÆRIEL deixa isso assentar. «É. Ninguém aqui precisava ser resgatado. Precisavam de um chão, uma chaleira e uma porta que fica fechada». Um aceno pequeno e privado. «É uma honra ajudar a construir isso e cuidar».`), next: 'ae1d' },
    ae1d: { text: t(`"One more thing before you sit." They pass you the thermos. It is tea. "I don't drink alcohol. It's in my rider, along with a request that nobody touches the equipment. A floor needs rules that protect the people on it."`, `«Una cosa más antes de que te sientes». Te pasan el termo. Es té. «No tomo alcohol. Está en mi rider, junto con la petición de que nadie toque el equipo. Una pista necesita reglas que protejan a la gente que está en ella».`, `«Mais uma coisa antes de você sentar». O ÆRIEL te passa a garrafa. É chá. «Eu não bebo álcool. Tá no meu rider, junto com o pedido de que ninguém encoste no equipamento. Uma pista precisa de regras que protejam as pessoas nela».`), once: true, do: { soc: 4, care: 1, flag: 'ae_sanct', quest: { sq_ae1: 'done', sq_ae2: 'active' } }, next: null },

    /* 2. THREE CITIES: the bio */
    ae2g: { branch: [{ req: gate2, to: 'ae2' }, { req: function () { return true; }, to: 'ae2w' }] },
    ae2w: { text: t(`"Cities are long answers," ÆRIEL says. "Go and listen to a couple of the guests first. Then ask me about where I've lived."`, `«Las ciudades son respuestas largas», dice ÆRIEL. «Ve a escuchar primero a un par de invitados. Luego pregúntame dónde he vivido».`, `«Cidades são respostas longas», diz o ÆRIEL. «Vai ouvir um par de convidados primeiro. Depois me pergunta onde eu morei».`), next: null },
    ae2: { text: function (s) {
      const n = ['ae_paris', 'ae_sp', 'ae_ba'].filter(function (k) { return s.flags[k]; }).length;
      return n >= 3 ? t(`"That's all three. They're in every set I play, wherever I play it."`, `«Esas son las tres. Están en cada set que toco, donde sea».`, `«São as três. Estão em todo set que eu toco, onde for».`) : t(`"I lived in Paris. I've spent long stretches in São Paulo and Buenos Aires, where friends, lovers and family keep pulling me back. Each city shaped how I do the night. Which one first?"`, `«Viví en París. He pasado largas temporadas en São Paulo y Buenos Aires, donde amistades, amantes y familia siguen haciéndome volver. Cada ciudad marcó cómo hago la noche. ¿Cuál primero?»`, `«Morei em Paris. Passei longas temporadas em São Paulo e Buenos Aires, onde amigos, amantes e família continuam me puxando de volta. Cada cidade moldou como eu faço a noite. Qual primeiro?»`);
    }, choices: [
      K('ask', t(`Paris.`, `París.`, `Paris.`), { req: function (s) { return !s.flags.ae_paris; }, next: 'ae_p' }),
      K('ask', t(`São Paulo.`, `São Paulo.`, `São Paulo.`), { req: function (s) { return !s.flags.ae_sp; }, next: 'ae_s' }),
      K('ask', t(`Buenos Aires.`, `Buenos Aires.`, `Buenos Aires.`), { req: function (s) { return !s.flags.ae_ba; }, next: 'ae_b' }),
      K('care', t(`"That's all three."`, `«Son las tres».`, `«São as três».`), { req: function (s) { return !!(s.flags.ae_paris && s.flags.ae_sp && s.flags.ae_ba); }, next: 'ae2d' }),
      LEAVE()
    ] },
    ae_p: { text: t(`"Paris showed me that counterculture can be elegant. And that spontaneity and real creation are worth chasing, even when it's inconvenient."`, `«París me enseñó que la contracultura puede ser elegante. Y que vale la pena perseguir la espontaneidad y la creación genuina, aunque sea incómodo».`, `«Paris me mostrou que a contracultura pode ser elegante. E que vale a pena perseguir a espontaneidade e a criação genuína, mesmo quando é inconveniente».`), once: true, do: { soc: 2, flag: 'ae_paris' }, next: 'ae2' },
    ae_s: { text: t(`"São Paulo's vast queer underground proved that artistic excellence, eroticism and political conviction can share a dancefloor. The nights are bombastic. I mean that as the highest praise."`, `«El vasto underground queer de São Paulo demostró que la excelencia artística, el erotismo y la convicción política pueden compartir la pista. Las noches son explosivas. Lo digo como el mayor elogio».`, `«O vasto underground queer de São Paulo provou que excelência artística, erotismo e convicção política podem dividir uma pista. As noites são bombásticas. Digo isso como o maior elogio».`), once: true, do: { soc: 2, flag: 'ae_sp' }, next: 'ae2' },
    ae_b: { text: t(`"Buenos Aires added irreverence: a punk, bohemian hunger for breaking with whatever has become the norm." A small smile. "It keeps me honest. Anything that's become the norm gets looked at twice."`, `«Buenos Aires sumó irreverencia: un hambre punk y bohemia de romper con lo que se ha convertido en norma». Una sonrisa pequeña. «Me mantiene honesto. Todo lo que se vuelve norma se mira dos veces».`, `«Buenos Aires acrescentou irreverência: uma fome punk e boêmia de romper com o que virou norma». Um sorriso pequeno. «Isso me mantém honesto. Tudo que vira norma é olhado duas vezes».`), once: true, do: { soc: 2, flag: 'ae_ba' }, next: 'ae2' },
    ae2d: { text: t(`"I bring all three back to Santiago, and wherever I go." They hold the thermos out for you to pour some. "You listened. That's the most Paris thing anyone's done tonight."`, `«Traigo las tres de vuelta a Santiago, y adonde voy». Estiran el termo para que te sirvas. «Escuchaste. Es lo más parisino que alguien ha hecho esta noche».`, `«Trago as três de volta pra Santiago, e aonde eu for». O ÆRIEL estende a garrafa pra você se servir. «Você ouviu. É a coisa mais parisiense que alguém fez hoje à noite».`), once: true, do: { soc: 4, fun: 2, flag: 'ae_cities', quest: { sq_ae2: 'done', sq_ae3: 'active' } }, next: null },

    /* 3. THE PARTY WITH THE DOOR: Æ000.X */
    ae3g: { branch: [{ req: gate3, to: 'ae3' }, { req: function () { return true; }, to: 'ae3w' }] },
    ae3w: { text: t(`ÆRIEL tilts their head toward the stairs. "The building isn't quiet yet. Ask me about the party when the neighbours have been dealt with. It's a good conversation to have with a closed door."`, `ÆRIEL inclina la cabeza hacia la escalera. «El edificio todavía no está tranquilo. Pregúntame por la fiesta cuando hayan resuelto lo de los vecinos. Es una buena conversación para tener con la puerta cerrada».`, `O ÆRIEL inclina a cabeça na direção da escada. «O prédio ainda não tá calmo. Me pergunta da festa quando os vizinhos tiverem sido resolvidos. É uma boa conversa pra ter de porta fechada».`), next: null },
    ae3: {
      text: t(`"In April 2026 I founded Æ000.X: an invitation-only party in Santiago. I'm its conceptual lead." ÆRIEL says it flatly, then lets it warm. "It builds an intentional community around music, counterculture and desire."`, `«En abril de 2026 fundé Æ000.X: una fiesta en Santiago solo con invitación. Soy su líder conceptual». ÆRIEL lo dice sin adornos, luego deja que se entibie. «Construye una comunidad intencional en torno a la música, la contracultura y el deseo».`, `«Em abril de 2026 eu fundei a Æ000.X: uma festa em Santiago só com convite. Sou o líder conceitual». O ÆRIEL diz sem enfeite, depois deixa esquentar. «Constrói uma comunidade intencional em torno da música, da contracultura e do desejo».`),
      choices: [
        K('ask', t(`"Why a door at all?"`, `«¿Por qué una puerta?»`, `«Por que uma porta?»`), { next: 'ae3b' }),
        K('honest', t(`"Tonight a landlord stood at a door like that."`, `«Esta noche un dueño estuvo en una puerta así».`, `«Hoje um dono ficou numa porta assim».`), { next: 'ae3c' })
      ]
    },
    ae3b: { text: t(`"It's a direct response to the gentrification and commodification of techno. The door is how we say it isn't for sale." A pause. "It runs on principle, care and experimentation. Each edition is curated as a whole, from the guest list to the music. That's why I read the forms."`, `«Es una respuesta directa a la gentrificación y la mercantilización del techno. La puerta es cómo decimos que no está en venta». Una pausa. «Se sostiene sobre principios, cuidado y experimentación. Cada edición se cura como un todo, desde la lista de invitadxs hasta la música. Por eso leo los formularios».`, `«É uma resposta direta à gentrificação e à mercantilização do techno. A porta é como a gente diz que não tá à venda». Uma pausa. «Funciona com princípio, cuidado e experimentação. Cada edição é curada como um todo, da lista de convidados até a música. Por isso eu leio os formulários».`), next: 'ae3d' },
    ae3c: { text: t(`"Then you saw the other kind of door." ÆRIEL's face does not move. "A rent, an owner, a complaint. Æ000.X is a response to a city that sells and prices everything. We try to answer with care, on purpose, from the guest list to the music."`, `«Entonces viste el otro tipo de puerta». La cara de ÆRIEL no se mueve. «Un alquiler, un dueño, una queja. Æ000.X es una respuesta a una ciudad que lo vende y lo tasa todo. Intentamos responder con cuidado, a propósito, desde la lista de invitadxs hasta la música».`, `«Então você viu o outro tipo de porta». O rosto do ÆRIEL não se mexe. «Um aluguel, um dono, uma reclamação. A Æ000.X é uma resposta a uma cidade que vende e põe preço em tudo. A gente tenta responder com cuidado, de propósito, da lista de convidados até a música».`), next: 'ae3d' },
    ae3d: { text: t(`"The party is the clearest picture of how I think a night should be held." They look at you. "Held. Not run. If you ever fill in a form and hate every word of it, you'll have understood the point."`, `«La fiesta es la imagen más clara de cómo creo que debe sostenerse una noche». Te miran. «Sostenerse. No administrarse. Si alguna vez llenas un formulario y odias cada palabra, habrás entendido el punto».`, `«A festa é a imagem mais clara de como eu acho que uma noite deve ser sustentada». O ÆRIEL te olha. «Sustentada. Não gerida. Se um dia você preencher um formulário e odiar cada palavra, vai ter entendido o ponto».`), once: true, do: { soc: 4, care: 1, flag: 'ae_party', quest: { sq_ae3: 'done', sq_ae4: 'active' } }, next: null },

    /* 4. AWAY FROM THE DECKS: the bio's last lines and the rider */
    ae4g: { branch: [{ req: gate4, to: 'ae4' }, { req: function () { return true; }, to: 'ae4w' }] },
    ae4w: { text: t(`"Ask me when your people are sorted," ÆRIEL says. "This one's the quiet part. I like to tell it to someone who isn't carrying anybody."`, `«Pregúntame cuando tu gente esté resuelta», dice ÆRIEL. «Esta es la parte tranquila. Me gusta contarla a alguien que no está cargando a nadie».`, `«Pergunta quando sua galera tiver resolvida», diz o ÆRIEL. «Essa é a parte calma. Gosto de contar pra alguém que não tá carregando ninguém».`), next: null },
    ae4: {
      text: t(`"Away from the decks I write essays, and I photograph nightlife on 35mm and Polaroid." A dry little pause. "And I have a boring day job. Very boring. I'd tell you what it is but you'd be asleep before the noun."`, `«Fuera de la cabina escribo ensayos y fotografío la noche en película de 35 mm y Polaroid». Una pausa seca y breve. «Y tengo un trabajo diurno aburrido. Muy aburrido. Te diría cuál es, pero te dormirías antes del sustantivo».`, `«Longe da cabine eu escrevo ensaios e fotografo a noite em filme 35 mm e Polaroid». Uma pausa seca e breve. «E tenho um trabalho diurno chato. Muito chato. Eu te diria qual é, mas você dormia antes do substantivo».`),
      choices: [
        K('ask', t(`"Photographs? On a night with no photos?"`, `«¿Fotos? ¿En una noche sin fotos?»`, `«Fotos? Numa noite sem fotos?»`), { next: 'ae4b' }),
        K('ask', t(`"What's in the rider?"`, `«¿Qué hay en el rider?»`, `«O que tem no rider?»`), { next: 'ae4c' })
      ]
    },
    ae4b: { text: t(`"Film is slow. It makes you look before you press, and it can't be posted from the floor. The parties I run have no photographs, and I keep that rule for everyone, me included. If a VIP area exists at all, my rider asks for zero contact and no photographs with the people around me."`, `«La película es lenta. Te hace mirar antes de apretar, y no se puede publicar desde la pista. Las fiestas que hago no tienen fotos, y cumplo esa regla para todos, yo incluido. Si existe un área VIP, mi rider pide cero contacto y ninguna foto con la gente de alrededor».`, `«Filme é lento. Faz você olhar antes de apertar, e não dá pra postar da pista. As festas que eu faço não têm foto, e eu cumpro essa regra pra todo mundo, eu incluído. Se existe uma área VIP, meu rider pede zero contato e nenhuma foto com as pessoas em volta».`), next: 'ae4d' },
    ae4c: { text: t(`"A sound check, so the bass doesn't clip and nobody's ears are hurt. No VIP areas: if people dance behind the decks, access is equal and nobody touches the equipment. And I don't drink alcohol." They lift the thermos. "Tea. Sugar-free. Every time."`, `«Una prueba de sonido, para que el bajo no sature y a nadie le duelan los oídos. Sin áreas VIP: si hay gente bailando detrás de la cabina, el acceso es igual para todos y nadie toca el equipo. Y no tomo alcohol». Levantan el termo. «Té. Sin azúcar. Siempre».`, `«Uma passagem de som, pra o grave não saturar e ninguém machucar os ouvidos. Sem área VIP: se tem gente dançando atrás da cabine, o acesso é igual pra todos e ninguém encosta no equipamento. E eu não bebo álcool». O ÆRIEL levanta a garrafa. «Chá. Sem açúcar. Sempre».`), next: 'ae4d' },
    ae4d: { text: t(`ÆRIEL screws the cap back on. "That's the project. Not a brand, not a lifestyle: a way of holding people for a few hours, and what comes with it." A pause. "Languages: Spanish, English, Portuguese, French. I'll say good morning in any of them."`, `ÆRIEL vuelve a poner la tapa. «Ese es el proyecto. No una marca, no un estilo de vida: una forma de sostener a la gente por unas horas, y lo que viene con eso». Una pausa. «Idiomas: español, inglés, portugués, francés. Te doy los buenos días en cualquiera».`, `O ÆRIEL recoloca a tampa. «Esse é o projeto. Não uma marca, não um estilo de vida: um jeito de sustentar as pessoas por algumas horas, e o que vem com isso». Uma pausa. «Idiomas: espanhol, inglês, português, francês. Te dou bom dia em qualquer um».`), once: true, do: { soc: 5, care: 1, flag: 'ae_known', quest: { sq_ae4: 'done' } }, next: null }
  };

  const R = D.af_cam_resident;
  if (R) {
    Object.keys(N).forEach(function (k) { R.nodes[k] = N[k]; });
    const a = R.nodes.a;
    if (Array.isArray(a.choices)) {
      const c = K('ask', t(`Ask about the project.`, `Preguntar por el proyecto.`, `Perguntar do projeto.`), { next: 'ae_st', __ae: true, do: { time: 4 } });
      a.choices.splice(Math.max(0, a.choices.length - 1), 0, c);
    }
  }

  /* ÆRIEL's Tuesday text once the project is known */
  const m0 = EM.story.morning;
  EM.story.morning = function (s) {
    const msgs = m0(s);
    if (s.ended === 'after' && s.flags.ae_known && Array.isArray(msgs)) {
      msgs.push({ who: 'resident', name: null, time: 'TUE 20:15', t: t(`ÆRIEL: you asked all the questions. nobody does. there's a form at aeriel.net/booking for the rest. i read every one. at three a.m. with feelings. sleep.`, `ÆRIEL: hiciste todas las preguntas. nadie lo hace. el resto está en aeriel.net/booking. leo cada formulario. a las tres de la mañana, con sentimientos. duerme.`, `ÆRIEL: você fez todas as perguntas. ninguém faz. o resto tá em aeriel.net/booking. eu leio cada formulário. às três da manhã, com sentimentos. dorme.`) });
    }
    return msgs;
  };
})();

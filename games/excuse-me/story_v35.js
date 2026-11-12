/* EXCUSE ME — story v35: the DJs and the stylist.
   FRAMES SHELL (Marcos Concha) and APÜD are both DJs; tonight they are helping ÆRIEL. FRAMES gets three questions (his name, how long
   he has known ÆRIEL, his day job), APÜD gets three (a DJ helping ÆRIEL, the love of his life on a Mediterranean island, the
   psychologist whose real passion is bouncing around). LEONIDAS stands beside the coat check in full glam, appalled that the room allows
   no photographs, a friend of ÆRIEL. Be kind to him and he puts his magic to work: 30 minutes, then the character creator opens as a
   pop-up. He is always at the after party and does it again there. Pronouns: FRAMES, APÜD and Leonidas are he; ÆRIEL stays they. */
'use strict';
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
    job: { text: t(`"I am a professional reality show competitor… maybe I'm an influencer… maybe I'm just a psychologist."`, `«Soy un competidor profesional de reality shows… quizá soy influencer… quizá solo soy psicólogo».`, `«Sou um competidor profissional de reality show… talvez eu seja influenciador… talvez seja só psicólogo».`), choices: [
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
  framesOn('frames_roof_talk', ['a']);
  framesOn('af_cam_frames', ['a']);
  /* FRAMES is he */
  ['They tap the sticker.'].forEach(function () { /* handled in story_v34b.js */ });

  /* ---------------------------------------------------------------- APÜD: three questions */
  const AQ = {
    dj: { text: t(`"HardBounce. I'm a DJ, same as FRAMES, and tonight I'm just helping ÆRIEL. Someone has to keep the floor honest while FRAMES makes speeches about names."`, `«HardBounce. Soy DJ, igual que FRAMES, y esta noche solo ayudo a ÆRIEL. Alguien tiene que mantener honesta la pista mientras FRAMES da discursos sobre nombres».`, `«HardBounce. Sou DJ, que nem o FRAMES, e hoje só tô ajudando o ÆRIEL. Alguém precisa manter a pista honesta enquanto o FRAMES faz discurso sobre nomes».`), once: true, do: { soc: 2, flag: 'apud_dj' }, next: null },
    love: { text: t(`He keeps his eyes on the horizon. "The love of my life lives on an island in the Mediterranean. Far from here. I hold the horizon at sunrise because it's the one edge that touches both of us."`, `Mantiene los ojos en el horizonte. «El amor de mi vida vive en una isla del Mediterráneo. Lejos de aquí. Sostengo el horizonte al amanecer porque es el único borde que nos toca a los dos».`, `Ele mantém os olhos no horizonte. «O amor da minha vida mora numa ilha do Mediterrâneo. Longe daqui. Eu seguro o horizonte no nascer do sol porque é a única borda que toca nós dois».`), choices: [
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
  (function () {
    const d = D.apud_roof_talk; if (!d) return;
    Object.keys(AQ).forEach(function (k) { d.nodes[k] = AQ[k]; });
    const a = d.nodes.a;
    if (Array.isArray(a.choices) && !a.choices.some(function (c) { return c.__aq; })) {
      [
        K('ask', t(`"Are you a DJ too?"`, `«¿Tú también eres DJ?»`, `«Você também é DJ?»`), { next: 'dj', __aq: true, do: { time: 2 } }),
        K('ask', t(`"Is there someone waiting for you?"`, `«¿Hay alguien que te espere?»`, `«Tem alguém esperando você?»`), { next: 'love', __aq: true, do: { time: 2 } }),
        K('ask', t(`"What do you do when you're not DJing?"`, `«¿Qué haces cuando no estás pinchando?»`, `«O que você faz quando não tá discotecando?»`), { next: 'psy', __aq: true, do: { time: 2 } })
      ].forEach(function (c) { a.choices.splice(Math.max(0, a.choices.length - 1), 0, c); });
    }
  })();

  /* ---------------------------------------------------------------- LEONIDAS */
  EM.CAST.leonidas = { name: 'LEONIDAS', look: { skin: 3, build: 0, expr: 3, hair: 22, hc: 13, top: 20, tc: 5, bottom: 8, bc: 10, shoes: 3, ac: 8, hat: 0, face: 4, neck: 3, ear: 3, makeup: 6, wrist: 2 } };
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
    if (s.ended === 'after' && s.flags.g_leonidas_open && Array.isArray(msgs)) {
      msgs.push({ who: 'leonidas', name: null, time: 'TUE 19:40', t: t(`darling. i have been thinking about the green satin at 4:12. i am describing it to everyone. nobody can prove it. i've never been happier. kisses. do not touch your hair.`, `cariño. he estado pensando en el satén verde de las 4:12. se lo describo a todos. nadie puede probarlo. nunca he sido más feliz. besos. no te toques el pelo.`, `querido. fiquei pensando no cetim verde das 4:12. tô descrevendo pra todo mundo. ninguém pode provar. nunca fui tão feliz. beijos. não mexe no cabelo.`) });
    }
    return msgs;
  };
})();

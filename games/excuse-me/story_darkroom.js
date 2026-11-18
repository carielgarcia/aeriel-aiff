/* EXCUSE ME — the dark room: sensual sanctuary, consent circles, and 4-step cruising. */
'use strict';
/* ---- consolidated from story_v10.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const NF = EM.NF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`"I'll let you be."`, `«Los dejo».`, `«Vou deixar vocês».`), { free: true, next: null }); };
  function cast(id, name, o) { EM.CAST[id] = { name: name, look: Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 3, bottom: 1, bc: 1, acc: 0, wide: false }, o) }; }

  cast('pau', 'PAU', { skin: 4, hair: 0, hc: 0, expr: 1, top: 2, tc: 3, bottom: 1, bc: 1, acc: 0, wide: true });
  cast('dg1', 'GAME', { skin: 1, hair: 3, hc: 2, expr: 2, top: 5, tc: 6, bottom: 1, bc: 4, acc: 0 });
  cast('dg2', 'GAME', { skin: 3, hair: 7, hc: 5, expr: 1, top: 7, tc: 1, bottom: 3, bc: 1, acc: 6 });
  cast('dg3', 'GAME', { skin: 0, hair: 1, hc: 8, expr: 2, top: 1, tc: 4, bottom: 1, bc: 2, acc: 3 });
  cast('lyra', 'LYRA', { skin: 2, hair: 3, hc: 9, expr: 0, top: 9, tc: 7, bottom: 0, bc: 1, acc: 6 });
  cast('amar', 'AMAR', { skin: 3, hair: 5, hc: 1, expr: 1, top: 4, tc: 8, bottom: 1, bc: 1, acc: 0 });
  cast('bela', 'BELA', { skin: 1, hair: 6, hc: 7, expr: 1, top: 6, tc: 0, bottom: 0, bc: 6, acc: 4 });
  cast('slowd', 'SLOW', { skin: 5, hair: 2, hc: 0, expr: 1, top: 3, tc: 5, bottom: 1, bc: 1, acc: 1 });
  cast('conf', 'CORNER', { skin: 0, hair: 4, hc: 3, expr: 3, top: 0, tc: 11, bottom: 1, bc: 0, acc: 0 });
  cast('iso', 'ISO', { skin: 4, hair: 1, hc: 0, expr: 1, top: 8, tc: 9, bottom: 1, bc: 3, acc: 5 });

  const AFTER = {
    fun: 15, soc: -3, hp: -2, weird: -2, time: 30
  };

  /* ============================================================ PAU: HANDS */
  D.pau = {
    who: 'pau', role: t('SHOULDERS, BACKS, FEET', 'HOMBROS, ESPALDAS, PIES', 'OMBROS, COSTAS, PÉS'), start: 'a', nodes: {
      a: {
        text: t(`A big, warm shape sits on a stool in the black. "Hands, not hurry," says a voice like a rug. "I ask before every inch, and you can change your mind every inch. Shoulders? Back? Feet?"`, `Una forma grande y cálida está sentada en un taburete en lo negro. «Manos, no apuro», dice una voz como una alfombra. «Pregunto antes de cada centímetro, y puedes cambiar de idea en cada centímetro. ¿Hombros? ¿Espalda? ¿Pies?»`, `Uma forma grande e quente está sentada num banquinho no breu. «Mãos, sem pressa», diz uma voz como um tapete. «Eu pergunto antes de cada centímetro, e você pode mudar de ideia a cada centímetro. Ombros? Costas? Pés?»`),
        choices: [
          K('care', t(`Shoulders, please.`, `Hombros, por favor.`, `Ombros, por favor.`), { req: { no: 'pau_sh' }, do: { hp: 5, soc: 4, fun: 2, time: 8, flag: 'pau_sh' }, next: 'more', react: t(`Two thumbs find the knot you have been wearing since 22:00 and work it loose. You sigh out loud.`, `Dos pulgares encuentran el nudo que llevas desde las 22:00 y lo aflojan. Suspiras en voz alta.`, `Dois polegares acham o nó que você carrega desde as 22:00 e o soltam. Você suspira em voz alta.`) }),
          K('care', t(`Feet. I've been dancing for hours.`, `Los pies. Llevo horas bailando.`, `Os pés. Faz horas que eu danço.`), { req: { no: 'pau_ft' }, do: { hp: 4, fun: 3, weird: -2, time: 8, flag: 'pau_ft' }, next: 'more', react: t(`A shoe, a sock, a warm palm and two thumbs: the single most religious experience of the night. You promise yourself you will never wear those shoes again.`, `Un zapato, una media, una palma tibia y dos pulgares: la experiencia más religiosa de la noche. Te prometes que nunca más usarás esos zapatos.`, `Um sapato, uma meia, uma palma morna e dois polegares: a experiência mais religiosa da noite. Você promete a si mesmo que nunca mais vai usar esses sapatos.`) }),
          K('smooth', t(`"Slow and warm. All of it. If you're up for that."`, `«Lento y cálido. Todo. Si te parece bien».`, `«Devagar e quente. Tudo. Se você estiver a fim».`), { next: 'slow' }),
          LEAVE()
        ]
      },
      more: {
        text: t(`"Better?" A low laugh. "That's the thing about hands: they know things nobody told them."`, `«¿Mejor?» Una risa baja. «Eso tienen las manos: saben cosas que nadie les contó».`, `«Melhor?» Uma risada baixa. «O lance das mãos é esse: elas sabem coisas que ninguém contou».`),
        next: 'a'
      },
      slow: {
        text: t(`The hands stop. "Say that again, with words, so I'm sure." A pause where nobody is breathing. "I'm up for it if you are. I'll tell you what I'm doing before I do it. You say stop and I stop, mid-motion, no sulking. Do you want to go on?"`, `Las manos se detienen. «Dilo otra vez, con palabras, para estar seguro». Una pausa en la que nadie respira. «Estoy dispuesto si tú lo estás. Te digo lo que hago antes de hacerlo. Dices para y paro, a mitad del movimiento, sin hacer pucheros. ¿Quieres seguir?»`, `As mãos param. «Diz de novo, com palavras, pra eu ter certeza». Uma pausa em que ninguém respira. «Eu topo se você topar. Te digo o que vou fazer antes de fazer. Você diz pare e eu paro, no meio do movimento, sem fazer bico. Quer continuar?»`),
        choices: [
          K('makeout', t(`"Yes. Kiss me first. Then see where it goes."`, `«Sí. Bésame primero. Luego vemos adónde va».`, `«Sim. Me beije primeiro. Depois a gente vê onde vai».`), { next: 'fade' }),
          K('chill', t(`"Actually, just the shoulders. Thank you for asking."`, `«En realidad, solo los hombros. Gracias por preguntar».`, `«Na verdade, só os ombros. Valeu por perguntar».`), { req: { no: 'pau_sh' }, do: { soc: 2, hp: 3, flag: 'pau_sh' }, next: 'a' }),
          K('chill', t(`"I want to stop. Thank you."`, `«Quiero parar. Gracias».`, `«Quero parar. {Obrigado|Obrigada|Valeu}».`), { do: { soc: 2 }, next: null, react: t(`"Done. Thank you for telling me." Not a flicker of disappointment. It is the nicest "stop" you have ever had.`, `«Listo. Gracias por decírmelo». Ni un parpadeo de decepción. Es el «para» más amable que has tenido.`, `«Pronto. Valeu por me dizer». Nem um lampejo de decepção. É o «pare» mais gentil que você já teve.`) })
        ]
      },
      fade: {
        text: t(`A kiss, exactly as slow as promised. Then hands that say what they're about to do and wait for your yes. Buttons. Breath. A long minute in which the whole building, the beat, the crowd, the clock all politely leave. You come back some time later, flushed, rumpled, and so thoroughly looked after that you could cry.`, `Un beso, exactamente tan lento como se prometió. Luego manos que dicen lo que van a hacer y esperan tu sí. Botones. Aliento. Un minuto largo en el que el edificio, el ritmo, la multitud y el reloj se van con educación. Vuelves un rato después con las mejillas rojas y el pelo revuelto, después de tanto cuidado que podrías llorar.`, `Um beijo, exatamente tão lento quanto prometido. Depois mãos que dizem o que vão fazer e esperam o seu sim. Botões. Respiração. Um minuto longo em que o prédio, a batida, a multidão e o relógio saem educadamente. Você volta algum tempo depois com o rosto corado e o cabelo bagunçado, depois de tanto cuidado que dá vontade de chorar.`),
        do: Object.assign({}, AFTER, { flag: ['pau_night', 'dr_intimate'] }), next: null
      }
    }
  };

  /* ============================================================ THE BLINDFOLD GAME */
  D.dgame = {
    who: 'dg1', role: t('THE GUESSING GAME', 'EL JUEGO DE ADIVINAR', 'O JOGO DE ADIVINHAR'), start: 'a', nodes: {
      a: {
        text: t(`Three voices in a circle, giggling. "New rules! You get a blindfold you don't need (it's already dark, but the principle is sacred). We hold out a hand. You guess whose. Wrong guesses get tickled. Right guesses get a kiss on the knuckles. Everything is asked, everything can be 'no'."`, `Tres voces en círculo, riéndose. «¡Reglas nuevas! Te ponemos una venda que no necesitas (ya está oscuro, pero el principio es sagrado). Extendemos una mano. Adivinas de quién. Las respuestas equivocadas reciben cosquillas. Las correctas, un beso en los nudillos. Todo se pregunta, todo puede ser “no”».`, `Três vozes num círculo, rindo. «Regras novas! A gente te dá uma venda que você não precisa (já está escuro, mas o princípio é sagrado). A gente estende uma mão. Você adivinha de quem. Palpite errado leva cócegas. Palpite certo ganha um beijo nos dedos. Tudo é perguntado, tudo pode ser “não”».`),
        choices: [
          K('bold', t(`"I'm in. Hold out a hand."`, `«Me apunto. Extiendan una mano».`, `«Tô dentro. Estendam uma mão».`), { call: 'dg_round', next: null, free: true }),
          K('makeout', t(`"Round two: guess by kiss?" (Ask first.)`, `«Segunda ronda: ¿adivinar por beso?» (Pregunta primero.)`, `«Segunda rodada: adivinhar por beijo?» (Pergunte antes.)`), { req: { flag: 'dg_played' }, next: 'kiss' }),
          LEAVE()
        ]
      },
      kiss: {
        text: t(`A pause full of delighted breathing. "…One of us says yes. One of us says maybe. One of us says: ask the maybe slowly." A hand finds yours and squeezes twice, which in this room is a vote.`, `Una pausa llena de respiración encantada. «…Uno de nosotros dice sí. Uno dice quizás. Uno dice: pregúntale al quizás despacio». Una mano encuentra la tuya y aprieta dos veces, lo que en este cuarto es un voto.`, `Uma pausa cheia de respiração encantada. «…Um de nós diz sim. Um diz talvez. Um diz: pergunta pro talvez devagar». Uma mão encontra a sua e aperta duas vezes, o que nesta sala é um voto.`),
        choices: [
          K('makeout', t(`Ask the maybe. Slowly.`, `Preguntarle al quizás. Despacio.`, `Perguntar pro talvez. Devagar.`), { do: { makeout: { p: 0.62, time: 8, who: 'dgame' } }, next: null }),
          K('chill', t(`"Thank you. I'll keep the knuckle kisses."`, `«Gracias. Me quedo con los besos en los nudillos».`, `«Valeu. Fico com os beijos nos dedos».`), { do: { soc: 2 }, next: null, free: true })
        ]
      }
    }
  };
  S.dg_round = function () {
    const s = EM.state; s.flags.dg_played = true;
    const r = Math.random();
    if (r < 0.45) { L.apply({ fun: 7, soc: 3 }); U.toast({ icon: 'heart', text: t(`You hold a hand in the black for three seconds and say a name. A gasp, applause, and a warm, smacking kiss on your knuckles. "HOW?" "Callus on the left thumb," you say. You will take this to your grave.`, `Sostienes una mano en lo negro tres segundos y dices un nombre. Un jadeo, aplausos y un beso cálido y sonoro en tus nudillos. «¿CÓMO?» «Callo en el pulgar izquierdo», dices. Te lo vas a llevar a la tumba.`, `Você segura uma mão no breu por três segundos e diz um nome. Um suspiro, aplausos e um beijo quente e estalado nos seus dedos. «COMO?» «Calo no polegar esquerdo», você diz. Vai levar isso pro túmulo.`), kind: 'good', ms: 6000 }); }
    else if (r < 0.8) { L.apply({ fun: 5, soc: 1, weird: 1 }); U.toast({ icon: 'sweat', text: t(`You guess wrong, confidently, and are punished with a determined, merciless tickling by three people. You scream a sound you did not know you owned. Somebody apologises through laughter.`, `Adivinas mal, con seguridad, y te castigan con unas cosquillas decididas e implacables de tres personas. Gritas un sonido que no sabías que tenías. Alguien pide perdón entre risas.`, `Você erra, com confiança, e é castigado com uma cócega decidida e impiedosa de três pessoas. Você grita um som que não sabia que tinha. Alguém pede desculpa rindo.`), kind: 'info', ms: 6000 }); }
    else { L.apply({ fun: 3, soc: 2 }); U.toast({ icon: 'heart', text: t(`You guess the right name for the wrong hand, which turns out to be the best possible mistake. The owner of the hand is very touched. You have made a friend by being wrong in the dark.`, `Aciertas el nombre equivocado para la mano equivocada, lo cual resulta ser el mejor error posible. El dueño de la mano está muy conmovido. Hiciste una amistad equivocándote en la oscuridad.`, `Você acerta o nome da mão errada, o que acaba sendo o melhor erro possível. O dono da mão fica muito tocado. Você fez uma amizade errando no escuro.`), kind: 'good', ms: 6000 }); }
  };

  /* ============================================================ LYRA: THE VOICE (and the brave word) */
  D.lyra = {
    who: 'lyra', role: t('READING ALOUD, VERY SOFTLY', 'LEYENDO EN VOZ MUY BAJA', 'LENDO EM VOZ BEM BAIXINHA'), start: 'a', nodes: {
      a: {
        text: t(`Somebody is reading in the dark from a notebook that glows faintly orange, in a voice you could lean on. "Stories from other people's best nights. Anonymous. Written down with permission. Tender, funny, or the kind you'll need a drink of water after. Choose."`, `Alguien lee en la oscuridad desde un cuaderno que brilla apenas anaranjado, con una voz en la que podrías apoyarte. «Historias de las mejores noches de otras personas. Anónimas. Escritas con permiso. Tiernas, graciosas, o de las que después hace falta un vaso de agua. Elige».`, `Alguém lê no escuro de um caderno que brilha fraquinho laranja, com uma voz em que você poderia se apoiar. «Histórias das melhores noites de outras pessoas. Anônimas. Escritas com permissão. Ternas, engraçadas, ou daquelas que depois pedem um copo d'água. Escolha».`),
        choices: [
          K('chill', t(`The tender one.`, `La tierna.`, `A terna.`), { do: { soc: 5, fun: 2, time: 5 }, next: null, react: t(`"We had never touched before. She put her palm flat on my chest and said 'there you are'. That was all. That was the whole night. It was enough for ten years." The page turns. You did not expect to be a little wet around the eyes.`, `«Nunca nos habíamos tocado. Puso la palma plana en mi pecho y dijo “ahí estás”. Eso fue todo. Fue toda la noche. Alcanzó para diez años». Pasa la página. No esperabas tener los ojos un poco húmedos.`, `«A gente nunca tinha se tocado. Ela pôs a palma aberta no meu peito e disse “aí está você”. Foi só isso. Foi a noite inteira. Bastou por dez anos». A página vira. Você não esperava ficar com os olhos um pouco úmidos.`) }),
          K('joke', t(`The funny one.`, `La graciosa.`, `A engraçada.`), { do: { fun: 6, soc: 2, time: 5 }, next: null, react: t(`"So I said 'do you want to dance' and the person said 'I don't dance, I sway like a man on a ferry', and I said 'perfect, I'm a ferry', and for forty minutes we were a bad, beautiful harbour." You are laughing quietly into your sleeve.`, `«Entonces dije “¿quieres bailar?” y la persona dijo “yo no bailo, me balanceo como un hombre en un ferry”, y dije “perfecto, yo soy un ferry”, y durante cuarenta minutos fuimos un puerto malo y hermoso». Te ríes en voz baja contra la manga.`, `«Então eu disse “quer dançar?” e a pessoa disse “eu não danço, eu balanço feito um homem numa balsa”, e eu disse “perfeito, eu sou uma balsa”, e por quarenta minutos a gente foi um porto ruim e lindo». Você ri baixinho na manga.`) }),
          K('smooth', t(`The one you need water after.`, `La que da sed.`, `A que dá sede.`), { do: { fun: 6, weird: 1, hp: -1, soc: -1, time: 6, flag: 'lyra_hot' }, next: null, react: t(`Slowly, plainly, without anything crude in it, the voice describes a night with all the clothes in a heap, all the hands asking first, every minute lengthened by wanting. The passage ends on a single sentence: "and then we slept like bread." You find you are fanning yourself with a flyer.`, `Despacio, con claridad, sin nada vulgar, la voz describe una noche con toda la ropa en un montón, todas las manos preguntando primero, cada minuto alargado por el deseo. El pasaje termina en una sola frase: «y luego dormimos como pan». Te encuentras abanicándote con un volante.`, `Devagar, com clareza, sem nada vulgar, a voz descreve uma noite com toda a roupa num monte, todas as mãos perguntando primeiro, cada minuto alongado pelo desejo. A passagem termina numa frase só: «e depois dormimos feito pão». Você se vê abanando com um flyer.`) }),
          K('ask', t(`"Give me one word. A brave one."`, `«Dame una palabra. Una valiente».`, `«Me dá uma palavra. Uma corajosa».`), { req: { flag: 'sia_task', no: 'word_brave' }, do: { flag: 'word_brave', soc: 2 }, next: null, react: t(`The voice does not hesitate. "Stay," it says. "Brave is staying when the feeling arrives. If it's for a poem, I never read it to you."`, `La voz no duda. «Quédate», dice. «Ser valiente es quedarse cuando llega el sentimiento. Si es para un poema, yo nunca te lo leí».`, `A voz não hesita. «Fica», diz. «Ser corajoso é ficar quando o sentimento chega. Se é pra um poema, eu nunca li isso pra você».`) }),
          LEAVE()
        ]
      }
    }
  };

  /* ============================================================ A COUPLE LOOKING FOR A THIRD */
  D.dpair = {
    who: 'amar', role: t('LOOKING FOR A THIRD', 'BUSCANDO A UN TERCERO', 'PROCURANDO UM TERCEIRO'), start: 'a', nodes: {
      a: {
        text: t(`Two voices, close, like one breath in two parts. "Hi. We're a couple, and we'd like company tonight, and we've agreed on the rules in the queue, in writing, on a napkin: nobody does anything the other two haven't heard a yes to. We'd like to meet you first. Hello."`, `Dos voces, cerca, como una sola respiración en dos partes. «Hola. Somos pareja, y queremos compañía esta noche, y acordamos las reglas en la fila, por escrito, en una servilleta: nadie hace nada que los otros dos no hayan oído un sí. Nos gustaría conocerte primero. Hola».`, `Duas vozes, perto, como uma respiração só em duas partes. «Oi. Somos um casal, e queremos companhia esta noite, e combinamos as regras na fila, por escrito, num guardanapo: ninguém faz nada que os outros dois não tenham ouvido um sim. A gente gostaria de te conhecer primeiro. Oi».`),
        choices: [
          K('ask', t(`"Tell me what you like."`, `«Cuéntenme qué les gusta».`, `«Me contem do que vocês gostam».`), { next: 'like' }),
          K('dance', t(`"Dance with us first."`, `«Bailen conmigo primero».`, `«Dancem comigo primeiro».`), { call: 'pd_amar', next: null, free: true }),
          K('makeout', t(`"I'd like to. Tell me the rules again."`, `«Me gustaría. Repítanme las reglas».`, `«Eu gostaria. Repitam as regras».`), { next: 'rules' }),
          LEAVE()
        ]
      },
      like: {
        text: t(`"Slow. Talking. Hands that ask. Somebody who laughs when it's awkward, because it will be awkward, and that's the best part." A pause. "And you? What do you like? What is a no?"`, `«Lento. Hablar. Manos que preguntan. Alguien que se ría cuando se ponga raro, porque se va a poner raro, y esa es la mejor parte». Una pausa. «¿Y tú? ¿Qué te gusta? ¿Qué es un no?»`, `«Devagar. Conversa. Mãos que perguntam. Alguém que ri quando fica esquisito, porque vai ficar esquisito, e essa é a melhor parte». Uma pausa. «E você? Do que você gosta? O que é um não?»`),
        once: true, do: { soc: 2, fun: 1, flag: 'dpair_warm' }, next: 'a'
      },
      rules: {
        text: t(`"One: anyone can say stop and everyone stops, without a reason. Two: nothing is a promise. Three: afterwards, water and a joke. Four: if any of us has a bad feeling at any point, we all get dressed and eat toast. Is that all right?"`, `«Una: cualquiera puede decir para y todos paramos, sin motivo. Dos: nada es una promesa. Tres: después, agua y un chiste. Cuatro: si alguno tiene mala sensación en cualquier momento, nos vestimos todos y comemos tostadas. ¿Está bien?»`, `«Uma: qualquer um pode dizer pare e todos param, sem motivo. Duas: nada é promessa. Três: depois, água e uma piada. Quatro: se algum de nós tiver má sensação a qualquer momento, todo mundo se veste e come torrada. Tudo bem?»`),
        choices: [
          K('makeout', t(`"Yes. All of that is very sexy."`, `«Sí. Todo eso es muy sexy».`, `«Sim. Tudo isso é muito sexy».`), { call: 'dpair_go', next: null, free: true }),
          K('chill', t(`"I'd like to just talk and dance, for now."`, `«Me gustaría solo hablar y bailar, por ahora».`, `«Eu gostaria só de conversar e dançar, por enquanto».`), { req: { no: 'dpair_talked' }, do: { soc: 2, flag: 'dpair_talked' }, next: 'a' }),
          K('chill', t(`"No, thank you. And thank you for asking so well."`, `«No, gracias. Y gracias por preguntar tan bien».`, `«Não, {obrigado|obrigada|valeu}. E valeu por perguntarem tão bem».`), { do: { soc: 2 }, next: null, free: true })
        ]
      }
    }
  };
  S.dpair_go = function () {
    const s = EM.state;
    const ok = Math.random() < 0.85;
    L.addTime(32);
    s.flags.dpair_done = true;
    if (ok) {
      L.apply({ fun: 17, soc: -3, hp: -3, weird: -2, flag: ['dr_intimate', 'dpair_night'] });
      U.toast({ icon: 'heart', text: t(`Hands that ask; a mouth, then another; a rhythm the three of you invent as you go and keep revising; laughter at the elbows. At one point somebody says "wait, wait, a cramp" and you all stop and laugh for a full minute. You come back into the room in somebody else's jacket, soft in the knees, with a joke you were given and an enormous bottle of water.`, `Manos que preguntan; una boca, luego otra; un ritmo que inventan los tres a medida que avanzan y siguen revisando; risa en los codos. En un momento alguien dice «espera, espera, un calambre» y se detienen y se ríen todos un minuto entero. Vuelves a la sala con la chaqueta de otra persona, con las rodillas blandas, con un chiste que te regalaron y una botella de agua enorme.`, `Mãos que perguntam; uma boca, depois outra; um ritmo que os três inventam enquanto vão e continuam revisando; riso nos cotovelos. Em certo momento alguém diz «peraí, peraí, uma câimbra» e todos param e riem por um minuto inteiro. Você volta pra sala com a jaqueta de outra pessoa, mole dos joelhos, com uma piada que te deram e uma garrafa enorme de água.`), kind: 'good', ms: 9000 });
    } else {
      L.apply({ fun: 3, soc: -1, hp: -1, flag: ['dr_awkward'] });
      U.toast({ icon: 'sweat', text: t(`It turns out three people in a dark corner is mostly an elbow problem. After eight minutes of excellent intentions and a lost sock you all agree, tenderly, that it is not tonight. You split the toast. Everyone is lovely about it, and one of you will be telling this as a favourite story for years.`, `Resulta que tres personas en un rincón oscuro es sobre todo un problema de codos. Después de ocho minutos de excelentes intenciones y una media perdida, todos acuerdan, con ternura, que no es esta noche. Se reparten la tostada. Todos son encantadores con eso, y uno de ustedes lo va a contar como historia favorita durante años.`, `Acontece que três pessoas num canto escuro é principalmente um problema de cotovelos. Depois de oito minutos de ótimas intenções e uma meia perdida, todo mundo concorda, com ternura, que não é hoje. Vocês dividem a torrada. Todo mundo é adorável nisso, e um de vocês vai contar isso como história favorita por anos.`), kind: 'info', ms: 8000 });
    }
  };

  /* ============================================================ A SLOW DANCE IN THE BLACK */
  EM.PARTNERS && (EM.PARTNERS.slowd = { tempo: 900, moves: ['sway', 'wave', 'spiral', 'sway'], win: t(`Your bodies agree on a rhythm without a word. Somewhere a sigh. "That was a small, true thing," says the person in your arms.`, `Sus cuerpos se ponen de acuerdo en un ritmo sin una palabra. En algún lugar, un suspiro. «Eso fue algo pequeño y verdadero», dice la persona entre tus brazos.`, `Seus corpos concordam num ritmo sem uma palavra. Em algum lugar, um suspiro. «Isso foi uma coisa pequena e verdadeira», diz a pessoa nos seus braços.`), lose: t(`You lose each other a little, in a gentle way. A hand finds your hip and puts you back. "Again, if you want. No rush."`, `Se pierden un poco, de una forma suave. Una mano te encuentra la cadera y te pone de nuevo en su lugar. «Otra vez, si quieres. Sin apuro».`, `Vocês se perdem um pouquinho, de um jeito gentil. Uma mão acha seu quadril e te coloca de volta. «De novo, se quiser. Sem pressa».`) });
  EM.PARTNERS && (EM.PARTNERS.amar = { tempo: 780, moves: ['sway', 'shuffle', 'wave', 'spiral'], win: t(`The two of them close around you in a dance that is half hug. "Oh, you're GOOD at this," says one. "Oh," says the other, in a different, pleased voice.`, `Los dos se cierran a tu alrededor en un baile que es medio abrazo. «Ay, ¡lo haces MUY BIEN!», dice uno. «Ay», dice el otro, con una voz distinta, complacida.`, `Os dois se fecham em volta de você numa dança que é meio abraço. «Nossa, você manda MUITO bem nisso!», diz um. «Nossa», diz o outro, com uma voz diferente, satisfeita.`), lose: t(`Three people trip gently over each other in the dark and fall into a laughing heap. "Excellent," says somebody into your shoulder. "That's how you know it's real."`, `Tres personas se tropiezan con suavidad en la oscuridad y caen en un montón riéndose. «Excelente», dice alguien contra tu hombro. «Así se sabe que es real».`, `Três pessoas tropeçam gentilmente no escuro e caem num monte rindo. «Excelente», diz alguém no seu ombro. «Assim se sabe que é real».`) });
  S.pd_slowd = function () {
    U.partnerDance('slowd', function (res) {
      if (res.grade === 'win') L.apply({ fun: 10, soc: 4, weird: -2, flag: 'slowd_warm' });
      else if (res.grade === 'partial') L.apply({ fun: 5, soc: 2 });
      else L.apply({ fun: 1 });
      L.spend(6);
    });
  };
  S.pd_amar = function () {
    U.partnerDance('amar', function (res) {
      if (res.grade === 'win') L.apply({ fun: 10, soc: 4, flag: 'dpair_warm' });
      else if (res.grade === 'partial') L.apply({ fun: 5, soc: 2 });
      else L.apply({ fun: 2 });
      L.spend(5);
      if (!EM.state.ended) U.startDialogue('dpair', { npc: 'amar' });
    });
  };
  D.slowdance = {
    who: 'slowd', role: t('WANTS TO BE LED', 'QUIERE QUE LA GUÍEN', 'QUER SER CONDUZIDA'), start: 'a', nodes: {
      a: {
        text: t(`A shape at the edge of the room sways alone to the thinnest part of the bass. A voice, low, sure of itself and shy of the question: "I never get led. I always lead. Tonight I'd like to be led by someone who'll ask where. Would you?"`, `Una forma al borde del cuarto se balancea sola en la parte más fina del bajo. Una voz, baja, segura de sí y tímida con la pregunta: «Nunca me guían. Siempre guío yo. Esta noche me gustaría que me guiara alguien que pregunte hacia dónde. ¿Lo harías?»`, `Uma forma na beira da sala balança sozinha na parte mais fina do grave. Uma voz, baixa, segura de si e tímida com a pergunta: «Eu nunca sou conduzida. Eu sempre conduzo. Hoje eu gostaria de ser conduzida por alguém que pergunte pra onde. Você conduziria?»`),
        choices: [
          K('dance', t(`"Yes. Tell me if I step on you."`, `«Sí. Dime si te piso».`, `«Sim. Me avisa se eu pisar em você».`), { call: 'pd_slowd', next: null, free: true }),
          K('chill', t(`"Another time. You'll find someone."`, `«Otro día. Vas a encontrar a alguien».`, `«Outra hora. Você vai achar alguém».`), { do: { soc: 1 }, next: null })
        ]
      }
    }
  };

  /* ============================================================ A CORNER FOR CONFESSIONS */
  D.conf = {
    who: 'conf', role: t('THE CONFESSION CORNER', 'EL RINCÓN DE LAS CONFESIONES', 'O CANTO DAS CONFISSÕES'), start: 'a', nodes: {
      a: {
        text: t(`A small hand-lettered card tapes itself to the wall at hip height: SAY ONE TRUE THING OUT LOUD. NOBODY WILL ANSWER. In the dark, a murmur: "…I'm not as happy as my photos." Another: "…I still sleep with the light on." Another: "…I love you, I told the wrong person, I'm okay."`, `Una tarjetita escrita a mano se pega a sí misma en la pared a la altura de la cadera: DI UNA COSA VERDADERA EN VOZ ALTA. NADIE RESPONDERÁ. En la oscuridad, un murmullo: «…No soy tan feliz como mis fotos». Otro: «…Todavía duermo con la luz prendida». Otro: «…Te quiero, se lo dije a la persona equivocada, estoy bien».`, `Um cartãozinho escrito à mão se cola sozinho na parede na altura do quadril: DIGA UMA COISA VERDADEIRA EM VOZ ALTA. NINGUÉM VAI RESPONDER. No escuro, um murmúrio: «…Eu não sou tão feliz quanto minhas fotos». Outro: «…Eu ainda durmo com a luz acesa». Outro: «…Eu te amo, falei pra pessoa errada, tô bem».`),
        choices: [
          K('honest', t(`Say one true thing out loud.`, `Decir una cosa verdadera en voz alta.`, `Dizer uma coisa verdadeira em voz alta.`), { do: { soc: 6, weird: -3, fun: 1, time: 5, flag: 'confessed' }, next: null, react: t(`You say it. Nobody answers, exactly as promised. The dark simply takes it and gets a little bigger, and something you have been carrying since last Tuesday is carried by the room instead. A hand touches your back for one second and leaves.`, `Lo dices. Nadie responde, exactamente como se prometió. La oscuridad simplemente lo toma y se agranda un poquito, y algo que llevabas desde el martes pasado lo lleva la sala en tu lugar. Una mano te toca la espalda un segundo y se va.`, `Você fala. Ninguém responde, exatamente como prometido. O escuro simplesmente pega e fica um pouquinho maior, e algo que você carregava desde terça passada passa a ser carregado pela sala. Uma mão toca suas costas por um segundo e vai embora.`) }),
          K('care', t(`Just listen for a while.`, `Solo escuchar un rato.`, `Só ouvir um tempo.`), { do: { soc: 3, care: 1, time: 6 }, next: null, react: t(`Eleven true things in six minutes. Not one of them is a lie. You leave a little more convinced that people are, on the whole, a project worth continuing.`, `Once cosas verdaderas en seis minutos. Ninguna es mentira. Te vas con un poco más de convicción de que la gente, en general, es un proyecto que vale la pena continuar.`, `Onze coisas verdadeiras em seis minutos. Nenhuma é mentira. Você sai com um pouco mais de convicção de que as pessoas, no geral, são um projeto que vale a pena continuar.`) }),
          K('joke', t(`Say a true thing that is also a joke.`, `Decir algo verdadero que también sea un chiste.`, `Dizer algo verdadeiro que também é piada.`), { do: { fun: 4, soc: 3, weird: 1 }, next: null, react: t(`"I once cried at a pigeon." A beat of silence. Then the dark laughs, a warm, shaking, chorus laugh, and somebody says "me too, but it was a duck." You have fed the corner. The corner is full.`, `«Una vez lloré por una paloma». Un instante de silencio. Luego la oscuridad se ríe, una risa de coro cálida y temblorosa, y alguien dice «yo también, pero fue un pato». Alimentaste el rincón. El rincón está lleno.`, `«Eu já chorei por causa de um pombo». Um instante de silêncio. Aí o escuro ri, uma risada de coro quente e trêmula, e alguém diz «eu também, mas foi um pato». Você alimentou o canto. O canto está cheio.`) }),
          LEAVE()
        ]
      }
    }
  };

  /* ============================================================ GRAPES, BLINDFOLDED */
  D.iso = {
    who: 'iso', role: t('FRUIT, BY HAND', 'FRUTA, A MANO', 'FRUTA, NA MÃO'), start: 'a', nodes: {
      a: {
        text: t(`The grapes from the cue: a voice with a bowl. "Taste test. You close your eyes (what eyes), I put something in your hand or, with permission, near your mouth, and you say what it is. I tell you if you're right and what it tastes like to me."`, `Las uvas de la pista sonora: una voz con un cuenco. «Prueba de sabor. Cierras los ojos (qué ojos), te pongo algo en la mano o, con permiso, cerca de la boca, y dices qué es. Te digo si aciertas y a qué me sabe a mí».`, `As uvas da pista sonora: uma voz com uma tigela. «Teste de sabor. Você fecha os olhos (que olhos), eu coloco algo na sua mão ou, com permissão, perto da boca, e você diz o que é. Eu te falo se acertou e que gosto tem pra mim».`),
        choices: [
          K('bold', t(`"In my hand. Surprise me."`, `«En la mano. Sorpréndeme».`, `«Na mão. Me surpreenda».`), { do: { fun: 4, soc: 2, time: 3 }, next: null, react: t(`Something cold and round and impossible. "A grape," you say, and are right, and the voice sighs, satisfied. "To me it tastes like the first day of summer and also, faintly, a lie."`, `Algo frío, redondo e imposible. «Una uva», dices, y aciertas, y la voz suspira, satisfecha. «A mí me sabe al primer día de verano y también, apenas, a mentira».`, `Algo frio, redondo e impossível. «Uma uva», você diz, e acerta, e a voz suspira, satisfeita. «Pra mim tem gosto do primeiro dia de verão e também, de leve, de mentira».`) }),
          K('smooth', t(`"Near my mouth. Yes, I'm asking you to."`, `«Cerca de mi boca. Sí, te lo pido».`, `«Perto da minha boca. Sim, eu tô pedindo».`), { do: { fun: 7, soc: 2, weird: 1, time: 5, flag: 'iso_fed' }, next: null, react: t(`A cold fingertip, a small pressure, and a sweet burst. You laugh with your mouth full. "What is it?" "…Peach? Mercy." The voice is delighted. "It's a peach. Nobody gets it."`, `Una yema fría, una presión pequeña y un estallido dulce. Te ríes con la boca llena. «¿Qué es?» «…¿Durazno? Piedad». La voz está encantada. «Es un durazno. Nadie acierta».`, `Uma ponta de dedo fria, uma pressão pequena e uma explosão doce. Você ri de boca cheia. «O que é?» «…Pêssego? Misericórdia». A voz está encantada. «É pêssego. Ninguém acerta».`) }),
          K('makeout', t(`"Share one with me. From your mouth to mine?" (If you want.)`, `«Comparte una conmigo. ¿De tu boca a la mía?» (Si quieres.)`, `«Divide uma comigo. Da sua boca pra minha?» (Se você quiser.)`), { do: { makeout: { p: 0.66, time: 6, who: 'iso' } }, next: null }),
          LEAVE()
        ]
      }
    }
  };

  /* ============================================================ MORE TO FEEL IN THE DARK */
  Z.darkroom.cues.push(
    { x: 6.5, y: 6.5, r: 3.5, icon: 'heart', text: t(`Warm oil, cedar, and the slow creak of a stool. Somebody's shoulders are being un-knotted by an expert, and the sigh that comes out is the loudest sound in the room.`, `Aceite tibio, cedro y el lento crujido de un taburete. A alguien le están deshaciendo los nudos de los hombros con maestría, y el suspiro que sale es el sonido más fuerte de la sala.`, `Óleo morno, cedro e o lento ranger de um banquinho. Os ombros de alguém estão sendo desatados por um especialista, e o suspiro que sai é o som mais alto da sala.`) },
    { x: 22.5, y: 10.5, r: 4, icon: 'spark', text: t(`Three people giggling in a circle, a slap of tickled laughter, a name said wrong, a kiss on knuckles with a small wet sound. A game with rules.`, `Tres personas riéndose en círculo, un chasquido de risa de cosquillas, un nombre dicho mal, un beso en los nudillos con un pequeño sonido húmedo. Un juego con reglas.`, `Três pessoas rindo em círculo, um estalo de riso de cócegas, um nome dito errado, um beijo nos dedos com um pequeno som molhado. Um jogo com regras.`) },
    { x: 3.5, y: 7.5, r: 3.5, icon: 'note', text: t(`A low voice, reading, steady as a tide. Words you can't catch and a rhythm you can: a love story, or a grocery list, or both.`, `Una voz baja, leyendo, estable como una marea. Palabras que no alcanzas a captar y un ritmo que sí: una historia de amor, o una lista de compras, o las dos.`, `Uma voz baixa, lendo, estável como uma maré. Palavras que você não pega e um ritmo que pega: uma história de amor, ou uma lista de compras, ou os dois.`) },
    { x: 16.5, y: 12.5, r: 3.2, icon: 'heart', text: t(`Two breaths, one rhythm, and a third breath hovering just outside it, trying a word out. "Is this all right?" "Yes." "Is this?" "…Ask me again, slower." Everything in the world is being asked for.`, `Dos respiraciones, un ritmo, y una tercera respiración rondando justo afuera, probando una palabra. «¿Está bien así?» «Sí». «¿Y así?» «…Pregúntamelo otra vez, más lento». Todo en el mundo se está pidiendo.`, `Duas respirações, um ritmo, e uma terceira respiração rondando logo fora, testando uma palavra. «Assim tá bem?» «Sim». «E assim?» «…Pergunta de novo, mais devagar». Tudo no mundo está sendo pedido.`) },
    { x: 23.5, y: 14.5, r: 3, icon: 'zzz', text: t(`A single shape swaying alone to the thinnest part of the bass. Hands in the air, eyes shut. Waiting, politely, for somebody who knows how to lead.`, `Una sola forma balanceándose a solas en la parte más fina del bajo. Manos en el aire, ojos cerrados. Esperando, con educación, a alguien que sepa guiar.`, `Uma forma sozinha balançando na parte mais fina do grave. Mãos no ar, olhos fechados. Esperando, educadamente, alguém que saiba conduzir.`) },
    { x: 6.5, y: 14.5, r: 3.2, icon: 'eyes', text: t(`Murmurs at hip height, one after another, like pebbles into water: "…I'm tired." "…I miss someone." "…I'm so glad I came." A corner of true things.`, `Murmullos a la altura de la cadera, uno tras otro, como guijarros al agua: «…Estoy cansado». «…Extraño a alguien». «…Qué bueno que vine». Un rincón de cosas verdaderas.`, `Murmúrios na altura do quadril, um depois do outro, como pedrinhas na água: «…Tô cansado». «…Sinto falta de alguém». «…Que bom que eu vim». Um canto de coisas verdadeiras.`) },
    { x: 13.5, y: 9.5, r: 3, icon: 'spark', text: t(`Something sweet in the dark again: peach, grape, the wet snap of a skin. A voice saying "no, no, don't tell me, guess".`, `Algo dulce en la oscuridad otra vez: durazno, uva, el chasquido húmedo de una cáscara. Una voz que dice «no, no, no me digas, adivina».`, `Algo doce no escuro de novo: pêssego, uva, o estalo molhado de uma casca. Uma voz dizendo «não, não, não me diga, adivinha».`) }
  );
  const DR = function (id, x, y, dlg, extra) { Z.darkroom.npc(Object.assign({ id: id, x: x, y: y, dlg: dlg, dir: 'd', reach: 16 }, extra || {})); };
  DR('pau', 6.5, 6.5, 'pau', { when: NF('pau_night') });
  Z.darkroom.npc({ id: 'dgame', ring: ['dg1', 'dg2', 'dg3'], x: 22.5, y: 10.5, dlg: 'dgame', dir: 'd', reach: 22 });
  DR('lyra', 3.5, 7.5, 'lyra', { pose: 'sit' });
  Z.darkroom.npc({ id: 'dpair', pair: ['amar', 'bela'], x: 16.5, y: 12.5, dlg: 'dpair', dir: 'd', reach: 20, when: NF('dpair_done') });
  DR('slowd', 23.5, 14.5, 'slowdance', { dir: 'l' });
  DR('conf', 6.5, 14.5, 'conf', { pose: 'sit' });
  DR('iso', 13.5, 9.5, 'iso', { dir: 'r' });

  /* the morning knows */
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'dr_int', who: 'dani', ok: function (s) { return !!s.flags.dr_intimate; }, t: t(`I am not asking. I am just saying that your shirt was inside out at five, and it was obvious you had been looked after, and I have never been prouder.`, `No estoy preguntando. Solo digo que tu camiseta estaba al revés a las cinco, y se notaba que te habían cuidado a fondo, y nunca me sentí más orgulloso.`, `Não tô perguntando. Só tô dizendo que sua camiseta estava do avesso às cinco, e dava pra ver que cuidaram bem de você, e eu nunca tive tanto orgulho.`) });
    R.push({ id: 'dr_awk', who: 'maru', ok: function (s) { return !!s.flags.dr_awkward; }, t: t(`Rumour says three people in the dark room discovered a lot about elbows. I did not hear it from you. I just want you to know I am proud of the attempt.`, `Se rumorea que tres personas en el cuarto oscuro descubrieron mucho sobre los codos. No lo escuché de ti. Solo quiero que sepas que estoy orgullosa del intento.`, `Dizem que três pessoas na dark room descobriram muita coisa sobre cotovelos. Eu não ouvi isso de você. Só quero que saiba que tenho orgulho da tentativa.`) });
    R.push({ id: 'dr_conf', who: 'tato', ok: function (s) { return !!s.flags.confessed; }, t: t(`I went to the corner too, after you. I said a true thing out loud. I'm still shaking. It's a good shake. It's the shake of someone who put something down.`, `Yo también fui al rincón, después de ti. Dije una cosa verdadera en voz alta. Todavía tiemblo. Es un buen temblor. Es el temblor de alguien que soltó algo.`, `Eu também fui no canto, depois de você. Falei uma coisa verdadeira em voz alta. Ainda tô tremendo. É um bom tremor. É o tremor de quem largou alguma coisa.`) });
  }
})();

/* ---- consolidated from story_v12.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const NF = EM.NF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  function cast(id, name, o) { EM.CAST[id] = { name: name, look: Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 3, bottom: 1, bc: 1, acc: 0, wide: false }, o) }; }

  /* a roll that leans on how you are doing: fun, a drink or two, a mint, your wingman; hurt by a spiral of weirdness */
  const roll = function (base) { return function () { return Math.random() < L.makeoutChance(base); }; };
  const FAIL = { hp: -6, fun: -8 };
  const WIN = { hp: 25, soc: 25, fun: 8, weird: -3, time: 35 };

  const NO = [
    t(`They hold your eyes for a second more, then shift their shoulders away, kind and clear. A no, and a courteous one. You nod once, step back into the dark, and breathe out.`, `Te sostienen la mirada un segundo más y luego giran los hombros, con amabilidad y claridad. Un no, y uno cortés. Asientes una vez, das un paso atrás en la oscuridad y sueltas el aire.`, `Seguram o seu olhar por mais um segundo e depois viram os ombros, gentis e claros. Um não, e um não educado. Você assente uma vez, dá um passo pra trás no escuro e solta o ar.`),
    t(`The hand you were about to meet moves, politely, to a pocket. The gaze goes elsewhere. Nothing is said. Your ears are hot in the dark, and nobody has seen, which is the only mercy of the room.`, `La mano que ibas a encontrar se va, con educación, a un bolsillo. La mirada se va a otro lado. No se dice nada. Te arden las orejas en la oscuridad, y nadie lo vio, que es la única piedad del cuarto.`, `A mão que você ia encontrar vai, educadamente, pro bolso. O olhar vai pra outro lugar. Nada é dito. Suas orelhas queimam no escuro, e ninguém viu, que é a única misericórdia da sala.`),
    t(`A small shake of the head, and a squeeze of your forearm that says "thank you for asking like that". It is no, and a good one. It costs you something anyway, and you take it back to the wall with you to recover.`, `Un pequeño movimiento de cabeza y un apretón en tu antebrazo que dice «gracias por preguntar así». Es un no, y uno bueno. Igual te cuesta algo, y te lo llevas de vuelta a la pared para recuperarte.`, `Um pequeno aceno de cabeça e um aperto no seu antebraço que diz «obrigado por perguntar assim». É um não, e um bom não. Mesmo assim custa alguma coisa, e você leva isso de volta pra parede pra se recuperar.`)
  ];
  function pickNo() { return NO[Math.floor(Math.random() * NO.length)]; }

  function cruise(id, name, c) {
    const done = id + '_done';
    const noNode = function () { return { text: pickNo, do: Object.assign({}, FAIL, { flag: [done, 'dr_cruise_fail'] }), next: null }; };
    D['cruise_' + id] = {
      who: id, role: t('ACROSS THE DARK', 'AL OTRO LADO DE LA OSCURIDAD', 'DO OUTRO LADO DO ESCURO'), start: 'a', nodes: {
        a: {
          text: c.intro,
          choices: [
            K('flirt', t(`Walk over. Slowly. Leave them room to turn away.`, `Acercarte. Despacio. Dejarle espacio para irse.`, `Se aproximar. Devagar. Dar espaço pra pessoa se afastar.`), { next: 'r1' }),
            K('chill', t(`Not this one. Not tonight.`, `Esta no. Esta noche no.`, `Essa não. Hoje não.`), { free: true, next: null })
          ]
        },
        r1: { branch: [{ req: roll(0.88), to: 'eyes' }, { req: function () { return true; }, to: 'no1' }] },
        eyes: {
          text: c.eyes,
          choices: [
            K('smooth', t(`Hold the look. Let it say the question.`, `Sostener la mirada. Que diga la pregunta.`, `Sustentar o olhar. Deixar ele dizer a pergunta.`), { next: 'r2' }),
            K('chill', t(`Smile, look away, let it go.`, `Sonreír, desviar la vista, soltarlo.`, `Sorrir, desviar o olhar, deixar pra lá.`), { free: true, do: { soc: 2 }, next: null })
          ]
        },
        r2: { branch: [{ req: roll(0.84), to: 'touch' }, { req: function () { return true; }, to: 'no2' }] },
        touch: {
          text: c.touch,
          choices: [
            K('smooth', t(`Reach out. Brush a hand, an arm. Let them answer with theirs.`, `Extender la mano. Rozar una mano, un brazo. Que respondan con la suya.`, `Estender a mão. Roçar uma mão, um braço. Deixar a pessoa responder com a dela.`), { next: 'r3' }),
            K('chill', t(`Step back. That was enough.`, `Dar un paso atrás. Con eso alcanzó.`, `Dar um passo pra trás. Isso bastou.`), { free: true, do: { soc: 2, fun: 1 }, next: null })
          ]
        },
        r3: { branch: [{ req: roll(0.8), to: 'direct' }, { req: function () { return true; }, to: 'no3' }] },
        direct: {
          text: c.direct,
          choices: [
            K('makeout', t(`Nod. Follow them into the corner.`, `Asentir. Seguirle hacia el rincón.`, `Assentir. Seguir a pessoa pro canto.`), { next: 'r4' }),
            K('honest', t(`Say it out loud first: "Is this okay? Tell me what you want."`, `Decirlo en voz alta primero: «¿Está bien? Dime qué quieres».`, `Dizer em voz alta primeiro: «Tá bom assim? Me diz o que você quer».`), { next: 'rv' }),
            K('care', t(`Stop. Thank them. This is far enough.`, `Parar. Agradecer. Hasta aquí está bien.`, `Parar. Agradecer. Até aqui tá bom.`), { do: { soc: 3, fun: 2, flag: done }, next: null, react: t(`They squeeze your hand, and the squeeze says "good". You stand a minute in each other's heat, then separate.`, `Te aprietan la mano, y el apretón dice «bien». Se quedan un minuto en el calor del otro, y luego se separan.`, `Apertam sua mão, e o aperto diz «bom». Vocês ficam um minuto no calor um do outro, e depois se separam.`) })
          ]
        },
        r4: { branch: [{ req: roll(0.9), to: 'win' }, { req: function () { return true; }, to: 'no4' }] },
        /* asking aloud is not free: some people want the words, some want the silence (c.vp, per person) */
        rv: { branch: [{ req: function () { return Math.random() < (c.vp || 0.95); }, to: 'verbal' }, { req: function () { return true; }, to: 'no4' }] },
        verbal: {
          text: c.verbal,
          do: { hp: 5, soc: 5 }, next: 'win'
        },
        win: {
          text: c.win,
          do: Object.assign({}, WIN, { flag: [done, 'dr_cruised', 'dr_intimate'] }), next: null
        },
        no1: noNode(), no2: noNode(), no3: noNode(), no4: noNode()
      }
    };
  }

  cast('diego', 'DIEGO', { skin: 3, hair: 2, hc: 0, expr: 1, top: 1, tc: 8, bottom: 1, bc: 1, acc: 0, wide: true });
  cast('marco', 'MARCO', { skin: 1, hair: 1, hc: 7, expr: 0, top: 4, tc: 0, bottom: 1, bc: 1, acc: 0 });
  cast('elias', 'ELIAS', { skin: 0, hair: 5, hc: 2, expr: 3, top: 2, tc: 5, bottom: 1, bc: 6, acc: 1 });
  cast('ingrid', 'INGRID', { skin: 0, hair: 0, hc: 0, expr: 0, top: 3, tc: 10, bottom: 1, bc: 1, acc: 6 });
  cast('nadia', 'NADIA', { skin: 4, hair: 4, hc: 1, expr: 2, top: 6, tc: 7, bottom: 3, bc: 1, acc: 3 });
  cast('leila', 'LEILA', { skin: 2, hair: 3, hc: 9, expr: 1, top: 7, tc: 9, bottom: 0, bc: 1, acc: 4 });

  cruise('diego', 'DIEGO', {
    intro: t(`Against the pillar, a broad silhouette in a denim jacket with the sleeves pushed up, leaning like someone with all night to spend. Cedar, clean sweat. A tilt of the head.`, `Contra el pilar, una silueta ancha con chaqueta de jean y las mangas arremangadas, apoyada como quien tiene toda la noche para gastar. Cedro, sudor limpio. Una inclinación de cabeza.`, `Contra o pilar, uma silhueta larga de jaqueta jeans com as mangas arregaçadas, encostada como quem tem a noite toda pra gastar. Cedro, suor limpo. Uma inclinada de cabeça.`),
    eyes: t(`Close enough now for the thin light from the curtain to find a jaw, a mouth, two dark eyes that do not move. The look holds, then deepens. Neither of you says anything.`, `Lo bastante cerca como para que la luz fina de la cortina encuentre una mandíbula, una boca, dos ojos oscuros que no se mueven. La mirada se sostiene y luego se hace más honda. Ninguno de los dos dice nada.`, `Perto o bastante pra a luz fina da cortina achar um queixo, uma boca, dois olhos escuros que não se mexem. O olhar se sustenta e depois se aprofunda. Nenhum dos dois diz nada.`),
    touch: t(`A thumb crosses the inch between you and rests on the inside of your wrist, exactly on the pulse. Warm. Dry. Certain. The breath changes in the dark on both sides of it.`, `Un pulgar cruza el centímetro que los separa y se apoya en el interior de tu muñeca, justo en el pulso. Tibio. Seco. Seguro. La respiración cambia en la oscuridad a los dos lados.`, `Um polegar cruza o centímetro entre vocês e pousa na parte de dentro do seu pulso, exatamente no pulso. Quente. Seco. Certo. A respiração muda no escuro dos dois lados.`),
    direct: t(`His mouth is at your ear: no words, only breath and a pressure on your wrist that turns, gently, toward the curtain-dark corner. The answer is yours, and it can still be no.`, `Su boca en tu oído: sin palabras, solo aliento y una presión en tu muñeca que gira, con suavidad, hacia el rincón oscuro de la cortina. La respuesta es tuya, y todavía puede ser no.`, `A boca dele no seu ouvido: sem palavras, só respiração e uma pressão no seu pulso que gira, suavemente, em direção ao canto escuro da cortina. A resposta é sua, e ainda pode ser não.`),
    win: t(`A corner, a wall, denim against your back. Hands that ask by arriving. When the beat comes back in, your knees are the last to know.`, `Un rincón, una pared, el jean contra tu espalda. Manos que preguntan llegando. Cuando vuelve el bombo, tus rodillas son las últimas en enterarse.`, `Um canto, uma parede, o jeans nas suas costas. Mãos que perguntam chegando. Quando o bumbo volta, seus joelhos são os últimos a saber.`),
    verbal: t(`A low laugh. "Yes. You said it, so I don't have to." He leads, slowly.`, `Una risa baja. «Sí. Lo dijiste tú, así que yo no tengo que decirlo». Te guía, despacio.`, `Uma risada baixa. «Sim. Você disse, então eu não preciso dizer». Ele guia, devagar.`),
    vp: 0.72
  });
  cruise('marco', 'MARCO', {
    intro: t(`A tall quiet shape by the wall, hands in his pockets, shirt open one button too many. Cologne, warm and a little dusty. When you come near, he turns his head to you.`, `Una forma alta y callada junto a la pared, las manos en los bolsillos, la camisa abierta un botón de más. Colonia, cálida y un poco polvorienta. Cuando te acercas, gira la cabeza hacia ti.`, `Uma forma alta e quieta junto à parede, mãos nos bolsos, camisa aberta um botão a mais. Colônia, quente e meio empoeirada. Quando você se aproxima, ele vira a cabeça pra você.`),
    eyes: t(`Up close, a pair of grey eyes in a face that has been waiting for exactly this and is a little shy about it. He does not look away. His breath, slightly unsteady, tells you what his face is trying to hide.`, `De cerca, un par de ojos grises en una cara que esperaba exactamente esto y se avergüenza un poco. No aparta la vista. Su respiración, algo inestable, te cuenta lo que su cara intenta esconder.`, `De perto, um par de olhos cinza num rosto que esperava exatamente isso e está um pouco tímido com isso. Ele não desvia o olhar. A respiração, um pouco instável, te conta o que o rosto tenta esconder.`),
    touch: t(`He takes his hand out of his pocket slowly and lets it hover by your hip, asking. When you lean the half-inch that is your yes, it lands light, then not so light.`, `Saca la mano del bolsillo despacio y la deja flotar junto a tu cadera, preguntando. Cuando te inclinas el medio centímetro que es tu sí, se posa liviana, y luego no tanto.`, `Ele tira a mão do bolso devagar e a deixa pairar perto do seu quadril, perguntando. Quando você se inclina o meio centímetro que é o seu sim, ela pousa leve, e depois nem tanto.`),
    direct: t(`"There's a couch," he says, very low. His hand finds yours and turns it palm up. "Only if you want to. Nod, or don't. I'll know. I'll be kind either way."`, `«Hay un sofá», dice, muy bajo. Su mano encuentra la tuya y la gira con la palma hacia arriba. «Solo si quieres. Asiente, o no. Lo voy a saber. Voy a ser amable de cualquier forma».`, `«Tem um sofá», diz ele, bem baixo. A mão dele acha a sua e a vira com a palma pra cima. «Só se você quiser. Faz que sim, ou não. Eu vou saber. Vou ser gentil de qualquer jeito».`),
    win: t(`The leather couch is cool and takes your weight. Buttons, hair, a laugh swallowed against a shoulder. His careful hands get less careful, exactly as invited. Afterwards your two heartbeats argue about the tempo.`, `El sofá de cuero está fresco y recibe tu peso. Botones, pelo, una risa tragada contra un hombro. Sus manos cuidadosas dejan de serlo, justo como se les invitó. Después, los dos corazones discuten el tempo.`, `O sofá de couro é fresco e recebe seu peso. Botões, cabelo, uma risada engolida num ombro. As mãos cuidadosas ficam menos cuidadosas, exatamente como convidadas. Depois, os dois corações discutem o andamento.`),
    verbal: t(`A breath of relief. "Yes. Thank you for asking." His hand finds your wrist and leads, slowly.`, `Un suspiro de alivio. «Sí. Gracias por preguntar». Su mano encuentra tu muñeca y te guía, despacio.`, `Um suspiro de alívio. «Sim. Valeu por perguntar». A mão dele acha seu pulso e guia, devagar.`),
    vp: 0.97
  });
  cruise('elias', 'ELIAS', {
    intro: t(`A slight figure on the edge of the mattress, glasses catching the one light there is. He looks at you with plans. A small, crooked, interested smile.`, `Una figura delgada al borde del colchón, los lentes atrapan la única luz que hay. Te mira con planes. Una sonrisa pequeña, torcida e interesada.`, `Uma figura magra na beira do colchão, os óculos pegando a única luz que existe. Ele te olha com planos. Um sorriso pequeno, torto e interessado.`),
    eyes: t(`He takes off his glasses, folds them, and sets them on the mattress, which is the most erotic gesture you have seen all night. Without them his eyes are wide, dark, nearsighted, entirely on you.`, `Se saca los lentes, los dobla y los deja sobre el colchón, que es el gesto más erótico que viste en toda la noche. Sin ellos sus ojos son grandes, oscuros, miopes, enteramente en ti.`, `Ele tira os óculos, dobra e deixa sobre o colchão, o que é o gesto mais erótico que você viu a noite toda. Sem eles os olhos são grandes, escuros, míopes, inteiramente em você.`),
    touch: t(`"Hi," he whispers. He puts two fingers on your sleeve, then on your collarbone, reading. Your breath catches and he notices, and smiles with all of his face.`, `«Hola», susurra. Pone dos dedos en tu manga y luego en tu clavícula, leyendo. Se te corta el aliento y él lo nota, y sonríe con toda la cara.`, `«Oi», sussurra ele. Põe dois dedos na sua manga e depois na sua clavícula, lendo. Sua respiração falha e ele percebe, e sorri com o rosto todo.`),
    direct: t(`"I'm a little nervous," he says, close, and the honesty is the sexiest thing in the room. "I'd like to kiss you. And then, if it's good, whatever's next. Tell me if it isn't good. I'm a good listener."`, `«Estoy un poco nervioso», dice, cerca, y la honestidad es lo más sexy de la sala. «Quisiera besarte. Y luego, si está bien, lo que siga. Dime si no está bien. Soy buen oyente».`, `«Tô um pouco nervoso», ele diz, perto, e a honestidade é a coisa mais sexy da sala. «Eu gostaria de te beijar. E depois, se estiver bom, o que vier. Me diz se não estiver bom. Sou bom ouvinte».`),
    win: t(`Glasses forgotten on the mattress, laughter in the gaps. Then it stops being funny and starts being everything. Afterwards he can't find his glasses and neither of you looks.`, `Los lentes olvidados en el colchón, risa entre los huecos. Luego deja de ser gracioso y empieza a serlo todo. Después él no encuentra sus lentes y ninguno de los dos busca.`, `Os óculos esquecidos no colchão, riso nos intervalos. Depois deixa de ser engraçado e passa a ser tudo. Depois ele não acha os óculos e nenhum dos dois procura.`),
    verbal: t(`He laughs, relieved. "Yes. God, yes. Someone who asks." He puts his glasses somewhere safe.`, `Se ríe, aliviado. «Sí. Dios, sí. Alguien que pregunta». Deja los lentes en un lugar seguro.`, `Ele ri, aliviado. «Sim. Meu Deus, sim. Alguém que pergunta». Põe os óculos num lugar seguro.`),
    vp: 0.96
  });
  cruise('ingrid', 'INGRID', {
    intro: t(`A tall woman with a shaved head and a silver ring that flashes once when she turns. She stands in the middle of the black. She sees you. She does not smile. She raises one eyebrow: a question and a dare.`, `Una mujer alta con la cabeza rapada y un anillo de plata que destella una vez cuando se gira. Está de pie en medio de lo negro. Te ve. No sonríe. Levanta una ceja: una pregunta y un desafío.`, `Uma mulher alta de cabeça raspada e um anel de prata que brilha uma vez quando ela se vira. Ela está parada no meio do escuro. Te vê. Não sorri. Ergue uma sobrancelha: uma pergunta e um desafio.`),
    eyes: t(`She lets you come all the way to her, then looks at you with a steadiness that makes your knees take notes. The silver ring finds your chin and tips it up, a degree, and holds it there, asking your face its own question.`, `Deja que llegues hasta ella y te mira con una firmeza que hace que tus rodillas tomen nota. El anillo de plata encuentra tu mentón y lo levanta un grado, y lo sostiene ahí, preguntándole a tu cara su propia pregunta.`, `Ela deixa você chegar até ela, e te olha com uma firmeza que faz seus joelhos tomarem nota. O anel de prata acha seu queixo e levanta um grau, e segura lá, perguntando ao seu rosto a própria pergunta.`),
    touch: t(`Her palm lands flat in the middle of your chest, warm, unhurried. It travels one inch down, then waits.`, `Su palma cae plana en medio de tu pecho, tibia, sin prisa. Baja un centímetro y espera.`, `A palma dela pousa aberta no meio do seu peito, quente, sem pressa. Desce um centímetro e espera.`),
    direct: t(`"Here is what I'd like," she says, low and entirely calm, "and here is where you tell me no." She says it, plainly, with a warmth that is almost a joke, and she means it. "Mouth first. Then my place on the couch. You can go slower than me. Most people can."`, `«Esto es lo que querría», dice, bajo y completamente tranquila, «y aquí es donde me dices no». Lo dice con claridad, con una calidez que casi es un chiste, y lo dice en serio. «Primero la boca. Luego mi lugar en el sofá. Puedes ir más despacio que yo. La mayoría puede».`, `«Aqui está o que eu gostaria», ela diz, baixo e totalmente calma, «e aqui é onde você me diz não». Ela fala com clareza, com um calor que quase é uma piada, e fala sério. «Boca primeiro. Depois o meu lugar no sofá. Você pode ir mais devagar que eu. A maioria pode».`),
    win: t(`Her hands are sure, and kind about being sure. A laugh turns into something else without anyone deciding. When you surface you owe the room an apology and you aren't giving it.`, `Sus manos son seguras, y amables con esa seguridad. Una risa se convierte en otra cosa sin que nadie lo decida. Cuando sales a respirar, le debes una disculpa al lugar y no se la das.`, `As mãos dela são seguras, e gentis sobre essa segurança. Uma risada vira outra coisa sem ninguém decidir. Quando você volta à tona, deve um pedido de desculpas ao lugar e não vai dar.`),
    verbal: t(`A pause. "Ask once. Then trust me." A hand turns your wrist toward the corner. "Yes."`, `Una pausa. «Pregunta una vez. Luego confía en mí». Una mano gira tu muñeca hacia el rincón. «Sí».`, `Uma pausa. «Pergunta uma vez. Depois confia em mim». Uma mão vira seu pulso pro canto. «Sim».`),
    vp: 0.7
  });
  cruise('nadia', 'NADIA', {
    intro: t(`A woman with a cloud of curls and a laugh she is failing to keep quiet. She leans on a couch arm catching her breath, grinning at nothing, then at you. Sequins on her shoulder catch the dark.`, `Una mujer con una nube de rizos y una risa que no logra mantener callada. Se apoya en el brazo de un sofá recuperando el aliento, sonriendo a la nada y luego a ti. Las lentejuelas de su hombro atrapan la oscuridad.`, `Uma mulher com uma nuvem de cachos e uma risada que ela não consegue manter baixa. Está apoiada no braço de um sofá, recuperando o fôlego, sorrindo pro nada e depois pra você. As lantejoulas do ombro dela pegam o escuro.`),
    eyes: t(`She meets your eyes and her whole face goes soft and conspiratorial, like she has just remembered something wonderful and decided you're allowed in on it. She bites her lip.`, `Encuentra tus ojos y toda su cara se ablanda y se vuelve cómplice, como si acabara de recordar algo maravilloso y decidiera que puedes entrar. Se muerde el labio.`, `Ela encontra seus olhos e o rosto inteiro dela fica macio e cúmplice, como se tivesse acabado de lembrar algo maravilhoso e decidido que você pode entrar. Ela morde o lábio.`),
    touch: t(`She holds out one hand, palm up, an invitation and a joke. When you put yours in it, she pulls you in with a tug that makes you laugh out loud, and her free hand slides into the hair at the back of your neck. Her breath is warm, and tastes of oranges.`, `Extiende una mano, palma hacia arriba, una invitación y un chiste. Cuando pones la tuya, te atrae con un tirón que te hace reír en voz alta, y su mano libre se desliza en el pelo de tu nuca. Su aliento es tibio, y sabe a naranjas.`, `Ela estende uma mão, palma pra cima, um convite e uma piada. Quando você coloca a sua, ela te puxa num tranco que te faz rir alto, e a mão livre desliza pro cabelo da sua nuca. O hálito dela é morno e tem gosto de laranja.`),
    direct: t(`"Come here," she whispers into your mouth, "I'm going to kiss you and then I'm going to ask whether we should find a quiet spot. Do you want that? Say yes the way you'd say it to a friend." A little laugh. "Or no. No's also lovely."`, `«Ven», susurra contra tu boca, «te voy a besar y luego te voy a preguntar si deberíamos buscar un rincón tranquilo. ¿Quieres eso? Di sí como se lo dirías a una amiga». Una risita. «O no. El no también es lindo».`, `«Vem cá», ela sussurra na sua boca, «vou te beijar e depois vou perguntar se a gente devia achar um cantinho tranquilo. Você quer isso? Diz sim do jeito que você diria a uma amiga». Uma risadinha. «Ou não. O não também é lindo».`),
    win: t(`It starts as laughter and turns, without anyone deciding, into a quiet corner and a heap of jackets. Her curls in your hands. Afterwards she hums the bassline, slightly off.`, `Empieza como risa y se vuelve, sin que nadie lo decida, un rincón callado y un montón de chaquetas. Sus rizos en tus manos. Después ella tararea la línea de bajo, un poco desafinada.`, `Começa como riso e vira, sem ninguém decidir, um canto quieto e uma pilha de casacos. Os cachos dela nas suas mãos. Depois ela cantarola a linha de baixo, um pouco desafinada.`),
    verbal: t(`"Yes." She says it fast, then slower. "Yes. The asking was nice."`, `«Sí». Lo dice rápido y luego más despacio. «Sí. Estuvo lindo que preguntaras».`, `«Sim». Ela diz rápido e depois mais devagar. «Sim. Foi bom você perguntar».`),
    vp: 0.95
  });
  cruise('leila', 'LEILA', {
    intro: t(`A woman with strong shoulders and a heavy scent of jasmine, standing with her back to the wall and her arms crossed, not shut but waiting. She turns her head the instant you step into the dark.`, `Una mujer de hombros fuertes y un aroma denso a jazmín, de pie con la espalda en la pared y los brazos cruzados, no cerrada sino esperando. Gira la cabeza en el instante en que entras en la oscuridad.`, `Uma mulher de ombros fortes e um cheiro denso de jasmim, de pé com as costas na parede e os braços cruzados, não fechada mas esperando. Ela vira a cabeça no instante em que você entra no escuro.`),
    eyes: t(`She uncrosses her arms, slowly, a decision made in sections. In the thin light you see a face of great composure and, behind it, a flicker of nerves, which is somehow the most attractive part. Her gaze drops to your mouth, and back up.`, `Descruza los brazos, despacio, una decisión tomada por partes. En la luz fina ves una cara de gran compostura y, detrás, un destello de nervios, que de alguna forma es lo más atractivo. Su mirada baja a tu boca y vuelve a subir.`, `Ela descruza os braços, devagar, uma decisão tomada em partes. Na luz fina você vê um rosto de grande compostura e, atrás dele, um lampejo de nervos, que de algum jeito é a parte mais atraente. O olhar dela desce pra sua boca e sobe de novo.`),
    touch: t(`Her hand finds the front of your shirt and curls into the fabric, pulling you a half-step in without a word. Her thumb traces the line of your collar. Close now, you can feel her pulse in the heat of her wrist, quick as a bird's.`, `Su mano encuentra el frente de tu camisa y se cierra sobre la tela, atrayéndote medio paso sin una palabra. Su pulgar recorre la línea de tu cuello. Ahora cerca, sientes su pulso en el calor de la muñeca, veloz como el de un pájaro.`, `A mão dela acha a frente da sua camisa e se fecha no tecido, te puxando meio passo sem uma palavra. O polegar dela traça a linha da sua gola. Agora perto, você sente o pulso dela no calor do pulso, rápido como o de um passarinho.`),
    direct: t(`"I don't do anything unless somebody says it," Leila murmurs, her lips by your jaw. "So say it. In your own words. What do you want?" A breath. "And I'll tell you if it's the same as mine. Then we'll see how far the night wants to go."`, `«No hago nada si nadie lo dice», murmura Leila, con los labios junto a tu mandíbula. «Así que dilo. Con tus propias palabras. ¿Qué quieres?» Un aliento. «Y te diré si es lo mismo que yo quiero. Luego veremos hasta dónde quiere llegar la noche».`, `«Eu não faço nada se ninguém disser», murmura a Leila, com os lábios junto ao seu maxilar. «Então diz. Com suas próprias palavras. O que você quer?» Uma respiração. «E eu te digo se é o mesmo que eu quero. Depois a gente vê até onde a noite quer ir».`),
    win: t(`You say it, she says it back, and the dark closes over both sentences. A wall at your shoulders, jasmine in your lungs. The room goes on without you for a while.`, `Lo dices, ella lo repite, y la oscuridad se cierra sobre las dos frases. Una pared en los hombros, jazmín en los pulmones. El lugar sigue sin ti un rato.`, `Você diz, ela repete, e o escuro se fecha sobre as duas frases. Uma parede nos ombros, jasmim nos pulmões. O lugar segue sem você por um tempo.`),
    verbal: t(`"Yes," she says, and says it again, slower, so you can hear it. "Yes."`, `«Sí», dice, y lo repite más despacio, para que lo oigas. «Sí».`, `«Sim», diz ela, e repete mais devagar, pra você ouvir. «Sim».`),
    vp: 0.97
  });

  const POS = { diego: [7.5, 3.5], marco: [13.5, 12.5], elias: [18.5, 14.5], ingrid: [12.5, 4.5], nadia: [2.5, 9.5], leila: [21.5, 8.5] };
  Object.keys(POS).forEach(function (id) {
    Z.darkroom.npc({ id: id, x: POS[id][0], y: POS[id][1], dlg: 'cruise_' + id, dir: 'd', reach: 16, when: NF(id + '_done') });
  });
  Z.darkroom.cues.push(
    { x: 7.5, y: 3.5, r: 3, icon: 'eyes', text: t(`A broad silhouette against the pillar. A slow tilt of the head toward you, and a held look you can feel on your skin.`, `Una silueta ancha contra el pilar. Un lento ladeo de cabeza hacia ti, y una mirada sostenida que sientes en la piel.`, `Uma silhueta larga contra o pilar. Uma inclinada lenta de cabeça na sua direção, e um olhar sustentado que você sente na pele.`), when: function (s) { return !s.flags.diego_done; } },
    { x: 21.5, y: 8.5, r: 3, icon: 'eyes', text: t(`Jasmine, thick in the dark, and the sense of somebody very still, watching with her whole attention.`, `Jazmín, espeso en la oscuridad, y la sensación de alguien muy quieta, mirando con toda su atención.`, `Jasmim, grosso no escuro, e a sensação de alguém muito quieta, olhando com toda a atenção.`), when: function (s) { return !s.flags.leila_done; } },
    { x: 2.5, y: 9.5, r: 3, icon: 'heart', text: t(`A giggle somebody is failing to keep quiet, and the faint glitter of a sequin catching a thin line of light.`, `Una risita que alguien no logra mantener callada, y el tenue brillo de una lentejuela atrapando una línea fina de luz.`, `Uma risadinha que alguém não consegue manter quieta, e o brilho fraco de uma lantejoula pegando uma linha fina de luz.`), when: function (s) { return !s.flags.nadia_done; } }
  );

  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'cruise_ok', who: 'dani', ok: function (s) { return !!s.flags.dr_cruised; }, t: t(`Rumour has it somebody walked into the dark room a person and walked out a lighthouse. I'm only saying: whoever it was, I hope they drank water. I hope they were nice. I hope they got home okay.`, `Se rumorea que alguien entró al cuarto oscuro siendo una persona y salió siendo un faro. Solo digo: quien haya sido, espero que haya tomado agua. Espero que hayan sido amables. Espero que hayan llegado bien a casa.`, `Dizem que alguém entrou na dark room sendo uma pessoa e saiu sendo um farol. Só tô dizendo: quem foi, espero que tenha bebido água. Espero que tenham sido gentis. Espero que tenham chegado bem em casa.`) });
    R.push({ id: 'cruise_no', who: 'tato', ok: function (s) { return !!s.flags.dr_cruise_fail; }, t: t(`A no in the dark is just weather. I'm making tea. You are allowed to be a little sad about a good attempt. Come over, the kettle is on.`, `Un no en la oscuridad es solo clima. Estoy haciendo té. Tienes derecho a estar un poco triste por un buen intento. Ven, la pava está en el fuego.`, `Um não no escuro é só clima. Tô fazendo chá. Você tem direito de ficar um pouco triste por uma boa tentativa. Vem, a chaleira tá no fogo.`) });
  }
})();

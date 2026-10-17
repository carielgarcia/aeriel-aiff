/* EXCUSE ME — story v10: the dark room, fuller. More people, more hands, more breath, everything asked first.
   Adult, sensual and never crass: consent is spoken, a no is complete, and what happens after the fade is warm. */
'use strict';
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
          K('care', t(`Shoulders, please.`, `Hombros, por favor.`, `Ombros, por favor.`), { do: { hp: 5, soc: 4, fun: 2, time: 8 }, next: 'more', react: t(`Two thumbs find the knot you have been wearing since 22:00 and unmake it with the patience of a river. A long breath comes out of you that you did not know was waiting.`, `Dos pulgares encuentran el nudo que llevas desde las 22:00 y lo deshacen con la paciencia de un río. Sale de ti un largo suspiro que no sabías que esperaba.`, `Dois polegares acham o nó que você carrega desde as 22:00 e o desfazem com a paciência de um rio. Sai de você um longo suspiro que você não sabia que esperava.`) }),
          K('care', t(`Feet. I've been dancing for hours.`, `Los pies. Llevo horas bailando.`, `Os pés. Faz horas que eu danço.`), { do: { hp: 4, fun: 3, weird: -2, time: 8 }, next: 'more', react: t(`A shoe, a sock, a warm palm and two thumbs: the single most religious experience of the night. You promise yourself you will never wear those shoes again.`, `Un zapato, una media, una palma tibia y dos pulgares: la experiencia más religiosa de la noche. Te prometes que nunca más usarás esos zapatos.`, `Um sapato, uma meia, uma palma morna e dois polegares: a experiência mais religiosa da noite. Você promete a si mesmo que nunca mais vai usar esses sapatos.`) }),
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
          K('chill', t(`"Actually, just the shoulders. Thank you for asking."`, `«En realidad, solo los hombros. Gracias por preguntar».`, `«Na verdade, só os ombros. Valeu por perguntar».`), { do: { soc: 2, hp: 3 }, next: 'a' }),
          K('chill', t(`"I want to stop. Thank you."`, `«Quiero parar. Gracias».`, `«Quero parar. {Obrigado|Obrigada|Valeu}».`), { do: { soc: 2 }, next: null, react: t(`"Done. Thank you for telling me." Not a flicker of disappointment. It is the nicest "stop" you have ever had.`, `«Listo. Gracias por decírmelo». Ni un parpadeo de decepción. Es el «para» más amable que has tenido.`, `«Pronto. Valeu por me dizer». Nem um lampejo de decepção. É o «pare» mais gentil que você já teve.`) })
        ]
      },
      fade: {
        text: t(`A kiss, exactly as slow as promised. Then hands that say what they're about to do and wait for your yes. Buttons. Breath. A very long minute in which the whole building, the beat, the crowd, the clock all politely leave. You come back some time later, flushed, rumpled, and so thoroughly looked after that you could cry.`, `Un beso, exactamente tan lento como se prometió. Luego manos que dicen lo que van a hacer y esperan tu sí. Botones. Respiración. Un minuto larguísimo en el que todo el edificio, el ritmo, la multitud, el reloj se van con educación. Vuelves un rato después con las mejillas encendidas, la ropa arrugada y la sensación de que te cuidaron tanto que podrías llorar.`, `Um beijo, exatamente tão devagar quanto prometido. Depois mãos que dizem o que vão fazer e esperam o seu sim. Botões. Respiração. Um minuto longuíssimo em que o prédio inteiro, a batida, a multidão, o relógio saem educadamente. Você volta um tempo depois com as bochechas quentes, a roupa amarrotada e a sensação de que cuidaram tão bem de você que dava vontade de chorar.`),
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
          K('joke', t(`The funny one.`, `La graciosa.`, `A engraçada.`), { do: { fun: 6, soc: 2, time: 5 }, next: null, react: t(`"So I said 'do you want to dance' and the person said 'I don't dance, I sway like a man in a ferry', and I said 'perfect, I'm a ferry', and for forty minutes we were a very bad, very beautiful harbour." You are laughing quietly into your sleeve.`, `«Así que dije “¿bailamos?” y la persona dijo “yo no bailo, me balanceo como un hombre en un ferry”, y dije “perfecto, soy un ferry”, y durante cuarenta minutos fuimos un puerto muy malo y muy hermoso». Te ríes bajito contra tu manga.`, `«Aí eu disse “quer dançar?” e a pessoa disse “eu não danço, eu balanço feito um homem numa balsa”, e eu disse “perfeito, eu sou uma balsa”, e por quarenta minutos a gente foi um porto muito ruim e muito lindo». Você ri baixinho na manga.`) }),
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
        do: { soc: 2, fun: 1, flag: 'dpair_warm' }, next: 'a'
      },
      rules: {
        text: t(`"One: anyone can say stop and everyone stops, without a reason. Two: nothing is a promise. Three: afterwards, water and a joke. Four: if any of us has a bad feeling at any point, we all get dressed and eat toast. Is that all right?"`, `«Una: cualquiera puede decir para y todos paramos, sin motivo. Dos: nada es una promesa. Tres: después, agua y un chiste. Cuatro: si alguno tiene mala sensación en cualquier momento, nos vestimos todos y comemos tostadas. ¿Está bien?»`, `«Uma: qualquer um pode dizer pare e todos param, sem motivo. Duas: nada é promessa. Três: depois, água e uma piada. Quatro: se algum de nós tiver má sensação a qualquer momento, todo mundo se veste e come torrada. Tudo bem?»`),
        choices: [
          K('makeout', t(`"Yes. All of that is very sexy."`, `«Sí. Todo eso es muy sexy».`, `«Sim. Tudo isso é muito sexy».`), { call: 'dpair_go', next: null, free: true }),
          K('chill', t(`"I'd like to just talk and dance, for now."`, `«Me gustaría solo hablar y bailar, por ahora».`, `«Eu gostaria só de conversar e dançar, por enquanto».`), { do: { soc: 2 }, next: 'a' }),
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
  EM.PARTNERS && (EM.PARTNERS.amar = { tempo: 780, moves: ['sway', 'shuffle', 'wave', 'spiral'], win: t(`The two of them close around you in a dance that is half hug. "Oh, you're GOOD at this," says one. "Oh," says the other, in a very different, very pleased voice.`, `Los dos se cierran a tu alrededor en un baile que es mitad abrazo. «Ay, qué bien se te da esto», dice uno. «Ay», dice el otro, con una voz muy distinta y muy complacida.`, `Os dois se fecham em volta de você numa dança que é meio abraço. «Nossa, você manda bem nisso», diz um. «Nossa», diz o outro, com uma voz bem diferente e bem satisfeita.`), lose: t(`Three people trip gently over each other in the dark and fall into a laughing heap. "Excellent," says somebody into your shoulder. "That's how you know it's real."`, `Tres personas se tropiezan con suavidad en la oscuridad y caen en un montón riéndose. «Excelente», dice alguien contra tu hombro. «Así se sabe que es real».`, `Três pessoas tropeçam gentilmente no escuro e caem num monte rindo. «Excelente», diz alguém no seu ombro. «Assim se sabe que é real».`) });
  S.pd_slowd = function () {
    U.partnerDance('slowd', function (res) {
      if (res.grade === 'win') L.apply({ fun: 10, soc: 4, weird: -2, flag: 'slowd_warm' });
      else if (res.grade === 'partial') L.apply({ fun: 5, soc: 2 });
      else L.apply({ fun: 1 });
      L.addTime(6);
    });
  };
  S.pd_amar = function () {
    U.partnerDance('amar', function (res) {
      if (res.grade === 'win') L.apply({ fun: 10, soc: 4, flag: 'dpair_warm' });
      else if (res.grade === 'partial') L.apply({ fun: 5, soc: 2 });
      else L.apply({ fun: 2 });
      L.addTime(5);
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
          K('bold', t(`"In my hand. Surprise me."`, `«En la mano. Sorpréndeme».`, `«Na mão. Me surpreenda».`), { do: { fun: 4, soc: 2, time: 3 }, next: null, react: t(`Something cold and round and impossible. "A grape," you say, and are right, and the voice sighs like a teacher whose prize student has just done the thing. "To me it tastes like the first day of summer and also, faintly, a lie."`, `Algo frío, redondo e imposible. «Una uva», dices, y aciertas, y la voz suspira como una maestra cuya mejor alumna acaba de hacerlo. «A mí me sabe al primer día de verano y también, levemente, a mentira».`, `Algo frio, redondo e impossível. «Uma uva», você diz, e acerta, e a voz suspira como uma professora cuja melhor aluna acabou de fazer. «Pra mim tem gosto do primeiro dia de verão e também, de leve, de mentira».`) }),
          K('smooth', t(`"Near my mouth. Yes, I'm asking you to."`, `«Cerca de mi boca. Sí, te lo pido».`, `«Perto da minha boca. Sim, eu tô pedindo».`), { do: { fun: 7, soc: 2, weird: 1, time: 5, flag: 'iso_fed' }, next: null, react: t(`A cold fingertip, a very small pressure, and the sweet burst of something like a whole afternoon. You laugh with your mouth full. "What is it?" "…Peach? Mercy." The voice is delighted. "It's a peach. Nobody gets it."`, `La punta fría de un dedo, una presión muy pequeña, y el estallido dulce de algo como una tarde entera. Te ríes con la boca llena. «¿Qué es?» «…¿Durazno? Piedad». La voz está encantada. «Es durazno. Nadie acierta».`, `A ponta fria de um dedo, uma pressão bem pequena e o estouro doce de algo como uma tarde inteira. Você ri de boca cheia. «O que é?» «…Pêssego? Misericórdia». A voz está encantada. «É pêssego. Ninguém acerta».`) }),
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
    R.push({ id: 'dr_int', who: 'dani', ok: function (s) { return !!s.flags.dr_intimate; }, t: t(`I am not asking. I am just saying that your shirt was inside out at five, and you looked like a person who had been thoroughly looked after, and I have never been prouder.`, `No estoy preguntando. Solo digo que tu camiseta estaba al revés a las cinco, y te veías como alguien a quien cuidaron a fondo, y nunca me sentí más orgulloso.`, `Não tô perguntando. Só tô dizendo que sua camiseta estava do avesso às cinco, e você parecia uma pessoa que tinha sido muito bem cuidada, e eu nunca tive tanto orgulho.`) });
    R.push({ id: 'dr_awk', who: 'maru', ok: function (s) { return !!s.flags.dr_awkward; }, t: t(`Rumour says three people in the dark room discovered a lot about elbows. I did not hear it from you. I just want you to know I am proud of the attempt.`, `Se rumorea que tres personas en el cuarto oscuro descubrieron mucho sobre los codos. No lo escuché de ti. Solo quiero que sepas que estoy orgullosa del intento.`, `Dizem que três pessoas na dark room descobriram muita coisa sobre cotovelos. Eu não ouvi isso de você. Só quero que saiba que tenho orgulho da tentativa.`) });
    R.push({ id: 'dr_conf', who: 'tato', ok: function (s) { return !!s.flags.confessed; }, t: t(`I went to the corner too, after you. I said a true thing out loud. I'm still shaking. It's a good shake. It's the shake of someone who put something down.`, `Yo también fui al rincón, después de ti. Dije una cosa verdadera en voz alta. Todavía tiemblo. Es un buen temblor. Es el temblor de alguien que soltó algo.`, `Eu também fui no canto, depois de você. Falei uma coisa verdadeira em voz alta. Ainda tô tremendo. É um bom tremor. É o tremor de quem largou alguma coisa.`) });
  }
})();

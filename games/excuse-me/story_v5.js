/* EXCUSE ME — story v5: twenty new people. Flirts and the making-out category, small quests,
   little rituals on the floor. Everything is trilingual and everything costs or pays something. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const F = EM.F, NF = EM.NF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function (tone) { return K(tone || 'chill', t(`"I'll let you get back to it."`, `«Te dejo seguir».`, `«Vou te deixar continuar».`), { free: true, next: null }); };

  /* ------------------------------------------------------------ cast */
  function cast(id, name, o) {
    EM.CAST[id] = { name: name, look: Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 3, bottom: 1, bc: 1, acc: 0, wide: false }, o) };
  }
  cast('kai', 'KAI', { skin: 4, hair: 5, hc: 8, expr: 2, top: 4, tc: 6, bottom: 2, bc: 5, acc: 3 });
  cast('paula', 'PAULA', { skin: 1, hair: 7, hc: 2, expr: 3, top: 9, tc: 2, bottom: 1, bc: 0, acc: 1 });
  cast('pia', 'PIA', { skin: 3, hair: 3, hc: 6, expr: 4, top: 6, tc: 4, bottom: 3, bc: 8, acc: 6 });
  cast('moe', 'MOE', { skin: 0, hair: 2, hc: 3, expr: 5, top: 2, tc: 10, bottom: 1, bc: 4, acc: 2 });
  cast('vera', 'VERA', { skin: 2, hair: 6, hc: 1, expr: 1, top: 7, tc: 3, bottom: 0, bc: 1, acc: 4 });
  cast('bruce', 'BRUCE', { skin: 5, hair: 0, hc: 0, expr: 0, top: 8, tc: 5, bottom: 1, bc: 1, acc: 0, wide: true });
  cast('gus', 'GUS', { skin: 1, hair: 2, hc: 4, expr: 2, top: 3, tc: 7, bottom: 1, bc: 2, acc: 5 });
  cast('ines', 'INES', { skin: 3, hair: 8, hc: 0, expr: 3, top: 5, tc: 5, bottom: 3, bc: 1, acc: 0 });
  cast('rafa', 'RAFA', { skin: 0, hair: 1, hc: 7, expr: 4, top: 1, tc: 8, bottom: 1, bc: 6, acc: 0 });
  cast('analu', 'ANA-LU', { skin: 4, hair: 4, hc: 0, expr: 2, top: 6, tc: 1, bottom: 2, bc: 7, acc: 6 });
  cast('wen', 'WEN', { skin: 2, hair: 7, hc: 0, expr: 2, top: 3, tc: 2, bottom: 0, bc: 1, acc: 3 });
  cast('zhao', 'ZHAO', { skin: 2, hair: 1, hc: 0, expr: 3, top: 4, tc: 9, bottom: 1, bc: 1, acc: 6 });
  cast('lupe', 'LUPE', { skin: 1, hair: 3, hc: 1, expr: 5, top: 0, tc: 11, bottom: 1, bc: 0, acc: 0 });
  cast('nox', 'NOX', { skin: 3, hair: 0, hc: 0, expr: 0, top: 1, tc: 0, bottom: 1, bc: 1, acc: 0 });
  cast('otto', 'OTTO', { skin: 0, hair: 2, hc: 5, expr: 1, top: 9, tc: 5, bottom: 1, bc: 2, acc: 7 });
  cast('yui', 'YUI', { skin: 2, hair: 5, hc: 2, expr: 2, top: 2, tc: 0, bottom: 2, bc: 3, acc: 4 });
  cast('sia', 'SIA', { skin: 4, hair: 6, hc: 9, expr: 0, top: 7, tc: 6, bottom: 0, bc: 1, acc: 1 });
  cast('ruth', 'RUTH', { skin: 0, hair: 3, hc: 9, expr: 1, top: 9, tc: 7, bottom: 0, bc: 4, acc: 6 });
  cast('cleo', 'CLEO', { skin: 1, hair: 4, hc: 7, expr: 5, top: 6, tc: 1, bottom: 3, bc: 2, acc: 4 });
  cast('mina', 'MINA', { skin: 3, hair: 7, hc: 3, expr: 3, top: 10, tc: 8, bottom: 1, bc: 1, acc: 3 });
  cast('ludo', 'LUDO', { skin: 5, hair: 5, hc: 6, expr: 1, top: 4, tc: 3, bottom: 1, bc: 5, acc: 0 });

  /* ============================================================ FLIRTS (and making out, always after asking) */
  function flirt(id, role, c) {
    const warm = id + '_warm', done = id + '_done';
    D[id] = {
      who: id, role: role, start: 's', nodes: {
        s: { branch: [{ req: function (s) { return !!(s.flopAt && s.flopAt[id] !== undefined && s.time - s.flopAt[id] < 45); }, to: 'again' }, { req: function () { return true; }, to: 'a' }] },
        again: {
          text: function () {
            const n = EM.CAST[id].name;
            return t(`${n} gives you a kind, steady look. "We tried. It wasn't it. I'd like to keep liking you, so: not again right now. Okay?"`, `${n} te mira con calma y cariño. «Lo intentamos. No era. Quiero seguir cayéndote bien, así que: ahora no otra vez. ¿Vale?»`, `${n} te olha com calma e carinho. «A gente tentou. Não era. Quero continuar gostando de você, então: agora não de novo. Tá?»`);
          },
          choices: [
            K('care', t(`"Okay. Thank you for saying it plainly."`, `«Está bien. Gracias por decirlo claro».`, `«Tá bem. Valeu por dizer com clareza».`), { free: true, do: { soc: 1 }, next: null }),
            K('makeout', t(`Ask again anyway.`, `Preguntar otra vez igual.`, `Perguntar de novo mesmo assim.`), { call: 'push_' + id, free: true, next: null })
          ]
        },
        a: {
          text: c.intro,
          choices: [
            K('chill', c.talkQ, { next: 'talk' }),
            K('joke', c.jokeQ, { next: 'joke' }),
            K('flirt', c.danceQ, { call: 'pd_' + id, next: null, free: true }),
            K('makeout', t(`Ask: "Would you like to kiss me?"`, `Preguntar: «¿Te gustaría besarme?»`, `Perguntar: «Você gostaria de me beijar?»`), { next: 'ask' }),
            LEAVE()
          ]
        },
        talk: { text: c.talk, do: { soc: 2, fun: 1 }, next: 'a' },
        joke: { text: c.joke, do: { fun: 3, flag: warm }, next: 'a' },
        dance: { text: c.dance, do: { fun: 4, soc: -1, time: 6, flag: warm }, next: 'a' },
        ask: {
          text: c.ask,
          choices: [
            K('makeout', c.go, { req: { flag: warm }, do: { makeout: { p: 0.68, time: 7, who: id }, flag: done }, next: null }),
            K('makeout', c.go, { req: { no: warm }, do: { makeout: { p: 0.4, time: 7, who: id }, flag: done }, next: null }),
            K('chill', t(`"No pressure. Thanks for being honest."`, `«Sin presión. Gracias por decírmelo.»`, `«Sem pressão. Valeu por me dizer.»`), { free: true, do: { soc: 1 }, next: null })
          ]
        }
      }
    };
  }
  ['vera', 'ines', 'rafa', 'mina', 'nox', 'ludo'].forEach(function (id) { S['push_' + id] = function () { L.pushy(id); }; });
  /* the shared lines: a "no" is always a complete answer and costs nothing */
  const R_ROLE = function (en, es, pt) { return t(en, es, pt); };

  flirt('vera', R_ROLE('JACKET COLLECTOR', 'COLECCIONISTA DE CHAQUETAS', 'COLECIONADORA DE JAQUETAS'), {
    intro: t(`Vera is leaning against the wall rating people's jackets under her breath. "Six. Four. A nine, wow. Oh, hi. You're wearing something. I'm still deciding what."`, `Vera está apoyada en la pared calificando en voz baja las chaquetas de la gente. «Seis. Cuatro. Un nueve, guau. Ah, hola. Llevas algo puesto. Todavía estoy decidiendo qué».`, `A Vera está encostada na parede avaliando as jaquetas das pessoas em voz baixa. «Seis. Quatro. Um nove, uau. Ah, oi. Você está usando alguma coisa. Ainda estou decidindo o quê».`),
    talkQ: t(`"What's your best jacket ever?"`, `«¿Cuál fue tu mejor chaqueta?»`, `«Qual foi a sua melhor jaqueta?»`),
    talk: t(`"A 1987 bomber with somebody else's name stitched inside. I wear her name on my chest every weekend. I think she'd approve."`, `«Un bomber de 1987 con el nombre de otra persona cosido por dentro. Llevo su nombre en el pecho cada fin de semana. Creo que lo aprobaría».`, `«Uma bomber de 1987 com o nome de outra pessoa costurado por dentro. Eu uso o nome dela no peito todo fim de semana. Acho que ela aprovaria».`),
    jokeQ: t(`"Be honest. Out of ten?"`, `«Sé sincera. ¿Del uno al diez?»`, `«Seja sincera. De zero a dez?»`),
    joke: t(`She walks a full circle around you. "Seven. A solid seven with an eight attitude. Do not let it go to your head." It goes straight to your head.`, `Te da una vuelta completa. «Siete. Un siete sólido con actitud de ocho. No dejes que se te suba a la cabeza». Se te sube directo a la cabeza.`, `Ela dá uma volta completa em você. «Sete. Um sete sólido com atitude de oito. Não deixa subir à cabeça». Sobe direto à cabeça.`),
    danceQ: t(`"Want to dance? I'll hold your jacket."`, `«¿Bailamos? Te sostengo la chaqueta».`, `«Vamos dançar? Eu seguro sua jaqueta».`),
    dance: t(`She keeps one hand on your jacket the whole song, like a hostage she is very fond of. You both laugh through the chorus.`, `Mantiene una mano en tu chaqueta toda la canción, como un rehén al que le tiene mucho cariño. Los dos se ríen durante el estribillo.`, `Ela mantém uma mão na sua jaqueta a música inteira, como uma refém de quem gosta muito. Vocês dois riem no refrão.`),
    ask: t(`Vera looks at you for a long second, then smiles slowly. "Ask me properly. And be ready for me to say no. …I might say yes."`, `Vera te mira un largo segundo y luego sonríe despacio. «Pregúntalo bien. Y prepárate por si digo que no. …Quizás diga que sí».`, `A Vera te olha por um longo segundo e então sorri devagar. «Pergunta direito. E esteja preparado pra eu dizer que não. …Talvez eu diga que sim».`),
    go: t(`"Then yes. Let's find out."`, `«Entonces sí. Averigüémoslo».`, `«Então sim. Vamos descobrir».`)
  });
  flirt('ines', R_ROLE('OFF-SHIFT BARTENDER', 'BARTENDER EN SU DESCANSO', 'BARTENDER FORA DO TURNO'), {
    intro: t(`Ines sits on an upturned crate with a notebook, tallying something. "Limes sold: 212. Hearts broken: unknown. Tips: a button and a poem. Hey. Off shift. Ask me anything except for a drink."`, `Inés se sienta en un cajón dado vuelta con un cuaderno, anotando algo. «Limones vendidos: 212. Corazones rotos: desconocido. Propinas: un botón y un poema. Hola. Estoy de descanso. Pregúntame lo que quieras menos por un trago».`, `A Ines senta num caixote virado com um caderno, anotando alguma coisa. «Limões vendidos: 212. Corações partidos: desconhecido. Gorjetas: um botão e um poema. Oi. Estou de folga. Pergunte qualquer coisa menos por uma bebida».`),
    talkQ: t(`"What's the strangest order tonight?"`, `«¿Cuál fue el pedido más raro de esta noche?»`, `«Qual foi o pedido mais estranho hoje?»`),
    talk: t(`"Someone asked for 'a drink that tastes like a Tuesday'. I gave them tonic and a lime wedge. They cried a little. Good Tuesday."`, `«Alguien pidió “un trago que sepa a martes”. Le di tónica y una rodaja de limón. Lloró un poco. Buen martes».`, `«Alguém pediu “uma bebida com gosto de terça-feira”. Dei uma tônica com limão. Chorou um pouco. Boa terça».`),
    jokeQ: t(`"Do you take compliments as tips?"`, `«¿Aceptas cumplidos como propina?»`, `«Você aceita elogio como gorjeta?»`),
    joke: t(`Ines writes it down in the notebook with total seriousness. "Compliment: received. Value: 3 limes." She slides you an imaginary change of 2 limes.`, `Inés lo anota en el cuaderno con total seriedad. «Cumplido: recibido. Valor: 3 limones». Te desliza un vuelto imaginario de 2 limones.`, `A Ines anota no caderno com total seriedade. «Elogio: recebido. Valor: 3 limões». Ela te passa um troco imaginário de 2 limões.`),
    danceQ: t(`"Your shift is over. Dance with me for one song?"`, `«Tu turno terminó. ¿Bailas conmigo una canción?»`, `«Seu turno acabou. Dança uma música comigo?»`),
    dance: t(`She puts the notebook in her back pocket like a woman putting down a weapon. Her feet are wrecked and she dances anyway, perfectly.`, `Guarda el cuaderno en el bolsillo trasero como quien baja un arma. Tiene los pies destrozados y baila igual, perfecto.`, `Ela guarda o caderno no bolso de trás como quem larga uma arma. Está com os pés destruídos e dança mesmo assim, perfeitamente.`),
    ask: t(`Ines tilts her head. "You're asking, not assuming. I like that. Okay. Ask me again, slower, and mean it."`, `Inés ladea la cabeza. «Preguntas, no supones. Eso me gusta. Bien. Pregúntamelo otra vez, más lento, y en serio».`, `A Ines inclina a cabeça. «Você pergunta, não presume. Gostei disso. Tá. Pergunta de novo, mais devagar, e fala sério».`),
    go: t(`"Can I kiss you?"`, `«¿Puedo besarte?»`, `«Posso te beijar?»`)
  });
  flirt('rafa', R_ROLE('PRACTISING A STEP', 'PRACTICANDO UN PASO', 'PRATICANDO UM PASSO'), {
    intro: t(`Rafa is doing the same four dance steps against the wall, eyes shut, lips moving. He sees you and freezes. "Oh. No. It's… a warm-up. For later. For never. Hi."`, `Rafa hace los mismos cuatro pasos de baile contra la pared, con los ojos cerrados y los labios moviéndose. Te ve y se congela. «Ah. No. Es… un precalentamiento. Para después. Para nunca. Hola».`, `O Rafa faz os mesmos quatro passos de dança contra a parede, de olhos fechados e lábios se mexendo. Ele te vê e congela. «Ah. Não. É… um aquecimento. Pra depois. Pra nunca. Oi».`),
    talkQ: t(`"What are the four steps?"`, `«¿Cuáles son los cuatro pasos?»`, `«Quais são os quatro passos?»`),
    talk: t(`"Step, step, turn, shrug. I call it The Apology. It says: I know I'm in the way, and I'm really glad you're here anyway." He demonstrates. It is, honestly, great.`, `«Paso, paso, giro, encogida. Le digo La Disculpa. Dice: sé que estoy en el medio y igual me alegra mucho que estés aquí». Lo demuestra. Es, de verdad, genial.`, `«Passo, passo, giro, dar de ombros. Eu chamo de O Pedido de Desculpas. Ele diz: sei que estou no caminho e mesmo assim fico muito feliz que você esteja aqui». Ele demonstra. É, sinceramente, ótimo.`),
    jokeQ: t(`"That's the best opening move I've seen all night."`, `«Es el mejor movimiento de apertura que vi en toda la noche».`, `«É o melhor movimento de abertura que vi a noite toda».`),
    joke: t(`Rafa goes the colour of a very ripe tomato. "…Thank you. Nobody has ever said that. Maybe nobody has seen it. Thank you." He stands one inch taller.`, `Rafa se pone del color de un tomate muy maduro. «…Gracias. Nadie me lo había dicho. Quizás nadie lo había visto. Gracias». Se para una pulgada más alto.`, `O Rafa fica da cor de um tomate bem maduro. «…Obrigado. Ninguém nunca falou isso. Talvez ninguém tenha visto. Obrigado». Ele fica uns dois centímetros mais alto.`),
    danceQ: t(`"Teach me The Apology?"`, `«¿Me enseñas La Disculpa?»`, `«Me ensina O Pedido de Desculpas?»`),
    dance: t(`Step, step, turn, shrug. You get it wrong twice. Rafa laughs for the first time all night, a real one, and you realise you are both very happy.`, `Paso, paso, giro, encogida. Te equivocas dos veces. Rafa se ríe por primera vez en toda la noche, una risa de verdad, y se dan cuenta de que los dos son muy felices.`, `Passo, passo, giro, dar de ombros. Você erra duas vezes. O Rafa ri pela primeira vez a noite toda, de verdade, e vocês percebem que os dois estão muito felizes.`),
    ask: t(`Rafa's whole body goes still. "…Yes. I mean — maybe. I mean I'd like to. I'm very nervous. Is that allowed? Nervous?"`, `A Rafa se le queda quieto el cuerpo entero. «…Sí. O sea — quizás. O sea, me gustaría. Estoy muy nervioso. ¿Se permite? ¿Estar nervioso?»`, `O corpo inteiro do Rafa fica imóvel. «…Sim. Quer dizer — talvez. Quer dizer, eu gostaria. Estou muito nervoso. Pode? Estar nervoso?»`),
    go: t(`"Nervous is allowed. Come here."`, `«Nervioso está permitido. Ven».`, `«Nervoso pode. Vem cá».`)
  });
  flirt('mina', R_ROLE('SOUND ENGINEER (APPRENTICE)', 'INGENIERA DE SONIDO (APRENDIZ)', 'ENGENHEIRA DE SOM (APRENDIZ)'), {
    intro: t(`Mina stands with her palms out facing the speaker stack, eyes closed, like she's reading it. "Too much 2k. Not my fault. Not yet. Hi — sorry. I only hear in frequencies right now."`, `Mina está con las palmas hacia el stack de parlantes, ojos cerrados, como si lo leyera. «Demasiado 2k. No es mi culpa. Todavía. Hola — perdón. Ahora solo oigo en frecuencias».`, `A Mina fica com as palmas voltadas para o paredão de caixas, de olhos fechados, como se estivesse lendo. «Muito 2k. Não é culpa minha. Ainda. Oi — desculpa. Agora eu só escuto em frequências».`),
    talkQ: t(`"What does the room sound like to you?"`, `«¿A qué te suena el cuarto?»`, `«Qual é o som da sala pra você?»`),
    talk: t(`"A very polite argument between a kick and a bass. The kick is winning. The bass is being gracious about it." She grins. "I'd marry that conversation."`, `«A una discusión muy cortés entre un bombo y un bajo. Gana el bombo. El bajo lo lleva con elegancia». Sonríe. «Me casaría con esa conversación».`, `«A uma discussão muito educada entre um bumbo e um baixo. O bumbo está ganhando. O baixo está levando com elegância». Ela sorri. «Eu casaria com essa conversa».`),
    jokeQ: t(`"Your face has excellent bass response."`, `«Tu cara tiene una excelente respuesta de graves».`, `«Seu rosto tem uma excelente resposta de graves».`),
    joke: t(`Mina laughs so loudly three people turn around. "That's the worst line I've heard this year and I'm keeping it forever." She writes it on her hand with a marker.`, `Mina se ríe tan fuerte que tres personas se dan vuelta. «Es la peor frase que escuché este año y me la quedo para siempre». La escribe en la mano con un marcador.`, `A Mina ri tão alto que três pessoas viram. «É a pior cantada que ouvi este ano e vou guardar pra sempre». Ela escreve na mão com uma caneta.`),
    danceQ: t(`"Dance with me. You'll hear it differently."`, `«Baila conmigo. Lo vas a oír distinto».`, `«Dança comigo. Você vai ouvir diferente».`),
    dance: t(`She puts your hand flat against the speaker stack, then moves it away. "That's the chest. Now the hips." You dance in the part of the room where the bass lives.`, `Te apoya la mano plana contra el stack, luego la aparta. «Eso es el pecho. Ahora las caderas». Bailan en la parte del cuarto donde vive el bajo.`, `Ela põe sua mão espalmada na caixa e depois afasta. «Isso é o peito. Agora os quadris». Vocês dançam na parte da sala onde mora o grave.`),
    ask: t(`Mina holds still, listening to something you cannot hear. "…Yes. I think. Ask me when the next drop lands. It's easier when everyone's looking at the ceiling."`, `Mina se queda quieta, escuchando algo que no puedes oír. «…Sí. Creo. Pregúntame cuando caiga el próximo drop. Es más fácil cuando todos miran al techo».`, `A Mina fica parada, ouvindo algo que você não escuta. «…Sim. Acho. Pergunta quando o próximo drop cair. É mais fácil quando todo mundo olha pro teto».`),
    go: t(`Wait for the drop. Then ask, under the noise.`, `Esperar el drop. Luego preguntar, debajo del ruido.`, `Esperar o drop. Depois perguntar, por baixo do barulho.`)
  });
  flirt('nox', R_ROLE('A VOICE IN THE DARK', 'UNA VOZ EN LA OSCURIDAD', 'UMA VOZ NO ESCURO'), {
    intro: t(`You cannot see them. A warm voice at hip height: "Hey. Two taps on my wrist is yes, one is no, a flat hand is 'stop'. Say it out loud too. I like words. Is that okay with you?" The dark smells like cedar and sugar.`, `No los ves. Una voz cálida a la altura de la cadera: «Hola. Dos toques en mi muñeca es sí, uno es no, la mano plana es “alto”. Dilo también en voz alta. Me gustan las palabras. ¿Te parece bien?» La oscuridad huele a cedro y azúcar.`, `Você não os vê. Uma voz quente na altura do quadril: «Oi. Dois toques no meu pulso é sim, um é não, mão espalmada é “pare”. Fale em voz alta também. Eu gosto de palavras. Tudo bem pra você?» O escuro cheira a cedro e açúcar.`),
    talkQ: t(`"Why do you come in here?"`, `«¿Por qué vienes aquí?»`, `«Por que você vem aqui?»`),
    talk: t(`"Because nobody has to perform a face. Everyone's voice does the work. It's the most honest room in the building." A pause. "Also the best acoustics."`, `«Porque nadie tiene que actuar una cara. Todas las voces hacen el trabajo. Es la sala más honesta del edificio». Una pausa. «Y tiene la mejor acústica».`, `«Porque ninguém precisa encenar um rosto. A voz de todo mundo faz o trabalho. É a sala mais honesta do prédio». Uma pausa. «E tem a melhor acústica».`),
    jokeQ: t(`"Your voice has a very trustworthy face."`, `«Tu voz tiene una cara muy confiable».`, `«Sua voz tem um rosto muito confiável».`),
    joke: t(`A soft, surprised laugh, close. "That's the nicest thing anyone's said to a voice. Thank you. I'll tell it. It will blush, in the dark, where nobody can see."`, `Una risa suave y sorprendida, cerca. «Es lo más lindo que le dijeron a una voz. Gracias. Se lo voy a contar. Se va a sonrojar, en la oscuridad, donde nadie la ve».`, `Uma risada suave e surpresa, perto. «É a coisa mais gentil que já disseram a uma voz. Obrigado. Vou contar pra ela. Ela vai corar, no escuro, onde ninguém vê».`),
    danceQ: t(`"Would you dance? Slow? Hands where you say?"`, `«¿Bailarías? ¿Lento? ¿Con las manos donde tú digas?»`, `«Você dançaria? Devagar? Com as mãos onde você disser?»`),
    dance: t(`A slow shuffle in the black. Two fingers rest on your shoulder, and then, with a word, a whole hand. The song takes its time. So do you.`, `Un arrastre lento en el negro. Dos dedos se posan en tu hombro y luego, con una palabra, una mano entera. La canción se toma su tiempo. Tú también.`, `Um arrasto lento no breu. Dois dedos pousam no seu ombro e depois, com uma palavra, uma mão inteira. A música leva seu tempo. Você também.`),
    ask: t(`"Say it out loud, and I'll tell you honestly." A breath. "…Two taps. Yes. But you have to say it first, and I have to still want to when you do."`, `«Dilo en voz alta y te digo con honestidad». Una respiración. «…Dos toques. Sí. Pero tú tienes que decirlo primero, y yo tengo que seguir queriendo cuando lo hagas».`, `«Fala em voz alta e eu te digo com honestidade». Uma respiração. «…Dois toques. Sim. Mas você precisa falar primeiro, e eu preciso continuar querendo quando você falar».`),
    go: t(`"May I kiss you?" (and wait)`, `«¿Puedo besarte?» (y esperar)`, `«Posso te beijar?» (e esperar)`)
  });
  flirt('ludo', R_ROLE('SUNRISE PERSON', 'PERSONA DEL AMANECER', 'PESSOA DO AMANHECER'), {
    intro: t(`Ludo sits on the rooftop rail with a paper bag. "Croissants. I carry them to every closing set in case somebody needs one more reason to stay. You look like somebody. Want one?"`, `Ludo está sentado en la baranda del techo con una bolsa de papel. «Medialunas. Las llevo a cada set de cierre por si alguien necesita una razón más para quedarse. Tienes cara de alguien. ¿Quieres una?»`, `O Ludo está sentado no parapeito do terraço com um saco de papel. «Croissants. Levo pra todo set de encerramento, caso alguém precise de mais um motivo pra ficar. Você tem cara de alguém. Quer um?»`),
    talkQ: t(`"Why do you stay till sunrise?"`, `«¿Por qué te quedas hasta el amanecer?»`, `«Por que você fica até o amanhecer?»`),
    talk: t(`"Because the night is a rumour until the light comes. Then everyone looks around and says 'oh, it was real.' I never get tired of that look."`, `«Porque la noche es un rumor hasta que llega la luz. Entonces todos miran alrededor y dicen “ah, era real”. Nunca me canso de esa cara».`, `«Porque a noite é um boato até a luz chegar. Aí todo mundo olha em volta e diz “ah, era real”. Nunca me canso desse olhar».`),
    jokeQ: t(`"If this croissant is a bribe, it's working."`, `«Si esta medialuna es un soborno, está funcionando».`, `«Se esse croissant é suborno, tá funcionando».`),
    joke: t(`"It's a bribe with butter, the only legal kind." He tears a second one in half and gives you the bigger piece without comment.`, `«Es un soborno con manteca, el único legal». Parte una segunda por la mitad y te da el pedazo más grande sin comentar nada.`, `«É um suborno com manteiga, o único legal». Ele parte um segundo ao meio e te dá o pedaço maior sem comentar.`),
    danceQ: t(`"One slow dance before the sun, then?"`, `«¿Un baile lento antes del sol, entonces?»`, `«Uma dança lenta antes do sol, então?»`),
    dance: t(`A slow dance with a paper bag on the ground and the sky turning from violet to the colour of the inside of a peach. His hand is warm and a little buttery.`, `Un baile lento con una bolsa de papel en el piso y el cielo pasando del violeta al color del interior de un durazno. Su mano está tibia y un poco mantecosa.`, `Uma dança lenta com um saco de papel no chão e o céu passando do violeta à cor de dentro de um pêssego. A mão dele está quente e um pouco amanteigada.`),
    ask: t(`Ludo smiles at the horizon, not at you, which is how you know it's serious. "…Yes. Please. Ask me while the sky's still undecided."`, `Ludo sonríe al horizonte, no a ti, y por eso sabes que va en serio. «…Sí. Por favor. Pregúntamelo mientras el cielo todavía no se decide».`, `O Ludo sorri pro horizonte, não pra você, e é assim que você sabe que é sério. «…Sim. Por favor. Pergunta enquanto o céu ainda não se decidiu».`),
    go: t(`"Can I kiss you?"`, `«¿Puedo besarte?»`, `«Posso te beijar?»`)
  });

  /* ============================================================ SMALL PEOPLE, SMALL QUESTS */
  D.kai = {
    who: 'kai', role: t('SIDEWALK BUSKER', 'MÚSICO DE LA VEREDA', 'MÚSICO DE CALÇADA'), start: 'a', nodes: {
      a: {
        text: t(`A keyboard the size of a lunchbox, a coin cup, and a hand-lettered sign: REQUESTS: 1 EURO. COMPLAINTS: 2 EUROS. Kai plays something that may be a famous song, or the memory of one.`, `Un teclado del tamaño de una lonchera, un vaso de monedas y un cartel escrito a mano: PEDIDOS: 1 EURO. QUEJAS: 2 EUROS. Kai toca algo que quizás sea una canción famosa, o el recuerdo de una.`, `Um teclado do tamanho de uma lancheira, um copo de moedas e uma placa escrita à mão: PEDIDOS: 1 EURO. RECLAMAÇÕES: 2 EUROS. O Kai toca algo que pode ser uma música famosa, ou a lembrança de uma.`),
        choices: [
          K('chill', t(`Drop a coin in the cup.`, `Dejar una moneda en el vaso.`, `Largar uma moeda no copo.`), { do: { fun: 3, soc: 1, flag: 'kai_tipped' }, next: 'song' }),
          K('joke', t(`"I'd like to file a complaint."`, `«Quisiera presentar una queja».`, `«Gostaria de registrar uma reclamação».`), { next: 'complaint' }),
          K('bold', t(`Sing along. Loudly. Badly.`, `Cantar con él. Fuerte. Mal.`, `Cantar junto. Alto. Mal.`), { do: { fun: 5, weird: 2, soc: -1, flag: 'kai_duet' }, next: null, react: t(`Kai doesn't miss a note, just adjusts the key down by a full tone to make room for you. A man in the queue gives you a thumbs-up and a look of sincere concern.`, `Kai no pierde una nota, solo baja el tono completo para hacerte lugar. Un tipo de la fila te da un pulgar arriba y una mirada de preocupación sincera.`, `O Kai não perde uma nota, só abaixa o tom inteiro pra abrir espaço pra você. Um cara da fila te dá um joinha e um olhar de preocupação sincera.`) }),
          LEAVE()
        ]
      },
      song: {
        text: t(`Kai plays three bars that are definitely yours somehow, bows with the whole torso and says, "Request?"`, `Kai toca tres compases que de algún modo son definitivamente tuyos, hace una reverencia con todo el torso y dice: «¿Pedido?»`, `O Kai toca três compassos que de algum jeito são definitivamente seus, faz uma reverência com o tronco inteiro e diz: «Pedido?»`),
        choices: [
          K('dance', t(`"Something that makes the queue move faster."`, `«Algo que haga avanzar la fila más rápido».`, `«Algo que faça a fila andar mais rápido».`), { do: { fun: 4, time: 3 }, next: null, react: t(`A waltz at 160 BPM. The queue does not move faster, but it feels fantastic about itself.`, `Un vals a 160 BPM. La fila no avanza más rápido, pero se siente fantástica consigo misma.`, `Uma valsa a 160 BPM. A fila não anda mais rápido, mas se sente fantástica consigo mesma.`) }),
          K('honest', t(`"Something for somebody I'm nervous about."`, `«Algo para alguien que me pone nervioso».`, `«Algo pra alguém que me deixa nervoso».`), { do: { fun: 3, soc: 3, flag: 'kai_song' }, next: null, react: t(`Kai closes their eyes. What comes out is soft, a little crooked, and slows your pulse by about ten beats. "On the house."`, `Kai cierra los ojos. Lo que sale es suave, un poco chueco, y te baja el pulso unos diez latidos. «Va por la casa».`, `O Kai fecha os olhos. O que sai é suave, um pouco torto, e abaixa seu pulso uns dez batimentos. «Por conta da casa».`) }),
          K('chill', t(`"Surprise me."`, `«Sorpréndeme».`, `«Me surpreenda».`), { do: { fun: 3 }, next: null, react: t(`Kai plays the Æ000.X FAQ as a nocturne. You are, against all odds, moved.`, `Kai toca el FAQ de Æ000.X como un nocturno. Te emociona, contra todo pronóstico.`, `O Kai toca o FAQ da Æ000.X como um noturno. Você se emociona, contra todas as probabilidades.`) })
        ]
      },
      complaint: {
        text: t(`Kai holds out a palm. "Two euros." You pay in compliments. Kai considers the currency and nods. "The exchange rate is terrible, but I'm a romantic." The complaint is accepted, and immediately lost.`, `Kai extiende la palma. «Dos euros». Pagas en cumplidos. Kai considera la moneda y asiente. «El tipo de cambio es terrible, pero soy romántico». La queja es aceptada y perdida de inmediato.`, `O Kai estende a palma. «Dois euros». Você paga em elogios. O Kai considera a moeda e assente. «A taxa de câmbio é péssima, mas sou romântico». A reclamação é aceita e imediatamente perdida.`),
        do: { fun: 3, soc: 1 }, next: 'a'
      }
    }
  };

  D.paula = {
    who: 'paula', role: t('NEEDS A LIGHTER', 'NECESITA UN ENCENDEDOR', 'PRECISA DE UM ISQUEIRO'), start: 'a', nodes: {
      a: {
        branch: [{ req: { flag: 'paula_lit' }, to: 'after' }, { req: { flag: 'have_light' }, to: 'light' }, { req: function () { return true; }, to: 'ask' }]
      },
      ask: {
        text: t(`"Excuse me — a lighter? I have a cigarette and the confidence of a person who doesn't." Paula holds the cigarette like a pencil she is about to use for something important.`, `«Disculpa — ¿un encendedor? Tengo un cigarro y la confianza de alguien que no lo tiene». Paula sostiene el cigarro como un lápiz que va a usar para algo importante.`, `«Com licença — um isqueiro? Tenho um cigarro e a confiança de quem não tem». A Paula segura o cigarro como um lápis que vai usar pra algo importante.`),
        choices: [
          K('chill', t(`"I'll find you one. Courtyard, probably."`, `«Te consigo uno. En el patio, probablemente».`, `«Vou te arranjar um. No pátio, provavelmente».`), { do: { flag: 'paula_wants_light', soc: 1 }, next: null, react: t(`"You're a lifesaver. A small, flammable lifesaver."`, `«Eres un salvavidas. Un salvavidas chiquito e inflamable».`, `«Você é um salva-vidas. Um salva-vidas pequeno e inflamável».`) }),
          K('care', t(`"Maybe a water instead? It's a long night."`, `«¿Quizás un agua en su lugar? Es una noche larga».`, `«Que tal uma água? A noite é longa».`), { req: { item: 'water' }, do: { item: { water: -1 }, care: 1, flag: 'paula_lit' }, next: null, react: t(`She stares at the bottle. "…You know what? Yes." She puts the cigarette behind her ear for later and drinks half the bottle. You are an unexpectedly good influence.`, `Mira la botella. «…¿Sabes qué? Sí». Se pone el cigarro detrás de la oreja para después y se toma media botella. Eres una influencia buena e inesperada.`, `Ela olha pra garrafa. «…Sabe de uma coisa? Sim». Ela põe o cigarro atrás da orelha pra depois e bebe metade da garrafa. Você é uma influência boa e inesperada.`) }),
          K('blunt', t(`"I don't have one. Ask somebody else."`, `«No tengo. Pídele a otra persona».`, `«Não tenho. Pede pra outra pessoa».`), { do: { soc: -1 }, next: null, bad: false }),
          LEAVE()
        ]
      },
      light: {
        text: t(`You hold out a lighter you borrowed in the courtyard. Paula's face does a small sunrise. "The flame, the myth, the legend."`, `Le tiendes un encendedor que pediste prestado en el patio. A Paula se le hace un pequeño amanecer en la cara. «La llama, el mito, la leyenda».`, `Você estende um isqueiro que pegou emprestado no pátio. O rosto da Paula faz um pequeno nascer do sol. «A chama, o mito, a lenda».`),
        do: { fun: 4, soc: 3, bond: {}, flag: 'paula_lit', unflag: 'have_light' }, next: 'story'
      },
      story: {
        text: t(`She lights up and tells you, unprompted, that tonight is the first time in two years she has come out alone. She's having a lovely time. She had forgotten how. "Anyway. Thank you for the fire."`, `Enciende y te cuenta, sin que preguntes, que esta noche es la primera vez en dos años que sale sola. Lo está pasando precioso. Había olvidado cómo. «En fin. Gracias por el fuego».`, `Ela acende e te conta, sem você perguntar, que hoje é a primeira vez em dois anos que sai sozinha. Está se divertindo muito. Tinha esquecido como era. «Enfim. Valeu pelo fogo».`),
        do: { soc: 2 }
      },
      after: {
        text: t(`Paula waves with two fingers from the other side of a cloud of smoke. "My favourite stranger."`, `Paula saluda con dos dedos desde el otro lado de una nube de humo. «Mi desconocido favorito».`, `A Paula acena com dois dedos do outro lado de uma nuvem de fumaça. «Minha estranha favorita».`),
        do: { soc: 1 }
      }
    }
  };
  /* the lighter lives in the courtyard */
  EM.DIALOGUES.obj_smoke.nodes.a.choices.push(K('chill', t(`Borrow a spare lighter for somebody.`, `Pedir prestado un encendedor para alguien.`, `Pegar um isqueiro emprestado pra alguém.`), { req: { flag: 'paula_wants_light', no: 'have_light' }, free: true, do: { flag: 'have_light' }, next: null, react: t(`A stranger hands you a lighter without looking up. "Bring it back." (You will not bring it back.)`, `Un desconocido te da un encendedor sin levantar la vista. «Devuélvelo». (No lo vas a devolver.)`, `Um estranho te passa um isqueiro sem levantar os olhos. «Devolve». (Você não vai devolver.)`) }));

  /* Pia and Moe: a small missing-friend chain */
  D.pia = {
    who: 'pia', role: t('LOOKING FOR A FRIEND', 'BUSCANDO A UN AMIGO', 'PROCURANDO UM AMIGO'), start: 'a', nodes: {
      a: { branch: [{ req: { flag: 'moe_told' }, to: 'thanks' }, { req: { flag: 'pia_asked' }, to: 'waiting' }, { req: function () { return true; }, to: 'ask' }] },
      ask: {
        text: t(`"Have you seen my friend? Moe. Tall, orange hat, looks like a nervous lamp." Pia checks her phone, which has no signal, which she checks again.`, `«¿Viste a mi amigo? Moe. Alto, gorro naranja, parece una lámpara nerviosa». Pia mira el celular, que no tiene señal, y lo vuelve a mirar.`, `«Você viu meu amigo? Moe. Alto, gorro laranja, parece um abajur nervoso». A Pia olha o celular, que está sem sinal, e olha de novo.`),
        choices: [
          K('care', t(`"I'll look for him. Stay here by the bench."`, `«Lo busco. Quédate aquí junto al banco».`, `«Vou procurar ele. Fica aqui perto do banco».`), { do: { flag: 'pia_asked', care: 1 }, next: null, react: t(`"You're an angel. Tell him I'm not mad. Tell him I'm a little mad."`, `«Eres un ángel. Dile que no estoy enojada. Dile que estoy un poco enojada».`, `«Você é um anjo. Fala que eu não estou brava. Fala que estou um pouco brava».`) }),
          K('chill', t(`"No, sorry. Hope you find him."`, `«No, perdón. Ojalá lo encuentres».`, `«Não, desculpa. Espero que você ache».`), { do: { soc: 1 }, next: null }),
          LEAVE()
        ]
      },
      waiting: { text: t(`"Anything? No? It's okay. He does this. He'll turn up in a corner, explaining a philosophy to a plant."`, `«¿Algo? ¿No? Está bien. Hace esto. Aparece en una esquina explicándole una filosofía a una planta».`, `«Alguma coisa? Não? Tudo bem. Ele faz isso. Aparece num canto explicando uma filosofia pra uma planta».`) },
      thanks: {
        text: t(`Moe has found the bench. Pia has found Moe. They're hugging like a pair of people who have been separated for a century. "You TOLD him! Come here, you wonderful stranger."`, `Moe encontró el banco. Pia encontró a Moe. Se abrazan como dos personas que se separaron un siglo. «¡Se lo DIJISTE! Ven acá, extraño maravilloso».`, `O Moe achou o banco. A Pia achou o Moe. Eles se abraçam como duas pessoas separadas há um século. «Você AVISOU ele! Vem cá, estranho maravilhoso».`),
        do: { fun: 5, soc: 4, flag: 'pia_reunited', item: { water: 1 } }, next: 'gift'
      },
      gift: { text: t(`Pia presses a cold bottle of water into your hands. "We always bring two. Take one. Pay it forward at 4am."`, `Pia te pone en las manos una botella fría de agua. «Siempre traemos dos. Toma una. Págala hacia adelante a las 4».`, `A Pia coloca uma garrafa de água gelada nas suas mãos. «A gente sempre leva duas. Pega uma. Passa pra frente às 4 da manhã».`) }
    }
  };
  D.moe = {
    who: 'moe', role: t('EXPLAINING A PHILOSOPHY TO A PLANT', 'EXPLICÁNDOLE UNA FILOSOFÍA A UNA PLANTA', 'EXPLICANDO UMA FILOSOFIA PRA UMA PLANTA'), start: 'a', nodes: {
      a: {
        text: t(`"— and that's why time is a flat circle, Gerald." Moe is addressing a plastic fern. "Oh. Hi. Gerald is a very good listener. Have you seen a girl called Pia? Confident. Impatient. Perfect."`, `«— y por eso el tiempo es un círculo plano, Gerald». Moe le habla a un helecho de plástico. «Ah. Hola. Gerald es muy buen oyente. ¿Viste a una chica que se llama Pia? Segura. Impaciente. Perfecta».`, `«— e é por isso que o tempo é um círculo plano, Gerald». O Moe fala com uma samambaia de plástico. «Ah. Oi. O Gerald é um ótimo ouvinte. Você viu uma garota chamada Pia? Segura. Impaciente. Perfeita».`),
        choices: [
          K('care', t(`"She's at the foyer bench. Go. Gerald will be fine."`, `«Está en el banco del foyer. Ve. Gerald va a estar bien».`, `«Ela está no banco do foyer. Vai. O Gerald vai ficar bem».`), { req: { flag: 'pia_asked' }, do: { flag: 'moe_told', care: 1, soc: 2 }, next: null, react: t(`Moe salutes the fern, bows to you, and runs the wrong way for three steps before correcting. Love is a compass, and it is also drunk.`, `Moe saluda al helecho, te hace una reverencia y corre en la dirección equivocada tres pasos antes de corregir. El amor es una brújula, y también está borracho.`, `O Moe bate continência pra samambaia, faz uma reverência pra você e corre pro lado errado por três passos antes de corrigir. O amor é uma bússola, e também está bêbado.`) }),
          K('joke', t(`"Gerald, can I borrow your friend's attention?"`, `«Gerald, ¿puedo pedirle prestada la atención a tu amigo?»`, `«Gerald, posso pegar emprestada a atenção do seu amigo?»`), { do: { fun: 3 }, next: null, react: t(`Moe gasps. "Nobody ever addresses Gerald directly. You are officially a friend of the fern."`, `Moe se queda sin aire. «Nadie le habla nunca directo a Gerald. Eres oficialmente amigo del helecho».`, `O Moe fica sem ar. «Ninguém nunca fala direto com o Gerald. Você é oficialmente amigo da samambaia».`) }),
          LEAVE()
        ]
      }
    }
  };

  D.bruce = {
    who: 'bruce', role: t('SECURITY', 'SEGURIDAD', 'SEGURANÇA'), start: 'a', nodes: {
      a: {
        text: t(`"Evening. Bruce. Security. I stand here and look like a decision." He is enormous and gentle, and has a tiny pin of a cat on his lanyard.`, `«Buenas. Bruce. Seguridad. Me paro aquí y parezco una decisión». Es enorme y gentil, y lleva un pin chiquito de un gato en la credencial.`, `«Boa noite. Bruce. Segurança. Eu fico aqui e pareço uma decisão». Ele é enorme e gentil, e tem um pin minúsculo de um gato no crachá.`),
        choices: [
          K('honest', t(`"I'm a bit overwhelmed. Is there somewhere quiet?"`, `«Todo esto me abruma un poco. ¿Hay algún lugar tranquilo?»`, `«Isso tudo me sobrecarrega um pouco. Tem algum lugar calmo?»`), { do: { weird: -6, soc: 3, flag: 'bruce_tip' }, next: null, react: t(`"Quiet room, left of the foyer. Dark room is fine if you want the dark. Nobody stares in either. We watch the loud ones, not the quiet ones." He nods like a mountain agreeing.`, `«Sala tranquila, a la izquierda del foyer. El cuarto oscuro está bien si quieres oscuridad. En ninguno te miran. Vigilamos a los ruidosos, no a los callados». Asiente como una montaña que está de acuerdo.`, `«Sala de calma, à esquerda do foyer. A dark room serve se você quer o escuro. Em nenhuma ninguém fica olhando. A gente vigia os barulhentos, não os quietos». Ele assente como uma montanha concordando.`) }),
          K('joke', t(`"Is there a list for the list for the list?"`, `«¿Hay una lista para la lista de la lista?»`, `«Tem uma lista pra lista da lista?»`), { do: { fun: 3 }, next: null, react: t(`"Æ000.X has a list. I have a clipboard with a drawing of a list. It has been enough for eleven years."`, `«Æ000.X tiene lista. Yo tengo una carpeta con el dibujo de una lista. Me ha alcanzado once años».`, `«A Æ000.X tem lista. Eu tenho uma prancheta com um desenho de uma lista. Foi suficiente por onze anos».`) }),
          K('bold', t(`"Would you like to dance?"`, `«¿Quieres bailar?»`, `«Quer dançar?»`), { do: { fun: 2, weird: 1, soc: 1 }, next: null, react: t(`"On duty? No. After close? Ask me at eight." He is smiling very slightly. It rearranges his entire face.`, `«¿De servicio? No. ¿Después del cierre? Pregúntame a las ocho». Sonríe muy poco. Le reordena toda la cara.`, `«De serviço? Não. Depois do fechamento? Pergunta às oito». Ele sorri bem de leve. Isso reorganiza o rosto dele inteiro.`) }),
          K('care', t(`"How are you? Nobody asks the guard."`, `«¿Cómo estás? Nadie le pregunta al guardia».`, `«Como você tá? Ninguém pergunta pro segurança».`), { do: { care: 1, soc: 2, flag: 'bruce_cared' }, next: null, react: t(`He is quiet for a moment. "Honestly? My feet hurt, and I miss my cat. Thank you for asking. It's the nicest thing that's happened since the cat." `, `Se queda callado un momento. «¿La verdad? Me duelen los pies y extraño a mi gato. Gracias por preguntar. Es lo más lindo que me pasó desde el gato».`, `Ele fica quieto por um momento. «Sinceramente? Meus pés doem e sinto falta do meu gato. Obrigado por perguntar. É a coisa mais gentil que aconteceu desde o gato».`) }),
          LEAVE()
        ]
      }
    }
  };

  /* dancing in groups */
  S.air_dj = function () {
    U.danceGate({ seq: 'ULRDU', attempts: 3 }, function (res) {
      if (res === 'win') { L.apply({ fun: 9, soc: 3, flag: 'airdj_win' }); U.toast({ icon: 'star', text: t(`Gus screams, "THE DROP!" You both fling imaginary faders at the ceiling. A small crowd forms. Somebody asks for an encore of a song nobody has heard.`, `Gus grita: «¡EL DROP!» Los dos lanzan faders imaginarios al techo. Se forma un grupito. Alguien pide un bis de una canción que nadie ha oído.`, `O Gus grita: «O DROP!» Vocês dois jogam faders imaginários no teto. Forma-se um grupinho. Alguém pede bis de uma música que ninguém ouviu.`), kind: 'good' }); }
      else if (res === 'partial') { L.apply({ fun: 4, soc: 1 }); U.toast({ text: t(`Gus nods. "Your crossfade is rough, but your heart's in the mix."`, `Gus asiente. «Tu crossfade está áspero, pero tu corazón está en la mezcla».`, `O Gus assente. «Seu crossfade tá áspero, mas seu coração tá na mixagem».`), kind: 'info' }); }
      else { L.apply({ fun: 1, weird: 2 }); U.toast({ text: t(`You trip over an invisible cable. Gus keeps going. The show must go on.`, `Te tropiezas con un cable invisible. Gus sigue. El show debe continuar.`, `Você tropeça num cabo invisível. O Gus continua. O show tem que continuar.`), kind: 'info' }); }
    });
  };
  D.gus = {
    who: 'gus', role: t('AIR DJ', 'DJ DE AIRE', 'DJ DE AR'), start: 'a', nodes: {
      a: {
        text: t(`Gus is DJing an invisible set with enormous gestures: headphone cupped, a long dramatic fader pull, a finger to the sky. "Shh. I'm in the middle of the best transition of my life."`, `Gus pincha un set invisible con gestos enormes: auricular apretado, un largo y dramático movimiento de fader, un dedo al cielo. «Shh. Estoy en medio de la mejor transición de mi vida».`, `O Gus está discotecando um set invisível com gestos enormes: fone encaixado, uma longa e dramática puxada de fader, um dedo pro céu. «Shh. Estou no meio da melhor transição da minha vida».`),
        choices: [
          K('dance', t(`"Take my hand. Show me the transition."`, `«Toma mi mano. Muéstrame la transición».`, `«Pega minha mão. Me mostra a transição».`), { call: 'air_dj', next: null, free: true }),
          K('joke', t(`"What's the tracklist?"`, `«¿Cuál es el tracklist?»`, `«Qual é a tracklist?»`), { do: { fun: 2 }, next: null, react: t(`"Track one: silence. Track two: a gentle sigh. Track three: your mum's laugh at 140 BPM. Track four: I don't talk about track four."`, `«Tema uno: silencio. Tema dos: un suspiro suave. Tema tres: la risa de tu mamá a 140 BPM. Tema cuatro: de ese no hablo».`, `«Faixa um: silêncio. Faixa dois: um suspiro suave. Faixa três: a risada da sua mãe a 140 BPM. Faixa quatro: dessa eu não falo».`) }),
          LEAVE()
        ]
      }
    }
  };
  S.line_dance = function () {
    U.danceGate({ seq: 'LRLRUD', attempts: 3 }, function (res) {
      const party = EM.state.party.length;
      if (res === 'win') { L.apply({ fun: 10 + party, soc: 3, flag: 'line_dance' }); U.toast({ icon: 'star', text: t(`The whole line moves as one animal. At the last turn Ana-Lu points at you: "THIS PERSON!" Strangers cheer.`, `Toda la fila se mueve como un solo animal. En el último giro Ana-Lu te señala: «¡ESTA PERSONA!» Los desconocidos aplauden.`, `A fila inteira se move como um bicho só. Na última virada a Ana-Lu aponta pra você: «ESSA PESSOA!» Os desconhecidos aplaudem.`), kind: 'good' }); }
      else if (res === 'partial') { L.apply({ fun: 5, soc: 2 }); U.toast({ text: t(`You keep up for five of the six. Ana-Lu salutes. "Good enough for a Friday."`, `Aguantas cinco de los seis. Ana-Lu hace la venia. «Suficiente para un viernes».`, `Você acompanha cinco dos seis. A Ana-Lu bate continência. «Bom o bastante pra uma sexta».`), kind: 'info' }); }
      else { L.apply({ fun: 2, soc: -1, weird: 1 }); U.toast({ text: t(`You turn left while the line turns right. A very kind person steers you by the shoulders back into formation.`, `Giras a la izquierda mientras la fila gira a la derecha. Una persona muy amable te devuelve a la formación tomándote por los hombros.`, `Você vira à esquerda enquanto a fila vira à direita. Uma pessoa muito gentil te guia pelos ombros de volta à formação.`), kind: 'info' }); }
    });
  };
  D.analu = {
    who: 'analu', role: t('LINE-DANCE CAPTAIN', 'CAPITANA DEL BAILE EN LÍNEA', 'CAPITÃ DA DANÇA EM LINHA'), start: 'a', nodes: {
      a: {
        text: t(`"LINE DANCE! In FIVE minutes! Tonight the line is a mood, the mood is a line, and the line has NO leader — except me, I'm the leader." Ana-Lu is holding a megaphone that is not plugged into anything.`, `«¡BAILE EN LÍNEA! ¡En CINCO minutos! Esta noche la línea es un estado de ánimo, el estado de ánimo es una línea, y la línea NO tiene líder — excepto yo, yo soy la líder». Ana-Lu sostiene un megáfono que no está enchufado a nada.`, `«DANÇA EM LINHA! Em CINCO minutos! Hoje a linha é um humor, o humor é uma linha, e a linha NÃO tem líder — exceto eu, eu sou a líder». A Ana-Lu segura um megafone que não está ligado em nada.`),
        choices: [
          K('dance', t(`"I'm in. Where do I stand?"`, `«Me sumo. ¿Dónde me paro?»`, `«Tô dentro. Onde eu fico?»`), { call: 'line_dance', next: null, free: true }),
          K('joke', t(`"Is the megaphone plugged in?"`, `«¿El megáfono está enchufado?»`, `«O megafone tá ligado?»`), { do: { fun: 3 }, next: null, react: t(`"EVERYTHING IS PLUGGED IN, IF YOU BELIEVE." She says it in a normal voice, and it's louder than a megaphone.`, `«TODO ESTÁ ENCHUFADO SI CREES». Lo dice con voz normal, y suena más fuerte que un megáfono.`, `«TUDO ESTÁ LIGADO, SE VOCÊ ACREDITAR». Ela fala com voz normal e é mais alto que um megafone.`) }),
          LEAVE()
        ]
      }
    }
  };

  D.wenzhao = {
    who: 'wen', role: t('TOUCH-UPS', 'RETOQUES', 'RETOQUES'), start: 'a', nodes: {
      a: {
        text: t(`Wen and Zhao are doing each other's eyeliner at the mirror with the focus of two surgeons. "Hold still." "I AM holding still." "You're blinking." "That's called being alive."`, `Wen y Zhao se hacen el delineado la una a la otra frente al espejo con la concentración de dos cirujanas. «Quédate quieta». «ESTOY quieta». «Estás parpadeando». «Eso se llama estar viva».`, `A Wen e a Zhao estão fazendo o delineado uma na outra no espelho com a concentração de duas cirurgiãs. «Fica parada». «Eu ESTOU parada». «Você tá piscando». «Isso se chama estar viva».`),
        choices: [
          K('smooth', t(`"Your liner is flawless. Both of you."`, `«Su delineado es impecable. Las dos».`, `«O delineado de vocês é impecável. As duas».`), { do: { fun: 3, soc: 2, flag: 'wen_friends' }, next: 'glitter' }),
          K('joke', t(`"Can I be a third arm?"`, `«¿Puedo ser un tercer brazo?»`, `«Posso ser um terceiro braço?»`), { do: { fun: 3 }, next: null, react: t(`Zhao hands you a tissue and a mirror to hold. You are now, officially, the mirror-holder. It is the most important job in the building.`, `Zhao te pasa un pañuelo y un espejo para sostener. Ahora eres, oficialmente, el que sostiene el espejo. Es el trabajo más importante del edificio.`, `A Zhao te passa um lenço e um espelho pra segurar. Agora você é, oficialmente, o segurador do espelho. É o trabalho mais importante do prédio.`) }),
          LEAVE()
        ]
      },
      glitter: {
        text: t(`Wen swivels, glitter pot in hand. "Face. Cheekbones. Hold still. Zhao, it's happening, we have a volunteer."`, `Wen gira con un frasco de glitter en la mano. «Cara. Pómulos. Quédate quieto. Zhao, está pasando, tenemos voluntario».`, `A Wen gira com um potinho de glitter na mão. «Rosto. Maçãs do rosto. Fica parado. Zhao, tá acontecendo, temos um voluntário».`),
        choices: [
          K('bold', t(`"Go all in."`, `«Con todo».`, `«Pode caprichar».`), { do: { fun: 5, fresh: 60, weird: 1, flag: 'glittered' }, next: null, react: t(`You are a disco ball at cheekbone height. People will find glitter on you for three weeks. You've never looked more correct.`, `Eres una bola disco a la altura de los pómulos. Van a encontrarte glitter durante tres semanas. Nunca te viste más correcto.`, `Você é uma bola de discoteca na altura das maçãs do rosto. Vão achar glitter em você por três semanas. Você nunca esteve tão certo.`) }),
          K('chill', t(`"A little. Just a hint."`, `«Un poquito. Solo una sugerencia».`, `«Só um pouquinho. Só uma sugestão».`), { do: { fun: 3, fresh: 40, flag: 'glittered' }, next: null }),
          K('chill', t(`"Maybe next time."`, `«Quizás la próxima».`, `«Quem sabe da próxima».`), { free: true, next: null })
        ]
      }
    }
  };
  D.lupe = {
    who: 'lupe', role: t('CRYING IN A CORNER', 'LLORANDO EN UN RINCÓN', 'CHORANDO NUM CANTO'), start: 'a', nodes: {
      a: {
        text: t(`A girl is sitting on the tile in the corner with her knees up, wiping mascara with the heel of her hand. She sees you and says, quickly, "I'm okay. I'm fine. This is just what my face does when I'm happy."`, `Una chica está sentada en el piso del rincón con las rodillas arriba, limpiándose el rímel con la base de la mano. Te ve y dice rápido: «Estoy bien. Estoy bien. Esto es solo lo que hace mi cara cuando estoy feliz».`, `Uma garota está sentada no chão do canto com os joelhos pra cima, limpando o rímel com a base da mão. Ela te vê e diz, rápido: «Eu tô bem. Tô bem. É só o que meu rosto faz quando estou feliz».`),
        choices: [
          K('care', t(`Sit on the floor next to her. Say nothing for a minute.`, `Sentarte en el piso a su lado. No decir nada por un minuto.`, `Sentar no chão ao lado dela. Não dizer nada por um minuto.`), { do: { care: 1, time: 10, soc: -3, flag: 'lupe_helped' }, next: 'open', react: t(`The silence is the kindest thing in the room. After a while, she leans her head very slightly towards your shoulder. A line of cold light runs under the door.`, `El silencio es lo más amable del cuarto. Al rato, inclina la cabeza muy levemente hacia tu hombro. Una línea de luz fría corre bajo la puerta.`, `O silêncio é a coisa mais gentil da sala. Depois de um tempo, ela inclina a cabeça muito de leve em direção ao seu ombro. Uma linha de luz fria corre por baixo da porta.`) }),
          K('care', t(`Offer your water.`, `Ofrecer tu agua.`, `Oferecer sua água.`), { req: { item: 'water' }, do: { item: { water: -1 }, care: 1, flag: 'lupe_helped' }, next: 'open', react: t(`She drinks, gratefully, with both hands. "…Thank you. I didn't know I was thirsty. I didn't know a lot of things."`, `Toma, agradecida, con las dos manos. «…Gracias. No sabía que tenía sed. No sabía muchas cosas».`, `Ela bebe, agradecida, com as duas mãos. «…Obrigada. Eu não sabia que estava com sede. Eu não sabia muitas coisas».`) }),
          K('chill', t(`"It'll be fine! Cheer up!"`, `«¡Va a estar todo bien! ¡Anímate!»`, `«Vai ficar tudo bem! Anima!»`), { do: { soc: -2 }, bad: true, next: null, react: t(`She smiles with her mouth, nothing else. "Sure. Thanks." Telling somebody to cheer up works exactly as well as it sounds.`, `Sonríe con la boca, nada más. «Claro. Gracias». Decirle a alguien que se anime funciona exactamente tan bien como suena.`, `Ela sorri só com a boca. «Claro. Valeu». Mandar alguém se animar funciona exatamente tão bem quanto parece.`) }),
          LEAVE()
        ]
      },
      open: {
        text: t(`"It's nothing. It's everything. I thought I'd be braver tonight. I'm in a toilet crying with my phone on 4%." She laughs, a wet, startled laugh. "God. I feel better. That's annoying."`, `«No es nada. Es todo. Pensé que iba a ser más valiente esta noche. Estoy en un baño llorando con el celular al 4%». Se ríe, una risa mojada y sorprendida. «Dios. Me siento mejor. Qué fastidio».`, `«Não é nada. É tudo. Achei que seria mais corajosa hoje. Estou num banheiro chorando com o celular a 4%». Ela ri, uma risada molhada e surpresa. «Nossa. Me sinto melhor. Que irritante».`),
        do: { soc: 2 }
      }
    }
  };
  D.otto = {
    who: 'otto', role: t('CRYSTALS (BEST OFFER)', 'CRISTALES (MEJOR OFERTA)', 'CRISTAIS (MELHOR OFERTA)'), start: 'a', nodes: {
      a: {
        text: t(`"A charged amethyst, one euro. Absorbs bad vibes, emits good ones, doubles as a doorstop." Otto holds up a grey pebble the way people hold up a newborn.`, `«Una amatista cargada, un euro. Absorbe malas vibras, emite buenas, sirve de tope de puerta». Otto levanta un guijarro gris como se levanta a un recién nacido.`, `«Uma ametista carregada, um euro. Absorve vibração ruim, emite vibração boa, serve de calço de porta». O Otto levanta uma pedrinha cinza como quem levanta um recém-nascido.`),
        choices: [
          K('chill', t(`"What does it do, honestly?"`, `«¿Qué hace, de verdad?»`, `«O que ela faz, sinceramente?»`), { next: 'honest' }),
          K('joke', t(`"I'll give you a hug for it."`, `«Te doy un abrazo a cambio».`, `«Te dou um abraço por ela».`), { call: 'otto_haggle', next: null, free: true }),
          K('bold', t(`Buy it. For the doorstop.`, `Comprarla. Por el tope de puerta.`, `Comprar. Pelo calço de porta.`), { do: { fun: 3, soc: -1, flag: 'crystal' }, next: null, react: t(`It is warm from his pocket. It is also, you realise, a perfectly good stone. You feel oddly calmer. This is how religions start.`, `Está tibia de su bolsillo. También es, te das cuenta, una piedra perfectamente buena. Te sientes extrañamente más tranquilo. Así empiezan las religiones.`, `Está morna do bolso dele. Também é, você percebe, uma pedra perfeitamente boa. Você se sente estranhamente mais calmo. É assim que as religiões começam.`) }),
          LEAVE()
        ]
      },
      honest: {
        text: t(`Otto lowers his voice. "Honestly? It's a rock. But I've sold four hundred rocks and nobody's ever asked for a refund. Do you know why? Because holding a thing and deciding you're okay is a technology." He is, a little, right.`, `Otto baja la voz. «¿De verdad? Es una piedra. Pero vendí cuatrocientas piedras y nadie pidió reembolso. ¿Sabes por qué? Porque sostener algo y decidir que estás bien es una tecnología». Tiene, un poco, razón.`, `O Otto baixa a voz. «Sinceramente? É uma pedra. Mas já vendi quatrocentas pedras e ninguém nunca pediu reembolso. Sabe por quê? Porque segurar uma coisa e decidir que você está bem é uma tecnologia». Ele tem, um pouco, razão.`),
        do: { soc: 2, fun: 1 }, next: 'a'
      }
    }
  };
  S.otto_haggle = function () {
    const ok = Math.random() < 0.5;
    if (ok) { L.apply({ fun: 5, soc: 2, flag: 'crystal' }); U.toast({ icon: 'heart', text: t(`The hug lasts too long, and Otto cries into your shoulder a little. The pebble is yours. "Don't tell anybody it cost a hug. It ruins the margins."`, `El abrazo dura demasiado, y Otto llora un poco sobre tu hombro. El guijarro es tuyo. «No le cuentes a nadie que costó un abrazo. Arruina los márgenes».`, `O abraço dura demais e o Otto chora um pouquinho no seu ombro. A pedrinha é sua. «Não conta pra ninguém que custou um abraço. Estraga as margens».`), kind: 'good' }); }
    else { L.apply({ fun: 2, soc: -2 }); U.toast({ text: t(`"A hug? I'm a professional." He takes the hug, hands you the pebble, and looks around nervously as if he has just committed tax fraud.`, `«¿Un abrazo? Soy un profesional». Acepta el abrazo, te da el guijarro y mira alrededor nervioso como si acabara de cometer fraude fiscal.`, `«Um abraço? Sou profissional». Ele aceita o abraço, te dá a pedrinha e olha em volta nervoso como se tivesse acabado de cometer fraude fiscal.`), kind: 'info' }); }
  };

  /* rock, paper, scissors with a stranger who takes it seriously */
  const RPS = ['rock', 'paper', 'scissors'];
  function rps(k) {
    return function () {
      const me = k, them = RPS[Math.floor(Math.random() * 3)];
      const ix = RPS.indexOf(me), jx = RPS.indexOf(them);
      const name = { rock: t('ROCK', 'PIEDRA', 'PEDRA'), paper: t('PAPER', 'PAPEL', 'PAPEL'), scissors: t('SCISSORS', 'TIJERA', 'TESOURA') };
      const nm = function (x) { return name[x]; };
      let verdict, kind;
      if (ix === jx) { L.apply({ fun: 2 }); verdict = t('DRAW. Yui narrows her eyes. "Again."', 'EMPATE. Yui entrecierra los ojos. «Otra vez».', 'EMPATE. A Yui aperta os olhos. «De novo».'); kind = 'info'; }
      else if ((ix + 1) % 3 === jx) { L.apply({ fun: -1, soc: -1 }); verdict = t('YOU LOSE. Yui bows with terrifying grace.', 'PERDISTE. Yui hace una reverencia con una gracia aterradora.', 'VOCÊ PERDEU. A Yui faz uma reverência com uma graça aterrorizante.'); kind = 'bad'; }
      else { L.apply({ fun: 5, soc: 1, flag: 'beat_yui' }); verdict = t('YOU WIN. Yui nods once. "Respect."', 'GANASTE. Yui asiente una vez. «Respeto».', 'VOCÊ GANHOU. A Yui assente uma vez. «Respeito».'); kind = 'good'; }
      U.toast({ icon: 'hand', text: t(`YOU: ${nm(me).en} / YUI: ${nm(them).en}. `, `TÚ: ${nm(me).es} / YUI: ${nm(them).es}. `, `VOCÊ: ${nm(me).pt} / YUI: ${nm(them).pt}. `), kind: 'info', ms: 2200, nolog: true });
      U.toast({ text: verdict, kind: kind, ms: 3600 });
    };
  }
  S.yui_r = rps('rock'); S.yui_p = rps('paper'); S.yui_s = rps('scissors');
  D.yui = {
    who: 'yui', role: t('CHALLENGER', 'RETADORA', 'DESAFIANTE'), start: 'a', nodes: {
      a: {
        text: t(`"Rock, paper, scissors." Yui says it like a sentence handed down by a court. "Best of nothing. For honour. Or for nothing. I don't judge."`, `«Piedra, papel o tijera». Yui lo dice como una sentencia dictada por un tribunal. «Lo mejor de nada. Por honor. O por nada. No juzgo».`, `«Pedra, papel ou tesoura». A Yui fala como uma sentença proferida por um tribunal. «Melhor de nada. Por honra. Ou por nada. Não julgo».`),
        choices: [
          K('bold', t(`ROCK.`, `PIEDRA.`, `PEDRA.`), { call: 'yui_r', next: 'a', free: true }),
          K('bold', t(`PAPER.`, `PAPEL.`, `PAPEL.`), { call: 'yui_p', next: 'a', free: true }),
          K('bold', t(`SCISSORS.`, `TIJERA.`, `TESOURA.`), { call: 'yui_s', next: 'a', free: true }),
          LEAVE()
        ]
      }
    }
  };
  D.sia = {
    who: 'sia', role: t('POEMS FOR STRANGERS', 'POEMAS PARA DESCONOCIDOS', 'POEMAS PARA DESCONHECIDOS'), start: 'a', nodes: {
      a: {
        text: t(`A small handwritten sign on a pad of paper: POEMS, WHILE YOU WAIT. NO REFUNDS. Sia looks up with one pen behind her ear and a second one in her hair. "Pick a subject."`, `Un cartelito escrito a mano sobre un bloc de papel: POEMAS, MIENTRAS ESPERAS. SIN REEMBOLSOS. Sia levanta la vista con un lápiz detrás de la oreja y otro en el pelo. «Elige un tema».`, `Uma plaquinha escrita à mão num bloco de papel: POEMAS, ENQUANTO VOCÊ ESPERA. SEM REEMBOLSO. A Sia levanta os olhos com uma caneta atrás da orelha e outra no cabelo. «Escolha um assunto».`),
        choices: [
          K('chill', t(`"This night."`, `«Esta noche».`, `«Esta noite».`), { do: { fun: 3, soc: 3, flag: 'poem' }, next: null, react: t(`"The room is a throat. / The song, a swallow. / Somebody's laughing in the bathroom / and that is the best of us."`, `«El cuarto es una garganta. / La canción, un trago. / Alguien se ríe en el baño / y eso es lo mejor de nosotros».`, `«A sala é uma garganta. / A música, um gole. / Alguém ri no banheiro / e isso é o melhor de nós».`) }),
          K('honest', t(`"Me."`, `«Yo».`, `«Eu».`), { do: { fun: 2, soc: 4, flag: 'poem' }, next: null, react: t(`"{name}: you came / with your good shoes and your bad week. / The week can wait outside. / The shoes are doing great."`, `«{name}: llegaste / con tus buenos zapatos y tu mala semana. / La semana puede esperar afuera. / Los zapatos van muy bien».`, `«{name}: você chegou / com seus sapatos bons e sua semana ruim. / A semana pode esperar lá fora. / Os sapatos estão indo muito bem».`) }),
          K('hug', t(`"My friends."`, `«Mis amigos».`, `«Meus amigos».`), { do: { fun: 2, soc: 3, bond: { maru: 1, dani: 1, tato: 1 }, flag: 'poem' }, next: null, react: t(`"One who's late, one who's loud, / one who needs a wall. / A small army of people / who all like you, in the dark."`, `«Uno que llega tarde, uno que grita, / uno que necesita una pared. / Un pequeño ejército de gente / que te quiere, en la oscuridad».`, `«Um que atrasa, um que grita, / um que precisa de uma parede. / Um pequeno exército de gente / que gosta de você, no escuro».`) }),
          LEAVE()
        ]
      }
    }
  };
  D.ruth = {
    who: 'ruth', role: t('KNITTING IN THE QUIET ROOM', 'TEJIENDO EN LA SALA TRANQUILA', 'TRICOTANDO NA SALA DE CALMA'), start: 'a', nodes: {
      a: {
        text: t(`An older woman is knitting something long and green with the unhurried rhythm of a metronome that has seen a lot. "Don't worry about my needles. They only bite on Thursdays. Sit, sit. Do you want tea?"`, `Una mujer mayor teje algo largo y verde con el ritmo sin prisa de un metrónomo que ha visto mucho. «No te preocupes por mis agujas. Solo muerden los jueves. Siéntate, siéntate. ¿Quieres té?»`, `Uma mulher mais velha tricota algo longo e verde com o ritmo sem pressa de um metrônomo que viu muita coisa. «Não se preocupe com minhas agulhas. Só mordem às quintas. Senta, senta. Quer chá?»`),
        choices: [
          K('care', t(`"Tea, please."`, `«Té, por favor».`, `«Chá, por favor».`), { do: { hp: 5, soc: 6, time: 8, flag: 'ruth_tea' }, next: 'tea' }),
          K('ask', t(`"What are you knitting?"`, `«¿Qué estás tejiendo?»`, `«O que você tá tricotando?»`), { do: { soc: 1 }, next: 'scarf' }),
          LEAVE()
        ]
      },
      tea: {
        text: t(`The tea tastes of cardamom and certainty. "My first one was in 1989. A cow field, a generator, and a man with a kettle. We danced until the generator died. Then we danced without it." She smiles at the wool. "It's always been the same night."`, `El té sabe a cardamomo y certeza. «La primera fue en 1989. Un campo de vacas, un generador y un hombre con una pava. Bailamos hasta que murió el generador. Luego bailamos sin él». Le sonríe a la lana. «Siempre ha sido la misma noche».`, `O chá tem gosto de cardamomo e certeza. «O meu primeiro foi em 1989. Um pasto de vacas, um gerador e um homem com uma chaleira. A gente dançou até o gerador morrer. Depois dançou sem ele». Ela sorri pra lã. «Sempre foi a mesma noite».`),
        do: { soc: 2 }
      },
      scarf: {
        text: t(`"A scarf for whoever needs it at sunrise. I don't know who yet. The wool always knows before I do." She holds it against your neck for a second, measuring. "Hm. Not you. You're warm enough."`, `«Una bufanda para quien la necesite al amanecer. Todavía no sé quién. La lana siempre sabe antes que yo». La sostiene contra tu cuello un segundo, midiendo. «Mm. Tú no. Ya tienes suficiente calor».`, `«Um cachecol pra quem precisar ao amanhecer. Ainda não sei quem. A lã sempre sabe antes de mim». Ela segura contra o seu pescoço por um segundo, medindo. «Hm. Você não. Já está quentinho o bastante».`),
        next: 'a'
      }
    }
  };
  D.cleo = {
    who: 'cleo', role: t('A VERY SPECIFIC FAN', 'UNA FAN MUY ESPECÍFICA', 'UMA FÃ MUITO ESPECÍFICA'), start: 'a', nodes: {
      a: {
        branch: [{ req: { flag: 'note_delivered' }, to: 'after' }, { req: { flag: 'note_cleo' }, to: 'waiting' }, { req: function () { return true; }, to: 'ask' }]
      },
      ask: {
        text: t(`"Please. PLEASE. I have a note for ÆRIEL and I cannot go near the booth because I will cry on the equipment. Can you pass it along? It says… never mind what it says. It's an important note."`, `«Por favor. POR FAVOR. Tengo una nota para ÆRIEL y no puedo acercarme a la cabina porque voy a llorar sobre el equipo. ¿Puedes hacérsela llegar? Dice… no importa lo que dice. Es una nota importante».`, `«Por favor. POR FAVOR. Tenho um bilhete pra ÆRIEL e não posso chegar perto da cabine porque vou chorar em cima do equipamento. Você pode entregar? Diz… esquece o que diz. É um bilhete importante».`),
        choices: [
          K('care', t(`"I'll find them. Promise."`, `«Los busco. Lo prometo».`, `«Eu procuro. Prometo».`), { do: { flag: 'note_cleo', soc: 1 }, next: null, react: t(`She presses a folded napkin into your palm like a state secret. It smells faintly of glitter and nerves.`, `Te pone una servilleta doblada en la palma como un secreto de estado. Huele levemente a glitter y a nervios.`, `Ela coloca um guardanapo dobrado na sua palma como um segredo de Estado. Cheira levemente a glitter e a nervos.`) }),
          K('joke', t(`"Is it a love letter?"`, `«¿Es una carta de amor?»`, `«É uma carta de amor?»`), { next: 'ask2' }),
          LEAVE()
        ]
      },
      ask2: { text: t(`"It's a REQUEST. That is a different genre. Please."`, `«Es un PEDIDO. Es otro género. Por favor».`, `«É um PEDIDO. É outro gênero. Por favor».`), next: 'ask' },
      waiting: { text: t(`"Did you find them? No? That's fine. That's FINE. Backstage, probably. Past the staff door. Look sad and confident."`, `«¿Los encontraste? ¿No? Está bien. Está BIEN. Backstage, probablemente. Pasando la puerta de staff. Pon cara triste y segura».`, `«Você achou? Não? Tudo bem. Tá TUDO BEM. Backstage, provavelmente. Passando a porta do staff. Faz cara triste e confiante».`) },
      after: {
        text: t(`"You DID it?! They READ it?! What did they SAY?" You tell her. She sits down on the floor, very slowly, and puts her hands on her face. Whatever you said, it was enough.`, `«¡¿LO HICISTE?! ¡¿LA LEYERON?! ¡¿QUÉ DIJERON?!» Se lo cuentas. Se sienta en el piso, muy despacio, y se tapa la cara con las manos. Lo que fuera que dijiste, alcanzó.`, `«Você FEZ?! Eles LERAM?! O que eles DISSERAM?» Você conta. Ela se senta no chão, bem devagar, e cobre o rosto com as mãos. O que quer que você tenha dito, foi o bastante.`),
        do: { fun: 5, soc: 4, flag: 'cleo_happy' }
      }
    }
  };
  /* ÆRIEL reads the note */
  D.resident.nodes.note = {
    text: [
      t(`You hold out a damp napkin. ÆRIEL unfolds it with the care of someone opening a very small parachute. They read it. They read it again. Their face does something extremely complicated.`, `Le tiendes una servilleta húmeda. ÆRIEL la despliega con el cuidado de quien abre un paracaídas muy pequeño. La lee. La lee otra vez. Su cara hace algo extremadamente complicado.`, `Você estende um guardanapo úmido. ÆRIEL desdobra com o cuidado de quem abre um paraquedas bem pequeno. Lê. Lê de novo. O rosto faz algo extremamente complicado.`),
      t(`"It says: 'I love you, but also please play the sad one at five, the one that sounds like a hallway at dawn.' …Tell her I'll play the sad one." A beat. "And tell her I love her too. In the broad, communal sense."`, `«Dice: “Te quiero, pero también, por favor, toca la triste a las cinco, la que suena a pasillo al amanecer”. …Dile que voy a tocar la triste». Una pausa. «Y dile que yo también la quiero. En el sentido amplio y comunitario».`, `«Diz: “Eu te amo, mas também, por favor, toca a triste às cinco, aquela que parece um corredor ao amanhecer”. …Fala pra ela que eu vou tocar a triste». Uma pausa. «E fala que eu também a amo. No sentido amplo e comunitário».`)
    ],
    do: { flag: 'note_delivered', fun: 4, soc: 3 }, next: 'a'
  };
  D.resident.nodes.a.choices.push(K('care', t(`Hand over Cleo's napkin.`, `Entregar la servilleta de Cleo.`, `Entregar o guardanapo da Cleo.`), { req: { flag: 'note_cleo', no: 'note_delivered' }, next: 'note' }));

  /* ============================================================ PLACEMENT */
  const N = function (zone, d) { Z[zone].npc(d); };
  N('doors', { id: 'kai', x: 9.5, y: 8.5, dlg: 'kai', dir: 'r', reach: 18 });
  N('doors', { id: 'paula', x: 5.5, y: 5.5, dlg: 'paula', dir: 'r', reach: 16 });
  N('foyer', { id: 'pia', x: 16.5, y: 11.5, dlg: 'pia', dir: 'u', reach: 16 });
  N('foyer', { id: 'vera', x: 12.5, y: 7.5, dlg: 'vera', dir: 'd', reach: 16, when: NF('vera_done') });
  N('foyer', { id: 'bruce', x: 6.5, y: 10.5, dlg: 'bruce', dir: 'u', reach: 18, when: function (s) { return s.venue !== 'rave'; } });
  N('main', { id: 'gus', x: 4.5, y: 8.5, dlg: 'gus', dir: 'r', reach: 16 });
  N('main', { id: 'ines', x: 36.5, y: 22.5, dlg: 'ines', dir: 'r', reach: 16, when: NF('ines_done') });
  N('main', { id: 'rafa', x: 14.5, y: 27.5, dlg: 'rafa', dir: 'u', reach: 16, when: NF('rafa_done') });
  N('main', { id: 'analu', x: 28.5, y: 26.5, dlg: 'analu', dir: 'd', reach: 18 });
  N('restrooms', { id: 'wenzhao', pair: ['wen', 'zhao'], x: 5.5, y: 6.5, dlg: 'wenzhao', dir: 'u', reach: 18 });
  N('restrooms', { id: 'lupe', x: 15.5, y: 17.5, dlg: 'lupe', dir: 'l', pose: 'sit', reach: 16, when: NF('lupe_helped') });
  N('darkroom', { id: 'nox', x: 20, y: 12.5, dlg: 'nox', dir: 'l', reach: 16, when: NF('nox_done') });
  N('tunnel', { id: 'moe', x: 19.5, y: 3.5, dlg: 'moe', dir: 'd', reach: 16, when: function (s) { return !s.flags.moe_told; } });
  N('courtyard', { id: 'otto', x: 13.5, y: 4.5, dlg: 'otto', dir: 'd', reach: 16 });
  N('courtyard', { id: 'yui', x: 27.5, y: 8.5, dlg: 'yui', dir: 'd', reach: 16 });
  N('courtyard', { id: 'sia', x: 3.5, y: 16.5, dlg: 'sia', dir: 'r', reach: 16 });
  N('welfare', { id: 'ruth', x: 10, y: 6.5, dlg: 'ruth', dir: 'l', pose: 'sit', reach: 16 });
  N('attic', { id: 'cleo', x: 25.5, y: 20.5, dlg: 'cleo', dir: 'l', reach: 16 });
  N('attic', { id: 'mina', x: 14.5, y: 3.5, dlg: 'mina', dir: 'l', reach: 16, when: NF('mina_done') });
  N('rooftop', { id: 'ludo', x: 20.5, y: 8.5, dlg: 'ludo', dir: 'l', reach: 16, when: function (s) { return !s.flags.ludo_done && !!s.flags.roof_open; } });
})();

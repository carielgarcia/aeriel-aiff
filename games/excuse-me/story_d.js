/* EXCUSE ME — story D: the dark room, the tunnel, the smoking area. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  function B(f, n) { const o = {}; o[f] = n; return o; }

  /* ============================================================ DARK ROOM */
  S.enter_darkroom = function () {
    const s = EM.state;
    if (!s.flags.dario_met) {
      s.flags.dario_met = true;
      U.startDialogue('dario', { npc: 'dario' });
    }
  };
  /* consent violation: you are walked out of the room */
  S.dario_removes = function () {
    const s = EM.state;
    L.apply({ weird: 45, soc: -10, flag: ['consent_violation', 'pushed'] });
    U.toast({ icon: 'eyes', text: T('DARIO walks you out. No shouting. His hand never touches you. Your name is now in a very small book.', 'DARIO te saca. Sin gritos. Su mano nunca te toca. Tu nombre quedó en un libro muy pequeño.', 'O DARIO te leva pra fora. Sem gritos. A mão dele nunca te toca. Seu nome está agora num livro muito pequeno.'), kind: 'bad', ms: 6500 });
    if (!s.ended) EM.hooks.travel({ zone: 'main', x: 1, y: 26, dir: 'r' });
  };

  D.dario = {
    who: 'dario', role: T('DOOR OF THE DARK ROOM', 'PUERTA DEL CUARTO OSCURO', 'PORTA DA DARK ROOM'), forced: false, start: 'start', nodes: {
      start: {
        branch: [
          { req: { min: { weird: 65 } }, to: 'denied' },
          { req: function () { return true; }, to: 'a' }
        ]
      },
      denied: {
        text: T('DARIO looks at you, then at the dark behind him, then at you. "Tonight you look like trouble. The room is for people who can listen. Sit by the door for ten minutes. If you still want to come in then, we\'ll see."', 'DARIO te mira, luego a la oscuridad detrás de él, luego a ti. «Esta noche te ves como un problema. El cuarto es para gente que sabe escuchar. Siéntate junto a la puerta diez minutos. Si todavía quieres entrar, vemos».', 'O DARIO te olha, depois pro escuro atrás dele, depois pra você. «Hoje você tá com cara de problema. A sala é pra quem sabe ouvir. Senta perto da porta dez minutos. Se ainda quiser entrar depois, a gente vê».'),
        do: { time: 10, weird: -6, hp: 3 },
        next: 'a'
      },
      a: {
        text: [
          T('"Welcome. Everyone gets the rules, so here they are. Ask first. Yes is a word. No is a sentence. Nobody films. Nobody pushes. Nobody stays where they aren\'t wanted. If you are not sure, you are not in. If anything makes you uncomfortable, you tell me, and the other person leaves. Understood?"', '«{Bienvenido|Bienvenida|Les damos la bienvenida}. Todos reciben las reglas, así que aquí están. Preguntar primero. Sí es una palabra. No es una oración completa. Nadie filma. Nadie empuja. Nadie se queda donde no lo quieren. Si no estás seguro, no estás adentro. Si algo te incomoda, me lo dices, y la otra persona se va. ¿Entendido?»', '«{Bem-vindo|Bem-vinda|Boas-vindas}. Todo mundo recebe as regras, então aqui estão. Pergunte primeiro. Sim é uma palavra. Não é uma frase completa. Ninguém filma. Ninguém empurra. Ninguém fica onde não é querido. Se você não tem certeza, não tá dentro. Se algo te incomoda, me fala, e a outra pessoa sai. Entendido?»')
        ],
        choices: [
          { tone: 'chill', t: T('"Understood."', '«Entendido».', '«Entendido».'), do: { soc: 1, flag: 'dario_rules' }, next: null },
          { tone: 'ask', t: T('"What if I\'m just here to sit?"', '«¿Y si solo vengo a sentarme?»', '«E se eu só vim pra sentar?»'), do: { soc: 1, flag: 'dario_rules' }, next: null, react: T('"Sitting is welcome. People forget that is allowed. There is a couch at the back with nobody on it. Sit there. Nobody will ask you for anything."', '«Sentarse es bienvenido. La gente se olvida de que está permitido. Hay un sofá al fondo sin nadie. Siéntate ahí. Nadie te va a pedir nada».', '«Sentar é bem-vindo. As pessoas esquecem que é permitido. Tem um sofá no fundo sem ninguém. Senta lá. Ninguém vai te pedir nada».') },
          { tone: 'joke', t: T('"Does \'no pushing\' include the dance floor?"', '«¿“Nadie empuja” incluye la pista?»', '«“Ninguém empurra” inclui a pista?»'), do: { fun: 2, flag: 'dario_rules' }, next: null, react: T('One corner of his mouth. "Especially the dance floor."', 'Una comisura de su boca. «Especialmente la pista».', 'Um canto da boca dele. «Principalmente a pista».') },
          { tone: 'blunt', t: T('"That\'s a lot of rules for a dark room."', '«Son muchas reglas para un cuarto oscuro».', '«É muita regra pra uma dark room».'), do: { soc: -2, flag: 'dario_rules' }, next: null, react: T('"The rules are why it can be dark and safe at the same time."', '«Las reglas son lo que permite que sea oscuro y seguro a la vez».', '«As regras são o que permite ser escuro e seguro ao mesmo tempo».') }
        ]
      }
    }
  };
  D.dario_again = {
    who: 'dario', role: T('DOOR OF THE DARK ROOM', 'PUERTA DEL CUARTO OSCURO', 'PORTA DA DARK ROOM'), start: 'a', nodes: {
      a: {
        text: T('"Everyone okay in there?" Dario is leaning on the frame. He has the posture of a man who has been asked a thousand questions and answered every one of them honestly.', '«¿Todos bien ahí adentro?» Dario está apoyado en el marco. Tiene la postura de un hombre al que le preguntaron mil cosas y respondió todas con honestidad.', '«Todo mundo bem aí dentro?» O Dario tá encostado no batente. Tem a postura de um homem a quem perguntaram mil coisas e respondeu todas com honestidade.'),
        choices: [
          { tone: 'care', t: T('"There\'s a first-timer by the couch who looked nervous. I told them about you."', '«Hay un primerizo junto al sofá que se veía nervioso. Le hablé de ti».', '«Tem um primeiro-timer perto do sofá que parecia nervoso. Falei de você pra ele».'), req: { flag: 'newbie_done' }, do: { soc: 3 }, next: null, react: T('He nods once. "Thank you. That is the whole job."', 'Asiente una vez. «Gracias. Ese es todo el trabajo».', 'Ele assente uma vez. «Valeu. Esse é o trabalho todo».') },
          { tone: 'chill', t: T('"All good. Just checking in."', '«Todo bien. Solo paso a saludar».', '«Tudo bem. Só passando pra dar um oi».'), do: { soc: 2 }, next: null }
        ]
      }
    }
  };

  D.sofa_dr = {
    who: 'sofa1', role: T('COUPLE', 'PAREJA', 'CASAL'), start: 'a', nodes: {
      a: {
        text: T('Two people on the sofa share a blanket and a very long kiss. They surface as you approach, lipstick smeared like a war crime. "Hi! We\'re good. Are you good?"', 'Dos personas en el sofá comparten una manta y un beso larguísimo. Emergen cuando te acercas, con el labial corrido como un crimen de guerra. «¡Hola! Estamos bien. ¿Tú estás bien?»', 'Duas pessoas no sofá dividem um cobertor e um beijo longuíssimo. Elas emergem quando você se aproxima, batom borrado como um crime de guerra. «Oi! A gente tá bem. Você tá bem?»'),
        choices: [
          { tone: 'chill', t: T('"Just passing. Have a wonderful night."', '«Solo paso. Que tengan una noche maravillosa».', '«Só passando. Tenham uma noite maravilhosa».'), do: { fun: 1, soc: 1 }, next: null },
          { tone: 'ask', t: T('"May I sit nearby? I just want to be near people."', '«¿Puedo sentarme cerca? Solo quiero estar cerca de gente».', '«Posso sentar por perto? Só quero ficar perto de gente».'), do: { soc: 6, time: 10, fun: 1 }, next: null, react: T('"Of course. Take the corner. We\'ll make noise but we\'ll be polite about it." You sit for ten minutes in the dark, being company. It is surprisingly restful.', '«Claro. Toma la esquina. Vamos a hacer ruido, pero con educación». Te sientas diez minutos en la oscuridad, haciendo compañía. Es sorprendentemente descansado.', '«Claro. Pega o canto. A gente vai fazer barulho, mas com educação». Você senta dez minutos no escuro, fazendo companhia. É surpreendentemente tranquilo.') },
          { tone: 'bold', t: T('"May I join you? If you\'re both into it."', '«¿Puedo unirme? Si los dos quieren».', '«Posso me juntar? Se os dois toparem».'), do: { fun: 3, soc: 2, time: 3 }, next: null, react: T('They look at each other, a whole conversation in one second. "We\'re a two tonight. Thank you for asking so nicely. It\'s a really good ask."', 'Se miran, toda una conversación en un segundo. «Esta noche somos dos. Gracias por preguntar tan bien. Es una muy buena forma de preguntar».', 'Eles se olham, uma conversa inteira em um segundo. «Hoje a gente é dois. Valeu por perguntar tão bem. É uma ótima forma de perguntar».') },
          { tone: 'push', t: T('"Come on, it\'ll be quick."', '«Vamos, va a ser rápido».', '«Vamos, vai ser rápido».'), call: 'dario_removes', next: null, free: true, bad: true }
        ]
      }
    }
  };

  D.trio = {
    who: 'trio1', role: T('A FEW PEOPLE', 'UNAS PERSONAS', 'ALGUMAS PESSOAS'), start: 'a', nodes: {
      a: {
        text: T('Three people on the mattresses, hair a mess, grins soft. "We\'re a few. We\'re friendly. We have rules." One of them is feeding the other two grapes with the seriousness of a priest.', 'Tres personas en los colchones, pelo revuelto, sonrisas suaves. «Somos unos cuantos. Somos amables. Tenemos reglas». Una de ellas les da uvas a las otras dos con la seriedad de un sacerdote.', 'Três pessoas nos colchões, cabelo bagunçado, sorrisos suaves. «A gente é algumas. A gente é amigável. A gente tem regras». Uma delas dá uvas pras outras duas com a seriedade de um padre.'),
        choices: [
          { tone: 'ask', t: T('"May I sit near you? Just to be around people."', '«¿Puedo sentarme cerca? Solo para estar entre gente».', '«Posso sentar perto? Só pra ficar entre gente».'), do: { soc: 8, fun: 3, time: 15 }, next: null, react: T('A grape is placed in your hand without comment. For fifteen minutes you are one more warm thing in a warm room.', 'Una uva aparece en tu mano sin comentarios. Durante quince minutos eres una cosa tibia más en un cuarto tibio.', 'Uma uva é posta na sua mão sem comentários. Por quinze minutos você é mais uma coisa morna numa sala morna.') },
          { tone: 'bold', t: T('"I\'d love to join, if everyone\'s into it."', '«Me encantaría unirme, si todos quieren».', '«Eu adoraria me juntar, se todo mundo topar».'), next: 'join' },
          { tone: 'chill', t: T('"Just exploring. Carry on!"', '«Solo exploro. ¡Sigan!»', '«Só explorando. Podem continuar!»'), do: { fun: 1 }, next: null },
          { tone: 'push', t: T('"Come on, I\'m just joining."', '«Vamos, solo me uno».', '«Vamos, eu só vou entrar».'), call: 'dario_removes', next: null, free: true, bad: true }
        ]
      },
      join: {
        text: [
          T('They look at each other. Nobody speaks for a moment. Then, one by one, each of them says something quiet and clear. One says "I\'m in." One says "Ask me what I\'m into." The third looks at you for a long moment. "I\'m a maybe. Ask me again in ten minutes."', 'Se miran entre sí. Nadie habla por un momento. Luego, uno por uno, cada uno dice algo bajo y claro. Uno dice «Estoy dentro». Otro dice «Pregúntame qué me gusta». El tercero te mira un largo momento. «Soy un quizás. Pregúntame de nuevo en diez minutos».', 'Eles se olham. Ninguém fala por um momento. Depois, um a um, cada um diz algo baixo e claro. Um diz «Tô dentro». Outro diz «Me pergunta do que eu gosto». O terceiro te olha por um longo momento. «Eu sou um talvez. Me pergunta de novo daqui a dez minutos».'),
          T('"Your turn," says the first one. "What are you into? What are you not? What\'s your word if you want to stop?"', '«Tu turno», dice el primero. «¿Qué te gusta? ¿Qué no? ¿Cuál es tu palabra si quieres parar?»', '«Sua vez», diz o primeiro. «Do que você gosta? Do que não gosta? Qual é sua palavra se quiser parar?»')
        ],
        choices: [
          { tone: 'honest', t: T('Say what you\'re into, what you\'re not, and pick a word.', 'Decir qué te gusta, qué no, y elegir una palabra.', 'Dizer do que gosta, do que não gosta, e escolher uma palavra.'), do: { fun: 18, soc: -4, hp: -4, time: 45, flag: 'trio_joined' }, next: null, react: T('The next forty-five minutes are none of anybody\'s business. When you surface, someone hands you water, someone else hands you a blanket, and somebody asks, with real attention, "How are you feeling?" Nobody leaves until everyone says they\'re good.', 'Los siguientes cuarenta y cinco minutos no son asunto de nadie. Cuando emerges, alguien te da agua, otro te da una manta, y alguien pregunta, con atención de verdad, «¿Cómo te sientes?» Nadie se va hasta que todos dicen que están bien.', 'Os próximos quarenta e cinco minutos não são da conta de ninguém. Quando você emerge, alguém te dá água, outro te dá um cobertor, e alguém pergunta, com atenção de verdade, «Como você tá se sentindo?» Ninguém sai até todo mundo dizer que tá bem.') },
          { tone: 'honest', t: T('"Actually, I\'m nervous. Can I just talk?"', '«En realidad, {estoy nervioso|estoy nerviosa|me dan nervios}. ¿Puedo solo hablar?»', '«Na real, {tô nervoso|tô nervosa|isso me deixa tenso}. Posso só conversar?»'), do: { soc: 10, fun: 3, time: 20, flag: 'trio_talked' }, next: null, react: T('"Of course. That\'s allowed. That is one of the best things you can say in this room." Twenty minutes of talk, grapes and shoulders. You leave lighter.', '«Claro. Está permitido. Es una de las mejores cosas que se pueden decir en este cuarto». Veinte minutos de charla, uvas y hombros. Te vas más liviano.', '«Claro. É permitido. É uma das melhores coisas que se pode dizer nesta sala». Vinte minutos de conversa, uvas e ombros. Você sai mais leve.') },
          { tone: 'silent', t: T('Back out gracefully.', 'Retirarte con gracia.', 'Recuar com elegância.'), do: { soc: 1 }, next: null, react: T('"Thank you for checking with us. Seriously. Come back anytime."', '«Gracias por consultarnos. En serio. Vuelve cuando quieras».', '«Valeu por consultar a gente. Sério. Volta quando quiser».') }
        ]
      }
    }
  };

  D.newbie = {
    who: 'newbie', role: T('FIRST TIME', 'PRIMERA VEZ', 'PRIMEIRA VEZ'), start: 'a', nodes: {
      a: {
        text: T('A first-timer is standing very close to the wall with their hands tucked into their sleeves. "I\'m — sorry. I\'m not sure I\'m supposed to be here. I wanted to see. I don\'t know. Everybody looks like they know."', 'Una persona primeriza está parada muy cerca de la pared con las manos metidas en las mangas. «Perdón. No sé si debería estar aquí. Quería ver. No sé. Todos parecen saber».', 'Uma pessoa de primeira viagem está parada bem perto da parede com as mãos enfiadas nas mangas. «Desculpa. Não sei se eu deveria estar aqui. Eu queria ver. Não sei. Todo mundo parece saber».'),
        choices: [
          { tone: 'care', t: T('"Nobody knows. Come on — let me introduce you to Dario. He\'ll explain how it works."', '«Nadie sabe. Ven — te presento a Dario. Te explicará cómo funciona».', '«Ninguém sabe. Vem — deixa eu te apresentar o Dario. Ele explica como funciona».'), do: { care: 1, flag: 'newbie_done', soc: -1, time: 5 }, next: null, react: T('You walk them to the door. Dario nods like he was expecting them and starts, gently, from the beginning. They glance back at you with huge eyes. "Thank you."', 'Los acompañas a la puerta. Dario asiente como si los esperara y empieza, con suavidad, desde el principio. Te miran con ojos enormes. «Gracias».', 'Você os leva até a porta. O Dario assente como se esperasse e começa, com delicadeza, do começo. Eles olham pra você de olhos enormes. «Obrigado».') },
          { tone: 'chill', t: T('"It\'s okay to just watch. Take your time."', '«Está bien solo mirar. Tómate tu tiempo».', '«Tudo bem só olhar. Sem pressa».'), do: { soc: 2, flag: 'newbie_done' }, next: null },
          { tone: 'flirt', t: T('"First time? I can show you around. A lot."', '«¿Primera vez? Puedo mostrarte todo. Bastante».', '«Primeira vez? Posso te mostrar tudo. Bastante».'), do: { weird: 8, soc: -3, flag: ['newbie_done', 'newbie_creeped'] }, next: null, bad: true, react: T('They flinch and leave toward Dario with fast steps. Dario looks at you with the face of a door closing.', 'Se sobresaltan y se van hacia Dario con pasos rápidos. Dario te mira con la cara de una puerta que se cierra.', 'Eles se assustam e vão em direção ao Dario com passos rápidos. O Dario te olha com a cara de uma porta se fechando.') }
        ]
      }
    }
  };

  /* ============================================================ TUNNEL */
  S.enter_tunnel = function () {
    const s = EM.state;
    if (!s.flags.tunnel_first) { s.flags.tunnel_first = true; U.toast({ icon: 'eyes', text: T('The tunnel is dark. You can only see what is near you. Lamps are the only places you can see anyone.', 'El túnel está oscuro. Solo ves lo que tienes cerca. Las lámparas son los únicos lugares donde se ve a alguien.', 'O túnel está escuro. Você só vê o que está perto. As lâmpadas são os únicos lugares onde dá pra ver alguém.'), kind: 'info', ms: 5000 }); }
  };

  D.recog = {
    who: 'recog', role: T('STRANGER', 'DESCONOCIDO', 'DESCONHECIDO'), start: 'a', nodes: {
      a: {
        text: T('"WAIT. I KNOW YOU. You\'re — the corridor! Room for one more! You\'re the one who asked the couple!" They are delighted. They are delighted in a way that will follow you through the night.', '«ESPERA. TE CONOZCO. Eres — ¡el pasillo! ¡Hay lugar para uno más! ¡Tú eres quien le preguntó a la pareja!» Están encantados. Encantados de una manera que te va a seguir toda la noche.', '«PERAÍ. EU TE CONHEÇO. Você é — o corredor! Tem lugar pra mais um! Foi você que perguntou pro casal!» Estão encantados. Encantados de um jeito que vai te seguir a noite inteira.'),
        do: { flag: 'recog_done' },
        choices: [
          { tone: 'joke', t: T('"Allegedly."', '«Presuntamente».', '«Supostamente».'), do: { fun: 3 }, next: null, react: T('"ALLEGEDLY!" they scream, to nobody. A legend is born, and it is yours.', '«¡PRESUNTAMENTE!» gritan, a nadie. Nace una leyenda, y es tuya.', '«SUPOSTAMENTE!» gritam, pra ninguém. Nasce uma lenda, e é sua.') },
          { tone: 'chill', t: T('"Ha. Nice to see you again."', '«Ja. Qué bueno verte otra vez».', '«Ha. Bom te ver de novo».'), do: { soc: 2 }, next: null },
          { tone: 'blunt', t: T('"Never seen you in my life."', '«No te vi en mi vida».', '«Nunca te vi na vida».'), do: { soc: -1, weird: 1 }, next: null }
        ]
      }
    }
  };

  D.juno = {
    who: 'juno', role: T('NOT OKAY', 'NO ESTÁ BIEN', 'NÃO ESTÁ BEM'), start: 'a', nodes: {
      a: {
        text: T('Against the tunnel wall, curled around their own knees: Juno. "I can\'t — the walls are doing a — my hands aren\'t — I can\'t find my friends — I don\'t want to be here anymore —" Their eyes are huge and focused on something that is not the tunnel.', 'Contra la pared del túnel, enroscada alrededor de sus propias rodillas: Juno. «No puedo — las paredes están haciendo — mis manos no son — no encuentro a mis amigos — ya no quiero estar aquí —» Sus ojos son enormes y están clavados en algo que no es el túnel.', 'Contra a parede do túnel, enrolada nos próprios joelhos: Juno. «Eu não consigo — as paredes tão fazendo — minhas mãos não são — não acho meus amigos — não quero mais estar aqui —» Os olhos dela são enormes e fixos em algo que não é o túnel.'),
        choices: [
          { tone: 'care', t: T('Sit beside them. Slow voice: "Hey. I\'m here. You\'re okay. You\'re in a tunnel, it\'s late, and it is going to end."', 'Sentarte a su lado. Voz lenta: «Hola. Estoy aquí. Estás bien. Estás en un túnel, es tarde, y esto va a terminar».', 'Sentar do lado. Voz lenta: «Oi. Eu tô aqui. Você tá bem. Você tá num túnel, é tarde, e isso vai acabar».'), do: { care: 1, time: 15, soc: -3, flag: 'juno_sat' }, next: 'sat' },
          { tone: 'water', t: T('Hand them water. No pressure.', 'Darles agua. Sin presión.', 'Passar água. Sem pressão.'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, flag: 'juno_water' }, next: 'sat', react: T('They take the bottle in both hands like it might float away. Their breathing slows by one notch.', 'Toman la botella con las dos manos como si pudiera irse flotando. Su respiración baja una marcha.', 'Eles pegam a garrafa com as duas mãos como se ela pudesse sair flutuando. A respiração diminui um nível.') },
          { tone: 'sober', t: T('Call the medics. "I\'m getting somebody who helps with this."', 'Llamar a los médicos. «Voy a buscar a alguien que sabe ayudar con esto».', 'Chamar os médicos. «Vou chamar alguém que sabe ajudar com isso».'), req: { maxHigh: 1 }, do: { care: 1, time: 6, flag: 'juno_medic', soc: -1 }, next: null, react: T('Teo arrives in four minutes with a blanket and the calm of a man who sees a lot of this. "Hi, Juno. I\'m Teo. I\'m going to sit with you." He nods at you without any weight. "Good call. Thank you."', 'Teo llega en cuatro minutos con una manta y la calma de quien ve mucho de esto. «Hola, Juno. Soy Teo. Me voy a sentar contigo». Te asiente sin peso. «Buena decisión. Gracias».', 'O Teo chega em quatro minutos com um cobertor e a calma de quem vê muito disso. «Oi, Juno. Sou o Teo. Vou sentar com você». Ele assente pra você sem peso nenhum. «Boa decisão. Obrigado».') },
          { tone: 'blunt', t: T('"You\'ll be fine. Walk it off."', '«Vas a estar bien. Camínalo».', '«Você vai ficar bem. Caminha que passa».'), do: { soc: -4, weird: 6, flag: 'juno_ignored' }, next: null, bad: true, react: T('They look at you like you were a cloud. You keep walking. It stays with you a lot longer than the tunnel does.', 'Te miran como si fueras una nube. Sigues caminando. Se queda contigo mucho más tiempo que el túnel.', 'Elas te olham como se você fosse uma nuvem. Você continua andando. Isso fica com você muito mais tempo do que o túnel.') }
        ]
      },
      sat: {
        text: T('After a few minutes, Juno\'s hands stop shaking. "…Marta. Pablo. They\'re my friends. I think they went to the smoking area? I lost my phone. Or my phone lost me."', 'Después de unos minutos, las manos de Juno dejan de temblar. «…Marta. Pablo. Son mis amigos. ¿Creo que fueron a la zona de fumar? Perdí mi celular. O mi celular me perdió a mí».', 'Depois de alguns minutos, as mãos da Juno param de tremer. «…Marta. Pablo. São meus amigos. Acho que foram pra área de fumantes? Perdi meu celular. Ou meu celular me perdeu».'),
        choices: [
          { tone: 'care', t: T('"Let\'s walk to the smoking area together and find them."', '«Vamos juntos a la zona de fumar y los encontramos».', '«Vamos juntos até a área de fumantes e encontramos eles».'), do: { care: 1, time: 12, flag: ['juno_done', 'juno_found_friends'], soc: -2 }, next: null, react: T('Marta and Pablo are in a hammock of coats near the barrels, frantic and relieved. Juno cries, they all cry, and you wave goodbye at the edge of the smoke. You get a hug that tastes like cigarettes and gratitude.', 'Marta y Pablo están en una hamaca de camperas junto a los barriles, frenéticos y aliviados. Juno llora, todos lloran, y te despides en el borde del humo. Recibes un abrazo con gusto a cigarrillo y gratitud.', 'A Marta e o Pablo estão numa rede de casacos perto dos barris, frenéticos e aliviados. A Juno chora, todo mundo chora, e você acena de despedida na borda da fumaça. Ganha um abraço com gosto de cigarro e gratidão.') },
          { tone: 'care', t: T('"Let\'s go to the quiet room. Someone there can sit with you."', '«Vamos a la sala tranquila. Ahí alguien puede sentarse contigo».', '«Vamos pra sala de calma. Lá alguém pode sentar com você».'), do: { care: 1, time: 10, flag: ['juno_done', 'juno_quiet'], soc: -2 }, next: null, react: T('Isi meets you at the door with a blanket already in her arms. "Hi, Juno. Come in."', 'Isi te recibe en la puerta con una manta ya en los brazos. «Hola, Juno. Pasa».', 'A Isi te recebe na porta com um cobertor já nos braços. «Oi, Juno. Entra».'), call: 'juno_to_welfare' }
        ]
      }
    }
  };
  S.juno_to_welfare = function () { EM.hooks.travel({ zone: 'welfare', x: 19, y: 7, dir: 'l' }); };

  D.alcove = {
    who: 'hk1', role: T('BUSY', 'OCUPADOS', 'OCUPADOS'), start: 'a', nodes: {
      a: {
        text: T('In the alcove: two silhouettes, extremely busy. The tunnel acoustics are doing nobody any favours. They do not seem to mind.', 'En el nicho: dos siluetas, muy ocupadas. La acústica del túnel no le hace ningún favor a nadie. No parece importarles.', 'No nicho: duas silhuetas, muito ocupadas. A acústica do túnel não faz favor nenhum a ninguém. Elas não parecem se importar.'),
        choices: [
          { tone: 'chill', t: T('Walk past with your eyes forward.', 'Pasar con la vista al frente.', 'Passar com o olhar pra frente.'), do: { soc: -1, fun: 1 }, next: null },
          { tone: 'joke', t: T('(Whisper) "Tunnel acoustics are incredible."', '(Susurrando) «La acústica del túnel es increíble».', '(Sussurrando) «A acústica do túnel é incrível».'), do: { fun: 3 }, next: null, react: T('A hand emerges from the dark and gives you a thumbs-up. It does not pause.', 'Una mano emerge de la oscuridad y te da un pulgar arriba. No se detiene.', 'Uma mão emerge do escuro e dá um joinha pra você. Não pausa.') },
          { tone: 'care', t: T('"Hey — do you two have water? It\'s a long night."', '«Oigan — ¿tienen agua? Es una noche larga».', '«Ei — vocês têm água? A noite é longa».'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, fun: 2 }, next: null, react: T('A very long silence. Then a very amused: "…Thank you." The bottle disappears into the dark with a hand that is entirely unembarrassed.', 'Un silencio larguísimo. Luego un muy divertido: «…Gracias». La botella desaparece en la oscuridad con una mano nada avergonzada.', 'Um silêncio longuíssimo. Depois um bem divertido: «…Obrigado». A garrafa some no escuro com uma mão nada envergonhada.') },
          { tone: 'bold', t: T('"Need a hand?"', '«¿Necesitan una mano?»', '«Precisam de uma mão?»'), do: { fun: 2, weird: 2 }, next: null, react: T('"Ask us again in ten years!" It is a joke. They laugh. You keep walking, smiling like a person who just survived something.', '«¡Pregúntanos otra vez en diez años!» Es un chiste. Se ríen. Sigues caminando, sonriendo como alguien que sobrevivió a algo.', '«Pergunta de novo daqui a dez anos!» É uma piada. Eles riem. Você segue andando, sorrindo como quem sobreviveu a algo.') }
        ]
      }
    }
  };

  D.rico = {
    who: 'rico', role: T('SELLER', 'VENDEDOR', 'VENDEDOR'), start: 'a', nodes: {
      a: {
        text: T('"Psst. Quiet night? I\'ve got what you want. I\'ve got what you didn\'t know you wanted." He is wearing a beanie at a confident angle and a smile that has never read a manual.', '«Psst. ¿Noche tranquila? Tengo lo que quieres. Tengo lo que no sabías que querías». Lleva un gorro en un ángulo confiado y una sonrisa que nunca leyó un manual.', '«Psiu. Noite tranquila? Tenho o que você quer. Tenho o que você nem sabia que queria». Ele usa uma touca num ângulo confiante e um sorriso que nunca leu um manual.'),
        choices: [
          { tone: 'ask', t: T('"Do you sell pills with a little crown stamped on them?"', '«¿Vendes pastillas con una coronita estampada?»', '«Você vende comprimidos com uma coroinha estampada?»'), req: function (s) { return s.pill.type && s.pill.tested; }, next: 'pill' },
          { tone: 'ask', t: T('"What do you actually sell?"', '«¿Qué vendes en realidad?»', '«O que você vende de verdade?»'), next: 'what' },
          { tone: 'no', t: T('"No, thanks."', '«No, gracias».', '«Não, valeu».'), free: true, next: null }
        ]
      },
      what: {
        text: T('"Same as the other guy, but worse lighting." He shrugs. "I don\'t push. People come to me. Be careful out there."', '«Lo mismo que el otro tipo, pero con peor iluminación». Se encoge de hombros. «No empujo. La gente viene a mí. Cuídate por ahí».', '«O mesmo que o outro cara, mas com iluminação pior». Ele dá de ombros. «Eu não empurro. As pessoas vêm até mim. Se cuida aí fora».'),
        next: null
      },
      pill: {
        who: 'rico',
        text: T('"The crown ones? Yeah. Real stuff. Always real stuff." He sees your face. "…Who\'s asking?"', '«¿Las de la corona? Sí. Cosa real. Siempre cosa real». Ve tu cara. «…¿Quién pregunta?»', '«As da coroa? É. Coisa de verdade. Sempre coisa de verdade». Ele vê seu rosto. «…Quem tá perguntando?»'),
        choices: [
          { tone: 'honest', t: T('"Someone got it checked. It wasn\'t what you said it was."', '«Alguien la hizo chequear. No era lo que dijiste».', '«Alguém mandou checar. Não era o que você disse».'), req: function (s) { return s.pill.type === 'mix' || s.pill.type === 'fake'; }, do: { care: 1, soc: -2, flag: 'rico_confronted' }, next: 'ashamed' },
          { tone: 'honest', t: T('"Nothing. Just wanted to know where you got them."', '«Nada. Solo quería saber de dónde las sacas».', '«Nada. Só queria saber de onde você tira».'), req: function (s) { return s.pill.type === 'pure'; }, do: { soc: 1 }, next: null, react: T('"A guy. I buy from a guy. I do not test, and I should." He looks at his shoes. "…I\'m going to start testing."', '«Un tipo. Le compro a un tipo. No testeo, y debería». Mira sus zapatos. «…Voy a empezar a testear».', '«Um cara. Compro de um cara. Não testo, e deveria». Ele olha pros sapatos. «…Vou começar a testar».') }
        ]
      },
      ashamed: {
        who: 'rico',
        text: T('Rico\'s grin goes out like a light. "…Okay. That\'s — okay. I buy from a guy. I don\'t test. I should. I really should." He rubs the back of his neck. "I\'m going to hold off on the rest of mine tonight. And — I\'m sorry. Tell your friend. I\'m sorry."', 'La sonrisa de Rico se apaga como una luz. «…Ok. Eso es — ok. Le compro a un tipo. No testeo. Debería. De verdad debería». Se frota la nuca. «Voy a esperar con las que me quedan esta noche. Y — perdón. Dile a tu amigo. Perdón».', 'O sorriso do Rico apaga como uma luz. «…Tá. Isso é — tá. Compro de um cara. Não testo. Deveria. Deveria mesmo». Ele esfrega a nuca. «Vou segurar o resto das minhas hoje. E — desculpa. Fala pro seu amigo. Desculpa».'),
        do: { fun: 2, soc: 2, flag: 'rico_sorry' }
      }
    }
  };

  D.ximena = {
    who: 'ximena', role: T('ARTIST', 'ARTISTA', 'ARTISTA'), start: 'a', nodes: {
      a: {
        text: T('Ximena is painting the tunnel wall with a can and a grin, one large crack in letters taller than her, glowing with a trace of white paint. "People never ask what I\'m painting. They just ask if it\'s legal. Hint: it is."', 'Ximena pinta la pared del túnel con una lata y una sonrisa, una gran grieta en letras más altas que ella, brillando con un rastro de pintura blanca. «La gente nunca pregunta qué pinto. Solo si es legal. Pista: lo es».', 'A Ximena pinta a parede do túnel com uma lata e um sorriso, uma grande rachadura em letras maiores que ela, brilhando com um rastro de tinta branca. «As pessoas nunca perguntam o que eu pinto. Só se é legal. Dica: é».'),
        choices: [
          { tone: 'ask', t: T('"What are you painting?"', '«¿Qué estás pintando?»', '«O que você tá pintando?»'), next: 'b' },
          { tone: 'chill', t: T('"It looks incredible."', '«Se ve increíble».', '«Tá incrível».'), do: { soc: 2 }, next: null }
        ]
      },
      b: {
        text: T('"GRIETA. Crack. Cracks are where the light gets in. Also the water. That is the building\'s two jobs." She hands you the can. "Pick a word. One. Small. In the corner, there."', '«GRIETA. Una rajadura. Las grietas son por donde entra la luz. También el agua. Esos son los dos trabajos del edificio». Te da la lata. «Elige una palabra. Una. Pequeña. En la esquina, ahí».', '«GRIETA. Rachadura. Rachaduras são por onde entra a luz. E a água. Esses são os dois trabalhos do prédio». Ela te passa a lata. «Escolhe uma palavra. Uma. Pequena. No canto, ali».'),
        choices: [
          { tone: 'care', t: T('Paint: ASK FIRST', 'Pintar: PREGUNTA PRIMERO', 'Pintar: PERGUNTE PRIMEIRO'), do: { fun: 3, soc: 4, flag: 'graffiti_ask' }, next: null, react: T('Ximena nods. "Good. That one stays."', 'Ximena asiente. «Bien. Esa se queda».', 'A Ximena assente. «Bom. Essa fica».') },
          { tone: 'care', t: T('Paint: NOBODY LEAVES ALONE', 'Pintar: NADIE SE VA SOLO', 'Pintar: NINGUÉM VAI EMBORA SOZINHO'), do: { fun: 3, soc: 4, flag: 'graffiti_alone' }, next: null, react: T('She reads it slowly. "…yes."', 'Lo lee despacio. «…sí».', 'Ela lê devagar. «…sim».') },
          { tone: 'joke', t: T('Paint: I WAS HERE (ALLEGEDLY)', 'Pintar: ESTUVE AQUÍ (PRESUNTAMENTE)', 'Pintar: ESTIVE AQUI (SUPOSTAMENTE)'), do: { fun: 5, soc: 2, flag: 'graffiti_joke' }, next: null, react: T('She laughs so hard she drops the can. "Leave it."', 'Se ríe tanto que se le cae la lata. «Déjalo».', 'Ela ri tanto que derruba a lata. «Deixa assim».') }
        ]
      }
    }
  };

  /* ============================================================ SMOKING AREA */
  D.tourists = {
    who: 'jonas', role: T('TOURISTS', 'TURISTAS', 'TURISTAS'), start: 'a', nodes: {
      a: {
        gesture: true,
        text: T('JONAS: "Entschuldigung! Sprechen Sie… English? Español? …Nada?" IDA: "Wir suchen die Toilette. Oder einen Ort, wo man atmen kann." They speak only German. You can tell from the miming that they are looking for the toilets, or somewhere to breathe. Choose a gesture.', 'JONAS: «¡Entschuldigung! Sprechen Sie… English? Español? …¿Nada?» IDA: «Wir suchen die Toilette. Oder einen Ort, wo man atmen kann». Solo hablan alemán. Por la mímica se nota que buscan los baños, o un lugar donde respirar. Elige un gesto.', 'JONAS: «Entschuldigung! Sprechen Sie… English? Español? …Nada?» IDA: «Wir suchen die Toilette. Oder einen Ort, wo man atmen kann». Eles só falam alemão. Pela mímica dá pra ver que procuram os banheiros, ou um lugar pra respirar. Escolha um gesto.'),
        choices: [
          { icon: 'point', t: T('Point back toward the tunnel and mime "toilets"', 'Señalar hacia el túnel y mimar «baños»', 'Apontar pro túnel e mimar «banheiros»'), do: { soc: 1, fun: 1, flag: 'tourists_helped' }, next: null, react: T('Ida laughs and does a bow. "Danke! Danke schön!" Jonas gives you a thumbs-up so enthusiastic that it becomes a short dance.', 'Ida se ríe y hace una reverencia. «¡Danke! ¡Danke schön!» Jonas te da un pulgar arriba tan entusiasta que se convierte en un baile corto.', 'A Ida ri e faz uma reverência. «Danke! Danke schön!» O Jonas te dá um joinha tão entusiasmado que vira uma dança curta.') },
          { icon: 'water', t: T('Offer them your water', 'Ofrecerles tu agua', 'Oferecer sua água'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, flag: 'tourists_helped' }, next: null, react: T('They pass the bottle between them with a sort of solemn delight. Jonas produces a bar of chocolate from his jacket: "Bitte." It is the best chocolate you have ever had.', 'Se pasan la botella con una especie de alegría solemne. Jonas saca una barra de chocolate de su chaqueta: «Bitte». Es el mejor chocolate que probaste.', 'Eles passam a garrafa entre si com uma espécie de alegria solene. O Jonas tira uma barra de chocolate da jaqueta: «Bitte». É o melhor chocolate que você já provou.') },
          { icon: 'phone', t: T('Pull out your phone to translate', 'Sacar el celular para traducir', 'Pegar o celular pra traduzir'), do: { fun: 4, soc: -1 }, next: null, react: T('The translation app tells them, confidently, "Where is the blue cheese." Ida\'s laugh is a bird. Jonas wipes his eyes. You are now friends.', 'La app de traducción les dice, con total seguridad, «¿Dónde está el queso azul?» La risa de Ida es un pájaro. Jonas se seca los ojos. Ahora son amigos.', 'O app de tradução diz pra eles, com toda a confiança, «Onde está o queijo azul». A risada da Ida é um pássaro. O Jonas seca os olhos. Vocês agora são amigos.') },
          { icon: 'wave', t: T('Just wave and smile', 'Solo saludar y sonreír', 'Só acenar e sorrir'), do: { soc: 2 }, next: null }
        ]
      }
    }
  };

  D.pili = {
    who: 'pili', role: T('JAW IN MOTION', 'MANDÍBULA EN MARCHA', 'MANDÍBULA EM MOVIMENTO'), start: 'a', nodes: {
      a: {
        text: T('"—and then I said, no, I don\'t think you understand what the word \'compromise\' means, and she said \'I do,\' and I said \'you don\'t,\' and she said \'I do\'—" Pili has not breathed since you walked up. Her jaw is a washing machine. She is lovely, and she is on her fourth minute of an ex.', '«—y entonces yo dije, no, creo que no entiendes qué significa “compromiso”, y ella dijo “sí lo entiendo”, y yo dije “no lo entiendes”, y ella dijo “sí lo entiendo”—» Pili no respiró desde que te acercaste. Su mandíbula es una lavadora. Es encantadora, y lleva cuatro minutos hablando de una ex.', '«—e aí eu disse, não, acho que você não entende o que a palavra “compromisso” significa, e ela disse “eu entendo”, e eu disse “você não entende”, e ela disse “eu entendo”—» A Pili não respira desde que você chegou. A mandíbula dela é uma máquina de lavar. Ela é adorável, e tá no quarto minuto de uma ex.'),
        choices: [
          { tone: 'chill', t: T('Listen to the whole story. All of it.', 'Escuchar toda la historia. Toda.', 'Ouvir a história toda. Toda.'), do: { soc: -4, fun: 2, time: 10, flag: 'pili_listened' }, next: null, react: T('She reaches the ending, which is that she\'s fine, actually. She hugs you with her whole body. "Thank you. Nobody listens to the end."', 'Llega al final, que es que está bien, en realidad. Te abraza con todo el cuerpo. «Gracias. Nadie escucha hasta el final».', 'Ela chega ao final, que é que ela tá bem, na verdade. Te abraça com o corpo todo. «Obrigada. Ninguém escuta até o fim».') },
          { tone: 'care', t: T('Offer her a stick of gum.', 'Ofrecerle un chicle.', 'Oferecer um chiclete.'), do: { soc: 1, fun: 3, flag: 'pili_gum' }, next: null, react: T('She takes it, chews, and in the three seconds of silence her entire face visibly relaxes. "Oh my GOD. That was — I was so — thank you."', 'Lo toma, mastica, y en los tres segundos de silencio toda su cara se relaja visiblemente. «Ay DIOS. Eso era — yo estaba tan — gracias».', 'Ela pega, mastiga, e nos três segundos de silêncio o rosto inteiro dela relaxa visivelmente. «Ai MEU DEUS. Isso era — eu tava tão — obrigada».') },
          { tone: 'blunt', t: T('"Sorry, I have to go."', '«Perdón, tengo que irme».', '«Desculpa, preciso ir».'), do: { soc: -1 }, next: null }
        ]
      }
    }
  };

  D.dante = {
    who: 'dante', role: T('SMOKING PHILOSOPHER', 'FILÓSOFO DE LA ZONA DE FUMAR', 'FILÓSOFO DA ÁREA DE FUMANTES'), start: 'a', nodes: {
      a: {
        text: T('"Sit," says the man by the barrel. "The night is long. You are standing like someone with somewhere to be. Nobody has anywhere to be. That is the whole beauty."', '«Siéntate», dice el hombre junto al barril. «La noche es larga. Te quedas ahí con cara de tener un lugar adonde ir. Nadie tiene ningún lugar adonde ir. Esa es toda la belleza».', '«Senta», diz o homem do lado do barril. «A noite é longa. Você fica aí com cara de quem tem pra onde ir. Ninguém tem pra onde ir. Essa é a beleza toda».'),
        choices: [
          { tone: 'chill', t: T('Sit with him and listen.', 'Sentarte con él y escuchar.', 'Sentar com ele e escutar.'), do: { soc: 8, time: 10, flag: 'dante_talked' }, next: 'b' },
          { tone: 'ask', t: T('"What\'s the best advice for tonight?"', '«¿Cuál es el mejor consejo para esta noche?»', '«Qual é o melhor conselho pra hoje?»'), next: 'adv' },
          { tone: 'silent', t: T('Nod and keep moving.', 'Asentir y seguir.', 'Assentir e seguir.'), free: true, next: null }
        ]
      },
      b: {
        text: T('"This building was a factory. The crack in the wall opened in 2003. The owners kept meaning to fix it. Then somebody put a light behind it, and now it\'s a sign. Everything useful starts as damage somebody didn\'t fix."', '«Este edificio era una fábrica. La grieta de la pared se abrió en 2003. Los dueños siempre iban a arreglarla. Entonces alguien puso una luz detrás y ahora es un cartel. Todo lo útil empieza como un daño que alguien no arregló».', '«Este prédio era uma fábrica. A rachadura na parede abriu em 2003. Os donos viviam querendo consertar. Aí alguém botou uma luz atrás e agora é um letreiro. Tudo que é útil começa como um dano que alguém não consertou».'),
        do: { fun: 2 }
      },
      adv: {
        text: T('"Be a person people are glad to see at six in the morning. Everything before that is rehearsal."', '«Sé alguien a quien la gente se alegre de ver a las seis de la mañana. Todo lo anterior es ensayo».', '«Seja alguém que as pessoas fiquem felizes de ver às seis da manhã. Tudo antes disso é ensaio».'),
        do: { flag: 'dante_advice', soc: 3 }
      }
    }
  };

  D.sol = {
    who: 'sol', role: T('SOMEONE LOOKING AT THE SKY', 'ALGUIEN MIRANDO EL CIELO', 'ALGUÉM OLHANDO O CÉU'), start: 'a', nodes: {
      a: {
        text: T('"Hi. You look like someone looking for a place to stand." Sol has one foot on a low wall and her hair tied up with what might be a shoelace. She is looking at you like you are a very interesting sentence.', '«Hola. Te ves como alguien que busca un lugar donde pararse». Sol tiene un pie sobre un muro bajo y el pelo atado con lo que podría ser un cordón de zapato. Te mira como si fueras una frase muy interesante.', '«Oi. Você parece alguém procurando um lugar pra ficar». A Sol tem um pé num muro baixo e o cabelo preso com o que pode ser um cadarço. Ela te olha como se você fosse uma frase muito interessante.'),
        do: { flag: 'sol_met' },
        choices: [
          { tone: 'flirt', t: T('"I was hoping to stand next to you, actually."', '«Esperaba pararme junto a ti, en realidad».', '«Eu esperava ficar do seu lado, na verdade».'), next: 'b' },
          { tone: 'chill', t: T('"A quiet spot. Yeah."', '«Un lugar tranquilo. Sí».', '«Um lugar quieto. É».'), do: { soc: 4 }, next: 'b2' },
          { tone: 'blunt', t: T('"I\'m not looking for anything tonight."', '«Esta noche no busco nada».', '«Hoje eu não tô procurando nada».'), do: { soc: 2 }, next: null, react: T('"Good. Neither am I." She smiles anyway. "That wasn\'t a no to existing near each other, was it?"', '«Bien. Yo tampoco». Sonríe igual. «Eso no era un no a existir cerca, ¿verdad?»', '«Ótimo. Eu também não». Ela sorri mesmo assim. «Isso não era um não a existir perto, era?»') }
        ]
      },
      b: {
        text: T('She laughs, a short bright sound, and does not look away. "Okay. Question first: do you want to talk, dance, or just stand quietly? All three work."', 'Se ríe, un sonido corto y brillante, y no aparta la vista. «Bueno. Primero una pregunta: ¿quieres hablar, bailar, o solo estar callado? Los tres sirven».', 'Ela ri, um som curto e brilhante, e não desvia o olhar. «Tá. Primeiro uma pergunta: você quer conversar, dançar ou só ficar em silêncio? Os três servem».'),
        choices: [
          { tone: 'chill', t: T('Talk.', 'Hablar.', 'Conversar.'), do: { soc: 8, fun: 4, time: 20, flag: 'sol_talked' }, next: null, react: T('You talk for twenty minutes about nothing, then everything: the building, the crack, a cousin\'s wedding, a thing that happened on a bus. She is so easy to talk to that you forget to feel tired. "Come find me," she says. "Before sunrise. I want to know how your night ends."', 'Hablan veinte minutos de nada, luego de todo: el edificio, la grieta, la boda de una prima, algo que pasó en un autobús. Es tan fácil hablar con ella que te olvidas de sentirte cansado. «Búscame», dice. «Antes del amanecer. Quiero saber cómo termina tu noche».', 'Vocês conversam vinte minutos sobre nada, depois sobre tudo: o prédio, a rachadura, o casamento de uma prima, algo que aconteceu num ônibus. É tão fácil falar com ela que você esquece de sentir cansaço. «Me procura», ela diz. «Antes do amanhecer. Quero saber como sua noite termina».') },
          { tone: 'dance', t: T('Dance (just here, by the barrel).', 'Bailar (aquí mismo, junto al barril).', 'Dançar (aqui mesmo, ao lado do barril).'), do: { fun: 10, soc: 3, time: 12, flag: 'sol_danced' }, next: null, react: T('There is no music in the smoking area. There is the distant bass through the wall. She sets the tempo with her shoulders. For twelve minutes you dance to a ghost of a song.', 'No hay música en la zona de fumar. Está el bajo lejano a través de la pared. Ella marca el tempo con los hombros. Durante doce minutos bailan al fantasma de una canción.', 'Não tem música na área de fumantes. Tem o grave distante atravessando a parede. Ela marca o ritmo com os ombros. Por doze minutos vocês dançam o fantasma de uma música.') },
          { tone: 'silent', t: T('Stand quietly.', 'Estar callado.', 'Ficar em silêncio.'), do: { soc: 12, hp: 2, time: 10, flag: 'sol_quiet' }, next: null, react: T('She stands next to you, shoulder an inch away. Neither of you says anything for ten minutes. They are the most restful ten minutes of your night.', 'Se queda a tu lado, el hombro a un centímetro. Ninguno dice nada durante diez minutos. Son los diez minutos más descansados de tu noche.', 'Ela fica do seu lado, o ombro a um centímetro. Nenhum dos dois diz nada por dez minutos. São os dez minutos mais descansados da sua noite.') }
        ]
      },
      b2: {
        text: T('"Here." She sits on the low wall and pats the stone. "This is the quiet spot. I found it three hours ago. I\'m very proud of it."', '«Aquí». Se sienta en el muro bajo y palmea la piedra. «Este es el lugar tranquilo. Lo encontré hace tres horas. Estoy muy orgullosa».', '«Aqui». Ela senta no muro baixo e bate na pedra. «Esse é o lugar quieto. Descobri faz três horas. Tô muito orgulhosa».'),
        do: { soc: 6, time: 10, flag: 'sol_quiet' }
      }
    }
  };
  D.sol_again = {
    who: 'sol', role: T('SOMEONE LOOKING AT THE SKY', 'ALGUIEN MIRANDO EL CIELO', 'ALGUÉM OLHANDO O CÉU'), start: 'a', nodes: {
      a: {
        branch: [
          { req: function (s) { return s.time >= 380 && (s.flags.sol_talked || s.flags.sol_danced || s.flags.sol_quiet); }, to: 'date' },
          { req: function () { return true; }, to: 'hi' }
        ]
      },
      hi: {
        text: T('"Hey again." Sol smiles into her collar. "Still here. Still looking at the sky. It hasn\'t done anything yet."', '«Hola otra vez». Sol sonríe hacia su cuello. «Sigo aquí. Sigo mirando el cielo. Todavía no hizo nada».', '«Oi de novo». A Sol sorri pro colarinho. «Ainda tô aqui. Ainda olhando o céu. Ainda não fez nada».'),
        do: { soc: 2 }
      },
      date: {
        text: T('"It\'s getting light at the edge." She points. A thin grey line over the fence. "Come to the roof for the closing set. If you want to. I\'d like to see you there. No pressure, and if you\'re with your people, bring them."', '«Está clareando en el borde». Señala. Una línea gris fina sobre la cerca. «Ven al techo para el set de cierre. Si quieres. Me gustaría verte ahí. Sin presión, y si estás con tu gente, tráelos».', '«Tá clareando na beirada». Ela aponta. Uma linha cinza fina sobre a cerca. «Vem pro terraço pro set de encerramento. Se quiser. Eu gostaria de te ver lá. Sem pressão, e se você tá com sua galera, traz eles».'),
        do: { flag: 'sol_date', soc: 4, fun: 3 }
      }
    }
  };

  D.ofelia = {
    who: 'ofelia', role: T('SECURITY', 'SEGURIDAD', 'SEGURANÇA'), start: 'a', nodes: {
      a: {
        branch: [
          { req: { min: { weird: 60 } }, to: 'warn' },
          { req: function () { return true; }, to: 'normal' }
        ]
      },
      normal: {
        text: T('"I\'m just walking," says Ofelia, who has been standing in the same spot for forty minutes. "I walk a lot. It\'s a long job."', '«Solo estoy caminando», dice Ofelia, que lleva cuarenta minutos parada en el mismo lugar. «Camino mucho. Es un trabajo largo».', '«Só tô andando», diz a Ofelia, que tá parada no mesmo lugar há quarenta minutos. «Ando muito. É um trabalho longo».'),
        choices: [
          { tone: 'ask', t: T('"Any advice for the rest of the night?"', '«¿Algún consejo para el resto de la noche?»', '«Algum conselho pro resto da noite?»'), do: { soc: 1, flag: 'ofelia_advice' }, next: null, react: T('"Don\'t film. Don\'t push. Say sorry fast. And if you start thinking \'maybe I\'ll just\'… don\'t."', '«No filmes. No empujes. Pide perdón rápido. Y si empiezas a pensar “capaz que yo solo”… no».', '«Não filme. Não empurre. Peça desculpa rápido. E se começar a pensar “talvez eu só”… não».') },
          { tone: 'chill', t: T('"Thanks for what you do."', '«Gracias por lo que haces».', '«{Obrigado|Obrigada|Valeu} pelo que você faz».'), do: { soc: 3 }, next: null }
        ]
      },
      warn: {
        text: T('Ofelia\'s eyes find you, then your hands, then the way you are standing. "I\'m going to say this once and kindly. You\'re running warm. Sit down for a while. Drink some water. Nobody here wants you gone. But everybody\'s counting."', 'Los ojos de Ofelia te encuentran, luego tus manos, luego cómo estás parado. «Voy a decir esto una vez y con cariño. Estás pasado de temperatura. Siéntate un rato. Toma agua. Nadie aquí quiere que te vayas. Pero todos están contando».', 'Os olhos da Ofelia te acham, depois suas mãos, depois como você tá parado. «Vou falar isso uma vez e com carinho. Você tá esquentando demais. Senta um tempo. Beba água. Ninguém aqui quer que você vá embora. Mas todo mundo tá contando».'),
        choices: [
          { tone: 'honest', t: T('"Thank you. I\'ll slow down."', '«Gracias. Voy a bajar el ritmo».', '«{Obrigado|Obrigada|Valeu}. Vou desacelerar».'), do: { weird: -8, soc: 1 }, next: null },
          { tone: 'blunt', t: T('"I\'m fine. Mind your business."', '«Estoy bien. Métete en lo tuyo».', '«Tô bem. Cuida da sua vida».'), do: { weird: 8, soc: -4 }, next: null, bad: true }
        ]
      }
    }
  };

  D.mateo = {
    who: 'mateo', role: T('AN EX', 'UN EX', 'UM EX'), start: 'a', nodes: {
      a: {
        text: T('"I only wanted to say hi. I\'m not here to ruin anything." Mateo\'s hands are visible, open, and slightly too still. "Is he okay? Is Tato okay?"', '«Solo quería saludar. No vine a arruinar nada». Las manos de Mateo se ven, abiertas y un poco demasiado quietas. «¿Está bien? ¿Tato está bien?»', '«Só queria dar um oi. Não vim estragar nada». As mãos do Mateo estão à vista, abertas e um pouco paradas demais. «Ele tá bem? O Tato tá bem?»'),
        choices: [
          { tone: 'honest', t: T('"Ask him. Let him decide how much to give you."', '«Pregúntale a él. Que decida cuánto darte».', '«Pergunta pra ele. Deixa ele decidir quanto te dar».'), do: { soc: -1 }, next: null },
          { tone: 'blunt', t: T('"Leave him alone."', '«Déjalo en paz».', '«Deixa ele em paz».'), do: { weird: 4, soc: -3 }, next: null, bad: true }
        ]
      }
    }
  };
})();

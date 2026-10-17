/* EXCUSE ME — story part A: framework, quests, the street, the foyer, the main floor (Chapter 1-2). */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine;
  const D = EM.DIALOGUES = EM.DIALOGUES || {};
  const S = EM.scripts;
  const story = EM.story = {};

  /* ------------------------------------------------------------ quests */
  EM.QUESTS = {
    q1: { title: T('FIND YOUR PEOPLE', 'ENCUENTRA A TU GENTE', 'ENCONTRE SUA GALERA'), desc: T('Maru, Dani and Tato are somewhere on the main floor. Last message: "the pillar by the left speaker."', 'Maru, Dani y Tato están en algún lugar de la pista principal. Último mensaje: «el pilar al lado del parlante izquierdo».', 'Maru, Dani e Tato estão em algum lugar da pista principal. Última mensagem: «o pilar ao lado da caixa de som esquerda».'), doneText: T('Found them. They had started a search party.', 'Los encontraste. Habían armado una búsqueda.', 'Achou eles. Já tinham montado uma busca.') },
    q2: { title: T('MARU HAS TO PEE', 'MARU TIENE QUE IR AL BAÑO', 'A MARU PRECISA IR AO BANHEIRO'), desc: T('It is an emergency with a face. Take all three to the toilets. Keep them together.', 'Es una emergencia con cara. Lleva a los tres a los baños. Que no se separen.', 'É uma emergência com cara. Leve os três ao banheiro. Não deixe se separarem.'), doneText: T('You made it to the toilets with everyone.', 'Llegaste a los baños con todos.', 'Chegou ao banheiro com todo mundo.') },
    q3: { title: T('ONE STALL, THREE PEOPLE', 'UNA CABINA, TRES PERSONAS', 'UMA CABINE, TRÊS PESSOAS'), desc: T('The host enforces one person per stall. Make your case. Or split up and hope.', 'El encargado exige una persona por cabina. Defiende tu caso. O sepárense y recen.', 'O responsável exige uma pessoa por cabine. Defenda seu caso. Ou se separem e rezem.'), doneText: T('The stall happened. Nobody is talking about it yet.', 'Pasó lo de la cabina. Nadie habla de eso todavía.', 'A cabine aconteceu. Ninguém fala disso ainda.') },
    q4: { title: T('EXPLAIN YOURSELVES', 'DENLE UNA EXPLICACIÓN', 'EXPLIQUEM-SE'), desc: T('Rosa, the cleaning lady, has noticed three people leaving one stall. Talk to her.', 'Rosa, la señora de la limpieza, vio salir a tres personas de una cabina. Habla con ella.', 'A Rosa, a faxineira, viu três pessoas saindo de uma cabine. Fale com ela.'), doneText: T('Rosa knows your name. That is either very good or very bad.', 'Rosa sabe tu nombre. Eso es muy bueno o muy malo.', 'A Rosa sabe seu nome. Isso é muito bom ou muito ruim.') },
    q5: { title: T('THE PILL', 'LA PASTILLA', 'O COMPRIMIDO'), desc: T('Dani has a pill and a plan. The QUIET ROOM has a checking table. Get it tested before anybody decides anything.', 'Dani tiene una pastilla y un plan. La SALA TRANQUILA tiene una mesa de chequeo. Que la analicen antes de que nadie decida nada.', 'O Dani tem um comprimido e um plano. A SALA DE CALMA tem uma mesa de checagem. Mande testar antes de qualquer decisão.'), doneText: T('You checked. What you did next was yours.', 'Chequearon. Lo que hiciste después fue tuyo.', 'Vocês checaram. O que fez depois foi seu.') },
    q7: { title: T('THE DROP', 'EL DROP', 'O DROP'), desc: T('Take the group to the centre of the main floor for the peak. Find the glowing centre mark.', 'Lleva al grupo al centro de la pista principal para el pico. Busca la marca brillante del centro.', 'Leve o grupo ao centro da pista principal para o pico. Procure a marca brilhante do centro.'), doneText: T('The drop happened. You were there.', 'Pasó el drop. Estabas ahí.', 'O drop aconteceu. Você estava lá.') },
    q8: { title: T('NOBODY LEFT BEHIND', 'NADIE SE QUEDA ATRÁS', 'NINGUÉM FICA PARA TRÁS'), desc: T('The group scattered after the drop. Find Dani and Tato.', 'El grupo se dispersó después del drop. Encuentra a Dani y a Tato.', 'O grupo se espalhou depois do drop. Encontre o Dani e o Tato.'), doneText: T('Everyone found, or at least accounted for.', 'Todos encontrados, o al menos contabilizados.', 'Todo mundo achado, ou pelo menos contabilizado.') },
    q9: { title: T('THE CLOSING SET', 'EL SET DE CIERRE', 'O SET DE ENCERRAMENTO'), desc: T('The roof opens for the closing set. Get your people up there before sunrise.', 'El techo abre para el set de cierre. Sube con tu gente antes del amanecer.', 'O terraço abre para o set de encerramento. Suba com sua galera antes do amanhecer.') }
  };

  /* ------------------------------------------------------------ framework */
  story.init = function (s) {
    s.quests.q1 = 'active';
    s.away = { maru: 'main', dani: 'main', tato: 'main' };
    s.party = [];
    s.items.water = 1;
  };

  story.objective = function (s) {
    const q = s.quests;
    if (q.q9 === 'active') return T('Get to the roof with everyone you can. Sunrise is coming.', 'Sube al techo con todos los que puedas. Viene el amanecer.', 'Suba ao terraço com quem puder. O amanhecer vem aí.');
    if (q.q8 === 'active') {
      const lost = ['dani', 'tato'].filter(function (f) { return s.away[f]; });
      if (lost.length === 2) return T('Find Dani and Tato. They went different ways.', 'Encuentra a Dani y a Tato. Se fueron por caminos distintos.', 'Encontre o Dani e o Tato. Foram por caminhos diferentes.');
      if (lost[0] === 'dani') return T('Find Dani. Last seen: ' + EM.tr(EM.zones[s.away.dani].name).toLowerCase() + '.', 'Encuentra a Dani. Visto por última vez: ' + EM.tr(EM.zones[s.away.dani].name).toLowerCase() + '.', 'Encontre o Dani. Visto por último: ' + EM.tr(EM.zones[s.away.dani].name).toLowerCase() + '.');
      if (lost[0] === 'tato') return T('Find Tato. Last seen: ' + EM.tr(EM.zones[s.away.tato].name).toLowerCase() + '.', 'Encuentra a Tato. Visto por última vez: ' + EM.tr(EM.zones[s.away.tato].name).toLowerCase() + '.', 'Encontre o Tato. Visto por último: ' + EM.tr(EM.zones[s.away.tato].name).toLowerCase() + '.');
    }
    if (q.q7 === 'active') return T('Take the group to the glowing centre of the main floor.', 'Lleva al grupo al centro brillante de la pista principal.', 'Leve o grupo ao centro brilhante da pista principal.');
    if (q.q5 === 'active') return s.pill.tested ? T('Decide what to do with the pill. Then find the dance floor.', 'Decide qué hacer con la pastilla. Luego busca la pista.', 'Decida o que fazer com o comprimido. Depois procure a pista.') : T('Get Dani\'s pill checked at the QUIET ROOM (the door left of the foyer).', 'Que revisen la pastilla de Dani en la SALA TRANQUILA (la puerta a la izquierda del foyer).', 'Mande checar o comprimido do Dani na SALA DE CALMA (a porta à esquerda do foyer).');
    if (q.q4 === 'active') return T('Rosa is waiting by the sinks. Talk to her.', 'Rosa te espera junto a los lavamanos. Habla con ella.', 'A Rosa espera perto das pias. Fale com ela.');
    if (q.q3 === 'active') return T('Talk to the host at the stalls. Make your case.', 'Habla con el encargado de las cabinas. Defiende tu caso.', 'Fale com o responsável pelas cabines. Defenda seu caso.');
    if (q.q2 === 'active') return T('Take your people to the toilets (WC). Keep them together.', 'Lleva a tu gente a los baños (WC). Que no se separen.', 'Leve sua galera ao banheiro (WC). Não deixe separar.');
    if (q.q1 === 'active') {
      if (s.zone === 'doors') return T('Get past the door. Your people are inside.', 'Pasa la puerta. Tu gente está adentro.', 'Passe pela porta. Sua galera está lá dentro.');
      return T('Reach the pillar by the left speaker, on the main floor.', 'Llega al pilar junto al parlante izquierdo, en la pista principal.', 'Chegue ao pilar ao lado da caixa de som esquerda, na pista principal.');
    }
    return T('Dance. Look after your people. Don\'t get thrown out.', 'Baila. Cuida a tu gente. Que no te echen.', 'Dance. Cuide da sua galera. Não seja expulso.');
  };

  story.enter = function (zone) {
    const s = EM.state;
    if (S['enter_' + zone]) S['enter_' + zone]();
  };

  /* helper for scripts: run a forced dialogue then a callback */
  function say(id, cb, npc) { U.startDialogue(id, { onEnd: cb, npc: npc }); }
  story.say = say;

  /* ------------------------------------------------------------ INTRO */
  D.intro = {
    forced: true, start: 'a', nodes: {
      a: {
        text: [
          T('LA GRIETA. 23:00. A line of people under a neon crack in the wall, and you are an hour late. The group chat is a graveyard of "where r u".', 'LA GRIETA. 23:00. Una fila de gente bajo una grieta de neón en la pared, y llegas una hora tarde. El chat del grupo es un cementerio de «dónde estás».', 'LA GRIETA. 23:00. Uma fila de gente sob uma rachadura de neon na parede, e já se passou uma hora do combinado. O grupo no chat é um cemitério de «cadê você».'),
          T('Maru, Dani and Tato are in there somewhere. Your phone is at 9%. You have one bottle of water and a very good feeling about tonight.', 'Maru, Dani y Tato están ahí adentro en algún lugar. Tu teléfono está al 9%. Tienes una botella de agua y un muy buen presentimiento sobre esta noche.', 'Maru, Dani e Tato estão lá dentro em algum lugar. Seu celular está com 9%. Você tem uma garrafa de água e um bom pressentimento sobre esta noite.'),
          T('Four bars matter: FUN, SOCIAL BATTERY, HEALTH, and WEIRDNESS. Let that last one fill up and security walks you out. In a crowd, press Z to say EXCUSE ME. It is cheap. It is also a whole philosophy.', 'Cuatro barras importan: DIVERSIÓN, BATERÍA SOCIAL, SALUD y RAREZA. Si esa última se llena, seguridad te saca. En una multitud, presiona Z para decir CON PERMISO. Es barato. También es una filosofía entera.', 'Quatro barras importam: DIVERSÃO, BATERIA SOCIAL, SAÚDE e ESTRANHEZA. Se a última encher, a segurança te acompanha até a rua. Na multidão, aperte Z para dizer COM LICENÇA. É barato. Também é uma filosofia inteira.')
        ]
      }
    }
  };
  S.intro = function () { U.startDialogue('intro', {}); };

  /* ------------------------------------------------------------ THE DOOR */
  D.dragan = {
    who: 'dragan', role: T('DOOR', 'PUERTA', 'PORTA'), start: 'a', nodes: {
      a: {
        text: T('"Name?"', '«¿Nombre?»', '«Nome?»'),
        choices: [
          { tone: 'chill', t: T('"{name}."', '«{name}».', '«{name}».'), next: 'b' },
          { tone: 'smooth', t: T('"{name}. Friends of Maru, on the list."', '«{name}. Amigos de Maru, en la lista».', '«{name}. Amigos da Maru, na lista».'), next: 'b', do: { soc: 1 } }
        ]
      },
      b: {
        text: T('He finds you on a clipboard that is clearly decorative. "Camera sticker. Nobody films inside. Phone stays in your pocket on the floor, or it stays with me. Understood?"', 'Te encuentra en una carpeta claramente decorativa. «Pegatina en la cámara. Aquí adentro nadie filma. En la pista el celular va en el bolsillo o se queda conmigo. ¿Entendido?»', 'Ele te encontra numa prancheta claramente decorativa. «Adesivo na câmera. Ninguém filma aqui dentro. Na pista o celular fica no bolso ou fica comigo. Entendido?»'),
        do: { flag: 'sticker' },
        choices: [
          { tone: 'chill', t: T('"Understood. Respect."', '«Entendido. Respeto».', '«Entendido. Respeito».'), next: 'c' },
          { tone: 'blunt', t: T('"Is the sticker really necessary?"', '«¿De verdad hace falta la pegatina?»', '«O adesivo é mesmo necessário?»'), next: 'c', react: T('"Everybody asks once. Nobody asks twice."', '«Todos preguntan una vez. Nadie pregunta dos».', '«Todo mundo pergunta uma vez. Ninguém pergunta duas».'), do: { soc: -1 } },
          { tone: 'joke', t: T('"My phone has 9%. It couldn\'t film a sandwich."', '«Mi teléfono tiene 9%. No podría filmar ni un sándwich».', '«Meu celular tem 9%. Não filmaria nem um sanduíche».'), next: 'c', react: T('"Nine is a good number." He peels the sticker for you himself.', '«Nueve es un buen número». Él mismo te pega la pegatina.', '«Nove é um bom número». Ele mesmo cola o adesivo pra você.'), do: { fun: 2 } }
        ]
      },
      c: {
        text: T('"Last one. Anything in you tonight? I do not need a lecture. I need a number so I know how to look at you."', '«Última. ¿Algo en tu cuerpo esta noche? No quiero un sermón. Quiero un número para saber cómo mirarte».', '«Última. Alguma coisa no seu corpo hoje? Não quero sermão. Quero um número pra saber como te olhar».'),
        choices: [
          { tone: 'honest', t: T('"Nothing. Water and good intentions."', '«Nada. Agua y buenas intenciones».', '«Nada. Água e boas intenções».'), next: 'd' },
          { tone: 'honest', t: T('"Two drinks before I got here."', '«Dos tragos antes de llegar».', '«Duas doses antes de chegar».'), next: 'd', do: { drink: 1 } },
          { tone: 'honest', t: T('"A few. I am fine, though. Mostly fine."', '«Algunos. Estoy bien, igual. Más o menos bien».', '«Algumas. Estou bem, mesmo assim. Mais ou menos bem».'), next: 'd', do: { drink: 3, fun: 6 }, react: T('He looks you over for one slow second. "Fine means walking in a straight line. Straight."', 'Te mira un segundo lento. «Bien significa caminar en línea recta. Recta».', 'Ele te olha por um segundo lento. «Bem significa andar em linha reta. Reta».') }
        ]
      },
      d: {
        text: T('He steps aside. "Go on. Nobody in there owes you a good night, and you do not owe them one either. Look after your people."', 'Se hace a un lado. «Pasa. Nadie ahí adentro te debe una buena noche, y tú tampoco se la debes a nadie. Cuida a tu gente».', 'Ele sai da frente. «Entra. Ninguém lá dentro te deve uma boa noite, e você também não deve uma a ninguém. Cuide da sua galera».'),
        do: { open: 'dragan', flag: 'bouncer_ok', at: 70 }
      }
    }
  };

  D.kiki = {
    who: 'kiki', role: T('IN LINE', 'EN LA FILA', 'NA FILA'), start: 'a', nodes: {
      a: {
        text: T('"BABE. You look like you need a shot. It\'s strawberry. It\'s basically a smoothie." She is holding a thermos like a newborn.', '«{AMIGO|AMIGA|BEBÉ}. Tienes cara de necesitar un shot. Es de fresa. Es básicamente un licuado». Sostiene un termo como a un recién nacido.', '«{AMIGO|AMIGA|BEBÊ}. Você tá com cara de quem precisa de um shot. É de morango. É basicamente um smoothie». Ela segura uma garrafa térmica como um recém-nascido.'),
        choices: [
          { tone: 'chill', t: T('One shot. Cheers.', 'Un shot. Salud.', 'Um shot. Saúde.'), do: { drink: 1, fun: 3, flag: 'kiki_shot' }, next: null, react: T('It is not a smoothie. It is also not not a smoothie. She screams "SAFE NIGHT" at you like a blessing.', 'No es un licuado. Tampoco es no un licuado. Te grita «NOCHE SEGURA» como una bendición.', 'Não é um smoothie. Também não é não um smoothie. Ela grita «NOITE SEGURA» pra você como uma bênção.') },
          { tone: 'care', t: T('"Have you had water? You have been out here a while."', '«¿Tomaste agua? Llevas rato aquí afuera».', '«Você bebeu água? Já tá aqui fora faz tempo».'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, flag: 'kiki_friend' }, next: null, react: T('She drinks half the bottle in one breath and looks at you like you handed her a diploma. "Nobody ever asks me that. You are my favourite person in this queue."', 'Se toma media botella de un trago y te mira como si le hubieras dado un diploma. «Nadie me pregunta eso. Eres mi persona favorita de esta fila».', 'Ela bebe metade da garrafa de um gole e te olha como se você tivesse dado um diploma. «Ninguém nunca me pergunta isso. Você é minha pessoa favorita dessa fila».') },
          { tone: 'chill', t: T('"I\'m good, but I love your energy."', '«Estoy bien, pero amo tu energía».', '«Tô bem, mas amo sua energia».'), do: { soc: 2 }, next: null },
          { tone: 'blunt', t: T('"No. And that thermos is going to get you thrown out before midnight."', '«No. Y ese termo te va a hacer echar antes de medianoche».', '«Não. E essa térmica vai te fazer ser expulsa antes da meia-noite».'), do: { soc: -2, weird: 1 }, next: null, bad: true }
        ]
      }
    }
  };

  D.bruno = {
    who: 'bruno', role: T('IN LINE', 'EN LA FILA', 'NA FILA'), start: 'a', nodes: {
      a: {
        text: T('"First time here. Is it… loud? Is there, like, etiquette? I read a thread but the thread was just people yelling."', '«Primera vez aquí. ¿Es… fuerte? ¿Hay, no sé, etiqueta? Leí un hilo pero era solo gente gritando».', '«Primeira vez aqui. É… alto? Tem tipo uma etiqueta? Li um tópico mas era só gente gritando».'),
        choices: [
          { tone: 'honest', t: T('"Loud. Ask before you touch anyone. Drink water. Find your friends first."', '«Fuerte. Pregunta antes de tocar a alguien. Toma agua. Encuentra primero a tus amigos».', '«Alto. Pergunte antes de tocar em alguém. Beba água. Encontre seus amigos primeiro».'), do: { care: 1, flag: 'bruno_advised' }, next: null, react: T('"Ask before touching. Okay. Okay." He writes it in his notes app like scripture.', '«Preguntar antes de tocar. Ok. Ok». Lo anota en el celular como si fuera una escritura sagrada.', '«Perguntar antes de tocar. Ok. Ok». Ele anota no celular como se fosse escritura sagrada.') },
          { tone: 'chill', t: T('"Follow the bass and say \'excuse me\' like you mean it."', '«Sigue el bajo y di “con permiso” en serio».', '«Siga o grave e diga “com licença” pra valer».'), do: { soc: 2, flag: 'bruno_ok' }, next: null },
          { tone: 'joke', t: T('"Etiquette? They eat first-timers. Run."', '«¿Etiqueta? Se comen a los novatos. Corre».', '«Etiqueta? Eles comem os novatos. Corre».'), do: { fun: 2, weird: 1, flag: 'bruno_scared' }, next: null, react: T('He laughs a beat too late. Then he looks at the door like it is a cliff.', 'Se ríe un segundo tarde. Luego mira la puerta como si fuera un precipicio.', 'Ele ri um segundo atrasado. Depois olha pra porta como se fosse um precipício.') }
        ]
      }
    }
  };

  D.argue_couple = {
    who: 'ana', role: T('IN LINE', 'EN LA FILA', 'NA FILA'), start: 'a', nodes: {
      a: {
        text: T('ANA: "I put you on the list FOUR times." LEO: "You put me as \'Leon\'. My name is Leo. LEO." ANA: "It\'s the same name!" LEO: "It is not the same name!"', 'ANA: «Te puse en la lista CUATRO veces». LEO: «Me pusiste como “León”. Me llamo Leo. LEO». ANA: «¡Es el mismo nombre!» LEO: «¡No es el mismo nombre!»', 'ANA: «Te botei na lista QUATRO vezes». LEO: «Você me botou como “Leão”. Meu nome é Leo. LEO». ANA: «É o mesmo nome!» LEO: «Não é o mesmo nome!»'),
        choices: [
          { tone: 'chill', t: T('"Maybe check the list under both?"', '«¿Y si miran la lista con los dos?»', '«E se vocês olharem a lista com os dois?»'), do: { soc: 2, fun: 1 }, next: null, react: T('They check. Both names are there. They scream at each other with joy and then at you. You are the hero of the queue.', 'Revisan. Están los dos. Se gritan de alegría y luego te gritan a ti. Eres el héroe de la fila.', 'Eles conferem. Os dois nomes estão lá. Gritam de alegria um com o outro e depois com você. Você é o herói da fila.') },
          { tone: 'joke', t: T('"Can I join the argument? I have opinions."', '«¿Puedo unirme a la discusión? Tengo opiniones».', '«Posso entrar na discussão? Tenho opiniões».'), do: { fun: 3, soc: -1 }, next: null, react: T('You take Leo\'s side for ten seconds and Ana\'s side for ten more. Nobody wins. Everybody laughs.', 'Defiendes a Leo diez segundos y a Ana diez más. Nadie gana. Todos se ríen.', 'Você defende o Leo por dez segundos e a Ana por mais dez. Ninguém ganha. Todo mundo ri.') },
          { tone: 'blunt', t: T('"Whatever it is, you are both blocking the sidewalk."', '«Sea lo que sea, los dos están tapando la acera».', '«Seja o que for, vocês dois estão bloqueando a calçada».'), do: { soc: -2 }, next: null, bad: true }
        ]
      }
    }
  };

  /* ------------------------------------------------------------ THE FOYER */
  D.luca = {
    who: 'luca', role: T('COAT CHECK', 'GUARDARROPA', 'CHAPELARIA'), start: 'a', nodes: {
      a: {
        text: T('"Coat? Bag? Existential dread? One euro each. The dread is free."', '«¿Abrigo? ¿Mochila? ¿Angustia existencial? Un euro cada una. La angustia es gratis».', '«Casaco? Bolsa? Angústia existencial? Um euro cada. A angústia é de graça».'),
        choices: [
          { tone: 'ask', t: T('"What\'s the situation tonight?"', '«¿Cómo está la noche?»', '«Como tá a noite?»'), next: 'b' },
          { tone: 'ask', t: T('"Where\'s the quiet room?"', '«¿Dónde queda la sala tranquila?»', '«Onde fica a sala de calma?»'), next: 'c' },
          { tone: 'chill', t: T('"Just saying hi."', '«Solo saludaba».', '«Só dando oi».'), do: { soc: 2 }, next: null }
        ]
      },
      b: {
        text: T('"Toilets: a queue with its own weather. Sala 2 upstairs opens at one in the morning. The tunnel on the right goes to the smoking area. And if you ever need a door the public doesn\'t know about, find Rosa. Rosa has keys the building forgot it had."', '«Baños: una fila con clima propio. La Sala 2, arriba, abre a la una de la mañana. El túnel de la derecha va a la zona de fumar. Y si algún día necesitas una puerta que el público no conoce, busca a Rosa. Rosa tiene llaves que el edificio se olvidó que tenía».', '«Banheiros: uma fila com clima próprio. A Sala 2, lá em cima, abre à uma da manhã. O túnel da direita vai pra área de fumantes. E se um dia precisar de uma porta que o público não conhece, procure a Rosa. A Rosa tem chaves que o prédio esqueceu que tinha».'),
        do: { flag: 'luca_tips' }
      },
      c: {
        text: T('"Left door, there. Mattresses, water, and Isi — Isi runs the checking table. Free, no judgement, nobody takes names. People bring things to be looked at. It is not a guarantee, it is a conversation. Go, if you need to."', '«Puerta de la izquierda, ahí. Colchones, agua y Isi: Isi lleva la mesa de chequeo. Gratis, sin juicios, nadie anota nombres. La gente trae cosas para que las miren. No es una garantía, es una conversación. Ve, si lo necesitas».', '«Porta da esquerda, ali. Colchões, água e a Isi — a Isi toca a mesa de checagem. De graça, sem julgamento, ninguém anota nome. As pessoas trazem coisas pra serem olhadas. Não é garantia, é uma conversa. Vá, se precisar».'),
        do: { flag: 'quiet_known' }
      }
    }
  };

  D.fernet = {
    who: 'fernet', role: T('SELLER', 'VENDEDOR', 'VENDEDOR'), start: 'a', nodes: {
      a: {
        text: T('"Gum. Lighters. Phone chargers that do not charge. One honest conversation. Everything is real."', '«Chicles. Encendedores. Cargadores que no cargan. Una conversación honesta. Todo es de verdad».', '«Chiclete. Isqueiros. Carregadores que não carregam. Uma conversa honesta. Tudo é de verdade».'),
        do: { flag: 'fernet_left' },
        choices: [
          { tone: 'ask', t: T('"What do you actually sell?"', '«¿Qué vendes en realidad?»', '«O que você vende de verdade?»'), next: 'b' },
          { tone: 'water', t: T('"Just water."', '«Solo agua».', '«Só água».'), req: function (s) { return s.items.water < 3; }, do: { item: { water: 1 } }, next: null, react: T('"Take it. I am a businessman, not a monster."', '«Llévala. Soy un comerciante, no un monstruo».', '«Leva. Sou comerciante, não monstro».') },
          { tone: 'chill', t: T('"Just browsing."', '«Solo mirando».', '«Só olhando».'), next: null, free: true }
        ]
      },
      b: {
        text: T('He lowers his voice a little. "Small things that make the night go faster. Small, as in: be careful what you ask for. I never push. If you want a bump to get through the night, I have one, and you should know exactly what it is before it is in you."', 'Baja un poco la voz. «Cosas chicas que aceleran la noche. Chicas, en el sentido de: ten cuidado con lo que pides. Yo no empujo a nadie. Si quieres una línea para aguantar la noche, tengo una, y deberías saber exactamente qué es antes de que esté en tu cuerpo».', 'Ele baixa um pouco a voz. «Coisas pequenas que fazem a noite andar mais rápido. Pequenas no sentido de: cuidado com o que você pede. Eu nunca empurro. Se quiser um teco pra aguentar a noite, eu tenho, e você deveria saber exatamente o que é antes de estar no seu corpo».'),
        choices: [
          { tone: 'bold', t: T('"One bump. Just one."', '«Una línea. Solo una».', '«Um teco. Só um».'), do: { fx: 'bump', fun: 8, hp: -4, weird: 10, time: 4, flag: 'bought_bump' }, next: null, react: T('Quick, cold, bitter. Then the world is one step to the left of where you left it.', 'Rápido, frío, amargo. Luego el mundo está un paso a la izquierda de donde lo dejaste.', 'Rápido, frio, amargo. Depois o mundo fica um passo à esquerda de onde você deixou.') },
          { tone: 'no', t: T('"No, thanks. Good to know you\'re honest about it."', '«No, gracias. Es bueno saber que eres honesto con eso».', '«Não, {obrigado|obrigada|valeu}. Bom saber que você é honesto com isso».'), do: { soc: 1, flag: 'fernet_respect' }, next: null }
        ]
      }
    }
  };
})();

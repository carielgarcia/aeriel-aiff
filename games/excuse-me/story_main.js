/* EXCUSE ME — story: the main floor (Chapter 1-2): Broh, Tobi, the stomp circle, the bar, Hugo, Tristan, the friends. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;

  /* ------------------------------------------------------------ BROH */
  D.broh1 = {
    who: 'broh', role: T('GUY WITH GIRLFRIEND', 'CHICO CON NOVIA', 'CARA COM NAMORADA'), start: 'a', nodes: {
      a: {
        text: [
          T('"Brooo. Easy, easy. You\'re in her space, bro."', '«Brooo. Tranqui, tranqui. Estás en su espacio, bro».', '«Maaano. Calma, calma. Tá no espaço dela, mano».'),
          T('He tightens both arms around SOFI like a seatbelt. Legs wide, chin up, scanning the room for threats. Sofi looks at you over his forearm like a hostage requesting a snack.', 'Aprieta los dos brazos alrededor de SOFI como un cinturón de seguridad. Piernas abiertas, mentón arriba, buscando amenazas. Sofi te mira por encima de su antebrazo como una rehén que pide un snack.', 'Ele aperta os dois braços em volta da SOFI como um cinto de segurança. Pernas abertas, queixo erguido, procurando ameaças. A Sofi te olha por cima do antebraço dele como uma refém pedindo um lanche.')
        ],
        choices: [
          { tone: 'chill', t: T('"Sorry, bro. Just trying to get to my friends."', '«Perdón, bro. Solo intento llegar con mis amigos».', '«Foi mal, mano. Só tô tentando chegar nos meus amigos».'), next: 'b' },
          { tone: 'smooth', t: T('"You two look great together."', '«Se ven increíbles juntos».', '«Vocês ficam ótimos juntos».'), next: 'c' },
          { tone: 'bold', t: T('(To Sofi) "Hey, are you good? Want to dance with us?"', '(A Sofi) «Oye, ¿estás bien? ¿Quieres bailar con nosotros?»', '(Pra Sofi) «Ei, você tá bem? Quer dançar com a gente?»'), next: 'd' },
          { tone: 'hug', t: T('"Bro. I LOVE this energy. Come here."', '«Bro. AMO esta energía. Ven acá».', '«Mano. AMO essa energia. Vem cá».'), req: { high: 2 }, next: 'e' },
          { tone: 'push', t: T('"Move."', '«Muévete».', '«Sai».'), next: 'f', bad: true }
        ]
      },
      b: {
        text: T('"Yeah, yeah. It\'s just — a lot of guys in here, you know? A LOT of guys. Looking."', '«Sí, sí. Es que… hay muchos tipos acá, ¿sabes? MUCHOS tipos. Mirando».', '«É, é. É que… tem muito cara aqui, sabe? MUITO cara. Olhando».'),
        choices: [
          { tone: 'smooth', t: T('"Totally. She\'s lucky somebody\'s looking out."', '«Total. Ella tiene suerte de que alguien la cuide».', '«Total. Ela tem sorte de ter alguém olhando por ela».'), next: 'c' },
          { tone: 'blunt', t: T('"Looking out is one thing. Holding her like luggage is another."', '«Cuidar es una cosa. Cargarla como una maleta es otra».', '«Cuidar é uma coisa. Segurar ela feito mala é outra».'), do: { soc: -3, flag: 'broh_hostile', open: 'broh' }, next: null, react: T('He lets go of Sofi\'s arm. Not the grudge. Sofi mouths "thank you" and rolls her eyes at the ceiling.', 'Suelta el brazo de Sofi. No el rencor. Sofi dice «gracias» sin voz y pone los ojos en blanco hacia el techo.', 'Ele solta o braço da Sofi. O rancor, não. A Sofi diz «obrigada» sem voz e revira os olhos pro teto.') },
          { tone: 'joke', t: T('"Nobody\'s looking at her. They\'re looking at your cap."', '«Nadie la mira a ella. Miran tu gorra».', '«Ninguém tá olhando pra ela. Tão olhando pro seu boné».'), do: { fun: 3, open: 'broh', flag: 'broh_ok' }, next: null, react: T('He laughs, a little too loud, and loosens his grip to straighten the cap. Gap achieved.', 'Se ríe, un poco fuerte, y afloja el agarre para acomodarse la gorra. Hueco conseguido.', 'Ele ri, um pouco alto demais, e afrouxa o aperto pra ajeitar o boné. Brecha aberta.') }
        ]
      },
      c: {
        text: [
          T('"Bro. Thank you. Seriously. People don\'t say that."', '«Bro. Gracias. En serio. La gente no dice eso».', '«Mano. Valeu. Sério. As pessoas não falam isso».'),
          T('He actually steps aside, one arm still around Sofi. Over his shoulder she mouths: "he\'s like this." She is smiling, a little.', 'Se hace a un lado de verdad, con un brazo todavía alrededor de Sofi. Por encima de su hombro ella articula: «es así». Sonríe, un poquito.', 'Ele realmente sai da frente, com um braço ainda em volta da Sofi. Por cima do ombro dele ela diz sem voz: «ele é assim». Ela está sorrindo, um pouquinho.')
        ],
        do: { open: 'broh', flag: 'broh_friend', soc: 3, fun: 2 }
      },
      d: {
        text: [
          T('SOFI slides out of his arms like toothpaste from a tube. "Honestly? Yes. Thank you. I have been standing here for forty minutes."', 'SOFI se desliza de sus brazos como pasta dental de un tubo. «¿Sinceramente? Sí. Gracias. Llevo cuarenta minutos parada aquí».', 'A SOFI escorrega dos braços dele como pasta de dente do tubo. «Sinceramente? Sim. Valeu. Tô aqui parada faz quarenta minutos».'),
          T('BROH: "Babe—?!" She pats his chest twice like a dog that did well. "I\'m fine. Go dance with me, then come back. You can sulk in the meantime."', 'BROH: «¿Amor—?!» Ella le da dos palmaditas en el pecho como a un perro que lo hizo bien. «Estoy bien. Vamos a bailar y luego vuelvo. Mientras tanto puedes enojarte».', 'BROH: «Amor—?!» Ela dá dois tapinhas no peito dele como num cachorro que se comportou. «Tô bem. Vou dançar com vocês e já volto. Pode ficar emburrado enquanto isso».')
        ],
        do: { open: 'broh', flag: ['broh_hostile', 'sofi_ally'], soc: -2, fun: 4, bond: { maru: 0 } }
      },
      e: {
        text: [
          T('BROH goes stiff. Then limp. Then damp. "…bro. Bro. My dad never… okay. Okay. I\'m just so scared she\'ll leave."', 'BROH se pone rígido. Luego flojo. Luego húmedo. «…bro. Bro. Mi papá nunca… ok. Ok. Es que me da tanto miedo que se vaya».', 'O BROH fica duro. Depois mole. Depois molhado. «…mano. Mano. Meu pai nunca… tá. Tá. É que eu tenho tanto medo dela ir embora».'),
          T('Sofi mouths "thank you" over his shoulder and, for the first time all night, relaxes her face. He lets her go to wipe his eyes. She is already stretching.', 'Sofi articula «gracias» por encima de su hombro y, por primera vez en toda la noche, relaja la cara. Él la suelta para secarse los ojos. Ella ya se está estirando.', 'A Sofi diz «obrigada» por cima do ombro dele e, pela primeira vez na noite, relaxa o rosto. Ele a solta pra secar os olhos. Ela já está se alongando.')
        ],
        do: { open: 'broh', flag: ['broh_friend', 'broh_hugged'], care: 1, soc: 2 }
      },
      f: {
        text: [
          T('BROH shoves back, hard. "BRO. WHAT THE FUCK."', 'BROH te empuja de vuelta, fuerte. «BRO. QUÉ MIERDA».', 'O BROH te empurra de volta, forte. «MANO. QUE PORRA».'),
          T('The whole bar-side of the room turns to look. A bouncer two hundred metres away adjusts his posture. Broh squares up, then sees Sofi\'s face and deflates, still glaring.', 'Todo el lado del bar se da vuelta a mirar. Un guardia a doscientos metros corrige la postura. Broh se pone en guardia, luego ve la cara de Sofi y se desinfla, todavía fulminándote.', 'Todo o lado do bar vira pra olhar. Um segurança a duzentos metros ajeita a postura. O Broh parte pra cima, depois vê a cara da Sofi e murcha, ainda te fuzilando.')
        ],
        do: { open: 'broh', flag: ['broh_hostile', 'shoved_broh'], weird: 12, hp: -6, soc: -5 }
      }
    }
  };

  D.broh_return = {
    who: 'broh', role: T('GUY WITH FRIEND', 'CHICO CON AMIGO', 'CARA COM AMIGO'), start: 'a', nodes: {
      a: {
        text: [
          T('"That\'s him. THAT\'S the guy." Broh and a friend of his are planted in the same gap, arms crossed, wearing their grudge like a second cap.', '«Ese es. ESE es el tipo». Broh y un amigo suyo están plantados en el mismo hueco, brazos cruzados, con el rencor puesto como una segunda gorra.', '«É ele. É ESSE o cara». O Broh e um amigo dele estão plantados na mesma brecha, braços cruzados, usando o rancor como um segundo boné.')
        ],
        choices: [
          { tone: 'sorry', t: T('"I was out of line earlier. I\'m sorry."', '«Me pasé antes. Perdón».', '«Passei do limite antes. Desculpa».'), do: { soc: -1, flag: 'broh_forgiven', unflag: ['broh_hostile', 'broh_back'], open: 'broh', fun: 1 }, next: null, react: T('A long pause. "…Yeah. Okay. Don\'t do it again." He steps aside like it costs him money.', 'Una pausa larga. «…Sí. Ok. No lo vuelvas a hacer». Se hace a un lado como si le costara dinero.', 'Uma pausa longa. «…É. Tá. Não faz de novo». Ele sai da frente como se isso lhe custasse dinheiro.') },
          { tone: 'joke', t: T('"Sofi says hi."', '«Sofi manda saludos».', '«A Sofi mandou um oi».'), do: { fun: 2, weird: 4, soc: -3, open: 'broh' }, next: null, react: T('The veins in his neck do a little dance. His friend says "wait, who?" and the moment gets through like a bad smell.', 'Las venas de su cuello hacen un baile. Su amigo dice «¿espera, quién?» y el momento pasa como un mal olor.', 'As veias do pescoço dele fazem uma dança. O amigo diz «peraí, quem?» e o momento passa como um mau cheiro.') },
          { tone: 'fight', t: T('"Come on, then."', '«Vamos, entonces».', '«Vem então».'), do: { hp: -15, weird: 25, soc: -8, flag: 'fight_broh', open: 'broh' }, next: null, bad: true, react: T('It is short, stupid and loud. Somebody\'s elbow finds your ribs. Somebody else shouts "SECURITY" like it is a spell. You are through, and everybody knows your face.', 'Es corto, estúpido y ruidoso. El codo de alguien encuentra tus costillas. Otro grita «SEGURIDAD» como si fuera un hechizo. Pasaste, y todos conocen tu cara.', 'É curto, burro e barulhento. O cotovelo de alguém acha suas costelas. Outro grita «SEGURANÇA» como se fosse um feitiço. Você passou, e todo mundo conhece sua cara.') }
        ]
      }
    }
  };

  /* ------------------------------------------------------------ TOBI (gesture) */
  D.tobi = {
    who: 'tobi', role: T('NOT REALLY HERE', 'NO ESTÁ DEL TODO AQUÍ', 'NÃO ESTÁ BEM AQUI'), start: 'a', nodes: {
      a: {
        garble: true, gesture: true,
        text: T('"…the… floooor… is… *breathing*… are… you… also… a… door…?" He is staring at a lamp as if it owes him an explanation, arms slightly out, swaying across the whole gap. Words will not work. Choose a gesture.', '«…el… piiiso… está… *respirando*… ¿tú… eres… también… una… puerta…?» Mira una lámpara como si le debiera una explicación, con los brazos algo abiertos, balanceándose por todo el hueco. Las palabras no sirven. Elige un gesto.', '«…o… chããão… tá… *respirando*… você… também… é… uma… porta…?» Ele encara uma lâmpada como se ela lhe devesse uma explicação, braços um pouco abertos, balançando pela brecha toda. Palavras não funcionam. Escolha um gesto.'),
        choices: [
          { icon: 'wave', t: T('Wave a hand in front of his face', 'Mover una mano frente a su cara', 'Balançar a mão na frente do rosto dele'), do: { time: 3 }, next: 'w', react: T('He waves back. For. Ten. Seconds. "…hi."', 'Te saluda de vuelta. Durante. Diez. Segundos. «…hola».', 'Ele acena de volta. Por. Dez. Segundos. «…oi».') },
          { icon: 'point', t: T('Turn him gently by the shoulders and point at the bar', 'Girarlo suavemente por los hombros y señalar la barra', 'Virar ele com delicadeza pelos ombros e apontar o bar'), do: { open: 'tobi', flag: 'tobi_rotated', weird: 1, soc: -1 }, next: null, react: T('He walks in a perfectly straight line directly into a pillar. "ow." Then, from the floor, with enormous sincerity: "thank you."', 'Camina en línea perfectamente recta directo contra un pilar. «ay». Luego, desde el piso, con enorme sinceridad: «gracias».', 'Ele anda numa linha perfeitamente reta direto num pilar. «ai». Depois, do chão, com enorme sinceridade: «obrigado».') },
          { icon: 'hug', t: T('Hug him', 'Abrazarlo', 'Abraçá-lo'), do: { fun: 3, soc: 3, time: 3, flag: 'tobi_hugged' }, next: 'h', react: T('Twenty seconds of nothing. He is very warm and smells like fabric softener and fear.', 'Veinte segundos de nada. Está muy tibio y huele a suavizante y miedo.', 'Vinte segundos de nada. Ele está bem quente e cheira a amaciante e medo.') },
          { icon: 'water', t: T('Offer your water bottle', 'Ofrecerle tu botella de agua', 'Oferecer sua garrafa de água'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, flag: 'tobi_water', open: 'tobi' }, next: null, react: T('He drinks half of it, blinks, and comes back like a slow screen turning on. "oh. hi. oh my god. where is my— thank you." He wanders off, still holding the bottle. Worth it.', 'Se toma la mitad, parpadea y vuelve como una pantalla lenta que se enciende. «ah. hola. ay dios. dónde está mi— gracias». Se va, todavía sosteniendo la botella. Valió la pena.', 'Ele bebe metade, pisca e volta como uma tela lenta ligando. «ah. oi. meu deus. cadê meu— valeu». Sai andando, ainda segurando a garrafa. Valeu a pena.') },
          { icon: 'phone', t: T('Find his people: read his wristband, check his phone, call them', 'Encontrar a su gente: leer su pulsera, mirar su celular, llamarlos', 'Achar a galera dele: ler a pulseira, olhar o celular, ligar'), req: { sober: true }, do: { care: 1, time: 10, flag: 'tobi_people', open: 'tobi' }, next: null, react: T('A note on his lock screen says "IF FOUND: INES" with a number. Ines answers on the first ring, arrives in six minutes with two friends and a tote bag of snacks, and takes him with the efficiency of someone who has done this before.', 'Una nota en su pantalla dice «SI ME ENCUENTRAN: INÉS» con un número. Inés contesta al primer tono, llega en seis minutos con dos amigos y una bolsa de snacks, y se lo lleva con la eficiencia de quien ya lo hizo antes.', 'Um recado na tela de bloqueio diz «SE ME ACHAREM: INÊS» com um número. A Inês atende no primeiro toque, chega em seis minutos com dois amigos e uma sacola de lanches, e leva ele com a eficiência de quem já fez isso antes.') }
        ]
      },
      w: {
        garble: true, gesture: true,
        text: T('He is still smiling at the lamp. Somewhere in there, he registered you.', 'Sigue sonriéndole a la lámpara. Ahí adentro, en algún lugar, te registró.', 'Ele continua sorrindo pra lâmpada. Lá no fundo, ele te registrou.'),
        choices: [
          { icon: 'point', t: T('Turn him gently and point at the bar', 'Girarlo suavemente y señalar la barra', 'Virar com delicadeza e apontar o bar'), do: { open: 'tobi', flag: 'tobi_rotated', weird: 1, soc: -1 }, next: null, react: T('Straight line. Pillar. "ow." "thank you."', 'Línea recta. Pilar. «ay». «gracias».', 'Linha reta. Pilar. «ai». «obrigado».') },
          { icon: 'hug', t: T('Hug him', 'Abrazarlo', 'Abraçá-lo'), do: { fun: 3, soc: 3, time: 3, flag: 'tobi_hugged' }, next: 'h' },
          { icon: 'water', t: T('Offer your water bottle', 'Ofrecerle tu botella de agua', 'Oferecer sua garrafa de água'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, flag: 'tobi_water', open: 'tobi' }, next: null, react: T('He drinks, blinks, returns. "thank you." He wanders off toward actual people.', 'Toma, parpadea, vuelve. «gracias». Se va hacia gente de verdad.', 'Ele bebe, pisca, volta. «obrigado». Sai em direção a pessoas de verdade.') },
          { icon: 'phone', t: T('Find his people', 'Encontrar a su gente', 'Achar a galera dele'), req: { sober: true }, do: { care: 1, time: 10, flag: 'tobi_people', open: 'tobi' }, next: null }
        ]
      },
      h: {
        gesture: true, garble: true,
        text: T('"…you are… a good… door." He leans back a little and looks at you almost clearly. The gap behind him is still blocked.', '«…eres… una buena… puerta». Se echa un poco hacia atrás y te mira casi con claridad. El hueco detrás de él sigue bloqueado.', '«…você é… uma boa… porta». Ele se afasta um pouco e te olha quase com clareza. A brecha atrás dele continua bloqueada.'),
        choices: [
          { icon: 'point', t: T('Point at the bar. He nods gravely and goes.', 'Señalar la barra. Asiente con gravedad y se va.', 'Apontar o bar. Ele assente com gravidade e vai.'), do: { open: 'tobi' }, next: null, react: T('He leaves on his own, only brushing two pillars.', 'Se va por su cuenta, rozando apenas dos pilares.', 'Ele vai embora sozinho, raspando só em dois pilares.') },
          { icon: 'water', t: T('Offer your water bottle', 'Ofrecerle tu botella de agua', 'Oferecer sua garrafa de água'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, flag: 'tobi_water', open: 'tobi' }, next: null, react: T('He drinks, he comes back, he cries a little, he says "I\'m with my friend Ines, I\'m supposed to be with Ines," and leaves to find her.', 'Toma, vuelve, llora un poco, dice «estoy con mi amiga Inés, tengo que estar con Inés» y se va a buscarla.', 'Ele bebe, volta, chora um pouco, diz «tô com minha amiga Inês, eu devia estar com a Inês» e sai pra procurá-la.') }
        ]
      }
    }
  };

  /* ------------------------------------------------------------ STOMP CIRCLE */
  D.stomp = {
    who: 'stomp1', role: T('THE CIRCLE', 'EL CÍRCULO', 'A RODA'), start: 'a', nodes: {
      a: {
        text: T('Four people in a circle, stomping in a synchronized way that suggests either deep spiritual commitment or a very long afterparty. The only gap is behind them. They do not look at you. The circle looks at the floor.', 'Cuatro personas en círculo, pisando de forma sincronizada que sugiere un compromiso espiritual profundo o un afterparty larguísimo. El único hueco está detrás de ellos. No te miran. El círculo mira el piso.', 'Quatro pessoas em círculo, pisando de forma sincronizada, o que sugere um compromisso espiritual profundo ou um after muito longo. A única brecha está atrás deles. Não te olham. A roda olha pro chão.'),
        choices: [
          { tone: 'dance', t: T('Step in. Wait for the downbeat. Join the phrase.', 'Entrar. Esperar el tiempo fuerte. Unirte a la frase.', 'Entrar. Esperar o tempo forte. Entrar na frase.'), call: 'stomp_dance', next: null, free: true },
          { tone: 'chill', t: T('"Excuse me?"', '«¿Con permiso?»', '«Com licença?»'), next: 'a', react: T('"…stomp." That was the whole reply.', '«…pisa». Esa fue toda la respuesta.', '«…pisa». Essa foi a resposta inteira.'), do: { soc: -1 } },
          { tone: 'joke', t: T('"Is this a ritual? Can I be the sacrifice?"', '«¿Es un ritual? ¿Puedo ser el sacrificio?»', '«É um ritual? Posso ser o sacrifício?»'), next: 'b', do: { fun: 2 } }
        ]
      },
      b: {
        text: T('One of them grins without breaking rhythm. "Left, left, right, left, left. Then you\'re in. Don\'t think. They hate when you think."', 'Uno sonríe sin romper el ritmo. «Izquierda, izquierda, derecha, izquierda, izquierda. Y estás dentro. No pienses. Odian que pienses».', 'Um deles sorri sem quebrar o ritmo. «Esquerda, esquerda, direita, esquerda, esquerda. Aí você tá dentro. Não pense. Eles odeiam quando você pensa».'),
        choices: [
          { tone: 'dance', t: T('Step in.', 'Entrar.', 'Entrar.'), call: 'stomp_dance', next: null, free: true }
        ]
      }
    }
  };
  S.stomp_dance = function () {
    const s = EM.state;
    U.danceGate({ seq: 'LLRLL', attempts: 3 }, function (res) {
      if (res === 'win') {
        L.apply({ open: 'stomp', fun: 9, soc: 3, flag: 'stomp_win' });
        U.toast({ icon: 'star', text: T('The circle opens. One of them winks. You are in.', 'El círculo se abre. Uno te guiña. Estás dentro.', 'A roda se abre. Um deles pisca. Você está dentro.'), kind: 'good' });
      } else if (res === 'partial') {
        L.apply({ open: 'stomp', fun: 4, soc: 1 });
        U.toast({ text: T('Messy, but sincere. They let you through.', 'Desordenado, pero sincero. Te dejan pasar.', 'Bagunçado, mas sincero. Deixam você passar.'), kind: 'info' });
      } else {
        L.apply({ open: 'stomp', weird: 3, soc: -3, fun: -2, flag: 'stomp_bail' });
        U.toast({ text: T('You duck under an elbow and squeeze through, apologizing to everyone, including the floor.', 'Te agachas bajo un codo y te cuelas, pidiendo perdón a todos, incluido el piso.', 'Você se abaixa sob um cotovelo e passa espremido, pedindo desculpas pra todo mundo, inclusive pro chão.'), kind: 'bad' });
      }
    });
  };

  /* ------------------------------------------------------------ BAR */
  D.bar_menu = {
    who: 'nico', role: T('BARTENDER', 'BARTENDER', 'BARTENDER'), start: 'a', nodes: {
      a: {
        text: T('"What\'ll it be? The tap jug is free, and I will never let anyone sell you the bottles."', '«¿Qué va a ser? La jarra de la canilla es gratis, y nunca dejaré que nadie te venda las botellas».', '«O que vai ser? A jarra da torneira é de graça, e eu nunca vou deixar ninguém te vender as garrafas».'),
        choices: [
          { tone: 'water', t: T('Tap water. A lot.', 'Agua de la canilla. Mucha.', 'Água da torneira. Bastante.'), do: { water: true, time: 3 }, free: true, next: null, react: T('Cold, a little metallic, perfect.', 'Fría, un poco metálica, perfecta.', 'Gelada, um pouco metálica, perfeita.') },
          { tone: 'water', t: T('Fill my bottle.', 'Llena mi botella.', 'Encher minha garrafa.'), req: function (s) { return s.items.water < 3; }, do: { item: { water: 1 }, time: 2 }, free: true, next: null },
          { tone: 'yes', t: T('A beer.', 'Una cerveza.', 'Uma cerveja.'), do: { drink: 1, time: 4 }, free: true, next: null },
          { tone: 'yes', t: T('Something clear, a double.', 'Algo transparente, doble.', 'Algo transparente, dose dupla.'), do: { drink: 2, time: 4, fun: 3 }, free: true, next: null },
          { tone: 'ask', t: T('"How\'s your night?"', '«¿Cómo va tu noche?»', '«Como tá sua noite?»'), next: 'b' },
          { tone: 'silent', t: T('Nothing, thanks.', 'Nada, gracias.', 'Nada, valeu.'), free: true, next: null }
        ]
      },
      b: {
        text: T('"Quiet until two, then it\'s a battlefield. Pro tip: when the line for the toilets looks cursed, it is. There\'s a door behind the sinks marked STAFF. Rosa decides who it opens for. Be polite to Rosa. Be extremely polite to Rosa."', '«Tranquilo hasta las dos, después es un campo de batalla. Dato: cuando la fila de los baños parece maldita, lo está. Hay una puerta detrás de los lavamanos que dice STAFF. Rosa decide para quién se abre. Sé amable con Rosa. Sé muy amable con Rosa».', '«Tranquilo até as duas, depois vira campo de batalha. Dica: quando a fila do banheiro parece amaldiçoada, é porque está. Tem uma porta atrás das pias escrito STAFF. A Rosa decide pra quem ela abre. Seja educado com a Rosa. Seja muito educado com a Rosa».'),
        do: { flag: 'nico_tip' }
      }
    }
  };

  /* ------------------------------------------------------------ HUGO */
  D.hugo = {
    who: 'hugo', role: T('OLD HEAD', 'VETERANO', 'VETERANO'), start: 'a', nodes: {
      a: {
        text: T('"Ninety-four. My first one. You know what they didn\'t have? Phones. You know what they did? Danced like nobody was watching, because nobody was."', '«Noventa y cuatro. Mi primera. ¿Sabes qué no tenían? Celulares. ¿Sabes qué hacían? Bailaban como si nadie los mirara, porque nadie los miraba».', '«Noventa e quatro. Minha primeira. Sabe o que eles não tinham? Celular. Sabe o que faziam? Dançavam como se ninguém estivesse olhando, porque ninguém estava».'),
        choices: [
          { tone: 'ask', t: T('"What\'s the secret to lasting a whole night?"', '«¿Cuál es el secreto para aguantar toda la noche?»', '«Qual é o segredo pra aguentar a noite inteira?»'), next: 'b' },
          { tone: 'dance', t: T('"Teach me a step."', '«Enséñame un paso».', '«Me ensina um passo».'), call: 'hugo_dance', next: null, free: true },
          { tone: 'chill', t: T('"Respect."', '«Respeto».', '«Respeito».'), do: { soc: 1 }, next: null }
        ]
      },
      b: {
        text: T('"Three things. Shoes you can cry in. Water you don\'t have to be reminded about. Friends who check on you. And when the room gets small, you go sit down. Nobody was ever sorry they sat down."', '«Tres cosas. Zapatos en los que puedas llorar. Agua que no haga falta recordarte. Amigos que te cuiden. Y cuando el cuarto se achica, te sientas. Nadie se arrepintió nunca de sentarse».', '«Três coisas. Sapatos em que dê pra chorar. Água que ninguém precise te lembrar. Amigos que cuidem de você. E quando a sala encolhe, você vai sentar. Ninguém nunca se arrependeu de ter sentado».'),
        do: { flag: 'hugo_advice', fun: 2 }
      }
    }
  };
  S.hugo_dance = function () {
    U.danceGate({ seq: 'DULRD', attempts: 3 }, function (res) {
      if (res === 'win') { L.apply({ fun: 10, soc: 2, flag: ['hugo_friend', 'hugo_danced'] }); U.toast({ icon: 'star', text: T('Hugo whoops. "That\'s the shuffle! Forty years and nobody got it right on the first try."', 'Hugo grita. «¡Ese es el shuffle! Cuarenta años y nadie lo hizo bien a la primera».', 'O Hugo grita. «Esse é o shuffle! Quarenta anos e ninguém acertou de primeira».'), kind: 'good' }); }
      else if (res === 'partial') { L.apply({ fun: 4, flag: 'hugo_friend' }); U.toast({ text: T('"Close! The hips come later, kid."', '«¡Cerca! Las caderas vienen después».', '«Quase! Os quadris vêm depois, jovem».'), kind: 'info' }); }
      else { L.apply({ fun: 1, soc: -1 }); U.toast({ text: T('Hugo pats your shoulder kindly. "Practice. Everything is practice."', 'Hugo te palmea el hombro con cariño. «Practica. Todo es práctica».', 'O Hugo bate no seu ombro com carinho. «Pratique. Tudo é prática».'), kind: 'info' }); }
    });
  };

  /* ------------------------------------------------------------ TRISTAN */
  D.tristan = {
    who: 'tristan', role: T('FILMING EVERYTHING', 'FILMANDO TODO', 'FILMANDO TUDO'), start: 'a', nodes: {
      a: {
        text: T('A phone appears in front of your face. Behind it: Tristan, headphones around his neck, ring light strapped to his forearm. "Smile! It\'s for the page! It\'s going to be SICK! Say \'excuse me\'!"', 'Un celular aparece frente a tu cara. Detrás: Tristan, auriculares al cuello, un aro de luz atado al antebrazo. «¡Sonríe! ¡Es para la página! ¡Va a quedar BRUTAL! ¡Di “con permiso”!»', 'Um celular aparece na frente do seu rosto. Atrás dele: o Tristan, fones no pescoço, um ring light amarrado no antebraço. «Sorri! É pra página! Vai ficar BRABO! Fala “com licença”!»'),
        choices: [
          { tone: 'honest', t: T('"Please don\'t film me. I want to dance without becoming content."', '«Por favor no me grabes. Quiero bailar sin convertirme en contenido».', '«Por favor não me filma. Quero dançar sem virar conteúdo».'), do: { flag: 'tristan_done', soc: -1 }, next: null, react: T('"Oh. Yeah. Sorry! Totally." He lowers the phone like a man defusing a small bomb.', '«Ah. Sí. ¡Perdón! Total». Baja el celular como quien desactiva una bomba pequeña.', '«Ah. É. Foi mal! Total». Ele abaixa o celular como quem desarma uma bombinha.') },
          { tone: 'joke', t: T('(Show your own camera sticker) "House rules. Mine is covered. Yours should be too."', '(Mostrar tu pegatina en la cámara) «Reglas de la casa. La mía está tapada. La tuya también debería».', '(Mostrar seu adesivo na câmera) «Regra da casa. O meu tá coberto. O seu também devia».'), req: { flag: 'sticker' }, do: { flag: 'tristan_done', fun: 2 }, next: null, react: T('He looks at your sticker, then at his own naked lens, then at the ceiling. "…I\'ll ask the next person first." That counts.', 'Mira tu pegatina, luego su lente desnudo, luego el techo. «…Le preguntaré primero a la próxima persona». Eso cuenta.', 'Ele olha seu adesivo, depois a própria lente nua, depois o teto. «…Vou perguntar primeiro pra próxima pessoa». Isso conta.') },
          { tone: 'blunt', t: T('"Put it down. No photos in here."', '«Bájalo. Aquí no hay fotos».', '«Abaixa isso. Aqui não tem foto».'), next: 'b' },
          { tone: 'push', t: T('Slap the phone out of his hand.', 'Sacarle el celular de la mano de un golpe.', 'Tirar o celular da mão dele com um tapa.'), do: { weird: 15, soc: -5, flag: ['tristan_done', 'tristan_slap'] }, next: null, bad: true, react: T('The phone skids across the dancefloor. People cheer, then stop cheering when they see the person who slapped it was you. Security noted the direction of travel.', 'El celular se desliza por la pista. La gente aplaude y luego deja de aplaudir al ver que fuiste tú. Seguridad anotó la dirección.', 'O celular escorrega pela pista. As pessoas aplaudem, depois param ao ver que foi você. A segurança anotou a direção.') },
          { tone: 'lie', t: T('"Sure. This is my good side." (Pose.)', '«Claro. Este es mi lado bueno». (Posar.)', '«Claro. Esse é meu lado bom». (Posar.)'), do: { fun: 2, flag: 'filmed' }, next: null, react: T('He films for fifteen seconds. You are now a story on an account with four hundred followers. Congratulations, probably.', 'Graba quince segundos. Ahora eres una historia en una cuenta con cuatrocientos seguidores. Felicidades, probablemente.', 'Ele filma por quinze segundos. Você agora é um story numa conta com quatrocentos seguidores. Parabéns, provavelmente.') }
        ]
      },
      b: {
        text: T('"It\'s PUBLIC. It\'s a club. It\'s content! Everyone knows the vibes!"', '«Es PÚBLICO. Es un club. ¡Es contenido! ¡Todos conocen la onda!»', '«É PÚBLICO. É um club. É conteúdo! Todo mundo conhece a vibe!»'),
        choices: [
          { tone: 'honest', t: T('"Being in a room is not the same as agreeing to be filmed. You ask first."', '«Estar en un cuarto no es lo mismo que aceptar que te filmen. Se pregunta primero».', '«Estar numa sala não é o mesmo que concordar em ser filmado. Pergunta antes».'), do: { flag: 'tristan_done', soc: -2 }, next: null, react: T('He opens his mouth for a counterargument, finds none, deletes the clip with a very small sigh.', 'Abre la boca para contraargumentar, no encuentra ninguno, borra el clip con un suspiro mínimo.', 'Ele abre a boca pra rebater, não encontra nada, apaga o clipe com um suspiro bem pequeno.') },
          { tone: 'sorry', t: T('"Fine, your call. Sorry I snapped."', '«Bueno, tú decides. Perdón por saltar».', '«Tá, você que sabe. Desculpa ter explodido».'), do: { soc: -1, flag: 'tristan_done' }, next: null }
        ]
      }
    }
  };

  /* ------------------------------------------------------------ SOFA NOOK */
  D.sofa_nook = {
    who: 'sofa1', role: T('COUPLE', 'PAREJA', 'CASAL'), start: 'a', nodes: {
      a: {
        text: T('The corridor to the toilets is one body wide. Two people are in it, pressed against the wall, deep in each other\'s mouth, hands doing a thing hands should only do in private or in a club. Neither is going anywhere. Neither is the door behind them.', 'El pasillo a los baños tiene el ancho de un cuerpo. Hay dos personas ahí, apretadas contra la pared, hundidas en la boca del otro, con las manos haciendo algo que las manos solo deberían hacer en privado o en un club. Ninguno va a ninguna parte. La puerta detrás tampoco.', 'O corredor até os banheiros tem a largura de um corpo. Duas pessoas estão ali, coladas na parede, mergulhadas na boca uma da outra, com as mãos fazendo algo que mãos só deveriam fazer em particular ou num club. Nenhuma vai a lugar nenhum. A porta atrás delas também não.'),
        choices: [
          { tone: 'chill', t: T('"Excuse me — sorry — need to get past."', '«Con permiso — perdón — necesito pasar».', '«Com licença — desculpa — preciso passar».'), do: { open: 'sofa_nook', soc: -1 }, next: null, react: T('They shuffle half a step with a groan like a door in an old house. Nobody comes up for air.', 'Se corren medio paso con un gemido de puerta de casa vieja. Nadie sale a respirar.', 'Eles se arrastam meio passo com um gemido de porta de casa velha. Ninguém sobe pra respirar.') },
          { tone: 'bold', t: T('"Room for one more?"', '«¿Hay lugar para uno más?»', '«Tem lugar pra mais um?»'), do: { open: 'sofa_nook', flag: 'sofa_invite', fun: 3, soc: -1 }, next: null, react: T('One of them surfaces and looks you up and down. "Ask us again after three. If you still want to." They go back in. Behind you, Dani is whispering "I am not looking" and absolutely looking.', 'Uno de ellos emerge y te mira de arriba abajo. «Pregúntanos otra vez después de las tres. Si todavía quieres». Vuelven a lo suyo. Detrás de ti, Dani susurra «no estoy mirando» y está mirando absolutamente.', 'Uma delas emerge e te olha de cima a baixo. «Pergunta de novo depois das três. Se ainda quiser». Voltam ao que faziam. Atrás de você, o Dani sussurra «eu não tô olhando» e está olhando absolutamente.') },
          { tone: 'flirt', t: T('"Carry on. I\'ll wait."', '«Sigan. Yo espero».', '«Continuem. Eu espero».'), do: { open: 'sofa_nook', time: 10, fun: 3, flag: 'sofa_wait' }, next: null, react: T('Ten minutes later they finish with a flourish, wipe their faces, and apologize like professionals. "Thanks for waiting, you are a legend of the night." Your friends have started a betting pool.', 'Diez minutos después terminan con un floreo, se limpian la cara y se disculpan como profesionales. «Gracias por esperar, eres una leyenda de la noche». Tus amigos abrieron una apuesta.', 'Dez minutos depois eles terminam com um floreio, limpam o rosto e pedem desculpa como profissionais. «Valeu por esperar, você é uma lenda da noite». Seus amigos abriram um bolão.') },
          { tone: 'honest', t: T('"Sorry to interrupt — there is a toilet emergency behind me."', '«Perdón por interrumpir — hay una emergencia de baño detrás de mí».', '«Desculpa interromper — tem uma emergência de banheiro atrás de mim».'), do: { open: 'sofa_nook' }, next: null, react: T('They peel apart in unison. "Oh my god. GO." A hand points at the door like a flight attendant.', 'Se despegan al unísono. «Ay dios. VAYAN». Una mano señala la puerta como una azafata.', 'Elas se descolam em uníssono. «Meu deus. VAI». Uma mão aponta a porta como uma aeromoça.') }
        ]
      }
    }
  };
})();

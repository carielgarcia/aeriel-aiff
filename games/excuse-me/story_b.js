/* EXCUSE ME — story B: the toilets (Chapters 3-4): the queue, the host, one stall for several people, Rosa. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;

  /* ------------------------------------------------------------ arrival */
  S.enter_restrooms = function () {
    const s = EM.state;
    if (s.quests.q2 === 'active') {
      L.apply({ quest: { q2: 'done', q3: 'active' }, at: 170 });
      U.toast({ icon: 'door', text: T('The toilets. A queue with its own weather.', 'Los baños. Una fila con clima propio.', 'Os banheiros. Uma fila com clima próprio.'), kind: 'info' });
    }
  };

  /* ------------------------------------------------------------ queue folk */
  D.marga = {
    who: 'marga', role: T('IN LINE', 'EN LA FILA', 'NA FILA'), start: 'a', nodes: {
      a: {
        text: T('"I am going to PEE ON THE FLOOR. I am telling you now. As a courtesy." She is bouncing from one foot to the other like a kettle about to sing.', '«Voy a HACERME PIPÍ EN EL PISO. Te lo digo desde ahora. Como cortesía». Salta de un pie al otro como una tetera a punto de silbar.', '«Vou fazer XIXI NO CHÃO. Tô avisando agora. Por cortesia». Ela pula de um pé pro outro como uma chaleira prestes a apitar.'),
        choices: [
          { tone: 'care', t: T('"Go ahead of us. Seriously. Go."', '«Pasa antes que nosotros. En serio. Ve».', '«Vai na nossa frente. Sério. Vai».'), do: { flag: ['marga_helped', 'marga_done'], care: 1, fun: 1 }, next: null, react: T('She grabs your face with both hands and kisses the air next to your cheek. "You are a SAINT." The host looks over, notes it, says nothing.', 'Te agarra la cara con las dos manos y besa el aire junto a tu mejilla. «Eres un SANTO». El encargado mira, lo anota, no dice nada.', 'Ela agarra seu rosto com as duas mãos e beija o ar ao lado da sua bochecha. «Você é uma SANTA PESSOA». O responsável olha, registra, não diz nada.') },
          { tone: 'blunt', t: T('"We\'re all waiting."', '«Todos estamos esperando».', '«Todo mundo tá esperando».'), do: { soc: -1 }, next: null },
          { tone: 'joke', t: T('"Have you tried not being thirsty?"', '«¿Probaste no tener sed?»', '«Já tentou não sentir sede?»'), do: { soc: -2, weird: 2 }, next: null, bad: true, react: T('She looks at you the way people look at a pothole.', 'Te mira como se mira un bache.', 'Ela te olha como as pessoas olham um buraco na rua.') }
        ]
      }
    }
  };

  D.ezra = {
    who: 'ezra', role: T('IN LINE', 'EN LA FILA', 'NA FILA'), start: 'a', nodes: {
      a: {
        text: T('Ezra is doing his eyeliner in the reflection of a phone screen, in a queue, with total commitment. "Be honest. Left wing or right wing?"', 'Ezra se está haciendo el delineado en el reflejo de la pantalla del celular, en una fila, con total compromiso. «Con sinceridad: ¿ala izquierda o ala derecha?»', 'O Ezra faz o delineado no reflexo da tela do celular, numa fila, com total comprometimento. «Com sinceridade: asa esquerda ou asa direita?»'),
        choices: [
          { tone: 'smooth', t: T('"Right wing. It\'s a masterpiece. They\'re going to write songs about it."', '«Ala derecha. Es una obra maestra. Van a escribir canciones sobre eso».', '«Asa direita. Uma obra-prima. Vão escrever músicas sobre isso».'), do: { soc: 2, fun: 2, flag: 'ezra_friend' }, next: 'b' },
          { tone: 'honest', t: T('"Left wing. The right one looks like a surprised eyebrow."', '«Ala izquierda. La derecha parece una ceja sorprendida».', '«Asa esquerda. A direita parece uma sobrancelha surpresa».'), do: { soc: 1, fun: 2 }, next: 'b' },
          { tone: 'chill', t: T('Nod and move on.', 'Asentir y seguir.', 'Assentir e seguir.'), free: true, next: null }
        ]
      },
      b: {
        text: T('"Gossip, since you were kind. Rosa — the cleaning lady — has been here since 2009. She knows every door in this building and has opinions about all of them. And she has a thing about the third stall. Do NOT make the third stall weird."', '«Chisme, ya que fuiste amable. Rosa, la señora de la limpieza, está aquí desde 2009. Se sabe todas las puertas de este edificio y tiene opiniones sobre cada una. Y tiene algo con la tercera cabina. NO hagas rara la tercera cabina».', '«Fofoca, já que você foi gentil. A Rosa — a faxineira — tá aqui desde 2009. Ela conhece todas as portas deste prédio e tem opinião sobre cada uma. E tem uma coisa com a terceira cabine. NÃO deixe a terceira cabine esquisita».'),
        do: { flag: 'ezra_tip' }
      }
    }
  };

  D.queue_pair = {
    who: 'qpair1', role: T('IN LINE', 'EN LA FILA', 'NA FILA'), start: 'a', nodes: {
      a: {
        text: T('"One of us pees, one of us holds the jacket. It\'s called love." The other one nods. "Pro tip, since you look like a group: the host loves honesty. Hates lies. Can smell lies. Is a lie-smelling man."', '«Uno hace pipí, el otro sostiene la chaqueta. Se llama amor». El otro asiente. «Dato, ya que parecen un grupo: al encargado le encanta la honestidad. Odia las mentiras. Las huele. Es un hombre que huele mentiras».', '«Um faz xixi, o outro segura a jaqueta. Chama-se amor». O outro assente. «Dica, já que vocês parecem um grupo: o responsável adora honestidade. Odeia mentira. Sente o cheiro. É um homem que fareja mentira».'),
        do: { flag: 'queue_tip' }
      }
    }
  };

  D.broh_queue = {
    who: 'broh', role: T('GRUDGE', 'RENCOR', 'RANCOR'), start: 'a', nodes: {
      a: {
        text: T('"Oh. It\'s you." Broh and a friend are three people ahead of you in the line, looking at you the way people look at a parking ticket. "Hey, host! This guy shoved me!"', '«Ah. Eres tú». Broh y un amigo están tres personas delante de ti, mirándote como se mira una multa de estacionamiento. «¡Eh, encargado! ¡Este tipo me empujó!»', '«Ah. É você». O Broh e um amigo estão três pessoas na sua frente na fila, te olhando como se olha uma multa de estacionamento. «Ei, responsável! Esse cara me empurrou!»'),
        do: { flag: 'broh_snitch' },
        choices: [
          { tone: 'sorry', t: T('"I lost my temper earlier. I\'m sorry. For real."', '«Perdí la paciencia antes. Perdón. De verdad».', '«Perdi a paciência antes. Desculpa. De verdade».'), do: { flag: 'broh_forgiven', unflag: ['broh_hostile', 'broh_snitch'], soc: -1 }, next: null, react: T('He chews on it. "…It\'s fine. Whatever. Sofi said you were polite." The friend deflates. The host looks up, notes it, looks down.', 'Lo mastica. «…Está bien. Da igual. Sofi dijo que fuiste amable». El amigo se desinfla. El encargado levanta la vista, lo anota, la baja.', 'Ele rumina. «…Tá tranquilo. Tanto faz. A Sofi disse que você foi educado». O amigo murcha. O responsável olha, registra, desvia.') },
          { tone: 'blunt', t: T('"Say it louder. The ceiling didn\'t hear."', '«Dilo más fuerte. El techo no escuchó».', '«Fala mais alto. O teto não ouviu».'), do: { soc: -3, weird: 5 }, next: null, bad: true },
          { tone: 'silent', t: T('Look away. Count the tiles.', 'Mirar a otro lado. Contar baldosas.', 'Olhar pro outro lado. Contar azulejos.'), do: { soc: -1 }, next: null }
        ]
      }
    }
  };

  /* ------------------------------------------------------------ THE HOST */
  D.host = {
    who: 'mika', role: T('HOST', 'ENCARGADO', 'RESPONSÁVEL'), start: 'start', nodes: {
      start: {
        branch: [
          { req: function (s) { return (s.flags.shoved_broh || s.flags.fight_broh) && s.flags.broh_hostile && !s.flags.broh_forgiven && !s.flags.host_knows_shove; }, to: 'snitch' },
          { req: function () { return true; }, to: 'a' }
        ]
      },
      snitch: {
        text: T('MIKA, not looking up: "Before anything. A man in the line tells me you put a hand on him. I do not care who started it. I care who ends it."', 'MIKA, sin levantar la vista: «Antes de nada. Un hombre de la fila me dice que le pusiste una mano encima. No me importa quién empezó. Me importa quién termina».', 'MIKA, sem levantar o olhar: «Antes de tudo. Um homem da fila me disse que você pôs a mão nele. Não me importa quem começou. Me importa quem termina».'),
        choices: [
          { tone: 'honest', t: T('"He\'s right. I lost my temper. It is done."', '«Tiene razón. Perdí los estribos. Se acabó».', '«Ele tem razão. Perdi a cabeça. Acabou».'), do: { flag: 'host_knows_shove', weird: 3 }, next: 'a' },
          { tone: 'lie', t: T('"He is lying. He was drunk."', '«Está mintiendo. Estaba borracho».', '«Ele tá mentindo. Tava bêbado».'), do: { weird: 8, soc: -3, flag: ['host_knows_shove', 'host_lied'] }, next: 'a', bad: true, react: T('Mika writes something on his hand. Slowly.', 'Mika escribe algo en su mano. Despacio.', 'O Mika escreve algo na mão. Devagar.') }
        ]
      },
      a: {
        text: [
          T('MIKA is built like a locked door with a lanyard. He does not look up from his clipboard.', 'MIKA tiene el cuerpo de una puerta cerrada con una credencial. No levanta la vista de su carpeta.', 'O MIKA tem o corpo de uma porta trancada com crachá. Não levanta o olhar da prancheta.'),
          T('"One person per stall. Nobody goes in two at a time. Nobody does anything in there that I would have to explain to the owner. The line is behind you."', '«Una persona por cabina. Nadie entra de a dos. Nadie hace ahí nada que yo tenga que explicarle al dueño. La fila está detrás de ti».', '«Uma pessoa por cabine. Ninguém entra de dois em dois. Ninguém faz ali nada que eu precise explicar pro dono. A fila é atrás de você».')
        ],
        choices: [
          { tone: 'honest', t: T('"We\'re a group, and we need one stall. Maru has to go. Tato gets overwhelmed and shouldn\'t be alone. We can keep it quick and clean."', '«Somos un grupo y necesitamos una cabina. Maru tiene que ir. Tato se abruma y no debería estar solo. Podemos hacerlo rápido y limpio».', '«A gente é um grupo e precisa de uma cabine. A Maru precisa ir. O Tato fica sobrecarregado e não deveria ficar sozinho. A gente faz rápido e limpo».'),
            next: 'honest_check' },
          { tone: 'smooth', t: T('"You have an impossible job and you\'re doing it beautifully. Give us ninety seconds of grace."', '«Tienes un trabajo imposible y lo haces hermoso. Danos noventa segundos de gracia».', '«Você tem um trabalho impossível e tá fazendo lindamente. Nos dá noventa segundos de graça».'),
            next: 'charm_check' },
          { tone: 'lie', t: T('"My friend is sick. Throwing-up sick."', '«Mi amigo está enfermo. De vomitar».', '«Meu amigo tá passando mal. De vomitar».'),
            do: { weird: 4 }, next: 'ok_lie' },
          { tone: 'honest', t: T('"Radio chatter says somebody gave a guy water by the speakers. That was me."', '«Dicen por radio que alguien le dio agua a un tipo junto a los parlantes. Fui yo».', '«Dizem no rádio que alguém deu água pra um cara perto das caixas. Fui eu».'), req: { any: ['tobi_water', 'tobi_people', 'kiki_friend', 'bruno_advised'] }, next: 'ok_group' },
          { tone: 'plan', t: T('"Fine. Maru goes alone. We wait here."', '«Bien. Maru va sola. Esperamos aquí».', '«Tá. A Maru vai sozinha. A gente espera aqui».'), next: 'split' }
        ]
      },
      honest_check: {
        branch: [
          { req: function (s) { return s.flags.tato_checked || (s.care || 0) >= 1 || s.flags.marga_helped || s.flags.queue_tip; }, to: 'ok_group' },
          { req: function () { return true; }, to: 'honest_meh' }
        ]
      },
      honest_meh: {
        text: T('MIKA looks up for the first time. "I believe you. Belief is not a stall. Give me one reason to think you are the kind of people I would want in my room."', 'MIKA levanta la vista por primera vez. «Te creo. Creer no es una cabina. Dame una razón para pensar que son el tipo de gente que quiero en mi baño».', 'O MIKA levanta o olhar pela primeira vez. «Acredito em você. Acreditar não é uma cabine. Me dê um motivo pra achar que vocês são o tipo de gente que eu quero na minha sala».'),
        choices: [
          { tone: 'honest', t: T('"We\'ll leave it cleaner than we found it. And if anybody is sick, you hear it from us first."', '«La dejamos más limpia que como la encontramos. Y si alguien se siente mal, lo sabes por nosotros primero».', '«A gente deixa mais limpa do que encontrou. E se alguém passar mal, você ouve de nós primeiro».'), do: { soc: -1 }, next: 'ok_group' },
          { tone: 'blunt', t: T('"It\'s a toilet, not a job interview."', '«Es un baño, no una entrevista de trabajo».', '«É um banheiro, não uma entrevista de emprego».'), do: { soc: -3, weird: 4 }, next: 'fail', bad: true }
        ]
      },
      charm_check: {
        branch: [
          { req: { min: { soc: 25 }, max: { weird: 55 } }, to: 'ok_group' },
          { req: function () { return true; }, to: 'fail' }
        ]
      },
      ok_group: {
        text: T('MIKA uncaps a pen with a click like a verdict. "Stall three. Locked, not bolted. If I hear anything I would not explain to my mother, you are out and the line gets a speech. Two minutes."', 'MIKA destapa una lapicera con un clic como un veredicto. «Cabina tres. Con traba, sin cerrojo. Si escucho algo que no le explicaría a mi madre, se van y la fila recibe un discurso. Dos minutos».', 'O MIKA destampa uma caneta com um clique feito veredito. «Cabine três. Trancada, sem trinco. Se eu ouvir algo que não explicaria pra minha mãe, vocês estão fora e a fila ganha um discurso. Dois minutos».'),
        do: { open: 'host', flag: 'host_ok_group', soc: 2 }
      },
      ok_lie: {
        text: T('MIKA looks at you for four full seconds. "Sick. Okay. Stall three. I will be listening, and I will know."', 'MIKA te mira cuatro segundos completos. «Enfermo. Bueno. Cabina tres. Voy a estar escuchando, y lo voy a saber».', 'O MIKA te olha por quatro segundos inteiros. «Passando mal. Tá. Cabine três. Vou estar ouvindo, e vou saber».'),
        do: { open: 'host', flag: ['host_ok_group', 'host_lied'] }
      },
      fail: {
        text: T('"One person per stall. That is the rule, and rules are what keeps this room from becoming a documentary."', '«Una persona por cabina. Esa es la regla, y las reglas son lo que impide que este baño se convierta en un documental».', '«Uma pessoa por cabine. Essa é a regra, e as regras evitam que esta sala vire um documentário».'),
        choices: [
          { tone: 'chill', t: T('"Okay. Let me rephrase."', '«Bien. Déjame reformular».', '«Tá. Deixa eu reformular».'), next: 'a', do: { soc: -1 } },
          { tone: 'plan', t: T('"Fine. Maru goes alone."', '«Bien. Maru va sola».', '«Tá. A Maru vai sozinha».'), next: 'split' }
        ]
      },
      split: {
        text: T('"Smart. Stall three. One person. Everyone else against that wall, please, and look at the ceiling like adults."', '«Inteligente. Cabina tres. Una persona. Los demás contra esa pared, por favor, y miren al techo como adultos».', '«Inteligente. Cabine três. Uma pessoa. Os outros encostados naquela parede, por favor, e olhando pro teto feito adultos».'),
        do: { open: 'host', flag: 'host_split', soc: 1 }
      }
    }
  };

  /* ------------------------------------------------------------ THE STALL */
  S.stall_scene = function () {
    const s = EM.state;
    if (s.flags.host_ok_group) U.startDialogue('stall_group', {});
    else U.startDialogue('stall_split', {});
  };

  D.stall_split = {
    forced: true, who: 'maru', start: 'a', nodes: {
      a: {
        text: [
          T('Maru goes in. You, Dani and Tato stand against the wall, looking at the ceiling like adults. Behind the door: relief like a small choir.', 'Maru entra. Tú, Dani y Tato esperan contra la pared, mirando al techo como adultos. Detrás de la puerta: un alivio como un pequeño coro.', 'A Maru entra. Você, o Dani e o Tato ficam encostados na parede, olhando pro teto feito adultos. Atrás da porta: um alívio como um pequeno coro.'),
          T('DANI, whispering, grinning, bouncing on his heels: "Okay okay okay. Look what I got."', 'DANI, susurrando, sonriendo, rebotando en los talones: «Ok ok ok. Mira lo que conseguí».', 'DANI, sussurrando, sorrindo, quicando nos calcanhares: «Tá tá tá. Olha o que eu consegui».')
        ],
        do: { call: 'stall_pill_node' },
        next: 'pill'
      },
      pill: { branch: [{ req: function () { return true; }, to: 'pill_a' }] },
      pill_a: {
        who: 'dani',
        text: T('He opens his palm. A pale pill, a little crown stamped on it. "A guy in the queue outside sold it to me. Said it is the good stuff. I have never been so happy or so scared."', 'Abre la palma. Una pastilla pálida con una coronita estampada. «Un tipo de la fila de afuera me la vendió. Dijo que es de la buena. Nunca estuve tan feliz ni tan asustado».', 'Abre a palma. Um comprimido pálido, com uma coroinha estampada. «Um cara da fila lá fora me vendeu. Disse que é do bom. Nunca fiquei tão feliz nem tão assustado».'),
        choices: [
          { tone: 'ask', t: T('"Who sold you that? What\'s in it?"', '«¿Quién te la vendió? ¿Qué tiene?»', '«Quem te vendeu? O que tem nisso?»'), next: 'ask' },
          { tone: 'care', t: T('"We should get it checked. The quiet room has a table."', '«Deberíamos hacerla chequear. La sala tranquila tiene una mesa».', '«A gente devia mandar checar. A sala de calma tem uma mesa».'), req: { flag: 'quiet_known' }, do: { bond: { dani: 1 }, flag: 'plan_test' }, next: 'agree' },
          { tone: 'care', t: T('"We should get it checked. Is there a table for that?"', '«Deberíamos hacerla chequear. ¿Hay una mesa para eso?»', '«A gente devia mandar checar. Tem alguma mesa pra isso?»'), req: { no: 'quiet_known' }, do: { bond: { dani: 1 }, flag: 'plan_test' }, next: 'agree' },
          { tone: 'yes', t: T('"Let\'s do it. Half each."', '«Hagámoslo. La mitad cada uno».', '«Vamos. Metade pra cada um».'), do: { weird: 3 }, call: 'take_pill_untested', next: null },
          { tone: 'no', t: T('"Put that away. Not here, not like this."', '«Guárdalo. Aquí no, así no».', '«Guarda isso. Aqui não, assim não».'), do: { bond: { dani: -1 }, flag: 'dani_insists' }, next: 'no' }
        ]
      },
      ask: {
        who: 'dani',
        text: T('"He said MDMA. He said a lot of things. He said it\'s \'clean\'. He had a really nice jacket." Dani looks at the pill like it might answer for itself.', '«Dijo MDMA. Dijo muchas cosas. Dijo que es “limpia”. Tenía una chaqueta muy linda». Dani mira la pastilla como si pudiera responder por sí misma.', '«Disse MDMA. Disse um monte de coisa. Disse que é “limpo”. Tinha uma jaqueta muito legal». O Dani olha pro comprimido como se ele pudesse responder por si.'),
        choices: [
          { tone: 'care', t: T('"A nice jacket is not an ingredient list. Let\'s get it checked."', '«Una chaqueta linda no es una lista de ingredientes. Hagámosla chequear».', '«Uma jaqueta bonita não é lista de ingredientes. Vamos mandar checar».'), do: { bond: { dani: 1 }, flag: 'plan_test' }, next: 'agree' },
          { tone: 'yes', t: T('"…Fine. Half each. Trust the jacket."', '«…Bueno. La mitad cada uno. Confiemos en la chaqueta».', '«…Tá. Metade cada um. Confia na jaqueta».'), do: { weird: 3 }, call: 'take_pill_untested', next: null },
          { tone: 'no', t: T('"No. Put it away."', '«No. Guárdalo».', '«Não. Guarda isso».'), do: { bond: { dani: -1 }, flag: 'dani_insists' }, next: 'no' }
        ]
      },
      agree: {
        who: 'dani',
        text: T('"Checked. Okay. Yes. Responsible. We are responsible people!" He pockets the pill very carefully, like a tiny, expensive bird.', '«Chequeada. Ok. Sí. Responsables. ¡Somos gente responsable!» Se guarda la pastilla con muchísimo cuidado, como un pajarito caro.', '«Checado. Tá. Sim. Responsáveis. A gente é gente responsável!» Ele guarda o comprimido com muito cuidado, como um passarinho caro.'),
        do: { quest: { q3: 'done', q4: 'done', q5: 'active' }, at: 200, flag: ['pill_known'] }
      },
      no: {
        who: 'dani',
        text: T('"Okay. Okay. Fine." He pockets it. "But it\'s mine, and I\'m taking it before sunrise. So maybe you want to help me make that a good idea?"', '«Ok. Ok. Bueno». Se la guarda. «Pero es mía, y me la voy a tomar antes del amanecer. ¿Y si me ayudas a que sea una buena idea?»', '«Tá. Tá. Beleza». Ele guarda. «Mas é meu, e vou tomar antes do amanhecer. Então talvez você queira me ajudar a fazer disso uma boa ideia?»'),
        do: { quest: { q3: 'done', q4: 'done', q5: 'active' }, at: 200, flag: ['pill_known'] }
      }
    }
  };
  S.stall_pill_node = function () { /* marker so the story flow knows the pill has been revealed */ };

  D.stall_group = {
    forced: true, who: 'maru', after: 'rosa_start', start: 'a', nodes: {
      a: {
        text: [
          T('Stall three. A single toilet, three or four people, zero dignity. Maru sits. Dani leans against the door. Tato\'s breathing is a bellows. Your elbow is inside a coat hook.', 'Cabina tres. Un solo inodoro, tres o cuatro personas, cero dignidad. Maru se sienta. Dani se apoya contra la puerta. La respiración de Tato es un fuelle. Tu codo está dentro de un perchero.', 'Cabine três. Um único vaso, três ou quatro pessoas, zero dignidade. A Maru senta. O Dani encosta na porta. A respiração do Tato é um fole. Seu cotovelo está dentro de um cabide.'),
          T('MARU: "Nobody. Look. At me."', 'MARU: «Nadie. Me. Mire».', 'MARU: «Ninguém. Olha. Pra mim».')
        ],
        choices: [
          { tone: 'chill', t: T('Hum loudly, eyes fixed on the ceiling.', 'Tararear fuerte, ojos fijos en el techo.', 'Cantarolar alto, olhos fixos no teto.'), do: { soc: 1 }, next: 'pill', react: T('You hum the national anthem of nowhere. Maru laughs so hard she has to stop.', 'Tarareas el himno nacional de ninguna parte. Maru se ríe tanto que tiene que parar.', 'Você cantarola o hino nacional de lugar nenhum. A Maru ri tanto que precisa parar.') },
          { tone: 'joke', t: T('Narrate it like a sports commentator, whispered.', 'Narrarlo como comentarista deportivo, susurrando.', 'Narrar como comentarista esportivo, sussurrando.'), do: { fun: 4, bond: { maru: 1, dani: 1 } }, next: 'pill', react: T('"And she\'s going for it, folks — Dani, I need you to be professional — and — YES. The crowd goes wild."', '«Y va por ella, señores — Dani, te necesito profesional — y — SÍ. El público enloquece».', '«E ela vai pra cima, senhores — Dani, preciso que você seja profissional — e — SIM. A torcida vai à loucura».') },
          { tone: 'care', t: T('Hold the door shut with your back. "I\'ve got the door."', 'Sostener la puerta con la espalda. «Yo cuido la puerta».', 'Segurar a porta com as costas. «Eu seguro a porta».'), do: { bond: { maru: 1 }, soc: 1 }, next: 'pill' }
        ]
      },
      pill: {
        who: 'dani',
        text: T('DANI, bouncing, whispering: "Okay okay okay. While nobody can see — look what I got." He opens his palm. A pale pill with a tiny crown stamped on it. "A guy in the queue outside sold it to me. Said it\'s the good stuff. I have never been so happy or so scared."', 'DANI, rebotando, susurrando: «Ok ok ok. Mientras nadie ve — mira lo que conseguí». Abre la palma. Una pastilla pálida con una coronita estampada. «Un tipo de la fila de afuera me la vendió. Dijo que es de la buena. Nunca estuve tan feliz ni tan asustado».', 'DANI, quicando, sussurrando: «Tá tá tá. Enquanto ninguém vê — olha o que eu consegui». Abre a palma. Um comprimido pálido com uma coroinha estampada. «Um cara da fila lá fora me vendeu. Disse que é do bom. Nunca fiquei tão feliz nem tão assustado».'),
        do: { flag: 'pill_known' },
        choices: [
          { tone: 'ask', t: T('"Who sold you that? What\'s in it?"', '«¿Quién te la vendió? ¿Qué tiene?»', '«Quem te vendeu? O que tem nisso?»'), next: 'ask' },
          { tone: 'care', t: T('"We should get it checked. The quiet room has a table."', '«Deberíamos hacerla chequear. La sala tranquila tiene una mesa».', '«A gente devia mandar checar. A sala de calma tem uma mesa».'), req: { flag: 'quiet_known' }, do: { bond: { dani: 1 }, flag: 'plan_test' }, next: 'tato' },
          { tone: 'care', t: T('"We should get it checked. Is there a table for that?"', '«Deberíamos hacerla chequear. ¿Hay una mesa para eso?»', '«A gente devia mandar checar. Tem alguma mesa pra isso?»'), req: { no: 'quiet_known' }, do: { bond: { dani: 1 }, flag: 'plan_test' }, next: 'tato' },
          { tone: 'yes', t: T('"Let\'s do it. Half each."', '«Hagámoslo. La mitad cada uno».', '«Vamos. Metade pra cada um».'), do: { weird: 4 }, call: 'take_pill_untested', next: 'tato' },
          { tone: 'no', t: T('"Put that away. Not in here, not like this."', '«Guárdalo. Aquí no, así no».', '«Guarda isso. Aqui não, assim não».'), do: { bond: { dani: -1 }, flag: 'dani_insists' }, next: 'tato' }
        ]
      },
      ask: {
        who: 'dani',
        text: T('"He said MDMA. He said a lot of things. He said it\'s \'clean\'. He had a really nice jacket."', '«Dijo MDMA. Dijo muchas cosas. Dijo que es “limpia”. Tenía una chaqueta muy linda».', '«Disse MDMA. Disse um monte de coisa. Disse que é “limpo”. Tinha uma jaqueta muito legal».'),
        choices: [
          { tone: 'care', t: T('"A nice jacket is not an ingredient list. Get it checked."', '«Una chaqueta linda no es una lista de ingredientes. Hay que chequearla».', '«Jaqueta bonita não é lista de ingredientes. Tem que checar».'), do: { bond: { dani: 1 }, flag: 'plan_test' }, next: 'tato' },
          { tone: 'yes', t: T('"…Fine. Half each. Trust the jacket."', '«…Bueno. La mitad cada uno. Confiemos en la chaqueta».', '«…Tá. Metade cada um. Confia na jaqueta».'), do: { weird: 4 }, call: 'take_pill_untested', next: 'tato' },
          { tone: 'no', t: T('"No. Put it away."', '«No. Guárdalo».', '«Não. Guarda isso».'), do: { bond: { dani: -1 }, flag: 'dani_insists' }, next: 'tato' }
        ]
      },
      tato: {
        who: 'tato',
        text: T('In the corner by the bin, Tato has stopped breathing the way people breathe. Quick, shallow, his hand flat on his chest. "I\'m fine. I\'m fine. It\'s just— small. And loud. And I can\'t—"', 'En la esquina junto al bote de basura, Tato dejó de respirar como respira la gente. Rápido, corto, la mano plana en el pecho. «Estoy bien. Estoy bien. Es solo… chico. Y ruidoso. Y no puedo—»', 'No canto perto da lixeira, o Tato parou de respirar como as pessoas respiram. Rápido, curto, a mão espalmada no peito. «Tô bem. Tô bem. É só… pequeno. E barulhento. E eu não consigo—»'),
        choices: [
          { tone: 'care', t: T('Breathe with him. In, out. Slow. "Follow me."', 'Respirar con él. Adentro, afuera. Lento. «Sígueme».', 'Respirar com ele. Entra, sai. Devagar. «Me acompanha».'), call: 'stall_breath', do: { flag: 'breath_pending' }, next: null, free: true },
          { tone: 'water', t: T('Hand him your water bottle.', 'Darle tu botella de agua.', 'Passar sua garrafa de água pra ele.'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, bond: { tato: 1 }, flag: 'tato_water' }, next: 'tato2', react: T('He drinks, holds the bottle with both hands like a warm cup. Some of the shaking leaves his shoulders.', 'Toma, sostiene la botella con las dos manos como una taza tibia. Parte del temblor sale de sus hombros.', 'Ele bebe, segura a garrafa com as duas mãos como uma xícara quente. Parte do tremor sai dos ombros.') },
          { tone: 'blunt', t: T('"Relax, bro. It\'s a toilet."', '«Relájate, bro. Es un baño».', '«Relaxa, mano. É um banheiro».'), do: { bond: { tato: -2 }, soc: -2, flag: 'tato_rough' }, next: 'knock', bad: true, react: T('Tato\'s face closes like a shop at night. "…Right. Sorry."', 'La cara de Tato se cierra como un local de noche. «…Claro. Perdón».', 'O rosto do Tato fecha como uma loja à noite. «…Certo. Desculpa».') }
        ]
      },
      tato2: {
        who: 'tato',
        text: T('"Can you — can you stay close to me? Just for a few minutes." His breathing is still ragged, but there is a floor under it now.', '«¿Puedes — puedes quedarte cerca de mí? Solo unos minutos». Su respiración sigue entrecortada, pero ahora hay un piso debajo.', '«Você pode — pode ficar perto de mim? Só uns minutos». A respiração dele ainda tá ofegante, mas agora tem um chão embaixo.'),
        choices: [
          { tone: 'care', t: T('Breathe with him. In, out. Slow.', 'Respirar con él. Adentro, afuera. Lento.', 'Respirar com ele. Entra, sai. Devagar.'), call: 'stall_breath', do: { flag: 'breath_pending' }, next: null, free: true },
          { tone: 'chill', t: T('"Right here. Not going anywhere."', '«Aquí mismo. No me voy a ninguna parte».', '«Aqui mesmo. Não vou a lugar nenhum».'), do: { bond: { tato: 1 }, flag: 'tato_calm' }, next: 'knock' }
        ]
      },
      knock: {
        text: [
          T('Knock. Knock. Three flat knocks of a mop handle on the stall door. A voice that has no hurry in it at all:', 'Toc. Toc. Tres golpes planos de un palo de trapeador en la puerta de la cabina. Una voz que no tiene ninguna prisa:', 'Toc. Toc. Três batidas secas de um cabo de esfregão na porta da cabine. Uma voz sem nenhuma pressa:'),
          T('"Whoever is in there. All of you. Come out one at a time, like a family leaving a plane."', '«Quien esté ahí. Todos. Salgan de a uno, como una familia que baja de un avión».', '«Quem estiver aí. Todos. Saiam um de cada vez, feito uma família descendo de um avião».')
        ],
        do: { quest: { q3: 'done', q4: 'active' }, at: 205 }
      }
    }
  };
  S.stall_breath = function () {
    const s = EM.state;
    U.breathing(function (res) {
      if (res === 'calm') {
        L.apply({ care: 1, bond: { tato: 2 }, flag: 'tato_calm' });
        U.toast({ icon: 'breath', text: T('His shoulders drop an inch. "Okay. Okay. That helped."', 'Sus hombros bajan un centímetro. «Ok. Ok. Eso ayudó».', 'Os ombros dele descem um centímetro. «Tá. Tá. Isso ajudou».'), kind: 'good' });
      } else {
        L.apply({ bond: { tato: 0 }, flag: 'tato_rough', soc: -2 });
        U.toast({ text: T('It doesn\'t quite land. He pushes through the door, breathing hard, and waits for you outside.', 'No termina de funcionar. Atraviesa la puerta respirando fuerte y te espera afuera.', 'Não pega direito. Ele empurra a porta, respirando forte, e espera você do lado de fora.'), kind: 'bad' });
      }
      delete s.flags.breath_pending;
      if (s.quests.q3 === 'active') EM.hooks.script('stall_knock');
    }, 'tato');
  };
  S.stall_knock = function () { U.startDialogue('stall_knock', {}); };
  D.stall_knock = {
    forced: true, after: 'rosa_start', start: 'a', nodes: {
      a: {
        text: [
          T('Knock. Knock. Three flat knocks of a mop handle on the stall door. A voice that has no hurry in it at all:', 'Toc. Toc. Tres golpes planos de un palo de trapeador en la puerta de la cabina. Una voz que no tiene ninguna prisa:', 'Toc. Toc. Três batidas secas de um cabo de esfregão na porta da cabine. Uma voz sem nenhuma pressa:'),
          T('"Whoever is in there. All of you. Come out one at a time, like a family leaving a plane."', '«Quien esté ahí. Todos. Salgan de a uno, como una familia que baja de un avión».', '«Quem estiver aí. Todos. Saiam um de cada vez, feito uma família descendo de um avião».')
        ],
        do: { quest: { q3: 'done', q4: 'active' }, at: 205 }
      }
    }
  };

  /* ------------------------------------------------------------ pill taken without testing */
  S.take_pill_untested = function () {
    const s = EM.state;
    /* the pill's true nature is decided now, silently */
    S.decidePill();
    s.pill.taken = true; s.pill.tested = false; s.pill.skipTest = true;
    L.apply({ quest: { q5: 'done' }, flag: ['pill_known', 'pill_skip_test', 'dani_took'] });
    S.applyPillEffects('you', true);
  };

  /* ------------------------------------------------------------ ROSA */
  S.rosa_start = function () {
    if (EM.state.flags.breath_pending) return;
    /* the stall scene is over; Rosa is waiting by the stalls */
    U.startDialogue('rosa_confront', { npc: 'rosa' });
  };

  D.rosa_wait = {
    who: 'rosa', role: T('CLEANING', 'LIMPIEZA', 'LIMPEZA'), start: 'a', nodes: {
      a: {
        text: T('"Mind the wet floor." Rosa works the mop in slow figure eights, the way a person does a thing they have done ten thousand times. She does not look up, but she is aware of everything in the room.', '«Cuidado con el piso mojado». Rosa pasa el trapeador en ochos lentos, como quien hace algo que ya hizo diez mil veces. No levanta la vista, pero está consciente de todo en el cuarto.', '«Cuidado com o piso molhado». A Rosa passa o esfregão em oitos lentos, do jeito de quem fez algo dez mil vezes. Não levanta o olhar, mas percebe tudo na sala.'),
        choices: [
          { tone: 'chill', t: T('"Thank you for doing this. This room would not survive without you."', '«Gracias por hacer esto. Este baño no sobreviviría sin ti».', '«{Obrigado|Obrigada|Valeu} por fazer isso. Este banheiro não sobreviveria sem você».'), do: { soc: 2, flag: 'rosa_thanked', care: 0 }, next: null, react: T('She stops mopping for half a second. "Nobody says that." Then she continues, and the speed of the mop is a little different.', 'Deja de trapear medio segundo. «Nadie dice eso». Luego sigue, y la velocidad del trapeador es un poco distinta.', 'Ela para de esfregar por meio segundo. «Ninguém diz isso». Depois continua, e a velocidade do esfregão fica um pouco diferente.') },
          { tone: 'silent', t: T('Step around the wet patch.', 'Esquivar el charco.', 'Desviar da poça.'), free: true, next: null }
        ]
      }
    }
  };
  D.rosa_again = {
    who: 'rosa', role: T('CLEANING', 'LIMPIEZA', 'LIMPEZA'), start: 'a', nodes: {
      a: {
        branch: [
          { req: { flag: 'rosa_ally' }, to: 'ally' },
          { req: { flag: 'rosa_angry' }, to: 'angry' },
          { req: { flag: 'rosa_met' }, to: 'neutral' },
          { req: function () { return true; }, to: 'rosa_w' }
        ]
      },
      rosa_w: { text: T('"Mind the wet floor."', '«Cuidado con el piso mojado».', '«Cuidado com o piso molhado».') },
      ally: {
        text: T('"{name}. Come in, come in. Don\'t touch anything that isn\'t yours." Rosa nods at the door marked STAFF ONLY and then at the sinks. "Water\'s cold. Take your time."', '«{name}. Pasa, pasa. No toques nada que no sea tuyo». Rosa asiente hacia la puerta de STAFF y luego hacia los lavamanos. «El agua está fría. Tómate tu tiempo».', '«{name}. Entra, entra. Não toque em nada que não seja seu». A Rosa acena pra porta de STAFF ONLY e depois pras pias. «A água tá gelada. Fique à vontade».'),
        choices: [
          { tone: 'chill', t: T('"Thank you, Rosa."', '«Gracias, Rosa».', '«{Obrigado|Obrigada|Valeu}, Rosa».'), do: { soc: 2 }, next: null },
          { tone: 'ask', t: T('"Anything I can do to help?"', '«¿Algo en que pueda ayudar?»', '«Posso ajudar em alguma coisa?»'), next: 'help' }
        ]
      },
      help: {
        text: T('She almost smiles. "There is a bucket by the third stall. If somebody out there is sick, you tell me first. That is the whole job: tell me first."', 'Casi sonríe. «Hay un balde junto a la tercera cabina. Si alguien allá afuera se siente mal, me avisas primero. Ese es todo el trabajo: avísame primero».', 'Ela quase sorri. «Tem um balde perto da terceira cabine. Se alguém lá fora passar mal, você me avisa primeiro. Esse é o trabalho todo: me avisa primeiro».'),
        do: { fun: 1, soc: 2 }
      },
      angry: {
        text: T('Rosa does not look at you. She says only: "Floor\'s wet." It is the loudest sentence in the building.', 'Rosa no te mira. Dice solo: «Piso mojado». Es la frase más fuerte del edificio.', 'A Rosa não te olha. Diz só: «Piso molhado». É a frase mais alta do prédio.'),
        do: { soc: -1 }
      },
      neutral: {
        text: T('"{name}. Wipe your feet. Come on."', '«{name}. Límpiate los pies. Vamos».', '«{name}. Limpe os pés. Vamos».'),
        choices: [
          { tone: 'chill', t: T('"Sorry about before."', '«Perdón por lo de antes».', '«Desculpa por antes».'), do: { soc: 1 }, next: null }
        ]
      }
    }
  };

  D.rosa_confront = {
    forced: true, who: 'rosa', role: T('CLEANING', 'LIMPIEZA', 'LIMPEZA'), start: 'a', nodes: {
      a: {
        text: [
          T('You file out in order. Rosa is holding the mop like a staff, one eyebrow at the height of an interrogation. She counts you with her chin.', 'Salen en fila. Rosa sostiene el trapeador como un cayado, una ceja a la altura de un interrogatorio. Los cuenta con el mentón.', 'Vocês saem em fila. A Rosa segura o esfregão como um cajado, uma sobrancelha na altura de um interrogatório. Ela conta vocês com o queixo.'),
          T('"Three. Four? I stopped counting. I have been in this room for nine hours. I have found everything in these stalls. EVERYTHING. A first today: a family reunion."', '«Tres. ¿Cuatro? Dejé de contar. Llevo nueve horas en este baño. He encontrado de todo en estas cabinas. DE TODO. Hoy, una primera vez: una reunión familiar».', '«Três. Quatro? Parei de contar. Tô há nove horas nesta sala. Já encontrei de tudo nessas cabines. DE TUDO. Hoje, uma estreia: reunião de família».')
        ],
        do: { flag: 'rosa_met' },
        choices: [
          { tone: 'honest', t: T('"We\'re sorry. One of us was panicking and we didn\'t want to leave him alone."', '«Lo sentimos. Uno de nosotros estaba en pánico y no queríamos dejarlo solo».', '«A gente sente muito. Um de nós tava em pânico e a gente não queria deixar sozinho».'), req: { any: ['tato_checked', 'tato_calm', 'tato_water', 'tato_rough'] }, next: 'honest' },
          { tone: 'honest', t: T('"Maru had to pee, and we move together. We should have thought about you."', '«Maru tenía que hacer pipí y nos movemos juntos. Deberíamos haber pensado en ti».', '«A Maru precisava fazer xixi e a gente se move junto. A gente devia ter pensado em você».'), next: 'honest' },
          { tone: 'care', t: T('"Have you had any water today? Please, take this."', '«¿Tomaste agua hoy? Por favor, toma esto».', '«Você bebeu água hoje? Por favor, pega isso».'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, flag: 'rosa_water' }, next: 'warm' },
          { tone: 'care', t: T('"Let us help you clean up. We left it tidy, but let us check."', '«Déjanos ayudarte a limpiar. Lo dejamos ordenado, pero déjanos revisar».', '«Deixa a gente ajudar a limpar. A gente deixou arrumado, mas deixa conferir».'), do: { care: 1, time: 5, soc: -1, flag: 'rosa_helped_clean' }, next: 'warm' },
          { tone: 'joke', t: T('"Team-building exercise."', '«Ejercicio de integración de equipo».', '«Dinâmica de integração de equipe».'), next: 'joke' },
          { tone: 'lie', t: T('"It was just me and my friend. These two were waiting."', '«Éramos solo yo y mi amigo. Estos dos esperaban».', '«Era só eu e meu amigo. Esses dois estavam esperando».'), do: { weird: 5, soc: -2, flag: 'rosa_lied' }, next: 'cold' },
          { tone: 'blunt', t: T('"It\'s a toilet. Relax."', '«Es un baño. Relájate».', '«É um banheiro. Relaxa».'), do: { weird: 15, soc: -5, flag: 'rosa_angry' }, next: 'angry', bad: true }
        ]
      },
      honest: {
        text: [
          T('Something in Rosa\'s shoulders drops a centimetre. "Fine. Fine. That, I understand."', 'Algo en los hombros de Rosa baja un centímetro. «Bien. Bien. Eso lo entiendo».', 'Algo nos ombros da Rosa desce um centímetro. «Tá. Tá. Isso eu entendo».'),
          T('"Here\'s what I need. Leave it clean. Tell me if anybody is sick. And never lock a door on someone who is not okay. It is not the number of people. It is the mess, and whether anyone is dying in my stall."', '«Esto es lo que necesito. Déjenlo limpio. Avísenme si alguien se siente mal. Y nunca le echen traba a una puerta con alguien que no está bien. No es la cantidad de gente. Es el desorden, y si alguien se está muriendo en mi cabina».', '«O que eu preciso é isso. Deixem limpo. Me avisem se alguém passar mal. E nunca tranquem uma porta com alguém que não está bem. Não é a quantidade de gente. É a bagunça, e se alguém tá morrendo na minha cabine».')
        ],
        choices: [
          { tone: 'honest', t: T('"Understood. And — one of us has a pill we\'re going to get checked. We haven\'t taken anything."', '«Entendido. Y — uno de nosotros tiene una pastilla que vamos a hacer chequear. No tomamos nada».', '«Entendido. E — um de nós tem um comprimido que vamos mandar checar. A gente não tomou nada».'), req: { flag: 'plan_test' }, do: { soc: -1, flag: ['rosa_honest', 'rosa_ally'] }, next: 'ally' },
          { tone: 'honest', t: T('"Understood. Thank you for not throwing us out."', '«Entendido. Gracias por no echarnos».', '«Entendido. {Obrigado|Obrigada|Valeu} por não nos expulsar».'), do: { flag: 'rosa_ok' }, next: 'ok' },
          { tone: 'ask', t: T('"Was it okay? Anything you want us to do?"', '«¿Estuvo bien? ¿Algo que quieras que hagamos?»', '«Tudo bem? Quer que a gente faça alguma coisa?»'), do: { care: 1 }, next: 'warm' }
        ]
      },
      warm: {
        text: T('Rosa looks at you for a long time, the way you look at a plant that surprised you. "…Twenty years of this. You know how many people ask how I am? Come here. Don\'t touch anything that isn\'t yours."', 'Rosa te mira un buen rato, como se mira una planta que te sorprendió. «…Veinte años de esto. ¿Sabes cuánta gente pregunta cómo estoy? Ven. No toques nada que no sea tuyo».', 'A Rosa te olha por muito tempo, do jeito que se olha uma planta que te surpreendeu. «…Vinte anos disso. Sabe quanta gente pergunta como eu estou? Vem. Não toque em nada que não seja seu».'),
        do: { flag: ['rosa_ally', 'rosa_warm'], soc: 4, fun: 3 },
        next: 'ally'
      },
      ally: {
        text: T('She nods at a grey door beside the sinks marked STAFF ONLY. "That goes behind the stage. Ask me nicely, and I leave it open for you. If the night gets too big, it is the only quiet corridor in the building. And — if anyone is carrying anything: Isi, in the quiet room. A table, a notebook, no names."', 'Hace un gesto hacia una puerta gris junto a los lavamanos con el cartel STAFF ONLY. «Esa va detrás del escenario. Pídemelo bien y te la dejo abierta. Si la noche se pone muy grande, es el único pasillo tranquilo del edificio. Y — si alguien lleva algo: Isi, en la sala tranquila. Una mesa, un cuaderno, sin nombres».', 'Ela acena pra uma porta cinza ao lado das pias com a placa STAFF ONLY. «Essa vai pra trás do palco. Peça com educação e eu deixo aberta. Se a noite ficar grande demais, é o único corredor calmo do prédio. E — se alguém tiver trazendo alguma coisa: Isi, na sala de calma. Uma mesa, um caderno, sem nomes».'),
        do: { flag: ['rosa_ally', 'quiet_known'], quest: { q4: 'done', q5: 'active' }, at: 215 }
      },
      ok: {
        text: T('"Good. Then we are done." She holds the door open for you with her mop like a velvet rope. "And do not tell me anything I would have to unhear."', '«Bien. Entonces terminamos». Te sostiene la puerta con el trapeador como a un cordón de terciopelo. «Y no me cuenten nada que luego tenga que desoír».', '«Bom. Então terminamos». Ela segura a porta pra você com o esfregão feito um cordão de veludo. «E não me contem nada que eu depois precise desouvir».'),
        do: { quest: { q4: 'done', q5: 'active' }, at: 212 }
      },
      joke: {
        branch: [
          { req: { max: { weird: 40 }, min: { soc: 20 } }, to: 'joke_ok' },
          { req: function () { return true; }, to: 'joke_bad' }
        ]
      },
      joke_ok: {
        text: T('One corner of her mouth moves. "Team building. In my toilet. At two in the morning." She breathes out through her nose. "Next time you build a team, do it in the corridor. Go on. Out."', 'Una comisura de su boca se mueve. «Integración de equipo. En mi baño. A las dos de la mañana». Exhala por la nariz. «La próxima vez que integres un equipo, hazlo en el pasillo. Vamos. Afuera».', 'Um canto da boca dela se mexe. «Integração de equipe. No meu banheiro. Às duas da manhã». Ela expira pelo nariz. «Da próxima vez que integrar uma equipe, faça no corredor. Vai. Fora».'),
        do: { flag: 'rosa_ok', fun: 3, quest: { q4: 'done', q5: 'active' }, at: 212 }
      },
      joke_bad: {
        text: T('She does not laugh. "I have a mop. You have a punchline. One of us is going to be wet by the end of this."', 'No se ríe. «Yo tengo un trapeador. Tú tienes un chiste. Alguno de los dos va a terminar mojado».', 'Ela não ri. «Eu tenho um esfregão. Você tem uma piada. Um de nós vai terminar molhado».'),
        do: { weird: 5, soc: -3, flag: 'rosa_cold', quest: { q4: 'done', q5: 'active' }, at: 212 }
      },
      cold: {
        text: T('Rosa counts, slowly, on her fingers. "Me and my friend. And two waiting. I know what I saw. I have been in this room longer than you have been legal." She lets it hang. "Out. All of you. Wash your hands."', 'Rosa cuenta despacio con los dedos. «Yo y mi amigo. Y dos esperando. Sé lo que vi. Llevo en este baño más tiempo del que tú llevas siendo legal». Lo deja flotar. «Afuera. Todos. Lávense las manos».', 'A Rosa conta devagar nos dedos. «Eu e meu amigo. E dois esperando. Sei o que vi. Tô nesta sala há mais tempo do que você é maior de idade». Deixa pairar. «Fora. Todos. Lavem as mãos».'),
        do: { flag: 'rosa_cold', quest: { q4: 'done', q5: 'active' }, at: 212 }
      },
      angry: {
        text: [
          T('Rosa does not raise her voice. That is how you know. She lifts one hand and a radio crackles on her hip. "Ofelia. Third stall. Troublemaker. No, I will say it nicely: a person who needs to leave."', 'Rosa no levanta la voz. Así sabes que es grave. Levanta una mano y una radio crepita en su cadera. «Ofelia. Tercera cabina. Problemático. No, lo voy a decir bien: una persona que necesita irse».', 'A Rosa não levanta a voz. É assim que você sabe. Ela ergue uma mão e um rádio chia no quadril. «Ofelia. Terceira cabine. Encrenqueiro. Não, vou dizer com educação: uma pessoa que precisa sair».'),
          T('Ofelia arrives with a walk that ends conversations. She does not touch you. She only stands very close to where you are about to go. You are escorted out of the toilets, with your people behind you, to the main floor. Your name has been written in a very small book.', 'Ofelia llega con un andar que termina conversaciones. No te toca. Solo se pone muy cerca del lugar adonde vas a ir. Te acompañan fuera de los baños, con tu gente detrás, hasta la pista principal. Tu nombre quedó escrito en un libro muy pequeño.', 'A Ofelia chega com um andar que encerra conversas. Não te toca. Só fica muito perto do lugar pra onde você vai. Você é acompanhado pra fora dos banheiros, com sua galera atrás, até a pista principal. Seu nome foi escrito num livro muito pequeno.')
        ],
        do: { quest: { q4: 'done', q5: 'active' }, at: 212, goto: { zone: 'main', x: 42, y: 26, dir: 'l' } }
      }
    }
  };
})();

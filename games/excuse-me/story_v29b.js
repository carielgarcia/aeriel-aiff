/* EXCUSE ME — story v29, part 2: THE AFTER, the missions. GETTING THERE, HOUSE RULES, THE KITCHEN, THE PERSON IN THE BEDROOM, ONE MORE,
   THE KNOCK (the neighbours on every wall), THE QUESTION, and the three scenes that close the chapter. Every scene uses what the game
   already has: comedown, redose, overheating and alcohol (story_v28.js), the care dividend, bonds, seeded coins, the host rule. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui;
  const D = EM.DIALOGUES, S = EM.scripts, AF = EM.AF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const FR = ['maru', 'dani', 'tato'];
  const nm = function (f) { return EM.CAST[f].name; };
  const withF = function (f) { return function (s) { return L.hasFriend(f); }; };
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };

  /* ----- small scripts the dialogues call ----- */
  S.af_arrive = function () { EM.hooks.travel({ zone: 'a_living', x: 13, y: 13, dir: 'u' }); };
  S.af_rules = function () { U.startDialogue('af_rules', { npc: 'dot' }); };
  S.af_front = function () { U.startDialogue('af_front', {}); };
  S.af_set0 = function () { AF.vol(0); }; S.af_set1 = function () { AF.vol(1); }; S.af_set2 = function () { AF.vol(2); };
  S.af_vol0 = function () { AF.vol(0); AF.noise(-30); };
  S.af_dn15 = function () { AF.noise(-15); }; S.af_dn25 = function () { AF.noise(-25); }; S.af_dn30 = function () { AF.noise(-30); }; S.af_dn35 = function () { AF.noise(-35); };
  S.af_up8 = function () { AF.noise(10); };
  S.af_quiroga_down = function () { const s = EM.state; s.after.st = 3; s.after.vol = 0; AF.setNoise(s.after.noise * 0.1); };
  S.af_end_after = function () { setTimeout(function () { if (!EM.state.ended) L.end('after'); }, 200); };
  S.af_ask_rec = function () { U.startDialogue('af_anselm', { npc: 'anselm' }); };
  /* a pinch from Pasc's bag: MDMA stays the most fun; on a first dose still working it is a redose (story_v28.js) */
  S.af_bag_yes = function () {
    const s = EM.state, again = !!(s.fx.mdma > 0);
    L.startFx('mdma');
    s.flags.took_after = true;
    if (again) { s.flags.redosed = true; L.apply({ hp: -6, fun: 2 }); L.startFx('hot', 60); U.toast({ icon: 'skull', kind: 'bad', ms: 6500, text: t(`That is a second dose on a first that is still working. Your jaw locks and your temperature climbs. Water, air, a long sit.`, `Es una segunda dosis encima de una primera que sigue funcionando. Se te traba la mandíbula y sube la temperatura. Agua, aire, un rato sentado.`, `É uma segunda dose em cima de uma primeira que ainda tá funcionando. Sua mandíbula trava e a temperatura sobe. Água, ar, um bom tempo sentado.`) }); }
  };
  S.af_one_friends = function () {
    const s = EM.state;
    FR.forEach(function (f) {
      if (!L.hasFriend(f)) return;
      if ((s.bond[f] || 0) >= 2) { s.flags['one_back_' + f] = true; s.bond[f] += 1; }
      else s.flags['one_took_' + f] = true;
    });
  };
  S.af_maru_walk = function () { AF.sendHome('maru', 'buddy'); AF.noise(6); };
  S.af_maru_taxi = function () { AF.sendHome('maru', 'buddy'); };
  S.af_maru_dani = function () { AF.sendHome('maru', 'buddy'); AF.sendHome('dani', 'buddy'); };
  S.af_maru_alone = function () { AF.sendHome('maru', 'alone'); EM.state.flags.promised_text = true; };
  S.af_tato_home = function () { AF.sendHome('tato', 'buddy'); };
  S.af_tato_dani = function () { AF.sendHome('tato', 'buddy'); AF.sendHome('dani', 'buddy'); };

  /* ============================================================ 1. GETTING THERE */
  D.af_travel = {
    forced: true, who: 'anselm', role: t('THE GROUP CHAT', 'EL CHAT GRUPAL', 'O GRUPO'), start: 'a', nodes: {
      a: {
        text: [
          t(`Seven in the morning, a pavement the colour of wet cardboard. Your phone fills up with a group chat that is splitting down the middle.`, `Siete de la mañana, una vereda del color del cartón mojado. Tu celular se llena con un chat grupal que se parte por la mitad.`, `Sete da manhã, uma calçada da cor de papelão molhado. Seu celular enche com um grupo que se divide ao meio.`),
          t(`ANSELM: "taxi is expensive, Tomi has a car." TOMI: "I haven't slept since Thursday but I'm a great driver." DOT: "Please don't."`, `ANSELM: «el taxi es caro, Tomi tiene auto». TOMI: «no duermo desde el jueves pero manejo genial». DOT: «por favor no».`, `ANSELM: «táxi tá caro, o Tomi tem carro». TOMI: «não durmo desde quinta mas dirijo muito bem». DOT: «por favor não».`)
        ],
        choices: [
          K('care', t(`"Nobody drives tired. We split a taxi."`, `«Nadie maneja con sueño. Compartimos un taxi».`, `«Ninguém dirige com sono. A gente divide um táxi».`), { next: 'taxi' }),
          K('chill', t(`"It's ten minutes. We walk."`, `«Son diez minutos. Caminamos».`, `«São dez minutos. A gente anda».`), { req: { min: { hp: 40 } }, next: 'walk' }),
          K('bold', t(`"Sure, Tomi. Let's go."`, `«Dale, Tomi. Vamos».`, `«Bora, Tomi. Vamos».`), { next: 'lift' })
        ]
      },
      taxi: {
        text: t(`Four of you in a taxi, the driver's radio low, a fare split into thirds on someone's phone. Nobody has to be brave on the way. You watch the city wake up.`, `Cuatro en un taxi, la radio del chofer baja, la tarifa dividida en partes iguales en el celular de alguien. Nadie tiene que ser valiente en el camino. Miras la ciudad despertarse.`, `Quatro num táxi, o rádio do motorista baixinho, a corrida dividida em partes iguais no celular de alguém. Ninguém precisa ser corajoso no caminho. Você vê a cidade acordar.`),
        do: { care: 1, time: 25, soc: -2, pb: { maru: 1, dani: 1, tato: 1 }, flag: 'af_taxi' }, next: 'arrive'
      },
      walk: {
        text: t(`Ten minutes of cold light on wet streets, bakery smells, someone's shoes squeaking. It is tired and it is lovely. Fernando hugs a lamp post for a moment.`, `Diez minutos de luz fría sobre calles mojadas, olor a panadería, los zapatos de alguien que chillan. Es cansancio y es hermoso. Feña abraza un poste un momento.`, `Dez minutos de luz fria em ruas molhadas, cheiro de padaria, o tênis de alguém rangendo. É cansaço e é lindo. O Fernando abraça um poste por um instante.`),
        do: { fun: 4, hp: -3, time: 45, flag: 'af_walked' }, next: 'arrive'
      },
      lift: {
        text: t(`Tomi's car smells of energy drinks. His hands drum the wheel. His eyes keep closing, long enough to count.`, `El auto de Tomi huele a bebida energética. Sus manos tamborilean en el volante. Los ojos se le cierran, lo bastante para contar.`, `O carro do Tomi cheira a energético. As mãos dele tamborilam no volante. Os olhos fecham, tempo o bastante pra contar.`),
        choices: [
          K('honest', t(`Say it: "Not like this. A taxi, and I'll pay half."`, `Decirlo: «Así no. Un taxi, y yo pago la mitad».`, `Dizer: «Assim não. Um táxi, e eu pago metade».`), { do: { care: 1, soc: 3, time: 22, flag: ['af_taxi', 'tomi_slept'], pb: { maru: 1, dani: 1, tato: 1 } }, next: 'tomi' }),
          K('chill', t(`Get in anyway. It's ten minutes.`, `Subir igual. Son diez minutos.`, `Entrar assim mesmo. São dez minutos.`), { do: { hp: -8, soc: -4, time: 12, flag: 'tomi_drove' }, next: 'drove' })
        ]
      },
      tomi: {
        text: t(`Tomi hands you the keys without a fight. "You're right. I was going to say I'm fine, and I'm not." He curls up in the back seat of the taxi before it moves.`, `Tomi te entrega las llaves sin pelear. «Tienes razón. Iba a decir que estoy bien, y no lo estoy». Se hace un ovillo en el asiento trasero del taxi antes de que arranque.`, `O Tomi te entrega as chaves sem brigar. «Você tem razão. Eu ia dizer que tô bem, e não tô». Ele se enrosca no banco de trás do táxi antes de arrancar.`),
        next: 'arrive'
      },
      drove: {
        text: t(`At a red light Tomi's eyes close for one second too long. The car drifts. Somebody shouts. It stops. No one speaks for three streets, and no one has to.`, `En un semáforo en rojo, a Tomi se le cierran los ojos un segundo de más. El auto se desvía. Alguien grita. Se detiene. Nadie dice nada durante tres calles, y no hace falta.`, `Num sinal vermelho os olhos do Tomi fecham um segundo a mais. O carro desvia. Alguém grita. Para. Ninguém diz nada por três ruas, e não precisa.`),
        next: 'arrive'
      },
      arrive: {
        text: t(`Third floor, no lift, a door already open. Dot is in socks, Anselm is holding a record sleeve in both hands. "Welcome. Come in before the stairs hear you."`, `Tercer piso, sin ascensor, una puerta ya abierta. Dot está en calcetines, Anselm sostiene la funda de un disco con las dos manos. «Bienvenidos. Entren antes de que las escaleras los oigan».`, `Terceiro andar, sem elevador, uma porta já aberta. A Dot de meia, o Anselm segurando uma capa de disco com as duas mãos. «Bem-vindos. Entrem antes que a escada escute vocês».`),
        choices: [K('care', t(`Climb the last stairs.`, `Subir los últimos escalones.`, `Subir os últimos degraus.`), { free: true, do: { quest: { q_af1: 'done', q_af2: 'active' } }, call: 'af_arrive', next: null })]
      }
    }
  };

  /* ============================================================ 2. HOUSE RULES (the Æ000.X no-photos rule at living-room scale) */
  D.af_dot_door = {
    who: 'dot', role: t('HOST', 'ANFITRIONA', 'ANFITRIÃ'), start: 'a', nodes: {
      a: { text: t(`"Rules first, then coffee. It takes a minute."`, `«Primero las reglas, después el café. Toma un minuto».`, `«Primeiro as regras, depois o café. Leva um minuto».`), choices: [K('care', t(`Hear the rules.`, `Escuchar las reglas.`, `Ouvir as regras.`), { free: true, call: 'af_rules', next: null })] }
    }
  };
  D.af_rules = {
    forced: true, who: 'dot', role: t('HOST', 'ANFITRIONA', 'ANFITRIÃ'), start: 'a', nodes: {
      a: {
        text: [
          t(`Dot lines up the three rules like cutlery. "One: shoes off. Two: phones in the basket, no photos of anyone, ever. Three: ask before you touch Anselm's records, because he will cry and then he'll be very polite about it."`, `Dot alinea las tres reglas como cubiertos. «Una: zapatos afuera. Dos: celulares en la canasta, sin fotos de nadie, nunca. Tres: pregunta antes de tocar los discos de Anselm, porque va a llorar y después va a ser muy cortés».`, `A Dot alinha as três regras como talheres. «Uma: sapato fora. Duas: celular na cesta, sem fotos de ninguém, nunca. Três: pergunte antes de encostar nos discos do Anselm, porque ele vai chorar e depois vai ser muito educado».`),
          t(`Anselm, from behind the table: "I'll cry quietly. The walls are thin."`, `Anselm, detrás de la mesa: «Lloraré bajito. Las paredes son delgadas».`, `O Anselm, atrás da mesa: «Choro baixinho. As paredes são finas».`)
        ],
        choices: [
          K('care', t(`Put your phone in the basket. Shoes by the door.`, `Dejar el celular en la canasta. Zapatos junto a la puerta.`, `Pôr o celular na cesta. Sapato junto da porta.`), { do: { care: 1, soc: 2, flag: ['af_rules', 'phone_basket', 'mb_open'], quest: { q_af2: 'done', q_af3: 'active', q_af8: 'active' } }, next: 'ok' }),
          K('honest', t(`Keep the phone in your pocket, off, on your word.`, `Guardar el celular en el bolsillo, apagado, bajo tu palabra.`, `Guardar o celular no bolso, desligado, na palavra.`), { do: { soc: -1, flag: ['af_rules', 'phone_kept', 'mb_open'], quest: { q_af2: 'done', q_af3: 'active', q_af8: 'active' } }, next: 'pocket' }),
          K('bold', t(`Take one quick photo of the shoe pile. "It's art."`, `Sacar una foto rápida a la pila de zapatos. «Es arte».`, `Tirar uma foto rápida da pilha de sapatos. «É arte».`), { bad: true, do: { flag: ['af_rules', 'phone_basket', 'mb_open'], quest: { q_af2: 'done', q_af3: 'active', q_af8: 'active' } }, next: 'photo' })
        ]
      },
      ok: {
        text: [
          t(`"Thank you." Dot points down the hall. "Kitchen is through there, toast is a vocation. The room at the end is open for anyone who wants it, and it has its own rules. Ask me and I'll walk you in."`, `«Gracias». Dot señala el pasillo. «La cocina es por ahí, las tostadas son una vocación. La habitación del fondo está abierta para quien la quiera, con sus propias reglas. Pregúntame y te acompaño».`, `«Obrigada». A Dot aponta o corredor. «A cozinha é por ali, torrada é uma vocação. O quarto do fundo tá aberto pra quem quiser, com regras próprias. Me pergunta que eu te acompanho».`)
        ], next: null
      },
      pocket: {
        text: t(`"Then it stays there. If I see it out, it goes in the basket, no hard feelings." She smiles. "And the room at the end asks for phones at the door. Ask me and I'll walk you in."`, `«Entonces se queda ahí. Si lo veo afuera, va a la canasta, sin rencores». Sonríe. «Y la habitación del fondo pide celulares en la puerta. Pregúntame y te acompaño».`, `«Então fica aí. Se eu ver na mão, vai pra cesta, sem ressentimento». Ela sorri. «E o quarto do fundo pede celular na porta. Me pergunta que eu te acompanho».`),
        next: null
      },
      photo: {
        text: t(`Dot's hand closes over your phone before the screen lights. She drops it into the basket. She does not raise her voice, and she does not smile. "Not in here."`, `La mano de Dot se cierra sobre tu celular antes de que se encienda la pantalla. Lo deja en la canasta. No alza la voz, ni sonríe. «Aquí no».`, `A mão da Dot fecha sobre seu celular antes da tela acender. Ela larga na cesta. Não levanta a voz, e não sorri. «Aqui não».`),
        next: null
      }
    }
  };

  D.af_anselm = {
    who: 'anselm', role: t('HOST', 'ANFITRIÓN', 'ANFITRIÃO'), start: 'a', nodes: {
      a: {
        text: t(`Anselm has his hands flat on the table, guarding the records. "I'll play anything you ask for, as long as it's quiet. And if you want to hold one, ask me first."`, `Anselm tiene las manos planas sobre la mesa, cuidando los discos. «Pongo lo que me pidas, mientras sea bajito. Y si quieres tener uno en las manos, pregúntame primero».`, `O Anselm tem as mãos espalmadas na mesa, guardando os discos. «Toco o que você pedir, desde que seja baixinho. E se quiser segurar um, me pergunta antes».`),
        choices: [
          K('care', t(`"May I look through them? I'll ask for each one."`, `«¿Puedo mirarlos? Te pregunto por cada uno».`, `«Posso ver? Eu pergunto por cada um».`), { req: NFlag('rec_ok'), do: { flag: 'rec_ok', fun: 2, soc: 2, time: 4 }, next: 'rec' }),
          K('chill', t(`Ask for something quiet.`, `Pedir algo bajito.`, `Pedir algo baixinho.`), { do: { call: 'af_set0' }, next: 'quiet' }),
          K('joke', t(`Ask for something loud.`, `Pedir algo fuerte.`, `Pedir algo alto.`), { do: { call: 'af_set2', fun: 2 }, next: 'loud' }),
          K('chill', t(`Go and help Dot.`, `Ir a ayudar a Dot.`, `Ir ajudar a Dot.`), { free: true, next: null })
        ]
      },
      rec: { text: t(`He slides one out and turns it so you can read the sleeve. His eyes go soft. "Hold it by the edges." You hold it by the edges. It is lighter than you expected.`, `Saca uno y lo gira para que puedas leer la funda. Se le suavizan los ojos. «Sostenlo por los bordes». Lo sostienes por los bordes. Pesa menos de lo que esperabas.`, `Ele puxa um e vira pra você ler a capa. Os olhos dele suavizam. «Segura pelas bordas». Você segura pelas bordas. É mais leve do que você esperava.`), next: 'a' },
      quiet: { text: t(`He swaps the needle to a slow one. The flat exhales. You can hear the kettle.`, `Cambia la aguja por un disco lento. El departamento exhala. Se oye la tetera.`, `Ele troca a agulha por um disco lento. O apê solta o ar. Dá pra ouvir a chaleira.`), next: 'a' },
      loud: { text: t(`"Okay," he says, "but the walls have ears." The bass comes up. So does your pulse. So, you suspect, will the broom from downstairs.`, `«Está bien», dice, «pero las paredes tienen oídos». Sube el bajo. Sube tu pulso. Y sospechas que subirá la escoba del piso de abajo.`, `«Tá bom», diz, «mas as paredes têm ouvidos». O grave sobe. Seu pulso também. E você suspeita que a vassoura lá de baixo vai subir junto.`), next: 'a' }
    }
  };
  function NFlag(f) { return function (s) { return !s.flags[f]; }; }

  D.af_records = {
    who: 'anselm', start: 'a', nodes: {
      a: {
        text: t(`A table of records in plain sleeves. Anselm keeps one eye on them from across the room.`, `Una mesa con discos en fundas sencillas. Anselm los vigila con un ojo desde el otro lado de la sala.`, `Uma mesa com discos em capas simples. O Anselm vigia com um olho do outro lado da sala.`),
        choices: [
          K('care', t(`Ask Anselm first.`, `Preguntarle primero a Anselm.`, `Perguntar primeiro ao Anselm.`), { free: true, call: 'af_ask_rec', next: null }),
          K('push', t(`Flip through them without asking.`, `Hojearlos sin pedir permiso.`, `Folhear sem pedir.`), { bad: true, next: 'touched' }),
          K('chill', t(`Leave them alone.`, `Dejarlos en paz.`, `Deixar em paz.`), { free: true, next: null })
        ]
      },
      touched: { text: t(`Anselm's hand is on yours before you reach the third sleeve. He says nothing. He does not need to.`, `La mano de Anselm está sobre la tuya antes de que llegues a la tercera funda. No dice nada. No hace falta.`, `A mão do Anselm tá sobre a sua antes de você chegar na terceira capa. Ele não diz nada. Não precisa.`), do: { soc: -6 }, next: null }
    }
  };
  D.af_basket = {
    start: 'a', nodes: {
      a: {
        text: function (s) { return s.flags.phone_basket ? t(`The basket is a bowl of dark glass screens and a few paperbacks. Yours is in there with the rest.`, `La canasta es un cuenco de pantallas oscuras y unos libros de bolsillo. El tuyo está ahí con los demás.`, `A cesta é uma tigela de telas escuras e uns livros de bolso. O seu tá lá com os outros.`) : t(`The basket is a bowl of dark glass screens and a few paperbacks. Yours stays in your pocket, on your word.`, `La canasta es un cuenco de pantallas oscuras y unos libros de bolsillo. El tuyo sigue en tu bolsillo, bajo tu palabra.`, `A cesta é uma tigela de telas escuras e uns livros de bolso. O seu fica no bolso, na palavra.`); },
        choices: [
          K('care', t(`Put your phone in.`, `Dejar el celular.`, `Pôr o celular.`), { req: function (s) { return !s.flags.phone_basket; }, do: { soc: 1, flag: 'phone_basket', unflag: 'phone_kept' }, next: null }),
          K('chill', t(`Leave it.`, `Dejarlo.`, `Deixar.`), { free: true, next: null })
        ]
      }
    }
  };

  /* ============================================================ 3. THE KITCHEN: you are the aftercare */
  D.af_dot_kitchen = {
    who: 'dot', role: t('HOST', 'ANFITRIONA', 'ANFITRIÃ'), start: 'a', nodes: {
      a: {
        text: t(`Dot is up to the elbows in eggs. "Thank you for coming. Everybody says that. I mean thank you for the quiet. It's hard to run a house when the house is a drum."`, `Dot está con los brazos llenos de huevos. «Gracias por venir. Todos dicen eso. Yo digo gracias por el silencio. Es difícil llevar una casa cuando la casa es un tambor».`, `A Dot tá com os braços cheios de ovos. «Obrigada por vir. Todo mundo diz isso. Eu digo obrigada pelo silêncio. É difícil cuidar de uma casa quando a casa é um tambor».`),
        choices: [
          K('care', t(`"I'll run to the bakery for bread."`, `«Voy a la panadería por pan».`, `«Eu vou na padaria buscar pão».`), { req: NFlag('brought_food'), do: { flag: 'brought_food', time: 30, soc: 4, fun: 3, hp: 4 }, next: 'bread' }),
          K('care', t(`"I'll take the recycling down."`, `«Bajo el reciclaje».`, `«Eu desço com a reciclagem».`), { req: NFlag('af_trash'), do: { flag: 'af_trash', time: 12, soc: 2, fun: 1 }, next: 'trash' }),
          K('chill', t(`Ask about the neighbours.`, `Preguntar por los vecinos.`, `Perguntar dos vizinhos.`), { free: true, next: 'nbr' }),
          K('chill', t(`Ask about the room at the end of the hall.`, `Preguntar por la habitación del fondo.`, `Perguntar do quarto do fundo.`), { free: true, req: F('mb_open'), next: 'mbinfo' }),
          K('chill', t(`"Just checking in."`, `«Solo paso a ver».`, `«Só passei pra ver».`), { free: true, next: null })
        ]
      },
      bread: { text: t(`You walk to the corner in clean cold light, past a man hosing his shop front, and come back with three loaves still warm in a paper bag. Dot takes one and presses it to her cheek.`, `Caminas hasta la esquina con luz limpia y fría, pasas junto a un hombre que riega la vereda de su local, y vuelves con tres panes tibios en una bolsa de papel. Dot toma uno y se lo apoya en la mejilla.`, `Você vai até a esquina em luz limpa e fria, passa por um homem lavando a frente da loja, e volta com três pães ainda mornos num saco de papel. A Dot pega um e encosta na bochecha.`), next: null },
      trash: { text: t(`Three flights down with a clinking bag, tiptoeing past the Alvarados' door. A baby cries once behind it, a small bright sound, and stops. You tiptoe the rest of the way.`, `Tres pisos abajo con una bolsa que tintinea, de puntillas frente a la puerta de los Alvarado. Un bebé llora una vez detrás, un sonido pequeño y claro, y se calla. Haces el resto del camino de puntillas.`, `Três andares abaixo com um saco tilintando, na ponta dos pés pela porta dos Alvarado. Um bebê chora uma vez lá dentro, um som pequeno e claro, e para. Você faz o resto do caminho na ponta dos pés.`), next: null },
      nbr: {
        text: [
          t(`Dot counts them off on flour-white fingers. "Above: Marcos, works from home, has a call at ten. Left wall, our bedroom side: Beto, a night nurse who sleeps now. Right: Doña Remedios, up since five, secretly adores records. Below: the Alvarados, with Lía, four months old."`, `Dot los cuenta con dedos blancos de harina. «Arriba: Marcos, trabaja desde casa, tiene una llamada a las diez. Pared izquierda, el lado de nuestro dormitorio: Beto, enfermero nocturno, que ahora duerme. A la derecha: doña Remedios, despierta desde las cinco, adora los discos en secreto. Abajo: los Alvarado, con Lía, de cuatro meses».`, `A Dot conta nos dedos brancos de farinha. «Em cima: o Marcos, trabalha em casa, tem reunião às dez. Parede esquerda, lado do nosso quarto: o Beto, enfermeiro noturno, que agora dorme. Na direita: a dona Remedios, acordada desde as cinco, ama disco em segredo. Embaixo: os Alvarado, com a Lía, de quatro meses».`),
          t(`"The landlord, Quiroga, warned us once. We would like him not to warn us twice. Watch the walls." She taps the side of the fridge, where someone has taped a drawing of a bar going up.`, `«El dueño, Quiroga, nos avisó una vez. Preferimos que no nos avise dos. Mira las paredes». Golpea el costado del refrigerador, donde alguien pegó el dibujo de una barra que sube.`, `«O dono, o Quiroga, avisou a gente uma vez. Preferimos que não avise duas. Olha as paredes». Ela bate na lateral da geladeira, onde alguém colou o desenho de uma barra subindo.`)
        ], do: { flag: 'knows_walls' }, next: 'a'
      },
      mbinfo: {
        text: t(`"We opened our own bedroom for anyone who wants it. Same rules as the dark room: ask first, a yes is a word, a no is a sentence, nobody films. Water and a bowl by the door. You can look, you can leave, it costs nothing. I'll walk you in the first time."`, `«Abrimos nuestro propio dormitorio para quien lo quiera. Las mismas reglas del cuarto oscuro: pregunta primero, un sí es una palabra, un no es una frase, nadie filma. Agua y un bol junto a la puerta. Puedes mirar, puedes irte, no cuesta nada. La primera vez te acompaño».`, `«Abrimos o nosso próprio quarto pra quem quiser. As mesmas regras da dark room: pergunta primeiro, um sim é uma palavra, um não é uma frase, ninguém filma. Água e uma tigela na porta. Pode olhar, pode sair, não custa nada. Na primeira vez eu te acompanho».`),
        do: { flag: 'mb_info' }, next: 'a'
      }
    }
  };
  D.af_toast = {
    start: 'a', nodes: {
      a: {
        text: t(`A plate of toast, a pot of tea, a jar of something orange. Everything is warm and nobody is selling it.`, `Un plato de tostadas, una tetera, un frasco de algo naranja. Todo está tibio y nadie lo vende.`, `Um prato de torradas, um bule de chá, um pote de algo laranja. Tudo tá morno e ninguém tá vendendo.`),
        choices: [
          K('chill', t(`Eat some toast, drink some tea.`, `Comer una tostada y tomar té.`, `Comer uma torrada e tomar chá.`), { req: function (s) { return (s.cool.af_toast || 0) <= s.time; }, do: { hp: 5, soc: 1, time: 4, cool: { af_toast: 30 } }, next: null }),
          K('chill', t(`Not yet.`, `Todavía no.`, `Ainda não.`), { free: true, next: null })
        ]
      }
    }
  };
  D.af_dishes = {
    who: 'dot', role: t('HOST', 'ANFITRIONA', 'ANFITRIÃ'), start: 'a', nodes: {
      a: {
        text: t(`A pile of plates and mugs from the night before. Dot is not looking at the pile, which is how you know she has seen it.`, `Una pila de platos y tazas de la noche anterior. Dot no mira la pila, que es cómo sabes que la vio.`, `Uma pilha de pratos e canecas da noite anterior. A Dot não olha pra pilha, que é como você sabe que ela viu.`),
        choices: [
          K('care', t(`Wash up. Leave the place better.`, `Lavar. Dejar el lugar mejor.`, `Lavar. Deixar o lugar melhor.`), { do: { care: 1, time: 10, soc: 3, flag: 'af_clean' }, next: null }),
          K('chill', t(`Later.`, `Luego.`, `Depois.`), { free: true, next: null })
        ]
      }
    }
  };

  /* SAM: a comedown. Your own state decides how the two of you meet */
  D.af_sam = {
    who: 'sam', role: t('COMING DOWN', 'EN LA BAJADA', 'NA DESCIDA'), start: 'st', nodes: {
      st: { branch: [{ req: function (s) { return !!(s.fx.comedown || s.fx.comedown2); }, to: 'both' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`Sam sits on the floor against a cupboard, hands round a mug, eyes on nothing. "Everything went grey. An hour ago I loved everyone. Did I do something wrong?"`, `Sam está sentado en el piso contra un armario, las manos alrededor de una taza, los ojos en nada. «Todo se puso gris. Hace una hora quería a todos. ¿Hice algo mal?»`, `O Sam tá sentado no chão encostado num armário, mãos em volta de uma caneca, olhos em nada. «Tudo ficou cinza. Faz uma hora eu amava todo mundo. Eu fiz alguma coisa errada?»`),
        choices: [
          K('care', t(`Sit beside them. "It's a comedown. It passes. It isn't you."`, `Sentarte a su lado. «Es una bajada. Pasa. No eres tú».`, `Sentar do lado. «É uma descida. Passa. Não é você».`), { do: { care: 1, time: 8, flag: ['sam_done', 'sam_ok'] }, next: 'ok' }),
          K('care', t(`Bring toast and water, and say nothing.`, `Traer tostadas y agua, y no decir nada.`, `Trazer torrada e água, e não dizer nada.`), { do: { care: 1, time: 6, hp: 2, flag: ['sam_done', 'sam_ok'] }, next: 'ok' }),
          K('blunt', t(`List everything they should do: eat, sleep, no more, text nobody.`, `Listar todo lo que deberían hacer: comer, dormir, nada más, no escribir a nadie.`, `Listar tudo que deviam fazer: comer, dormir, nada mais, não mandar mensagem pra ninguém.`), { do: { soc: -3, fun: -2, time: 5 }, next: 'fuss' }),
          K('chill', t(`"You'll be fine." Leave them to it.`, `«Vas a estar bien». Dejarlos con eso.`, `«Você vai ficar bem». Deixar com isso.`), { free: true, do: { soc: -2, flag: ['sam_done', 'sam_alone'] }, next: null })
        ]
      },
      both: {
        text: t(`Sam looks up at your own mug, held in both hands. "You too?" You both nod. Two grey people share a piece of toast, and for a minute it is almost funny.`, `Sam mira tu propia taza, sostenida con las dos manos. «¿Tú también?» Los dos asienten. Dos personas grises comparten una tostada, y por un minuto casi da risa.`, `O Sam olha pra sua própria caneca, segurada com as duas mãos. «Você também?» Os dois assentem. Duas pessoas cinzentas dividem uma torrada, e por um minuto quase dá vontade de rir.`),
        do: { care: 1, soc: 4, hp: 2, time: 8, flag: ['sam_done', 'sam_ok'] }, next: null
      },
      ok: { text: t(`Sam breathes out. "I'll eat the toast." They eat the toast. By the end of it they are back in the room, tired and here.`, `Sam suelta el aire. «Me como la tostada». Se la comen. Al final están de vuelta en la sala, cansados y presentes.`, `O Sam solta o ar. «Eu como a torrada». Come a torrada. No fim, tá de volta na sala, cansado e presente.`), next: null },
      fuss: { text: t(`"Okay. Thank you." Sam looks at the mug, hoping it helps. The list is correct and it does not help.`, `«Está bien. Gracias». Sam mira la taza, esperando que ayude. La lista es correcta y no ayuda.`, `«Tá bom. Obrigado». O Sam olha pra caneca, esperando que ajude. A lista tá certa e não ajuda.`), choices: [K('care', t(`"Sorry. Let me just sit with you."`, `«Perdón. Déjame solo sentarme contigo».`, `«Desculpa. Deixa eu só sentar com você».`), { do: { care: 1, time: 8, flag: ['sam_done', 'sam_ok'] }, next: 'ok' }), K('chill', t(`Back away slowly.`, `Retroceder despacio.`, `Recuar devagar.`), { free: true, do: { flag: ['sam_done', 'sam_fussed'] }, next: null })] }
    }
  };
  /* REY: redosed, overheating */
  D.af_rey = {
    who: 'rey', role: t('OVERHEATING', 'SOBRECALENTADO', 'SUPERAQUECIDO'), start: 'a', nodes: {
      a: {
        text: t(`Rey is fanning their face with a paper plate, jaw working, shirt damp. "I took another one. The first one was still going. I know. I know. Please don't say it."`, `Rey se abanica con un plato de papel, la mandíbula trabajando, la camisa húmeda. «Me tomé otra. La primera seguía. Ya sé. Ya sé. Por favor no lo digas».`, `O Rey se abana com um prato de papel, mandíbula trabalhando, camisa úmida. «Tomei outra. A primeira ainda tava rolando. Eu sei. Eu sei. Por favor não fala».`),
        choices: [
          K('care', t(`Take them to the balcony door. Water, air, sit.`, `Llevarlos a la puerta del balcón. Agua, aire, sentarse.`, `Levar até a porta da varanda. Água, ar, sentar.`), { do: { care: 1, time: 10, flag: ['rey_done', 'rey_ok'] }, next: 'ok' }),
          K('care', t(`Be their buddy: "I'll check on you in an hour."`, `Ser su compañero: «Paso a verte en una hora».`, `Ser a dupla: «Passo aqui daqui a uma hora pra ver você».`), { do: { care: 2, time: 6, flag: ['rey_done', 'rey_ok', 'rey_buddy'] }, next: 'buddy' }),
          K('blunt', t(`"You redosed. Don't do that again."`, `«Te redosificaste. No lo hagas otra vez».`, `«Você redosou. Não faz isso de novo».`), { do: { soc: -4, time: 3 }, next: 'lecture' }),
          K('chill', t(`Hand them a cup and walk on.`, `Darles un vaso y seguir.`, `Dar um copo e seguir.`), { free: true, do: { flag: ['rey_done', 'rey_alone'] }, next: null })
        ]
      },
      ok: { text: t(`You open the balcony door a hand's width, enough for the morning to come in. Rey sits with the plate on their knee and breathes slowly, on your count. The shirt dries. The jaw loosens.`, `Abres la puerta del balcón un palmo, lo justo para que entre la mañana. Rey se sienta con el plato en la rodilla y respira despacio, a tu cuenta. La camisa se seca. La mandíbula se afloja.`, `Você abre a porta da varanda um palmo, o bastante pra manhã entrar. O Rey senta com o prato no joelho e respira devagar, na sua contagem. A camisa seca. A mandíbula solta.`), next: null },
      buddy: { text: t(`"Okay. An hour." Rey says it twice, like something to hold. You set the time in your head.`, `«Vale. Una hora». Rey lo dice dos veces, como algo a lo que agarrarse. Fijas la hora en la cabeza.`, `«Tá. Uma hora». O Rey diz duas vezes, como algo pra se segurar. Você marca a hora na cabeça.`), next: null },
      lecture: { text: t(`"Thank you for the thesis," Rey says, kindly, and closes their eyes. They knew. They knew before you did.`, `«Gracias por la tesis», dice Rey, con cariño, y cierra los ojos. Ya sabían. Lo sabían antes que tú.`, `«Obrigado pela tese», diz o Rey, com carinho, e fecha os olhos. Já sabiam. Sabiam antes de você.`), choices: [K('care', t(`"Sorry. Come to the balcony door."`, `«Perdón. Ven a la puerta del balcón».`, `«Desculpa. Vem pra porta da varanda».`), { do: { care: 1, time: 10, flag: ['rey_done', 'rey_ok'] }, next: 'ok' }), K('chill', t(`Leave them in peace.`, `Dejarlos en paz.`, `Deixar em paz.`), { free: true, do: { flag: ['rey_done', 'rey_alone'] }, next: null })] }
    }
  };
  /* VIK: alcohol on top */
  D.af_vik = {
    who: 'vik', role: t('A LOT OF WINE', 'MUCHO VINO', 'MUITO VINHO'), start: 'a', nodes: {
      a: {
        text: function (s) {
          const out = [t(`Vik is holding the counter with both hands and a smile that arrived before the rest of them. "I mixed things. Wine, then the other thing, then more wine. The room is a very nice boat."`, `Vik se sostiene del mostrador con las dos manos y una sonrisa que llegó antes que el resto. «Mezclé cosas. Vino, después la otra cosa, después más vino. La sala es un barco muy lindo».`, `O Vik segura o balcão com as duas mãos e um sorriso que chegou antes do resto. «Misturei coisas. Vinho, depois a outra coisa, depois mais vinho. A sala é um barco muito bonito».`)];
          if (s.flags.mixed_alc) out.push(t(`They squint at you. "You smell of the same bar. Solidarity."`, `Te entrecierran los ojos. «Hueles al mismo bar. Solidaridad».`, `Apertam os olhos pra você. «Você tem cheiro do mesmo bar. Solidariedade».`));
          return out;
        },
        choices: [
          K('care', t(`Water, bread, and ask how much. No judging.`, `Agua, pan, y preguntar cuánto. Sin juzgar.`, `Água, pão, e perguntar quanto. Sem julgar.`), { do: { care: 1, time: 8, hp: 1, flag: ['vik_done', 'vik_ok'] }, next: 'ok' }),
          K('joke', t(`"At least you're not driving."`, `«Por lo menos no manejas».`, `«Pelo menos você não vai dirigir».`), { do: { fun: 2, time: 3, flag: ['vik_done', 'vik_joked'] }, next: 'joke' }),
          K('blunt', t(`A lecture on mixing, with numbers.`, `Una charla sobre mezclas, con números.`, `Uma palestra sobre misturas, com números.`), { do: { soc: -3, fun: -1, time: 4, flag: ['vik_done', 'vik_lectured'] }, next: null })
        ]
      },
      ok: { text: t(`Vik drinks the water in three long gulps, eats a slice of bread with their whole face, and sits down on the floor to continue being a person. "How many did I have?" "Enough. Sit." They sit.`, `Vik toma el agua en tres tragos largos, come una rebanada de pan con toda la cara, y se sienta en el piso para seguir siendo una persona. «¿Cuántas tomé?» «Las suficientes. Siéntate». Se sientan.`, `O Vik bebe a água em três goles longos, come uma fatia de pão com o rosto todo, e senta no chão pra continuar sendo uma pessoa. «Quantas eu tomei?» «O bastante. Senta». Senta.`), next: null },
      joke: { text: t(`Vik laughs so hard they have to hold the counter again. It is the kind of laugh that is half hiccup. It helps. It is not water, though.`, `Vik se ríe tanto que tiene que agarrar el mostrador otra vez. Es una risa mitad hipo. Ayuda. Pero no es agua.`, `O Vik ri tanto que precisa segurar o balcão de novo. É uma risada meio soluço. Ajuda. Mas não é água.`), next: null }
    }
  };

  /* ============================================================ 4. THE PERSON IN THE BEDROOM */
  const deep = function (s) { return EM.mulberry32((s.seed | 0) + 777)() < 0.3; };
  D.af_lio = {
    who: 'lio', role: t('ALONE IN THE COATS', 'SOLO ENTRE LOS ABRIGOS', 'SOZINHO NOS CASACOS'), start: 'st', nodes: {
      st: { branch: [{ req: deep, to: 'deep' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`Lio is curled on the coats, eyes half open, phone loose in one hand. "Don't turn the light on," they whisper. "Everything is loud and my heart is running." Their skin is hot.`, `Lio está hecho un ovillo sobre los abrigos, los ojos entreabiertos, el celular suelto en una mano. «No prendas la luz», susurran. «Todo está fuerte y el corazón me corre». Tienen la piel caliente.`, `O Lio tá enrodilhado nos casacos, olhos entreabertos, celular solto numa mão. «Não acende a luz», sussurra. «Tudo tá alto e meu coração tá correndo». A pele tá quente.`),
        choices: [
          K('care', t(`Sit. Ask: "What did you take? When? Is anyone with you?"`, `Sentarte. Preguntar: «¿Qué tomaste? ¿Cuándo? ¿Hay alguien contigo?»`, `Sentar. Perguntar: «O que você tomou? Quando? Tem alguém com você?»`), { do: { time: 6, care: 1 }, next: 'ask' }),
          K('care', t(`Get water, come back, sit.`, `Traer agua, volver, sentarte.`, `Trazer água, voltar, sentar.`), { do: { time: 5 }, next: 'water' }),
          K('blunt', t(`Shake them. "Hey! Talk to me! Look at me!"`, `Sacudirlos. «¡Oye! ¡Háblame! ¡Mírame!»`, `Sacudir. «Ei! Fala comigo! Olha pra mim!»`), { do: { fun: -2, soc: -3 }, next: 'fussed' }),
          K('chill', t(`"You said you're fine." Leave them.`, `«Dijiste que estás bien». Dejarlos.`, `«Você disse que tá bem». Deixar.`), { free: true, do: { soc: -3, flag: ['lio_done', 'lio_alone'], quest: { q_af4: 'done' } }, next: null, react: t(`At the door you hear a long breath behind you. You pretend not to.`, `En la puerta oyes una respiración larga a tu espalda. Finges que no.`, `Na porta você ouve uma respiração longa atrás de você. Finge que não.`) })
        ]
      },
      water: { text: t(`A glass, a slow sip, another. Lio holds it with both hands and doesn't drop it, which is the first good sign.`, `Un vaso, un sorbo lento, otro. Lio lo sostiene con las dos manos y no lo suelta, que es la primera buena señal.`, `Um copo, um gole devagar, outro. O Lio segura com as duas mãos e não derruba, que é o primeiro bom sinal.`), next: 'ask' },
      fussed: { text: t(`Lio flinches and curls tighter, eyes shut. Too many questions, too fast, in a voice that is too big for the room.`, `Lio se estremece y se encoge más, los ojos cerrados. Demasiadas preguntas, demasiado rápido, en una voz demasiado grande para la habitación.`, `O Lio se encolhe e se enrola mais, olhos fechados. Perguntas demais, rápido demais, numa voz grande demais pro quarto.`), choices: [K('care', t(`"Sorry. Quieter. I'm just going to sit."`, `«Perdón. Más bajito. Solo me voy a sentar».`, `«Desculpa. Mais baixo. Eu só vou sentar».`), { next: 'ask' }), K('chill', t(`Back out of the room.`, `Salir de la habitación.`, `Sair do quarto.`), { free: true, do: { flag: ['lio_done', 'lio_alone'], quest: { q_af4: 'done' } }, next: null })] },
      ask: {
        text: t(`"One earlier. Then Pasc's bag. Twice." Their jaw is clenched, their teeth chatter. "I'm cold. And hot. Is that a thing?" Their eyes find yours at last.`, `«Una antes. Después la bolsa de Pasc. Dos veces». Tienen la mandíbula apretada, los dientes castañean. «Tengo frío. Y calor. ¿Eso se puede?» Por fin sus ojos encuentran los tuyos.`, `«Uma antes. Depois o saquinho do Pasc. Duas vezes». A mandíbula tá travada, os dentes batem. «Tô com frio. E calor. Isso pode?» O olhar finalmente encontra o seu.`),
        choices: [
          K('care', t(`Stay. Breathe at their pace. Water in sips.`, `Quedarte. Respirar a su ritmo. Agua en sorbos.`, `Ficar. Respirar no ritmo. Água em goles.`), { do: { care: 2, time: 20, soc: 6, fun: 2, flag: ['lio_done', 'lio_ok'], quest: { q_af4: 'done' } }, next: 'ok' }),
          K('care', t(`"I'm getting Dot. She'll know who to call."`, `«Voy por Dot. Ella sabe a quién llamar».`, `«Vou chamar a Dot. Ela sabe pra quem ligar».`), { do: { care: 1, time: 6, soc: 5, flag: ['lio_done', 'lio_called'], quest: { q_af4: 'done' } }, next: 'called' })
        ]
      },
      ok: { text: t(`An hour of sips, of a blanket, of "tell me three things you can see." Lio is asleep, breathing slowly, a blanket to the chin. Mo takes the next shift on the floor beside them with a book.`, `Una hora de sorbos, de manta, de «dime tres cosas que ves». Lio duerme, respira despacio, con una manta hasta la barbilla. Mo toma el siguiente turno en el piso a su lado con un libro.`, `Uma hora de goles, de cobertor, de «me diz três coisas que você vê». O Lio dorme, respira devagar, cobertor até o queixo. A Mo assume o próximo turno no chão ao lado, com um livro.`), next: null },
      called: { text: t(`Dot comes with a glass and a cool cloth, takes one look, and sits down on the other side. "If they can answer you, we stay. If they can't, we call. Good call, getting me." They stay.`, `Dot llega con un vaso y un paño frío, mira una vez y se sienta del otro lado. «Si pueden contestarte, nos quedamos. Si no, llamamos. Buena idea buscarme». Se quedan.`, `A Dot chega com um copo e um pano frio, olha uma vez e senta do outro lado. «Se ela consegue te responder, a gente fica. Se não, a gente liga. Boa, ter me chamado». Ficam.`), next: null },
      deep: {
        text: t(`Lio is on their side on the coats. You say their name. Nothing. You say it louder and shake a shoulder. Their eyes move under the lids. A breath. A long gap. Another breath.`, `Lio está de costado sobre los abrigos. Dices su nombre. Nada. Lo dices más fuerte y sacudes un hombro. Los ojos se mueven bajo los párpados. Una respiración. Un hueco largo. Otra respiración.`, `O Lio tá de lado nos casacos. Você diz o nome. Nada. Diz mais alto e sacode um ombro. Os olhos se mexem sob as pálpebras. Uma respiração. Um intervalo longo. Outra respiração.`),
        choices: [
          K('care', t(`"Dot! Call for help. Now."`, `«¡Dot! Llama ayuda. Ahora».`, `«Dot! Chama ajuda. Agora».`), { do: { care: 2, soc: 6, time: 5, flag: ['lio_done', 'lio_called'], quest: { q_af4: 'done' } }, next: 'called_deep' }),
          K('chill', t(`Turn them onto their side and wait a minute.`, `Ponerlos de costado y esperar un minuto.`, `Virar de lado e esperar um minuto.`), { do: { time: 3 }, next: 'side' }),
          K('chill', t(`Leave them to sleep it off.`, `Dejarlos dormir hasta que se les pase.`, `Deixar dormir até passar.`), { bad: true, free: true, do: { hp: -8, soc: -6, fun: -8, flag: ['lio_done', 'lio_neglect'], quest: { q_af4: 'done' } }, next: null, react: t(`Five minutes later Mo comes out of the coats room white-faced. "Somebody call. Now." You were the one who walked past.`, `Cinco minutos después Mo sale del cuarto de los abrigos pálido. «Que alguien llame. Ya». Tú fuiste quien pasó de largo.`, `Cinco minutos depois a Mo sai do quarto dos casacos pálida. «Alguém liga. Agora». Foi você quem passou direto.`) })
        ]
      },
      side: { text: t(`You roll them gently onto their side, the way the poster in the club says. Still nothing. One minute. Two. Their lips are the wrong colour.`, `Los giras con cuidado de costado, como dice el afiche del club. Sigue sin responder. Un minuto. Dos. Los labios tienen un color equivocado.`, `Você vira de lado com cuidado, como diz o cartaz do club. Continua sem resposta. Um minuto. Dois. Os lábios tão da cor errada.`), choices: [K('care', t(`"Dot! Call for help!"`, `«¡Dot! ¡Llama ayuda!»`, `«Dot! Chama ajuda!»`), { do: { care: 2, soc: 5, time: 3, flag: ['lio_done', 'lio_called'], quest: { q_af4: 'done' } }, next: 'called_deep' }), K('chill', t(`Keep waiting.`, `Seguir esperando.`, `Continuar esperando.`), { bad: true, free: true, do: { hp: -8, soc: -6, fun: -8, flag: ['lio_done', 'lio_neglect'], quest: { q_af4: 'done' } }, next: null, react: t(`Mo walks in, sees, and shouts for Dot in a voice you will remember. The call is made. You should have made it.`, `Mo entra, ve, y grita por Dot con una voz que recordarás. Se hace la llamada. Debiste hacerla tú.`, `A Mo entra, vê, e grita pela Dot numa voz que você vai lembrar. A ligação é feita. Devia ter sido você.`) })] },
      called_deep: { text: t(`Dot is on the phone before you finish. "Stay on their side, keep talking, the paramedics are four minutes away." They come. Lio is gone onto a stretcher, breathing, and by noon is a text: awake, sore, fine. Dot squeezes your arm. "You called. That is the whole job."`, `Dot ya está al teléfono antes de que termines. «Déjalos de costado, sigue hablándoles, los paramédicos llegan en cuatro minutos». Llegan. Lio sale en una camilla, respirando, y a mediodía es un mensaje: despierto, dolorido, bien. Dot te aprieta el brazo. «Llamaste. Eso es todo el trabajo».`, `A Dot já tá no telefone antes de você terminar. «Deixa de lado, continua falando, os paramédicos chegam em quatro minutos». Eles chegam. O Lio sai numa maca, respirando, e ao meio-dia vira uma mensagem: acordado, dolorido, bem. A Dot aperta seu braço. «Você ligou. Esse é o trabalho todo».`), next: null }
    }
  };
  /* Lio leaves the room once handled */
  /* ============================================================ 5. ONE MORE */
  D.af_pasc = {
    who: 'pasc', role: t('ON THE SOFA', 'EN EL SOFÁ', 'NO SOFÁ'), start: 'a', nodes: {
      a: {
        text: t(`Pasc has a small bag and a big smile. "One more? For the road. For the sunrise. For the vibes." The bag goes round the sofa: a pinch, a pass. It is on its way to you.`, `Pasc tiene una bolsita y una sonrisa enorme. «¿Una más? Para el camino. Para el amanecer. Para la vibra». La bolsa da la vuelta al sofá: un poco, un pase. Viene hacia ti.`, `O Pasc tem um saquinho e um sorrisão. «Mais uma? Pra estrada. Pro nascer do sol. Pra vibe». O saquinho roda pelo sofá: uma pitada, um passe. Tá vindo na sua direção.`),
        choices: [
          K('chill', t(`"I'm good. Pass it on."`, `«Estoy bien. Pásala».`, `«Tô bem. Passa adiante».`), { do: { soc: 2, flag: ['one_done', 'one_no'], call: 'af_one_friends' }, next: 'no' }),
          K('joke', t(`"I'm good. The toast has no side effects. Want some?"`, `«Estoy bien. Las tostadas no tienen efectos secundarios. ¿Quieres?»`, `«Tô bem. A torrada não tem efeito colateral. Quer?»`), { do: { fun: 2, soc: 2, flag: ['one_done', 'one_no'], call: 'af_one_friends' }, next: 'no' }),
          K('bold', t(`Take a pinch for the road.`, `Tomar un poco para el camino.`, `Pegar uma pitada pra estrada.`), { do: { call: 'af_bag_yes', flag: ['one_done', 'one_yes'] }, next: 'yes' }),
          K('blunt', t(`Give it back with a speech about dosage.`, `Devolverla con un discurso sobre dosis.`, `Devolver com um discurso sobre dose.`), { do: { soc: -4, fun: -3, flag: ['one_done', 'one_lecture'], call: 'af_one_friends' }, next: 'lecture' })
        ]
      },
      no: {
        text: function (s) {
          const out = [t(`Pasc shrugs, delighted anyway. "More for the sunrise." The bag moves on. Nobody makes it a thing, which is the whole trick.`, `Pasc se encoge de hombros, feliz igual. «Más para el amanecer». La bolsa sigue. Nadie lo convierte en un tema, que es todo el truco.`, `O Pasc dá de ombros, feliz do mesmo jeito. «Sobra pro nascer do sol». O saquinho segue. Ninguém faz disso um assunto, que é o truque todo.`)];
          FR.forEach(function (f) {
            if (!L.hasFriend(f)) return;
            const n = nm(f);
            if (s.flags['one_back_' + f]) out.push(t(`${n} slides the bag along without looking at it. "Same."`, `${n} pasa la bolsa sin mirarla. «Igual».`, `${n} passa o saquinho sem olhar. «Igual».`));
            else out.push(t(`${n} takes a pinch and passes it on. That is theirs to decide.`, `${n} toma un poco y la pasa. Eso lo decide cada quien.`, `${n} pega uma pitada e passa. Isso é decisão de cada um.`));
          });
          return out;
        }, next: null
      },
      yes: { text: t(`The bag is warm from other hands. You take a pinch. It lands where those always land: on the long part of the morning you were going to sleep through. MDMA is still the most fun. The body keeps its own books.`, `La bolsa está tibia de otras manos. Tomas un poco. Cae donde siempre caen: en la parte larga de la mañana que ibas a dormir. El MDMA sigue siendo lo más divertido. El cuerpo lleva sus propias cuentas.`, `O saquinho tá morno de outras mãos. Você pega uma pitada. Cai onde essas sempre caem: na parte longa da manhã que você ia dormir. MDMA continua sendo a coisa mais divertida. O corpo faz as próprias contas.`), next: null },
      lecture: { text: t(`"Okay, Professor," says Pasc, kindly, and the sofa goes quiet. Nobody needed the numbers. They all know the numbers. The bag moves on, a little less friendly.`, `«Está bien, Profesor», dice Pasc con cariño, y el sofá se queda en silencio. Nadie necesitaba los números. Todos los saben. La bolsa sigue, un poco menos amable.`, `«Tá bom, Professor», diz o Pasc, com carinho, e o sofá fica em silêncio. Ninguém precisava dos números. Todo mundo sabe. O saquinho segue, um pouco menos simpático.`), next: null }
    }
  };

  D.af_queue = {
    who: 'noor', role: t('NEXT IN LINE', 'EL SIGUIENTE', 'O PRÓXIMO'), start: 'a', nodes: {
      a: {
        text: t(`One toilet, one queue, one rule. Noor has been "next" since the sunrise and has made peace with it. "Everyone says a good bathroom is the soul of a house. This one has a soul and no schedule."`, `Un baño, una fila, una regla. Noor es «el siguiente» desde el amanecer y ya hizo las paces. «Dicen que un buen baño es el alma de una casa. Este tiene alma y ningún horario».`, `Um banheiro, uma fila, uma regra. O Noor é «o próximo» desde o nascer do sol e já fez as pazes. «Dizem que um bom banheiro é a alma da casa. Esse tem alma e nenhum horário».`),
        choices: [
          K('joke', t(`"Go ahead. I'm in no hurry."`, `«Pasa tú. No tengo apuro».`, `«Pode ir. Não tenho pressa».`), { req: NFlag('queue_joke'), do: { fun: 3, soc: 2, time: 3, flag: 'queue_joke' }, next: null }),
          K('chill', t(`Wait your turn quietly.`, `Esperar tu turno en silencio.`, `Esperar sua vez em silêncio.`), { free: true, next: null })
        ]
      }
    }
  };
  D.af_remedios = {
    who: 'remedios', role: t('NEXT DOOR', 'LA VECINA', 'A VIZINHA'), start: 'a', nodes: {
      a: {
        text: t(`On the next balcony an old woman in a quilted dressing gown waters a geranium. "I have been up since five," she says. "Your record is the first thing in months that is better than the radio."`, `En el balcón de al lado una señora mayor con una bata acolchada riega un geranio. «Estoy despierta desde las cinco», dice. «Tu disco es lo primero en meses que es mejor que la radio».`, `Na varanda ao lado uma senhora de roupão acolchoado rega um gerânio. «Tô acordada desde as cinco», diz. «O seu disco é a primeira coisa em meses melhor que o rádio».`),
        choices: [
          K('care', t(`Ask what she would like to hear.`, `Preguntarle qué le gustaría oír.`, `Perguntar o que ela gostaria de ouvir.`), { req: NFlag('rem_met'), do: { flag: ['rem_ally', 'rem_met'], soc: 3, fun: 2, time: 8 }, next: 'ally' }),
          K('joke', t(`Offer her toast across the railing.`, `Ofrecerle una tostada por encima de la baranda.`, `Oferecer uma torrada por cima do parapeito.`), { req: NFlag('rem_toast'), do: { fun: 3, soc: 2, flag: 'rem_toast', time: 4 }, next: 'toast' }),
          K('chill', t(`Say good morning and leave it.`, `Dar los buenos días y dejarlo ahí.`, `Dar bom dia e deixar por aí.`), { free: true, next: null })
        ]
      },
      ally: { text: t(`"Cumbia, 1974. Anything with a guiro." She waters the geranium thoughtfully. "And tell the boy with the bass he is a good boy, but I am old." From now on she has your back with the walls: a sound that would have carried carries less.`, `«Cumbia, 1974. Cualquier cosa con güiro». Riega el geranio con calma. «Y dile al chico del bajo que es buen muchacho, pero yo soy vieja». Desde ahora te cubre con las paredes: un ruido que habría llegado lejos llega menos.`, `«Cumbia, 1974. Qualquer coisa com reco-reco». Ela rega o gerânio com calma. «E diz pro rapaz do grave que ele é um bom menino, mas eu sou velha». A partir de agora ela te protege com as paredes: um barulho que ia longe vai menos longe.`), next: null },
      toast: { text: t(`She accepts the toast with two fingers and the dignity of a head of state. "Butter, yes. Thank you." You have an understanding.`, `Acepta la tostada con dos dedos y la dignidad de una jefa de Estado. «Con mantequilla, sí. Gracias». Tienen un entendimiento.`, `Ela aceita a torrada com dois dedos e a dignidade de uma chefe de Estado. «Com manteiga, sim. Obrigada». Vocês têm um entendimento.`), next: null }
    }
  };

  /* Feña, asleep on the sofa */
  D.af_tato_sofa = {
    who: 'tato', role: t('ASLEEP', 'DORMIDO', 'DORMINDO'), start: 'a', nodes: {
      a: {
        text: t(`Fernando is asleep on the sofa, one shoe on and one off, mouth a little open. A small snore. You could leave him, cover him, or wake him and take him home.`, `Feña duerme en el sofá, un zapato puesto y otro no, la boca un poco abierta. Un ronquido chiquito. Podrías dejarlo, taparlo, o despertarlo y llevarlo a casa.`, `O Fernando dorme no sofá, um sapato calçado e outro não, boca um pouco aberta. Um ronquinho. Dá pra deixar, cobrir, ou acordar e levar pra casa.`),
        choices: [
          K('care', t(`Put a blanket over him. Let him sleep.`, `Taparlo con una manta. Dejarlo dormir.`, `Cobrir com um cobertor. Deixar dormir.`), { req: NFlag('tato_blanket'), do: { care: 1, bond: { tato: 1 }, flag: 'tato_blanket' }, next: null }),
          K('care', t(`Wake him gently and take him home.`, `Despertarlo con cuidado y llevarlo a casa.`, `Acordar com jeitinho e levar pra casa.`), { do: { time: 35, bond: { tato: 2 }, call: 'af_tato_home', flag: 'tato_walked' }, next: null }),
          K('care', t(`Ask Benjamin to take him home.`, `Pedirle a Benjamin que lo lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('dani'), do: { time: 6, bond: { tato: 1, dani: 1 }, call: 'af_tato_dani', flag: 'tato_dani' }, next: null }),
          K('chill', t(`Leave him.`, `Dejarlo.`, `Deixar.`), { free: true, next: null })
        ]
      }
    }
  };
  /* Benjamin wants the next thing: chasing the high, sleep debt */
  D.af_dani_next = {
    forced: true, who: 'dani', role: t('THE NEXT THING', 'LO SIGUIENTE', 'A PRÓXIMA COISA'), start: 'a', nodes: {
      a: {
        text: t(`Benjamin, vibrating gently, is rummaging for his shoes. "What's the next thing? There's always a next thing. A park? A swimming place? A sunrise but later?"`, `Benjamin, vibrando con suavidad, busca sus zapatos. «¿Cuál es lo siguiente? Siempre hay algo siguiente. ¿Un parque? ¿Una pileta? ¿Un amanecer pero más tarde?»`, `O Benjamin, vibrando de leve, procura os sapatos. «Qual é a próxima coisa? Sempre tem uma próxima coisa. Um parque? Uma piscina? Um nascer do sol mas mais tarde?»`),
        choices: [
          K('care', t(`"The next thing is toast. And then a bed."`, `«Lo siguiente son tostadas. Y después una cama».`, `«A próxima coisa é torrada. E depois uma cama».`), { do: { bond: { dani: 1 }, soc: 2, fun: 2, flag: 'dani_toast' }, next: 'toast' }),
          K('care', t(`"I'm tired too. Let's say it out loud."`, `«Yo también estoy cansado o cansada. Digámoslo en voz alta».`, `«Eu também tô cansado. Vamos dizer em voz alta».`), { do: { care: 1, bond: { dani: 2 }, soc: 3, flag: 'dani_admit' }, next: 'admit' }),
          K('bold', t(`"Let's find the next thing."`, `«Vamos a buscar lo siguiente».`, `«Vamos achar a próxima coisa».`), { do: { fun: 6, hp: -6, soc: -4, time: 30, flag: 'dani_chase' }, next: 'chase' })
        ]
      },
      toast: { text: t(`"Toast," Benjamin says, awed. He sits. He eats. After the second slice the shoes are forgotten.`, `«Tostadas», dice Benjamin, maravillado. Se sienta. Come. Después de la segunda rebanada se olvida de los zapatos.`, `«Torrada», diz o Benjamin, maravilhado. Senta. Come. Depois da segunda fatia esquece dos sapatos.`), next: null },
      admit: { text: t(`"Oh," Benjamin says, and the whole body goes with it. "Oh. I'm so tired." He laughs, then yawns. "I thought it was a feeling. It's just sleep." He lies down on the floor with his shoes on.`, `«Ah», dice Benjamin, y el cuerpo entero lo acompaña. «Ah. Estoy muy cansado». Se ríe y luego bosteza. «Pensé que era un sentimiento. Es solo sueño». Se tira en el piso con los zapatos puestos.`, `«Ah», diz o Benjamin, e o corpo inteiro vai junto. «Ah. Tô muito cansado». Ri, depois boceja. «Achei que era um sentimento. É só sono». Deita no chão de sapato.`), next: null },
      chase: { text: t(`You walk him to the park, sit on a wall, and watch dog walkers. It is fun for twenty minutes. Then sleep debt arrives all at once, and the whole morning weighs more than the whole night did.`, `Lo llevas al parque, se sientan en un muro y miran a la gente que pasea perros. Es divertido por veinte minutos. Después llega la deuda de sueño de golpe, y toda la mañana pesa más que toda la noche.`, `Você leva ele ao parque, senta num murinho e vê gente passeando com cachorro. É divertido por vinte minutos. Aí a dívida de sono chega de uma vez, e a manhã inteira pesa mais que a noite inteira.`), next: null }
    }
  };

  /* ============================================================ 7. THE QUESTION: who walks whom home */
  D.af_question = {
    forced: true, who: 'maru', role: t('THE QUESTION', 'LA PREGUNTA', 'A PERGUNTA'), start: 'a', nodes: {
      a: {
        text: t(`Late morning, and three things happen at once. Maru has gone quiet and is looking at her hands. Fernando has been asleep on the sofa for an hour. Benjamin is hunting for the next thing. You can't do all of it. You decide who walks whom home.`, `Media mañana, y pasan tres cosas a la vez. Maru se quedó callada y mira sus manos. Feña lleva una hora dormido en el sofá. Benjamin busca lo siguiente. No puedes con todo. Decides quién acompaña a quién a casa.`, `Fim de manhã, e três coisas acontecem ao mesmo tempo. A Maru ficou quieta e olha pras mãos. O Fernando dorme no sofá faz uma hora. O Benjamin procura a próxima coisa. Você não dá conta de tudo. Decide quem leva quem pra casa.`),
        next: 'm'
      },
      m: { branch: [{ req: withF('maru'), to: 'maru' }, { req: function (s) { return !!(s.after && s.after.f.tato && s.after.f.tato.st === 'sofa'); }, to: 'tato' }, { req: function () { return true; }, to: 'end' }] },
      maru: {
        who: 'maru', text: t(`"I'm okay," Maru says, in the voice that means she isn't. "I'm just very, very tired. I think I'd like to go home."`, `«Estoy bien», dice Maru, con la voz que significa que no. «Solo estoy muy, muy cansada. Creo que quiero irme a casa».`, `«Tô bem», diz a Maru, na voz que quer dizer que não. «Só tô muito, muito cansada. Acho que quero ir pra casa».`),
        choices: [
          K('care', t(`Walk Maru home yourself.`, `Acompañar a Maru a su casa tú mismo o misma.`, `Levar a Maru pra casa você mesmo.`), { do: { time: 40, care: 1, bond: { maru: 2 }, call: 'af_maru_walk', flag: 'maru_walked' }, next: 'm2' }),
          K('care', t(`Ask Benjamin to take her home.`, `Pedirle a Benjamin que la lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('dani'), do: { time: 6, bond: { maru: 1, dani: 1 }, call: 'af_maru_dani', flag: 'maru_dani' }, next: 'm2' }),
          K('chill', t(`Book her a taxi and wait with her until it comes.`, `Pedirle un taxi y esperar con ella hasta que llegue.`, `Pedir um táxi e esperar com ela até chegar.`), { do: { time: 10, soc: -2, bond: { maru: 1 }, call: 'af_maru_taxi', flag: 'maru_taxi' }, next: 'm2' }),
          K('silent', t(`Hug her, let her go, and promise to text.`, `Abrazarla, dejarla ir y prometer escribirle.`, `Abraçar, deixar ir e prometer mandar mensagem.`), { do: { bond: { maru: 1 }, call: 'af_maru_alone' }, next: 'm2' })
        ]
      },
      m2: { branch: [{ req: function (s) { return !!(s.after && s.after.f.tato && s.after.f.tato.st === 'sofa'); }, to: 'tato' }, { req: function () { return true; }, to: 'end' }] },
      tato: {
        who: 'tato', text: t(`Fernando snores gently under his sleeve. Nobody should drag him out of a sleep like that. But a sofa is also not a bed, and the hosts have a day ahead.`, `Feña ronca suavemente bajo su manga. Nadie debería arrancarlo de un sueño así. Pero un sofá tampoco es una cama, y los anfitriones tienen un día por delante.`, `O Fernando ronca de leve na manga. Ninguém devia arrancar ele de um sono desses. Mas sofá também não é cama, e os anfitriões têm um dia pela frente.`),
        choices: [
          K('care', t(`Let him sleep. Dot says he can stay.`, `Dejarlo dormir. Dot dice que puede quedarse.`, `Deixar dormir. A Dot diz que ele pode ficar.`), { do: { bond: { tato: 1 }, flag: 'tato_stays' }, next: 'end' }),
          K('care', t(`Wake him gently and walk him home.`, `Despertarlo con cuidado y llevarlo a casa.`, `Acordar com jeitinho e levar pra casa.`), { do: { time: 35, bond: { tato: 2 }, call: 'af_tato_home', flag: 'tato_walked' }, next: 'end' }),
          K('care', t(`Ask Benjamin to take him home.`, `Pedirle a Benjamin que lo lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('dani'), do: { time: 6, bond: { tato: 1, dani: 1 }, call: 'af_tato_dani', flag: 'tato_dani' }, next: 'end' })
        ]
      },
      end: { text: t(`Done. Nobody is lost, and everyone who leaves has a name next to theirs on the stairs.`, `Listo. Nadie está perdido, y quien se va tiene un nombre junto al suyo en la escalera.`, `Pronto. Ninguém tá perdido, e quem sai tem um nome do lado na escada.`), do: { quest: { q_af7: 'done' } }, next: null }
    }
  };

  /* ============================================================ 6. THE KNOCK: who lives on each wall */
  D.af_marcos = {
    forced: true, who: 'marcos', role: t('ABOVE: THE CEILING', 'ARRIBA: EL TECHO', 'EM CIMA: O TETO'), start: 'a', nodes: {
      a: {
        text: [
          t(`Knock, knock. A man in a sleep-creased T-shirt and one slipper. "Sorry. I have a call at ten, and your floor is my ceiling. I can feel the kick in my teeth."`, `Toc, toc. Un hombre con la camiseta arrugada de dormir y una pantufla. «Perdón. Tengo una llamada a las diez, y tu piso es mi techo. Siento el bombo en los dientes».`, `Toc, toc. Um homem de camiseta amassada de dormir e um chinelo só. «Desculpa. Tenho reunião às dez, e o seu chão é o meu teto. Sinto o bumbo nos dentes».`)
        ],
        choices: [
          K('care', t(`Say sorry, and mean it. Turn the music down now.`, `Pedir perdón, y de verdad. Bajar la música ahora.`, `Pedir desculpa, de verdade. Baixar a música agora.`), { do: { call: 'af_vol0', care: 1, soc: 3, flag: ['marcos_ok'], quest: { q_af6: 'active' } }, next: 'ok' }),
          K('smooth', t(`"Rug only. Socks only. Nobody stomps."`, `«Solo en la alfombra. Solo con calcetines. Nadie pisa fuerte».`, `«Só no tapete. Só de meia. Ninguém pisa forte».`), { do: { call: 'af_dn25', fun: 1, soc: 2, flag: ['marcos_ok'], quest: { q_af6: 'active' } }, next: 'rug' }),
          K('care', t(`"Doña Remedios likes the record. Come and hear it."`, `«A doña Remedios le gusta el disco. Ven a escucharlo».`, `«A dona Remedios gosta do disco. Vem ouvir».`), { req: F('rem_ally'), do: { call: 'af_dn35', soc: 4, flag: ['marcos_ok'], quest: { q_af6: 'active' } }, next: 'remedios' }),
          K('blunt', t(`"It's Sunday morning. People are allowed to dance."`, `«Es domingo por la mañana. La gente puede bailar».`, `«É domingo de manhã. As pessoas podem dançar».`), { do: { soc: -3, call: 'af_up8', flag: 'marcos_cross', quest: { q_af6: 'active' } }, next: 'cross' }),
          K('silent', t(`Pretend nobody's home.`, `Fingir que no hay nadie.`, `Fingir que não tem ninguém em casa.`), { free: true, do: { call: 'af_up8', flag: 'marcos_ignored', quest: { q_af6: 'active' } }, next: null, react: t(`The knocking stops. A note slides under the door. You don't read it. The bass keeps going.`, `Los golpes se detienen. Una nota se desliza bajo la puerta. No la lees. El bajo sigue.`, `As batidas param. Um bilhete desliza por baixo da porta. Você não lê. O grave continua.`) })
        ]
      },
      ok: { text: t(`"Thank you." He lets out a breath. "It's a good party. It's just upstairs of me." You offer him toast. He says he might, after the call.`, `«Gracias». Suelta el aire. «Es una buena fiesta. Solo que está encima de mí». Le ofreces una tostada. Dice que quizás, después de la llamada.`, `«Obrigado». Ele solta o ar. «É uma boa festa. Só que fica em cima de mim». Você oferece torrada. Ele diz que talvez, depois da reunião.`), next: null },
      rug: { text: t(`He looks past you at the rug and the socks. "Okay. The rug." He nods once, which in a neighbour is a handshake.`, `Mira detrás de ti la alfombra y los calcetines. «Está bien. La alfombra». Asiente una vez, que en un vecino es un apretón de manos.`, `Ele olha atrás de você pro tapete e as meias. «Tá bom. O tapete». Assente uma vez, que num vizinho é um aperto de mão.`), next: null },
      remedios: { text: t(`On the balcony Remedios lifts her watering can in salute. Marcos looks at her, then at the record, then at his watch. "Ten minutes. I'll come in my slippers." He does, and he stays six.`, `En el balcón, Remedios levanta su regadera en señal de saludo. Marcos la mira, luego al disco, luego al reloj. «Diez minutos. Voy en pantuflas». Va, y se queda seis.`, `Na varanda a Remedios levanta o regador em saudação. O Marcos olha pra ela, depois pro disco, depois pro relógio. «Dez minutos. Eu vou de chinelo». Vai, e fica seis.`), next: null },
      cross: { text: t(`"Allowed, sure," Marcos says, tired. "Please do it quietly." He goes up the stairs one heavy step at a time. The floor is still a ceiling.`, `«Permitido, claro», dice Marcos, cansado. «Háganlo bajito, por favor». Sube las escaleras de a un paso pesado. El piso sigue siendo un techo.`, `«Pode, claro», diz o Marcos, cansado. «Faz baixinho, por favor». Sobe a escada um passo pesado por vez. O chão continua sendo um teto.`), next: null }
    }
  };
  D.af_beto = {
    forced: true, who: 'beto', role: t('LEFT WALL: THE NIGHT NURSE', 'PARED IZQUIERDA: EL ENFERMERO', 'PAREDE ESQUERDA: O ENFERMEIRO'), start: 'a', nodes: {
      a: {
        text: function (s) {
          return s.flags.mb_visit
            ? [t(`A tired man in scrubs, keys in hand, has just got home. "Your music, I can sleep through. The headboard, I can't. I'm not against anybody's Sunday. It's my wall, that's all."`, `Un hombre cansado con uniforme, las llaves en la mano, acaba de llegar. «Tu música la duermo. El cabecero no. No estoy en contra del domingo de nadie. Es mi pared, nada más».`, `Um homem cansado de uniforme, chaves na mão, acabou de chegar. «A sua música eu durmo. A cabeceira, não. Não sou contra o domingo de ninguém. É a minha parede, só isso».`)]
            : [t(`A tired man in scrubs, keys in hand, has just got home from a shift. "My bed is on the other side of your speaker. I'm not angry. I'm horizontal-adjacent."`, `Un hombre cansado con uniforme, las llaves en la mano, acaba de llegar del turno. «Mi cama está al otro lado de tu parlante. No estoy enojado. Estoy casi horizontal».`, `Um homem cansado de uniforme, chaves na mão, acabou de chegar do plantão. «Minha cama fica do outro lado do seu alto-falante. Não tô bravo. Tô quase horizontal».`)];
        },
        choices: [
          K('care', t(`Say sorry. Move the party to the other end and close the doors.`, `Pedir perdón. Llevar la fiesta al otro extremo y cerrar las puertas.`, `Pedir desculpa. Levar a festa pro outro lado e fechar as portas.`), { do: { call: 'af_dn25', care: 1, soc: 3, time: 6, flag: 'beto_ok' }, next: 'ok' }),
          K('care', t(`Offer a quiet hour: no bass until he has slept.`, `Ofrecer una hora de silencio: sin bajo hasta que haya dormido.`, `Oferecer uma hora de silêncio: sem grave até ele dormir.`), { do: { call: 'af_vol0', care: 1, soc: 4, flag: ['beto_ok', 'quiet_hour'] }, next: 'quiet' }),
          K('joke', t(`"There's a sign on that door. It says ask first. The wall hasn't been asked."`, `«Hay un cartel en esa puerta. Dice pregunta primero. A la pared nadie le preguntó».`, `«Tem um cartaz naquela porta. Diz pergunta primeiro. A parede não foi perguntada».`), { req: F('mb_visit'), do: { call: 'af_dn15', fun: 3, soc: 1, flag: 'beto_ok' }, next: 'laugh' }),
          K('silent', t(`Don't answer.`, `No contestar.`, `Não responder.`), { free: true, do: { call: 'af_up8', flag: 'beto_ignored' }, next: null, react: t(`Three more knocks. Then a long silence, and the sound of someone sitting down against the door.`, `Tres golpes más. Después un silencio largo, y el sonido de alguien que se sienta contra la puerta.`, `Mais três batidas. Depois um silêncio longo, e o som de alguém sentando contra a porta.`) })
        ]
      },
      ok: { text: t(`"Thank you." He rubs his face. "I'll sleep through the rest. Knock if there's a fire." He is already gone.`, `«Gracias». Se frota la cara. «Duermo el resto. Toquen si hay un incendio». Ya se fue.`, `«Obrigado». Esfrega o rosto. «Eu durmo o resto. Batam se tiver incêndio». Já foi.`), next: null },
      quiet: { text: t(`"A quiet hour," he repeats, wondering. "I'll set an alarm. You are good people." He goes, and the flat hears itself.`, `«Una hora de silencio», repite, asombrado. «Pongo una alarma. Son gente buena». Se va, y el departamento se oye a sí mismo.`, `«Uma hora de silêncio», repete, espantado. «Vou botar um alarme. Vocês são gente boa». Vai, e o apê se escuta.`), next: null },
      laugh: { text: t(`He laughs once, short and surprised. "Fair. Whoever's in there: bravo, and quieter." He gives you a thumbs up so tired it is almost a salute.`, `Se ríe una vez, corta y sorprendida. «Justo. Quien esté ahí: bravo, y más bajito». Te hace un pulgar tan cansado que casi es un saludo.`, `Ele ri uma vez, curta e surpresa. «Justo. Quem tá aí: bravo, e mais baixo». Faz um joinha tão cansado que quase é uma continência.`), next: null }
    }
  };
  D.af_quiroga1 = {
    forced: true, who: 'quiroga', role: t('THE LANDLORD', 'EL DUEÑO', 'O DONO'), start: 'a', nodes: {
      a: {
        text: [
          t(`Anselm opens the door and his shoulders drop. The landlord stands on the mat in his coat, a folder under one arm. "Third floor, second complaint of the year. The Alvarados have a four-month-old who hasn't slept since your first record."`, `Anselm abre la puerta y se le caen los hombros. El dueño está en el felpudo, con su abrigo y una carpeta bajo el brazo. «Tercer piso, segunda queja del año. Los Alvarado tienen una bebé de cuatro meses que no duerme desde tu primer disco».`, `O Anselm abre a porta e os ombros dele caem. O dono tá no capacho, de casaco, uma pasta debaixo do braço. «Terceiro andar, segunda reclamação do ano. Os Alvarado têm um bebê de quatro meses que não dorme desde o seu primeiro disco».`),
          t(`"I'm not here to shout," he adds. "I'm here to say this is a home, and so is the one below it."`, `«No vengo a gritar», añade. «Vengo a decir que esto es un hogar, y el de abajo también».`, `«Não vim pra gritar», acrescenta. «Vim dizer que isso é um lar, e o de baixo também».`)
        ],
        choices: [
          K('care', t(`Apologise with Anselm. "It stops now. We'll clean the stairs too."`, `Pedir perdón junto con Anselm. «Se acaba ahora. Además limpiamos la escalera».`, `Pedir desculpa com o Anselm. «Acaba agora. A gente limpa a escada também».`), { do: { care: 1, soc: 4, call: 'af_quiroga_down', flag: ['quiroga_warned', 'quiroga_ok'], quest: { q_af6: 'done' } }, next: 'ok' }),
          K('care', t(`Ask what the Alvarados need. "Can we bring something down?"`, `Preguntar qué necesitan los Alvarado. «¿Podemos bajarles algo?»`, `Perguntar o que os Alvarado precisam. «A gente pode levar alguma coisa lá embaixo?»`), { do: { care: 2, soc: 5, call: 'af_quiroga_down', flag: ['quiroga_warned', 'alv_gift'], quest: { q_af6: 'done' } }, next: 'gift' }),
          K('care', t(`Send a loaf of the bakery bread down to the Alvarados.`, `Mandar un pan de la panadería a los Alvarado.`, `Mandar um pão da padaria pros Alvarado.`), { req: F('brought_food'), do: { care: 2, soc: 6, call: 'af_quiroga_down', flag: ['quiroga_warned', 'alv_bread'], quest: { q_af6: 'done' } }, next: 'bread' }),
          K('blunt', t(`"It's one morning. People live here too."`, `«Es una mañana. Aquí también vive gente».`, `«É uma manhã. Gente mora aqui também».`), { do: { soc: -4, call: 'af_quiroga_down', flag: ['quiroga_warned', 'quiroga_cross'], quest: { q_af6: 'done' } }, next: 'cross' })
        ]
      },
      ok: { text: t(`"Thank you. Keep it like this." He leaves. Nobody says anything for a while. The records go back in their sleeves. The flat is, at last, just a flat.`, `«Gracias. Manténganlo así». Se va. Nadie dice nada por un rato. Los discos vuelven a sus fundas. El departamento suena, por fin, como un departamento.`, `«Obrigado. Mantenham assim». Ele vai embora. Ninguém diz nada por um tempo. Os discos voltam pras capas. O apê soa, enfim, como um apê.`), next: null },
      gift: { text: t(`He blinks. "A… cup of tea, a loaf, something like that." He writes nothing in the folder. "That would be kind." It is the first time he has smiled in the doorway.`, `Parpadea. «Una… taza de té, un pan, algo así». No escribe nada en la carpeta. «Sería amable». Es la primera vez que sonríe en el umbral.`, `Ele pisca. «Uma… xícara de chá, um pão, algo assim». Não escreve nada na pasta. «Seria gentil». É a primeira vez que ele sorri na porta.`), next: null },
      bread: { text: t(`You hand him a warm loaf in paper. He holds it like something that could go off. "For the baby's parents. Fine. I'll take it down myself." He doesn't write anything in the folder.`, `Le das un pan tibio en papel. Lo sostiene como algo que puede explotar. «Para los padres de la bebé. Bien. Lo bajo yo». No escribe nada en la carpeta.`, `Você entrega um pão morno num papel. Ele segura como se pudesse explodir. «Pros pais do bebê. Tá bem. Eu mesmo levo». Não escreve nada na pasta.`), next: null },
      cross: { text: t(`"People live here," he agrees, flatly. "That is the point." He writes something in the folder and shuts it. "Quiet. Please."`, `«Aquí vive gente», concuerda, sin inflexión. «Ese es el punto». Escribe algo en la carpeta y la cierra. «Silencio. Por favor».`, `«Gente mora aqui», concorda, seco. «Esse é o ponto». Escreve algo na pasta e fecha. «Silêncio. Por favor».`), next: null }
    }
  };
  D.af_quiroga2 = {
    forced: true, who: 'quiroga', role: t('THE LANDLORD', 'EL DUEÑO', 'O DONO'), start: 'a', nodes: {
      a: {
        text: t(`The landlord is back, and this time there is no folder. "I said once." Anselm says, very quietly, "I know." Everybody starts putting their shoes on without being asked.`, `El dueño volvió, y esta vez sin carpeta. «Dije una vez». Anselm dice, muy bajito, «ya sé». Todos empiezan a ponerse los zapatos sin que se los pidan.`, `O dono voltou, e dessa vez sem pasta. «Eu disse uma vez». O Anselm diz, bem baixinho, «eu sei». Todo mundo começa a calçar os sapatos sem ninguém pedir.`),
        choices: [
          K('care', t(`Help carry the records down to the car.`, `Ayudar a bajar los discos al auto.`, `Ajudar a levar os discos até o carro.`), { free: true, do: { care: 1, flag: 'after_evicted' }, call: 'af_end_after', next: null }),
          K('care', t(`Apologise to Quiroga and leave quietly.`, `Pedir perdón a Quiroga e irte en silencio.`, `Pedir desculpa ao Quiroga e sair em silêncio.`), { free: true, do: { flag: 'after_evicted' }, call: 'af_end_after', next: null })
        ]
      }
    }
  };
  D.af_front = {
    start: 'a', nodes: {
      a: {
        text: t(`The front door, and the stairs behind it. You've done your bit. Your legs want a bed.`, `La puerta de entrada, y las escaleras detrás. Ya hiciste lo tuyo. Tus piernas quieren una cama.`, `A porta da frente, e a escada atrás. Você já fez a sua parte. Suas pernas querem uma cama.`),
        choices: [
          K('chill', t(`Stay a bit longer.`, `Quedarte un poco más.`, `Ficar mais um pouco.`), { free: true, next: null }),
          K('care', t(`Say your goodbyes and go home. Your people come with you.`, `Despedirte e irte a casa. Tu gente va contigo.`, `Se despedir e ir pra casa. Sua galera vai junto.`), { free: true, do: { flag: 'after_early' }, call: 'af_end_after', next: null })
        ]
      }
    }
  };

  /* ============================================================ the three scenes that close the chapter */
  D.af_noon = {
    forced: true, who: 'dot', role: t('NOON', 'MEDIODÍA', 'MEIO-DIA'), start: 'a', nodes: {
      a: {
        text: function (s) {
          const f = s.flags, out = [t(`The flat is quiet at noon. Sun on the floorboards, a kettle ticking as it cools, the records back in their sleeves in the order Anselm likes.`, `El departamento está en silencio a mediodía. Sol en el piso de madera, una tetera que chasquea al enfriarse, los discos de vuelta en sus fundas en el orden que le gusta a Anselm.`, `O apê tá quieto ao meio-dia. Sol no assoalho, uma chaleira estalando enquanto esfria, os discos de volta nas capas na ordem que o Anselm gosta.`)];
          if (f.af_clean || f.af_trash || f.brought_food) out.push(t(`Dot looks around the kitchen and finds it cleaner than the night before. "You washed up. You carried things. People think a host's burden is the party. It's the next day."`, `Dot mira la cocina y la encuentra más limpia que la noche anterior. «Lavaste. Cargaste cosas. La gente piensa que la carga del anfitrión es la fiesta. Es el día siguiente».`, `A Dot olha a cozinha e acha mais limpa que na noite anterior. «Você lavou. Carregou coisas. As pessoas acham que o peso do anfitrião é a festa. É o dia seguinte».`));
          if (f.quiroga_warned) out.push(t(`Anselm, hugging a sleeve: "The building warned us once and let us stay. I think the Alvarados have forgiven us."`, `Anselm, abrazando una funda: «El edificio nos avisó una vez y nos dejó quedarnos. Creo que los Alvarado nos perdonaron».`, `O Anselm, abraçando uma capa: «O prédio avisou a gente uma vez e deixou ficar. Acho que os Alvarado perdoaram a gente».`));
          return out;
        },
        choices: [K('chill', t(`Put your shoes on. Say thank you.`, `Ponerte los zapatos. Dar las gracias.`, `Calçar os sapatos. Agradecer.`), { free: true, next: null })]
      }
    }
  };
  D.af_out = {
    forced: true, who: 'anselm', role: t('YOUR HOST', 'TU ANFITRIÓN', 'SEU ANFITRIÃO'), start: 'a', nodes: {
      a: {
        text: t(`Anselm does not raise his voice. "This is our home. You pushed twice. Please go." He holds the door open with one hand. You can hear the kettle behind him.`, `Anselm no levanta la voz. «Esta es nuestra casa. Empujaste dos veces. Por favor, vete». Sostiene la puerta abierta con una mano. Se oye la tetera detrás de él.`, `O Anselm não levanta a voz. «Essa é a nossa casa. Você empurrou duas vezes. Por favor, vá». Segura a porta aberta com uma mão. Dá pra ouvir a chaleira atrás dele.`),
        choices: [K('care', t(`Apologise and go.`, `Pedir perdón e irte.`, `Pedir desculpa e ir.`), { free: true, next: null })]
      }
    }
  };
  D.af_evicted = {
    forced: true, who: 'quiroga', role: t('THE LANDLORD', 'EL DUEÑO', 'O DONO'), start: 'a', nodes: {
      a: {
        text: t(`The corridor, shoes in hand, one by one down the stairs. Quiroga holds the door and counts the guests as they leave. "Thank you. I'm sorry. Good morning."`, `El pasillo, los zapatos en la mano, uno por uno por la escalera. Quiroga sostiene la puerta y cuenta a los invitados al salir. «Gracias. Lo siento. Buenos días».`, `O corredor, sapatos na mão, um por um pela escada. O Quiroga segura a porta e conta os convidados saindo. «Obrigado. Sinto muito. Bom dia».`),
        choices: [K('chill', t(`Go home.`, `Irte a casa.`, `Ir pra casa.`), { free: true, next: null })]
      }
    }
  };

  /* ============================================================ the later hooks: buddies, the lone sleeper, the missions that close by themselves */
  const sch0 = AF.schedule;
  AF.schedule = function (s) {
    sch0(s);
    if (!s.after) return;
    const f = s.flags, now = s.time, at = s.flagAt || {};
    if (s.quests.q_af3 === 'active' && ['sam_ok', 'rey_ok', 'vik_ok'].filter(function (k) { return f[k]; }).length >= 2) {
      L.setQuest('q_af3', 'done'); U.toast({ icon: 'heart', kind: 'good', ms: 5200, text: t(`The kitchen is looked after. Dot nods at you over the eggs.`, `La cocina está atendida. Dot te asiente por encima de los huevos.`, `A cozinha tá cuidada. A Dot assente pra você por cima dos ovos.`) });
    }
    if (f.rey_buddy && !f.rey_checked && now >= (at.rey_buddy || now) + 60) { f.rey_checked = true; L.apply({ soc: 3, fun: 2 }); U.toast({ icon: 'heart', kind: 'good', ms: 5600, text: t(`An hour is up. You look in on Rey: cool, calm, eating toast. "You came back," they say. It counts for something.`, `Pasó la hora. Pasas a ver a Rey: fresco, tranquilo, comiendo tostadas. «Volviste», dicen. Eso cuenta.`, `Passou uma hora. Você vai ver o Rey: fresco, calmo, comendo torrada. «Você voltou», diz. Isso conta.`) }); }
    if (f.lio_alone && !f.lio_found && now >= (at.lio_alone || now) + 25) { f.lio_found = true; L.apply({ soc: -4 }); U.toast({ icon: 'cross', kind: 'bad', ms: 6500, text: t(`Mo found Lio and sat with them. Lio is okay. You could have been the one.`, `Mo encontró a Lio y se sentó con ellos. Lio está bien. Pudiste haber sido tú.`, `A Mo achou o Lio e sentou junto. O Lio tá bem. Podia ter sido você.`) }); }
    if (s.quests.q_af6 === 'active' && f.marcos_ok && f.beto_ok) L.setQuest('q_af6', 'done');
    if (!s.quests.q_af6 && s.after.st >= 1) L.setQuest('q_af6', 'active');
  };
})();

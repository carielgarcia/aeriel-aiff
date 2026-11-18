/* EXCUSE ME — THE AFTER (hosts & walls): Anselm, Dot, kitchen aftercare, Lio, neighbours, and friends. */
'use strict';
/* ---- consolidated from story_v32.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui;
  const D = EM.DIALOGUES, S = EM.scripts, AF = EM.AF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };
  const NF = function (f) { return function (s) { return !s.flags[f]; }; };
  const LEAVE = function () { return K('chill', t(`Leave it there.`, `Dejarlo ahí.`, `Deixar por aqui.`), { free: true, next: null }); };
  const deep = function (s) { return !!(s.flags.one_yes || (s.after && s.after.st >= 2 && !s.flags.one_no)); };

  S.af_noise12 = function () { AF.noise(12); };
  S.af_lio_cost = function () {
    const s = EM.state;
    AF.noise(12);
    s.flags.pasc_spooked = true; s.flags.one_done = true;
    if (s.quests.q_af5 === 'active') L.setQuest('q_af5', 'done');
  };
  S.af_rem_played = function () { AF.noise(2); };

  /* ============================================================ 1. GETTING THERE */
  D.af_travel = {
    forced: true, who: 'anselm', role: t('THE GROUP CHAT', 'EL CHAT GRUPAL', 'O GRUPO NO ZAP'), start: 'a', nodes: {
      a: {
        text: [
          t(`Seven in the morning. The pavement is the colour of wet cardboard and your phone is a group chat going two ways at once.`, `Siete de la mañana. La banqueta es del color del cartón mojado y tu celular es un chat grupal que va para dos lados a la vez.`, `Sete da manhã. A calçada tem cor de papelão molhado e seu celular é um grupo que vai pra dois lados ao mesmo tempo.`),
          t(`ANSELM: taxi's expensive, Tomi has his car. TOMI: haven't slept since Thursday but I drive better tired. DOT: please don't. TOMI: it's ten minutes. DOT: it's the ten minutes people have.`, `ANSELM: el taxi sale caro, Tomi tiene su auto. TOMI: no duermo desde el jueves pero manejo mejor cansado. DOT: por favor no. TOMI: son diez minutos. DOT: son los diez minutos que tiene la gente.`, `ANSELM: táxi sai caro, o Tomi tem o carro. TOMI: não durmo desde quinta mas dirijo melhor cansado. DOT: por favor não. TOMI: são dez minutos. DOT: são os dez minutos que todo mundo tem.`)
        ],
        choices: [
          K('care', t(`"Nobody drives tired. We split a taxi."`, `«Nadie maneja cansado. Compartimos un taxi».`, `«Ninguém dirige cansado. A gente racha um táxi».`), { next: 'taxi' }),
          K('chill', t(`"It's ten minutes. We walk."`, `«Son diez minutos. Caminamos».`, `«São dez minutos. A gente anda».`), { next: 'walk' }),
          K('bold', t(`"Sure, Tomi. Let's go."`, `«Claro, Tomi. Vamos».`, `«Claro, Tomi. Bora».`), { next: 'lift' })
        ]
      },
      taxi: {
        text: t(`Four of you in the back of a Skoda, the fare split in thirds on three phones. Tomi sits in the front with his forehead on the window and is asleep before the first light changes. Nobody has to be brave.`, `Cuatro en el asiento de atrás de un Skoda, la tarifa dividida en tres partes en tres celulares. Tomi va adelante con la frente en la ventana y se duerme antes del primer semáforo. Nadie tiene que ser valiente.`, `Quatro no banco de trás de um Skoda, a corrida dividida em três em três celulares. O Tomi vai na frente com a testa na janela e dorme antes do primeiro sinal. Ninguém precisa ser corajoso.`),
        do: { care: 1, time: 25, soc: -2, pb: { luisa: 1, benjamin: 1, fena: 1 }, flag: 'af_taxi' }, next: 'arrive'
      },
      walk: {
        text: t(`Cold light on wet streets, a bakery with its shutter half up, someone's shoes squeaking. You walk because it's ten minutes and because none of you can sit still. Fernando hugs a lamp post for about four seconds and says it was holding him up.`, `Luz fría sobre calles mojadas, una panadería con la cortina a medias, el chillido de unos zapatos. Caminan porque son diez minutos y porque ninguno puede quedarse quieto. Feña abraza un poste cuatro segundos y dice que lo estaba sosteniendo.`, `Luz fria em ruas molhadas, uma padaria com a porta de enrolar pela metade, o chiado de um sapato. Vocês andam porque são dez minutos e porque ninguém consegue ficar parado. O Fernando abraça um poste por uns quatro segundos e diz que o poste tava segurando ele.`),
        do: { fun: 4, hp: -3, time: 45, flag: 'af_walked' }, next: 'arrive'
      },
      lift: {
        text: t(`Tomi's car smells of energy drink and wet dog. His hands drum the wheel. His eyes keep closing, long enough to count.`, `El auto de Tomi huele a bebida energética y perro mojado. Sus manos tamborilean el volante. Los ojos se le cierran, lo bastante largo como para contar.`, `O carro do Tomi cheira a energético e cachorro molhado. As mãos dele tamborilam no volante. Os olhos fecham, tempo suficiente pra contar.`),
        choices: [
          K('honest', t(`Say it: "Not like this. A taxi, and I'll cover half."`, `Decirlo: «Así no. Un taxi, y yo pago la mitad».`, `Dizer: «Assim não. Um táxi, e eu pago metade».`), { do: { care: 1, soc: 3, time: 22, flag: ['af_taxi', 'tomi_slept'], pb: { luisa: 1, benjamin: 1, fena: 1 } }, next: 'tomi' }),
          K('chill', t(`Get in anyway. It's ten minutes.`, `Subirte igual. Son diez minutos.`, `Entrar mesmo assim. São dez minutos.`), { do: { hp: -8, soc: -4, time: 12, flag: 'tomi_drove' }, next: 'drove' })
        ]
      },
      tomi: {
        text: t(`Tomi hands you the keys without a fight. "I drive nights. If I don't get the fares I don't make rent, so I don't stop. That's not brave, that's broke." He curls up in the back of the taxi before it moves. "Thanks for saying it. I couldn't."`, `Tomi te da las llaves sin pelear. «Manejo de noche. Si no hago las carreras no pago el alquiler, así que no paro. Eso no es valentía, es estar pelado». Se hace bolita en el asiento de atrás del taxi antes de que arranque. «Gracias por decirlo. Yo no pude».`, `O Tomi te entrega a chave sem brigar. «Eu dirijo à noite. Se não faço as corridas não pago o aluguel, então não paro. Isso não é coragem, é estar quebrado». Ele se encolhe no banco de trás do táxi antes de arrancar. «Valeu por dizer. Eu não consegui».`),
        next: 'arrive'
      },
      drove: {
        text: t(`At a red light Tomi's eyes close one second too long and the car drifts across the line. A horn. Somebody shouts. It stops. Nobody speaks for three streets. His knuckles are white. "Never again," he says to the windscreen. He means it. That doesn't help.`, `En un semáforo en rojo a Tomi se le cierran los ojos un segundo de más y el auto se va sobre la línea. Una bocina. Alguien grita. Frena. Nadie habla durante tres calles. Tiene los nudillos blancos. «Nunca más», le dice al parabrisas. Lo dice en serio. No ayuda.`, `Num sinal vermelho os olhos do Tomi fecham um segundo a mais e o carro cruza a faixa. Uma buzina. Alguém grita. Ele freia. Ninguém fala por três ruas. Os nós dos dedos dele estão brancos. «Nunca mais», diz pro para-brisa. Ele fala sério. Não ajuda.`),
        next: 'arrive'
      },
      arrive: {
        text: t(`Third floor, no lift, a door already open. Dot is in socks. Anselm holds a record sleeve in both hands, flat, a plate of vinyl. "Welcome. Come in before the stairs hear you."`, `Tercer piso, sin ascensor, una puerta ya abierta. Dot en calcetines. Anselm sostiene una funda de disco con las dos manos, plana, un plato de vinilo. «Bienvenidos. Entren antes de que las escaleras los oigan».`, `Terceiro andar, sem elevador, uma porta já aberta. A Dot de meia. O Anselm segura uma capa de disco com as duas mãos, plana, um prato de vinil. «Bem-vindos. Entrem antes que a escada ouça».`),
        choices: [K('care', t(`Climb the last stairs.`, `Subir los últimos escalones.`, `Subir os últimos degraus.`), { do: { quest: { q_af1: 'done', q_af2: 'active' } }, call: 'af_arrive', next: null })]
      }
    }
  };

  /* ============================================================ 2. HOUSE RULES: the Æ000.X no-photos rule at living-room scale */
  D.af_dot_door = {
    who: 'dot', role: t('HOST', 'ANFITRIONA', 'ANFITRIÃ'), start: 'a', nodes: {
      a: { text: t(`"Rules first, then coffee. It takes a minute."`, `«Primero las reglas, luego el café. Toma un minuto».`, `«Primeiro as regras, depois o café. Leva um minuto».`), choices: [K('care', t(`Hear the rules.`, `Escuchar las reglas.`, `Ouvir as regras.`), { next: null, call: 'af_rules' })] }
    }
  };
  D.af_rules = {
    forced: true, who: 'dot', role: t('HOST', 'ANFITRIONA', 'ANFITRIÃ'), start: 'a', nodes: {
      a: {
        text: t(`"Three rules, and then I'll stop being the one who says them. One: shoes off. Two: phones in the basket, no photos of anyone, ever. I'm not asking you to trust me, I'm asking you to put it in the bowl. Three: ask before you touch Anselm's records, because he will cry and then he'll be polite about it." Anselm, from behind the table: "I'll cry quietly. The walls are thin."`, `«Tres reglas, y después dejo de ser la que las dice. Una: zapatos afuera. Dos: celulares en la canasta, sin fotos de nadie, nunca. No les pido que confíen en mí, les pido que lo pongan en el bol. Tres: pregunten antes de tocar los discos de Anselm, porque va a llorar y luego va a ser educado al respecto». Anselm, desde atrás de la mesa: «Lloraré bajito. Las paredes son finas».`, `«Três regras, e depois eu paro de ser a que fala delas. Um: sapato fora. Dois: celular na cesta, sem foto de ninguém, nunca. Não tô pedindo pra confiar em mim, tô pedindo pra botar na cesta. Três: pergunta antes de encostar nos discos do Anselm, porque ele vai chorar e depois vai ser educado sobre isso». O Anselm, de trás da mesa: «Vou chorar baixinho. As paredes são finas».`),
        choices: [
          K('care', t(`Put your phone in the basket. Shoes by the door.`, `Dejar el celular en la canasta. Zapatos junto a la puerta.`, `Botar o celular na cesta. Sapatos na porta.`), { do: { care: 1, soc: 2, flag: ['af_rules', 'phone_basket', 'mb_open'], quest: { q_af2: 'done', q_af3: 'active', q_af8: 'active' } }, next: 'ok' }),
          K('honest', t(`Keep the phone in your pocket, off, on your word.`, `Dejar el celular en el bolsillo, apagado, bajo tu palabra.`, `Deixar o celular no bolso, desligado, na sua palavra.`), { do: { soc: -1, flag: ['af_rules', 'phone_kept', 'mb_open'], quest: { q_af2: 'done', q_af3: 'active', q_af8: 'active' } }, next: 'pocket' }),
          K('bold', t(`Take one quick photo of the shoe pile. "It's art."`, `Sacar una foto rápida de la pila de zapatos. «Es arte».`, `Tirar uma foto rápida da pilha de sapatos. «É arte».`), { do: { flag: ['af_rules', 'phone_basket', 'mb_open'], quest: { q_af2: 'done', q_af3: 'active', q_af8: 'active' } }, call: 'af_push', next: 'photo' })
        ]
      },
      ok: { text: t(`"Thank you." Dot points down the hall. "Kitchen's through there, there's toast. The room at the end is open to anyone who wants it, and it has its own rules. Ask me and I'll walk you in."`, `«Gracias». Dot señala el pasillo. «La cocina está por ahí, hay tostadas. El cuarto del fondo está abierto para quien quiera, y tiene sus propias reglas. Pídemelo y te acompaño».`, `«Obrigada». A Dot aponta o corredor. «A cozinha é por ali, tem torrada. O quarto do fundo tá aberto pra quem quiser, e tem regras próprias. Me pede e eu te levo».`), next: null },
      pocket: { text: t(`"Then it stays there. If I see it out, it goes in the basket, no hard feelings." A brief smile. "And the room at the end asks for phones at the door. Ask me and I'll walk you in."`, `«Entonces se queda ahí. Si lo veo afuera, va a la canasta, sin rencores». Una sonrisa breve. «Y el cuarto del fondo pide los celulares en la puerta. Pídemelo y te acompaño».`, `«Então fica aí. Se eu vir fora, vai pra cesta, sem ressentimento». Um sorriso breve. «E o quarto do fundo pede o celular na porta. Me pede e eu te levo».`), next: null },
      photo: { text: t(`Dot's hand closes over your phone before the screen lights. She drops it in the basket. She doesn't raise her voice and she doesn't smile. "Not in here. It's the only thing I'll be strict about all day."`, `La mano de Dot se cierra sobre tu celular antes de que se encienda la pantalla. Lo deja caer en la canasta. No levanta la voz y no sonríe. «Aquí no. Es lo único en lo que voy a ser estricta todo el día».`, `A mão da Dot fecha sobre seu celular antes de a tela acender. Ela solta na cesta. Não levanta a voz e não sorri. «Aqui não. É a única coisa em que eu vou ser rígida o dia todo».`), next: null }
    }
  };
  D.af_basket = {
    start: 'a', nodes: {
      a: {
        text: t(`The basket is a bowl of dark glass screens and a couple of paperbacks. Yours is still in your pocket, on your word.`, `La canasta es un bol de pantallas oscuras y un par de libros de bolsillo. El tuyo sigue en tu bolsillo, bajo tu palabra.`, `A cesta é uma tigela de telas escuras e um par de livros de bolso. O seu continua no bolso, na sua palavra.`),
        choices: [
          K('care', t(`Put your phone in.`, `Poner tu celular.`, `Botar seu celular.`), { do: { soc: 1, flag: 'phone_basket', unflag: 'phone_kept' }, next: null }),
          K('chill', t(`Leave it.`, `Dejarlo.`, `Deixar.`), { free: true, next: null })
        ]
      }
    }
  };

  /* ============================================================ ANSELM and the records */
  function crateNodes(backTo) {
    return {
      crate: {
        text: function (s) {
          const cur = s.flags.af_music || '';
          const mode = cur === 'hypnotic' ? t('Hypnotic Techno', 'Techno hipnótico', 'Techno hipnótico')
            : cur === 'hardgroove' ? t('Hardgroove', 'Hardgroove', 'Hardgroove')
            : cur === 'bossa' ? t('Bossa Nova', 'Bossa nova', 'Bossa nova')
            : t('full crate rotation', 'rotación completa del cajón', 'rotação completa do caixote');
          return t(`Anselm lifts the tonearm and checks the stack. Right now the flat is on ${mode}. "Which side are we playing?"`, `Anselm levanta el brazo y revisa la pila. Ahora el departamento está en ${mode}. «¿Qué lado ponemos?»`, `O Anselm levanta o braço e confere a pilha. Agora o apê tá em ${mode}. «Qual lado a gente bota?»`);
        },
        choices: [
          K('chill', t(`Hypnotic Techno — steady, deep, locked grooves.`, `Techno hipnótico — firme, profundo, loops cerrados.`, `Techno hipnótico — firme, profundo, loops fechados.`), { free: true, call: 'af_pick_hypnotic', next: 'picked_hyp' }),
          K('bold', t(`Hardgroove — rolling percussion, warm drive.`, `Hardgroove — percusión fluida, empuje cálido.`, `Hardgroove — percussão fluida, balanço quente.`), { free: true, call: 'af_pick_hardgroove', next: 'picked_hg' }),
          K('care', t(`Bossa Nova — soft nylon chords, brushed snare.`, `Bossa nova — acordes suaves de nailon, escobillas.`, `Bossa nova — acordes suaves de nylon, vassourinha.`), { free: true, call: 'af_pick_bossa', next: 'picked_bossa' }),
          K('plan', t(`Full crate — rotate across everything.`, `Cajón completo — rotar por todo.`, `Caixote inteiro — rodar por tudo.`), { free: true, call: 'af_pick_mix', next: 'picked_mix' }),
          K('chill', t(`Back.`, `Volver.`, `Voltar.`), { free: true, next: backTo })
        ]
      },
      picked_hyp: { text: t(`He drops the needle onto a plain white label. A deep, hypnotic pulse settles into the floorboards without waking the ceiling.`, `Apoya la púa sobre una etiqueta blanca sin texto. Un pulso hipnótico y profundo se asienta en las tablas sin despertar al techo.`, `Ele pousa a agulha num selo branco sem texto. Um pulso hipnótico e fundo se assenta no assoalho sem acordar o teto.`), next: null },
      picked_hg: { text: t(`He cues up a scuffed twelve-inch. Rolled percussion and warm low end tug the living room back onto its feet.`, `Prepara un doce pulgadas gastado. Percusión rodada y graves cálidos vuelven a poner la sala de pie.`, `Ele prepara um doze polegadas gasto. Percussão corrida e grave quente botam a sala de pé de novo.`), next: null },
      picked_bossa: { text: t(`He pulls a worn sleeve from the back of the crate. Soft nylon chords and brushed snare spill across the kilim rug like sunlight.`, `Saca una funda gastada del fondo del cajón. Acordes suaves de nailon y escobillas se derraman por la alfombra como luz de sol.`, `Ele puxa uma capa gasta do fundo do caixote. Acordes suaves de nylon e vassourinha se espalham pelo tapete feito luz do sol.`), next: null },
      picked_mix: { text: t(`"Back to the full crate, then." He leans three sleeves against the lamp so the needle keeps moving between worlds.`, `«De vuelta al cajón completo, entonces». Apoya tres fundas contra la lámpara para que la púa siga viajando entre mundos.`, `«De volta ao caixote inteiro, então». Ele apoia três capas no abajur pra agulha continuar viajando entre mundos.`), next: null }
    };
  }
  D.af_anselm = {
    who: 'anselm', role: t('HOST', 'ANFITRIÓN', 'ANFITRIÃO'), start: 'st', nodes: Object.assign({
      st: { branch: [{ req: function (s) { return !!s.flags.rem_met && !s.flags.rem_played && !!s.flags.rec_ok; }, to: 'rem' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`Anselm has his hands flat on the table, guarding the records. "I'll play anything you ask for, as long as it's quiet. If you want to hold one, ask me first. I'm going to watch you hold it. I'm sorry. It's a flaw."`, `Anselm tiene las manos planas sobre la mesa, guardando los discos. «Pongo lo que me pidan, mientras sea bajito. Si quieres sostener uno, pregúntame antes. Te voy a mirar sostenerlo. Perdón. Es un defecto».`, `O Anselm tem as mãos espalmadas na mesa, guardando os discos. «Eu toco o que pedirem, desde que seja baixinho. Se quiser segurar um, pergunta antes. Vou ficar te olhando segurar. Desculpa. É um defeito».`),
        choices: [
          K('care', t(`"May I look through them? I'll ask for each one."`, `«¿Puedo mirarlos? Te pregunto por cada uno».`, `«Posso olhar? Eu pergunto de cada um».`), { req: NF('rec_ok'), do: { flag: 'rec_ok', fun: 2, soc: 2, time: 4 }, next: 'rec' }),
          K('chill', t(`Ask for something quiet.`, `Pedirle algo tranquilo.`, `Pedir algo calmo.`), { call: 'af_set0', next: 'quiet' }),
          K('joke', t(`Ask for something loud.`, `Pedirle algo fuerte.`, `Pedir algo alto.`), { do: { fun: 2 }, call: 'af_set2', next: 'loud' }),
          K('ask', t(`Pick what goes on the turntable.`, `Elegir qué suena en el tocadiscos.`, `Escolher o que toca na vitrola.`), { free: true, next: 'crate' }),
          K('ask', t(`Ask how he's doing with all this.`, `Preguntarle cómo lleva todo esto.`, `Perguntar como ele tá lidando com tudo isso.`), { req: F('rec_ok'), next: 'c' }),
          K('chill', t(`Go and help Dot.`, `Ir a ayudar a Dot.`, `Ir ajudar a Dot.`), { free: true, next: null })
        ]
      },
      rec: {
        text: t(`He slides one out and turns it so you can read the sleeve. "My mother's. She never owned a record player. She bought me one a month at the market for eleven years, and I didn't tell her I had nothing to play them on until I was twenty-six. She said she knew." His eyes go soft. "Hold it by the edges." You do. It's lighter than you expected.`, `Saca uno y lo gira para que leas la funda. «De mi mamá. Nunca tuvo tocadiscos. Me compraba uno al mes en el mercado durante once años y no le dije que no tenía dónde ponerlos hasta los veintiséis. Dijo que ya lo sabía». Se le suavizan los ojos. «Agárralo por los bordes». Lo haces. Es más liviano de lo que esperabas.`, `Ele desliza um pra fora e vira pra você ler a capa. «Da minha mãe. Ela nunca teve toca-discos. Comprava um por mês na feira pra mim durante onze anos, e eu só contei que não tinha onde tocar aos vinte e seis. Ela disse que já sabia». Os olhos dele amolecem. «Segura pelas bordas». Você segura. É mais leve do que esperava.`),
        next: 'a'
      },
      c: {
        text: t(`He doesn't look up. "If we get a second warning, I sell forty of them. Dot says we'll manage and we will, and I'll still stand in a shop and watch a stranger put my mother's records in a bag." A breath. "I'd rather you told me not to."`, `No levanta la vista. «Si recibimos una segunda advertencia, vendo cuarenta. Dot dice que nos las arreglaremos y nos las arreglaremos, y aun así voy a estar parado en una tienda viendo a un desconocido meter los discos de mi mamá en una bolsa». Una respiración. «Preferiría que me dijeras que no».`, `Ele não levanta o olhar. «Se a gente levar um segundo aviso, eu vendo quarenta. A Dot diz que a gente se vira e a gente vai se virar, e eu ainda vou ficar numa loja vendo um estranho botar os discos da minha mãe numa sacola». Uma respiração. «Eu preferia que você me dissesse que não».`),
        choices: [
          K('care', t(`"Don't. I'll be the one who answers the door."`, `«No lo hagas. Yo seré quien atienda la puerta».`, `«Não faz isso. Eu atendo a porta».`), { once: true, do: { care: 1, soc: 3, flag: 'door_pledge' }, next: 'c1' }),
          K('honest', t(`"It's your call. But decide it before they knock, not after."`, `«Es tu decisión. Pero decídelo antes de que toquen, no después».`, `«A decisão é sua. Mas decide antes de baterem, não depois».`), { do: { soc: 1 }, next: 'c2' }),
          K('plan', t(`Help him pick which forty, just in case.`, `Ayudarlo a elegir cuáles cuarenta, por si acaso.`, `Ajudar a escolher quais quarenta, por via das dúvidas.`), { do: { time: 6, soc: 2 }, next: 'c3' })
        ]
      },
      c1: { text: t(`He nods without looking up and puts the sleeve down very carefully. "That's a promise. I'll hold you to it, gently."`, `Asiente sin mirarte y apoya la funda con muchísimo cuidado. «Eso es una promesa. Te la voy a cobrar, con suavidad».`, `Ele assente sem olhar e pousa a capa com muito cuidado. «Isso é uma promessa. Vou te cobrar, com jeito».`), next: null },
      c2: { text: t(`"Before, not after. Yes." He rubs his face. "That's the useful version of what I was hoping you'd say."`, `«Antes, no después. Sí». Se frota la cara. «Esa es la versión útil de lo que esperaba que dijeras».`, `«Antes, não depois. É». Ele esfrega o rosto. «Essa é a versão útil do que eu esperava que você dissesse».`), next: null },
      c3: { text: t(`You make two piles on the table. The second pile is the one he can't look at. "Okay," he says. "Okay. Now I know what it costs. That's easier."`, `Hacen dos montones sobre la mesa. El segundo es el que no puede mirar. «Bueno», dice. «Bueno. Ahora sé cuánto cuesta. Es más fácil».`, `Vocês fazem duas pilhas na mesa. A segunda é a que ele não consegue olhar. «Tá», diz. «Tá. Agora eu sei quanto custa. É mais fácil».`), next: null },
      quiet: { text: t(`He swaps the needle for a slower one. The flat lets its breath out. You can hear the kettle.`, `Cambia la aguja por una más lenta. El departamento suelta el aire. Se oye la tetera.`, `Ele troca a agulha por uma mais lenta. O apê solta o ar. Dá pra ouvir a chaleira.`), next: null },
      loud: { text: t(`"Okay," he says, "but the walls have ears." The bass comes up. So does your pulse. So, you suspect, will the broom from downstairs.`, `«Está bien», dice, «pero las paredes tienen oídos». Sube el bajo. Sube tu pulso. Y, sospechas, subirá la escoba de abajo.`, `«Tá», diz, «mas as paredes têm ouvidos». O grave sobe. O seu pulso também. E, você desconfia, o cabo de vassoura lá de baixo vai subir.`), next: null },
      rem: {
        text: t(`You tell him what Doña Remedios asked for: cumbia, 1974, anything with a guiro. He is quiet for a while. "I have one. It's worth more than a month's rent." He takes it out slowly, reluctantly. "Tell her to sit on the balcony side. I'll put the volume at two."`, `Le cuentas lo que pidió doña Remedios: cumbia, 1974, cualquier cosa con güiro. Se queda callado un rato. «Tengo uno. Vale más que un mes de alquiler». Lo saca despacio, con reticencia. «Dile que se siente del lado del balcón. Pongo el volumen en dos».`, `Você conta o que a dona Remedios pediu: cumbia, 1974, qualquer coisa com güiro. Ele fica quieto um tempo. «Tenho um. Vale mais que um mês de aluguel». Ele tira da capa devagar, relutante. «Diz pra ela sentar do lado da varanda. Eu ponho o volume em dois».`),
        once: true, do: { flag: 'rem_played', soc: 4, fun: 3, time: 8, call: 'af_rem_played' }, next: null
      }
    }, crateNodes('a'))
  };
  D.af_records = {
    start: 'a', nodes: Object.assign({
      a: {
        text: t(`A table of records in plain sleeves. Anselm keeps one eye on them from across the room.`, `Una mesa con discos en fundas lisas. Anselm los vigila con un ojo desde el otro lado del cuarto.`, `Uma mesa com discos em capas lisas. O Anselm vigia com um olho do outro lado da sala.`),
        choices: [
          K('care', t(`Ask Anselm first.`, `Preguntarle a Anselm primero.`, `Perguntar ao Anselm primeiro.`), { free: true, next: null, call: 'af_ask_rec' }),
          K('ask', t(`Choose a record for the turntable.`, `Elegir un disco para el tocadiscos.`, `Escolher um disco pra vitrola.`), { req: F('rec_ok'), free: true, next: 'crate' }),
          K('push', t(`Flip through them without asking.`, `Revisarlos sin preguntar.`, `Fuçar sem perguntar.`), { bad: true, next: 'touched' }),
          K('chill', t(`Leave them alone.`, `Dejarlos en paz.`, `Deixar em paz.`), { free: true, next: null })
        ]
      },
      touched: { text: t(`Anselm's hand is on yours before you reach the third sleeve. He doesn't say anything. He doesn't have to.`, `La mano de Anselm está sobre la tuya antes de que llegues a la tercera funda. No dice nada. No necesita.`, `A mão do Anselm tá sobre a sua antes de você chegar na terceira capa. Ele não diz nada. Não precisa.`), do: { soc: -6 }, next: null }
    }, crateNodes('a'))
  };

  /* ============================================================ DOT in the kitchen: what hosting costs */
  D.af_dot_kitchen = {
    who: 'dot', role: t('HOST', 'ANFITRIONA', 'ANFITRIÃ'), start: 'a', nodes: {
      a: {
        text: t(`Dot is up to the elbows in eggs. "Thank you for coming. Everybody says that. I mean it differently: thank you for the quiet. It's hard to host when the house is a drum."`, `Dot está hasta los codos en huevos. «Gracias por venir. Todos dicen eso. Yo lo digo distinto: gracias por la calma. Es difícil recibir cuando la casa es un tambor».`, `A Dot tá até os cotovelos em ovos. «Obrigada por vir. Todo mundo diz isso. Eu digo diferente: obrigada pela calma. É difícil receber quando a casa é um tambor».`),
        choices: [
          K('care', t(`"I'll run to the bakery for bread."`, `«Voy a la panadería por pan».`, `«Vou à padaria buscar pão».`), { req: NF('brought_food'), do: { flag: 'brought_food', time: 30, soc: 4, fun: 3, hp: 4 }, next: 'bread' }),
          K('care', t(`"I'll take the recycling down."`, `«Bajo el reciclaje».`, `«Levo a reciclagem lá embaixo».`), { req: NF('af_trash'), do: { flag: 'af_trash', time: 12, soc: 2, fun: 1 }, next: 'trash' }),
          K('ask', t(`"How are you actually doing?"`, `«¿Cómo estás de verdad?»`, `«Como você tá de verdade?»`), { next: 'host' }),
          K('ask', t(`Ask about the neighbours.`, `Preguntar por los vecinos.`, `Perguntar dos vizinhos.`), { next: 'nbr' }),
          K('ask', t(`Ask about the room at the end of the hall.`, `Preguntar por el cuarto del fondo del pasillo.`, `Perguntar do quarto do fundo do corredor.`), { next: 'mbinfo' }),
          K('chill', t(`"Just checking in."`, `«Solo paso a ver».`, `«Só passando».`), { free: true, next: null })
        ]
      },
      bread: { text: t(`You walk to the corner in clean cold light, past a man hosing his shop front, and come back with three loaves still warm in a paper bag. Dot takes one and presses it against her cheek.`, `Caminas hasta la esquina en una luz fría y limpia, junto a un hombre que baldea su vitrina, y vuelves con tres panes todavía tibios en una bolsa de papel. Dot toma uno y se lo apoya en la mejilla.`, `Você anda até a esquina numa luz fria e limpa, passa por um homem lavando a fachada da loja e volta com três pães ainda mornos num saco de papel. A Dot pega um e encosta na bochecha.`), next: null },
      trash: { text: t(`Three flights down with a clinking bag, on tiptoe past the Alvarados' door. A baby cries once behind it, a short sharp sound, and stops. You carry the rest of the way on tiptoe.`, `Tres pisos abajo con una bolsa que tintinea, de puntillas frente a la puerta de los Alvarado. Un bebé llora una vez detrás, un sonido corto y agudo, y se calla. Cargas el resto del camino de puntillas.`, `Três andares com uma sacola que tilinta, na ponta do pé na frente da porta dos Alvarado. Um bebê chora uma vez lá dentro, um som curto e agudo, e para. Você leva o resto do caminho na ponta do pé.`), next: null },
      host: {
        text: t(`She keeps beating the eggs. "I love this. I also dread it, every time. I open the door thinking: this is the one they stop letting us do." A pause. "Anselm cries over records and I take the neighbours. That's the split. I didn't pick it."`, `Sigue batiendo los huevos. «Amo esto. También lo temo, cada vez. Abro la puerta pensando: esta es la que nos van a dejar de permitir». Una pausa. «Anselm llora por los discos y yo me encargo de los vecinos. Esa es la división. No la elegí».`, `Ela continua batendo os ovos. «Eu amo isso. Também tenho medo, toda vez. Abro a porta pensando: essa é a que vão parar de deixar a gente fazer». Uma pausa. «O Anselm chora pelos discos e eu fico com os vizinhos. Essa é a divisão. Eu não escolhi».`),
        choices: [K('ask', t(`"What do you want from today?"`, `«¿Qué quieres de hoy?»`, `«O que você quer de hoje?»`), { next: 'want' })]
      },
      want: {
        text: t(`"Sleep. Quiet. And for it to still count as a good party." She almost laughs. "That's three things. I'd settle for two."`, `«Dormir. Silencio. Y que siga contando como una buena fiesta». Casi se ríe. «Son tres cosas. Me conformo con dos».`, `«Dormir. Silêncio. E que ainda conte como uma boa festa». Ela quase ri. «São três coisas. Eu aceito duas».`),
        choices: [
          K('care', t(`"When you need to lie down, I'll take the door."`, `«Cuando necesites acostarte, yo me encargo de la puerta».`, `«Quando precisar deitar, eu fico com a porta».`), { once: true, do: { care: 1, soc: 4, flag: ['door_offer', 'g_dot_open'] }, next: 'want_yes' }),
          K('chill', t(`"Tell me what you need and I'll do it."`, `«Dime qué necesitas y lo hago».`, `«Me diz do que precisa e eu faço».`), { once: true, do: { soc: 2, flag: 'g_dot_open' }, next: null })
        ]
      },
      want_yes: { text: t(`She stops beating the eggs. "Okay." She doesn't say anything else for a moment. "Okay. I'll remember you said that. Not as a favour. As a plan."`, `Deja de batir los huevos. «Bueno». No dice nada más por un momento. «Bueno. Voy a recordar que lo dijiste. No como un favor. Como un plan».`, `Ela para de bater os ovos. «Tá». Não diz mais nada por um instante. «Tá. Vou lembrar que você disse isso. Não como favor. Como plano».`), next: null },
      nbr: {
        text: t(`Dot counts them off on flour-white fingers. "Above, Marcos. Works from home, has a call at ten. Left wall, our bedroom side, Beto: night nurse, sleeps now. Right, Doña Remedios. Up since five, and she secretly adores records. Below, the Alvarados, with Lía, four months." She flicks the fridge. "The landlord, Quiroga, warned us once. We'd like him not to warn us twice."`, `Dot los cuenta con los dedos blancos de harina. «Arriba, Marcos. Trabaja desde casa, tiene una llamada a las diez. Pared izquierda, lado de nuestro dormitorio, Beto: enfermero nocturno, duerme ahora. A la derecha, doña Remedios. Despierta desde las cinco, y adora los discos en secreto. Abajo, los Alvarado, con Lía, cuatro meses». Golpea la heladera. «El dueño, Quiroga, nos avisó una vez. Preferiríamos que no nos avise dos».`, `A Dot conta nos dedos brancos de farinha. «Em cima, o Marcos. Trabalha de casa, tem uma call às dez. Parede esquerda, lado do nosso quarto, Beto: enfermeiro noturno, dorme agora. À direita, dona Remedios. Acordada desde as cinco, e adora disco em segredo. Embaixo, os Alvarado, com a Lía, quatro meses». Ela bate na geladeira. «O dono, Quiroga, avisou uma vez. A gente prefere que ele não avise duas».`),
        do: { flag: 'knows_walls' }, next: null
      },
      mbinfo: { text: t(`"We opened our own bedroom for anyone who wants it. Same rules as the dark room: ask first, a yes is a word, a no is a sentence, nobody films. Water and a bowl by the door. You can look, you can leave, it costs nothing. I'll walk you in the first time."`, `«Abrimos nuestro dormitorio para quien lo quiera. Las mismas reglas del cuarto oscuro: pregunta primero, un sí es una palabra, un no es una frase, nadie filma. Agua y un bol junto a la puerta. Puedes mirar, puedes irte, no cuesta nada. La primera vez te acompaño».`, `«A gente abriu o nosso quarto pra quem quiser. As mesmas regras da dark room: pergunta primeiro, um sim é uma palavra, um não é uma frase, ninguém filma. Água e uma tigela na porta. Dá pra olhar, dá pra sair, não custa nada. Na primeira vez eu te levo».`), do: { flag: 'mb_info' }, next: null }
    }
  };
  D.af_toast = {
    start: 'a', nodes: {
      a: {
        text: t(`A plate of toast, a pot of tea, a jar of something orange. Everything is warm and nobody is selling it.`, `Un plato de tostadas, una tetera, un frasco de algo naranja. Todo está tibio y nadie lo vende.`, `Um prato de torrada, um bule de chá, um pote de algo laranja. Tudo morno e ninguém vendendo.`),
        choices: [
          K('chill', t(`Eat some toast, drink some tea.`, `Comer una tostada, tomar té.`, `Comer torrada, beber chá.`), { do: { hp: 5, soc: 1, time: 4, cool: { af_toast: 30 } }, next: null }),
          K('chill', t(`Not yet.`, `Todavía no.`, `Ainda não.`), { free: true, next: null })
        ]
      }
    }
  };
  D.af_dishes = {
    who: 'dot', start: 'a', nodes: {
      a: {
        text: t(`A pile of last night's plates and mugs. Dot isn't looking at it, which is how you know she's seen it.`, `Una pila de platos y tazas de anoche. Dot no la mira, que es cómo sabes que la vio.`, `Uma pilha de pratos e canecas da noite passada. A Dot não olha pra ela, que é como você sabe que ela viu.`),
        choices: [
          K('care', t(`Wash up. Leave the place better.`, `Lavar. Dejar el lugar mejor.`, `Lavar. Deixar o lugar melhor.`), { do: { care: 1, time: 10, soc: 3, flag: 'af_clean' }, next: null }),
          K('chill', t(`Later.`, `Después.`, `Depois.`), { free: true, next: null })
        ]
      }
    }
  };

  /* ============================================================ the hour Dot hands you the door */
  D.af_dot_door2 = {
    forced: true, who: 'dot', role: t('HOST', 'ANFITRIONA', 'ANFITRIÃ'), start: 'a', nodes: {
      a: {
        text: function (s) {
          return s.flags.door_offer
            ? t(`Dot sits on the edge of a chair and takes a moment to stand again. "You said you'd take the door. I'm taking you at your word. I need forty minutes lying down. I've never said that at my own party."`, `Dot se sienta en el borde de una silla y tarda un momento en pararse de nuevo. «Dijiste que te encargarías de la puerta. Te tomo la palabra. Necesito cuarenta minutos acostada. Nunca había dicho eso en mi propia fiesta».`, `A Dot senta na beirada de uma cadeira e leva um momento pra levantar de novo. «Você disse que ficava com a porta. Tô te pegando na palavra. Preciso de quarenta minutos deitada. Nunca falei isso na minha própria festa».`)
            : t(`Dot sits on the edge of a chair and takes a moment to stand again. "I need forty minutes lying down. I've never said that at my own party." She looks at you. "Can you take the door?"`, `Dot se sienta en el borde de una silla y tarda un momento en pararse de nuevo. «Necesito cuarenta minutos acostada. Nunca había dicho eso en mi propia fiesta». Te mira. «¿Puedes encargarte de la puerta?»`, `A Dot senta na beirada de uma cadeira e leva um momento pra levantar de novo. «Preciso de quarenta minutos deitada. Nunca falei isso na minha própria festa». Ela te olha. «Dá pra você ficar com a porta?»`);
        },
        choices: [
          K('care', t(`"Go. I've got the door."`, `«Ve. Yo me encargo de la puerta».`, `«Vai. Eu fico com a porta».`), { do: { care: 1, soc: 3, flag: ['door_yours', 'dot_asleep'] }, next: 'yes' }),
          K('plan', t(`"Wake Anselm. He lives here."`, `«Despierta a Anselm. Él vive aquí».`, `«Acorda o Anselm. Ele mora aqui».`), { do: { soc: -1, flag: ['door_anselm', 'dot_asleep'], call: 'af_anselm_door' }, next: 'anselm' }),
          K('honest', t(`"I'm wrecked too. Let's both lie down for twenty."`, `«Yo también estoy destruido. Acostémonos los dos veinte minutos».`, `«Eu também tô destruído. Vamos deitar os dois por vinte».`), { do: { hp: 8, time: 20, flag: ['door_both', 'dot_asleep'], call: 'af_door_both' }, next: 'both' })
        ]
      },
      yes: { text: t(`"Knock once: you decide. Knock twice: you wake me. Anselm will hover, and he'll want to apologise to the neighbours until they're embarrassed. Don't let him." She squeezes your arm. "Thank you. For being the first person today who didn't tell me it would be fine."`, `«Un toque: decides tú. Dos toques: me despiertas. Anselm va a rondar y va a querer pedirles perdón a los vecinos hasta que se avergüencen. No lo dejes». Te aprieta el brazo. «Gracias. Por ser la primera persona hoy que no me dijo que iba a estar bien».`, `«Uma batida: você decide. Duas batidas: me acorda. O Anselm vai ficar rondando e vai querer pedir desculpa pros vizinhos até eles ficarem constrangidos. Não deixa». Ela aperta seu braço. «Obrigada. Por ser a primeira pessoa hoje que não me disse que ia ficar tudo bem».`), next: null },
      anselm: { text: t(`"Right. Anselm." She almost smiles. "He'll apologise too much and he'll cry at a neighbour, and the neighbour will forgive him because of the crying. It works, don't ask me why." She goes.`, `«Claro. Anselm». Casi sonríe. «Pedirá perdón de más y llorará frente a un vecino, y el vecino lo perdonará por el llanto. Funciona, no me preguntes por qué». Se va.`, `«Claro. O Anselm». Ela quase sorri. «Ele vai pedir desculpa demais e chorar na frente do vizinho, e o vizinho vai perdoar por causa do choro. Funciona, não me pergunta por quê». Ela vai.`), next: null },
      both: { text: t(`You lie on the floor of the coats room under somebody's duffel coat. Twenty minutes later you wake to the sound of the building. The music has crept up on its own. Nobody's watched the walls.`, `Se acuestan en el piso del cuarto de los abrigos bajo el abrigo de alguien. Veinte minutos después te despierta el ruido del edificio. La música subió sola. Nadie vigiló las paredes.`, `Vocês deitam no chão do quarto dos casacos debaixo do casaco de alguém. Vinte minutos depois você acorda com o som do prédio. A música subiu sozinha. Ninguém vigiou as paredes.`), next: null }
    }
  };
  S.af_anselm_door = function () { AF.noise(-12); AF.vol(0); };
  S.af_door_both = function () { AF.noise(14); };

  /* ============================================================ 3. THE KITCHEN: you are the aftercare */
  D.af_sam = {
    who: 'sam', role: t('ON THE FLOOR', 'EN EL PISO', 'NO CHÃO'), start: 'st', nodes: {
      st: { branch: [{ req: function (s) { return !!(s.fx.comedown || s.fx.comedown2); }, to: 'both' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`Sam sits on the floor against a cupboard, both hands round a mug, eyes on nothing. "Everything went grey about an hour ago. At five I loved everybody. At half past I called my ex." A breath. "I think I told him something. I can see the call in the phone and I'm scared to open it."`, `Sam está sentado en el piso contra una alacena, las dos manos alrededor de una taza, la vista en nada. «Todo se puso gris hace una hora. A las cinco quería a todo el mundo. A las cinco y media llamé a mi ex». Una respiración. «Creo que le dije algo. Veo la llamada en el celular y me da miedo abrirla».`, `O Sam tá sentado no chão encostado num armário, as duas mãos em volta de uma caneca, o olhar em nada. «Tudo ficou cinza faz uma hora. Às cinco eu amava todo mundo. Às cinco e meia liguei pro meu ex». Uma respiração. «Acho que eu disse alguma coisa pra ele. Vejo a ligação no celular e tenho medo de abrir».`),
        choices: [
          K('care', t(`Sit beside them. "It's a comedown. It lies. It isn't a verdict on you."`, `Sentarte a su lado. «Es una bajada. Miente. No es un veredicto sobre ti».`, `Sentar do lado. «É uma baixada. Mente. Não é um veredito sobre você».`), { do: { care: 1, time: 8 }, next: 'ok' }),
          K('care', t(`Offer to look at the call log with them.`, `Ofrecerte a mirar con ellos el historial de llamadas.`, `Oferecer pra olhar o histórico de ligações junto.`), { do: { care: 1, time: 8 }, next: 'phone' }),
          K('care', t(`Bring toast and water, and say nothing.`, `Traer tostadas y agua, y no decir nada.`, `Trazer torrada e água, e não dizer nada.`), { do: { care: 1, time: 6, hp: 2 }, next: 'quiet' }),
          K('blunt', t(`List everything they should do: eat, sleep, no more, text nobody.`, `Enumerar todo lo que deberían hacer: comer, dormir, nada más, no escribirle a nadie.`, `Listar tudo que deveria fazer: comer, dormir, nada mais, não mandar mensagem pra ninguém.`), { do: { soc: -3, fun: -2, time: 5 }, next: 'fuss' }),
          K('chill', t(`"You'll be fine." Leave them to it.`, `«Vas a estar bien». Dejarlos con lo suyo.`, `«Vai ficar bem». Deixar com isso.`), { do: { soc: -2, flag: ['sam_done', 'sam_alone'] }, next: null })
        ]
      },
      both: {
        text: t(`Sam looks up at your own mug, held in both hands. "You too?" You both nod. "Fuck. At least it's not just me." They shuffle sideways to make a space against the cupboard. "I called my ex at half past five. Don't tell me how that went."`, `Sam levanta la vista hacia tu taza, sostenida con las dos manos. «¿Tú también?» Los dos asienten. «Mierda. Al menos no soy solo yo». Se corre de lado para hacerte un lugar contra la alacena. «Llamé a mi ex a las cinco y media. No me digas cómo salió».`, `O Sam olha pra sua caneca, segurada com as duas mãos. «Você também?» Vocês dois assentem. «Merda. Pelo menos não sou só eu». Ele escorrega de lado pra abrir um espaço no armário. «Liguei pro meu ex às cinco e meia. Não me diz como foi».`),
        do: { care: 1, soc: 4, hp: 2, time: 8, flag: ['sam_done', 'sam_ok'] }, next: null
      },
      ok: { text: t(`Sam breathes out. "Right. A comedown. It's not a verdict." They say it twice, like learning a word. By the end of the toast they are back in the room, tired and here.`, `Sam suelta el aire. «Claro. Una bajada. No es un veredicto». Lo repite dos veces, como aprendiendo una palabra. Para el final de la tostada están de vuelta en el cuarto, cansados y presentes.`, `O Sam solta o ar. «Claro. Uma baixada. Não é um veredito». Repete duas vezes, aprendendo uma palavra. No fim da torrada tá de volta na sala, cansado e presente.`), do: { flag: ['sam_done', 'sam_ok'] }, next: null },
      phone: { text: t(`They hand you the phone at arm's length. Eleven seconds, no voicemail, and one text: "i miss you. sorry. ignore me." Sam laughs, high and cracked. "That's survivable. That's actually survivable." They take the phone back and put it face down on the floor.`, `Te pasan el celular con el brazo estirado. Once segundos, sin mensaje de voz, y un texto: «te extraño. perdón. ignórame». Sam se ríe, agudo y quebrado. «Eso es sobrevivible. Eso de verdad es sobrevivible». Recupera el celular y lo deja boca abajo en el piso.`, `Entregam o celular com o braço esticado. Onze segundos, sem recado de voz, e uma mensagem: «sinto sua falta. desculpa. ignora». O Sam ri, agudo e rachado. «Isso é sobrevivível. Isso é realmente sobrevivível». Pega o celular de volta e deixa virado pra baixo no chão.`), do: { flag: ['sam_done', 'sam_ok'] }, next: null },
      quiet: { text: t(`Sam takes the toast and eats the whole slice without looking at it. They drink the water in two goes. "Thank you for not asking me anything," they say, and it comes out wet.`, `Sam toma la tostada y se come la rebanada entera sin mirarla. Se toma el agua de dos tragos. «Gracias por no preguntarme nada», dice, y le sale con humedad.`, `O Sam pega a torrada e come a fatia inteira sem olhar. Bebe a água em dois goles. «Valeu por não me perguntar nada», diz, e sai molhado.`), do: { flag: ['sam_done', 'sam_ok'] }, next: null },
      fuss: {
        text: t(`"Okay. Thank you." Sam looks at the mug, hoping it helps. The list is correct and it doesn't help. They are eating toast out of politeness.`, `«Bueno. Gracias». Sam mira la taza, esperando que ayude. La lista es correcta y no ayuda. Come la tostada por cortesía.`, `«Tá. Obrigado». O Sam olha a caneca, esperando que ajude. A lista tá certa e não ajuda. Tá comendo torrada por educação.`),
        choices: [
          K('care', t(`"Sorry. Let me just sit with you."`, `«Perdón. Déjame sentarme contigo».`, `«Desculpa. Deixa eu só sentar com você».`), { do: { care: 1, time: 8, flag: ['sam_done', 'sam_ok'] }, next: null }),
          K('chill', t(`Back away slowly.`, `Retirarte despacio.`, `Se afastar devagar.`), { do: { flag: ['sam_done', 'sam_fussed'] }, next: null })
        ]
      }
    }
  };
  D.af_rey = {
    who: 'rey', role: t('AT THE COUNTER', 'EN LA MESADA', 'NO BALCÃO'), start: 'a', nodes: {
      a: {
        text: t(`Rey is fanning their face with a paper plate, jaw working, shirt dark with sweat. "I took another one. The first one was still going. I know. I'm forty-one and I redosed like I was nineteen." They look at the clock on the oven. "My daughter's party is at two. I'm doing the cake."`, `Rey se abanica la cara con un plato de papel, la mandíbula trabajando, la camisa oscura de sudor. «Tomé otra. La primera seguía. Ya sé. Tengo cuarenta y uno y repetí como si tuviera diecinueve». Mira el reloj del horno. «La fiesta de mi hija es a las dos. Yo hago el pastel».`, `O Rey se abana com um prato de papel, mandíbula trabalhando, camisa escura de suor. «Tomei outra. A primeira ainda tava batendo. Eu sei. Tenho quarenta e um e repeti como se tivesse dezenove». Olha o relógio do forno. «A festa da minha filha é às duas. O bolo é comigo».`),
        choices: [
          K('care', t(`Take them to the balcony door. Water, air, sit.`, `Llevarlos a la puerta del balcón. Agua, aire, sentarse.`, `Levar pra porta da varanda. Água, ar, sentar.`), { do: { care: 1, time: 10 }, next: 'ok' }),
          K('care', t(`Be their buddy: "Sleep ninety minutes. I'll wake you at twelve."`, `Ser su compañero: «Duerme noventa minutos. Te despierto a las doce».`, `Ser a dupla: «Dorme noventa minutos. Eu te acordo ao meio-dia».`), { do: { care: 2, time: 6 }, next: 'buddy' }),
          K('blunt', t(`"You redosed. Don't do that again."`, `«Repetiste. No lo vuelvas a hacer».`, `«Você repetiu. Não faz de novo».`), { do: { soc: -4, time: 3 }, next: 'lecture' }),
          K('chill', t(`Hand them a cup and walk on.`, `Darles una taza y seguir.`, `Dar uma caneca e seguir.`), { free: true, do: { flag: ['rey_done', 'rey_alone'] }, next: null })
        ]
      },
      ok: { text: t(`You open the balcony door a hand's width, enough for the morning to come in. Rey sits with the plate on their knee and breathes on your count. The shirt dries. The jaw loosens. "I'll still do the cake," they say. "I'm just going to do it sitting down."`, `Abres la puerta del balcón un palmo, lo justo para que entre la mañana. Rey se sienta con el plato sobre la rodilla y respira a tu cuenta. La camisa se seca. La mandíbula se afloja. «Igual hago el pastel», dicen. «Solo que sentado».`, `Você abre a porta da varanda um palmo, o bastante pra manhã entrar. O Rey senta com o prato no joelho e respira na sua contagem. A camisa seca. A mandíbula afrouxa. «Eu ainda faço o bolo», diz. «Só que sentado».`), do: { flag: ['rey_done', 'rey_ok'] }, next: null },
      buddy: { text: t(`"Ninety minutes. Twelve." Rey says it twice, like something to hold. "And if I'm not okay at twelve I'm not driving to the party. I promise you, and I promise her." You set the time in your head.`, `«Noventa minutos. Doce». Rey lo repite dos veces, como algo a lo que agarrarse. «Y si a las doce no estoy bien, no manejo a la fiesta. Te lo prometo a ti, y se lo prometo a ella». Fijas la hora en tu cabeza.`, `«Noventa minutos. Meio-dia». O Rey repete duas vezes, como algo pra se segurar. «E se ao meio-dia eu não estiver bem, não dirijo pra festa. Prometo pra você, e prometo pra ela». Você fixa o horário na cabeça.`), do: { flag: ['rey_done', 'rey_ok', 'rey_buddy'] }, next: null },
      lecture: {
        text: t(`"Thank you for the thesis," Rey says, kindly, and closes their eyes. They knew. They knew before you did.`, `«Gracias por la tesis», dice Rey, con cariño, y cierra los ojos. Ya lo sabían. Lo sabían antes que tú.`, `«Obrigado pela tese», diz o Rey, com carinho, e fecha os olhos. Já sabiam. Sabiam antes de você.`),
        choices: [
          K('care', t(`"Sorry. Come to the balcony door."`, `«Perdón. Ven a la puerta del balcón».`, `«Desculpa. Vem pra porta da varanda».`), { do: { care: 1, time: 10, flag: ['rey_done', 'rey_ok'] }, next: null }),
          K('chill', t(`Leave them in peace.`, `Dejarlos en paz.`, `Deixar em paz.`), { do: { flag: ['rey_done', 'rey_alone'] }, next: null })
        ]
      }
    }
  };
  D.af_vik = {
    who: 'vik', role: t('AT THE COUNTER', 'EN LA MESADA', 'NO BALCÃO'), start: 'a', nodes: {
      a: {
        text: t(`Vik is holding the counter with both hands and a smile that arrived before the rest of them. "I mixed things. Wine, then the other thing, then more wine. The kitchen is a boat. I'm on the boat."`, `Vik se agarra a la mesada con las dos manos y una sonrisa que llegó antes que el resto. «Mezclé cosas. Vino, luego la otra cosa, luego más vino. La cocina es un barco. Estoy en el barco».`, `O Vik se segura no balcão com as duas mãos e um sorriso que chegou antes do resto. «Misturei coisa. Vinho, depois a outra coisa, depois mais vinho. A cozinha é um barco. Tô no barco».`),
        choices: [
          K('care', t(`Water, bread, and ask how much. No judging.`, `Agua, pan, y preguntar cuánto. Sin juzgar.`, `Água, pão, e perguntar quanto. Sem julgar.`), { do: { care: 1, time: 8, hp: 1 }, next: 'ok' }),
          K('honest', t(`"I'm going to check on you every ten minutes. If you stop answering, I call."`, `«Voy a ver cómo estás cada diez minutos. Si dejas de contestar, llamo».`, `«Vou ver como você tá a cada dez minutos. Se parar de responder, eu ligo».`), { do: { care: 1, time: 6 }, next: 'watch' }),
          K('joke', t(`"At least you're not driving."`, `«Al menos no estás manejando».`, `«Pelo menos você não tá dirigindo».`), { do: { fun: 2, time: 3 }, next: 'joke' }),
          K('blunt', t(`A lecture on mixing, with numbers.`, `Una charla sobre mezclas, con números.`, `Uma palestra sobre misturas, com números.`), { do: { soc: -3, fun: -1, time: 4 }, next: 'lecture' })
        ]
      },
      ok: { text: t(`Vik drinks the water in three long gulps, eats a slice of bread with their whole face, and slides down to the floor to continue being a person. "How many did I have?" "Enough. Sit." They sit.`, `Vik se toma el agua en tres tragos largos, se come una rebanada de pan con toda la cara y se desliza al piso para seguir siendo persona. «¿Cuántas tomé?» «Las suficientes. Siéntate». Se sientan.`, `O Vik bebe a água em três goles longos, come uma fatia de pão com o rosto inteiro e escorrega pro chão pra continuar sendo pessoa. «Quantas eu tomei?» «O suficiente. Senta». Senta.`), do: { flag: ['vik_done', 'vik_ok'] }, next: null },
      watch: { text: t(`"That's the most romantic thing anyone's said to me all week." Vik sits down very carefully. Ten minutes later you look in, and they raise a hand without opening their eyes. At twenty they are asleep, on their side, breathing evenly. You stop checking.`, `«Es lo más romántico que alguien me dijo en toda la semana». Vik se sienta con muchísimo cuidado. Diez minutos después te asomas y levantan una mano sin abrir los ojos. A los veinte duermen de lado, respirando parejo. Dejas de revisar.`, `«Foi a coisa mais romântica que alguém me disse a semana toda». O Vik senta com muito cuidado. Dez minutos depois você olha e levantam uma mão sem abrir os olhos. Aos vinte dormem de lado, respirando regular. Você para de checar.`), do: { flag: ['vik_done', 'vik_ok', 'vik_watched'] }, next: null },
      joke: { text: t(`Vik laughs so hard they have to hold the counter again. It's half hiccup. It helps. It isn't water, though.`, `Vik se ríe tanto que tiene que agarrarse otra vez a la mesada. Es mitad hipo. Ayuda. Pero no es agua.`, `O Vik ri tanto que precisa se segurar no balcão de novo. É meio soluço. Ajuda. Mas não é água.`), do: { flag: ['vik_done', 'vik_joked'] }, next: null },
      lecture: { text: t(`"Okay, doctor," Vik says, still smiling, and the smile goes a little thin. They know the numbers. They knew them at the third glass.`, `«Bueno, doctor», dice Vik, aún sonriendo, y la sonrisa se adelgaza. Se saben los números. Se los sabían en la tercera copa.`, `«Tá, doutor», diz o Vik, ainda sorrindo, e o sorriso afina. Sabem os números. Sabiam no terceiro copo.`), do: { flag: ['vik_done', 'vik_lectured'] }, next: null }
    }
  };

  /* ============================================================ 4. THE PERSON IN THE COATS */
  D.af_lio = {
    who: 'lio', role: t('IN THE COATS', 'ENTRE LOS ABRIGOS', 'NOS CASACOS'), start: 'st', nodes: {
      st: { branch: [{ req: deep, to: 'deep' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`Lio is curled on the coats, eyes half open, phone loose in one hand. "Don't put the light on," they whisper. "Everything's loud and my heart's running." Their skin is hot to the back of your hand.`, `Lio está hecho un ovillo sobre los abrigos, los ojos entreabiertos, el celular flojo en una mano. «No prendas la luz», susurra. «Todo suena fuerte y mi corazón corre». Tienen la piel caliente al dorso de tu mano.`, `O Lio tá enrolado nos casacos, olhos entreabertos, celular frouxo numa mão. «Não acende a luz», sussurra. «Tudo tá alto e meu coração tá correndo». A pele tá quente no dorso da sua mão.`),
        choices: [
          K('care', t(`Sit. Ask: "What did you take? When? Is anyone with you?"`, `Sentarte. Preguntar: «¿Qué tomaste? ¿Cuándo? ¿Hay alguien contigo?»`, `Sentar. Perguntar: «O que você tomou? Quando? Tem alguém com você?»`), { do: { time: 6, care: 1 }, next: 'ask' }),
          K('care', t(`Get water, come back, sit.`, `Traer agua, volver, sentarte.`, `Buscar água, voltar, sentar.`), { do: { time: 5 }, next: 'water' }),
          K('blunt', t(`Shake them. "Hey! Talk to me! Look at me!"`, `Sacudirlos. «¡Oye! ¡Háblame! ¡Mírame!»`, `Sacudir. «Ei! Fala comigo! Olha pra mim!»`), { do: { fun: -2, soc: -3 }, next: 'fussed' }),
          K('chill', t(`"You said you're fine." Leave them.`, `«Dijiste que estás bien». Dejarlos.`, `«Você disse que tá bem». Deixar.`), { do: { soc: -3, flag: ['lio_done', 'lio_alone'], quest: { q_af4: 'done' } }, next: null, react: t(`At the door you hear a long breath behind you. You pretend not to.`, `En la puerta oyes un largo suspiro a tu espalda. Finges que no.`, `Na porta você ouve um suspiro longo atrás. Finge que não.`) })
        ]
      },
      water: { text: t(`A glass, a slow sip, another. Lio holds it with both hands and doesn't drop it, which is the first good sign.`, `Un vaso, un sorbo lento, otro. Lio lo sostiene con las dos manos y no lo deja caer, que es la primera buena señal.`, `Um copo, um gole lento, outro. O Lio segura com as duas mãos e não derruba, que é o primeiro bom sinal.`), next: 'ask' },
      fussed: {
        text: t(`Lio flinches and curls tighter, eyes shut. Too many questions, too fast, in a voice too big for the room.`, `Lio se encoge y se hace más ovillo, con los ojos cerrados. Demasiadas preguntas, demasiado rápido, con una voz demasiado grande para el cuarto.`, `O Lio se encolhe e se enrola mais, olhos fechados. Perguntas demais, rápido demais, numa voz grande demais pro quarto.`),
        choices: [
          K('care', t(`"Sorry. Quieter. I'm just going to sit."`, `«Perdón. Más bajo. Solo me voy a sentar».`, `«Desculpa. Mais baixo. Só vou sentar».`), { next: 'ask' }),
          K('chill', t(`Back out of the room.`, `Salir del cuarto.`, `Sair do quarto.`), { do: { flag: ['lio_done', 'lio_alone'], quest: { q_af4: 'done' } }, next: null })
        ]
      },
      ask: {
        text: t(`"One earlier. Then Pasc's bag. Twice." Their jaw is clenched and their teeth are chattering. "I'm cold. And hot. Is that a thing?" Their eyes find yours at last.`, `«Una antes. Luego la bolsa de Pasc. Dos veces». Tienen la mandíbula apretada y les castañean los dientes. «Tengo frío. Y calor. ¿Eso es algo?» Sus ojos por fin encuentran los tuyos.`, `«Uma antes. Depois o saquinho do Pasc. Duas vezes». A mandíbula tá cerrada e os dentes batem. «Tô com frio. E calor. Isso existe?» Os olhos encontram os seus finalmente.`),
        choices: [
          K('care', t(`Stay. Breathe at their pace. Water in sips.`, `Quedarte. Respirar a su ritmo. Agua en sorbos.`, `Ficar. Respirar no ritmo. Água em goles.`), { do: { care: 2, time: 20, soc: 6, fun: 2, flag: ['lio_done', 'lio_ok'], quest: { q_af4: 'done' } }, next: 'ok' }),
          K('care', t(`"I'm getting Dot. She'll know who to call."`, `«Voy por Dot. Ella sabrá a quién llamar».`, `«Vou chamar a Dot. Ela sabe pra quem ligar».`), { do: { care: 1, time: 6, soc: 5, flag: ['lio_done', 'lio_called'], quest: { q_af4: 'done' } }, next: 'called' })
        ]
      },
      ok: { text: t(`An hour of sips, of a blanket, of "tell me three things you can see." Lio is asleep, breathing slowly, the blanket to their chin. Mo takes the next shift on the floor beside them with a book.`, `Una hora de sorbos, de una manta, de «dime tres cosas que ves». Lio duerme, respirando despacio, con la manta hasta la barbilla. Mo toma el siguiente turno en el piso a su lado con un libro.`, `Uma hora de goles, de cobertor, de «me diz três coisas que você vê». O Lio dorme, respirando devagar, cobertor até o queixo. A Mo assume o próximo turno no chão ao lado com um livro.`), next: null },
      called: { text: t(`Dot comes with a glass and a cool cloth, takes one look, and sits down on the other side. "If they can answer you, we stay. If they can't, we call. Good call, getting me." They stay.`, `Dot llega con un vaso y un paño frío, mira una vez y se sienta del otro lado. «Si te pueden contestar, nos quedamos. Si no, llamamos. Buena decisión, venir por mí». Se quedan.`, `A Dot chega com um copo e um pano frio, olha uma vez e senta do outro lado. «Se conseguir te responder, a gente fica. Se não, a gente liga. Boa decisão, me chamar». Elas ficam.`), next: null },
      deep: {
        text: t(`Lio is on their side on the coats. You say their name. Nothing. You say it louder and shake a shoulder. Their eyes move under the lids. A breath. A long gap. Another breath.`, `Lio está de lado sobre los abrigos. Dices su nombre. Nada. Lo dices más fuerte y sacudes un hombro. Los ojos se mueven bajo los párpados. Una respiración. Un hueco largo. Otra respiración.`, `O Lio tá de lado nos casacos. Você diz o nome. Nada. Diz mais alto e sacode um ombro. Os olhos se mexem sob as pálpebras. Uma respiração. Um intervalo longo. Outra respiração.`),
        choices: [
          K('care', t(`"Dot! Call for help. Now."`, `«¡Dot! Llama por ayuda. Ya».`, `«Dot! Chama ajuda. Agora».`), { do: { care: 2, soc: 6, time: 5, flag: ['lio_done', 'lio_called'], quest: { q_af4: 'done' }, call: 'af_lio_cost' }, next: 'called_deep' }),
          K('chill', t(`Turn them onto their side and wait a minute.`, `Ponerlos de lado y esperar un minuto.`, `Virar de lado e esperar um minuto.`), { do: { time: 3 }, next: 'side' }),
          K('chill', t(`Leave them to sleep it off.`, `Dejarlos dormir para que se les pase.`, `Deixar dormir até passar.`), { do: { hp: -8, soc: -6, fun: -8, flag: ['lio_done', 'lio_neglect'], quest: { q_af4: 'done' } }, next: null, react: t(`Five minutes later Mo comes out of the coats room white-faced. "Somebody call. Now." You were the one who walked past.`, `Cinco minutos después Mo sale del cuarto de los abrigos con la cara blanca. «Alguien llame. Ya». Fuiste tú quien pasó de largo.`, `Cinco minutos depois a Mo sai do quarto dos casacos de cara branca. «Alguém liga. Agora». Foi você que passou direto.`) })
        ]
      },
      side: {
        text: t(`You roll them gently onto their side, the way the poster in the club said. Still nothing. One minute. Two. Their lips are the wrong colour.`, `Los giras con cuidado de lado, como decía el cartel del club. Sigue sin haber nada. Un minuto. Dos. Los labios son del color equivocado.`, `Você vira de lado com cuidado, como dizia o cartaz do clube. Ainda nada. Um minuto. Dois. Os lábios estão da cor errada.`),
        choices: [
          K('care', t(`"Dot! Call for help!"`, `«¡Dot! ¡Llama por ayuda!»`, `«Dot! Chama ajuda!»`), { do: { care: 2, soc: 5, time: 3, flag: ['lio_done', 'lio_called'], quest: { q_af4: 'done' }, call: 'af_lio_cost' }, next: 'called_deep' }),
          K('chill', t(`Keep waiting.`, `Seguir esperando.`, `Continuar esperando.`), { do: { hp: -8, soc: -6, fun: -8, flag: ['lio_done', 'lio_neglect'], quest: { q_af4: 'done' } }, next: null, react: t(`Mo walks in, sees, and shouts for Dot in a voice you will remember. The call is made. You should have made it.`, `Mo entra, ve, y grita por Dot con una voz que vas a recordar. Se hace la llamada. Tú debiste hacerla.`, `A Mo entra, vê e grita pela Dot com uma voz que você vai lembrar. A ligação é feita. Devia ter sido você.`) })
        ]
      },
      called_deep: {
        text: t(`Dot is on the phone before you finish. "If we call, they may send police with the ambulance, and the landlord's on a warning, and Pasc has half a gram in his sock. I'm calling anyway. Get everybody out of this room." She says to the phone, calm: "Person unresponsive, breathing, on their side." The paramedics are four minutes away. Pasc is out the door before the second minute. They come. Lio goes on a stretcher, breathing, and by noon is a text: awake, sore, fine. Dot squeezes your arm. "You called. That's the whole job."`, `Dot ya está al teléfono antes de que termines. «Si llamamos, pueden mandar policía con la ambulancia, y el dueño está con una advertencia, y Pasc tiene medio gramo en un calcetín. Llamo igual. Saquen a todos de este cuarto». Le dice al teléfono, tranquila: «Persona que no responde, respira, de lado». Los paramédicos están a cuatro minutos. Pasc sale por la puerta antes del segundo minuto. Llegan. Lio sale en camilla, respirando, y para el mediodía es un mensaje: despierto, adolorido, bien. Dot te aprieta el brazo. «Llamaste. Ese es todo el trabajo».`, `A Dot tá no telefone antes de você terminar. «Se a gente ligar, podem mandar polícia junto com a ambulância, e o dono tá com um aviso, e o Pasc tem meia grama na meia. Eu ligo mesmo assim. Tirem todo mundo desse quarto». Ela diz pro telefone, calma: «Pessoa sem responder, respirando, de lado». Os paramédicos estão a quatro minutos. O Pasc sai pela porta antes do segundo minuto. Eles chegam. O Lio sai de maca, respirando, e ao meio-dia é uma mensagem: acordado, dolorido, bem. A Dot aperta seu braço. «Você ligou. Esse é o trabalho todo».`),
        next: null
      }
    }
  };

  /* ============================================================ 5. ONE MORE */
  D.af_pasc = {
    who: 'pasc', role: t('ON THE SOFA', 'EN EL SOFÁ', 'NO SOFÁ'), start: 'st', nodes: {
      st: { branch: [{ req: function (s) { return !!(s.fx.mdma || s.fx.meth || s.fx.coke || s.fx.ket); }, to: 'a2' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`Pasc has a small bag and a big smile. "One more? For the road. For the sunrise. For the vibes." The bag goes round the sofa: a pinch, a pass. It's on its way to you.`, `Pasc tiene una bolsita y una sonrisa grande. «¿Una más? Para el camino. Para el amanecer. Para el ambiente». La bolsa da la vuelta al sofá: una pizca, un pase. Viene hacia ti.`, `O Pasc tem um saquinho e um sorriso grande. «Mais uma? Pra estrada. Pro nascer do sol. Pelo clima». O saquinho roda pelo sofá: uma pitada, um passe. Tá vindo pra você.`),
        choices: [
          K('chill', t(`"I'm good. Pass it on."`, `«Estoy bien. Pásala».`, `«Tô bem. Passa adiante».`), { do: { soc: 2, flag: ['one_done', 'one_no'], quest: { q_af5: 'done' } }, call: 'af_one_friends', next: 'no' }),
          K('joke', t(`"I'm good. The toast has no side effects. Want some?"`, `«Estoy bien. Las tostadas no tienen efectos secundarios. ¿Quieres?»`, `«Tô bem. A torrada não tem efeito colateral. Quer?»`), { do: { fun: 2, soc: 2, flag: ['one_done', 'one_no'], quest: { q_af5: 'done' } }, call: 'af_one_friends', next: 'no' }),
          K('bold', t(`Take a pinch for the road.`, `Tomar una pizca para el camino.`, `Pegar uma pitada pra estrada.`), { do: { flag: ['one_done', 'one_yes'], quest: { q_af5: 'done' } }, call: 'af_bag_yes', next: 'yes' }),
          K('blunt', t(`Give it back with a speech about dosage.`, `Devolverla con un discurso sobre dosis.`, `Devolver com um discurso sobre dose.`), { do: { soc: -4, fun: -3, flag: ['one_done', 'one_lecture'], quest: { q_af5: 'done' } }, call: 'af_one_friends', next: 'lecture' })
        ]
      },
      a2: {
        text: t(`Pasc has a small bag and a look that goes straight to your pupils. "You took one at four. You were radiant. What's one more?" He's not selling. He's lonely. If he doesn't bring it, he doesn't get called.`, `Pasc tiene una bolsita y una mirada que va directo a tus pupilas. «Tomaste una a las cuatro. Estabas radiante. ¿Qué es una más?» No vende. Está solo. Si no la trae, no lo llaman.`, `O Pasc tem um saquinho e um olhar que vai direto nas suas pupilas. «Você tomou uma às quatro. Tava radiante. O que é mais uma?» Ele não tá vendendo. Tá sozinho. Se não trouxer, não chamam.`),
        choices: [
          K('honest', t(`"I took one, and it was the right amount. I'm not doing a second."`, `«Tomé una y fue la cantidad justa. No voy a hacer una segunda».`, `«Tomei uma e foi a quantidade certa. Não vou fazer uma segunda».`), { do: { soc: 2, flag: ['one_done', 'one_no'], quest: { q_af5: 'done' } }, call: 'af_one_friends', next: 'no2' }),
          K('bold', t(`Take a pinch.`, `Tomar una pizca.`, `Pegar uma pitada.`), { do: { flag: ['one_done', 'one_yes'], quest: { q_af5: 'done' } }, call: 'af_bag_yes', next: 'yes' }),
          K('blunt', t(`Give it back with a speech about dosage.`, `Devolverla con un discurso sobre dosis.`, `Devolver com um discurso sobre dose.`), { do: { soc: -4, fun: -3, flag: ['one_done', 'one_lecture'], quest: { q_af5: 'done' } }, call: 'af_one_friends', next: 'lecture' })
        ]
      },
      no: { text: t(`Pasc shrugs, delighted anyway. "More for the sunrise." The bag moves on. Nobody makes it a thing, which is the whole trick.`, `Pasc se encoge de hombros, contento igual. «Más para el amanecer». La bolsa sigue su camino. Nadie lo convierte en un tema, que es todo el truco.`, `O Pasc dá de ombros, feliz mesmo assim. «Sobra mais pro nascer do sol». O saquinho segue. Ninguém faz disso um assunto, que é o truque todo.`), next: null },
      no2: { text: t(`"Right amount," Pasc repeats. He rolls it around his head. "That's a better answer than mine." The bag goes on to the next person without a word.`, `«Cantidad justa», repite Pasc. Se lo da vueltas en la cabeza. «Esa es una respuesta mejor que la mía». La bolsa pasa a la siguiente persona sin una palabra.`, `«Quantidade certa», repete o Pasc. Gira isso na cabeça. «Essa é uma resposta melhor que a minha». O saquinho segue pra próxima pessoa sem uma palavra.`), next: null },
      yes: { text: t(`The bag is warm from other hands. You take a pinch. It lands where it always lands: on the long part of the morning you were going to sleep through. MDMA is still the most fun. The body keeps its own books.`, `La bolsa está tibia de otras manos. Tomas una pizca. Cae donde siempre cae: en la parte larga de la mañana que ibas a dormir. El MDMA sigue siendo lo más divertido. El cuerpo lleva sus propias cuentas.`, `O saquinho tá morno de outras mãos. Você pega uma pitada. Cai onde sempre cai: na parte longa da manhã que você ia dormir. MDMA continua sendo o mais divertido. O corpo mantém as próprias contas.`), next: null },
      lecture: { text: t(`"Okay, professor," says Pasc, kindly, and the sofa goes quiet. Nobody needed the numbers. They all know the numbers. The bag moves on, a little less friendly.`, `«Bueno, profesor», dice Pasc, con cariño, y el sofá se queda en silencio. Nadie necesitaba los números. Todos se los saben. La bolsa sigue su camino, un poco menos amistosa.`, `«Tá, professor», diz o Pasc, com carinho, e o sofá fica em silêncio. Ninguém precisava dos números. Todo mundo sabe. O saquinho segue, um pouco menos simpático.`), next: null }
    }
  };

  /* ============================================================ NOOR in the queue: one toilet, and a move on the fourth */
  D.af_queue = {
    who: 'noor', role: t('IN THE QUEUE', 'EN LA FILA', 'NA FILA'), start: 'a', nodes: {
      a: {
        text: t(`One toilet, one queue, one rule. Noor has been "next" since the sunrise and has made peace with it. "Everybody says a good bathroom is the soul of a house. This one has a soul and no schedule."`, `Un baño, una fila, una regla. Noor está «siguiente» desde el amanecer y ya hizo las paces. «Todos dicen que un buen baño es el alma de una casa. Este tiene alma y ningún horario».`, `Um banheiro, uma fila, uma regra. A Noor tá «a próxima» desde o nascer do sol e já fez as pazes. «Todo mundo diz que um bom banheiro é a alma de uma casa. Esse tem alma e nenhum horário».`),
        choices: [
          K('joke', t(`"Go ahead. I'm in no hurry."`, `«Pasa tú. No tengo prisa».`, `«Vai você. Não tenho pressa».`), { do: { fun: 3, soc: 2, time: 3, flag: 'queue_joke' }, next: 'b' }),
          K('ask', t(`Ask how she's doing, in a queue this long.`, `Preguntarle cómo está, en una fila tan larga.`, `Perguntar como ela tá, numa fila dessas.`), { next: 'b' }),
          K('chill', t(`Wait your turn quietly.`, `Esperar tu turno en silencio.`, `Esperar sua vez em silêncio.`), { free: true, next: null })
        ]
      },
      b: {
        text: t(`"I move on the fourth. Lisbon, a job. I've been telling people for a month, and every time they say 'amazing' and I hear 'you're leaving'." She watches the door. "This is my last after here. I keep wanting to take pictures and then I remember the basket."`, `«Me mudo el cuatro. Lisboa, un trabajo. Llevo un mes contándoselo a la gente, y cada vez dicen 'increíble' y yo oigo 'te vas'». Mira la puerta. «Es mi último after aquí. Sigo queriendo sacar fotos y luego me acuerdo de la canasta».`, `«Eu me mudo dia quatro. Lisboa, um emprego. Faz um mês que conto pras pessoas, e toda vez elas dizem 'incrível' e eu ouço 'você tá indo embora'». Ela olha a porta. «É meu último after aqui. Fico querendo tirar foto e aí lembro da cesta».`),
        choices: [
          K('care', t(`Tell her what you'll remember about her from tonight.`, `Decirle qué recordarás de ella de esta noche.`, `Dizer do que você vai lembrar dela dessa noite.`), { do: { soc: 3, care: 1, flag: 'g_noor_open' }, next: 'c' }),
          K('honest', t(`Say "amazing", and then say it's okay to hear it as "you're leaving".`, `Decir «increíble» y luego decir que está bien oírlo como «te vas».`, `Dizer «incrível» e depois dizer que tá tudo bem ouvir como «você tá indo embora».`), { do: { soc: 4, care: 1, flag: 'g_noor_open' }, next: 'c' })
        ]
      },
      c: { text: t(`She is quiet. "That's the first time somebody's said both." The bathroom door opens. She doesn't move. "Go. I'll be next in a minute. I'd like to stand here a bit."`, `Se queda callada. «Es la primera vez que alguien dice las dos cosas». Se abre la puerta del baño. No se mueve. «Pasa tú. Voy en un minuto. Quiero quedarme parada aquí un rato».`, `Ela fica quieta. «É a primeira vez que alguém diz as duas coisas». A porta do banheiro abre. Ela não se mexe. «Vai você. Eu vou daqui a um minuto. Quero ficar parada aqui um pouco».`), next: null }
    }
  };

  /* ============================================================ DOÑA REMEDIOS: a record from 1974 */
  D.af_remedios = {
    who: 'remedios', role: t('ON THE NEXT BALCONY', 'EN EL BALCÓN DE AL LADO', 'NA VARANDA AO LADO'), start: 'st', nodes: {
      st: { branch: [{ req: F('rem_played'), to: 'played' }, { req: F('rem_met'), to: 'waiting' }, { req: function () { return true; }, to: 'a' }] },
      a: {
        text: t(`On the next balcony an old woman in a quilted dressing gown waters a geranium. "I've been up since five," she says. "Your record's the first thing in months that's better than the radio."`, `En el balcón de al lado una anciana con bata acolchada riega un geranio. «Estoy despierta desde las cinco», dice. «Tu disco es lo primero en meses mejor que la radio».`, `Na varanda ao lado uma senhora de roupão acolchoado rega um gerânio. «Tô acordada desde as cinco», diz. «O seu disco é a primeira coisa em meses melhor que o rádio».`),
        choices: [
          K('care', t(`Ask what she'd like to hear.`, `Preguntarle qué le gustaría oír.`, `Perguntar o que ela gostaria de ouvir.`), { do: { flag: 'rem_met', soc: 3, fun: 2, time: 8 }, next: 'b' }),
          K('joke', t(`Offer her toast across the railing.`, `Ofrecerle una tostada por encima de la baranda.`, `Oferecer torrada por cima do parapeito.`), { do: { fun: 3, soc: 2, flag: 'rem_toast', time: 4 }, next: 'toast' }),
          K('chill', t(`Say good morning and leave it.`, `Decir buenos días y dejarlo.`, `Dar bom dia e deixar.`), { free: true, next: null })
        ]
      },
      b: {
        text: t(`"Cumbia. Nineteen seventy-four. Anything with a guiro." She waters the geranium thoughtfully. "My husband danced the way you cross a busy street: carefully, and only when it was safe. Every Sunday for thirty years. He died in March." She doesn't look up. "The boy has a lot of records. Ask him."`, `«Cumbia. Mil novecientos setenta y cuatro. Cualquier cosa con güiro». Riega el geranio con atención. «Mi marido bailaba como quien cruza una calle: con cuidado, y solo cuando era seguro. Todos los domingos durante treinta años. Murió en marzo». No levanta la vista. «El muchacho tiene muchos discos. Pídeselo».`, `«Cumbia. Mil novecentos e setenta e quatro. Qualquer coisa com güiro». Ela rega o gerânio com atenção. «Meu marido dançava feito quem atravessa a rua: com cuidado, e só quando era seguro. Todo domingo por trinta anos. Morreu em março». Ela não levanta o olhar. «O rapaz tem muitos discos. Pede pra ele».`),
        next: null
      },
      toast: { text: t(`She accepts the toast with two fingers and the dignity of a head of state. "Butter, yes. Thank you." You have an understanding.`, `Acepta la tostada con dos dedos y la dignidad de una jefa de Estado. «Mantequilla, sí. Gracias». Tienen un entendimiento.`, `Ela aceita a torrada com dois dedos e a dignidade de uma chefe de Estado. «Manteiga, sim. Obrigada». Vocês têm um entendimento.`), next: null },
      waiting: { text: t(`"Did you ask the boy?" She is watering the same leaf for the second time. "No hurry. I'm not going anywhere. I've been up since five."`, `«¿Le preguntaste al muchacho?» Riega la misma hoja por segunda vez. «Sin apuro. No me voy a ninguna parte. Estoy despierta desde las cinco».`, `«Você perguntou pro rapaz?» Ela rega a mesma folha pela segunda vez. «Sem pressa. Não vou a lugar nenhum. Tô acordada desde as cinco».`), next: null },
      played: {
        text: t(`The record plays at two. She stands very still at the railing with the geranium dripping. "That's the one." She doesn't say anything else for a while. Then: "Tell the boy with the bass he's a good boy, but I'm old. Before ten I'm on the building's side. After ten I'm on yours." From now on a sound that would have carried carries less.`, `El disco suena en dos. Ella se queda muy quieta en la baranda con el geranio goteando. «Ese es». No dice nada más por un rato. Luego: «Dile al muchacho del bajo que es buen chico, pero yo soy vieja. Antes de las diez estoy del lado del edificio. Después de las diez, del tuyo». A partir de ahora un sonido que habría llegado lejos llega menos.`, `O disco toca em dois. Ela fica muito quieta no parapeito com o gerânio pingando. «É esse». Não diz mais nada por um tempo. Depois: «Diz pro rapaz do grave que ele é bom menino, mas eu sou velha. Antes das dez eu tô do lado do prédio. Depois das dez, do seu». A partir de agora um som que teria viajado viaja menos.`),
        once: true, do: { flag: ['rem_ally', 'g_remedios_open'], soc: 4, care: 1 }, next: null
      }
    }
  };
})();

/* ---- consolidated from story_v32b.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic;
  const D = EM.DIALOGUES, S = EM.scripts, AF = EM.AF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const withF = function (f) { return function () { return L.hasFriend(f); }; };
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };

  S.af_noise8 = function () { AF.noise(8); };

  /* ============================================================ 6. THE KNOCK: who lives on each wall */
  D.af_marcos = {
    forced: true, who: 'marcos', role: t('ABOVE: A CALL AT TEN', 'ARRIBA: UNA LLAMADA A LAS DIEZ', 'EM CIMA: UMA CALL ÀS DEZ'), start: 'a', nodes: {
      a: {
        text: t(`Knock, knock. A man in a sleep-creased T-shirt and one slipper. "Sorry. I've got a call at ten. It's the interview, the one I've waited eight months for. Your floor is my ceiling and I can feel the kick in my teeth."`, `Toc, toc. Un hombre con una camiseta arrugada de dormir y una sola pantufla. «Perdón. Tengo una llamada a las diez. Es la entrevista, la que espero hace ocho meses. Su piso es mi techo y siento el bombo en los dientes».`, `Toc, toc. Um homem de camiseta amassada de dormir e um chinelo só. «Desculpa. Tenho uma call às dez. É a entrevista, a que espero faz oito meses. O seu chão é o meu teto e eu sinto o bumbo nos dentes».`),
        choices: [
          K('care', t(`Say sorry, and mean it. Turn the music off now.`, `Pedir perdón, y de verdad. Apagar la música ahora.`, `Pedir desculpa, de verdade. Desligar a música agora.`), { do: { call: 'af_vol0', care: 1, soc: 3, fun: -3, flag: ['marcos_ok'], quest: { q_af6: 'active' } }, next: 'ok' }),
          K('smooth', t(`"Rug only. Socks only. Nobody stomps."`, `«Solo en la alfombra. Solo con calcetines. Nadie pisa fuerte».`, `«Só no tapete. Só de meia. Ninguém pisa forte».`), { do: { call: 'af_dn25', fun: 1, soc: 2, flag: ['marcos_ok'], quest: { q_af6: 'active' } }, next: 'rug' }),
          K('care', t(`"Doña Remedios likes the record. Come and hear it."`, `«A doña Remedios le gusta el disco. Ven a escucharlo».`, `«A dona Remedios gosta do disco. Vem ouvir».`), { req: F('rem_ally'), do: { call: 'af_dn35', soc: 4, flag: ['marcos_ok'], quest: { q_af6: 'active' } }, next: 'remedios' }),
          K('plan', t(`"We'll keep it silent until eleven. I'll stay by the stereo myself."`, `«Lo mantenemos en silencio hasta las once. Yo me quedo junto al equipo».`, `«A gente fica em silêncio até as onze. Eu fico do lado do som».`), { do: { call: 'af_vol0', care: 1, time: 20, soc: -1, flag: ['marcos_ok', 'marcos_vigil'], quest: { q_af6: 'active' } }, next: 'vigil' }),
          K('blunt', t(`"It's Sunday morning. People are allowed to dance."`, `«Es domingo por la mañana. La gente puede bailar».`, `«É domingo de manhã. As pessoas podem dançar».`), { do: { soc: -3, call: 'af_up8', flag: 'marcos_cross', quest: { q_af6: 'active' } }, next: 'cross' }),
          K('silent', t(`Pretend nobody's home.`, `Fingir que no hay nadie.`, `Fingir que não tem ninguém em casa.`), { free: true, do: { call: 'af_up8', flag: 'marcos_ignored', quest: { q_af6: 'active' } }, next: null, react: t(`The knocking stops. A note slides under the door. You don't read it. The bass keeps going.`, `Los golpes paran. Una nota se desliza bajo la puerta. No la lees. El bajo sigue.`, `As batidas param. Um bilhete desliza por baixo da porta. Você não lê. O grave continua.`) })
        ]
      },
      ok: { text: t(`"Thank you." He lets out a breath. "It's a good party. It's just above me. I need this job. I've got a mortgage and a savings account I'm not allowed to touch." A beat. "I'll come down for toast at eleven if the call goes well. If it doesn't I'll come down for toast anyway."`, `«Gracias». Suelta el aire. «Es una buena fiesta. Solo que está encima de mí. Necesito este trabajo. Tengo una hipoteca y una cuenta de ahorros que no puedo tocar». Una pausa. «Bajo por tostadas a las once si la llamada sale bien. Si no sale bien, bajo igual».`, `«Obrigado». Ele solta o ar. «É uma boa festa. Só que fica em cima de mim. Preciso desse emprego. Tenho um financiamento e uma poupança que não posso mexer». Uma pausa. «Desço pra torrada às onze se a call der certo. Se não der, desço do mesmo jeito».`), next: null },
      rug: { text: t(`He looks past you at the rug and the socks. "Okay. The rug." He nods once, which in a neighbour is a handshake. "Fifty minutes, that's all I need. After that do what you like."`, `Mira detrás de ti la alfombra y los calcetines. «Está bien. La alfombra». Asiente una vez, que en un vecino es un apretón de manos. «Cincuenta minutos, es todo lo que necesito. Después hagan lo que quieran».`, `Ele olha atrás de você pro tapete e as meias. «Tá. O tapete». Assente uma vez, o que num vizinho é um aperto de mão. «Cinquenta minutos, é só isso que preciso. Depois façam o que quiserem».`), next: null },
      remedios: { text: t(`On the balcony Remedios lifts her watering can in salute. Marcos looks at her, then at the record, then at his watch. "Ten minutes. I'll come in my slippers." He does, and he stays six.`, `En el balcón, Remedios levanta su regadera en señal de saludo. Marcos la mira, luego al disco, luego a su reloj. «Diez minutos. Voy en pantuflas». Lo hace, y se queda seis.`, `Na varanda, a Remedios levanta o regador em saudação. O Marcos olha pra ela, pro disco, pro relógio. «Dez minutos. Eu desço de chinelo». Ele desce, e fica seis.`), next: null },
      vigil: { text: t(`You stand by the stereo for twenty minutes with a hand over the volume knob, listening to the building. A floor above, a call begins and a voice you can't make out says good morning to somebody important. At ten past, a slow footstep goes across the ceiling, and stops, and the interview goes on.`, `Te quedas junto al equipo veinte minutos con la mano sobre la perilla del volumen, oyendo el edificio. Un piso arriba empieza una llamada y una voz que no distingues le da los buenos días a alguien importante. A las diez y diez, un paso lento cruza el techo y se detiene, y la entrevista sigue.`, `Você fica do lado do som vinte minutos com a mão no botão do volume, ouvindo o prédio. Um andar acima começa uma call e uma voz que você não distingue dá bom dia a alguém importante. Às dez e dez, um passo lento atravessa o teto, para, e a entrevista segue.`), next: null },
      cross: { text: t(`"Allowed, sure," Marcos says, tired. "Please do it quietly." He goes up the stairs one heavy step at a time. You hear a door close and, a moment after, the particular sound of someone typing a complaint.`, `«Permitido, claro», dice Marcos, cansado. «Háganlo bajito, por favor». Sube las escaleras un paso pesado a la vez. Oyes cerrarse una puerta y, un momento después, el sonido particular de alguien escribiendo una queja.`, `«Pode, claro», diz o Marcos, cansado. «Façam baixinho, por favor». Ele sobe a escada um passo pesado de cada vez. Você ouve uma porta fechar e, um momento depois, o som particular de alguém digitando uma reclamação.`), do: { call: 'af_noise8' }, next: null }
    }
  };
  D.af_beto = {
    forced: true, who: 'beto', role: t('LEFT WALL: THE NIGHT NURSE', 'PARED IZQUIERDA: EL ENFERMERO', 'PAREDE ESQUERDA: O ENFERMEIRO'), start: 'a', nodes: {
      a: {
        text: function (s) {
          return s.flags.mb_visit
            ? [t(`A tired man in scrubs, keys in his hand, has just got in. "Your music I can sleep through. The headboard, no. I'm not against anybody's Sunday. It's my wall, that's all." A pause. "I lost someone at four. A patient. I know it's not your problem. I'd just like it quiet."`, `Un hombre cansado con uniforme, las llaves en la mano, acaba de llegar. «Tu música la puedo dormir. El respaldo, no. No estoy en contra del domingo de nadie. Es mi pared, eso es todo». Una pausa. «Perdí a alguien a las cuatro. Un paciente. Sé que no es tu problema. Solo quisiera que haya silencio».`, `Um homem cansado de uniforme, chaves na mão, acabou de chegar. «A música eu consigo dormir. A cabeceira, não. Não sou contra o domingo de ninguém. É a minha parede, só isso». Uma pausa. «Perdi alguém às quatro. Um paciente. Sei que não é problema seu. Só queria silêncio».`)]
            : [t(`A tired man in scrubs, keys in his hand, has just got in from a shift. "My bed's on the other side of your speaker. I'm not angry." A pause. "I lost someone at four. A patient. I know it's not your problem. I'd just like it quiet."`, `Un hombre cansado con uniforme, las llaves en la mano, acaba de llegar de un turno. «Mi cama está del otro lado de tu parlante. No estoy enojado». Una pausa. «Perdí a alguien a las cuatro. Un paciente. Sé que no es tu problema. Solo quisiera que haya silencio».`, `Um homem cansado de uniforme, chaves na mão, acabou de chegar de um plantão. «Minha cama fica do outro lado do seu alto-falante. Não tô bravo». Uma pausa. «Perdi alguém às quatro. Um paciente. Sei que não é problema seu. Só queria silêncio».`)];
        },
        choices: [
          K('care', t(`Say sorry. Move the party to the far end and close the doors.`, `Pedir perdón. Llevar la fiesta al otro extremo y cerrar las puertas.`, `Pedir desculpa. Levar a festa pro outro lado e fechar as portas.`), { do: { call: 'af_dn25', care: 1, soc: 3, time: 6, fun: -2, flag: 'beto_ok' }, next: 'ok' }),
          K('care', t(`Offer a quiet hour: no bass until he has slept.`, `Ofrecer una hora de silencio: sin bajo hasta que haya dormido.`, `Oferecer uma hora de silêncio: sem grave até ele dormir.`), { do: { call: 'af_vol0', care: 1, soc: 4, fun: -3, flag: ['beto_ok', 'quiet_hour'] }, next: 'quiet' }),
          K('honest', t(`"Do you want to talk for a bit, or do you want quiet?"`, `«¿Quieres hablar un rato, o quieres silencio?»`, `«Quer conversar um pouco, ou quer silêncio?»`), { do: { time: 12, soc: -1 }, next: 'talk' }),
          K('silent', t(`Don't answer.`, `No contestar.`, `Não responder.`), { free: true, do: { call: 'af_up8', flag: 'beto_ignored' }, next: null, react: t(`Three more knocks. Then a long silence, and the sound of someone sitting down against the door.`, `Tres golpes más. Luego un silencio largo, y el sonido de alguien sentándose contra la puerta.`, `Mais três batidas. Depois um silêncio longo, e o som de alguém sentando encostado na porta.`) })
        ]
      },
      ok: { text: t(`"Thank you." He rubs his face. "I'll sleep through the rest. Knock if there's a fire." He is already walking back down the corridor.`, `«Gracias». Se frota la cara. «Duermo el resto. Toquen si hay un incendio». Ya camina de vuelta por el pasillo.`, `«Obrigado». Ele esfrega o rosto. «Eu durmo o resto. Batam se tiver incêndio». Já tá voltando pelo corredor.`), next: null },
      quiet: { text: t(`"A quiet hour," he repeats, trying the unusual word. "I'll set an alarm. You're good people." He goes. The flat hears itself.`, `«Una hora de silencio», repite, probando la palabra rara. «Pongo una alarma. Son buena gente». Se va. El departamento se oye a sí mismo.`, `«Uma hora de silêncio», repete, experimentando a palavra rara. «Ponho um alarme. Vocês são gente boa». Ele vai. O apê se escuta.`), next: null },
      talk: {
        text: t(`"Talk," he says, surprised at himself. "Ten minutes. Not about her. About anything." You stand in the doorway and talk about radiators, about a bakery that's changed its bread, about the bus. At the end he says, "That helped more than the silence would have." He yawns until his jaw cracks. "Go back to your party. I'll be asleep before you're at the end of the hall."`, `«Hablar», dice, sorprendido de sí mismo. «Diez minutos. No de ella. De cualquier cosa». Se quedan en el umbral hablando de radiadores, de una panadería que cambió el pan, del bus. Al final dice: «Me ayudó más que el silencio». Bosteza hasta que le cruje la mandíbula. «Vuelvan a su fiesta. Yo estaré dormido antes de que lleguen al final del pasillo».`, `«Conversar», diz, surpreso consigo mesmo. «Dez minutos. Não sobre ela. Sobre qualquer coisa». Vocês ficam na porta falando de radiador, de uma padaria que mudou o pão, do ônibus. No fim ele diz: «Ajudou mais que o silêncio». Boceja até a mandíbula estalar. «Voltem pra festa. Vou estar dormindo antes de vocês chegarem no fim do corredor».`),
        do: { call: 'af_dn35', care: 1, soc: 5, flag: ['beto_ok', 'g_beto_open'] }, next: null
      }
    }
  };
  D.af_quiroga1 = {
    forced: true, who: 'quiroga', role: t('THE LANDLORD', 'EL DUEÑO', 'O DONO'), start: 'a', nodes: {
      a: {
        text: [
          t(`Anselm opens the door and his shoulders drop. The landlord stands on the mat in his coat, a folder under one arm. "Third floor, second complaint of the year. The Alvarados have a four-month-old who hasn't slept since your first record."`, `Anselm abre la puerta y se le caen los hombros. El dueño está sobre el felpudo con su abrigo y una carpeta bajo el brazo. «Tercer piso, segunda queja del año. Los Alvarado tienen un bebé de cuatro meses que no duerme desde su primer disco».`, `O Anselm abre a porta e os ombros dele caem. O dono tá no capacho de casaco, com uma pasta debaixo do braço. «Terceiro andar, segunda reclamação do ano. Os Alvarado têm um bebê de quatro meses que não dorme desde o primeiro disco de vocês».`),
          t(`"I'm not here to shout. I've got an owner of my own. A third complaint and I'm the one who has to give you notice, and I'd rather not be that man. I knew your mother, Anselm."`, `«No vengo a gritar. Tengo mi propio dueño. Una tercera queja y soy yo quien tiene que darles aviso, y preferiría no ser ese hombre. Conocí a tu madre, Anselm».`, `«Não vim gritar. Eu tenho um dono também. Uma terceira reclamação e sou eu que preciso dar o aviso, e preferia não ser esse homem. Eu conhecia a sua mãe, Anselm».`)
        ],
        choices: [
          K('care', t(`Apologise with Anselm. "It stops now. We'll clean the stairs too."`, `Pedir perdón junto con Anselm. «Se acaba ahora. Además limpiamos la escalera».`, `Pedir desculpa junto com o Anselm. «Acaba agora. A gente limpa a escada também».`), { do: { care: 1, soc: 4, time: 12, fun: -3, call: 'af_quiroga_down', flag: ['quiroga_warned', 'quiroga_ok'], quest: { q_af6: 'done' } }, next: 'ok' }),
          K('care', t(`Ask what the Alvarados actually need. "Can we bring something down?"`, `Preguntar qué necesitan de verdad los Alvarado. «¿Podemos bajarles algo?»`, `Perguntar o que os Alvarado precisam de verdade. «A gente pode levar alguma coisa lá embaixo?»`), { do: { care: 2, soc: 5, time: 15, call: 'af_quiroga_down', flag: ['quiroga_warned', 'alv_gift'], quest: { q_af6: 'done' } }, next: 'gift' }),
          K('care', t(`Send a loaf of the bakery bread down to the Alvarados.`, `Mandar un pan de la panadería a los Alvarado.`, `Mandar um pão da padaria pros Alvarado.`), { req: F('brought_food'), do: { care: 2, soc: 6, call: 'af_quiroga_down', flag: ['quiroga_warned', 'alv_bread'], quest: { q_af6: 'done' } }, next: 'bread' }),
          K('honest', t(`Take the warning in your own name. "I'm the one who held the door. Write it against me."`, `Tomar la advertencia a tu nombre. «Yo fui quien atendió la puerta. Anótalo contra mí».`, `Assumir o aviso no seu nome. «Fui eu que cuidei da porta. Anota contra mim».`), { req: F('door_yours'), do: { care: 2, soc: -3, call: 'af_quiroga_down', flag: ['quiroga_warned', 'warning_yours'], quest: { q_af6: 'done' } }, next: 'yours' }),
          K('blunt', t(`"It's one morning. People live here too."`, `«Es una mañana. Aquí también vive gente».`, `«É uma manhã. Gente mora aqui também».`), { do: { soc: -4, call: 'af_quiroga_down', flag: ['quiroga_warned', 'quiroga_cross'], quest: { q_af6: 'done' } }, next: 'cross' })
        ]
      },
      ok: { text: t(`"Thank you. Keep it like this." He leaves. For a while the flat is silent. You get the bucket and do the stairs, all three flights, and the records go back in their sleeves. The flat is, at last, just a flat.`, `«Gracias. Manténganlo así». Se va. Por un rato el departamento está en silencio. Buscas el balde y haces las escaleras, los tres pisos, y los discos vuelven a sus fundas. El departamento es, por fin, solo un departamento.`, `«Obrigado. Mantenham assim». Ele vai embora. Por um tempo o apê fica em silêncio. Você pega o balde e limpa a escada, os três andares, e os discos voltam pras capas. O apê é, enfim, só um apê.`), next: null },
      gift: { text: t(`He blinks. "What they need. Nobody's asked that." He puts the folder under the other arm. "Sleep. Failing that, quiet stairs and a note under the door that says somebody's sorry." You write it on the back of a flyer. He takes it down himself. He doesn't write anything in the folder.`, `Parpadea. «Lo que necesitan. Nadie lo ha preguntado». Cambia la carpeta de brazo. «Dormir. Si no, escaleras silenciosas y una nota bajo la puerta que diga que alguien lo siente». La escribes en el dorso de un volante. Él la baja personalmente. No escribe nada en la carpeta.`, `Ele pisca. «O que eles precisam. Ninguém perguntou isso». Passa a pasta pro outro braço. «Dormir. Na falta, escada silenciosa e um bilhete embaixo da porta dizendo que alguém sente muito». Você escreve no verso de um panfleto. Ele leva lá embaixo pessoalmente. Não anota nada na pasta.`), next: null },
      bread: { text: t(`You hand him a warm loaf in paper. He holds it at arm's length. "For the baby's parents. Fine. I'll take it down myself." He doesn't write anything in the folder.`, `Le das un pan tibio en papel. Lo sostiene con el brazo estirado. «Para los padres del bebé. Bueno. Lo bajo yo». No escribe nada en la carpeta.`, `Você entrega um pão morno em papel. Ele segura com o braço esticado. «Pros pais do bebê. Tá. Eu mesmo levo». Não anota nada na pasta.`), next: null },
      yours: { text: t(`Quiroga looks at you for a while. "That's not how it usually goes." He opens the folder and writes your name on the line, in capitals, with some care. "It's in your name. If there's a third, it's you who leaves, and Anselm and Dot stay." He closes it. "Not many people would."`, `Quiroga te mira un buen rato. «No es así como suele ser». Abre la carpeta y escribe tu nombre en la línea, en mayúsculas, con cuidado. «Queda a tu nombre. Si hay una tercera, eres tú quien se va y Anselm y Dot se quedan». La cierra. «No muchos lo harían».`, `O Quiroga te olha por um tempo. «Não é assim que costuma ser». Abre a pasta e escreve seu nome na linha, em maiúsculas, com cuidado. «Fica no seu nome. Se houver uma terceira, é você que sai e o Anselm e a Dot ficam». Fecha. «Poucos fariam isso».`), next: null },
      cross: { text: t(`"People live here," he agrees, flatly. "That is the point." He writes something in the folder and shuts it. "Quiet. Please."`, `«Aquí vive gente», concuerda, sin inflexión. «Ese es el punto». Escribe algo en la carpeta y la cierra. «Silencio. Por favor».`, `«Gente mora aqui», concorda, sem inflexão. «Esse é o ponto». Escreve algo na pasta e fecha. «Silêncio. Por favor».`), next: null }
    }
  };
  D.af_quiroga2 = {
    forced: true, who: 'quiroga', role: t('THE LANDLORD', 'EL DUEÑO', 'O DONO'), start: 'a', nodes: {
      a: {
        text: function (s) {
          return s.flags.warning_yours
            ? t(`The landlord is back, and this time there's no folder, only a slip with your name on it. He doesn't look at Anselm and Dot. "I said once." He holds the door open for you. "They stay. I keep my word."`, `El dueño volvió, y esta vez sin carpeta, solo un papel con tu nombre. No mira a Anselm ni a Dot. «Dije una vez». Te sostiene la puerta. «Ellos se quedan. Yo cumplo mi palabra».`, `O dono voltou, e dessa vez sem pasta, só um papel com o seu nome. Não olha pro Anselm nem pra Dot. «Eu disse uma vez». Ele segura a porta pra você. «Eles ficam. Eu cumpro a minha palavra».`)
            : t(`The landlord is back, and this time there's no folder. "I said once." Anselm says, very quietly, "I know." Everybody starts putting their shoes on without being asked.`, `El dueño volvió, y esta vez sin carpeta. «Dije una vez». Anselm dice, muy bajito: «Lo sé». Todos empiezan a ponerse los zapatos sin que se lo pidan.`, `O dono voltou, e dessa vez sem pasta. «Eu disse uma vez». O Anselm diz, bem baixinho: «Eu sei». Todo mundo começa a calçar os sapatos sem ninguém pedir.`);
        },
        choices: [
          K('care', t(`Help carry the records down to the car.`, `Ayudar a bajar los discos al auto.`, `Ajudar a levar os discos até o carro.`), { req: function (s) { return !s.flags.warning_yours; }, free: true, do: { care: 1, flag: 'after_evicted' }, call: 'af_end_after', next: null }),
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

  /* ============================================================ BENJAMIN: the next thing, and what it is for */
  D.af_benjamin_next = {
    forced: true, who: 'benjamin', role: t('THE NEXT THING', 'LO SIGUIENTE', 'A PRÓXIMA COISA'), start: 'a', nodes: {
      a: {
        text: t(`Benjamin is rummaging for his shoes, vibrating gently. "What's the next thing? There's always a next thing. A park. A pool. A sunrise but later. Come on." He's smiling and his eyes aren't.`, `Benjamin busca sus zapatos, vibrando suavemente. «¿Qué es lo siguiente? Siempre hay algo siguiente. Un parque. Una pileta. Un amanecer pero más tarde. Vamos». Sonríe y los ojos no.`, `O Benjamin procura os sapatos, vibrando de leve. «Qual é a próxima coisa? Sempre tem uma próxima coisa. Um parque. Uma piscina. Um nascer do sol, só que mais tarde. Bora». Ele sorri e os olhos não.`),
        choices: [
          K('care', t(`"The next thing is toast. And then a bed."`, `«Lo siguiente son tostadas. Y después una cama».`, `«A próxima coisa é torrada. E depois uma cama».`), { do: { bond: { benjamin: 1 }, soc: 2, fun: 2, flag: 'benjamin_toast' }, next: 'toast' }),
          K('ask', t(`"What happens if you stop?"`, `«¿Qué pasa si paras?»`, `«O que acontece se você parar?»`), { next: 'ask' }),
          K('care', t(`"I'm tired too. Let's say it out loud."`, `«Yo también estoy cansado. Digámoslo en voz alta».`, `«Eu também tô cansado. Vamos dizer em voz alta».`), { do: { care: 1, bond: { benjamin: 2 }, soc: 3, flag: 'benjamin_admit' }, next: 'admit' }),
          K('bold', t(`"Let's find the next thing."`, `«Vamos a buscar lo siguiente».`, `«Vamos achar a próxima coisa».`), { do: { fun: 6, hp: -6, soc: -4, time: 30, flag: 'benjamin_chase' }, next: 'chase' })
        ]
      },
      ask: {
        text: t(`The shoes go down. "If I stop moving, someone's going to ask me how I am. And I'll say fine. And they'll know." He sits on the arm of the sofa. "I lost the contract in March. Everyone thinks it's going great. I'm so fucking good at going great."`, `Los zapatos bajan. «Si dejo de moverme, alguien me va a preguntar cómo estoy. Y diré que bien. Y lo sabrán». Se sienta en el brazo del sofá. «Perdí el contrato en marzo. Todos creen que me va genial. Soy buenísimo en que me vaya genial».`, `Os sapatos descem. «Se eu parar de me mexer, alguém vai me perguntar como eu tô. E eu vou dizer que bem. E vão saber». Ele senta no braço do sofá. «Perdi o contrato em março. Todo mundo acha que tá tudo ótimo. Eu sou muito bom em parecer ótimo».`),
        choices: [
          K('care', t(`"I'm not going to ask if you're fine. I'm going to sit here."`, `«No te voy a preguntar si estás bien. Me voy a sentar aquí».`, `«Não vou perguntar se você tá bem. Vou sentar aqui».`), { do: { care: 1, bond: { benjamin: 2 }, soc: 4, flag: ['benjamin_open'] }, next: 'sit' }),
          K('honest', t(`"Tell Luisa. She'd rather know than guess."`, `«Dile a Luisa. Prefiere saberlo a adivinarlo».`, `«Conta pra Luisa. Ela prefere saber a adivinhar».`), { do: { bond: { benjamin: 1, luisa: 1 }, soc: 2, flag: ['benjamin_open', 'benjamin_tellmaru'] }, next: 'luisa' })
        ]
      },
      sit: { text: t(`He doesn't say anything. You don't either. After a minute he leans his weight against your arm, the way he does when he's decided something. "Okay," he says. "Okay. Toast."`, `No dice nada. Tú tampoco. Después de un minuto apoya su peso en tu brazo, como cuando decidió algo. «Bueno», dice. «Bueno. Tostadas».`, `Ele não diz nada. Você também não. Depois de um minuto apoia o peso no seu braço, do jeito que faz quando decidiu alguma coisa. «Tá», diz. «Tá. Torrada».`), next: null },
      luisa: { text: t(`"She'll be kind about it. That's the worst part." He laughs, short. "Okay. Tomorrow. I'll tell her tomorrow, with food." He puts his shoes back on the rack.`, `«Será amable al respecto. Esa es la peor parte». Se ríe, corto. «Bueno. Mañana. Se lo digo mañana, con comida». Vuelve a poner los zapatos en el zapatero.`, `«Ela vai ser gentil com isso. Essa é a pior parte». Ele ri, curto. «Tá. Amanhã. Eu conto amanhã, com comida». Devolve os sapatos pra sapateira.`), next: null },
      toast: { text: t(`"Toast," Benjamin says, struck by the idea. He sits. He eats. After the second slice the shoes are forgotten.`, `«Tostadas», dice Benjamin, golpeado por la idea. Se sienta. Come. Después de la segunda rebanada se olvida de los zapatos.`, `«Torrada», diz o Benjamin, atingido pela ideia. Ele senta. Come. Na segunda fatia, esquece os sapatos.`), next: null },
      admit: { text: t(`"Oh," Benjamin says, and the whole body goes with it. "Oh. I'm so tired." He laughs, then yawns. "I thought it was a feeling. It's just sleep." He lies down on the floor with his shoes on.`, `«Ah», dice Benjamin, y el cuerpo entero lo acompaña. «Ah. Estoy tan cansado». Se ríe, luego bosteza. «Creí que era un sentimiento. Es solo sueño». Se acuesta en el piso con los zapatos puestos.`, `«Ah», diz o Benjamin, e o corpo inteiro vai junto. «Ah. Eu tô tão cansado». Ele ri, depois boceja. «Achei que era um sentimento. É só sono». Deita no chão de sapato e tudo.`), next: null },
      chase: { text: t(`You walk him to the park, sit on a wall, and watch dog walkers. It's fun for twenty minutes. Then the sleep debt arrives all at once, and the whole morning weighs more than the whole night did.`, `Lo llevas al parque, se sientan en un muro y miran a los paseadores de perros. Es divertido veinte minutos. Luego llega de golpe la deuda de sueño, y toda la mañana pesa más que toda la noche.`, `Você leva ele ao parque, vocês sentam num muro e olham quem passeia com cachorro. É divertido por vinte minutos. Depois a dívida de sono chega de uma vez, e a manhã inteira pesa mais do que a noite inteira.`), next: null }
    }
  };

  /* ============================================================ FERNANDO, on the sofa */
  D.af_fena_sofa = {
    who: 'fena', role: t('ON THE SOFA', 'EN EL SOFÁ', 'NO SOFÁ'), start: 'a', nodes: {
      a: {
        text: t(`Fernando is on the sofa, one shoe on and one off, awake enough to watch you come in.`, `Feña está en el sofá, un zapato puesto y otro no, lo bastante despierto como para verte llegar.`, `O Fernando tá no sofá, um sapato calçado e outro não, acordado o bastante pra te ver chegar.`),
        choices: [
          K('care', t(`Sit on the floor next to him.`, `Sentarte en el piso junto a él.`, `Sentar no chão do lado dele.`), { next: 'b' }),
          K('care', t(`Put a blanket over him. Let him sleep.`, `Taparlo con una manta. Dejarlo dormir.`, `Cobrir com um cobertor. Deixar dormir.`), { do: { care: 1, bond: { fena: 1 }, flag: 'fena_blanket' }, next: null }),
          K('care', t(`Wake him properly and take him home.`, `Despertarlo bien y llevarlo a casa.`, `Acordar direito e levar pra casa.`), { do: { time: 35, bond: { fena: 2 }, call: 'af_fena_home', flag: 'fena_walked' }, next: null }),
          K('care', t(`Ask Benjamin to take him home.`, `Pedirle a Benjamin que lo lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('benjamin'), do: { time: 6, bond: { fena: 1, benjamin: 1 }, call: 'af_fena_benjamin', flag: 'fena_benjamin' }, next: null }),
          K('chill', t(`Leave him.`, `Dejarlo.`, `Deixar.`), { free: true, next: null })
        ]
      },
      b: {
        text: t(`"I'm thirty-four," he says to the ceiling. "Tonight was the first time my body felt like it was just mine. Not for anyone. Not for a joke. Just mine." A pause. "I didn't know that was available."`, `«Tengo treinta y cuatro», le dice al techo. «Esta noche fue la primera vez que sentí mi cuerpo solo mío. No para alguien. No para un chiste. Solo mío». Una pausa. «No sabía que eso estaba disponible».`, `«Tenho trinta e quatro», ele diz pro teto. «Hoje foi a primeira vez que senti meu corpo só meu. Não pra alguém. Não pra uma piada. Só meu». Uma pausa. «Eu não sabia que isso existia».`),
        choices: [
          K('honest', t(`"It's been available the whole time."`, `«Ha estado disponible todo el tiempo».`, `«Sempre esteve disponível».`), { do: { soc: 3, care: 1, bond: { fena: 1 }, flag: ['g_fena_open'] }, next: 'c' }),
          K('ask', t(`"What do you want to do with it?"`, `«¿Qué quieres hacer con eso?»`, `«O que você quer fazer com isso?»`), { do: { soc: 3, care: 1, bond: { fena: 1 }, flag: ['g_fena_open'] }, next: 'c2' })
        ]
      },
      c: { text: t(`"Yeah. It has." He closes his eyes. "Don't let me wake up weird. Walk me or leave me, but don't make me decide when I wake up."`, `«Sí. Lo ha estado». Cierra los ojos. «No me dejes despertar raro. Llévame o déjame, pero no me hagas decidir cuando despierte».`, `«É. Sempre esteve». Ele fecha os olhos. «Não me deixa acordar estranho. Me leva ou me deixa, mas não me faz decidir quando eu acordar».`), next: 'a2' },
      c2: { text: t(`"Wear it on the bus." He half laughs. "Tell Benjamin I said something wise. Then tell him I was asleep." He closes his eyes. "Walk me or leave me. Just don't make me decide when I wake up."`, `«Llevarlo en el bus». Se medio ríe. «Dile a Benjamin que dije algo sabio. Luego dile que estaba dormido». Cierra los ojos. «Llévame o déjame. Solo no me hagas decidir cuando despierte».`, `«Usar no ônibus». Ele meio ri. «Diz pro Benjamin que eu falei algo sábio. Depois diz que eu tava dormindo». Fecha os olhos. «Me leva ou me deixa. Só não me faz decidir quando eu acordar».`), next: 'a2' },
      a2: {
        text: t(`He is asleep before you answer.`, `Está dormido antes de que respondas.`, `Ele dorme antes de você responder.`),
        choices: [
          K('care', t(`Put a blanket over him. Let him sleep.`, `Taparlo con una manta. Dejarlo dormir.`, `Cobrir com um cobertor. Deixar dormir.`), { do: { care: 1, bond: { fena: 1 }, flag: 'fena_blanket' }, next: null }),
          K('care', t(`Wake him gently and take him home.`, `Despertarlo con cuidado y llevarlo a casa.`, `Acordar com jeito e levar pra casa.`), { do: { time: 35, bond: { fena: 2 }, call: 'af_fena_home', flag: 'fena_walked' }, next: null }),
          K('care', t(`Ask Benjamin to take him home.`, `Pedirle a Benjamin que lo lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('benjamin'), do: { time: 6, bond: { fena: 1, benjamin: 1 }, call: 'af_fena_benjamin', flag: 'fena_benjamin' }, next: null })
        ]
      }
    }
  };

  /* ============================================================ 7. THE QUESTION: who walks whom home */
  D.af_question = {
    forced: true, who: 'luisa', role: t('THE QUESTION', 'LA PREGUNTA', 'A PERGUNTA'), start: 'a', nodes: {
      a: {
        text: t(`Late morning, and three things happen at once. Luisa has gone quiet and is looking at her hands. Fernando has been asleep on the sofa for an hour. Benjamin is hunting for the next thing. You can't do all of it. You decide who walks whom home.`, `Media mañana, y pasan tres cosas a la vez. Luisa se quedó callada y se mira las manos. Feña lleva una hora dormido en el sofá. Benjamin busca lo siguiente. No puedes con todo. Decides quién acompaña a quién a casa.`, `Fim de manhã, e três coisas acontecem ao mesmo tempo. A Luisa ficou quieta e olha as próprias mãos. O Fernando dorme faz uma hora no sofá. O Benjamin procura a próxima coisa. Você não dá conta de tudo. Decide quem leva quem pra casa.`),
        next: 'm'
      },
      m: { branch: [{ req: withF('luisa'), to: 'luisa' }, { req: function (s) { return !!(s.after && s.after.f.fena && s.after.f.fena.st === 'sofa'); }, to: 'fena' }, { req: function () { return true; }, to: 'end' }] },
      luisa: {
        who: 'luisa',
        text: t(`"I'm okay," Luisa says, in the voice that means she isn't. "I'm tired. It's more than tired. I got an offer in Montevideo and I haven't told anyone, because telling makes it real, and I'm the one who organises everything, and I don't know how to be the one who leaves."`, `«Estoy bien», dice Luisa, con la voz que significa que no. «Estoy cansada. Es más que cansada. Me ofrecieron un trabajo en Montevideo y no se lo he dicho a nadie, porque decirlo lo hace real, y yo soy la que organiza todo, y no sé cómo ser la que se va».`, `«Tô bem», diz a Luisa, na voz que quer dizer que não. «Tô cansada. É mais que cansada. Recebi uma proposta em Montevidéu e não contei pra ninguém, porque contar torna real, e eu sou a que organiza tudo, e não sei como ser a que vai embora».`),
        choices: [
          K('ask', t(`"What do you want to do?"`, `«¿Qué quieres hacer?»`, `«O que você quer fazer?»`), { do: { soc: 3, bond: { luisa: 1 }, flag: ['g_luisa_open'] }, next: 'luisa2' }),
          K('care', t(`Walk Luisa home yourself.`, `Acompañar tú a Luisa hasta su casa.`, `Levar a Luisa pra casa pessoalmente.`), { do: { time: 40, care: 1, bond: { luisa: 2 }, call: 'af_luisa_walk', flag: 'luisa_walked' }, next: 'm2' }),
          K('care', t(`Ask Benjamin to take her home.`, `Pedirle a Benjamin que la lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('benjamin'), do: { time: 6, bond: { luisa: 1, benjamin: 1 }, call: 'af_luisa_benjamin', flag: 'luisa_benjamin' }, next: 'm2' }),
          K('chill', t(`Book her a taxi and wait with her until it comes.`, `Pedirle un taxi y esperar con ella hasta que llegue.`, `Pedir um táxi e esperar com ela até chegar.`), { do: { time: 10, soc: -2, bond: { luisa: 1 }, call: 'af_luisa_taxi', flag: 'luisa_taxi' }, next: 'm2' }),
          K('silent', t(`Hug her, let her go, and promise to text.`, `Abrazarla, dejarla ir y prometer escribirle.`, `Abraçar, deixar ir e prometer mandar mensagem.`), { do: { bond: { luisa: 1 }, call: 'af_luisa_alone' }, next: 'm2' })
        ]
      },
      luisa2: {
        who: 'luisa',
        text: t(`"I want it. That's the problem. I want it and I want all of you. I can't have both and I keep pretending I can." She wipes her face with her sleeve and laughs. "Don't tell Benjamin I cried. He'll make it a song."`, `«Lo quiero. Ese es el problema. Lo quiero y los quiero a todos ustedes. No puedo tener las dos cosas y sigo fingiendo que sí». Se limpia la cara con la manga y se ríe. «No le digas a Benjamin que lloré. Va a hacer una canción».`, `«Eu quero. Esse é o problema. Quero isso e quero vocês todos. Não dá pra ter os dois e eu fico fingindo que dá». Ela limpa o rosto com a manga e ri. «Não conta pro Benjamin que eu chorei. Ele vai fazer uma música».`),
        choices: [
          K('care', t(`Walk Luisa home yourself.`, `Acompañar tú a Luisa hasta su casa.`, `Levar a Luisa pra casa pessoalmente.`), { do: { time: 40, care: 1, bond: { luisa: 2 }, call: 'af_luisa_walk', flag: 'luisa_walked' }, next: 'm2' }),
          K('care', t(`Ask Benjamin to take her home.`, `Pedirle a Benjamin que la lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('benjamin'), do: { time: 6, bond: { luisa: 1, benjamin: 1 }, call: 'af_luisa_benjamin', flag: 'luisa_benjamin' }, next: 'm2' }),
          K('chill', t(`Book her a taxi and wait with her until it comes.`, `Pedirle un taxi y esperar con ella hasta que llegue.`, `Pedir um táxi e esperar com ela até chegar.`), { do: { time: 10, soc: -2, bond: { luisa: 1 }, call: 'af_luisa_taxi', flag: 'luisa_taxi' }, next: 'm2' }),
          K('silent', t(`Hug her, let her go, and promise to text.`, `Abrazarla, dejarla ir y prometer escribirle.`, `Abraçar, deixar ir e prometer mandar mensagem.`), { do: { bond: { luisa: 1 }, call: 'af_luisa_alone' }, next: 'm2' })
        ]
      },
      m2: { branch: [{ req: function (s) { return !!(s.after && s.after.f.fena && s.after.f.fena.st === 'sofa'); }, to: 'fena' }, { req: function () { return true; }, to: 'end' }] },
      fena: {
        who: 'fena',
        text: t(`Fernando snores under his sleeve. Nobody should drag him out of a sleep like that. But a sofa is not a bed, and the hosts have a day ahead of them.`, `Feña ronca bajo su manga. Nadie debería sacarlo de un sueño así. Pero un sofá no es una cama, y los anfitriones tienen un día por delante.`, `O Fernando ronca na manga. Ninguém devia arrancar ele de um sono desses. Mas sofá não é cama, e os anfitriões têm um dia pela frente.`),
        choices: [
          K('care', t(`Let him sleep. Dot says he can stay.`, `Dejarlo dormir. Dot dice que puede quedarse.`, `Deixar dormir. A Dot diz que ele pode ficar.`), { do: { bond: { fena: 1 }, flag: 'fena_stays' }, next: 'end' }),
          K('care', t(`Wake him gently and walk him home.`, `Despertarlo con cuidado y llevarlo a casa.`, `Acordar com jeito e levar pra casa.`), { do: { time: 35, bond: { fena: 2 }, call: 'af_fena_home', flag: 'fena_walked' }, next: 'end' }),
          K('care', t(`Ask Benjamin to take him home.`, `Pedirle a Benjamin que lo lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('benjamin'), do: { time: 6, bond: { fena: 1, benjamin: 1 }, call: 'af_fena_benjamin', flag: 'fena_benjamin' }, next: 'end' })
        ]
      },
      end: { text: t(`Done. Nobody is lost, and everyone who leaves has a name next to theirs on the stairs.`, `Listo. Nadie está perdido, y quien se va tiene un nombre junto al suyo en la escalera.`, `Pronto. Ninguém tá perdido, e quem sai tem um nome do lado na escada.`), do: { quest: { q_af7: 'done' } }, next: null }
    }
  };

  /* ============================================================ the three scenes that close the chapter */
  D.af_noon = {
    forced: true, who: 'dot', role: t('NOON', 'MEDIODÍA', 'MEIO-DIA'), start: 'a', nodes: {
      a: {
        text: function (s) {
          const f = s.flags, out = [t(`The flat is quiet at noon. Sun on the floorboards, a kettle ticking as it cools, the records back in their sleeves in the order Anselm likes.`, `El departamento está en silencio a mediodía. Sol en el piso de madera, una tetera que tintinea al enfriarse, los discos de vuelta en sus fundas en el orden que le gusta a Anselm.`, `O apê tá quieto ao meio-dia. Sol no assoalho, uma chaleira estalando ao esfriar, os discos de volta nas capas na ordem que o Anselm gosta.`)];
          const opened = Object.keys(f).filter(function (k) { return /^g_.*_open$/.test(k); }).length;
          if (opened >= 3) out.push(t(`Dot, drying a mug: "People told you things this morning they don't tell the ones who love them. That's what an after is for. I'd rather it were something else, and it isn't."`, `Dot, secando una taza: «La gente te contó cosas esta mañana que no le cuenta a quienes la quieren. Para eso sirve un after. Preferiría que fuera para otra cosa, y no lo es».`, `A Dot, secando uma caneca: «As pessoas te contaram coisas essa manhã que não contam pra quem gosta delas. É pra isso que serve um after. Preferia que fosse pra outra coisa, e não é».`));
          if (f.af_clean || f.af_trash || f.brought_food) out.push(t(`She looks round the kitchen and finds it cleaner than the night before. "You washed up. You carried things. People think a host's burden is the party. It's the next day."`, `Mira la cocina y la encuentra más limpia que la noche anterior. «Lavaste. Cargaste cosas. La gente cree que la carga del anfitrión es la fiesta. Es el día siguiente».`, `Ela olha a cozinha e acha mais limpa que na noite anterior. «Você lavou. Carregou coisas. As pessoas acham que o peso do anfitrião é a festa. É o dia seguinte».`));
          if (f.door_pledge) out.push(t(`Anselm, hugging a sleeve: "You said you'd answer the door. You did. I kept all the records." He doesn't cry. He nearly does.`, `Anselm, abrazando una funda: «Dijiste que atenderías la puerta. Lo hiciste. Me quedé con todos los discos». No llora. Casi.`, `O Anselm, abraçando uma capa: «Você disse que atendia a porta. Atendeu. Fiquei com todos os discos». Não chora. Quase.`));
          else if (f.quiroga_warned) out.push(t(`Anselm, hugging a sleeve: "The building warned us once and let us stay. I think the Alvarados have forgiven us."`, `Anselm, abrazando una funda: «El edificio nos avisó una vez y nos dejó quedarnos. Creo que los Alvarado nos perdonaron».`, `O Anselm, abraçando uma capa: «O prédio avisou a gente uma vez e deixou ficar. Acho que os Alvarado perdoaram a gente».`));
          return out;
        },
        choices: [K('chill', t(`Put your shoes on. Say thank you.`, `Ponerte los zapatos. Dar las gracias.`, `Calçar os sapatos. Agradecer.`), { free: true, next: null })]
      }
    }
  };
  D.af_out = {
    forced: true, who: 'anselm', role: t('YOUR HOST', 'TU ANFITRIÓN', 'SEU ANFITRIÃO'), start: 'a', nodes: {
      a: {
        text: t(`Anselm doesn't raise his voice. "This is our home. You pushed twice. Please go." He holds the door open with one hand. Behind him you can hear the kettle.`, `Anselm no levanta la voz. «Esta es nuestra casa. Empujaste dos veces. Por favor, vete». Sostiene la puerta abierta con una mano. Detrás de él se oye la tetera.`, `O Anselm não levanta a voz. «Essa é a nossa casa. Você empurrou duas vezes. Por favor, vá embora». Ele segura a porta aberta com uma mão. Atrás dele dá pra ouvir a chaleira.`),
        choices: [K('care', t(`Apologise and go.`, `Pedir perdón e irte.`, `Pedir desculpa e ir.`), { free: true, next: null })]
      }
    }
  };
  D.af_evicted = {
    forced: true, who: 'quiroga', role: t('THE LANDLORD', 'EL DUEÑO', 'O DONO'), start: 'a', nodes: {
      a: {
        text: function (s) {
          return s.flags.warning_yours
            ? t(`The corridor, shoes in hand, one by one down the stairs. Quiroga holds the door for you and for nobody else. Behind you Anselm and Dot stay in the doorway, not waving, which is a kind of waving. "Thank you," says Quiroga. "I'm sorry. Good morning."`, `El pasillo, los zapatos en la mano, uno por uno por la escalera. Quiroga sostiene la puerta para ti y para nadie más. Detrás de ti Anselm y Dot se quedan en el umbral, sin saludar, que es una forma de saludar. «Gracias», dice Quiroga. «Lo siento. Buenos días».`, `O corredor, sapatos na mão, um por um escada abaixo. O Quiroga segura a porta pra você e pra mais ninguém. Atrás de você o Anselm e a Dot ficam na soleira, sem acenar, o que é um jeito de acenar. «Obrigado», diz o Quiroga. «Sinto muito. Bom dia».`)
            : t(`The corridor, shoes in hand, one by one down the stairs. Quiroga holds the door and counts the guests as they leave. "Thank you. I'm sorry. Good morning."`, `El pasillo, los zapatos en la mano, uno por uno por la escalera. Quiroga sostiene la puerta y cuenta a los invitados al salir. «Gracias. Lo siento. Buenos días».`, `O corredor, sapatos na mão, um por um escada abaixo. O Quiroga segura a porta e conta os convidados na saída. «Obrigado. Sinto muito. Bom dia».`);
        },
        choices: [K('chill', t(`Go home.`, `Irte a casa.`, `Ir pra casa.`), { free: true, next: null })]
      }
    }
  };
})();

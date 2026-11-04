/* EXCUSE ME — story v21: three political side quests at the rave, built to interlock with THE PETITION.
   THE MUTUAL-AID TABLE (Tere, courtyard): bring three donations (your own water, Mambo's ice, Klaus's bread, Madison's
   clementines). Pays out a plate of food and, from then on, free water refills.
   THE NEIGHBOURS (Olga, outside, next door): a noise complaint. A truce needs Sub to turn the street-side stack and the
   plate from Tere's table. Olga turns out to be the treasurer of the neighbourhood association, so the truce pays out
   a signature for Maya's petition and a letter for the owner.
   THE OWNER (Ernesto, outside, 02:00 to 05:00): he is deciding who to sell to. Show him two of three things (the
   finished petition, Olga's letter, the mutual-aid table) and he sells to the association. Rave only. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const RV = function (s) { return s.venue === 'rave'; };
  const mk = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };
  const Q = EM.QUESTS;
  function cast(id, name, o) { EM.CAST[id] = { name: name, look: Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 3, bottom: 1, bc: 1, acc: 0, wide: false }, o) }; }

  const OWNER_FROM = 240, OWNER_TO = 420; /* 02:00 to 05:00 */
  const ownerHere = function (s) { return RV(s) && s.time >= OWNER_FROM && s.time < OWNER_TO && !s.flags.owner_gone; };
  const aidCount = function (s) { return ['aid_water', 'aid_ice', 'aid_bread', 'aid_fruit'].filter(function (f) { return s.flags[f]; }).length; };
  const evCount = function (s) { return ['ev_petition', 'ev_letter', 'ev_aid'].filter(function (f) { return s.flags[f]; }).length; };

  /* ============================================================ QUEST LOG */
  Q.sq_aid = {
    title: t(`THE MUTUAL-AID TABLE`, `LA MESA DE AYUDA MUTUA`, `A MESA DE AJUDA MÚTUA`),
    desc: function (s) {
      return t(`Tere's table in the courtyard says TAKE WHAT YOU NEED, BRING WHAT YOU CAN, and it is almost empty. Bring three donations. ${mk(s, 'aid_water')} A bottle of your own water. ${mk(s, 'aid_ice')} Ice from Mambo's cooler (courtyard). ${mk(s, 'aid_bread')} The bread Klaus is carrying around (main floor). ${mk(s, 'aid_fruit')} Madison's clementines (the attic). Then back to Tere. (${aidCount(s)} of 3)`,
        `La mesa de Tere en el patio dice TOMA LO QUE NECESITES, TRAE LO QUE PUEDAS, y está casi vacía. Lleva tres donaciones. ${mk(s, 'aid_water')} Una botella de tu propia agua. ${mk(s, 'aid_ice')} Hielo de la hielera de Mambo (patio). ${mk(s, 'aid_bread')} El pan que Klaus anda cargando (pista). ${mk(s, 'aid_fruit')} Las mandarinas de Madison (el ático). Luego vuelve con Tere. (${aidCount(s)} de 3)`,
        `A mesa da Tere no pátio diz PEGUE O QUE PRECISAR, TRAGA O QUE PUDER, e está quase vazia. Leve três doações. ${mk(s, 'aid_water')} Uma garrafa da sua própria água. ${mk(s, 'aid_ice')} Gelo do isopor do Mambo (pátio). ${mk(s, 'aid_bread')} O pão que o Klaus anda carregando (pista). ${mk(s, 'aid_fruit')} As mexericas da Madison (o sótão). Depois volte pra Tere. (${aidCount(s)} de 3)`);
    },
    doneText: t(`The table is full. Tere refills water bottles for free, and she gave you a plate for somebody who needs it.`, `La mesa está llena. Tere rellena botellas de agua gratis y te dio un plato para alguien que lo necesite.`, `A mesa está cheia. A Tere enche garrafas de água de graça e te deu um prato pra alguém que precise.`)
  };
  Q.sq_neighbours = {
    title: t(`THE NEIGHBOURS`, `LOS VECINOS`, `OS VIZINHOS`),
    desc: function (s) {
      return t(`Olga lives next door and the bass is coming up through her kitchen floor. A truce needs two things. ${mk(s, 'nb_speaker')} Ask Sub (the tunnel) to turn the speaker stack that faces the street. ${mk(s, 'nb_plate')} Olga hasn't eaten since the noise started: bring her a plate from the mutual-aid table (courtyard).`,
        `Olga vive al lado y el bajo le sube por el piso de la cocina. Una tregua necesita dos cosas. ${mk(s, 'nb_speaker')} Pídele a Sub (el túnel) que gire la torre de bocinas que da a la calle. ${mk(s, 'nb_plate')} Olga no ha comido desde que empezó el ruido: llévale un plato de la mesa de ayuda mutua (patio).`,
        `A Olga mora ao lado e o grave está subindo pelo chão da cozinha dela. Uma trégua precisa de duas coisas. ${mk(s, 'nb_speaker')} Peça pra Sub (o túnel) virar a torre de caixas que dá pra rua. ${mk(s, 'nb_plate')} A Olga não come desde que o barulho começou: leve um prato da mesa de ajuda mútua (pátio).`);
    },
    doneText: t(`A truce with the house next door. Olga signed Maya's petition and wrote a letter for the owner.`, `Una tregua con la casa de al lado. Olga firmó la petición de Maya y escribió una carta para el dueño.`, `Uma trégua com a casa do lado. A Olga assinou o abaixo-assinado da Maya e escreveu uma carta pro dono.`)
  };
  Q.sq_owner = {
    title: t(`THE OWNER`, `EL DUEÑO`, `O DONO`),
    desc: function (s) {
      return t(`Ernesto owns the warehouse and is outside until 05:00, deciding who to sell to. Show him two of these. ${mk(s, 'ev_petition')} Maya's finished petition. ${mk(s, 'ev_letter')} A letter from the neighbours. ${mk(s, 'ev_aid')} The mutual-aid table, full.`,
        `Ernesto es dueño de la bodega y está afuera hasta las 05:00, decidiendo a quién vender. Muéstrale dos de estas cosas. ${mk(s, 'ev_petition')} La petición de Maya, terminada. ${mk(s, 'ev_letter')} Una carta de los vecinos. ${mk(s, 'ev_aid')} La mesa de ayuda mutua, llena.`,
        `O Ernesto é dono do galpão e está lá fora até as 05:00, decidindo pra quem vender. Mostre duas destas coisas. ${mk(s, 'ev_petition')} O abaixo-assinado da Maya, completo. ${mk(s, 'ev_letter')} Uma carta dos vizinhos. ${mk(s, 'ev_aid')} A mesa de ajuda mútua, cheia.`);
    },
    doneText: function (s) {
      return s.flags.owner_won
        ? t(`Ernesto is selling to the neighbourhood association. He shook Maya's hand. She is still holding it.`, `Ernesto le vende a la asociación vecinal. Le dio la mano a Maya. Ella todavía no se la suelta.`, `O Ernesto vai vender pra associação de moradores. Ele apertou a mão da Maya. Ela ainda não soltou.`)
        : t(`Ernesto left at five without deciding. Thinking is not no.`, `Ernesto se fue a las cinco sin decidir. Pensarlo no es un no.`, `O Ernesto foi embora às cinco sem decidir. Pensar não é um não.`);
    }
  };

  /* ============================================================ TERE and the mutual-aid table (courtyard) */
  cast('tere', 'TERE', { skin: 3, hair: 4, hc: 2, expr: 1, top: 5, tc: 2, bottom: 2, bc: 4, acc: 1 });
  D.tere = {
    who: 'tere', role: t('MUTUAL AID', 'AYUDA MUTUA', 'AJUDA MÚTUA'), start: 'st', nodes: {
      st: { branch: [
        { req: function (s) { return !!s.flags.aid_done; }, to: 'serve' },
        { req: function (s) { return !!s.flags.aid_on; }, to: 'prog' },
        { req: function () { return true; }, to: 'a' }
      ] },
      a: {
        text: t(`A folding table with a hand-painted sign: TAKE WHAT YOU NEED, BRING WHAT YOU CAN. On it there are four crackers, a jar of peanut butter with a spoon standing in it, and a woman with a marker behind each ear. "I'm Tere. This is the mutual-aid table. It's like a bar, except nobody pays, and the menu is whatever people remembered to bring. Tonight people remembered to bring four crackers."`,
          `Una mesa plegable con un letrero pintado a mano: TOMA LO QUE NECESITES, TRAE LO QUE PUEDAS. Encima hay cuatro galletas, un frasco de crema de maní con una cuchara parada adentro y una mujer con un plumón detrás de cada oreja. «Soy Tere. Esta es la mesa de ayuda mutua. Es como una barra, pero nadie paga y el menú es lo que la gente se acordó de traer. Esta noche la gente se acordó de traer cuatro galletas».`,
          `Uma mesa dobrável com uma placa pintada à mão: PEGUE O QUE PRECISAR, TRAGA O QUE PUDER. Em cima tem quatro bolachas, um pote de pasta de amendoim com uma colher em pé dentro e uma mulher com uma caneta atrás de cada orelha. «Eu sou a Tere. Essa é a mesa de ajuda mútua. É tipo um bar, só que ninguém paga e o cardápio é o que o pessoal lembrou de trazer. Hoje o pessoal lembrou de trazer quatro bolachas».`),
        do: { flag: 'tere_met', soc: 1 },
        choices: [
          K('care', t(`"I'll fill it. What do you need?"`, `«Yo la lleno. ¿Qué necesitas?»`, `«Eu encho. Do que você precisa?»`), { do: { flag: 'aid_on', quest: { sq_aid: 'active' }, soc: 2 }, next: 'list' }),
          K('ask', t(`"Why bother, at a rave?"`, `«¿Para qué, en una rave?»`, `«Pra quê, numa rave?»`), { next: 'why' }),
          K('chill', t(`"Good luck with the crackers."`, `«Suerte con las galletas».`, `«Boa sorte com as bolachas».`), { free: true, next: null })
        ]
      },
      why: { text: t(`"Because at four in the morning somebody always needs to eat something, and the only shop open sells cigarettes and lottery tickets. Nobody here has a licence, so nobody here has a kitchen. So we have this." She pats the table like a horse. "It's politics with a spoon."`, `«Porque a las cuatro de la mañana siempre hay alguien que necesita comer algo, y la única tienda abierta vende cigarros y billetes de lotería. Nadie aquí tiene licencia, así que nadie tiene cocina. Entonces tenemos esto». Le da palmaditas a la mesa como a un caballo. «Es política con cuchara».`, `«Porque às quatro da manhã sempre tem alguém precisando comer alguma coisa, e a única loja aberta vende cigarro e bilhete de loteria. Ninguém aqui tem alvará, então ninguém tem cozinha. Então a gente tem isso». Ela dá tapinhas na mesa como num cavalo. «É política com colher».`), next: 'a' },
      list: { text: t(`"Three things and I can feed the room. Your own water, if you can spare a bottle. Mambo has a cooler full of ice he pretends is for the drinks. The Berlin one is carrying a whole loaf of rye in his tote bag, I've seen it. And the Brooklyn one in the attic has a net of clementines she calls a 'grocery residency'."`, `«Tres cosas y puedo darle de comer a todo el lugar. Tu propia agua, si te sobra una botella. Mambo tiene una hielera llena de hielo que finge que es para las bebidas. El de Berlín anda con un pan de centeno entero en la tote bag, lo vi. Y la de Brooklyn en el ático tiene una malla de mandarinas que llama “residencia de abarrotes”».`, `«Três coisas e eu alimento a sala. Sua própria água, se der pra ceder uma garrafa. O Mambo tem um isopor cheio de gelo que ele finge que é pras bebidas. O de Berlim tá carregando um pão de centeio inteiro na ecobag, eu vi. E a de Brooklyn no sótão tem uma rede de mexericas que ela chama de "residência de mercearia"».`), next: 'prog' },
      prog: {
        text: function (s) {
          return t(`Tere counts the table. "${aidCount(s)} of 3. The crackers are proud of you."`, `Tere cuenta la mesa. «${aidCount(s)} de 3. Las galletas están orgullosas de ti».`, `A Tere conta a mesa. «${aidCount(s)} de 3. As bolachas estão orgulhosas de você».`);
        },
        choices: [
          K('care', t(`Put one of your water bottles on the table.`, `Dejar una de tus botellas de agua en la mesa.`, `Deixar uma das suas garrafas de água na mesa.`), { req: function (s) { return !s.flags.aid_water && (s.items.water || 0) >= 1; }, do: { flag: 'aid_water', item: { water: -1 }, soc: 2 }, next: 'prog', react: t(`"A whole bottle. You're a real one." She labels it FREE in marker.`, `«Una botella entera. Eres buena gente». Le escribe GRATIS con plumón.`, `«Uma garrafa inteira. Você é gente boa». Ela escreve GRÁTIS com a caneta.`) }),
          K('yes', t(`"That's three. Here."`, `«Ya son tres. Toma».`, `«Deu três. Toma».`), { req: function (s) { return aidCount(s) >= 3; }, do: { flag: ['aid_done', 'have_plate'], quest: { sq_aid: 'done' }, fun: 5, soc: 6 }, call: 'aid_done', next: 'full' }),
          K('ask', t(`"What did you need again?"`, `«¿Qué necesitabas?»`, `«Do que você precisava mesmo?»`), { next: 'list' }),
          K('chill', t(`"On it."`, `«Voy».`, `«Tô indo».`), { free: true, next: null })
        ]
      },
      full: { text: t(`Ice in a bucket, bread torn into honest pieces, clementines in a pyramid, water labelled FREE. A queue forms in under a minute: two people who were about to faint, a dealer, a committee. Tere fills a paper plate and hands it to you. "Take this. Somebody always needs a plate, and it's never the person holding it."`, `Hielo en un balde, pan partido en pedazos honestos, mandarinas en pirámide, agua con un cartel de GRATIS. En menos de un minuto se forma una fila: dos personas a punto de desmayarse, un dealer, un comité. Tere llena un plato de cartón y te lo pasa. «Toma. Siempre hay alguien que necesita un plato, y nunca es quien lo tiene en la mano».`, `Gelo num balde, pão rasgado em pedaços honestos, mexericas em pirâmide, água com placa de GRÁTIS. Em menos de um minuto se forma uma fila: duas pessoas quase desmaiando, um traficante, um comitê. A Tere enche um prato de papel e te entrega. «Toma. Sempre tem alguém precisando de um prato, e nunca é quem tá segurando».`), next: null },
      serve: {
        text: t(`The table is busy and nobody is in charge of it, which is the point. Tere waves you over with a jug. "Refill? It's free. Everything here is free. That is the entire business model and it's going great."`, `La mesa está llena de gente y nadie la dirige, que es justamente la idea. Tere te llama con una jarra. «¿Te relleno? Es gratis. Todo aquí es gratis. Ese es todo el modelo de negocio y va de maravilla».`, `A mesa tá cheia de gente e ninguém manda nela, que é justamente a ideia. A Tere te chama com uma jarra. «Quer encher? É de graça. Tudo aqui é de graça. Esse é o modelo de negócio inteiro e tá indo muito bem».`),
        choices: [
          K('yes', t(`"Please."`, `«Por favor».`, `«Por favor».`), { free: true, do: { water: 1 }, call: 'tere_refill', next: null, react: t(`She fills your bottle to the brim and adds a clementine nobody asked for.`, `Te llena la botella hasta el borde y te agrega una mandarina que nadie pidió.`, `Ela enche sua garrafa até a boca e põe uma mexerica que ninguém pediu.`) }),
          K('chill', t(`"Just saying hi."`, `«Solo vine a saludar».`, `«Só vim dar oi».`), { free: true, next: null })
        ]
      }
    }
  };
  S.tere_refill = function () {
    const s = EM.state;
    if ((s.items.water || 0) < 1) { s.items.water = 1; s.sipsUsed = 0; } else s.sipsUsed = 0;
  };
  S.aid_done = function () {
    const s = EM.state;
    U.toast({ icon: 'heart', kind: 'good', ms: 6500, text: s.flags.nb_on && !s.flags.nb_plate
      ? t(`You got a plate of food. Olga, outside, hasn't eaten all night. (ITEMS: I)`, `Conseguiste un plato de comida. Olga, afuera, no ha comido en toda la noche. (OBJETOS: I)`, `Você ganhou um prato de comida. A Olga, lá fora, não comeu a noite toda. (ITENS: I)`)
      : t(`You got a plate of food. Somebody out there needs it. Tere now refills water for free. (ITEMS: I)`, `Conseguiste un plato de comida. Alguien por ahí lo necesita. Tere ahora rellena agua gratis. (OBJETOS: I)`, `Você ganhou um prato de comida. Alguém por aí precisa dele. A Tere agora enche água de graça. (ITENS: I)`) });
  };

  /* the donations, from characters who already exist */
  const base = D.tico && D.tico.nodes;
  if (D.dealer_mambo && base) {
    const mn = D.dealer_mambo.nodes;
    mn.a.choices = [K('ask', t(`"Tere's table needs ice. Can the cooperative spare some?"`, `«La mesa de Tere necesita hielo. ¿La cooperativa puede donar un poco?»`, `«A mesa da Tere precisa de gelo. A cooperativa pode doar um pouco?»`), { req: function (s) { return !!s.flags.aid_on && !s.flags.aid_ice && !s.flags.aid_done; }, next: 'ice' })].concat(base.a.choices);
    mn.ice = { text: t(`Mambo looks at the cooler, then at you, then at the cooler. "The cooperative has never voted on ice." He calls a vote. He is the only member present. The motion passes one to nothing. He fills a bag. "Solidarity is cold tonight. Tell Tere it's from the workers."`, `Mambo mira la hielera, luego a ti, luego la hielera. «La cooperativa nunca ha votado sobre el hielo». Llama a votación. Es el único miembro presente. La moción se aprueba uno a cero. Llena una bolsa. «La solidaridad está fría esta noche. Dile a Tere que es de los trabajadores».`, `O Mambo olha pro isopor, depois pra você, depois pro isopor. «A cooperativa nunca votou sobre gelo». Ele convoca uma votação. É o único membro presente. A moção passa por um a zero. Ele enche um saco. «A solidariedade tá gelada hoje. Diz pra Tere que é dos trabalhadores».`), do: { flag: 'aid_ice', soc: 2 }, next: null };
  }
  if (D.klaus) {
    D.klaus.nodes.a.choices.splice(D.klaus.nodes.a.choices.length - 1, 0, K('ask', t(`"Is that a loaf of bread in your tote bag?"`, `«¿Eso en tu tote bag es un pan?»`, `«Isso na sua ecobag é um pão?»`), { req: function (s) { return !!s.flags.aid_on && !s.flags.aid_bread && !s.flags.aid_done; }, next: 'bread' }));
    D.klaus.nodes.bread = { text: t(`Klaus holds the bag closer. "It is a Roggenbrot. I brought it from Berlin because the bread here is conceptually soft." You explain the table. He is quiet for a long time. "In Berlin we had a table like this in 1994. I was not there. I have read about it." He hands over the loaf with both hands, like a newborn. "Tear it. Don't slice it. Slicing is for tourists."`, `Klaus aprieta la bolsa. «Es un Roggenbrot. Lo traje de Berlín porque el pan de aquí es conceptualmente blando». Le explicas lo de la mesa. Se queda callado un buen rato. «En Berlín tuvimos una mesa así en 1994. Yo no estaba. Leí sobre eso». Te entrega el pan con las dos manos, como a un recién nacido. «Pártelo. No lo rebanes. Rebanar es de turistas».`, `O Klaus aperta a sacola. «É um Roggenbrot. Trouxe de Berlim porque o pão daqui é conceitualmente mole». Você explica a mesa. Ele fica calado um tempão. «Em Berlim teve uma mesa assim em 1994. Eu não estava lá. Eu li sobre isso». Ele entrega o pão com as duas mãos, como um recém-nascido. «Rasga. Não fatia. Fatiar é coisa de turista».`), do: { flag: 'aid_bread', soc: 2, fun: 1 }, next: null };
  }
  if (D.madison) {
    D.madison.nodes.a.choices.splice(D.madison.nodes.a.choices.length - 1, 0, K('ask', t(`"Tere's table could use your clementines."`, `«A la mesa de Tere le vendrían bien tus mandarinas».`, `«A mesa da Tere ia gostar das suas mexericas».`), { req: function (s) { return !!s.flags.aid_on && !s.flags.aid_fruit && !s.flags.aid_done; }, next: 'fruit' }));
    D.madison.nodes.fruit = { text: t(`"My grocery residency?" Madison looks at the net as if it might have an opinion. "I was going to photograph them at sunrise for a piece about abundance." A pause. "Giving them away is a stronger piece. Can I say it was a durational performance?" She hands you the net. "Fourteen clementines. One for each subscriber, plus three."`, `«¿Mi residencia de abarrotes?» Madison mira la malla como si fuera a opinar. «Iba a fotografiarlas al amanecer para una pieza sobre la abundancia». Una pausa. «Regalarlas es una pieza más fuerte. ¿Puedo decir que fue una performance de larga duración?» Te pasa la malla. «Catorce mandarinas. Una por cada suscriptor, más tres».`, `«Minha residência de mercearia?» A Madison olha pra rede como se ela fosse dar opinião. «Eu ia fotografar ao amanhecer pra uma obra sobre abundância». Uma pausa. «Doar é uma obra mais forte. Posso dizer que foi uma performance de longa duração?» Ela te passa a rede. «Catorze mexericas. Uma por assinante, mais três».`), do: { flag: 'aid_fruit', soc: 2, fun: 1 }, next: null };
  }

  /* ============================================================ OLGA, next door (outside) */
  cast('olga', 'OLGA', { skin: 1, hair: 5, hc: 9, expr: 0, top: 2, tc: 7, bottom: 3, bc: 2, acc: 0 });
  D.olga = {
    who: 'olga', role: t('NEXT DOOR', 'LA VECINA', 'A VIZINHA'), start: 'st', nodes: {
      st: { branch: [
        { req: function (s) { return !!s.flags.nb_done; }, to: 'after' },
        { req: function (s) { return !!s.flags.nb_on && !!s.flags.nb_speaker && !!s.flags.nb_plate; }, to: 'truce' },
        { req: function (s) { return !!s.flags.nb_on; }, to: 'prog' },
        { req: function () { return true; }, to: 'a' }
      ] },
      a: {
        text: t(`On the step of the house next door, a woman in a quilted dressing gown and very good earrings holds a cup of tea that is vibrating on its own. "Young person. The bass is coming up through my kitchen floor. The spoons are dancing. I did not invite the spoons to dance." She sips. "I'm not calling anybody. I'm seventy-one. I'm telling you, because you have a face."`,
          `En la entrada de la casa de al lado, una señora con bata acolchada y aretes muy buenos sostiene una taza de té que vibra sola. «Joven. El bajo me sube por el piso de la cocina. Las cucharas están bailando. Yo no invité a las cucharas a bailar». Toma un sorbo. «No voy a llamar a nadie. Tengo setenta y un años. Te lo digo a ti, porque tienes cara».`,
          `Na porta da casa ao lado, uma senhora de roupão acolchoado e brincos muito bons segura uma xícara de chá que vibra sozinha. «Jovem. O grave tá subindo pelo chão da minha cozinha. As colheres estão dançando. Eu não convidei as colheres pra dançar». Ela toma um gole. «Não vou ligar pra ninguém. Tenho setenta e um anos. Tô falando com você, porque você tem cara».`),
        do: { flag: 'olga_met' },
        choices: [
          K('care', t(`"I'm sorry. Let me see what I can do."`, `«Lo siento. Déjeme ver qué puedo hacer».`, `«Desculpa. Deixa eu ver o que posso fazer».`), { do: { flag: 'nb_on', quest: { sq_neighbours: 'active' }, soc: 2 }, next: 'deal' }),
          K('joke', t(`"Are the spoons any good?"`, `«¿Y las cucharas bailan bien?»`, `«E as colheres dançam bem?»`), { do: { fun: 2 }, next: 'spoons' }),
          K('push', t(`"It's a party. Close your window."`, `«Es una fiesta. Cierre la ventana».`, `«É uma festa. Fecha a janela».`), { bad: true, do: { soc: -3, weird: 4, flag: 'olga_snub' }, next: null, react: t(`She closes the window very slowly, maintaining eye contact the entire time. It is the most frightening thing you have seen tonight.`, `Cierra la ventana muy despacio, sin dejar de mirarte a los ojos. Es lo más aterrador que has visto esta noche.`, `Ela fecha a janela bem devagar, sem tirar os olhos de você. É a coisa mais assustadora que você viu hoje.`) }),
          K('chill', t(`"Goodnight."`, `«Buenas noches».`, `«Boa noite».`), { free: true, next: null })
        ]
      },
      spoons: { text: t(`"The teaspoons, yes. The soup spoons have no rhythm." Almost a smile. "Then I need a truce, and you look like a person who carries messages."`, `«Las cucharitas, sí. Las soperas no tienen ritmo». Casi sonríe. «Entonces necesito una tregua, y tienes cara de llevar recados».`, `«As de chá, sim. As de sopa não têm ritmo». Quase um sorriso. «Então eu preciso de uma trégua, e você tem cara de quem leva recado».`), next: 'a' },
      deal: { text: t(`"Two things. There's a big speaker pointed straight at my wall, like it has something to say to me. Ask whoever is in charge of it to turn it around. And..." she lowers the cup. "I haven't eaten since eleven. The noise started and I lost the appetite and then I found it again and the shop was closed. That's all. I'm not complaining. I'm reporting."`, `«Dos cosas. Hay una bocina enorme apuntando directo a mi pared, como si tuviera algo que decirme. Pídele a quien la maneja que la gire. Y…» baja la taza. «No como desde las once. Empezó el ruido y se me fue el apetito y después me volvió y la tienda ya estaba cerrada. Eso es todo. No me quejo. Informo».`, `«Duas coisas. Tem uma caixa de som enorme apontada direto pra minha parede, como se tivesse algo pra me dizer. Pede pra quem cuida dela virar. E…» ela abaixa a xícara. «Não como desde as onze. O barulho começou, perdi a fome, depois a fome voltou e a loja já tinha fechado. É só isso. Não tô reclamando. Tô informando».`), next: null },
      prog: {
        text: function (s) {
          const bits = [];
          bits.push(s.flags.nb_speaker
            ? t(`"The spoons have stopped. Somebody turned the big speaker. Thank them for me."`, `«Las cucharas se quedaron quietas. Alguien giró la bocina grande. Dale las gracias de mi parte».`, `«As colheres pararam. Alguém virou a caixa grande. Agradece por mim».`)
            : t(`Olga, over her cup: "The speaker is still talking to my wall. Whoever runs the cables, I imagine. They're always in a tunnel."`, `Olga, por encima de la taza: «La bocina sigue hablándole a mi pared. Quien maneja los cables, me imagino. Siempre están en un túnel».`, `A Olga, por cima da xícara: «A caixa ainda tá falando com a minha parede. Quem cuida dos cabos, imagino. Sempre estão num túnel».`));
          if (!s.flags.nb_plate) bits.push(t(`"And I'm still hungry, in a dignified way."`, `«Y sigo con hambre, de manera digna».`, `«E continuo com fome, de um jeito digno».`));
          return bits;
        },
        choices: [
          K('care', t(`Give her the plate from Tere's table.`, `Darle el plato de la mesa de Tere.`, `Dar pra ela o prato da mesa da Tere.`), { req: function (s) { return !!s.flags.have_plate && !s.flags.nb_plate; }, do: { flag: 'nb_plate', unflag: 'have_plate', soc: 3, care: 1 }, next: 'ate' }),
          K('chill', t(`"Working on it."`, `«En eso estoy».`, `«Tô resolvendo».`), { free: true, next: null })
        ]
      },
      ate: { text: t(`Olga takes the plate as if it were a diploma. Bread, a clementine, something with peanut butter. She eats the clementine first, segment by segment, and looks at the warehouse differently. "Who made this?" You tell her about Tere's table. "Hm," she says, which from her is a whole speech.`, `Olga recibe el plato como si fuera un diploma. Pan, una mandarina, algo con crema de maní. Se come primero la mandarina, gajo por gajo, y mira la bodega de otra forma. «¿Quién hizo esto?» Le cuentas de la mesa de Tere. «Mm», dice, que en ella es un discurso entero.`, `A Olga recebe o prato como se fosse um diploma. Pão, uma mexerica, alguma coisa com pasta de amendoim. Ela come a mexerica primeiro, gomo por gomo, e olha pro galpão de outro jeito. «Quem fez isso?» Você conta da mesa da Tere. «Hum», ela diz, o que nela é um discurso inteiro.`), next: 'st' },
      truce: {
        text: t(`Olga sets the cup down on the step, and it stays still. "Quiet spoons and a full stomach. That's a truce." She takes an envelope out of the dressing gown, which apparently has pockets for everything. "I'm the treasurer of the neighbourhood association. Twenty-two years. We've been trying to buy this building since before you were born, and the owner thinks you lot are the reason not to sell it to us." She writes for a while, signs, folds. "A letter. For Ernesto. He's an old fool but he reads. And tell the girl with the clipboard I'll sign whatever she has."`,
          `Olga deja la taza en el escalón y la taza se queda quieta. «Cucharas tranquilas y la panza llena. Eso es una tregua». Saca un sobre de la bata, que al parecer tiene bolsillos para todo. «Soy la tesorera de la asociación vecinal. Veintidós años. Llevamos tratando de comprar este edificio desde antes de que nacieras, y el dueño cree que ustedes son la razón para no vendérnoslo». Escribe un rato, firma, dobla. «Una carta. Para Ernesto. Es un viejo necio, pero lee. Y dile a la muchacha de la tablilla que firmo lo que tenga».`,
          `A Olga põe a xícara no degrau, e a xícara fica parada. «Colheres quietas e barriga cheia. Isso é uma trégua». Ela tira um envelope do roupão, que pelo jeito tem bolso pra tudo. «Eu sou a tesoureira da associação de moradores. Vinte e dois anos. A gente tenta comprar esse prédio desde antes de você nascer, e o dono acha que vocês são o motivo pra não vender pra gente». Ela escreve um tempo, assina, dobra. «Uma carta. Pro Ernesto. É um velho teimoso, mas lê. E fala pra moça da prancheta que eu assino o que ela tiver».`),
        do: { flag: ['nb_done', 'olga_letter', 'sig_olga'], quest: { sq_neighbours: 'done' }, soc: 6, fun: 4, time: 6 },
        choices: [K('yes', t(`"I'll take it to him."`, `«Se la llevo».`, `«Eu levo pra ele».`), { free: true, call: 'nb_done', next: null })]
      },
      after: {
        text: function (s) {
          return s.flags.owner_won
            ? t(`Olga raises her cup to you from the step. "Ernesto called me. At this hour. First time in twenty-two years he's called me first." She is trying not to look pleased and failing.`, `Olga te levanta la taza desde el escalón. «Ernesto me llamó. A esta hora. Primera vez en veintidós años que me llama él primero». Intenta que no se le note el gusto y no lo logra.`, `A Olga levanta a xícara pra você do degrau. «O Ernesto me ligou. Nessa hora. Primeira vez em vinte e dois anos que ele me liga primeiro». Ela tenta não parecer contente e não consegue.`)
            : t(`Olga, on the step, tapping her foot very slightly to a kick drum that no longer reaches her spoons. "Don't tell anyone. I have a reputation."`, `Olga, en el escalón, marcando muy levemente con el pie un bombo que ya no llega a sus cucharas. «No le digas a nadie. Tengo una reputación».`, `A Olga, no degrau, batendo o pé bem de leve num bumbo que já não chega nas colheres dela. «Não conta pra ninguém. Eu tenho uma reputação».`);
        },
        choices: [K('chill', t(`"Your secret's safe."`, `«Su secreto está a salvo».`, `«Seu segredo tá seguro».`), { free: true, next: null })]
      }
    }
  };
  S.nb_done = function () {
    const s = EM.state;
    U.toast({ icon: 'star', kind: 'good', ms: 7000, text: s.flags.petition_done
      ? t(`A truce with next door. Olga's letter is for Ernesto, the owner, outside between 02:00 and 05:00.`, `Una tregua con la casa de al lado. La carta de Olga es para Ernesto, el dueño, afuera entre las 02:00 y las 05:00.`, `Uma trégua com a casa do lado. A carta da Olga é pro Ernesto, o dono, lá fora entre 02:00 e 05:00.`)
      : t(`A truce with next door. Olga's signature counts for Maya's petition, and her letter is for Ernesto, the owner, outside between 02:00 and 05:00.`, `Una tregua con la casa de al lado. La firma de Olga cuenta para la petición de Maya, y su carta es para Ernesto, el dueño, afuera entre las 02:00 y las 05:00.`, `Uma trégua com a casa do lado. A assinatura da Olga conta pro abaixo-assinado da Maya, e a carta é pro Ernesto, o dono, lá fora entre 02:00 e 05:00.`) });
  };

  /* Sub can turn the street-side stack */
  if (D.sub) {
    D.sub.nodes.a.choices.splice(D.sub.nodes.a.choices.length - 1, 0, K('ask', t(`"The lady next door says a speaker is pointed at her kitchen. Can you turn it?"`, `«La señora de al lado dice que una bocina apunta a su cocina. ¿Puedes girarla?»`, `«A senhora do lado diz que uma caixa tá apontada pra cozinha dela. Dá pra virar?»`), { req: function (s) { return !!s.flags.nb_on && !s.flags.nb_speaker; }, next: 'turn' }));
    D.sub.nodes.turn = { text: t(`"Olga? Olga's spoons?" Sub is already up. "That stack has been facing her wall since we found it. Nobody turned it because nobody asked." Together you walk the cabinet a quarter turn until it points at the dancefloor. Sub listens with their whole face. "Better. Actually better. The room has more low end now. Olga was eating our bass."`, `«¿Olga? ¿Las cucharas de Olga?» Sub ya se levantó. «Esa torre da a su pared desde que la encontramos. Nadie la giró porque nadie lo pidió». Entre los dos mueven el gabinete un cuarto de vuelta hasta que apunta a la pista. Sub escucha con toda la cara. «Mejor. De verdad mejor. Ahora el lugar tiene más graves. Olga se estaba comiendo nuestro bajo».`, `«A Olga? As colheres da Olga?» A Sub já levantou. «Essa torre tá virada pra parede dela desde que a gente achou. Ninguém virou porque ninguém pediu». Juntos vocês giram o gabinete um quarto de volta até apontar pra pista. A Sub escuta com o rosto inteiro. «Melhor. Melhor de verdade. A sala ficou com mais grave. A Olga tava comendo nosso grave».`), do: { flag: 'nb_speaker', time: 6, soc: 2 }, next: null };
  }

  /* ============================================================ ERNESTO, the owner (outside, 02:00 to 05:00) */
  cast('ernesto', 'ERNESTO', { skin: 0, hair: 1, hc: 9, expr: 0, top: 3, tc: 4, bottom: 4, bc: 0, acc: 5, wide: true });
  const PITCH = [
          K('honest', t(`Show him Maya's petition.`, `Mostrarle la petición de Maya.`, `Mostrar o abaixo-assinado da Maya.`), { req: function (s) { return !!s.flags.petition_done && !s.flags.ev_petition; }, do: { flag: 'ev_petition', soc: 2 }, next: 'p_pet' }),
          K('honest', t(`Give him Olga's letter.`, `Darle la carta de Olga.`, `Entregar a carta da Olga.`), { req: function (s) { return !!s.flags.olga_letter && !s.flags.ev_letter; }, do: { flag: 'ev_letter', soc: 2 }, next: 'p_let' }),
          K('honest', t(`Walk him to the mutual-aid table.`, `Llevarlo a la mesa de ayuda mutua.`, `Levar ele até a mesa de ajuda mútua.`), { req: function (s) { return !!s.flags.aid_done && !s.flags.ev_aid; }, do: { flag: 'ev_aid', soc: 2, time: 8 }, next: 'p_aid' }),
          K('ask', t(`"What would change your mind?"`, `«¿Qué te haría cambiar de idea?»`, `«O que te faria mudar de ideia?»`), { next: 'hint' }),
          K('push', t(`"Just don't sell it to them."`, `«Simplemente no se lo vendas».`, `«Só não vende pra eles».`), { bad: true, do: { soc: -2 }, next: null, react: t(`"Wonderful argument. Very persuasive. I'll tell my accountant." He goes back to staring at the wall.`, `«Argumento maravilloso. Muy persuasivo. Se lo diré a mi contador». Vuelve a mirar la pared.`, `«Argumento maravilhoso. Muito convincente. Vou contar pro meu contador». Ele volta a encarar a parede.`) }),
          K('chill', t(`"Let me come back."`, `«Déjame volver después».`, `«Deixa eu voltar depois».`), { free: true, next: null })
  ];
  D.ernesto = {
    who: 'ernesto', role: t('THE OWNER', 'EL DUEÑO', 'O DONO'), start: 'st', nodes: {
      st: { branch: [
        { req: function (s) { return !!s.flags.owner_won; }, to: 'after' },
        { req: function (s) { return !!s.flags.owner_met; }, to: 'again' },
        { req: function () { return true; }, to: 'a' }
      ] },
      a: {
        text: t(`A man in a camel coat stands across the street, looking at the warehouse the way people look at a dog they used to own. "Ernesto. I own this. On paper. On paper I also own a boat and a bad knee." He doesn't take his eyes off the building. "The fund offers a lot of money. The association offers less money and a lot of feelings. And you people are inside making my wall shake. Tell me why I shouldn't sell to the people with the brochure."`,
          `Un hombre con abrigo color camello está parado al otro lado de la calle, mirando la bodega como se mira a un perro que uno tuvo. «Ernesto. Soy el dueño de esto. En papel. En papel también tengo un bote y una rodilla mala». No le quita los ojos al edificio. «El fondo ofrece mucha plata. La asociación ofrece menos plata y muchos sentimientos. Y ustedes están adentro haciendo temblar mi pared. Dime por qué no debería venderle a la gente del folleto».`,
          `Um homem de sobretudo cor de camelo está parado do outro lado da rua, olhando pro galpão como quem olha pra um cachorro que já teve. «Ernesto. Sou o dono disso. No papel. No papel eu também tenho um barco e um joelho ruim». Ele não tira os olhos do prédio. «O fundo oferece muito dinheiro. A associação oferece menos dinheiro e muitos sentimentos. E vocês estão lá dentro fazendo minha parede tremer. Me diz por que eu não devia vender pro pessoal do folheto».`),
        do: { flag: 'owner_met', quest: { sq_owner: 'active' } },
        choices: PITCH
      },
      again: {
        text: function (s) {
          return t(`Ernesto checks his watch, which is the most expensive thing on the street. "I'm here until five. Convince me." (${evCount(s)} of 2)`, `Ernesto mira el reloj, que es lo más caro de la calle. «Estoy aquí hasta las cinco. Convénceme». (${evCount(s)} de 2)`, `O Ernesto olha o relógio, que é a coisa mais cara da rua. «Fico aqui até as cinco. Me convence». (${evCount(s)} de 2)`);
        },
        choices: PITCH
      },
      hint: { text: t(`"Proof that it's a place and not a party. Parties end. Places have neighbours, and paperwork, and people who feed each other when nobody is paying them." He sniffs. "Bring me two of those and I'll call the fund's lawyer and ruin his breakfast."`, `«Pruebas de que es un lugar y no una fiesta. Las fiestas se acaban. Los lugares tienen vecinos, papeles y gente que se da de comer sin que nadie le pague». Resopla. «Tráeme dos de esas cosas y llamo al abogado del fondo para arruinarle el desayuno».`, `«Provas de que é um lugar e não uma festa. Festa acaba. Lugar tem vizinho, papelada e gente que alimenta uns aos outros sem ninguém pagar». Ele funga. «Me traz duas dessas coisas e eu ligo pro advogado do fundo e estrago o café da manhã dele».`), next: 'again' },
      p_pet: { text: t(`He reads every signature, including Sub's thumbprint, and lingers on the very small initial. "A Berliner signed this? Voluntarily?" He folds it with care. "Paperwork. Fine. That's one."`, `Lee todas las firmas, incluida la huella de Sub, y se detiene en la inicial diminuta. «¿Un berlinés firmó esto? ¿Por voluntad propia?» La dobla con cuidado. «Papeles. Bien. Eso es uno».`, `Ele lê todas as assinaturas, inclusive a digital da Sub, e se demora na inicial minúscula. «Um berlinense assinou isso? Por vontade própria?» Ele dobra com cuidado. «Papelada. Tá. Isso é um».`), next: 'check' },
      p_let: { text: t(`He recognises the handwriting before he opens it. "Olga." He reads it twice, and the second time his mouth moves. "She says the spoons have stopped. She says you fed her." He looks at the house next door for a while. "Twenty-two years that woman has been writing me letters. This is the first one without the word 'disgrace'."`, `Reconoce la letra antes de abrirla. «Olga». La lee dos veces, y la segunda vez mueve los labios. «Dice que las cucharas se quedaron quietas. Dice que le dieron de comer». Mira la casa de al lado un rato. «Veintidós años lleva esa mujer escribiéndome cartas. Esta es la primera sin la palabra “vergüenza”».`, `Ele reconhece a letra antes de abrir. «Olga». Lê duas vezes, e na segunda mexe a boca. «Ela diz que as colheres pararam. Diz que deram comida pra ela». Ele olha pra casa do lado um tempo. «Vinte e dois anos essa mulher me escreve cartas. Essa é a primeira sem a palavra "vergonha"».`), next: 'check' },
      p_aid: { text: t(`You walk him through the courtyard to Tere's table. He watches a dealer, a committee member and a woman who almost fainted share a loaf of rye without speaking. Tere hands him a clementine without asking who he is. He holds it like a coin from a country he hasn't visited. "Nobody here charged me for this," he says, slowly, as if learning a word.`, `Lo llevas por el patio hasta la mesa de Tere. Mira cómo un dealer, alguien del comité y una mujer que casi se desmaya comparten un pan de centeno sin hablar. Tere le da una mandarina sin preguntarle quién es. Él la sostiene como una moneda de un país que no conoce. «Nadie me cobró esto», dice despacio, como quien aprende una palabra.`, `Você leva ele pelo pátio até a mesa da Tere. Ele vê um traficante, alguém do comitê e uma mulher que quase desmaiou dividindo um pão de centeio sem falar. A Tere dá uma mexerica pra ele sem perguntar quem é. Ele segura como uma moeda de um país que nunca visitou. «Ninguém me cobrou isso», diz devagar, como quem aprende uma palavra.`), next: 'check' },
      check: { branch: [
        { req: function (s) { return evCount(s) >= 2; }, to: 'won' },
        { req: function () { return true; }, to: 'again' }
      ] },
      won: {
        text: t(`Ernesto takes out his phone, scrolls past a contact called FUND (LAWYER) (DO NOT ANSWER), and calls a number saved as OLGA (ASSOCIATION) (SORRY). "Olga. It's me. Yes, at this hour. Sit down." He walks off down the street, talking with his free hand. Across the yard, through the gate, Maya has seen his face and dropped her clipboard.`,
          `Ernesto saca el teléfono, pasa de largo un contacto que dice FONDO (ABOGADO) (NO CONTESTAR) y llama a un número guardado como OLGA (ASOCIACIÓN) (PERDÓN). «Olga. Soy yo. Sí, a esta hora. Siéntate». Se aleja por la calle hablando con la mano libre. Al otro lado del patio, por el portón, Maya le vio la cara y se le cayó la tablilla.`,
          `O Ernesto pega o celular, passa direto por um contato chamado FUNDO (ADVOGADO) (NÃO ATENDER) e liga pra um número salvo como OLGA (ASSOCIAÇÃO) (DESCULPA). «Olga. Sou eu. Sim, nessa hora. Senta». Ele sai andando pela rua, falando com a mão livre. Do outro lado do pátio, pelo portão, a Maya viu a cara dele e deixou a prancheta cair.`),
        do: { flag: 'owner_won', quest: { sq_owner: 'done' }, fun: 10, soc: 8 },
        choices: [K('yes', t(`Let him make the call.`, `Dejarlo hacer la llamada.`, `Deixar ele fazer a ligação.`), { free: true, call: 'owner_won', next: null })]
      },
      after: { text: t(`Ernesto, off the phone, coat open, looking ten years younger and a little lost. "I've just lost a great deal of money. I feel fantastic. Is this what you people feel like every weekend?"`, `Ernesto, ya sin el teléfono, con el abrigo abierto, se ve diez años más joven y un poco perdido. «Acabo de perder muchísima plata. Me siento fantástico. ¿Así se sienten ustedes todos los fines de semana?»`, `O Ernesto, já sem o celular, sobretudo aberto, parece dez anos mais novo e meio perdido. «Acabei de perder muito dinheiro. Tô me sentindo fantástico. É assim que vocês se sentem todo fim de semana?»`), choices: [K('joke', t(`"Only the good ones."`, `«Solo los buenos».`, `«Só nos bons».`), { free: true, do: { fun: 2 }, next: null })] }
    }
  };
  S.owner_won = function () {
    U.toast({ icon: 'star', kind: 'good', ms: 8000, text: t(`Ernesto is selling the warehouse to the neighbourhood association. The fund's lawyer is going to have a terrible breakfast.`, `Ernesto le vende la bodega a la asociación vecinal. El abogado del fondo va a tener un desayuno horrible.`, `O Ernesto vai vender o galpão pra associação de moradores. O advogado do fundo vai ter um café da manhã horrível.`) });
  };

  /* Maya and Tere notice the owner; the owner arrives and leaves on the clock */
  const minute0 = L.minute;
  L.minute = function () {
    minute0();
    const s = EM.state; if (!s || s.ended || !RV(s)) return;
    if (s.time >= OWNER_FROM && !s.flags.owner_arrived && s.time < OWNER_TO) {
      s.flags.owner_arrived = true;
      U.toast({ icon: 'exclam', kind: 'info', ms: 7000, text: t(`02:00. A man in a camel coat is standing across the street from the warehouse. Word goes round fast: the owner is here, outside, until five.`, `02:00. Un hombre de abrigo color camello está parado frente a la bodega, al otro lado de la calle. Se corre la voz rápido: el dueño está aquí, afuera, hasta las cinco.`, `02:00. Um homem de sobretudo cor de camelo está parado do outro lado da rua, em frente ao galpão. A notícia corre rápido: o dono está aqui, lá fora, até as cinco.`) });
    }
    if (s.time >= OWNER_TO && !s.flags.owner_gone && !s.flags.owner_won) {
      s.flags.owner_gone = true;
      if (s.flags.owner_met) {
        L.setQuest('sq_owner', 'done');
        U.toast({ icon: 'info', kind: 'info', ms: 6500, text: t(`05:00. Ernesto has gone home without deciding. Maya says thinking is not no. Maya says a lot of things at five.`, `05:00. Ernesto se fue a casa sin decidir. Maya dice que pensarlo no es un no. Maya dice muchas cosas a las cinco.`, `05:00. O Ernesto foi pra casa sem decidir. A Maya diz que pensar não é um não. A Maya diz muita coisa às cinco.`) });
      }
    }
  };

  /* Maya knows about the others */
  if (D.maya) {
    const g = D.maya.nodes.go, gText = g.text;
    g.text = function (s) {
      const a = [].concat(typeof gText === 'function' ? gText(s) : gText);
      a.push(t(`"Also: Tere's table in the yard is empty, Olga next door hates us, and Ernesto, the owner, comes by at two. It's all the same fight. I just don't have enough hands."`, `«Además: la mesa de Tere en el patio está vacía, Olga la de al lado nos odia y Ernesto, el dueño, pasa a las dos. Es todo la misma pelea. Solo que no me alcanzan las manos».`, `«E mais: a mesa da Tere no pátio tá vazia, a Olga do lado odeia a gente e o Ernesto, o dono, passa às duas. É tudo a mesma briga. Só me faltam mãos».`));
      return a;
    };
  }

  /* the plate in ITEMS */
  EM.menuItems = EM.menuItems || [];
  EM.menuItems.push(function (box, s) {
    if (!s.flags.have_plate) return;
    const r = U.el('div', 'stashrow');
    r.appendChild(U.el('span', 'stl', EM.tr(t('A PLATE OF FOOD — from Tere\'s table, for somebody who needs it', 'UN PLATO DE COMIDA — de la mesa de Tere, para alguien que lo necesite', 'UM PRATO DE COMIDA — da mesa da Tere, pra alguém que precise'))));
    box.appendChild(r);
  });

  /* ============================================================ PLACEMENT (rave only) */
  Z.courtyard.npc({ id: 'tere', x: 17.5, y: 3.5, dlg: 'tere', dir: 'd', reach: 16, when: RV });
  Z.doors.npc({ id: 'olga', x: 2.5, y: 4.5, dlg: 'olga', dir: 'r', reach: 16, when: RV });
  Z.doors.npc({ id: 'ernesto', x: 29.5, y: 7.5, dlg: 'ernesto', dir: 'u', reach: 16, when: ownerHere });

  /* ============================================================ MORNING */
  if (story.morningRefs) {
    const R = story.morningRefs;
    /* Maya's victory text only when the owner actually decided (or never came into it) */
    R.forEach(function (r) {
      if (r.id === 'maya_won') { const ok0 = r.ok; r.ok = function (s) { return ok0(s) && (!s.flags.owner_met || !!s.flags.owner_won); }; }
    });
    R.push({ id: 'maya_wait', who: '#MAYA', ok: function (s) { return RV(s) && !!s.flags.petition_done && !!s.flags.owner_met && !s.flags.owner_won; }, t: t(`ernesto has the petition in his coat. he says he's thinking. i have decided that thinking is a verb with hope in it. come sunday.`, `ernesto tiene la petición en el abrigo. dice que lo está pensando. decidí que pensar es un verbo con esperanza adentro. ven el domingo.`, `o ernesto tá com o abaixo-assinado no sobretudo. diz que tá pensando. decidi que pensar é um verbo com esperança dentro. vem domingo.`) });
    R.push({ id: 'ernesto_txt', who: '#ERNESTO', ok: function (s) { return RV(s) && !!s.flags.owner_won; }, t: t(`This is Ernesto. Olga gave me your number, I don't want to know how. The association signs on Thursday. My accountant is crying. I am at the market buying clementines. Thank you, I think.`, `Habla Ernesto. Olga me dio tu número, no quiero saber cómo. La asociación firma el jueves. Mi contador está llorando. Yo estoy en la feria comprando mandarinas. Gracias, creo.`, `Aqui é o Ernesto. A Olga me deu seu número, não quero saber como. A associação assina na quinta. Meu contador tá chorando. Eu tô na feira comprando mexerica. Obrigado, acho.`) });
    R.push({ id: 'olga_txt', who: '#OLGA', ok: function (s) { return RV(s) && !!s.flags.nb_done; }, t: t(`Good morning. This is Olga, from next door. I slept four hours, which at my age is a festival. The spoons send their regards. Bring that Tere woman for coffee on Sunday.`, `Buenos días. Habla Olga, la de al lado. Dormí cuatro horas, que a mi edad es un festival. Las cucharas te mandan saludos. Trae a esa Tere a tomar café el domingo.`, `Bom dia. Aqui é a Olga, do lado. Dormi quatro horas, o que na minha idade é um festival. As colheres mandam lembranças. Traz aquela Tere pra tomar café no domingo.`) });
    R.push({ id: 'tere_txt', who: '#TERE', ok: function (s) { return RV(s) && !!s.flags.aid_done; }, t: t(`we fed about ninety people last night with one loaf, a bag of ice and fourteen clementines. that's not a miracle, that's logistics. same table next time. bring a bottle.`, `anoche le dimos de comer a unas noventa personas con un pan, una bolsa de hielo y catorce mandarinas. eso no es un milagro, es logística. la misma mesa la próxima vez. trae una botella.`, `ontem a gente alimentou umas noventa pessoas com um pão, um saco de gelo e catorze mexericas. isso não é milagre, é logística. mesma mesa da próxima vez. traz uma garrafa.`) });
  }
})();

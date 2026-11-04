/* EXCUSE ME — story v22: the mission audit (November 2026).
   Fixes found by playing every mission through headlessly, plus two additions:
   - A finished mission never goes back to active (an untested pill, Maya's clipboard and Rosa's "I know you"
     used to reopen THE PILL or THE PETITION, and the untested pill left the main story with no way to THE DROP).
   - Taking Dani's pill in the stall, untested, now leads on to THE DROP once Rosa is dealt with (group stall) or
     straight away (split stall, which used to leave ONE STALL, THREE PEOPLE open for ever).
   - Maya has something to say after the petition, and it follows the owner, the neighbours and the table.
   - At the rave Rosa calls the crew, not Ofelia (Ofelia does not work at the rave).
   - Pia's thank-you no longer hands out a free bottle every time you talk to her; LOOKING FOR MOE is in the log.
   - New side quest, both venues: THE MURAL (Ximena, the tunnel). Three things from three rooms; at the rave the
     finished mural is a fourth piece of evidence for Ernesto. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story, Q = EM.QUESTS;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const RV = function (s) { return s.venue === 'rave'; };
  const mk = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };
  const LEAVE = function () { return K('chill', t(`"Later."`, `«Después».`, `«Depois».`), { free: true, next: null }); };

  /* ============================================================ 1. a finished mission stays finished */
  const set0 = L.setQuest;
  L.setQuest = function (id, state) {
    const s = EM.state, q = s.quests;
    if (q[id] === 'done' && state !== 'done') return;
    set0(id, state);
    /* THE PILL can end in the stall (taken untested). THE DROP then opens as soon as Rosa is behind you. */
    if (state === 'done' && (id === 'q4' || id === 'q5') && q.q4 === 'done' && q.q5 === 'done' && !q.q7 && !q.q8) set0('q7', 'active');
  };

  /* ============================================================ 2. the split stall, pill taken untested */
  if (D.stall_split) {
    const N = D.stall_split.nodes;
    [N.pill_a, N.ask].forEach(function (n) {
      (n && n.choices || []).forEach(function (c) { if (c.call === 'take_pill_untested') c.next = 'took'; });
    });
    N.took = {
      who: 'maru',
      text: t(`Maru comes out of the stall, dries her hands on her jeans and looks at the two of you, then at Dani's jaw. "…You didn't." Dani grins. Maru sighs the sigh of a person adding a line to a spreadsheet. "Fine. Then we stay together and we drink water. Main floor. Now."`,
        `Maru sale de la cabina, se seca las manos en los jeans y los mira a los dos, y luego la mandíbula de Dani. «…No lo hicieron». Dani sonríe. Maru suspira como quien agrega una fila a una planilla. «Bueno. Entonces nos quedamos juntos y tomamos agua. A la pista. Ya».`,
        `A Maru sai da cabine, seca as mãos na calça jeans e olha pra vocês dois, depois pro maxilar do Dani. «…Vocês não fizeram isso». O Dani sorri. A Maru suspira como quem acrescenta uma linha numa planilha. «Tá. Então a gente fica junto e bebe água. Pra pista. Agora».`),
      do: { quest: { q3: 'done', q4: 'done' }, at: 200 }
    };
  }

  /* ============================================================ 3. Maya after the petition */
  if (D.maya) {
    const M = D.maya.nodes;
    M.st.branch.splice(M.st.branch.length - 1, 0, { req: function (s) { return !!s.flags.petition_done && !!s.flags.maya_thanked; }, to: 'after' });
    M.after = {
      text: function (s) {
        const f = s.flags, a = [];
        if (f.owner_won) a.push(t(`Maya is sitting on a speaker with her shoes off, holding her phone like it might go off again. "He called Olga. Ernesto called OLGA. The association is buying it." She laughs at nothing. "I need to lie down on the floor of a building that is going to exist."`,
          `Maya está sentada en un parlante, sin zapatos, sosteniendo el teléfono como si fuera a sonar otra vez. «Llamó a Olga. Ernesto llamó a OLGA. La asociación la va a comprar». Se ríe de nada. «Necesito acostarme en el piso de un edificio que va a seguir existiendo».`,
          `A Maya tá sentada numa caixa de som, descalça, segurando o celular como se ele fosse tocar de novo. «Ele ligou pra Olga. O Ernesto ligou pra OLGA. A associação vai comprar». Ela ri à toa. «Preciso deitar no chão de um prédio que vai continuar existindo».`));
        else if (f.owner_met) a.push(t(`Maya, chewing the clipboard's corner: "Ernesto is still out there, thinking. You can show him things, you know. The table. Olga. Whatever Ximena is doing to the tunnel. Two things and he folds."`,
          `Maya, mordiendo la esquina de la tablilla: «Ernesto sigue afuera, pensando. Puedes mostrarle cosas, ¿sabes? La mesa. A Olga. Lo que sea que Ximena le está haciendo al túnel. Dos cosas y cede».`,
          `A Maya, mordendo a quina da prancheta: «O Ernesto ainda tá lá fora, pensando. Você pode mostrar coisas pra ele, sabe? A mesa. A Olga. O que quer que a Ximena esteja fazendo no túnel. Duas coisas e ele cede».`));
        else a.push(t(`Maya, between two phone calls: "The petition's in a folder, the folder's in a bag, the bag is on me. Now we wait for the owner. Two o'clock, he said. He says a lot of things."`,
          `Maya, entre dos llamadas: «La petición está en una carpeta, la carpeta en un bolso, el bolso conmigo. Ahora esperamos al dueño. Dijo que a las dos. Dice muchas cosas».`,
          `A Maya, entre duas ligações: «O abaixo-assinado tá numa pasta, a pasta numa bolsa, a bolsa comigo. Agora a gente espera o dono. Ele disse duas horas. Ele diz muita coisa».`));
        if (f.nb_done && f.aid_done) a.push(t(`"And next door is quiet and the yard is fed. Nobody organised that. You did."`, `«Y al lado hay silencio y en el patio hay comida. Nadie organizó eso. Lo hiciste tú».`, `«E o vizinho tá em paz e o pátio tá alimentado. Ninguém organizou isso. Foi você».`));
        return a;
      },
      choices: [
        K('care', t(`"Drink some water, Maya."`, `«Toma agua, Maya».`, `«Bebe uma água, Maya».`), { free: true, do: { soc: 2 }, next: null, react: t(`She drinks half a bottle in one go and looks surprised that she was thirsty. Organisers never know.`, `Se toma media botella de una vez y parece sorprendida de tener sed. Las organizadoras nunca saben.`, `Ela bebe meia garrafa de uma vez e parece surpresa por estar com sede. Organizadora nunca sabe.`) }),
        K('chill', t(`"See you at sunrise."`, `«Nos vemos al amanecer».`, `«Até o amanhecer».`), { free: true, next: null })
      ]
    };
  }

  /* ============================================================ 4. Rosa calls the crew at the rave */
  if (D.rosa_confront && D.rosa_confront.nodes.angry) {
    const A = D.rosa_confront.nodes.angry, club = A.text;
    A.text = function (s) {
      if (!RV(s)) return club;
      return [
        t(`Rosa does not raise her voice. She lifts one hand and a walkie crackles on her hip. "Crew. Toilets. Troublemaker. No, I will say it nicely. Troublemaker, please."`,
          `Rosa no levanta la voz. Levanta una mano y un walkie cruje en su cadera. «Equipo. Baños. Alborotador. No, lo voy a decir bonito. Alborotador, por favor».`,
          `A Rosa não levanta a voz. Ergue uma mão e um rádio chia na cintura dela. «Equipe. Banheiro. Encrenqueiro. Não, vou falar bonito. Encrenqueiro, por favor».`),
        t(`Two volunteers in hi-vis vests arrive, very polite and very tall. Nobody touches you. They just walk beside you, one on each side, all the way back to the main floor, chatting about the weather.`,
          `Llegan dos voluntarios con chalecos reflectantes, muy amables y muy altos. Nadie te toca. Solo caminan a tu lado, uno a cada lado, hasta la pista principal, conversando sobre el clima.`,
          `Chegam dois voluntários de colete refletivo, muito educados e muito altos. Ninguém encosta em você. Eles só andam do seu lado, um de cada lado, até a pista principal, conversando sobre o tempo.`)
      ];
    };
  }

  /* ============================================================ 5. Pia and Moe: in the log, and one bottle only */
  Q.sq_moe = {
    title: t(`LOOKING FOR MOE`, `BUSCANDO A MOE`, `PROCURANDO O MOE`),
    desc: t(`Pia, on the foyer bench, has lost her friend Moe: tall, orange hat, "looks like a nervous lamp". Find him and tell him where she is.`,
      `Pia, en la banca del foyer, perdió a su amigo Moe: alto, gorro naranja, «parece una lámpara nerviosa». Encuéntralo y dile dónde está ella.`,
      `A Pia, no banco do foyer, perdeu o amigo Moe: alto, gorro laranja, «parece uma luminária nervosa». Encontre ele e diga onde ela está.`),
    doneText: t(`Pia and Moe found each other. Gerald the fern was there for all of it.`, `Pia y Moe se encontraron. Gerald, el helecho, estuvo ahí para todo.`, `A Pia e o Moe se encontraram. O Gerald, a samambaia, estava lá pra tudo.`)
  };
  if (D.pia) {
    const P = D.pia.nodes;
    P.a.branch.unshift({ req: { flag: 'pia_reunited' }, to: 'after' });
    P.after = { text: t(`Pia and Moe are sharing one pair of earphones and one very long story. Pia waves at you without stopping it.`, `Pia y Moe comparten un par de audífonos y una historia larguísima. Pia te saluda sin interrumpirla.`, `A Pia e o Moe dividem um fone de ouvido e uma história comprida demais. A Pia acena pra você sem parar de contar.`) };
    const ask = P.ask && (P.ask.choices || []).find(function (c) { return c.do && [].concat(c.do.flag || []).indexOf('pia_asked') !== -1; });
    if (ask) ask.do = Object.assign({}, ask.do, { quest: { sq_moe: 'active' } });
    if (P.thanks) P.thanks.do = Object.assign({}, P.thanks.do, { quest: { sq_moe: 'done' } });
  }

  /* ============================================================ 6. THE MURAL (Ximena, the tunnel; both venues) */
  const muralBits = ['mural_water', 'mural_grey', 'mural_chalk'];
  const muralCount = function (s) { return muralBits.filter(function (f) { return s.flags[f]; }).length; };
  const muralOn = function (s) { return s.quests.sq_mural === 'active'; };
  Q.sq_mural = {
    title: t(`THE MURAL`, `EL MURAL`, `O MURAL`),
    desc: function (s) {
      return t(`Ximena is painting the whole night on the tunnel wall and it is missing three things. ${mk(s, 'mural_water')} Water that is not from a tap: Oz's block of ice in Sala 2 is melting into a bucket. ${mk(s, 'mural_grey')} The one honest colour: ask Hazel, the purist in Sala 2. ${mk(s, 'mural_chalk')} Chalk to sketch with: Luca keeps some in lost property (coat check). Then back to Ximena.`,
        `Ximena está pintando la noche entera en el muro del túnel y le faltan tres cosas. ${mk(s, 'mural_water')} Agua que no sea de la llave: el bloque de hielo de Oz, en la Sala 2, se está derritiendo en un balde. ${mk(s, 'mural_grey')} El único color honesto: pregúntale a Hazel, la purista de la Sala 2. ${mk(s, 'mural_chalk')} Tiza para bocetar: Luca guarda en objetos perdidos (guardarropa). Después vuelve con Ximena.`,
        `A Ximena está pintando a noite inteira na parede do túnel e faltam três coisas. ${mk(s, 'mural_water')} Água que não seja da torneira: o bloco de gelo do Oz, na Sala 2, tá derretendo num balde. ${mk(s, 'mural_grey')} A única cor honesta: pergunte pra Hazel, a purista da Sala 2. ${mk(s, 'mural_chalk')} Giz pra rascunhar: o Luca guarda nos achados e perdidos (chapelaria). Depois volte pra Ximena.`);
    },
    doneText: function (s) {
      return RV(s)
        ? t(`The tunnel has a mural of tonight with your people in it. Ernesto should see it.`, `El túnel tiene un mural de esta noche con tu gente adentro. Ernesto debería verlo.`, `O túnel tem um mural desta noite com a sua galera nele. O Ernesto devia ver.`)
        : t(`The tunnel has a mural of tonight with your people in it, painted in meltwater and grey.`, `El túnel tiene un mural de esta noche con tu gente adentro, pintado con agua de hielo y gris.`, `O túnel tem um mural desta noite com a sua galera nele, pintado com água de gelo e cinza.`);
    }
  };
  if (D.ximena) {
    const X = D.ximena.nodes;
    D.ximena.start = 'mst';
    X.mst = { branch: [
      { req: function (s) { return s.quests.sq_mural === 'done'; }, to: 'mdone' },
      { req: muralOn, to: 'mprog' },
      { req: function () { return true; }, to: 'a' }
    ] };
    X.a.choices.splice(X.a.choices.length - 1, 0, K('care', t(`"Need a hand with the wall?"`, `«¿Te ayudo con el muro?»`, `«Quer ajuda com a parede?»`), { req: function (s) { return !s.quests.sq_mural; }, next: 'mural' }));
    X.mural = {
      text: t(`Ximena steps back and squints at the wall like it owes her money. "It's the whole night, start to finish. It's missing three things. Water that isn't from a tap: Oz upstairs is holding a block of ice and it's melting into a bucket, that's art water. A colour nobody has used: Hazel in Sala 2 says there's only one honest colour, and I'm too proud to ask her. And chalk to sketch with. Luca at the coat check has a lost-property drawer that has everything."`,
        `Ximena da un paso atrás y entrecierra los ojos ante el muro como si le debiera plata. «Es la noche entera, de principio a fin. Le faltan tres cosas. Agua que no sea de la llave: Oz, arriba, sostiene un bloque de hielo que se está derritiendo en un balde; eso es agua de arte. Un color que nadie haya usado: Hazel, en la Sala 2, dice que hay un solo color honesto, y yo soy demasiado orgullosa para preguntarle. Y tiza para bocetar. Luca, en el guardarropa, tiene un cajón de objetos perdidos que tiene de todo».`,
        `A Ximena dá um passo pra trás e aperta os olhos pra parede como se ela devesse dinheiro. «É a noite inteira, do começo ao fim. Faltam três coisas. Água que não seja da torneira: o Oz, lá em cima, tá segurando um bloco de gelo que tá derretendo num balde, isso é água de arte. Uma cor que ninguém usou: a Hazel, na Sala 2, diz que só existe uma cor honesta, e eu sou orgulhosa demais pra perguntar. E giz pra rascunhar. O Luca, na chapelaria, tem uma gaveta de achados e perdidos que tem de tudo».`),
      choices: [
        K('care', t(`"Water, colour, chalk. I'll bring them."`, `«Agua, color, tiza. Te los traigo».`, `«Água, cor, giz. Eu trago».`), { do: { flag: 'mural_on', quest: { sq_mural: 'active' }, soc: 1 }, next: null, react: t(`"Don't run. Paint can smell fear."`, `«No corras. La pintura huele el miedo».`, `«Não corre. Tinta sente o cheiro do medo».`) }),
        K('chill', t(`"Not tonight. It already looks great."`, `«Esta noche no. Ya se ve increíble».`, `«Hoje não. Já tá incrível».`), { free: true, next: null })
      ]
    };
    X.mprog = {
      text: function (s) { return t(`Ximena, without turning round: "${muralCount(s)} of 3. The wall is patient. I'm not."`, `Ximena, sin darse vuelta: «${muralCount(s)} de 3. El muro es paciente. Yo no».`, `A Ximena, sem se virar: «${muralCount(s)} de 3. A parede é paciente. Eu não».`); },
      choices: [
        K('care', t(`Hand over the meltwater, the colour and the chalk.`, `Entregarle el agua de hielo, el color y la tiza.`, `Entregar a água de gelo, a cor e o giz.`), { req: function (s) { return muralCount(s) >= 3; }, next: 'mfinish' }),
        K('ask', t(`"Remind me what you need?"`, `«¿Qué necesitabas?»`, `«Me lembra o que você precisa?»`), { next: 'mural_list' }),
        LEAVE()
      ]
    };
    X.mural_list = { text: t(`"Oz's meltwater, in Sala 2. Hazel's honest colour, also Sala 2. Chalk from Luca at the coat check. Go, go."`, `«El agua de hielo de Oz, en la Sala 2. El color honesto de Hazel, también en la Sala 2. Tiza de Luca, en el guardarropa. Anda, anda».`, `«A água de gelo do Oz, na Sala 2. A cor honesta da Hazel, também na Sala 2. Giz do Luca, na chapelaria. Vai, vai».`), next: 'mprog' };
    X.mfinish = {
      text: function (s) {
        const crew = s.party.length > 1;
        return [
          t(`Ximena sketches in chalk so fast it looks like the wall is remembering something. She thins the grey with Oz's meltwater, and the grey goes the exact colour of six in the morning on concrete. Then she paints the queue, the stalls, the quiet room, a fire barrel, a roof.`,
            `Ximena boceta con tiza tan rápido que parece que el muro estuviera recordando algo. Diluye el gris con el agua de hielo de Oz y el gris queda exactamente del color de las seis de la mañana sobre el cemento. Después pinta la fila, las cabinas, la sala tranquila, un barril de fuego, un techo.`,
            `A Ximena rascunha com giz tão rápido que parece que a parede tá lembrando de alguma coisa. Ela dilui o cinza com a água de gelo do Oz, e o cinza fica exatamente da cor das seis da manhã no concreto. Depois pinta a fila, as cabines, a sala de calma, um barril de fogo, um terraço.`),
          crew
            ? t(`In the middle, small, a group of people holding hands in a line so nobody gets lost. One of them is unmistakably you. "Don't argue. You're in it."`, `En el centro, chiquito, un grupo de gente tomada de la mano en fila para que nadie se pierda. Una de esas personas es, sin duda, tú. «No discutas. Estás adentro».`, `No meio, pequenininho, um grupo de pessoas de mãos dadas numa fila pra ninguém se perder. Uma delas é, sem dúvida, você. «Não discute. Você tá nele».`)
            : t(`In the middle, small, somebody carrying a paper cup, a tin of grey and a piece of chalk, looking for someone. It is unmistakably you. "Don't argue. You're in it."`, `En el centro, chiquito, alguien que carga un vaso de papel, una lata gris y una tiza, buscando a alguien. Es, sin duda, tú. «No discutas. Estás adentro».`, `No meio, pequenininho, alguém carregando um copo de papel, uma lata cinza e um giz, procurando alguém. É, sem dúvida, você. «Não discute. Você tá nele».`)
        ];
      },
      do: { flag: 'mural_done', unflag: muralBits, quest: { sq_mural: 'done' }, fun: 8, soc: 5, time: 10 },
      choices: [K('yes', t(`Step back and look at it.`, `Retroceder un paso y mirarlo.`, `Dar um passo pra trás e olhar.`), { free: true, call: 'mural_done', next: null })]
    };
    X.mdone = {
      text: t(`Ximena is signing the corner of the mural very small, in grey. "People keep stopping to find themselves in it. Nobody is in it except you lot. They find themselves anyway."`,
        `Ximena firma la esquina del mural muy chiquito, en gris. «La gente se detiene a buscarse en él. No sale nadie más que ustedes. Se encuentran igual».`,
        `A Ximena assina o canto do mural bem pequenininho, em cinza. «As pessoas param pra se procurar nele. Não tem ninguém além de vocês. Elas se acham mesmo assim».`),
      choices: [K('chill', t(`"It's beautiful."`, `«Es precioso».`, `«Tá lindo».`), { free: true, do: { soc: 1 }, next: null })]
    };
  }
  S.mural_done = function () {
    const s = EM.state;
    U.toast({ icon: 'star', kind: 'good', ms: 6500, text: RV(s) && !s.flags.owner_won && !s.flags.owner_gone
      ? t(`The mural is finished. Ernesto, the owner, wanted proof this is a place and not a party. Walk him down here.`, `El mural está terminado. Ernesto, el dueño, quería pruebas de que esto es un lugar y no una fiesta. Tráelo hasta aquí.`, `O mural tá pronto. O Ernesto, o dono, queria provas de que isso é um lugar e não uma festa. Traga ele até aqui.`)
      : t(`The mural is finished. You are on a wall in a tunnel now, which is more than most people can say.`, `El mural está terminado. Ahora estás en un muro de un túnel, que es más de lo que casi nadie puede decir.`, `O mural tá pronto. Agora você tá numa parede de túnel, o que é mais do que quase todo mundo pode dizer.`) });
  };
  /* the three things, from people who already exist */
  if (D.oz) D.oz.nodes.a.choices.splice(D.oz.nodes.a.choices.length - 1, 0, K('ask', t(`"Can I take some of the meltwater? It's for Ximena's mural."`, `«¿Me das un poco del agua que gotea? Es para el mural de Ximena».`, `«Posso pegar um pouco da água derretida? É pro mural da Ximena».`), { req: function (s) { return muralOn(s) && !s.flags.mural_water; }, do: { flag: 'mural_water', soc: 2 }, next: null, react: t(`Oz does not move a single muscle of the face. Only the eyes go to the bucket, then to you, then back to infinity. You fill a paper cup. The crowd watching applauds, very quietly, as if you had been part of it all along.`, `Oz no mueve ni un músculo de la cara. Solo los ojos van al balde, luego a ti, luego de vuelta al infinito. Llenas un vaso de papel. El público que mira aplaude muy bajito, como si hubieras sido parte de la obra desde el principio.`, `O Oz não mexe um músculo do rosto. Só os olhos vão pro balde, depois pra você, depois de volta pro infinito. Você enche um copo de papel. O público que assiste aplaude bem baixinho, como se você fizesse parte da obra desde o começo.`) }));
  if (D.hazel) D.hazel.nodes.a.choices.splice(D.hazel.nodes.a.choices.length - 1, 0, K('ask', t(`"Ximena says you know the one honest colour."`, `«Ximena dice que tú conoces el único color honesto».`, `«A Ximena diz que você conhece a única cor honesta».`), { req: function (s) { return muralOn(s) && !s.flags.mural_grey; }, next: 'grey' }));
  if (D.hazel) D.hazel.nodes.grey = {
    text: t(`Hazel uncrosses both arms, which has never happened. "Grey. Concrete at six in the morning. Every other colour is trying to sell you something." She takes a small tin of grey paint out of her bag, as if she has carried it for years waiting to be asked. "Tell her it's from me. Tell her not to add melody."`,
      `Hazel descruza los dos brazos, cosa que nunca había pasado. «Gris. Cemento a las seis de la mañana. Todos los demás colores te quieren vender algo». Saca de su bolso una latita de pintura gris, como si la hubiera cargado durante años esperando que alguien se la pidiera. «Dile que es de mi parte. Dile que no le ponga melodía».`,
      `A Hazel descruza os dois braços, coisa que nunca tinha acontecido. «Cinza. Concreto às seis da manhã. Todas as outras cores querem te vender alguma coisa». Ela tira da bolsa uma latinha de tinta cinza, como se carregasse aquilo havia anos esperando alguém pedir. «Diz que é da minha parte. Diz pra não pôr melodia».`),
    do: { flag: 'mural_grey', soc: 2, fun: 2 }, next: null
  };
  if (D.luca) D.luca.nodes.a.choices.push(K('ask', t(`"Is there any chalk in lost property? It's for the mural in the tunnel."`, `«¿Hay tiza en objetos perdidos? Es para el mural del túnel».`, `«Tem giz nos achados e perdidos? É pro mural do túnel».`), { req: function (s) { return muralOn(s) && !s.flags.mural_chalk; }, do: { flag: 'mural_chalk', soc: 2 }, next: null, react: t(`Luca opens a drawer labelled MISC. EMOTIONAL and hands you a stub of white chalk with the solemnity of a man handing over a sword. "It was left behind in 2019 by a man who drew hopscotch in the foyer. Respect it."`, `Luca abre un cajón con la etiqueta VARIOS. EMOCIONAL y te pasa un trozo de tiza blanca con la solemnidad de quien entrega una espada. «La dejó en 2019 un señor que dibujó una rayuela en el foyer. Respétala».`, `O Luca abre uma gaveta com a etiqueta DIVERSOS. EMOCIONAL e te entrega um toco de giz branco com a solenidade de quem entrega uma espada. «Foi esquecido em 2019 por um senhor que desenhou uma amarelinha no foyer. Respeite».`) }));

  /* the mural is a fourth piece of evidence for Ernesto (rave) */
  if (D.ernesto) {
    const E = D.ernesto.nodes;
    const pitch = E.a.choices; /* the same array is used by 'again' */
    pitch.splice(3, 0, K('honest', t(`Walk him down the tunnel to Ximena's mural.`, `Llevarlo por el túnel hasta el mural de Ximena.`, `Levar ele pelo túnel até o mural da Ximena.`), { req: function (s) { return !!s.flags.mural_done && !s.flags.ev_mural; }, do: { flag: 'ev_mural', soc: 2, time: 8 }, next: 'p_mur' }));
    E.p_mur = {
      text: t(`Ernesto stands in front of the mural for a long time with his hands in the pockets of the camel coat. He finds the queue, the stalls, the roof, and a man in a camel coat across the street, very small, that Ximena added without telling anyone. "She put me in it," he says. "Parties don't put you in things. Places do."`,
        `Ernesto se queda un buen rato frente al mural con las manos en los bolsillos del abrigo camel. Encuentra la fila, las cabinas, el techo, y un hombre de abrigo camel al otro lado de la calle, muy chiquito, que Ximena agregó sin decirle a nadie. «Me puso adentro», dice. «Las fiestas no te ponen adentro de nada. Los lugares sí».`,
        `O Ernesto fica um bom tempo na frente do mural com as mãos nos bolsos do casaco camelo. Ele acha a fila, as cabines, o terraço, e um homem de casaco camelo do outro lado da rua, bem pequenininho, que a Ximena acrescentou sem contar pra ninguém. «Ela me pôs nele», diz. «Festa não põe ninguém em nada. Lugar põe».`),
      next: 'check'
    };
    /* evidence now counts four kinds; two are still enough */
    const cnt = function (s) { return ['ev_petition', 'ev_letter', 'ev_aid', 'ev_mural'].filter(function (f) { return s.flags[f]; }).length; };
    E.check.branch[0].req = function (s) { return cnt(s) >= 2; };
    E.again.text = function (s) {
      return t(`Ernesto checks his watch, which is the most expensive thing on the street. "I'm here until five. Convince me." (${cnt(s)} of 2)`, `Ernesto mira su reloj, que es lo más caro de la calle. «Estoy aquí hasta las cinco. Convénceme». (${cnt(s)} de 2)`, `O Ernesto olha o relógio, que é a coisa mais cara da rua. «Fico aqui até as cinco. Me convença». (${cnt(s)} de 2)`);
    };
    const od = Q.sq_owner && Q.sq_owner.desc;
    if (typeof od === 'function') Q.sq_owner.desc = function (s) {
      const base = od(s);
      if (!s.quests.sq_mural) return base;
      const add = ' ' + mk(s, 'ev_mural');
      return t(base.en + add + ` Ximena's mural in the tunnel.`, base.es + add + ` El mural de Ximena en el túnel.`, base.pt + add + ` O mural da Ximena no túnel.`);
    };
  }

  /* ============================================================ the Night Report and the morning */
  const moments0 = story.moments;
  if (moments0) story.moments = function (s) {
    const out = moments0(s);
    if (s.flags.mural_done && out.length < 10) out.push(t(`Ximena painted the night on the tunnel wall, and you are in it.`, `Ximena pintó la noche en el muro del túnel, y tú sales en él.`, `A Ximena pintou a noite na parede do túnel, e você tá nela.`));
    return out;
  };
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'mural', who: '#XIMENA', ok: function (s) { return !!s.flags.mural_done; }, t: t(`went back at noon to check the mural in daylight. somebody had written THANK YOU under your little face in chalk. i didn't do that. the wall did.`, `volví a mediodía a ver el mural con luz de día. alguien escribió GRACIAS con tiza debajo de tu carita. no fui yo. fue el muro.`, `voltei ao meio-dia pra ver o mural na luz do dia. alguém escreveu OBRIGADO de giz embaixo do seu rostinho. não fui eu. foi a parede.`) });
    R.push({ id: 'moe', who: '#PIA', ok: function (s) { return !!s.flags.pia_reunited; }, t: t(`moe is asleep on my sofa next to the fern. he took the fern. we have a fern now. thank you for finding him.`, `moe está durmiendo en mi sillón al lado del helecho. se trajo el helecho. ahora tenemos un helecho. gracias por encontrarlo.`, `o moe tá dormindo no meu sofá do lado da samambaia. ele trouxe a samambaia. agora a gente tem uma samambaia. obrigada por achar ele.`) });
  }
})();

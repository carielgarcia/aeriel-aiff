/* EXCUSE ME — story v20: Reduciendo Daño & drug testing v2 (consolidated from v15 + v20).
   The harm reduction stand in the quiet room carries the name of the real Reduciendo Daño Foundation (Chile), used with the
   organisation's authorisation. Proper name, never translated. Isi (brown skin, black RD T-shirt) leads the table, flanked by
   her crew and Camilo O. Results cover MDMA, MDMA + methamphetamine, MDA, and unknown, and alcohol is framed as a drug too. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const RD = 'Reduciendo Daño';
  const lookOf = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  function cast(id, name, o) { EM.CAST[id] = { name: name, look: lookOf(o) }; }

  /* ------------------------------------------------ Isi: brown skin, black T-shirt that says RD */
  Object.assign(EM.CAST.nuri.look, { skin: 3, top: 0, tc: 1, tee: 'RD', teeC: '#FFFFFF' });
  [D.nuri, D.nuri_after].forEach(function (d) { if (d) d.role = t(RD.toUpperCase(), RD.toUpperCase(), RD.toUpperCase()); });
  Object.keys(D).forEach(function (k) { if (D[k] && D[k].who === 'nuri' && D[k].role) D[k].role = t(RD.toUpperCase(), RD.toUpperCase(), RD.toUpperCase()); });

  D.nuri.nodes.rd = {
    text: [
      t(`"${RD} is who we are. We're here so people can check what they have and decide with more information, with no judgement and nobody taking names. The black T-shirts are us. Ask any of us."`, `«${RD} es quienes somos. Estamos para que la gente pueda revisar lo que tiene y decidir con más información, sin juicios y sin que nadie anote nombres. Las camisetas negras somos nosotres. Pregúntale a cualquiera».`, `«${RD} é quem a gente é. Estamos aqui pra que as pessoas possam conferir o que têm e decidir com mais informação, sem julgamento e sem ninguém anotar nome. As camisetas pretas somos nós. Pergunta pra qualquer um».`),
      t(`She tilts her head toward the left. "And the man in the black T-shirt over there, Camilo, is the founder of the real foundation, the one in Chile. We borrowed his name for tonight. Go say hi. He loves it."`, `Inclina la cabeza hacia la izquierda. «Y el señor de la camiseta negra de allá, Camilo, es el fundador de la fundación de verdad, la de Chile. Le pedimos prestado el nombre por esta noche. Ve a saludarlo. Le encanta».`, `Ela inclina a cabeça pra esquerda. «E o cara de camiseta preta ali, o Camilo, é o fundador da fundação de verdade, a do Chile. A gente pegou o nome dele emprestado por essa noite. Vai lá dar um oi. Ele adora».`)
    ], once: true, do: { soc: 1, flag: 'rd_known' }, next: 'a'
  };
  D.nuri.nodes.a.choices.splice(1, 0, K('ask', t(`"Who is ${RD}?"`, `«¿Quiénes son ${RD}?»`, `«Quem é a ${RD}?»`), { next: 'rd', free: true }));

  /* ------------------------------------------------ the crew flanking the stand: black and neon T-shirts, not talkers */
  const crew = [
    ['rd1', 'RD', { skin: 4, hc: 7, top: 0, ac: 1, bottom: 1, acc: 0 }, 12.5, 3.5],
    ['rd2', 'RD', { skin: 1, hc: 9, top: 0, ac: 2, bottom: 2, acc: 2 }, 17.5, 3.5],
    ['rd3', 'RD', { skin: 2, hc: 0, top: 0, ac: 0, bottom: 0, acc: 4 }, 12.5, 5.5]
  ];
  crew.forEach(function (c) {
    cast(c[0], c[1], Object.assign({ tee: 'RD', teeC: 'neon', tc: 1 }, c[2]));
    Z.welfare.npc({ id: c[0], x: c[3], y: c[4], dir: 'd', reach: 12, decor: true });
  });
  Z.welfare.signs.forEach(function (sg) { if (sg.text === 'CHECK') { sg.text = RD.toUpperCase(); sg.x = 13; sg.y = 1; } });

  /* ------------------------------------------------ Camilo O., a few steps to the left of the stand */
  cast('camilo', 'CAMILO O.', { skin: 0, hair: 1, hc: 1, expr: 1, top: 0, tc: 1, bottom: 0, bc: 1, acc: 0, ac: 3 });
  D.camilo = {
    who: 'camilo', role: t('FOUNDER // REDUCIENDO DAÑO', 'FUNDADOR // REDUCIENDO DAÑO', 'FUNDADOR // REDUCIENDO DAÑO'), start: 'a', nodes: {
      a: {
        text: t(`A man in a plain black T-shirt stands a few steps from the stand, watching it the way people watch something they care about. He notices you and smiles. "Hi. I'm Camilo. Camilo O."`, `Un hombre con una camiseta negra lisa está parado a unos pasos del stand, mirándolo como se mira algo que se quiere. Te nota y sonríe. «Hola. Soy Camilo. Camilo O.»`, `Um homem de camiseta preta lisa tá parado a alguns passos do stand, olhando pra ele do jeito que se olha pra algo de que se gosta. Ele te nota e sorri. «Oi. Eu sou o Camilo. Camilo O.»`),
        do: { flag: 'camilo_met' },
        choices: [
          K('ask', t(`"Who are you?"`, `«¿Quién eres?»`, `«Quem é você?»`), { next: 'who' }),
          K('ask', t(`"Where can I follow you?"`, `«¿Dónde te puedo seguir?»`, `«Onde posso te seguir?»`), { next: 'insta' }),
          K('chill', t(`"Just saying hi."`, `«Solo saludo».`, `«Só vim dar um oi».`), { do: { soc: 2 }, next: null, free: true })
        ]
      },
      who: {
        text: [
          t(`"I'm the founder of the real ${RD} Foundation. We're based in Chile, and we do real harm reduction, like the stand you see here. This is a game, but the work is true."`, `«Soy el fundador de la Fundación ${RD} de verdad. Estamos en Chile y hacemos reducción de daños de verdad, como el stand que ves aquí. Esto es un juego, pero el trabajo es real».`, `«Eu sou o fundador da Fundação ${RD} de verdade. A gente é do Chile e faz redução de danos de verdade, como o stand que você vê aqui. Isso é um jogo, mas o trabalho é real».`)
        ], do: { soc: 3, fun: 1, flag: 'camilo_who' }, next: 'a2'
      },
      a2: {
        text: t(`He looks at the stand, at Isi, at the people in black and neon T-shirts. "I'm very happy to see us in here. Come by when you can."`, `Mira el stand, a Isi, a la gente de camisetas negras y neón. «Me da mucha alegría vernos aquí adentro. Pasa cuando puedas».`, `Ele olha o stand, a Isi, o pessoal de camisetas pretas e neon. «Fico muito feliz de ver a gente aqui dentro. Passa lá quando puder».`),
        choices: [
          K('ask', t(`"Where can I follow you?"`, `«¿Dónde te puedo seguir?»`, `«Onde posso te seguir?»`), { next: 'insta' }),
          K('chill', t(`"Thank you for what you do."`, `«Gracias por lo que hacen».`, `«Obrigado pelo que vocês fazem».`), { do: { soc: 3, fun: 2, flag: 'camilo_thanked' }, next: null, free: true, react: t(`He puts a hand on his chest. "Thank you for listening."`, `Se lleva una mano al pecho. «Gracias por escuchar».`, `Ele põe a mão no peito. «Obrigado por ouvir».`) })
        ]
      },
      insta: {
        text: t(`"On Instagram: reduciendodano.cl. Follow us, it's where the real work lives."`, `«En Instagram: reduciendodano.cl. Síguenos, ahí vive el trabajo de verdad».`, `«No Instagram: reduciendodano.cl. Segue a gente, é onde o trabalho de verdade acontece».`),
        do: { soc: 2, flag: 'camilo_insta' },
        choices: [
          K('yes', t(`"Following, right now."`, `«Los sigo ahora mismo».`, `«Tô seguindo agora mesmo».`), { do: { fun: 2, soc: 2 }, next: null, free: true, react: t(`He grins. "Thank you. Say hi to Isi on your way."`, `Sonríe. «Gracias. Saluda a Isi de mi parte».`, `Ele abre um sorriso. «Valeu. Dá um oi pra Isi por mim».`) }),
          K('chill', t(`"I'll look you up later."`, `«Los busco más tarde».`, `«Te procuro mais tarde».`), { next: null, free: true })
        ]
      }
    }
  };
  Z.welfare.npc({ id: 'camilo', x: 8.5, y: 4.5, dlg: 'camilo', dir: 'r', reach: 18 });

  /* ------------------------------------------------ overheard reminders + RD crew barks */
  const OVERHEARD = [
    t(`Overheard: "Come on, let's go test our substances at the ${RD} stand."`, `Se oye: «Vamos, vamos a testear nuestras sustancias al stand de ${RD}».`, `Se ouve: «Bora, vamos testar nossas substâncias no stand da ${RD}».`),
    t(`Overheard: "Did you test it yet? ${RD} is in the quiet room."`, `Se oye: «¿Ya lo testeaste? ${RD} está en la sala tranquila».`, `Se ouve: «Já testou? A ${RD} tá na sala de calma».`),
    t(`Overheard: "Nobody takes anything before ${RD} has looked at it. House rule."`, `Se oye: «Nadie toma nada antes de que ${RD} lo mire. Regla de la casa».`, `Se ouve: «Ninguém toma nada antes de a ${RD} olhar. Regra da casa».`),
    t(`Overheard: "Test first, dance after. ${RD}, quiet room, free."`, `Se oye: «Primero se testea, después se baila. ${RD}, sala tranquila, gratis».`, `Se ouve: «Primeiro testa, depois dança. ${RD}, sala de calma, de graça».`),
    t(`Overheard: "My friend swears by the ${RD} stand. I'm going to go and see."`, `Se oye: «Mi amiga jura por el stand de ${RD}. Voy a ir a ver».`, `Se ouve: «Minha amiga é fã do stand da ${RD}. Vou lá ver».`),
    t(`Overheard: "Let's take it to ${RD} first. It's the one with the black T-shirts."`, `Se oye: «Llevémoslo primero a ${RD}. Los de las camisetas negras».`, `Se ouve: «Vamos levar primeiro na ${RD}. O pessoal das camisetas pretas».`)
  ];
  const CREW = [
    t(`RD crew: "Water's free. So are the questions."`, `Equipo RD: «El agua es gratis. Las preguntas también».`, `Equipe RD: «A água é de graça. As perguntas também».`),
    t(`RD crew: "If you brought something, Isi can look at it. No names, no judgement."`, `Equipo RD: «Si trajiste algo, Isi lo puede mirar. Sin nombres, sin juicios».`, `Equipe RD: «Se você trouxe algo, a Isi pode olhar. Sem nome, sem julgamento».`),
    t(`RD crew: "Sit down for a minute. The night will still be here."`, `Equipo RD: «Siéntate un minuto. La noche va a seguir aquí».`, `Equipe RD: «Senta um minutinho. A noite continua aqui».`)
  ];
  let nextOverheard = 0, nextCrew = 0;
  const minute0 = L.minute;
  L.minute = function () {
    minute0();
    const s = EM.state; if (!s || s.ended) return;
    if (s.zone !== 'welfare' && s.time >= nextOverheard && Math.random() < 0.18) {
      nextOverheard = s.time + 35;
      U.toast({ icon: 'cross', kind: 'info', ms: 5200, text: EM.pick(OVERHEARD) });
    }
  };
  const tick0 = story.tick;
  story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state; if (!s || s.zone !== 'welfare' || s.ended || !EM.engine) return;
    nextCrew -= dt;
    if (nextCrew > 0) return;
    const near = ['rd1', 'rd2', 'rd3'].some(function (id) {
      const e = EM.zones.welfare.ents.find(function (x) { return x.id === id; });
      return e && Math.hypot(e.x * 16 - s.x, e.y * 16 - s.y) < 56;
    });
    if (near) { nextCrew = 45; U.toast({ icon: 'cross', kind: 'bark', ms: 4200, text: EM.pick(CREW) }); } else nextCrew = 4;
  };

  /* ------------------------------------------------ the friends' pill: results read from the same model */
  const pillPages = function (s) { return EM.drugs.pages(s.pill.comp || 'mdma', 'mdma'); };
  if (D.nuri_result) {
    const N = D.nuri_result.nodes;
    ['pure', 'mix', 'fake'].forEach(function (k) { if (N[k]) N[k].text = pillPages; });
    N.mda = { text: pillPages, next: 'decide_mda' };
    N.start.branch.unshift({ req: function (s) { return s.pill.comp === 'mda'; }, to: 'mda' });
    if (N.decide_mix) {
      N.decide_mda = Object.assign({}, N.decide_mix, {
        text: t(`BENJA: "…MDA. Not MDMA. So it is a cousin? It still works like the good thing, right? RIGHT?" He holds the pill in both hands.`, `BENJA: «…MDA. No es MDMA. ¿O sea que es un primo? ¿Igual funciona como la cosa buena, no? ¿¿NO??» Sostiene la pastilla con las dos manos.`, `BENJA: «…MDA. Não é MDMA. Então é um primo? Mesmo assim funciona como a coisa boa, né? NÉ?» Ele segura o comprimido com as duas mãos.`),
        choices: N.decide_mix.choices.map(function (c) { return Object.assign({}, c); })
      });
    }
  }
  const ape = S.applyPillEffects;
  S.applyPillEffects = function (who, careful) {
    ape(who, careful);
    const s = EM.state;
    if (s.pill && s.pill.comp === 'mda') {
      s.fx.mdma = Math.round((s.fx.mdma || 240) * 1.5);
      L.apply({ weird: 4, hp: -1, flag: 'took_mda' });
      U.toast({ icon: 'heart', kind: 'info', ms: 5500, text: t('Slower to arrive than you expected. A warm hum, and it is going to last longer than you planned.', 'Tarda más en llegar de lo que esperabas. Un zumbido tibio, y va a durar más de lo que planeaste.', 'Demora mais pra chegar do que você esperava. Um zumbido morno, e vai durar mais do que você planejou.') });
    }
  };

  /* ------------------------------------------------ Isi, plain and direct + alcohol + dubstep gag */
  const greeting = [
    t(`"Hi. I'm Isi, from ${RD}. Water on the left, notebook on the right. We don't take names. What do you need?" Her black T-shirt says RD.`, `«Hola. Soy Isi, de ${RD}. Agua a la izquierda, cuaderno a la derecha. No anotamos nombres. ¿Qué necesitas?» Su camiseta negra dice RD.`, `«Oi. Sou a Isi, da ${RD}. Água à esquerda, caderno à direita. A gente não anota nomes. Do que você precisa?» A camiseta preta dela diz RD.`),
    t(`"One reminder for everyone: alcohol is a drug too. We don't test it, but give it the same care as anything else."`, `«Un recordatorio para todos: el alcohol también es una droga. No lo testeamos, pero cuídalo igual que cualquier otra cosa».`, `«Um lembrete pra todo mundo: o álcool também é uma droga. A gente não testa, mas tenha o mesmo cuidado que teria com qualquer outra coisa».`)
  ];
  const GAG = [
    t(`"Still no dubstep. I started a petition. It has one signature, mine, twice."`, `«Todavía no hay dubstep. Empecé una petición. Tiene una firma, la mía, dos veces».`, `«Ainda sem dubstep. Comecei um abaixo-assinado. Tem uma assinatura, a minha, duas vezes».`),
    t(`"Night after night, and the DJ says 'we'll see'. I saw Skrillex once. One time. I know what a good drop does to a room."`, `«Noche tras noche, y el DJ dice “ya veremos”. Yo vi a Skrillex una vez. Una sola. Sé lo que hace un buen drop en una sala».`, `«Noite após noite, e a DJ diz “a gente vê”. Eu vi o Skrillex uma vez. Uma só. Eu sei o que um bom drop faz com uma sala».`),
    t(`"I hum wobbles under my breath at the table. The patients are calmer. This is unrelated. Also: Skrillex. Once."`, `«Tarareo wobbles entre dientes en la mesa. Los pacientes están más tranquilos. Esto no tiene relación. Además: Skrillex. Una vez».`, `«Cantarolo wobbles entre os dentes na mesa. Os pacientes estão mais calmos. Isso não tem relação. Além disso: Skrillex. Uma vez».`),
    t(`"One wobble at 3 a.m. would heal this whole venue. I say it as someone who saw Skrillex once."`, `«Un wobble a las 3 de la mañana sanaría todo este local. Lo digo como alguien que vio a Skrillex una vez».`, `«Um wobble às 3 da manhã curaria este local inteiro. Falo como alguém que viu o Skrillex uma vez».`)
  ];
  D.nuri.nodes.a.text = function (s) {
    const lvl = (s.gags && s.gags.isi) || 0;
    return lvl >= 2 ? greeting.concat([GAG[Math.min(lvl - 2, GAG.length - 1)]]) : greeting;
  };
  D.nuri.nodes.explain.text = [
    t(`"We scrape a little off your sample and put a drop of reagent on it. The colour tells us what is in there. Pills get three reagents: Marquis, Froehde and Simmons. Powders get two: Morris and Liebermann."`, `«Raspamos un poco de tu muestra y le ponemos una gota de reactivo. El color nos dice qué hay adentro. A las pastillas les hacemos tres reactivos: Marquis, Froehde y Simmons. A los polvos, dos: Morris y Liebermann».`, `«A gente raspa um pouco da sua amostra e coloca uma gota de reagente. A cor diz o que tem ali dentro. Comprimidos levam três reagentes: Marquis, Froehde e Simmons. Pós levam dois: Morris e Liebermann».`),
    t(`"A test only shows what it can see. It does not tell me how strong something is, or how your body will react. I don't tell anyone what to do. You decide."`, `«Un test solo muestra lo que alcanza a ver. No me dice qué tan fuerte es algo ni cómo va a reaccionar tu cuerpo. Yo no le digo a nadie qué hacer. Tú decides».`, `«Um teste só mostra o que ele consegue ver. Não me diz a força nem como o seu corpo vai reagir. Eu não digo a ninguém o que fazer. Você decide».`)
  ];
  const alcohol = {
    text: t(`"No, we don't test alcohol. But alcohol is a psychoactive substance, and it deserves the same care as any other drug. Know how much you are having, go slowly, drink water, and don't mix it with other things."`, `«No, el alcohol no lo testeamos. Pero el alcohol es una sustancia psicoactiva y merece el mismo cuidado que cualquier otra droga. Sabe cuánto estás tomando, ve despacio, toma agua y no lo mezcles con otras cosas».`, `«Não, álcool a gente não testa. Mas o álcool é uma substância psicoativa e merece o mesmo cuidado que qualquer outra droga. Saiba quanto você está bebendo, vá devagar, beba água e não misture com outras coisas».`),
    choices: [K('chill', t(`"Thanks. I'll take it slow."`, `«Gracias. Voy a ir despacio».`, `«Valeu. Vou com calma».`), { do: { soc: 2, care: 1 }, next: null, free: true })]
  };
  const ask = K('ask', t(`"Do you test alcohol?"`, `«¿Testean el alcohol?»`, `«Vocês testam álcool?»`), { next: 'alcohol', free: true });
  const dubAsk = K('ask', t(`"Tell me about the dubstep."`, `«Cuéntame del dubstep».`, `«Me conta do dubstep».`), { next: 'dub', free: true });
  D.nuri.nodes.dub = {
    text: [
      t(`"Dubstep. Finally, someone asks." Isi sits up straight. "A good drop is a whole room breathing out at the same time. For four seconds nobody is thinking about anything. In my work, four seconds of that is a lot."`, `«Dubstep. Por fin alguien pregunta». Isi se endereza. «Un buen drop es una sala entera soltando el aire al mismo tiempo. Durante cuatro segundos nadie piensa en nada. En mi trabajo, cuatro segundos disso es mucho».`, `«Dubstep. Finalmente alguém pergunta». A Isi se endireita. «Um bom drop é uma sala inteira soltando o ar ao mesmo tempo. Durante quatro segundos ninguém pensa em nada. No meu trabalho, quatro segundos disso é muito».`),
      t(`"I saw Skrillex once. One time. I think about it more than I should."`, `«Yo vi a Skrillex una vez. Una sola. Lo pienso más de lo que debería».`, `«Eu vi o Skrillex uma vez. Uma só. Penso nisso mais do que deveria».`),
      t(`"So if you see the DJ: one wobble. Just one. I will bring water for everyone."`, `«Así que si ves al DJ: un wobble. Solo uno. Yo llevo agua para todos».`, `«Então se você encontrar a DJ: um wobble. Só um. Eu levo água pra todo mundo».`)
    ],
    do: { soc: 2, fun: 2, flag: 'isi_chatted' },
    choices: [
      K('ask', t(`"Skrillex? Really?"`, `«¿Skrillex? ¿En serio?»`, `«Skrillex? Sério?»`), { next: 'skrillex', free: true }),
      K('yes', t(`"I'll tell them."`, `«Se lo digo».`, `«Eu falo com ela».`), { do: { fun: 3, soc: 3, flag: 'req_wobble' }, next: null, react: t(`"Thank you. Say it was me. Say Isi, quiet room, one wobble."`, `«Gracias. Diles que fui yo. Di Isi, sala tranquila, un wobble».`, `«Valeu. Diz que fui eu. Diz Isi, sala de calma, um wobble».`) }),
      K('chill', t(`"Maybe later."`, `«Quizás más tarde».`, `«Talvez mais tarde».`), { next: null, free: true })
    ]
  };
  D.nuri.nodes.skrillex = {
    text: t(`"Really. Once. I was standing at the back, a drop landed, and a stranger hugged me. I never found that stranger again. I never found a drop like that again either."`, `«En serio. Una vez. Estaba parada al fondo, cayó un drop y un desconocido me abrazó. Nunca volví a encontrar a ese desconocido. Tampoco volví a encontrar un drop así».`, `«Sério. Uma vez. Eu estava no fundo, um drop caiu e um estranho me abraçou. Nunca mais encontrei esse estranho. Também nunca mais encontrei um drop assim».`),
    choices: [K('chill', t(`"That's a good story."`, `«Es una buena historia».`, `«É uma boa história».`), { do: { soc: 2, fun: 2 }, next: null, free: true })]
  };
  D.nuri.nodes.alcohol = alcohol;
  D.nuri.nodes.a.choices.push(dubAsk);
  D.nuri.nodes.a.choices.push(ask);
  if (D.nuri_after) { D.nuri_after.nodes.alcohol = alcohol; D.nuri_after.nodes.a.choices.push(ask); D.nuri_after.nodes.dub = D.nuri.nodes.dub; D.nuri_after.nodes.skrillex = D.nuri.nodes.skrillex; D.nuri_after.nodes.a.choices.push(dubAsk); }
})();

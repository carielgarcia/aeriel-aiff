/* EXCUSE ME — drug testing, v2: the friends' pill uses the same four outcomes as everything else (MDMA, MDMA + methamphetamine,
   MDA, unknown), Isi speaks plainly, and she reminds everyone that alcohol is a drug too (drugs.js has the model). */
'use strict';
(function () {
  const EM = window.EM, T = EM.T, L = EM.logic, U = EM.ui, D = EM.DIALOGUES, S = EM.scripts;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };

  /* ------------------------------------------------ the friends' pill: results read from the same model */
  const pillPages = function (s) { return EM.drugs.pages(s.pill.comp || 'mdma', 'mdma'); };
  if (D.nuri_result) {
    const N = D.nuri_result.nodes;
    ['pure', 'mix', 'fake'].forEach(function (k) { if (N[k]) N[k].text = pillPages; });
    N.mda = { text: pillPages, next: 'decide_mda' };
    N.start.branch.unshift({ req: function (s) { return s.pill.comp === 'mda'; }, to: 'mda' });
    /* Dani's reaction to a pill that is MDA: same choices and consequences as the mixed pill */
    if (N.decide_mix) {
      N.decide_mda = Object.assign({}, N.decide_mix, {
        text: t('DANI: "…MDA. Not MDMA. So it is a cousin? It still works like the good thing, right? RIGHT?" He holds the pill like it just changed its name.', 'DANI: «…MDA. No es MDMA. ¿O sea que es un primo? ¿Igual funciona como la cosa buena, no? ¿¿NO??» Sostiene la pastilla como si acabara de cambiar de nombre.', 'DANI: «…MDA. Não é MDMA. Então é um primo? Mesmo assim funciona como a coisa boa, né? NÉ?» Ele segura o comprimido como se ele tivesse acabado de mudar de nome.'),
        choices: N.decide_mix.choices.map(function (c) { return Object.assign({}, c); })
      });
    }
  }
  /* taking the friends' pill: MDA arrives slower, lasts longer and is a little stranger */
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

  /* ------------------------------------------------ Isi, plain and direct */
  const RD = 'Reduciendo Daño';
  const greeting = [
    t(`"Hi. I'm Isi, from ${RD}. Water on the left, notebook on the right. We don't take names. What do you need?" Her black T-shirt says RD.`, `«Hola. Soy Isi, de ${RD}. Agua a la izquierda, cuaderno a la derecha. No anotamos nombres. ¿Qué necesitas?» Su camiseta negra dice RD.`, `«Oi. Sou a Isi, da ${RD}. Água à esquerda, caderno à direita. A gente não anota nomes. Do que você precisa?» A camiseta preta dela diz RD.`),
    t(`"One reminder for everyone: alcohol is a drug too. We don't test it, but give it the same care as anything else."`, `«Un recordatorio para todos: el alcohol también es una droga. No lo testeamos, pero cuídalo igual que cualquier otra cosa».`, `«Um lembrete pra todo mundo: o álcool também é uma droga. A gente não testa, mas tenha o mesmo cuidado que teria com qualquer outra coisa».`)
  ];
  /* her dubstep complaint grows each time you come back (counted across nights), and she has seen Skrillex once */
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
  /* "tell me about the dubstep": she is happy to, and she has seen Skrillex once */
  const dubAsk = K('ask', t(`"Tell me about the dubstep."`, `«Cuéntame del dubstep».`, `«Me conta do dubstep».`), { next: 'dub', free: true });
  D.nuri.nodes.dub = {
    text: [
      t(`"Dubstep. Finally, someone asks." Isi sits up straight. "A good drop is a whole room breathing out at the same time. For four seconds nobody is thinking about anything. In my work, four seconds of that is a lot."`, `«Dubstep. Por fin alguien pregunta». Isi se endereza. «Un buen drop es una sala entera soltando el aire al mismo tiempo. Durante cuatro segundos nadie piensa en nada. En mi trabajo, cuatro segundos de eso es mucho».`, `«Dubstep. Finalmente alguém pergunta». A Isi se endireita. «Um bom drop é uma sala inteira soltando o ar ao mesmo tempo. Durante quatro segundos ninguém pensa em nada. No meu trabalho, quatro segundos disso é muito».`),
      t(`"I saw Skrillex once. One time. I think about it more than I should."`, `«Yo vi a Skrillex una vez. Una sola. Lo pienso más de lo que debería».`, `«Eu vi o Skrillex uma vez. Uma só. Penso nisso mais do que deveria».`),
      t(`"So if you see the DJ: one wobble. Just one. I will bring water for everyone."`, `«Así que si ves al DJ: un wobble. Solo uno. Yo llevo agua para todos».`, `«Então se você encontrar a DJ: um wobble. Só um. Eu levo água pra todo mundo».`)
    ],
    do: { soc: 2, fun: 2, flag: 'isi_chatted' },
    choices: [
      K('ask', t(`"Skrillex? Really?"`, `«¿Skrillex? ¿En serio?»`, `«Skrillex? Sério?»`), { next: 'skrillex', free: true }),
      K('yes', t(`"I'll tell them."`, `«Se lo digo».`, `«Eu falo com ela».`), { do: { fun: 3, soc: 3 }, next: null, react: t(`"Thank you. Say it was me. Say Isi, quiet room, one wobble."`, `«Gracias. Diles que fui yo. Di Isi, sala tranquila, un wobble».`, `«Valeu. Diz que fui eu. Diz Isi, sala de calma, um wobble».`) }),
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

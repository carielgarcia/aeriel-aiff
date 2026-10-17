/* EXCUSE ME — story v15: Reduciendo Daño. The harm reduction stand in the quiet room now carries the name of the real
   Reduciendo Daño Foundation (Chile), used with the organisation's authorisation. Proper name, never translated.
   Isi (brown skin, black RD T-shirt) is the only one who talks; her crew in black-and-neon RD shirts flank the stand.
   A few steps to the left stands Camilo O., founder of the real foundation. People around the club send each other there. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const RD = 'Reduciendo Daño';
  const lookOf = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  function cast(id, name, o) { EM.CAST[id] = { name: name, look: lookOf(o) }; }

  /* ------------------------------------------------ Isi: brown skin, black T-shirt that says RD */
  Object.assign(EM.CAST.nuri.look, { skin: 3, top: 0, tc: 1, tee: 'RD', teeC: '#FFFFFF' });
  [D.nuri, D.nuri_after].forEach(function (d) { if (d) d.role = t(RD.toUpperCase(), RD.toUpperCase(), RD.toUpperCase()); });
  Object.keys(D).forEach(function (k) { if (D[k] && D[k].who === 'nuri' && D[k].role) D[k].role = t(RD.toUpperCase(), RD.toUpperCase(), RD.toUpperCase()); });
  D.nuri.nodes.a.text = t(`"Hi. ${RD}. Water on the left, notebook on the right, nobody takes names. What are we doing?" Isi's black T-shirt says RD. Her voice has the energy of someone who has said this sentence a thousand times and means it every time.`, `«Hola. ${RD}. Agua a la izquierda, cuaderno a la derecha, nadie anota nombres. ¿Qué hacemos?» La camiseta negra de Isi dice RD. Su voz tiene la energía de quien dijo esta frase mil veces y la dice en serio cada vez.`, `«Oi. ${RD}. Água à esquerda, caderno à direita, ninguém anota nome. O que a gente vai fazer?» A camiseta preta da Isi diz RD. A voz dela tem a energia de quem já disse essa frase mil vezes e fala sério todas as vezes.`);
  D.nuri.nodes.rd = {
    text: [
      t(`"${RD} is who we are. We're here so people can check what they have and decide with more information, with no judgement and nobody taking names. The black T-shirts are us. Ask any of us."`, `«${RD} es quienes somos. Estamos para que la gente pueda revisar lo que tiene y decidir con más información, sin juicios y sin que nadie anote nombres. Las camisetas negras somos nosotres. Pregúntale a cualquiera».`, `«${RD} é quem a gente é. Estamos aqui pra que as pessoas possam conferir o que têm e decidir com mais informação, sem julgamento e sem ninguém anotar nome. As camisetas pretas somos nós. Pergunta pra qualquer um».`),
      t(`She tilts her head toward the left. "And the man in the black T-shirt over there, Camilo, is the founder of the real foundation, the one in Chile. We borrowed his name for tonight. Go say hi. He loves it."`, `Inclina la cabeza hacia la izquierda. «Y el señor de la camiseta negra de allá, Camilo, es el fundador de la fundación de verdad, la de Chile. Le pedimos prestado el nombre por esta noche. Ve a saludarlo. Le encanta».`, `Ela inclina a cabeça pra esquerda. «E o cara de camiseta preta ali, o Camilo, é o fundador da fundação de verdade, a do Chile. A gente pegou o nome dele emprestado por essa noite. Vai lá dar um oi. Ele adora».`)
    ], do: { soc: 1, flag: 'rd_known' }, next: 'a'
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
  /* the sign above the table carries the name */
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

  /* ------------------------------------------------ the whole club points people there */
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
})();

/* EXCUSE ME — story v8: the queue has a dealer (four kinds of things), what you buy you can carry, and ISI's table will
   tell you what it actually looks like. ISI is kind, loves seafood and tattoos, and thinks the DJ does not play enough dubstep. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };

  const KIND = {
    mdma: t('MDMA', 'MDMA', 'MDMA'),
    coke: t('COCAINE', 'COCAÍNA', 'COCAÍNA'), ket: t('KETAMINE', 'KETAMINA', 'CETAMINA')
  };
  const KINDS = ['mdma', 'coke', 'ket'];
  /* what is really in a sample is a composition key from drugs.js (mdma, mix, mda, unknown, coke, coke_lev, ...) */
  function realName(r) { return EM.drugs.name(r); }

  /* ------------------------------------------------------------ what a purchase really is */
  /* a pill's stamp is a story, not a guarantee; the odds are in drugs.js */
  function resolve(told, imprint) { return told === 'mdma' ? EM.drugs.rollPill(imprint) : EM.drugs.rollPowder(told); }
  const SHAPES = {
    round: t('ROUND', 'REDONDA', 'REDONDA'), heart: t('HEART', 'DE CORAZÓN', 'DE CORAÇÃO'), square: t('SQUARE', 'CUADRADA', 'QUADRADA'),
    star: t('STAR', 'DE ESTRELLA', 'DE ESTRELA'), diamond: t('DIAMOND', 'DE ROMBO', 'DE LOSANGO')
  };
  const IMPRINTS = {
    crown: { g: '♛', n: t('CROWN', 'CORONA', 'COROA') }, heart: { g: '♥', n: t('HEART', 'CORAZÓN', 'CORAÇÃO') },
    bolt: { g: '⚡', n: t('LIGHTNING BOLT', 'RAYO', 'RAIO') }, skull: { g: '☠', n: t('SKULL', 'CALAVERA', 'CAVEIRA') },
    smile: { g: '☺', n: t('SMILEY', 'CARITA', 'CARINHA') }, ae: { g: 'Æ', n: t('Æ', 'Æ', 'Æ') }
  };
  function stash() { const s = EM.state; s.stash = s.stash || []; return s.stash; }
  story.hasStash = function (kind, untestedOnly) { return stash().some(function (e) { return e.kind === kind && (!untestedOnly || !e.tested); }); };

  /* ------------------------------------------------------------ TICO, in the queue */
  EM.CAST.tico = { name: 'TICO', look: { skin: 1, hair: 5, hc: 9, expr: 2, top: 9, tc: 3, bottom: 1, bc: 4, acc: 5, wide: false } };
  D.tico = {
    who: 'tico', role: t('IN THE QUEUE', 'EN LA FILA', 'NA FILA'), start: 'a', nodes: {
      a: {
        text: t(`The person at the back of the queue has a very big jacket with a lot of small pockets. "Psst. Don't look at the pockets. Look at me. I'm a menu, standing up. Say a word and I'll pretend it was your idea."`, `La persona del final de la fila lleva una chaqueta enorme con muchísimos bolsillitos. «Psst. No mires los bolsillos. Mírame a mí. Soy un menú de pie. Di una palabra y voy a fingir que fue idea tuya».`, `A pessoa no fim da fila usa uma jaqueta enorme com muitos bolsinhos. «Psiu. Não olha os bolsos. Olha pra mim. Eu sou um cardápio em pé. Fala uma palavra e eu finjo que foi ideia sua».`),
        choices: [
          K('bold', t(`"MDMA. Pills."`, `«MDMA. Pastillas».`, `«MDMA. Comprimidos».`), { req: function (s) { return !story.hasStash('mdma'); }, next: 'shape', free: true }),
          K('bold', t(`"Coke."`, `«Coca».`, `«Coca».`), { req: function (s) { return !story.hasStash('coke'); }, call: 'buy_coke', next: null, free: true }),
          K('bold', t(`"K."`, `«K».`, `«K».`), { req: function (s) { return !story.hasStash('ket'); }, call: 'buy_ket', next: null, free: true }),
          K('ask', t(`"How do I know it's what you say?"`, `«¿Cómo sé que es lo que dices?»`, `«Como eu sei que é o que você diz?»`), { next: 'honest' }),
          K('chill', t(`"Just waiting for the toilet."`, `«Solo espero el baño».`, `«Só esperando o banheiro».`), { free: true, next: null })
        ]
      },
      shape: {
        text: t(`"Pills. I've got a few shapes in the lining. Pick one. It's only a shape; I say that about everything, and it's true about shapes."`, `«Pastillas. Tengo unas cuantas formas en el forro. Elige una. Es solo una forma; lo digo de todo, y de las formas es verdad».`, `«Comprimidos. Tenho algumas formas no forro. Escolhe uma. É só uma forma; eu falo isso de tudo, e de formas é verdade».`),
        choices: Object.keys(SHAPES).map(function (k) { return K('bold', SHAPES[k], { call: 'ps_' + k, next: 'imprint', free: true }); }).concat([K('chill', t(`"Never mind."`, `«Olvídalo».`, `«Deixa pra lá».`), { next: 'a', free: true })])
      },
      imprint: {
        text: t(`"And the stamp. Everyone wants a stamp. A crown, a heart, a bolt, a skull, a smiley, an Æ for the nerds. The stamp tells a story. The story is not a lab report. Don't tell Isi I said that."`, `«Y el sello. Todos quieren un sello. Una corona, un corazón, un rayo, una calavera, una carita, una Æ para los nerds. El sello cuenta una historia. La historia no es un análisis de laboratorio. No le digas a Isi que dije eso».`, `«E o carimbo. Todo mundo quer um carimbo. Uma coroa, um coração, um raio, uma caveira, uma carinha, um Æ pros nerds. O carimbo conta uma história. A história não é um laudo de laboratório. Não conta pra Isi que eu disse isso».`),
        choices: Object.keys(IMPRINTS).map(function (k) { return K('bold', t(`${IMPRINTS[k].g}  ${IMPRINTS[k].n.en}`, `${IMPRINTS[k].g}  ${IMPRINTS[k].n.es}`, `${IMPRINTS[k].g}  ${IMPRINTS[k].n.pt}`), { call: 'pi_' + k, next: null, free: true }); })
      },
      honest: {
        text: t(`"You don't." He says it with real warmth. "Nobody does. Not me. I buy from a guy who buys from a guy. That's why there's a table in the quiet room with a woman who will tell you what it looks like, for free, no names. Go see her before you put anything in you. I mean it. I make money and I like being alive."`, `«No sabes». Lo dice con calidez de verdad. «Nadie sabe. Ni yo. Le compro a un tipo que le compra a un tipo. Por eso hay una mesa en la sala tranquila con una mujer que te dice a qué se parece, gratis, sin nombres. Ve con ella antes de ponerte nada. En serio. Yo gano plata y me gusta estar vivo».`, `«Não sabe». Ele fala com calor de verdade. «Ninguém sabe. Nem eu. Compro de um cara que compra de um cara. Por isso tem uma mesa na sala de calma com uma mulher que te diz com o que se parece, de graça, sem nomes. Vai lá antes de colocar qualquer coisa em você. Falo sério. Eu ganho dinheiro e gosto de estar vivo».`),
        do: { soc: 1, flag: 'tico_honest' }, next: 'a'
      }
    }
  };
  function addToStash(entry, label) {
    L.dealerHeat();
    stash().push(entry);
    EM.state.flags['bought_' + entry.kind] = true;
    U.toast({ icon: 'question', text: label, kind: 'info', ms: 6500 });
  }
  function buy(kind) {
    return function () {
      const N = KIND[kind], cap = function (x) { return x.charAt(0) + x.slice(1).toLowerCase(); };
      addToStash({ kind: kind, real: resolve(kind), tested: false, fake: ['faint', 'nothing', 'glitch'][Math.floor(Math.random() * 3)] },
        t(`A small folded paper changes hands with no ceremony. ${cap(N.en)} (probably). It is in your pocket now. MENU → STATUS to take it, or ISI's table to find out what it looks like.`, `Un papelito doblado cambia de manos sin ceremonia. ${cap(N.es)} (probablemente). Ya está en tu bolsillo. MENÚ → ESTADO para tomarla, o la mesa de ISI para saber a qué se parece.`, `Um papelzinho dobrado troca de mãos sem cerimônia. ${cap(N.pt)} (provavelmente). Já está no seu bolso. MENU → ESTADO pra tomar, ou a mesa da ISI pra saber com o que se parece.`));
    };
  }
  KINDS.filter(function (k) { return k !== 'mdma'; }).forEach(function (k) { S['buy_' + k] = buy(k); });
  /* the pill: you pick the shape, then the stamp */
  Object.keys(SHAPES).forEach(function (k) { S['ps_' + k] = function () { EM.state.pendingPill = { shape: k }; }; });
  Object.keys(IMPRINTS).forEach(function (k) {
    S['pi_' + k] = function () {
      const s = EM.state, p = s.pendingPill || { shape: 'round' }; s.pendingPill = null;
      const real = resolve('mdma', k);
      addToStash({ kind: 'mdma', shape: p.shape, imprint: k, real: real, strong: k === 'crown' && (real === 'mdma' || real === 'mix'), tested: false, fake: ['faint', 'nothing', 'glitch'][Math.floor(Math.random() * 3)] },
        t(`A small, ${SHAPES[p.shape].en.toLowerCase()} pill, stamped ${IMPRINTS[k].g} (${IMPRINTS[k].n.en.toLowerCase()}), is in your pocket now. MENU → STATUS to take it, or ISI's table to find out what is really in it.`, `Una pastilla chica ${SHAPES[p.shape].es.toLowerCase()}, con el sello ${IMPRINTS[k].g} (${IMPRINTS[k].n.es.toLowerCase()}), ya está en tu bolsillo. MENÚ → ESTADO para tomarla, o la mesa de ISI para saber qué tiene de verdad.`, `Um comprimido pequeno ${SHAPES[p.shape].pt.toLowerCase()}, com o carimbo ${IMPRINTS[k].g} (${IMPRINTS[k].n.pt.toLowerCase()}), já está no seu bolso. MENU → ESTADO pra tomar, ou a mesa da ISI pra saber o que tem de verdade.`));
    };
  });
  Z.restrooms.npc({ id: 'tico', x: 11.5, y: 10.5, dlg: 'tico', dir: 'r', reach: 16 });

  /* ------------------------------------------------------------ taking what you carry (MENU > STATUS) */
  const FAKE_TOAST = {
    faint: t('Something is wrong. The edges of the room are leaving.', 'Algo anda mal. Los bordes del cuarto se están yendo.', 'Algo está errado. As bordas da sala estão indo embora.'),
    nothing: t('Nothing happens. Nothing keeps happening. You paid for a very expensive mint.', 'No pasa nada. Nada sigue pasando. Pagaste una menta carísima.', 'Nada acontece. Nada continua acontecendo. Você pagou por uma bala de menta caríssima.'),
    glitch: t('Static. Everything arrives half a second late and a little wrong.', 'Estática. Todo llega medio segundo tarde y un poco mal.', 'Estática. Tudo chega meio segundo atrasado e um pouco errado.')
  };
  const LEV = t('Something cheap is in there. Your gums sting and a flu-like ache starts behind your eyes.', 'Hay algo barato ahí adentro. Te arden las encías y un malestar como de gripe empieza detrás de los ojos.', 'Tem algo barato aí dentro. Suas gengivas ardem e um mal-estar de gripe começa atrás dos olhos.');
  const AMPH = t('Your heart is going too fast and it does not slow down. That was a bad mix.', 'Tu corazón va demasiado rápido y no baja. Fue una mala mezcla.', 'Seu coração tá rápido demais e não desacelera. Foi uma mistura ruim.');
  const NOTHING = t('Nothing. A bitter nothing. You paid for dust.', 'Nada. Una nada amarga. Pagaste por polvo.', 'Nada. Um nada amargo. Você pagou por pó.');
  const MDA_TOAST = t('Slower to arrive than you expected. A warm hum, and it is going to last longer than you planned.', 'Tarda más en llegar de lo que esperabas. Un zumbido tibio, y va a durar más de lo que planeaste.', 'Demora mais pra chegar do que você esperava. Um zumbido morno, e vai durar mais do que você planejou.');
  /* what a composition does to you. told: what you thought it was ('mdma' | 'coke' | 'ket') */
  story.takeComp = function (comp, told, fake) {
    const s = EM.state;
    if (comp === 'coke' || comp === 'coke_lev' || comp === 'coke_amph' || comp === 'ket' || comp === 'ket_lev') {
      story.applyPowder(comp.indexOf('coke') === 0 ? 'coke' : 'ket', told);
      if (comp === 'coke_lev' || comp === 'ket_lev') { L.apply({ hp: -3, weird: 3, flag: 'took_levamisole' }); U.toast({ icon: 'cross', text: LEV, kind: 'bad', ms: 5500 }); }
      if (comp === 'coke_amph') { L.apply({ fx: 'meth', hp: -6, weird: 8, flag: ['took_amph', 'wired'] }); U.toast({ icon: 'skull', text: AMPH, kind: 'bad', ms: 6000 }); }
      return;
    }
    if (comp === 'nothing') { L.apply({ fun: -2, weird: 1, flag: 'drug_taken' }); U.toast({ text: NOTHING, kind: 'info', ms: 4500 }); return; }
    if (comp === 'mdma') {
      L.apply({ fx: 'mdma', fun: 10, hp: -3, weird: 10, flag: ['rolling', 'drug_taken'] });
      U.toast({ icon: 'heart', text: t('Twenty minutes later: a warm tide. Everyone\'s hands look kind.', 'Veinte minutos después: una marea tibia. Las manos de todos se ven amables.', 'Vinte minutos depois: uma maré morna. As mãos de todo mundo parecem gentis.'), kind: 'good', ms: 5000 });
    } else if (comp === 'mix') {
      L.apply({ fx: ['mdma', 'meth'], fun: 8, hp: -6, weird: 20, flag: ['rolling', 'wired', 'drug_taken'] });
      U.toast({ icon: 'spark', text: t('A warm wave with a wire running through it. Your jaw and your pulse have opinions.', 'Una ola tibia con un cable adentro. Tu mandíbula y tu pulso tienen opiniones.', 'Uma onda morna com um fio dentro. Sua mandíbula e seu pulso têm opiniões.'), kind: 'bad', ms: 5000 });
    } else if (comp === 'mda') {
      L.apply({ fx: 'mdma', fun: 9, hp: -4, weird: 14, flag: ['rolling', 'drug_taken', 'took_mda'] });
      s.fx.mdma = Math.round((s.fx.mdma || 240) * 1.5);
      U.toast({ icon: 'heart', text: MDA_TOAST, kind: 'info', ms: 5500 });
    } else {
      /* unknown substance */
      s.impaired = true;
      fake = fake || 'nothing';
      if (fake === 'faint') { s.pendingFaint = s.time + 10 + Math.floor(Math.random() * 6); L.apply({ weird: 6, flag: 'drug_taken' }); }
      else if (fake === 'nothing') L.apply({ fun: -3, weird: 2, flag: 'drug_taken' });
      else L.apply({ fx: 'glitch', weird: 8, hp: -4, flag: 'drug_taken' });
      U.toast({ icon: fake === 'faint' ? 'skull' : 'eyes', text: FAKE_TOAST[fake], kind: fake === 'nothing' ? 'info' : 'bad', ms: 5500 });
    }
  };
  story.takeStash = function (i) {
    const s = EM.state, e = stash()[i]; if (!e) return;
    stash().splice(i, 1);
    s.flags.took_stash = true;
    let comp = e.real;
    /* untested cocaine is ketamine about one time in five; testing it first removes that doubt */
    if (e.kind === 'coke' && !e.tested && Math.random() < 0.2) comp = EM.drugs.rollKetVariant();
    if (e.strong && (comp === 'mdma' || comp === 'mix')) { L.apply({ fun: 4, weird: 4, hp: -2 }); U.toast({ text: t('A strong one. The room tilts brighter than you planned.', 'Una fuerte. El cuarto se inclina más brillante de lo que planeaste.', 'Uma forte. A sala se inclina mais brilhante do que você planejou.'), kind: 'info', ms: 4500 }); }
    story.takeComp(comp, e.kind, e.fake);
  };
  /* a tiny drawing of the pill you picked */
  function pillIcon(shape, imp) {
    const c = document.createElement('canvas'); c.width = 28; c.height = 20; c.className = 'pillico';
    const g = c.getContext('2d');
    g.fillStyle = '#EDEDF5'; g.strokeStyle = '#0A0A0A';
    if (shape === 'round') { g.beginPath(); g.arc(14, 10, 8, 0, 7); g.fill(); }
    else if (shape === 'square') g.fillRect(6, 3, 16, 14);
    else if (shape === 'diamond') { g.beginPath(); g.moveTo(14, 1); g.lineTo(24, 10); g.lineTo(14, 19); g.lineTo(4, 10); g.closePath(); g.fill(); }
    else { g.font = '22px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(shape === 'heart' ? '♥' : '★', 14, 11); }
    g.fillStyle = '#0A0A0A'; g.font = '10px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(IMPRINTS[imp].g, 14, 11);
    return c;
  }
  EM.menuExtras = EM.menuExtras || [];
  EM.menuItems = EM.menuItems || [];
  EM.menuItems.push(function (box, s) {
    const list = stash(); if (!list.length) return;
    const head = U.el('p', 'mnote', EM.tr(t('IN YOUR POCKETS:', 'EN TUS BOLSILLOS:', 'NOS SEUS BOLSOS:')));
    box.appendChild(head);
    list.forEach(function (e, i) {
      const row = U.el('div', 'stashrow');
      const label = EM.tr(KIND[e.kind]) + (e.imprint ? ' (' + EM.tr(SHAPES[e.shape]).toLowerCase() + ', ' + IMPRINTS[e.imprint].g + ')' : '') + (e.tested ? ' — ' + EM.tr(t('TESTED: looks like', 'PROBADO: se parece a', 'TESTADO: parece')) + ' ' + EM.tr(realName(e.real)) : ' — ' + EM.tr(t('untested', 'sin probar', 'sem testar')));
      if (e.imprint) row.appendChild(pillIcon(e.shape, e.imprint));
      row.appendChild(U.el('span', 'stl', label));
      const b = U.el('button', '', EM.tr(t('TAKE IT', 'TOMARLA', 'TOMAR')));
      b.type = 'button';
      b.addEventListener('click', function () { story.takeStash(i); U.closeMenu(); });
      row.appendChild(b);
      box.appendChild(row);
    });
  });
  document.head && (function () {
    const st = document.createElement('style'); st.textContent = '.stashrow { display: flex; gap: 8px; align-items: center; justify-content: space-between; border: 1px solid var(--fg); padding: 4px 8px; margin: 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; } .stashrow button { min-height: 30px; padding: 2px 10px; }';
    document.head.appendChild(st);
  })();

  /* ------------------------------------------------------------ ISI: the table, tested */
  function testKind(kind) {
    return function () {
      const s = EM.state;
      const e = stash().find(function (x) { return x.kind === kind && !x.tested; });
      if (!e) return;
      e.tested = true; s.testedAny = true;
      s.stashResult = e;
      U.reagent(function () { U.startDialogue('isi_result', { npc: 'nuri' }); }, EM.drugs.tests(e.real));
    };
  }
  KINDS.forEach(function (k) { S['test_' + k] = testKind(k); });
  D.isi_result = {
    forced: true, who: 'nuri', role: t('CHECKING TABLE', 'MESA DE CHEQUEO', 'MESA DE CHECAGEM'), start: 'a', nodes: {
      a: {
        text: function (s) {
          const e = s.stashResult || { kind: 'mdma', real: 'mdma' };
          return EM.drugs.pages(e.real, e.kind, e.imprint);
        },
        choices: [
          K('chill', t(`"Thank you. I'll think about it."`, `«Gracias. Lo voy a pensar».`, `«Valeu. Vou pensar».`), { do: { soc: 2, care: 1 }, next: null }),
          K('care', t(`"Bin it."`, `«A la basura».`, `«Pra lixeira».`), { req: function (s) { return !!s.stashResult; }, call: 'isi_bin', do: { care: 1, soc: 2 }, next: null })
        ]
      }
    }
  };
  S.isi_bin = function () {
    const s = EM.state, list = stash();
    const i = list.indexOf(s.stashResult);
    if (i >= 0) list.splice(i, 1);
    s.flags.binned_stash = true;
    U.toast({ icon: 'cross', text: t('Into the bin it goes. Isi says "thank you" like you gave her something.', 'Al bote va. Isi dice «gracias» como si le hubieras dado algo.', 'Vai pra lixeira. A Isi diz «obrigada» como se você tivesse dado algo a ela.'), kind: 'good' });
  };
  /* four tests, one per kind, on the table */
  const isiA = D.nuri.nodes.a.choices;
  KINDS.forEach(function (k) {
    const N = KIND[k], lc = function (x) { return x.toLowerCase(); };
    isiA.unshift(K('honest', t(`"Can you test the ${lc(N.en)} I bought?"`, `«¿Puedes probar la ${lc(N.es)} que compré?»`, `«Você pode testar a ${lc(N.pt)} que comprei?»`), { req: function () { return story.hasStash(k, true); }, call: 'test_' + k, next: null, free: true }));
  });
  /* the person: kind, fond of seafood and tattoos, and let down by the setlist */
  isiA.push(K('chill', t(`"What do you like, when you're not here?"`, `«¿Qué te gusta cuando no estás aquí?»`, `«Do que você gosta quando não está aqui?»`), { next: 'chat' }));
  D.nuri.nodes.chat = {
    text: t(`Isi lights up in a way that has nothing to do with work. "Seafood. I would kill for a plate of grilled octopus right now, with lemon, with the little crunchy edges. And tattoos. Look." She turns her forearm: a tiny octopus holding a tinier cross. "Sunday's the next one. Also, and I'll say it at the quiet table because nobody else will, the DJ does not play enough dubstep. I've put in a request. The request is on a napkin."`, `Isi se ilumina de una forma que no tiene nada que ver con el trabajo. «Mariscos. Mataría por un plato de pulpo a la parrilla ahora mismo, con limón, con los bordes crocantes. Y tatuajes. Mira». Gira el antebrazo: un pulpito chiquito sosteniendo una cruz todavía más chiquita. «El próximo es el domingo. Además, y lo digo en la mesa tranquila porque nadie más lo va a decir, el DJ no pone suficiente dubstep. Ya hice un pedido. El pedido está en una servilleta».`, `A Isi se ilumina de um jeito que não tem nada a ver com trabalho. «Frutos do mar. Eu mataria por um prato de polvo grelhado agora, com limão, com as pontinhas crocantes. E tatuagem. Olha». Ela vira o antebraço: um polvinho minúsculo segurando uma cruz menorzinha ainda. «A próxima é domingo. Além disso, e eu falo na mesa de calma porque ninguém mais vai falar, a DJ não toca dubstep suficiente. Já fiz um pedido. O pedido está num guardanapo».`),
    do: { soc: 3, fun: 2, flag: 'isi_chatted' },
    next: 'chat2'
  };
  D.nuri.nodes.chat2 = {
    text: t(`She hands you a marker. "Want one? Not a real one. A little octopus, on your arm, that will be gone by Tuesday. It's the only tattoo I'm sure of."`, `Te pasa un marcador. «¿Quieres uno? No uno de verdad. Un pulpito en el brazo que se te va el martes. Es el único tatuaje del que estoy segura».`, `Ela te entrega uma caneta. «Quer um? Não um de verdade. Um polvinho no braço que sai na terça. É a única tatuagem de que tenho certeza».`),
    choices: [
      K('bold', t(`"Yes. Draw."`, `«Sí. Dibuja».`, `«Sim. Desenha».`), { do: { fun: 5, soc: 3, flag: 'isi_ink' }, next: null, react: t(`A small octopus, eight careful lines, one eye. "He's called Gerard. Look after him." It is, for the record, extremely good. Your arm will never be the same until Tuesday.`, `Un pulpito, ocho líneas cuidadosas, un ojo. «Se llama Gerardo. Cuídalo». Es, para que conste, buenísimo. Tu brazo no volverá a ser el mismo hasta el martes.`, `Um polvinho, oito linhas cuidadosas, um olho. «Ele se chama Gerardo. Cuida dele». É, pra constar, ótimo. Seu braço não vai ser o mesmo até terça.`) }),
      K('chill', t(`"Not tonight. But I love the octopus."`, `«Esta noche no. Pero amo el pulpo».`, `«Hoje não. Mas amo o polvo».`), { do: { soc: 2 }, next: null })
    ]
  };
  /* the same table after the friends' pill has been checked */
  if (D.nuri_after) {
    KINDS.slice().reverse().forEach(function (k, i) { D.nuri_after.nodes.a.choices.unshift(isiA[KINDS.length - 1 - i]); });
    D.nuri_after.nodes.a.choices.push(isiA[isiA.length - 1]);
    D.nuri_after.nodes.chat = D.nuri.nodes.chat; D.nuri_after.nodes.chat2 = D.nuri.nodes.chat2;
  }
  /* her complaint grows each time you come back (counted across nights) */
  (function () {
    const n = D.nuri.nodes.a, base = n.text;
    const LINES = [
      t(`"Still no dubstep. I started a petition. It has one signature, mine, twice."`, `«Todavía no hay dubstep. Empecé una petición. Tiene una firma, la mía, dos veces».`, `«Ainda sem dubstep. Comecei um abaixo-assinado. Tem uma assinatura, a minha, duas vezes».`),
      t(`"Night after night, and the DJ says 'we'll see'. I know what 'we'll see' means. It means no. It means a hallway at dawn."`, `«Noche tras noche, y el DJ dice “ya veremos”. Sé lo que significa “ya veremos”. Significa no. Significa un pasillo al amanecer».`, `«Noite após noite, e a DJ diz “a gente vê”. Eu sei o que “a gente vê” significa. Significa não. Significa um corredor ao amanhecer».`),
      t(`"I've started humming wobbles under my breath at the table. The patients are calmer. This is unrelated."`, `«Empecé a tararear wobbles entre dientes en la mesa. Los pacientes están más tranquilos. Esto no tiene relación».`, `«Comecei a cantarolar wobbles entre os dentes na mesa. Os pacientes estão mais calmos. Isso não tem relação».`),
      t(`"A wobble at 3 a.m. would heal this whole venue. I'm saying it as a medical professional. (I'm not.)"`, `«Un wobble a las 3 de la mañana sanaría todo este local. Lo digo como profesional de la salud. (No lo soy.)»`, `«Um wobble às 3 da manhã curaria este local inteiro. Falo como profissional de saúde. (Não sou.)»`)
    ];
    n.text = function (s) {
      const lvl = (s.gags && s.gags.isi) || 0;
      const b = typeof base === 'function' ? [].concat(base(s)) : [].concat(base);
      return lvl >= 2 ? b.concat([LINES[Math.min(lvl - 2, LINES.length - 1)]]) : b;
    };
    n.do = Object.assign({}, n.do, { gag: 'isi' });
  })();
  /* direct offers (the door, the dealers in the corners): no table to test them on, so about one time in five a "cocaine" is ketamine */
  S.powder_coke = function () { L.dealerHeat(); story.takeComp(Math.random() < 0.2 ? EM.drugs.rollKetVariant() : EM.drugs.rollPowder('coke'), 'coke'); };
  S.powder_ket = function () { L.dealerHeat(); story.takeComp(EM.drugs.rollPowder('ket'), 'ket'); };
  /* her morning messages */
  if (story.morningRefs) {
    story.morningRefs.push({ id: 'isi_ink', who: '#ISI', ok: function (s) { return !!s.flags.isi_ink; }, t: t(`did gerard (the octopus) survive the night? the ink goes by tuesday. the seafood is forever. grilled octopus, two blocks from the club, saturday? my treat.`, `¿sobrevivió Gerardo (el pulpo) a la noche? la tinta se va el martes. los mariscos son para siempre. pulpo a la parrilla, a dos cuadras del club, ¿el sábado? va por mi cuenta.`, `o Gerardo (o polvo) sobreviveu à noite? a tinta sai na terça. o frutos do mar é pra sempre. polvo grelhado, a duas quadras do club, sábado? é por minha conta.`) });
    story.morningRefs.push({ id: 'isi_dub', who: '#ISI', ok: function (s) { return !!s.flags.isi_chatted && !s.flags.isi_ink; }, t: t(`one thing about last night: the dj did not play enough dubstep. i'm not mad. i'm *noting* it. also drink water.`, `una cosa de anoche: el dj no puso suficiente dubstep. no estoy enojada. lo estoy *anotando*. y toma agua.`, `uma coisa da noite passada: a dj não tocou dubstep suficiente. não estou brava. estou *anotando*. e bebe água.`) });
  }
})();

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
    mdma: t('MDMA', 'MDMA', 'MDMA'), meth: t('METH', 'METANFETAMINA', 'METANFETAMINA'),
    coke: t('COCAINE', 'COCAÍNA', 'COCAÍNA'), ket: t('KETAMINE', 'KETAMINA', 'CETAMINA')
  };
  const KINDS = ['mdma', 'meth', 'coke', 'ket'];
  const REAL = { mix: t('MDMA WITH A STIMULANT', 'MDMA CON UN ESTIMULANTE', 'MDMA COM UM ESTIMULANTE'), fake: t('NOT WHAT IT SAYS', 'NO ES LO QUE DICE', 'NÃO É O QUE DIZ') };
  function realName(r) { return KIND[r] || REAL[r]; }

  /* ------------------------------------------------------------ what a purchase really is */
  function resolve(told) {
    const r = Math.random();
    if (told === 'mdma') return r < 0.7 ? 'mdma' : (r < 0.85 ? 'mix' : 'fake');
    if (told === 'meth') return r < 0.85 ? 'meth' : 'fake';
    if (told === 'coke') return r < 0.8 ? 'coke' : 'ket';
    return r < 0.8 ? 'ket' : 'coke';
  }
  function stash() { const s = EM.state; s.stash = s.stash || []; return s.stash; }
  story.hasStash = function (kind, untestedOnly) { return stash().some(function (e) { return e.kind === kind && (!untestedOnly || !e.tested); }); };

  /* ------------------------------------------------------------ TICO, in the queue */
  EM.CAST.tico = { name: 'TICO', look: { skin: 1, hair: 5, hc: 9, expr: 2, top: 9, tc: 3, bottom: 1, bc: 4, acc: 5, wide: false } };
  D.tico = {
    who: 'tico', role: t('IN THE QUEUE', 'EN LA FILA', 'NA FILA'), start: 'a', nodes: {
      a: {
        text: t(`The person at the back of the queue has a very big jacket with a lot of small pockets. "Psst. Don't look at the pockets. Look at me. I'm a menu, standing up. Say a word and I'll pretend it was your idea."`, `La persona del final de la fila lleva una chaqueta enorme con muchísimos bolsillitos. «Psst. No mires los bolsillos. Mírame a mí. Soy un menú de pie. Di una palabra y voy a fingir que fue idea tuya».`, `A pessoa no fim da fila usa uma jaqueta enorme com muitos bolsinhos. «Psiu. Não olha os bolsos. Olha pra mim. Eu sou um cardápio em pé. Fala uma palavra e eu finjo que foi ideia sua».`),
        choices: [
          K('bold', t(`"MDMA."`, `«MDMA».`, `«MDMA».`), { req: function (s) { return !story.hasStash('mdma'); }, call: 'buy_mdma', next: null, free: true }),
          K('bold', t(`"Speed. Meth."`, `«Speed. Metanfetamina».`, `«Speed. Metanfetamina».`), { req: function (s) { return !story.hasStash('meth'); }, call: 'buy_meth', next: null, free: true }),
          K('bold', t(`"Coke."`, `«Coca».`, `«Coca».`), { req: function (s) { return !story.hasStash('coke'); }, call: 'buy_coke', next: null, free: true }),
          K('bold', t(`"K."`, `«K».`, `«K».`), { req: function (s) { return !story.hasStash('ket'); }, call: 'buy_ket', next: null, free: true }),
          K('ask', t(`"How do I know it's what you say?"`, `«¿Cómo sé que es lo que dices?»`, `«Como eu sei que é o que você diz?»`), { next: 'honest' }),
          K('chill', t(`"Just waiting for the toilet."`, `«Solo espero el baño».`, `«Só esperando o banheiro».`), { free: true, next: null })
        ]
      },
      honest: {
        text: t(`"You don't." He says it with real warmth. "Nobody does. Not me. I buy from a guy who buys from a guy. That's why there's a table in the quiet room with a woman who will tell you what it looks like, for free, no names. Go see her before you put anything in you. I mean it. I make money and I like being alive."`, `«No sabes». Lo dice con calidez de verdad. «Nadie sabe. Ni yo. Le compro a un tipo que le compra a un tipo. Por eso hay una mesa en la sala tranquila con una mujer que te dice a qué se parece, gratis, sin nombres. Ve con ella antes de ponerte nada. En serio. Yo gano plata y me gusta estar vivo».`, `«Não sabe». Ele fala com calor de verdade. «Ninguém sabe. Nem eu. Compro de um cara que compra de um cara. Por isso tem uma mesa na sala de calma com uma mulher que te diz com o que se parece, de graça, sem nomes. Vai lá antes de colocar qualquer coisa em você. Falo sério. Eu ganho dinheiro e gosto de estar vivo».`),
        do: { soc: 1, flag: 'tico_honest' }, next: 'a'
      }
    }
  };
  function buy(kind) {
    return function () {
      const s = EM.state, list = stash();
      L.dealerHeat();
      list.push({ kind: kind, real: resolve(kind), tested: false, fake: ['faint', 'nothing', 'glitch'][Math.floor(Math.random() * 3)] });
      s.flags['bought_' + kind] = true;
      const N = KIND[kind], cap = function (x) { return x.charAt(0) + x.slice(1).toLowerCase(); };
      U.toast({ icon: 'question', text: t(`A small folded paper changes hands with no ceremony. ${cap(N.en)} (probably). It is in your pocket now. MENU → STATUS to take it, or ISI's table to find out what it looks like.`, `Un papelito doblado cambia de manos sin ceremonia. ${cap(N.es)} (probablemente). Ya está en tu bolsillo. MENÚ → ESTADO para tomarla, o la mesa de ISI para saber a qué se parece.`, `Um papelzinho dobrado troca de mãos sem cerimônia. ${cap(N.pt)} (provavelmente). Já está no seu bolso. MENU → ESTADO pra tomar, ou a mesa da ISI pra saber com o que se parece.`), kind: 'info', ms: 6500 });
    };
  }
  KINDS.forEach(function (k) { S['buy_' + k] = buy(k); });
  Z.restrooms.npc({ id: 'tico', x: 11.5, y: 10.5, dlg: 'tico', dir: 'r', reach: 16 });

  /* ------------------------------------------------------------ taking what you carry (MENU > STATUS) */
  const FAKE_TOAST = {
    faint: t('Something is wrong. The edges of the room are leaving.', 'Algo anda mal. Los bordes del cuarto se están yendo.', 'Algo está errado. As bordas da sala estão indo embora.'),
    nothing: t('Nothing happens. Nothing keeps happening. You paid for a very expensive mint.', 'No pasa nada. Nada sigue pasando. Pagaste una menta carísima.', 'Nada acontece. Nada continua acontecendo. Você pagou por uma bala de menta caríssima.'),
    glitch: t('Static. Everything arrives half a second late and a little wrong.', 'Estática. Todo llega medio segundo tarde y un poco mal.', 'Estática. Tudo chega meio segundo atrasado e um pouco errado.')
  };
  story.takeStash = function (i) {
    const s = EM.state, e = stash()[i]; if (!e) return;
    stash().splice(i, 1);
    s.flags.took_stash = true;
    if (e.real === 'coke' || e.real === 'ket') { story.applyPowder(e.real, e.kind); return; }
    if (e.real === 'mdma') {
      L.apply({ fx: 'mdma', fun: 10, hp: -3, weird: 10, flag: ['rolling', 'drug_taken'] });
      U.toast({ icon: 'heart', text: t('Twenty minutes later: a warm tide. Everyone\'s hands look kind.', 'Veinte minutos después: una marea tibia. Las manos de todos se ven amables.', 'Vinte minutos depois: uma maré morna. As mãos de todo mundo parecem gentis.'), kind: 'good', ms: 5000 });
    } else if (e.real === 'mix') {
      L.apply({ fx: ['mdma', 'meth'], fun: 8, hp: -6, weird: 20, flag: ['rolling', 'wired', 'drug_taken'] });
      U.toast({ icon: 'spark', text: t('A warm wave with a wire running through it. Your jaw and your pulse have opinions.', 'Una ola tibia con un cable adentro. Tu mandíbula y tu pulso tienen opiniones.', 'Uma onda morna com um fio dentro. Sua mandíbula e seu pulso têm opiniões.'), kind: 'bad', ms: 5000 });
    } else if (e.real === 'meth') {
      L.apply({ fx: 'meth', fun: 9, hp: -5, weird: 8, flag: ['wired', 'drug_taken'] });
      U.toast({ icon: 'spark', text: t('Everything gets a little brighter and a lot faster. You have a great many opinions, all of them urgent.', 'Todo se vuelve un poco más brillante y mucho más rápido. Tienes muchas opiniones, todas urgentes.', 'Tudo fica um pouco mais brilhante e muito mais rápido. Você tem muitas opiniões, todas urgentes.'), kind: 'info', ms: 5000 });
    } else {
      /* fake */
      s.impaired = true;
      if (e.fake === 'faint') { s.pendingFaint = s.time + 10 + Math.floor(Math.random() * 6); L.apply({ weird: 6, flag: 'drug_taken' }); }
      else if (e.fake === 'nothing') L.apply({ fun: -3, weird: 2, flag: 'drug_taken' });
      else L.apply({ fx: 'glitch', weird: 8, hp: -4, flag: 'drug_taken' });
      U.toast({ icon: e.fake === 'faint' ? 'skull' : 'eyes', text: FAKE_TOAST[e.fake], kind: e.fake === 'nothing' ? 'info' : 'bad', ms: 5500 });
    }
  };
  EM.menuExtras = EM.menuExtras || [];
  EM.menuExtras.push(function (box, s) {
    const list = stash(); if (!list.length) return;
    const head = U.el('p', 'mnote', EM.tr(t('IN YOUR POCKETS:', 'EN TUS BOLSILLOS:', 'NOS SEUS BOLSOS:')));
    box.appendChild(head);
    list.forEach(function (e, i) {
      const row = U.el('div', 'stashrow');
      const label = EM.tr(KIND[e.kind]) + (e.tested ? ' — ' + EM.tr(t('TESTED: looks like', 'PROBADO: se parece a', 'TESTADO: parece')) + ' ' + EM.tr(realName(e.real)) : ' — ' + EM.tr(t('untested', 'sin probar', 'sem testar')));
      row.appendChild(U.el('span', '', label));
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
      U.reagent(function () { U.startDialogue('isi_result', { npc: 'nuri' }); });
    };
  }
  KINDS.forEach(function (k) { S['test_' + k] = testKind(k); });
  const RES = {
    mdma: t(`"It's showing what MDMA shows, and only that." She taps the card. "*As far as this table can tell.* No word on strength, none on how your body will take it. If you take it: start small, give it an hour, water not litres, nothing on top."`, `«Muestra lo que muestra el MDMA, y solo eso». Golpea la tarjeta. «*Hasta donde esta mesa puede saber.* Nada sobre la fuerza ni sobre cómo lo tome tu cuerpo. Si lo tomas: empieza poco, dale una hora, agua y no litros, nada encima».`, `«Mostra o que o MDMA mostra, e só isso». Ela bate no cartão. «*Até onde esta mesa consegue saber.* Nada sobre a força, nada sobre como seu corpo vai levar. Se for tomar: comece pouco, espere uma hora, água e não litros, nada por cima».`),
    mix: t(`"It's showing MDMA with something stimulant alongside it. That isn't what you were told. Mixed things are rough on a heart. If you take it: half, and sit often. Or give it to the bin, which is a perfectly good friend."`, `«Muestra MDMA con algo estimulante al lado. No es lo que te dijeron. Las mezclas son duras para un corazón. Si la tomas: la mitad, y siéntate seguido. O dásela al bote, que es muy buen amigo».`, `«Mostra MDMA com algo estimulante do lado. Não é o que te disseram. Misturas pesam no coração. Se for tomar: metade, e sente seguido. Ou entrega pra lixeira, que é uma ótima amiga».`),
    meth: t(`"A stimulant. Speed or meth: this table can't tell which, only that it's a stimulant. Your heart will notice, and so will your jaw. If you take it: water, snack, sit down every so often, and don't dance until you fall over."`, `«Un estimulante. Speed o meta: esta mesa no distingue, solo que es un estimulante. Tu corazón lo va a notar, y tu mandíbula también. Si la tomas: agua, algo de comer, siéntate de vez en cuando, y no bailes hasta caerte».`, `«Um estimulante. Speed ou meta: esta mesa não distingue, só que é um estimulante. Seu coração vai notar, e sua mandíbula também. Se for tomar: água, um lanche, sente de vez em quando e não dance até cair».`),
    coke: t(`"Cocaine, as far as the table sees. Short, bright, and hard on a heart that's already dancing. If you take it: slow down on the floor, drink water, and be careful of the person you turn into at 4 a.m."`, `«Cocaína, hasta donde ve la mesa. Corta, brillante, y dura para un corazón que ya está bailando. Si la tomas: baja el ritmo en la pista, toma agua, y cuídate de la persona en la que te conviertes a las 4».`, `«Cocaína, até onde a mesa vê. Curta, brilhante e dura pra um coração que já está dançando. Se for tomar: desacelere na pista, beba água e cuidado com a pessoa em que você vira às 4 da manhã».`),
    ket: t(`"Ketamine, as far as I can see. It can drop you to the floor within minutes, sometimes before you feel it. Sit first. Never alone. Never near stairs. If you do take it: tell a person where you'll be."`, `«Ketamina, hasta donde veo. Te puede dejar en el piso en minutos, a veces antes de que lo sientas. Siéntate primero. Nunca solo. Nunca cerca de escaleras. Si la tomas: dile a alguien dónde vas a estar».`, `«Cetamina, até onde eu vejo. Ela pode te derrubar em minutos, às vezes antes de você sentir. Sente primeiro. Nunca sozinho. Nunca perto de escada. Se for tomar: diga a alguém onde você vai estar».`),
    fake: t(`"Nothing on this table looks like what it says. I can't tell you what's in there. It might do nothing. It might do something you didn't order. I'd put it in the bin, no shame, no questions."`, `«Nada en esta mesa se parece a lo que dice. No puedo decirte qué hay adentro. Puede no hacer nada. Puede hacer algo que no pediste. Yo la tiraría al bote, sin vergüenza, sin preguntas».`, `«Nada nesta mesa se parece com o que diz. Não posso dizer o que tem aí dentro. Pode não fazer nada. Pode fazer algo que você não pediu. Eu jogaria na lixeira, sem vergonha, sem perguntas».`)
  };
  D.isi_result = {
    forced: true, who: 'nuri', role: t('CHECKING TABLE', 'MESA DE CHEQUEO', 'MESA DE CHECAGEM'), start: 'a', nodes: {
      a: {
        text: function (s) {
          const e = s.stashResult || { kind: 'mdma', real: 'mdma' };
          const swapped = e.real !== e.kind && e.real !== 'mix' && e.real !== 'fake';
          const lead = e.real === 'fake' || e.real === 'mix' || swapped
            ? t(`"That's not what you were told. Bags get swapped; that's why we check."`, `«Eso no es lo que te dijeron. Las bolsitas se cambian; por eso revisamos».`, `«Isso não é o que te disseram. Saquinhos são trocados; por isso a gente checa».`)
            : t(`"It matches what you were told. That's the good news, and only that."`, `«Coincide con lo que te dijeron. Esa es la buena noticia, y solo esa».`, `«Bate com o que te disseram. Essa é a boa notícia, e só ela».`);
          return [lead, RES[e.real]];
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
    U.toast({ icon: 'cross', text: t('Into the bin it goes. Isi says "thank you" very quietly, like you gave her something.', 'Al bote va. Isi dice «gracias» muy bajito, como si le hubieras dado algo.', 'Vai pra lixeira. A Isi diz «obrigada» bem baixinho, como se você tivesse dado algo a ela.'), kind: 'good' });
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
    text: t(`Isi lights up in a way that has nothing to do with work. "Seafood. I would kill for a plate of grilled octopus right now, with lemon, with the little crunchy edges. And tattoos. Look." She turns her forearm: a tiny octopus holding a tinier cross. "Sunday's the next one. Also — and I'll say it at the quiet table because nobody else will — the DJ does not play enough dubstep. I've put in a request. The request is on a napkin."`, `Isi se ilumina de una forma que no tiene nada que ver con el trabajo. «Mariscos. Mataría por un plato de pulpo a la parrilla ahora mismo, con limón, con los bordes crocantes. Y tatuajes. Mira». Gira el antebrazo: un pulpito chiquito sosteniendo una cruz todavía más chiquita. «El próximo es el domingo. Además — y lo digo en la mesa tranquila porque nadie más lo va a decir — el DJ no pone suficiente dubstep. Ya hice un pedido. El pedido está en una servilleta».`, `A Isi se ilumina de um jeito que não tem nada a ver com trabalho. «Frutos do mar. Eu mataria por um prato de polvo grelhado agora, com limão, com as pontinhas crocantes. E tatuagem. Olha». Ela vira o antebraço: um polvinho minúsculo segurando uma cruz menorzinha ainda. «A próxima é domingo. Além disso — e eu falo na mesa de calma porque ninguém mais vai falar — a DJ não toca dubstep suficiente. Já fiz um pedido. O pedido está num guardanapo».`),
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
  /* her morning messages */
  if (story.morningRefs) {
    story.morningRefs.push({ id: 'isi_ink', who: '#ISI', ok: function (s) { return !!s.flags.isi_ink; }, t: t(`did gerard (the octopus) survive the night? the ink goes by tuesday. the seafood is forever. grilled octopus, two blocks from the club, saturday? my treat.`, `¿sobrevivió Gerardo (el pulpo) a la noche? la tinta se va el martes. los mariscos son para siempre. pulpo a la parrilla, a dos cuadras del club, ¿el sábado? va por mi cuenta.`, `o Gerardo (o polvo) sobreviveu à noite? a tinta sai na terça. o frutos do mar é pra sempre. polvo grelhado, a duas quadras do club, sábado? é por minha conta.`) });
    story.morningRefs.push({ id: 'isi_dub', who: '#ISI', ok: function (s) { return !!s.flags.isi_chatted && !s.flags.isi_ink; }, t: t(`one thing about last night: the dj did not play enough dubstep. i'm not mad. i'm *noting* it. also drink water.`, `una cosa de anoche: el dj no puso suficiente dubstep. no estoy enojada. lo estoy *anotando*. y toma agua.`, `uma coisa da noite passada: a dj não tocou dubstep suficiente. não estou brava. estou *anotando*. e bebe água.`) });
  }
})();

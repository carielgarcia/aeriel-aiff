/* EXCUSE ME — story v37: ELOY K, the glam dancer on the main floor who always keeps one step away from a musical note.
   His side quest has three parts: dance with him (the longest, most complicated dance in the game), take him a drink from the bar, and
   be offered a kiss. The kiss is an offer he waits on: yes, the cheek instead, or no (the offer stays open all night), and a no costs
   nothing. The magic is the asking. Once the quest is done (the kiss or the cheek) dancing pays more FUN and takes WEIRDNESS off:
   freestyle (+5 FUN, −3 WEIRDNESS), a partner dance (+3/+5 FUN, −2 WEIRDNESS), and a small gain every minute spent on the beat.
   Pronouns: he. Voice: serene, theatrical, generous. Not staff. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, S = EM.scripts, D = EM.DIALOGUES, E = EM.engine;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };
  const LEAVE = function () { return K('chill', t(`Leave him to the floor.`, `Dejarlo con la pista.`, `Deixar ele com a pista.`), { free: true, next: null }); };

  /* ---------------------------------------------------------------- who he is */
  EM.CAST.eloy = { name: 'ELOY K', look: { skin: 6, build: 1, expr: 3, hair: 22, hc: 3, top: 20, tc: 2, bottom: 8, bc: 6, shoes: 3, ac: 8, hat: 0, face: 4, neck: 3, ear: 3, makeup: 6, wrist: 2 } };

  /* the longest dance in the game: five rounds, the last one sixteen arrows (THE LONG WAY ROUND is eight on its own) */
  EM.MOVES.longway = { seq: 'ULDRDLUR', name: t('THE LONG WAY ROUND', 'EL LARGO CAMINO', 'O CAMINHO LONGO') };
  EM.PARTNERS.eloy = {
    tempo: 600, moves: ['wave', 'spiral', 'sway', 'shuffle', 'longway'],
    rounds: function (pick) { return [[pick()], [pick(), pick()], [pick(), pick()], [pick(), pick(), pick()], ['longway', pick(), pick()]]; },
    win: t(`Eloy K goes down on one knee, rises, and bows to the note on the floor instead of you. "No one has ever finished that. I'm not sure I have."`, `Eloy K baja sobre una rodilla, se levanta y hace una reverencia a la nota del piso en vez de a ti. «Nadie lo ha terminado nunca. No estoy seguro de haberlo hecho yo».`, `O Eloy K se ajoelha, levanta e faz uma reverência pra nota do chão em vez de pra você. «Ninguém nunca terminou isso. Não tenho certeza se eu terminei».`)
  };

  /* the blessing pays: partner dances ... */
  const pd0 = U.partnerDance;
  U.partnerDance = function (who, cb) {
    pd0.call(this, who, function (res) {
      if (cb) cb(res);
      const s = EM.state;
      if (s && !s.ended && s.flags.eloy_blessed && res && res.grade !== 'bail' && res.grade !== 'fail') {
        L.apply({ fun: res.grade === 'win' ? 5 : 3, weird: -2 });
        U.toast({ icon: 'star', kind: 'good', ms: 3800, text: t(`ELOY'S KISS: that dance paid extra.`, `EL BESO DE ELOY: ese baile rindió más.`, `O BEIJO DO ELOY: essa dança rendeu mais.`) });
      }
    });
  };
  /* ... and every minute on the beat (freestyle's own bonus is in rhythm.js) */
  const m0 = L.minute;
  L.minute = function () {
    m0.apply(this, arguments);
    const s = EM.state;
    if (s && !s.ended && s.flags.eloy_blessed && E.dancing) { L.stat('fun', 0.4); L.stat('weird', -0.35); }
  };

  /* ---------------------------------------------------------------- the side quest */
  const mk = function (s, f) { return s.flags[f] ? '✓' : '·'; };
  EM.QUESTS.sq_eloy = {
    title: t('ELOY K: THE LONG DANCE', 'ELOY K: EL BAILE LARGO', 'ELOY K: A DANÇA LONGA'),
    desc: function (s) {
      return t(`Eloy K dances by a glowing note on the main floor. ${mk(s, 'eloy_danced')} Dance the long dance with him. ${mk(s, 'eloy_drink_given')} Bring him a drink from the bar. ${mk(s, 'eloy_blessed')} Accept his offer: a kiss, or the cheek, or nothing at all. Saying no costs you nothing.`,
        `Eloy K baila junto a una nota luminosa en la pista principal. ${mk(s, 'eloy_danced')} Baila con él el baile largo. ${mk(s, 'eloy_drink_given')} Llévale un trago de la barra. ${mk(s, 'eloy_blessed')} Acepta su oferta: un beso, la mejilla, o nada. Decir que no no te cuesta nada.`,
        `O Eloy K dança junto a uma nota luminosa na pista principal. ${mk(s, 'eloy_danced')} Dance a dança longa com ele. ${mk(s, 'eloy_drink_given')} Leve uma bebida do bar pra ele. ${mk(s, 'eloy_blessed')} Aceite a oferta: um beijo, a bochecha, ou nada. Dizer não não custa nada.`);
    },
    doneText: t(`From now on dancing pays more FUN, and WEIRDNESS drops while you move. Eloy K calls it the floor's way of saying thank you.`, `Desde ahora bailar rinde más DIVERSIÓN, y la RAREZA baja mientras te mueves. Eloy K lo llama la manera que tiene la pista de dar las gracias.`, `A partir de agora dançar rende mais DIVERSÃO, e a ESTRANHEZA cai enquanto você se mexe. O Eloy K chama isso de jeito da pista de agradecer.`)
  };

  /* ---------------------------------------------------------------- the conversation */
  const N = {};
  N.st = { branch: [
    { req: F('eloy_blessed'), to: 'after' },
    { req: F('eloy_drink_given'), to: 'kiss_offer' },
    { req: function (s) { return s.quests.sq_eloy === 'active' && !!s.flags.eloy_danced; }, to: 'drink_gate' },
    { req: function (s) { return s.quests.sq_eloy === 'active'; }, to: 'need_dance' },
    { req: function () { return true; }, to: 'a' }
  ] };
  N.a = {
    text: t(`A few steps from one of the glowing notes on the floor, a man in a long pink sequinned coat dances alone and unhurried: lashes, a silk scarf, heels he has plainly agreed to. Each time the song changes he moves exactly one step, never closer to the note. He sees you and lowers his arms without losing the sway. "Love. Come into the light. Not that light. The good one."`, `A unos pasos de una de las notas luminosas del piso, un hombre con un abrigo largo rosa de lentejuelas baila solo y sin apuro: pestañas, un pañuelo de seda, tacones con los que claramente ha llegado a un acuerdo. Cada vez que cambia la canción se mueve exactamente un paso, sin acercarse nunca a la nota. Te ve y baja los brazos sin perder el balanceo. «Amor. Entra en la luz. Esa no. La buena».`, `A poucos passos de uma das notas luminosas do chão, um homem de casaco longo rosa de lantejoulas dança sozinho e sem pressa: cílios, um lenço de seda, saltos com os quais claramente fez um acordo. Cada vez que a música muda ele se mexe exatamente um passo, nunca mais perto da nota. Ele te vê e abaixa os braços sem perder o balanço. «Amor. Entra na luz. Essa não. A boa».`),
    choices: [
      K('ask', t(`"Why do you always stay a step from the note?"`, `«¿Por qué te quedas siempre a un paso de la nota?»`, `«Por que você fica sempre a um passo da nota?»`), { next: 'note' }),
      K('plan', t(`"Could you teach me to dance like that?"`, `«¿Podrías enseñarme a bailar así?»`, `«Você poderia me ensinar a dançar assim?»`), { next: 'offer' }),
      K('smooth', t(`"You're the best-dressed thing in this building."`, `«Eres lo mejor vestido de este edificio».`, `«Você é a coisa mais bem vestida desse prédio».`), { next: 'praise' }),
      LEAVE()
    ]
  };
  N.praise = { text: t(`He presses a hand to the sequins over his heart. "Thank you. It took the afternoon and a long, private argument with a zip." A beat. "Come closer, I've something to say that requires eye contact."`, `Se lleva una mano a las lentejuelas sobre el corazón. «Gracias. Me tomó la tarde y una discusión muy privada con un cierre». Una pausa. «Acércate, tengo algo que decir que requiere contacto visual».`, `Ele leva uma mão às lantejoulas sobre o coração. «Obrigado. Levou a tarde e uma discussão muito particular com um zíper». Uma pausa. «Chega mais perto, tenho uma coisa pra dizer que exige contato visual».`), once: true, do: { soc: 3, fun: 2 }, next: 'a' };
  N.note = { text: t(`"The note is where the floor says yes." He doesn't look at it. "Everyone steps on it and takes the yes for free. I've stayed one step away for years. You honour something by leaving it room to be asked."`, `«La nota es donde la pista dice que sí». No la mira. «Todos la pisan y se llevan el sí gratis. Yo llevo años a un paso de distancia. Honras algo cuando le dejas espacio para que se lo pidan».`, `«A nota é onde a pista diz sim». Ele não olha pra ela. «Todo mundo pisa e leva o sim de graça. Eu fico a um passo de distância há anos. Você honra uma coisa quando deixa espaço pra ela ser pedida».`), once: true, do: { soc: 3, care: 1, flag: 'g_eloy_open' }, next: 'a' };
  N.offer = {
    text: t(`He tilts his head and assesses you with a tailor's patience. "Teach it? That isn't how it works, love. I can give you three things, in order, and you may refuse each one. One: dance with me, all of it. It's long. Nobody finishes it the first time. Two: bring me a drink from the bar. I don't leave the floor; it's a rule I made for myself." He smiles. "Three, when you've done the first two, I'll offer you a kiss. It's an old kind of magic. Everyone who's had it dances better. That is all I know about it."`, `Inclina la cabeza y te evalúa con paciencia de sastre. «¿Enseñarlo? Así no funciona, amor. Puedo darte tres cosas, en orden, y puedes rechazar cada una. Uno: baila conmigo, todo. Es largo. Nadie lo termina la primera vez. Dos: tráeme un trago de la barra. No dejo la pista; es una regla que me puse». Sonríe. «Tres, cuando hayas hecho las dos primeras, te ofrezco un beso. Es una magia antigua. Quien lo ha recibido baila mejor. Eso es todo lo que sé».`, `Ele inclina a cabeça e avalia você com paciência de alfaiate. «Ensinar? Não funciona assim, amor. Posso te dar três coisas, em ordem, e você pode recusar cada uma. Um: dança comigo, tudo. É longa. Ninguém termina de primeira. Dois: me traz uma bebida do bar. Eu não saio da pista; é uma regra que eu mesmo fiz». Ele sorri. «Três, quando você tiver feito as duas primeiras, eu te ofereço um beijo. É uma magia antiga. Todo mundo que recebeu dança melhor. É tudo que eu sei sobre isso».`),
    choices: [
      K('yes', t(`"Yes. The dance first."`, `«Sí. Primero el baile».`, `«Sim. Primeiro a dança».`), { do: { soc: 2, flag: 'eloy_met', quest: { sq_eloy: 'active' } }, next: 'need_dance' }),
      K('chill', t(`"That's a lot. Let me think."`, `«Es mucho. Déjame pensarlo».`, `«É muita coisa. Deixa eu pensar».`), { free: true, next: null })
    ]
  };
  N.need_dance = {
    text: function (s) {
      return s.flags.eloy_has_drink
        ? t(`"I see the glass, love. It can wait: a drink is for the end of a dance. Whenever you're ready. It has a beginning, a middle, and a long, long end."`, `«Veo el vaso, amor. Puede esperar: un trago es para el final de un baile. Cuando quieras. Tiene un principio, un medio y un final larguísimo».`, `«Estou vendo o copo, amor. Pode esperar: bebida é pro fim de uma dança. Quando quiser. Tem começo, meio e um fim longuíssimo».`)
        : t(`"Whenever you're ready. The dance has a beginning, a middle, and a long, long end."`, `«Cuando quieras. El baile tiene un principio, un medio y un final larguísimo».`, `«Quando quiser. A dança tem começo, meio e um fim longuíssimo».`);
    },
    choices: [
      K('dance', t(`Dance with Eloy K.`, `Bailar con Eloy K.`, `Dançar com o Eloy K.`), { call: 'pd_eloy', free: true, next: null }),
      K('chill', t(`"Not yet."`, `«Todavía no».`, `«Ainda não».`), { free: true, next: null })
    ]
  };
  N.drink_gate = { branch: [{ req: F('eloy_has_drink'), to: 'give' }, { req: function () { return true; }, to: 'need_drink' }] };
  N.need_drink = {
    text: t(`He is still catching his breath, which on him reads as a pose. "That was the dance. Dreadful and glorious. Now the glass. The bar is on the east wall; tell Nico it's for the one by the note. He knows mine."`, `Todavía recupera el aliento, que en él parece una pose. «Eso fue el baile. Terrible y glorioso. Ahora el vaso. La barra está en la pared este; dile a Nico que es para el de la nota. Conoce el mío».`, `Ele ainda recupera o fôlego, que nele parece uma pose. «Essa foi a dança. Terrível e gloriosa. Agora o copo. O bar fica na parede leste; diz pro Nico que é pro da nota. Ele conhece o meu».`),
    choices: [K('chill', t(`"On my way."`, `«Voy».`, `«Já vou».`), { free: true, next: null })]
  };
  N.give = {
    text: t(`You hold out the glass. He takes it with both hands, closes his eyes over the lime, and drinks half of it in one long breath. "Cold. Correct. In all these years the floor has never once sent me a glass."`, `Le tiendes el vaso. Lo toma con las dos manos, cierra los ojos sobre el limón y se bebe la mitad en un largo respiro. «Frío. Correcto. En todos estos años la pista nunca me mandó un vaso».`, `Você estende o copo. Ele pega com as duas mãos, fecha os olhos sobre o limão e bebe metade num longo respiro. «Gelado. Certo. Em todos esses anos a pista nunca me mandou um copo».`),
    once: true, do: { flag: 'eloy_drink_given', unflag: 'eloy_has_drink', soc: 3, fun: 2 }, next: 'kiss_offer'
  };
  N.kiss_offer = {
    text: t(`He sets the glass on the nearest speaker with great care. "Two out of three, love. The third is yours to refuse. May I offer you a kiss?" He waits. He means the waiting.`, `Deja el vaso sobre el parlante más cercano con mucho cuidado. «Dos de tres, amor. La tercera es tuya para rechazarla. ¿Puedo ofrecerte un beso?». Espera. Le importa la espera.`, `Ele apoia o copo na caixa de som mais próxima com muito cuidado. «Dois de três, amor. A terceira é sua pra recusar. Posso te oferecer um beijo?». Ele espera. A espera é de verdade.`),
    choices: [
      K('makeout', t(`"Yes. Kiss me."`, `«Sí. Bésame».`, `«Sim. Me beija».`), { next: 'kiss' }),
      K('care', t(`"On the cheek, please."`, `«En la mejilla, por favor».`, `«Na bochecha, por favor».`), { next: 'cheek' }),
      K('chill', t(`"Not a kiss. Thank you for asking."`, `«Un beso no. Gracias por preguntar».`, `«Beijo não. Obrigado por perguntar».`), { free: true, next: 'nokiss' })
    ]
  };
  N.nokiss = { text: t(`"Thank you for saying it plainly." He picks up the glass again. "That's the whole of the magic, if I'm honest: someone asked, someone answered. The offer stays open all night. So does the floor."`, `«Gracias por decirlo con claridad». Recoge el vaso otra vez. «Esa es toda la magia, si soy honesto: alguien preguntó, alguien respondió. La oferta sigue abierta toda la noche. La pista también».`, `«Obrigado por dizer com clareza». Ele pega o copo de novo. «Essa é a magia toda, se eu for honesto: alguém perguntou, alguém respondeu. A oferta fica aberta a noite inteira. A pista também».`), next: null };
  N.kiss = {
    text: t(`Eloy K takes your face in both hands, asks once more with his eyebrows, and kisses you: unhurried, warm, lime and glitter. Something loosens behind your knees. "There. Go and dance. Don't think about your feet; they know."`, `Eloy K toma tu cara con las dos manos, pregunta una vez más con las cejas y te besa: sin prisa, cálido, lima y brillo. Algo se afloja detrás de tus rodillas. «Listo. Ve a bailar. No pienses en tus pies; ellos saben».`, `O Eloy K pega seu rosto com as duas mãos, pergunta mais uma vez com as sobrancelhas e te beija: sem pressa, quente, limão e glitter. Alguma coisa se solta atrás dos seus joelhos. «Pronto. Vai dançar. Não pensa nos pés; eles sabem».`),
    do: { fun: 12, soc: 3, weird: -1, flag: ['kiss_eloy', 'eloy_blessed', 'made_out'], quest: { sq_eloy: 'done' }, call: 'eloy_kiss' }, next: 'blessed'
  };
  N.cheek = {
    text: t(`He kisses the air an inch from your cheek, then the cheek itself, lightly, with a scented formality. "The cheek works. The magic was never in the mouth, love. It's in the asking."`, `Besa el aire a un centímetro de tu mejilla, y luego la mejilla, con ligereza y formalidad perfumada. «La mejilla funciona. La magia nunca estuvo en la boca, amor. Está en preguntar».`, `Ele beija o ar a um centímetro da sua bochecha, e depois a bochecha, de leve, com uma formalidade perfumada. «A bochecha funciona. A magia nunca esteve na boca, amor. Tá em perguntar».`),
    do: { fun: 8, soc: 3, flag: ['eloy_blessed'], quest: { sq_eloy: 'done' } }, next: 'blessed'
  };
  N.blessed = { text: t(`A small bow. "From tonight the floor will pay you more, and whatever has been weighing on you will weigh less while you move. I don't make the rules. I just stand one step from them."`, `Una pequeña reverencia. «Desde esta noche la pista te pagará más, y lo que te pesaba pesará menos mientras te mueves. Yo no hago las reglas. Solo me quedo a un paso de ellas».`, `Uma pequena reverência. «A partir de hoje a pista vai te pagar mais, e o que pesava em você vai pesar menos enquanto você se mexe. Eu não faço as regras. Só fico a um passo delas».`), once: true, do: { soc: 2 }, next: null };
  N.after = {
    text: t(`Eloy K spins once on one heel and lands exactly a step from the note. "You're dancing differently. I can see it from here."`, `Eloy K gira una vez sobre un tacón y aterriza exactamente a un paso de la nota. «Bailas distinto. Lo veo desde aquí».`, `O Eloy K gira uma vez num salto e pousa exatamente a um passo da nota. «Você tá dançando diferente. Eu vejo daqui».`),
    choices: [
      K('dance', t(`"Dance with me again."`, `«Baila conmigo otra vez».`, `«Dança comigo de novo».`), { call: 'pd_eloy', free: true, next: null }),
      K('ask', t(`"Why a step from the note?"`, `«¿Por qué a un paso de la nota?»`, `«Por que a um passo da nota?»`), { req: function (s) { return !s.flags.g_eloy_open; }, next: 'note_after' }),
      LEAVE()
    ]
  };
  N.note_after = Object.assign({}, N.note, { next: 'after' });
  D.eloy = { who: 'eloy', role: t('GLAM // ON THE FLOOR', 'GLAM // EN LA PISTA', 'GLAM // NA PISTA'), start: 'st', nodes: N };

  /* the dance and the kiss */
  S.pd_eloy = function () {
    U.partnerDance('eloy', function (res) {
      const s = EM.state;
      if (res.grade === 'win') L.apply({ fun: 12, soc: 3, flag: ['eloy_danced', 'eloy_dwin'] });
      else if (res.grade === 'partial') L.apply({ fun: 6, soc: 1, flag: 'eloy_danced' });
      else if (res.grade === 'fail') L.apply({ fun: 2, weird: 1, soc: -1 });
      else L.apply({ soc: -1 });
      L.spend(8);
      if (!s.ended) U.startDialogue('eloy', { npc: 'eloy' });
    });
  };
  S.eloy_kiss = function () {
    const s = EM.state;
    s.makeouts = (s.makeouts || 0) + 1; s.makeoutsOk = (s.makeoutsOk || 0) + 1;
    s.flagAt = s.flagAt || {}; s.flagAt.kiss_eloy = s.time;
    setTimeout(function () { if (EM.story.kissReact && !s.ended) EM.story.kissReact(true, 'eloy'); }, 2600);
    U.toast({ icon: 'star', kind: 'good', ms: 6500, text: t(`ELOY'S KISS: dancing now pays more FUN and takes WEIRDNESS off.`, `EL BESO DE ELOY: bailar ahora rinde más DIVERSIÓN y baja la RAREZA.`, `O BEIJO DO ELOY: dançar agora rende mais DIVERSÃO e reduz a ESTRANHEZA.`) });
  };

  /* the drink, from the bar */
  (function () {
    const bm = D.bar_menu; if (!bm || !Array.isArray(bm.nodes.a.choices)) return;
    const c = K('care', t(`A drink for Eloy K.`, `Un trago para Eloy K.`, `Uma bebida pro Eloy K.`), { free: true, req: function (s) { return s.quests.sq_eloy === 'active' && !s.flags.eloy_has_drink && !s.flags.eloy_drink_given; }, next: 'eloy_drink' });
    bm.nodes.a.choices.splice(Math.max(0, bm.nodes.a.choices.length - 2), 0, c);
    bm.nodes.eloy_drink = { text: t(`Nico already has the glass out: tall, pink, a lime wheel, no alcohol. "For the one dancing by the note. He's sent a runner every night for years. Tonight he's sent you." He slides it across with two fingers. "Don't spill. He'll know."`, `Nico ya tiene el vaso afuera: alto, rosa, una rodaja de limón, sin alcohol. «Para el que baila junto a la nota. Lleva años mandando a alguien cada noche. Esta noche te mandó a ti». Lo desliza con dos dedos. «No lo derrames. Se entera».`, `O Nico já tá com o copo na mão: alto, rosa, uma rodela de limão, sem álcool. «Pro que dança junto da nota. Faz anos que ele manda alguém toda noite. Hoje mandou você». Ele desliza com dois dedos. «Não derrama. Ele fica sabendo».`), do: { flag: 'eloy_has_drink', time: 3 }, next: null };
  })();

  /* what you carry, and what the kiss gave you */
  EM.menuItems = EM.menuItems || [];
  EM.menuItems.push(function (box, s) {
    const row = function (label) { const r = U.el('div', 'stashrow'); r.appendChild(U.el('span', 'stl', EM.tr(label))); box.appendChild(r); };
    if (s.flags.eloy_has_drink) row(t(`A DRINK FOR ELOY K: tall, pink, no alcohol. He is on the main floor, a step from a note.`, `UN TRAGO PARA ELOY K: alto, rosa, sin alcohol. Está en la pista principal, a un paso de una nota.`, `UMA BEBIDA PRO ELOY K: alta, rosa, sem álcool. Ele tá na pista principal, a um passo de uma nota.`));
    if (s.flags.eloy_blessed) row(t(`ELOY'S KISS: dancing pays more FUN and takes WEIRDNESS off.`, `EL BESO DE ELOY: bailar rinde más DIVERSIÓN y baja la RAREZA.`, `O BEIJO DO ELOY: dançar rende mais DIVERSÃO e reduz a ESTRANHEZA.`));
  });

  /* on the main floor, dancing a few steps from one of the glowing notes (the dance spot at 15,10) */
  (function () {
    const z = EM.zones && EM.zones.main;
    if (z) z.npc({ id: 'eloy', cast: 'eloy', x: 17.6, y: 11.6, dlg: 'eloy', dir: 'l', pose: 'dance', reach: 24 });
  })();
})();

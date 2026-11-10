/* EXCUSE ME — story v21: the night wears on. From 04:30 a few people who have been working since the evening
   sound like it. Same scenes, same choices; only the first thing you see changes, so a late visit is not
   a copy of an early one. Isi keeps her greeting (the alcohol reminder is part of it) and gains a line. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, D = EM.DIALOGUES;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const LATE = 390; /* minutes after 22:00: 04:30 */

  /* swap a node's opening text for a late one (or add a page after it) */
  function late(did, nid, lateText, add) {
    const n = D[did] && D[did].nodes[nid]; if (!n) return;
    const orig = n.text;
    n.text = function (s) {
      const o = typeof orig === 'function' ? orig(s) : orig;
      if (s.time < LATE) return o;
      return add ? [].concat(o, lateText) : lateText;
    };
  }

  late('bar_menu', 'a', t(`Nico counts the till by feel. "Tap's free. Ice isn't, anymore."`, `Nico cuenta la caja a tientas. «El agua de la llave es gratis. El hielo ya no».`, `O Nico conta o caixa no tato. «A água da torneira é de graça. O gelo acabou».`));
  const rosaLate = t(`Rosa sits on the upturned bucket, mop across her knees. "Floor's wet. I'm not getting up."`, `Rosa se sienta en el balde dado vuelta, el trapeador sobre las rodillas. «El piso está mojado. No me voy a parar».`, `A Rosa se senta no balde virado, o esfregão nos joelhos. «O chão tá molhado. Eu não vou levantar».`);
  late('rosa_wait', 'a', rosaLate);
  late('rosa_again', 'plain', rosaLate);
  late('nuri', 'a', t(`Isi is eating dry crackers. "Ask quick. That's the fortieth time I've said it tonight."`, `Isi come galletas secas. «Pregunta rápido. Es la cuadragésima vez que lo digo esta noche».`, `A Isi come bolacha seca. «Pergunta rápido. É a quadragésima vez que eu falo isso hoje».`), true);
  late('mina', 'a', t(`Mina has both palms flat on the wall. "Everything's a hiss now. Say it slower."`, `Mina tiene las dos palmas contra la pared. «Todo es un siseo ahora. Dilo más despacio».`, `A Mina está com as duas palmas na parede. «Tudo virou chiado agora. Fala mais devagar».`));
  late('kai', 'a', t(`Kai plays with one hand and rubs an ear with the other. "Requests are closed. I'm playing what my fingers remember."`, `Kai toca con una mano y se frota la oreja con la otra. «Las peticiones están cerradas. Toco lo que recuerdan mis dedos».`, `O Kai toca com uma mão e esfrega a orelha com a outra. «Os pedidos estão fechados. Toco o que meus dedos lembram».`));
})();

/* EXCUSE ME — staff are not to be trampled: a rude option at the coat check, the bar, the door and the toilets.
   Being rude to staff (EM.STAFF in logic.js) costs 30 WEIRDNESS the first time and gets you thrown out the second. */
'use strict';
(function () {
  const EM = window.EM, D = EM.DIALOGUES, T = EM.T;
  function addRude(id, node, choice) {
    const d = D[id]; if (!d || !d.nodes[node] || !d.nodes[node].choices) return;
    d.nodes[node].choices.push(Object.assign({ tone: 'push', bad: true, next: null }, choice));
  }
  addRude('luca', 'a', {
    t: T('"Coat. Now. I\'m in a hurry."', '«El abrigo. Ya. Tengo prisa».', '«O casaco. Agora. Tô com pressa.»'),
    react: T('Luca hangs your ticket back on the hook, very slowly. "Wait your turn." The whole queue heard it.', 'Luca cuelga tu ficha en el gancho, muy despacio. «Espera tu turno». Toda la fila lo escuchó.', 'Luca pendura sua ficha de volta no gancho, bem devagar. «Espera a sua vez.» A fila inteira ouviu.')
  });
  addRude('bar_menu', 'a', {
    t: T('"Hey. HEY. I\'ve been waiting forever."', '«Oye. OYE. Llevo una eternidad esperando».', '«Ei. EI. Tô esperando há uma eternidade.»'),
    react: T('Nico keeps polishing the glass without looking at you. "The tap jug is free. Manners are free too."', 'Nico sigue puliendo el vaso sin mirarte. «La jarra es gratis. Los modales también».', 'Nico continua polindo o copo sem te olhar. «A jarra é de graça. Boas maneiras também.»')
  });
  addRude('dragan', 'a', {
    t: T('"Move. I know the owner."', '«Muévete. Conozco al dueño».', '«Sai da frente. Eu conheço o dono.»'), next: 'a',
    react: T('Dragan crosses his arms. He does not move. He writes something on the clipboard, and this time it is not decorative.', 'Dragan se cruza de brazos. No se mueve. Anota algo en la carpeta, y esta vez no es decorativo.', 'Dragan cruza os braços. Não se mexe. Anota algo na prancheta, e dessa vez não é decorativo.')
  });
  addRude('rosa_wait', 'a', {
    t: T('"Could you hurry up with that mop?"', '«¿Puedes apurarte con ese trapeador?»', '«Dá pra andar logo com esse esfregão?»'),
    react: T('Rosa stops mopping. She looks at you the way she looks at a spill. "Walk around."', 'Rosa deja de trapear. Te mira como mira un derrame. «Rodea».', 'Rosa para de passar o pano. Olha pra você como olha pra uma poça. «Dá a volta.»')
  });
})();

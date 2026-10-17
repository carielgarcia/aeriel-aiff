/* EXCUSE ME — the short tutorial: six cards, shown once at the door (replay from MENU > SETTINGS). */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, U = EM.ui, E = EM.engine, S = EM.scripts;
  const el = U.el;
  const t = function (en, es, pt) { return T(en, es, pt); };

  const CARDS = [
    {
      k: t('1 / 6 — MOVE AND TALK', '1 / 6 — MOVERSE Y HABLAR', '1 / 6 — ANDAR E CONVERSAR'),
      h: t('WALK. PRESS Z.', 'CAMINA. PRESIONA Z.', 'ANDE. APERTE Z.'),
      keys: [['c', '← ↑ ↓ →', t('WALK', 'CAMINAR', 'ANDAR')], ['m', 'Z', t('TALK / USE', 'HABLAR / USAR', 'FALAR / USAR')], ['l', 'X', t('STEP AWAY', 'ALEJARSE', 'SE AFASTAR')], ['a', 'P', t('MENU', 'MENÚ', 'MENU')]],
      b: t('Stand next to a person or a glowing mark and press Z. The line under the map says what Z will do.', 'Párate junto a una persona o una marca brillante y presiona Z. La línea bajo el mapa dice qué hará Z.', 'Fique perto de uma pessoa ou de uma marca brilhante e aperte Z. A linha embaixo do mapa diz o que o Z vai fazer.')
    },
    {
      k: t('2 / 6 — CHOOSING WORDS', '2 / 6 — ELEGIR PALABRAS', '2 / 6 — ESCOLHER PALAVRAS'),
      h: t('PICK AN OPTION.', 'ELIGE UNA OPCIÓN.', 'ESCOLHA UMA OPÇÃO.'),
      keys: [['c', '↑ ↓', t('MOVE', 'MOVER', 'MOVER')], ['m', 'Z · 1–5', t('PICK', 'ELEGIR', 'ESCOLHER')], ['l', 'X', t('LEAVE', 'IRSE', 'SAIR')]],
      b: t('Each option has a tone tag: CHILL, JOKE, CARE, MAKE OUT… Talking costs SOCIAL BATTERY. Making out always starts by asking, and a no is a complete answer.', 'Cada opción tiene una etiqueta de tono: TRANQUI, BROMA, CUIDAR, BESARSE… Hablar gasta BATERÍA SOCIAL. Besarse siempre empieza preguntando, y un no es una respuesta completa.', 'Cada opção tem uma etiqueta de tom: TRANQUILO, PIADA, CUIDAR, BEIJAR… Conversar gasta BATERIA SOCIAL. Beijar sempre começa perguntando, e um não é uma resposta completa.')
    },
    {
      k: t('3 / 6 — CROWDS', '3 / 6 — MULTITUDES', '3 / 6 — MULTIDÕES'),
      h: t('SAY EXCUSE ME.', 'DI CON PERMISO.', 'DIGA COM LICENÇA.'),
      keys: [['m', 'Z', t('EXCUSE ME (IN A CROWD)', 'CON PERMISO (EN UNA MULTITUD)', 'COM LICENÇA (NA MULTIDÃO)')]],
      b: t('With nobody in front of you, press Z in a crowd. Most people make room. Some stay put. A few get angry: kindness gets you through more often than shoving.', 'Sin nadie al frente, presiona Z en una multitud. La mayoría te hace lugar. Algunos no se mueven. Unos pocos se enojan: la amabilidad te pasa más seguido que empujar.', 'Sem ninguém na frente, aperte Z na multidão. A maioria abre espaço. Alguns ficam parados. Poucos ficam bravos: a gentileza te leva mais longe do que empurrar.')
    },
    {
      k: t('4 / 6 — DANCING', '4 / 6 — BAILAR', '4 / 6 — DANÇAR'),
      h: t('FOLLOW THE ARROWS ON THE BEAT.', 'SIGUE LAS FLECHAS AL RITMO.', 'SIGA AS SETAS NO RITMO.'),
      keys: [['m', 'Z', t('DANCE ON A FLOOR MARK', 'BAILAR EN UNA MARCA', 'DANÇAR NUMA MARCA')], ['c', '← ↑ ↓ →', t('HIT THE ARROW ON THE BEAT', 'PULSA LA FLECHA AL RITMO', 'APERTE A SETA NO RITMO')], ['l', 'X', t('STOP', 'PARAR', 'PARAR')]],
      b: t('Stand on a glowing floor mark and press Z. Arrows come on the beat: hit the matching one to refill FUN. Groups and partners work the same way: their arrows come to you and you press the matching one. Nothing to memorise. Rather skip timing? MENU → NO-RHYTHM.', 'Párate en una marca brillante del piso y presiona Z. Las flechas llegan al ritmo: pulsa la que corresponde para recargar DIVERSIÓN. Los grupos y las parejas funcionan igual: sus flechas llegan a ti y pulsas la que corresponde. Nada que memorizar. ¿Prefieres sin tiempos? MENÚ → SIN RITMO.', 'Fique numa marca brilhante do chão e aperte Z. As setas chegam no ritmo: aperte a certa pra recarregar DIVERSÃO. Grupos e parceiros funcionam igual: as setas deles chegam até você e você aperta a certa. Nada pra decorar. Prefere sem tempo? MENU → SEM RITMO.'),
      beat: true
    },
    {
      k: t('5 / 6 — WATER AND ITEMS', '5 / 6 — AGUA Y OBJETOS', '5 / 6 — ÁGUA E ITENS'),
      h: t('SIP WHEN YOU NEED IT.', 'TOMA AGUA CUANDO LA NECESITES.', 'BEBA QUANDO PRECISAR.'),
      keys: [['c', 'C', t('TAKE A SIP', 'TOMAR UN TRAGO', 'TOMAR UM GOLE')], ['m', 'I', t('OPEN ITEMS', 'ABRIR OBJETOS', 'ABRIR ITENS')]],
      b: t('Press C (or DRINK) to take a sip from your bottle. It holds 4 sips and you can carry up to three bottles. The meter at the top shows what is left. Press I (or ITEMS) to open your pockets: the bottle and anything you pick up along the way, like what you buy in the queue, gum, sunglasses, jewellery and earplugs (Reduciendo Daño has them). Look for sparkles on the floor. Water is free at the bar and in the quiet room.', 'Presiona C (o BEBER) para tomar un trago de tu botella. Tiene 4 tragos y puedes llevar hasta tres botellas. El medidor de arriba muestra lo que queda. Presiona I (o OBJETOS) para abrir tus bolsillos: la botella y todo lo que recojas en el camino, como lo que compras en la fila, chicles, lentes de sol, joyas y tapones (Reduciendo Daño tiene). Busca destellos en el piso. El agua es gratis en la barra y en la sala tranquila.', 'Aperte C (ou BEBER) para tomar um gole da sua garrafa. Ela tem 4 goles e você pode levar até três garrafas. O medidor lá em cima mostra o que sobrou. Aperte I (ou ITENS) para abrir seus bolsos: a garrafa e tudo o que você pegar pelo caminho, como o que compra na fila, chicletes, óculos escuros, bijuterias e protetores de ouvido (a Reduciendo Daño tem). Procure brilhos no chão. A água é de graça no bar e na sala de calma.')
    },
    {
      k: t('6 / 6 — LOOK AFTER YOURSELF', '6 / 6 — CUÍDATE', '6 / 6 — CUIDE DE VOCÊ'),
      h: t('FOUR BARS. ONE LOG.', 'CUATRO BARRAS. UN REGISTRO.', 'QUATRO BARRAS. UM REGISTRO.'),
      keys: [['c', t('FUN', 'DIVERSIÓN', 'DIVERSÃO'), t('DANCE', 'BAILA', 'DANCE')], ['a', t('SOCIAL', 'SOCIAL', 'SOCIAL'), t('QUIET PLACES', 'LUGARES TRANQUILOS', 'LUGARES CALMOS')], ['m', t('HEALTH', 'SALUD', 'SAÚDE'), t('WATER, REST', 'AGUA, DESCANSO', 'ÁGUA, DESCANSO')], ['l', t('WEIRD', 'RAREZA', 'ESTRANHEZA'), t('DON\'T PUSH OR LIE', 'NO EMPUJES NI MIENTAS', 'NÃO EMPURRE NEM MINTA')]],
      b: t('FUN is blue, SOCIAL yellow, HEALTH red, WEIRDNESS green. The NIGHT LOG above the map records what every choice cost: press L for the whole night. Press O to pause. The yellow OBJECTIVE bar always says what to do next. Your friends notice how you treat people.', 'DIVERSIÓN es azul, SOCIAL amarilla, SALUD roja, RAREZA verde. El REGISTRO sobre el mapa anota lo que costó cada decisión: presiona L para ver toda la noche. Presiona O para pausar. La barra amarilla de OBJETIVO siempre dice qué hacer ahora. Tus amigos notan cómo tratas a la gente.', 'DIVERSÃO é azul, SOCIAL amarela, SAÚDE vermelha, ESTRANHEZA verde. O REGISTRO acima do mapa anota quanto cada escolha custou: aperte L pra ver a noite toda. Aperte O pra pausar. A barra amarela de OBJETIVO sempre diz o que fazer agora. Seus amigos notam como você trata as pessoas.')
    }
  ];
  const L = {
    next: t('NEXT [Z]', 'SIGUIENTE [Z]', 'PRÓXIMO [Z]'), go: t('GO TO THE DOOR [Z]', 'IR A LA PUERTA [Z]', 'IR PRA PORTA [Z]'),
    skip: t('SKIP [X]', 'OMITIR [X]', 'PULAR [X]'), back: t('BACK', 'ATRÁS', 'VOLTAR')
  };
  let idx = 0, done = null, asking = false;
  const Q = {
    k: t('A QUICK QUESTION', 'UNA PREGUNTA RÁPIDA', 'UMA PERGUNTA RÁPIDA'),
    h: t('WANT THE TUTORIAL AGAIN?', '¿QUIERES EL TUTORIAL OTRA VEZ?', 'QUER O TUTORIAL DE NOVO?'),
    b: t('A two-minute reminder of the controls, choosing words, dancing and water.', 'Un repaso de dos minutos de los controles, las palabras, el baile y el agua.', 'Uma revisão de dois minutos dos controles, das palavras, da dança e da água.'),
    yes: t('YES, SHOW ME [Z]', 'SÍ, MUÉSTRAME [Z]', 'SIM, ME MOSTRE [Z]'), no: t('NO, I KNOW [X]', 'NO, YA SÉ [X]', 'NÃO, EU SEI [X]')
  };

  function renderAsk() {
    const box = document.getElementById('tut'); if (!box) return;
    box.textContent = '';
    box.appendChild(el('div', 'tk', EM.tr(Q.k)));
    box.appendChild(el('h2', '', EM.tr(Q.h)));
    box.appendChild(el('p', 'tb', EM.tr(Q.b)));
    const nav = el('div', 'tnav');
    const y = el('button', 'primary', EM.tr(Q.yes)); y.type = 'button'; y.addEventListener('click', U.tutNext);
    const n = el('button', '', EM.tr(Q.no)); n.type = 'button'; n.addEventListener('click', U.tutSkip);
    nav.appendChild(y); nav.appendChild(n); box.appendChild(nav);
    y.focus && y.focus({ preventScroll: true });
    U.postHeight();
  }
  function render() {
    if (asking) { renderAsk(); return; }
    const box = document.getElementById('tut'); if (!box) return;
    const c = CARDS[idx]; box.textContent = '';
    box.appendChild(el('div', 'tk', EM.tr(c.k)));
    box.appendChild(el('h2', '', EM.tr(c.h)));
    const keys = el('div', 'keys');
    c.keys.forEach(function (k) {
      const wrap = el('div', '');
      wrap.appendChild(el('div', 'key ' + k[0], k[1]));
      if (k[2]) { const lab = el('div', 'tk', EM.tr(k[2])); lab.style.marginTop = '4px'; wrap.appendChild(lab); }
      keys.appendChild(wrap);
    });
    box.appendChild(keys);
    if (c.beat) {
      const row = el('div', 'beat');
      ['←', '↑', '→', '↓', '←'].forEach(function (a, i) { row.appendChild(el('span', i === 2 ? 'on' : '', a)); });
      box.appendChild(row);
    }
    box.appendChild(el('p', 'tb', EM.tr(c.b)));
    const nav = el('div', 'tnav');
    if (idx > 0) { const bk = el('button', '', EM.tr(L.back)); bk.type = 'button'; bk.addEventListener('click', function () { idx--; render(); }); nav.appendChild(bk); }
    const nx = el('button', 'primary', EM.tr(idx === CARDS.length - 1 ? L.go : L.next)); nx.type = 'button'; nx.addEventListener('click', U.tutNext); nav.appendChild(nx);
    const sk = el('button', '', EM.tr(L.skip)); sk.type = 'button'; sk.addEventListener('click', U.tutSkip); nav.appendChild(sk);
    nav.appendChild(el('span', 'dots', CARDS.map(function (_, i) { return i === idx ? '●' : '○'; }).join(' ')));
    box.appendChild(nav);
    nx.focus && nx.focus({ preventScroll: true });
    U.postHeight();
  }
  function finish() {
    const box = document.getElementById('tut'); if (box) { box.hidden = true; box.textContent = ''; }
    try { localStorage.setItem('excuse-me-tutorial', '1'); } catch (e) { /* ignore */ }
    U.mode = 'play'; E.paused = false;
    const cb = done; done = null;
    if (cb) cb();
    U.postHeight();
  }
  U.tutNext = function () { if (asking) { asking = false; idx = 0; render(); return; } if (idx >= CARDS.length - 1) finish(); else { idx++; render(); } };
  U.tutSkip = function () { finish(); };
  U.tutKey = function (e) {
    if (e.code === 'KeyZ' || e.code === 'Enter' || e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'KeyD') { if (!e.repeat) U.tutNext(); }
    else if (e.code === 'ArrowLeft' || e.code === 'KeyA') { if (!asking && idx > 0) { idx--; render(); } }
    else if (e.code === 'KeyX' || e.code === 'Escape') U.tutSkip();
  };
  U.tutorial = function (cb, ask) {
    idx = 0; done = cb || null; asking = !!ask;
    U.mode = 'tutorial'; E.paused = true; E.input.x = E.input.y = 0; U.keys = {};
    const box = document.getElementById('tut'); if (!box) { finish(); return; }
    box.hidden = false; render();
  };
  U.tutorialSeen = function () { try { return localStorage.getItem('excuse-me-tutorial') === '1'; } catch (e) { return false; } };

  /* after the intro: the tutorial the first time, then the lessons of earlier nights */
  S.after_intro = function () {
    /* first run in this browser: the tutorial. Every later run: a pop-up question first. */
    U.tutorial(function () { if (S.show_lessons) S.show_lessons(); }, U.tutorialSeen());
  };
  EM.DIALOGUES.intro.after = 'after_intro';
})();

/* EXCUSE ME — title, character creator, endings / night report, boot and main loop. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, E = EM.engine, U = EM.ui, $ = EM.$, $$ = EM.$$, el = U.el;
  const C = EM.PAL;

  /* ------------------------------------------------------------ strings */
  const S = EM.SCR = {
    sub: T('A NIGHT AT LA GRIETA // 22:00 — 08:00', 'UNA NOCHE EN LA GRIETA // 22:00 — 08:00', 'UMA NOITE NA GRIETA // 22:00 — 08:00'),
    tag: T('Cross the crowd. Take care of your people. Don\'t get thrown out. An 8-bit role-playing game about moving through a club, one "excuse me" at a time.',
      'Cruza la multitud. Cuida a tu gente. Que no te echen. Un juego de rol de 8 bits sobre moverse por un club, un «con permiso» a la vez.',
      'Atravesse a multidão. Cuide da sua gente. Não se deixe expulsar. Um RPG de 8 bits sobre se mover por um club, um «com licença» de cada vez.'),
    notice: T('18+ // Drugs, alcohol, sex and strong language. Fiction, written for people who have been there. No fast flashing lights; sway and shake can be switched off in SETTINGS.',
      '18+ // Drogas, alcohol, sexo y lenguaje fuerte. Ficción, escrita para gente que ya estuvo ahí. Sin luces parpadeantes rápidas; el vaivén y el temblor se desactivan en AJUSTES.',
      '18+ // Drogas, álcool, sexo e linguagem forte. Ficção, escrita para quem já esteve lá. Sem luzes piscando rápido; o balanço e o tremor se desligam em AJUSTES.'),
    newGame: T('NEW NIGHT', 'NUEVA NOCHE', 'NOVA NOITE'), cont: T('CONTINUE', 'CONTINUAR', 'CONTINUAR'),
    how: T('HOW IT WORKS', 'CÓMO SE JUEGA', 'COMO FUNCIONA'),
    how1: T('ARROWS: walk. Z / ENTER: talk, use, or say EXCUSE ME in a crowd. X: walk away. P: menu.', 'FLECHAS: caminar. Z / ENTER: hablar, usar, o decir CON PERMISO en la multitud. X: alejarse. P: menú.', 'SETAS: andar. Z / ENTER: falar, usar, ou dizer COM LICENÇA na multidão. X: se afastar. P: menu.'),
    how2: T('FUN refills by dancing at the glowing floor marks. SOCIAL BATTERY drains with every conversation and refills in quiet places. HEALTH refills with water and rest. WEIRDNESS only goes up if you behave strangely. Fill it and you are out.', 'DIVERSIÓN se llena bailando en las marcas brillantes del piso. BATERÍA SOCIAL se gasta con cada conversación y se recarga en lugares tranquilos. SALUD se llena con agua y descanso. RAREZA solo sube si te portas raro. Si se llena, te sacan.', 'DIVERSÃO enche dançando nas marcas brilhantes do chão. BATERIA SOCIAL gasta a cada conversa e recarrega em lugares calmos. SAÚDE enche com água e descanso. ESTRANHEZA só sobe se você age de forma estranha. Se encher, te tiram.'),
    how3: T('Nobody dies and nothing is "game over". A bad night just becomes a different ending.', 'Nadie muere y no hay «game over». Una mala noche solo se vuelve otro final.', 'Ninguém morre e não existe «game over». Uma noite ruim só vira outro final.'),
    creatorTitle: T('WHO ARE YOU TONIGHT?', '¿QUIÉN ERES ESTA NOCHE?', 'QUEM É VOCÊ ESTA NOITE?'),
    name: T('NAME', 'NOMBRE', 'NOME'), namePh: T('Your name', 'Tu nombre', 'Seu nome'),
    venue: T('WHERE ARE YOU TONIGHT?', '¿DÓNDE ESTÁS ESTA NOCHE?', 'ONDE VOCÊ ESTÁ HOJE?'),
    vClub: T('ESTABLISHED CLUB', 'CLUB ESTABLECIDO', 'CLUB ESTABELECIDO'),
    vRave: T('ILLEGAL RAVE', 'RAVE ILEGAL', 'RAVE ILEGAL'),
    vClubNote: T('Door list, guards, rules. Guards notice strangeness near them and dealers are not free of consequences. Quiet rooms are safe.', 'Lista en la puerta, guardias, reglas. Los guardias notan la rareza cerca de ellos y los dealers no son gratis. Las salas tranquilas son seguras.', 'Lista na porta, seguranças, regras. Os seguranças notam estranheza por perto e os dealers não saem de graça. Salas calmas são seguras.'),
    vRaveNote: T('Same building, no licence, no staff. Drugs weigh less on WEIRDNESS, dealers carry no consequence, and dancing gives extra FUN and a little HEALTH. If the crowd turns on you, the night is over.', 'El mismo edificio, sin licencia, sin personal. Las drogas pesan menos en la RAREZA, los dealers no tienen consecuencias y bailar da más DIVERSIÓN y un poco de SALUD. Si la multitud se te vuelve en contra, la noche termina.', 'O mesmo prédio, sem licença, sem equipe. As drogas pesam menos na ESTRANHEZA, os dealers não têm consequência e dançar dá mais DIVERSÃO e um pouco de SAÚDE. Se a multidão virar contra você, a noite acaba.'),
    gender: T('HOW OTHERS SPEAK TO YOU', 'CÓMO TE HABLAN LOS DEMÁS', 'COMO OS OUTROS FALAM COM VOCÊ'),
    gN: T('NEUTRAL (default)', 'NEUTRO (por defecto)', 'NEUTRO (padrão)'), gM: T('MASCULINE', 'MASCULINO', 'MASCULINO'), gF: T('FEMININE', 'FEMENINO', 'FEMININO'),
    gNote: T('Only changes the grammar people use for you. Your character stays whoever you want.', 'Solo cambia la gramática que usan contigo. Tu personaje es quien tú quieras.', 'Só muda a gramática que usam com você. Seu personagem é quem você quiser.'),
    skin: T('SKIN', 'PIEL', 'PELE'), hair: T('HAIR', 'PELO', 'CABELO'), hc: T('HAIR COLOUR', 'COLOR DE PELO', 'COR DO CABELO'), expr: T('FACE', 'CARA', 'ROSTO'),
    top: T('TOP', 'ARRIBA', 'PARTE DE CIMA'), tc: T('TOP COLOUR', 'COLOR DE ARRIBA', 'COR DE CIMA'), bottom: T('BOTTOM', 'ABAJO', 'PARTE DE BAIXO'), bc: T('BOTTOM COLOUR', 'COLOR DE ABAJO', 'COR DE BAIXO'), acc: T('EXTRA', 'EXTRA', 'EXTRA'), ac: T('ACCENT', 'ACENTO', 'DESTAQUE'),
    rand: T('RANDOMIZE', 'AL AZAR', 'ALEATÓRIO'), go: T('GO TO THE DOOR', 'IR A LA PUERTA', 'IR PARA A PORTA'), back: T('BACK', 'ATRÁS', 'VOLTAR'),
    again: T('PLAY AGAIN', 'JUGAR OTRA VEZ', 'JOGAR DE NOVO'), beginAgain: T('BEGIN AGAIN: IT IS 22:00', 'EMPEZAR DE NUEVO: SON LAS 22:00', 'COMEÇAR DE NOVO: SÃO 22:00'), title2: T('TITLE SCREEN', 'PANTALLA DE INICIO', 'TELA INICIAL'), night: T('NIGHT', 'NOCHE', 'NOITE'), resetNote: T('The night resets. Same you, same club, same pill. You remember some of it.', 'La noche se reinicia. El mismo tú, el mismo club, la misma pastilla. Recuerdas algo.', 'A noite reinicia. O mesmo você, o mesmo club, o mesmo comprimido. Você lembra de algo.'), report: T('NIGHT REPORT', 'REPORTE DE LA NOCHE', 'RELATÓRIO DA NOITE'),
    ending: T('ENDING', 'FINAL', 'FINAL'), clock: T('TIME', 'HORA', 'HORA'),
    friends: T('YOUR PEOPLE', 'TU GENTE', 'SUA GALERA'), moments: T('THE NIGHT, IN ORDER OF IMPORTANCE', 'LA NOCHE, POR ORDEN DE IMPORTANCIA', 'A NOITE, POR ORDEM DE IMPORTÂNCIA'),
    final: T('FINAL BARS', 'BARRAS FINALES', 'BARRAS FINAIS'),
    withYou: T('WITH YOU', 'CONTIGO', 'COM VOCÊ'), notWith: T('NOT WITH YOU', 'NO ESTÁ CONTIGO', 'NÃO ESTÁ COM VOCÊ')
  };
  const PARTS = [
    ['skin', 6], ['hair', 9], ['hc', 10], ['expr', 6], ['top', 11], ['tc', 12], ['bottom', 6], ['bc', 10], ['acc', 8], ['ac', 9]
  ];


  /* accessibility attributes are UI text: translated here (standalone games keep their own dictionary) */
  const ARIA = {
    screen: T('Game view: pixel map of a nightclub', 'Vista del juego: mapa en píxeles de un club nocturno', 'Visão do jogo: mapa em pixels de um club noturno'),
    water: T('Water bottles you carry', 'Botellas de agua que llevas', 'Garrafas de água que você carrega'),
    pad: T('Touch controls', 'Controles táctiles', 'Controles de toque'),
    up: T('Up', 'Arriba', 'Cima'), down: T('Down', 'Abajo', 'Baixo'), left: T('Left', 'Izquierda', 'Esquerda'), right: T('Right', 'Derecha', 'Direita'),
    back: T('Back or walk away', 'Atrás o alejarse', 'Voltar ou se afastar'), action: T('Action: talk, use, or say excuse me', 'Acción: hablar, usar o decir con permiso', 'Ação: falar, usar ou dizer com licença')
  };
  const PAGE_TITLE = T('EXCUSE ME — 8-bit night-out RPG', 'EXCUSE ME — RPG de 8 bits de una noche de club', 'EXCUSE ME — RPG de 8 bits de uma noite de club');
  function applyAria() {
    $$('[data-aria]').forEach(function (e) { const k = e.getAttribute('data-aria'); if (ARIA[k]) { e.setAttribute('aria-label', EM.tr(ARIA[k])); if (k === 'water') e.setAttribute('title', EM.tr(ARIA[k])); } });
    document.title = EM.tr(PAGE_TITLE);
  }

  /* ------------------------------------------------------------ title */
  U.toTitle = function () {
    E.paused = true; U.mode = 'title';
    E.overlay = null;
    show('menu', false); show('dialog', false);
    U.screen('title');
    renderTitle();
  };
  function show(id, on) { const e = $('#' + id); if (e) e.hidden = !on; }
  function renderTitle() {
    $('#t-sub').textContent = EM.tr(S.sub);
    $('#t-tag').textContent = EM.tr(S.tag);
    $('#t-notice').textContent = EM.tr(S.notice);
    const home = $('#t-home');
    if (home) {
      let top = true; try { top = window.parent === window; } catch (e) { /* cross-origin */ }
      home.hidden = !top;
      home.href = { en: '/games', es: '/juegos', pt: '/jogos' }[EM.lang];
      home.textContent = EM.tr(EM.T('← ÆRIEL GAMES', '← JUEGOS ÆRIEL', '← JOGOS ÆRIEL'));
    }
    $('#btn-new').textContent = EM.tr(S.newGame);
    const c = $('#btn-cont'); c.textContent = EM.tr(S.cont); c.hidden = !EM.hasSave();
    $('#t-how-h').textContent = EM.tr(S.how);
    $('#t-how1').textContent = EM.tr(S.how1); $('#t-how2').textContent = EM.tr(S.how2); $('#t-how3').textContent = EM.tr(S.how3);
    $$('.langbtn').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-l') === EM.lang); });
    U.postHeight();
  }

  /* ------------------------------------------------------------ creator */
  let cre = null;
  const NM = function (arr) { return arr.map(function (x) { return T(x[0], x[1], x[2]); }); };
  const PART_NAMES = {
    skin: NM([['PORCELAIN', 'PORCELANA', 'PORCELANA'], ['SAND', 'ARENA', 'AREIA'], ['TAN', 'BRONCEADO', 'BRONZEADO'], ['CARAMEL', 'CARAMELO', 'CARAMELO'], ['BROWN', 'MARRÓN', 'MARROM'], ['DEEP', 'PROFUNDO', 'PROFUNDO']]),
    hair: NM([['BALD', 'CALVO', 'CARECA'], ['BUZZ', 'RAPADO', 'RASPADO'], ['SHORT', 'CORTO', 'CURTO'], ['LONG', 'LARGO', 'LONGO'], ['AFRO', 'AFRO', 'AFRO'], ['MOHAWK', 'MOHAWK', 'MOHAWK'], ['BUN', 'MOÑO', 'COQUE'], ['BOB', 'BOB', 'BOB'], ['PIGTAILS', 'COLETAS', 'MARIA-CHIQUINHA']]),
    hc: NM([['BLACK', 'NEGRO', 'PRETO'], ['DARK BROWN', 'CASTAÑO OSCURO', 'CASTANHO ESCURO'], ['BROWN', 'CASTAÑO', 'CASTANHO'], ['BLONDE', 'RUBIO', 'LOURO'], ['GINGER', 'PELIRROJO', 'RUIVO'], ['GREY', 'GRIS', 'CINZA'], ['WHITE', 'BLANCO', 'BRANCO'], ['PINK', 'ROSA', 'ROSA'], ['BLUE', 'AZUL', 'AZUL'], ['TEAL', 'TURQUESA', 'TURQUESA']]),
    expr: NM([['NEUTRAL', 'NEUTRA', 'NEUTRO'], ['SMILE', 'SONRISA', 'SORRISO'], ['GRIN', 'SONRISOTA', 'SORRISÃO'], ['SMIRK', 'MEDIA SONRISA', 'MEIO SORRISO'], ['TIRED', 'CANSADA', 'CANSADO'], ['WIDE-EYED', 'OJOS ABIERTOS', 'OLHOS ARREGALADOS']]),
    top: NM([['TEE', 'CAMISETA', 'CAMISETA'], ['TANK', 'MUSCULOSA', 'REGATA'], ['STRIPES', 'RAYAS', 'LISTRAS'], ['HOODIE', 'BUZO', 'MOLETOM'], ['MESH', 'MALLA', 'TELA'], ['HARNESS', 'ARNÉS', 'HARNESS'], ['CROP TOP', 'CROP TOP', 'CROPPED'], ['DRESS', 'VESTIDO', 'VESTIDO'], ['VEST', 'CHALECO', 'COLETE'], ['LEATHER JACKET', 'CHAQUETA DE CUERO', 'JAQUETA DE COURO'], ['CROSS VEST', 'CHALECO CRUZ', 'COLETE CRUZ']]),
    tc: NM([['WHITE', 'BLANCO', 'BRANCO'], ['BLACK', 'NEGRO', 'PRETO'], ['MAGENTA', 'MAGENTA', 'MAGENTA'], ['CYAN', 'CIAN', 'CIANO'], ['LIME', 'LIMA', 'LIMA'], ['AMBER', 'ÁMBAR', 'ÂMBAR'], ['VIOLET', 'VIOLETA', 'VIOLETA'], ['RED', 'ROJO', 'VERMELHO'], ['BLUE', 'AZUL', 'AZUL'], ['TEAL', 'TURQUESA', 'TURQUESA'], ['ORANGE', 'NARANJA', 'LARANJA'], ['CREAM', 'CREMA', 'CREME']]),
    bottom: NM([['JEANS', 'JEANS', 'JEANS'], ['PANTS', 'PANTALÓN', 'CALÇA'], ['SHORTS', 'SHORTS', 'SHORTS'], ['SKIRT', 'FALDA', 'SAIA'], ['CARGO', 'CARGO', 'CARGO'], ['LEATHER', 'CUERO', 'COURO']]),
    bc: NM([['DENIM', 'JEAN', 'JEANS'], ['BLACK', 'NEGRO', 'PRETO'], ['GREY', 'GRIS', 'CINZA'], ['WINE', 'VINO', 'VINHO'], ['GREEN', 'VERDE', 'VERDE'], ['BROWN', 'MARRÓN', 'MARROM'], ['MAGENTA', 'MAGENTA', 'MAGENTA'], ['CYAN', 'CIAN', 'CIANO'], ['VIOLET', 'VIOLETA', 'VIOLETA'], ['CREAM', 'CREMA', 'CREME']]),
    acc: NM([['NONE', 'NADA', 'NADA'], ['SUNGLASSES', 'LENTES', 'ÓCULOS'], ['CAP', 'GORRA', 'BONÉ'], ['BANDANA', 'BANDANA', 'BANDANA'], ['HEADPHONES', 'AURICULARES', 'FONES'], ['CHAINS', 'CADENAS', 'CORRENTES'], ['FACE PAINT', 'PINTURA', 'PINTURA'], ['BEANIE', 'GORRO', 'TOUCA']]),
    ac: NM([['MAGENTA', 'MAGENTA', 'MAGENTA'], ['CYAN', 'CIAN', 'CIANO'], ['LIME', 'LIMA', 'LIMA'], ['AMBER', 'ÁMBAR', 'ÂMBAR'], ['VIOLET', 'VIOLETA', 'VIOLETA'], ['ORANGE', 'NARANJA', 'LARANJA'], ['RED', 'ROJO', 'VERMELHO'], ['TEAL', 'TURQUESA', 'TURQUESA'], ['YELLOW', 'AMARILLO', 'AMARELO']])
  };
  function newLook() { return { skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 2, bottom: 1, bc: 1, acc: 0, ac: 1, wide: false }; }

  U.openCreator = function () {
    cre = { look: newLook(), gender: 'x', name: '', venue: 'club' };
    U.mode = 'creator';
    U.screen('creator');
    buildCreator();
  };
  function buildCreator() {
    $('#c-title').textContent = EM.tr(S.creatorTitle);
    $('#c-name-l').textContent = EM.tr(S.name);
    const inp = $('#c-name'); inp.placeholder = EM.tr(S.namePh); inp.value = cre.name;
    $('#c-venue-l').textContent = EM.tr(S.venue);
    const vbox = $('#c-venue'); vbox.textContent = '';
    [['club', S.vClub], ['rave', S.vRave]].forEach(function (v) {
      const b = el('button', 'seg' + (cre.venue === v[0] ? ' on' : ''), EM.tr(v[1])); b.type = 'button'; b.setAttribute('aria-pressed', cre.venue === v[0] ? 'true' : 'false');
      b.addEventListener('click', function () { cre.venue = v[0]; buildCreator(); });
      vbox.appendChild(b);
    });
    $('#c-vnote').textContent = EM.tr(cre.venue === 'rave' ? S.vRaveNote : S.vClubNote);
    $('#c-gender-l').textContent = EM.tr(S.gender);
    $('#c-gnote').textContent = EM.tr(S.gNote);
    const gbox = $('#c-gender'); gbox.textContent = '';
    [['x', S.gN], ['m', S.gM], ['f', S.gF]].forEach(function (g) {
      const b = el('button', 'seg' + (cre.gender === g[0] ? ' on' : ''), EM.tr(g[1])); b.type = 'button'; b.setAttribute('aria-pressed', cre.gender === g[0] ? 'true' : 'false');
      b.addEventListener('click', function () { cre.gender = g[0]; buildCreator(); });
      gbox.appendChild(b);
    });
    const rows = $('#c-rows'); rows.textContent = '';
    PARTS.forEach(function (p) {
      const key = p[0], n = p[1];
      const row = el('div', 'crow'); row.setAttribute('role', 'group'); row.tabIndex = 0; row.setAttribute('aria-label', EM.tr(S[key]));
      row.appendChild(el('span', 'cl', EM.tr(S[key])));
      const prev = el('button', '', '◀'); prev.type = 'button'; prev.setAttribute('aria-label', EM.tr(S[key]) + ' −');
      const next = el('button', '', '▶'); next.type = 'button'; next.setAttribute('aria-label', EM.tr(S[key]) + ' +');
      const val = el('span', 'cv', '');
      function upd() {
        const v = cre.look[key];
        const nm = PART_NAMES[key][v];
        val.textContent = (nm ? EM.tr(nm) : (v + 1) + '') + '  ' + (v + 1) + '/' + n;
        if (key === 'skin' || key === 'hc' || key === 'tc' || key === 'bc' || key === 'ac') {
          const hex = key === 'skin' ? EM.SKINS[v] : (key === 'hc' ? EM.HAIRS[v] : (key === 'tc' ? EM.CLOTHES[v] : (key === 'bc' ? EM.BOTTOMS[v] : [EM.NEON.mag, EM.NEON.cyn, EM.NEON.lim, EM.NEON.amb, EM.NEON.vio, EM.NEON.org, EM.NEON.red, EM.NEON.teal, EM.NEON.yel][v])));
          val.style.borderLeft = '14px solid ' + hex;
        }
      }
      function step(d) { cre.look[key] = (cre.look[key] + d + n) % n; upd(); drawPreview(); EM.audio.blip('move'); }
      prev.addEventListener('click', function () { step(-1); }); next.addEventListener('click', function () { step(1); });
      row.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } });
      row.appendChild(prev); row.appendChild(val); row.appendChild(next);
      upd(); rows.appendChild(row);
    });
    $('#c-rand').textContent = EM.tr(S.rand); $('#c-go').textContent = EM.tr(S.go); $('#c-back').textContent = EM.tr(S.back);
    drawPreview();
    U.postHeight();
  }
  function drawPreview() {
    const cv = $('#c-preview'); const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#0A0A0D'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#16161C'; g.fillRect(0, cv.height - 22, cv.width, 22);
    const spr = EM.person(cre.look, 'd', 0, 'stand');
    g.drawImage(spr, 0, 0, spr.width * 8, spr.height * 8);
  }
  function cleanName(s) {
    s = (s || '').replace(/[^A-Za-zÀ-ÿ0-9 '\-.]/g, '').replace(/\s+/g, ' ').trim().slice(0, 12);
    return s || EM.tr(T('YOU', 'TÚ', 'VOCÊ'));
  }

  function bindCreator() {
    $('#c-name').addEventListener('input', function (e) { cre.name = e.target.value; });
    $('#c-rand').addEventListener('click', function () {
      PARTS.forEach(function (p) { cre.look[p[0]] = Math.floor(Math.random() * p[1]); });
      buildCreator();
    });
    $('#c-back').addEventListener('click', U.toTitle);
    $('#c-go').addEventListener('click', function () {
      const player = { name: cleanName($('#c-name').value), gender: cre.gender, look: Object.assign({}, cre.look) };
      U.startNight(player, { venue: cre.venue });
    });
  }

  /* ------------------------------------------------------------ start / continue */
  U.startNight = function (player, carry) {
    EM.clearSave();
    EM.state = EM.newState(player, carry);
    EM.story.init(EM.state);
    U.screen('game'); U.mode = 'play';
    U.renderLog();
    E.paused = true; show('dialog', false); show('menu', false);
    E.enter('doors', 3, 8, 'r');
    E.fade = 1; E.fadeIn();
    EM.audio.ensure();
    $('#toasts').textContent = '';
    setTimeout(function () { EM.hooks.script('intro'); }, 450);
    U.postHeight();
  };
  /* a hard reset: the same person, the same night, 22:00 again. They remember some of it. */
  U.beginAgain = function () {
    const old = EM.state;
    const ed = EM.ENDINGS[old.ended];
    const mem = EM.story.memory(old, ed);
    U.startNight(old.player, { seed: old.seed, attempt: (old.attempt || 1) + 1, lessons: mem.lessons, gags: old.gags, forgot: mem.forgot, recap: mem.recap, venue: old.venue });
  };
  U.continueNight = function () {
    const s = EM.load(); if (!s) return;
    EM.state = s;
    U.screen('game'); U.mode = 'play';
    U.renderLog();
    show('dialog', false); show('menu', false);
    const x = s.x, y = s.y;
    E.enter(s.zone, Math.floor(x / 16), Math.floor((y - 12) / 16), s.dir);
    s.x = x; s.y = y;
    E.fade = 1; E.fadeIn(); E.paused = false;
    EM.audio.ensure();
    U.postHeight();
  };

  /* ------------------------------------------------------------ endings */
  EM.hooks.ending = function (id) {
    E.paused = true; E.input.x = E.input.y = 0; U.keys = {};
    U.D = null; show('dialog', false); show('menu', false);
    E.overlay = null; E.dancing = false; U.rhythmKey = null;
    const ed = EM.ENDINGS[id] || EM.ENDINGS.closing;
    const lead = ed.lead ? ed.lead(EM.state) : null;
    U.mode = 'ending';
    const done = function () {
      EM.audio.setStyle(ed.music || 'chill'); EM.audio.setZone(ed.lp || 900, 0.3);
      renderEnding(id, ed);
    };
    if (lead && EM.DIALOGUES[lead]) { /* a short forced scene before the card */
      EM.DIALOGUES[lead].endingScene = true;
      U.startDialogue(lead, { onEnd: function () { U.mode = 'ending'; done(); } });
      return;
    }
    E.fadeOut(done);
  };

  function bar(label, v, key) {
    const r = el('div', 'rbar'); r.appendChild(el('span', 'k', label));
    const b = el('span', 'mbar'); const f = el('span', 'mfill m-' + key); f.style.width = Math.round(v) + '%'; b.appendChild(f); r.appendChild(b);
    r.appendChild(el('span', 'v', Math.round(v) + '')); return r;
  }
  function renderEnding(id, ed) {
    const s = EM.state;
    U.screen('ending'); U.mode = 'ending';
    $('#e-kicker').textContent = EM.tr(S.ending) + ' — ' + EM.clockStr(s.time);
    $('#e-title').textContent = EM.tr(ed.title);
    const txt = $('#e-text'); txt.textContent = '';
    [].concat(ed.text).forEach(function (p) { txt.appendChild(el('p', '', EM.tr(typeof p === 'function' ? p(s) : p))); });
    drawEndingArt(ed.art || 'sunrise');
    $('#e-rep-h').textContent = EM.tr(S.report);
    const fr = $('#e-friends'); fr.textContent = '';
    fr.appendChild(el('h3', '', EM.tr(S.friends)));
    EM.FRIENDS.forEach(function (f) {
      const withYou = s.party.indexOf(f) !== -1;
      const row = el('div', 'frow ' + (withYou ? 'with' : 'away'));
      row.appendChild(el('strong', '', EM.CAST[f].name));
      row.appendChild(el('span', '', ' — ' + EM.tr(withYou ? S.withYou : S.notWith)));
      const line = EM.story.friendLine ? EM.story.friendLine(f, s, withYou) : null;
      if (line) row.appendChild(el('div', 'fl', EM.tr(line)));
      fr.appendChild(row);
    });
    const mo = $('#e-moments'); mo.textContent = '';
    mo.appendChild(el('h3', '', EM.tr(S.moments)));
    const lines = EM.story.moments(s);
    const ul = el('ul', 'mlist');
    lines.forEach(function (m) { ul.appendChild(el('li', '', EM.tr(m))); });
    mo.appendChild(ul);
    const fb = $('#e-bars'); fb.textContent = '';
    fb.appendChild(el('h3', '', EM.tr(S.final)));
    fb.appendChild(bar(EM.tr(EM.UI.funL), s.stats.fun, 'fun')); fb.appendChild(bar(EM.tr(EM.UI.socL), s.stats.soc, 'soc')); fb.appendChild(bar(EM.tr(EM.UI.hpL), s.stats.hp, 'hp')); fb.appendChild(bar(EM.tr(EM.UI.weirdL), s.stats.weird, 'weird'));
    if (EM.story.renderPhone) EM.story.renderPhone(s, ed);
    const again = $('#e-again'), tbtn = $('#e-title-btn');
    again.textContent = EM.tr(ed.reset ? S.beginAgain : S.again);
    again.onclick = ed.reset ? U.beginAgain : U.toTitle;
    tbtn.hidden = !ed.reset; tbtn.textContent = EM.tr(S.title2);
    $('#e-night').textContent = (s.attempt > 1 ? EM.tr(S.night) + ' ' + s.attempt + ' — ' : '') + (ed.reset ? EM.tr(S.resetNote) : '');
    EM.clearSave();
    E.fade = 0; E.fadeDir = 0;
    U.postHeight();
    window.scrollTo(0, 0);
  }

  function drawEndingArt(kind) {
    const cv = $('#e-art'); const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    const W = cv.width, H = cv.height, N = EM.NEON;
    const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    function fill(c, x, y, w, h) { g.fillStyle = c; g.fillRect(x, y, w, h); }
    function dither(x, y, w, h, dens, c1, c2) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { g.fillStyle = B[((y + j) & 3) * 4 + ((x + i) & 3)] / 16 < dens ? c1 : c2; g.fillRect(x + i, y + j, 1, 1); } }
    function gradient(y0, y1, top, bot) { for (let y = y0; y < y1; y++) { const t = (y - y0) / Math.max(1, y1 - y0 - 1); const n = 4; const k = Math.min(n - 1, Math.floor(t * n)); const f = t * n - k; const c1 = lerp(top, bot, k / n), c2 = lerp(top, bot, (k + 1) / n); for (let x = 0; x < W; x++) { g.fillStyle = B[(y & 3) * 4 + (x & 3)] / 16 < f ? c2 : c1; g.fillRect(x, y, 1, 1); } } }
    function lerp(a, b, t) { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const r = Math.round((pa >> 16 & 255) + ((pb >> 16 & 255) - (pa >> 16 & 255)) * t), gg = Math.round((pa >> 8 & 255) + ((pb >> 8 & 255) - (pa >> 8 & 255)) * t), bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t); return '#' + ((1 << 24) | (r << 16) | (gg << 8) | bl).toString(16).slice(1); }
    const player = EM.state.player.look;
    function person(look, x, feetY, dir, pose) { const sp = EM.person(look, dir || 'd', 0, pose || 'stand'); g.drawImage(sp, Math.round(x - sp.width / 2), Math.round(feetY - (pose === 'sit' ? sp.height - 2 : 32))); }
    function skyline(baseY, seed) { for (let i = 0; i < 12; i++) { const w = 10 + (i * 7 + seed) % 12, h = 14 + (i * 13 + seed) % 22, x = i * 14 - 4; fill('#0B0B14', x, baseY - h, w, h); for (let k = 0; k < 6; k++) { const wx = x + 2 + (k * 5) % (w - 3), wy = baseY - h + 3 + (k * 7) % (h - 6); if (EM.hash2(i, k, seed) > 0.55) fill(N.yel, wx, wy, 1, 2); } } }
    fill('#07070C', 0, 0, W, H);
    if (kind.indexOf('sunrise') === 0) {
      gradient(0, 56, '#2B2F7A', '#FF8A3D');
      fill('#FFE9A8', W / 2 - 10, 38, 20, 12); fill('#FFE9A8', W / 2 - 7, 35, 14, 3); fill('#FFB020', W / 2 - 12, 50, 24, 3); fill('#FF7AB8', W / 2 - 18, 53, 36, 2);
      for (let i = 0; i < 20; i++) fill('#FFFFFF', (i * 31) % W, (i * 11) % 18, 1, 1);
      skyline(60, 3);
      fill('#14141C', 0, 60, W, H - 60); fill(N.org, 0, 60, W, 1); fill('#22222E', 0, 61, W, 3);
      const party = EM.FRIENDS.filter(function (f) { return EM.state.party.indexOf(f) !== -1; });
      if (kind === 'sunrise_legend') {
        for (let i = 0; i < 30; i++) { const x = 6 + (i * 17) % (W - 12), fy = 74 + (i % 3) * 3; const lk = EM.CAST[['maru', 'dani', 'tato', 'sol', 'kiki', 'hugo', 'nuri', 'bruno'][i % 8]].look; person(Object.assign({}, lk, { ol: '#050508' }), x, fy, 'u'); }
        person(player, 70, 86); party.forEach(function (f, i) { person(EM.CAST[f].look, 92 + i * 17, 86); });
      } else if (kind === 'sunrise_romance') {
        person(player, 58, 84, 'r'); person(EM.CAST.sol.look, 78, 84, 'l');
        fill(N.cyn, 66, 66, 4, 6); fill('#FFFFFF', 66, 66, 4, 2);
        party.forEach(function (f, i) { person(EM.CAST[f].look, 108 + i * 17, 86); });
      } else if (kind === 'sunrise_wrecked') {
        person(player, 64, 86, 'd', 'sit');
        party.forEach(function (f, i) { person(EM.CAST[f].look, 92 + i * 17, 86); });
      } else if (kind === 'sunrise_missing') {
        person(player, 58, 86);
        party.forEach(function (f, i) { person(EM.CAST[f].look, 80 + i * 17, 86); });
        g.strokeStyle = '#7F7F7F'; g.setLineDash([2, 2]); g.strokeRect(100.5, 50.5, 16, 36); g.setLineDash([]);
      } else {
        person(player, 62, 86);
        party.forEach(function (f, i) { person(EM.CAST[f].look, 84 + i * 18, 86); });
      }
    } else if (kind === 'door') {
      gradient(0, 56, '#0B0B1A', '#2A1A3A'); skyline(56, 9);
      fill('#14141C', 0, 56, W, H - 56); fill(N.mag, 0, 56, W, 1);
      fill(N.amb, 98, 10, 36, 62); fill('#140A00', 101, 13, 30, 59); dither(101, 13, 30, 59, 0.55, N.amb, '#3A2000');
      person(EM.CAST.dragan.look, 76, 86, 'r'); person(player, 44, 90, 'r');
    } else if (kind === 'siren') {
      gradient(0, 90, '#10101A', '#1A1A28');
      for (let k = 0; k < 7; k++) dither(0, 4 + k * 11, W, 8, 0.45, k % 2 ? N.red : N.blu, '#10101A');
      fill('#F4F4F4', W / 2 - 20, 18, 40, 40); fill(N.red, W / 2 - 6, 22, 12, 32); fill(N.red, W / 2 - 16, 33, 32, 10);
      fill('#1A1A22', 0, 72, W, 18);
      person(player, W / 2, 88, 'd', 'sit');
    } else if (kind === 'bench') {
      gradient(0, 66, '#0A0F2A', '#3A2A5A');
      fill('#FFE9A8', 118, 10, 14, 14); fill('#0A0F2A', 123, 10, 10, 14);
      for (let i = 0; i < 18; i++) fill('#FFFFFF', (i * 29) % W, (i * 13) % 40, 1, 1);
      fill('#14141C', 0, 66, W, H - 66);
      fill('#8A5A3A', 48, 66, 64, 5); fill('#4A2E1A', 48, 71, 64, 3); fill('#2A1A10', 52, 74, 4, 10); fill('#2A1A10', 104, 74, 4, 10);
      person(player, 80, 78, 'd', 'sit');
    } else if (kind === 'road') {
      gradient(0, 60, '#0A0F2A', '#3A4A7A'); skyline(60, 5);
      fill('#101016', 0, 60, W, H - 60); for (let x = 4; x < W; x += 24) fill(N.amb, x, 74, 12, 2);
      fill(N.yel, 96, 56, 40, 14); fill('#1A1A22', 100, 58, 14, 6); fill('#1A1A22', 118, 58, 14, 6); fill(N.yel, 108, 50, 18, 6); fill('#0A0A0A', 112, 52, 10, 3); fill('#FFFFFF', 102, 70, 6, 3); fill('#FFFFFF', 126, 70, 6, 3);
      person(player, 54, 88, 'r');
    } else {
      gradient(0, H, '#0A0A14', '#2A1A3A'); person(player, W / 2, 80);
    }
  }

  /* ------------------------------------------------------------ boot + loop */
  function boot() {
    EM.loadSettings();
    EM.setLang(EM.detectLang());
    E.init($('#screen'));
    U.bind();
    bindCreator();
    $('#btn-new').addEventListener('click', U.openCreator);
    $('#btn-cont').addEventListener('click', U.continueNight);
    $('#e-title-btn').addEventListener('click', U.toTitle);
    $$('.langbtn').forEach(function (b) { b.addEventListener('click', function () { const l = b.getAttribute('data-l'); EM.setLang(l); try { localStorage.setItem('preferred-lang', l); } catch (e) { /* ignore */ } }); });
    EM.onLang = function () {
      applyAria();
      renderTitle();
      if (U.renderLog) U.renderLog();
      if (U.mode === 'creator') buildCreator();
      if (U.mode === 'dialog' && U.D) { /* re-render current page */ }
    };
    window.addEventListener('storage', function (e) { if (e.key === 'preferred-lang' && e.newValue) EM.setLang(e.newValue); });
    window.addEventListener('message', function (e) { if (e.origin === window.location.origin && e.data && e.data.type === 'set-lang') EM.setLang(e.data.lang); });
    applyAria();
    U.toTitle();

    let last = performance.now(), slow = 0, fast = 0, frames = 0;
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; frames++;
      if (dt > 0.034) { slow++; fast = 0; } else { fast++; if (fast > 120) slow = 0; }
      if (slow > 90) { EM.audio.setLite(true); }
      if (EM.state && (U.mode === 'play' || U.mode === 'dialog' || U.mode === 'rhythm' || U.mode === 'menu')) {
        E.update(dt); E.draw(); U.hud(); if (frames % 6 === 0) U.hint(); if (U.mode === 'play' && EM.story.tick) EM.story.tick(dt);
      } else if (U.mode === 'game' || U.mode === 'ending') { E.update(dt); if (U.mode === 'game') E.draw(); }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

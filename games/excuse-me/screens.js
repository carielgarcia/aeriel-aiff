/* EXCUSE ME — title, character creator, endings / night report, boot and main loop. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, E = EM.engine, U = EM.ui, $ = EM.$, $$ = EM.$$, el = U.el;
  const C = EM.PAL;

  /* ------------------------------------------------------------ strings */
  const S = EM.SCR = {
    sub: T('A NIGHT AT LA GRIETA // 22:00 — 08:00', 'UNA NOCHE EN LA GRIETA // 22:00 — 08:00', 'UMA NOITE NA GRIETA // 22:00 — 08:00'),
    tag: T('Cross the crowd. Take care of your people. Don\'t get thrown out. An 16-bit role-playing game about moving through a club, one "excuse me" at a time.',
      'Cruza la multitud. Cuida a tu gente. Que no te echen. Un juego de rol de 16 bits sobre moverse por un club, un «con permiso» a la vez.',
      'Atravesse a multidão. Cuide da sua gente. Não se deixe expulsar. Um RPG de 16 bits sobre se mover por um club, um «com licença» de cada vez.'),
    notice: T('18+ // Drugs, alcohol, sex and strong language. Fiction, written for people who have been there. No fast flashing lights; sway and shake can be switched off in SETTINGS.',
      '18+ // Drogas, alcohol, sexo y lenguaje fuerte. Ficción, escrita para gente que ya estuvo ahí. Sin luces parpadeantes rápidas; el vaivén y el temblor se desactivan en AJUSTES.',
      '18+ // Drogas, álcool, sexo e linguagem forte. Ficção, escrita para quem já esteve lá. Sem luzes piscando rápido; o balanço e o tremor se desligam em AJUSTES.'),
    newGame: T('NEW NIGHT', 'NUEVA NOCHE', 'NOVA NOITE'), cont: T('CONTINUE', 'CONTINUAR', 'CONTINUAR'),
    how: T('HOW IT WORKS', 'CÓMO SE JUEGA', 'COMO FUNCIONA'),
    how1: T('ARROWS: walk. Z / ENTER: talk, use, or say EXCUSE ME in a crowd. X: walk away. C: drink water. I: items. P: menu.', 'FLECHAS: caminar. Z / ENTER: hablar, usar, o decir CON PERMISO en la multitud. X: alejarse. C: beber agua. I: objetos. P: menú.', 'SETAS: andar. Z / ENTER: falar, usar, ou dizer COM LICENÇA na multidão. X: se afastar. C: beber água. I: itens. P: menu.'),
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

  /* accessibility attributes are UI text: translated here (standalone games keep their own dictionary) */
  const ARIA = {
    screen: T('Game view: pixel map of a nightclub', 'Vista del juego: mapa en píxeles de un club nocturno', 'Visão do jogo: mapa em pixels de um club noturno'),
    water: T('Water bottles you carry', 'Botellas de agua que llevas', 'Garrafas de água que você carrega'),
    pad: T('Touch controls', 'Controles táctiles', 'Controles de toque'),
    up: T('Up', 'Arriba', 'Cima'), down: T('Down', 'Abajo', 'Baixo'), left: T('Left', 'Izquierda', 'Esquerda'), right: T('Right', 'Derecha', 'Direita'),
    back: T('Back or walk away', 'Atrás o alejarse', 'Voltar ou se afastar'), action: T('Action: talk, use, or say excuse me', 'Acción: hablar, usar o decir con permiso', 'Ação: falar, usar ou dizer com licença')
  };
  const PAGE_TITLE = T('EXCUSE ME — 16-bit night-out RPG', 'EXCUSE ME — RPG de 16 bits de una noche de club', 'EXCUSE ME — RPG de 16 bits de uma noite de club');
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
  const CH = EM.CHAR;
  const GROUP_NAMES = { who: T('YOU', 'TÚ', 'VOCÊ'), styles: T('STYLES', 'ESTILOS', 'ESTILOS'), body: T('BODY', 'CUERPO', 'CORPO'), face: T('FACE', 'CARA', 'ROSTO'), hair: T('HAIR', 'PELO', 'CABELO'), outfit: T('OUTFIT', 'ROPA', 'ROUPA'), extras: T('EXTRAS', 'EXTRAS', 'EXTRAS') };
  const PART_LABEL = {
    skin: T('SKIN TONE', 'TONO DE PIEL', 'TOM DE PELE'), build: T('BUILD', 'COMPLEXIÓN', 'FÍSICO'), expr: T('EXPRESSION', 'EXPRESIÓN', 'EXPRESSÃO'),
    eye: T('EYE COLOUR', 'COLOR DE OJOS', 'COR DOS OLHOS'), fhair: T('FACIAL HAIR', 'VELLO FACIAL', 'PELOS NO ROSTO'),
    makeup: T('MAKEUP', 'MAQUILLAJE', 'MAQUIAGEM'), pierce: T('PIERCINGS', 'PIERCINGS', 'PIERCINGS'),
    hair: T('HAIRSTYLE', 'PEINADO', 'PENTEADO'), hc: T('HAIR COLOUR', 'COLOR DE PELO', 'COR DO CABELO'),
    top: T('TOP', 'ARRIBA', 'PARTE DE CIMA'), tc: T('TOP COLOUR', 'COLOR DE ARRIBA', 'COR DA PARTE DE CIMA'),
    bottom: T('BOTTOMS', 'ABAJO', 'PARTE DE BAIXO'), bc: T('BOTTOMS COLOUR', 'COLOR DE ABAJO', 'COR DA PARTE DE BAIXO'),
    shoes: T('SHOES', 'CALZADO', 'CALÇADOS'), ac: T('ACCENT COLOUR', 'COLOR DE DETALLES', 'COR DOS DETALHES'),
    hat: T('HEADWEAR', 'SOMBRERO O GORRA', 'ACESSÓRIO DE CABEÇA'), face: T('FACE EXTRAS', 'EXTRAS DE CARA', 'EXTRAS NO ROSTO'),
    neck: T('NECK', 'CUELLO', 'PESCOÇO'), ear: T('EARRINGS', 'ARETES', 'BRINCOS'),
    wrist: T('WRISTS AND HANDS', 'MUÑECAS Y MANOS', 'PULSOS E MÃOS'), bag: T('BAG', 'BOLSO', 'BOLSA')
  };
  const PART_NOTE = {
    ac: T('Colours the details: shoe soles, hair ties, bags, makeup, headwear and wrist wear.', 'Da color a los detalles: suelas, ligas del pelo, bolsos, maquillaje, gorros y muñequeras.', 'Dá cor aos detalhes: solas, elásticos de cabelo, bolsas, maquiagem, chapéus e pulseiras.'),
    eye: T('Look at the FACE close-up to see the colour.', 'Mira el primer plano de la CARA para ver el color.', 'Olhe o close do ROSTO para ver a cor.')
  };
  const CS = { views: T('Your character: close-up, front, side, back and walking', 'Tu personaje: primer plano, de frente, de lado, de espaldas y caminando', 'Seu personagem: close, de frente, de lado, de costas e andando'),
    closeup: T('Face close-up', 'Primer plano de la cara', 'Close do rosto'), none: T('none', 'ninguno', 'nenhum') };
  const SWATCH = { skin: function () { return EM.SKINS; }, hc: function () { return EM.HAIRS; }, tc: function () { return EM.CLOTHES; }, bc: function () { return EM.BOTTOMS; }, ac: function () { return EM.ACCENTS; }, eye: function () { return EM.EYES; } };
  /* thumbnail crops [x, y, w, h] in sprite pixels (the sprite is 36x68): each option is shown where it appears on the body */
  const CROP = { expr: [8, 12, 20, 20], fhair: [8, 12, 20, 20], hair: [4, 0, 28, 28], hat: [4, 0, 28, 28], face: [8, 12, 20, 20], ear: [2, 12, 32, 20], neck: [6, 22, 24, 24],
    makeup: [8, 12, 20, 20], pierce: [8, 12, 20, 20], top: [2, 24, 32, 26], bottom: [4, 44, 28, 24], shoes: [4, 56, 28, 12], build: [0, 0, 36, 68], wrist: [0, 46, 36, 20], bag: [0, 24, 36, 34] };
  /* a neutral look to build thumbnails on: only the part being shown changes */
  const THUMB_BASE = { skin: 2, build: 1, eye: 0, expr: 1, fhair: 0, makeup: 0, pierce: 0, hair: 2, hc: 1, top: 0, tc: 8, bottom: 0, bc: 0, shoes: 0, ac: 3, hat: 0, face: 0, neck: 0, ear: 0, wrist: 0, bag: 0 };
  const thumbCache = {};
  function thumb(key, v) {
    /* the thumbnail shows the option on the player's own skin, build and hair, so it is easy to picture */
    const base = Object.assign({}, THUMB_BASE);
    ['skin', 'build', 'hc', 'tc', 'bc', 'bottom', 'top', 'hair', 'ac', 'shoes'].forEach(function (k) { if (k !== key && cre.look[k] !== undefined) base[k] = cre.look[k]; });
    if (key === 'wrist' && (base.top === 1 || base.top === 7 || base.top === 0)) base.top = 1;
    if (key === 'wrist' && base.top !== 1) base.top = 1;
    if (key === 'hc' && cre.look.hair === 0) base.hair = 2;
    base[key] = v;
    const ck = key + v + '|' + CH.keys.map(function (k) { return base[k]; }).join(',');
    if (thumbCache[ck]) return thumbCache[ck];
    const spr = EM.person(base, 'd', 0, 'stand');
    const r = CROP[key] || CROP.top;
    const cv = document.createElement('canvas'); cv.width = 44; cv.height = 44;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#16161C'; g.fillRect(0, 0, 44, 44);
    const sc = Math.min(44 / r[2], 44 / r[3]);
    const dw = r[2] * sc, dh = r[3] * sc;
    g.drawImage(spr, r[0], r[1], r[2], r[3], (44 - dw) / 2, (44 - dh) / 2, dw, dh);
    thumbCache[ck] = cv;
    return cv;
  }
  function optName(key, v) { const nm = CH.names[key] && CH.names[key][v]; return nm ? EM.tr(nm) : (v + 1) + ''; }
  /* presets: partial looks over a base; epicene names */
  const PRESETS = [
    [T('RAVER', 'RAVERO', 'RAVER'), { skin: 3, build: 1, expr: 2, hair: 11, hc: 7, top: 4, tc: 3, bottom: 7, bc: 1, shoes: 1, ac: 0, hat: 0, face: 4, neck: 1, ear: 2, makeup: 5, wrist: 4, pierce: 0, bag: 0 }],
    [T('EVERYDAY', 'DE TODOS LOS DÍAS', 'DO DIA A DIA'), { skin: 1, build: 1, expr: 1, hair: 2, hc: 2, top: 18, tc: 8, bottom: 0, bc: 0, shoes: 0, ac: 3, hat: 0, face: 0, neck: 0, ear: 0, wrist: 3, bag: 3 }],
    [T('SOFT', 'SUAVE', 'SUAVE'), { skin: 6, build: 0, expr: 6, hair: 19, hc: 12, top: 12, tc: 14, bottom: 8, bc: 9, shoes: 4, ac: 4, hat: 9, face: 5, neck: 0, ear: 1, makeup: 1, bag: 4 }],
    [T('PUNK', 'PUNK', 'PUNK'), { skin: 0, build: 1, expr: 9, hair: 5, hc: 7, top: 9, tc: 1, bottom: 5, bc: 1, shoes: 1, ac: 6, hat: 0, face: 0, neck: 3, ear: 2, makeup: 3, pierce: 4, wrist: 5 }],
    [T('TOURIST', 'TURISTA', 'TURISTA'), { skin: 2, build: 1, expr: 5, hair: 2, hc: 3, top: 19, tc: 11, bottom: 2, bc: 12, shoes: 4, ac: 5, hat: 7, face: 2, neck: 4, ear: 0, bag: 2 }],
    [T('ARTIST', 'ARTISTA', 'ARTISTA'), { skin: 8, build: 1, expr: 3, hair: 14, hc: 16, top: 17, tc: 6, bottom: 6, bc: 8, shoes: 5, ac: 4, hat: 11, face: 3, neck: 2, ear: 1, makeup: 4, pierce: 2 }],
    [T('SPORT', 'DEPORTIVO', 'ESPORTIVO'), { skin: 4, build: 2, expr: 2, hair: 10, hc: 0, top: 14, tc: 8, bottom: 7, bc: 2, shoes: 2, ac: 1, hat: 10, face: 6, neck: 0, ear: 0, wrist: 1, bag: 1 }],
    [T('GLAM', 'GLAM', 'GLAM'), { skin: 9, build: 0, expr: 3, hair: 22, hc: 13, top: 20, tc: 5, bottom: 8, bc: 10, shoes: 3, ac: 8, hat: 0, face: 4, neck: 3, ear: 3, makeup: 6, wrist: 2 }],
    [T('PARTY', 'FIESTA', 'FESTA'), { skin: 5, build: 1, expr: 7, hair: 13, hc: 14, top: 15, tc: 2, bottom: 9, bc: 7, shoes: 3, ac: 1, hat: 13, face: 3, neck: 0, ear: 2, makeup: 5, wrist: 4 }],
    [T('COSY', 'ACOGEDOR', 'ACONCHEGANTE'), { skin: 7, build: 2, expr: 6, hair: 16, hc: 17, top: 3, tc: 15, bottom: 7, bc: 5, shoes: 1, ac: 7, hat: 12, face: 2, neck: 2, ear: 0 }]
  ];
  function newLook() { return Object.assign({}, THUMB_BASE, { skin: 2, hair: 2, hc: 1, top: 0, tc: 8, bottom: 0, bc: 0, ac: 3 }); }

  U.openCreator = function () {
    cre = { look: newLook(), gender: 'x', name: '', venue: 'club', tab: 'who' };
    U.mode = 'creator';
    U.screen('creator');
    buildCreator();
  };
  let walkTimer = null;
  function stopWalk() { if (walkTimer) { clearInterval(walkTimer); walkTimer = null; } }
  function creatorRoomH() {
    if (window.parent !== window) { try { return Math.max(320, window.parent.innerHeight - 72); } catch (e) { /* cross-origin */ } }
    return window.innerHeight;
  }
  /* the options panel is as tall as the screen allows, so the character and the options are always on screen together */
  function fitCreator() {
    const panel = $('#c-panel'); if (!panel || $('#screen-creator').hidden) return;
    panel.style.maxHeight = 'none';
    const top = panel.getBoundingClientRect().top + (window.scrollY || 0);
    const rest = ($('#c-actions') ? $('#c-actions').offsetHeight : 60) + 60;
    panel.style.maxHeight = Math.max(240, Math.floor(creatorRoomH() - top - rest)) + 'px';
    U.postHeight();
  }
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
    const pbox = $('#c-presets'); pbox.textContent = '';
    PRESETS.forEach(function (p) {
      const b = el('button', 'seg', EM.tr(p[0])); b.type = 'button';
      b.addEventListener('click', function () { cre.look = Object.assign({}, THUMB_BASE, p[1]); EM.audio.blip('move'); buildCreator(); });
      pbox.appendChild(b);
    });
    $('#c-pv').setAttribute('aria-label', EM.tr(CS.views));
    $('#c-pv-h').setAttribute('aria-label', EM.tr(CS.closeup));
    buildTabs();
    $('#c-rand').textContent = EM.tr(S.rand); $('#c-go').textContent = EM.tr(S.go); $('#c-back').textContent = EM.tr(S.back);
    drawPreview();
    fitCreator();
  }
  const TAB_ORDER = ['who', 'styles', 'body', 'face', 'hair', 'outfit', 'extras'];
  function buildTabs() {
    const tabs = $('#c-tabs'); tabs.textContent = '';
    TAB_ORDER.forEach(function (id) {
      const b = el('button', 'tab' + (cre.tab === id ? ' on' : ''), EM.tr(GROUP_NAMES[id])); b.type = 'button';
      b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', cre.tab === id ? 'true' : 'false'); b.id = 'ctab-' + id;
      b.addEventListener('click', function () { cre.tab = id; buildTabs(); fitCreator(); });
      b.addEventListener('keydown', function (e) {
        const i = TAB_ORDER.indexOf(id); let j = -1;
        if (e.key === 'ArrowRight') j = (i + 1) % TAB_ORDER.length; else if (e.key === 'ArrowLeft') j = (i - 1 + TAB_ORDER.length) % TAB_ORDER.length;
        if (j >= 0) { e.preventDefault(); cre.tab = TAB_ORDER[j]; buildTabs(); $('#ctab-' + cre.tab).focus(); fitCreator(); }
      });
      tabs.appendChild(b);
    });
    const panel = $('#c-panel');
    panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', 'ctab-' + cre.tab);
    $('#c-sec-who').hidden = cre.tab !== 'who'; $('#c-sec-styles').hidden = cre.tab !== 'styles';
    const parts = $('#c-parts'); parts.textContent = '';
    const gr = CH.groups.filter(function (g) { return g[0] === cre.tab; })[0];
    parts.hidden = !gr;
    if (gr) gr[1].forEach(function (key) { parts.appendChild(buildPart(key)); });
    panel.scrollTop = 0;
  }
  function buildPart(key) {
    const sec = el('div', 'cpart');
    const head = el('div', 'chead'); head.appendChild(el('span', 'cl', EM.tr(PART_LABEL[key])));
    const cur = el('span', 'cv', optName(key, cre.look[key]));
    head.appendChild(cur); sec.appendChild(head);
    if (PART_NOTE[key]) sec.appendChild(el('p', 'note', EM.tr(PART_NOTE[key])));
    const grid = el('div', 'cgrid' + (SWATCH[key] ? ' sw' : '')); grid.setAttribute('role', 'radiogroup'); grid.setAttribute('aria-label', EM.tr(PART_LABEL[key]));
    const n = CH.sizes[key];
    const order = (CH.order && CH.order[key]) || Array.apply(null, { length: n }).map(function (_, i) { return i; });
    const btns = [];
    order.forEach(function (v) {
      const b = el('button', 'opt' + (cre.look[key] === v ? ' sel' : '')); b.type = 'button';
      b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', cre.look[key] === v ? 'true' : 'false');
      b.setAttribute('aria-label', EM.tr(PART_LABEL[key]) + ': ' + optName(key, v)); b.title = optName(key, v);
      b.tabIndex = cre.look[key] === v ? 0 : -1;
      if (SWATCH[key]) { b.style.background = SWATCH[key]()[v]; b.classList.add('swb'); }
      else b.appendChild(thumb(key, v));
      b.addEventListener('click', function () { choose(key, v); });
      b.addEventListener('keydown', function (e) {
        const i = btns.indexOf(b); let j = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % btns.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + btns.length) % btns.length;
        if (j >= 0) { e.preventDefault(); btns[j].click(); }
      });
      btns.push(b); grid.appendChild(b);
    });
    sec.appendChild(grid);
    return sec;
  }
  function choose(key, v) {
    cre.look[key] = v;
    EM.audio.blip('move');
    const panel = $('#c-panel'), keep = panel.scrollTop;
    /* thumbnails of other parts depend on this one (hair colour changes every hairstyle), so the grids are redrawn */
    const gr = CH.groups.filter(function (g) { return g[0] === cre.tab; })[0];
    const parts = $('#c-parts'); parts.textContent = '';
    if (gr) gr[1].forEach(function (k) { parts.appendChild(buildPart(k)); });
    panel.scrollTop = keep;
    drawPreview();
    const sel = parts.querySelector('.cpart .opt.sel[data-k="' + key + '"]') || (function () { const all = parts.querySelectorAll('.cgrid'); const i = gr ? gr[1].indexOf(key) : -1; return i >= 0 && all[i] ? all[i].querySelector('.opt.sel') : null; })();
    if (sel) sel.focus({ preventScroll: true });
  }
  const VIEWS = [['c-pv-d', 'd', 4], ['c-pv-r', 'r', 2], ['c-pv-u', 'u', 2]];
  function drawPreview() {
    VIEWS.forEach(function (v) {
      const cv = $('#' + v[0]); if (!cv) return; const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
      g.fillStyle = '#0A0A0D'; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = '#16161C'; g.fillRect(0, cv.height - 5 * v[2], cv.width, 5 * v[2]);
      const spr = EM.person(cre.look, v[1], 0, 'stand');
      g.drawImage(spr, 0, 0, spr.width * v[2], spr.height * v[2]);
    });
    /* the face close-up: the head, six times larger, so eyes, makeup and piercings can be seen */
    const hv = $('#c-pv-h'), hg = hv.getContext('2d'); hg.imageSmoothingEnabled = false;
    hg.fillStyle = '#0A0A0D'; hg.fillRect(0, 0, hv.width, hv.height);
    const sp = EM.person(cre.look, 'd', 0, 'stand');
    hg.drawImage(sp, 3, 0, 30, 32, 0, 0, hv.width, hv.height);
    stopWalk();
    let f = 0; const seq = [1, 3, 2, 3];
    const cv = $('#c-pv-w'); const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    function frame() {
      if (U.mode !== 'creator') { stopWalk(); return; }
      g.fillStyle = '#0A0A0D'; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = '#16161C'; g.fillRect(0, cv.height - 10, cv.width, 10);
      const fr = seq[f++ % 4];
      const spr = EM.person(cre.look, 'r', fr, 'stand');
      g.drawImage(spr, 0, (fr === 3 ? -2 : 0), spr.width * 2, spr.height * 2);
    }
    frame();
    if (!window.matchMedia || !matchMedia('(prefers-reduced-motion: reduce)').matches) walkTimer = setInterval(frame, 220);
  }
  function cleanName(s) {
    s = (s || '').replace(/[^A-Za-zÀ-ÿ0-9 '\-.]/g, '').replace(/\s+/g, ' ').trim().slice(0, 12);
    return s || EM.tr(T('YOU', 'TÚ', 'VOCÊ'));
  }

  function bindCreator() {
    $('#c-name').addEventListener('input', function (e) { cre.name = e.target.value; });
    $('#c-rand').addEventListener('click', function () {
      cre.look = Object.assign({}, THUMB_BASE, CH.random());
      buildCreator();
    });
    $('#c-back').addEventListener('click', function () { stopWalk(); U.toTitle(); });
    window.addEventListener('resize', fitCreator);
    $('#c-go').addEventListener('click', function () {
      const player = { name: cleanName($('#c-name').value), gender: cre.gender, look: Object.assign({}, cre.look) };
      stopWalk();
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
    if (EM.compactSave) EM.compactSave(s);
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
    const RS = EM.RS; g.setTransform(RS, 0, 0, RS, 0, 0); /* drawn in logical pixels (160x90) on a canvas RS times bigger */
    const W = cv.width / RS, H = cv.height / RS, N = EM.NEON;
    const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    function fill(c, x, y, w, h) { g.fillStyle = c; g.fillRect(x, y, w, h); }
    function dither(x, y, w, h, dens, c1, c2) { /* in device pixels, so the dots are as fine as the characters */
      g.save(); g.scale(1 / RS, 1 / RS);
      for (let j = 0; j < h * RS; j++) for (let i = 0; i < w * RS; i++) { g.fillStyle = B[((y * RS + j) & 3) * 4 + ((x * RS + i) & 3)] / 16 < dens ? c1 : c2; g.fillRect(x * RS + i, y * RS + j, 1, 1); }
      g.restore();
    }
    function gradient(y0, y1, top, bot) { for (let y = y0; y < y1; y++) { const t = (y - y0) / Math.max(1, y1 - y0 - 1); const n = 4; const k = Math.min(n - 1, Math.floor(t * n)); const f = t * n - k; const c1 = lerp(top, bot, k / n), c2 = lerp(top, bot, (k + 1) / n); for (let x = 0; x < W; x++) { g.fillStyle = B[(y & 3) * 4 + (x & 3)] / 16 < f ? c2 : c1; g.fillRect(x, y, 1, 1); } } }
    function lerp(a, b, t) { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const r = Math.round((pa >> 16 & 255) + ((pb >> 16 & 255) - (pa >> 16 & 255)) * t), gg = Math.round((pa >> 8 & 255) + ((pb >> 8 & 255) - (pa >> 8 & 255)) * t), bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t); return '#' + ((1 << 24) | (r << 16) | (gg << 8) | bl).toString(16).slice(1); }
    const player = EM.state.player.look;
    function person(look, x, feetY, dir, pose) {
      const sp = EM.person(look, dir || 'd', 0, pose || 'stand'), sn = function (v) { return Math.round(v * RS) / RS; };
      g.fillStyle = 'rgba(6,4,14,0.4)'; g.beginPath(); g.ellipse(x, feetY + 0.5, 6, 1.9, 0, 0, Math.PI * 2); g.fill();
      g.drawImage(sp, sn(x - sp.lw / 2), sn(feetY - (pose === 'sit' ? sp.lh - 2 : 32) - 1 / RS), sp.lw, sp.lh);
    }
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

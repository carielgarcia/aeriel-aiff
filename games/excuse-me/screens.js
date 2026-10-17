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
    gender: T('HOW OTHERS SPEAK TO YOU', 'CÓMO TE HABLAN LOS DEMÁS', 'COMO OS OUTROS FALAM COM VOCÊ'),
    gN: T('NEUTRAL (default)', 'NEUTRO (por defecto)', 'NEUTRO (padrão)'), gM: T('MASCULINE', 'MASCULINO', 'MASCULINO'), gF: T('FEMININE', 'FEMENINO', 'FEMININO'),
    gNote: T('Only changes the grammar people use for you. Your character stays whoever you want.', 'Solo cambia la gramática que usan contigo. Tu personaje es quien tú quieras.', 'Só muda a gramática que usam com você. Seu personagem é quem você quiser.'),
    skin: T('SKIN', 'PIEL', 'PELE'), hair: T('HAIR', 'PELO', 'CABELO'), hc: T('HAIR TONE', 'TONO', 'TOM'), expr: T('FACE', 'CARA', 'ROSTO'),
    top: T('TOP', 'ARRIBA', 'PARTE DE CIMA'), bottom: T('BOTTOM', 'ABAJO', 'PARTE DE BAIXO'), acc: T('EXTRA', 'EXTRA', 'EXTRA'),
    rand: T('RANDOMIZE', 'AL AZAR', 'ALEATÓRIO'), go: T('GO TO THE DOOR', 'IR A LA PUERTA', 'IR PARA A PORTA'), back: T('BACK', 'ATRÁS', 'VOLTAR'),
    again: T('PLAY AGAIN', 'JUGAR OTRA VEZ', 'JOGAR DE NOVO'), report: T('NIGHT REPORT', 'REPORTE DE LA NOCHE', 'RELATÓRIO DA NOITE'),
    ending: T('ENDING', 'FINAL', 'FINAL'), clock: T('TIME', 'HORA', 'HORA'),
    friends: T('YOUR PEOPLE', 'TU GENTE', 'SUA GALERA'), moments: T('THE NIGHT, IN ORDER OF IMPORTANCE', 'LA NOCHE, POR ORDEN DE IMPORTANCIA', 'A NOITE, POR ORDEM DE IMPORTÂNCIA'),
    final: T('FINAL BARS', 'BARRAS FINALES', 'BARRAS FINAIS'),
    withYou: T('WITH YOU', 'CONTIGO', 'COM VOCÊ'), notWith: T('NOT WITH YOU', 'NO ESTÁ CONTIGO', 'NÃO ESTÁ COM VOCÊ')
  };
  const PARTS = [
    ['skin', 4], ['hair', 9], ['hc', 4], ['expr', 6], ['top', 11], ['bottom', 6], ['acc', 8]
  ];

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
    $('#btn-new').textContent = EM.tr(S.newGame);
    const c = $('#btn-cont'); c.textContent = EM.tr(S.cont); c.hidden = !EM.hasSave();
    $('#t-how-h').textContent = EM.tr(S.how);
    $('#t-how1').textContent = EM.tr(S.how1); $('#t-how2').textContent = EM.tr(S.how2); $('#t-how3').textContent = EM.tr(S.how3);
    $$('.langbtn').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-l') === EM.lang); });
    U.postHeight();
  }

  /* ------------------------------------------------------------ creator */
  let cre = null;
  const PART_NAMES = {
    skin: ['', '', '', ''],
    hair: [T('BALD', 'CALVO', 'CARECA'), T('BUZZ', 'RAPADO', 'RASPADO'), T('SHORT', 'CORTO', 'CURTO'), T('LONG', 'LARGO', 'LONGO'), T('AFRO', 'AFRO', 'AFRO'), T('MOHAWK', 'MOHAWK', 'MOHAWK'), T('BUN', 'MOÑO', 'COQUE'), T('BOB', 'BOB', 'BOB'), T('PIGTAILS', 'COLETAS', 'MARIA-CHIQUINHA')],
    hc: [T('BLACK', 'NEGRO', 'PRETO'), T('GREY', 'GRIS', 'CINZA'), T('WHITE', 'BLANCO', 'BRANCO'), T('FROSTED', 'DECOLORADO', 'DESCOLORIDO')],
    expr: [T('NEUTRAL', 'NEUTRA', 'NEUTRO'), T('SMILE', 'SONRISA', 'SORRISO'), T('GRIN', 'SONRISOTA', 'SORRISÃO'), T('SMIRK', 'MEDIA SONRISA', 'MEIO SORRISO'), T('TIRED', 'CANSADA', 'CANSADO'), T('WIDE-EYED', 'OJOS ABIERTOS', 'OLHOS ARREGALADOS')],
    top: [T('WHITE TEE', 'REMERA BLANCA', 'CAMISETA BRANCA'), T('BLACK TEE', 'REMERA NEGRA', 'CAMISETA PRETA'), T('STRIPES', 'RAYAS', 'LISTRAS'), T('HOODIE', 'BUZO', 'MOLETOM'), T('MESH', 'MALLA', 'TELA'), T('HARNESS', 'ARNÉS', 'HARNESS'), T('TANK', 'MUSCULOSA', 'REGATA'), T('DRESS', 'VESTIDO', 'VESTIDO'), T('VEST', 'CHALECO', 'COLETE'), T('LEATHER', 'CUERO', 'COURO'), T('CROSS TEE', 'REMERA CRUZ', 'CAMISETA CRUZ')],
    bottom: [T('JEANS', 'JEANS', 'JEANS'), T('BLACK PANTS', 'PANTALÓN NEGRO', 'CALÇA PRETA'), T('SHORTS', 'SHORTS', 'SHORTS'), T('SKIRT', 'FALDA', 'SAIA'), T('CARGO', 'CARGO', 'CARGO'), T('LEATHER', 'CUERO', 'COURO')],
    acc: [T('NONE', 'NADA', 'NADA'), T('SUNGLASSES', 'LENTES', 'ÓCULOS'), T('CAP', 'GORRA', 'BONÉ'), T('BANDANA', 'BANDANA', 'BANDANA'), T('HEADPHONES', 'AURICULARES', 'FONES'), T('CHAINS', 'CADENAS', 'CORRENTES'), T('FACE PAINT', 'PINTURA', 'PINTURA'), T('BEANIE', 'GORRO', 'TOUCA')]
  };
  function newLook() { return { skin: 0, hair: 2, hc: 0, expr: 1, top: 1, bottom: 1, acc: 0, wide: false }; }

  U.openCreator = function () {
    cre = { look: newLook(), gender: 'x', name: '' };
    U.mode = 'creator';
    U.screen('creator');
    buildCreator();
  };
  function buildCreator() {
    $('#c-title').textContent = EM.tr(S.creatorTitle);
    $('#c-name-l').textContent = EM.tr(S.name);
    const inp = $('#c-name'); inp.placeholder = EM.tr(S.namePh); inp.value = cre.name;
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
    g.fillStyle = C.D; g.fillRect(0, 0, cv.width, cv.height);
    const spr = EM.person(cre.look, 'd', 0, 'stand');
    g.drawImage(spr, 0, 0, 14 * 8, 22 * 8);
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
      U.startNight(player);
    });
  }

  /* ------------------------------------------------------------ start / continue */
  U.startNight = function (player) {
    EM.clearSave();
    EM.state = EM.newState(player);
    EM.story.init(EM.state);
    U.screen('game'); U.mode = 'play';
    E.paused = true; show('dialog', false); show('menu', false);
    E.enter('doors', 3, 8, 'r');
    E.fade = 1; E.fadeIn();
    EM.audio.ensure();
    $('#toasts').textContent = '';
    setTimeout(function () { EM.hooks.script('intro'); }, 450);
    U.postHeight();
  };
  U.continueNight = function () {
    const s = EM.load(); if (!s) return;
    EM.state = s;
    U.screen('game'); U.mode = 'play';
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

  function bar(label, v) {
    const r = el('div', 'rbar'); r.appendChild(el('span', 'k', label));
    const b = el('span', 'mbar'); const f = el('span', 'mfill'); f.style.width = Math.round(v) + '%'; b.appendChild(f); r.appendChild(b);
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
    ['maru', 'dani', 'tato'].forEach(function (f) {
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
    fb.appendChild(bar(EM.tr(EM.UI.funL), s.stats.fun)); fb.appendChild(bar(EM.tr(EM.UI.socL), s.stats.soc)); fb.appendChild(bar(EM.tr(EM.UI.hpL), s.stats.hp)); fb.appendChild(bar(EM.tr(EM.UI.weirdL), s.stats.weird));
    $('#e-again').textContent = EM.tr(S.again);
    EM.clearSave();
    E.fade = 0; E.fadeDir = 0;
    U.postHeight();
    window.scrollTo(0, 0);
  }

  function drawEndingArt(kind) {
    const cv = $('#e-art'); const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    const W = cv.width, H = cv.height;
    const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    g.fillStyle = C.K; g.fillRect(0, 0, W, H);
    function dither(x, y, w, h, dens, c1, c2) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { g.fillStyle = B[((y + j) & 3) * 4 + ((x + i) & 3)] / 16 < dens ? c1 : (c2 || C.K); g.fillRect(x + i, y + j, 1, 1); } }
    const player = EM.state.player.look;
    function person(look, x, y, dir) { const sp = EM.person(look, dir || 'd', 0, 'stand'); g.drawImage(sp, x, y); }
    if (kind === 'sunrise') {
      for (let y = 0; y < 48; y++) dither(0, y, W, 1, (1 - y / 48) * 0.95, C.W, C.K);
      g.fillStyle = C.W; g.fillRect(W / 2 - 9, 36, 18, 12); g.fillRect(W / 2 - 6, 33, 12, 3);
      g.fillStyle = C.D; [[2, 40, 14, 14], [20, 34, 10, 20], [34, 42, 16, 12], [78, 38, 12, 16], [94, 44, 14, 10], [110, 36, 14, 18]].forEach(function (b) { g.fillRect(b[0], b[1], b[2], b[3]); });
      g.fillStyle = C.G; g.fillRect(0, 52, W, 20);
      g.fillStyle = C.W; g.fillRect(0, 52, W, 1);
      const party = ['maru', 'dani', 'tato'].filter(function (f) { return EM.state.party.indexOf(f) !== -1; });
      person(player, 52, 31 + 0);
      party.forEach(function (f, i) { person(EM.CAST[f].look, 68 + i * 16, 31); });
    } else if (kind === 'door') {
      dither(0, 0, W, 40, 0.15, C.G, C.K);
      g.fillStyle = C.D; g.fillRect(0, 40, W, 32); g.fillStyle = C.W; g.fillRect(0, 40, W, 1);
      g.fillStyle = C.W; g.fillRect(70, 8, 34, 54); g.fillStyle = C.K; g.fillRect(73, 11, 28, 51);
      dither(73, 11, 28, 51, 0.5, C.W, C.K);
      person(EM.CAST.dragan.look, 54, 30, 'r'); person(player, 38, 36, 'r');
    } else if (kind === 'siren') {
      g.fillStyle = C.D; g.fillRect(0, 44, W, 28);
      for (let k = 0; k < 6; k++) dither(0, 4 + k * 7, W, 6, 0.3 + (k % 2) * 0.25, C.W, C.K);
      g.drawImage(EM.icon('cross'), W / 2 - 16, 16, 32, 32);
      person(player, W / 2 - 7, 48, 'd');
    } else if (kind === 'bench') {
      for (let y = 0; y < 50; y++) dither(0, y, W, 1, 0.1 + y / 120, C.G, C.K);
      g.fillStyle = C.W; g.fillRect(100, 8, 8, 8); g.fillStyle = C.K; g.fillRect(103, 8, 6, 8);
      g.fillStyle = C.W; g.fillRect(34, 50, 60, 4); g.fillStyle = C.G; g.fillRect(36, 54, 3, 10); g.fillRect(88, 54, 3, 10);
      person(player, 58, 33, 'd');
    } else if (kind === 'road') {
      g.fillStyle = C.D; g.fillRect(0, 40, W, 32); g.fillStyle = C.W; for (let x = 4; x < W; x += 20) g.fillRect(x, 56, 10, 2);
      dither(0, 0, W, 40, 0.35, C.G, C.K);
      g.fillStyle = C.W; g.fillRect(84, 34, 28, 10); g.fillRect(90, 30, 16, 4); g.fillStyle = C.K; g.fillRect(92, 31, 12, 3); g.fillStyle = C.W; g.fillRect(96, 26, 6, 3);
      person(player, 46, 30, 'r');
    } else {
      dither(0, 0, W, H, 0.2, C.G, C.K);
      person(player, W / 2 - 7, 24, 'd');
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
    $('#e-again').addEventListener('click', U.toTitle);
    $$('.langbtn').forEach(function (b) { b.addEventListener('click', function () { const l = b.getAttribute('data-l'); EM.setLang(l); try { localStorage.setItem('preferred-lang', l); } catch (e) { /* ignore */ } }); });
    EM.onLang = function () {
      renderTitle();
      if (U.mode === 'creator') buildCreator();
      if (U.mode === 'dialog' && U.D) { /* re-render current page */ }
    };
    window.addEventListener('storage', function (e) { if (e.key === 'preferred-lang' && e.newValue) EM.setLang(e.newValue); });
    window.addEventListener('message', function (e) { if (e.origin === window.location.origin && e.data && e.data.type === 'set-lang') EM.setLang(e.data.lang); });
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

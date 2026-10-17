/* EXCUSE ME — UI layer: input, HUD, toasts, dialogue (incl. gesture mode), menu, travel, hooks. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, E = EM.engine, $ = EM.$;
  const U = EM.ui = { mode: 'title', D: null, keys: {} };

  /* ------------------------------------------------------------ UI strings */
  const UI = EM.UI = {
    talk: T('TALK', 'HABLAR', 'FALAR'), use: T('USE', 'USAR', 'USAR'), excuse: T('EXCUSE ME', 'CON PERMISO', 'COM LICENÇA'),
    objective: T('OBJECTIVE', 'OBJETIVO', 'OBJETIVO'),
    fun: T('FUN', 'DIVERSIÓN', 'DIVERSÃO'), soc: T('SOCIAL', 'SOCIAL', 'SOCIAL'), hp: T('HEALTH', 'SALUD', 'SAÚDE'), weird: T('WEIRD', 'RARITO', 'ESTRANHO'),
    funL: T('FUN', 'DIVERSIÓN', 'DIVERSÃO'), socL: T('SOCIAL BATTERY', 'BATERÍA SOCIAL', 'BATERIA SOCIAL'), hpL: T('HEALTH', 'SALUD', 'SAÚDE'), weirdL: T('WEIRDNESS', 'RAREZA', 'ESTRANHEZA'),
    menu: T('MENU', 'MENÚ', 'MENU'), mute: T('SOUND', 'SONIDO', 'SOM'), close: T('CLOSE', 'CERRAR', 'FECHAR'),
    status: T('STATUS', 'ESTADO', 'ESTADO'), quests: T('LOG', 'DIARIO', 'DIÁRIO'), settings: T('SETTINGS', 'AJUSTES', 'AJUSTES'),
    save: T('SAVE', 'GUARDAR', 'SALVAR'), saved: T('SAVED', 'GUARDADO', 'SALVO'), title: T('TITLE SCREEN', 'PANTALLA DE INICIO', 'TELA INICIAL'),
    calm: T('CALM MODE: no sway or screen shake', 'MODO CALMO: sin vaivén ni temblor', 'MODO CALMO: sem balanço nem tremor'),
    norhythm: T('NO-RHYTHM MODE: dance moves ignore timing', 'MODO SIN RITMO: los pasos ignoran el tiempo', 'MODO SEM RITMO: os passos ignoram o tempo'),
    soundOn: T('SOUND', 'SONIDO', 'SOM'),
    on: T('ON', 'SÍ', 'LIGADO'), off: T('OFF', 'NO', 'DESLIGADO'),
    items: T('POCKETS', 'BOLSILLOS', 'BOLSOS'), water: T('WATER BOTTLE', 'BOTELLA DE AGUA', 'GARRAFA DE ÁGUA'),
    fxNone: T('NOTHING IN YOUR SYSTEM BUT THE MUSIC', 'NADA EN TU CUERPO SALVO LA MÚSICA', 'NADA NO CORPO ALÉM DA MÚSICA'),
    effects: T('RIGHT NOW', 'AHORA MISMO', 'AGORA'), keysHelp: T('ARROWS move // Z talk / confirm // X leave // P menu // Z in a crowd = EXCUSE ME', 'FLECHAS mover // Z hablar / confirmar // X salir // P menú // Z en la multitud = CON PERMISO', 'SETAS mover // Z falar / confirmar // X sair // P menu // Z na multidão = COM LICENÇA'),
    leave: T('[X] WALK AWAY', '[X] ALEJARSE', '[X] SE AFASTAR'), more: T('Z ▼', 'Z ▼', 'Z ▼'), drained: T('TOO DRAINED', 'SIN BATERÍA', 'SEM BATERIA'),
    silent: T('Say nothing. Back away.', 'No decir nada. Retroceder.', 'Não dizer nada. Recuar.'),
    time: T('TIME', 'HORA', 'HORA'), none: T('nothing yet', 'nada todavía', 'nada ainda'),
    done: T('DONE', 'HECHO', 'FEITO'), active: T('ACTIVE', 'ACTIVO', 'ATIVO'),
    leaveVenue: T('Leave the venue?', '¿Salir del lugar?', 'Sair do lugar?')
  };
  U.t = function (k) { return EM.tr(UI[k]); };

  const TONE = {
    chill: T('CHILL', 'TRANQUI', 'TRANQUILO'), smooth: T('SMOOTH', 'ENCANTO', 'CHARME'), blunt: T('BLUNT', 'DIRECTO', 'DIRETO'),
    hug: T('HUG', 'ABRAZO', 'ABRAÇO'), lie: T('LIE', 'MENTIRA', 'MENTIRA'), honest: T('HONEST', 'SINCERO', 'SINCERO'), joke: T('JOKE', 'BROMA', 'PIADA'),
    push: T('PUSH', 'EMPUJAR', 'EMPURRAR'), silent: T('SILENT', 'SILENCIO', 'SILÊNCIO'), care: T('CARE', 'CUIDAR', 'CUIDAR'), bold: T('BOLD', 'ATREVIDO', 'OUSADO'),
    rant: T('RANT', 'DESAHOGO', 'DESABAFO'), sober: T('CLEAR', 'LÚCIDO', 'LÚCIDO'), go: T('GO', 'IR', 'IR'), stay: T('STAY', 'QUEDARSE', 'FICAR'), dance: T('DANCE', 'BAILAR', 'DANÇAR'),
    ask: T('ASK', 'PREGUNTAR', 'PERGUNTAR'), yes: T('YES', 'SÍ', 'SIM'), no: T('NO', 'NO', 'NÃO'), flirt: T('FLIRT', 'COQUETEO', 'PAQUERA'), water: T('WATER', 'AGUA', 'ÁGUA'),
    pay: T('PAY', 'PAGAR', 'PAGAR'), sorry: T('SORRY', 'PERDÓN', 'DESCULPA'), fight: T('FIGHT', 'PELEA', 'BRIGA'), plan: T('PLAN', 'PLAN', 'PLANO')
  };
  const SOCIAL_TONES = { chill: 1, smooth: 1, joke: 1, hug: 1, flirt: 1, bold: 1, care: 1 };

  /* ------------------------------------------------------------ small helpers */
  function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; }
  U.el = el;
  function show(id, on) { const e = $('#' + id); if (e) e.hidden = !on; }
  U.show = show;
  U.screen = function (name) {
    ['title', 'creator', 'game', 'ending'].forEach(function (n) { show('screen-' + n, n === name); });
    U.mode = name === 'game' ? U.mode : name;
    postHeight();
  };

  function postHeight() {
    if (window.parent === window) return;
    const h = Math.ceil(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
    window.parent.postMessage({ type: 'resize-games-iframe', height: h }, window.location.origin);
  }
  U.postHeight = postHeight;

  /* ------------------------------------------------------------ toasts */
  U.toast = function (spec) {
    const box = $('#toasts'); if (!box) return;
    const t = el('div', 'toast ' + (spec.kind || 'info'));
    if (spec.icon && EM.hasIcon(spec.icon)) { const c = EM.mkCanvas(8, 8); c.getContext('2d').drawImage(EM.icon(spec.icon), 0, 0); c.className = 'ico'; t.appendChild(c); }
    t.appendChild(document.createTextNode(EM.tr(spec.text)));
    box.appendChild(t);
    while (box.children.length > 4) box.removeChild(box.firstChild);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, spec.ms || 3400);
  };
  EM.hooks.toast = U.toast;
  EM.hooks.bark = function (txt, kind) { U.toast({ text: txt, kind: kind === 'bad' ? 'bad' : 'bark', ms: 2200 }); };
  EM.hooks.sfx = function (k) { EM.audio.blip(k); };
  EM.hooks.stat = function (name, d) {
    if (Math.abs(d) < 0.5) return;
    const b = $('#bar-' + name); if (!b) return;
    b.classList.remove('up', 'down'); void b.offsetWidth;
    b.classList.add(d > 0 ? ((name === 'weird') ? 'down' : 'up') : ((name === 'weird') ? 'up' : 'down'));
    setTimeout(function () { b.classList.remove('up', 'down'); }, 700);
  };

  /* ------------------------------------------------------------ HUD */
  let lastHud = '';
  U.hud = function () {
    const s = EM.state; if (!s) return;
    const st = s.stats;
    const sig = [Math.round(st.fun), Math.round(st.soc), Math.round(st.hp), Math.round(st.weird), EM.clockStr(s.time), s.zone, EM.lang, U.mode, Object.keys(s.fx).join()].join('|');
    if (sig === lastHud) return;
    lastHud = sig;
    ['fun', 'soc', 'hp', 'weird'].forEach(function (k) {
      const v = Math.round(st[k]);
      const fill = $('#bar-' + k + ' .fill'); if (fill) fill.style.width = (Math.ceil(v / 10) * 10) + '%';
      const num = $('#bar-' + k + ' .num'); if (num) num.textContent = v;
      const lab = $('#bar-' + k + ' .lab'); if (lab) lab.textContent = EM.tr(UI[k]);
    });
    $('#bar-weird').classList.toggle('alert', st.weird >= 70);
    $('#bar-soc').classList.toggle('alert', st.soc <= 15);
    $('#bar-hp').classList.toggle('alert', st.hp <= 25);
    $('#bar-fun').classList.toggle('alert', st.fun <= 10);
    $('#hud-clock').textContent = EM.clockStr(s.time);
    const z = EM.zones[s.zone]; if (z) $('#hud-place').textContent = EM.tr(z.name);
    const fx = Object.keys(s.fx).map(function (k) { return EM.tr(EM.FXNAME[k]); });
    if (s.drinks >= 1) fx.push(EM.tr(EM.FXNAME.drunk));
    if (s.thirst > 120) fx.push(EM.tr(EM.FXNAME.thirsty));
    $('#hud-fx').textContent = fx.join(' · ');
    $('#hud-water').textContent = '≈ ' + (s.items.water || 0);
    $('#btn-menu').textContent = EM.tr(UI.menu);
    $('#btn-mute').textContent = EM.tr(UI.mute) + ': ' + EM.tr(EM.settings.mute ? UI.off : UI.on);
  };

  U.hint = function () {
    const s = EM.state; if (!s) return;
    const h = $('#hint-prompt'), o = $('#hint-obj');
    if (U.mode === 'play') {
      const t = E.target;
      let p = '';
      if (t) {
        if (t.type === 'npc') { const c = EM.CAST[t.cast]; p = '[Z] ' + EM.tr(UI.talk) + ' — ' + (c ? c.name : ''); }
        else p = '[Z] ' + EM.tr(t.def.label || UI.use);
      } else p = '[Z] ' + EM.tr(UI.excuse);
      h.textContent = p;
    }
    if (EM.story && EM.story.objective) o.textContent = EM.tr(UI.objective) + ': ' + EM.tr(EM.story.objective(s));
  };

  /* ------------------------------------------------------------ input */
  const KEYMAP = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', KeyW: 'u', KeyS: 'd', KeyA: 'l', KeyD: 'r' };
  function updateInput() {
    const k = U.keys;
    E.input.x = (k.r ? 1 : 0) - (k.l ? 1 : 0);
    E.input.y = (k.d ? 1 : 0) - (k.u ? 1 : 0);
  }
  function unlockAudio() { EM.audio.ensure(); EM.audio.kick(); }

  U.rhythmKey = null; /* set by rhythm.js */

  window.addEventListener('keydown', function (e) {
    unlockAudio();
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) { if (e.key === 'Enter' && U.mode === 'creator') return; if (e.key !== 'Escape') return; }
    const dir = KEYMAP[e.code];
    const inGame = U.mode === 'play' || U.mode === 'dialog' || U.mode === 'rhythm' || U.mode === 'menu';
    if (inGame && (dir || e.code === 'Space' || e.code === 'Tab')) e.preventDefault();
    if (U.mode === 'play') {
      if (dir) { U.keys[dir] = true; updateInput(); }
      else if (e.code === 'KeyZ' || e.code === 'Enter' || e.code === 'Space') { if (!e.repeat) E.interact(); }
      else if (e.code === 'Escape' || e.code === 'KeyP' || e.code === 'Tab') U.openMenu();
      else if (e.code === 'KeyM') U.toggleMute();
    } else if (U.mode === 'dialog') {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') U.dlgMove(-1);
      else if (e.code === 'ArrowDown' || e.code === 'KeyS') U.dlgMove(1);
      else if (e.code === 'ArrowLeft' || e.code === 'KeyA') U.dlgMove(-1, true);
      else if (e.code === 'ArrowRight' || e.code === 'KeyD') U.dlgMove(1, true);
      else if (e.code === 'KeyZ' || e.code === 'Enter' || e.code === 'Space') { if (!e.repeat) U.dlgConfirm(); }
      else if (e.code === 'KeyX' || e.code === 'Escape') U.dlgLeave();
      else if (/^Digit[1-9]$/.test(e.code)) U.dlgPick(parseInt(e.code.slice(5), 10) - 1);
    } else if (U.mode === 'rhythm') {
      if (dir && !e.repeat && U.rhythmKey) U.rhythmKey(dir.toUpperCase());
      else if (e.code === 'KeyX' || e.code === 'Escape') { if (U.rhythmCancel) U.rhythmCancel(); }
    } else if (U.mode === 'menu') {
      if (e.code === 'Escape' || e.code === 'KeyP') U.closeMenu();
    }
  });
  window.addEventListener('keyup', function (e) {
    const dir = KEYMAP[e.code];
    if (dir) { U.keys[dir] = false; updateInput(); }
  });
  window.addEventListener('blur', function () { U.keys = {}; updateInput(); });
  ['pointerdown', 'touchstart', 'click'].forEach(function (ev) { window.addEventListener(ev, unlockAudio, { passive: true }); });

  /* touch pad */
  function bindTouch() {
    $$('.pad [data-k]').forEach(function (b) {
      const k = b.getAttribute('data-k');
      const down = function (ev) {
        ev.preventDefault(); unlockAudio();
        if (k === 'a') { if (U.mode === 'play') E.interact(); else if (U.mode === 'dialog') U.dlgConfirm(); return; }
        if (k === 'b') { if (U.mode === 'dialog') U.dlgLeave(); else if (U.mode === 'play') U.openMenu(); else if (U.mode === 'rhythm' && U.rhythmCancel) U.rhythmCancel(); return; }
        const d = { up: 'u', down: 'd', left: 'l', right: 'r' }[k];
        if (U.mode === 'rhythm' && U.rhythmKey) { U.rhythmKey(d.toUpperCase()); return; }
        if (U.mode === 'dialog') { U.dlgMove(d === 'u' || d === 'l' ? -1 : 1, d === 'l' || d === 'r'); return; }
        U.keys[d] = true; updateInput();
      };
      const up = function (ev) {
        ev.preventDefault();
        const d = { up: 'u', down: 'd', left: 'l', right: 'r' }[k];
        if (d) { U.keys[d] = false; updateInput(); }
      };
      b.addEventListener('pointerdown', down);
      b.addEventListener('pointerup', up);
      b.addEventListener('pointerleave', up);
      b.addEventListener('pointercancel', up);
      b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    });
  }
  const $$ = EM.$$;

  /* ------------------------------------------------------------ dialogue */
  const GARBLE_FROM = 'aeiou', GARBLE_TO = 'eiuoa';
  function garble(s, seed) {
    let out = '';
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      const r = EM.hash2(i, s.length, seed);
      if (r < 0.1 && /[a-z]/i.test(c)) out += c.toLowerCase() === c ? GARBLE_TO[(GARBLE_FROM.indexOf(c) + 5) % 5] || c : c;
      else if (r > 0.96 && /[a-z]/i.test(c)) out += c + c;
      else out += c;
    }
    return out;
  }

  function portrait(castId) {
    const c = $('#portrait'); if (!c) return;
    const g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = EM.PAL.D; g.fillRect(0, 0, c.width, c.height);
    const cast = EM.CAST[castId];
    if (!cast) return;
    const look = Object.assign({}, cast.look);
    const spr = EM.person(look, 'd', 0, 'stand');
    g.imageSmoothingEnabled = false;
    g.drawImage(spr, 2, 1, 28, 44);
  }
  U.portrait = portrait;

  U.startDialogue = function (id, opts) {
    const def = EM.DIALOGUES[id];
    if (!def) { console.warn('missing dialogue', id); return; }
    opts = opts || {};
    U.mode = 'dialog';
    E.paused = true; E.input.x = E.input.y = 0; U.keys = {};
    U.D = { id: id, def: def, npc: opts.npc || null, node: null, pages: [], page: 0, choices: [], sel: 0, state: 'text', onEnd: opts.onEnd || null, picked: null, seed: (Math.random() * 1000) | 0 };
    show('dialog', true);
    if (opts.npc) EM.state.res['talked_' + opts.npc] = true;
    gotoNode(def.start || 'a');
  };

  function curWho() {
    const D = U.D; const n = D.node;
    return (n && n.who) || D.def.who || (D.npc && EM.CAST[D.npc] ? D.npc : null);
  }

  function gotoNode(nid) {
    const D = U.D, s = EM.state;
    const n = D.def.nodes[nid];
    if (!n) { endDialogue(); return; }
    D.node = n; D.nid = nid; D.page = 0; D.state = 'text';
    if (n.do && !n.__applied) { applyDo(n.do); }
    if (s.ended && !D.def.endingScene) return;
    const pages = [].concat(n.text || []);
    D.pages = pages.length ? pages : [];
    if (n.branch) {
      /* conditional jump: branch: [{req, to}] */
      for (let i = 0; i < n.branch.length; i++) { if (L.req(n.branch[i].req)) { gotoNode(n.branch[i].to); return; } }
    }
    renderDialog();
  }

  function applyDo(d) {
    if (d.move) for (const k in d.move) E.moveNpc(k, d.move[k].x, d.move[k].y);
    L.apply(d, { dialogue: U.D && U.D.id });
  }

  function filterChoices(n) {
    const s = EM.state;
    let list = (n.choices || []).filter(function (c) { return L.req(c.req); });
    if (s.fx.glitch && list.length > 2) {
      /* bad signal: shuffled options, one missing */
      const r = EM.mulberry32(U.D.seed + list.length);
      list = list.slice().sort(function () { return r() - 0.5; });
      list.splice(Math.floor(r() * list.length), 1);
    }
    return list.map(function (c) {
      const drained = s.stats.soc < 15 && SOCIAL_TONES[c.tone];
      return { c: c, disabled: !!drained };
    });
  }

  function renderDialog() {
    const D = U.D, n = D.node;
    const who = curWho();
    const cast = who && EM.CAST[who];
    portrait(who);
    $('#dlg-name').textContent = cast ? cast.name : '';
    $('#dlg-role').textContent = D.def.role ? EM.tr(D.def.role) : '';
    const body = $('#dlg-text'), box = $('#dlg-choices');
    box.textContent = '';
    box.classList.toggle('gestures', !!n.gesture);
    body.classList.toggle('garbled', !!n.garble);
    if (D.page < D.pages.length) {
      D.state = 'text';
      let t = EM.tr(D.pages[D.page]);
      if (EM.state.fx.glitch && !n.gesture) t = garble(t, D.seed + D.page);
      body.textContent = t;
      const more = el('div', 'more', EM.tr(UI.more)); box.appendChild(more);
      more.addEventListener('click', function () { U.dlgConfirm(); });
      return;
    }
    D.state = 'choices';
    D.choices = filterChoices(n);
    body.textContent = D.pages.length ? EM.tr(D.pages[D.pages.length - 1]) : (D.react ? D.react : '');
    if (D.react) body.textContent = D.react;
    if (!D.choices.length) {
      /* no choices: auto-continue */
      if (n.next) { gotoNode(n.next); return; }
      endDialogue(); return;
    }
    D.sel = 0;
    D.choices.forEach(function (o, i) {
      const c = o.c;
      const b = el('button', 'choice' + (o.disabled ? ' disabled' : ''), '');
      b.type = 'button';
      if (n.gesture && c.icon) { const cv = EM.mkCanvas(8, 8); cv.getContext('2d').drawImage(EM.icon(c.icon), 0, 0); cv.className = 'gico'; b.appendChild(cv); }
      else b.appendChild(el('span', 'num', (i + 1) + ''));
      let label = EM.tr(c.t);
      if (EM.state.fx.glitch && !n.gesture) label = garble(label, D.seed + i * 7);
      if (c.tone && !EM.state.fx.glitch) { const tg = el('span', 'tone', '[' + (o.disabled ? EM.tr(UI.drained) : EM.tr(TONE[c.tone] || c.tone)) + ']'); b.appendChild(tg); }
      b.appendChild(document.createTextNode(' ' + label));
      if (o.disabled) b.setAttribute('aria-disabled', 'true');
      b.addEventListener('click', function () { D.sel = i; U.dlgConfirm(); });
      b.addEventListener('mouseenter', function () { D.sel = i; markSel(); });
      box.appendChild(b);
    });
    const hint = el('div', 'leave', EM.tr(UI.leave)); hint.addEventListener('click', U.dlgLeave); if (!D.def.forced) box.appendChild(hint);
    markSel();
  }

  function markSel() {
    const D = U.D; if (!D) return;
    $$('#dlg-choices .choice').forEach(function (b, i) { b.classList.toggle('sel', i === D.sel); });
  }

  U.dlgMove = function (d, horizontal) {
    const D = U.D; if (!D || D.state !== 'choices') return;
    const n = D.choices.length; if (!n) return;
    D.sel = (D.sel + d + n) % n; markSel(); EM.audio.blip('move');
  };
  U.dlgPick = function (i) {
    const D = U.D; if (!D || D.state !== 'choices' || i >= D.choices.length) return;
    D.sel = i; U.dlgConfirm();
  };
  U.dlgConfirm = function () {
    const D = U.D; if (!D) return;
    if (D.state === 'text') {
      D.page++;
      EM.audio.blip('move');
      renderDialog();
      return;
    }
    if (D.state === 'react') {
      D.react = null;
      const nx = D.pendingNext, pc = D.pendingCall;
      D.pendingNext = undefined; D.pendingCall = null;
      if (nx === null || nx === undefined) { endDialogue(); if (pc) pc(); } else gotoNode(nx);
      return;
    }
    if (D.state !== 'choices') return;
    const o = D.choices[D.sel]; if (!o) return;
    if (o.disabled) { U.toast({ text: UI.drained, kind: 'bad', ms: 1500 }); return; }
    let c = o.c;
    /* bad signal: sometimes you say something else entirely */
    if (EM.state.fx.glitch && D.choices.length > 1 && Math.random() < 0.25) {
      const others = D.choices.filter(function (x) { return x !== o && !x.disabled; });
      if (others.length) { c = EM.pick(others).c; U.toast({ text: T('That is not what you meant to say.', 'Eso no era lo que querías decir.', 'Não era isso que você queria dizer.'), kind: 'bad' }); }
    }
    EM.audio.blip('select');
    if (!c.free) { L.stat('soc', -1 - (c.bad ? 2 : 0)); L.addTime(1); }
    if (c.do) applyDo(c.do);
    if (EM.state.ended && !D.def.endingScene) { U.D = null; return; }
    D.lastChoice = c;
    const next = c.next === undefined ? null : c.next;
    const runCall = function () { if (c.call) { const f = EM.scripts[c.call]; if (f) f({ npc: D.npc, dialogue: D.id }); } };
    if (next !== null) runCall();
    if (c.react) {
      D.state = 'react';
      D.react = EM.tr(c.react);
      D.pendingNext = next;
      D.pendingCall = next === null ? runCall : null;
      $('#dlg-text').textContent = D.react;
      $('#dlg-text').classList.add('react');
      const box = $('#dlg-choices'); box.textContent = '';
      const more = el('div', 'more', EM.tr(UI.more)); box.appendChild(more); more.addEventListener('click', U.dlgConfirm);
      return;
    }
    $('#dlg-text').classList.remove('react');
    if (next === null) { endDialogue(); runCall(); } else gotoNode(next);
  };
  U.dlgLeave = function () {
    const D = U.D; if (!D || D.def.forced) return;
    if (D.state === 'react') return;
    L.stat('soc', -0.5);
    endDialogue(true);
  };

  function endDialogue(left) {
    const D = U.D; if (!D) return;
    const cb = D.onEnd, def = D.def;
    $('#dlg-text').classList.remove('react');
    show('dialog', false);
    U.D = null;
    if (EM.state.ended && !def.endingScene) return;
    if (EM.state.ended) { if (cb) cb(left); return; }
    U.mode = 'play'; E.paused = false; E.gateCool = 1.0;
    if (!left && def.after) { const f = EM.scripts[def.after]; if (f) f({}); }
    if (cb) cb(left);
    U.mode === 'play' && U.hint();
  }
  U.endDialogue = endDialogue;

  /* ------------------------------------------------------------ interactions with the world */
  EM.hooks.interact = function (ent) {
    const s = EM.state;
    if (ent.type === 'npc') {
      let id = ent.def.dlg;
      if (typeof id === 'function') id = id(s);
      if (typeof id === 'string' && id.indexOf('friend:') === 0) id = EM.story.friendDialogue(id.slice(7), s);
      if (!id) return;
      U.startDialogue(id, { npc: ent.cast, npcId: ent.id });
      return;
    }
    if (ent.type === 'obj') {
      const f = EM.objects[ent.kind];
      if (f) f(ent);
    }
  };

  /* generic world objects */
  EM.objects = {};
  EM.objects.water = function (ent) {
    U.startDialogue('obj_water', { onEnd: null });
  };
  EM.objects.rest = function (ent) {
    const s = EM.state;
    if ((s.cool[ent.id] || 0) > s.time) { U.toast({ text: T('You were just sitting here. Give your body a minute.', 'Acabas de estar sentado aquí. Dale un minuto a tu cuerpo.', 'Você acabou de estar sentado aqui. Dê um minuto ao seu corpo.'), kind: 'info' }); return; }
    U.startDialogue(ent.def.strong ? 'obj_rest_strong' : 'obj_rest', { onEnd: null, rest: ent.id });
    U.D.restId = ent.id;
  };
  EM.objects.dance = function (ent) {
    const s = EM.state;
    if ((s.cool[ent.id] || 0) > s.time) { U.toast({ text: T('The floor here is wrung out. Try another spot.', 'Este pedazo de pista está exprimido. Prueba otro lugar.', 'Esse pedaço de pista está espremido. Tente outro lugar.'), kind: 'info' }); return; }
    if (s.stats.hp < 12) { U.toast({ text: T('Your legs vote no.', 'Tus piernas votan que no.', 'Suas pernas votam que não.'), kind: 'bad' }); return; }
    U.freestyle(ent.id);
  };
  EM.objects.bar = function (ent) { U.startDialogue('bar_menu', { npc: 'nico' }); };
  EM.objects.smoke = function (ent) { U.startDialogue('obj_smoke', {}); };
  EM.objects.cat = function (ent) { U.startDialogue('obj_cat', {}); };
  EM.objects.stall = function (ent) { EM.hooks.script('stall_scene'); };
  EM.objects.peak = function (ent) { EM.hooks.script('peak_dance'); };
  EM.objects.sunrise = function (ent) { EM.hooks.script('sunrise'); };

  /* ------------------------------------------------------------ travel */
  U.travel = function (spec, silent) {
    if (U.travelling) return;
    U.travelling = true;
    const prevPaused = E.paused;
    E.paused = true; E.input.x = E.input.y = 0;
    E.fadeOut(function () {
      E.enter(spec.zone || spec.to, spec.tx !== undefined ? spec.tx : spec.x, spec.ty !== undefined ? spec.ty : spec.y, spec.dir);
      U.travelling = false;
      E.fadeIn();
      if (U.mode === 'play') E.paused = false; else E.paused = prevPaused;
      if (EM.story && EM.story.enter) EM.story.enter(EM.state.zone);
      if (!silent && !EM.state.ended && !U.D && U.mode === 'play') EM.save();
    });
  };
  EM.hooks.travel = function (g) { U.travel({ zone: g.zone, tx: g.x, ty: g.y, dir: g.dir }); };
  EM.hooks.door = function (def) {
    if (def.to === 'street_exit') { EM.hooks.script('leave_venue'); return; }
    U.travel({ zone: def.to, tx: def.tx, ty: def.ty, dir: def.dir });
  };
  EM.hooks.script = function (name, ctx) {
    const f = EM.scripts[name];
    if (f) f(ctx || {}); else console.warn('missing script', name);
  };
  EM.hooks.zoneEntered = function (z) {
    $('#hud-place').textContent = EM.tr(z.name);
    U.hint();
  };
  EM.hooks.opened = function (id) {};

  /* ------------------------------------------------------------ built-in dialogues for objects */
  EM.DIALOGUES = EM.DIALOGUES || {};
  const D0 = EM.DIALOGUES;
  D0.obj_water = {
    forced: false, who: null,
    start: 'a', nodes: {
      a: {
        text: T('Clean water. Free. The most underrated thing in any club.', 'Agua limpia. Gratis. Lo más subestimado de cualquier club.', 'Água limpa. De graça. A coisa mais subestimada de qualquer club.'),
        choices: [
          { t: T('Drink a lot of it.', 'Tomar mucha.', 'Beber bastante.'), do: { water: true, time: 3 }, free: true, next: null, react: T('Cold. You feel your head clear a little.', 'Fría. Sientes que la cabeza se aclara un poco.', 'Gelada. Você sente a cabeça clarear um pouco.') },
          { t: T('Drink, then fill your bottle.', 'Tomar y llenar la botella.', 'Beber e encher a garrafa.'), req: function (s) { return s.items.water < 3; }, do: { water: true, item: { water: 1 }, time: 5 }, free: true, next: null },
          { t: T('Leave it.', 'Dejarlo.', 'Deixar.'), free: true, next: null }
        ]
      }
    }
  };
  D0.obj_rest = {
    start: 'a', nodes: {
      a: {
        text: T('A place to sit. Your feet file a formal thank-you.', 'Un lugar para sentarse. Tus pies presentan un agradecimiento formal.', 'Um lugar para sentar. Seus pés apresentam um agradecimento formal.'),
        choices: [
          { t: T('Sit for 20 minutes.', 'Sentarse 20 minutos.', 'Sentar por 20 minutos.'), free: true, do: { time: 20, hp: 4, soc: 8, fun: -3 }, call: 'mark_rest', next: null, react: T('You people-watch. Nobody asks you for anything.', 'Observas a la gente. Nadie te pide nada.', 'Você observa as pessoas. Ninguém te pede nada.') },
          { t: T('Sit for an hour.', 'Sentarse una hora.', 'Sentar por uma hora.'), free: true, do: { time: 60, hp: 9, soc: 16, fun: -8 }, call: 'mark_rest', next: null, react: T('The music keeps going. You come back a different shape.', 'La música sigue. Vuelves con otra forma.', 'A música continua. Você volta com outro formato.') },
          { t: T('Not now.', 'Ahora no.', 'Agora não.'), free: true, next: null }
        ]
      }
    }
  };
  D0.obj_rest_strong = {
    start: 'a', nodes: {
      a: {
        text: T('Mattresses on the floor. Low light. Someone has left a blanket folded like an offering.', 'Colchones en el piso. Luz baja. Alguien dejó una manta doblada como una ofrenda.', 'Colchões no chão. Luz baixa. Alguém deixou um cobertor dobrado como oferenda.'),
        choices: [
          { t: T('Lie down for 30 minutes.', 'Acostarse 30 minutos.', 'Deitar por 30 minutos.'), free: true, do: { time: 30, hp: 10, soc: 14, fun: -3, weird: -3 }, call: 'mark_rest', next: null },
          { t: T('Sleep it off for 90 minutes.', 'Dormir 90 minutos.', 'Dormir por 90 minutos.'), free: true, do: { time: 90, hp: 24, soc: 30, fun: -12, weird: -8 }, call: 'mark_rest', next: null, react: T('You wake up with a blanket you do not remember. The bass is still there, patient as a dog.', 'Despiertas con una manta que no recuerdas. El bajo sigue ahí, paciente como un perro.', 'Você acorda com um cobertor de que não lembra. O grave ainda está lá, paciente como um cachorro.') },
          { t: T('Not now.', 'Ahora no.', 'Agora não.'), free: true, next: null }
        ]
      }
    }
  };
  EM.scripts.mark_rest = function () {
    const D = U.D; const s = EM.state;
    if (D && D.restId) s.cool[D.restId] = s.time + 60;
  };
  D0.obj_smoke = {
    start: 'a', nodes: {
      a: {
        text: T('Someone offers you a light. The cold air has a little blue smoke in it.', 'Alguien te ofrece fuego. El aire frío trae un poco de humo azul.', 'Alguém te oferece fogo. O ar frio traz um pouco de fumaça azul.'),
        choices: [
          { t: T('Smoke one. Just to have something to do with your hands.', 'Fumar uno. Solo para hacer algo con las manos.', 'Fumar um. Só para ter o que fazer com as mãos.'), free: true, do: { time: 8, hp: -2, soc: 6, weird: 1 }, next: null, react: T('Eight minutes of nothing, shared with strangers. Not bad.', 'Ocho minutos de nada, compartidos con desconocidos. No está mal.', 'Oito minutos de nada, compartilhados com estranhos. Nada mal.') },
          { t: T('Just stand there and breathe the smoke second-hand.', 'Quedarte ahí y respirar el humo ajeno.', 'Ficar ali e respirar a fumaça dos outros.'), free: true, do: { time: 6, soc: 4 }, next: null },
          { t: T('Pass.', 'Pasar.', 'Passar.'), free: true, next: null }
        ]
      }
    }
  };
  D0.obj_cat = {
    start: 'a', nodes: {
      a: {
        text: T('A club cat. Nobody knows whose it is. It tolerates you.', 'Un gato del club. Nadie sabe de quién es. Te tolera.', 'Um gato do club. Ninguém sabe de quem é. Ele te tolera.'),
        choices: [
          { t: T('Pet the cat.', 'Acariciar al gato.', 'Fazer carinho no gato.'), free: true, do: { time: 5, soc: 10, fun: 4, flag: 'pet_cat' }, next: null, react: T('The cat closes its eyes. This is the best conversation you have had all night.', 'El gato cierra los ojos. Es la mejor conversación que has tenido en toda la noche.', 'O gato fecha os olhos. É a melhor conversa que você teve a noite toda.') },
          { t: T('Leave it alone.', 'Dejarlo en paz.', 'Deixar em paz.'), free: true, next: null }
        ]
      }
    }
  };

  /* ------------------------------------------------------------ menu */
  let menuTab = 'status';
  U.openMenu = function () {
    if (U.mode !== 'play') return;
    U.mode = 'menu'; E.paused = true; E.input.x = E.input.y = 0; U.keys = {};
    show('menu', true); renderMenu(); postHeight();
  };
  U.closeMenu = function () {
    show('menu', false); U.mode = 'play'; E.paused = false; postHeight();
  };
  function renderMenu() {
    const s = EM.state, box = $('#menu-body');
    $$('#menu-tabs button').forEach(function (b) {
      const id = b.getAttribute('data-tab');
      b.textContent = EM.tr(UI[id]);
      b.classList.toggle('on', id === menuTab);
    });
    box.textContent = '';
    if (menuTab === 'status') {
      [['funL', 'fun'], ['socL', 'soc'], ['hpL', 'hp'], ['weirdL', 'weird']].forEach(function (p) {
        const r = el('div', 'mrow'); r.appendChild(el('span', 'k', EM.tr(UI[p[0]])));
        const bar = el('span', 'mbar'); const f = el('span', 'mfill'); f.style.width = Math.round(s.stats[p[1]]) + '%'; bar.appendChild(f); r.appendChild(bar);
        r.appendChild(el('span', 'v', Math.round(s.stats[p[1]]) + '')); box.appendChild(r);
      });
      const fx = Object.keys(s.fx).map(function (k) { return EM.tr(EM.FXNAME[k]) + ' (' + Math.ceil(s.fx[k]) + ' min)'; });
      if (s.drinks >= 1) fx.push(EM.tr(EM.FXNAME.drunk));
      box.appendChild(el('p', 'mnote', EM.tr(UI.effects) + ': ' + (fx.length ? fx.join(' · ') : EM.tr(UI.fxNone))));
      box.appendChild(el('p', 'mnote', EM.tr(UI.items) + ': ' + EM.tr(UI.water) + ' ×' + (s.items.water || 0)));
      box.appendChild(el('p', 'mnote', EM.tr(UI.time) + ': ' + EM.clockStr(s.time)));
      box.appendChild(el('p', 'mnote dim', EM.tr(UI.keysHelp)));
    } else if (menuTab === 'quests') {
      const list = Object.keys(EM.QUESTS || {}).filter(function (id) { return s.quests[id]; });
      if (!list.length) box.appendChild(el('p', 'mnote', EM.tr(UI.none)));
      list.forEach(function (id) {
        const q = EM.QUESTS[id];
        const r = el('div', 'qrow ' + s.quests[id]);
        r.appendChild(el('span', 'qs', '[' + EM.tr(s.quests[id] === 'done' ? UI.done : UI.active) + ']'));
        r.appendChild(el('strong', '', ' ' + EM.tr(q.title)));
        r.appendChild(el('div', 'qd', EM.tr(s.quests[id] === 'done' && q.doneText ? q.doneText : q.desc)));
        box.appendChild(r);
      });
    } else if (menuTab === 'settings') {
      [['mute', 'soundOn', true], ['calm', 'calm'], ['noRhythm', 'norhythm']].forEach(function (p) {
        const key = p[0];
        const b = el('button', 'toggle', ''); b.type = 'button';
        const on = key === 'mute' ? !EM.settings.mute : EM.settings[key];
        b.textContent = '[' + (on ? 'X' : ' ') + '] ' + EM.tr(UI[p[1]]);
        b.addEventListener('click', function () {
          if (key === 'mute') U.toggleMute(); else { EM.settings[key] = !EM.settings[key]; EM.saveSettings(); }
          renderMenu();
        });
        box.appendChild(b);
      });
      const lr = el('div', 'langrow');
      ['en', 'es', 'pt'].forEach(function (l) {
        const b = el('button', EM.lang === l ? 'on' : '', l.toUpperCase()); b.type = 'button';
        b.addEventListener('click', function () { EM.setLang(l); try { localStorage.setItem('preferred-lang', l); } catch (e) { /* ignore */ } renderMenu(); });
        lr.appendChild(b);
      });
      box.appendChild(lr);
      const sv = el('button', '', EM.tr(UI.save)); sv.type = 'button';
      sv.addEventListener('click', function () { if (EM.save()) { sv.textContent = EM.tr(UI.saved); } });
      box.appendChild(sv);
      const tt = el('button', '', EM.tr(UI.title)); tt.type = 'button';
      tt.addEventListener('click', function () { EM.save(); U.closeMenu(); U.toTitle(); });
      box.appendChild(tt);
    }
    postHeight();
  }
  U.toggleMute = function () { EM.settings.mute = !EM.settings.mute; EM.saveSettings(); EM.audio.applyMute(); lastHud = ''; };

  /* ------------------------------------------------------------ init of bindings */
  U.bind = function () {
    bindTouch();
    $$('#menu-tabs button').forEach(function (b) { b.addEventListener('click', function () { menuTab = b.getAttribute('data-tab'); renderMenu(); }); });
    $('#menu-close').addEventListener('click', U.closeMenu);
    $('#btn-menu').addEventListener('click', function () { if (U.mode === 'play') U.openMenu(); else if (U.mode === 'menu') U.closeMenu(); });
    $('#btn-mute').addEventListener('click', U.toggleMute);
    window.addEventListener('resize', postHeight);
    if (window.ResizeObserver) new ResizeObserver(postHeight).observe(document.body);
    setTimeout(postHeight, 150);
  };
})();

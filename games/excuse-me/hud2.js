/* EXCUSE ME — HUD, part two: the objective banner, an expandable night log, and a real PAUSE. */
'use strict';
(function () {
  const EM = window.EM, U = EM.ui, E = EM.engine, T = EM.T;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const $ = function (id) { return document.getElementById(id); };
  const UI = {
    goal: t('OBJECTIVE', 'OBJETIVO', 'OBJETIVO'), expand: t('FULL LOG [L]', 'VER TODO [L]', 'VER TUDO [L]'), pause: t('PAUSE [O]', 'PAUSA [O]', 'PAUSAR [O]'),
    paused: t('PAUSED', 'EN PAUSA', 'EM PAUSA'), pausedBody: t('The night waits. Nothing moves, nothing drains.', 'La noche espera. Nada se mueve, nada se gasta.', 'A noite espera. Nada se move, nada se gasta.'),
    side: t('SIDE QUESTS', 'MISIONES SECUNDARIAS', 'MISSÕES SECUNDÁRIAS'), resume: t('RESUME [O]', 'SEGUIR [O]', 'CONTINUAR [O]'), newGoal: t('NEW OBJECTIVE', 'NUEVO OBJETIVO', 'NOVO OBJETIVO')
  };
  let lastGoal = null, flashUntil = 0;

  /* the objective: big, up top, and it flashes when it changes */
  EM.onObjective = function (txt) {
    const g = $('goal'), gt = $('goal-t'), gl = $('goal-l'); if (!g) return;
    gl.textContent = EM.tr(UI.goal); 
    if (txt !== lastGoal) {
      const first = lastGoal === null; lastGoal = txt; gt.textContent = txt;
      if (!first) { g.classList.add('flash'); flashUntil = performance.now() + 6000; setTimeout(function () { if (performance.now() >= flashUntil) g.classList.remove('flash'); }, 6100); U.toast({ icon: 'exclam', kind: 'info', ms: 5200, text: EM.tr(UI.newGoal) + ': ' + txt }); }
    }
  };

  /* pause: stops everything, with a clear way back */
  U.paused = false;
  U.pause = function () {
    if (U.mode !== 'play') return;
    U.mode = 'pause'; E.paused = true; E.input.x = E.input.y = 0; U.keys = {};
    const p = $('pause'); p.querySelector('h2').textContent = EM.tr(UI.paused); p.querySelector('p').textContent = EM.tr(UI.pausedBody); p.querySelector('button').textContent = EM.tr(UI.resume);
    p.hidden = false; U.paused = true;
    p.querySelector('button').focus && p.querySelector('button').focus({ preventScroll: true });
  };
  U.resume = function () {
    if (U.mode !== 'pause') return;
    $('pause').hidden = true; U.paused = false; U.mode = 'play'; E.paused = false;
  };
  /* the [C] [I] [O] [L] key hints mean nothing on a phone: drop them there so five buttons fit one row */
  const touchOnly = window.matchMedia ? window.matchMedia('(hover: none) and (pointer: coarse)') : { matches: false };
  function stripKeyHints() {
    if (!touchOnly.matches) return;
    ['btn-drink', 'btn-items', 'btn-pause', 'log-expand'].forEach(function (id) {
      const e = $(id); if (e) e.textContent = e.textContent.replace(/\s*\[[A-Z]\]\s*$/, '');
    });
    const rb = $('pause') && $('pause').querySelector('button'); if (rb) rb.textContent = rb.textContent.replace(/\s*\[[A-Z]\]\s*$/, '');
  }
  /* size the game column to the window height: chrome = everything above and below the stage */
  /* phones: ordinary dialogue is a sheet under the stage that borrows the D-pad's space and carries its own X and Z.
     Dance dialogues (node.pd) keep the arrow pad and the overlay. */
  function syncDialogSheet() {
    const g = $('screen-game'); if (!g) return;
    const d = U.mode === 'dialog' && U.D, pd = !!(d && U.D.node && U.D.node.pd);
    g.classList.toggle('dlg-sheet', !!d && !pd);
    const x = $('dlg-x'); if (x) x.hidden = !(d && !U.D.def.forced);
  }
  /* the real screen height. Inside the games hub the iframe is as tall as the game itself, so its own innerHeight says
     nothing about the screen: ask the same-origin parent (minus the host's fixed bottom tab bar). */
  function realH() {
    if (window.parent !== window) { try { return Math.max(320, window.parent.innerHeight - 72); } catch (e) { /* cross-origin: fall through */ } }
    return window.innerHeight;
  }
  function fit() {
    const app = $('app'), st = $('stage'), g = $('screen-game'); if (!app || !st || !g || g.hidden) return;
    if (g.classList.contains('dlg-sheet')) return; /* the layout is borrowed while a dialogue sheet is open */
    const pad = document.querySelector('.pad');
    if (pad && pad.offsetHeight) document.documentElement.style.setProperty('--dlg-room', Math.max(120, Math.round(Math.max(pad.getBoundingClientRect().bottom, $('logbox').getBoundingClientRect().bottom) - st.getBoundingClientRect().bottom - 4)) + 'px');
    const c = app.offsetHeight - st.offsetHeight, root = document.documentElement.style, rh = realH();
    if (root.getPropertyValue('--real-h') !== rh + 'px') root.setProperty('--real-h', rh + 'px');
    /* portrait phones: spend the spare height on a taller game view instead of dead space under the D-pad */
    if (E.setView) {
      const phone = window.matchMedia('(max-width: 700px)').matches, w = st.clientWidth - 4;
      if (!phone) E.setView(180);
      else if (w > 0) {
        const want = Math.floor((rh - c - 8) / (w / 320)), cur = E.size.h;
        if (Math.abs(want - cur) >= 8 || want < 180) E.setView(want);
      }
    }
    if (Math.abs(c - (parseFloat(root.getPropertyValue('--chrome')) || 0)) > 1) root.setProperty('--chrome', c + 'px');
  }
  function labels() {
    const b = { 'btn-pause': UI.pause, 'log-expand': UI.expand };
    Object.keys(b).forEach(function (id) { const e = $(id); if (e) e.textContent = EM.tr(b[id]); });
    const gl = $('goal-l'); if (gl) gl.textContent = EM.tr(UI.goal);
    const gs = $('goal-side'), st = EM.state;
    if (gs && st) { const n = Object.keys(st.quests || {}).filter(function (k) { return /^sq_/.test(k) && st.quests[k] === 'active'; }).length; gs.hidden = !n; if (n) gs.textContent = EM.tr(UI.side) + ': ' + n; }
    stripKeyHints(); syncDialogSheet();
    const p = $('pause'); if (p && !p.hidden) { p.querySelector('h2').textContent = EM.tr(UI.paused); p.querySelector('p').textContent = EM.tr(UI.pausedBody); p.querySelector('button').textContent = EM.tr(UI.resume); }
  }
  const hud0 = U.hud;
  U.hud = function () { hud0.apply(this, arguments); labels(); fit(); };

  function wire() {
    const bp = $('btn-pause'), be = $('log-expand'), pb = $('pause') && $('pause').querySelector('button');
    const dx = $('dlg-x'), dz = $('dlg-z');
    if (dx) dx.addEventListener('click', function () { U.dlgLeave(); });
    if (dz) dz.addEventListener('click', function () { U.dlgConfirm(); });
    const gsb = $('goal-side'); if (gsb) gsb.addEventListener('click', function () { U.openMenu('quests'); });
    if (bp) bp.addEventListener('click', function () { if (U.mode === 'pause') U.resume(); else U.pause(); });
    if (pb) pb.addEventListener('click', U.resume);
    if (be) be.addEventListener('click', function () { U.openMenu('nightlog'); });
    window.addEventListener('keydown', function (e) {
      if (e.repeat) return;
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.code === 'KeyO' || e.code === 'Pause') { if (U.mode === 'pause') U.resume(); else if (U.mode === 'play') U.pause(); e.preventDefault(); }
      else if (U.mode === 'pause' && (e.code === 'Escape' || e.code === 'Space' || e.code === 'Enter')) { U.resume(); e.preventDefault(); }
      else if (e.code === 'KeyL' && U.mode === 'play') U.openMenu('nightlog');
    });
    labels(); fit(); window.addEventListener('resize', fit); window.addEventListener('orientationchange', fit);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();

  const st = document.createElement('style');
  st.textContent = '#goal { display: flex; gap: 10px; align-items: center; margin-top: 6px; border: 2px solid var(--yel); background: var(--panel); padding: 3px 10px; font-size: 14px; line-height: 1.25; text-transform: uppercase; letter-spacing: 1px; min-height: 38px; }' +
    '#goal-l { background: var(--yel); color: #0A0A0A; padding: 3px 8px; font-size: 12px; flex: none; }' +
    '#goal-t { color: #FFFFFF; font-weight: bold; }' +
    '#goal-side { margin-left: auto; flex: none; min-height: 30px; padding: 2px 8px; font-size: 11px; border-color: var(--yel); color: var(--yel); }' +
    '.qhead { margin: 10px 0 4px; font-size: 12px; letter-spacing: 1px; color: var(--yel); border-bottom: 1px solid #4A4A5A; padding-bottom: 2px; }' +
    '#goal.flash { background: var(--yel); } #goal.flash #goal-t { color: #0A0A0A; } #goal.flash #goal-l { background: #0A0A0A; color: var(--yel); }' +
    '#log-expand { position: absolute; top: 4px; right: 6px; min-height: 28px; padding: 2px 8px; font-size: 11px; z-index: 2; }' +
    '#log-list { padding-right: 130px; }' +
    '#log-full { list-style: none; } #log-full li { border-left: 3px solid #6A6A7C; padding: 3px 0 3px 8px; margin-bottom: 5px; font-size: 13px; line-height: 1.4; }' +
    '#log-full li .lt { color: var(--muted); font-size: 11px; letter-spacing: 1px; margin-right: 6px; } #log-full li.good { border-left-color: var(--grn); } #log-full li.bad { border-left-color: var(--red); } #log-full li.info { border-left-color: var(--cyn); } #log-full li.fx { border-left-color: var(--yel); color: var(--yel); } #log-full li.react { border-left-color: var(--mag); font-style: italic; } #log-full li.bark { color: var(--muted); }' +
    '.goalline { color: var(--yel); font-weight: bold; }' +
    '#pause { position: absolute; inset: 0; z-index: 8; background: var(--bg); display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px; }' +
    '#pause[hidden] { display: none !important; } #pause .pbox { border: 2px solid var(--yel); padding: 22px 28px; background: var(--panel); max-width: 420px; } #pause h2 { color: var(--yel); font-size: 28px; margin-bottom: 8px; } #pause p { margin-bottom: 16px; font-size: 14px; }' +
    '@media (max-width: 700px) { #goal { font-size: 13px; padding: 5px 8px; } #log-expand { top: 2px; } }';
  document.head.appendChild(st);
})();

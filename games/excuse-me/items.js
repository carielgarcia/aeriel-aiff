/* EXCUSE ME — pockets: a water bottle you can sip from at will (C), and an ITEMS menu (I) to use what you carry.
   The bottle holds 4 sips; you can carry up to 3 bottles. The ITEMS menu is open to new things: push a function
   (box, state) onto EM.menuItems and it draws its own rows (sunglasses, gum, ...). */
'use strict';
(function () {
  const EM = window.EM, U = EM.ui, L = EM.logic, T = EM.T;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const SIPS = 4, MAX_BOTTLES = 3, MAX_SIPS = SIPS * MAX_BOTTLES;
  const UI = {
    drink: t('DRINK [C]', 'BEBER [C]', 'BEBER [C]'), items: t('ITEMS [I]', 'OBJETOS [I]', 'ITENS [I]'),
    bottle: t('WATER BOTTLE', 'BOTELLA DE AGUA', 'GARRAFA DE ÁGUA'), sips: t('sips left', 'tragos', 'goles'), sip1: t('sip left', 'trago', 'gole'),
    sip: t('SIP', 'TRAGO', 'GOLE'), empty: t('Your bottle is empty. There is water in the quiet room and at the bar.', 'Tu botella está vacía. Hay agua en la sala tranquila y en la barra.', 'Sua garrafa está vazia. Tem água na sala de calma e no bar.'),
    head: t('IN YOUR POCKETS:', 'EN TUS BOLSILLOS:', 'NOS SEUS BOLSOS:'), nothing: t('Nothing else yet.', 'Nada más por ahora.', 'Mais nada por enquanto.')
  };
  const SIP_LINES = [
    t('A cold sip. Your head clears a little.', 'Un trago frío. Se te aclara un poco la cabeza.', 'Um gole gelado. Sua cabeça clareia um pouco.'),
    t('You drink. Your mouth thanks you.', 'Tomas agua. Tu boca te lo agradece.', 'Você bebe. Sua boca agradece.'),
    t('A long swallow. The room gets a bit kinder.', 'Un trago largo. El cuarto se vuelve un poco más amable.', 'Um gole longo. A sala fica um pouco mais gentil.')
  ];

  EM.water = {
    SIPS: SIPS, MAX: MAX_SIPS,
    sips: function (s) { const b = s.items.water || 0; return Math.max(0, b * SIPS - (s.sipsUsed || 0)); }
  };

  /* drink a sip, whenever you like */
  let coolUntil = 0;
  EM.drink = function () {
    const s = EM.state; if (!s || s.ended || U.mode !== 'play') return false;
    const now = performance.now(); if (now < coolUntil) return false; coolUntil = now + 900;
    if (EM.water.sips(s) <= 0) { s.sipsUsed = 0; U.toast({ icon: 'water', kind: 'info', text: EM.tr(UI.empty), ms: 4200 }); return false; }
    s.sipsUsed = (s.sipsUsed || 0) + 1;
    if (s.sipsUsed >= SIPS) { s.items.water = Math.max(0, (s.items.water || 0) - 1); s.sipsUsed = 0; }
    s.thirst = Math.max(0, (s.thirst || 0) - 45);
    L.stat('hp', 1.5);
    EM.hooks.sfx('drink');
    U.toast({ icon: 'water', kind: 'good', ms: 2600, text: EM.tr(SIP_LINES[Math.floor(Math.random() * SIP_LINES.length)]) + ' (' + EM.water.sips(s) + ' ' + EM.tr(EM.water.sips(s) === 1 ? UI.sip1 : UI.sips) + ')' });
    if (U.hud) U.hud();
    return true;
  };

  /* the bottle meter in the HUD: one cell per sip, three bottles' worth */
  function meterCells(box) {
    if (box.__cells) return box.__cells;
    box.textContent = '';
    const lab = document.createElement('span'); lab.className = 'wlab'; box.appendChild(lab);
    const cells = document.createElement('span'); cells.className = 'wcells'; box.appendChild(cells);
    const arr = [];
    for (let i = 0; i < MAX_SIPS; i++) { const c = document.createElement('i'); if (i && i % SIPS === 0) c.className = 'gap'; cells.appendChild(c); arr.push(c); }
    box.__cells = { lab: lab, arr: arr };
    return box.__cells;
  }
  function paintHud() {
    const s = EM.state; if (!s) return;
    const box = document.getElementById('hud-water'); if (!box) return;
    const m = meterCells(box), n = EM.water.sips(s);
    m.arr.forEach(function (c, i) { c.classList.toggle('on', i < n); });
    m.lab.textContent = n + '/' + MAX_SIPS;
    box.title = EM.tr(UI.bottle) + ': ' + n + ' ' + EM.tr(UI.sips);
    const bd = document.getElementById('btn-drink'), bi = document.getElementById('btn-items');
    if (bd) { bd.textContent = EM.tr(UI.drink); bd.disabled = n <= 0 && false; }
    if (bi) bi.textContent = EM.tr(UI.items);
  }
  const hud0 = U.hud;
  U.hud = function () { hud0.apply(this, arguments); paintHud(); };

  /* ITEMS menu */
  EM.menuItems = EM.menuItems || [];
  EM.menuItems.unshift(function (box, s) {
    const row = U.el('div', 'stashrow');
    const n = EM.water.sips(s);
    const cells = U.el('span', 'wcells inrow');
    for (let i = 0; i < MAX_SIPS; i++) { const c = document.createElement('i'); if (i && i % SIPS === 0) c.className = 'gap'; if (i < n) c.classList.add('on'); cells.appendChild(c); }
    row.appendChild(U.el('span', 'stl', EM.tr(UI.bottle) + ' — ' + n + ' ' + EM.tr(UI.sips)));
    row.appendChild(cells);
    const b = U.el('button', '', EM.tr(UI.sip)); b.type = 'button'; b.disabled = n <= 0;
    b.addEventListener('click', function () { U.mode = 'play'; const ok = EM.drink(); U.mode = 'menu'; U.renderMenu(); if (!ok && n <= 0) U.toast({ icon: 'water', kind: 'info', text: EM.tr(UI.empty), ms: 3000 }); });
    row.appendChild(b); box.appendChild(row);
  });

  /* buttons and keys */
  function wire() {
    const bd = document.getElementById('btn-drink'), bi = document.getElementById('btn-items');
    if (bd) bd.addEventListener('click', function () { EM.drink(); });
    if (bi) bi.addEventListener('click', function () { U.openMenu('items'); });
    window.addEventListener('keydown', function (e) {
      if (e.repeat || U.mode !== 'play') return;
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.code === 'KeyC') EM.drink();
      else if (e.code === 'KeyI') U.openMenu('items');
    });
    paintHud();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();

  const st = document.createElement('style');
  st.textContent = '.water { display: inline-flex; align-items: center; gap: 6px; color: var(--cyn, #19D3FF); font-size: 11px; }' +
    '.wcells { display: inline-flex; gap: 1px; } .wcells i { display: block; width: 5px; height: 11px; border: 1px solid var(--cyn, #19D3FF); }' +
    '.wcells i.gap { margin-left: 3px; } .wcells i.on { background: var(--cyn, #19D3FF); }' +
    '.wcells.inrow { flex: none; } .hud-btns button:disabled, .stashrow button:disabled { opacity: .45; }' +
    '@media (pointer: coarse), (max-width: 700px) { .hud-btns button { min-height: 44px; min-width: 44px; } }' +
    '@media (max-width: 700px) { .hud-top { flex-wrap: wrap; } .hud-btns { flex-wrap: wrap; width: 100%; justify-content: space-between; } .hud-btns .water { flex: 1 0 100%; } .hud-btns button { flex: 1 1 auto; padding: 2px 6px; } }';
  document.head.appendChild(st);
})();

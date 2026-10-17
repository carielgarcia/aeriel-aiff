/* EXCUSE ME — core: namespace, i18n, RNG, state, save/load.
   Framework-free. Everything hangs off window.EM. */
'use strict';
(function () {
  const EM = window.EM = {};

  /* Monochrome palette (site rule: four values only). */
  EM.PAL = { K: '#0A0A0A', D: '#121212', G: '#7F7F7F', W: '#FFFFFF' };

  /* ---------------------------------------------------------------- i18n */
  EM.T = function (en, es, pt) { return { en: en, es: es, pt: pt }; };
  EM.lang = 'en';
  const VALID = ['en', 'es', 'pt'];

  EM.detectLang = function () {
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q && VALID.indexOf(q.toLowerCase()) !== -1) return q.toLowerCase();
    } catch (e) { /* ignore */ }
    try {
      const saved = localStorage.getItem('preferred-lang');
      if (VALID.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage unavailable */ }
    try {
      const pl = window.parent && window.parent !== window ? window.parent.document.documentElement.lang : '';
      if (VALID.indexOf(pl) !== -1) return pl;
    } catch (e) { /* cross-origin */ }
    const nav = (navigator.languages || [navigator.language || '']).map(function (l) { return (l || '').slice(0, 2).toLowerCase(); });
    for (let i = 0; i < nav.length; i++) if (VALID.indexOf(nav[i]) !== -1) return nav[i];
    return 'en';
  };

  EM.setLang = function (l) {
    if (VALID.indexOf(l) === -1) return;
    EM.lang = l;
    document.documentElement.lang = l;
    if (EM.onLang) EM.onLang(l);
  };

  /* {name} and gendered forms {masc|fem|neutral}. The player is gender-neutral by default,
     so the third form is always a rewording that avoids gender. */
  EM.fmt = function (s) {
    const st = EM.state;
    const p = st && st.player;
    const name = p && p.name ? p.name : 'YOU';
    const gi = p && p.gender === 'm' ? 0 : (p && p.gender === 'f' ? 1 : 2);
    return s.replace(/\{name\}/g, name).replace(/\{([^{}|]*)\|([^{}|]*)\|([^{}|]*)\}/g, function (m, a, b, c) { return [a, b, c][gi]; });
  };

  /* two of the three friends are renamed at display time (ids and save data stay tato / dani) */
  const NAMES = { Tato: { en: 'Fernando', es: 'Feña', pt: 'Fernando' }, Dani: { en: 'Benjamin', es: 'Benjamin', pt: 'Benjamin' } };
  /* the entourage: the first three carry the plot, Vale and Alex come along for the night */
  EM.FRIENDS = ['maru', 'dani', 'tato', 'vale', 'alex'];
  EM.coreCount = function (s) { return ['maru', 'dani', 'tato'].filter(function (f) { return s.party.indexOf(f) !== -1; }).length; };
  EM.rename = function (s) {
    if (typeof s !== 'string') return s;
    return s.replace(/\b(Tato|Dani)\b/gi, function (m) {
      const k = m.charAt(0).toUpperCase() + m.slice(1).toLowerCase(), n = NAMES[k][EM.lang] || NAMES[k].en;
      return m === m.toUpperCase() ? n.toUpperCase() : (m === m.toLowerCase() ? n.toLowerCase() : n);
    });
  };

  EM.tr = function (v) {
    if (v == null) return '';
    const s = typeof v === 'string' ? v : (v[EM.lang] || v.en || '');
    return EM.rename(EM.fmt(s));
  };

  /* ---------------------------------------------------------------- util */
  EM.clamp = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
  EM.mulberry32 = function (a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  EM.hash2 = function (x, y, s) {
    let h = (x * 374761393 + y * 668265263 + (s || 0) * 2147483647) | 0;
    h = Math.imul(h ^ h >>> 13, 1274126177);
    return ((h ^ h >>> 16) >>> 0) / 4294967296;
  };
  EM.pick = function (arr, r) { return arr[Math.floor((r === undefined ? Math.random() : r) * arr.length) % arr.length]; };
  EM.$ = function (s, root) { return (root || document).querySelector(s); };
  EM.$$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- state */
  /* Time is minutes since 22:00. The venue closes at 08:00 (minute 600). */
  EM.newState = function (player, carry) {
    carry = carry || {};
    return {
      v: 2,
      seed: carry.seed !== undefined ? carry.seed : (Math.random() * 1e9) | 0,
      attempt: carry.attempt || 1,
      lessons: carry.lessons || [],
      bad: 0,
      rep: 0,
      venue: carry.venue === 'rave' ? 'rave' : 'club',
      forgot: !!carry.forgot,
      recap: carry.recap || [],
      gags: carry.gags || {},
      player: player,
      zone: 'doors', x: 0, y: 0, dir: 'r',
      time: 60,
      stats: { fun: 55, soc: 85, hp: 90, weird: 0 },
      items: { water: 1 },
      flags: {},
      quests: {},
      bond: { maru: 0, dani: 0, tato: 0, vale: 0, alex: 0 },
      party: [],            // friends currently following you
      away: {},             // friend id -> zone id where they are
      res: {},              // resolved npc/object ids
      moved: {},            // npc id -> {x,y}
      cool: {},             // cooldowns: id -> game minute when usable again
      fx: {},               // status effects: name -> minutes left
      drinks: 0,
      thirst: 0,
      pill: { type: null, tested: false, taken: false, outcome: null },
      passouts: 0,
      warned: 0,
      seenZones: {},
      log: []
    };
  };

  EM.hasFlag = function (f) { return !!(EM.state && EM.state.flags[f]); };

  /* ---------------------------------------------------------------- save */
  const KEY = 'excuse-me-save-v2';
  EM.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(EM.state)); return true; } catch (e) { return false; }
  };
  EM.load = function () {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      return s && s.v === 2 ? s : null;
    } catch (e) { return null; }
  };
  EM.hasSave = function () { return !!EM.load(); };
  EM.clearSave = function () { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } };

  /* settings are per-viewer conveniences */
  EM.settings = { mute: false, calm: false, noRhythm: false, big: false };
  EM.loadSettings = function () {
    try {
      const s = JSON.parse(localStorage.getItem('excuse-me-settings') || '{}');
      Object.keys(EM.settings).forEach(function (k) { if (typeof s[k] === 'boolean') EM.settings[k] = s[k]; });
    } catch (e) { /* ignore */ }
    try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) EM.settings.calm = true; } catch (e) { /* ignore */ }
  };
  EM.saveSettings = function () {
    try { localStorage.setItem('excuse-me-settings', JSON.stringify(EM.settings)); } catch (e) { /* ignore */ }
  };
})();

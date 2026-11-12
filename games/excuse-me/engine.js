/* EXCUSE ME — world simulation and renderer (canvas 320x180, 16 px tiles).
   A black world with neon trim; the people carry the colour. */
'use strict';
(function () {
  const EM = window.EM;
  const TL = EM.TL, L = EM.logic, T = EM.T, N = EM.NEON;
  const TS = 16, VW = 320, RS = EM.RS; /* logic runs in logical pixels; the canvas is RS times bigger (the transform in draw()) */
  let VH = 180, camBias = 0; /* the view is 320 wide; on a portrait phone it grows taller (see E.setView) */
  const E = EM.engine = {};

  let cv, g, S, Z, R;
  E.paused = true;
  E.input = { x: 0, y: 0 };
  E.overlay = null;
  E.parting = 0; E.excuseCool = 0; E.gateCool = 0; E.bumpAcc = 0; E.justDoor = null; E.hostileCool = 0; E.reachT = 0;
  E.time = 0;
  E.target = null;
  E.fade = 0; /* 0..1 dither wipe */
  E.fadeDir = 0; E.fadeCb = null;
  E.reacts = [];
  const trail = [];
  const cueCool = {};
  let timeAcc = 0, stumble = 0, stumbleT = 0, lastPhase = '', murmurT = 0, bumpDark = {}, heldToast = 0;

  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  /* ------------------------------------------------------------ setup */
  E.init = function (canvas) {
    cv = canvas; cv.width = VW * RS; cv.height = VH * RS;
    g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
  };
  /* a taller view for portrait phones: more of the room above and below you. The player sits a little above
     centre so the dialogue panel, which covers the lower part of the stage, never hides them. */
  E.setView = function (h) {
    h = Math.max(180, Math.min(270, Math.round(h)));
    if (h === VH) return;
    VH = h; camBias = Math.round((VH - 180) * 0.3); E.size.h = VH; maskCanvas = null; maskData = null;
    if (cv) { cv.height = VH * RS; cv.style.aspectRatio = VW + ' / ' + VH; g = cv.getContext('2d'); g.imageSmoothingEnabled = false; }
  };
  E.zone = function () { return Z; };
  E.runtime = function () { return R; };

  const cache = {};
  function pool() {
    if (cache.pool) return cache.pool;
    const r = EM.mulberry32(77), p = [];
    for (let i = 0; i < 48; i++) {
      p.push({ skin: Math.floor(r() * 6), hair: Math.floor(r() * 9), hc: Math.floor(r() * 10), expr: 1 + Math.floor(r() * 3), top: Math.floor(r() * 11), tc: Math.floor(r() * 12), bottom: Math.floor(r() * 6), bc: Math.floor(r() * 10), acc: Math.floor(r() * 8), wide: false });
    }
    return (cache.pool = p);
  }

  /* ------------------------------------------------------------ zone loading */
  function buildStatic(z, variant) {
    /* the whole zone in device pixels: RS times the logical size, tiles drawn at 32x32 */
    const c = EM.mkCanvas(z.w * TS * RS, z.h * TS * RS); const cg = c.getContext('2d'); cg.imageSmoothingEnabled = false;
    const solid = function (x, y) { return EM.isSolidTile(z.get(x, y)); };
    for (let y = 0; y < z.h; y++) for (let x = 0; x < z.w; x++) {
      let t = z.get(x, y);
      if (t === TL.DANCE && variant === 'B') t = 'DANCE_B';
      EM.drawTile(cg, t, x * TS * RS, y * TS * RS, x, y, function (dx, dy) { return !solid(x + dx, y + dy) && z.get(x + dx, y + dy) !== TL.VOID; }, z.theme);
    }
    if (EM.decorateZone) EM.decorateZone(z, cg);
    /* signs: drawn in logical units under the render scale, so the text is the smooth font */
    z.signs.forEach(function (sg, i) {
      if (EM.passage && EM.passage.isSign(sg.text)) return; /* passage signs are generated from the doors below */
      const w = EM.textWidth(sg.text) + 4, h = 9, colr = i % 2 ? z.theme.b : z.theme.a;
      cg.save(); cg.scale(RS, RS); cg.translate(sg.x * TS + 1, sg.y * TS + 3); cg.scale(sg.scale, sg.scale);
      cg.fillStyle = '#07070A'; cg.fillRect(0, 0, w, h);
      cg.fillStyle = colr; cg.fillRect(0, 0, w, 1); cg.fillRect(0, h - 1, w, 1); cg.fillRect(0, 0, 1, h); cg.fillRect(w - 1, 0, 1, h);
      cg.fillStyle = 'rgba(255,255,255,0.10)'; cg.fillRect(1, 1, w - 2, 1);
      EM.drawText(cg, sg.text, 2, 2, EM.shade(colr, 0.45));
      cg.restore();
    });
    /* passage tags: one per doorway, centred on it, with an arrow towards the exit (map.js) */
    if (EM.passage) EM.passage.tags(z).forEach(function (tg, i) {
      const colr = i % 2 ? z.theme.b : z.theme.a;
      cg.save(); cg.scale(RS, RS); cg.translate(tg.x, tg.y);
      cg.fillStyle = '#07070A'; cg.fillRect(0, 0, tg.w, tg.h);
      cg.fillStyle = colr; cg.fillRect(0, 0, tg.w, 1); cg.fillRect(0, tg.h - 1, tg.w, 1); cg.fillRect(0, 0, 1, tg.h); cg.fillRect(tg.w - 1, 0, 1, tg.h);
      EM.drawText(cg, tg.text, 2, 2, EM.shade(colr, 0.45));
      cg.restore();
    });
    return c;
  }

  function normPos(d) {
    let x = d.x, y = d.y;
    if (!d.box) { if (x === Math.floor(x)) x += 0.5; if (y === Math.floor(y)) y += 0.5; }
    return { x: x, y: y };
  }

  function buildRuntime(z) {
    const r = { A: buildStatic(z, 'A'), B: null, ents: [], crowd: new Uint8Array(z.w * z.h), dancers: [], hasDance: false };
    for (let i = 0; i < z.tiles.length; i++) if (z.tiles[i] === TL.DANCE) { r.hasDance = true; break; }
    if (r.hasDance) r.B = buildStatic(z, 'B');
    z.ents.forEach(function (d) {
      const e = { def: d, id: d.id, type: d.type, kind: d.kind };
      if (d.type === 'door' || d.type === 'obj' || d.type === 'trig') {
        e.rect = { x: d.x * TS, y: d.y * TS, w: d.w * TS, h: d.h * TS };
      } else if (d.type === 'npc') {
        e.cast = d.cast || d.id;
      }
      r.ents.push(e);
    });
    return r;
  }

  function rebuildCrowd() {
    if (!Z || !R) return;
    const f = EM.crowdFactor(S.time);
    R.crowd.fill(0);
    Z.crowdRects.forEach(function (c) {
      const d = Math.max(0, Math.min(3, Math.round(c.base * f)));
      for (let y = c.y; y < c.y + c.h; y++) for (let x = c.x; x < c.x + c.w; x++) {
        if (x < 0 || y < 0 || x >= Z.w || y >= Z.h) continue;
        if (EM.isSolidTile(Z.get(x, y)) || Z.get(x, y) === TL.DOORF) { continue; }
        R.crowd[y * Z.w + x] = d;
      }
    });
    /* keep doors, gates and spawn corridors clear */
    Z.ents.forEach(function (e) {
      if (e.type === 'door' || e.type === 'obj') {
        for (let y = Math.floor(e.y) - 1; y < Math.ceil(e.y + e.h) + 1; y++) for (let x = Math.floor(e.x) - 1; x < Math.ceil(e.x + e.w) + 1; x++) if (x >= 0 && y >= 0 && x < Z.w && y < Z.h) R.crowd[y * Z.w + x] = 0;
      }
      if (e.type === 'npc' && e.box) {
        const p = normPos(e);
        for (let y = Math.floor(p.y - e.box.h / 2) - 1; y < Math.ceil(p.y + e.box.h / 2) + 1; y++) for (let x = Math.floor(p.x - e.box.w / 2) - 1; x < Math.ceil(p.x + e.box.w / 2) + 1; x++) if (x >= 0 && y >= 0 && x < Z.w && y < Z.h) R.crowd[y * Z.w + x] = 0;
      }
    });
    R.dancers = [];
    const p = pool();
    for (let y = 0; y < Z.h; y++) for (let x = 0; x < Z.w; x++) {
      const d = R.crowd[y * Z.w + x];
      if (!d) continue;
      const h0 = EM.hash2(x, y, 31 + Z.w);
      const n = d === 1 ? (h0 > 0.78 ? 1 : 0) : (d === 2 ? (h0 > 0.5 ? 1 : 0) : (h0 > 0.82 ? 2 : (h0 > 0.15 ? 1 : 0)));
      for (let k = 0; k < n; k++) {
        const hx = EM.hash2(x + k * 7, y, 5), hy = EM.hash2(x, y + k * 11, 9), hl = EM.hash2(x * 3 + k, y * 5, 2);
        const ha = EM.hash2(x * 5 + k * 3, y * 9 + k, 91);
        /* most people yield when you ask; some do not move; a few get nasty */
        const rp = EM.clamp(S.rep || 0, -4, 8); /* how the crowd has come to see you */
        const att = ha < 0.9 - 0.008 * rp ? 'yield' : (ha < 0.97 - 0.012 * rp || Z.id === 'rooftop' ? 'stubborn' : 'hostile');
        R.dancers.push({ x: x * TS + 3 + hx * 10, y: y * TS + 9 + hy * 7, look: p[Math.floor(hl * p.length)], ph: hx, tx: x, ty: y, att: att, id: 'hd_' + Z.id + '_' + x + '_' + y + '_' + k });
      }
    }
    R.dancers.sort(function (a, b) { return a.y - b.y; });
    lastPhase = EM.phaseOf(S.time);
  }

  E.enter = function (zoneId, tx, ty, dir) {
    S = EM.state;
    S.zone = zoneId; Z = EM.zones[zoneId];
    R = buildRuntime(Z);
    S.x = tx * TS + 8; S.y = ty * TS + 12; S.dir = dir || 'd';
    trail.length = 0;
    for (let i = 0; i < 90; i++) trail.push({ x: S.x, y: S.y, d: S.dir });
    E.parting = 0; E.bumpAcc = 0; E.gateCool = 0.6; E.reacts = []; E.reachT = 0; E.hostileCool = 2;
    E.justDoor = 'init';
    rebuildCrowd();
    applyAudio();
    S.seenZones[zoneId] = true;
    if (EM.hooks.zoneEntered) EM.hooks.zoneEntered(Z);
  };

  function applyAudio() {
    const a = Z.audio;
    let style = a.style;
    const ph = EM.phaseOf(S.time);
    if (style === 'auto') style = ph;
    else if (style === 'attic') style = ph === 'warm' ? 'techno' : (ph === 'techno' ? 'hard' : (ph === 'hard' ? 'hard' : 'closing'));
    EM.audio.setStyle(style);
    EM.audio.setZone(a.lp, a.wet);
  }
  E.applyAudio = applyAudio;

  /* ------------------------------------------------------------ entity helpers */
  function npcPos(e) {
    const mv = S.moved[e.id];
    if (mv) return mv;
    return normPos(e.def);
  }
  function npcRect(e) {
    const p = npcPos(e), d = e.def;
    if (d.box) return { x: p.x * TS - d.box.w * 8, y: p.y * TS - d.box.h * 8, w: d.box.w * TS, h: d.box.h * TS };
    return { x: p.x * TS - 5, y: p.y * TS - 1, w: 10, h: 7 };
  }
  function visible(e) { return !e.def.when || e.def.when(S); }

  /* Runtime list of NPC-like things currently present (including friends who are somewhere else). */
  function npcs() {
    const out = [];
    R.ents.forEach(function (e) { if (e.type === 'npc' && visible(e)) out.push(e); });
    EM.FRIENDS.forEach(function (f, i) {
      if (S.away[f] === Z.id && !S.party.includes(f)) {
        const spot = Z.friendAt[Z.id] || Z.friendAt['default'];
        if (!spot) return;
        const off = [[0, 0], [1.2, 0.9], [-1.1, 1.1], [2.3, 0.3], [-1.5, 0]][i];
        const ex = R.friendEnts && R.friendEnts[f];
        if (ex) { out.push(ex); return; }
        const fe = { id: 'fr_' + f, type: 'npc', cast: f, friend: f, def: { id: 'fr_' + f, x: spot.x + off[0] + 0.5, y: spot.y + off[1] + 0.5, reach: 18, dir: 'd', dlg: 'friend:' + f } };
        (R.friendEnts = R.friendEnts || {})[f] = fe;
        out.push(fe);
      } else if (R.friendEnts && R.friendEnts[f]) delete R.friendEnts[f];
    });
    return out;
  }

  function solidsList(list) {
    const out = [];
    list.forEach(function (e) {
      if (e.def.decor && e.def.nosolid) return;
      if (e.def.pose === 'lie') { const p = npcPos(e); out.push({ x: p.x * TS - 9, y: p.y * TS - 2, w: 18, h: 7, e: e }); return; }
      out.push(Object.assign(npcRect(e), { e: e }));
    });
    return out;
  }

  function tileSolid(px, py) {
    const tx = Math.floor(px / TS), ty = Math.floor(py / TS);
    if (tx < 0 || ty < 0 || tx >= Z.w || ty >= Z.h) return true;
    return EM.isSolidTile(Z.tiles[ty * Z.w + tx]);
  }
  function boxHitsRect(x, y, r) { return x - 3 < r.x + r.w && x + 3 > r.x && y - 4 < r.y + r.h && y > r.y; }
  function canStand(x, y, solids, overlapNow) {
    if (tileSolid(x - 3, y) || tileSolid(x + 3, y) || tileSolid(x - 3, y - 4) || tileSolid(x + 3, y - 4)) return false;
    for (let i = 0; i < solids.length; i++) {
      if (boxHitsRect(x, y, solids[i]) && !(overlapNow && overlapNow.indexOf(solids[i]) !== -1)) return false;
    }
    return true;
  }

  E.crowdAt = function (x, y) {
    const tx = Math.floor(x / TS), ty = Math.floor(y / TS);
    if (tx < 0 || ty < 0 || tx >= Z.w || ty >= Z.h) return 0;
    return R.crowd[ty * Z.w + tx];
  };

  /* ------------------------------------------------------------ interaction */
  function rectDist(px, py, r) {
    const dx = Math.max(r.x - px, 0, px - (r.x + r.w)), dy = Math.max(r.y - py, 0, py - (r.y + r.h));
    return Math.hypot(dx, dy);
  }

  function findTarget(list) {
    const dv = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] }[S.dir];
    const px = S.x + dv[0] * 7, py = S.y - 3 + dv[1] * 7;
    let best = null, bd = 1e9;
    list.forEach(function (e) {
      if (e.def.decor && !e.def.dlg) return;
      if (!e.def.dlg) return;
      const r = npcRect(e), reach = (e.def.reach || 12);
      const d = rectDist(px, py, r);
      if (d <= reach * 0.5 + 6 && d < bd) { bd = d; best = e; }
    });
    R.ents.forEach(function (e) {
      if (e.type !== 'obj' || !visible(e)) return;
      const d = rectDist(px, py, e.rect);
      if (d <= 7 && d < bd) { bd = d; best = e; }
    });
    return best;
  }

  E.interact = function () {
    if (E.paused) return;
    const t = E.target;
    if (t) { EM.hooks.interact(t, { manual: true }); return; }
    if (Z.id === 'darkroom') { E.reach(); return; }
    E.excuse();
  };

  /* In the dark room you cannot see. Z reaches out a hand and the space answers for a moment. */
  E.reach = function () {
    if (E.excuseCool > 0) return;
    E.excuseCool = 1.1; E.reachT = 1.15;
    L.stat('soc', -0.25);
    EM.hooks.sfx('select'); EM.audio.cue(0, 0.22, 'tap');
  };

  const BARKS = [
    T('Excuse me!', '¡Con permiso!', 'Com licença!'), T('Sorry, sorry — coming through.', 'Perdón, perdón, voy pasando.', 'Desculpa, desculpa — passando.'),
    T('Pardon me, thank you.', 'Permiso, gracias.', 'Licença, obrigado.'), T('Just squeezing past.', 'Solo me cuelo un poquito.', 'Só dando uma espremida.')
  ];
  const BUMPS = [
    T('HEY. WATCH IT.', 'OYE. CUIDADO.', 'EI. OLHA AÍ.'), T('Somebody just elbowed you out of the way.', 'Alguien te sacó a codazos.', 'Alguém te tirou do caminho a cotoveladas.'),
    T('"You could ask, you know."', '«Podrías pedir permiso, ¿no?»', '«Podia pedir licença, né.»'), T('You wade through a stranger\'s dance. They glare.', 'Cruzas el baile de un desconocido. Te mira mal.', 'Você atravessa a dança de um estranho. Ele te encara.')
  ];
  const HELD = T('Some people do not move. Not everyone is moved by a polite word.', 'Algunas personas no se mueven. No a todos los mueve una palabra amable.', 'Algumas pessoas não saem do lugar. Nem todo mundo se comove com uma palavra educada.');

  function react(d, icon) { E.reacts.push({ x: d.x, y: d.y, t: 1.4, icon: icon }); }
  function triggerHostile(d) {
    if (E.hostileCool > 0 || S.res[d.id]) return;
    /* most of the time a glare is all you get */
    if (Math.random() > 0.55 * (EM.hostileMul ? EM.hostileMul() : 1)) { E.hostileCool = 10; return; }
    E.hostileCool = 45;
    S.hostile = { id: d.id, look: d.look, kind: Math.floor(EM.hash2(d.tx, d.ty, 5) * 4) };
    setTimeout(function () { if (!E.paused && !EM.state.ended) EM.hooks.script('hostile_dancer', S.hostile); }, 420);
  }

  E.excuse = function () {
    if (E.excuseCool > 0) return;
    E.excuseCool = 1.0; E.parting = 2.8;
    const nearCrowd = E.crowdAt(S.x, S.y) > 0 || E.crowdAt(S.x + 12, S.y) > 0 || E.crowdAt(S.x - 12, S.y) > 0 || E.crowdAt(S.x, S.y - 12) > 0 || E.crowdAt(S.x, S.y + 12) > 0;
    if (nearCrowd) { L.stat('soc', -0.4); }
    EM.hooks.bark(EM.pick(BARKS), 'self');
    EM.hooks.sfx('select');
    /* not everybody listens */
    let held = false, hostile = null;
    R.dancers.forEach(function (d) {
      const dist = Math.hypot(d.x - S.x, d.y - S.y);
      if (dist > 40 || S.res[d.id]) return;
      if (d.att === 'stubborn') {
        react(d, 'hand'); held = true;
        /* nagging someone who already said no turns them */
        d.asked = (d.asked || 0) + 1;
        if (d.asked >= 4) { d.att = 'hostile'; react(d, 'anger'); L.stat('weird', 1); L.rep(0.5); if (dist < 30 && !hostile) hostile = d; }
      }
      else if (d.att === 'hostile') { react(d, 'anger'); if (dist < 30 && !hostile) hostile = d; }
    });
    if (held && E.time - heldToast > 25) { heldToast = E.time; EM.hooks.toast({ icon: 'hand', text: HELD, kind: 'info', ms: 4200 }); }
    if (hostile) triggerHostile(hostile);
  };
  E.settle = function (id) { S.res[id] = true; };

  /* ------------------------------------------------------------ update */
  E.update = function (dt) {
    E.time += dt;
    if (E.fadeDir) {
      E.fade += E.fadeDir * dt * 3.2;
      if (E.fadeDir > 0 && E.fade >= 1) { E.fade = 1; E.fadeDir = 0; const cb = E.fadeCb; E.fadeCb = null; if (cb) cb(); }
      else if (E.fadeDir < 0 && E.fade <= 0) { E.fade = 0; E.fadeDir = 0; }
    }
    if (!S || !Z) return;
    if (E.excuseCool > 0) E.excuseCool -= dt;
    if (E.parting > 0) E.parting -= dt;
    if (E.gateCool > 0) E.gateCool -= dt;
    if (E.hostileCool > 0) E.hostileCool -= dt;
    if (E.reachT > 0) E.reachT -= dt;
    if (E.reacts.length) { E.reacts.forEach(function (r) { r.t -= dt; }); E.reacts = E.reacts.filter(function (r) { return r.t > 0; }); }
    if (E.paused) return;

    /* the night clock */
    timeAcc += dt * 0.2 * EM.PACE; /* game minutes per real second: 0.2 at PACE 1 (a night of about 50 minutes); see EM.PACE in logic.js */
    while (timeAcc >= 1) { timeAcc -= 1; L.minute(); if (S.ended) return; }
    if (EM.phaseOf(S.time) !== lastPhase) { rebuildCrowd(); applyAudio(); }

    const list = npcs();
    const solids = solidsList(list);
    const overlapNow = solids.filter(function (r) { return boxHitsRect(S.x, S.y, r); });

    /* movement */
    let ix = E.input.x, iy = E.input.y;
    const moving = ix !== 0 || iy !== 0;
    let speed = 54 * L.speedMult();
    if (moving) {
      const d = E.crowdAt(S.x, S.y);
      if (d > 0) {
        speed *= E.parting > 0 ? (1 - 0.07 * d) : (1 - 0.17 * d);
        /* a stubborn body in the way does not care that you asked */
        for (let i = 0; i < R.dancers.length; i++) {
          const dn = R.dancers[i];
          if (dn.att !== 'stubborn' || S.res[dn.id]) continue;
          if (Math.abs(dn.x - S.x) < 11 && Math.abs(dn.y - S.y) < 8) { speed *= 0.45; break; }
        }
        if (E.parting <= 0) {
          E.bumpAcc += dt * d * 0.7;
          if (E.bumpAcc >= 2.0) {
            E.bumpAcc = 0; L.stat('soc', -1); L.stat('weird', 0.4 * (EM.bumpMul ? EM.bumpMul() : 1)); EM.hooks.bark(EM.pick(BUMPS), 'bad'); EM.hooks.sfx('warn');
            /* bump a hostile one and they notice */
            for (let i = 0; i < R.dancers.length; i++) {
              const dn = R.dancers[i];
              if (dn.att === 'hostile' && !S.res[dn.id] && Math.hypot(dn.x - S.x, dn.y - S.y) < 20) { react(dn, 'anger'); triggerHostile(dn); break; }
            }
          }
        }
      }
      if (ix && iy) { ix *= 0.7071; iy *= 0.7071; }
      if (Math.abs(E.input.x) >= Math.abs(E.input.y) && E.input.x) S.dir = E.input.x > 0 ? 'r' : 'l'; else if (E.input.y) S.dir = E.input.y > 0 ? 'd' : 'u';
    }
    let vx = ix * speed, vy = iy * speed;
    if (!EM.settings.calm && (L.high() >= 3 || S.fx.meth)) { const sw = Math.sin(E.time * 1.7) * 9; vx += (iy ? sw : 0); vy += (ix ? sw : 0); }
    if (S.fx.glitch) {
      stumbleT -= dt;
      if (stumbleT <= 0) { stumbleT = 1.6 + Math.random() * 2; stumble = 0.28; }
      if (stumble > 0) { stumble -= dt; if (moving) { vx += (Math.random() - 0.5) * 70; vy += (Math.random() - 0.5) * 70; } }
    }
    let nx = S.x + vx * dt, ny = S.y;
    if (canStand(nx, ny, solids, overlapNow)) S.x = nx;
    ny = S.y + vy * dt;
    if (canStand(S.x, ny, solids, overlapNow)) S.y = ny;
    E.moving = moving && (Math.abs(vx) + Math.abs(vy) > 1);

    if (E.moving) {
      const last = trail[trail.length - 1];
      if (Math.hypot(S.x - last.x, S.y - last.y) >= 2) { trail.push({ x: S.x, y: S.y, d: S.dir }); if (trail.length > 140) trail.shift(); }
    }

    /* gates: bumping into one starts its conversation */
    if (moving && E.gateCool <= 0) {
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (!e.def.gate || !e.def.dlg) continue;
        const r = npcRect(e);
        if (rectDist(S.x, S.y - 2, r) <= 3.5) { E.gateCool = 1.2; EM.hooks.interact(e); return; }
      }
    }

    /* the dark room: touching someone you cannot see, cues of the space, murmurs on the left and right */
    if (Z.id === 'darkroom') {
      if (moving) {
        for (let i = 0; i < list.length; i++) {
          const e = list[i];
          if (e.def.decor || (e.def.dlg && e.def.dlg === 'dario' )) continue;
          if (rectDist(S.x, S.y - 2, npcRect(e)) <= 2.5 && (E.time - (bumpDark[e.id] || -99)) > 7) {
            bumpDark[e.id] = E.time;
            L.stat('soc', -0.6); L.stat('weird', 0.8);
            EM.hooks.toast({ icon: 'eyes', text: T('Your hand lands on someone\'s shoulder in the dark. "Hey." "Sorry!" Reach out first, next time.', 'Tu mano cae sobre el hombro de alguien en la oscuridad. «Oye». «¡Perdón!» Extiende la mano primero, la próxima vez.', 'Sua mão cai no ombro de alguém no escuro. «Ei». «Desculpa!» Estenda a mão primeiro, da próxima vez.'), kind: 'bad', ms: 4200 });
            EM.hooks.sfx('warn');
          }
        }
      }
      murmurT -= dt;
      if (murmurT <= 0) {
        murmurT = 2.4;
        list.forEach(function (e) {
          if (e.def.decor) return;
          const p = npcPos(e); const dx = p.x * TS - S.x, dy = p.y * TS - S.y; const dist = Math.hypot(dx, dy);
          if (dist < 170) EM.audio.cue(EM.clamp(dx / 110, -1, 1), 0.10 * (1 - dist / 170), 'murmur');
        });
      }
      (Z.cues || []).forEach(function (c, i) {
        if (c.when && !c.when(S)) return;
        const cx = c.x * TS + 8, cy = c.y * TS + 8;
        if (Math.hypot(cx - S.x, cy - S.y) <= c.r * TS && E.time - (cueCool[i] || -99) > 45) {
          cueCool[i] = E.time;
          EM.hooks.toast({ icon: c.icon || 'eyes', text: c.text, kind: 'cue', ms: 4200 });
        }
      });
    }

    /* doors, triggers */
    let onDoor = null;
    R.ents.forEach(function (e) {
      if (e.type === 'door' && boxHitsRect(S.x, S.y, e.rect)) onDoor = e;
    });
    if (onDoor) {
      if (E.justDoor !== onDoor.id) {
        E.justDoor = onDoor.id;
        if (!onDoor.def.when || onDoor.def.when(S)) EM.hooks.door(onDoor.def);
        else if (onDoor.def.caught) EM.hooks.script(onDoor.def.caught);
        else EM.hooks.toast({ text: onDoor.def.locked, kind: 'info' });
      }
    } else if (E.justDoor) E.justDoor = null;

    R.ents.forEach(function (e) {
      if (e.type !== 'trig') return;
      if (e.def.when && !e.def.when(S)) return;
      if (S.res['trig_' + e.id] && e.def.once !== false) return;
      if (boxHitsRect(S.x, S.y, e.rect)) { S.res['trig_' + e.id] = true; EM.hooks.script(e.def.script, { id: e.id }); }
    });

    E.target = findTarget(list);
  };

  /* ------------------------------------------------------------ drawing */
  function personFrame(moving, t) {
    if (!moving) return 0;
    return [1, 3, 2, 3][Math.floor(t * 9) & 3];
  }

  const snap = function (v) { return Math.round(v * RS) / RS; };
  /* a soft shadow under every character: drawn once into a small sprite, then just blitted */
  const shadowImgs = {};
  function shadowImg(w) {
    if (shadowImgs[w]) return shadowImgs[w];
    const c = EM.mkCanvas(Math.round((w + 2) * RS), 8 * RS), x = c.getContext('2d');
    x.fillStyle = 'rgba(6,4,14,0.36)'; x.beginPath(); x.ellipse(c.width / 2, c.height / 2, w / 2 * RS, 1.9 * RS, 0, 0, Math.PI * 2); x.fill();
    x.fillStyle = 'rgba(6,4,14,0.22)'; x.beginPath(); x.ellipse(c.width / 2, c.height / 2, (w / 2 - 2) * RS, 1.0 * RS, 0, 0, Math.PI * 2); x.fill();
    c.lw = c.width / RS; c.lh = c.height / RS;
    return (shadowImgs[w] = c);
  }
  function blobShadow(cx, feetY, pose) {
    const im = shadowImg(pose === 'sit' ? 10 : 12);
    g.drawImage(im, snap(cx - im.lw / 2), snap(feetY + 0.5 - im.lh / 2), im.lw, im.lh);
  }
  function drawPerson(look, dir, frame, pose, cx, feetY, bob) {
    if (pose !== 'lie') {
      /* frame 3 is the passing step of the 4-phase walk: both feet down, body a pixel higher */
      if (frame === 3) { frame = 0; bob = (bob || 0) - 1; }
      blobShadow(cx, feetY, pose);
    }
    const spr = EM.person(look, dir, frame, pose), lw = spr.lw, lh = spr.lh;
    if (pose === 'lie') { g.drawImage(spr, snap(cx - lw / 2), snap(feetY - lh + 2), lw, lh); return; }
    const bx = snap(cx - lw / 2), by = snap(feetY - 32 + (bob || 0) - 1 / RS);
    /* idle: every so often the chest and head settle half a pixel (breathing), out of step from person to person */
    if (pose === 'stand' && frame === 0 && !bob && ((Math.floor((E.time + cx * 0.043 + feetY * 0.021) / 0.65)) % 4) === 0) {
      const cut = 22 * RS;
      g.drawImage(spr, 0, 0, spr.width, cut, bx, by + 1 / RS, lw, cut / RS);
      g.drawImage(spr, 0, cut, spr.width, spr.height - cut, bx, by + cut / RS, lw, (spr.height - cut) / RS);
      return;
    }
    g.drawImage(spr, bx, by, lw, lh);
  }

  let seekNow = {}, sideNow = [], sideAt = 0;
  const BLUE = '#3D8BFF', BLUE_SPARK = '#CFE2FF';
  /* the golden star: pulses above whoever you are looking for (or just found) */
  function drawStar(cx, topY, col, spark) {
    const k = Math.floor(E.time * 5) % 4, bob = Math.sin(E.time * 4) * 1.5;
    const ic = EM.icon('star', col || '#FFD23F'); g.drawImage(ic, Math.round(cx - 6.5), Math.round(topY - 3 + bob), 13, 13);
    g.fillStyle = spark || '#FFF2C8';
    if (k === 0) g.fillRect(Math.round(cx + 7), Math.round(topY + bob), 1, 1);
    if (k === 1) g.fillRect(Math.round(cx - 8), Math.round(topY + 3 + bob), 1, 1);
    if (k === 2) g.fillRect(Math.round(cx + 6), Math.round(topY + 8 + bob), 1, 1);
  }
  function npcDraw(e, cam, items) {
    const p = npcPos(e), d = e.def;
    const cx = p.x * TS, fy = p.y * TS + 6;
    const bpos = EM.audio.beatPos();
    const odd = (Math.floor(bpos) & 1);
    const bob = (d.pose === 'dance') ? (odd ? -1 : 0) : 0;
    const pose = d.pose === 'dance' ? (odd ? 'dance' : 'stand') : (d.pose === 'hug' ? 'stand' : d.pose);
    const sy = fy;
    const cast = EM.CAST[e.cast] || EM.CAST.maru;
    if (d.slit) {
      /* the rave door: no guard, a black steel door with a slit at eye height (a light moves behind it when you are close) */
      const x0 = Math.floor(p.x) * TS, y0 = (Math.floor(p.y) - 1) * TS, near = Math.hypot(S.x - cx, S.y - fy) < 40;
      items.push({ y: sy - 1, fn: function () {
        g.fillStyle = '#07070A'; g.fillRect(x0, y0, TS, TS);
        g.fillStyle = '#16161C'; g.fillRect(x0, y0, TS, 1); g.fillRect(x0, y0, 1, TS); g.fillRect(x0 + TS - 1, y0, 1, TS);
        g.fillStyle = '#0E0E13'; g.fillRect(x0 + 2, y0 + 2, TS - 4, TS - 3);
        g.fillStyle = '#26262E'; for (let i = 0; i < 4; i++) { g.fillRect(x0 + 3, y0 + 4 + i * 3, 1, 1); g.fillRect(x0 + TS - 4, y0 + 4 + i * 3, 1, 1); }
        g.fillStyle = '#000'; g.fillRect(x0 + 3, y0 + 5, TS - 6, 2);
        g.fillStyle = near && Math.floor(E.time * 2) % 5 === 0 ? '#2A2A33' : (near ? '#FFB020' : '#9A6A18'); g.fillRect(x0 + 4, y0 + 5.5, TS - 8, 1);
      } });
      if (!S.res['talked_' + e.id] && !S.res[e.id]) items.push({ y: sy + 60, fn: function () { EM.blit(g, EM.icon('exclam'), Math.round(cx - 4), Math.round(y0 - 6 + Math.sin(E.time * 4) * 1.5)); } });
      return;
    }
    let dir = d.dir || 'd';
    if (!d.decor && Math.hypot(S.x - cx, S.y - fy) < 40 && !d.pose) { dir = Math.abs(S.x - cx) > Math.abs(S.y - fy) ? (S.x > cx ? 'r' : 'l') : (S.y > fy ? 'd' : 'u'); }
    if (d.pair) {
      const pr = typeof d.pair === 'function' ? d.pair(S) : d.pair;
      const a = EM.CAST[pr[0]].look, b = EM.CAST[pr[1]].look;
      const tight = d.pose === 'hug';
      items.push({ y: sy, fn: function () { drawPerson(a, tight ? 'r' : dir, 0, 'stand', cx - (tight ? 4 : 8), sy, bob); drawPerson(b, tight ? 'l' : dir, 0, 'stand', cx + (tight ? 4 : 8), sy + 0.1, bob); if (tight) { EM.blit(g, EM.icon('heart'), Math.round(cx - 4), Math.round(sy - 42 + (odd ? 0 : -1))); } } });
    } else if (d.ring) {
      const n = d.ring.length;
      const w = d.box ? d.box.w * 8 : 14;
      d.ring.forEach(function (cid, i) {
        const ang = (i / n) * Math.PI * 2 + 0.4;
        const rx = cx + Math.cos(ang) * Math.max(12, w - 6), ry = sy + Math.sin(ang) * 6;
        const odd2 = (Math.floor(bpos + i * 0.5) & 1);
        items.push({ y: ry, fn: function () { drawPerson(EM.CAST[cid].look, Math.cos(ang) > 0 ? 'l' : 'r', 0, odd2 ? 'dance' : 'stand', rx, ry, odd2 ? -1 : 0); } });
      });
    } else {
      const look = cast.look;
      items.push({ y: sy, fn: function () { drawPerson(look, dir, 0, pose, cx, sy, bob); } });
    }
    /* the golden star for someone you are looking for (or just found) */
    const sk = seekNow[e.friend || e.id];
    const fnd = EM.found && EM.found.until > E.time && EM.found.id === (e.friend || e.id);
    if ((sk && sk.zone === Z.id) || fnd) { items.push({ y: sy + 60, fn: function () { drawStar(cx, sy - 56); } }); }
    /* talk marker */
    else if (d.dlg && !d.decor && !S.res['talked_' + e.id] && !S.res[e.id] && Z.id !== 'darkroom') {
      items.push({ y: sy + 60, fn: function () { EM.blit(g, EM.icon(d.gate ? 'exclam' : 'question'), Math.round(cx - 4), Math.round(sy - 45 + Math.sin(E.time * 4) * 1.5)); } });
    }
  }

  function lerpHex(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round((pa >> 16 & 255) + ((pb >> 16 & 255) - (pa >> 16 & 255)) * t), gg = Math.round((pa >> 8 & 255) + ((pb >> 8 & 255) - (pa >> 8 & 255)) * t), bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t);
    return '#' + ((1 << 24) | (r << 16) | (gg << 8) | bl).toString(16).slice(1);
  }

  /* the sky changes slowly with the night, so it is drawn into a canvas (in device pixels) and reused until the time moves on */
  let skyCache = { key: '', c: null };
  function drawSky(pw) {
    const prog = EM.clamp((S.time - 430) / 150, 0, 1), key = pw + '|' + Math.round(prog * 100);
    if (skyCache.key !== key) {
      const c = EM.mkCanvas(pw * RS, 56 * RS), k = c.getContext('2d');
      const top = lerpHex('#05060F', '#2B3A8A', prog), mid = lerpHex('#0B1030', '#9A4A9A', prog), hor = lerpHex('#0F1538', '#FF8A3D', prog);
      const W = pw * RS, Hh = 32 * RS;
      /* a dithered gradient: night blue, then violet, then orange and pink as the closing set runs */
      for (let y = 0; y < Hh; y++) {
        const t = y / (Hh - 1);
        const c1 = t < 0.5 ? lerpHex(top, mid, t * 2) : lerpHex(mid, hor, (t - 0.5) * 2);
        const c2 = lerpHex(c1, hor, 0.25);
        k.fillStyle = c1; k.fillRect(0, y, W, 1);
        k.fillStyle = c2;
        for (let x = (y & 1); x < W; x += 2) if (BAYER[(y & 3) * 4 + (x & 3)] / 16 < 0.5) k.fillRect(x, y, 1, 1);
      }
      if (prog > 0.35) {
        /* the rising sun: a disc with a lit top, then its reflection */
        const sy = Math.round((36 - prog * 16) * RS), sx = Math.round(W / 2), r = 10 * RS;
        for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
          const d = Math.hypot(x, y); if (d > r) continue;
          const v = (y + r) / (2 * r); k.fillStyle = d > r - 2 ? '#FFB020' : (v < 0.4 ? '#FFF2C8' : (v < 0.75 ? '#FFE08A' : '#FFB86A')); k.fillRect(sx + x, sy + y, 1, 1);
        }
        k.fillStyle = '#FF7AB8'; k.fillRect(sx - r - 8, sy + r + 2, r * 2 + 16, 2); k.fillStyle = '#FFB020'; k.fillRect(sx - r, sy + r, r * 2, 2);
      }
      for (let i = 0; i < 24; i++) { if (prog < 0.8) { k.fillStyle = prog > 0.4 ? '#8A92C8' : '#FFFFFF'; k.fillRect(Math.round(((i * 37) % pw) * RS), Math.round(((i * 11) % 16) * RS), 2, 2); } }
      skyCache = { key: key, c: c };
    }
    g.drawImage(skyCache.c, 0, 0, pw, 56);
  }

  /* low HEALTH blurs the picture (a CSS filter on the canvas: blur grows as HEALTH falls below 40) */
  let lastBlur = '';
  function blurForHealth() {
    const d = L.dizzy ? L.dizzy() : 0, f = d > 0 ? 'blur(' + (0.6 + d * 2.4).toFixed(1) + 'px)' : '';
    if (f !== lastBlur) { lastBlur = f; cv.style.filter = f; }
  }
  E.draw = function () {
    g.setTransform(RS, 0, 0, RS, 0, 0); g.imageSmoothingEnabled = false; /* everything below is in logical pixels */
    seekNow = EM.seekTargets ? EM.seekTargets(S) : {};
    if (S && performance.now() - sideAt > 300) { sideAt = performance.now(); sideNow = EM.sideSpots ? EM.sideSpots(S) : []; } /* side-quest guidance, refreshed a few times a second */
    if (!S || !Z) { g.fillStyle = '#0A0A0A'; g.fillRect(0, 0, VW, VH); return; }
    blurForHealth();
    const t = E.time;
    const pw = Z.w * TS, ph = Z.h * TS;
    let camx = snap(S.x - VW / 2), camy = snap(S.y - 20 - VH / 2 + camBias);
    camx = pw <= VW ? snap((pw - VW) / 2) : EM.clamp(camx, 0, pw - VW);
    camy = ph <= VH ? snap((ph - VH) / 2) : EM.clamp(camy, 0, ph - VH);
    let shakeX = 0, shakeY = 0;
    if (!EM.settings.calm) {
      if (L.high() >= 2) shakeX = Math.round(Math.sin(t * 1.3) * 1);
      if (S.fx.meth) shakeY = Math.round(Math.sin(t * 9) * 0.6);
    }
    g.fillStyle = '#050508'; g.fillRect(0, 0, VW, VH);
    g.save(); g.translate(-camx + shakeX, -camy + shakeY);
    const bpos = EM.audio.beatPos();
    const layer = (R.hasDance && (Math.floor(bpos) & 1)) ? R.B : R.A;
    g.drawImage(layer, 0, 0, layer.width / RS, layer.height / RS);

    if (Z.sky) drawSky(pw);

    /* world objects (floor-level hints) */
    R.ents.forEach(function (e) {
      if (e.type !== 'obj' || !visible(e)) return;
      if (e.kind === 'dance' || e.kind === 'peak') {
        const x = e.rect.x, y = e.rect.y, w = e.rect.w, h = e.rect.h;
        const pulse = Math.floor(bpos * 2) & 1;
        const c1 = pulse ? Z.theme.a : EM.shade(Z.theme.a, -0.5);
        g.fillStyle = c1;
        g.fillRect(x + 1, y + 1, w - 2, 1); g.fillRect(x + 1, y + h - 2, w - 2, 1); g.fillRect(x + 1, y + 1, 1, h - 2); g.fillRect(x + w - 2, y + 1, 1, h - 2);
        EM.blit(g, EM.icon('note', pulse ? Z.theme.b : EM.shade(Z.theme.b, -0.5)), x + Math.round(w / 2) - 4, y + Math.round(h / 2) - 4);
      } else if (e.kind === 'rest' && !e.def.strong) {
        EM.blit(g, EM.icon('zzz'), e.rect.x + Math.round(e.rect.w / 2) - 4, e.rect.y - 7);
      } else if (e.kind === 'water') {
        EM.blit(g, EM.icon('water'), e.rect.x + Math.round(e.rect.w / 2) - 4, e.rect.y + Math.round(e.rect.h / 2) - 4);
      } else if (e.kind === 'stall' || e.kind === 'sunrise') {
        EM.blit(g, EM.icon('exclam'), e.rect.x + Math.round(e.rect.w / 2) - 4, e.rect.y - 8 + Math.sin(t * 4));
      } else if (e.kind === 'smoke') {
        EM.blit(g, EM.icon('cig', N.org), e.rect.x + 4, e.rect.y + 4);
      } else if (e.kind === 'find') {
        if (Math.floor(t * 2.5) % 3) EM.blit(g, EM.icon('spark', N.yel), e.rect.x + Math.round(e.rect.w / 2) - 4, e.rect.y + Math.round(e.rect.h / 2) - 5 + Math.round(Math.sin(t * 5)));
      } else if (e.kind === 'poster') {
        EM.blit(g, EM.icon('question', Z.theme.b), e.rect.x + Math.round(e.rect.w / 2) - 4, e.rect.y + Math.round(e.rect.h / 2) - 4);
      }
    });
    /* doors: glow */
    R.ents.forEach(function (e) {
      if (e.type !== 'door') return;
      const ok = !e.def.when || e.def.when(S);
      if (ok && Math.floor(t * 2) & 1) {
        g.fillStyle = N.lim; g.fillRect(e.rect.x + Math.round(e.rect.w / 2) - 1, e.rect.y + e.rect.h - 3, 2, 2);
      }
      if (!ok) { EM.blit(g, EM.icon('mute', 'G'), e.rect.x + Math.round(e.rect.w / 2) - 4, e.rect.y + 4); }
    });

    /* y-sorted things */
    const items = [];
    const list = npcs();
    list.forEach(function (e) {
      npcDraw(e, null, items);
      if (e.def.heart) { /* two people, hand in hand, with a heart between them */
        const hp = npcPos(e), hx = Math.round(hp.x * TS), hfy = Math.round(hp.y * TS + 6);
        items.push({ y: hfy + 1, fn: function () { EM.blit(g, EM.icon('heart', N.mag), hx - 4, hfy - 46 + Math.round(Math.sin(E.time * 3))); } });
      }
      if (e.def.smoker) { /* a lit cigarette over their head, and a thread of smoke */
        const sp = npcPos(e), sx = Math.round(sp.x * TS), sfy = Math.round(sp.y * TS + 6);
        items.push({ y: sfy + 1, fn: function () {
          const k = Math.floor(E.time * 4);
          EM.blit(g, EM.icon('cig', N.org), sx - 4, sfy - 44);
          g.fillStyle = '#9A9AA8'; g.fillRect(sx + ((k + 1) % 3) - 1, sfy - 47 - (k % 3), 1, 1); g.fillRect(sx + (k % 3) - 1, sfy - 50 - (k % 2), 1, 1);
        } });
      }
    });

    /* followers */
    S.party.forEach(function (f, i) {
      const idx = Math.max(0, trail.length - 1 - (i + 1) * 10);
      const p = trail[idx];
      const cast = EM.CAST[f];
      const moving = E.moving && idx < trail.length - 1;
      const fr = personFrame(moving, t + i);
      items.push({ y: p.y, fn: function () { drawPerson(cast.look, p.d, fr, 'stand', p.x, p.y, 0); if (EM.found && EM.found.id === f && EM.found.until > E.time) drawStar(p.x, p.y - 56); } });
    });

    /* player: the one with the white outline */
    const pl = S.player.look;
    let expr = pl.expr;
    if (S.stats.hp < 25 || (S.stats.soc < 10)) expr = 4; else if (S.fx.mdma) expr = 2;
    const look = Object.assign({}, pl, { expr: expr, ol: '#FFFFFF' });
    if (S.worn && S.worn.sunglasses) look.acc = 1;
    const pfr = personFrame(E.moving, t);
    const dancing = E.dancing;
    items.push({ y: S.y, fn: function () {
      const o = (Math.floor(bpos) & 1);
      drawPerson(look, S.dir, pfr, dancing ? (o ? 'dance' : 'stand') : 'stand', S.x, S.y + 1, dancing && o ? -1 : 0);
    } });

    /* the crowd */
    const parting = E.parting > 0 ? Math.min(1, E.parting / 0.6) : 0;
    const x0 = camx - 20, x1 = camx + VW + 20, y0 = camy - 12, y1 = camy + VH + 44;
    R.dancers.forEach(function (d) {
      if (d.x < x0 || d.x > x1 || d.y < y0 || d.y > y1) return;
      const att = S.res[d.id] ? 'yield' : d.att;
      let ox = 0, oy = 0;
      const dx = d.x - S.x, dy = d.y - S.y, dist = Math.hypot(dx, dy);
      if (att === 'yield' && parting > 0 && dist < 38) { const k = (38 - dist) / 38 * 10 * parting; ox = dx / (dist || 1) * k; oy = dy / (dist || 1) * k * 0.6; }
      const odd = (Math.floor(bpos + d.ph * 2) & 1);
      const facing = (att !== 'yield' && dist < 50 && parting > 0) ? (Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'l' : 'r') : (dy > 0 ? 'u' : 'd')) : (dist < 30 && parting > 0 ? (dx > 0 ? 'l' : 'r') : 'd');
      const still = att !== 'yield' && dist < 50 && parting > 0; /* arms crossed: no dancing */
      items.push({ y: d.y + oy, fn: function () { drawPerson(d.look, facing, 0, (odd && !still) ? 'dance' : 'stand', d.x + ox, d.y + oy, (odd && !still) ? -1 : 0); } });
    });
    items.sort(function (a, b) { return a.y - b.y; });
    items.forEach(function (it) { it.fn(); });

    /* reactions of the people you asked to move */
    E.reacts.forEach(function (r) {
      EM.blit(g, EM.icon(r.icon, r.icon === 'anger' ? N.red : '#FFFFFF'), Math.round(r.x - 4), Math.round(r.y - 40 - (1.4 - r.t) * 4));
    });

    /* interaction hint above target */
    if (E.target && !E.paused) {
      const tg = E.target;
      let hx, hy;
      if (tg.type === 'npc') { const p = npcPos(tg); hx = p.x * TS; hy = p.y * TS - 40; } else { hx = tg.rect.x + tg.rect.w / 2; hy = tg.rect.y - 10; }
      g.fillStyle = N.yel; g.fillRect(Math.round(hx - 5), Math.round(hy - 1 + Math.sin(t * 6)), 10, 9);
      EM.drawText(g, 'Z', Math.round(hx - 1), Math.round(hy + 1 + Math.sin(t * 6)), '#0A0A0A');
    }
    /* blue stars over the people and places side quests send you to */
    sideNow.forEach(function (sp) { if (sp.zone === Z.id) drawStar(sp.x * TS, sp.y * TS - (sp.npc ? 50 : 26), BLUE, BLUE_SPARK); });
    g.restore();

    /* light: coloured dither halos, and darkness */
    lighting(camx + shakeX, camy + shakeY);

    seekArrows(camx + shakeX, camy + shakeY, list);
    sideArrows(camx + shakeX, camy + shakeY);

    /* the dark room: faint embers where people breathe, a thread of light under the curtain */
    if (Z.id === 'darkroom') darkroomCues(camx + shakeX, camy + shakeY, list);

    if (E.overlay) E.overlay(g);

    /* screen wipe: dithered */
    if (E.fade > 0) {
      g.fillStyle = '#050508';
      const f = E.fade;
      for (let y = 0; y < VH; y += 2) for (let x = 0; x < VW; x += 2) {
        if (BAYER[((y >> 1) & 3) * 4 + ((x >> 1) & 3)] / 16 < f) g.fillRect(x, y, 2, 2);
      }
    }
  };


  /* arrows toward the people you are looking for: to the person if they are in this room and off screen,
     otherwise to the exit that leads toward the room they went to */
  function zoneRoute(from, to) {
    if (from === to) return null;
    const prev = {}; prev[from] = null; const q = [from];
    while (q.length) {
      const z = q.shift();
      const zz = EM.zones[z]; if (!zz) continue;
      for (let i = 0; i < zz.ents.length; i++) {
        const e = zz.ents[i];
        if (e.type !== 'door' || prev[e.to] !== undefined) continue;
        prev[e.to] = { z: z, door: e };
        if (e.to === to) { let c = prev[to]; while (c.z !== from) c = prev[c.z]; return c.door; }
        q.push(e.to);
      }
    }
    return null;
  }
  function seekArrows(camx, camy, list) {
    const keys = Object.keys(seekNow); if (!keys.length) return;
    const marks = {};
    keys.forEach(function (k, n) {
      const sk = seekNow[k]; let wx, wy;
      if (sk.zone === Z.id) {
        const e = list.filter(function (x) { return (x.friend || x.id) === k; })[0];
        if (!e) return;
        const p = npcPos(e); wx = p.x * TS; wy = p.y * TS - 20;
      } else {
        const d = zoneRoute(Z.id, sk.zone); if (!d) return;
        const r = d.rect || { x: d.x * TS, y: d.y * TS, w: d.w * TS, h: d.h * TS };
        wx = r.x + r.w / 2; wy = r.y + r.h / 2;
      }
      const sx = wx - camx, sy = wy - camy, m = 14;
      const on = sx > m && sx < VW - m && sy > m + 6 && sy < VH - m;
      if (on && sk.zone === Z.id) return;
      let ax, ay, ang;
      if (on) { ax = sx; ay = sy - 18 + Math.sin(E.time * 5) * 2; ang = Math.PI / 2; }
      else {
        const cxm = VW / 2, cym = VH / 2, dx = sx - cxm, dy = sy - cym;
        const kx = dx ? (VW / 2 - m) / Math.abs(dx) : 1e9, ky = dy ? (VH / 2 - m - 6) / Math.abs(dy) : 1e9, kk = Math.min(kx, ky);
        ax = cxm + dx * kk; ay = cym + dy * kk; ang = Math.atan2(dy, dx);
        const push = Math.sin(E.time * 5) * 1.5; ax += Math.cos(ang) * push; ay += Math.sin(ang) * push;
      }
      const key = Math.round(ax / 6) + ',' + Math.round(ay / 6);
      if (marks[key]) marks[key].label += (sk.label || ''); else marks[key] = { ax: ax, ay: ay, ang: ang, label: sk.label || '' };
    });
    Object.keys(marks).forEach(function (mk) {
      const m = marks[mk];
      g.save(); g.translate(m.ax, m.ay); g.rotate(m.ang);
      g.fillStyle = '#0A0A0A'; g.beginPath(); g.moveTo(8, 0); g.lineTo(-5, -7); g.lineTo(-2, 0); g.lineTo(-5, 7); g.closePath(); g.fill();
      g.fillStyle = '#FFD23F'; g.beginPath(); g.moveTo(6.5, 0); g.lineTo(-3.5, -5.2); g.lineTo(-1, 0); g.lineTo(-3.5, 5.2); g.closePath(); g.fill();
      g.restore();
      if (m.label) EM.drawText(g, m.label, Math.round(m.ax - Math.cos(m.ang) * 11 - m.label.length * 2), Math.round(m.ay - Math.sin(m.ang) * 11 - 3), '#FFD23F');
    });
  }

  /* blue arrows for side quests: the same idea as the golden ones, pointing at the spot, or at the door that leads to its room */
  function sideArrows(camx, camy) {
    const marks = {};
    sideNow.forEach(function (sp) {
      let wx, wy;
      if (sp.zone === Z.id) { wx = sp.x * TS; wy = sp.y * TS - 20; }
      else {
        const d = zoneRoute(Z.id, sp.zone); if (!d) return;
        const r = d.rect || { x: d.x * TS, y: d.y * TS, w: d.w * TS, h: d.h * TS };
        wx = r.x + r.w / 2; wy = r.y + r.h / 2;
      }
      const sx = wx - camx, sy = wy - camy, m = 14;
      const on = sx > m && sx < VW - m && sy > m + 6 && sy < VH - m;
      if (on && sp.zone === Z.id) return;
      let ax, ay, ang;
      if (on) { ax = sx; ay = sy - 18 + Math.sin(E.time * 5) * 2; ang = Math.PI / 2; }
      else {
        const cxm = VW / 2, cym = VH / 2, dx = sx - cxm, dy = sy - cym;
        const kx = dx ? (VW / 2 - m) / Math.abs(dx) : 1e9, ky = dy ? (VH / 2 - m - 6) / Math.abs(dy) : 1e9, kk = Math.min(kx, ky);
        ax = cxm + dx * kk; ay = cym + dy * kk; ang = Math.atan2(dy, dx);
        const push = Math.sin(E.time * 5) * 1.5; ax += Math.cos(ang) * push; ay += Math.sin(ang) * push;
      }
      marks[Math.round(ax / 6) + ',' + Math.round(ay / 6)] = { ax: ax, ay: ay, ang: ang };
    });
    Object.keys(marks).forEach(function (mk) {
      const m = marks[mk];
      g.save(); g.translate(m.ax, m.ay); g.rotate(m.ang);
      g.fillStyle = '#0A0A0A'; g.beginPath(); g.moveTo(8, 0); g.lineTo(-5, -7); g.lineTo(-2, 0); g.lineTo(-5, 7); g.closePath(); g.fill();
      g.fillStyle = BLUE; g.beginPath(); g.moveTo(6.5, 0); g.lineTo(-3.5, -5.2); g.lineTo(-1, 0); g.lineTo(-3.5, 5.2); g.closePath(); g.fill();
      g.restore();
    });
  }

  function darkroomCues(camx, camy, list) {
    list.forEach(function (e) {
      if (e.def.decor) return;
      const p = npcPos(e); const sx = p.x * TS - camx, sy = p.y * TS - camy - 26;
      const k = Math.floor(E.time * 1.2 + EM.hash2(p.x * 3, p.y * 3, 1) * 5) % 5;
      if (k === 0 && Math.hypot(p.x * TS - S.x, p.y * TS - S.y) < 150) {
        g.fillStyle = EM.shade(Z.theme.a, -0.35); g.fillRect(Math.round(sx - 2), Math.round(sy), 1, 1); g.fillRect(Math.round(sx + 3), Math.round(sy - 3), 1, 1); g.fillRect(Math.round(sx), Math.round(sy - 6), 1, 1);
      }
    });
    /* the curtain: a thin warm line */
    R.ents.forEach(function (e) {
      if (e.type !== 'door') return;
      const sx = e.rect.x - camx + 4, sy = e.rect.y - camy + 6;
      g.fillStyle = (Math.floor(E.time * 1.5) & 1) ? '#5A2A1A' : '#3A1A10';
      g.fillRect(sx, sy, 8, 1);
    });
  }

  /* Lighting: computed at logical resolution (cheap) and drawn smoothed up to the render scale, so light falls off softly.
     Darkness is a dark overlay in six dithered steps; coloured light is added (it lifts the ground under it). */
  let maskCanvas = null, maskData = null, glowCanvas = null, glowData = null;
  function lighting(camx, camy) {
    const shades = !!(S.worn && S.worn.sunglasses);
    const dark = Z.id === 'darkroom' ? 0.985 : (shades ? Math.max(Z.dark, 0.96) : Z.dark);
    const lights = shades ? [] : Z.lights;
    if (dark <= 0 && !lights.length) return;
    if (!maskCanvas || maskCanvas.width !== VW || maskCanvas.height !== VH) { maskCanvas = EM.mkCanvas(VW, VH); maskData = maskCanvas.getContext('2d').createImageData(VW, VH); glowCanvas = EM.mkCanvas(VW, VH); glowData = glowCanvas.getContext('2d').createImageData(VW, VH); }
    const d = maskData.data, gd = glowData.data;
    d.fill(0); gd.fill(0);
    const col = Z.theme.a;
    const rgb = function (hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
    const L2 = lights.map(function (l) { return { x: l.x - camx, y: l.y - camy, r: l.r, c: rgb(l.c || col) }; });
    let pr = Z.id === 'tunnel' ? 40 : (Z.dark > 0.5 ? 40 : 30);
    if (shades && Z.id !== 'darkroom') pr = 34;
    if (Z.id === 'darkroom') pr = 8 + (E.reachT > 0 ? 46 * Math.sin(Math.PI * (1 - E.reachT / 1.15)) : 0);
    const torch = { x: S.x - camx, y: S.y - 12 - camy, r: pr };
    for (let y = 0; y < VH; y++) for (let x = 0; x < VW; x++) {
      let lf = 0, lc = null, lcf = 0;
      for (let i = 0; i < L2.length; i++) {
        const l = L2[i];
        const dx = x - l.x, dy = (y - l.y) * 1.1;
        if (dx > l.r || dx < -l.r) continue;
        const dd = dx * dx + dy * dy;
        if (dd < l.r * l.r) { const v = 1 - Math.sqrt(dd) / l.r; if (v > lf) lf = v; if (v > lcf) { lcf = v; lc = l.c; } }
      }
      const tdx = x - torch.x, tdy = (y - torch.y) * 1.1, td = tdx * tdx + tdy * tdy;
      let tl = 0; if (td < torch.r * torch.r) tl = 1 - Math.sqrt(td) / torch.r;
      const lit = Math.max(lf, tl);
      const bay = BAYER[(y & 3) * 4 + (x & 3)] / 16;
      const o = (y * VW + x) * 4;
      const da = dark > 0 ? dark * (1 - Math.min(1, lit * 1.6)) : 0, dl = da * 6, db = Math.floor(dl), dq = (dl - db > bay ? db + 1 : db) / 6;
      if (dq > 0) { d[o] = 5; d[o + 1] = 5; d[o + 2] = 8; d[o + 3] = Math.round(255 * dq); }
      gd[o + 3] = 255;
      if (lc && Z.id !== 'darkroom') {
        const gl = Math.pow(lcf, 1.35) * 4, gb = Math.floor(gl), gq = (gl - gb > bay ? gb + 1 : gb) / 4;
        if (gq > 0) { gd[o] = lc[0] * gq * 0.4; gd[o + 1] = lc[1] * gq * 0.4; gd[o + 2] = lc[2] * gq * 0.4; }
      }
    }
    maskCanvas.getContext('2d').putImageData(maskData, 0, 0);
    glowCanvas.getContext('2d').putImageData(glowData, 0, 0);
    g.save(); g.imageSmoothingEnabled = true;
    g.globalCompositeOperation = 'lighter'; g.drawImage(glowCanvas, 0, 0); /* the light is added to the picture first... */
    g.globalCompositeOperation = 'source-over'; g.drawImage(maskCanvas, 0, 0); /* ...then the dark steps go on top */
    g.restore();
  }

  /* ------------------------------------------------------------ misc API */
  E.npcRuntime = function (id) { return R && R.ents.filter(function (e) { return e.id === id; })[0]; };
  E.moveNpc = function (id, x, y) { S.moved[id] = { x: x, y: y }; };
  E.refreshCrowd = rebuildCrowd;
  E.fadeOut = function (cb) { E.fadeDir = 1; E.fadeCb = cb; };
  E.fadeIn = function () { E.fadeDir = -1; };
  E.camera = function () { return { w: VW, h: VH }; };
  E.playerRect = function () { return { x: S.x, y: S.y }; };
  E.size = { w: VW, h: VH };
})();

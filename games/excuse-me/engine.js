/* EXCUSE ME — world simulation and renderer (canvas 256x144, 16 px tiles). */
'use strict';
(function () {
  const EM = window.EM;
  const TL = EM.TL, C = EM.PAL, L = EM.logic, T = EM.T;
  const TS = 16, VW = 256, VH = 144;
  const E = EM.engine = {};

  let cv, g, S, Z, R;
  E.paused = true;
  E.input = { x: 0, y: 0 };
  E.overlay = null;
  E.parting = 0; E.excuseCool = 0; E.gateCool = 0; E.bumpAcc = 0; E.justDoor = null;
  E.time = 0;
  E.target = null;
  E.fade = 0; /* 0..1 dither wipe */
  E.fadeDir = 0; E.fadeCb = null;
  const trail = [];
  let timeAcc = 0, stumble = 0, stumbleT = 0, lastPhase = '';

  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  /* ------------------------------------------------------------ setup */
  E.init = function (canvas) {
    cv = canvas; cv.width = VW; cv.height = VH;
    g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
  };
  E.zone = function () { return Z; };
  E.runtime = function () { return R; };

  const cache = {};
  function pool() {
    if (cache.pool) return cache.pool;
    const r = EM.mulberry32(77), p = [];
    for (let i = 0; i < 32; i++) {
      p.push({ skin: Math.floor(r() * 4), hair: Math.floor(r() * 9), hc: Math.floor(r() * 4), expr: 1 + Math.floor(r() * 3), top: Math.floor(r() * 10), bottom: Math.floor(r() * 6), acc: Math.floor(r() * 8), wide: false });
    }
    return (cache.pool = p);
  }

  /* ------------------------------------------------------------ zone loading */
  function buildStatic(z, variant) {
    const c = EM.mkCanvas(z.w * TS, z.h * TS); const cg = c.getContext('2d');
    const solid = function (x, y) { return EM.isSolidTile(z.get(x, y)); };
    for (let y = 0; y < z.h; y++) for (let x = 0; x < z.w; x++) {
      let t = z.get(x, y);
      if (t === TL.DANCE && variant === 'B') t = 'DANCE_B';
      EM.drawTile(cg, t, x * TS, y * TS, x, y, function (dx, dy) { return !solid(x + dx, y + dy) && z.get(x + dx, y + dy) !== TL.VOID; });
    }
    z.signs.forEach(function (sg) {
      const w = EM.textWidth(sg.text) + 4, h = 9;
      const sc = EM.mkCanvas(w, h); const sx = sc.getContext('2d');
      sx.fillStyle = C.K; sx.fillRect(0, 0, w, h); sx.fillStyle = C.W; sx.fillRect(0, 0, w, 1); sx.fillRect(0, h - 1, w, 1); sx.fillRect(0, 0, 1, h); sx.fillRect(w - 1, 0, 1, h);
      EM.drawText(sx, sg.text, 2, 2, 'W');
      cg.drawImage(sc, 0, 0, w, h, sg.x * TS + 1, sg.y * TS + 3, w * sg.scale, h * sg.scale);
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
      const n = d === 1 ? (h0 > 0.7 ? 1 : 0) : (d === 2 ? (h0 > 0.3 ? 1 : 0) : (h0 > 0.65 ? 2 : 1));
      for (let k = 0; k < n; k++) {
        const hx = EM.hash2(x + k * 7, y, 5), hy = EM.hash2(x, y + k * 11, 9), hl = EM.hash2(x * 3 + k, y * 5, 2);
        R.dancers.push({ x: x * TS + 3 + hx * 10, y: y * TS + 8 + hy * 8, look: p[Math.floor(hl * p.length)], ph: hx, tx: x, ty: y });
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
    E.parting = 0; E.bumpAcc = 0; E.gateCool = 0.6;
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
    ['maru', 'dani', 'tato'].forEach(function (f, i) {
      if (S.away[f] === Z.id && !S.party.includes(f)) {
        const spot = Z.friendAt[Z.id] || Z.friendAt['default'];
        if (!spot) return;
        const off = [[0, 0], [1.2, 0.9], [-1.1, 1.1]][i];
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
      const r = npcRect(e), reach = (e.def.reach || 12) * (e.def.box ? 1 : 1);
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
    if (t) { EM.hooks.interact(t); return; }
    E.excuse();
  };

  const BARKS = [
    T('Excuse me!', '¡Con permiso!', 'Com licença!'), T('Sorry, sorry — coming through.', 'Perdón, perdón, voy pasando.', 'Desculpa, desculpa — passando.'),
    T('Pardon me, thank you.', 'Permiso, gracias.', 'Licença, obrigado.'), T('Just squeezing past.', 'Solo me cuelo un poquito.', 'Só dando uma espremida.')
  ];
  const BUMPS = [
    T('HEY. WATCH IT.', 'EH. FIJATE.', 'EI. OLHA AÍ.'), T('Somebody just elbowed you out of the way.', 'Alguien te sacó a codazos.', 'Alguém te tirou do caminho a cotoveladas.'),
    T('"You could ask, you know."', '«Podrías pedir permiso, eh.»', '«Podia pedir licença, né.»'), T('You wade through a stranger\'s dance. They glare.', 'Cruzas el baile de un desconocido. Te mira mal.', 'Você atravessa a dança de um estranho. Ele te encara.')
  ];
  E.excuse = function () {
    if (E.excuseCool > 0) return;
    E.excuseCool = 1.0; E.parting = 2.8;
    const nearCrowd = E.crowdAt(S.x, S.y) > 0 || E.crowdAt(S.x + 12, S.y) > 0 || E.crowdAt(S.x - 12, S.y) > 0 || E.crowdAt(S.x, S.y - 12) > 0 || E.crowdAt(S.x, S.y + 12) > 0;
    if (nearCrowd) { L.stat('soc', -0.4); }
    EM.hooks.bark(EM.pick(BARKS), 'self');
    EM.hooks.sfx('select');
  };

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
    if (E.paused) return;

    /* the night clock */
    timeAcc += dt * 0.4;
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
        if (E.parting <= 0) {
          E.bumpAcc += dt * d * 0.7;
          if (E.bumpAcc >= 2.0) { E.bumpAcc = 0; L.stat('soc', -1); L.stat('weird', 0.4); EM.hooks.bark(EM.pick(BUMPS), 'bad'); EM.hooks.sfx('warn'); }
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
  function personFrame(moving, t) { return moving ? 1 + (Math.floor(t * 8) & 1) : 0; }

  function drawPerson(look, dir, frame, pose, cx, feetY, bob) {
    const spr = EM.person(look, dir, frame, pose);
    g.drawImage(spr, Math.round(cx - spr.width / 2), Math.round(feetY - spr.height + 1 + (bob || 0)));
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
    let dir = d.dir || 'd';
    if (!d.decor && Math.hypot(S.x - cx, S.y - fy) < 40 && !d.pose) { dir = Math.abs(S.x - cx) > Math.abs(S.y - fy) ? (S.x > cx ? 'r' : 'l') : (S.y > fy ? 'd' : 'u'); }
    if (d.pair) {
      const pr = typeof d.pair === 'function' ? d.pair(S) : d.pair;
      const a = EM.CAST[pr[0]].look, b = EM.CAST[pr[1]].look;
      const tight = d.pose === 'hug';
      items.push({ y: sy, fn: function () { drawPerson(a, tight ? 'r' : dir, 0, 'stand', cx - (tight ? 3 : 6), sy, bob); drawPerson(b, tight ? 'l' : dir, 0, 'stand', cx + (tight ? 3 : 6), sy + 0.1, bob); if (tight) { g.drawImage(EM.icon('heart'), Math.round(cx - 4), Math.round(sy - 30 + (odd ? 0 : -1))); } } });
    } else if (d.ring) {
      const n = d.ring.length;
      const w = d.box ? d.box.w * 8 : 14;
      d.ring.forEach(function (cid, i) {
        const ang = (i / n) * Math.PI * 2 + 0.4;
        const rx = cx + Math.cos(ang) * Math.max(10, w - 8), ry = sy + Math.sin(ang) * 6;
        const odd2 = (Math.floor(bpos + i * 0.5) & 1);
        items.push({ y: ry, fn: function () { drawPerson(EM.CAST[cid].look, Math.cos(ang) > 0 ? 'l' : 'r', 0, odd2 ? 'dance' : 'stand', rx, ry, odd2 ? -1 : 0); } });
      });
    } else {
      const look = cast.look;
      items.push({ y: sy, fn: function () {
        if (d.pose === 'lie') { const spr = EM.person(look, 'd', 0, 'lie'); g.drawImage(spr, Math.round(cx - spr.width / 2), Math.round(sy - spr.height + 2)); }
        else drawPerson(look, dir, 0, pose, cx, sy, bob);
      } });
    }
    /* talk marker */
    if (d.dlg && !d.decor && !S.res['talked_' + e.id] && !S.res[e.id]) {
      items.push({ y: sy + 50, fn: function () { g.drawImage(EM.icon(d.gate ? 'exclam' : 'question'), Math.round(cx - 4), Math.round(sy - 33 + Math.sin(E.time * 4) * 1.5)); } });
    }
  }

  E.draw = function () {
    if (!S || !Z) { g.fillStyle = C.K; g.fillRect(0, 0, VW, VH); return; }
    const t = E.time;
    const pw = Z.w * TS, ph = Z.h * TS;
    let camx = Math.round(S.x - VW / 2), camy = Math.round(S.y - 16 - VH / 2);
    camx = pw <= VW ? Math.round((pw - VW) / 2) : EM.clamp(camx, 0, pw - VW);
    camy = ph <= VH ? Math.round((ph - VH) / 2) : EM.clamp(camy, 0, ph - VH);
    let shakeX = 0, shakeY = 0;
    if (!EM.settings.calm) {
      if (L.high() >= 2) shakeX = Math.round(Math.sin(t * 1.3) * 1);
      if (S.fx.meth) shakeY = Math.round(Math.sin(t * 9) * 0.6);
    }
    g.fillStyle = C.K; g.fillRect(0, 0, VW, VH);
    g.save(); g.translate(-camx + shakeX, -camy + shakeY);
    const bpos = EM.audio.beatPos();
    const layer = (R.hasDance && (Math.floor(bpos) & 1)) ? R.B : R.A;
    g.drawImage(layer, 0, 0);

    /* sky rows on the roof: dither gradient by time */
    if (Z.sky) {
      const prog = EM.clamp((S.time - 430) / 150, 0, 1);
      for (let y = 0; y < 32; y++) for (let x = 0; x < pw; x++) {
        const lift = prog * (1 - y / 32) * 1.2;
        if (BAYER[(y & 3) * 4 + (x & 3)] / 16 < lift) { g.fillStyle = (lift > 0.6) ? C.W : C.G; g.fillRect(x, y, 1, 1); }
      }
      if (prog > 0.4) { g.fillStyle = C.W; g.fillRect(Math.round(pw / 2 - 5), Math.round(32 - 4 - prog * 6), 10, 6); g.fillStyle = C.G; g.fillRect(Math.round(pw / 2 - 7), Math.round(32 - 4 - prog * 6) + 6, 14, 2); }
    }

    /* world objects (floor-level hints) */
    R.ents.forEach(function (e) {
      if (e.type !== 'obj' || !visible(e)) return;
      if (e.kind === 'dance' || e.kind === 'peak') {
        const x = e.rect.x, y = e.rect.y, w = e.rect.w, h = e.rect.h;
        const pulse = Math.floor(bpos * 2) & 1;
        g.fillStyle = pulse ? C.W : C.G;
        g.fillRect(x + 1, y + 1, w - 2, 1); g.fillRect(x + 1, y + h - 2, w - 2, 1); g.fillRect(x + 1, y + 1, 1, h - 2); g.fillRect(x + w - 2, y + 1, 1, h - 2);
        g.drawImage(EM.icon('note', pulse ? 'W' : 'G'), x + Math.round(w / 2) - 4, y + Math.round(h / 2) - 4);
      } else if (e.kind === 'rest' && !e.def.strong) {
        g.drawImage(EM.icon('zzz', 'G'), e.rect.x + Math.round(e.rect.w / 2) - 4, e.rect.y - 7);
      } else if (e.kind === 'water') {
        g.drawImage(EM.icon('water', 'W'), e.rect.x + Math.round(e.rect.w / 2) - 4, e.rect.y + Math.round(e.rect.h / 2) - 4 - (e.rect.h > 20 ? 0 : 0));
      } else if (e.kind === 'stall' || e.kind === 'sunrise') {
        g.drawImage(EM.icon('exclam'), e.rect.x + Math.round(e.rect.w / 2) - 4, e.rect.y - 8 + Math.sin(t * 4));
      } else if (e.kind === 'smoke') {
        g.drawImage(EM.icon('cig', 'G'), e.rect.x + 4, e.rect.y + 4);
      }
    });
    /* doors: arrows */
    R.ents.forEach(function (e) {
      if (e.type !== 'door') return;
      const ok = !e.def.when || e.def.when(S);
      if (ok && Math.floor(t * 2) & 1) {
        g.fillStyle = C.W; g.fillRect(e.rect.x + Math.round(e.rect.w / 2) - 1, e.rect.y + e.rect.h - 3, 2, 2);
      }
      if (!ok) { g.drawImage(EM.icon('mute', 'G'), e.rect.x + Math.round(e.rect.w / 2) - 4, e.rect.y + 4); }
    });

    /* y-sorted things */
    const items = [];
    const list = npcs();
    list.forEach(function (e) { npcDraw(e, null, items); });

    /* followers */
    S.party.forEach(function (f, i) {
      const idx = Math.max(0, trail.length - 1 - (i + 1) * 10);
      const p = trail[idx];
      const cast = EM.CAST[f];
      const moving = E.moving && idx < trail.length - 1;
      const fr = personFrame(moving, t + i);
      items.push({ y: p.y, fn: function () { drawPerson(cast.look, p.d, fr, E.paused && !E.dancing ? 'stand' : 'stand', p.x, p.y, 0); } });
    });

    /* player */
    const pl = S.player.look;
    let expr = pl.expr;
    if (S.stats.hp < 25 || (S.stats.soc < 10)) expr = 4; else if (S.fx.mdma) expr = 2;
    const look = Object.assign({}, pl, { expr: expr, ol: 'W' });
    const pfr = personFrame(E.moving, t);
    const dancing = E.dancing;
    items.push({ y: S.y, fn: function () {
      const o = (Math.floor(bpos) & 1);
      drawPerson(look, S.dir, pfr, dancing ? (o ? 'dance' : 'stand') : 'stand', S.x, S.y + 1, dancing && o ? -1 : 0);
    } });

    /* the crowd */
    const parting = E.parting > 0 ? Math.min(1, E.parting / 0.6) : 0;
    const x0 = camx - 16, x1 = camx + VW + 16, y0 = camy - 24, y1 = camy + VH + 24;
    const look2 = {};
    R.dancers.forEach(function (d) {
      if (d.x < x0 || d.x > x1 || d.y < y0 || d.y > y1) return;
      let ox = 0, oy = 0;
      const dx = d.x - S.x, dy = d.y - S.y, dist = Math.hypot(dx, dy);
      if (parting > 0 && dist < 34) { const k = (34 - dist) / 34 * 9 * parting; ox = dx / (dist || 1) * k; oy = dy / (dist || 1) * k * 0.6; }
      const odd = (Math.floor(bpos + d.ph * 2) & 1);
      items.push({ y: d.y + oy, fn: function () { drawPerson(d.look, dist < 26 && parting > 0 ? (dx > 0 ? 'l' : 'r') : 'd', 0, odd ? 'dance' : 'stand', d.x + ox, d.y + oy, odd ? -1 : 0); } });
    });
    items.sort(function (a, b) { return a.y - b.y; });
    items.forEach(function (it) { it.fn(); });

    /* interaction hint above target */
    if (E.target && !E.paused) {
      const tg = E.target;
      let hx, hy;
      if (tg.type === 'npc') { const p = npcPos(tg); hx = p.x * TS; hy = p.y * TS - 28; } else { hx = tg.rect.x + tg.rect.w / 2; hy = tg.rect.y - 10; }
      g.fillStyle = C.W; g.fillRect(Math.round(hx - 5), Math.round(hy - 1 + Math.sin(t * 6)), 10, 9);
      g.fillStyle = C.K; EM.drawText(g, 'Z', Math.round(hx - 1), Math.round(hy + 1 + Math.sin(t * 6)), 'K');
    }
    g.restore();

    /* darkness mask (dithered, no soft shadows) */
    if (Z.dark > 0) darkMask(camx + shakeX, camy + shakeY);

    if (E.overlay) E.overlay(g);

    /* screen-wipe: dithered */
    if (E.fade > 0) {
      g.fillStyle = C.K;
      const f = E.fade;
      for (let y = 0; y < VH; y += 2) for (let x = 0; x < VW; x += 2) {
        if (BAYER[((y >> 1) & 3) * 4 + ((x >> 1) & 3)] / 16 < f) g.fillRect(x, y, 2, 2);
      }
    }
  };

  let maskCanvas = null, maskData = null;
  function darkMask(camx, camy) {
    if (!maskCanvas) { maskCanvas = EM.mkCanvas(VW, VH); maskData = maskCanvas.getContext('2d').createImageData(VW, VH); }
    const d = maskData.data;
    const lights = Z.lights.slice();
    const pr = Z.id === 'tunnel' ? 40 : (Z.id === 'darkroom' ? 34 : (Z.dark > 0.5 ? 40 : 30));
    lights.push({ x: S.x, y: S.y - 8, r: pr });
    const dark = Z.dark;
    const lx = lights.map(function (l) { return { x: l.x - camx, y: l.y - camy, r: l.r }; });
    for (let y = 0; y < VH; y++) for (let x = 0; x < VW; x++) {
      let lf = 0;
      for (let i = 0; i < lx.length; i++) {
        const l = lx[i];
        const dx = x - l.x, dy = (y - l.y) * 1.1;
        const dd = dx * dx + dy * dy;
        if (dd < l.r * l.r) { const v = 1 - Math.sqrt(dd) / l.r; if (v > lf) lf = v; }
      }
      const v = dark * (1 - Math.min(1, lf * 1.6));
      const hidden = BAYER[(y & 3) * 4 + (x & 3)] / 16 < v;
      const o = (y * VW + x) * 4;
      if (hidden) { d[o] = 10; d[o + 1] = 10; d[o + 2] = 10; d[o + 3] = 255; } else d[o + 3] = 0;
    }
    maskCanvas.getContext('2d').putImageData(maskData, 0, 0);
    g.drawImage(maskCanvas, 0, 0);
  }

  /* ------------------------------------------------------------ misc API */
  E.npcRuntime = function (id) { return R && R.ents.filter(function (e) { return e.id === id; })[0]; };
  E.moveNpc = function (id, x, y) { S.moved[id] = { x: x, y: y }; };
  E.refreshCrowd = rebuildCrowd;
  E.fadeOut = function (cb) { E.fadeDir = 1; E.fadeCb = cb; };
  E.fadeIn = function () { E.fadeDir = -1; };
  E.camera = function () { return { w: VW, h: VH }; };
  E.playerRect = function () { return { x: S.x, y: S.y }; };
})();

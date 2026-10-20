/* EXCUSE ME — arrow-key rhythm: dance gates and groups (follow the arrows), freestyle dancing, breathing, reagent test.
   All timing comes from the beat grid in EM.audio (performance.now domain). */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, E = EM.engine, U = EM.ui, $ = EM.$;
  const C = EM.PAL;
  const A = EM.audio;

  let R = null;

  function setHint(t) { const h = $('#hint-prompt'); if (h) h.textContent = EM.tr(t); }

  function begin(spec) {
    U.mode = 'rhythm'; E.paused = true; E.input.x = E.input.y = 0; U.keys = {};
    R = spec;
    A.hold = true;
    E.overlay = drawOverlay;
    E.dancing = !!spec.dancing;
    U.rhythmKey = onKey;
    U.rhythmCancel = function () { if (R && R.cancel) R.cancel(); };
    show('dialog', false);
  }
  function show(id, on) { const e = $('#' + id); if (e) e.hidden = !on; }
  function finish(result, delay) {
    const cb = R && R.cb;
    const spec = R;
    setTimeout(function () {
      E.overlay = null; E.dancing = false; U.rhythmKey = null; U.rhythmCancel = null; R = null; A.hold = false;
      if (U.mode === 'rhythm') { U.mode = 'play'; E.paused = false; E.gateCool = 1.0; }
      if (cb) cb(result, spec);
      U.hint();
    }, delay || 700);
    R.over = true;
  }

  /* ------------------------------------------------------------ overlay drawing */
  function box(g, x, y, w, h) {
    g.fillStyle = C.K; g.fillRect(x, y, w, h);
    g.fillStyle = C.W; g.fillRect(x, y, w, 1); g.fillRect(x, y + h - 1, w, 1); g.fillRect(x, y, 1, h); g.fillRect(x + w - 1, y, 1, h);
  }
  function drawOverlay(g) {
    if (!R) return;
    const b = A.beatPos();
    if (R.kind === 'follow') drawFollow(g, b);
    else if (R.kind === 'reagent') drawReagent(g);
  }

  function drawFollow(g, b) {
    const w = 168, x = 44, y = 98;
    box(g, x, y, w, 34);
    const hitX = x + 20;
    g.fillStyle = C.G; g.fillRect(hitX - 1, y + 3, 1, 22); g.fillRect(hitX + 11, y + 3, 1, 22);
    const speed = 22; /* px per beat */
    for (let i = 0; i < R.seq.length; i++) {
      const bt = R.B0 + i * R.step;
      const ax = hitX + (bt - b) * speed;
      if (ax < x + 2 || ax > x + w - 14) continue;
      const res = R.res[i];
      g.drawImage(EM.arrow(R.seq[i], res === 'hit' ? 'G' : (res === 'miss' ? 'D' : 'W')), Math.round(ax), y + 8);
    }
    g.fillStyle = C.W; g.fillRect(x + 6, y + 28, Math.round((w - 12) * R.hits / Math.max(1, R.seq.length)), 2);
    g.fillStyle = C.G; g.fillRect(x + 6, y + 30, w - 12, 1);
    if (R.combo > 2) EM.drawText(g, 'X' + R.combo, x + w - 20, y + 3, 'W');
  }

  function drawReagent(g) {
    const w = 120, h = 78, x = 68, y = 30;
    box(g, x, y, w, h);
    const st = R.stage, tests = R.tests, test = tests && tests[st], n = tests ? tests.length : 3;
    /* a reagent test: the title of the test on top, and the liquid takes the colour the sample gives */
    const taken = !!test && R.t > R.per * 0.45;
    if (test) EM.drawText(g, EM.tr(test.name), x + 6, y + 5, 'W');
    /* vial */
    const vx = x + 48, vy = y + 12;
    if (test) { g.fillStyle = '#34343F'; g.fillRect(vx + 1, vy + 2, 22, 44); }
    g.fillStyle = C.W; g.fillRect(vx, vy, 24, 2); g.fillRect(vx, vy, 1, 46); g.fillRect(vx + 23, vy, 1, 46); g.fillRect(vx, vy + 46, 24, 1);
    const fill = Math.min(1, R.t / (test ? R.per * 0.25 : 2.2));
    const level = Math.round(34 * fill);
    for (let yy = 0; yy < level; yy++) for (let xx = 0; xx < 22; xx++) {
      if (taken) {
        const cs = test.colors;
        g.fillStyle = cs.length > 1 ? cs[((xx >> 1) + (yy >> 1)) & 1 ? 1 : 0] : cs[0];
        g.fillRect(vx + 1 + xx, vy + 45 - yy, 1, 1);
        continue;
      }
      const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5][(yy & 3) * 4 + (xx & 3)] / 16;
      const dens = st === 0 || test ? 0.25 : (st === 1 ? 0.55 : 0.85);
      g.fillStyle = bayer < dens ? C.W : C.G;
      g.fillRect(vx + 1 + xx, vy + 45 - yy, 1, 1);
    }
    /* drops */
    if (test ? R.t < 0.5 : (st === 0 && R.t < 1.2)) { g.fillStyle = C.W; g.fillRect(vx + 11, vy - 6 + Math.round(R.t * (test ? 28 : 14)), 2, 3); }
    g.fillStyle = C.G; for (let i = 0; i < n; i++) g.fillRect(x + 8 + i * 6, y + h - 8, 4, 3);
    g.fillStyle = C.W; for (let i = 0; i <= st; i++) g.fillRect(x + 8 + i * 6, y + h - 8, 4, 3);
  }

  /* ------------------------------------------------------------ dance gates and groups */
  /* One rule for all dancing: the arrows scroll in on the beat and you press the matching one. No memory.
     spec: { seq:'LLRLL', attempts:3 } -> cb('win'|'partial'|'fail'|'bail') */
  U.danceGate = function (spec, cb) {
    const seq = spec.seq.split('');
    const attempts = spec.attempts || 2;
    let attempt = 1;
    function run() {
      U.followRhythm({ seq: seq, step: 1, window: 0.55, dancing: true, title: T('FOLLOW THE ARROWS ON THE BEAT.', 'SIGUE LAS FLECHAS AL RITMO.', 'SIGA AS SETAS NO RITMO.') }, function (res) {
        if (res.bailed) { cb('bail'); return; }
        const ratio = res.hits / seq.length;
        const grade = ratio >= 0.65 ? 'win' : (ratio >= 0.35 ? 'partial' : 'fail');
        if (grade === 'fail' && attempt < attempts) {
          attempt++;
          U.toast({ text: T('They shake it off. Again.', 'Lo sacuden. Otra vez.', 'Eles sacodem. De novo.'), kind: 'info', ms: 1800, nolog: true });
          setTimeout(run, 250);
          return;
        }
        cb(grade);
      });
    }
    run();
  };

  /* ------------------------------------------------------------ follow: freestyle + breathing */
  /* spec: { seq:[...'U','D'...], step:1 (beats between arrows), window:0.4, title, dancing } -> cb({hits,total,best}) */
  U.followRhythm = function (spec, cb) {
    const seq = spec.seq;
    begin({ kind: 'follow', seq: seq, step: spec.step || 1, win: spec.window || 0.4, res: [], hits: 0, combo: 0, best: 0, cb: cb, dancing: !!spec.dancing, noRhythm: EM.settings.noRhythm, cur: 0, cancel: function () { R.over = true; clearTimeout(R.endTimer); finish({ hits: R.hits, total: seq.length, best: R.best, bailed: true }, 100); } });
    R.B0 = Math.ceil(A.beatPos()) + 3;
    setHint(spec.title || T('Press the arrows on the beat.', 'Presiona las flechas al ritmo.', 'Aperte as setas no ritmo.'));
    const total = (R.B0 + seq.length * R.step + 1 - A.beatPos()) * A.beatDur() * 1000;
    R.endTimer = setTimeout(function () {
      if (!R || R.over) return;
      for (let i = 0; i < seq.length; i++) if (!R.res[i]) R.res[i] = 'miss';
      EM.audio.blip(R.hits >= seq.length * 0.6 ? 'good' : 'bad');
      finish({ hits: R.hits, total: seq.length, best: R.best }, 600);
    }, total);
    R.judge = function (d) {
      if (R.over) return;
      const b = A.beatPos();
      let idx = Math.round((b - R.B0) / R.step);
      if (idx < 0 || idx >= seq.length) return;
      if (R.noRhythm) { idx = R.res.length; if (idx >= seq.length) return; }
      else if (R.res[idx] || Math.abs(b - (R.B0 + idx * R.step)) > R.win * R.step) return;
      if (d === seq[idx]) { R.res[idx] = 'hit'; R.hits++; R.combo++; R.best = Math.max(R.best, R.combo); EM.audio.blip('select'); }
      else { R.res[idx] = 'miss'; R.combo = 0; EM.audio.blip('bad'); }
    };
  };

  function onKey(d) { if (R && R.judge) R.judge(d); }

  /* freestyle at a dance spot */
  U.freestyle = function (spotId) {
    const s = EM.state;
    const r = EM.mulberry32((Math.random() * 1e9) | 0);
    const dirs = ['L', 'R', 'U', 'D'];
    const seq = []; for (let i = 0; i < 16; i++) seq.push(dirs[Math.floor(r() * 4)]);
    U.followRhythm({ seq: seq, step: 1, window: 0.5, dancing: true, title: T('FREESTYLE: follow the arrows on the beat. [X] stops.', 'FREESTYLE: sigue las flechas al ritmo. [X] para.', 'FREESTYLE: siga as setas no ritmo. [X] para.') }, function (res) {
      let fun = Math.round(res.hits * 1.5 + res.best * 0.5);
      if (s.party.length >= 2) fun += 3;
      if (s.fx.mdma) fun += 5;
      if (L.rave()) fun += 4; /* a rave is for dancing */
      L.apply({ fun: fun, hp: L.rave() ? 1.5 : -1 - (res.hits > 10 ? 1 : 0), time: 12, soc: s.fx.mdma ? 3 : 1 });
      if (L.danceCost(res.hits > 10 ? 3 : 2)) U.toast({ icon: 'sweat', text: T('Your heart is going a little too hard for this tempo.', 'Tu corazón va un poco demasiado fuerte para este tempo.', 'Seu coração tá indo um pouco forte demais pra esse andamento.'), kind: 'bad', ms: 3200 });
      s.thirst += 12;
      s.cool[spotId] = s.time + 45;
      const bad = res.hits < 6;
      U.toast({ icon: bad ? 'sweat' : 'note', text: bad ? T('Not your best set. Still dancing, though.', 'No fue tu mejor set. Pero bailaste.', 'Não foi seu melhor set. Mas dançou.') : (res.hits > 12 ? T('You were SOMETHING out there.', 'Estabas ARDIENDO ahí afuera.', 'Você estava PEGANDO FOGO ali.') : T('That felt good.', 'Se sintió bien.', 'Foi bom.')), kind: bad ? 'info' : 'good' });
      s.flags.danced_once = true;
    });
  };

  /* breathing (calm someone, or yourself): alternate U / D every 2 beats */
  U.breathing = function (cb, who) {
    const seq = []; for (let i = 0; i < 10; i++) seq.push(i % 2 ? 'D' : 'U');
    U.followRhythm({ seq: seq, step: 2, window: 0.42, title: T('BREATHE IN (↑) ... OUT (↓). Slow. On the beat.', 'INHALA (↑) ... EXHALA (↓). Lento. Al ritmo.', 'INSPIRE (↑) ... EXPIRE (↓). Devagar. No ritmo.') }, function (res) { cb(res.hits >= 6 ? 'calm' : 'rough', res); });
  };

  /* reagent test: a 3-stage animation, 7 seconds */
  /* tests (optional): [{ name, word, colors, title }] from EM.drugs.tests(): one stage per test, with the test's title
     and the colour it takes. Without it the old three-stage animation plays. */
  U.reagent = function (cb, tests) {
    tests = tests && tests.length ? tests : null;
    const n = tests ? tests.length : 3;
    begin({ kind: 'reagent', t: 0, stage: 0, cb: cb, cancel: function () {}, tests: tests, per: 7.4 / n, shown: {} });
    const t0 = performance.now();
    const msgs = [
      T('A scraping from the pill. A drop of liquid. Nobody in the room moves.', 'Se raspa un poco de la pastilla. Una gota de líquido. Nadie en el cuarto se mueve.', 'Raspa-se um pouco do comprimido. Uma gota de líquido. Ninguém na sala se mexe.'),
      T('It changes. Isi watches it like a bank teller counting.', 'Cambia. Isi lo mira como una cajera contando billetes.', 'Muda. A Isi olha como uma caixa contando notas.'),
      T('It settles. Isi checks the card twice.', 'Se asienta. Isi revisa la tarjeta dos veces.', 'Assenta. A Isi confere o cartão duas vezes.')
    ];
    setHint(tests ? tests[0].name : msgs[0]);
    const iv = setInterval(function () {
      if (!R || R.kind !== 'reagent') { clearInterval(iv); return; }
      const e = (performance.now() - t0) / 1000;
      const st = tests ? Math.min(n - 1, Math.floor(e / R.per)) : (e < 2.5 ? 0 : (e < 5 ? 1 : 2));
      if (st !== R.stage) { R.stage = st; R.t = 0; setHint(tests ? tests[st].name : msgs[st]); EM.audio.blip('warn'); }
      R.t += 0.05;
      /* the colour takes: say it in words too, for anyone who cannot tell the colours apart */
      if (tests && R.t > R.per * 0.45 && !R.shown[st]) { R.shown[st] = 1; setHint(tests[st].title); EM.audio.blip('select'); }
      if (e >= 7.4) { clearInterval(iv); finish('done', 100); }
    }, 50);
  };
})();

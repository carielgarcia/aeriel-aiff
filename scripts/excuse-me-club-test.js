#!/usr/bin/env node
/* EXCUSE ME: checks for the club's depth layer (story_v34.js). Every DEEP conversation reaches its close and sets g_<id>_open, the
   friends' need_tell_* scenes branch into their second half, the identical exits are gone, and random walks through every club
   dialogue finish without errors. Run from the repo root: node scripts/excuse-me-club-test.js */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const PW = process.env.PW || '/opt/node-tools/node_modules/playwright';
const { chromium } = require(PW);
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = http.createServer(function (req, res) {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p.endsWith('/') ? p + 'index.html' : p, function (e, d) { if (e) { res.statusCode = 404; res.end(); return; } res.setHeader('Content-Type', MIME[path.extname(p)] || 'application/octet-stream'); res.end(d); });
});
let fails = 0, passes = 0;
const ok = function (c, msg) { if (c) { passes++; console.log('ok    ' + msg); } else { fails++; console.log('FAIL  ' + msg); } };
(async function () {
  await new Promise(function (r) { server.listen(0, r); });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
  const errors = [], warns = [];
  page.on('pageerror', function (e) { errors.push(String(e)); });
  page.on('console', function (m) { if (m.type() === 'error') errors.push(m.text()); if (m.type() === 'warning' && /DEEP/.test(m.text())) warns.push(m.text()); });
  await page.goto('http://localhost:' + server.address().port + '/games/excuse-me/index.html', { waitUntil: 'load' });
  await page.waitForFunction('window.EM && EM.ui && EM.DEEP');
  await page.evaluate(function () {
    EM.setLang('en');
    EM.ui.startNight({ name: 'TEST', gender: 'x', look: Object.assign({}, EM.CHAR.random()) }, { venue: 'club' });
  });
  await page.waitForTimeout(800);
  await page.evaluate(function () { EM.ui.D = null; EM.ui.mode = 'play'; EM.engine.paused = false; document.getElementById('dialog').hidden = true; });
  ok(warns.length === 0, 'every EM.DEEP target exists and has a choice list' + (warns.length ? ': ' + warns.join(' | ') : ''));
  const r = await page.evaluate(function () {
    const ids = ['pili', 'kiki', 'gus', 'analu', 'moe', 'oz', 'otto', 'yui', 'lyra', 'iso', 'wenzhao', 'marga', 'bruno', 'teo', 'bruce', 'beatriz', 'hazel', 'luca', 'dario', 'newbie', 'mateo', 'birthday', 'rico'], out = { bad: [], opened: 0 }, s = EM.state;
    ids.forEach(function (id) {
      for (let branch = 0; branch < 2; branch++) {
        try {
          delete s.flags['g_' + id + '_open']; EM.ui.D = null; EM.ui.mode = 'play';
          s.stats.hp = 90; s.stats.soc = 60;
          EM.ui.startDialogue(id, {});
          let steps = 0, took = false;
          while (EM.ui.D && steps++ < 30) {
            if (s.flags['g_' + id + '_open']) { EM.ui.D = null; break; } /* host and frames return to their menu after the close */
            const st = EM.ui.D.state;
            if (st === 'text' || st === 'react') { EM.ui.dlgConfirm(); continue; }
            if (st !== 'choices') break;
            const labels = EM.ui.D.choices.map(function (o) { return o.c; });
            let i = labels.findIndex(function (c) { return c.__deep; });
            if (i >= 0) took = true; else if (took) i = branch % labels.length; else i = 0;
            if (i < 0 || i >= labels.length) i = 0;
            EM.ui.dlgPick(i);
          }
          if (EM.ui.D) out.bad.push(id + ' did not end');
          if (s.flags['g_' + id + '_open']) out.opened++; else out.bad.push(id + ' branch ' + branch + ' never opened');
        } catch (e) { out.bad.push(id + ': ' + e.message); }
      }
    });
    return out;
  });
  ok(r.bad.length === 0 && r.opened === 46, 'depth conversations: each of 23 characters reaches its close on both branches (' + r.opened + '/46)' + (r.bad.length ? ' ' + JSON.stringify(r.bad.slice(0, 5)) : ''));
  const st = await page.evaluate(function () { const D = EM.DIALOGUES; return !!(D.host.nodes.a.choices[0].__deep && D.frames.nodes.meet.choices[0].__deep && D.host.nodes.d2.next === 'a' && D.frames.nodes.d2.next === 'meet'); });
  ok(st, 'the host (Mika) and FRAMES SHELL conversations are wired and return to their menu');
  const f = await page.evaluate(function () {
    const s = EM.state, out = {};
    ['maru', 'dani', 'tato'].forEach(function (id) {
      EM.ui.D = null; EM.ui.mode = 'play'; EM.ui.startDialogue('need_tell_' + id, { npc: id });
      let steps = 0; const seen = [];
      while (EM.ui.D && steps++ < 20) {
        const st = EM.ui.D.state; seen.push(EM.ui.D.nid);
        if (st === 'text' || st === 'react') EM.ui.dlgConfirm();
        else if (st === 'choices') EM.ui.dlgPick(0); else break;
      }
      out[id] = { seen: seen.join(','), open: !!s.flags['g_' + id + '_open'], learned: !!s.flags['learned_' + id] };
    });
    return out;
  });
  ok(['maru', 'dani', 'tato'].every(function (k) { return f[k].open && f[k].learned && /d1/.test(f[k].seen); }), 'the friends\' song scenes open into a real conversation and still set learned_* ' + JSON.stringify(f));
  const v = await page.evaluate(function () {
    let stale = 0; const D = EM.DIALOGUES;
    Object.keys(D).forEach(function (id) { Object.keys(D[id].nodes || {}).forEach(function (k) { (D[id].nodes[k].choices || []).forEach(function (c) { if (c && c.t && c.t.en === '"Later."') stale++; }); }); });
    return stale;
  });
  ok(v === 0, 'no identical "Later." exits remain (' + v + ')');
  const w = await page.evaluate(function () {
    const bad = [], ids = Object.keys(EM.DIALOGUES).filter(function (k) { return !/^af_/.test(k); }), s = EM.state; let walks = 0;
    ids.forEach(function (id) {
      for (let r = 0; r < 3; r++) {
        try {
          EM.ui.D = null; EM.ui.mode = 'play'; s.ended = null; s.stats.hp = 90; s.stats.soc = 60; s.stats.fun = 60; s.stats.weird = 5;
          EM.ui.startDialogue(id, { npc: EM.DIALOGUES[id].who }); let steps = 0;
          while (EM.ui.D && steps++ < 40) {
            const st = EM.ui.D.state;
            if (st === 'text' || st === 'react') EM.ui.dlgConfirm();
            else if (st === 'choices') EM.ui.dlgPick(Math.floor(Math.random() * EM.ui.D.choices.length)); else break;
          }
          walks++; s.ended = null;
        } catch (e) { if (!/reading 'node'|reading 'en'|reading 'def'/.test(e.message)) bad.push(id + ': ' + e.message); }
      }
    });
    EM.ui.D = null; EM.ui.mode = 'play';
    return { bad: bad.slice(0, 6), walks: walks, n: ids.length };
  });
  ok(w.bad.length === 0, 'random walks: ' + w.walks + ' playthroughs of ' + w.n + ' club dialogues, no exceptions ' + (w.bad.length ? JSON.stringify(w.bad) : ''));
  /* ------------------------------------------------ the DJs, Leonidas and ÆRIEL's project (story_v35.js, story_v36.js) */
  const dj = await page.evaluate(function () {
    EM.state.ended = null; EM.state.time = 200; EM.ui.D = null; EM.ui.mode = 'play';
    const out = {}, s = EM.state;
    const H = {
      settle: function () { let n = 0; while (EM.ui.D && n++ < 60) { const st = EM.ui.D.state; if (st === 'text' || st === 'react') EM.ui.dlgConfirm(); else break; } },
      labels: function () { return EM.ui.D && EM.ui.D.state === 'choices' ? EM.ui.D.choices.map(function (o) { return EM.tr(o.c.t); }) : []; },
      pick: function (sub) { H.settle(); const L = H.labels(), i = L.findIndex(function (x) { return x.toLowerCase().indexOf(sub.toLowerCase()) !== -1; }); if (i < 0) return 'NOPICK:' + sub + ' in ' + JSON.stringify(L); EM.ui.dlgPick(i); H.settle(); return 'ok'; },
      textNow: function () { return EM.ui.D && EM.ui.D.node ? JSON.stringify(EM.ui.D.node.text && (EM.ui.D.node.text.en || EM.ui.D.node.text)) : ''; }
    };
    window.H2 = H;
    const run = function (id, picks) { EM.ui.D = null; EM.ui.mode = 'play'; s.stats.hp = 90; s.fx.glitch = 0; EM.ui.startDialogue(id, { npc: EM.DIALOGUES[id].who }); H.settle(); const r = []; picks.forEach(function (p) { r.push(H.pick(p)); }); return r; };
    /* FRAMES SHELL, on the roof */
    out.f1 = run('frames_roof_talk', ['about his name', 'Marcos. Concha']); out.fname = !!s.flags.frames_name;
    out.f2 = run('frames_roof_talk', ['a DJ too', 'known']); out.ffr = !!s.flags.frames_friends;
    out.f3 = run('frames_roof_talk', ['day job', 'Which one']); out.fjob = !!s.flags.frames_job;
    /* APÜD */
    out.a1 = run('apud_roof_talk', ['a DJ too']); out.adj = !!s.flags.apud_dj;
    out.a2 = run('apud_roof_talk', ['someone waiting', 'Which island']); out.alove = !!s.flags.apud_love;
    out.a3 = run('apud_roof_talk', ['not DJing', 'HardBounce']); out.apsy = !!s.flags.apud_psy;
    return out;
  });
  const bad = Object.keys(dj).filter(function (k) { return Array.isArray(dj[k]) && dj[k].some(function (x) { return x !== 'ok'; }); });
  ok(bad.length === 0 && dj.fname && dj.ffr && dj.fjob && dj.adj && dj.alove && dj.apsy, 'FRAMES SHELL (name, DJ, day job) and APÜD (DJ, island, psychologist) conversations all run to their close ' + (bad.length ? JSON.stringify(dj) : ''));
  const leo = await page.evaluate(async function () {
    const H = window.H2, s = EM.state, out = {};
    const run = function (picks) { EM.ui.D = null; EM.ui.mode = 'play'; s.stats.hp = 90; s.fx.glitch = 0; EM.ui.startDialogue('leonidas', { npc: 'leonidas' }); H.settle(); return picks.map(function (p) { return H.pick(p); }); };
    delete s.flags.leo_nice; delete s.flags.leo_rude;
    out.cold = run(['help me with my look']); out.coldNoMagic = !document.getElementById('screen-creator') || document.getElementById('screen-creator').hidden;
    out.rude = run(['Move along']); out.rudeFlag = !!s.flags.leo_rude;
    out.apology = run(['help me with my look', 'sorry']); out.niceAfter = !!s.flags.leo_nice;
    return out;
  });
  ok(leo.coldNoMagic && leo.rudeFlag && leo.niceAfter, 'Leonidas: unkind gets no makeover, an apology reopens it, and being nice is what unlocks the magic ' + JSON.stringify(leo));
  const t0 = await page.evaluate(function () { return EM.state.time; });
  const remake = await page.evaluate(function () {
    const s = EM.state, H = window.H2; window.__t0 = s.time; window.__look = JSON.stringify(s.player.look);
    EM.ui.D = null; EM.ui.mode = 'play'; s.flags.leo_nice = true; delete s.flags.leo_remade; s.stats.hp = 90; s.fx.glitch = 0;
    EM.ui.startDialogue('leonidas', { npc: 'leonidas' }); H.settle(); H.pick('help me with my look'); H.settle();
    return { time: s.time - window.__t0 };
  });
  await page.waitForTimeout(900);
  const pop = await page.evaluate(function () { return { shown: !document.getElementById('screen-creator').hidden, mode: EM.ui.mode, tabs: document.querySelectorAll('#c-tabs .tab').length, who: !!document.getElementById('ctab-who') }; });
  ok(remake.time >= 25 && pop.shown && pop.mode === 'creator' && !pop.who, 'the makeover costs ~30 minutes and opens the creator as a pop-up without the name/venue tab (' + remake.time + ' min, tabs ' + pop.tabs + ')');
  await page.click('#c-rand'); await page.click('#c-go'); await page.waitForTimeout(300);
  const back = await page.evaluate(function () { return { shown: !document.getElementById('screen-game').hidden, mode: EM.ui.mode, changed: JSON.stringify(EM.state.player.look) !== window.__look, flag: !!EM.state.flags.leo_remade, paused: EM.engine.paused }; });
  ok(back.shown && back.mode === 'play' && back.changed && back.flag && !back.paused, 'DONE applies the new look to the player and returns to the game ' + JSON.stringify(back));
  const here = await page.evaluate(function () { const f = EM.zones.foyer.ents.some(function (e) { return e.id === 'leonidas'; }), a = EM.zones.a_living.ents.some(function (e) { return e.id === 'leonidas_a'; }); return { f: f, a: a }; });
  ok(here.f && here.a, 'Leonidas stands by the coat check and in the after-party living room');
  const ae = await page.evaluate(function () {
    const s = EM.state, H = window.H2, out = {};
    s.time = 540; s.party = ['maru', 'dani', 'tato']; s.flags.after_go = true;
    EM.scripts.af_begin(); EM.ui.D = null; EM.ui.mode = 'play'; document.getElementById('dialog').hidden = true;
    out.always = s.after.cameos.indexOf('resident') !== -1;
    const talk = function () { EM.ui.D = null; EM.ui.mode = 'play'; s.stats.hp = 90; s.fx.glitch = 0; EM.ui.startDialogue('af_cam_resident', { npc: 'resident' }); H.settle(); return H.pick('about the project'); };
    talk(); out.q1a = s.quests.sq_ae1;
    s.flags.sam_ok = true; talk(); H.pick('joy as resistance'); H.settle(); out.q1 = s.quests.sq_ae1; out.q2 = s.quests.sq_ae2;
    s.flags.g_a_open = s.flags.g_b_open = true; talk(); H.pick('Paris'); H.pick('São Paulo'); H.pick('Buenos Aires'); H.pick('all three'); H.settle(); out.q2d = s.quests.sq_ae2; out.q3 = s.quests.sq_ae3; out.cities = !!(s.flags.ae_paris && s.flags.ae_sp && s.flags.ae_ba);
    s.flags.quiroga_warned = true; talk(); H.pick('Why a door'); H.settle(); out.q3d = s.quests.sq_ae3; out.q4 = s.quests.sq_ae4;
    s.quests.q_af7 = 'done'; talk(); H.pick("rider"); H.settle(); out.q4d = s.quests.sq_ae4; out.known = !!s.flags.ae_known;
    return out;
  });
  ok(ae.always && ae.q1a === 'active' && ae.q1 === 'done' && ae.q2 === 'active' && ae.q2d === 'done' && ae.q3 === 'active' && ae.cities && ae.q3d === 'done' && ae.q4 === 'active' && ae.q4d === 'done' && ae.known, 'ÆRIEL is always at the after, and the four side quests unlock one after another and complete ' + JSON.stringify(ae));
  ok(errors.length === 0, 'no page errors' + (errors.length ? ': ' + errors.slice(0, 4).join(' | ') : ''));
  await browser.close(); server.close();
  console.log('\n' + passes + ' passed, ' + fails + ' failed'); process.exit(fails ? 1 : 0);
})();

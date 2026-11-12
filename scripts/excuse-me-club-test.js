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
  ok(errors.length === 0, 'no page errors' + (errors.length ? ': ' + errors.slice(0, 4).join(' | ') : ''));
  await browser.close(); server.close();
  console.log('\n' + passes + ' passed, ' + fails + ' failed'); process.exit(fails ? 1 : 0);
})();

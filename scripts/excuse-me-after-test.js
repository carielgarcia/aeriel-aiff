#!/usr/bin/env node
/* EXCUSE ME: scripted play for THE AFTER (story_v29*.js). Drives the real game in headless Chromium: the sunrise choice, the hosts'
   rules, the kitchen, the bedroom, the bag, the whole knock ladder (warning, then OUT), the master bedroom's consent gate and
   encounters, the host rule, the phone, the noon ending, the go-home route, and a trilingual scan of every new string.
   Run from the repo root:  node scripts/excuse-me-after-test.js   (needs Playwright; set PW to its path if it is not at the default) */
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
  const port = server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
  const errors = [];
  page.on('pageerror', function (e) { errors.push(String(e)); });
  page.on('console', function (m) { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:' + port + '/games/excuse-me/index.html', { waitUntil: 'load' });
  await page.waitForFunction('window.EM && EM.ui && EM.scripts && EM.scripts.af_begin');

  /* helpers living in the page */
  await page.evaluate(function () {
    window.H = {
      /* click through text until choices or the dialogue ends; returns the id of the open dialogue */
      settle: function () { let n = 0; while (EM.ui.D && n++ < 80) { const st = EM.ui.D.state; if (st === 'text' || st === 'react') EM.ui.dlgConfirm(); else break; } return EM.ui.D ? EM.ui.D.id : null; },
      labels: function () { return EM.ui.D && EM.ui.D.state === 'choices' ? EM.ui.D.choices.map(function (o) { return EM.tr(o.c.t); }) : []; },
      pick: function (sub) {
        H.settle(); const L = H.labels(), i = L.findIndex(function (x) { return x.toLowerCase().indexOf(sub.toLowerCase()) !== -1; });
        if (i < 0) return 'NOPICK:' + sub + ' in ' + JSON.stringify(L);
        EM.ui.dlgPick(i); return 'ok';
      },
      run: function (subs) { const out = []; subs.forEach(function (x) { out.push(H.pick(x)); }); H.settle(); return out; },
      st: function () { return EM.state; }
    };
    EM.setLang('en');
    EM.settings.speed = 0.25; /* the scenes were tuned at PACE 0.25 (1/4x) */
    const player = { name: 'TEST', gender: 'x', look: Object.assign({}, EM.CHAR.random()) };
    EM.ui.startNight(player, { venue: 'club' });
  });
  await page.waitForTimeout(800);
  /* dismiss the intro if it opened */
  await page.evaluate(function () { if (EM.ui.D) { EM.ui.D = null; } EM.ui.mode = 'play'; EM.engine.paused = false; document.getElementById('dialog').hidden = true; });

  /* ------------------------------------------------ 1. the sunrise, then THE AFTERS mission (story_v30.js) */
  const r1 = await page.evaluate(function () {
    const s = EM.state; s.time = 515; s.party = ['maru', 'dani', 'tato']; s.flags.roof_open = true; s.quests.q9 = 'active'; s.flags.wed_done = true;
    s.bond.maru = 3; s.bond.dani = 1; s.bond.tato = 2;
    EM.scripts.sunrise(); H.settle();
    const star = Object.keys(EM.seekTargets(EM.state));
    return { ended: EM.state.ended || null, q9: EM.state.quests.q9, q13: EM.state.quests.q13, open: !!EM.state.flags.afters_open, star: star };
  });
  ok(!r1.ended && r1.q9 === 'done' && r1.q13 === 'active' && r1.open && r1.star.indexOf('af_inviter') !== -1, 'the sunrise does not end the night: THE AFTERS mission starts with a golden star on Anselm (' + JSON.stringify(r1) + ')');
  const r1b = await page.evaluate(function () {
    EM.ui.startDialogue('afters_invite', { npc: 'af_inviter' }); H.settle();
    const labels = H.labels();
    const out = H.pick('toast');
    return out === 'ok' && labels.length === 3 ? 'ok' : 'NOPICK ' + JSON.stringify(labels);
  });
  await page.waitForTimeout(900);
  const r1c = await page.evaluate(function () { return { go: !!EM.state.flags.after_go, after: !!EM.state.after, d: EM.ui.D && EM.ui.D.id, ended: EM.state.ended || null, q: EM.state.quests.q_af1 }; });
  ok(r1b === 'ok' && r1c.go && r1c.after && r1c.d === 'af_travel' && !r1c.ended && r1c.q === 'active', 'going to the after keeps the same night (no ending), starts GETTING THERE');

  /* ------------------------------------------------ 2. getting there: the buddy rule */
  const r2 = await page.evaluate(function () {
    H.pick('taxi'); H.settle();
    const out = { flag: !!EM.state.flags.af_taxi, d: EM.ui.D && EM.ui.D.id };
    H.pick('last stairs'); H.settle(); return out;
  });
  ok(r2.flag && r2.d === 'af_travel', 'GETTING THERE: nobody drives tired, a taxi is split');
  await page.waitForTimeout(1600);
  const r2b = await page.evaluate(function () { return { z: EM.state.zone, q2: EM.state.quests.q_af2, d: EM.ui.D && EM.ui.D.id }; });
  ok(r2b.z === 'a_living' && r2b.q2 === 'active', 'you arrive in the living room, HOUSE RULES is active (zone=' + r2b.z + ')');
  await page.waitForTimeout(1200);
  const r2c = await page.evaluate(function () { return EM.ui.D && EM.ui.D.id; });
  ok(r2c === 'af_rules', 'Dot meets you at the door with the rules (dialogue=' + r2c + ')');

  /* ------------------------------------------------ 3. house rules: the no-photos rule, and what a photo costs */
  const r3 = await page.evaluate(function () {
    const w0 = EM.state.stats.weird;
    H.pick('basket'); H.settle();
    const s = EM.state;
    return { rules: !!s.flags.af_rules, basket: !!s.flags.phone_basket, mbopen: !!s.flags.mb_open, q3: s.quests.q_af3, q8: s.quests.q_af8, strikes: s.hostStrikes || 0, d: EM.ui.D && EM.ui.D.id, w0: w0 };
  });
  ok(r3.rules && r3.basket && r3.mbopen && r3.q3 === 'active' && r3.q8 === 'active' && !r3.strikes, 'HOUSE RULES: phone in the basket, kitchen and the optional master bedroom unlock, no penalty');
  const r3b = await page.evaluate(function () {
    /* a photo in a host's home: a warning that costs a lot */
    const s = EM.state, w = s.stats.weird; s.flags.af_rules = false; delete s.res.trig_af_rules_trig;
    EM.ui.startDialogue('af_rules', { npc: 'dot' }); H.pick('quick photo'); H.settle();
    return { strikes: s.hostStrikes, dw: s.stats.weird - w, ended: s.ended || null };
  });
  ok(r3b.strikes === 1 && r3b.dw >= 25 && !r3b.ended, 'a photo is a first host strike: weirdness +' + Math.round(r3b.dw) + ', not out yet');

  /* ------------------------------------------------ 4. the kitchen, the bedroom, the bag */
  const r4 = await page.evaluate(function () {
    const s = EM.state; s.hostStrikes = 0; s.flags.af_rules = true;
    EM.ui.startDialogue('af_sam', {}); H.pick('Sit beside'); H.settle();
    EM.ui.startDialogue('af_rey', {}); H.pick('buddy'); H.settle();
    const c = { sam: !!s.flags.sam_ok, rey: !!s.flags.rey_ok, buddy: !!s.flags.rey_buddy };
    s.after.at.lio = 0; EM.logic.minute();
    c.q3 = s.quests.q_af3; c.q4 = s.quests.q_af4;
    return c;
  });
  ok(r4.sam && r4.rey && r4.buddy && r4.q3 === 'done' && r4.q4 === 'active', 'THE KITCHEN: comedown and redose handled, two of three is enough; the bedroom call arrives ' + JSON.stringify(r4));
  const r4b = await page.evaluate(function () {
    const s = EM.state; const out = {};
    /* the rousable branch, and the one who cannot be roused */
    s.seed = (function () { for (let i = 0; i < 200; i++) if (EM.mulberry32(i + 777)() >= 0.3) return i; })(); EM.ui.startDialogue('af_lio', {}); out.first = EM.ui.D ? EM.ui.D.nid : 'NULL ' + EM.ui.mode + ' ' + (EM.state.ended || '');
    H.pick('Sit. Ask'); H.pick('Stay. Breathe'); H.settle();
    out.ok = !!s.flags.lio_ok; out.q = s.quests.q_af4; return out;
  });
  ok(r4b.ok && r4b.q === 'done', 'THE PERSON IN THE BEDROOM: stay, ask, water pays and closes the mission');
  const r4c = await page.evaluate(function () {
    const s = EM.state; delete s.flags.lio_done; delete s.flags.lio_ok; s.flags.lio_alone = false;
    /* find a seed where Lio cannot be roused */
    let seed = 0; for (; seed < 200; seed++) if (EM.mulberry32(seed + 777)() < 0.3) break;
    s.seed = seed; const hp = s.stats.hp;
    EM.ui.startDialogue('af_lio', {}); const first = EM.ui.D.nid;
    H.pick('Leave them to sleep'); H.settle();
    return { first: first, neglect: !!s.flags.lio_neglect, dhp: s.stats.hp - hp };
  });
  ok(r4c.first === 'deep' && r4c.neglect && r4c.dhp < 0, 'walking away from someone who cannot be roused is the costly choice (HEALTH ' + Math.round(r4c.dhp) + ')');
  const r4d = await page.evaluate(function () {
    const s = EM.state; delete s.flags.lio_done; delete s.flags.lio_neglect; s.seed = (function () { for (let i = 0; i < 200; i++) if (EM.mulberry32(i + 777)() < 0.3) return i; })();
    EM.ui.startDialogue('af_lio', {}); H.pick('call for help'); H.settle();
    return { called: !!s.flags.lio_called };
  });
  ok(r4d.called, 'calling for help is the right answer when they cannot be roused');
  const r4e = await page.evaluate(function () {
    const s = EM.state; s.fx.mdma = 0; s.after.noise = 0; s.bond.maru = 3; s.bond.dani = 0; s.bond.tato = 1;
    EM.ui.startDialogue('af_pasc', {}); H.pick("I'm good"); H.settle();
    const no = { no: !!s.flags.one_no, took: !!s.fx.mdma, back: ['maru', 'dani', 'tato'].filter(function (f) { return s.flags['one_back_' + f]; }) };
    return no;
  });
  ok(r4e.no && !r4e.took && r4e.back.indexOf('maru') !== -1 && r4e.back.indexOf('dani') === -1, 'ONE MORE: a plain no, no lecture; Maru (bond 3) backs you, Benjamin (bond 1) just decides for himself ' + JSON.stringify(r4e.back));
  const r4f = await page.evaluate(function () {
    const s = EM.state; s.fx.mdma = 120; const hp = s.stats.hp; delete s.flags.one_done;
    EM.ui.startDialogue('af_pasc', {}); H.pick('pinch'); H.settle();
    return { redosed: !!s.flags.redosed, hot: !!s.fx.hot, dhp: s.stats.hp - hp };
  });
  ok(r4f.redosed && r4f.hot, 'saying yes on a first dose still working is a redose with the existing overheating consequence');

  /* ------------------------------------------------ 5. the knock: a bar, five thresholds, warning then OUT */
  const r5 = await page.evaluate(function () {
    const s = EM.state, A = EM.AF; EM.engine.enter('a_living', 13, 13, 'u'); s.after.st = 0; s.after.pend = null; s.after.vol = 1; AF_SET(20);
    function AF_SET(v) { A.setNoise(v); }
    const out = {};
    A.setNoise(30); EM.logic.minute(); out.thump = s.after.st;
    A.setNoise(55); EM.logic.minute(); out.pend = s.after.pend; EM.ui.mode = 'play'; A.dispatch(); out.d = EM.ui.D && EM.ui.D.id;
    const n0 = s.after.noise; H.pick('Say sorry'); H.settle(); out.drop = n0 - s.after.noise; out.q6 = s.quests.q_af6;
    return out;
  });
  ok(r5.thump === 1 && r5.pend === 'af_marcos' && r5.d === 'af_marcos' && r5.drop >= 25, 'THE KNOCK: 25 thump, 50 Marcos at the door; sorry plus lower music cuts the bar by ' + Math.round(r5.drop));
  const r5b = await page.evaluate(function () {
    const s = EM.state, A = EM.AF; A.setNoise(75); EM.logic.minute(); EM.ui.mode = 'play'; A.dispatch();
    const d = EM.ui.D && EM.ui.D.id; s.flags.mb_visit = true;
    const labels = H.labels(); H.settle(); const L = H.labels();
    const joke = L.some(function (x) { return /quiet hour/i.test(x); });
    H.pick('quiet hour'); H.settle();
    return { d: d, joke: joke, ok: !!s.flags.beto_ok, vol: s.after.vol };
  });
  ok(r5b.d === 'af_beto' && r5b.joke && r5b.ok && r5b.vol === 0, 'Beto (the left wall), the night nurse, offers a quiet hour that mutes the music');
  const r5c = await page.evaluate(function () {
    const s = EM.state, A = EM.AF; A.setNoise(95); EM.logic.minute(); EM.ui.mode = 'play'; A.dispatch();
    const d = EM.ui.D && EM.ui.D.id, hi = s.after.noise; H.pick('Apologise with Anselm'); H.settle();
    return { d: d, hi: hi, lo: s.after.noise, warned: !!s.flags.quiroga_warned, st: s.after.st, ended: s.ended || null };
  });
  ok(r5c.d === 'af_quiroga1' && r5c.warned && Math.abs(r5c.lo - r5c.hi * 0.1) < 1.5 && !r5c.ended && r5c.st === 3, 'Quiroga, first visit: a one-time warning and the bar drops 90% (' + Math.round(r5c.hi) + ' to ' + Math.round(r5c.lo) + ')');
  const r5d = await page.evaluate(function () {
    const s = EM.state, A = EM.AF; A.setNoise(96); EM.logic.minute(); EM.ui.mode = 'play'; A.dispatch();
    const d = EM.ui.D && EM.ui.D.id; H.pick('carry the records'); H.settle();
    return { d: d, ended: s.ended || null, evicted: !!s.flags.after_evicted };
  });
  await page.waitForTimeout(900);
  await page.evaluate(function () { H.settle(); H.pick('shoes on'); H.pick('Go home'); H.settle(); });
  await page.waitForTimeout(700);
  const r5e = await page.evaluate(function () { return { ended: EM.state.ended || null, title: document.getElementById('e-title') ? document.getElementById('e-title').textContent : '' }; });
  ok(r5d.d === 'af_quiroga2' && r5d.evicted && r5e.ended === 'after', 'Quiroga, second visit: hard end, you go home (ending: ' + r5e.title + ')');

  /* ------------------------------------------------ 6. the master bedroom: consent gate, Dot behind you, encounters, host rule */
  await page.evaluate(function () {
    const player = { name: 'TEST', gender: 'x', look: Object.assign({}, EM.CHAR.random()) };
    EM.ui.startNight(player, { venue: 'club' });
  });
  await page.waitForTimeout(700);
  const r6 = await page.evaluate(function () {
    EM.ui.D = null; EM.ui.mode = 'play'; EM.engine.paused = false; document.getElementById('dialog').hidden = true;
    const s = EM.state; s.time = 530; s.party = ['maru', 'dani', 'tato']; s.flags.after_go = true; s.flags.af_rules = true; s.flags.mb_open = true; s.flags.phone_basket = true;
    EM.scripts.af_begin(); EM.ui.D = null; EM.ui.mode = 'play'; document.getElementById('dialog').hidden = true;
    EM.engine.enter('a_living', 22, 4, 'u');
    s.fx.ket = 100;
    EM.scripts.af_mb_gate(); H.settle(); const L = H.labels(); const d = EM.ui.D && EM.ui.D.id;
    const out = { d: d, escort: !!s.flags.mb_escort, labels: L };
    return out;
  });
  ok(r6.d === 'af_mb' && r6.escort, 'entering the master bedroom: a forced pop-up, Dot walks in behind you (dialogue=' + r6.d + ')');
  const r6b = await page.evaluate(function () {
    const s = EM.state;
    /* ketamine: refused, kindly, with water */
    const refused = H.labels().some(function (x) { return /water and a sit/i.test(x); });
    H.pick('Water and a sit'); H.settle();
    const out = { refused: refused, met: !!s.flags.mb_met, fit: EM.AF.mbFit(s) };
    s.fx.ket = 0; s.fx.mdma = 100; s.drinks = 0;
    EM.scripts.af_mb_gate(); H.settle(); const L = H.labels();
    out.water = L.some(function (x) { return /water first/i.test(x); });
    H.pick('Water first'); H.settle(); H.pick('Go in'); H.settle();
    out.flag = !!s.flags.mb_water; out.escortOff = !s.flags.mb_escort;
    return out;
  });
  await page.waitForTimeout(1200);
  const r6c = await page.evaluate(function () { return { z: EM.state.zone, visit: !!EM.state.flags.mb_visit }; });
  ok(r6b.refused && r6b.met && !r6b.fit, 'too high (ketamine): the room refuses, kindly, and offers water; nothing is lost');
  ok(r6b.water && r6b.flag && r6b.escortOff && r6c.z === 'a_master', 'rolling on MDMA: "water first?" is offered and rewarded; the room opens (zone=' + r6c.z + ')');
  const r6d = await page.evaluate(function () {
    const s = EM.state; s.fx.mdma = 0; s.fx.ket = 0; s.stats.hp = 90; s.stats.fun = 60; s.stats.soc = 60;
    /* a full encounter with the verbal check: win pays like the dark room */
    const o = { };
    const rnd0 = Math.random; Math.random = function () { return 0; };
    EM.logic.makeoutChance = function () { return 1; };
    EM.ui.startDialogue('af_enc_pax', {}); H.pick('Walk over'); H.settle(); H.pick('Hold the look'); H.settle(); H.pick('Stay'); H.settle();
    const w0 = s.stats.weird, soc0 = s.stats.soc; H.pick('Is this okay'); H.settle();
    o.done = !!s.flags.pax_done; o.aftercare = !!s.flags.mb_aftercare; o.noise = s.after.noise; o.dsoc = s.stats.soc - soc0;
    /* a no costs nothing beyond itself */
    EM.ui.startDialogue('af_enc_nell', {}); H.pick('Walk over'); H.settle(); H.pick('Hold the look'); H.settle(); H.pick('Stay'); H.settle(); H.pick('Stop. Thank'); H.settle();
    o.stopped = !!s.flags.nell_done && !s.flags.mb_fail && !s.hostStrikes;
    /* someone too high: water first earns a reward, pushing earns a strike */
    EM.ui.startDialogue('af_enc_river', {}); const first = EM.ui.D.nid; H.settle();
    o.them = H.labels().some(function (x) { return /water first/i.test(x); });
    H.pick('water first'); H.settle(); o.riverWater = !!s.flags.river_water && !s.hostStrikes;
    s.flagAt.river_water = s.time; EM.ui.startDialogue('af_enc_river', {}); H.settle(); o.stillHigh = H.labels().some(function (x) { return /water first/i.test(x); });
    H.pick('Leave them be'); H.settle();
    s.time += 70; EM.ui.startDialogue('af_enc_river', {}); H.settle(); o.later = H.labels().some(function (x) { return /Walk over/i.test(x); });
    H.pick('Not this one'); H.settle();
    Math.random = rnd0;
    return o;
  });
  ok(r6d.done && r6d.aftercare && r6d.noise > 6 && r6d.dsoc >= 12, 'a consented encounter (asked out loud) pays like the dark room and the walls hear it (noise +' + Math.round(r6d.noise) + ')');
  ok(r6d.stopped, 'stopping at any step is free of penalty');
  ok(r6d.them && r6d.riverWater && r6d.stillHigh && r6d.later, 'River, too high: water first is rewarded; an hour later they can say yes');
  const r6e = await page.evaluate(function () {
    const s = EM.state; s.after.f.river = { st: 'x' };
    delete s.flagAt.river_water; s.flags.river_water = false; s.hostStrikes = 0;
    EM.ui.startDialogue('af_enc_river', {}); H.settle(); const w0 = s.stats.weird; H.pick('Lean in anyway'); H.settle();
    const first = { strikes: s.hostStrikes, dw: s.stats.weird - w0, ended: s.ended || null };
    delete s.flags.river_done; EM.ui.startDialogue('af_enc_river', {}); H.settle(); H.pick('Lean in anyway'); H.settle();
    return { first: first, strikes2: s.hostStrikes };
  });
  await page.waitForTimeout(700);
  r6e.second = await page.evaluate(function () { const s = EM.state; return { strikes: s.hostStrikes, ended: s.ended || null, out: !!s.flags.after_out }; });
  ok(r6e.first.strikes === 1 && r6e.first.dw >= 25 && !r6e.first.ended, 'pushing someone too high: a host strike (weirdness +' + Math.round(r6e.first.dw) + ')');
  ok(r6e.second.ended === 'after' && r6e.second.out, 'the next rude move in a host\'s home: OUT (ending after)');
  await page.evaluate(function () { H.settle(); H.pick('Apologise and go'); H.settle(); });
  await page.waitForTimeout(900);
  const sub = await page.evaluate(function () { return { t: document.getElementById('e-title') && document.getElementById('e-title').textContent, p: (document.getElementById('e-text') || {}).textContent }; });
  ok(/SOCKS|CALCETINES|MEIA/i.test(sub.t) && /home was not yours|no era tuya|não era sua|Their home/i.test(sub.p), 'the OUT ending reads as a host closing the door, not a game over ' + JSON.stringify(sub).slice(0, 300));

  /* ------------------------------------------------ 7. the phone: text a friend who went home; the noon thread and Tuesday */
  await page.evaluate(function () {
    const player = { name: 'TEST', gender: 'x', look: Object.assign({}, EM.CHAR.random()) };
    EM.ui.startNight(player, { venue: 'club' });
  });
  await page.waitForTimeout(700);
  const r7 = await page.evaluate(function () {
    EM.ui.D = null; EM.ui.mode = 'play'; EM.engine.paused = false; document.getElementById('dialog').hidden = true;
    const s = EM.state; s.time = 540; s.party = ['maru', 'dani', 'tato']; s.flags.after_go = true; EM.scripts.af_begin(); EM.ui.D = null; EM.ui.mode = 'play'; document.getElementById('dialog').hidden = true;
    EM.engine.enter('a_living', 13, 13, 'u');
    s.flags.af_rules = true; s.flags.sam_ok = true; s.flags.rey_ok = true; s.flags.af_clean = true; s.flags.brought_food = true;
    s.after.at.question = 0; s.after.at.tato = 0; s.after.at.dani = 9999;
    EM.logic.minute(); EM.logic.minute(); EM.logic.minute();
    const out = { tato: s.after.f.tato.st, tatoAsleep: !!s.flags.tato_asleep, away: s.away.tato, q7: s.quests.q_af7, d: EM.ui.D && EM.ui.D.id };
    H.settle(); H.pick('Walk Maru home yourself'); H.settle(); H.pick('Let him sleep'); H.settle();
    out.maru = s.after.f.maru.st + '/' + s.after.f.maru.mode; out.q7done = s.quests.q_af7; out.tatoStays = !!s.flags.tato_stays;
    return out;
  });
  ok(r7.tato === 'sofa' && r7.tatoAsleep && r7.d === 'af_question' && r7.maru === 'home/buddy' && r7.q7done === 'done' && r7.tatoStays, 'THE QUESTION: Maru fading, Fernando asleep on the sofa, you choose who walks whom (' + JSON.stringify(r7) + ')');
  const r7b = await page.evaluate(function () {
    const s = EM.state; s.after.f.dani = { st: 'home', mode: 'alone' }; EM.logic.leave && EM.logic.leave('dani', 'home');
    EM.ui.openMenu('items'); const btns = Array.prototype.slice.call(document.querySelectorAll('#menu-body button')).map(function (b) { return b.textContent; });
    const textBtn = Array.prototype.slice.call(document.querySelectorAll('#menu-body button')).filter(function (b) { return /^TEXT$/i.test(b.textContent); });
    const n = textBtn.length; textBtn[0] && textBtn[0].click(); const d = EM.ui.D && EM.ui.D.id;
    H.settle(); H.pick('heart'); H.settle();
    return { btns: btns, n: n, d: d, texted: Object.keys(s.after.texted) };
  });
  ok(r7b.n >= 2 && /^af_text_/.test(r7b.d) && r7b.texted.length === 1, 'friends who went home can be texted from the ITEMS menu (' + r7b.n + ' rows, dialogue ' + r7b.d + ')');
  const r7c = await page.evaluate(function () {
    const s = EM.state; s.flags.quiroga_warned = true; s.flags.dani_toast = true; s.flags.lio_ok = true; s.time = 839; EM.logic.minute();
    return { ended: s.ended || null };
  });
  await page.waitForTimeout(1200);
  const r7d = await page.evaluate(function () {
    const lead = EM.ui.D && EM.ui.D.id; H.settle(); if (EM.ui.D) { H.pick('shoes on'); H.settle(); }
    return { lead: lead };
  });
  await page.waitForTimeout(900);
  const r7e = await page.evaluate(function () {
    const s = EM.state, th = EM.story.morning(s);
    return { ended: s.ended, title: document.getElementById('e-title').textContent, thread: th.map(function (m) { return m.who + '@' + m.time; }), tue: th.filter(function (m) { return /TUE/.test(m.time); }).length, noon: th[0] && EM.tr(th[0].t) };
  });
  ok(r7c.ended === 'after' && r7d.lead === 'af_noon' && /SOCKS/.test(r7e.title), 'noon (840): the new ending, with its own quiet noon scene first');
  ok(r7e.tue >= 2 && r7e.thread[0].indexOf('dot@12:') === 0 && /drawer/i.test(r7e.noon), 'the thread runs through noon and on to Tuesday: ' + r7e.thread.join(', '));

  /* ------------------------------------------------ 8. going home: the old ending stays, friends who hit the after text you */
  const r8 = await page.evaluate(function () {
    const player = { name: 'TEST', gender: 'x', look: Object.assign({}, EM.CHAR.random()) };
    EM.ui.startNight(player, { venue: 'club', seed: 424242 }); return 1;
  });
  await page.waitForTimeout(700);
  const r8b = await page.evaluate(function () {
    EM.ui.D = null; EM.ui.mode = 'play'; EM.engine.paused = false; document.getElementById('dialog').hidden = true;
    const s = EM.state; s.time = 515; s.party = ['maru']; s.flags.roof_open = true; s.quests.q9 = 'active';
    EM.scripts.sunrise(); H.settle(); EM.ui.startDialogue('afters_invite', { npc: 'af_inviter' }); H.pick('going home'); H.settle(); /* THE AFTERS mission: home ends the night */
    return { home: !!s.flags.after_home, go: !!s.flags.after_go };
  });
  await page.waitForTimeout(900);
  const r8c = await page.evaluate(function () {
    const s = EM.state, p = s.afterPlan, th = EM.story.morning(s);
    return { ended: s.ended, plan: p && Object.keys(p.f).map(function (f) { return f + ':' + p.f[f].hit; }), who: th.map(function (m) { return m.who; }) };
  });
  ok(r8b.home && !r8b.go && /^(legend|wrecked|romance|together|missing)$/.test(r8c.ended || ''), 'going home runs the existing ending untouched (' + r8c.ended + ')');
  ok(r8c.who.indexOf('dot') !== -1 || r8c.plan.length === 3, 'home thread: Dot answers, and friends who hit the after may text you (' + r8c.plan.join(' ') + ')');

  /* ------------------------------------------------ 9. EN / ES / PT parity of every new string */
  const r9 = await page.evaluate(function () {
    const s = EM.state, bad = []; let n = 0;
    s.after = s.after || { noise: 0, vol: 1, st: 0, cameos: [], f: {}, texted: {}, at: {} };
    const seen = new Set();
    function chk(v, where) {
      if (v && typeof v === 'object' && !Array.isArray(v) && 'en' in v && 'es' in v) {
        n++;
        ['en', 'es', 'pt'].forEach(function (l) { if (!v[l] || typeof v[l] !== 'string') bad.push(where + ' ' + l + ' empty'); });
        if (v.en && v.en.length > 14 && v.en === v.es && v.es === v.pt && !/^[A-ZÆ0-9 .'\-,!?:«»"]+$/.test(v.en)) bad.push(where + ' identical in all three: ' + v.en.slice(0, 40));
        if (/\.\.\./.test(v.en + v.es + v.pt)) bad.push(where + ' has three dots');
        if (/\b(vos|tenés|querés|andá|mirá)\b/i.test(v.es)) bad.push(where + ' voseo');
        return;
      }
      if (Array.isArray(v)) v.forEach(function (x) { chk(x, where); });
    }
    Object.keys(EM.DIALOGUES).filter(function (k) { return /^af_/.test(k); }).forEach(function (id) {
      const d = EM.DIALOGUES[id];
      Object.keys(d.nodes).forEach(function (nid) {
        const nd = d.nodes[nid];
        let tx = nd.text; if (typeof tx === 'function') { try { tx = tx(s); } catch (e) { bad.push(id + '.' + nid + ' text throws ' + e.message); tx = null; } }
        chk(tx, id + '.' + nid);
        (nd.choices || []).forEach(function (c) { chk(c.t, id + '.' + nid + ' choice'); chk(c.react, id + '.' + nid + ' react'); });
      });
      chk(d.role, id + ' role');
    });
    Object.keys(EM.QUESTS).filter(function (k) { return /^q_af/.test(k); }).forEach(function (q) { const Q = EM.QUESTS[q]; chk(Q.title, q); chk(typeof Q.desc === 'function' ? Q.desc(s) : Q.desc, q + '.desc'); chk(Q.doneText, q + '.done'); });
    Object.keys(EM.ENDINGS.after).forEach(function (k) { if (k === 'text') EM.ENDINGS.after.text.forEach(function (p, i) { chk(typeof p === 'function' ? p(s) : p, 'ending ' + i); }); });
    return { n: n, bad: bad.slice(0, 12), dlgs: Object.keys(EM.DIALOGUES).filter(function (k) { return /^af_/.test(k); }).length };
  });
  ok(r9.bad.length === 0, 'trilingual scan: ' + r9.n + ' strings in ' + r9.dlgs + ' new dialogues are in EN, ES and PT, no voseo, no "..." ' + (r9.bad.length ? JSON.stringify(r9.bad) : ''));

  /* ------------------------------------------------ 10. random walks through every after dialogue: no exceptions, no dead ends */
  const r10 = await page.evaluate(function () {
    const s = EM.state, bad = [], ids = Object.keys(EM.DIALOGUES).filter(function (k) { return /^af_/.test(k) && k !== 'af_travel'; });
    let walks = 0;
    ids.forEach(function (id) {
      for (let r = 0; r < 12; r++) {
        try {
          EM.ui.D = null; EM.ui.mode = 'play'; EM.ended = null; s.ended = null;
          s.stats.hp = 90; s.stats.soc = 60; s.stats.fun = 60; s.stats.weird = 5; /* keep the walker out of the DIZZY mis-speak loop */
          EM.ui.startDialogue(id, {});
          let steps = 0; const tr = [];
          while (EM.ui.D && steps++ < 40) {
            const st = EM.ui.D.state; tr.push(EM.ui.D.nid + '/' + st);
            if (st === 'text' || st === 'react') EM.ui.dlgConfirm();
            else if (st === 'choices') { const n = EM.ui.D.choices.length; if (!n) { bad.push(id + ': empty choices'); break; } EM.ui.dlgPick(Math.floor(Math.random() * n)); }
            else break;
          }
          if (EM.ui.D && steps >= 40) bad.push(id + ': did not end in 40 steps: ' + tr.slice(0, 10).join(' '));
          walks++;
        } catch (e) { bad.push(id + ': ' + e.message); }
        s.ended = null;
      }
    });
    EM.ui.D = null; EM.ui.mode = 'play';
    return { bad: bad.slice(0, 8), walks: walks, n: ids.length };
  });
  ok(r10.bad.length === 0, 'random walks: ' + r10.walks + ' playthroughs of ' + r10.n + ' after dialogues, no exceptions or dead ends ' + (r10.bad.length ? JSON.stringify(r10.bad) : ''));

  ok(errors.length === 0, 'no page errors' + (errors.length ? ': ' + errors.slice(0, 4).join(' | ') : ''));
  await browser.close(); server.close();
  console.log('\n' + passes + ' passed, ' + fails + ' failed');
  process.exit(fails ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });

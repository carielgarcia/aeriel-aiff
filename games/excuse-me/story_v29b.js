/* EXCUSE ME — story v29, part 2: shared scripts for THE AFTER (travel, noise, host rule, friends going home) and the later hooks that close missions
   by themselves. The dialogues themselves live in story_v31.js, story_v31b.js, story_v32.js and story_v32b.js (guests, hosts, neighbours,
   the three friends) and story_v29c.js (the master bedroom, the phone and the morning). */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui;
  const D = EM.DIALOGUES, S = EM.scripts, AF = EM.AF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const FR = ['maru', 'dani', 'tato'];
  const nm = function (f) { return EM.CAST[f].name; };
  const withF = function (f) { return function (s) { return L.hasFriend(f); }; };
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };

  /* ----- small scripts the dialogues call ----- */
  S.af_arrive = function () { EM.hooks.travel({ zone: 'a_living', x: 13, y: 13, dir: 'u' }); };
  S.af_rules = function () { U.startDialogue('af_rules', { npc: 'dot' }); };
  S.af_front = function () { U.startDialogue('af_front', {}); };
  S.af_set0 = function () { AF.vol(0); }; S.af_set1 = function () { AF.vol(1); }; S.af_set2 = function () { AF.vol(2); };
  S.af_vol0 = function () { AF.vol(0); AF.noise(-30); };
  S.af_dn15 = function () { AF.noise(-15); }; S.af_dn25 = function () { AF.noise(-25); }; S.af_dn30 = function () { AF.noise(-30); }; S.af_dn35 = function () { AF.noise(-35); };
  S.af_up8 = function () { AF.noise(10); };
  S.af_quiroga_down = function () { const s = EM.state; s.after.st = 3; s.after.vol = 0; AF.setNoise(s.after.noise * 0.1); };
  S.af_end_after = function () { setTimeout(function () { if (!EM.state.ended) L.end('after'); }, 200); };
  S.af_ask_rec = function () { U.startDialogue('af_anselm', { npc: 'anselm' }); };
  /* a pinch from Pasc's bag: MDMA stays the most fun; on a first dose still working it is a redose (story_v28.js) */
  S.af_bag_yes = function () {
    const s = EM.state, again = !!(s.fx.mdma > 0);
    L.startFx('mdma');
    s.flags.took_after = true;
    if (again) { s.flags.redosed = true; L.apply({ hp: -6, fun: 2 }); L.startFx('hot', 60); U.toast({ icon: 'skull', kind: 'bad', ms: 6500, text: t(`That is a second dose on a first that is still working. Your jaw locks and your temperature climbs. Water, air, a long sit.`, `Es una segunda dosis encima de una primera que sigue funcionando. Se te traba la mandíbula y sube la temperatura. Agua, aire, un rato sentado.`, `É uma segunda dose em cima de uma primeira que ainda tá funcionando. Sua mandíbula trava e a temperatura sobe. Água, ar, um bom tempo sentado.`) }); }
  };
  S.af_one_friends = function () {
    const s = EM.state;
    FR.forEach(function (f) {
      if (!L.hasFriend(f)) return;
      if ((s.bond[f] || 0) >= 2) { s.flags['one_back_' + f] = true; s.bond[f] += 1; }
      else s.flags['one_took_' + f] = true;
    });
  };
  S.af_maru_walk = function () { AF.sendHome('maru', 'buddy'); AF.noise(6); };
  S.af_maru_taxi = function () { AF.sendHome('maru', 'buddy'); };
  S.af_maru_dani = function () { AF.sendHome('maru', 'buddy'); AF.sendHome('dani', 'buddy'); };
  S.af_maru_alone = function () { AF.sendHome('maru', 'alone'); EM.state.flags.promised_text = true; };
  S.af_tato_home = function () { AF.sendHome('tato', 'buddy'); };
  S.af_tato_dani = function () { AF.sendHome('tato', 'buddy'); AF.sendHome('dani', 'buddy'); };

  /* ============================================================ the later hooks: buddies, the lone sleeper, the missions that close by themselves */
  const sch0 = AF.schedule;
  AF.schedule = function (s) {
    sch0(s);
    if (!s.after) return;
    const f = s.flags, now = s.time, at = s.flagAt || {};
    if (s.quests.q_af3 === 'active' && ['sam_ok', 'rey_ok', 'vik_ok'].filter(function (k) { return f[k]; }).length >= 2) {
      L.setQuest('q_af3', 'done'); U.toast({ icon: 'heart', kind: 'good', ms: 5200, text: t(`The kitchen is looked after. Dot nods at you over the eggs.`, `La cocina está atendida. Dot te asiente por encima de los huevos.`, `A cozinha tá cuidada. A Dot assente pra você por cima dos ovos.`) });
    }
    if (f.rey_buddy && !f.rey_checked && now >= (at.rey_buddy || now) + 60) { f.rey_checked = true; L.apply({ soc: 3, fun: 2 }); U.toast({ icon: 'heart', kind: 'good', ms: 5600, text: t(`An hour is up. You look in on Rey: cool, calm, eating toast. "You came back," they say. It counts for something.`, `Pasó la hora. Pasas a ver a Rey: fresco, tranquilo, comiendo tostadas. «Volviste», dicen. Eso cuenta.`, `Passou uma hora. Você vai ver o Rey: fresco, calmo, comendo torrada. «Você voltou», diz. Isso conta.`) }); }
    if (f.lio_alone && !f.lio_found && now >= (at.lio_alone || now) + 25) { f.lio_found = true; L.apply({ soc: -4 }); U.toast({ icon: 'cross', kind: 'bad', ms: 6500, text: t(`Mo found Lio and sat with them. Lio is okay. You could have been the one.`, `Mo encontró a Lio y se sentó con ellos. Lio está bien. Pudiste haber sido tú.`, `A Mo achou o Lio e sentou junto. O Lio tá bem. Podia ter sido você.`) }); }
    if (s.quests.q_af6 === 'active' && f.marcos_ok && f.beto_ok) L.setQuest('q_af6', 'done');
    if (!s.quests.q_af6 && s.after.st >= 1) L.setQuest('q_af6', 'active');
  };
})();

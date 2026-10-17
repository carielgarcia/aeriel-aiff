/* EXCUSE ME — game rules: the four bars, status effects, time, party, effects engine.
   No DOM in here; the UI listens through EM.hooks. */
'use strict';
(function () {
  const EM = window.EM;
  const clamp = EM.clamp;
  const T = EM.T;

  EM.hooks = { toast: function () {}, stat: function () {}, ending: function () {}, script: function () {}, sfx: function () {}, dialog: function () {}, travel: function () {} };
  EM.scripts = {};

  /* night phases by minutes since 22:00 */
  EM.phaseOf = function (t) { return t < 150 ? 'warm' : (t < 300 ? 'techno' : (t < 450 ? 'hard' : 'closing')); };
  EM.crowdFactor = function (t) { return t < 120 ? 0.5 : (t < 300 ? 0.85 : (t < 450 ? 1.0 : 0.7)); };
  EM.clockStr = function (t) {
    const m = (22 * 60 + Math.floor(t)) % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };

  const DUR = { mdma: 240, meth: 270, glitch: 150, bump: 50, comedown: 140, comedown2: 200 };
  EM.FXNAME = {
    mdma: T('ROLLING', 'ROLANDO', 'ROLANDO'), meth: T('WIRED', 'ACELERADO', 'ACELERADO'),
    glitch: T('BAD SIGNAL', 'SEÑAL MALA', 'SINAL RUIM'), bump: T('NUMB', 'ANESTESIADO', 'ANESTESIADO'),
    comedown: T('COMEDOWN', 'BAJÓN', 'BAIXÃO'), comedown2: T('HARD CRASH', 'BAJÓN FUERTE', 'BAIXÃO FORTE'),
    drunk: T('DRUNK', 'BORRACHO', 'BÊBADO'), thirsty: T('THIRSTY', 'SEDIENTO', 'COM SEDE')
  };

  const L = EM.logic = {};

  L.high = function () {
    const s = EM.state; let h = 0;
    if (s.fx.mdma) h += 2; if (s.fx.meth) h += 3; if (s.fx.glitch) h += 2; if (s.fx.bump) h += 2;
    if (s.drinks >= 3) h += 2; else if (s.drinks >= 1) h += 1;
    return Math.min(3, h);
  };
  L.isDrunk = function () { return EM.state.drinks >= 3; };

  L.socMult = function () {
    const s = EM.state; let m = 1;
    if (s.fx.mdma) m *= 0.5; if (s.fx.meth) m *= 1.6; if (s.fx.glitch) m *= 2; if (s.fx.bump) m *= 0.6; if (s.drinks >= 2) m *= 0.85;
    if (s.fx.comedown || s.fx.comedown2) m *= 1.3;
    return m;
  };
  L.weirdMult = function () {
    const s = EM.state; let m = 1;
    if (s.fx.meth) m *= 1.5; if (s.drinks >= 3) m *= 1.25; if (s.fx.glitch) m *= 1.3;
    return m;
  };
  L.speedMult = function () {
    const s = EM.state; let m = 1;
    if (s.fx.meth) m *= 1.2; if (s.fx.bump) m *= 0.7;
    if (s.stats.hp < 25) m *= 0.85;
    return m;
  };

  /* ------------------------------------------------------------ bars */
  L.stat = function (name, d) {
    const s = EM.state;
    if (!d) return;
    if (name === 'soc' && d < 0) d = -(-d * L.socMult());
    if (name === 'weird' && d > 0) d = d * L.weirdMult();
    const before = s.stats[name];
    s.stats[name] = clamp(before + d, 0, 100);
    EM.hooks.stat(name, s.stats[name] - before);
  };

  /* ------------------------------------------------------------ fx */
  L.startFx = function (name, dur) {
    const s = EM.state;
    s.fx[name] = dur || DUR[name] || 120;
    EM.hooks.toast({ icon: 'spark', text: T('STATUS: ' + EM.FXNAME[name].en, 'ESTADO: ' + EM.FXNAME[name].es, 'ESTADO: ' + EM.FXNAME[name].pt), kind: 'info' });
  };

  /* ------------------------------------------------------------ time */
  L.addTime = function (min) {
    const n = Math.max(0, Math.floor(min));
    for (let i = 0; i < n; i++) { L.minute(); if (EM.state.ended) break; }
  };
  L.clockFloor = function (t) {
    const s = EM.state;
    if (s.time < t) L.addTime(t - s.time);
  };

  L.minute = function () {
    const s = EM.state, z = EM.zones[s.zone];
    if (s.ended) return;
    s.time += 1;
    const st = s.stats;
    s.thirst += 1;
    L.stat('fun', -0.1);
    if (s.thirst > 120) L.stat('hp', -0.08);
    if (!s.fx.mdma && !s.fx.meth && !s.fx.glitch && !s.fx.bump && s.drinks < 2) L.stat('weird', -0.04);
    s.drinks = Math.max(0, s.drinks - 1 / 40);
    if (s.fx.mdma) { L.stat('fun', 0.22); L.stat('hp', -0.05); L.stat('weird', 0.03); L.stat('soc', 0.04); }
    if (s.fx.meth) { L.stat('fun', 0.15); L.stat('hp', -0.1); L.stat('weird', 0.07); L.stat('soc', -0.03); }
    if (s.fx.glitch) { L.stat('weird', 0.05); L.stat('hp', -0.03); }
    if (s.fx.bump) { L.stat('fun', 0.25); L.stat('weird', 0.08); }
    if (s.fx.comedown) { L.stat('fun', -0.16); L.stat('soc', -0.08); L.stat('hp', -0.04); }
    if (s.fx.comedown2) { L.stat('fun', -0.25); L.stat('soc', -0.12); L.stat('hp', -0.08); }
    if (s.drinks >= 3) L.stat('hp', -0.03);
    if (z && z.quiet) { L.stat('soc', z.quiet); if (!s.fx.meth) L.stat('hp', z.quiet * 0.5); }
    Object.keys(s.fx).forEach(function (k) {
      s.fx[k] -= 1;
      if (s.fx[k] <= 0) {
        delete s.fx[k];
        if (k === 'mdma') { L.startFx('comedown'); EM.hooks.toast({ text: T('The glow is leaving. It leaves a bruise.', 'El brillo se va. Deja un moretón.', 'O brilho está indo embora. Deixa um roxo.'), kind: 'bad' }); }
        else if (k === 'meth') { L.startFx('comedown2'); EM.hooks.toast({ text: T('The wire snaps. Everything weighs more.', 'Se corta el cable. Todo pesa más.', 'O fio arrebenta. Tudo pesa mais.'), kind: 'bad' }); }
      }
    });
    if (st.fun <= 0.01) s.boredFor = (s.boredFor || 0) + 1; else s.boredFor = 0;
    if (s.pendingFaint && s.time >= s.pendingFaint) { s.pendingFaint = 0; L.passOut(T('The edges of the room come loose. Your knees file their resignation.', 'Los bordes del cuarto se sueltan. Tus rodillas presentan su renuncia.', 'As bordas da sala se soltam. Seus joelhos entregam a demissão.'), { fake: true }); return; }
    if (s.time >= 450 && !s.flags.roof_open) { s.flags.roof_open = true; if (!s.quests.q9) L.setQuest('q9', 'active'); EM.hooks.toast({ icon: 'star', text: T('THE ROOF IS OPEN. The closing set is about to start.', 'EL TECHO ESTÁ ABIERTO. El set de cierre está por empezar.', 'O TERRAÇO ESTÁ ABERTO. O set de encerramento vai começar.'), kind: 'good', ms: 6000 }); }
    if (s.thirst === 121) EM.hooks.toast({ text: T('Your mouth is a desert. Find water.', 'Tienes la boca seca como un desierto. Busca agua.', 'Sua boca é um deserto. Procure água.'), kind: 'bad' });
    L.check();
  };

  /* ------------------------------------------------------------ endings checks */
  L.check = function () {
    const s = EM.state, st = s.stats;
    if (s.ended) return;
    if (st.soc <= 20 && !s.flags.warn_soc) { s.flags.warn_soc = true; EM.hooks.toast({ icon: 'zzz', text: T('Your SOCIAL BATTERY is nearly empty. Find a quiet bench, the quiet room, or a stranger who asks nothing of you.', 'Tu BATERÍA SOCIAL casi se vacía. Busca un banco tranquilo, la sala tranquila o alguien que no te pida nada.', 'Sua BATERIA SOCIAL está quase vazia. Procure um banco calmo, a sala de calma ou alguém que não peça nada.'), kind: 'bad', ms: 6500 }); }
    if (st.soc > 45) delete s.flags.warn_soc;
    if (st.hp <= 25 && !s.flags.warn_hp) { s.flags.warn_hp = true; EM.hooks.toast({ icon: 'cross', text: T('Your HEALTH is low. Water, a seat, the quiet room.', 'Tu SALUD está baja. Agua, un asiento, la sala tranquila.', 'Sua SAÚDE está baixa. Água, um lugar pra sentar, a sala de calma.'), kind: 'bad', ms: 6000 }); }
    if (st.hp > 50) delete s.flags.warn_hp;
    if (st.fun <= 12 && !s.flags.warn_fun) { s.flags.warn_fun = true; EM.hooks.toast({ icon: 'note', text: T('Your FUN is running out. Find a glowing mark on the floor and dance.', 'Tu DIVERSIÓN se agota. Busca una marca brillante en el piso y baila.', 'Sua DIVERSÃO está acabando. Procure uma marca brilhante no chão e dance.'), kind: 'bad', ms: 6000 }); }
    if (st.fun > 35) delete s.flags.warn_fun;
    if (st.weird >= 70 && !s.flags.sec_watch) { s.flags.sec_watch = true; EM.hooks.toast({ icon: 'eyes', text: T('SECURITY HAS NOTICED YOU.', 'SEGURIDAD TE ESTÁ MIRANDO.', 'A SEGURANÇA ESTÁ DE OLHO EM VOCÊ.'), kind: 'bad' }); EM.hooks.sfx('warn'); }
    if (st.weird >= 88 && !s.flags.sec_warned) { s.flags.sec_warned = true; EM.hooks.script('last_warning'); }
    if (st.weird >= 100) { L.end('banned'); return; }
    if (st.hp <= 0) { L.passOut(T('Your body files a complaint.', 'Tu cuerpo presenta una queja.', 'Seu corpo registra uma reclamação.')); return; }
    if (st.soc <= 0) { L.end('burnout'); return; }
    if ((s.boredFor || 0) >= 45) { L.end('bored'); return; }
    if (s.time >= 600) { L.end('closing'); return; }
  };

  L.end = function (id) {
    const s = EM.state;
    if (s.ended) return;
    s.ended = id;
    EM.hooks.ending(id);
  };

  L.passOut = function (why, opts) {
    const s = EM.state;
    if (s.ended) return;
    s.passouts++;
    if (s.passouts >= 2) { L.end('ambulance'); return; }
    EM.hooks.script('passout', { why: why, opts: opts || {} });
  };

  /* ------------------------------------------------------------ party */
  L.join = function (id) {
    const s = EM.state;
    if (s.party.indexOf(id) === -1) s.party.push(id);
    delete s.away[id];
  };
  L.leave = function (id, zone) {
    const s = EM.state;
    s.party = s.party.filter(function (x) { return x !== id; });
    s.away[id] = zone;
  };
  L.hasFriend = function (id) { return EM.state.party.indexOf(id) !== -1; };

  /* ------------------------------------------------------------ requirements */
  L.req = function (r) {
    if (!r) return true;
    const s = EM.state;
    if (typeof r === 'function') return !!r(s);
    if (r.flag && !s.flags[r.flag]) return false;
    if (r.flags && !r.flags.every(function (f) { return s.flags[f]; })) return false;
    if (r.no && s.flags[r.no]) return false;
    if (r.nos && r.nos.some(function (f) { return s.flags[f]; })) return false;
    if (r.any && !r.any.some(function (f) { return s.flags[f]; })) return false;
    if (r.min) for (const k in r.min) if (s.stats[k] < r.min[k]) return false;
    if (r.max) for (const k in r.max) if (s.stats[k] > r.max[k]) return false;
    if (r.fx && !s.fx[r.fx]) return false;
    if (r.anyfx && !r.anyfx.some(function (f) { return s.fx[f]; })) return false;
    if (r.nofx && s.fx[r.nofx]) return false;
    if (r.item && !(s.items[r.item] > 0)) return false;
    if (r.with && !L.hasFriend(r.with)) return false;
    if (r.without && L.hasFriend(r.without)) return false;
    if (r.high !== undefined && L.high() < r.high) return false;
    if (r.maxHigh !== undefined && L.high() > r.maxHigh) return false;
    if (r.drunk && !L.isDrunk()) return false;
    if (r.sober && L.high() > 0) return false;
    if (r.quest) for (const k in r.quest) { const v = s.quests[k] || 'none'; if (Array.isArray(r.quest[k]) ? r.quest[k].indexOf(v) === -1 : v !== r.quest[k]) return false; }
    if (r.time && (s.time < r.time[0] || s.time > r.time[1])) return false;
    if (r.gender && s.player.gender !== r.gender) return false;
    if (r.pill && s.pill.type !== r.pill) return false;
    if (r.minCare !== undefined && (s.care || 0) < r.minCare) return false;
    if (r.bondMin) for (const k in r.bondMin) if ((s.bond[k] || 0) < r.bondMin[k]) return false;
    return true;
  };

  /* ------------------------------------------------------------ effects */
  L.apply = function (e, ctx) {
    if (!e) return;
    const s = EM.state;
    if (e.fun) L.stat('fun', e.fun);
    if (e.soc) L.stat('soc', e.soc);
    if (e.hp) L.stat('hp', e.hp);
    if (e.weird) L.stat('weird', e.weird);
    if (e.care) {
      s.care = (s.care || 0) + e.care;
      L.stat('soc', 3 * e.care); L.stat('weird', -5 * e.care); L.stat('fun', 2 * e.care);
      EM.hooks.sfx('care');
      EM.hooks.toast({ icon: 'heart', text: T('You looked after someone. The room notices.', 'Cuidaste a alguien. El lugar lo nota.', 'Você cuidou de alguém. O lugar percebe.'), kind: 'good' });
    }
    if (e.drink) {
      s.drinks += e.drink; L.stat('weird', 4 * e.drink); L.stat('hp', -2 * e.drink); L.stat('fun', 4 * e.drink); s.thirst += 10 * e.drink;
      EM.hooks.sfx('drink');
      if (s.drinks >= 6 && !s.flags.vomited) { s.flags.vomited = true; EM.hooks.script('vomit'); }
    }
    if (e.water) {
      s.thirst = 0; L.stat('hp', 6); EM.hooks.sfx('drink');
      EM.hooks.toast({ icon: 'water', text: T('Water. Your body says thank you.', 'Agua. Tu cuerpo te lo agradece.', 'Água. Seu corpo agradece.'), kind: 'good' });
    }
    if (e.flag) [].concat(e.flag).forEach(function (f) { s.flags[f] = true; });
    if (e.unflag) [].concat(e.unflag).forEach(function (f) { delete s.flags[f]; });
    if (e.item) for (const k in e.item) s.items[k] = clamp((s.items[k] || 0) + e.item[k], 0, 3);
    if (e.bond) for (const k in e.bond) s.bond[k] = (s.bond[k] || 0) + e.bond[k];
    if (e.fx) [].concat(e.fx).forEach(function (f) { L.startFx(f); });
    if (e.quest) for (const k in e.quest) L.setQuest(k, e.quest[k]);
    if (e.open) [].concat(e.open).forEach(function (id) { s.res[id] = true; if (EM.hooks.opened) EM.hooks.opened(id); });
    if (e.res) [].concat(e.res).forEach(function (id) { s.res[id] = true; });
    if (e.unres) [].concat(e.unres).forEach(function (id) { delete s.res[id]; });
    if (e.join) [].concat(e.join).forEach(L.join);
    if (e.leave) for (const k in e.leave) L.leave(k, e.leave[k]);
    if (e.cool) for (const k in e.cool) s.cool[k] = s.time + e.cool[k];
    if (e.time) L.addTime(e.time);
    if (e.at) L.clockFloor(e.at);
    if (e.say) EM.hooks.toast({ text: e.say, kind: e.sayKind || 'info' });
    if (e.sfx) EM.hooks.sfx(e.sfx);
    if (e.goto) EM.hooks.travel(e.goto);
    if (e.call) EM.hooks.script(e.call, ctx);
    if (e.end) L.end(e.end);
    L.check();
  };

  L.setQuest = function (id, state) {
    const s = EM.state;
    if (s.quests[id] === state) return;
    s.quests[id] = state;
    if (state === 'active') EM.hooks.toast({ icon: 'exclam', text: T('NEW OBJECTIVE', 'NUEVO OBJETIVO', 'NOVO OBJETIVO'), kind: 'info' });
    EM.hooks.questChanged && EM.hooks.questChanged(id, state);
  };
})();

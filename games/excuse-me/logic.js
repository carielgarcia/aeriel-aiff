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

  const DUR = { mdma: 240, meth: 270, glitch: 150, coke: 90, ket: 80, comedown: 140, comedown2: 200 };
  EM.FXNAME = {
    mdma: T('ROLLING', 'ROLANDO', 'ROLANDO'), meth: T('WIRED', 'ACELERADO', 'ACELERADO'),
    glitch: T('BAD SIGNAL', 'SEÑAL MALA', 'SINAL RUIM'), coke: T('SHARP', 'AFILADO', 'AFIADO'), ket: T('DRIFTING', 'A LA DERIVA', 'À DERIVA'),
    comedown: T('COMEDOWN', 'BAJÓN', 'BAIXÃO'), comedown2: T('HARD CRASH', 'BAJÓN FUERTE', 'BAIXÃO FORTE'),
    drunk: T('DRUNK', 'BORRACHO', 'BÊBADO'), thirsty: T('THIRSTY', 'SEDIENTO', 'COM SEDE')
  };

  const L = EM.logic = {};
  /* acts that count toward the night collapsing */
  const BADF = { shoved_broh: 2, fight_broh: 3, tristan_slap: 2, consent_violation: 4, rosa_angry: 2, juno_ignored: 1, newbie_creeped: 2, host_lied: 1, rosa_lied: 1 };

  L.high = function () {
    const s = EM.state; let h = 0;
    if (s.fx.mdma) h += 2; if (s.fx.meth) h += 3; if (s.fx.glitch) h += 2; if (s.fx.coke) h += 2; if (s.fx.ket) h += 3;
    if (s.drinks >= 3) h += 2; else if (s.drinks >= 1) h += 1;
    return Math.min(3, h);
  };
  /* stimulants: meth and cocaine */
  L.stimulated = function () { const f = EM.state.fx; return !!(f.meth || f.coke); };
  /* weirdness per minute from drugs. MDMA and ketamine climb fast; MDMA with a stimulant climbs less; cocaine a little. */
  L.drugWeird = function () {
    const f = EM.state.fx; let w = 0;
    if (f.mdma) w = f.meth || f.coke ? 0.07 : 0.12;
    else if (f.ket) w = 0.12;
    else if (f.meth) w = 0.07;
    else if (f.coke) w = 0.04;
    if (f.coke && (f.mdma || f.ket)) w += 0.02;
    return w * (L.rave() ? 0.4 : 1);
  };
  /* dancing on a stimulant hurts */
  L.danceCost = function (n) {
    if (L.stimulated()) {
      const mix = EM.state.fx.mdma ? 1.5 : 1;
      L.stat('hp', -(n || 2) * mix);
      return true;
    }
    return false;
  };
  L.rave = function () { return EM.state.venue === 'rave'; };
  /* club security stands in these rooms and notices strange people */
  const GUARDED = { doors: 1, foyer: 1, main: 1, courtyard: 1 };
  L.guarded = function () { const s = EM.state; return s.venue !== 'rave' && !!GUARDED[s.zone]; };
  /* buying from a dealer: free at a rave, risky at a club */
  L.dealerHeat = function () {
    const s = EM.state;
    if (L.rave()) return;
    L.stat('weird', 5);
    if (L.guarded() && Math.random() < 0.5) {
      s.flags.sec_noted = true;
      EM.hooks.toast({ icon: 'eyes', text: T('A GUARD SAW THE HAND-OFF. Nothing is said. Everything is noted.', 'UN GUARDIA VIO EL INTERCAMBIO. No dice nada. Lo anota todo.', 'UM SEGURANÇA VIU A TROCA. Ninguém diz nada. Tudo é anotado.'), kind: 'bad', ms: 6500 });
      L.stat('weird', 12); L.addBad(1);
    }
  };
  /* ------------------------------------------------------------ MAKING OUT */
  /* Always after asking. It works out (FUN up) or it does not (FUN down, and half the time WEIRDNESS up). */
  L.makeoutChance = function (base) {
    const s = EM.state; let p = base === undefined ? 0.6 : base;
    if (s.fx.mdma || s.fx.ket) p += 0.12;
    if (s.drinks >= 3) p -= 0.18; else if (s.drinks >= 1) p += 0.06;
    if (s.stats.weird >= 60) p -= 0.15;
    if (s.stats.soc < 25) p -= 0.15;
    if (s.stats.fun >= 70) p += 0.06;
    if ((s.freshUntil || 0) > s.time) p += 0.1;
    if (L.hasFriend('dani') && s.flags.dani_wingman) p += 0.1;
    return clamp(p, 0.12, 0.9);
  };
  const MO_WIN = [
    T('It works. Teeth stay where they belong, noses find the correct side, and for a minute the bass is somebody else\'s problem.', 'Funciona. Los dientes se quedan donde corresponde, las narices encuentran el lado correcto, y por un minuto el bajo es problema de otra persona.', 'Funciona. Os dentes ficam onde devem, os narizes acham o lado certo, e por um minuto o grave é problema de outra pessoa.'),
    T('A long, slow, very good kiss. When you come up for air somebody nearby actually applauds.', 'Un beso largo, lento y muy bueno. Cuando sales a respirar alguien cerca aplaude de verdad.', 'Um beijo longo, lento e muito bom. Quando você vem pegar ar, alguém por perto aplaude de verdade.'),
    T('Chemistry, plus a very good song at exactly the right moment. You both laugh into it. Ten out of ten.', 'Química, más una canción buenísima justo en el momento correcto. Los dos se ríen dentro del beso. Diez de diez.', 'Química, mais uma música ótima exatamente na hora certa. Vocês dois riem dentro do beijo. Dez de dez.'),
    T('Soft, funny, a little sweaty, entirely mutual. You walk away with the walk of someone who has been seen.', 'Suave, divertido, un poco sudado, totalmente mutuo. Te alejas con el paso de alguien que fue visto.', 'Suave, engraçado, um pouco suado, totalmente mútuo. Você sai com o andar de quem foi visto.')
  ];
  const MO_LOSE = [
    T('Glasses clash. Then teeth. Then a very long second where you both consider moving to a different country.', 'Chocan los lentes. Luego los dientes. Luego un segundo larguísimo en el que los dos piensan en mudarse de país.', 'Os óculos batem. Depois os dentes. Depois um segundo longuíssimo em que vocês dois pensam em se mudar de país.'),
    T('Mid-kiss, you both realise it is not happening. Nobody is wrong. It is simply two people with no chemistry and a lot of eye contact.', 'En pleno beso, los dos se dan cuenta de que no va a pasar. Nadie hace nada mal. Son dos personas sin química y con demasiado contacto visual.', 'No meio do beijo, vocês dois percebem que não vai rolar. Ninguém errou. São só duas pessoas sem química e com muito contato visual.'),
    T('Your timing is off by exactly one beat. They pull back, polite and amused. "…Cute. No." You nod like a person who is totally fine.', 'Tu timing se desfasa exactamente un tiempo. Se echan atrás, educados y divertidos. «…Lindo. No». Asientes como alguien que está perfectamente bien.', 'Seu timing atrasa exatamente um tempo. A pessoa recua, educada e se divertindo. «…Fofo. Não». Você assente como quem está totalmente bem.'),
    T('A sneeze. Theirs. At the worst possible moment. You are both laughing too hard to continue, and it is somehow more humiliating than a no.', 'Un estornudo. Suyo. En el peor momento posible. Los dos se ríen demasiado para seguir, y de algún modo es más humillante que un no.', 'Um espirro. Dele. Na pior hora possível. Vocês dois riem demais pra continuar, e de algum jeito isso é mais humilhante que um não.')
  ];
  const MO_WEIRD = T('And the way you laughed afterwards will be discussed in at least two bathrooms.', 'Y la forma en que te reíste después se va a comentar en al menos dos baños.', 'E o jeito como você riu depois vai ser comentado em pelo menos dois banheiros.');
  L.makeOut = function (o) {
    o = o || {};
    const s = EM.state;
    const p = L.makeoutChance(o.p);
    const ok = Math.random() < p;
    s.makeouts = (s.makeouts || 0) + 1;
    L.addTime(o.time || 6);
    if (ok) {
      s.flags.made_out = true; s.makeoutsOk = (s.makeoutsOk || 0) + 1;
      L.stat('fun', 10 + Math.floor(Math.random() * 5)); L.stat('soc', 3); L.stat('weird', -1);
      EM.hooks.sfx('care');
      EM.hooks.toast({ icon: 'heart', text: o.win || MO_WIN[Math.floor(Math.random() * MO_WIN.length)], kind: 'good', ms: 6000 });
    } else {
      s.flags.makeout_fail = true;
      L.stat('fun', -(7 + Math.floor(Math.random() * 4)));
      const weird = Math.random() < 0.5;
      if (weird) L.stat('weird', 8);
      EM.hooks.sfx('warn');
      EM.hooks.toast({ icon: 'sweat', text: o.lose || MO_LOSE[Math.floor(Math.random() * MO_LOSE.length)], kind: 'bad', ms: 6000 });
      if (weird) EM.hooks.toast({ icon: 'eyes', text: MO_WEIRD, kind: 'bad', ms: 4500 });
    }
    return ok;
  };
  L.isDrunk = function () { return EM.state.drinks >= 3; };

  L.socMult = function () {
    const s = EM.state; let m = 1;
    if (s.fx.mdma) m *= 0.5; if (s.fx.meth) m *= 1.6; if (s.fx.glitch) m *= 2; if (s.fx.ket) m *= 0.5; if (s.fx.coke) m *= 0.8; if (s.drinks >= 2) m *= 0.85;
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
    if (s.fx.meth) m *= 1.2; if (s.fx.coke) m *= 1.12; if (s.fx.ket) m *= 0.8;
    if (s.stats.hp < 25) m *= 0.85;
    return m;
  };

  /* ------------------------------------------------------------ bars */
  L.stat = function (name, d, raw) {
    const s = EM.state;
    if (!d) return;
    if (name === 'soc' && d < 0) d = -(-d * L.socMult());
    if (name === 'weird' && d > 0 && !raw) d = d * L.weirdMult();
    const before = s.stats[name];
    if (name === 'weird' && d >= 0.5) s.lastBadAt = s.time;
    s.stats[name] = clamp(before + d, 0, 100);
    EM.hooks.stat(name, s.stats[name] - before);
  };

  /* ------------------------------------------------------------ fx */
  L.startFx = function (name, dur) {
    const s = EM.state;
    s.fx[name] = dur || DUR[name] || 120;
    if (name === 'mdma' || name === 'meth' || name === 'ket' || name === 'glitch') s.impaired = true;
    if (name === 'coke') s.remembers = true;
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
    /* weirdness always accumulates; it drops very slowly, and a little faster while you behave */
    L.stat('weird', -0.03);
    if (s.time - (s.lastBadAt === undefined ? -99 : s.lastBadAt) >= 12) L.stat('weird', -0.05);
    s.drinks = Math.max(0, s.drinks - 1 / 40);
    if (L.guarded() && st.weird >= 35) {
      L.stat('weird', 0.05 + (st.weird - 35) / 65 * 0.15, true);
      if (!s.flags.guard_eye) { s.flags.guard_eye = true; EM.hooks.toast({ icon: 'eyes', text: T('A guard\'s eyes find you. Strange people get looked at. Quiet rooms are not watched.', 'Los ojos de un guardia te encuentran. A la gente rara la miran. Las salas tranquilas no están vigiladas.', 'Os olhos de um segurança te encontram. Gente estranha é observada. Salas calmas não são vigiadas.'), kind: 'bad', ms: 6500 }); }
    }
    if (s.fx.mdma) { L.stat('fun', 0.22); L.stat('hp', -0.05); L.stat('soc', 0.08); }
    if (s.fx.meth) { L.stat('fun', 0.15); L.stat('hp', -0.1); L.stat('soc', -0.03); }
    if (s.fx.glitch) { L.stat('weird', 0.05); L.stat('hp', -0.03); }
    if (s.fx.coke) { L.stat('fun', 0.12); L.stat('hp', -0.04); }
    if (s.fx.ket) { L.stat('fun', 0.18); L.stat('soc', 0.06); }
    L.stat('weird', L.drugWeird(), true);
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
    if (s.pendingFaint && s.time >= s.pendingFaint) { s.pendingFaint = 0; const kind = s.pendingFaintKind; s.pendingFaintKind = null; L.passOut(kind === 'ket' ? T('The floor offers to hold you. You accept.', 'El piso se ofrece a sostenerte. Aceptas.', 'O chão se oferece pra te segurar. Você aceita.') : T('The edges of the room come loose. Your knees file their resignation.', 'Los bordes del cuarto se sueltan. Tus rodillas presentan su renuncia.', 'As bordas da sala se soltam. Seus joelhos entregam a demissão.'), { fake: kind !== 'ket', ket: kind === 'ket' }); return; }
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
    if (st.weird >= 70 && s.venue === 'rave' && !s.flags.sec_watch) { s.flags.sec_watch = true; EM.hooks.toast({ icon: 'eyes', text: T('PEOPLE ARE STEERING AROUND YOU. There is no security here; there is only the crowd.', 'LA GENTE TE ESQUIVA. Aquí no hay seguridad; solo hay multitud.', 'AS PESSOAS ESTÃO TE EVITANDO. Aqui não tem segurança; só tem a multidão.'), kind: 'bad' }); }
    if (st.weird >= 70 && s.venue !== 'rave' && !s.flags.sec_watch) { s.flags.sec_watch = true; EM.hooks.toast({ icon: 'eyes', text: T('SECURITY HAS NOTICED YOU.', 'SEGURIDAD TE ESTÁ MIRANDO.', 'A SEGURANÇA ESTÁ DE OLHO EM VOCÊ.'), kind: 'bad' }); EM.hooks.sfx('warn'); }
    if (st.weird >= 88 && s.venue === 'rave' && !s.flags.sec_warned) { s.flags.sec_warned = true; EM.hooks.toast({ icon: 'anger', text: T('One more strange thing and the crowd closes up around you.', 'Una cosa rara más y la multitud se cierra a tu alrededor.', 'Mais uma coisa estranha e a multidão se fecha em volta de você.'), kind: 'bad', ms: 6000 }); }
    if (st.weird >= 88 && s.venue !== 'rave' && !s.flags.sec_warned) { s.flags.sec_warned = true; EM.hooks.script('last_warning'); }
    if (st.weird >= 100) { L.end(s.venue === 'rave' ? 'frozenout' : 'banned'); return; }
    if (st.hp <= 0) { L.passOut(T('Your body files a complaint.', 'Tu cuerpo presenta una queja.', 'Seu corpo registra uma reclamação.')); return; }
    if (st.soc <= 0) { L.end('burnout'); return; }
    if ((s.boredFor || 0) >= 45) { L.end('bored'); return; }
    if (s.time >= 600) { L.end('closing'); return; }
  };

  /* an accumulation of bad decisions: friends notice, then the night collapses */
  L.addBad = function (n) {
    const s = EM.state;
    if (s.ended || !n) return;
    s.bad = (s.bad || 0) + n;
    if (s.bad >= 6 && !s.flags.bad_warn) {
      s.flags.bad_warn = true;
      EM.hooks.toast({ icon: 'anger', text: T('Your friends are going quiet. You are burning goodwill faster than it comes back.', 'Tus amigos se están quedando callados. Estás gastando buena voluntad más rápido de lo que vuelve.', 'Seus amigos estão ficando calados. Você tá gastando boa vontade mais rápido do que ela volta.'), kind: 'bad', ms: 6500 });
    }
    if (s.bad >= 11 && !s.flags.fed_up) { s.flags.fed_up = true; EM.hooks.script('fed_up'); }
  };

  /* how the crowd sees you: rude acts make people less patient, kindness warms the floor */
  L.rep = function (d) {
    const s = EM.state;
    if (s.ended || !d) return;
    s.rep = clamp((s.rep || 0) + d, -4, 8);
    if (s.rep >= 3 && !s.flags.rep_bad) {
      s.flags.rep_bad = true;
      EM.hooks.toast({ icon: 'anger', text: T('Word travels on a dancefloor. People are less patient with you now.', 'Las noticias corren en una pista. La gente ya te tiene menos paciencia.', 'As notícias correm numa pista. As pessoas estão menos pacientes com você.'), kind: 'bad', ms: 6000 });
    }
    if (s.rep <= -2 && !s.flags.rep_good) {
      s.flags.rep_good = true;
      EM.hooks.toast({ icon: 'heart', text: T('The floor is warming to you. People shuffle over a little before you even ask.', 'La pista te toma cariño. La gente se corre un poco antes de que pidas.', 'A pista está te pegando carinho. As pessoas se afastam um pouco antes mesmo de você pedir.'), kind: 'good', ms: 6000 });
    }
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
    /* MDMA and ketamine make you better company: good conversation pays more */
    const open = !!(s.fx.mdma || s.fx.ket);
    if (open && ctx && ctx.dialogue) {
      if (e.soc > 0) e = Object.assign({}, e, { soc: e.soc * 1.5 });
      if (e.fun > 0) e = Object.assign({}, e, { fun: e.fun * 1.25 });
      if (e.bond) { const b = {}; for (const k in e.bond) b[k] = e.bond[k] > 0 ? Math.ceil(e.bond[k] * 1.5) : e.bond[k]; e = Object.assign({}, e, { bond: b }); }
    }
    if (L.rave() && e.weird > 0 && (e.fx || [].concat(e.flag || []).some(function (f) { return /^took_|^pill_taken$/.test(f); }))) e = Object.assign({}, e, { weird: e.weird * 0.4 });
    if (e.fun) L.stat('fun', e.fun);
    if (e.soc) L.stat('soc', e.soc);
    if (e.hp) L.stat('hp', e.hp);
    if (e.weird) L.stat('weird', e.weird);
    if (e.bad) L.addBad(e.bad);
    if (e.rep) L.rep(e.rep);
    if (e.makeout) L.makeOut(e.makeout);
    if (e.fresh) s.freshUntil = s.time + e.fresh;
    if (e.pb) for (const k in e.pb) if (L.hasFriend(k)) s.bond[k] = (s.bond[k] || 0) + e.pb[k];
    if (e.gag) [].concat(e.gag).forEach(function (k) { s.gags = s.gags || {}; s.gags[k] = (s.gags[k] || 0) + 1; });
    if (e.care) {
      s.care = (s.care || 0) + e.care;
      L.stat('soc', 3 * e.care); L.stat('weird', -5 * e.care); L.stat('fun', 2 * e.care);
      EM.hooks.sfx('care');
      EM.hooks.toast({ icon: 'heart', text: T('You looked after someone. The room notices.', 'Cuidaste a alguien. El lugar lo nota.', 'Você cuidou de alguém. O lugar percebe.'), kind: 'good' });
    }
    if (e.drink) {
      s.drinks += e.drink; s.impaired = true; L.stat('weird', 4 * e.drink); L.stat('hp', -2 * e.drink); L.stat('fun', 4 * e.drink); s.thirst += 10 * e.drink;
      EM.hooks.sfx('drink');
      if (s.drinks >= 6 && !s.flags.vomited) { s.flags.vomited = true; EM.hooks.script('vomit'); }
    }
    if (e.water) {
      s.thirst = 0; L.stat('hp', 6); EM.hooks.sfx('drink');
      EM.hooks.toast({ icon: 'water', text: T('Water. Your body says thank you.', 'Agua. Tu cuerpo te lo agradece.', 'Água. Seu corpo agradece.'), kind: 'good' });
    }
    if (e.flag) [].concat(e.flag).forEach(function (f) { if (!s.flags[f] && BADF[f]) L.addBad(BADF[f]); s.flags[f] = true; });
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

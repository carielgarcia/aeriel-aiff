/* EXCUSE ME — dancing with a person: a small set of named arrow combos, and a partner whose moves you follow.
   The partner "does" one arrow at a time inside the dialogue; you answer with the same arrow. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine, S = EM.scripts;
  const el = U.el;
  const t = function (en, es, pt) { return T(en, es, pt); };

  /* ------------------------------------------------------------ the move set */
  const MOVES = EM.MOVES = {
    shuffle: { seq: 'LRLR', name: t('THE SHUFFLE', 'EL SHUFFLE', 'O SHUFFLE') },
    spiral: { seq: 'ULDR', name: t('THE SPIRAL', 'LA ESPIRAL', 'A ESPIRAL') },
    elevator: { seq: 'UUDD', name: t('THE ELEVATOR', 'EL ASCENSOR', 'O ELEVADOR') },
    wave: { seq: 'LURD', name: t('THE WAVE', 'LA OLA', 'A ONDA') },
    drop: { seq: 'DDDU', name: t('THE DROP', 'LA CAÍDA', 'A QUEDA') },
    sway: { seq: 'LRRL', name: t('THE SWAY', 'EL BALANCEO', 'O BALANÇO') },
    apology: { seq: 'LLRD', name: t('THE APOLOGY', 'LA DISCULPA', 'O PEDIDO DE DESCULPAS') },
    bassline: { seq: 'DUDU', name: t('THE BASSLINE', 'LA LÍNEA DE BAJO', 'A LINHA DE BAIXO') }
  };
  const ARROW = { L: '←', R: '→', U: '↑', D: '↓' };

  /* each partner has a tempo (ms between arrows), favourite moves, and a way of reacting */
  const PARTNERS = {
    vera: { tempo: 640, moves: ['shuffle', 'sway', 'elevator', 'wave'], win: t(`Vera spins you out by your sleeve and back. "Seven. No — eight. Eight and a half. Don't tell the jackets."`, `Vera te hace girar de la manga y te trae de vuelta. «Siete. No — ocho. Ocho y medio. No le cuentes a las chaquetas».`, `A Vera te gira pela manga e te traz de volta. «Sete. Não — oito. Oito e meio. Não conta pras jaquetas».`), lose: t(`Vera laughs and puts a hand on your sleeve to steady you. "Sweet. Out of time, in a beautiful way."`, `Vera se ríe y te pone una mano en la manga para estabilizarte. «Dulce. Fuera de tiempo, de una forma hermosa».`, `A Vera ri e põe a mão na sua manga pra te firmar. «Fofo. Fora do tempo, de um jeito lindo».`) },
    ines: { tempo: 560, moves: ['drop', 'bassline', 'shuffle', 'sway'], win: t(`Ines lets go of an invisible tray and applauds with her whole arms. "Tip jar's open. Come back anytime."`, `Inés suelta una bandeja invisible y aplaude con los brazos enteros. «El frasco de propinas está abierto. Vuelve cuando quieras».`, `A Ines solta uma bandeja invisível e aplaude com os braços inteiros. «O pote de gorjeta tá aberto. Volta quando quiser».`), lose: t(`Ines catches you before you step on her foot. "Off-shift feet. Sacred. But you're forgiven."`, `Inés te ataja antes de que le pises el pie. «Pies fuera de turno. Sagrados. Pero estás perdonado».`, `A Ines te segura antes de você pisar no pé dela. «Pés fora do turno. Sagrados. Mas você está perdoado».`) },
    rafa: { tempo: 720, moves: ['apology', 'spiral', 'shuffle', 'wave'], win: t(`Rafa claps his hands over his mouth. "You got ALL of it. The Apology. Nobody gets all of it." He looks about eleven feet tall.`, `Rafa se tapa la boca con las manos. «Te salió TODO. La Disculpa. A nadie le sale todo». Parece medir tres metros.`, `O Rafa tapa a boca com as mãos. «Você acertou TUDO. O Pedido de Desculpas. Ninguém acerta tudo». Ele parece ter três metros de altura.`), lose: t(`Rafa stops, mortified on your behalf, and then laughs, a real one. "That's — okay. That's also valid. Step, step, turn, shrug. Again some time?"`, `Rafa se detiene, avergonzado por ti, y luego se ríe, de verdad. «Eso es — bueno. Eso también es válido. Paso, paso, giro, encogida. ¿Otra vez algún día?»`, `O Rafa para, constrangido por você, e depois ri, de verdade. «Isso é — tá. Isso também vale. Passo, passo, giro, dar de ombros. De novo algum dia?»`) },
    mina: { tempo: 580, moves: ['bassline', 'drop', 'elevator', 'spiral'], win: t(`Mina puts both palms on the nearest speaker and then on your chest. "That's in phase. We were in phase. It's rare."`, `Mina pone las dos palmas en el parlante más cercano y luego en tu pecho. «Eso está en fase. Estuvimos en fase. Es raro».`, `A Mina põe as duas palmas na caixa mais próxima e depois no seu peito. «Isso está em fase. A gente estava em fase. É raro».`), lose: t(`Mina winces kindly. "A little phase cancellation. Happens to the best of us. Want to try the bass-heavy one?"`, `Mina hace una mueca amable. «Un poquito de cancelación de fase. Le pasa a los mejores. ¿Quieres probar la de más graves?»`, `A Mina faz uma careta gentil. «Um pouquinho de cancelamento de fase. Acontece com os melhores. Quer tentar a mais grave?»`) },
    nox: { tempo: 880, moves: ['sway', 'wave', 'spiral', 'sway'], win: t(`In the dark, a slow breath of relief. "That was the best silence I've danced to. Thank you for listening to my hands."`, `En la oscuridad, una respiración lenta de alivio. «Fue el mejor silencio con el que he bailado. Gracias por escuchar mis manos».`, `No escuro, uma respiração lenta de alívio. «Foi o melhor silêncio com que já dancei. Obrigado por ouvir minhas mãos».`), lose: t(`In the dark, a soft laugh. "We lost each other a little. That's allowed. Say where you are and I'll find you."`, `En la oscuridad, una risa suave. «Nos perdimos un poquito. Está permitido. Di dónde estás y te encuentro».`, `No escuro, uma risada suave. «A gente se perdeu um pouquinho. Pode. Fala onde você está que eu te acho».`) },
    ludo: { tempo: 700, moves: ['sway', 'spiral', 'elevator', 'wave'], win: t(`Ludo dips you slightly, then very carefully lets you back up. "Good morning," he says, to the whole sky.`, `Ludo te inclina apenas un poco y con mucho cuidado te vuelve a levantar. «Buenos días», le dice al cielo entero.`, `O Ludo te inclina de leve e, com muito cuidado, te levanta de novo. «Bom dia», ele diz pro céu inteiro.`), lose: t(`Ludo hands you a croissant half and a smile. "The sun is slow too. It still shows up."`, `Ludo te da media medialuna y una sonrisa. «El sol también es lento. Igual aparece».`, `O Ludo te dá meio croissant e um sorriso. «O sol também é lento. Mesmo assim ele aparece».`) },
    maru: { tempo: 520, moves: ['elevator', 'drop', 'shuffle', 'bassline'], win: t(`Maru grabs your face with both hands. "THAT is what we came for."`, `Maru te toma la cara con las dos manos. «ESO es a lo que veníamos».`, `A Maru segura seu rosto com as duas mãos. «ISSO é o que a gente veio fazer».`), lose: t(`Maru wheezes. "Okay, that was GENUINELY chaos. Let's do it again so I can film it."`, `Maru se ahoga de risa. «Bueno, eso fue CAOS de verdad. Hagámoslo otra vez para filmarlo».`, `A Maru perde o ar de tanto rir. «Tá, isso foi CAOS de verdade. Vamos de novo pra eu filmar».`) },
    dani: { tempo: 500, moves: ['spiral', 'wave', 'bassline', 'shuffle'], win: t(`Dani throws both arms in the air. "WE'RE GOOD. WE'RE SO GOOD. I'm going to tell the DJ we're good."`, `Dani lanza los dos brazos al aire. «SOMOS BUENOS. SOMOS MUY BUENOS. Le voy a decir al DJ que somos buenos».`, `O Dani joga os dois braços pro alto. «A GENTE É BOM. A GENTE É MUITO BOM. Vou falar pro DJ que a gente é bom».`), lose: t(`Dani trips over his own foot and over yours, and the two of you collapse in a happy heap. "Nobody saw. Everybody saw. It was great."`, `Dani se tropieza con su propio pie y con el tuyo, y los dos caen en un montón feliz. «Nadie vio. Todos vieron. Estuvo genial».`, `O Dani tropeça no próprio pé e no seu, e os dois desabam num monte feliz. «Ninguém viu. Todo mundo viu. Foi ótimo».`) },
    tato: { tempo: 780, moves: ['sway', 'shuffle', 'wave', 'sway'], win: t(`Tato lets out a breath he's been holding since 22:00. "I danced. In front of people. With a person. I think I'm a person."`, `Tato suelta un aire que contenía desde las 22:00. «Bailé. Delante de gente. Con una persona. Creo que soy una persona».`, `O Tato solta um ar que vinha segurando desde as 22:00. «Eu dancei. Na frente de gente. Com uma pessoa. Acho que sou uma pessoa».`), lose: t(`Tato laughs, a small shy one. "That's fine. That's honestly my best ever. Can we do it slower next time?"`, `Tato se ríe, una risa chiquita y tímida. «Está bien. Es, la verdad, mi mejor intento. ¿Podemos hacerlo más lento la próxima?»`, `O Tato ri, uma risada pequena e tímida. «Tá bom. Foi, sinceramente, minha melhor tentativa. Dá pra fazer mais devagar da próxima?»`) },
    hugo: { tempo: 820, moves: ['shuffle', 'sway', 'apology', 'shuffle'], win: t(`Hugo whoops. "That's the shuffle! Forty years and nobody got it right on the first four tries!"`, `Hugo grita. «¡Ese es el shuffle! ¡Cuarenta años y nadie lo hizo bien en los primeros cuatro intentos!»`, `O Hugo grita. «Esse é o shuffle! Quarenta anos e ninguém acertou nas quatro primeiras tentativas!»`), lose: t(`Hugo pats your shoulder kindly. "Practice. Everything is practice. Come back in forty years."`, `Hugo te palmea el hombro con cariño. «Practica. Todo es práctica. Vuelve en cuarenta años».`, `O Hugo bate no seu ombro com carinho. «Pratique. Tudo é prática. Volta daqui a quarenta anos».`) }
  };
  EM.PARTNERS = PARTNERS;

  /* ------------------------------------------------------------ the dance, inside the dialogue panel */
  let P = null;
  const LBL = {
    you: t('YOU', 'TÚ', 'VOCÊ'), hint: t('Copy their arrows. [X] bow out.', 'Copia sus flechas. [X] retirarte.', 'Copie as setas deles. [X] sair.'),
    ready: t('Get ready…', 'Prepárate…', 'Prepare-se…'), round: t('ROUND', 'RONDA', 'RODADA'), cheers: t('GOOD', 'BIEN', 'BOM')
  };
  U.partnerDance = function (who, cb) {
    const pers = PARTNERS[who] || PARTNERS.maru;
    /* four rounds: a single move twice, then two moves chained, then a longer chain */
    const pool = pers.moves.slice();
    const pick = function () { return pool[Math.floor(Math.random() * pool.length)]; };
    const rounds = [[pick()], [pick()], [pick(), pick()], [pick(), pick(), pick()]].map(function (r) { return r.slice(); });
    P = { who: who, pers: pers, rounds: rounds, ri: 0, pos: 0, shown: 0, hits: 0, total: 0, perfect: 0, miss: 0, cb: cb, timers: [], locked: true, seq: '' };
    EM.DIALOGUES.pd_run = { who: who, role: t('DANCING WITH YOU', 'BAILANDO CONTIGO', 'DANÇANDO COM VOCÊ'), forced: true, start: 'a', nodes: { a: { pd: true, text: '' } } };
    EM.audio.hold = true;
    U.startDialogue('pd_run', { npc: who });
  };
  U.pdActive = function () { return !!(P && U.D && U.D.id === 'pd_run'); };

  function seqOf(r) { return r.map(function (k) { return MOVES[k].seq; }).join(''); }
  function namesOf(r) { return r.map(function (k) { return EM.tr(MOVES[k].name); }).join(' + '); }

  U.pdRender = function () {
    if (!P) return;
    document.getElementById('dlg-choices').classList.remove('gestures');
    startRound();
  };
  function clearTimers() { if (P && P.timers) P.timers.forEach(clearTimeout); if (P) P.timers = []; }
  function startRound() {
    clearTimers();
    const r = P.rounds[P.ri]; P.seq = seqOf(r); P.pos = 0; P.shown = 0; P.locked = true;
    const body = document.getElementById('dlg-text'), box = document.getElementById('dlg-choices');
    body.textContent = EM.tr(LBL.round) + ' ' + (P.ri + 1) + '/' + P.rounds.length + ' — ' + namesOf(r);
    box.textContent = '';
    const wrap = el('div', 'pd');
    const prow = el('div', 'pdrow'); prow.appendChild(el('span', 'pdl', EM.CAST[P.who].name));
    const yrow = el('div', 'pdrow'); yrow.appendChild(el('span', 'pdl', EM.tr(LBL.you)));
    P.pc = []; P.yc = [];
    for (let i = 0; i < P.seq.length; i++) { const c = el('span', 'pdc', ''); prow.appendChild(c); P.pc.push(c); const d = el('span', 'pdc', ''); yrow.appendChild(d); P.yc.push(d); }
    wrap.appendChild(prow); wrap.appendChild(yrow);
    P.note = el('div', 'pdhint', EM.tr(LBL.ready)); wrap.appendChild(P.note);
    box.appendChild(wrap);
    U.postHeight();
    if (EM.settings.noRhythm) P.timers.push(setTimeout(function () { reveal(0); }, 1100));
    else for (let i = 0; i < P.seq.length; i++) P.timers.push(setTimeout(function () { reveal(i); }, 1100 + i * tempo()));
  }
  function tempo() { return P.pers.tempo * 1.1 * (1 - P.ri * 0.06) * (EM.settings.calm ? 1.25 : 1); }
  function reveal(i) {
    if (!P || !P.pc[i]) return;
    P.locked = false;
    P.pc[i].textContent = ARROW[P.seq[i]]; P.pc[i].classList.add('on');
    EM.audio.blip('move');
    P.note.textContent = EM.tr(LBL.hint);
    P.shown = Math.max(P.shown, i + 1);
    if (!EM.settings.noRhythm) P.timers.push(setTimeout(function () { if (P && P.pos === i) { resolve(i, null); } }, tempo() + 450));
  }
  function mark(i, ok, d) { P.yc[i].classList.add(ok ? 'ok' : 'bad'); P.yc[i].textContent = d ? ARROW[d] : '×'; }
  function resolve(i, d) {
    const ok = d === P.seq[i];
    mark(i, ok, d);
    if (ok) { P.hits++; EM.audio.blip('select'); } else { P.miss++; EM.audio.blip('bad'); }
    P.total++; P.pos++;
    if (P.pos >= P.seq.length) P.timers.push(setTimeout(endRound, 650));
    else if (EM.settings.noRhythm) P.timers.push(setTimeout(function () { reveal(P.pos); }, 150));
  }
  U.pdKey = function (d) {
    if (!P || P.locked) return;
    const i = P.pos; if (i >= P.shown || i >= P.seq.length) return;
    resolve(i, d);
  };
  function endRound() {
    if (!P) return;
    clearTimers();
    const roundMiss = P.yc.filter(function (c) { return !c.classList.contains('ok'); }).length;
    if (roundMiss === 0) P.perfect++;
    P.ri++;
    if (P.ri >= P.rounds.length) { finish(false); return; }
    startRound();
  }
  function finish(bailed) {
    if (!P) return;
    clearTimers();
    const res = { who: P.who, hits: P.hits, total: P.total || 1, perfect: P.perfect, rounds: P.rounds.length, bailed: !!bailed };
    const ratio = res.hits / Math.max(1, res.total);
    res.grade = bailed ? 'bail' : (ratio >= 0.85 && res.perfect >= 3 ? 'win' : (ratio >= 0.5 ? 'partial' : 'fail'));
    const cb = P.cb, pers = P.pers; P = null; EM.audio.hold = false;
    if (U.D && U.D.id === 'pd_run') { U.D.def.forced = false; U.endDialogue(true); }
    EM.audio.blip(res.grade === 'win' ? 'good' : (res.grade === 'fail' ? 'bad' : 'select'));
    U.toast({ icon: res.grade === 'win' ? 'star' : 'note', text: res.grade === 'win' ? pers.win : (res.grade === 'bail' ? t(`You step out of the dance with a little bow.`, `Sales del baile con una pequeña reverencia.`, `Você sai da dança com uma pequena reverência.`) : pers.lose), kind: res.grade === 'win' ? 'good' : 'info', ms: 6500 });
    if (cb) cb(res);
  }
  U.pdBail = function () { finish(true); };

  /* ------------------------------------------------------------ effects of a partner dance */
  function apply(res, id, extra) {
    const f = id + '_warm';
    if (res.grade === 'win') L.apply(Object.assign({ fun: 9, soc: 3, flag: [f, id + '_dwin'] }, extra || {}));
    else if (res.grade === 'partial') L.apply(Object.assign({ fun: 5, soc: 1, flag: f }, extra && extra.p || {}));
    else if (res.grade === 'fail') L.apply({ fun: 1, weird: 1, soc: -1 });
    else L.apply({ soc: -1 });
  }
  /* flirts: dance, then come back to the conversation */
  ['vera', 'ines', 'rafa', 'mina', 'nox', 'ludo'].forEach(function (id) {
    S['pd_' + id] = function () {
      U.partnerDance(id, function (res) { apply(res, id); L.addTime(5); if (!EM.state.ended) U.startDialogue(id, { npc: id }); });
    };
  });
  /* friends and the old head */
  EM.FRIENDS.forEach(function (f) {
    S['pd_' + f] = function () {
      U.partnerDance(f, function (res) {
        const b = {}; b[f] = res.grade === 'win' ? 2 : (res.grade === 'partial' ? 1 : 0);
        L.apply(res.grade === 'win' ? { fun: 10, soc: 3, bond: b } : (res.grade === 'partial' ? { fun: 5, soc: 1, bond: b } : (res.grade === 'fail' ? { fun: 2 } : {})));
        L.addTime(5);
      });
    };
  });
  S.hugo_dance = function () {
    U.partnerDance('hugo', function (res) {
      if (res.grade === 'win') L.apply({ fun: 10, soc: 2, flag: ['hugo_friend', 'hugo_danced'] });
      else if (res.grade === 'partial') L.apply({ fun: 5, flag: 'hugo_friend' });
      else L.apply({ fun: 1, soc: -1 });
    });
  };
})();

/* EXCUSE ME — story v16: bigger pockets. Gum, sunglasses, earplugs and accessories, all used from the ITEMS menu (I),
   plus a Rosa you can befriend without ever stepping into the stall. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const NF = EM.NF;

  const inv = function (s) { s.inv = s.inv || { gum: 0, sunglasses: 0, earplugs: 0, acc: {} }; s.inv.acc = s.inv.acc || {}; return s.inv; };
  const worn = function (s) { s.worn = s.worn || { sunglasses: false, earplugs: false, acc: {} }; s.worn.acc = s.worn.acc || {}; return s.worn; };
  const NAMES = {
    gum: t('GUM', 'CHICLE', 'CHICLETE'), sunglasses: t('SUNGLASSES', 'LENTES DE SOL', 'ÓCULOS ESCUROS'), earplugs: t('EARPLUGS', 'TAPONES PARA LOS OÍDOS', 'PROTETORES DE OUVIDO'),
    necklace: t('NECKLACE', 'COLLAR', 'COLAR'), rings: t('RINGS', 'ANILLOS', 'ANÉIS'), chain: t('CHAIN', 'CADENA', 'CORRENTE'), bracelet: t('BRACELET', 'PULSERA', 'PULSEIRA'), earrings: t('EARRINGS', 'ARETES', 'BRINCOS')
  };
  const ACC = {
    necklace: t('kissing luck', 'suerte en los besos', 'sorte nos beijos'), rings: t('a little FUN', 'un poco de DIVERSIÓN', 'um pouco de DIVERSÃO'),
    chain: t('a little SOCIAL', 'un poco de SOCIAL', 'um pouco de SOCIAL'), bracelet: t('a little HEALTH', 'un poco de SALUD', 'um pouco de SAÚDE'), earrings: t('calms WEIRDNESS', 'calma la RAREZA', 'acalma a ESTRANHEZA')
  };
  EM.FXNAME.gum = t('CHEWING', 'MASCANDO', 'MASCANDO');
  const wornAccCount = function (s) { const w = worn(s).acc; return Object.keys(w).filter(function (k) { return w[k]; }).length; };
  const sun = function (s) { return !!(s && worn(s).sunglasses); };
  const plugs = function (s) { return !!(s && worn(s).earplugs); };

  /* ============================================================ GUM */
  EM.giveGum = function (from) {
    const s = EM.state, i = inv(s); if (i.gum >= 5) return false;
    i.gum++;
    U.toast({ icon: 'spark', kind: 'good', ms: 4200, text: from ? t(`${from} offers you a stick of gum. (ITEMS: I)`, `${from} te ofrece un chicle. (OBJETOS: I)`, `${from} te oferece um chiclete. (ITENS: I)`) : t(`You pocket a stick of gum. (ITEMS: I)`, `Te guardas un chicle. (OBJETOS: I)`, `Você guarda um chiclete. (ITENS: I)`) });
    return true;
  };
  S.chew = function () {
    const s = EM.state, i = inv(s); if (i.gum <= 0 || s.fx.gum) return;
    i.gum--; s.fx.gum = 30;
    const drugged = !!(s.fx.mdma || s.fx.meth || s.fx.coke || s.fx.ket);
    U.toast({ icon: 'spark', kind: 'good', ms: 5200, text: drugged
      ? t(`Mint. Your jaw finds something useful to do. ${s.fx.coke ? 'The coke makes it twice as good.' : 'The room gets friendlier.'}`, `Menta. Tu mandíbula encuentra algo útil que hacer. ${s.fx.coke ? 'Con la coca es el doble de bueno.' : 'El cuarto se vuelve más amable.'}`, `Menta. Sua mandíbula encontra algo útil pra fazer. ${s.fx.coke ? 'Com a coca fica duas vezes melhor.' : 'A sala fica mais amigável.'}`)
      : t(`Mint. Fresh breath, brave mouth.`, `Menta. Aliento fresco, boca valiente.`, `Menta. Hálito fresco, boca corajosa.`) });
  };

  /* ============================================================ WORN THINGS */
  function applyEars() { if (EM.audio) { EM.audio.vol = plugs(EM.state) ? 0.5 : 1; if (EM.audio.ctx) EM.audio.applyMute(); } }
  function toggle(kind) {
    const s = EM.state, w = worn(s);
    if (kind === 'sunglasses') {
      w.sunglasses = !w.sunglasses;
      U.toast({ icon: 'eyes', kind: 'info', ms: 5200, text: w.sunglasses
        ? t(`Sunglasses on. You feel like somebody. You can only see a small circle around you.`, `Lentes puestos. Te sientes alguien. Solo ves un círculo pequeño a tu alrededor.`, `Óculos no rosto. Você se sente alguém. Só enxerga um pequeno círculo à sua volta.`)
        : t(`Sunglasses off. The room is large again.`, `Sin lentes. El cuarto vuelve a ser grande.`, `Sem óculos. A sala volta a ser grande.`) });
    } else if (kind === 'earplugs') {
      w.earplugs = !w.earplugs; applyEars();
      U.toast({ icon: 'cross', kind: 'info', ms: 5200, text: w.earplugs
        ? t(`Earplugs in. The bass is a hug now. Conversations will be hard.`, `Tapones puestos. El bajo es un abrazo ahora. Las conversaciones serán difíciles.`, `Protetores no ouvido. O grave agora é um abraço. Conversas vão ficar difíceis.`)
        : t(`Earplugs out. Everything is loud and wonderful.`, `Sin tapones. Todo es fuerte y maravilloso.`, `Sem protetores. Tudo é alto e maravilhoso.`) });
    } else if (ACC[kind]) {
      w.acc[kind] = !w.acc[kind];
      if (w.acc[kind] && wornAccCount(s) > 1 && !s.flags.acc_warn) {
        s.flags.acc_warn = true;
        U.toast({ icon: 'eyes', kind: 'bad', ms: 6000, text: t(`That is a lot of jewellery. People look twice. WEIRDNESS will creep up while you wear more than one.`, `Eso es mucha joyería. La gente mira dos veces. La RAREZA va a subir mientras lleves más de una cosa.`, `Isso é muita bijuteria. As pessoas olham duas vezes. A ESTRANHEZA vai subir enquanto você usar mais de uma peça.`) });
      }
    }
    if (U.hud) U.hud();
  }

  /* rows in the ITEMS menu */
  EM.menuItems = EM.menuItems || [];
  EM.menuItems.push(function (box, s) {
    const i = inv(s), w = worn(s);
    const row = function (label, btn, run, disabled) {
      const r = U.el('div', 'stashrow');
      r.appendChild(U.el('span', 'stl', label));
      const b = U.el('button', '', btn); b.type = 'button'; b.disabled = !!disabled;
      b.addEventListener('click', function () { run(); U.renderMenu(); });
      r.appendChild(b); box.appendChild(r);
    };
    const tr = EM.tr;
    if (i.gum > 0) row(tr(NAMES.gum) + ' ×' + i.gum + (s.fx.gum ? ' — ' + tr(EM.FXNAME.gum) + ' (' + Math.ceil(s.fx.gum) + ' min)' : ''), tr(t('CHEW', 'MASCAR', 'MASCAR')), S.chew, !!s.fx.gum);
    if (i.sunglasses > 0) row(tr(NAMES.sunglasses) + (w.sunglasses ? ' — ' + tr(t('ON', 'PUESTOS', 'NO ROSTO')) : ''), tr(w.sunglasses ? t('TAKE OFF', 'QUITAR', 'TIRAR') : t('PUT ON', 'PONER', 'COLOCAR')), function () { toggle('sunglasses'); });
    if (i.earplugs > 0) row(tr(NAMES.earplugs) + (w.earplugs ? ' — ' + tr(t('IN', 'PUESTOS', 'COLOCADOS')) : ''), tr(w.earplugs ? t('TAKE OUT', 'SACAR', 'TIRAR') : t('PUT IN', 'PONER', 'COLOCAR')), function () { toggle('earplugs'); });
    Object.keys(ACC).forEach(function (k) {
      if (!i.acc[k]) return;
      row(tr(NAMES[k]) + ' (' + tr(ACC[k]) + ')' + (w.acc[k] ? ' — ' + tr(t('WORN', 'PUESTO', 'USANDO')) : ''), tr(w.acc[k] ? t('TAKE OFF', 'QUITAR', 'TIRAR') : t('PUT ON', 'PONER', 'COLOCAR')), function () { toggle(k); });
    });
  });

  /* ============================================================ EFFECTS */
  /* confidence: sunglasses make the good social moments better and the bad ones smaller */
  const apply0 = L.apply;
  L.apply = function (e) {
    const s = EM.state;
    if (e && s && sun(s) && e.soc) e = Object.assign({}, e, { soc: e.soc > 0 ? e.soc * 1.25 : e.soc * 0.75 });
    return apply0.call(this, e);
  };
  /* kissing: gum, sunglasses and a necklace each help */
  const mc0 = L.makeoutChance;
  L.makeoutChance = function (base) {
    const p = mc0(base), s = EM.state; if (!s) return p;
    let add = 0;
    if (s.fx.gum) add += 0.08;
    if (sun(s)) add += 0.08;
    if (worn(s).acc.necklace) add += 0.05;
    return Math.min(0.97, p + add);
  };
  /* the engine asks how often a glare turns into a scene */
  EM.hostileMul = function () { return sun(EM.state) ? 0.5 : 1; };

  const minute0 = L.minute;
  L.minute = function () {
    minute0();
    const s = EM.state; if (!s || s.ended) return;
    if (s.fx.gum && (s.fx.mdma || s.fx.meth || s.fx.coke || s.fx.ket)) L.stat('fun', s.fx.coke ? 0.3 : 0.15);
    const w = worn(s).acc;
    if (w.rings) L.stat('fun', 0.05);
    if (w.chain) L.stat('soc', 0.05);
    if (w.bracelet) L.stat('hp', 0.05);
    if (w.earrings) L.stat('weird', -0.04);
    const n = wornAccCount(s);
    if (n > 1) L.stat('weird', 0.12 * (n - 1), true);
  };

  /* speakers, crowds with sunglasses */
  const speakerCache = {};
  function speakers(zid) {
    if (speakerCache[zid]) return speakerCache[zid];
    const z = Z[zid], out = []; if (!z) return (speakerCache[zid] = out);
    for (let y = 0; y < z.h; y++) for (let x = 0; x < z.w; x++) if (z.tiles[y * z.w + x] === EM.TL.SPEAKER) out.push([x + 0.5, y + 0.5]);
    return (speakerCache[zid] = out);
  }
  let earWarn = 0, sunCrowd = 0;
  const tick0 = story.tick;
  story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state, E = EM.engine; if (!s || s.ended || !E) return;
    /* dancing next to the speakers hurts, and the closer the worse */
    if (E.dancing && !plugs(s)) {
      const list = speakers(s.zone); let d = 99;
      list.forEach(function (p) { d = Math.min(d, Math.hypot(p[0] * 16 - s.x, p[1] * 16 - s.y) / 16); });
      if (d < 8) {
        L.stat('hp', -0.25 * (1 - d / 8) * dt);
        earWarn -= dt;
        if (earWarn <= 0) { earWarn = 40; U.toast({ icon: 'cross', kind: 'bad', ms: 5600, text: t(`Your ears are ringing. The speakers are right there. Reduciendo Daño has earplugs.`, `Te zumban los oídos. Las bocinas están ahí mismo. Reduciendo Daño tiene tapones.`, `Seus ouvidos estão zumbindo. As caixas estão ali do lado. A Reduciendo Daño tem protetores de ouvido.`) }); }
      }
    }
    /* sunglasses in a crowd read as strange */
    if (sun(s) && E.moving && (E.crowdAt(s.x, s.y) > 0 || E.crowdAt(s.x + 12, s.y) > 0 || E.crowdAt(s.x - 12, s.y) > 0 || E.crowdAt(s.x, s.y + 12) > 0 || E.crowdAt(s.x, s.y - 12) > 0)) {
      L.stat('weird', 0.2 * dt, true);
      sunCrowd -= dt;
      if (sunCrowd <= 0) { sunCrowd = 60; U.toast({ icon: 'eyes', kind: 'info', ms: 4200, text: t(`You bump into people you cannot see coming. They notice the sunglasses.`, `Chocas con gente que no ves venir. Notan los lentes.`, `Você esbarra em gente que não vê chegar. Eles notam os óculos.`) }); }
    }
  };
  /* the player wears them on screen too (engine.js reads s.worn) */

  /* ============================================================ CONVERSATIONS: gum offers and earplug misfires */
  D.earplug_fail = {
    who: 'maru', role: t('YOUR EARPLUGS', 'TUS TAPONES', 'SEUS PROTETORES'), forced: true, start: 'a', nodes: {
      a: {
        text: t(`The mouth is moving. The words are somewhere behind the foam in your ears. You catch "…the…" and a lot of enthusiasm. They are waiting for you to answer. Maybe take the earplugs out for this one?`, `La boca se mueve. Las palabras están detrás de la espuma de tus oídos. Alcanzas a oír «…el…» y mucho entusiasmo. Esperan que respondas. ¿Quizás conviene sacarte los tapones para esta?`, `A boca se mexe. As palavras estão atrás da espuma nos seus ouvidos. Você capta «…o…» e muito entusiasmo. Esperam sua resposta. Que tal tirar os protetores pra essa?`),
        choices: [
          K('care', t(`Take the earplugs out and say "sorry, say that again?"`, `Sacarte los tapones y decir «perdón, ¿me lo repites?»`, `Tirar os protetores e dizer «desculpa, repete?»`), { call: 'ep_remove', next: null, free: true }),
          K('chill', t(`Smile and nod, and move along.`, `Sonreír, asentir y seguir.`, `Sorrir, assentir e seguir andando.`), { do: { soc: -1 }, next: null, free: true, react: t(`You nod at what may have been a question. They look unsure. You both move on.`, `Asientes a lo que quizás fue una pregunta. Dudan. Ambos siguen.`, `Você assente pro que talvez fosse uma pergunta. Ficam em dúvida. Os dois seguem.`) })
        ]
      }
    }
  };
  let retry = null;
  S.ep_remove = function () {
    const s = EM.state; worn(s).earplugs = false; applyEars();
    U.toast({ icon: 'cross', kind: 'info', ms: 3500, text: t(`Earplugs out. You can hear them now.`, `Tapones fuera. Ahora los oyes.`, `Protetores fora. Agora você ouve.`) });
    if (retry) { const r = retry; retry = null; setTimeout(function () { if (!EM.state.ended && !U.D) U.startDialogue(r.id, r.opts); }, 120); }
  };
  const sd0 = U.startDialogue;
  U.startDialogue = function (id, opts) {
    const s = EM.state, def = D[id];
    if (s && opts && opts.npc && def && !def.forced && id !== 'pickpocket' && id !== 'earplug_fail' && s.stats) {
      if (plugs(s) && Math.random() < 0.25) { retry = { id: id, opts: opts }; sd0('earplug_fail', { npc: opts.npc }); return; }
      s.gumOffered = s.gumOffered || {};
      if (!s.gumOffered[opts.npc] && Math.random() < 0.10 && inv(s).gum < 5) {
        s.gumOffered[opts.npc] = true;
        const nm = EM.CAST[opts.npc] && EM.CAST[opts.npc].name ? EM.CAST[opts.npc].name.charAt(0) + EM.CAST[opts.npc].name.slice(1).toLowerCase() : null;
        EM.giveGum(nm);
      }
    }
    sd0(id, opts);
  };

  EM.objects.find = EM.objects.talk || function (ent) { U.startDialogue(ent.def.dlg, {}); };

  /* gum at the bar and outside */
  if (D.bar_menu) D.bar_menu.nodes.a.choices.splice(2, 0, K('yes', t(`A stick of gum from the bowl.`, `Un chicle del tazón.`, `Um chiclete da tigela.`), { req: function (s) { return inv(s).gum < 5; }, call: 'take_gum', free: true, next: null }));
  S.take_gum = function () { EM.giveGum(); };
  D.obj_kiosk = {
    start: 'a', nodes: {
      a: {
        text: t(`A kiosk on the pavement with a bowl of gum next to the lighters. A handwritten sign: TAKE ONE. The man inside is asleep with his eyes open.`, `Un quiosco en la banqueta con un tazón de chicles junto a los encendedores. Un cartel a mano: TOMA UNO. El señor de adentro duerme con los ojos abiertos.`, `Uma banca na calçada com uma tigela de chiclete do lado dos isqueiros. Um cartaz à mão: PEGUE UM. O homem lá dentro dorme de olhos abertos.`),
        choices: [
          K('yes', t(`Take a stick of gum.`, `Tomar un chicle.`, `Pegar um chiclete.`), { req: function (s) { return inv(s).gum < 5; }, call: 'take_gum', free: true, next: null }),
          K('chill', t(`Leave it.`, `Dejarlo.`, `Deixar.`), { free: true, next: null })
        ]
      }
    }
  };
  Z.doors.obj({ id: 'kiosk', kind: 'find', x: 9, y: 5, w: 1, h: 1, label: t('KIOSK', 'QUIOSCO', 'BANCA'), dlg: 'obj_kiosk' });

  /* ============================================================ FINDS LYING AROUND */
  const FINDS = [
    { id: 'sg_court', zone: 'courtyard', x: 20, y: 6, kind: 'sunglasses', text: t(`A pair of sunglasses on the bench, one arm folded under the other, abandoned by someone who understood the night was over.`, `Unos lentes de sol en la banca, una patilla doblada bajo la otra, abandonados por alguien que entendió que la noche había terminado.`, `Um óculos escuro no banco, uma haste dobrada sob a outra, abandonado por alguém que entendeu que a noite tinha acabado.`) },
    { id: 'sg_foyer', zone: 'foyer', x: 7, y: 7, kind: 'sunglasses', text: t(`Sunglasses on the floor by the coat check, trodden on but alive. Lost property of a good night.`, `Lentes de sol en el piso junto al guardarropa, pisados pero vivos. Objeto perdido de una buena noche.`, `Óculos escuro no chão perto da chapelaria, pisado mas vivo. Achado e perdido de uma boa noite.`) },
    { id: 'sg_attic', zone: 'attic', x: 34, y: 9, kind: 'sunglasses', text: t(`Sunglasses on a speaker cabinet. Dark, big, and very sure of themselves.`, `Lentes de sol sobre un gabinete de bocina. Oscuros, enormes y muy seguros de sí mismos.`, `Óculos escuro em cima de uma caixa de som. Escuro, enorme e muito seguro de si.`) },
    { id: 'acc_necklace', zone: 'restrooms', x: 14, y: 8, kind: 'necklace', text: t(`A thin necklace on the edge of the sink, with a tiny moon. Somebody took it off to wash their face and forgot.`, `Un collar fino en el borde del lavamanos, con una lunita. Alguien se lo quitó para lavarse la cara y se olvidó.`, `Um colar fino na beira da pia, com uma lua pequenininha. Alguém tirou pra lavar o rosto e esqueceu.`) },
    { id: 'acc_rings', zone: 'attic', x: 4, y: 15, kind: 'rings', text: t(`Three rings in a row on the floor, as if a hand had been there a second ago and left the jewellery behind.`, `Tres anillos en fila en el piso, como si una mano hubiera estado ahí hace un segundo y dejado las joyas.`, `Três anéis em fila no chão, como se uma mão tivesse estado ali um segundo atrás e deixado as joias.`) },
    { id: 'acc_chain', zone: 'main', x: 36, y: 4, kind: 'chain', text: t(`A heavy silver chain, warm, lying near the speakers. It has a lot of opinions and one clasp.`, `Una cadena de plata pesada, tibia, tirada junto a las bocinas. Tiene muchas opiniones y un solo broche.`, `Uma corrente de prata pesada, morna, jogada perto das caixas. Tem muitas opiniões e um fecho só.`) },
    { id: 'acc_bracelet', zone: 'courtyard', x: 27, y: 5, kind: 'bracelet', text: t(`A beaded bracelet on the fence, spelling a name nobody here will answer to.`, `Una pulsera de cuentas en la reja, que deletrea un nombre al que nadie aquí responde.`, `Uma pulseira de miçangas na grade, soletrando um nome a que ninguém aqui atende.`) },
    { id: 'acc_earrings', zone: 'foyer', x: 10, y: 7, kind: 'earrings', text: t(`Two earrings next to each other on the floor, a matched pair that was clearly worth being careful with.`, `Dos aretes juntos en el piso, un par igualito que claramente valía la pena cuidar.`, `Dois brincos lado a lado no chão, um par igualzinho que claramente valia a pena cuidar.`) }
  ];
  FINDS.forEach(function (f) {
    D['pick_' + f.id] = {
      start: 'a', nodes: { a: {
        text: f.text,
        choices: [
          K('yes', t(`Pick it up.`, `Recogerlo.`, `Pegar.`), { call: 'pk_' + f.id, free: true, next: null }),
          K('chill', t(`Leave it.`, `Dejarlo.`, `Deixar.`), { free: true, next: null })
        ]
      } }
    };
    S['pk_' + f.id] = function () {
      const s = EM.state, i = inv(s);
      s.flags['found_' + f.id] = true;
      if (f.kind === 'sunglasses') i.sunglasses++; else i.acc[f.kind] = 1;
      U.toast({ icon: 'star', kind: 'good', ms: 5200, text: t(`You found: ${EM.tr(NAMES[f.kind]).toLowerCase()}. (ITEMS: I)`, `Encontraste: ${EM.tr(NAMES[f.kind]).toLowerCase()}. (OBJETOS: I)`, `Você achou: ${EM.tr(NAMES[f.kind]).toLowerCase()}. (ITENS: I)`) });
    };
    Z[f.zone].obj({ id: 'find_' + f.id, kind: 'find', x: f.x, y: f.y, w: 1, h: 1, label: t('LOOK', 'MIRAR', 'MIRAR'), dlg: 'pick_' + f.id, when: NF('found_' + f.id) });
  });

  /* ============================================================ REDUCIENDO DAÑO: EARPLUGS */
  if (D.nuri) {
    D.nuri.nodes.ep = {
      text: function (s) {
        return inv(s).earplugs >= 2
          ? t(`"You've got two pairs already. That is one more than most of the room."`, `«Ya tienes dos pares. Es uno más que la mayoría del salón».`, `«Você já tem dois pares. É um a mais que a maioria da sala».`)
          : t(`Isi opens a little tin. "Foam ones. Good for the speakers, not for conversation: if you keep them in, a quarter of what people say to you will bounce off. Pop them out when somebody needs you. Dance with them, talk without them."`, `Isi abre una latita. «De espuma. Buenos para las bocinas, malos para conversar: si los dejas puestos, una cuarta parte de lo que te digan va a rebotar. Sácalos cuando alguien te necesite. Baila con ellos, habla sin ellos».`, `A Isi abre uma latinha. «De espuma. Bons pra caixa de som, ruins pra conversa: se deixar, um quarto do que falarem com você vai ricochetear. Tira quando alguém precisar de você. Dança com eles, conversa sem eles».`);
      },
      do: { soc: 1, flag: 'earplugs_known' }, call: 'give_earplugs', next: 'a'
    };
    D.nuri.nodes.a.choices.splice(2, 0, K('ask', t(`"Do you have earplugs?"`, `«¿Tienen tapones para los oídos?»`, `«Vocês têm protetor de ouvido?»`), { next: 'ep', free: true }));
  }
  S.give_earplugs = function () {
    const s = EM.state, i = inv(s); if (i.earplugs >= 2) return;
    i.earplugs++;
    U.toast({ icon: 'cross', kind: 'good', ms: 5000, text: t(`Earplugs from Reduciendo Daño. (ITEMS: I)`, `Tapones de Reduciendo Daño. (OBJETOS: I)`, `Protetores de ouvido da Reduciendo Daño. (ITENS: I)`) });
  };

  /* ============================================================ ROSA: befriend her without the stall */
  const RD = D.rosa_wait;
  if (RD) {
    const a = RD.nodes.a;
    a.choices.splice(1, 0,
      K('ask', t(`"How long is your shift?"`, `«¿Cuánto dura tu turno?»`, `«Quanto tempo dura seu turno?»`), { next: 'shift' }),
      K('care', t(`Offer your water. "You must be thirsty."`, `Ofrecerle tu agua. «Debes tener sed».`, `Oferecer sua água. «Você deve estar com sede».`), { req: { item: 'water' }, do: { item: { water: -1 }, care: 1, soc: 2, flag: 'rosa_t2' }, next: 'water' }),
      K('ask', t(`"Is there anything I can do to help?"`, `«¿Hay algo que pueda hacer para ayudar?»`, `«Tem algo que eu possa fazer pra ajudar?»`), { req: function (s) { return !s.flags.rosa_met; }, next: 'trust_check' })
    );
    RD.nodes.shift = { text: t(`"Since eight. Nine hours? I stopped counting at the third bucket." She wrings the mop. "Nobody asks. Usually people ask where the toilet is."`, `«Desde las ocho. ¿Nueve horas? Dejé de contar en el tercer balde». Exprime el trapeador. «Nadie pregunta. Normalmente preguntan dónde está el baño».`, `«Desde as oito. Nove horas? Parei de contar no terceiro balde». Ela torce o esfregão. «Ninguém pergunta. Normalmente perguntam onde é o banheiro».`), do: { soc: 1, flag: 'rosa_t1' }, next: 'a' };
    RD.nodes.water = { text: t(`Rosa takes the bottle as if it were evidence, drinks half of it in one long swallow, and hands it back. "Nobody has offered me anything since six." She looks at you properly for the first time.`, `Rosa toma la botella como si fuera evidencia, se bebe la mitad de un trago largo y te la devuelve. «Nadie me ha ofrecido nada desde las seis». Te mira bien por primera vez.`, `A Rosa pega a garrafa como se fosse prova, bebe metade num gole longo e devolve. «Ninguém me oferece nada desde as seis». Ela te olha direito pela primeira vez.`), next: 'a' };
    RD.nodes.trust_check = { branch: [
      { req: function (s) { return !!(s.flags.rosa_t1 || s.flags.rosa_t2); }, to: 'trust' },
      { req: function () { return true; }, to: 'notyet' }
    ] };
    RD.nodes.notyet = { text: t(`"Maybe." She does not stop mopping. "Ask me after you've said something kind. Or brought something. I know the type who asks for a favour first."`, `«Quizás». No deja de trapear. «Pregúntame después de decir algo amable. O de traer algo. Conozco al tipo que pide primero el favor».`, `«Talvez». Ela não para de passar o esfregão. «Pergunta de novo depois de dizer algo gentil. Ou trazer algo. Conheço o tipo que pede o favor primeiro».`), next: 'a' };
    RD.nodes.trust = { text: t(`Rosa leans the mop against the sink and studies you the way she studies a floor she is about to trust. "Okay. You can talk to me. I have things that need legs. And a door that opens for people I like." She nods at the staff corridor. "You didn't have to go into a stall to get here."`, `Rosa apoya el trapeador en el lavamanos y te estudia como estudia un piso en el que está por confiar. «Está bien. Puedes hablar conmigo. Tengo cosas que necesitan piernas. Y una puerta que se abre para la gente que me cae bien». Señala el pasillo de staff. «No hizo falta que entraras a una cabina para llegar aquí».`, `A Rosa encosta o esfregão na pia e te estuda do jeito que estuda um chão em que está prestes a confiar. «Tá bom. Pode falar comigo. Tenho coisas que precisam de pernas. E uma porta que abre pra gente de quem eu gosto». Ela acena pro corredor da equipe. «Você não precisou entrar numa cabine pra chegar aqui».`), do: { flag: ['rosa_met', 'rosa_ok', 'rosa_friend', 'quiet_known'], soc: 3, fun: 2 }, next: null };
  }
  /* if you already know her, the stall scene skips the interrogation */
  if (D.rosa_confront) {
    D.rosa_confront.nodes.known = { text: t(`You file out of the stall and Rosa is already there, mop in hand. She counts you with her chin, then lowers the mop. "I know you. Tell me first next time. Doors closed, elbows in, nobody sick behind them. Go on."`, `Salen de la cabina y Rosa ya está ahí, con el trapeador. Te cuenta con la barbilla y baja el trapeador. «A ti te conozco. Avísame primero la próxima. Con la puerta cerrada, los codos adentro, y nadie enfermo detrás. Anda».`, `Vocês saem da cabine e a Rosa já tá lá, de esfregão na mão. Ela conta vocês com o queixo e abaixa o esfregão. «Você eu conheço. Me avisa primeiro da próxima. Porta fechada, cotovelo pra dentro, ninguém passando mal atrás. Vai».`), do: { flag: ['rosa_ally', 'quiet_known'], quest: { q4: 'done', q5: 'active' }, at: 215, soc: 2 }, next: null };
    D.rosa_confront.nodes.st = { branch: [{ req: { flag: 'rosa_friend' }, to: 'known' }, { req: function () { return true; }, to: 'a' }] };
    D.rosa_confront.start = 'st';
  }
  /* more to talk about once she trusts you */
  const RA = D.rosa_again && D.rosa_again.nodes;
  if (RA && RA.after) {
    RA.after.choices.splice(1, 0,
      K('ask', t(`"Any tips for the club?"`, `«¿Algún consejo para el club?»`, `«Alguma dica pro clube?»`), { next: 'tips' }),
      K('ask', t(`"How did you end up here?"`, `«¿Cómo llegaste aquí?»`, `«Como você veio parar aqui?»`), { next: 'story' }),
      K('ask', t(`"Is the music always this loud?"`, `«¿La música siempre suena tan fuerte?»`, `«A música é sempre tão alta?»`), { next: 'loud' })
    );
    RA.tips = { text: t(`"Things get left behind in places people sit. Sunglasses, rings, a chain once. Smoking area, the foyer, the attic, the sink in here. Don't put on a whole jewellery shop: people stare." She taps the side of her head. "And don't wear the sunglasses in a crowd unless you like walking into people."`, `«Las cosas se quedan donde la gente se sienta. Lentes de sol, anillos, una vez una cadena. La zona de fumar, el foyer, el ático, el lavamanos de aquí. No te pongas una joyería entera: la gente mira». Se golpea la sien. «Y no uses los lentes entre la multitud, a menos que te guste chocar con gente».`, `«As coisas ficam onde as pessoas sentam. Óculos escuros, anéis, uma vez uma corrente. Área de fumantes, foyer, sótão, a pia daqui. Não coloque uma joalheria inteira: o povo olha». Ela bate na lateral da cabeça. «E não use óculos escuros no meio da multidão, a menos que goste de esbarrar nas pessoas».`), do: { soc: 1, flag: 'rosa_tips' }, next: 'after' };
    RA.story = { text: t(`"I came for a night job to pay for night school. Nobody told me the toilets would become my university." She almost smiles. "Fourteen years. Every bucket taught me something about people."`, `«Vine por un trabajo nocturno para pagar la escuela nocturna. Nadie me dijo que los baños serían mi universidad». Casi sonríe. «Catorce años. Cada balde me enseñó algo sobre la gente».`, `«Vim por um emprego noturno pra pagar a escola noturna. Ninguém me disse que o banheiro ia virar minha universidade». Ela quase sorri. «Quatorze anos. Cada balde me ensinou algo sobre as pessoas».`), do: { soc: 2, fun: 1, flag: 'rosa_story' }, next: 'after' };
    RA.loud = { text: t(`"Louder than it should be. Your ears will tell you tomorrow. The harm reduction table has earplugs: ask for them. Wear them to dance, take them out to talk, or you'll nod at everything like a pigeon."`, `«Más fuerte de lo que debería. Tus oídos te lo dirán mañana. La mesa de reducción de daños tiene tapones: pídelos. Úsalos para bailar, quítatelos para hablar o asentirás a todo como una paloma».`, `«Mais alta do que devia. Seus ouvidos vão te contar amanhã. A mesa de redução de danos tem protetor de ouvido: pede. Usa pra dançar, tira pra conversar, ou vai concordar com tudo feito pombo».`), do: { soc: 1, flag: 'earplugs_known' }, next: 'after' };
  }
})();

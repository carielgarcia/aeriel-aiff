/* EXCUSE ME — pocket ecosystem & flirts: 14 carried items and 5 pocket-reading flirts. */
'use strict';
/* ---- consolidated from story_v23.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const F = EM.F, NF = EM.NF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`"Later."`, `«Después».`, `«Depois».`), { free: true, next: null }); };
  const IT = EM.items16;
  const look = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  const win = function (a, b) { return function (s) { return s.time >= a && s.time <= b; }; };
  const flag = function (s, f) { return !!s.flags[f]; };

  /* ============================================================ THE ITEM LAYER */
  const inv = function (s) { return (s.inv23 = s.inv23 || {}); };
  const on = function (s) { return (s.on23 = s.on23 || {}); };
  const has = function (s, k) { return (inv(s)[k] || 0) > 0; };
  const NM = {
    tape: t('SWEET SPOT TAPE', 'CINTA DEL PUNTO IDEAL', 'FITA DO PONTO IDEAL'),
    filters: t('NOTCH FILTERS', 'FILTROS DE MUESCA', 'FILTROS NOTCH'),
    receipt: t('STAMPED RECEIPT', 'RECIBO SELLADO', 'RECIBO CARIMBADO'),
    sachet: t('ELECTROLYTE SACHET', 'SOBRE DE ELECTROLITOS', 'SACHÊ DE ELETRÓLITOS'),
    fan: t('HAND FAN', 'ABANICO', 'LEQUE'),
    coin: t('TRICK COIN', 'MONEDA TRUCADA', 'MOEDA TRUCADA'),
    vowslip: t('VOW SLIP', 'PAPEL DE VOTOS', 'PAPEL DE VOTOS'),
    claim: t('LOST PROPERTY CLAIM', 'RECLAMO DE OBJETOS PERDIDOS', 'PEDIDO DE ACHADOS E PERDIDOS'),
    paperback: t('THE PAPERBACK', 'EL LIBRO DE BOLSILLO', 'O LIVRO DE BOLSO'),
    tin: t(`KAZ'S TIN`, `LA LATA DE KAZ`, `A LATA DA KAZ`),
    line: t('LAMINATED LINE', 'FRASE PLASTIFICADA', 'FRASE PLASTIFICADA'),
    plasters: t('BLISTER PLASTERS', 'PARCHES PARA AMPOLLAS', 'CURATIVOS PARA BOLHAS'),
    sticker: t('ASK FIRST STICKER', 'CALCOMANÍA PREGUNTA PRIMERO', 'ADESIVO PERGUNTE PRIMEIRO'),
    pin: t(`ROSARIO'S PIN`, `EL PIN DE ROSARIO`, `O PIN DA ROSARIO`)
  };
  const DESC = {
    tape: t('place it on a dance floor: that spot pays FUN and spares your ears', 'ponla en una pista: ese punto da DIVERSIÓN y cuida tus oídos', 'cole numa pista: esse ponto dá DIVERSÃO e poupa seus ouvidos'),
    filters: t('speech misfires drop to 8% but dancing is flatter', 'las palabras que rebotan bajan a 8%, pero bailar rinde menos', 'as palavras que ricocheteiam caem pra 8%, mas dançar rende menos'),
    receipt: t('your next exchange with Gretchen is 1 for 1, no fee', 'tu próximo cambio con Gretchen es 1 a 1, sin cargo', 'sua próxima troca com a Gretchen é 1 por 1, sem taxa'),
    sachet: t('mix with one sip: HEALTH and thirst', 'mezcla con un sorbo: SALUD y sed', 'misture com um gole: SAÚDE e sede'),
    fan: t('open: thirst builds slower, dancing costs half the HEALTH. Three dances, then the hinge goes', 'abierto: la sed sube más lento y bailar cuesta la mitad de SALUD. Tres bailes y se rompe', 'aberto: a sede sobe mais devagar e dançar custa metade da SAÚDE. Três danças e quebra'),
    coin: t('your next missed kiss gets a second flip', 'tu próximo beso fallido tiene otra tirada', 'seu próximo beijo errado ganha outra jogada'),
    vowslip: t('give it to a friend: bond and FUN', 'dáselo a alguien de tu gente: vínculo y DIVERSIÓN', 'dê pra alguém da sua galera: vínculo e DIVERSÃO'),
    claim: t('hand it to Luca at the coat check', 'entrégaselo a Luca en el guardarropa', 'entregue pro Luca na chapelaria'),
    paperback: t('read for four minutes anywhere', 'lee cuatro minutos donde sea', 'leia quatro minutos em qualquer lugar'),
    tin: t('gum lasts 45 minutes', 'el chicle dura 45 minutos', 'o chiclete dura 45 minutos'),
    line: t('your next ask gets a boost', 'tu próxima pregunta tiene un empujón', 'sua próxima pergunta ganha um empurrão'),
    plasters: t('cancel the HEALTH cost of a dance', 'cancelan el costo de SALUD de un baile', 'cancelam o custo de SAÚDE de uma dança'),
    sticker: t('bumping people costs half the WEIRDNESS', 'chocar con gente cuesta la mitad de RAREZA', 'esbarrar nas pessoas custa metade da ESTRANHEZA')
  };
  /* gain(k): put one in the pocket and say so */
  const gain = function (k, n) {
    const s = EM.state, i = inv(s); n = n || 1;
    i[k] = (i[k] || 0) + n;
    const nm = NM[k];
    U.toast({ icon: 'star', kind: 'good', ms: 5600, text: t(`You got: ${nm.en}${n > 1 ? ' ×' + n : ''}. (ITEMS: I)`, `Conseguiste: ${nm.es}${n > 1 ? ' ×' + n : ''}. (OBJETOS: I)`, `Você ganhou: ${nm.pt}${n > 1 ? ' ×' + n : ''}. (ITENS: I)`) });
  };
  const gainAcc = function (k) { /* an accessory from v16 (rings, earrings, bracelet...) */
    const s = EM.state, i = IT.inv(s);
    if (i.acc[k]) return false;
    i.acc[k] = 1;
    U.toast({ icon: 'star', kind: 'good', ms: 5200, text: t(`You got: ${EM.tr(IT.NAMES[k]).toLowerCase()}. (ITEMS: I)`, `Conseguiste: ${EM.tr(IT.NAMES[k]).toLowerCase()}. (OBJETOS: I)`, `Você ganhou: ${EM.tr(IT.NAMES[k]).toLowerCase()}. (ITENS: I)`) });
    return true;
  };
  EM.i23 = { inv: inv, on: on, has: has, gain: gain, gainAcc: gainAcc, NM: NM };
  const coin = function (s, salt) { return EM.mulberry32((s.seed | 0) + salt)(); };
  const loseSip = function (s) {
    if (!(EM.water.sips(s) > 0)) return false;
    s.sipsUsed = (s.sipsUsed || 0) + 1;
    if (s.sipsUsed >= EM.water.SIPS) { s.items.water = Math.max(0, (s.items.water || 0) - 1); s.sipsUsed = 0; }
    if (U.hud) U.hud();
    return true;
  };
  EM.i23.loseSip = loseSip;
  const info = function (en, es, pt, kind) { U.toast({ icon: 'spark', kind: kind || 'info', ms: 5200, text: t(en, es, pt) }); };
  EM.i23.info = info;

  /* the pin is an accessory (v16 rows, v16 count): add its name and rule */
  IT.NAMES.pin = NM.pin;
  IT.ACC.pin = t('fewer hostile scenes; first talks cost SOCIAL', 'menos escenas hostiles; hablar por primera vez cuesta SOCIAL', 'menos cenas hostis; primeiras conversas custam SOCIAL');

  /* ---- the ITEMS menu ---- */
  EM.menuItems.push(function (box, s) {
    const i = inv(s), o = on(s), tr = EM.tr;
    const row = function (label, btn, run, disabled) {
      const r = U.el('div', 'stashrow');
      r.appendChild(U.el('span', 'stl', label));
      if (btn) { const b = U.el('button', '', btn); b.type = 'button'; b.disabled = !!disabled; b.addEventListener('click', function () { run(); U.renderMenu(); }); r.appendChild(b); }
      box.appendChild(r);
    };
    const lab = function (k) { return tr(NM[k]) + (i[k] > 1 ? ' ×' + i[k] : '') + ' (' + tr(DESC[k]) + ')'; };
    if (has(s, 'tape')) row(lab('tape') + (o.tape ? ' — ' + tr(t('PLACED', 'PUESTA', 'COLADA')) : ''), o.tape ? '' : tr(t('PLACE', 'PONER', 'COLAR')), S.tape_place, !(s.zone === 'main' || s.zone === 'attic'));
    if (has(s, 'filters')) {
      const fOn = o.filters && IT.worn(s).earplugs;
      row(tr(NM.filters) + ' (' + tr(DESC.filters) + ')' + (fOn ? ' — ' + tr(t('IN', 'PUESTOS', 'COLOCADOS')) : ''), tr(fOn ? t('TAKE OUT', 'SACAR', 'TIRAR') : t('PUT IN', 'PONER', 'COLOCAR')), S.filters_toggle);
    }
    if (has(s, 'receipt')) row(lab('receipt'));
    if (has(s, 'sachet')) row(lab('sachet'), tr(t('MIX', 'MEZCLAR', 'MISTURAR')), S.sachet_mix, !(EM.water.sips(s) > 0));
    if (has(s, 'fan')) row(tr(NM.fan) + ' (' + tr(DESC.fan) + ')' + (o.fan ? ' — ' + tr(t('OPEN', 'ABIERTO', 'ABERTO')) : ''), tr(o.fan ? t('CLOSE', 'CERRAR', 'FECHAR') : t('OPEN', 'ABRIR', 'ABRIR')), S.fan_toggle);
    if (has(s, 'coin')) row(lab('coin'));
    if (has(s, 'vowslip')) row(lab('vowslip'), tr(t('GIVE', 'DAR', 'DAR')), S.vow_give, !CORE_HERE(s));
    if (has(s, 'claim')) row(lab('claim'));
    if (has(s, 'paperback')) row(tr(NM.paperback) + ' (' + tr(DESC.paperback) + ') ×' + i.paperback, tr(t('READ', 'LEER', 'LER')), S.book_read);
    if (has(s, 'tin')) row(lab('tin'));
    if (has(s, 'line')) row(lab('line'));
    if (has(s, 'plasters')) row(lab('plasters'));
    if (has(s, 'sticker')) row(lab('sticker'));
  });
  const CORE_HERE = function (s) { return EM.FRIENDS.some(function (f) { return L.hasFriend(f); }); };

  S.tape_place = function () {
    const s = EM.state, i = inv(s);
    if (!has(s, 'tape') || !(s.zone === 'main' || s.zone === 'attic')) return;
    i.tape--; on(s).tape = { zone: s.zone, x: s.x, y: s.y };
    L.spend(2);
    info(`You press the tape down in a neat X. The spot is yours until the night ends.`, `Pegas la cinta en una X prolija. El punto es tuyo hasta que termine la noche.`, `Você cola a fita num X caprichado. O ponto é seu até a noite acabar.`, 'good');
  };
  S.filters_toggle = function () {
    const s = EM.state, o = on(s), w = IT.worn(s);
    if (o.filters && w.earplugs) { o.filters = false; w.earplugs = false; } else { o.filters = true; w.earplugs = true; }
    if (EM.audio) { EM.audio.vol = w.earplugs ? 0.5 : 1; if (EM.audio.ctx) EM.audio.applyMute(); }
    info(w.earplugs ? `Filters in. The highs are gone and your own voice is easier to hear.` : `Filters out. Everything is bright again.`, w.earplugs ? `Filtros puestos. Los agudos se van y tu propia voz se oye mejor.` : `Filtros fuera. Todo vuelve a brillar.`, w.earplugs ? `Filtros no ouvido. Os agudos somem e sua própria voz fica mais fácil de ouvir.` : `Filtros fora. Tudo volta a brilhar.`);
    if (U.hud) U.hud();
  };
  S.sachet_mix = function () {
    const s = EM.state, i = inv(s);
    if (!has(s, 'sachet') || !loseSip(s)) return;
    i.sachet--; s.thirst = 0; L.stat('hp', 8);
    info(`You tip the sachet into the bottle cap and take one sip. Salt, lemon, and a clearer head.`, `Vacías el sobre en la tapa de la botella y tomas un sorbo. Sal, limón y la cabeza más clara.`, `Você despeja o sachê na tampa da garrafa e toma um gole. Sal, limão e a cabeça mais clara.`, 'good');
  };
  S.fan_toggle = function () {
    const s = EM.state, o = on(s);
    o.fan = !o.fan;
    info(o.fan ? `Fan open. You can feel your own temperature again.` : `Fan closed.`, o.fan ? `Abanico abierto. Vuelves a sentir tu propia temperatura.` : `Abanico cerrado.`, o.fan ? `Leque aberto. Você volta a sentir a própria temperatura.` : `Leque fechado.`);
  };
  S.vow_give = function () {
    const s = EM.state, i = inv(s);
    const f = EM.FRIENDS.filter(function (x) { return L.hasFriend(x); })[0];
    if (!f || !has(s, 'vowslip')) return;
    i.vowslip--;
    const b = {}; b[f] = 2;
    L.apply({ bond: b, fun: 5 });
    const nm = EM.tr(EM.CAST[f] ? EM.CAST[f].name : f);
    info(`${nm} reads the slip twice, folds it into a pocket and says nothing. That was the answer.`, `${nm} lee el papel dos veces, lo dobla en un bolsillo y no dice nada. Esa fue la respuesta.`, `${nm} lê o papel duas vezes, dobra num bolso e não diz nada. Essa foi a resposta.`, 'good');
  };
  S.book_read = function () {
    const s = EM.state, i = inv(s);
    if (!(i.paperback > 0)) return;
    i.paperback--; L.spend(4);
    L.apply({ hp: 3, soc: 6 });
    info(i.paperback > 0 ? `You read a chapter standing against a wall. Somebody asks what it is. You have an answer.` : `You finish the last chapter. The ending is a small one and it lands.`, i.paperback > 0 ? `Lees un capítulo de pie contra una pared. Alguien pregunta qué es. Tienes respuesta.` : `Terminas el último capítulo. El final es pequeño y llega.`, i.paperback > 0 ? `Você lê um capítulo em pé encostado numa parede. Alguém pergunta o que é. Você tem resposta.` : `Você termina o último capítulo. O final é pequeno e chega.`, 'good');
  };

  /* ---- rules of the things ---- */
  /* the speaker drain is switched off on your own tape; the fan halves what dancing costs; the plasters cancel it */
  let dWas = false, dOff = 0, tapeT = 0;
  const dragNear = function (s) { const p = on(s).tape; return !!p && p.zone === s.zone && Math.hypot(p.x - s.x, p.y - s.y) < 30; };
  EM.noSpeakerDrain = function () { const s = EM.state; return !!s && dragNear(s); };
  EM.misfireP = function () { const s = EM.state; return s && on(s).filters && IT.worn(s).earplugs ? 0.08 : 0.25; };
  EM.bumpMul = function () { const s = EM.state; return s && has(s, 'sticker') ? 0.5 : 1; };
  const stat0 = L.stat;
  L.stat = function (name, d, raw) {
    const s = EM.state;
    if (name === 'hp' && d < 0 && s && EM.engine && EM.engine.dancing) {
      const o = on(s);
      if (o.plasterOn) return;
      if (o.fanOn) d = d * 0.5;
    }
    return stat0.call(this, name, d, raw);
  };
  const tick0 = story.tick;
  story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state, E = EM.engine; if (!s || s.ended || !E) return;
    const o = on(s), i = inv(s), dnow = !!E.dancing;
    if (dnow) dOff = 0; else dOff += dt;
    if (dnow && !dWas) {
      dWas = true;
      o.plasterOn = false; o.fanOn = false;
      if ((i.plasters || 0) > 0) { i.plasters--; o.plasterOn = true; U.toast({ icon: 'spark', kind: 'good', ms: 3200, text: t(`A plaster on the heel. Dance as long as you like.`, `Un parche en el talón. Baila lo que quieras.`, `Um curativo no calcanhar. Dance o quanto quiser.`) }); }
      else if (o.fan && has(s, 'fan')) {
        o.fanOn = true; o.fanUses = (o.fanUses || 0) + 1;
        if (o.fanUses >= 3) { i.fan = 0; o.fan = false; U.toast({ icon: 'cross', kind: 'info', ms: 5200, text: t(`The hinge on the fan snaps on the third dance. It lived a good life.`, `La bisagra del abanico se rompe en el tercer baile. Tuvo buena vida.`, `A dobradiça do leque quebra na terceira dança. Teve uma boa vida.`) }); }
      }
    }
    if (dWas && dOff > 4) { dWas = false; o.plasterOn = false; o.fanOn = false; }
    /* the tape: FUN once, the first time you dance on it */
    if (dnow && dragNear(s) && !s.flags.tape_paid) { s.flags.tape_paid = true; L.apply({ fun: 3 }); U.toast({ icon: 'heart', kind: 'good', ms: 4200, text: t(`Your own sweet spot. Left and right arrive together. FUN.`, `Tu propio punto ideal. Izquierda y derecha llegan juntas. DIVERSIÓN.`, `Seu próprio ponto ideal. Esquerda e direita chegam juntas. DIVERSÃO.`) }); }
    /* the fan slows thirst; filters flatten the highs */
    if (o.fan && has(s, 'fan')) { tapeT += dt; if (tapeT >= 1.6) { tapeT = 0; s.thirst = Math.max(0, (s.thirst || 0) - 0.4); } }
    if (o.filters && IT.worn(s).earplugs && dnow) L.stat('fun', -0.05 * dt);
  };
  /* gum lasts longer with the tin */
  const chew0 = S.chew;
  S.chew = function () {
    const s = EM.state, had = !!s.fx.gum;
    chew0();
    if (!had && s.fx.gum && has(s, 'tin')) s.fx.gum = 45;
  };
  /* the coin gives a missed kiss a second flip; the laminated line lifts the next ask. Both are spent only when they matter. */
  const mc1 = L.makeoutChance;
  L.makeoutChance = function (base, who) {
    const s = EM.state; let p = mc1(base, who); if (!s) return p;
    if (READS[who]) p += READS[who](s);
    if (s._line) p += 0.15;
    return Math.max(0.12, Math.min(0.97, p));
  };
  const mo0 = L.makeOut;
  L.makeOut = function (o) {
    const s = EM.state;
    s._line = has(s, 'line');
    const p = L.makeoutChance(o && o.p, o && o.who), first = Math.random(), orig = Math.random;
    let used = false;
    Math.random = function () { Math.random = orig; if (first >= p && has(s, 'coin')) { used = true; return orig(); } return first; };
    try { mo0.call(this, o); } finally { Math.random = orig; }
    if (s._line) { inv(s).line--; s._line = false; U.toast({ icon: 'spark', kind: 'info', ms: 4200, text: t(`The laminated line is spent. It did its job, whatever the job was.`, `La frase plastificada se gastó. Cumplió su trabajo, fuera cual fuera.`, `A frase plastificada acabou. Cumpriu seu papel, qualquer que fosse.`) }); }
    if (used) { inv(s).coin--; L.stat('soc', -1); U.toast({ icon: 'spark', kind: 'info', ms: 5200, text: t(`The trick coin spins once more in your palm. A second flip. It is spent.`, `La moneda trucada gira una vez más en tu palma. Otra tirada. Se gastó.`, `A moeda trucada gira mais uma vez na sua palma. Outra jogada. Acabou.`) }); }
  };
  /* what each person reads in your pockets (the flirts of story_v24) */
  const READS = {
    soledad: function (s) { return IT.sun(s) ? -0.10 : 0; },
    kaz: function (s) { return s.fx.gum ? 0.04 : 0; },
    odalys: function (s) { return L.req({ item: 'water' }) ? 0.06 : 0; },
    bart: function (s) { return IT.plugs(s) ? 0.10 : 0; },
    tilda: function (s) { return IT.worn(s).acc.rings ? -0.12 : 0; }
  };
  EM.READS23 = READS;
  const tell0 = EM.flirtTell;
  const TELLS = {
    soledad: function (s) { return IT.sun(s) ? t(`She looks at the lenses. "I can't tell what you're agreeing to."`, `Mira los lentes. «No sé a qué estás diciendo que sí».`, `Ela olha as lentes. «Não sei a que você tá dizendo sim».`) : null; },
    kaz: function (s) { return s.fx.gum ? t(`She sniffs the air. "Mint. I knew it. That changes the argument."`, `Olfatea el aire. «Menta. Lo sabía. Eso cambia el argumento».`, `Ela fareja o ar. «Menta. Eu sabia. Isso muda o argumento».`) : null; },
    odalys: function (s) { return L.req({ item: 'water' }) ? t(`Her eyes go to the bottle in your hand, then back up. A small nod.`, `Sus ojos van a la botella en tu mano y vuelven. Un asentimiento pequeño.`, `Os olhos dela vão pra garrafa na sua mão e voltam. Um aceno pequeno.`) : null; },
    bart: function (s) { return IT.plugs(s) ? t(`He leans in to be heard, then remembers you can hear him fine through the foam. "Oh. Good. I'm bad at this."`, `Se inclina para que lo oigas y recuerda que lo oyes bien a través de la espuma. «Ah. Bien. Soy malo en esto».`, `Ele se inclina pra ser ouvido e lembra que você ouve bem através da espuma. «Ah. Que bom. Sou ruim nisso».`) : null; },
    tilda: function (s) { return IT.worn(s).acc.rings ? t(`She finds your hand. The rings. "That's… okay. That's fine. I'll just carry on."`, `Encuentra tu mano. Los anillos. «Eso es… bueno. Está bien. Sigo igual».`, `Ela encontra sua mão. Os anéis. «Isso é… tá. Tudo bem. Eu continuo».`) : null; }
  };
  EM.flirtTell = function (id) { const s = EM.state; if (s && TELLS[id]) return TELLS[id](s); return tell0 ? tell0(id) : null; };

  /* the claim at Luca's coat check: any accessory from the drawer */
  if (D.luca) {
    D.luca.nodes.a.choices.splice(2, 0, K('care', t(`Hand over the LOST PROPERTY CLAIM.`, `Entregar el RECLAMO DE OBJETOS PERDIDOS.`, `Entregar o PEDIDO DE ACHADOS E PERDIDOS.`), { req: function (s) { return has(s, 'claim'); }, call: 'luca_claim', free: true, next: null }));
    S.luca_claim = function () {
      const s = EM.state, i = inv(s), ni = IT.inv(s);
      const pool = Object.keys(IT.ACC).filter(function (k) { return k !== 'pin' && !ni.acc[k]; });
      i.claim--;
      if (!pool.length) { U.toast({ icon: 'spark', kind: 'info', ms: 4800, text: t(`Luca opens the drawer. "You've got one of everything. Lost property is a service, not a gift shop." He stamps the claim and keeps it.`, `Luca abre el cajón. «Tienes uno de cada cosa. Objetos perdidos es un servicio, no una tienda de regalos». Sella el reclamo y se lo queda.`, `O Luca abre a gaveta. «Você já tem um de cada. Achados e perdidos é um serviço, não uma loja de presentes». Ele carimba o pedido e fica com ele.`) }); return; }
      const k = pool[Math.floor(Math.random() * pool.length)];
      U.toast({ icon: 'star', kind: 'good', ms: 5200, text: t(`Luca: "Ticket, claim, drawer." He slides one thing across the counter and does not mention the dread.`, `Luca: «Ticket, reclamo, cajón». Desliza una cosa por el mostrador y no menciona la angustia.`, `Luca: «Ticket, pedido, gaveta». Ele desliza uma coisa pelo balcão e não menciona a angústia.`) });
      gainAcc(k);
      L.apply({ soc: 2 });
    };
  }

  /* ============================================================ 1. COLIN, the spot */
  EM.CAST.colin = { name: 'COLIN', look: look({ skin: 0, hair: 1, hc: 4, expr: 1, top: 4, tc: 2, bottom: 1, bc: 1, acc: 7, ac: 1 }) };
  D.colin = {
    who: 'colin', role: t('FINDING THE SPOT', 'BUSCANDO EL PUNTO', 'PROCURANDO O PONTO'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'colin_done' }, to: 'again' }, { req: { flag: 'sweet_spot' }, to: 'gift' }, { req: function () { return true; }, to: 'a' }] },
      again: { text: t(`Colin has not left the tape. "You can stand next to me. A little to the left. Left. There. That's the best two square metres in the building and I will not be taking questions."`, `Colin no se ha movido de la cinta. «Puedes pararte a mi lado. Un poco a la izquierda. Izquierda. Ahí. Son los mejores dos metros cuadrados del edificio y no voy a responder preguntas».`, `O Colin não saiu da fita. «Pode ficar do meu lado. Um pouco pra esquerda. Esquerda. Aí. São os melhores dois metros quadrados do prédio e não vou responder perguntas».`), choices: [LEAVE()] },
      a: {
        text: t(`A man stands on an X of gaffer tape with his phone held over his head. "Don't move. You're a person. That affects the low end."`, `Un hombre está parado sobre una X de cinta americana con el celular sobre la cabeza. «No te muevas. Eres una persona. Eso afecta los graves».`, `Um homem está em pé num X de fita crepe com o celular acima da cabeça. «Não se mexe. Você é uma pessoa. Isso afeta os graves».`),
        choices: [
          K('ask', t(`"What are you measuring?"`, `«¿Qué estás midiendo?»`, `«O que você tá medindo?»`), { free: true, next: 'what' }),
          K('chill', t(`"Sorry. I'll stand still."`, `«Perdón. Me quedo quieto».`, `«Desculpa. Fico parado».`), { next: 'mic' }),
          K('chill', t(`"I'll leave you to it."`, `«Te dejo con lo tuyo».`, `«Deixo você com isso».`), { free: true, next: null })
        ]
      },
      what: { text: t(`"The point where the left stack and the right stack arrive together. There is one on this floor. I have been standing in it since half past ten, and every time somebody walks through, it moves a metre."`, `«El punto donde la bocina izquierda y la derecha llegan juntas. Hay uno en esta pista. Llevo parado en él desde las diez y media y cada vez que alguien pasa se corre un metro».`, `«O ponto onde a caixa esquerda e a direita chegam juntas. Tem um nessa pista. Estou nele desde as dez e meia e toda vez que alguém passa ele se desloca um metro».`), next: 'a' },
      mic: {
        text: t(`"Hold the phone. Mic up, arm out, don't breathe on it. Sixty seconds."`, `«Sostén el celular. Micrófono arriba, brazo estirado, sin respirar encima. Sesenta segundos».`, `«Segura o celular. Microfone pra cima, braço esticado, sem respirar em cima. Sessenta segundos».`),
        choices: [
          K('chill', t(`Hold it and stay quiet.`, `Sostenerlo y quedarte callado.`, `Segurar e ficar quieto.`), { do: { time: 4 }, next: 'listen', react: t(`Colin reads the screen. "The left arrives four milliseconds early at the bar. At this X it's perfect. I wept. Briefly."`, `Colin lee la pantalla. «La izquierda llega cuatro milisegundos antes en la barra. En esta X es perfecto. Lloré. Un momento».`, `O Colin lê a tela. «A esquerda chega quatro milissegundos antes no bar. Nesse X é perfeito. Chorei. Rapidinho».`) }),
          K('joke', t(`"Are we measuring me?"`, `«¿Me estamos midiendo a mí?»`, `«A gente tá me medindo?»`), { do: { fun: 3, time: 4 }, next: 'listen', react: t(`"Yes." He writes your number on the back of his hand and doesn't explain.`, `«Sí». Escribe tu número en el dorso de su mano y no lo explica.`, `«Sim». Ele escreve seu número nas costas da mão e não explica.`) }),
          K('blunt', t(`Talk right through the take.`, `Hablar justo encima de la toma.`, `Falar bem em cima da gravação.`), { do: { soc: -2, flag: 'colin_flub', time: 4 }, next: 'listen', react: t(`"You're in the measurement." He lowers the phone. "That's fine. That's information about you."`, `«Estás en la medición». Baja el celular. «Está bien. Es información sobre ti».`, `«Você tá na medição». Ele abaixa o celular. «Tudo bem. É informação sobre você».`) })
        ]
      },
      listen: {
        text: t(`"Now the part that matters. Eyes closed. I don't DJ. I stand where the sound lands."`, `«Ahora lo que importa. Ojos cerrados. Yo no pincho. Me paro donde cae el sonido».`, `«Agora o que importa. Olhos fechados. Eu não discotequeio. Fico onde o som cai».`),
        choices: [
          K('care', t(`Close your eyes for the full minute.`, `Cerrar los ojos el minuto entero.`, `Fechar os olhos o minuto inteiro.`), { do: { fun: 6, hp: 3, flag: 'sweet_spot', time: 2 }, req: { no: 'sweet_spot' }, next: 'gift', react: t(`The kick comes up through your heels, and the hats sit exactly where your ears are. For a minute there is nothing to do but stand in it.`, `El bombo sube por los talones y los hi-hats caen justo donde están tus oídos. Durante un minuto no hay nada que hacer salvo estar ahí.`, `O bumbo sobe pelos calcanhares e os chimbais caem exatamente onde estão seus ouvidos. Por um minuto não há nada a fazer além de ficar ali.`) }),
          K('chill', t(`Open your eyes early.`, `Abrir los ojos antes.`, `Abrir os olhos antes.`), { free: true, do: { flag: 'colin_done' }, next: null, react: t(`"It's fine. Some people have to look at the thing."`, `«Está bien. Algunos necesitan mirar la cosa».`, `«Tudo bem. Tem gente que precisa olhar pra coisa».`) })
        ]
      },
      gift: {
        text: function (s) {
          return s.flags.colin_flub
            ? t(`Colin opens one eye. "You talked through the take, so I can't give you the good tape. I can give you the end of the roll."`, `Colin abre un ojo. «Hablaste en la toma, así que no puedo darte la cinta buena. Puedo darte el final del rollo».`, `O Colin abre um olho. «Você falou na gravação, então não posso te dar a fita boa. Posso te dar o final do rolo».`)
            : t(`"Take this. I carry three rolls. People don't ask why, and I appreciate that." He presses a short strip of tape into your hand. "Stick it on any dance floor. It will remember."`, `«Toma esto. Llevo tres rollos. La gente no pregunta por qué y lo agradezco». Te pone una tira corta de cinta en la mano. «Pégala en cualquier pista. Se acuerda».`, `«Pega isso. Carrego três rolos. As pessoas não perguntam por quê e eu agradeço». Ele põe uma tira curta de fita na sua mão. «Cole em qualquer pista. Ela lembra».`);
        },
        choices: [K('care', t(`"Thank you, Colin." [Take the tape]`, `«Gracias, Colin». [Tomar la cinta]`, `«{Obrigado|Obrigada|Valeu}, Colin». [Pegar a fita]`), { do: { flag: 'colin_done', call: 'colin_gift' }, free: true, next: null })]
      }
    }
  };
  S.colin_gift = function () { gain('tape'); };
  Z.main.npc({ id: 'colin', x: 6.5, y: 14.5, dlg: 'colin', dir: 'r', reach: 16, when: win(30, 360) });

  /* ============================================================ 2. GRETCHEN, the exchange */
  EM.CAST.gretchen = { name: 'GRETCHEN', look: look({ skin: 0, hair: 3, hc: 9, expr: 1, top: 9, tc: 7, bottom: 0, bc: 4, acc: 6, ac: 0 }) };
  const gwait = function (s) { return (s.cool.gretchen || 0) <= s.time; };
  const lowest = function (s) {
    const st = s.stats, c = { fun: st.fun, soc: st.soc, hp: st.hp };
    return Object.keys(c).sort(function (a, b) { return c[a] - c[b]; })[0];
  };
  D.gretchen = {
    who: 'gretchen', role: t('OFF DUTY', 'FUERA DE TURNO', 'FORA DO EXPEDIENTE'), start: 'a', nodes: {
      a: {
        text: t(`A woman on the foyer bench, lanyard reading OFF DUTY with the OFF crossed out. "I'm off duty. I'm also the only person here who can read a balance. Show me your face."`, `Una mujer en la banca del foyer, con un cordón que dice FUERA DE TURNO y FUERA tachado. «Estoy fuera de turno. También soy la única persona aquí que sabe leer un balance. Muéstrame la cara».`, `Uma mulher no banco do foyer, com um crachá que diz FORA DO EXPEDIENTE e FORA riscado. «Tô fora do expediente. Também sou a única pessoa aqui que sabe ler um balanço. Me mostra o rosto».`),
        choices: [
          K('ask', t(`Let her read you.`, `Dejar que te lea.`, `Deixar ela te ler.`), { next: 'read' }),
          K('chill', t(`"Just passing."`, `«Solo paso».`, `«Só passando».`), { free: true, next: null })
        ]
      },
      read: {
        text: function (s) {
          const w = lowest(s), v = Math.round(s.stats[w]);
          const nm = { fun: t(`Fun, ${v}. I'd call that a going-concern issue.`, `Diversión, ${v}. Yo lo llamaría un problema de empresa en marcha.`, `Diversão, ${v}. Eu chamaria isso de problema de continuidade.`), soc: t(`Social, ${v}. Your reserves are thin and I don't mean that unkindly.`, `Social, ${v}. Tus reservas son escasas y no lo digo con mala intención.`, `Social, ${v}. Suas reservas estão curtas e não digo isso por mal.`), hp: t(`Health, ${v}. That is the one line you cannot restate.`, `Salud, ${v}. Es la única línea que no se puede reexpresar.`, `Saúde, ${v}. É a única linha que não dá pra reapresentar.`) };
          return nm[w];
        },
        choices: [
          K('ask', t(`"What can you do about it?"`, `«¿Qué puedes hacer al respecto?»`, `«O que você pode fazer a respeito?»`), { next: 'trade' }),
          K('care', t(`Offer her a sip of your water.`, `Ofrecerle un sorbo de tu agua.`, `Oferecer um gole da sua água.`), { req: function (s) { return EM.water.sips(s) > 0 && !s.flags.gretchen_rec; }, call: 'gretchen_sip', free: true, next: null }),
          K('chill', t(`"Not today."`, `«Hoy no».`, `«Hoje não».`), { free: true, next: null })
        ]
      },
      trade: {
        text: function (s) {
          return gwait(s)
            ? t(`"Three rates. I don't set them. I have them. One a game hour, because I do have a life."`, `«Tres tarifas. Yo no las fijo. Las tengo. Una por hora de juego, porque sí tengo vida».`, `«Três taxas. Eu não defino. Eu tenho. Uma por hora de jogo, porque eu tenho vida».`)
            : t(`"You've been reconciled. Come back at one." She taps the lanyard. "Not one o'clock. One hour."`, `«Ya estás conciliado. Vuelve a la una». Toca el cordón. «No la una de la mañana. En una hora».`, `«Você já foi conciliado. Volte daqui a uma hora». Ela toca o crachá. «Não à uma da manhã. Daqui a uma hora».`);
        },
        choices: [
          K('plan', t(`FUN 12 for SOCIAL 8.`, `DIVERSIÓN 12 por SOCIAL 8.`, `DIVERSÃO 12 por SOCIAL 8.`), { req: function (s) { return gwait(s) && s.stats.fun >= 18; }, do: { fun: -12, soc: 8, cool: { gretchen: 60 }, time: 1 }, next: 'trade', react: t(`She stamps the air. "Your fun has been reclassified as company. I don't set the rate."`, `Sella el aire. «Tu diversión fue reclasificada como compañía. Yo no fijo la tarifa».`, `Ela carimba o ar. «Sua diversão foi reclassificada como companhia. Eu não defino a taxa».`) }),
          K('plan', t(`SOCIAL 10 for HEALTH 6.`, `SOCIAL 10 por SALUD 6.`, `SOCIAL 10 por SAÚDE 6.`), { req: function (s) { return gwait(s) && s.stats.soc >= 20; }, do: { soc: -10, hp: 6, cool: { gretchen: 60 }, time: 1 }, next: 'trade', react: t(`"Sit down for that. Capitalisation takes a minute."`, `«Siéntate para eso. La capitalización tarda un minuto».`, `«Senta pra isso. A capitalização leva um minuto».`) }),
          K('plan', t(`WEIRDNESS −8 for SOCIAL 10.`, `RAREZA −8 por SOCIAL 10.`, `ESTRANHEZA −8 por SOCIAL 10.`), { req: function (s) { return gwait(s) && s.stats.weird >= 8 && s.stats.soc >= 20; }, do: { weird: -8, soc: -10, cool: { gretchen: 60 }, time: 1 }, next: 'trade', react: t(`"I can't forgive it. I can reclassify it. It's now a one-time item."`, `«No puedo perdonarlo. Puedo reclasificarlo. Ahora es un hecho aislado».`, `«Não posso perdoar. Posso reclassificar. Agora é um evento isolado».`) }),
          K('care', t(`Use the STAMPED RECEIPT: one for one, no fee.`, `Usar el RECIBO SELLADO: uno a uno, sin cargo.`, `Usar o RECIBO CARIMBADO: um por um, sem taxa.`), { req: function (s) { return has(s, 'receipt'); }, free: true, next: 'rec' }),
          K('chill', t(`"That's enough accounting."`, `«Ya basta de contabilidad».`, `«Chega de contabilidade».`), { free: true, next: null })
        ]
      },
      rec: {
        text: t(`She holds the receipt up to the light and her whole posture changes. "That's mine. That's a good stamp. Pick a line, any line, ten for ten."`, `Sostiene el recibo a contraluz y toda su postura cambia. «Eso es mío. Es un buen sello. Elige una línea, la que sea, diez por diez».`, `Ela segura o recibo contra a luz e a postura dela muda por inteiro. «Isso é meu. É um bom carimbo. Escolhe uma linha, qualquer uma, dez por dez».`),
        choices: [
          K('plan', t(`FUN 10 for SOCIAL 10.`, `DIVERSIÓN 10 por SOCIAL 10.`, `DIVERSÃO 10 por SOCIAL 10.`), { req: function (s) { return s.stats.fun >= 12; }, free: true, do: { fun: -10, soc: 10 }, call: 'g_rec_used', next: null }),
          K('plan', t(`SOCIAL 10 for HEALTH 10.`, `SOCIAL 10 por SALUD 10.`, `SOCIAL 10 por SAÚDE 10.`), { req: function (s) { return s.stats.soc >= 12; }, free: true, do: { soc: -10, hp: 10 }, call: 'g_rec_used', next: null }),
          K('plan', t(`SOCIAL 10 for WEIRDNESS −10.`, `SOCIAL 10 por RAREZA −10.`, `SOCIAL 10 por ESTRANHEZA −10.`), { req: function (s) { return s.stats.soc >= 12 && s.stats.weird >= 10; }, free: true, do: { soc: -10, weird: -10 }, call: 'g_rec_used', next: null }),
          K('chill', t(`Keep it for later.`, `Guardarlo para después.`, `Guardar pra depois.`), { free: true, next: null })
        ]
      }
    }
  };
  S.g_rec_used = function () { inv(EM.state).receipt--; };
  S.gretchen_sip = function () {
    const s = EM.state; if (!loseSip(s)) return;
    s.flags.gretchen_rec = true;
    U.startDialogue('gretchen_thanks', { npc: 'gretchen' });
  };
  D.gretchen_thanks = {
    who: 'gretchen', role: t('OFF DUTY', 'FUERA DE TURNO', 'FORA DO EXPEDIENTE'), forced: true, start: 'a', nodes: {
      a: {
        text: t(`She takes the sip, nods once and starts writing. "Water waives the fee. That's a policy I've just made. Here is a receipt for the transaction, which was a sip."`, `Toma el sorbo, asiente una vez y empieza a escribir. «El agua exime del cargo. Es una política que acabo de hacer. Aquí tienes un recibo de la transacción, que fue un sorbo».`, `Ela toma o gole, assente uma vez e começa a escrever. «Água isenta a taxa. É uma política que acabei de criar. Aqui está um recibo da transação, que foi um gole».`),
        choices: [K('care', t(`"Thank you for the receipt."`, `«Gracias por el recibo».`, `«{Obrigado|Obrigada|Valeu} pelo recibo».`), { do: { soc: 2, flag: 'gretchen_rec', call: 'gretchen_rec_give' }, free: true, next: null, react: t(`"Nobody thanks the receipt. You are on the right track."`, `«Nadie agradece el recibo. Vas por buen camino».`, `«Ninguém agradece o recibo. Você tá no caminho certo».`) })]
      }
    }
  };
  S.gretchen_rec_give = function () { gain('receipt'); };
  Z.foyer.npc({ id: 'gretchen', x: 11.5, y: 4.5, dlg: 'gretchen', dir: 'd', reach: 16, when: win(120, 360) });

  /* ============================================================ 3. BARNABY, the trick */
  EM.CAST.barnaby = { name: 'BARNABY', look: look({ skin: 1, hair: 5, hc: 2, expr: 3, top: 10, tc: 8, bottom: 1, bc: 1, acc: 2, ac: 3 }) };
  const flip = function (s) { return coin(s, 8801) < 0.5; };
  D.barnaby = {
    who: 'barnaby', role: t('THE TRICK', 'EL TRUCO', 'O TRUQUE'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'barnaby_done' }, to: 'again' }, { req: function () { return true; }, to: 'a' }] },
      again: { text: t(`Barnaby shuffles with great care and a lot of dropped cards. "I'm practising. Not for you. For the idea of you."`, `Barnaby baraja con cuidado y deja caer muchas cartas. «Estoy practicando. No para ti. Para la idea de ti».`, `O Barnaby embaralha com cuidado e derruba muitas cartas. «Tô praticando. Não pra você. Pra ideia de você».`), choices: [LEAVE()] },
      a: {
        text: t(`A man in a waistcoat fans a deck at you. "Pick a card. Not that one. Put it back. Now pick again. I'm gaining confidence."`, `Un hombre con chaleco te abre una baraja. «Elige una carta. Esa no. Devuélvela. Ahora elige otra. Estoy ganando confianza».`, `Um homem de colete abre um baralho pra você. «Escolhe uma carta. Essa não. Devolve. Agora escolhe outra. Tô ganhando confiança».`),
        choices: [
          K('chill', t(`Pick a card.`, `Elegir una carta.`, `Escolher uma carta.`), { next: 'borrow' }),
          K('chill', t(`"Not now."`, `«Ahora no».`, `«Agora não».`), { free: true, next: null })
        ]
      },
      borrow: {
        text: t(`"The next part needs a volunteer who owns something. Lend me one object. I will make it vanish and bring it back. Statistically."`, `«La siguiente parte necesita un voluntario con una pertenencia. Préstame un objeto. Lo haré desaparecer y lo traeré de vuelta. Estadísticamente».`, `«A próxima parte precisa de um voluntário com um pertence. Me empresta um objeto. Eu faço sumir e trago de volta. Estatisticamente».`),
        choices: [
          K('care', t(`Lend a sip of water.`, `Prestar un sorbo de agua.`, `Emprestar um gole de água.`), { req: function (s) { return EM.water.sips(s) > 0; }, call: 'barn_water', free: true, next: null }),
          K('care', t(`Lend an accessory.`, `Prestar un accesorio.`, `Emprestar um acessório.`), { req: function (s) { return Object.keys(IT.inv(s).acc).some(function (k) { return IT.inv(s).acc[k] && k !== 'pin'; }); }, call: 'barn_acc', free: true, next: null }),
          K('chill', t(`Keep everything. "Do it with nothing."`, `Quedarte con todo. «Hazlo con nada».`, `Ficar com tudo. «Faz sem nada».`), { next: 'reveal', react: t(`"The honest magician's choice." He performs anyway, with a pencil, and the pencil is gone for good.`, `«La elección del mago honesto». Actúa igual, con un lápiz, y el lápiz desaparece para siempre.`, `«A escolha do mágico honesto». Ele faz mesmo assim, com um lápis, e o lápis some pra sempre.`) })
        ]
      },
      reveal: {
        text: t(`"The trick is that there is no trick, which is also a trick. Sorry. I've lost the thread." He looks at you. "Applause is customary. Explanation is also customary, if you must."`, `«El truco es que no hay truco, que también es un truco. Perdón. Perdí el hilo». Te mira. «Lo habitual es aplaudir. También es habitual explicarlo, si hace falta».`, `«O truque é que não tem truque, o que também é um truque. Desculpa. Perdi o fio». Ele te olha. «O costume é aplaudir. Também é costume explicar, se for preciso».`),
        choices: [
          K('care', t(`Applaud.`, `Aplaudir.`, `Aplaudir.`), { do: { soc: 3, fun: 5, flag: 'barnaby_done' }, call: 'barn_coin', next: null, react: t(`He bows so low the waistcoat buttons clink. "Take this. It's not lucky. It's slightly weighted."`, `Hace una reverencia tan baja que los botones del chaleco tintinean. «Toma esto. No da suerte. Pesa un poco más de un lado».`, `Ele faz uma reverência tão baixa que os botões do colete tilintam. «Toma. Não dá sorte. É só um pouco mais pesada de um lado».`) }),
          K('blunt', t(`Say how it works.`, `Decir cómo funciona.`, `Dizer como funciona.`), { do: { soc: -3, weird: 2, flag: 'barnaby_done' }, call: 'barn_earrings', next: null, react: t(`He is crushed, and he pays up in a spirit of professional respect. "Earrings. They're mine. Now they're yours. I'll recover."`, `Queda aplastado y paga con un respeto profesional. «Aretes. Son míos. Ahora son tuyos. Me recuperaré».`, `Ele fica arrasado e paga com respeito profissional. «Brincos. São meus. Agora são seus. Eu me recupero».`) })
        ]
      }
    }
  };
  S.barn_water = function () {
    const s = EM.state; loseSip(s); L.apply({ fun: 4 });
    if (flip(s)) { EM.water.addSip(s); EM.giveGum(); U.startDialogue('barn_ret', { npc: 'barnaby' }); }
    else U.startDialogue('barn_lost', { npc: 'barnaby' });
  };
  S.barn_acc = function () {
    const s = EM.state, i = IT.inv(s), w = IT.worn(s);
    const ks = Object.keys(i.acc).filter(function (k) { return i.acc[k] && k !== 'pin'; }); if (!ks.length) return;
    const k = ks[0]; L.apply({ fun: 4 });
    if (flip(s)) {
      const lacking = Object.keys(IT.ACC).filter(function (x) { return x !== 'pin' && !i.acc[x]; });
      if (lacking.length) gainAcc(lacking[0]);
      U.startDialogue('barn_ret', { npc: 'barnaby' });
    } else { delete i.acc[k]; if (w.acc) w.acc[k] = false; U.startDialogue('barn_lost', { npc: 'barnaby' }); }
  };
  D.barn_ret = { who: 'barnaby', role: t('THE TRICK', 'EL TRUCO', 'O TRUQUE'), forced: true, start: 'a', nodes: { a: { text: t(`He claps once, reaches behind your ear and the thing is back, with a little more than you gave. "The pocket exists today. Do not ask me how."`, `Aplaude una vez, mete la mano tras tu oreja y la cosa vuelve, con un poco más de lo que diste. «Hoy el bolsillo existe. No me preguntes cómo».`, `Ele bate palma uma vez, enfia a mão atrás da sua orelha e a coisa volta, com um pouco mais do que você deu. «Hoje o bolso existe. Não me pergunta como».`), next: 'reveal2' }, reveal2: { text: t(`He looks at it, surprised. "Sorry. I've lost the thread. Where was I? The reveal."`, `La mira, sorprendido. «Perdón. Perdí el hilo. ¿Dónde estaba? El final».`, `Ele olha pra coisa, surpreso. «Desculpa. Perdi o fio. Onde eu tava? O final».`), choices: [K('chill', t(`"Take me through it."`, `«Llévame por el final».`, `«Me leva pro final».`), { free: true, call: 'barn_reveal', next: null })] } } };
  D.barn_lost = { who: 'barnaby', role: t('THE TRICK', 'EL TRUCO', 'O TRUQUE'), forced: true, start: 'a', nodes: { a: { text: t(`He opens both hands. Nothing. "It's in the other pocket." A pause. "The other pocket does not exist. I'm sorry. I'm very sorry. Here, have a card."`, `Abre las dos manos. Nada. «Está en el otro bolsillo». Pausa. «El otro bolsillo no existe. Lo siento. Lo siento mucho. Toma, una carta».`, `Ele abre as duas mãos. Nada. «Tá no outro bolso». Pausa. «O outro bolso não existe. Sinto muito. Sinto muitíssimo. Toma, uma carta».`), choices: [K('chill', t(`"It's a good card."`, `«Es una buena carta».`, `«É uma boa carta».`), { free: true, call: 'barn_reveal', next: null })] } } };
  D.barn_end = { who: 'barnaby', role: t('THE TRICK', 'EL TRUCO', 'O TRUQUE'), forced: true, start: 'reveal', nodes: { reveal: D.barnaby.nodes.reveal } };
  S.barn_reveal = function () { U.startDialogue('barn_end', { npc: 'barnaby' }); };
  S.barn_coin = function () { gain('coin'); };
  S.barn_earrings = function () { if (!gainAcc('earrings')) L.apply({ fun: 2 }); };
  Z.courtyard.npc({ id: 'barnaby', x: 11.5, y: 8.4, dlg: 'barnaby', dir: 'd', reach: 16, when: win(180, 390) });

  /* ============================================================ 4. TEODORA, the vow. Anselm and Dot, Iker. */
  EM.CAST.teodora = { name: 'TEODORA', look: look({ skin: 4, hair: 6, hc: 0, expr: 1, top: 2, tc: 4, bottom: 0, bc: 1, acc: 3, ac: 2 }) };
  EM.CAST.anselm = { name: 'ANSELM', look: look({ skin: 1, hair: 2, hc: 3, expr: 2, top: 4, tc: 0, bottom: 1, bc: 1, acc: 0 }) };
  EM.CAST.dot = { name: 'DOT', look: look({ skin: 0, hair: 4, hc: 8, expr: 2, top: 6, tc: 0, bottom: 3, bc: 3, acc: 4 }) };
  EM.CAST.iker = { name: 'IKER', look: look({ skin: 3, hair: 0, hc: 0, expr: 0, top: 1, tc: 2, bottom: 1, bc: 4, acc: 0 }) };
  D.teodora = {
    who: 'teodora', role: t('OFF DUTY NOTARY', 'NOTARIA FUERA DE TURNO', 'TABELIÃ FORA DO EXPEDIENTE'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'wed_done' }, to: 'after' }, { req: { flag: 'wed_witness' }, to: 'sign' }, { req: { flag: 'wed_open' }, to: 'need' }, { req: function () { return true; }, to: 'a' }] },
      after: { text: t(`Teodora is eating a cold chip very formally. "The marriage is valid in the sense of being witnessed. I take no view on what it's valid for."`, `Teodora come una papa fría con mucha formalidad. «El matrimonio es válido en el sentido de estar atestiguado. No opino para qué es válido».`, `A Teodora come uma batata fria com muita formalidade. «O casamento é válido no sentido de ter sido testemunhado. Não opino sobre pra que é válido».`), choices: [LEAVE()] },
      a: {
        text: t(`A woman on the courtyard bench, stamp and ink pad in her lap, beside a couple holding hands too tightly. "I'm off duty. I'm also legally obliged to ask if you're sure. They're Anselm and Dot. They want a dancefloor wedding and I want a witness."`, `Una mujer en la banca del patio, con sello y almohadilla en el regazo, junto a una pareja que se toma las manos con demasiada fuerza. «Estoy fuera de turno. También estoy obligada a preguntar si estás seguro. Son Anselm y Dot. Quieren una boda en la pista y yo quiero un testigo».`, `Uma mulher no banco do pátio, carimbo e almofada no colo, ao lado de um casal que se segura as mãos forte demais. «Tô fora do expediente. Também sou obrigada a perguntar se você tem certeza. São Anselm e Dot. Querem um casamento na pista e eu quero uma testemunha».`),
        choices: [
          K('care', t(`"I'll witness."`, `«Yo testifico».`, `«Eu testemunho».`), { do: { flag: 'wed_open', soc: 1 }, next: 'need' }),
          K('ask', t(`"Is that legal?"`, `«¿Eso es legal?»`, `«Isso é legal?»`), { free: true, next: 'legal' }),
          LEAVE()
        ]
      },
      legal: { text: t(`"It is whatever two witnesses sign. Which is why I need two, and why the second one has to want to."`, `«Es lo que dos testigos firmen. Por eso necesito dos, y por eso el segundo tiene que querer».`, `«É o que duas testemunhas assinarem. Por isso preciso de duas, e por isso a segunda tem que querer».`), next: 'a' },
      need: {
        text: t(`"Two witnesses, and they must be strangers to each other or very good friends. Anyone with a name will do. Iker is over there pretending to read a flyer. Or bring your own people."`, `«Dos testigos, y deben ser desconocidos entre sí o muy buenos amigos. Cualquiera con nombre sirve. Iker está allá fingiendo leer un volante. O trae a los tuyos».`, `«Duas testemunhas, e elas devem ser desconhecidas entre si ou muito amigas. Qualquer pessoa com nome serve. O Iker tá ali fingindo ler um panfleto. Ou traga a sua galera».`),
        choices: [
          K('care', t(`"Here are my people."`, `«Aquí está mi gente».`, `«Aqui tá minha galera».`), { req: function () { return CORE_HERE(EM.state); }, do: { flag: 'wed_witness', fun: 2 }, next: 'sign' }),
          K('chill', t(`"I'll go and ask Iker."`, `«Voy a preguntarle a Iker».`, `«Vou perguntar pro Iker».`), { free: true, next: null })
        ]
      },
      sign: {
        text: t(`"Sign here. And here. And here, if you're feeling brave." Anselm is crying a little, Dot is not, and both are smiling. "Now the vow. The couple wrote it. They would like your face while it's said."`, `«Firma aquí. Y aquí. Y aquí, si te sientes valiente». Anselm llora un poco, Dot no, y los dos sonríen. «Ahora los votos. La pareja los escribió. Les gustaría tu cara mientras se dicen».`, `«Assina aqui. E aqui. E aqui, se estiver se sentindo corajoso». O Anselm chora um pouco, a Dot não, e os dois sorriem. «Agora os votos. O casal escreveu. Eles gostariam do seu rosto enquanto são ditos».`),
        choices: [
          K('care', t(`Say it like it matters. Because it does.`, `Decirlo en serio. Porque lo es.`, `Dizer a sério. Porque é.`), { do: { fun: 8, soc: 6, hp: 2, flag: 'wed_done', time: 5 }, call: 'wed_slip', next: null, react: t(`The vow is short. The floor around the bench goes quiet for three bars, then claps on the offbeat. Dot cries after all.`, `Los votos son breves. La pista alrededor de la banca se calla durante tres compases y luego aplaude a contratiempo. Dot llora al final.`, `Os votos são curtos. A pista em volta do banco silencia por três compassos e depois bate palma no contratempo. A Dot chora no fim.`) }),
          K('joke', t(`Say a bad one. On purpose.`, `Decir unos malos. A propósito.`, `Dizer uns ruins. De propósito.`), { do: { fun: 10, soc: -2, flag: 'wed_done', time: 5 }, call: 'wed_slip', next: null, react: t(`"I promise to love you even when your playlist is wrong." Anselm falls off the bench. Teodora stamps it anyway and says nothing for a full minute.`, `«Prometo quererte aun cuando tu lista esté mal». Anselm se cae de la banca. Teodora sella igual y no dice nada durante un minuto entero.`, `«Prometo te amar mesmo quando sua playlist estiver errada». O Anselm cai do banco. A Teodora carimba mesmo assim e não diz nada por um minuto inteiro.`) }),
          K('blunt', t(`Refuse to sign.`, `Negarte a firmar.`, `Se recusar a assinar.`), { free: true, do: { flag: 'wed_refused' }, next: null, react: t(`"Understood. A witness is not an obligation." She puts the pen away. "Though the couple will remember it."`, `«Entendido. Un testigo no es una obligación». Guarda la pluma. «Aunque la pareja lo recordará».`, `«Entendido. Testemunha não é obrigação». Ela guarda a caneta. «Embora o casal vá se lembrar».`) })
        ]
      }
    }
  };
  S.wed_slip = function () { gain('vowslip'); };
  D.iker = {
    who: 'iker', role: t('FLYER READER', 'LECTOR DE VOLANTES', 'LEITOR DE PANFLETOS'), start: 'a', nodes: {
      a: {
        text: function (s) {
          return s.flags.wed_open
            ? t(`He is holding a flyer upside down. "Witness? A wedding? I don't know these people." A pause. "Is there cake?"`, `Sostiene un volante al revés. «¿Testigo? ¿Una boda? No conozco a esa gente». Pausa. «¿Hay pastel?»`, `Ele segura um panfleto de cabeça pra baixo. «Testemunha? Um casamento? Não conheço essas pessoas». Pausa. «Tem bolo?»`)
            : t(`He is holding a flyer upside down and reading it with total commitment. "It's an experimental poster."`, `Sostiene un volante al revés y lo lee con total compromiso. «Es un póster experimental».`, `Ele segura um panfleto de cabeça pra baixo e lê com total comprometimento. «É um pôster experimental».`);
        },
        choices: [
          K('care', t(`"There's a vow. And a couple who'd remember you."`, `«Hay unos votos. Y una pareja que te recordaría».`, `«Tem votos. E um casal que ia se lembrar de você».`), { req: { flag: 'wed_open', no: 'wed_witness' }, do: { flag: 'wed_witness', soc: -1, time: 3 }, next: null, react: t(`"Fine. I've never been remembered by a couple." He folds the flyer into his pocket. "Lead the way. I'll sign with my left hand so it's harder to prove."`, `«Está bien. Nunca me ha recordado una pareja». Dobla el volante en el bolsillo. «Guía. Firmaré con la izquierda para que sea más difícil de probar».`, `«Tá bom. Nunca fui lembrado por um casal». Ele dobra o panfleto no bolso. «Vai na frente. Assino com a esquerda pra ser mais difícil de provar».`) }),
          K('care', t(`Give him a sip of your water. "Come and sign."`, `Darle un sorbo de tu agua. «Ven a firmar».`, `Dar um gole da sua água. «Vem assinar».`), { req: function (s) { return !!s.flags.wed_open && !s.flags.wed_witness && EM.water.sips(s) > 0; }, call: 'iker_sip', do: { fun: 2, flag: 'wed_witness', time: 3 }, free: true, next: null, react: t(`He drinks, wipes his mouth and straightens his jacket. "Right. I'm ready. Is it formal? I'll need a shirt."`, `Bebe, se limpia la boca y se acomoda la chaqueta. «Listo. ¿Es formal? Necesito una camisa».`, `Ele bebe, limpa a boca e ajeita o casaco. «Pronto. É formal? Preciso de uma camisa».`) }),
          LEAVE()
        ]
      }
    }
  };
  S.iker_sip = function () { loseSip(EM.state); };
  Z.courtyard.npc({ id: 'teodora', x: 21.5, y: 4.5, dlg: 'teodora', dir: 'r', reach: 18, when: win(240, 390) });
  Z.courtyard.npc({ id: 'wedpair', pair: ['anselm', 'dot'], x: 24, y: 5.5, dir: 'l', decor: true, when: win(240, 390) });
  Z.courtyard.npc({ id: 'iker', x: 16.5, y: 3.8, dlg: 'iker', dir: 'd', reach: 16, when: function (s) { return s.time >= 240 && s.time <= 390 && !s.flags.wed_done; } });

  /* ============================================================ 5. HENRIK, the jug */
  EM.CAST.henrik = { name: 'HENRIK', look: look({ skin: 0, hair: 0, hc: 1, expr: 1, top: 7, tc: 1, bottom: 1, bc: 3, acc: 1, ac: 2 }) };
  D.henrik = {
    who: 'henrik', role: t('THE JUG', 'LA JARRA', 'A JARRA'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'henrik_done' }, to: 'again' }, { req: { flag: 'henrik_ready' }, to: 'gift' }, { req: function () { return true; }, to: 'a' }] },
      again: { text: t(`Henrik holds the jug up to the light. "Fifteen sips. A new personal best. I've written it on the side."`, `Henrik levanta la jarra a contraluz. «Quince sorbos. Nuevo récord personal. Lo anoté al costado».`, `O Henrik levanta a jarra contra a luz. «Quinze goles. Novo recorde pessoal. Anotei na lateral».`), choices: [LEAVE()] },
      a: {
        text: t(`A tall man at the end of the bar, four-litre jug on the counter, marked every half hour in marker. "Fourteen sips since midnight. Not a record. A personal best."`, `Un hombre alto al final de la barra, con una jarra de cuatro litros en el mostrador, marcada cada media hora con plumón. «Catorce sorbos desde medianoche. No es un récord. Es un máximo personal».`, `Um homem alto no fim do bar, jarra de quatro litros no balcão, marcada a cada meia hora com caneta. «Catorze goles desde a meia-noite. Não é recorde. É melhor marca pessoal».`),
        choices: [
          K('ask', t(`"What's the schedule?"`, `«¿Cuál es el horario?»`, `«Qual é o cronograma?»`), { free: true, next: 'sched' }),
          K('care', t(`"Can I join the schedule?"`, `«¿Puedo unirme al horario?»`, `«Posso entrar no cronograma?»`), { next: 'pact' }),
          LEAVE()
        ]
      },
      sched: { text: t(`"A sip every nine minutes. Marked on the side, by the hour. If you skip one, the next is double. I have never had to double."`, `«Un sorbo cada nueve minutos. Marcado en el costado por hora. Si te saltas uno, el siguiente es doble. Nunca he tenido que doblar».`, `«Um gole a cada nove minutos. Marcado na lateral, por hora. Se você pula um, o próximo é dobrado. Nunca precisei dobrar».`), next: 'a' },
      pact: { text: t(`"A pact. Three synchronized sips. You drink when I drink." He pours two cups from the jug. "Drink. I'll wait. I have thirty-one minutes of waiting in me."`, `«Un pacto. Tres sorbos sincronizados. Tú bebes cuando yo bebo». Sirve dos vasos de la jarra. «Bebe. Espero. Tengo treinta y un minutos de espera en mí».`, `«Um pacto. Três goles sincronizados. Você bebe quando eu bebo». Ele serve dois copos da jarra. «Bebe. Eu espero. Tenho trinta e um minutos de espera em mim».`),
        choices: [
          K('care', t(`Drink the first sip.`, `Beber el primer sorbo.`, `Beber o primeiro gole.`), { do: { hp: 1.5, time: 3 }, next: 'sip2' }),
          K('blunt', t(`"Dehydration is a choice."`, `«La deshidratación es una elección».`, `«A desidratação é uma escolha».`), { free: true, next: null, react: t(`"It is. I hope you pick well."`, `«Lo es. Espero que elijas bien».`, `«É. Espero que você escolha bem».`) })
        ]
      },
      sip2: {
        text: t(`"The lines on the jug are not decoration. This one is eleven forty. This one is twelve ten. At twelve forty I move to the left side." He taps. "I've talked about this for a while. You're polite."`, `«Las líneas de la jarra no son decoración. Esta es once cuarenta. Esta, doce diez. A las doce cuarenta paso al lado izquierdo». Golpetea. «He hablado de esto un rato. Eres educado».`, `«As linhas da jarra não são decoração. Essa é onze e quarenta. Essa, meia-noite e dez. À meia-noite e quarenta passo pro lado esquerdo». Ele bate. «Falei disso por um tempo. Você é educado».`),
        choices: [K('care', t(`Take the second sip.`, `Tomar el segundo sorbo.`, `Tomar o segundo gole.`), { do: { soc: -1, time: 3 }, next: 'sip3' })]
      },
      sip3: {
        text: t(`He raises his cup. "To the long game." You drink together. The cold goes down all the way and the bar looks wider than it did.`, `Levanta su vaso. «Por el juego largo». Beben juntos. El frío baja hasta el fondo y la barra se ve más ancha.`, `Ele ergue o copo. «Ao jogo longo». Vocês bebem juntos. O frio desce até o fundo e o bar parece mais largo.`),
        choices: [K('care', t(`Finish the third.`, `Terminar el tercero.`, `Terminar o terceiro.`), { do: { fun: 3, time: 6, flag: 'henrik_ready' }, next: 'gift' })]
      },
      gift: {
        text: t(`Henrik refills your bottle from the jug. "A full bottle. And two sachets, in case you're ever less well than your schedule. Mix with a sip, not with a mood."`, `Henrik llena tu botella de la jarra. «Una botella llena. Y dos sobres, por si alguna vez estás peor que tu horario. Mezcla con un sorbo, no con un estado de ánimo».`, `O Henrik enche sua garrafa da jarra. «Uma garrafa cheia. E dois sachês, caso você fique pior que o seu cronograma. Mistura com um gole, não com um humor».`),
        choices: [K('care', t(`"Thank you, Henrik." [Take the water and sachets]`, `«Gracias, Henrik». [Tomar el agua y los sobres]`, `«{Obrigado|Obrigada|Valeu}, Henrik». [Pegar a água e os sachês]`), { do: { flag: 'henrik_done', unflag: 'henrik_ready', call: 'henrik_gift', time: 4 }, free: true, next: null })]
      }
    }
  };
  S.henrik_gift = function () { const s = EM.state; s.items.water = Math.min(3, (s.items.water || 0) + 1); s.sipsUsed = 0; gain('sachet', 2); };
  Z.main.npc({ id: 'henrik', x: 37, y: 16.5, dlg: 'henrik', dir: 'l', reach: 16, when: win(90, 360) });

  /* ---- morning texts ---- */
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'wed_anselm', who: 'anselm', ok: function (s) { return !!s.flags.wed_done; }, t: t(`dot says i can tell you that the vow is legally unenforceable and we are treating it as binding. thanks for signing. we are eating chips off the stamp.`, `dot dice que puedo contarte que los votos no son exigibles legalmente y los tratamos como vinculantes. gracias por firmar. estamos comiendo papas sobre el sello.`, `a dot disse que posso te contar que os votos não têm validade legal e a gente trata como vinculantes. valeu por assinar. tamo comendo batata em cima do carimbo.`) });
    R.push({ id: 'henrik_jug', who: 'henrik', ok: function (s) { return !!s.flags.henrik_done; }, t: t(`jug is at nineteen sips. you were sip three. i've drawn a small star on the line.`, `la jarra va en diecinueve sorbos. tú fuiste el tres. dibujé una estrellita en la línea.`, `a jarra tá em dezenove goles. você foi o três. desenhei uma estrelinha na linha.`) });
  }
})();

/* ---- consolidated from story_v24.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`"Later."`, `«Después».`, `«Depois».`), { free: true, next: null }); };
  const I = EM.i23, IT = EM.items16;
  const look = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  const win = function (a, b) { return function (s) { return s.time >= a && s.time <= b; }; };
  const n = function (s, p) { return [1, 2, 3].filter(function (k) { return s.flags[p + k]; }).length; };

  /* the shape every flirt shares: a refusal that is a complete answer, and an ask that rolls once */
  function shell(id, role, again, nodes) {
    D[id] = {
      who: id, role: role, start: 's', nodes: Object.assign({
        s: { branch: [{ req: function (s) { return !!(s.flopAt && s.flopAt[id] !== undefined && s.time - s.flopAt[id] < 45); }, to: 'again' }, { req: function (s) { return !!s.flags[id + '_hub']; }, to: 'hub' }, { req: function () { return true; }, to: 'a' }] },
        again: {
          text: again, choices: [
            K('care', t(`"Okay. Thank you for saying it plainly."`, `«Está bien. Gracias por decirlo claro».`, `«Tá bem. Valeu por dizer com clareza».`), { free: true, do: { soc: 1 }, next: null }),
            K('makeout', t(`Ask again anyway.`, `Preguntar otra vez igual.`, `Perguntar de novo mesmo assim.`), { call: 'push_' + id, free: true, next: null })
          ]
        }
      }, nodes)
    };
    S['push_' + id] = function () { L.pushy(id); };
  }
  function ask(id, text, go, tiers) {
    const prev = [];
    const opts = tiers.map(function (r) {
      const before = prev.slice(); prev.push(r[0]);
      return K('makeout', go, { req: function (s) { return r[0](s) && !before.some(function (b) { return b(s); }); }, do: { makeout: { p: r[1], time: 7, who: id } }, next: null });
    });
    return {
      text: function () { const tl = EM.flirtTell && EM.flirtTell(id); return tl ? [text, tl] : text; },
      choices: opts.concat([
        K('chill', t(`"No pressure. Thanks for being honest."`, `«Sin presión. Gracias por decírmelo».`, `«Sem pressão. Valeu por me dizer».`), { free: true, do: { soc: 1 }, next: null })
      ])
    };
  }
  const any = function () { return true; };
  const ASK = t(`Ask: "Would you like to kiss me?"`, `Preguntar: «¿Te gustaría besarme?»`, `Perguntar: «Você gostaria de me beijar?»`);

  /* ============================================================ 11. SOLEDAD, the long look (attic) */
  EM.CAST.soledad = { name: 'SOLEDAD', look: look({ skin: 3, hair: 6, hc: 3, expr: 4, top: 6, tc: 1, bottom: 3, bc: 1, acc: 0 }) };
  const SOL_Q = [
    { q: t(`"What are you avoiding tonight?"`, `«¿Qué estás evitando esta noche?»`, `«O que você tá evitando hoje?»`),
      h: t(`"A conversation I owe somebody. I keep dancing past it."`, `«Una conversación que le debo a alguien. Sigo bailando para esquivarla».`, `«Uma conversa que devo a alguém. Eu continuo dançando pra desviar».`),
      j: t(`"Gravity. It's going badly."`, `«La gravedad. Me va mal».`, `«A gravidade. Tá indo mal».`),
      l: t(`"Nothing. I'm avoiding nothing. I'm extremely here."`, `«Nada. No evito nada. Estoy muy presente».`, `«Nada. Não tô evitando nada. Tô muito presente».`) },
    { q: t(`"Who would you call at six?"`, `«¿A quién llamarías a las seis?»`, `«Pra quem você ligaria às seis?»`),
      h: t(`"My sister. She'd pick up and not ask anything. That's why."`, `«A mi hermana. Contestaría y no preguntaría nada. Por eso».`, `«Minha irmã. Ela atenderia e não perguntaria nada. É por isso».`),
      j: t(`"The pizza place. They're open."`, `«La pizzería. Está abierta».`, `«A pizzaria. Tá aberta».`),
      l: t(`"Nobody. I'm very independent."`, `«A nadie. Soy muy independiente».`, `«Ninguém. Sou muito independente».`) },
    { q: t(`"What would you do if nobody was watching?"`, `«¿Qué harías si nadie mirara?»`, `«O que você faria se ninguém estivesse olhando?»`),
      h: t(`"Sit on the floor of this room and cry a little. Then dance."`, `«Me sentaría en el piso de esta sala y lloraría un poco. Luego bailaría».`, `«Sentaria no chão dessa sala e choraria um pouco. Depois dançaria».`),
      j: t(`"Learn the moonwalk. I'm told it's not a good idea."`, `«Aprendería el moonwalk. Dicen que no es buena idea».`, `«Aprenderia o moonwalk. Dizem que não é boa ideia».`),
      l: t(`"Exactly what I do when people are watching. I'm consistent."`, `«Exactamente lo que hago cuando miran. Soy consistente».`, `«Exatamente o que faço quando olham. Sou consistente».`) }
  ];
  const solQ = function (i) {
    const q = SOL_Q[i - 1], nx = i < 3 ? 'q' + (i + 1) : 'verdict';
    return {
      text: [i === 1 ? t(`She doesn't blink. "Three questions. I won't answer any. You go first."`, `No parpadea. «Tres preguntas. No contesto ninguna. Tú primero».`, `Ela não pisca. «Três perguntas. Eu não respondo nenhuma. Você primeiro».`) : (i === 2 ? t(`She nods, slowly. "Number two."`, `Asiente despacio. «Número dos».`, `Ela assente devagar. «Número dois».`) : t(`She nods again. "Number three. The last."`, `Vuelve a asentir. «Número tres. La última».`, `Ela assente de novo. «Número três. A última».`)), q.q],
      choices: [
        K('honest', q.h, { do: { soc: -2, flag: 'sol_h' + i }, next: nx, react: t(`She says nothing for a while. "Thank you. That is not the answer people usually give."`, `No dice nada durante un rato. «Gracias. No es la respuesta que suele dar la gente».`, `Ela fica um tempo sem dizer nada. «Obrigada. Não é a resposta que as pessoas costumam dar».`) }),
        K('joke', q.j, { do: { fun: 3, flag: 'sol_j' + i }, next: nx, react: t(`The corner of her mouth moves. "Noted. Evasive, but funny."`, `Se le mueve una comisura de la boca. «Anotado. Evasivo, pero gracioso».`, `O canto da boca dela se mexe. «Anotado. Evasivo, mas engraçado».`) }),
        K('lie', q.l, { do: { weird: 2, flag: 'sol_l' + i }, next: nx, react: t(`She tilts her head. "You said that quickly." That is all she says.`, `Ladea la cabeza. «Lo dijiste rápido». Eso es todo lo que dice.`, `Ela inclina a cabeça. «Você disse isso rápido». É só isso que ela diz.`) })
      ]
    };
  };
  shell('soledad', t('THE LONG LOOK', 'LA MIRADA LARGA', 'O OLHAR LONGO'),
    t(`Soledad shakes her head, unhurried. "No. I like you more now that I've said it. Not again tonight."`, `Soledad niega con la cabeza, sin prisa. «No. Me gustas más ahora que lo dije. Esta noche no más».`, `A Soledad nega com a cabeça, sem pressa. «Não. Gosto mais de você agora que disse. Hoje não de novo».`), {
      a: {
        text: t(`A woman on the attic bench, watching the floor and then, for a while, you. "I look at people for a while before I say anything. It's rude. I'm told I should apologise."`, `Una mujer en la banca del ático, mirando la pista y luego, un buen rato, a ti. «Miro a la gente un rato antes de decir algo. Es de mala educación. Me dicen que debería disculparme».`, `Uma mulher no banco do sótão, olhando a pista e depois, por um tempo, você. «Eu olho pras pessoas um tempo antes de dizer qualquer coisa. É rude. Me dizem que eu deveria pedir desculpa».`),
        choices: [
          K('chill', t(`Look back at her.`, `Mirarla de vuelta.`, `Olhar de volta.`), { free: true, next: 'sunchk' }),
          K('chill', t(`"Don't apologise."`, `«No te disculpes».`, `«Não peça desculpa».`), { do: { soc: 1 }, next: 'sunchk' }),
          LEAVE()
        ]
      },
      sunchk: { branch: [{ req: function (s) { return IT.sun(s); }, to: 'sun' }, { req: any, to: 'q1' }] },
      sun: {
        text: t(`She reaches up and stops with her hand an inch from your face. "Take them off. I'd like to see what you're agreeing to."`, `Levanta la mano y se detiene a un centímetro de tu cara. «Quítatelos. Quiero ver a qué estás diciendo que sí».`, `Ela levanta a mão e para a um centímetro do seu rosto. «Tira. Quero ver a que você tá dizendo sim».`),
        choices: [
          K('care', t(`Take the sunglasses off.`, `Quitarte los lentes.`, `Tirar os óculos.`), { call: 'sol_sun_off', free: true, next: 'q1' }),
          K('chill', t(`Keep them on.`, `Dejártelos puestos.`, `Ficar com eles.`), { do: { flag: 'sol_kept' }, next: 'q1', react: t(`"Alright." She says it kindly, and writes it down somewhere behind her eyes.`, `«Está bien». Lo dice con amabilidad y lo anota en algún lugar detrás de los ojos.`, `«Tá bom». Ela diz com gentileza e anota em algum lugar atrás dos olhos.`) })
        ]
      },
      q1: solQ(1), q2: solQ(2), q3: solQ(3),
      verdict: {
        text: function (s) {
          const h = n(s, 'sol_h'), l = n(s, 'sol_l');
          if (h >= 2) return t(`"Two true answers. That's more than most people give me in a year." She takes a small paperback out of her coat. "Take this. I've read it four times. Read it on a wall somewhere. It will do you good."`, `«Dos respuestas verdaderas. Es más de lo que me da la mayoría en un año». Saca un libro de bolsillo del abrigo. «Llévate esto. Lo leí cuatro veces. Léelo contra una pared en algún lado. Te hará bien».`, `«Duas respostas verdadeiras. É mais do que a maioria me dá num ano». Ela tira um livro de bolso do casaco. «Leva. Li quatro vezes. Lê encostado numa parede em algum lugar. Vai te fazer bem».`);
          if (l >= 2) return t(`"You lied twice. It's fine. People do." She looks at you with real interest. "I'd still like you to stay."`, `«Mentiste dos veces. Está bien. La gente lo hace». Te mira con interés de verdad. «Igual me gustaría que te quedaras».`, `«Você mentiu duas vezes. Tudo bem. As pessoas mentem». Ela te olha com interesse de verdade. «Mesmo assim queria que você ficasse».`);
          return t(`"A mix. That's honest too." She moves her coat off the bench. "Sit."`, `«Una mezcla. Eso también es honesto». Quita el abrigo de la banca. «Siéntate».`, `«Uma mistura. Isso também é honesto». Ela tira o casaco do banco. «Senta».`);
        },
        choices: [
          K('care', t(`"Thank you, Soledad." [Take the paperback]`, `«Gracias, Soledad». [Tomar el libro]`, `«{Obrigado|Obrigada|Valeu}, Soledad». [Pegar o livro]`), { req: function (s) { return n(s, 'sol_h') >= 2; }, do: { flag: ['soledad_hub', 'sol_asked'], call: 'sol_verdict' }, next: null }),
          K('care', t(`"Thank you."`, `«Gracias».`, `«{Obrigado|Obrigada|Valeu}».`), { req: function (s) { return n(s, 'sol_h') < 2; }, do: { flag: ['soledad_hub', 'sol_asked'] }, next: null })
        ]
      },
      hub: {
        text: t(`Soledad shifts over on the bench without looking away. "Sit. Or ask. Either is allowed."`, `Soledad se corre en la banca sin dejar de mirar. «Siéntate. O pregunta. Cualquiera de las dos vale».`, `A Soledad se desloca no banco sem parar de olhar. «Senta. Ou pergunta. As duas valem».`),
        choices: [
          K('makeout', ASK, { next: 'ask' }),
          K('chill', t(`Sit with her for a minute.`, `Sentarte con ella un minuto.`, `Sentar com ela um minuto.`), { do: { soc: 1, fun: 1, time: 3 }, req: { no: 'sol_sat' }, next: null, react: t(`Neither of you says anything. It is oddly a conversation anyway.`, `Ninguna de las dos dice nada. Raro, pero cuenta como conversación.`, `Nenhum dos dois diz nada. Estranho, mas conta como conversa.`) }),
          LEAVE()
        ]
      },
      ask: ask('soledad', t(`She finally looks away and back. "You can ask. I'll tell you the truth, which may be no."`, `Por fin mira a otro lado y vuelve. «Puedes preguntar. Te diré la verdad, que podría ser no».`, `Ela finalmente olha pro lado e volta. «Pode perguntar. Eu vou dizer a verdade, que pode ser não».`), t(`"May I kiss you?"`, `«¿Puedo besarte?»`, `«Posso te beijar?»`), [
        [function (s) { return n(s, 'sol_h') >= 2; }, 0.78],
        [function (s) { return n(s, 'sol_l') === 0; }, 0.6],
        [any, 0.3]
      ])
    });
  S.sol_sun_off = function () { IT.worn(EM.state).sunglasses = false; if (U.hud) U.hud(); };
  S.sol_verdict = function () {
    const s = EM.state;
    if (n(s, 'sol_h') >= 2) I.gain('paperback', 3);
  };
  Z.attic.npc({ id: 'soledad', x: 36.5, y: 16.5, dlg: 'soledad', dir: 'l', reach: 16, when: win(210, 420) });
  /* the Paperback has three chapters; I.gain above puts three in the pocket. */

  /* ============================================================ 12. KAZ, argues to flirt (courtyard) */
  EM.CAST.kaz = { name: 'KAZ', look: look({ skin: 5, hair: 4, hc: 0, expr: 5, top: 3, tc: 5, bottom: 1, bc: 2, acc: 5, ac: 4 }) };
  const KAZ_R = [
    { q: t(`"Cold coffee is just soup for people who gave up. Defend yourself."`, `«El café frío es sopa para gente que se rindió. Defiéndete».`, `«Café gelado é sopa pra quem desistiu. Defenda-se».`),
      g: t(`"Soup is served on purpose. Cold coffee is a delayed decision. Different thing."`, `«La sopa se sirve a propósito. El café frío es una decisión retrasada. Otra cosa».`, `«Sopa é servida de propósito. Café gelado é uma decisão adiada. É outra coisa».`),
      w: t(`"…It's… just coffee?"`, `«…¿Es… solo café?»`, `«…É… só café?»`),
      c: t(`"Then I'm giving up with style."`, `«Entonces me rindo con estilo».`, `«Então desisto com estilo».`) },
    { q: t(`"Escalators are stairs that stopped trying."`, `«Las escaleras eléctricas son escaleras que dejaron de intentarlo».`, `«Escada rolante é escada que parou de tentar».`),
      g: t(`"Stairs make you earn the floor. An escalator makes you earn it by trusting the machine. Both are trying."`, `«La escalera te hace ganar el piso. La eléctrica te lo hace ganar confiando en la máquina. Las dos lo intentan».`, `«A escada te faz merecer o andar. A rolante te faz merecer confiando na máquina. As duas tentam».`),
      w: t(`"Stairs are just bad escalators."`, `«Las escaleras son escaleras eléctricas malas».`, `«Escada é escada rolante ruim».`),
      c: t(`"I've given up on both. I take the lift."`, `«Me rendí con las dos. Uso el ascensor».`, `«Desisti das duas. Pego o elevador».`) },
    { q: t(`"A queue is a short-term democracy."`, `«Una fila es una democracia a corto plazo».`, `«Uma fila é uma democracia de curto prazo».`),
      g: t(`"Democracy lets you leave the line. A queue only lets you leave the queue."`, `«La democracia te deja irte de la fila. La fila solo te deja irte de la fila».`, `«A democracia te deixa sair da fila. A fila só te deixa sair da fila».`),
      w: t(`"Queues are queues."`, `«Las filas son filas».`, `«Fila é fila».`),
      c: t(`"I vote we skip this round."`, `«Voto por saltarnos esta ronda».`, `«Voto em pularmos essa rodada».`) }
  ];
  const kazR = function (i) {
    const r = KAZ_R[i - 1], nx = i < 3 ? 'r' + (i + 1) : 'stake';
    return {
      text: i === 1 ? r.q : [t(i === 2 ? `Kaz doesn't wait. ` : `Kaz is enjoying this. `, i === 2 ? `Kaz no espera. ` : `Kaz lo está disfrutando. `, i === 2 ? `A Kaz não espera. ` : `A Kaz tá curtindo. `), r.q],
      choices: [
        K('plan', r.g, { do: { fun: 3 }, call: 'kaz_good', next: nx, react: t(`"Okay. That landed. I'm annoyed."`, `«Bueno. Eso cayó bien. Estoy molesta».`, `«Tá. Essa pegou. Tô irritada».`) }),
        K('chill', r.w, { do: { soc: -1 }, next: nx, react: t(`"I'll let you win this round. I need you to believe in yourself for the next one."`, `«Te dejo ganar esta ronda. Necesito que creas en ti para la siguiente».`, `«Deixo você ganhar essa rodada. Preciso que acredite em si pra próxima».`) }),
        K('joke', r.c, { do: { fun: 1 }, next: nx, react: t(`"A fold. A stylish fold. I respect it."`, `«Una retirada. Una retirada con estilo. La respeto».`, `«Uma retirada. Uma retirada com estilo. Eu respeito».`) })
      ]
    };
  };
  shell('kaz', t('THE ARGUMENT', 'EL ARGUMENTO', 'A DISCUSSÃO'),
    t(`Kaz lifts both palms. "No, fine. You win. Don't tell anyone how little it cost me."`, `Kaz levanta las dos palmas. «No, está bien. Ganas. No le cuentes a nadie lo poco que me costó».`, `A Kaz levanta as duas palmas. «Não, tá bom. Você ganha. Não conta pra ninguém o quão pouco me custou».`), {
      a: {
        text: t(`A woman sits on the barrel by the fence, scrolling nothing. "Cold coffee is just soup for people who gave up." She looks up. "Defend yourself."`, `Una mujer está sentada en el barril junto a la reja, desplazando nada en el celular. «El café frío es sopa para gente que se rindió». Levanta la vista. «Defiéndete».`, `Uma mulher está sentada no barril perto da grade, rolando nada no celular. «Café gelado é sopa pra quem desistiu». Ela levanta o olhar. «Defenda-se».`),
        choices: [
          K('bold', t(`Take the bet.`, `Aceptar el reto.`, `Aceitar o desafio.`), { next: 'gumq' }),
          K('ask', t(`"What happens if I lose?"`, `«¿Qué pasa si pierdo?»`, `«O que acontece se eu perder?»`), { free: true, next: 'rules' }),
          LEAVE()
        ]
      },
      rules: { text: t(`"You pay a sip of water. If you win, I do. And I throw in gum. I'm not a monster."`, `«Pagas un sorbo de agua. Si ganas, lo pago yo. Y te doy un chicle. No soy un monstruo».`, `«Você paga um gole de água. Se ganar, eu pago. E dou um chiclete. Não sou um monstro».`), next: 'a' },
      gumq: {
        text: function (s) {
          return s.fx.gum
            ? t(`She sniffs. "Chewing. Mint or cinnamon? It changes my whole argument." She decides. "Mint. Good. Now start."`, `Olfatea. «Masticando. ¿Menta o canela? Cambia todo mi argumento». Decide. «Menta. Bien. Empieza».`, `Ela fareja. «Mascando. Menta ou canela? Muda o meu argumento inteiro». Decide. «Menta. Bom. Agora comece».`)
            : t(`She sniffs. "No gum. I can't tell if that makes you stronger or weaker. Start."`, `Olfatea. «Sin chicle. No sé si eso te hace más fuerte o más débil. Empieza».`, `Ela fareja. «Sem chiclete. Não sei se isso te deixa mais forte ou mais fraco. Comece».`);
        },
        do: { call: 'kaz_reset' }, next: 'r1'
      },
      r1: kazR(1), r2: kazR(2), r3: kazR(3),
      stake: {
        text: function (s) {
          const g = s.kazG || 0;
          return g >= 2
            ? t(`Kaz counts on her fingers and sighs, defeated. "Two out of three. You win. Here: a sip, a stick of gum, and my tin. It's empty. The empty is the point."`, `Kaz cuenta con los dedos y suspira, vencida. «Dos de tres. Ganas. Toma: un sorbo, un chicle y mi lata. Está vacía. Lo vacío es lo importante».`, `A Kaz conta nos dedos e suspira, derrotada. «Dois de três. Você ganha. Toma: um gole, um chiclete e minha lata. Tá vazia. O vazio é o ponto».`)
            : t(`"I win. I always win." She holds out a hand, palm up. "A sip."`, `«Gano yo. Siempre gano». Extiende una mano con la palma hacia arriba. «Un sorbo».`, `«Eu ganho. Eu sempre ganho». Ela estende uma mão com a palma pra cima. «Um gole».`);
        },
        choices: [
          K('care', t(`Take your winnings.`, `Cobrar tu premio.`, `Pegar o prêmio.`), { req: function (s) { return (s.kazG || 0) >= 2; }, do: { flag: ['kaz_hub', 'kaz_won'] }, call: 'kaz_win', next: null }),
          K('care', t(`Pay with a sip.`, `Pagar con un sorbo.`, `Pagar com um gole.`), { req: function (s) { return (s.kazG || 0) < 2 && EM.water.sips(s) > 0; }, free: true, do: { flag: 'kaz_hub' }, call: 'kaz_pay', next: null }),
          K('chill', t(`"I'm out of water. I owe you."`, `«No tengo agua. Te debo una».`, `«Tô sem água. Te devo uma».`), { req: function (s) { return (s.kazG || 0) < 2 && !(EM.water.sips(s) > 0); }, free: true, do: { flag: 'kaz_hub' }, next: null, react: t(`"An IOU. I'll keep it. I'm very good at keeping things."`, `«Un pagaré. Lo guardo. Se me da muy bien guardar cosas».`, `«Um vale. Eu guardo. Sou muito boa em guardar coisas».`) })
        ]
      },
      hub: {
        text: t(`Kaz is already composing the next one. "Soup. Cold soup is gazpacho. I have a case." She glances up. "Or the other thing?"`, `Kaz ya está componiendo la siguiente. «Sopa. La sopa fría es gazpacho. Tengo un argumento». Levanta la vista. «¿O lo otro?»`, `A Kaz já tá compondo a próxima. «Sopa. Sopa fria é gaspacho. Tenho um argumento». Ela levanta o olhar. «Ou a outra coisa?»`),
        choices: [K('makeout', ASK, { next: 'ask' }), LEAVE()]
      },
      ask: ask('kaz', t(`"The other thing. I can argue that one too. Go on."`, `«Lo otro. También puedo discutirlo. Dale».`, `«A outra coisa. Também posso discutir essa. Vai».`), t(`"Would you like to kiss me?"`, `«¿Te gustaría besarme?»`, `«Você gostaria de me beijar?»`), [
        [function (s) { return !!s.flags.kaz_won; }, 0.75],
        [any, 0.5]
      ])
    });
  S.kaz_reset = function () { EM.state.kazG = 0; };
  S.kaz_good = function () { const s = EM.state; s.kazG = (s.kazG || 0) + 1; };
  S.kaz_win = function () { const s = EM.state; EM.water.addSip(s); EM.giveGum(); I.gain('tin'); };
  S.kaz_pay = function () { I.loseSip(EM.state); };
  Z.courtyard.npc({ id: 'kaz', x: 20.5, y: 13.5, dlg: 'kaz', dir: 'u', reach: 16, when: win(150, 300) });

  /* ============================================================ 13. ODALYS, dances alone (main floor) */
  EM.CAST.odalys = { name: 'ODALYS', look: look({ skin: 4, hair: 7, hc: 2, expr: 0, top: 2, tc: 3, bottom: 2, bc: 0, acc: 3, ac: 1 }) };
  EM.PARTNERS.odalys = {
    tempo: 560, moves: ['bassline', 'shuffle', 'drop', 'sway'],
    win: t(`Odalys closes her eyes and does not stop. After the last beat she says, to the air, "Yes."`, `Odalys cierra los ojos y no se detiene. Después del último golpe dice, al aire: «Sí».`, `A Odalys fecha os olhos e não para. Depois da última batida diz, pro ar: «Sim».`),
    lose: t(`She keeps dancing and treats you as still on time. "Late. That's attractive. Stay late."`, `Sigue bailando y te trata como si fueras a tiempo. «Tarde. Es atractivo. Quédate tarde».`, `Ela continua dançando e te trata como se estivesse no tempo. «Atrasado. É atraente. Fica atrasado».`)
  };
  shell('odalys', t('DANCES ALONE', 'BAILA SOLA', 'DANÇA SOZINHA'),
    t(`Odalys opens one eye. "Not tonight. The floor is big. I'll be on it."`, `Odalys abre un ojo. «Esta noche no. La pista es grande. Voy a estar en ella».`, `A Odalys abre um olho. «Hoje não. A pista é grande. Vou estar nela».`), {
      a: {
        text: t(`A woman dances alone with a space around her that nobody has agreed to. She doesn't open her eyes. "I don't talk on the floor. I'll talk after. If there's an after."`, `Una mujer baila sola con un espacio alrededor que nadie acordó. No abre los ojos. «No hablo en la pista. Hablo después. Si hay un después».`, `Uma mulher dança sozinha com um espaço em volta que ninguém combinou. Ela não abre os olhos. «Não falo na pista. Falo depois. Se houver depois».`),
        choices: [
          K('flirt', t(`Dance next to her.`, `Bailar a su lado.`, `Dançar do lado dela.`), { next: 'gate', free: true }),
          LEAVE()
        ]
      },
      gate: { branch: [{ req: { max: { hp: 39 } }, to: 'sit' }, { req: any, to: 'check' }] },
      sit: {
        text: t(`She opens her eyes at last and looks you up and down. "I don't dance with people who might fall. Sit. There's a step behind you."`, `Por fin abre los ojos y te mira de arriba abajo. «No bailo con gente que podría caerse. Siéntate. Hay un escalón detrás de ti».`, `Ela finalmente abre os olhos e te olha de cima a baixo. «Não danço com gente que pode cair. Senta. Tem um degrau atrás de você».`),
        choices: [K('care', t(`Sit down for a minute.`, `Sentarte un minuto.`, `Sentar um minuto.`), { do: { hp: 4, time: 3 }, req: { no: 'od_sat' }, next: null, react: t(`You sit. The floor looks different from down here, and your knees stop shaking. She nods once and goes back to dancing.`, `Te sientas. La pista se ve distinta desde abajo y las rodillas dejan de temblar. Ella asiente una vez y vuelve a bailar.`, `Você senta. A pista parece diferente daqui de baixo e os joelhos param de tremer. Ela assente uma vez e volta a dançar.`) }), LEAVE()]
      },
      check: {
        text: function (s) {
          return L.req({ item: 'water' })
            ? t(`Her eyes drop to the bottle in your hand and come back up. "Good. I notice who carries water." She starts a count under her breath. "On four."`, `Sus ojos bajan a la botella en tu mano y vuelven. «Bien. Noto quién lleva agua». Empieza una cuenta en voz baja. «En cuatro».`, `Os olhos dela descem pra garrafa na sua mão e voltam. «Bom. Reparo em quem leva água». Ela começa uma contagem baixinho. «No quatro».`)
            : t(`Her eyes check your hands and find nothing in them. "No water. Fine. I won't judge. I'll watch." She starts a count under her breath. "On four."`, `Sus ojos revisan tus manos y no encuentran nada. «Sin agua. Bueno. No juzgo. Miro». Empieza una cuenta en voz baja. «En cuatro».`, `Os olhos dela checam suas mãos e não acham nada. «Sem água. Tá. Não julgo. Observo». Ela começa uma contagem baixinho. «No quatro».`);
        },
        choices: [K('dance', t(`Dance with Odalys.`, `Bailar con Odalys.`, `Dançar com a Odalys.`), { call: 'pd_odalys', free: true, next: null }), LEAVE()]
      },
      hub: {
        text: t(`Odalys wipes her forehead. "After. As promised. What would you like to talk about?"`, `Odalys se seca la frente. «Después. Como prometí. ¿De qué quieres hablar?»`, `A Odalys seca a testa. «Depois. Como prometi. Sobre o que você quer falar?»`),
        choices: [
          K('makeout', ASK, { next: 'ask' }),
          K('chill', t(`"Just the next song."`, `«Solo la próxima canción».`, `«Só a próxima música».`), { free: true, call: 'pd_odalys', next: null }),
          LEAVE()
        ]
      },
      ask: ask('odalys', t(`"After. Yes. We can talk. I'll answer."`, `«Después. Sí. Podemos hablar. Contesto».`, `«Depois. Sim. Podemos conversar. Eu respondo».`), t(`"Would you like to kiss me?"`, `«¿Te gustaría besarme?»`, `«Você gostaria de me beijar?»`), [
        [function (s) { return !!s.flags.odalys_dwin; }, 0.82],
        [function (s) { return !!s.flags.odalys_late; }, 0.62],
        [any, 0.45]
      ])
    });
  S.pd_odalys = function () {
    U.partnerDance('odalys', function (res) {
      const s = EM.state;
      L.apply(res.grade === 'win' ? { fun: 10, soc: 3 } : (res.grade === 'partial' ? { fun: 6, soc: 1 } : (res.grade === 'fail' ? { fun: 2 } : {})));
      L.spend(5);
      if (s.ended) return;
      if (res.grade === 'win') { s.flags.odalys_dwin = true; s.flags.odalys_hub = true; U.startDialogue('odalys_fan', { npc: 'odalys' }); }
      else if (res.grade === 'partial') { s.flags.odalys_late = true; s.flags.odalys_hub = true; U.startDialogue('odalys_late', { npc: 'odalys' }); }
      else U.startDialogue('odalys', { npc: 'odalys' });
    });
  };
  D.odalys_late = { who: 'odalys', role: t('DANCES ALONE', 'BAILA SOLA', 'DANÇA SOZINHA'), forced: true, start: 'a', nodes: { a: { text: t(`"You're half a beat late." She wipes her face. "It's attractive. Stay late."`, `«Llegas medio tiempo tarde». Se limpia la cara. «Es atractivo. Quédate tarde».`, `«Você tá meio tempo atrasado». Ela limpa o rosto. «É atraente. Fica atrasado».`), choices: [K('chill', t(`"I'll stay."`, `«Me quedo».`, `«Eu fico».`), { free: true, do: { fun: 2 }, next: null })] } } };
  D.odalys_fan = {
    who: 'odalys', role: t('DANCES ALONE', 'BAILA SOLA', 'DANÇA SOZINHA'), forced: true, start: 'a', nodes: {
      a: {
        text: t(`The song ends and so does her silence. "That was a good floor. Here." She presses a folded paper fan into your hand. "It breaks after three dances. Everything good does."`, `Termina la canción y también su silencio. «Fue una buena pista. Toma». Te pone en la mano un abanico de papel plegado. «Se rompe después de tres bailes. Todo lo bueno se rompe».`, `A música acaba e o silêncio dela também. «Foi uma boa pista. Toma». Ela põe na sua mão um leque de papel dobrado. «Quebra depois de três danças. Tudo que é bom quebra».`),
        choices: [K('care', t(`"Thank you."`, `«Gracias».`, `«{Obrigado|Obrigada|Valeu}».`), { do: { call: 'odalys_fan_give' }, free: true, next: null })]
      }
    }
  };
  S.odalys_fan_give = function () { I.gain('fan'); };
  Z.main.npc({ id: 'odalys', x: 24.5, y: 13.5, dlg: 'odalys', dir: 'd', reach: 16, pose: 'dance', when: win(240, 420) });

  /* ============================================================ 14. BART, bad at flirting (foyer) */
  EM.CAST.bart = { name: 'BART', look: look({ skin: 1, hair: 2, hc: 6, expr: 3, top: 1, tc: 4, bottom: 1, bc: 3, acc: 6, ac: 2 }) };
  shell('bart', t('HAS A LINE', 'TIENE UNA FRASE', 'TEM UMA CANTADA'),
    t(`Bart looks at the floor, apologises twice and manages to smile. "No. That's fine. That's a full sentence. I'll take it."`, `Bart mira el piso, se disculpa dos veces y logra sonreír. «No. Está bien. Es una frase completa. La acepto».`, `O Bart olha pro chão, pede desculpa duas vezes e consegue sorrir. «Não. Tudo bem. É uma frase completa. Aceito».`), {
      a: {
        text: t(`A man by the foyer wall has been holding the same drink since you came in. "I have a line. It's not good. Do you want it anyway?"`, `Un hombre junto a la pared del foyer sostiene el mismo vaso desde que llegaste. «Tengo una frase. No es buena. ¿La quieres igual?»`, `Um homem junto à parede do foyer tá segurando o mesmo copo desde que você chegou. «Tenho uma cantada. Não é boa. Quer mesmo assim?»`),
        choices: [K('chill', t(`"Go on."`, `«Adelante».`, `«Pode falar».`), { next: 'line' }), LEAVE()]
      },
      line: {
        text: function (s) {
          return IT.plugs(s)
            ? t(`He leans in to be heard. "Is your name Wi-Fi? Because I'm feeling a connection. And I'd need the password." Through the foam it arrives as a confident mumble, and you only realise how it sounded when he repeats it.`, `Se inclina para que lo oigas. «¿Te llamas Wi-Fi? Porque siento una conexión. Y me gustaría la contraseña». A través de la espuma llega como un murmullo seguro, y solo notas cómo sonó cuando lo repite.`, `Ele se inclina pra ser ouvido. «Seu nome é Wi-Fi? Porque tô sentindo uma conexão. E queria a senha». Através da espuma chega como um murmúrio confiante, e você só percebe como soou quando ele repete.`)
            : t(`"Is your name Wi-Fi? Because I'm feeling a connection. And I'd need the password." He closes his eyes. "I told you it wasn't good."`, `«¿Te llamas Wi-Fi? Porque siento una conexión. Y me gustaría la contraseña». Cierra los ojos. «Te dije que no era buena».`, `«Seu nome é Wi-Fi? Porque tô sentindo uma conexão. E queria a senha». Ele fecha os olhos. «Eu avisei que não era boa».`);
        },
        choices: [
          K('care', t(`"Try saying what you actually like about someone."`, `«Prueba diciendo lo que de verdad te gusta de alguien».`, `«Tenta dizer o que você realmente gosta em alguém».`), { next: 'coach' }),
          K('joke', t(`Laugh with him.`, `Reírte con él.`, `Rir com ele.`), { do: { fun: 3 }, next: 'coach', react: t(`He laughs too, relieved, and shows you the bottom of his cup. "I've never gotten past that line before. You're the first."`, `Se ríe también, aliviado, y te muestra el fondo del vaso. «Nunca había pasado de esa frase. Eres el primero».`, `Ele ri também, aliviado, e te mostra o fundo do copo. «Nunca passei dessa cantada. Você é o primeiro».`) }),
          K('blunt', t(`Mock him.`, `Burlarte de él.`, `Zombar dele.`), { do: { soc: -3, fun: -4, flag: ['bart_hurt', 'bart_done'] }, next: null, react: t(`The light goes out of his face. "Right. That's… right. Sorry." He leaves, taking the drink with him.`, `La luz se le apaga en la cara. «Claro. Eso es… claro. Perdón». Se va, llevándose el vaso.`, `A luz some do rosto dele. «Certo. Isso é… certo. Desculpa». Ele sai, levando o copo.`) })
        ]
      },
      coach: {
        text: t(`"I practised that in the shower. It sounded better wet." He breathes. He tries again, with no joke in it: "I like your jacket." A beat. "I do. I wanted to say that and I said the Wi-Fi thing instead."`, `«Lo practiqué en la ducha. Sonaba mejor mojado». Respira. Lo intenta otra vez, sin chiste: «Me gusta tu chaqueta». Pausa. «De verdad. Quería decir eso y dije lo del Wi-Fi».`, `«Treinei no chuveiro. Soava melhor molhado». Ele respira. Tenta de novo, sem piada: «Gosto da sua jaqueta». Pausa. «De verdade. Queria dizer isso e falei a do Wi-Fi».`),
        choices: [
          K('care', t(`"That one. Say that one."`, `«Esa. Di esa».`, `«Essa. Diz essa».`), { do: { soc: 2, flag: 'bart_coached' }, next: 'send' }),
          K('chill', t(`"Both are you. Keep both."`, `«Las dos son tú. Quédate con las dos».`, `«As duas são você. Fica com as duas».`), { do: { fun: 2, flag: 'bart_coached' }, next: 'send' })
        ]
      },
      send: {
        text: t(`He puts the cup down for the first time. "I'm going to say it. To somebody over there. Wish me luck. Or don't. Either way I'm doing it." He goes. Ten minutes pass.`, `Deja el vaso por primera vez. «Voy a decirlo. A alguien por allá. Deséame suerte. O no. De todos modos lo haré». Se va. Pasan diez minutos.`, `Ele larga o copo pela primeira vez. «Vou dizer. Pra alguém ali. Deseje sorte. Ou não. Vou fazer de qualquer jeito». Ele vai. Passam dez minutos.`),
        once: true, do: { time: 10 }, next: 'result'
      },
      result: {
        text: t(`Bart comes back at a half-run, both hands in his hair. "She said yes to a coffee. I've never been so frightened." He presses a laminated card into your hand. "Take my line. I laminated it. It deserves a better owner."`, `Bart vuelve casi corriendo, con las dos manos en el pelo. «Dijo que sí a un café. Nunca había tenido tanto miedo». Te pone una tarjeta plastificada en la mano. «Quédate mi frase. La plastifiqué. Merece un dueño mejor».`, `O Bart volta quase correndo, com as duas mãos no cabelo. «Ela disse sim pra um café. Nunca tive tanto medo». Ele põe um cartão plastificado na sua mão. «Fica com a minha cantada. Plastifiquei. Merece um dono melhor».`),
        choices: [K('care', t(`"Congratulations." [Take the card]`, `«Felicitaciones». [Tomar la tarjeta]`, `«Parabéns». [Pegar o cartão]`), { do: { fun: 10, soc: 4, flag: ['bart_hub', 'bart_done'], call: 'bart_line' }, free: true, next: null, react: t(`"Thank you. I'm going to sit down before I fall down."`, `«Gracias. Me voy a sentar antes de caerme».`, `«{Obrigado|Obrigada|Valeu}. Vou sentar antes de cair».`) })]
      },
      hub: {
        text: t(`Bart is stirring a drink with a straw and a new calm. "Hello. I've decided to enjoy tonight. Would you like to—" He stops. "That wasn't a line. I just wanted to ask if you'd like anything."`, `Bart revuelve un trago con una pajilla y una calma nueva. «Hola. Decidí disfrutar esta noche. ¿Quieres…» Se detiene. «Eso no era una frase. Solo quería preguntar si querías algo».`, `O Bart mexe um drinque com um canudo e uma calma nova. «Oi. Decidi curtir essa noite. Você quer…» Ele para. «Isso não era uma cantada. Só queria perguntar se você queria alguma coisa».`),
        choices: [K('makeout', ASK, { next: 'ask' }), LEAVE()]
      },
      ask: ask('bart', t(`He puts the straw down with great care. "That's— I wasn't— yes? Is yes allowed?"`, `Deja la pajilla con mucho cuidado. «Eso es… no estaba… ¿sí? ¿Se puede decir que sí?»`, `Ele larga o canudo com muito cuidado. «Isso é… eu não estava… sim? Pode dizer sim?»`), t(`"Would you like to kiss me?"`, `«¿Te gustaría besarme?»`, `«Você gostaria de me beijar?»`), [
        [function (s) { return !!s.flags.bart_coached; }, 0.72],
        [any, 0.5]
      ])
    });
  S.bart_line = function () { I.gain('line'); };
  Z.foyer.npc({ id: 'bart', x: 15.5, y: 5.5, dlg: 'bart', dir: 'd', reach: 16, when: function (s) { return s.time >= 60 && s.time <= 240 && !s.flags.bart_hurt; } });

  /* ============================================================ 15. TILDA, bad at flirting (courtyard) */
  EM.CAST.tilda = { name: 'TILDA', look: look({ skin: 0, hair: 1, hc: 7, expr: 1, top: 9, tc: 2, bottom: 0, bc: 0, acc: 6, ac: 1 }) };
  EM.PARTNERS.tilda = {
    tempo: 780, moves: ['sway', 'shuffle', 'wave', 'sway'],
    win: t(`Tilda steps on your foot with great precision, then again. "I'm so sorry. I'm sorry. Did we win? I can't tell."`, `Tilda te pisa el pie con mucha precisión, y otra vez. «Perdón. Perdón. ¿Ganamos? No sé».`, `A Tilda pisa no seu pé com muita precisão, e de novo. «Desculpa. Desculpa. A gente ganhou? Não sei dizer».`),
    lose: t(`Tilda laughs at last, a short, startled sound. "That was bad. That was so bad. I'm having fun."`, `Tilda se ríe por fin, un sonido corto y sorprendido. «Eso fue malo. Eso fue muy malo. Me estoy divirtiendo».`, `A Tilda ri finalmente, um som curto e surpreso. «Isso foi ruim. Isso foi muito ruim. Tô me divertindo».`)
  };
  shell('tilda', t('HAS A PENSION', 'TIENE PENSIÓN', 'TEM PREVIDÊNCIA'),
    t(`Tilda puts a hand over her face, laughing at herself. "No. Of course. That's reasonable. I'll go and look at the lights."`, `Tilda se tapa la cara con una mano, riéndose de sí misma. «No. Claro. Es razonable. Voy a mirar las luces».`, `A Tilda cobre o rosto com uma mão, rindo de si mesma. «Não. Claro. É razoável. Vou olhar as luzes».`), {
      a: {
        text: t(`A woman on the courtyard bench is already talking. "I'm thirty-four. I have a pension. It's a good pension. I can parallel park. First time. Every time."`, `Una mujer en la banca del patio ya está hablando. «Tengo treinta y cuatro años. Tengo pensión. Es una buena pensión. Sé estacionar en paralelo. A la primera. Siempre».`, `Uma mulher no banco do pátio já tá falando. «Tenho trinta e quatro anos. Tenho previdência. É uma boa previdência. Sei fazer baliza. De primeira. Sempre».`),
        choices: [K('chill', t(`"That's a lot of credentials."`, `«Son muchas credenciales».`, `«São muitas credenciais».`), { next: 'ringchk' }), LEAVE()]
      },
      ringchk: { branch: [{ req: function (s) { return !!IT.worn(s).acc.rings && !s.flags.tilda_ring; }, to: 'ring' }, { req: any, to: 'plea' }] },
      ring: {
        text: t(`Her eyes go to your hand. "Oh. You're— okay. Those are rings. That's— I'll just carry on. Here's my pension."`, `Sus ojos van a tu mano. «Ah. Tú estás… bueno. Son anillos. Eso es… sigo igual. Aquí está mi pensión».`, `Os olhos dela vão pra sua mão. «Ah. Você tá… tá. São anéis. Isso é… eu continuo. Aqui tá minha previdência».`),
        once: true, do: { flag: 'tilda_ring', soc: -1 }, next: 'plea'
      },
      plea: {
        text: t(`She holds up a folded printout. It is, in fact, a pension summary. "That's the other reason I'm out on a bench. I'm bad at this."`, `Levanta una hoja doblada. Es, de hecho, un resumen de pensión. «Esa es la otra razón de que esté en una banca. Soy mala en esto».`, `Ela levanta uma folha dobrada. É, de fato, um resumo de previdência. «Essa é a outra razão de eu estar num banco. Sou ruim nisso».`),
        choices: [
          K('care', t(`"What do you like doing?"`, `«¿Qué te gusta hacer?»`, `«O que você gosta de fazer?»`), { next: 'truth' }),
          K('joke', t(`"Is the pension transferable?"`, `«¿La pensión es transferible?»`, `«A previdência é transferível?»`), { do: { fun: 3 }, next: 'truth', react: t(`She chokes on a laugh. "Only by marriage. I'm joking. I don't know. I'd have to check."`, `Se atraganta con una risa. «Solo por matrimonio. Es broma. No sé. Tendría que revisar».`, `Ela engasga numa risada. «Só por casamento. Brincadeira. Não sei. Teria que verificar».`) })
        ]
      },
      truth: {
        text: t(`"…Pension." She hears herself. Then, slowly: "Dances. I like dances. I'm bad at all of them. I go to a class on Tuesdays and the teacher moves me to the back."`, `«…Pensión». Se escucha. Luego, despacio: «Bailes. Me gustan los bailes. Soy mala en todos. Voy a una clase los martes y la profesora me manda al fondo».`, `«…Previdência». Ela se ouve. Depois, devagar: «Danças. Gosto de danças. Sou ruim em todas. Vou numa aula às terças e a professora me manda pro fundo».`),
        choices: [
          K('flirt', t(`"Dance with me."`, `«Baila conmigo».`, `«Dança comigo».`), { call: 'pd_tilda', free: true, next: null }),
          K('chill', t(`"Maybe in a bit."`, `«Quizás en un rato».`, `«Talvez daqui a pouco».`), { free: true, next: null })
        ]
      },
      hub: {
        text: t(`Tilda looks at her shoes and then at you. "I counted fourteen mistakes. That's down from thirty. I'm not saying this is a proposal. I'm saying the option exists."`, `Tilda mira sus zapatos y luego a ti. «Conté catorce errores. Antes eran treinta. No digo que esto sea una propuesta. Digo que la opción existe».`, `A Tilda olha pros sapatos e depois pra você. «Contei catorze erros. Eram trinta. Não tô dizendo que isso é um pedido. Tô dizendo que a opção existe».`),
        choices: [K('makeout', ASK, { next: 'ask' }), K('flirt', t(`"One more dance."`, `«Un baile más».`, `«Mais uma dança».`), { free: true, call: 'pd_tilda', next: null }), LEAVE()]
      },
      ask: ask('tilda', t(`"Oh. That's— yes, that's a question. I have it. I'm listening. I'm so listening."`, `«Ah. Eso es… sí, es una pregunta. La tengo. Escucho. Estoy escuchando muchísimo».`, `«Ah. Isso é… sim, é uma pergunta. Entendi. Tô ouvindo. Tô ouvindo muito».`), t(`"Would you like to kiss me?"`, `«¿Te gustaría besarme?»`, `«Você gostaria de me beijar?»`), [
        [function (s) { return !!s.flags.tilda_danced; }, 0.66],
        [any, 0.45]
      ])
    });
  S.pd_tilda = function () {
    U.partnerDance('tilda', function (res) {
      const s = EM.state;
      L.apply(res.grade === 'win' ? { fun: 9, hp: -1, soc: 2 } : (res.grade === 'partial' ? { fun: 6, hp: -1 } : (res.grade === 'fail' ? { fun: 3, hp: -1 } : {})));
      L.spend(5);
      if (s.ended) return;
      if (res.grade === 'win' || res.grade === 'partial') {
        s.flags.tilda_danced = true; s.flags.tilda_hub = true;
        U.startDialogue('tilda_reward', { npc: 'tilda' });
      } else U.startDialogue('tilda', { npc: 'tilda' });
    });
  };
  D.tilda_reward = {
    who: 'tilda', role: t('HAS A PENSION', 'TIENE PENSIÓN', 'TEM PREVIDÊNCIA'), forced: true, start: 'a', nodes: {
      a: {
        text: t(`She is limping on the right foot and radiant. "I'm not saying this is a proposal. I'm saying the option exists." She digs in her bag. "Blister plasters. Three. I buy them in bulk. I have, I think, a plan."`, `Cojea del pie derecho y está radiante. «No digo que esto sea una propuesta. Digo que la opción existe». Busca en su bolso. «Parches para ampollas. Tres. Los compro al por mayor. Tengo, creo, un plan».`, `Ela manca do pé direito e tá radiante. «Não tô dizendo que isso é um pedido. Tô dizendo que a opção existe». Ela procura na bolsa. «Curativos pra bolha. Três. Compro no atacado. Tenho, acho, um plano».`),
        choices: [K('care', t(`"Thank you. I'll wear them." [Take the plasters]`, `«Gracias. Los voy a usar». [Tomar los parches]`, `«{Obrigado|Obrigada|Valeu}. Vou usar». [Pegar os curativos]`), { do: { call: 'tilda_plasters', flag: 'tilda_done_dance' }, free: true, next: null })]
      }
    }
  };
  S.tilda_plasters = function () { I.gain('plasters', 3); };
  D.soledad.nodes.s.branch.splice(2, 0, { req: function (s) { return !!(s.flags.sol_h3 || s.flags.sol_j3 || s.flags.sol_l3) && !s.flags.soledad_hub; }, to: 'verdict' });
  D.bart.nodes.s.branch.splice(2, 0, { req: function (s) { return !!s.flags.bart_coached && !s.flags.bart_done; }, to: 'result' });
  Z.courtyard.npc({ id: 'tilda', x: 6, y: 3.5, dlg: 'tilda', dir: 'r', reach: 16, when: win(180, 360) });

  /* ---- morning texts ---- */
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'bart_coffee', who: 'bart', ok: function (s) { return !!s.flags.bart_coached; }, t: t(`the coffee is at 11. i am already at the cafe. i have been here for two hours. thank you for the line.`, `el café es a las 11. ya estoy en la cafetería. llevo dos horas aquí. gracias por la frase.`, `o café é às 11. já tô na cafeteria. tô aqui faz duas horas. valeu pela cantada.`) });
    R.push({ id: 'tilda_steps', who: 'tilda', ok: function (s) { return !!s.flags.tilda_danced; }, t: t(`i walked home on one heel and i counted seven good steps. i have enrolled in the thursday class. i'm only telling you because you stood on the other side of my foot.`, `llegué a casa con un solo talón y conté siete pasos buenos. me inscribí en la clase del jueves. solo te lo cuento porque estuviste del otro lado de mi pie.`, `cheguei em casa num calcanhar só e contei sete passos bons. me matriculei na aula de quinta. só te conto porque você ficou do outro lado do meu pé.`) });
  }
})();

/* EXCUSE ME — story v23: fifteen new people, part one. The item layer (fourteen things to carry, all inside the pockets the game
   already has: no new bar, no new currency) and the five humorous characters: COLIN (the spot), GRETCHEN (the exchange),
   BARNABY (the trick), TEODORA (the vow) and HENRIK (the jug). The flirts are in story_v24.js, the hostile people and
   THE RIGHT QUEUE side quest in story_v25.js. Every gain sits on a once-node, a flag or a cooldown, so nobody can be farmed. */
'use strict';
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
      st: { branch: [{ req: { flag: 'colin_done' }, to: 'again' }, { req: function () { return true; }, to: 'a' }] },
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
        once: true, do: { flag: 'colin_done', call: 'colin_gift' }, next: null
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
        do: { soc: 2, flag: 'gretchen_rec', call: 'gretchen_rec_give' },
        choices: [K('care', t(`"Thank you for the receipt."`, `«Gracias por el recibo».`, `«Obrigado pelo recibo».`), { free: true, next: null, react: t(`"Nobody thanks the receipt. You are on the right track."`, `«Nadie agradece el recibo. Vas por buen camino».`, `«Ninguém agradece o recibo. Você tá no caminho certo».`) })]
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
      st: { branch: [{ req: { flag: 'henrik_done' }, to: 'again' }, { req: function () { return true; }, to: 'a' }] },
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
        choices: [K('care', t(`Finish the third.`, `Terminar el tercero.`, `Terminar o terceiro.`), { do: { fun: 3, time: 6 }, next: 'gift' })]
      },
      gift: {
        text: t(`Henrik refills your bottle from the jug. "A full bottle. And two sachets, in case you're ever less well than your schedule. Mix with a sip, not with a mood."`, `Henrik llena tu botella de la jarra. «Una botella llena. Y dos sobres, por si alguna vez estás peor que tu horario. Mezcla con un sorbo, no con un estado de ánimo».`, `O Henrik enche sua garrafa da jarra. «Uma garrafa cheia. E dois sachês, caso você fique pior que o seu cronograma. Mistura com um gole, não com um humor».`),
        once: true, do: { flag: 'henrik_done', call: 'henrik_gift', time: 4 }, next: null
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

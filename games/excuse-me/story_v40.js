/* EXCUSE ME — story v40: MARU IS HER OWN PERSON (and so, in the small things, are Benjamin and Fernando).
   Until now the group followed you through every door. Now:
   1. PLACES THEY DO NOT FOLLOW: the dark room, backstage, the toilets once the mission is over, the quiet room while you deal with the pill,
      and in the flat the master bedroom, the coats room and the bathroom. They wait where you left them and fall back into step when you
      come back (or find you after a while). `s.mu.wait`.
   2. ERRANDS: now and then Maru leaves your side for ten minutes or so (water, air, one song) and comes back on her own. Never while a
      mission needs the whole group (the toilets, the drop, the dance round, the roof). You can find her and ask her to come early.
   3. THE ROOF: when the closing set opens she goes up first and saves a spot at the rail.
   4. THE AFTER: Maru has her own night. After the house rules she helps Dot in the kitchen, then dances without counting anybody, then
      takes a call on the balcony (the news she promised to tell you first stays hers). She comes back for THE QUESTION. You can talk to
      her where she is; she is not waiting for you.
   Everything is seeded, so BEGIN AGAIN repeats it. Test hook: `s.flags.maru_hold` switches the errands and the beats off.
   Loads after story_v39.js and before compact.js. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, S = EM.scripts, D = EM.DIALOGUES, story = EM.story, AF = EM.AF, Z = EM.zones;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const FR = EM.FRIENDS;
  const NM = { maru: ['LUISA', 'LUISA', 'LUISA'], dani: ['BENJAMIN', 'BENJAMIN', 'BENJAMIN'], tato: ['FERNANDO', 'FEÑA', 'FERNANDO'] };
  const gen = function (f, en, es, pt) { return t(en.replace(/\{n\}/g, NM[f][0]), es.replace(/\{n\}/g, NM[f][1]), pt.replace(/\{n\}/g, NM[f][2])); };
  const MU = function (s) { return s.mu || (s.mu = { wait: {}, brk: null, last: -999, n: 0, prev: null, b: {} }); };
  const Qd = function (s, id) { return s.quests[id] === 'done'; };
  const inParty = function (s, f) { return s.party.indexOf(f) !== -1; };
  const frozen = function (s) { return !!(s.flags.friends_stick || s.flags.maru_hold); };
  /* a mission that needs the whole group at your side keeps everyone close */
  const NEEDS = ['q2', 'q3', 'q4', 'q7', 'q10', 'q9', 'q13'];
  const needs = function (s) { return NEEDS.some(function (q) { return s.quests[q] === 'active'; }); };

  /* the spots where a friend who is not with you stands (the engine reads friendAt[zone id] first) */
  if (Z.a_living) Z.a_living.friendAt.a_living = { x: 13.2, y: 5 };
  if (Z.a_kitchen) Z.a_kitchen.friendAt.a_kitchen = { x: 4, y: 4 };
  if (Z.a_balcony) Z.a_balcony.friendAt.a_balcony = { x: 13.6, y: 4.4 };
  if (Z.rooftop) Z.rooftop.friendAt.rooftop = { x: 14, y: 6 };

  /* ============================================================ 1. PLACES THEY DO NOT FOLLOW */
  const NOFOLLOW = {
    darkroom: function () { return true; },
    backstage: function () { return true; },
    welfare: function (s) { return s.quests.q5 === 'active'; },
    restrooms: function (s) { return !(s.quests.q2 === 'active' || s.quests.q3 === 'active' || s.quests.q4 === 'active'); },
    a_master: function () { return true; },
    a_bedroom: function () { return true; },
    a_bath: function () { return true; }
  };
  /* what Maru says at each door, and what the others say */
  const MARU_STAYS = {
    darkroom: t(`LUISA stops at the curtain. "This one's yours. I'll be on the main floor, counting nothing." She mimes locking her lips.`, `LUISA se detiene en la cortina. «Este es tuyo. Estaré en la pista, sin contar nada». Hace como que cierra los labios con llave.`, `A LUISA para na cortina. «Esse é seu. Vou ficar na pista, sem contar nada». Ela finge trancar os lábios.`),
    backstage: t(`LUISA, at the door marked STAFF: "I'm not going in there. It has clipboard energy. Go on."`, `LUISA, en la puerta que dice STAFF: «Yo ahí no entro. Tiene energía de carpeta. Anda».`, `A LUISA, na porta que diz STAFF: «Eu não entro aí. Tem energia de prancheta. Vai lá».`),
    welfare: t(`LUISA stays at the door of the quiet room. "The pill is yours, Benjamin's and Isi's business. I'll hold the door and do my silent worrying out here."`, `LUISA se queda en la puerta de la sala tranquila. «La pastilla es asunto tuyo, de Benjamin y de Isi. Yo cuido la puerta y me preocupo en silencio aquí afuera».`, `A LUISA fica na porta da sala de calma. «O comprimido é assunto seu, do Benjamin e da Isi. Eu seguro a porta e me preocupo em silêncio aqui fora».`),
    restrooms: t(`LUISA waits outside the toilets. "Some things we do alone. I'll be by the sinks of life."`, `LUISA espera afuera de los baños. «Hay cosas que se hacen solo. Estaré junto a los lavamanos de la vida».`, `A LUISA espera fora dos banheiros. «Tem coisas que a gente faz sozinho. Vou ficar nas pias da vida».`),
    a_master: t(`LUISA, from the sofa: "That door is all yours. Text me if it goes well."`, `LUISA, desde el sofá: «Esa puerta es toda tuya. Escríbeme si sale bien».`, `A LUISA, do sofá: «Essa porta é toda sua. Me manda mensagem se for bom».`),
    a_bedroom: t(`LUISA stays in the doorway. "Fewer people is kinder. You go."`, `LUISA se queda en la puerta. «Menos gente es más amable. Ve tú».`, `A LUISA fica na porta. «Menos gente é mais gentil. Vai você».`),
    a_bath: t(`LUISA: "It's a one-person room. I'll be out here."`, `LUISA: «Es un cuarto para una persona. Aquí afuera estaré».`, `A LUISA: «É um banheiro pra uma pessoa. Vou ficar aqui fora».`)
  };
  const OTHER_STAYS = function (f, zone) {
    if (f === 'dani' && zone === 'darkroom') return t(`BENJAMIN peers past the curtain, sniffs the air and withdraws with great dignity. "I'll be at the bar being interesting. Go."`, `BENJAMIN se asoma por la cortina, huele el aire y se retira con gran dignidad. «Estaré en la barra siendo interesante. Ve».`, `O BENJAMIN espia pela cortina, cheira o ar e se retira com muita dignidade. «Vou ficar no bar sendo interessante. Vai».`);
    return gen(f, `{n} stays outside. "Go on. I'll be right here."`, `{n} se queda afuera. «Ve. Aquí estoy».`, `{n} fica do lado de fora. «Vai. Tô aqui».`);
  };
  const BACK = {
    darkroom: t(`Luisa is exactly where you left her, leaning on the wall with two waters. "Good?" "Good." "Don't tell me anything until Tuesday." (A bottle of water.)`, `Luisa está exactamente donde la dejaste, apoyada en la pared con dos aguas. «¿Bien?» «Bien». «No me cuentes nada hasta el martes». (Una botella de agua.)`, `A Luisa tá exatamente onde você deixou, encostada na parede com duas águas. «Bom?» «Bom». «Não me conta nada até terça». (Uma garrafa de água.)`),
    ahead: t(`Luisa waves from the rail, one arm over her head. "I saved us a spot. Nobody has stood in it. I checked. Twice."`, `Luisa saluda desde la baranda con un brazo en alto. «Les guardé un lugar. Nadie se ha parado ahí. Lo revisé. Dos veces».`, `A Luisa acena do parapeito com um braço pra cima. «Guardei um lugar pra gente. Ninguém ficou nele. Eu conferi. Duas vezes».`)
  };
  const BACK_GEN = function (f) { return gen(f, `{n} falls back into step beside you.`, `{n} vuelve a caminar a tu lado.`, `{n} volta a andar do seu lado.`); };

  const rejoin = function (s, f, why) {
    const m = MU(s);
    delete m.wait[f];
    if (!inParty(s, f)) L.join(f);
    const line = why === 'darkroom' && f === 'maru' ? BACK.darkroom : (why === 'ahead' && f === 'maru' ? BACK.ahead : BACK_GEN(f));
    if (why === 'darkroom' && f === 'maru') s.items.water = Math.min(3, (s.items.water || 0) + 1);
    U.toast({ icon: 'heart', kind: 'good', ms: 6000, text: line });
  };

  const enter0 = story.enter;
  story.enter = function (zone) {
    const s = EM.state;
    if (!s) { enter0(zone); return; }
    const m = MU(s), prev = m.prev;
    /* those who waited here fall back into step before anything else in the room reacts to them */
    FR.forEach(function (f) { const w = m.wait[f]; if (w && w.zone === zone && !frozen(s)) rejoin(s, f, w.why); });
    enter0(zone);
    /* then the doors they do not walk through */
    if (!frozen(s) && NOFOLLOW[zone] && NOFOLLOW[zone](s) && prev && prev !== zone) {
      const park = EM.zones[prev] && Object.keys(EM.zones[prev].friendAt).length ? prev : 'main';
      FR.forEach(function (f) {
        if (!inParty(s, f)) return;
        if ((zone === 'darkroom' && f === 'tato') || (zone === 'welfare' && f !== 'maru')) return; /* Feña has his own dark room scene; the pill needs Benjamin */
        L.leave(f, park); m.wait[f] = { zone: park, since: s.time, why: zone };
        U.toast({ icon: 'eyes', kind: 'info', ms: 6200, text: f === 'maru' ? MARU_STAYS[zone] : OTHER_STAYS(f, zone) });
      });
    }
    m.prev = zone;
  };

  /* ============================================================ 2. ERRANDS: Maru leaves your side for a while */
  const KINDS = [
    { k: 'water', where: 'main', dur: 9,
      go: t(`LUISA: "I'm getting water. Stay put. Actually don't, but nothing alarming."`, `LUISA: «Voy por agua. Quédate aquí. O no, pero nada alarmante».`, `LUISA: «Vou pegar água. Fica aqui. Ou não, mas nada alarmante».`),
      back: t(`Luisa is back with a cold bottle, pressing it into your hand. "You looked thirsty. I'm psychic about this." (A bottle of water.)`, `Luisa vuelve con una botella fría y te la pone en la mano. «Se te veía con sed. Para esto soy psíquica». (Una botella de agua.)`, `A Luisa volta com uma garrafa gelada e põe na sua mão. «Você tava com cara de sede. Pra isso eu sou vidente». (Uma garrafa de água.)`) },
    { k: 'air', where: 'courtyard', dur: 11,
      go: t(`LUISA: "Five minutes of air. Alone. I love you. Go away."`, `LUISA: «Cinco minutos de aire. Sola. Te quiero. Vete».`, `LUISA: «Cinco minutos de ar. Sozinha. Te amo. Vai».`),
      back: t(`Luisa comes back with her shoulders an inch lower. "Better. Where were we?"`, `Luisa vuelve con los hombros un dedo más abajo. «Mejor. ¿Dónde íbamos?»`, `A Luisa volta com os ombros um dedo mais baixos. «Melhor. Onde a gente tava?»`) },
    { k: 'song', where: 'main', dur: 12,
      go: t(`LUISA: "This is my song. Don't follow me."`, `LUISA: «Esta es mi canción. No me sigas».`, `LUISA: «Essa é a minha música. Não me segue».`),
      back: t(`Luisa, glowing and out of breath: "Okay. I'm back. I was gone for a whole song and nobody died."`, `Luisa, radiante y sin aire: «Listo. Volví. Estuve fuera una canción entera y nadie se murió».`, `A Luisa, radiante e sem fôlego: «Pronto. Voltei. Fiquei fora uma música inteira e ninguém morreu».`) }
  ];
  const kindOf = function (k) { return KINDS.filter(function (x) { return x.k === k; })[0]; };
  const okZone = { main: 1, foyer: 1, courtyard: 1, attic: 1, tunnel: 1 };
  const endBreak = function (s, early) {
    const m = MU(s), b = m.brk; if (!b) return;
    m.brk = null; L.join('maru');
    const kd = kindOf(b.k);
    if (!early) {
      if (b.k === 'water') s.items.water = Math.min(3, (s.items.water || 0) + 1);
      if (b.k === 'song') L.apply({ fun: 3 });
      if (b.k === 'air') L.apply({ soc: 2 });
      U.toast({ icon: 'heart', kind: 'good', ms: 6200, text: kd.back });
    } else U.toast({ icon: 'heart', kind: 'info', ms: 4200, text: BACK_GEN('maru') });
  };
  S.mu_end = function () { endBreak(EM.state, true); };

  const min0 = L.minute;
  L.minute = function () {
    min0.apply(this, arguments);
    const s = EM.state; if (!s || s.ended) return;
    const m = MU(s);
    /* anyone who waited too long finds you */
    FR.forEach(function (f) {
      const w = m.wait[f];
      if (w && s.time - w.since >= 25 && !U.D && U.mode === 'play' && s.zone !== w.zone) {
        delete m.wait[f]; if (!inParty(s, f)) L.join(f);
        U.toast({ icon: 'heart', kind: 'info', ms: 5600, text: gen(f, `{n} finds you in the crowd. "There you are. I got tired of waiting."`, `{n} te encuentra entre la gente. «Ahí estás. Me cansé de esperar».`, `{n} te acha no meio da galera. «Aí está você. Cansei de esperar».`) });
      }
    });
    if (frozen(s)) return;
    /* an errand ends by itself, or when a mission needs her */
    if (m.brk && (s.time >= m.brk.until || needs(s)) && !U.D && U.mode === 'play') endBreak(s, false);
    /* the roof: she goes up first and saves a spot */
    if (s.quests.q9 === 'active' && s.flags.roof_open && !s.after && !s.flags.after_go && inParty(s, 'maru') && !m.b.ahead && s.zone !== 'rooftop' && !U.D && U.mode === 'play') {
      m.b.ahead = true; m.brk = null;
      L.leave('maru', 'rooftop'); m.wait.maru = { zone: 'rooftop', since: s.time, why: 'ahead' };
      U.toast({ icon: 'star', kind: 'info', ms: 6500, text: t(`LUISA: "The roof is open. I'll go up and save us a spot at the rail. Don't be long."`, `LUISA: «El techo está abierto. Subo a guardarnos un lugar en la baranda. No tardes».`, `LUISA: «O terraço abriu. Vou subir e guardar um lugar pra gente no parapeito. Não demora».`) });
      return;
    }
    /* an errand starts: only when nothing needs the group, in the club, in a room she can wander from */
    if (s.after || m.brk || !inParty(s, 'maru') || s.away.maru || needs(s) || U.D || U.mode !== 'play' || !okZone[s.zone] || s.time < 100 || m.n >= 4 || s.time - m.last < 45) return;
    const slot = Math.floor(s.time / 15);
    if (EM.hash2((s.seed | 0) + 4040, slot, 7) > 0.34) return;
    const kd = KINDS[Math.floor(EM.hash2((s.seed | 0) + 4041, slot, 9) * KINDS.length) % KINDS.length];
    const where = kd.where;
    L.leave('maru', where); m.brk = { k: kd.k, until: s.time + kd.dur, zone: where }; m.last = s.time; m.n++;
    s.flags.maru_breath = true;
    U.toast({ icon: 'eyes', kind: 'info', ms: 6200, text: kd.go });
  };

  /* she is a person, not a pet: if you find her, she answers in her own voice */
  const fd0 = story.friendDialogue;
  story.friendDialogue = function (id, s) {
    const m = s && s.mu;
    if (id === 'maru' && m && m.brk) return 'maru_break_found';
    if (id === 'maru' && s.after && m && m.at && s.away.maru && AF && AF.isFlat(s.zone)) return 'maru_af_' + m.at;
    return fd0(id, s);
  };
  D.maru_break_found = {
    who: 'maru', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GENTE'), start: 'a', nodes: {
      a: {
        text: t(`Luisa is mid-thought, one foot still on the beat. "Five more minutes? I'm having a moment. Don't make it a headcount."`, `Luisa está a medio pensamiento, con un pie todavía en el ritmo. «¿Cinco minutos más? Estoy en mi momento. No lo conviertas en un conteo».`, `A Luisa tá no meio de um pensamento, com um pé ainda na batida. «Mais cinco minutos? Tô num momento. Não transforma isso em contagem».`),
        choices: [
          K('chill', t(`"Take your time."`, `«Tómate tu tiempo».`, `«Leva o tempo que precisar».`), { free: true, do: { bond: { maru: 1 }, soc: 1 }, next: null }),
          K('care', t(`"Come with me now."`, `«Ven conmigo ahora».`, `«Vem comigo agora».`), { free: true, call: 'mu_end', next: null })
        ]
      }
    }
  };

  /* ============================================================ 4. THE AFTER: Maru's own night */
  if (AF && AF.schedule) {
    const BEAT = {
      kitchen: t(`LUISA: "Dot just gave me a job. A job that isn't counting. I'm going to the kitchen before she changes her mind."`, `LUISA: «Dot me acaba de dar un trabajo. Uno que no es contar. Voy a la cocina antes de que cambie de idea».`, `LUISA: «A Dot acabou de me dar um trabalho. Um que não é contar. Vou pra cozinha antes que ela mude de ideia».`),
      dance: t(`Luisa drifts toward the rug with her eyes half shut. "Don't come with me. If you count me I'll know."`, `Luisa se desliza hacia la alfombra con los ojos medio cerrados. «No vengas conmigo. Si me cuentas, lo voy a notar».`, `A Luisa vai em direção ao tapete com os olhos meio fechados. «Não vem comigo. Se você me contar, eu vou saber».`),
      balcony: t(`Luisa checks her phone, takes a breath and heads for the balcony. "Five minutes. It's the thing I said I'd tell you first. Not yet."`, `Luisa mira el celular, respira y va hacia el balcón. «Cinco minutos. Es lo que dije que te diría primero. Todavía no».`, `A Luisa olha o celular, respira e vai pra varanda. «Cinco minutos. É a coisa que eu disse que te contava primeiro. Ainda não».`),
      back: t(`Luisa comes in from the balcony, face washed, phone away. "Okay. I'm back. I'm not counting. I'm just here."`, `Luisa entra desde el balcón, con la cara lavada y el celular guardado. «Listo. Volví. No estoy contando. Solo estoy aquí».`, `A Luisa entra da varanda, de cara lavada e celular guardado. «Pronto. Voltei. Não tô contando. Só tô aqui».`)
    };
    const go = function (s, m, at, zone, line) {
      m.at = at; s.flags.maru_uncounted = true;
      if (inParty(s, 'maru')) { L.leave('maru', zone); U.toast({ icon: 'heart', kind: 'info', ms: 6800, text: line }); }
      else L.leave('maru', zone);
    };
    const sch1 = AF.schedule;
    AF.schedule = function (s) {
      const a = s.after;
      if (a && a.f && a.f.maru && a.f.maru.st === 'here' && !frozen(s)) {
        const m = MU(s), f = s.flags, q = s.quests, here = inParty(s, 'maru');
        if (f.af_rules && !m.b.k && here && !Qd(s, 'q_af3')) { m.b.k = true; go(s, m, 'kitchen', 'a_kitchen', BEAT.kitchen); }
        else if (Qd(s, 'q_af3') && m.b.k && !m.b.d && !Qd(s, 'q_af4')) { m.b.d = true; go(s, m, 'dance', 'a_living', BEAT.dance); }
        else if (q.q_af4 === 'active' && m.b.d && !m.b.c && !Qd(s, 'q_af4')) { m.b.c = true; go(s, m, 'balcony', 'a_balcony', BEAT.balcony); }
        /* she is back, on her own, before THE QUESTION (it needs her) */
        if (Qd(s, 'q_af4') && m.at && !here && s.away.maru) {
          m.at = null; L.join('maru'); U.toast({ icon: 'heart', kind: 'good', ms: 6500, text: BEAT.back });
        }
      }
      sch1(s);
    };
    D.maru_af_kitchen = {
      who: 'maru', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GENTE'), start: 'a', nodes: {
        a: {
          text: t(`Luisa has an apron on over her jacket and a spatula she was handed half a minute ago. "Dot gave me a job. A job that is not counting." She flips something. "I flipped it. Nobody died."`, `Luisa tiene un delantal sobre la chaqueta y una espátula que le dieron hace medio minuto. «Dot me dio un trabajo. Un trabajo que no es contar». Da vuelta algo. «Lo di vuelta. Nadie se murió».`, `A Luisa tá de avental por cima da jaqueta e com uma espátula que lhe deram meio minuto atrás. «A Dot me deu um trabalho. Um trabalho que não é contar». Ela vira alguma coisa. «Virei. Ninguém morreu».`),
          choices: [
            K('care', t(`"You look happy."`, `«Te ves feliz».`, `«Você parece feliz».`), { next: 'b' }),
            K('ask', t(`"Do you want me to stay?"`, `«¿Quieres que me quede?»`, `«Quer que eu fique?»`), { next: 'c' }),
            K('chill', t(`"Go on. I'll be around."`, `«Sigue. Ando por ahí».`, `«Continua. Tô por perto».`), { free: true, next: null })
          ]
        },
        b: { text: t(`"I lost track of where you were for two whole minutes. Two. I did not die." She points the spatula at you. "Don't tell anyone, I'll lose my reputation."`, `«Perdí la pista de dónde estabas por dos minutos enteros. Dos. No me morí». Te apunta con la espátula. «No se lo cuentes a nadie, pierdo la reputación».`, `«Perdi a noção de onde você tava por dois minutos inteiros. Dois. Não morri». Ela aponta a espátula pra você. «Não conta pra ninguém, eu perco a reputação».`), once: true, do: { bond: { maru: 1 }, soc: 2 }, next: null },
        c: { text: t(`"No. Go. Be useful somewhere. I'll find you when the toast runs out."`, `«No. Ve. Sé útil en otro lado. Te busco cuando se acaben las tostadas».`, `«Não. Vai. Seja útil em outro lugar. Eu te acho quando a torrada acabar».`), do: { soc: 1 }, next: null }
      }
    };
    D.maru_af_dance = {
      who: 'maru', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GENTE'), start: 'a', nodes: {
        a: {
          text: t(`Luisa is dancing in the middle of the rug with her eyes shut and one hand in the air, among people who have no idea she organises their whole lives. She opens one eye at you. "Not now. This is my song." She closes it.`, `Luisa baila en medio de la alfombra con los ojos cerrados y una mano en alto, entre gente que no tiene idea de que les organiza la vida entera. Te abre un ojo. «Ahora no. Esta es mi canción». Lo cierra.`, `A Luisa dança no meio do tapete de olhos fechados e uma mão pra cima, no meio de gente que não faz ideia de que ela organiza a vida de todo mundo. Ela abre um olho pra você. «Agora não. Essa é a minha música». Fecha de novo.`),
          choices: [
            K('care', t(`Dance next to her for one song.`, `Bailar a su lado una canción.`, `Dançar do lado dela uma música.`), { do: { fun: 4, time: 6, bond: { maru: 1 } }, next: 'b' }),
            K('chill', t(`Leave her to it.`, `Dejarla en lo suyo.`, `Deixar ela na dela.`), { free: true, next: null })
          ]
        },
        b: { text: t(`She doesn't count anyone for the whole length of the song. You can tell. She is a different shape.`, `No cuenta a nadie durante toda la canción. Se nota. Tiene otra forma.`, `Ela não conta ninguém durante a música inteira. Dá pra ver. Ela tem outro formato.`), next: null }
      }
    };
    D.maru_af_balcony = {
      who: 'maru', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GENTE'), start: 'a', nodes: {
        a: {
          text: t(`Luisa is on the balcony with the phone face down on the rail, looking at the street. "Don't ask me yet. It's the thing I said I'd tell you first. It isn't today. It's close." She breathes out. "Go do your thing. I'll be in for the hard part."`, `Luisa está en el balcón con el celular boca abajo en la baranda, mirando la calle. «No me preguntes todavía. Es lo que dije que te contaría primero. No es hoy. Está cerca». Suelta el aire. «Ve a lo tuyo. Entro para la parte difícil».`, `A Luisa tá na varanda com o celular virado pra baixo no parapeito, olhando a rua. «Não pergunta ainda. É a coisa que eu disse que te contava primeiro. Não é hoje. Tá perto». Ela solta o ar. «Vai fazer o que você tem que fazer. Eu entro pra parte difícil».`),
          choices: [
            K('care', t(`"I'm here when you want."`, `«Aquí estoy cuando quieras».`, `«Tô aqui quando você quiser».`), { do: { soc: 2, bond: { maru: 1 } }, next: null }),
            K('chill', t(`"Take your hour."`, `«Tómate tu hora».`, `«Leva a sua hora».`), { free: true, next: null })
          ]
        }
      }
    };
  }

  /* the morning after remembers it */
  if (story.morningRefs) {
    story.morningRefs.push({ id: 'maru_uncounted', who: 'maru', ok: function (s) { return !!s.flags.maru_uncounted; }, t: t(`Update: I danced a whole song without counting anyone. I'm treating it as medicine. Also Dot taught me her toast. Nobody has been lost. I checked once, only once.`, `Actualización: bailé una canción entera sin contar a nadie. Lo tomo como medicina. Además Dot me enseñó sus tostadas. Nadie se perdió. Revisé una vez, solo una.`, `Atualização: dancei uma música inteira sem contar ninguém. Tô tratando como remédio. Além disso a Dot me ensinou a torrada dela. Ninguém se perdeu. Conferi uma vez, só uma.`) });
    story.morningRefs.push({ id: 'maru_breath', who: 'maru', ok: function (s) { return !!s.flags.maru_breath && !s.flags.maru_uncounted; }, t: t(`Thank you for letting me walk off a few times last night. I always come back. I just have to be allowed not to.`, `Gracias por dejarme alejarme unas veces anoche. Siempre vuelvo. Solo necesito que me dejen no hacerlo.`, `Obrigada por me deixar sair andando algumas vezes ontem. Eu sempre volto. Só preciso que me deixem não voltar.`) });
  }
})();

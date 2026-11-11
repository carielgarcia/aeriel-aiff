/* EXCUSE ME — story v28: the game's goal, checked. Honour rave culture, promote good behaviour, show the positives and the challenges.
   1. WEIRDNESS is trouble, not style (story_v16, logic, tutorial: accessories and sunglasses no longer raise it).
   2. Drugs have consequences you can feel: redosing and overheating, too much water, alcohol on top, the aftermath of coke and ketamine,
      a morning after that says how you feel, and Isi explaining all of it.
   3. Hugo tells where the floor comes from (WHERE THE FLOOR COMES FROM, `sq_roots`): Detroit, Chicago, Berlin and the free parties.
   4. The challenge the raid stood for, at the club: a noise complaint and a late licence under review (`sq_licence`), solved by
      listening to the neighbour, not by shouting at her. The raid itself stays switched off. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`"Later."`, `«Después».`, `«Depois».`), { free: true, next: null }); };
  const IT = EM.items16;
  const look = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  const arr = function (x) { return [].concat(x); };
  const mk = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };
  const high = function (s) { return !!(s.fx.mdma || s.fx.meth || s.fx.coke || s.fx.ket); };

  /* ============================================================ 2. DRUGS HAVE CONSEQUENCES YOU CAN FEEL */
  EM.FXNAME.hot = t('OVERHEATING', 'SOBRECALENTADO', 'SUPERAQUECIDO');
  const toastOnce = function (key, gap, o) {
    const s = EM.state; s.once28 = s.once28 || {};
    if (s.once28[key] !== undefined && s.time - s.once28[key] < gap) return;
    s.once28[key] = s.time; U.toast(o);
  };
  /* a second dose on top of a first: the body is still working */
  const ts0 = story.takeStash;
  story.takeStash = function (i) {
    const s = EM.state, e = (s.stash || [])[i], again = !!(e && e.kind === 'mdma' && s.fx.mdma > 0);
    ts0(i);
    if (!again || s.ended) return;
    s.flags.redosed = true;
    L.apply({ hp: -6, fun: 2 });
    L.startFx('hot', 60);
    U.toast({ icon: 'skull', kind: 'bad', ms: 7000, text: t(`You redosed on top of the first. It was not finished yet. Your temperature climbs and your jaw locks. Water, shade, and a long sit.`, `Tomaste otra encima de la primera. Todavía no había terminado. Te sube la temperatura y se te traba la mandíbula. Agua, sombra y un rato largo sentado.`, `Você tomou outra em cima da primeira. Ela ainda não tinha acabado. Sua temperatura sobe e a mandíbula trava. Água, sombra e um bom tempo sentado.`) });
  };
  /* alcohol on top of anything: two jobs done badly */
  const ap1 = L.apply;
  L.apply = function (e, ctx) {
    const s = EM.state, on = !!(e && e.drink && s && high(s));
    const ket = !!(on && s.fx.ket);
    const r = ap1.call(this, e, ctx);
    if (on && !s.ended) {
      s.flags.mixed_alc = true;
      ap1.call(this, { hp: -3 * e.drink });
      toastOnce('mix', 15, { icon: 'cross', kind: 'bad', ms: 6500, text: t(`Alcohol on top of what you took: the body is doing two jobs badly. Isi will tell you the same.`, `Alcohol encima de lo que tomaste: el cuerpo hace dos trabajos mal. Isi te dirá lo mismo.`, `Álcool em cima do que você tomou: o corpo faz dois trabalhos mal. A Isi vai te dizer o mesmo.`) });
      if (ket && Math.random() < 0.35 && !s.pendingFaint) { s.pendingFaint = s.time + 8 + Math.floor(Math.random() * 6); s.pendingFaintKind = 'ket'; }
    }
    return r;
  };
  /* too much water too fast is not safe either */
  const dr0 = EM.drink;
  EM.drink = function () {
    const ok = dr0.apply(this, arguments), s = EM.state;
    if (ok && s && s.fx.mdma) {
      s.sipLog = (s.sipLog || []).filter(function (m) { return s.time - m < 60; });
      s.sipLog.push(s.time);
      if (s.sipLog.length > 8) {
        s.sipLog = [];
        L.apply({ hp: -4, fun: -2 });
        U.toast({ icon: 'water', kind: 'bad', ms: 6500, text: t(`Too much water too fast. Your head swims. Sip, don't chug: about a bottle an hour while you dance, no more.`, `Demasiada agua demasiado rápido. Se te va la cabeza. Sorbos, no tragos largos: más o menos una botella por hora bailando, no más.`, `Água demais rápido demais. Sua cabeça gira. Goles, não golaços: mais ou menos uma garrafa por hora dançando, não mais.`) });
      }
    }
    return ok;
  };
  const minute0 = L.minute;
  L.minute = function () {
    const s0 = EM.state;
    const had = s0 ? { coke: !!s0.fx.coke, ket: !!s0.fx.ket } : {};
    minute0();
    const s = EM.state; if (!s || s.ended) return;
    /* the aftermath of the short drugs */
    if (had.coke && !s.fx.coke) { L.startFx('comedown', 45); U.toast({ icon: 'cross', kind: 'bad', ms: 6000, text: t(`The edge dulls and the wanting starts. That is the drug talking, not you.`, `El filo se apaga y empieza el querer más. Eso lo dice la droga, no tú.`, `O fio embota e começa a vontade de mais. Quem fala é a droga, não você.`) }); }
    if (had.ket && !s.fx.ket) { L.startFx('comedown', 30); U.toast({ icon: 'cross', kind: 'info', ms: 6000, text: t(`The drift ends. Your body feels like it was away and has come back with a headache.`, `Termina la deriva. Tu cuerpo siente que estuvo lejos y volvió con dolor de cabeza.`, `A deriva acaba. Seu corpo sente que esteve longe e voltou com dor de cabeça.`) }); }
    /* dancing hot on MDMA without water */
    if (s.fx.mdma && s.thirst > 50 && EM.engine && EM.engine.dancing && !s.fx.hot) {
      L.startFx('hot', 45);
      toastOnce('hot', 30, { icon: 'cross', kind: 'bad', ms: 6500, text: t(`You are overheating. Water, then somewhere cool and quiet. The quiet room is for this.`, `Te estás sobrecalentando. Agua y luego un lugar fresco y tranquilo. La sala tranquila es para esto.`, `Você tá superaquecendo. Água e depois um lugar fresco e calmo. A sala de calma é pra isso.`) });
    }
    if (s.fx.hot) {
      L.stat('hp', -0.15); L.stat('fun', -0.05);
      if (s.thirst < 10) s.fx.hot -= 3;
      const z = EM.zones[s.zone]; if (z && z.quiet) s.fx.hot -= 2;
    }
  };
  /* Isi explains it in her own plain voice */
  const SAFE = {
    text: [
      t(`"More? Plainly: don't chase it. Wait at least a couple of hours, and if you must, take less than the first. The second one never feels the same as the first. It only costs more."`, `«¿Más? Claro: no la persigas. Espera un par de horas y, si de verdad quieres, toma menos que la primera. La segunda nunca se siente como la primera. Solo cuesta más».`, `«Mais? Claro: não persiga. Espera umas duas horas e, se for tomar, toma menos que a primeira. A segunda nunca é igual à primeira. Só custa mais».`),
      t(`"Water: a sip, often. About a bottle an hour while you dance. Not litres. Too much water is its own emergency. If you're hot, sit down somewhere cool: the quiet room is cool."`, `«Agua: un sorbo, seguido. Más o menos una botella por hora bailando. No litros. Demasiada agua es su propia emergencia. Si tienes calor, siéntate en un lugar fresco: la sala tranquila es fresca».`, `«Água: um gole, sempre. Mais ou menos uma garrafa por hora dançando. Não litros. Água demais é uma emergência própria. Se tá com calor, senta num lugar fresco: a sala de calma é fresca».`),
      t(`"Alcohol on top doesn't make it better. It makes both worse, and with ketamine it can put you on the floor. And the day after is going to ask for its money. Eat. Sleep. Text somebody. I'm not a doctor. Teo is."`, `«El alcohol encima no mejora nada. Empeora las dos cosas y, con ketamina, te puede dejar en el piso. Y el día siguiente va a cobrar. Come. Duerme. Escríbele a alguien. No soy médica. Teo sí».`, `«Álcool em cima não melhora nada. Piora as duas coisas e, com ketamina, pode te deixar no chão. E o dia seguinte vai cobrar. Come. Dorme. Manda mensagem pra alguém. Não sou médica. O Teo é».`)
    ]
  };
  [D.nuri, D.nuri_after].forEach(function (d) {
    if (!d) return;
    d.nodes.safety = { text: SAFE.text, once: true, do: { soc: 2, flag: 'isi_safety' }, next: 'a' };
    d.nodes.a.choices.splice(1, 0, K('ask', t(`"Is it okay to take more, or to drink with it?"`, `«¿Está bien tomar más, o tomar alcohol con eso?»`, `«Pode tomar mais, ou beber junto?»`), { free: true, next: 'safety' }));
  });
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'after_feel', who: 'maru', ok: function (s) { return !!(s.flags.drug_taken || s.flags.took_stash); }, t: t(`how do you feel? i'm at the "everything is slightly too loud" stage. water, a real meal, a long sleep. tuesday is coming for all of us and it is not your fault, it is chemistry.`, `¿cómo te sientes? yo estoy en la etapa de «todo es un poco demasiado fuerte». agua, una comida de verdad, un sueño largo. el martes viene por todos y no es tu culpa, es química.`, `como você tá? eu tô na fase «tudo tá um pouco alto demais». água, uma refeição de verdade, um sono longo. a terça vem pra todo mundo e não é culpa sua, é química.`) });
    R.push({ id: 'after_mix', who: 'dani', ok: function (s) { return !!(s.flags.redosed || s.flags.mixed_alc); }, t: t(`i heard you redosed or mixed. not judging. i'm a capybara, i have no standing. just: next time, no. next time you tell me and i sit with you.`, `me enteré de que repetiste o mezclaste. no juzgo. soy un capibara, no tengo autoridad. solo: la próxima, no. la próxima me avisas y me siento contigo.`, `fiquei sabendo que você repetiu ou misturou. não tô julgando. sou uma capivara, não tenho autoridade. só: da próxima, não. da próxima você me avisa e eu sento com você.`) });
  }

  /* ============================================================ 3. WHERE THE FLOOR COMES FROM: Hugo */
  EM.QUESTS.sq_roots = {
    title: t('WHERE THE FLOOR COMES FROM', 'DE DÓNDE VIENE LA PISTA', 'DE ONDE VEM A PISTA'),
    desc: function (s) { return t(`Hugo, who has been dancing for decades, has three stories about where this floor comes from. ${mk(s, 'hugo_s1')} Detroit. ${mk(s, 'hugo_s2')} Chicago. ${mk(s, 'hugo_s3')} Berlin and the free parties.`, `Hugo, que baila desde hace décadas, tiene tres historias sobre de dónde viene esta pista. ${mk(s, 'hugo_s1')} Detroit. ${mk(s, 'hugo_s2')} Chicago. ${mk(s, 'hugo_s3')} Berlín y las fiestas libres.`, `O Hugo, que dança há décadas, tem três histórias sobre de onde vem essa pista. ${mk(s, 'hugo_s1')} Detroit. ${mk(s, 'hugo_s2')} Chicago. ${mk(s, 'hugo_s3')} Berlim e as festas livres.`); },
    doneText: t(`You know whose floor this is. Hugo stands a little taller.`, `Sabes de quién es esta pista. Hugo se para un poco más derecho.`, `Você sabe de quem é essa pista. O Hugo se endireita um pouco.`)
  };
  const H = D.hugo.nodes;
  H.roots_gate = { branch: [{ req: { flag: 'hugo_roots_open' }, to: 'roots' }, { req: function () { return true; }, to: 'roots_start' }] };
  H.roots_start = {
    text: t(`Hugo puts down his drink. "Sit. It's a long story and it isn't mine. It belongs to everybody who ever needed somewhere to dance. Pick a thread."`, `Hugo deja su vaso. «Siéntate. Es una historia larga y no es mía. Es de todos los que alguna vez necesitaron un lugar para bailar. Elige un hilo».`, `O Hugo larga o copo. «Senta. É uma história longa e não é minha. É de todo mundo que um dia precisou de um lugar pra dançar. Escolhe um fio».`),
    once: true, do: { flag: 'hugo_roots_open', quest: { sq_roots: 'active' } }, next: 'roots'
  };
  H.roots = {
    text: function (s) {
      const n = [1, 2, 3].filter(function (i) { return s.flags['hugo_s' + i]; }).length;
      return n >= 3 ? t(`"That's the three. One more question, if you want it: what do we owe it?"`, `«Esas son las tres. Una pregunta más, si quieres: ¿qué le debemos?»`, `«São as três. Mais uma pergunta, se quiser: o que a gente deve a isso?»`) : t(`"Pick a thread."`, `«Elige un hilo».`, `«Escolhe um fio».`);
    },
    choices: [
      K('ask', t(`"Detroit."`, `«Detroit».`, `«Detroit».`), { req: { no: 'hugo_s1' }, next: 'detroit', free: true }),
      K('ask', t(`"Chicago."`, `«Chicago».`, `«Chicago».`), { req: { no: 'hugo_s2' }, next: 'chicago', free: true }),
      K('ask', t(`"Berlin and the free parties."`, `«Berlín y las fiestas libres».`, `«Berlim e as festas livres».`), { req: { no: 'hugo_s3' }, next: 'berlin', free: true }),
      K('ask', t(`"What do we owe it?"`, `«¿Qué le debemos?»`, `«O que a gente deve a isso?»`), { req: function (s) { return !!(s.flags.hugo_s1 && s.flags.hugo_s2 && s.flags.hugo_s3); }, next: 'owe', free: true }),
      K('chill', t(`"Another time."`, `«Otra vez».`, `«Outra hora».`), { free: true, next: null })
    ]
  };
  H.detroit = {
    text: t(`"Detroit, early eighties. Three Black kids from Belleville, outside the city: Juan Atkins, Derrick May, Kevin Saunderson. They listened to Kraftwerk, funk and the radio, and they built something that had no name yet. They called it techno. A city that had been told it was finished made the sound of the future. Remember that when somebody tells you a place is finished."`, `«Detroit, principios de los ochenta. Tres chicos negros de Belleville, a las afueras: Juan Atkins, Derrick May, Kevin Saunderson. Escuchaban Kraftwerk, funk y la radio, y construyeron algo que todavía no tenía nombre. Lo llamaron techno. Una ciudad a la que le habían dicho que estaba terminada hizo el sonido del futuro. Acuérdate de eso cuando alguien te diga que un lugar está terminado».`, `«Detroit, começo dos anos oitenta. Três garotos negros de Belleville, na periferia: Juan Atkins, Derrick May, Kevin Saunderson. Ouviam Kraftwerk, funk e rádio, e construíram algo que ainda não tinha nome. Chamaram de techno. Uma cidade a quem tinham dito que estava acabada fez o som do futuro. Lembra disso quando alguém disser que um lugar acabou».`),
    once: true, do: { soc: 3, fun: 2, flag: 'hugo_s1', call: 'hugo_check' }, next: 'roots'
  };
  H.chicago = {
    text: t(`"Chicago. A club called the Warehouse, and a DJ named Frankie Knuckles. Black and queer dancers made house music a home, because the street outside was not one. Disco had been declared dead, so the people who loved it kept dancing, and the floor kept them alive. 'House' comes from the Warehouse, the story goes. Nobody is sure, and everybody tells it."`, `«Chicago. Un club llamado el Warehouse y un DJ llamado Frankie Knuckles. Gente negra y queer hizo de la música house un hogar, porque la calle no lo era. Habían declarado muerto al disco, así que quienes lo amaban siguieron bailando, y la pista los mantuvo vivos. 'House' viene del Warehouse, dice la historia. Nadie está seguro y todos la cuentan».`, `«Chicago. Um clube chamado Warehouse e um DJ chamado Frankie Knuckles. Gente negra e queer fez da house music um lar, porque a rua lá fora não era. A disco tinha sido declarada morta, então quem amava continuou dançando, e a pista manteve essas pessoas vivas. 'House' vem do Warehouse, diz a história. Ninguém tem certeza e todo mundo conta».`),
    once: true, do: { soc: 3, fun: 2, flag: 'hugo_s2', call: 'hugo_check' }, next: 'roots'
  };
  H.berlin = {
    text: t(`"Berlin, 1989. The Wall opens and the empty buildings are suddenly nobody's. People dance in them. England, a few years before: warehouse parties, and sound systems that came with the Caribbean communities. Then, in 1994, the English government wrote a law about 'repetitive beats'. A law about a kind of music. The free parties did not stop. Every free party since owes them."`, `«Berlín, 1989. Cae el Muro y los edificios vacíos de pronto no son de nadie. La gente baila en ellos. Inglaterra, unos años antes: fiestas en bodegas y sound systems que llegaron con las comunidades del Caribe. Luego, en 1994, el gobierno inglés escribió una ley sobre los 'ritmos repetitivos'. Una ley sobre un tipo de música. Las fiestas libres no pararon. Toda fiesta libre desde entonces se lo debe».`, `«Berlim, 1989. O Muro cai e os prédios vazios de repente não são de ninguém. As pessoas dançam neles. Inglaterra, uns anos antes: festas em galpões e sound systems que chegaram com as comunidades caribenhas. Depois, em 1994, o governo inglês escreveu uma lei sobre 'batidas repetitivas'. Uma lei sobre um tipo de música. As festas livres não pararam. Toda festa livre desde então deve isso a elas».`),
    once: true, do: { soc: 3, fun: 2, flag: 'hugo_s3', call: 'hugo_check' }, next: 'roots'
  };
  H.owe = {
    text: t(`"Three things. Remember who built the floor: Black, queer, Latino, working-class people who needed somewhere safe. Keep it safe for whoever comes next. And never let a floor be shut because of what it sounds like. That's why we ask first. That's why we look after each other."`, `«Tres cosas. Recuerda quién construyó la pista: gente negra, queer, latina y trabajadora que necesitaba un lugar seguro. Mantenla segura para quien venga después. Y nunca dejes que cierren una pista por cómo suena. Por eso preguntamos primero. Por eso nos cuidamos».`, `«Três coisas. Lembra quem construiu a pista: gente negra, queer, latina e trabalhadora que precisava de um lugar seguro. Mantém ela segura pra quem vier depois. E nunca deixa fecharem uma pista por causa do som que ela tem. É por isso que a gente pergunta primeiro. É por isso que a gente cuida um do outro».`),
    once: true, do: { soc: 4, fun: 3, care: 1, flag: 'hugo_roots' }, next: null
  };
  H.a.choices.splice(1, 0, K('ask', t(`"Where does all of this come from?"`, `«¿De dónde viene todo esto?»`, `«De onde vem tudo isso?»`), { free: true, next: 'roots_gate' }));
  S.hugo_check = function () {
    const s = EM.state;
    if (s.quests.sq_roots === 'active' && s.flags.hugo_s1 && s.flags.hugo_s2 && s.flags.hugo_s3) L.setQuest('sq_roots', 'done');
  };
  if (story.morningRefs) story.morningRefs.push({ id: 'hugo_roots', who: 'hugo', ok: function (s) { return !!s.flags.hugo_roots; }, t: t(`you asked where it all comes from. that made an old man's week. go dance. remember who built the floor.`, `preguntaste de dónde viene todo. eso le hizo la semana a un viejo. ve a bailar. recuerda quién construyó la pista.`, `você perguntou de onde vem tudo. isso fez a semana de um velho. vai dançar. lembra quem construiu a pista.`) });

  /* ============================================================ 4. THE LICENCE: the challenge, at the club */
  EM.CAST.valdes = { name: 'SRA. VALDÉS', look: look({ skin: 3, hair: 7, hc: 0, expr: 1, top: 6, tc: 8, bottom: 0, bc: 4, acc: 0, ac: 0 }) };
  EM.QUESTS.sq_licence = {
    title: t('THE LICENCE', 'LA LICENCIA', 'A LICENÇA'),
    desc: function (s) {
      return t(`A neighbour has complained about the noise and the council reviews the late licence on Monday. If it goes, the room goes, and the jobs with it. Ofelia needs three letters. ${mk(s, 'lic_hugo')} Hugo (main floor). ${mk(s, 'lic_luca')} Luca (coat check). ${mk(s, 'lic_neigh')} The neighbour herself, Sra. Valdés (the pavement outside). Then tell Ofelia.`, `Una vecina se quejó del ruido y el consejo revisa la licencia nocturna el lunes. Si se cae, se cae el local y los empleos con él. Ofelia necesita tres cartas. ${mk(s, 'lic_hugo')} Hugo (pista principal). ${mk(s, 'lic_luca')} Luca (guardarropa). ${mk(s, 'lic_neigh')} La propia vecina, la Sra. Valdés (la banqueta de afuera). Luego avísale a Ofelia.`, `Uma vizinha reclamou do barulho e a prefeitura revisa a licença noturna na segunda. Se cair, cai o lugar, e os empregos junto. A Ofelia precisa de três cartas. ${mk(s, 'lic_hugo')} Hugo (pista principal). ${mk(s, 'lic_luca')} Luca (chapelaria). ${mk(s, 'lic_neigh')} A própria vizinha, a Sra. Valdés (a calçada lá fora). Depois avise a Ofelia.`);
    },
    doneText: t(`You listened to the person the music keeps awake, and the room got another chance.`, `Escuchaste a la persona a quien la música desvela, y el local tuvo otra oportunidad.`, `Você ouviu a pessoa que a música deixa acordada, e o lugar ganhou outra chance.`)
  };
  const OF = D.ofelia.nodes;
  OF.normal.choices.splice(1, 0, K('ask', t(`"You look worried."`, `«Te ves preocupada».`, `«Você parece preocupada».`), { req: function (s) { return !L.rave() && !s.flags.lic_open; }, free: true, next: 'lic' }),
    K('care', t(`"I have the letters."`, `«Tengo las cartas».`, `«Tenho as cartas».`), { req: function (s) { return s.quests.sq_licence === 'active'; }, free: true, next: 'lic_report' }));
  OF.lic = {
    text: t(`Ofelia stops walking, which she never does. "The people in the block over the street filed a complaint. Noise, smoke, people on the pavement at six. The council reviews our late licence on Monday. If it goes, this room goes. Forty people lose a night job. Rosa, Luca, Isi's crew, me." A beat. "They don't need us to be perfect. They need somebody to listen. Hugo, Luca and Sra. Valdés herself, on the pavement. Three letters."`, `Ofelia deja de caminar, algo que nunca hace. «La gente del edificio de enfrente presentó una queja. Ruido, humo, gente en la banqueta a las seis. El consejo revisa nuestra licencia nocturna el lunes. Si se cae, se cae el local. Cuarenta personas pierden un trabajo de noche. Rosa, Luca, el equipo de Isi, yo». Una pausa. «No necesitan que seamos perfectos. Necesitan que alguien escuche. Hugo, Luca y la propia Sra. Valdés, en la banqueta. Tres cartas».`, `A Ofelia para de andar, coisa que ela nunca faz. «O pessoal do prédio da frente fez uma reclamação. Barulho, fumaça, gente na calçada às seis. A prefeitura revisa a nossa licença noturna na segunda. Se cair, cai o lugar. Quarenta pessoas perdem um emprego de noite. Rosa, Luca, a equipe da Isi, eu». Uma pausa. «Eles não precisam que a gente seja perfeito. Precisam que alguém escute. Hugo, Luca e a própria Sra. Valdés, na calçada. Três cartas».`),
    once: true, do: { flag: 'lic_open' },
    choices: [
      K('care', t(`"I'll get them."`, `«Yo las consigo».`, `«Eu consigo».`), { do: { quest: { sq_licence: 'active' }, soc: 2 }, next: null }),
      K('chill', t(`"Not tonight."`, `«Esta noche no».`, `«Hoje não».`), { free: true, next: null })
    ]
  };
  /* the quest can be picked up on a second visit */
  OF.lic_again = { text: t(`"Three letters. Hugo, Luca, Sra. Valdés. I'll be here, walking."`, `«Tres cartas. Hugo, Luca, la Sra. Valdés. Aquí estaré, caminando».`, `«Três cartas. Hugo, Luca, a Sra. Valdés. Vou estar aqui, andando».`), choices: [K('care', t(`"I'll get them."`, `«Yo las consigo».`, `«Eu consigo».`), { do: { quest: { sq_licence: 'active' } }, next: null })] };
  OF.lic_report = {
    text: function (s) {
      const n = ['lic_hugo', 'lic_luca', 'lic_neigh'].filter(function (f) { return s.flags[f]; }).length;
      if (n >= 3) return t(`Ofelia reads all three twice. "Hugo wrote about the floor. Luca wrote about a job. And Sra. Valdés wrote that she wants a phone number that rings a person. They asked for that number at the council." She lets out a long breath. "We keep the licence."`, `Ofelia lee las tres dos veces. «Hugo escribió sobre la pista. Luca sobre un empleo. Y la Sra. Valdés escribió que quisiera un número de teléfono que conteste una persona. Ese número lo pidieron en el consejo». Suelta un suspiro largo. «Nos quedamos con la licencia».`, `A Ofelia lê as três duas vezes. «O Hugo escreveu sobre a pista. O Luca sobre um emprego. E a Sra. Valdés escreveu que gostaria de um telefone que uma pessoa atenda. Esse número foi pedido na prefeitura». Ela solta um longo suspiro. «A gente fica com a licença».`);
      if (n === 2) return t(`Ofelia reads the two letters. "A year, with conditions. It is not nothing. It is not the whole thing."`, `Ofelia lee las dos cartas. «Un año, con condiciones. No es nada. No es todo».`, `A Ofelia lê as duas cartas. «Um ano, com condições. Não é nada. Não é tudo».`);
      return t(`Ofelia turns the one letter over. "Under review. We'll know on Monday." She is kind about it. It does not help.`, `Ofelia da vuelta a la única carta. «En revisión. Lo sabremos el lunes». Lo dice con cariño. No ayuda.`, `A Ofelia vira a única carta. «Em revisão. A gente sabe na segunda». Ela diz com carinho. Não ajuda.`);
    },
    do: { call: 'lic_close' }, next: null
  };
  S.lic_close = function () {
    const s = EM.state, n = ['lic_hugo', 'lic_luca', 'lic_neigh'].filter(function (f) { return s.flags[f]; }).length;
    if (s.flags.lic_closed) return;
    s.flags.lic_closed = true;
    if (n >= 2) s.flags.licence_ok = true; else s.flags.licence_risk = true;
    L.setQuest('sq_licence', 'done');
    L.apply({ fun: 2 * n, soc: 2 * n, care: n >= 2 ? 1 : 0 });
  };
  /* the letters */
  D.hugo.nodes.lic_gate = { branch: [{ req: function (s) { return !!(s.flags.hugo_s1 || s.flags.hugo_s2 || s.flags.hugo_s3); }, to: 'lic_yes' }, { req: function () { return true; }, to: 'lic_no' }] };
  D.hugo.nodes.lic_no = { text: t(`"A letter needs a reason. Ask me where it all comes from first, and then I'll write you one that Monday will read."`, `«Una carta necesita una razón. Pregúntame primero de dónde viene todo esto y entonces te escribo una que el lunes lea».`, `«Uma carta precisa de um motivo. Pergunta primeiro de onde vem tudo isso e aí eu escrevo uma que a segunda leia».`), next: 'a' };
  D.hugo.nodes.lic_yes = { text: t(`Hugo writes in pencil on the back of a flyer: "It was a floor, and then it was a home." He signs it: Hugo, forty years.`, `Hugo escribe a lápiz en el dorso de un volante: «Era una pista y luego fue un hogar». Firma: Hugo, cuarenta años.`, `O Hugo escreve a lápis no verso de um panfleto: «Era uma pista e depois virou um lar». Assina: Hugo, quarenta anos.`), once: true, do: { soc: 2, fun: 2, flag: 'lic_hugo' }, next: null };
  D.hugo.nodes.a.choices.splice(2, 0, K('care', t(`"Ofelia needs a letter for the licence."`, `«Ofelia necesita una carta para la licencia».`, `«A Ofelia precisa de uma carta pra licença».`), { req: function (s) { return s.quests.sq_licence === 'active' && !s.flags.lic_hugo; }, free: true, next: 'lic_gate' }));
  if (D.luca) {
    D.luca.nodes.lic = { text: t(`Luca folds his arms. "A letter. Fine. 'I have a job with a pension and a union card. It exists because this room does.'" He considers. "Sit. Let me describe my dread first. It is four chapters, and it is going to be in the letter."`, `Luca cruza los brazos. «Una carta. Bueno. 'Tengo un empleo con pensión y carnet sindical. Existe porque este local existe'». Lo piensa. «Siéntate. Primero déjame describirte mi angustia. Son cuatro capítulos y va a ir en la carta».`, `O Luca cruza os braços. «Uma carta. Tá. 'Tenho um emprego com previdência e carteirinha do sindicato. Ele existe porque esse lugar existe'». Ele pensa. «Senta. Primeiro deixa eu descrever minha angústia. São quatro capítulos e vai entrar na carta».`),
      choices: [
        K('care', t(`Sit and listen to all four chapters.`, `Sentarte y escuchar los cuatro capítulos.`, `Sentar e ouvir os quatro capítulos.`), { do: { time: 8, soc: -3, flag: 'lic_luca' }, next: null, react: t(`Four chapters later he signs it with a flourish. "It's the best thing I've written. I wrote a novel once. This is better."`, `Cuatro capítulos después la firma con un gesto grande. «Es lo mejor que he escrito. Una vez escribí una novela. Esto es mejor».`, `Quatro capítulos depois ele assina com um floreio. «É a melhor coisa que já escrevi. Uma vez escrevi um romance. Isso é melhor».`) }),
        K('chill', t(`"Another time."`, `«Otra vez».`, `«Outra hora».`), { free: true, next: null })
      ] };
    D.luca.nodes.a.choices.splice(2, 0, K('care', t(`"Ofelia needs a letter for the licence."`, `«Ofelia necesita una carta para la licencia».`, `«A Ofelia precisa de uma carta pra licença».`), { req: function (s) { return s.quests.sq_licence === 'active' && !s.flags.lic_luca; }, free: true, next: 'lic' }));
  }
  D.valdes = {
    who: 'valdes', role: t('NEIGHBOUR', 'VECINA', 'VIZINHA'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'lic_neigh' }, to: 'after' }, { req: function (s) { return (s.valdesShut || 0) > s.time; }, to: 'shut' }, { req: function () { return true; }, to: 'a' }] },
      after: { text: t(`Sra. Valdés raises the thermos a little. "Go home safe. And tell the one with the radio I'll call."`, `La Sra. Valdés levanta un poco el termo. «Vuelve a casa a salvo. Y dile a la de la radio que voy a llamar».`, `A Sra. Valdés levanta um pouco a garrafa térmica. «Volte pra casa em segurança. E diz pra da rádio que eu vou ligar».`), choices: [LEAVE()] },
      shut: { text: t(`"Not now." She does not look at you. "An hour. Then, if you still want to talk, I'll be here. I'm always here. It's my pavement."`, `«Ahora no». No te mira. «Una hora. Luego, si todavía quieres hablar, aquí estaré. Siempre estoy aquí. Es mi banqueta».`, `«Agora não». Ela não te olha. «Uma hora. Depois, se ainda quiser conversar, eu tô aqui. Eu sempre tô aqui. É a minha calçada».`), choices: [LEAVE()] },
      a: {
        text: t(`A woman in a dressing gown on the pavement, thermos in hand, eye mask pushed up on her forehead. "Six in the morning. Every Saturday. The bass comes up through the bed. I am not a monster. I get up at half past four."`, `Una mujer en bata en la banqueta, con un termo en la mano y el antifaz en la frente. «Las seis de la mañana. Todos los sábados. El bajo sube por la cama. No soy un monstruo. Soy una mujer que se levanta a las cuatro y media».`, `Uma mulher de roupão na calçada, garrafa térmica na mão, tapa-olho empurrado pra testa. «Seis da manhã. Todo sábado. O grave sobe pela cama. Eu não sou um monstro. Sou uma mulher que acorda às quatro e meia».`),
        choices: [
          K('honest', t(`"That sounds exhausting. Tell me what it's like."`, `«Suena agotador. Cuéntame cómo es».`, `«Parece exaustivo. Me conta como é».`), { do: { soc: -2, time: 6 }, next: 'listen' }),
          K('blunt', t(`"It's a nightclub. What did you expect?"`, `«Es un club. ¿Qué esperabas?»`, `«É uma balada. O que você esperava?»`), { bad: true, do: { soc: -3, flag: 'valdes_rude' }, call: 'valdes_shut', next: null, react: t(`"Good morning to you too." She pulls the eye mask down and turns her back.`, `«Buenos días para ti también». Se baja el antifaz y te da la espalda.`, `«Bom dia pra você também». Ela abaixa o tapa-olho e vira de costas.`) }),
          LEAVE()
        ]
      },
      listen: {
        text: t(`"I don't mind the music. I like it, on a good night, through the window. I mind that I can't sleep between eleven and four, that the smokers stand under my balcony, and that when I phone nobody picks up. I phoned the police twice. They did nothing. I'd rather speak to a person."`, `«La música no me molesta. Me gusta, en una buena noche, por la ventana. Me molesta no poder dormir entre las once y las cuatro, que los fumadores se paren bajo mi balcón y que cuando llamo nadie conteste. Llamé dos veces a la policía. No hicieron nada. Preferiría hablar con una persona».`, `«Eu não me incomodo com a música. Gosto, numa boa noite, pela janela. Me incomoda não conseguir dormir entre onze e quatro, os fumantes ficarem embaixo da minha varanda e, quando eu ligo, ninguém atender. Liguei duas vezes pra polícia. Não fizeram nada. Preferia falar com uma pessoa».`),
        next: 'help'
      },
      help: {
        text: t(`She waits. "What can you actually offer?"`, `Espera. «¿Qué puedes ofrecer de verdad?»`, `Ela espera. «O que você pode oferecer de verdade?»`),
        choices: [
          K('plan', t(`A number that rings a person: Ofelia's radio.`, `Un número que contesta una persona: la radio de Ofelia.`, `Um número que uma pessoa atende: o rádio da Ofelia.`), { req: { no: 'lic_n1' }, free: true, do: { flag: 'lic_n1', soc: 1 }, next: 'check' }),
          K('plan', t(`The smokers go to the courtyard side, not under your balcony.`, `Los fumadores van al lado del patio, no bajo tu balcón.`, `Os fumantes vão pro lado do pátio, não embaixo da sua varanda.`), { req: { no: 'lic_n2' }, free: true, do: { flag: 'lic_n2', soc: 1 }, next: 'check' }),
          K('plan', t(`The roof set after six stays low. ÆRIEL will agree.`, `El set del techo después de las seis se queda bajo. ÆRIEL va a aceptar.`, `O set do terraço depois das seis fica baixo. A ÆRIEL vai concordar.`), { req: { no: 'lic_n3' }, free: true, do: { flag: 'lic_n3', soc: 1 }, next: 'check' }),
          K('care', t(`A pair of foam earplugs from Reduciendo Daño.`, `Unos tapones de espuma de Reduciendo Daño.`, `Um par de protetores de espuma da Reduciendo Daño.`), { req: function (s) { return (IT.inv(s).earplugs || 0) > 0 && !s.flags.lic_n4; }, free: true, do: { flag: 'lic_n4', soc: 1 }, call: 'valdes_plugs', next: 'check' })
        ]
      },
      check: { branch: [{ req: function (s) { return ['lic_n1', 'lic_n2', 'lic_n3', 'lic_n4'].filter(function (f) { return s.flags[f]; }).length >= 2; }, to: 'ok' }, { req: function () { return true; }, to: 'help' }] },
      ok: {
        text: t(`Sra. Valdés takes a card from her gown, writes three lines and signs. "I'm not saying yes to everything. I'm saying yes to the people who asked." She hands it over. "Tell them I wrote it myself."`, `La Sra. Valdés saca una tarjeta de la bata, escribe tres líneas y firma. «No digo que sí a todo. Digo que sí a quienes preguntaron». Te la entrega. «Diles que la escribí yo».`, `A Sra. Valdés tira um cartão do roupão, escreve três linhas e assina. «Não tô dizendo sim pra tudo. Tô dizendo sim pra quem perguntou». Ela entrega. «Diz que eu mesma escrevi».`),
        once: true, do: { fun: 4, soc: 4, care: 1, flag: 'lic_neigh' }, next: null
      }
    }
  };
  S.valdes_shut = function () { const s = EM.state; s.valdesShut = s.time + 60; };
  S.valdes_plugs = function () { const i = IT.inv(EM.state); if (i.earplugs > 0) i.earplugs--; };
  Z.doors.npc({ id: 'valdes', x: 22.5, y: 8.5, dlg: 'valdes', dir: 'l', reach: 18, when: function (s) { return s.venue !== 'rave' && s.quests.sq_licence === 'active' && !s.flags.lic_closed; } });
  /* picking the quest up again after you walked away from Ofelia */
  OF.normal.choices.splice(2, 0, K('care', t(`"What was it about the licence again?"`, `«¿Qué era lo de la licencia?»`, `«Qual era a da licença mesmo?»`), { req: function (s) { return !!s.flags.lic_open && !s.quests.sq_licence; }, free: true, next: 'lic_again' }));
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'lic_ok', who: 'ofelia', ok: function (s) { return !!s.flags.licence_ok; }, t: t(`the council read the letters. the one from the woman in the dressing gown did it. we keep the late licence, with conditions, and she has our number. thank you for listening to her.`, `el consejo leyó las cartas. la de la mujer en bata fue la que lo logró. nos quedamos con la licencia nocturna, con condiciones, y ella tiene nuestro número. gracias por escucharla.`, `a prefeitura leu as cartas. a da mulher de roupão foi a que resolveu. a gente fica com a licença noturna, com condições, e ela tem nosso número. obrigada por ouvir ela.`) });
    R.push({ id: 'lic_risk', who: 'ofelia', ok: function (s) { return !!s.flags.licence_risk; }, t: t(`the licence is under review. we'll know monday. not your fault. next time we listen sooner.`, `la licencia está en revisión. lo sabremos el lunes. no es tu culpa. la próxima escuchamos antes.`, `a licença tá em revisão. a gente sabe na segunda. não é culpa sua. da próxima a gente escuta mais cedo.`) });
  }
})();

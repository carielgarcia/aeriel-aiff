/* EXCUSE ME — story v39: THE AFTER, made legible.
   1. ONE SPINE. The mandatory missions are now one ordered list, THE AFTER (q_af0): 1 HOUSE RULES, 2 THE KITCHEN, 3 THE COATS ROOM,
      4 THE QUESTION, 5 GOING HOME. Each step starts when the one before it is done (not by the clock), the objective banner says
      "AFTER 2/5" and what to do, the quest log shows the list, and the small missions that fed it are folded into it. Optional ones
      (ONE MORE, THE KNOCK, THE MASTER BEDROOM) say so.
   2. LEAVING. The front door is marked FRONT DOOR. It opens when steps 1-4 are done (GOING HOME, q_af9: Anselm, golden star). Before
      that the door tells you exactly what is left.
   3. THE MASTER BEDROOM says what it needs (the house rules, and being fit to say yes) when you touch the door; Dot explains where it is.
   4. THE NOISE bar says why it moves: a caption (music, dancing, an open door), a toast for every bump with its cause, and a block in
      MENU > STATUS that lists what raises it, what lowers it and what the knocks mean.
   5. MORE PEOPLE: dancers on the living room rug and circles of guests talking (nobody needs to be spoken to). One circle in the courtyard too.
   Loads after story_v38.js and before compact.js. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine, S = EM.scripts, D = EM.DIALOGUES, story = EM.story, AF = EM.AF, Z = EM.zones;
  if (!AF || !Z.a_living) return;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const mk = function (s, ok) { return ok ? '[X]' : '[ ]'; };
  const BIG = 1e9;
  const Qd = function (s, id) { return s.quests[id] === 'done'; };

  /* ============================================================ 1. THE SPINE */
  /* what is done, in order. The question only counts when somebody from your group is still here to ask. */
  AF.steps = function (s) {
    const q = s.quests, rules = Qd(s, 'q_af2'), kit = Qd(s, 'q_af3'), coats = Qd(s, 'q_af4');
    const ask = Qd(s, 'q_af7') || (!q.q_af7 && coats && !AF.present(s).length);
    return { rules: rules, kit: kit, coats: coats, ask: ask, home: false };
  };
  AF.mandatoryDone = function (s) { const x = AF.steps(s); return x.rules && x.kit && x.coats && x.ask; };
  AF.canLeave = function (s) { return !!s.quests.q_af9; };

  const sch1 = AF.schedule;
  AF.schedule = function (s) {
    const a = s.after; if (!a || !a.at) { sch1(s); return; }
    const q = s.quests, f = s.flags, at = a.at;
    /* the coats room and the question wait for the step before them, however long that takes */
    if (!a.seq) { a.seq = { lio: at.lio, question: at.question }; if (at.lio > s.time) at.lio = BIG; if (at.question > s.time) at.question = BIG; } /* only times still in the future are held */
    if (f.af_rules) f.mb_open = true;
    if (q.q_af3 === 'active' && f.sam_done && f.rey_done && f.vik_done) L.setQuest('q_af3', 'done'); /* all three seen to, whatever the outcome */
    if (Qd(s, 'q_af3') && at.lio >= BIG) at.lio = s.time;
    if (Qd(s, 'q_af4') && at.question >= BIG && !a.holdQuestion) at.question = s.time - 4; /* a.holdQuestion: a hook for scripted tests */
    sch1(s);
    /* the step before just finished inside that call: open the next one in the same minute */
    if (Qd(s, 'q_af3') && !q.q_af4 && !a.rel3) { a.rel3 = true; at.lio = s.time; sch1(s); }
    if (Qd(s, 'q_af4') && !q.q_af7 && at.question >= BIG && !a.holdQuestion && !a.rel4) { a.rel4 = true; at.question = s.time - 4; sch1(s); }
    if (!q.q_af9 && AF.mandatoryDone(s)) {
      L.setQuest('q_af9', 'active');
      U.toast({ icon: 'star', kind: 'good', ms: 7000, text: t(`AFTER 5/5, GOING HOME. Everything is looked after. Thank Anselm and Dot (golden star), then take the front door.`, `DESPUÉS 5/5, VOLVER A CASA. Todo está atendido. Agradécele a Anselm y a Dot (estrella dorada) y sal por la puerta de entrada.`, `AFTER 5/5, IR PRA CASA. Tudo está cuidado. Agradeça ao Anselm e à Dot (estrela dourada) e saia pela porta da frente.`) });
    }
  };

  const b1 = S.af_begin;
  S.af_begin = function () { b1.apply(this, arguments); L.setQuest('q_af0', 'active'); };

  const LIST = {
    rules: t('meet Dot at the front door and hear the house rules', 'encuentra a Dot en la puerta y escucha las reglas de la casa', 'encontre a Dot na porta e ouça as regras da casa'),
    kit: t('THE KITCHEN: look after two of Sam, Rey and Vik (golden stars)', 'LA COCINA: atiende a dos de Sam, Rey y Vik (estrellas doradas)', 'A COZINHA: cuide de dois entre Sam, Rey e Vik (estrelas douradas)'),
    coats: t('THE COATS ROOM: somebody is alone in the bedroom off the living room', 'EL CUARTO DE LOS ABRIGOS: alguien está solo en el dormitorio junto a la sala', 'O QUARTO DOS CASACOS: tem alguém sozinho no quarto ao lado da sala'),
    ask: t('THE QUESTION: your people are fading, decide who walks whom home', 'LA PREGUNTA: tu gente se apaga, decide quién acompaña a quién a casa', 'A PERGUNTA: sua galera tá apagando, decida quem leva quem pra casa')
  };
  const joinT = function (arr) { return t(arr.map(function (x) { return x.en; }).join('; '), arr.map(function (x) { return x.es; }).join('; '), arr.map(function (x) { return x.pt; }).join('; ')); };
  AF.remaining = function (s) { const x = AF.steps(s); return ['rules', 'kit', 'coats', 'ask'].filter(function (k) { return !x[k]; }).map(function (k) { return LIST[k]; }); };

  EM.QUESTS.q_af0 = {
    title: t('THE AFTER', 'EL AFTER', 'O AFTER'),
    desc: function (s) {
      const x = AF.steps(s), c = function (k) { return mk(s, x[k]); };
      return t(`The after, in order. ${c('rules')} 1. HOUSE RULES: meet Dot at the front door. ${c('kit')} 2. THE KITCHEN: look after two of Sam, Rey and Vik. ${c('coats')} 3. THE COATS ROOM: somebody is alone in the bedroom off the living room. ${c('ask')} 4. THE QUESTION: your people are fading, decide who walks whom home. ${mk(s, false)} 5. GOING HOME: thank Anselm and Dot, then take the front door (it opens when 1 to 4 are done). OPTIONAL: ONE MORE (Pasc, on the sofa), THE KNOCK (watch the NOISE bar), THE MASTER BEDROOM (door MASTER in the living room), and ÆRIEL's questions on the sofa.`,
        `El after, en orden. ${c('rules')} 1. REGLAS DE LA CASA: encuentra a Dot en la puerta. ${c('kit')} 2. LA COCINA: atiende a dos de Sam, Rey y Vik. ${c('coats')} 3. EL CUARTO DE LOS ABRIGOS: alguien está solo en el dormitorio junto a la sala. ${c('ask')} 4. LA PREGUNTA: tu gente se apaga, decide quién acompaña a quién a casa. ${mk(s, false)} 5. VOLVER A CASA: agradécele a Anselm y a Dot y sal por la puerta de entrada (se abre al terminar de 1 a 4). OPCIONAL: UNA MÁS (Pasc, en el sofá), EL TOQUE (mira la barra de RUIDO), EL DORMITORIO PRINCIPAL (puerta MASTER en la sala) y las preguntas de ÆRIEL en el sofá.`,
        `O after, em ordem. ${c('rules')} 1. REGRAS DA CASA: encontre a Dot na porta. ${c('kit')} 2. A COZINHA: cuide de dois entre Sam, Rey e Vik. ${c('coats')} 3. O QUARTO DOS CASACOS: tem alguém sozinho no quarto ao lado da sala. ${c('ask')} 4. A PERGUNTA: sua galera tá apagando, decida quem leva quem pra casa. ${mk(s, false)} 5. IR PRA CASA: agradeça ao Anselm e à Dot e saia pela porta da frente (abre quando 1 a 4 estiverem prontos). OPCIONAL: MAIS UMA (Pasc, no sofá), A BATIDA (olhe a barra de BARULHO), O QUARTO PRINCIPAL (porta MASTER na sala) e as perguntas da ÆRIEL no sofá.`);
    },
    doneText: t(`The after is over. The night is yours.`, `El after terminó. La noche es tuya.`, `O after acabou. A noite é sua.`)
  };
  EM.QUESTS.q_af9 = {
    title: t('GOING HOME', 'VOLVER A CASA', 'IR PRA CASA'),
    desc: t(`Everything is looked after. Thank Anselm and Dot (golden star), then take the front door at the bottom of the living room.`, `Todo está atendido. Agradécele a Anselm y a Dot (estrella dorada) y sal por la puerta de entrada, al fondo de la sala.`, `Tudo está cuidado. Agradeça ao Anselm e à Dot (estrela dourada) e saia pela porta da frente, no fundo da sala.`),
    doneText: t(`You went home.`, `Volviste a casa.`, `Você foi pra casa.`)
  };
  /* the quests folded into the spine leave the log; the optional ones say so */
  const FOLDED = { q_af2: 1, q_af3: 1, q_af4: 1, q_af7: 1, q_af9: 1 };
  EM.questHidden = function (id, s) { return !!(FOLDED[id] && s.quests.q_af0); };
  [['q_af5', 'OPTIONAL // ', 'OPCIONAL // ', 'OPCIONAL // '], ['q_af6', 'OPTIONAL // ', 'OPCIONAL // ', 'OPCIONAL // '], ['q_af8', 'OPTIONAL // ', 'OPCIONAL // ', 'OPCIONAL // ']].forEach(function (p) {
    const q = EM.QUESTS[p[0]]; if (!q || q.__opt) return;
    const old = q.title; q.__opt = true;
    q.title = t(p[1] + EM.tr(old), p[2] + EM.tr(old), p[3] + EM.tr(old));
  });

  /* the banner says where you are in the list */
  const obj1 = story.objective;
  story.objective = function (s) {
    if (!s.after || s.ended || s.quests.q_af1 === 'active' || s.quests.q_af2 === 'active' || !s.quests.q_af0) return obj1(s);
    const x = AF.steps(s), q = s.quests;
    const P = function (n) { return t(`AFTER ${n}/5, `, `DESPUÉS ${n}/5, `, `AFTER ${n}/5, `); };
    const join = function (n, tx) { return T(P(n).en + tx.en, P(n).es + tx.es, P(n).pt + tx.pt); };
    if (!x.rules) return obj1(s);
    if (!x.kit) return join(2, t(`THE KITCHEN. Look after two of Sam, Rey and Vik (golden stars). Toast, water, a quiet word.`, `LA COCINA. Atiende a dos de Sam, Rey y Vik (estrellas doradas). Tostadas, agua, una palabra tranquila.`, `A COZINHA. Cuide de dois entre Sam, Rey e Vik (estrelas douradas). Torrada, água, uma palavra tranquila.`));
    if (!x.coats) return join(3, t(`THE COATS ROOM. Somebody is alone in the bedroom off the living room. Go to them (golden star).`, `EL CUARTO DE LOS ABRIGOS. Alguien está solo en el dormitorio junto a la sala. Ve con esa persona (estrella dorada).`, `O QUARTO DOS CASACOS. Tem alguém sozinho no quarto ao lado da sala. Vá até a pessoa (estrela dourada).`));
    if (!x.ask) return join(4, t(`THE QUESTION. Your people are fading. Talk it over and decide who walks whom home.`, `LA PREGUNTA. Tu gente se apaga. Hablen y decide quién acompaña a quién a casa.`, `A PERGUNTA. Sua galera tá apagando. Conversem e decida quem leva quem pra casa.`));
    if (q.q_af9 === 'active') return join(5, t(`GOING HOME. Thank Anselm and Dot (golden star), then take the front door at the bottom of the living room.`, `VOLVER A CASA. Agradécele a Anselm y a Dot (estrella dorada) y sal por la puerta de entrada, al fondo de la sala.`, `IR PRA CASA. Agradeça ao Anselm e à Dot (estrela dourada) e saia pela porta da frente, no fundo da sala.`));
    return obj1(s);
  };
  EM.seekers.push(function (s) { return s.after && !s.ended && s.quests.q_af9 === 'active' ? [{ key: 'anselm', zone: 'a_living', label: '★' }] : []; });

  /* ============================================================ 2. LEAVING */
  const living = Z.a_living;
  living.ents.forEach(function (e) {
    if (e.id === 'ad_front') { e.tag = t('FRONT DOOR', 'PUERTA DE ENTRADA', 'PORTA DA FRENTE'); e.tagShort = t('EXIT', 'SALIDA', 'SAÍDA'); }
    if (e.id === 'anselm') e.dlg = function (s) { return s.quests.q_af9 === 'active' ? 'af_goodbye' : 'af_anselm'; };
  });
  /* the hand-placed signs the door tags now replace */
  living.signs = living.signs.filter(function (sg) { return ['MASTER', 'KITCHEN >', 'COATS', 'WC'].indexOf(sg.text) === -1; });

  D.af_front = {
    start: 'st', nodes: {
      st: { branch: [{ req: function (s) { return AF.canLeave(s); }, to: 'open' }, { req: function () { return true; }, to: 'locked' }] },
      locked: {
        text: function (s) {
          return [t(`THE FRONT DOOR. It is not locked; it is waiting. You can leave once the night's care is done, because people here are counting on you.`, `LA PUERTA DE ENTRADA. No está cerrada con llave; espera. Puedes irte cuando termine el cuidado de la noche, porque aquí hay gente que cuenta contigo.`, `A PORTA DA FRENTE. Não tá trancada; tá esperando. Você pode sair quando o cuidado da noite acabar, porque tem gente aqui contando com você.`),
            T(`Still to do: ${joinT(AF.remaining(s)).en}.`, `Falta: ${joinT(AF.remaining(s)).es}.`, `Falta: ${joinT(AF.remaining(s)).pt}.`)];
        },
        choices: [K('chill', t(`Back inside.`, `Volver adentro.`, `Voltar pra dentro.`), { free: true, next: null })]
      },
      open: {
        text: t(`The front door, and the stairs behind it. Everything is looked after. Your legs want a bed.`, `La puerta de entrada y las escaleras detrás. Todo está atendido. Tus piernas quieren una cama.`, `A porta da frente e a escada atrás. Tudo está cuidado. Suas pernas querem uma cama.`),
        choices: [
          K('chill', t(`Stay a bit longer.`, `Quedarte un poco más.`, `Ficar mais um pouco.`), { free: true, next: null }),
          K('care', t(`Say your goodbyes and go home. Your people come with you.`, `Despedirte e irte a casa. Tu gente va contigo.`, `Se despedir e ir pra casa. Sua galera vai junto.`), { free: true, do: { flag: 'after_early' }, call: 'af_end_after', next: null })
        ]
      }
    }
  };
  D.af_goodbye = {
    who: 'anselm', role: t('HOST', 'ANFITRIÓN', 'ANFITRIÃO'), start: 'a', nodes: {
      a: {
        text: t(`Anselm, a tea towel over one shoulder, looks around the flat: fed, quiet, half asleep. Dot lifts one hand from the arm of a chair without opening her eyes. "That's the shift done. You looked after people who were not yours to look after. Go home. Thank you for the quiet."`, `Anselm, con un paño de cocina al hombro, mira el departamento: alimentado, tranquilo, medio dormido. Dot levanta una mano desde el brazo de una silla sin abrir los ojos. «Eso fue el turno. Cuidaste a gente que no era tuya. Vete a casa. Gracias por la calma».`, `O Anselm, com um pano de prato no ombro, olha o apê: alimentado, quieto, meio dormindo. A Dot levanta uma mão do braço da cadeira sem abrir os olhos. «Esse foi o turno. Você cuidou de gente que não era sua. Vai pra casa. Obrigado pela calma».`),
        choices: [
          K('care', t(`"Thank you for having us. We're going home."`, `«Gracias por recibirnos. Nos vamos a casa».`, `«Valeu por receber a gente. A gente vai pra casa».`), { free: true, do: { flag: 'after_early', soc: 3, care: 1 }, call: 'af_end_after', next: null }),
          K('chill', t(`"A few more minutes."`, `«Unos minutos más».`, `«Mais uns minutinhos».`), { free: true, next: null })
        ]
      }
    }
  };

  /* ============================================================ 3. THE MASTER BEDROOM SAYS WHAT IT NEEDS */
  const gate0 = S.af_mb_gate;
  S.af_mb_gate = function () {
    const s = EM.state;
    if (!s.flags.af_rules) {
      U.toast({ icon: 'eyes', kind: 'info', ms: 7500, text: t(`THE MASTER BEDROOM IS CLOSED. To open it: 1) hear the house rules from Dot at the front door; 2) be fit to say yes (HEALTH ok, not too high). Then walk into this door and Dot walks you in.`, `EL DORMITORIO PRINCIPAL ESTÁ CERRADO. Para abrirlo: 1) escucha las reglas de la casa con Dot en la puerta de entrada; 2) estar en condiciones de decir que sí (SALUD bien, sin estar demasiado arriba). Luego entra por esta puerta y Dot te acompaña.`, `O QUARTO PRINCIPAL ESTÁ FECHADO. Pra abrir: 1) ouça as regras da casa com a Dot na porta da frente; 2) esteja em condições de dizer sim (SAÚDE ok, sem estar muito alto). Aí entre por essa porta e a Dot te acompanha.`) });
      return;
    }
    s.flags.mb_open = true;
    gate0();
  };
  if (D.af_dot_kitchen && D.af_dot_kitchen.nodes.mbinfo) {
    const mi = D.af_dot_kitchen.nodes.mbinfo;
    mi.text = [].concat(mi.text, t(`"The door is the one marked MASTER, top right of the living room. Walk into it and I'll come with you. If you're too high to agree, we wait. That's the whole lock."`, `«La puerta es la que dice MASTER, arriba a la derecha de la sala. Entra y voy contigo. Si estás demasiado arriba para aceptar, esperamos. Ese es todo el candado».`, `«A porta é a que diz MASTER, no alto à direita da sala. Entra que eu vou com você. Se você tá muito alto pra concordar, a gente espera. Esse é o cadeado todo».`));
  }
  if (EM.QUESTS.q_af8) {
    EM.QUESTS.q_af8.desc = t(`Optional. The hosts opened their own room, with the dark room's rules and a bed. How to get in: hear the house rules from Dot, then walk into the door marked MASTER (top right of the living room). Dot walks you in. You need to be fit to say yes: HEALTH ok and not too high (water, a sit and an hour fix that). Ask first. Skip it and you lose nothing.`, `Opcional. Los anfitriones abrieron su propio cuarto, con las reglas del cuarto oscuro y una cama. Cómo entrar: escucha las reglas de la casa con Dot y luego entra por la puerta marcada MASTER (arriba a la derecha de la sala). Dot te acompaña. Debes estar en condiciones de decir que sí: SALUD bien y sin estar demasiado arriba (agua, sentarse y una hora lo arreglan). Pregunta primero. Si lo saltas no pierdes nada.`, `Opcional. Os anfitriões abriram o próprio quarto, com as regras da dark room e uma cama. Como entrar: ouça as regras da casa com a Dot e entre pela porta marcada MASTER (no alto à direita da sala). A Dot te acompanha. Você precisa estar em condições de dizer sim: SAÚDE ok e sem estar muito alto (água, sentar e uma hora resolvem). Pergunte primeiro. Se pular, não perde nada.`);
  }

  /* ============================================================ 4. THE NOISE, EXPLAINED */
  const CAUSE = {
    loud: t('LOUD MUSIC', 'MÚSICA FUERTE', 'MÚSICA ALTA'), mid: t('MUSIC', 'MÚSICA', 'MÚSICA'), quiet: t('QUIET MUSIC', 'MÚSICA BAJA', 'MÚSICA BAIXA'),
    dance: t('DANCING', 'BAILE', 'DANÇA'), door: t('DOOR OPEN', 'PUERTA ABIERTA', 'PORTA ABERTA')
  };
  const NLAB = t('NOISE', 'RUIDO', 'BARULHO');
  AF.noiseNow = function (s) {
    const a = s.after, vol = a.vol, parts = [], rate = [-0.35, 0.1, 0.7][vol] || 0;
    let r = rate;
    parts.push(vol === 2 ? CAUSE.loud : (vol === 1 ? CAUSE.mid : CAUSE.quiet));
    if (s.zone === 'a_living' && E.dancing) { parts.push(CAUSE.dance); r += 0.6; }
    if (s.flags.door_yours && !s.flags.door_closed) { parts.push(CAUSE.door); r += 0.2; }
    return { rate: r, parts: parts };
  };
  (function () {
    const css = document.createElement('style');
    css.textContent = '#noise-why { position: absolute; left: 6px; bottom: 6px; z-index: 5; background: #0A0A0A; border: 1px solid #FFFFFF; padding: 2px 6px; font-size: 10px; letter-spacing: 1px; color: #FFFFFF; pointer-events: none; text-transform: uppercase; } #noise-why[hidden] { display: none !important; } #noise-why.up { color: #FF8A1F; border-color: #FF8A1F; }';
    document.head.appendChild(css);
    const build = function () { const st = document.getElementById('stage'); if (!st || document.getElementById('noise-why')) return; const d = document.createElement('div'); d.id = 'noise-why'; d.hidden = true; st.appendChild(d); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  })();
  const paint0 = AF.paintNoise;
  AF.paintNoise = function () {
    paint0.apply(this, arguments);
    const s = EM.state, box = document.getElementById('noise-why'); if (!box) return;
    const on = !!(s && s.after && !s.ended && U.mode !== 'ending');
    box.hidden = !on; if (!on) return;
    const n = AF.noiseNow(s), arrow = n.rate > 0.3 ? '▲' : (n.rate < -0.05 ? '▼' : '■');
    box.textContent = EM.tr(NLAB) + ' ' + Math.round(s.after.noise) + ' ' + arrow + ' ' + n.parts.map(function (p) { return EM.tr(p); }).join(' + ');
    box.classList.toggle('up', n.rate > 0.3);
  };
  /* every bump says why */
  const CAUSES = {
    af_up8: t('IGNORING THE KNOCK', 'IGNORAR EL TOQUE', 'IGNORAR A BATIDA'), af_noise12: t('A LOUD MOMENT', 'UN MOMENTO FUERTE', 'UM MOMENTO ALTO'),
    af_noise8: t('RAISED VOICES', 'VOCES ALTAS', 'VOZES ALTAS'), af_noise4: t('LAUGHTER', 'RISAS', 'RISADAS'), af_noise3: t('LAUGHTER', 'RISAS', 'RISADAS'),
    af_door_both: t('BOTH DOORS OPEN', 'AMBAS PUERTAS ABIERTAS', 'AS DUAS PORTAS ABERTAS'), af_maru_walk: t('GOODBYES IN THE HALL', 'DESPEDIDAS EN EL PASILLO', 'DESPEDIDAS NO CORREDOR'),
    af_mb_noise: t('THE WALLS HEAR THE MASTER BEDROOM', 'LAS PAREDES OYEN EL DORMITORIO', 'AS PAREDES OUVEM O QUARTO'),
    af_vol0: t('MUSIC OFF', 'MÚSICA APAGADA', 'MÚSICA DESLIGADA'), af_dn15: t('SORRY AND A LOWER VOLUME', 'PERDÓN Y MENOS VOLUMEN', 'DESCULPA E MENOS VOLUME'),
    af_dn25: t('SORRY AND A LOWER VOLUME', 'PERDÓN Y MENOS VOLUMEN', 'DESCULPA E MENOS VOLUME'), af_dn30: t('SORRY AND A LOWER VOLUME', 'PERDÓN Y MENOS VOLUMEN', 'DESCULPA E MENOS VOLUME'),
    af_dn35: t('SORRY AND A QUIET HOUR', 'PERDÓN Y UNA HORA DE SILENCIO', 'DESCULPA E UMA HORA DE SILÊNCIO'), af_anselm_door: t('DOOR CLOSED, MUSIC LOW', 'PUERTA CERRADA, MÚSICA BAJA', 'PORTA FECHADA, MÚSICA BAIXA'),
    af_quiroga_down: t('QUIROGA HAS BEEN HEARD', 'QUIROGA FUE ESCUCHADO', 'O QUIROGA FOI OUVIDO')
  };
  let cause = null;
  Object.keys(CAUSES).forEach(function (k) {
    const f0 = S[k]; if (!f0) return;
    S[k] = function () { cause = CAUSES[k]; try { return f0.apply(this, arguments); } finally { cause = null; } };
  });
  const VOLNOTE = {
    af_set0: t('MUSIC: QUIET. The noise falls about a third of a point per game minute.', 'MÚSICA: BAJA. El ruido baja un tercio de punto por minuto de juego.', 'MÚSICA: BAIXA. O barulho cai um terço de ponto por minuto de jogo.'),
    af_set1: t('MUSIC: MEDIUM. The noise creeps up slowly.', 'MÚSICA: MEDIA. El ruido sube despacio.', 'MÚSICA: MÉDIA. O barulho sobe devagar.'),
    af_set2: t('MUSIC: LOUD. The noise rises about 0.7 a minute, and dancing adds more.', 'MÚSICA: FUERTE. El ruido sube unos 0,7 por minuto, y bailar suma más.', 'MÚSICA: ALTA. O barulho sobe uns 0,7 por minuto, e dançar soma mais.')
  };
  Object.keys(VOLNOTE).forEach(function (k) {
    const f0 = S[k]; if (!f0) return;
    S[k] = function () { f0.apply(this, arguments); U.toast({ icon: 'note', kind: k === 'af_set2' ? 'bad' : 'info', ms: 5200, text: VOLNOTE[k] }); AF.paintNoise(); };
  });
  const noise0 = AF.noise;
  AF.noise = function (d) {
    const s = EM.state, was = s && s.after ? s.after.noise : 0;
    noise0.apply(this, arguments);
    if (!s || !s.after || Math.abs(d) < 2.5) return;
    const real = Math.round(s.after.noise - was); if (!real) return;
    const why = cause || t('THE FLAT', 'EL DEPARTAMENTO', 'O APÊ');
    U.toast({ icon: 'note', kind: real > 0 ? 'bad' : 'good', ms: 4200, text: T(`NOISE ${real > 0 ? '+' : ''}${real}: ${why.en}`, `RUIDO ${real > 0 ? '+' : ''}${real}: ${why.es}`, `BARULHO ${real > 0 ? '+' : ''}${real}: ${why.pt}`) });
  };
  const sq0 = AF.setNoise;
  AF.setNoise = function (v) { const s = EM.state, was = s && s.after ? s.after.noise : 0; sq0.apply(this, arguments); if (s && s.after && Math.round(was - s.after.noise) >= 5) U.toast({ icon: 'note', kind: 'good', ms: 4200, text: T(`NOISE -${Math.round(was - s.after.noise)}: ${(cause || CAUSES.af_quiroga_down).en}`, `RUIDO -${Math.round(was - s.after.noise)}: ${(cause || CAUSES.af_quiroga_down).es}`, `BARULHO -${Math.round(was - s.after.noise)}: ${(cause || CAUSES.af_quiroga_down).pt}`) }); };
  /* MENU > STATUS: what the walls hear */
  EM.menuExtras = EM.menuExtras || [];
  EM.menuExtras.push(function (box, s) {
    if (!s.after || s.ended) return;
    const n = AF.noiseNow(s), p = document.createElement('div'); p.className = 'mnote';
    const line = function (en, es, pt) { const d = document.createElement('div'); d.textContent = EM.tr(t(en, es, pt)); return d; };
    const h = document.createElement('div'); h.style.fontWeight = 'bold';
    h.textContent = EM.tr(NLAB) + ' ' + Math.round(s.after.noise) + '/100 · ' + n.parts.map(function (x) { return EM.tr(x); }).join(' + ') + ' ' + (n.rate > 0.3 ? '▲' : (n.rate < -0.05 ? '▼' : '■'));
    p.appendChild(h);
    p.appendChild(line('RAISES IT: loud music, dancing in the living room, a door left open, raised voices and laughter, goodbyes in the hall, ignoring a knock.', 'LO SUBE: música fuerte, bailar en la sala, una puerta abierta, voces altas y risas, despedidas en el pasillo, ignorar un toque.', 'AUMENTA: música alta, dançar na sala, porta aberta, vozes altas e risadas, despedidas no corredor, ignorar uma batida.'));
    p.appendChild(line('LOWERS IT: ask Anselm for something quiet (the records, living room), close the door, say sorry to the neighbours and offer a quiet hour.', 'LO BAJA: pedirle algo tranquilo a Anselm (los discos, la sala), cerrar la puerta, pedir perdón a los vecinos y ofrecer una hora de silencio.', 'DIMINUI: pedir algo calmo pro Anselm (os discos, a sala), fechar a porta, pedir desculpa aos vizinhos e oferecer uma hora de silêncio.'));
    p.appendChild(line('THE KNOCKS: 25 a broom handle, 50 Marcos, 70 Beto, 90 Quiroga (a warning, and the second visit ends the after).', 'LOS TOQUES: 25 un palo de escoba, 50 Marcos, 70 Beto, 90 Quiroga (una advertencia, y la segunda visita termina el after).', 'AS BATIDAS: 25 um cabo de vassoura, 50 Marcos, 70 Beto, 90 Quiroga (um aviso, e a segunda visita termina o after).'));
    box.appendChild(p);
  });
  if (EM.QUESTS.q_af6) {
    EM.QUESTS.q_af6.desc = t(`The walls have neighbours. The NOISE bar (bottom left of the stage says what is moving it) rises with loud music, dancing in the living room and an open door, and drops when you lower the music, close the door or say sorry. Marcos knocks at 50, Beto at 70, Quiroga at 90. Lower the music, say sorry, keep the party.`, `Las paredes tienen vecinos. La barra de RUIDO (abajo a la izquierda del escenario dice qué la mueve) sube con música fuerte, bailar en la sala y una puerta abierta, y baja al bajar la música, cerrar la puerta o pedir perdón. Marcos toca a los 50, Beto a los 70, Quiroga a los 90. Baja la música, pide perdón, salva el after.`, `As paredes têm vizinhos. A barra de BARULHO (embaixo à esquerda do palco diz o que a move) sobe com música alta, dançar na sala e porta aberta, e desce ao baixar a música, fechar a porta ou pedir desculpa. O Marcos bate aos 50, o Beto aos 70, o Quiroga aos 90. Baixe a música, peça desculpa, salve o after.`);
  }

  /* ============================================================ 5. MORE PEOPLE: dancers and circles */
  /* anonymous guests, from a fixed spread of looks (so BEGIN AGAIN is the same) */
  const GUESTS = [];
  for (let i = 0; i < 18; i++) {
    const id = 'afg' + i;
    EM.CAST[id] = { name: t('GUEST', 'INVITADO', 'CONVIDADO'), look: { skin: (i * 5 + 1) % 6, hair: (i * 4 + 2) % 9, hc: (i * 7 + 3) % 10, expr: 1 + (i % 3), top: (i * 5 + 1) % 11, tc: (i * 7 + 2) % 12, bottom: (i * 3 + 1) % 6, bc: (i * 5 + 2) % 10, acc: (i * 3) % 8, wide: false } };
    GUESTS.push(id);
  }
  let gi = 0;
  const guest = function () { return GUESTS[gi++ % GUESTS.length]; };
  const NF = function () { return function (s) { return !!s.flags.after_go; }; };
  /* a ring of people facing each other, with a gap or not; positions are in tiles; nobody here needs to be talked to */
  const ring = function (zone, key, cx, cy, rx, ry, n, o) {
    o = o || {};
    for (let i = 0; i < n; i++) {
      const a = (o.start || 0) + i * 2 * Math.PI / n, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
      const dir = Math.abs(cx - x) > Math.abs(cy - y) ? (x > cx ? 'l' : 'r') : (y > cy ? 'u' : 'd');
      const d = { id: key + i, cast: guest(), x: Math.round(x * 2) / 2 + 0.01, y: Math.round(y * 2) / 2 + 0.01, dir: dir, decor: true };
      if (o.when) d.when = o.when;
      if (o.pose) d.pose = o.pose;
      zone.npc(d);
    }
  };
  /* the living room: two talking circles, and people dancing on the rug (the dance spots stay free) */
  ring(living, 'afc_a', 23.2, 8.6, 1.6, 1.3, 5, { when: NF() });
  ring(living, 'afc_b', 8.4, 9.4, 2.0, 1.4, 6, { when: NF(), start: 0.5 });
  [[8.5, 8.2], [9.8, 10.4], [11.5, 7.2], [13.6, 8.6], [15.8, 9.8], [17, 7.6], [11.2, 9.4], [14.6, 10.6]].forEach(function (p, i) {
    living.npc({ id: 'afd_' + i, cast: guest(), x: p[0] + 0.01, y: p[1] + 0.01, dir: 'd', decor: true, pose: 'dance', when: NF() });
  });
  /* the balcony: a small circle off the paths */
  ring(Z.a_balcony, 'afc_s', 12.5, 6.2, 1.1, 0.5, 3, { when: NF() });
  /* the courtyard of the club (original coordinates; compact.js moves them): a circle of smokers and talkers */
  if (Z.courtyard) ring(Z.courtyard, 'cc_circle', 21.5, 9, 1.7, 1.3, 5);
})();

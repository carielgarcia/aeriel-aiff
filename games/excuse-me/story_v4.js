/* EXCUSE ME — story v4: the powders (cocaine / ketamine mix-ups), consequences for the hostile crowd,
   running gags that escalate, lessons that only stick when you are clear-headed. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;

  /* ============================================================ THE WHITE POWDERS */
  /* Two white powders look the same in the dark. Whatever you were told, about one time in five it is the other one. */
  function takePowder(told) {
    const swap = Math.random() < 0.2;
    L.dealerHeat();
    story.applyPowder(swap ? (told === 'coke' ? 'ket' : 'coke') : told, told);
  }
  /* what actually happens: used by dealers and by things you bought and carried */
  story.applyPowder = function (real, told) {
    const s = EM.state;
    const swap = real !== told;
    s.flags['told_' + told] = true;
    if (swap) s.flags.powder_mixup = true;
    s.impaired = s.impaired || real === 'ket';
    if (real === 'coke') {
      L.apply({ fx: 'coke', fun: 6, hp: -2, weird: 2, time: 3, flag: 'took_coke' });
      U.toast({ icon: 'spark', text: T('A bitter drip down the back of your throat. Your teeth go numb and every thought arrives under its own spotlight. Your head is clear and fast, and dancing is going to cost you.', 'Un goteo amargo por el fondo de la garganta. Los dientes se te duermen y cada pensamiento llega con su propio reflector. Tienes la cabeza clara y rápida, y bailar te va a costar.', 'Um gotejar amargo no fundo da garganta. Os dentes ficam dormentes e cada pensamento chega com seu próprio holofote. Sua cabeça fica clara e rápida, e dançar vai te custar.'), kind: 'info', ms: 7000 });
    } else if (Math.random() < 0.5) {
      L.apply({ flag: ['took_ket', 'ket_faint'], time: 3 });
      s.pendingFaint = s.time + 3 + Math.floor(Math.random() * 3);
      s.pendingFaintKind = 'ket';
      U.toast({ icon: 'zzz', text: T('Your hands arrive late. The floor starts doing a very gentle impression of a wall. You should sit down. You should have sat down a minute ago.', 'Tus manos llegan tarde. El piso empieza a hacer una imitación muy suave de una pared. Deberías sentarte. Deberías haberte sentado hace un minuto.', 'Suas mãos chegam atrasadas. O chão começa a fazer uma imitação bem suave de uma parede. Você devia sentar. Devia ter sentado um minuto atrás.'), kind: 'bad', ms: 6000 });
    } else {
      L.apply({ fx: 'ket', fun: 12, soc: 14, weird: 3, time: 3, flag: ['took_ket', 'ket_ok'] });
      U.toast({ icon: 'heart', text: T('The room goes soft and kind. Everyone\'s sentences have beautiful edges. Talking to people is suddenly very easy. Things you say land. The floor is a nice distance away.', 'El cuarto se vuelve suave y amable. Las frases de todos tienen bordes hermosos. Hablar con la gente es de pronto muy fácil. Lo que dices cae bien. El piso está a una distancia agradable.', 'A sala fica macia e gentil. As frases de todo mundo têm bordas lindas. Conversar com as pessoas de repente é muito fácil. O que você diz cai bem. O chão está a uma distância agradável.'), kind: 'good', ms: 7000 });
    }
    if (swap) setTimeout(function () {
      U.toast({ icon: 'question', text: T('…that was not what you were told it was. Two white powders look exactly alike in the dark.', '…eso no era lo que te dijeron que era. Dos polvos blancos se ven exactamente iguales en la oscuridad.', '…isso não era o que te disseram que era. Dois pós brancos são exatamente iguais no escuro.'), kind: 'info', ms: 6500 });
    }, 2500);
  };
  S.powder_coke = function () { takePowder('coke'); };
  S.powder_ket = function () { takePowder('ket'); };

  /* Dragan is honest about the label, and honest that labels are a loose concept */
  D.dragan.nodes.b.text = T('He lowers his voice a little. "Small things that make the night go faster. Small, as in: be careful what you ask for. I never push. If you want a bump of coke to get through the night, I have one. I label my bags. I also label my labels. About one time in five the labels have a disagreement, and I will not pretend otherwise."', 'Baja un poco la voz. «Cosas chicas que aceleran la noche. Chicas, en el sentido de: ten cuidado con lo que pides. Yo no empujo a nadie. Si quieres una línea de coca para aguantar la noche, tengo una. Yo etiqueto mis bolsitas. También etiqueto mis etiquetas. Una de cada cinco veces las etiquetas no se ponen de acuerdo, y no voy a fingir lo contrario».', 'Ele baixa um pouco a voz. «Coisas pequenas que fazem a noite andar mais rápido. Pequenas no sentido de: cuidado com o que você pede. Eu nunca empurro. Se quiser um teco de coca pra aguentar a noite, eu tenho. Eu etiqueto meus saquinhos. Também etiqueto minhas etiquetas. Umas uma a cada cinco vezes as etiquetas discordam entre si, e eu não vou fingir o contrário».');
  D.dragan.nodes.b.choices[0] = { tone: 'bold', t: T('"One bump. Just one."', '«Una línea. Solo una».', '«Um teco. Só um».'), do: { flag: 'bought_bump' }, call: 'powder_coke', next: null, react: T('A tiny key, a tiny mountain, a tiny sound. "Good luck," he says, and means it.', 'Una llavecita, una montañita, un sonido chiquito. «Suerte», dice, y lo dice en serio.', 'Uma chavinha, uma montanhazinha, um som pequenininho. «Boa sorte», diz ele, e fala sério.') };

  /* other people offer, too */
  function offer(dlg, node, choice) {
    const n = D[dlg] && D[dlg].nodes[node];
    if (n) n.choices = (n.choices || []).concat([choice]);
  }
  offer('rico', 'what', { tone: 'bold', t: T('"What\'s in the little bag?"', '«¿Qué hay en la bolsita?»', '«O que tem no saquinho?»'), req: { no: 'rico_powder' }, do: { flag: 'rico_powder' }, call: 'powder_ket', next: null, react: T('"K. For the back. Or the soul. Whichever hurts." He taps a small mound onto the back of your hand like a man seasoning a very serious soup.', '«K. Para la espalda. O para el alma. Lo que duela más». Te deja un montoncito en el dorso de la mano como quien sazona una sopa muy seria.', '«K. Pra coluna. Ou pra alma. O que doer mais». Ele deixa um montinho no dorso da sua mão como quem tempera uma sopa muito séria.') });
  offer('hugo', 'a', { tone: 'bold', t: T('He taps a little tin on his belt. "…Is that what I think it is?"', 'Golpea una latita en su cinturón. «…¿Eso es lo que pienso?»', 'Ele bate numa latinha no cinto. «…Isso é o que eu tô pensando?»'), req: { no: 'hugo_powder' }, do: { flag: 'hugo_powder', rep: 0 }, call: 'powder_coke', next: null, react: T('"Ninety-four," Hugo says, very gravely. "The good old recipe." He is, you suspect, an unreliable narrator of his own tin.', '«Noventa y cuatro», dice Hugo, muy grave. «La receta de antes». Sospechas que es un narrador poco confiable de su propia latita.', '«Noventa e quatro», diz o Hugo, muito grave. «A receita de antigamente». Você suspeita que ele seja um narrador pouco confiável da própria latinha.') });

  /* ============================================================ HOSTILE DANCERS: EVERYTHING HAS A PRICE */
  function patch(id, k, extra) { const c = D[id] && D[id].nodes; if (!c) return; }
  ['hostile_0', 'hostile_1', 'hostile_2', 'hostile_3'].forEach(function (id) {
    const a = D[id].nodes.a.choices, esc = D[id].nodes.esc.choices;
    a.forEach(function (c) {
      if (c.tone === 'sorry') { c.do = Object.assign({}, c.do, { time: 2, rep: -0.3, hp: -1, pb: { tato: 1 }, flag: 'hostile_kind' }); }
      else if (c.tone === 'chill') { c.do = Object.assign({}, c.do, { rep: -0.6, pb: { tato: 1 }, flag: 'hostile_kind' }); }
      else if (c.tone === 'blunt') { c.do = Object.assign({}, c.do, { rep: 0.5, pb: { maru: -1, tato: -1 }, flag: 'hostile_rude' }); }
      else if (c.tone === 'care') { c.do = Object.assign({}, c.do, { rep: -1.2, pb: { maru: 1, dani: 1, tato: 1 }, flag: 'hostile_kind' }); }
    });
    esc.forEach(function (c) {
      if (c.tone === 'sorry') { c.do = Object.assign({}, c.do, { rep: -0.3, time: 3, pb: { tato: 1 }, flag: 'hostile_kind' }); }
      else if (c.tone === 'push') { c.do = Object.assign({}, c.do, { rep: 2, pb: { tato: -2, dani: -1, maru: -1 }, flag: ['hostile_rude', 'sec_noted'] }); }
      else if (c.tone === 'silent') { c.do = Object.assign({}, c.do, { rep: 0.2, time: 4, hp: -1 }); }
    });
  });
  const oldGamble = S.hostile_gamble;
  S.hostile_gamble = function () {
    const before = EM.state.stats.fun;
    oldGamble();
    const s = EM.state;
    if (s.stats.fun > before) { L.rep(-1); s.flags.hostile_kind = true; L.apply({ pb: { dani: 1 } }); }
    else { L.rep(1); s.flags.hostile_rude = true; L.apply({ pb: { tato: -1 } }); }
  };

  /* ============================================================ RUNNING GAGS THAT ESCALATE */
  /* addGag(dialogue, node, key, lines): from the 2nd time (across all nights) a new line is appended. */
  function addGag(dlg, node, key, lines) {
    const n = D[dlg] && D[dlg].nodes[node]; if (!n) return;
    const orig = [].concat(n.text || []);
    const base = n.text;
    n.text = function (s) {
      const lvl = (s.gags && s.gags[key]) || 0;
      const base2 = typeof base === 'function' ? [].concat(base(s)) : orig;
      return lvl >= 2 ? base2.concat([lines[Math.min(lvl - 2, lines.length - 1)]]) : base2;
    };
    n.do = Object.assign({}, n.do, { gag: key });
  }
  story.gagLevel = function (s, k) { return (s.gags && s.gags[k]) || 0; };

  addGag('resident', 'a', 'ae', [
    T('ÆRIEL squints. "Hold on. We\'ve met. I\'d remember, but I never remember. I put you on a list anyway, under \'seems familiar\'."', 'ÆRIEL entrecierra los ojos. «Espera. Ya nos conocemos. Me acordaría, pero yo nunca me acuerdo. De todos modos te puse en una lista, bajo “me suena”».', 'ÆRIEL aperta os olhos. «Peraí. A gente já se conheceu. Eu lembraria, mas eu nunca lembro. Te coloquei numa lista mesmo assim, em “parece familiar”».'),
    T('"Third time. The list now has a list of people who keep finding me. You are item three. Item one is a raccoon. We do not talk about the raccoon."', '«Tercera vez. La lista ahora tiene una lista de gente que sigue encontrándome. Eres el número tres. El uno es un mapache. No hablamos del mapache».', '«Terceira vez. A lista agora tem uma lista de gente que não para de me encontrar. Você é o item três. O item um é um guaxinim. A gente não fala do guaxinim».'),
    T('"Fourth. I formed a committee to decide whether you count as a regular. The committee is me wearing a different hat. The hat has a logo."', '«Cuarta. Formé un comité para decidir si cuentas como habitual. El comité soy yo con otro sombrero. El sombrero tiene logo».', '«Quarta. Montei um comitê pra decidir se você conta como frequentador. O comitê sou eu com outro chapéu. O chapéu tem logo».'),
    T('"Fifth. Æ000.X has no loyalty programme. I\'m starting one. The reward is that I do not make you fill in the form."', '«Quinta. Æ000.X no tiene programa de lealtad. Voy a crear uno. El premio es que no te hago llenar el formulario».', '«Quinta. A Æ000.X não tem programa de fidelidade. Vou criar um. O prêmio é eu não te fazer preencher o formulário».'),
    T('"Sixth. I told the spreadsheet about you. The spreadsheet asked for a spreadsheet about you. We are two levels deep and nobody has had water."', '«Sexta. Le conté a la hoja de cálculo sobre ti. La hoja de cálculo pidió una hoja de cálculo sobre ti. Estamos a dos niveles de profundidad y nadie tomó agua».', '«Sexta. Contei da planilha sobre você. A planilha pediu uma planilha sobre você. Estamos dois níveis abaixo e ninguém bebeu água».'),
    T('"Seventh. You\'re in the FAQ now. Question nine: \'Who is that person who keeps coming back?\' Answer: \'Please drink water.\'"', '«Séptima. Ya estás en el FAQ. Pregunta nueve: “¿Quién es esa persona que siempre vuelve?” Respuesta: “Por favor, tome agua”».', '«Sétima. Você já está no FAQ. Pergunta nove: “Quem é essa pessoa que sempre volta?” Resposta: “Por favor, beba água”».'),
    T('"Eighth. I\'ve stopped pretending the door policy is a policy. It is a personality. You\'ve got through it so many times I\'m thinking of asking YOU to run it."', '«Octava. Dejé de fingir que la política de puerta es una política. Es una personalidad. Entraste tantas veces que estoy pensando en pedirte A TI que la manejes».', '«Oitava. Parei de fingir que a política da porta é uma política. É uma personalidade. Você passou tantas vezes que tô pensando em pedir pra VOCÊ cuidar dela».'),
    T('"Ninth, tenth, I lost count. The count is on the list. The list is in the other bag. The other bag is, I think, you. This is home."', '«Novena, décima, perdí la cuenta. La cuenta está en la lista. La lista está en la otra mochila. La otra mochila eres tú, creo. Esta es tu casa».', '«Nona, décima, perdi a conta. A conta está na lista. A lista está na outra mochila. A outra mochila é você, acho. Essa é a sua casa».')
  ]);
  addGag('luca', 'a', 'coat', [
    T('"Same coat, different night? The jacket ecosystem remembers you. The dread is still free. The dread now has a loyalty card."', '«¿Mismo abrigo, otra noche? El ecosistema de chaquetas te recuerda. La angustia sigue siendo gratis. Ahora tiene tarjeta de cliente frecuente».', '«Mesmo casaco, outra noite? O ecossistema de casacos lembra de você. A angústia continua de graça. Agora ela tem cartão fidelidade».'),
    T('"I hired a second jacket to supervise the first. The first jacket is not taking it well."', '«Contraté una segunda chaqueta para supervisar a la primera. La primera no lo está tomando bien».', '«Contratei um segundo casaco pra supervisionar o primeiro. O primeiro não tá levando bem».'),
    T('"The coats formed a union. They want an air-conditioned hook. I told them this is Æ000.X, nothing here is air-conditioned, including the hook\'s feelings."', '«Los abrigos formaron un sindicato. Quieren un gancho con aire acondicionado. Les dije que esto es Æ000.X, nada aquí tiene aire acondicionado, incluidos los sentimientos del gancho».', '«Os casacos fundaram um sindicato. Querem um cabide com ar-condicionado. Eu disse que aqui é Æ000.X, nada tem ar-condicionado, nem os sentimentos do cabide».'),
    T('"The cloakroom has a waiting list now. You are on it. The waiting list is hanging on a hook. The hook is on a list."', '«El guardarropa ahora tiene lista de espera. Estás en ella. La lista de espera cuelga de un gancho. El gancho está en una lista».', '«A chapelaria agora tem lista de espera. Você está nela. A lista de espera tá pendurada num cabide. O cabide tá numa lista».')
  ]);
  addGag('hugo', 'a', 'old', [
    T('"Ninety-four. I know, I know. Last time I said that I added a minute. It\'s ninety-four and a half now."', '«Noventa y cuatro. Ya sé, ya sé. La última vez que lo dije le agregué un minuto. Ahora es noventa y cuatro y medio».', '«Noventa e quatro. Eu sei, eu sei. Da última vez que falei isso acrescentei um minuto. Agora é noventa e quatro e meio».'),
    T('"In ninety-four there was no list. Now there is a list for the list. Back then we called that \'a friend with a flyer\'."', '«En el noventa y cuatro no había lista. Ahora hay una lista para la lista. Antes eso se llamaba “un amigo con un volante”».', '«Em noventa e quatro não tinha lista. Agora tem lista pra lista. Antigamente isso se chamava “um amigo com um flyer”».'),
    T('"I\'ve been on the list since the list was a napkin. I still have the napkin. The napkin has opinions."', '«Estoy en la lista desde que la lista era una servilleta. Todavía tengo la servilleta. La servilleta tiene opiniones».', '«Tô na lista desde que a lista era um guardanapo. Ainda tenho o guardanapo. O guardanapo tem opiniões».'),
    T('"They made a list of founding members. Four of us. One is the napkin. The napkin did not RSVP."', '«Hicieron una lista de miembros fundadores. Somos cuatro. Uno es la servilleta. La servilleta no confirmó asistencia».', '«Fizeram uma lista dos membros fundadores. Somos quatro. Um é o guardanapo. O guardanapo não confirmou presença».')
  ]);
  /* Dragan, by night count */
  D.dragan.nodes.again.text = function (s) {
    const n = s.attempt || 2;
    if (n <= 2) return T('He looks at you for a beat too long. "You again." He frowns. "Strange. I don\'t know why I said that." He taps the clipboard twice. "Name?"', 'Te mira un segundo de más. «Tú otra vez». Frunce el ceño. «Qué raro. No sé por qué dije eso». Golpea la carpeta dos veces. «¿Nombre?»', 'Ele te olha um segundo a mais. «Você de novo». Franze a testa. «Estranho. Não sei por que eu disse isso». Bate na prancheta duas vezes. «Nome?»');
    if (n === 3) return T('He lowers the clipboard. "Third time tonight. I do not have a third time in my notes. I made a tally on the back. Left column: names. Right column: you." The right column is only you.', 'Baja la carpeta. «Tercera vez esta noche. No tengo una tercera vez en mis notas. Hice un conteo atrás. Columna izquierda: nombres. Columna derecha: tú». La columna derecha eres solo tú.', 'Ele abaixa a prancheta. «Terceira vez esta noite. Não tenho uma terceira vez nas minhas anotações. Fiz uma contagem atrás. Coluna esquerda: nomes. Coluna direita: você». A coluna direita é só você.');
    if (n === 4) return T('"Fourth. I asked management for a list of the people who come back. They said that is also this list. The list of exceptions now has a list of exceptions. You are an exception to the exceptions." He seems, honestly, moved.', '«Cuarta. Le pedí a la gerencia una lista de la gente que vuelve. Dijeron que esa también es esta lista. La lista de excepciones ahora tiene una lista de excepciones. Eres una excepción de las excepciones». Parece, de verdad, conmovido.', '«Quarta. Pedi pra gerência uma lista das pessoas que voltam. Disseram que essa também é esta lista. A lista de exceções agora tem uma lista de exceções. Você é uma exceção das exceções». Ele parece, de verdade, emocionado.');
    return T('He hands you the clipboard. "I\'m just going to pretend you\'re the one checking me in. Name?" A pause. "…Exactly. This is your door."', 'Te pasa la carpeta. «Voy a fingir que tú eres quien me registra a mí. ¿Nombre?» Una pausa. «…Exacto. Esta es tu puerta».', 'Ele te entrega a prancheta. «Vou fingir que é você quem tá me registrando. Nome?» Uma pausa. «…Exatamente. Essa é a sua porta».');
  };
  /* friends get déjà vu */
  const oldTick = story.tick;
  story.tick = function (dt) {
    oldTick(dt);
    const s = EM.state; if (!s || (s.attempt || 1) < 2 || !s.party.length) return;
    story._dvT = (story._dvT || 60) - dt;
    if (story._dvT > 0) return;
    story._dvT = 70 + Math.random() * 60;
    const lvl = Math.min(4, s.attempt - 1);
    const f = EM.pick(s.party);
    const LINES = {
      maru: [
        T('MARU: "Weird. I\'ve had this exact thought about the queue before."', 'MARU: «Qué raro. Ya tuve exactamente este pensamiento sobre la fila».', 'MARU: «Estranho. Já tive exatamente esse pensamento sobre a fila antes».'),
        T('MARU: "Have we done this before? Do not answer. I will get sad."', 'MARU: «¿Ya hicimos esto antes? No contestes. Me voy a poner triste».', 'MARU: «A gente já fez isso antes? Não responde. Vou ficar triste».'),
        T('MARU: "I am going to start writing notes to myself on my arm. The note says: believe them."', 'MARU: «Voy a empezar a escribirme notas en el brazo. La nota dice: créeles».', 'MARU: «Vou começar a escrever bilhetes pra mim no braço. O bilhete diz: acredita neles».'),
        T('MARU: "At this point I should just run the door."', 'MARU: «A estas alturas debería manejar yo la puerta».', 'MARU: «A essa altura eu devia tocar a porta».')
      ],
      dani: [
        T('DANI: "Have we done this before? I have the strangest feeling about the toilets."', 'DANI: «¿Ya hicimos esto antes? Tengo la sensación más rara con los baños».', 'DANI: «A gente já fez isso antes? Tô com a sensação mais estranha sobre os banheiros».'),
        T('DANI: "I think I\'ve already hugged that exact person. It was great both times."', 'DANI: «Creo que ya abracé a esa persona exacta. Estuvo genial las dos veces».', 'DANI: «Acho que eu já abracei exatamente essa pessoa. Foi ótimo nas duas vezes».'),
        T('DANI: "Déjà vu is just the universe going: you again! I love that for us."', 'DANI: «El déjà vu es el universo diciendo: ¡tú otra vez! Eso me encanta para nosotros».', 'DANI: «Déjà vu é o universo falando: você de novo! Eu amo isso pra nós».'),
        T('DANI: "Okay but what if it\'s the same night forever and it keeps being good?"', 'DANI: «Pero ¿y si es la misma noche para siempre y sigue siendo buena?»', 'DANI: «Mas e se for a mesma noite pra sempre e continuar sendo boa?»')
      ],
      tato: [
        T('TATO: "I know I said I\'m fine. I\'m fine in a way that feels rehearsed."', 'TATO: «Sé que dije que estoy bien. Estoy bien de una forma que se siente ensayada».', 'TATO: «Sei que falei que tô bem. Tô bem de um jeito que parece ensaiado».'),
        T('TATO: "Is it weird that I know where the water is?"', 'TATO: «¿Es raro que sepa dónde está el agua?»', 'TATO: «É estranho eu saber onde tá a água?»'),
        T('TATO: "I think the DJ knows us. That\'s not a thing, right?"', 'TATO: «Creo que el DJ nos conoce. Eso no es una cosa, ¿verdad?»', 'TATO: «Acho que a DJ conhece a gente. Isso não é uma coisa, né?»'),
        T('TATO: "Next time I want a different coat. For continuity."', 'TATO: «La próxima quiero otra chaqueta. Por continuidad».', 'TATO: «Da próxima quero outro casaco. Por continuidade».')
      ]
    };
    const pool = LINES[f]; if (pool) U.toast({ text: pool[lvl - 1], kind: 'bark', ms: 4200 });
  };


  /* ============================================================ THE ILLEGAL RAVE */
  (function () {
    const n = D.intro.nodes.a, orig = [].concat(n.text);
    const RAVE0 = T('LA GRIETA. 23:00. The licence ran out at nine and nobody told the speakers. No door, no list, no guards: a neon crack in the wall, a crowd under it, and you, an hour late. The group chat is a graveyard of "where r u".', 'LA GRIETA. 23:00. La licencia venció a las nueve y nadie se lo dijo a los parlantes. Sin puerta, sin lista, sin guardias: una grieta de neón en la pared, una multitud debajo, y tú, una hora tarde. El chat del grupo es un cementerio de «dónde estás».', 'LA GRIETA. 23:00. A licença venceu às nove e ninguém avisou as caixas de som. Sem porta, sem lista, sem seguranças: uma rachadura de neon na parede, uma multidão embaixo, e você, com uma hora de atraso. O grupo no chat é um cemitério de «cadê você».');
    const RAVE2 = T('Four bars matter: FUN, SOCIAL BATTERY, HEALTH, and WEIRDNESS. There is no security here. Let WEIRDNESS fill up and the crowd closes around you and the night is over. In a crowd, press Z to say EXCUSE ME. It is cheap. It is also a whole philosophy.', 'Cuatro barras importan: DIVERSIÓN, BATERÍA SOCIAL, SALUD y RAREZA. Aquí no hay seguridad. Si la RAREZA se llena, la multitud se cierra a tu alrededor y la noche termina. En una multitud, presiona Z para decir CON PERMISO. Es barato. También es una filosofía entera.', 'Quatro barras importam: DIVERSÃO, BATERIA SOCIAL, SAÚDE e ESTRANHEZA. Aqui não tem segurança. Se a ESTRANHEZA encher, a multidão se fecha em volta de você e a noite acaba. Na multidão, aperte Z para dizer COM LICENÇA. É barato. Também é uma filosofia inteira.');
    n.text = function (s) { return s.venue === 'rave' ? [RAVE0, orig[1], RAVE2] : orig; };
  })();
  EM.ENDINGS.frozenout = {
    art: 'road', music: 'chill', lp: 800, reset: true,
    title: T('THE CROWD CLOSES UP', 'LA MULTITUD SE CIERRA', 'A MULTIDÃO SE FECHA'),
    lesson: T('Last time the crowd closed up. No guards here: your own strangeness is the only door policy.', 'La última vez la multitud se cerró. Aquí no hay guardias: tu propia rareza es la única política de puerta.', 'Da última vez a multidão se fechou. Aqui não tem segurança: a sua própria estranheza é a única política de porta.'),
    text: [
      T('Nobody throws you out, because nobody is in charge. It is simply that the circle around you widens by a step, and then another, and every face turns politely toward the speaker. At the edge of the warehouse a stranger hands you a cup of water without a word.', 'Nadie te echa, porque nadie manda. Es solo que el círculo a tu alrededor se ensancha un paso, y luego otro, y todas las caras se vuelven con cortesía hacia el parlante. En el borde del galpón un desconocido te da un vaso de agua sin decir nada.', 'Ninguém te expulsa, porque ninguém manda. É só que o círculo em volta de você se alarga um passo, e depois outro, e todos os rostos se voltam com educação pro alto-falante. No canto do galpão um estranho te entrega um copo d\'água sem dizer nada.'),
      T('You walk out under the stars with your friends\' footsteps behind you. It is a very long time until morning. It is also, somehow, 22:00.', 'Sales bajo las estrellas con los pasos de tus amigos detrás. Falta muchísimo para la mañana. Y también, de algún modo, son las 22:00.', 'Você sai sob as estrelas com os passos dos seus amigos atrás. Falta muito tempo pra manhã. E também, de algum jeito, são 22:00.')
    ]
  };

  /* ============================================================ MEMORY: ONLY THE CLEAR-HEADED LEARN */
  /* what to carry into the next night */
  story.memory = function (old, ed) {
    const lessons = (old.lessons || []).slice();
    const mem = { lessons: lessons, forgot: false, recap: [] }; /* a stimulant keeps your head clear: you keep the same lessons a sober person would */
    if (ed && ed.lesson) {
      if (!old.impaired || old.remembers) lessons.push(ed.lesson); else mem.forgot = true;
    }
    return mem;
  };
  S.show_lessons = function () {
    const s = EM.state;
    let i = 0;
    const say = function (txt, kind) { setTimeout(function () { U.toast({ icon: 'question', text: txt, kind: kind || 'info', ms: 7500 }); }, 500 + (i++) * 900); };
    (s.lessons || []).slice(-3).forEach(function (l) { say(l); });
    if (s.forgot) say(T('You wake up with the feeling that something went badly last time. You cannot remember what. It was warm, it was loud, and the details were poured out of you.', 'Despiertas con la sensación de que la última vez salió mal. No recuerdas qué. Fue cálido, fue ruidoso, y los detalles se te escurrieron.', 'Você acorda com a sensação de que da última vez deu errado. Não lembra o quê. Foi quente, foi barulhento, e os detalhes escorreram de você.'), 'bad');
  };
})();

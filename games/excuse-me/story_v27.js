/* EXCUSE ME — story v27: the retrace pass over the main missions and side quests, in the spirit of Æ000.X (trust, care, fair pay
   for the people who run the night, no photos, harm reduction without moralising, the dancing taken seriously and ourselves lightly).
   The clock floors are gone (logic.js). Here: completion lines for the quests that had none, a stranger filming at the pillar, Maru's
   bladder, Mika remembering a lie, Rosa's nod, a sonic inquiry at the drop, one unique joke per lost friend, the jacket (Tico),
   Isi's reagent line, funnier finales, ÆRIEL saying whom they listened to, and the team on the stairs of the roof. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const arr = function (x) { return [].concat(x); };

  /* ============================================================ the log: every quest ends with a line */
  const DONE = {
    q9: t(`The sun came up on the roof with your people on it, and the set was theirs.`, `El sol salió sobre el techo con tu gente ahí arriba, y el set fue de ellos.`, `O sol nasceu no terraço com sua galera lá em cima, e o set foi deles.`),
    sq_kai: t(`Kai got the nine-volt and played a song for somebody nervous. Somebody nervous heard it.`, `Kai consiguió la pila de nueve voltios y tocó una canción para alguien nervioso. Alguien nervioso la oyó.`, `O Kai conseguiu a pilha de nove volts e tocou uma música pra alguém nervoso. Alguém nervoso ouviu.`),
    sq_lamp: t(`The attic went rose-pink. Benjamin was told, kindly, to say hello. He is practising.`, `El ático se volvió rosa. Le dijeron a Benjamin, con cariño, que saludara. Está practicando.`, `O sótão ficou rosa. Disseram ao Benjamin, com carinho, pra ele dizer oi. Ele tá treinando.`),
    sq_sia: t(`Sia finished the poem with a warm word, a brave word and a silly one.`, `Sia terminó el poema con una palabra cálida, una valiente y una tonta.`, `A Sia terminou o poema com uma palavra quente, uma corajosa e uma boba.`),
    sq_isi: t(`The quiet room ate. Isi's wristband is yours, and so is the cheese.`, `La sala tranquila comió. La pulsera de Isi es tuya, y el queso también.`, `A sala de calma comeu. A pulseira da Isi é sua, e o queijo também.`)
  };
  Object.keys(DONE).forEach(function (k) { if (EM.QUESTS[k]) EM.QUESTS[k].doneText = DONE[k]; });

  /* ============================================================ the pillar: somebody is filming */
  EM.CAST.filmer = { name: 'STRANGER', look: { skin: 0, hair: 5, hc: 4, expr: 3, top: 3, tc: 6, bottom: 1, bc: 2, acc: 0, wide: false } };
  D.filmer = {
    who: 'filmer', role: t('PHONE UP', 'CELULAR EN ALTO', 'CELULAR PRA CIMA'), start: 'a', nodes: {
      a: {
        text: t(`A stranger holds a phone over the dancers, panning slowly, mouthing a caption. "Sorry, it's for my story. It's a vibe." The camera sticker on the back is peeled off.`, `Un desconocido sostiene un celular sobre los bailarines, paneando despacio y murmurando un texto. «Perdón, es para mi historia. Es un vibe». La pegatina de la cámara está despegada.`, `Um desconhecido segura um celular acima de quem dança, fazendo uma panorâmica lenta e murmurando uma legenda. «Desculpa, é pro meu story. É uma vibe». O adesivo da câmera foi arrancado.`),
        choices: [
          K('honest', t(`"Ask first. They didn't agree to be in your story. Please put it away."`, `«Pregunta primero. Nadie aceptó salir en tu historia. Guárdalo, por favor».`, `«Pergunta primeiro. Ninguém aceitou aparecer no seu story. Guarda isso, por favor».`), { do: { soc: 2, fun: 3, flag: 'filmer_done', care: 1 }, next: null, react: t(`"Oh. Oh no. I thought this was a museum." He deletes the clip while you watch, apologises to a pillar, and puts the phone in his sock.`, `«Ay. Ay no. Pensé que esto era un museo». Borra el video mientras miras, le pide perdón a un pilar y se guarda el celular en el calcetín.`, `«Ai. Ai não. Achei que isso era um museu». Ele apaga o vídeo enquanto você olha, pede desculpa pra um pilar e guarda o celular na meia.`) }),
          K('joke', t(`"Nine percent battery. Mine. Yours is going to die in the first chorus."`, `«Nueve por ciento de batería. La mía. La tuya se muere en el primer estribillo».`, `«Nove por cento de bateria. A minha. A sua vai morrer no primeiro refrão».`), { do: { fun: 3, flag: 'filmer_done' }, next: null, react: t(`He checks his battery. It is at 4%. He lowers the phone with something like relief.`, `Mira su batería. Tiene 4%. Baja el celular con algo parecido al alivio.`, `Ele confere a bateria. Tá em 4%. Abaixa o celular com algo parecido com alívio.`) }),
          K('chill', t(`Let it go.`, `Dejarlo pasar.`, `Deixar pra lá.`), { free: true, next: null })
        ]
      }
    }
  };
  Z.main.npc({ id: 'filmer', x: 8.2, y: 11.5, dlg: 'filmer', dir: 'r', reach: 16, when: function (s) { return !s.flags.filmer_done && s.time < 300; } });

  /* ============================================================ Maru's bladder, and what she owes you */
  const MARU = [
    t(`MARU: "I'm fine. Everything is fine. Where is the toilet. Is the toilet a myth."`, `MARU: «Estoy bien. Todo está bien. ¿Dónde está el baño? ¿El baño es un mito?»`, `MARU: «Tô bem. Tá tudo bem. Cadê o banheiro? O banheiro é um mito?»`),
    t(`MARU: "I'm composing a eulogy for my bladder. It was brave. It was loved."`, `MARU: «Estoy componiendo un elogio fúnebre para mi vejiga. Fue valiente. Fue querida».`, `MARU: «Tô compondo um elogio fúnebre pra minha bexiga. Foi corajosa. Foi amada».`),
    t(`MARU: "Tell my mother I was brave. Then tell her I need a stall."`, `MARU: «Dile a mi mamá que fui valiente. Luego dile que necesito una cabina».`, `MARU: «Fala pra minha mãe que eu fui corajosa. Depois fala que eu preciso de uma cabine».`)
  ];
  let q2t = 0, q2n = 0;
  /* ============================================================ Mika remembers a lie; Rosa nods on the short route */
  S.v27_rosa_nod = function () {
    U.toast({ icon: 'cross', kind: 'info', ms: 6000, text: t(`On the way out, Rosa nods at you over the mop. She has counted you once and decided to let it go.`, `Al salir, Rosa te asiente por encima del trapeador. Te contó una vez y decidió dejarlo pasar.`, `Na saída, a Rosa assente pra você por cima do esfregão. Ela te contou uma vez e decidiu deixar pra lá.`) });
  };
  ['agree', 'no'].forEach(function (n) {
    const node = D.stall_split && D.stall_split.nodes[n];
    if (node) node.do = Object.assign({}, node.do, { call: 'v27_rosa_nod' });
  });
  const enter0 = story.enter;
  story.enter = function (zone) {
    const prev = EM.state && EM.state.zone;
    enter0(zone);
    const s = EM.state; if (!s) return;
    if (s.flags.host_lied && !s.flags.host_lie_called && zone !== 'restrooms') {
      s.flags.host_lie_called = true;
      L.apply({ soc: -2, weird: 3 });
      U.toast({ icon: 'eyes', kind: 'bad', ms: 6500, text: t(`A radio crackles near you. MIKA: "I told you I'd know." That was Mika's whole sentence.`, `Una radio crepita cerca de ti. MIKA: «Te dije que lo sabría». Esa fue toda la frase de Mika.`, `Um rádio chia perto de você. MIKA: «Eu disse que ia saber». Essa foi a frase inteira do Mika.`) });
    }
    if (zone === 'rooftop' && s.flags.roof_open && !s.flags.team_thanks_done) s.flags.team_pending = true;
  };

  /* ============================================================ the drop: a sonic inquiry */
  if (D.the_drop && D.the_drop.nodes.after) {
    const aft = D.the_drop.nodes.after;
    aft.text = [].concat(aft.text, t(`Somewhere in the spiral a stranger in a bucket hat shouts "THIS IS A SONIC INQUIRY!" and about a hundred people answer "YES!" Nobody has read the FAQ. Everybody knows it.`, `En algún punto de la espiral un desconocido con gorro de pescador grita «¡ESTO ES UNA INDAGACIÓN SONORA!» y unas cien personas responden «¡SÍ!» Nadie leyó el FAQ. Todos lo saben.`, `Em algum ponto da espiral um desconhecido de chapéu de pescador grita «ISSO É UMA INVESTIGAÇÃO SONORA!» e umas cem pessoas respondem «SIM!» Ninguém leu o FAQ. Todo mundo sabe.`));
  }

  /* ============================================================ each lost friend gets a joke of their own */
  const JOKES = {
    found_dani_darkroom: ['dani', t(`"Is this a pile or a committee?"`, `«¿Esto es una pila o un comité?»`, `«Isso é uma pilha ou um comitê?»`), t(`"A pile with minutes!" He takes the minutes. They say: "hug".`, `«¡Una pila con actas!» Toma el acta. Dice: «abrazo».`, `«Uma pilha com ata!» Ele registra a ata. Diz: «abraço».`)],
    found_dani_attic: ['dani', t(`"Dani, the DJ asked who you were. I said a capybara."`, `«Dani, el DJ preguntó quién eras. Dije que un capibara».`, `«Dani, o DJ perguntou quem você era. Eu disse que uma capivara».`), t(`"…I AM." He bows to the whole cult, which bows back, wired and sincere.`, `«…LO SOY». Le hace una reverencia a toda la secta, que se la devuelve, acelerada y sincera.`, `«…EU SOU». Ele faz uma reverência pra seita inteira, que retribui, acelerada e sincera.`)],
    found_dani_welfare: ['dani', t(`"Is the chair for the vibes or for the dizziness?"`, `«¿La silla es por el vibe o por el mareo?»`, `«A cadeira é pela vibe ou pela tontura?»`), t(`"The vibes! Mostly vibes. Eighty per cent vibes." Teo, from across the room: "Sixty."`, `«¡El vibe! Casi todo vibe. Ochenta por ciento vibe». Teo, desde el otro lado: «Sesenta».`, `«A vibe! Quase tudo vibe. Oitenta por cento vibe». O Teo, do outro lado: «Sessenta».`)],
    found_dani_tunnel: ['dani', t(`"The acoustics in here are great. The acoustics on the main floor are better."`, `«La acústica aquí es genial. La de la pista principal es mejor».`, `«A acústica aqui é ótima. A da pista principal é melhor».`), t(`"BETTER?" He is already walking, shouting about reverb at his own echo, which agrees.`, `«¿MEJOR?» Ya camina, gritándole sobre reverb a su propio eco, que está de acuerdo.`, `«MELHOR?» Ele já tá andando, gritando sobre reverb pro próprio eco, que concorda.`)],
    found_dani_courtyard: ['dani', t(`Point at the lighter. "That's not yours."`, `Señalar el encendedor. «Ese no es tuyo».`, `Apontar o isqueiro. «Esse não é seu».`), t(`"I'M HOLDING IT FOR A FRIEND. THE FRIEND IS THE CAT." The cat looks at you. The cat is not a friend.`, `«LO TENGO PARA UN AMIGO. EL AMIGO ES EL GATO». El gato te mira. El gato no es amigo.`, `«TÔ SEGURANDO PRA UM AMIGO. O AMIGO É O GATO». O gato te olha. O gato não é amigo.`)],
    found_tato_courtyard: ['tato', t(`"Are you here for the conversations?"`, `«¿Estás aquí por las conversaciones?»`, `«Você tá aqui pelas conversas?»`), t(`"I'm collecting them. I have eleven. Nobody's counting." He is counting.`, `«Las estoy coleccionando. Tengo once. Nadie las cuenta». Las cuenta.`, `«Tô colecionando. Tenho onze. Ninguém tá contando». Ele tá contando.`)],
    found_tato_welfare: ['tato', t(`"Rank the mattresses."`, `«Ordena los colchones».`, `«Classifica os colchões».`), t(`"This one's a solid seven. The one by the plant is a nine, but it has a plant." He is better already.`, `«Este es un siete sólido. El de la planta es un nueve, pero tiene planta». Ya está mejor.`, `«Esse é um sete sólido. O da planta é um nove, mas tem planta». Ele já tá melhor.`)]
  };
  Object.keys(JOKES).forEach(function (id) {
    const d = D[id]; if (!d || !d.nodes.a || !d.nodes.a.choices) return;
    const j = JOKES[id], f = j[0], b = {}; b[f] = 1;
    d.nodes.a.choices.splice(d.nodes.a.choices.length - 1, 0, K('joke', j[1], { do: { join: f, call: 'regroup_check', fun: 5, bond: b }, next: null, react: j[2] }));
  });

  /* ============================================================ the capybara, in the set talk */
  if (D.need_tell_dani) {
    const nd = D.need_tell_dani.nodes.a;
    nd.text = [].concat(nd.text, t(`"Also: I'm a capybara now. I've been meaning to say. It's going well."`, `«Además: ahora soy un capibara. Quería decirlo. Me está yendo bien».`, `«Além disso: agora sou uma capivara. Eu queria dizer. Tá indo bem».`));
  }

  /* ============================================================ ÆRIEL says whom they listened to */
  if (D.sunrise) {
    const SD = D.sunrise.nodes;
    if (SD.src_frames) {
      const tf = SD.src_frames.text;
      SD.src_frames.text = function (s) { return arr(tf(s)).concat(t(`ÆRIEL, to the crate and nobody else: "I listened to FRAMES. FRAMES listened to you."`, `ÆRIEL, al cajón y a nadie más: «Escuché a FRAMES. FRAMES te escuchó a ti».`, `A ÆRIEL, pro caixote e mais ninguém: «Eu escutei o FRAMES. O FRAMES escutou você».`)); };
    }
    if (SD.src_friends) {
      const tr = SD.src_friends.text;
      SD.src_friends.text = function (s) { return arr(tr(s)).concat(t(`ÆRIEL, along the rail: "I listened to your people. Through you."`, `ÆRIEL, a lo largo de la baranda: «Escuché a tu gente. A través de ti».`, `A ÆRIEL, ao longo do parapeito: «Eu escutei sua galera. Através de você».`)); };
    }
  }

  /* ============================================================ the jacket: Tico, and Isi's reagent */
  if (D.tico) {
    D.tico.nodes.st = { branch: [{ req: function (s) { return !!(s.flags.pill_known && L.hasFriend('dani') && !s.flags.tico_jacket); }, to: 'jacket' }, { req: function () { return true; }, to: 'a' }] };
    D.tico.nodes.jacket = {
      text: [
        t(`DANI, pointing, voice cracking with joy: "THAT'S THE JACKET."`, `DANI, señalando, con la voz quebrada de alegría: «ESA ES LA CHAQUETA».`, `O DANI, apontando, com a voz falhando de alegria: «ESSA É A JAQUETA».`),
        t(`Tico adjusts his collar, unhurried. "It's a very good jacket. Lots of pockets. I'm a menu, standing up." A beat. "Can I help you?"`, `Tico se ajusta el cuello, sin prisa. «Es una chaqueta muy buena. Muchos bolsillos. Soy un menú de pie». Una pausa. «¿Puedo ayudarte?»`, `O Tico ajeita a gola, sem pressa. «É uma jaqueta muito boa. Muitos bolsos. Sou um cardápio em pé». Uma pausa. «Posso ajudar?»`)
      ],
      choices: [
        K('care', t(`"Show your pockets to Isi's table. A free look, no names."`, `«Muéstrale tus bolsillos a la mesa de Isi. Una revisión gratis, sin nombres».`, `«Mostra seus bolsos pra mesa da Isi. Uma olhada de graça, sem nomes».`), { do: { care: 1, soc: 2, flag: ['tico_jacket', 'tico_isi'] }, next: null, react: t(`Tico looks at the jacket as if it had spoken. "Isi doesn't take names." A long pause. "I'll think about it. The jacket is not a reagent. I know."`, `Tico mira la chaqueta como si hubiera hablado. «Isi no toma nombres». Una pausa larga. «Lo voy a pensar. La chaqueta no es un reactivo. Lo sé».`, `O Tico olha a jaqueta como se ela tivesse falado. «A Isi não anota nomes». Uma pausa longa. «Vou pensar. Jaqueta não é reagente. Eu sei».`) }),
        K('joke', t(`"It is a good jacket. Sincerely."`, `«Es una buena chaqueta. En serio».`, `«É uma boa jaqueta. Sério».`), { do: { fun: 5, flag: 'tico_jacket' }, next: 'a', react: t(`"Thank you." For one second Tico is a man in a jacket and nothing else.`, `«Gracias». Por un segundo Tico es un hombre con una chaqueta y nada más.`, `«Obrigado». Por um segundo o Tico é um homem de jaqueta e mais nada.`) }),
        K('chill', t(`Walk away with Dani.`, `Alejarte con Dani.`, `Sair com o Dani.`), { free: true, do: { flag: 'tico_jacket' }, next: null })
      ]
    };
    D.tico.start = 'st';
  }
  if (D.nuri && D.nuri.nodes.bring) {
    const b = D.nuri.nodes.bring, old = b.text;
    b.text = function (s) {
      const out = arr(typeof old === 'function' ? old(s) : old).slice();
      out.push(t(`Isi, writing without a name in the notebook: "A nice jacket is not a reagent."`, `Isi, anotando sin nombre en el cuaderno: «Una chaqueta bonita no es un reactivo».`, `A Isi, anotando sem nome no caderno: «Jaqueta bonita não é reagente».`));
      if (s.flags.tico_isi) out.push(t(`"The jacket guy. Tico. He stands near my table and asks for nothing. That's why I let him."`, `«El de la chaqueta. Tico. Se para cerca de mi mesa y no pide nada. Por eso lo dejo».`, `«O cara da jaqueta. Tico. Fica perto da minha mesa e não pede nada. É por isso que eu deixo».`));
      return out;
    };
  }

  /* ============================================================ finales with a joke */
  if (D.sia && D.sia.nodes.final) {
    const f = D.sia.nodes.final, ot = f.text;
    f.text = function (s) { return arr(typeof ot === 'function' ? ot(s) : ot).concat(t(`The queue behind you has been listening. It claps. Ruth, not looking up: "It rhymes. Technically."`, `La fila detrás de ti estuvo escuchando. Aplaude. Ruth, sin levantar la vista: «Rima. Técnicamente».`, `A fila atrás de você ficou ouvindo. Aplaude. A Ruth, sem levantar o olhar: «Rima. Tecnicamente».`)); };
  }
  if (D.nuri && D.nuri.nodes.fed) {
    const f = D.nuri.nodes.fed, ot = f.text;
    f.text = function (s) { return arr(typeof ot === 'function' ? ot(s) : ot).concat(t(`On the table a new sign appears in marker: FREE WATER. FREE ADVICE. THE CHEESE IS NOT FREE, IT IS A GIFT.`, `En la mesa aparece un cartel nuevo en plumón: AGUA GRATIS. CONSEJOS GRATIS. EL QUESO NO ES GRATIS, ES UN REGALO.`, `Na mesa aparece uma placa nova de caneta: ÁGUA DE GRAÇA. CONSELHO DE GRAÇA. O QUEIJO NÃO É DE GRAÇA, É UM PRESENTE.`)); };
  }

  /* ============================================================ the team on the stairs of the roof */
  const TEAM = [
    { ok: function (s) { return !!(s.flags.rosa_lanyard || s.flags.rosa_ally); }, t: t(`ROSA, mop upright, a thermos at her feet: "The lanyard looks good on you. Don't tell them I said it."`, `ROSA, con el trapeador en vertical y un termo a los pies: «La credencial te queda bien. No les digas que lo dije».`, `A ROSA, de esfregão em pé e uma garrafa térmica aos pés: «O crachá combina com você. Não conta que eu disse».`) },
    { ok: function (s) { return !!(s.flags.phone_returned || s.flags.closet_key); }, t: t(`LUCA hands you a coat check ticket for nothing at all. "Your jacket is checked. Your dread is free."`, `LUCA te da un ticket de guardarropa por nada. «Tu abrigo está guardado. La angustia es gratis».`, `O LUCA te entrega um ticket de chapelaria por nada. «Sua jaqueta tá guardada. A angústia é de graça».`) },
    { ok: function (s) { return !!(s.flags.isi_fed || (s.pill && s.pill.tested)); }, t: t(`ISI, with a sandwich and a notebook: "I'm off the table until six. Water's on me. Nobody takes names."`, `ISI, con un sándwich y un cuaderno: «Estoy fuera de la mesa hasta las seis. El agua va por mi cuenta. Nadie toma nombres».`, `A ISI, com um sanduíche e um caderno: «Tô fora da mesa até as seis. A água é por minha conta. Ninguém anota nome».`) },
    { ok: function (s) { return !!(s.flags.host_ok_group && !s.flags.host_lied); }, t: t(`MIKA, clipboard under one arm: "One person per stall. You were good about it. I'll say it once."`, `MIKA, con la carpeta bajo un brazo: «Una persona por cabina. Te portaste bien. Lo digo una vez».`, `O MIKA, de prancheta debaixo do braço: «Uma pessoa por cabine. Você se saiu bem. Eu digo uma vez só».`) },
    { ok: function (s) { return !!s.flags.dario_rules; }, t: t(`DARIO, in the dark of the stairwell: "You asked first. Keep asking."`, `DARIO, en la oscuridad de la escalera: «Preguntaste primero. Sigue preguntando».`, `O DARIO, no escuro da escada: «Você perguntou primeiro. Continua perguntando».`) },
    { ok: function () { return true; }, t: t(`DRAGAN, from the bottom step: "Nobody in there owes you a good night. You gave a few anyway."`, `DRAGAN, desde el último escalón: «Nadie ahí adentro te debe una buena noche. Igual diste unas cuantas».`, `O DRAGAN, do último degrau: «Ninguém lá dentro te deve uma boa noite. Você deu algumas mesmo assim».`) }
  ];
  D.team_thanks = {
    role: t('THE TEAM', 'EL EQUIPO', 'A EQUIPE'), forced: true, start: 'a', nodes: {
      a: {
        text: function (s) {
          const lines = TEAM.filter(function (m) { return m.ok(s); }).map(function (m) { return m.t; });
          return [t(`The roof is open. On the stairs, in lanyards, with mops and clipboards and a first-aid bag, are the people who held the night up so everyone could dance on it.`, `El techo está abierto. En la escalera, con credenciales, trapeadores, carpetas y un botiquín, están quienes sostuvieron la noche para que todos bailaran encima.`, `O terraço tá aberto. Na escada, de crachá, com esfregões, pranchetas e uma maleta de primeiros socorros, estão as pessoas que sustentaram a noite pra todo mundo dançar em cima dela.`)]
            .concat(lines, t(`That is what the ticket is for. Cleaning, doors, medics, harm reduction, the DJ's fee: all of it is somebody's work, and all of it is fairly paid. Say thank you out loud.`, `Para eso es la entrada. Limpieza, puertas, paramédicos, reducción de daños, el cachet de ÆRIEL: todo es el trabajo de alguien, y todo se paga justo. Dilo en voz alta: gracias.`, `É pra isso que serve o ingresso. Limpeza, portas, paramédicos, redução de danos, o cachê da ÆRIEL: tudo é trabalho de alguém, e tudo é pago de forma justa. Diga em voz alta: obrigado.`));
        },
        choices: [K('care', t(`"Thank you. All of you. By name."`, `«Gracias. A todos. Por su nombre».`, `«Obrigado. A todos vocês. Pelo nome».`), { free: true, call: 'team_apply', next: null })]
      }
    }
  };
  S.team_apply = function () {
    const s = EM.state, n = TEAM.filter(function (m) { return m.ok(s); }).length;
    s.flags.team_thanks_done = true;
    L.apply({ fun: 2 * n, soc: n, care: 1 });
  };

  const tick0 = story.tick;
  story.tick = function (dt) {
    if (tick0) tick0(dt);
    const s = EM.state; if (!s || s.ended || U.mode !== 'play') return;
    /* Maru's emergency escalates while you cross the floor */
    if (s.quests.q2 === 'active' && L.hasFriend('maru') && !U.D) {
      q2t += dt;
      const gate = [30, 80, 140][q2n];
      if (gate !== undefined && q2t >= gate) { U.toast({ icon: 'exclam', kind: 'info', ms: 5200, text: MARU[q2n] }); q2n++; }
    }
    if (s.quests.q2 === 'done' && !s.flags.maru_owes) s.flags.maru_owes = true;
    /* ...and she pays you back with what she needs from the last hour */
    if (s.quests.q10 === 'active' && s.flags.maru_owes && !s.flags.maru_owes_paid && L.hasFriend('maru')) {
      s.flags.maru_owes_paid = true; s.flags.learned_maru = true;
      U.toast({ icon: 'heart', kind: 'good', ms: 7000, text: t(`MARU: "You got me to the toilet in time. I owe you. What I need from the last hour: warm. A long chord. Nothing sudden."`, `MARU: «Me llevaste al baño a tiempo. Te debo una. Lo que necesito de la última hora: cálido. Un acorde largo. Nada brusco».`, `MARU: «Você me levou ao banheiro a tempo. Te devo uma. O que eu preciso da última hora: quente. Um acorde longo. Nada brusco».`) });
    }
    if (s.flags.team_pending && s.zone === 'rooftop' && !U.D) { s.flags.team_pending = false; U.startDialogue('team_thanks', {}); }
  };
})();

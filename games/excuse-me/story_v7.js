/* EXCUSE ME — story v7: consequences that come back. Kisses are remembered (your friends react, the person
   turns up again later, numbers get traded), and the small kindnesses of the night pay off in different ways:
   some later the same night, some only in the morning, some in both. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };

  /* ============================================================ YOUR FRIENDS SAW THAT */
  const KR = {
    maru: {
      ok: [
        t(`MARU (low, delighted): "I saw that. I'm going to pretend I didn't. I saw it, though."`, `MARU (bajito, encantada): «Vi eso. Voy a fingir que no. Lo vi, igual».`, `MARU (baixinho, encantada): «Eu vi isso. Vou fingir que não vi. Mas eu vi».`),
        t(`MARU: "Ten out of ten. Perfect landing. I'd like to speak to the manager about your confidence."`, `MARU: «Diez de diez. Aterrizaje perfecto. Quiero hablar con el gerente sobre tu seguridad».`, `MARU: «Dez de dez. Pouso perfeito. Quero falar com o gerente sobre a sua confiança».`),
        t(`MARU just raises both eyebrows at you from across the room and mouths "WOW".`, `MARU solo te levanta las dos cejas desde el otro lado de la sala y articula «GUAU».`, `A MARU só levanta as duas sobrancelhas pra você do outro lado da sala e diz «NOSSA» sem voz.`)
      ],
      flop: [
        t(`MARU (kindly): "I saw the whole thing. We don't need to discuss it. Ever. I love you."`, `MARU (con cariño): «Vi todo. No hace falta hablarlo. Nunca. Te quiero».`, `MARU (com carinho): «Eu vi tudo. A gente não precisa falar disso. Nunca. Eu te amo».`),
        t(`MARU: "That was brave. Not successful. Brave. Here, have some water."`, `MARU: «Eso fue valiente. No exitoso. Valiente. Toma, un poco de agua».`, `MARU: «Isso foi corajoso. Não bem-sucedido. Corajoso. Toma, um pouco de água».`),
        t(`MARU makes a tiny teeth-clash sound effect with her mouth, then puts a hand on your shoulder. "Sorry. Reflex."`, `MARU hace con la boca un efecto de sonido de choque de dientes, y luego te pone una mano en el hombro. «Perdón. Reflejo».`, `A MARU faz com a boca um efeito sonoro de batida de dentes e depois põe uma mão no seu ombro. «Desculpa. Reflexo».`)
      ]
    },
    dani: {
      ok: [
        t(`DANI (a whisper-scream): "I SAW THAT. I SAW ALL OF THAT. THIS IS THE BEST DAY OF MY LIFE."`, `DANI (un grito susurrado): «VI ESO. VI TODO ESO. ES EL MEJOR DÍA DE MI VIDA».`, `DANI (um grito sussurrado): «EU VI ISSO. EU VI TUDO ISSO. É O MELHOR DIA DA MINHA VIDA».`),
        t(`DANI is slow-clapping with enormous dignity from behind a speaker.`, `DANI aplaude lento con enorme dignidad desde detrás de un parlante.`, `O DANI aplaude devagar com enorme dignidade atrás de uma caixa de som.`),
        t(`DANI: "Tell me everything. Not now. Later. Now: hold my hand, I'm shaking with joy."`, `DANI: «Cuéntamelo todo. Ahora no. Después. Ahora: tómame de la mano, estoy temblando de alegría».`, `DANI: «Me conta tudo. Agora não. Depois. Agora: segura minha mão, tô tremendo de alegria».`)
      ],
      flop: [
        t(`DANI (very gently): "Oh, babe. Okay. Come here. Hug. Walk it off. We'll all pretend it was a dance move."`, `DANI (muy suave): «Ay, cariño. Bueno. Ven. Abrazo. Camínalo. Todos vamos a fingir que fue un paso de baile».`, `DANI (bem suave): «Ai, amor. Tá. Vem cá. Abraço. Anda um pouco. A gente vai fingir que foi um passo de dança».`),
        t(`DANI is already telling a stranger a version of the story in which you were incredibly smooth.`, `DANI ya le está contando a un desconocido una versión de la historia en la que fuiste increíblemente suave.`, `O DANI já está contando pra um estranho uma versão da história em que você foi incrivelmente suave.`),
        t(`DANI: "That's the thing about being brave: sometimes it goes crunch. Do you want a mint? Do you want a hug? I have both."`, `DANI: «Lo de ser valiente es que a veces hace crunch. ¿Quieres una menta? ¿Quieres un abrazo? Tengo las dos».`, `DANI: «O lance de ser corajoso é que às vezes faz crec. Quer uma bala de menta? Quer um abraço? Eu tenho os dois».`)
      ]
    },
    tato: {
      ok: [
        t(`TATO (low, a little stunned): "…You just did that? In front of people? I'm so proud of you I could lie down."`, `TATO (en voz baja, un poco atónito): «…¿Acabas de hacer eso? ¿Delante de gente? Estoy tan orgulloso que podría acostarme».`, `TATO (em voz baixa, meio atônito): «…Você acabou de fazer isso? Na frente de gente? Tô tão orgulhoso que podia deitar no chão».`),
        t(`TATO gives you a small, serious thumbs-up from the wall he's leaning on.`, `TATO te hace un pulgar arriba chico y serio desde la pared donde se apoya.`, `O TATO te faz um joinha pequeno e sério da parede em que está encostado.`),
        t(`TATO: "I'd never be able to. I mean it as a compliment. I mean it as the highest compliment."`, `TATO: «Yo jamás podría. Lo digo como un cumplido. Lo digo como el cumplido más alto».`, `TATO: «Eu nunca conseguiria. Falo isso como elogio. Falo como o maior elogio».`)
      ],
      flop: [
        t(`TATO (immediately, sincerely): "That could have happened to anybody. It happened to you. That's all."`, `TATO (de inmediato, sincero): «Le podría haber pasado a cualquiera. Te pasó a ti. Eso es todo».`, `TATO (na hora, sincero): «Isso podia ter acontecido com qualquer um. Aconteceu com você. É só isso».`),
        t(`TATO sits down next to you without a word and offers you half a granola bar.`, `TATO se sienta a tu lado sin una palabra y te ofrece la mitad de una barra de cereal.`, `O TATO senta do seu lado sem falar nada e te oferece metade de uma barra de cereal.`),
        t(`TATO: "For what it's worth, I was too scared to even look at the person I like. Your version was better."`, `TATO: «Por si sirve, yo tuve demasiado miedo hasta de mirar a la persona que me gusta. Tu versión fue mejor».`, `TATO: «Pro que serve, eu tive medo demais até de olhar pra pessoa de quem eu gosto. A sua versão foi melhor».`)
      ]
    }
  };
  const KS = {
    ok: [
      t(`A stranger nearby stops mid-sip and says, to nobody: "Well. Good for them."`, `Un desconocido cerca se detiene a mitad de un sorbo y dice, a nadie: «Bueno. Qué bien por ellos».`, `Um estranho ali perto para no meio do gole e diz, pra ninguém: «Bom. Que bom pra eles».`),
      t(`Somebody whoops from the back of the room. You are unable to determine whether it's about you. It's about you.`, `Alguien grita de alegría desde el fondo de la sala. No puedes determinar si es por ti. Es por ti.`, `Alguém dá um grito de alegria no fundo da sala. Você não consegue determinar se é por você. É por você.`),
      t(`The couple on the nearest sofa both give you a double thumbs-up without opening their eyes.`, `La pareja del sofá más cercano te hace un doble pulgar arriba sin abrir los ojos.`, `O casal do sofá mais próximo faz um joinha duplo sem abrir os olhos.`)
    ],
    flop: [
      t(`Three strangers pretend to examine the ceiling with intense interest.`, `Tres desconocidos fingen examinar el techo con intenso interés.`, `Três estranhos fingem examinar o teto com intenso interesse.`),
      t(`A stranger passes you a tissue, a mint, and a look of pure, ungendered sympathy.`, `Un desconocido te pasa un pañuelo, una menta y una mirada de pura simpatía.`, `Um estranho te passa um lenço, uma bala de menta e um olhar de pura simpatia.`),
      t(`Somebody in the corner very softly says, "ouch," and then very loudly says, "NICE SONG."`, `Alguien en la esquina dice muy bajito «ay», y luego muy fuerte: «BUENA CANCIÓN».`, `Alguém no canto diz bem baixinho «ai» e depois bem alto: «BOA MÚSICA».`)
    ]
  };
  story.kissReact = function (ok, who) {
    const s = EM.state; if (!s || s.ended) return;
    const key = ok ? 'ok' : 'flop';
    const pool = [];
    s.party.forEach(function (f) { if (KR[f]) pool.push(EM.pick(KR[f][key])); });
    if (!pool.length || Math.random() < 0.25) pool.push(EM.pick(KS[key]));
    const line = EM.pick(pool);
    U.toast({ icon: ok ? 'heart' : 'sweat', text: line, kind: ok ? 'good' : 'info', ms: 5200 });
    /* a friend who watched your flop may sit with you; one who saw your win may bring you water */
    if (s.party.length && Math.random() < 0.5) L.apply(ok ? { fun: 2 } : { soc: 2 });
  };

  /* ============================================================ THEY COME BACK, LATER THE SAME NIGHT */
  function back(id, zone, x, y, okText, flopText, okReact, ctx) {
    const nm = EM.CAST[id].name;
    const ret = id + '_ret';
    D['ret_' + id + '_ok'] = {
      who: id, role: t('YOU AGAIN', 'OTRA VEZ TÚ', 'VOCÊ DE NOVO'), start: 'a', nodes: {
        a: {
          text: okText,
          choices: [
            K('makeout', t(`Ask: "Round two?"`, `Preguntar: «¿Segunda ronda?»`, `Perguntar: «Segunda rodada?»`), { do: { makeout: { p: 0.8, time: 6, who: id }, flag: ret }, next: null }),
            K('smooth', t(`"Can I get your number?"`, `«¿Me das tu número?»`, `«Me passa seu número?»`), { do: { fun: 3, soc: 2, flag: ['number_' + id, ret] }, next: null, react: okReact }),
            K('dance', t(`"One slow song?"`, `«¿Una canción lenta?»`, `«Uma música lenta?»`), { do: { fun: 5, soc: 2, time: 5, flag: ret }, next: null, react: t(`You dance like the club has been emptied for you. It hasn't, and it is the only thing you're able to think about.`, `Bailan como si hubieran vaciado el club para ustedes. No lo han hecho, y es lo único en lo que logras pensar.`, `Vocês dançam como se o club tivesse sido esvaziado pra vocês. Não foi, e é a única coisa em que você consegue pensar.`) }),
            K('chill', t(`"Just wanted to say hi. Have a lovely night."`, `«Solo quería saludar. Que tengas una linda noche».`, `«Só queria dar um oi. Tenha uma noite linda».`), { do: { soc: 2, flag: ret }, next: null })
          ]
        }
      }
    };
    D['ret_' + id + '_flop'] = {
      who: id, role: t('YOU AGAIN', 'OTRA VEZ TÚ', 'VOCÊ DE NOVO'), start: 'a', nodes: {
        a: {
          text: flopText,
          choices: [
            K('joke', t(`"So. Teeth."`, `«Entonces. Dientes».`, `«Então. Dentes».`), { do: { fun: 4, weird: -2, flag: ret }, next: null, react: t(`You both laugh until it hurts. It was worth the teeth.`, `Los dos se ríen hasta que duele. Valieron la pena los dientes.`, `Vocês dois riem até doer. Valeram os dentes.`) }),
            K('makeout', t(`Ask: "One more go? Only if you want to."`, `Preguntar: «¿Un intento más? Solo si quieres».`, `Perguntar: «Mais uma tentativa? Só se você quiser».`), { do: { makeout: { p: 0.35, time: 6, who: id }, flag: ret }, next: null }),
            K('sorry', t(`"I'm sorry about before. No hard feelings?"`, `«Perdón por lo de antes. ¿Sin resentimientos?»`, `«Desculpa pelo que rolou. Sem ressentimentos?»`), { do: { soc: 2, weird: -1, flag: ret }, next: null }),
            K('hug', t(`"Friends? Numbers?"`, `«¿Amigos? ¿Números?»`, `«Amigos? Números?»`), { do: { fun: 2, soc: 2, flag: ['number_' + id, ret] }, next: null })
          ]
        }
      }
    };
    Z[zone].npc({
      id: id + '_back', cast: id, x: x, y: y, dir: 'd', reach: 18,
      dlg: function (s) { return s.flags['kiss_' + id] ? 'ret_' + id + '_ok' : 'ret_' + id + '_flop'; },
      when: function (s) {
        const f = s.flags['kiss_' + id] ? 'kiss_' + id : (s.flags['flop_' + id] ? 'flop_' + id : null);
        if (!f || s.flags[ret]) return false;
        return s.time >= ((s.flagAt && s.flagAt[f]) || 0) + 90;
      }
    });
  }
  back('vera', 'courtyard', 17.5, 21.5,
    t(`Vera is on the courtyard grass with her jacket draped over her knees like a small, loyal dog. "Hi. I was thinking about you. In the way where I tell nobody and then immediately tell you."`, `Vera está en el pasto del patio con su chaqueta sobre las rodillas como un perrito leal. «Hola. Estaba pensando en ti. De esa forma en que no se lo cuento a nadie y de inmediato te lo cuento a ti».`, `A Vera está na grama do pátio com a jaqueta sobre os joelhos como um cachorrinho leal. «Oi. Eu estava pensando em você. Daquele jeito em que não conto pra ninguém e logo conto pra você».`),
    t(`Vera is on the courtyard grass, staring at the sky with her jacket on backwards. "Oh. Hi. I'm okay. Are you okay? I think the jacket judged us both."`, `Vera está en el pasto del patio, mirando el cielo con la chaqueta al revés. «Ah. Hola. Estoy bien. ¿Tú estás bien? Creo que la chaqueta nos juzgó a los dos».`, `A Vera está na grama do pátio, olhando o céu com a jaqueta do avesso. «Ah. Oi. Eu tô bem. Você tá bem? Acho que a jaqueta julgou nós dois».`),
    t(`She writes the number on your forearm with an eyeliner pencil, very slowly, with the concentration of a surgeon. "Seven out of ten. But for a very sexy seven."`, `Te escribe el número en el antebrazo con un delineador, muy despacio, con la concentración de una cirujana. «Siete de diez. Pero un siete muy sexy».`, `Ela escreve o número no seu antebraço com um lápis de olho, bem devagar, com a concentração de uma cirurgiã. «Sete de dez. Mas um sete muito sexy».`));
  back('ines', 'foyer', 21.5, 10.5,
    t(`Ines is on her break by the foyer wall, eating a lime like an apple. "Hey. You. Hot minute. Come, sit. I have eleven minutes."`, `Inés está en su descanso junto a la pared del foyer, comiendo un limón como una manzana. «Hola. Tú. Un minuto de fuego. Ven, siéntate. Tengo once minutos».`, `A Ines está na pausa dela junto à parede do foyer, comendo um limão como uma maçã. «Oi. Você. Um minuto quente. Vem, senta. Tenho onze minutos».`),
    t(`Ines is behind the coat check pretending to fold a scarf. "Hi. Yes. The — thing. I've decided it was a *bit* of a team-building exercise. Hi."`, `Inés está detrás del guardarropa fingiendo doblar una bufanda. «Hola. Sí. La — cosa. Decidí que fue un *poco* un ejercicio de integración de equipo. Hola».`, `A Ines está atrás da chapelaria fingindo dobrar um cachecol. «Oi. Sim. A — coisa. Decidi que foi um *pouco* uma dinâmica de integração de equipe. Oi».`),
    t(`"Write it down." She hands you the notebook. "Number: yours. Number: mine. Tip: one kiss. Value: three limes."`, `«Anótalo». Te pasa el cuaderno. «Número: el tuyo. Número: el mío. Propina: un beso. Valor: tres limones».`, `«Anota». Ela te passa o caderno. «Número: o seu. Número: o meu. Gorjeta: um beijo. Valor: três limões».`));
  back('rafa', 'attic', 10.5, 20.5,
    t(`Rafa is on the attic steps, still doing The Apology, but with an entirely new confidence. "Hey! I just figured out the fifth step. It's 'forgive yourself.' It's just standing there."`, `Rafa está en las escaleras del ático, haciendo todavía La Disculpa, pero con una confianza completamente nueva. «¡Hola! Acabo de descubrir el quinto paso. Es “perdónate”. Es solo quedarse parado».`, `O Rafa está nas escadas do sótão, ainda fazendo O Pedido de Desculpas, mas com uma confiança totalmente nova. «Oi! Acabei de descobrir o quinto passo. É “se perdoe”. É só ficar parado».`),
    t(`Rafa is on the attic steps, rehearsing a very different set of four steps: Step, step, turn, apologise. "Oh. Hi. I was — I'm — are we okay? I'm okay if we're okay."`, `Rafa está en las escaleras del ático, ensayando un set muy distinto de cuatro pasos: Paso, paso, giro, disculpa. «Ah. Hola. Yo estaba — yo estoy — ¿estamos bien? Estoy bien si estamos bien».`, `O Rafa está nas escadas do sótão, ensaiando um conjunto bem diferente de quatro passos: Passo, passo, giro, desculpa. «Ah. Oi. Eu estava — eu tô — a gente tá bem? Eu tô bem se a gente estiver bem».`),
    t(`He types your number into his phone so carefully that you can hear him thinking about each digit. Then he adds a heart. Then he deletes the heart. Then he adds it again.`, `Tipea tu número en el celular tan cuidadosamente que se le oye pensar cada dígito. Luego agrega un corazón. Luego lo borra. Luego lo vuelve a agregar.`, `Ele digita seu número no celular com tanto cuidado que dá pra ouvir ele pensando em cada dígito. Depois adiciona um coração. Depois apaga o coração. Depois adiciona de novo.`));
  back('mina', 'tunnel', 33.5, 5.5,
    t(`Mina is in the tunnel holding her palms to the concrete. "Listen. The wall's got a resonance at 85 Hz. It's — the kind of thing I'd want to tell you. Specifically you."`, `Mina está en el túnel con las palmas contra el concreto. «Escucha. La pared tiene una resonancia a 85 Hz. Es — el tipo de cosa que querría contarte. A ti específicamente».`, `A Mina está no túnel com as palmas no concreto. «Escuta. A parede tem uma ressonância em 85 Hz. É — o tipo de coisa que eu queria te contar. Especificamente você».`),
    t(`Mina is in the tunnel with her ear to the wall, rather too intently. "Hi. Sorry. It's a good echo. I'm — hiding in the echo."`, `Mina está en el túnel con la oreja contra la pared, demasiado concentrada. «Hola. Perdón. Es un buen eco. Estoy — escondida en el eco».`, `A Mina está no túnel com a orelha na parede, concentrada demais. «Oi. Desculpa. É um bom eco. Eu tô — escondida no eco».`),
    t(`She writes her number on your palm with a marker and presses your hand flat against the wall. "That's the frequency. Memorise it. Then call me."`, `Te escribe su número en la palma con un marcador y te aprieta la mano contra la pared. «Esa es la frecuencia. Memorízala. Luego llámame».`, `Ela escreve o número dela na sua palma com uma caneta e aperta sua mão contra a parede. «Essa é a frequência. Decora. Depois me liga».`));
  back('nox', 'darkroom', 11, 8,
    t(`The voice again, warmer now, at shoulder height. "It's me. The one who likes words. I stayed. I thought: maybe they'll come back. And here you are."`, `La voz otra vez, más cálida ahora, a la altura del hombro. «Soy yo. Quien ama las palabras. Me quedé. Pensé: quizás vuelvan. Y aquí estás».`, `A voz de novo, mais quente agora, na altura do ombro. «Sou eu. Quem gosta de palavras. Eu fiquei. Pensei: talvez voltem. E aqui está você».`),
    t(`The voice, a little embarrassed. "Hey. It's me. We — it wasn't a fit. That's okay. I like you anyway. Do you want a minute in the dark with no expectations?"`, `La voz, un poco avergonzada. «Hola. Soy yo. Nosotros — no encajó. Está bien. Me caes bien igual. ¿Quieres un minuto en la oscuridad sin expectativas?»`, `A voz, um pouco constrangida. «Oi. Sou eu. A gente — não rolou. Tudo bem. Eu gosto de você mesmo assim. Quer um minuto no escuro sem expectativas?»`),
    t(`A hand finds yours in the black and presses a small folded paper into it. Later, in the light, you'll read: a handle, and under it, "ask first, always. I always say yes to people who do."`, `Una mano encuentra la tuya en lo negro y te pone un papelito doblado. Más tarde, a la luz, leerás: un usuario, y debajo, «pregunta primero, siempre. Siempre digo que sí a quien lo hace».`, `Uma mão encontra a sua no breu e coloca um papelzinho dobrado nela. Mais tarde, na luz, você vai ler: um perfil, e embaixo, «pergunte antes, sempre. Eu sempre digo sim pra quem pergunta».`));

  /* ============================================================ SMALL KINDNESSES THAT PAY OFF */
  /* Each payoff picks, from the night's seed, whether it comes later tonight, only in the morning, or both. */
  function hs(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return h; }
  const PAY = [
    { id: 'cleo', flag: 'note_delivered', delay: 50, minTime: 290, night: function () { L.apply({ fun: 8, soc: 3 }); U.toast({ icon: 'star', text: t(`The music drops to nothing. ÆRIEL, into the mic, very softly: "This one is for a napkin." The sad one begins. Somewhere in the attic a person lets out a sound like a kettle.`, `La música cae a nada. ÆRIEL, al micrófono, muy bajito: «Esta es para una servilleta». Empieza la triste. En algún lugar del ático una persona suelta un sonido como el de una tetera.`, `A música cai a nada. ÆRIEL, no microfone, bem baixinho: «Essa é pra um guardanapo». Começa a triste. Em algum lugar do sótão uma pessoa solta um som de chaleira.`), kind: 'good', ms: 7000 }); } },
    { id: 'pia', flag: 'pia_reunited', delay: 80, night: function () { L.apply({ fun: 3, item: { water: 1 } }); U.toast({ icon: 'heart', text: t(`Pia and Moe pass by, each holding one side of a plastic fern like a stretcher. Moe slips a cold bottle of water into your pocket without breaking eye contact with the fern.`, `Pia y Moe pasan, cada uno sosteniendo un lado de un helecho de plástico como una camilla. Moe te mete una botella de agua fría en el bolsillo sin romper el contacto visual con el helecho.`, `A Pia e o Moe passam, cada um segurando um lado de uma samambaia de plástico como uma maca. O Moe enfia uma garrafa de água gelada no seu bolso sem quebrar o contato visual com a samambaia.`), kind: 'good' }); } },
    { id: 'phoneok', flag: 'phone_returned', delay: 70, night: function () { L.apply({ fun: 4, fresh: 60 }); U.toast({ icon: 'heart', text: t(`A woman you have never seen finds you in the crowd, hugs you for far too long, and hands you a mint. "From Biscuit." She leaves before you can say anything. The mint is excellent.`, `Una mujer que nunca viste te encuentra entre la multitud, te abraza demasiado tiempo y te da una menta. «De parte de Biscuit». Se va antes de que puedas decir algo. La menta es excelente.`, `Uma mulher que você nunca viu te acha na multidão, te abraça por tempo demais e te entrega uma bala de menta. «Da parte do Biscuit». Ela vai embora antes que você diga alguma coisa. A bala é excelente.`), kind: 'good' }); } },
    { id: 'phonebad', flag: 'phone_snooped', delay: 60, night: function () { L.apply({ weird: 6, soc: -3 }); L.rep(0.5); U.toast({ icon: 'eyes', text: t(`A stranger in a very small dog-print shirt stares at you from across the room. They know. You both know. They mouth, with great clarity: "THE. DOG."`, `Un desconocido con una remera de estampado de perritos te mira fijo desde el otro lado de la sala. Lo sabe. Los dos lo saben. Articula con gran claridad: «EL. PERRO».`, `Um estranho com uma camiseta estampada de cachorrinhos te encara do outro lado da sala. Sabe. Vocês dois sabem. Ele articula, com grande clareza: «O. CACHORRO».`), kind: 'bad', ms: 6000 }); } },
    { id: 'lupe', flag: 'lupe_helped', delay: 60, night: function () { L.apply({ fun: 5, soc: 3 }); U.toast({ icon: 'heart', text: t(`In the middle of the dancefloor, a girl with fixed eyeliner is dancing as if the ground belongs to her. She spots you, points, and mouths, "THANK YOU." She spins, and is gone.`, `En medio de la pista, una chica con el delineado arreglado baila como si el suelo fuera suyo. Te ve, te señala y articula «GRACIAS». Gira y desaparece.`, `No meio da pista, uma garota com o delineado refeito dança como se o chão fosse dela. Ela te vê, aponta e articula «OBRIGADA». Gira e some.`), kind: 'good' }); } },
    { id: 'kai', flag: 'kai_tipped', delay: 90, night: function () { L.apply({ fun: 4, soc: 1 }); U.toast({ icon: 'note', text: t(`From somewhere in the foyer, four familiar bars on a lunchbox-sized keyboard. Kai has come inside. Their sign now says: REQUESTS: FREE FOR YOU.`, `Desde algún lugar del foyer, cuatro compases conocidos en un teclado del tamaño de una lonchera. Kai entró. Su cartel ahora dice: PEDIDOS: GRATIS PARA TI.`, `De algum lugar do foyer, quatro compassos conhecidos num teclado do tamanho de uma lancheira. O Kai entrou. A placa agora diz: PEDIDOS: DE GRAÇA PRA VOCÊ.`), kind: 'good' }); } },
    { id: 'bruce', flag: 'bruce_cared', delay: 55, club: true, night: function () { L.apply({ weird: -5, soc: 2 }); U.toast({ icon: 'cross', text: t(`Across the foyer, Bruce meets your eye, nods once, and, with great ceremony, looks the other way. Something in your chest unclenches.`, `Al otro lado del foyer, Bruce te mira, asiente una vez y, con gran ceremonia, mira hacia otro lado. Algo en tu pecho se afloja.`, `Do outro lado do foyer, o Bruce cruza o seu olhar, assente uma vez e, com grande cerimônia, olha pro outro lado. Algo no seu peito se solta.`), kind: 'good' }); } },
    { id: 'poem', flag: 'poem', delay: 90, night: function () { L.apply({ fun: 3, soc: 2 }); U.toast({ icon: 'note', text: t(`A folded paper appears in your hand, passed from the crowd. A second poem, very short: "still here." It is signed with a pen drawing of a pen.`, `Un papel doblado aparece en tu mano, pasado desde la multitud. Un segundo poema, muy corto: «sigo aquí». Está firmado con el dibujo de una lapicera.`, `Um papel dobrado aparece na sua mão, passado da multidão. Um segundo poema, bem curtinho: «ainda aqui». Está assinado com o desenho de uma caneta.`), kind: 'good' }); } },
    { id: 'yui', flag: 'beat_yui', delay: 80, night: function () { L.apply({ fun: 3, soc: 1 }); U.toast({ icon: 'hand', text: t(`Across the room, Yui holds up a rock like a torch. A rematch is on the table. You nod, once. It is a very serious nod.`, `Al otro lado de la sala, Yui levanta una piedra como una antorcha. Hay revancha sobre la mesa. Asientes, una vez. Es un asentimiento muy serio.`, `Do outro lado da sala, a Yui levanta uma pedra como uma tocha. Uma revanche está na mesa. Você assente, uma vez. É um aceno muito sério.`), kind: 'good' }); } }
  ];
  story.pays = PAY;
  const minute0 = L.minute;
  L.minute = function () {
    minute0();
    const s = EM.state; if (!s || s.ended) return;
    PAY.forEach(function (p) {
      if (!s.flags[p.flag] || s.flags['pay_' + p.id]) return;
      if (p.club && s.venue === 'rave') return;
      const at = (s.flagAt && s.flagAt[p.flag]) || 0;
      if (s.time < at + p.delay || (p.minTime && s.time < p.minTime)) return;
      const r = EM.hash2((s.seed || 1) + (s.attempt || 1) * 17, hs(p.id) % 997, 5);
      const v = r < 0.4 ? 'night' : (r < 0.7 ? 'morning' : 'both');
      s.flags['pay_' + p.id] = v;
      if (v !== 'morning') p.night();
    });
  };

  /* texts from people you traded numbers with */
  const NUM = [
    { id: 'vera', who: '#VERA', t: t(`this is vera (jacket: 7). coffee? bring the jacket. i'll bring the opinions.`, `soy vera (chaqueta: 7). ¿café? trae la chaqueta. yo llevo las opiniones.`, `aqui é a vera (jaqueta: 7). café? traz a jaqueta. eu levo as opiniões.`) },
    { id: 'ines', who: '#INES', t: t(`limes sold last night: 212. hearts: 1 (yours, we are counting). tip jar says call me.`, `limones vendidos anoche: 212. corazones: 1 (el tuyo, estamos contando). el frasco de propinas dice llámame.`, `limões vendidos ontem à noite: 212. corações: 1 (o seu, estamos contando). o pote de gorjeta diz me liga.`) },
    { id: 'rafa', who: '#RAFA', t: t(`hi!! it's rafa. step, step, turn, shrug. i did it in the shower. it works in the shower too. dinner?`, `¡¡hola!! soy rafa. paso, paso, giro, encogida. lo hice en la ducha. también funciona en la ducha. ¿cena?`, `oi!! é o rafa. passo, passo, giro, dar de ombros. fiz no chuveiro. funciona no chuveiro também. jantar?`) },
    { id: 'mina', who: '#MINA', t: t(`mina here. 85 hz. i looked it up: it's the key of F-sharp. you are in F-sharp. thought you should know.`, `habla mina. 85 hz. lo busqué: es la nota fa sostenido. tú estás en fa sostenido. pensé que debías saberlo.`, `aqui é a mina. 85 hz. pesquisei: é a nota fá sustenido. você está em fá sustenido. achei que devia saber.`) },
    { id: 'nox', who: '#NOX', t: t(`it's the voice. the one who likes words. here is my favourite one: "yes". here is my second favourite: "tomorrow". your move.`, `soy la voz. quien ama las palabras. esta es mi favorita: «sí». esta es la segunda: «mañana». tu turno.`, `sou a voz. quem gosta de palavras. a minha favorita é: «sim». a segunda é: «amanhã». sua vez.`) },
    { id: 'ludo', who: '#LUDO', t: t(`ludo from the roof. i saved you a croissant. it is not a metaphor. it is a croissant.`, `ludo del techo. te guardé una medialuna. no es una metáfora. es una medialuna.`, `ludo do terraço. guardei um croissant pra você. não é metáfora. é um croissant.`), flag: 'ludo_done' }
  ];
  if (story.morningRefs) {
    NUM.forEach(function (n) {
      story.morningRefs.push({ id: 'num_' + n.id, who: n.who, ok: function (s) { return !!(s.flags['number_' + n.id] || (n.flag && s.flags['kiss_' + n.id])); }, t: n.t });
    });
    story.morningRefs.push({ id: 'kissnames', who: 'dani', ok: function (s) { return (s.makeoutsOk || 0) >= 2; }, t: t(`Okay, you kissed more than one person. I am keeping a spreadsheet. Name the columns "legend" and "icon".`, `Bueno, besaste a más de una persona. Estoy llevando una hoja de cálculo. Las columnas se llaman «leyenda» e «ícono».`, `Tá, você beijou mais de uma pessoa. Tô mantendo uma planilha. As colunas se chamam «lenda» e «ícone».`) });
  }
})();

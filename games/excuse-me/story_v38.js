/* EXCUSE ME — story v38: two cross-floor rave missions linking MAIN FLOOR (main) and SALA 2 // THE ATTIC (attic).
   1. sq_white_label (THE WHITE LABEL): VALENTINA (main, 35.5, 9.5) and CELESTE (attic, 9.5, 4.2).
      Fifty hand-stamped 12" dubplates of "Umbral 04", grief carried on a bassline, aging inside nightlife without apology.
   2. sq_communion (SUB-BASS COMMUNION): DAMIÁN (main, 12.5, 7.5) and SORA (attic, 22.5, 4.2).
      Two rooms phase-locking through concrete, somatic listening without ear-bias, and a 3-step floor calibration.
   Pronouns: Valentina (she), Celeste (she), Damián (he), Sora (she). */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, D = EM.DIALOGUES, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };
  const LEAVE = function () { return K('chill', t(`Leave them to the room.`, `Dejarles con la sala.`, `Deixar com a sala.`), { free: true, next: null }); };
  const mk = function (s, f) { return s.flags[f] ? '[✓]' : '[ ]'; };

  /* ---------------------------------------------------------------- cast */
  EM.CAST.valentina = {
    name: 'VALENTINA',
    look: { skin: 7, build: 1, expr: 3, hair: 15, hc: 5, eye: 0, top: 9, tc: 1, bottom: 1, bc: 1, shoes: 1, ac: 5, face: 2, ear: 2, neck: 1, wrist: 3 }
  };
  EM.CAST.celeste = {
    name: 'CELESTE',
    look: { skin: 2, build: 1, expr: 1, hair: 12, hc: 11, eye: 1, top: 17, tc: 12, bottom: 8, bc: 10, shoes: 3, ac: 3, ear: 2, makeup: 2, neck: 2, wrist: 2 }
  };
  EM.CAST.damian = {
    name: 'DAMIÁN',
    look: { skin: 3, build: 2, expr: 6, hair: 10, hc: 1, fhair: 1, eye: 0, top: 8, tc: 17, bottom: 4, bc: 12, shoes: 1, ac: 1, neck: 4, wrist: 3, bag: 2 }
  };
  EM.CAST.sora = {
    name: 'SORA',
    look: { skin: 0, build: 0, expr: 7, hair: 11, hc: 13, eye: 4, top: 4, tc: 3, bottom: 5, bc: 1, shoes: 1, ac: 1, pierce: 2, ear: 1, makeup: 3, wrist: 5 }
  };

  /* ---------------------------------------------------------------- shared route helper (01:00 = s.time 180) */
  function sala2Route(s) {
    return s.time < 180
      ? t(
        `SALA 2 // THE ATTIC opens its main stairs at 01:00 (from MAIN FLOOR's east wall or FOYER's north stairs). Before 01:00, only BACKSTAGE's staff stairs reach SALA 2.`,
        `SALA 2 // EL ÁTICO abre sus escaleras principales a la 1:00 (en la pared este de PISTA PRINCIPAL o al norte del FOYER). Antes de la 1:00, solo se sube por la escalera de staff en BACKSTAGE.`,
        `A SALA 2 // O SÓTÃO abre as escadas principais à 1:00 (na parede leste da PISTA PRINCIPAL ou ao norte do FOYER). Antes da 1:00, só a escada de staff no BACKSTAGE chega lá.`
      )
      : t(
        `The stairs to SALA 2 // THE ATTIC are open now: take the east stairwell right off MAIN FLOOR (or the north stairs in FOYER).`,
        `Las escaleras a SALA 2 // EL ÁTICO ya están abiertas: sube por la escalera este de PISTA PRINCIPAL (o por las del norte del FOYER).`,
        `As escadas pra SALA 2 // O SÓTÃO já estão abertas: suba pela escada leste da PISTA PRINCIPAL (ou pela do norte do FOYER).`
      );
  }

  /* ---------------------------------------------------------------- quests */
  EM.QUESTS.sq_white_label = {
    title: t('THE WHITE LABEL', 'EL SELLO BLANCO', 'O SELO BRANCO'),
    desc: function (s) {
      const route = s.time < 180
        ? t(`(Stairs from MAIN FLOOR / FOYER unlock at 01:00; BACKSTAGE staff stairs reach it earlier.)`, `(Las escaleras desde PISTA PRINCIPAL / FOYER abren a la 1:00; las de BACKSTAGE suben antes.)`, `(As escadas da PISTA PRINCIPAL / FOYER abrem à 1:00; as do BACKSTAGE sobem antes.)`)
        : t(`(Take the east stairs off MAIN FLOOR or north stairs in FOYER.)`, `(Sube por la escalera este de PISTA PRINCIPAL o norte del FOYER.)`, `(Suba pela escada leste da PISTA PRINCIPAL ou norte do FOYER.)`);
      return t(
        `Valentina pressed fifty copies of «Umbral 04» twenty years ago with Julián. Its bassline is bleeding down from upstairs. ${mk(s, 'wl_note_from_celeste')} Climb to SALA 2 // THE ATTIC ${route.en} and speak with CELESTE by the north bar about copy 07/50. ${mk(s, 'wl_done')} Carry Celeste's inscribed inner sleeve back down to VALENTINA on the east side of MAIN FLOOR.`,
        `Valentina prensó cincuenta copias de «Umbral 04» hace veinte años con Julián. Su línea de bajo tiembla desde arriba. ${mk(s, 'wl_note_from_celeste')} Sube a SALA 2 // EL ÁTICO ${route.es} y habla con CELESTE junto a la barra norte sobre la copia 07/50. ${mk(s, 'wl_done')} Baja el sobre interior escrito por Celeste hasta VALENTINA en el lado este de PISTA PRINCIPAL.`,
        `A Valentina prensou cinquenta cópias de «Umbral 04» há vinte anos com o Julián. O grave dela está vibrando lá de cima. ${mk(s, 'wl_note_from_celeste')} Suba à SALA 2 // O SÓTÃO ${route.pt} e fale com a CELESTE perto do bar norte sobre a cópia 07/50. ${mk(s, 'wl_done')} Leve o envelope interno anotado pela Celeste de volta pra VALENTINA no lado leste da PISTA PRINCIPAL.`
      );
    },
    doneText: t(
      `Copy 07/50 stays in rotation upstairs; Julián's handwriting rests against Valentina's ribs. Some records refuse to become nostalgia.`,
      `La copia 07/50 sigue girando arriba; la letra de Julián descansa contra las costillas de Valentina. Algunos discos se niegan a volverse nostalgia.`,
      `A cópia 07/50 continua girando lá em cima; a letra do Julián descansa contra as costelas da Valentina. Alguns discos se recusam a virar nostalgia.`
    )
  };

  EM.QUESTS.sq_communion = {
    title: t('SUB-BASS COMMUNION', 'COMUNIÓN SUBGRAVE', 'COMUNHÃO SUBGRAVE'),
    desc: function (s) {
      const route = s.time < 180
        ? t(`(Main/Foyer stairs unlock at 01:00; BACKSTAGE staff stairs work earlier.)`, `(Escaleras de Pista/Foyer abren a la 1:00; las de BACKSTAGE suben antes.)`, `(Escadas da Pista/Foyer abrem à 1:00; as do BACKSTAGE sobem antes.)`)
        : t(`(East stairs off MAIN FLOOR or north stairs in FOYER.)`, `(Escalera este de PISTA PRINCIPAL o norte del FOYER.)`, `(Escada leste da PISTA PRINCIPAL ou norte do FOYER.)`);
      return t(
        `Damián hears both dancefloors phase-locking through the concrete slab. ${mk(s, 'sc_phase_marked')} Carry his Brass Tuning Fork & Phase Card up to SALA 2 // THE ATTIC ${route.en} and find SORA in the north-east lounge for a 3-step somatic floor check. ${mk(s, 'sc_done')} Return to DAMIÁN on the upper-left edge of MAIN FLOOR to lock the crossover.`,
        `Damián detectó que ambas pistas entran en fase a través de la losa de hormigón. ${mk(s, 'sc_phase_marked')} Lleva su diapasón de bronce y la tarjeta de fase a SALA 2 // EL ÁTICO ${route.es} y busca a SORA en el lounge noreste para calibrar el piso en 3 pasos. ${mk(s, 'sc_done')} Vuelve con DAMIÁN al borde superior izquierdo de PISTA PRINCIPAL para fijar el cruce.`,
        `O Damián percebeu as duas pistas entrando em fase pela laje de concreto. ${mk(s, 'sc_phase_marked')} Leve o diapasão de latão e o cartão de fase até a SALA 2 // O SÓTÃO ${route.pt} e encontre a SORA no lounge nordeste pra checagem somática em 3 passos. ${mk(s, 'sc_done')} Volte ao DAMIÁN na ponta superior esquerda da PISTA PRINCIPAL pra travar o crossover.`
      );
    },
    doneText: t(
      `Forty-two hertz locked across two ceilings. You can feel the concrete humming behind your knees without needing to explain why.`,
      `Cuarenta y dos hercios fijados entre dos techos. Sientes el hormigón zumbar detrás de las rodillas sin tener que explicar por qué.`,
      `Quarenta e dois hertz travados entre dois tetos. Você sente o concreto zumbir atrás dos joelhos sem precisar explicar por quê.`
    )
  };

  /* ---------------------------------------------------------------- dialogue 1: VALENTINA (main, 35.5, 9.5) */
  const VN = {};
  VN.st = { branch: [
    { req: F('wl_done'), to: 'after' },
    { req: function (s) { return s.quests.sq_white_label === 'active' && !!s.flags.wl_note_from_celeste; }, to: 'deliver' },
    { req: function (s) { return s.quests.sq_white_label === 'active'; }, to: 'remind' },
    { req: function () { return true; }, to: 'intro' }
  ] };
  VN.intro = {
    text: [
      t(
        `Valentina stands beside the east stairwell with one flat palm pressed to the painted cinderblock. Her leather jacket smells of rain and old record sleeves; silver hair is combed straight back from a sharp brow.`,
        `Valentina está junto a la escalera este con una palma apoyada de lleno en el bloque de cemento pintado. Su chaqueta de cuero huele a lluvia y fundas viejas; el pelo plateado va peinado hacia atrás con rigor.`,
        `A Valentina está ao lado da escada leste com a palma aberta encostada no bloco de concreto pintado. A jaqueta de couro cheira a chuva e capas antigas; o cabelo prateado vai penteado pra trás sem frescura.`
      ),
      t(
        `«Don't look at me like I'm checking the plaster,» she says without turning. «Count the fourth bar. Do you feel that double-skip in the sub coming down the stairs? Only one cut in this city skips on the fourth bar like that. «Umbral 04». Fifty copies, hand-stamped in a kitchen in 2006.»`,
        `«No me mires como si estuviera revisando el revoque», dice sin voltearse. «Cuenta el cuarto compás. ¿Sientes ese doble salto en el subgrave bajando por la escalera? Solo un corte en esta ciudad salta así en el cuarto compás. «Umbral 04». Cincuenta copias, selladas a mano en una cocina en 2006».`,
        `«Não olha pra mim achando que tô conferindo o reboco», diz ela sem se virar. «Conta o quarto compasso. Sente esse pulo duplo no subgrave descendo a escada? Só um corte nessa cidade pula assim no quarto compasso. «Umbral 04». Cinquenta cópias, carimbadas à mão numa cozinha em 2006».`
      )
    ],
    choices: [
      K('ask', t(`"Why don't you just walk upstairs and see who's playing it?"`, `«¿Por qué no subes tú y miras quién lo está pinchando?»`, `«Por que você não sobe e vê quem tá tocando?»`), { next: 'why' }),
      K('ask', t(`"Who pressed it with you?"`, `«¿Quién lo prensó contigo?»`, `«Quem prensou com você?»`), { next: 'julian' }),
      K('yes', t(`"I can go up to Sala 2 and check the record for you."`, `«Puedo subir a Sala 2 y revisar el disco por ti».`, `«Posso subir pra Sala 2 e conferir o disco pra você».`), { do: { flag: 'wl_started', quest: { sq_white_label: 'active' } }, next: 'accepted' }),
      LEAVE()
    ]
  };
  VN.why = {
    text: t(
      `Her mouth twitches into something wry and unsentimental. «Because if I walk up into Sala 2 at this hour and see my own youth spinning under a cue light, I'll either weep on a stranger's monitor or start critiquing their trim levels. Neither is dignified at forty-eight. Somebody upstairs brought a copy into the room—maybe not even the DJ, maybe someone carrying the jacket.»`,
      `La boca se le tuerce en un gesto irónico y seco. «Porque si subo a Sala 2 a esta hora y veo mi propia juventud girando bajo una luz de cabina, o lloro sobre un monitor ajeno o me pongo a criticar su ganancia. Ninguna de las dos cosas es digna a los cuarenta y ocho. Alguien arriba trajo una copia—quizá ni siquiera el DJ, quizá alguien con la funda en la mano».`,
      `A boca dela entorta num sorriso seco e irônico. «Porque se eu subir pra Sala 2 a essa hora e ver minha juventude girando sob a luz da cabine, ou eu choro no monitor de alguém ou começo a criticar o ganho do mixer. Nenhuma das duas coisas tem dignidade aos quarenta e oito. Alguém lá em cima trouxe uma cópia—talvez nem o DJ, talvez alguém carregando a capa».`
    ),
    next: 'offer'
  };
  VN.julian = {
    text: t(
      `«Julián.» She says his name easily, without bracing for it. «My partner in the booth and in the lease for eleven years. Cancer took him six winters ago. We gave away most of the fifty to friends, lovers, people who swept the floor after closing. If copy 07/50 is upstairs, I know whose hands he put it in—or I'm about to be surprised.»`,
      `«Julián». Dice su nombre sin solemnidad, como quien nombra una calle que sigue tomando por costumbre. «Mi compañero de cabina y de alquiler durante once años. El cáncer se lo llevó hace seis inviernos. Regalamos casi las cincuenta copias a amigos, amantes, gente que barría la pista al cierre. Si la copia 07/50 está arriba, sé en qué manos la puso—o estoy por llevarme una sorpresa».`,
      `«Julián». Ela diz o nome dele com naturalidade, como quem cita uma rua que ainda pega por hábito. «Meu parceiro de cabine e de aluguel por onze anos. O câncer levou ele faz seis invernos. A gente deu quase todas as cinquenta cópias pra amigos, amantes, gente que varria a pista depois do fechamento. Se a cópia 07/50 tá lá em cima, eu sei em que mãos ele deixou—ou vou me surpreender».`
    ),
    once: true, do: { flag: 'wl_julian_asked' }, next: 'offer'
  };
  VN.offer = {
    text: t(
      `She looks at you properly now, clear-eyed and direct. «Go up to SALA 2 // THE ATTIC. Look by the bar or the listening crowd for a plain white cardboard jacket—blue ink stamp, numbered out of fifty. Find out who brought it and what's written inside the paper inner sleeve. Just don't lie to me when you come back.»`,
      `Ahora te mira de frente, lúcida y directa. «Sube a SALA 2 // EL ÁTICO. Busca por la barra o entre la gente una funda blanca de cartón sin diseño—sello de tinta azul, numerada sobre cincuenta. Averigua quién la trajo y qué hay escrito en el sobre interior de papel. Solo no me mientas cuando bajes».`,
      `Agora ela olha pra você direto, lúcida e sem rodeios. «Sobe pra SALA 2 // O SÓTÃO. Procura perto do bar ou do público uma capa branca de papelão liso—carimbo de tinta azul, numerada de cinquenta. Descobre quem trouxe e o que tem escrito no envelope interno de papel. Só não mente pra mim quando voltar».`
    ),
    choices: [
      K('yes', t(`"I'll go upstairs and find out who holds 07/50."`, `«Subo y averiguo quién tiene la 07/50».`, `«Eu subo e descubro quem tá com a 07/50».`), { do: { flag: 'wl_started', quest: { sq_white_label: 'active' } }, next: 'accepted' }),
      LEAVE()
    ]
  };
  VN.accepted = {
    text: function (s) {
      return [
        t(
          `Valentina gives a brief, crisp nod. «Thank you. Keep your ears open near the north bar in Sala 2.»`,
          `Valentina asiente breve y firme. «Gracias. Abre bien el ojo cerca de la barra norte en Sala 2».`,
          `A Valentina dá um aceno curto e firme. «Obrigada. Fica de olho perto do bar norte na Sala 2».`
        ),
        sala2Route(s)
      ];
    },
    next: null
  };
  VN.remind = {
    text: function (s) {
      return [
        t(
          `Valentina tilts her chin toward the stairwell. «Still trembling down the concrete. Look for Celeste or whoever is holding that white sleeve in SALA 2 // THE ATTIC.»`,
          `Valentina señala con el mentón la escalera. «Sigue vibrando por el cemento. Busca en SALA 2 // EL ÁTICO quién sostiene esa funda blanca».`,
          `A Valentina aponta com o queixo pra escada. «Ainda tá vibrando pelo concreto. Procura na SALA 2 // O SÓTÃO quem tá segurando essa capa branca».`
        ),
        sala2Route(s)
      ];
    },
    next: null
  };
  VN.deliver = {
    text: t(
      `Valentina reads your face before you even reach into your pocket. She steps an inch closer, away from the doorway draft. «You found it. Tell me straight—who had 07/50, and why did they bring it tonight?»`,
      `Valentina te lee la cara antes siquiera de que metas la mano al bolsillo. Se acerca un paso, apartándose de la corriente de la puerta. «La encontraste. Dime directo—¿quién tenía la 07/50 y por qué la trajo esta noche?»`,
      `A Valentina lê seu rosto antes mesmo de você enfiar a mão no bolso. Ela chega um passo mais perto, saindo da corrente de ar da porta. «Você achou. Fala direto—quem estava com a 07/50 e por que trouxe hoje à noite?»`
    ),
    choices: [
      K('honest', t(`Hand her the inscribed inner sleeve and tell her Celeste brought it.`, `Entregarle el sobre interior escrito y contarle que lo trajo Celeste.`, `Entregar o envelope interno anotado e contar que foi a Celeste quem trouxe.`), {
        do: { quest: { sq_white_label: 'done' }, flag: 'wl_done', unflag: 'wl_note_from_celeste', fun: 8, soc: 5, weird: -4, care: 1 },
        next: 'deliver_end'
      }),
      K('chill', t(`"Hold on—let me catch my breath first."`, `«Espera—déjame tomar aire primero».`, `«Espera—deixa eu tomar fôlego primeiro».`), { free: true, next: null })
    ]
  };
  VN.deliver_end = {
    text: [
      t(
        `She takes the paper sleeve by its corners—careful with the crease—and tilts it toward the stairwell amber. Two lines of fresh ballpoint ink sit beneath Julián's faded twenty-year-old note: *"07/50 — For the rooms that keep our people moving after the lease runs out. Still dancing, still loud. — C."*`,
        `Toma el sobre de papel por las esquinas—cuidando el doblez—y lo inclina hacia la luz ámbar de la escalera. Dos líneas de tinta fresca descansan bajo la nota gastada de Julián de hace veinte años: «07/50 — Para las pistas que mantienen en movimiento a los nuestros cuando se acaba el contrato. Todavía bailando, todavía fuerte. — C.»`,
        `Ela pega o envelope de papel pelas pontas—cuidando da dobra—e inclina pra luz âmbar da escada. Duas linhas de caneta fresca aparecem embaixo da anotação desbotada do Julián de vinte anos atrás: «07/50 — Pras pistas que mantêm os nossos em movimento depois que o contrato vence. Ainda dançando, ainda alto. — C.»`
      ),
      t(
        `Valentina exhales—a real laugh, half-rough, half-relieved—and folds the sleeve once inside her jacket. «Celeste. Of course it's Celeste. She swore she'd only play that cut again when a room deserved it.» She touches your forearm lightly. «Go enjoy the floor. You carried something heavy without dropping a corner of it.»`,
        `Valentina exhala—una risa real, medio áspera, medio aliviada—y guarda el sobre doblado una vez dentro de la chaqueta. «Celeste. Tenía que ser Celeste. Juró que solo volvería a poner ese corte cuando una pista se lo mereciera». Te roza el antebrazo con ligereza. «Ve a disfrutar la pista. Cargaste algo pesado sin doblarle una sola esquina».`,
        `A Valentina solta o ar—uma risada de verdade, meio rouca, meio aliviada—e guarda o envelope dobrado uma vez dentro da jaqueta. «Celeste. Tinha que ser a Celeste. Ela jurou que só ia botar esse corte de novo quando uma pista merecesse». Ela toca seu antebraço de leve. «Vai curtir a pista. Você carregou uma coisa pesada sem amassar nenhum canto».`
      )
    ],
    next: null
  };
  VN.after = {
    text: t(
      `Valentina no longer has her palm on the wall; she is tapping her boot against the concrete on the fourth bar, right on time. «Celeste says she's keeping the vinyl. Good. Let the kids upstairs argue about whose track it is.»`,
      `Valentina ya no apoya la palma en la pared; marca el cuarto compás con la punta de la bota sobre el cemento, exacta. «Celeste dice que se queda el vinilo. Bien. Que los de arriba discutan de quién es el tema».`,
      `A Valentina já não está mais com a palma na parede; ela marca o quarto compasso com a ponta da bota no concreto, certinho. «A Celeste disse que vai ficar com o vinil. Ótimo. Deixa o pessoal lá de cima discutir de quem é a faixa».`
    ),
    choices: [
      K('ask', t(`"What did Julián write on it originally?"`, `«¿Qué había escrito Julián originalmente?»`, `«O que o Julián tinha escrito originalmente?»`), { next: 'julian_note' }),
      LEAVE()
    ]
  };
  VN.julian_note = {
    text: t(
      `«"No VIP, no encore, play at 45 if you're brave."» She smiles properly this time. «He loved a cheap joke on a clean master.»`,
      `««Sin VIP, sin bis, tócalo a 45 si te atreves»». Esta vez sonríe de verdad. «Le encantaba un chiste barato sobre un máster limpio».`,
      `««Sem VIP, sem bis, toca em 45 se tiver coragem»». Dessa vez ela sorri de verdade. «Ele adorava uma piada boba num master limpo».`
    ),
    once: true, next: null
  };
  D.valentina = { who: 'valentina', role: t('PRODUCER // EAST STAIRS', 'PRODUCTORA // ESCALERA ESTE', 'PRODUTORA // ESCADA LESTE'), start: 'st', nodes: VN };

  /* ---------------------------------------------------------------- dialogue 2: CELESTE (attic, 9.5, 4.2) */
  const CN = {};
  CN.st = { branch: [
    { req: F('wl_done'), to: 'after' },
    { req: F('wl_note_from_celeste'), to: 'remind_down' },
    { req: function (s) { return s.quests.sq_white_label === 'active'; }, to: 'quest_a' },
    { req: function () { return true; }, to: 'idle' }
  ] };
  CN.idle = {
    text: t(
      `By the north bar of Sala 2, an older woman in a wine cardigan and platform boots keeps one elbow over a plain white 12" cardboard sleeve stamped 07/50 in faded blue ink. «Careful, darling—every twenty-year-old in here thinks thirty is retirement, and here I am at fifty-two defending my drink from elbows.»`,
      `Junto a la barra norte de Sala 2, una mujer mayor con cárdigan vino y botas de plataforma protege con el codo una funda blanca de 12" sellada 07/50 en tinta azul gastada. «Cuidado, cariño—cada chico de veinte aquí cree que los treinta son la jubilación, y acá estoy a los cincuenta y dos defendiendo mi trago de los codazos».`,
      `Perto do bar norte da Sala 2, uma mulher mais velha de cardigã vinho e botas plataforma protege com o cotovelo uma capa branca de 12" carimbada 07/50 em tinta azul desbotada. «Cuidado, bem—todo jovem de vinte aqui acha que trinta é aposentadoria, e aqui tô eu aos cinquenta e dois defendendo meu copo das cotoveladas».`
    ),
    choices: [
      K('ask', t(`"That white sleeve—is that 'Umbral 04'?"`, `«Esa funda blanca—¿es «Umbral 04»?»`, `«Essa capa branca—é «Umbral 04»?»`), { next: 'idle_sleeve' }),
      LEAVE()
    ]
  };
  CN.idle_sleeve = {
    text: t(
      `She covers the blue stamp with two ringed fingers and eyes you with amusement. «Sharp eyes. Yes—07/50. Unless someone downstairs by the east stairs sent you looking for a ghost, let me enjoy my bassline in peace.»`,
      `Cubre el sello azul con dos dedos llenos de anillos y te mira divertida. «Buen ojo. Sí—07/50. Salvo que alguien abajo junto a la escalera este te haya mandado a buscar un fantasma, déjame disfrutar mi bajo en paz».`,
      `Ela cobre o carimbo azul com dois dedos cheios de anéis e olha divertida pra você. «Olho bom. É—07/50. A menos que alguém lá embaixo perto da escada leste tenha te mandado atrás de um fantasma, me deixa curtir meu grave em paz».`
    ),
    next: null
  };
  CN.quest_a = {
    text: [
      t(
        `By the north bar of Sala 2, Celeste rests an elbow over a white cardboard 12" sleeve stamped 07/50 in faded blue ink. She notices you staring at the number, lifts her chin, and laughs. «Don't tell me security started auditing vinyl too. Wait—no. You have the face of someone sent up the stairs by Valentina.»`,
        `Junto a la barra norte de Sala 2, Celeste apoya un codo sobre una funda blanca de cartón de 12" sellada 07/50 en tinta azul gastada. Nota que miras el número, levanta el mentón y se ríe. «No me digas que seguridad ahora también audita vinilos. Espera—no. Tienes cara de que te mandó Valentina por la escalera».`,
        `Perto do bar norte da Sala 2, a Celeste apoia o cotovelo numa capa branca de papelão 12" carimbada 07/50 em tinta azul desbotada. Ela percebe você olhando pro número, levanta o queixo e ri. «Não me diz que a segurança começou a auditar vinil também. Peraí—não. Você tem cara de quem foi mandado pela Valentina escada acima».`
      ),
      t(
        `She pulls the paper inner sleeve half-way out—the vinyl itself is spinning up in the booth, loaned to the DJ for one track. «Fifty-two years old, two questionable knees, and I still come to rooms like this because nobody else builds a chapel without demanding a sermon. Julián slipped 07/50 into my bag twenty years ago after we argued all night over whether a bassline counts as a love letter.»`,
        `Saca a medias el sobre interior de papel—el vinilo gira ahora mismo en la cabina, prestado al DJ por un tema. «Cincuenta y dos años, dos rodillas negociando cada compás, y sigo viniendo a salas así porque nadie más levanta una capilla sin exigir sermón. Julián metió la 07/50 en mi bolso hace veinte años después de discutir toda la noche si una línea de bajo cuenta como carta de amor».`,
        `Ela puxa o envelope interno de papel até a metade—o vinil mesmo está girando lá na cabine, emprestado pro DJ por uma faixa. «Cinquenta e dois anos, dois joelhos negociando cada compasso, e eu ainda venho pra salas assim porque mais ninguém ergue uma capela sem cobrar sermão. O Julián enfiou a 07/50 na minha bolsa há vinte anos depois de a gente discutir a noite inteira se uma linha de baixo conta como carta de amor».`
      )
    ],
    choices: [
      K('honest', t(`"Valentina won't come up—she says seeing it spin would undo her."`, `«Valentina no quiere subir—dice que verlo girar la desarmaría».`, `«A Valentina não quer subir—disse que ver o disco girar ia desmontar ela».`), { next: 'quest_b' }),
      K('joke', t(`"Did you really bring a 2006 dubplate to a club bar in a tote bag?"`, `«¿De verdad trajiste un dubplate de 2006 a una barra de club en una tote bag?»`, `«Você trouxe mesmo um dubplate de 2006 pro bar de um club numa ecobag?»`), { next: 'quest_tote' })
    ]
  };
  CN.quest_tote = {
    text: t(
      `«A reinforced tote bag, thank you, with cardboard stiffeners. Amateur hour ended in 2004.» She taps the bar wood. «I told the DJ they get four minutes of it, then it goes straight back into antistatic paper. Now tell me how Valentina's holding up down there.»`,
      `«Una tote bag reforzada, muchas gracias, con cartones rígidos. El amateurismo se terminó en 2004». Golpea la madera de la barra. «Le dije al DJ que tiene cuatro minutos de pista y luego vuelve directo al papel antiestático. Ahora dime cómo está Valentina allá abajo».`,
      `«Uma ecobag reforçada, muito obrigada, com papelão rígido. O amadorismo acabou em 2004». Ela bate na madeira do bar. «Eu avisei pro DJ que ele tem quatro minutos de pista e depois volta direto pro papel antiestático. Agora me conta como a Valentina tá lá embaixo».`
    ),
    next: 'quest_b'
  };
  CN.quest_b = {
    text: t(
      `Celeste softens—not sad, just unhurried, the way older ravers get when grief has moved into the furniture. «Tell her the dead don't only live in photo frames; sometimes they move through copper coils and blow dust off a ceiling. Still—she shouldn't have to come up here if her legs say no. Let me write on the inner sleeve. Hand me a flat spot on the counter.»`,
      `Celeste se suaviza—no triste, solo sin apuro, como quien ya le hizo lugar al duelo entre los muebles. «Dile que los muertos no viven solo en portarretratos; a veces pasan por bobinas de cobre y sacuden el polvo del techo. Igual—no tiene por qué subir si las piernas dicen que no. Déjame escribir en el sobre interior. Hazme un lugar plano en la barra».`,
      `A Celeste amacia—não triste, só sem pressa, do jeito que quem já convive com o luto há anos fica. «Diz pra ela que os mortos não moram só em porta-retrato; às vezes passam por bobinas de cobre e tiram a poeira do teto. Ainda assim—ela não precisa subir se as pernas disserem não. Deixa eu escrever no envelope interno. Me dá um espaço liso no balcão».`
    ),
    choices: [
      K('yes', t(`Hold the paper inner sleeve steady while Celeste writes her note.`, `Sostener firme el sobre interior de papel mientras Celeste escribe su nota.`, `Segurar firme o envelope interno de papel enquanto a Celeste escreve o bilhete.`), {
        do: { flag: 'wl_note_from_celeste' },
        next: 'inscribed'
      }),
      LEAVE()
    ]
  };
  CN.inscribed = {
    text: t(
      `She uncaps a stubborn blue pen, writes two crisp lines beneath Julián's old note, blows the ink dry, and tucks the sleeve cleanly into your hand. «Take the inner sleeve down to Valentina by the east stairs on MAIN FLOOR. I'll stay up here and make sure the DJ cues out cleanly before the kids butcher the mix.»`,
      `Destapa un bolígrafo azul terco, escribe dos líneas limpias debajo de la vieja nota de Julián, sopla la tinta y te pone el sobre en la mano. «Baja este sobre interior hasta Valentina junto a la escalera este de PISTA PRINCIPAL. Yo me quedo arriba vigilando que el DJ salga limpio antes de que arruinen la mezcla».`,
      `Ela destampa uma caneta azul teimosa, escreve duas linhas limpas embaixo da anotação antiga do Julián, assopra a tinta e coloca o envelope na sua mão. «Leva esse envelope interno lá embaixo pra Valentina perto da escada leste da PISTA PRINCIPAL. Eu fico aqui em cima garantindo que o DJ saia limpo antes que estraguem a mixagem».`
    ),
    next: null
  };
  CN.remind_down = {
    text: t(
      `Celeste lifts her glass toward the west stairwell. «You've already got my handwriting in your pocket. Take the inner sleeve down to VALENTINA on MAIN FLOOR—east wall, by the stairs.»`,
      `Celeste levanta el vaso hacia la escalera oeste. «Ya llevas mi letra en el bolsillo. Baja el sobre interior hasta VALENTINA en PISTA PRINCIPAL—pared este, junto a las escaleras».`,
      `A Celeste ergue o copo na direção da escada oeste. «Você já tá com a minha letra no bolso. Leva o envelope interno pra VALENTINA na PISTA PRINCIPAL—parede leste, perto da escada».`
    ),
    next: null
  };
  CN.after = {
    text: t(
      `The record is back inside its white outer jacket under Celeste's arm, safe and smug. «Did she laugh? Tell me she laughed. If Valentina went misty over a four-bar skip, I'll never let her live it down.»`,
      `El disco ya volvió a su funda blanca bajo el brazo de Celeste, a salvo y satisfecho. «¿Se rio? Dime que se rio. Si Valentina se puso sentimental por un salto de cuatro compases, no se lo voy a perdonar nunca».`,
      `O disco já voltou pra capa branca embaixo do braço da Celeste, salvo e orgulhoso. «Ela riu? Me diz que ela riu. Se a Valentina ficou emotiva por um pulo de quatro compassos, eu nunca mais deixo ela esquecer».`
    ),
    next: null
  };
  D.celeste = { who: 'celeste', role: t('ARCHIVIST // SALA 2 BAR', 'ARCHIVISTA // BARRA SALA 2', 'ARQUIVISTA // BAR SALA 2'), start: 'st', nodes: CN };

  /* ---------------------------------------------------------------- dialogue 3: DAMIÁN (main, 12.5, 7.5) */
  const DN = {};
  DN.st = { branch: [
    { req: F('sc_done'), to: 'after' },
    { req: function (s) { return s.quests.sq_communion === 'active' && !!s.flags.sc_phase_marked; }, to: 'deliver' },
    { req: function (s) { return s.quests.sq_communion === 'active'; }, to: 'remind' },
    { req: function () { return true; }, to: 'intro' }
  ] };
  DN.intro = {
    text: [
      t(
        `Near the upper-left edge of the Main Floor, Damián crouches slightly with his eyes shut, holding a heavy brass tuning fork flush against a laminated grid card. A crossbody tool bag bumps his hip every time the kick hits.`,
        `Cerca del borde superior izquierdo de la Pista Principal, Damián flexiona apenas las rodillas con los ojos cerrados, apoyando un pesado diapasón de bronce contra una tarjeta cuadriculada laminada. Un bolso cruzado de herramientas le golpea la cadera en cada bombo.`,
        `Perto da ponta superior esquerda da Pista Principal, o Damián dobra de leve os joelhos com os olhos fechados, encostando um diapasão pesado de latão num cartão quadriculado plastificado. Uma bolsa transversal de ferramentas bate no quadril dele a cada bumbo.`
      ),
      t(
        `«Wait—hold still for two beats,» he says, opening one eye. «Hear that? Not with your ears. In your sternum. When MAIN FLOOR and SALA 2 upstairs both push sub below 48 hertz, the concrete slab between them stops behaving as a wall and turns into a drumhead. They phase-lock into a third phantom rhythm.»`,
        `«Espera—quédate quieto dos tiempos», dice abriendo un ojo. «¿Lo oyes? No con los oídos. En el esternón. Cuando PISTA PRINCIPAL y SALA 2 arriba empujan subgraves bajo los 48 hercios, la losa de hormigón entre ambas deja de actuar como muro y empieza a vibrar como parche. Entran en fase y crean un tercer ritmo fantasma».`,
        `«Espera—fica parado dois tempos», diz ele abrindo um olho. «Tá ouvindo? Não com os ouvidos. No esterno. Quando a PISTA PRINCIPAL e a SALA 2 lá em cima empurram sub abaixo de 48 hertz, a laje de concreto entre as duas para de agir como parede e vira pele de tambor. Elas entram em fase num terceiro ritmo fantasma».`
      )
    ],
    choices: [
      K('ask', t(`"What do you need upstairs in Sala 2?"`, `«¿Qué necesitas arriba en Sala 2?»`, `«O que você precisa lá em cima na Sala 2?»`), { next: 'why' }),
      K('yes', t(`"Give me the Brass Tuning Fork & Phase Card. I'll find Sora."`, `«Dame el diapasón de bronce y la tarjeta de fase. Buscaré a Sora».`, `«Me dá o diapasão de latão e o cartão de fase. Vou achar a Sora».`), {
        do: { flag: ['sc_started', 'have_tuning_card'], quest: { sq_communion: 'active' } },
        next: 'accepted'
      }),
      LEAVE()
    ]
  };
  DN.why = {
    text: t(
      `«A second pair of hands—and zero ear-bias. Most hearing engineers chase highs with microphones and miss half the room. Upstairs in SALA 2 // THE ATTIC, look for SORA in the north-east lounge. She's deaf, she reads sub-bass through boot soles and collarbone faster than my spectrum analyser, and she refuses to come down here while I'm waving clipboards.» He grins. «Carry this Brass Tuning Fork & Phase Card up to her, do whatever floor check she asks, and bring back where she marks the standing-wave node.»`,
      `«Un segundo par de manos—y cero sesgo auditivo. Casi todos los técnicos oyentes persiguen agudos con micrófonos y se pierden media sala. Arriba en SALA 2 // EL ÁTICO, busca a SORA en el lounge noreste. Es sorda, lee el subgrave por las suelas y la clavícula más rápido que mi analizador de espectro, y se niega a bajar mientras yo ande con planillas». Sonríe. «Llévale este diapasón de bronce y la tarjeta de fase, haz la calibración de piso que te pida y tráeme dónde marca el nodo de onda estacionaria».`,
      `«Um segundo par de mãos—e zero viés auditivo. Quase todo técnico ouvinte corre atrás de agudo com microfone e perde metade da sala. Lá em cima na SALA 2 // O SÓTÃO, procura a SORA no lounge nordeste. Ela é surda, lê o subgrave pela sola da bota e pela clavícula mais rápido que o meu analisador de espectro, e se recusa a descer enquanto eu estiver andando de prancheta». Ele sorri. «Leva esse diapasão de latão e o cartão de fase pra ela, faz a checagem de piso que ela pedir e traz de volta onde ela marcar o nó da onda estacionária».`
    ),
    choices: [
      K('yes', t(`Take the Brass Tuning Fork & Phase Card.`, `Tomar el diapasón de bronce y la tarjeta de fase.`, `Pegar o diapasão de latão e o cartão de fase.`), {
        do: { flag: ['sc_started', 'have_tuning_card'], quest: { sq_communion: 'active' } },
        next: 'accepted'
      }),
      LEAVE()
    ]
  };
  DN.accepted = {
    text: function (s) {
      return [
        t(
          `Damián slides the warm brass fork and grid card into your palm. «Look for SORA in the north-east lounge of SALA 2 // THE ATTIC. Don't stand stiff when she tests the floor—she spots armored shoulders from across a room.»`,
          `Damián te deja el diapasón tibio de bronce y la tarjeta cuadriculada en la palma. «Busca a SORA en el lounge noreste de SALA 2 // EL ÁTICO. No te pares rígido cuando pruebe el piso—detecta hombros acorazados al instante».`,
          `O Damián coloca o diapasão morno de latão e o cartão quadriculado na sua palma. «Procura a SORA no lounge nordeste da SALA 2 // O SÓTÃO. Não fica duro quando ela testar o piso—ela identifica ombro travado do outro lado da sala».`
        ),
        sala2Route(s)
      ];
    },
    next: null
  };
  DN.remind = {
    text: function (s) {
      return [
        t(
          `Damián taps his chest lightly. «Still drifting by half a beat. Take the Tuning Fork & Phase Card up to SORA in SALA 2 // THE ATTIC (north-east lounge).»`,
          `Damián se da un toque suave en el pecho. «Todavía se corre medio tiempo. Lleva el diapasón y la tarjeta a SORA en SALA 2 // EL ÁTICO (lounge noreste)».`,
          `O Damián bate de leve no peito. «Ainda tá fugindo meio tempo. Leva o diapasão e o cartão pra SORA na SALA 2 // O SÓTÃO (lounge nordeste)».`
        ),
        sala2Route(s)
      ];
    },
    next: null
  };
  DN.deliver = {
    text: t(
      `Damián spots the black ink mark on your Phase Card before you even speak. He whistles softly. «42 hertz, dead on the third ceiling beam—and you actually look relaxed. Did she bully your posture?»`,
      `Damián ve la marca de tinta negra en tu tarjeta de fase antes de que hables. Silba por lo bajo. «42 hercios, clavado en la tercera viga del techo—y hasta se te ve suelto. ¿Te corrigió la postura?»`,
      `O Damián vê a marca de tinta preta no seu cartão de fase antes mesmo de você falar. Ele assovia baixo. «42 hertz, cravado na terceira viga do teto—e você até parece solto. Ela deu bronca na sua postura?»`
    ),
    choices: [
      K('yes', t(`Strike the brass fork with him against the floor rail to lock the crossover.`, `Golpear el diapasón con él contra el riel del piso para fijar el cruce.`, `Bater o diapasão com ele no trilho do chão pra travar o crossover.`), {
        do: { quest: { sq_communion: 'done' }, flag: 'sc_done', unflag: 'have_tuning_card', fun: 8, soc: 5, weird: -4, care: 1 },
        next: 'deliver_end'
      }),
      K('chill', t(`"Not yet—give me a second."`, `«Todavía no—dame un segundo».`, `«Ainda não—me dá um segundo».`), { free: true, next: null })
    ]
  };
  DN.deliver_end = {
    text: [
      t(
        `He taps two settings on his pocket delay rack, and both of you hold the brass stem as it rings into the floor plate. For three seconds the rattle in your teeth stops fighting the room upstairs—both sound systems drop into a single warm, unhurried pulse right behind the solar plexus.`,
        `Ajusta dos puntos en su rack de bolsillo y ambos sostienen el vástago de bronce mientras vibra contra la chapa del suelo. Durante tres segundos el zumbido deja de pelear con la sala de arriba—los dos sistemas de sonido caen en un solo pulso tibio y sin apuro justo detrás del plexo solar.`,
        `Ele ajusta dois pontos no rack de bolso e vocês dois seguram a haste de latão vibrando contra a chapa do chão. Por três segundos o zumbido para de brigar com a sala de cima—os dois sistemas de som encaixam num único pulso morno e sem pressa logo atrás do plexo solar.`
      ),
      t(
        `«There it is,» Damián says, tucking the card into his vest. «Two rooms breathing on one hinge. Tell Sora I owe her an espresso—no clipboard, promise.»`,
        `«Ahí está», dice Damián guardando la tarjeta en el chaleco. «Dos salas respirando en la misma bisagra. Dile a Sora que le debo un espresso—sin planilla, lo prometo».`,
        `«Aí está», diz o Damián guardando o cartão no colete. «Duas salas respirando na mesma dobradiça. Diz pra Sora que tô devendo um espresso pra ela—sem prancheta, prometo».`
      )
    ],
    next: null
  };
  DN.after = {
    text: t(
      `Damián isn't crouching anymore; he is dancing in place with loose shoulders, eyes open, smiling at the ceiling. «Forty-two hertz, steady as a tide. Feel how the kick leaves room for your lungs now?»`,
      `Damián ya no está agachado; baila en su sitio con los hombros sueltos, ojos abiertos, sonriéndole al techo. «Cuarenta y dos hercios, firmes como marea. ¿Sientes cómo el bombo ahora le deja aire a los pulmones?»`,
      `O Damián não tá mais agachado; ele dança no lugar com os ombros soltos, olhos abertos, sorrindo pro teto. «Quarenta e dois hertz, firmes feito maré. Sente como o bumbo agora deixa espaço pros pulmões?»`
    ),
    next: null
  };
  D.damian = { who: 'damian', role: t('ACOUSTIC TECH // MAIN FLOOR', 'TÉCNICO ACÚSTICO // PISTA PRINCIPAL', 'TÉCNICO DE SOM // PISTA PRINCIPAL'), start: 'st', nodes: DN };

  /* ---------------------------------------------------------------- dialogue 4: SORA (attic, 22.5, 4.2) */
  const SN = {};
  SN.st = { branch: [
    { req: F('sc_done'), to: 'after' },
    { req: F('sc_phase_marked'), to: 'remind_down' },
    { req: function (s) { return s.quests.sq_communion === 'active'; }, to: 'quest_a' },
    { req: function () { return true; }, to: 'idle' }
  ] };
  SN.idle = {
    text: t(
      `Near the north-east lounge of Sala 2, Sora stands barefoot-still inside heavy boots, one gloved knuckle resting lightly on the wall timber while she watches the floor. When you step into her sightline she signs a brisk hello, then speaks cleanly with a dry grin. «You walk like you're trying not to wake your ankles. Relax—you can take up space in here.»`,
      `Junto al lounge noreste de Sala 2, Sora permanece quieta dentro de unas botas pesadas, un nudillo enguantado apoyado en la madera de la pared mientras observa la pista. Cuando entras en su campo visual hace una seña ágil de saludo y habla con una sonrisa seca. «Caminas intentando no despertar a tus tobillos. Relájate—aquí puedes ocupar espacio».`,
      `Perto do lounge nordeste da Sala 2, a Sora fica parada firme dentro de botas pesadas, com um dedo de luva apoiado na madeira da parede enquanto observa a pista. Quando você entra no campo de visão dela, faz um sinal rápido de oi e fala com um sorriso seco. «Você anda tentando não acordar os próprios tornozelos. Relaxa—aqui você pode ocupar espaço».`
    ),
    choices: [
      K('ask', t(`"How does Sala 2 feel from up here?"`, `«¿Cómo se siente Sala 2 desde aquí arriba?»`, `«Como se sente a Sala 2 daqui de cima?»`), { next: 'idle_feel' }),
      LEAVE()
    ]
  };
  SN.idle_feel = {
    text: t(
      `«Warm in the collarbone, messy at the edges—the room downstairs is trying to talk through the concrete.» She taps her boot heel twice. «If you see someone downstairs waving a brass tuning fork, tell him to stop measuring with his ears and send the card up.»`,
      `«Tibia en la clavícula, desprolija en los bordes—como si la sala de abajo quisiera hablar a través del hormigón». Golpea dos veces con el tacón de la bota. «Si ves abajo a alguien agitando un diapasón de bronce, dile que deje de medir con los oídos y suba la tarjeta».`,
      `«Morna na clavícula, bagunçada nas bordas—como se a sala de baixo quisesse conversar pelo concreto». Ela bate o salto da bota duas vezes. «Se você ver lá embaixo alguém balançando um diapasão de latão, diz pra ele parar de medir com os ouvidos e mandar o cartão».`
    ),
    next: null
  };
  SN.quest_a = {
    text: [
      t(
        `Sora catches the glint of brass in your hand before you say a word, and a bright, knowing grin breaks across her face. She taps her collarbone twice, then points at your card. «Damián sent a courier. Good—because if he came up himself he'd spend twenty minutes squinting at graphs instead of feeling his own ribs.»`,
        `Sora capta el brillo del bronce en tu mano antes de que digas palabra, y le cruza la cara una sonrisa cómplice. Se da dos toques en la clavícula y señala tu tarjeta. «Damián mandó mensajero. Mejor—si subía él pasaría veinte minutos entrecerrando ojos frente a gráficos en vez de sentir sus propias costillas».`,
        `A Sora pega o brilho do latão na sua mão antes de você abrir a boca, e um sorriso cúmplice toma conta do rosto dela. Ela bate duas vezes na clavícula e aponta pro seu cartão. «O Damián mandou mensageiro. Ainda bem—se ele subisse sozinho ia passar vinte minutos apertando o olho pra gráfico em vez de sentir as próprias costelas».`
      ),
      t(
        `«Hearing ravers walk into a club armored from jaw to ankles, guarding against noise. Deaf dancers don't get to pretend a body isn't an eardrum—we read the truth of a room through boot soles, sternum, and palm pressure.» She beckons you half a step closer to the nearest speaker stack. «If I'm marking Damián's phase card, you do the three-step floor check with me. Ready?»`,
        `«Quienes oyen entran al club acorazados de la mandíbula a los tobillos, defendiéndose del volumen. Los bailarines sordos no podemos fingir que el cuerpo no es un tímpano—leemos la verdad de la sala por la suela, el esternón y la palma». Te hace una seña para acercarte medio paso al parlante. «Si voy a marcar la tarjeta de Damián, haces conmigo el chequeo de piso en tres pasos. ¿Listo?»`,
        `«Quem ouve entra no club blindado do maxilar até os tornozelos, se protegendo do volume. Dançarinos surdos não podem fingir que o corpo não é um tímpano—a gente lê a verdade da sala pela sola da bota, pelo esterno e pela palma». Ela faz sinal pra você chegar meio passo perto da caixa de som. «Se é pra eu marcar o cartão do Damián, você faz a checagem de piso em três passos comigo. Topa?»`
      )
    ],
    choices: [
      K('yes', t(`"Ready. Show me step one."`, `«Listo. Muéstrame el paso uno».`, `«Topo. Mostra o passo um».`), { next: 'step1' }),
      LEAVE()
    ]
  };
  SN.step1 = {
    text: t(
      `STEP 1 — PALM TO THE SUB. Sora places your hand near the vibrating timber of the speaker cabinet without pushing. «Don't poke it with fingertips like you're checking if paint is dry. Lay the whole heel of your palm flat. What does the cabinet do?»`,
      `PASO 1 — PALMA AL SUBGRAVE. Sora acerca tu mano a la madera vibrante del parlante sin forzar. «No la toques con la yema de los dedos como probando si se secó la pintura. Apoya entera la base de la palma. ¿Qué hace la caja?»`,
      `PASSO 1 — PALMA NO SUB. A Sora guia sua mão perto da madeira vibrante da caixa de som sem forçar. «Não cutuca com a ponta dos dedos feito quem testa tinta fresca. Encosta a base da palma inteira. O que a caixa faz?»`
    ),
    choices: [
      K('honest', t(`Let the wood rattle straight up your wrist and soften your elbow into it.`, `Dejar que la madera vibre muñeca arriba y aflojar el codo en el pulso.`, `Deixar a madeira vibrar pelo pulso acima e amolecer o cotovelo na batida.`), { do: { flag: 'sc_somatic_soft' }, next: 'step2_warm' }),
      K('blunt', t(`Press stiffly with a locked wrist and try to count the hertz in your head.`, `Presionar rígido con la muñeca trabada intentando contar hercios de memoria.`, `Pressionar duro com o pulso travado tentando contar hertz de cabeça.`), { do: { flag: 'sc_somatic_stiff' }, next: 'step2_tease' })
    ]
  };
  SN.step2_warm = {
    text: t(
      `Sora's eyes crinkle approvingly. «Better. Look how fast your wrist stopped arguing with forty hertz.» Now STEP 2 — UNLOCK THE KNEES. «Half this city dances with locked knees so they look cool in photographs nobody's even taking. Drop two centimetres into your heels and catch the 4/4 phase coming up from MAIN FLOOR.»`,
      `Los ojos de Sora se achican con aprobación. «Mejor. Mira qué rápido tu muñeca dejó de discutir con los cuarenta hercios». Ahora PASO 2 — DESTRABAR LAS RODILLAS. «Media ciudad baila con las rodillas trabadas para verse seria en fotos que nadie saca. Baja dos centímetros hacia los talones y atrapa la fase 4/4 que sube desde PISTA PRINCIPAL».`,
      `Os olhos da Sora se fecham num sorriso aprovado. «Melhor. Olha como o seu pulso parou rápido de brigar com quarenta hertz». Agora PASSO 2 — DESTRAVAR OS JOELHOS. «Metade dessa cidade dança de joelho travado pra parecer séria em foto que ninguém tira. Desce dois centímetros nos calcanhares e pega a fase 4/4 subindo da PISTA PRINCIPAL».`
    ),
    choices: [
      K('yes', t(`Unlock your knees and let your weight settle into the concrete beat.`, `Destrabar las rodillas y dejar caer el peso en el pulso del cemento.`, `Destravar os joelhos e deixar o peso descer na batida do concreto.`), { next: 'step3' }),
      K('ask', t(`Shift your weight heel-to-toe until the two rooms stop clashing.`, `Pasar el peso del talón a la punta hasta que ambas salas dejen de chocar.`, `Alternar o peso do calcanhar à ponta até as duas salas pararem de brigar.`), { next: 'step3' })
    ]
  };
  SN.step2_tease = {
    text: t(
      `Sora taps the back of your locked wrist once with one gloved finger, grinning. «Ah—another acoustic cop. Put the ruler away, sweetheart; skin isn't a spreadsheet.» Now STEP 2 — UNLOCK THE KNEES. «Drop two centimetres into your heels so the floor downstairs stops bouncing off your kneecaps.»`,
      `Sora te da un toque en la muñeca trabada con un dedo enguantado, sonriendo. «Ah—otro policía acústico. Guarda la regla, cielo; la piel no es una planilla de cálculo». Ahora PASO 2 — DESTRABAR LAS RODILLAS. «Baja dos centímetros hacia los talones para que el piso de abajo deje de rebotar en tus rótulas».`,
      `A Sora dá um toque no seu pulso travado com um dedo de luva, rindo. «Ah—outro fiscal acústico. Guarda a régua, bem; pele não é planilha». Agora PASSO 2 — DESTRAVAR OS JOELHOS. «Desce dois centímetros nos calcanhares pro chão lá de baixo parar de quicar nos seus joelhos».`
    ),
    choices: [
      K('yes', t(`Shake out your shoulders, unlock your knees, and sink into the 4/4 phase.`, `Sacudir los hombros, destrabar las rodillas y hundirse en la fase 4/4.`, `Soltar os ombros, destravar os joelhos e afundar na fase 4/4.`), { next: 'step3' }),
      K('honest', t(`Stop counting and let the floorboards carry your weight.`, `Dejar de contar y permitir que el piso sostenga el peso.`, `Parar de contar e deixar o piso carregar o peso.`), { next: 'step3' })
    ]
  };
  SN.step3 = {
    text: t(
      `STEP 3 — BREATHE INTO THE CROSSOVER. Sora mirrors your stance an arm's length away, palm held just clear of your ribs so you match tempo without words. «Breathe out on the off-beat—right between Sala 2's kick and the Main Floor push underneath us. Feel that? That's the phantom third rhythm.»`,
      `PASO 3 — RESPIRAR EN EL CRUCE. Sora acompaña tu postura a un brazo de distancia, la palma apenas separada de tus costillas para marcar el pulso sin palabras. «Exhala en el contratiempo—justo entre el bombo de Sala 2 y el empuje de Pista Principal abajo. ¿Lo sientes? Ese es el tercer ritmo fantasma».`,
      `PASSO 3 — RESPIRAR NO CROSSOVER. A Sora espelha sua postura a um braço de distância, a palma quase encostando nas suas costelas pra marcar o tempo sem palavras. «Solta o ar no contratempo—bem entre o bumbo da Sala 2 e o peso da Pista Principal lá embaixo. Sente? Esse é o terceiro ritmo fantasma».`
    ),
    choices: [
      K('yes', t(`Exhale on the off-beat and catch the crossover pulse in your ribs.`, `Exhalar en el contratiempo y atrapar el pulso del cruce en las costillas.`, `Soltar o ar no contratempo e pegar o pulso do crossover nas costelas.`), { next: 'mark_ready' }),
      K('honest', t(`Hold eye contact with Sora and ride the third beat all the way out.`, `Sostener la mirada con Sora y seguir el tercer pulso hasta el final.`, `Sustentar o olhar da Sora e acompanhar a terceira batida até o fim.`), { next: 'mark_ready' })
    ]
  };
  SN.mark_ready = {
    text: t(
      `For one clean bar, the floor under your boots and the air in your chest agree completely. Sora nods once, sharp and pleased, and pulls a thick black marker from her pocket. «There. Now you actually felt what Damián's trying to tune. Give me the card.»`,
      `Durante un compás limpio, el piso bajo tus botas y el aire en tu pecho coinciden por completo. Sora asiente una vez, precisa y contenta, y saca un marcador negro grueso del bolsillo. «Listo. Ahora sí sentiste lo que Damián intenta afinar. Dame la tarjeta».`,
      `Por um compasso inteiro, o chão embaixo das suas botas e o ar no seu peito concordam completamente. A Sora assente uma vez, precisa e satisfeita, e puxa um marcão preto do bolso. «Pronto. Agora sim você sentiu o que o Damián tenta afinar. Me dá o cartão».`
    ),
    choices: [
      K('yes', t(`Hold out the Phase Card so Sora can ink the standing-wave node.`, `Extender la tarjeta de fase para que Sora marque el nodo de onda estacionaria.`, `Estender o cartão de fase pra Sora marcar o nó da onda estacionária.`), {
        do: { flag: 'sc_phase_marked' },
        next: 'marked'
      }),
      LEAVE()
    ]
  };
  SN.marked = {
    text: t(
      `She inks a crisp black crest across the 42 Hz line and hands the card back with a tap against the tuning fork—sending one low chime into your palm. «Take it down to DAMIÁN on the upper-left side of MAIN FLOOR. Tell him to keep his shoulders down.»`,
      `Dibuja una cresta negra nítida sobre la línea de 42 hercios y te devuelve la tarjeta con un toque contra el diapasón—mandando un tintineo grave directo a tu palma. «Bájala hasta DAMIÁN en el borde superior izquierdo de PISTA PRINCIPAL. Dile que baje los hombros».`,
      `Ela desenha uma crista preta nítida na linha de 42 hertz e devolve o cartão com um toque no diapasão—mandando um tinido grave direto pra sua palma. «Leva pro DAMIÁN na ponta superior esquerda da PISTA PRINCIPAL. Diz pra ele abaixar os ombros».`
    ),
    next: null
  };
  SN.remind_down = {
    text: t(
      `Sora points downward with two fingers and smiles. «The 42 Hz node is inked on your Phase Card already. Take it back down to DAMIÁN on MAIN FLOOR (upper-left edge).»`,
      `Sora señala hacia abajo con dos dedos y sonríe. «El nodo de 42 hercios ya quedó marcado en tu tarjeta. Llévala abajo a DAMIÁN en PISTA PRINCIPAL (borde superior izquierdo)».`,
      `A Sora aponta pra baixo com dois dedos e sorri. «O nó de 42 hertz já tá marcado no seu cartão. Leva de volta pro DAMIÁN na PISTA PRINCIPAL (ponta superior esquerda)».`
    ),
    next: null
  };
  SN.after = {
    text: t(
      `Sora catches your eye from across the speaker rail and raises two fingers—her sign for the two rooms holding phase. «Look at your shoulders. Half an inch lower than when you walked up here. That's what a good crossover buys you.»`,
      `Sora cruza tu mirada desde la baranda del parlante y levanta dos dedos—su señal para las dos salas sosteniendo la fase. «Mira tus hombros. Un centímetro más abajo que cuando subiste. Eso es lo que te regala un buen cruce».`,
      `A Sora pega seu olhar da grade da caixa de som e levanta dois dedos—o sinal dela pras duas salas sustentando a fase. «Olha pros seus ombros. Um centímetro mais baixo de quando você subiu. É isso que um bom crossover te dá».`
    ),
    next: null
  };
  D.sora = { who: 'sora', role: t('SOMATIC DANCER // SALA 2', 'BAILARINA SOMÁTICA // SALA 2', 'DANÇARINA SOMÁTICA // SALA 2'), start: 'st', nodes: SN };

  /* ---------------------------------------------------------------- carried items in ITEMS (I) */
  EM.menuItems = EM.menuItems || [];
  EM.menuItems.push(function (box, s) {
    const row = function (label) {
      const r = EM.ui.el('div', 'stashrow');
      r.appendChild(EM.ui.el('span', 'stl', EM.tr(label)));
      box.appendChild(r);
    };
    if (s.flags.wl_note_from_celeste && !s.flags.wl_done) {
      row(t(
        `«UMBRAL 04» INNER SLEEVE (07/50) — inscribed by Celeste for Valentina (MAIN FLOOR, east stairs).`,
        `SOBRE INTERIOR «UMBRAL 04» (07/50) — escrito por Celeste para Valentina (PISTA PRINCIPAL, escalera este).`,
        `ENVELOPE INTERNO «UMBRAL 04» (07/50) — anotado pela Celeste pra Valentina (PISTA PRINCIPAL, escada leste).`
      ));
    }
    if (s.flags.have_tuning_card && !s.flags.sc_done) {
      row(s.flags.sc_phase_marked
        ? t(
          `BRASS TUNING FORK & PHASE CARD [42 Hz MARKED] — return to Damián (MAIN FLOOR, upper-left).`,
          `DIAPASÓN DE BRONCE Y TARJETA DE FASE [42 Hz MARCADO] — vuelve con Damián (PISTA PRINCIPAL, arriba-izquierda).`,
          `DIAPASÃO DE LATÃO E CARTÃO DE FASE [42 Hz MARCADO] — volte ao Damián (PISTA PRINCIPAL, cima-esquerda).`
        )
        : t(
          `BRASS TUNING FORK & PHASE CARD — bring up to Sora (SALA 2 // THE ATTIC, north-east lounge).`,
          `DIAPASÓN DE BRONCE Y TARJETA DE FASE — lleva a Sora (SALA 2 // EL ÁTICO, lounge noreste).`,
          `DIAPASÃO DE LATÃO E CARTÃO DE FASE — leve pra Sora (SALA 2 // O SÓTÃO, lounge nordeste).`
        ));
    }
  });

  /* ---------------------------------------------------------------- golden stars (EM.seekers) */
  EM.seekers = EM.seekers || [];
  EM.seekers.push(function (s) {
    const res = [];
    if (s.quests.sq_white_label === 'active' && !s.flags.wl_done) {
      res.push(s.flags.wl_note_from_celeste
        ? { key: 'valentina', zone: 'main', label: '★' }
        : { key: 'celeste', zone: 'attic', label: '★' });
    }
    if (s.quests.sq_communion === 'active' && !s.flags.sc_done) {
      res.push(s.flags.sc_phase_marked
        ? { key: 'damian', zone: 'main', label: '★' }
        : { key: 'sora', zone: 'attic', label: '★' });
    }
    return res;
  });

  /* ---------------------------------------------------------------- morning after texts */
  if (story && story.morningRefs) {
    story.morningRefs.push({
      id: 'wl_done', who: '#VALENTINA', ok: function (s) { return !!s.flags.wl_done; },
      t: t(
        `celeste sent a photo of 07/50 on her turntable next to two mugs of coffee. thank you for carrying the sleeve downstairs without making it a museum piece.`,
        `celeste mandó foto de la 07/50 en su tornamesa junto a dos tazas de café. gracias por bajar ese sobre sin convertirlo en pieza de museo.`,
        `a celeste mandou foto da 07/50 na vitrola dela ao lado de duas canecas de café. obrigada por descer aquele envelope sem transformar ele em peça de museu.`
      )
    });
    story.morningRefs.push({
      id: 'sc_done', who: '#SORA', ok: function (s) { return !!s.flags.sc_done; },
      t: t(
        `damian actually bought the espresso and left the clipboard at home. my collarbones are still humming at 42 hz. keep your knees soft this week.`,
        `damián de verdad pagó el espresso y dejó la planilla en casa. mis clavículas siguen zumbando a 42 hz. mantén las rodillas sueltas esta semana.`,
        `o damián pagou mesmo o espresso e deixou a prancheta em casa. minhas clavículas ainda tão zumbindo em 42 hz. mantém os joelhos soltos essa semana.`
      )
    });
  }

  /* ---------------------------------------------------------------- place NPCs */
  (function () {
    const m = EM.zones && EM.zones.main, a = EM.zones && EM.zones.attic;
    if (m) {
      m.npc({ id: 'valentina', cast: 'valentina', x: 35.5, y: 9.5, dlg: 'valentina', dir: 'l', reach: 20 });
      m.npc({ id: 'damian', cast: 'damian', x: 12.5, y: 7.5, dlg: 'damian', dir: 'd', reach: 20 });
    }
    if (a) {
      a.npc({ id: 'celeste', cast: 'celeste', x: 9.5, y: 4.2, dlg: 'celeste', dir: 'd', reach: 20 });
      a.npc({ id: 'sora', cast: 'sora', x: 22.5, y: 4.2, dlg: 'sora', dir: 'd', reach: 20 });
    }
  })();
})();

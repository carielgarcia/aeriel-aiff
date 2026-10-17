/* EXCUSE ME — story v13: the illegal rave. Nobody is in charge, so everything is politics: who holds the keys to a
   warehouse, who pays for the sound, who gets to be tired of whom. Rave-only cast, two storylines (THE RAID, THE
   PETITION), more dealers, and the pickpocket (1 in 150 encounters), after which the friends carry you. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const RV = function (s) { return s.venue === 'rave'; };
  const RVN = function (flag) { return function (s) { return s.venue === 'rave' && !s.flags[flag]; }; };
  const mk = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };
  function cast(id, name, o) { EM.CAST[id] = { name: name, look: Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 3, bottom: 1, bc: 1, acc: 0, wide: false }, o) }; }
  function npc(zone, d) { d.reach = d.reach || 16; d.dir = d.dir || 'd'; Z[zone].npc(d); }

  /* ------------------------------------------------ no door, no guard: the rave has neither Dragan nor Ofelia */
  Z.doors.ents.forEach(function (e) { if (e.id === 'dragan') e.when = function (s) { return !RV(s) && !s.flags.bouncer_ok; }; });
  Z.courtyard.ents.forEach(function (e) { if (e.id === 'ofelia') e.when = function (s) { return !RV(s); }; });

  /* ============================================================ QUEST LOG */
  const Q = EM.QUESTS;
  Q.rv_petition = { title: t(`THE PETITION`, `LA PETICIÓN`, `O ABAIXO-ASSINADO`), desc: function (s) {
    return t(`Maya wants the warehouse kept as a community space and needs three signatures from people who are not her. ${mk(s, 'sig_bea')} Bea, legal observer (main floor). ${mk(s, 'sig_klaus')} Klaus (main floor, very Berlin). ${mk(s, 'sig_madison')} Madison (the attic, very Brooklyn). ${mk(s, 'sig_juniper')} Juniper and the committee (courtyard). ${mk(s, 'sig_sub')} Sub, sound (the tunnel). Then back to Maya.`, `Maya quiere conservar la bodega como espacio comunitario y necesita tres firmas de gente que no sea ella. ${mk(s, 'sig_bea')} Bea, observadora legal (pista). ${mk(s, 'sig_klaus')} Klaus (pista, muy Berlín). ${mk(s, 'sig_madison')} Madison (el ático, muy Brooklyn). ${mk(s, 'sig_juniper')} Juniper y el comité (patio). ${mk(s, 'sig_sub')} Sub, sonido (el túnel). Luego, de vuelta con Maya.`, `Maya quer manter o galpão como espaço comunitário e precisa de três assinaturas de gente que não seja ela. ${mk(s, 'sig_bea')} Bea, observadora jurídica (pista). ${mk(s, 'sig_klaus')} Klaus (pista, bem Berlim). ${mk(s, 'sig_madison')} Madison (o sótão, bem Brooklyn). ${mk(s, 'sig_juniper')} Juniper e o comitê (pátio). ${mk(s, 'sig_sub')} Sub, som (o túnel). Depois, de volta pra Maya.`);
  }, doneText: t(`Maya takes the clipboard like a newborn. The warehouse has a case now, and a stack of handwriting.`, `Maya recibe la tablilla como a un recién nacido. La bodega ya tiene un caso y una pila de letras a mano.`, `Maya pega a prancheta como a um recém-nascido. O galpão agora tem um caso e uma pilha de caligrafias.`) };
  Q.rv_raid = { title: t(`THE RAID`, `LA REDADA`, `A BLITZ`), desc: function (s) {
    return t(`The police scout the warehouse around 03:30. Prepare two things and the night survives. ${mk(s, 'raid_cards')} Rights cards from Bea (main floor). ${mk(s, 'raid_power')} A safe power cut from Sub (the tunnel). ${mk(s, 'raid_look')} A lookout: Pip, outside. ${mk(s, 'raid_comm')} A calm assembly: Juniper's committee (courtyard).`, `La policía ronda la bodega cerca de las 03:30. Prepara dos cosas y la noche sobrevive. ${mk(s, 'raid_cards')} Tarjetas de derechos de Bea (pista). ${mk(s, 'raid_power')} Un corte de luz seguro con Sub (el túnel). ${mk(s, 'raid_look')} Un vigía: Pip, afuera. ${mk(s, 'raid_comm')} Una asamblea tranquila: el comité de Juniper (patio).`, `A polícia ronda o galpão por volta das 03:30. Prepare duas coisas e a noite sobrevive. ${mk(s, 'raid_cards')} Cartões de direitos da Bea (pista). ${mk(s, 'raid_power')} Um corte de luz seguro com a Sub (o túnel). ${mk(s, 'raid_look')} Um vigia: Pip, lá fora. ${mk(s, 'raid_comm')} Uma assembleia calma: o comitê da Juniper (pátio).`);
  }, doneText: t(`03:30 came and went. Whatever happened, it happened to a crowd that knew what to do.`, `Pasaron las 03:30. Pase lo que pase, le pasó a una multitud que sabía qué hacer.`, `Deu 03:30 e passou. O que quer que tenha acontecido, aconteceu com uma multidão que sabia o que fazer.`) };

  const preps = function (s) { return ['raid_cards', 'raid_power', 'raid_look', 'raid_comm'].filter(function (f) { return s.flags[f]; }).length + (s.flags.petition_done ? 1 : 0); };
  const sigs = function (s) { return ['sig_bea', 'sig_klaus', 'sig_madison', 'sig_juniper', 'sig_sub'].filter(function (f) { return s.flags[f]; }).length; };

  /* ============================================================ MAYA, who has the keys (and the clipboard) */
  cast('maya', 'MAYA', { skin: 4, hair: 3, hc: 1, expr: 2, top: 4, tc: 5, bottom: 2, bc: 1, acc: 3 });
  D.maya = {
    who: 'maya', role: t('ORGANIZER', 'ORGANIZADORA', 'ORGANIZADORA'), start: 'st', nodes: {
      st: { branch: [
        { req: function (s) { return !!s.flags.maya_met && !s.flags.petition_done; }, to: 'again' },
        { req: function (s) { return !!s.flags.petition_done && !s.flags.maya_thanked; }, to: 'thanks' },
        { req: function () { return true; }, to: 'a' }
      ] },
      a: {
        text: t(`A woman with a clipboard and a ring of keys the size of a fist is counting heads with her lips. "Welcome. I'm Maya. Technically this is not a venue, so technically none of this is happening. The owner lets us have it until the developer closes the sale. We don't have a licence. We have a lease with a handshake, and a handshake is a document in some countries." She waves the clipboard. "The rent is the DJ. The DJ is free. Everything is a miracle held up by tape."`, `Una mujer con una tablilla y un llavero del tamaño de un puño cuenta cabezas moviendo los labios. «Te damos la bienvenida. Soy Maya. Técnicamente esto no es un local, así que técnicamente nada de esto está pasando. El dueño nos lo presta hasta que el desarrollador cierre la venta. No tenemos licencia. Tenemos un contrato con apretón de manos, y el apretón de manos es un documento en algunos países». Agita la tablilla. «La renta es el DJ. El DJ es gratis. Todo es un milagro sostenido con cinta».`, `Uma mulher com uma prancheta e um molho de chaves do tamanho de um punho conta cabeças mexendo os lábios. «Bem-vinde. Eu sou a Maya. Tecnicamente isso não é uma casa de show, então tecnicamente nada disso tá acontecendo. O dono empresta até a construtora fechar a venda. A gente não tem alvará. A gente tem contrato de aperto de mão, e aperto de mão é documento em alguns países». Ela balança a prancheta. «O aluguel é o DJ. O DJ é de graça. Tudo é um milagre segurado com fita».`),
        do: { flag: 'maya_met', soc: 1 },
        choices: [
          K('ask', t(`"What do you need?"`, `«¿Qué necesitas?»`, `«Do que você precisa?»`), { next: 'need' }),
          K('ask', t(`"Who is the developer?"`, `«¿Quién es el desarrollador?»`, `«Quem é a construtora?»`), { next: 'dev' }),
          K('chill', t(`"Just dancing, thanks."`, `«Solo vengo a bailar, gracias».`, `«Só vim dançar, valeu».`), { free: true, next: null })
        ]
      },
      dev: {
        text: t(`"A fund with a name like a yoga studio. They will turn this into forty flats with a rooftop for 'community'. I'm not against flats. I'm against the word community on a brochure. The people who live here, who dance here, who've had their first kiss behind that speaker, we're the community. We just don't have a logo."`, `«Un fondo con nombre de estudio de yoga. Convertirán esto en cuarenta departamentos con una terraza “comunitaria”. No estoy en contra de los departamentos. Estoy en contra de la palabra comunidad en un folleto. La gente que vive aquí, que baila aquí, que dio su primer beso detrás de ese parlante, esa es la comunidad. Solo que no tenemos logo».`, `«Um fundo com nome de estúdio de ioga. Vão transformar isso em quarenta apartamentos com um terraço "comunitário". Não sou contra apartamento. Sou contra a palavra comunidade em folheto. A gente que mora aqui, que dança aqui, que deu o primeiro beijo atrás daquela caixa de som, a gente é a comunidade. Só não tem logo».`),
        next: 'a_back'
      },
      a_back: { text: t(`She breathes out through her nose, resets her face like a laptop. "Anyway."`, `Exhala por la nariz y se reinicia la cara como una computadora. «En fin».`, `Ela solta o ar pelo nariz e reinicia o rosto feito notebook. «Enfim».`), next: 'need' },
      need: {
        text: t(`"Two things, both free and both urgent. One: a petition to the owner, to sell to the neighbourhood association instead of the fund. I need three signatures from people who aren't me. Two: around half past three, a patrol will come to see why the street is vibrating. If the crowd is ready, it's a conversation. If it isn't, it's a very long Tuesday. Prepare any two of: rights cards, a safe power cut, a lookout, a calm assembly."`, `«Dos cosas, gratis y urgentes. Una: una petición al dueño para que venda a la asociación vecinal y no al fondo. Necesito tres firmas de gente que no sea yo. Dos: a eso de las tres y media pasará una patrulla a ver por qué vibra la calle. Si la multitud está lista, es una conversación. Si no, es un martes larguísimo. Prepara dos de estas: tarjetas de derechos, un corte de luz seguro, un vigía, una asamblea tranquila».`, `«Duas coisas, de graça e urgentes. Uma: um abaixo-assinado pro dono, pra vender pra associação de moradores e não pro fundo. Preciso de três assinaturas de gente que não seja eu. Duas: lá pelas três e meia vai passar uma viatura pra ver por que a rua tá vibrando. Se a multidão tá pronta, é uma conversa. Se não, é uma terça muito longa. Prepare duas dessas: cartões de direitos, um corte de luz seguro, um vigia, uma assembleia calma».`),
        choices: [
          K('yes', t(`"Give me the clipboard."`, `«Dame la tablilla».`, `«Me dá a prancheta».`), { do: { flag: ['petition_on', 'raid_on'], quest: { rv_petition: 'active', rv_raid: 'active' } }, next: 'go', react: t(`The clipboard is yours. It is surprisingly heavy for paper.`, `La tablilla es tuya. Pesa sorprendentemente para ser papel.`, `A prancheta é sua. Pesa surpreendentemente pra papel.`) }),
          K('chill', t(`"Let me look around first."`, `«Déjame mirar primero».`, `«Deixa eu dar uma olhada antes».`), { free: true, next: null })
        ]
      },
      go: { text: t(`"Bea is the legal observer, in the orange vest. Sub runs the power in the tunnel. Pip is on the sidewalk. And the committee... is in the courtyard. Be patient with the committee. They mean it. They mean it so much."`, `«Bea es la observadora legal, la del chaleco naranja. Sub maneja la luz en el túnel. Pip está en la banqueta. Y el comité… está en el patio. Ten paciencia con el comité. Lo dicen en serio. Lo dicen tan en serio».`, `«A Bea é a observadora jurídica, de colete laranja. A Sub cuida da energia no túnel. O Pip tá na calçada. E o comitê… tá no pátio. Tenha paciência com o comitê. Eles falam sério. Falam tão sério».`), next: null },
      again: {
        text: function (s) {
          return t(`Maya, between two phone calls: "Signatures: ${sigs(s)} of 3. Preparations: ${preps(s)} of 2. I'm fine. I'm fine in the way a bridge is fine."`, `Maya, entre dos llamadas: «Firmas: ${sigs(s)} de 3. Preparativos: ${preps(s)} de 2. Estoy bien. Estoy bien como un puente está bien».`, `Maya, entre duas ligações: «Assinaturas: ${sigs(s)} de 3. Preparativos: ${preps(s)} de 2. Tô bem. Tô bem do jeito que uma ponte tá bem».`);
        },
        choices: [
          K('yes', t(`Hand over the clipboard.`, `Entregar la tablilla.`, `Entregar a prancheta.`), { req: function (s) { return sigs(s) >= 3; }, do: { flag: 'petition_done', fun: 5, soc: 8, quest: { rv_petition: 'done' } }, next: 'thanks' }),
          K('ask', t(`"What was the plan again?"`, `«¿Cuál era el plan?»`, `«Qual era o plano mesmo?»`), { next: 'need' }),
          K('chill', t(`"Still working on it."`, `«Sigo en eso».`, `«Ainda tô nessa».`), { free: true, next: null })
        ]
      },
      thanks: {
        text: t(`Maya counts the signatures twice, then a third time out loud, like a rosary. "Five. You got five. A Berliner and a Brooklynite signed the same page. Historians will not believe it." She presses a cold bottle of water into your hand. "You can find me when the sun comes up. I'll be the one weeping into a spreadsheet."`, `Maya cuenta las firmas dos veces y una tercera en voz alta, como un rosario. «Cinco. Conseguiste cinco. Un berlinés y un brooklinés firmaron la misma hoja. Los historiadores no lo creerán». Te pone en la mano una botella de agua fría. «Búscame cuando salga el sol. Seré la que llora sobre una hoja de cálculo».`, `Maya conta as assinaturas duas vezes, e uma terceira em voz alta, feito terço. «Cinco. Você conseguiu cinco. Um berlinense e um brooklynense assinaram a mesma folha. Historiadores não vão acreditar». Ela enfia uma garrafa de água gelada na sua mão. «Me procura quando o sol nascer. Vou ser a que chora em cima de uma planilha».`),
        do: { flag: 'maya_thanked', item: { water: 1 }, fun: 3 }, next: null
      }
    }
  };

  /* ============================================================ BEA: rights cards */
  cast('bea', 'BEA', { skin: 1, hair: 5, hc: 8, expr: 1, top: 5, tc: 9, bottom: 1, bc: 3, acc: 2 });
  D.bea = {
    who: 'bea', role: t('LEGAL OBSERVER', 'OBSERVADORA LEGAL', 'OBSERVADORA JURÍDICA'), start: 'a', nodes: {
      a: {
        text: t(`Bea wears an orange vest that says LEGAL OBSERVER over a jacket that says nothing. She is handing out small laminated cards. "Three sentences. Memorise them: 'Am I free to go?' 'I do not consent to a search.' 'I would like to speak to a lawyer.' That's it. Say it kindly. Say it twice. Don't run, don't argue, don't be funny. Being funny is how it goes wrong."`, `Bea lleva un chaleco naranja que dice OBSERVADORA LEGAL sobre una chamarra que no dice nada. Reparte tarjetitas laminadas. «Tres frases. Memorízalas: “¿Soy libre de irme?”, “No consiento una revisión”, “Quiero hablar con un abogado”. Eso es todo. Dilas amable. Dilas dos veces. No corras, no discutas, no hagas chistes. Hacer chistes es como sale mal».`, `A Bea usa um colete laranja escrito OBSERVADORA JURÍDICA por cima de uma jaqueta que não diz nada. Ela distribui cartõezinhos plastificados. «Três frases. Decora: "Estou livre pra ir?", "Não autorizo revista", "Quero falar com um advogado". Só isso. Fala gentil. Fala duas vezes. Não corre, não discute, não faz piada. Fazer piada é como dá errado».`),
        do: { flag: 'bea_met' },
        choices: [
          K('yes', t(`Take a card. Read it twice.`, `Tomar una tarjeta. Leerla dos veces.`, `Pegar um cartão. Ler duas vezes.`), { req: function (s) { return !s.flags.raid_cards; }, do: { flag: 'raid_cards', soc: 2 }, next: 'card', free: true }),
          K('ask', t(`"Can you sign Maya's petition?"`, `«¿Firmas la petición de Maya?»`, `«Você assina o abaixo-assinado da Maya?»`), { req: function (s) { return s.flags.petition_on && !s.flags.sig_bea; }, next: 'sign' }),
          K('chill', t(`"Thanks, stay safe."`, `«Gracias, cuídate».`, `«Valeu, se cuida».`), { free: true, next: null })
        ]
      },
      card: { text: t(`You say the three sentences in a whisper. Bea corrects the second one's stress and nods. "Good. You sound like a person who has never lost an argument with a wall. Keep it that way."`, `Dices las tres frases en un susurro. Bea te corrige el acento de la segunda y asiente. «Bien. Suenas como alguien que jamás perdió una discusión con una pared. Que siga así».`, `Você diz as três frases num sussurro. A Bea corrige a ênfase da segunda e assente. «Boa. Você soa como quem nunca perdeu uma discussão com uma parede. Que continue assim».`), next: 'a' },
      sign: { text: t(`"Observers can't take sides on the night." She looks left, looks right, and signs at the very bottom in tiny handwriting. "I'm signing as a private citizen who happens to be standing here. If anyone asks, I was tying my shoe."`, `«Las observadoras no pueden tomar partido esa noche». Mira a la izquierda, mira a la derecha y firma hasta abajo con letra diminuta. «Firmo como ciudadana particular que casualmente está parada aquí. Si preguntan, me estaba amarrando el zapato».`, `«Observadora não pode tomar partido na noite». Ela olha pra esquerda, pra direita e assina lá embaixo com letra minúscula. «Assino como cidadã que por acaso tá parada aqui. Se perguntarem, eu tava amarrando o tênis».`), do: { flag: 'sig_bea', soc: 1 }, next: null }
    }
  };

  /* ============================================================ SUB: the power */
  cast('sub', 'SUB', { skin: 3, hair: 0, hc: 2, expr: 0, top: 7, tc: 11, bottom: 3, bc: 2, acc: 4 });
  D.sub = {
    who: 'sub', role: t('SOUND', 'SONIDO', 'SOM'), start: 'a', nodes: {
      a: {
        text: t(`Sub is lying under a speaker stack with a headlamp, holding two cables like a snake-charmer. "Don't step on the orange one. That's the main. If the patrol arrives, one pull and the whole building goes quiet in a way that looks like an accident. It doesn't look like a decision. Nobody gets a fine for an accident, they get a story."`, `Sub está en el piso, bajo una torre de bocinas con una linterna en la frente, sosteniendo dos cables como un encantador de serpientes. «No pises el naranja. Es el principal. Si llega la patrulla, un jalón y todo el edificio queda en silencio de forma que parece un accidente. No parece una decisión. Nadie recibe multa por un accidente, reciben una historia».`, `A Sub tá deitade debaixo de uma torre de caixas com uma lanterna na testa, segurando dois cabos feito encantador de serpentes. «Não pisa no laranja. Esse é o principal. Se a viatura chegar, um puxão e o prédio inteiro fica em silêncio de um jeito que parece acidente. Não parece decisão. Ninguém leva multa por acidente, leva uma história».`),
        do: { flag: 'sub_met' },
        choices: [
          K('yes', t(`"Show me the pull. I'll hold it."`, `«Muéstrame el jalón. Yo lo sostengo».`, `«Me mostra o puxão. Eu seguro».`), { req: function (s) { return !s.flags.raid_power; }, do: { flag: 'raid_power', time: 8, fun: -1 }, next: 'hold', free: true }),
          K('ask', t(`"Will you sign Maya's petition?"`, `«¿Firmas la petición de Maya?»`, `«Você assina o abaixo-assinado da Maya?»`), { req: function (s) { return s.flags.petition_on && !s.flags.sig_sub; }, next: 'sign' }),
          K('chill', t(`"I'll let you work."`, `«Te dejo trabajar».`, `«Vou deixar você trabalhar».`), { free: true, next: null })
        ]
      },
      hold: { text: t(`You hold the cable for eight minutes in the dark while Sub explains the difference between a ground loop and a feeling. You understand about half. When you let go, your hand remembers the shape.`, `Sostienes el cable ocho minutos en la oscuridad mientras Sub explica la diferencia entre un lazo de tierra y un sentimiento. Entiendes la mitad. Al soltarlo, tu mano recuerda la forma.`, `Você segura o cabo por oito minutos no escuro enquanto a Sub explica a diferença entre um loop de terra e um sentimento. Você entende metade. Quando solta, sua mão lembra o formato.`), next: 'a' },
      sign: { text: t(`"A petition. In a power room. With a pen that's oil-stained." Sub signs with a flourish and leaves a thumbprint. "Biometric. Can't be disputed."`, `«Una petición. En un cuarto eléctrico. Con una pluma manchada de aceite». Sub firma con un floreo y deja una huella. «Biométrico. No se puede disputar».`, `«Um abaixo-assinado. Numa sala de energia. Com uma caneta manchada de óleo». A Sub assina com um floreio e deixa uma digital. «Biométrico. Não dá pra contestar».`), do: { flag: 'sig_sub', soc: 1 }, next: null }
    }
  };

  /* ============================================================ PIP: the lookout */
  cast('pip', 'PIP', { skin: 0, hair: 6, hc: 10, expr: 3, top: 8, tc: 2, bottom: 1, bc: 0, acc: 0 });
  D.pip = {
    who: 'pip', role: t('LOOKOUT', 'VIGÍA', 'VIGIA'), start: 'a', nodes: {
      a: {
        text: t(`Pip sits on a bollard with a thermos and the posture of someone paid in zero euros. "I'm the lookout. If a van with the lights off turns into the street, I whistle. It's a very good whistle. It's the only one of my skills with a clear economic application."`, `Pip, sentade en un poste con un termo, tiene la postura de quien cobra cero pesos. «Soy el vigía. Si una camioneta con las luces apagadas entra a la calle, silbo. Es un muy buen silbido. Es mi única habilidad con una aplicación económica clara».`, `O Pip tá sentade num poste com uma garrafa térmica e a postura de quem recebe zero reais. «Eu sou o vigia. Se uma van com os faróis apagados entrar na rua, eu assobio. É um ótimo assobio. É a única habilidade minha com aplicação econômica clara».`),
        do: { flag: 'pip_met' },
        choices: [
          K('yes', t(`"I'll take the second whistle. Show me."`, `«Yo tomo el segundo silbido. Enséñame».`, `«Eu fico com o segundo assobio. Me ensina».`), { req: function (s) { return !s.flags.raid_look; }, do: { flag: 'raid_look', time: 6 }, next: 'whistle', free: true }),
          K('chill', t(`"Stay warm."`, `«Abrígate».`, `«Se agasalha».`), { free: true, next: null })
        ]
      },
      whistle: { text: t(`You whistle. A pigeon leaves. Pip claps once. "Now you're staff. Please never tell anyone I said that, it creates obligations."`, `Silbas. Una paloma se va. Pip aplaude una vez. «Ya eres staff. Por favor nunca digas que lo dije, crea obligaciones».`, `Você assobia. Um pombo vai embora. O Pip bate palma uma vez. «Agora você é staff. Por favor nunca diga que eu falei, cria obrigações».`), next: null }
    }
  };

  /* ============================================================ JUNIPER AND THE COMMITTEE (awareness team, lovingly) */
  cast('juniper', 'JUNIPER', { skin: 2, hair: 7, hc: 4, expr: 2, top: 2, tc: 6, bottom: 2, bc: 7, acc: 1 });
  D.juniper = {
    who: 'juniper', role: t('AWARENESS COMMITTEE', 'COMITÉ DE CONCIENCIA', 'COMITÊ DE CONSCIÊNCIA'), start: 'a', nodes: {
      a: {
        text: t(`Juniper and two friends hold a clipboard, a tote bag with a slogan, and the eyes of people who have read every thread. "Hi! We're the Awareness Committee. We're voluntarily checking that this space is safe for everyone. We have a subcommittee on the subcommittee. Quick question: are you aware of your relationship to the bass?"`, `Juniper y dos amigues tienen una tablilla, una tote bag con un lema y los ojos de gente que leyó todos los hilos. «¡Hola! Somos el Comité de Conciencia. Verificamos voluntariamente que este espacio sea seguro para todes. Tenemos un subcomité del subcomité. Pregunta rápida: ¿eres consciente de tu relación con el bajo?»`, `A Juniper e dois amigues têm uma prancheta, uma ecobag com um lema e os olhos de quem leu todas as threads. «Oi! Somos o Comitê de Consciência. Estamos verificando voluntariamente se esse espaço é seguro pra todes. A gente tem um subcomitê do subcomitê. Pergunta rápida: você tem consciência da sua relação com o grave?»`),
        do: { flag: 'juniper_met' },
        choices: [
          K('joke', t(`"My relationship to the bass is complicated."`, `«Mi relación con el bajo es complicada».`, `«Minha relação com o grave é complicada».`), { do: { fun: 2 }, next: 'bass' }),
          K('ask', t(`"What do you need from me?"`, `«¿Qué necesitan de mí?»`, `«O que vocês precisam de mim?»`), { next: 'terms' }),
          K('chill', t(`"I'll think about it. Seriously."`, `«Lo pensaré. En serio».`, `«Vou pensar. Sério».`), { free: true, next: null })
        ]
      },
      bass: { text: t(`Juniper writes it down. "That's a valid place to start. We're going to flag it for a facilitated debrief. The debrief will be in a circle. We'll hold space for the circle's feelings about being a circle."`, `Juniper lo anota. «Es un punto de partida válido. Lo marcaremos para una reunión de cierre facilitada. La reunión será en círculo. Sostendremos espacio para los sentimientos del círculo sobre ser un círculo».`, `A Juniper anota. «É um ponto de partida válido. Vamos marcar pra uma plenária facilitada. A plenária vai ser em círculo. A gente vai segurar espaço pros sentimentos do círculo sobre ser um círculo».`), next: 'terms' },
      terms: {
        text: t(`"Two things. We've drafted a statement against dancing in ways that might centre the wrong person. We also want to rename the dancefloor 'a sound-adjacent gathering surface'." They look at each other. "We know. We KNOW. Our own members find it a lot. Help us land it? We can sign your petition if the wording stops saying 'locals' and says 'neighbours of all lived experiences'."`, `«Dos cosas. Redactamos una declaración contra bailar de formas que puedan centrar a la persona equivocada. También queremos renombrar la pista como “superficie de reunión adyacente al sonido”». Se miran. «Sabemos. SABEMOS. Hasta nuestres miembres lo sienten mucho. ¿Nos ayudas a aterrizarlo? Podemos firmar tu petición si la redacción deja de decir “locales” y dice “vecines de todas las experiencias vividas”».`, `«Duas coisas. Redigimos uma declaração contra dançar de jeitos que possam centrar a pessoa errada. Também queremos renomear a pista pra "superfície de convívio adjacente ao som"». Eles se olham. «A gente sabe. A gente SABE. Até os membros do próprio comitê acham demais. Você ajuda a aterrissar? A gente assina o abaixo-assinado se a redação parar de dizer "moradores" e disser "vizinhes de todas as vivências"».`),
        choices: [
          K('yes', t(`"Fine. 'Neighbours' it is."`, `«Va. “Vecines”».`, `«Beleza. "Vizinhes"».`), { req: function (s) { return s.flags.petition_on && !s.flags.sig_juniper; }, do: { flag: 'sig_juniper', time: 10, soc: 3 }, next: 'signed' }),
          K('care', t(`"You could run a calm assembly. For the patrol."`, `«Podrían hacer una asamblea tranquila. Para la patrulla».`, `«Vocês podiam fazer uma assembleia calma. Pra viatura».`), { req: function (s) { return !s.flags.raid_comm; }, next: 'assembly' }),
          K('joke', t(`"The dancefloor is already a dancefloor."`, `«La pista ya es una pista».`, `«A pista já é uma pista».`), { do: { fun: 2, soc: -1 }, next: 'dance' }),
          K('chill', t(`"Let me come back with a draft."`, `«Vuelvo con un borrador».`, `«Volto com um rascunho».`), { free: true, next: null })
        ]
      },
      dance: { text: t(`Juniper stares at the dancefloor for a long, moving moment. "Okay. That's... a bit moving, actually. Put it in the notes."`, `Juniper mira la pista por un largo y conmovedor momento. «Ok. Eso es… un poco conmovedor, en realidad. Ponlo en las notas».`, `A Juniper encara a pista por um longo e comovente momento. «Tá. Isso é… meio comovente, na verdade. Põe nas notas».`), next: 'terms' },
      signed: { text: t(`Juniper signs in three colours of pen, each for a different relation to the text. "Beautiful. I'm going to cry in an organised way."`, `Juniper firma con tres colores de pluma, cada uno para una relación distinta con el texto. «Hermoso. Voy a llorar de forma organizada».`, `A Juniper assina com três cores de caneta, cada uma pra uma relação diferente com o texto. «Lindo. Vou chorar de um jeito organizado».`), next: 'terms' },
      assembly: { text: t(`Their faces light up. "A structure! For a crisis! We have been waiting our whole lives for a crisis with a structure." Within five minutes forty people sit in a circle on the courtyard floor, each holding an index card that says 'WE ARE CALM'. If the patrol comes, it will meet the most orderly circle in the history of the city.`, `Se les ilumina la cara. «¡Una estructura! ¡Para una crisis! Llevamos toda la vida esperando una crisis con estructura». En cinco minutos cuarenta personas se sientan en círculo en el piso del patio, cada una con una tarjeta que dice «ESTAMOS EN CALMA». Si llega la patrulla, se encontrará con el círculo más ordenado de la historia de la ciudad.`, `O rosto deles acende. «Uma estrutura! Pra uma crise! A gente esperou a vida inteira por uma crise com estrutura». Em cinco minutos quarenta pessoas sentam em círculo no chão do pátio, cada uma com uma ficha escrita 'ESTAMOS CALMES'. Se a viatura vier, vai encontrar o círculo mais organizado da história da cidade.`), do: { flag: 'raid_comm', soc: 4, fun: 2, time: 8 }, next: 'terms' }
    }
  };

  /* ============================================================ KLAUS (Berlin) */
  cast('klaus', 'KLAUS', { skin: 0, hair: 1, hc: 0, expr: 0, top: 3, tc: 0, bottom: 4, bc: 0, acc: 5, wide: false });
  D.klaus = {
    who: 'klaus', role: t('"FROM BERLIN"', '«DE BERLÍN»', '«DE BERLIM»'), start: 'a', nodes: {
      a: {
        text: t(`Klaus is dressed in black from head to a tote bag, at a standing angle usually reserved for fountains. "It's fine. It's fine for here. In Berlin the queue is the art and the dancefloor is a footnote. Last month I waited eleven hours to be told no by a man in a hat. Transformative. I cried in a nearby dumpster. Beautiful."`, `Klaus va de negro de la cabeza a una tote bag, en un ángulo reservado para fuentes. «Está bien. Está bien para aquí. En Berlín la fila es el arte y la pista es una nota al pie. El mes pasado esperé once horas para que me dijera que no un hombre con sombrero. Transformador. Lloré en un contenedor de basura cercano. Hermoso».`, `O Klaus tá de preto da cabeça a uma ecobag, num ângulo geralmente reservado a fontes. «Tá bom. Tá bom pra aqui. Em Berlim a fila é a arte e a pista é nota de rodapé. Mês passado esperei onze horas pra um homem de chapéu me dizer não. Transformador. Chorei numa caçamba por perto. Lindo».`),
        do: { flag: 'klaus_met' },
        choices: [
          K('ask', t(`"Is this techno?"`, `«¿Esto es techno?»`, `«Isso é techno?»`), { next: 'techno' }),
          K('joke', t(`"You could sign Maya's petition. For the footnote."`, `«Podrías firmar la petición de Maya. Por la nota al pie».`, `«Você podia assinar o abaixo-assinado da Maya. Pela nota de rodapé».`), { req: function (s) { return s.flags.petition_on && !s.flags.sig_klaus; }, next: 'sign' }),
          K('chill', t(`"Enjoy your footnote."`, `«Disfruta tu nota al pie».`, `«Curte sua nota de rodapé».`), { free: true, next: null })
        ]
      },
      techno: { text: t(`He closes his eyes like a sommelier. "It's a dancefloor with a podcast. In Berlin the BPM is a state secret. I've been to Berghain a hundred and seventeen times. I can't tell you what it's like because of the photo policy and my ego."`, `Cierra los ojos como un sommelier. «Es una pista con un pódcast. En Berlín el BPM es secreto de Estado. He ido a Berghain ciento diecisiete veces. No puedo decirte cómo es por la política de fotos y mi ego».`, `Ele fecha os olhos feito sommelier. «É uma pista com um podcast. Em Berlim o BPM é segredo de Estado. Já fui ao Berghain cento e dezessete vezes. Não posso te dizer como é por causa da política de fotos e do meu ego».`), do: { fun: 2 }, next: 'a' },
      sign: { text: t(`"A petition to keep a squat." He sighs. "I'll sign. This is exactly what Berlin was before it got a skyline and a tourism board. If it's lost, you will all have to spend your thirties pretending it was better." He signs with a very small initial, as if the full name costs money.`, `«Una petición para conservar una okupa». Suspira. «Firmo. Esto es exactamente lo que Berlín era antes de tener skyline y oficina de turismo. Si se pierde, todos tendrán que pasar sus treinta fingiendo que era mejor». Firma con una inicial muy pequeña, como si el nombre completo costara.`, `«Um abaixo-assinado pra manter uma ocupação». Ele suspira. «Assino. É exatamente o que Berlim era antes de ganhar skyline e secretaria de turismo. Se perder, vocês todos vão passar os trinta anos fingindo que era melhor». Assina com uma inicial bem pequena, como se o nome completo custasse.`), do: { flag: 'sig_klaus', soc: 1 }, next: null }
    }
  };

  /* ============================================================ MADISON (Brooklyn) */
  cast('madison', 'MADISON', { skin: 2, hair: 4, hc: 6, expr: 2, top: 6, tc: 8, bottom: 4, bc: 3, acc: 3 });
  D.madison = {
    who: 'madison', role: t('"BETWEEN LOFTS"', '«ENTRE LOFTS»', '«ENTRE LOFTS»'), start: 'a', nodes: {
      a: {
        text: t(`Madison has a vintage windbreaker and a camera that has not taken a photo since 2019. "I'm between Bushwick lofts. I only listen to music that doesn't exist yet. I'm DJing at four a.m. in a basement that is technically a laundromat. My last set was one continuous forty-minute silence. The reviews called it 'brave' and 'unavailable'."`, `Madison trae un rompevientos vintage y una cámara que no toma fotos desde 2019. «Estoy entre lofts de Bushwick. Solo escucho música que aún no existe. Pincharé a las cuatro de la mañana en un sótano que técnicamente es una lavandería. Mi último set fue un silencio continuo de cuarenta minutos. Las reseñas lo llamaron “valiente” e “inaccesible”».`, `A Madison usa um corta-vento vintage e uma câmera que não tira foto desde 2019. «Tô entre lofts de Bushwick. Só ouço música que ainda não existe. Vou tocar às quatro da manhã num porão que tecnicamente é uma lavanderia. Meu último set foi um silêncio contínuo de quarenta minutos. As resenhas chamaram de "corajoso" e "indisponível"».`),
        do: { flag: 'madison_met' },
        choices: [
          K('ask', t(`"What do you do all day?"`, `«¿A qué te dedicas todo el día?»`, `«O que você faz o dia todo?»`), { next: 'job' }),
          K('joke', t(`"Sign Maya's petition. It's pre-nostalgia."`, `«Firma la petición de Maya. Es pre-nostalgia».`, `«Assina o abaixo-assinado da Maya. É pré-nostalgia».`), { req: function (s) { return s.flags.petition_on && !s.flags.sig_madison; }, next: 'sign' }),
          K('chill', t(`"Good luck with the laundromat."`, `«Suerte con la lavandería».`, `«Boa sorte com a lavanderia».`), { free: true, next: null })
        ]
      },
      job: { text: t(`"I decolonised my playlist. It is now empty. I also run a tote bag that is a newsletter. And a newsletter that is a tote bag." She holds up a bag that says 'IT'S NOT A BAG IT'S A POSITION'. "My therapist says my aesthetics are a trauma response. I said: 'Thank you.' Then I put it on the bag."`, `«Descolonicé mi playlist. Ahora está vacía. También manejo una tote bag que es un boletín. Y un boletín que es una tote bag». Muestra una bolsa que dice «NO ES UNA BOLSA ES UNA POSTURA». «Mi terapeuta dice que mi estética es una respuesta al trauma. Le dije: “gracias”. Luego lo puse en la bolsa».`, `«Eu descolonizei minha playlist. Agora tá vazia. Também mantenho uma ecobag que é uma newsletter. E uma newsletter que é uma ecobag». Ela mostra uma sacola escrita 'NÃO É UMA SACOLA É UMA POSIÇÃO'. «Minha terapeuta diz que minha estética é uma resposta ao trauma. Eu disse: "Obrigada". Aí botei na sacola».`), do: { fun: 2 }, next: 'a' },
      sign: { text: t(`"Pre-nostalgia. That is a very good thing to say to me." She signs with a pen that clearly cost eleven dollars. "I'll sign. If this place becomes forty flats I'll write about it in a newsletter that nobody reads and everybody quotes. Can I say you inspired it?"`, `«Pre-nostalgia. Es algo muy bueno de decirme». Firma con una pluma que claramente costó once dólares. «Firmo. Si este lugar se vuelve cuarenta departamentos, escribiré sobre eso en un boletín que nadie lee y todo el mundo cita. ¿Puedo decir que me inspiraste?»`, `«Pré-nostalgia. Que coisa boa de me dizer». Ela assina com uma caneta que claramente custou onze dólares. «Eu assino. Se esse lugar virar quarenta apartamentos, vou escrever sobre isso numa newsletter que ninguém lê e todo mundo cita. Posso dizer que você me inspirou?»`), do: { flag: 'sig_madison', soc: 1 }, next: null }
    }
  };

  /* ============================================================ MORE DEALERS (they reuse Tico's menu) */
  const base = D.tico && D.tico.nodes;
  function dealer(id, name, role, look, intro, honest) {
    cast(id, name, look);
    D['dealer_' + id] = {
      who: id, role: role, start: 'a', nodes: {
        a: { text: intro, choices: base.a.choices },
        shape: base.shape, imprint: base.imprint,
        honest: { text: honest, do: { soc: 1, flag: 'tico_honest' }, next: 'a' }
      }
    };
  }
  dealer('mambo', 'MAMBO', t('IN THE COURTYARD', 'EN EL PATIO', 'NO PÁTIO'), { skin: 5, hair: 1, hc: 9, expr: 3, top: 9, tc: 4, bottom: 1, bc: 5, acc: 4 },
    t(`Mambo sits on an upturned crate with a cooler that says SOLIDARITY SALES. "Everything's worker-owned. The cooperative votes on the price every Thursday. Last Thursday we voted to give a discount to people who say 'excuse me'. So: be polite and I'm cheaper. It's a pilot programme."`, `Mambo está sentade en un cajón volteado con una hielera que dice VENTAS SOLIDARIAS. «Todo es de propiedad obrera. La cooperativa vota el precio cada jueves. El jueves pasado votamos descuento para quienes dicen “con permiso”. Así que: sé cortés y soy más barate. Es un programa piloto».`, `O Mambo tá sentade num caixote virado com um isopor escrito VENDAS SOLIDÁRIAS. «Tudo é de propriedade dos trabalhadores. A cooperativa vota o preço toda quinta. Na última quinta a gente votou desconto pra quem fala "com licença". Então: seja educade e eu fico mais baratinho. É programa piloto».`),
    t(`"You don't, which is why we pay Isi in snacks to check. Politics is deciding who gets to find out what's in the pill."`, `«No lo sabes, por eso le pagamos a Isi con botanas para que revise. La política es decidir quién puede averiguar qué trae la pastilla».`, `«Você não sabe, por isso a gente paga a Isi em lanche pra conferir. Política é decidir quem pode descobrir o que tem no comprimido».`));
  dealer('spoke', 'SPOKE', t('IN THE TUNNEL', 'EN EL TÚNEL', 'NO TÚNEL'), { skin: 1, hair: 3, hc: 7, expr: 2, top: 1, tc: 10, bottom: 2, bc: 2, acc: 2 },
    t(`Someone in a cycling cap leans on a wall that is also a mural. "Menu in three words. Pills, powder, K. I've got a bike, no phone, and opinions about the municipal bus. The fund wants to buy the warehouse? Cool. They can try to buy the tunnel too, it's not for sale, it's a tunnel."`, `Alguien con gorra de ciclista se apoya en una pared que también es un mural. «Menú en tres palabras. Pastillas, polvo, K. Tengo bici, no tengo celular y tengo opiniones sobre el camión municipal. ¿El fondo quiere comprar la bodega? Qué bien. Que intenten comprar el túnel también; no está en venta, es un túnel».`, `Alguém de boné de ciclista se apoia numa parede que também é mural. «Cardápio em três palavras. Comprimido, pó, K. Tenho bike, não tenho celular e tenho opinião sobre o ônibus municipal. O fundo quer comprar o galpão? Legal. Que tentem comprar o túnel também; não tá à venda, é um túnel».`),
    t(`"You just trust me. I know. Trust is the whole business and the whole problem. Go see Isi, she's got a table and a patience I don't."`, `«Solo confías en mí. Lo sé. La confianza es todo el negocio y todo el problema. Ve con Isi; tiene una mesa y una paciencia que yo no».`, `«Você só confia em mim. Eu sei. Confiança é o negócio inteiro e o problema inteiro. Vai na Isi, ela tem uma mesa e uma paciência que eu não tenho».`));
  dealer('pixi', 'PIXI', t('IN THE ATTIC', 'EN EL ÁTICO', 'NO SÓTÃO'), { skin: 3, hair: 6, hc: 3, expr: 1, top: 10, tc: 7, bottom: 3, bc: 6, acc: 1 },
    t(`Pixi has glitter in hair that is also a political statement. "Hi hi hi. I'm the harm-reduction-adjacent pharmacy of this floor. I won't tell you what to take; I'll tell you what you'd be taking if everyone told the truth, which is a hypothetical economy. Menu: shapes, powder, K. Hydrate."`, `Pixi trae diamantina en un pelo que también es declaración política. «Hola hola hola. Soy la farmacia aledaña a la reducción de daños de este piso. No te diré qué tomar; te diré qué tomarías si todos dijeran la verdad, que es una economía hipotética. Menú: formas, polvo, K. Hidrátate».`, `A Pixi tem glitter num cabelo que também é declaração política. «Oi oi oi. Eu sou a farmácia adjacente à redução de danos deste andar. Não vou te dizer o que tomar; vou te dizer o que você tomaria se todo mundo falasse a verdade, que é uma economia hipotética. Cardápio: formas, pó, K. Hidrata».`),
    t(`"Honestly? No. That's why this isn't a business, it's a hobby with risk. Visit Isi. Visit water. Visit a chair."`, `«¿Sinceramente? No. Por eso esto no es un negocio, es un hobby con riesgo. Visita a Isi. Visita el agua. Visita una silla».`, `«Sinceramente? Não. Por isso isso não é negócio, é hobby com risco. Visita a Isi. Visita a água. Visita uma cadeira».`));
  dealer('doc', 'DOC', t('ON THE MAIN FLOOR', 'EN LA PISTA', 'NA PISTA'), { skin: 4, hair: 2, hc: 5, expr: 0, top: 3, tc: 1, bottom: 1, bc: 3, acc: 5 },
    t(`A man with a satchel and the eyebrows of a retired professor leans in. "I sell certainty, and certainty is 15% organic. Pills, powder, K. I used to teach political economy. I now teach it in the original format: a person, a bag and a price."`, `Un hombre con maletín y las cejas de un profesor jubilado se inclina. «Vendo certeza, y la certeza es 15 % orgánica. Pastillas, polvo, K. Antes enseñaba economía política. Ahora la enseño en su formato original: una persona, una bolsa y un precio».`, `Um homem com uma pasta e as sobrancelhas de um professor aposentado se inclina. «Eu vendo certeza, e certeza é 15% orgânica. Comprimido, pó, K. Eu dava aula de economia política. Agora ensino no formato original: uma pessoa, uma sacola e um preço».`),
    t(`"You can't. That's called a market failure. Isi's table is a public good. Leave her a tip, she's subsidising your pupils."`, `«No puedes. Eso se llama falla de mercado. La mesa de Isi es un bien público. Déjale propina, subsidia tus pupilas».`, `«Não dá. Isso se chama falha de mercado. A mesa da Isi é bem público. Deixa gorjeta, ela tá subsidiando suas pupilas».`));

  /* ============================================================ PLACEMENT (rave only) */
  npc('courtyard', { id: 'maya', x: 22.5, y: 16.5, dlg: 'maya', when: RV });
  npc('main', { id: 'bea', x: 6.5, y: 20.5, dlg: 'bea', when: RV });
  npc('tunnel', { id: 'sub', x: 22.5, y: 5.5, dlg: 'sub', when: RV });
  npc('doors', { id: 'pip', x: 14.5, y: 9.5, dlg: 'pip', when: RV });
  npc('courtyard', { id: 'juniper', x: 30.5, y: 18.5, dlg: 'juniper', when: RV });
  npc('main', { id: 'klaus', x: 24.5, y: 6.5, dlg: 'klaus', when: RV });
  npc('attic', { id: 'madison', x: 26.5, y: 17.5, dlg: 'madison', when: RV });
  npc('courtyard', { id: 'mambo', x: 14.5, y: 20.5, dlg: 'dealer_mambo', when: RV });
  npc('tunnel', { id: 'spoke', x: 10.5, y: 5.5, dlg: 'dealer_spoke', when: RV });
  npc('attic', { id: 'pixi', x: 8.5, y: 14.5, dlg: 'dealer_pixi', when: RV });
  npc('main', { id: 'doc', x: 38.5, y: 26.5, dlg: 'dealer_doc', when: RV });

  /* ============================================================ THE RAID: 03:30 */
  EM.RAID_AT = 270;
  function raidDay() {
    const s = EM.state, n = preps(s);
    s.flags.raid_done = true; L.setQuest('rv_raid', 'done');
    if (n >= 2) {
      s.flags.raid_averted = true;
      if (n >= 3) s.flags.raid_triumph = true;
      L.apply({ fun: 10, soc: 6 });
      U.toast({ icon: 'star', kind: 'good', ms: 8000, text: t(`03:30. Headlights on the street. A patrol slows. Forty people sit in a circle holding cards that say WE ARE CALM. Somebody shows a laminated card. The music goes quiet by accident. Two officers look at the circle for a long time, ask who's in charge, and are told, kindly, that nobody is. They leave. The bass returns like a pulse.`, `03:30. Faros en la calle. Una patrulla frena. Cuarenta personas sentadas en círculo con tarjetas que dicen ESTAMOS EN CALMA. Alguien muestra una tarjeta laminada. La música se apaga por accidente. Dos oficiales miran el círculo mucho tiempo, preguntan quién manda y les dicen, con amabilidad, que nadie. Se van. El bajo vuelve como un pulso.`, `03:30. Faróis na rua. Uma viatura desacelera. Quarenta pessoas sentadas em círculo com fichas escritas ESTAMOS CALMES. Alguém mostra um cartão plastificado. A música cala por acidente. Dois policiais encaram o círculo por muito tempo, perguntam quem manda e ouvem, com gentileza, que ninguém. Vão embora. O grave volta feito pulso.`) });
    } else {
      s.flags.raid_hit = true;
      L.apply({ fun: -10, soc: -4, time: 20 });
      U.toast({ icon: 'anger', kind: 'bad', ms: 8000, text: t(`03:30. Headlights. The music dies in the middle of a bar and the crowd turns toward the door like a field of sunflowers. Nobody knows the three sentences. It takes twenty minutes of shouting, a lot of sorry, and someone's cousin who is a lawyer before the patrol leaves. The speakers come back on. The room is a different room.`, `03:30. Faros. La música muere a mitad de un compás y la multitud gira hacia la puerta como un campo de girasoles. Nadie sabe las tres frases. Hacen falta veinte minutos de gritos, muchos perdones y el primo abogado de alguien para que la patrulla se vaya. Vuelven las bocinas. El cuarto es otro cuarto.`, `03:30. Faróis. A música morre no meio de um compasso e a multidão vira pra porta feito campo de girassóis. Ninguém sabe as três frases. Leva vinte minutos de gritaria, muito desculpa e o primo advogado de alguém até a viatura ir embora. As caixas voltam. A sala é outra sala.`) });
    }
  }
  const minute1 = L.minute;
  L.minute = function () {
    minute1();
    const s = EM.state; if (!s || s.ended || s.venue !== 'rave') return;
    if (s.time >= EM.RAID_AT && !s.flags.raid_done) raidDay();
    /* friends who carry you after a pickpocketing */
    if (s.flags.friends_stick) {
      L.stat('fun', 0.12); L.stat('soc', 0.05);
      if (s.time >= (s.nextStick || 0)) {
        s.nextStick = s.time + 28 + Math.floor(Math.random() * 14);
        const B = [
          t(`Dani presses a cold bottle into your hand. "We're not leaving. Dance badly. We'll dance badly with you."`, `Dani te pone una botella fría en la mano. «No nos vamos. Baila mal. Bailamos mal contigo».`, `A Dani te põe uma garrafa gelada na mão. «A gente não vai embora. Dança mal. A gente dança mal com você».`),
          t(`Tato tells a joke so bad that three strangers feel sorry for both of you. It works. You laugh anyway.`, `Tato cuenta un chiste tan malo que tres desconocidos sienten pena por ambos. Funciona. Te ríes igual.`, `O Tato conta uma piada tão ruim que três desconhecidos sentem pena dos dois. Funciona. Você ri mesmo assim.`),
          t(`Maru takes your hands and spins you once, very slowly, like a music box. "Phone's gone. You aren't."`, `Maru te toma de las manos y te gira una vez, muy despacio, como una caja de música. «El celular se fue. Tú no».`, `A Maru pega suas mãos e gira você uma vez, bem devagar, feito caixinha de música. «O celular foi. Você não».`),
          t(`A circle of your friends forms around you on the dancefloor and does the stupidest dance they know. You have never been so thoroughly guarded by idiots.`, `Un círculo de tus amigos se forma a tu alrededor en la pista y bailan el baile más tonto que conocen. Nunca te habían cuidado tan bien unos tontos.`, `Uma roda de amigos se forma em volta de você na pista e dança a dança mais boba que conhece. Você nunca foi tão bem guardade por idiotas.`)
        ];
        U.toast({ icon: 'heart', kind: 'good', ms: 6000, text: B[Math.floor(Math.random() * B.length)] });
      }
    }
  };

  /* ============================================================ THE PICKPOCKET: 1 in 150 encounters */
  EM.PICK_ODDS = 150;
  const FRIENDS = ['dani', 'tato', 'maru'];
  D.pickpocket = {
    who: 'dani', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GENTE'), forced: true, start: 'a', nodes: {
      a: {
        text: [
          t(`You reach for your pocket and find the pocket. Only the pocket. A thin, clean absence where a phone and a little paper folded for later used to be. Somewhere behind you a hand has been through the crowd like a fish.`, `Buscas tu bolsillo y encuentras el bolsillo. Solo el bolsillo. Una ausencia limpia y delgada donde había un celular y un papelito doblado para después. En algún lugar atrás una mano atravesó la multitud como un pez.`, `Você procura o bolso e encontra só o bolso. Uma ausência fina e limpa onde havia um celular e um papelzinho dobrado pra depois. Em algum lugar atrás, uma mão atravessou a multidão feito peixe.`),
          t(`The night collapses for a second. Then Dani's arm is around your shoulder, Tato is holding your face in both hands like a melon, and Maru says, with enormous calm: "Okay. We're going to have the best second half of any night in the history of the city. That's the plan. It's the only plan."`, `La noche se desploma un segundo. Luego el brazo de Dani te rodea los hombros, Tato te sostiene la cara con las dos manos como un melón y Maru dice, con una calma enorme: «Bueno. Vamos a tener la mejor segunda mitad de cualquier noche en la historia de la ciudad. Ese es el plan. Es el único plan».`, `A noite desmorona por um segundo. Aí o braço da Dani tá nos seus ombros, o Tato segura seu rosto com as duas mãos feito melão e a Maru diz, com uma calma enorme: «Beleza. Vamos ter a melhor segunda metade de qualquer noite na história da cidade. Esse é o plano. É o único plano».`)
        ],
        choices: [
          K('yes', t(`"Okay. Okay. Stay with me."`, `«Bueno. Bueno. Quédense conmigo».`, `«Tá. Tá. Fiquem comigo».`), { do: { soc: 6 }, call: 'pp_apply', next: null }),
          K('honest', t(`"I just... need a minute."`, `«Solo… necesito un minuto».`, `«Eu só… preciso de um minuto».`), { do: { soc: 6 }, call: 'pp_apply', next: null })
        ]
      }
    }
  };
  S.pp_apply = function () {
    const s = EM.state;
    s.flags.pickpocketed = true; s.flags.friends_stick = true;
    s.stash = [];
    s.items.water = 0;
    L.stat('fun', -Math.max(0, s.stats.fun - 3), true);
    FRIENDS.forEach(function (f) { if (EM.CAST[f]) L.join(f); });
    s.nextStick = s.time + 10;
    U.toast({ icon: 'heart', kind: 'info', ms: 7000, text: t(`FUN is almost gone, and so are your phone, your water and your stash. Your friends are with you for the rest of the night and they are not leaving. Stay close.`, `La DIVERSIÓN casi se acabó, y también tu celular, tu agua y tu bolsa. Tus amigos están contigo el resto de la noche y no se van. Quédate cerca.`, `A DIVERSÃO quase acabou, e o celular, a água e sua reserva também. Seus amigos estão com você o resto da noite e não vão embora. Fique perto.`) });
  };
  /* friends cannot be lost or sent away after a pickpocket */
  const leave0 = L.leave;
  L.leave = function (id, zone) {
    const s = EM.state;
    if (s && s.flags.friends_stick && FRIENDS.indexOf(id) !== -1) return;
    leave0(id, zone);
  };
  /* ...and they make the rest of the night kinder */
  const mc0 = L.makeoutChance;
  L.makeoutChance = function (base) {
    const p = mc0(base), s = EM.state;
    return s && s.flags.friends_stick ? Math.min(0.95, p + 0.1) : p;
  };

  function maybePick() {
    const s = EM.state;
    if (!s || s.venue !== 'rave' || s.flags.pickpocketed || s.ended || s.attempt === undefined) return false;
    if (Math.random() >= 1 / EM.PICK_ODDS) return false;
    return true;
  }
  const sd0 = U.startDialogue;
  U.startDialogue = function (id, opts) {
    const def = EM.DIALOGUES[id];
    if (opts && opts.npc && def && !def.forced && id !== 'pickpocket' && maybePick()) {
      sd0('pickpocket', { npc: 'dani' });
      return;
    }
    sd0(id, opts);
  };
  const ex0 = EM.engine && EM.engine.excuse;
  if (EM.engine && ex0) {
    EM.engine.excuse = function () {
      const was = EM.engine.excuseCool > 0;
      ex0.apply(this, arguments);
      if (!was && maybePick()) U.startDialogue('pickpocket', { npc: 'dani' });
    };
  }

  /* ============================================================ MORNING */
  if (story.morningRefs) {
    const R = story.morningRefs;
    const on = function (f) { return function (s) { return s.venue === 'rave' && !!s.flags[f]; }; };
    R.push({ id: 'maya_won', who: '#MAYA', ok: function (s) { return s.venue === 'rave' && !!s.flags.petition_done && !!s.flags.raid_averted; }, t: t(`the owner called. he read the petition out loud to the developer's lawyer, including the part where a berliner and a brooklynite agreed. he is selling to the association. i'm shaking. you did this. bring your friends sunday, the sound system will be the thing we paid for with a lease.`, `llamó el dueño. leyó la petición en voz alta al abogado del desarrollador, incluida la parte en que un berlinés y un brooklinés estuvieron de acuerdo. vende a la asociación. estoy temblando. tú hiciste esto. trae a tus amigos el domingo, el sonido será lo que pagamos con un contrato.`, `o dono ligou. leu o abaixo-assinado em voz alta pro advogado da construtora, inclusive a parte em que um berlinense e um brooklynense concordaram. ele vende pra associação. tô tremendo. você fez isso. traz seus amigos domingo, o som vai ser o que a gente pagou com contrato.`) });
    R.push({ id: 'maya_half', who: '#MAYA', ok: function (s) { return s.venue === 'rave' && !!s.flags.maya_met && !(s.flags.petition_done && s.flags.raid_averted); }, t: t(`the warehouse is on a list. the list is a list of things that will exist for another month. thank you for the clipboard. come sunday and we'll dance in the half that's left.`, `la bodega está en una lista. la lista es de cosas que seguirán existiendo un mes más. gracias por la tablilla. ven el domingo y bailamos en la mitad que queda.`, `o galpão tá numa lista. a lista é de coisas que vão existir mais um mês. valeu pela prancheta. vem domingo e a gente dança na metade que sobrou.`) });
    R.push({ id: 'bea_card', who: '#BEA', ok: on('raid_cards'), t: t(`still saying the three sentences in my sleep. i also say them to my cat. she respects all of them. keep the card, it's laminated, it'll outlive us both.`, `sigo diciendo las tres frases dormida. también se las digo a mi gata. las respeta todas. quédate con la tarjeta, está laminada, nos sobrevivirá a ambas.`, `ainda digo as três frases dormindo. também digo pra minha gata. ela respeita todas. fica com o cartão, é plastificado, vai sobreviver a nós duas.`) });
    R.push({ id: 'klaus_txt', who: '#KLAUS', ok: on('klaus_met'), t: t(`I have thought about the warehouse. It was the best night I've had in three months and I hate that it happened outside Berlin. Please tell no one. Also, the queue was nice. There wasn't one.`, `He pensado en la bodega. Fue la mejor noche que he tenido en tres meses y odio que pasara fuera de Berlín. Por favor no se lo digas a nadie. Además, la fila estuvo bien. No había.`, `Pensei no galpão. Foi a melhor noite que tive em três meses e odeio que tenha acontecido fora de Berlim. Por favor não conte pra ninguém. Aliás, a fila foi legal. Não tinha.`) });
    R.push({ id: 'madison_txt', who: '#MADISON', ok: on('madison_met'), t: t(`my newsletter about last night has 11 subscribers and 40,000 quotes. i am between lofts and between selves. the silence set is booked again. dm me, it's a bit.`, `mi boletín sobre anoche tiene 11 suscriptores y 40,000 citas. estoy entre lofts y entre yoes. el set de silencio se volvió a agendar. mándame mensaje, es un chiste.`, `minha newsletter sobre ontem tem 11 assinantes e 40 mil citações. tô entre lofts e entre eus. o set de silêncio foi remarcado. me chama, é piada.`) });
    R.push({ id: 'juniper_txt', who: '#JUNIPER', ok: on('juniper_met'), t: t(`the committee has adopted 'dancefloor' as a working term pending review. we're calling it a win. a very small, procedural, deeply felt win.`, `el comité adoptó “pista” como término de trabajo en espera de revisión. lo llamamos victoria. una victoria muy pequeña, procedimental y profundamente sentida.`, `o comitê adotou "pista" como termo de trabalho pendente de revisão. a gente tá chamando de vitória. uma vitória bem pequena, procedimental e profundamente sentida.`) });
    R.push({ id: 'pick_friends', who: 'dani', ok: function (s) { return !!s.flags.pickpocketed; }, t: t(`we are not letting you out of our sight for a month. we have decided that last night was a heist and you were the loot. we will be insufferable about it. we're making breakfast.`, `no te dejaremos fuera de la vista un mes. decidimos que anoche fue un atraco y tú el botín. seremos insoportables con eso. hacemos el desayuno.`, `a gente não vai te deixar fora de vista por um mês. decidimos que ontem foi assalto e você foi o butim. vamos ser insuportáveis com isso. tamo fazendo café da manhã.`) });
  }
})();

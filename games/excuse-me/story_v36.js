/* EXCUSE ME — story v36: ÆRIEL, UP CLOSE. ÆRIEL is always at the after party (on the sofa, off duty). Four side quests, each unlocked by
   something you did in the flat, teach what ÆRIEL's project is about. The content is the artist's own booking page (aeriel.net/booking,
   the 2026 press kit in this repo): the Intent paragraph, the three cities, Æ000.X, and life away from the decks, plus the rider
   (no alcohol, volume, clipping and bass saturation, no VIP). Nothing here goes beyond that page except the small things ÆRIEL says in
   reply. ÆRIEL is written without pronouns, or they/them. Talk to ÆRIEL on the sofa and ask about the project. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, S = EM.scripts, D = EM.DIALOGUES, AF = EM.AF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`Leave it there.`, `Dejarlo ahí.`, `Deixar por aqui.`), { free: true, next: null }); };
  const Q = function (s, id) { return s.quests[id]; };
  const flagsAny = function (s, ks) { return ks.some(function (k) { return !!s.flags[k]; }); };
  const opened = function (s) { return Object.keys(s.flags).filter(function (k) { return /^g_.*_open$/.test(k); }).length; };

  /* ÆRIEL is always at the after: the seeded guest list always includes them */
  const b0 = S.af_begin;
  S.af_begin = function () {
    b0.apply(this, arguments);
    const a = EM.state && EM.state.after; if (!a || !a.cameos) return;
    if (a.cameos.indexOf('resident') === -1) { a.cameos.pop(); a.cameos.push('resident'); }
  };

  /* ---------------------------------------------------------------- the four quests */
  const mk = function (s, f) { return s.flags[f] ? '✓' : '·'; };
  EM.QUESTS.sq_ae1 = {
    title: t('ÆRIEL: THE SANCTUARY', 'ÆRIEL: EL SANTUARIO', 'ÆRIEL: O SANTUÁRIO'),
    desc: t(`ÆRIEL is on the sofa, off duty. Ask about the project. They will tell you what a dancefloor is for once you have looked after somebody in this flat.`, `ÆRIEL está en el sofá, fuera de turno. Pregunta por el proyecto. Te dirá para qué sirve una pista de baile cuando hayas cuidado a alguien en este departamento.`, `O ÆRIEL tá no sofá, fora de turno. Pergunte sobre o projeto. O ÆRIEL vai te dizer pra que serve uma pista quando você tiver cuidado de alguém nesse apê.`),
    doneText: t(`A dancefloor is a sanctuary because people look after each other. ÆRIEL says it plainly.`, `Una pista es un santuario porque la gente se cuida. ÆRIEL lo dice con sencillez.`, `Uma pista é um santuário porque as pessoas cuidam umas das outras. O ÆRIEL diz com simplicidade.`)
  };
  EM.QUESTS.sq_ae2 = {
    title: t('ÆRIEL: THREE CITIES', 'ÆRIEL: TRES CIUDADES', 'ÆRIEL: TRÊS CIDADES'),
    desc: function (s) { return t(`ÆRIEL lived in Paris and has spent long stretches in São Paulo and Buenos Aires. ${mk(s, 'ae_paris')} Paris. ${mk(s, 'ae_sp')} São Paulo. ${mk(s, 'ae_ba')} Buenos Aires. They will tell you each once you have heard what a few of the guests came to say.`, `ÆRIEL vivió en París y ha pasado largas temporadas en São Paulo y Buenos Aires. ${mk(s, 'ae_paris')} París. ${mk(s, 'ae_sp')} São Paulo. ${mk(s, 'ae_ba')} Buenos Aires. Te contará cada una cuando hayas escuchado lo que algunos invitados vinieron a decir.`, `O ÆRIEL morou em Paris e passou longas temporadas em São Paulo e Buenos Aires. ${mk(s, 'ae_paris')} Paris. ${mk(s, 'ae_sp')} São Paulo. ${mk(s, 'ae_ba')} Buenos Aires. O ÆRIEL vai contar cada uma quando você tiver ouvido o que alguns convidados vieram dizer.`); },
    doneText: t(`Paris was elegant, São Paulo was bombastic, Buenos Aires was irreverent. ÆRIEL carries all three.`, `París fue elegante, São Paulo fue explosivo, Buenos Aires fue irreverente. ÆRIEL carga las tres.`, `Paris foi elegante, São Paulo foi bombástico, Buenos Aires foi irreverente. O ÆRIEL carrega as três.`)
  };
  EM.QUESTS.sq_ae3 = {
    title: t('ÆRIEL: THE PARTY WITH THE DOOR', 'ÆRIEL: LA FIESTA CON PUERTA', 'ÆRIEL: A FESTA COM PORTA'),
    desc: t(`Æ000.X is an invitation-only party. ÆRIEL will say why, once the neighbours are settled and the flat is quiet.`, `Æ000.X es una fiesta solo con invitación. ÆRIEL dirá por qué, cuando los vecinos estén tranquilos y el departamento en silencio.`, `A Æ000.X é uma festa só com convite. O ÆRIEL vai dizer por quê, quando os vizinhos estiverem calmos e o apê em silêncio.`),
    doneText: t(`Principle, care and experimentation: ÆRIEL's answer to the gentrification and commodification of techno.`, `Principios, cuidado y experimentación: la respuesta de ÆRIEL a la gentrificación y mercantilización del techno.`, `Princípios, cuidado e experimentação: a resposta do ÆRIEL à gentrificação e mercantilização do techno.`)
  };
  EM.QUESTS.sq_ae4 = {
    title: t('ÆRIEL: AWAY FROM THE DECKS', 'ÆRIEL: FUERA DE LA CABINA', 'ÆRIEL: LONGE DA CABINE'),
    desc: t(`What does ÆRIEL do when they are not playing? Ask once your friends are looked after.`, `¿Qué hace ÆRIEL cuando no toca? Pregunta cuando tus amigos estén atendidos.`, `O que o ÆRIEL faz quando não toca? Pergunte quando seus amigos estiverem bem.`),
    doneText: t(`Essays, 35mm and Polaroid, a boring day job, and a rider that says look after the ears. That is the whole person.`, `Ensayos, 35 mm y Polaroid, un trabajo diurno aburrido, y un rider que pide cuidar los oídos. Esa es toda la persona.`, `Ensaios, 35 mm e Polaroid, um trabalho diurno chato, e um rider que pede cuidar dos ouvidos. Essa é a pessoa inteira.`)
  };

  /* ---------------------------------------------------------------- the conversation, on the sofa */
  const gate1 = function (s) { return flagsAny(s, ['sam_ok', 'rey_ok', 'vik_ok', 'lio_ok', 'lio_called', 'brought_food', 'af_clean', 'af_trash', 'tato_blanket']); };
  const gate2 = function (s) { return opened(s) >= 2; };
  const gate3 = function (s) { return Q(s, 'q_af6') === 'done' || !!s.flags.quiroga_warned; };
  const gate4 = function (s) { return Q(s, 'q_af7') === 'done'; };

  const N = {
    ae_st: { branch: [
      { req: function (s) { return Q(s, 'sq_ae4') === 'done'; }, to: 'ae_fin' },
      { req: function (s) { return Q(s, 'sq_ae4') === 'active'; }, to: 'ae4g' },
      { req: function (s) { return Q(s, 'sq_ae3') === 'active'; }, to: 'ae3g' },
      { req: function (s) { return Q(s, 'sq_ae2') === 'active'; }, to: 'ae2g' },
      { req: function () { return true; }, to: 'ae1g' }
    ] },
    ae_fin: { text: t(`ÆRIEL nods at the thermos. "You asked all the questions that matter. The rest is a rider and a day job." A tired smile. "Come to an Æ000.X. Fill in the form. I read it with feelings."`, `ÆRIEL asiente al termo. «Hiciste todas las preguntas que importan. Lo demás es un rider y un trabajo diurno». Una sonrisa cansada. «Ven a un Æ000.X. Llena el formulario. Lo leo con sentimientos».`, `O ÆRIEL assente pra garrafa. «Você fez todas as perguntas que importam. O resto é um rider e um trabalho diurno». Um sorriso cansado. «Vem num Æ000.X. Preenche o formulário. Eu leio com sentimentos».`), next: null },

    /* 1. THE SANCTUARY: the Intent paragraph */
    ae1g: { branch: [{ req: gate1, to: 'ae1' }, { req: function () { return true; }, to: 'ae1w' }] },
    ae1w: { text: t(`ÆRIEL looks at you for a while. "Ask me when you've looked after somebody in here. Everything I'd say about a dancefloor is easier once you've done it."`, `ÆRIEL te mira un rato. «Pregúntame cuando hayas cuidado a alguien aquí. Todo lo que diría sobre una pista es más fácil cuando ya lo hiciste».`, `O ÆRIEL te olha por um tempo. «Pergunta de novo quando você tiver cuidado de alguém aqui. Tudo o que eu diria sobre uma pista é mais fácil depois que você fez».`), do: { quest: { sq_ae1: 'active' } }, once: true, next: null },
    ae1: {
      text: t(`"A dancefloor is an ephemeral sanctuary built on sweat, friction and desire." ÆRIEL turns the thermos once in their hands. "On it, individual sovereignty and collective freedom can coexist, and safer spaces can be built and kept. It's somewhere to reclaim, even briefly, your body and your desire."`, `«Una pista de baile es un santuario efímero hecho de sudor, fricción y deseo». ÆRIEL gira una vez el termo entre las manos. «En ella pueden coexistir la soberanía individual y la libertad colectiva, y es posible construir y sostener espacios más seguros. Es un lugar para recuperar, aunque sea un momento, tu cuerpo y tu deseo».`, `«Uma pista é um santuário efêmero feito de suor, fricção e desejo». O ÆRIEL gira a garrafa uma vez nas mãos. «Nela podem coexistir a soberania individual e a liberdade coletiva, e dá pra construir e manter espaços mais seguros. É um lugar pra recuperar, mesmo que por um momento, seu corpo e seu desejo».`),
      choices: [
        K('ask', t(`"You reject joy as resistance. Why?"`, `«Rechazas el goce como resistencia. ¿Por qué?»`, `«Você rejeita a alegria como resistência. Por quê?»`), { next: 'ae1b' }),
        K('care', t(`"That's what the flat did tonight."`, `«Eso hizo el departamento esta noche».`, `«Foi o que o apê fez hoje».`), { next: 'ae1c' })
      ]
    },
    ae1b: { text: t(`"Because it asks pleasure to justify itself. A floor doesn't need to win anything to matter." They look at the room: a sleeper, a kettle, a stranger drying a mug. "But dancefloors have shown that other ways of organising and living together are possible. As a DJ, I'm honoured to help build them and look after them."`, `«Porque le pide al placer que se justifique. Una pista no necesita ganar nada para importar». Miran la sala: un durmiente, una tetera, un desconocido secando una taza. «Pero las pistas de baile han demostrado que existen otras formas de organizarnos y convivir. Como DJ, me honra ayudar a construirlas y cuidarlas».`, `«Porque pede pro prazer se justificar. Uma pista não precisa ganhar nada pra importar». O ÆRIEL olha a sala: alguém dormindo, uma chaleira, um desconhecido secando uma caneca. «Mas as pistas mostraram que existem outras formas de organizar e conviver. Como DJ, é uma honra ajudar a construí-las e cuidar delas».`), next: 'ae1d' },
    ae1c: { text: t(`ÆRIEL lets that sit. "Yes. Nobody here needed to be rescued. They needed a floor, a kettle and a door that stays shut." A small, private nod. "I'm honoured to help build those, and to look after them."`, `ÆRIEL deja que eso se asiente. «Sí. Nadie aquí necesitaba ser rescatado. Necesitaban un piso, una tetera y una puerta que se mantiene cerrada». Un asentimiento pequeño y privado. «Me honra ayudar a construirlos y cuidarlos».`, `O ÆRIEL deixa isso assentar. «É. Ninguém aqui precisava ser resgatado. Precisavam de um chão, uma chaleira e uma porta que fica fechada». Um aceno pequeno e privado. «É uma honra ajudar a construir isso e cuidar».`), next: 'ae1d' },
    ae1d: { text: t(`"One more thing before you sit." They pass you the thermos. It is tea. "I don't drink alcohol. It's in my rider, along with a request that nobody touches the equipment. A floor needs rules that protect the people on it."`, `«Una cosa más antes de que te sientes». Te pasan el termo. Es té. «No tomo alcohol. Está en mi rider, junto con la petición de que nadie toque el equipo. Una pista necesita reglas que protejan a la gente que está en ella».`, `«Mais uma coisa antes de você sentar». O ÆRIEL te passa a garrafa. É chá. «Eu não bebo álcool. Tá no meu rider, junto com o pedido de que ninguém encoste no equipamento. Uma pista precisa de regras que protejam as pessoas nela».`), once: true, do: { soc: 4, care: 1, flag: 'ae_sanct', quest: { sq_ae1: 'done', sq_ae2: 'active' } }, next: null },

    /* 2. THREE CITIES: the bio */
    ae2g: { branch: [{ req: gate2, to: 'ae2' }, { req: function () { return true; }, to: 'ae2w' }] },
    ae2w: { text: t(`"Cities are long answers," ÆRIEL says. "Go and listen to a couple of the guests first. Then ask me about where I've lived."`, `«Las ciudades son respuestas largas», dice ÆRIEL. «Ve a escuchar primero a un par de invitados. Luego pregúntame dónde he vivido».`, `«Cidades são respostas longas», diz o ÆRIEL. «Vai ouvir um par de convidados primeiro. Depois me pergunta onde eu morei».`), next: null },
    ae2: { text: function (s) {
      const n = ['ae_paris', 'ae_sp', 'ae_ba'].filter(function (k) { return s.flags[k]; }).length;
      return n >= 3 ? t(`"That's all three. They're in every set I play, wherever I play it."`, `«Esas son las tres. Están en cada set que toco, donde sea».`, `«São as três. Estão em todo set que eu toco, onde for».`) : t(`"I lived in Paris. I've spent long stretches in São Paulo and Buenos Aires, where friends, lovers and family keep pulling me back. Each city shaped how I do the night. Which one first?"`, `«Viví en París. He pasado largas temporadas en São Paulo y Buenos Aires, donde amistades, amantes y familia siguen haciéndome volver. Cada ciudad marcó cómo hago la noche. ¿Cuál primero?»`, `«Morei em Paris. Passei longas temporadas em São Paulo e Buenos Aires, onde amigos, amantes e família continuam me puxando de volta. Cada cidade moldou como eu faço a noite. Qual primeiro?»`);
    }, choices: [
      K('ask', t(`Paris.`, `París.`, `Paris.`), { req: function (s) { return !s.flags.ae_paris; }, next: 'ae_p' }),
      K('ask', t(`São Paulo.`, `São Paulo.`, `São Paulo.`), { req: function (s) { return !s.flags.ae_sp; }, next: 'ae_s' }),
      K('ask', t(`Buenos Aires.`, `Buenos Aires.`, `Buenos Aires.`), { req: function (s) { return !s.flags.ae_ba; }, next: 'ae_b' }),
      K('care', t(`"That's all three."`, `«Son las tres».`, `«São as três».`), { req: function (s) { return !!(s.flags.ae_paris && s.flags.ae_sp && s.flags.ae_ba); }, next: 'ae2d' }),
      LEAVE()
    ] },
    ae_p: { text: t(`"Paris showed me that counterculture can be elegant. And that spontaneity and real creation are worth chasing, even when it's inconvenient."`, `«París me enseñó que la contracultura puede ser elegante. Y que vale la pena perseguir la espontaneidad y la creación genuina, aunque sea incómodo».`, `«Paris me mostrou que a contracultura pode ser elegante. E que vale a pena perseguir a espontaneidade e a criação genuína, mesmo quando é inconveniente».`), once: true, do: { soc: 2, flag: 'ae_paris' }, next: 'ae2' },
    ae_s: { text: t(`"São Paulo's vast queer underground proved that artistic excellence, eroticism and political conviction can share a dancefloor. The nights are bombastic. I mean that as the highest praise."`, `«El vasto underground queer de São Paulo demostró que la excelencia artística, el erotismo y la convicción política pueden compartir la pista. Las noches son explosivas. Lo digo como el mayor elogio».`, `«O vasto underground queer de São Paulo provou que excelência artística, erotismo e convicção política podem dividir uma pista. As noites são bombásticas. Digo isso como o maior elogio».`), once: true, do: { soc: 2, flag: 'ae_sp' }, next: 'ae2' },
    ae_b: { text: t(`"Buenos Aires added irreverence: a punk, bohemian hunger for breaking with whatever has become the norm." A small smile. "It keeps me honest. Anything that's become the norm gets looked at twice."`, `«Buenos Aires sumó irreverencia: un hambre punk y bohemia de romper con lo que se ha convertido en norma». Una sonrisa pequeña. «Me mantiene honesto. Todo lo que se vuelve norma se mira dos veces».`, `«Buenos Aires acrescentou irreverência: uma fome punk e boêmia de romper com o que virou norma». Um sorriso pequeno. «Isso me mantém honesto. Tudo que vira norma é olhado duas vezes».`), once: true, do: { soc: 2, flag: 'ae_ba' }, next: 'ae2' },
    ae2d: { text: t(`"I bring all three back to Santiago, and wherever I go." They hold the thermos out for you to pour some. "You listened. That's the most Paris thing anyone's done tonight."`, `«Traigo las tres de vuelta a Santiago, y adonde voy». Estiran el termo para que te sirvas. «Escuchaste. Es lo más parisino que alguien ha hecho esta noche».`, `«Trago as três de volta pra Santiago, e aonde eu for». O ÆRIEL estende a garrafa pra você se servir. «Você ouviu. É a coisa mais parisiense que alguém fez hoje à noite».`), once: true, do: { soc: 4, fun: 2, flag: 'ae_cities', quest: { sq_ae2: 'done', sq_ae3: 'active' } }, next: null },

    /* 3. THE PARTY WITH THE DOOR: Æ000.X */
    ae3g: { branch: [{ req: gate3, to: 'ae3' }, { req: function () { return true; }, to: 'ae3w' }] },
    ae3w: { text: t(`ÆRIEL tilts their head toward the stairs. "The building isn't quiet yet. Ask me about the party when the neighbours have been dealt with. It's a good conversation to have with a closed door."`, `ÆRIEL inclina la cabeza hacia la escalera. «El edificio todavía no está tranquilo. Pregúntame por la fiesta cuando hayan resuelto lo de los vecinos. Es una buena conversación para tener con la puerta cerrada».`, `O ÆRIEL inclina a cabeça na direção da escada. «O prédio ainda não tá calmo. Me pergunta da festa quando os vizinhos tiverem sido resolvidos. É uma boa conversa pra ter de porta fechada».`), next: null },
    ae3: {
      text: t(`"In April 2026 I founded Æ000.X: an invitation-only party in Santiago. I'm its conceptual lead." ÆRIEL says it flatly, then lets it warm. "It builds an intentional community around music, counterculture and desire."`, `«En abril de 2026 fundé Æ000.X: una fiesta en Santiago solo con invitación. Soy su líder conceptual». ÆRIEL lo dice sin adornos, luego deja que se entibie. «Construye una comunidad intencional en torno a la música, la contracultura y el deseo».`, `«Em abril de 2026 eu fundei a Æ000.X: uma festa em Santiago só com convite. Sou o líder conceitual». O ÆRIEL diz sem enfeite, depois deixa esquentar. «Constrói uma comunidade intencional em torno da música, da contracultura e do desejo».`),
      choices: [
        K('ask', t(`"Why a door at all?"`, `«¿Por qué una puerta?»`, `«Por que uma porta?»`), { next: 'ae3b' }),
        K('honest', t(`"Tonight a landlord stood at a door like that."`, `«Esta noche un dueño estuvo en una puerta así».`, `«Hoje um dono ficou numa porta assim».`), { next: 'ae3c' })
      ]
    },
    ae3b: { text: t(`"It's a direct response to the gentrification and commodification of techno. The door is how we say it isn't for sale." A pause. "It runs on principle, care and experimentation. Each edition is curated as a whole, from the guest list to the music. That's why I read the forms."`, `«Es una respuesta directa a la gentrificación y la mercantilización del techno. La puerta es cómo decimos que no está en venta». Una pausa. «Se sostiene sobre principios, cuidado y experimentación. Cada edición se cura como un todo, desde la lista de invitadxs hasta la música. Por eso leo los formularios».`, `«É uma resposta direta à gentrificação e à mercantilização do techno. A porta é como a gente diz que não tá à venda». Uma pausa. «Funciona com princípio, cuidado e experimentação. Cada edição é curada como um todo, da lista de convidados até a música. Por isso eu leio os formulários».`), next: 'ae3d' },
    ae3c: { text: t(`"Then you saw the other kind of door." ÆRIEL's face does not move. "A rent, an owner, a complaint. Æ000.X is a response to a city that sells and prices everything. We try to answer with care, on purpose, from the guest list to the music."`, `«Entonces viste el otro tipo de puerta». La cara de ÆRIEL no se mueve. «Un alquiler, un dueño, una queja. Æ000.X es una respuesta a una ciudad que lo vende y lo tasa todo. Intentamos responder con cuidado, a propósito, desde la lista de invitadxs hasta la música».`, `«Então você viu o outro tipo de porta». O rosto do ÆRIEL não se mexe. «Um aluguel, um dono, uma reclamação. A Æ000.X é uma resposta a uma cidade que vende e põe preço em tudo. A gente tenta responder com cuidado, de propósito, da lista de convidados até a música».`), next: 'ae3d' },
    ae3d: { text: t(`"The party is the clearest picture of how I think a night should be held." They look at you. "Held. Not run. If you ever fill in a form and hate every word of it, you'll have understood the point."`, `«La fiesta es la imagen más clara de cómo creo que debe sostenerse una noche». Te miran. «Sostenerse. No administrarse. Si alguna vez llenas un formulario y odias cada palabra, habrás entendido el punto».`, `«A festa é a imagem mais clara de como eu acho que uma noite deve ser sustentada». O ÆRIEL te olha. «Sustentada. Não gerida. Se um dia você preencher um formulário e odiar cada palavra, vai ter entendido o ponto».`), once: true, do: { soc: 4, care: 1, flag: 'ae_party', quest: { sq_ae3: 'done', sq_ae4: 'active' } }, next: null },

    /* 4. AWAY FROM THE DECKS: the bio's last lines and the rider */
    ae4g: { branch: [{ req: gate4, to: 'ae4' }, { req: function () { return true; }, to: 'ae4w' }] },
    ae4w: { text: t(`"Ask me when your people are sorted," ÆRIEL says. "This one's the quiet part. I like to tell it to someone who isn't carrying anybody."`, `«Pregúntame cuando tu gente esté resuelta», dice ÆRIEL. «Esta es la parte tranquila. Me gusta contarla a alguien que no está cargando a nadie».`, `«Pergunta quando sua galera tiver resolvida», diz o ÆRIEL. «Essa é a parte calma. Gosto de contar pra alguém que não tá carregando ninguém».`), next: null },
    ae4: {
      text: t(`"Away from the decks I write essays, and I photograph nightlife on 35mm and Polaroid." A dry little pause. "And I have a boring day job. Very boring. I'd tell you what it is but you'd be asleep before the noun."`, `«Fuera de la cabina escribo ensayos y fotografío la noche en película de 35 mm y Polaroid». Una pausa seca y breve. «Y tengo un trabajo diurno aburrido. Muy aburrido. Te diría cuál es, pero te dormirías antes del sustantivo».`, `«Longe da cabine eu escrevo ensaios e fotografo a noite em filme 35 mm e Polaroid». Uma pausa seca e breve. «E tenho um trabalho diurno chato. Muito chato. Eu te diria qual é, mas você dormia antes do substantivo».`),
      choices: [
        K('ask', t(`"Photographs? On a night with no photos?"`, `«¿Fotos? ¿En una noche sin fotos?»`, `«Fotos? Numa noite sem fotos?»`), { next: 'ae4b' }),
        K('ask', t(`"What's in the rider?"`, `«¿Qué hay en el rider?»`, `«O que tem no rider?»`), { next: 'ae4c' })
      ]
    },
    ae4b: { text: t(`"Film is slow. It makes you look before you press, and it can't be posted from the floor. The parties I run have no photographs, and I keep that rule for everyone, me included. If a VIP area exists at all, my rider asks for zero contact and no photographs with the people around me."`, `«La película es lenta. Te hace mirar antes de apretar, y no se puede publicar desde la pista. Las fiestas que hago no tienen fotos, y cumplo esa regla para todos, yo incluido. Si existe un área VIP, mi rider pide cero contacto y ninguna foto con la gente de alrededor».`, `«Filme é lento. Faz você olhar antes de apertar, e não dá pra postar da pista. As festas que eu faço não têm foto, e eu cumpro essa regra pra todo mundo, eu incluído. Se existe uma área VIP, meu rider pede zero contato e nenhuma foto com as pessoas em volta».`), next: 'ae4d' },
    ae4c: { text: t(`"A sound check, so the bass doesn't clip and nobody's ears are hurt. No VIP areas: if people dance behind the decks, access is equal and nobody touches the equipment. And I don't drink alcohol." They lift the thermos. "Tea. Sugar-free. Every time."`, `«Una prueba de sonido, para que el bajo no sature y a nadie le duelan los oídos. Sin áreas VIP: si hay gente bailando detrás de la cabina, el acceso es igual para todos y nadie toca el equipo. Y no tomo alcohol». Levantan el termo. «Té. Sin azúcar. Siempre».`, `«Uma passagem de som, pra o grave não saturar e ninguém machucar os ouvidos. Sem área VIP: se tem gente dançando atrás da cabine, o acesso é igual pra todos e ninguém encosta no equipamento. E eu não bebo álcool». O ÆRIEL levanta a garrafa. «Chá. Sem açúcar. Sempre».`), next: 'ae4d' },
    ae4d: { text: t(`ÆRIEL screws the cap back on. "That's the project. Not a brand, not a lifestyle: a way of holding people for a few hours, and what comes with it." A pause. "Languages: Spanish, English, Portuguese, French. I'll say good morning in any of them."`, `ÆRIEL vuelve a poner la tapa. «Ese es el proyecto. No una marca, no un estilo de vida: una forma de sostener a la gente por unas horas, y lo que viene con eso». Una pausa. «Idiomas: español, inglés, portugués, francés. Te doy los buenos días en cualquiera».`, `O ÆRIEL recoloca a tampa. «Esse é o projeto. Não uma marca, não um estilo de vida: um jeito de sustentar as pessoas por algumas horas, e o que vem com isso». Uma pausa. «Idiomas: espanhol, inglês, português, francês. Te dou bom dia em qualquer um».`), once: true, do: { soc: 5, care: 1, flag: 'ae_known', quest: { sq_ae4: 'done' } }, next: null }
  };

  const R = D.af_cam_resident;
  if (R) {
    Object.keys(N).forEach(function (k) { R.nodes[k] = N[k]; });
    const a = R.nodes.a;
    if (Array.isArray(a.choices)) {
      const c = K('ask', t(`Ask about the project.`, `Preguntar por el proyecto.`, `Perguntar do projeto.`), { next: 'ae_st', __ae: true, do: { time: 4 } });
      a.choices.splice(Math.max(0, a.choices.length - 1), 0, c);
    }
  }

  /* ÆRIEL's Tuesday text once the project is known */
  const m0 = EM.story.morning;
  EM.story.morning = function (s) {
    const msgs = m0(s);
    if (s.ended === 'after' && s.flags.ae_known && Array.isArray(msgs)) {
      msgs.push({ who: 'resident', name: null, time: 'TUE 20:15', t: t(`ÆRIEL: you asked all the questions. nobody does. there's a form at aeriel.net/booking for the rest. i read every one. at three a.m. with feelings. sleep.`, `ÆRIEL: hiciste todas las preguntas. nadie lo hace. el resto está en aeriel.net/booking. leo cada formulario. a las tres de la mañana, con sentimientos. duerme.`, `ÆRIEL: você fez todas as perguntas. ninguém faz. o resto tá em aeriel.net/booking. eu leio cada formulário. às três da manhã, com sentimentos. dorme.`) });
    }
    return msgs;
  };
})();

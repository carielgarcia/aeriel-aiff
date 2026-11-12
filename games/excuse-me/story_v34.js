/* EXCUSE ME — story v34: the club for adults. The club's hooks are comic and stay comic; what this file adds is the second half of
   a conversation. EM.DEEP(id, ...) adds one choice to a character's opening node that leads to a turn and a close (the close sets
   g_<id>_open, pays once, and is remembered). EM.VARY gives the 70 identical exits ("Later.", "I'll let you get back to it.") a
   spread of natural ones. The friends' song scenes (need_tell_*) gain the conversation they were always hinting at; the after party
   picks up where those leave off (Maru's offer, Benjamin's March, Fernando's body). No new progression: stats, bonds and the
   existing missions are untouched. Swearing is allowed; similes and stingers stay inside the lint budgets. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, D = EM.DIALOGUES;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const en = function (x) { return x && (x.en || (typeof x === 'string' ? x : '')); };

  /* ---------------------------------------------------------------- helpers */
  /* DEEP: add one choice to the opening node and the nodes it leads to. spec = { label, tone, nodes } */
  EM.DEEP = function (id, spec) {
    const d = D[id]; if (!d) { console.warn('DEEP: no dialogue ' + id); return; }
    const from = spec.from || d.start;
    const a = d.nodes[from];
    if (!a || !Array.isArray(a.choices)) { console.warn('DEEP: ' + id + '.' + from + ' has no choice list'); return; }
    if (a.choices.some(function (c) { return c.__deep; })) return;
    const c = K(spec.tone || 'ask', spec.label, { next: spec.first || 'd1', do: { time: spec.time || 6, soc: 1 }, __deep: true });
    a.choices.unshift(c);
    Object.keys(spec.nodes).forEach(function (k) { d.nodes[k] = spec.nodes[k]; });
  };
  /* the close of a conversation: pays once, sets g_<id>_open */
  const close = function (id, tx, o) {
    return { text: tx, once: true, do: Object.assign({ soc: 3, care: 1, flag: ['g_' + id + '_open'] }, o || {}), next: null };
  };

  /* VARY: a spread of exits in place of the identical ones. Chosen by the dialogue id, so a given character always says the same one. */
  const EXITS = [
    t(`"Catch you later."`, `«Nos vemos más tarde».`, `«A gente se vê depois».`),
    t(`"Go on, don't let me hold you up."`, `«Sigue, no te quito más tiempo».`, `«Segue, não vou te atrasar».`),
    t(`"Enjoy it. I'll find you later."`, `«Disfrútalo. Te busco después».`, `«Curte. Te procuro depois».`),
    t(`"Good luck with it."`, `«Suerte con eso».`, `«Boa sorte com isso».`),
    t(`"Look after yourself tonight."`, `«Cuídate esta noche».`, `«Se cuida hoje à noite».`),
    t(`"I'll leave you to it."`, `«Te dejo con eso».`, `«Te deixo com isso».`),
    t(`"Nice meeting you. Have a good one."`, `«Gusto en conocerte. Que te vaya bien».`, `«Prazer. Bom resto de noite».`),
    t(`"Stay as you are."`, `«Sigue así».`, `«Continua assim».`)
  ];
  const STALE = ['"Later."', '"I\'ll let you get back to it."', '"I\'ll let you be."'];
  const hash = function (s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  EM.VARY = function () {
    Object.keys(D).forEach(function (id) {
      const N = D[id].nodes || {};
      Object.keys(N).forEach(function (k) {
        if (!Array.isArray(N[k].choices)) return;
        N[k].choices.forEach(function (c, i) {
          if (c && c.t && STALE.indexOf(en(c.t)) !== -1 && !c.__deep) c.t = EXITS[hash(id + k + i) % EXITS.length];
        });
      });
    });
  };

  /* ---------------------------------------------------------------- the friends: what they say after the song */
  const needTell = function (f, ask, nodes) {
    const d = D['need_tell_' + f]; if (!d) return;
    const a = d.nodes.a;
    a.choices = [
      K('ask', ask, { next: 'd1', do: { time: 8, soc: 1 } }),
      K('chill', t(`"Got it. Thank you for telling me."`, `«Entendido. Gracias por decírmelo».`, `«Entendi. Obrigado por me contar».`), { free: true, next: null })
    ];
    delete a.next;
    Object.keys(nodes).forEach(function (k) { d.nodes[k] = nodes[k]; });
  };
  /* Maru counts people because she is the one who organises */
  needTell('maru', t(`"You count us when you're scared. What's behind it?"`, `«Nos cuentas cuando tienes miedo. ¿Qué hay detrás?»`, `«Você conta a gente quando tá com medo. O que tem por trás?»`), {
    d1: {
      text: t(`Maru laughs, and it doesn't land where she wanted. "It landed on me in 2019. Somebody had to know where everyone was, and I never put it down. I count at parties, at dinners, at weddings. I have a whole body that does it without asking."`, `Maru se ríe, y no cae donde ella quería. «Me cayó encima en 2019. Alguien tenía que saber dónde estaba cada uno, y nunca lo solté. Cuento en fiestas, en cenas, en bodas. Tengo un cuerpo entero que lo hace sin preguntarme».`, `A Maru ri, e a risada não cai onde ela queria. «Caiu em mim em 2019. Alguém precisava saber onde cada um tava, e eu nunca larguei. Eu conto em festa, em jantar, em casamento. Tenho um corpo inteiro que faz isso sem me perguntar».`),
      choices: [
        K('care', t(`"Who counts you?"`, `«¿Quién te cuenta a ti?»`, `«Quem conta você?»`), { next: 'd2' }),
        K('honest', t(`"You can put it down for an hour. I've got the headcount."`, `«Puedes soltarlo una hora. Yo llevo la cuenta».`, `«Você pode largar por uma hora. A contagem é comigo».`), { next: 'd3' })
      ]
    },
    d2: close('maru', t(`She opens her mouth and closes it. "…Nobody. That's the answer, isn't it." Her eyes go bright and she looks at the ceiling until they stop. "Okay. You, apparently. For tonight. I've got a decision to make this week, a real one, and I'm not telling anyone yet. But I'll tell you first. Soon."`, `Abre la boca y la cierra. «…Nadie. Esa es la respuesta, ¿no?». Los ojos se le ponen brillantes y mira al techo hasta que se les pasa. «Bueno. Tú, al parecer. Por esta noche. Tengo que tomar una decisión esta semana, una de verdad, y no se lo digo a nadie todavía. Pero te lo diré a ti primero. Pronto».`, `Ela abre a boca e fecha. «…Ninguém. Essa é a resposta, né». Os olhos ficam brilhantes e ela olha pro teto até passar. «Tá. Você, pelo visto. Por hoje. Tenho uma decisão pra tomar essa semana, uma de verdade, e não conto pra ninguém ainda. Mas conto pra você primeiro. Logo».`), { bond: { maru: 2 } }),
    d3: close('maru', t(`"An hour." She tries the word. "I'll try. I might count the exits instead, so don't be surprised." She leans her head on your shoulder for a full breath. "That's the first time in months someone's offered. I've got news I'm not ready to say. I'll tell you first."`, `«Una hora». Prueba la palabra. «Voy a intentarlo. A lo mejor cuento las salidas, así que no te sorprendas». Apoya la cabeza en tu hombro un respiro entero. «Hace meses que nadie me lo ofrece. Tengo una noticia que no estoy lista para decir. Te la cuento primero».`, `«Uma hora». Ela experimenta a palavra. «Vou tentar. Posso acabar contando as saídas, então não estranha». Ela encosta a cabeça no seu ombro por um respiro inteiro. «Faz meses que ninguém oferece isso. Tenho uma notícia que não tô pronta pra falar. Te conto primeiro».`), { bond: { maru: 2 } })
  });
  /* Benjamin is loud because quiet has a question in it */
  needTell('dani', t(`"Under the volume. What's going on, Benjamin?"`, `«Debajo del volumen. ¿Qué pasa, Benjamin?»`, `«Debaixo do volume. O que tá acontecendo, Benjamin?»`), {
    d1: {
      text: t(`He keeps bouncing for two more beats, then the bounce runs out. "Nothing. Great. Everything's great." A swallow. "Everyone thinks it's going brilliantly. I'm good at it. If I go quiet, there's a gap, and the thing I'm not saying fits right in it."`, `Sigue rebotando dos tiempos más, y el rebote se acaba. «Nada. Genial. Todo genial». Traga saliva. «Todos creen que me va brillante. Soy bueno en eso. Si me quedo callado, hay un hueco, y lo que no estoy diciendo cabe justo ahí».`, `Ele continua pulando por mais dois tempos, e o pulo acaba. «Nada. Ótimo. Tá tudo ótimo». Engole em seco. «Todo mundo acha que tá indo brilhante. Eu sou bom nisso. Se eu fico quieto, abre um buraco, e a coisa que eu não tô dizendo cabe direitinho ali».`),
      choices: [
        K('care', t(`"Say it when you're ready. I'll ask tomorrow, and the day after."`, `«Dilo cuando estés listo. Te pregunto mañana, y pasado».`, `«Fala quando tiver pronto. Eu pergunto amanhã, e depois de amanhã».`), { next: 'd2' }),
        K('honest', t(`"You're allowed to be quiet next to me. I won't make it a thing."`, `«Puedes quedarte callado a mi lado. No voy a hacer un drama».`, `«Você pode ficar quieto do meu lado. Não vou fazer drama».`), { next: 'd3' })
      ]
    },
    d2: close('dani', t(`"Tomorrow and the day after." He laughs, shaky. "Okay. That I can take. Don't let me say 'amazing' when you ask. If I say 'amazing', ask again." He wipes his face with the heel of his hand and is, for a second, entirely still.`, `«Mañana y pasado». Se ríe, tembloroso. «Bueno. Eso puedo aguantarlo. No me dejes decir 'increíble' cuando preguntes. Si digo 'increíble', pregunta otra vez». Se limpia la cara con la base de la mano y queda, por un segundo, totalmente quieto.`, `«Amanhã e depois de amanhã». Ele ri, trêmulo. «Tá. Isso eu aguento. Não me deixa dizer 'incrível' quando você perguntar. Se eu disser 'incrível', pergunta de novo». Ele limpa o rosto com a base da mão e fica, por um segundo, completamente parado.`), { bond: { dani: 2 } }),
    d3: close('dani', t(`He stays quiet for eleven seconds. You count them. "That was the longest I've gone all year," he says, and sounds almost proud, almost frightened. "Okay. Thank you. Can we be loud again now? I'm better at it."`, `Se queda callado once segundos. Los cuentas. «Esa fue la vez más larga en todo el año», dice, y suena casi orgulloso, casi asustado. «Bueno. Gracias. ¿Podemos volver a ser ruidosos? Se me da mejor».`, `Ele fica quieto por onze segundos. Você conta. «Foi o mais longo do ano todo», diz, e soa quase orgulhoso, quase assustado. «Tá. Obrigado. A gente pode voltar a ser barulhento? Eu sou melhor nisso».`), { bond: { dani: 2 } })
  });
  /* Fernando: quiet, not empty */
  needTell('tato', t(`"Quiet, not empty. What's the difference for you?"`, `«Tranquilo, no vacío. ¿Cuál es la diferencia para ti?»`, `«Quieto, não vazio. Qual é a diferença pra você?»`), {
    d1: {
      text: t(`He takes the question seriously, which takes a while. "Empty is when the party leaves and my body is furniture again. Quiet is when it's still mine after the music stops." A pause. "I'm thirty-four. I think tonight is the first time I've felt the difference."`, `Se toma la pregunta en serio, lo que tarda un rato. «Vacío es cuando se va la fiesta y mi cuerpo vuelve a ser un mueble. Tranquilo es cuando sigue siendo mío después de que para la música». Una pausa. «Tengo treinta y cuatro. Creo que esta noche es la primera vez que siento la diferencia».`, `Ele leva a pergunta a sério, o que demora um pouco. «Vazio é quando a festa vai embora e meu corpo volta a ser móvel. Quieto é quando ele continua sendo meu depois que a música para». Uma pausa. «Tenho trinta e quatro. Acho que hoje é a primeira vez que eu sinto a diferença».`),
      choices: [
        K('honest', t(`"It's been yours the whole time."`, `«Ha sido tuyo todo el tiempo».`, `«Sempre foi seu».`), { next: 'd2' }),
        K('ask', t(`"What does it feel like when it's yours?"`, `«¿Cómo se siente cuando es tuyo?»`, `«Como é quando é seu?»`), { next: 'd3' })
      ]
    },
    d2: close('tato', t(`"Maybe. It took a strange night and three people who ask first." He smiles at the floor. "Don't let me wake up weird tomorrow. If I'm strange about it, remind me I said this."`, `«Quizá. Hizo falta una noche rara y tres personas que preguntan primero». Le sonríe al piso. «No me dejes despertar raro mañana. Si me pongo extraño, recuérdame que dije esto».`, `«Talvez. Precisou de uma noite estranha e de três pessoas que perguntam primeiro». Ele sorri pro chão. «Não me deixa acordar estranho amanhã. Se eu ficar esquisito com isso, me lembra que eu disse isso».`), { bond: { tato: 2 } }),
    d3: close('tato', t(`"Like nobody's asked me to be funny for a minute." He lets out a breath. "I don't know what to do with that. I think I just stand here and have it."`, `«Como si nadie me hubiera pedido ser gracioso por un minuto». Suelta el aire. «No sé qué hacer con eso. Creo que me quedo aquí y lo tengo».`, `«Como se ninguém tivesse me pedido pra ser engraçado por um minuto». Ele solta o ar. «Não sei o que fazer com isso. Acho que só fico aqui e tenho».`), { bond: { tato: 2 } })
  });

  /* ---------------------------------------------------------------- the cast: a turn and a close, one choice later */
  EM.DEEP('pili', {
    tone: 'ask', label: t(`Ask about her. Not the argument.`, `Preguntar por ella. No por la discusión.`, `Perguntar dela. Não da discussão.`), nodes: {
      d1: {
        text: t(`Pili stops mid-word. For the first time the jaw is still. "Nobody's asked about her. Six years. Everyone asks about the argument. The argument is easy."`, `Pili se detiene a mitad de palabra. Por primera vez la mandíbula queda quieta. «Nadie ha preguntado por ella. Seis años. Todos preguntan por la discusión. La discusión es fácil».`, `A Pili para no meio da palavra. Pela primeira vez o maxilar fica parado. «Ninguém perguntou dela. Seis anos. Todo mundo pergunta da discussão. A discussão é fácil».`),
        choices: [
          K('care', t(`"Take your time. Nobody's rushing you."`, `«Tómate tu tiempo. Nadie te apura».`, `«Leva o tempo que precisar. Ninguém tá te apressando».`), { next: 'd2' }),
          K('honest', t(`"You can miss her and still be here."`, `«Puedes extrañarla y estar aquí igual».`, `«Você pode sentir falta dela e estar aqui mesmo assim».`), { next: 'd3' })
        ]
      },
      d2: close('pili', t(`"I miss her." She says it slowly, checking whether it still works. "That's the whole story. I tell it in four hundred words so it doesn't sound like that." She laughs, wet, and the jaw starts up again, gently this time.`, `«La extraño». Lo dice despacio, comprobando que todavía funciona. «Esa es toda la historia. La cuento en cuatrocientas palabras para que no suene así». Se ríe, con los ojos húmedos, y la mandíbula arranca de nuevo, suave esta vez.`, `«Sinto falta dela». Ela diz devagar, conferindo se ainda funciona. «Essa é a história toda. Eu conto em quatrocentas palavras pra não soar assim». Ela ri, de olho molhado, e o maxilar volta a trabalhar, devagar dessa vez.`)),
      d3: close('pili', t(`"Both. Yeah. Both." She nods several times. "That's a relief, actually. I thought I had to pick one by morning."`, `«Las dos. Sí. Las dos». Asiente varias veces. «Es un alivio, en realidad. Creía que tenía que elegir una antes de la mañana».`, `«Os dois. É. Os dois». Ela assente várias vezes. «É um alívio, na verdade. Eu achava que tinha que escolher um até de manhã».`))
    }
  });
  EM.DEEP('kiki', {
    tone: 'ask', label: t(`"What's really in the thermos?"`, `«¿Qué hay de verdad en el termo?»`, `«O que tem mesmo na garrafa?»`), nodes: {
      d1: {
        text: t(`She lowers her voice. "Strawberry milk. Hot. I'm thirty-eight. The last time I was good at drinking at parties I wasn't good at much else." The thermos goes a little closer to her chest.`, `Baja la voz. «Leche de fresa. Caliente. Tengo treinta y ocho. La última vez que se me daba bien tomar en las fiestas no se me daba bien casi nada más». El termo se acerca un poco a su pecho.`, `Ela abaixa a voz. «Leite de morango. Quente. Tenho trinta e oito. A última vez que eu era boa em beber em festa eu não era boa em quase mais nada». A garrafa chega um pouco mais perto do peito.`),
        choices: [
          K('care', t(`"Being here sober is a real way to be here."`, `«Estar aquí sobria es una forma real de estar».`, `«Estar aqui sóbria é um jeito real de estar».`), { next: 'd2' }),
          K('honest', t(`"You don't need the shot. You're the loudest thing in the room."`, `«No necesitas el trago. Eres lo más ruidoso de la sala».`, `«Você não precisa do shot. Você é a coisa mais barulhenta do salão».`), { next: 'd3' })
        ]
      },
      d2: close('kiki', t(`"It's the only way I remember them." She wipes under one eye with a knuckle. "Don't tell anyone it's milk. I've got a reputation." She presses the thermos into your hand. "Hold it a second. I need both arms for this next song."`, `«Es la única forma en que los recuerdo». Se limpia bajo un ojo con un nudillo. «No le digas a nadie que es leche. Tengo reputación». Te pone el termo en la mano. «Sostenlo un segundo. Necesito los dos brazos para la próxima canción».`, `«É o único jeito de eu lembrar delas». Ela limpa embaixo de um olho com o nó do dedo. «Não conta pra ninguém que é leite. Eu tenho reputação». Ela põe a garrafa na sua mão. «Segura um segundo. Preciso dos dois braços pra próxima música».`)),
      d3: close('kiki', t(`"Loudest." She considers it. "That's the nicest thing anyone's said about the part of me I've been ashamed of." She laughs, a little undone. "Okay. Milk it is. Cheers."`, `«Más ruidosa». Lo considera. «Es lo más amable que alguien me ha dicho de la parte de mí que me daba vergüenza». Se ríe, un poco deshecha. «Bueno. Leche será. Salud».`, `«Mais barulhenta». Ela considera. «É a coisa mais gentil que alguém já disse da parte de mim da qual eu tinha vergonha». Ela ri, meio desfeita. «Tá. Leite, então. Saúde».`))
    }
  });
  EM.DEEP('gus', {
    tone: 'ask', label: t(`"Who taught you to DJ?"`, `«¿Quién te enseñó a pinchar?»`, `«Quem te ensinou a discotecar?»`), nodes: {
      d1: {
        text: t(`The gestures stop mid-air. "My dad ran a wedding-DJ business. I carried his crates for six years and he never let me touch the decks. He said you earn the transition." A pause. "He died in the spring, and I found out I'd learned the whole set by carrying it."`, `Los gestos se detienen en el aire. «Mi papá tenía un negocio de DJ para bodas. Cargué sus cajones seis años y nunca me dejó tocar los platos. Decía que la transición se gana». Una pausa. «Murió en primavera, y descubrí que me había aprendido todo el set de tanto cargarlo».`, `Os gestos param no ar. «Meu pai tinha um negócio de DJ de casamento. Carreguei as caixas dele por seis anos e ele nunca me deixou encostar nas pickups. Dizia que a transição a gente ganha». Uma pausa. «Ele morreu na primavera, e descobri que tinha aprendido o set inteiro de tanto carregar».`),
        choices: [
          K('care', t(`"Show me his transition. The real one."`, `«Muéstrame su transición. La de verdad».`, `«Me mostra a transição dele. A de verdade».`), { next: 'd2' }),
          K('honest', t(`"He'd have let you touch them now."`, `«Ahora te habría dejado tocarlos».`, `«Agora ele deixava você encostar».`), { next: 'd3' })
        ]
      },
      d2: close('gus', t(`Gus shuts his eyes and does it: one hand cupping the headphone, the other drawing a slow, patient line through the air. For eight bars it is unmistakably somebody else's set, played by his body. "That's his," he whispers. "It's a good one, isn't it."`, `Gus cierra los ojos y lo hace: una mano sobre el auricular, la otra trazando una línea lenta y paciente en el aire. Durante ocho compases es sin duda el set de otro, tocado por su cuerpo. «Esa es suya», susurra. «Es buena, ¿verdad?»`, `O Gus fecha os olhos e faz: uma mão no fone, a outra desenhando uma linha lenta e paciente no ar. Por oito compassos é sem dúvida o set de outra pessoa, tocado pelo corpo dele. «Essa é dele», sussurra. «É boa, né?»`)),
      d3: close('gus', t(`"Yeah." He breathes out. "I think he would. I'm going to say that out loud to a real booth one day, so it's said." He pulls the invisible headphone back on. "Now shush. This transition is for him."`, `«Sí». Suelta el aire. «Creo que sí. Algún día se lo voy a decir en voz alta a una cabina de verdad, para que quede dicho». Se vuelve a poner el auricular invisible. «Ahora silencio. Esta transición es para él».`, `«É». Ele solta o ar. «Acho que deixava. Um dia vou dizer isso em voz alta numa cabine de verdade, pra ficar dito». Ele coloca o fone invisível de volta. «Agora shh. Essa transição é pra ele».`))
    }
  });
  EM.DEEP('analu', {
    tone: 'ask', label: t(`"Why a line with no leader but you?"`, `«¿Por qué una fila sin líder salvo tú?»`, `«Por que uma fila sem líder além de você?»`), nodes: {
      d1: {
        text: t(`She lowers the unplugged megaphone. "At school I was never picked for anything. Leader of a line nobody has to follow is the safest authority I've ever had." She grins, and the grin holds a little extra weight.`, `Baja el megáfono desenchufado. «En la escuela nunca me elegían para nada. Ser líder de una fila que nadie tiene que seguir es la autoridad más segura que he tenido». Sonríe, y la sonrisa carga un peso extra.`, `Ela abaixa o megafone desligado. «Na escola ninguém nunca me escolhia pra nada. Ser líder de uma fila que ninguém precisa seguir é a autoridade mais segura que eu já tive». Ela sorri, e o sorriso carrega um peso a mais.`),
        choices: [
          K('care', t(`"People follow you because they like you. The megaphone's decoration."`, `«La gente te sigue porque le caes bien. El megáfono es decoración».`, `«As pessoas te seguem porque gostam de você. O megafone é enfeite».`), { next: 'd2' }),
          K('joke', t(`"I'll follow. I wasn't picked either."`, `«Yo te sigo. A mí tampoco me elegían».`, `«Eu te sigo. Também nunca me escolhiam».`), { next: 'd3' })
        ]
      },
      d2: close('analu', t(`"I know." A short silence. "I like hearing it from someone who isn't in the line. Stand there. First mate."`, `«Lo sé». Un silencio corto. «Me gusta oírlo de alguien que no está en la fila. Ponte ahí. Primer oficial».`, `«Eu sei». Um silêncio curto. «Gosto de ouvir de alguém que não tá na fila. Fica ali. Imediato».`)),
      d3: close('analu', t(`"Then you're my first pick." She points at the spot next to her with the dead megaphone. "Captain and first mate. Nobody gets chosen last in this line."`, `«Entonces eres mi primera elección». Señala el lugar a su lado con el megáfono muerto. «Capitana y primer oficial. En esta fila nadie queda último».`, `«Então você é minha primeira escolha». Ela aponta o lugar do lado dela com o megafone morto. «Capitã e imediato. Nessa fila ninguém é escolhido por último».`))
    }
  });
  EM.DEEP('moe', {
    tone: 'ask', label: t(`"Is Pia the real reason you're talking to Gerald?"`, `«¿Pia es la razón de verdad por la que hablas con Gerald?»`, `«A Pia é o motivo de verdade de você falar com o Gerald?»`), nodes: {
      d1: {
        text: t(`Moe lowers the philosophy to a murmur. "She came with someone else. I came as a friend. Gerald is the only one who knows that's a lie."`, `Moe baja la filosofía a un murmullo. «Vino con otra persona. Yo vine de amigo. Gerald es el único que sabe que es mentira».`, `O Moe baixa a filosofia a um murmúrio. «Ela veio com outra pessoa. Eu vim como amigo. O Gerald é o único que sabe que é mentira».`),
        choices: [
          K('care', t(`"You don't have to be fine about it."`, `«No tienes que estar bien con eso».`, `«Você não precisa estar bem com isso».`), { next: 'd2' }),
          K('honest', t(`"Tell her. Not tonight, maybe. Soon."`, `«Díselo. Esta noche no, quizá. Pronto».`, `«Conta pra ela. Hoje não, talvez. Logo».`), { next: 'd3' })
        ]
      },
      d2: close('moe', t(`"Thank you. Gerald's been saying 'be fine' for an hour." He pats the fern gently. "He means well. He's a plant."`, `«Gracias. Gerald lleva una hora diciendo 'estate bien'». Palmea el helecho con suavidad. «Tiene buena intención. Es una planta».`, `«Obrigado. O Gerald tá falando 'fica bem' faz uma hora». Ele dá um tapinha na samambaia com carinho. «Tem boa intenção. É uma planta».`)),
      d3: close('moe', t(`"Soon." He nods slowly, then at the fern. "Soon, Gerald. Don't look at me like that." A breath. "Okay. Say it back to me tomorrow, if I forget."`, `«Pronto». Asiente despacio, y luego al helecho. «Pronto, Gerald. No me mires así». Un respiro. «Bueno. Repítemelo mañana, si se me olvida».`, `«Logo». Ele assente devagar, e depois pra samambaia. «Logo, Gerald. Não me olha assim». Um respiro. «Tá. Me fala amanhã, se eu esquecer».`))
    }
  });
  EM.DEEP('oz', {
    tone: 'ask', label: t(`"Why the ice?"`, `«¿Por qué el hielo?»`, `«Por que o gelo?»`), nodes: {
      d1: {
        text: t(`Oz doesn't move. "It's the only thing I've held tonight that is exactly as cold as it says it is. Everything else is pretending to be warm." The block drips onto his shoes. He doesn't notice.`, `Oz no se mueve. «Es lo único que he sostenido esta noche que está exactamente tan frío como dice. Todo lo demás finge estar tibio». El bloque gotea sobre sus zapatos. No lo nota.`, `O Oz não se mexe. «É a única coisa que eu segurei hoje que tá exatamente tão fria quanto diz. Todo o resto finge ser quente». O bloco pinga nos sapatos dele. Ele não percebe.`),
        choices: [
          K('care', t(`Hold the other end. "Tell me when it hurts."`, `Sostener el otro extremo. «Dime cuando duela».`, `Segurar a outra ponta. «Me avisa quando doer».`), { next: 'd2' }),
          K('honest', t(`"Warm things can be real too."`, `«Las cosas tibias también pueden ser reales».`, `«Coisas quentes também podem ser reais».`), { next: 'd3' })
        ]
      },
      d2: close('oz', t(`Ninety seconds in, the pain arrives and neither of you lets go. "Everything melts if you stay long enough," Oz says, hoarse. "Thank you for staying."`, `A los noventa segundos llega el dolor y ninguno de los dos suelta. «Todo se derrite si te quedas el tiempo suficiente», dice Oz, ronco. «Gracias por quedarte».`, `Com noventa segundos a dor chega e nenhum dos dois solta. «Tudo derrete se você ficar tempo suficiente», diz o Oz, rouco. «Obrigado por ficar».`)),
      d3: close('oz', t(`He thinks about it for a long time, which is hard to do while holding ice. "Show me one." You put your hand over his, a little warm. He nods very slowly. "…Okay. That one's real."`, `Lo piensa mucho rato, lo que es difícil con un hielo en las manos. «Muéstrame una». Pones tu mano sobre la suya, un poco tibia. Asiente muy despacio. «…Bueno. Esa es real».`, `Ele pensa por muito tempo, o que é difícil segurando gelo. «Me mostra uma». Você põe a mão sobre a dele, um pouco quente. Ele assente bem devagar. «…Tá. Essa é real».`))
    }
  });
  EM.DEEP('otto', {
    tone: 'ask', label: t(`"Did a rock ever help you?"`, `«¿Alguna piedra te ayudó a ti?»`, `«Alguma pedra já te ajudou?»`), nodes: {
      d1: {
        text: t(`Otto turns the grey pebble over. "My brother gave me one when he left for the army. I sold four hundred to stay near that feeling. He called last week. Eleven minutes. It's the longest we've talked in four years."`, `Otto da vuelta a la piedrita gris. «Mi hermano me dio una cuando se fue al ejército. Vendí cuatrocientas para estar cerca de esa sensación. Me llamó la semana pasada. Once minutos. Es lo más largo que hemos hablado en cuatro años».`, `O Otto vira a pedrinha cinza na mão. «Meu irmão me deu uma quando foi pro exército. Vendi quatrocentas pra ficar perto desse sentimento. Ele ligou semana passada. Onze minutos. É o mais longo que a gente falou em quatro anos».`),
        choices: [
          K('care', t(`"Keep that one. It's already worth more than a euro."`, `«Quédate con esa. Ya vale más que un euro».`, `«Fica com essa. Já vale mais que um euro».`), { next: 'd2' }),
          K('ask', t(`"What did you talk about for eleven minutes?"`, `«¿De qué hablaron once minutos?»`, `«Sobre o que vocês falaram por onze minutos?»`), { next: 'd3' })
        ]
      },
      d2: close('otto', t(`"Yeah." He closes his hand around it. "It's not for sale. It's the only one that isn't." He gives you a different pebble, free. "That one's a doorstop. It does nothing. Take it anyway."`, `«Sí». Cierra la mano sobre ella. «No está en venta. Es la única que no». Te da otra piedrita, gratis. «Esa es un tope de puerta. No hace nada. Llévatela igual».`, `«É». Ele fecha a mão em volta dela. «Não tá à venda. É a única que não». Ele te dá outra pedrinha, de graça. «Essa é calço de porta. Não faz nada. Leva mesmo assim».`)),
      d3: close('otto', t(`"The weather. His knee. The price of eggs." Otto laughs and it cracks halfway. "Nothing, basically. It was the best call of my life."`, `«El clima. Su rodilla. El precio de los huevos». Otto se ríe y se le quiebra a la mitad. «Nada, básicamente. Fue la mejor llamada de mi vida».`, `«O tempo. O joelho dele. O preço do ovo». O Otto ri e a risada quebra no meio. «Nada, basicamente. Foi a melhor ligação da minha vida».`))
    }
  });
  EM.DEEP('yui', {
    tone: 'ask', label: t(`"What are you really betting on?"`, `«¿A qué estás apostando de verdad?»`, `«No que você tá apostando de verdade?»`), nodes: {
      d1: {
        text: t(`Yui lowers the court-issued voice. "Nothing. That's the point. I've lost things on bets. Now I only play for nothing and I win exactly half the time. It's the first fair thing I've had in years."`, `Yui baja la voz de dictamen. «Nada. Ese es el punto. He perdido cosas apostando. Ahora solo juego por nada y gano exactamente la mitad de las veces. Es lo primero justo que tengo en años».`, `A Yui abaixa a voz de sentença. «Nada. Esse é o ponto. Já perdi coisas em aposta. Agora só jogo por nada e ganho exatamente metade das vezes. É a primeira coisa justa que eu tenho em anos».`),
        choices: [
          K('care', t(`"Fair is a good thing to have."`, `«Lo justo es algo bueno de tener».`, `«Justo é uma coisa boa de ter».`), { next: 'd2' }),
          K('bold', t(`"Best of three, then. For nothing."`, `«Mejor de tres, entonces. Por nada».`, `«Melhor de três, então. Por nada».`), { next: 'd3' })
        ]
      },
      d2: close('yui', t(`"It's rarer than people think." She puts out a flat hand. "Shake on nothing. It's binding."`, `«Es más raro de lo que la gente cree». Extiende una mano plana. «Apretón por nada. Es vinculante».`, `«É mais raro do que as pessoas acham». Ela estende uma mão aberta. «Aperto de mão por nada. É vinculante».`)),
      d3: close('yui', t(`Three rounds. You lose two to one. "For nothing," Yui says solemnly. You feel it anyway, and so does she. "That's what makes it fair."`, `Tres rondas. Pierdes dos a uno. «Por nada», dice Yui, solemne. Lo sientes igual, y ella también. «Eso es lo que lo hace justo».`, `Três rodadas. Você perde dois a um. «Por nada», diz a Yui, solene. Você sente mesmo assim, e ela também. «É isso que faz ser justo».`))
    }
  });
  EM.DEEP('lyra', {
    tone: 'ask', label: t(`"Whose stories are they?"`, `«¿De quién son las historias?»`, `«De quem são as histórias?»`), nodes: {
      d1: {
        text: t(`The glowing notebook lowers. "People who told me the best night of their life and asked me not to say who. I keep all of them. A few are from people who aren't here anymore." Her voice stays soft. "I read those last."`, `El cuaderno luminoso baja. «Gente que me contó la mejor noche de su vida y me pidió no decir quién. Las guardo todas. Algunas son de gente que ya no está». Su voz sigue suave. «Esas las leo al final».`, `O caderno luminoso desce. «Gente que me contou a melhor noite da vida e pediu pra eu não dizer quem. Guardo todas. Algumas são de gente que não tá mais aqui». A voz continua suave. «Essas eu leio por último».`),
        choices: [
          K('care', t(`"Read me one of those."`, `«Léeme una de esas».`, `«Lê uma dessas pra mim».`), { next: 'd2' }),
          K('honest', t(`"I'd tell you mine. Not tonight."`, `«Te contaría la mía. Esta noche no».`, `«Eu te contava a minha. Hoje não».`), { next: 'd3' })
        ]
      },
      d2: close('lyra', t(`"We left at six. Nobody had a plan. A stranger with a flask of tea passed round cups and I understood I'd been starved of something for years." She closes the notebook. "He passed away in March. His sister gave me permission. That one's the best one I have."`, `«Salimos a las seis. Nadie tenía un plan. Un desconocido con un termo de té repartió vasos y entendí que llevaba años con hambre de algo». Cierra el cuaderno. «Murió en marzo. Su hermana me dio permiso. Esa es la mejor que tengo».`, `«A gente saiu às seis. Ninguém tinha plano. Um desconhecido com uma garrafa de chá passou distribuindo copos e eu entendi que passei anos com fome de uma coisa». Ela fecha o caderno. «Ele morreu em março. A irmã dele me deu permissão. Essa é a melhor que eu tenho».`)),
      d3: close('lyra', t(`"Whenever," she says. "The notebook doesn't go anywhere. Find me at the next one."`, `«Cuando quieras», dice. «El cuaderno no se va a ninguna parte. Búscame en la próxima».`, `«Quando quiser», diz. «O caderno não vai a lugar nenhum. Me procura na próxima».`))
    }
  });
  EM.DEEP('iso', {
    tone: 'ask', label: t(`"Why fruit?"`, `«¿Por qué fruta?»`, `«Por que fruta?»`), nodes: {
      d1: {
        text: t(`The voice with the bowl goes quiet. "My mother sold fruit at a market for thirty years. I never gave her anything back. At three a.m., ten feet from a speaker, somebody eats a peach with their eyes closed and I think: that. That's what she was selling."`, `La voz del bol se queda en silencio. «Mi madre vendió fruta en un mercado treinta años. Nunca le devolví nada. A las tres de la mañana, a tres metros de un parlante, alguien se come un durazno con los ojos cerrados y pienso: eso. Eso era lo que ella vendía».`, `A voz da tigela fica em silêncio. «Minha mãe vendeu fruta numa feira por trinta anos. Eu nunca devolvi nada pra ela. Às três da manhã, a três metros de uma caixa de som, alguém come um pêssego de olhos fechados e eu penso: isso. Era isso que ela vendia».`),
        choices: [
          K('care', t(`"She'd be proud."`, `«Estaría orgullosa».`, `«Ela ficaria orgulhosa».`), { next: 'd2' }),
          K('honest', t(`"Tell her. You can still tell her."`, `«Díselo. Todavía puedes decírselo».`, `«Conta pra ela. Você ainda pode contar».`), { next: 'd3' })
        ]
      },
      d2: close('iso', t(`"She'd say the peaches were too soft." The laugh is wet. "Then she'd eat three. Here. Eyes closed. This one's ripe."`, `«Diría que los duraznos están muy blandos». La risa sale húmeda. «Luego se comería tres. Aquí. Con los ojos cerrados. Este está maduro».`, `«Ela diria que os pêssegos tavam moles demais». A risada sai molhada. «Depois ela comia três. Toma. De olhos fechados. Esse tá maduro».`)),
      d3: close('iso', t(`"I can." A long pause. "I'll go on Sunday. I'll bring a bag of peaches and see if she makes the face." The bowl is held out to you again, steadier.`, `«Puedo». Una pausa larga. «Voy el domingo. Llevo una bolsa de duraznos a ver si pone la cara». El bol vuelve a tenderse hacia ti, más firme.`, `«Posso». Uma pausa longa. «Vou domingo. Levo um saco de pêssegos pra ver se ela faz aquela cara». A tigela é estendida pra você de novo, mais firme.`))
    }
  });
  EM.DEEP('wenzhao', {
    tone: 'ask', label: t(`"How long have you done each other's faces?"`, `«¿Hace cuánto se maquillan el uno al otro?»`, `«Faz quanto tempo que vocês se maquiam?»`), nodes: {
      d1: {
        text: t(`The two stop mid-stroke. Wen answers. "Since we were nineteen. Zhao came out in my kitchen and I did his eyeliner and said 'finally.'" Zhao: "Don't. I'll smudge."`, `Los dos se detienen a mitad del trazo. Wen responde. «Desde los diecinueve. Zhao salió del clóset en mi cocina y yo le hice el delineador y le dije 'por fin'». Zhao: «No. Se me corre».`, `Os dois param no meio do traço. A Wen responde. «Desde os dezenove. O Zhao se assumiu na minha cozinha e eu fiz o delineador dele e disse 'finalmente'». O Zhao: «Para. Vai borrar».`),
        choices: [
          K('care', t(`"That's a rare thing to have."`, `«Es algo raro de tener».`, `«É uma coisa rara de ter».`), { next: 'd2' }),
          K('joke', t(`"Smudge it. I'll hold the tissue."`, `«Que se corra. Yo sostengo el pañuelo».`, `«Deixa borrar. Eu seguro o lenço».`), { next: 'd3' })
        ]
      },
      d2: close('wenzhao', t(`"Fifteen years," Wen says. "He's my mirror. I'm his. When one of us is lying about how we feel, the other one just stops blinking." Zhao: "She's doing it now. Wen. Wen, you're doing it." They both laugh, wetly.`, `«Quince años», dice Wen. «Él es mi espejo. Yo el suyo. Cuando uno miente sobre cómo se siente, el otro deja de parpadear». Zhao: «Lo está haciendo ahora. Wen. Wen, lo estás haciendo». Se ríen los dos, con los ojos húmedos.`, `«Quinze anos», diz a Wen. «Ele é meu espelho. Eu sou o dele. Quando um de nós tá mentindo sobre o que sente, o outro para de piscar». O Zhao: «Ela tá fazendo agora. Wen. Wen, você tá fazendo». Os dois riem, de olho molhado.`)),
      d3: close('wenzhao', t(`Zhao lets it go. A single streak runs through the shimmer and Wen kisses the temple above it. "There. Now it's real," she says. "Perfect would've been boring."`, `Zhao lo deja. Una sola raya cruza el brillo y Wen le besa la sien por encima. «Listo. Ahora es real», dice. «Perfecto habría sido aburrido».`, `O Zhao deixa. Uma única risca atravessa o brilho e a Wen beija a têmpora por cima. «Pronto. Agora é de verdade», diz. «Perfeito seria chato».`))
    }
  });
  EM.DEEP('marga', {
    tone: 'ask', label: t(`"Beyond the bladder: how are you?"`, `«Más allá de la vejiga: ¿cómo estás?»`, `«Fora a bexiga: como você tá?»`), nodes: {
      d1: {
        text: t(`Marga stops bouncing. "Thrilled. I haven't stood in a queue like this in years. I'm forty-eight and the people in line are twenty-two and nobody has asked me what I do. It's the happiest I've been in ten years."`, `Marga deja de rebotar. «Feliz. Hace años que no hago una fila así. Tengo cuarenta y ocho y los de la fila tienen veintidós y nadie me ha preguntado a qué me dedico. Es lo más feliz que he estado en diez años».`, `A Marga para de pular. «Eufórica. Faz anos que eu não fico numa fila assim. Tenho quarenta e oito e o pessoal da fila tem vinte e dois e ninguém me perguntou o que eu faço. É a mais feliz que eu fico em dez anos».`),
        choices: [
          K('care', t(`"Ten years is a long time to wait for this."`, `«Diez años es mucho para esperar esto».`, `«Dez anos é muito tempo pra esperar por isso».`), { next: 'd2' }),
          K('honest', t(`"What changed? Why tonight?"`, `«¿Qué cambió? ¿Por qué esta noche?»`, `«O que mudou? Por que hoje?»`), { next: 'd3' })
        ]
      },
      d2: close('marga', t(`"It is." She smiles with half of her face. "I didn't know I'd been holding my breath. Don't tell anyone. Well. Tell the line."`, `«Lo es». Sonríe con la mitad de la cara. «No sabía que llevaba aguantando la respiración. No se lo digas a nadie. Bueno. Dísselo a la fila».`, `«É». Ela sorri com metade do rosto. «Eu não sabia que tava segurando a respiração. Não conta pra ninguém. Quer dizer. Conta pra fila».`)),
      d3: close('marga', t(`"I stopped being polite about what I want," she says. "It's an unattractive discovery. I love it." She crosses her legs, uncrosses them, and says "go, go, you first, I've got my own thing to manage."`, `«Dejé de ser educada con lo que quiero», dice. «Es un descubrimiento poco atractivo. Me encanta». Cruza las piernas, las descruza y dice «ve, ve, tú primero, tengo lo mío que manejar».`, `«Parei de ser educada com o que eu quero», diz. «É uma descoberta pouco atraente. Eu adoro». Ela cruza as pernas, descruza e diz «vai, vai, você primeiro, eu tenho as minhas coisas pra lidar».`))
    }
  });
  EM.DEEP('bruno', {
    tone: 'ask', label: t(`"What made you come tonight?"`, `«¿Qué te trajo esta noche?»`, `«O que te trouxe aqui hoje?»`), nodes: {
      d1: {
        text: t(`Bruno looks past you at the dance floor. "My wife passed in January. She'd have loved this. For eleven years she tried to get me to come to something like it. I read a thread. I'm here for the two of us."`, `Bruno mira más allá de ti, hacia la pista. «Mi esposa murió en enero. Le habría encantado. Once años intentó llevarme a algo así. Leí un hilo. Estoy aquí por los dos».`, `O Bruno olha além de você, pra pista. «Minha esposa morreu em janeiro. Ela ia adorar. Por onze anos tentou me levar num lugar assim. Li um tópico. Tô aqui por nós dois».`),
        choices: [
          K('care', t(`"Then she's here. Let's find you a good spot."`, `«Entonces ella está aquí. Busquemos un buen lugar».`, `«Então ela tá aqui. Vamos achar um bom lugar pra você».`), { next: 'd2' }),
          K('honest', t(`"You don't have to enjoy it. Just be here."`, `«No tienes que disfrutarlo. Solo estar aquí».`, `«Você não precisa curtir. Só estar aqui».`), { next: 'd3' })
        ]
      },
      d2: close('bruno', t(`He laughs, startled, and presses a knuckle under his glasses. "She'd have said the same thing. Okay. A good spot. Near a speaker, she'd say. Not too near."`, `Se ríe, sorprendido, y se aprieta un nudillo bajo los lentes. «Ella habría dicho lo mismo. Bueno. Un buen lugar. Cerca de un parlante, diría ella. No demasiado cerca».`, `Ele ri, surpreso, e aperta o nó do dedo embaixo dos óculos. «Ela teria dito a mesma coisa. Tá. Um bom lugar. Perto de uma caixa, ela diria. Não perto demais».`)),
      d3: close('bruno', t(`"Just be here." He repeats it twice, softly, a note to himself. "That I can do. That I can absolutely do. Thank you."`, `«Solo estar aquí». Lo repite dos veces, bajito, nota para sí. «Eso sí puedo. Eso definitivamente puedo. Gracias».`, `«Só estar aqui». Ele repete duas vezes, baixinho, um bilhete pra si. «Isso eu consigo. Isso eu consigo com certeza. Obrigado».`))
    }
  });

  /* ---------------------------------------------------------------- apply the exits last, once everything has loaded */
  window.addEventListener('load', function () { EM.VARY(); });
})();

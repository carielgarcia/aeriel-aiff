/* EXCUSE ME — adult depth pass: EM.DEEP second-half conversations for club crowd & staff. */
'use strict';
/* ---- consolidated from story_v34.js ---- */
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
  needTell('luisa', t(`"You count us when you're scared. What's behind it?"`, `«Nos cuentas cuando tienes miedo. ¿Qué hay detrás?»`, `«Você conta a gente quando tá com medo. O que tem por trás?»`), {
    d1: {
      text: t(`Luisa laughs, and it doesn't land where she wanted. "It landed on me in 2019. Somebody had to know where everyone was, and I never put it down. I count at parties, at dinners, at weddings. I have a whole body that does it without asking."`, `Luisa se ríe, y no cae donde ella quería. «Me cayó encima en 2019. Alguien tenía que saber dónde estaba cada uno, y nunca lo solté. Cuento en fiestas, en cenas, en bodas. Tengo un cuerpo entero que lo hace sin preguntarme».`, `A Luisa ri, e a risada não cai onde ela queria. «Caiu em mim em 2019. Alguém precisava saber onde cada um tava, e eu nunca larguei. Eu conto em festa, em jantar, em casamento. Tenho um corpo inteiro que faz isso sem me perguntar».`),
      choices: [
        K('care', t(`"Who counts you?"`, `«¿Quién te cuenta a ti?»`, `«Quem conta você?»`), { next: 'd2' }),
        K('honest', t(`"You can put it down for an hour. I've got the headcount."`, `«Puedes soltarlo una hora. Yo llevo la cuenta».`, `«Você pode largar por uma hora. A contagem é comigo».`), { next: 'd3' })
      ]
    },
    d2: close('luisa', t(`She opens her mouth and closes it. "…Nobody. That's the answer, isn't it." Her eyes go bright and she looks at the ceiling until they stop. "Okay. You, apparently. For tonight. I've got a decision to make this week, a real one, and I'm not telling anyone yet. But I'll tell you first. Soon."`, `Abre la boca y la cierra. «…Nadie. Esa es la respuesta, ¿no?». Los ojos se le ponen brillantes y mira al techo hasta que se les pasa. «Bueno. Tú, al parecer. Por esta noche. Tengo que tomar una decisión esta semana, una de verdad, y no se lo digo a nadie todavía. Pero te lo diré a ti primero. Pronto».`, `Ela abre a boca e fecha. «…Ninguém. Essa é a resposta, né». Os olhos ficam brilhantes e ela olha pro teto até passar. «Tá. Você, pelo visto. Por hoje. Tenho uma decisão pra tomar essa semana, uma de verdade, e não conto pra ninguém ainda. Mas conto pra você primeiro. Logo».`), { bond: { luisa: 2 } }),
    d3: close('luisa', t(`"An hour." She tries the word. "I'll try. I might count the exits instead, so don't be surprised." She leans her head on your shoulder for a full breath. "That's the first time in months someone's offered. I've got news I'm not ready to say. I'll tell you first."`, `«Una hora». Prueba la palabra. «Voy a intentarlo. A lo mejor cuento las salidas, así que no te sorprendas». Apoya la cabeza en tu hombro un respiro entero. «Hace meses que nadie me lo ofrece. Tengo una noticia que no estoy lista para decir. Te la cuento primero».`, `«Uma hora». Ela experimenta a palavra. «Vou tentar. Posso acabar contando as saídas, então não estranha». Ela encosta a cabeça no seu ombro por um respiro inteiro. «Faz meses que ninguém oferece isso. Tenho uma notícia que não tô pronta pra falar. Te conto primeiro».`), { bond: { luisa: 2 } })
  });
  /* Benjamin is loud because quiet has a question in it */
  needTell('benjamin', t(`"Under the volume. What's going on, Benjamin?"`, `«Debajo del volumen. ¿Qué pasa, Benjamin?»`, `«Debaixo do volume. O que tá acontecendo, Benjamin?»`), {
    d1: {
      text: t(`He keeps bouncing for two more beats, then the bounce runs out. "Nothing. Great. Everything's great." A swallow. "Everyone thinks it's going brilliantly. I'm good at it. If I go quiet, there's a gap, and the thing I'm not saying fits right in it."`, `Sigue rebotando dos tiempos más, y el rebote se acaba. «Nada. Genial. Todo genial». Traga saliva. «Todos creen que me va brillante. Soy bueno en eso. Si me quedo callado, hay un hueco, y lo que no estoy diciendo cabe justo ahí».`, `Ele continua pulando por mais dois tempos, e o pulo acaba. «Nada. Ótimo. Tá tudo ótimo». Engole em seco. «Todo mundo acha que tá indo brilhante. Eu sou bom nisso. Se eu fico quieto, abre um buraco, e a coisa que eu não tô dizendo cabe direitinho ali».`),
      choices: [
        K('care', t(`"Say it when you're ready. I'll ask tomorrow, and the day after."`, `«Dilo cuando estés listo. Te pregunto mañana, y pasado».`, `«Fala quando tiver pronto. Eu pergunto amanhã, e depois de amanhã».`), { next: 'd2' }),
        K('honest', t(`"You're allowed to be quiet next to me. I won't make it a thing."`, `«Puedes quedarte callado a mi lado. No voy a hacer un drama».`, `«Você pode ficar quieto do meu lado. Não vou fazer drama».`), { next: 'd3' })
      ]
    },
    d2: close('benjamin', t(`"Tomorrow and the day after." He laughs, shaky. "Okay. That I can take. Don't let me say 'amazing' when you ask. If I say 'amazing', ask again." He wipes his face with the heel of his hand and is, for a second, entirely still.`, `«Mañana y pasado». Se ríe, tembloroso. «Bueno. Eso puedo aguantarlo. No me dejes decir 'increíble' cuando preguntes. Si digo 'increíble', pregunta otra vez». Se limpia la cara con la base de la mano y queda, por un segundo, totalmente quieto.`, `«Amanhã e depois de amanhã». Ele ri, trêmulo. «Tá. Isso eu aguento. Não me deixa dizer 'incrível' quando você perguntar. Se eu disser 'incrível', pergunta de novo». Ele limpa o rosto com a base da mão e fica, por um segundo, completamente parado.`), { bond: { benjamin: 2 } }),
    d3: close('benjamin', t(`He stays quiet for eleven seconds. You count them. "That was the longest I've gone all year," he says, and sounds almost proud, almost frightened. "Okay. Thank you. Can we be loud again now? I'm better at it."`, `Se queda callado once segundos. Los cuentas. «Esa fue la vez más larga en todo el año», dice, y suena casi orgulloso, casi asustado. «Bueno. Gracias. ¿Podemos volver a ser ruidosos? Se me da mejor».`, `Ele fica quieto por onze segundos. Você conta. «Foi o mais longo do ano todo», diz, e soa quase orgulhoso, quase assustado. «Tá. Obrigado. A gente pode voltar a ser barulhento? Eu sou melhor nisso».`), { bond: { benjamin: 2 } })
  });
  /* Fernando: quiet, not empty */
  needTell('fena', t(`"Quiet, not empty. What's the difference for you?"`, `«Tranquilo, no vacío. ¿Cuál es la diferencia para ti?»`, `«Quieto, não vazio. Qual é a diferença pra você?»`), {
    d1: {
      text: t(`He takes the question seriously, which takes a while. "Empty is when the party leaves and my body is furniture again. Quiet is when it's still mine after the music stops." A pause. "I'm thirty-four. I think tonight is the first time I've felt the difference."`, `Se toma la pregunta en serio, lo que tarda un rato. «Vacío es cuando se va la fiesta y mi cuerpo vuelve a ser un mueble. Tranquilo es cuando sigue siendo mío después de que para la música». Una pausa. «Tengo treinta y cuatro. Creo que esta noche es la primera vez que siento la diferencia».`, `Ele leva a pergunta a sério, o que demora um pouco. «Vazio é quando a festa vai embora e meu corpo volta a ser móvel. Quieto é quando ele continua sendo meu depois que a música para». Uma pausa. «Tenho trinta e quatro. Acho que hoje é a primeira vez que eu sinto a diferença».`),
      choices: [
        K('honest', t(`"It's been yours the whole time."`, `«Ha sido tuyo todo el tiempo».`, `«Sempre foi seu».`), { next: 'd2' }),
        K('ask', t(`"What does it feel like when it's yours?"`, `«¿Cómo se siente cuando es tuyo?»`, `«Como é quando é seu?»`), { next: 'd3' })
      ]
    },
    d2: close('fena', t(`"Maybe. It took a strange night and three people who ask first." He smiles at the floor. "Don't let me wake up weird tomorrow. If I'm strange about it, remind me I said this."`, `«Quizá. Hizo falta una noche rara y tres personas que preguntan primero». Le sonríe al piso. «No me dejes despertar raro mañana. Si me pongo extraño, recuérdame que dije esto».`, `«Talvez. Precisou de uma noite estranha e de três pessoas que perguntam primeiro». Ele sorri pro chão. «Não me deixa acordar estranho amanhã. Se eu ficar esquisito com isso, me lembra que eu disse isso».`), { bond: { fena: 2 } }),
    d3: close('fena', t(`"Like nobody's asked me to be funny for a minute." He lets out a breath. "I don't know what to do with that. I think I just stand here and have it."`, `«Como si nadie me hubiera pedido ser gracioso por un minuto». Suelta el aire. «No sé qué hacer con eso. Creo que me quedo aquí y lo tengo».`, `«Como se ninguém tivesse me pedido pra ser engraçado por um minuto». Ele solta o ar. «Não sei o que fazer com isso. Acho que só fico aqui e tenho».`), { bond: { fena: 2 } })
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

/* ---- consolidated from story_v34b.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const close = function (id, tx, o, ret) {
    return { text: tx, once: true, do: Object.assign({ soc: 3, care: 1, flag: ['g_' + id + '_open'] }, o || {}), next: ret || null };
  };

  EM.DEEP('teo', {
    tone: 'ask', label: t(`"What's the hardest part of this job?"`, `«¿Qué es lo más difícil de este trabajo?»`, `«Qual é a parte mais difícil desse trabalho?»`), nodes: {
      d1: {
        text: t(`Teo's grin goes somewhere private. "The ones who never come in. The ones who go home alone at six and text nobody. I do their rounds in my head afterwards. I have a whole imaginary ward."`, `La sonrisa de Teo se va a un lugar privado. «Los que nunca entran. Los que se van solos a las seis y no le escriben a nadie. Les hago la ronda en la cabeza después. Tengo una sala imaginaria entera».`, `O sorriso do Teo vai pra um lugar privado. «Os que nunca entram. Os que vão embora sozinhos às seis e não mandam mensagem pra ninguém. Eu faço a ronda deles na cabeça depois. Tenho uma ala imaginária inteira».`),
        choices: [
          K('care', t(`"Who checks on you?"`, `«¿Quién te revisa a ti?»`, `«Quem cuida de você?»`), { next: 'd2' }),
          K('honest', t(`"Thank you for the imaginary ward."`, `«Gracias por la sala imaginaria».`, `«Obrigado pela ala imaginária».`), { next: 'd3' })
        ]
      },
      d2: close('teo', t(`"My sister, on Sundays. She asks 'was it a bad one' and I say 'it was a good one' and we both know the code." He pockets the cuff. "Thanks for asking. That's a worse joke than any of mine."`, `«Mi hermana, los domingos. Me pregunta 'fue una mala' y yo digo 'fue una buena' y los dos sabemos el código». Se guarda el brazalete. «Gracias por preguntar. Es peor chiste que cualquiera de los míos».`, `«Minha irmã, aos domingos. Ela pergunta 'foi uma ruim' e eu digo 'foi uma boa' e nós dois sabemos o código». Ele guarda o manguito. «Obrigado por perguntar. É uma piada pior que qualquer uma das minhas».`)),
      d3: close('teo', t(`"It has forty beds and a very good view." He laughs, then doesn't. "I'll tell them you said so. They don't get many visitors."`, `«Tiene cuarenta camas y muy buena vista». Se ríe, y luego no. «Les diré que lo dijiste. No reciben muchas visitas».`, `«Tem quarenta leitos e uma vista muito boa». Ele ri, e depois não. «Vou contar pra eles que você disse. Eles não recebem muitas visitas».`))
    }
  });
  EM.DEEP('bruce', {
    tone: 'ask', label: t(`"Tell me about the cat on your lanyard."`, `«Cuéntame del gato de tu cordón».`, `«Me fala do gato do seu cordão».`), nodes: {
      d1: {
        text: t(`The giant softens by several degrees. "Pickle. Eleven. When I get home at seven in the morning she sits on my chest and stares. I've decided it's a performance review." A small, private pride. "I pass every time."`, `El gigante se ablanda varios grados. «Pickle. Once años. Cuando llego a casa a las siete de la mañana se sienta en mi pecho y me mira. Decidí que es una evaluación de desempeño». Un orgullo pequeño y privado. «La paso siempre».`, `O gigante amolece vários graus. «Pickle. Onze anos. Quando eu chego em casa às sete da manhã ela senta no meu peito e fica me olhando. Decidi que é uma avaliação de desempenho». Um orgulho pequeno e privado. «Eu passo sempre».`),
        choices: [
          K('care', t(`"What's the job really like?"`, `«¿Cómo es el trabajo de verdad?»`, `«Como é o trabalho de verdade?»`), { next: 'd2' }),
          K('joke', t(`"Does she approve of the club?"`, `«¿Ella aprueba el club?»`, `«Ela aprova o clube?»`), { next: 'd3' })
        ]
      },
      d2: close('bruce', t(`"Mostly I'm a large, calm object." He considers it. "People see me and decide to be calmer. It's the nearest thing to a superpower I own. I try not to waste it."`, `«Casi siempre soy un objeto grande y tranquilo». Lo considera. «La gente me ve y decide estar más tranquila. Es lo más cercano a un superpoder que tengo. Intento no desperdiciarlo».`, `«Na maior parte do tempo eu sou um objeto grande e calmo». Ele considera. «As pessoas me veem e decidem ficar mais calmas. É a coisa mais próxima de um superpoder que eu tenho. Tento não desperdiçar».`)),
      d3: close('bruce', t(`"She's concerned about the volume." His face stays serious. "She thinks the night should end earlier. She's usually right."`, `«Le preocupa el volumen». Su cara sigue seria. «Piensa que la noche debería terminar más temprano. Suele tener razón».`, `«Ela tá preocupada com o volume». O rosto dele continua sério. «Acha que a noite devia acabar mais cedo. Costuma ter razão».`))
    }
  });
  EM.DEEP('beatriz', {
    tone: 'ask', label: t(`"What does it take to run a night like this?"`, `«¿Qué hace falta para llevar una noche así?»`, `«O que é preciso pra tocar uma noite assim?»`), nodes: {
      d1: {
        text: t(`The clipboard lowers a little further. "Forty people who can't all be heroes at the same time. My job is to make sure at least one of them is, at every minute. If I do it right, nothing happens, and nobody has any idea I exist."`, `La carpeta baja un poco más. «Cuarenta personas que no pueden ser héroes todas a la vez. Mi trabajo es que al menos una lo sea, cada minuto. Si lo hago bien, no pasa nada, y nadie sabe que existo».`, `A prancheta desce um pouco mais. «Quarenta pessoas que não podem ser heróis todas ao mesmo tempo. Meu trabalho é garantir que pelo menos uma seja, a cada minuto. Se eu faço direito, nada acontece, e ninguém sabe que eu existo».`),
        choices: [
          K('care', t(`"Does anyone thank the manager?"`, `«¿Alguien le da las gracias a la gerente?»`, `«Alguém agradece a gerente?»`), { next: 'd2' }),
          K('honest', t(`"Nothing happening is the whole art."`, `«Que no pase nada es todo el arte».`, `«Nada acontecer é a arte inteira».`), { next: 'd3' })
        ]
      },
      d2: close('beatriz', t(`"Rosa. Once. Eleven years ago." She does not smile, but something at her jaw gives a little. "I framed it. Don't mention that."`, `«Rosa. Una vez. Hace once años». No sonríe, pero algo en su mandíbula cede un poco. «Lo enmarqué. No lo menciones».`, `«A Rosa. Uma vez. Há onze anos». Ela não sorri, mas algo no maxilar cede um pouco. «Emoldurei. Não comenta».`)),
      d3: close('beatriz', t(`"Put that on my gravestone." She makes a small mark on the clipboard, which might be your name. "Go on. Be good. Be quiet."`, `«Pon eso en mi lápida». Hace una marca pequeña en la carpeta, que podría ser tu nombre. «Anda. Pórtate bien. En silencio».`, `«Põe isso na minha lápide». Ela faz uma marquinha na prancheta, que pode ser o seu nome. «Vai. Se comporta. Em silêncio».`))
    }
  });
  EM.DEEP('hazel', {
    tone: 'ask', label: t(`"What do you love about it, really?"`, `«¿Qué amas de esto, de verdad?»`, `«O que você ama nisso, de verdade?»`), nodes: {
      d1: {
        text: t(`The foot keeps the beat; the arms uncross by degrees. "That it doesn't promise anything. Melody says it's all going to be fine. This says: here's a floor, and here are some hours."`, `El pie sigue el pulso; los brazos se descruzan de a poco. «Que no promete nada. La melodía dice que todo va a estar bien. Esto dice: aquí hay un piso, y aquí hay unas horas».`, `O pé segue a batida; os braços se descruzam aos poucos. «Que não promete nada. A melodia diz que vai ficar tudo bem. Isso diz: aqui tem um chão, e aqui tem umas horas».`),
        choices: [
          K('honest', t(`"Sometimes I want the promise."`, `«A veces quiero la promesa».`, `«Às vezes eu quero a promessa».`), { next: 'd2' }),
          K('joke', t(`"You stayed till six at an Æ000.X. That's a promise."`, `«Te quedaste hasta las seis en un Æ000.X. Eso es una promesa».`, `«Você ficou até as seis num Æ000.X. Isso é uma promessa».`), { next: 'd3' })
        ]
      },
      d2: close('hazel', t(`"Sure. So do I. Four in the morning, a Tuesday, alone." She nods once. "This room is for the other times. Come back when you want the other thing."`, `«Claro. Yo también. Cuatro de la mañana, un martes, sola». Asiente una vez. «Esta sala es para las otras veces. Vuelve cuando quieras lo otro».`, `«Claro. Eu também. Quatro da manhã, uma terça, sozinha». Ela assente uma vez. «Essa sala é pras outras vezes. Volta quando quiser a outra coisa».`)),
      d3: close('hazel', t(`"Don't." The corner of her mouth goes. "I'll start enjoying forms." A beat. "Next time I'll bring water to the booth. Don't tell anyone."`, `«No». Se le escapa la comisura de la boca. «Voy a empezar a disfrutar los formularios». Una pausa. «La próxima llevo agua a la cabina. No le digas a nadie».`, `«Não». O canto da boca escapa. «Vou começar a curtir formulário». Uma pausa. «Da próxima eu levo água pra cabine. Não conta pra ninguém».`))
    }
  });
  EM.DEEP('frames', {
    from: 'meet', tone: 'ask', label: t(`"What's it like carrying the crate for somebody else's set?"`, `«¿Cómo es cargar el cajón del set de otro?»`, `«Como é carregar a caixa do set de outra pessoa?»`), nodes: {
      d1: {
        text: t(`FRAMES takes a moment with it. "It's the best seat in the building. Everyone sees the DJ. I see everything the DJ is made of." A hand rests on the crate. "ÆRIEL pretends not to need me. I pretend not to know."`, `FRAMES se toma un momento con eso. «Es el mejor asiento del edificio. Todos ven al DJ. Yo veo todo de lo que está hecho el DJ». Una mano descansa sobre el cajón. «ÆRIEL finge no necesitarme. Yo finjo no saberlo».`, `O FRAMES leva um momento com isso. «É o melhor assento do prédio. Todo mundo vê o DJ. Eu vejo tudo de que o DJ é feito». Uma mão repousa na caixa. «O ÆRIEL finge não precisar de mim. Eu finjo não saber».`),
        choices: [
          K('care', t(`"How long have you been doing that?"`, `«¿Hace cuánto que hacen eso?»`, `«Faz quanto tempo que vocês fazem isso?»`), { next: 'd2' }),
          K('honest', t(`"It sounds like a good partnership."`, `«Suena a una buena sociedad».`, `«Parece uma boa parceria».`), { next: 'd3' })
        ]
      },
      d2: close('frames', t(`"Nine years. It's the longest relationship I've ever kept, and neither of us has used the word." A small, rueful smile. "Don't tell them I said so."`, `«Nueve años. Es la relación más larga que he mantenido, y ninguno de los dos ha usado la palabra». Una sonrisa pequeña y resignada. «No les digas que lo dije».`, `«Nove anos. É a relação mais longa que eu já mantive, e nenhum dos dois usou a palavra». Um sorriso pequeno e resignado. «Não conta pra eles que eu falei».`), null, 'meet'),
      d3: close('frames', t(`"It is, mostly." He taps the sticker. "It would be better if one of us said it aloud. I think we both know which of us won't."`, `«Lo es, casi siempre». Golpea el sticker. «Sería mejor si uno de los dos lo dijera en voz alta. Creo que los dos sabemos cuál no lo hará».`, `«É, na maior parte». Ele bate no adesivo. «Seria melhor se um dos dois dissesse em voz alta. Acho que a gente sabe qual dos dois não vai».`), null, 'meet')
    }
  });
  EM.DEEP('luca', {
    tone: 'ask', label: t(`"What's chapter four of your dread?"`, `«¿De qué trata el capítulo cuatro de tu pavor?»`, `«Qual é o capítulo quatro do seu pavor?»`), nodes: {
      d1: {
        text: t(`Luca stops handing out tickets. "Chapter four: I'm thirty-six and I hang coats. Everyone I went to school with runs something. I run the one corner of the city where nobody loses anything." He holds up a jacket, then lowers it. "It's both a joke and not one."`, `Luca deja de repartir fichas. «Capítulo cuatro: tengo treinta y seis años y cuelgo abrigos. Todos con los que fui a la escuela dirigen algo. Yo dirijo la única esquina de la ciudad donde nadie pierde nada». Levanta una chaqueta y la baja. «Es una broma y no lo es».`, `O Luca para de entregar fichas. «Capítulo quatro: tenho trinta e seis anos e penduro casaco. Todo mundo com quem eu estudei dirige alguma coisa. Eu dirijo o único canto da cidade onde ninguém perde nada». Ele levanta uma jaqueta e abaixa. «É uma piada e não é».`),
        choices: [
          K('care', t(`"That's a big job."`, `«Es un trabajo grande».`, `«É um trabalho grande».`), { next: 'd2' }),
          K('honest', t(`"Is it the dread, or the job?"`, `«¿Es el pavor, o el trabajo?»`, `«É o pavor ou o trabalho?»`), { next: 'd3' })
        ]
      },
      d2: close('luca', t(`"It's the only thing I've ever kept intact." He says it plainly. "I'd like that on a business card. 'Luca. Nothing lost.'"`, `«Es lo único que he mantenido intacto». Lo dice con sencillez. «Me gustaría eso en una tarjeta. 'Luca. Nada perdido'».`, `«É a única coisa que eu já mantive intacta». Ele diz com simplicidade. «Queria isso num cartão. 'Luca. Nada perdido'».`)),
      d3: close('luca', t(`"Both. The job is the cure." He rolls a ticket between his fingers. "I'll put that in the letter. If anyone reads it."`, `«Los dos. El trabajo es la cura». Hace rodar una ficha entre los dedos. «Lo pondré en la carta. Si alguien la lee».`, `«Os dois. O trabalho é a cura». Ele gira uma ficha entre os dedos. «Vou pôr isso na carta. Se alguém ler».`))
    }
  });
  EM.DEEP('dario', {
    from: 'a', tone: 'ask', label: t(`"Why do you hold this door?"`, `«¿Por qué cuidas esta puerta?»`, `«Por que você cuida dessa porta?»`), nodes: {
      d1: {
        text: t(`Dario looks at the dark behind him for a while. "Because I was in a room once where nobody did. It took me years to trust a space again. I'd like to be the reason somebody doesn't need years."`, `Dario mira un rato la oscuridad a su espalda. «Porque estuve en una sala donde nadie lo hacía. Me tomó años volver a confiar en un espacio. Quisiera ser la razón por la que alguien no necesite años».`, `O Dario olha por um tempo o escuro atrás dele. «Porque eu já estive numa sala onde ninguém fazia. Levei anos pra confiar num espaço de novo. Queria ser o motivo de alguém não precisar de anos».`),
        choices: [
          K('care', t(`"You are, for everyone who walks out smiling."`, `«Lo eres, para todos los que salen sonriendo».`, `«Você é, pra todo mundo que sai sorrindo».`), { next: 'd2' }),
          K('honest', t(`"What did the room teach you?"`, `«¿Qué te enseñó la sala?»`, `«O que a sala te ensinou?»`), { next: 'd3' })
        ]
      },
      d2: close('dario', t(`"Some." He nods, slowly. "And some walk out and I never find out. That's the job too. You do it without a report."`, `«Algunos». Asiente despacio. «Y algunos salen y nunca lo sé. Eso también es el trabajo. Lo haces sin informe».`, `«Alguns». Ele assente devagar. «E alguns saem e eu nunca fico sabendo. Isso também é o trabalho. Você faz sem relatório».`)),
      d3: close('dario', t(`"That asking isn't the opposite of wanting. It's the part that makes wanting safe to have." He steps aside a little. "I say it every night. It still lands."`, `«Que preguntar no es lo contrario de querer. Es la parte que hace seguro tenerlo». Se aparta un poco. «Lo digo cada noche. Todavía me llega».`, `«Que perguntar não é o contrário de querer. É a parte que torna seguro ter». Ele se afasta um pouco. «Eu digo toda noite. Ainda me atinge».`))
    }
  });
  EM.DEEP('newbie', {
    tone: 'ask', label: t(`"What were you hoping to find in here?"`, `«¿Qué esperabas encontrar aquí?»`, `«O que você esperava encontrar aqui?»`), nodes: {
      d1: {
        text: t(`The sleeves tug down a little. "Permission, I think. To be loud. To be sloppy. To be useless for six hours. I run a team of nineteen. I haven't been bad at anything in years."`, `Las mangas se estiran un poco. «Permiso, creo. Para ser ruidoso. Para ser torpe. Para ser inútil seis horas. Dirijo un equipo de diecinueve. Hace años que no soy malo en nada».`, `As mangas se esticam um pouco. «Permissão, acho. Pra ser barulhento. Pra ser desajeitado. Pra ser inútil por seis horas. Eu lidero um time de dezenove. Faz anos que não sou ruim em nada».`),
        choices: [
          K('care', t(`"Be bad at dancing. It's the best place for it."`, `«Sé malo bailando. Este es el mejor lugar».`, `«Seja ruim dançando. Esse é o melhor lugar».`), { next: 'd2' }),
          K('ask', t(`"What would you do if no one was watching?"`, `«¿Qué harías si nadie estuviera mirando?»`, `«O que você faria se ninguém tivesse olhando?»`), { next: 'd3' })
        ]
      },
      d2: close('newbie', t(`A startled laugh. "Okay. Okay. I'll start with the arms." The sleeves come down a little more. "Thank you. Nobody's given me an assignment that wasn't a deadline in years."`, `Una risa sorprendida. «Bueno. Bueno. Empiezo por los brazos». Las mangas se bajan un poco más. «Gracias. Hace años que nadie me da una tarea que no sea una fecha límite».`, `Uma risada surpresa. «Tá. Tá. Começo pelos braços». As mangas descem um pouco mais. «Obrigado. Faz anos que ninguém me dá uma tarefa que não seja um prazo».`)),
      d3: close('newbie', t(`They think about it honestly. "Hum. Stand in the middle of the floor and do exactly what my body wants for three minutes. Probably bad. Probably wonderful." A breath. "Okay. Three minutes. Watch my bag?"`, `Lo piensan con honestidad. «Mmm. Pararme en el medio de la pista y hacer exactamente lo que mi cuerpo quiera durante tres minutos. Probablemente malo. Probablemente maravilloso». Un respiro. «Bueno. Tres minutos. ¿Me cuidas la mochila?»`, `Eles pensam com honestidade. «Hum. Ficar no meio da pista e fazer exatamente o que meu corpo quiser por três minutos. Provavelmente ruim. Provavelmente maravilhoso». Um respiro. «Tá. Três minutos. Cuida da minha mochila?»`))
    }
  });
  EM.DEEP('mateo', {
    tone: 'ask', label: t(`"How are you, honestly?"`, `«¿Cómo estás, de verdad?»`, `«Como você tá, de verdade?»`), nodes: {
      d1: {
        text: t(`Mateo's open hands do not move. "Ashamed. I made a mess two years ago and I've been trying to say it without asking him to carry it. I don't know how."`, `Las manos abiertas de Mateo no se mueven. «Avergonzado. Hice un desastre hace dos años y he intentado decirlo sin pedirle que lo cargue. No sé cómo».`, `As mãos abertas do Mateo não se mexem. «Envergonhado. Fiz uma bagunça faz dois anos e tenho tentado dizer sem pedir pra ele carregar. Não sei como».`),
        choices: [
          K('honest', t(`"Say it once. Ask for nothing. Let him answer."`, `«Dilo una vez. No pidas nada. Que él responda».`, `«Diga uma vez. Não peça nada. Deixa ele responder».`), { next: 'd2' }),
          K('care', t(`"Then tell him that. Not 'hi'."`, `«Entonces díselo así. No 'hola'».`, `«Então fala isso. Não 'oi'».`), { next: 'd3' })
        ]
      },
      d2: close('mateo', t(`"Once. No ask." He nods, several times, more to himself. "I can do that. I think I can."`, `«Una vez. Sin pedir». Asiente varias veces, más para sí. «Eso puedo. Creo que puedo».`, `«Uma vez. Sem pedir». Ele assente várias vezes, mais pra si. «Isso eu consigo. Acho que consigo».`)),
      d3: close('mateo', t(`"'I'm sorry for the mess I made, and I don't need anything back.'" He tests it aloud. "That's shorter than I thought it would be."`, `«'Siento el desastre que hice, y no necesito nada a cambio'». Lo prueba en voz alta. «Es más corto de lo que pensaba».`, `«'Sinto muito a bagunça que eu fiz, e não preciso de nada em troca'». Ele testa em voz alta. «É mais curto do que eu pensava».`))
    }
  });
  EM.DEEP('birthday', {
    tone: 'ask', label: t(`"How's thirty going?"`, `«¿Cómo va lo de treinta?»`, `«Como tá sendo os trinta?»`), nodes: {
      d1: {
        text: t(`Clara adjusts the paper crown and her face drops its party shape for a moment. "Terrifying. Everyone said it would be a clean slate. I'm exactly as messy and I have a hat."`, `Clara se acomoda la corona de papel y su cara suelta por un momento la forma de fiesta. «Aterrador. Todos decían que sería empezar de cero. Sigo igual de desordenada y tengo un sombrero».`, `A Clara ajeita a coroa de papel e o rosto dela solta por um momento a forma de festa. «Aterrorizante. Todo mundo dizia que ia ser começar do zero. Continuo igualmente bagunçada e tenho um chapéu».`),
        choices: [
          K('care', t(`"Messy with a crown is a good combination."`, `«Desordenada con corona es una buena combinación».`, `«Bagunçada com coroa é uma boa combinação».`), { next: 'd2' }),
          K('honest', t(`"What do you want from the next ten years?"`, `«¿Qué quieres de los próximos diez años?»`, `«O que você quer dos próximos dez anos?»`), { next: 'd3' })
        ]
      },
      d2: close('birthday', t(`She laughs properly, head back. "Put that on my card. 'Messy, crowned.'" The shots return; she waves them off for one more second to look at you. "Thank you for not saying it gets easier."`, `Se ríe de verdad, con la cabeza hacia atrás. «Ponlo en mi tarjeta. 'Desordenada, coronada'». Vuelven los tragos; ella los despide un segundo más para mirarte. «Gracias por no decir que se vuelve más fácil».`, `Ela ri de verdade, de cabeça pra trás. «Põe no meu cartão. 'Bagunçada, coroada'». Os shots voltam; ela dispensa por mais um segundo pra te olhar. «Obrigada por não dizer que fica mais fácil».`)),
      d3: close('birthday', t(`She actually thinks. "Less performing. More dinner with the same four people." The crown slips over one eye. "That's it. That's my whole list. Why is that so hard to say out loud?"`, `Piensa de verdad. «Menos actuar. Más cenas con las mismas cuatro personas». La corona se le desliza sobre un ojo. «Eso es todo. Esa es toda mi lista. ¿Por qué cuesta tanto decirlo en voz alta?»`, `Ela pensa de verdade. «Menos performar. Mais jantar com as mesmas quatro pessoas». A coroa escorrega sobre um olho. «É isso. Essa é a minha lista toda. Por que é tão difícil dizer isso em voz alta?»`))
    }
  });
  EM.DEEP('rico', {
    tone: 'ask', label: t(`"Do you ever worry about what you sell?"`, `«¿Te preocupa lo que vendes?»`, `«Você se preocupa com o que vende?»`), nodes: {
      d1: {
        text: t(`The smile that never read a manual slips. "Every night after one I tell myself I'll stop. Every night I tell myself twice." He adjusts the beanie. "I need the rent. I tell myself I'm careful. I don't test."`, `La sonrisa que nunca leyó un manual se corre. «Cada noche después de la una me digo que voy a parar. Cada noche me lo digo dos veces». Se acomoda el gorro. «Necesito la renta. Me digo que soy cuidadoso. No testeo».`, `O sorriso que nunca leu um manual escorrega. «Toda noite depois da uma eu me digo que vou parar. Toda noite eu digo duas vezes». Ele ajeita o gorro. «Preciso do aluguel. Digo pra mim que sou cuidadoso. Não testo».`),
        choices: [
          K('care', t(`"Isi's table is free. Start there."`, `«La mesa de Isi es gratis. Empieza ahí».`, `«A mesa da Isi é de graça. Começa por lá».`), { next: 'd2' }),
          K('honest', t(`"What would you do instead?"`, `«¿Qué harías en su lugar?»`, `«O que você faria no lugar?»`), { next: 'd3' })
        ]
      },
      d2: close('rico', t(`"…Yeah. Okay. Maybe tomorrow." He looks past you at the quiet room, then back. "That's the first time anyone's said it like it was possible."`, `«…Sí. Bueno. Tal vez mañana». Mira más allá de ti hacia la sala tranquila, y vuelve. «Es la primera vez que alguien lo dice como si fuera posible».`, `«…É. Tá. Talvez amanhã». Ele olha além de você pra sala calma, e volta. «É a primeira vez que alguém fala isso como algo possível».`)),
      d3: close('rico', t(`"Cook. I did, for a while." The grin comes back, smaller. "I'm a good cook. I just never made enough to pay for the knives."`, `«Cocinar. Lo hice un tiempo». La sonrisa vuelve, más chica. «Soy buen cocinero. Nunca gané lo suficiente para pagar los cuchillos».`, `«Cozinhar. Fiz por um tempo». O sorriso volta, menor. «Sou bom cozinheiro. Só nunca ganhei o bastante pra pagar as facas».`))
    }
  });
  /* the host (Mika): a conversation that returns to the stall decision */
  EM.DEEP('host', {
    from: 'a', tone: 'ask', label: t(`"How long have you done the door?"`, `«¿Hace cuánto cuidas la puerta?»`, `«Faz quanto tempo que você cuida da porta?»`), nodes: {
      d1: {
        text: t(`MIKA looks up for the second time tonight. "Eleven years of stalls. You learn who people are by how they treat a rule at three in the morning. The ones who argue are fine. The ones who go quiet worry me."`, `MIKA levanta la vista por segunda vez esta noche. «Once años de baños. Aprendes quiénes son las personas por cómo tratan una regla a las tres de la mañana. Los que discuten están bien. Los que se quedan callados me preocupan».`, `O MIKA levanta o olhar pela segunda vez nessa noite. «Onze anos de banheiro. Você aprende quem as pessoas são pelo jeito que elas tratam uma regra às três da manhã. Quem discute tá bem. Quem fica quieto me preocupa».`),
        choices: [
          K('ask', t(`"Which kind am I?"`, `«¿Qué tipo soy yo?»`, `«Que tipo eu sou?»`), { next: 'd2' })
        ]
      },
      d2: close('host', t(`"You asked." He lowers the clipboard half an inch. "That's the third kind. Rare." A pause. "The rule stands. I'm not unkind, I'm just unmovable. Go on, say what you came to say."`, `«Preguntaste». Baja la carpeta un par de centímetros. «Ese es el tercer tipo. Raro». Una pausa. «La regla se mantiene. No soy cruel, solo inamovible. Anda, di a lo que viniste».`, `«Você perguntou». Ele abaixa a prancheta dois centímetros. «Esse é o terceiro tipo. Raro». Uma pausa. «A regra continua. Eu não sou cruel, só inamovível. Vai, fala o que você veio falar».`), null, 'a')
    }
  });
})();

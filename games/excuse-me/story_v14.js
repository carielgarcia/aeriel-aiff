/* EXCUSE ME — story v14: the entourage is Maru, Benjamin and Fernando/Feña.
   Feña gets very excited at the dark room and half the time stays there (he only kisses men; he is in a threesome with two guys,
   implied). Benjamin is very social: 25% per hour he goes on his own adventure and comes back two hours later as a capybara. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const BUSY = ['q2', 'q3', 'q4', 'q5', 'q7', 'q8', 'q8d', 'q10', 'q11', 'q12', 'q9'];
  const busy = function (s) { return BUSY.some(function (q) { return s.quests[q] === 'active'; }); };

  /* the entourage is three people (Maru, Benjamin, Fernando/Feña); Vale and Alex were cut. */
  story.barks.tato = story.barks.tato.concat([
    t(`TATO: "Is it me or is the dark room calling my name? It's me. It's me calling."`, `TATO: «¿Soy yo o el cuarto oscuro me está llamando? Soy yo. Yo lo estoy llamando».`, `TATO: «Sou eu ou a dark room tá me chamando? Sou eu. Eu que tô chamando».`)
  ]);


  /* the dark room has its own spot for a friend who stays: away from the regulars */
  EM.zones.darkroom.friendAt.darkroom = { x: 7, y: 9 };

  /* ============================================================ FEÑA AND THE DARK ROOM */
  /* he gets very excited; half the time he stays behind. He only kisses men, and he is not alone in there. */
  const enter0 = story.enter;
  story.enter = function (zone) {
    enter0(zone);
    const s = EM.state;
    if (zone !== 'darkroom' || !s || s.party.indexOf('tato') === -1 || s.flags.tato_dark_seen || s.flags.friends_stick) return;
    s.flags.tato_dark_seen = true;
    const stays = Math.random() < 0.5;
    U.toast({ icon: 'heart', kind: 'good', ms: 6500, text: t(`TATO, vibrating: "Oh. OH. This is the room. I've been told about this room. Excuse me, I'll be… around."`, `TATO, vibrando: «Oh. OH. Este es el cuarto. Me hablaron de este cuarto. Con permiso, voy a estar… por ahí».`, `TATO, vibrando: «Ah. AH. É essa a sala. Falaram dessa sala. Com licença, eu vou estar… por aí».`) });
    if (stays) {
      s.flags.tato_dark_stay = true; s.tatoBack = s.time + 75;
      L.leave('tato', 'darkroom');
      U.toast({ icon: 'eyes', kind: 'info', ms: 6500, text: t(`Tato waves goodbye with both hands and walks into the dark. Find him later, or let him find you.`, `Tato se despide con las dos manos y camina hacia la oscuridad. Búscalo después, o deja que él te encuentre.`, `O Tato acena com as duas mãos e entra no escuro. Procure ele depois, ou deixe que ele te ache.`) });
    } else {
      U.toast({ icon: 'heart', kind: 'info', ms: 5000, text: t(`Tato stays at your elbow, glowing, with the face of a man deciding which of three desserts to eat.`, `Tato se queda a tu lado, radiante, con cara de quien decide cuál de tres postres se va a comer.`, `O Tato fica do seu lado, radiante, com cara de quem decide qual de três sobremesas vai comer.`) });
    }
  };
  D.found_tato_darkroom = {
    who: 'tato', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GENTE'), start: 'a', nodes: {
      a: {
        text: [
          t(`You find Tato by the sound of his laugh. He is on the big mattress between two guys, the three of them tangled with great concentration and great manners. Hands in the dark. Someone is asking permission, someone is giving it. (The room keeps the rest.)`, `Encuentras a Tato por el sonido de su risa. Está en el colchón grande entre dos tipos, los tres enredados con mucha concentración y muy buenos modales. Manos en la oscuridad. Alguien pide permiso, alguien lo da. (El cuarto se queda con el resto.)`, `Você acha o Tato pelo som da risada dele. Ele está no colchão grande entre dois caras, os três enrolados com muita concentração e ótimos modos. Mãos no escuro. Alguém pede permissão, alguém dá. (O quarto guarda o resto.)`),
          t(`He sees you and lifts one finger from the pile: a perfect, tiny, radiant "give me a minute". One of the guys whispers "is this your friend?" and Tato whispers back, with deep pride: "this is my person."`, `Te ve y levanta un dedo de entre el montón: un perfecto, minúsculo y radiante «dame un minuto». Uno de los chicos susurra «¿es tu amigo?» y Tato le responde susurrando, con profundo orgullo: «es mi persona».`, `Ele te vê e levanta um dedo do bolo: um perfeito, minúsculo e radiante «me dá um minuto». Um dos caras sussurra «é seu amigo?» e o Tato responde sussurrando, com muito orgulho: «é minha pessoa».`)
        ],
        choices: [
          K('chill', t(`Give him a thumbs-up and leave him to it.`, `Hacerle un pulgar arriba y dejarlo.`, `Dar um joinha e deixar ele em paz.`), { do: { fun: 3, soc: 2, flag: 'tato_dark_left', bond: { tato: 1 } }, next: null, react: t(`You back out of the dark. He'll find you.`, `Sales de la oscuridad retrocediendo. Él te encontrará.`, `Você sai do escuro de costas. Ele te encontra.`) }),
          K('care', t(`Wait nearby until he's done, then walk out together.`, `Esperar cerca hasta que termine y salir juntos.`, `Esperar por perto até ele terminar e sair junto.`), { do: { time: 25, hp: 4, soc: 3, join: 'tato', bond: { tato: 2 }, flag: 'tato_dark_wait' }, next: null, react: t(`Twenty-five minutes later he comes out glowing, shirt on backwards, holding two phone numbers. "Thank you for waiting," he says. "You're the best person I know."`, `Veinticinco minutos después sale radiante, con la camisa al revés, sosteniendo dos números de teléfono. «Gracias por esperar», dice. «Eres la mejor persona que conozco».`, `Vinte e cinco minutos depois ele sai radiante, com a camisa do avesso, segurando dois números de telefone. «Obrigado por esperar», diz. «Você é a melhor pessoa que eu conheço».`) }),
          K('blunt', t(`Tap his shoulder. "The group's leaving."`, `Tocarle el hombro. «El grupo se va».`, `Tocar no ombro dele. «O grupo tá indo embora».`), { do: { join: 'tato', soc: -1, fun: -1, bond: { tato: -1 } }, next: null, react: t(`He sighs with the whole of his body. "Okay. Yes. Fair." He kisses each guy on the cheek, formally, and follows you out, a little sad and extremely well.`, `Suspira con todo el cuerpo. «Bueno. Sí. Justo». Besa a cada chico en la mejilla, formalmente, y te sigue afuera, un poco triste y extremadamente bien.`, `Ele suspira com o corpo inteiro. «Tá. Sim. Justo». Beija cada cara na bochecha, formalmente, e te segue pra fora, um pouco triste e extremamente bem.`) })
        ]
      }
    }
  };
  /* if you do not come for him, he finds you after a while */
  const minute1 = L.minute;
  L.minute = function () {
    minute1();
    const s = EM.state; if (!s || s.ended) return;
    if (s.flags.tato_dark_stay && s.away.tato === 'darkroom' && s.party.indexOf('tato') === -1 && s.tatoBack && s.time >= s.tatoBack && !s.flags.tato_dark_back) {
      s.flags.tato_dark_back = true;
      L.join('tato'); L.apply({ fun: 4, soc: 2 });
      U.toast({ icon: 'heart', kind: 'good', ms: 7000, text: t(`Tato finds you in the crowd, glowing, shirt buttoned one hole off, a stranger's lipstick on his collar. "Okay. I'm back. I'm so happy. Do not ask me anything for ten minutes. Then ask me everything."`, `Tato te encuentra entre la gente, radiante, con la camisa abotonada un ojal corrido y el labial de un desconocido en el cuello. «Bueno. Ya volví. Estoy muy feliz. No me preguntes nada por diez minutos. Luego pregúntame todo».`, `O Tato te acha na multidão, radiante, com a camisa abotoada uma casa fora e o batom de um desconhecido na gola. «Tá. Voltei. Tô muito feliz. Não me pergunta nada por dez minutos. Depois me pergunta tudo».`) });
    }
  };

  /* ============================================================ BENJAMIN, THE CAPYBARA */
  /* only rooms you can walk into right now: never the roof (closed until the closing set), the attic only once SALA 2 is open */
  const wanderZones = function (s) { return s.time >= 180 ? ['main', 'courtyard', 'attic', 'tunnel'] : ['main', 'courtyard', 'tunnel']; };
  const minute2 = L.minute;
  L.minute = function () {
    minute2();
    const s = EM.state; if (!s || s.ended) return;
    const hour = Math.floor(s.time / 60);
    /* once an hour, a 25% chance he drifts off to meet people */
    if (hour > (s.benjiHour || 0)) {
      s.benjiHour = hour;
      if (s.party.indexOf('dani') !== -1 && !s.flags.benji_out && !busy(s) && !s.flags.friends_stick && !s.away.dani && Math.random() < 0.25) {
        const zs = wanderZones(s), z = zs[Math.floor(Math.random() * zs.length)];
        s.flags.benji_out = true; s.benjiBack = s.time + 120; s.benjiZone = z;
        L.leave('dani', z);
        U.toast({ icon: 'heart', kind: 'info', ms: 7000, text: t(`Dani spots a stranger with a good hat across the room, says "BRB, I'm going to meet everyone," and is gone. He will be back in a couple of hours. (He will.)`, `Dani ve a un desconocido con un buen sombrero al otro lado del cuarto, dice «ya vengo, voy a conocer a todos» y desaparece. Volverá en un par de horas. (Volverá).`, `O Dani vê um desconhecido com um bom chapéu do outro lado da sala, diz «já volto, vou conhecer todo mundo» e some. Ele volta em umas duas horas. (Ele volta.)`) });
      }
    }
    /* two hours later he comes back on his own with the story (once nothing else is going on) */
    if (s.flags.benji_out && s.time >= (s.benjiBack || 0) && !U.D && U.mode !== 'dialog') {
      L.join('dani');
      U.startDialogue('benji_story', { npc: 'dani' });
    }
  };
  /* finding him early gets you the same story */
  const fd0 = story.friendDialogue;
  story.friendDialogue = function (id, s) {
    if (id === 'dani' && s.flags.benji_out) return 'benji_story';
    return fd0(id, s);
  };
  const GUESTS = [
    t(`a bouncer's cousin, a vegan DJ with no records, two tourists who thought this was a museum`, `el primo de un guardia, un DJ vegano sin discos, dos turistas que creían que esto era un museo`, `o primo de um segurança, uma DJ vegana sem discos, dois turistas que achavam que isso era um museu`),
    t(`a woman who sells lemons, a retired judge named Hector, and a serious teenager with a tote bag`, `una mujer que vende limones, un juez jubilado llamado Héctor y un adolescente muy serio con un tote bag`, `uma mulher que vende limões, um juiz aposentado chamado Hector e um adolescente sério com uma ecobag`),
    t(`three nurses on their night off, a man who's building a sound system out of a fridge, and a dog (not allowed, but present)`, `tres enfermeras en su noche libre, un hombre que construye un equipo de sonido con un refrigerador y un perro (no permitido, pero presente)`, `três enfermeiras de folga, um homem que tá montando um sistema de som com uma geladeira e um cachorro (não pode, mas tava lá)`)
  ];
  D.benji_story = {
    who: 'dani', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GENTE'), forced: true, start: 'a', nodes: {
      a: {
        text: function (s) {
          const g = GUESTS[Math.floor(EM.hash2((s.seed || 1) + (s.attempt || 1), Math.floor(s.time / 60), 41) * GUESTS.length) % GUESTS.length];
          return [
            t(`Dani strolls in, glowing. "You will not BELIEVE the last two hours. I met ${EM.tr(g)}. I got a phone number I don't remember being offered. Someone gave me a sandwich. I have no idea whose."`, `Dani entra caminando, radiante. «No VAS a creer las últimas dos horas. Conocí a ${EM.tr(g)}. Tengo un número de teléfono que no recuerdo que me ofrecieran. Alguien me dio un sándwich. No tengo idea de quién».`, `O Dani entra andando, radiante. «Você não vai ACREDITAR nessas últimas duas horas. Conheci ${EM.tr(g)}. Peguei um número de telefone que não lembro de ter sido oferecido. Alguém me deu um sanduíche. Não faço ideia de quem».`),
            t(`"And here's the thing. At some point I told them I'm a capybara. A capybara, you know? The animal. I'm calm, I'm warm, I get along with everybody, even the crocodile. And they said 'obviously'. Nobody questioned it. A man moved his chair so I could sit. I think I'm a capybara. I think I always was."`, `«Y aquí viene lo mejor. En algún momento les dije que soy un capibara. Un capibara, ¿sabes? El animal. Soy tranquilo, soy cálido, me llevo bien con todos, hasta con el cocodrilo. Y dijeron “obvio”. Nadie lo cuestionó. Un señor movió su silla para que me sentara. Creo que soy un capibara. Creo que siempre lo fui».`, `«E o melhor: em algum momento eu disse pra eles que sou uma capivara. Uma capivara, sabe? O bicho. Sou calmo, sou quente, me dou bem com todo mundo, até com o jacaré. E eles falaram "óbvio". Ninguém questionou. Um senhor arrastou a cadeira pra eu sentar. Acho que sou uma capivara. Acho que sempre fui.»`)
          ];
        },
        do: { join: 'dani', unflag: 'benji_out', fun: 4, soc: 6, flag: 'benji_capybara' },
        choices: [
          K('joke', t(`"A capybara. Obviously. How could we not see it."`, `«Un capibara. Obvio. Cómo no lo vimos».`, `«Uma capivara. Óbvio. Como a gente não viu».`), { do: { fun: 4, bond: { dani: 2 } }, next: null, react: t(`Dani tears up a little. "Thank you. That means a lot. I'm going to go stand in water now. Metaphorically."`, `A Dani se le humedecen los ojos. «Gracias. Significa mucho. Voy a pararme en agua ahora. Metafóricamente».`, `O Dani se emociona um pouco. «Valeu. Significa muito. Vou ficar em pé na água agora. Metaforicamente».`) }),
          K('care', t(`"Did you drink water? Real water, not a metaphor."`, `«¿Tomaste agua? Agua de verdad, no metafórica».`, `«Você bebeu água? Água de verdade, não metafórica».`), { do: { hp: 3, care: 1, bond: { dani: 1 } }, next: null, react: t(`"I did! Three times. I'm a capybara, we're excellent at water."`, `«¡Sí! Tres veces. Soy un capibara, somos excelentes con el agua».`, `«Bebi! Três vezes. Sou uma capivara, a gente é ótimo com água.»`) }),
          K('ask', t(`"Okay, but who gave you the sandwich?"`, `«Bueno, ¿pero quién te dio el sándwich?»`, `«Beleza, mas quem te deu o sanduíche?»`), { do: { fun: 2, soc: 1 }, next: null, react: t(`"Unclear. It was a good sandwich. I will think about it for the rest of my life."`, `«No está claro. Era un buen sándwich. Voy a pensar en eso por el resto de mi vida».`, `«Não ficou claro. Era um bom sanduíche. Vou pensar nisso pelo resto da vida».`) })
        ]
      }
    }
  };
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'benji_txt', who: 'dani', ok: function (s) { return !!s.flags.benji_capybara; }, t: t(`Update: the man who moved his chair is now my friend and also the man who sold me a hat. I'm wearing the hat. Capybara business is booming. Bring water, bring snacks, bring yourself.`, `Actualización: el señor que movió su silla ahora es mi amigo y también el señor que me vendió un sombrero. Traigo el sombrero puesto. El negocio capibara va en auge. Trae agua, trae botana, trae tu persona.`, `Atualização: o senhor que arrastou a cadeira agora é meu amigo e também o senhor que me vendeu um chapéu. Tô de chapéu. O negócio capivara tá bombando. Traz água, traz lanche, traz você.`) });
    R.push({ id: 'tato_dark', who: 'tato', ok: function (s) { return !!s.flags.tato_dark_stay; }, t: t(`Good morning. I'm having tea with two very nice men, one of whom has a cat named Marx. I'm not saying I'm in love. I'm saying the kettle is boiling and nobody has left.`, `Buenos días. Estoy tomando té con dos hombres muy simpáticos, uno de los cuales tiene un gato llamado Marx. No digo que esté enamorado. Digo que la tetera hierve y nadie se ha ido.`, `Bom dia. Tô tomando chá com dois homens muito simpáticos, um dos quais tem um gato chamado Marx. Não tô dizendo que tô apaixonado. Tô dizendo que a chaleira tá fervendo e ninguém foi embora.`) });
    R.push({ id: 'vale_txt', who: 'vale', ok: function (s) { return s.party.indexOf('vale') !== -1; }, t: t(`Everybody home? I made a list and it checks out. Drink water, eat something that isn't a mint, text me when you wake up. I'm not your mum. I'm just very organised.`, `¿Todos en casa? Hice una lista y cuadra. Tomen agua, coman algo que no sea una menta, escríbanme cuando despierten. No soy su mamá. Solo soy muy organizada.`, `Todo mundo em casa? Fiz uma lista e bateu. Bebam água, comam algo que não seja bala de menta, me escrevam quando acordarem. Não sou a mãe de vocês. Só sou muito organizada.`) });
    R.push({ id: 'alex_txt', who: 'alex', ok: function (s) { return s.party.indexOf('alex') !== -1; }, t: t(`I woke up with glitter on my elbow and a good feeling. I don't know whose glitter. I think it was ours. Same time next weekend? I'll bring the pillar.`, `Desperté con brillantina en el codo y una buena sensación. No sé de quién es la brillantina. Creo que era nuestra. ¿Misma hora el próximo fin de semana? Yo traigo el pilar.`, `Acordei com glitter no cotovelo e uma sensação boa. Não sei de quem é o glitter. Acho que era nosso. Mesma hora no próximo fim de semana? Eu levo o pilar.`) });
  }
})();

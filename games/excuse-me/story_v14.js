/* EXCUSE ME — story v14: a bigger entourage. Vale (a woman) and Alex (non-binary) join Maru, Benjamin and Fernando/Feña.
   Feña gets very excited at the dark room and half the time stays there (he only kisses men; he is in a threesome with two guys,
   implied). Benjamin is very social: 25% per hour he goes on his own adventure and comes back two hours later as a capybara. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const BUSY = ['q2', 'q3', 'q4', 'q5', 'q7', 'q8', 'q9'];
  const busy = function (s) { return BUSY.some(function (q) { return s.quests[q] === 'active'; }); };

  /* ============================================================ VALE AND ALEX: first meeting, intro, barks */
  const meet = D.friends_meet.nodes;
  meet.a.text = [].concat(meet.a.text,
    t(`VALE: "Finally. I've been guarding the group's bag like it's a newborn. Please tell me you brought water, because I brought a plan and nothing else."`, `VALE: «Por fin. He cuidado la bolsa del grupo como a un recién nacido. Dime que trajiste agua, porque yo traje un plan y nada más».`, `VALE: «Finalmente. Eu tava protegendo a bolsa do grupo feito recém-nascido. Me diz que você trouxe água, porque eu trouxe um plano e mais nada».`),
    t(`ALEX: "Hi! I'm so glad it's you. I've been hugging the same pillar for forty minutes. We're very close now. It has opinions."`, `ALEX: «¡Hola! Qué bueno que eres tú. Llevo cuarenta minutos abrazando el mismo pilar. Ya somos muy cercanes. Tiene opiniones».`, `ALEX: «Oi! Que bom que é você. Faz quarenta minutos que eu abraço o mesmo pilar. A gente já tá muito próximes. Ele tem opiniões».`));
  meet.c.text = t(`The five of them fall in behind you like ducklings with eyeliner. Time to get across the main floor to the toilets.`, `Los cinco se ponen detrás de ti como patitos con delineador. Hora de cruzar la pista principal hacia los baños.`, `Os cinco se enfileiram atrás de você como patinhos de delineador. Hora de cruzar a pista principal até os banheiros.`);
  const intro = D.intro.nodes.a, prevText = intro.text;
  const FIVE = t(`Maru, Dani, Tato, Vale and Alex are in there somewhere. Your phone is at 9%. You have one bottle of water and a very good feeling about tonight.`, `Maru, Dani, Tato, Vale y Alex están ahí adentro en algún lugar. Tu teléfono está al 9%. Tienes una botella de agua y un muy buen presentimiento sobre esta noche.`, `Maru, Dani, Tato, Vale e Alex estão lá dentro em algum lugar. Seu celular está com 9%. Você tem uma garrafa de água e um bom pressentimento sobre esta noite.`);
  intro.text = function (s) {
    const a = [].concat(typeof prevText === 'function' ? prevText(s) : prevText);
    return a.map(function (x) { return x && x.en && /Maru, Dani and Tato/.test(x.en) ? FIVE : x; });
  };

  story.barks.vale = [
    t(`VALE: "Hydration check. Everybody. Now. I can see your faces."`, `VALE: «Chequeo de hidratación. Todos. Ahora. Les veo la cara».`, `VALE: «Checagem de hidratação. Todo mundo. Agora. Eu tô vendo a cara de vocês».`),
    t(`VALE: "I know where the exits are. I know where the exits' exits are."`, `VALE: «Sé dónde están las salidas. Y las salidas de las salidas».`, `VALE: «Eu sei onde ficam as saídas. E as saídas das saídas».`),
    t(`VALE: "It's fine. It's a vibe. It's also a fire hazard. Both."`, `VALE: «Está bien. Es un vibe. También es un riesgo de incendio. Ambos».`, `VALE: «Tá tranquilo. É uma vibe. Também é risco de incêndio. Os dois».`),
    t(`VALE: "Whoever's phone is at 4%, come stand next to the charger I smuggled in."`, `VALE: «A quien le quede 4% de batería, que se pare junto al cargador que metí de contrabando».`, `VALE: «Quem tá com 4% de bateria vem ficar do lado do carregador que eu contrabandeei».`)
  ];
  story.barks.alex = [
    t(`ALEX: "Is it weird that I can taste the bass? It tastes purple."`, `ALEX: «¿Es raro que pueda saborear el bajo? Sabe morado».`, `ALEX: «É estranho que eu consiga sentir o gosto do grave? Tem gosto de roxo».`),
    t(`ALEX: "I made a new friend. I don't know their name. We've decided that's the bit."`, `ALEX: «Hice une amigue nueve. No sé cómo se llama. Decidimos que ese es el chiste».`, `ALEX: «Fiz ume amigue nove. Não sei o nome. A gente decidiu que essa é a graça».`),
    t(`ALEX: "I love everyone and I'm also a little bit tired. Both are true. Neither is a problem."`, `ALEX: «Quiero a todo el mundo y también estoy un poquito cansade. Las dos cosas son ciertas. Ninguna es un problema».`, `ALEX: «Eu amo todo mundo e também tô um pouquinho cansade. As duas coisas são verdade. Nenhuma é problema».`),
    t(`ALEX: "Somebody tell the floor it's doing great."`, `ALEX: «Que alguien le diga a la pista que lo está haciendo muy bien».`, `ALEX: «Alguém avisa a pista que ela tá indo muito bem».`)
  ];
  story.barks.tato = story.barks.tato.concat([
    t(`TATO: "Is it me or is the dark room calling my name? It's me. It's me calling."`, `TATO: «¿Soy yo o el cuarto oscuro me está llamando? Soy yo. Yo lo estoy llamando».`, `TATO: «Sou eu ou a dark room tá me chamando? Sou eu. Eu que tô chamando».`)
  ]);

  /* little perks for the two new friends */
  const lastPerk = { vale: 0, alex: 0 };
  const minute0 = L.minute;
  L.minute = function () {
    minute0();
    const s = EM.state; if (!s || s.ended) return;
    if (s.party.indexOf('vale') !== -1 && s.time - lastPerk.vale >= 45 && (s.items.water || 0) < 2) {
      lastPerk.vale = s.time;
      L.apply({ item: { water: 1 }, soc: 1 });
      U.toast({ icon: 'cross', kind: 'good', ms: 5000, text: t(`Vale presses a cold bottle into your hand without looking at you. "Drink. I'm not asking."`, `Vale te pone en la mano una botella fría sin mirarte. «Toma. No es una pregunta».`, `A Vale enfia uma garrafa gelada na sua mão sem olhar pra você. «Bebe. Não tô perguntando».`) });
    }
    if (s.party.indexOf('alex') !== -1 && s.time - lastPerk.alex >= 50 && Math.random() < 0.08) {
      lastPerk.alex = s.time;
      L.apply({ fun: 3, soc: 2 });
      U.toast({ icon: 'heart', kind: 'good', ms: 5000, text: t(`Alex pulls you into a ridiculous slow dance in the middle of a fast song. Nobody minds. Two strangers join the dance.`, `Alex te jala a un baile lento ridículo en medio de una canción rápida. A nadie le importa. Dos desconocidos se unen al baile.`, `Alex te puxa pra uma dança lenta ridícula no meio de uma música rápida. Ninguém liga. Dois desconhecidos entram na dança.`) });
    }
  };

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
      U.toast({ icon: 'eyes', kind: 'info', ms: 6500, text: t(`Tato waves goodbye with both hands and walks into the dark like a man entering a spa. Find him later, or let him find you.`, `Tato se despide con las dos manos y entra a la oscuridad como quien entra a un spa. Búscalo luego, o deja que él te encuentre.`, `O Tato se despede com as duas mãos e entra no escuro feito quem entra num spa. Procure ele depois, ou deixe que ele te ache.`) });
    } else {
      U.toast({ icon: 'heart', kind: 'info', ms: 5000, text: t(`Tato stays at your elbow, glowing, with the face of a man deciding which of three desserts to eat.`, `Tato se queda a tu lado, radiante, con cara de quien decide cuál de tres postres se va a comer.`, `O Tato fica do seu lado, radiante, com cara de quem decide qual de três sobremesas vai comer.`) });
    }
  };
  D.found_tato_darkroom = {
    who: 'tato', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GENTE'), start: 'a', nodes: {
      a: {
        text: [
          t(`You find Tato by the sound of his laugh, which is the laugh of a man who has stopped carrying anything. He is on the big mattress between two guys, the three of them tangled with great concentration and great manners. Hands in the dark. Someone is asking permission, someone is giving it. (The room keeps the rest.)`, `Encuentras a Tato por el sonido de su risa, la risa de alguien que dejó de cargar cosas. Está en el colchón grande entre dos chicos, los tres enredados con gran concentración y excelentes modales. Manos en la oscuridad. Alguien pide permiso, alguien lo da. (El cuarto se guarda el resto).`, `Você acha o Tato pelo som da risada, a risada de quem parou de carregar qualquer coisa. Ele tá no colchão grande entre dois caras, os três embolados com muita concentração e ótimos modos. Mãos no escuro. Alguém pede permissão, alguém dá. (A sala guarda o resto.)`),
          t(`He sees you and lifts one finger from the pile: a perfect, tiny, radiant "give me a minute". One of the guys whispers "is this your friend?" and Tato whispers back, with deep pride: "this is my person."`, `Te ve y levanta un dedo de entre el montón: un perfecto, minúsculo y radiante «dame un minuto». Uno de los chicos susurra «¿es tu amigo?» y Tato le responde susurrando, con profundo orgullo: «es mi persona».`, `Ele te vê e levanta um dedo do bolo: um perfeito, minúsculo e radiante «me dá um minuto». Um dos caras sussurra «é seu amigo?» e o Tato responde sussurrando, com muito orgulho: «é minha pessoa».`)
        ],
        choices: [
          K('chill', t(`Give him a thumbs-up and leave him to it.`, `Hacerle un pulgar arriba y dejarlo.`, `Dar um joinha e deixar ele em paz.`), { do: { fun: 3, soc: 2, flag: 'tato_dark_left', bond: { tato: 1 } }, next: null, react: t(`You back out of the dark with the quiet pride of a person who knows when to leave a room. He'll find you.`, `Sales de la oscuridad con el orgullo callado de quien sabe cuándo dejar un cuarto. Él te va a encontrar.`, `Você sai do escuro com o orgulho quieto de quem sabe a hora de deixar uma sala. Ele vai te achar.`) }),
          K('care', t(`Wait nearby until he's done, then walk out together.`, `Esperar cerca hasta que termine y salir juntos.`, `Esperar por perto até ele terminar e sair junto.`), { do: { time: 25, hp: 4, soc: 3, join: 'tato', bond: { tato: 2 }, flag: 'tato_dark_wait' }, next: null, react: t(`Twenty-five minutes later he comes out glowing, shirt on backwards, holding two phone numbers like a bouquet. "Thank you for waiting," he says. "You're the best person I know."`, `Veinticinco minutos después sale radiante, con la camisa al revés, sosteniendo dos números de teléfono como un ramo. «Gracias por esperar», dice. «Eres la mejor persona que conozco».`, `Vinte e cinco minutos depois ele sai radiante, camiseta do avesso, segurando dois números de telefone feito buquê. «Valeu por esperar», diz. «Você é a melhor pessoa que eu conheço».`) }),
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
  const ZONES = ['main', 'courtyard', 'attic', 'rooftop', 'tunnel'];
  const minute2 = L.minute;
  L.minute = function () {
    minute2();
    const s = EM.state; if (!s || s.ended) return;
    const hour = Math.floor(s.time / 60);
    /* once an hour, a 25% chance he drifts off to meet people */
    if (hour > (s.benjiHour || 0)) {
      s.benjiHour = hour;
      if (s.party.indexOf('dani') !== -1 && !s.flags.benji_out && !busy(s) && !s.flags.friends_stick && !s.away.dani && Math.random() < 0.25) {
        const z = ZONES[Math.floor(Math.random() * ZONES.length)];
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
    t(`a woman who sells lemons, a retired judge named Hector, and a very serious teenager with a tote bag`, `una señora que vende limones, un juez jubilado llamado Héctor y un adolescente muy serio con una tote bag`, `uma mulher que vende limão, um juiz aposentado chamado Hector e um adolescente muito sério com uma ecobag`),
    t(`three nurses on their night off, a man who's building a sound system out of a fridge, and a dog (not allowed, but present)`, `tres enfermeras en su noche libre, un hombre que construye un equipo de sonido con un refrigerador y un perro (no permitido, pero presente)`, `três enfermeiras de folga, um homem que tá montando um sistema de som com uma geladeira e um cachorro (não pode, mas tava lá)`)
  ];
  D.benji_story = {
    who: 'dani', role: t('YOUR PEOPLE', 'TU GENTE', 'SUA GENTE'), forced: true, start: 'a', nodes: {
      a: {
        text: function (s) {
          const g = GUESTS[Math.floor(EM.hash2((s.seed || 1) + (s.attempt || 1), Math.floor(s.time / 60), 41) * GUESTS.length) % GUESTS.length];
          return [
            t(`Dani strolls in like a man returning from a very successful diplomatic mission. "You will not BELIEVE the last two hours. I met ${EM.tr(g)}. I got a phone number I don't remember being offered. Someone gave me a sandwich. I have no idea whose."`, `Dani entra caminando como quien regresa de una misión diplomática muy exitosa. «No vas a CREER las últimas dos horas. Conocí a ${EM.tr(g)}. Me dieron un número que no recuerdo que me ofrecieran. Alguien me dio un sándwich. No sé de quién».`, `O Dani entra passeando feito quem volta de uma missão diplomática muito bem-sucedida. «Você não vai ACREDITAR nas últimas duas horas. Eu conheci ${EM.tr(g)}. Peguei um número que não lembro de ter me oferecido. Alguém me deu um sanduíche. Não faço ideia de quem.»`),
            t(`"And here's the thing. At some point I told them I'm a capybara. A capybara, you know? The animal. I'm calm, I'm warm, I get along with everybody, even the crocodile. And they said 'obviously'. Nobody questioned it. A man moved his chair so I could sit. I think I'm a capybara. I think I always was."`, `«Y aquí viene lo mejor. En algún momento les dije que soy un capibara. Un capibara, ¿sabes? El animal. Soy tranquilo, soy cálido, me llevo bien con todos, hasta con el cocodrilo. Y dijeron “obvio”. Nadie lo cuestionó. Un señor movió su silla para que me sentara. Creo que soy un capibara. Creo que siempre lo fui».`, `«E o melhor: em algum momento eu disse pra eles que sou uma capivara. Uma capivara, sabe? O bicho. Sou calmo, sou quente, me dou bem com todo mundo, até com o jacaré. E eles falaram "óbvio". Ninguém questionou. Um senhor arrastou a cadeira pra eu sentar. Acho que sou uma capivara. Acho que sempre fui.»`)
          ];
        },
        do: { join: 'dani', unflag: 'benji_out', fun: 4, soc: 6, flag: 'benji_capybara' },
        choices: [
          K('joke', t(`"A capybara. Obviously. How could we not see it."`, `«Un capibara. Obvio. Cómo no lo vimos».`, `«Uma capivara. Óbvio. Como a gente não viu».`), { do: { fun: 4, bond: { dani: 2 } }, next: null, react: t(`Dani tears up a little. "Thank you. That means a lot. I'm going to go stand in water now. Metaphorically."`, `A Dani se le humedecen los ojos. «Gracias. Significa mucho. Voy a pararme en agua ahora. Metafóricamente».`, `O Dani se emociona um pouco. «Valeu. Significa muito. Vou ficar em pé na água agora. Metaforicamente».`) }),
          K('care', t(`"Did you drink water? Real water, not a metaphor."`, `«¿Tomaste agua? Agua de verdad, no metafórica».`, `«Você bebeu água? Água de verdade, não metafórica».`), { do: { hp: 3, care: 1, bond: { dani: 1 } }, next: null, react: t(`"I did! Three times. I'm a capybara, we're excellent at water."`, `«¡Sí! Tres veces. Soy un capibara, somos excelentes con el agua».`, `«Bebi! Três vezes. Sou uma capivara, a gente é ótimo com água.»`) }),
          K('ask', t(`"Okay, but who gave you the sandwich?"`, `«Bueno, ¿pero quién te dio el sándwich?»`, `«Beleza, mas quem te deu o sanduíche?»`), { do: { fun: 2, soc: 1 }, next: null, react: t(`"Unclear. It was a very good sandwich. I will think about it for the rest of my life."`, `«No está claro. Era un sándwich muy bueno. Pensaré en él el resto de mi vida».`, `«Não ficou claro. Era um sanduíche muito bom. Vou pensar nele pelo resto da vida.»`) })
        ]
      }
    }
  };
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'benji_txt', who: 'dani', ok: function (s) { return !!s.flags.benji_capybara; }, t: t(`Update: the man who moved his chair is now my friend and also the man who sold me a hat. I'm wearing the hat. Capybara business is booming. Bring water, bring snacks, bring yourself.`, `Actualización: el señor que movió su silla ahora es mi amigo y también el señor que me vendió un sombrero. Traigo el sombrero puesto. El negocio capibara va en auge. Trae agua, trae botana, trae tu persona.`, `Atualização: o senhor que arrastou a cadeira agora é meu amigo e também o senhor que me vendeu um chapéu. Tô de chapéu. O negócio capivara tá bombando. Traz água, traz lanche, traz você.`) });
    R.push({ id: 'tato_dark', who: 'tato', ok: function (s) { return !!s.flags.tato_dark_stay; }, t: t(`Good morning. I'm having tea with two very nice men, one of whom has a cat named Marx. I'm not saying I'm in love. I'm saying the kettle is boiling and nobody has left.`, `Buenos días. Estoy tomando té con dos hombres muy simpáticos, uno de los cuales tiene un gato llamado Marx. No digo que esté enamorado. Digo que la tetera hierve y nadie se ha ido.`, `Bom dia. Tô tomando chá com dois homens muito simpáticos, um dos quais tem um gato chamado Marx. Não tô dizendo que tô apaixonado. Tô dizendo que a chaleira tá fervendo e ninguém foi embora.`) });
    R.push({ id: 'vale_txt', who: 'vale', ok: function (s) { return s.party.indexOf('vale') !== -1; }, t: t(`Everybody home? I made a list and it checks out. Drink water, eat something that isn't a mint, text me when you wake up. I'm not your mum. I'm just very organised.`, `¿Todos en casa? Hice una lista y cuadra. Tomen agua, coman algo que no sea una menta, escríbanme cuando despierten. No soy su mamá. Solo soy muy organizada.`, `Todo mundo em casa? Fiz uma lista e bateu. Bebam água, comam algo que não seja bala de menta, me escrevam quando acordarem. Não sou a mãe de vocês. Só sou muito organizada.`) });
    R.push({ id: 'alex_txt', who: 'alex', ok: function (s) { return s.party.indexOf('alex') !== -1; }, t: t(`I woke up with glitter on my elbow and a very good feeling. I don't know whose glitter. I think it was ours. Same time next weekend? I'll bring the pillar.`, `Desperté con diamantina en el codo y una muy buena sensación. No sé de quién es la diamantina. Creo que era nuestra. ¿A la misma hora el fin de semana? Yo llevo el pilar.`, `Acordei com glitter no cotovelo e uma sensação muito boa. Não sei de quem é o glitter. Acho que era nosso. Mesmo horário no fim de semana? Eu levo o pilar.`) });
  }
})();

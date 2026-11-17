/* EXCUSE ME — story: the friends. First meeting, barks, regrouping. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;

  /* ------------------------------------------------------------ first meeting */
  D.friends_meet = {
    forced: true, who: 'maru', start: 'a', nodes: {
      a: {
        text: [
          T('"THERE you are. We started a search party."', '«AHÍ estás. Habíamos armado una búsqueda».', '«AÍ está você. A gente já tinha montado uma busca».'),
          T('BENJA: "You smell like outside! I love outside! Do you want a gum? I am so happy to see you I could cry. I might."', 'BENJA: «¡Hueles a la calle! ¡Amo la calle! ¿Quieres un chicle? Estoy tan feliz de verte que podría llorar. Capaz lloro».', 'BENJA: «Você cheira a rua! Eu amo a rua! Quer um chiclete? Tô tão feliz de te ver que podia chorar. Talvez eu chore».'),
          T('FEÑA: "Hey. You came. Good. Is there something to sit on? My legs are doing a thing."', 'FEÑA: «Hola. Viniste. Bien. ¿Hay algo para sentarse? Mis piernas están haciendo algo».', 'FEÑA: «Oi. Você veio. Que bom. Tem algo pra sentar? Minhas pernas tão fazendo uma coisa».')
        ],
        choices: [
          { tone: 'chill', t: T('"Sorry I\'m late. Bus 14 is a liar."', '«Perdón por llegar tarde. El bus 14 es un mentiroso».', '«Desculpa o atraso. O ônibus 14 é um mentiroso».'), do: { fun: 2, soc: 2, bond: { maru: 1 } }, next: 'b' },
          { tone: 'hug', t: T('"Group hug. Right now."', '«Abrazo grupal. Ahora mismo».', '«Abraço coletivo. Agora mesmo».'), do: { fun: 3, soc: 4, bond: { maru: 1, dani: 1, tato: 1 } }, next: 'b' },
          { tone: 'care', t: T('(To Feña) "You okay? You look pale."', '(A Feña) «¿Estás bien? Estás pálido».', '(Pro Feña) «Você tá bem? Tá pálido».'), do: { care: 1, bond: { tato: 2 }, flag: 'tato_checked' }, next: 'b', react: T(`Feña's face relaxes. "…A bit. Thank you for asking."`, `El rostro de Feña se relaja. «…Un poco. Gracias por preguntar».`, `O rosto do Feña relaxa. «…Um pouco. Valeu por perguntar».`) },
          { tone: 'joke', t: T('"A search party? Where\'s the flyer?"', '«¿Una búsqueda? ¿Dónde está el afiche?»', '«Uma busca? Cadê o cartaz?»'), do: { fun: 3, bond: { dani: 1 } }, next: 'b' }
        ]
      },
      b: {
        text: [
          T('LUISA: "Okay. I need to pee. Urgently. It is the kind of emergency that has a face."', 'LUISA: «Bueno. Tengo que hacer pipí. Urgente. Es el tipo de emergencia que tiene cara».', 'LUISA: «Tá. Preciso fazer xixi. Urgente. É o tipo de emergência que tem cara».'),
          T('BENJA: "I\'ll come! Moral support!" FEÑA: "I\'m not staying alone out here." LUISA: "Then we move together. Nobody gets lost. Say it."', 'BENJA: «¡Voy yo! ¡Apoyo moral!» FEÑA: «No me quedo solo aquí». LUISA: «Entonces nos movemos juntos. Nadie se pierde. Díganlo».', 'BENJA: «Eu vou! Apoio moral!» FEÑA: «Não fico sozinho aqui». LUISA: «Então a gente se move junto. Ninguém se perde. Falem».')
        ],
        choices: [
          { tone: 'chill', t: T('"Nobody gets lost."', '«Nadie se pierde».', '«Ninguém se perde».'), do: { flag: 'promised_together', bond: { maru: 1, dani: 1, tato: 1 } }, next: 'c' },
          { tone: 'blunt', t: T('"You\'re adults. Go pee."', '«Son adultos. Vayan a hacer pipí».', '«Vocês são adultos. Vão fazer xixi».'), do: { soc: -1, bond: { maru: -1 } }, next: 'c', react: T('Luisa raises an eyebrow. "We are going together. That was not a question."', 'Luisa levanta una ceja. «Vamos juntos. No era una pregunta».', 'A Luisa levanta uma sobrancelha. «A gente vai junto. Não era uma pergunta».') }
        ]
      },
      c: {
        text: T('The three of them fall in behind you like ducklings with eyeliner. Time to get across the main floor to the toilets.', 'Los tres se ponen detrás de ti como patitos con delineador. Hora de cruzar la pista principal hacia los baños.', 'Os três se enfileiram atrás de você como patinhos de delineador. Hora de cruzar a pista principal até os banheiros.'),
        do: { join: ['maru', 'dani', 'tato'], quest: { q1: 'done', q2: 'active' }, at: 150, call: 'q2_start', fun: 4 }
      }
    }
  };
  S.q2_start = function () {
    const s = EM.state;
    /* a visit to the toilets before the group was found must not skip the host when you come back with them */
    delete s.res.host;
    delete s.flags.host_alone;
    delete s.flags.stall_alone_done;
    if (s.flags.broh_hostile && !s.flags.broh_forgiven && s.res.broh) {
      /* the return of Broh: he and a friend plug the same gap again */
      delete s.res.broh;
      s.flags.broh_back = true;
    }
    EM.audio.setStyle('techno');
    E.applyAudio();
    EM.hooks.toast({ icon: 'heart', text: T('The group follows you now. Stay close, or they get lost.', 'El grupo te sigue. Mantente cerca o se pierden.', 'O grupo agora te segue. Fique perto ou eles se perdem.'), kind: 'good' });
  };

  /* ------------------------------------------------------------ friends found when away */
  story.friendDialogue = function (id, s) {
    const z = s.zone;
    const key = 'found_' + id + '_' + z;
    if (D[key]) return key;
    if (s.quests.q1 === 'active' && z === 'main') return 'friends_meet';
    return 'found_generic_' + id;
  };
  /* each friend greets you in their own voice when you find them */
  const GEN = {
    maru: T(`"There you are. I counted you in my head. Twice."`, `«Ahí estás. Te conté en la cabeza. Dos veces».`, `«Aí está você. Eu te contei de cabeça. Duas vezes».`),
    dani: T(`"I was gone eleven minutes and met nine people. Where were YOU?"`, `«Estuve fuera once minutos y conocí a nueve personas. ¿Y TÚ dónde estabas?»`, `«Fiquei sumido onze minutos e conheci nove pessoas. E VOCÊ, onde tava?»`),
    tato: T(`"I stood by a wall. The wall was nice."`, `«Me quedé junto a una pared. La pared era amable».`, `«Fiquei perto de uma parede. A parede era legal».`),
  };
  EM.FRIENDS.forEach(function (f) {
    const names = { maru: 'LUISA', dani: 'BENJA', tato: 'FEÑA' };
    D['found_generic_' + f] = {
      who: f, start: 'a', nodes: {
        a: {
          text: GEN[f] || T('"There you are. I got turned around." The relief on the face is complete.', '«Ahí estás. Me desorienté». El alivio en la cara es total.', '«Aí está você. Me perdi». O alívio no rosto é completo.'),
          choices: [
            { tone: 'chill', t: T('"Come on. We stay together from here."', '«Vamos. Desde aquí nos quedamos juntos».', '«Vem. A gente fica junto daqui pra frente».'), do: { join: f, bond: (function () { const o = {}; o[f] = 1; return o; })(), soc: 3 }, next: null },
            { tone: 'blunt', t: T('"Where were you? We said together."', '«¿Dónde estabas? Dijimos juntos».', '«Onde você estava? A gente combinou junto».'), do: { join: f, soc: -2, bond: (function () { const o = {}; o[f] = -1; return o; })() }, next: null, bad: false }
          ]
        }
      }
    };
  });

  /* ------------------------------------------------------------ friend barks */
  const BARKS = {
    maru: [
      T('LUISA: "Keep moving. I can feel the queue growing."', 'LUISA: «Sigue. Siento cómo crece la fila».', 'LUISA: «Continua. Sinto a fila crescendo».'),
      T('LUISA: "I love this song. I hate this song. I love it."', 'LUISA: «Amo esta canción. Odio esta canción. La amo».', 'LUISA: «Amo essa música. Odeio essa música. Amo».'),
      T('LUISA: "Water. Somebody remind me about water."', 'LUISA: «Agua. Que alguien me recuerde el agua».', 'LUISA: «Água. Alguém me lembra da água».'),
      T('LUISA: "If I lose my shoe tonight, I am blaming the floor."', 'LUISA: «Si pierdo un zapato esta noche, le echo la culpa al piso».', 'LUISA: «Se eu perder um sapato hoje, a culpa é do chão».')
    ],
    dani: [
      T('BENJA: "I LOVE EVERYONE IN THIS ROOM."', 'BENJA: «AMO A TODOS EN ESTE CUARTO».', 'BENJA: «AMO TODO MUNDO NESTA SALA».'),
      T('BENJA: "Is anyone else\'s heart a drum? No? Just mine?"', 'BENJA: «¿Alguien más tiene el corazón de tambor? ¿No? ¿Solo yo?»', 'BENJA: «Mais alguém tem o coração tipo tambor? Não? Só eu?»'),
      T('BENJA: "Quick: what is the opposite of a hug? …Another hug."', 'BENJA: «Rápido: ¿cuál es lo contrario de un abrazo? …Otro abrazo».', 'BENJA: «Rápido: qual é o contrário de um abraço? …Outro abraço».'),
      T('BENJA: "That guy over there has beautiful hands. Don\'t look. LOOK."', 'BENJA: «Ese de allá tiene manos hermosas. No mires. MIRA».', 'BENJA: «Aquele cara ali tem mãos lindas. Não olha. OLHA».')
    ],
    tato: [
      T('FEÑA: "Sorry. It\'s a lot of people."', 'FEÑA: «Perdón. Hay mucha gente».', 'FEÑA: «Desculpa. É muita gente».'),
      T('FEÑA: "Can we stand near a wall for a minute?"', 'FEÑA: «¿Podemos pararnos cerca de una pared un minuto?»', 'FEÑA: «Podemos ficar perto de uma parede um minuto?»'),
      T('FEÑA: "I\'m fine. I\'m just… loudly fine."', 'FEÑA: «Estoy bien. Solo estoy… ruidosamente bien».', 'FEÑA: «Tô bem. Só tô… barulhentamente bem».'),
      T('FEÑA: "Thanks for not leaving me with the crowd."', 'FEÑA: «Gracias por no dejarme con la multitud».', 'FEÑA: «Valeu por não me deixar com a multidão».')
    ]
  };
  story.barks = BARKS;
  let barkT = 14;
  story.tick = function (dt) {
    const s = EM.state; if (!s || !s.party.length) return;
    barkT -= dt;
    if (barkT > 0) return;
    barkT = 26 + Math.random() * 24;
    const f = EM.pick(s.party);
    const pool = BARKS[f] ? BARKS[f].concat((story.extraBarks && story.extraBarks[f]) || []) : null;
    if (pool) U.toast({ text: EM.pick(pool), kind: 'bark', ms: 3600 });
  };
})();

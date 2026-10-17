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
          T('DANI: "You smell like outside! I love outside! Do you want a gum? I am so happy to see you I could cry. I might."', 'DANI: «¡Hueles a la calle! ¡Amo la calle! ¿Quieres un chicle? Estoy tan feliz de verte que podría llorar. Capaz lloro».', 'DANI: «Você cheira a rua! Eu amo a rua! Quer um chiclete? Tô tão feliz de te ver que podia chorar. Talvez eu chore».'),
          T('TATO: "Hey. You came. Good. Is there something to sit on? My legs are doing a thing."', 'TATO: «Hola. Viniste. Bien. ¿Hay algo para sentarse? Mis piernas están haciendo algo».', 'TATO: «Oi. Você veio. Que bom. Tem algo pra sentar? Minhas pernas tão fazendo uma coisa».')
        ],
        choices: [
          { tone: 'chill', t: T('"Sorry I\'m late. Bus 14 is a liar."', '«Perdón por llegar tarde. El bus 14 es un mentiroso».', '«Desculpa o atraso. O ônibus 14 é um mentiroso».'), do: { fun: 2, soc: 2, bond: { maru: 1 } }, next: 'b' },
          { tone: 'hug', t: T('"Group hug. Right now."', '«Abrazo grupal. Ahora mismo».', '«Abraço coletivo. Agora mesmo».'), do: { fun: 3, soc: 4, bond: { maru: 1, dani: 1, tato: 1 } }, next: 'b' },
          { tone: 'care', t: T('(To Tato) "You okay? You look pale."', '(A Tato) «¿Estás bien? Estás pálido».', '(Pro Tato) «Você tá bem? Tá pálido».'), do: { care: 1, bond: { tato: 2 }, flag: 'tato_checked' }, next: 'b', react: T('Tato\'s whole face lets go of something. "…A bit. Thank you for asking. Nobody ever asks."', 'Toda la cara de Tato suelta algo. «…Un poco. Gracias por preguntar. Nadie nunca pregunta».', 'O rosto inteiro do Tato solta alguma coisa. «…Um pouco. Valeu por perguntar. Ninguém nunca pergunta».') },
          { tone: 'joke', t: T('"A search party? Where\'s the flyer?"', '«¿Una búsqueda? ¿Dónde está el afiche?»', '«Uma busca? Cadê o cartaz?»'), do: { fun: 3, bond: { dani: 1 } }, next: 'b' }
        ]
      },
      b: {
        text: [
          T('MARU: "Okay. I need to pee. Urgently. It is the kind of emergency that has a face."', 'MARU: «Bueno. Tengo que hacer pipí. Urgente. Es el tipo de emergencia que tiene cara».', 'MARU: «Tá. Preciso fazer xixi. Urgente. É o tipo de emergência que tem cara».'),
          T('DANI: "I\'ll come! Moral support!" TATO: "I\'m not staying alone out here." MARU: "Then we move together. Nobody gets lost. Say it."', 'DANI: «¡Voy yo! ¡Apoyo moral!» TATO: «No me quedo solo aquí». MARU: «Entonces nos movemos juntos. Nadie se pierde. Díganlo».', 'DANI: «Eu vou! Apoio moral!» TATO: «Não fico sozinho aqui». MARU: «Então a gente se move junto. Ninguém se perde. Falem».')
        ],
        choices: [
          { tone: 'chill', t: T('"Nobody gets lost."', '«Nadie se pierde».', '«Ninguém se perde».'), do: { flag: 'promised_together', bond: { maru: 1, dani: 1, tato: 1 } }, next: 'c' },
          { tone: 'blunt', t: T('"You\'re adults. Go pee."', '«Son adultos. Vayan a hacer pipí».', '«Vocês são adultos. Vão fazer xixi».'), do: { soc: -1, bond: { maru: -1 } }, next: 'c', react: T('Maru raises an eyebrow. "We are going together. That was not a question."', 'Maru levanta una ceja. «Vamos juntos. No era una pregunta».', 'A Maru levanta uma sobrancelha. «A gente vai junto. Não era uma pergunta».') }
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
  ['maru', 'dani', 'tato'].forEach(function (f) {
    const names = { maru: 'MARU', dani: 'DANI', tato: 'TATO' };
    D['found_generic_' + f] = {
      who: f, start: 'a', nodes: {
        a: {
          text: T('"There you are. I got turned around." The relief on the face is complete.', '«Ahí estás. Me desorienté». El alivio en la cara es total.', '«Aí está você. Me perdi». O alívio no rosto é completo.'),
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
      T('MARU: "Keep moving. I can feel the queue growing."', 'MARU: «Sigue. Siento cómo crece la fila».', 'MARU: «Continua. Sinto a fila crescendo».'),
      T('MARU: "I love this song. I hate this song. I love it."', 'MARU: «Amo esta canción. Odio esta canción. La amo».', 'MARU: «Amo essa música. Odeio essa música. Amo».'),
      T('MARU: "Water. Somebody remind me about water."', 'MARU: «Agua. Que alguien me recuerde el agua».', 'MARU: «Água. Alguém me lembra da água».'),
      T('MARU: "If I lose my shoe tonight, I am blaming the floor."', 'MARU: «Si pierdo un zapato esta noche, le echo la culpa al piso».', 'MARU: «Se eu perder um sapato hoje, a culpa é do chão».')
    ],
    dani: [
      T('DANI: "I LOVE EVERYONE IN THIS ROOM."', 'DANI: «AMO A TODOS EN ESTE CUARTO».', 'DANI: «AMO TODO MUNDO NESTA SALA».'),
      T('DANI: "Is anyone else\'s heart a drum? No? Just mine?"', 'DANI: «¿Alguien más tiene el corazón de tambor? ¿No? ¿Solo yo?»', 'DANI: «Mais alguém tem o coração tipo tambor? Não? Só eu?»'),
      T('DANI: "Quick: what is the opposite of a hug? …Another hug."', 'DANI: «Rápido: ¿cuál es lo contrario de un abrazo? …Otro abrazo».', 'DANI: «Rápido: qual é o contrário de um abraço? …Outro abraço».'),
      T('DANI: "That guy over there has beautiful hands. Don\'t look. LOOK."', 'DANI: «Ese de allá tiene manos hermosas. No mires. MIRA».', 'DANI: «Aquele cara ali tem mãos lindas. Não olha. OLHA».')
    ],
    tato: [
      T('TATO: "Sorry. It\'s a lot of people."', 'TATO: «Perdón. Hay mucha gente».', 'TATO: «Desculpa. É muita gente».'),
      T('TATO: "Can we stand near a wall for a minute?"', 'TATO: «¿Podemos pararnos cerca de una pared un minuto?»', 'TATO: «Podemos ficar perto de uma parede um minuto?»'),
      T('TATO: "I\'m fine. I\'m just… loudly fine."', 'TATO: «Estoy bien. Solo estoy… ruidosamente bien».', 'TATO: «Tô bem. Só tô… barulhentamente bem».'),
      T('TATO: "Thanks for not leaving me with the crowd."', 'TATO: «Gracias por no dejarme con la multitud».', 'TATO: «Valeu por não me deixar com a multidão».')
    ]
  };
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

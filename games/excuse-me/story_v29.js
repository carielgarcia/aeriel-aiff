/* EXCUSE ME — story v29: the roof is full, and the sunrise ends with an invitation to the afters.
   1. THE ROOF: "a hundred people, then three hundred" is now true. A crowd on both sides of an open aisle (dancers from the
      crowd system, calm: nobody turns hostile at sunrise), a DJ booth with ÆRIEL at the top, FRAMES SHELL at the back, people
      sitting along the rail, a couple, somebody lying down, and the team (Rosa, Luca, Isi, Mika, Dario, Dragan) by the stairs.
   2. THE AFTERS: after the roof applauds the morning, somebody invites you to the afters: Maru if she is with you, otherwise
      FRAMES SHELL. The afters are a gentle place (eggs, water, a sofa, nobody has to take anything) and you can say yes, yes for
      an hour, or go home to sleep; each answer is remembered in the night report and the morning thread (flags `afters_yes`,
      `afters_short`, `afters_home`). Must load after story_v28.js and before compact.js. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, Z = EM.zones, TL = EM.TL, D = EM.DIALOGUES, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };

  /* ============================================================ 1. THE ROOF */
  const R = Z.rooftop;
  if (R) {
    /* ÆRIEL's booth at the top of the roof, with a speaker on each side; the sunrise spot stays free below it */
    R.fill(11, 3, 8, 2, TL.BOOTH);
    R.fill(9, 3, 1, 2, TL.SPEAKER); R.fill(20, 3, 1, 2, TL.SPEAKER);
    R.npc({ id: 'dj_roof', cast: 'resident', x: 15, y: 3.6, dir: 'd', decor: true, pose: 'dance' });
    R.npc({ id: 'frames_roof', cast: 'frames', x: 27.5, y: 4.5, dir: 'l', decor: true, pose: 'sit' });
    /* the crowd: both sides of an aisle that runs from the stairs to the sunrise spot */
    R.crowdRect(1, 5, 11, 8, 3).crowdRect(18, 5, 11, 8, 3).crowdRect(1, 3, 8, 2, 3).crowdRect(21, 3, 8, 2, 3);
    /* people who are not dancing: along the bottom rail, a couple, somebody lying on the concrete */
    [['trio1', 7, 12], ['qpair1', 11.5, 12], ['trio2', 17, 12], ['qpair2', 21.5, 12], ['trio3', 2.5, 7.5]].forEach(function (p, i) {
      R.npc({ id: 'roof_sit' + i, cast: p[0], x: p[1], y: p[2], dir: i === 4 ? 'r' : 'u', decor: true, pose: 'sit' });
    });
    R.npc({ id: 'roof_hug', pair: ['sofa1', 'sofa2'], x: 26.5, y: 7.5, dir: 'u', decor: true, pose: 'hug' });
    R.npc({ id: 'roof_lie', cast: 'juno', x: 2.5, y: 10.5, dir: 'r', decor: true, pose: 'lie' });
    /* the team, by the stairs (they thank you when you arrive; see team_thanks in story_v27.js) */
    [['rosa', 20.5, 11.5], ['luca', 22, 11.5], ['mika', 26, 11.5], ['nuri', 27.5, 11.5], ['dario', 6, 11.5], ['dragan', 16.5, 11.5]].forEach(function (p) {
      R.npc({ id: 'roof_team_' + p[0], cast: p[0], x: p[1], y: p[2], dir: 'u', decor: true });
    });
  }

  /* ============================================================ 2. THE AFTERS */
  const SD = D.sunrise && D.sunrise.nodes;
  if (SD && SD.end) {
    SD.end.next = 'afters';
    SD.afters = { branch: [{ req: { with: 'maru' }, to: 'afters_maru' }, { req: function () { return true; }, to: 'afters_frames' }] };
    const ANSWERS = function () {
      return [
        K('care', t(`"Yes. Water first, then eggs."`, `«Sí. Primero agua, luego huevos».`, `«Sim. Primeiro água, depois ovos».`), { do: { flag: 'afters_yes', fun: 4, soc: 4, care: 1 }, next: 'afters_yes' }),
        K('chill', t(`"Yes, for an hour. Then I sleep."`, `«Sí, por una hora. Luego duermo».`, `«Sim, por uma hora. Depois eu durmo».`), { do: { flag: ['afters_yes', 'afters_short'], soc: 3, care: 1 }, next: 'afters_short' }),
        K('chill', t(`"Thank you. I'm going home to sleep."`, `«Gracias. Me voy a casa a dormir».`, `«Valeu. Vou pra casa dormir».`), { do: { flag: 'afters_home', hp: 5, soc: 1, care: 1 }, next: 'afters_home' })
      ];
    };
    SD.afters_maru = {
      text: t(`The roof thins out in a slow, happy line toward the stairs. Maru has her shoes in one hand and Rosa's thermos in the other. She did not ask for the thermos. "Afters at mine," she says. "Eggs. Water. The good sofa. Nobody has to talk, nobody has to take anything, and we leave when we leave. Are you coming?"`,
        `El techo se vacía en una fila lenta y feliz hacia las escaleras. Maru lleva los zapatos en una mano y el termo de Rosa en la otra. No pidió el termo. «Afters en mi casa», dice. «Huevos. Agua. El sofá bueno. Nadie tiene que hablar, nadie tiene que tomar nada y nos vamos cuando nos vayamos. ¿Vienes?»`,
        `O terraço vai esvaziando numa fila lenta e feliz em direção às escadas. A Maru carrega os sapatos numa mão e a garrafa térmica da Rosa na outra. Ela não pediu a térmica. «After na minha casa», diz. «Ovos. Água. O sofá bom. Ninguém precisa falar, ninguém precisa tomar nada e a gente sai quando sair. Você vem?»`),
      choices: ANSWERS()
    };
    SD.afters_frames = {
      text: t(`FRAMES SHELL zips the crate shut at the back of the roof. "Some of us are going to the kitchen under the studio. Eggs, water, one speaker at conversation volume. Whoever stayed to the end is on the list. Bring nothing. Are you coming?"`,
        `FRAMES SHELL cierra el cajón con el cierre al fondo del techo. «Algunos vamos a la cocina debajo del estudio. Huevos, agua, un parlante a volumen de conversación. Quien se quedó hasta el final está en la lista. No traigas nada. ¿Vienes?»`,
        `O FRAMES SHELL fecha o case com o zíper no fundo do terraço. «Alguns de nós vamos pra cozinha embaixo do estúdio. Ovos, água, uma caixa de som em volume de conversa. Quem ficou até o fim está na lista. Não traga nada. Você vem?»`),
      choices: ANSWERS()
    };
    SD.afters_yes = {
      text: t(`You go down the stairs with the last of the roof: a bottle of water in your hand, eggs in your future, the city turning gold behind you. Nobody asked you for anything. That is a good afters.`,
        `Bajas las escaleras con lo último del techo: una botella de agua en la mano, huevos en tu futuro, la ciudad dorándose detrás de ti. Nadie te pidió nada. Así es un buen afters.`,
        `Você desce as escadas com o resto do terraço: uma garrafa de água na mão, ovos no seu futuro, a cidade ficando dourada atrás de você. Ninguém te pediu nada. Esse é um bom after.`)
    };
    SD.afters_short = {
      text: t(`"One hour," you say, and nobody argues. A limit said out loud is welcome here. You take the stairs with the others and your alarm already set.`,
        `«Una hora», dices, y nadie discute. Un límite dicho en voz alta es bienvenido aquí. Bajas con los demás y con la alarma ya puesta.`,
        `«Uma hora», você diz, e ninguém discute. Um limite dito em voz alta é bem-vindo aqui. Você desce com os outros e o alarme já programado.`)
    };
    SD.afters_home = {
      text: t(`You hug whoever is nearest and take the stairs alone, lighter than you expected. Home is a real plan: water, a charger, a bed. The invitation stays open, and that is what makes it a good one.`,
        `Abrazas a quien tienes más cerca y bajas por tu cuenta, con el cuerpo más ligero de lo que esperabas. Volver a casa es un plan de verdad: agua, un cargador, una cama. La invitación sigue abierta, y por eso es buena.`,
        `Você abraça quem estiver mais perto e desce por conta própria, com o corpo mais leve do que esperava. Ir pra casa é um plano de verdade: água, carregador, cama. O convite continua de pé, e é isso que faz dele um bom convite.`)
    };
  }

  /* the night report and the morning thread remember the answer */
  const moments0 = story.moments;
  story.moments = function (s) {
    const out = moments0 ? moments0(s) : [];
    const extra = s.flags.afters_home ? t(`You turned the afters down kindly and went home to sleep.`, `Rechazaste el afters con cariño y te fuiste a dormir a casa.`, `Você recusou o after com carinho e foi dormir em casa.`)
      : (s.flags.afters_short ? t(`You gave the afters one hour and kept the promise.`, `Le diste una hora al afters y cumpliste.`, `Você deu uma hora ao after e cumpriu.`)
      : (s.flags.afters_yes ? t(`You said yes to the afters and kept it gentle: water first, eggs second.`, `Dijiste que sí al afters y lo mantuviste suave: primero agua, luego huevos.`, `Você disse sim ao after e manteve tudo leve: primeiro água, depois ovos.`) : null));
    return extra ? [extra].concat(out).slice(0, 10) : out;
  };
  if (story.morningRefs) {
    const M = story.morningRefs;
    M.push({ id: 'afters_yes', who: 'maru', ok: function (s) { return !!s.flags.afters_yes && !s.flags.afters_short; }, t: t(`Afters report: eggs, water, the good sofa. You fell asleep sitting up at nine and we put Rosa's thermos in your hand. It was still warm. Nobody had to take anything and everybody laughed.`, `Reporte del afters: huevos, agua, el sofá bueno. A las nueve te venció el sueño en el sofá y te pusimos el termo de Rosa en la mano. Seguía tibio. Nadie tuvo que tomar nada y todos se rieron.`, `Relatório do after: ovos, água, o sofá bom. Às nove o sono te venceu no sofá e a gente pôs a térmica da Rosa na sua mão. Ainda estava morna. Ninguém precisou tomar nada e todo mundo riu.`) });
    M.push({ id: 'afters_short', who: 'maru', ok: function (s) { return !!s.flags.afters_short; }, t: t(`You left after exactly one hour, as promised. The eggs got cold. We respect the alarm.`, `Te fuiste a la hora exacta, como prometiste. Los huevos se enfriaron. Respetamos la alarma.`, `Você saiu depois de exatamente uma hora, como prometeu. Os ovos esfriaram. A gente respeita o alarme.`) });
    M.push({ id: 'afters_home', who: 'maru', ok: function (s) { return !!s.flags.afters_home; }, t: t(`Good call. Sleep, water, a charger. The sofa will still be there next time. Text me when you wake up.`, `Buena decisión. Dormir, agua, un cargador. El sofá seguirá ahí la próxima vez. Escríbeme cuando despiertes.`, `Boa decisão. Dormir, água, carregador. O sofá vai continuar lá da próxima vez. Me manda mensagem quando acordar.`) });
  }
})();

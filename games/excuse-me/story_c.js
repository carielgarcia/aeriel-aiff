/* EXCUSE ME — story C: the quiet room, the pill (test, decision, effects), the peak, and the scattering. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;

  /* ------------------------------------------------------------ the pill: state and effects */
  S.decidePill = function () {
    const s = EM.state;
    if (s.pill.type) return s.pill.type;
    const r = EM.hash2(s.seed, 7, 3);
    s.pill.type = r < 0.38 ? 'pure' : (r < 0.7 ? 'mix' : 'fake');
    if (s.pill.type === 'fake') {
      const r2 = EM.hash2(s.seed, 11, 5);
      s.pill.fake = r2 < 0.34 ? 'faint' : (r2 < 0.67 ? 'nothing' : 'glitch');
    }
    return s.pill.type;
  };

  S.applyPillEffects = function (who, careful) {
    const s = EM.state, t = s.pill.type || S.decidePill();
    s.pill.taken = true;
    if (t === 'pure') {
      L.apply({ fx: 'mdma', fun: 10, hp: -3, weird: 10, flag: ['rolling', 'pill_taken'] });
      if (careful) s.fx.mdma = 170;
      U.toast({ icon: 'heart', text: T('Twenty minutes later: a warm tide. Everyone\'s hands look kind.', 'Veinte minutos después: una marea tibia. Las manos de todos se ven amables.', 'Vinte minutos depois: uma maré morna. As mãos de todo mundo parecem gentis.'), kind: 'good', ms: 5000 });
    } else if (t === 'mix') {
      L.apply({ fx: ['mdma', 'meth'], fun: 8, hp: -6, weird: 20, flag: ['rolling', 'wired', 'pill_taken'] });
      if (careful) { s.fx.mdma = 150; s.fx.meth = 170; }
      U.toast({ icon: 'spark', text: T('A warm wave with a wire running through it. Your jaw and your pulse have opinions.', 'Una ola tibia con un cable adentro. Tu mandíbula y tu pulso tienen opiniones.', 'Uma onda morna com um fio dentro. Sua mandíbula e seu pulso têm opiniões.'), kind: 'bad', ms: 5000 });
    } else {
      const f = s.pill.fake;
      if (f === 'faint') {
        s.pendingFaint = s.time + 10 + Math.floor(Math.random() * 6);
        L.apply({ weird: 6, flag: ['pill_fake', 'pill_taken', 'pill_faint'] });
        U.toast({ icon: 'skull', text: T('Something is wrong. The edges of the room are leaving.', 'Algo anda mal. Los bordes del cuarto se están yendo.', 'Algo está errado. As bordas da sala estão indo embora.'), kind: 'bad', ms: 5000 });
      } else if (f === 'nothing') {
        L.apply({ fun: -3, weird: 2, flag: ['pill_fake', 'pill_taken', 'pill_nothing'] });
        U.toast({ text: T('Nothing happens. Nothing keeps happening. You paid for a very expensive mint.', 'No pasa nada. Nada sigue pasando. Pagaste una menta carísima.', 'Nada acontece. Nada continua acontecendo. Você pagou por uma bala de menta caríssima.'), kind: 'info', ms: 5000 });
      } else {
        L.apply({ fx: 'glitch', weird: 8, hp: -4, flag: ['pill_fake', 'pill_taken', 'pill_glitch'] });
        U.toast({ icon: 'eyes', text: T('Static. Everything arrives half a second late and a little wrong. Other people are going to have a hard time understanding you.', 'Estática. Todo llega medio segundo tarde y un poco mal. A los demás les va a costar entenderte.', 'Estática. Tudo chega meio segundo atrasado e um pouco errado. Vai ser difícil os outros te entenderem.'), kind: 'bad', ms: 6000 });
      }
    }
  };

  /* ------------------------------------------------------------ the quiet room */
  S.enter_welfare = function () {
    const s = EM.state;
    if (!s.flags.welfare_first) {
      s.flags.welfare_first = true;
      U.toast({ icon: 'zzz', text: T('The QUIET ROOM. Your SOCIAL BATTERY and HEALTH recharge faster in here.', 'La SALA TRANQUILA. Tu BATERÍA SOCIAL y tu SALUD se recargan más rápido aquí.', 'A SALA DE CALMA. Sua BATERIA SOCIAL e sua SAÚDE recarregam mais rápido aqui.'), kind: 'good', ms: 5000 });
    }
  };

  D.nuri = {
    who: 'nuri', role: T('CHECKING TABLE', 'MESA DE CHEQUEO', 'MESA DE CHECAGEM'), start: 'a', nodes: {
      a: {
        text: T('"Hi. Water on the left, notebook on the right, nobody takes names. What are we doing?" Nuri\'s vest has a cross on it. Her voice has the energy of someone who has said this sentence a thousand times and means it every time.', '«Hola. Agua a la izquierda, cuaderno a la derecha, nadie anota nombres. ¿Qué hacemos?» El chaleco de Nuri tiene una cruz. Su voz tiene la energía de quien dijo esta frase mil veces y la dice en serio cada vez.', '«Oi. Água à esquerda, caderno à direita, ninguém anota nome. O que a gente vai fazer?» O colete da Nuri tem uma cruz. A voz dela tem a energia de quem já disse essa frase mil vezes e fala sério todas as vezes.'),
        choices: [
          { tone: 'honest', t: T('"A friend has a pill. We want it looked at."', '«Un amigo tiene una pastilla. Queremos que la miren».', '«Um amigo tem um comprimido. A gente quer que seja olhado».'), req: function (s) { return s.flags.pill_known && !s.pill.taken && !s.pill.binned && !s.pill.tested && s.party.indexOf('dani') !== -1; }, next: 'bring' },
          { tone: 'ask', t: T('"How does the table work?"', '«¿Cómo funciona la mesa?»', '«Como funciona a mesa?»'), next: 'explain' },
          { tone: 'chill', t: T('"Just need a minute and some water."', '«Solo necesito un minuto y algo de agua».', '«Só preciso de um minuto e de água».'), do: { soc: 3, hp: 2 }, next: null, react: T('"Take as long as you need. The mattresses are for everyone."', '«Tómate el tiempo que necesites. Los colchones son para todos».', '«Fique o tempo que precisar. Os colchões são pra todo mundo».') }
        ]
      },
      explain: {
        text: [
          T('"It\'s a conversation. We scrape a tiny bit off, test it, and tell you what it looks like. Notice: *looks like*. The test sees some things and misses others. It says nothing about strength, or how your body will react."', '«Es una conversación. Raspamos un poquito, lo probamos y te decimos a qué se parece. Fíjate: *se parece*. La prueba ve algunas cosas y se pierde otras. No dice nada sobre la fuerza ni cómo va a reaccionar tu cuerpo».', '«É uma conversa. A gente raspa um pouquinho, testa e diz com o que se parece. Repare: *se parece*. O teste vê algumas coisas e deixa passar outras. Não diz nada sobre a força nem como seu corpo vai reagir».'),
          T('"What we can do is tell you if something looks nothing like what you were told. Then you decide. I don\'t tell anyone what to do. I make the deciding better, and I\'ll sit with anybody who wants company."', '«Lo que sí podemos decirte es si algo no se parece en nada a lo que te dijeron. Después decides tú. Yo no le digo a nadie qué hacer. Hago que decidir sea mejor, y me siento con quien quiera compañía».', '«O que a gente pode dizer é se algo não se parece em nada com o que te disseram. Depois você decide. Eu não digo pra ninguém o que fazer. Eu deixo a decisão melhor, e sento com quem quiser companhia».')
        ],
        do: { flag: 'knows_table' },
        next: 'a'
      },
      bring: {
        text: [
          T('"Okay. Who\'s the owner? Put it on the table. Tell me where it came from and what you were told."', '«Bien. ¿Quién es el dueño? Ponla en la mesa. Dime de dónde vino y qué te dijeron».', '«Tá. Quem é o dono? Coloca na mesa. Me diz de onde veio e o que te disseram».'),
          T('DANI: "A guy in the queue outside. Said MDMA. Nice jacket." Nuri nods without judgement, like a nurse. "I scrape a little off. It\'s destroyed in the test, so there\'s less. Still want it done?"', 'DANI: «Un tipo de la fila de afuera. Dijo MDMA. Linda chaqueta». Nuri asiente sin juzgar, como una enfermera. «Raspo un poco. Se destruye en la prueba, así que queda menos. ¿Todavía quieres hacerla?»', 'DANI: «Um cara da fila lá fora. Disse MDMA. Jaqueta legal». A Nuri assente sem julgar, como uma enfermeira. «Raspo um pouco. Se destrói no teste, então sobra menos. Ainda quer fazer?»')
        ],
        choices: [
          { tone: 'yes', t: T('"Do it."', '«Hazlo».', '«Faça».'), call: 'run_test', next: null, free: true },
          { tone: 'no', t: T('"Let me think."', '«Déjame pensar».', '«Deixa eu pensar».'), next: null, free: true }
        ]
      }
    }
  };

  S.run_test = function () {
    const s = EM.state;
    S.decidePill();
    s.pill.tested = true;
    U.reagent(function () { U.startDialogue('nuri_result', { npc: 'nuri' }); });
  };

  D.nuri_after = {
    who: 'nuri', role: T('CHECKING TABLE', 'MESA DE CHEQUEO', 'MESA DE CHECAGEM'), start: 'a', nodes: {
      a: {
        text: T('"How are you doing? Honestly. Water? A mattress? A minute?"', '«¿Cómo estás? Sinceramente. ¿Agua? ¿Un colchón? ¿Un minuto?»', '«Como você tá? De verdade. Água? Um colchão? Um minuto?»'),
        choices: [
          { tone: 'care', t: T('"I\'m okay. Just checking in."', '«Estoy bien. Solo paso a saludar».', '«Tô bem. Só passei pra dar um oi».'), do: { soc: 4 }, next: null },
          { tone: 'honest', t: T('"I\'m not feeling right. Can I sit?"', '«No me siento bien. ¿Puedo sentarme?»', '«Não tô me sentindo bem. Posso sentar?»'), req: function (s) { return !!s.pill.taken || s.stats.hp < 50 || s.drinks >= 3; }, do: { care: 1, hp: 8, soc: 8, time: 20 }, next: null, react: T('Nuri doesn\'t flinch. "Of course. Here." A cup of water, a blanket, a mattress. Nobody looks at you like you did anything wrong.', 'Nuri no se inmuta. «Claro. Toma». Un vaso de agua, una manta, un colchón. Nadie te mira como si hubieras hecho algo malo.', 'A Nuri nem pisca. «Claro. Toma». Um copo d\'água, um cobertor, um colchão. Ninguém te olha como se você tivesse feito algo errado.') },
          { tone: 'water', t: T('Fill my bottle.', 'Llenar mi botella.', 'Encher minha garrafa.'), req: function (s) { return s.items.water < 3; }, do: { item: { water: 1 } }, next: null, free: true }
        ]
      }
    }
  };

  D.nuri_result = {
    forced: true, who: 'nuri', role: T('CHECKING TABLE', 'MESA DE CHEQUEO', 'MESA DE CHECAGEM'), start: 'start', nodes: {
      start: {
        branch: [
          { req: function (s) { return s.pill.type === 'pure'; }, to: 'pure' },
          { req: function (s) { return s.pill.type === 'mix'; }, to: 'mix' },
          { req: function () { return true; }, to: 'fake' }
        ]
      },
      pure: {
        text: [
          T('"It\'s showing what MDMA shows. As far as this table can tell, that\'s all it is." She taps the card. "*As far as this table can tell.* It doesn\'t tell me how strong. It doesn\'t tell me how your body will react."', '«Muestra lo que muestra el MDMA. Hasta donde esta mesa puede saber, eso es todo». Golpea la tarjeta. «*Hasta donde esta mesa puede saber.* No me dice qué tan fuerte es. No me dice cómo va a reaccionar tu cuerpo».', '«Mostra o que o MDMA mostra. Até onde esta mesa consegue saber, é só isso». Ela bate no cartão. «*Até onde esta mesa consegue saber.* Não me diz a força. Não me diz como seu corpo vai reagir».'),
          T('"If anyone takes it: start small and give it time. Water, not litres. Nothing on top: no extra pills, no mixing with drinks. Stay with people who would tell you if you looked wrong. And if nobody takes it, that is also a very good ending."', '«Si alguien la toma: empiecen poco y denle tiempo. Agua, no litros. Nada encima: ni otra pastilla, ni mezclar con tragos. Quédense con gente que te diga si te ves mal. Y si nadie la toma, también es un final muy bueno».', '«Se alguém tomar: comece pouco e dê tempo. Água, não litros. Nada por cima: nem outro comprimido, nem misturar com bebida. Fique com gente que te diria se você parecesse mal. E se ninguém tomar, também é um final muito bom».')
        ],
        next: 'decide_pure'
      },
      mix: {
        text: [
          T('"It\'s showing MDMA… and something else alongside it. Looks like a stimulant. That does not match what you were told."', '«Muestra MDMA… y algo más junto. Parece un estimulante. Eso no coincide con lo que te dijeron».', '«Mostra MDMA… e outra coisa junto. Parece um estimulante. Isso não bate com o que te disseram».'),
          T('"Somebody cut the one thing with another thing, probably so it hits harder or costs less. It\'s not what Dani paid for. It won\'t feel like what Dani expects. I\'m not telling you what to do. But I would sit with that for a moment."', '«Alguien mezcló una cosa con otra, probablemente para que pegue más fuerte o cueste menos. No es lo que Dani pagó. No se va a sentir como Dani espera. No te digo qué hacer. Pero yo me sentaría un momento con eso».', '«Alguém misturou uma coisa com outra, provavelmente pra bater mais forte ou custar menos. Não é o que o Dani pagou. Não vai parecer o que o Dani espera. Não digo o que fazer. Mas eu sentaria um momento com isso».')
        ],
        next: 'decide_mix'
      },
      fake: {
        text: [
          T('"Nothing on this table looks like MDMA. Something else is in there. I can\'t tell you what."', '«Nada en esta mesa se parece al MDMA. Hay otra cosa adentro. No puedo decirte qué».', '«Nada nesta mesa se parece com MDMA. Tem outra coisa aí dentro. Não posso dizer o quê».'),
          T('"What I can say: it isn\'t what you were sold. It might do nothing. It might do something that isn\'t what you want. The table can\'t tell me which. There\'s a bin here. No questions, no shame."', '«Lo que puedo decir: no es lo que te vendieron. Puede no hacer nada. Puede hacer algo que no quieres. La mesa no me dice cuál. Hay un bote de basura aquí. Sin preguntas, sin vergüenza».', '«O que posso dizer: não é o que te venderam. Pode não fazer nada. Pode fazer algo que você não quer. A mesa não me diz qual. Tem uma lixeira aqui. Sem perguntas, sem vergonha».')
        ],
        next: 'decide_fake'
      },
      decide_pure: {
        who: 'dani',
        text: T('DANI, breathless: "It\'s REAL. It\'s the REAL thing. Can we? Please can we?" Maru is watching you. Tato has retreated half a step toward the water.', 'DANI, sin aire: «Es REAL. Es la COSA REAL. ¿Podemos? ¿Por favor podemos?» Maru te mira. Tato retrocedió medio paso hacia el agua.', 'DANI, sem fôlego: «É REAL. É a COISA REAL. A gente pode? Por favor, a gente pode?» A Maru te olha. O Tato recuou meio passo em direção à água.'),
        choices: [
          { tone: 'yes', t: T('"Okay. Together. Slowly."', '«Bueno. Juntos. Despacio».', '«Tá. Juntos. Devagar».'), do: { bond: { dani: 1, maru: 1 }, flag: ['dani_took', 'maru_took', 'tato_declined'] }, call: 'pill_take', next: 'end' },
          { tone: 'care', t: T('"A small piece each. Then we wait and drink water."', '«Un pedacito cada uno. Después esperamos y tomamos agua».', '«Um pedacinho cada um. Depois a gente espera e bebe água».'), do: { bond: { dani: 1, maru: 1 }, flag: ['dani_took', 'maru_took', 'tato_declined', 'pill_careful'] }, call: 'pill_take_careful', next: 'end' },
          { tone: 'no', t: T('"Not for me tonight. You do you."', '«Esta noche no para mí. Tú haz lo tuyo».', '«Hoje não pra mim. Faça o que quiser».'), do: { flag: ['dani_took', 'tato_declined', 'pill_skipped'] }, next: 'end', react: T('Dani takes his without ceremony and hugs you for allowing him to. It is a good hug.', 'Dani toma la suya sin ceremonia y te abraza por dejarlo. Es un buen abrazo.', 'O Dani toma o dele sem cerimônia e te abraça por deixar. É um bom abraço.') },
          { tone: 'care', t: T('"Let\'s bin it. Tonight is already good."', '«Tirémosla. Esta noche ya está buena».', '«Vamos jogar fora. A noite já tá boa».'), next: 'bin_try' }
        ]
      },
      decide_mix: {
        who: 'dani',
        text: T('DANI: "…Mixed. But it still has the good thing in it? Right? RIGHT?" He is holding the pill like a cracked phone.', 'DANI: «…Mezclada. ¿Pero todavía tiene la cosa buena? ¿No? ¿¿NO??» Sostiene la pastilla como un celular roto.', 'DANI: «…Misturado. Mas ainda tem a coisa boa dentro? Né? NÉ?» Ele segura o comprimido como um celular quebrado.'),
        choices: [
          { tone: 'care', t: T('"It isn\'t what you were told. It isn\'t worth it."', '«No es lo que te dijeron. No vale la pena».', '«Não é o que te disseram. Não vale a pena».'), next: 'bin_try' },
          { tone: 'yes', t: T('"…A small piece. We wait."', '«…Un pedacito. Esperamos».', '«…Um pedacinho. A gente espera».'), do: { weird: 0, flag: ['dani_took', 'pill_careful'], bond: { dani: 1 } }, call: 'pill_take_careful', next: 'end' },
          { tone: 'yes', t: T('"Full send."', '«Con todo».', '«Com tudo».'), do: { flag: ['dani_took', 'maru_took'] }, call: 'pill_take', next: 'end', react: T('Maru looks at you, then at the pill, then at her own hands. She does not take any. She takes your elbow instead. "Okay. I\'m with you."', 'Maru te mira a ti, luego a la pastilla, luego a sus manos. No toma nada. Te toma del codo. «Ok. Estoy contigo».', 'A Maru olha pra você, depois pro comprimido, depois pras próprias mãos. Não toma nada. Segura seu cotovelo. «Tá. Tô com você».') },
          { tone: 'no', t: T('"I\'m out. You decide."', '«Yo me bajo. Decide tú».', '«Eu fora. Você decide».'), do: { flag: ['dani_took', 'pill_skipped'] }, next: 'end', react: T('Dani looks at you with a face you will remember. Then he swallows it. "It\'s my night." You hold his shoulders for a second. That is all you can do.', 'Dani te mira con una cara que vas a recordar. Luego se la traga. «Es mi noche». Le sostienes los hombros un segundo. Es todo lo que puedes hacer.', 'O Dani te olha com um rosto de que você vai se lembrar. Depois engole. «É minha noite». Você segura os ombros dele por um segundo. É tudo o que pode fazer.') }
        ]
      },
      decide_fake: {
        who: 'dani',
        text: T('DANI: "…So I paid for nothing. I paid for NOTHING." He looks at the pill, offended on the pill\'s behalf.', 'DANI: «…O sea que pagué por nada. Pagué por NADA». Mira la pastilla, ofendido en nombre de la pastilla.', 'DANI: «…Então eu paguei por nada. Paguei por NADA». Ele olha o comprimido, ofendido em nome do comprimido.'),
        choices: [
          { tone: 'care', t: T('"Bin it. You got a free lesson."', '«Tírala. Te llevas una lección gratis».', '«Joga fora. Você ganhou uma lição de graça».'), next: 'bin_try' },
          { tone: 'joke', t: T('"Keep it as a lucky charm?"', '«¿Guárdala como amuleto?»', '«Guarda como amuleto?»'), do: { fun: 2, flag: ['dani_took', 'dani_pocketed'] }, next: 'end', react: T('He kisses it, pockets it, and walks off humming. You have a bad feeling about the word "lucky".', 'La besa, se la guarda y se va tarareando. Tienes un mal presentimiento sobre la palabra «amuleto».', 'Ele beija, guarda e sai cantarolando. Você tem um mau pressentimento sobre a palavra «amuleto».') },
          { tone: 'yes', t: T('"Let\'s find out what it does."', '«Averigüemos qué hace».', '«Vamos descobrir o que faz».'), do: { flag: ['dani_took'], weird: 0 }, call: 'pill_take', next: 'end' }
        ]
      },
      bin_try: {
        branch: [
          { req: { bondMin: { dani: 2 } }, to: 'binned' },
          { req: function () { return true; }, to: 'defies' }
        ]
      },
      binned: {
        who: 'nuri',
        text: T('Dani\'s hand opens over the bin. It takes a long time. Nuri says "Thank you" very quietly, like you gave her something. "Water? A hug? Both are free."', 'La mano de Dani se abre sobre el bote de basura. Tarda mucho. Nuri dice «Gracias» muy bajito, como si le hubieras dado algo. «¿Agua? ¿Un abrazo? Ambos son gratis».', 'A mão do Dani se abre sobre a lixeira. Demora muito. A Nuri diz «Obrigada» bem baixinho, como se você tivesse dado algo a ela. «Água? Um abraço? Os dois são de graça».'),
        do: { flag: ['pill_binned'], bond: { dani: 2, maru: 1 }, soc: 4, fun: 3, care: 1 },
        next: 'end'
      },
      defies: {
        who: 'dani',
        text: T('"No." Dani closes his fist. "My body, my night. I\'m not asking permission. I just wanted you with me." He pockets it. He is not angry. That is worse.', '«No». Dani cierra el puño. «Mi cuerpo, mi noche. No pido permiso. Solo quería que estuvieras conmigo». Se la guarda. No está enojado. Eso es peor.', '«Não». O Dani fecha o punho. «Meu corpo, minha noite. Não tô pedindo permissão. Só queria você comigo». Ele guarda. Não está bravo. Isso é pior.'),
        do: { flag: ['dani_took', 'dani_defied'], bond: { dani: -1 } },
        next: 'end'
      },
      end: {
        text: T('Nuri, quietly: "If anything feels wrong — at any point tonight — come back. We don\'t judge. We sit." She slides a paper cup of water across to each of you. Nobody drinks it fast. Everybody drinks it.', 'Nuri, bajito: «Si algo se siente mal — en cualquier momento de esta noche — vuelvan. No juzgamos. Nos sentamos». Desliza un vasito de agua hacia cada uno. Nadie lo toma rápido. Todos lo toman.', 'A Nuri, baixinho: «Se algo parecer errado — a qualquer momento da noite — voltem. A gente não julga. A gente senta». Ela desliza um copinho d\'água pra cada um. Ninguém bebe rápido. Todo mundo bebe.'),
        do: { quest: { q5: 'done', q7: 'active' }, at: 270, hp: 4, soc: 3, water: true }
      }
    }
  };
  S.pill_take = function () { S.applyPillEffects('you', false); };
  S.pill_take_careful = function () { S.applyPillEffects('you', true); };

  D.teo = {
    who: 'teo', role: T('MEDIC', 'PARAMÉDICO', 'PARAMÉDICO'), start: 'a', nodes: {
      a: {
        text: T('"Hey. Teo. I\'m the one with the blood-pressure cuff and the very bad jokes. How are you actually doing?"', '«Hola. Soy Teo. El del tensiómetro y los chistes muy malos. ¿Cómo estás de verdad?»', '«Oi. Sou o Teo. O do aparelho de pressão e das piadas muito ruins. Como você tá de verdade?»'),
        choices: [
          { tone: 'care', t: T('"Can you check me over?"', '«¿Puedes revisarme?»', '«Pode me examinar?»'), do: { hp: 7, soc: 3, time: 10 }, next: null, react: T('Pulse, pupils, a very calm look at your ankles. "You\'re doing fine. Drink water. Sit for ten. And please — do not get into a fight with anybody called Broh."', 'Pulso, pupilas, una mirada muy tranquila a tus tobillos. «Estás bien. Toma agua. Siéntate diez minutos. Y por favor — no te metas en una pelea con nadie que se llame Broh».', 'Pulso, pupilas, um olhar muito calmo pros seus tornozelos. «Você tá bem. Beba água. Sente dez minutos. E por favor — não entre numa briga com ninguém chamado Broh».') },
          { tone: 'joke', t: T('"Tell me one of the very bad jokes."', '«Cuéntame uno de los chistes muy malos».', '«Me conta uma das piadas muito ruins».'), do: { fun: 3, soc: 2 }, next: null, react: T('"What do you call a pill that checks itself? …A paradox with a conscience." You laugh anyway.', '«¿Cómo se llama una pastilla que se chequea sola? …Una paradoja con conciencia». Te ríes igual.', '«Como chama um comprimido que se checa sozinho? …Um paradoxo com consciência». Você ri mesmo assim.') },
          { tone: 'chill', t: T('"All good. Thanks."', '«Todo bien. Gracias».', '«Tudo bem. Valeu».'), next: null, free: true }
        ]
      }
    }
  };

  /* ------------------------------------------------------------ THE PEAK (Q7) */
  S.peak_dance = function () { U.startDialogue('peak_intro', {}); };
  D.peak_intro = {
    forced: true, start: 'a', nodes: {
      a: {
        text: [
          T('It is 03:40. The DJ lets the kick drop out of the track and keeps only a high, bright thing, like a held breath. The whole floor leans forward. The crowd rearranges itself into a spiral around the centre of the room and opens a place for you.', 'Son las 03:40. El DJ deja caer el bombo del tema y solo queda algo alto y brillante, como una respiración contenida. Toda la pista se inclina hacia adelante. La multitud se reorganiza en espiral alrededor del centro del cuarto y te abre un lugar.', 'São 03:40. O DJ tira o bumbo da faixa e deixa só uma coisa alta e brilhante, feito uma respiração presa. A pista inteira se inclina pra frente. A multidão se reorganiza em espiral ao redor do centro da sala e abre um lugar pra você.'),
          T('Maru takes your hand. Dani is already moving. Tato is at the edge, one foot in the circle, one foot in his own safety. Three phrases, one for each ring of the spiral. Move with them.', 'Maru te toma de la mano. Dani ya se mueve. Tato está en el borde, un pie en el círculo y otro en su propia seguridad. Tres frases, una para cada anillo de la espiral. Muévete con ellos.', 'A Maru pega sua mão. O Dani já tá se movendo. O Tato tá na beirada, um pé no círculo e outro na própria segurança. Três frases, uma pra cada anel da espiral. Mova-se com eles.')
        ],
        choices: [
          { tone: 'dance', t: T('Step into the spiral.', 'Entrar a la espiral.', 'Entrar na espiral.'), call: 'peak_round1', next: null, free: true },
          { tone: 'stay', t: T('Not yet. Breathe first.', 'Todavía no. Respirar primero.', 'Ainda não. Respirar primeiro.'), next: null, free: true }
        ]
      }
    }
  };
  const PEAK = [
    { seq: 'LRLR', say: T('The outer ring takes you in.', 'El anillo exterior te recibe.', 'O anel externo te recebe.') },
    { seq: 'UDLRU', say: T('The middle ring pulls you deeper.', 'El anillo del medio te lleva más adentro.', 'O anel do meio te leva mais fundo.') },
    { seq: 'LLRRUD', say: T('The centre. Everybody is looking at the ceiling.', 'El centro. Todos miran el techo.', 'O centro. Todo mundo olha o teto.') }
  ];
  function peakRound(i) {
    const r = PEAK[i];
    U.toast({ icon: 'note', text: r.say, kind: 'info', ms: 2400 });
    U.danceGate({ seq: r.seq, attempts: 2 }, function (res) {
      const s = EM.state;
      s.peak = s.peak || { win: 0, partial: 0, fail: 0 };
      if (res === 'win') { s.peak.win++; L.apply({ fun: 12, soc: 2 }); }
      else if (res === 'partial') { s.peak.partial++; L.apply({ fun: 7 }); }
      else { s.peak.fail++; L.apply({ fun: 2, soc: -1 }); }
      L.danceCost(2);
      if (i < 2) peakRound(i + 1); else EM.hooks.script('the_drop');
    });
  }
  S.peak_round1 = function () { peakRound(0); };

  S.the_drop = function () { U.startDialogue('the_drop', {}); };
  D.the_drop = {
    forced: true, start: 'a', nodes: {
      a: {
        branch: [
          { req: { anyfx: ['mdma'] }, to: 'rolling' },
          { req: { anyfx: ['glitch'] }, to: 'glitchy' },
          { req: function () { return true; }, to: 'clear' }
        ]
      },
      rolling: {
        text: [
          T('The kick comes back and everything in you says yes.', 'El bombo vuelve y todo en ti dice sí.', 'O bumbo volta e tudo em você diz sim.'),
          T('You can feel every hand in the room. Not as a touch, as a fact. Four thousand people, one pulse, and you are not afraid of a single one of them. Maru is crying and laughing at once. Dani is on somebody\'s shoulders. You tell the stranger next to you you love them and mean it, and they say it back, and it is not a lie, and it will not last, and that is the most beautiful thing about it.', 'Puedes sentir cada mano de la sala. No como un toque, como un hecho. Cuatro mil personas, un solo pulso, y no le tienes miedo a ninguna. Maru llora y ríe a la vez. Dani va sobre los hombros de alguien. Le dices a la persona de al lado que la quieres y lo dices en serio, y ella lo dice de vuelta, y no es mentira, y no va a durar, y eso es lo más hermoso.', 'Você sente cada mão da sala. Não como um toque, como um fato. Quatro mil pessoas, um só pulso, e você não tem medo de nenhuma. A Maru chora e ri ao mesmo tempo. O Dani tá nos ombros de alguém. Você diz pra pessoa do lado que a ama e fala sério, e ela diz de volta, e não é mentira, e não vai durar, e é isso que tem de mais lindo.')
        ],
        do: { fun: 20, soc: 8, flag: 'peak_rolling' },
        next: 'after'
      },
      glitchy: {
        text: [
          T('The kick comes back half a second late, then twice, then all at once.', 'El bombo vuelve medio segundo tarde, luego dos veces, luego todo junto.', 'O bumbo volta meio segundo atrasado, depois duas vezes, depois tudo junto.'),
          T('You are dancing. Probably. Everybody is shouting something that might be your name. Someone hugs you and the hug arrives afterwards. It is not unpleasant. It is just not quite a night you are in.', 'Estás bailando. Probablemente. Todos gritan algo que podría ser tu nombre. Alguien te abraza y el abrazo llega después. No es desagradable. Solo que no es del todo una noche en la que estás.', 'Você tá dançando. Provavelmente. Todo mundo grita algo que pode ser seu nome. Alguém te abraça e o abraço chega depois. Não é desagradável. Só não é bem uma noite em que você está.')
        ],
        do: { fun: 4, soc: -4, flag: 'peak_glitch' },
        next: 'after'
      },
      clear: {
        text: [
          T('The kick comes back and four thousand people exhale at the same time.', 'El bombo vuelve y cuatro mil personas exhalan al mismo tiempo.', 'O bumbo volta e quatro mil pessoas expiram ao mesmo tempo.'),
          T('You are stone-cold sober, or close enough, and it still takes the top of your head off. There is nothing between you and the sound. You look at Maru: she is looking at you. You do not need to say anything. A person in front of you jumps in the air with their eyes closed, and for one second, the whole room is under their shoes.', 'Estás sobrio como una piedra, o casi, y igual te vuela la cabeza. No hay nada entre tú y el sonido. Miras a Maru: ella te mira. No hace falta decir nada. Alguien frente a ti salta con los ojos cerrados y, por un segundo, toda la sala está bajo sus zapatos.', 'Você tá sóbrio como uma pedra, ou perto disso, e ainda assim tira o topo da sua cabeça. Não há nada entre você e o som. Você olha pra Maru: ela te olha. Não precisa dizer nada. Uma pessoa na sua frente pula com os olhos fechados e, por um segundo, a sala inteira está debaixo dos sapatos dela.')
        ],
        do: { fun: 16, soc: 6, flag: 'peak_clear' },
        next: 'after'
      },
      after: {
        text: T('Time goes soft. When the lights come back up you are holding Maru\'s hand. The spiral has dissolved into ten thousand tiny conversations. Dani is gone. Tato is gone. Their jackets, their voices, the little crown pill and all the rest. The room is an ocean and your people are somewhere in it.', 'El tiempo se ablanda. Cuando vuelven las luces tienes la mano de Maru. La espiral se disolvió en diez mil conversaciones pequeñas. Dani no está. Tato no está. Sus camperas, sus voces, la pastillita con corona y todo lo demás. La sala es un océano y tu gente está en algún lugar adentro.', 'O tempo amolece. Quando as luzes voltam você tá segurando a mão da Maru. A espiral se dissolveu em dez mil conversinhas. O Dani sumiu. O Tato sumiu. As jaquetas, as vozes, o comprimido da coroa e tudo mais. A sala é um oceano e sua galera está em algum lugar dentro dele.'),
        do: { quest: { q7: 'done', q8: 'active' }, at: 340, call: 'scatter' }
      }
    }
  };

  S.scatter = function () {
    const s = EM.state, f = s.flags;
    S.decidePill();
    let dz = 'tunnel';
    if (f.dani_took && f.dani_took && (f.pill_taken || s.pill.type)) {
      if (s.pill.type === 'pure') dz = 'darkroom';
      else if (s.pill.type === 'mix') dz = 'attic';
      else dz = s.pill.fake === 'faint' ? 'welfare' : (s.pill.fake === 'glitch' ? 'courtyard' : 'tunnel');
    }
    if (!f.dani_took) dz = 'tunnel';
    L.leave('dani', dz);
    L.leave('tato', f.tato_rough ? 'welfare' : 'courtyard');
    f.dani_zone = dz;
    EM.hooks.toast({ icon: 'question', text: T('Dani and Tato are gone. Check the map in your head: the dark room, the attic, the tunnel, the smoking area, the quiet room.', 'Dani y Tato desaparecieron. Revisa el mapa en tu cabeza: el cuarto oscuro, el ático, el túnel, la zona de fumar, la sala tranquila.', 'O Dani e o Tato sumiram. Confira o mapa na sua cabeça: a dark room, o sótão, o túnel, a área de fumantes, a sala de calma.'), kind: 'info', ms: 6500 });
    if (EM.state.stats.hp < 20) EM.hooks.toast({ text: T('You are running on fumes. Sit down for a minute.', 'Estás con el tanque vacío. Siéntate un minuto.', 'Você tá no talo. Senta um minuto.'), kind: 'bad' });
  };

  /* ------------------------------------------------------------ finding them again (Q8) */
  S.regroup_check = function () {
    const s = EM.state;
    if (s.quests.q8 === 'active' && s.party.indexOf('dani') !== -1 && s.party.indexOf('tato') !== -1) {
      L.apply({ quest: { q8: 'done', q9: 'active' }, at: 400 });
      s.flags.regrouped = true;
    }
  };
  function B(f, n) { const o = {}; o[f] = n; return o; }
  function joinAndCheck(f, extra) { return Object.assign({ join: f, call: 'regroup_check' }, extra || {}); }

  D.found_dani_darkroom = {
    who: 'dani', start: 'a', nodes: {
      a: {
        text: T('Dani is at the centre of a happy pile of strangers, every hand on someone\'s shoulder, everyone laughing like they have known each other since birth. His eyes find you like a lighthouse. "I\'m — incredible. Everyone is incredible. Come here. COME HERE."', 'Dani está en el centro de una pila feliz de desconocidos, cada mano en el hombro de alguien, todos riendo como si se conocieran de toda la vida. Sus ojos te encuentran como un faro. «Estoy — increíble. Todos son increíbles. Ven. VEN».', 'O Dani tá no centro de uma pilha feliz de desconhecidos, cada mão no ombro de alguém, todo mundo rindo como se se conhecessem desde sempre. Os olhos dele te acham como um farol. «Eu tô — incrível. Todo mundo é incrível. Vem. VEM».'),
        choices: [
          { tone: 'care', t: T('"Dani. Water. Sit for five. Then back in, I promise."', '«Dani. Agua. Siéntate cinco minutos. Luego vuelves, te lo prometo».', '«Dani. Água. Senta cinco minutos. Depois você volta, prometo».'), req: { item: 'water' }, do: Object.assign(joinAndCheck('dani', { item: { water: -1 }, care: 1, bond: B('dani', 2), time: 12, flag: 'dani_water' })), next: null, react: T('He drinks the whole bottle, laughing between gulps, and lets you pull him out with a dozen hands waving goodbye.', 'Toma toda la botella, riendo entre sorbos, y deja que lo saques con una docena de manos despidiéndose.', 'Ele bebe a garrafa inteira, rindo entre goles, e deixa você tirá-lo dali com uma dúzia de mãos acenando.') },
          { tone: 'hug', t: T('Hug him. Dance with the pile for ten minutes.', 'Abrazarlo. Bailar diez minutos con la pila.', 'Abraçá-lo. Dançar dez minutos com a pilha.'), do: joinAndCheck('dani', { fun: 8, soc: 4, time: 10, bond: B('dani', 1) }), next: null, react: T('The pile adopts you for ten minutes. Then Dani says "okay okay we should go find Tato" with real tenderness, and brings you both out.', 'La pila te adopta diez minutos. Luego Dani dice «ok ok tenemos que ir a buscar a Tato» con ternura de verdad, y los saca a los dos.', 'A pilha te adota por dez minutos. Depois o Dani diz «tá tá a gente tem que achar o Tato» com ternura de verdade, e leva vocês dois pra fora.') },
          { tone: 'blunt', t: T('"We\'re leaving. Now."', '«Nos vamos. Ya».', '«A gente vai. Agora».'), do: joinAndCheck('dani', { soc: -3, bond: B('dani', -1), weird: 3 }), next: null, bad: true }
        ]
      }
    }
  };

  D.found_dani_attic = {
    who: 'dani', start: 'a', nodes: {
      a: {
        text: T('Dani is in the heart of a dance cult in Sala 2, wired like a hummingbird, jaw working, sweat on his collar. "I can\'t STOP! Why would I stop? I\'m just— I\'ve done forty minutes! Forty minutes of NOTHING BUT DANCING!" His eyes are very large and very far away.', 'Dani está en el corazón de una secta de baile en la Sala 2, acelerado como un colibrí, la mandíbula trabajando, sudor en el cuello. «¡No puedo PARAR! ¿Por qué iba a parar? ¡Llevo cuarenta minutos! ¡Cuarenta minutos de NADA MÁS QUE BAILAR!» Sus ojos son muy grandes y están muy lejos.', 'O Dani tá no coração de uma seita de dança na Sala 2, acelerado como beija-flor, a mandíbula trabalhando, suor no colarinho. «Eu não consigo PARAR! Por que eu pararia? Já faz quarenta minutos! Quarenta minutos de NADA ALÉM DE DANÇAR!» Os olhos dele são muito grandes e estão muito longe.'),
        choices: [
          { tone: 'care', t: T('"Water. Sit down for a minute. Your heart is going to thank you."', '«Agua. Siéntate un minuto. Tu corazón te lo va a agradecer».', '«Água. Senta um minuto. Seu coração vai agradecer».'), req: { item: 'water' }, do: joinAndCheck('dani', { item: { water: -1 }, care: 1, bond: B('dani', 2), time: 15, flag: 'dani_water', hp: 0 }), next: null, react: T('He drinks, he sits, he sweats through half a shirt and tells you everything he has seen in forty minutes. It is mostly the ceiling. You listen to all of it.', 'Toma, se sienta, suda media camiseta y te cuenta todo lo que vio en cuarenta minutos. Es sobre todo el techo. Lo escuchas todo.', 'Ele bebe, senta, transpira metade da camiseta e te conta tudo o que viu em quarenta minutos. Principalmente o teto. Você escuta tudo.') },
          { tone: 'dance', t: T('Join the cult. Three minutes. Then he comes with you.', 'Unirte a la secta. Tres minutos. Luego él viene contigo.', 'Entrar na seita. Três minutos. Depois ele vem com você.'), call: 'cult_dance_dani', next: null, free: true },
          { tone: 'blunt', t: T('Grab his arm. "We\'re going."', 'Agarrarlo del brazo. «Nos vamos».', 'Pegar no braço dele. «A gente vai».'), do: joinAndCheck('dani', { soc: -4, bond: B('dani', -2), weird: 5, hp: -2 }), next: null, bad: true, react: T('He yanks free, then sees your face, then deflates. "…Okay. Sorry. I don\'t know what\'s— okay." He comes. He doesn\'t look at you for a while.', 'Se suelta de un tirón, luego ve tu cara, luego se desinfla. «…Ok. Perdón. No sé qué me— ok». Viene. No te mira por un rato.', 'Ele se solta num puxão, depois vê seu rosto, depois murcha. «…Tá. Desculpa. Não sei o que tá— tá». Ele vem. Não te olha por um tempo.') }
        ]
      }
    }
  };
  S.cult_dance_dani = function () {
    U.danceGate({ seq: 'RLUDRL', attempts: 2 }, function (res) {
      const o = { join: 'dani', time: 6, bond: B('dani', res === 'win' ? 2 : 1), fun: res === 'win' ? 10 : 4, call: 'regroup_check' };
      if (res === 'fail') o.soc = -2;
      L.apply(o);
      U.toast({ text: res === 'win' ? T('The cult chants your name. Dani follows you out, still moving.', 'La secta canta tu nombre. Dani te sigue afuera, todavía moviéndose.', 'A seita canta seu nome. O Dani te segue pra fora, ainda se movendo.') : T('Not your best, but Dani likes that you tried. He comes.', 'No fue lo mejor, pero a Dani le gusta que lo hayas intentado. Viene.', 'Não foi o melhor, mas o Dani gosta que você tentou. Ele vem.'), kind: 'good' });
    });
  };

  D.found_dani_welfare = {
    who: 'dani', start: 'a', nodes: {
      a: {
        text: T('Dani is lying on a mattress under a folded blanket, face slack, breathing slow. Teo is sitting next to him with a clipboard, entirely calm. "He\'s okay. Came in about forty minutes ago. Passed out. Vitals are fine. He\'ll wake up groggy. Nothing was wrong that sleep and water won\'t fix."', 'Dani está en un colchón bajo una manta doblada, la cara floja, respirando lento. Teo está sentado a su lado con una carpeta, totalmente calmo. «Está bien. Llegó hace cuarenta minutos. Se desmayó. Los signos están bien. Se va a despertar atontado. No pasó nada que el sueño y el agua no arreglen».', 'O Dani tá deitado num colchão sob um cobertor dobrado, rosto mole, respirando devagar. O Teo tá sentado ao lado dele com uma prancheta, completamente calmo. «Ele tá bem. Chegou faz uns quarenta minutos. Desmaiou. Sinais vitais ok. Vai acordar grogue. Nada que sono e água não resolvam».'),
        choices: [
          { tone: 'care', t: T('Sit with him until he wakes. (An hour.)', 'Sentarte con él hasta que despierte. (Una hora).', 'Sentar com ele até acordar. (Uma hora.)'), do: joinAndCheck('dani', { care: 1, bond: B('dani', 2), time: 60, hp: 10, soc: 10, flag: 'dani_sat' }), next: null, react: T('You hold a paper cup of water for an hour. He wakes up and says "…did I miss it?" You say no. You say there is still a night. He cries a little and calls you the best person alive.', 'Sostienes un vasito de agua durante una hora. Despierta y dice «…¿me lo perdí?» Dices que no. Dices que todavía queda noche. Llora un poco y te llama la mejor persona del mundo.', 'Você segura um copinho d\'água por uma hora. Ele acorda e diz «…eu perdi?» Você diz que não. Diz que ainda tem noite. Ele chora um pouco e te chama de a melhor pessoa viva.') },
          { tone: 'plan', t: T('Wake him gently and take him with you now.', 'Despertarlo con suavidad y llevarlo ahora.', 'Acordar com delicadeza e levar agora.'), do: joinAndCheck('dani', { bond: B('dani', 0), time: 5, hp: -2, flag: 'dani_woken' }), next: null, react: T('Teo gives you a look with exactly one eyebrow. "He\'s allowed. Make sure he drinks."', 'Teo te da una mirada con exactamente una ceja. «Puede irse. Asegúrate de que tome agua».', 'O Teo te lança um olhar com exatamente uma sobrancelha. «Ele pode ir. Garanta que beba água».') }
        ]
      }
    }
  };

  D.found_dani_tunnel = {
    who: 'dani', start: 'a', nodes: {
      a: {
        text: T('Dani is sitting cross-legged on the concrete next to Ximena, holding a can of spray paint like a baby bird. He is fine. He is very fine. "She\'s teaching me to write my name so it looks like a crack. Look. LOOK. It says DANI and also it says the end of the world."', 'Dani está sentado con las piernas cruzadas en el concreto junto a Ximena, sosteniendo una lata de aerosol como a un pichón. Está bien. Está muy bien. «Me enseña a escribir mi nombre para que parezca una grieta. Mira. MIRA. Dice DANI y también dice el fin del mundo».', 'O Dani tá sentado de pernas cruzadas no concreto ao lado da Ximena, segurando uma lata de spray como um filhote. Tá bem. Tá muito bem. «Ela tá me ensinando a escrever meu nome pra parecer uma rachadura. Olha. OLHA. Diz DANI e também diz o fim do mundo».'),
        choices: [
          { tone: 'chill', t: T('"It looks perfect. Come on, we need to find Tato."', '«Se ve perfecto. Vamos, tenemos que encontrar a Tato».', '«Ficou perfeito. Vem, a gente precisa achar o Tato».'), do: joinAndCheck('dani', { bond: B('dani', 1), fun: 3 }), next: null },
          { tone: 'ask', t: T('"Did you take the pill?"', '«¿Tomaste la pastilla?»', '«Você tomou o comprimido?»'), next: 'pill' }
        ]
      },
      pill: {
        who: 'dani',
        text: T('"No! No. I thought about it. Then Ximena handed me a can of spray paint and said she\'d give me something better. It turned out to be this." He holds up the can. "It\'s better."', '«¡No! No. Lo pensé. Después Ximena me dio una lata de aerosol y dijo que me daría algo mejor. Resultó ser esto». Levanta la lata. «Es mejor».', '«Não! Não. Pensei nisso. Aí a Ximena me deu uma lata de spray e disse que ia me dar uma coisa melhor. Era isso». Ele levanta a lata. «É melhor».'),
        do: joinAndCheck('dani', { bond: B('dani', 2), fun: 4, flag: 'dani_clean' }),
        next: null
      }
    }
  };

  D.found_dani_courtyard = {
    who: 'dani', start: 'a', nodes: {
      a: {
        text: T('Dani is sitting in front of a fire barrel having a deep, whispered conversation with the flames. "The fire says hi. The fire says I should be more gentle with myself. I think the fire might be right." His pupils are the size of the moon. Everything he does arrives a little after he does it.', 'Dani está sentado frente a un barril de fuego manteniendo una conversación profunda y susurrada con las llamas. «El fuego dice hola. El fuego dice que debería ser más amable conmigo. Creo que el fuego puede tener razón». Sus pupilas tienen el tamaño de la luna. Todo lo que hace llega un poco después de hacerlo.', 'O Dani tá sentado diante de um barril de fogo tendo uma conversa profunda e sussurrada com as chamas. «O fogo disse oi. O fogo disse que eu devia ser mais gentil comigo. Acho que o fogo pode ter razão». As pupilas dele têm o tamanho da lua. Tudo o que ele faz chega um pouco depois de fazer.'),
        choices: [
          { tone: 'care', t: T('Sit next to him. "Let\'s let the fire rest. Water first."', 'Sentarte a su lado. «Dejemos descansar al fuego. Primero agua».', 'Sentar do lado dele. «Vamos deixar o fogo descansar. Primeiro água».'), do: joinAndCheck('dani', { care: 1, bond: B('dani', 2), time: 15, soc: 3, flag: 'dani_fire' }), next: null, react: T('You sit with him until his pupils are the size of a normal moon. The fire looks a little offended. Dani waves goodbye to it twice.', 'Te sientas con él hasta que sus pupilas tienen el tamaño de una luna normal. El fuego parece un poco ofendido. Dani se despide del fuego dos veces.', 'Você senta com ele até as pupilas terem o tamanho de uma lua normal. O fogo parece um pouco ofendido. O Dani se despede dele duas vezes.') },
          { tone: 'joke', t: T('"Tell the fire I said thanks. Dani, up."', '«Dile al fuego que gracias de mi parte. Dani, arriba».', '«Diz pro fogo que valeu da minha parte. Dani, em pé».'), do: joinAndCheck('dani', { bond: B('dani', 1), fun: 2, time: 4 }), next: null }
        ]
      }
    }
  };

  D.found_tato_courtyard = {
    who: 'tato', start: 'a', nodes: {
      a: {
        text: [
          T('By a fire barrel at the far end of the smoking area, Tato is standing very straight in front of a man in a leather jacket. Mateo. Tato\'s ex. You know the name because Tato has said it exactly four times in two years and each time it was in a different voice.', 'Junto a un barril de fuego al fondo de la zona de fumar, Tato está muy derecho frente a un hombre con chaqueta de cuero. Mateo. El ex de Tato. Sabes el nombre porque Tato lo dijo exactamente cuatro veces en dos años y cada vez con una voz distinta.', 'Perto de um barril de fogo no fundo da área de fumantes, o Tato tá muito empertigado diante de um homem de jaqueta de couro. Mateo. O ex do Tato. Você sabe o nome porque o Tato disse exatamente quatro vezes em dois anos e cada vez com uma voz diferente.'),
          T('MATEO: "I just wanted to say hi." TATO, with the face of a man holding a very full glass: "…Hi." Neither of them has noticed you. Both of them are about to say something that will cost something.', 'MATEO: «Solo quería saludar». TATO, con la cara de alguien que sostiene un vaso muy lleno: «…Hola». Ninguno de los dos te vio. Los dos están a punto de decir algo que va a costar.', 'MATEO: «Só queria dar um oi». TATO, com a cara de quem segura um copo muito cheio: «…Oi». Nenhum dos dois te viu. Os dois estão prestes a dizer algo que vai custar.')
        ],
        choices: [
          { tone: 'care', t: T('(To Tato, quietly) "Do you want to leave? I\'m here either way."', '(A Tato, bajito) «¿Quieres irte? Estoy contigo de cualquier modo».', '(Pro Tato, baixinho) «Você quer ir embora? Eu tô aqui de qualquer jeito».'), next: 'care' },
          { tone: 'blunt', t: T('(To Mateo) "He\'s with us. Back off."', '(A Mateo) «Está con nosotros. Retrocede».', '(Pro Mateo) «Ele tá com a gente. Recua».'), do: { weird: 8, soc: -4, bond: B('tato', -1), flag: 'mateo_backoff' }, next: 'blunt', bad: true },
          { tone: 'ask', t: T('(To Tato) "What do YOU want from this conversation?"', '(A Tato) «¿Qué quieres TÚ de esta conversación?»', '(Pro Tato) «O que VOCÊ quer dessa conversa?»'), next: 'ask' }
        ]
      },
      care: {
        text: T('Tato breathes in. "No. Stay. I want to say it. But stay." He turns to Mateo. What follows is eleven minutes, mostly quiet, and neither raises their voice. At the end Tato says "I forgive you, and I\'m going to go dance now," and walks into the smoke with his shoulders three centimetres lower.', 'Tato respira hondo. «No. Quédate. Quiero decirlo. Pero quédate». Se vuelve hacia Mateo. Lo que sigue son once minutos, casi todos en silencio, y ninguno alza la voz. Al final Tato dice «Te perdono, y ahora voy a ir a bailar», y camina hacia el humo con los hombros tres centímetros más bajos.', 'O Tato respira fundo. «Não. Fica. Quero falar. Mas fica». Ele se vira pro Mateo. O que vem são onze minutos, quase todos em silêncio, e nenhum levanta a voz. No fim o Tato diz «Eu te perdoo, e agora vou dançar», e caminha pra fumaça com os ombros três centímetros mais baixos.'),
        do: joinAndCheck('tato', { care: 1, bond: B('tato', 3), time: 11, flag: ['tato_closure', 'tato_checked'], fun: 4 })
      },
      blunt: {
        text: T('Mateo raises both palms. "Whoa. Easy. I only came to say hi." Tato rounds on you, hurt and furious: "I didn\'t ask you to do that." He stares at Mateo for a long second, then turns and walks away across the courtyard. You follow. It takes ten minutes to get him to look at you.', 'Mateo levanta las dos palmas. «Eh. Tranquilo. Solo vine a saludar». Tato se da vuelta hacia ti, herido y furioso: «No te pedí que hicieras eso». Mira a Mateo un largo segundo, luego se va caminando por el patio. Lo sigues. Tardas diez minutos en que te mire.', 'O Mateo ergue as duas palmas. «Opa. Calma. Só vim dar um oi». O Tato se vira pra você, magoado e furioso: «Eu não pedi que você fizesse isso». Ele encara o Mateo por um longo segundo, depois vira e sai caminhando pelo pátio. Você segue. Leva dez minutos pra ele olhar pra você.'),
        do: joinAndCheck('tato', { time: 10, bond: B('tato', 0), flag: 'tato_hurt' })
      },
      ask: {
        text: T('Tato opens his mouth. Closes it. Opens it. "I want to say one thing. And I want him to listen. And then I want to never see him again for the rest of the night." Mateo, quietly: "I can do that." What follows is shorter and more honest than either of them expected. When it ends, Tato turns to you, red-eyed and lighter: "Thank you for asking. Nobody asks."', 'Tato abre la boca. La cierra. La abre. «Quiero decir una sola cosa. Y quiero que me escuche. Y después no quiero volver a verlo el resto de la noche». Mateo, bajito: «Puedo hacer eso». Lo que sigue es más corto y más honesto de lo que ninguno esperaba. Al terminar, Tato se vuelve hacia ti, de ojos rojos y más liviano: «Gracias por preguntar. Nadie pregunta».', 'O Tato abre a boca. Fecha. Abre. «Quero dizer uma coisa só. E quero que ele escute. E depois não quero mais ver ele pelo resto da noite». O Mateo, baixinho: «Posso fazer isso». O que vem é mais curto e mais honesto do que os dois esperavam. Quando acaba, o Tato se vira pra você, de olhos vermelhos e mais leve: «Obrigado por perguntar. Ninguém pergunta».'),
        do: joinAndCheck('tato', { care: 1, bond: B('tato', 3), time: 8, flag: ['tato_closure', 'tato_checked'], fun: 3, soc: 2 })
      }
    }
  };

  D.found_tato_welfare = {
    who: 'tato', start: 'a', nodes: {
      a: {
        text: T('Tato is curled on a mattress in the quiet room with his shoes off and a paper cup of water in both hands. Nuri raises one eyebrow at you across the room, a very precise "gently." "He came in forty minutes ago. Didn\'t want to talk. Wanted the dark and a blanket. I gave him both."', 'Tato está acurrucado en un colchón de la sala tranquila, sin zapatos y con un vasito de agua en las dos manos. Nuri levanta una ceja hacia ti desde el otro lado del cuarto, un «con cuidado» muy preciso. «Llegó hace cuarenta minutos. No quiso hablar. Quería oscuridad y una manta. Le di las dos cosas».', 'O Tato tá enrolado num colchão na sala de calma, sem os sapatos e com um copinho d\'água nas duas mãos. A Nuri ergue uma sobrancelha pra você do outro lado da sala, um «com cuidado» bem preciso. «Chegou faz quarenta minutos. Não quis falar. Queria escuro e um cobertor. Dei os dois».'),
        choices: [
          { tone: 'care', t: T('Sit next to him. Say nothing for as long as it takes.', 'Sentarte a su lado. No decir nada el tiempo que haga falta.', 'Sentar do lado dele. Não dizer nada pelo tempo que for preciso.'), do: joinAndCheck('tato', { care: 1, bond: B('tato', 3), time: 30, hp: 6, soc: 8, flag: ['tato_sat', 'tato_checked'] }), next: null, react: T('Thirty minutes of nothing. Then Tato says, to the ceiling: "You came back." You say you came back. That is the entire conversation. It is the best one of the night.', 'Treinta minutos de nada. Luego Tato dice, al techo: «Volviste». Dices que volviste. Esa es toda la conversación. Es la mejor de la noche.', 'Trinta minutos de nada. Depois o Tato diz, pro teto: «Você voltou». Você diz que voltou. Essa é a conversa toda. É a melhor da noite.') },
          { tone: 'plan', t: T('"Come on. We\'ll stay near the walls, I promise."', '«Vamos. Nos quedaremos cerca de las paredes, lo prometo».', '«Vem. A gente fica perto das paredes, prometo».'), do: joinAndCheck('tato', { bond: B('tato', 1), time: 8, soc: -1 }), next: null }
        ]
      }
    }
  };
})();

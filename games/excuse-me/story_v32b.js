/* EXCUSE ME — story v32b: THE AFTER, the walls and the people you came with. The neighbours are people with something at stake (Marcos has
   an interview at ten, Beto lost a patient at four, the landlord has an owner of his own), and every way of settling them costs something:
   fun, time, a promise, your name on a warning. Then Benjamin, Fernando and Maru, who each have a real conversation before you decide who
   walks whom home, and the scenes that close the chapter. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic;
  const D = EM.DIALOGUES, S = EM.scripts, AF = EM.AF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const withF = function (f) { return function () { return L.hasFriend(f); }; };
  const F = function (f) { return function (s) { return !!s.flags[f]; }; };

  S.af_noise8 = function () { AF.noise(8); };

  /* ============================================================ 6. THE KNOCK: who lives on each wall */
  D.af_marcos = {
    forced: true, who: 'marcos', role: t('ABOVE: A CALL AT TEN', 'ARRIBA: UNA LLAMADA A LAS DIEZ', 'EM CIMA: UMA CALL ÀS DEZ'), start: 'a', nodes: {
      a: {
        text: t(`Knock, knock. A man in a sleep-creased T-shirt and one slipper. "Sorry. I've got a call at ten. It's the interview, the one I've waited eight months for. Your floor is my ceiling and I can feel the kick in my teeth."`, `Toc, toc. Un hombre con una camiseta arrugada de dormir y una sola pantufla. «Perdón. Tengo una llamada a las diez. Es la entrevista, la que espero hace ocho meses. Su piso es mi techo y siento el bombo en los dientes».`, `Toc, toc. Um homem de camiseta amassada de dormir e um chinelo só. «Desculpa. Tenho uma call às dez. É a entrevista, a que espero faz oito meses. O seu chão é o meu teto e eu sinto o bumbo nos dentes».`),
        choices: [
          K('care', t(`Say sorry, and mean it. Turn the music off now.`, `Pedir perdón, y de verdad. Apagar la música ahora.`, `Pedir desculpa, de verdade. Desligar a música agora.`), { do: { call: 'af_vol0', care: 1, soc: 3, fun: -3, flag: ['marcos_ok'], quest: { q_af6: 'active' } }, next: 'ok' }),
          K('smooth', t(`"Rug only. Socks only. Nobody stomps."`, `«Solo en la alfombra. Solo con calcetines. Nadie pisa fuerte».`, `«Só no tapete. Só de meia. Ninguém pisa forte».`), { do: { call: 'af_dn25', fun: 1, soc: 2, flag: ['marcos_ok'], quest: { q_af6: 'active' } }, next: 'rug' }),
          K('care', t(`"Doña Remedios likes the record. Come and hear it."`, `«A doña Remedios le gusta el disco. Ven a escucharlo».`, `«A dona Remedios gosta do disco. Vem ouvir».`), { req: F('rem_ally'), do: { call: 'af_dn35', soc: 4, flag: ['marcos_ok'], quest: { q_af6: 'active' } }, next: 'remedios' }),
          K('plan', t(`"We'll keep it silent until eleven. I'll stay by the stereo myself."`, `«Lo mantenemos en silencio hasta las once. Yo me quedo junto al equipo».`, `«A gente fica em silêncio até as onze. Eu fico do lado do som».`), { do: { call: 'af_vol0', care: 1, time: 20, soc: -1, flag: ['marcos_ok', 'marcos_vigil'], quest: { q_af6: 'active' } }, next: 'vigil' }),
          K('blunt', t(`"It's Sunday morning. People are allowed to dance."`, `«Es domingo por la mañana. La gente puede bailar».`, `«É domingo de manhã. As pessoas podem dançar».`), { do: { soc: -3, call: 'af_up8', flag: 'marcos_cross', quest: { q_af6: 'active' } }, next: 'cross' }),
          K('silent', t(`Pretend nobody's home.`, `Fingir que no hay nadie.`, `Fingir que não tem ninguém em casa.`), { free: true, do: { call: 'af_up8', flag: 'marcos_ignored', quest: { q_af6: 'active' } }, next: null, react: t(`The knocking stops. A note slides under the door. You don't read it. The bass keeps going.`, `Los golpes paran. Una nota se desliza bajo la puerta. No la lees. El bajo sigue.`, `As batidas param. Um bilhete desliza por baixo da porta. Você não lê. O grave continua.`) })
        ]
      },
      ok: { text: t(`"Thank you." He lets out a breath. "It's a good party. It's just above me. I need this job. I've got a mortgage and a savings account I'm not allowed to touch." A beat. "I'll come down for toast at eleven if the call goes well. If it doesn't I'll come down for toast anyway."`, `«Gracias». Suelta el aire. «Es una buena fiesta. Solo que está encima de mí. Necesito este trabajo. Tengo una hipoteca y una cuenta de ahorros que no puedo tocar». Una pausa. «Bajo por tostadas a las once si la llamada sale bien. Si no sale bien, bajo igual».`, `«Obrigado». Ele solta o ar. «É uma boa festa. Só que fica em cima de mim. Preciso desse emprego. Tenho um financiamento e uma poupança que não posso mexer». Uma pausa. «Desço pra torrada às onze se a call der certo. Se não der, desço do mesmo jeito».`), next: null },
      rug: { text: t(`He looks past you at the rug and the socks. "Okay. The rug." He nods once, which in a neighbour is a handshake. "Fifty minutes, that's all I need. After that do what you like."`, `Mira detrás de ti la alfombra y los calcetines. «Está bien. La alfombra». Asiente una vez, que en un vecino es un apretón de manos. «Cincuenta minutos, es todo lo que necesito. Después hagan lo que quieran».`, `Ele olha atrás de você pro tapete e as meias. «Tá. O tapete». Assente uma vez, o que num vizinho é um aperto de mão. «Cinquenta minutos, é só isso que preciso. Depois façam o que quiserem».`), next: null },
      remedios: { text: t(`On the balcony Remedios lifts her watering can in salute. Marcos looks at her, then at the record, then at his watch. "Ten minutes. I'll come in my slippers." He does, and he stays six.`, `En el balcón, Remedios levanta su regadera en señal de saludo. Marcos la mira, luego al disco, luego a su reloj. «Diez minutos. Voy en pantuflas». Lo hace, y se queda seis.`, `Na varanda, a Remedios levanta o regador em saudação. O Marcos olha pra ela, pro disco, pro relógio. «Dez minutos. Eu desço de chinelo». Ele desce, e fica seis.`), next: null },
      vigil: { text: t(`You stand by the stereo for twenty minutes with a hand over the volume knob, listening to the building. A floor above, a call begins and a voice you can't make out says good morning to somebody important. At ten past, a slow footstep goes across the ceiling, and stops, and the interview goes on.`, `Te quedas junto al equipo veinte minutos con la mano sobre la perilla del volumen, oyendo el edificio. Un piso arriba empieza una llamada y una voz que no distingues le da los buenos días a alguien importante. A las diez y diez, un paso lento cruza el techo y se detiene, y la entrevista sigue.`, `Você fica do lado do som vinte minutos com a mão no botão do volume, ouvindo o prédio. Um andar acima começa uma call e uma voz que você não distingue dá bom dia a alguém importante. Às dez e dez, um passo lento atravessa o teto, para, e a entrevista segue.`), next: null },
      cross: { text: t(`"Allowed, sure," Marcos says, tired. "Please do it quietly." He goes up the stairs one heavy step at a time. You hear a door close and, a moment after, the particular sound of someone typing a complaint.`, `«Permitido, claro», dice Marcos, cansado. «Háganlo bajito, por favor». Sube las escaleras un paso pesado a la vez. Oyes cerrarse una puerta y, un momento después, el sonido particular de alguien escribiendo una queja.`, `«Pode, claro», diz o Marcos, cansado. «Façam baixinho, por favor». Ele sobe a escada um passo pesado de cada vez. Você ouve uma porta fechar e, um momento depois, o som particular de alguém digitando uma reclamação.`), do: { call: 'af_noise8' }, next: null }
    }
  };
  D.af_beto = {
    forced: true, who: 'beto', role: t('LEFT WALL: THE NIGHT NURSE', 'PARED IZQUIERDA: EL ENFERMERO', 'PAREDE ESQUERDA: O ENFERMEIRO'), start: 'a', nodes: {
      a: {
        text: function (s) {
          return s.flags.mb_visit
            ? [t(`A tired man in scrubs, keys in his hand, has just got in. "Your music I can sleep through. The headboard, no. I'm not against anybody's Sunday. It's my wall, that's all." A pause. "I lost someone at four. A patient. I know it's not your problem. I'd just like it quiet."`, `Un hombre cansado con uniforme, las llaves en la mano, acaba de llegar. «Tu música la puedo dormir. El respaldo, no. No estoy en contra del domingo de nadie. Es mi pared, eso es todo». Una pausa. «Perdí a alguien a las cuatro. Un paciente. Sé que no es tu problema. Solo quisiera que haya silencio».`, `Um homem cansado de uniforme, chaves na mão, acabou de chegar. «A música eu consigo dormir. A cabeceira, não. Não sou contra o domingo de ninguém. É a minha parede, só isso». Uma pausa. «Perdi alguém às quatro. Um paciente. Sei que não é problema seu. Só queria silêncio».`)]
            : [t(`A tired man in scrubs, keys in his hand, has just got in from a shift. "My bed's on the other side of your speaker. I'm not angry." A pause. "I lost someone at four. A patient. I know it's not your problem. I'd just like it quiet."`, `Un hombre cansado con uniforme, las llaves en la mano, acaba de llegar de un turno. «Mi cama está del otro lado de tu parlante. No estoy enojado». Una pausa. «Perdí a alguien a las cuatro. Un paciente. Sé que no es tu problema. Solo quisiera que haya silencio».`, `Um homem cansado de uniforme, chaves na mão, acabou de chegar de um plantão. «Minha cama fica do outro lado do seu alto-falante. Não tô bravo». Uma pausa. «Perdi alguém às quatro. Um paciente. Sei que não é problema seu. Só queria silêncio».`)];
        },
        choices: [
          K('care', t(`Say sorry. Move the party to the far end and close the doors.`, `Pedir perdón. Llevar la fiesta al otro extremo y cerrar las puertas.`, `Pedir desculpa. Levar a festa pro outro lado e fechar as portas.`), { do: { call: 'af_dn25', care: 1, soc: 3, time: 6, fun: -2, flag: 'beto_ok' }, next: 'ok' }),
          K('care', t(`Offer a quiet hour: no bass until he has slept.`, `Ofrecer una hora de silencio: sin bajo hasta que haya dormido.`, `Oferecer uma hora de silêncio: sem grave até ele dormir.`), { do: { call: 'af_vol0', care: 1, soc: 4, fun: -3, flag: ['beto_ok', 'quiet_hour'] }, next: 'quiet' }),
          K('honest', t(`"Do you want to talk for a bit, or do you want quiet?"`, `«¿Quieres hablar un rato, o quieres silencio?»`, `«Quer conversar um pouco, ou quer silêncio?»`), { do: { time: 12, soc: -1 }, next: 'talk' }),
          K('silent', t(`Don't answer.`, `No contestar.`, `Não responder.`), { free: true, do: { call: 'af_up8', flag: 'beto_ignored' }, next: null, react: t(`Three more knocks. Then a long silence, and the sound of someone sitting down against the door.`, `Tres golpes más. Luego un silencio largo, y el sonido de alguien sentándose contra la puerta.`, `Mais três batidas. Depois um silêncio longo, e o som de alguém sentando encostado na porta.`) })
        ]
      },
      ok: { text: t(`"Thank you." He rubs his face. "I'll sleep through the rest. Knock if there's a fire." He is already walking back down the corridor.`, `«Gracias». Se frota la cara. «Duermo el resto. Toquen si hay un incendio». Ya camina de vuelta por el pasillo.`, `«Obrigado». Ele esfrega o rosto. «Eu durmo o resto. Batam se tiver incêndio». Já tá voltando pelo corredor.`), next: null },
      quiet: { text: t(`"A quiet hour," he repeats, trying the unusual word. "I'll set an alarm. You're good people." He goes. The flat hears itself.`, `«Una hora de silencio», repite, probando la palabra rara. «Pongo una alarma. Son buena gente». Se va. El departamento se oye a sí mismo.`, `«Uma hora de silêncio», repete, experimentando a palavra rara. «Ponho um alarme. Vocês são gente boa». Ele vai. O apê se escuta.`), next: null },
      talk: {
        text: t(`"Talk," he says, surprised at himself. "Ten minutes. Not about her. About anything." You stand in the doorway and talk about radiators, about a bakery that's changed its bread, about the bus. At the end he says, "That helped more than the silence would have." He yawns until his jaw cracks. "Go back to your party. I'll be asleep before you're at the end of the hall."`, `«Hablar», dice, sorprendido de sí mismo. «Diez minutos. No de ella. De cualquier cosa». Se quedan en el umbral hablando de radiadores, de una panadería que cambió el pan, del bus. Al final dice: «Me ayudó más que el silencio». Bosteza hasta que le cruje la mandíbula. «Vuelvan a su fiesta. Yo estaré dormido antes de que lleguen al final del pasillo».`, `«Conversar», diz, surpreso consigo mesmo. «Dez minutos. Não sobre ela. Sobre qualquer coisa». Vocês ficam na porta falando de radiador, de uma padaria que mudou o pão, do ônibus. No fim ele diz: «Ajudou mais que o silêncio». Boceja até a mandíbula estalar. «Voltem pra festa. Vou estar dormindo antes de vocês chegarem no fim do corredor».`),
        do: { call: 'af_dn35', care: 1, soc: 5, flag: ['beto_ok', 'g_beto_open'] }, next: null
      }
    }
  };
  D.af_quiroga1 = {
    forced: true, who: 'quiroga', role: t('THE LANDLORD', 'EL DUEÑO', 'O DONO'), start: 'a', nodes: {
      a: {
        text: [
          t(`Anselm opens the door and his shoulders drop. The landlord stands on the mat in his coat, a folder under one arm. "Third floor, second complaint of the year. The Alvarados have a four-month-old who hasn't slept since your first record."`, `Anselm abre la puerta y se le caen los hombros. El dueño está sobre el felpudo con su abrigo y una carpeta bajo el brazo. «Tercer piso, segunda queja del año. Los Alvarado tienen un bebé de cuatro meses que no duerme desde su primer disco».`, `O Anselm abre a porta e os ombros dele caem. O dono tá no capacho de casaco, com uma pasta debaixo do braço. «Terceiro andar, segunda reclamação do ano. Os Alvarado têm um bebê de quatro meses que não dorme desde o primeiro disco de vocês».`),
          t(`"I'm not here to shout. I've got an owner of my own. A third complaint and I'm the one who has to give you notice, and I'd rather not be that man. I knew your mother, Anselm."`, `«No vengo a gritar. Tengo mi propio dueño. Una tercera queja y soy yo quien tiene que darles aviso, y preferiría no ser ese hombre. Conocí a tu madre, Anselm».`, `«Não vim gritar. Eu tenho um dono também. Uma terceira reclamação e sou eu que preciso dar o aviso, e preferia não ser esse homem. Eu conhecia a sua mãe, Anselm».`)
        ],
        choices: [
          K('care', t(`Apologise with Anselm. "It stops now. We'll clean the stairs too."`, `Pedir perdón junto con Anselm. «Se acaba ahora. Además limpiamos la escalera».`, `Pedir desculpa junto com o Anselm. «Acaba agora. A gente limpa a escada também».`), { do: { care: 1, soc: 4, time: 12, fun: -3, call: 'af_quiroga_down', flag: ['quiroga_warned', 'quiroga_ok'], quest: { q_af6: 'done' } }, next: 'ok' }),
          K('care', t(`Ask what the Alvarados actually need. "Can we bring something down?"`, `Preguntar qué necesitan de verdad los Alvarado. «¿Podemos bajarles algo?»`, `Perguntar o que os Alvarado precisam de verdade. «A gente pode levar alguma coisa lá embaixo?»`), { do: { care: 2, soc: 5, time: 15, call: 'af_quiroga_down', flag: ['quiroga_warned', 'alv_gift'], quest: { q_af6: 'done' } }, next: 'gift' }),
          K('care', t(`Send a loaf of the bakery bread down to the Alvarados.`, `Mandar un pan de la panadería a los Alvarado.`, `Mandar um pão da padaria pros Alvarado.`), { req: F('brought_food'), do: { care: 2, soc: 6, call: 'af_quiroga_down', flag: ['quiroga_warned', 'alv_bread'], quest: { q_af6: 'done' } }, next: 'bread' }),
          K('honest', t(`Take the warning in your own name. "I'm the one who held the door. Write it against me."`, `Tomar la advertencia a tu nombre. «Yo fui quien atendió la puerta. Anótalo contra mí».`, `Assumir o aviso no seu nome. «Fui eu que cuidei da porta. Anota contra mim».`), { req: F('door_yours'), do: { care: 2, soc: -3, call: 'af_quiroga_down', flag: ['quiroga_warned', 'warning_yours'], quest: { q_af6: 'done' } }, next: 'yours' }),
          K('blunt', t(`"It's one morning. People live here too."`, `«Es una mañana. Aquí también vive gente».`, `«É uma manhã. Gente mora aqui também».`), { do: { soc: -4, call: 'af_quiroga_down', flag: ['quiroga_warned', 'quiroga_cross'], quest: { q_af6: 'done' } }, next: 'cross' })
        ]
      },
      ok: { text: t(`"Thank you. Keep it like this." He leaves. For a while the flat is silent. You get the bucket and do the stairs, all three flights, and the records go back in their sleeves. The flat is, at last, just a flat.`, `«Gracias. Manténganlo así». Se va. Por un rato el departamento está en silencio. Buscas el balde y haces las escaleras, los tres pisos, y los discos vuelven a sus fundas. El departamento es, por fin, solo un departamento.`, `«Obrigado. Mantenham assim». Ele vai embora. Por um tempo o apê fica em silêncio. Você pega o balde e limpa a escada, os três andares, e os discos voltam pras capas. O apê é, enfim, só um apê.`), next: null },
      gift: { text: t(`He blinks. "What they need. Nobody's asked that." He puts the folder under the other arm. "Sleep. Failing that, quiet stairs and a note under the door that says somebody's sorry." You write it on the back of a flyer. He takes it down himself. He doesn't write anything in the folder.`, `Parpadea. «Lo que necesitan. Nadie lo ha preguntado». Cambia la carpeta de brazo. «Dormir. Si no, escaleras silenciosas y una nota bajo la puerta que diga que alguien lo siente». La escribes en el dorso de un volante. Él la baja personalmente. No escribe nada en la carpeta.`, `Ele pisca. «O que eles precisam. Ninguém perguntou isso». Passa a pasta pro outro braço. «Dormir. Na falta, escada silenciosa e um bilhete embaixo da porta dizendo que alguém sente muito». Você escreve no verso de um panfleto. Ele leva lá embaixo pessoalmente. Não anota nada na pasta.`), next: null },
      bread: { text: t(`You hand him a warm loaf in paper. He holds it at arm's length. "For the baby's parents. Fine. I'll take it down myself." He doesn't write anything in the folder.`, `Le das un pan tibio en papel. Lo sostiene con el brazo estirado. «Para los padres del bebé. Bueno. Lo bajo yo». No escribe nada en la carpeta.`, `Você entrega um pão morno em papel. Ele segura com o braço esticado. «Pros pais do bebê. Tá. Eu mesmo levo». Não anota nada na pasta.`), next: null },
      yours: { text: t(`Quiroga looks at you for a while. "That's not how it usually goes." He opens the folder and writes your name on the line, in capitals, with some care. "It's in your name. If there's a third, it's you who leaves, and Anselm and Dot stay." He closes it. "Not many people would."`, `Quiroga te mira un buen rato. «No es así como suele ser». Abre la carpeta y escribe tu nombre en la línea, en mayúsculas, con cuidado. «Queda a tu nombre. Si hay una tercera, eres tú quien se va y Anselm y Dot se quedan». La cierra. «No muchos lo harían».`, `O Quiroga te olha por um tempo. «Não é assim que costuma ser». Abre a pasta e escreve seu nome na linha, em maiúsculas, com cuidado. «Fica no seu nome. Se houver uma terceira, é você que sai e o Anselm e a Dot ficam». Fecha. «Poucos fariam isso».`), next: null },
      cross: { text: t(`"People live here," he agrees, flatly. "That is the point." He writes something in the folder and shuts it. "Quiet. Please."`, `«Aquí vive gente», concuerda, sin inflexión. «Ese es el punto». Escribe algo en la carpeta y la cierra. «Silencio. Por favor».`, `«Gente mora aqui», concorda, sem inflexão. «Esse é o ponto». Escreve algo na pasta e fecha. «Silêncio. Por favor».`), next: null }
    }
  };
  D.af_quiroga2 = {
    forced: true, who: 'quiroga', role: t('THE LANDLORD', 'EL DUEÑO', 'O DONO'), start: 'a', nodes: {
      a: {
        text: function (s) {
          return s.flags.warning_yours
            ? t(`The landlord is back, and this time there's no folder, only a slip with your name on it. He doesn't look at Anselm and Dot. "I said once." He holds the door open for you. "They stay. I keep my word."`, `El dueño volvió, y esta vez sin carpeta, solo un papel con tu nombre. No mira a Anselm ni a Dot. «Dije una vez». Te sostiene la puerta. «Ellos se quedan. Yo cumplo mi palabra».`, `O dono voltou, e dessa vez sem pasta, só um papel com o seu nome. Não olha pro Anselm nem pra Dot. «Eu disse uma vez». Ele segura a porta pra você. «Eles ficam. Eu cumpro a minha palavra».`)
            : t(`The landlord is back, and this time there's no folder. "I said once." Anselm says, very quietly, "I know." Everybody starts putting their shoes on without being asked.`, `El dueño volvió, y esta vez sin carpeta. «Dije una vez». Anselm dice, muy bajito: «Lo sé». Todos empiezan a ponerse los zapatos sin que se lo pidan.`, `O dono voltou, e dessa vez sem pasta. «Eu disse uma vez». O Anselm diz, bem baixinho: «Eu sei». Todo mundo começa a calçar os sapatos sem ninguém pedir.`);
        },
        choices: [
          K('care', t(`Help carry the records down to the car.`, `Ayudar a bajar los discos al auto.`, `Ajudar a levar os discos até o carro.`), { req: function (s) { return !s.flags.warning_yours; }, free: true, do: { care: 1, flag: 'after_evicted' }, call: 'af_end_after', next: null }),
          K('care', t(`Apologise to Quiroga and leave quietly.`, `Pedir perdón a Quiroga e irte en silencio.`, `Pedir desculpa ao Quiroga e sair em silêncio.`), { free: true, do: { flag: 'after_evicted' }, call: 'af_end_after', next: null })
        ]
      }
    }
  };
  D.af_front = {
    start: 'a', nodes: {
      a: {
        text: t(`The front door, and the stairs behind it. You've done your bit. Your legs want a bed.`, `La puerta de entrada, y las escaleras detrás. Ya hiciste lo tuyo. Tus piernas quieren una cama.`, `A porta da frente, e a escada atrás. Você já fez a sua parte. Suas pernas querem uma cama.`),
        choices: [
          K('chill', t(`Stay a bit longer.`, `Quedarte un poco más.`, `Ficar mais um pouco.`), { free: true, next: null }),
          K('care', t(`Say your goodbyes and go home. Your people come with you.`, `Despedirte e irte a casa. Tu gente va contigo.`, `Se despedir e ir pra casa. Sua galera vai junto.`), { free: true, do: { flag: 'after_early' }, call: 'af_end_after', next: null })
        ]
      }
    }
  };

  /* ============================================================ BENJAMIN: the next thing, and what it is for */
  D.af_dani_next = {
    forced: true, who: 'dani', role: t('THE NEXT THING', 'LO SIGUIENTE', 'A PRÓXIMA COISA'), start: 'a', nodes: {
      a: {
        text: t(`Benjamin is rummaging for his shoes, vibrating gently. "What's the next thing? There's always a next thing. A park. A pool. A sunrise but later. Come on." He's smiling and his eyes aren't.`, `Benjamin busca sus zapatos, vibrando suavemente. «¿Qué es lo siguiente? Siempre hay algo siguiente. Un parque. Una pileta. Un amanecer pero más tarde. Vamos». Sonríe y los ojos no.`, `O Benjamin procura os sapatos, vibrando de leve. «Qual é a próxima coisa? Sempre tem uma próxima coisa. Um parque. Uma piscina. Um nascer do sol, só que mais tarde. Bora». Ele sorri e os olhos não.`),
        choices: [
          K('care', t(`"The next thing is toast. And then a bed."`, `«Lo siguiente son tostadas. Y después una cama».`, `«A próxima coisa é torrada. E depois uma cama».`), { do: { bond: { dani: 1 }, soc: 2, fun: 2, flag: 'dani_toast' }, next: 'toast' }),
          K('ask', t(`"What happens if you stop?"`, `«¿Qué pasa si paras?»`, `«O que acontece se você parar?»`), { next: 'ask' }),
          K('care', t(`"I'm tired too. Let's say it out loud."`, `«Yo también estoy cansado. Digámoslo en voz alta».`, `«Eu também tô cansado. Vamos dizer em voz alta».`), { do: { care: 1, bond: { dani: 2 }, soc: 3, flag: 'dani_admit' }, next: 'admit' }),
          K('bold', t(`"Let's find the next thing."`, `«Vamos a buscar lo siguiente».`, `«Vamos achar a próxima coisa».`), { do: { fun: 6, hp: -6, soc: -4, time: 30, flag: 'dani_chase' }, next: 'chase' })
        ]
      },
      ask: {
        text: t(`The shoes go down. "If I stop moving, someone's going to ask me how I am. And I'll say fine. And they'll know." He sits on the arm of the sofa. "I lost the contract in March. Everyone thinks it's going great. I'm so fucking good at going great."`, `Los zapatos bajan. «Si dejo de moverme, alguien me va a preguntar cómo estoy. Y diré que bien. Y lo sabrán». Se sienta en el brazo del sofá. «Perdí el contrato en marzo. Todos creen que me va genial. Soy buenísimo en que me vaya genial».`, `Os sapatos descem. «Se eu parar de me mexer, alguém vai me perguntar como eu tô. E eu vou dizer que bem. E vão saber». Ele senta no braço do sofá. «Perdi o contrato em março. Todo mundo acha que tá tudo ótimo. Eu sou muito bom em parecer ótimo».`),
        choices: [
          K('care', t(`"I'm not going to ask if you're fine. I'm going to sit here."`, `«No te voy a preguntar si estás bien. Me voy a sentar aquí».`, `«Não vou perguntar se você tá bem. Vou sentar aqui».`), { do: { care: 1, bond: { dani: 2 }, soc: 4, flag: ['dani_open'] }, next: 'sit' }),
          K('honest', t(`"Tell Maru. She'd rather know than guess."`, `«Dile a Maru. Prefiere saberlo a adivinarlo».`, `«Conta pra Maru. Ela prefere saber a adivinhar».`), { do: { bond: { dani: 1, maru: 1 }, soc: 2, flag: ['dani_open', 'dani_tellmaru'] }, next: 'maru' })
        ]
      },
      sit: { text: t(`He doesn't say anything. You don't either. After a minute he leans his weight against your arm, the way he does when he's decided something. "Okay," he says. "Okay. Toast."`, `No dice nada. Tú tampoco. Después de un minuto apoya su peso en tu brazo, como cuando decidió algo. «Bueno», dice. «Bueno. Tostadas».`, `Ele não diz nada. Você também não. Depois de um minuto apoia o peso no seu braço, do jeito que faz quando decidiu alguma coisa. «Tá», diz. «Tá. Torrada».`), next: null },
      maru: { text: t(`"She'll be kind about it. That's the worst part." He laughs, short. "Okay. Tomorrow. I'll tell her tomorrow, with food." He puts his shoes back on the rack.`, `«Será amable al respecto. Esa es la peor parte». Se ríe, corto. «Bueno. Mañana. Se lo digo mañana, con comida». Vuelve a poner los zapatos en el zapatero.`, `«Ela vai ser gentil com isso. Essa é a pior parte». Ele ri, curto. «Tá. Amanhã. Eu conto amanhã, com comida». Devolve os sapatos pra sapateira.`), next: null },
      toast: { text: t(`"Toast," Benjamin says, struck by the idea. He sits. He eats. After the second slice the shoes are forgotten.`, `«Tostadas», dice Benjamin, golpeado por la idea. Se sienta. Come. Después de la segunda rebanada se olvida de los zapatos.`, `«Torrada», diz o Benjamin, atingido pela ideia. Ele senta. Come. Na segunda fatia, esquece os sapatos.`), next: null },
      admit: { text: t(`"Oh," Benjamin says, and the whole body goes with it. "Oh. I'm so tired." He laughs, then yawns. "I thought it was a feeling. It's just sleep." He lies down on the floor with his shoes on.`, `«Ah», dice Benjamin, y el cuerpo entero lo acompaña. «Ah. Estoy tan cansado». Se ríe, luego bosteza. «Creí que era un sentimiento. Es solo sueño». Se acuesta en el piso con los zapatos puestos.`, `«Ah», diz o Benjamin, e o corpo inteiro vai junto. «Ah. Eu tô tão cansado». Ele ri, depois boceja. «Achei que era um sentimento. É só sono». Deita no chão de sapato e tudo.`), next: null },
      chase: { text: t(`You walk him to the park, sit on a wall, and watch dog walkers. It's fun for twenty minutes. Then the sleep debt arrives all at once, and the whole morning weighs more than the whole night did.`, `Lo llevas al parque, se sientan en un muro y miran a los paseadores de perros. Es divertido veinte minutos. Luego llega de golpe la deuda de sueño, y toda la mañana pesa más que toda la noche.`, `Você leva ele ao parque, vocês sentam num muro e olham quem passeia com cachorro. É divertido por vinte minutos. Depois a dívida de sono chega de uma vez, e a manhã inteira pesa mais do que a noite inteira.`), next: null }
    }
  };

  /* ============================================================ FERNANDO, on the sofa */
  D.af_tato_sofa = {
    who: 'tato', role: t('ON THE SOFA', 'EN EL SOFÁ', 'NO SOFÁ'), start: 'a', nodes: {
      a: {
        text: t(`Fernando is on the sofa, one shoe on and one off, awake enough to watch you come in.`, `Feña está en el sofá, un zapato puesto y otro no, lo bastante despierto como para verte llegar.`, `O Fernando tá no sofá, um sapato calçado e outro não, acordado o bastante pra te ver chegar.`),
        choices: [
          K('care', t(`Sit on the floor next to him.`, `Sentarte en el piso junto a él.`, `Sentar no chão do lado dele.`), { next: 'b' }),
          K('care', t(`Put a blanket over him. Let him sleep.`, `Taparlo con una manta. Dejarlo dormir.`, `Cobrir com um cobertor. Deixar dormir.`), { do: { care: 1, bond: { tato: 1 }, flag: 'tato_blanket' }, next: null }),
          K('care', t(`Wake him properly and take him home.`, `Despertarlo bien y llevarlo a casa.`, `Acordar direito e levar pra casa.`), { do: { time: 35, bond: { tato: 2 }, call: 'af_tato_home', flag: 'tato_walked' }, next: null }),
          K('care', t(`Ask Benjamin to take him home.`, `Pedirle a Benjamin que lo lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('dani'), do: { time: 6, bond: { tato: 1, dani: 1 }, call: 'af_tato_dani', flag: 'tato_dani' }, next: null }),
          K('chill', t(`Leave him.`, `Dejarlo.`, `Deixar.`), { free: true, next: null })
        ]
      },
      b: {
        text: t(`"I'm thirty-four," he says to the ceiling. "Tonight was the first time my body felt like it was just mine. Not for anyone. Not for a joke. Just mine." A pause. "I didn't know that was available."`, `«Tengo treinta y cuatro», le dice al techo. «Esta noche fue la primera vez que sentí mi cuerpo solo mío. No para alguien. No para un chiste. Solo mío». Una pausa. «No sabía que eso estaba disponible».`, `«Tenho trinta e quatro», ele diz pro teto. «Hoje foi a primeira vez que senti meu corpo só meu. Não pra alguém. Não pra uma piada. Só meu». Uma pausa. «Eu não sabia que isso existia».`),
        choices: [
          K('honest', t(`"It's been available the whole time."`, `«Ha estado disponible todo el tiempo».`, `«Sempre esteve disponível».`), { do: { soc: 3, care: 1, bond: { tato: 1 }, flag: ['g_tato_open'] }, next: 'c' }),
          K('ask', t(`"What do you want to do with it?"`, `«¿Qué quieres hacer con eso?»`, `«O que você quer fazer com isso?»`), { do: { soc: 3, care: 1, bond: { tato: 1 }, flag: ['g_tato_open'] }, next: 'c2' })
        ]
      },
      c: { text: t(`"Yeah. It has." He closes his eyes. "Don't let me wake up weird. Walk me or leave me, but don't make me decide when I wake up."`, `«Sí. Lo ha estado». Cierra los ojos. «No me dejes despertar raro. Llévame o déjame, pero no me hagas decidir cuando despierte».`, `«É. Sempre esteve». Ele fecha os olhos. «Não me deixa acordar estranho. Me leva ou me deixa, mas não me faz decidir quando eu acordar».`), next: 'a2' },
      c2: { text: t(`"Wear it on the bus." He half laughs. "Tell Benjamin I said something wise. Then tell him I was asleep." He closes his eyes. "Walk me or leave me. Just don't make me decide when I wake up."`, `«Llevarlo en el bus». Se medio ríe. «Dile a Benjamin que dije algo sabio. Luego dile que estaba dormido». Cierra los ojos. «Llévame o déjame. Solo no me hagas decidir cuando despierte».`, `«Usar no ônibus». Ele meio ri. «Diz pro Benjamin que eu falei algo sábio. Depois diz que eu tava dormindo». Fecha os olhos. «Me leva ou me deixa. Só não me faz decidir quando eu acordar».`), next: 'a2' },
      a2: {
        text: t(`He is asleep before you answer.`, `Está dormido antes de que respondas.`, `Ele dorme antes de você responder.`),
        choices: [
          K('care', t(`Put a blanket over him. Let him sleep.`, `Taparlo con una manta. Dejarlo dormir.`, `Cobrir com um cobertor. Deixar dormir.`), { do: { care: 1, bond: { tato: 1 }, flag: 'tato_blanket' }, next: null }),
          K('care', t(`Wake him gently and take him home.`, `Despertarlo con cuidado y llevarlo a casa.`, `Acordar com jeito e levar pra casa.`), { do: { time: 35, bond: { tato: 2 }, call: 'af_tato_home', flag: 'tato_walked' }, next: null }),
          K('care', t(`Ask Benjamin to take him home.`, `Pedirle a Benjamin que lo lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('dani'), do: { time: 6, bond: { tato: 1, dani: 1 }, call: 'af_tato_dani', flag: 'tato_dani' }, next: null })
        ]
      }
    }
  };

  /* ============================================================ 7. THE QUESTION: who walks whom home */
  D.af_question = {
    forced: true, who: 'maru', role: t('THE QUESTION', 'LA PREGUNTA', 'A PERGUNTA'), start: 'a', nodes: {
      a: {
        text: t(`Late morning, and three things happen at once. Maru has gone quiet and is looking at her hands. Fernando has been asleep on the sofa for an hour. Benjamin is hunting for the next thing. You can't do all of it. You decide who walks whom home.`, `Media mañana, y pasan tres cosas a la vez. Maru se quedó callada y se mira las manos. Feña lleva una hora dormido en el sofá. Benjamin busca lo siguiente. No puedes con todo. Decides quién acompaña a quién a casa.`, `Fim de manhã, e três coisas acontecem ao mesmo tempo. A Maru ficou quieta e olha as próprias mãos. O Fernando dorme faz uma hora no sofá. O Benjamin procura a próxima coisa. Você não dá conta de tudo. Decide quem leva quem pra casa.`),
        next: 'm'
      },
      m: { branch: [{ req: withF('maru'), to: 'maru' }, { req: function (s) { return !!(s.after && s.after.f.tato && s.after.f.tato.st === 'sofa'); }, to: 'tato' }, { req: function () { return true; }, to: 'end' }] },
      maru: {
        who: 'maru',
        text: t(`"I'm okay," Maru says, in the voice that means she isn't. "I'm tired. It's more than tired. I got an offer in Montevideo and I haven't told anyone, because telling makes it real, and I'm the one who organises everything, and I don't know how to be the one who leaves."`, `«Estoy bien», dice Maru, con la voz que significa que no. «Estoy cansada. Es más que cansada. Me ofrecieron un trabajo en Montevideo y no se lo he dicho a nadie, porque decirlo lo hace real, y yo soy la que organiza todo, y no sé cómo ser la que se va».`, `«Tô bem», diz a Maru, na voz que quer dizer que não. «Tô cansada. É mais que cansada. Recebi uma proposta em Montevidéu e não contei pra ninguém, porque contar torna real, e eu sou a que organiza tudo, e não sei como ser a que vai embora».`),
        choices: [
          K('ask', t(`"What do you want to do?"`, `«¿Qué quieres hacer?»`, `«O que você quer fazer?»`), { do: { soc: 3, bond: { maru: 1 }, flag: ['g_maru_open'] }, next: 'maru2' }),
          K('care', t(`Walk Maru home yourself.`, `Acompañar tú a Maru hasta su casa.`, `Levar a Maru pra casa pessoalmente.`), { do: { time: 40, care: 1, bond: { maru: 2 }, call: 'af_maru_walk', flag: 'maru_walked' }, next: 'm2' }),
          K('care', t(`Ask Benjamin to take her home.`, `Pedirle a Benjamin que la lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('dani'), do: { time: 6, bond: { maru: 1, dani: 1 }, call: 'af_maru_dani', flag: 'maru_dani' }, next: 'm2' }),
          K('chill', t(`Book her a taxi and wait with her until it comes.`, `Pedirle un taxi y esperar con ella hasta que llegue.`, `Pedir um táxi e esperar com ela até chegar.`), { do: { time: 10, soc: -2, bond: { maru: 1 }, call: 'af_maru_taxi', flag: 'maru_taxi' }, next: 'm2' }),
          K('silent', t(`Hug her, let her go, and promise to text.`, `Abrazarla, dejarla ir y prometer escribirle.`, `Abraçar, deixar ir e prometer mandar mensagem.`), { do: { bond: { maru: 1 }, call: 'af_maru_alone' }, next: 'm2' })
        ]
      },
      maru2: {
        who: 'maru',
        text: t(`"I want it. That's the problem. I want it and I want all of you. I can't have both and I keep pretending I can." She wipes her face with her sleeve and laughs. "Don't tell Benjamin I cried. He'll make it a song."`, `«Lo quiero. Ese es el problema. Lo quiero y los quiero a todos ustedes. No puedo tener las dos cosas y sigo fingiendo que sí». Se limpia la cara con la manga y se ríe. «No le digas a Benjamin que lloré. Va a hacer una canción».`, `«Eu quero. Esse é o problema. Quero isso e quero vocês todos. Não dá pra ter os dois e eu fico fingindo que dá». Ela limpa o rosto com a manga e ri. «Não conta pro Benjamin que eu chorei. Ele vai fazer uma música».`),
        choices: [
          K('care', t(`Walk Maru home yourself.`, `Acompañar tú a Maru hasta su casa.`, `Levar a Maru pra casa pessoalmente.`), { do: { time: 40, care: 1, bond: { maru: 2 }, call: 'af_maru_walk', flag: 'maru_walked' }, next: 'm2' }),
          K('care', t(`Ask Benjamin to take her home.`, `Pedirle a Benjamin que la lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('dani'), do: { time: 6, bond: { maru: 1, dani: 1 }, call: 'af_maru_dani', flag: 'maru_dani' }, next: 'm2' }),
          K('chill', t(`Book her a taxi and wait with her until it comes.`, `Pedirle un taxi y esperar con ella hasta que llegue.`, `Pedir um táxi e esperar com ela até chegar.`), { do: { time: 10, soc: -2, bond: { maru: 1 }, call: 'af_maru_taxi', flag: 'maru_taxi' }, next: 'm2' }),
          K('silent', t(`Hug her, let her go, and promise to text.`, `Abrazarla, dejarla ir y prometer escribirle.`, `Abraçar, deixar ir e prometer mandar mensagem.`), { do: { bond: { maru: 1 }, call: 'af_maru_alone' }, next: 'm2' })
        ]
      },
      m2: { branch: [{ req: function (s) { return !!(s.after && s.after.f.tato && s.after.f.tato.st === 'sofa'); }, to: 'tato' }, { req: function () { return true; }, to: 'end' }] },
      tato: {
        who: 'tato',
        text: t(`Fernando snores under his sleeve. Nobody should drag him out of a sleep like that. But a sofa is not a bed, and the hosts have a day ahead of them.`, `Feña ronca bajo su manga. Nadie debería sacarlo de un sueño así. Pero un sofá no es una cama, y los anfitriones tienen un día por delante.`, `O Fernando ronca na manga. Ninguém devia arrancar ele de um sono desses. Mas sofá não é cama, e os anfitriões têm um dia pela frente.`),
        choices: [
          K('care', t(`Let him sleep. Dot says he can stay.`, `Dejarlo dormir. Dot dice que puede quedarse.`, `Deixar dormir. A Dot diz que ele pode ficar.`), { do: { bond: { tato: 1 }, flag: 'tato_stays' }, next: 'end' }),
          K('care', t(`Wake him gently and walk him home.`, `Despertarlo con cuidado y llevarlo a casa.`, `Acordar com jeito e levar pra casa.`), { do: { time: 35, bond: { tato: 2 }, call: 'af_tato_home', flag: 'tato_walked' }, next: 'end' }),
          K('care', t(`Ask Benjamin to take him home.`, `Pedirle a Benjamin que lo lleve a casa.`, `Pedir ao Benjamin pra levar pra casa.`), { req: withF('dani'), do: { time: 6, bond: { tato: 1, dani: 1 }, call: 'af_tato_dani', flag: 'tato_dani' }, next: 'end' })
        ]
      },
      end: { text: t(`Done. Nobody is lost, and everyone who leaves has a name next to theirs on the stairs.`, `Listo. Nadie está perdido, y quien se va tiene un nombre junto al suyo en la escalera.`, `Pronto. Ninguém tá perdido, e quem sai tem um nome do lado na escada.`), do: { quest: { q_af7: 'done' } }, next: null }
    }
  };

  /* ============================================================ the three scenes that close the chapter */
  D.af_noon = {
    forced: true, who: 'dot', role: t('NOON', 'MEDIODÍA', 'MEIO-DIA'), start: 'a', nodes: {
      a: {
        text: function (s) {
          const f = s.flags, out = [t(`The flat is quiet at noon. Sun on the floorboards, a kettle ticking as it cools, the records back in their sleeves in the order Anselm likes.`, `El departamento está en silencio a mediodía. Sol en el piso de madera, una tetera que tintinea al enfriarse, los discos de vuelta en sus fundas en el orden que le gusta a Anselm.`, `O apê tá quieto ao meio-dia. Sol no assoalho, uma chaleira estalando ao esfriar, os discos de volta nas capas na ordem que o Anselm gosta.`)];
          const opened = Object.keys(f).filter(function (k) { return /^g_.*_open$/.test(k); }).length;
          if (opened >= 3) out.push(t(`Dot, drying a mug: "People told you things this morning they don't tell the ones who love them. That's what an after is for. I'd rather it were something else, and it isn't."`, `Dot, secando una taza: «La gente te contó cosas esta mañana que no le cuenta a quienes la quieren. Para eso sirve un after. Preferiría que fuera para otra cosa, y no lo es».`, `A Dot, secando uma caneca: «As pessoas te contaram coisas essa manhã que não contam pra quem gosta delas. É pra isso que serve um after. Preferia que fosse pra outra coisa, e não é».`));
          if (f.af_clean || f.af_trash || f.brought_food) out.push(t(`She looks round the kitchen and finds it cleaner than the night before. "You washed up. You carried things. People think a host's burden is the party. It's the next day."`, `Mira la cocina y la encuentra más limpia que la noche anterior. «Lavaste. Cargaste cosas. La gente cree que la carga del anfitrión es la fiesta. Es el día siguiente».`, `Ela olha a cozinha e acha mais limpa que na noite anterior. «Você lavou. Carregou coisas. As pessoas acham que o peso do anfitrião é a festa. É o dia seguinte».`));
          if (f.door_pledge) out.push(t(`Anselm, hugging a sleeve: "You said you'd answer the door. You did. I kept all the records." He doesn't cry. He nearly does.`, `Anselm, abrazando una funda: «Dijiste que atenderías la puerta. Lo hiciste. Me quedé con todos los discos». No llora. Casi.`, `O Anselm, abraçando uma capa: «Você disse que atendia a porta. Atendeu. Fiquei com todos os discos». Não chora. Quase.`));
          else if (f.quiroga_warned) out.push(t(`Anselm, hugging a sleeve: "The building warned us once and let us stay. I think the Alvarados have forgiven us."`, `Anselm, abrazando una funda: «El edificio nos avisó una vez y nos dejó quedarnos. Creo que los Alvarado nos perdonaron».`, `O Anselm, abraçando uma capa: «O prédio avisou a gente uma vez e deixou ficar. Acho que os Alvarado perdoaram a gente».`));
          return out;
        },
        choices: [K('chill', t(`Put your shoes on. Say thank you.`, `Ponerte los zapatos. Dar las gracias.`, `Calçar os sapatos. Agradecer.`), { free: true, next: null })]
      }
    }
  };
  D.af_out = {
    forced: true, who: 'anselm', role: t('YOUR HOST', 'TU ANFITRIÓN', 'SEU ANFITRIÃO'), start: 'a', nodes: {
      a: {
        text: t(`Anselm doesn't raise his voice. "This is our home. You pushed twice. Please go." He holds the door open with one hand. Behind him you can hear the kettle.`, `Anselm no levanta la voz. «Esta es nuestra casa. Empujaste dos veces. Por favor, vete». Sostiene la puerta abierta con una mano. Detrás de él se oye la tetera.`, `O Anselm não levanta a voz. «Essa é a nossa casa. Você empurrou duas vezes. Por favor, vá embora». Ele segura a porta aberta com uma mão. Atrás dele dá pra ouvir a chaleira.`),
        choices: [K('care', t(`Apologise and go.`, `Pedir perdón e irte.`, `Pedir desculpa e ir.`), { free: true, next: null })]
      }
    }
  };
  D.af_evicted = {
    forced: true, who: 'quiroga', role: t('THE LANDLORD', 'EL DUEÑO', 'O DONO'), start: 'a', nodes: {
      a: {
        text: function (s) {
          return s.flags.warning_yours
            ? t(`The corridor, shoes in hand, one by one down the stairs. Quiroga holds the door for you and for nobody else. Behind you Anselm and Dot stay in the doorway, not waving, which is a kind of waving. "Thank you," says Quiroga. "I'm sorry. Good morning."`, `El pasillo, los zapatos en la mano, uno por uno por la escalera. Quiroga sostiene la puerta para ti y para nadie más. Detrás de ti Anselm y Dot se quedan en el umbral, sin saludar, que es una forma de saludar. «Gracias», dice Quiroga. «Lo siento. Buenos días».`, `O corredor, sapatos na mão, um por um escada abaixo. O Quiroga segura a porta pra você e pra mais ninguém. Atrás de você o Anselm e a Dot ficam na soleira, sem acenar, o que é um jeito de acenar. «Obrigado», diz o Quiroga. «Sinto muito. Bom dia».`)
            : t(`The corridor, shoes in hand, one by one down the stairs. Quiroga holds the door and counts the guests as they leave. "Thank you. I'm sorry. Good morning."`, `El pasillo, los zapatos en la mano, uno por uno por la escalera. Quiroga sostiene la puerta y cuenta a los invitados al salir. «Gracias. Lo siento. Buenos días».`, `O corredor, sapatos na mão, um por um escada abaixo. O Quiroga segura a porta e conta os convidados na saída. «Obrigado. Sinto muito. Bom dia».`);
        },
        choices: [K('chill', t(`Go home.`, `Irte a casa.`, `Ir pra casa.`), { free: true, next: null })]
      }
    }
  };
})();

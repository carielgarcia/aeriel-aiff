/* EXCUSE ME — story v34b: the club's staff and mid-cast get their second half. Same rules as story_v34.js: the hook stays, one choice
   leads to a turn and a close (g_<id>_open, once). The spine scenes (host, Rosa, Isi, ÆRIEL, Hugo, the roof) were already adult and
   are untouched; the staff and the one-reply characters around them are where the night had no feelings in it yet. */
'use strict';
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
      d3: close('frames', t(`"It is, mostly." They tap the sticker. "It would be better if one of us said it aloud. I think we both know which of us won't."`, `«Lo es, casi siempre». Golpean el sticker. «Sería mejor si uno de los dos lo dijera en voz alta. Creo que los dos sabemos cuál no lo hará».`, `«É, na maior parte». Eles batem no adesivo. «Seria melhor se um dos dois dissesse em voz alta. Acho que a gente sabe qual dos dois não vai».`), null, 'meet')
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

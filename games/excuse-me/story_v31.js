/* EXCUSE ME — story v31: THE AFTER, the guests, part one. Every guest who turns up at the flat has a real exchange with you:
   a hook, a turn that depends on what you ask, and a close with a cost or a gift. Adult register: people say what they mean, swear when they
   would, and talk about work, money, grief, desire, ageing and the scene itself. No aphorisms, no mascots. Each exchange ends on a flag
   (g_<id>_open ...) that the noon thread can read. Hugo, Rosa, Luca, Isi, Mika, Dario, Marga, Ezra. The other eight are in story_v31b.js. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T;
  const D = EM.DIALOGUES;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`Leave it there.`, `Dejarlo ahí.`, `Deixar por aqui.`), { free: true, next: null }); };
  /* a guest: id, role line, nodes */
  const G = function (id, role, nodes) { D['af_cam_' + id] = { who: id, role: role, start: 'a', nodes: nodes }; };
  const ROLE = {
    balcony: t('ON THE BALCONY', 'EN EL BALCÓN', 'NA VARANDA'), kitchen: t('IN THE KITCHEN', 'EN LA COCINA', 'NA COZINHA'),
    floor: t('ON THE FLOOR', 'EN EL PISO', 'NO CHÃO'), door: t('BY THE DOOR', 'JUNTO A LA PUERTA', 'PERTO DA PORTA')
  };

  /* ============================================================ HUGO: a retired driver, and a Monday he does not know how to be */
  G('hugo', ROLE.balcony, {
    a: {
      text: t(`Hugo is on the balcony with his shoes in his hand. "My knees quit around four. I didn't. I can't tell if that's good news."`, `Hugo está en el balcón con los zapatos en la mano. «A las cuatro se me rindieron las rodillas. Yo no. No sé si es una buena noticia».`, `O Hugo tá na varanda com os sapatos na mão. «Meus joelhos desistiram umas quatro. Eu não. Não sei se é boa notícia».`),
      choices: [
        K('chill', t(`Sit down next to him.`, `Sentarte a su lado.`, `Sentar do lado dele.`), { next: 'b' }),
        K('ask', t(`Ask what he does the rest of the week.`, `Preguntarle qué hace el resto de la semana.`, `Perguntar o que ele faz no resto da semana.`), { next: 'b2' }),
        LEAVE()
      ]
    },
    b: {
      text: t(`"Thirty years of Saturdays and I still bring my own slippers. Sit, sit. I'm not doing anything. That's the whole plan." He lets a minute go. "My daughter asked me last week why I still come. I said the music. Which is half."`, `«Treinta años de sábados y sigo trayendo mis pantuflas. Siéntate, siéntate. No estoy haciendo nada. Ese es todo el plan». Deja pasar un minuto. «Mi hija me preguntó la semana pasada por qué sigo viniendo. Le dije que por la música. Que es la mitad».`, `«Trinta anos de sábados e eu ainda trago meu chinelo. Senta, senta. Não tô fazendo nada. Esse é o plano todo». Ele deixa passar um minuto. «Minha filha me perguntou semana passada por que eu ainda venho. Falei que pela música. Que é metade».`),
      choices: [
        K('ask', t(`"What's the other half?"`, `«¿Y la otra mitad?»`, `«E a outra metade?»`), { next: 'c' }),
        K('silent', t(`Say nothing. Let him get there.`, `No decir nada. Dejar que llegue solo.`, `Não dizer nada. Deixar ele chegar lá.`), { do: { soc: 1 }, next: 'c' })
      ]
    },
    b2: {
      text: t(`"I drove the 42 bus for twenty-six years. Retired in March. Nobody here knows that and I'd like it kept that way. Six hours a week I'm someone who can dance, and nothing else."`, `«Manejé el 42 durante veintiséis años. Me jubilé en marzo. Nadie aquí lo sabe y prefiero que siga así. Seis horas a la semana soy alguien que sabe bailar, y nada más».`, `«Dirigi o 42 por vinte e seis anos. Me aposentei em março. Ninguém aqui sabe e prefiro que continue assim. Seis horas por semana eu sou alguém que sabe dançar, e mais nada».`),
      choices: [K('ask', t(`"Why keep it quiet?"`, `«¿Por qué mantenerlo en silencio?»`, `«Por que manter em segredo?»`), { next: 'c' })]
    },
    c: {
      text: t(`"Because on Monday I don't know who I am. That's the other half. Don't put it on a flyer." A pause. "She thinks I'm going to fall down a flight of stairs at a rave."`, `«Porque el lunes no sé quién soy. Esa es la otra mitad. No lo pongas en un volante». Una pausa. «Ella cree que me voy a caer por una escalera en una rave».`, `«Porque na segunda eu não sei quem eu sou. Essa é a outra metade. Não bota isso num panfleto». Uma pausa. «Ela acha que eu vou cair numa escada numa rave».`),
      choices: [
        K('honest', t(`"Tell her the half you told me."`, `«Dile la mitad que me dijiste a mí».`, `«Conta pra ela a metade que me contou».`), { next: 'e1' }),
        K('care', t(`"You're allowed a Saturday that's only yours."`, `«Tienes derecho a un sábado que sea solo tuyo».`, `«Você tem direito a um sábado só seu».`), { next: 'e2' }),
        K('care', t(`"If she ever asks me, I'll tell her what this was."`, `«Si algún día me pregunta, le cuento qué era esto».`, `«Se um dia ela me perguntar, eu conto o que era isso».`), { next: 'e3' })
      ]
    },
    e1: { text: t(`He laughs, short. "Tell my thirty-one-year-old that I'm lost on Mondays. Fuck. Okay. Maybe. Saturday, maybe." He puts his slippers on. "Thanks for not telling me it's fine."`, `Se ríe, corto. «Decirle a mi hija de treinta y uno que los lunes estoy perdido. Carajo. Bueno. Quizás. El sábado, quizás». Se pone las pantuflas. «Gracias por no decirme que está bien».`, `Ele ri, curto. «Contar pra minha filha de trinta e um que eu fico perdido nas segundas. Porra. Tá. Talvez. No sábado, talvez». Calça o chinelo. «Valeu por não me dizer que tá tudo bem».`), once: true, do: { soc: 3, care: 1, flag: ['g_hugo_open'] }, next: null },
    e2: { text: t(`"A Saturday only mine." He tries it twice, testing the weight. "I'll take it. Don't tell her I said it like that."`, `«Un sábado solo mío». Lo prueba dos veces, midiéndole el peso. «Lo acepto. No le digas que lo dije así».`, `«Um sábado só meu». Ele testa duas vezes, medindo o peso. «Eu aceito. Não conta que eu disse assim».`), once: true, do: { soc: 2, fun: 2, flag: ['g_hugo_open'] }, next: null },
    e3: { text: t(`He looks at you properly for the first time. "If she asks what this place was, say it was ours." You say it back to him. He nods once. "Good. Say it again in forty years."`, `Te mira de verdad por primera vez. «Si pregunta qué era este lugar, di que era nuestro». Se lo repites. Asiente una vez. «Bien. Dilo otra vez dentro de cuarenta años».`, `Ele te olha de verdade pela primeira vez. «Se ela perguntar o que era esse lugar, diz que era nosso». Você repete. Ele assente uma vez. «Bom. Diz de novo daqui a quarenta anos».`), once: true, do: { soc: 4, care: 2, flag: ['g_hugo_open', 'g_hugo_promise'] }, next: null }
  });

  /* ============================================================ ROSA: eleven hours on her feet, and the numbers in her notebook */
  G('rosa', ROLE.kitchen, {
    a: {
      text: t(`Rosa found the mop before she found a seat. "Eleven hours on my feet. Hosts shouldn't clean up after their own party, and I'm not a guest, I'm staff on her day off, which is the same job with worse snacks."`, `Rosa encontró el trapeador antes que una silla. «Once horas de pie. Los anfitriones no deberían limpiar su propia fiesta y yo no soy invitada, soy personal en mi día libre, que es el mismo trabajo con peores botanas».`, `A Rosa achou o esfregão antes de achar uma cadeira. «Onze horas de pé. Anfitrião não devia limpar a própria festa, e eu não sou convidada, sou funcionária no dia de folga, que é o mesmo trabalho com lanche pior».`),
      choices: [
        K('care', t(`Take the mop. "Sit. I've got it."`, `Quitarle el trapeador. «Siéntate. Yo me encargo».`, `Pegar o esfregão. «Senta. Eu faço».`), { do: { time: 5 }, next: 'b' }),
        K('ask', t(`Ask what she'd be doing if she weren't cleaning.`, `Preguntarle qué haría si no estuviera limpiando.`, `Perguntar o que ela faria se não estivesse limpando.`), { next: 'b2' }),
        LEAVE()
      ]
    },
    b: { text: t(`She lets go slowly. "Nobody's taken that off me in fourteen years." She sits, then stands again immediately. "What do I do with my hands?" A beat, and then, because she's tired, she answers her own question: "A co-op. That's what I'd do."`, `Lo suelta despacio. «En catorce años nadie me lo había quitado». Se sienta y se vuelve a parar de inmediato. «¿Qué hago con las manos?» Un momento, y como está cansada, se responde sola: «Una cooperativa. Eso haría».`, `Ela solta devagar. «Em catorze anos ninguém tirou isso de mim». Senta e levanta na hora. «O que eu faço com as mãos?» Um instante e, de cansada, ela mesma responde: «Uma cooperativa. É isso que eu faria».`), next: 'b2' },
    b2: {
      text: t(`"Eight of us. Cleaners. We'd do offices and venues like La Grieta, and be paid what the job is worth and not what the contractor decides. I've been writing the numbers in the back of this notebook for two years." She looks at you. "Is it crazy?"`, `«Ocho personas. Limpiadoras. Haríamos oficinas y locales como La Grieta, y nos pagarían lo que vale el trabajo y no lo que decide el contratista. Llevo dos años escribiendo los números atrás de esta libreta». Te mira. «¿Estoy loca?»`, `«Oito pessoas. Faxineiras. A gente atenderia escritórios e casas como a La Grieta, e receberia o que o trabalho vale e não o que o empreiteiro decide. Faz dois anos que escrevo os números no fundo desse caderno». Ela te olha. «É loucura?»`),
      choices: [
        K('honest', t(`Ask to read the numbers.`, `Pedirle leer los números.`, `Pedir pra ler os números.`), { next: 'e1' }),
        K('care', t(`"It's not crazy. What scares you?"`, `«No estás loca. ¿Qué te asusta?»`, `«Não é loucura. O que te assusta?»`), { next: 'e2' })
      ]
    },
    e1: { text: t(`She hands it over: columns in pencil, ruled with a bus pass. You read for five minutes. The numbers hold except one line, and you point at it. "Insurance. Yes. I know." She takes it back and writes in the margin. "You're the first person who read it."`, `Te lo pasa: columnas a lápiz, trazadas con una tarjeta de bus. Lees cinco minutos. Los números cierran menos una línea, y la señalas. «El seguro. Sí. Lo sé». Lo recupera y escribe en el margen. «Eres la primera persona que lo lee».`, `Ela entrega: colunas a lápis, riscadas com um cartão de ônibus. Você lê por cinco minutos. Os números fecham, menos uma linha, e você aponta. «O seguro. É. Eu sei». Ela pega de volta e escreve na margem. «Você é a primeira pessoa que lê».`), once: true, do: { time: 6, soc: 4, care: 1, flag: ['g_rosa_open'] }, next: null },
    e2: { text: t(`"That I'm fifty-two, and the first man I'd have to ask for money is the one who calls me Rosita." She laughs with no humour in it. "It's not crazy. Say it again." You say it again.`, `«Que tengo cincuenta y dos y el primer hombre al que tendría que pedirle plata es el que me dice Rosita». Se ríe sin gracia. «No es una locura. Dilo otra vez». Lo repites.`, `«Que eu tenho cinquenta e dois e o primeiro homem a quem eu teria que pedir dinheiro é o que me chama de Rosinha». Ela ri sem graça nenhuma. «Não é loucura. Fala de novo». Você repete.`), once: true, do: { soc: 3, fun: 1, flag: ['g_rosa_open'] }, next: null }
  });

  /* ============================================================ LUCA: the stage manager who hands out coats */
  G('luca', ROLE.floor, {
    a: {
      text: t(`Luca, off the coat check at last, holds a mug in both hands. "Nobody's handed me a coat in two hours. I don't know what to do with my arms."`, `Luca, por fin libre del guardarropa, sostiene una taza con las dos manos. «Hace dos horas que nadie me da un abrigo. No sé qué hacer con los brazos».`, `O Luca, finalmente fora da chapelaria, segura uma caneca com as duas mãos. «Faz duas horas que ninguém me entrega um casaco. Não sei o que fazer com os braços».`),
      choices: [
        K('ask', t(`Ask how long he's done the job.`, `Preguntarle cuánto lleva en el puesto.`, `Perguntar há quanto tempo ele faz isso.`), { next: 'b' }),
        K('joke', t(`Ask how the dread is doing tonight.`, `Preguntarle cómo anda la angustia esta noche.`, `Perguntar como anda a angústia hoje.`), { next: 'b0' }),
        LEAVE()
      ]
    },
    b0: { text: t(`"Chapter three. 'The Coat Nobody Claimed.' It's about me, obviously."`, `«Capítulo tres. 'El abrigo que nadie reclamó'. Es sobre mí, obvio».`, `«Capítulo três. 'O Casaco Que Ninguém Pegou'. É sobre mim, óbvio».`), next: 'b' },
    b: {
      text: t(`"Eleven years. I wanted to stage-manage. I got as far as being the one who hands over jackets at the stage-managed thing." He shrugs. "I'm good at it. That's the problem. You don't quit what you're good at."`, `«Once años. Yo quería ser regidor. Llegué hasta ser el que entrega las chaquetas en el evento que otro regía». Se encoge de hombros. «Soy bueno en esto. Ese es el problema. Uno no deja lo que hace bien».`, `«Onze anos. Eu queria ser contrarregra. Cheguei a ser o cara que entrega jaqueta no evento que outro contrarregrava». Ele dá de ombros. «Sou bom nisso. Esse é o problema. A gente não larga o que faz bem».`),
      choices: [K('ask', t(`"What would you have called tonight?"`, `«¿Cómo habrías cantado esta noche?»`, `«Como você teria marcado essa noite?»`), { next: 'c' })]
    },
    c: {
      text: t(`"Cue seven, the roof opens. Cue eight, everybody stops talking for twenty seconds. I'd have got it right." He is quiet. "Does the job count? I mean as a thing a person did."`, `«Pie siete, se abre el techo. Pie ocho, todos se callan veinte segundos. Lo habría clavado». Se queda callado. «¿El trabajo cuenta? Digo, como algo que hizo una persona».`, `«Deixa sete, o terraço abre. Deixa oito, todo mundo cala por vinte segundos. Eu teria acertado». Ele fica quieto. «O trabalho conta? Quero dizer, como uma coisa que uma pessoa fez».`),
      choices: [
        K('honest', t(`Tell him one specific thing he did tonight that mattered.`, `Decirle algo concreto que hizo esta noche y que importó.`, `Dizer uma coisa concreta que ele fez hoje e que importou.`), { next: 'e1' }),
        K('care', t(`Tell him the dream counts too.`, `Decirle que el sueño también cuenta.`, `Dizer que o sonho também conta.`), { next: 'e2' })
      ]
    },
    e1: { text: t(`"The coat with the inhaler in the pocket. Yeah." He rubs his neck. "I found the guy in time. I never mentioned it." He puts the mug down. "Okay. It counts."`, `«El abrigo con el inhalador en el bolsillo. Sí». Se frota el cuello. «Encontré al tipo a tiempo. Nunca lo mencioné». Deja la taza. «Está bien. Cuenta».`, `«O casaco com a bombinha no bolso. É». Ele esfrega o pescoço. «Achei o cara a tempo. Nunca comentei». Larga a caneca. «Tá. Conta».`), once: true, do: { soc: 4, fun: 2, care: 1, flag: ['g_luca_open'] }, next: null },
    e2: { text: t(`"That's kind. It's also what you say to a man holding a mug." He smiles anyway. "Thanks."`, `«Es amable. También es lo que se le dice a un hombre con una taza». Sonríe igual. «Gracias».`, `«É gentil. Também é o que se diz pra um homem segurando uma caneca». Ele sorri mesmo assim. «Valeu».`), once: true, do: { soc: 2, flag: ['g_luca_open'] }, next: null }
  });

  /* ============================================================ ISI: the table, and being allowed to be tired */
  G('nuri', ROLE.kitchen, {
    a: {
      text: t(`Isi is checking the bread with the care she gives a reagent. Grey under the eyes. "Carbs aren't a reagent either. They work, though."`, `Isi revisa el pan con el cuidado que le da a un reactivo. Ojeras grises. «Los carbohidratos tampoco son un reactivo. Pero funcionan».`, `A Isi confere o pão com o cuidado que dá a um reagente. Olheiras cinzentas. «Carboidrato também não é reagente. Mas funciona».`),
      choices: [
        K('care', t(`Ask how she is. Mean it.`, `Preguntarle cómo está. De verdad.`, `Perguntar como ela tá. De verdade.`), { next: 'b' }),
        K('care', t(`Take the bread off her. "Sit."`, `Quitarle el pan. «Siéntate».`, `Tirar o pão dela. «Senta».`), { next: 'b0' }),
        LEAVE()
      ]
    },
    b0: { text: t(`She lets you. "Don't be nice to me. I'll cry on the toast."`, `Te deja. «No seas amable conmigo. Voy a llorar sobre la tostada».`, `Ela deixa. «Não seja gentil comigo. Vou chorar na torrada».`), next: 'b' },
    b: {
      text: t(`"Third night this week. I'm good at the table. I'm bad at being a person on Mondays." She says it to the bread. "I don't want to quit. I want it to be allowed to be tiring."`, `«Tercera noche esta semana. Soy buena en la mesa. Soy mala siendo persona los lunes». Se lo dice al pan. «No quiero renunciar. Quiero que esté permitido que cansa».`, `«Terceira noite essa semana. Sou boa na mesa. Sou ruim em ser pessoa nas segundas». Ela diz pro pão. «Não quero largar. Quero que seja permitido cansar».`),
      choices: [K('ask', t(`"What would make it allowed?"`, `«¿Qué lo haría permitido?»`, `«O que tornaria isso permitido?»`), { next: 'c' })]
    },
    c: {
      text: t(`"Somebody saying 'that was hard', and nobody adding 'but it's so important'. It is important. It's also hard. Both."`, `«Que alguien diga 'estuvo duro' y que nadie agregue 'pero es tan importante'. Es importante. También es duro. Las dos cosas».`, `«Alguém dizer 'foi pesado' e ninguém completar 'mas é tão importante'. É importante. Também é pesado. Os dois».`),
      choices: [
        K('care', t(`Say it: "That was hard."`, `Decirlo: «Estuvo duro».`, `Dizer: «Foi pesado».`), { next: 'e1' }),
        K('ask', t(`Ask what she'd tell a volunteer in her place.`, `Preguntarle qué le diría a un voluntario en su lugar.`, `Perguntar o que ela diria a uma voluntária no lugar dela.`), { next: 'e2' })
      ]
    },
    e1: { text: t(`She is quiet. "Yeah. It was." She wipes her face with the back of her wrist. "Thank you. Nobody's said that."`, `Se queda callada. «Sí. Lo fue». Se limpia la cara con el dorso de la muñeca. «Gracias. Nadie lo había dicho».`, `Ela fica quieta. «É. Foi». Limpa o rosto com as costas do pulso. «Obrigada. Ninguém tinha dito».`), once: true, do: { care: 1, soc: 4, hp: 2, flag: ['g_isi_open'] }, next: null },
    e2: { text: t(`"I'd tell them to go home. Right now." A beat. "…Okay. Ten minutes. Then I go home." She sits down.`, `«Le diría que se fuera a casa. Ya». Una pausa. «…Está bien. Diez minutos. Luego me voy a casa». Se sienta.`, `«Eu diria pra ir pra casa. Agora». Uma pausa. «…Tá. Dez minutos. Depois eu vou pra casa». Ela senta.`), once: true, do: { soc: 3, care: 1, flag: ['g_isi_open'] }, next: null }
  });

  /* ============================================================ MIKA: the stalls, and a father who cleaned offices at night */
  G('mika', ROLE.door, {
    a: {
      text: t(`Mika is waiting for the toilet like everyone else. "I clean bathrooms for a living. Please don't look at the sink."`, `Mika espera el baño como todos. «Limpio baños para vivir. Por favor no mires el lavabo».`, `O Mika espera o banheiro que nem todo mundo. «Eu limpo banheiro pra viver. Por favor não olha pra pia».`),
      choices: [
        K('ask', t(`Ask how a Saturday looks from the stalls.`, `Preguntarle cómo se ve un sábado desde los cubículos.`, `Perguntar como é um sábado visto das cabines.`), { next: 'b' }),
        K('care', t(`Tell him the stalls held tonight. Thank him.`, `Decirle que los cubículos aguantaron esta noche. Agradecerle.`, `Dizer que as cabines aguentaram hoje. Agradecer.`), { next: 'b' }),
        LEAVE()
      ]
    },
    b: {
      text: t(`"Four hundred people, and what they remember is whether the room felt clean. They don't remember me. That's the job: be remembered by nobody." He says it flat. "My father cleaned offices at night. He used to say a room remembers who cleaned it. I thought it was something you tell a kid."`, `«Cuatrocientas personas, y lo que recuerdan es si el cuarto se sentía limpio. A mí no me recuerdan. Ese es el trabajo: que nadie te recuerde». Lo dice sin inflexión. «Mi papá limpiaba oficinas de noche. Decía que un cuarto se acuerda de quién lo limpió. Yo pensaba que era algo que se le dice a un niño».`, `«Quatrocentas pessoas, e o que elas lembram é se o lugar parecia limpo. De mim ninguém lembra. Esse é o trabalho: ser lembrado por ninguém». Ele diz sem entonação. «Meu pai limpava escritório de noite. Dizia que um lugar lembra de quem limpou. Eu achava que era coisa que se diz pra criança».`),
      choices: [K('ask', t(`"Is it true?"`, `«¿Es verdad?»`, `«É verdade?»`), { next: 'c' })]
    },
    c: {
      text: t(`"It's true. I can walk into any room and tell you who was in it last, and whether they cared." He glances at the sink and away. "Nobody asked me that before."`, `«Es verdad. Puedo entrar a cualquier cuarto y decirte quién estuvo último, y si le importó». Mira el lavabo y desvía la vista. «Antes nadie me lo había preguntado».`, `«É verdade. Eu entro em qualquer lugar e te digo quem foi o último, e se ligou pro lugar». Ele olha a pia e desvia. «Ninguém tinha me perguntado isso».`),
      choices: [
        K('care', t(`Tell him whoever was last in these stalls cared.`, `Decirle que quien estuvo último en esos cubículos se preocupó.`, `Dizer que quem foi o último nessas cabines se importou.`), { next: 'e1' }),
        K('ask', t(`Ask what he'd tell his father.`, `Preguntarle qué le diría a su papá.`, `Perguntar o que ele diria ao pai.`), { next: 'e2' })
      ]
    },
    e1: { text: t(`He nods at the wall. "Yeah. They did." He lets out a breath through his nose. "Go. Use the toilet. It's clean."`, `Asiente hacia la pared. «Sí. Se preocuparon». Suelta el aire por la nariz. «Ve. Usa el baño. Está limpio».`, `Ele assente pra parede. «É. Se importaram». Solta o ar pelo nariz. «Vai. Usa o banheiro. Tá limpo».`), once: true, do: { soc: 3, flag: ['g_mika_open'] }, next: null },
    e2: { text: t(`"That the stalls held." His voice catches on it and he lets it. "He'd know what that meant."`, `«Que los cubículos aguantaron». Se le corta la voz y lo deja pasar. «Él sabría lo que significa».`, `«Que as cabines aguentaram». A voz falha e ele deixa. «Ele ia saber o que isso significa».`), once: true, do: { soc: 3, care: 1, flag: ['g_mika_open'] }, next: null }
  });

  /* ============================================================ DARIO: forty "ask firsts" a night, and one question for himself */
  G('dario', ROLE.door, {
    a: {
      text: t(`Dario stands by the front door, arms folded, the habit of the job. "Nobody's guarding anything. I just like to know where the exit is."`, `Dario está junto a la puerta, con los brazos cruzados, la costumbre del oficio. «Nadie cuida nada. Solo me gusta saber dónde está la salida».`, `O Dario tá perto da porta, braços cruzados, hábito do ofício. «Ninguém tá vigiando nada. Só gosto de saber onde fica a saída».`),
      choices: [
        K('honest', t(`Say the three rules sound different when he says them.`, `Decirle que las tres reglas suenan distintas cuando las dice él.`, `Dizer que as três regras soam diferentes quando é ele que fala.`), { next: 'b' }),
        K('ask', t(`Ask what he wants, for once.`, `Preguntarle qué quiere él, por una vez.`, `Perguntar o que ele quer, pra variar.`), { next: 'b2' }),
        LEAVE()
      ]
    },
    b: { text: t(`"Forty times a night. Ask first. A yes is a word." A pause. "I've never once asked myself. It's an occupational thing: you're the one who tells everybody else."`, `«Cuarenta veces por noche. Pregunta primero. Un sí es una palabra». Una pausa. «Nunca me lo pregunté a mí. Es una cosa del oficio: eres el que se lo dice a todos los demás».`, `«Quarenta vezes por noite. Pergunta primeiro. Um sim é uma palavra». Uma pausa. «Nunca perguntei pra mim. É coisa do ofício: você é quem diz pra todo mundo».`), next: 'b2' },
    b2: {
      text: t(`He looks at the plant by the door. "I haven't been touched on purpose in about a year. I don't know how to ask for it without it sounding like I'm on duty." He keeps his hands in his pockets. "Dance with me. Slow. One song. If you say no, that's the end of it and I'll thank you."`, `Mira la planta junto a la puerta. «Hace como un año que nadie me toca a propósito. No sé cómo pedirlo sin que suene a que estoy de guardia». Mantiene las manos en los bolsillos. «Baila conmigo. Lento. Una canción. Si dices que no, ahí termina y te lo agradezco».`, `Ele olha a planta perto da porta. «Faz uns um ano que ninguém me toca de propósito. Não sei como pedir sem parecer que tô de plantão». Mantém as mãos nos bolsos. «Dança comigo. Devagar. Uma música. Se você disser que não, acabou ali e eu agradeço».`),
      choices: [
        K('flirt', t(`"Yes."`, `«Sí».`, `«Sim».`), { next: 'e1' }),
        K('care', t(`"No. Thank you for asking like that."`, `«No. Gracias por preguntarlo así».`, `«Não. Obrigado por perguntar desse jeito».`), { next: 'e2' })
      ]
    },
    e1: { text: t(`You dance in the corner by the plant, to nothing, to the radio coming up through the floor. He leads badly and tells you so. Halfway through he stops apologising. When it ends he says, "That was a yes. Thanks."`, `Bailan en la esquina junto a la planta, sin música, con la radio que sube por el piso. Él guía mal y te lo dice. A mitad deja de pedir perdón. Cuando termina dice: «Eso fue un sí. Gracias».`, `Vocês dançam no canto perto da planta, sem música, com o rádio subindo pelo chão. Ele conduz mal e avisa. No meio ele para de pedir desculpa. Quando acaba, diz: «Isso foi um sim. Valeu».`), once: true, do: { fun: 4, soc: 4, care: 1, flag: ['g_dario_open'] }, next: null },
    e2: { text: t(`"Thank you for saying it." He is smiling, properly. "That's the first time anybody's said no to me and I've enjoyed it."`, `«Gracias por decirlo». Sonríe, de verdad. «Es la primera vez que alguien me dice que no y lo disfruto».`, `«Obrigado por dizer». Ele sorri, de verdade. «É a primeira vez que alguém me diz não e eu curto».`), once: true, do: { soc: 3, flag: ['g_dario_open'] }, next: null }
  });

  /* ============================================================ MARGA: twenty-two years and eleven plants */
  G('marga', ROLE.balcony, {
    a: {
      text: t(`Marga is counting the plants on the railing. "Eleven. All alive. This flat is run better than my life."`, `Marga cuenta las plantas de la baranda. «Once. Todas vivas. Este departamento está mejor administrado que mi vida».`, `A Marga conta as plantas do parapeito. «Onze. Todas vivas. Esse apê é mais bem administrado que a minha vida».`),
      choices: [
        K('ask', t(`Ask about her life.`, `Preguntarle por su vida.`, `Perguntar da vida dela.`), { next: 'b' }),
        K('care', t(`Offer her coffee.`, `Ofrecerle un café.`, `Oferecer um café.`), { next: 'b' }),
        LEAVE()
      ]
    },
    b: {
      text: t(`"Twenty-two years married. We're 'taking a break', which means he took the car." She tries to smile. "I came tonight because I wanted to be somewhere he's never been. And I'm having a great time. And I'm sad. Both."`, `«Veintidós años casada. Estamos 'tomándonos un tiempo', que significa que se llevó el auto». Intenta sonreír. «Vine esta noche porque quería estar en un lugar donde él nunca estuvo. Y la estoy pasando genial. Y estoy triste. Las dos cosas».`, `«Vinte e dois anos casada. A gente tá 'dando um tempo', o que significa que ele levou o carro». Ela tenta sorrir. «Vim hoje porque queria estar num lugar onde ele nunca esteve. E tô me divertindo muito. E tô triste. Os dois».`),
      choices: [K('care', t(`"Both can be true."`, `«Las dos cosas pueden ser verdad».`, `«Os dois podem ser verdade».`), { next: 'c' })]
    },
    c: {
      text: t(`"I want to text him: I'm at an after, I'm happy. And I can't tell if that's a gift or a knife."`, `«Quiero escribirle: estoy en un after, estoy feliz. Y no sé si es un regalo o una puñalada».`, `«Quero mandar mensagem: tô num after, tô feliz. E não sei se isso é presente ou facada».`),
      choices: [
        K('honest', t(`"Tomorrow. Not now."`, `«Mañana. No ahora».`, `«Amanhã. Agora não».`), { next: 'e1' }),
        K('care', t(`"Don't. Not at all."`, `«No. Nada».`, `«Não. De jeito nenhum».`), { next: 'e2' }),
        K('ask', t(`"What do you want him to say back?"`, `«¿Qué quieres que te conteste?»`, `«O que você quer que ele responda?»`), { next: 'e3' })
      ]
    },
    e1: { text: t(`"Tomorrow. Yes. Tomorrow I'm someone who slept." She breathes out. "Thank you. I'd have sent it at the next red light."`, `«Mañana. Sí. Mañana soy alguien que durmió». Suelta el aire. «Gracias. Lo habría mandado en el próximo semáforo».`, `«Amanhã. É. Amanhã eu sou alguém que dormiu». Solta o ar. «Obrigada. Eu teria mandado no próximo sinal vermelho».`), once: true, do: { soc: 3, care: 1, flag: ['g_marga_open'] }, next: null },
    e2: { text: t(`"Not at all. God. That's harder." She laughs, wet-eyed. "Thank you. Somebody had to say it out loud."`, `«Nada. Dios. Eso es más difícil». Se ríe, con los ojos húmedos. «Gracias. Alguien tenía que decirlo en voz alta».`, `«De jeito nenhum. Meu Deus. Isso é mais difícil». Ela ri, de olho molhado. «Obrigada. Alguém tinha que dizer em voz alta».`), once: true, do: { soc: 2, flag: ['g_marga_open'] }, next: null },
    e3: { text: t(`She thinks for a long time. "Nothing. I want him to say nothing, and to have read it." A small, surprised laugh. "That's the answer. I didn't know."`, `Piensa un buen rato. «Nada. Quiero que no diga nada, y que lo haya leído». Una risa pequeña y sorprendida. «Esa es la respuesta. No lo sabía».`, `Ela pensa um bom tempo. «Nada. Quero que ele não diga nada, e que tenha lido». Uma risada pequena, surpresa. «Essa é a resposta. Eu não sabia».`), once: true, do: { soc: 4, care: 1, flag: ['g_marga_open'] }, next: null }
  });

  /* ============================================================ EZRA: a funeral on Thursday */
  G('ezra', ROLE.balcony, {
    a: {
      text: t(`Ezra is holding a mug upside down, notices, and doesn't fix it. "Thursday was my dad's funeral. This is the first place that hasn't asked me how I'm doing."`, `Ezra sostiene una taza al revés, lo nota y no la corrige. «El jueves fue el funeral de mi papá. Este es el primer lugar que no me pregunta cómo estoy».`, `O Ezra segura uma caneca de cabeça pra baixo, nota e não corrige. «Quinta foi o enterro do meu pai. Esse é o primeiro lugar que não me pergunta como eu tô».`),
      choices: [
        K('silent', t(`Don't ask. Sit.`, `No preguntar. Sentarte.`, `Não perguntar. Sentar.`), { next: 'b' }),
        K('ask', t(`Ask about his dad.`, `Preguntarle por su papá.`, `Perguntar do pai dele.`), { next: 'b2' }),
        LEAVE()
      ]
    },
    b: {
      text: t(`He's quiet a minute. "Good. Thanks." Then: "He hated this music. He'd have stood in the corner with his arms folded and told everyone about the acoustics. I keep looking for him in the corner."`, `Se queda callado un minuto. «Bien. Gracias». Luego: «Odiaba esta música. Se habría parado en la esquina con los brazos cruzados contándole a todos de la acústica. Sigo buscándolo en la esquina».`, `Ele fica quieto um minuto. «Bom. Valeu». Depois: «Ele odiava essa música. Ia ficar no canto de braço cruzado contando da acústica pra todo mundo. Eu continuo procurando ele no canto».`),
      next: 'c'
    },
    b2: { text: t(`"Plumber, forty years. Terrible dancer. He knew every pipe in this city and not one person in it by name, except me."`, `«Plomero, cuarenta años. Pésimo bailarín. Conocía cada tubería de esta ciudad y a ninguna persona por su nombre, menos a mí».`, `«Encanador, quarenta anos. Péssimo dançarino. Conhecia cada cano dessa cidade e nenhuma pessoa pelo nome, menos eu».`), next: 'c' },
    c: {
      text: t(`"Is it okay that I'm having a good time?"`, `«¿Está bien que me la esté pasando bien?»`, `«Tá tudo bem eu estar me divertindo?»`),
      choices: [
        K('honest', t(`"Yes. Plainly, yes."`, `«Sí. Sin vueltas, sí».`, `«Sim. Sem rodeio, sim».`), { next: 'e1' }),
        K('care', t(`"If you need to cry, go. I'll cover for you."`, `«Si necesitas llorar, ve. Yo te cubro».`, `«Se precisar chorar, vai. Eu te cubro».`), { next: 'e2' })
      ]
    },
    e1: { text: t(`"Okay." He turns the mug the right way up, finally. "Okay. Thank you. I think I needed it said by someone who didn't love him."`, `«Está bien». Por fin da vuelta la taza. «Está bien. Gracias. Creo que necesitaba que lo dijera alguien que no lo quería».`, `«Tá bom». Ele desvira a caneca, finalmente. «Tá bom. Obrigado. Acho que eu precisava que alguém que não gostava dele dissesse».`), once: true, do: { soc: 4, care: 1, flag: ['g_ezra_open'] }, next: null },
    e2: { text: t(`He cries into his sleeve for a minute, then laughs at how loud it was. "Fuck. Sorry. Thank you for covering." He wipes his face with the whole forearm.`, `Llora en la manga un minuto y luego se ríe de lo fuerte que fue. «Mierda. Perdón. Gracias por cubrirme». Se limpia la cara con todo el antebrazo.`, `Ele chora na manga por um minuto e depois ri de como foi alto. «Merda. Desculpa. Valeu por me cobrir». Limpa o rosto com o antebraço inteiro.`), once: true, do: { soc: 4, care: 1, hp: 2, flag: ['g_ezra_open'] }, next: null }
  });
})();

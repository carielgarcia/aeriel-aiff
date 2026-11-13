/* EXCUSE ME — story v31b: THE AFTER, the guests, part two. Juno, Ximena, Kiki, Sol, Hazel, Oz, ÆRIEL, FRAMES SHELL.
   Same rules as story_v31.js: a hook, a turn, a close with a cost or a gift, adult register, a flag at the end. Kiki and FRAMES SHELL
   ask Anselm for the turntable (ask first, always), which costs a little NOISE and pays in the room. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T;
  const D = EM.DIALOGUES, S = EM.scripts;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`Leave it there.`, `Dejarlo ahí.`, `Deixar por aqui.`), { free: true, next: null }); };
  const G = function (id, role, nodes) { D['af_cam_' + id] = { who: id, role: role, start: 'a', nodes: nodes }; };
  const ROLE = {
    coats: t('IN THE COATS', 'ENTRE LOS ABRIGOS', 'NOS CASACOS'), floor: t('ON THE FLOOR', 'EN EL PISO', 'NO CHÃO'),
    balcony: t('ON THE BALCONY', 'EN EL BALCÓN', 'NA VARANDA'), sofa: t('ON THE SOFA', 'EN EL SOFÁ', 'NO SOFÁ')
  };
  S.af_noise4 = function () { if (EM.AF) EM.AF.noise(4); };
  S.af_noise3 = function () { if (EM.AF) EM.AF.noise(3); };

  /* ============================================================ JUNO: three years without sleeping properly */
  G('juno', ROLE.coats, {
    a: {
      text: t(`Juno has built a nest of four coats and is lying in it with one eye open. "Wake me for the toast."`, `Juno armó un nido con cuatro abrigos y está acostado con un ojo abierto. «Despiértame para las tostadas».`, `O Juno montou um ninho com quatro casacos e tá deitado com um olho aberto. «Me acorda pra torrada».`),
      choices: [
        K('ask', t(`Ask if they sleep well.`, `Preguntarle si duerme bien.`, `Perguntar se dorme bem.`), { next: 'b' }),
        K('chill', t(`Let them sleep.`, `Dejarlos dormir.`, `Deixar dormir.`), { free: true, next: null })
      ]
    },
    b: { text: t(`"I haven't slept properly in three years. Anywhere. Except in places like this, with strangers' coats and a radio on. Isn't that stupid."`, `«Hace tres años que no duermo bien. En ningún lado. Menos en lugares como este, con abrigos de extraños y una radio prendida. Qué estupidez».`, `«Faz três anos que eu não durmo direito. Em lugar nenhum. Menos em lugares assim, com casaco de estranho e rádio ligado. Que burrice».`), choices: [K('ask', t(`"What happens at home?"`, `«¿Qué pasa en tu casa?»`, `«O que acontece em casa?»`), { next: 'c' })] },
    c: {
      text: t(`"My head starts doing the accounts. Everything I said in 2019. I get up at four and make the bed again." Quiet. "Would you stay till I'm out? Ten minutes. You don't have to."`, `«Mi cabeza empieza a hacer cuentas. Todo lo que dije en 2019. Me levanto a las cuatro y vuelvo a hacer la cama». Silencio. «¿Te quedarías hasta que me duerma? Diez minutos. No tienes que hacerlo».`, `«Minha cabeça começa a fazer as contas. Tudo que eu disse em 2019. Eu levanto às quatro e arrumo a cama de novo». Silêncio. «Você ficaria até eu apagar? Dez minutos. Não precisa».`),
      choices: [
        K('care', t(`Stay. Ten minutes.`, `Quedarte. Diez minutos.`, `Ficar. Dez minutos.`), { next: 'e1' }),
        K('honest', t(`Say you can give five, then somebody else needs you. Mean it.`, `Decir que puedes cinco y que luego te necesita otra persona. Decirlo en serio.`, `Dizer que dá pra cinco e depois outra pessoa precisa de você. Falar a sério.`), { next: 'e2' })
      ]
    },
    e1: { text: t(`Eleven minutes, and they are gone. The radio downstairs plays something with a trumpet in it. You get up very slowly and the coats rustle and nothing wakes.`, `Once minutos y se duermen. La radio de abajo toca algo con una trompeta. Te levantas muy despacio, los abrigos crujen y no se despierta nadie.`, `Onze minutos e o Juno apaga. O rádio lá embaixo toca algo com trompete. Você levanta bem devagar, os casacos farfalham e ninguém acorda.`), once: true, do: { time: 10, soc: 4, care: 1, flag: ['g_juno_open'] }, next: null },
    e2: { text: t(`"That's fair. Thank you for telling me, instead of disappearing." They close their eyes. "Five is plenty. Five is more than I'd have asked a stranger for."`, `«Es justo. Gracias por decírmelo, en vez de desaparecer». Cierran los ojos. «Cinco es mucho. Es más de lo que le habría pedido a un extraño».`, `«Justo. Obrigado por me falar, em vez de sumir». Fecha os olhos. «Cinco é muito. É mais do que eu pediria a um estranho».`), once: true, do: { time: 5, soc: 3, flag: ['g_juno_open'] }, next: null }
  });

  /* ============================================================ XIMENA: a track nobody has heard */
  G('ximena', ROLE.floor, {
    a: {
      text: t(`Ximena is sitting on the rug with her phone held against her chest. "I have a track on here. Nobody's heard it. I've been holding it since the roof."`, `Ximena está sentada en la alfombra con el celular contra el pecho. «Tengo un tema aquí. Nadie lo ha oído. Lo vengo cargando desde el techo».`, `A Ximena tá sentada no tapete com o celular contra o peito. «Tenho uma faixa aqui. Ninguém ouviu. Tô carregando isso desde o terraço».`),
      choices: [
        K('ask', t(`Ask to hear it.`, `Pedirle que te la deje oír.`, `Pedir pra ouvir.`), { next: 'b' }),
        K('chill', t(`Tell her there's no pressure.`, `Decirle que no hay presión.`, `Dizer que não tem pressão.`), { next: 'b' }),
        LEAVE()
      ]
    },
    b: {
      text: t(`She hands you one earbud. Four minutes: minimal, a broken-sounding kick that shouldn't work and does, then a long section that doesn't. "Honest. Please. Everybody says 'it's great' and I know when they haven't listened."`, `Te pasa un audífono. Cuatro minutos: minimal, un bombo con sonido roto que no debería funcionar y funciona, luego una sección larga que no. «Honesto. Por favor. Todos dicen 'está genial' y yo sé cuándo no escucharon».`, `Ela te passa um fone. Quatro minutos: minimal, um bumbo com som quebrado que não devia funcionar e funciona, depois uma parte longa que não. «Sincero. Por favor. Todo mundo diz 'tá ótimo' e eu sei quando não ouviram».`),
      choices: [
        K('honest', t(`The first half is great. The second half loses you.`, `La primera mitad es genial. En la segunda te pierdes.`, `A primeira metade é ótima. Na segunda você se perde.`), { next: 'e1' }),
        K('chill', t(`Say it's great.`, `Decirle que está genial.`, `Dizer que tá ótima.`), { next: 'e2' }),
        K('ask', t(`Ask what she was going for in the second half.`, `Preguntarle qué buscaba en la segunda mitad.`, `Perguntar o que ela buscava na segunda metade.`), { next: 'e3' })
      ]
    },
    e1: { text: t(`She laughs, relieved and irritated in equal parts. "Yes. I cut it. I put it back. I knew." She opens a note on her phone and types: second half = problem. "Thank you. It's the first useful sentence anyone's said about it."`, `Se ríe, aliviada y molesta a partes iguales. «Sí. La corté. La volví a poner. Lo sabía». Abre una nota en el celular y escribe: segunda mitad = problema. «Gracias. Es la primera frase útil que alguien dice sobre esto».`, `Ela ri, aliviada e irritada na mesma medida. «É. Cortei. Pus de volta. Eu sabia». Abre uma nota no celular e digita: segunda metade = problema. «Obrigada. É a primeira frase útil que alguém diz sobre isso».`), once: true, do: { soc: 4, care: 1, fun: 2, flag: ['g_ximena_open'] }, next: null },
    e2: { text: t(`"Thanks." Her face closes by a centimetre. She knows. She puts the phone away and neither of you mentions it.`, `«Gracias». Su cara se cierra un centímetro. Lo sabe. Guarda el celular y ninguno de los dos lo menciona.`, `«Valeu». O rosto dela fecha um centímetro. Ela sabe. Guarda o celular e nenhum dos dois comenta.`), once: true, do: { soc: -1, flag: ['g_ximena_open'] }, next: null },
    e3: { text: t(`She talks for five minutes about a room in her flat that echoes at 6 a.m. By the end she has solved the second half herself, out loud. "Fuck. That's it. I just needed to say it to somebody."`, `Habla cinco minutos de un cuarto de su departamento que hace eco a las seis de la mañana. Al final resolvió sola la segunda mitad, en voz alta. «Mierda. Eso es. Solo necesitaba decírselo a alguien».`, `Ela fala por cinco minutos de um quarto do apê que faz eco às seis da manhã. No fim, resolveu a segunda metade sozinha, em voz alta. «Merda. É isso. Eu só precisava falar pra alguém».`), once: true, do: { soc: 4, fun: 2, care: 1, flag: ['g_ximena_open'] }, next: null }
  });

  /* ============================================================ KIKI: six years of practising */
  G('kiki', ROLE.sofa, {
    a: {
      text: t(`Kiki is DJing with her hands in the air and no sound. "Anselm said I can't touch the records. I'm just practising."`, `Kiki hace de DJ con las manos en el aire y sin sonido. «Anselm dijo que no puedo tocar los discos. Solo practico».`, `A Kiki tá discotecando com as mãos no ar e sem som. «O Anselm falou que eu não posso mexer nos discos. Só tô treinando».`),
      choices: [
        K('ask', t(`Ask how long she's been practising.`, `Preguntarle cuánto lleva practicando.`, `Perguntar há quanto tempo ela treina.`), { next: 'b' }),
        LEAVE()
      ]
    },
    b: { text: t(`"Six years. Nobody's ever heard me." She stops. "If I play and it's bad, I lose the only thing I think I'm good at. So I practise. It's extremely safe."`, `«Seis años. Nadie me ha oído nunca». Se detiene. «Si toco y es malo, pierdo lo único en lo que creo que soy buena. Así que practico. Es extremadamente seguro».`, `«Seis anos. Ninguém nunca me ouviu». Ela para. «Se eu tocar e for ruim, perco a única coisa em que acho que sou boa. Então eu treino. É extremamente seguro».`), next: 'c' },
    c: {
      text: t(`You say Anselm might give her ten minutes, on a quiet record, if she asked him herself. She goes pale. "Ask? Now? Out loud?"`, `Le dices que Anselm quizás le dé diez minutos, con un disco tranquilo, si se lo pide ella misma. Se pone pálida. «¿Pedir? ¿Ahora? ¿En voz alta?»`, `Você diz que o Anselm talvez dê dez minutos pra ela, num disco tranquilo, se ela mesma pedir. Ela empalidece. «Pedir? Agora? Em voz alta?»`),
      choices: [
        K('care', t(`Go with her to ask.`, `Ir con ella a pedírselo.`, `Ir com ela pedir.`), { next: 'e1' }),
        K('chill', t(`Let her decide in her own time.`, `Dejar que decida a su ritmo.`, `Deixar ela decidir no tempo dela.`), { next: 'e2' })
      ]
    },
    e1: { text: t(`Anselm: "Edges. Volume down." Kiki plays three minutes, nothing flashy: two records slid into the hum of the radio downstairs. The flat's quiet breaks for a moment and goes back. Ximena claps once. Kiki sits down with her whole face red.`, `Anselm: «Por los bordes. Volumen bajo». Kiki toca tres minutos, nada vistoso: dos discos metidos en el zumbido de la radio de abajo. El silencio del departamento se rompe un momento y vuelve. Ximena aplaude una vez. Kiki se sienta con toda la cara roja.`, `Anselm: «Pelas bordas. Volume baixo». A Kiki toca três minutos, nada chamativo: dois discos encaixados no zumbido do rádio lá de baixo. O silêncio do apê quebra um instante e volta. A Ximena bate palma uma vez. A Kiki senta com o rosto inteiro vermelho.`), once: true, do: { fun: 4, soc: 3, care: 1, flag: ['g_kiki_open', 'g_kiki_played'], call: 'af_noise3' }, next: null },
    e2: { text: t(`"Later." She lowers her hands to her knees. "Maybe at the next one. I'm not saying never. I'm saying not with the walls listening."`, `«Después». Baja las manos a las rodillas. «Quizás en la próxima. No digo nunca. Digo que no con las paredes escuchando».`, `«Depois». Ela baixa as mãos pros joelhos. «Talvez no próximo. Não tô dizendo nunca. Tô dizendo que não com as paredes ouvindo».`), once: true, do: { soc: 1, flag: ['g_kiki_open'] }, next: null }
  });

  /* ============================================================ SOL: forty days, three cigarettes */
  G('sol', ROLE.balcony, {
    a: {
      text: t(`Sol is on the balcony floor with a pigeon three metres away. "He was here first. We have an understanding. Also: three cigarettes in forty days, and I'd like it noted that it's three."`, `Sol está en el piso del balcón con una paloma a tres metros. «Él llegó primero. Tenemos un acuerdo. Además: tres cigarros en cuarenta días, y quiero que conste que son tres».`, `A Sol tá no chão da varanda com um pombo a três metros. «Ele chegou primeiro. A gente tem um acordo. Além disso: três cigarros em quarenta dias, e quero que conste que são três».`),
      choices: [
        K('ask', t(`Ask what happened at three.`, `Preguntarle qué pasó en el tercero.`, `Perguntar o que aconteceu no terceiro.`), { next: 'b' }),
        LEAVE()
      ]
    },
    b: {
      text: t(`"My mother's birthday on the phone. A bad text. And the roof." She turns a lighter over in her fingers. "Take it? I mean, you can. I don't want to be somebody whose friends confiscate things, but I don't trust me at six in the morning."`, `«El cumpleaños de mi mamá por teléfono. Un mensaje malo. Y el techo». Le da vueltas a un encendedor. «¿Te lo quedas? O sea, puedes. No quiero ser alguien a quien sus amigos le confiscan cosas, pero no confío en mí a las seis de la mañana».`, `«O aniversário da minha mãe por telefone. Uma mensagem ruim. E o terraço». Ela gira um isqueiro nos dedos. «Pega? Quer dizer, pode. Não quero ser alguém cujos amigos confiscam coisas, mas não confio em mim às seis da manhã».`),
      choices: [
        K('care', t(`Take the lighter. She can ask for it back.`, `Quedarte el encendedor. Puede pedirlo cuando quiera.`, `Ficar com o isqueiro. Ela pode pedir de volta.`), { next: 'e1' }),
        K('care', t(`Say it's her call. Offer to sit through the craving.`, `Decirle que es su decisión. Ofrecerte a acompañarla durante las ganas.`, `Dizer que a decisão é dela. Oferecer ficar durante a vontade.`), { next: 'e2' }),
        K('honest', t(`Say no: you're not her warden.`, `Decirle que no: no eres su carcelero.`, `Dizer que não: você não é o carcereiro dela.`), { next: 'e3' })
      ]
    },
    e1: { text: t(`She gives it over with two fingers. "If I ask for it, give me a speech. A short one." She watches the pigeon take it personally.`, `Te lo entrega con dos dedos. «Si te lo pido, dame un sermón. Corto». Mira al pájaro darse por aludido.`, `Ela entrega com dois dedos. «Se eu pedir de volta, me dá um sermão. Curto». Ela observa o pombo se sentir ofendido.`), once: true, do: { soc: 3, care: 1, flag: ['g_sol_open', 'g_sol_lighter'] }, next: null },
    e2: { text: t(`Ten minutes on the floor, her knee bouncing. The craving crests and falls away without anyone doing anything about it. "Huh," she says. "That's all it was."`, `Diez minutos en el piso, con la rodilla rebotando. Las ganas llegan al tope y se van sin que nadie haga nada. «Ah», dice. «Era solo eso».`, `Dez minutos no chão, com o joelho balançando. A vontade chega ao pico e passa sem ninguém fazer nada. «Hm», ela diz. «Era só isso».`), once: true, do: { time: 10, soc: 4, care: 1, flag: ['g_sol_open'] }, next: null },
    e3: { text: t(`"Thank you for not being my mother." She lights it, and it's hers. She smokes it badly and well at the same time, and tells you so.`, `«Gracias por no ser mi mamá». Lo enciende y es suyo. Lo fuma mal y bien a la vez, y te lo dice.`, `«Valeu por não ser minha mãe». Ela acende e é dela. Fuma mal e bem ao mesmo tempo, e te diz isso.`), once: true, do: { soc: 2, flag: ['g_sol_open'] }, next: null }
  });

  /* ============================================================ HAZEL: who is not here */
  G('hazel', ROLE.balcony, {
    a: {
      text: t(`Hazel is stirring a pot that isn't hers. "I asked first. Dot said stir. I'm stirring." She looks at you. "Can I say something about tonight you won't repeat?"`, `Hazel revuelve una olla que no es suya. «Pregunté primero. Dot dijo que revolviera. Estoy revolviendo». Te mira. «¿Puedo decir algo de esta noche que no vayas a repetir?»`, `A Hazel mexe uma panela que não é dela. «Perguntei primeiro. A Dot disse pra mexer. Tô mexendo». Ela te olha. «Posso falar uma coisa dessa noite que você não vai repetir?»`),
      choices: [
        K('chill', t(`"Go on."`, `«Dime».`, `«Fala».`), { next: 'b' }),
        LEAVE()
      ]
    },
    b: { text: t(`"I love Æ000.X. I also filled out the form and hated every word of it, and then I got in, and now I'm someone who got in. And I think about who didn't. My office cleaner would love tonight. She'll never see a form."`, `«Amo Æ000.X. También llené el formulario y odié cada palabra, y después entré, y ahora soy alguien que entró. Y pienso en quién no. Quien limpia mi oficina amaría esta noche. Nunca va a ver un formulario».`, `«Eu amo a Æ000.X. Também preenchi o formulário e odiei cada palavra, e depois entrei, e agora sou alguém que entrou. E penso em quem não entrou. Quem limpa meu escritório amaria essa noite. Ela nunca vai ver um formulário».`), choices: [
      K('honest', t(`Agree: the door is the weak point.`, `Coincidir: la puerta es el punto débil.`, `Concordar: a porta é o ponto fraco.`), { next: 'c' }),
      K('honest', t(`Disagree: it keeps the room safe.`, `Discrepar: mantiene el lugar seguro.`, `Discordar: isso mantém o lugar seguro.`), { next: 'c2' })
    ] },
    c: { text: t(`"Safe for whom? That's my whole question." She stirs. "I'm not saying burn it down. I'm saying the list is a decision, it belongs to somebody, and it should be argued about."`, `«¿Seguro para quién? Esa es toda mi pregunta». Revuelve. «No digo quemarlo. Digo que la lista es una decisión, es de alguien, y se debería discutir».`, `«Seguro pra quem? Minha pergunta é só essa». Ela mexe. «Não tô dizendo queimar tudo. Tô dizendo que a lista é uma decisão, é de alguém, e devia ser discutida».`), choices: [
      K('care', t(`Say you'll argue it at the next one.`, `Decirle que lo discutirás en la próxima.`, `Dizer que vai discutir isso na próxima.`), { next: 'e1' }),
      K('ask', t(`Ask what she'd change.`, `Preguntarle qué cambiaría.`, `Perguntar o que ela mudaria.`), { next: 'e2' })
    ] },
    c2: { text: t(`"It does. It's also been convenient for the people it keeps safe, and nobody likes saying that." She isn't angry. "I'd rather we said it."`, `«Sí lo hace. También ha sido cómodo para la gente a la que mantiene a salvo, y a nadie le gusta decirlo». No está enojada. «Preferiría que lo dijéramos».`, `«Mantém. Também tem sido conveniente pra quem ela mantém seguro, e ninguém gosta de dizer isso». Ela não tá brava. «Eu preferia que a gente dissesse».`), choices: [K('ask', t(`Ask what she'd change.`, `Preguntarle qué cambiaría.`, `Perguntar o que ela mudaria.`), { next: 'e2' })] },
    e1: { text: t(`"Good. I'll hold you to it." She tastes the pot, frowns, adds salt. "Fifty free places, handed out by the cleaners and the door staff, not by the list. That's my whole proposal. I wrote it on a napkin."`, `«Bien. Te lo voy a cobrar». Prueba la olla, frunce el ceño, agrega sal. «Cincuenta lugares gratis, repartidos por el personal de limpieza y de puerta, no por la lista. Esa es toda mi propuesta. La escribí en una servilleta».`, `«Ótimo. Vou te cobrar». Prova a panela, franze a testa, bota sal. «Cinquenta lugares grátis, distribuídos pela equipe de limpeza e de porta, não pela lista. Minha proposta é só essa. Escrevi num guardanapo».`), once: true, do: { soc: 4, fun: 2, care: 1, flag: ['g_hazel_open'] }, next: null },
    e2: { text: t(`"Fifty free places, handed out by the cleaners and the door staff, not by the list. That's all. I wrote it on a napkin and I've been scared of it ever since." She laughs. "Now it's out of my pocket."`, `«Cincuenta lugares gratis, repartidos por el personal de limpieza y de puerta, no por la lista. Eso es todo. La escribí en una servilleta y le tengo miedo desde entonces». Se ríe. «Ahora ya salió de mi bolsillo».`, `«Cinquenta lugares grátis, distribuídos pela equipe de limpeza e de porta, não pela lista. É só isso. Escrevi num guardanapo e tenho medo dele desde então». Ela ri. «Agora saiu do meu bolso».`), once: true, do: { soc: 3, fun: 2, flag: ['g_hazel_open'] }, next: null }
  });

  /* ============================================================ OZ: radiators */
  G('oz', ROLE.floor, {
    a: {
      text: t(`Oz is flat on the floor with his shoes lined up on the rack. "I met someone tonight. I don't know if I'm allowed to want their number. I'm thirty-nine. At thirty-nine you ask for a number in an office."`, `Oz está tirado en el piso con los zapatos alineados en el zapatero. «Conocí a alguien esta noche. No sé si me está permitido querer su número. Tengo treinta y nueve. A los treinta y nueve se pide un número en una oficina».`, `O Oz tá deitado no chão com os sapatos alinhados na sapateira. «Conheci alguém essa noite. Não sei se me é permitido querer o número. Tenho trinta e nove. Aos trinta e nove a gente pede número em escritório».`),
      choices: [
        K('ask', t(`Ask who.`, `Preguntar quién.`, `Perguntar quem.`), { next: 'b' }),
        LEAVE()
      ]
    },
    b: { text: t(`"The red jacket, in the courtyard. We talked for an hour. About nothing. Radiators." He grins at the ceiling. "I think I'd like to talk about radiators again."`, `«La chaqueta roja, en el patio. Hablamos una hora. De nada. De radiadores». Le sonríe al techo. «Creo que me gustaría volver a hablar de radiadores».`, `«A jaqueta vermelha, no pátio. A gente conversou uma hora. Sobre nada. Radiadores». Ele sorri pro teto. «Acho que eu queria falar de radiadores de novo».`), choices: [K('ask', t(`"What are you scared of?"`, `«¿Qué te da miedo?»`, `«Do que você tem medo?»`), { next: 'c' })] },
    c: {
      text: t(`"That it's the drugs talking. That tomorrow I'll be someone who doesn't want radiators."`, `«Que sea la droga hablando. Que mañana sea alguien que no quiere radiadores».`, `«Que seja a droga falando. Que amanhã eu seja alguém que não quer radiadores».`),
      choices: [
        K('honest', t(`"Ask tomorrow, sober, by text. If it's still a yes, it was always yours."`, `«Pregunta mañana, sobrio, por mensaje. Si sigue siendo un sí, siempre fue tuyo».`, `«Pergunta amanhã, sóbrio, por mensagem. Se ainda for sim, sempre foi seu».`), { next: 'e1' }),
        K('bold', t(`"Go and ask now. You're allowed."`, `«Ve a pedírselo ahora. Tienes permiso».`, `«Vai pedir agora. Você pode».`), { next: 'e2' })
      ]
    },
    e1: { text: t(`"Tomorrow. By text. A radiator question." He closes his eyes, happy and terrified. "It was always mine. I'm writing that on my hand."`, `«Mañana. Por mensaje. Una pregunta de radiadores». Cierra los ojos, feliz y aterrado. «Siempre fue mío. Lo voy a escribir en la mano».`, `«Amanhã. Por mensagem. Uma pergunta de radiador». Ele fecha os olhos, feliz e aterrorizado. «Sempre foi meu. Vou escrever isso na mão».`), once: true, do: { soc: 3, fun: 2, flag: ['g_oz_open'] }, next: null },
    e2: { text: t(`He goes. He is back in four minutes, grey in the face. "He said yes to a coffee. I'm going to be sick." He is not going to be sick. He is the happiest person in the flat.`, `Se va. Vuelve en cuatro minutos, gris de la cara. «Dijo que sí a un café. Voy a vomitar». No va a vomitar. Es la persona más feliz del departamento.`, `Ele vai. Volta em quatro minutos, cinza no rosto. «Ele disse sim pra um café. Vou passar mal». Não vai passar mal. É a pessoa mais feliz do apê.`), once: true, do: { fun: 4, soc: 3, flag: ['g_oz_open'] }, next: null }
  });

  /* ============================================================ ÆRIEL: four hours and no memory */
  G('resident', ROLE.sofa, {
    a: {
      text: t(`ÆRIEL is on the sofa, headphones round the neck and nothing in them. "Off duty. I play for four hours and remember nothing. What do you remember?"`, `ÆRIEL está en el sofá, con los auriculares al cuello y nada dentro. «Fuera de turno. Toco cuatro horas y no recuerdo nada. ¿Tú qué recuerdas?»`, `A ÆRIEL tá no sofá, fones no pescoço e nada dentro. «Fora do expediente. Toco quatro horas e não lembro de nada. E você, do que lembra?»`),
      choices: [
        K('honest', t(`Tell them a small specific moment from the night.`, `Contarle un momento pequeño y concreto de la noche.`, `Contar um momento pequeno e específico da noite.`), { next: 'b' }),
        K('care', t(`"I remember being looked after."`, `«Recuerdo que me cuidaron».`, `«Lembro de ter sido cuidado».`), { next: 'b' }),
        LEAVE()
      ]
    },
    b: {
      text: t(`ÆRIEL listens with their eyes shut. "Again. Slower. Where were you standing?" You say where. ÆRIEL's mouth moves; they are putting it somewhere. "The big moments I can reconstruct from the recording. It's the small ones that go."`, `ÆRIEL escucha con los ojos cerrados. «Otra vez. Más despacio. ¿Dónde estabas parado?» Dices dónde. A ÆRIEL se le mueve la boca; lo está guardando en algún lado. «Los momentos grandes los reconstruyo con la grabación. Los chicos son los que se pierden».`, `A ÆRIEL escuta de olhos fechados. «De novo. Mais devagar. Onde você tava em pé?» Você diz onde. A boca da ÆRIEL se mexe; está guardando isso em algum lugar. «Os momentos grandes eu reconstruo pela gravação. São os pequenos que se perdem».`),
      choices: [
        K('care', t(`Say it was the set, and the faces looking up.`, `Decir que fue el set y las caras mirando hacia arriba.`, `Dizer que foi o set e os rostos olhando pra cima.`), { next: 'e1' }),
        K('honest', t(`Say it wasn't the set. It was the queue for the toilets.`, `Decir que no fue el set. Fue la fila del baño.`, `Dizer que não foi o set. Foi a fila do banheiro.`), { next: 'e2' })
      ]
    },
    e1: { text: t(`ÆRIEL writes it on the back of a flyer. "That's the review I keep." They fold it into the headphone case. "I'll read it on a Wednesday when I'm sure I've made a mistake."`, `ÆRIEL lo anota en el dorso de un volante. «Esa es la reseña que guardo». Lo dobla dentro del estuche de los auriculares. «La voy a leer un miércoles en que esté seguro de haberme equivocado».`, `A ÆRIEL anota no verso de um panfleto. «Essa é a resenha que eu guardo». Dobra e põe no estojo dos fones. «Vou ler numa quarta-feira em que eu tiver certeza de que errei».`), once: true, do: { soc: 4, fun: 2, care: 1, flag: ['g_aeriel_open'] }, next: null },
    e2: { text: t(`ÆRIEL laughs out loud, the first real laugh of the morning. "The toilets. Of course. Eyeliner compliments." They write it down. "That's the part of the night nobody pays me for. Put it on the flyer."`, `ÆRIEL se ríe en voz alta, la primera risa de verdad de la mañana. «El baño. Claro. Los cumplidos al delineador». Lo anota. «Esa es la parte de la noche por la que nadie me paga. Ponlo en el volante».`, `A ÆRIEL ri alto, a primeira risada de verdade da manhã. «O banheiro. Claro. Elogios ao delineador». Anota. «Essa é a parte da noite pela qual ninguém me paga. Bota no panfleto».`), once: true, do: { soc: 4, fun: 3, flag: ['g_aeriel_open'] }, next: null }
  });

  /* ============================================================ FRAMES SHELL: morning warmth + the "be a perra" lesson */
  G('frames', ROLE.floor, {
    a: {
      text: function (s) {
        if (s.flags.frames_perra_learned) return t(`FRAMES SHELL leans back against the couch, crate latched at his heels. "Remember the rule: keep your spine straight and let them choke on the silence."`, `FRAMES SHELL se apoya contra el sofá con el cajón cerrado junto a los talones. «Acuérdate de la regla: espalda recta y deja que ellos se atraganten con el silencio».`, `O FRAMES SHELL encosta no sofá com o caixote travado perto dos pés. «Lembra da regra: coluna reta e deixa eles se engasgarem com o silêncio».`);
        return t(`FRAMES SHELL has parked the crate beside the sofa with no intention of opening it before noon. His thermos is still warm. "Sala 2, backstage, rooftop wind — my ears are finally resting. How are you holding up in the daylight?"`, `FRAMES SHELL estacionó el cajón junto al sofá sin ninguna intención de abrirlo antes del mediodía. Su termo todavía está tibio. «Sala 2, backstage, viento del techo — por fin descansan mis oídos. ¿Cómo aguantas con esta luz del día?»`, `O FRAMES SHELL encostou o caixote perto do sofá sem nenhuma intenção de abrir antes do meio-dia. A garrafa térmica ainda tá morna. «Sala 2, backstage, vento do terraço — finalmente meus ouvidos tão descansando. Como você tá aguentando essa luz do dia?»`);
      },
      choices: [
        K('bold', t(`"Teach me how you handle pushy guys in rooms like these — you never flinch."`, `«Enséñame cómo manejas a los tipos pesados en lugares así — nunca te achicas».`, `«Me ensina como você lida com os caras sem noção nesses lugares — você nunca recua».`), { next: 'perra_intro' }),
        K('care', t(`"Thank you for holding the crate tonight — and for the quiet morning records."`, `«Gracias por cargar el cajón esta noche — y por los discos tranquilos de la mañana».`, `«Obrigado por carregar o caixote hoje — e pelos discos calmos da manhã».`), { next: 'warm_morning' }),
        LEAVE()
      ]
    },
    warm_morning: {
      text: t(`He taps the lid twice with warm knuckles. "One Brazilian pressing from 1979 lives in here just for ten in the morning. No drops, no hustle — just chords for people slowly remembering they have bodies again."`, `Golpea dos veces la tapa con los nudillos tibios. «Aquí adentro vive una edición brasileña de 1979 pensada solo para las diez de la mañana. Sin drops ni apuro — solo acordes para gente que vuelve a recordar que tiene cuerpo».`, `Ele bate duas vezes na tampa com os dedos. «Aqui dentro mora uma prensagem brasileira de 1979 guardada só pras dez da manhã. Sem drop nem pressa — só acordes pra quem tá lembrando devagar que ainda tem corpo».`),
      once: true,
      do: { soc: 2, fun: 2, flag: 'g_frames_open' },
      choices: [
        K('bold', t(`"Speaking of rooms — teach me how you shut down entitled men without blinking."`, `«Hablando de salas — enséñame a frenar a los tipos creídos sin pestañear».`, `«Falando de pista — me ensina a cortar cara folgado sem nem piscar».`), { next: 'perra_intro' }),
        LEAVE()
      ]
    },
    perra_intro: {
      text: t(`FRAMES sets his thermos down, eyes sharpening with real amusement. "Listen closely. Polite deference never stops patriarchal entitlement. In clubs, booths, and afterparties, toxic men read every polite smile as an open tab and every explanation as a debate. To push back against patriarchy in these spaces, sometimes you have to learn to be a perra — weaponize toxic masculinity's own cold swagger right back against toxic men."`,
        `FRAMES deja el termo en el suelo y se le afila la mirada con una sonrisa filosa. «Escucha bien. La deferencia educada nunca frena el derecho que creen tener los tipos. En clubes, cabinas y afters, los hombres tóxicos leen cada sonrisa amable como barra libre y cada explicación como debate. Para enfrentar al patriarcado en estos espacios, a veces hay que saber ser una perra: usar la propia arrogancia fría de la masculinidad tóxica directo contra esos tipos».`,
        `O FRAMES larga a térmica no chão, o olhar ficando afiado e divertido. «Escuta bem. Deferência educada nunca freia o sentimento de direito desses caras. Em clubs, cabines e afters, homens tóxicos leem todo sorriso gentil como passe livre e toda explicação como debate. Pra bater de frente com o patriarcado nesses lugares, às vezes você tem que saber ser uma perra: usar a própria marra fria da masculinidade tóxica de volta contra esses homens».`),
      choices: [
        K('bold', t(`"Show me the rules."`, `«Enséñame las reglas».`, `«Me ensina as regras».`), { next: 'perra_rules' }),
        K('chill', t(`"Hold that thought for later."`, `«Guardémoslo para otro rato».`, `«Guarda isso pra depois».`), { free: true, next: 'a' })
      ]
    },
    perra_rules: {
      text: [
        t(`He counts on four fingers. "Rule one: take up space — never shrink your shoulders when a guy expects you to fold. Rule two: never explain your no; reasons only invite negotiation. Rule three: refuse to smile to cushion his ego — let awkward silence rot in his lap. Rule four: flip his mansplaining straight back onto him with bored contempt."`,
          `Cuenta con cuatro dedos. «Regla uno: ocupa espacio — jamás encojas los hombros cuando un tipo espera que te achiques. Regla dos: nunca expliques tu no; las razones invitan a negociar. Regla tres: niégate a sonreír para amortiguar su ego — deja que el silencio incómodo se pudra de su lado. Regla cuatro: devuélvele el mansplaining con desdén aburrido».`,
          `Ele conta em quatro dedos. «Regra um: ocupe espaço — nunca encolha os ombros quando um cara espera que você se esconda. Regra dois: nunca explique o seu não; motivo só convida negociação. Regra três: recuse sorrir pra amortecer o ego dele — deixa o silêncio constrangedor apodrecer no colo dele. Regra quatro: devolva o mansplaining na cara dele com tédio afiado».`),
        t(`"Test run. Scenario one: a random guy leans across your shoulders at the mixer and says, 'Let me fix that blend, sweetie, it's too technical for you.' What's your move?"`,
          `«Prueba en vivo. Escenario uno: un tipo cualquiera se te encima frente al mixer y suelta: 'Deja que te arregle esa mezcla, linda, es muy técnica para ti'. ¿Qué haces?»`,
          `«Teste ao vivo. Cenário um: um cara aleatório debruça por cima do seu ombro no mixer e manda: 'Deixa eu arrumar essa virada, gracinha, é técnica demais pra você'. Qual é a resposta?»`)
      ],
      choices: [
        K('bold', t(`Hold your ground, drop the smile, and say flatly: "Hands off. Nobody invited you."`, `Mantener tu sitio, borrar la sonrisa y soltar seco: «Saca las manos. Nadie te invitó».`, `Manter sua posição, apagar o sorriso e mandar seco: «Tira a mão. Ninguém te chamou».`), { do: { fun: 1 }, next: 'perra_p2' }),
        K('joke', t(`Look down your nose at him, bored: "Adorable that you confuse pushing buttons with ear. Run along."`, `Mirarlo por encima del hombro, aburrido: «Qué tierno que confundas tocar perillas con tener oído. Sigue caminando».`, `Olhar de cima a baixo com tédio: «Fofo você achar que mexer em botão é ter ouvido. Vai andando».`), { do: { fun: 2 }, next: 'perra_p2' }),
        K('sorry', t(`"Oh, sorry, maybe my gain was a tiny bit off…"`, `«Ay, perdón, quizá se me pasó un poquito la ganancia…»`, `«Ai, desculpa, talvez meu ganho tenha passado um pouquinho…»`), { next: 'perra_coach' })
      ]
    },
    perra_coach: {
      text: t(`FRAMES winces on purpose. "No! You just apologised for breathing near his ego. Throw 'sorry' in the bin. Take his swagger, strip out every ounce of customer-service warmth, and try again."`,
        `FRAMES hace una mueca a propósito. «¡No! Acabas de pedir perdón por respirar cerca de su ego. Tira el 'perdón' a la basura. Toma su misma seguridad, quítale cada gota de amabilidad obligatoria e inténtalo de nuevo».`,
        `O FRAMES faz careta de propósito. «Não! Você acabou de pedir desculpa por respirar perto do ego dele. Joga o 'desculpa' no lixo. Pega a marra dele, tira cada gota de simpatia automática e tenta de novo».`),
      choices: [
        K('bold', t(`Hold your ground, drop the smile, and say flatly: "Hands off. Nobody invited you."`, `Mantener tu sitio, borrar la sonrisa y soltar seco: «Saca las manos. Nadie te invitó».`, `Manter sua posição, apagar o sorriso e mandar seco: «Tira a mão. Ninguém te chamou».`), { do: { fun: 1 }, next: 'perra_p2' }),
        K('joke', t(`Look down your nose at him, bored: "Adorable that you confuse pushing buttons with ear. Run along."`, `Mirarlo por encima del hombro, aburrido: «Qué tierno que confundas tocar perillas con tener oído. Sigue caminando».`, `Olhar de cima a baixo com tédio: «Fofo você achar que mexer em botão é ter ouvido. Vai andando».`), { do: { fun: 2 }, next: 'perra_p2' })
      ]
    },
    perra_p2: {
      text: t(`"Yes. Zero apology, zero padding, and he's stuck holding his own embarrassment." FRAMES leans in for round two. "Now he follows you by the kitchen trying the classic guilt trip: 'Whoa, smile a bit, why so aggressive? I was just trying to help.' Finish him."`,
        `«Así. Cero disculpa, cero colchón, y se queda sosteniendo su propia vergüenza». FRAMES se inclina para la segunda vuelta. «Ahora te sigue cerca de la cocina con la culpa clásica: 'Epa, sonríe un poco, ¿por qué tan agresiva? Solo quería ayudar'. Remátalo».`,
        `«Isso. Zero desculpa, zero amortecedor, e ele fica segurando o próprio vexame». O FRAMES inclina pro segundo round. «Agora ele te segue perto da cozinha na chantagem clássica: 'Opa, sorri um pouco, pra que essa agressividade? Só queria ajudar'. Fecha a conta».`),
      choices: [
        K('silent', t(`Hold dead silence for three long seconds, then say once: "I don't owe your ego comfort. Move."`, `Sostener tres segundos de silencio helado y decir una vez: «No le debo comodidad a tu ego. Muévete».`, `Segurar três segundos de silêncio gelado e dizer uma vez: «Não devo conforto pro seu ego. Dá licença».`), { next: 'perra_done' }),
        K('bold', t(`Throw his condescension straight back: "Relax, don't get so emotional. You clearly can't take direct feedback."`, `Devolverle la condescendencia intacta: «Tranquilo, no te pongas tan emocional. Se nota que no aguantas una respuesta directa».`, `Devolver a arrogância inteira: «Calma, não fica tão emotivo. Dá pra ver que você não aguenta retorno direto».`), { next: 'perra_done' })
      ]
    },
    perra_done: {
      text: t(`FRAMES laughs out loud and raises his thermos in salute. "Masterclass. Being a perra isn't cruelty — it's self-defense with teeth. Toxic men expect free emotional labor and smallness; hand them back the exact cold swagger they worship and keep your floor."`,
        `FRAMES suelta una carcajada y levanta el termo en señal de brindis. «Clase magistral. Ser una perra no es crueldad — es defensa propia con dientes. Los tipos tóxicos esperan trabajo emocional gratis y que te hagas chica; devuélveles la misma arrogancia fría que adoran y quédate con tu pista».`,
        `O FRAMES cai na risada e ergue a garrafa térmica num brinde. «Aula magna. Ser uma perra não é crueldade — é autodefesa com dentes. Homens tóxicos esperam trabalho emocional de graça e que você encolha; devolve na cara deles a mesma marra fria que eles idolatram e fica com a sua pista».`),
      once: true,
      do: { soc: 4, fun: 4, weird: -4, flag: ['g_frames_open', 'frames_perra_learned'] },
      next: null
    }
  });
})();

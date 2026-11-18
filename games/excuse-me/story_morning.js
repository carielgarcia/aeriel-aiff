/* EXCUSE ME — morning epilogue: phone threads, extra friend voices, and closing vignettes. */
'use strict';
/* ---- consolidated from story_morning.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, story = EM.story;

  /* the friends, by what happened to them. Two variants each, picked from the seed. */
  const FATE = {
    dani: {
      home: [
        T('Update: I am at someone\'s apartment. There is a cat called Kickdrum. We are making pancakes. I think I am in love. (Estimated duration: nine hours.)', 'Novedades: estoy en el departamento de alguien. Hay un gato que se llama Kickdrum. Estamos haciendo panqueques. Creo que estoy enamorado. (Duración estimada: nueve horas.)', 'Novidades: tô no apartamento de alguém. Tem um gato chamado Kickdrum. A gente tá fazendo panqueca. Acho que tô apaixonado. (Duração estimada: nove horas.)'),
        T('Cannot talk. I am in a stranger\'s shower. It has a rain head. The stranger is making coffee and singing. This is the best day of my life. Please do not text for a few hours.', 'No puedo hablar. Estoy en la ducha de un desconocido. Tiene lluvia. El desconocido está haciendo café y cantando. Es el mejor día de mi vida. Por favor no escriban por unas horas.', 'Não posso falar. Tô no chuveiro de um estranho. Tem ducha de chuva. O estranho tá fazendo café e cantando. É o melhor dia da minha vida. Por favor, não me escrevam por umas horas.')
      ],
      safe: [
        T('Home. Safe. Shoes: one. Phone: miraculously. Heart: still a drum. Love you all.', 'En casa. A salvo. Zapatos: uno. Celular: milagrosamente. Corazón: todavía un tambor. Los quiero a todos.', 'Em casa. Seguro. Sapatos: um. Celular: milagrosamente. Coração: ainda um tambor. Amo vocês.'),
        T('Checking in: I am in bed, I drank two litres of water, I have a banana. I am a model citizen. 10/10 would be unhinged again.', 'Aviso: estoy en la cama, tomé dos litros de agua, tengo un plátano. Soy un ciudadano modelo. 10/10 volvería a descontrolarme.', 'Aviso: tô na cama, bebi dois litros de água, tenho uma banana. Sou um cidadão exemplar. Nota 10, voltaria a enlouquecer.')
      ],
      thanks: [
        T('Thank you for last night. I mean it in a non-chemical way. You make rooms warmer. Okay I am going to cry on the metro now.', 'Gracias por anoche. Lo digo de una forma no química. Haces los lugares más cálidos. Bueno, voy a llorar en el metro ahora.', 'Obrigado pela noite passada. Falo isso de um jeito não químico. Você deixa os lugares mais quentes. Bom, agora vou chorar no metrô.'),
        T('That was the best night of the year. I am putting it in a jar. The jar is my chest. Thank you.', 'Fue la mejor noche del año. La voy a guardar en un frasco. El frasco es mi pecho. Gracias.', 'Foi a melhor noite do ano. Vou guardar num pote. O pote é o meu peito. Obrigado.')
      ],
      lost: [
        T('WHERE DID YOU GO. Never mind, I am home, I got a taxi with four strangers who are now my family. Call me.', '¿ADÓNDE FUISTE? Da igual, estoy en casa, me subí a un taxi con cuatro desconocidos que ahora son mi familia. Llámame.', 'PRA ONDE VOCÊ FOI? Deixa pra lá, tô em casa, peguei um táxi com quatro estranhos que agora são minha família. Me liga.')
      ],
      cool: [
        T('Home. I am fine. A bit quiet. Maybe we can talk later?', 'En casa. Estoy bien. Un poco callado. ¿Quizás hablamos más tarde?', 'Em casa. Tô bem. Um pouco quieto. Talvez a gente possa conversar depois?')
      ]
    },
    maru: {
      home: [
        T(`Update: I am fine, I am at a person's apartment, the person is a sound engineer and has notes on my snare. I am taking notes. Possibly also taking the person. Do not wait up.`, `Novedades: estoy bien, estoy en el departamento de una persona, la persona es ingeniera de sonido y tiene comentarios sobre mi caja. Estoy tomando notas. Quizás también me lleve a la persona. No me esperen.`, `Novidades: tô bem, tô no apartamento de uma pessoa, a pessoa é engenheira de som e tem observações sobre minha caixa. Tô tomando nota. Talvez eu leve a pessoa também. Não me esperem.`),
        T('Do not judge. I went home with the bartender who made the lemon thing. They are making breakfast in an apron. The apron says something in a language I am pretending not to read.', 'No juzguen. Me fui con el barman que hizo la cosa de limón. Está preparando el desayuno con un delantal. El delantal dice algo en un idioma que finjo no leer.', 'Não julguem. Fui pra casa com o barman que fez aquela coisa de limão. Tá preparando o café da manhã de avental. O avental diz algo num idioma que eu finjo não ler.')
      ],
      safe: [
        T('Home, keys found, shoe found, dignity pending. Send me a thumbs up so I know you are alive.', 'En casa, llaves encontradas, zapato encontrado, dignidad pendiente. Mándenme un pulgar arriba para saber que están vivos.', 'Em casa, chaves achadas, sapato achado, dignidade pendente. Me mandem um joinha pra eu saber que estão vivos.'),
        T('Check-in: home, showered, alive. Someone\'s lanyard is in my pocket. If it is yours, I am sorry. If it is not yours, also sorry.', 'Aviso: en casa, bañada, viva. Hay una credencial de alguien en mi bolsillo. Si es tuya, perdón. Si no es tuya, también perdón.', 'Aviso: em casa, de banho tomado, viva. Tem um crachá de alguém no meu bolso. Se for seu, desculpa. Se não for seu, desculpa também.')
      ],
      thanks: [
        T('Thank you for tonight. Really. I needed people who say "nobody gets lost" and mean it.', 'Gracias por esta noche. En serio. Necesitaba gente que diga «nadie se pierde» y lo diga en serio.', 'Obrigada pela noite. Sério. Eu precisava de gente que diz «ninguém se perde» e fala sério.'),
        T('I do not say this enough: you are a good one to go out with. Next time I buy the first round. The first round is water.', 'No lo digo lo suficiente: eres buena compañía para salir. La próxima yo pago la primera ronda. La primera ronda es agua.', 'Eu não falo isso o bastante: você é uma boa companhia pra sair. Da próxima eu pago a primeira rodada. A primeira rodada é água.')
      ],
      lost: [
        T('I lost you around three. I am NOT mad. I am a little mad. Text me when you are home.', 'Te perdí como a las tres. NO estoy enojada. Estoy un poco enojada. Escríbeme cuando llegues a casa.', 'Te perdi lá pelas três. NÃO tô brava. Tô um pouco brava. Me manda mensagem quando chegar em casa.')
      ],
      cool: [
        T('Home. Safe. We should talk about last night. Not now. Brunch.', 'En casa. A salvo. Deberíamos hablar de anoche. Ahora no. Brunch.', 'Em casa. Segura. A gente devia conversar sobre ontem à noite. Agora não. Brunch.')
      ]
    },
    tato: {
      home: [
        T('…I need you to sit down. I went home with someone. We held hands for forty minutes and then talked about our mothers. It was perfect. I am in a kitchen. I am okay. Better than okay.', '…Necesito que te sientes. Me fui a casa con alguien. Nos tomamos de la mano cuarenta minutos y después hablamos de nuestras madres. Fue perfecto. Estoy en una cocina. Estoy bien. Mejor que bien.', '…Preciso que você sente. Fui pra casa com alguém. A gente ficou de mãos dadas por quarenta minutos e depois falou das nossas mães. Foi perfeito. Tô numa cozinha. Tô bem. Melhor que bem.'),
        T('Update: it is NOT Mateo. Someone new. They have plants. Many plants. They said I can stay as long as I water the ferns. I think I am good at this.', 'Novedades: NO es Mateo. Alguien nuevo. Tiene plantas. Muchas plantas. Dijo que puedo quedarme mientras riegue los helechos. Creo que se me da bien.', 'Novidades: NÃO é o Mateo. Alguém novo. Tem plantas. Muitas plantas. Disse que posso ficar enquanto eu regar as samambaias. Acho que sou bom nisso.')
      ],
      safe: [
        T('Home safe. Locked the door. Checked the lock. Checked it again. Thank you for tonight; I was brave for like four hours.', 'En casa a salvo. Cerré la puerta. Revisé el cerrojo. Lo revisé otra vez. Gracias por esta noche; fui valiente como cuatro horas.', 'Em casa seguro. Tranquei a porta. Conferi a tranca. Conferi de novo. Valeu pela noite; fui corajoso por umas quatro horas.'),
        T(`I am okay. I made it home. I slept in my clothes on top of the blanket like an organised cat.`, `Estoy bien. Llegué a casa. Dormí vestido encima de la manta como un gato organizado.`, `Tô bem. Cheguei em casa. Dormi vestido em cima do cobertor feito um gato organizado.`)
      ],
      thanks: [
        T('Thank you for asking if I was okay. Thank you for the wall. Thank you for the stairs. I will explain the stairs later.', 'Gracias por preguntarme si estaba bien. Gracias por la pared. Gracias por las escaleras. Te explico lo de las escaleras después.', 'Valeu por perguntar se eu tava bem. Valeu pela parede. Valeu pelas escadas. Explico a das escadas depois.'),
        T('Tonight I was not the one who needed rescuing. I was just a guy at a rave. Thank you for that.', 'Esta noche no fui el que necesitaba rescate. Fui solo un tipo en una rave. Gracias por eso.', 'Hoje eu não fui o que precisava de resgate. Fui só um cara numa rave. Valeu por isso.')
      ],
      lost: [
        T('I am home safe. I looked for you for a while, then a nice person sat with me by the wall. Text me when you get this.', 'Estoy en casa a salvo. Te busqué un rato, y después una persona amable se sentó conmigo junto a la pared. Escríbeme cuando veas esto.', 'Tô em casa seguro. Te procurei por um tempo, depois uma pessoa legal sentou comigo perto da parede. Me escreve quando ver isso.')
      ],
      cool: [
        T('Home. Could we talk? Not tonight. Soon.', 'En casa. ¿Podemos hablar? Esta noche no. Pronto.', 'Em casa. A gente pode conversar? Hoje não. Logo.')
      ]
    }
  };

  /* about a third of the time, one friend answers another's message */
  const REPLY = {
    maru: {
      home: T('$. DETAILS. In person. With gestures. Bring a coffee first.', '$. DETALLES. En persona. Con gestos. Trae un café primero.', '$. DETALHES. Pessoalmente. Com gestos. Traz um café antes.'),
      safe: T('Thumbs up, $. Drink water. Eat the banana.', 'Pulgar arriba, $. Toma agua. Cómete el plátano.', 'Joinha, $. Bebe água. Come a banana.'),
      thanks: T('Aww, $. Group hug. Imaginary. Slightly sticky.', 'Ay, $. Abrazo grupal. Imaginario. Un poco pegajoso.', 'Aww, $. Abraço coletivo. Imaginário. Um pouco grudento.')
    },
    dani: {
      home: T('$!!! I knew it. I knew it since the stairs. Tell me everything. EVERYTHING.', '¡¡¡$!!! Lo sabía. Lo sabía desde las escaleras. Cuéntame todo. TODO.', '$!!! Eu sabia. Eu sabia desde a escada. Me conta tudo. TUDO.'),
      safe: T('$ you are a legend. Sleep. I will bring pastries.', '$ eres una leyenda. Duerme. Llevo pan dulce.', '$ você é uma lenda. Dorme. Eu levo uns doces.'),
      thanks: T('Stop, I am crying on the metro too. We are on the same metro now.', 'Para, yo también estoy llorando en el metro. Ahora estamos en el mismo metro.', 'Para, eu também tô chorando no metrô. Agora a gente tá no mesmo metrô.')
    },
    tato: {
      home: T('$, I am happy for you. Please text when you are home. I don\'t doubt you. I just like you.', '$, me alegro por ti. Escribe cuando llegues a casa. No dudo de ti. Solo te quiero.', '$, fico feliz por você. Manda mensagem quando chegar em casa. Eu não duvido de você. Só gosto de você.'),
      safe: T('Glad you are safe, $. I checked the lock for you too.', 'Qué bueno que llegaste bien, $. Yo también revisé el cerrojo por ti.', 'Que bom que você chegou bem, $. Eu conferi a tranca por você também.'),
      thanks: T('Same. All of it. The wall too.', 'Igual. Todo. La pared también.', 'Igual. Tudo. A parede também.')
    }
  };
  const IDX = { maru: 0, dani: 1, tato: 2 };
  story.morningFate = FATE; story.morningReply = REPLY;

  /* messages that react to what you did, in priority order */
  const REF = [
    { id: 'self', top: true, who: 'dani', ok: function (s) { return s.attempt > 1; }, t: T('Have we done this before? Do not answer. I will get sad.', '¿Ya hicimos esto antes? No contestes. Me voy a poner triste.', 'A gente já fez isso antes? Não responde. Vou ficar triste.') },
    { id: 'ariel', top: true, who: '#ÆRIEL', ok: function (s) { return s.flags.resident_friend; }, t: T('this is ÆRIEL. Dragan gave me your number off the list. Please do not tell anyone I texted. Thank you for the water. The thermos says hi. Drink yours.', 'soy ÆRIEL. Dragan me dio tu número de la lista. Por favor no le cuentes a nadie que escribí. Gracias por el agua. El termo te saluda. Toma la tuya.', 'aqui é ÆRIEL. O Dragan me deu seu número da lista. Por favor, não conta pra ninguém que eu mandei mensagem. Valeu pela água. A garrafa térmica manda um oi. Beba a sua.') },
    { id: 'dragan', top: true, who: '#DRAGAN', ok: function (s) { return story.gagLevel(s, 'ae') >= 1 || s.flags.ae_list || s.flags.ae_rules; }, t: function (s) {
      return (s.attempt || 1) >= 3
        ? T('You are on the list of people on the list of people on the list. I have stopped counting. The clipboard has not.', 'Estás en la lista de la gente de la lista de la gente de la lista. Dejé de contar. La carpeta no.', 'Você tá na lista das pessoas da lista das pessoas da lista. Parei de contar. A prancheta não.')
        : T('You are now on a list. It is for people who asked about the list. It has two names. One is yours. Do not ask about the other.', 'Ahora estás en una lista. Es para la gente que preguntó por la lista. Tiene dos nombres. Uno es el tuyo. No preguntes por el otro.', 'Você agora tá numa lista. É pra quem perguntou da lista. Tem dois nomes. Um é o seu. Não pergunte do outro.');
    } },
    { id: 'tato_check', who: 'tato', ok: function (s) { return s.flags.tato_checked; }, t: T(`Also: thanks for asking at the start if I was okay. I thought about it all night.`, `Además: gracias por preguntarme al principio si estaba bien. Lo pensé toda la noche.`, `Ah, e: valeu por perguntar no começo se eu tava bem. Pensei nisso a noite toda.`) },
    { id: 'cat', who: 'dani', ok: function (s) { return s.flags.pet_cat; }, t: T('The cat on the stairs has a name. Bassline. A man told me. It is on the staff list.', 'El gato de las escaleras tiene nombre. Bassline. Me lo dijo un señor. Está en la lista del personal.', 'O gato da escada tem nome. Bassline. Um moço me contou. Tá na lista dos funcionários.') },
    { id: 'pillgood', who: 'maru', ok: function (s) { return s.pill.tested && s.flags.pill_taken && !s.flags.pill_fake; }, t: T('Honest question: should checking be a tradition? Isi was an angel. I want her to have a medal.', 'Pregunta honesta: ¿el chequeo debería ser una tradición? Isi fue un ángel. Quiero que le den una medalla.', 'Pergunta sincera: a checagem devia virar tradição? A Isi foi um anjo. Quero que ela ganhe uma medalha.') },
    { id: 'pillnothing', who: 'maru', ok: function (s) { return s.flags.pill_nothing; }, t: T('Remember the mint? Fully a mint. I am keeping the wrapper.', '¿Te acuerdas de la menta? Era 100% una menta. Me quedo con el envoltorio.', 'Lembra da bala de menta? Era 100% uma bala de menta. Vou ficar com a embalagem.') },
    { id: 'pillfaint', who: 'tato', ok: function (s) { return s.flags.pill_faint; }, t: T('I am still shaking about the faint. Next time we test first. Promise me.', 'Todavía estoy temblando por el desmayo. La próxima probamos primero. Prométemelo.', 'Ainda tô tremendo por causa do desmaio. Da próxima a gente testa antes. Me promete.') },
    { id: 'pillskip', who: 'dani', ok: function (s) { return s.flags.pill_binned || s.flags.pill_skipped; }, t: T('Thank you for not taking the thing you did not trust. That sentence is a lot but you understand.', 'Gracias por no tomar lo que no te daba confianza. La frase es mucho, pero entiendes.', 'Valeu por não tomar aquilo em que você não confiava. A frase é demais, mas você entende.') },
    { id: 'rolling', who: 'dani', ok: function (s) { return s.flags.rolling && !s.flags.pill_fake; }, t: T('I am still warm. I think I am made of toast.', 'Sigo tibio. Creo que estoy hecho de pan tostado.', 'Ainda tô quentinho. Acho que sou feito de torrada.') },
    { id: 'coke', who: 'maru', ok: function (s) { return s.flags.took_coke; }, t: T('Heard you were REALLY sharp around three? Remember it all? Drink water, you machine.', '¿Escuché que tenías la mente MUY afilada como a las tres? ¿Te acuerdas de todo? Toma agua, máquina.', 'Ouvi dizer que sua cabeça tava MUITO afiada lá pelas três? Lembra de tudo? Bebe água, máquina.') },
    { id: 'ketok', who: 'dani', ok: function (s) { return s.flags.ket_ok; }, t: T('You were the nicest person on the floor around two. You asked a stranger about her mother and she cried. Good cry.', 'Eras la persona más amable de la pista como a las dos. Le preguntaste a una desconocida por su mamá y lloró. Un buen llanto.', 'Você era a pessoa mais gentil da pista lá pelas duas. Perguntou a uma estranha da mãe dela e ela chorou. Choro bom.') },
    { id: 'ketfaint', who: 'tato', ok: function (s) { return s.flags.ket_faint; }, t: T('Teo told me about the floor thing. I am not mad. I am keeping my phone on all week for you.', 'Teo me contó lo del piso. No estoy enojado. Voy a tener el celular prendido toda la semana por ti.', 'O Teo me contou da história do chão. Não tô bravo. Vou deixar o celular ligado a semana toda por você.') },
    { id: 'dark', who: 'dani', ok: function (s) { return s.flags.dark_first; }, t: T('I found my glasses in the dark room. I was not wearing glasses.', 'Encontré mis lentes en el cuarto oscuro. No llevaba lentes.', 'Achei meus óculos na sala escura. Eu não estava de óculos.') },
    { id: 'together', who: 'maru', ok: function (s) { return s.flags.promised_together && EM.coreCount(s) === 3; }, t: T('We said nobody gets lost. Nobody did. I am proud of us.', 'Dijimos que nadie se perdía. Nadie se perdió. Estoy orgullosa de nosotros.', 'A gente falou que ninguém se perdia. Ninguém se perdeu. Tenho orgulho da gente.') },
    { id: 'shoved', who: 'maru', ok: function (s) { return s.flags.shoved_dancer || s.flags.shoved_broh; }, t: T('Someone told me a person shoved someone on the floor. I said it could not be you. Please tell me I was right.', 'Alguien me contó que una persona empujó a otra en la pista. Dije que no podías ser tú. Dime que tuve razón.', 'Alguém me contou que uma pessoa empurrou outra na pista. Eu disse que não podia ser você. Me diz que eu tava certa.') },
    { id: 'hostilekind', who: 'dani', ok: function (s) { return s.flags.hostile_kind && !s.flags.hostile_rude; }, t: T('Wait, did the grumpy guy actually give you his spot? I need that story in person, with hand gestures.', 'Espera, ¿el tipo gruñón de verdad te dio su lugar? Necesito esa historia en persona, con gestos.', 'Peraí, o cara irritado te deu o lugar dele mesmo? Quero essa história pessoalmente, com gestos.') },
    { id: 'repgood', who: '#LUCA', ok: function (s) { return (s.rep || 0) <= -2; }, t: T('coat check here. someone said you are the one who says excuse me properly. i have a spot at the door if you ever want one. no dread attached.', 'guardarropa por acá. dicen que eres quien pide permiso como se debe. tengo un lugar en la puerta si algún día quieres. sin angustia incluida.', 'chapelaria aqui. disseram que você é quem pede licença direito. tenho uma vaga na porta se um dia quiser. sem angústia inclusa.') },
    { id: 'broh', who: 'maru', ok: function (s) { return s.flags.broh_forgiven; }, t: T('Broh texted me. He is sorry about the thing. He is not good at apologies, but it is an apology.', 'Broh me escribió. Lamenta lo de antes. No es bueno pidiendo perdón, pero es una disculpa.', 'O Broh me mandou mensagem. Ele sente muito pelo que rolou. Não é bom em pedir desculpa, mas é uma desculpa.') },
    { id: 'rosa', who: '#ROSA', ok: function (s) { return s.flags.rosa_helped_clean || s.flags.rosa_thanked; }, t: T('left a note on the hand dryer: thank you. then i remembered you do not have a hand dryer. anyway. thank you. —Rosa', 'dejé una nota en el secador de manos: gracias. después recordé que tú no tienes secador de manos. en fin. gracias. —Rosa', 'deixei um bilhete no secador de mãos: obrigada. depois lembrei que você não tem secador de mãos. enfim. obrigada. —Rosa') },

    { id: 'strip', who: 'dani', ok: function (s) { return s.flags.photostrip; }, t: T('I taped the photo strip to my fridge. We look like a rock band that argues about snacks.', 'Pegué la tira de fotos en mi nevera. Parecemos una banda de rock que discute por las botanas.', 'Colei a tira de fotos na geladeira. A gente parece uma banda de rock que briga por causa de petisco.') },
    { id: 'phoneok', who: '#MUM OF BISCUIT', ok: function (s) { return s.flags.phone_returned && story.morningPay(s, 'phoneok'); }, t: T('i am biscuit\'s mum. the coat check person says a kind stranger turned in my phone. biscuit is wearing the raincoat in your honour. thank you.', 'soy la mamá de Biscuit. en el guardarropa dicen que un desconocido amable entregó mi celular. Biscuit se puso el impermeable en tu honor. gracias.', 'sou a mãe do Biscuit. na chapelaria disseram que um estranho gentil entregou meu celular. o Biscuit tá de capa de chuva em sua homenagem. obrigada.') },
    { id: 'phonebad', who: 'maru', ok: function (s) { return s.flags.phone_snooped && story.morningPay(s, 'phonebad'); }, t: T('Funny story: somebody was seen scrolling through a lost phone at the coat check. Nobody said who. The dog on the lock screen knows.', 'Dato curioso: vieron a alguien husmeando un celular perdido en el guardarropa. Nadie dijo quién. El perro de la pantalla lo sabe.', 'História engraçada: viram alguém fuçando um celular perdido na chapelaria. Ninguém disse quem. O cachorro da tela de bloqueio sabe.') },
    { id: 'madeout', who: 'dani', ok: function (s) { return s.flags.made_out; }, t: T('So… the PERSON. Details. I have time, I am lying in bed.', 'Entonces… la PERSONA. Detalles. Tengo tiempo, estoy en la cama.', 'Então… a PESSOA. Detalhes. Eu tenho tempo, tô deitado na cama.') },
    { id: 'madefail', who: 'maru', ok: function (s) { return s.flags.makeout_fail; }, t: T('I saw the teeth clash from across the room. Respect. Dignity optional.', 'Vi el choque de dientes desde el otro lado de la sala. Respeto. La dignidad es opcional.', 'Vi a batida de dentes do outro lado da sala. Respeito. Dignidade opcional.') },
    { id: 'kai', who: 'tato', ok: function (s) { return s.flags.kai_song && story.morningPay(s, 'kai'); }, t: T('Kai posted your song. "For somebody nervous." It has fourteen plays. Thirteen are mine.', 'Kai subió tu canción. «Para alguien nervioso». Tiene catorce reproducciones. Trece son mías.', 'O Kai postou a sua música. «Pra alguém nervoso». Tem quatorze plays. Treze são meus.') },
    { id: 'pia', who: '#PIA', ok: function (s) { return s.flags.pia_reunited && story.morningPay(s, 'pia'); }, t: T('Moe and I are making pancakes. Gerald the fern is on the table. Thank you again for the water.', 'Moe y yo estamos haciendo panqueques. Gerald el helecho está en la mesa. Gracias otra vez por el agua.', 'Eu e o Moe estamos fazendo panqueca. O Gerald, a samambaia, está na mesa. Obrigada de novo pela água.') },
    { id: 'lupe', who: '#LUPE', ok: function (s) { return s.flags.lupe_helped && story.morningPay(s, 'lupe'); }, t: T('i am the one from the bathroom floor. i am better. i went home and called my sister. thank you for sitting.', 'soy la del piso del baño. estoy mejor. llegué a casa y llamé a mi hermana. gracias por sentarte.', 'sou a do chão do banheiro. tô melhor. cheguei em casa e liguei pra minha irmã. obrigada por sentar.') },
    { id: 'cleo', who: '#CLEO', ok: function (s) { return s.flags.cleo_happy && story.morningPay(s, 'cleo'); }, t: T('ÆRIEL PLAYED THE SAD ONE. THE SAD ONE. i am screaming on the metro and the metro does not care.', 'ÆRIEL TOCÓ LA TRISTE. LA TRISTE. estoy gritando en el metro y al metro no le importa.', 'ÆRIEL TOCOU A TRISTE. A TRISTE. tô gritando no metrô e o metrô não liga.') },
    { id: 'bruce', who: 'dani', ok: function (s) { return s.flags.bruce_cared && story.morningPay(s, 'bruce'); }, t: T('Did you ask the big security guy how he was? He told the whole team. You are a legend in the walkie-talkie community.', '¿Le preguntaste al guardia grande cómo estaba? Se lo contó a todo el equipo. Eres una leyenda en la comunidad de los walkie-talkies.', 'Você perguntou pro segurança grandão como ele estava? Ele contou pra equipe toda. Você é uma lenda na comunidade dos walkie-talkies.') },
    { id: 'line', who: 'dani', ok: function (s) { return s.flags.line_dance || s.flags.airdj_win; }, t: T('Somebody posted the line dance. You are in the third row. Your left arm is 400ms late and extremely sincere.', 'Alguien subió el baile en línea. Estás en la tercera fila. Tu brazo izquierdo llega 400 ms tarde y es sumamente sincero.', 'Alguém postou a dança em linha. Você tá na terceira fila. Seu braço esquerdo está 400 ms atrasado e extremamente sincero.') },
    { id: 'ruth', who: 'tato', ok: function (s) { return s.flags.ruth_tea; }, t: T('I met a woman in the quiet room with a long green scarf. She said you were warm enough. I think it is a compliment.', 'Conocí a una señora en la sala tranquila con una bufanda larga y verde. Dijo que ya tenías suficiente calor. Creo que es un cumplido.', 'Conheci uma senhora na sala de calma com um cachecol verde comprido. Ela disse que você já estava quentinho o bastante. Acho que é um elogio.') },
    { id: 'glitter', who: 'maru', ok: function (s) { return s.flags.glittered; }, t: T('I am still finding glitter in my bag. Also in my ears. Also in my soul.', 'Sigo encontrando glitter en mi bolso. También en las orejas. También en el alma.', 'Ainda tô achando glitter na bolsa. Também nas orelhas. Também na alma.') },
    { id: 'crystal', who: 'tato', ok: function (s) { return s.flags.crystal; }, t: T('Is the pebble working? Mine has made me very calm and a little suspicious.', '¿Funciona el guijarro? El mío me dejó muy tranquilo y un poco desconfiado.', 'A pedrinha tá funcionando? A minha me deixou muito calmo e um pouco desconfiado.') },
    { id: 'poem', who: 'dani', ok: function (s) { return s.flags.poem && story.morningPay(s, 'poem'); }, t: T('Sia wrote us a poem. It says I am "good company for a stray cat". I am framing it.', 'Sia nos escribió un poema. Dice que soy «buena compañía para un gato callejero». Lo voy a enmarcar.', 'A Sia escreveu um poema pra gente. Diz que eu sou «boa companhia pra um gato de rua». Vou emoldurar.') },
    { id: 'yui', who: '#YUI', ok: function (s) { return s.flags.beat_yui && story.morningPay(s, 'yui'); }, t: T('rematch. rock. do not think about it.', 'revancha. piedra. no lo pienses.', 'revanche. pedra. não pensa.') },
    { id: 'wedding', who: 'dani', ok: function (s) { return s.flags.dare_done; }, t: T(`The DJ nodded at you. I will tell this story at my own wedding, to the headlamp.`, `El DJ te asintió. Voy a contar esta historia en mi propia boda, frente a la linterna.`, `O DJ assentiu pra você. Vou contar essa história no meu próprio casamento, pra lanterna.`) },
    { id: 'selfie', who: 'maru', ok: function (s) { return s.flags.group_selfie; }, t: T('The selfie is the album cover. I have no album. I will make an album.', 'La selfie es la tapa del disco. No tengo disco. Voy a hacer un disco.', 'A selfie é a capa do álbum. Eu não tenho álbum. Vou fazer um álbum.') },
    { id: 'brunch', top: true, who: 'maru', ok: function (s) { return (s.bad || 0) >= 6; }, t: T('Brunch Thursday. We need to circle back on a few things. Mostly the ones that started with "pushed".', 'Brunch el jueves. Tenemos que volver sobre algunas cosas. Sobre todo las que empezaron con «empujé».', 'Brunch na quinta. A gente precisa voltar em algumas coisas. Principalmente as que começaram com «empurrei».') }
  ];

  story.morningRefs = REF;
  /* a chain that already paid off in the night can skip the morning */
  story.morningPay = function (s, id) { return !s.flags['pay_' + id] || s.flags['pay_' + id] !== 'night'; };
  const PREF = { maru: 'LUISA', dani: 'BENJA', tato: 'FEÑA' };
  story.morning = function (s) {
    const msgs = [];
    const seed = (s.seed || 1) + (s.attempt || 1) * 13;
    ['maru', 'dani', 'tato'].forEach(function (f) {
      const r = EM.hash2(seed, IDX[f], 77), v = Math.floor(EM.hash2(seed, IDX[f], 78) * 97);
      const withYou = s.party.indexOf(f) !== -1;
      const W = { dani: [0.5, 0.3], maru: [0.2, 0.4], tato: [0.1, 0.4] }[f];
      let fate = r < W[0] ? 'home' : (r < W[0] + W[1] ? 'thanks' : 'safe');
      if ((s.bond[f] || 0) < 0 || (f === 'tato' && s.flags.tato_hurt)) fate = 'cool';
      else if (!withYou && !s.flags.sunrise_all && !s.flags.sunrise_some && s.zone !== 'rooftop' && fate !== 'home') fate = 'lost';
      const list = FATE[f][fate];
      msgs.push({ who: f, t: list[v % list.length], fate: fate });
    });
    /* chains: about a third of mornings, one friend answers another */
    if (EM.hash2(seed, 0, 303) < 1 / 3) {
      const el = msgs.filter(function (x) { return REPLY.maru[x.fate]; });
      if (el.length) {
        const m0 = el[Math.floor(EM.hash2(seed, 1, 305) * el.length)];
        const others = Object.keys(IDX).filter(function (k) { return k !== m0.who && (s.bond[k] || 0) >= 0; });
        if (others.length) {
          const rf = others[Math.floor(EM.hash2(seed, 2, 304) * others.length)];
          const nm = EM.CAST[m0.who].name, pool = [].concat(REPLY[rf][m0.fate]), tpl = pool[Math.floor(EM.hash2(seed, 6, 307) * pool.length) % pool.length];
          msgs.splice(msgs.indexOf(m0) + 1, 0, { who: rf, t: T(tpl.en.replace('$', nm), tpl.es.replace('$', nm), tpl.pt.replace('$', nm)), fate: 'reply' });
        }
      }
    }
    /* what you did: up to three, never two from the same sender back to back */
    const picked = [];
    const elig = REF.filter(function (r) { try { return r.ok(s); } catch (e) { return false; } });
    const top = elig.filter(function (r) { return r.top; }), rest = elig.filter(function (r) { return !r.top; });
    /* the rest are shuffled by the night's seed so different nights remember different things */
    rest.sort(function (a, b) { return EM.hash2(seed, a.id.length * 31 + a.id.charCodeAt(0), 7) - EM.hash2(seed, b.id.length * 31 + b.id.charCodeAt(0), 7); });
    top.concat(rest).forEach(function (r) {
      if (picked.length >= 5) return;
      if (picked.filter(function (p) { return p.who === r.who; }).length >= 2) return;
      picked.push({ who: r.who, t: typeof r.t === 'function' ? r.t(s) : r.t });
    });
    picked.forEach(function (m) { msgs.push(m); });
    /* times: spread across the morning, in order of arrival */
    let min = 8 * 60 + 14 + Math.floor(EM.hash2(seed, 5, 9) * 30);
    return msgs.map(function (m, i) {
      const h = Math.floor(min / 60) % 24, mm = min % 60;
      min += 9 + Math.floor(EM.hash2(seed, i, 41) * 55);
      return { who: m.who, name: m.who.charAt(0) === '#' ? m.who.slice(1) : null, t: m.t, time: ('0' + h).slice(-2) + ':' + ('0' + mm).slice(-2) };
    });
  };

  const LABEL = {
    open: T('CHECK YOUR PHONE', 'REVISAR EL CELULAR', 'VER O CELULAR'),
    head: T('THE MORNING AFTER', 'LA MAÑANA SIGUIENTE', 'A MANHÃ SEGUINTE'),
    sub: T('GROUP: LA GRIETA SURVIVORS', 'GRUPO: SOBREVIVIENTES DE LA GRIETA', 'GRUPO: SOBREVIVENTES DA GRIETA'),
    hide: T('PUT THE PHONE DOWN', 'DEJAR EL CELULAR', 'LARGAR O CELULAR'),
    unknown: T('UNKNOWN NUMBER', 'NÚMERO DESCONOCIDO', 'NÚMERO DESCONHECIDO')
  };
  /* build the phone for the ending screen */
  story.renderPhone = function (s, ed) {
    const box = document.getElementById('e-phone'); if (!box) return;
    box.textContent = '';
    if (ed.reset) { box.hidden = true; return; }
    box.hidden = false;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'phone-btn'; btn.textContent = EM.tr(LABEL.open);
    const th = document.createElement('div'); th.className = 'thread'; th.hidden = true;
    const h = document.createElement('h3'); h.textContent = EM.tr(LABEL.head); th.appendChild(h);
    const sub = document.createElement('p'); sub.className = 'sub2'; sub.textContent = EM.tr(LABEL.sub); th.appendChild(sub);
    story.morning(s).forEach(function (m) {
      const b = document.createElement('div'); b.className = 'bubble from-' + (m.name ? 'x' : m.who);
      const hd = document.createElement('div'); hd.className = 'bh';
      const nm = document.createElement('strong'); nm.textContent = m.name ? EM.tr(LABEL.unknown) : (EM.CAST[m.who] ? EM.CAST[m.who].name : m.who);
      const tm = document.createElement('span'); tm.textContent = ' ' + m.time;
      hd.appendChild(nm); hd.appendChild(tm);
      const tx = document.createElement('div'); tx.className = 'bt'; tx.textContent = EM.tr(m.t);
      b.appendChild(hd); b.appendChild(tx); th.appendChild(b);
    });
    btn.addEventListener('click', function () {
      th.hidden = !th.hidden;
      btn.textContent = EM.tr(th.hidden ? LABEL.open : LABEL.hide);
      EM.ui.postHeight && EM.ui.postHeight();
    });
    box.appendChild(btn); box.appendChild(th);
  };
})();

/* ---- consolidated from story_v11.js ---- */
(function () {
  const EM = window.EM;
  const T = EM.T, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };

  /* ============================================================ THE PHONE: MORE VOICES */
  const F = story.morningFate, R = story.morningReply;
  if (F) {
    const add = function (who, fate, list) { F[who][fate] = F[who][fate].concat(list); };
    add('dani', 'home', [
      t(`Update: the person lives above a bakery. I woke up to the smell of croissants and a note that said "back in 5, don't leave." I did not leave. I am in love with the stairs.`, `Novedades: la persona vive arriba de una panadería. Desperté con olor a medialunas y una nota que decía «vuelvo en 5, no te vayas». No me fui. Estoy enamorado de las escaleras.`, `Novidades: a pessoa mora em cima de uma padaria. Acordei com cheiro de croissant e um bilhete dizendo «volto em 5, não vai embora». Não fui. Tô apaixonado pela escada.`),
      t(`Confession: I was going to leave at six and then they put a record on and now it's noon and we've decided on a name for the cat we don't have.`, `Confesión: iba a irme a las seis y entonces pusieron un disco y ahora son las doce y decidimos el nombre del gato que no tenemos.`, `Confissão: eu ia embora às seis e aí botaram um disco e agora é meio-dia e a gente decidiu o nome do gato que não temos.`)
    ]);
    add('dani', 'safe', [
      t(`Home. Shower. Toast. I'm drinking the third water of my adult life and it is the best water. I love you. Tell the DJ I said thank you. Tell the DJ they were right.`, `En casa. Ducha. Tostada. Estoy tomando el tercer agua de mi vida adulta y es la mejor agua. Los quiero. Díganle al DJ que gracias. Díganle al DJ que tenía razón.`, `Em casa. Banho. Torrada. Tô tomando a terceira água da minha vida adulta e é a melhor água. Amo vocês. Falem pra DJ que eu agradeço. Falem pra DJ que ela tinha razão.`),
      t(`Update: I sat on my floor for forty minutes thinking about a song. The song was from 3:12. I do not remember the song. I remember the feeling. Do you also have the feeling?`, `Novedades: me senté en mi piso cuarenta minutos pensando en una canción. La canción era de las 3:12. No me acuerdo de la canción. Me acuerdo de la sensación. ¿Ustedes también tienen la sensación?`, `Novidades: sentei no chão do meu quarto quarenta minutos pensando numa música. A música era das 3:12. Não lembro da música. Lembro da sensação. Vocês também têm a sensação?`)
    ]);
    add('dani', 'thanks', [
      t(`I don't say it enough. Thank you for pulling me out of the corner by the speaker. I think I was supposed to disappear into the bass and you said "come here" instead.`, `No lo digo lo suficiente. Gracias por sacarme del rincón junto al parlante. Creo que me iba a desaparecer en el bajo y tú dijiste «ven» en vez de eso.`, `Eu não falo isso o suficiente. Valeu por me tirar do canto perto da caixa. Acho que eu ia sumir no grave e você disse «vem cá» em vez disso.`),
      t(`New rule: whenever you are at a party, I am also at that party. Even if I'm asleep. It's a rule I just made and I am going to enforce it with hugs.`, `Regla nueva: cuando estés en una fiesta, yo también estoy en esa fiesta. Aunque esté dormido. Es una regla que acabo de inventar y voy a hacerla cumplir con abrazos.`, `Regra nova: quando você estiver numa festa, eu também tô nessa festa. Mesmo dormindo. É uma regra que acabei de inventar e vou fazer cumprir com abraços.`)
    ]);
    add('dani', 'lost', [
      t(`Okay so I lost you around four but a woman in a green scarf told me you were fine and held my hand till I believed her. I'm home. Please send a thumb. Even a small one.`, `Bueno, te perdí como a las cuatro pero una señora de bufanda verde me dijo que estabas bien y me tomó la mano hasta que le creí. Estoy en casa. Mándame un pulgar. Aunque sea chiquito.`, `Então, te perdi lá pelas quatro mas uma senhora de cachecol verde me disse que você estava bem e segurou minha mão até eu acreditar. Tô em casa. Manda um joinha. Nem que seja pequeno.`),
      t(`I looked for you in the dark room (I said your name very quietly), the roof (closed), and the toilets (don't ask). Then I found my own face in a mirror and realised: go home. I'm home. Where are you.`, `Te busqué en el cuarto oscuro (dije tu nombre muy bajito), el techo (cerrado) y los baños (no preguntes). Entonces encontré mi propia cara en un espejo y entendí: vete a casa. Estoy en casa. ¿Dónde estás?`, `Te procurei na dark room (falei seu nome bem baixinho), no terraço (fechado) e nos banheiros (não pergunta). Aí encontrei meu próprio rosto num espelho e entendi: vai pra casa. Tô em casa. Cadê você?`)
    ]);
    add('dani', 'cool', [
      t(`Home. Not mad. Just a bit smaller than yesterday. Could we have a coffee this week and talk about the thing, with no speeches? I'll bring pastries as a peace treaty.`, `En casa. No estoy enojado. Solo un poco más chico que ayer. ¿Podríamos tomar un café esta semana y hablar de lo que pasó, sin discursos? Llevo pan dulce como tratado de paz.`, `Em casa. Não tô bravo. Só um pouco menor que ontem. A gente podia tomar um café essa semana e conversar sobre aquilo, sem discursos? Levo uns doces como tratado de paz.`),
      t(`Hi. I'm okay. I'd like us to be okay too. I'll be a person tomorrow. Today I'm a slightly bruised potato.`, `Hola. Estoy bien. Me gustaría que nosotros también estuviéramos bien. Mañana voy a ser una persona. Hoy soy una papa un poco golpeada.`, `Oi. Tô bem. Eu queria que a gente também ficasse bem. Amanhã eu vou ser uma pessoa. Hoje sou uma batata um pouco machucada.`)
    ]);
    add('maru', 'home', [
      t(`Do not call me. I'm at someone's flat and we've discovered we have the same favourite sandwich. This is called fate. This is also called "I'm making a second sandwich". Out.`, `No me llamen. Estoy en el departamento de alguien y descubrimos que tenemos el mismo sándwich favorito. Eso se llama destino. También se llama «estoy haciendo un segundo sándwich». Corto.`, `Não me liguem. Tô no apartamento de alguém e descobrimos que temos o mesmo sanduíche favorito. Isso se chama destino. Também se chama «tô fazendo um segundo sanduíche». Desligo.`),
      t(`It's six in the evening. I've been somewhere with a good lamp since four a.m. I'll come back to the real world on Wednesday. Tell my plants I love them.`, `Son las seis de la tarde. Llevo desde las cuatro de la mañana en un lugar con una buena lámpara. Vuelvo al mundo real el miércoles. Díganle a mis plantas que las quiero.`, `São seis da tarde. Tô desde as quatro da manhã num lugar com um bom abajur. Volto pro mundo real na quarta. Falem pras minhas plantas que eu amo elas.`)
    ]);
    add('maru', 'safe', [
      t(`Checking in so none of you worry. Home, door locked, shoes off, kettle on. Every single one of you is an excellent dancer and I have no notes.`, `Aviso para que nadie se preocupe. En casa, puerta con llave, sin zapatos, pava en el fuego. Cada uno de ustedes es un excelente bailarín y no tengo observaciones.`, `Aviso pra ninguém se preocupar. Em casa, porta trancada, sem sapato, chaleira no fogo. Cada um de vocês é um excelente dançarino e eu não tenho observações.`),
      t(`Reminder that I have the group's lost glove, a stranger's lanyard, and a flyer for a "knitting rave". I'm going to show up to the knitting rave out of spite. Join me.`, `Recordatorio: tengo el guante perdido del grupo, la credencial de un desconocido y un volante de una «knitting rave». Voy a ir a la knitting rave por despecho. Acompáñenme.`, `Lembrete: eu tenho a luva perdida do grupo, o crachá de um estranho e um flyer de uma «knitting rave». Vou aparecer na knitting rave por pirraça. Venham comigo.`)
    ]);
    add('maru', 'thanks', [
      t(`I want to say something stupid and true. You are the reason I stayed till the end. I'd have gone home at 2. I won't say it again. I will definitely repeat it at weddings.`, `Quiero decir algo tonto y verdadero. Eres la razón por la que me quedé hasta el final. Me habría ido a casa a las 2. No lo diré otra vez. Lo repetiré en bodas, seguro.`, `Quero dizer uma coisa boba e verdadeira. Você é o motivo de eu ter ficado até o fim. Eu teria ido pra casa às 2. Não vou dizer de novo. Vou repetir em casamentos, com certeza.`),
      t(`Thank you for the part where nobody got lost. I've organised this group for years and that's the first time all four of us were in a picture. I'm framing it.`, `Gracias por la parte en que nadie se perdió. Llevo años organizando este grupo y es la primera vez que los cuatro salimos en una foto. La voy a enmarcar.`, `Valeu pela parte em que ninguém se perdeu. Organizo esse grupo há anos e foi a primeira vez que os quatro saímos numa foto. Vou emoldurar.`)
    ]);
    add('maru', 'lost', [
      t(`Okay, I will say it once: I was worried. I looked at every wall, every bench, and one particularly unhelpful plant. I'm home. Text me the second you can. I will wait. I'm very good at waiting.`, `Bueno, lo diré una vez: estaba preocupada. Miré cada pared, cada banco y una planta particularmente poco colaboradora. Estoy en casa. Escríbeme en cuanto puedas. Espero. Soy muy buena esperando.`, `Tá, vou dizer uma vez: eu tava preocupada. Olhei cada parede, cada banco e uma planta particularmente pouco prestativa. Tô em casa. Me escreve assim que puder. Eu espero. Sou muito boa em esperar.`),
      t(`You vanished at 3:40. A man selling glow sticks told me he saw you leave "with purpose". That's not information. Please call. I will not be angry for more than a minute.`, `Desapareciste a las 3:40. Un señor que vendía pulseras luminosas me dijo que te vio irte «con propósito». Eso no es información. Llama. No me voy a enojar más de un minuto.`, `Você sumiu às 3:40. Um homem vendendo pulseira neon me disse que te viu sair «com propósito». Isso não é informação. Liga. Não vou ficar brava por mais de um minuto.`)
    ]);
    add('maru', 'cool', [
      t(`Home. I need a day. We'll talk. I still love you. Several things happened last night that I'd like to understand slowly, with food.`, `En casa. Necesito un día. Hablamos. Te sigo queriendo. Pasaron varias cosas anoche que me gustaría entender despacio, con comida.`, `Em casa. Preciso de um dia. A gente conversa. Ainda te amo. Várias coisas aconteceram ontem à noite que eu gostaria de entender devagar, com comida.`),
      t(`I'm going to make a list of things that were great and a list of things that need a conversation. The first list is longer. I'd like to share both over lunch.`, `Voy a hacer una lista de cosas que estuvieron geniales y una lista de cosas que necesitan una conversación. La primera lista es más larga. Me gustaría compartir las dos en el almuerzo.`, `Vou fazer uma lista de coisas que foram ótimas e uma lista de coisas que precisam de uma conversa. A primeira lista é maior. Gostaria de compartilhar as duas no almoço.`)
    ]);
    add('tato', 'home', [
      t(`I'm sitting on a stranger's balcony with a cup of tea, listening to birds and a person humming in the next room. I'm okay. I'm better than okay. Please don't tell my mother. Tell my mother.`, `Estoy sentado en el balcón de alguien con una taza de té, escuchando pájaros y a una persona tarareando en la otra habitación. Estoy bien. Estoy mejor que bien. No le cuenten a mi mamá. Cuéntenle a mi mamá.`, `Tô sentado na varanda de alguém com uma xícara de chá, ouvindo passarinhos e uma pessoa cantarolando no outro cômodo. Tô bem. Tô melhor que bem. Não contem pra minha mãe. Contem pra minha mãe.`),
      t(`We talked until five about the thing I never say out loud. They listened. Then we slept like two coats on one hook. I think I like being a coat.`, `Hablamos hasta las cinco de lo que nunca digo en voz alta. Escucharon. Luego dormimos como dos abrigos en un mismo gancho. Creo que me gusta ser un abrigo.`, `A gente conversou até as cinco sobre aquilo que eu nunca falo em voz alta. A pessoa ouviu. Depois a gente dormiu feito dois casacos num mesmo cabide. Acho que gosto de ser um casaco.`)
    ]);
    add('tato', 'safe', [
      t(`Home. Locked the door, checked it, thanked it. I want to say tonight was kind to me. I want to say it low so it doesn't leave.`, `En casa. Cerré la puerta, la revisé, le di las gracias. Quiero decir que la noche fue amable conmigo. Quiero decirlo en voz baja para que no se vaya.`, `Em casa. Tranquei a porta, conferi, agradeci. Quero dizer que a noite foi gentil comigo. Quero dizer em voz baixa pra ela não ir embora.`),
      t(`Made it back. The stairs of my building have never been so long. A cat on the third floor looked at me like it knew something. I said "I know", and I think we were both right.`, `Llegué. Las escaleras de mi edificio nunca fueron tan largas. Un gato en el tercer piso me miró como si supiera algo. Dije «ya sé», y creo que los dos teníamos razón.`, `Cheguei. As escadas do meu prédio nunca foram tão longas. Um gato no terceiro andar me olhou como se soubesse de algo. Eu disse «eu sei», e acho que os dois estávamos certos.`)
    ]);
    add('tato', 'thanks', [
      t(`I want to thank you for noticing when I got quiet. You just sat next to me and didn't ask for anything.`, `Quiero agradecerte por notar cuando me quedé callado. Te sentaste a mi lado y no me pediste nada.`, `Quero te agradecer por ter notado quando eu fiquei quieto. Você só sentou do meu lado e não pediu nada.`),
      t(`Tonight I danced with someone who wasn't afraid I'd break. Thank you for being the first person who wasn't afraid, so I could learn what it's like.`, `Esta noche bailé con alguien que no tenía miedo de que me rompiera. Gracias por ser la primera persona que no tuvo miedo, para que yo aprendiera cómo es.`, `Hoje eu dancei com alguém que não tinha medo de que eu quebrasse. Valeu por ser a primeira pessoa que não teve medo, pra eu aprender como é.`)
    ]);
    add('tato', 'lost', [
      t(`I looked for you for a long time and then I was found by a kind stranger with a thermos. We watched the dancefloor together from a wall. It was lovely. I'm home. Text me when you can.`, `Te busqué mucho rato y luego me encontró una persona amable con un termo. Miramos la pista juntos desde una pared. Fue hermoso. Estoy en casa. Escríbeme cuando puedas.`, `Te procurei por bastante tempo e depois fui encontrado por uma pessoa gentil com uma garrafa térmica. A gente olhou a pista junto de uma parede. Foi lindo. Tô em casa. Me escreve quando puder.`),
      t(`I got a little scared when I couldn't find you, and then I used the breathing thing you taught me and I was okay. I'm home. I want you to know it worked.`, `Me asusté un poco cuando no te encontré, y entonces usé lo de respirar que me enseñaste y estuve bien. Estoy en casa. Quiero que sepas que funcionó.`, `Fiquei com um pouco de medo quando não te achei, e aí usei aquilo de respirar que você me ensinou e fiquei bem. Tô em casa. Quero que saiba que funcionou.`)
    ]);
    add('tato', 'cool', [
      t(`Home. I'm quiet, not angry. I think I need a day with the blinds down. When I'm ready I'll message first. I wanted you to know it isn't a goodbye.`, `En casa. Estoy callado, no enojado. Creo que necesito un día con las persianas bajas. Cuando esté listo escribo yo primero. Quería que supieras que no es un adiós.`, `Em casa. Tô quieto, não bravo. Acho que preciso de um dia com as persianas fechadas. Quando eu estiver pronto eu mando mensagem primeiro. Queria que você soubesse que não é um adeus.`),
      t(`Something from last night is sitting in my chest like a stone in a shoe. I don't want to leave it there. Could we talk, slowly, the way you did at the beginning?`, `Algo de anoche está en mi pecho como una piedra en un zapato. No quiero dejarlo ahí. ¿Podemos hablar, despacio, como tú lo hiciste al principio?`, `Algo da noite passada tá no meu peito feito uma pedrinha no sapato. Não quero deixar lá. A gente pode conversar, devagar, do jeito que você fez no começo?`)
    ]);
  }
  if (R) {
    ['maru', 'dani', 'tato'].forEach(function (who) { R[who].home = [].concat(R[who].home); R[who].safe = [].concat(R[who].safe); R[who].thanks = [].concat(R[who].thanks); });
    R.maru.home.push(t(`$. I need DETAILS. The kind I'd normally have to guess from your face. Start with the first sentence you said to the person.`, `$. Necesito DETALLES. De los que normalmente adivino por tu cara. Empieza con la primera frase que le dijiste a la persona.`, `$. Eu preciso de DETALHES. Daqueles que normalmente eu adivinho pela sua cara. Começa com a primeira frase que você disse pra pessoa.`));
    R.dani.home.push(t(`$, I'm crying at my desk. Ask the person if they have a friend. Ask them if the friend likes cables.`, `$, estoy llorando en mi escritorio. Pregúntale a la persona si tiene un amigo. Pregúntale si al amigo le gustan los cables.`, `$, tô chorando na minha mesa. Pergunta pra pessoa se ela tem um amigo. Pergunta se o amigo gosta de cabos.`));
    R.tato.home.push(t(`$, I'll light a candle for you. Not as a metaphor. I'm out of metaphors. A real candle.`, `$, te prendo una vela. No como metáfora. Me quedé sin metáforas. Una vela de verdad.`, `$, vou acender uma vela pra você. Não como metáfora. Fiquei sem metáforas. Uma vela de verdade.`));
    R.maru.safe.push(t(`Good. Eat something with a vegetable. I mean it, $.`, `Bien. Come algo con una verdura. Lo digo en serio, $.`, `Bom. Come algo com um vegetal. Falo sério, $.`));
    R.dani.safe.push(t(`$ I'm sending you a hug through the phone. It might arrive late. Be patient with it.`, `$ te mando un abrazo por el celular. Puede llegar tarde. Ten paciencia con él.`, `$ tô te mandando um abraço pelo celular. Pode chegar atrasado. Tenha paciência com ele.`));
    R.tato.safe.push(t(`Thank you for telling us, $. I'll sleep better now. I'll sleep with the window open.`, `Gracias por avisar, $. Ahora voy a dormir mejor. Voy a dormir con la ventana abierta.`, `Valeu por avisar, $. Agora eu vou dormir melhor. Vou dormir com a janela aberta.`));
    R.maru.thanks.push(t(`Don't get sentimental on me, $. (I'm already sentimental. Come here.)`, `No te pongas sentimental conmigo, $. (Yo ya estoy sentimental. Ven acá.)`, `Não fica sentimental comigo, $. (Eu já tô sentimental. Vem cá.)`));
    R.dani.thanks.push(t(`$, same. Same, same, same. It's the best sentence I know.`, `$, igual. Igual, igual, igual. Es la mejor frase que conozco.`, `$, igual. Igual, igual, igual. É a melhor frase que eu conheço.`));
    R.tato.thanks.push(t(`I'll say it more quietly so it counts double. Same.`, `Lo digo más bajito para que cuente doble. Igual.`, `Vou falar mais baixinho pra contar em dobro. Igual.`));
  }

  /* ============================================================ A CLOSING PARAGRAPH FOR EVERY ENDING */
  /* four voices each; the night's seed picks one, so replays read differently */
  const CODA = {
    closing: [
      t(`Outside, the street is washed grey and cold and nobody has told the pigeons. A kebab van is selling the first coffee of the day to a queue of people who all look very, very happy.`, `Afuera, la calle está lavada de gris y de frío y nadie les avisó a las palomas. Una camioneta de kebab vende el primer café del día a una fila de gente que parece muy, muy feliz.`, `Lá fora, a rua está lavada de cinza e de frio e ninguém avisou os pombos. Uma van de kebab vende o primeiro café do dia pra uma fila de gente que parece muito, muito feliz.`),
      t(`Your ears ring in a key that will be gone by Wednesday. You walk home with the bass still in your knees.`, `Te zumban los oídos en una tonalidad que se habrá ido el miércoles. Caminas a casa con el bajo todavía en las rodillas.`, `Seus ouvidos zumbem numa tonalidade que já terá ido embora na quarta. Você caminha pra casa com o grave ainda nos joelhos.`),
      t(`The doors close behind you with a soft, final click. For a moment you are the only person on the pavement.`, `Las puertas se cierran detrás de ti con un clic suave y definitivo. Por un momento eres la única persona en la vereda.`, `As portas se fecham atrás de você com um clique suave e definitivo. Por um momento você é a única pessoa na calçada.`),
      t(`Somewhere in your coat is a flyer, a wristband, and a mint. You find all three on the walk home and keep them.`, `En algún lugar de tu abrigo hay un volante, una pulsera y una menta. Los encuentras los tres en el camino a casa y los guardas.`, `Em algum lugar do seu casaco tem um flyer, uma pulseira e uma bala de menta. Você acha os três no caminho de casa e guarda.`)
    ],
    legend: [
      t(`Years from now a stranger will tell you about this night as if it happened to somebody famous. You will nod. You will say nothing.`, `Dentro de años un desconocido te va a contar esta noche como si le hubiera pasado a alguien famoso. Vas a asentir. No vas a decir nada.`, `Daqui a anos um estranho vai te contar essa noite como se tivesse acontecido com alguém famoso. Você vai assentir. Não vai dizer nada.`),
      t(`The light climbs the buildings floor by floor. Somebody starts clapping, slowly, and then everybody does, and none of you can say for what.`, `La luz sube por los edificios piso por piso. Alguien empieza a aplaudir, despacio, y luego todos lo hacen, y ninguno sabe decir por qué.`, `A luz sobe pelos prédios andar por andar. Alguém começa a aplaudir, devagar, e depois todo mundo aplaude, e nenhum de vocês sabe dizer por quê.`),
      t(`ÆRIEL puts the last record back in its sleeve. "That's the one," they say to nobody. "That's the one that stays."`, `ÆRIEL guarda el último disco en su funda. «Ese es», le dice a nadie. «Ese es el que se queda».`, `A ÆRIEL guarda o último disco na capa. «Esse é», diz pra ninguém. «Esse é o que fica».`),
      t(`The roof door swings shut behind the last person to leave. For the first time all night, nobody is looking at a phone.`, `La puerta del techo se cierra detrás de la última persona. Por primera vez en toda la noche, nadie mira un celular.`, `A porta do terraço fecha atrás da última pessoa. Pela primeira vez a noite toda, ninguém está olhando pro celular.`)
    ],
    romance: [
      t(`Your phone buzzes in your pocket and you don't look. Whatever it says, it can wait four minutes. The person next to you is already telling you what they want for breakfast.`, `Tu celular vibra en el bolsillo y no lo miras. Lo que diga puede esperar cuatro minutos. La persona a tu lado ya te está contando qué quiere de desayuno.`, `Seu celular vibra no bolso e você não olha. O que quer que diga pode esperar quatro minutos. A pessoa ao seu lado já tá te contando o que quer de café da manhã.`),
      t(`Two shadows on the pavement, one slightly taller, both slightly in step. You have never walked so slowly in your life, and you hope the street goes on for a mile.`, `Dos sombras en la vereda, una un poco más alta, las dos un poco al compás. Nunca caminaste tan lento en tu vida, y esperas que la calle siga una milla más.`, `Duas sombras na calçada, uma um pouco mais alta, as duas um pouco no mesmo passo. Você nunca andou tão devagar na vida, e espera que a rua continue por mais um quilômetro.`),
      t(`"Come to mine," says the person, then adds, "for tea. And toast. And maybe a long conversation." You agree to all three, in that order, out of principle.`, `«Ven a mi casa», dice la persona, y agrega: «por un té. Y una tostada. Y quizás una conversación larga». Aceptas las tres, en ese orden, por principio.`, `«Vem pra minha casa», diz a pessoa, e acrescenta: «pra um chá. E uma torrada. E talvez uma conversa longa». Você aceita as três, nessa ordem, por princípio.`),
      t(`At the corner, you realise you are still holding a hand, and neither of you has noticed that you stopped talking a block ago. The traffic light turns green. Neither of you goes.`, `En la esquina te das cuenta de que todavía sostienes una mano, y ninguno notó que dejaron de hablar hace una cuadra. El semáforo se pone en verde. Ninguno avanza.`, `Na esquina você percebe que ainda segura uma mão, e nenhum dos dois notou que parou de falar faz um quarteirão. O sinal fica verde. Nenhum dos dois anda.`)
    ],
    together: [
      t(`The four of you share one bench and one box of chips, which is a poem if you squint. Someone's head is on someone's shoulder. Nobody says who.`, `Los cuatro comparten un banco y una caja de papas fritas, que es un poema si entrecierras los ojos. La cabeza de alguien está en el hombro de alguien. Nadie dice de quién.`, `Os quatro dividem um banco e uma caixa de batata frita, que é um poema se você apertar os olhos. A cabeça de alguém está no ombro de alguém. Ninguém diz de quem.`),
      t(`Luisa counts heads out loud. "Four. Four. We have four." She says it twice more, in case the universe is listening.`, `Luisa cuenta cabezas en voz alta. «Cuatro. Cuatro. Tenemos cuatro». Lo dice dos veces más, por si el universo escucha.`, `A Luisa conta cabeças em voz alta. «Quatro. Quatro. A gente tem quatro». Ela diz mais duas vezes, caso o universo esteja ouvindo.`),
      t(`Benja is telling the story already, in the future tense, to a bus stop. Feña is nodding along to a version that does not exist yet and will, by lunch, be completely accurate.`, `Benja ya está contando la historia, en tiempo futuro, a una parada de autobús. Feña asiente a una versión que todavía no existe y que, al mediodía, será completamente exacta.`, `O Benja já tá contando a história, no futuro, pra um ponto de ônibus. O Feña assente a uma versão que ainda não existe e que, ao meio-dia, vai ser completamente exata.`),
      t(`You all agree to meet again next month. Everyone knows you will, and everyone knows you will be late, and all of you are already looking forward to the lateness.`, `Todos acuerdan reencontrarse el mes que viene. Todos saben que lo harán, y todos saben que llegarán tarde, y todos ya esperan con ganas la tardanza.`, `Todo mundo concorda em se encontrar de novo no mês que vem. Todo mundo sabe que vai, e todo mundo sabe que vai chegar atrasado, e todos já esperam com carinho o atraso.`)
    ],
    wrecked: [
      t(`A stranger hands you a bottle of water. Another presses a banana into your palm. Somewhere, a kind person you will never see again is holding your shoes.`, `Un desconocido te pasa una botella de agua. Otro te pone una banana en la palma. En algún lugar, una persona amable a quien no volverás a ver sostiene tus zapatos.`, `Um estranho te passa uma garrafa de água. Outro põe uma banana na sua palma. Em algum lugar, uma pessoa gentil que você nunca mais vai ver segura os seus sapatos.`),
      t(`The sun comes up. You raise one hand against it, and the people next to you do the same, and for a minute you are a row of small salutes to a large star.`, `El sol sale. Levantas una mano contra él, y la gente a tu lado hace lo mismo, y por un minuto son una fila de pequeños saludos a una estrella grande.`, `O sol nasce. Você levanta uma mão contra ele, e as pessoas ao seu lado fazem o mesmo, e por um minuto vocês são uma fileira de pequenas continências a uma estrela grande.`),
      t(`Your body stops negotiating and falls asleep. It will be a good sleep.`, `Tu cuerpo deja de negociar y se duerme. Va a ser un buen sueño.`, `Seu corpo para de negociar e dorme. Vai ser um bom sono.`),
      t(`The taxi driver looks at you in the mirror and says nothing, which is the most professional mercy there is. The radio plays something soft. You do not die. You are very much alive and extremely tired.`, `El taxista te mira por el espejo y no dice nada, que es la misericordia más profesional que existe. La radio pone algo suave. No te mueres. Estás con vida y con un cansancio enorme.`, `O motorista do táxi te olha pelo espelho e não diz nada, que é a misericórdia mais profissional que existe. O rádio toca algo suave. Você não morre. Você tá com vida e com um cansaço enorme.`)
    ],
    missing: [
      t(`Somewhere in the building a phone is ringing, and it is a number you recognise. You will pick up. You will say sorry. They will say "you're an idiot" in the tone of love.`, `En algún lugar del edificio suena un celular, y es un número que reconoces. Vas a contestar. Vas a pedir perdón. Dirán «qué desastre eres» en tono de cariño.`, `Em algum lugar do prédio um celular toca, e é um número que você reconhece. Você vai atender. Vai pedir desculpa. Vão dizer «você é um desastre» em tom de amor.`),
      t(`You make it a rule: next time, you check where your people are before the lights go on. You will break this rule within the month, tenderly.`, `Te pones una regla: la próxima vez, revisas dónde está tu gente antes de que se enciendan las luces. La romperás en menos de un mes, con ternura.`, `Você cria uma regra: da próxima vez, confere onde está a sua galera antes de acenderem as luzes. Vai quebrar essa regra em menos de um mês, com ternura.`),
      t(`The street is long and empty. Then, at the far end, three silhouettes under one streetlight, waving their entire arms. Somebody is shouting your name.`, `La calle es larga y está vacía. Entonces, al fondo, tres siluetas bajo un solo farol, saludando con los brazos enteros. Alguien grita tu nombre.`, `A rua é longa e vazia. Aí, lá no fundo, três silhuetas debaixo de um poste só, acenando com os braços inteiros. Alguém grita o seu nome.`),
      t(`Nobody's angry, which is somehow worse. They've left you their jackets on the bench outside, and a note: "WATER. GO HOME. LOVE YOU." You sit between the jackets for a while.`, `Nadie está enojado, lo que de algún modo es peor. Te dejaron sus chaquetas en el banco de afuera, y una nota: «AGUA. A CASA. TE QUEREMOS». Te sientas entre las chaquetas un rato.`, `Ninguém está bravo, o que de algum jeito é pior. Deixaram as jaquetas no banco lá fora e um bilhete: «ÁGUA. PRA CASA. A GENTE TE AMA». Você senta entre as jaquetas por um tempo.`)
    ],
    left_early: [
      t(`The night keeps going without you, and you can hear it a block away: a low, warm thump behind a wall. You walk the other way. It was a good decision, and it will feel like one by Thursday.`, `La noche sigue sin ti, y la oyes una cuadra más allá: un golpe bajo y tibio detrás de una pared. Caminas para el otro lado. Fue una buena decisión, y se sentirá así para el jueves.`, `A noite continua sem você, e dá pra ouvir a um quarteirão: uma batida baixa e quente atrás de uma parede. Você anda pro outro lado. Foi uma boa decisão, e vai parecer isso até quinta.`),
      t(`At home you drink a glass of water standing at the sink. Your shoes lie on their sides. You smile at the ceiling, for knowing when.`, `En casa tomas un vaso de agua parado frente a la pileta. Tus zapatos yacen de costado. Le sonríes al techo, por saber cuándo.`, `Em casa você bebe um copo d'água em pé na pia. Seus sapatos jazem de lado. Você sorri pro teto, por saber a hora.`),
      t(`Your group chat is a long scroll of hearts and "WHERE DID YOU GO" and "good. sleep." You answer all of it with one word: "water."`, `El chat del grupo es un largo scroll de corazones, «ADÓNDE FUISTE» y «bien. duerme». Respondes todo con una palabra: «agua».`, `O grupo no chat é um longo scroll de corações, «PRA ONDE VOCÊ FOI» e «bom. dorme». Você responde tudo com uma palavra: «água».`),
      t(`A stray cat follows you for one whole block, thinking you know where the food is. You tell it you do not. It follows you anyway.`, `Un gato callejero te sigue una cuadra entera, creyendo que sabes dónde hay comida. Le dices que no. Te sigue igual.`, `Um gato de rua te segue por um quarteirão inteiro, achando que você sabe onde tem comida. Você diz que não. Ele segue mesmo assim.`)
    ],
    bored: [
      t(`The night did not take. That happens. You sleep a deep, forgiving sleep. Tomorrow another one begins, and you will walk into it as someone who learned to leave.`, `La noche no prendió. Pasa. Duermes un sueño profundo y perdonador. Mañana empieza otra, y entrarás en ella como alguien que aprendió a irse.`, `A noite não pegou. Acontece. Você dorme um sono fundo e perdoador. Amanhã começa outra, e você vai entrar nela como alguém que aprendeu a ir embora.`),
      t(`In the kitchen at dawn you eat an enormous bowl of cereal in a flat light. It tastes better than anything in the club.`, `En la cocina al amanecer te comes un enorme plato de cereal bajo una luz plana. Sabe mejor que todo lo del club.`, `Na cozinha ao amanhecer você come uma tigela enorme de cereal numa luz chapada. Tem um gosto melhor do que tudo no club.`),
      t(`There is a version of the night you wanted. You can describe it perfectly. It lives in a city next to this one, and it is waiting for you next weekend, with better shoes.`, `Hay una versión de la noche que querías. La puedes describir perfecta. Vive en una ciudad al lado de esta, y te espera el próximo fin de semana, con mejores zapatos.`, `Existe uma versão da noite que você queria. Você consegue descrevê-la perfeitamente. Ela mora numa cidade ao lado desta, e te espera no próximo fim de semana, com sapatos melhores.`),
      t(`You text someone from the group "it wasn't my night", and they answer in four seconds with a photo of a sad hamster wearing a tiny crown. You laugh until it hurts.`, `Le escribes a alguien del grupo «no fue mi noche», y responde en cuatro segundos con una foto de un hámster triste con una coronita. Te ríes hasta que duele.`, `Você escreve pra alguém do grupo «não foi minha noite», e a pessoa responde em quatro segundos com uma foto de um hamster triste usando uma coroinha. Você ri até doer.`)
    ],
    burnout: [
      t(`The quiet comes down, and for the first time in hours you can hear your own pulse. It has been with you the whole time. Thank it.`, `Cae el silencio, y por primera vez en horas oyes tu propio pulso. Estuvo contigo todo el tiempo. Agradécele.`, `O silêncio desce e, pela primeira vez em horas, você ouve o próprio pulso. Esteve com você o tempo todo. Agradeça.`),
      t(`You step out for air and discover the sky is enormous. It is full of nothing and nobody wants anything from it.`, `Sales a tomar aire y descubres que el cielo es enorme. Está lleno de nada y nadie le pide nada.`, `Você sai pra tomar ar e descobre que o céu é enorme. Está cheio de nada e ninguém quer nada dele.`),
      t(`A friend finds you on the steps and sits down without a word. Ten minutes later they say, "it's a lot, huh?" You nod. They nod.`, `Un amigo te encuentra en los escalones y se sienta sin una palabra. Diez minutos después dice «es mucho, ¿no?» Asientes. Asiente.`, `Um amigo te acha na escada e senta sem dizer nada. Dez minutos depois diz «é muita coisa, né?» Você assente. Ele assente.`),
      t(`You take a long, slow walk. A baker is carrying a tray of bread through a back door and gives you a roll without asking. The roll is warm.`, `Das una caminata larga y lenta. Un panadero lleva una bandeja de pan por una puerta trasera y te da un pan sin preguntar. El pan está tibio.`, `Você faz uma caminhada longa e lenta. Um padeiro leva uma bandeja de pão por uma porta dos fundos e te dá um pãozinho sem perguntar. O pão está quente.`)
    ]
  };
  story.codas = CODA;
  Object.keys(CODA).forEach(function (id) {
    const ed = EM.ENDINGS[id]; if (!ed || ed.reset) return;
    ed.text = [].concat(ed.text, [function (s) {
      const list = CODA[id];
      return list[Math.floor(EM.hash2((s.seed || 1) + (s.attempt || 1) * 31 + (s.time || 0), id.length * 7, 199) * list.length) % list.length];
    }]);
  });
})();

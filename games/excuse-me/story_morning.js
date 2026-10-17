/* EXCUSE ME — the morning after: your phone, a few hours after the credits. Funny and wholesome.
   Some friends took someone home, some check in, some say thank you, some remember what you did. */
'use strict';
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
        T('Update: I am fine, I am at a person\'s apartment, the person is a sound engineer and has opinions about my snare. I am taking notes. Possibly also taking the person. Do not wait up.', 'Novedades: estoy bien, estoy en el departamento de una persona, la persona es ingeniera de sonido y tiene opiniones sobre mi caja. Estoy tomando notas. Quizás también me lleve a la persona. No me esperen.', 'Novidades: tô bem, tô no apartamento de uma pessoa, a pessoa é engenheira de som e tem opiniões sobre minha caixa. Tô tomando nota. Talvez eu leve a pessoa também. Não me esperem.'),
        T('Do not judge. I went home with the bartender who made the lemon thing. They are making breakfast in an apron. The apron says something in a language I am pretending not to read.', 'No juzguen. Me fui con el barman que hizo la cosa de limón. Está preparando el desayuno con un delantal. El delantal dice algo en un idioma que finjo no leer.', 'Não julguem. Fui pra casa com o barman que fez aquela coisa de limão. Tá preparando o café da manhã de avental. O avental diz algo num idioma que eu finjo não ler.')
      ],
      safe: [
        T('Home, keys found, shoe found, dignity pending. Send me a thumbs up so I know you are alive.', 'En casa, llaves encontradas, zapato encontrado, dignidad pendiente. Mándenme un pulgar arriba para saber que están vivos.', 'Em casa, chaves achadas, sapato achado, dignidade pendente. Me mandem um joinha pra eu saber que estão vivos.'),
        T('Check-in: home, showered, alive. Someone\'s lanyard is in my pocket. If it is yours, I am sorry. If it is not yours, also sorry.', 'Aviso: en casa, bañada, viva. Hay una credencial de alguien en mi bolsillo. Si es tuya, perdón. Si no es tuya, también perdón.', 'Aviso: em casa, de banho tomado, viva. Tem um crachá de alguém no meu bolso. Se for seu, desculpa. Se não for seu, desculpa também.')
      ],
      thanks: [
        T('Thank you for tonight. Genuinely. I needed people who say "nobody gets lost" and mean it.', 'Gracias por esta noche. De verdad. Necesitaba gente que diga «nadie se pierde» y lo diga en serio.', 'Obrigada pela noite. De verdade. Eu precisava de gente que diz «ninguém se perde» e fala sério.'),
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
        T('I am okay. I made it home. I slept in my clothes on top of the blanket like a very organised cat.', 'Estoy bien. Llegué a casa. Dormí vestido encima de la manta como un gato muy organizado.', 'Tô bem. Cheguei em casa. Dormi vestido em cima do cobertor feito um gato muito organizado.')
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
      home: T('$, I am happy for you. Please text when you are home. Not because I doubt you. Because I like you.', '$, me alegro por ti. Escribe cuando llegues a casa. No porque dude de ti. Porque te quiero.', '$, fico feliz por você. Manda mensagem quando chegar em casa. Não porque eu duvide. Porque eu gosto de você.'),
      safe: T('Glad you are safe, $. I checked the lock for you too.', 'Qué bueno que llegaste bien, $. Yo también revisé el cerrojo por ti.', 'Que bom que você chegou bem, $. Eu conferi a tranca por você também.'),
      thanks: T('Same. All of it. The wall too.', 'Igual. Todo. La pared también.', 'Igual. Tudo. A parede também.')
    }
  };
  const IDX = { maru: 0, dani: 1, tato: 2 };

  /* messages that react to what you did, in priority order */
  const REF = [
    { id: 'self', top: true, who: 'dani', ok: function (s) { return s.attempt > 1; }, t: T('Have we done this before? Do not answer. I will get sad.', '¿Ya hicimos esto antes? No contestes. Me voy a poner triste.', 'A gente já fez isso antes? Não responde. Vou ficar triste.') },
    { id: 'ariel', top: true, who: '#ÆRIEL', ok: function (s) { return s.flags.resident_friend; }, t: T('this is ÆRIEL. Dragan gave me your number off the list. Please do not tell anyone I texted. Thank you for the water. The thermos says hi. Drink yours.', 'soy ÆRIEL. Dragan me dio tu número de la lista. Por favor no le cuentes a nadie que escribí. Gracias por el agua. El termo te saluda. Toma la tuya.', 'aqui é ÆRIEL. O Dragan me deu seu número da lista. Por favor, não conta pra ninguém que eu mandei mensagem. Valeu pela água. A garrafa térmica manda um oi. Beba a sua.') },
    { id: 'dragan', top: true, who: '#DRAGAN', ok: function (s) { return story.gagLevel(s, 'ae') >= 1 || s.flags.ae_list || s.flags.ae_rules; }, t: function (s) {
      return (s.attempt || 1) >= 3
        ? T('You are on the list of people on the list of people on the list. I have stopped counting. The clipboard has not.', 'Estás en la lista de la gente de la lista de la gente de la lista. Dejé de contar. La carpeta no.', 'Você tá na lista das pessoas da lista das pessoas da lista. Parei de contar. A prancheta não.')
        : T('You are now on a list. It is for people who asked about the list. It has two names. One is yours. Do not ask about the other.', 'Ahora estás en una lista. Es para la gente que preguntó por la lista. Tiene dos nombres. Uno es el tuyo. No preguntes por el otro.', 'Você agora tá numa lista. É pra quem perguntou da lista. Tem dois nomes. Um é o seu. Não pergunte do outro.');
    } },
    { id: 'tato_check', who: 'tato', ok: function (s) { return s.flags.tato_checked; }, t: T('Also: thanks for asking at the start if I was okay. Nobody asks. I thought about it all night.', 'Además: gracias por preguntarme al principio si estaba bien. Nadie pregunta. Lo pensé toda la noche.', 'Ah, e: valeu por perguntar no começo se eu tava bem. Ninguém pergunta. Pensei nisso a noite toda.') },
    { id: 'cat', who: 'dani', ok: function (s) { return s.flags.pet_cat; }, t: T('The cat on the stairs has a name. Bassline. A man told me. It is on the staff list.', 'El gato de las escaleras tiene nombre. Bassline. Me lo dijo un señor. Está en la lista del personal.', 'O gato da escada tem nome. Bassline. Um moço me contou. Tá na lista dos funcionários.') },
    { id: 'pillgood', who: 'maru', ok: function (s) { return s.pill.tested && s.flags.pill_taken && !s.flags.pill_fake; }, t: T('Honest question: should checking be a tradition? Nuri was an angel. I want her to have a medal.', 'Pregunta honesta: ¿el chequeo debería ser una tradición? Nuri fue un ángel. Quiero que le den una medalla.', 'Pergunta sincera: a checagem devia virar tradição? A Nuri foi um anjo. Quero que ela ganhe uma medalha.') },
    { id: 'pillnothing', who: 'maru', ok: function (s) { return s.flags.pill_nothing; }, t: T('Remember the mint? Fully a mint. I am keeping the wrapper.', '¿Te acuerdas de la menta? Era 100% una menta. Me quedo con el envoltorio.', 'Lembra da bala de menta? Era 100% uma bala de menta. Vou ficar com a embalagem.') },
    { id: 'pillfaint', who: 'tato', ok: function (s) { return s.flags.pill_faint; }, t: T('I am still shaking about the faint. Next time we test first. Promise me.', 'Todavía estoy temblando por el desmayo. La próxima probamos primero. Prométemelo.', 'Ainda tô tremendo por causa do desmaio. Da próxima a gente testa antes. Me promete.') },
    { id: 'pillskip', who: 'dani', ok: function (s) { return s.flags.pill_binned || s.flags.pill_skipped; }, t: T('Thank you for not taking the thing you did not trust. That sentence is a lot but you understand.', 'Gracias por no tomar lo que no te daba confianza. La frase es mucho, pero entiendes.', 'Valeu por não tomar aquilo em que você não confiava. A frase é demais, mas você entende.') },
    { id: 'rolling', who: 'dani', ok: function (s) { return s.flags.rolling && !s.flags.pill_fake; }, t: T('I am still warm. I think I am made of toast.', 'Sigo tibio. Creo que estoy hecho de pan tostado.', 'Ainda tô quentinho. Acho que sou feito de torrada.') },
    { id: 'coke', who: 'maru', ok: function (s) { return s.flags.took_coke; }, t: T('Heard you were REALLY sharp around three? Remember it all? Drink water, you machine.', '¿Escuché que tenías la mente MUY afilada como a las tres? ¿Te acuerdas de todo? Toma agua, máquina.', 'Ouvi dizer que sua cabeça tava MUITO afiada lá pelas três? Lembra de tudo? Bebe água, máquina.') },
    { id: 'ketok', who: 'dani', ok: function (s) { return s.flags.ket_ok; }, t: T('You were the nicest person on the floor around two. You asked a stranger about her mother and she cried. Good cry.', 'Eras la persona más amable de la pista como a las dos. Le preguntaste a una desconocida por su mamá y lloró. Un buen llanto.', 'Você era a pessoa mais gentil da pista lá pelas duas. Perguntou a uma estranha da mãe dela e ela chorou. Choro bom.') },
    { id: 'ketfaint', who: 'tato', ok: function (s) { return s.flags.ket_faint; }, t: T('Teo told me about the floor thing. I am not mad. I am keeping my phone on all week for you.', 'Teo me contó lo del piso. No estoy enojado. Voy a tener el celular prendido toda la semana por ti.', 'O Teo me contou da história do chão. Não tô bravo. Vou deixar o celular ligado a semana toda por você.') },
    { id: 'dark', who: 'dani', ok: function (s) { return s.flags.dark_first; }, t: T('I found my glasses in the dark room. I was not wearing glasses.', 'Encontré mis lentes en el cuarto oscuro. No llevaba lentes.', 'Achei meus óculos na sala escura. Eu não estava de óculos.') },
    { id: 'together', who: 'maru', ok: function (s) { return s.flags.promised_together && s.party.length === 3; }, t: T('We said nobody gets lost. Nobody did. I am proud of us.', 'Dijimos que nadie se perdía. Nadie se perdió. Estoy orgullosa de nosotros.', 'A gente falou que ninguém se perdia. Ninguém se perdeu. Tenho orgulho da gente.') },
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
    { id: 'wedding', who: 'dani', ok: function (s) { return s.flags.dare_done; }, t: T('The DJ nodded at you like a monarch. I will tell this story at my own wedding, to the headlamp.', 'El DJ te asintió como un monarca. Voy a contar esta historia en mi propia boda, frente a la linterna.', 'O DJ assentiu pra você como um monarca. Vou contar essa história no meu próprio casamento, pra lanterna.') },
    { id: 'selfie', who: 'maru', ok: function (s) { return s.flags.group_selfie; }, t: T('The selfie is the album cover. I have no album. I will make an album.', 'La selfie es la tapa del disco. No tengo disco. Voy a hacer un disco.', 'A selfie é a capa do álbum. Eu não tenho álbum. Vou fazer um álbum.') },
    { id: 'brunch', top: true, who: 'maru', ok: function (s) { return (s.bad || 0) >= 6; }, t: T('Brunch Thursday. We need to circle back on a few things. Mostly the ones that started with "pushed".', 'Brunch el jueves. Tenemos que volver sobre algunas cosas. Sobre todo las que empezaron con «empujé».', 'Brunch na quinta. A gente precisa voltar em algumas coisas. Principalmente as que começaram com «empurrei».') }
  ];

  story.morningRefs = REF;
  /* a chain that already paid off in the night can skip the morning */
  story.morningPay = function (s, id) { return !s.flags['pay_' + id] || s.flags['pay_' + id] !== 'night'; };
  const PREF = { maru: 'MARU', dani: 'DANI', tato: 'TATO' };
  story.morning = function (s) {
    const msgs = [];
    const seed = (s.seed || 1) + (s.attempt || 1) * 13;
    ['maru', 'dani', 'tato'].forEach(function (f) {
      const r = EM.hash2(seed, IDX[f], 77), v = Math.floor(EM.hash2(seed, IDX[f], 78) * 2);
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
          const nm = EM.CAST[m0.who].name, tpl = REPLY[rf][m0.fate];
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

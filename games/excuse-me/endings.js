/* EXCUSE ME — eleven endings and the Night Report. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, story = EM.story;

  /* text pages may be functions of the state */
  const E = EM.ENDINGS = {};

  E.banned = {
    art: 'door', music: 'chill', lp: 700,
    title: T('THE LONG WALK TO THE DOOR', 'LA LARGA CAMINATA HASTA LA PUERTA', 'A LONGA CAMINHADA ATÉ A PORTA'),
    text: [
      T('Ofelia does not touch you. Dragan does not touch you. Between them you are simply moved along the building like a very well-mannered piece of furniture: past the bar, past the foyer, past the coat check, where Luca raises two fingers in something that could be a salute or a goodbye.', 'Ofelia no te toca. Dragan no te toca. Entre los dos te desplazan por el edificio como a un mueble muy bien educado: pasas el bar, el foyer, el guardarropa, donde Luca levanta dos dedos en algo que podría ser un saludo o una despedida.', 'A Ofelia não te toca. O Dragan não te toca. Entre os dois você é simplesmente deslocado pelo prédio como um móvel muito bem-educado: passa pelo bar, pelo foyer, pela chapelaria, onde o Luca levanta dois dedos num gesto que pode ser saudação ou despedida.'),
      function (s) { return s.party.length ? T('Your people follow you out, because that is who they are. Maru is already on her phone, ordering something that is not an ambulance.', 'Tu gente te sigue hacia afuera, porque así son. Maru ya está con el celular, pidiendo algo que no es una ambulancia.', 'Sua galera te segue pra fora, porque é quem eles são. A Maru já tá no celular, pedindo algo que não é uma ambulância.') : T('Your friends are somewhere inside, still dancing, and they will message at six. The message will say "where r u".', 'Tus amigos están adentro, todavía bailando, y escribirán a las seis. El mensaje dirá «dónde estás».', 'Seus amigos estão lá dentro, ainda dançando, e vão mandar mensagem às seis. A mensagem vai dizer «cadê você».'); },
      T('Outside it is cold, the sky is still dark, and the street smells like rain on concrete. You are not in trouble. You are only done. Your name is in a very small book, and the door will remember you for a month.', 'Afuera hace frío, el cielo sigue oscuro y la calle huele a lluvia sobre concreto. No estás en problemas. Solo terminaste. Tu nombre está en un libro muy pequeño, y la puerta te va a recordar un mes.', 'Lá fora está frio, o céu ainda tá escuro e a rua cheira a chuva no concreto. Você não tá encrencado. Só acabou. Seu nome está num livro bem pequeno, e a porta vai se lembrar de você por um mês.')
    ]
  };

  E.ambulance = {
    art: 'siren', music: 'chill', lp: 500,
    title: T('THE SECOND TIME', 'LA SEGUNDA VEZ', 'A SEGUNDA VEZ'),
    text: [
      T('A ceiling again. A different one: the white panels of an ambulance. A paramedic says your name correctly on the third try. Someone is holding your hand and it is not you.', 'Un techo otra vez. Uno distinto: los paneles blancos de una ambulancia. Un paramédico dice tu nombre bien a la tercera. Alguien te sostiene la mano y no eres tú.', 'Um teto de novo. Outro: os painéis brancos de uma ambulância. Um paramédico diz seu nome certo na terceira tentativa. Alguém segura sua mão e não é você.'),
      T('Teo said this would happen if you went out twice. He did not say it with a lecture. He said it like a weather forecast. Maru is in the back, white-faced, holding your water bottle and nobody has asked her to put it down.', 'Teo dijo que esto pasaría si salías dos veces. No lo dijo con un sermón. Lo dijo como un pronóstico del clima. Maru va atrás, pálida, sosteniendo tu botella de agua, y nadie le pidió que la suelte.', 'O Teo disse que isso aconteceria se você apagasse duas vezes. Não disse com sermão. Disse como previsão do tempo. A Maru tá atrás, pálida, segurando sua garrafa de água, e ninguém pediu pra ela soltar.'),
      T('You are going to be okay. The night is over in the way nights end when a body files a formal complaint. Somewhere behind you, the building keeps playing music to the people who are still dancing. It does not need you. It will be glad to see you again.', 'Vas a estar bien. La noche termina como terminan las noches cuando un cuerpo presenta una queja formal. En algún lugar detrás, el edificio sigue poniendo música a los que siguen bailando. No te necesita. Se alegrará de verte otra vez.', 'Você vai ficar bem. A noite acaba do jeito que as noites acabam quando um corpo registra uma reclamação formal. Em algum lugar atrás, o prédio continua tocando música pra quem ainda dança. Não precisa de você. Vai ficar feliz de te ver de novo.')
    ]
  };

  E.burnout = {
    art: 'bench', music: 'chill', lp: 300,
    title: T('THE STALL HERMIT', 'EL ERMITAÑO DE LA CABINA', 'O ERMITÃO DA CABINE'),
    text: [
      T('You reach the bottom of the battery. Not with a crash. With a quiet click, like a light going off in a room you were already leaving. You find a stall, lock it, and sit down on a closed lid with your forehead against the cold partition.', 'Llegas al fondo de la batería. No con un golpe. Con un clic bajito, como una luz que se apaga en un cuarto del que ya te ibas. Encuentras una cabina, le pones traba y te sientas sobre una tapa cerrada con la frente contra el tabique frío.', 'Você chega ao fundo da bateria. Não com um estrondo. Com um clique baixinho, feito uma luz que apaga numa sala da qual você já estava saindo. Acha uma cabine, tranca e senta numa tampa fechada com a testa contra a divisória fria.'),
      T('People knock. You say "occupied" in a voice you do not recognise. The music through the wall sounds like rain. At some point a paper cup of water slides under the door, and then a folded note: "we\'re outside whenever you\'re ready. no rush. —M." You sit with it for a long while.', 'La gente golpea. Dices «ocupado» con una voz que no reconoces. La música a través de la pared suena a lluvia. En algún momento un vasito de agua se desliza bajo la puerta, y luego una nota doblada: «estamos afuera cuando estés listo. sin apuro. —M.» La sostienes un buen rato.', 'As pessoas batem. Você diz «ocupado» com uma voz que não reconhece. A música pela parede soa como chuva. Em algum momento um copinho d\'água desliza por baixo da porta, e depois um bilhete dobrado: «tamo lá fora quando você estiver pronto. sem pressa. —M.» Você fica com ele um bom tempo.'),
      T('You do not see the sunrise. You see the inside of a stall for three hours and it is, honestly, a form of rest. It is not a defeat. It is a night that taught you exactly how much of you there is.', 'No ves el amanecer. Ves el interior de una cabina durante tres horas y es, honestamente, una forma de descanso. No es una derrota. Es una noche que te enseñó exactamente cuánto de ti hay.', 'Você não vê o amanhecer. Vê o interior de uma cabine por três horas e é, honestamente, uma forma de descanso. Não é uma derrota. É uma noite que te ensinou exatamente o quanto de você existe.')
    ]
  };

  E.bored = {
    art: 'road', music: 'chill', lp: 900,
    title: T('THE EARLY UBER', 'EL UBER TEMPRANO', 'O UBER CEDO'),
    text: [
      T('You check your phone: 9%. You have not danced in a long time. You have not laughed in longer. The night is happening to other people, beautifully, behind glass. You stand at the edge of the floor like a coat nobody came back for.', 'Miras el celular: 9%. Hace mucho que no bailas. Hace más que no te ríes. La noche le está pasando a otras personas, hermosamente, detrás de un vidrio. Te quedas al borde de la pista como un abrigo por el que nadie volvió.', 'Você olha o celular: 9%. Faz muito tempo que não dança. Mais ainda que não ri. A noite tá acontecendo pra outras pessoas, lindamente, atrás de um vidro. Você fica na beirada da pista feito um casaco que ninguém voltou pra buscar.'),
      T('You leave without telling anyone. A taxi light turns the corner. In the back seat, you text the group: "tired. love you. have the best sunrise." You sleep like a stone.', 'Te vas sin avisar. Una luz de taxi dobla la esquina. En el asiento trasero escribes al grupo: «{cansado|cansada|sin pilas}. los quiero. que tengan el mejor amanecer». Duermes como una piedra.', 'Você vai embora sem avisar. Uma luz de táxi dobra a esquina. No banco de trás você escreve pro grupo: «{cansado|cansada|sem bateria}. amo vocês. tenham o melhor amanhecer». Dorme como uma pedra.'),
      T('At noon, Maru\'s reply: "you missed it. it was something. we saved you half a sandwich."', 'Al mediodía, la respuesta de Maru: «te lo perdiste. fue algo. te guardamos medio sándwich».', 'Ao meio-dia, a resposta da Maru: «você perdeu. foi algo. guardamos metade de um sanduíche pra você».')
    ]
  };

  E.closing = {
    art: 'bench', music: 'chill', lp: 1200,
    title: T('HOUSE LIGHTS', 'LUCES DE SALA', 'LUZES ACESAS'),
    text: [
      T('At eight the house lights come on, and every flaw in the room comes on with them. The floor is sticky. The speakers look like furniture. Rosa is already mopping the dance floor in slow figure eights, looking at nobody, noticing everyone.', 'A las ocho se encienden las luces de sala, y con ellas todos los defectos del cuarto. El piso está pegajoso. Los parlantes parecen muebles. Rosa ya trapea la pista en ochos lentos, sin mirar a nadie, notando a todos.', 'Às oito acendem as luzes da casa, e com elas todos os defeitos da sala. O chão tá grudento. As caixas parecem móveis. A Rosa já esfrega a pista em oitos lentos, sem olhar pra ninguém, reparando em todo mundo.'),
      T('You missed the roof and the sunrise. You did not miss the night. You walk out into a morning that is far too bright, holding whatever you have left of it, squinting like a person born.', 'Te perdiste el techo y el amanecer. No te perdiste la noche. Sales a una mañana demasiado brillante, sosteniendo lo que te queda, entrecerrando los ojos como quien acaba de nacer.', 'Você perdeu o terraço e o amanhecer. Não perdeu a noite. Sai pra uma manhã brilhante demais, segurando o que sobrou dela, apertando os olhos como quem acabou de nascer.')
    ]
  };

  E.left_early = {
    art: 'road', music: 'chill', lp: 1500,
    title: T('THE WALK TO THE TAXI', 'LA CAMINATA HASTA EL TAXI', 'A CAMINHADA ATÉ O TÁXI'),
    text: [
      function (s) { return s.party.length >= 2 ? T('You leave together. Maru has her shoes in her hand, Dani is humming a bassline he has forgotten the song of, and Tato leans on your shoulder with the quiet of someone who is relieved. Nobody says goodbye to the building. It does not need it.', 'Se van juntos. Maru lleva los zapatos en la mano, Dani tararea un bajo cuya canción olvidó, y Tato se apoya en tu hombro con el silencio de alguien aliviado. Nadie se despide del edificio. No lo necesita.', 'Vocês saem juntos. A Maru leva os sapatos na mão, o Dani cantarola uma linha de baixo de que esqueceu a música, e o Tato se apoia no seu ombro com o silêncio de quem tá aliviado. Ninguém se despede do prédio. Ele não precisa.') : T('You leave before the sky is properly light, which is not a defeat. It is a skill. Not everyone knows when a night is done with them. You do.', 'Te vas antes de que el cielo esté bien claro, lo cual no es una derrota. Es una habilidad. No todos saben cuándo una noche terminó con ellos. Tú sí.', 'Você vai embora antes de o céu clarear direito, o que não é uma derrota. É uma habilidade. Nem todo mundo sabe quando uma noite acabou com ele. Você sabe.'); },
      T('In the taxi, the radio is playing something warm and entirely unrelated. You close your eyes and let it be a different kind of music. You are going home. You will remember all of it. You will sleep the whole of tomorrow.', 'En el taxi, la radio toca algo tibio y totalmente ajeno. Cierras los ojos y dejas que sea otra clase de música. Vuelves a casa. Vas a recordar todo. Vas a dormir todo el día de mañana.', 'No táxi, o rádio toca algo morno e totalmente alheio. Você fecha os olhos e deixa ser outro tipo de música. Você vai pra casa. Vai lembrar de tudo. Vai dormir o dia de amanhã inteiro.')
    ]
  };

  E.legend = {
    art: 'sunrise_legend', music: 'closing', lp: 12000,
    title: T('THE LEGEND OF LA GRIETA', 'LA LEYENDA DE LA GRIETA', 'A LENDA DA GRIETA'),
    text: [
      T('On the roof, somebody you have never met hands you a thermos of tea and says "you\'re the one who—" and then tells a story that is a lovely distortion of something you did. By the time the sun clears the skyline, three separate people have told you three different versions of your night, and in all of them you were kind.', 'En el techo, alguien que nunca viste te da un termo de té y dice «tú eres quien…» y luego cuenta una historia que es una distorsión hermosa de algo que hiciste. Cuando el sol supera el horizonte, tres personas distintas te contaron tres versiones de tu noche, y en todas fuiste amable.', 'No terraço, alguém que você nunca viu te passa uma garrafa térmica de chá e diz «você é quem…» e conta uma história que é uma distorção linda de algo que você fez. Quando o sol passa do horizonte, três pessoas diferentes te contaram três versões da sua noite, e em todas você foi gentil.'),
      T('Dante will tell it with more crack. Rosa will tell it with fewer words. The Resident will play a version of it next month and nobody will know why the room goes quiet. You came for the music and you leave as one of the building\'s stories. Maru takes your hand and does not let go until the elevator.', 'Dante la contará con más grieta. Rosa la contará con menos palabras. La Resident tocará una versión el mes que viene y nadie sabrá por qué la sala se queda en silencio. Viniste por la música y te vas como una de las historias del edificio. Maru te toma de la mano y no te suelta hasta el ascensor.', 'O Dante vai contar com mais rachadura. A Rosa vai contar com menos palavras. A Resident vai tocar uma versão disso no mês que vem e ninguém vai saber por que a sala fica em silêncio. Você veio pela música e sai como uma das histórias do prédio. A Maru pega sua mão e não solta até o elevador.')
    ]
  };

  E.wrecked = {
    art: 'sunrise_wrecked', music: 'closing', lp: 3000,
    title: T('BARELY, BEAUTIFULLY', 'APENAS, HERMOSAMENTE', 'POR POUCO, LINDAMENTE'),
    text: [
      T('You made it to the roof. You are not sure how. Your shoes are in your hand, your voice is a rumour, and the sun arrives like a very expensive apology. Everyone near you is in a similar state of lovely ruin.', 'Llegaste al techo. No sabes cómo. Tus zapatos están en tu mano, tu voz es un rumor y el sol llega como una disculpa carísima. Todos a tu alrededor están en un estado parecido de ruina hermosa.', 'Você chegou ao terraço. Não sabe como. Seus sapatos estão na sua mão, sua voz é um boato e o sol chega feito um pedido de desculpas caríssimo. Todo mundo perto de você está num estado parecido de ruína linda.'),
      function (s) { return s.party.length ? T('Your people drag you home between them. Somebody puts a pastry in your hand. Somebody says "you were incredible" and does not specify at what.', 'Tu gente te lleva a casa entre todos. Alguien te pone un pastelito en la mano. Alguien dice «estuviste increíble» y no especifica en qué.', 'Sua galera te leva pra casa entre eles. Alguém põe um pastel na sua mão. Alguém diz «você tava incrível» e não especifica em quê.') : T('You ride home alone in a daze. It is the best kind of tired. Tomorrow will be a terrible day. You will keep the night anyway.', 'Vuelves a casa sin compañía, en una nube. Es la mejor clase de cansancio. Mañana será un día terrible. Igual te quedas con la noche.', 'Você volta pra casa só, numa nuvem. É o melhor tipo de cansaço. Amanhã vai ser um dia terrível. Você guarda a noite mesmo assim.'); }
    ]
  };

  E.romance = {
    art: 'sunrise_romance', music: 'closing', lp: 12000,
    title: T('TWO COFFEES', 'DOS CAFÉS', 'DOIS CAFÉS'),
    text: [
      T('"You made it." Sol appears at your elbow with two paper cups. "I bribed the Resident\'s manager with a chocolate bar." The sun rises. You do not touch each other. You stand with the exact distance between your shoulders that two people choose when they both want to choose it.', '«Llegaste». Sol aparece a tu lado con dos vasitos de papel. «Soborné al manager de la Resident con una barra de chocolate». Sale el sol. No se tocan. Quedan a la distancia exacta entre hombros que eligen dos personas cuando las dos quieren elegirla.', '«Você chegou». A Sol aparece do seu lado com dois copinhos de papel. «Subornei o manager da Resident com uma barra de chocolate». O sol nasce. Vocês não se tocam. Ficam na distância exata entre ombros que duas pessoas escolhem quando as duas querem escolher.'),
      T('"I\'d like to see you in daylight," she says. "If you want. No pressure." You say yes in a very small voice. She laughs. On the steps outside, with your friends yawning in a line behind you, you swap numbers on a napkin. The coffee is terrible. It is the best coffee in the world.', '«Me gustaría verte con luz de día», dice. «Si quieres. Sin presión». Dices que sí con una voz muy pequeña. Ella se ríe. En los escalones de afuera, con tus amigos bostezando en fila detrás, intercambian números en una servilleta. El café es horrible. Es el mejor café del mundo.', '«Eu gostaria de te ver à luz do dia», ela diz. «Se quiser. Sem pressão». Você diz que sim com uma voz bem pequena. Ela ri. Nos degraus lá fora, com seus amigos bocejando em fila atrás, vocês trocam números num guardanapo. O café é horrível. É o melhor café do mundo.')
    ]
  };

  E.together = {
    art: 'sunrise', music: 'closing', lp: 12000,
    title: T('ALL OF YOU, STILL', 'TODOS, TODAVÍA', 'TODOS, AINDA'),
    text: [
      function (s) { return s.flags.promised_together ? T('"Nobody gets lost." You said it at nine at night in a room full of noise, and you kept it. Maru, Dani and Tato stand with you on the roof with sunrise on their faces, ridiculous, exhausted, and exactly where they are supposed to be.', '«Nadie se pierde». Lo dijiste a las nueve de la noche en un cuarto lleno de ruido, y lo cumpliste. Maru, Dani y Tato están contigo en el techo con el amanecer en la cara, ridículos, agotados y exactamente donde deben estar.', '«Ninguém se perde». Você disse isso à noite, num salão cheio de barulho, e cumpriu. A Maru, o Dani e o Tato estão com você no terraço com o amanhecer no rosto, ridículos, exaustos e exatamente onde deveriam estar.') : T('You did not plan it. But you kept all of them close the whole night, and when the light comes up, all three of them are standing where you can touch them.', 'No lo planeaste. Pero los mantuviste cerca toda la noche, y cuando sube la luz los tres están donde puedes tocarlos.', 'Você não planejou. Mas manteve todos perto a noite inteira, e quando a luz sobe, os três estão onde você pode tocar.'); },
      T('You walk down the stairs together, slowly, one hand on each other\'s sleeves, and out onto a street that smells of bread. The group chat for the next week will be thirty percent photos of the sky and seventy percent "where is my shoe".', 'Bajan juntos las escaleras, despacio, con una mano en la manga del otro, y salen a una calle que huele a pan. El chat del grupo la semana que viene será treinta por ciento fotos del cielo y setenta por ciento «dónde está mi zapato».', 'Vocês descem as escadas juntos, devagar, uma mão na manga um do outro, e saem pra uma rua que cheira a pão. O grupo da semana que vem vai ser trinta por cento fotos do céu e setenta por cento «cadê meu sapato».')
    ]
  };

  E.missing = {
    art: 'sunrise_missing', music: 'closing', lp: 6000,
    title: T('AN EMPTY SPOT AT THE RAIL', 'UN LUGAR VACÍO EN LA BARANDA', 'UM LUGAR VAZIO NO PARAPEITO'),
    text: [
      T('You are on the roof as the sun comes up, and it is beautiful, and there is a person-shaped gap beside you. It is not tragedy. It is a night that went in more directions than you could hold. You hold what you have.', 'Estás en el techo cuando sale el sol, y es hermoso, y hay un hueco con forma de persona a tu lado. No es una tragedia. Es una noche que fue en más direcciones de las que pudiste sostener. Sostienes lo que tienes.', 'Você tá no terraço quando o sol nasce, e é lindo, e tem um buraco em forma de pessoa ao seu lado. Não é tragédia. É uma noite que foi em mais direções do que você conseguiu segurar. Você segura o que tem.'),
      T('Their messages arrive in the next two hours. One says "am i dead? am i alive? i love you." The other says "found a bench. found a better one. found you at the end of the street." Nobody is lost, exactly. Everybody is just somewhere else for a while.', 'Sus mensajes llegan en las próximas dos horas. Uno dice «¿estoy muerto? ¿estoy vivo? te quiero». El otro dice «encontré un banco. encontré uno mejor. te encontré al final de la calle». Nadie está perdido, exactamente. Todos están en otro lugar por un rato.', 'As mensagens chegam nas próximas duas horas. Uma diz «tô morto? tô vivo? te amo». A outra diz «achei um banco. achei um melhor. achei você no fim da rua». Ninguém tá perdido, exatamente. Todo mundo tá só em outro lugar por um tempo.')
    ]
  };

  /* ------------------------------------------------------------ friend lines */
  story.friendLine = function (f, s, withYou) {
    const f1 = s.flags, b = s.bond[f] || 0;
    if (f === 'maru') {
      if (b >= 4) return T('"You are my favourite person to survive a night with."', '«Eres mi persona favorita para sobrevivir una noche».', '«Você é minha pessoa favorita pra sobreviver a uma noite».');
      if (b >= 1) return T('"Thanks for not losing me."', '«Gracias por no perderme».', '«Valeu por não me perder».');
      return T('"It was a night."', '«Fue una noche».', '«Foi uma noite».');
    }
    if (f === 'dani') {
      if (f1.pill_binned) return T('Held your hand while he gave the pill up. Still dancing like a god.', 'Te sostuvo la mano mientras entregaba la pastilla. Todavía baila como un dios.', 'Segurou sua mão enquanto entregava o comprimido. Ainda dança como um deus.');
      if (f1.dani_took && s.pill.type === 'pure') return T('Still glowing. He thinks he saw God and she was wearing mesh.', 'Todavía brilla. Cree que vio a Dios y llevaba malla.', 'Ainda brilha. Ele acha que viu Deus e ela usava tela.');
      if (f1.dani_took && s.pill.type === 'mix') return T('Crashing. Sitting in a corner apologizing to nobody and drinking water.', 'Bajoneado. Sentado en un rincón pidiendo perdón a nadie y tomando agua.', 'Em baixão. Sentado num canto pedindo desculpa pra ninguém e bebendo água.');
      if (f1.dani_took) return T('Has decided to start testing everything, including friends.', 'Decidió empezar a testear todo, incluidos los amigos.', 'Decidiu começar a testar tudo, inclusive amigos.');
      return T('Sober as a nun and dancing like a god.', 'Sobrio como una monja y bailando como un dios.', 'Sóbrio como uma freira e dançando como um deus.');
    }
    if (f === 'tato') {
      if (f1.tato_closure) return T('Lighter. He said what he needed to say.', 'Más liviano. Dijo lo que necesitaba decir.', 'Mais leve. Disse o que precisava dizer.');
      if (f1.tato_sat) return T('Needed the quiet room. You came back for him.', 'Necesitó la sala tranquila. Volviste por él.', 'Precisou da sala de calma. Você voltou por ele.');
      if (f1.tato_calm) return T('Breathed with you in a stall. Hasn\'t forgotten.', 'Respiró contigo en una cabina. No lo olvidó.', 'Respirou com você numa cabine. Não esqueceu.');
      return T('Held on.', 'Aguantó.', 'Aguentou.');
    }
    return null;
  };

  /* ------------------------------------------------------------ the report */
  const M = [
    [100, 'consent_violation', T('You pushed past a "no" in the dark room. Dario walked you out. It is the one thing the building does not forgive quickly.', 'Empujaste pasando un «no» en el cuarto oscuro. Dario te sacó. Es lo único que el edificio no perdona rápido.', 'Você forçou depois de um «não» na dark room. O Dario te levou pra fora. É a única coisa que o prédio não perdoa rápido.')],
    [98, 'fight_broh', T('You and Broh got physical. It was short, stupid and loud. Sofi remembers.', 'Tú y Broh se agarraron. Fue corto, estúpido y ruidoso. Sofi lo recuerda.', 'Você e o Broh trocaram empurrões. Foi curto, burro e barulhento. A Sofi lembra.')],
    [96, 'passed_out', T('You woke up in the quiet room an hour and twenty minutes later. Somebody carried you.', 'Despertaste en la sala tranquila una hora y veinte después. Alguien te cargó.', 'Você acordou na sala de calma uma hora e vinte depois. Alguém te carregou.')],
    [95, 'tato_closure', T('Tato said goodbye to Mateo, and you were next to him for it.', 'Tato se despidió de Mateo, y tú estabas a su lado.', 'O Tato se despediu do Mateo, e você estava do lado dele.')],
    [94, 'juno_found_friends', T('You sat with Juno in the tunnel until her friends found her.', 'Te sentaste con Juno en el túnel hasta que sus amigos la encontraron.', 'Você sentou com a Juno no túnel até os amigos dela a encontrarem.')],
    [94, 'juno_quiet', T('You walked Juno to the quiet room and handed her to people who knew what to do.', 'Llevaste a Juno a la sala tranquila y se la entregaste a quien sabía qué hacer.', 'Você levou a Juno pra sala de calma e entregou pra quem sabia o que fazer.')],
    [94, 'juno_medic', T('You called the medics for Juno. It was the right call.', 'Llamaste a los médicos por Juno. Fue la decisión correcta.', 'Você chamou os médicos pra Juno. Foi a decisão certa.')],
    [92, 'juno_ignored', T('You told someone having a bad time to walk it off. You still think about it.', 'Le dijiste a alguien que la estaba pasando mal que lo caminara. Todavía lo piensas.', 'Você disse pra alguém passando mal pra caminhar que passa. Você ainda pensa nisso.')],
    [90, 'pill_binned', T('You put the pill in the bin. Dani held your hand while he did it.', 'Tiraste la pastilla al tacho. Dani te sostuvo la mano mientras lo hacía.', 'Você jogou o comprimido na lixeira. O Dani segurou sua mão enquanto fazia isso.')],
    [89, 'pill_faint', T('The pill was nothing like what you were sold. You ended up on a mattress in the quiet room.', 'La pastilla no era nada de lo que te vendieron. Terminaste en un colchón en la sala tranquila.', 'O comprimido não era nada do que te venderam. Você acabou num colchão na sala de calma.')],
    [88, 'pill_nothing', T('The pill was a very expensive mint. Nothing happened. Nothing kept happening.', 'La pastilla era una menta carísima. No pasó nada. Nada siguió pasando.', 'O comprimido era uma bala de menta caríssima. Nada aconteceu. Nada continuou acontecendo.')],
    [88, 'pill_glitch', T('The pill made the night arrive half a second late and slightly wrong.', 'La pastilla hizo que la noche llegara medio segundo tarde y un poco mal.', 'O comprimido fez a noite chegar meio segundo atrasada e um pouco errada.')],
    [87, function (s) { return s.flags.pill_taken && s.pill.type === 'pure'; }, T('You took a pill that was what Nuri said it was. The night felt kind.', 'Tomaste una pastilla que era lo que Nuri dijo. La noche se sintió amable.', 'Você tomou um comprimido que era o que a Nuri disse. A noite pareceu gentil.')],
    [87, function (s) { return s.flags.pill_taken && s.pill.type === 'mix'; }, T('You took something that was not what you were told. Your jaw had opinions. So did your heart.', 'Tomaste algo que no era lo que te dijeron. Tu mandíbula tuvo opiniones. Tu corazón también.', 'Você tomou algo que não era o que te disseram. Sua mandíbula teve opiniões. Seu coração também.')],
    [86, 'pill_skip_test', T('You took the pill without getting it checked. You learned what was in it the hard way.', 'Tomaste la pastilla sin hacerla chequear. Descubriste qué tenía por las malas.', 'Você tomou o comprimido sem mandar checar. Descobriu o que tinha do jeito difícil.')],
    [85, 'plan_test', T('You took a pill to the checking table before anybody swallowed anything.', 'Llevaste una pastilla a la mesa de chequeo antes de que nadie tragara nada.', 'Você levou um comprimido à mesa de checagem antes de alguém engolir qualquer coisa.')],
    [84, 'rosa_warm', T('Rosa asked nothing of you, then told you which door was hers. You asked how she was. Nobody asks.', 'Rosa no te pidió nada, luego te dijo cuál puerta era suya. Preguntaste cómo estaba. Nadie pregunta.', 'A Rosa não te pediu nada, depois disse qual porta era dela. Você perguntou como ela estava. Ninguém pergunta.')],
    [83, 'rosa_angry', T('Rosa called security on you. She was calm about it. That was the worst part.', 'Rosa llamó a seguridad por ti. Estuvo calma. Esa fue la peor parte.', 'A Rosa chamou a segurança pra você. Estava calma. Essa foi a pior parte.')],
    [82, 'rosa_ally', T('Rosa decided you were all right. A door that most people never see was left open for you.', 'Rosa decidió que estabas bien. Una puerta que casi nadie ve quedó abierta para ti.', 'A Rosa decidiu que você era gente boa. Uma porta que quase ninguém vê ficou aberta pra você.')],
    [80, 'rosa_cold', T('You lied to Rosa about how many of you were in the stall. She counted.', 'Le mentiste a Rosa sobre cuántos eran en la cabina. Ella contó.', 'Você mentiu pra Rosa sobre quantos estavam na cabine. Ela contou.')],
    [78, 'broh_hugged', T('You hugged a stranger named Broh until he cried. Sofi mouthed "thank you" over his shoulder.', 'Abrazaste a un desconocido llamado Broh hasta que lloró. Sofi dijo «gracias» sin voz por encima de su hombro.', 'Você abraçou um desconhecido chamado Broh até ele chorar. A Sofi disse «obrigada» sem voz por cima do ombro dele.')],
    [77, 'sofi_ally', T('Sofi got her forty minutes of air. She owes you a dance and knows it.', 'Sofi recuperó sus cuarenta minutos de aire. Te debe un baile y lo sabe.', 'A Sofi recuperou seus quarenta minutos de ar. Te deve uma dança e sabe disso.')],
    [76, 'broh_friend', T('Broh thinks you are a good bro. He is not wrong.', 'Broh cree que eres un buen bro. No se equivoca.', 'O Broh acha que você é um bom mano. Ele não tá errado.')],
    [76, 'shoved_broh', T('You shoved Broh. Everyone in that half of the room saw it.', 'Empujaste a Broh. Todos en esa mitad del cuarto lo vieron.', 'Você empurrou o Broh. Todo mundo nessa metade da sala viu.')],
    [74, 'tobi_people', T('You found Tobi\'s people and stayed until they arrived.', 'Encontraste a la gente de Tobi y te quedaste hasta que llegaron.', 'Você achou a galera do Tobi e ficou até eles chegarem.')],
    [74, 'tobi_water', T('You gave Tobi your water. He thanked you from very far away, then very near.', 'Le diste tu agua a Tobi. Te agradeció desde muy lejos, luego desde muy cerca.', 'Você deu sua água pro Tobi. Ele agradeceu de muito longe, depois de muito perto.')],
    [72, 'tristan_slap', T('You slapped Tristan\'s phone out of his hand. The crowd cheered, then stopped cheering.', 'Le sacaste el celular a Tristan de un golpe. El público aplaudió y luego dejó de aplaudir.', 'Você derrubou o celular do Tristan com um tapa. A plateia aplaudiu e depois parou.')],
    [70, 'tristan_done', T('You asked Tristan to put the camera down. He did.', 'Le pediste a Tristan que bajara la cámara. Lo hizo.', 'Você pediu pro Tristan abaixar a câmera. Ele abaixou.')],
    [68, 'trio_joined', T('The dark room was kind to you, and you were kind to it. Nobody left until everyone said they were good.', 'El cuarto oscuro fue amable contigo, y tú con él. Nadie se fue hasta que todos dijeron que estaban bien.', 'A dark room foi gentil com você, e você com ela. Ninguém saiu até todo mundo dizer que tava bem.')],
    [66, 'newbie_done', T('You walked a nervous first-timer to Dario and stayed until they were okay.', 'Acompañaste a un primerizo nervioso hasta Dario y te quedaste hasta que estuvo bien.', 'Você levou um primeira-viagem nervoso até o Dario e ficou até ele ficar bem.')],
    [64, 'graffiti_ask', T('There is a word of yours on the tunnel wall: ASK FIRST.', 'Hay una palabra tuya en la pared del túnel: PREGUNTA PRIMERO.', 'Tem uma palavra sua na parede do túnel: PERGUNTE PRIMEIRO.')],
    [64, 'graffiti_alone', T('There is a word of yours on the tunnel wall: NOBODY LEAVES ALONE.', 'Hay una palabra tuya en la pared del túnel: NADIE SE VA SOLO.', 'Tem uma palavra sua na parede do túnel: NINGUÉM VAI EMBORA SOZINHO.')],
    [64, 'graffiti_joke', T('There is a word of yours on the tunnel wall: I WAS HERE (ALLEGEDLY).', 'Hay una palabra tuya en la pared del túnel: ESTUVE AQUÍ (PRESUNTAMENTE).', 'Tem uma palavra sua na parede do túnel: ESTIVE AQUI (SUPOSTAMENTE).')],
    [62, 'resident_friend', T('The Resident played the last set with your people in mind.', 'La Resident tocó el último set pensando en tu gente.', 'A Resident tocou o último set pensando na sua galera.')],
    [60, 'sol_date', T('Sol asked you how your night ends. You came to the roof.', 'Sol te preguntó cómo termina tu noche. Viniste al techo.', 'A Sol te perguntou como sua noite termina. Você veio pro terraço.')],
    [58, 'stomp_win', T('The stomp circle opened for you without a word.', 'El círculo de pisadas se abrió para ti sin una palabra.', 'A roda de pisadas se abriu pra você sem uma palavra.')],
    [56, 'hugo_danced', T('Hugo taught you the shuffle. He will tell people for years.', 'Hugo te enseñó el shuffle. Se lo contará a la gente por años.', 'O Hugo te ensinou o shuffle. Vai contar pras pessoas por anos.')],
    [55, 'cult_member', T('For six minutes you were part of a thing with no name.', 'Durante seis minutos fuiste parte de algo sin nombre.', 'Por seis minutos você foi parte de algo sem nome.')],
    [54, 'sofa_wait', T('You waited ten minutes for a couple to finish kissing. They applauded your patience.', 'Esperaste diez minutos a que una pareja terminara de besarse. Aplaudieron tu paciencia.', 'Você esperou dez minutos um casal terminar de se beijar. Eles aplaudiram sua paciência.')],
    [54, 'sofa_invite', T('You asked a stranger "room for one more?" and someone in the tunnel never forgot it.', 'Le preguntaste a unos desconocidos «¿hay lugar para uno más?» y alguien en el túnel nunca lo olvidó.', 'Você perguntou pra desconhecidos «tem lugar pra mais um?» e alguém no túnel nunca esqueceu.')],
    [52, 'was_the_ice', T('You were the ice, together.', 'Fuiste el hielo, juntos.', 'Você foi o gelo, junto.')],
    [50, 'kiki_friend', T('You gave Kiki water in the queue. She adopted you on the spot.', 'Le diste agua a Kiki en la fila. Te adoptó en el acto.', 'Você deu água pra Kiki na fila. Ela te adotou na hora.')],
    [50, 'bruno_advised', T('You told a first-timer to ask before he touches anyone. He wrote it down.', 'Le dijiste a un primerizo que preguntara antes de tocar a alguien. Lo anotó.', 'Você disse pra um primeira-viagem perguntar antes de tocar em alguém. Ele anotou.')],
    [48, 'tourists_helped', T('Two German tourists found the toilets because of you. There was chocolate.', 'Dos turistas alemanes encontraron los baños gracias a ti. Hubo chocolate.', 'Dois turistas alemães acharam os banheiros por sua causa. Teve chocolate.')],
    [46, 'dante_talked', T('A philosopher by a fire barrel told you the building started as damage nobody fixed.', 'Un filósofo junto a un barril de fuego te dijo que el edificio empezó como un daño que nadie arregló.', 'Um filósofo ao lado de um barril de fogo te disse que o prédio começou como um dano que ninguém consertou.')],
    [44, 'pet_cat', T('You petted the cat. It was the best conversation you had all night.', 'Acariciaste al gato. Fue la mejor conversación de toda la noche.', 'Você fez carinho no gato. Foi a melhor conversa da noite.')],
    [42, 'filmed', T('You are a story on an account with four hundred followers.', 'Eres una historia en una cuenta con cuatrocientos seguidores.', 'Você é um story numa conta com quatrocentos seguidores.')]
  ];
  story.moments = function (s) {
    const out = [];
    M.slice().sort(function (a, b) { return b[0] - a[0]; }).forEach(function (m) {
      const test = m[1];
      const ok = typeof test === 'function' ? test(s) : !!s.flags[test];
      if (ok && out.length < 10) out.push(m[2]);
    });
    if (!out.length) out.push(T('A quiet night. A very quiet night.', 'Una noche tranquila. Muy tranquila.', 'Uma noite tranquila. Muito tranquila.'));
    return out;
  };
})();

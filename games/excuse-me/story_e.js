/* EXCUSE ME — story E: Sala 2, backstage, the roof, and the machinery of consequences
   (pass-outs, vomiting, last warnings, leaving, the final sunrise). */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  function B(f, n) { const o = {}; o[f] = n; return o; }

  /* ============================================================ ENTER HOOKS */
  S.enter_main = function () {
    const s = EM.state;
    if (!s.flags.main_first) {
      s.flags.main_first = true;
      U.toast({ icon: 'note', text: T('THE MAIN FLOOR. In a dense crowd, press Z to say EXCUSE ME and the crowd parts. Glowing marks on the floor are places to dance.', 'LA PISTA PRINCIPAL. En una multitud densa, presiona Z para decir CON PERMISO y la gente se abre. Las marcas brillantes del piso son lugares para bailar.', 'A PISTA PRINCIPAL. Numa multidão densa, aperte Z para dizer COM LICENÇA e a galera abre. As marcas brilhantes no chão são lugares pra dançar.'), kind: 'info', ms: 7000 });
    }
  };
  S.enter_courtyard = function () {
    const s = EM.state;
    if (!s.flags.court_first) {
      s.flags.court_first = true;
      U.toast({ icon: 'zzz', text: T('The smoking area. Cold air, quiet corners. Benches recharge your SOCIAL BATTERY.', 'La zona de fumar. Aire frío, rincones tranquilos. Los bancos recargan tu BATERÍA SOCIAL.', 'A área de fumantes. Ar frio, cantos tranquilos. Os bancos recarregam sua BATERIA SOCIAL.'), kind: 'info', ms: 5500 });
    }
  };
  S.enter_attic = function () {
    const s = EM.state;
    if (!s.flags.attic_first) {
      s.flags.attic_first = true;
      U.toast({ icon: 'skull', text: T('SALA 2. Harder, darker, stranger. The crowd is denser up here.', 'SALA 2. Más dura, más oscura, más rara. La multitud es más densa aquí arriba.', 'SALA 2. Mais dura, mais escura, mais estranha. A multidão é mais densa aqui em cima.'), kind: 'info', ms: 5000 });
    }
  };
  S.enter_backstage = function () {
    const s = EM.state;
    if (!s.flags.backstage_first) {
      s.flags.backstage_first = true;
      U.toast({ icon: 'door', text: T('Backstage. Quiet, lit, full of cables. Staff only; do not touch anything.', 'Backstage. Silencio, luz, cables por todas partes. Solo personal; no toques nada.', 'Backstage. Silêncio, luz, cabos pra todo lado. Só staff; não toque em nada.'), kind: 'info', ms: 5000 });
    }
  };
  S.enter_rooftop = function () {
    const s = EM.state;
    if (!s.flags.roof_first) {
      s.flags.roof_first = true;
      /* away friends with good bonds find their own way up */
      ['dani', 'tato'].forEach(function (f) {
        if (s.away[f] && (s.bond[f] || 0) >= 2) { L.join(f); U.toast({ icon: 'heart', text: T(EM.CAST[f].name + ' found their own way up. Of course they did.', EM.CAST[f].name + ' encontró su propio camino hasta aquí. Claro que sí.', EM.CAST[f].name + ' achou o próprio caminho até aqui. Claro que achou.'), kind: 'good', ms: 5000 }); }
      });
      if (s.quests.q8 === 'active' && s.party.indexOf('dani') !== -1 && s.party.indexOf('tato') !== -1) L.apply({ quest: { q8: 'done' } });
      if (!s.quests.q9) L.setQuest('q9', 'active');
      s.flags.roof_open = true;
    }
  };

  /* ============================================================ SALA 2 */
  D.hazel = {
    who: 'hazel', role: T('PURIST', 'PURISTA', 'PURISTA'), start: 'a', nodes: {
      a: {
        text: T('"This is the real room. Downstairs is for people who like melody." Hazel says \'melody\' the way other people say \'mould\'. Her arms are crossed; her foot is exactly on the beat.', '«Esta es la sala de verdad. Abajo es para gente que quiere melodía». Hazel dice «melodía» como otros dicen «moho». Tiene los brazos cruzados; el pie exactamente al ritmo.', '«Essa é a sala de verdade. Lá embaixo é pra quem gosta de melodia». A Hazel diz «melodia» do jeito que outros dizem «mofo». Os braços cruzados; o pé exatamente no tempo.'),
        choices: [
          { tone: 'ask', t: T('"What\'s wrong with melody?"', '«¿Qué tiene de malo la melodía?»', '«O que tem de errado com melodia?»'), next: 'b' },
          { tone: 'joke', t: T('"I like melody. I hum in the shower. Fight me."', '«Me gusta la melodía. Tarareo en la ducha. Peléame».', '«Eu gosto de melodia. Cantarolo no banho. Vem».'), do: { fun: 3, soc: -1 }, next: null, react: T('She almost smiles. "Fine. Hum quietly."', 'Casi sonríe. «Bueno. Tararea bajito».', 'Ela quase sorri. «Tá. Cantarole baixinho».') },
          { tone: 'chill', t: T('"Respect for the purity."', '«Respeto por la pureza».', '«Respeito pela pureza».'), do: { soc: 2 }, next: null }
        ]
      },
      b: {
        text: T('"Melody is a promise. This music doesn\'t promise anything. It just continues." She uncrosses one arm. "The Resident — the closing DJ, upstairs — they\'re the only one who understands that. They\'ll open the roof at half past five. They like people who bring water. Don\'t tell anyone I said that."', '«La melodía es una promesa. Esta música no promete nada. Solo continúa». Descruza un brazo. «La Resident — la DJ del cierre, arriba — es la única que entiende eso. Abrirá el techo a las cinco y media. Le caen bien las personas que traen agua. No le digas a nadie que te lo dije».', '«Melodia é uma promessa. Essa música não promete nada. Só continua». Ela descruza um braço. «A Resident — a DJ do encerramento, lá em cima — é a única que entende isso. Vai abrir o terraço às cinco e meia. Ela gosta de gente que traz água. Não conta pra ninguém que eu disse».'),
        do: { flag: ['hazel_tip', 'resident_water_tip'], fun: 2 }
      }
    }
  };

  D.cult = {
    who: 'stomp3', role: T('THE FLOW', 'EL FLUJO', 'O FLUXO'), start: 'a', nodes: {
      a: {
        text: T('Five people in a loose, swaying ring in the middle of Sala 2 are dancing with their eyes closed and their palms open. A rhythm moves through them like a rumour. The ring opens a little. One of them nods without opening his eyes.', 'Cinco personas en un anillo suelto y oscilante en el centro de la Sala 2 bailan con los ojos cerrados y las palmas abiertas. Un ritmo pasa entre ellos como un rumor. El anillo se abre un poco. Uno asiente sin abrir los ojos.', 'Cinco pessoas num anel solto e oscilante no meio da Sala 2 dançam de olhos fechados e palmas abertas. Um ritmo passa entre elas feito boato. O anel se abre um pouco. Uma delas assente sem abrir os olhos.'),
        choices: [
          { tone: 'dance', t: T('Step into the ring. Follow the flow.', 'Entrar al anillo. Seguir el flujo.', 'Entrar no anel. Seguir o fluxo.'), call: 'cult_dance', next: null, free: true },
          { tone: 'chill', t: T('Watch for a minute.', 'Mirar un minuto.', 'Olhar por um minuto.'), do: { fun: 1, time: 2 }, next: null }
        ]
      }
    }
  };
  S.cult_dance = function () {
    U.danceGate({ seq: 'UULRDD', attempts: 2 }, function (res) {
      if (res === 'win') { L.apply({ fun: 16, soc: 2, flag: 'cult_member' }); U.toast({ icon: 'star', text: T('The ring takes you in. Nobody says a word. For six minutes you are part of a thing with no name.', 'El anillo te recibe. Nadie dice nada. Durante seis minutos eres parte de algo sin nombre.', 'O anel te recebe. Ninguém diz nada. Por seis minutos você é parte de algo sem nome.'), kind: 'good' }); }
      else if (res === 'partial') { L.apply({ fun: 7 }); U.toast({ text: T('You sway for a few minutes before the ring gently closes. Fine.', 'Te meces unos minutos antes de que el anillo se cierre con suavidad. Está bien.', 'Você balança por alguns minutos antes de o anel fechar com delicadeza. Tá bom.'), kind: 'info' }); }
      else { L.apply({ weird: 3, fun: 0, soc: -2 }); U.toast({ text: T('You lose the thread and the ring dances you out, kindly and completely.', 'Pierdes el hilo y el anillo te baila hacia afuera, con amabilidad y por completo.', 'Você perde o fio e o anel te dança pra fora, com gentileza e por completo.'), kind: 'bad' }); }
    });
  };

  D.oz = {
    who: 'oz', role: T('PERFORMANCE', 'PERFORMANCE', 'PERFORMANCE'), start: 'a', nodes: {
      a: {
        text: T('Oz is standing completely still, holding a large block of ice in both bare hands, wearing a face of grave importance. A small crowd has gathered. Nobody knows why. "I am the ice," Oz announces. "You can be the ice also."', 'Oz está de pie completamente quieto, sosteniendo un gran bloque de hielo con las dos manos desnudas, con una cara de grave importancia. Se juntó un pequeño público. Nadie sabe por qué. «Yo soy el hielo», anuncia Oz. «Tú también puedes ser el hielo».', 'O Oz está de pé completamente parado, segurando um grande bloco de gelo com as duas mãos nuas, com uma cara de grave importância. Uma pequena plateia se juntou. Ninguém sabe por quê. «Eu sou o gelo», anuncia o Oz. «Você também pode ser o gelo».'),
        choices: [
          { tone: 'joke', t: T('"Hello, ice."', '«Hola, hielo».', '«Oi, gelo».'), do: { fun: 4, soc: 1 }, next: null, react: T('"…Hello," says the ice, in a small voice. The crowd lets out a little breath.', '«…Hola», dice el hielo, con voz chiquita. El público suelta un suspiro pequeño.', '«…Oi», diz o gelo, com voz miúda. A plateia solta um suspiro pequeno.') },
          { tone: 'care', t: T('Hold one end of the ice with them. Be the ice together.', 'Sostener un extremo del hielo con él. Ser el hielo juntos.', 'Segurar uma ponta do gelo com ele. Ser o gelo juntos.'), do: { fun: 6, hp: -1, soc: 3, time: 8, flag: 'was_the_ice' }, next: null, react: T('Your hands get so cold they stop being hands. The crowd applauds in silence. Oz whispers, "Thank you for melting with me."', 'Tus manos se enfrían tanto que dejan de ser manos. El público aplaude en silencio. Oz susurra: «Gracias por derretirte conmigo».', 'Suas mãos esfriam tanto que deixam de ser mãos. A plateia aplaude em silêncio. O Oz sussurra: «Obrigado por derreter comigo».') },
          { tone: 'silent', t: T('Back away slowly.', 'Retroceder lentamente.', 'Recuar devagar.'), free: true, next: null }
        ]
      }
    }
  };

  /* ============================================================ BACKSTAGE */
  S.beatriz_catch = function () { U.startDialogue('beatriz_catch', { npc: 'beatriz' }); };
  D.beatriz_catch = {
    who: 'beatriz', role: T('MANAGER', 'GERENTE', 'GERENTE'), forced: true, start: 'a', nodes: {
      a: {
        text: T('A woman with a clipboard and the stillness of a person who has never lost an argument at a door looks up. "Staff only."', 'Una mujer con una carpeta y la quietud de alguien que nunca perdió una discusión en una puerta levanta la vista. «Solo personal».', 'Uma mulher com uma prancheta e a quietude de quem nunca perdeu uma discussão numa porta levanta o olhar. «Só staff».'),
        choices: [
          { tone: 'honest', t: T('"I got turned around looking for somewhere quiet."', '«Me desorienté buscando un lugar tranquilo».', '«Me perdi procurando um lugar quieto».'), do: { soc: -1 }, next: null, react: T('"Quiet is left of the foyer. The room with the mattresses. Go." Not unkind. Final.', '«Lo tranquilo está a la izquierda del foyer. El cuarto de los colchones. Ve». No es antipática. Es definitiva.', '«O quieto é à esquerda do foyer. A sala dos colchões. Vai». Não é antipática. É definitiva.') },
          { tone: 'smooth', t: T('"Hugo sent me. He said you\'d understand."', '«Hugo me mandó. Dijo que entenderías».', '«O Hugo me mandou. Disse que você entenderia».'), req: { flag: 'hugo_friend' }, do: { soc: -1, flag: 'backstage_access' }, next: null, react: T('Her eyebrow drops a centimetre. "Hugo." A sigh. "Fine. Ten minutes. Touch nothing."', 'Su ceja baja un centímetro. «Hugo». Un suspiro. «Bien. Diez minutos. No toques nada».', 'A sobrancelha dela desce um centímetro. «Hugo». Um suspiro. «Tá. Dez minutos. Não toque em nada».') },
          { tone: 'blunt', t: T('"I\'m going in."', '«Voy a entrar».', '«Eu vou entrar».'), do: { weird: 15, soc: -4 }, next: null, bad: true, react: T('She does not raise her voice. She presses a button on her radio. Somebody very large starts walking.', 'No levanta la voz. Aprieta un botón de su radio. Alguien muy grande empieza a caminar.', 'Ela não levanta a voz. Aperta um botão do rádio. Alguém muito grande começa a andar.') }
        ]
      }
    }
  };
  D.beatriz = {
    who: 'beatriz', role: T('MANAGER', 'GERENTE', 'GERENTE'), start: 'a', nodes: {
      a: {
        text: T('"You\'re the one Rosa vouched for. That is a rare sentence." Beatriz does not smile, but her clipboard lowers. "Touch nothing. If anyone asks, you came about a leak."', '«Eres a quien Rosa avaló. Esa es una frase rara». Beatriz no sonríe, pero su carpeta baja. «No toques nada. Si alguien pregunta, viniste por una fuga».', '«Você é quem a Rosa avalizou. Essa é uma frase rara». A Beatriz não sorri, mas a prancheta dela abaixa. «Não toque em nada. Se alguém perguntar, você veio por causa de um vazamento».'),
        choices: [
          { tone: 'chill', t: T('"Understood. Thank you for letting me through."', '«Entendido. Gracias por dejarme pasar».', '«Entendido. Valeu por me deixar passar».'), do: { soc: 2 }, next: null },
          { tone: 'ask', t: T('"Is the roof really opening at half past five?"', '«¿De verdad abre el techo a las cinco y media?»', '«O terraço realmente abre às cinco e meia?»'), next: 'roof' }
        ]
      },
      roof: {
        text: T('"The Resident decides. If you want to be up there, be someone the Resident likes. I can\'t help you with that. Nobody can."', '«Lo decide la Resident. Si quieres estar ahí arriba, sé alguien que le guste a la Resident. No puedo ayudarte con eso. Nadie puede».', '«Quem decide é a Resident. Se quiser estar lá em cima, seja alguém de quem a Resident goste. Não posso te ajudar com isso. Ninguém pode».'),
        do: { flag: 'beatriz_roof' }
      }
    }
  };

  D.resident = {
    who: 'resident', role: T('THE RESIDENT', 'LA RESIDENT', 'A RESIDENT'), start: 'a', nodes: {
      a: {
        text: T('"Don\'t look at me like that. I\'m hydrating." The Resident is sitting on a flight case with a thermos of tea, headphones around the neck, shoes off. They have the posture of someone who has been awake for twenty hours and is calm about it. "You\'re not staff. You\'re not press. You\'re lost, or you\'re lucky."', '«No me mires así. Estoy hidratándome». La Resident está sentada sobre un flight case con un termo de té, auriculares al cuello, sin zapatos. Tiene la postura de alguien que lleva veinte horas despierta y está tranquila con eso. «No eres staff. No eres prensa. Te perdiste, o tuviste suerte».', '«Não me olha assim. Eu tô me hidratando». A Resident tá sentada num flight case com uma garrafa térmica de chá, fones no pescoço, sem sapatos. Tem a postura de quem tá acordada há vinte horas e tá tranquila com isso. «Você não é staff. Não é imprensa. Você se perdeu, ou teve sorte».'),
        choices: [
          { tone: 'care', t: T('Offer your water. "You\'ve been working all night."', 'Ofrecer tu agua. «Llevas toda la noche trabajando».', 'Oferecer sua água. «Você tá trabalhando a noite toda».'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, soc: 3, flag: 'resident_friend' }, next: 'friend' },
          { tone: 'ask', t: T('"What are you going to play at the end?"', '«¿Qué vas a tocar al final?»', '«O que você vai tocar no final?»'), next: 'play' },
          { tone: 'chill', t: T('"Sorry. Just passing through. Good luck tonight."', '«Perdón. Solo paso. Suerte esta noche».', '«Desculpa. Só passando. Boa sorte hoje».'), do: { soc: 2 }, next: null }
        ]
      },
      play: {
        text: T('"I never decide until I look at the room." They look at you for a moment. "Tell me what you need from the last hour. I won\'t promise anything, but I listen."', '«Nunca decido hasta que miro la sala». Te mira un momento. «Dime qué necesitas de la última hora. No prometo nada, pero escucho».', '«Eu nunca decido até olhar a sala». Elas te olham por um momento. «Me diz o que você precisa da última hora. Não prometo nada, mas escuto».'),
        choices: [
          { tone: 'chill', t: T('"Something warm. For a room that has been through a lot."', '«Algo cálido. Para una sala que pasó por mucho».', '«Algo quente. Pra uma sala que passou por muita coisa».'), do: { flag: 'closing_warm' }, next: 'noted' },
          { tone: 'bold', t: T('"Something wild. Let\'s end loud."', '«Algo salvaje. Terminemos fuerte».', '«Algo selvagem. Vamos terminar alto».'), do: { flag: 'closing_wild' }, next: 'noted' },
          { tone: 'silent', t: T('"Something soft. People are tired."', '«Algo suave. La gente está cansada».', '«Algo suave. As pessoas estão cansadas».'), do: { flag: 'closing_soft' }, next: 'noted' }
        ]
      },
      friend: {
        text: T('They drink half the bottle and look at you with new interest. "Nobody brings the DJ water. People bring the DJ shots. I\'m going to open the roof at half past five. If you bring your people, I\'ll play something for them." They take a slow breath. "What do they need from the last hour?"', 'Se toma la mitad de la botella y te mira con interés nuevo. «Nadie le trae agua a la DJ. Le traen shots. Voy a abrir el techo a las cinco y media. Si traes a tu gente, tocaré algo para ellos». Respira lento. «¿Qué necesitan de la última hora?»', 'Elas bebem metade da garrafa e te olham com interesse novo. «Ninguém traz água pra DJ. Trazem shots. Eu vou abrir o terraço às cinco e meia. Se você trouxer sua galera, toco algo pra eles». Respiram devagar. «O que eles precisam da última hora?»'),
        choices: [
          { tone: 'chill', t: T('"Something warm."', '«Algo cálido».', '«Algo quente».'), do: { flag: ['closing_warm', 'roof_promise'] }, next: 'noted' },
          { tone: 'bold', t: T('"Something wild."', '«Algo salvaje».', '«Algo selvagem».'), do: { flag: ['closing_wild', 'roof_promise'] }, next: 'noted' },
          { tone: 'silent', t: T('"Something soft."', '«Algo suave».', '«Algo suave».'), do: { flag: ['closing_soft', 'roof_promise'] }, next: 'noted' }
        ]
      },
      noted: {
        text: T('"Noted." The Resident closes their eyes for a second, like someone filing a thing away in the most careful drawer. "Go find your people. See you at sunrise."', '«Anotado». La Resident cierra los ojos un segundo, como quien archiva algo en el cajón más cuidadoso. «Ve a buscar a tu gente. Nos vemos al amanecer».', '«Anotado». A Resident fecha os olhos por um segundo, como quem guarda algo na gaveta mais cuidadosa. «Vai buscar sua galera. A gente se vê no amanhecer».'),
        do: { flag: 'resident_met', fun: 3, soc: 3 }
      }
    }
  };

  /* ============================================================ CONSEQUENCES */
  S.passout = function (ctx) {
    const s = EM.state;
    s.fx = {}; s.drinks = 0; s.thirst = 0; s.pendingFaint = 0;
    s.stats.hp = 38; s.stats.fun = Math.max(0, s.stats.fun - 15);
    L.stat('weird', 8); L.stat('soc', 10);
    s.flags.passed_out = true;
    const fake = ctx && ctx.opts && ctx.opts.fake;
    s.passoutFake = !!fake;
    U.mode = 'play';
    EM.hooks.travel({ zone: 'welfare', x: 5, y: 9, dir: 'd' });
    setTimeout(function () { L.addTime(80); if (!s.ended) U.startDialogue('passout_wake', { npc: 'teo' }); }, 700);
  };
  D.passout_wake = {
    who: 'teo', role: T('MEDIC', 'PARAMÉDICO', 'PARAMÉDICO'), forced: true, start: 'a', nodes: {
      a: {
        text: [
          T('Ceiling. A warm blanket you did not choose. The bass is far and polite. A man with a cuff and tired kind eyes: "Hey. Welcome back. You were out for about an hour and twenty. Your pulse has been fine the whole time. Somebody carried you."', 'Techo. Una manta tibia que no elegiste. El bajo está lejos y es educado. Un hombre con tensiómetro y ojos amables y cansados: «Hola. Qué bueno que volviste. Estuviste fuera una hora y veinte. Tu pulso estuvo bien todo el tiempo. Alguien te cargó».', 'Teto. Um cobertor morno que você não escolheu. O grave está longe e educado. Um homem com aparelho de pressão e olhos gentis e cansados: «Oi. Que bom que você voltou. Você ficou fora uma hora e vinte. Seu pulso esteve bem o tempo todo. Alguém te carregou».'),
          T('You have missed the best part of the night, and the rest of the night is still waiting. A paper cup of water appears in your hand. You are still here. That is the first thing.', 'Te perdiste lo mejor de la noche, y el resto de la noche todavía te espera. Un vasito de agua aparece en tu mano. Todavía estás aquí. Eso es lo primero.', 'Você perdeu a melhor parte da noite, e o resto da noite ainda te espera. Um copinho d\'água aparece na sua mão. Você ainda está aqui. Isso é a primeira coisa.')
        ],
        choices: [
          { tone: 'honest', t: T('"Thank you. I\'m okay. I think I\'m okay."', '«Gracias. Estoy bien. Creo que estoy bien».', '«Valeu. Tô bem. Acho que tô bem».'), do: { soc: 4, water: true }, next: 'b' },
          { tone: 'ask', t: T('"What time is it? Where are my friends?"', '«¿Qué hora es? ¿Dónde están mis amigos?»', '«Que horas são? Cadê meus amigos?»'), next: 'b' }
        ]
      },
      b: {
        text: T('"Around the corner, doing what friends do: pacing. They\'ll be thrilled. Sit for ten more minutes. And if you go out again — pace yourself. Second time, the ambulance isn\'t a figure of speech."', '«Ahí a la vuelta, haciendo lo que hacen los amigos: dar vueltas. Se van a alegrar. Siéntate diez minutos más. Y si vuelves a salir — dosifícate. La segunda vez, la ambulancia no es una figura retórica».', '«Ali na esquina, fazendo o que amigos fazem: andando de um lado pro outro. Vão ficar felizes. Sente mais dez minutos. E se sair de novo — se dosa. Na segunda vez, a ambulância não é figura de linguagem».'),
        do: { hp: 4, soc: 3, time: 10 }
      }
    }
  };

  S.vomit = function () {
    L.apply({ hp: -8, weird: 12, fun: -8, soc: -4 });
    U.toast({ icon: 'sweat', text: T('The drinks have a vote and it goes badly. You discreetly give a houseplant more than it expected.', 'Los tragos votan y sale mal. Le das a una planta más de lo que esperaba.', 'As bebidas votam e dá errado. Você dá a uma planta mais do que ela esperava.'), kind: 'bad', ms: 5500 });
  };

  S.last_warning = function () { U.startDialogue('last_warning', { npc: 'ofelia' }); };
  D.last_warning = {
    who: 'ofelia', role: T('SECURITY', 'SEGURIDAD', 'SEGURANÇA'), forced: true, start: 'a', nodes: {
      a: {
        text: T('Ofelia is suddenly there, not threatening, just present in the way weather is present. "This is a conversation, not a threat. One more thing and I walk you to the door. I don\'t want to. I will."', 'Ofelia aparece de golpe, sin amenaza, presente como está presente el clima. «Esto es una conversación, no una amenaza. Una cosa más y te acompaño a la puerta. No quiero hacerlo. Lo haré».', 'A Ofelia aparece de repente, sem ameaça, presente do jeito que o clima é presente. «Isso é uma conversa, não uma ameaça. Mais uma coisa e eu te levo até a porta. Não quero. Vou».'),
        choices: [
          { tone: 'honest', t: T('"I\'m overwhelmed. I\'m going to sit down and drink some water."', '«{Estoy abrumado|Estoy abrumada|Todo me abruma}. Voy a sentarme y tomar agua».', '«{Tô sobrecarregado|Tô sobrecarregada|Tá tudo demais pra mim}. Vou sentar e beber água».'), do: { weird: -25, soc: 2, hp: 4, time: 20 }, next: null, react: T('Her whole posture changes. "Good. That\'s the right answer. Go to the quiet room. I\'ll tell the others to let you be."', 'Cambia toda su postura. «Bien. Esa es la respuesta correcta. Ve a la sala tranquila. Les digo a los demás que te dejen en paz».', 'A postura inteira dela muda. «Bom. Essa é a resposta certa. Vai pra sala de calma. Aviso os outros pra te deixarem em paz».'), call: 'go_quiet' },
          { tone: 'sorry', t: T('"I\'m sorry. I\'ll behave."', '«Perdón. Me voy a portar bien».', '«Desculpa. Vou me comportar».'), do: { weird: -15, soc: -2 }, next: null },
          { tone: 'blunt', t: T('"I\'m not doing anything wrong."', '«No estoy haciendo nada malo».', '«Eu não tô fazendo nada de errado».'), do: { weird: 8, soc: -4 }, next: null, bad: true, react: T('"Then you won\'t mind slowing down." She is not smiling.', '«Entonces no te molestará bajar el ritmo». No sonríe.', '«Então você não vai se importar de desacelerar». Ela não sorri.') }
        ]
      }
    }
  };
  S.go_quiet = function () { EM.hooks.travel({ zone: 'welfare', x: 19, y: 7, dir: 'l' }); };

  S.leave_venue = function () { U.startDialogue('leave_venue', {}); };
  D.leave_venue = {
    forced: true, start: 'a', nodes: {
      a: {
        text: T('The street gate. Cold air, a taxi light, the first grey at the edge of the sky. Once you walk through, the night is over.', 'La puerta a la calle. Aire frío, una luz de taxi, el primer gris en el borde del cielo. Una vez que cruces, la noche termina.', 'O portão da rua. Ar frio, uma luz de táxi, o primeiro cinza na beirada do céu. Quando você atravessar, a noite acaba.'),
        choices: [
          { tone: 'go', t: T('Leave. Go home.', 'Irte. Volver a casa.', 'Sair. Ir pra casa.'), do: { end: 'left_early' }, next: null },
          { tone: 'stay', t: T('Stay. The night isn\'t done.', 'Quedarte. La noche no terminó.', 'Ficar. A noite não acabou.'), next: null, call: 'step_back_in' }
        ]
      }
    }
  };
  S.step_back_in = function () { EM.hooks.travel({ zone: 'courtyard', x: 37, y: 12, dir: 'l' }); };

  /* ============================================================ THE FINAL SUNRISE */
  S.sunrise = function () { U.startDialogue('sunrise', {}); };
  D.sunrise = {
    forced: true, after: 'final_ending', start: 'a', nodes: {
      a: {
        text: [
          T('The roof. A hundred people, then three hundred, then a long breath. The last set begins quietly. There is a line of pale light along the edge of the city, and the air tastes like the first morning of something.', 'El techo. Cien personas, luego trescientas, luego una respiración larga. El último set empieza bajito. Hay una línea de luz pálida en el borde de la ciudad, y el aire sabe a la primera mañana de algo.', 'O terraço. Cem pessoas, depois trezentas, depois uma respiração longa. O último set começa baixinho. Há uma linha de luz pálida na beirada da cidade, e o ar tem gosto da primeira manhã de alguma coisa.')
        ],
        next: 'mood'
      },
      mood: {
        branch: [
          { req: { flag: 'closing_wild' }, to: 'wild' },
          { req: { flag: 'closing_soft' }, to: 'soft' },
          { req: function () { return true; }, to: 'warm' }
        ]
      },
      warm: {
        text: T('The Resident plays something warm: a long chord, then a second chord, then a kick so far away it sounds like somebody else\'s heartbeat. People start to sway before they know it. Somebody puts a head on someone\'s shoulder. Somebody hands a stranger a half-sandwich. The light rises like a held note.', 'La Resident toca algo cálido: un acorde largo, luego otro, luego un bombo tan lejano que suena como el latido de alguien más. La gente empieza a mecerse antes de saberlo. Alguien apoya la cabeza en el hombro de otro. Alguien le pasa a un desconocido medio sándwich. La luz sube como una nota sostenida.', 'A Resident toca algo quente: um acorde longo, depois outro, depois um bumbo tão distante que parece o coração de outra pessoa. As pessoas começam a balançar antes de perceber. Alguém apoia a cabeça no ombro de outro. Alguém passa meio sanduíche pra um desconhecido. A luz sobe feito uma nota sustentada.'),
        next: 'mine'
      },
      wild: {
        text: T('The Resident plays something wild: the kick comes in like a door kicked open, and four hundred people who have not slept shout at the sky. The dancing is ugly and joyful and total. Somebody is on somebody\'s shoulders, again. A stranger is crying and laughing at the same time. The sun comes up behind the speakers like it has been called.', 'La Resident toca algo salvaje: el bombo entra como una puerta pateada y cuatrocientas personas que no durmieron le gritan al cielo. El baile es feo, alegre y total. Alguien va sobre los hombros de alguien, otra vez. Un desconocido llora y ríe a la vez. El sol sale detrás de los parlantes como si lo hubieran llamado.', 'A Resident toca algo selvagem: o bumbo entra feito uma porta chutada e quatrocentas pessoas que não dormiram gritam pro céu. A dança é feia, alegre e total. Alguém tá nos ombros de alguém, de novo. Um desconhecido chora e ri ao mesmo tempo. O sol nasce atrás das caixas como se tivesse sido chamado.'),
        next: 'mine'
      },
      soft: {
        text: T('The Resident plays something soft: a pad, a long melody, almost no drums. It is the kind of music you can only dance to by moving about a millimetre. The roof is a field of slow people. Somebody lies down on the concrete and looks at the sky. Somebody else lies down next to them. The sun arrives on tiptoe.', 'La Resident toca algo suave: un pad, una melodía larga, casi sin batería. Es la clase de música con la que solo se baila moviéndose un milímetro. El techo es un campo de gente lenta. Alguien se acuesta en el concreto y mira el cielo. Otro se acuesta a su lado. El sol llega en puntas de pie.', 'A Resident toca algo suave: um pad, uma melodia longa, quase sem bateria. É o tipo de música que só dá pra dançar movendo um milímetro. O terraço é um campo de gente lenta. Alguém deita no concreto e olha o céu. Outro deita do lado. O sol chega na ponta dos pés.')
        ,
        next: 'mine'
      },
      mine: {
        branch: [
          { req: { with: 'maru', flag: 'tato_closure' }, to: 'tato' },
          { req: function (s) { return s.party.length === 3; }, to: 'allthree' },
          { req: function (s) { return s.party.length >= 1; }, to: 'some' },
          { req: function () { return true; }, to: 'alone' }
        ]
      },
      tato: {
        text: T('Tato is standing at the rail beside you with his face turned up, lit from underneath by the new light. "I said what I needed to say. I thought it would hurt more." He leans against your shoulder. "Thank you for being the kind of person who asks."', 'Tato está de pie junto a la baranda a tu lado con la cara hacia arriba, iluminada por debajo con la luz nueva. «Dije lo que necesitaba decir. Pensé que dolería más». Se apoya en tu hombro. «Gracias por ser el tipo de persona que pregunta».', 'O Tato tá de pé no parapeito ao seu lado com o rosto virado pra cima, iluminado por baixo pela luz nova. «Falei o que eu precisava falar. Achei que doeria mais». Ele encosta no seu ombro. «Obrigado por ser o tipo de pessoa que pergunta».'),
        next: 'allthree'
      },
      allthree: {
        text: T('Maru is on your left, Dani on your right, Tato in front, one hand on the rail. Nobody says anything for a very long time. At some point, Dani whispers "I love everyone," and for once nobody laughs, because it is true.', 'Maru está a tu izquierda, Dani a tu derecha, Tato adelante, una mano en la baranda. Nadie dice nada por mucho tiempo. En algún momento, Dani susurra «amo a todos», y por una vez nadie se ríe, porque es verdad.', 'A Maru tá à sua esquerda, o Dani à direita, o Tato na frente, uma mão no parapeito. Ninguém diz nada por muito tempo. Em algum momento, o Dani sussurra «amo todo mundo», e pela primeira vez ninguém ri, porque é verdade.'),
        do: { flag: 'sunrise_all', fun: 10, soc: 6 },
        next: 'end'
      },
      some: {
        text: T('The people who are with you stand close. There are empty places at your elbows, shaped like your missing friends. You hold the space for them a while. It is a different kind of beautiful.', 'Las personas que están contigo se paran cerca. Hay lugares vacíos en tus codos, con la forma de tus amigos que faltan. Guardas el espacio para ellos un rato. Es otra clase de belleza.', 'As pessoas que estão com você ficam por perto. Há lugares vazios nos seus cotovelos, com o formato dos amigos que faltam. Você guarda o espaço pra eles por um tempo. É outro tipo de beleza.'),
        do: { flag: 'sunrise_some', fun: 4, soc: 2 },
        next: 'end'
      },
      alone: {
        text: T('You are alone at the rail, and the roof is full of strangers who are all leaning in the same direction. You were never really alone, though. The sun comes up on everybody equally. That is the one thing it does.', 'Te quedas a solas en la baranda, y el techo está lleno de desconocidos que se inclinan hacia el mismo lado. Aunque nunca estuviste de verdad sin compañía. El sol sale para todos por igual. Es lo único que hace.', 'Fica só você no parapeito, e o terraço está cheio de desconhecidos que se inclinam pro mesmo lado. Mas você nunca esteve de fato sem companhia. O sol nasce pra todo mundo igual. É a única coisa que ele faz.'),
        do: { flag: 'sunrise_alone', fun: 1 },
        next: 'end'
      },
      end: {
        text: T('When the first full edge of the sun clears the skyline, the whole roof applauds. Not for the DJ. For the morning. For having been here.', 'Cuando el primer borde completo del sol supera el horizonte, todo el techo aplaude. No por la DJ. Por la mañana. Por haber estado ahí.', 'Quando a primeira borda inteira do sol passa do horizonte, o terraço inteiro aplaude. Não pra DJ. Pra manhã. Por ter estado ali.'),
        do: { quest: { q9: 'done' } }
      }
    }
  };

  S.final_ending = function () {
    const s = EM.state, st = s.stats, f = s.flags;
    const all3 = s.party.length === 3;
    let id;
    if (all3 && st.hp >= 45 && st.soc >= 35 && st.fun >= 60 && st.weird <= 45 && (s.care || 0) >= 3) id = 'legend';
    else if (st.hp < 30 || st.weird > 70 || s.fx.comedown2) id = 'wrecked';
    else if (f.sol_date) id = 'romance';
    else if (all3) id = 'together';
    else id = 'missing';
    setTimeout(function () { L.end(id); }, 300);
  };
})();

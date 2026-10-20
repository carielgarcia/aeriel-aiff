/* EXCUSE ME — story v9: errands that send you across the building and tie the storylines together.
   ROSA's list (the key, the bucket, the unwell one) -> staff corridor -> Cleo's napkin and the headlamp's gel.
   The lost phone -> Luca -> the key. Kai's battery <- Bruce or Mina. Sia's three words <- Ruth, a voice in the dark, Gus.
   Isi's snack run <- the vending machine and Ines. Every errand pays out in something another one needs. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const NF = EM.NF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`"Later."`, `«Después».`, `«Depois».`), { free: true, next: null }); };
  const mk = function (s, f) { return s.flags[f] ? '[X]' : '[ ]'; };
  function cast(id, name, o) { EM.CAST[id] = { name: name, look: Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 3, bottom: 1, bc: 1, acc: 0, wide: false }, o) }; }

  /* ============================================================ THE QUEST LOG */
  const Q = EM.QUESTS;
  Q.sq_rosa = { title: t(`ROSA'S LIST`, `LA LISTA DE ROSA`, `A LISTA DA ROSA`), desc: function (s) {
    return t(`Rosa cannot leave her stalls, so be her legs. ${mk(s, 'rosa_e1')} Somebody on the main floor looked green: find them. ${mk(s, 'rosa_e2')} The closet key: Luca at the coat check keeps lost property. ${mk(s, 'rosa_e3')} A bucket of clean water from the quiet room station. ${s.flags.rosa_probation ? 'One will do.' : 'Any two will do.'} Then tell Rosa.`, `Rosa no puede dejar sus cabinas, así que sé sus piernas. ${mk(s, 'rosa_e1')} Alguien en la pista se veía verde: encuéntralo. ${mk(s, 'rosa_e2')} La llave del clóset: Luca, en el guardarropa, guarda los objetos perdidos. ${mk(s, 'rosa_e3')} Un balde de agua limpia de la estación de la sala tranquila. ${s.flags.rosa_probation ? 'Con una basta.' : 'Con dos basta.'} Luego avísale a Rosa.`, `A Rosa não pode sair das cabines, então seja as pernas dela. ${mk(s, 'rosa_e1')} Alguém na pista parecia verde: ache a pessoa. ${mk(s, 'rosa_e2')} A chave do armário: o Luca, na chapelaria, guarda os achados e perdidos. ${mk(s, 'rosa_e3')} Um balde de água limpa da estação da sala de calma. ${s.flags.rosa_probation ? 'Uma já basta.' : 'Duas bastam.'} Depois avise a Rosa.`);
  }, doneText: t(`Rosa has a lanyard for you. The staff corridor is open. People in uniforms look through you now, which is exactly the favour.`, `Rosa tiene una credencial para ti. El pasillo de staff está abierto. La gente de uniforme ahora te mira sin verte, que es exactamente el favor.`, `A Rosa tem um crachá pra você. O corredor do staff está aberto. Gente de uniforme agora olha através de você, que é exatamente o favor.`) };
  Q.sq_biscuit = { title: t(`BISCUIT'S PHONE`, `EL CELULAR DE BISCUIT`, `O CELULAR DO BISCUIT`), desc: t(`You found a phone in the courtyard with a dog in a raincoat on the lock screen. Luca at the foyer coat check handles lost property.`, `Encontraste un celular en el patio con un perro de impermeable en la pantalla. Luca, en el guardarropa del foyer, se ocupa de los objetos perdidos.`, `Você achou um celular no pátio com um cachorro de capa de chuva na tela. O Luca, na chapelaria do foyer, cuida dos achados e perdidos.`), doneText: t(`Returned. Luca has a ring of keys he now owes you a favour on.`, `Devuelto. Luca tiene un llavero y ahora te debe un favor.`, `Devolvido. O Luca tem um molho de chaves e agora te deve um favor.`) };
  Q.sq_kai = { title: t(`KAI'S BATTERY`, `LA PILA DE KAI`, `A PILHA DO KAI`), desc: function (s) {
    return t(`Kai's keyboard is dying and needs a 9-volt. ${mk(s, 'battery')} Bruce the guard keeps a spare in the walkie bag, and Mina the sound apprentice always has one in her bag. Bring it to Kai on the sidewalk.`, `El teclado de Kai se muere y necesita una pila de 9 voltios. ${mk(s, 'battery')} Bruce, el guardia, guarda una de repuesto en la bolsa del walkie, y Mina, la aprendiz de sonido, siempre tiene una en el bolso. Llévasela a Kai a la vereda.`, `O teclado do Kai está morrendo e precisa de uma pilha de 9 volts. ${mk(s, 'battery')} O Bruce, o segurança, guarda uma reserva na bolsa do walkie, e a Mina, a aprendiz de som, sempre tem uma na bolsa. Leve pro Kai na calçada.`);
  } };
  Q.sq_lamp = { title: t(`THE HEADLAMP`, `LA LINTERNA`, `A LANTERNA`), desc: function (s) {
    return t(`Dani is in love with the lighting tech. ${mk(s, 'lamp_met')} Find them in Sala 2 (the attic). ${mk(s, 'lamp_gel')} They need a rose-pink gel from the drawer backstage. ${mk(s, 'lamp_done')} Bring it back.`, `Dani está enamorado del técnico de luces. ${mk(s, 'lamp_met')} Búscalo en la Sala 2 (el ático). ${mk(s, 'lamp_gel')} Necesita un gel rosa de un cajón del backstage. ${mk(s, 'lamp_done')} Llévaselo.`, `O Dani está apaixonado pelo técnico de luz. ${mk(s, 'lamp_met')} Procure a pessoa na Sala 2 (o sótão). ${mk(s, 'lamp_gel')} Ela precisa de um gel rosa da gaveta do backstage. ${mk(s, 'lamp_done')} Leve de volta.`);
  } };
  Q.sq_sia = { title: t(`SIA'S LAST LINE`, `LA ÚLTIMA LÍNEA DE SIA`, `A ÚLTIMA LINHA DA SIA`), desc: function (s) {
    return t(`Sia is stuck on the last line of a poem and needs three words from three people tonight. ${mk(s, 'word_warm')} A warm one (the quiet room). ${mk(s, 'word_brave')} A brave one (somewhere in the dark). ${mk(s, 'word_silly')} A silly one (the main floor).`, `Sia está trabada en la última línea de un poema y necesita tres palabras de tres personas esta noche. ${mk(s, 'word_warm')} Una cálida (la sala tranquila). ${mk(s, 'word_brave')} Una valiente (en algún lugar de la oscuridad). ${mk(s, 'word_silly')} Una tonta (la pista principal).`, `A Sia travou na última linha de um poema e precisa de três palavras de três pessoas esta noite. ${mk(s, 'word_warm')} Uma quente (a sala de calma). ${mk(s, 'word_brave')} Uma corajosa (em algum lugar no escuro). ${mk(s, 'word_silly')} Uma boba (a pista principal).`);
  } };
  Q.sq_isi = { title: t(`ISI'S SNACK RUN`, `LA COMIDA DE ISI`, `O LANCHE DA ISI`), desc: function (s) {
    return t(`The volunteers in the quiet room have not eaten since the afternoon. ${mk(s, 'have_sandwich')} The cheese triangle from the foyer machine. ${mk(s, 'have_prawn')} Or prawn crackers (technically seafood) from Ines at the bar. Either will do; both is a feast.`, `Los voluntarios de la sala tranquila no comen desde la tarde. ${mk(s, 'have_sandwich')} El sándwich triangular de la máquina del foyer. ${mk(s, 'have_prawn')} O galletas de camarón (técnicamente mariscos) de Inés, en la barra. Cualquiera sirve; las dos es un banquete.`, `Os voluntários da sala de calma não comem desde a tarde. ${mk(s, 'have_sandwich')} O sanduíche triangular da máquina do foyer. ${mk(s, 'have_prawn')} Ou biscoito de camarão (tecnicamente frutos do mar) da Ines no bar. Qualquer um serve; os dois é um banquete.`);
  } };
  Q.sq_napkin = { title: t(`THE NAPKIN`, `LA SERVILLETA`, `O GUARDANAPO`), desc: t(`Cleo's napkin is for ÆRIEL, who is backstage. The staff door on the main floor opens for people Rosa vouches for, or for ÆRIEL's friends.`, `La servilleta de Cleo es para ÆRIEL, que está en el backstage. La puerta de staff de la pista se abre para quienes Rosa avala, o para amigos de ÆRIEL.`, `O guardanapo da Cleo é pra ÆRIEL, que está no backstage. A porta do staff na pista abre pra quem a Rosa avaliza, ou pra amigos da ÆRIEL.`), doneText: t(`Delivered. ÆRIEL read it twice.`, `Entregada. ÆRIEL la leyó dos veces.`, `Entregue. ÆRIEL leu duas vezes.`) };

  /* ============================================================ ROSA, TIGHTENED */
  cast('tavi', 'TAVI', { skin: 0, hair: 2, hc: 3, expr: 5, top: 1, tc: 11, bottom: 1, bc: 0, acc: 0 });
  D.rosa_again = {
    who: 'rosa', role: t('CLEANING', 'LIMPIEZA', 'LIMPEZA'), start: 'a', nodes: {
      a: {
        branch: [
          { req: function (s) { return s.quests.sq_rosa === 'done'; }, to: 'after' },
          { req: function (s) { return s.quests.sq_rosa === 'active'; }, to: 'status' },
          { req: function (s) { return !!(s.flags.rosa_ally || s.flags.rosa_ok || s.flags.rosa_warm); }, to: 'offer' },
          { req: function (s) { return !!s.flags.rosa_cold; }, to: 'cold' },
          { req: function (s) { return !!s.flags.rosa_angry; }, to: 'angry' },
          { req: function () { return true; }, to: 'plain' }
        ]
      },
      plain: { text: t(`"Mind the wet floor."`, `«Cuidado con el piso mojado».`, `«Cuidado com o piso molhado».`) },
      angry: { text: t(`Rosa does not look at you. She says only: "Floor's wet." (Look after somebody tonight. She hears about it.)`, `Rosa no te mira. Dice solo: «Piso mojado». (Cuida a alguien esta noche. Ella se entera.)`, `A Rosa não te olha. Diz só: «Piso molhado». (Cuide de alguém esta noite. Ela fica sabendo.)`), do: { soc: -1 } },
      cold: {
        text: t(`"You lied to me about who was in that stall. I don't forget. But I don't hold a thing forever either." She leans on the mop. "One chance. Somebody out on the main floor looked green an hour ago. Find them. Be a person to them. Then come and tell me."`, `«Me mentiste sobre quién estaba en esa cabina. No olvido. Pero tampoco guardo rencor para siempre». Se apoya en el trapeador. «Una oportunidad. Alguien en la pista se veía verde hace una hora. Encuéntralo. Sé una persona para él. Luego ven y me cuentas».`, `«Você mentiu pra mim sobre quem estava naquela cabine. Eu não esqueço. Mas também não guardo rancor pra sempre». Ela se apoia no esfregão. «Uma chance. Alguém na pista parecia verde faz uma hora. Ache a pessoa. Seja gente com ela. Depois volta e me conta».`),
        choices: [
          K('honest', t(`"I'll find them. And I'm sorry I lied."`, `«Lo busco. Y perdón por mentir».`, `«Eu procuro. E desculpa por ter mentido».`), { do: { soc: 1, flag: ['rosa_task', 'rosa_probation'], quest: { sq_rosa: 'active' } }, next: null }),
          LEAVE()
        ]
      },
      offer: {
        text: t(`Rosa wrings the mop, looks around the room as if counting enemies, and speaks like a general giving orders to a favourite private. "Three things go wrong on a night like this, and I cannot leave my stalls. Be my legs. One: somebody on the main floor looked green to me an hour ago; find them. Two: the closet key; Luca at the coat check keeps lost property and I think my ring is in there. Three: clean water in a bucket, from the quiet room station. Any two, and I make it worth your while."`, `Rosa escurre el trapeador, mira el cuarto como contando enemigos y habla como un general dando órdenes a su soldado favorito. «Tres cosas salen mal en una noche así, y yo no puedo dejar mis cabinas. Sé mis piernas. Una: alguien en la pista se veía verde hace una hora; encuéntralo. Dos: la llave del clóset; Luca, en el guardarropa, guarda los objetos perdidos y creo que mi llavero está ahí. Tres: agua limpia en un balde, de la estación de la sala tranquila. Con dos, y hago que valga la pena».`, `A Rosa torce o esfregão, olha a sala como contando inimigos e fala como uma general dando ordens à soldada favorita. «Três coisas dão errado numa noite assim, e eu não posso sair das minhas cabines. Seja minhas pernas. Uma: alguém na pista parecia verde faz uma hora; ache a pessoa. Duas: a chave do armário; o Luca, na chapelaria, guarda os achados e perdidos e acho que meu chaveiro está lá. Três: água limpa num balde, da estação da sala de calma. Duas dessas, e eu faço valer a pena».`),
        choices: [
          K('chill', t(`"On it. Verde, key, bucket."`, `«Voy. Verde, llave, balde».`, `«Tô nessa. Verde, chave, balde».`), { do: { flag: 'rosa_task', soc: 1, quest: { sq_rosa: 'active' } }, next: null, react: t(`"Go. Walk, don't run. Running spills." She goes back to the mop. You go.`, `«Ve. Camina, no corras. Correr derrama». Vuelve al trapeador. Te vas.`, `«Vai. Anda, não corre. Correr derrama». Ela volta pro esfregão. Você vai.`) }),
          K('ask', t(`"What do I get?"`, `«¿Qué me toca?»`, `«O que eu ganho?»`), { next: 'reward_hint' }),
          LEAVE()
        ]
      },
      reward_hint: {
        text: t(`"A lanyard. The staff corridor, open to you. Guards in the front rooms look through anyone wearing it, and the corridor behind the stage is the only quiet one in the building. People who need to reach the DJ find it very useful." She looks at you. "Or you could do it because it's decent. Either."`, `«Una credencial. El pasillo de staff, abierto para ti. Los guardias de las salas del frente miran a través de quien la lleva, y el pasillo tras el escenario es el único tranquilo del edificio. Quien necesita llegar al DJ la encuentra muy útil». Te mira. «O podrías hacerlo porque es lo decente. Cualquiera de las dos».`, `«Um crachá. O corredor do staff, aberto pra você. Os seguranças das salas da frente olham através de quem usa, e o corredor atrás do palco é o único calmo do prédio. Quem precisa chegar na DJ acha muito útil». Ela te olha. «Ou você podia fazer porque é decente. Qualquer um dos dois».`),
        next: 'offer'
      },
      status: {
        text: function (s) {
          const need = s.flags.rosa_probation ? 1 : 2;
          return t(`"Well?" Rosa keeps mopping and lists on her fingers. ${mk(s, 'rr1')} the green one. ${mk(s, 'rr2')} the key. ${mk(s, 'rr3')} the bucket. "I need ${need}."`, `«¿Y?» Rosa sigue trapeando y cuenta con los dedos. ${mk(s, 'rr1')} el verde. ${mk(s, 'rr2')} la llave. ${mk(s, 'rr3')} el balde. «Necesito ${need}».`, `«E aí?» A Rosa continua esfregando e conta nos dedos. ${mk(s, 'rr1')} a verde. ${mk(s, 'rr2')} a chave. ${mk(s, 'rr3')} o balde. «Preciso de ${need}».`);
        },
        choices: [
          K('chill', t(`"Report in."`, `«Dar parte».`, `«Dar o relatório».`), { req: function (s) { return (s.flags.rosa_e1 && !s.flags.rr1) || (s.flags.rosa_e2 && !s.flags.rr2) || (s.flags.rosa_e3 && !s.flags.rr3); }, call: 'rosa_report', next: null, free: true }),
          K('chill', t(`"Still working on it."`, `«Sigo en eso».`, `«Ainda estou nessa».`), { free: true, next: null })
        ]
      },
      after: {
        text: function (s) {
          return s.flags.rosa_best
            ? t(`Rosa tilts the thermos at you with respect. "The best legs I've had in twenty years. Wear the lanyard like you were born in it. Coffee?"`, `Rosa inclina el termo hacia ti con respeto. «Las mejores piernas que tuve en veinte años. Lleva la credencial como si hubieras nacido con ella. ¿Café?»`, `A Rosa inclina a garrafa térmica pra você com respeito. «As melhores pernas que tive em vinte anos. Use o crachá como se tivesse nascido com ele. Café?»`)
            : t(`Rosa nods at the lanyard. "Good. It suits you. Coffee?"`, `Rosa asiente hacia la credencial. «Bien. Te queda bien. ¿Café?»`, `A Rosa assente pro crachá. «Bom. Combina com você. Café?»`);
        },
        choices: [
          K('care', t(`"Coffee, thank you."`, `«Café, gracias».`, `«Café, {obrigado|obrigada|valeu}».`), { req: { no: 'rosa_coffee' }, do: { hp: 8, soc: 6, flag: 'rosa_coffee' }, next: null, react: t(`It is boiling and bitter and the best thing that has happened to your hands all night. "Come back when you're tired," says Rosa. "Everybody does."`, `Está hirviendo, amargo y es lo mejor que le pasó a tus manos en toda la noche. «Vuelve cuando estés cansado», dice Rosa. «Todos vuelven».`, `Está fervendo, amargo e é a melhor coisa que aconteceu com suas mãos a noite toda. «Volta quando estiver cansado», diz a Rosa. «Todo mundo volta».`) }),
          K('chill', t(`"Take care, Rosa."`, `«Cuídate, Rosa».`, `«Se cuida, Rosa».`), { do: { soc: 2 }, next: null })
        ]
      }
    }
  };
  /* the unwell one on the main floor */
  D.tavi = {
    who: 'tavi', role: t('SOMEONE LOOKING GREEN', 'ALGUIEN QUE SE VE VERDE', 'ALGUÉM COM CARA DE VERDE'), start: 'a', nodes: {
      a: {
        text: t(`Tavi is leaning on the partition with both hands flat on it, like a person holding up a wall that is holding up them. "I'm fine. I'm really fine. It's just that the floor is a boat."`, `Tavi está apoyado en el tabique con las dos manos planas, como quien sostiene una pared que lo sostiene. «Estoy bien. De verdad. Es que el piso es un barco».`, `O Tavi está encostado na divisória com as duas mãos espalmadas, como quem segura uma parede que o segura. «Eu tô bem. Tô bem de verdade. É que o chão é um barco».`),
        choices: [
          K('care', t(`"Let's get you to the quiet room. I'll walk you."`, `«Vamos a la sala tranquila. Te acompaño».`, `«Vamos pra sala de calma. Eu te acompanho».`), { do: { care: 1, time: 10, soc: -2, hp: -1, flag: ['rosa_e1', 'tavi_helped'], bond: {} }, call: 'tavi_walk', next: null, free: true }),
          K('care', t(`Offer your water. "Small sips."`, `Ofrecerle tu agua. «Sorbos chicos».`, `Oferecer sua água. «Goles pequenos».`), { req: { item: 'water' }, do: { item: { water: -1 }, care: 1, flag: ['rosa_e1', 'tavi_helped'] }, next: null, react: t(`Tavi sips, nods, and the colour comes back into them a shade at a time, like a dimmer being turned. "Thanks. I'll sit. I'll… sit."`, `Tavi toma, asiente y el color le vuelve de a poco, como un regulador de luz. «Gracias. Me siento. Me… siento».`, `O Tavi bebe, assente e a cor volta aos poucos, como um dimmer sendo girado. «Valeu. Eu sento. Eu… sento».`) }),
          K('chill', t(`"You'll be fine. Walk it off."`, `«Vas a estar bien. Camínalo».`, `«Vai ficar bem. Anda um pouco».`), { do: { soc: -1, flag: 'tavi_ignored', rep: 0.6 }, bad: true, next: null, react: t(`Tavi nods, politely, and slides down the wall until they are sitting on the floor with their head between their knees. Three people step around them. You did not do it. You did not help.`, `Tavi asiente, cortés, y se desliza por la pared hasta quedar sentado en el piso con la cabeza entre las rodillas. Tres personas lo esquivan. Tú no lo hiciste. No ayudaste.`, `O Tavi assente, educado, e escorrega pela parede até ficar sentado no chão com a cabeça entre os joelhos. Três pessoas desviam. Você não fez isso. Você também não ajudou.`) }),
          LEAVE()
        ]
      }
    }
  };
  S.tavi_walk = function () {
    EM.hooks.travel({ zone: 'welfare', x: 6, y: 7, dir: 'd' });
    setTimeout(function () {
      U.toast({ icon: 'cross', text: t(`Teo takes the weight off your shoulder with one practised movement and a pulse cuff. "I've got them. Thank you for walking." A mattress, a paper cup, a blanket nobody asked for. Tavi gives you a very small thumbs-up from under the blanket.`, `Teo te quita el peso del hombro con un solo movimiento practicado y un tensiómetro. «Los tengo. Gracias por acompañarlos». Un colchón, un vasito, una manta que nadie pidió. Tavi te hace un pulgar arriba muy chiquito desde debajo de la manta.`, `O Teo tira o peso do seu ombro com um único movimento treinado e um aparelho de pressão. «Eu cuido. Obrigado por acompanhar». Um colchão, um copinho, um cobertor que ninguém pediu. O Tavi faz um joinha bem pequeno de debaixo do cobertor.`), kind: 'good', ms: 6500 });
    }, 900);
  };
  Z.main.npc({ id: 'tavi', x: 31.5, y: 28.5, dlg: 'tavi', dir: 'u', reach: 16, when: function (s) { return !!s.flags.rosa_task && !s.flags.rosa_e1 && !s.flags.tavi_ignored; } });

  /* the key: Luca (and Biscuit's phone) */
  D.luca.nodes.keys = {
    branch: [{ req: function (s) { return !!(s.flags.closet_key); }, to: 'keys_have' }, { req: function (s) { return !!s.flags.phone_returned; }, to: 'keys_ok' }, { req: function () { return true; }, to: 'keys_fav' }]
  };
  D.luca.nodes.keys_have = { text: t(`"You already have it. It's in your hand. You're holding it like a bird."`, `«Ya la tienes. Está en tu mano. La sostienes como a un pájaro».`, `«Você já tem. Tá na sua mão. Você segura como se fosse um passarinho».`) };
  D.luca.nodes.keys_ok = {
    text: t(`Luca does a double take. "You're the one who brought in Biscuit's phone. Biscuit's mum has been telling the whole foyer. Lost property is yours: take anything. …Rosa's ring? Yes. Third hook. Don't tell her it was on a hook labelled 'DREAD'."`, `Luca pestañea dos veces. «Tú eres quien trajo el celular de Biscuit. La mamá de Biscuit se lo ha contado a todo el foyer. Los objetos perdidos son tuyos: llévate lo que quieras. …¿El llavero de Rosa? Sí. Tercer gancho. No le cuentes que estaba en un gancho que decía “ANGUSTIA”».`, `O Luca dá uma segunda olhada. «Foi você que trouxe o celular do Biscuit. A mãe do Biscuit tá contando pro foyer inteiro. Os achados e perdidos são seus: leve o que quiser. …O chaveiro da Rosa? Sim. Terceiro gancho. Não conta pra ela que tava num gancho com a etiqueta “ANGÚSTIA”».`),
    do: { flag: ['closet_key', 'rosa_e2'], soc: 3, fun: 2 }
  };
  D.luca.nodes.keys_fav = {
    text: t(`Luca folds his arms. "Lost property is sacred. I don't hand a ring of keys to a stranger. But I do take payment in time." He gestures at the stool. "Sit. Let me describe my dread. Four minutes. It has chapters."`, `Luca cruza los brazos. «Los objetos perdidos son sagrados. No le doy un llavero a un desconocido. Pero cobro en tiempo». Señala el taburete. «Siéntate. Déjame describirte mi angustia. Cuatro minutos. Tiene capítulos».`, `O Luca cruza os braços. «Achados e perdidos são sagrados. Não entrego um chaveiro pra um estranho. Mas aceito pagamento em tempo». Ele aponta o banquinho. «Senta. Deixa eu descrever minha angústia. Quatro minutos. Tem capítulos».`),
    choices: [
      K('care', t(`Sit. Listen to all four chapters.`, `Sentarte. Escuchar los cuatro capítulos.`, `Sentar. Ouvir os quatro capítulos.`), { do: { time: 12, soc: -6, care: 1, flag: ['closet_key', 'rosa_e2'] }, next: null, react: t(`Chapter one: the coats. Chapter two: the coats' feelings. Chapter three: the ocean, somehow. Chapter four is one sentence, and it is "I am glad somebody sat". He gives you the key.`, `Capítulo uno: los abrigos. Capítulo dos: los sentimientos de los abrigos. Capítulo tres: el océano, de algún modo. El capítulo cuatro es una frase, y dice «me alegra que alguien se sentara». Te da la llave.`, `Capítulo um: os casacos. Capítulo dois: os sentimentos dos casacos. Capítulo três: o oceano, de algum jeito. O capítulo quatro é uma frase, e diz «fico feliz que alguém tenha sentado». Ele te dá a chave.`) }),
      K('chill', t(`"Another time."`, `«Otra vez».`, `«Outra hora».`), { free: true, next: null })
    ]
  };
  D.luca.nodes.a.choices.push(K('ask', t(`"Rosa's closet key. Is it in lost property?"`, `«La llave del clóset de Rosa. ¿Está en objetos perdidos?»`, `«A chave do armário da Rosa. Tá nos achados e perdidos?»`), { req: { flag: 'rosa_task', no: 'rosa_e2' }, next: 'keys' }));
  /* the phone: now a short walk, courtyard to foyer */
  D.obj_phone.nodes.a.choices[0] = K('care', t(`Pick it up. Somebody is missing this. Take it to Luca.`, `Recogerlo. A alguien le falta esto. Llevárselo a Luca.`, `Pegar. Alguém tá sentindo falta disso. Levar pro Luca.`), { do: { flag: 'phone_held', quest: { sq_biscuit: 'active' } }, next: null, react: t(`You pocket it. It buzzes against your hip like something that wants to be found. Luca, at the foyer coat check, keeps lost property.`, `Te lo guardas. Vibra contra tu cadera como algo que quiere ser encontrado. Luca, en el guardarropa del foyer, guarda los objetos perdidos.`, `Você guarda no bolso. Ele vibra contra o seu quadril como algo que quer ser achado. O Luca, na chapelaria do foyer, guarda os achados e perdidos.`) });
  D.obj_phone.nodes.a.choices[1].do = { weird: 6, soc: -2, flag: ['phone_snooped', 'phone_held'], quest: { sq_biscuit: 'active' } };
  D.obj_phone.nodes.a.choices[2].t = t(`Put it back exactly where it was.`, `Dejarlo exactamente donde estaba.`, `Colocar de volta exatamente onde estava.`);
  const phoneObj = Z.foyer.ents.find(function (e) { return e.id === 'lostphone'; });
  if (phoneObj) Z.foyer.ents.splice(Z.foyer.ents.indexOf(phoneObj), 1);
  Z.courtyard.obj({ id: 'lostphone', kind: 'phone', x: 4, y: 9, w: 1, h: 1, label: t('A PHONE ON THE BENCH', 'UN CELULAR EN EL BANCO', 'UM CELULAR NO BANCO'), when: function (s) { return !s.flags.phone_done && !s.flags.phone_held; } });
  D.luca.nodes.phone = {
    text: function (s) {
      return s.flags.phone_snooped
        ? t(`Luca takes the phone, turns it over, and looks at you for one second longer than is comfortable. "…It's warm. Somebody has been in this." He types a pin in four tries and calls MUM. "Hi. Yes. Your Biscuit's phone — no, your phone."`, `Luca toma el celular, lo da vuelta y te mira un segundo más de lo cómodo. «…Está tibio. Alguien estuvo metido en esto». Prueba un pin en cuatro intentos y llama a MAMÁ. «Hola. Sí. El celular de tu Biscuit — no, tu celular».`, `O Luca pega o celular, vira e te olha um segundo mais do que é confortável. «…Está morno. Alguém mexeu nisso». Ele tenta um PIN em quatro tentativas e liga pra MÃE. «Oi. Sim. O celular do seu Biscuit — não, o seu celular».`)
        : t(`Luca takes the phone with both hands, reverent, like a lost bird. He types a pin in four tries and calls the number saved as MUM. "Hi. Yes. Your Biscuit's phone — no, your phone. Hello? She's sobbing. She says thank you. She says Biscuit says thank you."`, `Luca toma el celular con las dos manos, reverente, como a un pájaro perdido. Prueba un pin en cuatro intentos y llama al número guardado como MAMÁ. «Hola. Sí. El celular de tu Biscuit — no, tu celular. ¿Hola? Está llorando. Dice gracias. Dice que Biscuit dice gracias».`, `O Luca pega o celular com as duas mãos, reverente, como um passarinho perdido. Ele tenta um PIN em quatro tentativas e liga pro número salvo como MÃE. «Oi. Sim. O celular do seu Biscuit — não, o seu celular. Alô? Ela tá soluçando. Ela diz obrigada. Diz que o Biscuit diz obrigado».`);
    },
    do: { care: 1, soc: 2, flag: ['phone_returned', 'phone_done'], unflag: 'phone_held', quest: { sq_biscuit: 'done' } }
  };
  D.luca.nodes.a.choices.push(K('care', t(`Hand over the phone with the dog in a raincoat.`, `Entregar el celular del perro con impermeable.`, `Entregar o celular do cachorro de capa de chuva.`), { req: { flag: 'phone_held' }, next: 'phone' }));

  /* the bucket */
  EM.DIALOGUES.obj_water.nodes.a.choices.splice(2, 0, K('care', t(`Fill a bucket for Rosa.`, `Llenar un balde para Rosa.`, `Encher um balde pra Rosa.`), { req: function (s) { return s.zone === 'welfare' && !!s.flags.rosa_task && !s.flags.rosa_e3; }, do: { time: 4, flag: ['rosa_bucket', 'rosa_e3'], soc: 1 }, free: true, next: null, react: t(`The bucket is heavy and honest. You carry it like a person carrying a very slow, very clean pet. People step aside. Everyone knows what a bucket is for.`, `El balde es pesado y honesto. Lo cargas como quien lleva una mascota muy lenta y muy limpia. La gente se hace a un lado. Todos saben para qué sirve un balde.`, `O balde é pesado e honesto. Você carrega como quem leva um bichinho muito lento e muito limpo. As pessoas abrem espaço. Todo mundo sabe pra que serve um balde.`) }));

  S.rosa_report = function () {
    const s = EM.state; const f = s.flags;
    let n = 0;
    [1, 2, 3].forEach(function (i) { if (f['rosa_e' + i] && !f['rr' + i]) { f['rr' + i] = true; n++; } });
    const total = [1, 2, 3].filter(function (i) { return f['rr' + i]; }).length;
    const need = f.rosa_probation ? 1 : 2;
    U.toast({ icon: 'cross', text: t(`Rosa ticks you off on her fingers, nods once per item. "Mm. Mm. Good."`, `Rosa te va tachando con los dedos, asiente una vez por cada cosa. «Mm. Mm. Bien».`, `A Rosa vai riscando nos dedos, assente uma vez por item. «Hm. Hm. Bom».`), kind: 'info' });
    if (total >= need && s.quests.sq_rosa !== 'done') {
      L.setQuest('sq_rosa', 'done');
      L.apply({ flag: ['rosa_lanyard', 'backstage_access', 'rosa_ally', 'rosa_ok', 'quiet_known'], unflag: ['rosa_cold', 'rosa_angry'], fun: 4, soc: 6 });
      if (total === 3) { f.rosa_best = true; L.apply({ fun: 3, item: { water: 1 } }); }
      U.toast({ icon: 'star', text: f.rosa_probation
        ? t(`"Okay. We're square." Rosa hands you the lanyard without ceremony. "Stay out of my stalls with more than one person, and we'll never speak about it again." The staff corridor is open.`, `«Bueno. Estamos a mano». Rosa te da la credencial sin ceremonia. «No entres a mis cabinas con más de una persona y jamás volveremos a hablar de esto». El pasillo de staff está abierto.`, `«Tá. Estamos quites». A Rosa te dá o crachá sem cerimônia. «Não entre nas minhas cabines com mais de uma pessoa e nunca mais falamos disso». O corredor do staff está aberto.`)
        : t(`Rosa unhooks a lanyard from her belt and puts it over your head, like a medal. "STAFF. Don't tell them I did it. The door beside the sinks is yours. The guards in the front rooms won't see you any more. Say hi to the DJ."`, `Rosa descuelga una credencial de su cinturón y te la pone por la cabeza, como una medalla. «STAFF. No les digas que lo hice yo. La puerta junto a los lavamanos es tuya. Los guardias de las salas del frente ya no te van a ver. Saluda al DJ».`, `A Rosa desprende um crachá do cinto e coloca na sua cabeça, como uma medalha. «STAFF. Não conta que fui eu. A porta ao lado das pias é sua. Os seguranças das salas da frente não vão mais te ver. Dá um oi pra DJ».`), kind: 'good', ms: 7500 });
    }
  };
  /* Rosa forgives, slowly, if you keep looking after people */
  const minute0 = L.minute;
  L.minute = function () {
    minute0();
    const s = EM.state; if (!s || s.ended) return;
    if (s.flags.rosa_angry && !s.flags.rosa_thawed && (s.care || 0) >= 3 && s.time >= (((s.flagAt || {}).rosa_angry) || 0) + 90) {
      s.flags.rosa_thawed = true; s.flags.rosa_cold = true; delete s.flags.rosa_angry;
      U.toast({ icon: 'heart', text: t(`Rosa catches your eye across the foyer and, very barely, nods. Word of the people you've looked after has reached her. She would like a word. (She will talk to you again.)`, `Rosa te mira desde el otro lado del foyer y, apenas, asiente. Le llegó la noticia de la gente que cuidaste. Quiere decirte algo. (Va a volver a hablarte.)`, `A Rosa cruza o seu olhar do outro lado do foyer e, bem de leve, assente. A notícia das pessoas de quem você cuidou chegou até ela. Ela quer trocar uma palavra. (Ela vai voltar a falar com você.)`), kind: 'good', ms: 7000 });
    }
  };
  /* what the lanyard does */
  /* (L.guarded and L.dealerHeat read s.flags.rosa_lanyard / isi_wristband) */

  /* ============================================================ CLEO'S NAPKIN NOW HAS A ROUTE */
  D.cleo.nodes.ask.choices[0].do = Object.assign({}, D.cleo.nodes.ask.choices[0].do, { quest: { sq_napkin: 'active' } });
  D.cleo.nodes.ask.choices[0].react = t(`She presses a folded napkin into your palm like a state secret. "Backstage. The staff door on the main floor. Rosa, the cleaning lady, can get you in if she likes you. Or anyone who's friends with ÆRIEL."`, `Te pone una servilleta doblada en la palma como un secreto de estado. «Backstage. La puerta de staff de la pista. Rosa, la de limpieza, puede meterte si le caes bien. O quien sea amigo de ÆRIEL».`, `Ela coloca um guardanapo dobrado na sua palma como um segredo de Estado. «Backstage. A porta do staff na pista. A Rosa, da limpeza, pode te colocar lá dentro se gostar de você. Ou qualquer amigo da ÆRIEL».`);
  D.resident.nodes.note.do = Object.assign({}, D.resident.nodes.note.do, { quest: { sq_napkin: 'done' } });

  /* ============================================================ KAI'S BATTERY (Bruce or Mina) */
  D.kai.nodes.a.choices.splice(1, 0,
    K('ask', t(`"Is something wrong with the keyboard?"`, `«¿Le pasa algo al teclado?»`, `«Tem algo errado com o teclado?»`), { req: { no: 'kai_battery' }, next: 'battery' }),
    K('care', t(`Hand over a 9-volt battery.`, `Entregar una pila de 9 voltios.`, `Entregar uma pilha de 9 volts.`), { req: { flag: 'battery' }, next: 'battery_done' })
  );
  D.kai.nodes.battery = {
    text: t(`Kai turns the lunchbox keyboard over; the little display flickers like a dying star. "It's the battery. A nine-volt. I've asked three people and received two compliments and a pebble." They look at you with the polite despair of a person who knows how this sounds. "If you find one, I'll owe you a song. A real one."`, `Kai da vuelta el teclado del tamaño de una lonchera; la pantallita parpadea como una estrella que se muere. «Es la pila. Una de nueve voltios. Le pedí a tres personas y recibí dos cumplidos y un guijarro». Te mira con la desesperación cortés de quien sabe cómo suena. «Si encuentras una, te debo una canción. Una de verdad».`, `O Kai vira o teclado do tamanho de uma lancheira; o displayzinho pisca como uma estrela morrendo. «É a pilha. Uma de nove volts. Pedi pra três pessoas e recebi dois elogios e uma pedrinha». Olha pra você com o desespero educado de quem sabe como isso soa. «Se você achar uma, eu te devo uma música. Uma de verdade».`),
    choices: [
      K('care', t(`"I'll find one. Bruce, Mina, someone."`, `«Voy a encontrar una. Bruce, Mina, alguien».`, `«Vou achar uma. Bruce, Mina, alguém».`), { do: { flag: 'kai_wants_battery', quest: { sq_kai: 'active' }, soc: 1 }, next: null }),
      K('chill', t(`"Hope you find one."`, `«Ojalá encuentres una».`, `«Espero que você ache uma».`), { free: true, next: null })
    ]
  };
  D.kai.nodes.battery_done = {
    text: t(`Kai snaps it in with the ceremony of a person fitting a crown. The display lights up like a small sunrise. They play four bars. Then the whole song. It is, you realise, yours. Somebody on the sidewalk starts dancing.`, `Kai la encaja con la ceremonia de quien coloca una corona. La pantalla se enciende como un pequeño amanecer. Toca cuatro compases. Luego toda la canción. Es, te das cuenta, la tuya. Alguien en la vereda empieza a bailar.`, `O Kai encaixa com a cerimônia de quem coloca uma coroa. O display acende como um pequeno nascer do sol. Toca quatro compassos. Depois a música inteira. É, você percebe, a sua. Alguém na calçada começa a dançar.`),
    do: { fun: 10, soc: 4, flag: ['kai_battery', 'kai_tipped', 'kai_song'], unflag: 'battery', quest: { sq_kai: 'done' } }
  };
  D.bruce.nodes.a.choices.push(K('ask', t(`"Kai on the sidewalk needs a 9-volt. Do you have a spare?"`, `«Kai, en la vereda, necesita una pila de 9 voltios. ¿Tienes una de repuesto?»`, `«O Kai da calçada precisa de uma pilha de 9 volts. Você tem uma reserva?»`), { req: { flag: 'kai_wants_battery', no: 'battery' }, do: { flag: 'battery', soc: 2 }, next: null, react: t(`Bruce unzips a pocket of the walkie bag with the care of a man opening a nest. "Spare. For Kai? Tell Kai the cat sends regards." He puts it in your hand like a small, serious egg.`, `Bruce abre un bolsillo de la bolsa del walkie con el cuidado de quien abre un nido. «De repuesto. ¿Para Kai? Dile a Kai que el gato manda saludos». La pone en tu mano como un huevito serio.`, `O Bruce abre um bolso da bolsa do walkie com o cuidado de quem abre um ninho. «Reserva. Pro Kai? Fala pro Kai que o gato manda lembranças». Ele coloca na sua mão como um ovinho sério.`) }));
  D.mina.nodes.a.choices.push(K('ask', t(`"Do you happen to have a spare 9-volt?"`, `«¿Tendrás por casualidad una pila de 9 voltios de repuesto?»`, `«Você por acaso tem uma pilha de 9 volts de reserva?»`), { req: { flag: 'kai_wants_battery', no: 'battery' }, do: { flag: 'battery', soc: 2, fun: 2 }, next: null, react: t(`Mina rummages in her bag, which clinks like a musical instrument. "Nine volt. Always. For ears, for pedals, for emergencies of the heart." She hands it over with a wink at the frequency.`, `Mina revuelve su bolso, que tintinea como un instrumento. «Nueve voltios. Siempre. Para oídos, para pedales, para emergencias del corazón». Te la da con un guiño a la frecuencia.`, `A Mina remexe a bolsa, que tilinta como um instrumento. «Nove volts. Sempre. Pra ouvidos, pra pedais, pra emergências do coração». Ela entrega com uma piscadela pra frequência.`) }));

  /* ============================================================ THE HEADLAMP (Dani's crush; needs the staff corridor) */
  cast('lampie', 'LAMP', { skin: 4, hair: 5, hc: 1, expr: 3, top: 3, tc: 0, bottom: 1, bc: 1, acc: 7 });
  D.ev_dani_secret.nodes.a.choices.push(K('bold', t(`"Wait here. I'll go talk to the headlamp for you."`, `«Espera aquí. Voy a hablarle a la linterna por ti».`, `«Espera aqui. Eu vou falar com a lanterna por você».`), { do: { flag: 'lamp_task', bond: { dani: 1 }, quest: { sq_lamp: 'active' }, fun: 3 }, next: null, react: t(`Dani grips your sleeve. "You'd DO that? Say my name. Just my name. No — say 'Dani, who loves cables.'" He lets go as if he's launching you.`, `Dani te agarra de la manga. «¿Harías ESO? Di mi nombre. Solo mi nombre. No — di “Dani, al que le gustan los cables”». Te suelta como si te lanzara.`, `O Dani agarra a sua manga. «Você FARIA isso? Fala meu nome. Só o meu nome. Não — fala “Dani, que ama cabos”». Ele solta como se estivesse te lançando.`) }));
  D.lampie = {
    who: 'lampie', role: t('LIGHTING TECH', 'TÉCNICA DE LUCES', 'TÉCNICA DE LUZ'), start: 'a', nodes: {
      a: { branch: [{ req: { flag: 'lamp_done' }, to: 'after' }, { req: { flag: 'lamp_gel' }, to: 'deliver' }, { req: { flag: 'lamp_met' }, to: 'waiting' }, { req: { flag: 'lamp_task' }, to: 'ask' }, { req: function () { return true; }, to: 'plain' }] },
      plain: { text: t(`Lamp is ten metres of cable up a ladder with a headlamp on, wiring a rig and humming. "Sorry. Hands full. Cables. It's all cables."`, `Lamp está diez metros de cable arriba de una escalera con una linterna en la frente, armando un set y tarareando. «Perdón. Manos ocupadas. Cables. Todo son cables».`, `O Lamp está dez metros de cabo acima numa escada com uma lanterna na testa, montando uma estrutura e cantarolando. «Desculpa. Mãos ocupadas. Cabos. É tudo cabo».`) },
      ask: {
        text: t(`Lamp comes down the ladder one rung at a time, headlamp swinging. "Dani? Gold shirt, laughs like a firework? I've been looking at that shirt all night. I'd say yes to a coffee, if my brain weren't ten metres of cable. One thing: I need a rose-pink gel, number four, for the spot over the booth. It's in the drawer backstage. Bring it, and I'll bring myself."`, `Lamp baja la escalera peldaño a peldaño, con la linterna balanceándose. «¿Dani? ¿Camisa dorada, se ríe como un fuego artificial? Llevo toda la noche mirando esa camisa. Diría que sí a un café, si mi cerebro no fuera diez metros de cable. Una cosa: necesito un gel rosa, número cuatro, para el foco sobre la cabina. Está en el cajón del backstage. Tráelo y yo me traigo a mí».`, `O Lamp desce a escada degrau por degrau, com a lanterna balançando. «Dani? Camisa dourada, ri como um fogos de artifício? Passei a noite olhando pra essa camisa. Eu diria sim pra um café, se meu cérebro não fosse dez metros de cabo. Uma coisa: preciso de um gel rosa, número quatro, pro foco em cima da cabine. Tá na gaveta do backstage. Traz, e eu me trago».`),
        do: { flag: 'lamp_met' }, next: null
      },
      waiting: { text: t(`"The gel? Backstage. The drawer under the cables. Rose-pink, number four. I'll be here, looking like a person who isn't waiting."`, `«¿El gel? Backstage. El cajón bajo los cables. Rosa, número cuatro. Estaré aquí, con cara de persona que no espera».`, `«O gel? Backstage. A gaveta embaixo dos cabos. Rosa, número quatro. Eu fico aqui, com cara de quem não está esperando».`) },
      deliver: {
        text: t(`Lamp takes the gel as if it's a love letter. Holds it up to the light. The whole attic goes the colour of a very kind sunrise. "Tell Dani," they say, a little pink. "After close. The roof. I'll bring two coffees."`, `Lamp toma el gel como si fuera una carta de amor. Lo levanta hacia la luz. Todo el ático se vuelve del color de un amanecer muy amable. «Dile a Dani», dice, algo rosada. «Después del cierre. El techo. Llevo dos cafés».`, `O Lamp pega o gel como se fosse uma carta de amor. Levanta contra a luz. O sótão inteiro fica da cor de um nascer do sol muito gentil. «Fala pro Dani», diz, um pouco rosa. «Depois do fechamento. O terraço. Levo dois cafés».`),
        do: { fun: 8, soc: 4, bond: { dani: 3 }, flag: ['lamp_done'], unflag: 'lamp_gel', quest: { sq_lamp: 'done' } }
      },
      after: { text: t(`Lamp waves from the ladder, pink-lit, humming. "Roof. After close. Two coffees."`, `Lamp saluda desde la escalera, iluminada de rosa, tarareando. «Techo. Después del cierre. Dos cafés».`, `O Lamp acena da escada, iluminado de rosa, cantarolando. «Terraço. Depois do fechamento. Dois cafés».`) }
    }
  };
  Z.attic.npc({ id: 'lampie', x: 31.5, y: 6.5, dlg: 'lampie', dir: 'd', reach: 16 });
  D.obj_gel = {
    start: 'a', nodes: {
      a: {
        text: t(`A shallow drawer under a bundle of cables, full of coloured gel sheets in a rainbow of sunrise shades. Number four is the pink of the inside of a shell.`, `Un cajón bajo un montón de cables, lleno de láminas de gel de color en una paleta de amaneceres. El número cuatro es el rosa del interior de una concha.`, `Uma gaveta embaixo de um monte de cabos, cheia de folhas de gel coloridas numa paleta de amanheceres. O número quatro é o rosa do interior de uma concha.`),
        choices: [K('care', t(`Take number four.`, `Tomar el número cuatro.`, `Pegar o número quatro.`), { do: { flag: 'lamp_gel', soc: 1 }, next: null, free: true }), K('chill', t(`Leave it.`, `Dejarlo.`, `Deixar.`), { free: true, next: null })]
      }
    }
  };
  Z.backstage.obj({ id: 'geldrawer', kind: 'talk', dlg: 'obj_gel', x: 14, y: 3, w: 1, h: 1, label: t('THE GEL DRAWER', 'EL CAJÓN DE GELES', 'A GAVETA DE GÉIS'), when: function (s) { return !!s.flags.lamp_met && !s.flags.lamp_gel && !s.flags.lamp_done; } });

  /* ============================================================ SIA'S LAST LINE (Ruth, a voice in the dark, Gus) */
  D.sia.nodes.a.choices.push(
    K('care', t(`"Can I help with a poem?"`, `«¿Puedo ayudar con un poema?»`, `«Posso ajudar com um poema?»`), { req: { no: 'sia_done' }, next: 'help' }),
    K('care', t(`Give Sia the three words.`, `Darle a Sia las tres palabras.`, `Dar à Sia as três palavras.`), { req: function (s) { return !!(s.flags.word_warm && s.flags.word_brave && s.flags.word_silly) && !s.flags.sia_done; }, next: 'final' })
  );
  D.sia.nodes.help = {
    text: t(`Sia chews the pen. "Okay. I'm stuck on the last line. The poem is about tonight and it needs three words I can't get on my own: a WARM word, a BRAVE word, and a SILLY word. From three people who don't know they're being asked. Don't tell them it's for a poem."`, `Sia mastica el lápiz. «Bueno. Estoy trabada en la última línea. El poema es sobre esta noche y necesita tres palabras que no puedo conseguir sola: una palabra CÁLIDA, una palabra VALIENTE y una palabra TONTA. De tres personas que no saben que se las piden. No les digas que es para un poema».`, `A Sia mastiga a caneta. «Tá. Travei na última linha. O poema é sobre esta noite e precisa de três palavras que não consigo sozinha: uma palavra QUENTE, uma palavra CORAJOSA e uma palavra BOBA. De três pessoas que não sabem que estão sendo perguntadas. Não conta que é pra um poema».`),
    choices: [
      K('care', t(`"Warm, brave, silly. I'll bring them."`, `«Cálida, valiente, tonta. Te las traigo».`, `«Quente, corajosa, boba. Eu trago».`), { do: { flag: 'sia_task', quest: { sq_sia: 'active' }, soc: 1 }, next: null }),
      K('chill', t(`"Not tonight."`, `«Esta noche no».`, `«Hoje não».`), { free: true, next: null })
    ]
  };
  D.sia.nodes.final = {
    text: function (s) {
      return t(`Sia takes the three words ("TEA", "STAY", "WOBBLE") and writes without breathing. Then she reads it aloud, very softly: "A room that was warm as TEA. / A voice in the dark that said STAY. / A bass line, somewhere, in the quiet room's heart / that was a WOBBLE (somebody's heard that all night). / And you, with your good shoes, / who carried the words." She lets the pen fall. "That's the last line. You were the last line."`, `Sia toma las tres palabras («TÉ», «QUÉDATE», «WOBBLE») y escribe sin respirar. Luego lo lee en voz muy baja: «Un cuarto cálido como el TÉ. / Una voz en la oscuridad que dijo QUÉDATE. / Un bajo, en algún lugar, en el corazón de la sala tranquila / que era un WOBBLE (alguien lo ha pedido toda la noche). / Y tú, con tus buenos zapatos, / que cargaste las palabras». Deja caer el lápiz. «Esa es la última línea. Tú fuiste la última línea».`, `A Sia pega as três palavras («CHÁ», «FICA», «WOBBLE») e escreve sem respirar. Depois lê em voz bem baixinha: «Uma sala quente como CHÁ. / Uma voz no escuro que disse FICA. / Um baixo, em algum lugar, no coração da sala de calma / que era um WOBBLE (alguém pediu isso a noite toda). / E você, com seus sapatos bons, / que carregou as palavras». Ela deixa a caneta cair. «Essa é a última linha. Você foi a última linha».`);
    },
    do: { fun: 7, soc: 5, flag: ['sia_done', 'poem'], quest: { sq_sia: 'done' } }
  };
  D.ruth.nodes.a.choices.push(K('ask', t(`"Ruth, what's a warm word?"`, `«Ruth, ¿cuál es una palabra cálida?»`, `«Ruth, qual é uma palavra quente?»`), { req: { flag: 'sia_task', no: 'word_warm' }, do: { flag: 'word_warm', soc: 2 }, next: null, react: t(`She does not look up from the wool. "Tea," says Ruth, immediately. "It's always tea. If you're asking for a poem, I never said that."`, `No levanta la vista de la lana. «Té», dice Ruth, de inmediato. «Siempre es té. Si me pides para un poema, yo no dije eso».`, `Ela não tira os olhos da lã. «Chá», diz a Ruth, na hora. «É sempre chá. Se você tá pedindo pra um poema, eu não disse isso».`) }));
  D.gus.nodes.a.choices.push(K('ask', t(`"Gus, give me a silly word."`, `«Gus, dame una palabra tonta».`, `«Gus, me dá uma palavra boba».`), { req: { flag: 'sia_task', no: 'word_silly' }, do: { flag: 'word_silly', fun: 2 }, next: null, react: t(`Gus freezes, one hand on an invisible fader, and stares at the ceiling as if consulting a god of nonsense. "WOBBLE," he whispers. "The silliest word. Say it with your whole face." You say it with your whole face.`, `Gus se congela, una mano en un fader invisible, y mira el techo como consultando a un dios del sinsentido. «WOBBLE», susurra. «La palabra más tonta. Dila con toda la cara». La dices con toda la cara.`, `O Gus congela, uma mão num fader invisível, e olha o teto como se consultasse um deus do nonsense. «WOBBLE», sussurra. «A palavra mais boba. Fala com o rosto inteiro». Você fala com o rosto inteiro.`) }));
  /* the brave word is given by a voice in the dark (see story_v10) */

  /* ============================================================ ISI'S SNACK RUN (the vending machine, Ines) */
  const isiExtra = [K('care', t(`"Is there anything I can bring you?"`, `«¿Hay algo que pueda traerte?»`, `«Tem algo que eu possa te trazer?»`), { req: { no: 'isi_fed' }, next: 'hungry' }), K('care', t(`Hand over the food.`, `Entregar la comida.`, `Entregar a comida.`), { req: function (s) { return !!(s.flags.have_sandwich || s.flags.have_prawn) && !s.flags.isi_fed; }, next: 'fed' })];
  isiExtra.forEach(function (c) { D.nuri.nodes.a.choices.push(c); if (D.nuri_after) D.nuri_after.nodes.a.choices.push(c); });
  D.nuri.nodes.hungry = {
    text: t(`Isi laughs, then stops, then admits it. "Honestly? Food. The three of us at this table haven't eaten since the afternoon. A plate of garlic mussels would end the war. Failing that: the cheese triangle sandwich from the foyer machine, or something from the bar. Ines usually has prawn crackers, which are, technically, shellfish." She says "technically" with her whole heart.`, `Isi se ríe, luego se detiene, luego lo admite. «¿La verdad? Comida. Los tres de esta mesa no comemos desde la tarde. Un plato de choritos al ajillo terminaría la guerra. Si no: el sándwich triangular de queso de la máquina del foyer, o algo de la barra. Inés casi siempre tiene galletas de camarón, que son, técnicamente, mariscos». Dice «técnicamente» con todo el corazón.`, `A Isi ri, depois para, depois admite. «Sinceramente? Comida. Nós três nesta mesa não comemos desde a tarde. Um prato de mexilhões no alho acabaria com a guerra. Na falta disso: o sanduíche triangular de queijo da máquina do foyer, ou algo do bar. A Ines quase sempre tem biscoito de camarão, que é, tecnicamente, fruto do mar». Ela diz «tecnicamente» com o coração inteiro.`),
    choices: [K('care', t(`"I'll get you something."`, `«Te consigo algo».`, `«Eu te arranjo algo».`), { do: { flag: 'isi_task', quest: { sq_isi: 'active' }, soc: 1 }, next: null }), K('chill', t(`"I'm sorry. Another time."`, `«Perdón. Otro día».`, `«Desculpa. Outro dia».`), { free: true, next: null })]
  };
  D.nuri.nodes.fed = {
    text: function (s) {
      const both = s.flags.have_sandwich && s.flags.have_prawn;
      return both
        ? t(`Isi gets the prawn crackers and the cheese triangle and looks at them like a woman at a banquet. "SEAFOOD AND CHEESE. Oh, I could weep. TEAM! LOOK!" Two volunteers materialise from nowhere, wide-eyed, as at a feast. She presses a small paper wristband into your hand. "TESTED OK. For you. It means: we know you. The dealers' queue gets nervous around that. Don't ask me why it works."`, `Isi recibe las galletas de camarón y el triángulo de queso y los mira como una mujer en un banquete. «MARISCOS Y QUESO. Ay, podría llorar. ¡EQUIPO! ¡MIREN!» Dos voluntarios se materializan de la nada, con los ojos enormes, como ante un festín. Te pone una pulserita de papel en la mano. «PROBADO OK. Para ti. Significa: te conocemos. La fila de los vendedores se pone nerviosa con esto. No me preguntes por qué funciona».`, `A Isi recebe os biscoitos de camarão e o triângulo de queijo e olha pra eles como uma mulher num banquete. «FRUTO DO MAR E QUEIJO. Ai, eu podia chorar. EQUIPE! OLHEM!» Dois voluntários se materializam do nada, de olhos arregalados, como num banquete. Ela coloca uma pulseirinha de papel na sua mão. «TESTADO OK. Pra você. Significa: a gente te conhece. A fila dos vendedores fica nervosa com isso. Não me pergunta por que funciona».`)
        : t(`Isi takes it with both hands. "OH. This is SO kind." She splits it three ways with surgical fairness and the three of them eat in complete silence. She presses a small paper wristband into your hand. "TESTED OK. For you. It means: we know you. Dealers' queues go quiet around it. Don't ask me why it works."`, `Isi lo toma con las dos manos. «AY. Qué AMABLE». Lo reparte entre tres con justicia quirúrgica y los tres comen en silencio total. Te pone una pulserita de papel en la mano. «PROBADO OK. Para ti. Significa: te conocemos. Las filas de los vendedores se calman con esto. No me preguntes por qué funciona».`, `A Isi pega com as duas mãos. «AI. Que GENTIL». Ela divide em três com justiça cirúrgica e os três comem em silêncio total. Ela coloca uma pulseirinha de papel na sua mão. «TESTADO OK. Pra você. Significa: a gente te conhece. As filas dos vendedores ficam quietas com isso. Não me pergunta por que funciona».`);
    },
    do: { hp: 6, soc: 6, fun: 3, flag: ['isi_fed', 'isi_wristband'], unflag: ['have_sandwich', 'have_prawn'], quest: { sq_isi: 'done' } }
  };
  if (D.nuri_after) { D.nuri_after.nodes.hungry = D.nuri.nodes.hungry; D.nuri_after.nodes.fed = D.nuri.nodes.fed; }
  D.obj_vend.nodes.a.choices.splice(1, 0, K('care', t(`The cheese triangle: for Isi.`, `El triángulo de queso: para Isi.`, `O triângulo de queijo: pra Isi.`), { req: function (s) { return s.quests.sq_isi === 'active' && !s.flags.have_sandwich; }, do: { flag: 'have_sandwich', cool: { vend: 45 } }, next: null, react: t(`You carry it away carefully, like a very small, very cheesy relic. The machine blinks OUT OF CHANGE behind you.`, `Te lo llevas con cuidado, como una reliquia muy chiquita y muy quesuda. La máquina parpadea SIN CAMBIO a tus espaldas.`, `Você leva com cuidado, como uma relíquia bem pequena e bem queijuda. A máquina pisca SEM TROCO atrás de você.`) }));
  D.ines.nodes.a.choices.push(K('ask', t(`"Isi in the quiet room is hungry for seafood. Anything?"`, `«Isi, en la sala tranquila, tiene hambre de mariscos. ¿Algo?»`, `«A Isi, na sala de calma, tá com fome de frutos do mar. Tem algo?»`), { req: function (s) { return s.quests.sq_isi === 'active' && !s.flags.have_prawn; }, do: { flag: 'have_prawn', soc: 2 }, next: null, react: t(`Ines disappears behind the bar and comes back with a paper cone. "Prawn crackers. Technically seafood. Off the books. Tell her they're from a woman who thinks she's a hero."`, `Inés desaparece tras la barra y vuelve con un cucurucho de papel. «Galletas de camarón. Técnicamente mariscos. Fuera de la cuenta. Dile que son de una mujer que cree que ella es una heroína».`, `A Ines desaparece atrás do bar e volta com um cone de papel. «Biscoito de camarão. Tecnicamente fruto do mar. Por fora. Fala pra ela que é de uma mulher que acha que ela é uma heroína».`) }));

  /* ============================================================ MORNING MESSAGES FOR ALL OF THIS */
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'rosa_best', who: '#ROSA', ok: function (s) { return !!s.flags.rosa_best; }, t: t(`it's rosa. the lanyard stays with you. i've told the others you're not to be asked questions. the bucket was spotless. come back to my toilets any time. (i did not say that.)`, `soy rosa. la credencial es tuya. les dije a los demás que no se te hacen preguntas. el balde estaba impecable. vuelve a mis baños cuando quieras. (yo no dije eso.)`, `é a rosa. o crachá fica com você. avisei aos outros que você não deve ser questionado. o balde estava impecável. volta nos meus banheiros quando quiser. (eu não disse isso.)`) });
    R.push({ id: 'rosa_lanyard', who: 'maru', ok: function (s) { return !!s.flags.rosa_lanyard && !s.flags.rosa_best; }, t: t(`Wait, Rosa gave you a LANYARD? She doesn't give lanyards. She gave one to the Prime Minister once and made him mop first.`, `Espera, ¿Rosa te dio una CREDENCIAL? Rosa no da credenciales. Una vez le dio una al Presidente y lo hizo trapear primero.`, `Peraí, a Rosa te deu um CRACHÁ? A Rosa não dá crachá. Uma vez deu um pro Primeiro-Ministro e fez ele esfregar o chão antes.`) });
    R.push({ id: 'tavi', who: '#TAVI', ok: function (s) { return !!s.flags.tavi_helped; }, t: t(`you walked me to the quiet room. teo said my pulse was "dramatic but fine". i'm okay. thank you for not telling me to cheer up.`, `me acompañaste a la sala tranquila. teo dijo que mi pulso era «dramático pero bien». estoy bien. gracias por no decirme que me animara.`, `você me levou pra sala de calma. o teo disse que meu pulso era «dramático mas bom». eu tô bem. obrigado por não mandar eu me animar.`) });
    R.push({ id: 'lamp', who: 'dani', ok: function (s) { return !!s.flags.lamp_done; }, t: t(`THE HEADLAMP SAID ROOF. AFTER CLOSE. TWO COFFEES. I am sitting on the floor of my room. I am a person who gets two coffees. I owe you my life and also a coffee.`, `LA LINTERNA DIJO TECHO. DESPUÉS DEL CIERRE. DOS CAFÉS. Estoy sentado en el piso de mi cuarto. Soy una persona a la que le tocan dos cafés. Te debo la vida y también un café.`, `A LANTERNA DISSE TERRAÇO. DEPOIS DO FECHAMENTO. DOIS CAFÉS. Tô sentado no chão do meu quarto. Sou uma pessoa que ganha dois cafés. Te devo a vida e também um café.`) });
    R.push({ id: 'siafin', who: '#SIA', ok: function (s) { return !!s.flags.sia_done; }, t: t(`the poem is finished. it has your three words in it. i'm going to read it at a place where people come to be quiet. you're credited as "the last line." i hope that's okay.`, `el poema está terminado. tiene tus tres palabras. lo voy a leer en un lugar donde la gente va a estar en silencio. figuras como «la última línea». espero que esté bien.`, `o poema está pronto. tem as suas três palavras. vou ler num lugar onde as pessoas vão pra ficar em silêncio. você está creditado como «a última linha». espero que tudo bem.`) });
    R.push({ id: 'isifed', who: '#ISI', ok: function (s) { return !!s.flags.isi_fed; }, t: t(`the prawn crackers were eaten with reverence. the team has asked me to say: we love you, stranger with the paper wristband. also: more dubstep. always more dubstep.`, `las galletas de camarón se comieron con reverencia. el equipo me pidió decir: te queremos, desconocido de la pulserita de papel. y también: más dubstep. siempre más dubstep.`, `os biscoitos de camarão foram comidos com reverência. a equipe pediu pra eu dizer: a gente te ama, estranho da pulseirinha de papel. e também: mais dubstep. sempre mais dubstep.`) });
    R.push({ id: 'battery', who: '#KAI', ok: function (s) { return !!s.flags.kai_battery; }, t: t(`the keyboard lives. i played your song twice more on the sidewalk after you left. a stranger cried. a second stranger tipped him a pebble. thank you for the nine volts.`, `el teclado vive. toqué tu canción dos veces más en la vereda cuando te fuiste. un desconocido lloró. un segundo desconocido le dio un guijarro de propina. gracias por las nueve voltios.`, `o teclado vive. toquei a sua música mais duas vezes na calçada depois que você foi. um estranho chorou. um segundo estranho deu uma pedrinha de gorjeta pra ele. obrigado pelos nove volts.`) });
  }
  /* the lanyard and wristband matter to the guards and the dealers */
})();

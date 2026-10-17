/* EXCUSE ME — story v6: little machines and rituals (photo booth, vending machine, lost phone, mirror,
   the DJ's tracklist), moments your friends bring you, and a dozen more things that happen in the corners. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const NF = EM.NF;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`Leave it.`, `Dejarlo.`, `Deixar pra lá.`), { free: true, next: null }); };

  /* ============================================================ OBJECTS */
  EM.objects.talk = function (ent) { U.startDialogue(ent.def.dlg, {}); };
  function gated(id, key, mins, msg) {
    return function (ent) {
      const s = EM.state;
      if ((s.cool[key] || 0) > s.time) { U.toast({ text: msg, kind: 'info' }); return; }
      U.startDialogue(id, {});
    };
  }
  EM.objects.photo = gated('obj_photo', 'photo', 90, t(`The booth is printing the last strip. Give it a minute.`, `La cabina está imprimiendo la última tira. Dale un minuto.`, `A cabine está imprimindo a última tira. Dá um minuto.`));
  EM.objects.vend = gated('obj_vend', 'vend', 45, t(`The machine blinks OUT OF CHANGE in a very final font.`, `La máquina parpadea SIN CAMBIO en una tipografía muy definitiva.`, `A máquina pisca SEM TROCO numa fonte bem definitiva.`));
  EM.objects.mirror = gated('obj_mirror', 'mirror', 40, t(`You already looked. The mirror is not impressed twice.`, `Ya te miraste. El espejo no se impresiona dos veces.`, `Você já se olhou. O espelho não se impressiona duas vezes.`));
  EM.objects.djpeek = function () { U.startDialogue('obj_djpeek', {}); };
  EM.objects.phone = function () { U.startDialogue('obj_phone', {}); };

  D.obj_photo = {
    start: 'a', nodes: {
      a: {
        text: t(`A photo booth with a curtain that doesn't close and a sign: ONE STRIP, FOUR FRAMES, NO REGRETS (REGRETS WILL BE PRINTED). It smells faintly of a very old kiss.`, `Una cabina de fotos con una cortina que no cierra y un cartel: UNA TIRA, CUATRO CUADROS, SIN ARREPENTIMIENTOS (LOS ARREPENTIMIENTOS SE IMPRIMEN). Huele levemente a un beso muy viejo.`, `Uma cabine de fotos com uma cortina que não fecha e uma placa: UMA TIRA, QUATRO QUADROS, SEM ARREPENDIMENTOS (OS ARREPENDIMENTOS SERÃO IMPRESSOS). Cheira levemente a um beijo muito antigo.`),
        choices: [
          K('hug', t(`Squeeze in with your friends.`, `Apretarse con tus amigos.`, `Se espremer com seus amigos.`), { req: function (s) { return s.party.length >= 1; }, do: { fun: 6, soc: 3, pb: { maru: 1, dani: 1, tato: 1 }, flag: ['photostrip', 'photostrip_group'], cool: { photo: 90 } }, next: null, react: t(`Four frames: all serious; everybody laughing; Dani licking the lens; a blur that is mostly elbows. Somebody has to keep the strip. It will be you. It will be kept forever.`, `Cuatro cuadros: todos serios; todos riéndose; Dani lamiendo el lente; un borrón que es casi todo codos. Alguien tiene que quedarse con la tira. Serás tú. Se guardará para siempre.`, `Quatro quadros: todo mundo sério; todo mundo rindo; o Dani lambendo a lente; um borrão que é quase só cotovelo. Alguém precisa ficar com a tira. Vai ser você. Será guardada pra sempre.`) }),
          K('bold', t(`Go in alone. Be dramatic.`, `Entrar solo. Ser dramático.`, `Entrar sozinho. Ser dramático.`), { do: { fun: 3, flag: 'photostrip', cool: { photo: 90 } }, next: null, react: t(`Four frames: a smoulder, a pout, a stare into the middle distance, and then you, mid-sneeze. The sneeze is the keeper.`, `Cuatro cuadros: una mirada ardiente, un puchero, una mirada perdida en la distancia, y luego tú, a mitad de un estornudo. El estornudo es el que se guarda.`, `Quatro quadros: um olhar de sedução, um bico, um olhar perdido na distância, e depois você, no meio de um espirro. O espirro é o que fica.`) }),
          K('joke', t(`Make the weirdest faces you possibly can.`, `Hacer las caras más raras que puedas.`, `Fazer as caras mais estranhas que você conseguir.`), { do: { fun: 5, weird: 2, flag: ['photostrip', 'photostrip_weird'], cool: { photo: 90 } }, next: null, react: t(`Four frames of a person you do not recognise. One of them is the human face reaching its theoretical limit. You will show it to everyone, and then never again.`, `Cuatro cuadros de una persona que no reconoces. Uno de ellos es la cara humana alcanzando su límite teórico. Se lo mostrarás a todos, y luego nunca más.`, `Quatro quadros de uma pessoa que você não reconhece. Um deles é o rosto humano atingindo o limite teórico. Você vai mostrar pra todo mundo e depois nunca mais.`) }),
          LEAVE()
        ]
      }
    }
  };
  D.obj_vend = {
    start: 'a', nodes: {
      a: {
        text: t(`A vending machine lit from within like a small, doubtful cathedral. Everything in it is a colour that does not occur in nature.`, `Una máquina expendedora iluminada desde adentro como una pequeña y dudosa catedral. Todo lo que tiene es de un color que no existe en la naturaleza.`, `Uma máquina de venda iluminada por dentro como uma pequena e duvidosa catedral. Tudo o que tem é de uma cor que não existe na natureza.`),
        choices: [
          K('chill', t(`The cheese triangle sandwich.`, `El sándwich triangular de queso.`, `O sanduíche triangular de queijo.`), { do: { hp: 5, fun: 1, cool: { vend: 45 } }, next: null, react: t(`It tastes of a school trip in 2006. You eat it standing up with enormous gratitude.`, `Sabe a un viaje escolar de 2006. Te lo comes parado con enorme gratitud.`, `Tem gosto de excursão escolar de 2006. Você come em pé com enorme gratidão.`) }),
          K('smooth', t(`The aggressive mint.`, `La menta agresiva.`, `A menta agressiva.`), { do: { fun: 2, fresh: 90, cool: { vend: 45 }, flag: 'minty' }, next: null, react: t(`Your breath could clear a cathedral. Your confidence has risen by roughly a tenth.`, `Tu aliento podría despejar una catedral. Tu confianza subió más o menos un décimo.`, `Seu hálito poderia esvaziar uma catedral. Sua confiança subiu aproximadamente um décimo.`) }),
          K('bold', t(`The mystery can with no label.`, `La lata misteriosa sin etiqueta.`, `A lata misteriosa sem rótulo.`), { call: 'vend_can', do: { cool: { vend: 45 } }, next: null, free: true }),
          LEAVE()
        ]
      }
    }
  };
  S.vend_can = function () {
    const r = Math.random();
    if (r < 0.34) { L.apply({ hp: 6, fun: 1 }); U.toast({ icon: 'water', text: t(`Cold, fizzy, and astonishingly fine. Peach, maybe. Hope, certainly.`, `Fría, burbujeante y asombrosamente bien. Durazno, quizás. Esperanza, sin duda.`, `Gelada, borbulhante e surpreendentemente boa. Pêssego, talvez. Esperança, com certeza.`), kind: 'good' }); }
    else if (r < 0.67) { L.apply({ fun: 7, weird: 1 }); U.toast({ icon: 'spark', text: t(`It tastes like electricity wearing a lime. Your eyes widen by one percent. The music gets one percent better.`, `Sabe a electricidad con un limón puesto. Se te abren los ojos un uno por ciento. La música mejora un uno por ciento.`, `Tem gosto de eletricidade usando um limão. Seus olhos se arregalam um por cento. A música melhora um por cento.`), kind: 'good' }); }
    else { L.apply({ fun: 2, weird: 4, hp: -2 }); U.toast({ icon: 'eyes', text: t(`It tastes like a nine-volt battery and a lie. Your tongue files a formal complaint and then goes quiet.`, `Sabe a pila de nueve voltios y a mentira. Tu lengua presenta una queja formal y luego se queda callada.`, `Tem gosto de bateria de nove volts e mentira. Sua língua registra uma reclamação formal e depois fica quieta.`), kind: 'bad' }); }
  };
  D.obj_mirror = {
    start: 'a', nodes: {
      a: {
        text: t(`A long, slightly cloudy mirror with a sticker that says YOU ARE HERE. Underneath, someone has added: (ALSO THERE).`, `Un espejo largo, un poco empañado, con una calcomanía que dice USTED ESTÁ AQUÍ. Abajo, alguien agregó: (Y TAMBIÉN ALLÁ).`, `Um espelho comprido, meio embaçado, com um adesivo que diz VOCÊ ESTÁ AQUI. Embaixo, alguém acrescentou: (E TAMBÉM ALI).`),
        choices: [
          K('smooth', t(`Fix your hair. Fix your face.`, `Arreglarte el pelo. Arreglarte la cara.`, `Arrumar o cabelo. Arrumar o rosto.`), { do: { fun: 2, fresh: 60, cool: { mirror: 40 } }, next: null, react: t(`Water, a hand, a sleeve. You look like somebody who is going to be good at tonight.`, `Agua, una mano, una manga. Te ves como alguien a quien le va a ir bien esta noche.`, `Água, uma mão, uma manga. Você parece alguém que vai se dar bem hoje à noite.`) }),
          K('honest', t(`Look yourself in the eye. For a while.`, `Mirarte a los ojos. Por un rato.`, `Olhar nos próprios olhos. Por um tempo.`), { call: 'mirror_stare', do: { cool: { mirror: 40 } }, next: null, free: true }),
          K('joke', t(`Give the mirror a kiss.`, `Darle un beso al espejo.`, `Dar um beijo no espelho.`), { do: { fun: 3, weird: 1, cool: { mirror: 40 } }, next: null, react: t(`A cold, honest, slightly sticky kiss. The mirror takes it well. Somebody comes in, sees you, and leaves again without a word.`, `Un beso frío, honesto y un poco pegajoso. El espejo lo toma bien. Entra alguien, te ve y se va otra vez sin decir una palabra.`, `Um beijo frio, honesto e um pouco grudento. O espelho recebe bem. Alguém entra, vê você e sai de novo sem dizer uma palavra.`) }),
          LEAVE()
        ]
      }
    }
  };
  S.mirror_stare = function () {
    if (Math.random() < 0.5) { L.apply({ weird: -2, soc: 3, fun: 1 }); U.toast({ icon: 'heart', text: t(`You look like somebody's friend. A good one. Somebody you would, honestly, go out with.`, `Te ves como el amigo de alguien. Uno bueno. Alguien con quien, la verdad, saldrías.`, `Você parece o amigo de alguém. Um bom. Alguém com quem, sinceramente, você sairia.`), kind: 'good' }); }
    else { L.apply({ weird: 2, soc: -1 }); U.toast({ icon: 'eyes', text: t(`Your pupils are two doors, and the reflection is looking back a half-second too attentively. You step away politely.`, `Tus pupilas son dos puertas, y el reflejo te devuelve la mirada medio segundo demasiado atento. Te alejas con educación.`, `Suas pupilas são duas portas, e o reflexo devolve o olhar meio segundo atento demais. Você se afasta educadamente.`), kind: 'bad' }); }
  };
  D.obj_phone = {
    start: 'a', nodes: {
      a: {
        text: t(`A phone left on a bench, lit up: 41 notifications and a lock-screen photo of a very small dog in a very small raincoat. It buzzes in your hand like it's trying to tell you something.`, `Un celular dejado en un banco, encendido: 41 notificaciones y una foto de bloqueo de un perro muy chiquito con un impermeable muy chiquito. Vibra en tu mano como si quisiera decirte algo.`, `Um celular deixado num banco, aceso: 41 notificações e uma foto de bloqueio de um cachorro bem pequeno com uma capa de chuva bem pequena. Vibra na sua mão como se quisesse te dizer algo.`),
        choices: [
          K('care', t(`Take it to the coat check. Somebody is missing this.`, `Llevarlo al guardarropa. A alguien le falta esto.`, `Levar à chapelaria. Alguém tá sentindo falta disso.`), { do: { care: 1, soc: 2, flag: ['phone_returned', 'phone_done'] }, next: null, react: t(`Luca types a pin in four tries and calls the number saved as MUM. "Hi. Yes. Your Biscuit's phone — no, your phone. Hello? She's sobbing. She says thank you. She says Biscuit says thank you."`, `Luca prueba un pin en cuatro intentos y llama al número guardado como MAMÁ. «Hola. Sí. El celular de tu Biscuit — no, tu celular. ¿Hola? Está llorando. Dice gracias. Dice que Biscuit dice gracias».`, `O Luca tenta um PIN em quatro tentativas e liga pro número salvo como MÃE. «Oi. Sim. O celular do seu Biscuit — não, o seu celular. Alô? Ela tá soluçando. Ela diz obrigada. Diz que o Biscuit diz obrigado».`) }),
          K('bold', t(`Scroll through it. Just a little.`, `Husmear un poco.`, `Dar uma espiada.`), { do: { weird: 6, soc: -2, flag: ['phone_snooped', 'phone_done'] }, bad: true, next: null, react: t(`There is a photo of someone you know, in a context you did not ask to know. You close it at once. The dog in the raincoat looks at you from the lock screen like a very small judge.`, `Hay una foto de alguien que conoces, en un contexto que no pediste conocer. La cierras de inmediato. El perro del impermeable te mira desde la pantalla de bloqueo como un juez muy pequeño.`, `Tem uma foto de alguém que você conhece, num contexto que você não pediu pra conhecer. Você fecha na hora. O cachorro da capa de chuva te olha da tela de bloqueio como um juizinho.`) }),
          K('chill', t(`Put it back exactly where it was.`, `Dejarlo exactamente donde estaba.`, `Colocar de volta exatamente onde estava.`), { do: { flag: 'phone_left' }, next: null, free: true })
        ]
      }
    }
  };
  D.obj_djpeek = {
    start: 'a', nodes: {
      a: {
        text: function (s) {
          const lvl = (s.gags && s.gags.ae) || 0;
          const extra = lvl >= 2 ? t(`Under the list somebody has added, in a different pen: "5. (we are not playing 5)". Under that: "5. ok we are playing 5".`, `Debajo de la lista alguien agregó, con otro bolígrafo: «5. (no vamos a tocar el 5)». Debajo: «5. ok sí vamos a tocar el 5».`, `Embaixo da lista alguém acrescentou, com outra caneta: «5. (a gente não vai tocar o 5)». Embaixo: «5. ok a gente vai tocar o 5».`) : null;
          const base = t(`The tracklist is taped to the booth in handwriting like a spider with ambition: "1. warm. 2. warmer. 3. (DO NOT PLAY 3 YET). 4. the one that sounds like a hallway at dawn. 5. water."`, `El tracklist está pegado a la cabina con una letra de araña con ambición: «1. cálido. 2. más cálido. 3. (NO TOCAR EL 3 TODAVÍA). 4. el que suena a pasillo al amanecer. 5. agua».`, `A tracklist está colada na cabine com uma letra de aranha com ambição: «1. quente. 2. mais quente. 3. (NÃO TOCAR O 3 AINDA). 4. aquele que parece um corredor ao amanhecer. 5. água».`);
          return extra ? [base, extra] : base;
        },
        choices: [
          K('chill', t(`Memorise it.`, `Memorizarlo.`, `Memorizar.`), { do: { fun: 3, flag: 'peeked_plan' }, next: null, react: t(`You now know that something happens at four, and that the thing is gentle. You hold this knowledge the way a child holds a lit sparkler.`, `Ahora sabes que a las cuatro pasa algo, y que ese algo es suave. Sostienes ese conocimiento como un niño sostiene una bengala encendida.`, `Agora você sabe que às quatro acontece algo, e que esse algo é suave. Você segura esse conhecimento como uma criança segura uma estrelinha acesa.`) }),
          K('bold', t(`Take a photo of it.`, `Sacarle una foto.`, `Tirar uma foto.`), { do: { weird: 6, flag: 'photographed_plan' }, bad: true, next: null, react: t(`A tall person with a thermos appears from nowhere. "Rule one," says ÆRIEL, pleasantly. "No photos." They delete it from your phone with one thumb, hand it back, and vanish. You are not sure what just happened to your afternoon.`, `Una persona alta con un termo aparece de la nada. «Regla uno», dice ÆRIEL, amablemente. «Nada de fotos». La borra de tu celular con un pulgar, te lo devuelve y desaparece. No estás seguro de qué le pasó a tu tarde.`, `Uma pessoa alta com uma garrafa térmica surge do nada. «Regra um», diz ÆRIEL, gentilmente. «Sem fotos». Apaga do seu celular com um polegar, devolve e some. Você não sabe direito o que aconteceu com a sua tarde.`) }),
          LEAVE()
        ]
      }
    }
  };

  const O = function (zone, d) { Z[zone].obj(d); };
  O('foyer', { id: 'photobooth', kind: 'photo', x: 25, y: 2, w: 1, h: 2, label: t('PHOTO BOOTH', 'CABINA DE FOTOS', 'CABINE DE FOTOS') });
  O('foyer', { id: 'vend', kind: 'vend', x: 25, y: 8, w: 1, h: 1, label: t('VENDING MACHINE', 'MÁQUINA EXPENDEDORA', 'MÁQUINA DE VENDA') });
  O('foyer', { id: 'lostphone', kind: 'phone', x: 9, y: 5, w: 1, h: 1, label: t('A PHONE ON THE BENCH', 'UN CELULAR EN EL BANCO', 'UM CELULAR NO BANCO'), when: NF('phone_done') });
  O('restrooms', { id: 'mirror2', kind: 'mirror', x: 16, y: 3, w: 2, h: 1, label: t('THE LONG MIRROR', 'EL ESPEJO LARGO', 'O ESPELHO COMPRIDO') });
  O('main', { id: 'djpeek', kind: 'djpeek', x: 21, y: 6, w: 2, h: 1, label: t('THE TRACKLIST', 'EL TRACKLIST', 'A TRACKLIST') });

  /* ============================================================ MOMENTS YOUR FRIENDS BRING YOU */
  const EV = [];
  function ev(id, who, role, text, choices, o) {
    D[id] = { who: who, role: role, start: 'a', nodes: { a: { text: text, choices: choices } } };
    EV.push(Object.assign({ id: id, who: who }, o || {}));
  }
  const MOMENT = t('A MOMENT', 'UN MOMENTO', 'UM MOMENTO');
  ev('ev_dani_dare', 'dani', MOMENT, t(`DANI: "I dare you. Say EXCUSE ME to the DJ booth. Dramatically. With a gesture. Do it like you're apologising to a king."`, `DANI: «Te reto. Dile CON PERMISO a la cabina del DJ. Dramáticamente. Con un gesto. Hazlo como si le pidieras perdón a un rey».`, `DANI: «Eu te desafio. Fala COM LICENÇA pra cabine do DJ. Dramaticamente. Com um gesto. Faz como se estivesse pedindo desculpa a um rei».`), [
    K('bold', t(`Do it. Full theatre.`, `Hacerlo. Teatro completo.`, `Fazer. Teatro completo.`), { do: { fun: 5, weird: 3, bond: { dani: 1 }, flag: 'dare_done' }, next: null, react: t(`You sweep an arm toward the booth and bow to the bass. The DJ, who has never seen you before, nods once like a monarch. Dani is on the floor, wheezing.`, `Barres un brazo hacia la cabina y haces una reverencia al bajo. El DJ, que nunca te vio, asiente una vez como un monarca. Dani está en el piso, sin aire de la risa.`, `Você varre um braço em direção à cabine e faz uma reverência ao grave. O DJ, que nunca te viu, assente uma vez como um monarca. O Dani está no chão, sem ar de tanto rir.`) }),
    K('joke', t(`"Only if you tell the bouncer you love him."`, `«Solo si tú le dices al de la puerta que lo amas».`, `«Só se você falar pro porteiro que ama ele».`), { do: { fun: 3, bond: { dani: 1 } }, next: null, react: t(`Dani goes quiet, nods slowly, and walks away like a man heading into war. You watch from a distance. It goes well. The bouncer hugs him. Dani comes back radiant.`, `Dani se queda callado, asiente despacio y se va como un hombre que marcha a la guerra. Miras desde lejos. Sale bien. El de la puerta lo abraza. Dani vuelve radiante.`, `O Dani fica quieto, assente devagar e sai como um homem indo pra guerra. Você observa de longe. Dá certo. O porteiro abraça ele. O Dani volta radiante.`) }),
    K('chill', t(`"Not tonight, but I admire the energy."`, `«Esta noche no, pero admiro la energía».`, `«Hoje não, mas admiro a energia».`), { do: { soc: 1 }, next: null })
  ], { zones: ['main', 'attic'] });
  ev('ev_maru_selfie', 'maru', MOMENT, t(`MARU: "Group selfie. Now. No, not your good side. ALL the sides. I want proof that we looked this happy before 5 a.m."`, `MARU: «Selfie grupal. Ahora. No, no tu lado bueno. TODOS los lados. Quiero prueba de que nos veíamos así de felices antes de las 5 de la mañana».`, `MARU: «Selfie em grupo. Agora. Não, não o seu lado bom. TODOS os lados. Quero prova de que a gente estava assim de feliz antes das 5 da manhã».`), [
    K('hug', t(`Lean in. Pull everyone close.`, `Acercarte. Juntar a todos.`, `Chegar perto. Juntar todo mundo.`), { do: { fun: 4, soc: 2, pb: { maru: 1, dani: 1, tato: 1 }, flag: 'group_selfie' }, next: null, react: t(`Four faces at four angles: one blinking, one mid-laugh, one too close, one perfect. Maru declares it the album cover.`, `Cuatro caras en cuatro ángulos: una parpadeando, una a mitad de risa, una demasiado cerca, una perfecta. Maru lo declara tapa de disco.`, `Quatro rostos em quatro ângulos: um piscando, um no meio da risada, um perto demais, um perfeito. A Maru declara a capa do álbum.`) }),
    K('joke', t(`Pull the most serious face of your life.`, `Poner la cara más seria de tu vida.`, `Fazer a cara mais séria da sua vida.`), { do: { fun: 5, weird: 1, pb: { maru: 1 } }, next: null, react: t(`In the photo, you look like a customs officer who has just been told a very good joke. Maru will use it as her profile picture, which is a threat.`, `En la foto pareces un agente de aduanas al que acaban de contarle un chiste buenísimo. Maru la usará de foto de perfil, que es una amenaza.`, `Na foto, você parece um fiscal da alfândega que acabou de ouvir uma piada ótima. A Maru vai usar de foto de perfil, o que é uma ameaça.`) }),
    K('chill', t(`"You take it. I'll be in the background looking mysterious."`, `«Sácala tú. Yo estaré al fondo con aire misterioso».`, `«Você tira. Eu fico no fundo com ar misterioso».`), { do: { soc: 1 }, next: null })
  ], { zones: ['main', 'attic', 'courtyard', 'foyer'] });
  ev('ev_tato_quiet', 'tato', MOMENT, t(`TATO: "Can we sit somewhere quieter for five minutes? I'm doing great. I'm just doing it loudly."`, `TATO: «¿Podemos sentarnos en un lugar más tranquilo cinco minutos? Estoy genial. Solo que lo estoy haciendo en voz alta».`, `TATO: «A gente pode sentar num lugar mais calmo por cinco minutos? Tô ótimo. Só que tô fazendo isso em voz alta».`), [
    K('care', t(`"Of course. Come on, I know a wall."`, `«Claro. Ven, conozco una pared».`, `«Claro. Vem, eu conheço uma parede».`), { do: { care: 1, time: 6, soc: 4, hp: 2, bond: { tato: 2 }, flag: 'tato_wall' }, next: null, react: t(`You find the wall. You both slide down it. Tato exhales for the first time in an hour. "Thank you. I just needed to hear the music from a little further away."`, `Encuentras la pared. Los dos se deslizan por ella. Tato exhala por primera vez en una hora. «Gracias. Solo necesitaba escuchar la música desde un poco más lejos».`, `Você acha a parede. Vocês dois escorregam por ela. O Tato expira pela primeira vez em uma hora. «Valeu. Eu só precisava ouvir a música um pouco mais longe».`) }),
    K('care', t(`Hand him your water. "Sip first, then we go."`, `Pasarle tu agua. «Primero un sorbo, luego vamos».`, `Passar sua água. «Primeiro um gole, depois a gente vai».`), { req: { item: 'water' }, do: { item: { water: -1 }, care: 1, bond: { tato: 1 } }, next: null, react: t(`He drinks, looks at the bottle with a quiet kind of love, and says, "I'm going to remember this one."`, `Toma, mira la botella con una especie de amor callado y dice: «Voy a recordar esta».`, `Ele bebe, olha pra garrafa com uma espécie de amor quieto e diz: «Vou lembrar dessa».`) }),
    K('chill', t(`"Ten more minutes, then we'll go. Promise."`, `«Diez minutos más y vamos. Prometido».`, `«Mais dez minutos e a gente vai. Prometo».`), { do: { soc: -1, bond: { tato: -1 } }, next: null, react: t(`He nods, small, polite. You both know ten minutes is not what he asked for. You both pretend.`, `Asiente, chiquito, educado. Los dos saben que diez minutos no es lo que pidió. Los dos fingen.`, `Ele assente, pequeno, educado. Os dois sabem que dez minutos não é o que ele pediu. Os dois fingem.`) })
  ], { zones: ['main', 'attic', 'foyer'] });
  ev('ev_dani_secret', 'dani', MOMENT, t(`DANI: "Don't look. Don't look. Okay look. The lighting technician. The one with the headlamp. I'd marry the headlamp. Is it too early to cry about a stranger's forearms?"`, `DANI: «No mires. No mires. Bueno, mira. El técnico de luces. El de la linterna en la frente. Me casaría con la linterna. ¿Es muy temprano para llorar por los antebrazos de un desconocido?»`, `DANI: «Não olha. Não olha. Tá, olha. O técnico de luz. O da lanterna na testa. Eu casaria com a lanterna. É cedo demais pra chorar pelos antebraços de um estranho?»`), [
    K('chill', t(`"I'll be your wingman. Go."`, `«Seré tu copiloto. Ve».`, `«Eu sou seu ala. Vai».`), { do: { fun: 3, bond: { dani: 1 }, flag: 'dani_wingman' }, next: null, react: t(`Dani straightens his shirt and walks toward the lights like a man toward a sunrise. Whatever happens, you have both decided to be brave tonight.`, `Dani se acomoda la camisa y camina hacia las luces como un hombre hacia el amanecer. Pase lo que pase, los dos decidieron ser valientes esta noche.`, `O Dani ajeita a camisa e caminha em direção às luzes como um homem em direção a um nascer do sol. Aconteça o que acontecer, vocês dois decidiram ser corajosos esta noite.`) }),
    K('joke', t(`"Marry the headlamp. I'll be best person."`, `«Cásate con la linterna. Yo seré el padrino».`, `«Casa com a lanterna. Eu sou o padrinho».`), { do: { fun: 5, bond: { dani: 1 } }, next: null, react: t(`"BEST PERSON. YES." Dani writes it on his arm. You are now the officiant, the best person, and the DJ of a wedding that has not been consented to by the headlamp.`, `«EL PADRINO. SÍ». Dani lo escribe en el brazo. Ahora eres el oficiante, el padrino y el DJ de una boda que la linterna no ha consentido.`, `«O PADRINHO. SIM». O Dani escreve no braço. Agora você é o celebrante, o padrinho e o DJ de um casamento que a lanterna não consentiu.`) }),
    K('care', t(`"Go talk to them. Ask first. Be kind. Be you."`, `«Ve a hablarle. Pregunta primero. Sé amable. Sé tú».`, `«Vai falar com a pessoa. Pergunta primeiro. Seja gentil. Seja você».`), { do: { soc: 2, care: 1, bond: { dani: 2 }, flag: 'dani_wingman' }, next: null })
  ], { zones: ['main', 'attic'], need: 'dani' });
  ev('ev_maru_snack', 'maru', MOMENT, t(`MARU: "I have the last half of a very squashed pastry in my bag. It has been through a lot. Do you want half of the half?"`, `MARU: «Tengo en la mochila la última mitad de un pastelito muy aplastado. Ha pasado por mucho. ¿Quieres la mitad de la mitad?»`, `MARU: «Tenho na bolsa a última metade de um pastel muito amassado. Já passou por muita coisa. Quer metade da metade?»`), [
    K('chill', t(`"Yes. Split it."`, `«Sí. Pártelo».`, `«Sim. Divide».`), { do: { hp: 3, soc: 2, bond: { maru: 1 } }, next: null, react: t(`The pastry is a rumour of a pastry. It is also the best thing you've eaten since midnight. You split a quarter each with enormous ceremony.`, `El pastelito es el rumor de un pastelito. También es lo mejor que comiste desde la medianoche. Reparten un cuarto cada uno con enorme ceremonia.`, `O pastel é o boato de um pastel. Também é a melhor coisa que você comeu desde a meia-noite. Vocês dividem um quarto cada com enorme cerimônia.`) }),
    K('care', t(`"Give it to Tato. He hasn't eaten."`, `«Dáselo a Tato. No comió».`, `«Dá pro Tato. Ele não comeu».`), { req: { with: 'tato' }, do: { care: 1, bond: { maru: 1, tato: 1 } }, next: null }),
    K('chill', t(`"Eat it yourself. You've earned it."`, `«Cómetelo tú. Te lo ganaste».`, `«Come você. Você mereceu».`), { do: { soc: 1, bond: { maru: 1 } }, next: null })
  ], { zones: ['main', 'attic', 'courtyard', 'foyer', 'tunnel'] });
  ev('ev_group_toast', 'maru', MOMENT, t(`MARU: "WATER TOAST. Everyone. Hold up whatever liquid you have. DANI, that's a vape, no. TATO, thank you. To us. To the night. To not losing a shoe."`, `MARU: «BRINDIS CON AGUA. Todos. Levanten el líquido que tengan. DANI, eso es un vapeador, no. TATO, gracias. Por nosotros. Por la noche. Por no perder un zapato».`, `MARU: «BRINDE COM ÁGUA. Todo mundo. Levantem o líquido que tiverem. DANI, isso é um vape, não. TATO, valeu. A nós. À noite. A não perder um sapato».`), [
    K('hug', t(`"TO US!" (Shout it.)`, `«¡POR NOSOTROS!» (Gritarlo.)`, `«A NÓS!» (Gritar.)`), { do: { fun: 6, soc: 3, bond: { maru: 1, dani: 1, tato: 1 }, flag: 'water_toast' }, next: null, react: t(`Four bottles and a vape touch in the air with a sound like a small, honest bell. A stranger raises a cup and joins in. By the second sip it is a cult. It's a very nice cult.`, `Cuatro botellas y un vapeador chocan en el aire con un sonido como una campanita sincera. Un desconocido levanta un vaso y se une. Para el segundo trago es una secta. Es una secta muy agradable.`, `Quatro garrafas e um vape se tocam no ar com um som de sininho honesto. Um estranho levanta um copo e se junta. No segundo gole já é uma seita. É uma seita muito simpática.`) }),
    K('chill', t(`Raise your bottle quietly.`, `Levantar la botella en silencio.`, `Levantar a garrafa em silêncio.`), { do: { fun: 3, soc: 1, bond: { maru: 1 } }, next: null })
  ], { zones: ['main', 'attic', 'courtyard', 'foyer'], need3: true });

  ev('ev_dance_dani', 'dani', MOMENT, t(`DANI grabs both your hands. "COME HERE. I'll lead. No, you lead. No — we BOTH lead. Follow my moves. I have, like, six."`, `DANI te toma las dos manos. «VEN. Yo guío. No, guía tú. No — GUIAMOS los dos. Sigue mis pasos. Tengo, como, seis».`, `O DANI pega suas duas mãos. «VEM. Eu conduzo. Não, você conduz. Não — a gente CONDUZ junto. Segue meus passos. Eu tenho, tipo, seis».`), [
    K('dance', t(`Dance with Dani. Copy his moves.`, `Bailar con Dani. Copiar sus pasos.`, `Dançar com o Dani. Copiar os passos dele.`), { call: 'pd_dani', free: true, next: null }),
    K('chill', t(`"Later. I need a minute."`, `«Después. Necesito un minuto».`, `«Depois. Preciso de um minuto».`), { do: { soc: 1 }, next: null })
  ], { zones: ['main', 'attic', 'courtyard'], need: 'dani' });
  ev('ev_dance_maru', 'maru', MOMENT, t(`MARU, pulling you onto the floor by the sleeve: "Okay. I made up a move. It's called The Elevator. You go up, you go down, you look at me, I look at you. Ready?"`, `MARU, tirándote a la pista de la manga: «Bueno. Inventé un paso. Se llama El Ascensor. Subes, bajas, me miras, te miro. ¿Lista?»`, `A MARU, te puxando pra pista pela manga: «Tá. Eu inventei um passo. Chama O Elevador. Você sobe, você desce, você me olha, eu te olho. Pronto?»`), [
    K('dance', t(`Dance with Maru. Copy her moves.`, `Bailar con Maru. Copiar sus pasos.`, `Dançar com a Maru. Copiar os passos dela.`), { call: 'pd_maru', free: true, next: null }),
    K('chill', t(`"After this song. Promise."`, `«Después de esta canción. Prometido».`, `«Depois dessa música. Prometo».`), { do: { soc: 1 }, next: null })
  ], { zones: ['main', 'attic', 'courtyard'], need: 'maru' });
  ev('ev_dance_tato', 'tato', MOMENT, t(`TATO, very quietly: "Would you dance with me? Slowly? I made up a move. It's mostly swaying. It's very safe."`, `TATO, muy bajito: «¿Bailarías conmigo? ¿Lento? Inventé un paso. Es casi todo balanceo. Es muy seguro».`, `O TATO, bem baixinho: «Você dançaria comigo? Devagar? Eu inventei um passo. É quase tudo balanço. É muito seguro».`), [
    K('dance', t(`Dance with Tato. Copy his moves.`, `Bailar con Tato. Copiar sus pasos.`, `Dançar com o Tato. Copiar os passos dele.`), { call: 'pd_tato', free: true, next: null }),
    K('chill', t(`"Of course, later. Save me a dance."`, `«Claro, después. Resérvame un baile».`, `«Claro, depois. Guarda uma dança pra mim».`), { do: { soc: 1 }, next: null })
  ], { zones: ['main', 'attic', 'courtyard', 'foyer'], need: 'tato' });

  let evT = 150;
  const prevTick = story.tick;
  story.tick = function (dt) {
    if (prevTick) prevTick(dt);
    const s = EM.state; if (!s || s.ended || U.mode !== 'play' || U.D) return;
    evT -= dt;
    if (evT > 0) return;
    evT = 130 + Math.random() * 90;
    if (s.time < 80) return;
    const ok = EV.filter(function (e) {
      if (s.flags['seen_' + e.id]) return false;
      if (e.need3 ? s.party.length < 3 : !L.hasFriend(e.need || e.who)) return false;
      return !e.zones || e.zones.indexOf(s.zone) !== -1;
    });
    if (!ok.length) return;
    const e = EM.pick(ok);
    s.flags['seen_' + e.id] = true;
    U.startDialogue(e.id, { npc: e.who });
  };

  /* ============================================================ A DOZEN THINGS IN THE CORNERS */
  const AMB2 = [
    { z: ['doors'], k: 'good', t: t(`A taxi unloads six people in matching cardigans. They are here for the 'Knitting Rave'. Nobody corrects them. They are going to have a lovely night.`, `Un taxi descarga a seis personas con cárdigan igual. Vienen a la «Knitting Rave». Nadie las corrige. Van a pasar una noche preciosa.`, `Um táxi desembarca seis pessoas de cardigã igual. Elas vieram pra «Knitting Rave». Ninguém corrige. Vão ter uma noite linda.`), d: { fun: 1 } },
    { z: ['foyer'], k: 'info', t: t(`Somebody has built a perfect pyramid of paper cups on the bench. It reads as either a warning or a monument.`, `Alguien armó una pirámide perfecta de vasos de papel sobre el banco. Se lee como una advertencia o como un monumento.`, `Alguém montou uma pirâmide perfeita de copos de papel no banco. Parece um aviso ou um monumento.`) },
    { z: ['main', 'attic'], k: 'good', t: t(`The lights go all-red for one bar and every face in the room turns into a Renaissance painting.`, `Las luces se vuelven rojas por un compás y cada cara de la sala se convierte en un cuadro del Renacimiento.`, `As luzes ficam todas vermelhas por um compasso e cada rosto da sala vira uma pintura renascentista.`), d: { fun: 2 } },
    { z: ['main'], k: 'good', t: t(`A person runs past in a banana costume yelling "CLEAR THE LANE, I'M LATE FOR MY OWN BIRTHDAY." The crowd parts like a sea.`, `Una persona pasa corriendo con disfraz de banana gritando «DESPEJEN EL CARRIL, LLEGO TARDE A MI PROPIO CUMPLEAÑOS». La multitud se abre como un mar.`, `Uma pessoa passa correndo de fantasia de banana gritando «ABRAM CAMINHO, TÔ ATRASADA PRO MEU PRÓPRIO ANIVERSÁRIO». A multidão se abre como um mar.`), d: { fun: 1 } },
    { z: ['restrooms'], k: 'good', t: t(`From behind a stall door, someone sings an aria. The whole queue goes quiet and listens. At the end there is applause, and a small, humbled "thank you."`, `Desde detrás de la puerta de un cubículo, alguien canta un aria. Toda la fila se calla y escucha. Al final hay aplausos y un «gracias» chiquito y humilde.`, `De trás da porta de uma cabine, alguém canta uma ária. A fila inteira fica quieta e escuta. No final tem aplausos e um «obrigado» pequeno e humilde.`), d: { fun: 2, soc: 1 } },
    { z: ['courtyard'], k: 'good', t: t(`Two strangers compare tattoos by phone flashlight. One of them is crying, in the good way.`, `Dos desconocidos comparan tatuajes con la linterna del celular. Uno de ellos llora, de la buena manera.`, `Dois desconhecidos comparam tatuagens com a lanterna do celular. Um deles está chorando, do jeito bom.`), d: { soc: 1 } },
    { z: ['tunnel'], k: 'info', t: t(`The tunnel hums a chord that is not in the music. Everybody stops walking. Somebody whispers, "Do you hear it?" You do.`, `El túnel zumba un acorde que no está en la música. Todos dejan de caminar. Alguien susurra: «¿Lo oyes?» Lo oyes.`, `O túnel zumbe um acorde que não está na música. Todo mundo para de andar. Alguém sussurra: «Você ouve?» Você ouve.`), d: { weird: 1 } },
    { z: ['attic'], k: 'good', t: t(`The DJ drops the pitch by a semitone. Fifty people exhale at the same time like one large, relieved animal.`, `El DJ baja el tono un semitono. Cincuenta personas exhalan al mismo tiempo como un solo animal grande y aliviado.`, `O DJ abaixa o tom em um semitom. Cinquenta pessoas expiram ao mesmo tempo como um animal grande e aliviado.`), d: { fun: 2 } },
    { z: ['darkroom'], k: 'good', t: t(`Someone whispers "thank you" into the dark, unprompted. A second voice, further away, says "you too."`, `Alguien susurra «gracias» a la oscuridad, sin que nadie lo pida. Una segunda voz, más lejos, dice «tú también».`, `Alguém sussurra «obrigado» no escuro, sem ninguém pedir. Uma segunda voz, mais longe, diz «você também».`), d: { soc: 1 } },
    { z: ['welfare'], k: 'info', t: t(`Teo is teaching someone to take a pulse with a laminated card and enormous patience. The someone is, impossibly, taking his.`, `Teo le enseña a alguien a tomar el pulso con una tarjeta laminada y una paciencia enorme. El alguien, de forma imposible, le toma el suyo.`, `O Teo está ensinando alguém a medir o pulso com um cartão plastificado e enorme paciência. A pessoa, impossivelmente, está medindo o dele.`) },
    { z: ['backstage'], k: 'good', t: t(`A cable cracks. The lights stutter. Somebody out front gasps. ÆRIEL, sipping tea, says: "We meant that."`, `Un cable truena. Las luces tartamudean. Alguien al frente se asusta. ÆRIEL, tomando té, dice: «Eso lo hicimos a propósito».`, `Um cabo estala. As luzes gaguejam. Alguém lá na frente se assusta. ÆRIEL, tomando chá, diz: «Isso foi de propósito».`), d: { fun: 1 } },
    { z: ['main', 'foyer', 'courtyard', 'attic', 'tunnel'], k: 'good', t: t(`A stranger offers you a high-five from across the room. You take it. Both of you instantly feel two centimetres taller.`, `Un desconocido te ofrece un choque de manos desde el otro lado de la sala. Lo aceptas. Los dos se sienten al instante dos centímetros más altos.`, `Um desconhecido te oferece um high-five do outro lado da sala. Você aceita. Os dois se sentem na hora dois centímetros mais altos.`), d: { fun: 1 } },
    { z: ['main', 'courtyard', 'foyer'], k: 'info', t: t(`Two people argue passionately about whether a hot dog is a sandwich. A third person sits between them, eating a hot dog, saying nothing.`, `Dos personas discuten con pasión si un hot dog es un sándwich. Una tercera, sentada entre ellas, come un hot dog sin decir nada.`, `Duas pessoas discutem com paixão se um cachorro-quente é um sanduíche. Uma terceira, sentada entre elas, come um cachorro-quente sem dizer nada.`) }
  ];
  let ambT = 80;
  const prev2 = story.tick;
  story.tick = function (dt) {
    if (prev2) prev2(dt);
    const s = EM.state; if (!s || s.ended || U.mode !== 'play') return;
    ambT -= dt;
    if (ambT > 0) return;
    ambT = 75 + Math.random() * 70;
    const pool = AMB2.filter(function (a) { return a.z.indexOf(s.zone) !== -1; });
    if (!pool.length) return;
    const a = EM.pick(pool);
    if (a.d) L.apply(a.d);
    U.toast({ icon: a.k === 'good' ? 'spark' : 'eyes', text: a.t, kind: a.k, ms: 5200 });
  };
})();

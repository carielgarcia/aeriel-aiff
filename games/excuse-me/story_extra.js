/* EXCUSE ME — story extras: callbacks (people you met come back), the birthday table, party-only options,
   and ambient night events. Everything here plugs into the zones and dialogues defined elsewhere. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, E = EM.engine;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story, Z = EM.zones;
  function B(f, n) { const o = {}; o[f] = n; return o; }
  const F = EM.F;

  /* ============================================================ CALLBACK NPCs */
  /* each of these appears later in the night because of what you did earlier */
  Z.courtyard.npc({ id: 'bruno_later', cast: 'bruno', x: 8, y: 9.5, dlg: 'bruno_later', dir: 'r', reach: 16, when: function (s) { return s.time >= 300 && !!(s.flags.bruno_advised || s.flags.bruno_ok || s.flags.bruno_scared) && !s.flags.bruno_later_done; } });
  Z.main.npc({ id: 'sofi_later', cast: 'sofi', x: 10.5, y: 22.5, dlg: 'sofi_later', dir: 'r', reach: 16, when: function (s) { return s.time >= 330 && !!s.flags.sofi_ally && !s.flags.sofi_danced; } });
  Z.foyer.npc({ id: 'broh_later', pair: ['broh', 'sofi'], x: 12, y: 10.5, dlg: 'broh_later', dir: 'd', reach: 22, when: function (s) { return s.time >= 330 && !!(s.flags.broh_friend || s.flags.broh_hostile || s.flags.broh_forgiven || s.flags.broh_ok) && !s.flags.broh_later_done; } });
  Z.attic.npc({ id: 'kiki_later', cast: 'kiki', x: 14.5, y: 20.5, dlg: 'kiki_later', dir: 'r', reach: 16, when: function (s) { return s.time >= 240 && !!(s.flags.kiki_friend || s.flags.kiki_shot) && !s.flags.kiki_later_done; } });
  Z.welfare.npc({ id: 'tobi_later', cast: 'tobi', x: 16, y: 9.5, dlg: 'tobi_later', dir: 'l', reach: 16, when: function (s) { return s.time >= 260 && !!(s.flags.tobi_water || s.flags.tobi_people || s.flags.tobi_hugged || s.flags.tobi_rotated) && !s.flags.tobi_later_done; } });
  Z.courtyard.npc({ id: 'tristan_later', cast: 'tristan', x: 24, y: 6.5, dlg: 'tristan_later', dir: 'd', reach: 16, when: function (s) { return s.time >= 300 && !!(s.flags.tristan_done || s.flags.tristan_slap) && !s.flags.tristan_later_done; } });
  Z.main.npc({ id: 'birthday', ring: ['qpair2', 'stomp4', 'ana'], x: 35.5, y: 18.5, dlg: 'birthday', dir: 'd', reach: 22 });

  D.bruno_later = {
    who: 'bruno', role: T('FIRST TIMER, LATER', 'PRIMERIZO, MÁS TARDE', 'PRIMEIRA VEZ, MAIS TARDE'), start: 'a', nodes: {
      a: {
        branch: [
          { req: { flag: 'bruno_scared' }, to: 'scared' },
          { req: { flag: 'bruno_advised' }, to: 'advised' },
          { req: function () { return true; }, to: 'ok' }
        ]
      },
      advised: {
        text: T('"I ASKED before I touched! A person said YES! I almost cried!" Bruno is glowing like someone who has been to church for the first time and did not hate it. "Thank you. I wrote your advice in my notes. It has a star."', '«¡PREGUNTÉ antes de tocar! ¡Una persona dijo SÍ! ¡Casi lloro!» Bruno brilla como alguien que fue a la iglesia por primera vez y no la odió. «Gracias. Anoté tu consejo en mis notas. Tiene una estrella».', '«Eu PERGUNTEI antes de tocar! Uma pessoa disse SIM! Quase chorei!» O Bruno brilha como quem foi à igreja pela primeira vez e não odiou. «Valeu. Anotei seu conselho nas minhas notas. Tem uma estrela».'),
        do: { flag: 'bruno_later_done', soc: 5, fun: 4 }
      },
      ok: {
        text: T('"I followed the bass! You were right! The bass knows!" He is a little sweaty, a little brave. "I said excuse me eleven times. Eleven. People moved. That is the entire trick."', '«¡Seguí el bajo! ¡Tenías razón! ¡El bajo sabe!» Está un poco sudado, un poco valiente. «Dije con permiso once veces. Once. La gente se movió. Ese es todo el truco».', '«Segui o grave! Você tinha razão! O grave sabe!» Ele está um pouco suado, um pouco corajoso. «Falei com licença onze vezes. Onze. As pessoas se mexeram. Esse é o truque todo».'),
        do: { flag: 'bruno_later_done', soc: 4, fun: 3 }
      },
      scared: {
        text: T('Bruno is sitting under a bench with his knees up. "I\'ve been here for an hour because of you. You said they eat first-timers. I believed you. I\'m very trusting."', 'Bruno está sentado bajo un banco con las rodillas arriba. «Llevo una hora aquí por tu culpa. Dijiste que se comen a los novatos. Te creí. Soy muy confiado».', 'O Bruno está sentado embaixo de um banco com os joelhos pra cima. «Tô aqui faz uma hora por sua causa. Você disse que eles comem os primeira-viagem. Eu acreditei. Sou muito confiante».'),
        choices: [
          { tone: 'sorry', t: T('"I\'m sorry. It was a joke and it wasn\'t funny. You are doing great."', '«Perdón. Era un chiste y no fue gracioso. Lo estás haciendo genial».', '«Desculpa. Era piada e não teve graça. Você tá indo muito bem».'), do: { care: 1, soc: -1, flag: ['bruno_later_done', 'bruno_forgiven'] }, next: null, react: T('He crawls out. "…Okay. Okay! Let\'s go. Is there food?"', 'Sale gateando. «…Ok. ¡Ok! Vamos. ¿Hay comida?»', 'Ele sai engatinhando. «…Tá. Tá! Vamos. Tem comida?»') },
          { tone: 'joke', t: T('"They do eat first-timers. But only the ones under benches."', '«Sí se comen a los novatos. Pero solo a los que están bajo los bancos».', '«Eles comem mesmo. Mas só os que estão embaixo de bancos».'), do: { weird: 2, soc: -2, flag: 'bruno_later_done' }, next: null, bad: true }
        ]
      }
    }
  };

  D.sofi_later = {
    who: 'sofi', role: T('FORTY MINUTES OF FREEDOM', 'CUARENTA MINUTOS DE LIBERTAD', 'QUARENTA MINUTOS DE LIBERDADE'), start: 'a', nodes: {
      a: {
        text: T('"There you are. Forty minutes of air, remember? You said you\'d dance with me. I\'m collecting." Sofi has her hair in a bun and her shoulders have finally come down from her ears.', '«Ahí estás. Cuarenta minutos de aire, ¿recuerdas? Dijiste que bailarías conmigo. Vengo a cobrar». Sofi tiene el pelo en un moño y por fin bajó los hombros de las orejas.', '«Aí está você. Quarenta minutos de ar, lembra? Você disse que ia dançar comigo. Vim cobrar». A Sofi tá com o cabelo em coque e os ombros finalmente desceram das orelhas.'),
        choices: [
          { tone: 'dance', t: T('"Collect. Show me what you\'ve got."', '«Cobra. Muéstrame lo que tienes».', '«Cobra. Mostra o que você tem».'), call: 'sofi_dance', next: null, free: true },
          { tone: 'chill', t: T('"Raincheck? I\'d love to, I\'m just empty right now."', '«¿Otro día? Me encantaría, es que ahora {estoy vacío|estoy vacía|me quedé sin pilas}».', '«Fica pra depois? Eu adoraria, é que agora tô sem nada».'), do: { soc: 1 }, next: null, react: T('"Honest. I respect that. Find me later."', '«Sincero. Lo respeto. Búscame después».', '«Sincero. Respeito. Me acha depois».') }
        ]
      }
    }
  };
  S.sofi_dance = function () {
    U.danceGate({ seq: 'LDRUL', attempts: 2 }, function (res) {
      L.apply({ fun: res === 'win' ? 12 : 5, soc: res === 'fail' ? -1 : 3, flag: 'sofi_danced' });
      U.toast({ icon: 'star', text: res === 'win' ? T('Sofi dances like somebody who finally has the whole floor. Broh is going to hear about this and be proud.', 'Sofi baila como alguien que por fin tiene toda la pista. Broh se va a enterar y estará orgulloso.', 'A Sofi dança como quem finalmente tem a pista toda. O Broh vai ficar sabendo e vai se orgulhar.') : T('A little clumsy. Entirely joyful. Sofi laughs the whole time.', 'Un poco torpe. Totalmente alegre. Sofi se ríe todo el tiempo.', 'Um pouco desajeitado. Totalmente alegre. A Sofi ri o tempo todo.'), kind: 'good' });
    });
  };

  D.broh_later = {
    who: 'broh', role: T('BROH, LATER', 'BROH, MÁS TARDE', 'BROH, MAIS TARDE'), start: 'a', nodes: {
      a: {
        branch: [
          { req: { flag: 'broh_forgiven' }, to: 'forgiven' },
          { req: { flag: 'broh_hostile' }, to: 'hostile' },
          { req: function () { return true; }, to: 'friend' }
        ]
      },
      friend: {
        text: T('Broh and Sofi are sharing a bench, an almost-empty water bottle between them. "Bro. We\'re good. She said I\'m learning. I\'m learning!" Sofi pats his knee like a trainer. "He\'s learning. Slowly. It\'s sweet."', 'Broh y Sofi comparten un banco, una botella de agua casi vacía entre ellos. «Bro. Estamos bien. Ella dice que estoy aprendiendo. ¡Estoy aprendiendo!» Sofi le palmea la rodilla como una entrenadora. «Está aprendiendo. Despacio. Es dulce».', 'O Broh e a Sofi dividem um banco, uma garrafa d\'água quase vazia entre eles. «Mano. A gente tá bem. Ela disse que eu tô aprendendo. Eu tô aprendendo!» A Sofi dá tapinhas no joelho dele como treinadora. «Ele tá aprendendo. Devagar. É fofo».'),
        do: { flag: 'broh_later_done', soc: 4, fun: 2 }
      },
      forgiven: {
        text: T('"Hey. You." Broh lifts a chin. "No hard feelings. For real. Sofi told me what I was doing. I\'m working on it." It costs him something to say. He says it anyway.', '«Eh. Tú». Broh levanta el mentón. «Sin rencores. En serio. Sofi me dijo lo que estaba haciendo. Estoy trabajando en eso». Le cuesta decirlo. Lo dice igual.', '«Ei. Você». O Broh levanta o queixo. «Sem ressentimento. Sério. A Sofi me disse o que eu tava fazendo. Tô trabalhando nisso». Custa pra ele dizer. Ele diz mesmo assim.'),
        do: { flag: 'broh_later_done', soc: 5, fun: 3 }
      },
      hostile: {
        text: T('Broh sees you across the foyer and stops mid-sentence. "Don\'t. Just don\'t." Sofi looks at you, at him, at you, and shrugs a very small apology with one shoulder.', 'Broh te ve al otro lado del foyer y se queda a mitad de frase. «No. Simplemente no». Sofi te mira, lo mira, te mira, y encoge un hombro en una disculpa muy pequeña.', 'O Broh te vê do outro lado do foyer e para no meio da frase. «Não. Simplesmente não». A Sofi te olha, olha ele, olha você, e dá de ombros uma desculpa bem pequena com um ombro só.'),
        choices: [
          { tone: 'sorry', t: T('"I was out of line. I\'m sorry. I mean it."', '«Me pasé. Perdón. Lo digo en serio».', '«Passei do limite. Desculpa. Falo sério».'), do: { flag: ['broh_later_done', 'broh_forgiven'], unflag: 'broh_hostile', soc: -1, fun: 2 }, next: null, react: T('He lets out a breath he has been holding for two hours. "…Okay. Thanks, man."', 'Suelta un aire que llevaba dos horas aguantando. «…Ok. Gracias, hermano».', 'Ele solta um ar que tava segurando faz duas horas. «…Tá. Valeu, mano».') },
          { tone: 'silent', t: T('Nod and keep your distance.', 'Asentir y mantener la distancia.', 'Assentir e manter a distância.'), do: { soc: -1, flag: 'broh_later_done' }, next: null }
        ]
      }
    }
  };

  D.kiki_later = {
    who: 'kiki', role: T('KIKI, LATER', 'KIKI, MÁS TARDE', 'KIKI, MAIS TARDE'), start: 'a', nodes: {
      a: {
        branch: [
          { req: { flag: 'kiki_friend' }, to: 'water' },
          { req: function () { return true; }, to: 'floor' }
        ]
      },
      water: {
        text: T('"WATER!" Kiki shouts across the dancefloor, holding up a bottle like a trophy. "I\'m drinking WATER. All of it! You\'re my favourite person in the whole queue, and the queue is now this entire building." She dances to a beat that is almost the beat.', '«¡AGUA!» grita Kiki a través de la pista, levantando una botella como un trofeo. «¡Estoy tomando AGUA! ¡Toda! Eres mi persona favorita de toda la fila, y la fila ahora es este edificio entero». Baila a un ritmo que casi es el ritmo.', '«ÁGUA!» grita a Kiki atravessando a pista, erguendo uma garrafa feito troféu. «Tô bebendo ÁGUA. Toda! Você é minha pessoa favorita de toda a fila, e a fila agora é esse prédio inteiro». Ela dança num ritmo que quase é o ritmo.'),
        do: { flag: 'kiki_later_done', fun: 5, soc: 4 }
      },
      floor: {
        text: T('Kiki is sitting on the floor of Sala 2 giggling at her own shoes, the thermos tipped over next to her. "They\'re so GOOD. Look at them. The shoes! They keep ON going." Her lipstick is smeared in a way that suggests a very happy accident.', 'Kiki está sentada en el piso de la Sala 2 riéndose de sus propios zapatos, con el termo volcado a su lado. «Son tan BUENOS. Mira. ¡Los zapatos! SIGUEN y siguen». Tiene el labial corrido de una manera que sugiere un accidente muy feliz.', 'A Kiki está sentada no chão da Sala 2 rindo dos próprios sapatos, a térmica tombada do lado. «Eles são tão BONS. Olha. Os sapatos! Eles CONTINUAM e continuam». O batom tá borrado de um jeito que sugere um acidente muito feliz.'),
        choices: [
          { tone: 'care', t: T('Sit with her. Water if you have it.', 'Sentarte con ella. Agua si tienes.', 'Sentar com ela. Água se tiver.'), req: { item: 'water' }, do: { item: { water: -1 }, care: 1, time: 10, flag: ['kiki_later_done', 'kiki_helped'] }, next: null, react: T('She drinks, blinks, looks at you, and says, very clearly: "I love you. I\'m okay. Don\'t tell anybody." You tell nobody.', 'Toma, parpadea, te mira, y dice, muy claramente: «Te quiero. Estoy bien. No le digas a nadie». No le dices a nadie.', 'Ela bebe, pisca, te olha, e diz, bem claramente: «Eu te amo. Tô bem. Não conta pra ninguém». Você não conta pra ninguém.') },
          { tone: 'care', t: T('Sit with her anyway. No water, just company.', 'Sentarte con ella igual. Sin agua, solo compañía.', 'Sentar com ela mesmo assim. Sem água, só companhia.'), do: { care: 1, time: 10, soc: -1, flag: ['kiki_later_done', 'kiki_helped'] }, next: null },
          { tone: 'joke', t: T('"Admire the shoes with her."', '«Admirar los zapatos con ella».', '«Admirar os sapatos com ela».'), do: { fun: 3, flag: 'kiki_later_done' }, next: null }
        ]
      }
    }
  };

  D.tobi_later = {
    who: 'tobi', role: T('TOBI, LATER', 'TOBI, MÁS TARDE', 'TOBI, MAIS TARDE'), start: 'a', nodes: {
      a: {
        text: T('Tobi is sitting up on a mattress with a blanket across his knees, looking at you with the very clear eyes of a man who has returned from far away. "You\'re — you\'re the good door. The good door from the speakers." He grins. "Thank you. I\'m Tobi. We were not formally introduced."', 'Tobi está sentado en un colchón con una manta sobre las rodillas, mirándote con los ojos muy claros de un hombre que volvió de muy lejos. «Tú eres — eres la buena puerta. La buena puerta de los parlantes». Sonríe. «Gracias. Soy Tobi. No nos presentaron formalmente».', 'O Tobi tá sentado num colchão com um cobertor nos joelhos, te olhando com os olhos bem claros de um homem que voltou de muito longe. «Você é — você é a boa porta. A boa porta das caixas». Ele sorri. «Valeu. Eu sou o Tobi. A gente não foi apresentado formalmente».'),
        do: { flag: 'tobi_later_done', soc: 5, fun: 3, care: 0 }
      }
    }
  };

  D.tristan_later = {
    who: 'tristan', role: T('TRISTAN, LATER', 'TRISTAN, MÁS TARDE', 'TRISTAN, MAIS TARDE'), start: 'a', nodes: {
      a: {
        branch: [
          { req: { flag: 'tristan_slap' }, to: 'slap' },
          { req: function () { return true; }, to: 'asked' }
        ]
      },
      slap: {
        text: T('Tristan has a very visible dent in his pride and a phone with a cracked corner. "I\'m not going to post it. I\'m just going to remember it." He taps the crack with a thumb. "It\'s a decent reminder."', 'Tristan tiene una abolladura muy visible en el orgullo y un celular con una esquina rota. «No lo voy a subir. Solo lo voy a recordar». Golpea la grieta con el pulgar. «Es un recordatorio decente».', 'O Tristan tem uma amassado bem visível no orgulho e um celular com um canto quebrado. «Não vou postar. Só vou lembrar». Ele toca a rachadura com o polegar. «É um lembrete decente».'),
        do: { flag: 'tristan_later_done', soc: -1 }
      },
      asked: {
        text: T('"Hey! I asked a girl first. She said yes. It was a better video." He shows you an extremely good eleven seconds of a stranger laughing under a fire barrel, the kind of footage that has permission built into it. "Asking is the whole aesthetic. Who knew."', '«¡Eh! Le pregunté a una chica primero. Dijo que sí. Fue un mejor video». Te muestra once segundos extremadamente buenos de una desconocida riendo bajo un barril de fuego, del tipo de material que lleva el permiso incluido. «Preguntar es toda la estética. Quién diría».', '«Ei! Perguntei pra uma moça primeiro. Ela disse sim. Foi um vídeo melhor». Ele te mostra onze segundos extremamente bons de uma desconhecida rindo embaixo de um barril de fogo, o tipo de imagem que já vem com a permissão. «Perguntar é toda a estética. Quem diria».'),
        do: { flag: 'tristan_later_done', soc: 4, fun: 3 }
      }
    }
  };

  D.birthday = {
    who: 'qpair2', role: T('BIRTHDAY', 'CUMPLEAÑOS', 'ANIVERSÁRIO'), start: 'a', nodes: {
      a: {
        text: T('"IT\'S CLARA\'S BIRTHDAY! SHE\'S THIRTY! SHE\'S DYING!" Three people around a girl with a paper crown. A tray of shots appears like a miracle. "A shot with Clara! A SHOT WITH CLARA!"', '«¡ES EL CUMPLEAÑOS DE CLARA! ¡CUMPLE TREINTA! ¡SE MUERE!» Tres personas alrededor de una chica con una corona de papel. Una bandeja de shots aparece como un milagro. «¡Un shot con Clara! ¡UN SHOT CON CLARA!»', '«É ANIVERSÁRIO DA CLARA! ELA FAZ TRINTA! ELA TÁ MORRENDO!» Três pessoas em volta de uma moça com uma coroa de papel. Uma bandeja de shots aparece feito milagre. «Um shot com a Clara! UM SHOT COM A CLARA!»'),
        choices: [
          { tone: 'yes', t: T('Take a shot with Clara.', 'Tomar un shot con Clara.', 'Tomar um shot com a Clara.'), do: { drink: 1.5, fun: 4, soc: 3, flag: 'clara_shot' }, next: 'again', react: T('The shot is something sweet and violent. Clara kisses both your cheeks with the confidence of a woman who is now thirty.', 'El shot es algo dulce y violento. Clara te besa las dos mejillas con la confianza de una mujer que ahora tiene treinta.', 'O shot é algo doce e violento. A Clara beija suas duas bochechas com a confiança de uma mulher que agora tem trinta.') },
          { tone: 'chill', t: T('"Happy birthday, Clara! I\'ll toast with water."', '«¡Feliz cumpleaños, Clara! Brindo con agua».', '«Feliz aniversário, Clara! Eu brindo com água».'), do: { soc: 4, fun: 3, flag: 'clara_water' }, next: null, react: T('Clara looks at the bottle, then at you, then lifts it like it is champagne. "TO WATER! TO THIRTY!" Everyone cheers louder than they did for the shot.', 'Clara mira la botella, luego a ti, luego la levanta como si fuera champán. «¡POR EL AGUA! ¡POR LOS TREINTA!» Todos aplauden más fuerte que por el shot.', 'A Clara olha a garrafa, depois você, depois ergue como se fosse champanhe. «PELA ÁGUA! PELOS TRINTA!» Todo mundo comemora mais alto do que pelo shot.') },
          { tone: 'joke', t: T('"Thirty? You look twenty-nine and a half."', '«¿Treinta? Pareces de veintinueve y medio».', '«Trinta? Você parece ter vinte e nove e meio».'), do: { fun: 3, soc: 2 }, next: null }
        ]
      },
      again: {
        text: T('"ANOTHER ONE! The second one is for luck!" They are holding the tray at you with total love and zero concern for your liver.', '«¡OTRO! ¡El segundo es por la suerte!» Te sostienen la bandeja con amor total y cero preocupación por tu hígado.', '«OUTRO! O segundo é pra dar sorte!» Eles seguram a bandeja pra você com amor total e zero preocupação com seu fígado.'),
        choices: [
          { tone: 'yes', t: T('"For luck!" Take the second shot.', '«¡Por la suerte!» Tomar el segundo shot.', '«Pra dar sorte!» Tomar o segundo shot.'), do: { drink: 1.5, fun: 3, soc: 2 }, next: null },
          { tone: 'chill', t: T('"One is a miracle. Two is a story. I\'m keeping the miracle."', '«Uno es un milagro. Dos son una historia. Me quedo con el milagro».', '«Um é um milagre. Dois é uma história. Fico com o milagre».'), do: { soc: 3 }, next: null, react: T('They applaud your restraint like it is a magic trick.', 'Aplauden tu moderación como si fuera un truco de magia.', 'Eles aplaudem sua moderação como se fosse truque de mágica.') }
        ]
      }
    }
  };

  /* ============================================================ PARTY-ONLY OPTIONS */
  (function () {
    const broh = D.broh1.nodes.a.choices;
    broh.splice(3, 0, { tone: 'joke', t: T('(Dani, loudly) "BRO! You have the BEST shoulders in this room!"', '(Dani, fuerte) «¡BRO! ¡Tienes los MEJORES hombros de la sala!»', '(Dani, alto) «MANO! Você tem os MELHORES ombros da sala!»'), req: { with: 'dani' }, do: { open: 'broh', flag: ['broh_friend', 'dani_broh'], fun: 4, bond: B('dani', 1) }, next: null, react: T('Broh goes the colour of a very good tomato and loosens his hold on Sofi to adjust his cap. "…Bro. Thanks?" Sofi looks at Dani with open admiration. Gap achieved.', 'Broh se pone del color de un tomate muy bueno y afloja el agarre de Sofi para acomodarse la gorra. «…Bro. ¿Gracias?» Sofi mira a Dani con admiración abierta. Hueco conseguido.', 'O Broh fica da cor de um tomate muito bom e afrouxa o aperto na Sofi pra ajeitar o boné. «…Mano. Valeu?» A Sofi olha pro Dani com admiração aberta. Brecha aberta.') });
    const tobi = D.tobi.nodes.a.choices;
    tobi.push({ icon: 'hug', t: T('Let Tato take over: he kneels and speaks very softly to Tobi', 'Dejar que Tato se encargue: se arrodilla y le habla muy suave a Tobi', 'Deixar o Tato assumir: ele se ajoelha e fala bem baixinho com o Tobi'), req: { with: 'tato' }, do: { care: 1, open: 'tobi', bond: B('tato', 2), flag: 'tobi_tato' }, next: null, react: T('Tato is better at this than anyone has ever been. Within a minute Tobi has nodded, blinked, and wandered gently off. Tato stands up looking a little taller. "I know that feeling," he says.', 'Tato lo hace mejor que nadie. En un minuto Tobi ha asentido, parpadeado y se ha ido caminando con suavidad. Tato se pone de pie un poco más alto. «Conozco esa sensación», dice.', 'O Tato faz isso melhor do que qualquer um. Em um minuto o Tobi assentiu, piscou e saiu andando com delicadeza. O Tato se levanta um pouco mais alto. «Conheço essa sensação», diz.') });
    const rosa = D.rosa_confront.nodes.a.choices;
    rosa.push({ tone: 'smooth', t: T('(Maru steps forward) "Rosa, I apologise. Also, your hair is incredible."', '(Maru da un paso) «Rosa, me disculpo. Además, tu pelo es increíble».', '(A Maru dá um passo) «Rosa, peço desculpas. Aliás, seu cabelo é incrível».'), req: { with: 'maru' }, do: { bond: B('maru', 1), soc: 1 }, next: 'warm' });
    const host = D.host.nodes.a.choices;
    host.push({ tone: 'smooth', t: T('(Maru) "I will name my first child after you."', '(Maru) «Voy a ponerle tu nombre a mi primer hijo».', '(Maru) «Vou dar o seu nome ao meu primeiro filho».'), req: { with: 'maru' }, do: { bond: B('maru', 1), fun: 2 }, next: 'charm_check' });
  })();

  /* ============================================================ AMBIENT NIGHT EVENTS */
  const AMB = [
    { z: ['main', 'attic'], t: T('The bass drops out for two bars. The whole room screams in unison. It comes back like a wave hitting a wall.', 'El bajo se corta por dos compases. Todo el cuarto grita al unísono. Vuelve como una ola contra un muro.', 'O grave cai por dois compassos. A sala inteira grita em uníssono. Volta feito onda batendo numa parede.'), d: { fun: 2 }, k: 'good' },
    { z: ['main', 'foyer', 'courtyard'], t: T('A stranger gives you a sticker that says ASK FIRST. You put it on your phone. It looks right there.', 'Un desconocido te da una pegatina que dice PREGUNTA PRIMERO. La pegas en tu celular. Se ve bien ahí.', 'Um desconhecido te dá um adesivo que diz PERGUNTE PRIMEIRO. Você cola no celular. Fica bem ali.'), d: { soc: 1, fun: 1 }, k: 'good' },
    { z: ['main', 'foyer', 'attic', 'courtyard'], t: T('A stranger high-fives you and disappears into the crowd. You will never know their name. You never need to.', 'Un desconocido te choca los cinco y desaparece entre la gente. Nunca sabrás su nombre. No hace falta.', 'Um desconhecido bate na sua mão e desaparece na multidão. Você nunca vai saber o nome. Não precisa.'), d: { fun: 2 }, k: 'good' },
    { z: ['main', 'foyer', 'attic', 'courtyard', 'restrooms'], t: T('Your phone buzzes: "where r u" x14. It is at 6%. You decide the answer is "here".', 'Tu celular vibra: «dónde estás» x14. Está al 6%. Decides que la respuesta es «aquí».', 'Seu celular vibra: «cadê você» x14. Tá com 6%. Você decide que a resposta é «aqui».'), d: {}, k: 'info' },
    { z: ['main'], t: T('A fog machine fires. You lose your friends for ten seconds and find them again by their laughter.', 'Se dispara la máquina de humo. Pierdes a tus amigos diez segundos y los encuentras por su risa.', 'A máquina de fumaça dispara. Você perde os amigos por dez segundos e acha eles pela risada.'), d: { fun: 1 }, k: 'info' },
    { z: ['restrooms'], t: T('The queue spontaneously starts complimenting each other\'s eyeliner. Someone cries at "your jacket is a miracle". This is love.', 'La fila empieza a elogiar el delineado de los demás. Alguien llora con «tu chaqueta es un milagro». Esto es amor.', 'A fila começa a elogiar o delineado dos outros. Alguém chora com «sua jaqueta é um milagre». Isso é amor.'), d: { soc: 2 }, k: 'good' },
    { z: ['courtyard'], t: T('Someone in a bathrobe is explaining astrology to the cat. The cat is not convinced. Neither are you, but you listen.', 'Alguien en bata explica astrología al gato. El gato no está convencido. Tú tampoco, pero escuchas.', 'Alguém de roupão explica astrologia pro gato. O gato não está convencido. Você também não, mas escuta.'), d: { soc: 2, fun: 1 }, k: 'good' },
    { z: ['tunnel'], t: T('Your footsteps echo half a second late. You check behind you. Nobody. Probably.', 'Tus pasos hacen eco medio segundo tarde. Miras atrás. Nadie. Probablemente.', 'Seus passos ecoam meio segundo atrasados. Você olha atrás. Ninguém. Provavelmente.'), d: { fun: 1 }, k: 'info' },
    { z: ['foyer'], t: T('A pigeon has entered the foyer. Nobody questions it. The coat check kid gives it a ticket.', 'Una paloma entró al foyer. Nadie lo cuestiona. El chico del guardarropa le da un ticket.', 'Um pombo entrou no foyer. Ninguém questiona. O menino da chapelaria dá uma ficha pra ele.'), d: { fun: 2 }, k: 'good' },
    { z: ['main', 'foyer', 'courtyard', 'attic'], t: T('Someone offers you half a sandwich with no explanation. It is the best sandwich of your life.', 'Alguien te ofrece medio sándwich sin explicación. Es el mejor sándwich de tu vida.', 'Alguém te oferece meio sanduíche sem explicação. É o melhor sanduíche da sua vida.'), d: { hp: 2, fun: 1 }, k: 'good' },
    { z: ['main', 'attic'], t: T('Glitter cannon, somewhere. You will be finding glitter in your hair for the next three weeks.', 'Un cañón de glitter, en algún lugar. Vas a encontrar glitter en tu pelo las próximas tres semanas.', 'Canhão de glitter, em algum lugar. Você vai achar glitter no cabelo pelas próximas três semanas.'), d: { fun: 2 }, k: 'good' },
    { z: ['main', 'foyer', 'courtyard'], t: T('Blue light sweeps the room. Security passes in a calm line. You feel inexplicably noticed.', 'Una luz azul recorre el cuarto. Seguridad pasa en una fila tranquila. Sientes una mirada tranquila encima, sin explicación.', 'Uma luz azul varre a sala. A segurança passa numa fila calma. Você sente um olhar tranquilo em cima de você, sem explicação.'), d: { weird: 1 }, k: 'info', min: { weird: 40 } },
    { z: ['courtyard', 'foyer'], t: T('A cigarette goes out on the wind. Somebody laughs. Somebody lends somebody a lighter. Everything is going to be fine.', 'Un cigarrillo se apaga con el viento. Alguien se ríe. Alguien le presta un encendedor a otro. Todo va a estar bien.', 'Um cigarro apaga com o vento. Alguém ri. Alguém empresta um isqueiro pra outro. Tudo vai ficar bem.'), d: { soc: 2 }, k: 'good' },
    { z: ['main', 'attic'], t: T('The DJ changes tracks mid-phrase and the whole room breathes in like one animal.', 'El DJ cambia de tema a mitad de frase y toda la sala inhala como un solo animal.', 'O DJ troca de faixa no meio da frase e a sala inteira inspira feito um bicho só.'), d: { fun: 3 }, k: 'good' },
    { z: ['welfare'], t: T('Somebody has drawn a tiny sun on the wall above the mattresses, with a marker, with great care.', 'Alguien dibujó un solcito en la pared sobre los colchones, con marcador, con mucho cuidado.', 'Alguém desenhou um solzinho na parede acima dos colchões, com marcador, com muito cuidado.'), d: { soc: 2 }, k: 'good' },
    { z: ['darkroom'], t: T('From the dark, someone says "you\'re doing great" to nobody in particular. It lands on everybody.', 'Desde la oscuridad, alguien dice «lo estás haciendo genial» a nadie en particular. Cae sobre todos.', 'Do escuro, alguém diz «você tá indo muito bem» pra ninguém em particular. Cai em cima de todo mundo.'), d: { soc: 2 }, k: 'good' }
  ];
  let ambT = 70;
  const prevTick = story.tick;
  story.tick = function (dt) {
    if (prevTick) prevTick(dt);
    const s = EM.state; if (!s) return;
    ambT -= dt;
    if (ambT > 0) return;
    ambT = 70 + Math.random() * 60;
    const pool = AMB.filter(function (a) { return a.z.indexOf(s.zone) !== -1 && (!a.min || L.req({ min: a.min })); });
    if (!pool.length) return;
    const a = EM.pick(pool);
    if (a.d) L.apply(a.d);
    U.toast({ icon: a.k === 'good' ? 'spark' : 'eyes', text: a.t, kind: a.k, ms: 5200 });
  };
})();

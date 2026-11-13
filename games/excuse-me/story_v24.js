/* EXCUSE ME — story v24: fifteen new people, part two. The five flirts. Every one reads something in your pockets
   (story_v23's READS), has its own refusal line, and a no is a complete answer that costs nothing:
   SOLEDAD (the long look, sunglasses), KAZ (argues to flirt, gum), ODALYS (dances alone, water),
   BART (bad at flirting, earplugs), TILDA (bad at flirting, rings). Rewards: the Paperback, Kaz's Tin, the Hand Fan,
   the Laminated Line and the Blister Plasters. */
'use strict';
(function () {
  const EM = window.EM;
  const T = EM.T, L = EM.logic, U = EM.ui, Z = EM.zones;
  const D = EM.DIALOGUES, S = EM.scripts, story = EM.story;
  const t = function (en, es, pt) { return T(en, es, pt); };
  const K = function (tone, tx, o) { return Object.assign({ tone: tone, t: tx }, o || {}); };
  const LEAVE = function () { return K('chill', t(`"Later."`, `«Después».`, `«Depois».`), { free: true, next: null }); };
  const I = EM.i23, IT = EM.items16;
  const look = function (o) { return Object.assign({ skin: 2, hair: 2, hc: 0, expr: 1, top: 0, tc: 1, bottom: 1, bc: 1, acc: 0, wide: false }, o); };
  const win = function (a, b) { return function (s) { return s.time >= a && s.time <= b; }; };
  const n = function (s, p) { return [1, 2, 3].filter(function (k) { return s.flags[p + k]; }).length; };

  /* the shape every flirt shares: a refusal that is a complete answer, and an ask that rolls once */
  function shell(id, role, again, nodes) {
    D[id] = {
      who: id, role: role, start: 's', nodes: Object.assign({
        s: { branch: [{ req: function (s) { return !!(s.flopAt && s.flopAt[id] !== undefined && s.time - s.flopAt[id] < 45); }, to: 'again' }, { req: function (s) { return !!s.flags[id + '_hub']; }, to: 'hub' }, { req: function () { return true; }, to: 'a' }] },
        again: {
          text: again, choices: [
            K('care', t(`"Okay. Thank you for saying it plainly."`, `«Está bien. Gracias por decirlo claro».`, `«Tá bem. Valeu por dizer com clareza».`), { free: true, do: { soc: 1 }, next: null }),
            K('makeout', t(`Ask again anyway.`, `Preguntar otra vez igual.`, `Perguntar de novo mesmo assim.`), { call: 'push_' + id, free: true, next: null })
          ]
        }
      }, nodes)
    };
    S['push_' + id] = function () { L.pushy(id); };
  }
  function ask(id, text, go, tiers) {
    const prev = [];
    const opts = tiers.map(function (r) {
      const before = prev.slice(); prev.push(r[0]);
      return K('makeout', go, { req: function (s) { return r[0](s) && !before.some(function (b) { return b(s); }); }, do: { makeout: { p: r[1], time: 7, who: id } }, next: null });
    });
    return {
      text: function () { const tl = EM.flirtTell && EM.flirtTell(id); return tl ? [text, tl] : text; },
      choices: opts.concat([
        K('chill', t(`"No pressure. Thanks for being honest."`, `«Sin presión. Gracias por decírmelo».`, `«Sem pressão. Valeu por me dizer».`), { free: true, do: { soc: 1 }, next: null })
      ])
    };
  }
  const any = function () { return true; };
  const ASK = t(`Ask: "Would you like to kiss me?"`, `Preguntar: «¿Te gustaría besarme?»`, `Perguntar: «Você gostaria de me beijar?»`);

  /* ============================================================ 11. SOLEDAD, the long look (attic) */
  EM.CAST.soledad = { name: 'SOLEDAD', look: look({ skin: 3, hair: 6, hc: 3, expr: 4, top: 6, tc: 1, bottom: 3, bc: 1, acc: 0 }) };
  const SOL_Q = [
    { q: t(`"What are you avoiding tonight?"`, `«¿Qué estás evitando esta noche?»`, `«O que você tá evitando hoje?»`),
      h: t(`"A conversation I owe somebody. I keep dancing past it."`, `«Una conversación que le debo a alguien. Sigo bailando para esquivarla».`, `«Uma conversa que devo a alguém. Eu continuo dançando pra desviar».`),
      j: t(`"Gravity. It's going badly."`, `«La gravedad. Me va mal».`, `«A gravidade. Tá indo mal».`),
      l: t(`"Nothing. I'm avoiding nothing. I'm extremely here."`, `«Nada. No evito nada. Estoy muy presente».`, `«Nada. Não tô evitando nada. Tô muito presente».`) },
    { q: t(`"Who would you call at six?"`, `«¿A quién llamarías a las seis?»`, `«Pra quem você ligaria às seis?»`),
      h: t(`"My sister. She'd pick up and not ask anything. That's why."`, `«A mi hermana. Contestaría y no preguntaría nada. Por eso».`, `«Minha irmã. Ela atenderia e não perguntaria nada. É por isso».`),
      j: t(`"The pizza place. They're open."`, `«La pizzería. Está abierta».`, `«A pizzaria. Tá aberta».`),
      l: t(`"Nobody. I'm very independent."`, `«A nadie. Soy muy independiente».`, `«Ninguém. Sou muito independente».`) },
    { q: t(`"What would you do if nobody was watching?"`, `«¿Qué harías si nadie mirara?»`, `«O que você faria se ninguém estivesse olhando?»`),
      h: t(`"Sit on the floor of this room and cry a little. Then dance."`, `«Me sentaría en el piso de esta sala y lloraría un poco. Luego bailaría».`, `«Sentaria no chão dessa sala e choraria um pouco. Depois dançaria».`),
      j: t(`"Learn the moonwalk. I'm told it's not a good idea."`, `«Aprendería el moonwalk. Dicen que no es buena idea».`, `«Aprenderia o moonwalk. Dizem que não é boa ideia».`),
      l: t(`"Exactly what I do when people are watching. I'm consistent."`, `«Exactamente lo que hago cuando miran. Soy consistente».`, `«Exatamente o que faço quando olham. Sou consistente».`) }
  ];
  const solQ = function (i) {
    const q = SOL_Q[i - 1], nx = i < 3 ? 'q' + (i + 1) : 'verdict';
    return {
      text: [i === 1 ? t(`She doesn't blink. "Three questions. I won't answer any. You go first."`, `No parpadea. «Tres preguntas. No contesto ninguna. Tú primero».`, `Ela não pisca. «Três perguntas. Eu não respondo nenhuma. Você primeiro».`) : (i === 2 ? t(`She nods, slowly. "Number two."`, `Asiente despacio. «Número dos».`, `Ela assente devagar. «Número dois».`) : t(`She nods again. "Number three. The last."`, `Vuelve a asentir. «Número tres. La última».`, `Ela assente de novo. «Número três. A última».`)), q.q],
      choices: [
        K('honest', q.h, { do: { soc: -2, flag: 'sol_h' + i }, next: nx, react: t(`She says nothing for a while. "Thank you. That is not the answer people usually give."`, `No dice nada durante un rato. «Gracias. No es la respuesta que suele dar la gente».`, `Ela fica um tempo sem dizer nada. «Obrigada. Não é a resposta que as pessoas costumam dar».`) }),
        K('joke', q.j, { do: { fun: 3, flag: 'sol_j' + i }, next: nx, react: t(`The corner of her mouth moves. "Noted. Evasive, but funny."`, `Se le mueve una comisura de la boca. «Anotado. Evasivo, pero gracioso».`, `O canto da boca dela se mexe. «Anotado. Evasivo, mas engraçado».`) }),
        K('lie', q.l, { do: { weird: 2, flag: 'sol_l' + i }, next: nx, react: t(`She tilts her head. "You said that quickly." That is all she says.`, `Ladea la cabeza. «Lo dijiste rápido». Eso es todo lo que dice.`, `Ela inclina a cabeça. «Você disse isso rápido». É só isso que ela diz.`) })
      ]
    };
  };
  shell('soledad', t('THE LONG LOOK', 'LA MIRADA LARGA', 'O OLHAR LONGO'),
    t(`Soledad shakes her head, unhurried. "No. I like you more now that I've said it. Not again tonight."`, `Soledad niega con la cabeza, sin prisa. «No. Me gustas más ahora que lo dije. Esta noche no más».`, `A Soledad nega com a cabeça, sem pressa. «Não. Gosto mais de você agora que disse. Hoje não de novo».`), {
      a: {
        text: t(`A woman on the attic bench, watching the floor and then, for a while, you. "I look at people for a while before I say anything. It's rude. I'm told I should apologise."`, `Una mujer en la banca del ático, mirando la pista y luego, un buen rato, a ti. «Miro a la gente un rato antes de decir algo. Es de mala educación. Me dicen que debería disculparme».`, `Uma mulher no banco do sótão, olhando a pista e depois, por um tempo, você. «Eu olho pras pessoas um tempo antes de dizer qualquer coisa. É rude. Me dizem que eu deveria pedir desculpa».`),
        choices: [
          K('chill', t(`Look back at her.`, `Mirarla de vuelta.`, `Olhar de volta.`), { free: true, next: 'sunchk' }),
          K('chill', t(`"Don't apologise."`, `«No te disculpes».`, `«Não peça desculpa».`), { do: { soc: 1 }, next: 'sunchk' }),
          LEAVE()
        ]
      },
      sunchk: { branch: [{ req: function (s) { return IT.sun(s); }, to: 'sun' }, { req: any, to: 'q1' }] },
      sun: {
        text: t(`She reaches up and stops with her hand an inch from your face. "Take them off. I'd like to see what you're agreeing to."`, `Levanta la mano y se detiene a un centímetro de tu cara. «Quítatelos. Quiero ver a qué estás diciendo que sí».`, `Ela levanta a mão e para a um centímetro do seu rosto. «Tira. Quero ver a que você tá dizendo sim».`),
        choices: [
          K('care', t(`Take the sunglasses off.`, `Quitarte los lentes.`, `Tirar os óculos.`), { call: 'sol_sun_off', free: true, next: 'q1' }),
          K('chill', t(`Keep them on.`, `Dejártelos puestos.`, `Ficar com eles.`), { do: { flag: 'sol_kept' }, next: 'q1', react: t(`"Alright." She says it kindly, and writes it down somewhere behind her eyes.`, `«Está bien». Lo dice con amabilidad y lo anota en algún lugar detrás de los ojos.`, `«Tá bom». Ela diz com gentileza e anota em algum lugar atrás dos olhos.`) })
        ]
      },
      q1: solQ(1), q2: solQ(2), q3: solQ(3),
      verdict: {
        text: function (s) {
          const h = n(s, 'sol_h'), l = n(s, 'sol_l');
          if (h >= 2) return t(`"Two true answers. That's more than most people give me in a year." She takes a small paperback out of her coat. "Take this. I've read it four times. Read it on a wall somewhere. It will do you good."`, `«Dos respuestas verdaderas. Es más de lo que me da la mayoría en un año». Saca un libro de bolsillo del abrigo. «Llévate esto. Lo leí cuatro veces. Léelo contra una pared en algún lado. Te hará bien».`, `«Duas respostas verdadeiras. É mais do que a maioria me dá num ano». Ela tira um livro de bolso do casaco. «Leva. Li quatro vezes. Lê encostado numa parede em algum lugar. Vai te fazer bem».`);
          if (l >= 2) return t(`"You lied twice. It's fine. People do." She looks at you with real interest. "I'd still like you to stay."`, `«Mentiste dos veces. Está bien. La gente lo hace». Te mira con interés de verdad. «Igual me gustaría que te quedaras».`, `«Você mentiu duas vezes. Tudo bem. As pessoas mentem». Ela te olha com interesse de verdade. «Mesmo assim queria que você ficasse».`);
          return t(`"A mix. That's honest too." She moves her coat off the bench. "Sit."`, `«Una mezcla. Eso también es honesto». Quita el abrigo de la banca. «Siéntate».`, `«Uma mistura. Isso também é honesto». Ela tira o casaco do banco. «Senta».`);
        },
        choices: [
          K('care', t(`"Thank you, Soledad." [Take the paperback]`, `«Gracias, Soledad». [Tomar el libro]`, `«{Obrigado|Obrigada|Valeu}, Soledad». [Pegar o livro]`), { req: function (s) { return n(s, 'sol_h') >= 2; }, do: { flag: ['soledad_hub', 'sol_asked'], call: 'sol_verdict' }, next: null }),
          K('care', t(`"Thank you."`, `«Gracias».`, `«{Obrigado|Obrigada|Valeu}».`), { req: function (s) { return n(s, 'sol_h') < 2; }, do: { flag: ['soledad_hub', 'sol_asked'] }, next: null })
        ]
      },
      hub: {
        text: t(`Soledad shifts over on the bench without looking away. "Sit. Or ask. Either is allowed."`, `Soledad se corre en la banca sin dejar de mirar. «Siéntate. O pregunta. Cualquiera de las dos vale».`, `A Soledad se desloca no banco sem parar de olhar. «Senta. Ou pergunta. As duas valem».`),
        choices: [
          K('makeout', ASK, { next: 'ask' }),
          K('chill', t(`Sit with her for a minute.`, `Sentarte con ella un minuto.`, `Sentar com ela um minuto.`), { do: { soc: 1, fun: 1, time: 3 }, req: { no: 'sol_sat' }, next: null, react: t(`Neither of you says anything. It is oddly a conversation anyway.`, `Ninguna de las dos dice nada. Raro, pero cuenta como conversación.`, `Nenhum dos dois diz nada. Estranho, mas conta como conversa.`) }),
          LEAVE()
        ]
      },
      ask: ask('soledad', t(`She finally looks away and back. "You can ask. I'll tell you the truth, which may be no."`, `Por fin mira a otro lado y vuelve. «Puedes preguntar. Te diré la verdad, que podría ser no».`, `Ela finalmente olha pro lado e volta. «Pode perguntar. Eu vou dizer a verdade, que pode ser não».`), t(`"May I kiss you?"`, `«¿Puedo besarte?»`, `«Posso te beijar?»`), [
        [function (s) { return n(s, 'sol_h') >= 2; }, 0.78],
        [function (s) { return n(s, 'sol_l') === 0; }, 0.6],
        [any, 0.3]
      ])
    });
  S.sol_sun_off = function () { IT.worn(EM.state).sunglasses = false; if (U.hud) U.hud(); };
  S.sol_verdict = function () {
    const s = EM.state;
    if (n(s, 'sol_h') >= 2) I.gain('paperback', 3);
  };
  Z.attic.npc({ id: 'soledad', x: 36.5, y: 16.5, dlg: 'soledad', dir: 'l', reach: 16, when: win(210, 420) });
  /* the Paperback has three chapters; I.gain above puts three in the pocket. */

  /* ============================================================ 12. KAZ, argues to flirt (courtyard) */
  EM.CAST.kaz = { name: 'KAZ', look: look({ skin: 5, hair: 4, hc: 0, expr: 5, top: 3, tc: 5, bottom: 1, bc: 2, acc: 5, ac: 4 }) };
  const KAZ_R = [
    { q: t(`"Cold coffee is just soup for people who gave up. Defend yourself."`, `«El café frío es sopa para gente que se rindió. Defiéndete».`, `«Café gelado é sopa pra quem desistiu. Defenda-se».`),
      g: t(`"Soup is served on purpose. Cold coffee is a delayed decision. Different thing."`, `«La sopa se sirve a propósito. El café frío es una decisión retrasada. Otra cosa».`, `«Sopa é servida de propósito. Café gelado é uma decisão adiada. É outra coisa».`),
      w: t(`"…It's… just coffee?"`, `«…¿Es… solo café?»`, `«…É… só café?»`),
      c: t(`"Then I'm giving up with style."`, `«Entonces me rindo con estilo».`, `«Então desisto com estilo».`) },
    { q: t(`"Escalators are stairs that stopped trying."`, `«Las escaleras eléctricas son escaleras que dejaron de intentarlo».`, `«Escada rolante é escada que parou de tentar».`),
      g: t(`"Stairs make you earn the floor. An escalator makes you earn it by trusting the machine. Both are trying."`, `«La escalera te hace ganar el piso. La eléctrica te lo hace ganar confiando en la máquina. Las dos lo intentan».`, `«A escada te faz merecer o andar. A rolante te faz merecer confiando na máquina. As duas tentam».`),
      w: t(`"Stairs are just bad escalators."`, `«Las escaleras son escaleras eléctricas malas».`, `«Escada é escada rolante ruim».`),
      c: t(`"I've given up on both. I take the lift."`, `«Me rendí con las dos. Uso el ascensor».`, `«Desisti das duas. Pego o elevador».`) },
    { q: t(`"A queue is a short-term democracy."`, `«Una fila es una democracia a corto plazo».`, `«Uma fila é uma democracia de curto prazo».`),
      g: t(`"Democracy lets you leave the line. A queue only lets you leave the queue."`, `«La democracia te deja irte de la fila. La fila solo te deja irte de la fila».`, `«A democracia te deixa sair da fila. A fila só te deixa sair da fila».`),
      w: t(`"Queues are queues."`, `«Las filas son filas».`, `«Fila é fila».`),
      c: t(`"I vote we skip this round."`, `«Voto por saltarnos esta ronda».`, `«Voto em pularmos essa rodada».`) }
  ];
  const kazR = function (i) {
    const r = KAZ_R[i - 1], nx = i < 3 ? 'r' + (i + 1) : 'stake';
    return {
      text: i === 1 ? r.q : [t(i === 2 ? `Kaz doesn't wait. ` : `Kaz is enjoying this. `, i === 2 ? `Kaz no espera. ` : `Kaz lo está disfrutando. `, i === 2 ? `A Kaz não espera. ` : `A Kaz tá curtindo. `), r.q],
      choices: [
        K('plan', r.g, { do: { fun: 3 }, call: 'kaz_good', next: nx, react: t(`"Okay. That landed. I'm annoyed."`, `«Bueno. Eso cayó bien. Estoy molesta».`, `«Tá. Essa pegou. Tô irritada».`) }),
        K('chill', r.w, { do: { soc: -1 }, next: nx, react: t(`"I'll let you win this round. I need you to believe in yourself for the next one."`, `«Te dejo ganar esta ronda. Necesito que creas en ti para la siguiente».`, `«Deixo você ganhar essa rodada. Preciso que acredite em si pra próxima».`) }),
        K('joke', r.c, { do: { fun: 1 }, next: nx, react: t(`"A fold. A stylish fold. I respect it."`, `«Una retirada. Una retirada con estilo. La respeto».`, `«Uma retirada. Uma retirada com estilo. Eu respeito».`) })
      ]
    };
  };
  shell('kaz', t('THE ARGUMENT', 'EL ARGUMENTO', 'A DISCUSSÃO'),
    t(`Kaz lifts both palms. "No, fine. You win. Don't tell anyone how little it cost me."`, `Kaz levanta las dos palmas. «No, está bien. Ganas. No le cuentes a nadie lo poco que me costó».`, `A Kaz levanta as duas palmas. «Não, tá bom. Você ganha. Não conta pra ninguém o quão pouco me custou».`), {
      a: {
        text: t(`A woman sits on the barrel by the fence, scrolling nothing. "Cold coffee is just soup for people who gave up." She looks up. "Defend yourself."`, `Una mujer está sentada en el barril junto a la reja, desplazando nada en el celular. «El café frío es sopa para gente que se rindió». Levanta la vista. «Defiéndete».`, `Uma mulher está sentada no barril perto da grade, rolando nada no celular. «Café gelado é sopa pra quem desistiu». Ela levanta o olhar. «Defenda-se».`),
        choices: [
          K('bold', t(`Take the bet.`, `Aceptar el reto.`, `Aceitar o desafio.`), { next: 'gumq' }),
          K('ask', t(`"What happens if I lose?"`, `«¿Qué pasa si pierdo?»`, `«O que acontece se eu perder?»`), { free: true, next: 'rules' }),
          LEAVE()
        ]
      },
      rules: { text: t(`"You pay a sip of water. If you win, I do. And I throw in gum. I'm not a monster."`, `«Pagas un sorbo de agua. Si ganas, lo pago yo. Y te doy un chicle. No soy un monstruo».`, `«Você paga um gole de água. Se ganar, eu pago. E dou um chiclete. Não sou um monstro».`), next: 'a' },
      gumq: {
        text: function (s) {
          return s.fx.gum
            ? t(`She sniffs. "Chewing. Mint or cinnamon? It changes my whole argument." She decides. "Mint. Good. Now start."`, `Olfatea. «Masticando. ¿Menta o canela? Cambia todo mi argumento». Decide. «Menta. Bien. Empieza».`, `Ela fareja. «Mascando. Menta ou canela? Muda o meu argumento inteiro». Decide. «Menta. Bom. Agora comece».`)
            : t(`She sniffs. "No gum. I can't tell if that makes you stronger or weaker. Start."`, `Olfatea. «Sin chicle. No sé si eso te hace más fuerte o más débil. Empieza».`, `Ela fareja. «Sem chiclete. Não sei se isso te deixa mais forte ou mais fraco. Comece».`);
        },
        do: { call: 'kaz_reset' }, next: 'r1'
      },
      r1: kazR(1), r2: kazR(2), r3: kazR(3),
      stake: {
        text: function (s) {
          const g = s.kazG || 0;
          return g >= 2
            ? t(`Kaz counts on her fingers and sighs, defeated. "Two out of three. You win. Here: a sip, a stick of gum, and my tin. It's empty. The empty is the point."`, `Kaz cuenta con los dedos y suspira, vencida. «Dos de tres. Ganas. Toma: un sorbo, un chicle y mi lata. Está vacía. Lo vacío es lo importante».`, `A Kaz conta nos dedos e suspira, derrotada. «Dois de três. Você ganha. Toma: um gole, um chiclete e minha lata. Tá vazia. O vazio é o ponto».`)
            : t(`"I win. I always win." She holds out a hand, palm up. "A sip."`, `«Gano yo. Siempre gano». Extiende una mano con la palma hacia arriba. «Un sorbo».`, `«Eu ganho. Eu sempre ganho». Ela estende uma mão com a palma pra cima. «Um gole».`);
        },
        choices: [
          K('care', t(`Take your winnings.`, `Cobrar tu premio.`, `Pegar o prêmio.`), { req: function (s) { return (s.kazG || 0) >= 2; }, do: { flag: ['kaz_hub', 'kaz_won'] }, call: 'kaz_win', next: null }),
          K('care', t(`Pay with a sip.`, `Pagar con un sorbo.`, `Pagar com um gole.`), { req: function (s) { return (s.kazG || 0) < 2 && EM.water.sips(s) > 0; }, free: true, do: { flag: 'kaz_hub' }, call: 'kaz_pay', next: null }),
          K('chill', t(`"I'm out of water. I owe you."`, `«No tengo agua. Te debo una».`, `«Tô sem água. Te devo uma».`), { req: function (s) { return (s.kazG || 0) < 2 && !(EM.water.sips(s) > 0); }, free: true, do: { flag: 'kaz_hub' }, next: null, react: t(`"An IOU. I'll keep it. I'm very good at keeping things."`, `«Un pagaré. Lo guardo. Se me da muy bien guardar cosas».`, `«Um vale. Eu guardo. Sou muito boa em guardar coisas».`) })
        ]
      },
      hub: {
        text: t(`Kaz is already composing the next one. "Soup. Cold soup is gazpacho. I have a case." She glances up. "Or the other thing?"`, `Kaz ya está componiendo la siguiente. «Sopa. La sopa fría es gazpacho. Tengo un argumento». Levanta la vista. «¿O lo otro?»`, `A Kaz já tá compondo a próxima. «Sopa. Sopa fria é gaspacho. Tenho um argumento». Ela levanta o olhar. «Ou a outra coisa?»`),
        choices: [K('makeout', ASK, { next: 'ask' }), LEAVE()]
      },
      ask: ask('kaz', t(`"The other thing. I can argue that one too. Go on."`, `«Lo otro. También puedo discutirlo. Dale».`, `«A outra coisa. Também posso discutir essa. Vai».`), t(`"Would you like to kiss me?"`, `«¿Te gustaría besarme?»`, `«Você gostaria de me beijar?»`), [
        [function (s) { return !!s.flags.kaz_won; }, 0.75],
        [any, 0.5]
      ])
    });
  S.kaz_reset = function () { EM.state.kazG = 0; };
  S.kaz_good = function () { const s = EM.state; s.kazG = (s.kazG || 0) + 1; };
  S.kaz_win = function () { const s = EM.state; EM.water.addSip(s); EM.giveGum(); I.gain('tin'); };
  S.kaz_pay = function () { I.loseSip(EM.state); };
  Z.courtyard.npc({ id: 'kaz', x: 20.5, y: 13.5, dlg: 'kaz', dir: 'u', reach: 16, when: win(150, 300) });

  /* ============================================================ 13. ODALYS, dances alone (main floor) */
  EM.CAST.odalys = { name: 'ODALYS', look: look({ skin: 4, hair: 7, hc: 2, expr: 0, top: 2, tc: 3, bottom: 2, bc: 0, acc: 3, ac: 1 }) };
  EM.PARTNERS.odalys = {
    tempo: 560, moves: ['bassline', 'shuffle', 'drop', 'sway'],
    win: t(`Odalys closes her eyes and does not stop. After the last beat she says, to the air, "Yes."`, `Odalys cierra los ojos y no se detiene. Después del último golpe dice, al aire: «Sí».`, `A Odalys fecha os olhos e não para. Depois da última batida diz, pro ar: «Sim».`),
    lose: t(`She keeps dancing and treats you as still on time. "Late. That's attractive. Stay late."`, `Sigue bailando y te trata como si fueras a tiempo. «Tarde. Es atractivo. Quédate tarde».`, `Ela continua dançando e te trata como se estivesse no tempo. «Atrasado. É atraente. Fica atrasado».`)
  };
  shell('odalys', t('DANCES ALONE', 'BAILA SOLA', 'DANÇA SOZINHA'),
    t(`Odalys opens one eye. "Not tonight. The floor is big. I'll be on it."`, `Odalys abre un ojo. «Esta noche no. La pista es grande. Voy a estar en ella».`, `A Odalys abre um olho. «Hoje não. A pista é grande. Vou estar nela».`), {
      a: {
        text: t(`A woman dances alone with a space around her that nobody has agreed to. She doesn't open her eyes. "I don't talk on the floor. I'll talk after. If there's an after."`, `Una mujer baila sola con un espacio alrededor que nadie acordó. No abre los ojos. «No hablo en la pista. Hablo después. Si hay un después».`, `Uma mulher dança sozinha com um espaço em volta que ninguém combinou. Ela não abre os olhos. «Não falo na pista. Falo depois. Se houver depois».`),
        choices: [
          K('flirt', t(`Dance next to her.`, `Bailar a su lado.`, `Dançar do lado dela.`), { next: 'gate', free: true }),
          LEAVE()
        ]
      },
      gate: { branch: [{ req: { max: { hp: 39 } }, to: 'sit' }, { req: any, to: 'check' }] },
      sit: {
        text: t(`She opens her eyes at last and looks you up and down. "I don't dance with people who might fall. Sit. There's a step behind you."`, `Por fin abre los ojos y te mira de arriba abajo. «No bailo con gente que podría caerse. Siéntate. Hay un escalón detrás de ti».`, `Ela finalmente abre os olhos e te olha de cima a baixo. «Não danço com gente que pode cair. Senta. Tem um degrau atrás de você».`),
        choices: [K('care', t(`Sit down for a minute.`, `Sentarte un minuto.`, `Sentar um minuto.`), { do: { hp: 4, time: 3 }, req: { no: 'od_sat' }, next: null, react: t(`You sit. The floor looks different from down here, and your knees stop shaking. She nods once and goes back to dancing.`, `Te sientas. La pista se ve distinta desde abajo y las rodillas dejan de temblar. Ella asiente una vez y vuelve a bailar.`, `Você senta. A pista parece diferente daqui de baixo e os joelhos param de tremer. Ela assente uma vez e volta a dançar.`) }), LEAVE()]
      },
      check: {
        text: function (s) {
          return L.req({ item: 'water' })
            ? t(`Her eyes drop to the bottle in your hand and come back up. "Good. I notice who carries water." She starts a count under her breath. "On four."`, `Sus ojos bajan a la botella en tu mano y vuelven. «Bien. Noto quién lleva agua». Empieza una cuenta en voz baja. «En cuatro».`, `Os olhos dela descem pra garrafa na sua mão e voltam. «Bom. Reparo em quem leva água». Ela começa uma contagem baixinho. «No quatro».`)
            : t(`Her eyes check your hands and find nothing in them. "No water. Fine. I won't judge. I'll watch." She starts a count under her breath. "On four."`, `Sus ojos revisan tus manos y no encuentran nada. «Sin agua. Bueno. No juzgo. Miro». Empieza una cuenta en voz baja. «En cuatro».`, `Os olhos dela checam suas mãos e não acham nada. «Sem água. Tá. Não julgo. Observo». Ela começa uma contagem baixinho. «No quatro».`);
        },
        choices: [K('dance', t(`Dance with Odalys.`, `Bailar con Odalys.`, `Dançar com a Odalys.`), { call: 'pd_odalys', free: true, next: null }), LEAVE()]
      },
      hub: {
        text: t(`Odalys wipes her forehead. "After. As promised. What would you like to talk about?"`, `Odalys se seca la frente. «Después. Como prometí. ¿De qué quieres hablar?»`, `A Odalys seca a testa. «Depois. Como prometi. Sobre o que você quer falar?»`),
        choices: [
          K('makeout', ASK, { next: 'ask' }),
          K('chill', t(`"Just the next song."`, `«Solo la próxima canción».`, `«Só a próxima música».`), { free: true, call: 'pd_odalys', next: null }),
          LEAVE()
        ]
      },
      ask: ask('odalys', t(`"After. Yes. We can talk. I'll answer."`, `«Después. Sí. Podemos hablar. Contesto».`, `«Depois. Sim. Podemos conversar. Eu respondo».`), t(`"Would you like to kiss me?"`, `«¿Te gustaría besarme?»`, `«Você gostaria de me beijar?»`), [
        [function (s) { return !!s.flags.odalys_dwin; }, 0.82],
        [function (s) { return !!s.flags.odalys_late; }, 0.62],
        [any, 0.45]
      ])
    });
  S.pd_odalys = function () {
    U.partnerDance('odalys', function (res) {
      const s = EM.state;
      L.apply(res.grade === 'win' ? { fun: 10, soc: 3 } : (res.grade === 'partial' ? { fun: 6, soc: 1 } : (res.grade === 'fail' ? { fun: 2 } : {})));
      L.spend(5);
      if (s.ended) return;
      if (res.grade === 'win') { s.flags.odalys_dwin = true; s.flags.odalys_hub = true; U.startDialogue('odalys_fan', { npc: 'odalys' }); }
      else if (res.grade === 'partial') { s.flags.odalys_late = true; s.flags.odalys_hub = true; U.startDialogue('odalys_late', { npc: 'odalys' }); }
      else U.startDialogue('odalys', { npc: 'odalys' });
    });
  };
  D.odalys_late = { who: 'odalys', role: t('DANCES ALONE', 'BAILA SOLA', 'DANÇA SOZINHA'), forced: true, start: 'a', nodes: { a: { text: t(`"You're half a beat late." She wipes her face. "It's attractive. Stay late."`, `«Llegas medio tiempo tarde». Se limpia la cara. «Es atractivo. Quédate tarde».`, `«Você tá meio tempo atrasado». Ela limpa o rosto. «É atraente. Fica atrasado».`), choices: [K('chill', t(`"I'll stay."`, `«Me quedo».`, `«Eu fico».`), { free: true, do: { fun: 2 }, next: null })] } } };
  D.odalys_fan = {
    who: 'odalys', role: t('DANCES ALONE', 'BAILA SOLA', 'DANÇA SOZINHA'), forced: true, start: 'a', nodes: {
      a: {
        text: t(`The song ends and so does her silence. "That was a good floor. Here." She presses a folded paper fan into your hand. "It breaks after three dances. Everything good does."`, `Termina la canción y también su silencio. «Fue una buena pista. Toma». Te pone en la mano un abanico de papel plegado. «Se rompe después de tres bailes. Todo lo bueno se rompe».`, `A música acaba e o silêncio dela também. «Foi uma boa pista. Toma». Ela põe na sua mão um leque de papel dobrado. «Quebra depois de três danças. Tudo que é bom quebra».`),
        choices: [K('care', t(`"Thank you."`, `«Gracias».`, `«{Obrigado|Obrigada|Valeu}».`), { do: { call: 'odalys_fan_give' }, free: true, next: null })]
      }
    }
  };
  S.odalys_fan_give = function () { I.gain('fan'); };
  Z.main.npc({ id: 'odalys', x: 24.5, y: 13.5, dlg: 'odalys', dir: 'd', reach: 16, pose: 'dance', when: win(240, 420) });

  /* ============================================================ 14. BART, bad at flirting (foyer) */
  EM.CAST.bart = { name: 'BART', look: look({ skin: 1, hair: 2, hc: 6, expr: 3, top: 1, tc: 4, bottom: 1, bc: 3, acc: 6, ac: 2 }) };
  shell('bart', t('HAS A LINE', 'TIENE UNA FRASE', 'TEM UMA CANTADA'),
    t(`Bart looks at the floor, apologises twice and manages to smile. "No. That's fine. That's a full sentence. I'll take it."`, `Bart mira el piso, se disculpa dos veces y logra sonreír. «No. Está bien. Es una frase completa. La acepto».`, `O Bart olha pro chão, pede desculpa duas vezes e consegue sorrir. «Não. Tudo bem. É uma frase completa. Aceito».`), {
      a: {
        text: t(`A man by the foyer wall has been holding the same drink since you came in. "I have a line. It's not good. Do you want it anyway?"`, `Un hombre junto a la pared del foyer sostiene el mismo vaso desde que llegaste. «Tengo una frase. No es buena. ¿La quieres igual?»`, `Um homem junto à parede do foyer tá segurando o mesmo copo desde que você chegou. «Tenho uma cantada. Não é boa. Quer mesmo assim?»`),
        choices: [K('chill', t(`"Go on."`, `«Adelante».`, `«Pode falar».`), { next: 'line' }), LEAVE()]
      },
      line: {
        text: function (s) {
          return IT.plugs(s)
            ? t(`He leans in to be heard. "Is your name Wi-Fi? Because I'm feeling a connection. And I'd need the password." Through the foam it arrives as a confident mumble, and you only realise how it sounded when he repeats it.`, `Se inclina para que lo oigas. «¿Te llamas Wi-Fi? Porque siento una conexión. Y me gustaría la contraseña». A través de la espuma llega como un murmullo seguro, y solo notas cómo sonó cuando lo repite.`, `Ele se inclina pra ser ouvido. «Seu nome é Wi-Fi? Porque tô sentindo uma conexão. E queria a senha». Através da espuma chega como um murmúrio confiante, e você só percebe como soou quando ele repete.`)
            : t(`"Is your name Wi-Fi? Because I'm feeling a connection. And I'd need the password." He closes his eyes. "I told you it wasn't good."`, `«¿Te llamas Wi-Fi? Porque siento una conexión. Y me gustaría la contraseña». Cierra los ojos. «Te dije que no era buena».`, `«Seu nome é Wi-Fi? Porque tô sentindo uma conexão. E queria a senha». Ele fecha os olhos. «Eu avisei que não era boa».`);
        },
        choices: [
          K('care', t(`"Try saying what you actually like about someone."`, `«Prueba diciendo lo que de verdad te gusta de alguien».`, `«Tenta dizer o que você realmente gosta em alguém».`), { next: 'coach' }),
          K('joke', t(`Laugh with him.`, `Reírte con él.`, `Rir com ele.`), { do: { fun: 3 }, next: 'coach', react: t(`He laughs too, relieved, and shows you the bottom of his cup. "I've never gotten past that line before. You're the first."`, `Se ríe también, aliviado, y te muestra el fondo del vaso. «Nunca había pasado de esa frase. Eres el primero».`, `Ele ri também, aliviado, e te mostra o fundo do copo. «Nunca passei dessa cantada. Você é o primeiro».`) }),
          K('blunt', t(`Mock him.`, `Burlarte de él.`, `Zombar dele.`), { do: { soc: -3, fun: -4, flag: ['bart_hurt', 'bart_done'] }, next: null, react: t(`The light goes out of his face. "Right. That's… right. Sorry." He leaves, taking the drink with him.`, `La luz se le apaga en la cara. «Claro. Eso es… claro. Perdón». Se va, llevándose el vaso.`, `A luz some do rosto dele. «Certo. Isso é… certo. Desculpa». Ele sai, levando o copo.`) })
        ]
      },
      coach: {
        text: t(`"I practised that in the shower. It sounded better wet." He breathes. He tries again, with no joke in it: "I like your jacket." A beat. "I do. I wanted to say that and I said the Wi-Fi thing instead."`, `«Lo practiqué en la ducha. Sonaba mejor mojado». Respira. Lo intenta otra vez, sin chiste: «Me gusta tu chaqueta». Pausa. «De verdad. Quería decir eso y dije lo del Wi-Fi».`, `«Treinei no chuveiro. Soava melhor molhado». Ele respira. Tenta de novo, sem piada: «Gosto da sua jaqueta». Pausa. «De verdade. Queria dizer isso e falei a do Wi-Fi».`),
        choices: [
          K('care', t(`"That one. Say that one."`, `«Esa. Di esa».`, `«Essa. Diz essa».`), { do: { soc: 2, flag: 'bart_coached' }, next: 'send' }),
          K('chill', t(`"Both are you. Keep both."`, `«Las dos son tú. Quédate con las dos».`, `«As duas são você. Fica com as duas».`), { do: { fun: 2, flag: 'bart_coached' }, next: 'send' })
        ]
      },
      send: {
        text: t(`He puts the cup down for the first time. "I'm going to say it. To somebody over there. Wish me luck. Or don't. Either way I'm doing it." He goes. Ten minutes pass.`, `Deja el vaso por primera vez. «Voy a decirlo. A alguien por allá. Deséame suerte. O no. De todos modos lo haré». Se va. Pasan diez minutos.`, `Ele larga o copo pela primeira vez. «Vou dizer. Pra alguém ali. Deseje sorte. Ou não. Vou fazer de qualquer jeito». Ele vai. Passam dez minutos.`),
        once: true, do: { time: 10 }, next: 'result'
      },
      result: {
        text: t(`Bart comes back at a half-run, both hands in his hair. "She said yes to a coffee. I've never been so frightened." He presses a laminated card into your hand. "Take my line. I laminated it. It deserves a better owner."`, `Bart vuelve casi corriendo, con las dos manos en el pelo. «Dijo que sí a un café. Nunca había tenido tanto miedo». Te pone una tarjeta plastificada en la mano. «Quédate mi frase. La plastifiqué. Merece un dueño mejor».`, `O Bart volta quase correndo, com as duas mãos no cabelo. «Ela disse sim pra um café. Nunca tive tanto medo». Ele põe um cartão plastificado na sua mão. «Fica com a minha cantada. Plastifiquei. Merece um dono melhor».`),
        choices: [K('care', t(`"Congratulations." [Take the card]`, `«Felicitaciones». [Tomar la tarjeta]`, `«Parabéns». [Pegar o cartão]`), { do: { fun: 10, soc: 4, flag: ['bart_hub', 'bart_done'], call: 'bart_line' }, free: true, next: null, react: t(`"Thank you. I'm going to sit down before I fall down."`, `«Gracias. Me voy a sentar antes de caerme».`, `«{Obrigado|Obrigada|Valeu}. Vou sentar antes de cair».`) })]
      },
      hub: {
        text: t(`Bart is stirring a drink with a straw and a new calm. "Hello. I've decided to enjoy tonight. Would you like to—" He stops. "That wasn't a line. I just wanted to ask if you'd like anything."`, `Bart revuelve un trago con una pajilla y una calma nueva. «Hola. Decidí disfrutar esta noche. ¿Quieres…» Se detiene. «Eso no era una frase. Solo quería preguntar si querías algo».`, `O Bart mexe um drinque com um canudo e uma calma nova. «Oi. Decidi curtir essa noite. Você quer…» Ele para. «Isso não era uma cantada. Só queria perguntar se você queria alguma coisa».`),
        choices: [K('makeout', ASK, { next: 'ask' }), LEAVE()]
      },
      ask: ask('bart', t(`He puts the straw down with great care. "That's— I wasn't— yes? Is yes allowed?"`, `Deja la pajilla con mucho cuidado. «Eso es… no estaba… ¿sí? ¿Se puede decir que sí?»`, `Ele larga o canudo com muito cuidado. «Isso é… eu não estava… sim? Pode dizer sim?»`), t(`"Would you like to kiss me?"`, `«¿Te gustaría besarme?»`, `«Você gostaria de me beijar?»`), [
        [function (s) { return !!s.flags.bart_coached; }, 0.72],
        [any, 0.5]
      ])
    });
  S.bart_line = function () { I.gain('line'); };
  Z.foyer.npc({ id: 'bart', x: 15.5, y: 5.5, dlg: 'bart', dir: 'd', reach: 16, when: function (s) { return s.time >= 60 && s.time <= 240 && !s.flags.bart_hurt; } });

  /* ============================================================ 15. TILDA, bad at flirting (courtyard) */
  EM.CAST.tilda = { name: 'TILDA', look: look({ skin: 0, hair: 1, hc: 7, expr: 1, top: 9, tc: 2, bottom: 0, bc: 0, acc: 6, ac: 1 }) };
  EM.PARTNERS.tilda = {
    tempo: 780, moves: ['sway', 'shuffle', 'wave', 'sway'],
    win: t(`Tilda steps on your foot with great precision, then again. "I'm so sorry. I'm sorry. Did we win? I can't tell."`, `Tilda te pisa el pie con mucha precisión, y otra vez. «Perdón. Perdón. ¿Ganamos? No sé».`, `A Tilda pisa no seu pé com muita precisão, e de novo. «Desculpa. Desculpa. A gente ganhou? Não sei dizer».`),
    lose: t(`Tilda laughs at last, a short, startled sound. "That was bad. That was so bad. I'm having fun."`, `Tilda se ríe por fin, un sonido corto y sorprendido. «Eso fue malo. Eso fue muy malo. Me estoy divirtiendo».`, `A Tilda ri finalmente, um som curto e surpreso. «Isso foi ruim. Isso foi muito ruim. Tô me divertindo».`)
  };
  shell('tilda', t('HAS A PENSION', 'TIENE PENSIÓN', 'TEM PREVIDÊNCIA'),
    t(`Tilda puts a hand over her face, laughing at herself. "No. Of course. That's reasonable. I'll go and look at the lights."`, `Tilda se tapa la cara con una mano, riéndose de sí misma. «No. Claro. Es razonable. Voy a mirar las luces».`, `A Tilda cobre o rosto com uma mão, rindo de si mesma. «Não. Claro. É razoável. Vou olhar as luzes».`), {
      a: {
        text: t(`A woman on the courtyard bench is already talking. "I'm thirty-four. I have a pension. It's a good pension. I can parallel park. First time. Every time."`, `Una mujer en la banca del patio ya está hablando. «Tengo treinta y cuatro años. Tengo pensión. Es una buena pensión. Sé estacionar en paralelo. A la primera. Siempre».`, `Uma mulher no banco do pátio já tá falando. «Tenho trinta e quatro anos. Tenho previdência. É uma boa previdência. Sei fazer baliza. De primeira. Sempre».`),
        choices: [K('chill', t(`"That's a lot of credentials."`, `«Son muchas credenciales».`, `«São muitas credenciais».`), { next: 'ringchk' }), LEAVE()]
      },
      ringchk: { branch: [{ req: function (s) { return !!IT.worn(s).acc.rings && !s.flags.tilda_ring; }, to: 'ring' }, { req: any, to: 'plea' }] },
      ring: {
        text: t(`Her eyes go to your hand. "Oh. You're— okay. Those are rings. That's— I'll just carry on. Here's my pension."`, `Sus ojos van a tu mano. «Ah. Tú estás… bueno. Son anillos. Eso es… sigo igual. Aquí está mi pensión».`, `Os olhos dela vão pra sua mão. «Ah. Você tá… tá. São anéis. Isso é… eu continuo. Aqui tá minha previdência».`),
        once: true, do: { flag: 'tilda_ring', soc: -1 }, next: 'plea'
      },
      plea: {
        text: t(`She holds up a folded printout. It is, in fact, a pension summary. "That's the other reason I'm out on a bench. I'm bad at this."`, `Levanta una hoja doblada. Es, de hecho, un resumen de pensión. «Esa es la otra razón de que esté en una banca. Soy mala en esto».`, `Ela levanta uma folha dobrada. É, de fato, um resumo de previdência. «Essa é a outra razão de eu estar num banco. Sou ruim nisso».`),
        choices: [
          K('care', t(`"What do you like doing?"`, `«¿Qué te gusta hacer?»`, `«O que você gosta de fazer?»`), { next: 'truth' }),
          K('joke', t(`"Is the pension transferable?"`, `«¿La pensión es transferible?»`, `«A previdência é transferível?»`), { do: { fun: 3 }, next: 'truth', react: t(`She chokes on a laugh. "Only by marriage. I'm joking. I don't know. I'd have to check."`, `Se atraganta con una risa. «Solo por matrimonio. Es broma. No sé. Tendría que revisar».`, `Ela engasga numa risada. «Só por casamento. Brincadeira. Não sei. Teria que verificar».`) })
        ]
      },
      truth: {
        text: t(`"…Pension." She hears herself. Then, slowly: "Dances. I like dances. I'm bad at all of them. I go to a class on Tuesdays and the teacher moves me to the back."`, `«…Pensión». Se escucha. Luego, despacio: «Bailes. Me gustan los bailes. Soy mala en todos. Voy a una clase los martes y la profesora me manda al fondo».`, `«…Previdência». Ela se ouve. Depois, devagar: «Danças. Gosto de danças. Sou ruim em todas. Vou numa aula às terças e a professora me manda pro fundo».`),
        choices: [
          K('flirt', t(`"Dance with me."`, `«Baila conmigo».`, `«Dança comigo».`), { call: 'pd_tilda', free: true, next: null }),
          K('chill', t(`"Maybe in a bit."`, `«Quizás en un rato».`, `«Talvez daqui a pouco».`), { free: true, next: null })
        ]
      },
      hub: {
        text: t(`Tilda looks at her shoes and then at you. "I counted fourteen mistakes. That's down from thirty. I'm not saying this is a proposal. I'm saying the option exists."`, `Tilda mira sus zapatos y luego a ti. «Conté catorce errores. Antes eran treinta. No digo que esto sea una propuesta. Digo que la opción existe».`, `A Tilda olha pros sapatos e depois pra você. «Contei catorze erros. Eram trinta. Não tô dizendo que isso é um pedido. Tô dizendo que a opção existe».`),
        choices: [K('makeout', ASK, { next: 'ask' }), K('flirt', t(`"One more dance."`, `«Un baile más».`, `«Mais uma dança».`), { free: true, call: 'pd_tilda', next: null }), LEAVE()]
      },
      ask: ask('tilda', t(`"Oh. That's— yes, that's a question. I have it. I'm listening. I'm so listening."`, `«Ah. Eso es… sí, es una pregunta. La tengo. Escucho. Estoy escuchando muchísimo».`, `«Ah. Isso é… sim, é uma pergunta. Entendi. Tô ouvindo. Tô ouvindo muito».`), t(`"Would you like to kiss me?"`, `«¿Te gustaría besarme?»`, `«Você gostaria de me beijar?»`), [
        [function (s) { return !!s.flags.tilda_danced; }, 0.66],
        [any, 0.45]
      ])
    });
  S.pd_tilda = function () {
    U.partnerDance('tilda', function (res) {
      const s = EM.state;
      L.apply(res.grade === 'win' ? { fun: 9, hp: -1, soc: 2 } : (res.grade === 'partial' ? { fun: 6, hp: -1 } : (res.grade === 'fail' ? { fun: 3, hp: -1 } : {})));
      L.spend(5);
      if (s.ended) return;
      if (res.grade === 'win' || res.grade === 'partial') {
        s.flags.tilda_danced = true; s.flags.tilda_hub = true;
        U.startDialogue('tilda_reward', { npc: 'tilda' });
      } else U.startDialogue('tilda', { npc: 'tilda' });
    });
  };
  D.tilda_reward = {
    who: 'tilda', role: t('HAS A PENSION', 'TIENE PENSIÓN', 'TEM PREVIDÊNCIA'), forced: true, start: 'a', nodes: {
      a: {
        text: t(`She is limping on the right foot and radiant. "I'm not saying this is a proposal. I'm saying the option exists." She digs in her bag. "Blister plasters. Three. I buy them in bulk. I have, I think, a plan."`, `Cojea del pie derecho y está radiante. «No digo que esto sea una propuesta. Digo que la opción existe». Busca en su bolso. «Parches para ampollas. Tres. Los compro al por mayor. Tengo, creo, un plan».`, `Ela manca do pé direito e tá radiante. «Não tô dizendo que isso é um pedido. Tô dizendo que a opção existe». Ela procura na bolsa. «Curativos pra bolha. Três. Compro no atacado. Tenho, acho, um plano».`),
        choices: [K('care', t(`"Thank you. I'll wear them." [Take the plasters]`, `«Gracias. Los voy a usar». [Tomar los parches]`, `«{Obrigado|Obrigada|Valeu}. Vou usar». [Pegar os curativos]`), { do: { call: 'tilda_plasters', flag: 'tilda_done_dance' }, free: true, next: null })]
      }
    }
  };
  S.tilda_plasters = function () { I.gain('plasters', 3); };
  D.soledad.nodes.s.branch.splice(2, 0, { req: function (s) { return !!(s.flags.sol_h3 || s.flags.sol_j3 || s.flags.sol_l3) && !s.flags.soledad_hub; }, to: 'verdict' });
  D.bart.nodes.s.branch.splice(2, 0, { req: function (s) { return !!s.flags.bart_coached && !s.flags.bart_done; }, to: 'result' });
  Z.courtyard.npc({ id: 'tilda', x: 6, y: 3.5, dlg: 'tilda', dir: 'r', reach: 16, when: win(180, 360) });

  /* ---- morning texts ---- */
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'bart_coffee', who: 'bart', ok: function (s) { return !!s.flags.bart_coached; }, t: t(`the coffee is at 11. i am already at the cafe. i have been here for two hours. thank you for the line.`, `el café es a las 11. ya estoy en la cafetería. llevo dos horas aquí. gracias por la frase.`, `o café é às 11. já tô na cafeteria. tô aqui faz duas horas. valeu pela cantada.`) });
    R.push({ id: 'tilda_steps', who: 'tilda', ok: function (s) { return !!s.flags.tilda_danced; }, t: t(`i walked home on one heel and i counted seven good steps. i have enrolled in the thursday class. i'm only telling you because you stood on the other side of my foot.`, `llegué a casa con un solo talón y conté siete pasos buenos. me inscribí en la clase del jueves. solo te lo cuento porque estuviste del otro lado de mi pie.`, `cheguei em casa num calcanhar só e contei sete passos bons. me matriculei na aula de quinta. só te conto porque você ficou do outro lado do meu pé.`) });
  }
})();

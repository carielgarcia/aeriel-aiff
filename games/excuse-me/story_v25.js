/* EXCUSE ME — story v25: fifteen new people, part three. The hostile ones, who must be navigated, not beaten:
   DENNIS and ROSARIO (a lost man who does not want to share a toilet with a woman; four ways to answer him; Rosario decides what happens next),
   CHEMA (a seller who pushes; buying always costs WEIRDNESS and his coke is cut), NEIL (a promoter "routing" a payment to Mina),
   SHANE (the jacket he is wearing), GAV (a stag party at the dark room curtain).
   And THE RIGHT QUEUE, the side quest that opens if you said nothing for Rosario: find her, apologise properly, learn what would have helped. */
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
  const coin = function (s, salt) { return EM.mulberry32((s.seed | 0) + salt)(); };
  const here = function (s) { return !s.ended; };

  /* ============================================================ SAY IT NOW (the perk THE RIGHT QUEUE earns) */
  const sayDo = function (opts) { const x = (opts && opts.do) || {}; return Object.assign({ fun: 4, soc: 2 }, x, { flag: ['say_it_used'].concat(x.flag || []) }); };
  const sayIt = function (opts) {
    return K('honest', t(`Say it plainly. "This place is for everyone."`, `Decirlo claro. «Este lugar es para todos».`, `Dizer com clareza. «Esse lugar é pra todo mundo».`), Object.assign({
      req: function (s) { return !!s.flags.say_it_now && !s.flags.say_it_used; }, free: true, do: sayDo(opts), next: null,
      react: t(`You say it once, level, without raising your voice. They look at you, then at the floor, then away. That is the end of it.`, `Lo dices una vez, sereno, sin subir la voz. Te miran, luego al piso, luego a otro lado. Ahí termina.`, `Você diz uma vez, firme, sem levantar a voz. Eles olham pra você, depois pro chão, depois pro lado. Acabou.`)
    }, (opts && opts.o) || {}));
  };
  /* the crowd's hostile dancers (story_v3) get it too */
  Object.keys(D).filter(function (k) { return /^hostile_\d+$/.test(k); }).forEach(function (k) { D[k].nodes.a.choices.push(sayIt({ o: { call: 'hostile_ok' } })); });
  EM.menuItems.push(function (box, s) {
    if (!s.flags.say_it_now || s.flags.say_it_used) return;
    const r = U.el('div', 'stashrow');
    r.appendChild(U.el('span', 'stl', EM.tr(t('SAY IT NOW — your next hostile scene has a free, plain option', 'DILO AHORA — tu próxima escena hostil tiene una opción clara y gratis', 'DIGA AGORA — sua próxima cena hostil tem uma opção clara e grátis'))));
    box.appendChild(r);
  });

  /* ============================================================ the pin: hostile scenes cost less, first talks cost SOCIAL */
  const hm0 = EM.hostileMul;
  EM.hostileMul = function () { const s = EM.state, b = hm0 ? hm0() : 1; return s && IT.worn(s).acc.pin ? b * 0.6 : b; };
  const ap0 = L.apply;
  L.apply = function (e, ctx) {
    const s = EM.state;
    if (e && s && IT.worn(s).acc.pin && ctx && /^hostile_/.test(ctx.dialogue || '') && e.soc < 0) e = Object.assign({}, e, { soc: Math.min(0, e.soc + 2) });
    return ap0.call(this, e, ctx);
  };
  const sd0 = U.startDialogue;
  U.startDialogue = function (id, opts) {
    const s = EM.state, def = D[id];
    if (s && opts && opts.npc && def && !def.forced && s.stats) {
      /* the pin: everyone asks about it, once per person */
      if (IT.worn(s).acc.pin && !s.res['talked_' + opts.npc] && opts.npc !== 'rosario') { L.stat('soc', -1); if (!s.flags.pin_warn) { s.flags.pin_warn = true; U.toast({ icon: 'eyes', kind: 'info', ms: 5200, text: t(`Everyone asks about the pin. The first hello costs a little SOCIAL.`, `Todos preguntan por el pin. El primer saludo cuesta un poco de SOCIAL.`, `Todo mundo pergunta do pin. O primeiro oi custa um pouco de SOCIAL.`) }); } }
      /* if you said nothing for Rosario, somebody eventually asks you why */
      if (s.flags.dennis_quiet && !s.flags.rq_done && (s.rqCount || 0) < 6 && !(s.rqAsked && s.rqAsked[opts.npc]) && !/^(rq_|rosario|dennis)/.test(id) && opts.npc !== 'rosario' && Math.random() < 0.25 && (s.time - (s.rqLast === undefined ? -99 : s.rqLast)) >= 15) {
        s.rqAsked = s.rqAsked || {}; s.rqAsked[opts.npc] = true; s.rqLast = s.time; s._rqNpc = opts.npc;
        const again = opts;
        sd0('rq_cb', { npc: opts.npc, onEnd: function () { setTimeout(function () { if (!EM.state.ended && !U.D) sd0(id, again); }, 120); } });
        return;
      }
    }
    sd0(id, opts);
  };

  /* ============================================================ 6. DENNIS and ROSARIO */
  EM.CAST.dennis = { name: 'DENNIS', look: look({ skin: 0, hair: 0, hc: 1, expr: 1, top: 7, tc: 3, bottom: 1, bc: 3, acc: 0 }) };
  EM.CAST.rosario = { name: 'ROSARIO', look: look({ skin: 3, hair: 6, hc: 0, expr: 0, top: 6, tc: 3, bottom: 3, bc: 5, acc: 4, ac: 3 }) };
  D.dennis_f = {
    who: 'dennis', role: t('LOST', 'PERDIDO', 'PERDIDO'), start: 'a', nodes: {
      a: {
        text: t(`A man in a good coat stands in the middle of the foyer, looking at the ceiling. "Is this the function room? I'm meeting Keith. Keith said function room."`, `Un hombre con un buen abrigo está parado en medio del foyer, mirando el techo. «¿Es este el salón de eventos? Me reúno con Keith. Keith dijo salón de eventos».`, `Um homem de casaco bom tá parado no meio do foyer, olhando o teto. «Aqui é o salão de festas? Vou encontrar o Keith. O Keith disse salão de festas».`),
        choices: [
          K('blunt', t(`"It's a club. The pub is next door, left."`, `«Es un club. El pub está al lado, a la izquierda».`, `«É um clube. O pub é aqui do lado, à esquerda».`), { do: { flag: 'dennis_met' }, next: null, react: t(`He nods slowly and does not go anywhere. "Right. Next door. Left." He stays exactly where he is.`, `Asiente despacio y no se mueve. «Claro. Al lado. A la izquierda». Se queda exactamente donde está.`, `Ele assente devagar e não vai a lugar nenhum. «Certo. Aqui do lado. À esquerda». Fica exatamente onde está.`) }),
          K('care', t(`"Who's Keith?"`, `«¿Quién es Keith?»`, `«Quem é o Keith?»`), { do: { flag: ['dennis_met', 'dennis_keith'], fun: 2 }, next: 'keith' }),
          K('chill', t(`Leave him to it.`, `Dejarlo con lo suyo.`, `Deixar ele aí.`), { free: true, do: { flag: 'dennis_met' }, next: null, react: t(`He drifts toward the toilet queue with the air of a man following the only sign he can read.`, `Se va hacia la fila del baño con aire de hombre que sigue el único letrero que sabe leer.`, `Ele segue em direção à fila do banheiro com ar de quem acompanha a única placa que sabe ler.`) })
        ]
      },
      keith: { text: t(`"My brother-in-law. He's sixty. He said function room, and a time, and a door." He looks around. "I haven't seen a door that says function."`, `«Mi cuñado. Tiene sesenta. Dijo salón de eventos, una hora y una puerta». Mira alrededor. «No he visto una puerta que diga eventos».`, `«Meu cunhado. Tem sessenta. Disse salão de festas, um horário e uma porta». Ele olha em volta. «Não vi nenhuma porta que diga festa».`), choices: [K('chill', t(`"Try the queue for the toilets. Somebody will know."`, `«Prueba en la fila del baño. Alguien sabrá».`, `«Tenta a fila do banheiro. Alguém deve saber».`), { free: true, next: null })] }
    }
  };
  Z.foyer.npc({ id: 'dennis', cast: 'dennis', x: 19.5, y: 4.5, dlg: 'dennis_f', dir: 'd', reach: 16, when: function (s) { return s.time >= 150 && s.time <= 300 && !s.flags.dennis_met; } });

  const venueOut = function (s) { return s.venue === 'rave'; };
  D.dennis_q = {
    who: 'dennis', role: t('IN THE QUEUE', 'EN LA FILA', 'NA FILA'), start: 'a', nodes: {
      a: {
        text: [
          t(`Dennis, to the woman ahead of him: "Sorry, love — sir — love. I'd rather not share. Not being funny. There should be a different one for you lot." She doesn't turn round. "It's one toilet with a door on every stall. Nobody here is sharing anything but a sink." "That's what I'm saying. It's the sink."`, `Dennis, a la mujer que está delante: «Perdón, cariño, señor, cariño. Prefiero no compartir. No es por molestar. Debería haber otro para ustedes». Ella no se da vuelta. «Es un solo baño con una puerta en cada cubículo. Aquí nadie comparte nada salvo el lavabo». «Eso digo yo. Es el lavabo».`, `O Dennis, pra mulher que tá na frente: «Desculpa, querida, senhor, querida. Prefiro não dividir. Não é por nada, mas devia ter outro pra vocês». Ela não se vira. «É um banheiro só, com porta em cada cabine. Aqui ninguém divide nada além da pia». «É isso que eu digo. É a pia».`),
          t(`He turns to you, hopeful. "You look sensible. Back me up. I'm not going in there with him. Someone say it."`, `Se vuelve hacia ti, esperanzado. «Tú pareces sensato. Apóyame. No pienso entrar ahí con él. Alguien que lo diga».`, `Ele se vira pra você, esperançoso. «Você parece sensato. Me apoia. Eu não vou entrar aí com ele. Alguém diz».`)
        ],
        choices: [
          K('honest', t(`"There's no ladies'. This room is for everyone."`, `«No hay baño de mujeres. Este lugar es para todos».`, `«Não tem banheiro feminino. Esse lugar é pra todo mundo».`), { do: { soc: 6, weird: -6, fun: 8, flag: ['dennis_plain', 'dennis_done'] }, next: 'r3' }),
          K('joke', t(`"Dennis, good news. Nobody here shares anything with anybody except a sink and a bass line. Raves are for everyone. You're included. You'll hate it."`, `«Dennis, buenas noticias. Aquí nadie comparte nada con nadie salvo un lavabo y una línea de bajo. Las raves son para todos. Tú estás incluido. Lo vas a odiar».`, `«Dennis, boa notícia. Aqui ninguém divide nada com ninguém além de uma pia e uma linha de baixo. Rave é pra todo mundo. Você tá incluído. Vai odiar».`), { do: { soc: 6, weird: -3, fun: 14, flag: ['dennis_joke', 'dennis_done'] }, next: 'r4' }),
          K('chill', t(`Say nothing. Look at your shoes.`, `No decir nada. Mirar tus zapatos.`, `Não dizer nada. Olhar pros sapatos.`), { do: { soc: -15, fun: -8, flag: ['dennis_quiet', 'dennis_done'] }, call: 'dennis_quiet', next: null, react: t(`"See? Somebody sensible." Dennis claps your shoulder. Rosario looks at you for one second longer than she needed to, and turns away.`, `«¿Ves? Alguien sensato». Dennis te palmea el hombro. Rosario te mira un segundo más de lo necesario y se da la vuelta.`, `«Viu? Alguém sensato». O Dennis bate no seu ombro. A Rosario te olha um segundo a mais do que precisava e se vira.`) }),
          K('push', t(`"He's right. Find another toilet."`, `«Tiene razón. Busquen otro baño».`, `«Ele tem razão. Procurem outro banheiro».`), { bad: true, call: 'dennis_out', next: null })
        ]
      },
      r3: {
        text: function (s) {
          return s.flags.dennis_keith
            ? [t(`He opens his mouth and finds nothing in it. "…It's a function room."`, `Abre la boca y no encuentra nada dentro. «…Es un salón de eventos».`, `Ele abre a boca e não encontra nada dentro. «…É um salão de festas».`), t(`"It's a rave." A pause. "Keith did say it'd be loud." He looks at Rosario. "Sorry, love. Sorry. Rosario."`, `«Es una rave». Una pausa. «Keith sí dijo que habría ruido». Mira a Rosario. «Perdón, cariño. Perdón. Rosario».`, `«É uma rave». Uma pausa. «O Keith disse mesmo que ia ter barulho». Ele olha pra Rosario. «Desculpa, querida. Desculpa. Rosario».`)]
            : [t(`He opens his mouth and finds nothing in it. "…It's a function room."`, `Abre la boca y no encuentra nada dentro. «…Es un salón de eventos».`, `Ele abre a boca e não encontra nada dentro. «…É um salão de festas».`), t(`"It's a rave." A pause that goes on a while. "…Is Keith in it?"`, `«Es una rave». Una pausa que se alarga. «…¿Keith está ahí?»`, `«É uma rave». Uma pausa que se alonga. «…O Keith tá aí?»`)];
        },
        choices: [K('care', t(`Turn to Rosario.`, `Volverte hacia Rosario.`, `Virar pra Rosario.`), { free: true, call: 'dennis_care', next: null })]
      },
      r4: {
        text: [t(`The queue laughs, and not unkindly. Dennis looks left and right and finds himself the only one not in on it. "…That's very welcoming for something so loud."`, `La fila se ríe, sin mala intención. Dennis mira a izquierda y derecha y es el único que no entiende. «…Eso es muy acogedor para algo tan ruidoso».`, `A fila ri, sem maldade. O Dennis olha pros dois lados e é o único que não entendeu. «…Isso é muito acolhedor pra uma coisa tão barulhenta».`)],
        choices: [K('care', t(`Turn to Rosario.`, `Volverte hacia Rosario.`, `Virar pra Rosario.`), { free: true, call: 'dennis_care', next: null })]
      }
    }
  };
  /* two ways out of the room: the first is the night's lesson, the second ends it */
  S.dennis_quiet = function () { L.stat('weird', 20, true); };
  S.dennis_out = function () { U.startDialogue('dennis_out', { npc: 'dennis' }); };
  D.dennis_out = {
    who: 'dennis', role: t('IN THE QUEUE', 'EN LA FILA', 'NA FILA'), forced: true, start: 'a', nodes: {
      a: {
        text: function (s) {
          return venueOut(s)
            ? t(`"Thank you. Somebody sensible." Dennis clasps your hand. Behind him the queue has gone quiet. Then, one by one, people turn their backs. Nobody throws you out. Nobody is in charge here. They simply leave you in the space you made.`, `«Gracias. Alguien sensato». Dennis te estrecha la mano. Tras él la fila se queda en silencio. Luego, uno por uno, dan la espalda. Nadie los echa. Aquí nadie manda. Simplemente los dejan en el espacio que hicieron.`, `«Obrigado. Alguém sensato». O Dennis aperta sua mão. Atrás dele a fila fica em silêncio. Depois, um por um, as pessoas viram as costas. Ninguém expulsa vocês. Aqui ninguém manda. Elas só deixam vocês no espaço que vocês criaram.`)
            : t(`"Thank you. Somebody sensible." Dennis clasps your hand. Ofelia appears beside the queue without hurry and does not touch either of you. "Both of you. Out."`, `«Gracias. Alguien sensato». Dennis te estrecha la mano. Ofelia aparece junto a la fila sin prisa y no toca a ninguno. «Los dos. Fuera».`, `«Obrigado. Alguém sensato». O Dennis aperta sua mão. A Ofelia aparece do lado da fila sem pressa e não encosta em nenhum dos dois. «Os dois. Pra fora».`);
        },
        next: 'b'
      },
      b: {
        text: function (s) {
          return venueOut(s)
            ? t(`Dennis looks around. "I'm not being funny, but I was on his side." Nobody answers him. The door is a long way off and everybody lets you walk it.`, `Dennis mira alrededor. «No es por molestar, pero yo estaba de su lado». Nadie le contesta. La puerta está lejos y todos los dejan caminarla.`, `O Dennis olha em volta. «Não é por nada, mas eu tava do lado dele». Ninguém responde. A porta tá longe e todo mundo deixa vocês caminharem até ela.`)
            : t(`"I'm not being funny, but I was on his side," says Dennis. Ofelia: "That's the problem." On the pavement, in the cold: "Keith's not here, is he." "No." "He never was."`, `«No es por molestar, pero yo estaba de su lado», dice Dennis. Ofelia: «Ese es el problema». En la banqueta, con frío: «Keith no está aquí, ¿verdad?» «No». «Nunca estuvo».`, `«Não é por nada, mas eu tava do lado dele», diz o Dennis. A Ofelia: «Esse é o problema». Na calçada, no frio: «O Keith não tá aqui, né?» «Não». «Nunca esteve».`);
        },
        choices: [K('chill', t(`Go.`, `Irte.`, `Ir.`), { free: true, call: 'dennis_expel', next: null })]
      }
    }
  };
  S.dennis_expel = function () { L.stat('weird', 100, true); L.check(); };
  Z.restrooms.npc({ id: 'dennisq', pair: ['dennis', 'rosario'], x: 3, y: 10.5, box: { w: 2, h: 1 }, gate: true, dlg: 'dennis_q', dir: 'r', reach: 24, when: function (s) { return s.time >= 150 && s.time <= 330 && !s.flags.dennis_done; } });

  /* ---- the aftercare: Rosario decides ---- */
  S.dennis_care = function () { const s = EM.state; if (!s.ended) U.startDialogue('rosario_care', { npc: 'rosario' }); };
  D.rosario_care = {
    who: 'rosario', role: t('IN THE QUEUE', 'EN LA FILA', 'NA FILA'), forced: true, start: 'decide', nodes: {
      decide: {
        branch: [
          { req: function (s) { const p = s.flags.dennis_joke ? 0.6 : 0.4; return coin(s, 5531) < p; }, to: 'eject' },
          { req: function () { return true; }, to: 'pass' }
        ]
      },
      eject: {
        text: t(`"I'd like him not here." She says it evenly. "Not forever. Just not in this building. I'd like to get through my night without a man managing me."`, `«Quisiera que no estuviera». Lo dice con calma. «No para siempre. Solo no en este edificio. Me gustaría pasar mi noche sin que un hombre me administre».`, `«Eu queria que ele não estivesse aqui». Ela diz com calma. «Não pra sempre. Só não nesse prédio. Queria passar minha noite sem um homem me administrando».`),
        choices: [
          K('plan', t(`"I'll get Ofelia."`, `«Voy por Ofelia».`, `«Vou chamar a Ofelia».`), { do: { time: 6 }, call: 'ros_eject', next: null }),
        ]
      },
      pass: {
        text: t(`"Leave him. He's lost, not dangerous. I have fifteen minutes of dancing in me and I'd like to spend them on someone who isn't him."`, `«Déjalo. Está perdido, no es peligroso. Tengo quince minutos de baile en el cuerpo y quiero gastarlos con alguien que no sea él».`, `«Deixa pra lá. Ele tá perdido, não é perigoso. Tenho quinze minutos de dança no corpo e quero gastar com alguém que não seja ele».`),
        choices: [
          K('flirt', t(`Dance with her.`, `Bailar con ella.`, `Dançar com ela.`), { do: { fun: 10, soc: 4, time: 8 }, next: 'reward', react: t(`She dances the way she talks: directly. Dennis stands at the edge of it all, holding his coat, and watches the whole floor not mind him.`, `Baila como habla: directo. Dennis se queda al borde con el abrigo en las manos y ve cómo toda la pista no le hace caso.`, `Ela dança do jeito que fala: direto. O Dennis fica na beirada segurando o casaco e vê a pista inteira não ligar pra ele.`) }),
          K('plan', t(`Get Ofelia anyway.`, `Ir por Ofelia de todos modos.`, `Chamar a Ofelia mesmo assim.`), { do: { soc: -6, flag: 'ros_overridden' }, next: null, react: t(`"I said leave it." Her voice does not rise. She picks up her bag and goes. It will not be mentioned again.`, `«Dije que lo dejaras». No sube la voz. Recoge su bolso y se va. No se vuelve a mencionar.`, `«Eu disse pra deixar». A voz dela não sobe. Ela pega a bolsa e vai. Isso não vai ser mencionado de novo.`) })
        ]
      },
      reward: {
        text: t(`She unclips a small enamel pin from her collar and puts it in your hand. "Wear it somewhere people will ask. Say the sentence you said tonight. That's what it's for."`, `Se quita un pin esmaltado del cuello y te lo pone en la mano. «Úsalo donde la gente pregunte. Di la frase que dijiste esta noche. Para eso sirve».`, `Ela solta um pequeno pin esmaltado da gola e põe na sua mão. «Usa onde as pessoas perguntarem. Diz a frase que você disse hoje. É pra isso que serve».`),
        once: true, do: { call: 'ros_pin', flag: 'ros_gift_pending' }, next: null
      }
    }
  };
  /* her choice, said out loud, and the scene that follows it */
  S.ros_eject = function () {
    const s = EM.state; if (s.ended) return;
    U.startDialogue('dennis_removed', { npc: 'dennis' });
  };
  D.dennis_removed = {
    who: 'dennis', role: t('IN THE QUEUE', 'EN LA FILA', 'NA FILA'), forced: true, start: 'a', nodes: {
      a: {
        text: function (s) {
          return venueOut(s)
            ? t(`Juniper arrives with the committee. "We've convened. You are no longer part of the circle." Dennis: "I was only asking where—" "We know. This way."`, `Juniper llega con el comité. «Nos hemos reunido. Ya no formas parte del círculo». Dennis: «Yo solo preguntaba dónde…» «Lo sabemos. Por aquí».`, `A Juniper chega com o comitê. «Nós nos reunimos. Você não faz mais parte do círculo». O Dennis: «Eu só tava perguntando onde…» «A gente sabe. Por aqui».`)
            : t(`Ofelia is calm and unhurried. "Sir. This way. We'll find you your function." Dennis: "I was only asking—" "I know. This way."`, `Ofelia está serena y sin prisa. «Señor. Por aquí. Le buscaremos su salón». Dennis: «Yo solo preguntaba…» «Lo sé. Por aquí».`, `A Ofelia tá calma e sem pressa. «Senhor. Por aqui. Vamos achar o seu salão». O Dennis: «Eu só tava perguntando…» «Eu sei. Por aqui».`);
        },
        next: 'b'
      },
      b: { who: 'rosario', text: t(`Rosario watches him go and lets out a long breath. "Thank you for listening. That's all it was." She turns to you. "Here."`, `Rosario lo ve irse y suelta un largo suspiro. «Gracias por escuchar. Eso era todo». Se vuelve hacia ti. «Toma».`, `A Rosario vê ele ir e solta um longo suspiro. «Obrigada por ouvir. Era só isso». Ela se vira pra você. «Toma».`), do: { call: 'ros_pin', flag: 'ros_gift_pending' }, once: true, next: null }
    }
  };
  S.ros_pin = function () {
    const s = EM.state, i = IT.inv(s);
    if (i.acc.pin) return;
    i.acc.pin = 1;
    const w = IT.worn(s); if (!IT.count(s)) w.acc.pin = true;
    s.rosGiftAt = s.time + 60;
    U.toast({ icon: 'star', kind: 'good', ms: 6000, text: t(`You got: ROSARIO'S PIN. (ITEMS: I) Hostile scenes are 40% less likely and cost less SOCIAL. Everyone will ask about it. It is pinned on you; take it off in ITEMS.`, `Conseguiste: EL PIN DE ROSARIO. (OBJETOS: I) Las escenas hostiles son 40% menos probables y cuestan menos SOCIAL. Todos van a preguntar por él. Ya lo llevas puesto; quítatelo en OBJETOS.`, `Você ganhou: O PIN DA ROSARIO. (ITENS: I) As cenas hostis são 40% menos prováveis e custam menos SOCIAL. Todo mundo vai perguntar dele. Ele já tá no seu peito; tire em ITENS.`) });
  };

  /* ---- Rosario returns with a gift (70%, an hour later) ---- */
  const giftAt = function (zone) {
    return function (s) {
      if (!s.flags.ros_gift_pending || s.flags.ros_gift_given || s.time < (s.rosGiftAt || 1e9) || coin(s, 4422) >= 0.7) return false;
      return (coin(s, 4423) < 0.5 ? 'main' : 'courtyard') === zone;
    };
  };
  D.ros_gift = {
    who: 'rosario', role: t('SOMEONE YOU STOOD WITH', 'ALGUIEN CON QUIEN ESTUVISTE', 'ALGUÉM QUE VOCÊ APOIOU'), start: 'a', nodes: {
      a: {
        text: t(`Rosario finds you without looking for you. "I had something in my bag that wasn't mine to keep. You can have it."`, `Rosario te encuentra sin buscarte. «Tenía algo en el bolso que no me tocaba quedarme. Es tuyo».`, `A Rosario te encontra sem te procurar. «Eu tinha uma coisa na bolsa que não era minha pra ficar. É sua».`),
        once: true, do: { flag: 'ros_gift_given', call: 'ros_gift_give' },
        choices: [K('care', t(`"Thank you."`, `«Gracias».`, `«Obrigado».`), { free: true, next: null, react: t(`"Go dance." She is already moving.`, `«Ve a bailar». Ya se está moviendo.`, `«Vai dançar». Ela já tá se mexendo.`) })]
      }
    }
  };
  S.ros_gift_give = function () {
    const s = EM.state, k = Math.floor(coin(s, 4424) * 6);
    if (k === 0) { s.items.water = Math.min(3, (s.items.water || 0) + 1); U.toast({ icon: 'water', kind: 'good', ms: 5000, text: t(`A bottle of water. She had two.`, `Una botella de agua. Tenía dos.`, `Uma garrafa de água. Ela tinha duas.`) }); }
    else if (k === 1) I.gain('sachet', 1);
    else if (k === 2) I.gain('fan', 1);
    else if (k === 3) I.gain('plasters', 1);
    else if (k === 4) EM.giveGum('Rosario');
    else { IT.inv(s).sunglasses++; U.toast({ icon: 'eyes', kind: 'good', ms: 5200, text: t(`A spare pair of sunglasses. (ITEMS: I)`, `Unos lentes de sol de repuesto. (OBJETOS: I)`, `Um óculos escuros reserva. (ITENS: I)`) }); }
  };
  Z.main.npc({ id: 'ros_m', cast: 'rosario', x: 7.5, y: 19.5, dlg: 'ros_gift', dir: 'r', reach: 16, when: giftAt('main') });
  Z.courtyard.npc({ id: 'ros_c', cast: 'rosario', x: 13.5, y: 3.5, dlg: 'ros_gift', dir: 'd', reach: 16, when: giftAt('courtyard') });

  /* ============================================================ THE RIGHT QUEUE: the side quest for the one who said nothing */
  EM.QUESTS.sq_queue = {
    title: t('THE RIGHT QUEUE', 'LA FILA CORRECTA', 'A FILA CERTA'),
    desc: function (s) {
      const mk = function (f) { return s.flags[f] ? '[X]' : '[ ]'; };
      return t(`You said nothing when Dennis asked you to back him against Rosario. Now people are asking. ${mk('rq_found')} Find Rosario (courtyard). ${mk('rq_forgiven')} Apologise properly. ${mk('rq_done')} Ask what would have helped, if she allows it.`, `No dijiste nada cuando Dennis te pidió que lo apoyaras contra Rosario. Ahora la gente te pregunta. ${mk('rq_found')} Encuentra a Rosario (patio). ${mk('rq_forgiven')} Pide perdón bien. ${mk('rq_done')} Pregunta qué habría ayudado, si ella lo permite.`, `Você não disse nada quando o Dennis pediu que o apoiasse contra a Rosario. Agora as pessoas perguntam. ${mk('rq_found')} Encontre a Rosario (pátio). ${mk('rq_forgiven')} Peça desculpa direito. ${mk('rq_done')} Pergunte o que teria ajudado, se ela permitir.`);
    },
    doneText: t(`The questions stop. You know what to say next time, and you will say it.`, `Las preguntas se detienen. Sabes qué decir la próxima vez, y lo dirás.`, `As perguntas param. Você sabe o que dizer da próxima vez, e vai dizer.`)
  };
  const FRIEND = {
    kiki: t(`"Babe, I heard. Why didn't you say something?"`, `«Amigo, me enteré. ¿Por qué no dijiste nada?»`, `«Amigo, fiquei sabendo. Por que você não disse nada?»`),
    hugo: t(`"I stayed quiet for forty years. Do better."`, `«Yo me quedé callado cuarenta años. Hazlo mejor».`, `«Eu fiquei calado quarenta anos. Faz melhor».`),
    dani: t(`"Wait, were you the one in the toilets? I thought it was somebody else. You were so quiet."`, `«Espera, ¿fuiste tú en los baños? Pensé que era otra persona. Estuviste tan callado».`, `«Espera, foi você nos banheiros? Achei que era outra pessoa. Você ficou tão quieto».`),
    other: t(`"You were in the queue. I saw you not say anything."`, `«Estabas en la fila. Te vi no decir nada».`, `«Você tava na fila. Eu vi você não dizer nada».`)
  };
  D.rq_cb = {
    role: t('THEY HEARD', 'SE ENTERARON', 'FICARAM SABENDO'), forced: true, start: 'a', nodes: {
      a: {
        text: function (s) { const n = s._rqNpc; return FRIEND[n] || FRIEND.other; },
        do: { weird: 4, fun: -8, soc: -8, call: 'rq_cb_fx' },
        choices: [K('chill', t(`Nod. There is nothing to say.`, `Asentir. No hay nada que decir.`, `Assentir. Não há o que dizer.`), { free: true, next: null })]
      }
    }
  };
  S.rq_cb_fx = function () {
    const s = EM.state; s.rqCount = (s.rqCount || 0) + 1;
    if (!s.quests.sq_queue) {
      L.setQuest('sq_queue', 'active');
      U.toast({ icon: 'exclam', kind: 'info', ms: 6000, text: t(`People know. Rosario is in the courtyard if you want to make it right.`, `La gente sabe. Rosario está en el patio si quieres arreglarlo.`, `As pessoas sabem. A Rosario tá no pátio se você quiser consertar.`) });
    }
  };
  EM.seekers.push(function (s) { return s.quests.sq_queue === 'active' && !s.flags.rq_forgiven ? [{ key: 'rosario_q', zone: 'courtyard', label: '★' }] : []; });
  D.rosario_q = {
    who: 'rosario', role: t('IN THE COURTYARD', 'EN EL PATIO', 'NO PÁTIO'), start: 'st', nodes: {
      st: { branch: [
        { req: { flag: 'rq_done' }, to: 'after' },
        { req: { flag: 'rq_forgiven' }, to: 'permission' },
        { req: function (s) { return (s.rqRetryAt || 0) > s.time; }, to: 'wait' },
        { req: function () { return true; }, to: 'a' }
      ] },
      wait: { text: t(`She doesn't turn around. "Not now. Come back in an hour, if you still want to."`, `No se da vuelta. «Ahora no. Vuelve en una hora, si todavía quieres».`, `Ela não se vira. «Agora não. Volta daqui a uma hora, se ainda quiser».`), choices: [K('chill', t(`"I will."`, `«Lo haré».`, `«Vou voltar».`), { free: true, next: null })] },
      a: {
        text: t(`Rosario is on a bench with a paper cup. She recognises you before you reach her. "You're the one from the queue."`, `Rosario está en una banca con un vaso de papel. Te reconoce antes de que llegues. «Eres el de la fila».`, `A Rosario tá num banco com um copo de papel. Ela te reconhece antes de você chegar. «Você é o da fila».`),
        do: { flag: 'rq_found' },
        choices: [
          K('care', t(`"I owe you an apology."`, `«Te debo una disculpa».`, `«Eu te devo um pedido de desculpa».`), { next: 'apology' }),
          K('chill', t(`"Not yet. I'll come back."`, `«Todavía no. Vuelvo luego».`, `«Ainda não. Volto depois».`), { free: true, next: null })
        ]
      },
      apology: {
        text: t(`She waits. She does not help.`, `Espera. No ayuda.`, `Ela espera. Não ajuda.`),
        choices: [
          K('chill', t(`"I froze. It was awkward and I didn't know what to do."`, `«Me paralicé. Fue incómodo y no supe qué hacer».`, `«Eu travei. Foi constrangedor e eu não soube o que fazer».`), { do: { soc: -4 }, call: 'rq_retry', next: null, react: t(`"It was awkward for me too. I couldn't freeze." She gets up and goes inside.`, `«También fue incómodo para mí. Yo no podía paralizarme». Se levanta y entra.`, `«Foi constrangedor pra mim também. Eu não podia travar». Ela se levanta e entra.`) }),
          K('chill', t(`"I'm so sorry. Please tell me you're not angry."`, `«Lo siento muchísimo. Dime que no estás enojada».`, `«Sinto muito. Por favor, diz que você não tá brava».`), { do: { soc: -6, weird: 3 }, call: 'rq_retry', next: null, react: t(`"That's a lot of weight to hand me." She does not say it unkindly. She does not stay either.`, `«Es mucho peso para dármelo». No lo dice con mala intención. Tampoco se queda.`, `«É muito peso pra me entregar». Ela não diz com maldade. Também não fica.`) }),
          K('honest', t(`"I should have said something, and I didn't. I'm sorry. You didn't need to carry that alone."`, `«Debí decir algo y no lo hice. Lo siento. No tenías por qué cargar eso sola».`, `«Eu devia ter dito alguma coisa e não disse. Sinto muito. Você não precisava carregar isso sozinha».`), { do: { soc: 6, fun: 6, weird: -5, flag: 'rq_forgiven' }, next: 'permission', react: t(`She looks at you for a long moment. "Thank you. That's all I wanted."`, `Te mira largo rato. «Gracias. Eso era todo lo que quería».`, `Ela te olha por um longo momento. «Obrigada. Era só isso que eu queria».`) })
        ]
      },
      permission: {
        text: t(`"That's the apology. You don't owe me more."`, `«Esa es la disculpa. No me debes más».`, `«Esse é o pedido de desculpa. Você não me deve mais nada».`),
        choices: [
          K('ask', t(`"May I ask what would have helped?"`, `«¿Puedo preguntarte qué habría ayudado?»`, `«Posso perguntar o que teria ajudado?»`), { next: 'l1' }),
          K('chill', t(`"Thank you. I'll leave it there."`, `«Gracias. Lo dejo ahí».`, `«Obrigado. Deixo por aqui».`), { do: { flag: 'rq_done', soc: 2 }, call: 'rq_finish', next: null, react: t(`"Good." She nods and goes back to her cup. The questions are over, though no one tells you how to say it next time.`, `«Bien». Asiente y vuelve a su vaso. Las preguntas se acabaron, aunque nadie te dice cómo decirlo la próxima vez.`, `«Bom». Ela assente e volta pro copo. As perguntas acabaram, mas ninguém te diz como dizer da próxima vez.`) })
        ]
      },
      l1: { text: t(`"Briefly. I'm here to dance. One: come to me first. Ask what I want. Don't make it about you."`, `«Brevemente. Vine a bailar. Uno: ven primero a mí. Pregunta qué quiero. No lo hagas sobre ti».`, `«Rapidinho. Vim pra dançar. Um: vem primeiro até mim. Pergunta o que eu quero. Não faz isso ser sobre você».`), next: 'l2' },
      l2: { text: t(`"Two: say it short and calm. 'This place is for everyone.' You don't need a speech."`, `«Dos: dilo corto y sereno. 'Este lugar es para todos'. No necesitas un discurso».`, `«Dois: diz curto e calmo. 'Esse lugar é pra todo mundo'. Você não precisa de um discurso».`), next: 'l3' },
      l3: { text: t(`"Three: get Ofelia if it's more than words. You don't have to be the whole door."`, `«Tres: busca a Ofelia si es más que palabras. No tienes que ser toda la puerta».`, `«Três: chama a Ofelia se for mais que palavras. Você não precisa ser a porta inteira».`), next: 'pick' },
      pick: {
        text: t(`"Which one will you actually do?"`, `«¿Cuál harás de verdad?»`, `«Qual você vai fazer de verdade?»`),
        choices: [
          K('care', t(`Come to the person first.`, `Ir primero con la persona.`, `Ir primeiro até a pessoa.`), { do: { flag: ['rq_done', 'say_it_now'], soc: 3, fun: 4 }, call: 'rq_finish', next: null }),
          K('honest', t(`Say it short and calm.`, `Decirlo corto y sereno.`, `Dizer curto e calmo.`), { do: { flag: ['rq_done', 'say_it_now'], soc: 3, fun: 4 }, call: 'rq_finish', next: null }),
          K('plan', t(`Get Ofelia when it is more than words.`, `Buscar a Ofelia cuando es más que palabras.`, `Chamar a Ofelia quando é mais que palavras.`), { do: { flag: ['rq_done', 'say_it_now', 'rq_staff'], soc: 3, fun: 4 }, call: 'rq_finish', next: null })
        ]
      },
      after: { text: t(`Rosario lifts her cup half an inch in your direction. "Go dance."`, `Rosario levanta su vaso un centímetro hacia ti. «Ve a bailar».`, `A Rosario levanta o copo um centímetro na sua direção. «Vai dançar».`), choices: [K('chill', t(`"Thanks."`, `«Gracias».`, `«Valeu».`), { free: true, next: null })] }
    }
  };
  S.rq_retry = function () { const s = EM.state; s.rqRetryAt = s.time + 60; };
  S.rq_finish = function () {
    const s = EM.state;
    L.setQuest('sq_queue', 'done');
    if (s.flags.say_it_now) U.toast({ icon: 'star', kind: 'good', ms: 6500, text: t(`SAY IT NOW: your next hostile scene has a free, plain option. (ITEMS: I)`, `DILO AHORA: tu próxima escena hostil tiene una opción clara y gratis. (OBJETOS: I)`, `DIGA AGORA: sua próxima cena hostil tem uma opção clara e grátis. (ITENS: I)`) });
  };
  Z.courtyard.npc({ id: 'rosario_q', cast: 'rosario', x: 11, y: 3.5, dlg: 'rosario_q', dir: 'd', reach: 16, when: function (s) { return s.quests.sq_queue === 'active' && !s.flags.rq_done; } });

  /* ============================================================ 7. CHEMA, the seller who pushes */
  EM.CAST.chema = { name: 'CHEMA', look: look({ skin: 2, hair: 3, hc: 0, expr: 2, top: 10, tc: 0, bottom: 1, bc: 1, acc: 4, ac: 0 }) };
  D.chema = {
    who: 'chema', role: t('SELLING', 'VENDIENDO', 'VENDENDO'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'chema_done' }, to: 'gone' }, { req: function () { return true; }, to: 'a' }] },
      gone: { text: t(`Chema is somewhere else now, and the tunnel feels bigger for it.`, `Chema está en otra parte ahora y el túnel se siente más grande.`, `O Chema tá em outro lugar agora e o túnel parece maior.`), choices: [LEAVE()] },
      a: {
        text: t(`A man steps out of a doorway into your path, smiling. "I don't push. I just stand near people with options."`, `Un hombre sale de un portal y se pone en tu camino, sonriendo. «Yo no insisto. Solo me paro cerca de gente con opciones».`, `Um homem sai de uma porta e entra no seu caminho, sorrindo. «Eu não insisto. Só fico perto de gente com opções».`),
        choices: [
          K('chill', t(`"No, thanks."`, `«No, gracias».`, `«Não, valeu».`), { next: 'follow', react: t(`"Everyone says no first." He falls in beside you.`, `«Todos dicen que no primero». Se pone a tu lado.`, `«Todo mundo diz não primeiro». Ele passa a andar do seu lado.`) }),
          K('joke', t(`"I'm on water."`, `«Estoy con agua».`, `«Tô na água».`), { next: 'follow', react: t(`"Water is for the first hour." He falls in beside you.`, `«El agua es para la primera hora». Se pone a tu lado.`, `«Água é pra primeira hora». Ele passa a andar do seu lado.`) }),
          sayIt({ do: { flag: 'chema_done' } })
        ]
      },
      follow: {
        text: t(`"Last price. Last last price. You look ready to say yes in an hour."`, `«Último precio. Último último precio. Tienes cara de estar listo para decir que sí en una hora».`, `«Último preço. Último último preço. Você tem cara de quem tá pronto pra dizer sim daqui a uma hora».`),
        choices: [
          K('honest', t(`"If I say yes in an hour, I'll be wrong in an hour."`, `«Si digo que sí en una hora, me equivocaré en una hora».`, `«Se eu disser sim daqui a uma hora, vou estar errado daqui a uma hora».`), { do: { soc: -2 }, next: 'clean' }),
          K('plan', t(`Show Isi's wristband.`, `Mostrarle la pulsera de Isi.`, `Mostrar a pulseira da Isi.`), { req: { flag: 'isi_wristband' }, do: { weird: -2, flag: 'chema_done' }, next: null, react: t(`He sees the colour of it. "…That's the Reduciendo one. Forget I stood here." He is not in the tunnel any more.`, `Ve el color. «…Es la de Reduciendo. Olvida que estuve aquí». Ya no está en el túnel.`, `Ele vê a cor. «…É a da Reduciendo. Esquece que eu tava aqui». Ele já não está no túnel.`) }),
          K('bold', t(`Call out for Ofelia, loud.`, `Pedir a Ofelia en voz alta.`, `Chamar a Ofelia em voz alta.`), { do: { weird: 3, flag: 'chema_done' }, next: null, react: t(`"Easy. Easy." He is already walking. Ofelia appears at the end of the tunnel, looks at you, and gives you a small nod that is almost approval.`, `«Tranquilo. Tranquilo». Ya camina. Ofelia aparece al final del túnel, te mira y te da un pequeño gesto casi de aprobación.`, `«Calma. Calma». Ele já tá andando. A Ofelia aparece no fim do túnel, te olha e faz um pequeno aceno quase de aprovação.`) }),
          K('bold', t(`Buy something small. Just to get him gone.`, `Comprar algo pequeño. Solo para que se vaya.`, `Comprar uma coisa pequena. Só pra ele ir embora.`), { bad: true, call: 'chema_buy', do: { flag: 'chema_done' }, next: null, react: t(`A folded paper changes hands. "A pleasure." He is already gone. Somebody down the tunnel watched the whole thing and you can feel it.`, `Un papelito cambia de manos. «Un placer». Ya se fue. Alguien al fondo del túnel vio todo y lo sientes.`, `Um papelzinho muda de mão. «Um prazer». Ele já se foi. Alguém no fim do túnel viu tudo e você sente.`) }),
          sayIt({ do: { flag: 'chema_done' } })
        ]
      },
      clean: {
        text: t(`He studies you a moment. "Fine. If you change your mind, I'm the one who isn't asking." He peels away. It cost you nothing but your patience, and somebody nearby noticed that you held it.`, `Te estudia un momento. «Bien. Si cambias de idea, soy el que no insiste». Se aparta. No te costó más que tu paciencia, y alguien cerca notó que la sostuviste.`, `Ele te estuda um momento. «Tá bom. Se mudar de ideia, sou o que não tá insistindo». Ele se afasta. Não te custou nada além da sua paciência, e alguém por perto reparou que você manteve.`),
        once: true, do: { soc: 3, flag: 'chema_done' }, next: null
      }
    }
  };
  /* buying costs WEIRDNESS in any event (raw: no rave or drug discount); the powder is cut */
  S.chema_buy = function () {
    const s = EM.state;
    L.stat('weird', s.venue === 'rave' ? 10 : 12, true);
    (s.stash = s.stash || []).push({ kind: 'coke', real: 'coke_lev', tested: false, chema: true, fake: 'nothing' });
    s.flags.bought_coke = true;
    U.toast({ icon: 'question', kind: 'bad', ms: 7000, text: s.venue === 'rave'
      ? t(`The crowd saw the hand-off and said nothing. A small folded paper of cocaine, probably. Isi's table can tell you what is in it.`, `La multitud vio el intercambio y no dijo nada. Un papelito de cocaína, probablemente. La mesa de Isi puede decirte qué lleva.`, `A multidão viu a troca e não disse nada. Um papelzinho de cocaína, provavelmente. A mesa da Isi pode te dizer o que tem nele.`)
      : t(`A guard saw the hand-off and wrote it down. A small folded paper of cocaine, probably. Isi's table can tell you what is in it.`, `Un guardia vio el intercambio y lo anotó. Un papelito de cocaína, probablemente. La mesa de Isi puede decirte qué lleva.`, `Um segurança viu a troca e anotou. Um papelzinho de cocaína, provavelmente. A mesa da Isi pode te dizer o que tem nele.`) });
  };
  const ts0 = story.takeStash;
  story.takeStash = function (i) {
    const s = EM.state, e = (s.stash || [])[i], chema = !!(e && e.chema);
    ts0(i);
    if (!chema || s.ended) return;
    L.apply({ hp: -8, fun: 4 });
    s.chemaDown = s.time + 20;
    U.toast({ icon: 'cross', kind: 'bad', ms: 6000, text: t(`Cut with something cheap. Your chest tightens and the lift you feel is borrowed.`, `Cortada con algo barato. Se te cierra el pecho y el subidón que sientes es prestado.`, `Cortada com algo barato. Seu peito aperta e a onda que você sente é emprestada.`) });
    if (Math.random() < 1 / 3) { L.apply({ hp: -6, fx: 'glitch' }); s.fx.glitch = 20; U.toast({ icon: 'skull', kind: 'bad', ms: 6000, text: t(`A bad mix. The room tilts and the words come out in the wrong order.`, `Una mala mezcla. El cuarto se inclina y las palabras salen en el orden equivocado.`, `Uma mistura ruim. A sala inclina e as palavras saem na ordem errada.`) }); }
  };
  const tickC = story.tick;
  story.tick = function (dt) {
    if (tickC) tickC(dt);
    const s = EM.state; if (!s || s.ended) return;
    if (s.chemaDown && s.time >= s.chemaDown) { s.chemaDown = 0; L.apply({ fun: -6 }); U.toast({ icon: 'cross', kind: 'bad', ms: 5000, text: t(`The lift is over. The comedown costs more than it gave.`, `El subidón se acabó. La bajada cuesta más de lo que dio.`, `A onda acabou. A descida custa mais do que deu.`) }); }
  };
  Z.tunnel.npc({ id: 'chema', x: 35.5, y: 4.5, dlg: 'chema', dir: 'l', reach: 18, when: win(210, 360) });

  /* ============================================================ 8. NEIL, "routing" a payment to Mina */
  EM.CAST.neil = { name: 'NEIL', look: look({ skin: 1, hair: 5, hc: 4, expr: 2, top: 10, tc: 0, bottom: 1, bc: 2, acc: 5, ac: 3 }) };
  D.mina_neil = {
    who: 'mina', role: t('SHY AT THE EDGE', 'TÍMIDA EN EL BORDE', 'TÍMIDA NA BEIRADA'), start: 'st', nodes: {
      st: { branch: [
        { req: { flag: 'neil_reward' }, to: 'after' },
        { req: { flag: 'neil_paid' }, to: 'reward' },
        { req: { flag: 'neil_gaveup' }, to: 'gaveup' },
        { req: { flag: 'neil_ask' }, to: 'waiting' },
        { req: function () { return true; }, to: 'a' }
      ] },
      a: {
        text: t(`Mina is at the edge of the foyer with her arms around her laptop bag. "A hundred and forty. For four nights. It's not about the money." She breathes. "It's a hundred and forty."`, `Mina está al borde del foyer con los brazos alrededor de la mochila del portátil. «Ciento cuarenta. Por cuatro noches. No es por el dinero». Respira. «Son ciento cuarenta».`, `A Mina tá na beirada do foyer com os braços em volta da bolsa do notebook. «Cento e quarenta. Por quatro noites. Não é pelo dinheiro». Ela respira. «São cento e quarenta».`),
        choices: [
          K('care', t(`"I'll ask him."`, `«Yo le pregunto».`, `«Eu pergunto pra ele».`), { do: { flag: 'neil_ask' }, next: null, react: t(`"He's over there, on three calls. He'll say he's routing it." She almost smiles. "Thank you for not making me do it."`, `«Está allá, en tres llamadas. Dirá que lo está enrutando». Casi sonríe. «Gracias por no hacerme hacerlo».`, `«Ele tá ali, em três ligações. Vai dizer que tá roteando». Ela quase sorri. «Obrigada por não me fazer fazer isso».`) }),
          LEAVE()
        ]
      },
      waiting: { text: t(`"Did he say anything? It's fine if he didn't. He doesn't."`, `«¿Dijo algo? Está bien si no. Él no dice».`, `«Ele disse alguma coisa? Tudo bem se não. Ele não diz».`), choices: [LEAVE()] },
      gaveup: { text: t(`"It's okay." She is looking at the floor. "I knew. I just hoped." The look on her face costs you something.`, `«Está bien». Mira el piso. «Lo sabía. Solo tenía esperanza». La cara que pone te cuesta algo.`, `«Tudo bem». Ela olha pro chão. «Eu sabia. Só tinha esperança». A cara dela te custa alguma coisa.`), once: true, do: { soc: -3 }, choices: [LEAVE()] },
      reward: {
        text: t(`Mina holds a small foam case in both hands. "He paid. He paid in three different pockets. Here." She slides it across. "Notch filters. Better than the foam you have. And come to the desk for five minutes. There's a low end I want you to hear."`, `Mina sostiene un estuche de espuma con las dos manos. «Pagó. Pagó con tres bolsillos distintos. Toma». Lo desliza hacia ti. «Filtros de muesca. Mejores que la espuma que tienes. Y ven a la mesa cinco minutos. Hay un grave que quiero que oigas».`, `A Mina segura um estojo pequeno de espuma com as duas mãos. «Ele pagou. Pagou com três bolsos diferentes. Toma». Ela desliza pra você. «Filtros notch. Melhores que a espuma que você tem. E vem até a mesa por cinco minutos. Tem um grave que eu quero que você ouça».`),
        once: true, do: { flag: ['neil_reward', 'low_end_tip'], fun: 5, time: 5, call: 'neil_filters' }, next: null
      },
      after: { text: t(`Mina has one headphone on. "Left side, a little more bass. You'll hear it."`, `Mina trae un auricular puesto. «Lado izquierdo, un poco más de grave. Lo vas a oír».`, `A Mina tá com um fone no ouvido. «Lado esquerdo, um pouco mais de grave. Você vai ouvir».`), choices: [LEAVE()] }
    }
  };
  S.neil_filters = function () { I.gain('filters'); };
  D.neil = {
    who: 'neil', role: t('ROUTING', 'ENRUTANDO', 'ROTEANDO'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'neil_paid' }, to: 'done' }, { req: { flag: 'neil_gaveup' }, to: 'done' }, { req: { flag: 'neil_ask' }, to: 'a' }, { req: function () { return true; }, to: 'idle' }] },
      idle: { text: t(`Neil holds one finger up and says into a phone, "Love it, let's circle back." He is already on the next call. He does not look at you.`, `Neil levanta un dedo y dice al teléfono: «Me encanta, lo retomamos». Ya está en otra llamada. No te mira.`, `O Neil levanta um dedo e diz no telefone: «Adorei, a gente retoma». Já tá na próxima ligação. Não olha pra você.`), choices: [LEAVE()] },
      done: { text: t(`Neil is on three calls. "Yes. No. Say that again." He does not look at you.`, `Neil está en tres llamadas. «Sí. No. Repite eso». No te mira.`, `O Neil tá em três ligações. «Sim. Não. Repete isso». Não olha pra você.`), choices: [LEAVE()] },
      a: {
        text: t(`Neil says, to you and the phone at once: "It's in the system. The system is in my other phone. I'm not avoiding you. I'm routing you."`, `Neil dice, a ti y al teléfono a la vez: «Está en el sistema. El sistema está en mi otro teléfono. No te evito. Te enruto».`, `O Neil diz, pra você e pro telefone ao mesmo tempo: «Tá no sistema. O sistema tá no meu outro celular. Não tô te evitando. Tô te roteando».`),
        choices: [
          K('honest', t(`Name the number and the nights. "A hundred and forty. Four nights."`, `Decir la cifra y las noches. «Ciento cuarenta. Cuatro noches».`, `Dizer o valor e as noites. «Cento e quarenta. Quatro noites».`), { do: { soc: -2 }, next: 'hmm', react: t(`"Which Friday?" "The relevant one." He taps the phone and hums.`, `«¿Qué viernes?» «El relevante». Golpetea el teléfono y tararea.`, `«Qual sexta?» «A relevante». Ele bate no celular e cantarola.`) }),
          K('joke', t(`"Your other phone sounds busy."`, `«Tu otro teléfono suena ocupado».`, `«Seu outro celular parece ocupado».`), { do: { fun: 3 }, next: 'hmm', react: t(`"It's on three calls." He considers this. "It's very in demand."`, `«Está en tres llamadas». Lo considera. «Tiene mucha demanda».`, `«Tá em três ligações». Ele considera. «Tem muita procura».`) }),
          K('plan', t(`Stand next to him. Wait.`, `Pararte a su lado. Esperar.`, `Ficar do lado dele. Esperar.`), { do: { fun: -3, time: 12 }, call: 'neil_pays', next: null, react: t(`Twelve minutes. He tries a sentence. You nod, kindly, and do not leave. Somewhere around the ninth minute his hand goes into a pocket.`, `Doce minutos. Intenta una frase. Asientes con amabilidad y no te vas. Hacia el minuto nueve su mano entra en un bolsillo.`, `Doze minutos. Ele tenta uma frase. Você assente com gentileza e não sai. Lá pelo nono minuto a mão dele vai a um bolso.`) }),
          K('bold', t(`"She's a hundred and forty short."`, `«Le faltan ciento cuarenta».`, `«Faltam cento e quarenta pra ela».`), { do: { weird: 4 }, next: 'bold' }),
          sayIt({ do: { flag: 'neil_paid' }, o: { call: 'neil_pays' } })
        ]
      },
      hmm: {
        text: t(`He covers the phone. "Cash. Tomorrow. The system is down." He waits for you to give.`, `Tapa el teléfono. «Efectivo. Mañana. El sistema está caído». Espera que cedas.`, `Ele tampa o celular. «Dinheiro. Amanhã. O sistema tá fora do ar». Espera você ceder.`),
        choices: [
          K('plan', t(`Stand next to him until he pays.`, `Quedarte a su lado hasta que pague.`, `Ficar do lado dele até ele pagar.`), { do: { fun: -3, time: 12 }, call: 'neil_pays', next: null }),
          K('bold', t(`"She's a hundred and forty short."`, `«Le faltan ciento cuarenta».`, `«Faltam cento e quarenta pra ela».`), { do: { weird: 4 }, next: 'bold' }),
          K('chill', t(`"It's fine. Tomorrow."`, `«Está bien. Mañana».`, `«Tá bom. Amanhã».`), { do: { flag: 'neil_gaveup' }, next: null, react: t(`"Great. I'll route it." He turns. Mina, across the foyer, sees it all from your face.`, `«Genial. Lo enruto». Se da la vuelta. Mina, al otro lado del foyer, lo lee todo en tu cara.`, `«Ótimo. Eu roteio». Ele se vira. A Mina, do outro lado do foyer, lê tudo no seu rosto.`) })
        ]
      },
      bold: {
        text: t(`"Do you know who I know?" You hold his eye. "The sound engineer. She knows you." Neil's mouth works. The phone goes in his pocket. Then, slowly, his hand follows it.`, `«¿Sabes a quién conozco?» Le sostienes la mirada. «A la ingeniera de sonido. Ella te conoce a ti». La boca de Neil trabaja. El teléfono entra en su bolsillo. Luego, despacio, su mano lo sigue.`, `«Sabe quem eu conheço?» Você sustenta o olhar. «A engenheira de som. Ela conhece você». A boca do Neil se mexe. O celular vai pro bolso. Depois, devagar, a mão dele vai atrás.`),
        do: { call: 'neil_pays' }, next: null
      }
    }
  };
  S.neil_pays = function () { const s = EM.state; s.flags.neil_paid = true; U.toast({ icon: 'heart', kind: 'good', ms: 5200, text: t(`Neil pays Mina a hundred and forty. In three pockets' worth. Go and see her.`, `Neil le paga a Mina ciento cuarenta. En tres bolsillos. Ve a verla.`, `O Neil paga cento e quarenta pra Mina. Em três bolsos. Vai ver ela.`) }); };
  Z.foyer.npc({ id: 'neil', x: 21.5, y: 6.5, dlg: 'neil', dir: 'l', reach: 18, when: win(90, 300) });
  Z.foyer.npc({ id: 'mina_f', cast: 'mina', x: 25.5, y: 5.5, dlg: 'mina_neil', dir: 'l', reach: 16, when: win(90, 420) });

  /* ============================================================ 9. SHANE, looking for the jacket he is wearing */
  EM.CAST.shane = { name: 'SHANE', look: look({ skin: 1, hair: 4, hc: 2, expr: 4, top: 1, tc: 0, bottom: 1, bc: 1, acc: 0 }) };
  D.shane = {
    who: 'shane', role: t('LOOKING', 'BUSCANDO', 'PROCURANDO'), start: 'a', nodes: {
      a: {
        text: t(`A hand closes on your sleeve. "Did you see my jacket? Navy. It had a lining. A good lining."`, `Una mano se cierra en tu manga. «¿Viste mi chaqueta? Azul marino. Tenía forro. Un buen forro».`, `Uma mão agarra sua manga. «Você viu minha jaqueta? Azul-marinho. Tinha forro. Um bom forro».`),
        choices: [
          K('care', t(`"When did you last have it?"`, `«¿Cuándo la tuviste por última vez?»`, `«Quando foi a última vez que você teve ela?»`), { next: 'when' }),
          K('chill', t(`"Sorry, no."`, `«Perdón, no».`, `«Desculpa, não».`), { free: true, next: null }),
          sayIt({})
        ]
      },
      when: { text: t(`"Ten minutes ago. Or eleven." He looks around the courtyard with wide eyes. "Somebody took it. Somebody here took it. The coat check will know. Come with me."`, `«Hace diez minutos. O once». Mira el patio con los ojos muy abiertos. «Alguien la tomó. Alguien de aquí la tomó. El guardarropa lo sabrá. Ven conmigo».`, `«Dez minutos atrás. Ou onze». Ele olha o pátio de olhos arregalados. «Alguém pegou. Alguém aqui pegou. A chapelaria vai saber. Vem comigo».`),
        choices: [
          K('care', t(`"Okay. Let's go to the coat check."`, `«Está bien. Vamos al guardarropa».`, `«Tá bem. Vamos à chapelaria».`), { do: { flag: 'shane_moved', time: 6 }, next: null, react: t(`He sets off at a half-run, patting every pocket he owns. He goes to the foyer, and you follow.`, `Sale casi corriendo, palpando todos sus bolsillos. Va al foyer y lo sigues.`, `Ele sai quase correndo, apalpando todos os bolsos que tem. Vai pro foyer e você segue.`) }),
          LEAVE()
        ]
      }
    }
  };
  D.shane_f = {
    who: 'shane', role: t('AT THE COAT CHECK', 'EN EL GUARDARROPA', 'NA CHAPELARIA'), start: 'a', nodes: {
      a: { who: 'luca', text: t(`"I need the ticket," says Luca, pleasantly.`, `«Necesito el ticket», dice Luca, con amabilidad.`, `«Preciso do ticket», diz o Luca, com educação.`), next: 'b' },
      b: { text: t(`"The ticket is in the jacket."`, `«El ticket está en la chaqueta».`, `«O ticket tá na jaqueta».`), next: 'c' },
      c: { who: 'luca', text: t(`"Then the jacket is the ticket. It's an efficient system." Luca looks Shane up and down, takes a long moment, and sighs. "…Shane."`, `«Entonces la chaqueta es el ticket. Es un sistema eficiente». Luca mira a Shane de arriba abajo, se toma un momento largo y suspira. «…Shane».`, `«Então a jaqueta é o ticket. É um sistema eficiente». O Luca olha o Shane de cima a baixo, demora um longo momento e suspira. «…Shane».`), next: 'd' },
      d: {
        text: t(`The jacket is tied around his waist. Shane looks down at it, then up at you, in a quiet voice: "Don't."`, `La chaqueta está atada a su cintura. Shane la mira, luego te mira a ti, con una voz muy baja: «No».`, `A jaqueta tá amarrada na cintura dele. O Shane olha pra ela, depois pra você, numa voz muito baixa: «Não».`),
        choices: [
          K('joke', t(`Laugh.`, `Reírte.`, `Rir.`), { do: { hp: -4, soc: -3, flag: 'shane_done' }, next: null, react: t(`He shoves you, not hard but not soft. "It was ten minutes. Or eleven." He stalks off, jacket and all.`, `Te empuja, no fuerte pero tampoco suave. «Fueron diez minutos. O once». Se va echando humo, con chaqueta y todo.`, `Ele te empurra, não forte mas também não de leve. «Foram dez minutos. Ou onze». Ele sai pisando duro, de jaqueta e tudo.`) }),
          K('care', t(`"It's a good lining."`, `«Es un buen forro».`, `«É um bom forro».`), { do: { fun: 6, soc: 3, flag: 'shane_done' }, next: 'gift', react: t(`He laughs, a real one that surprises him. "It is. It's a great lining."`, `Se ríe, de verdad, y eso lo sorprende. «Lo es. Es un gran forro».`, `Ele ri, de verdade, e isso o surpreende. «É. É um grande forro».`) }),
          K('chill', t(`Say nothing.`, `No decir nada.`, `Não dizer nada.`), { free: true, do: { flag: 'shane_done' }, next: null, react: t(`You say nothing. He puts the jacket on, one arm, then the other. "Thank you for not saying it."`, `No dices nada. Se pone la chaqueta, un brazo, luego el otro. «Gracias por no decirlo».`, `Você não diz nada. Ele veste a jaqueta, um braço, depois o outro. «Obrigado por não dizer».`) })
        ]
      },
      gift: {
        text: t(`He pats his pockets and finds half a bottle of water, and an unclaimed lost-property slip from the coat check. "Take it. I don't need a stranger's earring. I need to not be this person."`, `Se palpa los bolsillos y encuentra media botella de agua y un reclamo de objetos perdidos sin usar. «Toma. No necesito el arete de un desconocido. Necesito dejar de ser esta persona».`, `Ele apalpa os bolsos e acha meia garrafa de água e um pedido de achados e perdidos que ninguém usou. «Toma. Não preciso do brinco de um desconhecido. Preciso deixar de ser essa pessoa».`),
        once: true, do: { call: 'shane_gift' }, next: null
      }
    }
  };
  S.shane_gift = function () { const s = EM.state; EM.water.addSip(s); EM.water.addSip(s); I.gain('claim'); };
  Z.courtyard.npc({ id: 'shane', x: 14.5, y: 9.5, dlg: 'shane', dir: 'd', reach: 16, when: function (s) { return s.time >= 180 && s.time <= 360 && !s.flags.shane_moved; } });
  Z.foyer.npc({ id: 'shane_f', cast: 'shane', x: 6.5, y: 4.5, dlg: 'shane_f', dir: 'r', reach: 16, when: function (s) { return !!s.flags.shane_moved && !s.flags.shane_done; } });

  /* ============================================================ 10. GAV and the stag party, at the dark room curtain */
  EM.CAST.gav = { name: 'GAV', look: look({ skin: 1, hair: 2, hc: 1, expr: 2, top: 3, tc: 4, bottom: 1, bc: 3, acc: 0 }) };
  ['gav1', 'gav2', 'gav3', 'gav4'].forEach(function (id, i) { EM.CAST[id] = { name: 'GAV', look: look({ skin: i + 1, hair: i + 2, hc: i, expr: 2, top: 3, tc: 4, bottom: 1, bc: 3, acc: 0 }) }; });
  D.gav = {
    who: 'gav', role: t('STAG PARTY', 'DESPEDIDA', 'DESPEDIDA'), start: 'st', nodes: {
      st: { branch: [{ req: { flag: 'gav_done' }, to: 'gone' }, { req: function () { return true; }, to: 'a' }] },
      gone: { text: t(`The stag party is gone. The curtain moves slightly. Somebody left wishing they had stayed.`, `La despedida se fue. La cortina se mueve apenas. Alguien se fue con ganas de haberse quedado.`, `A despedida foi embora. A cortina se mexe de leve. Alguém saiu querendo ter ficado.`), choices: [LEAVE()] },
      a: {
        text: t(`Five men in matching shirts stand at the curtain. "It's dark. Why is it dark? Is it broken?" Gav pokes the fabric.`, `Cinco hombres con camisas iguales están en la cortina. «Está oscuro. ¿Por qué está oscuro? ¿Está roto?» Gav pincha la tela.`, `Cinco homens de camisas iguais estão na cortina. «Tá escuro. Por que tá escuro? Tá quebrado?» O Gav cutuca o tecido.`),
        choices: [
          K('care', t(`"It's meant to be dark. It's the dark room."`, `«Debe estar oscuro. Es el cuarto oscuro».`, `«É pra ser escuro. É a sala escura».`), { next: 'dario' }),
          K('chill', t(`Leave them to it.`, `Dejarlos solos.`, `Deixar eles.`), { free: true, next: null }),
          sayIt({ do: { flag: 'gav_done' } })
        ]
      },
      dario: {
        who: 'dario', text: t(`Dario appears at the curtain without a sound. "Three rules. Ask first. No means no. Respect the dark. Which of you wants to be first to break them?" Gav, ahead of everyone else: "We're not doing anything. We're just standing in the dark. As a group."`, `Dario aparece junto a la cortina sin hacer ruido. «Tres reglas. Preguntar primero. No es no. Respetar la oscuridad. ¿Cuál de ustedes quiere ser el primero en romperlas?» Gav, adelantándose: «No estamos haciendo nada. Solo estamos parados en la oscuridad. En grupo».`, `O Dario aparece na cortina sem fazer barulho. «Três regras. Perguntar primeiro. Não é não. Respeitar o escuro. Qual de vocês quer ser o primeiro a quebrá-las?» O Gav, na frente de todo mundo: «Não estamos fazendo nada. Só estamos parados no escuro. Em grupo».`),
        choices: [
          K('honest', t(`"That's what the rules are about."`, `«De eso tratan las reglas».`, `«É disso que as regras tratam».`), { do: { weird: -1 }, next: 'wait', react: t(`Gav glances at the others. "…Ah." It takes the whole group a moment. Nobody argues.`, `Gav mira a los demás. «…Ah». Al grupo entero le lleva un momento. Nadie discute.`, `O Gav olha pros outros. «…Ah». Leva um momento pro grupo inteiro. Ninguém discute.`) }),
          K('plan', t(`Sit them by the door for ten minutes, as Dario says.`, `Sentarlos junto a la puerta diez minutos, como dice Dario.`, `Sentar eles perto da porta por dez minutos, como diz o Dario.`), { do: { soc: -3, time: 10, flag: 'gav_dario' }, next: 'wait' }),
          K('bold', t(`"They're fine. I'll vouch for them."`, `«Están bien. Yo respondo por ellos».`, `«Eles estão bem. Eu garanto por eles».`), { do: { weird: 8, flag: 'gav_done' }, next: null, react: t(`Dario gives you one look that goes a long way. Four of them go in. Within a minute there is a noise, a sharp word, and Dario removing a man by the elbow. Your name is in somebody's mouth.`, `Dario te da una mirada que llega lejos. Cuatro entran. En un minuto hay un ruido, una palabra seca y Dario sacando a un hombre del codo. Tu nombre anda en la boca de alguien.`, `O Dario te dá um olhar que vai longe. Quatro entram. Em um minuto tem um barulho, uma palavra seca e o Dario tirando um homem pelo cotovelo. Seu nome tá na boca de alguém.`) }),
          K('chill', t(`"Not my group."`, `«No es mi grupo».`, `«Não é meu grupo».`), { do: { weird: 2, fun: -3, flag: 'gav_done' }, next: null, react: t(`Dario nods once. "Then they can leave." They are walked to the door without a word.`, `Dario asiente una vez. «Entonces pueden irse». Los acompaña hasta la puerta sin decir palabra.`, `O Dario assente uma vez. «Então podem ir». Ele leva eles até a porta sem dizer palavra.`) })
        ]
      },
      wait: {
        text: t(`They file past the curtain and sit in a row on the floor. After ten minutes Gav stands, thoughtful. "Best night of my life, and I saw nothing." He hands you a sticker. "It was on my shirt. It says ASK FIRST. I think it's meant for you."`, `Pasan frente a la cortina y se sientan en fila en el suelo. A los diez minutos Gav se pone de pie, pensativo. «La mejor noche de mi vida y no vi nada». Te da una calcomanía. «Estaba en mi camisa. Dice PREGUNTA PRIMERO. Creo que es para ti».`, `Eles passam pela cortina e sentam em fila no chão. Depois de dez minutos o Gav levanta, pensativo. «A melhor noite da minha vida e eu não vi nada». Ele te entrega um adesivo. «Tava na minha camisa. Diz PERGUNTE PRIMEIRO. Acho que é pra você».`),
        once: true, do: { flag: ['gav_done', 'dario_trust'], call: 'gav_sticker' }, next: null
      }
    }
  };
  S.gav_sticker = function () { I.gain('sticker'); };
  Z.darkroom.npc({ id: 'gav', ring: ['gav1', 'gav2', 'gav3', 'gav4'], x: 16.5, y: 15.5, box: { w: 3, h: 1 }, dlg: 'gav', dir: 'd', reach: 22, when: function (s) { return s.time >= 180 && s.time <= 330 && !s.flags.gav_done; } });

  /* ---- morning texts ---- */
  if (story.morningRefs) {
    const R = story.morningRefs;
    R.push({ id: 'ros_pin', who: 'rosario', ok: function (s) { return !!IT.inv(s).acc.pin; }, t: t(`i saw somebody wearing the pin on the night bus and they said the sentence. i thought of you. go to bed.`, `vi a alguien con el pin en el bus nocturno y dijo la frase. pensé en ti. ve a dormir.`, `vi alguém com o pin no ônibus da madrugada e a pessoa disse a frase. pensei em você. vai dormir.`) });
    R.push({ id: 'neil_mina', who: 'mina', ok: function (s) { return !!s.flags.neil_reward; }, t: t(`i got the hundred and forty. i have cried twice and made a pie. thank you for standing there. i would have gone home.`, `me llegaron los ciento cuarenta. lloré dos veces e hice un pastel. gracias por quedarte ahí. yo me habría ido a casa.`, `recebi os cento e quarenta. chorei duas vezes e fiz uma torta. valeu por ficar ali. eu teria ido pra casa.`) });
    R.push({ id: 'rq_morning', who: 'rosario', ok: function (s) { return !!s.flags.rq_done; }, t: t(`i wanted to say: you came back. most people don't. next time say it earlier, and it will cost you less.`, `quería decirte: volviste. la mayoría no. la próxima vez dilo antes, y te costará menos.`, `queria te dizer: você voltou. a maioria não volta. da próxima vez diz mais cedo, e vai te custar menos.`) });
  }
})();

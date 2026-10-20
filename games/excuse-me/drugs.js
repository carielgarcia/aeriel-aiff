/* EXCUSE ME — what is really in the pills and powders, and what the reagent tests show.
   A sample has a composition (a key of COMPS). Pills are tested with three reagents (Marquis, Froehde, Simmons),
   powders with two (Morris, Liebermann). The colours are the clue; Isi reads them out in plain words. */
'use strict';
(function () {
  const EM = window.EM, T = EM.T;
  const D = EM.drugs = {};

  /* ------------------------------------------------------------ colours (an approved colour exception: game canvas) */
  const COL = {
    black: { c: ['#000000'], w: T('BLACK', 'NEGRO', 'PRETO') },
    blackred: { c: ['#000000', '#E02424'], w: T('BLACK AND RED', 'NEGRO Y ROJO', 'PRETO E VERMELHO') },
    blue: { c: ['#2F6BFF'], w: T('BLUE', 'AZUL', 'AZUL') },
    green: { c: ['#2FD07A'], w: T('GREEN', 'VERDE', 'VERDE') },
    yellow: { c: ['#FFD23F'], w: T('YELLOW', 'AMARILLO', 'AMARELO') },
    orange: { c: ['#FF8A1F'], w: T('ORANGE', 'NARANJA', 'LARANJA') },
    purple: { c: ['#8A5CFF'], w: T('PURPLE', 'MORADO', 'ROXO') },
    none: { c: ['#D8DAE6'], w: T('NO REACTION', 'SIN REACCIÓN', 'SEM REAÇÃO') }
  };
  const TEST = {
    marquis: { title: T('MARQUIS TEST', 'TEST MARQUIS', 'TESTE MARQUIS'), n: 'Marquis' },
    froehde: { title: T('FROEHDE TEST', 'TEST FROEHDE', 'TESTE FROEHDE'), n: 'Froehde' },
    simmons: { title: T('SIMMONS TEST', 'TEST SIMMONS', 'TESTE SIMMONS'), n: 'Simmons' },
    morris: { title: T('MORRIS TEST', 'TEST MORRIS', 'TESTE MORRIS'), n: 'Morris' },
    liebermann: { title: T('LIEBERMANN TEST', 'TEST LIEBERMANN', 'TESTE LIEBERMANN'), n: 'Liebermann' }
  };

  /* ------------------------------------------------------------ compositions */
  const COMPS = {
    mdma: { n: T('MDMA', 'MDMA', 'MDMA'), tests: [['marquis', 'black'], ['froehde', 'black'], ['simmons', 'blue']] },
    mix: { n: T('MDMA + METHAMPHETAMINE', 'MDMA + METANFETAMINA', 'MDMA + METANFETAMINA'), tests: [['marquis', 'blackred'], ['froehde', 'black'], ['simmons', 'blue']] },
    mda: { n: T('MDA', 'MDA', 'MDA'), tests: [['marquis', 'black'], ['froehde', 'black'], ['simmons', 'none']] },
    unknown: { n: T('UNKNOWN SUBSTANCE', 'SUSTANCIA DESCONOCIDA', 'SUBSTÂNCIA DESCONHECIDA'), tests: [['marquis', 'none'], ['froehde', 'green'], ['simmons', 'none']] },
    coke: { n: T('COCAINE', 'COCAÍNA', 'COCAÍNA'), tests: [['morris', 'blue'], ['liebermann', 'none']] },
    coke_lev: { n: T('COCAINE + LEVAMISOLE', 'COCAÍNA + LEVAMISOL', 'COCAÍNA + LEVAMISOL'), tests: [['morris', 'blue'], ['liebermann', 'yellow']] },
    coke_amph: { n: T('COCAINE + AMPHETAMINE', 'COCAÍNA + ANFETAMINA', 'COCAÍNA + ANFETAMINA'), tests: [['morris', 'blue'], ['liebermann', 'orange']] },
    ket: { n: T('KETAMINE', 'KETAMINA', 'CETAMINA'), tests: [['morris', 'purple'], ['liebermann', 'none']] },
    ket_lev: { n: T('KETAMINE + LEVAMISOLE', 'KETAMINA + LEVAMISOL', 'CETAMINA + LEVAMISOL'), tests: [['morris', 'purple'], ['liebermann', 'yellow']] },
    nothing: { n: T('NOTHING FOUND', 'NO SE ENCONTRÓ NADA', 'NADA ENCONTRADO'), tests: [['morris', 'none'], ['liebermann', 'none']] }
  };
  D.COMPS = COMPS;
  D.name = function (comp) { return (COMPS[comp] || COMPS.unknown).n; };
  D.isPill = function (comp) { return comp === 'mdma' || comp === 'mix' || comp === 'mda' || comp === 'unknown'; };

  /* ------------------------------------------------------------ odds */
  const COKE = [['coke_lev', 0.70], ['coke_amph', 0.10], ['coke', 0.15], ['nothing', 0.05]];
  const KET = [['coke', 0.10], ['ket', 0.60], ['ket_lev', 0.20], ['nothing', 0.10]];
  /* a stamp is a story, not a guarantee, but the odds lean a little: [mdma, mix, mda, unknown] */
  const PILL = {
    crown: [0.70, 0.10, 0.10, 0.10], heart: [0.70, 0.10, 0.10, 0.10], bolt: [0.40, 0.35, 0.10, 0.15],
    skull: [0.40, 0.15, 0.10, 0.35], smile: [0.60, 0.15, 0.10, 0.15], ae: [0.60, 0.15, 0.10, 0.15]
  };
  function from(table, r) { let a = 0; r = r === undefined ? Math.random() : r; for (let i = 0; i < table.length; i++) { a += table[i][1]; if (r < a) return table[i][0]; } return table[table.length - 1][0]; }
  D.rollPill = function (imprint, r) { const o = PILL[imprint] || PILL.smile; return from([['mdma', o[0]], ['mix', o[1]], ['mda', o[2]], ['unknown', o[3]]], r); };
  /* what a bag sold as cocaine or ketamine really holds */
  D.rollPowder = function (told, r) { return from(told === 'coke' ? COKE : KET, r); };
  /* an untested powder sold as cocaine is ketamine about one time in five (testing it removes that doubt) */
  D.rollKetVariant = function () { return Math.random() < 0.75 ? 'ket' : 'ket_lev'; };
  /* and an untested powder sold as ketamine is cocaine about one time in five (testing it removes that doubt) */
  D.rollCokeVariant = function () { return from(COKE.filter(function (x) { return x[0] !== 'nothing'; }).map(function (x) { return [x[0], x[1] / 0.95]; })); };
  D.COKE_ODDS = COKE; D.KET_ODDS = KET; D.PILL_ODDS = PILL;

  /* ------------------------------------------------------------ the tests, as the animation draws them */
  D.tests = function (comp) {
    return (COMPS[comp] || COMPS.unknown).tests.map(function (p) {
      const tt = TEST[p[0]], c = COL[p[1]];
      return { name: tt.title, word: c.w, colors: c.c, title: T(tt.title.en + ' — ' + c.w.en, tt.title.es + ' — ' + c.w.es, tt.title.pt + ' — ' + c.w.pt) };
    });
  };
  /* "Marquis: black. Froehde: black. Simmons: blue." */
  function readout(comp) {
    const out = { en: [], es: [], pt: [] };
    (COMPS[comp] || COMPS.unknown).tests.forEach(function (p) {
      ['en', 'es', 'pt'].forEach(function (l) { out[l].push(TEST[p[0]].n + ': ' + COL[p[1]].w[l].toLowerCase() + '.'); });
    });
    return T(out.en.join(' '), out.es.join(' '), out.pt.join(' '));
  }

  /* ------------------------------------------------------------ Isi, plain and direct */
  const LEAD = {
    ok: T('It is what you were told.', 'Es lo que te dijeron.', 'É o que te disseram.'),
    cut: T('It is what you were told, with something added.', 'Es lo que te dijeron, con algo más agregado.', 'É o que te disseram, com algo a mais misturado.'),
    no: T('It is not what you were told.', 'No es lo que te dijeron.', 'Não é o que te disseram.')
  };
  const MEAN = {
    mdma: T('That is MDMA. The tests do not show how strong it is, or how your body will react. If you take it: start with half, wait an hour, drink water in small sips, and take nothing on top.',
      'Eso es MDMA. Los tests no muestran qué tan fuerte es ni cómo va a reaccionar tu cuerpo. Si la tomas: empieza con la mitad, espera una hora, toma agua en sorbos chicos y no tomes nada encima.',
      'Isso é MDMA. Os testes não mostram a força nem como o seu corpo vai reagir. Se você tomar: comece com metade, espere uma hora, beba água em golinhos e não tome mais nada por cima.'),
    mix: T('That is MDMA with methamphetamine. Methamphetamine is a stimulant and it is hard on the heart. If you take it: half at most, sit often, drink water, and watch your pulse. Or bin it.',
      'Eso es MDMA con metanfetamina. La metanfetamina es un estimulante y le exige mucho al corazón. Si la tomas: la mitad como máximo, siéntate seguido, toma agua y fíjate en tu pulso. O tírala.',
      'Isso é MDMA com metanfetamina. A metanfetamina é um estimulante e pesa no coração. Se você tomar: no máximo metade, sente com frequência, beba água e preste atenção no pulso. Ou jogue fora.'),
    mda: T('That is MDA, not MDMA. It is a different drug. It takes longer to start and lasts longer, so plan for a long night. If you take it: half, and do not take more while you wait. Or bin it.',
      'Eso es MDA, no MDMA. Es otra droga. Tarda más en empezar y dura más, así que prepárate para una noche larga. Si la tomas: la mitad, y no tomes más mientras esperas. O tírala.',
      'Isso é MDA, não MDMA. É outra droga. Demora mais pra começar e dura mais, então se prepare pra uma noite longa. Se você tomar: metade, e não tome mais enquanto espera. Ou jogue fora.'),
    unknown: T('I cannot tell you what this is. It is not MDMA and it is not MDA. I do not recommend taking it. Put it in the bin.',
      'No puedo decirte qué es. No es MDMA y no es MDA. No te recomiendo tomarla. Tírala al bote.',
      'Não consigo te dizer o que é. Não é MDMA e não é MDA. Não recomendo tomar. Joga na lixeira.'),
    coke: T('That is cocaine, with nothing added that these tests can see. It is still hard on the heart, and dancing will cost you. If you take it: go slower on the floor and drink water.',
      'Eso es cocaína, sin nada agregado que estos tests puedan ver. Igual le exige al corazón, y bailar te va a costar. Si la tomas: baja el ritmo en la pista y toma agua.',
      'Isso é cocaína, sem nada misturado que esses testes consigam ver. Mesmo assim pesa no coração, e dançar vai te custar. Se você tomar: vá mais devagar na pista e beba água.'),
    coke_lev: T('That is cocaine with levamisole. Levamisole is a veterinary medicine against parasites, and it is commonly mixed into cocaine. It is not meant for people and it is bad for you. I do not recommend taking it.',
      'Eso es cocaína con levamisol. El levamisol es un medicamento veterinario contra parásitos, y se mezcla seguido con la cocaína. No es para personas y te hace mal. No te recomiendo tomarla.',
      'Isso é cocaína com levamisol. Levamisol é um medicamento veterinário contra parasitas, e é muito misturado na cocaína. Não é feito pra pessoas e faz mal. Não recomendo tomar.'),
    coke_amph: T('That is cocaine with amphetamines. Cocaine and amphetamines together are very dangerous for your heart. Do not take it. Bin it.',
      'Eso es cocaína con anfetaminas. La cocaína y las anfetaminas juntas son muy peligrosas para el corazón. No la tomes. Tírala.',
      'Isso é cocaína com anfetaminas. Cocaína e anfetaminas juntas são muito perigosas pro coração. Não tome. Joga fora.'),
    ket: T('That is ketamine. It can put you on the floor within minutes, sometimes before you feel it. If you take it: sit first, never without company, never near stairs, and tell someone where you are.',
      'Eso es ketamina. Te puede dejar en el piso en minutos, a veces antes de que lo notes. Si la tomas: siéntate primero, nunca sin compañía, nunca cerca de escaleras, y avísale a alguien dónde estás.',
      'Isso é cetamina. Pode te derrubar em minutos, às vezes antes de você sentir. Se você tomar: sente antes, nunca sem companhia, nunca perto de escadas, e avise alguém onde você está.'),
    ket_lev: T('That is ketamine with levamisole. Levamisole is a veterinary medicine against parasites, and it is commonly mixed into drugs. It is not meant for people. I do not recommend taking it. If you do: sit first and never be alone.',
      'Eso es ketamina con levamisol. El levamisol es un medicamento veterinario contra parásitos, y se mezcla seguido en las drogas. No es para personas. No te recomiendo tomarla. Si la tomas: siéntate primero y no estés sin compañía.',
      'Isso é cetamina com levamisol. Levamisol é um medicamento veterinário contra parasitas, e é muito misturado em drogas. Não é feito pra pessoas. Não recomendo tomar. Se tomar: sente antes e não fique sozinho.'),
    nothing: T('I find nothing. Neither test reacted. I cannot say what it is, and it is not what you paid for. I would not take it.',
      'No encuentro nada. Ninguno de los dos tests reaccionó. No puedo decirte qué es, y no es lo que pagaste. Yo no la tomaría.',
      'Não encontro nada. Nenhum dos dois testes reagiu. Não consigo dizer o que é, e não é o que você pagou. Eu não tomaria.')
  };
  const IMPNOTE = {
    crown: T('Crown stamp: these have come back strong tonight. If you take one, take half.', 'Sello de corona: han vuelto fuertes esta noche. Si tomas una, toma la mitad.', 'Carimbo de coroa: voltaram fortes hoje à noite. Se tomar uma, tome metade.'),
    heart: T('Heart stamp: common. The stamp does not tell me what is inside.', 'Sello de corazón: común. El sello no me dice qué hay adentro.', 'Carimbo de coração: comum. O carimbo não me diz o que tem dentro.'),
    bolt: T('Bolt stamp: I have seen some of these cut with a stimulant. Not all of them.', 'Sello de rayo: vi algunas cortadas con un estimulante. No todas.', 'Carimbo de raio: já vi algumas cortadas com estimulante. Nem todas.'),
    skull: T('Skull stamp: a joke stamp. It tells me nothing about what is inside.', 'Sello de calavera: un sello de broma. No me dice nada de lo que hay adentro.', 'Carimbo de caveira: um carimbo de piada. Não me diz nada do que tem dentro.'),
    smile: T('Smiley stamp: common. It tells me nothing about what is inside.', 'Sello de carita: común. No me dice nada de lo que hay adentro.', 'Carimbo de carinha: comum. Não me diz nada do que tem dentro.'),
    ae: T('Æ stamp: someone has been to a certain party. Chemically it means nothing.', 'Sello de Æ: alguien fue a cierta fiesta. Químicamente no significa nada.', 'Carimbo de Æ: alguém foi a certa festa. Quimicamente não significa nada.')
  };
  D.IMPNOTE = IMPNOTE;
  /* did the sample match what the person thinks they have? told: 'mdma' | 'coke' | 'ket' */
  D.match = function (comp, told) {
    if (told === 'mdma') return comp === 'mdma' ? 'ok' : (comp === 'mix' ? 'cut' : 'no');
    if (told === 'coke') return comp === 'coke' ? 'ok' : ((comp === 'coke_lev' || comp === 'coke_amph') ? 'cut' : 'no');
    return comp === 'ket' ? 'ok' : (comp === 'ket_lev' ? 'cut' : 'no');
  };
  /* the pages Isi says after the tests: what you were told, what the colours were, what it means */
  D.pages = function (comp, told, imprint) {
    comp = COMPS[comp] ? comp : 'unknown';
    const out = [LEAD[D.match(comp, told || 'mdma')], readout(comp), MEAN[comp]];
    if (imprint && IMPNOTE[imprint]) out.push(IMPNOTE[imprint]);
    return out;
  };
})();

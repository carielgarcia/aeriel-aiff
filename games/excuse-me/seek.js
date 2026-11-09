/* EXCUSE ME — finding people: a golden star above whoever you are looking for, arrows toward where they might have gone,
   clues when they leave, and a star when you find them. The engine draws; this file decides who is being sought. */
(function () {
  'use strict';
  const EM = window.EM, L = EM.logic, T = EM.T, U = EM.ui, story = EM.story;
  const t = T;

  /* ------------------------------------------------------------ who is being sought: { key: { zone, label } } */
  /* key is the friend id for people in your group, or the NPC id for anyone else */
  EM.seekers = [];
  EM.seekTargets = function (s) {
    const out = {};
    if (!s || s.ended) return out;
    EM.seekers.forEach(function (fn) { (fn(s) || []).forEach(function (x) { out[x.key] = x; }); });
    return out;
  };
  function lostFriend(s, f) { return !!s.away[f] && s.party.indexOf(f) === -1; }
  const FR_NAME = { maru: 'M', dani: 'B', tato: 'F', vale: 'V', alex: 'A' };
  /* your group: the first mission (all three), the scattering, and the friends who wander off on their own */
  EM.seekers.push(function (s) {
    const q = s.quests, res = [];
    const want = {};
    if (q.q1 === 'active') { want.maru = want.dani = want.tato = 1; }
    if (q.q8 === 'active') { want.dani = want.tato = 1; }
    if (s.flags.benji_out) want.dani = 1;
    if (s.flags.tato_dark_stay && !s.flags.tato_dark_back) want.tato = 1;
    Object.keys(want).forEach(function (f) { if (lostFriend(s, f)) res.push({ key: f, zone: s.away[f], label: FR_NAME[f] }); });
    return res;
  });
  /* the people the main missions send you to */
  EM.seekers.push(function (s) {
    const q = s.quests, res = [];
    if (q.q3 === 'active') res.push({ key: 'host', zone: 'restrooms', label: '★' });
    if (q.q4 === 'active') res.push({ key: 'rosa', zone: 'restrooms', label: '★' });
    return res;
  });

  /* ------------------------------------------------------------ a star over a friend you just found */
  EM.found = null;
  const join0 = L.join;
  L.join = function (id) {
    const s = EM.state, was = s && s.away && s.away[id] && s.party.indexOf(id) === -1;
    const sought = was && EM.seekTargets(s)[id];
    join0(id);
    if (sought) {
      EM.found = { id: id, until: (EM.engine && EM.engine.time || 0) + 4 };
      if (EM.audio && EM.audio.blip) EM.audio.blip('good');
      U.toast({ icon: 'star', kind: 'good', ms: 3500, text: t(`Found ${EM.CAST[id].name}.`, `Encontraste a ${EM.CAST[id].name}.`, `Você encontrou ${EM.CAST[id].name}.`) });
    }
  };

  /* ------------------------------------------------------------ clues when somebody goes */
  const CLUE = {
    dani: {
      darkroom: t(`Dani's last text: "going somewhere with the lights off, very respectful." Behind the black curtain, a laugh you would know anywhere.`, `Último mensaje de Dani: «voy a un lugar con las luces apagadas, muy respetuoso». Tras la cortina negra, una risa que reconocerías en cualquier parte.`, `Última mensagem do Dani: «tô indo num lugar com as luzes apagadas, bem respeitoso». Atrás da cortina preta, uma risada que você reconheceria em qualquer lugar.`),
      attic: t(`Someone says a man in a bucket hat went up the stairs to SALA 2 shouting "I'm a capybara!"`, `Alguien dice que un tipo con gorro de pescador subió las escaleras a la SALA 2 gritando «¡soy un capibara!»`, `Alguém diz que um cara de chapéu bucket subiu a escada pra SALA 2 gritando «eu sou uma capivara!»`),
      tunnel: t(`From the tunnel, an echo: "LISTEN TO THE ACOUSTICS." That is Dani. That is definitely Dani.`, `Desde el túnel llega un eco: «ESCUCHEN LA ACÚSTICA». Ese es Dani. Definitivamente es Dani.`, `Do túnel vem um eco: «OUÇAM A ACÚSTICA». É o Dani. Com certeza é o Dani.`),
      welfare: t(`A volunteer at the door of the quiet room says a friend of yours asked for a chair "for the vibes, not for the dizziness".`, `Un voluntario en la puerta de la sala tranquila dice que un amigo tuyo pidió una silla «por las vibras, no por el mareo».`, `Um voluntário na porta da sala tranquila diz que um amigo seu pediu uma cadeira «pela vibe, não pela tontura».`),
      courtyard: t(`Smoke, a shout of your name over the courtyard wall, and then a lighter flicking: Dani is out there.`, `Humo, un grito con tu nombre sobre el muro del patio y luego un encendedor: Dani está ahí afuera.`, `Fumaça, um grito do seu nome por cima do muro do pátio e depois um isqueiro: o Dani tá lá fora.`),
      rooftop: t(`Someone coming down from the roof says a man up there is explaining nature to the sky.`, `Alguien que baja del techo cuenta que arriba hay un tipo explicándole la naturaleza al cielo.`, `Alguém descendo do terraço conta que tem um cara lá em cima explicando a natureza pro céu.`),
      main: t(`Dani is somewhere on the main floor, easy to miss, hard to lose. Check the corners.`, `Dani anda por la pista principal, fácil de perder y difícil de extraviar. Mira las esquinas.`, `O Dani tá em algum lugar da pista principal. Dá uma olhada nos cantos.`)
    },
    tato: {
      darkroom: t(`Tato walked into the dark and the dark said "welcome". Look past the black curtain.`, `Tato entró a la oscuridad y la oscuridad dijo «bienvenido». Mira más allá de la cortina negra.`, `O Tato entrou no escuro e o escuro disse «bem-vindo». Olha depois da cortina preta.`),
      courtyard: t(`Tato's laugh drifts in from the smoking area. He does not smoke. He is "just there for the conversations".`, `La risa de Tato llega desde la zona de fumadores. Él no fuma. Está «solo por las conversaciones».`, `A risada do Tato vem da área de fumantes. Ele não fuma. Tá «só pelas conversas».`),
      welfare: t(`A volunteer says a friend of yours was walked to the quiet room, "talking a lot but fine".`, `Un voluntario dice que acompañaron a un amigo tuyo a la sala tranquila, «hablando mucho pero bien».`, `Um voluntário diz que levaram um amigo seu pra sala tranquila, «falando muito mas bem».`)
    }
  };
  function zoneName(z) { const zz = EM.zones[z]; return zz ? zz.name : T(z, z, z); }
  const leave1 = L.leave;
  L.leave = function (id, zone) {
    const s = EM.state, had = s && s.away[id];
    leave1(id, zone);
    if (!s || s.away[id] !== zone || had === zone) return;
    const c = CLUE[id] && (CLUE[id][zone] || CLUE[id].main);
    if (c) U.toast({ icon: 'eyes', kind: 'info', ms: 8000, text: c });
  };

  /* near them: a cue as you step into the room next to where they went, and another when you arrive */
  function neighbours(z) {
    const out = [];
    (EM.zones[z] && EM.zones[z].ents || []).forEach(function (e) { if (e.type === 'door' && out.indexOf(e.to) === -1) out.push(e.to); });
    return out;
  }
  const enter1 = story.enter;
  story.enter = function (zone) {
    enter1(zone);
    const s = EM.state; if (!s) return;
    const targets = EM.seekTargets(s);
    Object.keys(targets).forEach(function (k) {
      const x = targets[k]; if (!FR_NAME[k]) return;
      const key = 'cue_' + k + '_' + zone;
      if (s.res[key]) return;
      const nm = EM.CAST[k].name;
      if (x.zone === zone) {
        s.res[key] = true;
        U.toast({ icon: 'star', kind: 'info', ms: 5000, text: t(`${nm} is in this room. Look for the golden star.`, `${nm} está en esta sala. Busca la estrella dorada.`, `${nm} tá nessa sala. Procure a estrela dourada.`) });
      } else if (neighbours(zone).indexOf(x.zone) !== -1) {
        s.res[key] = true;
        U.toast({ icon: 'eyes', kind: 'info', ms: 5000, text: t(`Close. A voice you know drifts over from the next room along. Follow the golden arrow.`, `Cerca. Una voz conocida llega desde la sala de al lado. Sigue la flecha dorada.`, `Perto. Uma voz conhecida vem da sala ao lado. Siga a seta dourada.`) });
      }
    });
  };
})();

/* ==========================================================================
   TECHNO VARIANTS — UI controller (matrix, pads, reference menu, i18n)
   Audio lives in engine.js; data in tracks.js.
   ========================================================================== */
(function () {
  'use strict';

  const Engine = window.TVEngine;
  const GENRES = window.TV_GENRES;
  const SOURCES = window.TV_SOURCES;
  const S = Engine.state;
  const GENRE_KEYS = Object.keys(GENRES);

  /* ----------------------------------------------------------------------- i18n (EN / ES / PT) */
  const I18N = {
    en: {
      'status.ready': 'CLOCK READY', 'status.running': 'ENGINE RUNNING', 'status.paused': 'PAUSED', 'status.stopped': 'STOPPED',
      'btn.play': '▶ PLAY @ {bpm} BPM', 'btn.pause': '❚❚ PAUSE @ {bpm} BPM', 'btn.stop': '■ STOP', 'btn.clear': 'CLEAR', 'btn.random': 'RANDOMIZE',
      'btn.loadGroove': '▶ LOAD STYLE GROOVE', 'btn.findOriginal': 'FIND ORIGINAL ↗', 'btn.loadListen': '▶ LOAD & LISTEN', 'btn.playing': '❚❚ PLAYING',
      'btn.menuOpen': '[5-TRACK MENU ▾]', 'btn.menuClose': '[CLOSE MENU ▴]',
      'aria.bpmDown': 'Decrease tempo by 1 BPM', 'aria.bpmUp': 'Increase tempo by 1 BPM',
      'lbl.swing': 'SWING', 'lbl.style': 'STYLE:', 'lbl.ref': 'REF', 'lbl.driver': 'DRIVER', 'lbl.refs': 'REFERENCE TRACKS (5):',
      'lbl.scope': 'LIVE OSCILLOSCOPE', 'lbl.pads': 'PERFORMANCE PADS', 'lbl.keys': '[KEYS 1-8]', 'lbl.matrix': '16-STEP MATRIX', 'lbl.voice': 'TRACK / VOICE',
      'msg.templates': 'GROOVES ARE STYLE TEMPLATES, NOT TRANSCRIPTIONS OF THE RECORDS',
      'msg.help': 'Click a pad to audition a voice. Click step pads to cycle: Off → Normal → Accent.',
      'guide.title': '+ COMPARATIVE KNOWLEDGE BASE & SUBGENRE PROFILES', 'guide.expand': '[ EXPAND ]',
      'guide.col.genre': 'Subgenre', 'guide.col.tracks': 'Reference tracks (from specialist lists)', 'guide.col.driver': 'Rhythmic driver', 'guide.col.low': 'Low end', 'guide.col.bpm': 'Style BPM',
      'guide.note': 'Reference tracks are picks from the named lists. Grooves, sounds and tempos in the machine are style templates for each subgenre, not reproductions of the referenced records. Verify details at the linked source.',
      'drawer.title': '{genre} — SOURCED REFERENCE LIST', 'card.source': 'SOURCE', 'card.listed': 'LISTED TEMPO {bpm} BPM', 'card.style': 'STYLE TEMPO {bpm} BPM',
      'format.track': 'TRACK', 'format.EP': 'EP', 'format.album': 'ALBUM',
      'transport.stopped': 'STOPPED • STEP 0/16', 'transport.paused': 'PAUSED @ {bpm} BPM', 'transport.playing': 'PLAYING • STEP {step}/16 @ {bpm} BPM',
      'toast.playing': 'Playing @ {bpm} BPM • {name}', 'toast.loaded': 'Loaded: {name} ({bpm} BPM)', 'toast.cleared': 'Sequencer cleared', 'toast.random': 'Randomized groove',
      'toast.tempo': 'Tempo set to {bpm} BPM', 'toast.stopped': 'Stopped (rewound to step 1)', 'toast.noteSet': '{voice} step {step} set to {note}',
      'toast.genre': 'Style: {name}',
      'aria.presets': 'Subgenre presets', 'aria.refsSection': 'Reference tracks', 'aria.performance': 'Performance', 'aria.sequencer': 'Sequencer', 'doc.title': 'Techno Variants Engine — Subgenre Sound Lab & 16-Step Drum Machine', 'label.self': 'Self-released',
      'toast.lite': 'Performance mode: reverb/delay reduced to keep timing', 'toast.suspended': 'Audio paused by the browser — press PLAY to resume', 'toast.restarted': 'Audio device restarted',
      'voice.kick': 'KICK DRUM', 'voice.bass': 'BASSLINE', 'voice.congaHigh': 'CONGA HIGH', 'voice.congaLow': 'CONGA LOW', 'voice.hat': 'HI-HAT / SHAKER', 'voice.openHat': 'OPEN HAT', 'voice.clap': 'CLAP', 'voice.synth': 'TECHNO STAB',
      'pad.kick': 'KICK', 'pad.bass': 'BASS', 'pad.congaHigh': 'CONGA HI', 'pad.congaLow': 'CONGA LO', 'pad.hat': 'HAT', 'pad.openHat': 'OPEN HAT', 'pad.clap': 'CLAP', 'pad.synth': 'STAB',
      'drawer.params': '{voice} PARAMETERS', 'drawer.transpose': 'TRANSPOSE', 'drawer.decay': 'DECAY', 'drawer.level': 'LEVEL', 'drawer.pan': 'PAN', 'drawer.timbre': 'TIMBRE',
      'timbre.closed': 'CLOSED HAT', 'timbre.shaker': 'SHAKER', 'drawer.stepNote': 'STEP NOTE:', 'drawer.noteKick': 'TUNE', 'drawer.noteNote': 'NOTE',
      'aria.pad': 'Play {voice}', 'aria.step': '{voice}, step {step}, {state}', 'aria.mute': 'Mute {voice}', 'aria.solo': 'Solo {voice}', 'aria.drawer': 'Open parameters for {voice}',
      'state.off': 'off', 'state.normal': 'normal', 'state.accent': 'accent', 'pan.c': 'C', 'pan.l': 'L', 'pan.r': 'R',
      'btn.mute': 'Mute', 'btn.solo': 'Solo'
    },
    es: {
      'status.ready': 'RELOJ LISTO', 'status.running': 'MOTOR ACTIVO', 'status.paused': 'EN PAUSA', 'status.stopped': 'DETENIDO',
      'btn.play': '▶ REPRODUCIR @ {bpm} BPM', 'btn.pause': '❚❚ PAUSA @ {bpm} BPM', 'btn.stop': '■ DETENER', 'btn.clear': 'LIMPIAR', 'btn.random': 'ALEATORIO',
      'btn.loadGroove': '▶ CARGAR GROOVE DE ESTILO', 'btn.findOriginal': 'BUSCAR ORIGINAL ↗', 'btn.loadListen': '▶ CARGAR Y ESCUCHAR', 'btn.playing': '❚❚ SONANDO',
      'btn.menuOpen': '[MENÚ DE 5 TEMAS ▾]', 'btn.menuClose': '[CERRAR MENÚ ▴]',
      'aria.bpmDown': 'Bajar el tempo 1 BPM', 'aria.bpmUp': 'Subir el tempo 1 BPM',
      'lbl.swing': 'SWING', 'lbl.style': 'ESTILO:', 'lbl.ref': 'REF', 'lbl.driver': 'RITMO', 'lbl.refs': 'TEMAS DE REFERENCIA (5):',
      'lbl.scope': 'OSCILOSCOPIO EN VIVO', 'lbl.pads': 'PADS DE INTERPRETACIÓN', 'lbl.keys': '[TECLAS 1-8]', 'lbl.matrix': 'MATRIZ DE 16 PASOS', 'lbl.voice': 'PISTA / VOZ',
      'msg.templates': 'LOS GROOVES SON PLANTILLAS DE ESTILO, NO TRANSCRIPCIONES DE LOS DISCOS',
      'msg.help': 'Haz clic en un pad para escuchar una voz. Haz clic en los pasos para alternar: Apagado → Normal → Acento.',
      'guide.title': '+ BASE DE CONOCIMIENTO COMPARATIVA Y PERFILES DE SUBGÉNERO', 'guide.expand': '[ EXPANDIR ]',
      'guide.col.genre': 'Subgénero', 'guide.col.tracks': 'Temas de referencia (de listas especializadas)', 'guide.col.driver': 'Motor rítmico', 'guide.col.low': 'Graves', 'guide.col.bpm': 'BPM de estilo',
      'guide.note': 'Los temas de referencia son selecciones de las listas citadas. Los grooves, sonidos y tempos de la máquina son plantillas de estilo para cada subgénero, no reproducciones de los discos citados. Verifica los detalles en la fuente enlazada.',
      'drawer.title': '{genre} — LISTA DE REFERENCIA CON FUENTES', 'card.source': 'FUENTE', 'card.listed': 'TEMPO LISTADO {bpm} BPM', 'card.style': 'TEMPO DE ESTILO {bpm} BPM',
      'format.track': 'TEMA', 'format.EP': 'EP', 'format.album': 'ÁLBUM',
      'transport.stopped': 'DETENIDO • PASO 0/16', 'transport.paused': 'EN PAUSA @ {bpm} BPM', 'transport.playing': 'REPRODUCIENDO • PASO {step}/16 @ {bpm} BPM',
      'toast.playing': 'Sonando @ {bpm} BPM • {name}', 'toast.loaded': 'Cargado: {name} ({bpm} BPM)', 'toast.cleared': 'Secuenciador limpio', 'toast.random': 'Groove aleatorio',
      'toast.tempo': 'Tempo fijado en {bpm} BPM', 'toast.stopped': 'Detenido (vuelve al paso 1)', 'toast.noteSet': '{voice}: paso {step} = {note}',
      'toast.genre': 'Estilo: {name}',
      'aria.presets': 'Presets de subgénero', 'aria.refsSection': 'Temas de referencia', 'aria.performance': 'Interpretación', 'aria.sequencer': 'Secuenciador', 'doc.title': 'Techno Variants Engine — Laboratorio de sonido de subgéneros y caja de ritmos de 16 pasos', 'label.self': 'Autoeditado',
      'toast.lite': 'Modo rendimiento: reverb/delay reducidos para mantener el tempo', 'toast.suspended': 'Audio en pausa por el navegador — pulsa REPRODUCIR para continuar', 'toast.restarted': 'Dispositivo de audio reiniciado',
      'voice.kick': 'BOMBO', 'voice.bass': 'LÍNEA DE BAJO', 'voice.congaHigh': 'CONGA AGUDA', 'voice.congaLow': 'CONGA GRAVE', 'voice.hat': 'HI-HAT / SHAKER', 'voice.openHat': 'HI-HAT ABIERTO', 'voice.clap': 'PALMAS', 'voice.synth': 'ACORDE TECHNO',
      'pad.kick': 'BOMBO', 'pad.bass': 'BAJO', 'pad.congaHigh': 'CONGA AG', 'pad.congaLow': 'CONGA GR', 'pad.hat': 'HAT', 'pad.openHat': 'HAT ABIERTO', 'pad.clap': 'PALMAS', 'pad.synth': 'ACORDE',
      'drawer.params': 'PARÁMETROS: {voice}', 'drawer.transpose': 'TRANSPOSICIÓN', 'drawer.decay': 'DECAIMIENTO', 'drawer.level': 'NIVEL', 'drawer.pan': 'PAN', 'drawer.timbre': 'TIMBRE',
      'timbre.closed': 'HI-HAT CERRADO', 'timbre.shaker': 'SHAKER', 'drawer.stepNote': 'NOTA DEL PASO:', 'drawer.noteKick': 'AFINACIÓN', 'drawer.noteNote': 'NOTA',
      'aria.pad': 'Tocar {voice}', 'aria.step': '{voice}, paso {step}, {state}', 'aria.mute': 'Silenciar {voice}', 'aria.solo': 'Solo {voice}', 'aria.drawer': 'Abrir parámetros de {voice}',
      'state.off': 'apagado', 'state.normal': 'normal', 'state.accent': 'acento', 'pan.c': 'C', 'pan.l': 'I', 'pan.r': 'D',
      'btn.mute': 'Silenciar', 'btn.solo': 'Solo'
    },
    pt: {
      'status.ready': 'RELÓGIO PRONTO', 'status.running': 'MOTOR ATIVO', 'status.paused': 'PAUSADO', 'status.stopped': 'PARADO',
      'btn.play': '▶ TOCAR @ {bpm} BPM', 'btn.pause': '❚❚ PAUSAR @ {bpm} BPM', 'btn.stop': '■ PARAR', 'btn.clear': 'LIMPAR', 'btn.random': 'ALEATÓRIO',
      'btn.loadGroove': '▶ CARREGAR GROOVE DE ESTILO', 'btn.findOriginal': 'PROCURAR ORIGINAL ↗', 'btn.loadListen': '▶ CARREGAR E OUVIR', 'btn.playing': '❚❚ TOCANDO',
      'btn.menuOpen': '[MENU DE 5 FAIXAS ▾]', 'btn.menuClose': '[FECHAR MENU ▴]',
      'aria.bpmDown': 'Diminuir o andamento em 1 BPM', 'aria.bpmUp': 'Aumentar o andamento em 1 BPM',
      'lbl.swing': 'SWING', 'lbl.style': 'ESTILO:', 'lbl.ref': 'REF', 'lbl.driver': 'RITMO', 'lbl.refs': 'FAIXAS DE REFERÊNCIA (5):',
      'lbl.scope': 'OSCILOSCÓPIO AO VIVO', 'lbl.pads': 'PADS DE PERFORMANCE', 'lbl.keys': '[TECLAS 1-8]', 'lbl.matrix': 'MATRIZ DE 16 PASSOS', 'lbl.voice': 'PISTA / VOZ',
      'msg.templates': 'OS GROOVES SÃO MODELOS DE ESTILO, NÃO TRANSCRIÇÕES DOS DISCOS',
      'msg.help': 'Clique num pad para ouvir uma voz. Clique nos passos para alternar: Desligado → Normal → Acento.',
      'guide.title': '+ BASE DE CONHECIMENTO COMPARATIVA E PERFIS DE SUBGÊNERO', 'guide.expand': '[ EXPANDIR ]',
      'guide.col.genre': 'Subgênero', 'guide.col.tracks': 'Faixas de referência (de listas especializadas)', 'guide.col.driver': 'Motor rítmico', 'guide.col.low': 'Graves', 'guide.col.bpm': 'BPM de estilo',
      'guide.note': 'As faixas de referência são escolhas das listas citadas. Os grooves, sons e andamentos da máquina são modelos de estilo de cada subgênero, não reproduções dos discos citados. Verifique os detalhes na fonte vinculada.',
      'drawer.title': '{genre} — LISTA DE REFERÊNCIA COM FONTES', 'card.source': 'FONTE', 'card.listed': 'ANDAMENTO LISTADO {bpm} BPM', 'card.style': 'ANDAMENTO DE ESTILO {bpm} BPM',
      'format.track': 'FAIXA', 'format.EP': 'EP', 'format.album': 'ÁLBUM',
      'transport.stopped': 'PARADO • PASSO 0/16', 'transport.paused': 'PAUSADO @ {bpm} BPM', 'transport.playing': 'TOCANDO • PASSO {step}/16 @ {bpm} BPM',
      'toast.playing': 'Tocando @ {bpm} BPM • {name}', 'toast.loaded': 'Carregado: {name} ({bpm} BPM)', 'toast.cleared': 'Sequenciador limpo', 'toast.random': 'Groove aleatório',
      'toast.tempo': 'Andamento definido em {bpm} BPM', 'toast.stopped': 'Parado (volta ao passo 1)', 'toast.noteSet': '{voice}: passo {step} = {note}',
      'toast.genre': 'Estilo: {name}',
      'aria.presets': 'Presets de subgênero', 'aria.refsSection': 'Faixas de referência', 'aria.performance': 'Performance', 'aria.sequencer': 'Sequenciador', 'doc.title': 'Techno Variants Engine — Laboratório de som de subgêneros e caixa de ritmos de 16 passos', 'label.self': 'Autoeditado',
      'toast.lite': 'Modo desempenho: reverb/delay reduzidos para manter o tempo', 'toast.suspended': 'Áudio pausado pelo navegador — toque em TOCAR para continuar', 'toast.restarted': 'Dispositivo de áudio reiniciado',
      'voice.kick': 'BUMBO', 'voice.bass': 'LINHA DE BAIXO', 'voice.congaHigh': 'CONGA AGUDA', 'voice.congaLow': 'CONGA GRAVE', 'voice.hat': 'HI-HAT / SHAKER', 'voice.openHat': 'HI-HAT ABERTO', 'voice.clap': 'PALMAS', 'voice.synth': 'ACORDE TECHNO',
      'pad.kick': 'BUMBO', 'pad.bass': 'BAIXO', 'pad.congaHigh': 'CONGA AG', 'pad.congaLow': 'CONGA GR', 'pad.hat': 'HAT', 'pad.openHat': 'HAT ABERTO', 'pad.clap': 'PALMAS', 'pad.synth': 'ACORDE',
      'drawer.params': 'PARÂMETROS: {voice}', 'drawer.transpose': 'TRANSPOSIÇÃO', 'drawer.decay': 'DECAIMENTO', 'drawer.level': 'NÍVEL', 'drawer.pan': 'PAN', 'drawer.timbre': 'TIMBRE',
      'timbre.closed': 'HI-HAT FECHADO', 'timbre.shaker': 'SHAKER', 'drawer.stepNote': 'NOTA DO PASSO:', 'drawer.noteKick': 'AFINAÇÃO', 'drawer.noteNote': 'NOTA',
      'aria.pad': 'Tocar {voice}', 'aria.step': '{voice}, passo {step}, {state}', 'aria.mute': 'Silenciar {voice}', 'aria.solo': 'Solo {voice}', 'aria.drawer': 'Abrir parâmetros de {voice}',
      'state.off': 'desligado', 'state.normal': 'normal', 'state.accent': 'acento', 'pan.c': 'C', 'pan.l': 'E', 'pan.r': 'D',
      'btn.mute': 'Silenciar', 'btn.solo': 'Solo'
    }
  };

  let lang = 'en';

  function t(key, vars) {
    let s = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }

  function pick(obj) { return (obj && (obj[lang] || obj.en)) || ''; }

  function detectLang() {
    const valid = l => ['en', 'es', 'pt'].indexOf(l) !== -1;
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q && valid(q.toLowerCase())) return q.toLowerCase();
    } catch (e) { /* ignore */ }
    try {
      const saved = localStorage.getItem('preferred-lang');
      if (valid(saved)) return saved;
    } catch (e) { /* storage unavailable */ }
    try {
      const pl = window.parent && window.parent !== window ? window.parent.document.documentElement.lang : '';
      if (valid(pl)) return pl;
    } catch (e) { /* cross-origin */ }
    const nav = (navigator.languages || [navigator.language || '']).map(l => (l || '').slice(0, 2).toLowerCase());
    for (const l of nav) if (valid(l)) return l;
    return 'en';
  }

  function applyStaticI18n() {
    document.documentElement.lang = lang;
    document.title = t('doc.title');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
  }

  /* ----------------------------------------------------------------------- state */
  let genreKey = 'hardgroove';
  let trackIdx = 0;
  let openDrawerVoice = null;
  const selectedStep = {};
  S.voices.forEach(v => { selectedStep[v.id] = 0; });
  let transportMode = 'stopped';   // stopped | playing | paused
  let toastTimer = null;
  const drawQueue = [];

  const $ = id => document.getElementById(id);
  const voiceName = v => t('voice.' + v.id);
  const noteLabel = v => (v.id === 'kick' ? t('drawer.noteKick') : t('drawer.noteNote'));

  function showToast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.style.display = 'none'; }, 2200);
  }

  function postHeight() {
    if (window.parent === window) return;
    const h = Math.ceil(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
    window.parent.postMessage({ type: 'resize-games-iframe', height: h }, window.location.origin);
  }

  /* ----------------------------------------------------------------------- track loading */
  function decodePattern(str) { return str.split('').map(Number); }

  function applyGenreSound(gKey) {
    const g = GENRES[gKey];
    const kick = S.voices.find(v => v.id === 'kick');
    kick.baseNote = g.sound.kickNote; kick.decay = g.sound.kickDecay; kick.tune = 0;
    const hat = S.voices.find(v => v.id === 'hat');
    hat.timbre = g.sound.hat; hat.decay = g.sound.hat === 'shaker' ? 0.07 : 0.05;
    Engine.applyProfile(g.sound);
  }

  function loadTrack(gKey, idx, autoPlay) {
    genreKey = gKey;
    const g = GENRES[gKey];
    trackIdx = Math.max(0, Math.min(idx, g.tracks.length - 1));
    const track = g.tracks[trackIdx];

    applyGenreSound(gKey);

    S.pattern = {};
    Object.keys(track.pattern).forEach(k => { S.pattern[k] = decodePattern(track.pattern[k]); });
    S.pitches = {};
    S.voices.forEach(v => {
      S.pitches[v.id] = track.pitches[v.id] ? track.pitches[v.id].split(' ') : (v.isTonal ? Array(16).fill(v.baseNote) : []);
    });
    // the kick plays its own tuned note on every step
    S.pitches.kick = Array(16).fill(S.voices.find(v => v.id === 'kick').baseNote);

    S.bpm = track.bpm || g.bpm;
    S.swing = g.swing / 100;
    Engine.setTempo(S.bpm);
    syncTempoUI();

    renderPresets();
    renderReference();
    renderMatrix();
    renderSummary();
    if (autoPlay) {
      if (transportMode !== 'playing') startPlayback();
      showToast(t('toast.playing', { bpm: S.bpm, name: trackName(track) }));
    } else {
      showToast(t('toast.loaded', { name: trackName(track), bpm: S.bpm }));
    }
    postHeight();
  }

  const labelName = l => (l === 'Self-released' ? t('label.self') : l);

  function trackName(tr) {
    return tr.artist + ' – ' + tr.title + (tr.version ? ' (' + tr.version + ')' : '');
  }

  function syncTempoUI() {
    $('bpm-input').value = S.bpm;
    $('swing-input').value = Math.round(S.swing * 100);
    $('swing-val').textContent = Math.round(S.swing * 100) + '%';
    updatePlayButton();
  }

  /* ----------------------------------------------------------------------- transport */
  function setStatus(key) { $('clock-status').textContent = t(key); $('clock-status').dataset.i18n = key; }

  function updatePlayButton() {
    const b = $('btn-play-master');
    b.textContent = t(transportMode === 'playing' ? 'btn.pause' : 'btn.play', { bpm: S.bpm });
    b.classList.toggle('playing', transportMode === 'playing');
    $('btn-bpm-dec').setAttribute('aria-label', t('aria.bpmDown'));
    $('btn-bpm-inc').setAttribute('aria-label', t('aria.bpmUp'));
  }

  function updateReadout(step) {
    const el = $('transport-readout');
    if (transportMode === 'playing') el.textContent = t('transport.playing', { step: (step === undefined ? 0 : step) + 1, bpm: S.bpm });
    else if (transportMode === 'paused') el.textContent = t('transport.paused', { bpm: S.bpm });
    else el.textContent = t('transport.stopped');
  }

  function startPlayback() {
    Engine.resume();                         // synchronous inside the user gesture
    Engine.start((step, time) => { drawQueue.push({ step, time }); });
    transportMode = 'playing';
    setStatus('status.running');
    updatePlayButton();
    updateReadout(0);
    ensureScope();
  }

  function pausePlayback() {
    Engine.pause();
    drawQueue.length = 0;
    transportMode = 'paused';
    setStatus('status.paused');
    updatePlayButton();
    updateReadout();
    clearStepHighlight();
  }

  function stopPlayback() {
    Engine.stop();
    drawQueue.length = 0;
    transportMode = 'stopped';
    setStatus('status.stopped');
    updatePlayButton();
    updateReadout();
    clearStepHighlight();
    showToast(t('toast.stopped'));
  }

  function togglePlayback() { if (transportMode === 'playing') pausePlayback(); else startPlayback(); }

  /* visual clock: highlight a step when it is actually audible (audio time + output latency) */
  function visualLoop() {
    const ctx = Engine.ctx;
    if (ctx && drawQueue.length) {
      const now = ctx.currentTime - Engine.latency();
      while (drawQueue.length && drawQueue[0].time <= now) highlightStep(drawQueue.shift().step);
    }
    requestAnimationFrame(visualLoop);
  }

  function highlightStep(step) {
    document.querySelectorAll('.step-marker').forEach((m, i) => m.classList.toggle('active-step', i === step));
    document.querySelectorAll('.step-pad').forEach(p => p.classList.toggle('current-playing', Number(p.dataset.step) === step));
    updateReadout(step);
  }

  function clearStepHighlight() {
    document.querySelectorAll('.step-marker.active-step, .step-pad.current-playing').forEach(el => el.classList.remove('active-step', 'current-playing'));
  }

  /* ----------------------------------------------------------------------- scope (monochrome) */
  let scopeStarted = false;
  function ensureScope() {
    if (scopeStarted || !Engine.nodes) return;
    scopeStarted = true;
    const canvas = $('scope-canvas'), c2d = canvas.getContext('2d');
    const data = new Uint8Array(1024);
    (function draw() {
      requestAnimationFrame(draw);
      if (document.hidden) return;
      const analyser = Engine.nodes && Engine.nodes.analyser;      // re-read: the context may have been rebuilt
      if (!analyser) return;
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
      }
      analyser.getByteTimeDomainData(data);
      c2d.fillStyle = '#0A0A0A';
      c2d.fillRect(0, 0, canvas.width, canvas.height);
      c2d.strokeStyle = '#7F7F7F'; c2d.lineWidth = 1;
      c2d.beginPath(); c2d.moveTo(0, canvas.height / 2); c2d.lineTo(canvas.width, canvas.height / 2); c2d.stroke();
      c2d.strokeStyle = '#FFFFFF'; c2d.lineWidth = 1.5;
      c2d.beginPath();
      const slice = canvas.width / data.length;
      for (let i = 0; i < data.length; i++) {
        const y = (data[i] / 128.0) * canvas.height / 2;
        if (i === 0) c2d.moveTo(0, y); else c2d.lineTo(i * slice, y);
      }
      c2d.stroke();
    })();
  }

  /* ----------------------------------------------------------------------- render: presets / reference / summary */
  function renderPresets() {
    const group = $('preset-group');
    group.querySelectorAll('.preset-btn').forEach(b => b.remove());
    GENRE_KEYS.forEach(k => {
      const g = GENRES[k];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'preset-btn' + (k === genreKey ? ' is-active' : '');
      b.dataset.preset = k;
      b.setAttribute('aria-pressed', k === genreKey ? 'true' : 'false');
      b.textContent = pick(g.name) + ' (' + g.bpm + ')';
      b.addEventListener('click', () => { loadTrack(k, 0, false); showToast(t('toast.genre', { name: pick(g.name) })); });
      group.appendChild(b);
    });
  }

  function renderSummary() {
    const g = GENRES[genreKey], tr = g.tracks[trackIdx];
    $('summary-ref').textContent = trackName(tr);
    $('summary-driver').textContent = pick(g.driver);
  }

  function sourceFor(tr) { return SOURCES[tr.source]; }

  function searchUrl(tr) {
    return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(tr.artist + ' ' + tr.title + (tr.version ? ' ' + tr.version : ''));
  }

  function renderReference() {
    const g = GENRES[genreKey];
    const select = $('ref-track-select');
    select.innerHTML = '';
    g.tracks.forEach((tr, i) => {
      const o = document.createElement('option');
      o.value = i;
      o.textContent = '[' + String(i + 1).padStart(2, '0') + '] ' + trackName(tr) + ' — ' + labelName(tr.label) + ', ' + tr.year;
      if (i === trackIdx) o.selected = true;
      select.appendChild(o);
    });
    $('btn-ref-external').href = searchUrl(g.tracks[trackIdx]);
    $('ref-drawer-title').textContent = t('drawer.title', { genre: pick(g.name).toUpperCase() });
    const toggle = $('btn-toggle-ref-drawer');
    toggle.textContent = t($('ref-drawer').hidden ? 'btn.menuOpen' : 'btn.menuClose');

    const cards = $('ref-cards');
    cards.innerHTML = '';
    g.tracks.forEach((tr, i) => {
      const src = sourceFor(tr);
      const card = document.createElement('div');
      card.className = 'ref-card' + (i === trackIdx ? ' active' : '');

      const title = document.createElement('div'); title.className = 'ref-card-title'; title.textContent = trackName(tr);
      const meta = document.createElement('div'); meta.className = 'ref-card-meta';
      meta.textContent = labelName(tr.label) + ' • ' + tr.year + ' • ' + t('format.' + tr.format) + ' • ' +
        (tr.bpm ? t('card.listed', { bpm: tr.bpm }) : t('card.style', { bpm: g.bpm }));
      const source = document.createElement('div'); source.className = 'ref-card-source';
      source.append(t('card.source') + ': ');
      const a = document.createElement('a'); a.href = src.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.textContent = src.outlet + ' — ' + src.title;
      a.addEventListener('click', e => e.stopPropagation());
      source.appendChild(a);

      const actions = document.createElement('div'); actions.className = 'ref-card-actions';
      const load = document.createElement('button'); load.type = 'button';
      load.textContent = (i === trackIdx && transportMode === 'playing') ? t('btn.playing') : t('btn.loadListen');
      load.addEventListener('click', e => { e.stopPropagation(); loadTrack(genreKey, i, true); });
      const find = document.createElement('a'); find.href = searchUrl(tr); find.target = '_blank'; find.rel = 'noopener noreferrer';
      find.textContent = t('btn.findOriginal'); find.addEventListener('click', e => e.stopPropagation());
      actions.append(load, find);

      card.append(title, meta, source, actions);
      card.addEventListener('click', () => loadTrack(genreKey, i, true));
      cards.appendChild(card);
    });
  }

  function renderGuide() {
    const body = $('guide-body');
    body.innerHTML = '';
    GENRE_KEYS.forEach(k => {
      const g = GENRES[k];
      const tr = document.createElement('tr');
      const c1 = document.createElement('td'); c1.textContent = pick(g.name); c1.style.fontWeight = '700';
      const c2 = document.createElement('td');
      g.tracks.forEach((x, i) => {
        const src = sourceFor(x);
        const line = document.createElement('div');
        line.append(trackName(x) + ' · ');
        const a = document.createElement('a'); a.href = src.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = src.outlet;
        line.appendChild(a);
        c2.appendChild(line);
      });
      const c3 = document.createElement('td'); c3.textContent = pick(g.driver);
      const c4 = document.createElement('td'); c4.textContent = pick(g.low);
      const c5 = document.createElement('td'); c5.textContent = g.bpm;
      tr.append(c1, c2, c3, c4, c5);
      body.appendChild(tr);
    });
  }

  /* ----------------------------------------------------------------------- render: pads + matrix */
  const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8'];

  function renderPads() {
    const box = $('mpc-pads');
    box.innerHTML = '';
    S.voices.forEach((v, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pad-btn';
      b.dataset.voice = v.id;
      b.style.setProperty('--voice-color', v.color);
      b.setAttribute('aria-label', t('aria.pad', { voice: voiceName(v) }));
      const k = document.createElement('span'); k.className = 'pad-key'; k.textContent = '[' + KEYS[i] + ']';
      const n = document.createElement('span'); n.className = 'pad-name'; n.textContent = t('pad.' + v.id);
      b.append(k, n);
      if (v.isTonal && v.id !== 'kick') {
        const note = document.createElement('span'); note.className = 'pad-note'; note.textContent = v.baseNote; b.appendChild(note);
      } else if (v.id === 'kick') {
        const note = document.createElement('span'); note.className = 'pad-note'; note.textContent = v.baseNote; b.appendChild(note);
      }
      b.addEventListener('pointerdown', e => { e.preventDefault(); hitPad(v.id); });
      b.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); hitPad(v.id); } });
      box.appendChild(b);
    });
  }

  function hitPad(voiceId) {
    Engine.resume();
    ensureScope();
    const ctx = Engine.ctx;
    if (ctx) Engine.trigger(voiceId, ctx.currentTime + 0.005, 1.0, 0);
    const pad = document.querySelector('.pad-btn[data-voice="' + voiceId + '"]');
    if (pad) { pad.classList.add('triggered'); setTimeout(() => pad.classList.remove('triggered'), 120); }
  }

  function renderStepMarkers() {
    const c = $('step-markers');
    c.innerHTML = '';
    const lead = document.createElement('span'); lead.style.textAlign = 'left'; lead.style.paddingLeft = '4px'; lead.textContent = t('lbl.voice');
    c.appendChild(lead);
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('span');
      s.className = 'step-marker' + (i % 4 === 0 ? ' downbeat' : '');
      s.textContent = i + 1;
      c.appendChild(s);
    }
  }

  function stateName(level) { return t(level === 2 ? 'state.accent' : level === 1 ? 'state.normal' : 'state.off'); }

  function paintPad(pad, v, step) {
    const level = (S.pattern[v.id] && S.pattern[v.id][step]) || 0;
    pad.className = 'step-pad' + (step % 4 === 0 ? ' beat-boundary' : '') + (level === 2 ? ' active-accent' : level === 1 ? ' active-normal' : '');
    pad.setAttribute('aria-pressed', level > 0 ? 'true' : 'false');
    pad.setAttribute('aria-label', t('aria.step', { voice: voiceName(v), step: step + 1, state: stateName(level) }));
    pad.textContent = '';
    if (level > 0 && v.isTonal) {
      const note = (S.pitches[v.id] && S.pitches[v.id][step]) || v.baseNote;
      const s = document.createElement('span'); s.textContent = Engine.transposeNote(note, v.tune); pad.appendChild(s);
      if (level === 2) { const a = document.createElement('span'); a.style.fontSize = '6px'; a.textContent = '▲'; pad.appendChild(a); }
    } else if (level === 2) {
      pad.textContent = '▲';
    }
  }

  function renderMatrix() {
    const container = $('matrix-rows');
    container.innerHTML = '';
    S.voices.forEach(v => {
      const block = document.createElement('div');
      block.className = 'voice-row-block';
      block.id = 'block-' + v.id;
      block.style.setProperty('--voice-color', v.color);

      const row = document.createElement('div');
      row.className = 'voice-row';

      const header = document.createElement('div'); header.className = 'voice-header';
      const label = document.createElement('button');
      label.type = 'button'; label.className = 'voice-label';
      label.setAttribute('aria-label', t('aria.drawer', { voice: voiceName(v) }));
      const dot = document.createElement('span'); dot.className = 'voice-dot';
      const title = document.createElement('span'); title.className = 'voice-title'; title.textContent = voiceName(v);
      label.append(dot, title);
      label.addEventListener('click', () => toggleDrawer(v.id));

      const actions = document.createElement('div'); actions.className = 'voice-actions';
      const mute = document.createElement('button'); mute.type = 'button'; mute.className = 'btn-track'; mute.textContent = 'M';
      mute.title = t('btn.mute'); mute.setAttribute('aria-label', t('aria.mute', { voice: voiceName(v) }));
      mute.setAttribute('aria-pressed', S.tracks[v.id].muted ? 'true' : 'false');
      mute.classList.toggle('active-mute', S.tracks[v.id].muted);
      mute.addEventListener('click', () => {
        S.tracks[v.id].muted = !S.tracks[v.id].muted;
        mute.classList.toggle('active-mute', S.tracks[v.id].muted);
        mute.setAttribute('aria-pressed', S.tracks[v.id].muted ? 'true' : 'false');
      });
      const solo = document.createElement('button'); solo.type = 'button'; solo.className = 'btn-track'; solo.textContent = 'S';
      solo.title = t('btn.solo'); solo.setAttribute('aria-label', t('aria.solo', { voice: voiceName(v) }));
      solo.setAttribute('aria-pressed', S.tracks[v.id].solo ? 'true' : 'false');
      solo.classList.toggle('active-solo', S.tracks[v.id].solo);
      solo.addEventListener('click', () => {
        S.tracks[v.id].solo = !S.tracks[v.id].solo;
        solo.classList.toggle('active-solo', S.tracks[v.id].solo);
        solo.setAttribute('aria-pressed', S.tracks[v.id].solo ? 'true' : 'false');
      });
      const dr = document.createElement('button'); dr.type = 'button'; dr.className = 'btn-track';
      const isOpen = openDrawerVoice === v.id;
      dr.textContent = noteLabel(v) + (isOpen ? ' ▴' : ' ▾');
      dr.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      dr.setAttribute('aria-label', t('aria.drawer', { voice: voiceName(v) }));
      dr.style.minWidth = '48px';
      dr.addEventListener('click', () => toggleDrawer(v.id));
      if (v.id === 'hat' || v.id === 'openHat' || v.id === 'clap') { dr.textContent = (isOpen ? '▴' : '▾'); dr.style.minWidth = '28px'; }
      actions.append(mute, solo, dr);
      header.append(label, actions);
      row.appendChild(header);

      for (let i = 0; i < 16; i++) {
        const pad = document.createElement('button');
        pad.type = 'button';
        pad.dataset.voice = v.id; pad.dataset.step = i;
        pad.style.setProperty('--voice-color', v.color);
        paintPad(pad, v, i);
        pad.addEventListener('pointerdown', e => {
          e.preventDefault();
          Engine.resume();
          const arr = S.pattern[v.id] || (S.pattern[v.id] = Array(16).fill(0));
          arr[i] = (arr[i] + 1) % 3;
          paintPad(pad, v, i);
          const ctx = Engine.ctx;
          if (arr[i] > 0 && ctx) Engine.trigger(v.id, ctx.currentTime + 0.005, arr[i] === 2 ? 1.0 : 0.76, i);
        });
        pad.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); e.stopPropagation();
            const arr = S.pattern[v.id] || (S.pattern[v.id] = Array(16).fill(0));
            arr[i] = (arr[i] + 1) % 3; paintPad(pad, v, i); pad.focus();
          }
        });
        pad.addEventListener('contextmenu', e => {
          e.preventDefault();
          selectedStep[v.id] = i; openDrawerVoice = v.id; renderMatrix(); postHeight();
        });
        row.appendChild(pad);
      }
      block.appendChild(row);
      if (isOpen) block.appendChild(renderDrawer(v));
      container.appendChild(block);
    });
  }

  function toggleDrawer(id) {
    openDrawerVoice = openDrawerVoice === id ? null : id;
    renderMatrix();
    postHeight();
  }

  function sliderItem(labelKey, inputAttrs, valText, onInput) {
    const wrap = document.createElement('div'); wrap.className = 'slider-item';
    const id = 'sl-' + Math.random().toString(36).slice(2, 8);
    const lab = document.createElement('label'); lab.htmlFor = id; lab.textContent = t(labelKey);
    const inp = document.createElement('input'); inp.type = 'range'; inp.id = id;
    Object.keys(inputAttrs).forEach(k => inp.setAttribute(k, inputAttrs[k]));
    const val = document.createElement('span'); val.className = 'val'; val.textContent = valText;
    inp.addEventListener('input', () => { val.textContent = onInput(inp.value); });
    wrap.append(lab, inp, val);
    return wrap;
  }

  function renderDrawer(v) {
    const drawer = document.createElement('div');
    drawer.className = 'voice-drawer';
    drawer.style.setProperty('--voice-color', v.color);

    const ctrl = document.createElement('div'); ctrl.className = 'drawer-controls-row';
    const title = document.createElement('div'); title.className = 'drawer-title'; title.textContent = t('drawer.params', { voice: voiceName(v) });
    ctrl.appendChild(title);
    const sliders = document.createElement('div'); sliders.className = 'drawer-sliders';
    const selStep = selectedStep[v.id] || 0;
    const preview = () => { const c = Engine.ctx; if (c) Engine.trigger(v.id, c.currentTime + 0.005, 0.9, selStep); };

    if (v.isTonal) {
      sliders.appendChild(sliderItem('drawer.transpose', { min: -12, max: 12, value: v.tune }, (v.tune > 0 ? '+' : '') + v.tune + 'st', val => {
        v.tune = parseInt(val, 10);
        if (v.id === 'kick') S.pitches.kick = Array(16).fill(v.baseNote);
        renderMatrixPadsOnly(v); preview();
        return (v.tune > 0 ? '+' : '') + v.tune + 'st';
      }));
    }
    sliders.appendChild(sliderItem('drawer.decay', { min: 30, max: 600, value: Math.round(v.decay * 1000) }, Math.round(v.decay * 1000) + 'ms', val => {
      v.decay = parseInt(val, 10) / 1000; return Math.round(v.decay * 1000) + 'ms';
    }));
    sliders.appendChild(sliderItem('drawer.level', { min: 0, max: 100, value: Math.round(v.level * 100) }, Math.round(v.level * 100) + '%', val => {
      v.level = parseInt(val, 10) / 100; return Math.round(v.level * 100) + '%';
    }));
    const panText = p => (p === 0 ? t('pan.c') : p < 0 ? t('pan.l') : t('pan.r'));
    sliders.appendChild(sliderItem('drawer.pan', { min: -100, max: 100, value: Math.round(v.pan * 100) }, panText(v.pan), val => {
      v.pan = parseInt(val, 10) / 100; return panText(v.pan);
    }));
    if (v.id === 'hat') {
      const wrap = document.createElement('div'); wrap.className = 'slider-item';
      const id = 'sel-timbre';
      const lab = document.createElement('label'); lab.htmlFor = id; lab.textContent = t('drawer.timbre');
      const sel = document.createElement('select'); sel.id = id;
      ['closed', 'shaker'].forEach(k => { const o = document.createElement('option'); o.value = k; o.textContent = t('timbre.' + k); if (v.timbre === k) o.selected = true; sel.appendChild(o); });
      sel.addEventListener('change', () => { v.timbre = sel.value; v.decay = v.timbre === 'shaker' ? 0.07 : 0.05; preview(); renderMatrix(); });
      wrap.append(lab, sel); sliders.appendChild(wrap);
    }
    ctrl.appendChild(sliders);
    drawer.appendChild(ctrl);

    if (v.isTonal && v.id !== 'kick') {
      const kb = document.createElement('div'); kb.className = 'drawer-keyboard-row';
      const stepSel = document.createElement('div'); stepSel.className = 'step-pitch-selector';
      const lbl = document.createElement('span'); lbl.className = 'label'; lbl.textContent = t('drawer.stepNote'); stepSel.appendChild(lbl);
      const pitches = S.pitches[v.id] || (S.pitches[v.id] = Array(16).fill(v.baseNote));
      for (let s = 0; s < 16; s++) {
        const pill = document.createElement('button'); pill.type = 'button';
        pill.className = s === selStep ? 'sel' : '';
        pill.textContent = (s + 1) + ':' + (pitches[s] || v.baseNote);
        pill.addEventListener('click', () => { selectedStep[v.id] = s; renderMatrix(); const c = Engine.ctx; if (c) Engine.trigger(v.id, c.currentTime + 0.005, 0.9, s); });
        stepSel.appendChild(pill);
      }
      kb.appendChild(stepSel);
      const piano = document.createElement('div'); piano.className = 'piano-keys';
      ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].forEach(n => {
        const k = document.createElement('button'); k.type = 'button';
        k.className = 'piano-key ' + (n.indexOf('#') !== -1 ? 'black' : 'white'); k.textContent = n;
        k.addEventListener('click', () => {
          const full = n + (v.octave || 1);
          pitches[selStep] = full;
          renderMatrix();
          const c = Engine.ctx; if (c) Engine.trigger(v.id, c.currentTime + 0.005, 0.9, selStep);
          showToast(t('toast.noteSet', { voice: voiceName(v), step: selStep + 1, note: full }));
        });
        piano.appendChild(k);
      });
      kb.appendChild(piano);
      drawer.appendChild(kb);
    } else if (v.id === 'kick') {
      const kb = document.createElement('div'); kb.className = 'drawer-keyboard-row';
      const lbl = document.createElement('span'); lbl.className = 'label'; lbl.textContent = t('drawer.noteKick') + ': ' + Engine.transposeNote(v.baseNote, v.tune);
      kb.appendChild(lbl);
      const piano = document.createElement('div'); piano.className = 'piano-keys';
      ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].forEach(n => {
        const k = document.createElement('button'); k.type = 'button';
        k.className = 'piano-key ' + (n.indexOf('#') !== -1 ? 'black' : 'white'); k.textContent = n;
        k.addEventListener('click', () => {
          const oct = parseInt(v.baseNote.slice(-1), 10);
          v.baseNote = n + oct; v.tune = 0;
          S.pitches.kick = Array(16).fill(v.baseNote);
          renderMatrix();
          const c = Engine.ctx; if (c) Engine.trigger('kick', c.currentTime + 0.005, 0.9, 0);
        });
        piano.appendChild(k);
      });
      kb.appendChild(piano);
      drawer.appendChild(kb);
    }
    return drawer;
  }

  function renderMatrixPadsOnly(v) {
    document.querySelectorAll('.step-pad[data-voice="' + v.id + '"]').forEach(p => paintPad(p, v, Number(p.dataset.step)));
  }

  /* ----------------------------------------------------------------------- language switching */
  function setLang(next) {
    if (['en', 'es', 'pt'].indexOf(next) === -1 || next === lang) return;
    lang = next;
    applyStaticI18n();
    renderAll();
  }

  function renderAll() {
    renderPresets();
    renderReference();
    renderSummary();
    renderGuide();
    renderPads();
    renderStepMarkers();
    renderMatrix();
    setStatus(transportMode === 'playing' ? 'status.running' : transportMode === 'paused' ? 'status.paused' : transportMode === 'stopped' && Engine.ctx ? 'status.stopped' : 'status.ready');
    updatePlayButton();
    updateReadout(0);
    postHeight();
  }

  /* ----------------------------------------------------------------------- init */
  function init() {
    lang = detectLang();
    applyStaticI18n();

    S.voices.forEach(v => { S.tracks[v.id] = { muted: false, solo: false }; });
    renderStepMarkers();
    renderPads();
    renderGuide();
    loadTrack('hardgroove', 0, false);
    setStatus('status.ready');
    updateReadout();

    // transport
    $('btn-play-master').addEventListener('click', togglePlayback);
    $('btn-stop-master').addEventListener('click', stopPlayback);

    const bpmIn = $('bpm-input');
    const setBpm = v => {
      S.bpm = Math.max(80, Math.min(180, v)); bpmIn.value = S.bpm; Engine.setTempo(S.bpm); updatePlayButton();
    };
    bpmIn.addEventListener('change', () => { setBpm(parseInt(bpmIn.value, 10) || 126); showToast(t('toast.tempo', { bpm: S.bpm })); });
    $('btn-bpm-dec').addEventListener('click', () => setBpm(S.bpm - 1));
    $('btn-bpm-inc').addEventListener('click', () => setBpm(S.bpm + 1));

    $('swing-input').addEventListener('input', e => {
      S.swing = parseInt(e.target.value, 10) / 100;
      $('swing-val').textContent = Math.round(S.swing * 100) + '%';
    });

    $('btn-clear').addEventListener('click', () => {
      S.voices.forEach(v => { S.pattern[v.id] = Array(16).fill(0); });
      renderMatrix(); showToast(t('toast.cleared'));
    });

    $('btn-random').addEventListener('click', () => {
      S.pattern.kick = [2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0];
      S.pattern.openHat = [0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0];
      S.pattern.hat = Array(16).fill(1);
      ['congaHigh', 'congaLow', 'clap', 'bass', 'synth'].forEach(id => {
        S.pattern[id] = Array(16).fill(0).map((_, i) => {
          if (i % 4 === 0 && id !== 'synth') return 0;
          const r = Math.random();
          return r > 0.82 ? 2 : (r > 0.65 ? 1 : 0);
        });
      });
      renderMatrix(); showToast(t('toast.random'));
    });

    // reference menu
    $('ref-track-select').addEventListener('change', e => loadTrack(genreKey, parseInt(e.target.value, 10), true));
    $('btn-ref-listen').addEventListener('click', () => loadTrack(genreKey, trackIdx, true));
    $('btn-toggle-ref-drawer').addEventListener('click', () => {
      const d = $('ref-drawer');
      d.hidden = !d.hidden;
      $('btn-toggle-ref-drawer').setAttribute('aria-expanded', d.hidden ? 'false' : 'true');
      $('btn-toggle-ref-drawer').textContent = t(d.hidden ? 'btn.menuOpen' : 'btn.menuClose');
      postHeight();
    });
    $('guide').addEventListener('toggle', postHeight);

    // keyboard: 1-8 finger drumming, Space = play/pause
    window.addEventListener('keydown', e => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (e.key === ' ' && tag !== 'BUTTON') { e.preventDefault(); togglePlayback(); return; }
      const idx = KEYS.indexOf(e.key);
      if (idx !== -1) { e.preventDefault(); hitPad(S.voices[idx].id); }
    });

    // global audio unlock (synchronous resume inside gestures)
    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(ev => {
      window.addEventListener(ev, () => Engine.resume(), { passive: true });
    });

    // engine health: overload governor, suspended/stalled audio context
    Engine.onLite = on => { if (on) showToast(t('toast.lite')); };
    Engine.onState = st => {
      if (st === 'restarted') { showToast(t('toast.restarted')); return; }
      if (transportMode === 'playing') { pausePlayback(); showToast(t('toast.suspended')); }
    };

    // language follows the host page
    window.addEventListener('storage', e => { if (e.key === 'preferred-lang' && e.newValue) setLang(e.newValue); });
    window.addEventListener('message', e => {
      if (e.origin === window.location.origin && e.data && e.data.type === 'set-lang') setLang(e.data.lang);
    });

    window.addEventListener('load', postHeight);
    window.addEventListener('resize', postHeight);
    if (window.ResizeObserver) new ResizeObserver(postHeight).observe(document.body);
    setTimeout(postHeight, 150);
    requestAnimationFrame(visualLoop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

// Contador de ÆRIEL. Sin cookies, sin terceros. Respeta Global Privacy Control.
// Expone window.aerielContar('clave') para que el sitio marque éxito/error de formularios.
(function () {
  'use strict';
  var gpc = navigator.globalPrivacyControl === true;
  var cola = [], timer = 0, inicio = null;
  var ls = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  var ss = function (k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } };
  var azar = function () { return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6); };

  var sesion = ss('ae_s');
  var esNueva = !sesion;
  if (!sesion) { sesion = azar(); ss('ae_s', sesion); }

  function enviar() {
    timer = 0;
    if (!cola.length) return;
    var cuerpo = { s: sesion, e: cola.splice(0, 25), g: gpc ? 1 : 0 };
    if (inicio) { cuerpo.i = inicio; inicio = null; }
    var texto = JSON.stringify(cuerpo);
    if (texto.length > 1200) { delete cuerpo.i; texto = JSON.stringify(cuerpo); }
    try {
      var blob = new Blob([texto], { type: 'application/json' });
      if (!(navigator.sendBeacon && navigator.sendBeacon('/api/uso', blob))) {
        fetch('/api/uso', { method: 'POST', body: texto, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(function () {});
      }
    } catch (e) { /* silencio */ }
  }
  function contar(clave, n) {
    cola.push(n ? [clave, n] : clave);
    if (!timer) timer = setTimeout(enviar, 1500);
  }
  window.aerielContar = contar;

  var visto = {};
  function una(clave) { if (visto[clave]) return; visto[clave] = 1; contar(clave); }

  // ---- inicio de sesión
  var famReferrer = function () {
    if (!document.referrer) return 'directo';
    try {
      var h = new URL(document.referrer).hostname.replace(/^(www|m|l)\./, '');
      if (h === location.hostname.replace(/^www\./, '')) return null;
      var ok = ['instagram.com', 'google.com', 'soundcloud.com', 't.co', 'bandcamp.com', 'youtube.com', 'facebook.com', 'whatsapp.com'];
      return ok.indexOf(h) >= 0 ? h : 'otro';
    } catch (e) { return 'otro'; }
  };
  var disp = function () {
    var w = Math.min(screen.width, screen.height);
    return /Mobi|Android|iPhone/i.test(navigator.userAgent) || w < 600 ? 'celular' : (w < 1000 || /iPad|Tablet/i.test(navigator.userAgent) ? 'tablet' : 'computador');
  };
  var idioma = function () { var l = ls('preferred-lang'); return /^(en|es|pt)$/.test(l) ? l : (document.documentElement.lang || 'en').slice(0, 2); };
  var tema = function () {
    var c = document.documentElement.className;
    return /disco-mode/.test(c) ? 'disco' : /house-mode/.test(c) ? 'house' : /trance-mode/.test(c) ? 'trance' : 'default';
  };
  var vistaActual = function () {
    var p = location.pathname.toLowerCase(), h = location.hash.toLowerCase();
    if (/^\/(ae000x)/.test(p) || /ae000x-subsite/.test(h)) return 'ae000x';
    if (/^\/(writing|ensayos)/.test(p) || /writing-subsite|article-reader/.test(h)) return 'writing';
    if (/^\/(message|mensaje)/.test(p) || /message-subsite/.test(h)) return 'message';
    if (/^\/games/.test(p) || /games/.test(h)) return 'games';
    return 'inicio';
  };

  if (esNueva) {
    contar('sesion');
    var d = disp(), ref = famReferrer(), q = new URLSearchParams(location.search);
    var canal = (q.get('de') || '').toLowerCase();
    contar('disp:' + d);
    if (ref) contar('ref:' + ref);
    if (/^(ig|wa|bio|qr|tg|x|mail)$/.test(canal)) contar('llegada:' + canal);
    var hoy = new Date().toISOString().slice(0, 10), nuevo = !ls('ae_n');
    if (ls('ae_d') !== hoy) { ls('ae_d', hoy); contar('equipos:dia'); }
    if (nuevo) { ls('ae_n', '1'); contar('equipos:nuevo'); }
    var standalone = window.matchMedia && matchMedia('(display-mode: standalone)').matches;
    if (standalone) contar('instalada');
    contar('idioma:' + idioma()); contar('tema:' + tema());
    var cn = navigator.connection || {};
    inicio = {
      disp: d, ref: ref || '', de: canal, utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '', utm_campaign: q.get('utm_campaign') || '',
      nuevo: nuevo, lang_nav: (navigator.language || '').slice(0, 5), lang: idioma(), tema: tema(),
      pantalla: screen.width + 'x' + screen.height, ventana: innerWidth + 'x' + innerHeight, dpr: Math.round((devicePixelRatio || 1) * 100) / 100,
      tactil: navigator.maxTouchPoints > 0, oscuro: !!(matchMedia && matchMedia('(prefers-color-scheme: dark)').matches),
      movimiento_reducido: !!(matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches),
      red: cn.effectiveType || '', ahorro: !!cn.saveData, app: !!standalone
    };
  }

  // ---- vistas y ensayos
  var ultVista = '';
  function revisarRuta() {
    var v = vistaActual();
    if (v !== ultVista) { ultVista = v; una('vista:' + v); }
    var id = new URLSearchParams(location.search + location.hash.replace(/^[^?]*/, '')).get('essay');
    if (id && /^essay-/.test(id)) { una('ensayo:' + id); ensayoAbierto = id; }
  }
  var ensayoAbierto = '';
  ['pushState', 'replaceState'].forEach(function (m) { var o = history[m]; history[m] = function () { var r = o.apply(this, arguments); setTimeout(revisarRuta, 0); return r; }; });
  addEventListener('popstate', revisarRuta); addEventListener('hashchange', revisarRuta);

  // ---- lectura (25/50/75/100 % del ensayo abierto)
  var umbrales = [25, 50, 75, 100];
  addEventListener('scroll', function () {
    if (!ensayoAbierto) return;
    var c = document.getElementById('article-reader-container');
    if (!c) return;
    var r = c.getBoundingClientRect(), alto = r.height - innerHeight;
    if (alto <= 0) return;
    var pct = Math.max(0, Math.min(100, (-r.top / alto) * 100));
    umbrales.forEach(function (u) { if (pct >= u - (u === 100 ? 2 : 0)) una('lectura:' + ensayoAbierto + ':' + u); });
  }, { passive: true });

  // ---- clics (delegación; no toca el HTML del sitio)
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (a) {
      var h = a.hostname.replace(/^www\./, '');
      var mapa = { 'instagram.com': 'instagram', 'soundcloud.com': 'soundcloud', 'bandcamp.com': 'bandcamp', 'youtube.com': 'youtube', 'youtu.be': 'youtube' };
      var p = Object.keys(mapa).filter(function (k) { return h === k || h.slice(-k.length - 1) === '.' + k; })[0];
      if (p) contar('portal:' + mapa[p]);
    }
    var g = ev.target.closest && ev.target.closest('[data-genre]');
    if (g && g.closest('.soundcloud-drawer-wrapper')) { var gn = g.getAttribute('data-genre'); if (/^(default|trance|house|disco)$/.test(gn)) contar('mix:' + gn); }
  }, true);

  // ---- tema e idioma elegidos a mano (los cambios del propio sitio llaman a estas funciones)
  new MutationObserver(function () { var t = tema(); if (t !== ultTema) { ultTema = t; contar('tema:' + t); } }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  var ultTema = tema();
  addEventListener('storage', function (e) { if (e.key === 'preferred-lang' && /^(en|es|pt)$/.test(e.newValue)) contar('idioma:' + e.newValue + ':manual'); });

  // ---- tiempo a la vista
  var visibleDesde = document.visibilityState === 'visible' ? Date.now() : 0, acumulado = 0, inicioSesion = Date.now();
  function bucket(s) { return s < 10 ? '0-10s' : s < 30 ? '10-30s' : s < 60 ? '30-60s' : s < 180 ? '1-3min' : s < 600 ? '3-10min' : '10min+'; }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      if (visibleDesde) { acumulado += (Date.now() - visibleDesde) / 1000; visibleDesde = 0; }
      var s = Math.round(acumulado);
      if (s >= 1) {
        if (!visto.dur) { visto.dur = 1; contar('duracion:' + bucket(s)); }
        contar('segundos_a_la_vista', Math.min(s, 3600));
        acumulado = 0;
      }
      enviar();
    } else visibleDesde = Date.now();
  });
  addEventListener('pagehide', enviar);
  setTimeout(revisarRuta, 0);
})();

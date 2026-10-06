(function () {
  'use strict';
  var raiz = document.getElementById('raiz'), tip = document.getElementById('tip');
  var NS = 'http://www.w3.org/2000/svg';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var num = function (x) { x = Number(x); return isFinite(x) ? x : 0; };
  var fmt = function (x) { return num(x).toLocaleString('es-CL'); };
  var VACIO = '<p class="vacio">TODAVÍA NO HAY DATOS EN ESTE PERÍODO</p>';

  // ---- clave: viene en #k=…, pasa a sessionStorage y se borra de la barra
  var m = /(?:^|[#&])k=([^&]+)/.exec(location.hash);
  if (m) { try { sessionStorage.setItem('ae_k', decodeURIComponent(m[1])); } catch (e) {} history.replaceState(null, '', location.pathname); }
  var clave = ''; try { clave = sessionStorage.getItem('ae_k') || ''; } catch (e) {}
  document.getElementById('olvidar').addEventListener('click', function () { try { sessionStorage.removeItem('ae_k'); } catch (e) {} location.reload(); });

  // ---- tema del visor
  function tema(t) {
    document.documentElement.setAttribute('data-tema', t);
    document.querySelectorAll('.temas [data-tema]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-tema') === t)); });
    try { localStorage.setItem('ae_tema_visor', t); } catch (e) {}
  }
  document.querySelectorAll('.temas [data-tema]').forEach(function (b) { b.addEventListener('click', function () { tema(b.getAttribute('data-tema')); }); });
  try { var t0 = localStorage.getItem('ae_tema_visor'); if (/^(default|disco|house|trance)$/.test(t0)) tema(t0); } catch (e) {}

  // ---- SVG a mano
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function texto(p, x, y, s, anchor) { var t = el('text', { x: x, y: y, 'text-anchor': anchor || 'start' }, p); t.textContent = s; return t; }
  function conTip(e, msg) {
    var mostrar = function (ev) { tip.hidden = false; tip.textContent = msg; var x = (ev.clientX || 20) + 12, y = (ev.clientY || 20) + 12; tip.style.left = Math.min(x, innerWidth - 270) + 'px'; tip.style.top = y + 'px'; };
    e.addEventListener('pointermove', mostrar); e.addEventListener('pointerdown', mostrar);
    e.addEventListener('pointerleave', function () { tip.hidden = true; });
  }
  function lineas(cont, series, dias) {
    var W = 720, H = 220, L = 36, B = 22, T = 8, R = 8;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Visitas por día' });
    var max = Math.max(1, Math.max.apply(null, series.reduce(function (a, s) { return a.concat(s.v); }, [0])));
    for (var i = 0; i <= 4; i++) { var y = T + (H - T - B) * i / 4; el('line', { class: 'grilla', x1: L, x2: W - R, y1: y, y2: y }, svg); texto(svg, L - 4, y + 3, Math.round(max * (4 - i) / 4), 'end'); }
    el('line', { class: 'eje', x1: L, x2: L, y1: T, y2: H - B }, svg); el('line', { class: 'eje', x1: L, x2: W - R, y1: H - B, y2: H - B }, svg);
    var n = dias.length, px = function (i) { return L + (n < 2 ? 0 : (W - L - R) * i / (n - 1)); }, py = function (v) { return H - B - (H - T - B) * v / max; };
    [0, Math.floor(n / 2), n - 1].forEach(function (i) { if (dias[i]) texto(svg, px(i), H - 6, dias[i].slice(5), i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'); });
    series.forEach(function (s) { el('polyline', { class: s.cls, points: s.v.map(function (v, i) { return px(i) + ',' + py(v); }).join(' ') }, svg); });
    dias.forEach(function (d, i) {
      var r = el('rect', { x: px(i) - (W - L - R) / Math.max(n, 1) / 2, y: T, width: (W - L - R) / Math.max(n, 1), height: H - T - B, fill: 'transparent' }, svg);
      conTip(r, d + ' · ' + series.map(function (s) { return s.nombre + ' ' + fmt(s.v[i]); }).join(' · '));
    });
    cont.appendChild(svg);
  }
  function barrasH(items, max) {
    if (!items.length) return VACIO;
    max = max || Math.max.apply(null, items.map(function (i) { return num(i[1]); })) || 1;
    return items.map(function (i) { return '<div class="fila-barra"><span>' + esc(i[0]) + '</span><span><i data-w="' + Math.max(1, Math.round(num(i[1]) / max * 100)) + '"></i></span><span class="n">' + fmt(i[1]) + '</span></div>'; }).join('');
  }
  function calor(cont, mat) {
    var W = 720, H = 190, L = 34, T = 14, cw = (W - L) / 24, ch = (H - T - 4) / 7, max = 1;
    mat.forEach(function (f) { f.forEach(function (v) { if (v > max) max = v; }); });
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Llegadas por día de la semana y hora' });
    ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].forEach(function (d, r) { texto(svg, 0, T + ch * r + ch / 2 + 3, d); });
    for (var h = 0; h < 24; h += 3) texto(svg, L + cw * h, 10, String(h));
    mat.forEach(function (f, r) { f.forEach(function (v, c) {
      var rect = el('rect', { class: 'celda', x: L + cw * c, y: T + ch * r, width: cw, height: ch, 'fill-opacity': v ? (0.15 + 0.85 * v / max).toFixed(2) : 0.04 }, svg);
      conTip(rect, ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'][r] + ' ' + c + ':00 · ' + v + ' llegadas');
    }); });
    cont.appendChild(svg);
  }
  var suma = function (o, pref) { var t = 0; for (var k in o) if (k.indexOf(pref) === 0) t += num(o[k]); return t; };
  var porPref = function (o, pref) { var r = []; for (var k in o) if (k.indexOf(pref) === 0) r.push([k.slice(pref.length), num(o[k])]); return r.sort(function (a, b) { return b[1] - a[1]; }); };

  function sec(titulo, html, cls) { var s = document.createElement('section'); if (cls) s.className = cls; s.innerHTML = '<h2>' + esc(titulo) + '</h2>' + html; raiz.appendChild(s); s.querySelectorAll('i[data-w]').forEach(function (i) { i.style.width = i.getAttribute('data-w') + '%'; }); return s; }
  function kpis(arr) { return '<div class="kpis">' + arr.map(function (k) { return '<div class="kpi"><b>' + esc(k[1]) + '</b><span>' + esc(k[0]) + '</span></div>'; }).join('') + '</div>'; }

  function pintar(d) {
    raiz.innerHTML = '';
    var h = d.hoy || {}, T = d.uso.todo || {}, D30 = d.uso.d30 || {}, cf = d.cf || {};
    var ahora = new Date().toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' });
    var ses = num(h.sesion), seg = num(h.segundos_a_la_vista);
    sec('[ HOY · SANTIAGO ' + ahora + ' ]', kpis([
      ['SESIONES', fmt(ses)], ['EQUIPOS', fmt(h['equipos:dia'])], ['MIN. PROM. A LA VISTA', ses ? (seg / ses / 60).toFixed(1) : '0'],
      ['ENSAYOS ABIERTOS', fmt(suma(h, 'ensayo:'))], ['SETS ABIERTOS', fmt(suma(h, 'mix:'))], ['COMPARTIDOS', fmt(suma(h, 'compartir:'))],
      ['DESDE INSTAGRAM', fmt(h['ref:instagram.com'])], ['% CELULAR', ses ? Math.round(num(h['disp:celular']) / ses * 100) + '%' : '0%']
    ]), 'hoy');

    if (cf.error) sec('[ !! ] FALTA CONECTAR CLOUDFLARE', '<div class="alerta">' + esc(cf.error) + '<br>Pasos: LEEME.md → «Secretos» (CF_API_TOKEN, CF_ACCOUNT_ID, CF_SITE_TAG).</div>');

    // 01 crecimiento
    var s1 = sec('[ 01 ] CÓMO VA CRECIENDO', '<div class="rango" id="rango"></div><div id="g1"></div><p class="rotulo">── VISITAS CLOUDFLARE &nbsp; ╌╌ SESIONES PROPIAS</p>');
    var hist = {}; (cf.historia || []).forEach(function (r) { hist[r.dia] = r.visitas; });
    (cf.dia || []).forEach(function (r) { hist[r.valor] = r.visitas; });
    var propias = {}; (d.uso.sesionesPorDia || []).forEach(function (r) { propias[r.dia] = r.n; });
    var todos = Object.keys(hist).concat(Object.keys(propias)).filter(function (x, i, a) { return a.indexOf(x) === i; }).sort();
    function dibujar(n) {
      var g = s1.querySelector('#g1'); g.innerHTML = '';
      var dias = n ? todos.slice(-n) : todos;
      if (!dias.length) { g.innerHTML = VACIO; return; }
      lineas(g, [{ nombre: 'CF', cls: 'linea-a', v: dias.map(function (x) { return num(hist[x]); }) }, { nombre: 'PROPIAS', cls: 'linea-b', v: dias.map(function (x) { return num(propias[x]); }) }], dias);
    }
    [['30 DÍAS', 30], ['90 DÍAS', 90], ['TODO', 0]].forEach(function (r) { var b = document.createElement('button'); b.type = 'button'; b.textContent = '[ ' + r[0] + ' ]'; b.addEventListener('click', function () { dibujar(r[1]); }); s1.querySelector('#rango').appendChild(b); });
    dibujar(30);

    sec('[ 02 ] QUÉ SE ABRE', '<p class="rotulo">30 DÍAS</p>' + barrasH(porPref(D30, 'vista:')) + '<p class="rotulo">DESDE SIEMPRE</p>' + barrasH(porPref(T, 'vista:')), 'medio');
    var ens = porPref(T, 'ensayo:');
    var curva = ['25', '50', '75', '100'].map(function (p) { return [p + ' %', suma(T, 'lectura:') ? Object.keys(T).filter(function (k) { return /^lectura:.*:/.test(k) && k.split(':')[2] === p; }).reduce(function (a, k) { return a + num(T[k]); }, 0) : 0]; });
    sec('[ 03 ] ENSAYOS', barrasH(ens) + '<p class="rotulo">CURVA DE LECTURA</p>' + barrasH(curva), 'medio');
    sec('[ 04 ] MÚSICA', '<p class="rotulo">SETS ABIERTOS</p>' + barrasH(porPref(T, 'mix:')) + '<p class="rotulo">CLICS HACIA AFUERA</p>' + barrasH(porPref(T, 'portal:')), 'medio');
    var toques = [].concat(porPref(T, 'cajon:').map(function (x) { return ['CAJÓN ' + x[0], x[1]]; }), porPref(T, 'afiche:').map(function (x) { return ['AFICHE ' + x[0], x[1]]; }),
      porPref(T, 'idioma:').filter(function (x) { return /:manual$/.test(x[0]); }).map(function (x) { return ['IDIOMA ' + x[0], x[1]]; }), porPref(T, 'tema:').map(function (x) { return ['TEMA ' + x[0], x[1]]; }),
      [['LIGHTBOX', num(T.lightbox)], ['EASTER EGG', num(T.easter_egg)]]).filter(function (x) { return x[1] > 0; });
    sec('[ 05 ] QUÉ TOCAN', barrasH(toques), 'medio');
    var a = num(T.sesion), b = suma(T, 'ensayo:') + suma(T, 'mix:') + suma(T, 'cajon:'), c = suma(T, 'lectura:') + suma(T, 'mix:'), z = suma(T, 'portal:') + suma(T, 'form:');
    sec('[ 06 ] EMBUDO', barrasH([['SESIÓN', a], ['ABRIÓ ALGO', b], ['LEYÓ O ESCUCHÓ', c], ['CLIC A PORTAL / FORMULARIO', z]], a || 1), 'medio');
    sec('[ 07 ] DE DÓNDE LLEGAN', '<p class="rotulo">FAMILIA</p>' + barrasH(porPref(T, 'ref:')) + '<p class="rotulo">CANAL ?DE=</p>' + barrasH(porPref(T, 'llegada:')) +
      '<p class="rotulo">REFERENTES CLOUDFLARE</p>' + barrasH((cf.llegada || []).map(function (x) { return [x.valor, x.vistas]; })) + '<p class="rotulo">PÁGINAS CLOUDFLARE</p>' + barrasH((cf.pagina || []).map(function (x) { return [x.valor, x.vistas]; })));
    var cfl = function (k) { return barrasH((cf[k] || []).map(function (x) { return [x.valor, x.vistas]; })); };
    sec('[ 08 ] CON QUÉ', '<p class="rotulo">EQUIPO</p>' + cfl('equipo') + '<p class="rotulo">NAVEGADOR</p>' + cfl('navegador') + '<p class="rotulo">SISTEMA</p>' + cfl('so') + '<p class="rotulo">PAÍS</p>' + cfl('pais') +
      '<p class="rotulo">IDIOMA ELEGIDO</p>' + barrasH(porPref(T, 'idioma:').filter(function (x) { return !/:manual$/.test(x[0]); })) + '<p class="rotulo">TEMA ELEGIDO</p>' + barrasH(porPref(T, 'tema:')));
    var dur = porPref(T, 'duracion:'), orden = ['0-10s', '10-30s', '30-60s', '1-3min', '3-10min', '10min+'];
    dur.sort(function (x, y) { return orden.indexOf(x[0]) - orden.indexOf(y[0]); });
    sec('[ 09 ] CUÁNTO SE QUEDAN', barrasH(dur) + '<p class="rotulo">PROMEDIO A LA VISTA: ' + (a ? (num(T.segundos_a_la_vista) / a / 60).toFixed(1) : '0') + ' MIN</p>', 'medio');
    var s10 = sec('[ 10 ] A QUÉ HORA ENTRAN', '<p class="rotulo">LLEGADAS 30 DÍAS · AMERICA/SANTIAGO</p><div id="g10"></div>');
    calor(s10.querySelector('#g10'), (d.registro && d.registro.calor) || []);
    var f = d.formularios || {}, fd = Object.keys(f.porDia || {}).sort().reverse().slice(0, 10).map(function (k) { return [k, f.porDia[k]]; });
    sec('[ 11 ] FORMULARIOS', kpis([['ENVÍOS', fmt(f.total)], ['CONEXIONES DISTINTAS', fmt(f.conexiones)]]) + '<p class="rotulo">POR DÍA</p>' + barrasH(fd) + '<p class="rotulo">CIUDAD APROXIMADA</p>' + barrasH(Object.entries(f.porCiudad || {}).sort(function (x, y) { return y[1] - x[1]; }).slice(0, 10)) + '<p class="rotulo">EQUIPO</p>' + barrasH(Object.entries(f.porEquipo || {})) + '<p class="rotulo">NUNCA SE MUESTRA EL CONTENIDO</p>');
    var vs = (d.registro && d.registro.visitas) || [];
    var filas = vs.map(function (v) {
      var i = v.inicio || {}, hora = new Date(v.ts).toLocaleString('es-CL', { timeZone: 'America/Santiago', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      var ruta = v.pasos.filter(function (p) { return !/^(ref|disp|llegada|equipos|instalada|idioma|tema):/.test(p) && p !== 'sesion'; }).map(function (p) { return p.replace(':', ' ').toUpperCase(); }).join(' → ') || 'INICIO';
      return '<tr><td>' + esc(hora) + '</td><td>' + esc([i.disp, i.ref || 'directo', i.de ? '?de=' + i.de : '', i.utm_campaign].filter(Boolean).join(' · ')) + '</td><td class="recorrido">' + esc(ruta) + '</td><td class="n">' + Math.max(0, Math.round((v.fin - v.ts) / 1000)) + ' S</td></tr>';
    }).join('');
    sec('[ 12 ] ÚLTIMAS VISITAS', filas ? '<table><thead><tr><th>HORA</th><th>LLEGÓ</th><th>RECORRIDO</th><th class="n">DURÓ</th></tr></thead><tbody>' + filas + '</tbody></table>' : VACIO);
    sec('[ i ] GENERADO', '<p class="rotulo">' + esc(d.generado) + (d.desde ? ' · DESDE ' + esc(d.desde) : '') + '</p>');
  }

  function cargar() {
    if (!clave) { raiz.innerHTML = '<p class="estado">ABRE EL LINK PRIVADO /METRICAS#K=… PARA VER LOS DATOS.</p>'; return; }
    fetch('/api/metricas', { headers: { authorization: 'Bearer ' + clave }, cache: 'no-store' }).then(function (r) {
      if (r.status === 401) throw new Error('CLAVE INCORRECTA. USA «OLVIDAR CLAVE» Y ABRE EL LINK DE NUEVO.');
      if (r.status === 429) throw new Error('DEMASIADOS INTENTOS HOY.');
      if (!r.ok) throw new Error('ERROR ' + r.status);
      return r.json();
    }).then(pintar).catch(function (e) { raiz.innerHTML = '<p class="estado">' + esc(e.message) + '</p>'; });
  }
  cargar();
})();

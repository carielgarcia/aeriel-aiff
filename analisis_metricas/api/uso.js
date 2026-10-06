// POST /api/uso  → contadores (uso_diario) + registro (eventos) + metadata de formularios.
import { claveValida, limpiarInicio, diaChile, huella, ipDe, ipCorta, limitar, purgarVencidos, HOSTS_PERMITIDOS } from './comun.js';

const TOPE_DIA = 400;      // escrituras por conexión y día
const MAX_EVENTOS = 25;    // por pedido
const sinContenido = () => new Response(null, { status: 204 });

export async function onRequestPost({ request, env }) {
  try {
    // Solo mismo origen y solo el dominio real: las previsualizaciones (*.pages.dev) no escriben.
    const origen = request.headers.get('origin');
    let host = '';
    try { host = new URL(origen).host; } catch { return sinContenido(); }
    const local = env.PERMITIR_LOCAL === '1' && /^localhost(:\d+)?$/.test(host);   // solo en .dev.vars de pruebas
    if (!(HOSTS_PERMITIDOS.includes(host) || local) || host !== new URL(request.url).host) return sinContenido();
    if (!env.DB) return sinContenido();

    const largo = Number(request.headers.get('content-length') || 0);
    if (largo > 1200) return sinContenido();
    const texto = await request.text();
    if (texto.length > 1200) return sinContenido();
    let cuerpo;
    try { cuerpo = JSON.parse(texto); } catch { return sinContenido(); }

    const ts = Date.now();
    const dia = diaChile(ts);
    const ip = ipDe(request);
    const h = await huella(env, ip + dia);
    if ((await limitar(env.DB, h, dia, 'uso')) > TOPE_DIA) return sinContenido();

    const gpc = request.headers.get('sec-gpc') === '1' || cuerpo.g === 1;   // GPC: solo contar, no registrar
    const sesion = /^[a-z0-9]{6,16}$/.test(cuerpo.s || '') ? cuerpo.s : null;
    const lista = Array.isArray(cuerpo.e) ? cuerpo.e.slice(0, MAX_EVENTOS) : [];

    const stmts = [];
    const sumar = env.DB.prepare('INSERT INTO uso_diario (dia, clave, n) VALUES (?1, ?2, ?3) ON CONFLICT (dia, clave) DO UPDATE SET n = n + ?3');
    const evento = env.DB.prepare('INSERT INTO eventos (ts, dia, sesion, tipo, valor, r) VALUES (?1, ?2, ?3, ?4, ?5, ?6)');
    const vistos = [];

    for (const par of lista) {
      const clave = Array.isArray(par) ? par[0] : par;
      if (!claveValida(clave)) continue;
      let n = 1;
      if (clave === 'segundos_a_la_vista') {
        n = Math.floor(Number(Array.isArray(par) ? par[1] : 0));
        if (!Number.isFinite(n) || n < 1 || n > 3600) continue;
      }
      stmts.push(sumar.bind(dia, clave, n));
      vistos.push(clave);
      if (!gpc && sesion && clave !== 'segundos_a_la_vista') {
        const i = clave.indexOf(':');
        const tipo = i < 0 ? clave : clave.slice(0, i);
        const valor = i < 0 ? null : clave.slice(i + 1);
        stmts.push(evento.bind(ts, dia, sesion, tipo, valor, null));
      }
    }
    if (!gpc && sesion && cuerpo.i && vistos.includes('sesion')) {
      const r = limpiarInicio(cuerpo.i);
      if (r) stmts.push(evento.bind(ts, dia, sesion, 'inicio', null, r));
    }

    // Metadata aproximada del envío de un formulario (sin contenido, sin IP completa).
    const form = gpc ? null : vistos.find((c) => /^form:(contacto|invitacion):enviado$/.test(c));
    if (form) {
      const cf = request.cf || {};
      const num = (x) => (Number.isFinite(Number(x)) && x !== undefined && x !== null ? Number(x) : null);
      stmts.push(
        env.DB.prepare(
          'INSERT INTO formularios_meta (ts, dia, form, pais, region, ciudad, postal, lat, lon, zona, asn, proveedor, colo, http, tls, rtt, ua, idiomas, gpc, ip_corta, huella) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19,?20,?21)'
        ).bind(
          ts, dia, form.split(':')[1], cf.country ?? null, cf.region ?? null, cf.city ?? null, cf.postalCode ?? null,
          num(cf.latitude), num(cf.longitude), cf.timezone ?? null, num(cf.asn), cf.asOrganization ?? null, cf.colo ?? null,
          cf.httpProtocol ?? null, cf.tlsVersion ?? null, num(cf.clientTcpRtt),
          (request.headers.get('user-agent') || '').slice(0, 200), (request.headers.get('accept-language') || '').slice(0, 60),
          gpc ? 1 : 0, ipCorta(ip), await huella(env, ip)
        )
      );
    }

    if (stmts.length) await env.DB.batch(stmts);
    await purgarVencidos(env.DB, dia, ts);
  } catch (_) { /* un contador que falla no molesta a nadie */ }
  return sinContenido();
}

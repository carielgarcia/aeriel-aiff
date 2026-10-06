// GET /api/metricas → { generado, hoy, cf, uso, registro, formularios }
import { json, error, diaChile, diaYHora, restarDias, ipDe, huella, limitar, leerLimite, igualesSeguro } from './comun.js';

const VENTANA_CF = 90;
const CADA_6H = 6 * 3600 * 1000;

async function autorizar(request, env) {
  const dia = diaChile();
  const h = await huella(env, ipDe(request) + dia);
  if ((await leerLimite(env.DB, h, dia, 'auth')) >= 10) return { ok: false, status: 429 };   // sin seguir escribiendo
  const m = /^Bearer (.+)$/.exec(request.headers.get('authorization') || '');
  const ok = !!(env.METRICAS_CLAVE && m && (await igualesSeguro(m[1], env.METRICAS_CLAVE)));
  if (!ok) { await limitar(env.DB, h, dia, 'auth'); return { ok: false, status: 401 }; }
  return { ok: true };
}

const CONSULTA = `query ($acc: String!, $tag: String!, $desde: Time!, $hasta: Time!) {
  viewer { accounts(filter: { accountTag: $acc }) {
    ${[['dia', 'date', 'date_ASC', 100], ['equipo', 'deviceType', 'count_DESC', 10], ['navegador', 'userAgentBrowser', 'count_DESC', 15],
       ['so', 'userAgentOS', 'count_DESC', 15], ['pais', 'countryName', 'count_DESC', 30], ['llegada', 'refererHost', 'count_DESC', 30],
       ['pagina', 'requestPath', 'count_DESC', 30]].map(([a, d, o, l]) => `
    ${a}: rumPageloadEventsAdaptiveGroups(limit: ${l}, orderBy: [${o}],
      filter: { siteTag: $tag, bot: 0, datetime_geq: $desde, datetime_leq: $hasta, requestHost_notin: ["localhost","127.0.0.1"] }) {
      count sum { visits } dimensions { ${d} } }`).join('')}
  } }
}`;

async function cloudflare(env, desdeISO) {
  if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID || !env.CF_SITE_TAG) return { error: 'Falta CF_API_TOKEN, CF_ACCOUNT_ID o CF_SITE_TAG.' };
  const hoy = diaChile();
  let desde = restarDias(hoy, VENTANA_CF);
  if (desdeISO && desdeISO > desde) desde = desdeISO;
  try {
    const r = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.CF_API_TOKEN}`, 'content-type': 'application/json' },
      body: JSON.stringify({ query: CONSULTA, variables: { acc: env.CF_ACCOUNT_ID, tag: env.CF_SITE_TAG, desde: desde + 'T00:00:00Z', hasta: new Date().toISOString() } })
    });
    const j = await r.json();
    if (!r.ok || j.errors?.length) return { error: j.errors?.[0]?.message || `HTTP ${r.status}` };
    const a = j.data?.viewer?.accounts?.[0];
    if (!a) return { error: 'La cuenta no devolvió datos (revisa CF_ACCOUNT_ID y permisos del token).' };
    const f = (g, dim) => (g || []).map((x) => ({ valor: x.dimensions[dim] || '(directo)', vistas: x.count, visitas: x.sum.visits }));
    return {
      desde,
      dia: f(a.dia, 'date'), equipo: f(a.equipo, 'deviceType'), navegador: f(a.navegador, 'userAgentBrowser'), so: f(a.so, 'userAgentOS'),
      pais: f(a.pais, 'countryName'), llegada: f(a.llegada, 'refererHost'), pagina: f(a.pagina, 'requestPath')
    };
  } catch (e) { return { error: 'No se pudo hablar con Cloudflare: ' + e.message }; }
}

// Guarda días cerrados (no hoy) como mucho cada 6 h; los lee de vuelta para no perder historia.
async function persistirCF(env, cf) {
  const hoy = diaChile();
  const ult = Number((await env.DB.prepare("SELECT valor FROM meta WHERE clave = 'cf_ultimo'").first())?.valor || 0);
  if (!cf.error && Date.now() - ult > CADA_6H) {
    const ins = env.DB.prepare('INSERT INTO cloudflare_diario (dia, tipo, valor, vistas, visitas) VALUES (?1,?2,?3,?4,?5) ON CONFLICT (dia, tipo, valor) DO UPDATE SET vistas = ?4, visitas = ?5');
    const lote = cf.dia.filter((x) => x.valor < hoy).map((x) => ins.bind(x.valor, 'total', 'total', x.vistas, x.visitas));
    lote.push(env.DB.prepare("INSERT INTO meta (clave, valor) VALUES ('cf_ultimo', ?1) ON CONFLICT (clave) DO UPDATE SET valor = ?1").bind(String(Date.now())));
    for (let i = 0; i < lote.length; i += 90) await env.DB.batch(lote.slice(i, i + 90));
  }
  const { results } = await env.DB.prepare("SELECT dia, vistas, visitas FROM cloudflare_diario WHERE tipo = 'total' ORDER BY dia").all();
  return results;
}

const agrupa = (rows, k = 'clave') => Object.fromEntries(rows.map((r) => [r[k], r.n]));

export async function onRequestGet({ request, env }) {
  if (!env.DB) return error(500, 'Falta el binding D1 «DB».');
  const auth = await autorizar(request, env);
  if (!auth.ok) return error(auth.status, auth.status === 429 ? 'Demasiados intentos.' : 'No autorizado.');

  const hoy = diaChile();
  const d30 = restarDias(hoy, 30), d7 = restarDias(hoy, 7);
  const desde = env.METRICAS_DESDE ? String(env.METRICAS_DESDE).slice(0, 10) : '0000-00-00';
  const lim = (x) => (x > desde ? x : desde);

  const [cf] = await Promise.all([cloudflare(env, env.METRICAS_DESDE ? desde : null)]);
  const historia = (await persistirCF(env, cf)).filter((r) => r.dia >= desde);

  const [usoHoy, uso30, usoTodo, usoDia, evHeat, evUlt, forms] = await Promise.all([
    env.DB.prepare('SELECT clave, n FROM uso_diario WHERE dia = ?1').bind(hoy).all(),
    env.DB.prepare('SELECT clave, SUM(n) AS n FROM uso_diario WHERE dia >= ?1 GROUP BY clave').bind(lim(d30)).all(),
    env.DB.prepare('SELECT clave, SUM(n) AS n FROM uso_diario WHERE dia >= ?1 GROUP BY clave').bind(desde).all(),
    env.DB.prepare("SELECT dia, n FROM uso_diario WHERE clave = 'sesion' AND dia >= ?1 ORDER BY dia").bind(desde).all(),
    env.DB.prepare("SELECT ts FROM eventos WHERE tipo = 'inicio' AND dia >= ?1 ORDER BY ts DESC LIMIT 20000").bind(lim(d30)).all(),
    env.DB.prepare('SELECT ts, sesion, tipo, valor, r FROM eventos WHERE dia >= ?1 ORDER BY ts DESC LIMIT 4000').bind(lim(d7)).all(),
    env.DB.prepare('SELECT dia, form, pais, ciudad, ua, huella FROM formularios_meta WHERE dia >= ?1 ORDER BY ts DESC LIMIT 2000').bind(lim(restarDias(hoy, 90))).all()
  ]);

  // Mapa de calor día × hora (Santiago), 30 días.
  const calor = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const { ts } of evHeat.results) { const { dow, hora } = diaYHora(ts); if (dow >= 0) calor[dow][hora]++; }

  // Últimas visitas: une eventos por sesión.
  const ses = new Map();
  for (const e of evUlt.results.slice().reverse()) {
    if (!ses.has(e.sesion)) ses.set(e.sesion, { sesion: e.sesion, ts: e.ts, fin: e.ts, pasos: [], inicio: null });
    const s = ses.get(e.sesion);
    s.fin = e.ts;
    if (e.tipo === 'inicio') { try { s.inicio = JSON.parse(e.r); } catch { /* fila rota */ } }
    else s.pasos.push(e.valor ? `${e.tipo}:${e.valor}` : e.tipo);
  }
  const visitas = [...ses.values()].sort((a, b) => b.ts - a.ts).slice(0, 80).map((s) => ({ ...s, sesion: s.sesion.slice(0, 4) }));

  // Formularios: solo agregados.
  const fAgg = { total: forms.results.length, porDia: {}, porCiudad: {}, porEquipo: {}, conexiones: new Set() };
  for (const f of forms.results) {
    fAgg.porDia[f.dia] = (fAgg.porDia[f.dia] || 0) + 1;
    const c = [f.ciudad, f.pais].filter(Boolean).join(', ') || '(sin dato)';
    fAgg.porCiudad[c] = (fAgg.porCiudad[c] || 0) + 1;
    const eq = /Mobi|Android|iPhone/i.test(f.ua || '') ? 'celular' : 'computador';
    fAgg.porEquipo[eq] = (fAgg.porEquipo[eq] || 0) + 1;
    if (f.huella) fAgg.conexiones.add(f.huella);
  }

  return json({
    generado: new Date().toISOString(),
    desde: env.METRICAS_DESDE || null,
    hoy: agrupa(usoHoy.results),
    cf: { ...cf, historia },
    uso: { d30: agrupa(uso30.results), todo: agrupa(usoTodo.results), sesionesPorDia: usoDia.results },
    registro: { calor, visitas },
    formularios: { total: fAgg.total, porDia: fAgg.porDia, porCiudad: fAgg.porCiudad, porEquipo: fAgg.porEquipo, conexiones: fAgg.conexiones.size }
  });
}

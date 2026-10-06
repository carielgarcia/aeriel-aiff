// Utilidades compartidas. Se copia a functions/api/ junto a uso.js y metricas.js.
// Sin exports `onRequest*`, así que Pages no lo expone como ruta.

export const HOSTS_PERMITIDOS = ['aeriel.net', 'www.aeriel.net'];
export const ZONA = 'America/Santiago';

export const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra }
  });
export const error = (status, mensaje) => json({ error: mensaje }, status);

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const fmtDia = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' });
const fmtHora = new Intl.DateTimeFormat('en-GB', { timeZone: ZONA, weekday: 'short', hour: '2-digit', hourCycle: 'h23' });
export const diaChile = (ts = Date.now()) => fmtDia.format(new Date(ts));
export const diaYHora = (ts) => {
  const p = Object.fromEntries(fmtHora.formatToParts(new Date(ts)).map((x) => [x.type, x.value]));
  const dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(p.weekday);
  return { dow, hora: Number(p.hour) };
};
export const restarDias = (dia, n) => {
  const d = new Date(dia + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};

export const ipDe = (request) => request.headers.get('cf-connecting-ip') || '';

export async function hmacHex(secreto, texto) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secreto), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const f = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(texto));
  return [...new Uint8Array(f)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
export const huella = async (env, texto) => (await hmacHex(env.FIRMA || 'sin-firma', texto)).slice(0, 24);

export function ipCorta(ip) {
  if (!ip) return null;
  if (ip.includes(':')) {
    const g = ip.split(':').slice(0, 3);
    return g.join(':') + '::/48';
  }
  const p = ip.split('.');
  return p.length === 4 ? `${p[0]}.${p[1]}.${p[2]}.0/24` : null;
}

// Suma 1 al tope de (huella, dia, ambito). Devuelve el valor tras sumar.
export async function limitar(db, h, dia, ambito) {
  const r = await db
    .prepare('INSERT INTO limites (huella, dia, ambito, n) VALUES (?1, ?2, ?3, 1) ON CONFLICT (huella, dia, ambito) DO UPDATE SET n = n + 1 RETURNING n')
    .bind(h, dia, ambito)
    .first();
  return r ? r.n : 1;
}
export const leerLimite = async (db, h, dia, ambito) =>
  (await db.prepare('SELECT n FROM limites WHERE huella = ?1 AND dia = ?2 AND ambito = ?3').bind(h, dia, ambito).first())?.n || 0;

export async function igualesSeguro(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  return crypto.subtle.timingSafeEqual ? crypto.subtle.timingSafeEqual(x, y) : (() => {
    const u = new Uint8Array(x), v = new Uint8Array(y);
    let d = 0;
    for (let i = 0; i < u.length; i++) d |= u[i] ^ v[i];
    return d === 0;
  })();
}

// ---- LISTA CERRADA de claves para /api/uso -------------------------------
// Al publicar un ensayo o un set nuevo, agrega su id aquí (y solo aquí).
export const ENSAYOS = ['essay-harm-reduction', 'essay-emancipation-desire', 'essay-nightlife-economy'];
export const MIXES = ['default', 'trance', 'house', 'disco'];
const alt = (l) => l.join('|');

const FIJAS = new Set([
  'sesion', 'equipos:dia', 'equipos:nuevo', 'easter_egg', 'instalada', 'lightbox',
  'form:contacto:enviado', 'form:contacto:error', 'form:invitacion:enviado', 'form:invitacion:error',
  'segundos_a_la_vista'
]);
const PATRONES = [
  /^disp:(celular|tablet|computador)$/,
  /^ref:(instagram\.com|google\.com|soundcloud\.com|t\.co|bandcamp\.com|youtube\.com|facebook\.com|whatsapp\.com|otro|directo)$/,
  /^llegada:(ig|wa|bio|qr|tg|x|mail|otro)$/,
  /^vista:(inicio|ae000x|writing|message|games)$/,
  new RegExp(`^ensayo:(${alt(ENSAYOS)})$`),
  new RegExp(`^lectura:(${alt(ENSAYOS)}):(25|50|75|100)$`),
  /^idioma:(en|es|pt)(:manual)?$/,
  /^tema:(default|disco|house|trance)$/,
  new RegExp(`^mix:(${alt(MIXES)})$`),
  /^portal:(instagram|soundcloud|bandcamp|youtube)$/,
  /^cajon:(faq|galeria|residentes|variantes)$/,
  /^afiche:([0-9]{1,2})$/,
  new RegExp(`^compartir:(nativo|whatsapp|telegram|x|facebook|copiar|otro):(${alt(ENSAYOS)})$`),
  /^duracion:(0-10s|10-30s|30-60s|1-3min|3-10min|10min\+)$/
];
export const claveValida = (c) => typeof c === 'string' && c.length <= 90 && (FIJAS.has(c) || PATRONES.some((p) => p.test(c)));

// Campos permitidos en la fila `inicio` (JSON corto, solo primitivos).
export const CAMPOS_INICIO = new Set([
  'disp', 'ref', 'de', 'utm_source', 'utm_medium', 'utm_campaign', 'nuevo', 'lang_nav', 'lang', 'tema',
  'pantalla', 'ventana', 'dpr', 'tactil', 'oscuro', 'movimiento_reducido', 'red', 'ahorro', 'app'
]);
export function limpiarInicio(o) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
  const out = {};
  for (const [k, v] of Object.entries(o)) {
    if (!CAMPOS_INICIO.has(k)) continue;
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'string') out[k] = v.replace(/[^\w .:/@+\-x×,]/g, '').slice(0, 40);
  }
  const s = JSON.stringify(out);
  return s.length <= 600 ? s : null;
}

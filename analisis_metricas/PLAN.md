# PLAN — Métricas de aeriel.net (reconocimiento)

## Lo que se encontró en el repo (06-10-2026)
- Sitio **100 % estático**: `index.html`, `style.css`, `sw.js`, carpetas `writing/ ensayos/ message/ mensaje/ ae000x/ games/ party/`.
- **No hay** `wrangler.toml`, `package.json`, `functions/` ni build. Hay `_headers` y `_redirects` (formato Cloudflare Pages / Netlify). `.gitignore` ya menciona `.dev.vars` y `.wrangler/`, y `AGENTS.md` habla de Netlify, así que **el hosting no está confirmado**.
- `server: cloudflare` en la respuesta → hay proxy de Cloudflare delante.
- **CSP actual** (`_headers`): `script-src 'self' 'unsafe-inline'`, `connect-src 'self' https://script.google.com …`. `POST /api/uso` es same-origin, así que **ya cabe**. Web Analytics con snippet exigiría sumar `static.cloudflareinsights.com` (script-src) y `cloudflareinsights.com` (connect-src).
- Los formularios van **directo del navegador a Google Apps Script** (`Code.gs`). No hay servidor propio que reciba `request.cf`; por eso la metadata de [02.D] se registra desde `/api/uso` con la clave `form:*:enviado` (sin contenido).
- Ids de ensayo reales: `essay-harm-reduction`, `essay-emancipation-desire`, `essay-nightlife-economy`. Sets: `data-genre` = default | trance | house | disco.
- Navegación SPA con `history`/hash (`#writing-subsite`, `#article-reader`, `?essay=`).

## Lo que NO se pudo hacer desde esta sesión
Esta sesión corre en un contenedor en la nube **sin Computer Use ni Claude in Chrome** y sin sesión de Cloudflare. Por eso quedan **pendientes de hacer con el navegador** (desde la app de escritorio): Account ID, si `aeriel.net` es zona, si el sitio es Pages / Worker / externo, y si existe Web Analytics y su `site_tag`.

## Arquitectura recomendada
**A. Pages + Pages Functions + D1** — si el sitio ya está en Cloudflare Pages (lo más probable por `_headers`/`_redirects`/`.gitignore`). No requiere build, calza con el repo estático y es igual a El Guarén.
- Si el panel muestra un Worker con assets → **B** (mismo código, rutas dentro del Worker).
- Si el hosting es Netlify u otro detrás del proxy naranja → **C** (Worker aparte en `aeriel.net/api/*` y `/metricas*`).
`api/*.js` están escritos en formato Pages Functions; pasar a B/C es mecánico.

## Qué se tocaría FUERA de `analisis_metricas/` (requiere OK del dueño)
1. `functions/api/{comun,uso,metricas}.js` (copia de `api/`).
2. `metricas.html|css|js` y `contador.js` en la raíz pública.
3. `<script src="/contador.js" defer></script>` en `index.html` y los stubs `writing/ ensayos/ message/ mensaje/ ae000x/`.
4. `wrangler.toml` (binding D1 `DB`) y `_headers` (fragmento en `_headers.fragmento`).
5. `robots.txt`: `Disallow: /metricas` y `/api/`.
6. `/privacy` en EN/ES/PT con la tabla de `privacidad.md`.
7. `sw.js`: no cachear `/api/` ni `/metricas*` (hoy es network-first; solo excluir).
Ver `LEEME.md` para el detalle y los comandos.

# analisis_metricas — visor privado de aeriel.net

Estado: **probado en local con `wrangler dev` (Worker + D1 local + navegador, 1280 px y 375 px, 4 temas)**. Falta solo lo que necesita la cuenta de Cloudflare: poner los secretos y desplegar (ver abajo).

## Qué hay y dónde vive
- `worker.js` es la entrada del Worker de aeriel.net (`wrangler.jsonc` → `main`). Atiende `/api/uso` y `/api/metricas`; todo lo demás lo sirven los assets.
- `api/comun.js` utilidades + **lista cerrada** de claves (al publicar un ensayo o set nuevo, agrega su id en `ENSAYOS` / `MIXES`). `api/uso.js` `POST /api/uso` · `api/metricas.js` `GET /api/metricas`.
- `migraciones/` D1 (`uso_diario`, `cloudflare_diario`, `limites`, `meta`, `eventos`, `formularios_meta`). `wrangler.jsonc` apunta aquí con `migrations_dir`.
- En la raíz pública: `contador.js` (cargado desde `index.html`) y el visor `metricas.html|css|js`, servido en `/metricas`. Sus cabeceras (CSP estricta, `no-store`, `noindex`) están al final de `/_headers`.
- `/.assetsignore`: el Worker publica la carpeta entera (`assets.directory: "."`), así que ahí se listan los archivos que **no** deben quedar públicos (`.git`, `.dev.vars`, `wrangler.jsonc`, esta carpeta, `AGENTS.md`, `Code.gs`, …).
- `privacidad.md` · `pruebas/probar_local.sh`.

## Probar en local
```
bash analisis_metricas/pruebas/probar_local.sh
```
Crea `.dev.vars` con claves de prueba si no existe, aplica las migraciones a la D1 local, levanta `wrangler dev` en el puerto 8787 y comprueba: visita falsa → 204 y queda en D1; `GET /api/uso` → 405; `/api/metricas` sin clave → 401 y con clave → 200; `/metricas` → 200; y que `.dev.vars`, `wrangler.jsonc`, `analisis_metricas/` y `.git` den 404. Después abre `http://localhost:8787/metricas#k=clave-de-prueba`.

## Lo que tiene que hacer el dueño en Cloudflare
La base D1 `aeriel-metricas` y el binding `DB` ya existen (`wrangler.jsonc`). Faltan **cinco valores**, todos como secretos del Worker `aeriel-aiff` (así un `wrangler deploy` no los borra, cosa que sí pasa con las variables de texto puestas en el panel):

| Nombre | Qué es | De dónde sale |
|---|---|---|
| `METRICAS_CLAVE` | La clave del link privado `/metricas#k=…` | `openssl rand -hex 32` |
| `FIRMA` | Sal del HMAC que anonimiza IPs para los topes | `openssl rand -hex 32` |
| `CF_API_TOKEN` | Token con permiso **Account → Account Analytics → Read** | dash.cloudflare.com → My Profile → API Tokens |
| `CF_ACCOUNT_ID` | Account ID | dash.cloudflare.com → panel derecho de la cuenta |
| `CF_SITE_TAG` | `site_tag` de Web Analytics de aeriel.net | Analytics & Logs → Web Analytics → aeriel.net (va en el snippet / la URL) |
| `METRICAS_DESDE` *(opcional)* | Fecha `AAAA-MM-DD` desde la que contar | — |

```
openssl rand -hex 32 | npx wrangler secret put METRICAS_CLAVE
openssl rand -hex 32 | npx wrangler secret put FIRMA
npx wrangler secret put CF_API_TOKEN     # pegar el token cuando lo pida
npx wrangler secret put CF_ACCOUNT_ID
npx wrangler secret put CF_SITE_TAG
npx wrangler secret list                 # ver que estén los cinco (no muestra valores)
```
Sin los tres `CF_*` el visor funciona igual con los datos propios y muestra el aviso «FALTA CONECTAR CLOUDFLARE». El link privado es `https://aeriel.net/metricas#k=<METRICAS_CLAVE>`; para rotar, repetir el comando y volver a entregar el link por un canal privado. Los valores nunca van a archivos del repo ni al chat.

## Deploy
1. (Una vez, no hace daño repetirlo: todas las tablas son `IF NOT EXISTS`) `npx wrangler d1 migrations apply aeriel-metricas --remote`
2. Merge a `main` (si el Worker está conectado a Git, despliega solo) o `npx wrangler deploy`.
3. Comprobar: `curl -I https://aeriel.net/wrangler.jsonc` → 404; abrir el link privado.

## Pendiente
1. **Comprobar el esquema GraphQL** de `rumPageloadEventsAdaptiveGroups` con la cuenta real (los nombres de filtros/dimensiones no se han probado contra Cloudflare; sin token no se puede en local). Si falla, el visor muestra el error de Cloudflare en el aviso.
2. Cableado de eventos que el sitio todavía no emite: éxito/error de formularios, compartir, cajones, afiches, lightbox y easter egg necesitan `window.aerielContar('form:contacto:enviado')`, etc.
3. Ley 21.719: retención decidida (eventos 90 d, formularios_meta 30 d, limites 2 d; `purgarVencidos` en `api/comun.js`, una vez al día desde `/api/uso`). `/privacy` y `/privacidad` publicadas.

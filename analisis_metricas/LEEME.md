# analisis_metricas — visor privado de aeriel.net

Estado: **código escrito y revisado en sintaxis; sin desplegar y sin probar contra Cloudflare real** (ver «Pendiente»). Nada fuera de esta carpeta fue modificado.

## Qué hay
- `migraciones/` D1: `uso_diario`, `cloudflare_diario`, `limites`, `meta`, `eventos`, `formularios_meta`.
- `api/comun.js` utilidades + **lista cerrada** de claves (al publicar un ensayo o set nuevo, agrega su id en `ENSAYOS` / `MIXES`).
- `api/uso.js` `POST /api/uso` · `api/metricas.js` `GET /api/metricas`.
- `sitio/contador.js` (para aeriel.net) · `sitio/metricas.{html,css,js}` (visor, sin estilos/scripts en línea, 4 temas).
- `_headers.fragmento` CSP estricta de `/metricas` · `privacidad.md` · `pruebas/probar_local.sh`.

## Verificado en esta sesión
- Sintaxis de todos los `.js` y del `.sh`.
- Lista cerrada: acepta claves válidas y rechaza inventadas/inyecciones; `limpiarInicio` descarta campos no permitidos; recorte de IP.
- Contraste de los 4 temas: texto ≥ 7:1; acento de gráficos ≥ 3:1 (House 3.04 sobre fondo, por eso su panel usa el mismo fondo); las barras llevan además borde blanco.

## Pendiente (necesita navegador / dueño)
1. Reconocimiento en dash.cloudflare.com (Account ID, zona, Pages/Worker, Web Analytics, `site_tag`) → ver `PLAN.md`.
2. **Comprobar el esquema GraphQL** de `rumPageloadEventsAdaptiveGroups` con la cuenta real (nombres de filtros/dimensiones escritos de memoria, no probados).
3. Probar `pruebas/probar_local.sh` (necesita `wrangler`; no se pudo ejecutar aquí).
4. Probar a 375 px y en los 4 temas en un navegador real.
5. Cableado en el sitio: `contador.js` detecta rutas, ensayos, lectura, portales, mix y tema por delegación, pero **éxito/error de formularios, compartir, cajones, afiches, lightbox y easter egg** necesitan que el sitio llame `window.aerielContar('form:contacto:enviado')`, etc. (cambio mínimo en `index.html`, con OK).
6. Ley 21.719: retención decidida (eventos 90 d, formularios_meta 30 d, limites 2 d; `purgarVencidos` en `api/comun.js`, una vez al día desde `/api/uso`). Falta publicar `/privacy` con `privacidad.md`.

## Qué se copiaría fuera de la carpeta (tras el OK)
| Origen | Destino |
|---|---|
| `api/*.js` | `functions/api/` |
| `sitio/metricas.*`, `sitio/contador.js` | raíz pública |
| `_headers.fragmento` | añadir a `/_headers` |
| — | `<script src="/contador.js" defer>` en las páginas; `Disallow: /metricas` y `/api/` en `robots.txt`; excluir `/api/` y `/metricas*` en `sw.js` |

## Secretos (solo nombres; los valores nunca van a archivos ni al chat)
`CF_API_TOKEN` (Account Analytics: Read) · `METRICAS_CLAVE` · `FIRMA` · variables no secretas: `CF_ACCOUNT_ID`, `CF_SITE_TAG`, `METRICAS_DESDE` (opcional).
```
openssl rand -hex 32 | npx wrangler pages secret put METRICAS_CLAVE --project-name <proyecto>
openssl rand -hex 32 | npx wrangler pages secret put FIRMA --project-name <proyecto>
npx wrangler pages secret put CF_API_TOKEN --project-name <proyecto>   # el dueño pega el token
```
Rotar = repetir el comando y volver a entregar el link `/metricas#k=…` por un canal privado.

## Deploy
`npx wrangler d1 create aeriel-metricas` → binding `DB` → `npx wrangler d1 migrations apply aeriel-metricas --remote` (mover `migraciones/` a la carpeta que pida wrangler o usar `d1 execute --file`) → desplegar con el comando del proyecto, con un sí del dueño.

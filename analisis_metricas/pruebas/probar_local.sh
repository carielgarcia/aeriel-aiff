#!/usr/bin/env bash
# Prueba local: D1 local + visitas falsas + abrir /metricas. No toca producción.
set -euo pipefail
cd "$(dirname "$0")/../.."
RAIZ=analisis_metricas
BASE=.wrangler/prueba            # carpeta temporal, ya ignorada por .gitignore
rm -rf "$BASE" && mkdir -p "$BASE/functions/api" "$BASE/public"
cp "$RAIZ"/api/*.js "$BASE/functions/api/"
cp "$RAIZ"/sitio/metricas.{html,css,js} "$BASE/public/"
cp "$RAIZ"/sitio/contador.js "$BASE/public/"
cat > "$BASE/wrangler.toml" <<TOML
name = "aeriel-prueba"
compatibility_date = "2026-01-01"
pages_build_output_dir = "public"
[[d1_databases]]
binding = "DB"
database_name = "aeriel-metricas"
database_id = "local"
TOML
cat > "$BASE/.dev.vars" <<VARS
METRICAS_CLAVE=clave-de-prueba
FIRMA=firma-de-prueba
PERMITIR_LOCAL=1
VARS
cd "$BASE"
for f in ../"$RAIZ"/migraciones/*.sql; do npx wrangler d1 execute aeriel-metricas --local --file "$f"; done
npx wrangler pages dev public --port 8788 --local &
PID=$!; trap 'kill $PID 2>/dev/null || true' EXIT; sleep 6
H='-H Origin:http://localhost:8788'
echo "-- visita falsa → 204 y suma en D1 local"
curl -s -o /dev/null -w '%{http_code}\n' $H -X POST localhost:8788/api/uso -d '{"s":"abc12345","e":["sesion","disp:celular","vista:writing","ensayo:essay-harm-reduction","lectura:essay-harm-reduction:50"],"i":{"disp":"celular","ref":"instagram.com"}}'
echo "-- clave inventada → 204 y NO escribe"
curl -s -o /dev/null -w '%{http_code}\n' $H -X POST localhost:8788/api/uso -d '{"s":"abc12345","e":["ensayo:inventado"]}'
echo "-- sin clave → 401"
curl -s -o /dev/null -w '%{http_code}\n' localhost:8788/api/metricas
echo "-- con clave → JSON (cf.error esperado sin token de Cloudflare)"
curl -s -H 'Authorization: Bearer clave-de-prueba' localhost:8788/api/metricas | head -c 400; echo
echo "Visor: http://localhost:8788/metricas.html#k=clave-de-prueba  (Ctrl+C para cerrar)"
wait $PID

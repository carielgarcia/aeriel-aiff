#!/usr/bin/env bash
# Prueba local del Worker real (wrangler.jsonc): D1 local + visitas falsas + visor. No toca producción.
# Uso: bash analisis_metricas/pruebas/probar_local.sh   (desde cualquier carpeta; necesita Node y npx)
set -euo pipefail
cd "$(dirname "$0")/../.."
PUERTO=8787
if [ ! -f .dev.vars ]; then
  printf 'METRICAS_CLAVE=clave-de-prueba\nFIRMA=firma-de-prueba\nPERMITIR_LOCAL=1\n' > .dev.vars   # ignorado por git y por .assetsignore
fi
CLAVE="$(grep '^METRICAS_CLAVE=' .dev.vars | cut -d= -f2-)"
npx wrangler d1 migrations apply aeriel-metricas --local
npx wrangler dev --local --port "$PUERTO" &
PID=$!; trap 'kill $PID 2>/dev/null || true' EXIT
until curl -s -o /dev/null "localhost:$PUERTO/"; do sleep 1; done
B="http://localhost:$PUERTO"; O="Origin: $B"
esperar() { [ "$2" = "$3" ] && echo "ok   $1 ($2)" || { echo "FALLA $1: esperaba $3, llegó $2"; exit 1; }; }
esperar 'visita falsa' "$(curl -s -o /dev/null -w '%{http_code}' -H "$O" -X POST $B/api/uso -d '{"s":"abc12345","e":["sesion","disp:celular","vista:writing","ensayo:essay-harm-reduction","lectura:essay-harm-reduction:50"],"i":{"disp":"celular","ref":"instagram.com"}}')" 204
esperar 'GET /api/uso' "$(curl -s -o /dev/null -w '%{http_code}' $B/api/uso)" 405
esperar 'sin clave' "$(curl -s -o /dev/null -w '%{http_code}' $B/api/metricas)" 401
esperar 'con clave' "$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $CLAVE" $B/api/metricas)" 200
curl -s -H "Authorization: Bearer $CLAVE" $B/api/metricas | grep -q '"vista:writing":' && echo 'ok   la visita quedó en D1' || { echo 'FALLA la visita no quedó en D1'; exit 1; }
esperar 'visor /metricas' "$(curl -s -o /dev/null -w '%{http_code}' $B/metricas)" 200
for p in /.dev.vars /wrangler.jsonc /analisis_metricas/api/comun.js /.git/config; do
  esperar "no se publica $p" "$(curl -s -o /dev/null -w '%{http_code}' $B$p)" 404
done
echo "Visor: $B/metricas#k=$CLAVE   (Ctrl+C para cerrar)"
wait $PID

-- Contadores por día (hora de Santiago). Solo claves de la lista cerrada (api/comun.js).
CREATE TABLE IF NOT EXISTS uso_diario (
  dia   TEXT NOT NULL,
  clave TEXT NOT NULL,
  n     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (dia, clave)
) WITHOUT ROWID;

-- Copia de los días cerrados de Cloudflare Web Analytics (Cloudflare guarda ~6 meses).
CREATE TABLE IF NOT EXISTS cloudflare_diario (
  dia     TEXT NOT NULL,
  tipo    TEXT NOT NULL,   -- total | equipo | navegador | so | pais | llegada | pagina
  valor   TEXT NOT NULL,
  vistas  INTEGER NOT NULL DEFAULT 0,
  visitas INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (dia, tipo, valor)
) WITHOUT ROWID;

-- Topes por conexión y día (huella HMAC, nunca la IP).
CREATE TABLE IF NOT EXISTS limites (
  huella TEXT NOT NULL,
  dia    TEXT NOT NULL,
  ambito TEXT NOT NULL,    -- uso | auth
  n      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (huella, dia, ambito)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS meta (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL
) WITHOUT ROWID;

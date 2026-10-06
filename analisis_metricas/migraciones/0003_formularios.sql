-- Metadata aproximada de envíos de formularios. NUNCA el contenido ni la IP completa.
CREATE TABLE IF NOT EXISTS formularios_meta (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  ts        INTEGER NOT NULL,
  dia       TEXT NOT NULL,
  form      TEXT NOT NULL,   -- contacto | invitacion
  pais      TEXT,
  region    TEXT,
  ciudad    TEXT,
  postal    TEXT,
  lat       REAL,            -- aproximada por IP
  lon       REAL,
  zona      TEXT,
  asn       INTEGER,
  proveedor TEXT,
  colo      TEXT,
  http      TEXT,
  tls       TEXT,
  rtt       INTEGER,
  ua        TEXT,
  idiomas   TEXT,
  gpc       INTEGER,
  ip_corta  TEXT,            -- IPv4 /24, IPv6 /48
  huella    TEXT             -- HMAC(FIRMA, ip)
);
CREATE INDEX IF NOT EXISTS formularios_dia ON formularios_meta (dia);

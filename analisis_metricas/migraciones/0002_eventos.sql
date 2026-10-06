-- Una fila por evento. `sesion` es un número al azar por pestaña, muere al cerrarla.
CREATE TABLE IF NOT EXISTS eventos (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  ts     INTEGER NOT NULL,   -- ms epoch
  dia    TEXT NOT NULL,      -- YYYY-MM-DD Santiago
  sesion TEXT NOT NULL,
  tipo   TEXT NOT NULL,
  valor  TEXT,
  r      TEXT                -- JSON corto solo en tipo = 'inicio'
);
CREATE INDEX IF NOT EXISTS eventos_dia    ON eventos (dia);
CREATE INDEX IF NOT EXISTS eventos_sesion ON eventos (sesion);

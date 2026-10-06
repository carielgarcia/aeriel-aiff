# Qué se guarda (base para `/privacy` en EN / ES / PT)

Sin cookies, sin cuentas, sin scripts de terceros que sigan a la gente a otros sitios. Si la visita llega con **Global Privacy Control** (`Sec-GPC: 1`), solo se suma un contador anónimo: no se guarda el registro de la visita ni la metadata de formularios.

| Dónde | Columna / clave | Qué es | Por qué | Cuánto se guarda |
|---|---|---|---|---|
| `uso_diario` | `dia, clave, n` | Contadores por día: sesiones, tipo de equipo, familia del sitio de llegada, vistas, ensayos abiertos, % leído (25/50/75/100), sets abiertos, clics a Instagram/SoundCloud/Bandcamp/YouTube, idioma, tema, duración en tramos, segundos a la vista | Saber qué se usa | Sin límite (son sumas, no personas) |
| `eventos` | `ts, dia, sesion, tipo, valor` | Pasos de una visita unidos por un número al azar que **muere al cerrar la pestaña** | Entender recorridos | A definir por el dueño |
| `eventos.r` (solo `inicio`) | equipo, familia de llegada, `?de=`, `utm_*`, nuevo/recurrente, idioma del navegador y elegido, tema, tamaño de pantalla y ventana, `devicePixelRatio`, táctil, modo oscuro, movimiento reducido, tipo de red, ahorro de datos, app instalada | Contexto técnico de la visita | Diseñar para los equipos reales | Igual que `eventos` |
| `cloudflare_diario` | `dia, tipo, valor, vistas, visitas` | Copia de los totales diarios de Cloudflare Web Analytics | No perder historia | Sin límite |
| `formularios_meta` | país, región, ciudad, código postal, lat/lon **aproximadas por IP**, zona horaria, ASN y proveedor, centro de Cloudflare, protocolo HTTP, versión TLS, RTT, User-Agent, idiomas, GPC, `ip_corta` (IPv4 /24, IPv6 /48), `huella` (HMAC) | Metadata de un envío de formulario | Saber desde dónde escriben, sin identificar | A definir por el dueño |
| `limites` | `huella, dia, ambito, n` | Tope de pedidos por conexión y día | Evitar abuso | Se puede borrar a los 2 días |

**Nunca se guarda:** la IP completa, nombre, correo, WhatsApp ni el texto de ningún formulario (eso solo lo recibe Google Apps Script, como hasta ahora).
**Si agregas un dato, agrégalo también aquí y en `/privacy`.**

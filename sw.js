/* ÆRIEL service worker — offline reading, no tracking.
   Network-first for everything same-origin so updates are never masked by a stale cache;
   the cache is only a fallback when the signal drops (e.g. inside a venue). */
const CACHE = 'aeriel-offline-v1';
const SHELL = [
  '/',
  '/index.html',
  '/style.css?v=20.4',
  '/manifest.webmanifest',
  '/public/icons/icon-192.png'
];
const MAX_BYTES = 2 * 1024 * 1024;
const SKIP = [/^\/games\//, /^\/public\/audio\//, /^\/public\/video\//];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(SHELL.map((u) => cache.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (SKIP.some((re) => re.test(url.pathname))) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const size = Number(res.headers.get('content-length') || 0);
        if (res.ok && res.type === 'basic' && size <= MAX_BYTES) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(req);
        if (hit) return hit;
        // Single-page app: any offline navigation falls back to the cached shell,
        // whose router reads location.pathname (/writing/<slug>, /ensayos/<slug>, ...).
        if (req.mode === 'navigate') {
          const shell = await caches.match('/index.html') || await caches.match('/');
          if (shell) return shell;
        }
        return Response.error();
      })
  );
});

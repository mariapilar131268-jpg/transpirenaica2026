// ━━━ TRANSPIRENAICA 2026 · SERVICE WORKER v5 ━━━
// Estrategia: RED PRIMERO → caché solo como emergencia offline
const CACHE = 'transpi2026-v5';

// Instalación: guardar recursos básicos en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(['./', './index.html', './manifest.json']))
      .then(() => self.skipWaiting())
  );
});

// Activación: eliminar solo cachés ANTIGUAS (no la actual)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE)   // conservar la caché actual
          .map(k => caches.delete(k)) // borrar solo las antiguas
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: RED PRIMERO — si hay conexión, siempre sirve la versión más nueva
// Solo usa caché si la red falla (modo offline / túneles)
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      })
      .catch(() =>
        caches.match(e.request).then(cached => cached || caches.match('./index.html'))
      )
  );
});

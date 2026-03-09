// ━━━ TRANSPIRENAICA 2026 · SERVICE WORKER ━━━
// Estrategia: RED PRIMERO → caché solo como emergencia offline
const CACHE = 'transpi2026-v3';

// Instalación: guardar recursos básicos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(['./', './index.html', './manifest.json']))
      .then(() => self.skipWaiting()) // Activa inmediatamente sin esperar
  );
});

// Activación: eliminar TODAS las cachés antiguas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k)))) // Borra todo
      .then(() => self.clients.claim()) // Toma control inmediato de todas las pestañas
  );
});

// Fetch: RED PRIMERO — si hay conexión, siempre sirve la versión más nueva
// Solo usa caché si la red falla (modo offline)
self.addEventListener('fetch', e => {
  // Solo interceptar peticiones al mismo origen
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(resp => {
        // Red OK → actualizar caché y devolver respuesta fresca
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      })
      .catch(() =>
        // Sin red → servir desde caché (modo avión / túneles)
        caches.match(e.request).then(cached => cached || caches.match('./index.html'))
      )
  );
});

// Transpirenaica 2026 — Service Worker v6
const CACHE = 'transpi2026-v6';
const ASSETS = ['./', './index.html'];

self.addEventListener('install', e => {
  // Activar inmediatamente sin esperar a que se cierren pestañas
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', e => {
  // Tomar control de todas las pestañas abiertas inmediatamente
  e.waitUntil(
    clients.claim().then(() =>
      caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
      )
    )
  );
});

// Network-first: intenta red, si falla usa caché
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Responder a SKIP_WAITING desde la app (compatibilidad)
self.addEventListener('message', e => {
  if(e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

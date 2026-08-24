const CACHE_NAME='lonewolf-nightvision-v2.4.0';
const SHELL=[
  './index.html',
  './css/style.css',
  './js/camera.js',
  './js/image-processing.js',
  './js/measurement.js',
  './js/reticle.js',
  './js/vr.js',
  './js/compass.js',
  './js/app.js',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // En modo Web App de iPhone, la navegación inicial debe resolverse
  // siempre contra el index cacheado o la red, evitando una respuesta
  // antigua/vacía para "./".
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached =>
        fetch(event.request, { cache: 'no-store' })
          .then(response => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
            }
            return response;
          })
          .catch(() => cached || caches.match('./index.html'))
      )
    );
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

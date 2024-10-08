const CACHE_NAME = 'karteikarten-app-cache';
const urlsToCache = [
  '/app/',
  '/app/index.html',
  '/app/styles.css',
  '/app/script.js',
  '/app/manifest.json',
  '/app/icon-192x192.png',
  '/app/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

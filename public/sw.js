// Service Worker Oresto PWA - v5 (Anti-Stale Cache Buster)
const CACHE_NAME = 'oresto-pwa-v5-' + Date.now();
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/favicon.ico',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Purge ALL older caches immediately
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Always network-first for navigation with fallback to root index
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(async () => (await caches.match('/')) || caches.match(event.request))
    );
    return;
  }

  // Always network-first for JavaScript bundles, CSS, and dynamic assets
  if (
    event.request.destination === 'script' ||
    event.request.destination === 'style' ||
    url.includes('/assets/') ||
    url.includes('.js') ||
    url.includes('.css')
  ) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first only for static icons and images
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

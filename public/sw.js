// Service Worker Oresto PWA - v7 (Never Intercept JS or Assets)
const CACHE_NAME = 'oresto-pwa-v7';

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

  // CRITICAL: NEVER intercept JavaScript chunks, CSS, Vite assets, or API calls!
  // Let the browser's native network stack fetch them directly without service worker interference.
  if (
    url.includes('/assets/') ||
    url.includes('/api/') ||
    url.includes('.js') ||
    url.includes('.css') ||
    event.request.destination === 'script' ||
    event.request.destination === 'style'
  ) {
    return; // Pass through to browser native networking
  }

  // Navigation requests: Network-first with fallback to /
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => (await caches.match('/')) || fetch(event.request))
    );
    return;
  }

  // Only cache-first for static image assets
  if (event.request.destination === 'image' || url.includes('/favicon')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});

const CACHE_NAME = 'picasso-catch-v3'; // Increment version to force cache refresh
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sprites/picasso.png',
  './sprites/hrs.png',
  './sprites/sus.png',
  './sprites/muckalica.png',
  './sprites/pizza.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// Listen for skip waiting message
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Install — cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // Don't auto-skip waiting - let user confirm update
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // Take control of all clients immediately
});

// Fetch — NETWORK FIRST, fall back to cache (ensures latest code when online)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response before caching
        const responseClone = response.clone();
        
        // Update cache with fresh version
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then(cached => {
          return cached || new Response('Offline - resource not cached', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

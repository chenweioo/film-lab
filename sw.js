// Film Lab v3.1 Service Worker — Stale-while-revalidate + Offline Cache
// Works around GitHub Pages intermittent connection resets in China
var CACHE_NAME = 'film-lab-v3.2';

// ===== Install: precache shell, but DON'T fail if network is down =====
self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

// ===== Activate: clean old caches, claim clients =====
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) {
        return k !== CACHE_NAME;
      }).map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); })
  );
});

// ===== Fetch: cache ALL same-origin GET requests, instantly populate =====
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  // Only handle our own domain
  if (url.hostname !== 'chenweioo.github.io') return;
  // Only GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      // Try network — update cache in background
      var networkFetch = fetch(event.request, { mode: 'same-origin' }).then(function(response) {
        if (response && response.status === 200) {
          var respClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, respClone);
          });
        }
        return response;
      }).catch(function() { /* network down — that's fine */ });

      // Return cached immediately if available, otherwise wait for network
      return cached || networkFetch;
    })
  );
});

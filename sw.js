// Service Worker for Film Lab v3.1
// Network-first with cache fallback — resolves GitHub Pages instability in China

var CACHE_NAME = 'film-lab-v3.1';
var BASE = self.location.pathname.replace(/\/sw\.js$/, '');
var APP_SHELL = [BASE + '/', BASE + '/index.html', BASE + '/sw.js', BASE + '/stats.html'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
          .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Only handle navigation and same-origin requests
  if (event.request.mode !== 'navigate' && event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  if (url.hostname !== 'chenweioo.github.io') return;

  event.respondWith(
    fetch(event.request).then(function(response) {
      // Network success — update cache
      var respClone = response.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(event.request, respClone);
      });
      return response;
    }).catch(function() {
      // Network failed — serve from cache
      return caches.match(event.request).then(function(cached) {
        return cached || new Response('Offline — retry when connected', { status: 503 });
      });
    })
  );
});

const CACHE_NAME = 'kdrive-core-v99'; // Đổi số v2, v3... mỗi khi anh cập nhật code mới
const urlsToCache = [
  './',
  './index.html',
  './kdrive-style.css',
  './core-logic.js',
  './kdrive-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Xóa sạch bộ nhớ đệm cũ
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

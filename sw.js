self.addEventListener('install', (e) => {
    console.log('[Service Worker] Đã cài đặt');
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Đã kích hoạt');
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
    // Chuyển tiếp tất cả request mạng đi bình thường để app load mượt mà
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

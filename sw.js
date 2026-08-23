self.addEventListener('install', (e) => {
  console.log('[Service Worker] Đã cài đặt');
});

self.addEventListener('fetch', (e) => {
  // Dòng này là bùa chú bắt buộc phải có để Chrome cấp quyền cài PWA
});

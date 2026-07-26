// Service Worker untuk SecureChat PWA (Diperbarui)
const CACHE_NAME = 'securechat-v11'; // Versi dinaikkan untuk membersihkan cache lama
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js'
];

// 1. Tahap Install: Simpan aset utama ke cache
self.addEventListener('install', event => {
    console.log('[SW] Install Event: Mencache aset inti');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache).catch(err => {
                console.warn('[SW] Gagal mencache beberapa aset saat instalasi:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// 2. Tahap Activate: Bersihkan cache versi lama secara otomatis
self.addEventListener('activate', event => {
    console.log('[SW] Activate Event: Membersihkan cache usang');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => {
                    console.log('[SW] Menghapus cache lama:', key);
                    return caches.delete(key);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Tahap Fetch: Strategi Stale-While-Revalidate untuk performa kilat & selalu terperbarui
self.addEventListener('fetch', event => {
    // Abaikan permintaan yang bukan HTTP/HTTPS (seperti ekstensi browser atau Firebase WebSocket)
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('https://')) {
        return;
    }

    // Strategi khusus untuk dokumen HTML utama atau aset lokal
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // Jalankan pengambilan data dari jaringan di latar belakang
            const fetchPromise = fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Tangani kegagalan jaringan secara diam-diam jika data sudah ada di cache
            });

            // Kembalikan respons dari cache dengan segera (jika ada), atau tunggu dari jaringan
            return cachedResponse || fetchPromise;
        }).catch(() => {
            // Fallback jika benar-benar offline dan item tidak ada di cache
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
            return new Response('Resource tidak tersedia secara offline', { status: 503 });
        })
    );
});

// 4. Listeners Push Notification (Opsional)
self.addEventListener('push', event => {
    if (event.data) {
        try {
            const data = event.data.json();
            event.waitUntil(
                self.registration.showNotification(data.title || 'SecureChat', {
                    body: data.body || 'Pesan terenkripsi baru masuk',
                    icon: './icon-192.png',
                    badge: './icon-192.png',
                    tag: 'securechat',
                    renotify: true
                })
            );
        } catch (e) {
            event.waitUntil(
                self.registration.showNotification('SecureChat', {
                    body: 'Ada pesan baru masuk',
                    icon: './icon-192.png',
                    badge: './icon-192.png',
                    tag: 'securechat'
                })
            );
        }
    }
});

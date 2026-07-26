// Service Worker untuk SecureChat PWA (Diperbarui)
const CACHE_NAME = 'securechat-v13';
const urlsToCache = [
    './',
    './index.html',
    './fix-layout.css',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js'
];

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

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('https://')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        }).catch(() => {
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
            return new Response('Resource tidak tersedia secara offline', { status: 503 });
        })
    );
});

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

self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') self.skipWaiting();
});

// Service Worker untuk SecureChat PWA
const CACHE_NAME = 'securechat-v3';
const urlsToCache = [
    './',
    './index.html',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js'
];

self.addEventListener('install', event => {
    console.log('[SW] Install event');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache).catch(err => {
                console.warn('Cache addAll error:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    console.log('[SW] Activate event');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = event.request.url;
    // Jangan cache Firebase DB atau API eksternal yang dinamis
    if (url.includes('firebasedatabase.app') || url.includes('googleapis.com') || url.includes('firebaseio.com')) {
        return;
    }
    // Untuk navigasi (HTML), coba network dulu, fallback ke cache
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request).then(resp => {
                    if (resp) return resp;
                    return caches.match('./index.html').then(fallback => fallback || new Response('Offline - SecureChat perlu koneksi', { status: 503 }));
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(networkResp => {
                    if (networkResp && networkResp.status === 200 && networkResp.type === 'basic') {
                        const clone = networkResp.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return networkResp;
                }).catch(() => {
                    if (event.request.destination === 'image') {
                        return new Response('', { status: 404 });
                    }
                    return new Response('Resource tidak tersedia offline', { status: 404 });
                });
            })
        );
    }
});

self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        event.waitUntil(
            self.registration.showNotification(data.title || 'SecureChat', {
                body: data.body || 'Pesan baru',
                icon: data.icon || '',
                tag: 'securechat'
            })
        );
    }
});

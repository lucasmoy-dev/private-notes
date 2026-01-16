const CACHE_NAME = 'keep-mesh-v3';
const ASSETS = [
    './',
    './index.html',
    './src/css/styles.css',
    './src/js/database.js',
    './src/js/mesh-engine.js',
    './src/js/crypto-layer.js',
    './manifest.json',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js',
    'https://unpkg.com/lucide@latest',
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
    'https://cdn-icons-png.flaticon.com/512/2965/2965358.png',
    'https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js'
];

// Install: Cache all assets
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Skip waiting to activate immediately
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Pre-caching assets');
            return cache.addAll(ASSETS);
        })
    );
});

// Activate: Clean up old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('SW: Cleaning old cache', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch handler
self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // CDN assets (Cache First)
    if (url.origin !== location.origin) {
        e.respondWith(
            caches.match(e.request).then((cached) => {
                return cached || fetch(e.request).then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, response.clone());
                        return response;
                    });
                });
            })
        );
        return;
    }

    // Local assets (Stale-while-revalidate)
    e.respondWith(
        caches.match(e.request).then((cached) => {
            const fetched = fetch(e.request).then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, response.clone());
                    return response;
                });
            }).catch(() => null);

            return cached || fetched;
        })
    );
});

// Handle messages
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

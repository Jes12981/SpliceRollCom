const CACHE_NAME = 'spliceroll-cache-v1';
const urlsToCache = [
    '/',
    'merged.html',
    'service-worker.js',
    'manifest.json',
    'WindingDiameters.xlsx', // Assuming you want the user to access these offline
    'Splicing Diameters - Copy.xlsx',
    'TimeForPrint.xlsx',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js' // External library
    // Add your icon paths here (e.g., 'icons/icon-192x192.png')
];

// Install event: cache all necessary files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event: serve content from cache first, then network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request);
            })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
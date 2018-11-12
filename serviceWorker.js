const cacheName = "todo-v1";

const cacheAssets = [
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/img/logo.png',
]

// Call Install event
self.addEventListener('install', e => {
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log("Service Worker: Caching Files");
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    )
});

// Call Activate event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');
    // Remove unwanted caches
    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log("Service Worker: Clear Old Cache");
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

// Call Fecth Event
self.addEventListener("fetch", e => {
    console.log("Service Worker: Fetching");
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
});
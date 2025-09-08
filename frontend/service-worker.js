// const CACHE_NAME = 'bin-tracking-v1';
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/manifest.json',
//   '/favicon.ico',
//   // Add other static assets to cache
//   '/src/main.tsx',
//   '/src/App.tsx',
//   '/src/index.css',
//   // Add icon paths
//   '/icons/apple-touch-icon.png',
//   '/icons/icon-192x192.png',
// ];

// // Install event: Caches the static assets
// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => {
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

// // Fetch event: Serves cached content
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => {
//         if (response) {
//           return response;
//         }
//         return fetch(event.request);
//       })
//   );
// });

// // Activate event: Cleans up old caches
// self.addEventListener('activate', event => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.map(cacheName => {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });
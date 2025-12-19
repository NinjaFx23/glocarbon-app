const CACHE_NAME = 'glocarbon-v13'; // Incremented to match your new code
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo.svg',
  '/manifest.json',
  // Cache External Libraries so app structure works offline
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet/dist/leaflet.js'
];

// Install Event
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We use {cache: 'reload'} to ensure we get fresh files from server
      return cache.addAll(ASSETS.map(url => new Request(url, {cache: 'reload'}))); 
    })
  );
});

// Activate Event (Clean up old versions)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  return self.clients.claim();
});

// Fetch Event (Network First, then Cache)
// This strategy is better for prototypes so you see your changes immediately
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  );
});
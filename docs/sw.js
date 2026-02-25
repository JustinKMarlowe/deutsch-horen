const CACHE = 'dh-v5';
const STATIC = [
  '/deutsch-horen/',
  '/deutsch-horen/index.html',
  '/deutsch-horen/manifest.json',
  '/deutsch-horen/assets/index-CNtl3_kI.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});

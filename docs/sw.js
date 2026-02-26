const CACHE = 'dh-v8';
const STATIC = [
  '/deutsch-horen/',
  '/deutsch-horen/index.html',
  '/deutsch-horen/manifest.json',
  '/deutsch-horen/assets/index-25c34eca.js'
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

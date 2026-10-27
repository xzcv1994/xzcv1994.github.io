---
layout: compress
permalink: '/sw.js'
# PWA service worker
---

self.importScripts('{{ "/assets/js/data/swcache.js" | relative_url }}?v={{ site.time | date: "%s" }}');

const cacheName = 'chirpy-{{ site.time | date: "%s" }}';

function canCache(request) {
  const url = new URL(request.url);
  return request.method === 'GET' &&
    allowedDomains.includes(url.host) && !denyUrls.includes(request.url);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => cache.addAll(resource))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith('chirpy-') && key !== cacheName)
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (!canCache(event.request)) return;

  const url = new URL(event.request.url);
  const freshPage = url.origin === self.location.origin &&
    (event.request.mode === 'navigate' || event.request.destination === 'style');

  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(event.request);
    // Keep pages and styles current; use cached copies only when offline.
    if (cached && !freshPage) return cached;

    try {
      const response = await fetch(event.request, freshPage ? { cache: 'no-cache' } : {});
      if (response.ok) {
        await cache.put(event.request, response.clone());
      } else if (response.status >= 500 && cached) {
        return cached;
      }
      return response;
    } catch (error) {
      if (cached) return cached;
      throw error;
    }
  })());
});

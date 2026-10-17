// Keeps the Worker App opening with no signal. Put this file in the same folder as prop_workerapp.html.
const CACHE = "ranch-worker-v1";
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./prop_workerapp.html"])).catch(() => {}).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || !(u.origin === location.origin || u.hostname === "cdn.jsdelivr.net")) return; // never touch the Apps Script API
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./prop_workerapp.html"))));
});

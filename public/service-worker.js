const CACHE_NAME = 'offline-tiles-v1';
let captureEnabled = false;
let offlineOnly = false;

self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  if (type === 'SET_CAPTURE') {
    captureEnabled = !!(payload && payload.captureEnabled);
  }
  if (type === 'SET_OFFLINE_ONLY') {
    offlineOnly = !!(payload && payload.offlineOnly);
  }
});

function isTileRequest(req) {
  try {
    const url = new URL(req.url);
    // Target common OSM tile host
    return req.destination === 'image' && /tile\.openstreetmap\.org/.test(url.hostname);
  } catch (e) {
    return false;
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (!isTileRequest(req)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (offlineOnly) {
      if (cached) return cached;
      // Return a transparent 1x1 PNG if missing
      return new Response(new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,6,0,0,0,31,21,196,137,0,0,0,10,73,68,65,84,120,156,99,96,0,0,0,2,0,1,226,33,188,33,0,0,0,0,73,69,78,68,174,66,96,130]), { headers: { 'Content-Type': 'image/png' } });
    }
    // Not offline-only: prefer cache, then network
    if (cached) return cached;
    try {
      const resp = await fetch(req);
      if (captureEnabled && resp && resp.ok) {
        cache.put(req, resp.clone());
      }
      return resp;
    } catch (e) {
      // Network failed; fall back to cache if any
      if (cached) return cached;
      throw e;
    }
  })());
});


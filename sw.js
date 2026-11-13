/* Service worker: يتيح استخدام الموقع دون إنترنت بعد أول زيارة */
const VER = 'oman-v24';
const CORE = ["./", "about.html", "adventure.html", "chat.html", "crafts.html", "destination.html", "destinations.html", "eco.html", "governorates.html", "history.html", "index.html", "map.html", "plan.html", "safety.html", "sos.html", "trip.html", "vr.html", "css/style.css", "favicon.svg", "manifest.webmanifest", "apple-touch-icon.png", "images/icons/icon-192.png", "images/customer-service.png", "js/about.js", "js/adventure-data.js", "js/adventure.js", "js/chat-kb.js", "js/chat.js", "js/common.js", "js/craft3d.js", "js/crafts-data.js", "js/crafts-extra.js", "js/crafts.js", "js/data.js", "js/destination.js", "js/destinations.js", "js/eco.js", "js/exif.js", "js/gallery-data.js", "js/gov-details.js", "js/governorates.js", "js/history-data.js", "js/history.js", "js/home.js", "js/lodging-data.js", "js/map.js", "js/mapcore.js", "js/places.js", "js/qr.js", "js/risk.js", "js/safety-data.js", "js/safety.js", "js/site-config.js", "js/sos.js", "js/sources.js", "js/trip-plan.js", "js/trip.js", "js/voice.js", "js/vr.js"];
const CDN = /^https:\/\/(unpkg\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VER).then((c) => Promise.all(CORE.map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VER).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

async function networkFirst(req) {
  const c = await caches.open(VER);
  try { const r = await fetch(req); if (r && r.ok) c.put(req, r.clone()); return r; }
  catch (e) {
    return (await c.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? await c.match('index.html') : Response.error());
  }
}
async function cacheFirst(req) {
  const c = await caches.open(VER);
  const hit = await c.match(req);
  if (hit) return hit;
  try { const r = await fetch(req); if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; } catch (e) { return Response.error(); }
}
async function staleWhileRevalidate(req) {
  const c = await caches.open(VER);
  const hit = await c.match(req);
  const net = fetch(req).then((r) => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => hit);
  return hit || net;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (/\/images\//.test(url.pathname)) return e.respondWith(cacheFirst(req));
    return e.respondWith(networkFirst(req));
  }
  if (CDN.test(req.url)) return e.respondWith(staleWhileRevalidate(req));
});

/* رسالة من الصفحة: جهّز صور الوجهات للاستخدام دون إنترنت */
self.addEventListener('message', async (e) => {
  if (!e.data || e.data.type !== 'precache') return;
  const c = await caches.open(VER);
  let done = 0;
  for (const u of e.data.urls) {
    try { if (!(await c.match(u))) { const r = await fetch(u); if (r.ok) await c.put(u, r); } } catch (x) { /* تجاهل */ }
    done++;
    if (e.source) e.source.postMessage({ type: 'progress', done, total: e.data.urls.length });
  }
});

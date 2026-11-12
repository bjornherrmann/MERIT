// Bump CACHE_VERSION whenever you change the app so devices drop the old stored files.
const CACHE_VERSION = 'merit-v0.1.7';
const AUDIO_CACHE = 'merit-audio';   // filled by the page (index.html, cacheAudio); kept across versions
const PAGE_KEY = 'index.html';
const ASSETS = ['index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
const NETWORK_TIMEOUT_MS = 4000;     // on a very slow connection, use the stored page after this

// A redirected response (e.g. /index.html -> /) cannot answer a page request; copy it into a plain one.
function plain(resp){
  return resp.redirected
    ? resp.blob().then(b => new Response(b, { status: resp.status, statusText: resp.statusText, headers: resp.headers }))
    : Promise.resolve(resp);
}

// Store each file on its own: one failed download must not block the update.
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_VERSION).then(c => Promise.all(ASSETS.map(a =>
    fetch(a, { cache: 'no-store' }).then(r => r.ok ? plain(r).then(p => c.put(a, p)) : null).catch(() => {})
  ))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION && k !== AUDIO_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// The page: always from the network when online, so a refresh can never bring back an old version.
// The stored copy is used only offline (or when the network is too slow).
function page(url){
  const net = fetch(url, { cache: 'no-store' }).then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return plain(r);
  }).then(r => {
    const copy = r.clone();
    caches.open(CACHE_VERSION).then(c => c.put(PAGE_KEY, copy)).catch(() => {});
    return r;
  });
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), NETWORK_TIMEOUT_MS));
  return Promise.race([net, timeout]).catch(() =>
    caches.match(PAGE_KEY, { ignoreSearch: true }).then(hit => hit || net));
}

// Everything else (icons, manifest, audio): stored copy first, network as fallback.
// Audio is not stored here (the page manages the audio cache), so a missing file stays missing.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (e.request.mode === 'navigate' || url.pathname.endsWith('/index.html')){
    e.respondWith(page(url.origin + url.pathname));
    return;
  }
  const isAudio = url.pathname.includes('/audio/');
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
      if (resp.ok && !isAudio){
        const copy = resp.clone();
        caches.open(CACHE_VERSION).then(c => c.put(e.request, copy)).catch(() => {});
      }
      return resp;
    }))
  );
});

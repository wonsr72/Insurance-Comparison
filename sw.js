/* 보장비교분석 서비스워커 (11181821) — 한 번 열면 폰에 저장되어 인터넷 없이도 열립니다. 같은 사이트 파일만 다룹니다(구글시트 통신은 건드리지 않음). */
const V = 'bj-11181821', FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('bj-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(x => { const cp = x.clone(); caches.open(V).then(c => c.put('index.html', cp)); return x; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(x => { const cp = x.clone(); caches.open(V).then(c => c.put(r, cp)); return x; })));
});

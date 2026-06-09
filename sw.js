/**
 * BelaVenda — Service Worker (PWA)
 * ─────────────────────────────────────────────────────────
 * Estratégia: NETWORK-FIRST. Sempre tenta a rede (para nunca servir
 * versão velha quando online) e, se falhar (offline), usa o cache.
 * Recursos de outros domínios (Google Fonts, fotos Pexels) NÃO são
 * interceptados — o navegador cuida deles normalmente.
 */
const CACHE = 'belavenda-v2';
const CORE = [
  './', './index.html', './loja.html', './cliente.html', './painel.html', './login.html',
  './bv-theme.js', './bv-icons.js', './bv-seed.js', './belavenda-api.js',
  './manifest.json', './icon-192.png', './icon-512.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE).catch(function () {}); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // não intercepta CDNs externos

  e.respondWith(
    fetch(req)
      .then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        return res;
      })
      .catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match('./index.html'); });
      })
  );
});

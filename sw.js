// Žeks Döner service worker · d6abf0ec80 (generisano, ne uređivati)
const V = 'zeks-d6abf0ec80', BASE = "/zeks-doner-preview/", PRECACHE = ["/zeks-doner-preview/","/zeks-doner-preview/meni/","/zeks-doner-preview/en/meni/","/zeks-doner-preview/de/meni/","/zeks-doner-preview/lokacije/","/zeks-doner-preview/en/","/zeks-doner-preview/de/","/zeks-doner-preview/offline/","/zeks-doner-preview/_astro/Status.astro_astro_type_script_index_0_lang.i8YriFkq.js","/zeks-doner-preview/_astro/hours.DaEpVPjT.js","/zeks-doner-preview/_astro/MenuApp.BgHyjMsV.js","/zeks-doner-preview/_astro/preact.kHpDFzK9.js","/zeks-doner-preview/_astro/hooks.Bey-P8t1.js","/zeks-doner-preview/_astro/jsxRuntime.DeY9ejxW.js","/zeks-doner-preview/_astro/backend.C6rnjkex.js","/zeks-doner-preview/_astro/client.CRNbC9Fw.js","/zeks-doner-preview/_astro/preload-helper.BNsLboAP.js","/zeks-doner-preview/_astro/archivo-ext.BXuJfH00.woff2","/zeks-doner-preview/_astro/archivo-latin.DzZY5yL3.woff2","/zeks-doner-preview/manifest.webmanifest","/zeks-doner-preview/favicon.svg","/zeks-doner-preview/icons/icon-192.png","/zeks-doner-preview/img/maskota-240.webp"];
self.addEventListener('install', (e) => e.waitUntil(caches.open(V).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('zeks-') && k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
const sTimeoutom = (req, ms) => new Promise((ok, ne) => { const t = setTimeout(() => ne(new Error('timeout')), ms); fetch(req).then((r) => { clearTimeout(t); ok(r); }, (e) => { clearTimeout(t); ne(e); }); });
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;
  if (url.pathname.startsWith(BASE + 'osoblje/')) return; // panel osoblja uvijek uživo
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const c = await caches.open(V);
      try {
        const r = await sTimeoutom(req, 3500);
        if (r.ok) c.put(url.pathname, r.clone());
        return r;
      } catch {
        const o = { ignoreVary: true, ignoreSearch: true };
        return (await c.match(url.pathname, o)) || (await c.match(BASE + 'meni/', o)) || (await c.match(BASE + 'offline/', o)) || Response.error();
      }
    })());
    return;
  }
  if (/\/(_astro|img|icons|pdf)\//.test(url.pathname) || /\.(woff2|png|svg|webmanifest)$/.test(url.pathname)) {
    e.respondWith(caches.match(req, { ignoreVary: true }).then((hit) => hit || fetch(req).then((r) => { if (r.ok) caches.open(V).then((c) => c.put(req, r.clone())); return r; })));
  }
});
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data.json(); } catch { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Žeks Döner', { body: d.body || '', icon: BASE + 'icons/icon-192.png', badge: BASE + 'icons/icon-192.png', tag: d.tag, data: { url: d.url || BASE + 'meni/' } }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const cilj = (e.notification.data && e.notification.data.url) || BASE + 'meni/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    const w = cs.find((c) => c.url.includes(BASE)); return w ? w.focus() : self.clients.openWindow(cilj);
  }));
});

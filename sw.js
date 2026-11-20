/* Vitra House · Service Worker v12.5.0
   Permite que la aplicación abra sin internet.
   IMPORTANTE: al publicar una versión nueva, cambie CACHE_VERSION. */

const CACHE_VERSION = 'vitra-v12.8.0';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => Promise.all(ARCHIVOS.map(a => cache.add(a).catch(() => null))))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys()
      .then(claves => Promise.all(
        claves.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evento => {
  const req = evento.request;

  // Solo se gestionan peticiones GET del propio sitio.
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // El documento principal: primero red, luego caché (así se ven las actualizaciones).
  if (req.mode === 'navigate' || req.destination === 'document') {
    // Otras páginas (p. ej. firma.html, que abre el cliente) van directo a la red.
    if (!/\/(index\.html)?$/.test(new URL(req.url).pathname)) return;
    evento.respondWith(
      fetch(req)
        .then(res => {
          const copia = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put('./index.html', copia));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Recursos estáticos: primero caché.
  evento.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copia = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copia));
      }
      return res;
    }).catch(() => new Response('', { status: 504, statusText: 'Sin conexion' })))
  );
});

/* Al tocar un recordatorio de cita, abrir (o traer al frente) el programa */
self.addEventListener('notificationclick', evento => {
  evento.notification.close();
  const url = (evento.notification.data && evento.notification.data.url) || './';
  evento.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(lista => {
    for(const c of lista){ if('focus' in c) return c.focus(); }
    return self.clients.openWindow ? self.clients.openWindow(url) : null;
  }));
});

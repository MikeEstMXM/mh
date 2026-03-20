const CACHE_NAME = "personal-app-platform-v1";
const basePath = self.location.pathname.replace(/\/sw\.js$/, "");
const APP_SHELL = [
  `${basePath}/`,
  `${basePath}/apps/notes/`,
  `${basePath}/apps/timer/`,
  `${basePath}/apps/ideas/`,
];

// Foundation only:
// replace this starter cache with a versioned offline strategy once you know
// which routes and assets you actually want available offline.
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request);
    }),
  );
});

/*
 * Lux Christi service worker
 * Caches the public application shell only. Do not add private records,
 * authentication tokens, or future personalised API responses here.
 */
const CACHE_VERSION = "lux-christi-shell-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./about.html",
  "./community.html",
  "./learn.html",
  "./players.html",
  "./quiz.html",
  "./games.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./css/tokens.css",
  "./css/base.css",
  "./css/components.css",
  "./css/pages.css",
  "./css/pages/quiz.css",
  "./js/main.js",
  "./js/modules/siteController.js",
  "./js/modules/playerController.js",
  "./js/data/playerData.js",
  "./assets/images/lux-christi-mark.svg",
  "./assets/icons/lux-christi-192.png",
  "./assets/icons/lux-christi-512.png",
  "./assets/icons/lux-christi-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("lux-christi-shell-") && key !== CACHE_VERSION)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_VERSION);
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match("./offline.html"));
      }
    })());
    return;
  }

  // Static same-origin assets use cache-first with a network refresh fallback.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        const cache = await caches.open(CACHE_VERSION);
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      return Response.error();
    }
  })());
});

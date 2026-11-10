/*
 * Lux Christi service worker
 * Caches the public Catholic-platform application shell only. Never cache
 * authentication tokens, private records, or personalised API responses.
 */
const CACHE_VERSION = "lux-christi-shell-v12";
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
  "./js/modules/eventDetailsController.js",
  "./js/modules/eventsController.js",
  "./js/services/eventService.js",
  "./js/data/events.js",
  "./css/pages/events.css",
  "./event.html",
  "./events.html",
  "./manifest.webmanifest",
  "./css/tokens.css",
  "./css/base.css",
  "./css/components.css",
  "./css/pages.css",
  "./css/pages/quiz.css",
  "./js/main.js",
  "./js/modules/siteController.js",
  "./js/modules/playerController.js",
  "./js/modules/learningController.js",
  "./js/modules/curriculumBrowserController.js",
  "./js/data/learningResources.js",
  "./js/data/localLessons.js",
  "./js/data/curriculumCatalog.js",
  "./js/services/curriculumRepository.js",
  "./js/data/playerData.js",
  "./assets/images/players/top-winner-01.jpg",
  "./assets/images/players/top-winner-02.jpg",
  "./assets/images/players/top-winner-03.jpg",
  "./assets/images/lux-christi-mark.svg",
  "./assets/icons/lux-christi-192.png",
  "./assets/icons/lux-christi-512.png",
  "./assets/icons/lux-christi-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("lux-christi-shell-") && key !== CACHE_VERSION).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
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
    } catch { return Response.error(); }
  })());
});

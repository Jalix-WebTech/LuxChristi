/*
 * Lux Christi service worker
 * Caches the public Catholic-platform application shell only. Never cache
 * authentication tokens, private records, or personalised API responses.
 */
const CACHE_VERSION = "lux-christi-shell-v16";
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
  "./css/design-system.css",
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
  "./assets/icons/lux-christi-maskable-512.png",
  "./css/homepage.css",
  "./js/features/homepage/homepage.js",
  "./js/components/carousel.js",
  "./js/services/homepageService.js",
  "./js/services/playerService.js",
  "./js/data/homepageData.js",
  "./js/games/index.js",
  "./js/games/catalog.js",
  "./js/games/bible-challenge.js",
  "./js/games/catholic-riddles.js",
  "./js/games/identify-saint.js",
  "./js/games/catholic-symbols.js",
  "./js/games/scripture-challenge.js",
  "./js/games/match-saint-virtue.js",
  "./js/question-banks/index.js",
  "./js/question-banks/categories.js",
  "./js/question-banks/catalog.js",
  "./js/question-banks/bible-knowledge.js",
  "./js/question-banks/catholic-doctrine.js",
  "./js/question-banks/saints-and-virtues.js",
  "./js/question-banks/riddles.js",
  "./js/question-banks/legion-of-mary.js",
  "./js/question-banks/sacred-heart.js",
  "./js/question-banks/st-anthony.js",
  "./js/question-banks/other-devotions.js",
  "./js/quiz/achievements.js",
  "./assets/images/games/bible-challenge.svg",
  "./assets/images/games/catholic-riddles.svg",
  "./assets/images/games/identify-saint.svg",
  "./assets/images/games/catholic-symbols.svg",
  "./assets/images/games/scripture-challenge.svg",
  "./assets/images/games/match-saint-virtue.svg",
  "./assets/images/quizzes/catholic-quiz.svg",
  "./assets/images/learning/scripture-study.svg"
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

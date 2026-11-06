# Lux Christi PWA foundation

## Components

| File | Responsibility |
| --- | --- |
| `manifest.webmanifest` | Install metadata, display mode, launch path, colours and icons. |
| `service-worker.js` | Application-shell pre-cache, static asset caching, navigation fallback and old-cache cleanup. |
| `offline.html` | Friendly offline recovery page. |
| `js/modules/pwaController.js` | Service-worker registration, update notice and supported install prompt. |
| `assets/icons/` | 192px, 512px and maskable app icons. |

## Cache strategy

- Navigation: network-first; if the network fails, use a cached page and then the offline fallback.
- Same-origin static GET requests: cache-first, with successful network responses added to the current cache.
- Cross-origin requests and non-GET requests: left to the browser/network.
- Activation: remove older caches whose names begin with `lux-christi-shell-`.

## Important constraints

This is a static frontend PWA foundation, not a full offline data-sync system. A page's imported JavaScript modules and data are cached as the browser requests them. The first visit to a route or resource still requires connectivity unless it is in the application-shell pre-cache. Do not cache authenticated API responses or sensitive personal data by default.

## Manual acceptance test

1. Serve over localhost or HTTPS.
2. Confirm the service worker activates and the manifest is valid.
3. Visit Home, Learn, Quiz & Games, Community, About and Top Winners while online.
4. Set the browser offline and revisit pages already opened.
5. Open an unvisited route offline and confirm the offline page appears if no cached route exists.
6. Publish a changed service worker and confirm the update notice appears after the new worker installs.
7. Test install behavior on Android/desktop Chromium and separately verify the iOS Add to Home Screen path.

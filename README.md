# Lux Christi — Unified Quiz & Games Platform

A responsive Catholic learning and games website built with HTML5, CSS3 and Vanilla JavaScript (ES modules).

## Pages

- `index.html` — Home
- `quiz.html` — Guided Quiz and Catholic Games experience
- `learn.html` — Learn
- `players.html` — Top Winners
- `community.html` — Community
- `about.html` — About
- `games.html` — compatibility redirect to the unified Quiz & Games page

## Run locally

Use Node.js 20+ and Python 3 (or another static HTTP server). From this folder:

```bash
npm run serve
```

Open `http://localhost:8000`. ES modules should be served over HTTP rather than opened directly with `file://`.

## Quiz & Games experience

Players select Quiz or Games, choose a category or a specific game, enter their name, and complete a five-second preparation countdown. Both activity types use an independent seven-second timer for every question or round. Correct answers earn 100 base points plus a speed bonus of up to 50 points. Incorrect and unanswered questions earn zero points.

Question-bank and stored question counts are intentionally hidden from the category and game selection interface. The quiz currently draws up to ten shuffled questions per attempt; this internal configuration is not displayed as a category count.

## Question banks and games

There are nine independent quiz category modules in `js/question-banks/` and six separate game modules in `js/games/`. Add content to the relevant module without duplicating the activity controller.

## Picture quiz assets

Picture questions use local asset paths with real Wikimedia Commons image URLs as fallback. Binary image downloads could not be completed in the build environment. On a network-enabled machine, run:

```bash
npm run download:picture-assets
```

Review `assets/images/quiz/picture-quiz/sources.json` and the source pages' current licensing and attribution terms before deployment.

## Verify project data

```bash
npm test
npm run check
```

The tests validate question banks, game rounds, player-name validation and speed-based scoring. The project validator checks the guided flow and confirms question-bank counts are not exposed in selection markup.

## Security and production notes

- Copy restrictions and focus-loss monitoring are frontend deterrents, not complete anti-cheating security.
- Static JavaScript question banks and answer keys are inspectable.
- Browser-generated scores and result images are practice records, not verified competition results.
- Official competitions need authentication, server-delivered questions, server-side answer validation, server-controlled deadlines and authoritative scoring.
- Feedback and community integrations remain demo configuration and need production endpoints/URLs.

See `docs/QUIZ-ARCHITECTURE.md` and `docs/QUIZ_SECURITY_AND_TESTING.md` for implementation details and manual QA steps.


### Result cards

Quiz and game results include configurable achievement tiers, star ratings, personalized encouragement, a live canvas preview, optional profile photo cropping, Diocese/Deanery/Parish fields, and flattened high-quality JPG downloads. Achievement configuration is in `js/quiz/achievements.js`. Local result images are for sharing and are not server-verified competition certificates.

## Community photograph
- The supplied project had no suitable local group photograph in its assets folder. The Community page therefore references a free-to-use Unsplash community photograph and links to its source/photographer. The image is lazy-loaded and sized responsively. For fully offline/self-hosted delivery, download the credited photo into `assets/images/` and update the image path.

## Top Winners leaderboard
- `js/data/playerData.js` provides the current demo winner records. Replace these with verified records from the future backend.
- `js/modules/playerController.js` de-duplicates records, sorts by numeric score, limits the public list to 20, and progressively renders six winners at a time on `players.html`.
- The homepage and Quiz & Games page retain compact three-winner previews. The full leaderboard shows medals for the first three positions and numerical ranks thereafter.
- The current supplied dataset contains three demo records; the progressive leaderboard supports up to 20 records when verified data is supplied.

## Recent website refinements

- The full Top Winners page now displays up to 15 available records initially, then loads up to five more per request, with a hard cap of 20. The interface never invents winner records; the current demo dataset contains three verified-in-project sample records until a larger data source is connected.
- The homepage includes an upcoming-competition announcement linking to the Community page.
- Community photography uses a landscape 16:9 presentation.
- Prominent feature, learning-resource, and navigation calls to action use shared accessible button styles that respond to the saved light/dark theme tokens.

## Progressive Web App (PWA)

Lux Christi now includes an initial installable-PWA foundation:

- `manifest.webmanifest` provides the app name, launch URL, display mode, theme colours and install icons.
- `service-worker.js` pre-caches the public application shell, uses network-first navigation with an offline fallback, and cache-first handling for same-origin static assets.
- `offline.html` gives visitors a simple recovery path when a page cannot be reached.
- `js/modules/pwaController.js` registers the service worker, offers installation when the browser supports it, and prompts for a refresh when a new version is installed.
- `assets/icons/` contains the app icons used by the manifest and Apple touch icon metadata.

### Running and testing the PWA

1. Run `npm run serve` from the project directory, or use another local static server.
2. Open the site through `http://localhost:8000` (service workers are allowed on localhost) or deploy it over HTTPS.
3. Visit the main pages while online so their modules and static assets can be cached.
4. In browser developer tools, open **Application → Service Workers** and confirm the worker is active.
5. In **Application → Manifest**, check the app metadata and icons.
6. Switch the browser to offline mode and reload a page already visited. Navigation should use its cached response or `offline.html`.
7. Test installation on a supported browser/device. Install prompts are browser-controlled and are not guaranteed to appear on every platform.

### PWA limitations and safety

- HTTPS is required in production; localhost is permitted for development.
- iPhone/iPad installation is generally performed through Safari's Share → Add to Home Screen flow; the browser may not emit the install-prompt event used by Chromium browsers.
- This first pass caches the public application shell and same-origin static GET resources. It does not promise that every quiz image or every dynamically loaded resource is available offline until it has been visited and cached.
- No account data, authentication credentials, private records, or API responses are intentionally pre-cached. Revisit this policy before adding authenticated backend services.
- Offline scores and local result cards remain device-local practice data, not official competition records.

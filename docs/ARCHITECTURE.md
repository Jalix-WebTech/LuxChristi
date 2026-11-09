# Lux Christi architecture

## Active product scope
Lux Christi is currently a Catholic Faith Formation, Learning, Competition, Gaming, Social Community and Live Experiences platform. General Education is excluded until the product owner explicitly reopens it. The active app contains no General Education route, catalogue, lesson, assessment or PWA cache entry.

## Frontend and PWA
- HTML pages are independent documents with a consistent shared header and footer.
- `css/tokens.css` contains design tokens and light/dark theme variables.
- `css/base.css`, `css/components.css` and `css/pages.css` provide shared presentation rules.
- `css/pages/quiz.css` contains the guided Quiz & Games interface and responsive styles.
- `js/modules/siteController.js` handles shared navigation, active-page state, mobile menu and theme preference.
- `js/modules/pwaController.js` registers and manages the service worker and install/update prompts.
- `service-worker.js` caches the public Catholic-platform application shell only. Do not add credentials, private profiles, messages or personalised API responses to the public cache.

## Catholic Learning Centre
- `js/data/learningResources.js` contains curated external Catholic learning references.
- `js/data/localLessons.js` contains three locally hosted starter lessons.
- `js/data/curriculumCatalog.js` contains only published Catholic learning areas/topics with real lesson links.
- `js/services/curriculumRepository.js` is a read-only data boundary intended to be replaceable by an API-backed implementation.
- `js/modules/curriculumBrowserController.js` renders learning-area → topic navigation.
- `js/modules/learningController.js` renders resources, local lessons, bookmarks and local progress.

## Quiz and Games platform
- `js/quiz/quiz-controller.js` coordinates activity selection, category/game selection, display-name registration, preparation countdown, question rendering, per-question timing, response locking, integrity monitoring and results.
- `js/quiz/quiz-engine.js` is DOM-independent and manages question aggregation, shuffling and answer validation.
- `js/quiz/scoring.js` contains configurable time and speed-based scoring rules shared by Quiz and Games.
- `js/quiz/quiz-validation.js` validates player registration data.
- `js/quiz/quiz-results.js` coordinates local result-card download.
- `js/question-banks/index.js` registers independent Catholic quiz categories.
- `js/games/index.js` registers six Catholic educational games.
- `js/services/resultService.js` creates the client-side result image.

## Current trust boundaries
The browser app is a practice/demo implementation. Frontend question banks and scores can be inspected or modified. Copy restrictions and focus-loss tracking are deterrents, not secure proctoring. Official competition attempts require authenticated sessions, server-delivered questions, server-controlled deadlines, server-side scoring, rate limits and audit logs. Never treat a locally generated result image as proof of an official score.

## Backend evolution
Start with a modular monolith and provider-neutral service/repository boundaries. The current recommendation is documented in `TECHNOLOGY_EVALUATION.md`: Supabase for relational identity/data/realtime, Cloudflare for static PWA delivery, and LiveKit for a limited live-media pilot. No backend provider has been connected yet. Database access policies, server-side validation and secret management must be designed before accounts or official competitions go live.

## Shared mobile navigation
`js/modules/siteController.js` owns responsive navigation state. The menu toggle updates its accessible label, `aria-expanded` value and visible icon together. On mobile, a closed navigation list is marked `inert` so its links cannot receive keyboard focus. The menu closes when a visitor selects a link, clicks outside the menu, presses Escape, scrolls the page or changes to the desktop breakpoint. Escape returns focus to the toggle.

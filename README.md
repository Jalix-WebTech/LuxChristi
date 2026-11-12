# Lux Christi — Catholic Faith Formation & Engagement Platform

A responsive Catholic digital platform built with HTML5, CSS3 and Vanilla JavaScript (ES modules). The active product scope is Catholic faith formation, learning, quizzes, games, competition, community and future live experiences. General Education is explicitly out of scope and has been removed from the active application.

## Current pages

- `index.html` — Home
- `quiz.html` — Guided Catholic Quiz and Games experience
- `learn.html` — Catholic Learning Centre with searchable resources, local lessons, category filters and bookmarks
- `players.html` — Top Winners (currently demo/local data)
- `community.html` — Community information and engagement entry point
- `about.html` — About Lux Christi
- `games.html` — compatibility redirect to the unified Quiz & Games page

## Run locally

Use Node.js 20+ and Python 3 (or another static HTTP server). From this folder:

```bash
npm run serve
```

Open `http://localhost:8000`. ES modules should be served over HTTP rather than opened directly through `file://`.

## Current Catholic learning content

The Learning Centre currently includes 13 curated external Catholic resources and three locally hosted starter lessons covering Sacred Scripture and prayer. The local lessons include objectives, explanations, key points, reflection prompts, knowledge checks, references, downloadable text notes and local completion tracking. Bookmarks and progress are stored in the browser and are not yet synchronised across devices.

The active learning catalogue exposes only areas/topics that have actual linked starter lessons. Planned Catholic formation domains are documented in `docs/CATHOLIC_FAITH_FORMATION_ROADMAP.md`; they are not presented as published app sections until reviewed content exists.

## Quiz and games

Players select Quiz or Games, choose a Catholic category or game, enter a display name and complete a preparation countdown. Each question/round has a seven-second timer. Correct answers earn 100 base points plus a speed bonus; incorrect and unanswered questions earn zero.

There are eight independent quiz category modules in `js/question-banks/` and six game modules in `js/games/`. Question-bank counts are not exposed in the selection interface.

### Competition security limitations

- Copy restrictions and focus-loss monitoring are frontend deterrents, not complete anti-cheating controls.
- Static JavaScript question banks and answer keys can be inspected by users.
- Browser-generated scores and result images are local practice records, not verified competition results.
- Official competitions require authenticated participants, server-delivered questions, server-side answer validation, server-controlled deadlines, authoritative scoring, rate limiting and audit logs.

See `docs/QUIZ-ARCHITECTURE.md` and `docs/QUIZ_SECURITY_AND_TESTING.md`.

## Progressive Web App

The PWA includes a web manifest, install icons, service worker, public application-shell cache, network-first navigation, offline fallback and cache-first same-origin static resources. Cache version `lux-christi-shell-v10` reflects the Catholic-only scope realignment.

The service worker intentionally does not cache authentication credentials, private records or personalised API responses. When backend accounts are introduced, private data caching and offline write synchronisation must be designed separately.

## Verification

```bash
npm test
npm run check
```

Tests cover quiz logic, learning resources, local lessons, and Catholic learning-area relationships. The validator checks application pages, PWA shell references and the exclusion of General Education artifacts.

## Known limitations

- Authentication, persistent online profiles, messaging, multiplayer networking, live audio/video and server-authoritative competitions are not implemented yet.
- Top Winners data remains local/demo data.
- Community and feedback integrations require production endpoints/configuration.
- This project is a functional frontend MVP, not yet a production multi-user platform.

## Development direction

The next architectural milestone is backend foundation and authentication planning. Before implementation, define the data model, trust boundaries, row-level permissions, environment configuration, migrations, API/service interfaces and account lifecycle. See `docs/CATHOLIC_FAITH_FORMATION_ROADMAP.md` for the agreed product scope and phased delivery plan. See `docs/TECHNOLOGY_EVALUATION.md` for the current backend, hosting and live-media recommendation; no provider has been connected yet.


## Events & Competitions

- `events.html` is the public events hub.
- `event.html?id=<event-id>` is the reusable competition details page.
- Event data and supported statuses are documented in `docs/EVENTS_AND_COMPETITIONS.md`.
- The public event catalogue starts empty until official event information is approved. Registration collection and private participant access require a future secure backend.


## Official contact channels

- Contact email: jamefelix1262002@gmail.com
- Feedback form delivery: WhatsApp (+234 815 514 1240)
- WhatsApp community: https://chat.whatsapp.com/GhzQVa36nuB346vXO4Ei5A


## Visual design system

The current visual identity uses a charcoal-and-champagne-gold dark theme by default, with a complementary warm-cream light theme. Shared design tokens live in `css/tokens.css`; the visual refinement layer is `css/design-system.css`. The existing theme toggle and saved preference remain in use.

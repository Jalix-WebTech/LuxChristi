# Lux Christi Homepage Architecture — Frontend MVP

## Scope

This implementation extends the existing HTML, CSS and Vanilla JavaScript application. It does not add authentication, a backend, a database, a social feed, event registration processing or live analytics.

## Homepage composition

The original homepage identity is retained at the top: shared header, Daily Inspiration, Events & Competitions announcement and four platform highlights. New discovery and learning sections follow that opening composition.

The homepage now includes:

- Welcome introduction and quick navigation.
- Stories-style discovery rail.
- Latest results (honest empty state until verified results exist).
- Existing games and quiz categories.
- Daily Scripture challenge entry point.
- Upcoming events (empty until official events are published).
- Existing Top Winners preview, explicitly labelled demonstration data.
- Community activity, featured saint, announcements and video empty states.
- Learning resource discovery using the existing curated catalogue.
- Scripture reflection and the existing achievement tiers.

## Data and service boundary

`js/data/homepageData.js` composes existing project catalogues. It derives game cards from the lightweight `js/games/catalog.js` metadata and quiz categories/counts from `js/question-banks/categories.js` plus `js/question-banks/catalog.js`. The homepage therefore does not import every game round or question payload just to display discovery cards. The activity experience continues to load the full game and question modules through their existing registries. Learning resources and events come from their existing data modules.

`js/services/homepageService.js` is the homepage data-access boundary. The homepage feature requests collections through methods such as `getGames()`, `getTrendingQuizzes()`, `getLatestResults()`, `getUpcomingEvents()`, `getCommunityActivities()`, `getLearningResources()`, `getAnnouncements()`, `getFeaturedVideos()` and `getFeaturedSaint()`.

`js/services/playerService.js` provides the winner data adapter used by the existing player controller. Its current source remains `js/data/playerData.js`; the records are demonstration profiles, not official standings. The player controller now awaits this adapter, leaving its ranking and rendering logic intact.

A future API implementation should replace the service data source while preserving the page renderers and their record contracts. No API or backend is implemented in this phase.

## Reusable carousel

`js/components/carousel.js` supplies the shared horizontal rail behaviour. It uses native horizontal scrolling and CSS scroll snapping, with previous/next buttons, disabled-state updates, keyboard-focusable scroll regions and touch scrolling supplied by the browser. It respects `prefers-reduced-motion`.

The visual card types are rendered by the homepage feature. The carousel utility owns only the scrolling controls and does not know about games, quizzes or events.

## Homepage feature

`js/features/homepage/homepage.js` owns homepage-only rendering, filter interactions and empty states. It is loaded dynamically from `js/main.js` only when `[data-homepage]` exists. This keeps the homepage-specific code out of the initial controller path for other pages.

## Assets

Homepage illustrations are local SVG assets:

- `assets/images/games/`
- `assets/images/quizzes/`
- `assets/images/learning/`

They are lightweight, decorative illustrations with empty alt text because the adjacent card headings provide the accessible names. Existing brand, medal and player assets remain in their original locations.

## Data authenticity

The event catalogue and published result/activity/announcement/video collections remain empty until approved records are supplied. The Saint of the Week feature remains an empty state until a reviewed profile and suitable image are available. No live counts, popularity rankings or current competition status are fabricated.

The existing three winner profiles are still demo data. The homepage and Top Winners page now disclose that status.

## Future extension points

- Replace local collection methods in homepage/player services with API requests.
- Add authenticated user context to the welcome area only after real authentication exists.
- Add real results, events, community activities, announcements and saint records through validated data sources.
- Add popularity sorting only when participation metrics are collected and verified.
- Persist bookmarks, learning progress and daily challenge streaks only after a deliberate storage/backend design.

# Lux Christi frontend architecture

## Shared website
- HTML files are independent page documents with a consistent shared header and footer.
- `css/tokens.css` contains design tokens and light/dark theme variables.
- `css/base.css`, `css/components.css` and `css/pages.css` provide shared presentation rules.
- `css/pages/quiz.css` contains the guided Quiz & Games interface and responsive styles.
- `js/modules/siteController.js` handles shared navigation, active-page state, mobile menu and theme preference.
- `js/modules/playerController.js` renders the Top Winners leaderboard in homepage, winner and quiz-page locations.
- `js/main.js` loads shared behaviour everywhere and lazily imports the activity controller only on `quiz.html`.

## Community media
- The Community page uses an externally hosted Unsplash group photograph because the supplied project contained no suitable local group-photo asset. The page includes descriptive alternative text and source attribution.

## Top Winners leaderboard
- `js/data/playerData.js` is the current demo data source; production data should come from a verified API.
- `js/modules/playerController.js` removes duplicate records, ranks by numeric score, caps the list at 20 and progressively reveals six entries at a time on the dedicated winners page.
- The homepage and Quiz & Games page show compact three-winner previews.

## Quiz and Games platform
- `js/quiz/quiz-controller.js` coordinates activity selection, category/game selection, name registration, preparation countdown, question rendering, per-question timing, response locking, integrity monitoring and results.
- `js/quiz/quiz-engine.js` is DOM-independent and manages quiz question aggregation, shuffling and answer validation.
- `js/quiz/scoring.js` contains configurable time and speed-based scoring rules shared by Quiz and Games.
- `js/quiz/quiz-validation.js` validates player registration data.
- `js/quiz/quiz-results.js` coordinates local result-card download.
- `js/question-banks/index.js` is the quiz registry; each category's content remains in its own module.
- `js/games/index.js` registers six independent games; each game has a separate data module in `js/games/`.
- `js/services/resultService.js` creates the client-side result image.

## Gameplay rules
Both Quiz and Games use a five-second preparation countdown followed by an independent seven-second timer for each question or round. Correct responses receive 100 base points plus a proportional speed bonus of up to 50 points. Incorrect and unanswered responses receive zero. Questions lock after submission or timeout and automatically advance after a brief feedback pause.

## Content contract
Every quiz question has an ID, category, type, question text, four answer options, a correct answer and an explanation. Picture questions also have an image path, alternative text and source attribution. Game rounds use a similar question/answers/correctAnswer/explanation structure.

## Security and backend evolution
The browser app is a practice/demo implementation. Frontend question banks and scores can be inspected or modified by users. Copy restrictions and focus-loss tracking are deterrents, not a secure proctoring system. Official competition attempts should be delivered and scored by a backend with authenticated sessions, server-side deadlines, question versioning, answer timestamps, server-side scoring, rate limits and audit logs. Never treat a locally generated result image as proof of an official score.

## Shared mobile navigation

`js/modules/siteController.js` owns the responsive navigation state on every page. The menu toggle updates its accessible label, `aria-expanded` value and visible icon together. On mobile, a closed navigation list is marked `inert` so its links cannot receive keyboard focus. The menu closes when a visitor selects a link, clicks outside the menu, presses Escape, scrolls the page or changes to the desktop breakpoint. Escape returns focus to the toggle. The dropdown does not lock page scrolling because it does not act as a full-screen drawer.

## Community demonstration image

The Community page currently uses `assets/images/lux-christi-mark.svg` inside a landscape `16:9` presentation stage. The logo is contained without distortion. To replace this temporary visual with a real group photograph later, update the `src` and alternative text on `.community-photo` in `community.html`; the surrounding responsive stage can remain unchanged.

## Top Winners progressive display

`js/modules/playerController.js` ranks valid records by numeric score, removes duplicate identities, caps the displayed data set at 20, and renders up to 15 records initially on `players.html`. The View More Winners control reveals the remaining records in batches of five. The current local demonstration data contains three records; no placeholder winners are fabricated to reach the initial target.

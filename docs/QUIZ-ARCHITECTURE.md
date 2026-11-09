# Lux Christi Quiz & Games Architecture

## Guided user journey

`quiz.html` is the single entry point for Quiz and Games. The page uses a guided three-step flow:

1. Select Knowledge Quiz or Catholic Games.
2. Select a quiz category or one of the six games.
3. Enter a player name and start the activity.

A five-second preparation countdown runs before gameplay. The name and selection are retained throughout the attempt. Back navigation is available during setup; question navigation is locked during an active attempt. Registration cancellation, countdown cancellation, active-session exit, in-page navigation and browser Back are protected by a confirmation step. Browser refresh and tab/window closing use the browser-supported native `beforeunload` prompt.

## Shared activity controller

- `js/quiz/quiz-controller.js` manages the shared setup flow, countdown, question rendering, timers, response locking, integrity events, scoring and result summary for both activity types.
- `js/quiz/scoring.js` contains configurable seven-second timing and speed-aware scoring rules.
- `js/quiz/quiz-engine.js` aggregates and shuffles quiz questions and validates answers without depending on the DOM.
- `js/quiz/quiz-validation.js` validates player names.
- `js/quiz/achievements.js` contains configurable score tiers, star ratings, themes and encouragement messages.
- `js/quiz/quiz-results.js` coordinates live preview and flattened JPG download.
- `js/components/confirmationDialog.js` provides a reusable accessible confirmation dialog for registration cancellation and activity exits.
- `js/services/resultService.js` renders the same 1200 × 1500 canvas for preview and high-quality JPEG export, including optional player photo and labelled community details.

## Question banks and games

- `js/question-banks/index.js` is the quiz category registry.
- `js/question-banks/*.js` contains the independent quiz question banks.
- `js/games/index.js` registers six independent mini-games.
- `js/games/*.js` contains each game's round data.

Quiz and game data remain independent. Both use the shared activity controller for the seven-second question timer, response locking, speed-aware scoring and result presentation.

## Timer and scoring

Every question has a seven-second deadline measured against `performance.now()` rather than relying on a decrement-only counter. This reduces timer drift. A question locks after a response or timeout, then the next question is displayed automatically after a short feedback pause.

- Base correctness points: 100.
- Maximum speed bonus: 50.
- Question score: base points plus a proportional bonus based on remaining time.
- Incorrect and unanswered questions: zero points.

The constants and formula are in `js/quiz/scoring.js` so difficulty and scoring can be balanced without changing the user interface.

## Interface requirements

Question-bank totals and stored question counts are intentionally not displayed in the category or game selection interface. During play, the interface shows the current question number, not the stored bank size or total number of available questions.

## Future backend boundary

This is a browser-based practice implementation. Static JavaScript banks contain correct answers and can be inspected. Client-side timers, focus tracking, disabled copy shortcuts and local scores can be bypassed or modified. Official competitions should use authenticated attempts, server-delivered questions, server-side answer validation, server-controlled deadlines, authoritative scoring, rate limiting and audit logs.


## Achievement result cards

Achievement tiers live in `js/quiz/achievements.js`; thresholds, stars, badge themes, messages and celebration intensity can be changed without editing the result renderer. After completion, players can upload a JPG/PNG/WebP image (8 MB limit), zoom and drag its circular crop, and enter Diocese, Deanery and Parish. These community fields are optional; the renderer adds bold labels only for non-empty values and wraps long entries. The live preview and downloaded JPG use the same canvas renderer. The export is flattened and named `LuxChristi-Player-Activity-Result.jpg`.

The card is a locally generated practice record, not cryptographic proof. A production competition must obtain the score, achievement and verification status from a trusted backend.

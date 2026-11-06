# MVP Stabilization Log

## 6 November 2026

This pass prepares the current frontend MVP for the next development phase without changing its product features or visual design.

### Changes made

- Removed the duplicate HTML doctype from `learn.html` and `about.html`. Each page now starts with one standards-mode doctype.
- Removed `js/services/quizService.js`. It was not imported anywhere in the project and referenced the missing `js/data/quizData.js` module. The active quiz engine remains `js/quiz/quiz-engine.js`, which reads from the current question-bank registry.
- Extended `scripts/validate-project.mjs` to detect missing or duplicate doctypes across the six primary pages.

### Outstanding items

- Ten picture-quiz JPEG assets are referenced but not bundled. The existing downloader was attempted during this pass, but the environment could not resolve `commons.wikimedia.org` (`EAI_AGAIN`). The quiz currently relies on its configured remote-image fallback when online. Retry `npm run download:picture-assets` from a network-enabled development environment and verify each source/licence before redistribution.
- The WhatsApp community invitation and feedback email remain placeholders. Replace them only after the official contact details are supplied.
- Browser-level testing and accessibility review are still outstanding; Node tests and static validation do not replace testing in real browsers and devices.

### Validation

- `npm test` — passed.
- `npm run check` — passed; the ten missing picture files remain warnings.
- JavaScript syntax checks — run across project `.js` and `.mjs` files in this stabilization pass.

### Next recommended phase

Build the PWA foundation using the existing Vanilla JavaScript architecture: web app manifest, app icons, service worker, offline fallback, versioned static-asset caching, install support, and a safe update lifecycle. Do not cache private user data or future authenticated API responses.

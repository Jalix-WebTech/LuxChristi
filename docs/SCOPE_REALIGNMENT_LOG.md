# Scope Realignment Log — Catholic-First Product Direction

## Decision
The active product scope is now exclusively Catholic Faith Formation, Learning, Competition, Gaming, Social Community and Live Experiences. General Education is excluded until the owner explicitly reopens it.

## Changes in this release
- Removed General Education division and all education-level/primary-class/subject navigation.
- Removed the Primary 4 Mathematics pilot page, lesson data, controller, stylesheet and test.
- Removed the General Education curriculum metadata and related implementation documents.
- Rebuilt the Learning Centre browser around published Catholic learning areas → topics → lessons.
- Preserved the three existing Catholic starter lessons, 13 curated Catholic external resources, quiz banks, six games, results, winners page, community page and PWA foundation.
- Updated service worker cache to `lux-christi-shell-v7` and removed academic pilot assets from the application shell.
- Added a Catholic Faith Formation roadmap and a separate technology evaluation document.

## Validation
- `npm test` passes.
- `npm run check` passes.
- Active application files contain no General Education or Primary 4 implementation references.
- The validator confirms removed academic pilot files are absent and not precached.

## Not implemented by this scope cleanup
Authentication, cloud profiles, database integration, online messaging, multiplayer networking, server-authoritative competitions, live audio/video and broadcasting remain future work. The technology evaluation is a recommendation only; no provider credentials or backend services have been configured.

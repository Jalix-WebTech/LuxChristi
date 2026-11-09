# Lux Christi Catholic Learning Centre

## Current implementation

- Curated catalogue of public Catholic learning links across Scripture, Church teaching, Saints & virtues, Prayer & liturgy, and Study & formation.
- Search across resource titles, descriptions, providers, resource types and tags.
- Category filtering through a select control and category chips.
- Local bookmarks stored in the current browser.
- Three locally hosted starter lessons with completion tracking.
- Catholic learning-area → topic → lesson navigation, limited to areas/topics with actual linked lesson content.
- Separate data, repository and controller modules; no framework or third-party library added.

## Offline expectations

The Learning Centre interface, bundled catalogue metadata and three local lessons are available offline after the current service worker installs. External publisher websites are not mirrored by Lux Christi and may require internet access. Bookmarks and lesson progress are stored locally and are not synced between devices.

## Scope and content quality

The three starter lessons are introductory Catholic learning summaries, not a replacement for Scripture, the Catechism, liturgical books, formal instruction or local diocesan guidance. References are supplied for further study. Future Catholic content should have source metadata, editorial/theological review and a publication state. Planned domains should not appear as empty app sections before real reviewed content is ready.

## Verification

Run `npm test` and `npm run check`. Open `learn.html`, search and filter resources, save a resource, open each local lesson, complete its knowledge check, download its notes and mark it complete. Reload and confirm progress remains. Then test offline after the service worker update installs.

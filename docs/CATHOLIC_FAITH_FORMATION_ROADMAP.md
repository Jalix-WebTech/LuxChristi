# Lux Christi — Catholic Product Scope & Development Roadmap

## Product decision

The active product is a Catholic Faith Formation, Learning, Competition, Gaming, Social Community and Live Experiences platform. General Education is excluded until the product owner explicitly reopens that scope. It must not appear as an active navigation item, route, data catalogue, placeholder, lesson or assessment.

## Mission

Help Catholics worldwide deepen their faith, learn, compete in healthy ways, play educational games, communicate and participate in live faith-centred experiences. The platform should be welcoming across countries, dioceses, parishes, languages and age groups, with safeguarding and moderation designed into social features.

## Current implemented foundation

- Responsive Vanilla JavaScript website and installable PWA.
- Catholic quiz categories and six Catholic educational game modules.
- Local practice flow, timers, scoring and shareable result cards.
- Catholic Learning Centre with curated external resources and three local lessons.
- Sacred Scripture and Prayer & Spiritual Life learning taxonomy.
- Community information page and demo Top Winners display.
- Device-local bookmarks and learning progress.

These features are not yet authenticated, synchronised or authoritative across devices.

## Catholic content domains to develop

The future learning catalogue may grow into the following domains, with content published only after source verification and appropriate theological/editorial review:

1. Sacred Scripture.
2. Catechism of the Catholic Church.
3. Catholic doctrine and teachings.
4. Sacraments.
5. Church history.
6. Saints and Christian virtues.
7. Liturgical year, liturgy and sacramentals.
8. Catholic prayers and devotions.
9. Papal teachings, councils and Church documents.
10. Catholic moral and social teaching.

These are roadmap domains, not promises that content currently exists in the app.

## Delivery phases

### Phase 0 — Scope realignment and baseline
- Remove General Education routes, curriculum catalogues, lessons, tests and PWA cache entries.
- Preserve existing Catholic quiz, game, learning, community and PWA functionality.
- Establish Catholic-only acceptance checks.

### Phase 1 — Backend and identity foundation
- Select managed backend and deployment approach after cost/security review.
- Create database migrations and a documented relational model.
- Implement registration, email verification, login, logout, password recovery and session lifecycle.
- Create profile records separate from authentication identities.
- Add least-privilege access policies, input validation, rate limits and audit events.
- Keep privileged keys and service-role credentials server-side only.

### Phase 2 — Catholic learning and authoritative competition
- Move content into versioned, structured Catholic learning records.
- Add content editor/reviewer/publisher roles and approval states.
- Move competition question delivery, deadlines and scoring to trusted server-side logic.
- Add persistent results, history, rankings and achievements.

### Phase 3 — Social and multiplayer
- Friends and connection requests.
- One-to-one and group messaging.
- Private/group challenge rooms and real-time match state.
- Presence, reporting, blocking, moderation and privacy controls.

### Phase 4 — Live audio/video and broadcasting
- Begin with a small controlled pilot using a managed WebRTC SFU.
- Implement host/participant/viewer roles, room tokens, moderation controls, audience interaction and poor-network adaptation.
- Add recording/replay only after storage, consent, retention and moderation policies are approved.

### Phase 5 — Engagement and global readiness
- Notifications, tournaments, multilingual content, accessibility improvements, observability, backup/restore drills and load testing.

## Engineering guardrails

- Keep the current frontend stack (HTML, CSS, Vanilla JavaScript) until a clear technical requirement justifies a change.
- Use modular service/repository boundaries so frontend components do not depend directly on vendor-specific database details.
- Treat browser code and local storage as untrusted.
- Enforce authorisation in the backend/database, not only by hiding UI controls.
- Never store passwords directly or expose service-role secrets in frontend code.
- Do not store sensitive account data in the PWA public cache.
- Design age-appropriate safeguards and reporting/moderation before enabling open messaging or public live rooms.
- Avoid microservices at MVP stage; start with a modular monolith/serverless backend and split only when operational evidence justifies it.

## Proposed initial technology direction — subject to approval

- Managed PostgreSQL + Auth + Realtime + object storage: Supabase is the leading candidate because the project needs relational affiliations, competition data, access control and real-time presence/events.
- Static PWA hosting/CDN: Cloudflare Pages or Workers Static Assets.
- Live audio/video: LiveKit Cloud for a limited pilot; evaluate self-hosting only when usage and operational capacity justify it.
- Keep a provider-neutral application layer around auth, profiles, learning content, competitions, chat and media-room token issuance.

Free-tier limits, inactivity pausing, storage, egress, concurrent connections, participant minutes, data residency, moderation, backups and support must be checked again before production launch.

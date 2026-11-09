# Lux Christi — Initial Technology Evaluation (November 2026)

## Decision status

This is a recommendation for owner review, not an implemented integration or an irreversible vendor commitment. Confirm current plan limits and terms before launch because free tiers can change.

## Recommended MVP combination

| Responsibility | Recommended candidate | Why it fits | Main caveat |
|---|---|---|---|
| Frontend hosting/CDN | Cloudflare Pages (or Workers Static Assets) | Serves the existing static HTML/CSS/Vanilla JS PWA globally; Git-based deployment and preview deployments. | Static hosting is not a replacement for the application database or trusted business logic. Pages Functions share Workers quotas. |
| Auth, relational database, realtime events, object storage | Supabase | Managed PostgreSQL suits relationships between profiles, affiliations, competitions, participants, matches, results, friendships and messages. Auth, Storage and Realtime sit alongside Postgres. | Free projects may pause after a week of low activity; free storage, database size, egress and realtime limits are finite. |
| Live audio/video | LiveKit Cloud (limited pilot) | Purpose-built WebRTC SFU; supports audio/video rooms, audience subscription, adaptive streams and global media routing. | Free Build allowance is for pilots, not a promise of unlimited broadcasting; monitor participant minutes, concurrency, bandwidth and recording/transcoding. |
| Future media archive | Begin with Supabase Storage; reassess Cloudflare R2 or another object store when egress/storage economics justify it. | Avoid adding another vendor before real usage demonstrates a need. | Recording requires consent, retention policy, access controls and moderation before implementation. |

## Backend comparison

### Supabase — leading recommendation

Strengths:
- PostgreSQL relational model and SQL migrations.
- Auth, Storage, Realtime and Edge Functions in one platform.
- Row Level Security (RLS) can enforce per-user, group, role and resource access at the database layer.
- Provider-neutral SQL schema and ordinary PostgreSQL access reduce data lock-in compared with a purely proprietary document model.

Free-plan facts checked 7 November 2026: two active free projects; 500 MB database per project; 1 GB file storage; 5 GB egress; 50,000 monthly active users; 2 million Realtime messages and 200 peak Realtime connections. Free projects with too little database activity can pause after seven days. Confirm the billing dashboard and current terms before production use.

Risks and controls:
- Enable RLS on every exposed table and explicitly review grants; a policy alone does not remove broad table privileges.
- Never expose the `service_role` key in browser code. Keep privileged operations in Edge Functions or another trusted server.
- Use database constraints and transactions for competition state and result integrity.
- Keep account/auth identity separate from public profile data.

### Appwrite — credible alternative

Strengths:
- Integrated Auth, database, storage, functions and Realtime.
- Free plan currently lists 5 GB bandwidth, 2 GB storage, 750,000 executions, 75,000 monthly active users, one database, one bucket and two functions per project.
- Its Realtime free allowance currently lists 2 million messages/month and 250 concurrent connections.

Trade-offs:
- Confirm the database mode and query model before choosing it. Lux Christi has relational requirements, so PostgreSQL and SQL migrations are a strong fit; Appwrite's platform abstraction may require more care to keep data portable.
- Free projects can pause after a week of inactivity and usage caps can disable features until the next billing cycle or plan change.

### Firebase — not the first choice for this project

Firebase can provide authentication, realtime database services, hosting and storage, but the expected relationships and transactional workflows (dioceses/parishes, competition registrations, rounds, answers, results, rankings, moderation and chat memberships) make a relational PostgreSQL model easier to reason about for the first backend. Re-evaluate if the product later has a strong Firebase-specific need.

## Realtime messaging versus live media

Do not treat chat and audio/video as the same technical problem:
- Supabase Realtime can distribute presence and application events; persist messages in PostgreSQL with membership and moderation rules.
- LiveKit handles media transport over WebRTC using an SFU. It is not the system of record for accounts, competitions, message history or rankings.
- A trusted backend issues short-lived LiveKit room tokens after checking room membership, role and event status. Never mint privileged media tokens in the browser.

LiveKit's published Build plan currently includes 5,000 WebRTC participant minutes, 100 concurrent connections and 50 GB downstream transfer. Treat these as pilot allowances, not production capacity. Self-hosting is possible because LiveKit Server is open source, but then Lux Christi becomes responsible for deployment, TURN/network configuration, monitoring, upgrades, security and uptime.

## Suggested high-level architecture

```text
Browser / Installed PWA (HTML + CSS + Vanilla JS)
        |
        +-- Supabase Auth (identity and sessions)
        |
        +-- Postgres + RLS (profiles, Catholic affiliations, learning, competitions, chat)
        |
        +-- Supabase Realtime (presence and app events)
        |
        +-- Supabase Storage (avatars and approved learning assets)
        |
        +-- Trusted Edge Function / server endpoint
                 |-- competition validation and scoring
                 |-- moderation-sensitive actions
                 |-- short-lived LiveKit room token issuance
        |
        +-- LiveKit Cloud (WebRTC audio/video rooms and broadcasts)

Static PWA delivery: Cloudflare Pages / Workers Static Assets
```

## Data model boundaries to establish before writing migrations

Start with a modular monolith and a small, coherent schema. Candidate domains:

1. Identity: `profiles`, `profile_photos`, `user_preferences`. Auth credentials remain in the auth provider.
2. Catholic affiliation: `countries`, `dioceses`, `parishes`, `profile_affiliations` (support a user having more than one affiliation without hard-coding one country).
3. Learning: `learning_areas`, `topics`, `lessons`, `lesson_versions`, `content_sources`, `content_reviews`, `lesson_progress`, `bookmarks`.
4. Quiz content: `quiz_categories`, `questions`, `question_options`, `question_versions`. Keep answer keys inaccessible to public client queries.
5. Competition: `competitions`, `competition_stages`, `registrations`, `matches`, `match_participants`, `question_deliveries`, `answer_submissions`, `results`, `leaderboard_snapshots`.
6. Social: `friendships`, `blocks`, `groups`, `group_members`, `conversations`, `conversation_members`, `messages`, `reports`, `moderation_actions`.
7. Live: `live_events`, `live_rooms`, `live_roles`, `live_attendance`, `live_event_messages`; media itself flows through LiveKit, not through database rows.
8. Audit: `audit_events` for sensitive account, role, competition and moderation actions.

These are domain boundaries, not a requirement to create every table in the first migration. Build the minimum identity/profile slice first.

## Implementation sequence after approval

1. Create provider accounts/projects and secure environment configuration.
2. Add Supabase client behind a small `authService` and `profileRepository` boundary.
3. Write initial SQL migrations for profiles and Catholic affiliations; enable and test RLS before exposing data.
4. Implement registration, email verification, login, logout and password recovery.
5. Add profile editing and photo storage with safe upload rules.
6. Add server-side validation and rate limits before migrating official competition flows.
7. Add realtime presence/chat only after membership, block/report and moderation policies are designed.
8. Add LiveKit as a separate controlled pilot after authenticated roles and trusted token issuance exist.

## Non-negotiable security rules

- No secrets or service-role keys in JavaScript delivered to browsers.
- RLS and least-privilege grants for all exposed data.
- Validate all input on the server; client-side validation is UX only.
- Rate-limit authentication, password reset, chat, challenge creation and answer submission.
- Use server-authoritative clocks, competition windows, random question delivery and scoring.
- Use short-lived signed media tokens and check host/participant/viewer role on the server.
- Do not cache private API responses, tokens or messages in the public service-worker cache.
- Design age protection, consent, reporting, blocking and human moderation before open messaging or public broadcasting.

## Official references

- Supabase plans and quotas: https://supabase.com/pricing
- Supabase billing quotas: https://supabase.com/docs/guides/platform/billing-on-supabase
- Supabase free project pausing: https://supabase.com/docs/guides/platform/free-project-pausing
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Realtime authorization: https://supabase.com/docs/guides/realtime/authorization
- Appwrite pricing: https://appwrite.io/pricing
- Appwrite free plan limits: https://appwrite.io/docs/advanced/billing/free
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare plans and Workers/D1/R2 allowances: https://www.cloudflare.com/plans/
- LiveKit pricing: https://livekit.com/pricing
- LiveKit overview: https://docs.livekit.io/intro/about/
- LiveKit SFU architecture: https://docs.livekit.io/reference/internals/livekit-sfu/

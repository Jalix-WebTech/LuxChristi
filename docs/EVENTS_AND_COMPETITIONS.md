# Events & Competitions — Frontend MVP

## Purpose

The Events section is the public discovery and information layer for Lux Christi competitions. It introduces an events listing page (`events.html`) and a reusable details page (`event.html?id=<event-id>`).

## Current implementation

- Event records live in `js/data/events.js`.
- Public event filtering, status labels, action mapping and date formatting live in `js/services/eventService.js`.
- `js/modules/eventsController.js` renders featured, upcoming, category and past-event areas.
- `js/modules/eventDetailsController.js` renders a selected public event and its information.
- `css/pages/events.css` contains page-specific responsive styling.
- `service-worker.js` precaches the event pages and their modules.

The event catalogue is intentionally empty until an organiser approves real event details. This prevents demo dates, categories or access details from being mistaken for an official announcement. The category cards are informational programme areas, not confirmed scheduled competitions.

## Event record contract

See the commented example in `js/data/events.js`. Store event times as ISO 8601 strings with an explicit timezone offset and provide an IANA `timeZone` value (for example, `Africa/Lagos`) so the published event time is unambiguous across countries. The interface formats event dates in that timezone and displays the timezone label. Use the `status` field as the source of truth for public visibility and available actions.

Supported statuses: `draft`, `upcoming`, `registration-open`, `registration-closed`, `starting-soon`, `live`, `completed`, `results-published`, and `cancelled`.

Draft records are excluded from public listing and direct ID lookup. Private Zoom/Kahoot credentials must never be placed in public event data. `privateInstructions` is a placeholder for a future authenticated delivery flow and is not rendered by the current frontend.

## Registration and backend boundary

This milestone does not collect or persist contestant registrations. The registration-open state currently communicates the event status but does not claim that a working registration form exists; its action explicitly says the registration form is not yet available. A secure registration endpoint and database must be implemented before collecting personal information. Browser localStorage is not a registration database.

## Temporary competition delivery

The planned temporary event operations may use Zoom for contestant/host coordination, Kahoot for question delivery and scoring, YouTube Live for public spectators, OBS for broadcast production and WhatsApp for community announcements. Confirm current plan limits and operational requirements before each event. Private participant links must be distributed only to approved participants.

## Verification

Run:

```bash
npm test
npm run check
```

The event tests validate draft exclusion, public visibility, status actions and the intentionally empty initial catalogue.

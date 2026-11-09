import assert from "node:assert/strict";
import { events, eventCategories } from "../js/data/events.js";
import { EVENT_STATUSES, getEventAction, getEventById, getFeaturedEvent, getPublicEvents, getStatusLabel, formatEventDate } from "../js/services/eventService.js";

assert.equal(events.length, 0, "No unapproved sample events should be published by default.");
assert.ok(eventCategories.length >= 4, "The public event category catalogue should be populated.");
assert.equal(getEventById("not-published"), null);
assert.equal(getFeaturedEvent(), null);
assert.deepEqual(getPublicEvents(), []);

const records = [
  { id: "hidden", title: "Hidden", status: EVENT_STATUSES.DRAFT },
  { id: "open", title: "Registration Open", status: EVENT_STATUSES.REGISTRATION_OPEN },
  { id: "live", title: "Live Event", status: EVENT_STATUSES.LIVE, publicLinks: { broadcast: "https://example.org/live" } },
  { id: "results", title: "Results", status: EVENT_STATUSES.RESULTS_PUBLISHED, resultsUrl: "results.html" }
];
assert.deepEqual(getPublicEvents(records).map(event => event.id), ["open", "live", "results"]);
assert.equal(getEventById("hidden", records), null, "Draft events must never be public.");
assert.equal(getEventById("open", records).title, "Registration Open");
assert.equal(getEventAction(records[1]).disabled, true, "Registration must not appear enabled without a registration workflow.");
assert.equal(getEventAction(records[1]).label, "Registration form not yet available");
assert.equal(getEventAction(records[2]).href, "https://example.org/live");
assert.equal(getEventAction({ ...records[2], publicLinks: { broadcast: "javascript:alert(1)" } }).disabled, true, "Unsafe broadcast URLs must not become public links.");
assert.equal(getEventAction(records[3]).href, "results.html");
assert.equal(getStatusLabel("registration-open"), "Registration Open");
assert.notEqual(formatEventDate("not-a-date"), "not-a-date", "Invalid event dates should use the announcement fallback.");
assert.equal(formatEventDate(null), "Date to be announced");
assert.ok(formatEventDate("2027-03-20T14:00:00+01:00", { includeTime: true, timeZone: "Africa/Lagos" }).length > 10, "Event date/time should format with an explicit IANA timezone.");
console.log("PASS: event visibility, status actions, draft protection, category catalogue and timezone formatting.");

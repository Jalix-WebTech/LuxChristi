import { events } from "../data/events.js";

export const EVENT_STATUSES = Object.freeze({
  DRAFT: "draft",
  UPCOMING: "upcoming",
  REGISTRATION_OPEN: "registration-open",
  REGISTRATION_CLOSED: "registration-closed",
  STARTING_SOON: "starting-soon",
  LIVE: "live",
  COMPLETED: "completed",
  RESULTS_PUBLISHED: "results-published",
  CANCELLED: "cancelled"
});

const PUBLIC_STATUSES = new Set(Object.values(EVENT_STATUSES).filter(status => status !== EVENT_STATUSES.DRAFT));

export function getPublicEvents(source = events) {
  return source.filter(event => PUBLIC_STATUSES.has(event.status));
}

export function getEventById(id, source = events) {
  if (!id) return null;
  return getPublicEvents(source).find(event => event.id === id) || null;
}

export function getFeaturedEvent(source = events) {
  return getPublicEvents(source).find(event => event.featured) || null;
}

export function getEventsByStatus(status, source = events) {
  return getPublicEvents(source).filter(event => event.status === status);
}

function safePublicUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value, globalThis.location?.origin || "https://luxchristi.invalid");
    if (!["https:", "http:"].includes(url.protocol)) return null;
    // Preserve relative paths so same-site results pages remain relative links.
    return /^[a-z][a-z0-9+.-]*:/i.test(value) ? url.href : value;
  } catch {
    return null;
  }
}

export function getEventAction(event) {
  const liveUrl = safePublicUrl(event.publicLinks?.broadcast);
  const resultsUrl = safePublicUrl(event.resultsUrl);
  const actions = {
    [EVENT_STATUSES.UPCOMING]: { label: "Registration Not Yet Open", href: null, disabled: true },
    [EVENT_STATUSES.REGISTRATION_OPEN]: { label: "Registration form not yet available", href: null, disabled: true },
    [EVENT_STATUSES.REGISTRATION_CLOSED]: { label: "Registration Closed", href: null, disabled: true },
    [EVENT_STATUSES.STARTING_SOON]: { label: "Participation Instructions", href: null, disabled: true },
    [EVENT_STATUSES.LIVE]: { label: "View Live Event", href: liveUrl, disabled: !liveUrl },
    [EVENT_STATUSES.COMPLETED]: { label: "View Competition", href: `event.html?id=${encodeURIComponent(event.id)}`, disabled: false },
    [EVENT_STATUSES.RESULTS_PUBLISHED]: { label: "View Results", href: resultsUrl || `event.html?id=${encodeURIComponent(event.id)}#results`, disabled: false },
    [EVENT_STATUSES.CANCELLED]: { label: "Event Cancelled", href: null, disabled: true }
  };
  return actions[event.status] || { label: "View Details", href: `event.html?id=${encodeURIComponent(event.id)}`, disabled: false };
}

export function formatEventDate(value, options = {}) {
  if (!value) return "Date to be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";

  // Event records should provide an IANA timezone (for example, Africa/Lagos).
  // If it is absent or invalid, fall back to the visitor's local timezone.
  const formatOptions = options.includeTime
    ? { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }
    : { dateStyle: "medium" };
  if (options.timeZone) formatOptions.timeZone = options.timeZone;

  try {
    return new Intl.DateTimeFormat(undefined, formatOptions).format(date);
  } catch {
    delete formatOptions.timeZone;
    return new Intl.DateTimeFormat(undefined, formatOptions).format(date);
  }
}

export function getStatusLabel(status) {
  return String(status || "upcoming").replaceAll("-", " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

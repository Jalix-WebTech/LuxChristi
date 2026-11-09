import { getEventById, getEventAction, formatEventDate, getStatusLabel, EVENT_STATUSES } from "../services/eventService.js";

const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const list = values => Array.isArray(values) && values.length ? `<ul>${values.map(value => `<li>${escapeHtml(value)}</li>`).join("")}</ul>` : "<p>Details will be announced by the organisers.</p>";

export function initEventDetailsPage() {
  const root = document.querySelector("#eventDetails");
  if (!root) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const event = getEventById(id);
  if (!event) {
    root.innerHTML = `<div class="events-empty event-not-found"><span aria-hidden="true">✦</span><h1>Event not found</h1><p>This event is not currently available. It may not have been published yet, or the link may be incorrect.</p><a class="button button-gold" href="events.html">Explore Events</a></div>`;
    document.title = "Event Not Found | Lux Christi";
    return;
  }

  const action = getEventAction(event);
  const actionMarkup = action.href && !action.disabled
    ? `<a class="button button-gold" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`
    : `<span class="event-action-note" aria-live="polite">${escapeHtml(action.label)}. Please follow official Lux Christi announcements for updates.</span>`;
  const platforms = event.platforms ? Object.entries(event.platforms).filter(([, value]) => value).map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("") : "";
  const results = event.status === EVENT_STATUSES.RESULTS_PUBLISHED
    ? `<section class="event-detail-section" id="results"><span class="eyebrow">OFFICIAL OUTCOME</span><h2>Results &amp; winners</h2>${event.resultsUrl ? `<a class="button button-secondary" href="${escapeHtml(event.resultsUrl)}">View published results</a>` : "<p>Results will be published here by the organisers.</p>"}</section>` : "";

  root.innerHTML = `<section class="event-detail-hero"><a class="back-link" href="events.html">← All events</a><span class="event-status status-${escapeHtml(event.status)}">${escapeHtml(getStatusLabel(event.status))}</span><span class="eyebrow">${escapeHtml(event.category || "LUX CHRISTI EVENT")}</span><h1>${escapeHtml(event.title)}</h1><p>${escapeHtml(event.description || "Competition details will be published by the organisers.")}</p><div class="event-detail-primary-action">${actionMarkup}</div></section>
  <div class="event-detail-grid"><div class="event-detail-main"><section class="event-detail-section"><span class="eyebrow">ABOUT THIS EVENT</span><h2>Competition overview</h2><p>${escapeHtml(event.overview || event.description || "Further information will be announced by the organisers.")}</p></section><section class="event-detail-section"><span class="eyebrow">WHO CAN PARTICIPATE?</span><h2>Eligibility</h2>${list(event.eligibility)}</section><section class="event-detail-section"><span class="eyebrow">PLEASE READ</span><h2>Competition guidelines</h2>${list(event.guidelines)}</section>${results}</div>
  <aside class="event-detail-aside"><section class="event-info-panel"><h2>Event information</h2><dl><div><dt>Date &amp; time</dt><dd>${escapeHtml(formatEventDate(event.startsAt, { includeTime: true, timeZone: event.timeZone }))}</dd></div><div><dt>Registration opens</dt><dd>${escapeHtml(formatEventDate(event.registrationOpensAt))}</dd></div><div><dt>Registration closes</dt><dd>${escapeHtml(formatEventDate(event.registrationClosesAt))}</dd></div><div><dt>Event timezone</dt><dd>${escapeHtml(event.timeZone || "Shown in your local timezone")}</dd></div><div><dt>Mode</dt><dd>${escapeHtml(event.mode || "To be announced")}</dd></div><div><dt>Venue</dt><dd>${escapeHtml(event.venue || "To be announced")}</dd></div>${platforms}</dl>${actionMarkup}</section><p class="event-privacy-note">Official participation instructions and private meeting credentials are shared only with approved participants. Do not rely on unofficial links.</p></aside></div>`;
  document.title = `${event.title} | Lux Christi`;
}

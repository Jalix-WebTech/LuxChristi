import { eventCategories } from "../data/events.js";
import { EVENT_STATUSES, formatEventDate, getEventAction, getEventsByStatus, getFeaturedEvent, getPublicEvents, getStatusLabel } from "../services/eventService.js";

const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

function eventCard(event) {
  const action = getEventAction(event);
  const button = action.href && !action.disabled
    ? `<a class="button button-secondary" href="${escapeHtml(action.href)}">${escapeHtml(action.label)} <span aria-hidden="true">→</span></a>`
    : `<span class="event-card-action" aria-disabled="true">${escapeHtml(action.label)}</span>`;
  return `<article class="event-card">
    <div class="event-card-topline"><span class="event-category">${escapeHtml(event.category || "Faith competition")}</span><span class="event-status status-${escapeHtml(event.status)}">${escapeHtml(getStatusLabel(event.status))}</span></div>
    <h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.description || "Competition details will be published by the organisers.")}</p>
    <dl class="event-meta"><div><dt>Date</dt><dd>${escapeHtml(formatEventDate(event.startsAt, { includeTime: true, timeZone: event.timeZone }))}</dd></div><div><dt>Mode</dt><dd>${escapeHtml(event.mode || "To be announced")}</dd></div></dl>
    <div class="event-card-footer">${button}</div>
  </article>`;
}

function renderEmptyState(title, message) {
  return `<div class="events-empty"><span aria-hidden="true">✦</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(message)}</p></div>`;
}

export function initEventsPage() {
  const featuredContainer = document.querySelector("#featuredEvent");
  const upcomingContainer = document.querySelector("#upcomingEvents");
  const pastContainer = document.querySelector("#pastEvents");
  const featured = getFeaturedEvent();
  const upcoming = getPublicEvents().filter(event => [EVENT_STATUSES.UPCOMING, EVENT_STATUSES.REGISTRATION_OPEN, EVENT_STATUSES.REGISTRATION_CLOSED, EVENT_STATUSES.STARTING_SOON, EVENT_STATUSES.LIVE].includes(event.status));
  const past = getPublicEvents().filter(event => [EVENT_STATUSES.COMPLETED, EVENT_STATUSES.RESULTS_PUBLISHED].includes(event.status));

  if (featuredContainer) featuredContainer.innerHTML = featured ? eventCard(featured) : renderEmptyState("A new challenge is on the way", "Official competition announcements will appear here once dates and participation details have been confirmed.");
  if (upcomingContainer) upcomingContainer.innerHTML = upcoming.length ? upcoming.map(eventCard).join("") : renderEmptyState("No events announced yet", "Check back soon or join the Lux Christi community to hear when registration opens.");
  if (pastContainer) pastContainer.innerHTML = past.length ? past.map(eventCard).join("") : renderEmptyState("Our event history starts here", "Published competition results and past event highlights will be collected in this section.");

  const categoriesContainer = document.querySelector("#eventCategories");
  if (categoriesContainer) categoriesContainer.innerHTML = eventCategories.map(category => `<article class="event-category-card"><span aria-hidden="true">✧</span><h3>${escapeHtml(category.name)}</h3><p>${escapeHtml(category.description)}</p></article>`).join("");
}

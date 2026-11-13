import { homepageService } from "../../services/homepageService.js";
import { initCarousels } from "../../components/carousel.js";
import { formatEventDate, getEventAction, getStatusLabel } from "../../services/eventService.js";

const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const emptyState = (title, message) => `<div class="home-empty-state"><span aria-hidden="true">✧</span><h3>${title}</h3><p>${message}</p></div>`;

function carouselSection({ id, eyebrow, title, description, items, renderCard, emptyTitle, emptyMessage, actionHref, actionLabel, filters = null }) {
  const content = items.length
    ? `<div class="home-carousel" data-carousel><button class="carousel-control" type="button" data-carousel-direction="previous" aria-label="Scroll ${escapeHTML(title)} backward" disabled>‹</button><div class="home-carousel-track" data-carousel-track tabindex="0" aria-label="${escapeHTML(title)} items">${items.map((item, index) => renderCard(item, index)).join("")}</div><button class="carousel-control" type="button" data-carousel-direction="next" aria-label="Scroll ${escapeHTML(title)} forward">›</button></div>`
    : emptyState(emptyTitle, emptyMessage);
  const filterMarkup = filters ? `<div class="home-filter-row" role="group" aria-label="Filter ${escapeHTML(title)}">${filters.map((filter, index) => `<button type="button" class="home-filter-button" data-home-filter="${filter.value}" aria-pressed="${index === 0}">${filter.label}</button>`).join("")}</div>` : "";
  return `<section class="home-content-section page-section" id="${id}" aria-labelledby="${id}-title"><div class="home-section-heading"><div><span class="eyebrow">${eyebrow}</span><h2 id="${id}-title">${title}</h2></div><p>${description}</p></div>${filterMarkup}${content}${actionHref ? `<div class="home-section-action"><a class="text-link" href="${actionHref}">${actionLabel} <span aria-hidden="true">→</span></a></div>` : ""}</section>`;
}

const gameCard = game => `<article class="discovery-card game-discovery-card" data-carousel-card data-filter-value="${escapeHTML(game.category)}"><div class="discovery-art"><img src="${escapeHTML(game.image)}" alt="" width="480" height="240" loading="lazy" decoding="async"></div><div class="discovery-card-body"><span class="content-kicker">${escapeHTML(game.difficulty)} · ${escapeHTML(game.duration)}</span><h3>${escapeHTML(game.title)}</h3><p>${escapeHTML(game.description)}</p><a class="button button-secondary" href="${escapeHTML(game.destination)}">Play now <span aria-hidden="true">↗</span></a></div></article>`;
const quizCard = quiz => `<article class="discovery-card" data-carousel-card data-filter-value="${escapeHTML(quiz.category)}"><div class="discovery-art quiz-art"><img src="${escapeHTML(quiz.image)}" alt="" width="480" height="240" loading="lazy" decoding="async"></div><div class="discovery-card-body"><span class="content-kicker">${quiz.questionCount} available questions</span><h3>${escapeHTML(quiz.title)}</h3><p>${escapeHTML(quiz.description)}</p><a class="button button-secondary" href="${escapeHTML(quiz.destination)}">Start quiz <span aria-hidden="true">↗</span></a></div></article>`;
const learningCard = item => `<article class="discovery-card learning-discovery-card" data-carousel-card><div class="discovery-art learning-art"><img src="${escapeHTML(item.image)}" alt="" width="480" height="240" loading="lazy" decoding="async"></div><div class="discovery-card-body"><span class="content-kicker">${escapeHTML(item.provider)}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p><a class="button button-secondary" href="${escapeHTML(item.destination)}" target="_blank" rel="noopener noreferrer">Explore resource <span aria-hidden="true">↗</span></a></div></article>`;
const eventCard = event => {
  const action = getEventAction(event);
  const actionMarkup = action.href && !action.disabled
    ? `<a class="button button-secondary" href="${escapeHTML(action.href)}">${escapeHTML(action.label)}</a>`
    : `<span class="content-kicker">${escapeHTML(action.label)}</span>`;
  const deadline = event.registrationClosesAt ? `<p class="event-card-date">Registration closes: ${escapeHTML(formatEventDate(event.registrationClosesAt, { timeZone: event.timeZone }))}</p>` : "";
  const eligibility = Array.isArray(event.eligibility) && event.eligibility.length ? `<p class="event-card-date">Eligibility: ${escapeHTML(event.eligibility.slice(0, 2).join(" · "))}</p>` : "";
  return `<article class="discovery-card" data-carousel-card><div class="discovery-card-body"><span class="content-kicker">${escapeHTML(event.category || "Catholic competition")} · ${escapeHTML(getStatusLabel(event.status))}</span><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.description || "Competition details will be announced by the organisers.")}</p><p class="event-card-date">Date: ${escapeHTML(formatEventDate(event.startsAt, { includeTime: true, timeZone: event.timeZone }))}</p>${deadline}${eligibility}${actionMarkup}<a class="text-link" href="event.html?id=${encodeURIComponent(event.id)}">View details</a></div></article>`;
};

const resultCard = result => `<article class="home-simple-card result-preview-card"><img src="${escapeHTML(result.photo || "assets/images/players/profile-placeholder.svg")}" alt="" width="64" height="64" loading="lazy"><div><span class="content-kicker">${escapeHTML(result.competitionTitle || result.activityTitle || "Completed activity")}</span><h3>${escapeHTML(result.name || result.fullName)}</h3><p>${escapeHTML(result.id || "Contestant ID not provided")} · ${escapeHTML(result.score ?? "Score unavailable")} points · ${escapeHTML(result.position ? `Position ${result.position}` : "Position not published")}</p><small>${escapeHTML(result.completedAt || "Completion date not provided")}</small></div>${result.profileUrl ? `<a class="text-link" href="${escapeHTML(result.profileUrl)}">View profile</a>` : ""}${result.resultUrl ? `<a class="text-link" href="${escapeHTML(result.resultUrl)}">View result</a>` : ""}</article>`;
const activityCard = item => `<article class="home-simple-card activity-preview-card"><img src="${escapeHTML(item.photo || "assets/images/players/profile-placeholder.svg")}" alt="" width="48" height="48" loading="lazy"><div><h3>${escapeHTML(item.userName || "Lux Christi")}</h3><p>${escapeHTML(item.description)}</p><small>${escapeHTML(item.timestamp || "")}</small></div></article>`;

function mountQuickNavigation() {
  const host = document.querySelector("#homepageQuickNav");
  if (!host) return;
  const links = [
    ["✧", "Learn", "learn.html"], ["✦", "Quizzes", "quiz.html#activitySelection"], ["◇", "Games", "quiz.html#activitySelection"],
    ["♜", "Competitions", "events.html"], ["🏆", "Top Winners", "players.html"], ["◎", "Community", "community.html"], ["✧", "Achievements", "#achievements"]
  ];
  host.innerHTML = links.map(([icon, label, href]) => `<a class="quick-nav-item" href="${href}"><span aria-hidden="true">${icon}</span><b>${label}</b></a>`).join("");
}

function mountDiscoveryStories(items) {
  const host = document.querySelector("#homepageStories");
  if (!host) return;
  host.innerHTML = items.map(item => `<a class="story-item" href="${escapeHTML(item.href)}"><span class="story-ring"><span aria-hidden="true">${escapeHTML(item.icon)}</span></span><b>${escapeHTML(item.title)}</b><small>${escapeHTML(item.description)}</small></a>`).join("");
}

function mountDailyChallenge() {
  const host = document.querySelector("#dailyChallengeMount");
  if (!host) return;
  host.innerHTML = `<div class="daily-challenge-card"><div><span class="eyebrow">A MOMENT TO GROW</span><h3>Take a Scripture challenge</h3><p>Choose a Bible Knowledge quiz and test what you have learned. Your progress is not saved to an account in this frontend MVP.</p><span class="challenge-meta">Self-paced · 7-second question timer</span></div><a class="button button-gold" href="quiz.html?activity=quiz&amp;selection=bible-knowledge#activitySelection">Start a challenge <span aria-hidden="true">→</span></a></div>`;
}

function mountAchievements(host, tiers) {
  if (!host) return;
  host.innerHTML = `<div class="achievement-tier-grid">${tiers.map(tier => `<article class="achievement-tier-card"><span aria-hidden="true">${escapeHTML(tier.badge)}</span><h3>${escapeHTML(tier.title)}</h3><p>${Number.isFinite(tier.max) ? `${tier.min.toLocaleString()}–${tier.max.toLocaleString()} points` : `${tier.min.toLocaleString()}+ points`}</p></article>`).join("")}</div><p class="achievement-note">Achievement tiers are awarded by the existing quiz result system. Points shown are the current frontend scoring thresholds.</p>`;
}

function mountSaint(host, saint) {
  if (!host) return;
  host.innerHTML = saint
    ? `<article class="saint-feature-card">${saint.image ? `<img class="saint-feature-image" src="${escapeHTML(saint.image)}" alt="${escapeHTML(saint.imageAlt || `Portrait of ${saint.name}`)}" width="160" height="160" loading="lazy">` : `<div class="saint-feature-art" aria-hidden="true">✝</div>`}<div><span class="eyebrow">FEATURED SAINT</span><h3>${escapeHTML(saint.name)}</h3><p>${escapeHTML(saint.summary)}</p>${saint.feastDay ? `<p class="challenge-meta">Feast day: ${escapeHTML(saint.feastDay)}</p>` : ""}<a class="button button-secondary" href="${escapeHTML(saint.href || "learn.html")}">Explore saint</a>${saint.quizHref ? `<a class="text-link" href="${escapeHTML(saint.quizHref)}">Take a quiz</a>` : ""}</div></article>`
    : emptyState("Saint feature coming soon", "A reviewed saint profile and suitable image will appear here when approved Catholic content is available.");
}

function mountEmptyCollections({ results, activities, announcements, videos }) {
  const specs = [
    ["latestResultsMount", results, "No published results yet", "Official contestant results will appear here after they have been reviewed and published."],
    ["communityActivityMount", activities, "Community updates will appear here", "This feed will display approved platform activities. No live social activity feed is connected yet."],
    ["announcementsMount", announcements, "No official announcements yet", "New platform notices and competition updates will be published here."],
    ["featuredVideosMount", videos, "Featured videos coming soon", "Official Lux Christi videos will be added here when published."]
  ];
  specs.forEach(([id, items, title, message]) => {
    const host = document.getElementById(id);
    if (host) host.innerHTML = items.length ? items.map(item => id === "latestResultsMount" ? resultCard(item) : id === "communityActivityMount" ? activityCard(item) : `<article class="home-simple-card"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></article>`).join("") : emptyState(title, message);
  });
}

function renderSections(data) {
  const sections = [
    ["hot-games", "PLAY & DISCOVER", "Hot games", "Interactive activities already available in the Lux Christi quiz and games experience.", data.games, gameCard, "Games are being prepared", "Published games will appear here when available.", "quiz.html#activitySelection", "Explore all activities", [{value:"all",label:"All"},{value:"scripture",label:"Scripture"},{value:"saints",label:"Saints & virtues"},{value:"puzzles",label:"Puzzles"},{value:"symbols",label:"Symbols"}]],
    ["trending-quizzes", "TEST YOUR KNOWLEDGE", "Trending quizzes", "Browse the available Catholic quiz categories. Popularity-based rankings will appear when verified participation data is available.", data.quizzes, quizCard, "Quiz categories unavailable", "Visit the Quiz & Games page to explore available activities.", "quiz.html#activitySelection", "Open Quiz & Games", [{value:"all",label:"All topics"},{value:"scripture",label:"Scripture"},{value:"doctrine",label:"Doctrine"},{value:"saints",label:"Saints"},{value:"devotions",label:"Devotions"},{value:"puzzles",label:"Riddles"}]],
    ["learning-corner", "FORMATION & DISCOVERY", "Learning corner", "Explore selected Catholic learning resources from recognised Church sources.", data.learning, learningCard, "Learning resources unavailable", "Visit the Learning Centre for the full resource library.", "learn.html", "Visit Learning Centre"]
  ];
  const mount = document.querySelector("#homepageDiscoverySections");
  if (mount) mount.innerHTML = sections.map(([id, eyebrow, title, description, items, renderer, emptyTitle, emptyMessage, href, label, filters]) => carouselSection({ id, eyebrow, title, description, items, renderCard: renderer, emptyTitle, emptyMessage, actionHref: href, actionLabel: label, filters })).join("");

  const eventHost = document.querySelector("#upcomingEventsMount");
  if (eventHost) eventHost.innerHTML = data.events.length ? `<div class="home-event-grid">${data.events.map(eventCard).join("")}</div>` : emptyState("No upcoming competitions published", "Official event dates, registration windows and eligibility details will appear here once confirmed by the organisers.");
  mountEmptyCollections(data);
  mountSaint(document.querySelector("#featuredSaintMount"), data.featuredSaint);
  mountAchievements(document.querySelector("#achievementTiersMount"), data.achievements);
}

function initHomeFilters() {
  document.querySelectorAll(".home-filter-row").forEach(group => {
    group.addEventListener("click", event => {
      const button = event.target.closest("[data-home-filter]");
      if (!button) return;
      group.querySelectorAll("[data-home-filter]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
      const section = group.closest(".home-content-section");
      const selected = button.dataset.homeFilter;
      section?.querySelectorAll("[data-filter-value]").forEach(card => { card.hidden = selected !== "all" && card.dataset.filterValue !== selected; });
      const track = section?.querySelector("[data-carousel-track]");
      if (track) { track.scrollLeft = 0; track.dispatchEvent(new Event("scroll")); }
    });
  });
}

export async function initHomepage() {
  if (!document.querySelector("[data-homepage]") ) return;
  mountQuickNavigation();
  mountDailyChallenge();
  try {
    const [stories, games, quizzes, results, events, activities, learning, announcements, videos, featuredSaint, achievements] = await Promise.all([
      homepageService.getDiscoveryStories(), homepageService.getGames(), homepageService.getTrendingQuizzes(), homepageService.getLatestResults(), homepageService.getUpcomingEvents(), homepageService.getCommunityActivities(), homepageService.getLearningResources(), homepageService.getAnnouncements(), homepageService.getFeaturedVideos(), homepageService.getFeaturedSaint(), homepageService.getAchievementTiers()
    ]);
    mountDiscoveryStories(stories);
    renderSections({ games, quizzes, results, events, activities, learning, announcements, videos, featuredSaint, achievements });
    initHomeFilters();
    initCarousels(document);
  } catch (error) {
    console.error("Lux Christi homepage content could not be loaded.", error);
    document.querySelectorAll("[data-homepage-status]").forEach(node => { node.textContent = "Some homepage content could not be loaded. Please refresh or use the navigation links above."; });
  }
}

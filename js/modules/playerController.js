import { players } from "../data/playerData.js";

const MAX_WINNERS = 20;
export const INITIAL_WINNER_COUNT = 15;
const LOAD_MORE_COUNT = 5;
const MEDALS = {
  1: { src: "assets/images/medals/gold-medal.svg", alt: "Gold medal — first place" },
  2: { src: "assets/images/medals/silver-medal.svg", alt: "Silver medal — second place" },
  3: { src: "assets/images/medals/diamond-medal.svg", alt: "Diamond medal — third place" },
};

/** Convert legacy formatted scores (for example "2,480") into sortable numbers. */
function getNumericScore(player) {
  const rawScore = player.score ?? player.points ?? 0;
  return Number(String(rawScore).replace(/[^0-9.-]/g, "")) || 0;
}

/** Remove duplicate records before ranking, even if the data source returns repeats. */
export function getUniqueRankedWinners(records) {
  const seen = new Set();
  return records
    .filter(player => {
      const key = `${String(player.name || "").trim().toLowerCase()}|${String(player.diocese || "").trim().toLowerCase()}`;
      if (!player.name || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => getNumericScore(b) - getNumericScore(a))
    .slice(0, MAX_WINNERS)
    .map((player, index) => ({ ...player, position: index + 1, numericScore: getNumericScore(player) }));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function renderWinnerCard(player) {
  const medal = MEDALS[player.position];
  const rankMarkup = medal
    ? `<img class="player-medal" src="${medal.src}" alt="${medal.alt}" width="48" height="48">`
    : `<span class="player-rank-label" aria-label="Rank ${player.position}">${String(player.position).padStart(2, "0")}</span>`;
  const community = [player.diocese, player.deanery, player.parish].filter(Boolean).map(escapeHTML);
  const rating = player.achievementRating || player.achievement || "";

  return `
    <article class="player-card${player.position <= 3 ? ` winner-podium winner-place-${player.position}` : ""}">
      <div class="player-rank" aria-label="Position ${player.position}">${rankMarkup}</div>
      <img class="player-photo" src="${escapeHTML(player.photo || "assets/images/players/profile-placeholder.svg")}" alt="Profile photograph of ${escapeHTML(player.name)}" loading="lazy" decoding="async" width="88" height="88">
      <h3>${escapeHTML(player.name)}</h3>
      <p class="player-community">${community.length ? community.join(" · ") : "Lux Christi participant"}</p>
      <span class="player-score">${player.numericScore.toLocaleString()} POINTS</span>
      ${rating ? `<span class="player-rating">${escapeHTML(rating)}</span>` : ""}
    </article>`;
}

function attachPhotoFallbacks(container) {
  container.querySelectorAll(".player-photo").forEach(image => {
    image.addEventListener("error", () => {
      image.src = "assets/images/players/profile-placeholder.svg";
    }, { once: true });
  });
}

/** Render the full ranked list progressively; small previews stay intentionally compact. */
export function initPlayers() {
  const leaderboards = document.querySelectorAll("#leaderboard, #homepageLeaderboard, #quizLeaderboard");
  if (!leaderboards.length) return;

  const rankedWinners = getUniqueRankedWinners(players);

  leaderboards.forEach(leaderboard => {
    const isFullPage = leaderboard.id === "leaderboard";
    const previewLimit = Number(leaderboard.dataset.playerLimit) || 3;
    let visibleCount = isFullPage ? Math.min(INITIAL_WINNER_COUNT, rankedWinners.length) : previewLimit;
    const loadMoreButton = isFullPage ? document.querySelector("#loadMoreWinners") : null;

    const render = () => {
      const visible = rankedWinners.slice(0, visibleCount);
      leaderboard.innerHTML = visible.length
        ? visible.map(renderWinnerCard).join("")
        : `<p class="leaderboard-empty" role="status">No winners are available yet. Be among the first to take part!</p>`;
      attachPhotoFallbacks(leaderboard);
      if (loadMoreButton) {
        const hasMore = visibleCount < rankedWinners.length;
        loadMoreButton.hidden = !hasMore;
        loadMoreButton.disabled = !hasMore;
        loadMoreButton.textContent = hasMore ? `View More Winners (${rankedWinners.length - visibleCount} remaining)` : "All winners loaded";
      }
    };

    render();
    if (loadMoreButton) {
      loadMoreButton.addEventListener("click", () => {
        visibleCount = Math.min(visibleCount + LOAD_MORE_COUNT, rankedWinners.length, MAX_WINNERS);
        render();
      });
    }
  });
}

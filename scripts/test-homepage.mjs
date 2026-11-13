import assert from "node:assert/strict";
import { homepageCatalogue, discoveryStories } from "../js/data/homepageData.js";
import { homepageService } from "../js/services/homepageService.js";
import { getTopWinners } from "../js/services/playerService.js";
import { games } from "../js/games/index.js";
import { questionBanks } from "../js/question-banks/index.js";
import { questionBankCatalog } from "../js/question-banks/catalog.js";
import { access } from "node:fs/promises";

assert.ok(homepageCatalogue.games.length >= 1, "Homepage should expose existing game modules.");
assert.ok(homepageCatalogue.quizzes.length >= 1, "Homepage should expose existing quiz categories.");
for (const game of games) assert.equal(homepageCatalogue.games.find(item => item.id === game.id)?.duration, `${game.rounds.length} rounds`, `Homepage game catalogue count mismatch for ${game.id}`);
for (const bank of questionBankCatalog) assert.equal(homepageCatalogue.quizzes.find(item => item.id === bank.id)?.questionCount, questionBanks[bank.id].length, `Homepage question count mismatch for ${bank.id}`);
assert.ok(homepageCatalogue.learning.length >= 1, "Homepage should expose curated learning resources.");
assert.equal(homepageCatalogue.results.length, 0, "Unverified results must not be fabricated.");
assert.equal(homepageCatalogue.events.length, 0, "Unpublished events must remain absent.");
assert.equal(homepageCatalogue.activities.length, 0, "Live community activity must not be simulated.");
assert.ok((await getTopWinners()).every(player => player.dataStatus === "demonstration"), "Local winner profiles must be identified as demo data.");
assert.ok(homepageCatalogue.achievements.length >= 1, "Existing achievement tiers should be reused.");
assert.ok(discoveryStories.every(story => story.href && story.title), "Discovery items need valid destinations and labels.");

for (const item of [...homepageCatalogue.games, ...homepageCatalogue.quizzes, ...homepageCatalogue.learning]) {
  assert.ok(item.id && item.title && item.destination, `Missing required homepage item fields: ${item.id}`);
  if (item.image) await access(new URL(`../${item.image}`, import.meta.url));
}
for (const method of ["getGames", "getTrendingQuizzes", "getLatestResults", "getUpcomingEvents", "getTopWinners", "getCommunityActivities", "getLearningResources", "getAnnouncements", "getFeaturedVideos", "getFeaturedSaint", "getAchievementTiers"]) {
  assert.equal(typeof homepageService[method], "function", `Missing service method ${method}`);
}
assert.equal((await homepageService.getGames()).length, homepageCatalogue.games.length);
console.log("PASS: homepage catalogue, reusable data services, local image assets and honest empty/demo states.");

import assert from "node:assert/strict";
import { createQuiz, getQuestions, isCorrect, getBankCounts } from "../js/quiz/quiz-engine.js";
import { validatePlayerName } from "../js/quiz/quiz-validation.js";
import { calculateQuestionScore, SCORING } from "../js/quiz/scoring.js";
import { questionBanks } from "../js/question-banks/index.js";
import { games } from "../js/games/index.js";
import { ACHIEVEMENT_TIERS, getAchievement } from "../js/quiz/achievements.js";
import { getCommunityDetails } from "../js/services/resultService.js";
import { getUniqueRankedWinners, INITIAL_WINNER_COUNT } from "../js/modules/playerController.js";

for (const [category, count] of Object.entries(getBankCounts())) {
  assert.ok(count >= 10, `${category} should contain at least ten questions`);
  assert.equal(createQuiz(category, 10).length, 10, `${category} should return ten questions`);
}

const allQuestions = getQuestions("all");
assert.equal(allQuestions.length, 90, "All Categories should aggregate every question bank");
const allAttempt = createQuiz("all", 10);
assert.equal(allAttempt.length, 10, "All Categories should create a ten-question attempt");
assert.equal(new Set(allAttempt.map(item => item.id)).size, 10, "A single attempt should not repeat a question");
assert.ok(new Set(allAttempt.map(item => item.category)).size > 1, "All Categories should sample across categories");
assert.equal(createQuiz("unknown-category", 10).length, 0, "Unknown categories should return no questions");

for (const bank of Object.values(questionBanks)) {
  for (const question of bank) {
    assert.ok(question.answers.includes(question.correctAnswer), `Answer key exists for ${question.id}`);
    assert.equal(question.answers.length, 4, `Four choices exist for ${question.id}`);
    assert.equal(isCorrect(question, question.correctAnswer), true);
  }
}

for (const game of games) {
  assert.ok(game.rounds.length > 0, `${game.title} should have rounds`);
  for (const round of game.rounds) {
    assert.equal(round.answers.length, 4, `${round.id} should have four answer choices`);
    assert.ok(round.answers.includes(round.correctAnswer), `${round.id} should include its correct answer`);
  }
}

assert.equal(validatePlayerName("  Grace   Adebayo ").value, "Grace Adebayo");
assert.equal(validatePlayerName(" ").valid, false);
assert.equal(validatePlayerName("A").valid, false);

// Speed scoring: correctness is mandatory and a faster correct answer earns more.
const fastScore = calculateQuestionScore({ correct: true, timeRemainingSeconds: 6 });
const slowScore = calculateQuestionScore({ correct: true, timeRemainingSeconds: 2 });
const expiredScore = calculateQuestionScore({ correct: true, timeRemainingSeconds: 0 });
assert.ok(fastScore > slowScore, "Faster correct responses should earn more points");
assert.equal(expiredScore, SCORING.baseCorrectPoints, "Correct at expiry receives base points only");
assert.equal(calculateQuestionScore({ correct: false, timeRemainingSeconds: 7 }), 0, "Incorrect answers earn zero points");
assert.equal(calculateQuestionScore({ correct: false, timeRemainingSeconds: 0 }), 0, "Unanswered answers earn zero points");
assert.ok(calculateQuestionScore({ correct: true, timeRemainingSeconds: 100 }) <= SCORING.baseCorrectPoints + SCORING.maximumSpeedBonus, "Bonus must be capped");

// Achievement boundaries are configurable and each score maps to one tier.
assert.equal(getAchievement(0).title, "Beginner");
assert.equal(getAchievement(99).title, "Beginner");
assert.equal(getAchievement(100).title, "Learner");
assert.equal(getAchievement(299).title, "Learner");
assert.equal(getAchievement(300).title, "Rising Star");
assert.equal(getAchievement(500).title, "Achiever");
assert.equal(getAchievement(800).title, "Excellent");
assert.equal(getAchievement(1001).title, "Outstanding");
assert.equal(getAchievement(2001).title, "Legendary");
assert.ok(ACHIEVEMENT_TIERS.every((tier, index) => index === 0 || tier.min > ACHIEVEMENT_TIERS[index - 1].max), "Achievement tiers must not overlap");
assert.ok(ACHIEVEMENT_TIERS.every(tier => tier.stars > 0 && tier.message), "Every tier must define stars and a message");

// Community labels are generated automatically and blank fields are excluded.
assert.deepEqual(getCommunityDetails({ diocese: " Oyo Diocese ", deanery: "", parish: "St. Mary's Parish" }), [
  ["Diocese", "Oyo Diocese"],
  ["Parish", "St. Mary's Parish"],
]);
assert.deepEqual(getCommunityDetails({ diocese: "", deanery: " ", parish: "" }), []);

// Top Winners ranking sorts numerically, removes duplicate identities, starts with 15 and caps the list at 20.
assert.equal(INITIAL_WINNER_COUNT, 15, "At least fifteen available winners should be shown initially on the full leaderboard");
const leaderboardFixtures = Array.from({ length: 22 }, (_, index) => ({
  name: `Winner ${index + 1}`, diocese: "Test Diocese", score: (index + 1) * 100,
}));
leaderboardFixtures.push({ name: "Winner 22", diocese: "Test Diocese", score: 2200 }); // duplicate
const rankedWinners = getUniqueRankedWinners(leaderboardFixtures);
assert.equal(rankedWinners.length, 20, "Leaderboard must never exceed twenty unique winners");
assert.equal(rankedWinners.slice(0, INITIAL_WINNER_COUNT).length, 15, "Fifteen available winners should fit in the initial leaderboard batch");
assert.equal(rankedWinners[0].name, "Winner 22", "Highest score should rank first");
assert.equal(rankedWinners[0].position, 1, "Ranking should start at position one");
assert.equal(rankedWinners[19].position, 20, "Last displayed record should be rank twenty");
assert.ok(rankedWinners.every((winner, index) => index === 0 || rankedWinners[index - 1].numericScore >= winner.numericScore), "Winners should be sorted descending by score");

console.log("PASS: quiz banks, game rounds, player validation, scoring, achievements and Top Winners ranking.");

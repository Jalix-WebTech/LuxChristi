import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { questionBanks } from "../js/question-banks/index.js";
import { games } from "../js/games/index.js";

const root = resolve(new URL("..", import.meta.url).pathname);
const errors = [];
const warnings = [];
const requiredPages = ["index.html", "quiz.html", "learn.html", "players.html", "community.html", "about.html"];
for (const page of requiredPages) {
  try { await access(resolve(root, page)); }
  catch { errors.push(`Missing required page: ${page}`); }
}

for (const [category, questions] of Object.entries(questionBanks)) {
  if (questions.length < 10) errors.push(`${category} has fewer than ten questions.`);
  const ids = new Set();
  for (const question of questions) {
    if (ids.has(question.id)) errors.push(`Duplicate question ID: ${question.id}`);
    ids.add(question.id);
    if (!question.question || !question.explanation || !question.correctAnswer) errors.push(`Incomplete question record: ${question.id}`);
    if (!question.answers?.includes(question.correctAnswer)) errors.push(`Correct answer missing from options: ${question.id}`);
    if (question.answers?.length !== 4) errors.push(`Expected four answer options: ${question.id}`);
    if (question.type === "picture" && (!question.image || !question.imageAlt || !question.imageCredit)) errors.push(`Picture question missing image metadata: ${question.id}`);
    if (question.type === "picture" && question.image?.startsWith("assets/")) {
      try { await access(resolve(root, question.image)); }
      catch { warnings.push(`Local picture file not yet downloaded: ${question.image}`); }
    }
  }
}

for (const game of games) {
  if (!game.rounds.length) errors.push(`Game has no rounds: ${game.id}`);
  for (const round of game.rounds) {
    if (!round.question || !round.explanation || !round.answers.includes(round.correctAnswer)) errors.push(`Invalid game round: ${game.id}/${round.id}`);
  }
}

const quizHtml = await readFile(resolve(root, "quiz.html"), "utf8");
const playersHtml = await readFile(resolve(root, "players.html"), "utf8");
const communityHtml = await readFile(resolve(root, "community.html"), "utf8");
const homeHtml = await readFile(resolve(root, "index.html"), "utf8");
const playerController = await readFile(resolve(root, "js/modules/playerController.js"), "utf8");
const baseCss = await readFile(resolve(root, "css/base.css"), "utf8");
const sitePages = await Promise.all(["index.html", "quiz.html", "learn.html", "players.html", "community.html", "about.html"].map(page => readFile(resolve(root, page), "utf8")));
for (const [index, html] of sitePages.entries()) {
  const doctypeCount = (html.match(/<!doctype\s+html\s*>/gi) || []).length;
  if (doctypeCount !== 1) errors.push(`${requiredPages[index]} must contain exactly one HTML doctype (found ${doctypeCount}).`);
}
const quizController = await readFile(resolve(root, "js/quiz/quiz-controller.js"), "utf8");
const mainJs = await readFile(resolve(root, "js/main.js"), "utf8");
if (!quizHtml.includes('data-select-activity="quiz"') || !quizHtml.includes('data-select-activity="games"')) errors.push("Guided Quiz/Games activity selection is missing.");
if (!quizHtml.includes('id="selectionGrid"') || !quizHtml.includes('id="playerEntryForm"')) errors.push("Category/game selection or player registration stage is missing.");
if (!quizHtml.includes('id="countdownNumber"')) errors.push("Pre-activity countdown screen is missing.");
if (!quizHtml.includes('id="quizLeaderboard"')) errors.push("Quiz page Top Winners preview is missing.");
if (sitePages.some(html => />\s*Top players\s*</i.test(html))) errors.push("An outdated Top Players navigation label remains.");
if (sitePages.some(html => html.includes("Profile photographs are loaded from the player image directory"))) errors.push("Internal player-photo development text remains in the UI.");
if (!playersHtml.includes('id="loadMoreWinners"') || !playersHtml.includes('Challenge Yourself – Play Now')) errors.push("Top Winners progressive loading or Quiz & Games CTA is missing.");
if (!playersHtml.includes('aria-label="Top twenty winners"')) errors.push("Top Winners leaderboard accessibility label is missing.");
if (!playerController.includes("INITIAL_WINNER_COUNT = 15")) errors.push("Top Winners page must initially display up to fifteen available records.");
if (!homeHtml.includes("Stay Updated About Our") || !homeHtml.includes('href="community.html"')) errors.push("Homepage competition announcement or community CTA is missing.");
if (!homeHtml.includes('class="button button-secondary"')) errors.push("Homepage feature-card CTA links are not styled as buttons.");
if (!baseCss.includes("aspect-ratio: 16 / 9")) errors.push("Community image must use a landscape aspect ratio.");
if (!communityHtml.includes('class="community-photo"') || !communityHtml.includes('src="assets/images/lux-christi-mark.svg"') || !communityHtml.includes('class="community-photo-stage"')) errors.push("Temporary Lux Christi community image or landscape stage is missing.");
if (sitePages.some(html => !html.includes('class="menu-icon"') || !html.includes('aria-label="Open navigation menu"'))) errors.push("Accessible mobile navigation toggle markup is missing from a page.");
if (!baseCss.includes("aspect-ratio: 16 / 9") || !baseCss.includes("object-fit: contain")) errors.push("Community logo must be contained within a landscape frame.");
if (quizHtml.includes("totalQuestionCount") || quizHtml.includes("questions in the banks") || quizHtml.includes("questions per attempt")) errors.push("Question-bank or attempt counts are exposed in the page markup.");
if (quizController.includes("questions</small>") || quizController.includes("rounds in this demo")) errors.push("Question or game-round counts are exposed in selection UI.");
if (!quizController.includes("calculateQuestionScore") || !quizController.includes("startQuestionTimer")) errors.push("Shared timer or speed-scoring logic is missing.");
if (!mainJs.includes('document.querySelector("#activityStep")')) errors.push("Main entry point does not initialize the guided Quiz & Games flow.");

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`FAIL: ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: project pages, content banks, game modules and guided activity flow validation.");

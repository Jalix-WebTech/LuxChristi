import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { questionBanks } from "../js/question-banks/index.js";
import { games } from "../js/games/index.js";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const errors = [];
const warnings = [];
const requiredPages = ["index.html", "quiz.html", "learn.html", "events.html", "event.html", "players.html", "community.html", "about.html"];
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
  }
}

for (const game of games) {
  if (!game.rounds.length) errors.push(`Game has no rounds: ${game.id}`);
  for (const round of game.rounds) {
    if (!round.question || !round.explanation || !round.answers.includes(round.correctAnswer)) errors.push(`Invalid game round: ${game.id}/${round.id}`);
  }
}

const quizHtml = await readFile(resolve(root, "quiz.html"), "utf8");
const learnHtml = await readFile(resolve(root, "learn.html"), "utf8");
const learningController = await readFile(resolve(root, "js/modules/learningController.js"), "utf8");
const learningData = await readFile(resolve(root, "js/data/learningResources.js"), "utf8");
const localLessons = await readFile(resolve(root, "js/data/localLessons.js"), "utf8");
const curriculumCatalog = await readFile(resolve(root, "js/data/curriculumCatalog.js"), "utf8");
const curriculumRepository = await readFile(resolve(root, "js/services/curriculumRepository.js"), "utf8");
const curriculumController = await readFile(resolve(root, "js/modules/curriculumBrowserController.js"), "utf8");
const serviceWorker = await readFile(resolve(root, "service-worker.js"), "utf8");
const playersHtml = await readFile(resolve(root, "players.html"), "utf8");
const communityHtml = await readFile(resolve(root, "community.html"), "utf8");
const homeHtml = await readFile(resolve(root, "index.html"), "utf8");
const aboutHtml = await readFile(resolve(root, "about.html"), "utf8");
const siteController = await readFile(resolve(root, "js/modules/siteController.js"), "utf8");
if (!aboutHtml.includes("Send feedback on WhatsApp") || !siteController.includes('const whatsappNumber = "2348155141240"') || !siteController.includes("https://wa.me/${whatsappNumber}?text=") || siteController.includes("mailto:jamefelix1262002@gmail.com?subject=")) errors.push("Feedback form must prepare a WhatsApp message for the configured contact number.");
const playerController = await readFile(resolve(root, "js/modules/playerController.js"), "utf8");
const baseCss = await readFile(resolve(root, "css/base.css"), "utf8");
const sitePages = await Promise.all(["index.html", "quiz.html", "learn.html", "events.html", "event.html", "players.html", "community.html", "about.html"].map(page => readFile(resolve(root, page), "utf8")));
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
if (!homeHtml.includes("Events &amp; Competitions") || !homeHtml.includes('href="events.html"')) errors.push("Homepage Events & Competitions CTA is missing.");
if (!homeHtml.includes('class="button button-secondary"')) errors.push("Homepage feature-card CTA links are not styled as buttons.");
if (!baseCss.includes("aspect-ratio: 16 / 9")) errors.push("Community image must use a landscape aspect ratio.");
if (!communityHtml.includes('class="community-photo"') || !communityHtml.includes('src="assets/images/lux-christi-mark.svg"') || !communityHtml.includes('class="community-photo-stage"')) errors.push("Temporary Lux Christi community image or landscape stage is missing.");
if (sitePages.some(html => !html.includes('class="menu-icon"') || !html.includes('aria-label="Open navigation menu"'))) errors.push("Accessible mobile navigation toggle markup is missing from a page.");
if (!baseCss.includes("aspect-ratio: 16 / 9") || !baseCss.includes("object-fit: contain")) errors.push("Community logo must be contained within a landscape frame.");
if (quizHtml.includes("totalQuestionCount") || quizHtml.includes("questions in the banks") || quizHtml.includes("questions per attempt")) errors.push("Question-bank or attempt counts are exposed in the page markup.");
if (quizController.includes("questions</small>") || quizController.includes("rounds in this demo")) errors.push("Question or game-round counts are exposed in selection UI.");
if (!quizController.includes("calculateQuestionScore") || !quizController.includes("startQuestionTimer")) errors.push("Shared timer or speed-scoring logic is missing.");
if (!mainJs.includes('document.querySelector("#activityStep")')) errors.push("Main entry point does not initialize the guided Quiz & Games flow.");
if (!learnHtml.includes('id="learningResourceGrid"') || !learnHtml.includes('id="resourceSearch"')) errors.push("Learning Centre search or resource grid is missing.");
if (!learningController.includes("localStorage") || !learningController.includes("data-save-resource")) errors.push("Learning Centre local bookmark functionality is missing.");
if (!learningData.includes("export const learningResources")) errors.push("Learning resource catalogue is missing.");
if (!/lux-christi-shell-v\d+/.test(serviceWorker) || !serviceWorker.includes("lux-christi-shell-v14") || !serviceWorker.includes("./js/modules/learningController.js") || !serviceWorker.includes("./js/modules/curriculumBrowserController.js") || !serviceWorker.includes("./js/data/curriculumCatalog.js") || !serviceWorker.includes("./js/services/curriculumRepository.js") || !serviceWorker.includes("./js/data/learningResources.js") || !serviceWorker.includes("./js/data/localLessons.js")) errors.push("Catholic Learning Centre modules and lessons are not included in the updated PWA application shell.");
if (!learnHtml.includes("id=\"localLessonGrid\"") || !learnHtml.includes("id=\"lessonReader\"")) errors.push("Locally hosted lesson library or reader is missing.");
if (!localLessons.includes("export const localLessons")) errors.push("Locally hosted lesson data is missing.");
if (!learnHtml.includes("id=\"curriculumNavigation\"") || !learnHtml.includes("id=\"curriculumBreadcrumbs\"")) errors.push("Curriculum navigation or breadcrumb interface is missing.");
if (curriculumCatalog.includes("General Education") || curriculumCatalog.includes("Primary") || curriculumCatalog.includes("Mathematics")) errors.push("General Education content must be excluded from the active Catholic curriculum catalogue.");
if (!curriculumCatalog.includes("Sacred Scripture") || !curriculumCatalog.includes("Prayer & Spiritual Life")) errors.push("Published Catholic learning areas are missing from the curriculum catalogue.");
if (!curriculumRepository.includes("getLessonsForTopic") || !curriculumController.includes("initCurriculumBrowser")) errors.push("Catholic learning repository or browser controller is missing.");
if (serviceWorker.includes("primary-4-mathematics") || serviceWorker.includes("primaryMathUnitController") || serviceWorker.includes("primary4MathWholeNumbers")) errors.push("General Education pilot assets must not be precached by the Catholic-only PWA.");
for (const excludedPath of ["primary-4-mathematics.html", "js/modules/primaryMathUnitController.js", "js/data/primary4MathWholeNumbers.js"]) {
  try { await access(resolve(root, excludedPath)); errors.push(`Excluded General Education artifact still exists: ${excludedPath}`); } catch {}
}


const eventsHtml = await readFile(resolve(root, "events.html"), "utf8");
const eventDetailsHtml = await readFile(resolve(root, "event.html"), "utf8");
const eventData = await readFile(resolve(root, "js/data/events.js"), "utf8");
const eventService = await readFile(resolve(root, "js/services/eventService.js"), "utf8");
const eventsController = await readFile(resolve(root, "js/modules/eventsController.js"), "utf8");
const eventDetailsController = await readFile(resolve(root, "js/modules/eventDetailsController.js"), "utf8");
if (!eventsHtml.includes('id="featuredEvent"') || !eventsHtml.includes('id="upcomingEvents"') || !eventsHtml.includes('id="eventCategories"') || !eventsHtml.includes('id="pastEvents"')) errors.push("Events page is missing one or more required content areas.");
if (!eventDetailsHtml.includes('id="eventDetails"')) errors.push("Reusable event details page root is missing.");
if (!eventData.includes("export const events = []")) errors.push("The initial public event catalogue must not publish unapproved sample events.");
if (!eventService.includes("EVENT_STATUSES") || !eventService.includes("getPublicEvents") || !eventService.includes("getEventAction")) errors.push("Event status and visibility service is incomplete.");
if (!eventsController.includes("getFeaturedEvent") || !eventDetailsController.includes("getEventById")) errors.push("Events listing or event details controller is missing.");
if (!serviceWorker.includes("./events.html") || !serviceWorker.includes("./event.html") || !serviceWorker.includes("./js/modules/eventsController.js")) errors.push("Events pages and modules are not included in the PWA shell.");
if (sitePages.some(html => !html.includes('href="events.html"'))) errors.push("Events navigation link is missing from one or more site pages.");

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`FAIL: ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: project pages, content banks, game modules and guided activity flow validation.");

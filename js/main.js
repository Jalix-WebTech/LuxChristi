import { initSite } from "./modules/siteController.js";
import { initPlayers } from "./modules/playerController.js";
import { initPWA } from "./modules/pwaController.js";

/** Run only the controllers needed by the current page. */
async function safelyInitialize(name, initialize) {
  try { await initialize(); }
  catch (error) {
    console.error(`Lux Christi: ${name} could not be initialized.`, error);
    const notice = document.createElement("p");
    notice.className = "application-error";
    notice.setAttribute("role", "alert");
    notice.textContent = `Sorry, ${name} could not load. Please refresh the page.`;
    document.querySelector("main")?.prepend(notice);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await safelyInitialize("site navigation and theme", initSite);
  await safelyInitialize("Top Winners", initPlayers);
  await safelyInitialize("PWA support", async () => initPWA());

  // Load learning-library behaviour only on the Learning Centre page.
  if (document.querySelector("#learningResourceGrid")) {
    await safelyInitialize("Learning Centre", async () => {
      const { initLearningCentre } = await import("./modules/learningController.js");
      initLearningCentre();
    });
  }


  // Load the larger quiz and game modules only on the unified activities page.

  // Load the Events experience only on its own pages.
  if (document.querySelector("#featuredEvent")) {
    await safelyInitialize("Events & Competitions", async () => {
      const { initEventsPage } = await import("./modules/eventsController.js");
      initEventsPage();
    });
  }
  if (document.querySelector("#eventDetails")) {
    await safelyInitialize("event details", async () => {
      const { initEventDetailsPage } = await import("./modules/eventDetailsController.js");
      initEventDetailsPage();
    });
  }

  if (document.querySelector("#activityStep")) {
    await safelyInitialize("quiz platform", async () => {
      const { initQuizPlatform } = await import("./quiz/quiz-controller.js");
      initQuizPlatform();
    });
  }
});

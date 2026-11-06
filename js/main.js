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

  // Load the larger quiz and game modules only on the unified activities page.
  if (document.querySelector("#activityStep")) {
    await safelyInitialize("quiz platform", async () => {
      const { initQuizPlatform } = await import("./quiz/quiz-controller.js");
      initQuizPlatform();
    });
  }
});

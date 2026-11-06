/** Progressive Web App setup: service worker registration and install guidance. */
export function initPWA() {
  registerServiceWorker();
  setupInstallPrompt();
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  // Service workers require HTTPS, except on localhost during development.
  if (!window.isSecureContext) return;

  try {
    const registration = await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });
    watchForUpdates(registration);
  } catch (error) {
    console.warn("Lux Christi: offline support could not be registered.", error);
  }
}

function watchForUpdates(registration) {
  registration.addEventListener("updatefound", () => {
    const installingWorker = registration.installing;
    if (!installingWorker) return;
    installingWorker.addEventListener("statechange", () => {
      if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
        showUpdateNotice();
      }
    });
  });
}

function showUpdateNotice() {
  if (document.querySelector("[data-pwa-update]") || !document.body) return;
  const notice = document.createElement("aside");
  notice.className = "pwa-notice";
  notice.dataset.pwaUpdate = "true";
  notice.setAttribute("role", "status");
  notice.innerHTML = '<span>A new Lux Christi update is ready.</span><button type="button">Refresh</button>';
  notice.querySelector("button").addEventListener("click", () => window.location.reload());
  document.body.append(notice);
}

function setupInstallPrompt() {
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showInstallButton(async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      document.querySelector("[data-pwa-install]")?.remove();
    });
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    document.querySelector("[data-pwa-install]")?.remove();
  });
}

function showInstallButton(onInstall) {
  if (document.querySelector("[data-pwa-install]") || !document.body) return;
  const notice = document.createElement("aside");
  notice.className = "pwa-notice";
  notice.dataset.pwaInstall = "true";
  notice.innerHTML = '<span>Install Lux Christi for easier access.</span><button type="button">Install app</button><button type="button" class="pwa-dismiss" aria-label="Dismiss install prompt">×</button>';
  notice.querySelector("button:not(.pwa-dismiss)").addEventListener("click", onInstall);
  notice.querySelector(".pwa-dismiss").addEventListener("click", () => notice.remove());
  document.body.append(notice);
}

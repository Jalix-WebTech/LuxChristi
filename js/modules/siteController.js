/** Shared behaviour used by every Lux Christi page. */
export function initSite() {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Restore the user's saved theme, falling back safely if storage is unavailable.
  const themeButton = $("#themeToggle");
  const applyTheme = theme => {
    document.documentElement.dataset.theme = theme;
    if (themeButton) {
      const isDark = theme === "dark";
      themeButton.textContent = isDark ? "☀" : "☾";
      themeButton.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.title = isDark ? "Switch to light theme" : "Switch to dark theme";
    }
  };

  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("lux-theme") || "light"; } catch (error) {
    console.warn("Theme preference could not be read from local storage.", error);
  }
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  themeButton?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try { localStorage.setItem("lux-theme", nextTheme); } catch (error) {
      console.warn("Theme preference could not be saved.", error);
    }
  });

  // Mark the link matching the current document, including direct page visits.
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const nav = $("#mainNav");
  nav?.querySelectorAll("a[href]").forEach(link => {
    const targetPage = link.getAttribute("href").split("#")[0];
    const isCurrent = (targetPage || "index.html") === currentPage;
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  // A compact dropdown menu is used on mobile; it does not cover the full page,
  // so background scrolling remains available. `inert` keeps closed links out
  // of the keyboard tab order while the menu is hidden.
  const menuButton = $("#menuToggle");
  const menuIcon = $(".menu-icon", menuButton || document);
  const mobileMenuQuery = window.matchMedia("(max-width: 700px)");

  const setMenuOpen = isOpen => {
    if (!nav || !menuButton) return;
    nav.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    if (menuIcon) menuIcon.textContent = isOpen ? "✕" : "☰";
    // Desktop navigation is always visible and must never be made inert.
    nav.inert = mobileMenuQuery.matches && !isOpen;
  };

  const closeMenu = ({ returnFocus = false } = {}) => {
    if (!nav || !menuButton) return;
    const wasOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuOpen(false);
    if (returnFocus && wasOpen) menuButton.focus();
  };

  if (nav && menuButton) {
    // Set the initial state correctly for the current viewport.
    setMenuOpen(false);

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    // Choosing a destination closes the menu as navigation begins.
    nav.querySelectorAll("a[href]").forEach(link => {
      link.addEventListener("click", () => closeMenu());
    });

    // Clicking anywhere outside both the menu and its toggle dismisses it.
    document.addEventListener("click", event => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      if (isOpen && !nav.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
      }
    });

    // Escape closes the menu and returns keyboard focus to the toggle.
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu({ returnFocus: true });
      }
    });

    // Do not leave a dropdown open while the visitor scrolls the page.
    window.addEventListener("scroll", () => {
      if (mobileMenuQuery.matches && menuButton.getAttribute("aria-expanded") === "true") closeMenu();
    }, { passive: true });

    // If the viewport changes to desktop, restore the normal desktop nav state.
    const handleViewportChange = () => closeMenu();
    if (typeof mobileMenuQuery.addEventListener === "function") {
      mobileMenuQuery.addEventListener("change", handleViewportChange);
    } else {
      // Compatibility fallback for older Safari versions.
      mobileMenuQuery.addListener(handleViewportChange);
    }
  }

  const feedbackForm = $("#feedbackForm");
  feedbackForm?.addEventListener("submit", event => {
    event.preventDefault();
    if (!feedbackForm.reportValidity()) return;
    const data = new FormData(feedbackForm);
    const subject = encodeURIComponent(String(data.get("subject") || "Lux Christi feedback"));
    const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`);
    const note = $("#formNote");
    if (note) note.textContent = "Opening your email application. Review and send the message there.";
    // Replace this demo address with the project's official contact address before launch.
    window.location.href = `mailto:hello@luxchristi.example?subject=${subject}&body=${body}`;
  });
}

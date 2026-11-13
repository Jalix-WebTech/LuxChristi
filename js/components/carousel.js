/** Accessible horizontal carousel controls shared by homepage discovery rails. */
export function initCarousels(root = document) {
  root.querySelectorAll("[data-carousel]").forEach(carousel => {
    if (carousel.dataset.carouselReady === "true") return;
    const track = carousel.querySelector("[data-carousel-track]");
    const previous = carousel.querySelector('[data-carousel-direction="previous"]');
    const next = carousel.querySelector('[data-carousel-direction="next"]');
    if (!track) return;
    carousel.dataset.carouselReady = "true";

    const update = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);
      if (previous) previous.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= maxScroll;
      carousel.classList.toggle("carousel-overflowing", maxScroll > 2);
    };
    const move = direction => {
      const firstCard = track.querySelector("[data-carousel-card]");
      const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
      const distance = firstCard ? firstCard.getBoundingClientRect().width + gap : track.clientWidth * .8;
      track.scrollBy({ left: direction * distance, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    previous?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));
    track.addEventListener("keydown", event => {
      if (event.target !== track) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "Home") { event.preventDefault(); track.scrollTo({ left: 0, behavior: "auto" }); }
      if (event.key === "End") { event.preventDefault(); track.scrollTo({ left: track.scrollWidth, behavior: "auto" }); }
    });
    track.addEventListener("scroll", update, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(update).observe(track);
    else window.addEventListener("resize", update, { passive: true });
    update();
  });
}

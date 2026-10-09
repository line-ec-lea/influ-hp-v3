import { gsap } from "gsap";

export function playHeroEntrance(hero: HTMLElement, intro: HTMLElement | null) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Deep links and restored scroll positions should take visitors straight to content.
  if (reducedMotion.matches || (location.hash && location.hash !== "#hero") || window.scrollY > 0 || intro?.hidden) {
    if (intro) {
      intro.hidden = true;
      delete intro.dataset.introPending;
    }
    return;
  }
  if (intro) delete intro.dataset.introPending;

  const finish = () => {
    context.revert();
    if (intro) intro.hidden = true;
    document.removeEventListener("focusin", finish);
    window.removeEventListener("pagehide", finish);
    reducedMotion.removeEventListener("change", onPreferenceChange);
  };
  const onPreferenceChange = () => { if (reducedMotion.matches) finish(); };
  const context = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
    if (intro) {
      timeline
        .fromTo(intro.querySelector("[data-intro-content]"), { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.9 }, 0)
        .fromTo(intro.querySelector("[data-glow]"), { opacity: 0 }, { opacity: 1, duration: 0.55, repeat: 1, yoyo: true }, 0.3)
        .from(intro.querySelector("[data-logo-reveal]"), { clipPath: "inset(0 100% 0 0)", duration: 0.68 }, 0.22)
        .fromTo(intro.querySelector("[data-intro-line]"), { opacity: 0, scaleX: 0 }, { opacity: 0.55, scaleX: 1, duration: 0.42 }, 0.08)
        .fromTo(intro.querySelector("[data-caption]"), { opacity: 0 }, { opacity: 0.42, duration: 0.5 }, 1)
        .to(intro, { opacity: 0, scale: 0.99, duration: 0.3, onComplete: () => { intro.hidden = true; } }, "+=0.7");
    }
    // Both hero animations follow the actual end of the intro, not a duplicate timer.
    timeline.addLabel("hero")
      .from(hero.querySelectorAll("[data-hero-reveal]"), { opacity: 0, y: 16, duration: 0.7, stagger: 0.1 }, "hero");
    if (hero.dataset.video !== "true") {
      timeline.from(hero.querySelector("[data-hero-still]"), { scale: 1.035, duration: 1.8 }, "hero");
    }
  });
  document.addEventListener("focusin", finish);
  window.addEventListener("pagehide", finish);
  reducedMotion.addEventListener("change", onPreferenceChange);
}

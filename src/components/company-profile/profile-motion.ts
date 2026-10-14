import { animate, scroll, ease } from "@shared/motion";
import { clamp } from "./motion-frames.mjs";

type Cleanup = () => void;
type Scope = {
  desktop: boolean;
  add: (cleanup: Cleanup) => void;
  set: (element: HTMLElement | SVGElement, property: string, value: string) => void;
  flag: (element: HTMLElement, name: string) => void;
  reveal: (elements: Iterable<HTMLElement>, x?: number, y?: number, duration?: number, mask?: boolean) => void;
  progress: (target: HTMLElement, callback: (progress: number) => void, offset?: [string, string]) => void;
};

export function profileMotion(root: HTMLElement | null, setup: (scope: Scope) => void) {
  if (!root) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let cleanups: Cleanup[] = [];
  let resizeFrame = 0;
  const stop = () => { cleanups.splice(0).reverse().forEach(cleanup => cleanup()); };
  const mount = () => {
    stop();
    if (reduced.matches || !root.isConnected) return;
    const styles = new Map<HTMLElement | SVGElement, string | null>();
    const remember = (element: HTMLElement | SVGElement) => {
      if (!styles.has(element)) styles.set(element, element.getAttribute("style"));
    };
    const add = (cleanup: Cleanup) => cleanups.push(cleanup);
    add(() => styles.forEach((value, element) => value === null ? element.removeAttribute("style") : element.setAttribute("style", value)));
    const scope: Scope = {
      desktop: innerWidth >= 900,
      add,
      set(element, property, value) { remember(element); element.style.setProperty(property, value); },
      flag(element, name) {
        element.setAttribute(`data-${name}`, "");
        add(() => element.removeAttribute(`data-${name}`));
      },
      progress(target, callback, offset = ["start start", "end end"]) {
        add(scroll(progress => callback(clamp(progress)), { target, offset: offset as NonNullable<Parameters<typeof scroll>[1]>["offset"] }));
      },
      reveal(elements, x = 0, y = 36, duration = 1.1, mask = false) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => { if (entry.isIntersecting) show(entry.target as HTMLElement); });
        }, { rootMargin: "0px 0px -12% 0px" });
        const pending = new Set<HTMLElement>();
        const show = (element: HTMLElement) => {
          if (!pending.delete(element)) return;
          observer.unobserve(element);
          const animation = animate(element, mask ? {
            clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
          } : { opacity: [0, 1], x: [x, 0], y: [y, 0] }, { duration, ease, delay: Number(element.dataset.profileDelay || 0) });
          add(() => animation.cancel());
        };
        for (const element of elements) {
          if (element.getBoundingClientRect().bottom < 0) continue;
          remember(element);
          pending.add(element);
          if (mask) element.style.clipPath = "inset(100% 0% 0% 0%)";
          else element.style.opacity = "0";
          observer.observe(element);
        }
        const focus = (event: FocusEvent) => {
          for (const element of pending) if (element.contains(event.target as Node)) show(element);
        };
        root.addEventListener("focusin", focus);
        add(() => { observer.disconnect(); root.removeEventListener("focusin", focus); });
      },
    };
    try { setup(scope); } catch (error) { stop(); console.error("Company profile motion could not initialize", error); }
  };
  const refresh = () => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(mount); };
  window.addEventListener("resize", refresh, { passive: true });
  reduced.addEventListener("change", mount);
  window.addEventListener("pagehide", () => { cancelAnimationFrame(resizeFrame); stop(); });
  window.addEventListener("pageshow", event => { if (event.persisted) mount(); });
  document.fonts.ready.then(refresh);
  mount();
}

export function heroMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (!root) return;
    const headline = root.querySelector<HTMLElement>("[data-profile-headline]")!;
    const rule = root.querySelector<HTMLElement>("[data-profile-rule]")!;
    root.querySelectorAll<HTMLElement>("[data-profile-hero-line]").forEach(line => scope.reveal([line], 0, line.offsetHeight * 1.1, 1.4));
    scope.reveal(root.querySelectorAll<HTMLElement>("[data-profile-hero-top], [data-profile-lead], [data-profile-hero-foot]"), 0, 16, 1.2);
    scope.progress(root, progress => {
      scope.set(headline, "transform", `translateX(${-progress * (scope.desktop ? innerWidth * 0.05 : 20)}px)`);
      scope.set(rule, "transform", `translateX(${progress * (scope.desktop ? innerWidth * 0.22 : 40)}px)`);
      const film = root.querySelector<HTMLElement>("[data-profile-film]")!;
      scope.set(film, "transform", `scale(${1.02 + progress * 0.08})`);
    }, ["start start", "end start"]);
  });
}

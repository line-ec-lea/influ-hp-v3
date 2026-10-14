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

export function galleryMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (!root) return;
    const region = root.querySelector<HTMLElement>("[role=region]")!;
    const track = root.querySelector<HTMLElement>("[data-profile-gallery-track]")!;
    const panels = [...track.querySelectorAll<HTMLElement>("[data-profile-panel]")];
    const direction = root.matches("[data-profile-direction]");
    if (!scope.desktop || track.offsetHeight > innerHeight) {
      panels.forEach((panel, index) => scope.reveal([panel.querySelector<HTMLElement>("h3")!], index % 2 ? -36 : 36, 0, 1));
      scope.reveal(track.querySelectorAll<HTMLElement>("figure"), 0, 0, 1.3, true);
      return;
    }
    const width = innerWidth;
    const distance = Math.max(0, track.scrollWidth - region.clientWidth);
    if (!distance) return;
    const positions = panels.map(panel => panel.offsetLeft);
    const oldScrollLeft = region.scrollLeft;
    scope.add(() => { region.scrollLeft = oldScrollLeft; });
    scope.set(root, "--profile-scroll-height", `${innerHeight + distance}px`);
    scope.set(root, "--profile-viewport", `${innerHeight}px`);
    scope.flag(root, "motion-desktop");
    const bar = root.querySelector<HTMLElement>("[data-profile-gallery-progress]")!;
    let current = 0;
    scope.progress(root, progress => {
      current = progress * distance;
      region.scrollLeft = 0;
      scope.set(track, "transform", `translateX(${-current}px)`);
      scope.set(bar, "transform", `scaleX(${progress})`);
      const counter = root.querySelector<HTMLElement>("[data-profile-gallery-current]");
      if (counter) counter.textContent = String(Math.min(panels.length, 1 + Math.floor(progress * panels.length))).padStart(2, "0");
      panels.forEach((panel, index) => {
        const left = positions[index] - current;
        const entering = clamp((width * 0.95 - left) / (width * 0.35));
        const heading = panel.querySelector<HTMLElement>("h3")!;
        scope.set(heading, "opacity", `${entering}`);
        scope.set(heading, "transform", `translateX(${width * 0.06 * (1 - entering)}px)`);
        panel.querySelectorAll<HTMLElement>("figure").forEach((figure, imageIndex) => {
          const reveal = clamp((width * (direction ? [0.88, 0.62, 0.4][imageIndex] : 1) - left) / (width * (direction ? 0.26 : 0.65)));
          const hidden = 100 * (1 - reveal) * (direction ? 1 : 0.4);
          const inset = direction && imageIndex === 1 ? `${hidden}% 0% 0% 0%` : direction && imageIndex === 2 ? `0% ${hidden}% 0% 0%` : `0% 0% 0% ${hidden}%`;
          scope.set(figure, "clip-path", `inset(${inset})`);
          const drift = clamp((width - left) / (width + panel.offsetWidth));
          const image = figure.querySelector<HTMLImageElement>("img")!;
          scope.set(image, "transform", `scale(1.12) translateX(${7 - drift * 14}%)`);
        });
      });
    });
    const go = (distanceAlongTrack: number) => window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top + clamp(distanceAlongTrack, 0, distance), behavior: "instant" });
    const focus = (event: FocusEvent) => {
      const panel = (event.target as HTMLElement).closest<HTMLElement>("[data-profile-panel]");
      if (panel) go(panel.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft));
    };
    const key = (event: KeyboardEvent) => {
      if (event.target !== region || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const stops = [0, ...positions, distance];
      go(event.key === "ArrowRight" ? stops.find(stop => stop > current + 1) ?? distance : [...stops].reverse().find(stop => stop < current - 1) ?? 0);
    };
    region.addEventListener("focusin", focus);
    region.addEventListener("keydown", key);
    scope.add(() => { region.removeEventListener("focusin", focus); region.removeEventListener("keydown", key); });
  });
}

export function messageMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (!root) return;
    const wrapper = root.querySelector<HTMLElement>("[data-profile-message-pin]")!;
    const stage = root.querySelector<HTMLElement>("[data-profile-message-stage]")!;
    const cover = stage.querySelector<HTMLElement>("[data-profile-message-cover]")!;
    const head = stage.querySelector<HTMLElement>("[data-profile-message-head]")!;
    const foot = stage.querySelector<HTMLElement>("[data-profile-message-foot]")!;
    scope.flag(wrapper, "motion-active");
    scope.reveal(root.querySelectorAll<HTMLElement>("[data-profile-message-body] > p, [data-profile-message-body] > figure:last-child"));
    scope.reveal(root.querySelectorAll<HTMLElement>("[data-profile-message-body] > figure:first-of-type"), 0, 0, 1.6, true);
    if (scope.desktop && stage.offsetHeight <= innerHeight) {
      scope.set(wrapper, "--profile-scroll-height", `${innerHeight * 2.5}px`);
      scope.set(wrapper, "--profile-viewport", `${innerHeight}px`);
      scope.flag(wrapper, "motion-desktop");
      scope.progress(wrapper, progress => {
        const opening = clamp(progress / 0.5);
        scope.set(cover, "transform", `translate(${-opening * 100}%, ${-opening * 100}%)`);
        const heading = clamp((progress - 0.1) / 0.4);
        scope.set(head, "transform", `translateX(${-innerWidth * (0.18 * (1 - heading) + 0.025 * progress)}px)`);
        scope.set(head, "opacity", `${heading}`);
        const name = clamp((progress - 0.55) / 0.3);
        scope.set(foot, "transform", `translateY(${70 * (1 - name)}px)`);
        scope.set(foot, "opacity", `${name}`);
      });
      const focused = () => window.scrollTo({ top: scrollY + wrapper.getBoundingClientRect().top + innerHeight * 1.5, behavior: "instant" });
      foot.addEventListener("focusin", focused);
      scope.add(() => foot.removeEventListener("focusin", focused));
    } else {
      scope.reveal([head], -30, 0, 1);
      scope.reveal([foot], 0, 30, 1);
      scope.progress(stage, progress => scope.set(cover, "transform", `translate(${-progress * 100}%, ${-progress * 60}%)`), ["start 85%", "start 15%"]);
    }
  });
}

import { animateMini as animate } from "framer-motion/dom";
import { scroll, ease } from "@shared/motion";
import { clamp, careerFrame, messageFrame, dampMessageProgress } from "./motion-frames.mjs";

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
  const revealed = new WeakSet<HTMLElement>();
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
          revealed.add(element);
          const animation = animate(element, mask ? {
            clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
          } : { opacity: [0, 1], transform: [`translate(${x}px, ${y}px)`, "translate(0px, 0px)"] }, { duration, ease, delay: Number(element.dataset.profileDelay || 0) });
          add(() => animation.cancel());
        };
        for (const element of elements) {
          if (revealed.has(element) || element.getBoundingClientRect().bottom < 0) continue;
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
        add(() => { observer.disconnect(); pending.clear(); root.removeEventListener("focusin", focus); });
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
    root.querySelectorAll<HTMLElement>("[data-profile-hero-line]").forEach(line => scope.reveal([line], 0, line.offsetHeight * 0.45, 0.85));
    scope.reveal(root.querySelectorAll<HTMLElement>("[data-profile-lead], [data-profile-cta]"), 0, 12, 0.7);
    scope.progress(root, progress => {
      const film = root.querySelector<HTMLElement>("[data-profile-film]")!;
      scope.set(film, "transform", `scale(${1.02 + progress * 0.04})`);
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
    const bar = root.querySelector<HTMLElement>("[data-profile-gallery-progress]");
    let current = 0;
    scope.progress(root, progress => {
      current = progress * distance;
      region.scrollLeft = 0;
      scope.set(track, "transform", `translateX(${-current}px)`);
      if (bar) scope.set(bar, "transform", `scaleX(${progress})`);
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
    const head = stage.querySelector<HTMLElement>("[data-profile-message-head]")!;
    const panels = [...root.querySelectorAll<HTMLElement>("[data-profile-message-panel]")];
    if (scope.desktop) {
      scope.set(wrapper, "--profile-viewport", `${innerHeight}px`);
      scope.flag(wrapper, "motion-desktop");
      // Keep stacked content when the viewport cannot fit the longest paragraph.
      const style = getComputedStyle(stage);
      const required = head.scrollHeight + Math.max(...panels.map(panel => panel.offsetHeight))
        + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.rowGap);
      if (required > innerHeight) wrapper.removeAttribute("data-motion-desktop");
    }
    if (wrapper.hasAttribute("data-motion-desktop")) {
      scope.set(wrapper, "--profile-scroll-height", `${innerHeight * (1 + (panels.length - 1) * 0.85 + 0.3)}px`);
      const distance = clamp(stage.clientWidth * 0.06, 48, 80);
      const paint = (progress: number) => {
        const frame = messageFrame(progress, panels.length);
        panels.forEach((panel, index) => {
          const current = index === frame.index;
          const next = index === frame.next && !current;
          const opacity = current ? 1 - frame.exit : next ? frame.entrance : 0;
          const x = current ? -frame.exit : next ? 1 - frame.entrance : 1;
          scope.set(panel, "opacity", `${opacity}`);
          scope.set(panel, "transform", `translateX(${x * distance}px)`);
          scope.set(panel, "pointer-events", opacity > 0.5 ? "auto" : "none");
        });
      };
      let current = 0;
      let initialized = false;
      let target = 0;
      let animationFrame = 0;
      let previousTime = 0;
      const tick = (time: number) => {
        current = dampMessageProgress(current, target, time - previousTime);
        previousTime = time;
        if (Math.abs(target - current) < 0.0001) current = target;
        paint(current);
        animationFrame = current === target ? 0 : requestAnimationFrame(tick);
      };
      scope.progress(wrapper, progress => {
        target = progress;
        if (!initialized) { current = target; paint(current); initialized = true; }
        else if (!animationFrame) {
          previousTime = performance.now();
          animationFrame = requestAnimationFrame(tick);
        }
      });
      scope.add(() => cancelAnimationFrame(animationFrame));
    } else {
      scope.reveal([head], 0, 20, 0.8);
      scope.reveal(panels, 0, 24, 0.8);
    }
  });
}

export function careerMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (!root) return;
    const intro = root.querySelector<HTMLElement>("[data-profile-career-intro]")!;
    const nodes = [...root.querySelectorAll<HTMLElement>("[data-profile-career-node]")];
    if (!scope.desktop || innerHeight < 600) {
      scope.reveal([intro], 0, 30, 1);
      nodes.forEach((node, index) => scope.reveal([node], index % 2 ? -28 : 28, 0, 1));
      scope.reveal(nodes.map(node => node.querySelector<HTMLElement>("figure")!), 0, 0, 1.3, true);
      return;
    }
    const canvas = root.querySelector<HTMLElement>("[data-profile-career-canvas]")!;
    const svg = root.querySelector<SVGSVGElement>("[data-profile-career-path]")!;
    const base = svg.querySelector<SVGPathElement>("[data-profile-path-base]")!;
    const path = svg.querySelector<SVGPathElement>("[data-profile-path-progress]")!;
    const background = root.querySelector<HTMLElement>("[data-profile-career-visual]")!;
    scope.set(root, "--profile-scroll-height", `${innerHeight * (1 + nodes.length * 0.9)}px`);
    scope.set(root, "--profile-viewport", `${innerHeight}px`);
    scope.flag(root, "motion-desktop");
    if (Math.max(intro.scrollHeight, ...nodes.map(node => node.scrollHeight)) > innerHeight * 0.76) {
      root.removeAttribute("data-motion-desktop");
      scope.reveal([intro], 0, 24, 0.8);
      scope.reveal(nodes, 0, 24, 0.8);
      return;
    }
    const allNodes = [intro, ...nodes];
    const canvasRect = canvas.getBoundingClientRect();
    const points = allNodes.map(node => {
      const dot = node.querySelector<HTMLElement>("[data-profile-career-dot]")!.getBoundingClientRect();
      return { x: dot.left - canvasRect.left + dot.width / 2, y: dot.top - canvasRect.top + dot.height / 2 };
    });
    const lengths = [0];
    points.slice(1).forEach((point, index) => lengths.push(lengths[index] + Math.hypot(point.x - points[index].x, point.y - points[index].y)));
    const total = lengths[lengths.length - 1];
    const d = points.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join(" ");
    svg.setAttribute("width", String(canvas.offsetWidth));
    svg.setAttribute("height", String(canvas.offsetHeight));
    base.setAttribute("d", d);
    path.setAttribute("d", d);
    scope.set(path, "stroke-dasharray", String(total));
    const cameras = points.map((point, index) => index ? { x: innerWidth * 0.09 - point.x, y: innerHeight * 0.23 - point.y } : { x: 0, y: -innerHeight * 0.07 });
    const thumb = intro.querySelector<HTMLElement>("[data-profile-career-thumb]")!;
    scope.progress(root, progress => {
      const frame = careerFrame(progress, nodes.length);
      const from = cameras[frame.from], to = cameras[frame.to];
      const x = from.x + (to.x - from.x) * frame.travel - innerWidth * 0.3 * frame.exit;
      const y = from.y + (to.y - from.y) * frame.travel - innerHeight * 0.36 * frame.exit;
      scope.set(canvas, "transform", `translate(${x}px, ${y}px)`);
      scope.set(canvas, "opacity", `${1 - 0.88 * frame.exit}`);
      scope.set(background, "opacity", `${1 - frame.exit}`);
      scope.set(path, "stroke-dashoffset", String(total - lengths[frame.from] - (lengths[frame.to] - lengths[frame.from]) * frame.travel));
      nodes.forEach((node, index) => {
        const color = frame.active === index + 1 ? "#c89a5b" : "rgba(244,247,242,0.52)";
        scope.set(node.querySelector<HTMLElement>("p")!, "color", color);
        scope.set(node.querySelector<HTMLElement>("[data-profile-career-dot]")!, "background-color", color);
      });
      const leaving = frame.to === 0 ? 0 : frame.to === 1 ? frame.travel : 1;
      scope.set(thumb, "transform", `translate(${-innerWidth * 0.14 * leaving}px, ${-innerHeight * 0.16 * leaving}px) rotate(${-3 - leaving * 3}deg)`);
      scope.set(thumb, "opacity", `${0.75 * (1 - leaving)}`);
    });
  });
}

export function experienceMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (!root) return;
    const head = root.querySelector<HTMLElement>("[data-profile-experience-head]")!;
    scope.reveal([head], 0, 20, 0.75);
    scope.reveal(root.querySelectorAll<HTMLElement>("article"), 0, 24, 0.85);
  });
}

export function supportMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (!root) return;
    const intro = root.querySelector<HTMLElement>("[data-profile-support-intro]")!;
    const list = root.querySelector<HTMLElement>("ol")!;
    if (scope.desktop && intro.offsetHeight + innerHeight * 0.14 <= innerHeight) scope.flag(root, "motion-desktop");
    list.querySelectorAll<HTMLElement>("li").forEach(item => scope.progress(item, progress => {
      scope.set(item, "transform", `translateY(${(scope.desktop ? 120 : 50) * (1 - progress)}px)`);
      scope.set(item, "opacity", `${progress}`);
    }, ["start 96%", "start 58%"]));
    const bar = root.querySelector<HTMLElement>("[data-profile-support-progress]")!;
    const from = root.querySelector<HTMLElement>("[data-profile-support-from]")!;
    const to = root.querySelector<HTMLElement>("[data-profile-support-to]")!;
    scope.progress(list, progress => {
      scope.set(bar, "transform", `scaleY(${progress})`);
      scope.set(from, "opacity", `${1 - progress * 0.65}`);
      scope.set(to, "opacity", `${0.35 + progress * 0.65}`);
    }, ["start 60%", "end 60%"]);
  });
}

export function mediaMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (root) scope.reveal(root.querySelectorAll<HTMLElement>("li"), 0, 0, 1.2);
  });
}

export function philosophyMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (!root) return;
    const head = root.querySelector<HTMLElement>("[data-profile-philosophy-head]")!;
    const words = [...root.querySelectorAll<HTMLElement>("[data-profile-philosophy-word]")];
    const articles = [...root.querySelectorAll<HTMLElement>("article")];
    scope.reveal([head], 0, 20, 0.8);
    scope.reveal(articles, 0, 24, 0.85);
    if (!scope.desktop || innerHeight < 600) return;
    scope.flag(root, "motion-desktop");
    if (head.scrollHeight + parseFloat(getComputedStyle(head).top) + 24 > innerHeight) {
      root.removeAttribute("data-motion-desktop");
      return;
    }
    scope.progress(root, () => {
      const active = articles.reduce((current, article, index) => article.getBoundingClientRect().top <= innerHeight * 0.5 ? index : current, 0);
      words.forEach((word, index) => scope.set(word, "color", index === active ? "#c89a5b" : "rgba(244,247,242,0.7)"));
    }, ["start end", "end start"]);
  });
}

export function informationMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (root) scope.reveal(root.querySelectorAll<HTMLElement>("dl > div"), 0, 12, 0.9);
  });
}

export function accessMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (root) scope.reveal(root.querySelectorAll<HTMLElement>("iframe, figure"), 0, 12, 0.9);
  });
}

export function contactMotion(root: HTMLElement | null) {
  profileMotion(root, scope => {
    if (!root) return;
    scope.reveal(root.querySelectorAll<HTMLElement>("p[aria-hidden]"), 0, 30, 1.4);
    scope.reveal(root.querySelectorAll<HTMLElement>("h2, a"), 0, 20, 1.1);
  });
}

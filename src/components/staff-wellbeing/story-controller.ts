type Scene = "box" | "ball" | "eat" | "toast";
type Layer = {
  key: Scene;
  element: HTMLElement;
  video: HTMLVideoElement;
  loaded: boolean;
  pending: boolean;
  blocked: boolean;
  failed: boolean;
  request: number;
};

export function mountStoryVideo(story: HTMLElement) {
  const stage = story.querySelector<HTMLElement>("[data-life-stage]")!;
  const footer = document.querySelector<HTMLElement>("[data-life-footer]");
  const status = story.querySelector<HTMLElement>("[data-life-video-status]")!;
  const progress = story.querySelector<HTMLElement>("[data-life-progress]")!;
  const chapterNumber = progress.querySelector<HTMLElement>("[data-life-progress-number]")!;
  const chapterName = progress.querySelector<HTMLElement>("[data-life-progress-name]")!;
  const toggle = story.querySelector<HTMLButtonElement>("[data-life-video-toggle]")!;
  const chapters = [["01", "身体の健康", "move"], ["02", "学びと気づき", "mind"], ["03", "人とのつながり", "eat"]] as const;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  const layers: Layer[] = Array.from(stage.querySelectorAll<HTMLElement>("[data-life-scene-layer]"), element => {
    const video = element.querySelector<HTMLVideoElement>("video")!;
    video.muted = video.defaultMuted = video.playsInline = true;
    return { key: element.dataset.lifeSceneLayer as Scene, element, video, loaded: false, pending: false, blocked: false, failed: false, request: 0 };
  });
  const anchors = {
    title: "[data-life-opening]", move: "#move", ball: "[data-life-move-body]",
    mind: "#mind", eat: "#eat", cl: "[data-life-closing]", end: "[data-life-story-end]",
  };
  const elements = Object.fromEntries(Object.entries(anchors).map(([key, selector]) => [key, story.querySelector<HTMLElement>(selector)!]));
  const hseq = elements.move;
  const pin = hseq.querySelector<HTMLElement>("[data-life-hseq-pin]")!;
  const track = hseq.querySelector<HTMLElement>("[data-life-hseq-track]")!;
  hseq.setAttribute("data-life-horizontal", "");
  let horizontalEnabled = false, horizontalTravel = 0;
  let ranges: Record<string, [number, number]> = {};
  let current: Scene = "box", shade = 0.86, inStory = false;
  let frame = 0, needsMeasure = true, suspended = false, disposed = false, paused = false;
  const fades = new Map<Scene, ReturnType<typeof setTimeout>>();
  const active = () => layers.find(layer => layer.key === current)!;
  const wantsPlayback = (layer: Layer) => layer.key === current && !paused && !preference.matches && !document.hidden && !suspended && !disposed && inStory && !layer.failed && !layer.blocked;

  function sync() {
    for (const layer of layers) {
      const video = layer.video;
      if (!wantsPlayback(layer)) {
        if (layer.pending || !video.paused) {
          layer.request++;
          layer.pending = false;
          video.pause();
        }
        continue;
      }
      if (!video.paused || layer.pending) continue;
      if (!layer.loaded) {
        layer.loaded = true;
        video.preload = "auto";
        video.load();
      }
      const request = ++layer.request;
      layer.pending = true;
      video.play().then(() => {
        if (!wantsPlayback(layer)) video.pause();
      }).catch(() => {
        if (request !== layer.request || !wantsPlayback(layer)) return;
        layer.blocked = true;
        video.removeAttribute("data-ready");
      }).finally(() => {
        if (request === layer.request) layer.pending = false;
        if (!disposed) renderStatus();
      });
    }
    renderStatus();
  }

  function renderStatus() {
    const layer = active();
    const message = layer.failed || layer.blocked ? "映像を再生できないため、静止画を表示しています。" : "";
    if (status.textContent !== message) status.textContent = message;
  }

  function settleLayers() {
    fades.forEach(clearTimeout);
    fades.clear();
    layers.forEach(layer => {
      layer.element.removeAttribute("data-diagonal");
      layer.element.toggleAttribute("data-on", layer.key === current);
      layer.element.toggleAttribute("data-top", layer.key === current);
    });
  }

  function setScene(key: Scene) {
    if (key === current) return;
    const outgoing = active();
    const forward = current === "box" || current === "ball";
    const returningToExercise = key === "box" || key === "ball";
    const diagonal = (forward && key === "eat") || (current === "eat" && returningToExercise);
    current = key;
    if (preference.matches) { settleLayers(); return; }
    const incoming = active();
    clearTimeout(fades.get(key));
    fades.delete(key);
    incoming.element.removeAttribute("data-diagonal");
    if (diagonal) {
      incoming.element.style.setProperty("transition", "none");
      incoming.element.setAttribute("data-diagonal", forward ? "b" : "a");
      void incoming.element.offsetWidth;
      incoming.element.style.removeProperty("transition");
    }
    layers.forEach(layer => layer.element.removeAttribute("data-top"));
    incoming.element.setAttribute("data-top", "");
    incoming.element.setAttribute("data-on", "");
    if (diagonal) {
      incoming.element.removeAttribute("data-diagonal");
      outgoing.element.setAttribute("data-diagonal", forward ? "a" : "b");
    }
    // Keep the outgoing poster/frame beneath the entire incoming 1s crossfade.
    clearTimeout(fades.get(outgoing.key));
    fades.set(outgoing.key, setTimeout(() => {
      if (current !== outgoing.key) outgoing.element.removeAttribute("data-on");
      fades.delete(outgoing.key);
      if (outgoing.element.hasAttribute("data-diagonal")) {
        fades.set(outgoing.key, setTimeout(() => {
          if (current !== outgoing.key) outgoing.element.removeAttribute("data-diagonal");
          fades.delete(outgoing.key);
        }, 1100));
      }
    }, 1050));
  }

  function measure() {
    ranges = Object.fromEntries(Object.entries(elements).map(([key, element]) => {
      const bounds = element.getBoundingClientRect();
      return [key, [bounds.top + scrollY, bounds.bottom + scrollY]];
    }));
    horizontalEnabled = !preference.matches && getComputedStyle(pin).position === "sticky";
    horizontalTravel = horizontalEnabled ? Math.max(0, track.scrollWidth - pin.clientWidth) : 0;
  }

  function update() {
    frame = 0;
    if (disposed) return;
    if (needsMeasure) { measure(); needsMeasure = false; }
    const H = innerHeight;
    const distance = ranges.move[1] - ranges.move[0] - H;
    const horizontalProgress = distance > 0 ? Math.min(1, Math.max(0, (scrollY - ranges.move[0]) / distance)) : 0;
    if (horizontalEnabled) track.style.setProperty("--hx", (-horizontalProgress * horizontalTravel).toFixed(1) + "px");
    else track.style.removeProperty("--hx");

    const y = scrollY + H * .5;
    const afterHero = scrollY >= ranges.title[1] - 1;
    stage.toggleAttribute("data-after-hero", afterHero);
    const showProgress = afterHero && y < ranges.cl[0];
    progress.toggleAttribute("data-visible", showProgress);
    if (showProgress) {
      const chapter = chapters.findLast(([, , anchor]) => y >= ranges[anchor][0]) ?? chapters[0];
      if (chapterNumber.textContent !== chapter[0]) chapterNumber.textContent = chapter[0];
      if (chapterName.textContent !== chapter[1]) chapterName.textContent = chapter[1];
      progress.style.setProperty("--pp", Math.min(1, Math.max(0, (y - ranges.move[0]) / (ranges.cl[0] - ranges.move[0]))).toFixed(4));
    }
    // Preserve the hero's original first two shade keyframes exactly.
    const heroEnd = Math.max(1, ranges.title[1] - H * .3);
    const fraction = Math.min(1, Math.max(0, y / heroEnd));
    shade = afterHero ? .08 : .08 + .12 * fraction * fraction * (3 - 2 * fraction);
    stage.style.setProperty("--life-shade", shade.toFixed(3));
    inStory = footer ? footer.getBoundingClientRect().bottom > 0 : scrollY < ranges.end[1];
    toggle.hidden = !afterHero || !inStory;
    const stopped = paused || preference.matches;
    toggle.disabled = preference.matches;
    toggle.setAttribute("aria-pressed", String(stopped));
    const label = preference.matches ? "静止画を表示" : paused ? "映像を再生 ▷" : "映像を止める Ⅱ";
    if (toggle.textContent !== label) toggle.textContent = label;

    let scene: Scene = (horizontalEnabled ? horizontalProgress > .5 : y >= ranges.ball[0]) ? "ball" : "box";
    if (y >= ranges.mind[0]) scene = "ball";
    if (y >= ranges.eat[0]) scene = "eat";
    if (y >= ranges.cl[0]) scene = "toast";
    setScene(scene);
    stage.dataset.lifeActiveScene = current;
    sync();
  }
  function schedule(remeasure = false) {
    if (disposed) return;
    needsMeasure ||= remeasure;
    if (!frame) frame = requestAnimationFrame(update);
  }

  layers.forEach(layer => {
    layer.video.addEventListener("playing", () => {
      if (wantsPlayback(layer)) layer.video.setAttribute("data-ready", "");
      else layer.video.pause();
    }, { signal: events.signal });
    layer.video.addEventListener("error", () => {
      layer.failed = true;
      layer.video.removeAttribute("data-ready");
      sync();
    }, { signal: events.signal });
    layer.video.addEventListener("canplay", sync, { signal: events.signal });
  });
  toggle.addEventListener("click", () => {
    paused = !paused;
    if (!paused) active().blocked = false;
    schedule();
  }, { signal: events.signal });
  preference.addEventListener("change", () => {
    settleLayers();
    if (preference.matches) {
      layers.forEach(layer => layer.video.removeAttribute("data-ready"));
    }
    schedule(true);
    sync();
  }, { signal: events.signal });
  document.addEventListener("visibilitychange", () => { sync(); if (!document.hidden) schedule(true); }, { signal: events.signal });
  window.addEventListener("scroll", () => schedule(), { passive: true, signal: events.signal });
  window.addEventListener("resize", () => schedule(true), { signal: events.signal });
  window.addEventListener("orientationchange", () => schedule(true), { signal: events.signal });
  window.addEventListener("load", () => schedule(true), { signal: events.signal });
  window.addEventListener("pagehide", () => { suspended = true; sync(); }, { signal: events.signal });
  window.addEventListener("pageshow", () => { suspended = false; schedule(true); }, { signal: events.signal });
  story.addEventListener("load", () => schedule(true), { capture: true, signal: events.signal });
  document.fonts.addEventListener("loadingdone", () => schedule(true), { signal: events.signal });
  const observer = new ResizeObserver(() => schedule(true));
  observer.observe(story);
  observer.observe(pin);
  observer.observe(track);
  observer.observe(document.documentElement);
  Object.values(elements).forEach(element => observer.observe(element));
  document.fonts.ready.then(() => schedule(true));
  update();

  return () => {
    disposed = true;
    events.abort();
    observer.disconnect();
    hseq.removeAttribute("data-life-horizontal");
    track.style.removeProperty("--hx");
    progress.removeAttribute("data-visible");
    progress.style.removeProperty("--pp");
    stage.removeAttribute("data-after-hero");
    toggle.hidden = true;
    layers.forEach(layer => layer.element.removeAttribute("data-diagonal"));
    cancelAnimationFrame(frame);
    fades.forEach(clearTimeout);
    layers.forEach(layer => { layer.request++; layer.video.pause(); });
  };
}


export function mountStoryReveals(story: HTMLElement) {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (typeof IntersectionObserver === "undefined" || preference.matches) return () => {};
  const targets = Array.from(story.querySelectorAll<HTMLElement>("[data-life-line], [data-life-fade]"));
  const pending = new Map(targets.map(target => [target, target]));
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) reveal(entry.target as HTMLElement);
  }, { threshold: .12 });
  function reveal(proxy: HTMLElement, instant = false) {
    const target = pending.get(proxy);
    if (!target) return;
    if (instant) target.setAttribute("data-life-instant", "");
    target.removeAttribute("data-life-pending");
    observer.unobserve(proxy);
    pending.delete(proxy);
  }
  function showAll() {
    // Disable transitions first, including any reveal currently in flight.
    story.removeAttribute("data-life-reveals");
    observer.disconnect();
    pending.clear();
    targets.forEach(target => {
      target.removeAttribute("data-life-pending");
      target.removeAttribute("data-life-instant");
    });
  }
  function onPreference() { if (preference.matches) showAll(); }
  function onFocus(event: FocusEvent) {
    for (const proxy of pending.keys()) if (proxy.contains(event.target as Node)) reveal(proxy, true);
  }
  targets.forEach(target => target.setAttribute("data-life-pending", ""));
  // Commit the starting styles before enabling transitions and observing entry.
  void story.offsetWidth;
  story.setAttribute("data-life-reveals", "");
  pending.forEach((_, proxy) => observer.observe(proxy));
  preference.addEventListener("change", onPreference);
  story.addEventListener("focusin", onFocus);
  return () => {
    showAll();
    preference.removeEventListener("change", onPreference);
    story.removeEventListener("focusin", onFocus);
  };
}

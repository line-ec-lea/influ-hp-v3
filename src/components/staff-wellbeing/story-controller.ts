type Scene = "box" | "eat" | "toast";
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
  const status = story.querySelector<HTMLElement>("[data-life-video-status]")!;
  const progress = story.querySelector<HTMLElement>("[data-life-progress]")!;
  const chapterNumber = progress.querySelector<HTMLElement>("[data-life-progress-number]")!;
  const chapterName = progress.querySelector<HTMLElement>("[data-life-progress-name]")!;
  const chapters = [["01", "身体を動かす", "move"], ["02", "食卓を囲む", "eat"], ["03", "日々の暮らし", "st"]] as const;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  const layers: Layer[] = Array.from(stage.querySelectorAll<HTMLElement>("[data-life-scene-layer]"), element => {
    const video = element.querySelector<HTMLVideoElement>("video")!;
    video.muted = video.defaultMuted = video.playsInline = true;
    return { key: element.dataset.lifeSceneLayer as Scene, element, video, loaded: false, pending: false, blocked: false, failed: false, request: 0 };
  });
  const anchors = {
    title: "[data-life-opening]", move: "#move", hseq: "[data-life-hseq]",
    b1: "#bridge-move-eat", eat: "#eat", efilm: "[data-life-eat-film]",
    elead: "[data-life-eat-lead]", b2: "#bridge-eat-life", st: "#stories",
    cl: "[data-life-closing]", end: "[data-life-story-end]",
  };
  const elements = Object.fromEntries(Object.entries(anchors).map(([key, selector]) => [key, story.querySelector<HTMLElement>(selector)!]));
  const hseq = elements.hseq;
  const pin = hseq.querySelector<HTMLElement>("[data-life-hseq-pin]")!;
  const track = hseq.querySelector<HTMLElement>("[data-life-hseq-track]")!;
  hseq.setAttribute("data-life-horizontal", "");
  const numerals = Array.from(story.querySelectorAll<HTMLElement>("[data-life-numeral]"));
  const crops = Array.from(story.querySelectorAll<HTMLImageElement>("[data-life-image-drift]"), image => {
    const [x, y] = getComputedStyle(image).objectPosition.split(" ");
    return { image, x, y: Number.parseFloat(y) };
  });
  let horizontalEnabled = false, horizontalTravel = 0;
  let ranges: Record<string, [number, number]> = {};
  let shades: [number, number][] = [];
  let scenes: [number, Scene][] = [];
  let current: Scene = "box", shade = 0.86, inStory = false;
  let frame = 0, needsMeasure = true, suspended = false, disposed = false;
  const fades = new Map<Scene, ReturnType<typeof setTimeout>>();
  const active = () => layers.find(layer => layer.key === current)!;
  const wantsPlayback = (layer: Layer) => layer.key === current && !preference.matches && !document.hidden && !suspended && !disposed && inStory && shade < 0.86 && !layer.failed && !layer.blocked;

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
    const diagonal = (current === "box" && key === "eat") || (current === "eat" && key === "box");
    const forward = current === "box";
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
    const H = innerHeight;
    // Measure the BBQ's layout box, never its previous translated box. This also
    // keeps the shade keyframe stable when images/fonts/viewport trigger measurement.
    elements.elead.style.removeProperty("transform");
    ranges = Object.fromEntries(Object.entries(elements).map(([key, element]) => {
      const bounds = element.getBoundingClientRect();
      return [key, [bounds.top + scrollY, bounds.bottom + scrollY]];
    }));
    horizontalEnabled = !preference.matches && getComputedStyle(pin).position === "sticky";
    horizontalTravel = horizontalEnabled ? Math.max(0, track.scrollWidth - pin.clientWidth) : 0;
    const R = ranges;
    // Exact reference keyframes: viewport-centre position and film shade.
    shades = [[0,.08],[R.title[1]-H*.3,.2],[R.move[0]+H*.35,.34],[R.hseq[0]+H*.4,.6],[R.hseq[1]-H*.4,.6],[R.move[1]-H*.6,.44],
      [R.b1[0]+H*.45,.14],[R.eat[0]+H*.3,.18],[R.efilm[1]-H*.35,.26],[R.elead[0]+H*.15,.86],[R.eat[1]-H*.5,.9],
      [R.b2[0]+H*.45,.16],[R.b2[1]-H*.1,.4],[R.st[0]+H*.5,.9],[R.st[1]-H*.5,.92],[R.cl[0]+H*.3,.44],[R.cl[1]-H*.25,.4],[R.end[1],1]];
    for (let i = 1; i < shades.length; i++) if (shades[i][0] <= shades[i-1][0]) shades[i][0] = shades[i-1][0] + 1;
    scenes = [[R.b1[0]+H*.15,"box"],[R.cl[0]-H*.1,"eat"],[Infinity,"toast"]];
  }

  function shadeAt(y: number) {
    if (y <= shades[0][0]) return shades[0][1];
    for (let i = 1; i < shades.length; i++) {
      const [x, value] = shades[i], [previousX, previousValue] = shades[i-1];
      if (y <= x) {
        const fraction = (y - previousX) / (x - previousX);
        const eased = fraction * fraction * (3 - 2 * fraction);
        return previousValue + (value - previousValue) * eased;
      }
    }
    return shades[shades.length-1][1];
  }

  function resetComposition() {
    elements.elead.style.removeProperty("transform");
    numerals.forEach(numeral => numeral.style.removeProperty("transform"));
    crops.forEach(({ image }) => image.style.removeProperty("object-position"));
  }

  function updateComposition() {
    if (preference.matches) { resetComposition(); return; }
    const H = innerHeight;
    const top = ranges.elead[0] - scrollY;
    const progress = Math.min(1, Math.max(0, (H - top) / (H * .75)));
    const remaining = Math.pow(1 - progress, 3);
    const mobile = innerWidth <= 720;
    const amount = mobile ? .4 : 1;
    if (progress >= 1) elements.elead.style.removeProperty("transform");
    else elements.elead.style.setProperty("transform", `translate3d(${(remaining * 12 * amount).toFixed(2)}vw,${(remaining * 18 * amount).toFixed(2)}vh,0)`);
    if (mobile) {
      numerals.forEach(numeral => numeral.style.removeProperty("transform"));
      crops.forEach(({ image }) => image.style.removeProperty("object-position"));
      return;
    }
    for (const numeral of numerals) {
      const bounds = numeral.parentElement!.getBoundingClientRect();
      if (bounds.bottom < -200 || bounds.top > H + 200) continue;
      numeral.style.setProperty("transform", `translate3d(0,${Math.max(-90, Math.min(90, bounds.top * .1)).toFixed(1)}px,0)`);
    }
    for (const { image, x, y } of crops) {
      const bounds = image.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > H) continue;
      const offset = (bounds.top + bounds.height / 2 - H / 2) / H;
      image.style.setProperty("object-position", `${x} ${Math.max(0, Math.min(100, y - offset * 7)).toFixed(1)}%`);
    }
  }

  function update() {
    frame = 0;
    if (disposed) return;
    if (needsMeasure) { measure(); needsMeasure = false; }
    if (horizontalEnabled) {
      const distance = ranges.hseq[1] - ranges.hseq[0] - innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, (scrollY - ranges.hseq[0]) / distance)) : 0;
      track.style.setProperty("--hx", (-progress * horizontalTravel).toFixed(1) + "px");
    } else track.style.removeProperty("--hx");
    updateComposition();
    const y = scrollY + innerHeight * .5;
    const showProgress = y >= ranges.move[0] && y < ranges.st[1] - innerHeight * .3;
    progress.toggleAttribute("data-visible", showProgress);
    if (showProgress) {
      const chapter = chapters.findLast(([, , anchor]) => y >= ranges[anchor][0])!;
      if (chapterNumber.textContent !== chapter[0]) chapterNumber.textContent = chapter[0];
      if (chapterName.textContent !== chapter[1]) chapterName.textContent = chapter[1];
      progress.style.setProperty("--pp", Math.min(1, Math.max(0, (y - ranges.move[0]) / (ranges.st[1] - ranges.move[0]))).toFixed(4));
    }
    // Fade the shared film darker across the overview between the opening and MOVE.
    const overview = Math.max(0, Math.min(1,
      (y - ranges.title[1]) / (innerHeight * .3),
      (ranges.move[0] - y) / (innerHeight * .3),
    ));
    shade = Math.max(shadeAt(y), .78 * overview * overview * (3 - 2 * overview));
    stage.style.setProperty("--life-shade", shade.toFixed(3));
    inStory = scrollY < ranges.end[1] - innerHeight * .2;
    setScene(scenes.find(([boundary]) => y < boundary)![1]);
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
  preference.addEventListener("change", () => {
    settleLayers();
    if (preference.matches) {
      layers.forEach(layer => layer.video.removeAttribute("data-ready"));
      resetComposition();
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
    resetComposition();
    progress.removeAttribute("data-visible");
    progress.style.removeProperty("--pp");
    layers.forEach(layer => layer.element.removeAttribute("data-diagonal"));
    cancelAnimationFrame(frame);
    fades.forEach(clearTimeout);
    layers.forEach(layer => { layer.request++; layer.video.pause(); });
  };
}


export function mountStoryReveals(story: HTMLElement) {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (typeof IntersectionObserver === "undefined" || preference.matches) return () => {};
  const targets = Array.from(story.querySelectorAll<HTMLElement>("[data-life-line], [data-life-reveal]"));
  // Observe the unmasked parent; a fully clipped image cannot intersect on its own.
  const pending = new Map(targets.map(target => [target.hasAttribute("data-life-reveal") ? target.parentElement! : target, target]));
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

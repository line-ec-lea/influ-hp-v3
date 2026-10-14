export function initBackgroundFilms(page: HTMLElement | null) {
  if (!page || page.dataset.filmsReady) return;
  page.dataset.filmsReady = "true";
  const videos = [...page.querySelectorAll<HTMLVideoElement>("[data-profile-background]")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const visible = new Map<HTMLVideoElement, number>();
  let suspended = false;
  let active: HTMLVideoElement | undefined;
  const shouldPlay = (video: HTMLVideoElement) => video === active && !reduced.matches && !document.hidden && !suspended;
  const sync = () => {
    active = [...visible].filter(([, ratio]) => ratio > 0).sort((a, b) => b[1] - a[1])[0]?.[0];
    for (const video of videos) {
      if (shouldPlay(video) && !video.dataset.failed) {
        if (!video.getAttribute("src")) { video.src = video.dataset.src!; video.load(); }
        if (video.paused) video.play().catch(error => {
          if (shouldPlay(video) && error.name !== "AbortError") fallback(video);
        });
      } else video.pause();
    }
  };
  const fallback = (video: HTMLVideoElement) => {
    video.dataset.failed = "true";
    delete video.dataset.playing;
    const status = page.querySelector<HTMLElement>("[data-profile-film-status]");
    if (status) status.textContent = "背景映像を再生できないため、静止画を表示しています。";
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const video = videos.find(video => video.closest("[data-profile-hero], [data-profile-message-visual], [data-profile-career-visual]") === entry.target);
      if (video) visible.set(video, entry.isIntersecting ? entry.intersectionRatio : 0);
    }
    sync();
  }, { threshold: [0, 0.1, 0.5, 1] });
  for (const video of videos) {
    const scene = video.closest("[data-profile-hero], [data-profile-message-visual], [data-profile-career-visual]");
    if (scene) observer.observe(scene);
    video.addEventListener("playing", () => { if (shouldPlay(video)) video.dataset.playing = "true"; else video.pause(); });
    video.addEventListener("error", () => fallback(video));
  }
  reduced.addEventListener("change", () => { if (reduced.matches) for (const video of videos) delete video.dataset.playing; sync(); });
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("pagehide", () => { suspended = true; sync(); });
  window.addEventListener("pageshow", () => { suspended = false; sync(); });
  sync();
}

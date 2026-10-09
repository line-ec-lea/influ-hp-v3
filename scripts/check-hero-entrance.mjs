import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { gsap } from "gsap";
import ts from "typescript";

// Use the real GSAP timeline with plain targets; browser checks cover DOM rendering.
const source = await readFile(new URL("../src/scripts/motion/hero.ts", import.meta.url), "utf8");
const script = ts.transpile(source.replace(/import[^;]+;/, "").replace("export function", "function"));
const markup = await readFile(new URL("../src/components/home/LogoIntro.astro", import.meta.url), "utf8");
const bootstrap = markup.match(/<script is:inline>([\s\S]*?)<\/script>/)?.[1];
assert.ok(bootstrap, "Intro starts with a parser-blocking inline script");
assert.match(markup, /data-logo-intro hidden>/, "Without JavaScript, the homepage is available");
function setup({ reduced = false, hash = "", scrollY = 0, navigationType = "navigate", video = false, hasIntro = true, beforeAnimation = () => {} } = {}) {
  const events = () => ({
    listeners: new Map(),
    addEventListener(name, callback) { this.listeners.set(name, callback); },
    removeEventListener(name) { this.listeners.delete(name); },
  });
  const target = () => ({ opacity: 1, scale: 1, scaleX: 1, y: 0, clipPath: "inset(0 0% 0 0)" });
  const content = Array.from({ length: 4 }, target), still = target();
  const parts = new Map();
  const intro = hasIntro ? { ...target(), hidden: true, dataset: {}, querySelector(selector) {
    if (!parts.has(selector)) parts.set(selector, target());
    return parts.get(selector);
  } } : null;
  const hero = { dataset: { video: String(video) }, querySelectorAll: () => content, querySelector: () => still };
  const preference = { ...events(), matches: reduced };
  const timeouts = [];
  const document = events(), window = { ...events(), scrollY, matchMedia: () => preference, setTimeout(callback, delay) { timeouts.push({ callback, delay }); } };
  const scope = { intro, document, window, location: { hash }, performance: { getEntriesByType: () => [{ type: navigationType }] } };
  if (intro) {
    document.currentScript = { previousElementSibling: intro };
    runInNewContext(bootstrap, scope);
  }
  beforeAnimation({ intro, window, preference, timeouts });
  const timelines = [];
  runInNewContext(`${script}\nplayHeroEntrance(hero, intro);`, {
    ...scope, hero,
    gsap: { ...gsap, timeline(options) {
      const timeline = gsap.timeline({ ...options, paused: true });
      timelines.push(timeline);
      return timeline;
    } },
  });
  return { intro, content, still, document, window, preference, timelines, timeouts };
}
const assertVisible = state => {
  assert.ok(state.content.every(item => item.opacity === 1 && item.y === 0));
  assert.equal(state.still.scale, 1);
  if (state.intro) assert.equal(state.intro.hidden, true);
};
const assertClean = state => {
  assertVisible(state);
  assert.equal(state.document.listeners.size + state.window.listeners.size + state.preference.listeners.size, 0);
};

for (const options of [{ reduced: true }, { hash: "#achievements" }, { scrollY: 400 }, { navigationType: "back_forward" }]) {
  const state = setup(options);
  assert.equal(state.timelines.length, 0, "Reduced motion and restored/deep-linked content skip the intro");
  assertClean(state);
}

const state = setup({ hash: "#hero", beforeAnimation({ intro }) {
  assert.equal(intro.hidden, false, "Logo covers the first paint before the animation bundle executes");
} });
assert.equal(state.timelines.length, 1, "Intro and hero share one timeline");
const timeline = state.timelines[0];
assert.equal(timeline.labels.hero, 2.5, "Existing intro duration is unchanged");
state.timeouts[0].callback();
assert.equal(state.intro.hidden, false);
assert.ok(state.content.every(item => item.opacity === 0), "Hero waits behind the intro");
timeline.seek(timeline.labels.hero - 0.01, false);
assert.equal(state.intro.hidden, false);
timeline.seek(timeline.labels.hero, false);
assert.equal(state.intro.hidden, true, "Overlay stops blocking input when hero starts");
timeline.seek(timeline.labels.hero + 0.05, false);
assert.ok(state.content[0].opacity > 0 && state.content[1].opacity === 0, "Hero uses a short stagger");
timeline.totalProgress(1, false);
assertClean(state);

const failedBundle = setup({ beforeAnimation({ intro, timeouts }) {
  assert.equal(intro.hidden, false);
  assert.equal(timeouts[0].delay, 8000);
  timeouts[0].callback();
  assert.equal(intro.hidden, true, "A missing bundle cannot leave the homepage covered");
} });
assert.equal(failedBundle.timelines.length, 0, "A late bundle cannot reopen the intro after fallback");
assertClean(failedBundle);

for (const change of [({ window }) => { window.scrollY = 400; }, ({ preference }) => { preference.matches = true; }]) {
  const skipped = setup({ beforeAnimation: change });
  assert.equal(skipped.timelines.length, 0);
  assertClean(skipped);
}

for (const event of ["focusin", "pagehide", "change"]) {
  const state = setup();
  state.timelines[0].seek(0.4, false);
  state.preference.matches = true;
  const target = event === "focusin" ? state.document : event === "pagehide" ? state.window : state.preference;
  target.listeners.get(event)();
  assertClean(state);
  assert.equal(state.timelines[0].parent, null, "Interrupted animations are removed, including for BFCache navigation");
}

const standalone = setup({ hasIntro: false, video: true });
assert.equal(standalone.timelines[0].labels.hero, 0, "Without an intro, the hero starts immediately");
assert.equal(standalone.still.scale, 1, "Video mode does not animate the still image");
standalone.timelines[0].totalProgress(1, false);
assertClean(standalone);
gsap.ticker.sleep();
console.log("PASS hero timeline: coordinated handoff, stagger, reduced motion, deep links, focus and navigation cleanup");

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Exercise the actual Astro client script without requesting a placeholder video.
const source = await readFile(new URL("../src/components/home/HeroMedia.astro", import.meta.url), "utf8");
const script = ts.transpile(source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/import[^;]+;/, ""));
function setup({ reduced = false, mobile = false, reject = false, hasVideo = true } = {}) {
  const target = () => ({ listeners: {}, addEventListener(name, callback) { this.listeners[name] = callback; } });
  const preference = Object.assign(target(), { matches: reduced });
  const breakpoint = Object.assign(target(), { matches: mobile });
  const classes = new Set(["opacity-0"]);
  const video = Object.assign(target(), {
    dataset: { desktopSrc: "/desktop.mp4", mobileSrc: "/mobile.mp4" },
    classList: { add: value => classes.add(value), remove: value => classes.delete(value) },
    playCalls: 0, loadCalls: 0, paused: true,
    getAttribute() { return this.src ?? null; },
    removeAttribute() { delete this.src; },
    load() { this.loadCalls++; },
    pause() { this.paused = true; },
    play() { this.playCalls++; this.paused = false; return reject ? Promise.reject(new Error("autoplay denied")) : Promise.resolve(); },
  });
  const toggle = Object.assign(target(), { hidden: true, setAttribute() {} });
  const media = { querySelector: selector => hasVideo ? selector === "[data-hero-video]" ? video : toggle : null };
  const document = Object.assign(target(), { hidden: false, querySelectorAll: () => [media] });
  runInNewContext(script, { document, reducedMotion: preference, window: { matchMedia: () => breakpoint } });
  return { video, toggle, classes, preference, breakpoint, document };
}
const still = setup({ hasVideo: false });
assert.equal(still.video.playCalls, 0);
const reduced = setup({ reduced: true });
assert.equal(reduced.video.src, undefined);
assert.equal(reduced.video.playCalls, 0);
const desktop = setup();
assert.equal(desktop.video.src, "/desktop.mp4");
assert.equal(desktop.video.muted, true);
assert.equal(desktop.video.autoplay, true);
desktop.video.listeners.playing();
assert.equal(desktop.classes.has("opacity-0"), false);
assert.equal(desktop.toggle.hidden, false);
desktop.toggle.listeners.click();
assert.equal(desktop.video.paused, true);
desktop.breakpoint.matches = true;
desktop.breakpoint.listeners.change();
assert.equal(desktop.video.src, "/mobile.mp4");
assert.equal(desktop.toggle.hidden, false, "paused video keeps its resume control after resizing");
desktop.document.hidden = true;
desktop.document.listeners.visibilitychange();
desktop.document.hidden = false;
desktop.document.listeners.visibilitychange();
assert.equal(desktop.video.playCalls, 1, "user pause survives tab visibility changes");
desktop.toggle.listeners.click();
assert.equal(desktop.video.playCalls, 2);
desktop.breakpoint.matches = true;
desktop.breakpoint.listeners.change();
assert.equal(desktop.video.src, "/mobile.mp4");
desktop.video.listeners.error();
assert.equal(desktop.classes.has("opacity-0"), true);
assert.equal(desktop.toggle.hidden, true);
desktop.preference.matches = true;
desktop.preference.listeners.change();
assert.equal(desktop.video.src, undefined);
assert.equal(desktop.video.paused, true);
const denied = setup({ reject: true });
await Promise.resolve();
assert.equal(denied.classes.has("opacity-0"), true);
assert.equal(denied.toggle.hidden, true);
assert.equal(denied.video.paused, true);
assert.equal(setup({ mobile: true }).video.src, "/mobile.mp4");
console.log("PASS hero still, video, mobile source, playback failure, pause and reduced-motion behavior");

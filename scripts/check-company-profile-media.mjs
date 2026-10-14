import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/company-profile/background-films.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const target = () => ({ listeners: {}, addEventListener(name, callback) { this.listeners[name] = callback; } });
const scene = {};
const careerScene = {};
const video = Object.assign(target(), {
  dataset: { profileBackground: "message", src: "/bg-message.mp4" },
  paused: true,
  playCalls: 0,
  closest: selector => selector.includes("[data-profile-message-visual]") ? scene : null,
  getAttribute(name) { return this[name]; },
  load() {},
  play() { this.paused = false; this.playCalls++; return Promise.resolve(); },
  pause() { this.paused = true; },
});
const careerVideo = Object.assign(target(), {
  ...video,
  listeners: {},
  dataset: { profileBackground: "career", src: "/bg-career.mp4" },
  closest: selector => selector.includes("[data-profile-career-visual]") ? careerScene : null,
});
const status = { textContent: "" };
const page = Object.assign(target(), {
  dataset: {},
  querySelectorAll: () => [video, careerVideo],
  querySelector: () => status,
});
const preference = Object.assign(target(), { matches: false });
const document = Object.assign(target(), { hidden: false });
const window = target();
let observe;
const exports = {};
vm.runInNewContext(compiled, {
  exports, document, window, matchMedia: () => preference,
  IntersectionObserver: class { constructor(callback) { observe = callback; } observe() {} },
});
exports.initBackgroundFilms(page);
assert.equal(video.playCalls, 0, "offscreen media is not requested");
assert.equal(video.src, undefined);
observe([{ target: scene, isIntersecting: true, intersectionRatio: 1 }]);
assert.equal(video.src, "/bg-message.mp4");
assert.equal(video.paused, false);
observe([{ target: scene, isIntersecting: true, intersectionRatio: 0.1 }, { target: careerScene, isIntersecting: true, intersectionRatio: 1 }]);
assert.equal(video.paused, true, "message stops as career becomes visible");
assert.equal(careerVideo.src, "/bg-career.mp4");
assert.equal(careerVideo.paused, false, "career film plays across its visual section");
observe([{ target: careerScene, isIntersecting: false, intersectionRatio: 0 }, { target: scene, isIntersecting: true, intersectionRatio: 1 }]);
assert.equal(careerVideo.paused, true, "career stops after its section");
assert.equal(video.paused, false);
document.hidden = true;
document.listeners.visibilitychange();
assert.equal(video.paused, true);
document.hidden = false;
document.listeners.visibilitychange();
assert.equal(video.paused, false);
preference.matches = true;
preference.listeners.change();
assert.equal(video.paused, true);
preference.matches = false;
preference.listeners.change();
assert.equal(video.paused, false);
observe([{ target: scene, isIntersecting: false, intersectionRatio: 0 }]);
assert.equal(video.paused, true, "film stops when its visual leaves the viewport");
observe([{ target: scene, isIntersecting: true, intersectionRatio: 1 }]);
window.listeners.pagehide();
assert.equal(video.paused, true);
window.listeners.pageshow();
assert.equal(video.paused, false);
video.listeners.error();
assert.ok(status.textContent.includes("静止画"));
assert.equal(video.dataset.playing, undefined);
console.log("PASS background loading, reduced motion, visibility and poster fallback");

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../src/components/staff-wellbeing/story-controller.ts", import.meta.url), "utf8");
const code = ts.transpile(source.replaceAll("export function", "function"), { target: ts.ScriptTarget.ES2022 });
class Element {
  attrs = new Set(); listeners = new Map(); children = [];
  setAttribute(name) { this.attrs.add(name); }
  removeAttribute(name) { this.attrs.delete(name); }
  hasAttribute(name) { return this.attrs.has(name); }
  contains(element) { return element === this || this.children.includes(element); }
  addEventListener(name, fn) { this.listeners.set(name, fn); }
  removeEventListener(name) { this.listeners.delete(name); }
  emit(name, event) { this.listeners.get(name)?.(event); }
}
function setup(reduced = false, available = true) {
  const story = new Element(), preference = new Element(); preference.matches = reduced;
  const line = new Element(), fade = new Element(), figure = fade, link = new Element();
  line.setAttribute("data-life-line"); fade.setAttribute("data-life-fade");
  fade.parentElement = figure; figure.children = [fade, link];
  story.querySelectorAll = () => [line, fade];
  let receive, options; const observed = new Set();
  const context = vm.createContext({ matchMedia: () => preference, IntersectionObserver: available ? class {
    constructor(fn, settings) { receive = fn; options = settings; }
    observe(el) { observed.add(el); }
    unobserve(el) { observed.delete(el); }
    disconnect() { observed.clear(); }
  } : undefined });
  vm.runInContext(code, context);
  const dispose = context.mountStoryReveals(story);
  return { story, preference, line, fade, figure, link, observed, options, dispose,
    enter(el, isIntersecting = true) { receive([{ target: el, isIntersecting }]); },
    reduced(value) { preference.matches = value; preference.emit("change"); },
  };
}
for (const [reduced, available] of [[true,true],[false,false]]) {
  const s = setup(reduced, available);
  assert.equal(s.observed.size, 0);
  assert.equal(s.line.hasAttribute("data-life-pending"), false);
  assert.equal(s.fade.hasAttribute("data-life-pending"), false);
  s.dispose();
}
const s = setup();
assert.equal(s.options.threshold, .12);
assert.ok(s.observed.has(s.line) && s.observed.has(s.figure));
assert.equal(s.observed.has(s.fade), true, "Vertical entries observe their own visible layout box");
assert.ok(s.line.hasAttribute("data-life-pending") && s.fade.hasAttribute("data-life-pending"));
s.enter(s.line, false); assert.ok(s.line.hasAttribute("data-life-pending"));
s.enter(s.figure); assert.equal(s.fade.hasAttribute("data-life-pending"), false);
s.enter(s.figure, false); s.enter(s.figure); assert.equal(s.fade.hasAttribute("data-life-pending"), false, "Reverse navigation cannot re-hide completed content");
s.reduced(true);
assert.equal(s.story.hasAttribute("data-life-fades"), false, "Cancel in-flight transitions on preference change");
assert.equal(s.line.hasAttribute("data-life-pending"), false);
assert.equal(s.observed.size, 0);
s.reduced(false); s.enter(s.line); assert.equal(s.line.hasAttribute("data-life-pending"), false, "Never re-hide content after reduced motion");
s.dispose(); assert.equal(s.preference.listeners.size + s.story.listeners.size, 0);
const deep = setup();
deep.enter(deep.figure); assert.equal(deep.fade.hasAttribute("data-life-pending"), false, "Initial deep-scroll intersection reveals the current image");
deep.enter(deep.line); assert.equal(deep.line.hasAttribute("data-life-pending"), false, "Previously skipped content reveals when reached in reverse");
deep.dispose();
const keyboard = setup(); keyboard.story.emit("focusin", { target: keyboard.link });
assert.ok(keyboard.fade.hasAttribute("data-life-instant"));
assert.equal(keyboard.fade.hasAttribute("data-life-pending"), false);
assert.ok(keyboard.line.hasAttribute("data-life-pending"), "Keyboard access only reveals the focused group");
keyboard.dispose(); assert.equal(keyboard.line.hasAttribute("data-life-pending"), false);

// Verify the served Astro target map, without requiring a browser or any new dependency.
const html = await (await fetch("http://localhost:4321/staff-wellbeing")).text();
const starts = [...html.matchAll(/<[^!\/][^>]*>/g)].map(m => m[0]);
const attr = name => starts.filter(tag => new RegExp(`\\s${name}(?:[\\s=>])`).test(tag));
assert.equal(attr("data-life-line").length, 4, "The existing hero line animation is preserved");
assert.equal(attr("data-life-fade").length, 9);
assert.equal(attr("data-life-pending").length, 0, "No-JS HTML is fully visible");
assert.equal(attr("data-life-scene-layer").length, 4);
assert.equal(attr("data-life-video-toggle").length, 1);
assert.equal(attr("data-life-chapters").length, 1);
for (const id of ["move", "mind", "eat"]) assert.match(html, new RegExp(`<section[^>]*id="${id}"`));
assert.doesNotMatch(html, /data-life-pillar|data-life-image-drift|id="growth"|id="bridge-move-eat"/);
for (const component of ["Move", "Mind", "EatTogether"]) {
  const markup = await readFile(new URL(`../src/components/staff-wellbeing/${component}.astro`, import.meta.url), "utf8");
  assert.doesNotMatch(markup, /<Image\b|<img\b|<video\b|<style\b/, "Chapters contain no photo galleries, duplicate video players or custom styles");
}
console.log("PASS wellbeing reveals: preserved hero, three photo-free chapters, vertical entry, reverse/deep entry, reduced motion, keyboard access, no-JS content and cleanup");

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
  const line = new Element(), mask = new Element(), figure = new Element(), link = new Element();
  line.setAttribute("data-life-line"); mask.setAttribute("data-life-reveal");
  mask.parentElement = figure; figure.children = [mask, link];
  story.querySelectorAll = () => [line, mask];
  let receive, options; const observed = new Set();
  const context = vm.createContext({ matchMedia: () => preference, IntersectionObserver: available ? class {
    constructor(fn, settings) { receive = fn; options = settings; }
    observe(el) { observed.add(el); }
    unobserve(el) { observed.delete(el); }
    disconnect() { observed.clear(); }
  } : undefined });
  vm.runInContext(code, context);
  const dispose = context.mountStoryReveals(story);
  return { story, preference, line, mask, figure, link, observed, options, dispose,
    enter(el, isIntersecting = true) { receive([{ target: el, isIntersecting }]); },
    reduced(value) { preference.matches = value; preference.emit("change"); },
  };
}
for (const [reduced, available] of [[true,true],[false,false]]) {
  const s = setup(reduced, available);
  assert.equal(s.observed.size, 0);
  assert.equal(s.line.hasAttribute("data-life-pending"), false);
  assert.equal(s.mask.hasAttribute("data-life-pending"), false);
  s.dispose();
}
const s = setup();
assert.equal(s.options.threshold, .12);
assert.ok(s.observed.has(s.line) && s.observed.has(s.figure));
assert.equal(s.observed.has(s.mask), false, "Observe an unclipped proxy, never the zero-area mask");
assert.ok(s.line.hasAttribute("data-life-pending") && s.mask.hasAttribute("data-life-pending"));
s.enter(s.line, false); assert.ok(s.line.hasAttribute("data-life-pending"));
s.enter(s.figure); assert.equal(s.mask.hasAttribute("data-life-pending"), false);
s.enter(s.figure, false); s.enter(s.figure); assert.equal(s.mask.hasAttribute("data-life-pending"), false, "Reverse navigation cannot re-hide completed content");
s.reduced(true);
assert.equal(s.story.hasAttribute("data-life-reveals"), false, "Cancel in-flight transitions on preference change");
assert.equal(s.line.hasAttribute("data-life-pending"), false);
assert.equal(s.observed.size, 0);
s.reduced(false); s.enter(s.line); assert.equal(s.line.hasAttribute("data-life-pending"), false, "Never re-hide content after reduced motion");
s.dispose(); assert.equal(s.preference.listeners.size + s.story.listeners.size, 0);
const deep = setup();
deep.enter(deep.figure); assert.equal(deep.mask.hasAttribute("data-life-pending"), false, "Initial deep-scroll intersection reveals the current image");
deep.enter(deep.line); assert.equal(deep.line.hasAttribute("data-life-pending"), false, "Previously skipped content reveals when reached in reverse");
deep.dispose();
const keyboard = setup(); keyboard.story.emit("focusin", { target: keyboard.link });
assert.ok(keyboard.mask.hasAttribute("data-life-instant"));
assert.equal(keyboard.mask.hasAttribute("data-life-pending"), false);
assert.ok(keyboard.line.hasAttribute("data-life-pending"), "Keyboard access only reveals the focused group");
keyboard.dispose(); assert.equal(keyboard.line.hasAttribute("data-life-pending"), false);

// Verify the served Astro target map, without requiring a browser or any new dependency.
const html = await (await fetch("http://localhost:4321/staff-wellbeing")).text();
const starts = [...html.matchAll(/<[^!\/][^>]*>/g)].map(m => m[0]);
const attr = name => starts.filter(tag => new RegExp(`\\s${name}(?:[\\s=>])`).test(tag));
assert.equal(attr("data-life-line").length, 12);
assert.equal(attr("data-life-reveal").length, 9);
assert.equal(attr("data-life-reveal-scale").length, 4);
assert.equal(attr("data-life-pillar").length, 3, "All three wellbeing photos share the existing reveal behavior");
assert.equal(attr("data-life-pending").length, 0, "No-JS HTML is fully visible");
assert.equal(attr("data-life-image-drift").length, 2, "The two retained source images receive crop drift");
assert.equal(attr("data-life-scene-layer").length, 3, "Video-stage ownership is preserved");
assert.doesNotMatch(html, /id="stories"|id="bridge-eat-life"|Daily life/, "Daily Life and its transition are removed");
console.log("PASS staff wellbeing reveals: 12 lines / 9 masks / 4 scales, unclipped proxies, one-shot forward/reverse entry, deep entry, reduced motion, keyboard access, no-JS fallback and cleanup");

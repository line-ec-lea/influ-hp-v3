import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../src/pages/business-content.astro", import.meta.url), "utf8");
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/import .*?;\n/, "");
const code = ts.transpile(script, { target: ts.ScriptTarget.ES2022 });

function mount({ reduced = false, mobile = false } = {}) {
  const target = (kind) => ({
    style: {}, dataset: { businessEnter: kind },
    querySelector: () => kind === "step" ? { style: {} } : null,
    closest() { return this; },
  });
  const targets = [target("step"), target("step"), target("after"), target("")];
  const documentEvents = new Map(), reducedEvents = new Map(), windowEvents = new Map();
  const events = (map) => ({ addEventListener: (name, fn) => map.set(name, fn), removeEventListener: (name) => map.delete(name) });
  const calls = [];
  let observer;
  vm.runInNewContext(code, {
    document: { querySelectorAll: () => targets, ...events(documentEvents) },
    window: events(windowEvents),
    reducedMotion: { matches: reduced, ...events(reducedEvents) },
    matchMedia: () => ({ matches: mobile }), ease: [0.22, 1, 0.36, 1],
    IntersectionObserver: class {
      observed = new Set();
      constructor(callback) { this.callback = callback; observer = this; }
      observe(el) { this.observed.add(el); }
      unobserve(el) { this.observed.delete(el); }
      disconnect() { this.observed.clear(); }
    },
    animate: (el, frames, options) => {
      const call = { el, frames, options, completed: false };
      calls.push(call);
      return { complete() { call.completed = true; } };
    },
  });
  return { targets, calls, observer, documentEvents, reducedEvents, windowEvents };
}

const quiet = mount({ reduced: true });
assert.equal(quiet.observer, undefined, "reduced motion must never hide or observe content");
assert.ok(quiet.targets.every((el) => el.style.opacity === undefined));
assert.equal(quiet.calls.length, 0);

const page = mount();
assert.ok(page.targets.every((el) => el.style.opacity === "0" && el.style.transform === "translateY(8px)"));
const entering = page.targets.slice(0, 3).map((target) => ({ target, isIntersecting: true }));
page.observer.callback(entering);
assert.deepEqual(page.calls.filter(({ options }) => options.duration === 0.4).map(({ options }) => options.delay), [0, 0.06, 0.12]);
const count = page.calls.length;
page.observer.callback(entering);
assert.equal(page.calls.length, count, "entrances must never replay");
assert.equal(page.observer.observed.size, 1);

page.documentEvents.get("focusin")({ target: page.targets[1] });
assert.ok(page.calls.filter(({ el }) => el === page.targets[1]).slice(0, -1).every(({ completed }) => completed), "focus must complete a delayed entrance");
assert.equal(page.calls.at(-1).options.duration, 0);
page.documentEvents.get("focusin")({ target: page.targets[3] });
assert.equal(page.observer.observed.size, 0, "keyboard focus must reveal offscreen content immediately");
page.reducedEvents.get("change")();
assert.ok(page.targets.every((target) => page.calls.some(({ el, options }) => el === target && options.duration === 0)));
page.windowEvents.get("pagehide")();
assert.equal(page.documentEvents.size, 0);
assert.equal(page.reducedEvents.size, 0);
assert.ok(mount({ mobile: true }).targets.every((el) => el.style.transform === "translateY(4px)"));
console.log("PASS once-only entrances, stagger, keyboard focus, reduced motion, mobile distance and cleanup");

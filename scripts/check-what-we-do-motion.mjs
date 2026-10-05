import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

// Exercise the component's entrance setup independently of its existing pill-selection logic.
const source = (await readFile(new URL("../src/components/home/WhatWeDo.astro", import.meta.url), "utf8"))
  .split("<script>")[1].split("  const buttons =")[0].replace(/^\s*import .*;$/gm, "");
const run = new Function("document", "window", "reducedMotion", "IntersectionObserver", "animate", "ease",
  ts.transpile(source, { target: ts.ScriptTarget.ES2022 }));

function setup(reduced, desktop) {
  const targets = Array.from({ length: 16 }, () => ({ style: {}, contains(node) { return node === this; } }));
  const animations = [], observed = new Set();
  const focusListeners = new Map(), motionListeners = new Map();
  let enter, options, pagehide;
  const events = listeners => ({
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: name => listeners.delete(name),
  });
  const animate = (elements, frames, options) => {
    const items = Array.isArray(elements) ? elements : [elements];
    const animation = {
      items, frames, options, stopped: false,
      complete() { items.forEach(item => { item.style.opacity = String(Array.isArray(frames.opacity) ? frames.opacity.at(-1) : frames.opacity); }); },
      stop() { this.stopped = true; },
    };
    if (options.duration === 0) animation.complete();
    animations.push(animation);
    return animation;
  };
  run({ querySelector: () => ({ querySelectorAll: () => targets, ...events(focusListeners) }) },
    { matchMedia: () => ({ matches: desktop }), addEventListener: (name, callback) => { pagehide = callback; } },
    { matches: reduced, ...events(motionListeners) },
    class {
      constructor(callback, settings) { enter = callback; options = settings; }
      observe(target) { observed.add(target); }
      unobserve(target) { observed.delete(target); }
      disconnect() { observed.clear(); }
    }, animate, [0.22, 1, 0.36, 1]);
  return { targets, observed, options, animations, focusListeners, motionListeners, pagehide,
    enter: (...indices) => enter(indices.map(index => ({ target: targets[index], isIntersecting: true }))) };
}

const reduced = setup(true, false);
assert.equal(reduced.observed.size, 0);
assert.ok(reduced.targets.every(target => target.style.opacity === undefined), "Reduced motion keeps content visible without waiting for scroll");

for (const desktop of [false, true]) {
  const state = setup(false, desktop);
  assert.equal(state.observed.size, 16);
  assert.equal(state.animations.length, 0, "No entrance runs before its viewport trigger");
  assert.equal(state.options.rootMargin, "0px 0px -48px 0px");
  state.enter(0, 1);
  assert.deepEqual(state.animations[0].frames.y, [desktop ? 20 : 12, 0]);
  assert.ok(state.animations[1].options.delay > state.animations[0].options.delay, "Elements entering together are staggered");
  assert.equal(state.targets[2].style.opacity, "0", "Unreached content keeps its own entrance pending");
  state.enter(8);
  assert.equal(state.animations[2].options.delay, 0, "A later element reached separately must not inherit an earlier group's delay");
  state.enter(9, 10, 11, 12, 13, 14, 15);
  assert.ok(state.animations.every(animation => animation.options.delay <= 0.21), "Fast scrolling never creates a long reveal backlog");
  const entered = state.animations.length;
  state.enter(0);
  assert.equal(state.animations.length, entered, "An already revealed element does not restart");
  state.pagehide({ persisted: true });
  assert.ok(state.observed.has(state.targets[2]), "Back-forward cache retains pending observers");
  state.focusListeners.get("focusin")({ target: state.targets[2] });
  assert.equal(state.targets[2].style.opacity, "1", "Keyboard focus immediately reveals that control");
  assert.equal(state.targets[3].style.opacity, "0", "Focusing one control must not reveal unrelated content");
  assert.ok(state.observed.has(state.targets[3]));
  const focused = state.animations.length;
  state.enter(2);
  assert.equal(state.animations.length, focused, "A queued intersection must not hide a focused control again");
  state.pagehide({ persisted: false });
  assert.equal(state.observed.size, 0);
  assert.ok(state.animations.slice(0, entered).every(animation => animation.stopped));
  assert.equal(state.focusListeners.size + state.motionListeners.size, 0, "Navigation cleans up listeners");
}

const toggled = setup(false, true);
toggled.enter(0);
toggled.motionListeners.get("change")();
assert.ok(toggled.targets.every(target => target.style.opacity === "1"), "Enabling reduced motion reveals pending and active content");
assert.equal(toggled.observed.size, 0);
const finished = toggled.animations.length;
toggled.enter(1);
assert.equal(toggled.animations.length, finished, "Queued intersections stay inert after reduced motion is enabled");
console.log("PASS What We Do entrances: viewport timing, stagger, mobile distance, keyboard access, reduced motion and cleanup");

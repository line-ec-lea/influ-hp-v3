import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = (await readFile(new URL("../src/components/shared/SpecularButton.astro", import.meta.url), "utf8"))
  .split("<script>")[1].split("</script>")[0].replace(/^\s*import .*;$/gm, "");
const run = new Function("Mesh", "Program", "Renderer", "Triangle", "inView", "reducedMotion", "matchMedia", "document", "window", "ResizeObserver", "performance", "requestAnimationFrame", "cancelAnimationFrame",
  ts.transpile(source, { target: ts.ScriptTarget.ES2022 }));
for (const [reduced, mobile, mobileEffect] of [[false, false, false], [true, false, false], [false, true, true], [true, true, true], [false, true, false]]) {
  const frames = new Map(), listeners = new Set();
  let enter, leave, pagehide, stopped = false, nextFrame = 0, renders = 0;
  const gl = { BLEND: 1, ONE: 1, ONE_MINUS_SRC_ALPHA: 1, clearColor() {}, enable() {}, blendFunc() {}, getExtension: () => null };
  const button = { dataset: {}, hasAttribute: () => mobileEffect, querySelector: () => ({ appendChild() {} }), getBoundingClientRect: () => ({ width: 160, height: 50, left: 0, top: 0, right: 160, bottom: 50 }) };
  run(class {}, class { constructor(gl, options) { this.uniforms = options.uniforms; } }, class { gl = gl; setSize() {} render() { renders++; } }, class { attributes = {}; },
    (target, callback) => { assert.equal(target, button); enter = callback; return () => { stopped = true; }; }, { matches: reduced }, () => ({ matches: mobile }),
    { createElement: () => ({ getContext: () => gl, remove() {} }), querySelectorAll: () => [button] },
    { devicePixelRatio: 1, addEventListener: (event, handler) => { if (event === "pagehide") pagehide = handler; else listeners.add(handler); }, removeEventListener: (event, handler) => listeners.delete(handler) },
    class { observe() {} disconnect() {} }, { now: () => 100 }, callback => { frames.set(++nextFrame, callback); return nextFrame; }, id => frames.delete(id));
  assert.equal(frames.size, 0, "Offscreen buttons must not schedule frames");
  assert.equal(listeners.size, 0, "Offscreen buttons must not track pointers");
  if (mobile && !mobileEffect) {
    assert.equal(enter, undefined, "Other mobile buttons retain their static fallback");
    continue;
  }
  if (!reduced) {
    leave = enter();
    assert.equal(frames.size, 1);
    assert.equal(listeners.size, 1);
    const [id, update] = frames.entries().next().value;
    frames.delete(id);
    const before = renders;
    update(116);
    assert.equal(renders, before + 1, "Visible buttons keep their render loop");
    leave();
    assert.equal(frames.size, 0);
    assert.equal(listeners.size, 0);
    leave = enter();
    assert.equal(frames.size, 1, "Re-entry resumes animation");
    pagehide({ persisted: true });
    assert.equal(frames.size, 1, "Keep state for browser back/forward cache");
  }
  pagehide({ persisted: false });
  assert.equal(frames.size, 0);
  assert.equal(listeners.size, 0);
  assert.equal(stopped, !reduced);
}
console.log("PASS specular buttons: visible animation, offscreen pause, re-entry, reduced motion, page cleanup");

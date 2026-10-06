import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../src/components/business-content/ParticleBackground.astro", import.meta.url), "utf8");
const code = source.slice(source.indexOf("function moveGrain("), source.indexOf("async function mountArtwork(")).replace(/grain: Grain, pointer: \{ x: number; y: number; active: boolean \}, radius: number, step: number/, "grain, pointer, radius, step");
const { moveGrain } = vm.runInNewContext(`${code}; ({ moveGrain })`);
const grain = (x, y) => ({ x, y, homeX: x, homeY: y, vx: 0, vy: 0 });
const pointer = { x: 0, y: 0, active: true };
const near = grain(20, 0), far = grain(300, 0), center = grain(0, 0);
assert.equal(moveGrain(near, pointer, 100, 1), true);
assert.ok(near.x > near.homeX, "nearby dots must scatter away from the cursor");
assert.equal(moveGrain(far, pointer, 100, 1), false);
assert.equal(far.x, far.homeX, "distant dots must stay in their lettering");
moveGrain(center, pointer, 100, 1);
assert.ok(Number.isFinite(center.x) && center.x > 0, "exact cursor overlap must scatter without NaN");
pointer.active = false;
for (let i = 0; i < 600; i++) moveGrain(near, pointer, 100, 1);
assert.equal(near.x, near.homeX, "released dots must settle into their original lettering");
assert.equal(near.vx, 0, "settled particles must stop");
for (const step of [0.5, 1, 2]) {
  const dot = grain(15, 10);
  for (let i = 0; i < 50; i++) moveGrain(dot, { ...pointer, active: true }, 100, step);
  for (let i = 0; i < 1200; i++) moveGrain(dot, pointer, 100, step);
  assert.equal(dot.x, dot.homeX); assert.equal(dot.y, dot.homeY);
}
console.log("PASS pointer scattering, radius falloff, exact overlap, return and variable frame rates");

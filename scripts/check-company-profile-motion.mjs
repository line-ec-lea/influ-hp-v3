import assert from "node:assert/strict";
import { careerFrame, clamp, segment } from "../src/components/company-profile/motion-frames.mjs";
assert.equal(clamp(-1), 0);
assert.equal(clamp(2), 1);
assert.equal(segment(0.5, 0.25, 0.75), 0.5);
assert.deepEqual(careerFrame(0), { from: 0, to: 0, travel: 0, active: 0, exit: 0 });
const duration = 0.4 + 6 * 1.55 + 1;
for (let year = 0; year < 6; year++) {
  const moving = careerFrame((0.4 + year * 1.55 + 0.5) / duration);
  assert.equal(moving.from, year);
  assert.equal(moving.to, year + 1);
  assert.ok(Math.abs(moving.travel - 0.5) < 1e-10);
  const holding = careerFrame((0.4 + year * 1.55 + 1.25) / duration);
  assert.equal(holding.active, year + 1);
  assert.equal(holding.travel, 1);
  assert.equal(holding.exit, 0);
}
assert.deepEqual(careerFrame(1), { from: 6, to: 6, travel: 1, active: 6, exit: 1 });
assert.deepEqual(careerFrame(-1), careerFrame(0));
assert.deepEqual(careerFrame(2), careerFrame(1));
console.log("PASS career travel, six reading pauses, exit and bounded scroll progress");

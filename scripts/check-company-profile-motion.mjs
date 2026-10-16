import assert from "node:assert/strict"
import {
  careerFrame,
  clamp,
  dampMessageProgress,
  messageFrame,
  segment,
} from "../src/components/company-profile/motion-frames.mjs"

assert.equal(clamp(-1), 0)
assert.equal(clamp(2), 1)
assert.equal(segment(0.5, 0.25, 0.75), 0.5)
assert.deepEqual(careerFrame(0), { from: 0, to: 0, travel: 0, active: 0, exit: 0 })
for (const count of [6, 8]) {
  const duration = 0.4 + count * 1.55 + 1
  for (let year = 0; year < count; year++) {
    const moving = careerFrame((0.4 + year * 1.55 + 0.5) / duration, count)
    assert.equal(moving.from, year)
    assert.equal(moving.to, year + 1)
    assert.ok(Math.abs(moving.travel - 0.5) < 1e-10)
    const holding = careerFrame((0.4 + year * 1.55 + 1.25) / duration, count)
    assert.equal(holding.active, year + 1)
    assert.equal(holding.travel, 1)
    assert.equal(holding.exit, 0)
  }
  assert.deepEqual(careerFrame(1, count), {
    from: count,
    to: count,
    travel: 1,
    active: count,
    exit: 1,
  })
}
assert.deepEqual(careerFrame(-1), careerFrame(0))
assert.deepEqual(careerFrame(2), careerFrame(1))
console.log("PASS career travel, six/eight reading pauses, exit and bounded scroll progress")

const messageDuration = 4.35
for (let paragraph = 0; paragraph < 5; paragraph++) {
  for (const local of [0, 0.25, 0.54]) {
    const holding = messageFrame((paragraph + local) / messageDuration)
    assert.equal(holding.index, paragraph)
    assert.equal(holding.exit, 0, "stationary during reading")
  }
  if (paragraph === 4) continue
  const outgoing = messageFrame((paragraph + 0.65) / messageDuration)
  assert.equal(outgoing.next, paragraph + 1)
  assert.ok(Math.abs(outgoing.exit - 0.5) < 1e-10, "outgoing paragraph drifts left")
  const incoming = messageFrame((paragraph + 0.85) / messageDuration)
  assert.equal(incoming.exit, 1)
  assert.ok(Math.abs(incoming.entrance - 0.5) < 1e-10, "next paragraph arrives from the right")
  const before = messageFrame((paragraph + 1 - 1e-8) / messageDuration)
  const after = messageFrame((paragraph + 1 + 1e-8) / messageDuration)
  assert.ok(before.entrance > 0.99999)
  assert.equal(after.exit, 0, "handoff preserves the incoming paragraph at full opacity")
}
assert.deepEqual(messageFrame(0), { index: 0, next: 1, exit: 0, entrance: 0 })
assert.deepEqual(messageFrame(1), { index: 4, next: 4, exit: 0, entrance: 1 })
assert.deepEqual(messageFrame(-1), messageFrame(0))
assert.deepEqual(messageFrame(2), messageFrame(1))
console.log("PASS MESSAGE reading holds, gentle right-to-left handoffs and final signature")

assert.equal(dampMessageProgress(0, 1, 0), 0)
const settle = (frames, elapsed) =>
  Array.from({ length: frames }).reduce((current) => dampMessageProgress(current, 1, elapsed), 0)
assert.ok(
  Math.abs(settle(20, 10) - settle(10, 20)) < 1e-10,
  "smoothing stays consistent across refresh rates",
)
assert.ok(settle(20, 10) > 0.9 && settle(20, 10) < 1, "input catches up smoothly without overshoot")
assert.ok(
  dampMessageProgress(0.8, 0.2, 16) < 0.8 && dampMessageProgress(0.8, 0.2, 16) > 0.2,
  "reverse scroll settles toward its new target",
)
console.log("PASS MESSAGE frame-rate-independent input smoothing and reverse scroll")

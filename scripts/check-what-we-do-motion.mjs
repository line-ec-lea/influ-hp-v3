import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { runInNewContext } from "node:vm"
import ts from "typescript"

// Exercise the current focus selector, including reduced motion and interrupted selections.
const source = await readFile(
  new URL("../src/components/home/WhatWeDo.astro", import.meta.url),
  "utf8",
)
const code = ts.transpile(
  source
    .match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import[\s\S]*?\sfrom\s+["'][^"']+["'];?\r?\n/gm, ""),
  { target: ts.ScriptTarget.ES2022 },
)
class Target {
  listeners = new Map()
  attrs = new Map()
  textContent = ""
  addEventListener(name, callback) {
    this.listeners.set(name, callback)
  }
  removeEventListener(name) {
    this.listeners.delete(name)
  }
  emit(name, event = {}) {
    return this.listeners.get(name)?.(event)
  }
  getAttribute(name) {
    return this.attrs.get(name)
  }
  setAttribute(name, value) {
    this.attrs.set(name, value)
  }
}
function setup({ reduced = false, desktop = true } = {}) {
  const buttons = Array.from({ length: 7 }, (_, index) => {
    const button = new Target()
    button.dataset = { label: `Area ${index}`, description: `Description ${index}` }
    button.setAttribute("aria-pressed", String(index === 2))
    return button
  })
  const pills = buttons.map(() => new Target())
  const description = new Target(),
    heading = new Target(),
    paragraph = new Target(),
    count = new Target()
  count.textContent = "03"
  description.querySelector = (selector) => (selector === "h3" ? heading : paragraph)
  const section = {
    querySelectorAll: (selector) => (selector === "[data-area]" ? buttons : pills),
    querySelector: (selector) => (selector === "[data-detail]" ? description : count),
  }
  const preference = new Target(),
    breakpoint = new Target(),
    window = new Target()
  preference.matches = reduced
  breakpoint.matches = desktop
  window.matchMedia = () => breakpoint
  const calls = []
  runInNewContext(code, {
    document: { querySelector: () => section },
    window,
    reducedMotion: preference,
    ease: [0.22, 1, 0.36, 1],
    animate(target, values, options) {
      const call = { target, values, options, stopped: false }
      calls.push(call)
      return Object.assign(Promise.resolve(), {
        stop() {
          call.stopped = true
        },
      })
    },
  })
  return { buttons, pills, heading, paragraph, count, preference, breakpoint, window, calls }
}
const settle = async () => {
  for (let index = 0; index < 6; index++) await Promise.resolve()
}
const selected = (state) =>
  state.buttons.findIndex((button) => button.getAttribute("aria-pressed") === "true")
const state = setup()
assert.equal(state.calls.filter((call) => call.options.repeat === Infinity).length, 6)
assert.equal(
  state.calls.some((call) => call.target === state.pills[2]),
  false,
  "The selected area does not drift",
)
await state.buttons[5].emit("click")
assert.equal(selected(state), 5)
assert.equal(state.count.textContent, "06")
assert.equal(state.heading.textContent, "Area 5")
assert.equal(state.paragraph.textContent, "Description 5")
state.buttons[1].emit("pointerenter", { pointerType: "touch" })
await settle()
assert.equal(selected(state), 5, "Touch hover does not change the selection")
state.buttons[1].emit("pointerenter", { pointerType: "mouse" })
await settle()
assert.equal(selected(state), 1)
await state.buttons[4].emit("focus")
assert.equal(state.count.textContent, "05", "Keyboard focus updates the detail")
state.buttons[0].emit("click")
state.buttons[6].emit("click")
await settle()
assert.equal(
  state.heading.textContent,
  "Area 6",
  "A stale fade cannot overwrite the newest selection",
)
state.buttons[3].emit("click")
state.preference.matches = true
state.preference.emit("change")
await settle()
assert.equal(
  state.heading.textContent,
  "Area 3",
  "Changing motion preferences finishes an interrupted selection",
)
assert.ok(
  state.calls.filter((call) => call.options.repeat === Infinity).every((call) => call.stopped),
)
state.preference.matches = false
state.preference.emit("change")
const moving = state.calls.filter((call) => call.options.repeat === Infinity && !call.stopped)
state.window.emit("pagehide", { persisted: true })
assert.ok(
  moving.every((call) => !call.stopped),
  "Back-forward cache preserves listeners and motion",
)
state.window.emit("pagehide", { persisted: false })
assert.ok(moving.every((call) => call.stopped))
assert.equal(state.preference.listeners.size + state.breakpoint.listeners.size, 0)
for (const reduced of [true, false]) {
  const mobile = setup({ reduced, desktop: false })
  assert.equal(mobile.calls.filter((call) => call.options.repeat === Infinity).length, 0)
  await mobile.buttons[1].emit("click")
  assert.equal(mobile.heading.textContent, "Area 1")
  if (reduced) assert.ok(mobile.calls.every((call) => call.options.duration === 0))
  mobile.window.emit("pagehide")
}
console.log(
  "PASS current focus selector: mouse, touch, keyboard, rapid selection, reduced motion, mobile, back-forward cache and cleanup",
)

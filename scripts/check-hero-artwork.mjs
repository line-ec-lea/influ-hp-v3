import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { MeshBasicMaterial, PerspectiveCamera, Vector2, Vector3, Plane, Raycaster } from "three";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";

const source = await readFile(new URL("../src/components/business-content/HeroArtwork.astro", import.meta.url), "utf8");

// Build the actual signed-distance geometry and check its bores and buffer capacity.
const material = new MeshBasicMaterial();
const geometrySource = source.slice(source.indexOf("const resolution ="), source.indexOf("const sculpture =")).replaceAll(": number", "");
const { surface, resolution } = vm.runInNewContext(`${geometrySource}; ({ surface, resolution })`, { MarchingCubes, materials: [material] });
assert.ok(surface.count > 0 && surface.count <= surface.geometry.attributes.position.count);
const sample = (x, y, z) => surface.field[Math.round((x + 1) * resolution / 2) + Math.round((y + 1) * resolution / 2) * resolution + Math.round((z + 1) * resolution / 2) * resolution * resolution];
assert.ok(sample(0, 0, 0) < 0, "central bore must remain empty");
assert.ok(sample(0.65, 0, 0) < 0, "arm bore must remain empty");
assert.ok(sample(0.65, 0.2, 0) > 0, "tube wall must remain solid");
assert.ok(sample(0.9, 0.9, 0.9) < 0, "outside must remain empty");
assert.ok(surface.geometry.attributes.position.array.slice(0, surface.count * 3).every(Number.isFinite));
surface.geometry.dispose(); material.dispose();
console.log("PASS connector geometry, hollow bores and buffer capacity");

// Exercise the component's actual scheduling functions with a clock and renderer stub.
let scheduled = 0, rendered = 0, progress = 0, paused = false;
const entrance = {
  isActive: () => false,
  progress(value) { if (value === undefined) return progress; progress = value; return this; },
  pause() { paused = true; return this; },
  play() { paused = false; return this; },
  resume() { paused = false; return this; },
};
const context = vm.createContext({
  frame: 0, ready: true, visible: true, started: false, previousTime: 0, motionTime: 0, connectors: [],
  pointerX: 0, pointerY: 0, currentX: 0, currentY: 0, pointerActive: false,
  pointer: new Vector2(), raycaster: new Raycaster(), pointerPlane: new Plane(new Vector3(0, 0, 1), 0), pointerWorld: new Vector3(),
  view: { angle: 0.52 }, scrollAmount: 0, cameraDistance: 6.8,
  document: { hidden: false }, signal: { aborted: false }, reduced: { matches: false },
  requestAnimationFrame: () => ++scheduled, cancelAnimationFrame: () => {}, entrance,
  camera: new PerspectiveCamera(40, 1, 0.1, 40), scene: {},
  renderer: { render() { rendered++; } }, host: { dataset: {} },
});
vm.runInContext(source.slice(source.indexOf("function requestRender()"), source.indexOf("function resize()")).replace("time: number", "time"), context);
context.requestRender(); context.requestRender();
assert.equal(scheduled, 1, "coalesce rendering requests");
context.render(16);
assert.equal(rendered, 1);
assert.equal(scheduled, 2, "visible artwork should animate");
context.pointerX = 1;
context.render(32);
assert.equal(scheduled, 3, "pointer movement should continue easing");
context.visible = false;
context.syncActivity(); context.requestRender();
assert.equal(context.frame, 0);
assert.equal(paused, true);
assert.equal(scheduled, 3, "offscreen artwork must not render");
context.visible = true; context.document.hidden = true;
context.syncActivity(); context.requestRender();
assert.equal(scheduled, 3, "hidden tabs must not render");
context.document.hidden = false; context.reduced.matches = true;
context.syncActivity();
assert.equal(progress, 1, "reduced motion must finish the entrance");
assert.equal(paused, true);
const beforeReduced = scheduled;
context.render(48);
assert.equal(scheduled, beforeReduced, "reduced motion must stop continuous rendering");
console.log("PASS visible animation, pointer, offscreen, hidden-tab and reduced-motion scheduling");

// Pointer pushes nearby objects locally, leaves distant ones alone, and releases smoothly.
const near = { x: 1, y: 0, phase: 0, offsetX: 0, offsetY: 0, mesh: { position: new Vector3(), rotation: { x: 0, y: 0 } } };
const far = { ...near, x: 5, mesh: { position: new Vector3(), rotation: { x: 0, y: 0 } } };
context.connectors = [near, far];
context.reduced.matches = false;
context.pointerActive = true;
context.pointerX = context.pointerY = context.currentX = context.currentY = 0;
context.render(112);
assert.ok(near.offsetX > 0, "nearby shape should move away from pointer");
assert.equal(far.offsetX, 0, "distant shape should not be pushed");
const pushed = near.offsetX;
context.pointerActive = false;
context.render(176);
assert.ok(near.offsetX > 0 && near.offsetX < pushed, "pointer exit should ease back, not snap");
context.pointerActive = true;
context.reduced.matches = true;
context.render(240);
assert.equal(near.offsetX, 0, "reduced motion must disable pointer displacement");
console.log("PASS local pointer repulsion, distance falloff, release and reduced motion");

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

// Run the actual browser controller against deterministic media/lifecycle events.
// Real decoding, CSS crossfades and responsive geometry are checked in the browser.
const source = await readFile(new URL("../src/components/staff-wellbeing/story-controller.ts", import.meta.url), "utf8");
assert.doesNotMatch(source, /currentTime\s*=/, "Scroll must never seek the videos");
const stageMarkup = await readFile(new URL("../src/components/staff-wellbeing/VideoStage.astro", import.meta.url), "utf8");
assert.doesNotMatch(stageMarkup, /data-life-video-control/, "The removed playback button must not be rendered");
const code = ts.transpile(source.replaceAll("export function", "function"), { target: ts.ScriptTarget.ES2022 });
class Element {
  textWrites = 0; text = "";
  get textContent() { return this.text; }
  set textContent(value) { this.text = value; this.textWrites++; }
  attrs = new Map(); dataset = {}; listeners = new Map(); style = { setProperty: (k, v) => this.attrs.set(k, v), removeProperty: k => this.attrs.delete(k) };
  addEventListener(name, fn, options = {}) { const list = this.listeners.get(name) || []; list.push({ fn, signal: options.signal }); this.listeners.set(name, list); }
  emit(name) { for (const { fn, signal } of this.listeners.get(name) || []) if (!signal?.aborted) fn(); }
  setAttribute(k, v) { this.attrs.set(k, v); }
  removeAttribute(k) { this.attrs.delete(k); }
  hasAttribute(k) { return this.attrs.has(k); }
  toggleAttribute(k, on) { if (on) this.setAttribute(k, ""); else this.removeAttribute(k); }
}
class Video extends Element {
  paused = true; loads = 0; plays = 0; mode = "normal"; requests = [];
  load() { this.loads++; }
  pause() { this.paused = true; }
  play() {
    this.plays++;
    if (this.mode === "reject") return Promise.reject(new Error("Autoplay rejected"));
    if (this.mode === "pending") return new Promise((resolve, reject) => this.requests.push({ resolve, reject }));
    this.paused = false; this.emit("playing"); return Promise.resolve();
  }
}
function setup({ reduced = false, initialY = 0, initialMode = "normal", width = 900, withFooter = false } = {}) {
  const stage = new Element(), status = new Element(), story = new Element();
  const progress = new Element(), chapterNumber = new Element(), chapterName = new Element();
  progress.querySelector = s => s === "[data-life-progress-number]" ? chapterNumber : chapterName;
  const layers = ["box", "eat", "toast"].map(key => {
    const element = new Element(), video = new Video(); video.mode = initialMode;
    element.dataset.lifeSceneLayer = key; element.querySelector = () => video;
    if (key === "box") { element.setAttribute("data-on", ""); element.setAttribute("data-top", ""); }
    return { element, video, key };
  });
  stage.querySelectorAll = () => layers.map(l => l.element);
  const bounds = {
    "[data-life-opening]": [0,900], "#move": [900,4700], "[data-life-hseq]": [1450,2550],
    "#bridge-move-eat": [4700,5474], "#eat": [5474,8655], "[data-life-eat-film]": [5780,6320],
    "[data-life-eat-lead]": [6440,7260], "#bridge-eat-life": [8655,9429], "#stories": [9429,12400], "#growth": [12400,13860],
    "[data-life-closing]": [13860,14471], "[data-life-story-end]": [14471,14867],
  };
  const anchors = Object.fromEntries(Object.entries(bounds).map(([k, b]) => {
    const element = new Element();
    element.getBoundingClientRect = () => {
      const shift = Number(element.attrs.get("transform")?.match(/,([\d.]+)vh/)?.[1] || 0) * context.innerHeight / 100;
      return { top: b[0] - context.scrollY + shift, bottom: b[1] - context.scrollY + shift, height: b[1] - b[0] };
    };
    return [k, element];
  }));
  const pin = new Element(), track = new Element(); pin.clientWidth = width; track.scrollWidth = 3400;
  anchors["[data-life-hseq]"].querySelector = s => s === "[data-life-hseq-pin]" ? pin : track;
  story.querySelector = s => ({ "[data-life-progress]": progress, "[data-life-stage]": stage, "[data-life-video-status]": status }[s] || anchors[s]);
  const cropPositions = ["42% 62%", "42% 96%", "42% 62%", "50% 22%"];
  const cropBounds = [[3000,600],[4000,450],[6440,600],[11000,700]];
  const crops = cropPositions.map((base, i) => {
    const image = new Element(); image.base = base;
    image.getBoundingClientRect = () => {
      const shift = i === 2 ? Number(anchors["[data-life-eat-lead]"].attrs.get("transform")?.match(/,([\d.]+)vh/)?.[1] || 0) * context.innerHeight / 100 : 0;
      const top = cropBounds[i][0] - context.scrollY + shift;
      return { top, bottom: top + cropBounds[i][1], height: cropBounds[i][1] };
    };
    return image;
  });
  story.querySelectorAll = () => crops;
  const preference = new Element(); preference.matches = reduced;
  const document = new Element(); document.hidden = false; document.fonts = new Element(); document.fonts.ready = Promise.resolve(); document.documentElement = new Element();
  const footer = new Element();
  footer.getBoundingClientRect = () => ({ top: 14867 - context.scrollY, bottom: 16000 - context.scrollY });
  document.querySelector = () => withFooter ? footer : null;
  const window = new Element(), frames = new Map(), timers = new Map(); let id = 0, resize;
  const context = vm.createContext({ document, window, innerHeight: 900, innerWidth: width, scrollY: initialY,
    getComputedStyle: element => ({ objectPosition: element.base, position: context.innerWidth >= 901 && !preference.matches ? "sticky" : "static" }),
    AbortController, matchMedia: () => preference,
    requestAnimationFrame: fn => { frames.set(++id, fn); return id; }, cancelAnimationFrame: i => frames.delete(i),
    setTimeout: fn => { timers.set(++id, fn); return id; }, clearTimeout: i => timers.delete(i),
    ResizeObserver: class { constructor(fn) { resize = fn; } observe() {} disconnect() {} },
  });
  vm.runInContext(code, context);
  const dispose = context.mountStoryVideo(story);
  const flush = () => { const queue = [...frames.values()]; frames.clear(); queue.forEach(fn => fn()); };
  return { progress, chapterNumber, chapterName, stage, status, layers, preference, document, window, context, bounds, timers, dispose, flush, story, pin, track, crops, bbq: anchors["[data-life-eat-lead]"],
    layout() { resize(); flush(); },
    scroll(y) { context.scrollY = y; window.emit("scroll"); flush(); },
    resize(height) { context.innerHeight = height; window.emit("resize"); resize(); flush(); },
    reduced(value) { preference.matches = value; preference.emit("change"); flush(); },
    hidden(value) { document.hidden = value; document.emit("visibilitychange"); flush(); },
    settle() { const queue = [...timers.values()]; timers.clear(); queue.forEach(fn => fn()); },
  };
}
const microtasks = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };
const active = state => state.stage.dataset.lifeActiveScene;
const playing = state => state.layers.filter(l => !l.video.paused).map(l => l.key);
const s = setup(); await microtasks();
assert.deepEqual(playing(s), ["box"]);
assert.equal(s.stage.attrs.get("--life-shade"), "0.176");
assert.ok(s.layers.every(l => l.video.muted && l.video.defaultMuted && l.video.playsInline));
assert.deepEqual(s.layers.map(l => l.video.loads), [1,0,0], "Inactive films are not eagerly decoded");

// Exact measured boundaries in both directions, including rapid intermediate changes.
for (const [y, scene] of [[4384,"box"],[4385,"eat"],[8024,"eat"],[8025,"eat"],[13319,"eat"],[13320,"toast"],[9000,"eat"],[4700,"eat"],[0,"box"],[14000,"toast"],[4700,"eat"],[0,"box"]]) {
  s.scroll(y); await microtasks();
  assert.equal(active(s), scene);
  assert.ok(playing(s).every(key => key === scene));
}
s.settle();
assert.deepEqual(s.layers.filter(l => l.element.hasAttribute("data-on")).map(l => l.key), ["box"]);
assert.deepEqual(s.layers.filter(l => l.element.hasAttribute("data-top")).map(l => l.key), ["box"]);

// Golden shade samples calculated from the reference's 18 keyframes.
for (const [y, shade] of [[0,.176],[180,.2],[765,.34],[1360,.6],[1740,.6],[3650,.44],[4655,.14],[5294,.18],[5555,.26],[6125,.86],[7755,.9],[8610,.16],[8889,.4],[9429,.9],[12960,.92],[13680,.44],[13796,.4],[14417,1]]) {
  s.scroll(y);
  assert.equal(Number(s.stage.attrs.get("--life-shade")), shade, `Reference shade at scroll ${y}`);
}
// Reading shade must never interrupt the active background film.
for (const y of [6125,9429,12960]) {
  s.scroll(y); await microtasks();
  assert.ok(Number(s.stage.attrs.get("--life-shade")) >= .86);
  assert.deepEqual(playing(s), ["eat"], `The film keeps looping behind shaded copy at ${y}`);
}
s.scroll(14000); await microtasks();
assert.deepEqual(playing(s), ["toast"]);
s.scroll(4700); await microtasks(); assert.deepEqual(playing(s), ["eat"], "Scenes autoplay without user interaction");
s.hidden(true); assert.deepEqual(playing(s), []);
s.hidden(false); await microtasks(); assert.deepEqual(playing(s), ["eat"]);
s.window.emit("pagehide"); assert.deepEqual(playing(s), []);
s.window.emit("pageshow"); s.flush(); await microtasks(); assert.deepEqual(playing(s), ["eat"]);
s.reduced(true); assert.deepEqual(playing(s), []);
assert.ok(s.layers.every(l => !l.video.hasAttribute("data-ready")), "Reduced motion displays posters");
s.scroll(14000); assert.equal(active(s), "toast"); assert.deepEqual(playing(s), []);
s.reduced(false); await microtasks(); assert.deepEqual(playing(s), ["toast"]);
s.scroll(15000); assert.deepEqual(playing(s), []);

// Recalculate after viewport/orientation and delayed layout changes.
s.scroll(4400); assert.equal(active(s), "eat");
s.resize(700); assert.equal(active(s), "box");
s.bounds["#bridge-move-eat"][0] = 4300;
s.window.emit("orientationchange"); s.flush(); assert.equal(active(s), "eat");
s.dispose(); assert.deepEqual(playing(s), []);
s.scroll(0); s.reduced(false); s.hidden(false); await microtasks(); assert.deepEqual(playing(s), []);

const quiet = setup({ reduced: true }); await microtasks();
assert.deepEqual(quiet.layers.map(l => l.video.loads), [0,0,0]);
quiet.dispose();
const deep = setup({ initialY: 14000 }); await microtasks(); assert.deepEqual(playing(deep), ["toast"]); deep.dispose();

const footerFilm = setup({ withFooter: true, initialY: 14867 }); await microtasks();
assert.equal(Number(footerFilm.stage.attrs.get("--life-shade")), .4, "The footer keeps the closing film visible");
assert.deepEqual(playing(footerFilm), ["toast"], "The closing film continues behind the shared footer");
footerFilm.scroll(15100); await microtasks(); assert.deepEqual(playing(footerFilm), ["toast"]);
footerFilm.reduced(true); assert.deepEqual(playing(footerFilm), []);
footerFilm.reduced(false); await microtasks(); assert.deepEqual(playing(footerFilm), ["toast"]);
footerFilm.scroll(16000); assert.deepEqual(playing(footerFilm), []);
footerFilm.dispose();

// Rejected autoplay and actual media errors retain the poster without retry loops.
const failure = setup({ initialMode: "reject" }); await microtasks();
assert.ok(failure.status.textContent);
assert.equal(failure.layers[0].video.hasAttribute("data-ready"), false);
failure.scroll(100); await microtasks();
assert.equal(failure.layers[0].video.plays, 1, "Blocked autoplay must not retry on every scroll");
assert.deepEqual(playing(failure), []); failure.dispose();
const mediaError = setup(); await microtasks();
mediaError.layers[0].video.emit("error"); assert.deepEqual(playing(mediaError), []);
assert.equal(mediaError.layers[0].video.hasAttribute("data-ready"), false);
assert.ok(mediaError.status.textContent); mediaError.dispose();

// A stale play promise must not resurrect an inactive film or poison the new request.
const race = setup({ initialMode: "pending" });
const box = race.layers[0].video;
race.scroll(4700); race.scroll(0);
box.requests[0].reject(new Error("Interrupted by pause")); await microtasks();
assert.equal(race.status.textContent, "");
box.paused = false; box.emit("playing"); box.requests[1].resolve(); await microtasks();
assert.deepEqual(playing(race), ["box"]);
race.scroll(14000); box.paused = false; box.emit("playing"); assert.equal(box.paused, true);
race.dispose();
console.log("PASS staff wellbeing videos: three active scenes, 18 reference shade points, forward/reverse/rapid scroll, resize, autoplay, visibility, reduced motion, errors/posters, request races and cleanup");

// The overview extends the opening-to-MOVE gap without changing the film scene.
const overview = setup();
for (const [selector, bounds] of Object.entries(overview.bounds)) {
  if (selector !== "[data-life-opening]") { bounds[0] += 900; bounds[1] += 900; }
}
overview.layout();
for (const [y, fullyShaded] of [[450,false],[900,true],[1170,false],[1350,false],[900,true]]) {
  overview.scroll(y); await microtasks();
  const shade = Number(overview.stage.attrs.get("--life-shade"));
  if (fullyShaded) assert.equal(shade, .78, "The overview darkens the film for reading");
  else assert.ok(shade < .78, "The shade eases in and out at the overview boundaries");
  assert.equal(active(overview), "box");
  assert.deepEqual(playing(overview), ["box"], "The same film keeps playing behind the overview");
}
assert.equal(overview.progress.hasAttribute("data-visible"), false);
overview.reduced(true);
assert.deepEqual(playing(overview), []);
assert.equal(Number(overview.stage.attrs.get("--life-shade")), .78, "The poster remains readable with reduced motion");
overview.resize(700);
assert.equal(Number(overview.stage.attrs.get("--life-shade")), .78);
for (const [selector, bounds] of Object.entries(overview.bounds)) {
  if (selector !== "[data-life-opening]") { bounds[0] += 400; bounds[1] += 400; }
}
overview.layout(); overview.scroll(1550);
assert.equal(Number(overview.stage.attrs.get("--life-shade")), .78, "Reading shade follows a taller responsive overview");
overview.scroll(1850);
assert.ok(Number(overview.stage.attrs.get("--life-shade")) < .78);
assert.equal(overview.progress.hasAttribute("data-visible"), true, "Chapter progress starts at MOVE");
overview.dispose();
console.log("PASS wellbeing overview: continuous film, reading shade, forward/reverse edges, resized content and reduced-motion poster");

// Same coordinated RAF drives the horizontal sequence; no wheel or scroll owner.
for (const width of [1440,1280,1100,1024,901,900]) {
  const h = setup({ width });
  h.bounds["[data-life-hseq]"][1] = 3250; h.layout(); // 200vh region at 900px viewport height.
  const travel = 3400 - width;
  for (const [y, fraction] of [[0,0],[1450,0],[1900,.5],[2350,1],[3000,1],[1900,.5],[1450,0]]) {
    h.scroll(y);
    assert.equal(h.track.attrs.get("--hx"), width >= 901 ? (-fraction * travel).toFixed(1) + "px" : undefined);
  }
  h.dispose(); assert.equal(h.track.attrs.has("--hx"), false);
}
const h = setup({ width: 1440 }); h.bounds["[data-life-hseq]"][1] = 3250; h.scroll(1900); h.layout();
assert.equal(h.track.attrs.get("--hx"), "-980.0px");
h.track.scrollWidth = 3600; h.story.emit("load"); h.flush(); assert.equal(h.track.attrs.get("--hx"), "-1080.0px", "Image load updates overflow");
h.track.scrollWidth = 3800; h.document.fonts.emit("loadingdone"); h.flush(); assert.equal(h.track.attrs.get("--hx"), "-1180.0px", "Late font loading updates overflow");
h.pin.clientWidth = 1425; h.layout(); assert.equal(h.track.attrs.get("--hx"), "-1187.5px", "Scrollbar-width changes use actual pin width");
h.reduced(true); assert.equal(h.track.attrs.has("--hx"), false);
h.reduced(false); assert.equal(h.track.attrs.get("--hx"), "-1187.5px");
h.context.innerWidth = 900; h.resize(900); assert.equal(h.track.attrs.has("--hx"), false);
h.context.innerWidth = 901; h.pin.clientWidth = 901; h.resize(900); assert.equal(h.track.attrs.get("--hx"), "-1449.5px");
h.context.innerHeight = 700; h.bounds["[data-life-hseq]"][1] = 2850; h.window.emit("orientationchange"); h.flush();
assert.equal(h.track.attrs.get("--hx"), "-1863.6px");
h.track.scrollWidth = 700; h.layout(); assert.equal(h.track.attrs.get("--hx"), "0.0px", "No negative travel when the track fits");
h.dispose();
console.log("PASS MOVE horizontal: exact 901/900 switch, six widths, forward/reverse travel, endpoint clamp, resize/orientation, images/fonts, scrollbar width, reduced motion and cleanup");


for (const width of [1440,1024,768,720,719,390]) {
  const c = setup({ width }); const mobile = width <= 720;
  assert.equal(c.bbq.attrs.get("transform"), mobile ? "translate3d(4.80vw,7.20vh,0)" : "translate3d(12.00vw,18.00vh,0)");
  const slow = [];
  for (const y of [5540,5600,5700,5800,5900,6000,6100,6215,6400]) {
    c.scroll(y); slow.push(c.bbq.attrs.get("transform"));
    const before = c.bbq.attrs.get("transform");
    c.scroll(y); c.layout();
    assert.equal(c.bbq.attrs.get("transform"), before, "Repeated scroll/measurement cannot feed the translated BBQ box back into its approach");
  }
  assert.equal(c.bbq.attrs.has("transform"), false);
  assert.equal(c.crops[2].attrs.get("object-position"), mobile ? undefined : "42% 62.9%");
  for (const y of [6400,6215,6100,6000,5900,5800,5700,5600,5540]) {
    c.scroll(y);
    assert.equal(c.bbq.attrs.get("transform"), slow[[5540,5600,5700,5800,5900,6000,6100,6215,6400].indexOf(y)], "Reverse travel follows the same stable curve");
  }
  c.scroll(3000);
  assert.equal(c.crops[0].attrs.get("object-position"), mobile ? undefined : "42% 63.2%");
  c.scroll(6400); c.reduced(true);
  assert.equal(c.bbq.attrs.has("transform"), false);
  assert.ok(c.crops.every(i => !i.attrs.has("object-position")));
  c.reduced(false); c.scroll(5540);
  assert.equal(c.bbq.attrs.get("transform"), mobile ? "translate3d(4.80vw,7.20vh,0)" : "translate3d(12.00vw,18.00vh,0)");
  c.context.innerWidth = 720; c.resize(900);
  assert.ok(c.crops.every(i => !i.attrs.has("object-position")), "720px clears stale desktop parallax");
  c.dispose(); assert.equal(c.bbq.attrs.has("transform"), false);
}
const diagonal = setup({ width: 1440 });
diagonal.scroll(4700);
assert.equal(diagonal.layers[0].element.attrs.get("data-diagonal"), "a", "Forward: Boxing exits upper-left at .94 scale");
assert.equal(diagonal.layers[1].element.hasAttribute("data-diagonal"), false, "Eating travels from b to its neutral position");
diagonal.scroll(0);
assert.equal(diagonal.layers[1].element.attrs.get("data-diagonal"), "b", "Reverse: Eating exits lower-right at 1.04 scale");
assert.equal(diagonal.layers[0].element.hasAttribute("data-diagonal"), false);
diagonal.scroll(4700); diagonal.settle(); diagonal.settle();
assert.ok(diagonal.layers.every(l => !l.element.hasAttribute("data-diagonal")), "Stale exit transforms are removed after the fade");
diagonal.scroll(14000); assert.ok(diagonal.layers.every(l => !l.element.hasAttribute("data-diagonal")), "Toast remains a plain crossfade");
diagonal.scroll(0); diagonal.scroll(4700); diagonal.reduced(true);
assert.ok(diagonal.layers.every(l => !l.element.hasAttribute("data-diagonal")));
diagonal.dispose();
console.log("PASS composition: source scene directions, rapid reversal/cleanup, six widths, stable BBQ curve/re-measurement, 40% mobile approach, object-position-only crop drift and reduced-motion reset");

// Source progress uses viewport centre, spans all four chapters and excludes closing.
const ui = setup();
for (const [y, number, name, visible] of [
  [0,"01","Vitality",false], [449,"01","Vitality",false], [450,"01","Vitality",true],
  [5023,"01","Vitality",true], [5024,"02","食卓から、つながる。",true],
  [8978,"02","食卓から、つながる。",true], [8979,"03","健やかさが、暮らしに続く。",true],
  [11949,"03","健やかさが、暮らしに続く。",true], [11950,"04","学びと成長",true],
  [13139,"04","学びと成長",true], [13140,"04","学びと成長",false],
  [14000,"04","学びと成長",false], [11950,"04","学びと成長",true],
  [11949,"03","健やかさが、暮らしに続く。",true], [8979,"03","健やかさが、暮らしに続く。",true],
  [5024,"02","食卓から、つながる。",true], [450,"01","Vitality",true],
]) {
  ui.scroll(y);
  assert.equal(ui.progress.hasAttribute("data-visible"), visible);
  if (visible) {
    assert.equal(ui.chapterNumber.textContent, number);
    assert.equal(ui.chapterName.textContent, name);
    assert.equal(ui.progress.attrs.get("--pp"), ((y + 450 - 900) / (13860 - 900)).toFixed(4));
  }
}
ui.scroll(11950); ui.reduced(true);
assert.equal(ui.chapterNumber.textContent, "04", "Growth remains identifiable with reduced motion");
assert.equal(ui.chapterName.textContent, "学びと成長");
assert.ok(Number(ui.stage.attrs.get("--life-shade")) >= .9, "Growth retains the dark reading shade");
assert.deepEqual(playing(ui), []);
ui.reduced(false);
ui.scroll(5024); ui.reduced(true);
assert.equal(ui.progress.hasAttribute("data-visible"), true, "Reduced motion retains reading progress");
assert.equal(ui.chapterName.textContent, "食卓から、つながる。");
assert.deepEqual(playing(ui), []);
ui.reduced(false); await microtasks(); assert.deepEqual(playing(ui), ["eat"]);
ui.scroll(5024); ui.resize(700);
assert.equal(ui.chapterName.textContent, "Vitality", "Progress remeasures viewport-centre thresholds");
ui.bounds["#eat"][0] -= 200; ui.layout(); assert.equal(ui.chapterName.textContent, "食卓から、つながる。");
ui.dispose(); assert.equal(ui.progress.hasAttribute("data-visible"), false); assert.equal(ui.progress.attrs.has("--pp"), false);
console.log("PASS story UI: four chapters including Growth, source visibility/continuous progress, reverse navigation, resize/layout, reduced motion, reading shade and cleanup");

const idleLabels = setup(); await microtasks(); idleLabels.scroll(1000); await microtasks();
const writes = [idleLabels.chapterNumber, idleLabels.chapterName].map(e => e.textWrites);
for (let y = 1001; y < 1100; y++) idleLabels.scroll(y);
assert.deepEqual([idleLabels.chapterNumber, idleLabels.chapterName].map(e => e.textWrites), writes, "Scrolling within a chapter must not recreate unchanged label text nodes");
idleLabels.dispose();
console.log("PASS scroll UI avoids unchanged text-node writes");

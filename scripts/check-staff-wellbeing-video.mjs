import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../src/components/staff-wellbeing/story-controller.ts", import.meta.url), "utf8");
assert.doesNotMatch(source, /currentTime\s*=/, "Scrolling never seeks a film");
const code = ts.transpile(source.replaceAll("export function", "function"), { target: ts.ScriptTarget.ES2022 });
class Element {
  textContent = ""; attrs = new Map(); dataset = {}; listeners = new Map();
  style = { setProperty: (k,v) => this.attrs.set(k,v), removeProperty: k => this.attrs.delete(k) };
  addEventListener(name, fn, options = {}) { const list = this.listeners.get(name) || []; list.push({fn,signal:options.signal}); this.listeners.set(name,list); }
  emit(name) { for (const {fn,signal} of this.listeners.get(name) || []) if (!signal?.aborted) fn(); }
  setAttribute(k,v) { this.attrs.set(k,v); } removeAttribute(k) { this.attrs.delete(k); }
  hasAttribute(k) { return this.attrs.has(k); } toggleAttribute(k,on) { if(on) this.setAttribute(k,""); else this.removeAttribute(k); }
}
class Video extends Element {
  paused = true; loads = 0; plays = 0; mode = "normal"; requests = [];
  load() { this.loads++; } pause() { this.paused = true; }
  play() {
    this.plays++;
    if(this.mode === "reject") return Promise.reject(new Error("Autoplay rejected"));
    if(this.mode === "pending") return new Promise((resolve,reject) => this.requests.push({resolve,reject}));
    this.paused = false; this.emit("playing"); return Promise.resolve();
  }
}
function setup({width = 1440, initialY = 0, reduced = false, mode = "normal"} = {}) {
  const stage = new Element(), status = new Element(), progress = new Element(), number = new Element(), name = new Element(), toggle = new Element(), story = new Element();
  progress.querySelector = selector => selector === "[data-life-progress-number]" ? number : name;
  const layers = ["box","ball","eat","toast"].map(key => {
    const element = new Element(), video = new Video(); video.mode = mode;
    element.dataset.lifeSceneLayer = key; element.querySelector = () => video;
    return {key,element,video};
  });
  stage.querySelectorAll = () => layers.map(l => l.element);
  const bounds = {"[data-life-opening]":[0,900],"#move":[900,2610],"[data-life-move-body]":[1800,2610],"#mind":[2610,3645],"#eat":[3645,5040],"[data-life-closing]":[4400,5040],"[data-life-story-end]":[5040,5436]};
  const anchors = Object.fromEntries(Object.entries(bounds).map(([key,b]) => {
    const el = new Element(); el.getBoundingClientRect = () => ({top:b[0]-context.scrollY,bottom:b[1]-context.scrollY,height:b[1]-b[0]}); return [key,el];
  }));
  const pin = new Element(), track = new Element(); pin.clientWidth = width; track.scrollWidth = width * 2;
  anchors["#move"].querySelector = selector => selector === "[data-life-hseq-pin]" ? pin : track;
  story.querySelector = selector => ({"[data-life-stage]":stage,"[data-life-video-status]":status,"[data-life-progress]":progress,"[data-life-video-toggle]":toggle}[selector] || anchors[selector]);
  const preference = new Element(); preference.matches = reduced;
  const document = new Element(), window = new Element(); document.hidden = false; document.fonts = new Element(); document.fonts.ready = Promise.resolve(); document.documentElement = new Element();
  const footer = new Element(); footer.getBoundingClientRect = () => ({bottom:6000-context.scrollY}); document.querySelector = () => footer;
  const frames = new Map(), timers = new Map(); let id = 0, resize;
  const context = vm.createContext({document,window,innerHeight:900,innerWidth:width,scrollY:initialY,AbortController,matchMedia:()=>preference,
    getComputedStyle:()=>({position:context.innerWidth >= 761 && !preference.matches ? "sticky" : "static"}),
    requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:key=>frames.delete(key),
    setTimeout:fn=>{timers.set(++id,fn);return id;},clearTimeout:key=>timers.delete(key),
    ResizeObserver:class{constructor(fn){resize=fn;}observe(){}disconnect(){}},
  });
  vm.runInContext(code,context);
  const dispose = context.mountStoryVideo(story);
  const flush = () => {const queue=[...frames.values()];frames.clear();queue.forEach(fn=>fn());};
  return {stage,status,progress,number,name,toggle,layers,preference,document,window,context,bounds,track,dispose,
    scroll(y){context.scrollY=y;window.emit("scroll");flush();},
    reduced(value){preference.matches=value;preference.emit("change");flush();},
    hidden(value){document.hidden=value;document.emit("visibilitychange");flush();},
    click(){toggle.emit("click");flush();},
    layout(){resize();flush();},
    settle(){const queue=[...timers.values()];timers.clear();queue.forEach(fn=>fn());},
  };
}
const tick = async () => {for(let i=0;i<5;i++) await Promise.resolve();};
const playing = s => s.layers.filter(l=>!l.video.paused).map(l=>l.key);
const s=setup(); await tick();
assert.deepEqual(playing(s),["box"]);
assert.equal(s.stage.attrs.get("--life-shade"),"0.176","Hero shading is preserved");
assert.equal(s.stage.hasAttribute("data-after-hero"),false);
assert.equal(s.toggle.hidden,true,"No new control appears over the hero");
assert.deepEqual(s.layers.map(l=>l.video.loads),[1,0,0,0]);
assert.ok(s.layers.every(l=>l.video.muted && l.video.defaultMuted && l.video.playsInline));
for(const [y,scene] of [[900,"box"],[1305,"box"],[1306,"ball"],[2200,"ball"],[3200,"eat"],[3950,"toast"],[3200,"eat"],[2200,"ball"],[0,"box"]]){
  s.scroll(y);await tick();assert.equal(s.stage.dataset.lifeActiveScene,scene);assert.deepEqual(playing(s),[scene]);
}
s.settle();s.settle();assert.ok(s.layers.every(l=>!l.element.hasAttribute("data-diagonal")),"Rapid reversals clean up exit transforms");
for(const [y,number,name] of [[900,"01","身体の健康"],[2200,"02","学びと気づき"],[3200,"03","人とのつながり"]]){
  s.scroll(y);assert.equal(s.number.textContent,number);assert.equal(s.name.textContent,name);assert.equal(s.progress.hasAttribute("data-visible"),true);
}
s.scroll(3950);assert.equal(s.progress.hasAttribute("data-visible"),false);
s.click();await tick();assert.deepEqual(playing(s),[]);assert.equal(s.toggle.attrs.get("aria-pressed"),"true");
s.click();await tick();assert.deepEqual(playing(s),["toast"]);
s.hidden(true);assert.deepEqual(playing(s),[]);s.hidden(false);await tick();assert.deepEqual(playing(s),["toast"]);
s.window.emit("pagehide");assert.deepEqual(playing(s),[]);s.window.emit("pageshow");s.layout();await tick();assert.deepEqual(playing(s),["toast"]);
s.reduced(true);assert.deepEqual(playing(s),[]);assert.equal(s.toggle.disabled,true);assert.ok(s.layers.every(l=>!l.video.hasAttribute("data-ready")));assert.equal(s.track.attrs.has("--hx"),false);
s.reduced(false);await tick();assert.deepEqual(playing(s),["toast"]);
s.scroll(5500);await tick();assert.deepEqual(playing(s),["toast"],"The film continues behind the shared footer");
s.scroll(6000);assert.deepEqual(playing(s),[]);
s.dispose();s.scroll(0);s.hidden(false);await tick();assert.deepEqual(playing(s),[]);
for(const width of [1440,1024,761,760,390]){
  const h=setup({width});h.scroll(1305);
  assert.equal(h.track.attrs.get("--hx"),width>=761?(-width*.5).toFixed(1)+"px":undefined);
  h.reduced(true);assert.equal(h.track.attrs.has("--hx"),false);h.dispose();
}
const quiet=setup({reduced:true});assert.deepEqual(quiet.layers.map(l=>l.video.loads),[0,0,0,0]);quiet.dispose();
const deep=setup({initialY:3950});await tick();assert.deepEqual(deep.layers.map(l=>l.video.loads),[0,0,0,1]);deep.dispose();
const failure=setup({mode:"reject"});await tick();assert.ok(failure.status.textContent);failure.scroll(100);await tick();assert.equal(failure.layers[0].video.plays,1,"Blocked autoplay does not retry on every scroll");failure.dispose();
const error=setup();await tick();error.layers[0].video.emit("error");assert.deepEqual(playing(error),[]);assert.ok(error.status.textContent);error.dispose();
const race=setup({mode:"pending"});const box=race.layers[0].video;race.scroll(3200);race.scroll(0);box.requests[0].reject(new Error("Interrupted"));await tick();assert.equal(race.status.textContent,"");box.paused=false;box.emit("playing");box.requests[1].resolve();await tick();assert.deepEqual(playing(race),["box"]);race.scroll(3950);box.paused=false;box.emit("playing");assert.equal(box.paused,true);race.dispose();
console.log("PASS wellbeing: hero shade, three chapters, horizontal boundaries, diagonal cleanup, pause/resume, lazy media, visibility, reduced motion, footer playback, errors, stale promises and teardown");

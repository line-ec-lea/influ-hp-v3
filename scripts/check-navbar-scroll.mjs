import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/components/shared/Navbar.astro", import.meta.url), "utf8");
const routesSource = await readFile(new URL("../src/components/shared/features/routes.ts", import.meta.url), "utf8");
const routes = new Function(ts.transpile(routesSource.replace("export const routes =", "return")))();
const navigationSource = await readFile(new URL("../src/components/shared/features/navigation.ts", import.meta.url), "utf8");
const siteNavItems = new Function("routes", ts.transpile(navigationSource.replace(/^import .*$/m, "").replace("export const siteNavItems =", "return")))(routes);
const navigation = new Function("Astro", "siteNavItems", "routes", ts.transpile(source.split("---")[1].replace(/^import .*$/gm, "") + "\nreturn navItems;"));
for (const [pathname, current, serviceActive] of [
  ["/", routes.home, false],
  ["/business-content/", routes.service, true],
  ["/ai-homepage", undefined, true],
  ["/ax-support", undefined, true],
  ["/staff-blog/example", routes.staffBlog, false],
  ["/staff-blog/page/2", routes.staffBlog, false],
  ["/staff-blog-other", undefined, false],
]) {
  const items = navigation({ url: { pathname } }, siteNavItems, routes);
  assert.deepEqual(items.map(item => item.href), [routes.home, routes.service, routes.company, routes.companyAchievements, routes.usefulMaterials, routes.staffBlog]);
  assert.deepEqual(items.filter(item => item.active).map(item => item.href), current ? [current] : [], pathname);
  assert.equal(items.find(item => item.href === routes.service).serviceActive, serviceActive, pathname);
}
console.log("PASS shared navbar items, nested routes, trailing slash and service highlighting");
const logic = source.slice(source.indexOf("  let lastScroll"), source.indexOf("  async function setMobile"));
for (const reduced of [false, true]) {
  const window = { scrollY: 0, addEventListener() {} };
  const document = { activeElement: null };
  let solid = false, y = "0%";
  const header = { contains: element => element === header, toggleAttribute: (name, value) => { solid = value; }, addEventListener() {} };
  const api = new Function("window", "document", "header", "animate", "reducedMotion", "ease", "queueMicrotask", ts.transpile(`let menuOpen = false, servicesOpen = false, isHome = true;\n${logic}\nreturn { scroll(position) { window.scrollY = position; updateHeader(); }, menu(open) { menuOpen = open; updateHeader(); }, services(open) { servicesOpen = open; updateHeader(); } };`, { target: ts.ScriptTarget.ES2022 }))(window, document, header, (_, frames, options) => { y = frames.y; assert.equal(options.duration, reduced ? 0 : 0.2); }, { matches: reduced }, [], callback => callback());
  assert.equal(solid, false);
  api.scroll(150); assert.equal(y, "-100%");
  api.scroll(147); assert.equal(y, "-100%", "Small movements should not flicker");
  api.scroll(140); assert.equal(y, "0%"); assert.equal(solid, true);
  api.scroll(200); api.menu(true); assert.equal(y, "0%");
  api.scroll(300); assert.equal(y, "0%", "Open mobile menu stays visible");
  api.menu(false); api.scroll(400); assert.equal(y, "-100%");
  api.services(true); api.scroll(500); assert.equal(y, "0%");
  api.services(false); document.activeElement = header; api.scroll(600); assert.equal(y, "0%", "Keyboard focus keeps navigation visible");
  document.activeElement = null; api.scroll(700); assert.equal(y, "-100%");
  api.scroll(0); assert.equal(y, "0%"); assert.equal(solid, false);
}
console.log("PASS navbar scroll direction, movement threshold, open menus, keyboard focus, reduced motion and top reset");

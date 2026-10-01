import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import config from "../astro.config.mjs";
import { AstroCache, applyCacheHeaders } from "../node_modules/astro/dist/core/cache/runtime/cache.js";
import { compileCacheRoutes, matchCacheRoute } from "../node_modules/astro/dist/core/cache/runtime/route-matching.js";
import createProvider from "../node_modules/@astrojs/cloudflare/dist/cache/provider.js";
import { applyCloudflareResponseHeaders } from "../node_modules/@astrojs/cloudflare/dist/utils/response.js";

// Load the handler without Astro's virtual module so this runs with plain Node.
const legacySource = await readFile(new URL("../src/lib/legacy-redirects.ts", import.meta.url), "utf8");
const legacyModule = `data:text/javascript;base64,${Buffer.from(ts.transpile(legacySource, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext })).toString("base64")}`;
const { legacyRedirectTarget } = await import(legacyModule);
const source = (await readFile(new URL("../src/middleware.ts", import.meta.url), "utf8"))
  .replace(/import .*?;\n/, "const defineMiddleware = handler => handler;\n")
  .replace('"./lib/legacy-redirects"', JSON.stringify(legacyModule));
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
const redirect = Response.redirect("https://example.com/login", 302);
assert.throws(() => redirect.headers.set("X-Test", "1"), TypeError);
const cookieSymbol = Symbol.for("astro.cookies");
const cookies = {};
Reflect.set(redirect, cookieSymbol, cookies);
const response = await onRequest(
  { url: new URL("https://influ-hp-v3.influ.workers.dev/_emdash/oauth/authorize") },
  async () => redirect,
);
assert.equal(response.status, 302);
assert.equal(response.headers.get("location"), "https://example.com/login");
assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow, noarchive, nosnippet");
assert.equal(Reflect.get(response, cookieSymbol), cookies);
const ordinary = new Response("OK");
assert.equal(await onRequest({ url: new URL("https://influhp.com") }, async () => ordinary), ordinary);

// Check every fixed mapping and article slug, including encoded Japanese categories.
const pages = legacySource.match(/const PAGE_REDIRECTS[^=]*= (\{[\s\S]*?\n\})/)[1];
const categories = legacySource.match(/const CATEGORY_REDIRECTS[^=]*= (\{[\s\S]*?\n\})/)[1];
const posts = JSON.parse(legacySource.match(/const WP_POST_SLUGS = new Set\((\[[\s\S]*?\n\])\)/)[1].replace(/,\s*\]/, "]"));
const cases = [
  ...Object.entries(Function(`return (${pages})`)()),
  ...Object.entries(Function(`return (${categories})`)()).map(([slug, target]) => [`/category/${encodeURIComponent(slug)}`, `/useful-materials/category/${target}/page/1`]),
  ...posts.map(slug => [`/${slug}`, `/useful-materials/${slug}`]),
  ["/staffreport/post-123", "/staff-blog/post-123"],
  ["/staffreport/staffreport-456", "/staff-blog/staffreport-456"],
  ["/our-performance/our-performance-12", "/company-achievements/our-performance-12"],
];
for (const [path, target] of cases) {
  for (const suffix of ["", "/"]) {
    assert.equal(legacyRedirectTarget(path + suffix), target);
    for (const origin of ["https://influhp.com", "https://influ-hp-v3.influ.workers.dev"]) {
      const result = await onRequest({
        url: new URL(`${path}${suffix}?utm_source=legacy`, origin),
        redirect: (location, status) => new Response(null, { status, headers: { location } }),
      }, () => assert.fail("Legacy URLs must redirect before rendering"));
      assert.equal(result.status, 301);
      assert.equal(result.headers.get("location"), target);
      assert.equal(result.headers.get("X-Robots-Tag"), origin.endsWith(".workers.dev") ? "noindex, nofollow, noarchive, nosnippet" : null);
    }
  }
}
for (const path of ["/", "/unknown", "/category/unknown", "/category/toString", "/category/__proto__", "/toString", "/constructor", "/%E0%A4%A", "/staffreport/unknown", "/our-performance/unknown", "/business-content", "/useful-materials/line-works", "/_emdash/admin"]) {
  assert.equal(legacyRedirectTarget(path), null, path);
  assert.equal(await onRequest({ url: new URL(path, "https://influhp.com") }, async () => ordinary), ordinary);
}
console.log(`PASS ${cases.length} legacy mappings, trailing slashes, encoded categories, 301 responses, fallthrough, preview headers, and OAuth cookie metadata`);

assert.equal(config.cache.provider.name, "cloudflare");
const routes = compileCacheRoutes(config.routeRules, "/", "ignore");
for (const path of ["/", "/business-content", "/company-profile", "/ai-homepage", "/ax-support", "/privacy-policy", "/staff-blog/post-123", "/company-achievements/page/1", "/useful-materials/category/ec/page/1"]) {
  const rule = matchCacheRoute(path, routes);
  assert.deepEqual(rule, { maxAge: 300, swr: 60 }, path);
}
for (const path of ["/_emdash/admin", "/_emdash/api/content", "/sitemap.xml", "/robots.txt", "/unknown"]) {
  assert.equal(matchCacheRoute(path, routes), null, path);
}
for (const [status, cacheControl, shouldCache] of [[200, null, true], [404, null, false], [500, null, false], [301, null, false], [200, "private, no-store", false], [200, "no-store", false]]) {
  const request = new Request("https://influhp.com/useful-materials/line-works");
  const cache = new AstroCache(createProvider());
  cache.set(matchCacheRoute(new URL(request.url).pathname, routes));
  // EmDash's existing query hints add publishing invalidation tags to route rules.
  cache.set({ tags: ["collection:useful_materials"], lastModified: new Date("2026-10-01T00:00:00Z") });
  const response = await onRequest({ url: new URL(request.url), cache }, async () => new Response("Content", {
    status, headers: cacheControl ? { "Cache-Control": cacheControl } : {},
  }));
  applyCacheHeaders(cache, response, request);
  applyCloudflareResponseHeaders(response, [], true);
  assert.equal(response.headers.get("Cloudflare-CDN-Cache-Control"), shouldCache ? "public, max-age=300, stale-while-revalidate=60" : "no-store");
  assert.equal(response.headers.has("Cache-Tag"), shouldCache);
  if (shouldCache) assert.ok(response.headers.get("Cache-Tag").includes("collection:useful_materials"));
}
console.log("PASS Workers cache route rules, content tags, and no-store for errors, redirects, and private responses");

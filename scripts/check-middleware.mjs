import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

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

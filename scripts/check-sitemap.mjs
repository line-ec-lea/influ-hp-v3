import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Exercise the actual route with controlled CMS responses.
const source = (await readFile(new URL("../src/pages/sitemap.xml.ts", import.meta.url), "utf8"))
  .replace(/^import .*;\n/gm, "").replace("export async function GET", "async function GET");
const createHandler = new Function("getEmDashCollection", "siteNavItems", "SITE_URL", "console", `${source}\nreturn GET;`);
const collections = ["company_achievements", "useful_materials", "staff_blog"];
for (const failedCollection of [undefined, ...collections]) {
  const failure = new Error("CMS unavailable");
  const logs = [];
  const GET = createHandler(async collection => collection === failedCollection
    ? { entries: [], error: failure }
    : { entries: [{ id: `${collection}-post` }] }, [{ href: "/" }], "https://influhp.com", { error: (...args) => logs.push(args) });
  const response = await GET();
  const body = await response.text();
  assert.equal(response.status, failedCollection ? 500 : 200);
  if (failedCollection) {
    assert.equal(body, "Unable to load sitemap");
    assert.equal(logs[0][1], failure);
    assert.ok(!body.includes("<urlset"));
  } else {
    assert.equal(response.headers.get("Content-Type"), "application/xml; charset=utf-8");
    for (const path of ["/", "/privacy-policy", "/company-achievements/company_achievements-post", "/useful-materials/useful_materials-post", "/staff-blog/staff_blog-post"])
      assert.ok(body.includes(`<loc>https://influhp.com${path}</loc>`), path);
    assert.equal(logs.length, 0);
  }
}
const emptyGET = createHandler(async () => ({ entries: [] }), [{ href: "/" }], "https://influhp.com", console);
assert.equal((await emptyGET()).status, 200, "Empty collections are valid");
console.log("PASS sitemap: complete XML on success, 500 for failure in each collection, empty collections remain valid");

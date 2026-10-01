import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

// Execute the actual component frontmatter with a controlled CMS response.
const source = (await readFile(new URL("../src/components/shared/EditorialArticle.astro", import.meta.url), "utf8"))
  .split("---")[1].replace(/^import[\s\S]*?;\n/gm, "");
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const render = new AsyncFunction("Astro", "getEmDashCollection", "SITE_URL", "console",
  ts.transpile(source, { target: ts.ScriptTarget.ES2022 }) + "\nreturn { relatedEntries, headings, publishedDate };");
for (const collection of ["company_achievements", "useful_materials", "staff_blog"]) {
  const entry = { id: "current", data: { title: "Article", publishedAt: new Date("2026-09-26T00:00:00Z"),
    content: [{ _type: "block", _key: "intro", style: "h2", children: [{ text: "Introduction" }] }] } };
  for (const failed of [false, true]) {
    const logs = [], hints = [];
    const error = failed ? new Error("CMS query failed") : undefined;
    const result = await render({ props: { entry, collection, basePath: "/posts" },
      cache: { enabled: true, set: hint => hints.push(hint) } }, async () => ({
      entries: [entry, ...[1, 2, 3, 4, 5].map(id => ({ id: String(id) }))], error, cacheHint: "hint",
    }), "https://influhp.com", { error: (...args) => logs.push(args) });
    assert.deepEqual(result.relatedEntries.map(item => item.id), failed ? [] : ["1", "2", "3", "4"]);
    assert.deepEqual(result.headings, [{ id: "heading-intro", text: "Introduction" }]);
    assert.ok(result.publishedDate);
    assert.deepEqual(hints, failed ? [] : ["hint"]);
    assert.equal(logs.length, failed ? 1 : 0);
    if (failed) assert.equal(logs[0][1], error);
  }
}
console.log("PASS related articles: CMS failure preserves article metadata and TOC; success excludes current article and limits recommendations");

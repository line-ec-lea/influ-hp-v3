import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

// Execute each route's actual frontmatter with controlled CMS responses.
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const paths = [
  ...["company-achievements", "useful-materials", "staff-blog"].flatMap(section => [
    `${section}/[slug].astro`,
    `${section}/page/[pageNo].astro`,
  ]),
  "useful-materials/category/[categorySlug]/page/[pageNo].astro",
];

for (const path of paths) {
  const source = (await readFile(new URL(`../src/pages/${path}`, import.meta.url), "utf8"))
    .split("---")[1].replace(/^import .*;\n/gm, "");
  const run = new AsyncFunction("Astro", "getEmDashEntry", "decodeSlug", "loadEditorialArchive", "getTerm", "console",
    ts.transpile(source, { target: ts.ScriptTarget.ES2022 }));
  const article = path.endsWith("[slug].astro");

  for (const state of ["failure", "success", "missing"]) {
    const logs = [], hints = [];
    const error = state === "failure" ? new Error("CMS query failed") : undefined;
    const entry = state === "missing" ? undefined : { data: { title: "Article" } };
    const query = async () => ({ error, entry, entries: entry ? [entry] : [], cacheHint: "hint" });
    const response = await run({
      params: { slug: "article", pageNo: state === "missing" ? "2" : "1", categorySlug: "category" },
      cache: { enabled: true, set: hint => hints.push(hint) },
      rewrite: () => new Response("Not found", { status: 404 }),
    }, query, value => value, query, async () => ({ slug: "category", label: "Category" }),
    { error: (...args) => logs.push(args) });

    if (error) {
      assert.equal(response.status, 500, path);
      assert.equal(await response.text(), `Unable to load ${article ? "article" : "archive"}`, path);
      assert.equal(logs.length, 1, path);
      assert.equal(logs[0][1], error, `${path}: log the original error for its stack trace`);
      assert.equal(hints.length, 0, `${path}: never cache a failed CMS query`);
    } else {
      assert.equal(logs.length, 0, `${path}: success and missing content are not errors`);
      if (state === "missing") assert.equal(response.status, 404, path);
      else assert.equal(response, undefined, `${path}: continue rendering on success`);
    }
  }
}
console.log("PASS seven editorial routes: logged CMS failures return 500; success and missing content remain quiet");

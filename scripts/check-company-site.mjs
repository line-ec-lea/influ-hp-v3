import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

// Tailwind handles styling; original motion components retain their runtime styles.
// The deferred blog's CSS must stay independent.
const source = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");
const css = await source("src/styles/global.css");
assert.match(css, /@import "tailwindcss";/);
assert.equal(
  css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/@import "tailwindcss";/g, "")
    .replace(/@theme inline\s*\{[^{}]*\}/g, "")
    .trim(),
  "",
  "global.css contains only Tailwind setup and theme values",
);
assert.match(await source("src/layouts/Company.astro"), /styles\/global\.css/);
assert.doesNotMatch(
  await source("src/layouts/Company.astro"),
  /styles\/(?:company|tokens|theme)\.css/,
);
await assert.rejects(source("src/styles/company.css"), { code: "ENOENT" });
await assert.rejects(readdir(new URL("../src/components/company/app/", import.meta.url)), { code: "ENOENT" });
const companyFiles = [
  "src/layouts/Company.astro",
  ...[
    "index",
    "business-content",
    "company-profile",
    "ai-homepage",
    "ax-support",
    "privacy-policy",
    "404",
  ].map((name) => `src/pages/${name}.astro`),
  ...(await readdir(new URL("../src/components/company/", import.meta.url), { recursive: true }))
    .filter((name) => /\.(astro|tsx|ts)$/.test(name))
    .map((name) => `src/components/company/${name}`),
];
for (const path of companyFiles) {
  assert.doesNotMatch(
    await source(path),
    /<style\b|@apply\b/,
    `${path}: use Tailwind utilities`,
  );
  assert.doesNotMatch(await source(path), /from ["']next(?:\/[^"']*)?["']/, `${path}: no Next runtime`);
  assert.doesNotMatch(await source(path), /(?:@company|company|\.)\/app\//, `${path}: no removed app nesting`);
}
console.log("PASS Tailwind-only company styling");

// Run against the local preview: node scripts/check-company-site.mjs [base-url]
const base = process.argv[2] ?? "http://localhost:4321";
const paths = [
  "/",
  "/business-content",
  "/company-profile",
  "/ai-homepage",
  "/ax-support",
  "/privacy-policy",
];
const assets = new Set();
for (const path of paths) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.doesNotMatch(
    html,
    /<button\b[^>]*\bdata-theme=/,
    `${path}: no theme toggle`,
  );
  assert.match(html, /<html[^>]*lang="ja"/, `${path}: Japanese document`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one h1`);
  assert.ok(
    html.includes(`href="https://influhp.com${path === "/" ? "/" : path}"`),
    `${path}: canonical`,
  );
  assert.match(
    html,
    /name="robots" content="noindex, nofollow"/,
    `${path}: preview noindex`,
  );
  assert.doesNotMatch(
    html,
    /href="\/(?:posts|staff-blog|company-achievements?|useful-materials)(?:["/])/,
    `${path}: no deferred content links`,
  );
  assert.match(html, /client="load"/, `${path}: immediate React hydration configured`);
  assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${path}: one main landmark`);
  for (const match of html.matchAll(/<img[^>]+src="(\/[^"?]+)"/g))
    assets.add(match[1]);
  console.log(`PASS ${path}`);
}
for (const asset of assets) {
  assert.equal(
    (await fetch(new URL(asset, base), { method: "HEAD" })).status,
    200,
    asset,
  );
}
const redirect = await fetch(new URL("/home", base), { redirect: "manual" });
assert.equal(redirect.status, 308);
assert.equal(redirect.headers.get("location"), "/");
const missing = await fetch(new URL("/not-a-real-influ-page", base));
assert.equal(missing.status, 404);
assert.match(await missing.text(), /ページが/);
const sitemap = await (await fetch(new URL("/sitemap.xml", base))).text();
assert.equal((sitemap.match(/<loc>/g) ?? []).length, paths.length);
assert.doesNotMatch(sitemap, /posts|staff-blog|company-achievements|useful-materials/);
for (const excluded of ["staff-blog", "company-achievements", "useful-materials"]) {
  for (const suffix of ["", "/page/1", "/example-article"]) {
    assert.equal((await fetch(new URL(`/${excluded}${suffix}`, base))).status, 404, `${excluded}${suffix}: excluded`);
  }
}
assert.equal(
  await (await fetch(new URL("/robots.txt", base))).text(),
  "User-agent: *\nDisallow: /\n",
);
console.log(
  `PASS ${assets.size} image assets, redirect, 404, sitemap and preview robots`,
);

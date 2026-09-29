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
  "src/pages/company-achievements/index.astro",
  "src/pages/company-achievements/[slug].astro",
  "src/pages/company-achievements/page/[pageNo].astro",
  "src/pages/useful-materials/index.astro",
  "src/pages/useful-materials/[slug].astro",
  "src/pages/useful-materials/page/[pageNo].astro",
  "src/pages/useful-materials/category/[categorySlug]/index.astro",
  "src/pages/useful-materials/category/[categorySlug]/page/[pageNo].astro",
  "src/pages/staff-blog/index.astro",
  "src/pages/staff-blog/[slug].astro",
  "src/pages/staff-blog/page/[pageNo].astro",
  ...(await Promise.all(["home", "shared", "business-content", "company-profile", "ai-homepage", "ax-support", "privacy-policy", "not-found"].map(async folder =>
    (await readdir(new URL(`../src/components/${folder}/`, import.meta.url), { recursive: true }))
      .filter(name => /\.(astro|tsx|ts)$/.test(name))
      .map(name => `src/components/${folder}/${name}`)
  ))).flat(),
];
for (const path of companyFiles) {
  assert.doesNotMatch(
    await source(path),
    /<style\b|@apply\b/,
    `${path}: use Tailwind utilities`,
  );
  assert.doesNotMatch(await source(path), /from ["']next(?:\/[^"']*)?["']/, `${path}: no Next runtime`);
  assert.doesNotMatch(await source(path), /(?:@company|company|\.)\/app\//, `${path}: no removed app nesting`);
  assert.doesNotMatch(await source(path), /client:load|@shared\/react|from ["']react["']|from ["']framer-motion["']/, `${path}: native Astro and DOM motion`);
  assert.ok(!path.endsWith(".tsx"), `${path}: no public React components`);
}
console.log("PASS Tailwind-only company styling");

const home = await source("src/pages/index.astro");
for (const section of ["Hero", "WhatWeDo", "Services", "WhyInflu", "SuitableConsultations"]) {
  assert.match(home, new RegExp(`import ${section} from "../components/home/${section}\\.astro"`));
  assert.ok(home.includes(`<${section} />`), `homepage: composes ${section}`);
}
assert.match(home, /import Contact from "@shared\/Contact\.astro"/);
const layout = await source("src/layouts/Company.astro");
for (const component of ["Navbar", "Footer"]) {
  assert.ok(layout.includes(`<${component} />`), `layout owns ${component}`);
  assert.doesNotMatch(home, new RegExp(`<${component}\\b`), `homepage must not duplicate ${component}`);
  await assert.rejects(source(`src/components/company/components/${component.toLowerCase()}.tsx`), { code: "ENOENT" });
}
for (const file of ["page.tsx", "components/logo-intro.tsx", ...["hero", "what-we-do", "services", "why-influ", "suitable-consultations"].map(name => `components/sections/${name}.tsx`)]) {
  await assert.rejects(source(`src/components/company/${file}`), { code: "ENOENT" });
}
for (const file of companyFiles.filter(path => path.startsWith("src/components/home/"))) {
  assert.doesNotMatch(await source(file), /client:load|from ["'](?:react|@company\/Motion)["']/, `${file}: native Astro and DOM motion`);
}

// Run against the local preview: node scripts/check-company-site.mjs [base-url]
const base = process.argv[2] ?? "http://localhost:4321";
const paths = [
  "/",
  "/business-content",
  "/company-profile",
  "/ai-homepage",
  "/ax-support",
  "/privacy-policy",
  "/company-achievements/page/1",
  "/useful-materials/page/1",
  "/staff-blog/page/1",
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
  for (const href of ["/company-achievements/page/1", "/useful-materials/page/1", "/staff-blog/page/1"])
    assert.ok(html.includes(`href="${href}"`), `${path}: editorial navigation ${href}`);
  if (path === "/") {
    assert.doesNotMatch(html, /<astro-island\b|client="load"|@astrojs\/react\/client/, "homepage: native Astro, no React hydration");
    for (const id of ["hero", "what-we-do", "services", "why-influ", "suitable-consultations", "contact"])
      assert.match(html, new RegExp(`<section[^>]+id="${id}"`), `homepage: ${id} section`);
    assert.equal((html.match(/data-slide(?:\s|>)/g) ?? []).length, 3, "homepage: all hero images server-rendered");
    assert.equal((html.match(/data-area(?:\s|>)/g) ?? []).length, 7, "homepage: seven focus controls");
  }
  assert.doesNotMatch(html, /<astro-island\b|client="load"|@astrojs\/react\/client/, `${path}: native Astro, no React hydration`);
  if (path === "/ai-homepage") {
    assert.equal((html.match(/data-fit-item(?:\s|>)/g) ?? []).length, 5, "five server-rendered fit statements");
    assert.equal((html.match(/data-freefall(?:\s|>)/g) ?? []).length, 4, "four animated issue cards");
  }
  if (path === "/business-content") {
    assert.equal((html.match(/data-signal-path(?:\s|>)/g) ?? []).length, 7, "five input and two output signal paths");
    assert.doesNotMatch(html, /<path[^>]+data-signal-glow[^>]+class="[^"]*opacity-0/, "SVG opacity animation must not be overridden by a CSS utility");
    assert.doesNotMatch(html, /\b(?:strokeWidth|strokeLinecap|stopColor|fontSize)=/, "native SVG attribute names");
    for (const [svg] of html.matchAll(/<svg\b[\s\S]*?<\/svg>/g))
      assert.doesNotMatch(svg, /<script\b/, "SVG component scripts must run from the HTML parent");
  }
  if (path === "/company-profile") assert.match(html, /<details\b[^>]*>[\s\S]*?ROUTE GUIDE/, "native access-guide disclosure");
  assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${path}: one main landmark`);
  assert.equal((html.match(/<header\b[^>]*id="site-header"/g) ?? []).length, 1, `${path}: one shared header`);
  assert.equal((html.match(/<footer\b/g) ?? []).length, 1, `${path}: one shared footer`);
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
const missingHtml = await missing.text();
assert.match(missingHtml, /ページが/);
assert.doesNotMatch(missingHtml, /<astro-island\b/, "native 404");
const sitemap = await (await fetch(new URL("/sitemap.xml", base))).text();
assert.ok((sitemap.match(/<loc>/g) ?? []).length >= paths.length, "sitemap: all static routes");
for (const section of ["staff-blog", "company-achievements", "useful-materials"]) {
  const root = await fetch(new URL(`/${section}`, base), { redirect: "manual" });
  assert.equal(root.status, 308, `${section}: archive redirect`);
  assert.equal(root.headers.get("location"), `/${section}/page/1`);
  assert.equal((await fetch(new URL(`/${section}/page/1`, base))).status, 200, `${section}: archive`);
  assert.equal((await fetch(new URL(`/${section}/example-article`, base))).status, 404, `${section}: missing article`);
  assert.match(sitemap, new RegExp(`/${section}/page/1`), `${section}: sitemap archive`);
}
assert.equal(
  await (await fetch(new URL("/robots.txt", base))).text(),
  "User-agent: *\nDisallow: /\n",
);
console.log(
  `PASS ${assets.size} image assets, redirect, 404, sitemap and preview robots`,
);

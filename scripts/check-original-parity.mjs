import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import ts from "typescript";

// Compare against the actual source, allowing only the documented Astro adapters
// and the user's three excluded article areas. No snapshots that bless a redesign.
const original = resolve(process.argv[2] ?? "/Users/blaze/react/INFLU");
const philosophy = (await readFile(resolve(original, "features/company-philosophy.ts"), "utf8")).replace("export const", "const");
const featureRoot = new URL("../src/components/shared/features/", import.meta.url);
const files = await readdir(featureRoot);
for (const file of files) {
  let source = await readFile(resolve(original, "features", file), "utf8");
  if (file === "seo.ts") source = source.slice(source.indexOf("export const SITE_URL"), source.indexOf("export function excerptFromMarkdown"))
    + source.slice(source.indexOf("function absoluteUrl"), source.indexOf("export function articleJsonLd"))
    + source.slice(source.indexOf("export type BreadcrumbItem"), source.indexOf("export function postMetadata"));
  source = source.replace(/^  \{ href: routes\.(ourPerformance|usefulMaterials|blog),[^\n]+\n/gm, "")
    .replace(/^  (blog|ourPerformance|usefulMaterials):[^\n]+\n/gm, "");
  assert.equal((await readFile(new URL(file, featureRoot), "utf8")).trim(), source.replaceAll('"@/features/', '"@shared/features/').trim(), file + ": original shared features");
}

const publicRoot = new URL("../public/", import.meta.url);
// Native Astro sections no longer have the same framework syntax. Compare their
// original content arrays, literal copy and Tailwind classes instead.
const nativeSections = [
  ["Hero", "hero", ["images"]],
  ["WhatWeDo", "what-we-do", ["areas"]],
  ["Services", "services", ["serviceLinks", "serviceSequence"]],
  ["WhyInflu", "why-influ", ["strengths"]],
  ["SuitableConsultations", "suitable-consultations", ["consultations"]],
];
const compact = text => text.replace(/\s+/g, "");
for (const [name, file, arrays] of nativeSections) {
  const source = await readFile(resolve(original, `app/components/sections/${file}.tsx`), "utf8");
  const native = await readFile(new URL(`../src/components/home/${name}.astro`, import.meta.url), "utf8");
  for (const array of arrays) {
    const start = source.indexOf(`const ${array} =`);
    const end = source.indexOf("\n]", start);
    const declaration = end < 0 || array === "images" ? source.slice(start).split("\n")[0] : source.slice(start, end + 2);
    assert.ok(compact(native).includes(compact(declaration)), `${name}: original ${array}`);
  }
  for (const [, classes] of source.matchAll(/className="([^"]+)"/g))
    assert.ok(native.includes(classes), `${name}: original Tailwind classes: ${classes}`);
  for (const [, copy] of source.matchAll(/>([^<>{}]*[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}][^<>{}]*)</gu))
    assert.ok(compact(native).includes(compact(copy)), `${name}: original copy: ${copy.trim()}`);
}
const nativePages = ["ax-support", "ai-homepage", "business-content", "company-profile", "privacy-policy"];
for (const page of nativePages) {
  const directory = new URL(`../src/components/${page}/`, import.meta.url);
  const native = (await Promise.all((await readdir(directory)).filter(file => file.endsWith(".astro")).map(file => readFile(new URL(file, directory), "utf8")))).join("\n");
  const source = await readFile(resolve(original, `app/${page}/page.tsx`), "utf8");
  const ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const statement of ast.statements.filter(ts.isVariableStatement)) {
    const name = statement.declarationList.declarations[0].name.getText(ast);
    if (name === "metadata") continue;
    if (name === "companyRows") {
      const check = node => {
        if (ts.isStringLiteral(node)) assert.ok(native.includes(node.text), `${page}: corporate information ${node.text}`);
        node.forEachChild(check);
      };
      check(statement);
      continue;
    }
    assert.ok(compact(native).includes(compact(statement.getText(ast))), `${page}: original ${name}`);
  }
  for (const [, classes] of source.matchAll(/className="([^"]+)"/g))
    assert.ok(native.includes(classes), `${page}: original Tailwind classes: ${classes}`);
  for (const [, copy] of source.matchAll(/>([^<>{}]*[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}][^<>{}]*)</gu))
    assert.ok(compact(native).includes(compact(copy)), `${page}: original copy: ${copy.trim()}`);
  if (page === "company-profile") assert.ok(compact(native).includes(compact(philosophy)), "original company philosophy");
}
let assets = 0;
for (const file of (await readdir(publicRoot, { recursive: true })).filter(file => /\.(svg|png|jpe?g|ico)$/.test(file))) {
  const source = resolve(original, /^(favicon.ico|opengraph-image.png)$/.test(file) ? "app" : "public", file);
  assert.deepEqual(await readFile(new URL(file, publicRoot)), await readFile(source), `${file}: original asset bytes`);
  assets++;
}
console.log(`PASS ${files.length} shared source files, ${nativeSections.length} home sections, ${nativePages.length} native pages and ${assets} byte-identical assets (${execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: original, encoding: "utf8" }).trim()})`);

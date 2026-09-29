import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import ts from "typescript";

// Compare against the actual source, allowing only the documented Astro adapters
// and the user's three excluded article areas. No snapshots that bless a redesign.
const original = resolve(process.argv[2] ?? "/Users/blaze/react/INFLU");
const philosophy = (await readFile(resolve(original, "features/company-philosophy.ts"), "utf8")).replace("export const", "const");
const files = (await Promise.all([
  ["company", "app/"],
  ["shared/react", "app/components/"],
  ["shared/features", "features/"],
].map(async ([folder, prefix]) => {
  const target = new URL(`../src/components/${folder}/`, import.meta.url);
  return (await readdir(target, { recursive: true }))
    .filter(file => /\.tsx?$/.test(file) && !["Image.tsx", "Motion.tsx", "MotionProvider.tsx"].includes(file))
    .map(file => ({ file, target, originalFile: prefix + file }));
}))).flat();

function adapted(source, file) {
  if (file === "features/seo.ts") {
    source = source.slice(source.indexOf("export const SITE_URL"), source.indexOf("export function excerptFromMarkdown"))
      + source.slice(source.indexOf("function absoluteUrl"), source.indexOf("export function articleJsonLd"))
      + source.slice(source.indexOf("export type BreadcrumbItem"), source.indexOf("export function postMetadata"));
  }
  source = source
    .replace(/^import type \{ Metadata \} from "next"\n/gm, "")
    .replace(/metadata: Metadata/g, "metadata")
    .replace(/^import Link from "next\/link"\n/gm, "")
    .replace(/<(\/?)Link\b/g, "<$1a")
    .replace(/"next\/image"/g, '"@company/Image"')
    .replace(/"framer-motion"/g, '"@company/Motion"')
    .replace(/^import \{ usePathname \} from "next\/navigation"\n/gm, "")
    .replace("export default function Navbar() {\n  const pathname = usePathname()", 'export default function Navbar({ pathname }: { pathname: string }) {')
    .replace(/^import (BlogPreview|CaseStudiesProof) from [^\n]+\n/gm, "")
    .replace(/^\s*<(BlogPreview|CaseStudiesProof) \/>\n/gm, "\n")
    .replace(/^  \{ href: routes\.(ourPerformance|usefulMaterials|blog),[^\n]+\n/gm, "")
    .replace(/^  (blog|ourPerformance|usefulMaterials):[^\n]+\n/gm, "");
  if (file === "app/company-profile/page.tsx") source = source.replace('import { companyPhilosophy } from "@/features/company-philosophy"', philosophy);
  if (/^(app\/privacy-policy\/page|app\/not-found)\.tsx$/.test(file)) source = source.replaceAll("<main ", "<div ").replaceAll("</main>", "</div>");
  if (file === "app/components/ui/specular-button.tsx") source = source
    .replace('    const renderer = new Renderer({', `    const canvas = document.createElement("canvas")
    // The decorative shader must not unmount the page when WebGL is unavailable.
    if (!canvas.getContext("webgl2")) {
      button.dataset.noWebgl = "true"
      return
    }
    delete button.dataset.noWebgl
    const renderer = new Renderer({
      canvas,`)
    .replace('  const classes = [', '  const classes = [\n    "data-[no-webgl]:border-[#9A7B10] data-[no-webgl]:bg-[#111016]/85",');
  if (/\/(page|not-found)\.tsx$/.test(file)) source = source.replace("export default function", "function");
  return source.replaceAll('"@/app/', '"@company/').replaceAll('"@/', '"@company/').trim();
}

for (const { file, target, originalFile } of files) {
  const source = await readFile(resolve(original, originalFile), "utf8");
  const copy = (await readFile(new URL(file, target), "utf8"))
    .replaceAll('"@shared/features/', '"@company/features/')
    .replaceAll('"@shared/react/Motion"', '"@company/Motion"')
    .replaceAll('"@shared/react/Image"', '"@company/Image"')
    .replaceAll('"@shared/react/', '"@company/components/')
    .replace(/^import MotionProvider from "@company\/components\/MotionProvider"\n/, "")
    .replace(/\nexport default function Page\(\) \{\n  return <MotionProvider><\w+ \/><\/MotionProvider>\n\}\n$/, "")
    .trim();
  assert.equal(copy, adapted(source, originalFile), `${file}: original content, Tailwind classes and motion logic`);
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
const nativePages = ["ax-support"];
for (const page of nativePages) {
  const directory = new URL(`../src/components/${page}/`, import.meta.url);
  const native = (await Promise.all((await readdir(directory)).filter(file => file.endsWith(".astro")).map(file => readFile(new URL(file, directory), "utf8")))).join("\n");
  const source = await readFile(resolve(original, `app/${page}/page.tsx`), "utf8");
  const ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const statement of ast.statements.filter(ts.isVariableStatement)) {
    const name = statement.declarationList.declarations[0].name.getText(ast);
    if (name === "metadata") continue;
    assert.ok(compact(native).includes(compact(statement.getText(ast))), `${page}: original ${name}`);
  }
  for (const [, classes] of source.matchAll(/className="([^"]+)"/g))
    assert.ok(native.includes(classes), `${page}: original Tailwind classes: ${classes}`);
  for (const [, copy] of source.matchAll(/>([^<>{}]*[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}][^<>{}]*)</gu))
    assert.ok(compact(native).includes(compact(copy)), `${page}: original copy: ${copy.trim()}`);
}
let assets = 0;
for (const file of (await readdir(publicRoot, { recursive: true })).filter(file => /\.(svg|png|jpe?g|ico)$/.test(file))) {
  const source = resolve(original, /^(favicon.ico|opengraph-image.png)$/.test(file) ? "app" : "public", file);
  assert.deepEqual(await readFile(new URL(file, publicRoot)), await readFile(source), `${file}: original asset bytes`);
  assets++;
}
console.log(`PASS ${files.length} original React/shared source files, ${nativeSections.length} native section content/class comparisons and ${assets} byte-identical assets (${execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: original, encoding: "utf8" }).trim()})`);

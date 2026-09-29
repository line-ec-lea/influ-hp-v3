import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

// Compare against the actual source, allowing only the documented Astro adapters
// and the user's three excluded article areas. No snapshots that bless a redesign.
const original = resolve(process.argv[2] ?? "/Users/blaze/react/INFLU");
const target = new URL("../src/components/company/", import.meta.url);
const philosophy = (await readFile(resolve(original, "features/company-philosophy.ts"), "utf8")).replace("export const", "const");
const files = (await readdir(target, { recursive: true }))
  .filter(file => /^(app|features)\/.+\.tsx?$/.test(file));

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
    .replace(/^import \{ usePathname \} from "next\/navigation"\n/gm, "")
    .replace("export default function Navbar() {\n  const pathname = usePathname()", 'export default function Navbar({ pathname }: { pathname: string }) {')
    .replace(/^import (BlogPreview|CaseStudiesProof) from [^\n]+\n/gm, "")
    .replace(/^\s*<(BlogPreview|CaseStudiesProof) \/>\n/gm, "\n")
    .replace(/^  \{ href: routes\.(ourPerformance|usefulMaterials|blog),[^\n]+\n/gm, "")
    .replace(/^  (blog|ourPerformance|usefulMaterials):[^\n]+\n/gm, "");
  if (file === "app/company-profile/page.tsx") source = source.replace('import { companyPhilosophy } from "@/features/company-philosophy"', philosophy);
  if (file === "app/page.tsx") source = source
    .replace(/^import JsonLd from [^\n]+\n/gm, "")
    .replace("organizationJsonLd, SITE_NAME", "SITE_NAME")
    .replace(/^\s*<JsonLd data=\{organizationJsonLd\(\)\} \/>\n/gm, "\n");
  if (/^(app\/privacy-policy\/page|app\/not-found)\.tsx$/.test(file)) source = source.replaceAll("<main ", "<div ").replaceAll("</main>", "</div>");
  if (/\/(page|not-found)\.tsx$/.test(file)) source = source.replace("export default function", "function");
  return source.replaceAll('"@/', '"@company/').trim();
}

for (const file of files) {
  const source = await readFile(resolve(original, file), "utf8");
  const copy = (await readFile(new URL(file, target), "utf8"))
    .replace(/^import Site from "@company\/Site"\n/, "")
    .replace(/\nexport default function Page\(\) \{\n  return <Site pathname="[^"]+"><\w+ \/><\/Site>\n\}\n$/, "")
    .trim();
  assert.equal(copy, adapted(source, file), `${file}: original content, Tailwind classes and motion logic`);
}

const publicRoot = new URL("../public/", import.meta.url);
let assets = 0;
for (const file of (await readdir(publicRoot, { recursive: true })).filter(file => /\.(svg|png|jpe?g|ico)$/.test(file))) {
  const source = resolve(original, /^(favicon.ico|opengraph-image.png)$/.test(file) ? "app" : "public", file);
  assert.deepEqual(await readFile(new URL(file, publicRoot)), await readFile(source), `${file}: original asset bytes`);
  assets++;
}
console.log(`PASS ${files.length} original source files and ${assets} byte-identical assets (${execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: original, encoding: "utf8" }).trim()})`);

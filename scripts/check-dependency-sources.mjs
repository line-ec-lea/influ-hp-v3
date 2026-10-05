import assert from "node:assert/strict";

// Preserve the former registry-only dependency policy with Bun's lockfile.
const lock = Bun.JSONC.parse(await Bun.file(new URL("../bun.lock", import.meta.url)).text());
for (const [name, [version, registry, , integrity]] of Object.entries(lock.packages)) {
  assert.match(version, /^(?:@[^/]+\/)?[^@:/]+@\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/, `${name}: registry package required`);
  assert.equal(registry, "", `${name}: use the default npm registry`);
  assert.match(integrity, /^sha(?:256|384|512)-[A-Za-z0-9+/]+=*$/, `${name}: integrity hash required`);
}
console.log("PASS dependency sources: registry packages with integrity hashes only");

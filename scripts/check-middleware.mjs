import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Load the handler without Astro's virtual module so this runs with plain Node.
const source = (await readFile(new URL("../src/middleware.ts", import.meta.url), "utf8"))
  .replace(/import .*?;\n/, "const defineMiddleware = handler => handler;\n");
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
console.log("PASS OAuth redirect headers, location, cookie metadata, and custom domain");

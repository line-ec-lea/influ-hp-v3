import { defineMiddleware } from "astro:middleware";
import { legacyRedirectTarget } from "./lib/legacy-redirects";

export const onRequest = defineMiddleware(async ({ url, redirect, cache }, next) => {
	const legacyTarget = legacyRedirectTarget(url.pathname);
	let response = legacyTarget ? redirect(legacyTarget, 301) : await next();
	// Route rules must not turn missing content, CMS failures, or private output into cache entries.
	if (cache?.enabled && (response.status !== 200 || /\b(private|no-store)\b/i.test(response.headers.get("Cache-Control") ?? ""))) {
		cache.set(false);
	}
	if (url.hostname.endsWith(".workers.dev")) {
		// OAuth redirects have immutable headers; preserve Astro's cookie metadata.
		const original = response;
		response = new Response(original.body, original);
		const cookieSymbol = Symbol.for("astro.cookies");
		const cookies = Reflect.get(original, cookieSymbol);
		if (cookies !== undefined) Reflect.set(response, cookieSymbol, cookies);
		response.headers.set(
			"X-Robots-Tag",
			"noindex, nofollow, noarchive, nosnippet",
		);
	}
	return response;
});

import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ url }, next) => {
	let response = await next();
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

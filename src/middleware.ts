import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ url }, next) => {
	const response = await next();
	if (url.hostname.endsWith(".workers.dev")) {
		response.headers.set(
			"X-Robots-Tag",
			"noindex, nofollow, noarchive, nosnippet",
		);
	}
	return response;
});

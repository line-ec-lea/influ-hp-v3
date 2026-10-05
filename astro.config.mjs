import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	vite: { plugins: [tailwindcss()] },
	output: "server",
	i18n: {
		defaultLocale: "ja",
		locales: ["ja"],
	},
	adapter: cloudflare(),
	cache: { provider: cacheCloudflare() },
	routeRules: {
		"/": { maxAge: 300, swr: 60 },
		"/business-content": { maxAge: 300, swr: 60 },
		"/company-profile": { maxAge: 300, swr: 60 },
		"/ai-homepage": { maxAge: 300, swr: 60 },
		"/ax-support": { maxAge: 300, swr: 60 },
		"/privacy-policy": { maxAge: 300, swr: 60 },
		"/company-achievements/[...path]": { maxAge: 300, swr: 60 },
		"/useful-materials/[...path]": { maxAge: 300, swr: 60 },
		"/staff-blog/[...path]": { maxAge: 300, swr: 60 },
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Noto Sans JP",
			cssVariable: "--font-noto-sans-jp",
			weights: ["100 900"],
			fallbacks: ["sans-serif"],
		},
	],
	devToolbar: { enabled: false },
});

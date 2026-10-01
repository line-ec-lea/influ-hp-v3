import cloudflare from "@astrojs/cloudflare";
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

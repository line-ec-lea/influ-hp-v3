# INFLU company site

The INFLU company website uses native Astro sections, Tailwind CSS and EmDash CMS. Company pages preserve the original black/gold palette, Noto Sans JP typography, DOM motion and OGL button effects.

## Routes and content

Company routes include `/`, `/business-content`, `/company-profile`, `/ai-homepage`, `/ax-support`, `/privacy-policy` and the shared 404 page. `/home` redirects to `/`.

EmDash serves `/company-achievements`, `/useful-materials` (columns), and `/staff-blog`, including article details, numbered pagination and column categories. Archive roots redirect to `/page/1`. The generic starter blog routes and completed Notion migration tooling have been removed.

## Architecture

- `src/layouts/Company.astro` owns the document, Navbar, main landmark, Footer and EmDash hooks.
- `src/components/shared/` contains reused UI and editorial archive/article layouts. Page-specific sections remain in their corresponding folders.
- `src/styles/global.css` contains only the Tailwind import and company theme values.
- Browser scripts use `framer-motion/dom`; public pages do not hydrate React. React remains required for the EmDash admin.
- `seed/seed.json` defines the three editorial collections and column categories for fresh setup, without starter posts or demo widgets. Existing content is managed in EmDash.

## Development and checks

```bash
bun install
bun run dev
bun run typecheck
bun run build
node scripts/check-company-site.mjs http://127.0.0.1:4321
node scripts/check-middleware.mjs
node scripts/check-editorial-errors.mjs
node scripts/check-original-parity.mjs /Users/blaze/react/INFLU
```

The company check requires a running local server. It checks shared layout landmarks, native routes, assets, pagination archive entry points, retired starter routes, redirects, sitemap and preview SEO settings.

Use Bun 1.4.0 (`mise install` installs the configured tools). CI installs from `bun.lock` with `--frozen-lockfile`. Only `esbuild` and `workerd` may run dependency install scripts; new releases retain a one-day cooldown. Run `bun scripts/check-dependency-sources.mjs` to check the registry-only dependency policy, also enforced in CI.

The original-parity check requires the original INFLU checkout at commit `fb66476`, or an explicit source path. It compares company source content, classes and assets; it is not a pixel comparison.

The EmDash admin is at `http://127.0.0.1:4321/_emdash/admin`. Preview hosts are noindex and disallow crawling.

## Deployment

```bash
bun run deploy
```

The configured Cloudflare Worker is `influ-hp-v3`. CMS content and media remain in the existing D1 database and R2 bucket.

## Issue detection

`wrangler.jsonc` enables Cloudflare Workers Issues on deployment. View new production failures in the Worker's **Issues** dashboard. CMS query failures log the original error before returning HTTP 500; missing articles still return HTTP 404 without error logs.

For push notifications, add an occurrence-threshold or recurrence automation under **Issues → Automations** and send it to your existing private engineering chat. See [Cloudflare's automation documentation](https://developers.cloudflare.com/workers/observability/issues/automations/).

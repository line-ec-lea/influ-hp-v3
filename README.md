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
pnpm install
pnpm dev
pnpm typecheck
pnpm build
node scripts/check-company-site.mjs http://127.0.0.1:4321
node scripts/check-middleware.mjs
node scripts/check-original-parity.mjs /Users/blaze/react/INFLU
```

The company check requires a running local server. It checks shared layout landmarks, native routes, assets, pagination archive entry points, retired starter routes, redirects, sitemap and preview SEO settings.

The original-parity check requires the original INFLU checkout at commit `fb66476`, or an explicit source path. It compares company source content, classes and assets; it is not a pixel comparison.

The EmDash admin is at `http://127.0.0.1:4321/_emdash/admin`. Preview hosts are noindex and disallow crawling.

## Deployment

```bash
pnpm deploy
```

The configured Cloudflare Worker is `influ-hp-v3`. CMS content and media remain in the existing D1 database and R2 bucket.

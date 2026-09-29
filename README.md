# INFLU company site

The original INFLU company website ported to Astro, React, TypeScript and Tailwind CSS, with EmDash retained for future CMS work.

Source: `/Users/blaze/react/INFLU`, commit `fb66476` (`codex/shared-article-design`). The copy preserves the original content, assets, black/gold palette, Noto Sans JP typography, Framer Motion animations and OGL button effects.

## Scope

Included: `/`, `/business-content`, `/company-profile`, `/ai-homepage`, `/ax-support`, `/privacy-policy` and the original 404 design. `/home` redirects to `/`.

Excluded: `/staff-blog`, `/company-achievements`, `/useful-materials`, their detail/pagination routes, navigation links and homepage article sections. The existing EmDash blog template is deferred, not integrated into the company navigation or sitemap.

## Architecture

- `src/pages/index.astro`: composes the homepage directly from separate Astro sections.
- `src/components/home/`: native Astro homepage sections, header, footer and effects. Section scripts use the installed `framer-motion/dom` API; no React island is loaded by the homepage.
- Other `src/pages/*.astro` company routes still wrap React with `client:load` hydration.
- `src/components/company/`: the remaining React pages and their shared UI. No Next.js `app/` nesting or React homepage.
- `src/components/company/features/`: original shared navigation, contact links, routes and SEO helpers.
- `src/components/company/Site.tsx`: original motion provider, navigation and footer.
- `src/components/company/Image.tsx`: native image adapter; no Next.js image optimizer.
- `src/components/company/Motion.tsx`: hydration-safe reduced-motion preference shared by the original animation components.
- `src/layouts/Company.astro`: document, fonts, metadata and EmDash hooks.
- `src/styles/global.css`: Tailwind import and original theme tokens only. Motion-generated inline styles remain necessary for the original animations.

Next.js links use native anchors, so route changes are full-page navigations. Astro owns routing, fonts and server rendering; the original Next.js/Vinext runtime is not copied. There is no company theme toggle.

Two compatibility safeguards preserve usability: hydration-safe reduced-motion preferences and a plain bordered button fallback when WebGL2 is unavailable. Supported browsers retain the original shader effect.

## Development and checks

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm build
node scripts/check-company-site.mjs
node scripts/check-original-parity.mjs /Users/blaze/react/INFLU
```

The route check requires the preview at `http://localhost:4321` (or pass another base URL). It also verifies native homepage composition, server-rendered controls, no homepage React island, and deletion of its old TSX files.

The parity check compares 26 remaining React/shared source files, the content arrays, literal copy and Tailwind classes of five native homepage sections, and 22 original assets. It requires the original checkout; later source changes must be reviewed before changing the comparison. It does not establish pixel-perfect or animation-timing equivalence.

The native homepage was checked against the previous React page at 390×844 and 1280×800: section sizes matched at both viewport sizes, with no horizontal overflow. Manual checks covered hero selection, focus controls, navigation and Escape, reduced motion, and readable content with JavaScript disabled. These are local checks, not deployment verification.

The EmDash admin remains at `http://localhost:4321/_emdash/admin`. Existing Cloudflare configuration is retained; local checks do not establish deployment status. Preview hosts are noindex and disallow crawling.

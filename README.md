# INFLU company site

The original INFLU company website ported to Astro, React, TypeScript and Tailwind CSS, with EmDash retained for future CMS work.

Source: `/Users/blaze/react/INFLU`, commit `fb66476` (`codex/shared-article-design`). The copy preserves the original content, assets, black/gold palette, Noto Sans JP typography, Framer Motion animations and OGL button effects.

## Scope

Included: `/`, `/business-content`, `/company-profile`, `/ai-homepage`, `/ax-support`, `/privacy-policy` and the original 404 design. `/home` redirects to `/`.

Excluded: `/staff-blog`, `/company-achievements`, `/useful-materials`, their detail/pagination routes, navigation links and homepage article sections. The existing EmDash blog template is deferred, not integrated into the company navigation or sitemap.

## Architecture

- `src/pages/index.astro`: composes the homepage directly from separate Astro sections.
- `src/components/home/`: homepage-only Astro sections. Section scripts use the installed `framer-motion/dom` API; no React island is loaded by the homepage.
- `src/components/shared/`: reusable Astro UI including Navbar, Footer, Contact, Container, headings and buttons; common DOM motion lives here too.
- `src/components/shared/react/`: reusable helpers for the remaining React pages, including their motion provider and image adapter.
- `src/components/shared/features/`: shared navigation, contact links, routes and SEO helpers.
- Other `src/pages/*.astro` company routes still wrap React with `client:load` hydration.
- `src/components/company/`: remaining React page bodies and page-specific helpers. No Next.js `app/` nesting or React homepage.
- `src/layouts/Company.astro`: shared Navbar, main landmark and Footer, plus document, fonts, metadata and EmDash hooks. Pages must not render another header, main or footer.
- `src/styles/global.css`: Tailwind import and original theme tokens only. Motion-generated inline styles remain necessary for the original animations.

Contact placement is still page-owned: the homepage uses the shared Astro block; four company pages retain distinct closing CTA designs, and privacy/404 retain their existing React Contact block pending a contact-design decision.

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

The parity check compares 24 remaining React/shared source files, the content arrays, literal copy and Tailwind classes of five native homepage sections, and 22 original assets. It requires the original checkout; later source changes must be reviewed before changing the comparison. It does not establish pixel-perfect or animation-timing equivalence.

The native homepage was checked against the previous React page at 390×844 and 1280×800: section sizes matched at both viewport sizes, with no horizontal overflow. Manual checks covered hero selection, focus controls, navigation and Escape, reduced motion, and readable content with JavaScript disabled. These are local checks, not deployment verification.

The EmDash admin remains at `http://localhost:4321/_emdash/admin`. Existing Cloudflare configuration is retained; local checks do not establish deployment status. Preview hosts are noindex and disallow crawling.

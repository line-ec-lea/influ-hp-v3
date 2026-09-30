# INFLU company site

The original INFLU company website ported to native Astro sections, TypeScript and Tailwind CSS, with EmDash retained for future CMS work.

Source: `/Users/blaze/react/INFLU`, commit `fb66476` (`codex/shared-article-design`). The copy preserves the original content, assets, black/gold palette, Noto Sans JP typography, Framer Motion animations and OGL button effects.

## Scope

Included: `/`, `/business-content`, `/company-profile`, `/ai-homepage`, `/ax-support`, `/privacy-policy` and the original 404 design. `/home` redirects to `/`.

Excluded: `/staff-blog`, `/company-achievements`, `/useful-materials`, their detail/pagination routes, navigation links and homepage article sections. The existing EmDash blog template is deferred, not integrated into the company navigation or sitemap.

## Architecture

- `src/pages/*.astro`: company routes compose separate Astro sections; none hydrate a React page.
- `src/components/home/`, `ai-homepage/`, `ax-support/`, `business-content/`, `company-profile/`, `privacy-policy/`, `not-found/`: page-specific Astro sections. Content stays with its section, without a duplicate site-data layer.
- `src/components/shared/`: reusable Astro UI including Navbar, Footer, Contact, Container, headings and buttons; common DOM motion lives here too.
- `src/components/shared/features/`: shared navigation, contact links, routes and SEO helpers.
- Native scripts use the existing `framer-motion/dom` API for reveals, scroll progress, the SVG business diagram and rotating fit text. The old public React pages and adapters have been removed.
- `src/layouts/Company.astro`: shared Navbar, main landmark and Footer, plus document, fonts, metadata and EmDash hooks. Pages must not render another header, main or footer.
- `src/styles/global.css`: Tailwind import and original theme tokens only. Motion-generated inline styles remain necessary for the original animations.

Contact placement is still page-owned to preserve the existing variants: the homepage uses shared `Contact.astro`, four company pages retain their distinct closing CTA sections, and privacy/404 share `GeneralContact.astro`.

Next.js links use native anchors, so route changes are full-page navigations. Astro owns routing, fonts and server rendering; the original Next.js/Vinext runtime is not copied. There is no company theme toggle.

Content is server-rendered and remains readable with JavaScript disabled or reduced motion enabled. Buttons fall back to plain bordered links when WebGL2 is unavailable. React and the Astro React integration remain installed for EmDash, not for public company pages.

## Development and checks

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm build
node scripts/check-company-site.mjs
node scripts/check-original-parity.mjs /Users/blaze/react/INFLU
```

The route check requires the preview at `http://localhost:4321` (or pass another base URL). It verifies Tailwind-only styling, shared layout landmarks, native company routes and 404, server-rendered controls, assets, excluded routes and preview SEO settings.

The parity check compares four shared feature files, the content arrays, literal copy and Tailwind classes of five homepage sections and five inner pages, and 22 original assets. It requires the original checkout; later source changes must be reviewed before changing the comparison. It does not establish pixel-perfect or animation-timing equivalence.

The native homepage was checked against the previous React page at 390×844 and 1280×800: section sizes matched at both viewport sizes, with no horizontal overflow. Manual checks covered hero selection, focus controls, navigation and Escape, reduced motion, and readable content with JavaScript disabled. These are local checks, not deployment verification.

The five inner pages were also compared before/after conversion at 390×844 and 1280×800 with reduced motion enabled: section heights and background colors matched, with no horizontal overflow or public React islands. The 404 route, mobile navigation, access disclosure, rotating fit text and SVG motion are checked separately.

The EmDash admin remains at `http://localhost:4321/_emdash/admin`. Existing Cloudflare configuration is retained; local checks do not establish deployment status. Preview hosts are noindex and disallow crawling.

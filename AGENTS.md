This is an EmDash site -- a CMS built on Astro with a full admin UI.

## Commands

```bash
bun run dev           # Start the Astro dev server
bunx emdash types      # Regenerate TypeScript types from a running site
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File                     | Purpose                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `astro.config.mjs`       | Astro config with `emdash()` integration, database, and storage                    |
| `src/live.config.ts`     | EmDash loader registration (boilerplate -- don't modify)                           |
| `seed/seed.json`         | Initial editorial schema and categories (collections, fields, taxonomies, menus, widgets) |
| `emdash-env.d.ts`        | Generated types for collections (auto-regenerated on dev server start)             |
| `src/pages/`             | Astro pages -- all server-rendered                                                 |

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (menus, widgets, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall. The docs reflect current behaviour; assumptions may not.

This template ships with `.mcp.json`, `.cursor/mcp.json`, and `.vscode/mcp.json` so Claude Code, Cursor, and VS Code auto-discover the docs server. Other tools (OpenCode, Windsurf, etc.) need a manual one-time setup -- see [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp).

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- When Astro's cache is enabled, pass content-query hints to `Astro.cache.set(cacheHint)`. Use the `WithCacheHint` variants for site settings, menus, taxonomies, and widget areas rendered by cached routes.
- Taxonomy names in queries must match the seed's `"name"` field exactly (e.g., `"category"` not `"categories"`).

## Current site

Company pages use `src/layouts/Company.astro`. EmDash editorial pages use shared `EditorialArchive.astro` and `EditorialArticle.astro` inside the company layout.

Collections: `company_achievements`, `useful_materials`, `staff_blog`. Column category queries use `material_category`. Archive roots redirect to `/page/1`; articles use `/<section>/[slug]`.

The generic starter blog routes, Base layout, starter styles and migration tooling have been removed. Do not restore them. Manage migrated posts and media in EmDash.

## Customisation

### Company pages

Pages using `src/layouts/Company.astro` use Tailwind utilities directly in the markup. Their only stylesheet entry is `src/styles/global.css`, containing the Tailwind import and `@theme` values. Do not add custom selectors, `<style>` blocks, `@apply`, or imports of the legacy template styles to these pages.

The company pages are a faithful port of `/Users/blaze/react/INFLU` at `fb66476`, not a new design. Preserve the original black/gold palette, Noto Sans JP typography, content and motion. All company routes, including privacy and 404, compose native Astro sections with browser scripts using `framer-motion/dom`. Keep them free of React page wrappers and `client:load`. Motion's runtime inline styles are intentional; use native anchors instead of Next.js imports. React remains installed for EmDash's admin integration.

Keep homepage article sections excluded. Do not add a theme toggle or a duplicate site-data layer. Run `node scripts/check-original-parity.mjs` and `node scripts/check-company-site.mjs` after company changes; the latter needs the local preview running.

### Component ownership

- Put components reused in more than two places in `src/components/shared/`; reuse that implementation instead of copying it between pages.
- Keep homepage-only sections in `src/components/home/` and other page-specific sections under `src/components/<page>/`. Keep section content in its Astro frontmatter or markup. Do not restore the removed `company/` React tree or `shared/react/` adapters.
- `Company.astro` owns the Navbar, main landmark and Footer. Page bodies must not render duplicates. Its navigation reads the current route; do not hard-code homepage behavior.
- Contact retains page-specific designs: shared `Contact.astro` for home, shared `GeneralContact.astro` for privacy/404, and each other page's own closing section. Agree on a common variant before unifying its layout placement.

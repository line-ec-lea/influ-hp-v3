import type { APIContext } from "astro";
import { SITE_URL } from "@shared/features/seo";

export function GET({ url }: APIContext) {
  const rules =
    url.hostname === new URL(SITE_URL).hostname
      ? `User-agent: *\nAllow: /\nDisallow: /_emdash/\nDisallow: /posts\nDisallow: /category\nDisallow: /tag\nDisallow: /search\nDisallow: /pages\nDisallow: /rss.xml\nSitemap: ${SITE_URL}/sitemap.xml\n`
      : "User-agent: *\nDisallow: /\n";
  return new Response(rules, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

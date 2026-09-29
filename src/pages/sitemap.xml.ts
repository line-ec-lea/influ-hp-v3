import { navigation, SITE_URL } from "../data/site";

export function GET() {
  const paths = [...navigation.map((item) => item.href), "/privacy-policy"];
  const urls = paths
    .map((path) => `<url><loc>${new URL(path, SITE_URL).href}</loc></url>`)
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    },
  );
}

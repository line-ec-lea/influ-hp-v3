import { siteNavItems } from "@shared/features/navigation";
import { SITE_URL } from "@shared/features/seo";
import { getEmDashCollection } from "emdash";

export async function GET() {
  const [achievements, materials, staffPosts] = await Promise.all([
    getEmDashCollection("company_achievements", { status: "published" }),
    getEmDashCollection("useful_materials", { status: "published" }),
    getEmDashCollection("staff_blog", { status: "published" }),
  ]);
  const paths = [
    ...siteNavItems.map((item) => item.href),
    "/privacy-policy",
    ...achievements.entries.map((entry) => `/company-achievements/${entry.id}`),
    ...materials.entries.map((entry) => `/useful-materials/${entry.id}`),
    ...staffPosts.entries.map((entry) => `/staff-blog/${entry.id}`),
  ];
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

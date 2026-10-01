import { getEmDashCollection } from "emdash";

export function loadEditorialArchive(
  collection: "company_achievements" | "useful_materials" | "staff_blog",
  page: number,
  categorySlug?: string,
) {
  return getEmDashCollection(collection, {
    status: "published",
    orderBy: { published_at: "desc" },
    // First page: featured story + 12 cards. Look ahead for numbered pagination.
    limit: (page === 1 ? 13 : 12) + 48,
    offset: page === 1 ? 0 : 13 + (page - 2) * 12,
    where: categorySlug ? { material_category: categorySlug } : undefined,
  });
}

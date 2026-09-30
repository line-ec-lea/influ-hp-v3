import { routes } from "@shared/features/routes"

export const siteNavItems = [
  { href: routes.home, label: "HOME" },
  { href: routes.service, label: "事業内容" },
  { href: routes.company, label: "会社概要" },
  { href: routes.aiHomepage, label: "HPのAI化" },
  { href: routes.axSupport, label: "AX・業務効率化支援" },
  { href: routes.companyAchievements, label: "会社実績" },
  { href: routes.usefulMaterials, label: "コラム" },
  { href: routes.staffBlog, label: "スタッフBLOG" },
] as const

// 旧WordPressサイト (influhp.com) からの301リダイレクトマップ。
// 旧サイトのsitemap/REST APIから生成 (2026-06-23時点、投稿175件・固定ページ・
// カスタム投稿タイプ staffreport 361件 / our-performance 13件・カテゴリ22件)。

const PAGE_REDIRECTS: Record<string, string> = {
  "/line": "/business-content",
  "/service": "/business-content",
  "/company": "/company-profile",
  "/privacy": "/privacy-policy",
  "/contact": "/",
  "/thank": "/",
  "/blog": "/useful-materials/page/1",
  "/staffreport": "/staff-blog/page/1",
  "/our-performance": "/company-achievements/page/1",
}

// 旧カテゴリスラッグ (URLデコード済み) → 新カテゴリスラッグ
const CATEGORY_REDIRECTS: Record<string, string> = {
  ec: "ec",
  googleスプレットシート: "google-spreadsheet",
  googleデータポータル: "google-data-portal",
  line: "line",
  lineマーケットプレイス: "line-marketplace",
  lineマーケティング: "line-marketing",
  line公式: "line-official",
  lステップ: "l-step",
  snsマーケティング: "sns-marketing",
  webセミナー: "web-seminar",
  webマーケティング: "web-marketing",
  web解析: "web-analysis",
  info: "announcement",
  インフルエンサー: "influencer",
  service: "service",
  ネットビジネス: "online-business",
  ホワイトペーパー: "white-paper",
  マーケティングオートメーション: "marketing-automation",
  メールマーケティング: "email-marketing",
  社員教育: "employee-training",
  補助金: "subsidy",
  集客: "customer-acquisition",
}

// 旧サイトでルート直下にあった投稿スラッグ (現 /useful-materials/<slug>)
const WP_POST_SLUGS = new Set([
  "4c-analysis",
  "ab-test",
  "about-line-ads",
  "amazon-individual-listing",
  "amazon-sales",
  "apparel-ec-site",
  "attracting-customers-on-instagram",
  "attracting-customers-to-sns",
  "attracting-customers-to-stores",
  "benefits-of-marketing-automation",
  "btob-email-marketing",
  "btob_sns-marketing",
  "business-restructuring-subsidy",
  "cart-system",
  "cart-system-comparison",
  "cloud-ec",
  "community-marketing",
  "company-ec-site",
  "content-marketing",
  "cosmetics-ec-site",
  "e-commerce-company",
  "e-commerce-meaning",
  "e-commerce-package",
  "ec-application",
  "ec-industry",
  "ec-site-attracting-customers",
  "ec-site-design",
  "ec-site-earnings",
  "ec-site-food",
  "ec-site-how-to-attract-customers",
  "ec-site-marketing",
  "ec-site-operation",
  "ec-site-operation-2",
  "ec-site-renewal",
  "ec-site-security-measures",
  "ec-site-type",
  "educational-content",
  "email-marketing-function",
  "email-marketing-open-rate",
  "email-marketing-success-stories",
  "established-line-ec",
  "event-customer-attraction-email",
  "food-ec-site",
  "google-data-portal",
  "google-data-portal-function",
  "google-spreadsheet-team-sharing",
  "google-spreadsheets-practice",
  "how-to-attract-customers-ec-site",
  "how-to-attract-customers-to-seminars",
  "how-to-create-own-online-shop",
  "how-to-make-a-line-diagnosis",
  "how-to-make-a-line-quiz",
  "how-to-make-an-ec-site",
  "how-to-make-official-line",
  "how-to-take-product-photos",
  "how-to-use-the-line-coupon",
  "ideas-for-attracting-customers",
  "inbound-maeketing",
  "influencer-marketing-benefits",
  "influencer-marketing-case",
  "influencer-marketing-case-studies",
  "influencer-marketing-costs",
  "insta-shop-opened",
  "instagram-shopping",
  "instagram-shopping-function",
  "internet-business-beginner",
  "it-subsidy",
  "l-step-construction-fee",
  "l-step-payment-method",
  "l-step-plan-change",
  "l-step-send-cancellation",
  "l-step-template-creation-method",
  "l-step-utilization-seminar",
  "landing-page-optimiz",
  "lea-business-transfer",
  "line-ad-example",
  "line-ad-screening",
  "line-add-friend-message",
  "line-ads-targeting",
  "line-ads-variety",
  "line-amidakuji-function",
  "line-business",
  "line-call-settings",
  "line-cannot-add-friends",
  "line-data-transfer",
  "line-delivery",
  "line-ec-site",
  "line-freeze",
  "line-how-to-make-an-album",
  "line-icon-black-and-white",
  "line-logo-fashionable",
  "line-maeketing-strategy",
  "line-marketing-strategy",
  "line-marketing-success-points",
  "line-marketing-tool",
  "line-marketplace",
  "line-mentions",
  "line-multi-person-talk",
  "line-note-function",
  "line-official-account",
  "line-official-account-marketing",
  "line-official-account-personal-use",
  "line-open-chat",
  "line-open-rate",
  "line-phone-number-verification",
  "line-questionnaire-free-description",
  "line-reservation-transmission",
  "line-rich-menu-design",
  "line-rich-menu-stylish",
  "line-shop-card",
  "line-sns-marketing",
  "line-stamp-card",
  "line-star-mark",
  "line-step-delivery",
  "line-tracking",
  "line-video-ads",
  "line-voom",
  "line-works",
  "line-works-danger",
  "line-works-price",
  "linestep-construction-agency",
  "linestep-restaurant",
  "list-of-online-shops",
  "marketing-automation-function",
  "marketing-automation-tools",
  "marketing-tools",
  "net-shop-opening-of-business",
  "net-shop-success-example",
  "new-business-subsidy",
  "news",
  "osaka-sns-marketing",
  "payment-method",
  "post-1514",
  "post-2261",
  "post-2265",
  "post-2272",
  "post-2283",
  "post-2294",
  "post-2485",
  "post-2500",
  "post-2507",
  "post-80",
  "product-design",
  "product-launch",
  "push-type-and-pull-type",
  "sales-strategy",
  "shopify-example",
  "shopify-not-selling",
  "site-improvement",
  "sns-freelance",
  "sns-marketing-analysis",
  "sns-marketing-benefits",
  "sns-marketing-for-btob",
  "sns-marketing-future",
  "sns-marketing-in-osaka",
  "sns-marketing-individual",
  "sns-marketing-side-business",
  "sole-proprietor-subsidy",
  "timeline-voom",
  "user-first",
  "web-analytics",
  "web-direction",
  "web-marketing-career-change",
  "web-marketing-independence",
  "web-marketing-results",
  "web-marketing-school",
  "web-marketing-strategy",
  "web-strategy",
  "webinar",
  "webinar-tool",
  "what-is-a-rich-action-label",
  "what-is-line-follow",
  "what-is-line-notify",
  "white-paper",
  "wordpress-ec-site",
])

export function legacyRedirectTarget(rawPathname: string): string | null {
  let pathname: string
  try {
    pathname = decodeURIComponent(rawPathname)
  } catch {
    return null
  }
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1)
  }

  const page = Object.hasOwn(PAGE_REDIRECTS, pathname) ? PAGE_REDIRECTS[pathname] : null
  if (page) {
    return page
  }

  const staff = pathname.match(
    /^\/staffreport\/((?:post|staffreport)-\d+)$/,
  )?.[1]
  if (staff) {
    return `/staff-blog/${staff}`
  }

  const perf = pathname.match(/^\/our-performance\/(our-performance-\d+)$/)?.[1]
  if (perf) {
    return `/company-achievements/${perf}`
  }

  const cat = pathname.match(/^\/category\/([^/]+)$/)?.[1]
  if (cat) {
    const target = Object.hasOwn(CATEGORY_REDIRECTS, cat) ? CATEGORY_REDIRECTS[cat] : null
    return target ? `/useful-materials/category/${target}/page/1` : null
  }

  const post = pathname.match(/^\/([^/]+)$/)?.[1]
  if (post && WP_POST_SLUGS.has(post)) {
    return `/useful-materials/${post}`
  }

  return null
}

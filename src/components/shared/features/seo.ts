export const SITE_URL = "https://influhp.com"
export const SITE_NAME = "株式会社INFLU"

function absoluteUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith("http") ? pathOrUrl : `${SITE_URL}${pathOrUrl}`
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/influ-logo.svg`,
    telephone: "+81-6-7222-2971",
    foundingDate: "2019-12",
    address: {
      "@type": "PostalAddress",
      postalCode: "550-0013",
      addressRegion: "大阪府",
      addressLocality: "大阪市西区",
      streetAddress: "新町1丁目8-3 林四ツ橋ビル9階901号室",
      addressCountry: "JP",
    },
  }
}

export type BreadcrumbItem = {
  name: string
  href?: string
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  }
}

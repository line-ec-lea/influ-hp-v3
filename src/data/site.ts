export const SITE_NAME = "株式会社INFLU";
export const SITE_URL = "https://influhp.com";
export const CONTACT_URL = "https://melodious-sight-6bd.notion.site/37b947bdbcf480dc97d1ce7f01cff921";
export const RECRUITMENT_URL = "https://melodious-sight-6bd.notion.site/2099e621302e466fa97bf45f31eed426?pvs=105";
export const navigation = [
  { href: "/", label: "ホーム", en: "Home" },
  { href: "/business-content", label: "事業内容", en: "Our business" },
  { href: "/company-profile", label: "会社概要", en: "About us" },
  { href: "/ai-homepage", label: "HPのAI化", en: "AI-ready homepage" },
  { href: "/ax-support", label: "AX・業務効率化支援", en: "AX support" },
];
export const organization = {
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
};

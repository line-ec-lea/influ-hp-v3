import Site from "@company/Site"

import LogoIntro from "@company/app/components/logo-intro"
import ContactBlock from "@company/app/components/sections/contact"
import Hero from "@company/app/components/sections/hero"
import Services from "@company/app/components/sections/services"
import SuitableConsultations from "@company/app/components/sections/suitable-consultations"
import WhatWeDo from "@company/app/components/sections/what-we-do"
import WhyInflu from "@company/app/components/sections/why-influ"
import { SITE_NAME } from "@company/features/seo"

const homeTitle = "企業のAI活用・AXを伴走する｜株式会社INFLU"
const homeDescription =
  "株式会社INFLUは、企業のAI活用・AX（AI Transformation）支援、AIホームページ制作、Webサイト運用改善、AIマーケティング、業務効率化をワンストップで支援。AI時代に対応したWebサイトとビジネス変革を実現します。"

export const metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
  },
}

function HomePage() {
  return (
    <>

      <LogoIntro />
      <div className="bg-[#0B0B0B] font-sans text-[#F5F1E8]">
        <Hero />
        <div className="relative isolate overflow-hidden bg-[#0B0B0B]">
          <WhatWeDo />
          <Services />
          <WhyInflu />

          <SuitableConsultations />

          <ContactBlock variant="dark" context="homepage" />
        </div>
      </div>
    </>
  )
}

export default function Page() {
  return <Site pathname="/"><HomePage /></Site>
}

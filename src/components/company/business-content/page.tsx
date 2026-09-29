import MotionProvider from "@shared/react/MotionProvider"
import Image from "@shared/react/Image"

import BusinessSystemFlow from "@company/business-content/business-system-flow"
import AsanohaHeroPattern from "@shared/react/asanoha-hero-pattern"
import Container from "@shared/react/container"
import SunlitHeading from "@shared/react/home/sunlit-heading"
import {
  CinematicImageReveal,
  CinematicPageFrame,
  CinematicReveal,
} from "@shared/react/motion/cinematic-reveal"
import SpecularButton from "@shared/react/ui/specular-button"
import { CONTACT_FORM_HREF } from "@shared/features/contact"
import { routes } from "@shared/features/routes"

export const metadata = {
  title: "事業内容",
  description:
    "HPのAI化とAX・業務効率化支援を中心に、エンジニアリングとマーケティングの両面から企業のAI活用を支援します。",
  alternates: { canonical: "/business-content" },
}

const primaryServices = [
  {
    number: "01",
    eyebrow: "AI-READY HOMEPAGE",
    title: "HPのAI化",
    lead: "既存ホームページを、AI活用前提の運用へ。",
    description:
      "ホームページを、専門業者へ依頼し続けるものから、社内で育てられる事業基盤へ変えていきます。",
    details: [
      {
        label: "今の課題",
        text: "更新のたびに、外部への依頼が必要になる。",
      },
      {
        label: "INFLUの支援",
        text: "社内で更新・改善できる仕組みを整える。",
      },
      {
        label: "実現する状態",
        text: "必要なときに、安全に改善を続けられる。",
      },
    ],
    href: routes.aiHomepage,
    cta: "HPのAI化を詳しく見る",
  },
  {
    number: "02",
    eyebrow: "AX SUPPORT",
    title: "AX・業務効率化支援",
    lead: "AIを、企業の業務とマーケティングの実務へ。",
    description:
      "AIを導入して終わらせず、現場で使い続けられる業務の仕組みとして定着させます。",
    details: [
      {
        label: "今の課題",
        text: "AIを導入しても、現場で使われない。",
      },
      {
        label: "INFLUの支援",
        text: "実際の業務に合わせて、運用を設計する。",
      },
      {
        label: "実現する状態",
        text: "現場が自ら使い、改善できるようになる。",
      },
    ],
    href: routes.axSupport,
    cta: "AX・業務効率化支援を詳しく見る",
  },
]

const workflowSteps = [
  {
    number: "01",
    title: "現状を知る",
    description:
      "今ある課題と運用体制を整理し、取り組むべきことを一緒に見つけます。",
  },
  {
    number: "02",
    title: "仕組みを設計する",
    description:
      "企業の状況に合わせて、必要な施策と無理のない優先順位を決めます。",
  },
  {
    number: "03",
    title: "一緒につくる",
    description: "現場で実際に使える形を確かめながら、導入と調整を進めます。",
  },
  {
    number: "04",
    title: "自社で育てる",
    description:
      "運用方法を共有し、導入後も自社で改善を続けられる状態へつなげます。",
  },
]

const relatedBusinesses = [
  {
    eyebrow: "LINE × EC",
    title: "気軽にEC『Lea = レア』",
    description:
      "LINE公式アカウントと連動し、注文・決済・お客様とのやり取りをLINEでつなぐEC構築サービスです。",
    image: "/images/businesses/lea-line-ec.png",
    imageAlt: "Leaの管理画面とLINE上の商品画面",
    href: "https://lea-market.com/",
    cta: "Lea公式サイトへ",
  },
  {
    eyebrow: "RESTAURANT",
    title: "焼肉処 味来",
    description:
      "大阪・心斎橋で、厳選した黒毛和牛と落ち着いた個室空間を提供する飲食事業です。",
    image: "/images/businesses/mirai-yakiniku.jpg",
    imageAlt: "焼肉処 味来で提供する黒毛和牛を焼いている様子",
    href: "https://yakinikudokoro-mirai.com/",
    cta: "焼肉処 味来公式サイトへ",
  },
]

const eyebrowClass =
  "text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase"
const headingClass =
  "mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] text-[#F5F1E8] sm:text-4xl lg:text-5xl"
const bodyClass = "text-sm leading-8 text-[#CFC8BC] sm:text-base"

function BusinessContentPage() {
  return (
    <CinematicPageFrame>
      <section className="relative isolate overflow-hidden border-b border-[rgba(200,164,93,0.25)] bg-[#090909] pt-14">
        <div
          className="pointer-events-none absolute inset-0 -z-20 opacity-45 [background-image:linear-gradient(rgba(224,197,132,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(224,197,132,0.07)_1px,transparent_1px)] [background-size:clamp(4rem,8vw,8rem)_clamp(4rem,8vw,8rem)] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_72%,transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_42%,rgba(255,241,199,0.08),transparent_24%),radial-gradient(circle_at_20%_70%,rgba(200,164,93,0.08),transparent_26%),linear-gradient(180deg,transparent_58%,rgba(200,164,93,0.04))]"
          aria-hidden
        />
        <AsanohaHeroPattern className="opacity-25" />
        <Container className="relative flex min-h-[calc(min(48rem,100svh)-3.5rem)] items-center py-24 sm:py-28 lg:py-32">
          <CinematicReveal delay={0.08} className="max-w-5xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[linear-gradient(90deg,#E0C584,transparent)]" />
              <p className={eyebrowClass}>BUSINESS ARCHITECTURE</p>
            </div>

            <SunlitHeading
              as="h1"
              delay={0.25}
              className="mt-7 text-[clamp(2.8rem,9vw,5.8rem)] font-bold leading-[1.08] tracking-[-0.055em]"
            >
              <span className="block">企業の仕組みを、</span>
              <span className="mt-2 block sm:mt-3">次の時代へ。</span>
            </SunlitHeading>

            <div className="mt-10 grid max-w-5xl gap-7 border-t border-[rgba(224,197,132,0.48)] pt-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-base font-bold leading-8 tracking-[-0.015em] text-[#FFF1C7] sm:text-lg sm:leading-9">
                  ホームページ、業務、マーケティング。
                  <br className="hidden sm:block" />
                  それぞれを分断せず、AIと人がともに動ける仕組みへ整えます。
                </p>
                <p className="mt-3 hidden max-w-3xl text-sm leading-7 text-[#D8D1C5] sm:block">
                  「HPのAI化」と「AX・業務効率化支援」を中心に、企業が自社で運用・改善できる状態への移行を支援します。
                </p>
              </div>
              <SpecularButton
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                事業について相談する
              </SpecularButton>
            </div>
          </CinematicReveal>
        </Container>
      </section>

      <section
        className="border-b border-[rgba(200,164,93,0.25)] bg-[#15130F]"
        aria-labelledby="primary-services-title"
      >
        <Container className="py-20 md:py-28">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(26rem,1.18fr)] lg:items-end">
            <CinematicReveal direction="left">
              <p className={eyebrowClass}>PRIMARY SERVICES</p>
              <SunlitHeading
                id="primary-services-title"
                className="mt-4 text-4xl font-bold leading-[1.15] tracking-[-0.04em] sm:text-5xl lg:text-6xl"
              >
                <span className="block">INFLUがつくる、</span>
                <span className="mt-2 block">2つの事業基盤。</span>
              </SunlitHeading>
            </CinematicReveal>
            <CinematicReveal delay={0.1}>
              <p className="max-w-2xl text-base font-bold leading-8 text-[#FFF1C7] sm:text-lg sm:leading-9">
                ホームページの運用改善と、企業全体のAX。
                <br className="hidden sm:block" />
                入口は異なっても、目指すのは「自社で動かし、改善を続けられる状態」です。
              </p>
              <p className={`mt-5 max-w-2xl ${bodyClass}`}>
                サイト、コンテンツ、SEO、計測、業務フローを分断せず、企業ごとの課題に合わせて必要な仕組みを設計します。
              </p>
            </CinematicReveal>
          </div>

          <BusinessSystemFlow />

          <div className="mt-8 border-t border-[rgba(224,197,132,0.3)]">
            {primaryServices.map((service, serviceIndex) => (
              <CinematicReveal
                key={service.title}
                delay={serviceIndex * 0.08}
                className="border-b border-[rgba(224,197,132,0.3)] py-14 md:py-18 lg:py-20"
              >
                <div className="grid gap-9 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
                  <div>
                    <p className="text-[clamp(4.5rem,9vw,8.5rem)] font-bold leading-none tracking-[-0.08em] text-[#E0C584]/22">
                      {service.number}
                    </p>
                    <p className={`${eyebrowClass} mt-5`}>{service.eyebrow}</p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-[#F5F1E8] sm:text-4xl lg:text-5xl">
                      {service.title}
                    </h3>
                    <p className="mt-5 max-w-3xl text-xl font-bold leading-9 tracking-[-0.02em] text-[#FFF1C7] sm:text-2xl sm:leading-10">
                      {service.lead}
                    </p>
                    <p className={`mt-5 max-w-3xl ${bodyClass}`}>
                      {service.description}
                    </p>

                    <dl className="mt-10 grid gap-2 md:grid-cols-3 md:gap-0">
                      {service.details.map((detail, detailIndex) => (
                        <div
                          key={detail.label}
                          className="relative py-3 md:px-9 md:py-0 md:first:pl-0 md:last:pr-0"
                        >
                          <dt className="flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-[#E0C584]">
                            <span className="h-2 w-2 shrink-0 rounded-full border border-[#FFF1C7] shadow-[0_0_12px_rgba(255,241,199,0.65)]" />
                            <span>{detail.label}</span>
                            {detailIndex < service.details.length - 1 && (
                              <span
                                aria-hidden
                                className="absolute top-0 right-0 hidden translate-x-1/2 items-center md:flex"
                              >
                                <span className="h-px w-8 bg-[linear-gradient(90deg,rgba(224,197,132,0.2),#FFF1C7)]" />
                                <span className="ml-1 text-base leading-none text-[#FFF1C7]">
                                  →
                                </span>
                              </span>
                            )}
                          </dt>
                          <dd className="mt-4 text-lg font-bold leading-8 tracking-[-0.02em] text-[#F5F1E8]">
                            <span>{detail.text}</span>
                            {detailIndex < service.details.length - 1 && (
                              <span
                                aria-hidden
                                className="ml-[0.2rem] mt-5 block h-8 w-px bg-[linear-gradient(180deg,#FFF1C7,rgba(224,197,132,0.16))] md:hidden"
                              />
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-9 flex justify-start lg:justify-end">
                      <SpecularButton href={service.href}>
                        {service.cta}
                      </SpecularButton>
                    </div>
                  </div>
                </div>
              </CinematicReveal>
            ))}
          </div>
        </Container>
      </section>

      <section
        className="border-b border-[rgba(200,164,93,0.25)] bg-[#090909]"
        aria-labelledby="workflow-title"
      >
        <Container className="py-20 md:py-28">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)] lg:items-end">
            <CinematicReveal direction="left">
              <p className={eyebrowClass}>WORKFLOW</p>
              <SunlitHeading
                id="workflow-title"
                className="mt-4 text-[clamp(1.75rem,7vw,3.25rem)] font-bold leading-[1.15] tracking-[-0.045em]"
              >
                <span className="block whitespace-nowrap">
                  現場を理解しながら、
                </span>
                <span className="mt-2 block whitespace-nowrap">
                  使い続けられる形へ。
                </span>
              </SunlitHeading>
            </CinematicReveal>
            <CinematicReveal delay={0.1}>
              <p className="max-w-2xl text-base leading-8 text-[#D8D1C5] sm:text-lg sm:leading-9">
                専門知識がなくても進められるように、課題整理から導入、社内での運用までINFLUが伴走します。
              </p>
            </CinematicReveal>
          </div>

          <div className="relative mt-14 grid lg:mt-18 lg:grid-cols-4">
            <div
              aria-hidden
              className="absolute top-2 bottom-10 left-[0.34rem] w-px bg-[linear-gradient(180deg,#FFF1C7,#7B6135_82%,transparent)] lg:hidden"
            />
            {workflowSteps.map((step, index) => (
              <CinematicReveal
                key={step.number}
                delay={index * 0.06}
                className="relative pb-10 pl-9 lg:px-7 lg:pb-0 lg:first:pl-0 lg:last:pr-0"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <span className="absolute top-0 -left-9 h-3 w-3 rotate-45 border border-[#FFF1C7] bg-[#090909] shadow-[0_0_18px_rgba(255,241,199,0.45)] lg:static lg:shrink-0" />
                  <span className="text-xs font-bold tracking-[0.12em] text-[#E0C584]">
                    STEP {step.number}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold leading-8 text-[#F5F1E8] lg:mt-7">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#CFC8BC]">
                  {step.description}
                </p>
              </CinematicReveal>
            ))}
          </div>

          <CinematicReveal delay={0.15}>
            <div className="mt-12 flex max-w-4xl items-start gap-4 lg:mt-16">
              <span
                aria-hidden
                className="mt-3 h-px w-12 shrink-0 bg-[linear-gradient(90deg,#FFF1C7,transparent)]"
              />
              <p className="text-sm font-medium leading-7 text-[#D8D1C5] sm:text-base sm:leading-8">
                公開前の確認と専門家のサポートを組み込み、安心して運用と改善を続けられる体制を整えます。
              </p>
            </div>
          </CinematicReveal>
        </Container>
      </section>

      <section
        className="border-b border-[rgba(200,164,93,0.25)] bg-[#0B0B0B]"
        aria-labelledby="related-businesses-title"
      >
        <Container className="py-16 md:py-24">
          <div className="max-w-3xl">
            <p className={eyebrowClass}>RELATED BUSINESSES</p>
            <h2 id="related-businesses-title" className={headingClass}>
              関連事業
            </h2>
            <p className="mt-6 max-w-3xl text-base font-bold leading-8 text-[#FFF1C7] sm:text-lg sm:leading-9">
              INFLUは、デジタル支援だけでなく、
              <br className="hidden sm:block" />
              自ら事業を運営しながら、現場で得た知見を蓄積しています。
            </p>
          </div>
          <div className="mt-12 border-t border-[rgba(224,197,132,0.28)] lg:mt-16">
            {relatedBusinesses.map((business, businessIndex) => (
              <article
                key={business.title}
                className="group grid border-b border-[rgba(224,197,132,0.28)] lg:grid-cols-2"
              >
                <CinematicImageReveal
                  delay={businessIndex * 0.08}
                  className={`aspect-[16/10] overflow-hidden bg-[#15130F] lg:aspect-auto lg:min-h-[25rem] ${
                    businessIndex === 0 ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <Image
                    src={business.image}
                    alt={business.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover brightness-[0.76] saturate-[0.78] transition duration-[1200ms] ease-out group-hover:scale-[1.035] group-hover:brightness-[0.88] group-hover:saturate-100"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,7,7,0.34),transparent_48%,rgba(224,197,132,0.08))]"
                  />
                </CinematicImageReveal>

                <CinematicReveal
                  delay={0.08 + businessIndex * 0.08}
                  direction={businessIndex === 0 ? "left" : "right"}
                  className={`relative flex flex-col justify-center px-1 py-10 sm:px-8 sm:py-14 lg:min-h-[25rem] lg:px-12 ${
                    businessIndex === 0 ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div>
                    <h3
                      className={`mt-5 font-bold tracking-[-0.03em] text-[#F5F1E8] ${
                        business.href === "https://lea-market.com/"
                          ? "whitespace-nowrap text-2xl sm:text-3xl lg:text-3xl xl:text-4xl"
                          : "text-3xl sm:text-4xl lg:text-5xl"
                      }`}
                    >
                      {business.title}
                    </h3>
                    <p className={`mt-6 max-w-xl ${bodyClass}`}>
                      {business.description}
                    </p>
                  </div>
                  <div className="relative z-10 mt-9">
                    <a
                      href={business.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex w-fit items-center gap-5 border-b border-[rgba(224,197,132,0.42)] pb-2 text-sm font-bold text-[#F5F1E8] transition duration-300 hover:border-[#FFF1C7] hover:text-[#FFF1C7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF1C7]"
                    >
                      {business.cta}
                      <span
                        aria-hidden
                        className="text-[#E0C584] transition-transform duration-300 group-hover/link:translate-x-1"
                      >
                        →
                      </span>
                    </a>
                  </div>
                </CinematicReveal>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section
        className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_78%_42%,rgba(224,197,132,0.14),transparent_28%),radial-gradient(circle_at_18%_82%,rgba(176,138,85,0.08),transparent_30%),#090909] text-[#F5F1E8]"
        aria-labelledby="cta-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-[-4vw] -z-10 -translate-y-1/2 text-[clamp(9rem,23vw,22rem)] font-bold leading-none tracking-[-0.1em] text-[#E0C584]/[0.035]"
        >
          TALK
        </div>
        <Container className="py-20 md:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(21rem,0.7fr)] lg:items-end lg:gap-12">
            <CinematicReveal direction="left" className="max-w-4xl">
              <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                START A CONVERSATION
              </p>
              <SunlitHeading
                id="cta-title"
                className="mt-5 text-[clamp(1.75rem,5.6vw,3.5rem)] font-bold leading-[1.2] tracking-[-0.045em]"
              >
                <span className="block whitespace-nowrap">
                  まだ、言葉にできなくても。
                </span>
                <span className="mt-2 block whitespace-nowrap">
                  相談から始められます。
                </span>
              </SunlitHeading>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[#D8D1C5] sm:text-lg sm:leading-9">
                今のお悩みをお聞きし、何から始めるべきか一緒に整理します。サービスを決めてからご相談いただく必要はありません。
              </p>
            </CinematicReveal>

            <CinematicReveal delay={0.12} className="lg:pb-2">
              <div
                className="grid grid-cols-3 gap-3"
                role="list"
                aria-label="ご相談の流れ"
              >
                {["話す", "整理する", "次を決める"].map((step, index) => (
                  <div key={step} className="relative" role="listitem">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rotate-45 border border-[#FFF1C7] shadow-[0_0_12px_rgba(255,241,199,0.38)]" />
                      <span className="text-[0.62rem] font-bold tracking-[0.1em] text-[#E0C584]">
                        0{index + 1}
                      </span>
                      {index < 2 && (
                        <span
                          aria-hidden
                          className="h-px flex-1 bg-[linear-gradient(90deg,rgba(224,197,132,0.5),transparent)]"
                        />
                      )}
                    </div>
                    <p className="mt-3 text-sm font-bold text-[#F5F1E8] sm:text-base">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <SpecularButton
                  href={CONTACT_FORM_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto"
                >
                  まずは相談してみる
                </SpecularButton>
                <p className="mt-4 text-xs leading-6 text-[#AAA9A4]">
                  ご相談内容が整理されていない段階でも、お気軽にお聞かせください。
                </p>
              </div>
            </CinematicReveal>
          </div>
        </Container>
      </section>
    </CinematicPageFrame>
  )
}

export default function Page() {
  return <MotionProvider><BusinessContentPage /></MotionProvider>
}

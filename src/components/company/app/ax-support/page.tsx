import Site from "@company/Site"

import AsanohaHeroPattern from "@company/app/components/asanoha-hero-pattern"
import Container from "@company/app/components/container"
import SunlitHeading from "@company/app/components/home/sunlit-heading"
import {
  CinematicPageFrame,
  CinematicReveal,
} from "@company/app/components/motion/cinematic-reveal"
import SpecularButton from "@company/app/components/ui/specular-button"
import { CONTACT_FORM_HREF } from "@company/features/contact"
import { routes } from "@company/features/routes"

export const metadata = {
  title: "AX・業務効率化支援",
  description:
    "企業のAI活用・AXを、AIマーケティング、コンテンツ、計測、業務効率化まで横断して支援します。",
  alternates: { canonical: "/ax-support" },
}

const supportAreas = [
  {
    number: "01",
    title: "AIマーケティング",
    description:
      "企画、コンテンツ、導線、分析をつなぎ、AIを実務のスピードと精度を高めるために使います。",
  },
  {
    number: "02",
    title: "HPのAI化",
    description:
      "更新や改善を外部への依頼待ちにせず、自社で動かせるホームページ運用へ整えます。",
  },
  {
    number: "03",
    title: "情報・コンテンツ設計",
    description:
      "社内に眠る一次情報を整理し、営業・採用・発信で使える形へ変えていきます。",
  },
  {
    number: "04",
    title: "計測・改善の伴走",
    description:
      "見るべき数字と改善の優先順位を整理し、施策を一度きりで終わらせない運用を支えます。",
  },
  {
    number: "05",
    title: "業務効率化支援",
    description:
      "繰り返し作業や情報の受け渡しを見直し、現場に合う無理のない仕組みを設計します。",
  },
]

const principles = [
  [
    "現場から始める",
    "話題のツールではなく、今ある業務の詰まりを起点に考えます。",
  ],
  [
    "横断して整える",
    "サイト、コンテンツ、計測、業務フローを別々にせず、一つの流れとして見ます。",
  ],
  [
    "残る形にする",
    "外部に依存し続けるのではなく、社内で続けられる運用と判断基準を残します。",
  ],
]

const principleRowLayouts = [
  "lg:w-full",
  "lg:ml-[6%] lg:w-[94%]",
  "lg:ml-[12%] lg:w-[88%]",
]

const supportCardStackClasses = [
  "top-[5rem] z-[1] sm:top-[6rem]",
  "top-[5.5rem] z-[2] sm:top-[6.75rem]",
  "top-[6rem] z-[3] sm:top-[7.5rem]",
  "top-[6.5rem] z-[4] sm:top-[8.25rem]",
  "top-[7rem] z-[5] sm:top-[9rem]",
]

const processSteps = [
  [
    "DISCOVER",
    "課題を棚卸しする",
    "業務、マーケティング、既存の仕組みを確認し、どこから手をつけるべきかを見極めます。",
  ],
  [
    "DESIGN",
    "優先順位を決める",
    "効果と実行しやすさを見ながら、現場に負荷をかけすぎない進め方を設計します。",
  ],
  [
    "BUILD",
    "実行し、引き渡す",
    "仕組みを動かしながら改善し、社内で使い続けられる状態まで伴走します。",
  ],
]

const faqItems = [
  [
    "どこから相談すべきですか？",
    "まだ課題が言語化できていない段階でも大丈夫です。今困っていることや、時間がかかっている仕事から一緒に整理します。",
  ],
  [
    "マーケティング以外の相談も対象ですか？",
    "対象です。情報整理、社内の連携、繰り返し業務の見直しなど、AI活用につながる実務課題を横断して考えます。",
  ],
  [
    "社内にAIの担当者がいなくても進められますか？",
    "進められます。専門部署の新設を前提にせず、今の体制で無理なく始められる範囲から設計します。",
  ],
  [
    "費用や進め方はどう決まりますか？",
    "課題と必要な支援範囲を確認したうえでご提案します。まずは相談内容をお聞かせください。",
  ],
]

const sectionLabel =
  "text-xs font-bold tracking-[0.2em] text-gold-300 uppercase"
const darkHeading =
  "mt-4 text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl"

function AxSupportPage() {
  return (
    <CinematicPageFrame>
      <section className="relative min-h-[min(48rem,100svh)] overflow-hidden bg-[#090909] pt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(201,165,109,0.18),transparent_18%),radial-gradient(circle_at_44%_110%,rgba(176,138,85,0.16),transparent_31%)]"
        />
        <AsanohaHeroPattern className="opacity-25" />
        <Container className="relative flex min-h-[calc(min(48rem,100svh)-3.5rem)] items-center py-24 sm:py-28 lg:py-32">
          <div className="max-w-5xl">
            <CinematicReveal direction="left">
              <p className={sectionLabel}>AX SUPPORT / AI TRANSFORMATION</p>
              <SunlitHeading
                as="h1"
                delay={0.1}
                className="mt-6 max-w-5xl text-balance text-5xl font-bold leading-[1.12] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-8xl"
              >
                AIを、
                <br />
                実務の力に変える。
              </SunlitHeading>
            </CinematicReveal>
            <CinematicReveal delay={0.16} className="mt-8 max-w-2xl sm:mt-10">
              <p className="text-xl font-bold leading-9 tracking-[-0.03em] text-[#F5F1E8] sm:text-2xl sm:leading-10">
                AX・業務効率化支援
              </p>
              <p className="mt-5 text-sm leading-8 text-muted sm:text-base sm:leading-9">
                AIを話題や導入で終わらせず、日々の業務とマーケティングへ。課題の整理から実行、社内に残る運用づくりまで伴走します。
              </p>
            </CinematicReveal>
            <CinematicReveal delay={0.26} className="mt-10">
              <SpecularButton
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                企業のAI活用・AXについて相談する
              </SpecularButton>
            </CinematicReveal>
          </div>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#15130F]"
        aria-labelledby="definition-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-20">
            <CinematicReveal direction="left">
              <p className={sectionLabel}>WHAT AX MEANS</p>
              <SunlitHeading
                id="definition-title"
                delay={0.08}
                className={darkHeading}
              >
                INFLUにおけるAX
              </SunlitHeading>
            </CinematicReveal>
            <CinematicReveal delay={0.12}>
              <p className="max-w-2xl text-lg font-bold leading-9 tracking-[-0.025em] text-[#F5F1E8] sm:text-xl sm:leading-10">
                生成AIや自動化を、現場の仕事に接続すること。
              </p>
              <p className="mt-5 max-w-xl text-sm leading-8 text-muted sm:text-base sm:leading-9">
                ツールを増やすことを目的にしません。仕事の流れを見直し、判断や創造に時間を使える状態をつくることを目指します。
              </p>
            </CinematicReveal>
          </div>
          <ol className="mt-12 border-t border-line-gold lg:mt-16">
            {principles.map(([title, description], index) => (
              <li
                key={title}
                className={`border-b border-line-gold py-8 sm:py-10 lg:py-12 ${principleRowLayouts[index] ?? ""}`}
              >
                <CinematicReveal
                  delay={0.12 + index * 0.08}
                  direction="left"
                  className="grid gap-5 sm:grid-cols-[3.5rem_minmax(15rem,0.8fr)_minmax(20rem,1fr)] sm:items-start sm:gap-7 lg:grid-cols-[4rem_minmax(17rem,0.8fr)_minmax(22rem,1fr)] lg:gap-10"
                >
                  <span className="text-xs font-bold tracking-[0.2em] text-gold-300">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl font-bold leading-tight tracking-[-0.035em] text-foreground sm:text-3xl">
                    {title}
                  </h3>
                  <p className="max-w-xl text-sm leading-8 text-muted sm:text-base">
                    {description}
                  </p>
                </CinematicReveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        data-cinematic-sticky="true"
        className="relative overflow-clip bg-[#090909]"
        aria-labelledby="support-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(224,197,132,0.34)_1px,transparent_1.2px)] [background-size:19px_19px]"
        />
        <Container className="relative py-20 md:py-28 lg:py-32">
          <CinematicReveal direction="left" className="max-w-3xl">
            <p className={sectionLabel}>SUPPORT AREAS</p>
            <SunlitHeading
              id="support-title"
              delay={0.08}
              className={darkHeading}
            >
              事業を前に進める、
              <br />
              5つの支援領域。
            </SunlitHeading>
          </CinematicReveal>
          <ol className="relative mt-14 space-y-4 pb-[24vh] sm:space-y-5 sm:pb-[28vh] lg:mt-20">
            {supportAreas.map((area, index) => (
              <li
                key={area.title}
                className={`group sticky min-h-[13.5rem] overflow-hidden rounded-xl border border-line-gold bg-[#11110F] p-5 shadow-[0_-10px_32px_rgba(0,0,0,0.3)] transition-colors duration-500 hover:bg-[#171510] sm:min-h-[14rem] sm:p-7 lg:min-h-[15rem] lg:p-8 ${supportCardStackClasses[index] ?? ""}`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(224,197,132,0.055),transparent_38%),radial-gradient(circle_at_88%_18%,rgba(224,197,132,0.08),transparent_24%)]"
                />
                <CinematicReveal
                  delay={0.05 + index * 0.06}
                  className="relative z-10 flex min-h-[11rem] flex-col sm:min-h-[10.5rem] lg:min-h-[11rem]"
                >
                  <span className="text-xs font-bold tracking-[0.2em] text-gold-300">
                    SUPPORT AREA
                  </span>
                  <div className="mt-auto grid gap-4 pt-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(20rem,0.72fr)] lg:items-end lg:gap-12">
                    <h3 className="max-w-2xl text-3xl font-bold leading-tight tracking-[-0.045em] text-foreground sm:text-4xl">
                      {area.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-8 text-muted sm:text-base">
                      {area.description}
                    </p>
                  </div>
                </CinematicReveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-[#15130F]" aria-labelledby="process-title">
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal
            direction="left"
            className="grid gap-8 border-b border-line-gold pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20 lg:pb-14"
          >
            <div>
              <p className={sectionLabel}>HOW WE WORK</p>
              <SunlitHeading
                id="process-title"
                delay={0.08}
                className={darkHeading}
              >
                一緒に考え、
                <br />
                動かせる形へ。
              </SunlitHeading>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-muted sm:text-base lg:pb-1">
              大きな変革を急ぐよりも、今の組織で確実に動かせる一歩から。進めながら調整し、実務に定着するところまで見届けます。
            </p>
          </CinematicReveal>

          <div
            role="list"
            aria-label="AX支援の進め方"
            className="mt-12 lg:grid lg:grid-cols-3 lg:gap-10"
          >
            {processSteps.map(([label, title, description], index) => (
              <div
                role="listitem"
                key={label}
                className="relative border-b border-line-gold py-9 last:border-b-0 lg:border-b-0 lg:border-r lg:py-4 lg:pr-10 lg:last:border-r-0 lg:last:pr-0"
              >
                <CinematicReveal
                  delay={0.08 + index * 0.1}
                  className="flex h-full flex-col"
                >
                  <span className="whitespace-nowrap text-[clamp(2.25rem,3.6vw,3.75rem)] font-bold leading-none tracking-[-0.05em] text-gold-300">
                    {label}
                  </span>
                  <h3 className="mt-8 text-2xl font-bold tracking-[-0.035em] text-foreground sm:text-3xl lg:mt-12">
                    {title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-8 text-muted">
                    {description}
                  </p>
                </CinematicReveal>
                {index < processSteps.length - 1 ? (
                  <>
                    <span
                      aria-hidden
                      className="absolute -bottom-6 left-3 z-10 text-xl text-gold-300 lg:hidden"
                    >
                      ↓
                    </span>
                    <span
                      aria-hidden
                      className="absolute -right-7 top-5 z-10 hidden text-xl text-gold-300 lg:block"
                    >
                      →
                    </span>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section
        className="relative overflow-hidden border-y border-line-gold bg-[#090909]"
        aria-labelledby="relation-title"
      >
        <Container className="py-16 md:py-20">
          <CinematicReveal
            direction="left"
            className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,0.72fr)] lg:items-end lg:gap-24"
          >
            <div>
              <p className={sectionLabel}>RELATED SUPPORT</p>
              <SunlitHeading
                id="relation-title"
                delay={0.08}
                className={darkHeading}
              >
                HPのAI化
              </SunlitHeading>
            </div>
            <div className="max-w-xl">
              <p className="text-base font-bold leading-8 tracking-[-0.02em] text-foreground sm:text-lg sm:leading-9">
                ホームページも、AXの土台になる。
              </p>
              <p className="mt-4 text-sm leading-8 tracking-normal text-muted sm:text-base">
                更新や発信の速度が課題になっている場合は、AI活用を前提にホームページの仕組みから見直すこともできます。
              </p>
              <a
                href={routes.aiHomepage}
                className="group mt-8 grid w-fit min-w-48 grid-cols-[1fr_auto] items-center gap-10 border-b border-gold-300/70 pb-3 text-sm font-bold tracking-[0.02em] text-foreground transition-colors duration-300 hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
              >
                詳しく見る
                <span
                  aria-hidden
                  className="text-gold-300 transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          </CinematicReveal>
        </Container>
      </section>

      <section className="bg-[#15130F]" aria-labelledby="faq-title">
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal direction="left" className="max-w-3xl">
            <p className={sectionLabel}>FAQ</p>
            <SunlitHeading id="faq-title" delay={0.08} className={darkHeading}>
              よくある質問
            </SunlitHeading>
          </CinematicReveal>
          <dl className="mt-14 border-t border-line-gold lg:mt-20">
            {faqItems.map(([question, answer], index) => (
              <CinematicReveal key={question} delay={0.05 + index * 0.07}>
                <div className="grid gap-5 border-b border-line-gold py-7 sm:grid-cols-[5rem_1fr] sm:gap-8 sm:py-9">
                  <dt className="text-sm font-bold tracking-[0.12em] text-gold-300">
                    Q.0{index + 1}
                  </dt>
                  <dd>
                    <h3 className="text-lg font-bold leading-8 text-foreground sm:text-xl">
                      {question}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-8 text-muted">
                      {answer}
                    </p>
                  </dd>
                </div>
              </CinematicReveal>
            ))}
          </dl>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#090909]"
        aria-labelledby="cta-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(201,165,109,0.24),transparent_48%)]"
        />
        <Container className="relative py-24 text-center md:py-32 lg:py-40">
          <CinematicReveal className="mx-auto max-w-4xl">
            <p className={sectionLabel}>LET&apos;S START WITH THE REAL WORK</p>
            <SunlitHeading
              id="cta-title"
              delay={0.08}
              className="mt-5 text-balance text-4xl font-bold leading-[1.18] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-7xl"
            >
              AIを、次の仕事の
              <br />
              味方にしよう。
            </SunlitHeading>
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-muted sm:text-base">
              まずは、いまの仕事で時間がかかっていること、前に進めたいことをお聞かせください。
            </p>
            <div className="mt-10">
              <SpecularButton
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                企業のAI活用・AXについて相談する
              </SpecularButton>
            </div>
          </CinematicReveal>
        </Container>
      </section>
    </CinematicPageFrame>
  )
}

export default function Page() {
  return <Site pathname="/ax-support"><AxSupportPage /></Site>
}

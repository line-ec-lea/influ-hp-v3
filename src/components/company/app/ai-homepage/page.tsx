import Site from "@company/Site"

import AiHomepageFreefallCard from "@company/app/components/ai-homepage-freefall-card"
import AiHomepageGoodFitSequence from "@company/app/components/ai-homepage-good-fit-sequence"
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
  title: "HPのAI化",
  description:
    "既存ホームページの制作・保守・更新をAI活用前提で再設計し、自社主導で運用・改善できる体制への移行を支援します。",
  alternates: { canonical: "/ai-homepage" },
}

const commonIssues = [
  "保守管理の内容が見えにくい",
  "軽微な修正にも、依頼と確認のやり取りが必要になる",
  "記事公開やSEO施策に時間がかかり、改善を進めにくい",
  "CMSやサーバーの更新・セキュリティ対応が把握しにくい",
]

const issueCardLayouts = [
  "lg:col-span-5 lg:col-start-2",
  "lg:col-span-5 lg:col-start-7 lg:-mt-4",
  "lg:col-span-7 lg:col-start-1 lg:-mt-1",
  "lg:col-span-5 lg:col-start-6 lg:-mt-9",
]

const definitionPoints = [
  "見た目を変えるだけでなく、制作・保守・更新・改善の進め方そのものを見直す",
  "自社で情報や記事を管理し、AIを活用して修正やカスタマイズを行う",
  "表示と更新を支える仕組みを整え、外部に頼りすぎない運用へ整える",
  "技術導入を目的にせず、自社で運用・改善を続けられる状態を目指す",
]

const comparisonRows = [
  {
    label: "記事管理",
    before: "外部に依存した記事管理",
    after: "自社で記事を作成・管理する運用",
  },
  {
    label: "サイト修正",
    before: "制作会社への依頼中心",
    after: "AIを活用し、社内で確認しながら進める運用",
  },
  {
    label: "表示基盤",
    before: "従来のサーバー依存",
    after: "安定した表示と更新を支える基盤",
  },
  {
    label: "セキュリティ",
    before: "更新や動作確認が把握しにくい状態",
    after: "更新内容を確認しながら進める体制",
  },
]

const changes = [
  "記事や文言を自社で更新できる範囲が広がる",
  "ヘッドコピー、CTA、導線などの改善を外部への依頼待ちにしにくくなる",
  "自社の一次情報を使ったコンテンツ制作と公開を進めやすくなる",
  "保守内容や更新状況を把握しやすくなる",
  "サイトを「置物」にせず、マーケティング施策と連動させやすくなる",
]

const processSteps = [
  "現状のホームページ、記事、運用課題の確認",
  "既存データの抽出と移行範囲の設計",
  "記事・情報の移行と管理方法の整理",
  "Webサイトの表示基盤と更新フローの構築",
  "画像URL、API制限、キャッシュ等の技術課題への対応",
  "動作確認、運用方法の共有、引き渡し",
]

const processCardLayouts = [
  "lg:left-[2%] lg:top-0 lg:w-[42%] lg:-rotate-2",
  "lg:right-[1%] lg:top-[4.5rem] lg:w-[43%] lg:rotate-2",
  "lg:left-[20%] lg:top-[12.5rem] lg:w-[46%] lg:rotate-1",
  "lg:bottom-[7rem] lg:left-0 lg:w-[42%] lg:-rotate-2",
  "lg:right-[2%] lg:bottom-[8.5rem] lg:w-[43%] lg:rotate-2",
  "lg:right-[20%] lg:bottom-0 lg:w-[46%] lg:-rotate-1",
]

const suitableCompanies = [
  "制作会社にHPを任せきりで、修正が依頼待ちになる",
  "保守管理費が続くのに更新や改善が進まない",
  "CMSやサーバーの運用負荷、セキュリティ更新に課題がある",
  "記事公開、SEO、CTA改善を自社で速く回したい",
  "既存HPをリプレイスし、AI活用前提の運用へ移行したい",
]

const unsuitableCases = [
  "デザイン品質や世界観づくりを最優先したい",
  "AIに任せれば確認なしですべて自動化できることを期待している",
  "完成品を納品してもらうだけの発注関係を求めている",
  "一度作って終わりで、運用体制の見直しは不要",
  "改善を続ける必要がなく、現状維持で十分",
]

const caseStudyPoints = [
  "外部依存の運用から、自社で更新・改善を進めやすい体制へ移行",
  "記事更新、コード修正、セキュリティ更新を自社で管理しやすい体制へ変更",
  "技術的な変更そのものではなく、マーケティングのスピードと精度を高めるための事例として紹介",
]

const eyebrowClass =
  "text-xs font-bold tracking-widest text-[#1f4e79] uppercase"

function AiHomepagePage() {
  return (
    <CinematicPageFrame>
      <section className="relative overflow-hidden border-b border-[#1f4e79]/20 bg-[#f7f9fb] pt-14">
        <AsanohaHeroPattern className="opacity-20" />
        <Container className="relative py-20 sm:py-24 lg:py-32">
          <div className="max-w-4xl">
            <p className={eyebrowClass}>AI-READY HOMEPAGE</p>
            <SunlitHeading
              as="h1"
              delay={0.12}
              className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight text-[#1f4e79] md:text-6xl"
            >
              HPのAI化
            </SunlitHeading>
            <p className="mt-7 max-w-3xl text-xl font-bold leading-9 tracking-tight text-[#1f4e79] sm:text-2xl sm:leading-10">
              ホームページの運用を、外注任せから自社で改善できる状態へ。
            </p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#30363d] sm:text-lg">
              更新・記事公開・サイト改善を、AI活用前提で自社主導に変える。
              単なる制作費の削減ではなく、マーケティングを速く正確に進めるための仕組みとして再設計します。
            </p>
            <div className="mt-7 inline-flex rounded-full border border-[#1f4e79]/25 bg-white px-4 py-2 text-sm font-bold text-[#1f4e79] shadow-sm">
              低価格で相談可能
            </div>
            <div className="mt-9">
              <SpecularButton
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                HPのAI化について相談する
              </SpecularButton>
            </div>
          </div>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#090909]"
        aria-labelledby="issues-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(224,197,132,0.42)_1px,transparent_1.25px)] [background-size:18px_18px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-[#E0C584]/8 blur-3xl"
        />
        <Container className="py-20 md:py-28 lg:py-32">
          <div className="relative">
            <CinematicReveal direction="left" className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.18em] text-[#E0C584] uppercase">
                COMMON ISSUES
              </p>
              <SunlitHeading
                id="issues-title"
                delay={0.08}
                className="mt-4 text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
              >
                よくある課題
              </SunlitHeading>
              <p className="mt-7 max-w-xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
                更新や改善が外部への依頼待ちになり、ホームページがマーケティングの速度を下げていないかを確認します。
              </p>
            </CinematicReveal>

            <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-11 lg:items-center lg:gap-x-7 lg:gap-y-11">
              {commonIssues.map((issue, index) => (
                <li
                  key={issue}
                  className={`group ${issueCardLayouts[index] ?? ""}`}
                >
                  <AiHomepageFreefallCard
                    delay={0.06 + index * 0.07}
                    className="relative overflow-hidden rounded-[1.75rem] border-[3px] border-[#D7B568] bg-[#F5F1E8] px-6 py-6 shadow-[0_18px_0_rgba(224,197,132,0.16),0_26px_38px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:-translate-y-2 sm:px-7 sm:py-7 lg:px-8 lg:py-8"
                  >
                    <div className="relative max-w-2xl text-lg font-bold leading-8 tracking-[-0.03em] text-[#171512] sm:text-xl sm:leading-9">
                      {issue}
                    </div>
                  </AiHomepageFreefallCard>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#15130F]"
        aria-labelledby="definition-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <div className="grid gap-7 border-b border-[rgba(224,197,132,0.24)] pb-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(28rem,1.16fr)] lg:items-end lg:gap-16 lg:pb-14">
            <CinematicReveal direction="left" className="max-w-xl">
              <p className="text-xs font-bold tracking-[0.18em] text-[#E0C584] uppercase">
                WHAT IT MEANS
              </p>
              <SunlitHeading
                id="definition-title"
                delay={0.08}
                className="mt-4 text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
              >
                HPのAI化とは
              </SunlitHeading>
            </CinematicReveal>
            <CinematicReveal delay={0.1} className="lg:pb-1">
              <p className="max-w-xl text-sm leading-8 text-[#CFC8BC] sm:text-base sm:leading-9">
                既存ホームページを作り直すだけではありません。制作・保守・更新・改善の仕組みを、AIを活用しながら自社で運用・改善を進められる形へ整えていきます。
              </p>
            </CinematicReveal>
          </div>

          <div className="mt-10 md:mt-12 lg:mt-14">
            <ol className="grid gap-px overflow-hidden border border-[rgba(224,197,132,0.24)] bg-[rgba(224,197,132,0.24)] sm:grid-cols-2">
              {definitionPoints.map((point, index) => (
                <li
                  key={point}
                  className="group relative min-h-48 overflow-hidden bg-[#15130F] px-6 py-7 sm:min-h-52 sm:px-8 sm:py-8 lg:min-h-52 lg:px-10 lg:py-8"
                >
                  <CinematicReveal
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={0.2 + index * 0.07}
                    className="relative z-10 flex h-full flex-col"
                  >
                    <span className="flex items-center gap-3 text-xs font-bold tracking-[0.18em] text-[#E0C584]">
                      <span>POINT {String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px w-5 bg-[#E0C584]/50" aria-hidden />
                    </span>
                    <p className="mt-6 max-w-md text-lg font-bold leading-8 tracking-[-0.025em] text-[#F5F1E8] sm:text-xl sm:leading-9 lg:mt-7">
                      {point}
                    </p>
                  </CinematicReveal>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#090909]"
        aria-labelledby="comparison-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal direction="left">
            <SunlitHeading
              id="comparison-title"
              delay={0.08}
              className="text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
            >
              移行前後の違い
            </SunlitHeading>
          </CinematicReveal>

          <div className="mt-12 border-t border-[rgba(224,197,132,0.28)] pt-5 md:mt-16 md:pt-6 lg:mt-18">
            <div
              role="list"
              className="grid gap-px bg-[rgba(224,197,132,0.24)] sm:grid-cols-2"
            >
              {comparisonRows.map((row, index) => (
                <div
                  key={row.label}
                  role="listitem"
                  className="bg-[#090909] px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9"
                >
                  <CinematicReveal delay={0.04 + index * 0.05}>
                    <p className="text-base font-bold tracking-[-0.015em] text-[#F5F1E8] sm:text-lg">
                      {row.label}
                    </p>
                  </CinematicReveal>

                  <div className="mt-6 space-y-4 border-t border-[rgba(224,197,132,0.18)] pt-5">
                    <CinematicReveal
                      direction="left"
                      delay={0.08 + index * 0.06}
                    >
                      <p className="flex gap-3 text-sm leading-7 text-[#979086] sm:text-base sm:leading-8">
                        <span
                          className="mt-0.5 text-xl leading-none text-[#8E887E]"
                          aria-hidden
                        >
                          ×
                        </span>
                        {row.before}
                      </p>
                    </CinematicReveal>

                    <CinematicReveal
                      direction="right"
                      delay={0.16 + index * 0.06}
                    >
                      <p className="flex gap-3 text-base font-bold leading-7 tracking-[-0.015em] text-[#F5F1E8] sm:text-lg sm:leading-8">
                        <span
                          className="mt-0.5 text-xl leading-none text-[#E0C584]"
                          aria-hidden
                        >
                          ○
                        </span>
                        {row.after}
                      </p>
                    </CinematicReveal>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 flex max-w-3xl gap-4 text-sm leading-8 text-[#CFC8BC]">
            <span className="mt-3 h-px w-8 shrink-0 bg-[#E0C584]" aria-hidden />
            採用する構成や運用方法は、既存サイトの状態と社内体制に応じて設計します。
          </p>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#15130F]"
        aria-labelledby="changes-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal direction="left">
            <p className="text-xs font-bold tracking-[0.18em] text-[#E0C584] uppercase">
              OUTCOMES
            </p>
            <SunlitHeading
              id="changes-title"
              delay={0.08}
              className="mt-4 text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
            >
              何が変わるか
            </SunlitHeading>
          </CinematicReveal>

          <ol className="mt-14 grid gap-12 md:mt-18 md:gap-16 lg:mt-24 lg:gap-20">
            {changes.map((change, index) => (
              <li
                key={change}
                className={`relative w-full max-w-5xl ${index % 2 === 0 ? "mr-auto" : "ml-auto"}`}
              >
                <CinematicReveal
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={0.06 + index * 0.07}
                >
                  <div className="grid gap-5 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:items-start sm:gap-8">
                    <div className="flex items-center gap-3 sm:block">
                      <span className="text-4xl font-bold leading-none tracking-[-0.07em] text-[#E0C584]/45 sm:text-5xl">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="h-px w-10 bg-[#E0C584]/60 sm:mt-5 sm:block sm:w-full"
                        aria-hidden
                      />
                    </div>
                    <p className="text-xl font-bold leading-[1.55] tracking-[-0.03em] text-[#F5F1E8] sm:text-2xl lg:text-3xl lg:leading-[1.45]">
                      {change}
                    </p>
                  </div>
                </CinematicReveal>
              </li>
            ))}
          </ol>

          <p className="mt-16 flex max-w-4xl gap-4 text-xs leading-7 text-[#9F988D] sm:mt-20 sm:text-sm sm:leading-8 lg:mt-24">
            <span
              className="mt-3 h-px w-8 shrink-0 bg-[#E0C584]/75"
              aria-hidden
            />
            ※費用、更新速度、SEO・AI検索への影響は、サイト規模や運用体制によって異なるため成果を断定しません。
          </p>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#090909]"
        aria-labelledby="process-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal direction="left">
            <p className="text-xs font-bold tracking-[0.18em] text-[#E0C584] uppercase">
              PROCESS
            </p>
            <SunlitHeading
              id="process-title"
              delay={0.08}
              className="mt-4 text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
            >
              進め方
            </SunlitHeading>
          </CinematicReveal>

          <ol className="relative mt-14 grid gap-4 md:mt-18 md:gap-5 lg:mt-20 lg:min-h-[48rem] lg:block">
            {processSteps.map((step, index) => (
              <li
                key={step}
                className={`relative lg:absolute ${processCardLayouts[index] ?? ""}`}
              >
                <CinematicReveal
                  direction="left"
                  delay={0.06 + index * 0.08}
                  className="group relative min-h-32 overflow-hidden border border-white/[0.12] bg-[#11110F] px-6 py-6 shadow-[0_18px_42px_rgba(0,0,0,0.32)] transition-[border-color,transform,background-color] duration-500 hover:-translate-y-1 hover:border-[#F5F1E8]/35 hover:bg-[#151512] sm:min-h-36 sm:px-8 sm:py-7 lg:min-h-40"
                >
                  <span
                    aria-hidden
                    className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#D2AE6E]/55 bg-[#11110F] text-xs font-bold text-[#D2AE6E]"
                  >
                    {String(index + 1)}
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-0 h-px w-10 bg-[#D2AE6E]/65 transition-[width] duration-500 group-hover:w-16"
                  />
                  <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#D2AE6E] uppercase">
                    STEP {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-5 max-w-md text-lg font-bold leading-8 tracking-[-0.025em] text-[#F5F1E8] sm:text-xl sm:leading-9">
                    {step}
                  </p>
                </CinematicReveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#15130F]"
        aria-labelledby="suitable-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal className="max-w-4xl">
            <p className="text-xs font-bold tracking-[0.18em] text-[#E0C584] uppercase">
              GOOD FIT
            </p>
            <SunlitHeading
              id="suitable-title"
              delay={0.08}
              className="mt-4 text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
            >
              こんな会社に向いている
            </SunlitHeading>
          </CinematicReveal>

          <AiHomepageGoodFitSequence items={suitableCompanies} />
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#0C0B09]"
        aria-labelledby="unsuitable-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal direction="left" className="max-w-4xl">
            <p className="text-xs font-bold tracking-[0.18em] text-[#E0C584] uppercase">
              NOT A GOOD FIT
            </p>
            <SunlitHeading
              id="unsuitable-title"
              delay={0.08}
              className="mt-4 text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
            >
              向いていない場合
            </SunlitHeading>
          </CinematicReveal>

          <ul className="mt-16 grid gap-14 md:mt-20 lg:mt-24 lg:grid-cols-3 lg:gap-16">
            {unsuitableCases.map((item, index) => (
              <li key={item} className="group relative min-h-64">
                <CinematicReveal
                  delay={0.08 + index * 0.1}
                  className="relative h-full pt-20"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-0 left-0 text-[7.5rem] font-light leading-none text-[#E0C584]/18 transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-[#E0C584]/28 sm:text-[9rem]"
                  >
                    ×
                  </span>
                  <p className="relative z-10 max-w-md text-xl font-bold leading-9 tracking-[-0.025em] text-[#F5F1E8] sm:text-2xl sm:leading-10">
                    {item}
                  </p>
                  <span
                    aria-hidden
                    className="mt-8 block h-px w-12 bg-[#E0C584]/45 transition-[width,opacity] duration-500 group-hover:w-20 group-hover:bg-[#FFF1C7]/70"
                  />
                </CinematicReveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#15130F]"
        aria-labelledby="case-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal direction="left">
            <p className="text-xs font-bold tracking-[0.18em] text-[#E0C584] uppercase">
              INFLU CASE STUDY
            </p>
            <SunlitHeading
              id="case-title"
              delay={0.08}
              className="mt-4 text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
            >
              INFLU自身の事例
            </SunlitHeading>
          </CinematicReveal>

          <div className="relative mt-14 md:mt-18 lg:mt-24 lg:min-h-[38rem]">
            <CinematicReveal
              delay={0.12}
              className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 select-none lg:block"
            >
              <p
                aria-hidden
                className="text-center text-[clamp(9rem,20vw,19rem)] font-bold leading-none tracking-[-0.09em] text-transparent [-webkit-text-stroke:1px_rgba(224,197,132,0.16)]"
              >
                INFLU
              </p>
            </CinematicReveal>

            <ol className="relative z-10 grid gap-14 lg:block lg:min-h-[38rem]">
              {caseStudyPoints.map((point, index) => (
                <li
                  key={point}
                  className={`relative max-w-2xl ${index === 0 ? "lg:absolute lg:top-0 lg:left-0 lg:w-[46%]" : index === 1 ? "lg:absolute lg:top-20 lg:right-0 lg:w-[40%]" : "lg:absolute lg:bottom-0 lg:left-[18%] lg:w-[64%] lg:max-w-4xl"}`}
                >
                  <CinematicReveal
                    direction={index === 1 ? "right" : "left"}
                    delay={0.18 + index * 0.1}
                    className="group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold tracking-[0.18em] text-[#E0C584]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="h-px w-10 bg-[#E0C584]/50 transition-[width] duration-500 group-hover:w-16"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-6 text-lg font-bold leading-9 tracking-[-0.025em] text-[#F5F1E8] sm:text-xl sm:leading-10 lg:text-2xl">
                      {point}
                    </p>
                  </CinematicReveal>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-14 flex max-w-4xl gap-4 text-xs leading-7 text-[#9F988D] sm:text-sm sm:leading-8 lg:mt-20">
            <span
              className="mt-3 h-px w-8 shrink-0 bg-[#E0C584]/70"
              aria-hidden
            />
            ※費用・期間・アクセス数等の具体的な数字は、掲載可否を確認したものだけ使用します。
          </p>
        </Container>
      </section>

      <section className="bg-[#1f4e79] text-white" aria-labelledby="cta-title">
        <Container className="py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold tracking-widest text-white/70 uppercase">
                CONTACT
              </p>
              <SunlitHeading
                id="cta-title"
                delay={0.08}
                className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              >
                相談する
              </SunlitHeading>
              <p className="mt-6 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">
                既存サイトの状態と社内体制を確認し、移行範囲や運用方法を整理します。
              </p>
            </div>
            <div className="grid gap-3">
              <SpecularButton
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
              >
                HPのAI化について相談する
              </SpecularButton>
              <SpecularButton href={routes.axSupport} fullWidth>
                AX・業務効率化支援を見る
              </SpecularButton>
            </div>
          </div>
        </Container>
      </section>
    </CinematicPageFrame>
  )
}

export default function Page() {
  return <Site pathname="/ai-homepage"><AiHomepagePage /></Site>
}

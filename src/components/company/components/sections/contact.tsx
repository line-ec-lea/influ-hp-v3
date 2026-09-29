
import CinematicSection from "@company/components/cinematic-section"
import { cinematicStyles } from "@shared/react/cinematic-styles"
import Container from "@shared/react/container"
import SunlitHeading from "@shared/react/home/sunlit-heading"
import { CinematicReveal } from "@shared/react/motion/cinematic-reveal"
import SpecularButton from "@shared/react/ui/specular-button"
import { CONTACT_FORM_HREF, RECRUITMENT_FORM_HREF } from "@shared/features/contact"
import { routes } from "@shared/features/routes"

type ContactBlockProps = {
  context?: "default" | "homepage"
  variant?: "light" | "dark"
}

const homepageDestinations = [
  {
    title: "事業を知る",
    description:
      "WEBマーケティング、スクール、LINE構築など、INFLUの事業内容をご覧いただけます。",
    href: routes.service,
    label: "事業内容を見る",
    external: false,
  },
  {
    title: "一緒に働く",
    description:
      "INFLUで一緒に働く仲間を募集しています。ご興味のある方はフォームよりお気軽にご応募ください。",
    href: RECRUITMENT_FORM_HREF,
    label: "採用に応募する",
    external: true,
  },
]

export default function ContactBlock({
  context = "default",
  variant = "light",
}: ContactBlockProps) {
  const dark = variant === "dark"
  const homepage = context === "homepage"

  if (!dark) {
    return (
      <section className="border-t border-line bg-section">
        <Container className="py-16 md:py-20">
          <CinematicReveal
            className={`${cinematicStyles.frame} px-4 py-8 text-foreground sm:px-6 sm:py-10 md:px-10 md:py-12`}
          >
            <div className="max-w-2xl lg:max-w-4xl">
              <h2 className="text-balance text-2xl font-semibold tracking-normal text-foreground md:text-3xl">
                WEBプロモーションのことならお気軽に
                <span className="sm:whitespace-nowrap">
                  お問い合わせください。
                </span>
              </h2>
              <p className="mt-4 leading-8 text-muted">
                ご相談、事業内容の確認、採用応募など、目的に合わせてお進みください。
              </p>
            </div>

            <div className="mt-8 space-y-3 md:mt-10 md:space-y-6">
              <div
                className={`${cinematicStyles.panel} flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 md:flex-row md:items-center md:justify-between md:p-8`}
              >
                <div className="max-w-2xl">
                  <h3 className="text-xl font-bold md:text-2xl">相談する</h3>
                  <p className="mt-3 text-sm leading-7 text-muted md:text-base">
                    ECの立ち上げ、集客、LINE・SNSを活用したプロモーション、商品設計など、お困りごとはお気軽にご相談ください。
                  </p>
                </div>
                <SpecularButton
                  href={CONTACT_FORM_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  相談する
                </SpecularButton>
              </div>

              <div className="grid gap-3 md:grid-cols-2 md:gap-6">
                <div
                  className={`${cinematicStyles.panel} flex h-full flex-col p-4 sm:p-6`}
                >
                  <h3 className="text-lg font-bold">事業を知る</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-muted">
                    WEBマーケティング、スクール、LINE構築など、INFLUの事業内容をご覧いただけます。
                  </p>
                  <SpecularButton
                    href={routes.service}
                    className="mt-6"
                    fullWidth
                  >
                    事業内容を見る
                  </SpecularButton>
                </div>

                <div
                  className={`${cinematicStyles.panel} flex h-full flex-col p-4 sm:p-6`}
                >
                  <h3 className="text-lg font-bold">一緒に働く</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-muted">
                    INFLUで一緒に働く仲間を募集しています。ご興味のある方はフォームよりお気軽にご応募ください。
                  </p>
                  <SpecularButton
                    href={RECRUITMENT_FORM_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6"
                    fullWidth
                  >
                    採用に応募する
                  </SpecularButton>
                </div>
              </div>
            </div>
          </CinematicReveal>
        </Container>
      </section>
    )
  }

  const ContentReveal = homepage ? "div" : CinematicReveal

  const content = (
    <Container className={homepage ? "py-16 md:py-24" : "py-16 md:py-20"}>
      <ContentReveal
        className={
          homepage
            ? "relative overflow-hidden border-y border-[rgba(200,164,93,0.28)] py-10 text-[#F5F1E8] md:py-14"
            : "relative overflow-hidden border-y border-line py-10 text-foreground md:py-14"
        }
      >
        <div
          className={
            homepage
              ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.35fr)] lg:items-end"
              : "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.42fr)] lg:items-end"
          }
        >
          <div className="max-w-3xl">
            <p
              className={
                homepage
                  ? "text-xs font-bold tracking-[0.16em] text-[#E0C584]"
                  : cinematicStyles.eyebrow
              }
            >
              CONTACT
            </p>
            {homepage ? (
              <SunlitHeading className="mt-4 text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl lg:text-[3.25rem]">
                <span className="block lg:whitespace-nowrap">
                  まだ、うまく言葉にできなくても
                </span>
                <span className="block">大丈夫です。</span>
              </SunlitHeading>
            ) : (
              <h2 className={`${cinematicStyles.heading} mt-4 text-balance`}>
                まずは、いまの課題を聞かせてください。
              </h2>
            )}
            <p
              className={`mt-5 max-w-2xl leading-8 ${homepage ? "text-[#D8D1C5]" : "text-muted"}`}
            >
              {homepage
                ? "現在のお悩みを伺い、どこから始めるべきか一緒に整理します。"
                : "AI導入、AX、ホームページの課題、業務効率化まで。事業と現場の状況に合わせて、どこから始めるべきか一緒に整理します。"}
            </p>
          </div>

          {homepage ? (
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <SpecularButton
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                相談する
              </SpecularButton>
              <a
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-3 border-b border-[rgba(224,197,132,0.35)] text-sm font-semibold text-[#D8D1C5] transition-[border-color,color] duration-300 hover:border-[#FFF1C7] hover:text-[#FFF7E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF1C7]"
              >
                ホームページについて相談する
                <span
                  aria-hidden
                  className="text-[#E0C584] transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <SpecularButton
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
              >
                相談する
              </SpecularButton>
              <SpecularButton
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
              >
                ホームページについて相談する
              </SpecularButton>
            </div>
          )}
        </div>

        {homepage ? (
          <div className="mt-12">
            {homepageDestinations.map((destination, index) => (
              <CinematicReveal
                key={destination.title}
                direction="left"
                delay={index * 0.08}
                className="group/row grid gap-x-8 gap-y-4 border-t border-[rgba(216,194,139,0.28)] py-8 md:grid-cols-[7rem_minmax(10rem,0.42fr)_minmax(0,1fr)_auto] md:items-center md:py-10"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold tracking-[0.18em] text-[#E0C584]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 bg-[linear-gradient(90deg,#E0C584,transparent)]"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#F5F1E8] transition-[color,transform] duration-300 group-hover/row:translate-x-1.5 group-hover/row:text-[#FFF7E3] md:text-2xl">
                  {destination.title}
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-[#CFC8BC]">
                  {destination.description}
                </p>
                <a
                  href={destination.href}
                  target={destination.external ? "_blank" : undefined}
                  rel={destination.external ? "noopener noreferrer" : undefined}
                  className="group/link inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-[#E0C584] transition-colors duration-300 hover:text-[#FFF1C7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF1C7]"
                >
                  {destination.label}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover/link:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </CinematicReveal>
            ))}
            <div className="h-px bg-[linear-gradient(90deg,#F4E8CB,rgba(216,194,139,0.42)_48%,rgba(216,194,139,0.08))]" />
          </div>
        ) : (
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
            <div
              className={`${cinematicStyles.interactivePanel} bg-page p-6 md:p-7`}
            >
              <h3 className="text-lg font-bold">事業を知る</h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                WEBマーケティング、スクール、LINE構築など、INFLUの事業内容をご覧いただけます。
              </p>
              <a
                href={routes.service}
                className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-gold-300 transition-colors duration-200 hover:text-foreground"
              >
                事業内容を見る
              </a>
            </div>

            <div
              className={`${cinematicStyles.interactivePanel} bg-page p-6 md:p-7`}
            >
              <h3 className="text-lg font-bold">一緒に働く</h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                INFLUで一緒に働く仲間を募集しています。ご興味のある方はフォームよりお気軽にご応募ください。
              </p>
              <a
                href={RECRUITMENT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-gold-300 transition-colors duration-200 hover:text-foreground"
              >
                採用に応募する
              </a>
            </div>
          </div>
        )}
      </ContentReveal>
    </Container>
  )

  if (homepage) {
    return (
      <section className="relative overflow-hidden border-t border-[rgba(200,164,93,0.25)] bg-[#0B0B0B]">
        {content}
      </section>
    )
  }

  return <CinematicSection tone="page">{content}</CinematicSection>
}

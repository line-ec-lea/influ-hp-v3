"use client"

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "@company/Motion"
import { useEffect, useRef, useState } from "react"

import Container from "@company/components/container"
import SunlitHeading from "@company/components/home/sunlit-heading"
import SpecularButton from "@company/components/ui/specular-button"
import { routes } from "@company/features/routes"

const serviceLinks = [
  {
    href: routes.aiHomepage,
    cta: "HPのAI化を見る",
  },
  {
    href: routes.axSupport,
    cta: "AX支援を見る",
  },
]

const serviceSequence = [
  "既存サイトの作り直し",
  "更新・記事公開の内製化",
  "問い合わせ導線の改善",
  "AIを活用した運用設計",
  "AIマーケティング支援",
  "業務フロー改善",
  "AIツール導入・活用支援",
]

export default function Services() {
  const sequenceRef = useRef<HTMLDivElement | null>(null)
  const sequenceInView = useInView(sequenceRef, {
    margin: "0px 0px 42% 0px",
  })
  const shouldReduceMotion = useReducedMotion()
  const [activeService, setActiveService] = useState(0)

  useEffect(() => {
    if (!sequenceInView || shouldReduceMotion) return

    const interval = window.setInterval(() => {
      setActiveService((current) => (current + 1) % serviceSequence.length)
    }, 1850)

    return () => window.clearInterval(interval)
  }, [sequenceInView, shouldReduceMotion])

  return (
    <section className="relative overflow-hidden border-t border-[rgba(200,164,93,0.25)] bg-[#15130F]">
      <Container className="relative py-16 md:py-24 lg:py-28">
        <motion.div
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.48fr)] lg:items-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584]">
              OUR SERVICES
            </p>
            <SunlitHeading className="mt-4 text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl lg:text-6xl">
              事業内容
            </SunlitHeading>
          </div>
        </motion.div>

        <motion.div
          ref={sequenceRef}
          className="mt-12 border-y border-[rgba(216,194,139,0.24)] py-8 sm:py-10 md:mt-14 lg:py-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          aria-label={`提供領域: ${serviceSequence.join("、")}`}
        >
          <div
            aria-hidden
            className="grid items-center gap-4 lg:grid-cols-[minmax(14rem,0.46fr)_minmax(0,1fr)] lg:gap-10"
          >
            <div className="flex items-center gap-4">
              <p className="whitespace-nowrap text-[clamp(2.8rem,7vw,6.75rem)] font-bold leading-none tracking-[-0.075em] text-[#F5F1E8]">
                WE DO
              </p>
              <motion.span
                className="h-[clamp(2.6rem,6vw,5.6rem)] w-px shrink-0 bg-[linear-gradient(180deg,transparent,#F4E8CB_18%,#FFFDF7_50%,#D8C28B_82%,transparent)]"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: [0.38, 1, 0.38],
                        boxShadow: [
                          "0 0 3px rgba(244,232,203,0.16)",
                          "0 0 16px rgba(255,253,247,0.7)",
                          "0 0 3px rgba(244,232,203,0.16)",
                        ],
                      }
                }
                transition={{
                  duration: 1.15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="relative flex min-h-[4.25rem] items-center overflow-hidden sm:min-h-[5.2rem] lg:min-h-[6.5rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={serviceSequence[activeService]}
                  className="whitespace-nowrap bg-[linear-gradient(105deg,#FFFDF7_0%,#F4E8CB_55%,#D8C28B_100%)] bg-clip-text text-[clamp(1.15rem,4.2vw,3rem)] font-bold leading-none tracking-[-0.045em] text-transparent"
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: "95%", filter: "blur(9px)" }
                  }
                  animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
                  exit={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 0, y: "-95%", filter: "blur(9px)" }
                  }
                  transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                >
                  {serviceSequence[activeService]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div
            aria-hidden
            className="mt-6 flex items-center gap-2 lg:ml-[calc(31.5%+2.5rem)]"
          >
            {serviceSequence.map((service, index) => (
              <motion.span
                key={service}
                className="h-px bg-[#D8C28B]"
                animate={{
                  opacity: index === activeService ? 1 : 0.24,
                  width: index === activeService ? 34 : 12,
                }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>

          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 15% 0px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {serviceLinks.map((service) => (
              <SpecularButton key={service.cta} href={service.href}>
                {service.cta}
              </SpecularButton>
            ))}
          </motion.div>

          <p className="mt-8 border-l border-[rgba(200,164,93,0.45)] pl-4 text-sm leading-7 text-[#CFC8BC]">
            LINEや既存のマーケティング支援は、企業ごとの課題に応じて補足的にご案内します。
          </p>
        </motion.div>
      </Container>
    </section>
  )
}

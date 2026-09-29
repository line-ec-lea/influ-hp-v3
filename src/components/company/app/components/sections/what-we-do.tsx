"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

import Container from "@company/app/components/container"
import SunlitHeading from "@company/app/components/home/sunlit-heading"

const areas = [
  {
    label: "AI戦略",
    description:
      "事業課題に合わせて、AI活用の優先順位と導入ロードマップを設計します。",
    position: "self-start -rotate-[2deg] sm:ml-2",
  },
  {
    label: "SEO",
    description:
      "検索ニーズと競合状況を整理し、必要な情報へ自然に届くサイト構造と記事設計を整えます。",
    position: "self-end rotate-[1deg] sm:mr-12",
  },
  {
    label: "マーケティング",
    description:
      "届けたい相手と価値を明確にし、発信から問い合わせまで一貫した導線を設計します。",
    position: "self-start -rotate-[1deg] sm:ml-14",
  },
  {
    label: "Webデザイン",
    description:
      "企業らしさと使いやすさを両立し、安心して相談できるWeb体験をかたちにします。",
    position: "self-end rotate-[2deg] sm:mr-4",
  },
  {
    label: "Webサイト改善",
    description:
      "ホームページを集客・信頼形成・問い合わせにつながる導線へ整えます。",
    position: "self-start -rotate-[2deg] sm:ml-8",
  },
  {
    label: "集客",
    description:
      "マーケティング視点で、見込み顧客との接点づくりと改善を支援します。",
    position: "self-end rotate-[1deg] sm:mr-14",
  },
  {
    label: "業務効率化",
    description:
      "日々の業務にAIを組み込み、現場で継続して使える仕組みにします。",
    position: "self-end rotate-[2deg] sm:mr-2",
  },
]

export default function WhatWeDo() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion || isPaused) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % areas.length)
    }, 1150)

    return () => window.clearInterval(interval)
  }, [isPaused, shouldReduceMotion])

  const activeArea = areas[activeIndex]!

  return (
    <section
      id="what-we-do"
      className="relative overflow-hidden border-t border-[rgba(200,164,93,0.25)] bg-[#0B0B0B]"
    >
      <Container className="relative py-16 md:py-24 lg:py-28">
        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584]">
            WHAT WE DO
          </p>
          <SunlitHeading className="mt-4 max-w-5xl text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl lg:text-6xl">
            私たちがやっていること
          </SunlitHeading>
          <p className="mt-6 max-w-3xl text-xl font-semibold leading-relaxed text-[#F5F1E8] sm:text-2xl md:text-3xl">
            難しいAIを、使い続けられる仕組みに。
          </p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#D8D1C5]">
            企業のAI活用を、マーケティングと実装の両面から伴走します。
            ツール選定だけでなく、発信内容、Webサイト、社内運用まで整理し、現場で動き続ける仕組みとして定着させます。
          </p>
        </motion.div>

        <motion.div
          className="relative mt-12 md:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative grid min-h-[34rem] gap-12 py-8 sm:py-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(24rem,1.18fr)] lg:items-center lg:gap-16 lg:py-12">
            <div className="relative z-10">
              <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[#D8C28B]">
                OUR FOCUS / 01—07
              </p>
              <p
                aria-hidden
                className="mt-5 text-[clamp(3.8rem,9vw,8rem)] font-bold leading-[0.82] tracking-[-0.075em] text-[#F5F1E8]"
              >
                AI
                <br />×<br />
                WORK
              </p>

              <div className="mt-10 max-w-xl border-l border-[rgba(216,194,139,0.52)] pl-5">
                <p className="text-xs font-bold tracking-[0.16em] text-[#D8C28B]">
                  {String(activeIndex + 1).padStart(2, "0")} / 07
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeArea.label}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      shouldReduceMotion ? undefined : { opacity: 0, y: -8 }
                    }
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#F8F4EA] sm:text-3xl">
                      {activeArea.label}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#CFC8BC] sm:text-base sm:leading-8">
                      {activeArea.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div
              className="relative z-10 flex min-h-[31rem] flex-col justify-center gap-3 sm:min-h-[35rem] sm:gap-3.5"
              onPointerEnter={() => setIsPaused(true)}
              onPointerLeave={() => setIsPaused(false)}
            >
              {areas.map((area, index) => {
                const active = index === activeIndex

                return (
                  <motion.button
                    key={area.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveIndex(index)}
                    onFocus={() => {
                      setActiveIndex(index)
                      setIsPaused(true)
                    }}
                    onBlur={() => setIsPaused(false)}
                    className={`relative flex min-h-12 max-w-full cursor-pointer items-center gap-3 rounded-full border px-5 py-2.5 text-left text-lg font-bold leading-tight tracking-[-0.03em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#F8F4EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] sm:min-h-14 sm:px-7 sm:text-2xl ${area.position} ${
                      active
                        ? "border-[#FFFDF7] bg-[linear-gradient(110deg,#FFFDF7_0%,#F4E8CB_48%,#DABF83_100%)] text-[#080808] shadow-[0_0_34px_rgba(244,232,203,0.24)]"
                        : "border-[rgba(226,222,214,0.42)] bg-[#090909]/80 text-[#F2EFE8] hover:border-[rgba(248,244,234,0.82)] hover:bg-[#121212] hover:text-white"
                    }`}
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : { scale: active ? 1.035 : 1, y: active ? -2 : 0 }
                    }
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span
                      className={`text-[0.65rem] tracking-[0.15em] ${active ? "text-[#080808]/60" : "text-[#D8C28B]"}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{area.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

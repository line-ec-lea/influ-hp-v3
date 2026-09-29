"use client"

import { motion, useReducedMotion } from "@company/Motion"

import Container from "@company/app/components/container"
import SunlitHeading from "@company/app/components/home/sunlit-heading"

const strengths = [
  {
    title: "AIを現場で扱うエンジニアリング力",
    description:
      "AIを概念ではなく、日々の業務やWeb運用で動く仕組みとして設計・実装します。",
  },
  {
    title: "マーケティング実務の知見",
    description:
      "集客、導線改善、問い合わせ獲得まで、現場の数字に近い視点でAI活用を組み立てます。",
  },
  {
    title: "事業やサイトの詰まりから考える姿勢",
    description:
      "ツール導入から入らず、事業・サイト・運用のどこが詰まっているかを見極めて支援します。",
  },
]

export default function WhyInflu() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden border-t border-[rgba(200,164,93,0.25)] bg-[#0B0B0B]">
      <Container className="relative py-16 md:py-24 lg:py-28">
        <motion.div
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.48fr)] lg:items-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584]">
              WHY INFLU?
            </p>
            <SunlitHeading className="mt-4 text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl lg:text-6xl">
              技術だけでなく、事業と現場を理解する。
            </SunlitHeading>
          </div>
          <p className="text-base leading-8 text-[#D8D1C5]">
            AI、マーケティング、事業課題を切り離さず、現場で使い続けられる形まで落とし込みます。
          </p>
        </motion.div>

        <motion.div
          className="group/list mt-12 md:mt-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.11 } },
          }}
        >
          {strengths.map((strength, index) => (
            <motion.article
              key={strength.title}
              variants={{
                hidden: { opacity: 0, y: 26 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="group/row relative grid gap-x-10 gap-y-5 py-9 transition-opacity duration-500 group-hover/list:opacity-70 hover:!opacity-100 md:grid-cols-[7rem_minmax(0,0.9fr)_minmax(0,1fr)] md:items-start md:py-12"
            >
              <motion.span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left bg-[linear-gradient(90deg,#F4E8CB,rgba(216,194,139,0.42)_48%,rgba(216,194,139,0.08))]"
                variants={{
                  hidden: { scaleX: shouldReduceMotion ? 1 : 0, opacity: 0.35 },
                  show: {
                    scaleX: 1,
                    opacity: 1,
                    transition: {
                      duration: shouldReduceMotion ? 0 : 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
              />

              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-bold tracking-[0.18em] text-[#E0C584]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <motion.span
                  aria-hidden
                  className="h-px flex-1 origin-left bg-[linear-gradient(90deg,#E0C584,transparent)]"
                  variants={{
                    hidden: { scaleX: shouldReduceMotion ? 1 : 0 },
                    show: {
                      scaleX: 1,
                      transition: {
                        duration: shouldReduceMotion ? 0 : 0.65,
                        delay: shouldReduceMotion ? 0 : 0.18,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                />
              </div>

              <h3 className="relative overflow-hidden text-2xl font-bold leading-tight tracking-tight text-[#F5F1E8] md:text-[1.65rem]">
                <span className="relative z-10">{strength.title}</span>
                {!shouldReduceMotion ? (
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-[-35%] left-0 z-20 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,253,247,0.24),transparent)] blur-sm"
                    initial={{ x: "-140%", opacity: 0 }}
                    whileInView={{
                      x: "440%",
                      opacity: [0, 0.9, 0],
                    }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 1.25,
                      delay: 0.32 + index * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                ) : null}
              </h3>
              <p className="relative max-w-2xl text-[0.95rem] leading-8 text-[#DDD6CB] transition-colors duration-300 group-hover/row:text-[#F0EAE0]">
                {strength.description}
              </p>
            </motion.article>
          ))}
          <motion.span
            aria-hidden
            className="block h-px origin-left bg-[linear-gradient(90deg,#F4E8CB,rgba(216,194,139,0.42)_48%,rgba(216,194,139,0.08))]"
            variants={{
              hidden: { scaleX: shouldReduceMotion ? 1 : 0, opacity: 0.35 },
              show: {
                scaleX: 1,
                opacity: 1,
                transition: {
                  duration: shouldReduceMotion ? 0 : 0.8,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          />
        </motion.div>
      </Container>
    </section>
  )
}

"use client"

import { motion, useReducedMotion } from "@company/Motion"

import Container from "@company/app/components/container"
import SunlitHeading from "@company/app/components/home/sunlit-heading"
import SpecularButton from "@company/app/components/ui/specular-button"
import { CONTACT_FORM_HREF } from "@company/features/contact"

const consultations = [
  "企業のAI活用をどこから始めるか整理したい",
  "既存HPが更新できず、運用の足かせになっている",
]

export default function SuitableConsultations() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden border-t border-[rgba(200,164,93,0.25)] bg-[#0B0B0B]">
      <Container className="relative py-16 md:py-24 lg:py-28">
        <motion.div
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.72fr)] lg:items-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584]">
              SUITABLE CONSULTATIONS
            </p>
            <SunlitHeading className="mt-4 text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl lg:text-6xl">
              <span className="block">こんなお悩みから、</span>
              <span className="block">ご相談いただけます。</span>
            </SunlitHeading>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#D8D1C5] lg:justify-self-end">
            何から始めるべきか決まっていない段階でもご相談いただけます。
            現在の課題を伺い、向き不向きも含めて優先順位を整理します。
          </p>
        </motion.div>

        <motion.div
          className="mt-12 md:mt-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {consultations.map((consultation, index) => (
            <motion.article
              key={consultation}
              variants={{
                hidden: { opacity: 0, y: 26 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="group/row relative grid gap-x-10 gap-y-5 py-9 md:grid-cols-[7rem_minmax(0,1fr)] md:items-center md:py-12"
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

              <div className="flex items-center gap-4">
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

              <h3 className="relative w-fit max-w-full overflow-hidden text-2xl font-bold leading-snug tracking-tight text-[#F5F1E8] transition-[color,transform] duration-500 group-hover/row:translate-x-2 group-hover/row:text-[#FFF7E3] md:text-3xl lg:text-[2.55rem]">
                <span className="relative z-10">{consultation}</span>
                {!shouldReduceMotion ? (
                  <span
                    aria-hidden
                    className="absolute inset-y-[-30%] left-0 z-20 w-1/3 -translate-x-[150%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,253,247,0.26),transparent)] opacity-0 blur-sm transition-[transform,opacity] duration-1000 ease-out group-hover/row:translate-x-[430%] group-hover/row:opacity-100"
                  />
                ) : null}
              </h3>
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

        <motion.div
          className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="max-w-xl border-l border-[rgba(224,197,132,0.5)] pl-4 text-sm leading-7 text-[#D8D1C5]">
            相談内容がまとまっていなくても大丈夫です。
          </p>
          <SpecularButton
            href={CONTACT_FORM_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            相談する
          </SpecularButton>
        </motion.div>
      </Container>
    </section>
  )
}

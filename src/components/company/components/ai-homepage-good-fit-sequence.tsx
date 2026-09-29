"use client"

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "@shared/react/Motion"
import { useEffect, useRef, useState } from "react"

type AiHomepageGoodFitSequenceProps = {
  items: string[]
}

export default function AiHomepageGoodFitSequence({
  items,
}: AiHomepageGoodFitSequenceProps) {
  const sequenceRef = useRef<HTMLDivElement | null>(null)
  const sequenceInView = useInView(sequenceRef, {
    margin: "0px 0px 34% 0px",
  })
  const shouldReduceMotion = useReducedMotion()
  const [activeItem, setActiveItem] = useState(0)

  useEffect(() => {
    if (!sequenceInView || shouldReduceMotion || items.length < 2) return

    const interval = window.setInterval(() => {
      setActiveItem((current) => (current + 1) % items.length)
    }, 3200)

    return () => window.clearInterval(interval)
  }, [items.length, sequenceInView, shouldReduceMotion])

  return (
    <div
      ref={sequenceRef}
      className="mt-14 border-y border-[rgba(224,197,132,0.28)] py-9 sm:py-12 lg:mt-20 lg:py-14"
      aria-label={`向いている会社: ${items.join("、")}`}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(14rem,0.42fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <div className="flex items-center gap-3 lg:gap-5">
          <p className="text-xs font-bold tracking-[0.18em] text-[#E0C584] uppercase lg:hidden">
            GOOD FIT
          </p>
          <p className="hidden whitespace-nowrap text-[clamp(2.5rem,6vw,6rem)] font-bold leading-none tracking-[-0.075em] text-[#F5F1E8] lg:block">
            FIT
          </p>
          <motion.span
            aria-hidden
            className="h-px w-10 bg-[linear-gradient(90deg,transparent,#F4E8CB_18%,#FFFDF7_50%,#D8C28B_82%,transparent)] lg:h-[clamp(2.4rem,5.3vw,5rem)] lg:w-px lg:bg-[linear-gradient(180deg,transparent,#F4E8CB_18%,#FFFDF7_50%,#D8C28B_82%,transparent)]"
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

        <div className="relative flex min-h-32 items-center overflow-hidden sm:min-h-28 lg:min-h-36">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={items[activeItem]}
              className="bg-[linear-gradient(105deg,#FFFDF7_0%,#F4E8CB_55%,#D8C28B_100%)] bg-clip-text text-xl font-bold leading-[1.5] tracking-[-0.04em] text-transparent sm:text-2xl sm:leading-[1.45] lg:text-[clamp(1.9rem,3.2vw,3rem)] lg:leading-[1.38] lg:tracking-[-0.05em]"
              initial={
                shouldReduceMotion
                  ? false
                  : { filter: "blur(9px)", opacity: 0, y: "95%" }
              }
              animate={{ filter: "blur(0px)", opacity: 1, y: "0%" }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : { filter: "blur(9px)", opacity: 0, y: "-95%" }
              }
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {items[activeItem]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 sm:mt-6 lg:ml-[calc(29.5%+3rem)] lg:mt-7">
        {items.map((item, index) => (
          <motion.span
            key={item}
            aria-hidden
            className="h-px bg-[#D8C28B]"
            animate={{
              opacity: index === activeItem ? 1 : 0.24,
              width: index === activeItem ? 38 : 13,
            }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
    </div>
  )
}

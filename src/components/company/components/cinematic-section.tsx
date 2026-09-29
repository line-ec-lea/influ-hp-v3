"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "@shared/react/Motion"
import type { ReactNode } from "react"
import { useRef } from "react"

type CinematicSectionProps = {
  children: ReactNode
  className?: string
  id?: string
  tone?: "page" | "section" | "elevated"
}

const toneClass = {
  page: "bg-page",
  section: "bg-section",
  elevated: "bg-elevated",
}

export default function CinematicSection({
  children,
  className = "",
  id,
  tone = "page",
}: CinematicSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const ambientY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [80, -80],
  )

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className={`relative z-30 min-h-[88svh] overflow-hidden border-t border-line ${toneClass[tone]} ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px origin-left bg-[linear-gradient(90deg,transparent,var(--color-gold-300),transparent)] shadow-[0_0_18px_rgb(201_165_109_/_0.28)]"
        initial={shouldReduceMotion ? false : { scaleX: 0 }}
        whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
        viewport={{ amount: 0.08, once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-48 top-1/4 h-96 w-96 rounded-full bg-gold-300/[0.035] blur-3xl"
        style={shouldReduceMotion ? undefined : { y: ambientY }}
      />
      <motion.div
        className="relative z-[2]"
        initial={
          shouldReduceMotion
            ? false
            : {
                clipPath: "inset(0 0 20% 0)",
                filter: "blur(9px)",
                opacity: 0.18,
                scale: 0.988,
                y: 68,
              }
        }
        whileInView={
          shouldReduceMotion
            ? undefined
            : {
                clipPath: "inset(0 0 0% 0)",
                filter: "blur(0px)",
                opacity: 1,
                scale: 1,
                y: 0,
              }
        }
        viewport={{ amount: 0.07, once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[4] w-[22vw] bg-[linear-gradient(90deg,transparent,rgb(201_165_109_/_0.16),transparent)] mix-blend-screen"
        initial={shouldReduceMotion ? false : { x: "-120%", opacity: 0 }}
        whileInView={
          shouldReduceMotion ? undefined : { x: "560%", opacity: [0, 1, 0] }
        }
        viewport={{ amount: 0.07, once: true }}
        transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.section>
  )
}

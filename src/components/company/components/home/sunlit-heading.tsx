"use client"

import { motion, useReducedMotion } from "@company/Motion"
import type { ReactNode } from "react"

type SunlitHeadingProps = {
  as?: "h1" | "h2" | "h3" | "p"
  children: ReactNode
  className?: string
  delay?: number
  id?: string
}

const headingTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
}

export default function SunlitHeading({
  as = "h2",
  children,
  className = "",
  delay = 0,
  id,
}: SunlitHeadingProps) {
  const shouldReduceMotion = useReducedMotion()
  const Heading = headingTags[as]

  return (
    <Heading id={id} className={`relative ${className}`}>
      <span className="relative z-10 block text-[#F5F1E8] [text-shadow:0_1px_18px_rgba(255,241,199,0.08)]">
        {children}
      </span>
      {shouldReduceMotion ? null : (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 block overflow-hidden"
          initial={{ backgroundPosition: "135% 50%", opacity: 0 }}
          whileInView={{
            backgroundPosition: "-85% 50%",
            opacity: [0, 0.92, 0.92, 0],
          }}
          viewport={{ amount: 0.45, once: true }}
          transition={{
            delay,
            duration: 1.25,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.2, 0.78, 1],
          }}
        >
          <span className="absolute inset-y-[-18%] left-[-18%] w-[18%] rotate-6 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.68),rgba(255,241,199,0.48),transparent)] blur-xl" />
        </motion.span>
      )}
    </Heading>
  )
}

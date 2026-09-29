"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type AiHomepageFreefallCardProps = {
  children: ReactNode
  className: string
  delay: number
}

export default function AiHomepageFreefallCard({
  children,
  className,
  delay,
}: AiHomepageFreefallCardProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      viewport={{ amount: 0.2, once: true }}
      transition={{
        delay,
        duration: 0.52,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

"use client"

import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "@company/Motion"
import { Children, isValidElement, type ReactNode, useRef } from "react"

const cinematicEase = [0.22, 1, 0.36, 1] as const

type MotionProviderProps = {
  children: ReactNode
}

export function CinematicMotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: cinematicEase }}>
      {children}
    </MotionConfig>
  )
}

type CinematicPageFrameProps = {
  children: ReactNode
}

export function CinematicPageFrame({ children }: CinematicPageFrameProps) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start start", "end end"],
  })
  const progress = useSpring(scrollYProgress, {
    damping: 28,
    mass: 0.32,
    stiffness: 120,
  })

  return (
    <motion.div
      ref={frameRef}
      className="relative isolate overflow-x-clip bg-page font-sans text-foreground [&_a.inline-flex]:!border-gold-300 [&_a.inline-flex]:!bg-accent [&_a.inline-flex]:!text-page [&_a.inline-flex]:shadow-[0_14px_38px_rgb(176_138_85_/_0.16)] [&_a.inline-flex]:hover:!bg-gold-300 [&_article]:!border-line-gold [&_article]:!bg-surface [&_div.rounded-full]:!border-line-gold [&_div.rounded-full]:!bg-gold-400/10 [&_div.rounded-full]:!text-gold-300 [&_div.rounded-lg]:!border-line-gold [&_div.rounded-lg]:!bg-surface [&_dl>div]:!bg-surface [&_dt]:!text-gold-300 [&_h1]:!text-foreground [&_h2]:!text-foreground [&_h3]:!text-foreground [&_li]:!border-line-gold [&_ol>li]:!bg-surface [&_p]:!text-muted [&_p.font-bold]:!text-foreground [&_p.uppercase]:!text-gold-300 [&_section]:!border-line-gold [&_section]:!bg-page [&_section:nth-of-type(even)]:!bg-section [&_span.font-bold]:!text-gold-300 [&_span.rounded-full]:!border-line-gold [&_span.rounded-full]:!bg-gold-400/10 [&_span.rounded-full]:!text-gold-300 [&_table]:!bg-surface [&_td]:!border-line [&_td]:!text-muted [&_th]:!border-line [&_th]:!bg-elevated [&_th]:!text-gold-300 [&_ul.rounded-lg]:!border-line-gold [&_ul.rounded-lg]:!bg-elevated"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none fixed bottom-0 right-0 top-0 z-[160] w-px origin-top bg-[linear-gradient(180deg,transparent,var(--color-gold-300),transparent)] shadow-[0_0_20px_rgb(201_165_109_/_0.5)] sm:right-2"
        style={shouldReduceMotion ? undefined : { scaleY: progress }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_86%_10%,rgb(201_165_109_/_0.08),transparent_24%),radial-gradient(circle_at_12%_52%,rgb(176_138_85_/_0.05),transparent_28%)]"
      />
      {Children.toArray(children).map((child, index) => {
        const supportsSticky =
          isValidElement<{ "data-cinematic-sticky"?: string }>(child) &&
          child.props["data-cinematic-sticky"] === "true"

        return (
          <motion.div
            key={index}
            className={`relative ${supportsSticky ? "overflow-clip" : "overflow-hidden"}`}
            initial={
              shouldReduceMotion
                ? false
                : {
                    clipPath: "inset(0 0 22% 0)",
                    filter: "blur(10px)",
                    opacity: 0.16,
                    scale: 0.985,
                    y: 76,
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
            viewport={{ amount: 0.08, once: true }}
            transition={{
              delay: index === 0 ? 0.16 : 0,
              duration: 1.05,
              ease: cinematicEase,
            }}
          >
            {child}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-50 w-1/4 bg-[linear-gradient(90deg,transparent,rgb(201_165_109_/_0.2),transparent)] mix-blend-screen"
              initial={shouldReduceMotion ? false : { x: "-120%", opacity: 0 }}
              whileInView={
                shouldReduceMotion
                  ? undefined
                  : { x: "520%", opacity: [0, 1, 0] }
              }
              viewport={{ amount: 0.08, once: true }}
              transition={{ duration: 1.35, ease: cinematicEase }}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

type CinematicRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right"
  once?: boolean
}

const revealOffset = {
  up: { x: 0, y: 42 },
  left: { x: -48, y: 0 },
  right: { x: 48, y: 0 },
}

export function CinematicReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
}: CinematicRevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const offset = revealOffset[direction]

  return (
    <motion.div
      className={className}
      initial={
        shouldReduceMotion
          ? false
          : {
              clipPath: "inset(0 0 34% 0)",
              filter: "blur(8px)",
              opacity: 0,
              x: offset.x,
              y: offset.y,
            }
      }
      whileInView={
        shouldReduceMotion
          ? undefined
          : {
              clipPath: "inset(0 0 0% 0)",
              filter: "blur(0px)",
              opacity: 1,
              x: 0,
              y: 0,
            }
      }
      viewport={{ amount: 0.16, once }}
      transition={{ delay, duration: 0.82, ease: cinematicEase }}
    >
      {children}
    </motion.div>
  )
}

type CinematicImageRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function CinematicImageReveal({
  children,
  className = "",
  delay = 0,
}: CinematicImageRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={`group relative overflow-hidden ${className}`}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ amount: 0.2, once: true }}
    >
      <motion.div
        className="h-full w-full"
        variants={{
          hidden: { clipPath: "inset(0 100% 0 0)", scale: 1.08 },
          visible: { clipPath: "inset(0 0% 0 0)", scale: 1 },
        }}
        transition={{ delay, duration: 1.05, ease: cinematicEase }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(201_165_109_/_0.42),transparent)] mix-blend-screen"
        variants={{
          hidden: { x: "-120%" },
          visible: { x: "420%" },
        }}
        transition={{
          delay: delay + 0.14,
          duration: 1.15,
          ease: cinematicEase,
        }}
      />
    </motion.div>
  )
}

type CinematicCardProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function CinematicCard({
  children,
  className = "",
  delay = 0,
}: CinematicCardProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      viewport={{ amount: 0.16, once: true }}
      transition={{ delay, duration: 0.66, ease: cinematicEase }}
    >
      {children}
    </motion.div>
  )
}

"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "@company/Image"
import { useEffect, useState } from "react"

const MIN_VISIBLE_MS = 4000
const MAX_VISIBLE_MS = 8000
const EXIT_DURATION_MS = 300
const MIN_HOLD_MS = MIN_VISIBLE_MS - EXIT_DURATION_MS
const MAX_HOLD_MS = MAX_VISIBLE_MS - EXIT_DURATION_MS
const LOGO_WIDTH = 340
const LOGO_HEIGHT = 226.7
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

type LogoIntroProps = {
  accent?: string
  caption?: string
  logoSrc?: string
}

export default function LogoIntro({
  accent = "#C89A5B",
  caption = "株式会社INFLU",
  logoSrc = "/influ-logo.svg",
}: LogoIntroProps) {
  const shouldReduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (shouldReduceMotion) {
      setVisible(false)
      return
    }

    let pageLoaded = document.readyState === "complete"
    let minimumElapsed = false
    let exitStarted = false
    let exitTimer: number | undefined

    function handlePageLoad() {
      pageLoaded = true
      beginExit()
    }

    function beginExit() {
      if (exitStarted || !pageLoaded || !minimumElapsed) return

      exitStarted = true
      window.removeEventListener("load", handlePageLoad)
      window.clearTimeout(minimumTimer)
      window.clearTimeout(maximumTimer)

      setExiting(true)
      exitTimer = window.setTimeout(() => {
        setVisible(false)
      }, EXIT_DURATION_MS)
    }

    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true
      beginExit()
    }, MIN_HOLD_MS)

    const maximumTimer = window.setTimeout(() => {
      pageLoaded = true
      minimumElapsed = true
      beginExit()
    }, MAX_HOLD_MS)

    if (!pageLoaded) {
      window.addEventListener("load", handlePageLoad, { once: true })
    }

    return () => {
      window.removeEventListener("load", handlePageLoad)
      if (exitTimer) window.clearTimeout(exitTimer)
      window.clearTimeout(minimumTimer)
      window.clearTimeout(maximumTimer)
    }
  }, [shouldReduceMotion])

  if (!visible || shouldReduceMotion) return null

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[300] grid place-items-center overflow-hidden bg-[#07090A] pointer-events-auto motion-reduce:hidden"
      initial={{ opacity: 1, scale: 1 }}
      animate={exiting ? { opacity: 0, scale: 0.99 } : { opacity: 1, scale: 1 }}
      transition={{
        duration: exiting ? EXIT_DURATION_MS / 1000 : 0,
        ease,
      }}
    >
      <motion.div
        className="relative flex origin-center flex-col items-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease }}
      >
        <div className="relative h-[186px] w-[279px] sm:h-[226.7px] sm:w-[340px]">
          <div
            className="absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.82] sm:scale-100"
            style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
          >
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[420px] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(circle, rgba(200, 154, 91, 0.18) 0%, rgba(200, 154, 91, 0.1) 32%, transparent 60%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 0.3, duration: 1.1, ease }}
            />

            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.22, duration: 0.68, ease }}
            >
              <Image
                src={logoSrc}
                alt=""
                fill
                sizes={`${LOGO_WIDTH}px`}
                className="object-contain"
                unoptimized
              />
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-[130px] h-px w-[420px] -translate-x-1/2 origin-center"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.55, scaleX: 1 }}
              transition={{ delay: 0.08, duration: 0.42, ease }}
            />
          </div>
        </div>

        <motion.p
          className="mt-3 text-center text-[12px] font-semibold uppercase tracking-[0.34em] text-[#F4F7F2]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.42 }}
          transition={{ delay: 1, duration: 0.5, ease }}
        >
          {caption}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

"use client"

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "@company/Motion"
import Image from "@company/Image"
import { useEffect, useRef, useState } from "react"

import SunlitHeading from "@company/app/components/home/sunlit-heading"
import SpecularButton from "@company/app/components/ui/specular-button"
import { CONTACT_FORM_HREF } from "@company/features/contact"
import { routes } from "@company/features/routes"

const images = ["/p1.jpg", "/p2.jpg", "/p3.jpg"]
const introDurationSeconds = 4.05
const cinematicEase = [0.22, 1, 0.36, 1] as const

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: cinematicEase },
  },
}

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const heroRef = useRef<HTMLElement | null>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    const interval = window.setInterval(() => {
      setCurrent((previous) => (previous + 1) % images.length)
    }, 7200)

    return () => window.clearInterval(interval)
  }, [shouldReduceMotion])

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const photoY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -32],
  )
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.55],
    shouldReduceMotion ? [0, 0] : [0, -38],
  )
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.52],
    shouldReduceMotion ? [1, 1] : [1, 0.18],
  )
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0.76, 0.9])

  const entryDelay = shouldReduceMotion ? 0 : introDurationSeconds

  const scrollToNext = () => {
    document.getElementById("what-we-do")?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    })
  }

  return (
    <section
      ref={heroRef}
      className="relative isolate min-h-svh w-full overflow-hidden bg-[#0B0B0B] text-[#F5F1E8]"
      aria-labelledby="homepage-heading"
    >
      <motion.div
        className="absolute -inset-y-8 inset-x-0"
        style={{ y: photoY }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={images[current]}
            className="absolute inset-0"
            initial={
              current === 0 || shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 1.15,
              ease: cinematicEase,
            }}
          >
            <motion.div
              className="absolute inset-0"
              initial={shouldReduceMotion ? false : { scale: 1.04 }}
              animate={shouldReduceMotion ? undefined : { scale: 1 }}
              transition={{
                delay: current === 0 ? entryDelay : 0,
                duration: current === 0 ? 0.9 : 7.2,
                ease: current === 0 ? cinematicEase : "linear",
              }}
            >
              <Image
                src={images[current]!}
                alt=""
                fill
                sizes="100vw"
                priority={current === 0}
                className="object-cover object-center opacity-70 saturate-[0.68] contrast-[1.08] sm:object-[center_48%]"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.99)_0%,rgba(11,11,11,0.94)_44%,rgba(11,11,11,0.56)_76%,rgba(11,11,11,0.74)_100%)] sm:bg-[linear-gradient(90deg,rgba(11,11,11,0.99)_0%,rgba(11,11,11,0.92)_46%,rgba(11,11,11,0.42)_80%,rgba(11,11,11,0.62)_100%)]"
        style={{ opacity: overlayOpacity }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_42%,rgba(200,164,93,0.17),transparent_30%),linear-gradient(180deg,rgba(11,11,11,0.22),transparent_28%,rgba(11,11,11,0.76))]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_180_180%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.78%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%22.55%22/%3E%3C/svg%3E')]"
      />

      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-[clamp(1.25rem,4vw,4rem)] z-[2] w-px origin-top bg-[linear-gradient(180deg,transparent,rgba(224,197,132,0.72)_28%,rgba(200,164,93,0.2)_76%,transparent)]"
        initial={shouldReduceMotion ? false : { scaleY: 0, opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { scaleY: 1, opacity: 1 }}
        transition={{
          delay: entryDelay + 0.1,
          duration: 0.8,
          ease: cinematicEase,
        }}
      />

      <motion.div
        className="relative z-10 flex min-h-svh items-center pb-28 pt-32 md:pb-24 md:pt-36"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          className="mx-auto w-full max-w-[100rem] px-5 sm:px-8 lg:px-12"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: entryDelay,
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <div className="mx-auto text-center">
            <motion.div
              className="flex items-center justify-center gap-3"
              variants={revealVariants}
            >
              <span className="h-px w-10 bg-[#C8A45D]" aria-hidden />
              <p className="text-[0.6875rem] font-bold tracking-[0.2em] text-[#E0C584] sm:text-xs">
                AX &amp; MARKETING PARTNER
              </p>
            </motion.div>

            <SunlitHeading
              as="h1"
              id="homepage-heading"
              delay={entryDelay + 0.12}
              className="mt-6 text-[clamp(1.7rem,8.2vw,3.6rem)] font-bold leading-[1.14] tracking-[-0.045em] text-[#F5F1E8] sm:text-[clamp(2.75rem,6.5vw,4.25rem)] lg:text-[clamp(2.5rem,3.35vw,4rem)] lg:leading-[1.08]"
            >
              <span className="inline-block pb-[0.08em]">
                AIホームページ制作と
              </span>
              <span className="inline-block pb-[0.08em]">AX支援を、</span>
              <span className="inline-block pb-[0.08em]">
                現場に合うかたちへ。
              </span>
            </SunlitHeading>

            <motion.p
              className="mx-auto mt-7 max-w-[50rem] text-base font-medium leading-8 text-[#D8D1C5] sm:text-lg md:mt-8 md:text-xl md:leading-9"
              variants={revealVariants}
            >
              大阪を拠点に、AIホームページ制作・業務効率化支援
              <br className="hidden sm:block" />
              ・AI活用の導入整理まで、現場で使い続けられる形で伴走します。
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap"
              variants={revealVariants}
            >
              <SpecularButton
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                相談する
              </SpecularButton>
              <SpecularButton href={routes.service}>
                事業内容を見る
              </SpecularButton>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-7 right-5 z-20 flex items-center gap-1 sm:bottom-8 sm:right-8 lg:right-12"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{
          delay: entryDelay + 0.7,
          duration: 0.55,
          ease: cinematicEase,
        }}
        aria-label="ヒーロー画像を選択"
        role="group"
      >
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setCurrent(index)}
            className="group inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584]"
            aria-label={`ヒーロー画像 ${index + 1}`}
            aria-pressed={current === index}
          >
            <span
              className={`h-px transition-[width,background-color] duration-300 ${
                current === index
                  ? "w-8 bg-[#E0C584]"
                  : "w-4 bg-[#B8B1A3] group-hover:w-6 group-hover:bg-[#F5F1E8]"
              }`}
            />
          </button>
        ))}
      </motion.div>

      <motion.button
        type="button"
        onClick={scrollToNext}
        className="absolute bottom-7 left-1/2 z-20 hidden min-h-11 -translate-x-1/2 cursor-pointer items-center gap-3 rounded-lg px-3 text-[0.625rem] font-bold tracking-[0.2em] text-[#B8B1A3] transition-colors duration-200 hover:text-[#E0C584] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584] md:flex"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
        transition={{
          delay: entryDelay + 0.8,
          duration: 0.5,
          ease: cinematicEase,
        }}
      >
        <span>SCROLL</span>
        <span className="h-px w-8 bg-current" aria-hidden />
      </motion.button>
    </section>
  )
}

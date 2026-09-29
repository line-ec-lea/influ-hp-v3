"use client"

import { motion, useReducedMotion } from "@shared/react/Motion"

const inputs = [
  {
    label: "発信",
    x: 70,
    y: 78,
    path: "M 83 94 H 315 Q 380 94 408 142 L 486 215",
  },
  {
    label: "集客",
    x: 38,
    y: 166,
    path: "M 51 182 H 328 Q 392 182 426 215 L 474 244",
  },
  { label: "サイト運用", x: 92, y: 254, path: "M 105 270 H 448" },
  {
    label: "社内業務",
    x: 46,
    y: 342,
    path: "M 59 358 H 328 Q 392 358 426 325 L 474 296",
  },
  {
    label: "継続改善",
    x: 78,
    y: 430,
    path: "M 91 446 H 315 Q 380 446 408 398 L 486 325",
  },
]

const outputs = [
  {
    number: "01",
    eyebrow: "OWNED OPERATION",
    label: "自社で動かす",
    y: 174,
    path: "M 714 236 H 794 Q 836 236 856 210 L 888 174 H 1124",
  },
  {
    number: "02",
    eyebrow: "CONTINUOUS GROWTH",
    label: "改善を続ける",
    y: 366,
    path: "M 714 304 H 794 Q 836 304 856 330 L 888 366 H 1124",
  },
]

const ease = [0.22, 1, 0.36, 1] as const

function SignalPath({
  d,
  delay,
  reduceMotion,
}: {
  d: string
  delay: number
  reduceMotion: boolean | null
}) {
  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        stroke="#E0C584"
        strokeOpacity="0.42"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ amount: 0.5, once: true }}
        transition={{ delay, duration: 1.15, ease }}
      />
      {!reduceMotion && (
        <motion.path
          d={d}
          fill="none"
          stroke="url(#signal-gold)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 72"
          filter="url(#signal-glow)"
          initial={{ opacity: 0, strokeDashoffset: 74 }}
          whileInView={{ opacity: [0, 1, 1, 0.65], strokeDashoffset: -222 }}
          viewport={{ amount: 0.5, once: false }}
          transition={{
            delay: delay + 0.65,
            duration: 3.8,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1.2,
          }}
        />
      )}
    </g>
  )
}

export default function BusinessSystemFlow() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="relative mt-12 overflow-hidden bg-[#080807] md:mt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(224,197,132,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(224,197,132,0.055)_1px,transparent_1px)] [background-size:4.75rem_4.75rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_88%)]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,241,199,0.12),rgba(224,197,132,0.035)_38%,transparent_70%)] blur-2xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.35, 0.72, 0.35], scale: [0.92, 1.08, 0.92] }
        }
        transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="relative hidden md:block">
        <svg
          role="img"
          aria-labelledby="business-flow-title business-flow-description"
          viewBox="0 0 1200 540"
          className="h-auto w-full"
        >
          <title id="business-flow-title">INFLUが伴走する事業改善</title>
          <desc id="business-flow-description">
            発信、集客、サイト運用、社内業務、継続改善の課題をINFLUが整理し、自社で動かしながら改善を続けられる状態へつなげます。
          </desc>

          <defs>
            <filter
              id="signal-glow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="signal-gold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8A6935" stopOpacity="0" />
              <stop offset="0.48" stopColor="#E0C584" />
              <stop offset="0.58" stopColor="#FFF8E6" />
              <stop offset="1" stopColor="#E0C584" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="core-fill" cx="50%" cy="38%" r="72%">
              <stop offset="0" stopColor="#292317" />
              <stop offset="0.52" stopColor="#17140E" />
              <stop offset="1" stopColor="#0C0B08" />
            </radialGradient>
          </defs>

          {inputs.map((input, index) => (
            <motion.g
              key={input.label}
              initial={shouldReduceMotion ? false : { opacity: 0, x: -18 }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, x: 0 }
              }
              viewport={{ amount: 0.45, once: true }}
              transition={{ delay: 0.08 + index * 0.1, duration: 0.65, ease }}
            >
              <circle cx={input.x} cy={input.y + 16} r="3" fill="#FFF1C7" />
              <circle
                cx={input.x}
                cy={input.y + 16}
                r="9"
                fill="none"
                stroke="#E0C584"
                strokeOpacity="0.34"
              />
              <text
                x={input.x + 22}
                y={input.y + 21}
                fill="#F5F1E8"
                fontSize="15"
                fontWeight="700"
                letterSpacing="0.04em"
              >
                {input.label}
              </text>
              <SignalPath
                d={input.path}
                delay={0.24 + index * 0.11}
                reduceMotion={shouldReduceMotion}
              />
            </motion.g>
          ))}

          <motion.g
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.86 }}
            whileInView={
              shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }
            }
            viewport={{ amount: 0.55, once: true }}
            transition={{ delay: 0.78, duration: 0.9, ease }}
            style={{ transformOrigin: "600px 270px" }}
          >
            <motion.path
              d="M 528 164 L 672 164 L 744 270 L 672 376 L 528 376 L 456 270 Z"
              fill="none"
              stroke="#E0C584"
              strokeOpacity="0.24"
              strokeWidth="1"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { opacity: [0.25, 0.58, 0.25], scale: [0.96, 1.035, 0.96] }
              }
              transition={{
                duration: 5.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{ transformOrigin: "600px 270px" }}
            />
            <path
              d="M 540 182 L 660 182 L 720 270 L 660 358 L 540 358 L 480 270 Z"
              fill="url(#core-fill)"
              stroke="#E0C584"
              strokeWidth="2"
              filter="url(#signal-glow)"
            />
            <circle
              cx="600"
              cy="270"
              r="58"
              fill="none"
              stroke="#E0C584"
              strokeOpacity="0.16"
            />
            <circle
              cx="600"
              cy="270"
              r="46"
              fill="none"
              stroke="#FFF1C7"
              strokeOpacity="0.1"
              strokeDasharray="3 8"
            />
            <text
              x="600"
              y="260"
              textAnchor="middle"
              fill="#F5F1E8"
              fontSize="25"
              fontWeight="800"
              letterSpacing="0.1em"
            >
              INFLU
            </text>
            <text
              x="600"
              y="292"
              textAnchor="middle"
              fill="#E0C584"
              fontSize="12"
              fontWeight="700"
              letterSpacing="0.16em"
            >
              伴走設計
            </text>
          </motion.g>

          {outputs.map((output, index) => (
            <motion.g
              key={output.number}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, x: 0 }
              }
              viewport={{ amount: 0.5, once: true }}
              transition={{ delay: 1.28 + index * 0.14, duration: 0.7, ease }}
            >
              <SignalPath
                d={output.path}
                delay={1.05 + index * 0.16}
                reduceMotion={shouldReduceMotion}
              />
              <circle cx="918" cy={output.y} r="3" fill="#FFF1C7" />
              <circle
                cx="918"
                cy={output.y}
                r="10"
                fill="none"
                stroke="#E0C584"
                strokeOpacity="0.34"
              />
              <text
                x="942"
                y={output.y - 10}
                fill="#E0C584"
                fontSize="10"
                fontWeight="700"
                letterSpacing="0.08em"
              >
                {output.number} / {output.eyebrow}
              </text>
              <text
                x="942"
                y={output.y + 22}
                fill="#F5F1E8"
                fontSize="23"
                fontWeight="800"
              >
                {output.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>

      <div className="relative px-5 py-12 md:hidden">
        <div className="space-y-3">
          {inputs.map((input, index) => (
            <motion.div
              key={input.label}
              className="flex items-center gap-4"
              initial={shouldReduceMotion ? false : { opacity: 0, x: -16 }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, x: 0 }
              }
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: index * 0.08, duration: 0.55, ease }}
            >
              <span className="h-2 w-2 shrink-0 rounded-full border border-[#FFF1C7] shadow-[0_0_12px_rgba(255,241,199,0.7)]" />
              <p className="text-sm font-bold tracking-[0.04em] text-[#D8D1C5]">
                {input.label}
              </p>
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(224,197,132,0.68),transparent)]" />
            </motion.div>
          ))}
        </div>

        <motion.div
          aria-hidden
          className="mx-auto h-14 w-px bg-[linear-gradient(180deg,#7B6135,#FFF1C7)] shadow-[0_0_14px_rgba(224,197,132,0.55)]"
          initial={shouldReduceMotion ? false : { scaleY: 0 }}
          whileInView={shouldReduceMotion ? undefined : { scaleY: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: 0.42, duration: 0.7, ease }}
          style={{ transformOrigin: "top" }}
        />

        <motion.div
          className="relative mx-auto flex h-36 w-36 rotate-45 items-center justify-center border border-[#E0C584] bg-[radial-gradient(circle_at_35%_25%,#292317,#11100C_70%)] shadow-[0_0_42px_rgba(224,197,132,0.2)]"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.82 }}
          whileInView={
            shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }
          }
          viewport={{ once: true, amount: 0.75 }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  boxShadow: [
                    "0 0 30px rgba(224,197,132,0.12)",
                    "0 0 52px rgba(224,197,132,0.28)",
                    "0 0 30px rgba(224,197,132,0.12)",
                  ],
                }
          }
          transition={{ duration: 4.8, ease: "easeInOut", repeat: Infinity }}
        >
          <div className="-rotate-45 text-center">
            <p className="text-xl font-extrabold tracking-[0.1em] text-[#F5F1E8]">
              INFLU
            </p>
            <p className="mt-2 text-[0.62rem] font-bold tracking-[0.16em] text-[#E0C584]">
              伴走設計
            </p>
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          className="mx-auto h-14 w-px bg-[linear-gradient(180deg,#FFF1C7,#7B6135)] shadow-[0_0_14px_rgba(224,197,132,0.55)]"
          initial={shouldReduceMotion ? false : { scaleY: 0 }}
          whileInView={shouldReduceMotion ? undefined : { scaleY: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: 0.74, duration: 0.7, ease }}
          style={{ transformOrigin: "top" }}
        />

        <div className="space-y-5">
          {outputs.map((output, index) => (
            <motion.div
              key={output.number}
              className="border-l border-[#E0C584] py-2 pl-5"
              initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, x: 0 }
              }
              viewport={{ once: true, amount: 0.7 }}
              transition={{ delay: 0.92 + index * 0.14, duration: 0.6, ease }}
            >
              <p className="text-[0.62rem] font-bold tracking-[0.1em] text-[#E0C584]">
                {output.number} / {output.eyebrow}
              </p>
              <p className="mt-2 text-xl font-bold text-[#F5F1E8]">
                {output.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

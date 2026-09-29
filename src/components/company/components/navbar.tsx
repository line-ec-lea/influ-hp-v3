"use client"

import { AnimatePresence, motion, useReducedMotion } from "@company/Motion"
import Image from "@company/Image"
import { type MouseEvent, useEffect, useState } from "react"

import Container from "@company/components/container"
import { siteNavItems } from "@company/features/navigation"
import { routes } from "@company/features/routes"

const serviceMenuItems = [
  {
    href: routes.aiHomepage,
    label: "HPのAI化",
    description: "ホームページをAI活用前提で運用・改善できる形へ。",
  },
  {
    href: routes.axSupport,
    label: "AX・業務効率化支援",
    description: "AIを業務やマーケティングに接続し、現場で使える仕組みへ。",
  },
  {
    href: "https://lea-market.com/",
    label: "気軽にEC『Lea = レア』",
    description: "LINEと連動したEC・販売支援サービス。",
    external: true,
  },
  {
    href: "https://yakinikudokoro-mirai.com/",
    label: "焼肉処 味来",
    description: "大阪・心斎橋で展開する飲食事業。",
    external: true,
  },
] as const

export default function Navbar({ pathname }: { pathname: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const isHome = pathname === "/"
  const barSolid = scrolled || menuOpen || !isHome

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const onViewport = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener("change", onViewport)
    return () => mq.removeEventListener("change", onViewport)
  }, [])

  useEffect(() => {
    if (!servicesOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [servicesOpen])

  const isActive = (item: { href: string }) => {
    if (item.href.startsWith("http")) return false
    if (item.href === "/") return pathname === "/"
    const base = item.href.split("/page")[0]!
    return (
      pathname === base ||
      pathname === item.href ||
      pathname.startsWith(`${base}/`)
    )
  }

  const isServiceMenuActive = serviceMenuItems.some((item) => isActive(item))

  const navItemClass = (active: boolean) =>
    `relative rounded-sm px-1 py-2 text-[0.8125rem] transition-colors duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-px after:-translate-x-1/2 after:bg-[linear-gradient(90deg,transparent,#E0C584,transparent)] after:transition-[width] after:duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584] ${
      active
        ? "text-[#F5F1E8] after:w-8"
        : "text-[#B8B1A3] after:w-0 hover:text-[#F5F1E8] hover:after:w-5"
    }`

  const onHomeNavClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    })
  }

  return (
    <motion.header
      className="fixed top-0 z-[200] w-full border-b pt-[env(safe-area-inset-top,0px)] backdrop-blur-md"
      initial={false}
      animate={{
        backgroundColor: barSolid
          ? "rgba(21, 19, 15, 0.94)"
          : "rgba(11, 11, 11, 0.2)",
        borderColor: barSolid
          ? "rgba(200, 164, 93, 0.25)"
          : "rgba(200, 164, 93, 0.16)",
        boxShadow: barSolid
          ? "0 14px 44px rgba(0, 0, 0, 0.36)"
          : "0 0 0 rgba(0, 0, 0, 0)",
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Container className="flex h-14 items-center justify-between md:h-16">
        <a
          href="/"
          onClick={onHomeNavClick}
          className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B0B0B]"
        >
          <span className="inline-flex px-0 py-0">
            <Image
              src="/influ-logo.svg"
              alt="株式会社INFLU"
              width={75}
              height={40}
              className="h-6 w-auto translate-y-px drop-shadow-[0_0_10px_rgb(244_242_237_/_0.24)] transition-opacity duration-300 md:h-7"
              priority
              unoptimized
            />
          </span>
        </a>

        <motion.button
          type="button"
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-[rgba(200,164,93,0.35)] text-[#F5F1E8] transition-colors duration-200 hover:border-[#E0C584] hover:bg-[rgba(200,164,93,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584] lg:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
        >
          <span className="sr-only">{menuOpen ? "閉じる" : "メニュー"}</span>
          {menuOpen ? (
            <svg
              className="h-6 w-6 text-[#F5F1E8]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </motion.button>

        <nav className="hidden items-center gap-4 font-bold tracking-normal lg:flex">
          {siteNavItems.map((item) => {
            if (
              item.href === routes.aiHomepage ||
              item.href === routes.axSupport
            ) {
              return null
            }

            const active = isActive(item)
            const serviceActive =
              item.href === routes.service
                ? active || isServiceMenuActive
                : active

            if (item.href === routes.service) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <a
                    href={item.href}
                    className={navItemClass(serviceActive)}
                    aria-current={serviceActive ? "page" : undefined}
                    aria-expanded={servicesOpen}
                    aria-haspopup="menu"
                    onFocus={() => setServicesOpen(true)}
                  >
                    {item.label}
                  </a>

                  <AnimatePresence initial={false}>
                    {servicesOpen && (
                      <motion.div
                        className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-4"
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, y: -8, scale: 0.98 }
                        }
                        animate={
                          shouldReduceMotion
                            ? undefined
                            : { opacity: 1, y: 0, scale: 1 }
                        }
                        exit={
                          shouldReduceMotion
                            ? undefined
                            : { opacity: 0, y: -6, scale: 0.98 }
                        }
                        transition={{
                          duration: 0.18,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        onFocus={() => setServicesOpen(true)}
                        onBlur={(event) => {
                          if (
                            !event.currentTarget.contains(event.relatedTarget)
                          ) {
                            setServicesOpen(false)
                          }
                        }}
                      >
                        <div className="overflow-hidden rounded-md border border-white/10 bg-[#151515]/98 p-2 shadow-[0_20px_48px_rgba(0,0,0,0.42)] backdrop-blur-xl">
                          <div>
                            {serviceMenuItems.map((service) => {
                              const serviceItemActive = isActive(service)
                              return (
                                <a
                                  key={service.href}
                                  href={service.href}
                                  target={
                                    "external" in service ? "_blank" : undefined
                                  }
                                  rel={
                                    "external" in service
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className={`group block rounded-md px-4 py-3 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                                    serviceItemActive
                                      ? "bg-[#202020]"
                                      : "hover:bg-[#1D1D1D]"
                                  }`}
                                  aria-current={
                                    serviceItemActive ? "page" : undefined
                                  }
                                  onClick={() => setServicesOpen(false)}
                                >
                                  <span className="flex items-center justify-between gap-4 text-[0.8125rem] font-normal leading-5 text-[#8A8A8A]">
                                    <span>{service.label}</span>
                                    {"external" in service && (
                                      <span
                                        aria-hidden
                                        className="text-sm text-[#ECECEC] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                      >
                                        ↗
                                      </span>
                                    )}
                                  </span>
                                  <span className="mt-0.5 block text-sm font-normal leading-5 text-[#ECECEC]">
                                    {service.description}
                                  </span>
                                </a>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }

            return (
              <a
                key={item.label}
                href={item.href}
                className={navItemClass(serviceActive)}
                aria-current={serviceActive ? "page" : undefined}
                {...(item.href === routes.home
                  ? { onClick: onHomeNavClick }
                  : {})}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
      </Container>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            className="border-t border-[rgba(200,164,93,0.25)] bg-[#15130F]/95 backdrop-blur-md lg:hidden"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.nav
              className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-[15px] font-bold tracking-normal sm:px-6"
              initial={shouldReduceMotion ? false : "closed"}
              animate={shouldReduceMotion ? undefined : "open"}
              variants={{
                closed: {},
                open: {
                  transition: { delayChildren: 0.08, staggerChildren: 0.035 },
                },
              }}
            >
              {siteNavItems.map((item) => {
                if (
                  item.href === routes.aiHomepage ||
                  item.href === routes.axSupport
                ) {
                  return null
                }

                const active = isActive(item)
                const serviceActive =
                  item.href === routes.service
                    ? active || isServiceMenuActive
                    : active

                return (
                  <motion.div
                    key={item.label}
                    variants={{
                      closed: { opacity: 0, x: -14 },
                      open: { opacity: 1, x: 0 },
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={() => {
                        setMenuOpen(false)
                        if (item.href === routes.home && pathname === "/") {
                          window.scrollTo({
                            top: 0,
                            behavior: shouldReduceMotion ? "auto" : "smooth",
                          })
                        }
                      }}
                      className={`block rounded-lg px-3 py-2.5 transition-colors duration-200 ${
                        serviceActive
                          ? "border border-[rgba(200,164,93,0.35)] bg-[rgba(200,164,93,0.1)] text-[#F5F1E8]"
                          : "text-[#B8B1A3] hover:bg-[rgba(200,164,93,0.1)] hover:text-[#F5F1E8]"
                      }`}
                      aria-current={serviceActive ? "page" : undefined}
                    >
                      {item.label}
                    </a>
                    {item.href === routes.service && (
                      <div className="mt-1 space-y-1 border-l border-[rgba(200,164,93,0.22)] pl-3">
                        {serviceMenuItems.map((service) => {
                          const serviceItemActive = isActive(service)
                          return (
                            <a
                              key={service.href}
                              href={service.href}
                              target={
                                "external" in service ? "_blank" : undefined
                              }
                              rel={
                                "external" in service
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              onClick={() => setMenuOpen(false)}
                              className={`flex items-center justify-between gap-4 rounded-md px-3 py-2 text-sm transition-colors duration-200 ${
                                serviceItemActive
                                  ? "bg-[rgba(200,164,93,0.13)] text-[#F5F1E8]"
                                  : "text-[#B8B1A3] hover:bg-[rgba(200,164,93,0.1)] hover:text-[#F5F1E8]"
                              }`}
                              aria-current={
                                serviceItemActive ? "page" : undefined
                              }
                            >
                              <span>{service.label}</span>
                              {"external" in service && (
                                <span aria-hidden className="text-[#ECECEC]">
                                  ↗
                                </span>
                              )}
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

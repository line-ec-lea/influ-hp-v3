export const cinematicStyles = {
  pageShell:
    "relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--color-page),var(--color-section)_42%,var(--color-page))] text-foreground [&>section]:relative [&>section]:z-30 [&>.mx-auto]:relative [&>.mx-auto]:z-30",
  sectionInner: "relative py-20 md:py-28 lg:py-32",
  eyebrow: "text-xs font-bold tracking-normal text-gold-300",
  heading:
    "text-4xl font-semibold leading-tight tracking-normal text-foreground md:text-5xl lg:text-6xl",
  metallicText:
    "bg-[linear-gradient(112deg,#f4f2ed_0%,#f7ecd2_36%,#c9a56d_64%,#b08a55_100%)] bg-clip-text text-transparent",
  card: "relative overflow-hidden rounded-lg border border-line bg-surface shadow-[0_22px_70px_rgb(0_0_0_/_0.26)] transition duration-200 hover:-translate-y-0.5 hover:border-line-gold hover:bg-soft hover:shadow-[0_26px_80px_rgb(0_0_0_/_0.32)]",
  featuredCard:
    "border-line-gold bg-[linear-gradient(145deg,rgb(255_255_255_/_0.07),rgb(176_138_85_/_0.09)_44%,rgb(255_255_255_/_0.035))]",
  panel: "rounded-lg border border-line bg-white/5",
  frame:
    "rounded-lg border border-line bg-[linear-gradient(180deg,rgb(255_255_255_/_0.04),transparent_68%)] bg-elevated shadow-[0_24px_80px_rgb(0_0_0_/_0.35)]",
  mediaFrame: "rounded-lg shadow-[0_24px_90px_rgb(0_0_0_/_0.32)]",
  number:
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line-gold bg-gold-400/10 text-xs font-bold text-gold-300",
  detailChip:
    "rounded-lg border border-white/10 bg-black/20 text-foreground/80",
  categoryChip:
    "rounded-lg border border-line-gold bg-page/60 text-gold-300 backdrop-blur-sm",
  primaryButton:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-gold-300/80 bg-accent px-5 py-3.5 font-bold leading-none text-[#0b0907] shadow-[0_14px_34px_rgb(176_138_85_/_0.2)] transition duration-200 hover:-translate-y-px hover:bg-gold-300",
  secondaryButton:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line-gold bg-gold-400/10 px-5 py-3.5 font-bold leading-none text-foreground transition duration-200 hover:-translate-y-px hover:border-gold-300/60 hover:bg-gold-400/15",
  arrow: "h-[1em] w-[1em] shrink-0 stroke-current stroke-[1.8]",
  interactivePanel:
    "relative overflow-hidden rounded-lg border border-line bg-[linear-gradient(180deg,rgb(255_255_255_/_0.026),transparent_70%)] bg-[#0a0b0b]/90 shadow-[0_18px_70px_rgb(0_0_0_/_0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-line-gold hover:bg-surface",
} as const

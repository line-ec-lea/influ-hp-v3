import { cinematicStyles } from "@company/components/cinematic-styles"
import Breadcrumb from "@company/components/cms/breadcrumb"
import Container from "@company/components/container"
import { CinematicReveal } from "@company/components/motion/cinematic-reveal"
import type { BreadcrumbItem } from "@company/features/seo"

type PageHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  breadcrumbItems: BreadcrumbItem[]
  titleId?: string
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbItems,
  titleId,
}: PageHeaderProps) {
  return (
    <Container className="relative z-30 border-b border-line pb-10 pt-24 after:absolute after:bottom-[-1px] after:right-12 after:h-px after:w-[min(36vw,28rem)] after:bg-[linear-gradient(90deg,transparent,var(--color-line-gold))] md:pb-12 md:pt-28">
      <Breadcrumb className="mb-0" items={breadcrumbItems} />
      <div className="mt-10 max-w-5xl">
        <CinematicReveal>
          <p className={cinematicStyles.eyebrow}>{eyebrow}</p>
          <h1
            id={titleId}
            className="mt-3 max-w-4xl text-balance text-4xl font-semibold leading-[1.2] tracking-normal text-foreground md:text-6xl"
          >
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {description}
            </p>
          )}
        </CinematicReveal>
      </div>
    </Container>
  )
}

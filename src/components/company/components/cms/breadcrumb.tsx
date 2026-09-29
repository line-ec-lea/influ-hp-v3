import { Fragment } from "react"

import JsonLd from "@company/components/json-ld"
import { type BreadcrumbItem, breadcrumbJsonLd } from "@shared/features/seo"

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({
  items,
  className = "mb-4",
}: BreadcrumbProps) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="パンくずリスト" className={className}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-subtle sm:gap-2.5">
          {items.map((item, index) => (
            <Fragment key={`${item.href ?? "current"}-${item.name}`}>
              {index > 0 && (
                <li
                  role="presentation"
                  aria-hidden="true"
                  className="inline-flex items-center text-subtle"
                >
                  &gt;
                </li>
              )}
              <li className="inline-flex items-center gap-1.5">
                {item.href ? (
                  <a
                    href={item.href}
                    className="font-semibold text-muted transition-colors duration-200 hover:text-gold-300"
                  >
                    {item.name}
                  </a>
                ) : (
                  <span
                    aria-current="page"
                    className="line-clamp-1 max-w-60 font-normal text-foreground sm:max-w-md"
                  >
                    {item.name}
                  </span>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>
    </>
  )
}

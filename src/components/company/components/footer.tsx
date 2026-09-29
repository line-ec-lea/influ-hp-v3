import Image from "@company/Image"

import Container from "@company/components/container"
import { siteNavItems } from "@company/features/navigation"
import { routes } from "@company/features/routes"
import { SITE_NAME } from "@company/features/seo"

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(200,164,93,0.25)] bg-[#0B0B0B] text-[#F5F1E8]">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <a
              href={routes.home}
              className="inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B0B0B]"
            >
              <Image
                src="/influ-logo.svg"
                alt={SITE_NAME}
                width={120}
                height={64}
                className="h-8 w-auto drop-shadow-[0_0_10px_rgba(245,241,232,0.2)]"
                unoptimized
              />
            </a>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#B8B1A3]">
              株式会社INFLUは、企業のAI活用・AXをマーケティング実務とセットで伴走する会社です。
            </p>
          </div>

          <nav aria-label="フッターナビゲーション">
            <h2 className="text-sm font-bold text-[#F5F1E8]">サイトマップ</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {siteNavItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[#B8B1A3] transition-colors duration-200 hover:text-[#E0C584] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold text-[#F5F1E8]">会社情報</h2>
            <address className="mt-4 space-y-3 text-sm not-italic leading-7 text-[#B8B1A3]">
              <p>{SITE_NAME}</p>
              <a
                href={`${routes.company}#a02`}
                className="block transition-colors duration-200 hover:text-[#E0C584] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584]"
              >
                〒550-0013
                <br />
                大阪府大阪市西区新町1丁目8-3
                <br />
                林四ツ橋ビル9階901号室
              </a>
              <p>
                電話番号:{" "}
                <a
                  href="tel:06-7222-2971"
                  className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-[#E0C584] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584]"
                >
                  06-7222-2971
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[rgba(200,164,93,0.25)] pt-6 text-xs text-[#B8B1A3] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright&copy; {SITE_NAME}, 2019-{new Date().getFullYear()} All
            Rights Reserved
          </p>
          <a
            href={routes.privacyPolicy}
            className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-[#E0C584] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584]"
          >
            プライバシーポリシー
          </a>
        </div>
      </Container>
    </footer>
  )
}

import Site from "@company/Site"
import { cinematicStyles } from "@company/components/cinematic-styles"
import Container from "@company/components/container"
import ContactBlock from "@company/components/sections/contact"
import SpecularButton from "@company/components/ui/specular-button"

function NotFound() {
  return (
    <>
      <div className={cinematicStyles.pageShell}>
        <Container className="py-32 text-center md:py-40">
          <p className={cinematicStyles.eyebrow}>404</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
            ページが見つかりません
          </h1>
          <p className="mt-4 text-muted">
            お探しのページは移動または削除された可能性があります。
          </p>
          <SpecularButton href="/" className="mt-8">
            ホームへ戻る
          </SpecularButton>
        </Container>
      </div>
      <ContactBlock variant="dark" />
    </>
  )
}

export default function Page() {
  return <Site pathname="/404"><NotFound /></Site>
}

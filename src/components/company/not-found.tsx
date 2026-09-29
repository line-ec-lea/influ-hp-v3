import MotionProvider from "@shared/react/MotionProvider"
import { cinematicStyles } from "@shared/react/cinematic-styles"
import Container from "@shared/react/container"
import ContactBlock from "@company/components/sections/contact"
import SpecularButton from "@shared/react/ui/specular-button"

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
  return <MotionProvider><NotFound /></MotionProvider>
}

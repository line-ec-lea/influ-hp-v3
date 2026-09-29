import MotionProvider from "@shared/react/MotionProvider"
import Image from "@shared/react/Image"
import type { ReactNode } from "react"

import AsanohaHeroPattern from "@shared/react/asanoha-hero-pattern"
import Container from "@shared/react/container"
import SunlitHeading from "@shared/react/home/sunlit-heading"
import {
  CinematicPageFrame,
  CinematicReveal,
} from "@shared/react/motion/cinematic-reveal"
import SpecularButton from "@shared/react/ui/specular-button"
const companyPhilosophy = {
  mission: {
    label: "ミッション",
    headline:
      "「誰もがクリエイティブなアイディアや商品やサービスをカンタンに届ける世界を創る」",
    body: "誰でも、自分の新しいアイディアや商品、サービスをカンタンに届けることができる世界を目指します。",
  },
  vision: {
    label: "ビジョン",
    headline: "モノ、ジバ、ヒトが集まり成長するコミュニティ",
    tagline: "とにかく試そう、とにかく語ろう！",
  },
  coreValues: {
    label: "コアバリュー",
    items: [
      "とにかく、試す。納得いくまで",
      "とにかく、語ってみる。自分が腹落ちするまで",
      "とにかく、出来るように。自然と当たり前に。",
      "できないことをできるようになろう！",
      "過去の成功や常識にとらわれず、いつも新しいアイディアや視点を",
      "成長と上達のために学び、教える。",
    ],
  },
} as const

import { CONTACT_FORM_HREF } from "@shared/features/contact"
import { routes } from "@shared/features/routes"

export const metadata = {
  title: "会社概要",
  description:
    "株式会社INFLUの会社概要、代表取締役 水戸亮太の経歴、企業理念、企業情報、アクセスをご案内します。",
  alternates: { canonical: "/company-profile" },
}

const IMG = "/influhp-assets/wp-content/themes/top/images"

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d820.2805272925191!2d135.49623626966167!3d34.676867498308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e7002a23f2c5%3A0x13e94ff84667def1!2z5qCq5byP5Lya56S-SU5GTFU!5e0!3m2!1sen!2sjp!4v1781254963100!5m2!1sja!2sjp"
const routeSlides: { file: string; caption: string }[] = [
  {
    file: "route01.png",
    caption:
      "①・②番出口方向の四ツ橋駅改札を出て、左前方にある②番出口の階段へ上がります。",
  },
  { file: "route02.png", caption: "②番出口の階段を上がってください。" },
  { file: "route03.png", caption: "②番出口を出ましたら左に曲がります。" },
  {
    file: "route04.png",
    caption: "四ツ橋筋と長堀通りの交差点を左に曲がります。",
  },
  { file: "route05.png", caption: "四ツ橋筋を直進してください。" },
  {
    file: "route06.png",
    caption: "直進すると信号があるので渡って進んでください。",
  },
  {
    file: "route07.png",
    caption: "さらに直進すると「林四ツ橋ビル」の看板が見えてきます。",
  },
  {
    file: "route08.png",
    caption:
      "「林四ツ橋ビル」の9階に弊社の事務所があるので、ビルに入ってください。",
  },
  {
    file: "route09.png",
    caption: "ビルの奥にエレベータがあるので9階まで上がってください。",
  },
  { file: "route10.png", caption: "901号室が弊社事務所となります。" },
]

const companyRows: { label: string; value: ReactNode }[] = [
  { label: "会社名", value: "株式会社INFLU" },
  { label: "代表者", value: "水戸　亮太" },
  { label: "設立", value: "2019年12月" },
  { label: "資本金", value: "5,550,000円" },
  {
    label: "住所",
    value: (
      <>
        〒550-0013
        <br />
        大阪府大阪市西区新町１丁目8-3
        <br />
        林四ツ橋ビル9階901号室
      </>
    ),
  },
  {
    label: "事業内容",
    value: (
      <ul className="grid gap-2 text-left text-[#CFC8BC]">
        <li>HPのAI化</li>
        <li>AX・業務効率化支援</li>
        <li>
          WEBマーケティング事業、アウトソーシング事業、コンテンツ作成事業、
        </li>
        <li>WEBエンジニアの育成及びWEBシステムの開発と運営、</li>
        <li>WEBエンジニア育成スクールの運営、</li>
        <li>データサイエンスからの経営改善アドバイス事業</li>
        <li>
          <a
            href="https://lea-market.com/"
            className="font-semibold text-[#FFF1C7] underline decoration-[#E0C584]/45 underline-offset-4 transition-colors hover:text-[#FFFDF7]"
            target="_blank"
            rel="noopener noreferrer"
          >
            LINE連動ECサービス Lea
          </a>
        </li>
        <li>
          <a
            href="https://yakinikudokoro-mirai.com/"
            className="font-semibold text-[#FFF1C7] underline decoration-[#E0C584]/45 underline-offset-4 transition-colors hover:text-[#FFFDF7]"
            target="_blank"
            rel="noopener noreferrer"
          >
            飲食事業 焼肉処 味来
          </a>
        </li>
      </ul>
    ),
  },
  {
    label: "情報セキュリティ方針",
    value: (
      <a
        href="https://influ-inc.notion.site/info-sec-policy"
        className="font-semibold text-[#FFF1C7] underline decoration-[#E0C584]/45 underline-offset-4 transition-colors hover:text-[#FFFDF7]"
        target="_blank"
        rel="noopener noreferrer"
      >
        詳細についてはこちら
      </a>
    ),
  },
]

const careerItems = [
  {
    period: "1989",
    title: "商いを身近に感じながら育つ",
    description:
      "大阪府に生まれ、事業を営む家族や親族の姿を見ながら、商いと人とのつながりに触れて育つ。高校時代にはホームページ制作も経験する。",
  },
  {
    period: "2012",
    title: "飲食店の現場で、商売の本質を学ぶ",
    description:
      "大学中退後、親戚が営む韓国料理店で修業し、大阪で店舗経営に挑戦。商品だけでなく、接客や集客、日々の改善が事業を支えることを学ぶ。",
  },
  {
    period: "2015",
    title: "WEBを通じた事業支援へ",
    description:
      "個人での情報発信を起点に、メールマガジン運用、販売導線の設計、システム制作・販売へと領域を広げ、事業者の売上づくりを支援する。",
  },
  {
    period: "NEXT",
    title: "顧客と長くつながる仕組みをつくる",
    description:
      "公式LINEを活用した集客・販売・運用支援を通じて、一度きりではなく、顧客との関係が続く仕組みづくりに取り組む。",
  },
  {
    period: "2019",
    title: "株式会社INFLUを設立",
    description:
      "飲食店経営とWEBマーケティングで培った経験をもとに、事業者の挑戦と成長を支える株式会社INFLUを12月に設立する。",
  },
  {
    period: "NOW",
    title: "AIと人が、ともに働ける現場へ",
    description:
      "Lea、オンラインスクール、焼肉処 味来で得た実践知を生かし、HPのAI化とAX・業務効率化支援を展開。企業が自ら運用し、改善を続けられる仕組みをつくる。",
  },
]

const experienceStrengths = [
  {
    number: "01",
    title: "事業を運営した現場経験",
    description:
      "飲食店を自ら立ち上げ、運営し、撤退まで経験したからこそ、限られた予算や人員の中で挑戦する難しさを理解しています。",
  },
  {
    number: "02",
    title: "マーケティングの実務",
    description:
      "メール、公式LINE、SNS、販売シナリオ、コンテンツを横断し、顧客へ価値を届ける仕組みを実務で磨いてきました。",
  },
  {
    number: "03",
    title: "技術と成果をつなぐ視点",
    description:
      "ホームページやシステムを作るだけで終わらせず、更新、計測、改善まで含めて事業で使い続けられる状態を設計します。",
  },
  {
    number: "04",
    title: "自社で試し、改善する姿勢",
    description:
      "自社サービスや実店舗でも施策を試し、失敗を振り返り、同じ過ちを繰り返さない形で次の改善へつなげます。",
  },
]

const supportPrinciples = [
  {
    title: "小さく始めて、確かめながら進める",
    description:
      "最初から大きな仕組みをつくらず、優先度の高い課題から着手し、現場の反応を見ながら育てます。",
  },
  {
    title: "導入ではなく、使い続けられる状態をつくる",
    description:
      "新しい技術を入れること自体を目的にせず、日々の業務に無理なく定着するところまで支援します。",
  },
  {
    title: "自社で動かし、改善できる力を残す",
    description:
      "外部へ任せ続ける状態から、必要な更新や改善を自社で判断し、進められる状態へつなげます。",
  },
  {
    title: "事業の背景を理解し、長く伴走する",
    description:
      "目の前の施策だけで判断せず、事業の成り立ちや想い、これから目指す姿を共有して支援します。",
  },
]

const relatedBusinesses = [
  {
    label: "ものづくり",
    title: "気軽にEC『Lea = レア』",
    description:
      "いい商品やサービスを持つ事業者と顧客を、LINE連動ECでつなぐ事業です。",
    image: "/images/businesses/lea-line-ec.png",
    imageAlt: "Leaの管理画面とLINE上の商品画面",
    href: "https://lea-market.com/",
  },
  {
    label: "人づくり",
    title: "オンラインスクール",
    description:
      "SNS運用からコンテンツ作成・販売まで、実務で活用するマーケティングの考え方を伝えます。",
    image: "/images/influhp/school_image.jpg",
    imageAlt: "オンラインスクールの講座を受講している様子",
  },
  {
    label: "地場づくり",
    title: "焼肉処 味来",
    description:
      "心斎橋に根ざす飲食事業であり、実店舗でマーケティング施策を試す実践の場でもあります。",
    image: "/images/businesses/mirai-yakiniku.jpg",
    imageAlt: "焼肉処 味来で提供する黒毛和牛を焼いている様子",
    href: "https://yakinikudokoro-mirai.com/",
  },
]

const mediaCoverage = [
  {
    publisher: "Focus On",
    title:
      "試しつづける者が、商いをつくる ― 実践から生まれたマーケティングと生き方",
    href: "https://focuson.life/article/view/289",
    image:
      "https://s3-ap-northeast-1.amazonaws.com/stg-focuson-api-assets-d7c/article%2Fcontent%2F2026%2F01%2F1768378946138-inf_1.jpg",
    imageAlt:
      "Focus Onに掲載された株式会社INFLU代表 水戸亮太のインタビュー写真",
    detailImage:
      "https://s3-ap-northeast-1.amazonaws.com/stg-focuson-api-assets-d7c/article%2Fcontent%2F2026%2F01%2F1768379143273-inf_01.jpg",
    detailImageAlt: "Focus Onの記事内に掲載されたINFLUの写真",
    issue: "FEATURE / 01",
  },
  {
    publisher: "社長の履歴書",
    title: "株式会社INFLU代表 水戸 亮太氏",
    href: "https://donzoko-ceo.com/influhp/",
    image:
      "https://donzoko-ceo.com/wp-content/uploads/2024/08/IMG_5855-2-1-scaled-e1722496639667.jpg",
    imageAlt: "社長の履歴書に掲載された株式会社INFLU代表 水戸亮太の写真",
    issue: "INTERVIEW / 02",
  },
]

const accessLines = [
  "Osaka Metro 四ツ橋線「四ツ橋」駅　2番出口 徒歩3分",
  "Osaka Metro 鶴見緑地線「西大橋」駅　2番出口 徒歩6分",
]

function CompanyProfilePage() {
  return (
    <CinematicPageFrame>
      <section className="relative isolate overflow-hidden border-b border-[rgba(200,164,93,0.25)] bg-[#090909] pt-14">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_38%,rgba(255,241,199,0.09),transparent_25%),linear-gradient(180deg,transparent_58%,rgba(200,164,93,0.04))]"
          aria-hidden
        />
        <AsanohaHeroPattern className="opacity-25" />
        <Container className="relative flex min-h-[calc(min(48rem,100svh)-3.5rem)] items-center py-24 sm:py-28 lg:py-32">
          <CinematicReveal direction="left" className="max-w-4xl">
            <p className="text-xs font-bold tracking-[0.18em] text-[#E0C584] uppercase">
              COMPANY
            </p>
            <SunlitHeading
              as="h1"
              delay={0.12}
              className="mt-6 text-balance text-5xl font-bold leading-[1.12] tracking-[-0.055em] sm:text-6xl lg:text-8xl"
            >
              会社概要
            </SunlitHeading>
            <p className="mt-8 max-w-3xl text-xl font-bold leading-9 tracking-normal text-[#F5F1E8] sm:mt-10 sm:text-2xl sm:leading-10">
              技術とマーケティングを、現場で使い続けられる仕組みへ。
            </p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#CFC8BC] sm:text-lg">
              INFLUは、AI活用・AXとマーケティングをつなぎ、企業が自ら運用・改善できる状態を目指して伴走する支援会社です。
            </p>
            <div className="mt-9">
              <SpecularButton
                href={CONTACT_FORM_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                INFLUに相談する
              </SpecularButton>
            </div>
          </CinematicReveal>
        </Container>
      </section>

      <section className="bg-[#0B0B0B]" aria-labelledby="direction-title">
        <Container className="py-16 md:py-24 lg:py-28">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,0.72fr)] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D8B66B]">
                CURRENT DIRECTION
              </p>
              <h2
                id="direction-title"
                className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] text-[#F7F3EA] sm:text-5xl lg:text-6xl"
              >
                現在の支援領域
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
              これまでのWEBマーケティングと事業運営の経験を、現在はHPのAI化と企業のAX支援へつなげています。
            </p>
          </div>

          <div
            role="list"
            className="mt-12 border-t border-[rgba(216,182,107,0.32)] md:mt-16"
          >
            <div
              role="listitem"
              className="group relative grid gap-6 border-b border-[rgba(216,182,107,0.24)] py-9 sm:py-11 lg:grid-cols-[5.5rem_minmax(15rem,0.82fr)_minmax(22rem,1.18fr)] lg:items-start lg:gap-10"
            >
              <span className="text-5xl font-bold leading-none tracking-[-0.07em] text-[#D8B66B]/45 transition-colors duration-300 group-hover:text-[#D8B66B] sm:text-6xl">
                01
              </span>
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#D8B66B]">
                  AI-READY HOMEPAGE
                </p>
                <h3 className="mt-4 text-2xl font-bold tracking-[-0.035em] text-[#F7F3EA] sm:text-3xl">
                  HPのAI化
                </h3>
              </div>
              <div>
                <p className="max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
                  既存ホームページの制作・保守・更新・改善を、AI活用前提で自社主導に変える支援です。
                </p>
                <div className="mt-7">
                  <SpecularButton href={routes.aiHomepage}>
                    HPのAI化を見る
                  </SpecularButton>
                </div>
              </div>
            </div>

            <div
              role="listitem"
              className="group relative grid gap-6 border-b border-[rgba(216,182,107,0.24)] py-9 sm:py-11 lg:grid-cols-[5.5rem_minmax(15rem,0.82fr)_minmax(22rem,1.18fr)] lg:items-start lg:gap-10"
            >
              <span className="text-5xl font-bold leading-none tracking-[-0.07em] text-[#D8B66B]/45 transition-colors duration-300 group-hover:text-[#D8B66B] sm:text-6xl">
                02
              </span>
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#D8B66B]">
                  AX SUPPORT
                </p>
                <h3 className="mt-4 text-2xl font-bold tracking-[-0.035em] text-[#F7F3EA] sm:text-3xl">
                  AX・業務効率化支援
                </h3>
              </div>
              <div>
                <p className="max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
                  AIを話題やツール導入で終わらせず、企業の業務とマーケティングの実務へ接続します。
                </p>
                <div className="mt-7">
                  <SpecularButton href={routes.axSupport}>
                    AX・業務効率化支援を見る
                  </SpecularButton>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section
        id="a01"
        className="scroll-mt-24 bg-[#090909] md:scroll-mt-28"
        aria-labelledby="greeting-title"
      >
        <Container className="py-16 md:py-24 lg:py-28">
          <div className="max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D8B66B]">
              MESSAGE
            </p>
            <h2
              id="greeting-title"
              className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] text-[#F7F3EA] sm:text-5xl lg:text-6xl"
            >
              挑戦を、続けられる仕組みに。
            </h2>
          </div>

          <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(27rem,0.94fr)_minmax(0,1.06fr)] lg:gap-16 xl:grid-cols-[minmax(31rem,0.98fr)_minmax(0,1.02fr)] xl:gap-20">
            <figure className="relative -mx-5 overflow-hidden border-y border-[rgba(216,182,107,0.32)] shadow-[0_30px_80px_rgba(0,0,0,0.34)] sm:-mx-8 lg:sticky lg:top-24 lg:-ml-12 lg:mr-0 lg:border-y-0 lg:border-r xl:-ml-20">
              <div className="relative aspect-[3/2] [container-type:inline-size]">
                <Image
                  src="/images/company-profile/gochan-message.jpeg"
                  alt="株式会社INFLU 代表取締役 水戸亮太"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  unoptimized
                  priority
                />
                <figcaption className="absolute inset-0">
                  <p className="absolute inset-x-6 top-6 text-[0.64rem] font-bold uppercase tracking-[0.2em] text-[#715321] sm:inset-x-8 sm:top-8">
                    INFLU / REPRESENTATIVE DIRECTOR
                  </p>

                  <div className="absolute inset-x-[5.5%] bottom-[8%] font-bold tracking-[-0.065em] drop-shadow-[0_3px_18px_rgba(0,0,0,0.42)]">
                    <div className="relative w-full overflow-visible">
                      <div className="relative h-[clamp(2rem,10.5cqi,4.05rem)] whitespace-nowrap text-[clamp(2rem,10.5cqi,4.05rem)] leading-[0.88] text-[#FFFDF7]">
                        <span className="absolute bottom-0 left-0">HEY,</span>
                        <span className="absolute bottom-0 left-[68%] sm:left-[69%] lg:left-[68%] xl:left-[69%]">
                          I&apos;M
                        </span>
                      </div>
                      <div className="mt-[2cqi] w-full whitespace-nowrap text-[clamp(3rem,18cqi,7.15rem)] leading-[0.78] text-[#FFFDF7]">
                        GOCHAN
                      </div>
                    </div>
                  </div>
                </figcaption>
              </div>
            </figure>

            <div>
              <p className="border-l border-[rgba(216,182,107,0.55)] pl-5 text-xl font-bold leading-9 tracking-[-0.025em] text-[#F7F3EA] sm:pl-7 sm:text-2xl sm:leading-10">
                これまで、お客様の商品やサービスを必要な人へ届けるために、何をすべきかを常に考えてきました。お客様の事業が成長することが、私たちの喜びでもあります。
              </p>

              <div className="mt-9 space-y-6 text-sm leading-8 text-[#CFC8BC] sm:text-base">
                <p>
                  飲食店の経営、WEBでの情報発信、メールや公式LINEを使った販売支援、システムづくり。異なるように見える経験のすべてに共通していたのは、現場で試し、数字や反応を確認し、次の改善へつなげることでした。
                </p>
                <p>
                  個人時代から一貫して、個人や小さな組織が挑戦し、成長できるよう全面的に支えることを目指してきました。これまで掲げてきた「ノーコードで起業する」という考えを、現在はAIを使いながら自社で運用・改善できる仕組みづくりへ発展させています。
                </p>
                <p>
                  目先の施策だけではなく、事業の背景や成長の段階を理解し、長期的な視点で一緒に考える組織でありたいと思っています。事業の成長が、その先の社会価値につながるよう支援を続けてまいります。
                </p>
              </div>

              <figure className="mt-10 border-t border-[rgba(216,182,107,0.28)] pt-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <Image
                    src={`${IMG}/name.png`}
                    alt="代表者 水戸 亮太（署名）"
                    width={208}
                    height={30}
                    unoptimized
                    className="h-auto w-auto max-w-[min(72%,208px)] brightness-0 invert"
                  />
                </div>
              </figure>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#090909]" aria-labelledby="career-title">
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(28rem,1.2fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                CAREER
              </p>
              <h2
                id="career-title"
                className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
              >
                歩んできた道
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
              現場で商いを学び、試し、改善を重ねてきた経験が、現在のINFLUの支援につながっています。
            </p>
          </CinematicReveal>

          <ol className="mt-14 border-t border-[rgba(224,197,132,0.34)] md:mt-16">
            {careerItems.map((item, index) => (
              <li
                key={`${item.period}-${item.title}`}
                className="relative border-b border-[rgba(224,197,132,0.2)] px-5 py-9 sm:px-8 sm:py-11 lg:px-12 lg:py-14"
              >
                <CinematicReveal
                  delay={Math.min(index * 0.04, 0.16)}
                  className="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-12 lg:grid-cols-[13rem_minmax(0,1fr)]"
                >
                  <div className="flex items-baseline gap-4 md:block">
                    <span className="text-[0.65rem] font-bold tracking-[0.18em] text-[#E0C584]/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-3xl font-bold tracking-[-0.04em] text-[#E0C584] sm:text-4xl md:mt-4 lg:text-5xl">
                      {item.period}
                    </p>
                  </div>
                  <div className="md:pt-1">
                    <h3 className="text-xl font-bold leading-8 tracking-[-0.02em] text-[#F5F1E8] sm:text-2xl lg:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-3xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </CinematicReveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#090909]"
        aria-labelledby="experience-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                EXPERIENCE
              </p>
              <h2
                id="experience-title"
                className="mt-4 max-w-2xl text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
              >
                実務経験が、
                <br />
                支援の違いになる。
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
              INFLUの支援を支えているのは、経営、集客、制作、運用を自ら経験してきた実践知です。机上の提案ではなく、現場で使い続けられる形へつなげます。
            </p>
          </CinematicReveal>

          <div className="mt-16 grid gap-x-14 gap-y-14 md:grid-cols-2 lg:mt-24 lg:gap-x-24 lg:gap-y-20">
            {experienceStrengths.map((strength, index) => (
              <CinematicReveal
                key={strength.number}
                delay={index * 0.06}
                className="group grid min-h-52 grid-cols-[5rem_minmax(0,1fr)] gap-5 sm:min-h-56 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-7"
              >
                <div className="pt-1">
                  <span className="block text-[0.6rem] font-bold tracking-[0.16em] text-[#E0C584]/75">
                    実践経験
                  </span>
                  <span className="mt-2 block text-6xl font-bold leading-none tracking-[-0.07em] text-[#E0C584] sm:text-7xl">
                    {strength.number}
                  </span>
                </div>
                <div className="border-l border-[rgba(224,197,132,0.24)] pl-5 sm:pl-7">
                  <h3 className="max-w-lg text-xl font-bold leading-8 tracking-[-0.025em] text-[#F5F1E8] sm:text-2xl sm:leading-9">
                    {strength.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
                    {strength.description}
                  </p>
                </div>
              </CinematicReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#15130F]" aria-labelledby="support-policy-title">
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
              SUPPORT POLICY
            </p>
            <h2
              id="support-policy-title"
              className="mt-4 text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
            >
              支援の先に、自走を。
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
              私たちが目指すのは、支援がなくても改善を続けられる状態です。現場と一緒に考え、試し、運用できる力を企業の中に残します。
            </p>
          </CinematicReveal>

          <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
            <ol className="order-2 grid gap-10 sm:grid-cols-2 lg:order-1 lg:grid-cols-1 lg:gap-20">
              {supportPrinciples.slice(0, 2).map((principle, index) => (
                <li key={principle.title} className="lg:text-right">
                  <CinematicReveal delay={index * 0.05} className="group">
                    <span className="text-xs font-bold tracking-[0.18em] text-[#E0C584]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-xl font-bold leading-8 tracking-[-0.02em] text-[#F5F1E8] sm:text-2xl sm:leading-9">
                      {principle.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#CFC8BC] sm:leading-8">
                      {principle.description}
                    </p>
                  </CinematicReveal>
                </li>
              ))}
            </ol>

            <CinematicReveal
              delay={0.08}
              className="order-1 flex min-h-72 items-center justify-center lg:order-2 lg:min-h-[30rem]"
            >
              <div className="relative isolate w-full text-center">
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(224,197,132,0.14),rgba(224,197,132,0.035)_42%,transparent_70%)] blur-xl"
                />
                <p className="text-xs font-bold tracking-[0.22em] text-[#E0C584]/70 uppercase">
                  INFLU SUPPORT
                </p>
                <div className="mt-7 flex items-center justify-center gap-4 sm:gap-6 lg:flex-col lg:gap-3">
                  <span className="text-4xl font-bold tracking-[-0.05em] text-[#F5F1E8] sm:text-5xl">
                    伴走
                  </span>
                  <span
                    aria-hidden
                    className="text-4xl font-light text-[#E0C584] lg:rotate-90"
                  >
                    →
                  </span>
                  <span className="text-5xl font-bold tracking-[-0.05em] text-[#FFF1C7] sm:text-6xl lg:text-7xl">
                    自走
                  </span>
                </div>
                <p className="mx-auto mt-8 max-w-60 text-sm leading-7 text-[#CFC8BC]">
                  一緒につくる支援から、
                  <br />
                  自社で育てる力へ。
                </p>
              </div>
            </CinematicReveal>

            <ol
              start={3}
              className="order-3 grid gap-10 sm:grid-cols-2 lg:grid-cols-1 lg:gap-20"
            >
              {supportPrinciples.slice(2).map((principle, index) => (
                <li key={principle.title}>
                  <CinematicReveal delay={(index + 2) * 0.05} className="group">
                    <span className="text-xs font-bold tracking-[0.18em] text-[#E0C584]">
                      {String(index + 3).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-xl font-bold leading-8 tracking-[-0.02em] text-[#F5F1E8] sm:text-2xl sm:leading-9">
                      {principle.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#CFC8BC] sm:leading-8">
                      {principle.description}
                    </p>
                  </CinematicReveal>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#090909]"
        aria-labelledby="related-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                RELATED BUSINESSES
              </p>
              <h2
                id="related-title"
                className="mt-4 max-w-2xl text-4xl font-bold leading-[1.18] tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
              >
                事業の外にも、
                <br />
                実践の場がある。
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
              商品を届けること、人を育てること、地域で事業を続けること。INFLUは異なる現場で実践を重ね、その学びをお客様の支援へ還元しています。
            </p>
          </CinematicReveal>

          <ol className="mt-16 grid gap-12 md:mt-20 lg:mt-24 lg:grid-cols-3 lg:gap-0">
            {relatedBusinesses.map((business, index) => (
              <li
                key={business.title}
                className="relative lg:min-h-[29rem] lg:px-9 lg:first:pl-0 lg:last:pr-0 [&:not(:last-child)]:lg:border-r [&:not(:last-child)]:lg:border-[rgba(224,197,132,0.2)]"
              >
                <CinematicReveal
                  delay={index * 0.08}
                  className={`flex h-full flex-col ${index === 1 ? "lg:pt-16" : index === 2 ? "lg:pt-32" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold leading-none tracking-[-0.08em] text-[#E0C584]/45 sm:text-6xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="h-px flex-1 bg-[linear-gradient(90deg,rgba(224,197,132,0.5),transparent)]"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-9 text-xs font-bold tracking-[0.16em] text-[#E0C584]">
                    {business.label}
                  </p>
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden border-y border-[rgba(224,197,132,0.28)] bg-[#15130F]">
                    <Image
                      src={business.image}
                      alt={business.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover brightness-[0.72] saturate-[0.78] transition duration-700 group-hover:scale-[1.035] group-hover:brightness-[0.88]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.04),rgba(9,9,9,0.36))]"
                    />
                  </div>
                  <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#F5F1E8] sm:text-4xl">
                    {business.title}
                  </h3>
                  <p className="mt-5 max-w-sm text-sm leading-8 text-[#CFC8BC] sm:text-base">
                    {business.description}
                  </p>
                  {business.href ? (
                    <a
                      href={business.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link mt-10 inline-flex w-fit items-center gap-3 border-b border-[#E0C584]/70 pb-3 text-sm font-bold text-[#FFF1C7] transition-colors hover:border-[#FFF1C7] hover:text-[#FFFDF7]"
                    >
                      公式サイトを見る
                      <span
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                        aria-hidden
                      >
                        →
                      </span>
                    </a>
                  ) : (
                    <p className="mt-10 w-fit border-b border-[#E0C584]/35 pb-3 text-sm font-bold text-[#E0C584]/65">
                      詳細は準備中です
                    </p>
                  )}
                </CinematicReveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#15130F]"
        aria-labelledby="media-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal className="max-w-4xl">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                MEDIA
              </p>
              <h2
                id="media-title"
                className="mt-4 text-4xl font-bold tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
              >
                INFLUを語る、
                <br />
                ふたつのインタビュー。
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
              私たちの取り組みと、その背景にある考え方を、外部メディアでご紹介いただきました。
            </p>
          </CinematicReveal>

          <div className="mt-16 lg:mt-20">
            {mediaCoverage.map((item, index) => (
              <CinematicReveal
                key={item.href}
                delay={index * 0.1}
                className={index === 1 ? "mt-14 lg:mt-20" : ""}
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group grid overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C584] focus-visible:ring-offset-4 focus-visible:ring-offset-[#15130F] ${index === 0 ? "lg:grid-cols-[minmax(0,1.24fr)_minmax(25rem,0.76fr)]" : "lg:grid-cols-[minmax(21rem,0.65fr)_minmax(0,1.35fr)]"}`}
                >
                  <div
                    className={`relative min-h-80 overflow-hidden bg-[#090909] ${index === 1 ? "lg:order-2" : ""}`}
                  >
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="h-full w-full object-cover brightness-[0.76] saturate-[0.8] transition duration-700 group-hover:scale-[1.035] group-hover:brightness-[0.94]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.06)_28%,rgba(9,9,9,0.68)_100%)]"
                    />
                    <p className="absolute left-5 top-5 text-[0.65rem] font-bold tracking-[0.18em] text-[#FFF1C7] sm:left-7 sm:top-7">
                      {item.issue}
                    </p>
                  </div>
                  <div
                    className={`relative flex min-h-80 flex-col justify-end bg-[#201D16] p-7 sm:p-10 lg:p-12 ${index === 1 ? "lg:order-1" : ""}`}
                  >
                    {index === 0 && item.detailImage ? (
                      <div className="absolute right-7 top-7 h-20 w-28 overflow-hidden border border-[#E0C584]/35 sm:right-10 sm:top-10 sm:h-28 sm:w-40">
                        <img
                          src={item.detailImage}
                          alt={item.detailImageAlt}
                          className="h-full w-full object-cover brightness-[0.75] saturate-[0.78]"
                        />
                      </div>
                    ) : null}
                    <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584]">
                      {item.publisher}
                    </p>
                    <h3 className="mt-5 text-2xl font-bold leading-9 tracking-[-0.035em] text-[#F5F1E8] transition-colors group-hover:text-[#FFF1C7] sm:text-3xl sm:leading-10">
                      {item.title}
                    </h3>
                    <p className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-[#FFF1C7]">
                      記事を読む
                      <span
                        className="text-xl transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden
                      >
                        →
                      </span>
                    </p>
                  </div>
                </a>
              </CinematicReveal>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="philosophy"
        className="scroll-mt-24 overflow-hidden bg-[#090909] md:scroll-mt-28"
        aria-labelledby="philosophy-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal className="flex flex-col items-center text-center">
            <div className="max-w-3xl">
              <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                PHILOSOPHY
              </p>
              <h2
                id="philosophy-title"
                className="mt-4 text-4xl font-bold leading-tight tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
              >
                つくる。届ける。育てる。
              </h2>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
              INFLUは、挑戦する人のアイデアを形にし、必要な人へ届け、その先で続いていく力を育てます。
            </p>
          </CinematicReveal>

          <div className="mt-16 grid gap-14 sm:grid-cols-3 sm:gap-0 lg:mt-24">
            <CinematicReveal className="relative px-1 sm:px-7 sm:first:pl-0 sm:last:pr-0 [&:not(:last-child)]:sm:border-r [&:not(:last-child)]:sm:border-[rgba(224,197,132,0.2)]">
              <article>
                <p className="text-[clamp(3.5rem,8vw,6.5rem)] font-bold leading-none tracking-[-0.08em] text-[#E0C584]">
                  つくる
                </p>
                <p className="mt-7 text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                  {companyPhilosophy.mission.label}
                </p>
                <h3 className="mt-4 text-xl font-bold leading-8 tracking-[-0.03em] text-[#F5F1E8] sm:text-2xl sm:leading-9">
                  {companyPhilosophy.mission.headline}
                </h3>
                <p className="mt-5 text-sm leading-8 text-[#CFC8BC]">
                  {companyPhilosophy.mission.body}
                </p>
              </article>
            </CinematicReveal>

            <CinematicReveal
              delay={0.08}
              className="relative px-1 sm:px-7 [&:not(:last-child)]:sm:border-r [&:not(:last-child)]:sm:border-[rgba(224,197,132,0.2)]"
            >
              <article>
                <p className="text-[clamp(3.5rem,8vw,6.5rem)] font-bold leading-none tracking-[-0.08em] text-[#F5F1E8]">
                  届ける
                </p>
                <p className="mt-7 text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                  {companyPhilosophy.vision.label}
                </p>
                <h3 className="mt-4 text-xl font-bold leading-8 tracking-[-0.03em] text-[#F5F1E8] sm:text-2xl sm:leading-9">
                  モノ、ジバ、ヒトを、
                  <br />
                  つなげる。
                </h3>
                <p className="mt-5 text-sm leading-8 text-[#CFC8BC]">
                  {companyPhilosophy.vision.headline}
                </p>
              </article>
            </CinematicReveal>

            <CinematicReveal
              delay={0.16}
              className="relative px-1 sm:px-7 sm:last:pr-0"
            >
              <article>
                <p className="text-[clamp(3.5rem,8vw,6.5rem)] font-bold leading-none tracking-[-0.08em] text-[#FFF1C7]">
                  育てる
                </p>
                <p className="mt-7 text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                  {companyPhilosophy.coreValues.label}
                </p>
                <h3 className="mt-4 text-xl font-bold leading-8 tracking-[-0.03em] text-[#F5F1E8] sm:text-2xl sm:leading-9">
                  試し、語り、
                  <br />
                  学び続ける。
                </h3>
                <ul className="mt-5 space-y-2 text-sm leading-7 text-[#CFC8BC]">
                  {companyPhilosophy.coreValues.items.map((value) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              </article>
            </CinematicReveal>
          </div>

          <CinematicReveal delay={0.2} className="mt-14 text-center lg:mt-20">
            <p className="text-lg font-bold tracking-[-0.02em] text-[#FFF1C7] sm:text-2xl">
              {companyPhilosophy.vision.tagline}
            </p>
          </CinematicReveal>
        </Container>
      </section>

      <section className="bg-[#090909]" aria-labelledby="corp-title">
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                CORPORATE INFORMATION
              </p>
              <h2
                id="corp-title"
                className="mt-4 text-4xl font-bold leading-tight tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
              >
                企業情報
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
              株式会社INFLUの基本情報と事業内容をご案内します。
            </p>
          </CinematicReveal>

          <dl className="mt-14 border-t border-[rgba(224,197,132,0.3)] md:mt-20">
            {companyRows.map((row, index) => (
              <CinematicReveal
                key={row.label}
                delay={Math.min(index * 0.035, 0.18)}
              >
                <div className="grid gap-4 border-b border-[rgba(224,197,132,0.18)] py-7 sm:py-8 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-10">
                  <dt className="text-xs font-bold tracking-[0.16em] text-[#E0C584]">
                    {row.label}
                  </dt>
                  <dd className="text-sm leading-8 text-[#CFC8BC] sm:text-base">
                    {row.value}
                  </dd>
                </div>
              </CinematicReveal>
            ))}
          </dl>
        </Container>
      </section>

      <section
        id="a02"
        className="scroll-mt-24 bg-[#15130F] md:scroll-mt-28"
        aria-labelledby="access-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                ACCESS
              </p>
              <h2
                id="access-title"
                className="mt-4 text-4xl font-bold leading-tight tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
              >
                INFLUのオフィス
              </h2>
            </div>
          </CinematicReveal>

          <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(16rem,0.48fr)_minmax(0,1.52fr)] lg:gap-14">
            <CinematicReveal className="flex flex-col justify-between py-2">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                  OFFICE
                </p>
                <address className="mt-5 not-italic text-lg font-bold leading-8 tracking-[-0.02em] text-[#F5F1E8] sm:text-2xl sm:leading-10">
                  〒550-0013
                  <br />
                  大阪府大阪市西区新町1丁目8-3
                  <br />
                  林四ツ橋ビル9階901号室
                </address>
              </div>
              <ul className="mt-10 space-y-4 border-t border-[rgba(224,197,132,0.24)] pt-6">
                {accessLines.map((line) => (
                  <li
                    key={line}
                    className="flex gap-4 text-sm font-bold leading-7 text-[#CFC8BC] sm:text-base"
                  >
                    <span
                      className="mt-3 h-px w-7 shrink-0 bg-[#E0C584]"
                      aria-hidden
                    />
                    {line}
                  </li>
                ))}
              </ul>
              <a
                href="https://www.google.com/maps/search/?api=1&query=%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BEINFLU"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex w-fit items-center gap-3 border-b border-[#E0C584]/70 pb-3 text-sm font-bold text-[#FFF1C7] transition-colors hover:border-[#FFF1C7] hover:text-[#FFFDF7]"
              >
                Google Mapsで開く
                <span
                  className="text-xl transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  ↗
                </span>
              </a>
            </CinematicReveal>

            <div className="grid gap-6 sm:grid-cols-2">
              <CinematicReveal
                delay={0.08}
                className="relative aspect-[4/5] overflow-hidden border-y border-[rgba(224,197,132,0.3)] bg-[#090909]"
              >
                <Image
                  src={`${IMG}/access01.png`}
                  alt="株式会社INFLUが入る林四ツ橋ビルの案内"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                  quality={95}
                />
              </CinematicReveal>
              <CinematicReveal
                delay={0.14}
                className="relative aspect-[4/5] overflow-hidden border-y border-[rgba(224,197,132,0.3)]"
              >
                <iframe
                  title="株式会社INFLU 地図"
                  src={MAP_EMBED_SRC}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allowFullScreen
                />
              </CinematicReveal>
            </div>
          </div>

          <details className="group mt-16 border-y border-[rgba(224,197,132,0.25)] lg:mt-24">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-left outline-none transition-colors hover:text-[#FFF1C7] focus-visible:ring-2 focus-visible:ring-[#E0C584] focus-visible:ring-inset sm:py-8">
              <span>
                <span className="block text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                  ROUTE GUIDE
                </span>
                <span className="mt-2 block text-xl font-bold tracking-[-0.02em] text-[#F5F1E8] sm:text-2xl">
                  四ツ橋駅からの来社ルートを見る
                </span>
              </span>
              <span
                className="text-3xl font-light text-[#E0C584] transition-transform duration-300 group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <div className="pb-10 sm:pb-14">
              <p className="max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
                四ツ橋駅から徒歩でお越しの場合の目印です。必要な方のみ、順番にご確認ください。
              </p>
              <ol className="mt-8 grid gap-7 md:grid-cols-2 lg:mt-10 lg:grid-cols-3">
                {routeSlides.map((step, index) => (
                  <li key={step.file} className="group/route">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#090909]">
                      <Image
                        src={`${IMG}/${step.file}`}
                        alt={step.caption}
                        fill
                        className="object-cover brightness-[0.8] saturate-[0.82] transition duration-500 group-hover/route:scale-[1.025]"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        quality={90}
                      />
                      <span className="absolute left-4 top-4 text-xl font-bold leading-none text-[#FFF1C7]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-4 text-sm font-bold leading-7 text-[#CFC8BC]">
                      {step.caption}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </details>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-[#090909]"
        aria-labelledby="cta-title"
      >
        <Container className="py-20 md:py-28 lg:py-32">
          <CinematicReveal className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold tracking-[0.16em] text-[#E0C584] uppercase">
                CONTACT
              </p>
              <h2
                id="cta-title"
                className="mt-4 text-balance text-4xl font-bold leading-tight tracking-[-0.045em] text-[#F5F1E8] sm:text-5xl lg:text-6xl"
              >
                まずは、いまの課題を
                <br />
                聞かせてください。
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-8 text-[#CFC8BC] sm:text-base">
                HPのAI化、AX・業務効率化、マーケティング支援について。何から始めるべきか決まっていない段階でも、ご相談いただけます。
              </p>
            </div>
            <SpecularButton
              href={CONTACT_FORM_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto lg:justify-self-end"
            >
              相談してみる
            </SpecularButton>
          </CinematicReveal>
        </Container>
      </section>
    </CinematicPageFrame>
  )
}

export default function Page() {
  return <MotionProvider><CompanyProfilePage /></MotionProvider>
}

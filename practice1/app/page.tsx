import type { CSSProperties, ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import Parallax from "./components/Parallax";
import Particles from "./components/Particles";
import Reveal from "./components/Reveal";
import Spotlight from "./components/Spotlight";
import WaitlistForm from "./components/WaitlistForm";
import WelcomeLine from "./components/WelcomeLine";
import { posts } from "./lib/posts";

import frontShot from "@/public/images/實體圖片/AaFyVOuwMjzbg4H1g6mYOw-AaFyVOuwjiIpgoBK8axMZA.jpg";
import angleShot from "@/public/images/實體圖片/AaFyVNA_hAiXcVaQY1SgpA-AaFyVNA_DhS9zh2Wl0HAgg.jpg";
import tableShot from "@/public/images/實體圖片/AaFyVOFoIY6FeI5NCBWa4g-AaFyVOFoy5nwOj75ZKRmvQ.jpg";
import usbShot from "@/public/images/實體圖片/AaFyVP87xjkl_XuoiDsOgw-AaFyVP88vsFrDy6s7AiotA.jpg";
import topShot from "@/public/images/實體圖片/AaFyVPh_UeuclyRR2m9WZA-AaFyVPh_gjAMbOkzNjR9Pw.jpg";
import explodedShot from "@/public/images/3D渲染版/DEALSTORM_3D_07_爆炸分解圖_概念示意.jpg";

const tickerWords = [
  "有牌套、無牌套都能洗",
  "不傷卡",
  "洗得夠亂",
  "一鍵開局",
  "USB-C 充電",
  "RGB 燈條",
  "霧黑機身",
];

const specs = [
  ["100–300", "張／次（目標容量）"],
  ["3", "槽設計，左右入牌"],
  ["USB-C", "充電，帶著走"],
  ["RGB", "青靛紫漸層燈條"],
];

const pains = [
  {
    no: "01",
    pain: "手洗容易折角，牌套也越洗越花",
    gain: "不傷卡",
    detail: "有牌套的卡直接放進去洗，不用先一張張拆套。",
  },
  {
    no: "02",
    pain: "洗不夠亂，總覺得這局不太公平",
    gain: "洗得夠亂",
    detail: "交給機器打散，每一局都從乾淨的牌庫開始。",
  },
  {
    no: "03",
    pain: "一疊 200 張，洗到手痠還在洗",
    gain: "一鍵開局",
    detail: "放卡、按下 START，大家倒飲料的時間就洗好了。",
  },
];

const moments = [
  {
    time: "SAT 19:30",
    title: "週末開團",
    text: "人到齊、桌子清好，牌暴已經把牌庫準備好。",
  },
  {
    time: "MID-GAME",
    title: "牌庫構築中場",
    text: "棄牌堆又厚又亂，丟進去重洗，遊戲節奏不中斷。",
  },
  {
    time: "ON THE ROAD",
    title: "帶去朋友家",
    text: "USB-C 充電，塞進背包就能去桌遊店或朋友家開團。",
  },
];

const insideParts = [
  ["上蓋", "左右入牌槽＋中央出牌槽，放卡就定位。"],
  ["洗牌機構", "馬達與電池收在機身裡，按一下就開始。"],
  ["機身", "霧黑外殼，桌燈下不反光、不搶戲。"],
  ["RGB 燈條", "青、靛、紫漸層，牌暴的招牌。"],
];

const faqs = [
  {
    q: "什麼時候開賣？價格多少？",
    a: "牌暴目前在小規模測試階段，售價還沒有定案。加入搶先名單，開放預購時會第一時間通知你。",
  },
  {
    q: "多厚的牌套可以洗？",
    a: "一般尺寸卡片搭配常見牌套是我們的設計目標，支援的牌套厚度正在實測，確認後會公布完整清單。",
  },
  {
    q: "一次可以洗幾張？",
    a: "目標容量是一次 100～300 張，實際數字以量產版規格為準。",
  },
  {
    q: "網站上的機器是最終外觀嗎？",
    a: "目前的圖片是概念示意，牌槽位置與按鍵配置可能會在量產前微調。",
  },
];

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="font-display flex items-center gap-3 text-xs tracking-[0.35em] text-white/50">
      <span className="rgb-text font-bold">{index}</span>
      <span className="h-px w-10 bg-white/20" />
      {children}
    </p>
  );
}

// 圖片在框內以較慢速度移動，捲動時有景深
function ParallaxPhoto({
  src,
  alt,
  sizes,
  caption,
  className = "",
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  caption: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`group relative isolate overflow-hidden rounded-3xl ${className}`}>
      <Parallax speed={0.06} className="absolute inset-0" innerClassName="absolute -inset-y-[20%] inset-x-0">
        <Image
          src={src}
          alt={alt}
          fill
          placeholder="blur"
          sizes={sizes}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </Parallax>
      {caption}
    </figure>
  );
}

// 首屏用的進場動畫，頁面一載入就播放
function FadeUp({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div className="fade-up" style={{ "--delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <figcaption className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink/60 px-3 py-1 text-xs text-white backdrop-blur sm:left-5 sm:top-5">
      {children}
    </figcaption>
  );
}

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative flex min-h-[min(100svh,980px)] flex-col justify-end overflow-hidden pt-24 lg:pt-28">
        <Parallax speed={0.35} className="absolute inset-x-0 top-0 h-[70%]" innerClassName="h-full">
          <div aria-hidden className="grid-floor h-full" />
        </Parallax>
        <Parallax
          speed={0.5}
          className="pointer-events-none absolute inset-x-0 top-20 sm:top-24"
          innerClassName="flex justify-center"
        >
          <p aria-hidden className="outline-word font-display whitespace-nowrap text-[17vw] font-bold leading-none">
            DEALSTORM
          </p>
        </Parallax>
        <Particles className="pointer-events-none absolute inset-0 h-full w-full" />

        <div className="relative mx-auto grid w-full max-w-7xl items-end gap-6 px-5 sm:px-8 md:gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:pb-24">
            <WelcomeLine />
            <FadeUp>
              <p className="font-display inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3 py-1 text-[11px] tracking-[0.2em] text-cyan sm:text-xs">
                <span className="animate-glow h-1.5 w-1.5 rounded-full bg-cyan" />
                CARD SHUFFLER · 卡牌界的自動麻將機
              </p>
            </FadeUp>
            <FadeUp delay={100}>
              <h1 className="mt-6 text-[2.75rem] font-black leading-[1.1] tracking-tight text-white sm:text-6xl xl:text-7xl">
                一鍵捲起
                <br />
                <span className="rgb-text">牌暴</span>，
                <br />
                開局不用等。
              </h1>
            </FadeUp>
            <FadeUp delay={200}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
                給每週開團的重度桌遊玩家。有牌套、無牌套都能洗，
                不傷卡又洗得夠亂，放上桌就是全場最亮的那台裝備。
              </p>
            </FadeUp>
            <FadeUp delay={300}>
              <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-9">
                <Link
                  href="#waitlist"
                  className="rgb-bg animate-sweep btn-shine rounded-full px-7 py-3.5 font-bold text-white shadow-[0_0_36px_rgb(99_102_241/0.55)] transition hover:shadow-[0_0_50px_rgb(168_85_247/0.7)]"
                >
                  加入搶先名單
                </Link>
                <Link href="#why" className="group flex items-center gap-2 text-white/70 hover:text-white">
                  看它怎麼洗
                  <span className="transition group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </FadeUp>
          </div>

          <Parallax speed={-0.08} className="relative mx-auto w-full max-w-2xl lg:col-span-7 lg:max-w-none">
            <FadeUp delay={150}>
              <div className="relative">
                <div aria-hidden className="animate-glow absolute inset-x-10 bottom-10 h-1/2 rounded-full bg-indigo/40 blur-[90px]" />
                <Image
                  src={frontShot}
                  alt="DEALSTORM 牌暴洗牌機正面，底部有青到紫的 RGB 燈條"
                  placeholder="blur"
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 58vw, (min-width: 672px) 42rem, 100vw"
                  className="hero-fade relative w-full"
                />
              </div>
            </FadeUp>
          </Parallax>
        </div>

        {/* 規格條 */}
        <div className="relative border-y border-line bg-ink/60 backdrop-blur">
          <dl className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 md:grid-cols-4">
            {specs.map(([value, label], i) => (
              <div
                key={label}
                className={`py-5 sm:py-6 md:px-8 md:first:pl-0 ${i % 2 === 1 ? "pl-5 border-l border-line md:pl-8" : ""} ${
                  i >= 2 ? "border-t border-line md:border-t-0" : ""
                } ${i === 2 ? "md:border-l" : ""}`}
              >
                <dt className="font-display text-2xl font-bold text-white sm:text-3xl">{value}</dt>
                <dd className="mt-1 text-xs text-white/50 sm:text-sm">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 跑馬燈 */}
      <div className="rgb-bg overflow-hidden py-3" aria-hidden>
        <div className="animate-marquee flex w-max">
          {[...tickerWords, ...tickerWords].map((word, i) => (
            <span key={i} className="flex items-center whitespace-nowrap px-6 text-sm font-bold text-ink">
              {word}
              <span className="ml-12 text-xs">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* WHY */}
      <section id="why" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <SectionLabel index="01">WHY DEALSTORM</SectionLabel>
            <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl">
              洗牌這件事，
              <br />
              該交給機器了。
            </h2>
            <p className="mt-6 leading-relaxed text-white/55">
              打麻將早就沒人手洗了。牌暴把同一件事帶到卡牌桌上，
              主打兩件事：<span className="text-white">不傷卡、洗得夠亂</span>。
            </p>
          </Reveal>

          <ol className="lg:col-span-8">
            {pains.map((item, i) => (
              <Reveal
                as="li"
                key={item.no}
                delay={i * 120}
                className="group grid grid-cols-[56px_1fr] gap-x-4 gap-y-3 border-t border-line py-7 last:border-b sm:py-8 md:grid-cols-[80px_1fr_1fr] md:gap-8"
              >
                <span className="font-display row-span-2 text-3xl font-bold text-white/15 transition group-hover:text-white/40 sm:text-4xl md:row-span-1">
                  {item.no}
                </span>
                <p className="text-white/45 line-through decoration-white/20">{item.pain}</p>
                <div>
                  <p className="rgb-text text-xl font-black sm:text-2xl">{item.gain}</p>
                  <p className="mt-2 text-white/60">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* DESIGN */}
      <section id="design" className="scroll-mt-20 px-5 pb-20 sm:px-8 md:pb-28 lg:pb-36">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <SectionLabel index="02">DESIGN</SectionLabel>
              <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl">
                霧黑機身，
                <span className="rgb-text">一圈光</span>。
              </h2>
            </div>
            <p className="max-w-sm text-white/55">
              不是收在櫃子裡的工具，是擺上桌就會被問「這台哪買的」的裝備。
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-6 lg:grid-rows-[340px_300px]">
            <Reveal as="div" className="sm:col-span-2 lg:col-span-4">
              <ParallaxPhoto
                src={tableShot}
                alt="牌暴放在桌遊桌上，周圍是桌遊盒、骰子與卡牌"
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="aspect-[16/10] sm:aspect-[16/8] lg:aspect-auto lg:h-full"
                caption={
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/60 to-transparent p-5 pt-20 sm:p-6 sm:pt-20">
                    <p className="font-display text-xs tracking-[0.3em] text-cyan">ON THE TABLE</p>
                    <p className="mt-1 text-lg font-bold text-white">桌上最亮的那一台</p>
                  </figcaption>
                }
              />
            </Reveal>
            <Reveal as="div" delay={100} className="lg:col-span-2">
              <ParallaxPhoto
                src={usbShot}
                alt="機身側面的 USB-C 充電孔與 RGB 燈條特寫"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] lg:aspect-auto lg:h-full"
                caption={<Tag>USB-C 充電</Tag>}
              />
            </Reveal>
            <Reveal as="div" delay={150} className="lg:col-span-3">
              <ParallaxPhoto
                src={topShot}
                alt="俯視三個牌槽，左右兩槽往中間洗入"
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] lg:aspect-auto lg:h-full"
                caption={<Tag>三槽：左右入牌，中間出牌</Tag>}
              />
            </Reveal>
            <Reveal as="div" delay={200} className="sm:col-span-2 lg:col-span-3">
              <ParallaxPhoto
                src={angleShot}
                alt="牌暴斜側視角，桌面倒映出紫色燈光"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[4/3] sm:aspect-[16/8] lg:aspect-auto lg:h-full"
                caption={<Tag>有牌套、無牌套都能洗</Tag>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* MOMENTS */}
      <section className="relative overflow-hidden border-y border-line bg-gradient-to-br from-cyan/10 via-indigo/10 to-violet/15 py-20 md:py-28">
        <Parallax speed={0.25} className="pointer-events-none absolute inset-0" innerClassName="h-full">
          <div aria-hidden className="grid-floor h-full opacity-60" />
        </Parallax>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionLabel index="03">WHEN YOU NEED IT</SectionLabel>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-line md:mt-14 md:grid-cols-3">
            {moments.map((m, i) => (
              <Reveal key={m.title} delay={i * 120} className="h-full">
                <Spotlight className="relative h-full overflow-hidden bg-ink/90 p-7 sm:p-8 lg:p-10">
                  <div aria-hidden className="animate-scan absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-indigo/10 to-transparent" style={{ animationDelay: `${i * 1.2}s` }} />
                  <p className="font-display relative text-sm tracking-[0.25em] text-white/40">{m.time}</p>
                  <h3 className="relative mt-6 text-2xl font-bold text-white md:mt-8">{m.title}</h3>
                  <p className="relative mt-3 leading-relaxed text-white/55">{m.text}</p>
                  <div className="rgb-line relative mt-8 w-16 md:mt-10" />
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INSIDE */}
      <section id="inside" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 lg:py-36">
        <div className="grid items-center gap-10 md:gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionLabel index="04">INSIDE</SectionLabel>
            <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl">
              拆開來看，
              <br />
              每一層都有用意。
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 md:mt-10 lg:grid-cols-1">
              {insideParts.map(([title, text]) => (
                <li key={title} className="flex gap-5">
                  <span className="rgb-bg mt-2 h-2 w-2 shrink-0 rotate-45" />
                  <div>
                    <p className="font-bold text-white">{title}</p>
                    <p className="mt-1 text-white/55">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150} className="lg:col-span-7">
            <Parallax speed={-0.04}>
              <figure className="rgb-border relative overflow-hidden rounded-3xl">
                <Image
                  src={explodedShot}
                  alt="牌暴爆炸分解圖：上蓋、洗牌機構、USB-C、機身外殼、RGB 燈條"
                  placeholder="blur"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="w-full"
                />
              </figure>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* BLOG 預覽 */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 md:pb-28">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <SectionLabel index="05">STORM NOTES</SectionLabel>
            <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-4xl">牌暴的文章</h2>
          </div>
          <Link href="/blog" className="group flex shrink-0 items-center gap-2 text-white/70 hover:text-white">
            全部文章
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 100} className={i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col justify-between gap-10 rounded-3xl border border-line bg-ink-2/60 p-7 transition hover:border-white/20 hover:bg-ink-2"
              >
                <div>
                  <p className="text-xs text-white/45">{post.category}</p>
                  <h3 className="mt-3 text-xl font-bold leading-snug text-white">{post.title}</h3>
                </div>
                <span className="text-sm text-cyan">
                  閱讀 <span className="inline-block transition group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-8 md:py-28 lg:py-36">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgb(34_211_238/0.18),transparent_60%),radial-gradient(ellipse_at_80%_40%,rgb(168_85_247/0.25),transparent_60%)]" />
        <Particles className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionLabel index="06">EARLY ACCESS</SectionLabel>
            <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-6xl">
              第一批牌暴，
              <br />
              <span className="rgb-text">留給先上車的人。</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
              告訴我們你怎麼洗牌，我們會用你的回答決定最終規格與售價。
              開放預購時，名單上的玩家最先知道。
            </p>
          </Reveal>
          <Reveal delay={150} className="mx-auto w-full max-w-xl lg:max-w-none">
            <WaitlistForm />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-5 pb-20 sm:px-8 md:pb-28 lg:pb-36">
        <Reveal>
          <SectionLabel index="07">FAQ</SectionLabel>
        </Reveal>
        <div className="mt-10 border-b border-line">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 80}>
              <details className="group border-t border-line py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-bold text-white sm:text-lg">
                  {item.q}
                  <span className="text-2xl font-light text-white/40 transition group-open:rotate-45 group-open:text-cyan">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-white/55">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}

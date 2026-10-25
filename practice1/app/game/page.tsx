import type { Metadata } from "next";

import CatchGame from "../components/CatchGame";

export const metadata: Metadata = {
  title: "小遊戲：牌暴接接樂",
  description: "移動牌暴接住掉落的卡片，避開飲料。純娛樂的小遊戲。",
};

const rules = [
  { label: "一般卡", value: "+1", text: "紫色卡背，接住就得分。" },
  { label: "SSR 稀有卡", value: "+5", text: "會發光、掉得更快，接到賺很大。" },
  { label: "飲料", value: "−1 命", text: "咖啡灑到卡是玩家最大的惡夢，千萬別接。" },
  { label: "連擊", value: "×2、×3…", text: "連續接 10 張，分數倍率往上加；漏接一張就歸零。" },
];

export default function GamePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-28 pt-28 sm:px-8 lg:pb-36 lg:pt-36">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_480px] lg:gap-20">
        <div className="fade-up lg:sticky lg:top-32">
          <p className="font-display flex items-center gap-3 text-xs tracking-[0.35em] text-white/50">
            <span className="rgb-text font-bold">MINI GAME</span>
            <span className="h-px w-10 bg-white/20" />
            STORM CATCH
          </p>
          <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-6xl">
            牌暴<span className="rgb-text">接接樂</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/60">
            卡片從天而降，開著牌暴把它們全部接住。小心桌上的飲料——卡片的天敵。
          </p>

          <dl className="mt-10 divide-y divide-line border-y border-line">
            {rules.map((rule) => (
              <div key={rule.label} className="grid grid-cols-[110px_1fr] gap-4 py-4 sm:grid-cols-[140px_90px_1fr]">
                <dt className="font-bold text-white">{rule.label}</dt>
                <dd className="font-display rgb-text font-bold sm:order-none">{rule.value}</dd>
                <dd className="col-span-2 text-sm text-white/55 sm:col-span-1">{rule.text}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-3 text-sm text-white/55 sm:grid-cols-2">
            <p className="rounded-2xl border border-line bg-ink-2/60 p-4">
              <span className="block font-bold text-white">電腦</span>
              ← → 或 A / D 鍵移動，也可以用滑鼠。
            </p>
            <p className="rounded-2xl border border-line bg-ink-2/60 p-4">
              <span className="block font-bold text-white">手機／平板</span>
              手指在遊戲畫面上左右滑動。
            </p>
          </div>
          <p className="mt-6 text-xs text-white/35">純娛樂小遊戲，分數只存在你的瀏覽器，不兌換任何獎項。</p>
        </div>

        <div className="fade-up" style={{ animationDelay: "150ms" }}>
          <CatchGame />
        </div>
      </div>
    </main>
  );
}

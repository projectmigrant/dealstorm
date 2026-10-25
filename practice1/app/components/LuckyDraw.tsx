"use client";

import { usePathname } from "next/navigation";
import { useState, type CSSProperties } from "react";

import { STORAGE_KEYS, useStoredItem, writeItem } from "../lib/storage";
import BoltIcon from "./BoltIcon";
import Modal from "./Modal";
import { useVisitor } from "./VisitorProvider";

const WIN_RATE = 0.1;
const CONFETTI_COLORS = ["#22D3EE", "#6366F1", "#A855F7", "#ffffff"];

type DrawRecord = { date: string; won: boolean; code?: string };
type Piece = { x: number; y: number; r: number; color: string; delay: number };

function today() {
  // 用本地時間的 YYYY-MM-DD，一天抽一次
  return new Date().toLocaleDateString("sv-SE");
}

function rollWin() {
  return Math.random() < WIN_RATE;
}

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return "STORM90-" + Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function parseRecord(raw: string | null | undefined): DrawRecord | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DrawRecord;
  } catch {
    return null;
  }
}

export default function LuckyDraw() {
  const { name } = useVisitor();
  const pathname = usePathname();
  const record = parseRecord(useStoredItem("local", STORAGE_KEYS.draw));
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState<Piece[]>([]);
  const [copied, setCopied] = useState(false);

  const hasCoupon = record?.won === true;
  const usedToday = record ? record.date === today() : false;
  const canDraw = !hasCoupon && !usedToday;

  const close = () => {
    setOpen(false);
    setPicked(null);
    setRevealed(false);
    setDone(false);
    setConfetti([]);
  };

  const pick = (index: number) => {
    if (picked !== null || !canDraw) return;
    const won = rollWin();
    setPicked(index);
    // 先翻牌，翻完再寫入結果
    window.setTimeout(() => {
      writeItem(
        "local",
        STORAGE_KEYS.draw,
        JSON.stringify({ date: today(), won, code: won ? makeCode() : undefined } satisfies DrawRecord)
      );
      setRevealed(true);
      // 讓翻開的牌停留一下，再切到結果畫面
      window.setTimeout(() => setDone(true), won ? 1600 : 1300);
      if (won) {
        setConfetti(
          Array.from({ length: 36 }, () => ({
            x: (Math.random() - 0.5) * 420,
            y: (Math.random() - 0.8) * 360,
            r: Math.random() * 720 - 360,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            delay: Math.random() * 150,
          }))
        );
      }
    }, 750);
  };

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  // 這次剛抽完，或之前就有結果
  const showResult = picked === null || done;
  const showCoupon = hasCoupon && showResult;
  const showLose = !hasCoupon && usedToday && showResult;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        // 小遊戲頁面會擋到遊戲畫面，先藏起來
        hidden={pathname === "/game"}
        className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-ink-2/90 py-2 pl-2 pr-4 text-sm font-bold text-white shadow-[0_0_30px_rgb(99_102_241/0.5)] backdrop-blur transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      >
        <span className="rgb-border flex h-9 w-9 items-center justify-center rounded-full bg-ink">
          <BoltIcon className="h-6 w-6 transition group-hover:rotate-12" />
        </span>
        {hasCoupon ? "我的 9 折券" : "抽 9 折券"}
        <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-cyan/70" aria-hidden />
      </button>

      <Modal open={open} onClose={close} labelledBy="lucky-title">
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-xs tracking-[0.3em] text-cyan">LUCKY DRAW</p>
              <h2 id="lucky-title" className="mt-2 text-2xl font-black text-white">
                {showCoupon ? "恭喜中獎！" : showLose ? "今天的手氣用完了" : "翻一張牌，試試手氣"}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="關閉"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-white/60 transition hover:text-white"
            >
              ✕
            </button>
          </div>

          {showCoupon && record?.code ? (
            <Coupon code={record.code} name={name} copied={copied} onCopy={() => copy(record.code!)} />
          ) : showLose ? (
            <div className="mt-6 text-white/60">
              <p>{name ? `${name}，` : ""}這次沒抽中，明天再來翻一次吧！</p>
              <p className="mt-2 text-sm text-white/40">每人每天可以抽一次，中獎機率 10%。</p>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-white/55">
                三張牌裡藏著牌暴<span className="text-white">預購 9 折券</span>，每天一次機會。
              </p>
              <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
                {[0, 1, 2].map((i) => {
                  const flipped = picked === i && revealed;
                  const won = flipped && hasCoupon;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={picked !== null}
                      onClick={() => pick(i)}
                      aria-label={`翻第 ${i + 1} 張牌`}
                      className={`group block w-full perspective-[900px] ${
                        picked !== null && picked !== i ? "opacity-30" : ""
                      } transition-opacity duration-500`}
                    >
                      <div
                        className={`relative aspect-[5/7] w-full transition-transform duration-700 transform-3d ${
                          flipped ? "rotate-y-180" : picked === i ? "animate-pulse" : "group-hover:-translate-y-1.5"
                        }`}
                      >
                        {/* 牌背 */}
                        <div className="rgb-border absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo/40 via-ink-2 to-violet/40 backface-hidden">
                          <BoltIcon className="h-10 w-10 sm:h-12 sm:w-12" />
                        </div>
                        {/* 牌面 */}
                        <div
                          className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl rotate-y-180 backface-hidden ${
                            won ? "rgb-bg" : "border border-line bg-ink"
                          }`}
                        >
                          {won ? (
                            <>
                              <span className="font-display text-3xl font-bold text-white sm:text-4xl">9折</span>
                              <span className="mt-1 text-[10px] text-white/80">預購優惠</span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-bold text-white/70">差一點</span>
                              <span className="mt-1 text-[10px] text-white/40">明天再試</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-5 text-center text-xs text-white/40">
                {picked === null ? "點一張牌翻開" : revealed ? "" : "翻牌中…"}
              </p>
            </>
          )}

          {/* 中獎彩帶：放最後、疊在最上層 */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-10">
            {confetti.map((p, i) => (
              <span
                key={i}
                className="confetti absolute h-3 w-2 rounded-sm"
                style={
                  {
                    background: p.color,
                    "--x": `${p.x}px`,
                    "--y": `${p.y}px`,
                    "--r": `${p.r}deg`,
                    animationDelay: `${p.delay}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

function Coupon({
  code,
  name,
  copied,
  onCopy,
}: {
  code: string;
  name: string | null | undefined;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="mt-6">
      <div className="rgb-bg relative overflow-hidden rounded-2xl p-[1px]">
        <div className="relative rounded-2xl bg-ink px-6 py-6">
          <div aria-hidden className="absolute -right-6 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-ink-2" />
          <div aria-hidden className="absolute -left-6 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-ink-2" />
          <p className="text-xs text-white/50">{name ? `${name} 專屬` : "DEALSTORM 牌暴"}・預購優惠券</p>
          <p className="rgb-text font-display mt-1 inline-block text-5xl font-bold">9 折</p>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-white/15 pt-4">
            <code className="font-display text-lg tracking-wider text-white">{code}</code>
            <button
              type="button"
              onClick={onCopy}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-white/80 transition hover:border-cyan hover:text-white"
            >
              {copied ? "已複製" : "複製"}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-white/40">
        優惠券會存在這台裝置的瀏覽器裡，開放預購時輸入券號即可使用。截圖保存更保險。
      </p>
    </div>
  );
}

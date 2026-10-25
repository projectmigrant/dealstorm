"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { STORAGE_KEYS, useStoredItem, writeItem } from "../lib/storage";
import { useVisitor } from "./VisitorProvider";

// 畫布的邏輯尺寸，實際顯示時會等比縮放
const W = 480;
const H = 640;
const MAX_LIVES = 3;

type Kind = "card" | "rare" | "drink";
type Item = { x: number; y: number; vy: number; kind: Kind; rot: number; vr: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };
type Popup = { x: number; y: number; text: string; life: number; color: string };
type Phase = "ready" | "playing" | "over";
type Hud = { score: number; lives: number; combo: number };

const ITEM_SIZE: Record<Kind, { w: number; h: number }> = {
  card: { w: 34, h: 48 },
  rare: { w: 38, h: 54 },
  drink: { w: 34, h: 40 },
};

export default function CatchGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerX = useRef<number | null>(null);
  const keys = useRef({ left: false, right: false });
  const [phase, setPhase] = useState<Phase>("ready");
  const [hud, setHud] = useState<Hud>({ score: 0, lives: MAX_LIVES, combo: 0 });
  const [newBest, setNewBest] = useState(false);
  const { name } = useVisitor();
  const bestRaw = useStoredItem("local", STORAGE_KEYS.gameBest);
  const best = Number(bestRaw ?? 0) || 0;
  const bestRef = useRef(best);

  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  // 鍵盤控制
  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.current.left = down;
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right = down;
      else return;
      pointerX.current = null;
      e.preventDefault();
    };
    const onDown = (e: KeyboardEvent) => set(e, true);
    const onUp = (e: KeyboardEvent) => set(e, false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // 待機畫面也畫一次場景
  useEffect(() => {
    if (phase !== "ready") return;
    const ctx = setupCanvas(canvasRef.current);
    if (ctx) {
      drawBackground(ctx, 0);
      drawMachine(ctx, W / 2, H - 56, 0);
    }
  }, [phase]);

  // 遊戲主迴圈
  useEffect(() => {
    if (phase !== "playing") return;
    const ctx = setupCanvas(canvasRef.current);
    if (!ctx) return;

    const player = { x: W / 2, y: H - 56, w: 118 };
    let items: Item[] = [];
    let sparks: Spark[] = [];
    let popups: Popup[] = [];
    let score = 0;
    let lives = MAX_LIVES;
    let combo = 0;
    let elapsed = 0;
    let spawnIn = 0.6;
    let shake = 0;
    let frame = 0;
    let last = performance.now();
    let paused = false;

    const pushHud = () => setHud({ score, lives, combo });

    const burst = (x: number, y: number, colors: string[], count: number) => {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 60 + Math.random() * 220;
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 80,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const spawn = () => {
      const difficulty = Math.min(elapsed / 60, 1);
      const r = Math.random();
      const kind: Kind = r < 0.07 ? "rare" : r < 0.07 + 0.16 + 0.14 * difficulty ? "drink" : "card";
      const speed = 170 + 170 * difficulty + Math.random() * 70;
      items.push({
        x: 30 + Math.random() * (W - 60),
        y: -40,
        vy: kind === "rare" ? speed * 1.25 : speed,
        kind,
        rot: (Math.random() - 0.5) * 0.6,
        vr: (Math.random() - 0.5) * 2.4,
      });
    };

    const update = (dt: number) => {
      elapsed += dt;

      // 移動洗牌機
      if (keys.current.left) player.x -= 440 * dt;
      if (keys.current.right) player.x += 440 * dt;
      if (pointerX.current !== null) {
        player.x += (pointerX.current - player.x) * Math.min(1, dt * 16);
      }
      player.x = Math.max(player.w / 2, Math.min(W - player.w / 2, player.x));

      spawnIn -= dt;
      if (spawnIn <= 0) {
        spawn();
        spawnIn = Math.max(0.32, 0.85 - elapsed * 0.009) * (0.7 + Math.random() * 0.6);
      }

      const kept: Item[] = [];
      for (const item of items) {
        item.y += item.vy * dt;
        item.rot += item.vr * dt;
        const size = ITEM_SIZE[item.kind];
        const caught =
          item.y + size.h / 2 >= player.y - 14 &&
          item.y - size.h / 2 <= player.y + 10 &&
          Math.abs(item.x - player.x) <= player.w / 2 + size.w / 3;

        if (caught) {
          if (item.kind === "drink") {
            lives -= 1;
            combo = 0;
            shake = 0.35;
            burst(item.x, item.y, ["#f97316", "#fbbf24", "#78350f"], 22);
            popups.push({ x: item.x, y: item.y - 20, text: "灑到卡了！", life: 1, color: "#fb923c" });
          } else {
            combo += 1;
            const multiplier = 1 + Math.floor(combo / 10);
            const gain = (item.kind === "rare" ? 5 : 1) * multiplier;
            score += gain;
            burst(
              item.x,
              item.y,
              item.kind === "rare" ? ["#ffffff", "#22D3EE", "#A855F7", "#fde68a"] : ["#22D3EE", "#6366F1", "#A855F7"],
              item.kind === "rare" ? 30 : 12
            );
            popups.push({
              x: item.x,
              y: item.y - 20,
              text: `+${gain}`,
              life: 1,
              color: item.kind === "rare" ? "#fde68a" : "#e0e7ff",
            });
          }
          pushHud();
          continue;
        }

        if (item.y > H + 40) {
          // 漏接卡片會中斷連擊
          if (item.kind !== "drink" && combo > 0) {
            combo = 0;
            pushHud();
          }
          continue;
        }
        kept.push(item);
      }
      items = kept;

      sparks = sparks.filter((s) => {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 420 * dt;
        s.life -= dt * 1.6;
        return s.life > 0;
      });
      popups = popups.filter((p) => {
        p.y -= 50 * dt;
        p.life -= dt * 1.3;
        return p.life > 0;
      });
      shake = Math.max(0, shake - dt);
    };

    const render = () => {
      ctx.save();
      if (shake > 0) ctx.translate((Math.random() - 0.5) * 14 * shake, (Math.random() - 0.5) * 14 * shake);
      drawBackground(ctx, elapsed);
      for (const item of items) drawItem(ctx, item, elapsed);
      drawMachine(ctx, player.x, player.y, elapsed);

      ctx.globalCompositeOperation = "lighter";
      for (const s of sparks) {
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      ctx.textAlign = "center";
      ctx.font = "bold 22px 'Chakra Petch', sans-serif";
      for (const p of popups) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!paused) {
        update(dt);
        render();
      }
      if (lives <= 0) {
        if (score > bestRef.current) {
          writeItem("local", STORAGE_KEYS.gameBest, String(score));
          setNewBest(true);
        }
        setPhase("over");
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      paused = document.hidden;
      last = performance.now();
    };

    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [phase]);

  const start = () => {
    setHud({ score: 0, lives: MAX_LIVES, combo: 0 });
    setNewBest(false);
    pointerX.current = null;
    setPhase("playing");
  };

  const trackPointer = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.current = ((e.clientX - rect.left) / rect.width) * W;
  };

  const multiplier = 1 + Math.floor(hud.combo / 10);

  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <div className="rgb-border relative overflow-hidden rounded-3xl bg-ink">
        <canvas
          ref={canvasRef}
          onPointerMove={trackPointer}
          onPointerDown={trackPointer}
          className="block aspect-[3/4] w-full touch-none select-none"
          aria-label="牌暴接接樂遊戲畫面"
        />

        {/* 分數列 */}
        {phase === "playing" && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <div>
              <p className="font-display text-xs tracking-[0.25em] text-white/50">SCORE</p>
              <p className="font-display text-3xl font-bold text-white">{hud.score}</p>
              {hud.combo >= 3 && (
                <p className="rgb-text font-display text-sm font-bold">
                  {hud.combo} COMBO{multiplier > 1 ? ` ×${multiplier}` : ""}
                </p>
              )}
            </div>
            <div className="flex gap-1.5" aria-label={`剩餘 ${hud.lives} 條命`}>
              {Array.from({ length: MAX_LIVES }, (_, i) => (
                <span
                  key={i}
                  className={`h-5 w-3.5 rounded-[3px] border ${
                    i < hud.lives ? "rgb-bg border-transparent" : "border-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 開始／結束畫面 */}
        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/70 p-8 text-center backdrop-blur-sm">
            {phase === "ready" ? (
              <>
                <p className="font-display text-xs tracking-[0.35em] text-cyan">STORM CATCH</p>
                <p className="mt-3 text-3xl font-black text-white sm:text-4xl">牌暴接接樂</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  移動牌暴接住掉下來的卡，
                  <br />
                  小心別讓飲料灑到卡上！
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-xs tracking-[0.35em] text-cyan">GAME OVER</p>
                <p className="font-display mt-3 text-6xl font-bold text-white">{hud.score}</p>
                <p className="mt-2 text-sm text-white/60">
                  {newBest
                    ? `${name ? name + "，" : ""}刷新個人最高分！`
                    : `${name ? name + " 的" : ""}最高分：${best}`}
                </p>
              </>
            )}
            <button
              type="button"
              onClick={start}
              className="rgb-bg btn-shine mt-8 rounded-full px-8 py-3.5 font-bold text-white shadow-[0_0_30px_rgb(99_102_241/0.5)]"
            >
              {phase === "ready" ? "開始遊戲" : "再玩一次"}
            </button>
          </div>
        )}
      </div>
      <p className="mt-4 text-center text-sm text-white/45">
        {name ? `${name} 的` : "你的"}最高分：<span className="font-display text-white">{best}</span>
      </p>
    </div>
  );
}

// ---------- 繪圖 ----------

function setupCanvas(canvas: HTMLCanvasElement | null) {
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function rgbGradient(ctx: CanvasRenderingContext2D, x0: number, x1: number) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, "#22D3EE");
  g.addColorStop(0.55, "#6366F1");
  g.addColorStop(1, "#A855F7");
  return g;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawBackground(ctx: CanvasRenderingContext2D, t: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0b0b12");
  bg.addColorStop(1, "#171533");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 往下流動的格線
  ctx.strokeStyle = "rgba(99,102,241,0.12)";
  ctx.lineWidth = 1;
  const offset = (t * 40) % 40;
  for (let y = offset; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
}

function drawBolt(ctx: CanvasRenderingContext2D, size: number, color: string) {
  const s = size / 200;
  const pts = [118, 6, 70, 104, 100, 104, 78, 194, 140, 82, 108, 82, 132, 6];
  ctx.beginPath();
  for (let i = 0; i < pts.length; i += 2) {
    const px = (pts[i] - 100) * s;
    const py = (pts[i + 1] - 100) * s;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawItem(ctx: CanvasRenderingContext2D, item: Item, t: number) {
  const { w, h } = ITEM_SIZE[item.kind];
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rot);

  if (item.kind === "drink") {
    // 一杯咖啡：卡片的天敵
    ctx.fillStyle = "#e5e7eb";
    roundRect(ctx, -w / 2, -h / 2 + 6, w - 6, h - 6, 5);
    ctx.fill();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(w / 2 - 6, 2, 7, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = "#7c4a1e";
    ctx.fillRect(-w / 2 + 3, -h / 2 + 9, w - 12, 7);
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) {
      const sx = -6 + i * 10;
      ctx.beginPath();
      ctx.moveTo(sx, -h / 2);
      ctx.quadraticCurveTo(sx + 5 * Math.sin(t * 6 + i), -h / 2 - 8, sx, -h / 2 - 16);
      ctx.stroke();
    }
    ctx.fillStyle = "#f97316";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("!", -3, 12);
  } else {
    const rare = item.kind === "rare";
    if (rare) {
      ctx.shadowColor = "#A855F7";
      ctx.shadowBlur = 18 + 8 * Math.sin(t * 8);
    }
    const face = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    face.addColorStop(0, rare ? "#f5f3ff" : "#312e81");
    face.addColorStop(1, rare ? "#c4b5fd" : "#4c1d95");
    ctx.fillStyle = face;
    roundRect(ctx, -w / 2, -h / 2, w, h, 5);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = rgbGradient(ctx, -w / 2, w / 2);
    ctx.stroke();
    drawBolt(ctx, rare ? 30 : 24, rare ? "#6366F1" : "#a5b4fc");
    if (rare) {
      ctx.fillStyle = "#4c1d95";
      ctx.font = "bold 9px 'Chakra Petch', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SSR", 0, h / 2 - 5);
    }
  }
  ctx.restore();
}

function drawMachine(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const w = 118;
  const h = 40;
  ctx.save();
  ctx.translate(x, y);

  // 底部光暈
  ctx.globalAlpha = 0.5 + 0.2 * Math.sin(t * 4);
  ctx.fillStyle = rgbGradient(ctx, -w / 2, w / 2);
  ctx.filter = "blur(10px)";
  ctx.fillRect(-w / 2 + 6, h / 2 - 4, w - 12, 10);
  ctx.filter = "none";
  ctx.globalAlpha = 1;

  // 機身
  const body = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  body.addColorStop(0, "#2a2a35");
  body.addColorStop(1, "#0f0f16");
  ctx.fillStyle = body;
  roundRect(ctx, -w / 2, -h / 2, w, h, 9);
  ctx.fill();

  // 三個牌槽
  ctx.fillStyle = "#07070c";
  for (let i = -1; i <= 1; i++) {
    roundRect(ctx, i * 36 - 14, -h / 2 + 4, 28, 9, 2);
    ctx.fill();
  }

  // RGB 燈條
  ctx.fillStyle = rgbGradient(ctx, -w / 2, w / 2);
  ctx.shadowColor = "#6366F1";
  ctx.shadowBlur = 12;
  roundRect(ctx, -w / 2 + 6, h / 2 - 7, w - 12, 3, 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // START 按鈕
  ctx.strokeStyle = "#22D3EE";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w / 2 - 14, 2, 5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "bold 9px 'Chakra Petch', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("DEALSTORM", -6, 6);
  ctx.restore();
}

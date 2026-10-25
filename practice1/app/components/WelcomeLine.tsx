"use client";

import { useVisitor } from "./VisitorProvider";

// 首屏上方的個人化問候
export default function WelcomeLine() {
  const { name, isNew, editName } = useVisitor();
  if (!name) return null;

  return (
    <p className="fade-up mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-lg text-white/80 sm:text-xl">
      <span>
        嗨，<span className="rgb-text font-black">{name}</span>
        {isNew ? "！歡迎來到牌暴。" : "，歡迎回來！"}
      </span>
      <button
        type="button"
        onClick={editName}
        className="text-xs text-white/40 underline-offset-4 transition hover:text-white hover:underline"
      >
        不是你？
      </button>
    </p>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  /** 正數：比捲動慢（背景感）；負數：比捲動快（前景感） */
  speed: number;
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
};

// 依元素離畫面中心的距離位移內層，外層保持不動以便量測
export default function Parallax({ speed, className, innerClassName, children }: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (!outer.current || !inner.current) return;
      const rect = outer.current.getBoundingClientRect();
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      inner.current.style.transform = `translate3d(0, ${(offset * speed).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className={`will-change-transform ${innerClassName ?? ""}`}>
        {children}
      </div>
    </div>
  );
}

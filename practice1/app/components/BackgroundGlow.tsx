"use client";

import { useEffect, useRef } from "react";

const SPEEDS = [0.08, -0.05, 0.12];

// 固定在背後的光暈，捲動時以不同速度慢慢飄移，做出景深
export default function BackgroundGlow() {
  const layers = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      layers.current.forEach((el, i) => {
        if (el) el.style.transform = `translate3d(0, ${(-y * SPEEDS[i]).toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={(el) => { layers.current[0] = el; }}
        className="absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-cyan/20 blur-[140px] will-change-transform"
      />
      <div
        ref={(el) => { layers.current[1] = el; }}
        className="absolute -right-40 top-1/3 h-[680px] w-[680px] rounded-full bg-violet/20 blur-[160px] will-change-transform"
      />
      <div
        ref={(el) => { layers.current[2] = el; }}
        className="absolute left-1/3 top-[85%] h-[520px] w-[520px] rounded-full bg-indigo/15 blur-[150px] will-change-transform"
      />
      <div className="noise absolute inset-0" />
    </div>
  );
}

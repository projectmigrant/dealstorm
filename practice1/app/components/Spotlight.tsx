"use client";

import type { ReactNode } from "react";

// 滑鼠移到卡片上時，光點跟著游標走
export default function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`spotlight ${className}`}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }}
      onPointerLeave={(e) => e.currentTarget.style.setProperty("--my", "-200px")}
    >
      {children}
    </div>
  );
}

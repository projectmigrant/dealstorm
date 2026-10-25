"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

// 原生 <dialog>：內建焦點鎖定與 Esc 關閉
export default function Modal({ open, onClose, labelledBy, children, className = "" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // 點到外面的暗色背景就關閉
        if (e.target === e.currentTarget) onClose();
      }}
      className={`modal m-auto w-[min(92vw,460px)] overflow-visible rounded-3xl bg-transparent p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm ${className}`}
    >
      <div className="rgb-border rounded-3xl bg-ink-2 p-6 sm:p-8">{children}</div>
    </dialog>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import icon from "@/public/images/LOGO/DEALSTORM_圖示_透明.svg";
import { useVisitor } from "./VisitorProvider";

const navLinks = [
  { href: "/#why", label: "為什麼" },
  { href: "/#design", label: "設計" },
  { href: "/#inside", label: "結構" },
  { href: "/#faq", label: "常見問題" },
  { href: "/blog", label: "文章" },
  { href: "/game", label: "小遊戲" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { name, editName } = useVisitor();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 打開選單時鎖住背景捲動
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-line bg-ink/80 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" onClick={close} className="flex items-center gap-2.5">
          <Image src={icon} alt="" width={30} height={30} unoptimized />
          <span className="font-display text-lg font-bold tracking-wider text-white">DEALSTORM</span>
          <span className="hidden text-sm text-white/50 sm:inline">牌暴</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm text-white/60 lg:flex">
          {navLinks.map((link) => {
            const active = !link.href.startsWith("/#") && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-white ${active ? "text-white" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {name && (
            <button
              type="button"
              onClick={editName}
              title="更改名字"
              className="hidden max-w-[10rem] truncate text-sm text-white/60 transition hover:text-white md:block"
            >
              Hi, <span className="text-white">{name}</span>
            </button>
          )}
          <Link
            href="/#waitlist"
            onClick={close}
            className="rgb-bg btn-shine hidden rounded-full px-5 py-2 text-sm font-bold text-white shadow-[0_0_24px_rgb(99_102_241/0.5)] sm:inline-block"
          >
            搶先登記
          </Link>
          <button
            type="button"
            aria-label={open ? "關閉選單" : "開啟選單"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
          >
            <span
              className={`absolute h-px w-4 bg-white transition ${open ? "rotate-45" : "-translate-y-1"}`}
            />
            <span
              className={`absolute h-px w-4 bg-white transition ${open ? "-rotate-45" : "translate-y-1"}`}
            />
          </button>
        </div>
      </nav>

      {/* 手機／平板選單 */}
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-500 lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="flex h-[calc(100svh-4rem)] flex-col justify-between px-5 pb-10 pt-6 sm:px-8">
            <ul>
              {navLinks.map((link, i) => (
                <li key={link.href} className="border-b border-line">
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex items-baseline gap-4 py-5 text-2xl font-bold text-white sm:text-3xl"
                  >
                    <span className="font-display text-xs text-white/30">0{i + 1}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/#waitlist"
              onClick={close}
              className="rgb-bg btn-shine rounded-full py-4 text-center font-bold text-white"
            >
              加入搶先名單
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

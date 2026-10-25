import Image from "next/image";
import Link from "next/link";

import logo from "@/public/images/LOGO/DEALSTORM_LOGO_透明_深色用.svg";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="rgb-line" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1fr_auto_auto] lg:gap-20">
        <Image src={logo} alt="DEALSTORM 牌暴" width={150} height={125} unoptimized />
        <nav className="flex gap-12 text-sm">
          <ul className="space-y-3 text-white/55">
            <li><Link href="/#why" className="hover:text-white">為什麼</Link></li>
            <li><Link href="/#design" className="hover:text-white">設計</Link></li>
            <li><Link href="/#inside" className="hover:text-white">結構</Link></li>
          </ul>
          <ul className="space-y-3 text-white/55">
            <li><Link href="/blog" className="hover:text-white">文章</Link></li>
            <li><Link href="/game" className="hover:text-white">小遊戲</Link></li>
            <li><Link href="/#faq" className="hover:text-white">常見問題</Link></li>
            <li><Link href="/#waitlist" className="hover:text-white">搶先登記</Link></li>
          </ul>
        </nav>
        <p className="max-w-xs text-sm leading-relaxed text-white/40 sm:col-span-2 lg:col-span-1">
          網站圖片為概念示意，實際規格以量產版本為準。
          <br />© 2026 DEALSTORM 牌暴
        </p>
      </div>
    </footer>
  );
}

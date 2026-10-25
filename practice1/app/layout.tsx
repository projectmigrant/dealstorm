import type { Metadata } from "next";
import { Chakra_Petch, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import BackgroundGlow from "./components/BackgroundGlow";
import LuckyDraw from "./components/LuckyDraw";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import VisitorProvider from "./components/VisitorProvider";

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const noto = Noto_Sans_TC({
  variable: "--font-noto",
  weight: ["400", "500", "700", "900"],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "DEALSTORM 牌暴｜不傷卡的電競風洗牌機",
    template: "%s｜DEALSTORM 牌暴",
  },
  description:
    "卡牌界的自動麻將機。有牌套、無牌套都能洗，一鍵捲起牌暴，開局不用等。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${chakra.variable} ${noto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip">
        <VisitorProvider>
          <BackgroundGlow />
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <LuckyDraw />
        </VisitorProvider>
      </body>
    </html>
  );
}

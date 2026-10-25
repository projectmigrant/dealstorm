import type { StaticImageData } from "next/image";

import tableShot from "@/public/images/實體圖片/AaFyVOFoIY6FeI5NCBWa4g-AaFyVOFoy5nwOj75ZKRmvQ.jpg";
import topShot from "@/public/images/實體圖片/AaFyVPh_UeuclyRR2m9WZA-AaFyVPh_gjAMbOkzNjR9Pw.jpg";
import angleShot from "@/public/images/實體圖片/AaFyVNA_hAiXcVaQY1SgpA-AaFyVNA_DhS9zh2Wl0HAgg.jpg";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  cover: StaticImageData;
  coverAlt: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "why-sleeved-cards",
    title: "有牌套的卡，為什麼總是最難洗？",
    excerpt:
      "牌套保護了卡，卻讓洗牌變成苦差事。我們從這個小困擾出發，想做一台不用拆套的洗牌機。",
    category: "品牌故事",
    date: "2026-10-20",
    readMinutes: 4,
    cover: angleShot,
    coverAlt: "牌暴斜側視角，牌槽裡放著套上牌套的卡",
    body: [
      {
        type: "p",
        text: "每個常開團的玩家，大概都有過這種時刻：牌庫構築遊戲打到一半，棄牌堆疊成一大落，大家停下來等你洗牌。你小心翼翼地分疊、交錯，深怕卡角折到、牌套刮花，結果洗了半天還是不太放心。",
      },
      { type: "h2", text: "牌套是保護，也是負擔" },
      {
        type: "p",
        text: "替卡片套上牌套，是愛惜卡的基本功。但牌套讓整疊卡變厚、變滑，也更容易在洗牌時互相卡住。手洗時要更用力，用力就更容易折角；而許多一般洗牌機設計時想的是撲克牌，放進有牌套的卡不一定順。",
      },
      {
        type: "quote",
        text: "我們想要的很簡單：有牌套、無牌套都能洗，而且不傷卡。",
      },
      { type: "h2", text: "從「自動麻將機」得到的靈感" },
      {
        type: "p",
        text: "麻將桌早就把洗牌交給機器了，沒有人會懷念手搓麻將的時代。牌暴想把同樣的體驗帶到卡牌桌上：放進卡、按下 START，大家倒杯飲料的時間，牌庫就準備好了。",
      },
      { type: "h2", text: "我們現在在做什麼" },
      {
        type: "ul",
        items: [
          "整理市面上的洗牌機，確認哪些能洗有牌套的卡",
          "請常開團的玩家分享洗牌困擾與在意的地方",
          "拿到樣機後實測：會不會傷卡、洗得夠不夠亂、速度如何",
        ],
      },
      {
        type: "p",
        text: "牌暴目前還在概念與測試階段，網站上的圖片都是概念示意。如果你也受夠了手洗，歡迎加入搶先名單，你的回答會直接影響最後的規格。",
      },
    ],
  },
  {
    slug: "how-random-is-random",
    title: "洗得夠亂，到底要多亂？",
    excerpt:
      "洗牌不只是把卡弄散。聊聊手洗為什麼常常不夠亂，以及大牌庫為什麼更需要好好洗。",
    category: "洗牌知識",
    date: "2026-10-22",
    readMinutes: 5,
    cover: topShot,
    coverAlt: "俯視牌暴的三個牌槽，左右兩疊往中間洗入",
    body: [
      {
        type: "p",
        text: "「這局牌好像有點怪？」只要上過桌，大概都聽過這句話。洗不夠亂，最直接的影響就是公平感：同一組 combo 連續兩局黏在一起，誰都會起疑。",
      },
      { type: "h2", text: "隨機，比想像中難" },
      {
        type: "p",
        text: "數學家研究過撲克牌的洗牌方式。一個常被引用的結論是：一副 52 張的牌，用交錯式洗法（riffle shuffle）大約要洗 7 次，順序才會接近真正隨機。而很多人習慣的「上手洗」（從一疊抽一小疊放到另一邊），需要的次數多得多。",
      },
      {
        type: "p",
        text: "換句話說，大部分人在牌桌上隨手洗的那兩三下，其實遠遠不夠。",
      },
      { type: "h2", text: "牌越多，越難洗乾淨" },
      {
        type: "p",
        text: "桌遊和集換式卡牌的牌庫，常常比一副撲克牌多出好幾倍。張數越多，要洗到均勻需要的功夫也越多；再加上牌套讓卡變滑變厚，交錯式洗法更難操作，玩家往往只能退回效率最差的洗法。",
      },
      { type: "h2", text: "我們怎麼看「夠亂」" },
      {
        type: "ul",
        items: [
          "不會讓相鄰的卡一直黏在一起",
          "每次洗完的結果，不會跟洗之前的順序有明顯關聯",
          "大牌庫也能在合理時間內洗完，不拖慢遊戲節奏",
        ],
      },
      {
        type: "p",
        text: "牌暴的洗亂程度還在實測中，我們會用實際的卡與牌套測試，結果出來後會整理成文章公開。比起喊一個好聽的數字，我們更想給你可以檢驗的結果。",
      },
    ],
  },
  {
    slug: "game-night-setup",
    title: "開團前 10 分鐘：讓桌遊夜更順的 5 個準備",
    excerpt:
      "人還沒到齊，就先把最花時間的事處理好。從整理卡片到安排座位，這份清單讓開局快一點。",
    category: "開團指南",
    date: "2026-10-24",
    readMinutes: 4,
    cover: tableShot,
    coverAlt: "桌遊夜的桌面，牌暴放在中間，周圍有骰子與卡牌",
    body: [
      {
        type: "p",
        text: "一場好的桌遊夜，常常輸在開局前的那半小時：規則還沒講完、卡還沒洗好、零件散落一桌。下面是我們自己開團時的準備清單，提早十分鐘做完，大家一到就能開打。",
      },
      { type: "h2", text: "1. 先決定今晚的第一款遊戲" },
      {
        type: "p",
        text: "依照人數和大家的熟悉度挑好第一款，把盒子放在桌子正中央。猶豫不決最浪費時間。",
      },
      { type: "h2", text: "2. 把零件分裝好" },
      {
        type: "p",
        text: "用小盒或夾鏈袋把每位玩家的起始物件先分好，發下去就能直接用。",
      },
      { type: "h2", text: "3. 牌庫先洗好" },
      {
        type: "p",
        text: "牌庫是最花時間的部分，尤其是幾百張的大牌庫。趁大家還在路上先洗好，或交給洗牌機處理，就不用在開局時讓所有人等你一個。",
      },
      { type: "h2", text: "4. 準備一份三分鐘規則說明" },
      {
        type: "ul",
        items: [
          "這個遊戲怎麼贏",
          "每回合可以做哪幾件事",
          "最常被忘記的一條規則",
        ],
      },
      { type: "h2", text: "5. 留一個放飲料的地方" },
      {
        type: "p",
        text: "桌邊放個小邊桌或杯墊區，讓飲料遠離卡片。愛惜卡的人都懂，這比什麼牌套都重要。",
      },
      {
        type: "quote",
        text: "準備做得好，開局就快；開局快，大家就能多玩一局。",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

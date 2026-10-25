"use client";

import { useRef, useState } from "react";

const deckSizes = ["100 張以下", "100–200 張", "200–300 張", "300 張以上"];
const sleeveOptions = ["全部有牌套", "部分有牌套", "全部無牌套"];

const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// 常見的網域打錯字
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "yahoo.com.t": "yahoo.com.tw",
  "yaho.com.tw": "yahoo.com.tw",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
};

function validateEmail(value: string): string {
  const email = value.trim();
  if (!email) return "請輸入 Email。";
  if (/\s/.test(email)) return "Email 裡不能有空白。";
  if (!email.includes("@")) return "Email 少了「@」，例如 you@example.com。";
  if (!EMAIL_PATTERN.test(email)) return "Email 格式不正確，請再檢查一次。";
  return "";
}

function suggestEmail(value: string): string | null {
  const [user, domain] = value.trim().toLowerCase().split("@");
  if (!user || !domain) return null;
  const fixed = DOMAIN_TYPOS[domain];
  return fixed ? `${user}@${fixed}` : null;
}

export default function WaitlistForm() {
  const [sent, setSent] = useState(false);
  const [deck, setDeck] = useState(deckSizes[1]);
  const [sleeve, setSleeve] = useState(sleeveOptions[0]);
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const error = touched ? validateEmail(email) : "";
  const suggestion = !error && touched ? suggestEmail(email) : null;

  if (sent) {
    return (
      <div className="rgb-border rounded-2xl bg-ink-2/80 p-10 text-center">
        <p className="font-display text-sm tracking-[0.3em] text-cyan">
          YOU&apos;RE IN
        </p>
        <p className="mt-4 text-2xl font-bold text-white">名單登記完成</p>
        <p className="mt-3 text-white/60">
          開放預購前，我們會先寄信給你。
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (validateEmail(email)) {
          emailRef.current?.focus();
          return;
        }
        // TODO: 串接問卷或資料庫，目前只在畫面上顯示完成
        setSent(true);
      }}
      className="rgb-border rounded-2xl bg-ink-2/80 p-6 backdrop-blur sm:p-8"
    >
      <fieldset>
        <legend className="text-sm text-white/60">你一次大概洗幾張卡？</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {deckSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setDeck(size)}
              className={`rounded-lg border px-3 py-2.5 text-sm transition ${
                deck === size
                  ? "border-indigo bg-indigo/20 text-white"
                  : "border-line text-white/60 hover:border-white/25"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-sm text-white/60">你的卡有套牌套嗎？</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {sleeveOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSleeve(option)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                sleeve === option
                  ? "border-violet bg-violet/20 text-white"
                  : "border-line text-white/60 hover:border-white/25"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="waitlist-email" className="text-sm text-white/60">
          Email
        </label>
        <input
          ref={emailRef}
          id="waitlist-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="you@example.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "waitlist-email-error" : undefined}
          className={`mt-3 w-full rounded-lg border bg-ink px-4 py-3 text-white outline-none placeholder:text-white/25 ${
            error
              ? "border-rose-400 focus:border-rose-400"
              : touched && email
                ? "border-cyan/60 focus:border-cyan"
                : "border-line focus:border-cyan"
          }`}
        />
        {error && (
          <p id="waitlist-email-error" role="alert" className="mt-2 text-sm text-rose-400">
            {error}
          </p>
        )}
        {suggestion && (
          <p className="mt-2 text-sm text-white/60">
            你是不是要輸入{" "}
            <button
              type="button"
              onClick={() => setEmail(suggestion)}
              className="text-cyan underline underline-offset-4"
            >
              {suggestion}
            </button>
            ？
          </p>
        )}
      </div>

      <button
        type="submit"
        className="rgb-bg animate-sweep mt-8 w-full rounded-lg py-3.5 font-bold text-white shadow-[0_0_30px_rgb(99_102_241/0.45)] transition hover:shadow-[0_0_45px_rgb(168_85_247/0.6)]"
      >
        加入搶先名單
      </button>
      <p className="mt-3 text-center text-xs text-white/40">
        不會寄廣告，只在開放預購時通知一次。
      </p>
    </form>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Reveal from "../components/Reveal";
import { formatDate, posts } from "../lib/posts";

export const metadata: Metadata = {
  title: "文章",
  description: "牌暴的品牌故事、洗牌知識與開團指南。",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="mx-auto max-w-7xl px-5 pb-28 pt-32 sm:px-8 lg:pb-36 lg:pt-40">
      <Reveal>
        <p className="font-display flex items-center gap-3 text-xs tracking-[0.35em] text-white/50">
          <span className="rgb-text font-bold">BLOG</span>
          <span className="h-px w-10 bg-white/20" />
          STORM NOTES
        </p>
        <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-6xl">
          牌桌上的<span className="rgb-text">小事</span>，
          <br className="sm:hidden" />
          我們認真寫。
        </h1>
      </Reveal>

      {/* 精選文章 */}
      <Reveal delay={100} className="mt-14 lg:mt-20">
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid overflow-hidden rounded-3xl border border-line bg-ink-2/60 md:grid-cols-2"
        >
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[420px]">
            <Image
              src={featured.cover}
              alt={featured.coverAlt}
              fill
              placeholder="blur"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <PostMeta category={featured.category} date={featured.date} minutes={featured.readMinutes} />
            <h2 className="mt-5 text-2xl font-black leading-snug text-white sm:text-3xl lg:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 leading-relaxed text-white/55">{featured.excerpt}</p>
            <span className="mt-8 inline-flex items-center gap-2 font-bold text-cyan">
              閱讀全文
              <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>
      </Reveal>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {rest.map((post, i) => (
          <Reveal key={post.slug} delay={150 + i * 100}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block h-full overflow-hidden rounded-3xl border border-line bg-ink-2/60 transition hover:border-white/20"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.cover}
                  alt={post.coverAlt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-7 sm:p-8">
                <PostMeta category={post.category} date={post.date} minutes={post.readMinutes} />
                <h2 className="mt-4 text-xl font-black leading-snug text-white sm:text-2xl">{post.title}</h2>
                <p className="mt-3 leading-relaxed text-white/55">{post.excerpt}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}

function PostMeta({ category, date, minutes }: { category: string; date: string; minutes: number }) {
  return (
    <p className="flex flex-wrap items-center gap-3 text-xs text-white/45">
      <span className="rounded-full border border-indigo/50 bg-indigo/15 px-3 py-1 text-white/80">{category}</span>
      <span className="font-display tracking-wider">{formatDate(date)}</span>
      <span>· {minutes} 分鐘閱讀</span>
    </p>
  );
}

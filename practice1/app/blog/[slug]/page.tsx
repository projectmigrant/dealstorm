import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Parallax from "../../components/Parallax";
import { formatDate, getPost, posts, type Block } from "../../lib/posts";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <main className="pb-28 pt-28 lg:pb-36 lg:pt-32">
      <Suspense fallback={<PostSkeleton />}>
        <PostContent params={params} />
      </Suspense>
    </main>
  );
}

function PostSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-3xl animate-pulse px-5 sm:px-8">
      <div className="h-4 w-20 rounded bg-white/10" />
      <div className="mt-10 h-10 w-4/5 rounded bg-white/10" />
      <div className="mt-4 h-5 w-3/5 rounded bg-white/10" />
      <div className="mt-12 aspect-[16/9] rounded-3xl bg-white/5" />
    </div>
  );
}

async function PostContent({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = posts.indexOf(post);
  const next = posts[(index + 1) % posts.length];

  return (
    <>
      <article>
        <header className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link href="/blog" className="text-sm text-white/50 transition hover:text-white">
            ← 所有文章
          </Link>
          <p className="mt-8 flex flex-wrap items-center gap-3 text-xs text-white/45">
            <span className="rounded-full border border-indigo/50 bg-indigo/15 px-3 py-1 text-white/80">
              {post.category}
            </span>
            <span className="font-display tracking-wider">{formatDate(post.date)}</span>
            <span>· {post.readMinutes} 分鐘閱讀</span>
          </p>
          <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">{post.excerpt}</p>
        </header>

        <div className="mx-auto mt-12 max-w-5xl px-5 sm:px-8">
          <div className="relative isolate aspect-[16/9] overflow-hidden rounded-3xl">
            <Parallax speed={0.08} className="absolute inset-0" innerClassName="absolute -inset-y-[15%] inset-x-0">
              <Image
                src={post.cover}
                alt={post.coverAlt}
                fill
                placeholder="blur"
                loading="eager"
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="object-cover"
              />
            </Parallax>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-2xl px-5 sm:px-8">
          {post.body.map((block, i) => (
            <PostBlock key={i} block={block} />
          ))}
        </div>
      </article>

      <aside className="mx-auto mt-20 max-w-3xl px-5 sm:px-8">
        <div className="rgb-border rounded-3xl bg-ink-2/70 p-7 sm:p-10">
          <p className="font-display text-xs tracking-[0.3em] text-cyan">EARLY ACCESS</p>
          <p className="mt-3 text-2xl font-black text-white">想第一個拿到牌暴？</p>
          <p className="mt-2 text-white/55">加入搶先名單，開放預購時我們會先通知你。</p>
          <Link
            href="/#waitlist"
            className="rgb-bg btn-shine mt-6 inline-block rounded-full px-6 py-3 font-bold text-white"
          >
            加入搶先名單
          </Link>
        </div>

        <Link href={`/blog/${next.slug}`} className="group mt-10 block border-t border-line pt-8">
          <p className="text-sm text-white/45">下一篇</p>
          <p className="mt-2 flex items-center justify-between gap-6 text-xl font-bold text-white sm:text-2xl">
            {next.title}
            <span className="text-cyan transition group-hover:translate-x-1">→</span>
          </p>
        </Link>
      </aside>
    </>
  );
}

function PostBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mb-4 mt-12 text-2xl font-black text-white">{block.text}</h2>;
    case "ul":
      return (
        <ul className="my-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 leading-relaxed text-white/70">
              <span className="rgb-bg mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-10 border-l-2 border-violet pl-6 text-xl font-bold leading-relaxed text-white sm:text-2xl">
          {block.text}
        </blockquote>
      );
    default:
      return <p className="my-5 text-[17px] leading-[1.95] text-white/70">{block.text}</p>;
  }
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { getAllSlugs, getPostBySlug, getAllPosts, type PostMeta } from "@/lib/posts";
import { useMDXComponents } from "@/mdx-components";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://finc.net.au";

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { meta } = post;
  const title = `${meta.title} | FINC HOME LOANS`;
  const description = meta.excerpt.slice(0, 155) || `${meta.category} — FINC HOME LOANS`;
  const url = `${SITE_URL}/news/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: meta.date || undefined,
      modifiedTime: meta.lastModified || meta.date || undefined,
      authors: ["Hayden Zhou"],
      siteName: "FINC HOME LOANS",
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

async function renderMDX(body: string) {
  try {
    const code = await compile(body, {
      outputFormat: "function-body",
      remarkPlugins: [remarkGfm],
    });
    const components = useMDXComponents({});
    const { default: Content } = await run(code, {
      ...(runtime as Parameters<typeof run>[1]),
      useMDXComponents: () => components,
    });
    return <Content components={components} />;
  } catch (err) {
    console.error("[renderMDX]", err);
    return (
      <div className="space-y-4">
        {body.split("\n\n").map((para, i) => (
          <p key={i} className="text-gray-700 leading-relaxed">
            {para.replace(/^#+\s/, "").trim()}
          </p>
        ))}
      </div>
    );
  }
}

function RelatedCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 hover:border-coral/20 transition-all duration-200 group"
    >
      {post.category && (
        <span className="text-xs font-medium text-coral bg-coral/10 rounded-full px-2.5 py-0.5 mb-2 inline-block">
          {post.category}
        </span>
      )}
      <h3 className="text-sm font-semibold text-navy leading-snug group-hover:text-coral transition-colors duration-150 line-clamp-2">
        {post.title}
      </h3>
      {post.date && (
        <p className="text-xs text-gray-400 mt-2">{formatDate(post.date)}</p>
      )}
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, body } = post;
  const content = await renderMDX(body);

  const allPosts = getAllPosts();
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const isDev = process.env.NODE_ENV === "development";
  const pageUrl = `${SITE_URL}/news/${slug}`;
  const isRateArticle = !!meta.updateFrequency;
  const displayDate = meta.lastModified || meta.date;

  const jsonLd = {
    "@context": "https://schema.org",
    // Use NewsArticle for regularly-updated rate pages, Article for evergreen content
    "@type": isRateArticle ? "NewsArticle" : "Article",
    headline: meta.title,
    description: meta.excerpt.slice(0, 155) || undefined,
    // MONTHLY UPDATE REMINDER: bump lastModified in frontmatter each time you update the rate table
    datePublished: meta.date || undefined,
    dateModified: meta.lastModified || meta.date || undefined,
    url: pageUrl,
    author: {
      "@type": "Person",
      name: "Hayden Zhou",
    },
    publisher: {
      "@type": "Organization",
      name: "FINC HOME LOANS",
      url: SITE_URL,
    },
    ...(meta.coverImage ? { image: meta.coverImage } : {}),
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
            <li>
              <Link href="/" className="hover:text-navy transition-colors">首页</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/news" className="hover:text-navy transition-colors">贷款资讯</Link>
            </li>
            <li>/</li>
            <li className="text-gray-600 truncate max-w-[200px] sm:max-w-none">{meta.title}</li>
          </ol>
        </div>
      </nav>

      {/* Cover image */}
      {meta.coverImage && (
        <div className="w-full h-56 sm:h-72 lg:h-80 overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={meta.coverImage} alt={meta.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-14 items-start">

          {/* ── Main article ── */}
          <article>
            <header className="mb-8 pb-6 border-b border-gray-100">
              {meta.category && (
                <span className="inline-block text-xs font-semibold text-coral bg-coral/10 rounded-full px-3 py-1 mb-4 tracking-wide">
                  {meta.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-4">
                {meta.title}
              </h1>

              {/* Update badge — shown on rate/regularly-updated articles */}
              {isRateArticle && (
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-coral text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    最后更新：{meta.lastModified
                      ? new Date(meta.lastModified).toLocaleDateString("zh-CN", { year: "numeric", month: "long" })
                      : "2025年6月"
                    } · 每月更新
                  </span>
                  {meta.dataSource && (
                    <span className="text-xs text-gray-400">
                      数据来源：{meta.dataSource}
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                {displayDate && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                      </svg>
                      {meta.lastModified ? (
                        <span>最后更新：<time dateTime={meta.lastModified}>{formatDate(meta.lastModified)}</time></span>
                      ) : (
                        <time dateTime={meta.date}>{formatDate(meta.date)}</time>
                      )}
                    </span>
                    <span>·</span>
                  </>
                )}
                <span>FINC HOME LOANS</span>
              </div>
            </header>

            {/* MDX body */}
            <div className="prose prose-lg max-w-none prose-headings:text-[#1A2B5E] prose-a:text-[#E8634A] prose-strong:text-[#1A2B5E] prose-headings:font-bold prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[#E8634A] prose-blockquote:text-gray-600 prose-li:text-gray-700 prose-p:text-gray-700">
              {content}
            </div>

            {/* Dev hint */}
            {isDev && (
              <div className="mt-12 p-5 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                <p className="font-semibold text-amber-800 mb-2">🛠 开发提示（仅开发环境可见）</p>
                <p className="text-amber-700 mb-1 font-mono">在 MDX 文章中插入还款计算器：<code className="bg-amber-100 px-1.5 py-0.5 rounded">&lt;RepaymentCalculator /&gt;</code></p>
                <p className="text-amber-700 font-mono">插入印花税计算器：<code className="bg-amber-100 px-1.5 py-0.5 rounded">&lt;StampDutyCalculator /&gt;</code></p>
              </div>
            )}
          </article>

          {/* ── Sidebar ── */}
          <aside className="mt-10 lg:mt-0 space-y-6 lg:sticky lg:top-24">
            <div className="bg-navy rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-base mb-2">有贷款相关疑问？</h3>
              <p className="text-white/60 text-sm mb-5 leading-relaxed">
                专业经纪中文一对一解答，比较 40+ 家机构，免费评估您的贷款方案。
              </p>
              <Link
                href="/contact"
                className="block bg-coral hover:bg-coral/90 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg"
              >
                免费预约咨询 →
              </Link>
              <a
                href="tel:+61451827455"
                className="flex items-center justify-center gap-1.5 mt-4 text-white/50 hover:text-white/80 text-xs transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                0451 827 455
              </a>
            </div>

            <Link
              href="/news"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-navy transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              返回资讯列表
            </Link>
          </aside>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-14 pt-10 border-t border-gray-100">
            <h2 className="text-lg font-bold text-navy mb-6">相关文章</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((p) => (
                <RelatedCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

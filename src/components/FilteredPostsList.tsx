"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

// ── Filter tab definitions ────────────────────────────────────────────────────

const TABS = [
  { label: "全部",   match: (_p: PostMeta) => true },
  {
    label: "首次购房",
    match: (p: PostMeta) =>
      p.category === "购房政策" ||
      p.title.includes("首次") ||
      p.title.includes("first home"),
  },
  {
    label: "投资置业",
    match: (p: PostMeta) =>
      p.category === "商业贷款" ||
      p.title.includes("投资") ||
      p.title.includes("出租") ||
      p.title.includes("investment"),
  },
  {
    label: "转贷省钱",
    match: (p: PostMeta) =>
      p.title.includes("转贷") ||
      p.title.includes("refinanc") ||
      p.title.includes("利率") ||
      p.title.includes("节省"),
  },
  {
    label: "贷款知识",
    match: (p: PostMeta) =>
      ["房贷知识", "税务知识", "贷款工具"].includes(p.category) ||
      p.title.includes("什么是") ||
      p.title.includes("如何"),
  },
  {
    label: "利率政策",
    match: (p: PostMeta) =>
      ["房贷资讯", "购房政策"].includes(p.category),
  },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryBadge({ label }: { label: string }) {
  if (!label) return null;
  return (
    <span className="inline-block text-xs font-medium text-coral bg-coral/10 rounded-full px-2.5 py-0.5 shrink-0">
      {label}
    </span>
  );
}

function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden group h-full">
      <div className="p-6 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <CategoryBadge label={post.category} />
          {post.date && (
            <time className="text-xs text-gray-400 shrink-0">{formatDate(post.date)}</time>
          )}
        </div>

        {/* Title — max 2 lines */}
        <h2 className="text-base font-semibold text-navy leading-snug mb-3 line-clamp-2 group-hover:text-coral transition-colors duration-150">
          {post.title}
        </h2>

        {/* Excerpt — max 3 lines, flex-1 so cards align at bottom */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-4">
          {post.excerpt}
        </p>

        {/* CTA always at bottom */}
        <Link
          href={`/news/${post.slug}`}
          className="inline-flex items-center gap-1 text-coral text-sm font-semibold mt-auto group-hover:gap-2 transition-all duration-150"
        >
          阅读更多
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FilteredPostsList({ posts }: { posts: PostMeta[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const initialTab = categoryParam
    ? Math.max(0, TABS.findIndex((t) => t.label === categoryParam))
    : 0;
  const [activeTab, setActiveTab] = useState(initialTab);

  const visible = posts.filter(TABS[activeTab].match);

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(i)}
            className={[
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border",
              i === activeTab
                ? "bg-coral text-white border-coral shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-coral/40 hover:text-coral",
            ].join(" ")}
          >
            {tab.label}
            {i > 0 && (
              <span className={[
                "ml-1.5 text-xs rounded-full px-1.5",
                i === activeTab ? "bg-white/25 text-white" : "bg-gray-100 text-gray-400",
              ].join(" ")}>
                {posts.filter(tab.match).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-1">暂无相关文章</p>
          <button
            className="text-sm text-coral underline underline-offset-2 mt-2"
            onClick={() => setActiveTab(0)}
          >
            查看全部文章
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}

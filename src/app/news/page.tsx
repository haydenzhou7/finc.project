import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import FilteredPostsList from "@/components/FilteredPostsList";

export default function NewsPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-coral text-sm font-semibold tracking-widest uppercase mb-3">
            FINC · 资讯中心
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            贷款资讯
          </h1>
          <p className="text-white/65 text-base sm:text-lg max-w-xl mx-auto">
            澳洲房贷最新资讯、政策解读与实用指南
          </p>
        </div>
      </section>

      {/* Posts grid with filter tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-20">暂无文章，敬请期待。</p>
        ) : (
          <FilteredPostsList posts={posts} />
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-warm-white border-t border-gray-100 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3">
            还有疑问？直接问我们
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            超过 40 家银行与非银行机构合作，中文全程跟进，免费为您评估贷款方案。
          </p>
          <Link
            href="/contact"
            className="inline-block bg-coral hover:bg-coral/90 text-white px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 shadow-lg"
          >
            免费预约咨询 →
          </Link>
        </div>
      </section>
    </>
  );
}

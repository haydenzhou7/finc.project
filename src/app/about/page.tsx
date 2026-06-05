import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于我们 | FINC HOME LOANS - 澳洲华人房贷经纪",
  description:
    "FINC HOME LOANS 专注服务澳洲华人社区，提供全程中文房贷咨询服务，比较超过40家贷款机构，帮您找到最合适的房贷方案。",
};

const promises = [
  {
    emoji: "🗣",
    title: "中文全程服务",
    body: "全程普通话沟通，复杂的金融术语我们用你听得懂的方式解释清楚。",
  },
  {
    emoji: "🏦",
    title: "真正独立比较",
    body: "与超过 40 家银行和非银行贷款机构合作，我们的目标是为你找到最合适的方案，而不是推销特定产品。",
  },
  {
    emoji: "💰",
    title: "服务完全免费",
    body: "作为持牌贷款经纪人，我们的服务对客户完全免费——佣金由贷款机构支付，不增加你的任何成本。",
  },
];

const audiences = [
  { emoji: "🏠", label: "首次在澳购房的新移民" },
  { emoji: "📈", label: "希望扩大投资组合的投资者" },
  { emoji: "🔄", label: "想要转贷节省利息的房主" },
  { emoji: "🌏", label: "海外人士或非居民买家" },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-coral text-sm font-semibold tracking-widest uppercase mb-4">
            FINC HOME LOANS
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            关于 FINC HOME LOANS
          </h1>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            我们相信，每一个在澳洲的华人家庭，都值得获得专业、透明的房贷建议。
          </p>
        </div>
      </section>

      {/* ── Brand story ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-8">FINC 的故事</h2>
          <div className="space-y-5 text-gray-600 leading-relaxed text-base sm:text-lg">
            <p>
              FINC 这个名字来自大学里的一门课程代码——<strong className="text-navy">FINC</strong>，金融学。
              正是那段时间对金融世界的探索，让我们意识到，澳洲华人社区在房贷领域面临的最大障碍，往往不是资金，而是信息差。
            </p>
            <p>
              语言的壁垒、复杂的银行术语、难以比较的产品条款……
              太多华人家庭因为信息不对称，错过了更好的贷款方案，或者在不了解的情况下做出了重要决定。
            </p>
            <p className="font-medium text-navy">
              FINC 的存在，就是为了填补这个缺口。
            </p>
          </div>
        </div>
      </section>

      {/* ── Our promises ── */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy text-center mb-12">
            我们的承诺
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {promises.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-8 flex flex-col items-center text-center"
              >
                <span className="text-4xl mb-4">{p.emoji}</span>
                <h3 className="font-bold text-navy text-base mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Audiences ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy text-center mb-4">
            我们最了解这些客户
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10">
            无论你处于购房旅程的哪个阶段，我们都有经验为你提供支持。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {audiences.map((a) => (
              <div
                key={a.label}
                className="bg-warm-white rounded-2xl border border-gray-100 px-4 py-6 flex flex-col items-center text-center gap-3"
              >
                <span className="text-3xl">{a.emoji}</span>
                <p className="text-navy font-medium text-sm leading-snug">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            本网站提供的信息仅供一般参考，不构成财务建议。
            贷款申请资格及条款以贷款机构最终审批为准。
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-navy py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            有任何问题？我们很乐意帮助。
          </h2>
          <p className="text-white/60 text-sm mb-8">
            不管你是刚开始了解贷款，还是已经准备好申请，都欢迎与我们免费聊聊。
          </p>
          <Link
            href="/contact"
            className="inline-block bg-coral hover:bg-coral/90 text-white px-10 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-lg"
          >
            免费咨询 →
          </Link>
        </div>
      </section>
    </>
  );
}

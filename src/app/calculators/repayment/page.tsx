import type { Metadata } from "next";
import Link from "next/link";
import RepaymentCalculator from "@/components/calculators/RepaymentCalculator";

export const metadata: Metadata = {
  title: "还款计算器 | FINC HOME LOANS",
  description:
    "澳洲房贷还款计算器，输入贷款金额、年利率和年限，即时估算每月/每两周/每周还款额、总利息支出，支持本息还款与仅还利息模式。",
};

const repaymentFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "目前澳洲房贷利率是多少？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2025年澳洲主流银行浮动利率约在6%-7%之间，固定利率因期限不同有所差异。各人实际利率取决于贷款金额、LVR、收入状况及贷款机构政策。建议咨询经纪人获取最新个人化利率报价。",
      },
    },
    {
      "@type": "Question",
      name: "贷款年限越长越好吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年限越长月供越低，但总利息支出越高。30年是最常见选择，建议根据自身现金流情况选择。同时可通过额外还款缩短实际还款期，灵活降低利息支出。",
      },
    },
    {
      "@type": "Question",
      name: "每两周还款和每月还款有什么区别？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "选择每两周还款（Fortnightly）而非每月还款，每年实际多还一个月的本金（26个两周 = 13个月），可提前约4-5年还清30年期贷款，节省数万澳元利息。",
      },
    },
    {
      "@type": "Question",
      name: "仅还利息贷款适合哪类买家？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "仅还利息（Interest Only）贷款在还息期间月供较低，常见于投资房贷款，投资者可保留更多现金流用于其他投资或负扣税规划。但需注意利息期（最长10年）结束后月供会显著增加，因为本金需在剩余年限内摊还。",
      },
    },
  ],
};

export default function RepaymentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(repaymentFaqSchema) }}
      />

      {/* ── Hero ── */}
      <section className="bg-navy py-14 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <span className="inline-flex items-center bg-coral/10 border border-coral/30 text-coral rounded-full px-5 py-2 text-sm font-medium mb-5">
            快速估算
          </span>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3">
            还款计算器
          </h1>
          <p className="text-white/60 text-base sm:text-lg">
            输入贷款金额、年利率和年限，即时估算每月还款额与总利息支出
          </p>
        </div>
      </section>

      {/* ── Rate reference link ── */}
      <div className="bg-navy/5 border-b border-navy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm">
          <span className="text-gray-500">参考当前市场利率：</span>
          <Link
            href="/news/australia-mortgage-rates"
            className="text-coral font-medium hover:underline inline-flex items-center gap-1"
          >
            查看最新各银行利率
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Calculator ── */}
      <section className="bg-warm-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RepaymentCalculator />
        </div>
      </section>

      {/* ── SEO Content ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div>
          <h2 className="text-xl font-bold text-navy mb-3">如何使用还款计算器？</h2>
          <p className="text-gray-600 leading-relaxed">
            输入贷款金额、年利率和贷款年限，即可实时计算每月、每两周或每周的还款金额，以及总利息支出。建议以目前市场利率 6%–7% 作为参考基准，同时对比不同还款频率与还款方式（本息 vs 仅息）下的差异，找到最适合自己现金流的方案。
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy mb-3">每两周还款 vs 每月还款</h2>
          <p className="text-gray-600 leading-relaxed">
            选择每两周还款（Fortnightly）而非每月还款是一个简单却有效的省息技巧。每年有 26 个两周，相当于多还了一个月的本金，长期积累下来可提前约 4–5 年还清 30 年期贷款，节省数万澳元利息。在计算器中切换「每两周」选项即可看到差异。
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy mb-3">仅还利息贷款适合谁？</h2>
          <p className="text-gray-600 leading-relaxed">
            仅还利息（Interest Only）贷款在还息期间月供较低，因为不需归还本金，常见于投资房贷款策略中。投资者可借此保留更多现金流用于其他投资或负扣税（Negative Gearing）规划。但需注意：澳洲银行一般最长提供 10 年的仅息期，期满后需转为本息还款，月供会显著上升。
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-navy mb-8">常见问题</h2>
          <dl className="space-y-6">
            {repaymentFaqSchema.mainEntity.map((item) => (
              <div key={item.name} className="bg-white rounded-xl border border-gray-100 px-6 py-5">
                <dt className="font-semibold text-navy mb-2">{item.name}</dt>
                <dd className="text-gray-600 text-sm leading-relaxed">{item.acceptedAnswer.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}

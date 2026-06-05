import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import {
  MessageCircle,
  Building2,
  BadgeCheck,
  Zap,
  Home,
  TrendingUp,
  RefreshCw,
  Key,
  Briefcase,
  Globe,
  HardHat,
  Landmark,
  ArrowLeftRight,
  User,
  Car,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: MessageCircle,
    title: "中文全程服务",
    description: "从咨询到放款，全程中文普通话沟通，无语言障碍",
  },
  {
    icon: Building2,
    title: "40+ 家贷款机构",
    description: "比较超过40家银行和非银行机构，为您找到最优方案",
  },
  {
    icon: BadgeCheck,
    title: "经纪服务免费",
    description: "我们的服务对您完全免费，佣金由贷款机构支付",
  },
  {
    icon: Zap,
    title: "高效专业处理",
    description: "丰富的申请经验，提高批准率，加快放款速度",
  },
];

const services: { title: string; subtitle: string; icon: LucideIcon }[] = [
  { title: "住房贷款", subtitle: "Home Loans", icon: Home },
  { title: "投资贷款", subtitle: "Investment Loans", icon: TrendingUp },
  { title: "转贷", subtitle: "Refinance", icon: RefreshCw },
  { title: "首次购房者", subtitle: "First Home Buyers", icon: Key },
  { title: "自雇贷款", subtitle: "Self-Employed Loans", icon: Briefcase },
  { title: "非居民贷款", subtitle: "Non-Resident Loans", icon: Globe },
  { title: "商业贷款", subtitle: "Commercial Loans", icon: Building2 },
  { title: "建筑贷款", subtitle: "Construction Loans", icon: HardHat },
  { title: "开发贷款", subtitle: "Development Loans", icon: Landmark },
  { title: "过桥贷款", subtitle: "Bridging Loans", icon: ArrowLeftRight },
  { title: "个人贷款", subtitle: "Personal Loans", icon: User },
  { title: "车贷", subtitle: "Car Loans", icon: Car },
];

const steps = [
  {
    number: "1",
    title: "免费咨询",
    description: "告诉我们您的需求和财务状况，完全保密，无任何义务",
  },
  {
    number: "2",
    title: "方案评估",
    description: "我们比较40+家机构，为您筛选最适合的贷款产品和利率",
  },
  {
    number: "3",
    title: "提交申请",
    description: "协助您准备完整申请材料，提高批准率，全程跟进进度",
  },
  {
    number: "4",
    title: "成功放款",
    description: "贷款批准后协助完成交割，资金到位，助您实现置业目标",
  },
];

const banks = [
  "Commonwealth Bank",
  "ANZ",
  "Westpac",
  "NAB",
  "Macquarie",
  "ING",
  "St.George",
  "Bank of Melbourne",
  "Suncorp",
  "AMP",
  "Pepper Money",
  "Liberty",
];

const testimonials = [
  {
    text: "团队非常专业，帮我找到了利率最低的贷款方案，全程中文沟通，省去了很多麻烦。非常感谢！",
    author: "张女士",
    location: "悉尼",
  },
  {
    text: "The entire process was very smooth. The broker patiently answered all my questions and ultimately tailored the perfect loan plan for me.",
    author: "Mr. Leung",
    location: "Melbourne",
  },
  {
    text: "他们的服务让我印象深刻，响应迅速，信息透明，帮我顺利完成了贷款申请，非常值得信赖！",
    author: "赵先生",
    location: "布里斯班",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

const homeFaqs = [
  {
    q: "房贷经纪的服务收费吗？",
    a: "完全免费。我们作为持牌贷款经纪人，佣金由贷款机构支付，客户无需支付任何费用。",
  },
  {
    q: "我是新移民/PR，可以申请房贷吗？",
    a: "可以。澳洲永久居民（PR）享有与公民相同的贷款权利。持临时签证或海外人士也有贷款选项，但条件和利率会有所不同，建议咨询我们了解具体情况。",
  },
  {
    q: "贷款申请需要准备哪些材料？",
    a: "一般包括：身份证明（护照/驾照）、收入证明（工资单/税单/BAS）、银行流水（3-6个月）、现有资产和负债证明。自雇人士材料略有不同。",
  },
  {
    q: "从咨询到批款大概需要多久？",
    a: "通常2-4周。预批（Pre-approval）一般3-5个工作日，正式批款视银行处理速度而定。",
  },
  {
    q: "什么是LVR？会影响我的贷款吗？",
    a: "LVR（Loan to Value Ratio）即贷款价值比，是贷款金额占房产价值的百分比。LVR超过80%通常需要购买贷款保险（LMI），会增加贷款成本。",
  },
  {
    q: "固定利率和浮动利率哪个更好？",
    a: "各有优劣。固定利率提供还款确定性，适合预算规划；浮动利率更灵活，可随时额外还款。具体建议视您的财务状况和市场预期而定。",
  },
];

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function HomeFaq() {
  return (
    <section className="bg-warm-white py-14 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy text-center mb-10">
          常见问题
        </h2>
        <FaqAccordion items={homeFaqs} />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-navy overflow-hidden min-h-screen flex flex-col justify-center md:block md:min-h-0">
        {/* Decorative rings */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full border border-white/5" />
          <div className="absolute -right-60 top-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/5" />
          <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex items-baseline select-none">
            <span className="text-white/[0.04] font-bold tracking-widest leading-none text-[160px]">
              FINC
            </span>
            <span className="text-coral/10 font-bold leading-none text-[160px]">
              .
            </span>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-xl mx-auto md:mx-0 text-center md:text-left">
            {/* Tag */}
            <span className="inline-flex items-center bg-coral/10 border border-coral/30 text-coral rounded-full px-5 py-2 text-sm font-medium mb-8">
              澳洲华人房贷经纪 · 超过40家合作贷款机构
            </span>

            <h1 className="text-white text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] mb-5">
              找到最适合您的
              <br />
              贷款方案
            </h1>

            <p className="text-coral text-xl sm:text-2xl font-medium mb-6">
              专业服务，中文沟通
            </p>

            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
              无论您是首次购房、投资置业还是转贷重组，FINC
              的专业团队将为您量身定制最优贷款方案。与超过40家银行和非银行贷款机构合作，确保您获得最优利率。
            </p>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
              <Link
                href="/contact"
                className="bg-coral hover:bg-coral/90 text-white px-8 py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg w-full md:w-auto text-center"
              >
                立即免费咨询
              </Link>
              <Link
                href="/services"
                className="border-2 border-white/40 hover:border-white/80 text-white px-8 py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-white/5 w-full md:w-auto text-center"
              >
                了解我们的服务
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Stats ─────────────────────────────────────────────────────────── */}
      <section className="bg-warm-white py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {[
              { number: "700+", label: "服务客户", sublabel: "Clients" },
              {
                number: "1,100+",
                label: "成功案例",
                sublabel: "Cases Settled",
              },
              {
                number: "5年+",
                label: "专业经验",
                sublabel: "Years of Experience",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-6 sm:py-10 px-4">
                <div className="text-5xl sm:text-6xl font-bold text-navy leading-none mb-3">
                  {stat.number}
                </div>
                <div className="text-gray-800 font-medium text-sm sm:text-base">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm mt-0.5">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Why FINC ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-8 sm:mb-14">
            为什么选择 <span className="text-coral">FINC</span>？
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-gray-50 rounded-2xl p-7 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="mb-4">
                    <Icon size={32} color="#E8634A" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-navy font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Services ──────────────────────────────────────────────────────── */}
      <section className="bg-warm-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
              我们的贷款业务
            </h2>
            <p className="text-gray-500 text-lg">覆盖您在澳洲的各类贷款需求</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-default"
                >
                  {/* Orange top bar — reveals on hover */}
                  <div className="h-[3px] bg-coral opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="py-5 px-4 text-center">
                    <div className="mb-3 flex justify-center">
                      <Icon
                        size={24}
                        strokeWidth={1.5}
                        className="text-navy group-hover:text-coral transition-colors duration-200"
                      />
                    </div>
                    <h3 className="font-semibold text-navy text-base mb-0.5">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs">{service.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Process Steps ─────────────────────────────────────────────────── */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-10 sm:mb-16">
            简单4步，轻松获贷
          </h2>

          <div className="relative">
            {/* Connector line (desktop only) */}
            <div
              className="absolute top-8 h-px bg-gray-200 hidden md:block"
              style={{ left: "12.5%", right: "12.5%" }}
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center relative"
                >
                  <div className="w-16 h-16 rounded-full bg-coral text-white flex items-center justify-center text-2xl font-bold mb-5 relative z-10 shrink-0 shadow-md">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-navy text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Partner Banks ─────────────────────────────────────────────────── */}
      <section className="bg-warm-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-8 sm:mb-12">
            我们的合作贷款机构
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {banks.map((bank) => (
              <div
                key={bank}
                className="bg-white rounded-xl py-5 px-4 flex items-center justify-center border border-gray-200 hover:border-coral transition-all duration-200 cursor-default shadow-sm hover:shadow-md group"
              >
                <span className="font-bold text-navy text-xs sm:text-sm text-center leading-snug group-hover:text-coral transition-colors duration-200">
                  {bank}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6b. Rate Quick-Entry Banner ──────────────────────────────────────── */}
      {/* MONTHLY UPDATE: change the rate numbers below each month */}
      <section className="bg-navy/5 border-y border-navy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/news/australia-mortgage-rates"
            className="flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl shrink-0">📊</span>
              <p className="text-sm text-navy font-medium truncate">
                <span className="font-semibold">2025年6月最新利率</span>
                <span className="text-gray-500 hidden sm:inline"> — CBA 5.74% 起，Westpac 5.69% 起，Macquarie 5.59% 起</span>
              </p>
            </div>
            <span className="shrink-0 text-sm text-coral font-semibold group-hover:underline whitespace-nowrap">
              查看全部利率 →
            </span>
          </Link>
        </div>
      </section>

      {/* ── 7. Testimonials ──────────────────────────────────────────────────── */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-8 sm:mb-12">
            客户真实评价
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-gray-50 rounded-2xl p-7 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-coral text-lg leading-none">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">
                  「{t.text}」
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-navy text-sm">
                    —— {t.author}
                  </span>
                  <span className="text-gray-400 text-xs">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ───────────────────────────────────────────────────────────── */}
      <HomeFaq />

      {/* ── 9. Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="bg-navy py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                准备好开始了吗？
              </h2>
              <p className="text-white/60 text-lg">
                免费咨询，无任何义务，今天就迈出第一步。
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/contact"
                className="bg-coral hover:bg-coral/90 text-white px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg inline-flex items-center gap-2 whitespace-nowrap"
              >
                立即预约咨询 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

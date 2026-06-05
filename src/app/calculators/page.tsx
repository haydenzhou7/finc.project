import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "贷款计算器 | FINC HOME LOANS",
  description:
    "免费澳洲房贷计算工具：印花税计算器、还款计算器、借贷能力评估等，助您做出明智的财务决策。",
};

interface Calculator {
  title: string;
  description: string;
  href: string;
  available: boolean;
  icon: React.ReactNode;
  badge?: string;
}

function HouseIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function CalcIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  );
}

function ArrowsIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
    </svg>
  );
}

const CALCULATORS: Calculator[] = [
  {
    title: "印花税计算器",
    description: "计算澳洲各州购房印花税，含首次购房优惠和海外买家附加税。",
    href: "/calculators/stamp-duty",
    available: true,
    icon: <HouseIcon />,
  },
  {
    title: "还款计算器",
    description: "计算每月/每两周/每周还款额，支持本息还款和仅还利息模式。",
    href: "/calculators/repayment",
    available: true,
    icon: <CalcIcon />,
  },
  {
    title: "借贷能力计算器",
    description: "评估您的最高可贷款金额，根据收入、支出与利率综合测算。",
    href: "#",
    available: false,
    icon: <BankIcon />,
    badge: "即将推出",
  },
  {
    title: "转贷节省计算器",
    description: "计算转贷可节省的利息，找出更低利率的最佳时机。",
    href: "#",
    available: false,
    icon: <ArrowsIcon />,
    badge: "即将推出",
  },
  {
    title: "额外还款计算器",
    description: "提前还款能节省多少利息？看看每多还一点能带来多大改变。",
    href: "#",
    available: false,
    icon: <PlusCircleIcon />,
    badge: "即将推出",
  },
  {
    title: "租 vs 买计算器",
    description: "对比租房与买房的长期成本，帮您做出最适合自己的决定。",
    href: "#",
    available: false,
    icon: <ScaleIcon />,
    badge: "即将推出",
  },
];

function CalculatorCard({ calc }: { calc: Calculator }) {
  const card = (
    <div
      className={[
        "relative bg-white rounded-2xl border p-6 flex flex-col h-full transition-all duration-200",
        calc.available
          ? "border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 group cursor-pointer"
          : "border-gray-100 opacity-60",
      ].join(" ")}
    >
      {/* Badge */}
      {calc.badge && (
        <span className="absolute top-4 right-4 text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">
          {calc.badge}
        </span>
      )}

      {/* Icon */}
      <div
        className={[
          "w-14 h-14 rounded-xl flex items-center justify-center mb-5 shrink-0",
          calc.available ? "bg-navy/5 text-navy group-hover:bg-coral/10 group-hover:text-coral transition-colors duration-200" : "bg-gray-100 text-gray-400",
        ].join(" ")}
      >
        {calc.icon}
      </div>

      {/* Text */}
      <h2
        className={[
          "text-base font-bold mb-2 leading-snug",
          calc.available ? "text-navy group-hover:text-coral transition-colors duration-150" : "text-gray-500",
        ].join(" ")}
      >
        {calc.title}
      </h2>
      <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-5">
        {calc.description}
      </p>

      {/* CTA */}
      {calc.available ? (
        <span className="inline-flex items-center gap-1.5 bg-coral text-white text-sm font-semibold px-5 py-2.5 rounded-xl self-start shadow-sm group-hover:bg-coral/90 transition-colors duration-150">
          立即使用
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-400 text-sm font-medium px-5 py-2.5 rounded-xl self-start cursor-not-allowed">
          敬请期待
        </span>
      )}
    </div>
  );

  return calc.available ? (
    <Link href={calc.href} className="block h-full">
      {card}
    </Link>
  ) : (
    <div className="h-full">{card}</div>
  );
}

export default function CalculatorsPage() {
  const available = CALCULATORS.filter((c) => c.available);
  const upcoming = CALCULATORS.filter((c) => !c.available);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-coral text-sm font-semibold tracking-widest uppercase mb-3">
            FINC · 专业工具
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            贷款计算器
          </h1>
          <p className="text-white/65 text-base sm:text-lg max-w-xl mx-auto">
            免费专业工具，助您做出明智的财务决策
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Available calculators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {available.map((calc) => (
            <CalculatorCard key={calc.title} calc={calc} />
          ))}
        </div>

        {/* Upcoming divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-widest whitespace-nowrap">
            即将推出
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Upcoming calculators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {upcoming.map((calc) => (
            <CalculatorCard key={calc.title} calc={calc} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="bg-warm-white border-t border-gray-100 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3">
            还有更多问题？
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            计算器提供的是估算数字。想了解您的真实贷款方案，欢迎免费咨询我们的专业经纪人。
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

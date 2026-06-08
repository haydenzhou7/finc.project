import Link from "next/link";

interface Props {
  state?: string;
}

export default function StampDutyCalculator({ state }: Props = {}) {
  const href = state
    ? `/calculators/stamp-duty?state=${state}`
    : "/calculators/stamp-duty";
  return (
    <div className="not-prose my-6 p-5 bg-navy/5 border border-navy/10 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1">
        <p className="font-semibold text-navy text-sm mb-0.5">印花税计算器</p>
        <p className="text-gray-500 text-xs">
          估算澳洲各州购房印花税，含首次购房优惠与海外买家附加税。
        </p>
      </div>
      <Link
        href={href}
        className="shrink-0 inline-flex items-center gap-1.5 bg-coral hover:bg-coral/90 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-150 shadow-sm"
      >
        立即计算
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

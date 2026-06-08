import Link from "next/link";

interface Props {
  state?: string;
}

export default function StampDutyCalculator({ state }: Props = {}) {
  const href = state
    ? `/calculators/stamp-duty?state=${state}`
    : "/calculators/stamp-duty";
  return (
    <div className="not-prose my-8 p-5 bg-white border-2 border-[#E8634A] rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="shrink-0 w-11 h-11 rounded-lg bg-[#FDF4F2] flex items-center justify-center">
        <svg className="w-5 h-5 text-[#E8634A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 text-sm mb-0.5">印花税计算器</p>
        <p className="text-gray-500 text-xs leading-relaxed">
          估算澳洲各州购房印花税，含首次购房优惠与海外买家附加税。
        </p>
      </div>
      <Link
        href={href}
        className="shrink-0 inline-flex items-center gap-1.5 bg-[#E8634A] hover:bg-[#E8634A]/90 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-150 shadow-sm whitespace-nowrap"
      >
        计算 →
      </Link>
    </div>
  );
}

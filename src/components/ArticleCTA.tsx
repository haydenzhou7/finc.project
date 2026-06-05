import Link from "next/link";

export default function ArticleCTA() {
  return (
    <div className="not-prose my-8 bg-[#1A2B5E] rounded-2xl px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
      <div className="flex-1">
        <p className="text-white font-bold text-base sm:text-lg leading-snug mb-1">
          不知道该选哪家银行？
        </p>
        <p className="text-white/75 text-sm sm:text-base leading-relaxed">
          比较超过40家贷款机构，为您的情况推荐最合适的房贷选项。
        </p>
      </div>
      <Link
        href="/contact"
        className="shrink-0 inline-block bg-[#E8634A] hover:bg-[#E8634A]/90 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl transition-colors duration-200 text-center whitespace-nowrap"
      >
        免费房贷咨询 →
      </Link>
    </div>
  );
}

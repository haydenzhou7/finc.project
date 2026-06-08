import Link from "next/link";

const CARDS = [
  {
    href: "/admin/rates",
    title: "利率更新",
    desc: "每月更新各银行房贷利率",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
      </svg>
    ),
  },
  {
    href: "/admin/calendar",
    title: "内容更新日历",
    desc: "查看定期维护提醒时间表",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: "#1A2B5E" }}>
            FINC 后台管理
          </h1>
          <p className="mt-2 text-sm text-gray-400">仅限内部使用</p>
        </div>

        <div className="grid gap-4">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="flex items-center gap-5 bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-200 hover:border-[#E8634A] hover:shadow-md transition-all duration-150 group"
            >
              <div
                className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: "#1A2B5E" }}
              >
                {card.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 group-hover:text-[#E8634A] transition-colors">
                  {card.title}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{card.desc}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-300 group-hover:text-[#E8634A] transition-colors shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

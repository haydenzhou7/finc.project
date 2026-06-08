import AdminGuard from "@/components/admin/AdminGuard";

const NAVY = "#1A2B5E";
const ORANGE = "#E8634A";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xl font-bold mb-4 pb-2 inline-block"
      style={{ color: NAVY, borderBottom: `3px solid ${ORANGE}` }}
    >
      {children}
    </h2>
  );
}

type BadgeVariant = "red" | "orange" | "blue" | "green";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  red:    "bg-red-100 text-red-700 border border-red-300",
  orange: "bg-orange-100 text-orange-700 border border-orange-300",
  blue:   "bg-blue-100 text-blue-700 border border-blue-300",
  green:  "bg-green-100 text-green-700 border border-green-300",
};

function Badge({ emoji, label, variant }: { emoji: string; label: string; variant: BadgeVariant }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${BADGE_STYLES[variant]}`}>
      {emoji} {label}
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
      style={{ backgroundColor: NAVY }}
    >
      {children}
    </th>
  );
}

function Td({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <td className={`px-4 py-3 text-sm align-top ${muted ? "text-gray-400 italic" : "text-gray-700"}`}>
      {children}
    </td>
  );
}

function Tr({ children, stripe }: { children: React.ReactNode; stripe: boolean }) {
  return (
    <tr className={stripe ? "bg-gray-50" : "bg-white"}>
      {children}
    </tr>
  );
}

export default function AdminCalendarPage() {
  return (
    <AdminGuard>
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="border-l-4 pl-5" style={{ borderColor: ORANGE }}>
          <h1 className="text-3xl font-bold" style={{ color: NAVY }}>内容更新日历</h1>
          <p className="text-gray-500 mt-1 text-sm">定期维护提醒 — 仅限内部使用</p>
        </div>

        {/* Table 1: Monthly */}
        <section>
          <SectionTitle>1. 每月固定（月初做）</SectionTitle>
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <Th>时间</Th>
                  <Th>紧急度</Th>
                  <Th>任务</Th>
                  <Th>操作方式</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    time: "每月1日前后",
                    badge: <Badge emoji="🔴" label="必做" variant="red" />,
                    task: "更新澳洲各银行最新房贷利率",
                    action: "登录 /admin/rates 填写新数字提交",
                  },
                  {
                    time: "RBA议息后（每6–8周）",
                    badge: <Badge emoji="🔴" label="必做" variant="red" />,
                    task: "发布RBA利率决定解读文章",
                    action: "新发文章，发布当天或次日",
                  },
                ].map((row, i) => (
                  <Tr key={i} stripe={i % 2 === 1}>
                    <Td>{row.time}</Td>
                    <Td>{row.badge}</Td>
                    <Td>{row.task}</Td>
                    <Td muted>{row.action}</Td>
                  </Tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 2: Annual */}
        <section>
          <SectionTitle>2. 每年固定（按日期提醒）</SectionTitle>
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <Th>日期</Th>
                  <Th>紧急度</Th>
                  <Th>任务</Th>
                  <Th>涉及文章</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "7月1日前",
                    badge: <Badge emoji="🔴" label="必做" variant="red" />,
                    task: "新财年印花税费率更新",
                    articles: "全部印花税文章 + stamp-duty-australia",
                  },
                  {
                    date: "7月1日前",
                    badge: <Badge emoji="🔴" label="必做" variant="red" />,
                    task: "FIRB申请费用更新",
                    articles: "firb-fees-foreign-investment",
                  },
                  {
                    date: "7月1日前",
                    badge: <Badge emoji="🔴" label="必做" variant="red" />,
                    task: "ACT印花税门槛按CPI调整",
                    articles: "act-stamp-duty-guide",
                  },
                  {
                    date: "5月联邦预算后",
                    badge: <Badge emoji="🔴" label="必做" variant="red" />,
                    task: "预算案政策变化解读",
                    articles: "新发文章 + 受影响文章",
                  },
                  {
                    date: "6月30日前",
                    badge: <Badge emoji="🔴" label="必做" variant="red" />,
                    task: "检查临时政策是否延续",
                    articles: "TAS首置豁免、QLD $30k补助、WA期房优惠",
                  },
                  {
                    date: "各州预算公布后",
                    badge: <Badge emoji="🟡" label="重要" variant="orange" />,
                    task: "各州印花税政策变化",
                    articles: "对应州文章",
                  },
                ].map((row, i) => (
                  <Tr key={i} stripe={i % 2 === 1}>
                    <Td>{row.date}</Td>
                    <Td>{row.badge}</Td>
                    <Td>{row.task}</Td>
                    <Td muted>{row.articles}</Td>
                  </Tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 3: Deadlines */}
        <section>
          <SectionTitle>3. 临时政策截止日期</SectionTitle>
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <Th>截止日期</Th>
                  <Th>状态</Th>
                  <Th>内容</Th>
                  <Th>涉及文章</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "2026年6月30日",
                    badge: <Badge emoji="🔴" label="即将到期" variant="red" />,
                    content: "QLD FHOG $30,000（之后降回$15,000）",
                    articles: "qld-stamp-duty-guide、fhog-and-stamp-duty-concessions",
                  },
                  {
                    date: "2026年6月30日",
                    badge: <Badge emoji="🔴" label="即将到期" variant="red" />,
                    content: "TAS首置已建成房全额豁免临时政策",
                    articles: "tas-stamp-duty-guide、fhog-and-stamp-duty-concessions",
                  },
                  {
                    date: "2026年9月30日",
                    badge: <Badge emoji="🟡" label="今年到期" variant="orange" />,
                    content: "NT HomeGrown $50,000补助",
                    articles: "nt-stamp-duty-guide、fhog-and-stamp-duty-concessions",
                  },
                  {
                    date: "2027年4月21日",
                    badge: <Badge emoji="🔵" label="明年到期" variant="blue" />,
                    content: "VIC期房优惠（临时扩展）",
                    articles: "vic-stamp-duty-guide",
                  },
                  {
                    date: "2027年6月30日",
                    badge: <Badge emoji="🔵" label="明年到期" variant="blue" />,
                    content: "NT House & Land Package全额豁免",
                    articles: "nt-stamp-duty-guide",
                  },
                  {
                    date: "2028年6月30日",
                    badge: <Badge emoji="🟢" label="后年到期" variant="green" />,
                    content: "WA期房优惠（已延长）",
                    articles: "wa-stamp-duty-guide",
                  },
                  {
                    date: "2029年6月30日",
                    badge: <Badge emoji="🟢" label="远期" variant="green" />,
                    content: "联邦禁止外国人购买已建成住宅",
                    articles: "firb-fees-foreign-investment",
                  },
                ].map((row, i) => (
                  <Tr key={i} stripe={i % 2 === 1}>
                    <Td>{row.date}</Td>
                    <Td>{row.badge}</Td>
                    <Td>{row.content}</Td>
                    <Td muted>{row.articles}</Td>
                  </Tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 4: Rules */}
        <section>
          <SectionTitle>4. 操作规则</SectionTitle>
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <Th>操作类型</Th>
                  <Th>说明</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: "修改原文章",
                    desc: "印花税 / 利率 / FHOG 数字更新 → 改原文 + 更新 lastModified 日期",
                  },
                  {
                    type: "新发文章",
                    desc: "RBA议息解读、预算案分析、重大政策事件（时效性内容）",
                  },
                  {
                    type: "利率更新",
                    desc: '登录 /admin/rates，填数字提交，Vercel 自动2分钟部署',
                  },
                  {
                    type: "推送代码",
                    desc: '告诉 Claude Code "push" 即可',
                  },
                ].map((row, i) => (
                  <Tr key={i} stripe={i % 2 === 1}>
                    <Td>
                      <span className="font-semibold text-gray-900">{row.type}</span>
                    </Td>
                    <Td>{row.desc}</Td>
                  </Tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-xs text-gray-400 text-center pb-4">
          内部页面 · 数据截至 2026年6月 · 如有政策变动请同步更新本页
        </p>
      </div>
    </div>
    </AdminGuard>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "使用条款 | FINC HOME LOANS",
  description: "FINC HOME LOANS 网站使用条款及服务条件。",
  alternates: { canonical: "https://finc.net.au/terms" },
};

const LAST_UPDATED = "2025年6月1日";

export default function TermsPage() {
  return (
    <>
      <section className="bg-navy py-14 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3">使用条款</h1>
          <p className="text-white/55 text-sm">Terms of Use &nbsp;·&nbsp; 最后更新：{LAST_UPDATED}</p>
        </div>
      </section>

      <section className="bg-warm-white py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-gray max-w-none prose-headings:text-[#1A2B5E] prose-headings:font-bold prose-a:text-[#E8634A] prose-a:no-underline hover:prose-a:underline">

            <p className="text-gray-500 text-sm">
              请在使用本网站前仔细阅读以下条款。访问或使用本网站，即表示您同意受本使用条款的约束。
            </p>

            <h2>1. 关于 FINC HOME LOANS</h2>
            <p>
              FINC HOME LOANS 由 FINC INVEST Pty Ltd（以下简称"FINC"、"我们"）运营。FINC 是一家持牌澳洲信贷经纪机构，持有澳大利亚信贷代理人资格（Australian Credit Representative，ACR）。我们为客户提供住房贷款、投资贷款及相关金融产品的经纪服务。
            </p>

            <h2>2. 网站内容的性质</h2>
            <p>
              本网站所提供的所有信息（包括但不限于利率数据、计算器结果、文章内容）仅供一般参考，不构成财务建议、法律建议或税务建议。在做出任何重大财务决策之前，您应就您的具体情况咨询持牌的财务顾问、贷款专员或其他专业人士。
            </p>
            <p>
              本网站上发布的利率信息来源于各大贷款机构的公开资料，FINC 尽力保持数据的准确性，但不对其实时性或完整性作出任何保证。实际贷款利率由贷款机构最终确定，可能与网站展示的信息存在差异。
            </p>

            <h2>3. 知识产权</h2>
            <p>
              本网站的所有内容，包括但不限于文字、图片、图形、标识、界面设计及软件代码，均受澳大利亚及国际版权法保护，归 FINC INVEST Pty Ltd 或相关授权方所有。未经书面许可，您不得复制、修改、分发、传播或以任何商业目的使用本网站内容。
            </p>

            <h2>4. 使用限制</h2>
            <p>您同意不将本网站用于以下目的：</p>
            <ul>
              <li>任何违反澳大利亚法律法规的行为；</li>
              <li>发布、传播或存储任何违法、有害、欺诈性或侵犯他人权利的内容；</li>
              <li>对本网站进行未经授权的访问、干扰或破坏；</li>
              <li>使用自动化工具批量抓取、采集本网站数据。</li>
            </ul>

            <h2>5. 第三方链接</h2>
            <p>
              本网站可能包含指向第三方网站的链接，包括但不限于政府机构网站、贷款机构网站及合作伙伴平台。这些链接仅为方便用户提供，FINC 对第三方网站的内容、隐私政策或安全性不承担任何责任。访问第三方网站须遵守该网站自身的使用条款。
            </p>

            <h2>6. 免责声明</h2>
            <p>
              在法律允许的最大范围内，FINC 对本网站内容的准确性、完整性或适用性不作任何明示或暗示的保证。FINC 不对因使用或无法使用本网站，或依赖网站内容所产生的任何直接或间接损失承担责任，包括但不限于利润损失、数据丢失或业务中断。
            </p>
            <p>
              澳大利亚消费者法（Australian Consumer Law）赋予消费者某些不可排除的保障权利，本条款不影响这些权利。
            </p>

            <h2>7. 贷款计算器</h2>
            <p>
              本网站提供的还款计算器及印花税计算器仅为估算工具，结果仅供参考。计算结果基于用户输入数据及公开税率信息，不考虑个人财务状况的复杂性。实际还款金额、税费及贷款条件以贷款机构及相关政府机构的最终确认为准。
            </p>

            <h2>8. 隐私</h2>
            <p>
              我们对您个人信息的收集和使用受我们的{" "}
              <Link href="/privacy">隐私政策</Link>
              {" "}约束，该政策构成本使用条款的一部分。
            </p>

            <h2>9. 条款变更</h2>
            <p>
              FINC 保留随时修改本使用条款的权利，修改后的条款将在本页面公布，并在发布时即刻生效。建议您定期查阅本页面以了解最新条款。继续使用本网站即视为您接受修改后的条款。
            </p>

            <h2>10. 适用法律</h2>
            <p>
              本使用条款受澳大利亚新南威尔士州法律管辖。任何因本条款引起的争议，双方同意提交新南威尔士州法院的专属管辖。
            </p>

            <h2>11. 联系我们</h2>
            <p>
              如对本使用条款有任何疑问，请通过以下方式联系我们：
            </p>
            <ul>
              <li>网站联系表单：<Link href="/contact">finc.net.au/contact</Link></li>
            </ul>

          </div>
        </div>
      </section>
    </>
  );
}

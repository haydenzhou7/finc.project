import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私政策 | FINC HOME LOANS",
  description: "FINC HOME LOANS 隐私政策，说明我们如何收集、使用和保护您的个人信息。",
  alternates: { canonical: "https://finc.net.au/privacy" },
};

const LAST_UPDATED = "2025年6月1日";

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-navy py-14 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3">隐私政策</h1>
          <p className="text-white/55 text-sm">Privacy Policy &nbsp;·&nbsp; 最后更新：{LAST_UPDATED}</p>
        </div>
      </section>

      <section className="bg-warm-white py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-gray max-w-none prose-headings:text-[#1A2B5E] prose-headings:font-bold prose-a:text-[#E8634A] prose-a:no-underline hover:prose-a:underline">

            <p className="text-gray-500 text-sm">
              FINC INVEST Pty Ltd（以下简称"FINC"、"我们"）重视您的隐私，并承诺依照澳大利亚《隐私法》（Privacy Act 1988）及《澳大利亚隐私原则》（Australian Privacy Principles，APPs）处理您的个人信息。FINC 持有澳大利亚信贷代理人资格（Australian Credit Representative，ACR）。
            </p>

            <h2>1. 我们收集哪些信息</h2>
            <p>根据您与我们互动的方式，我们可能收集以下类型的个人信息：</p>
            <ul>
              <li><strong>身份信息：</strong>姓名、出生日期、国籍及居留身份；</li>
              <li><strong>联系信息：</strong>电话号码、电子邮件地址、微信号、通讯地址；</li>
              <li><strong>财务信息：</strong>收入、就业状况、资产、负债及信用状况（在您申请贷款咨询时提供）；</li>
              <li><strong>贷款偏好：</strong>贷款类型、金额范围、所在州及房产预算；</li>
              <li><strong>网站使用数据：</strong>IP 地址、浏览器类型、访问页面、访问时间等匿名化数据（通过 Cookie 等技术自动收集）。</li>
            </ul>
            <p>我们不会在未获得您明确同意的情况下收集敏感信息（如种族、健康状况等）。</p>

            <h2>2. 我们如何收集信息</h2>
            <p>我们通过以下方式收集您的个人信息：</p>
            <ul>
              <li>您通过本网站联系表单提交的咨询信息；</li>
              <li>您通过电话、微信或电子邮件直接与我们沟通时提供的信息；</li>
              <li>贷款申请过程中您向我们提供的文件及资料；</li>
              <li>您访问本网站时由 Cookie 及分析工具自动收集的使用数据。</li>
            </ul>

            <h2>3. 我们如何使用您的信息</h2>
            <p>我们收集您的个人信息用于以下目的：</p>
            <ul>
              <li>评估您的贷款需求并为您提供个性化贷款方案建议；</li>
              <li>向贷款机构提交贷款申请（须经您明确授权）；</li>
              <li>与您沟通咨询进展、跟进申请状态；</li>
              <li>履行我们作为持牌信贷经纪人的合规义务；</li>
              <li>改善我们的产品、服务及网站用户体验；</li>
              <li>在您同意的情况下，向您发送市场推广信息。</li>
            </ul>
            <p>我们不会将您的个人信息出售给任何第三方。</p>

            <h2>4. 信息披露对象</h2>
            <p>在提供服务过程中，我们可能将您的部分信息披露给以下各方：</p>
            <ul>
              <li><strong>贷款机构：</strong>银行及非银行贷款机构（仅在您授权提交申请时）；</li>
              <li><strong>信用评估机构：</strong>在评估贷款可行性时（如 Equifax、Illion 等）；</li>
              <li><strong>服务提供商：</strong>协助我们运营业务的技术及行政服务提供商，这些方均受保密义务约束；</li>
              <li><strong>法律及监管机构：</strong>在法律要求或监管需要时。</li>
            </ul>
            <p>
              如我们需要将您的信息披露给位于澳大利亚境外的实体，我们将事先征得您的同意，或确保对方提供与澳大利亚隐私原则相当的保护水平。
            </p>

            <h2>5. 信息的存储与安全</h2>
            <p>
              我们采取合理的技术和管理措施保护您的个人信息，防止未经授权的访问、使用、修改或披露，包括使用加密传输、访问控制及安全存储系统。
            </p>
            <p>
              我们仅在履行业务目的所必要的期间内保留您的个人信息，并依照相关法律规定（包括澳大利亚信贷法）确定保留期限。当信息不再需要时，我们将以安全方式予以销毁或去标识化处理。
            </p>

            <h2>6. Cookie 及网站分析</h2>
            <p>
              本网站使用 Cookie 及类似技术收集匿名的网站使用数据，用于改善用户体验和了解访客行为。您可以通过浏览器设置拒绝或删除 Cookie，但这可能影响本网站的部分功能。我们不会通过 Cookie 收集可识别您个人身份的信息。
            </p>

            <h2>7. 您的权利</h2>
            <p>依据澳大利亚《隐私法》，您享有以下权利：</p>
            <ul>
              <li><strong>访问权：</strong>您有权查阅我们持有的关于您的个人信息；</li>
              <li><strong>更正权：</strong>如您的信息不准确或不完整，您有权要求我们更正；</li>
              <li><strong>投诉权：</strong>如您认为我们处理您信息的方式违反了隐私原则，您有权向我们提出投诉。</li>
            </ul>
            <p>
              如需行使上述权利，请通过本政策第 9 条所列方式与我们联系。我们将在收到请求后 30 天内予以回复。
            </p>

            <h2>8. 投诉处理</h2>
            <p>
              如您对我们处理个人信息的方式有任何疑虑，请先通过第 9 条联系方式与我们直接沟通，我们将尽力在内部解决。如您对我们的处理结果不满意，您有权向澳大利亚信息专员办公室（Office of the Australian Information Commissioner，OAIC）提出投诉，网址：
              <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">www.oaic.gov.au</a>。
            </p>

            <h2>9. 联系我们</h2>
            <p>如对本隐私政策有任何疑问，或希望行使您的隐私权利，请通过以下方式联系我们：</p>
            <ul>
              <li>网站联系表单：<Link href="/contact">finc.net.au/contact</Link></li>
            </ul>

            <h2>10. 政策更新</h2>
            <p>
              我们可能不时更新本隐私政策以反映法律变化或业务调整。更新后的政策将在本页面发布，并注明生效日期。建议您定期查阅本页面。
            </p>

          </div>
        </div>
      </section>
    </>
  );
}

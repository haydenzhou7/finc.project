import Link from "next/link";
import Image from "next/image";

const loanServices = [
  { label: "住房贷款", href: "/services/home-loans" },
  { label: "投资贷款", href: "/services/investment-loans" },
  { label: "转贷", href: "/services/refinance" },
  { label: "首次购房者", href: "/services/first-home-buyers" },
  { label: "自雇贷款", href: "/services/self-employed" },
  { label: "非居民贷款", href: "/services/non-resident" },
];

const moreServices = [
  { label: "商业贷款", href: "/services/commercial" },
  { label: "建筑贷款", href: "/services/construction" },
  { label: "开发贷款", href: "/services/development" },
  { label: "过桥贷款", href: "/services/bridging" },
  { label: "个人贷款", href: "/services/personal" },
  { label: "车贷", href: "/services/car-loans" },
];

export default function Footer() {
  return (
    <footer className="bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Mobile: 2-col grid (brand=full, services|more side-by-side, contact=full)
             Desktop lg: custom 4-col (2fr + 1fr + 1fr + 1fr) */}
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8">

          {/* ── Col 1: Brand — full-width on mobile, 2fr on lg ── */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center">
              <span className="text-white text-2xl font-bold tracking-widest">FINC</span>
              <span
                className="text-coral font-bold leading-none"
                style={{ fontSize: "2rem", lineHeight: 1 }}
              >
                .
              </span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              澳洲华人专属房贷经纪服务，中文全程沟通，与超过40家贷款机构合作，为您找到最优方案。
            </p>
            {/* QR: centered on mobile/tablet, left-aligned on lg */}
            <div className="pt-3 border-t border-white/10 text-center lg:text-left">
              <Image
                src="/wechat-qr.JPG"
                alt="FINC 微信二维码"
                width={100}
                height={100}
                className="rounded-lg bg-white p-1 inline-block"
              />
              <p className="mt-2 text-white/45 text-xs">扫码添加微信咨询</p>
            </div>
          </div>

          {/* ── Col 2: 贷款服务 ── */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h3 className="text-white/90 font-semibold text-sm tracking-wider uppercase">
              贷款服务
            </h3>
            <ul className="flex flex-col gap-2.5">
              {loanServices.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/55 hover:text-coral text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: 更多服务 ── */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h3 className="text-white/90 font-semibold text-sm tracking-wider uppercase">
              更多服务
            </h3>
            <ul className="flex flex-col gap-2.5">
              {moreServices.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/55 hover:text-coral text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: 联系我们 — full-width on mobile, 1fr on lg ── */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4 text-center lg:text-left">
            <h3 className="text-white/90 font-semibold text-sm tracking-wider uppercase">
              联系我们
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="tel:+61451827455"
                className="text-white/55 hover:text-coral transition-colors duration-200 flex items-center justify-center lg:justify-start gap-2"
              >
                <span>📞</span>
                <span>立即电话咨询</span>
              </a>
              <a
                href="mailto:info@finchomeloans.com.au"
                className="text-white/55 hover:text-coral transition-colors duration-200 flex items-center justify-center lg:justify-start gap-2"
              >
                <span className="shrink-0">✉️</span>
                <span>info@finchomeloans.com.au</span>
              </a>
              <p className="text-white/55 flex items-center justify-center lg:justify-start gap-2">
                <span>📍</span>
                <span>Australia</span>
              </p>
              <Link
                href="/calculators"
                className="text-white/55 hover:text-coral transition-colors duration-200 flex items-center justify-center lg:justify-start gap-2 mt-1"
              >
                <span>🧮</span>
                <span>贷款计算器</span>
              </Link>
              <Link
                href="/about"
                className="text-white/55 hover:text-coral transition-colors duration-200 flex items-center justify-center lg:justify-start gap-2"
              >
                <span>ℹ️</span>
                <span>关于我们</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/35">
          <p>Copyright © 2025 FINC INVEST Pty Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              Terms of use
            </Link>
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

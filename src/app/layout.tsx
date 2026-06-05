import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://finc.net.au";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FINC HOME LOANS | 澳洲华人房贷经纪",
    template: "%s | FINC HOME LOANS",
  },
  description:
    "澳洲华人专属房贷经纪服务，全程中文沟通，比较超过40家银行和贷款机构，为您找到最合适的房贷方案。印花税计算器、还款计算器免费使用。",
  keywords: ["澳洲房贷", "华人房贷", "印花税计算器", "澳洲买房", "首次购房", "mortgage broker"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_AU",
    siteName: "FINC HOME LOANS",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "FINC HOME LOANS",
  description: "澳洲华人房贷经纪，中文全程服务，比较超过40家贷款机构",
  url: SITE_URL,
  telephone: "+61451827455",
  address: {
    "@type": "PostalAddress",
    addressCountry: "AU",
  },
  areaServed: "AU",
  availableLanguage: ["Chinese", "English"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "关于我们", href: "/about" },
  { label: "贷款资讯", href: "/news" },
  { label: "贷款计算器", href: "/calculators" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: "white", fontSize: "1.75rem" }}>FINC</span>
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: "#E8634A", fontSize: "1.75rem" }}>.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-coral hover:bg-coral/90 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            >
              立即咨询
            </Link>
          </nav>

          {/* Phone CTA */}
          <div className="hidden md:block">
            <a
              href="tel:+61451827455"
              className="bg-coral hover:bg-coral/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 inline-flex items-center gap-2"
            >
              <span>📞</span>
              <span>立即电话咨询</span>
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-navy border-t border-white/10 px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-white/80 hover:text-white py-3 text-sm font-medium border-b border-white/5"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="block bg-coral text-white text-center py-3 rounded-full text-sm font-semibold mt-3 mb-1"
            onClick={() => setIsOpen(false)}
          >
            立即咨询
          </Link>
          <div className="pt-2">
            <a
              href="tel:+61451827455"
              className="block bg-coral/20 border border-coral/40 text-coral text-center py-3 rounded-full text-sm font-semibold"
            >
              📞 立即电话咨询
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FAQ({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="not-prose my-8 rounded-xl overflow-hidden border border-gray-100">
      {items.map((item, i) => {
        const isOpen = open === i;
        const isLast = i === items.length - 1;
        return (
          <div key={i} className={isLast ? "" : "border-b border-gray-100"}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-start gap-3 px-5 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
            >
              {/* Orange left bar */}
              <span
                className={[
                  "shrink-0 mt-0.5 w-1 self-stretch rounded-full transition-colors duration-150",
                  isOpen ? "bg-coral" : "bg-gray-200",
                ].join(" ")}
              />
              <span className="flex-1 font-semibold text-navy text-sm leading-snug">
                {item.q}
              </span>
              <svg
                className={[
                  "shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200 mt-0.5",
                  isOpen ? "rotate-180" : "",
                ].join(" ")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={[
                "overflow-hidden transition-all duration-200 bg-white",
                isOpen ? "max-h-96" : "max-h-0",
              ].join(" ")}
            >
              <p className="px-5 py-4 pl-9 text-gray-600 text-sm leading-relaxed">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

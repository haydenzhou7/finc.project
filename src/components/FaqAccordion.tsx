"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <dl className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <dt>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-navy text-sm sm:text-base">
                  {item.q}
                </span>
                <span
                  className={[
                    "shrink-0 w-5 h-5 text-coral transition-transform duration-200",
                    isOpen ? "rotate-45" : "",
                  ].join(" ")}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
                  </svg>
                </span>
              </button>
            </dt>
            <dd
              className={[
                "overflow-hidden transition-all duration-200",
                isOpen ? "max-h-96" : "max-h-0",
              ].join(" ")}
            >
              <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
                {item.a}
              </p>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

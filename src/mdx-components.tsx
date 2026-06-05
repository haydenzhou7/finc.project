import type { MDXComponents } from "mdx/types";
import RepaymentCalculator from "@/components/calculators/RepaymentCalculator";
import FAQ from "@/components/mdx/FAQ";
import StampDutyCalculator from "@/components/mdx/StampDutyCalculator";

// ── Styled table components ───────────────────────────────────────────────────

function MdxTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

function MdxThead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-[#1A2B5E] text-white">{children}</thead>;
}

function MdxTh({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
      {children}
    </th>
  );
}

function MdxTbody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}

function MdxTr({ children }: { children: React.ReactNode }) {
  return (
    <tr className="even:bg-gray-50 hover:bg-coral/5 transition-colors duration-100">
      {children}
    </tr>
  );
}

function MdxTd({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-2.5 text-gray-700 [&>strong]:text-[#1A2B5E] [&>strong]:font-bold">
      {children}
    </td>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    RepaymentCalculator,
    FAQ,
    StampDutyCalculator,
    table: MdxTable,
    thead: MdxThead,
    th: MdxTh,
    tbody: MdxTbody,
    tr: MdxTr,
    td: MdxTd,
  };
}

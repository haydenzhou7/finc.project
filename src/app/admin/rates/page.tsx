"use client";

import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface VariableRow { owner_pi: string; owner_io: string; invest_pi: string; invest_io: string }
interface FixedRow    { y1: string; y2: string; y3: string; y5: string }

// ── Default data (current rates — update after each submission) ───────────────

const DEFAULT_VARIABLE: Record<string, VariableRow> = {
  cba:     { owner_pi: "5.74", owner_io: "6.14", invest_pi: "6.14", invest_io: "6.54" },
  westpac: { owner_pi: "5.69", owner_io: "6.09", invest_pi: "6.09", invest_io: "6.49" },
  anz:     { owner_pi: "5.79", owner_io: "6.19", invest_pi: "6.19", invest_io: "6.59" },
  nab:     { owner_pi: "5.84", owner_io: "6.24", invest_pi: "6.24", invest_io: "6.64" },
};

const DEFAULT_FIXED: Record<string, FixedRow> = {
  cba:     { y1: "5.99", y2: "5.89", y3: "5.79", y5: "5.99" },
  westpac: { y1: "5.94", y2: "5.84", y3: "5.74", y5: "5.94" },
  anz:     { y1: "6.04", y2: "5.94", y3: "5.84", y5: "6.04" },
  nab:     { y1: "6.09", y2: "5.99", y3: "5.89", y5: "6.09" },
};

const VARIABLE_BANKS = [
  { key: "cba",     label: "CBA" },
  { key: "westpac", label: "Westpac" },
  { key: "anz",     label: "ANZ" },
  { key: "nab",     label: "NAB" },
];

const FIXED_BANKS = [
  { key: "cba",     label: "CBA" },
  { key: "westpac", label: "Westpac" },
  { key: "anz",     label: "ANZ" },
  { key: "nab",     label: "NAB" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function RateInput({
  value,
  onChange,
  highlight,
}: {
  value: string;
  onChange: (v: string) => void;
  highlight?: boolean;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        step="0.01"
        min="0"
        max="20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "w-full rounded-lg border px-3 py-2 text-sm text-right font-mono outline-none transition-all",
          "focus:ring-2 focus:ring-[#E8634A]/40 focus:border-[#E8634A]",
          highlight
            ? "border-[#1A2B5E] bg-blue-50 font-bold text-[#1A2B5E]"
            : "border-gray-200 bg-white text-gray-700",
        ].join(" ")}
        placeholder="0.00"
      />
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
        %
      </span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminRatesPage() {
  const now = new Date();
  const [year,     setYear]     = useState(String(now.getFullYear()));
  const [month,    setMonth]    = useState(String(now.getMonth() + 1));
  const [password, setPassword] = useState("");
  const [rba,      setRba]      = useState<{ rate: string; note: string }>({ rate: "4.35", note: "2026年5月RBA议息会议决定加息25个基点" });
  const [variable, setVariable] = useState<Record<string, VariableRow>>(DEFAULT_VARIABLE);
  const [fixed,    setFixed]    = useState<Record<string, FixedRow>>(DEFAULT_FIXED);
  const [status,   setStatus]   = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errMsg,   setErrMsg]   = useState("");

  useEffect(() => {
    fetch("/api/update-rates")
      .then((r) => r.json())
      .then((data: { rba?: { rate: string; note: string }; variable?: Record<string, VariableRow>; fixed?: Record<string, FixedRow> }) => {
        if (data.rba)      setRba(data.rba);
        if (data.variable) setVariable(data.variable);
        if (data.fixed)    setFixed(data.fixed);
      })
      .catch(() => {});
  }, []);

  function setVar(bank: string, field: keyof VariableRow, val: string) {
    setVariable((prev) => ({ ...prev, [bank]: { ...prev[bank], [field]: val } }));
  }

  function setFix(bank: string, field: keyof FixedRow, val: string) {
    setFixed((prev) => ({ ...prev, [bank]: { ...prev[bank], [field]: val } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");

    try {
      const res = await fetch("/api/update-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          year:  Number(year),
          month: Number(month),
          rba,
          rates: { variable, fixed },
        }),
      });

      const data = await res.json() as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setErrMsg(data.error ?? "未知错误");
        setStatus("error");
      } else {
        setStatus("ok");
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "网络错误");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1A2B5E] text-white px-6 py-4 flex items-center gap-3">
        <svg className="w-6 h-6 text-[#E8634A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
        </svg>
        <h1 className="text-lg font-bold tracking-wide">利率后台管理</h1>
        <span className="ml-auto text-xs text-white/50">FINC HOME LOANS · 仅限内部使用</span>
      </header>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* ── Section 1: Meta ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-[#1A2B5E] mb-5">更新信息</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">年份</label>
              <input
                type="number"
                min="2020"
                max="2099"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#E8634A]/40 focus:border-[#E8634A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">月份</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#E8634A]/40 focus:border-[#E8634A] bg-white"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m} 月</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">管理密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#E8634A]/40 focus:border-[#E8634A]"
              />
            </div>
          </div>
        </section>

        {/* ── Section 2: RBA Cash Rate ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-[#1A2B5E] mb-5">RBA 现金利率</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">现金利率（%）</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="20"
                  value={rba.rate}
                  onChange={(e) => setRba((prev) => ({ ...prev, rate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono text-right outline-none focus:ring-2 focus:ring-[#E8634A]/40 focus:border-[#E8634A]"
                  placeholder="4.35"
                />
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">备注说明</label>
              <input
                type="text"
                value={rba.note}
                onChange={(e) => setRba((prev) => ({ ...prev, note: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#E8634A]/40 focus:border-[#E8634A]"
                placeholder="例：2026年5月RBA议息会议决定加息25个基点"
              />
            </div>
          </div>
        </section>

        {/* ── Section 3: Variable Rates ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-[#1A2B5E] mb-1">浮动利率（Variable Rate）</h2>
          <p className="text-xs text-gray-400 mb-5">蓝色高亮列（自住/投资还本付息）在表格中会加粗显示</p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#1A2B5E] text-white">
                  <th className="px-4 py-2.5 text-left font-semibold text-xs w-44">银行</th>
                  <th className="px-3 py-2.5 text-center font-semibold text-xs min-w-[110px]">
                    自住<br /><span className="font-normal opacity-75">还本付息 ★</span>
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-xs min-w-[110px]">
                    自住<br /><span className="font-normal opacity-75">纯利息</span>
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-xs min-w-[110px]">
                    投资<br /><span className="font-normal opacity-75">还本付息 ★</span>
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-xs min-w-[110px]">
                    投资<br /><span className="font-normal opacity-75">纯利息</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {VARIABLE_BANKS.map(({ key, label }) => (
                  <tr key={key} className="even:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-[#1A2B5E] text-xs whitespace-nowrap">{label}</td>
                    <td className="px-3 py-2">
                      <RateInput highlight value={variable[key]?.owner_pi ?? ""} onChange={(v) => setVar(key, "owner_pi", v)} />
                    </td>
                    <td className="px-3 py-2">
                      <RateInput value={variable[key]?.owner_io ?? ""} onChange={(v) => setVar(key, "owner_io", v)} />
                    </td>
                    <td className="px-3 py-2">
                      <RateInput highlight value={variable[key]?.invest_pi ?? ""} onChange={(v) => setVar(key, "invest_pi", v)} />
                    </td>
                    <td className="px-3 py-2">
                      <RateInput value={variable[key]?.invest_io ?? ""} onChange={(v) => setVar(key, "invest_io", v)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 3: Fixed Rates ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-[#1A2B5E] mb-1">固定利率（Fixed Rate）—— 自住房还本付息</h2>
          <p className="text-xs text-gray-400 mb-5">蓝色高亮列（2年）在表格中会加粗显示。其他银行行自动生成，无需填写。</p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#1A2B5E] text-white">
                  <th className="px-4 py-2.5 text-left font-semibold text-xs w-44">银行</th>
                  <th className="px-3 py-2.5 text-center font-semibold text-xs min-w-[110px]">1年固定</th>
                  <th className="px-3 py-2.5 text-center font-semibold text-xs min-w-[110px]">
                    2年固定 ★
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-xs min-w-[110px]">3年固定</th>
                  <th className="px-3 py-2.5 text-center font-semibold text-xs min-w-[110px]">5年固定</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {FIXED_BANKS.map(({ key, label }) => (
                  <tr key={key} className="even:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-[#1A2B5E] text-xs whitespace-nowrap">{label}</td>
                    <td className="px-3 py-2">
                      <RateInput value={fixed[key]?.y1 ?? ""} onChange={(v) => setFix(key, "y1", v)} />
                    </td>
                    <td className="px-3 py-2">
                      <RateInput highlight value={fixed[key]?.y2 ?? ""} onChange={(v) => setFix(key, "y2", v)} />
                    </td>
                    <td className="px-3 py-2">
                      <RateInput value={fixed[key]?.y3 ?? ""} onChange={(v) => setFix(key, "y3", v)} />
                    </td>
                    <td className="px-3 py-2">
                      <RateInput value={fixed[key]?.y5 ?? ""} onChange={(v) => setFix(key, "y5", v)} />
                    </td>
                  </tr>
                ))}
                {/* Other banks row — auto-generated, read-only */}
                <tr className="bg-gray-50 opacity-60">
                  <td className="px-4 py-2 text-xs text-gray-500 italic">其他银行（自动生成）</td>
                  {["1年", "2年", "3年", "5年"].map((y) => (
                    <td key={y} className="px-3 py-2 text-center text-xs text-gray-400">[获取利率]</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Submit ── */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-[#E8634A] hover:bg-[#d55539] disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-150 shadow-md flex items-center gap-2"
          >
            {status === "loading" ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                提交中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                提交更新
              </>
            )}
          </button>

          {status === "ok" && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                <strong>已提交！</strong> Vercel 将在 2 分钟内重新部署，届时网页利率自动更新。
              </span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span><strong>错误：</strong>{errMsg}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400">
          提交后 GitHub 仓库的 MDX 文件将自动更新，Vercel 检测到 push 后触发重新部署。
          网站生效时间通常为 <strong>1–3 分钟</strong>。
        </p>
      </form>
    </div>
  );
}

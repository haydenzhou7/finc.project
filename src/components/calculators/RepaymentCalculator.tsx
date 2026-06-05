"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type RepaymentType = "pi" | "io";
type FrequencyType = "monthly" | "fortnightly" | "weekly";

const FREQ = {
  monthly:    { label: "每月",   periodsPerYear: 12 },
  fortnightly:{ label: "每两周", periodsPerYear: 26 },
  weekly:     { label: "每周",   periodsPerYear: 52 },
} satisfies Record<FrequencyType, { label: string; periodsPerYear: number }>;

type PiResult = {
  kind: "pi";
  periodicRepayment: number;
  totalInterest: number;
  totalPeriods: number;
};

type IoResult = {
  kind: "io";
  ioPeriodicRepayment: number;
  piPeriodicRepayment: number;
  ioYears: number;
  totalInterest: number;
  totalPeriods: number;
};

type CalcResult = PiResult | IoResult;

function fmtCurrency(n: number): string {
  return (
    "$" +
    n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

function fmtWhole(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-AU");
}

function calcRepayment(
  loanAmount: number,
  annualRate: number,
  termYears: number,
  type: RepaymentType,
  frequency: FrequencyType,
  ioTermYears: number
): CalcResult | null {
  if (!loanAmount || loanAmount <= 0) return null;
  if (!annualRate || annualRate <= 0) return null;
  if (!termYears || termYears <= 0) return null;

  const { periodsPerYear } = FREQ[frequency];
  const r = annualRate / 100 / periodsPerYear;
  const n = termYears * periodsPerYear;

  if (type === "pi") {
    const periodic = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = periodic * n;
    return { kind: "pi", periodicRepayment: periodic, totalInterest: total - loanAmount, totalPeriods: n };
  }

  // IO mode — requires a valid IO term strictly less than total term
  if (!ioTermYears || ioTermYears <= 0 || ioTermYears >= termYears) return null;

  const ioPeriods = ioTermYears * periodsPerYear;
  const ioRepayment = loanAmount * r;

  const remainingYears = termYears - ioTermYears;
  const piN = remainingYears * periodsPerYear;
  const piRepayment = (loanAmount * r * Math.pow(1 + r, piN)) / (Math.pow(1 + r, piN) - 1);

  const totalInterest = ioRepayment * ioPeriods + (piRepayment * piN - loanAmount);

  return {
    kind: "io",
    ioPeriodicRepayment: ioRepayment,
    piPeriodicRepayment: piRepayment,
    ioYears: ioTermYears,
    totalInterest,
    totalPeriods: n,
  };
}

function inputCls(err?: boolean) {
  return [
    "w-full border rounded-lg px-4 py-3 text-sm text-gray-800 bg-white",
    "focus:outline-none focus:ring-2 transition-colors",
    err
      ? "border-red-400 focus:ring-red-200"
      : "border-gray-300 focus:ring-coral/30 focus:border-coral",
  ].join(" ");
}

function chipCls(selected: boolean) {
  return [
    "px-2 py-2 rounded-lg border cursor-pointer text-sm transition-all duration-150 select-none text-center",
    selected
      ? "border-coral bg-coral/5 text-coral font-medium"
      : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white",
  ].join(" ");
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
    </label>
  );
}

const TERM_CHIPS = [10, 15, 20, 25, 30];

export default function RepaymentCalculator() {
  const [loanStr, setLoanStr]   = useState("");
  const [rateStr, setRateStr]   = useState("");
  const [termStr, setTermStr]   = useState("");
  const [ioTermStr, setIoTermStr] = useState("");
  const [type, setType]         = useState<RepaymentType>("pi");
  const [frequency, setFrequency] = useState<FrequencyType>("monthly");

  const [loanErr, setLoanErr] = useState(false);
  const [rateErr, setRateErr] = useState(false);
  const [termErr, setTermErr] = useState(false);

  const loanAmount  = parseFloat(loanStr.replace(/[^0-9.]/g, "")) || 0;
  const annualRate  = parseFloat(rateStr) || 0;
  const termYears   = parseInt(termStr, 10) || 0;
  const ioTermYears = parseInt(ioTermStr, 10) || 0;

  const result = useMemo(
    () => calcRepayment(loanAmount, annualRate, termYears, type, frequency, ioTermYears),
    [loanAmount, annualRate, termYears, type, frequency, ioTermYears]
  );

  function handleLoanChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setLoanStr(raw ? Number(raw).toLocaleString("en-AU") : "");
    setLoanErr(false);
  }

  function handleTermChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTermStr(e.target.value);
    setTermErr(false);
    // reset IO term if it would become invalid
    const newTerm = parseInt(e.target.value, 10);
    if (ioTermYears >= newTerm) setIoTermStr("");
  }

  function handleTypeChange(val: RepaymentType) {
    setType(val);
    if (val === "pi") setIoTermStr("");
  }

  const freqLabel = FREQ[frequency].label;
  const maxIoTerm = Math.min(10, Math.max(0, termYears - 1));

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0 items-start">
      {/* ── Left: Inputs ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-7">
        <h3 className="text-navy font-semibold text-base pb-2 border-b border-gray-100">
          贷款信息
        </h3>

        {/* Loan Amount */}
        <div>
          <SectionLabel>
            贷款金额（澳元）<span className="text-coral">*</span>
          </SectionLabel>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={loanStr}
              onChange={handleLoanChange}
              onBlur={() => setLoanErr(!loanStr)}
              placeholder="600,000"
              className={`${inputCls(loanErr)} pl-7`}
            />
          </div>
          {loanErr && <p className="text-red-500 text-xs mt-1.5">请输入贷款金额</p>}
        </div>

        {/* Annual Rate */}
        <div>
          <SectionLabel>
            年利率（%）<span className="text-coral">*</span>
          </SectionLabel>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              value={rateStr}
              onChange={(e) => { setRateStr(e.target.value); setRateErr(false); }}
              onBlur={() => setRateErr(!rateStr || parseFloat(rateStr) <= 0)}
              placeholder="6.00"
              step="0.01"
              min="0"
              className={`${inputCls(rateErr)} pr-10`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
          {rateErr && <p className="text-red-500 text-xs mt-1.5">请输入有效的年利率</p>}
        </div>

        {/* Loan Term */}
        <div>
          <SectionLabel>
            贷款年限<span className="text-coral">*</span>
          </SectionLabel>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              value={termStr}
              onChange={handleTermChange}
              onBlur={() => setTermErr(!termStr || parseInt(termStr) <= 0)}
              placeholder="30"
              min="1"
              max="30"
              className={`${inputCls(termErr)} pr-14`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">年</span>
          </div>
          {termErr && <p className="text-red-500 text-xs mt-1.5">请输入有效的贷款年限</p>}
          <div className="grid grid-cols-5 gap-1.5 mt-3">
            {TERM_CHIPS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  setTermStr(String(y));
                  setTermErr(false);
                  if (ioTermYears >= y) setIoTermStr("");
                }}
                className={chipCls(termYears === y)}
              >
                {y}年
              </button>
            ))}
          </div>
        </div>

        {/* Repayment Type */}
        <div>
          <SectionLabel>还款类型</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["pi", "本金 + 利息"],
                ["io", "仅利息"],
              ] as [RepaymentType, string][]
            ).map(([val, label]) => (
              <label key={val} className={chipCls(type === val)}>
                <input
                  type="radio"
                  className="sr-only"
                  checked={type === val}
                  onChange={() => handleTypeChange(val)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* IO-only Period field */}
        {type === "io" && (
          <div>
            <SectionLabel>
              只还利息期限<span className="text-coral">*</span>
            </SectionLabel>
            {termYears <= 1 ? (
              <p className="text-amber-600 text-xs bg-amber-50 rounded-lg px-3 py-2">
                请先设置大于 1 年的总贷款年限
              </p>
            ) : (
              <>
                <select
                  value={ioTermStr}
                  onChange={(e) => setIoTermStr(e.target.value)}
                  className={inputCls()}
                >
                  <option value="">请选择…</option>
                  {Array.from({ length: maxIoTerm }, (_, i) => i + 1).map((y) => (
                    <option key={y} value={y}>
                      {y} 年
                    </option>
                  ))}
                </select>
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-2">
                  澳洲银行一般仅提供 1–10 年只还利息期。期满后转为本息还款，本金全额摊还。
                </p>
              </>
            )}
          </div>
        )}

        {/* Repayment Frequency */}
        <div>
          <SectionLabel>还款频率</SectionLabel>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(FREQ) as FrequencyType[]).map((val) => (
              <label key={val} className={chipCls(frequency === val)}>
                <input
                  type="radio"
                  className="sr-only"
                  checked={frequency === val}
                  onChange={() => setFrequency(val)}
                />
                {FREQ[val].label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Results + CTA ── */}
      <div className="space-y-5">
        {/* Results card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-navy font-semibold text-lg">还款估算</h3>
          </div>

          {result ? (
            <div>
              {/* Hero section */}
              {result.kind === "pi" ? (
                <div className="px-6 pt-6 pb-4 text-center bg-navy/[0.02]">
                  <p className="text-sm text-gray-500 mb-1">{freqLabel}还款额</p>
                  <p className="text-4xl sm:text-5xl font-bold text-navy tabular-nums">
                    {fmtCurrency(result.periodicRepayment)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">本金 + 利息·{freqLabel}</p>
                </div>
              ) : (
                <div className="px-6 pt-6 pb-4 bg-navy/[0.02] grid grid-cols-2 gap-4">
                  <div className="text-center border-r border-gray-200 pr-4">
                    <p className="text-xs text-gray-500 mb-1.5">
                      前 {result.ioYears} 年（仅利息）
                    </p>
                    <p className="text-2xl font-bold text-navy tabular-nums">
                      {fmtCurrency(result.ioPeriodicRepayment)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{freqLabel}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1.5">
                      第 {result.ioYears + 1} 年起（本金+利息）
                    </p>
                    <p className="text-2xl font-bold text-navy tabular-nums">
                      {fmtCurrency(result.piPeriodicRepayment)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{freqLabel}</p>
                  </div>
                </div>
              )}

              {/* Breakdown */}
              <div className="px-6 py-4 space-y-0">
                <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                  <span className="text-gray-400 text-xs">贷款金额</span>
                  <span className="text-gray-600 text-xs tabular-nums">{fmtWhole(loanAmount)}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                  <span className="text-gray-400 text-xs">年利率</span>
                  <span className="text-gray-600 text-xs">{annualRate}%</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                  <span className="text-gray-400 text-xs">还款年限</span>
                  <span className="text-gray-600 text-xs">
                    {termYears} 年（{result.totalPeriods} 期）
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-gray-400 text-xs">总利息</span>
                  <span className="text-gray-500 text-xs tabular-nums">
                    {fmtWhole(result.totalInterest)}
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="px-4 pb-4">
                <p className="text-xs text-gray-400 leading-relaxed bg-gray-50 rounded-lg px-3 py-2.5">
                  以上为估算，实际还款额以银行确认为准。
                  {result.kind === "io" && "利息期满后，本金全额转入本息还款。"}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl font-bold">$</span>
              </div>
              <p className="text-gray-500 font-medium mb-1">
                请填写贷款信息查看还款估算
              </p>
              <p className="text-gray-400 text-sm">结果将实时更新</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-navy rounded-2xl p-6 text-center">
          <p className="text-white font-semibold text-base mb-1">
            不知道该选哪家银行？
          </p>
          <p className="text-white/60 text-sm mb-4">
            比较超过40家贷款机构，为您的情况推荐最合适的房贷选项
          </p>
          <Link
            href="/contact"
            className="inline-block bg-coral hover:bg-coral/90 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg w-full text-center"
          >
            免费房贷咨询 →
          </Link>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed px-1">
          以上结果仅供参考，不构成财务建议。实际利率因贷款机构、信用状况和产品不同而存在差异。
        </p>
      </div>
    </div>
  );
}

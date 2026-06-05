"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────

type State = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";
type BuyerType = "owner" | "investor" | "fhb";
type PropertyType = "established" | "new" | "vacant";
type VicTxType = "electronic" | "paper";
type WALocation = "south" | "north";

interface CalcResult {
  fullDuty: number;
  stampDuty: number;
  fhbSaving: number;
  concessionLabel: string;
  foreignSurcharge: number;
  mortgageReg: number;
  transferFee: number;
  total: number;
  notes: string[];
}

interface Grant {
  amount: number;
  label: string;
  desc: string;
}

interface CalcOptions {
  vicPensioner?: boolean;
  vicTxType?: VicTxType;
  actIncome?: number;
  actChildren?: number;
  actPensioner?: boolean;
  tasPensioner?: boolean;
  tasPriorValue?: number;
}

// ACT income limits (1 July 2025)
const ACT_INCOME_LIMITS = [250000, 254600, 259200, 263800, 268400, 273000];
// index = number of dependants (5 = 5+)

// ── Formatters ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-AU");
}

function parsePrice(s: string): number {
  return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
}

// ── Fee helpers ────────────────────────────────────────────────────────────────

function waTransferFee(p: number): number {
  const tiers = [85000,120000,200000,300000,400000,500000,600000,700000,800000,
    900000,1000000,1100000,1200000,1300000,1400000,1500000,1600000,1700000,
    1800000,1900000,2000000];
  const fees  = [216.60,226.60,246.60,266.60,286.60,306.60,326.60,346.60,
    366.60,386.60,406.60,426.60,446.60,466.60,486.60,506.60,
    526.60,546.60,566.60,586.60,606.60];
  for (let i = 0; i < tiers.length; i++) {
    if (p <= tiers[i]) return fees[i];
  }
  return 606.60 + Math.ceil((p - 2000000) / 100000) * 20;
}

function saTransferFee(p: number): number {
  if (p <= 5000) return 198;
  if (p <= 20000) return 221;
  if (p <= 40000) return 243;
  if (p <= 50000) return 342;
  return 342 + Math.ceil((p - 50000) / 10000) * 102;
}

// ── State calculators ──────────────────────────────────────────────────────────

function calcNSW(price: number, buyerType: BuyerType, propType: PropertyType, overseas: boolean): CalcResult {
  function std(p: number): number {
    if (p <= 17000) return p * 0.0125;
    if (p <= 37000) return 212 + (p - 17000) * 0.015;
    if (p <= 99000) return 512 + (p - 37000) * 0.0175;
    if (p <= 372000) return 1597 + (p - 99000) * 0.035;
    if (p <= 1240000) return 11152 + (p - 372000) * 0.045;
    if (p <= 3721000) return 50212 + (p - 1240000) * 0.055;
    return 186667 + (p - 3721000) * 0.07;
  }
  const fullDuty = std(price);
  let duty = fullDuty;
  let fhbSaving = 0;
  if (buyerType === "fhb") {
    if (propType !== "vacant") {
      if (price <= 800000) { fhbSaving = fullDuty; duty = 0; }
      else if (price < 1000000) { fhbSaving = fullDuty * (1000000 - price) / 200000; duty = fullDuty - fhbSaving; }
    } else {
      if (price <= 350000) { fhbSaving = fullDuty; duty = 0; }
      else if (price < 450000) { fhbSaving = fullDuty * (450000 - price) / 100000; duty = fullDuty - fhbSaving; }
    }
  }
  const foreignSurcharge = overseas ? price * 0.09 : 0;
  return { fullDuty, stampDuty: duty, fhbSaving, concessionLabel: "首次购房优惠",
    foreignSurcharge, mortgageReg: 175.70, transferFee: 175.70,
    total: duty + foreignSurcharge + 175.70 + 175.70, notes: [] };
}

function calcVIC(price: number, buyerType: BuyerType, overseas: boolean, pensioner: boolean, txType: VicTxType): CalcResult {
  function nonPPR(p: number): number {
    if (p > 2000000) return 110000 + (p - 2000000) * 0.065;
    if (p > 960000) return p * 0.055;
    if (p > 130000) return 2870 + (p - 130000) * 0.06;
    if (p > 25000) return 350 + (p - 25000) * 0.024;
    return p * 0.014;
  }
  function ppr(p: number): number {
    if (p > 550000) return nonPPR(p);
    if (p > 440000) return 18370 + (p - 440000) * 0.06;
    if (p > 130000) return 2870 + (p - 130000) * 0.05;
    if (p > 25000) return 350 + (p - 25000) * 0.024;
    return p * 0.014;
  }
  const fullDuty = buyerType === "investor" ? nonPPR(price) : ppr(price);
  let duty = fullDuty;
  let fhbSaving = 0;
  let concessionLabel = "首次购房优惠";
  const shouldApplyConc = buyerType === "fhb" || (pensioner && buyerType !== "investor");
  if (shouldApplyConc) {
    if (pensioner && buyerType !== "fhb") concessionLabel = "养老金持有人优惠";
    if (price <= 600000) { fhbSaving = fullDuty; duty = 0; }
    else if (price < 750000) { fhbSaving = fullDuty * (750000 - price) / 150000; duty = fullDuty - fhbSaving; }
  }
  const foreignSurcharge = overseas ? price * 0.08 : 0;
  const mortgageReg = txType === "paper" ? 135.80 : 125.70;
  const transferBase = txType === "paper" ? 111.80 : 101.50;
  const transferCap  = txType === "paper" ? 3621  : 3611;
  const transferFee = Math.min(transferBase + (price / 1000) * 2.34, transferCap);
  return { fullDuty, stampDuty: duty, fhbSaving, concessionLabel,
    foreignSurcharge, mortgageReg, transferFee,
    total: duty + foreignSurcharge + mortgageReg + transferFee, notes: [] };
}

function calcQLD(price: number, buyerType: BuyerType, propType: PropertyType, overseas: boolean): CalcResult {
  function standard(p: number): number {
    if (p <= 5000) return 0;
    if (p <= 75000) return (p - 5000) * 0.015;
    if (p <= 540000) return 1050 + (p - 75000) * 0.035;
    if (p <= 1000000) return 17325 + (p - 540000) * 0.045;
    return 38025 + (p - 1000000) * 0.0575;
  }
  function homeConc(p: number): number {
    if (p <= 350000) return p / 100;
    if (p <= 540000) return 3500 + (p - 350000) * 0.035;
    if (p <= 1000000) return 10150 + (p - 540000) * 0.045;
    return 30850 + (p - 1000000) * 0.0575;
  }
  const fullDuty = buyerType === "investor" ? standard(price) : homeConc(price);
  let duty = fullDuty;
  let fhbSaving = 0;
  const notes: string[] = [];
  if (buyerType === "fhb") {
    if (propType !== "established") {
      fhbSaving = duty; duty = 0;
      notes.push("新房/空地无印花税（2025年5月起）");
    } else {
      let rebate = 0;
      if (price <= 709999) rebate = 17350;
      else if (price <= 719999) rebate = 15615;
      else if (price <= 729999) rebate = 13880;
      else if (price <= 739999) rebate = 12145;
      else if (price <= 749999) rebate = 10410;
      else if (price <= 759999) rebate = 8675;
      else if (price <= 769999) rebate = 6940;
      else if (price <= 779999) rebate = 5205;
      else if (price <= 789999) rebate = 3470;
      else if (price <= 799999) rebate = 1735;
      rebate = Math.min(rebate, duty);
      fhbSaving = rebate; duty -= rebate;
    }
  }
  const foreignSurcharge = overseas ? price * 0.08 : 0;
  const transferFee = 238.14 + (price > 180000 ? Math.ceil((price - 180000) / 10000) * 44.71 : 0);
  return { fullDuty, stampDuty: duty, fhbSaving, concessionLabel: "首次购房优惠",
    foreignSurcharge, mortgageReg: 238.14, transferFee,
    total: duty + foreignSurcharge + 238.14 + transferFee, notes };
}

function calcWA(price: number, buyerType: BuyerType, propType: PropertyType, overseas: boolean): CalcResult {
  function standard(p: number): number {
    if (p <= 120000) return p * 0.019;
    if (p <= 150000) return 2280 + (p - 120000) * 0.0285;
    if (p <= 360000) return 3135 + (p - 150000) * 0.038;
    if (p <= 725000) return 11115 + (p - 360000) * 0.0475;
    return 28453 + (p - 725000) * 0.0515;
  }
  const fullDuty = standard(price);
  let duty = fullDuty;
  let fhbSaving = 0;
  if (buyerType === "fhb") {
    if (propType !== "vacant") {
      if (price <= 600000) { fhbSaving = fullDuty; duty = 0; }
      else if (price <= 800000) { duty = (price - 600000) * 0.1615; fhbSaving = fullDuty - duty; }
    } else {
      if (price <= 450000) { fhbSaving = fullDuty; duty = 0; }
      else if (price <= 550000) { duty = (price - 450000) * 0.2014; fhbSaving = fullDuty - duty; }
    }
  }
  const foreignSurcharge = overseas ? price * 0.07 : 0;
  const transferFee = waTransferFee(price);
  return { fullDuty, stampDuty: duty, fhbSaving, concessionLabel: "首次购房优惠",
    foreignSurcharge, mortgageReg: 216.60, transferFee,
    total: duty + foreignSurcharge + 216.60 + transferFee, notes: [] };
}

function calcSA(price: number, buyerType: BuyerType, propType: PropertyType, overseas: boolean): CalcResult {
  function standard(p: number): number {
    if (p <= 12000) return p * 0.01;
    if (p <= 30000) return 120 + (p - 12000) * 0.02;
    if (p <= 50000) return 480 + (p - 30000) * 0.03;
    if (p <= 100000) return 1080 + (p - 50000) * 0.035;
    if (p <= 200000) return 2830 + (p - 100000) * 0.04;
    if (p <= 250000) return 6830 + (p - 200000) * 0.0425;
    if (p <= 300000) return 8955 + (p - 250000) * 0.0475;
    if (p <= 500000) return 11330 + (p - 300000) * 0.05;
    return 21330 + (p - 500000) * 0.055;
  }
  const fullDuty = standard(price);
  let duty = fullDuty;
  let fhbSaving = 0;
  const notes: string[] = [];
  if (buyerType === "fhb") {
    notes.push("仅适用于新房/空地，现房不享有优惠");
    if (propType !== "established") { fhbSaving = duty; duty = 0; }
  }
  const foreignSurcharge = overseas ? price * 0.07 : 0;
  const transferFee = saTransferFee(price);
  return { fullDuty, stampDuty: duty, fhbSaving, concessionLabel: "首次购房优惠",
    foreignSurcharge, mortgageReg: 198, transferFee,
    total: duty + foreignSurcharge + 198 + transferFee, notes };
}

function calcTAS(
  price: number, buyerType: BuyerType, propType: PropertyType, overseas: boolean,
  tasPensioner: boolean, tasPriorValue: number
): CalcResult {
  function standard(p: number): number {
    if (p <= 3000) return 50;
    if (p <= 25000) return 50 + (p - 3000) * 0.0175;
    if (p <= 75000) return 435 + (p - 25000) * 0.0225;
    if (p <= 200000) return 1560 + (p - 75000) * 0.035;
    if (p <= 375000) return 5935 + (p - 200000) * 0.04;
    if (p <= 725000) return 12935 + (p - 375000) * 0.0425;
    return 27810 + (p - 725000) * 0.045;
  }
  const fullDuty = standard(price);
  let duty = fullDuty;
  let fhbSaving = 0;
  let concessionLabel = "首次购房优惠";
  const notes: string[] = [];

  // FHB exemption (established ≤$750k, valid until 30 June 2026)
  if (buyerType === "fhb" && propType === "established" && price <= 750000) {
    fhbSaving = duty; duty = 0;
  }

  // Pensioner downsizing concession (from 1 Jan 2022)
  // Condition: new price ≤ $600k AND new price < prior property value
  if (tasPensioner) {
    if (tasPriorValue <= 0) {
      notes.push("请输入原有房产价值以计算养老金优惠");
    } else {
      const qualifies = price <= 600000 && price < tasPriorValue;
      if (qualifies) {
        const pensionerDuty = fullDuty * 0.5;
        if (pensionerDuty < duty) {
          concessionLabel = "退休换小房优惠（-50%）";
          fhbSaving = fullDuty - pensionerDuty;
          duty = pensionerDuty;
        }
      } else {
        notes.push("不符合养老金缩房优惠条件（新房产需 ≤$600k 且低于原房产价值）");
      }
    }
  }

  const foreignSurcharge = overseas ? price * 0.08 : 0;
  return { fullDuty, stampDuty: duty, fhbSaving, concessionLabel,
    foreignSurcharge, mortgageReg: 163.30, transferFee: 250.21,
    total: duty + foreignSurcharge + 163.30 + 250.21, notes };
}

function calcACT(
  price: number, buyerType: BuyerType,
  income: number, children: number, pensioner: boolean
): CalcResult {
  function ownerRate(p: number): number {
    if (p <= 260000) return p * 0.0028;
    if (p <= 300000) return 728 + (p - 260000) * 0.022;
    if (p <= 500000) return 1608 + (p - 300000) * 0.034;
    if (p <= 750000) return 8408 + (p - 500000) * 0.0432;
    if (p <= 1000000) return 19208 + (p - 750000) * 0.059;
    if (p <= 1455000) return 33958 + (p - 1000000) * 0.064;
    return p * 0.0454;
  }
  function nonOwnerRate(p: number): number {
    if (p <= 200000) return p * 0.012;
    if (p <= 300000) return 2400 + (p - 200000) * 0.022;
    if (p <= 500000) return 4600 + (p - 300000) * 0.034;
    if (p <= 750000) return 11400 + (p - 500000) * 0.0432;
    if (p <= 1000000) return 22200 + (p - 750000) * 0.059;
    if (p <= 1455000) return 36950 + (p - 1000000) * 0.064;
    return p * 0.0454;
  }

  const fullDuty = buyerType === "investor" ? nonOwnerRate(price) : ownerRate(price);
  let duty = fullDuty;
  let fhbSaving = 0;
  let concessionLabel = "首次购房优惠 (HBCS)";
  const notes: string[] = [];

  // FHB: Home Buyer Concession Scheme (income-tested)
  let hbcsApplied = false;
  if (buyerType === "fhb") {
    if (income <= 0) {
      notes.push("请输入家庭年收入以计算 Home Buyer Concession 资格");
    } else {
      const limit = ACT_INCOME_LIMITS[Math.min(children, 5)];
      if (income > limit) {
        notes.push("收入超过资格上限，无法享受 Home Buyer Concession");
      } else {
        hbcsApplied = true;
        if (price <= 1020000) {
          fhbSaving = fullDuty; duty = 0;
        } else if (price <= 1455000) {
          duty = (price - 1020000) * 0.06;
          fhbSaving = fullDuty - duty;
        } else {
          duty = Math.max(0, price * 0.064 - 35238);
          fhbSaving = fullDuty - duty;
        }
      }
    }
  }

  // Pensioner concession (any buyer type; skip if HBCS already applied)
  if (pensioner && !hbcsApplied) {
    concessionLabel = "养老金持有人优惠";
    const base = duty;
    if (price <= 1020000) {
      fhbSaving = base; duty = 0;
    } else {
      const payable = Math.max(0, base - 35238);
      fhbSaving = base - payable; duty = payable;
    }
  }

  return { fullDuty, stampDuty: duty, fhbSaving, concessionLabel,
    foreignSurcharge: 0, mortgageReg: 178, transferFee: 479,
    total: duty + 178 + 479, notes };
}

function calcNT(price: number): CalcResult {
  let duty: number;
  if (price <= 525000) {
    const V = price / 1000;
    duty = 0.06571441 * V * V + 15 * V;
  } else if (price <= 3000000) {
    duty = price * 0.0495;
  } else if (price <= 5000000) {
    duty = price * 0.0575;
  } else {
    duty = price * 0.0595;
  }
  return { fullDuty: duty, stampDuty: duty, fhbSaving: 0, concessionLabel: "",
    foreignSurcharge: 0, mortgageReg: 176, transferFee: 176,
    total: duty + 176 + 176, notes: [] };
}

function calculate(
  state: State, price: number, buyerType: BuyerType,
  propType: PropertyType, overseas: boolean, opts: CalcOptions = {}
): CalcResult {
  const raw = (() => {
    switch (state) {
      case "NSW": return calcNSW(price, buyerType, propType, overseas);
      case "VIC": return calcVIC(price, buyerType, overseas, opts.vicPensioner ?? false, opts.vicTxType ?? "electronic");
      case "QLD": return calcQLD(price, buyerType, propType, overseas);
      case "WA":  return calcWA(price, buyerType, propType, overseas);
      case "SA":  return calcSA(price, buyerType, propType, overseas);
      case "TAS": return calcTAS(price, buyerType, propType, overseas, opts.tasPensioner ?? false, opts.tasPriorValue ?? 0);
      case "ACT": return calcACT(price, buyerType, opts.actIncome ?? 0, opts.actChildren ?? 0, opts.actPensioner ?? false);
      case "NT":  return calcNT(price);
    }
  })();

  // Overseas buyers are not eligible for any FHB concession
  if (overseas && buyerType === "fhb" && raw.fhbSaving > 0) {
    return {
      ...raw,
      stampDuty: raw.fullDuty,
      fhbSaving: 0,
      total: raw.fullDuty + raw.foreignSurcharge + raw.mortgageReg + raw.transferFee,
      notes: [],
    };
  }
  return raw;
}

// ── FHOG grants ────────────────────────────────────────────────────────────────

function getGrant(state: State, price: number, propType: PropertyType, waLocation: WALocation = "south"): Grant | null {
  if (propType === "established") return null;
  switch (state) {
    case "NSW":
      if (propType === "new" && price <= 600000) return { amount: 10000, label: "首次置业补助 (FHOG)", desc: "新房 ≤$600k" };
      if (propType === "vacant" && price <= 750000) return { amount: 10000, label: "首次置业补助 (FHOG)", desc: "空地建房 ≤$750k" };
      return null;
    case "VIC":
      return (propType === "new" && price <= 750000) ? { amount: 10000, label: "首次置业补助 (FHOG)", desc: "新房 ≤$750k" } : null;
    case "QLD":
      return (propType === "new" && price <= 750000) ? { amount: 30000, label: "首次置业补助 (FHOG)", desc: "新房 ≤$750k" } : null;
    case "WA": {
      if (propType !== "new") return null;
      const limit = waLocation === "north" ? 1000000 : 800000;
      const region = waLocation === "north" ? "南纬26度以北" : "南纬26度以南";
      return price <= limit ? { amount: 10000, label: "首次置业补助 (FHOG)", desc: `新房 ≤${limit >= 1000000 ? "$1,000k" : "$800k"}（${region}）` } : null;
    }
    case "SA":
      return (propType === "new") ? { amount: 15000, label: "首次置业补助 (FHOG)", desc: "新房（无价格上限）" } : null;
    case "TAS":
      return (propType === "new") ? { amount: 10000, label: "首次置业补助 (FHOG)", desc: "新房" } : null;
    case "NT":
      return { amount: 50000, label: "HomeGrown Grant", desc: "购买或建造新房" };
    case "ACT":
      return null;
  }
}

// ── UI helpers ─────────────────────────────────────────────────────────────────

function chipCls(selected: boolean) {
  return [
    "px-4 py-2.5 rounded-lg border cursor-pointer text-sm transition-all duration-150 select-none",
    selected
      ? "border-coral bg-coral/5 text-coral font-medium"
      : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white",
  ].join(" ");
}

function inputCls(err?: boolean) {
  return [
    "w-full border rounded-lg px-4 py-3 text-sm text-gray-800 bg-white",
    "focus:outline-none focus:ring-2 transition-colors",
    err ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-coral/30 focus:border-coral",
  ].join(" ");
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-navy font-semibold text-base pb-2 mb-5 border-b border-gray-100">
      {children}
    </h3>
  );
}

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <div onClick={onToggle}
        className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${on ? "bg-coral" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0"}`} />
      </div>
      <span className="text-sm text-gray-700 font-medium select-none">{label}</span>
    </label>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function StampDutyPage() {
  const [state, setState]         = useState<State | "">("");
  const [priceStr, setPriceStr]   = useState("");
  const [buyerType, setBuyerType] = useState<BuyerType>("owner");
  const [propType, setPropType]   = useState<PropertyType>("established");
  const [overseas, setOverseas]   = useState(false);
  const [vicPensioner, setVicPensioner] = useState(false);
  const [vicTxType, setVicTxType]       = useState<VicTxType>("electronic");
  const [actIncomeStr, setActIncomeStr] = useState("");
  const [actChildren, setActChildren]   = useState(0);
  const [actPensioner, setActPensioner] = useState(false);
  const [tasPensioner, setTasPensioner] = useState(false);
  const [tasPriorStr, setTasPriorStr]   = useState("");
  const [waLocation, setWaLocation]     = useState<WALocation>("south");
  const [priceErr, setPriceErr]   = useState(false);

  const price = parsePrice(priceStr);

  const actIncome   = parsePrice(actIncomeStr);
  const tasPriorValue = parsePrice(tasPriorStr);

  const result = useMemo<CalcResult | null>(() => {
    if (!state || !price || price <= 0) return null;
    return calculate(state as State, price, buyerType, propType, overseas,
      { vicPensioner, vicTxType, actIncome, actChildren, actPensioner, tasPensioner, tasPriorValue });
  }, [state, price, buyerType, propType, overseas, vicPensioner, vicTxType, actIncome, actChildren, actPensioner, tasPensioner, tasPriorValue]);

  const grant = useMemo<Grant | null>(() => {
    if (!state || !price || buyerType !== "fhb" || overseas) return null;
    if (propType !== "new" && propType !== "vacant") return null;
    return getGrant(state as State, price, propType, waLocation);
  }, [state, price, buyerType, propType, overseas, waLocation]);

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setPriceStr(raw ? Number(raw).toLocaleString("en-AU") : "");
    setPriceErr(false);
  }

  const net = result && grant ? Math.max(0, result.total - grant.amount) : null;

  const stampDutyFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "印花税什么时候支付？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "通常在房产交割日（Settlement）支付，部分州可在签合同后一定期限内支付。具体以各州规定及合同条款为准。",
        },
      },
      {
        "@type": "Question",
        name: "印花税可以加入贷款吗？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "大多数情况下不可以，印花税需要自备资金支付，是购房前期费用的重要组成部分，购房前请务必将其纳入预算规划。",
        },
      },
      {
        "@type": "Question",
        name: "首次购房者一定能享受印花税减免吗？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "需满足一定条件，包括：从未持有过澳洲房产、将房产作为主要居所居住、房产价值在各州规定的上限以内等。具体条件因州而异。",
        },
      },
      {
        "@type": "Question",
        name: "海外买家是否可以享受首次购房者优惠？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "不可以，海外买家不享有任何首次购房者印花税优惠，且须额外缴纳海外买家附加税（各州7%-9%不等）。",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stampDutyFaqSchema) }}
      />
      {/* ── Hero ── */}
      <section className="bg-navy py-14 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <span className="inline-flex items-center bg-coral/10 border border-coral/30 text-coral rounded-full px-5 py-2 text-sm font-medium mb-5">
            2025–26 官方税率
          </span>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3">
            印花税计算器
          </h1>
          <p className="text-white/60 text-base sm:text-lg">
            全澳洲各州及领地印花税估算，涵盖首次购房优惠与海外买家附加税
          </p>
        </div>
      </section>

      {/* ── Main ── */}
      <section className="bg-warm-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[11fr_9fr] lg:gap-8 space-y-8 lg:space-y-0 items-start">

            {/* ── Left: Form ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">

              {/* 基础信息 */}
              <div>
                <SectionTitle>基础信息</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      州/领地 <span className="text-coral">*</span>
                    </label>
                    <select value={state}
                      onChange={(e) => setState(e.target.value as State | "")}
                      className={inputCls()}>
                      <option value="">请选择</option>
                      {(["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"] as State[]).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      房产价格（澳币）<span className="text-coral">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input type="text" inputMode="numeric" value={priceStr}
                        onChange={handlePriceChange}
                        onBlur={() => setPriceErr(!priceStr)}
                        placeholder="800,000"
                        className={`${inputCls(priceErr)} pl-7`} />
                    </div>
                    {priceErr && <p className="text-red-500 text-xs mt-1.5">请输入房产价格</p>}
                  </div>
                </div>
              </div>

              {/* 买家类型 */}
              <div>
                <SectionTitle>买家类型</SectionTitle>
                <div className="flex flex-wrap gap-3">
                  {([["owner","自住"],["investor","投资"],["fhb","首次购房者"]] as [BuyerType,string][]).map(([val,label]) => (
                    <label key={val} className={chipCls(buyerType === val)}>
                      <input type="radio" className="sr-only" checked={buyerType === val} onChange={() => setBuyerType(val)} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* 房产类型 */}
              <div>
                <SectionTitle>房产类型</SectionTitle>
                <div className="flex flex-wrap gap-3">
                  {([
                    ["established","现房（二手房）"],
                    ["new","新房（期房/新建）"],
                    ["vacant","空地"],
                  ] as [PropertyType,string][]).map(([val,label]) => (
                    <label key={val} className={chipCls(propType === val)}>
                      <input type="radio" className="sr-only" checked={propType === val} onChange={() => setPropType(val)} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* 其他信息 */}
              <div>
                <SectionTitle>其他信息</SectionTitle>
                <div className="space-y-5">
                  {state === "NT" ? (
                    <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                      北领地不征收海外买家附加税
                    </p>
                  ) : (
                    <>
                      <Toggle on={overseas} onToggle={() => setOverseas(v => !v)}
                        label="海外买家（非澳洲公民/PR）" />
                      {overseas && state === "ACT" && (
                        <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-4 py-2.5">
                          ACT 暂无海外买家附加税
                        </p>
                      )}
                    </>
                  )}

                  {/* WA-only options */}
                  {state === "WA" && (
                    <div className="rounded-xl border border-navy/10 bg-navy/[0.02] p-5">
                      <p className="text-xs font-medium text-navy/50 uppercase tracking-wide mb-4">WA 专属选项</p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          房产位置
                        </label>
                        <select
                          value={waLocation}
                          onChange={(e) => setWaLocation(e.target.value as WALocation)}
                          className={inputCls()}
                        >
                          <option value="south">南纬26度以南（South of the 26th parallel）— 适用大部分WA地区，包括珀斯</option>
                          <option value="north">南纬26度以北（North of the 26th parallel）— 如 Denham 6537 以北偏远地区</option>
                        </select>
                        {buyerType === "fhb" && (propType === "new" || propType === "vacant") && (
                          <p className="text-xs text-gray-500 mt-2">
                            FHOG 上限：{waLocation === "north" ? "≤$1,000,000（南纬26度以北）" : "≤$800,000（南纬26度以南）"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAS-only options */}
                  {state === "TAS" && (
                    <div className="rounded-xl border border-navy/10 bg-navy/[0.02] p-5 space-y-5">
                      <p className="text-xs font-medium text-navy/50 uppercase tracking-wide">TAS 专属选项</p>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2.5">
                          是否符合退休换小房优惠？
                        </p>
                        <div className="flex gap-3">
                          {([["true","是"],["false","否"]] as [string,string][]).map(([val, label]) => (
                            <label key={val} className={chipCls(String(tasPensioner) === val)}>
                              <input type="radio" className="sr-only"
                                checked={String(tasPensioner) === val}
                                onChange={() => setTasPensioner(val === "true")} />
                              {label}
                            </label>
                          ))}
                        </div>
                        {tasPensioner && (
                          <p className="text-xs text-gray-500 mt-2">
                            退休人士出售现有住房并购买价值≤$600,000的更小房产，可享50%印花税折扣
                          </p>
                        )}
                      </div>

                      {tasPensioner && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            原有房产价值（澳元）
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={tasPriorStr}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/[^0-9]/g, "");
                                setTasPriorStr(raw ? Number(raw).toLocaleString("en-AU") : "");
                              }}
                              placeholder="您出售的原有房产价值"
                              className={`${inputCls()} pl-7`}
                            />
                          </div>
                          {tasPriorValue > 0 && price > 0 && (
                            <p className={`text-xs mt-1.5 ${
                              price <= 600000 && price < tasPriorValue
                                ? "text-green-600"
                                : "text-red-500"
                            }`}>
                              {price <= 600000 && price < tasPriorValue
                                ? "✓ 符合退休换小房优惠条件，印花税减半"
                                : price > 600000
                                  ? "✗ 新房产超过 $600k，不符合条件"
                                  : "✗ 新房产价值须低于原有房产价值"}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ACT-only options */}
                  {state === "ACT" && (
                    <div className="rounded-xl border border-navy/10 bg-navy/[0.02] p-5 space-y-5">
                      <p className="text-xs font-medium text-navy/50 uppercase tracking-wide">ACT 专属选项</p>

                      {/* Pensioner */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2.5">
                          养老金持有人（Pensioner）
                        </p>
                        <div className="flex gap-3">
                          {([["true","是"],["false","否"]] as [string,string][]).map(([val,label]) => (
                            <label key={val} className={chipCls(String(actPensioner) === val)}>
                              <input type="radio" className="sr-only"
                                checked={String(actPensioner) === val}
                                onChange={() => setActPensioner(val === "true")} />
                              {label}
                            </label>
                          ))}
                        </div>
                        {actPensioner && (
                          <p className="text-xs text-gray-500 mt-2">≤$1,020k 全免；{'>'}{' '}$1,020k 应付税额减 $35,238</p>
                        )}
                      </div>

                      {/* FHB income check (only when FHB selected) */}
                      {buyerType === "fhb" && (
                        <>
                          {/* Household income */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              所有购买者合计年收入（澳元）
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={actIncomeStr}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, "");
                                  setActIncomeStr(raw ? Number(raw).toLocaleString("en-AU") : "");
                                }}
                                placeholder="250,000"
                                className={`${inputCls()} pl-7`}
                              />
                            </div>
                            {actIncome > 0 && (
                              <p className={`text-xs mt-1.5 ${
                                actIncome <= ACT_INCOME_LIMITS[Math.min(actChildren, 5)]
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}>
                                收入上限：{fmt(ACT_INCOME_LIMITS[Math.min(actChildren, 5)])}
                                {actIncome <= ACT_INCOME_LIMITS[Math.min(actChildren, 5)]
                                  ? " ✓ 符合 HBCS 收入要求"
                                  : " ✗ 超出上限，不享优惠"}
                              </p>
                            )}
                          </div>

                          {/* Number of children */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2.5">
                              家庭受抚养子女数量
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {([0,1,2,3,4,5] as number[]).map((n) => (
                                <label key={n} className={chipCls(actChildren === n)}>
                                  <input type="radio" className="sr-only"
                                    checked={actChildren === n}
                                    onChange={() => setActChildren(n)} />
                                  {n === 5 ? "5+" : n}
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* VIC-only options */}
                  {state === "VIC" && (
                    <div className="rounded-xl border border-navy/10 bg-navy/[0.02] p-5 space-y-5">
                      <p className="text-xs font-medium text-navy/50 uppercase tracking-wide">VIC 专属选项</p>

                      {/* Pensioner */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2.5">
                          养老金持有人（Pensioner）
                        </p>
                        <div className="flex gap-3">
                          {([["true","是"],["false","否"]] as [string,string][]).map(([val,label]) => (
                            <label key={val} className={chipCls(String(vicPensioner) === val)}>
                              <input type="radio" className="sr-only"
                                checked={String(vicPensioner) === val}
                                onChange={() => setVicPensioner(val === "true")} />
                              {label}
                            </label>
                          ))}
                        </div>
                        {vicPensioner && (
                          <p className="text-xs text-gray-500 mt-2">≤$600k 全免；$600k–$750k 按比例递减</p>
                        )}
                      </div>

                      {/* Transaction type */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2.5">交易方式</p>
                        <div className="flex gap-3">
                          {([["electronic","电子交易"],["paper","纸质交易"]] as [VicTxType,string][]).map(([val,label]) => (
                            <label key={val} className={chipCls(vicTxType === val)}>
                              <input type="radio" className="sr-only"
                                checked={vicTxType === val}
                                onChange={() => setVicTxType(val)} />
                              {label}
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {vicTxType === "electronic"
                            ? "按揭登记 $125.70 · 土地转让 $101.50 起（上限 $3,611）"
                            : "按揭登记 $135.80 · 土地转让 $111.80 起（上限 $3,621）"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right: Results + CTA ── */}
            <div className="space-y-5">

              {/* Results card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-navy font-semibold text-lg">费用估算</h3>
                </div>

                {result ? (
                  <div>
                    {/* Overseas + FHB warning */}
                    {overseas && buyerType === "fhb" && (
                      <div className="mx-4 mt-4 flex gap-2 bg-coral/5 border border-coral/30 rounded-xl px-4 py-3">
                        <span className="text-coral shrink-0 font-bold text-sm">!</span>
                        <p className="text-coral text-xs leading-relaxed font-medium">
                          注意：海外买家不享有首次购房者印花税优惠
                        </p>
                      </div>
                    )}

                    {/* Line items */}
                    <div className="px-6 pt-2 pb-4 space-y-0">

                      {/* Stamp duty */}
                      {result.fhbSaving > 0 ? (
                        <>
                          <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-gray-500 text-sm">印花税（原价）</span>
                            <span className="text-gray-400 text-sm line-through tabular-nums">{fmt(result.fullDuty)}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-green-700 text-sm font-medium">{result.concessionLabel}</span>
                            <span className="text-green-700 text-sm font-semibold tabular-nums">−{fmt(result.fhbSaving)}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-gray-700 text-sm font-medium">实际印花税</span>
                            <span className="text-gray-900 text-sm font-semibold tabular-nums">{fmt(result.stampDuty)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                          <span className="text-gray-500 text-sm">印花税</span>
                          <span className="text-gray-900 text-sm font-semibold tabular-nums">{fmt(result.stampDuty)}</span>
                        </div>
                      )}

                      {/* Foreign surcharge */}
                      {result.foreignSurcharge > 0 && (
                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                          <span className="text-red-600 text-sm">海外买家附加税</span>
                          <span className="text-red-600 text-sm font-semibold tabular-nums">{fmt(result.foreignSurcharge)}</span>
                        </div>
                      )}

                      {/* Fixed fees */}
                      <div className="flex justify-between items-center py-3 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">按揭登记费</span>
                        <span className="text-gray-900 text-sm font-semibold tabular-nums">{fmt(result.mortgageReg)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">土地转让费</span>
                        <span className="text-gray-900 text-sm font-semibold tabular-nums">{fmt(result.transferFee)}</span>
                      </div>
                    </div>

                    {/* Total – prominent navy block */}
                    <div className="bg-navy mx-4 mb-4 rounded-xl px-5 py-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/75 font-medium text-sm">费用总计</span>
                        <span className="text-white font-bold text-2xl tabular-nums">{fmt(result.total)}</span>
                      </div>
                    </div>

                    {/* Grant + net */}
                    {grant ? (
                      <div className="px-4 pb-4 space-y-2">
                        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="text-green-800 text-sm font-semibold">{grant.label}</span>
                              <p className="text-green-600 text-xs mt-0.5">{grant.desc} · 政府补助（不计入印花税）</p>
                            </div>
                            <span className="text-green-800 font-bold text-base tabular-nums shrink-0 ml-3">{fmt(grant.amount)}</span>
                          </div>
                        </div>
                        {net !== null && (
                          <div className="flex justify-between items-center px-1 pt-1">
                            <span className="text-gray-700 text-sm font-semibold">实际净支出（扣除补助）</span>
                            <span className="text-navy font-bold text-lg tabular-nums">{fmt(net)}</span>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Notes */}
                    {result.notes.length > 0 && (
                      <div className="px-4 pb-4 space-y-2">
                        {result.notes.map((note, i) => (
                          <div key={i} className="flex gap-2 bg-blue-50 rounded-lg px-3 py-2.5">
                            <span className="text-blue-500 shrink-0 text-xs mt-0.5">ℹ</span>
                            <p className="text-xs text-blue-700 leading-relaxed">{note}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 px-6">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl font-bold">$</span>
                    </div>
                    <p className="text-gray-500 font-medium mb-1">请选择州份并输入房产价格</p>
                    <p className="text-gray-400 text-sm">结果将实时显示</p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-navy rounded-2xl p-6 text-center">
                <p className="text-white font-semibold text-base mb-1">不知道该选哪家银行？</p>
                <p className="text-white/60 text-sm mb-4">比较超过40家贷款机构，为您的情况推荐最合适的房贷选项</p>
                <Link href="/contact"
                  className="inline-block bg-coral hover:bg-coral/90 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg w-full text-center">
                  免费房贷咨询 →
                </Link>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 leading-relaxed px-1">
                以上结果仅供参考，请在交割前向律师或产权转让师确认实际金额。税率基于2025–26财年官方数据，政府补助资格须另行申请确认。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEO Content ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div>
          <h2 className="text-xl font-bold text-navy mb-3">什么是印花税（Stamp Duty）？</h2>
          <p className="text-gray-600 leading-relaxed">
            印花税是澳洲各州政府对房产交易征收的税费，由买方在房产交割时支付。税率因州份、房产价值、买家身份（首次购房者、投资者或海外买家）而有所不同，是购房前期成本中最重要的一项，通常占房价的 3%–5%。
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy mb-3">首次购房者印花税优惠</h2>
          <p className="text-gray-600 leading-relaxed">
            澳洲各州均为首次购房者提供不同程度的印花税减免。以 NSW 为例，购买 $800,000 以下的住宅可获全额豁免，节省高达 $30,000+；VIC、QLD、WA 等州也有类似阶梯式减免政策。上方计算器已自动套用最新 2025–26 财年各州首次购房者减免标准。
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy mb-3">海外买家印花税附加税</h2>
          <p className="text-gray-600 leading-relaxed">
            非澳洲公民或永久居民购买住宅物业，需在正常印花税基础上额外缴纳海外买家附加税。各州税率为 7%–9% 不等（NSW 8%、VIC 8%、QLD 7%、SA 7%、WA 7%），购房预算中务必留出这笔额外费用。勾选上方「海外买家」选项即可自动纳入计算。
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-navy mb-8">常见问题</h2>
          <dl className="space-y-6">
            {stampDutyFaqSchema.mainEntity.map((item) => (
              <div key={item.name} className="bg-white rounded-xl border border-gray-100 px-6 py-5">
                <dt className="font-semibold text-navy mb-2">{item.name}</dt>
                <dd className="text-gray-600 text-sm leading-relaxed">{item.acceptedAnswer.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}

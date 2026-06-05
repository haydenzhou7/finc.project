"use client";

import { useState, useRef, Fragment } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Status = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  preferredContact: string;
  phone: string;
  email: string;
  wechat: string;
  loanType: string;
  loanAmount: string;
  state: string;
  firstHomeBuyer: string;
  propertyBudget: string;
  employmentStatus: string;
  residencyStatus: string;
  existingDebts: string[];
  existingDebtAmount: string;
  message: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PROPERTY_LOAN_TYPES = ["住房贷款", "转贷", "建筑贷款"];

const INITIAL: FormData = {
  name: "",
  preferredContact: "",
  phone: "",
  email: "",
  wechat: "",
  loanType: "",
  loanAmount: "",
  state: "",
  firstHomeBuyer: "",
  propertyBudget: "",
  employmentStatus: "",
  residencyStatus: "",
  existingDebts: [],
  existingDebtAmount: "",
  message: "",
};

const STEP_LABELS = ["贷款需求", "背景信息", "基础信息"];

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-navy font-semibold text-base pb-2 mb-5 border-b border-gray-100">
      {children}
    </h3>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1.5">{msg}</p>;
}

function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <p className="text-xs text-gray-400 mb-3 text-right">
        第 <span className="text-coral font-semibold">{current}</span> 步 / 共 3 步
      </p>
      <div className="flex items-start">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const done = num < current;
          const active = num === current;
          return (
            <Fragment key={num}>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200",
                    done
                      ? "bg-[#E8634A] border-[#E8634A] text-white"
                      : active
                      ? "bg-white border-[#E8634A] text-[#E8634A]"
                      : "bg-white border-gray-200 text-gray-400",
                  ].join(" ")}
                >
                  {done ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    num
                  )}
                </div>
                <span
                  className={[
                    "text-xs font-medium whitespace-nowrap",
                    active ? "text-[#E8634A]" : done ? "text-gray-500" : "text-gray-400",
                  ].join(" ")}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={[
                    "flex-1 h-0.5 mt-4 mx-2 transition-colors duration-300",
                    done ? "bg-[#E8634A]" : "bg-gray-200",
                  ].join(" ")}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(1);
  const [fading, setFading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const showPropertyFields = PROPERTY_LOAN_TYPES.includes(form.loanType);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function handleDebtToggle(debt: string) {
    setForm((prev) => {
      const current = prev.existingDebts;
      if (debt === "无") {
        return { ...prev, existingDebts: current.includes("无") ? [] : ["无"] };
      }
      const withoutNone = current.filter((d) => d !== "无");
      return {
        ...prev,
        existingDebts: withoutNone.includes(debt)
          ? withoutNone.filter((d) => d !== debt)
          : [...withoutNone, debt],
      };
    });
  }

  // ── Per-step validation ──────────────────────────────────────────────────────

  function validateStep(s: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.loanType) e.loanType = "请选择贷款类型";
      if (!form.loanAmount) e.loanAmount = "请选择贷款金额";
      if (!form.state) e.state = "请选择所在州或领地";
      if (showPropertyFields && !form.firstHomeBuyer) e.firstHomeBuyer = "请选择是否首次购房";
      if (showPropertyFields && !form.propertyBudget) e.propertyBudget = "请选择房产总价值";
    } else if (s === 2) {
      if (!form.employmentStatus) e.employmentStatus = "请选择就业状态";
      if (!form.residencyStatus) e.residencyStatus = "请选择居留身份";
    } else if (s === 3) {
      if (!form.name.trim()) e.name = "请填写姓名";
      if (!form.preferredContact) e.preferredContact = "请选择联系方式偏好";
      if (!form.phone.trim()) e.phone = "请填写电话";
      if (!form.email.trim()) {
        e.email = "请填写邮箱";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        e.email = "邮箱格式不正确";
      }
    }
    return e;
  }

  // ── Step navigation ──────────────────────────────────────────────────────────

  function goNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setFading(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setFading(false);
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  function goPrev() {
    setErrors({});
    setFading(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setFading(false);
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateStep(3);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setStatus("submitting");
    try {
      const payload = {
        ...form,
        existingDebts: form.existingDebts.join("、") || "未填写",
      };
      const res = await fetch("https://formspree.io/f/xdavozny", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  // ── Class helpers ────────────────────────────────────────────────────────────

  function inputCls(field: string) {
    return [
      "w-full border rounded-lg px-4 py-3 text-sm text-gray-800",
      "focus:outline-none focus:ring-2 transition-colors bg-white",
      errors[field]
        ? "border-red-400 focus:ring-red-200"
        : "border-gray-300 focus:ring-coral/30 focus:border-coral",
    ].join(" ");
  }

  function radioChipCls(selected: boolean) {
    return [
      "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer",
      "transition-all duration-150 text-sm select-none",
      selected
        ? "border-coral bg-coral/5 text-coral font-medium"
        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white",
    ].join(" ");
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-navy py-16 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3">
            免费房贷咨询
          </h1>
          <p className="text-white/65 text-base sm:text-lg">
            填写以下信息，我们将在1个工作日内与您联系
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="bg-warm-white py-12 lg:py-16">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6">
          {status === "success" ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-navy font-bold text-2xl mb-3">提交成功！</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
                感谢您的咨询！我们将在1个工作日内通过您偏好的联系方式与您联系。
              </p>
            </div>
          ) : (
            <div ref={cardRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <form onSubmit={handleSubmit} noValidate>
                {/* Progress bar */}
                <StepProgress current={step} />

                {/* Step content */}
                <div className={`transition-opacity duration-150 ${fading ? "opacity-0" : "opacity-100"}`}>

                  {/* ════ Step 1: 贷款需求 ════ */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <SectionTitle>贷款需求</SectionTitle>

                      {/* 贷款类型 */}
                      <div>
                        <label htmlFor="loanType" className="block text-sm font-medium text-gray-700 mb-1.5">
                          贷款类型 <span className="text-coral">*</span>
                        </label>
                        <select
                          id="loanType"
                          name="loanType"
                          value={form.loanType}
                          onChange={handleChange}
                          className={inputCls("loanType")}
                        >
                          <option value="">请选择</option>
                          {["住房贷款", "转贷", "建筑贷款", "个人贷款", "车贷", "其他类型"].map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.loanType} />
                      </div>

                      {/* 贷款金额 + 所在州 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1.5">
                            所需贷款金额 <span className="text-coral">*</span>
                          </label>
                          <select
                            id="loanAmount"
                            name="loanAmount"
                            value={form.loanAmount}
                            onChange={handleChange}
                            className={inputCls("loanAmount")}
                          >
                            <option value="">请选择</option>
                            {["25万以下", "25-50万", "50-100万", "100-150万", "150-200万", "200-300万", "300万以上"].map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <FieldError msg={errors.loanAmount} />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">
                            所在州或领地 <span className="text-coral">*</span>
                          </label>
                          <select
                            id="state"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className={inputCls("state")}
                          >
                            <option value="">请选择</option>
                            {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <FieldError msg={errors.state} />
                        </div>
                      </div>

                      {/* 住房 / 转贷 / 建筑专属 */}
                      {showPropertyFields && (
                        <div className="rounded-xl border border-coral/20 bg-coral/[0.03] p-5 space-y-5">
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                            住房 / 转贷 / 建筑贷款专属信息
                          </p>

                          {/* 首次购房 */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              是否首次购房 <span className="text-coral">*</span>
                            </p>
                            <div className="flex gap-3" id="firstHomeBuyer">
                              {["是", "否"].map((opt) => (
                                <label key={opt} className={radioChipCls(form.firstHomeBuyer === opt)}>
                                  <input
                                    type="radio"
                                    name="firstHomeBuyer"
                                    value={opt}
                                    checked={form.firstHomeBuyer === opt}
                                    onChange={handleChange}
                                    className="sr-only"
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                            <FieldError msg={errors.firstHomeBuyer} />
                          </div>

                          {/* 房产总价值 */}
                          <div>
                            <label htmlFor="propertyBudget" className="block text-sm font-medium text-gray-700 mb-1.5">
                              房产总价值 <span className="text-coral">*</span>
                            </label>
                            <select
                              id="propertyBudget"
                              name="propertyBudget"
                              value={form.propertyBudget}
                              onChange={handleChange}
                              className={inputCls("propertyBudget")}
                            >
                              <option value="">请选择</option>
                              {["100万以下", "100-150万", "150-200万", "200-300万", "300万以上"].map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <FieldError msg={errors.propertyBudget} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ════ Step 2: 背景信息 ════ */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <SectionTitle>背景信息</SectionTitle>

                      {/* 就业状态 */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          就业状态 <span className="text-coral">*</span>
                        </p>
                        <div className="flex flex-wrap gap-3" id="employmentStatus">
                          {["全职受雇", "兼职受雇", "自雇", "其他"].map((opt) => (
                            <label key={opt} className={radioChipCls(form.employmentStatus === opt)}>
                              <input
                                type="radio"
                                name="employmentStatus"
                                value={opt}
                                checked={form.employmentStatus === opt}
                                onChange={handleChange}
                                className="sr-only"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                        <FieldError msg={errors.employmentStatus} />
                      </div>

                      {/* 居留身份 */}
                      <div>
                        <label htmlFor="residencyStatus" className="block text-sm font-medium text-gray-700 mb-1.5">
                          居留身份 <span className="text-coral">*</span>
                        </label>
                        <select
                          id="residencyStatus"
                          name="residencyStatus"
                          value={form.residencyStatus}
                          onChange={handleChange}
                          className={inputCls("residencyStatus")}
                        >
                          <option value="">请选择</option>
                          {["澳洲公民", "永久居民PR", "临时居民签证", "非居民/海外人士"].map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.residencyStatus} />
                      </div>

                      {/* 现有债务 */}
                      <div>
                        <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                          名下现有债务
                          <span className="text-gray-400 font-normal text-xs">可多选</span>
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {["无", "有房贷", "有信用卡", "有其他贷款"].map((opt) => (
                            <label key={opt} className={radioChipCls(form.existingDebts.includes(opt))}>
                              <input
                                type="checkbox"
                                checked={form.existingDebts.includes(opt)}
                                onChange={() => handleDebtToggle(opt)}
                                className="sr-only"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 债务金额 */}
                      <div>
                        <label htmlFor="existingDebtAmount" className="block text-sm font-medium text-gray-700 mb-1.5">
                          现有债务总金额
                          <span className="text-gray-400 font-normal ml-1.5 text-xs">选填</span>
                        </label>
                        <input
                          id="existingDebtAmount"
                          name="existingDebtAmount"
                          type="text"
                          value={form.existingDebtAmount}
                          onChange={handleChange}
                          placeholder="如有请注明大致金额（万澳币）"
                          className={inputCls("existingDebtAmount")}
                        />
                      </div>

                      {/* 留言 */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                          留言
                          <span className="text-gray-400 font-normal ml-1.5 text-xs">选填</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="请描述您的具体需求或问题..."
                          className={`${inputCls("message")} resize-none`}
                        />
                      </div>
                    </div>
                  )}

                  {/* ════ Step 3: 基础信息 ════ */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <SectionTitle>基础信息</SectionTitle>

                      {/* 姓名 */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                          姓名 <span className="text-coral">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="请输入您的姓名"
                          className={inputCls("name")}
                        />
                        <FieldError msg={errors.name} />
                      </div>

                      {/* 联系方式偏好 */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          联系方式偏好 <span className="text-coral">*</span>
                        </p>
                        <div className="grid grid-cols-3 gap-3" id="preferredContact">
                          {["电话", "微信", "邮件"].map((opt) => (
                            <label key={opt} className={radioChipCls(form.preferredContact === opt)}>
                              <input
                                type="radio"
                                name="preferredContact"
                                value={opt}
                                checked={form.preferredContact === opt}
                                onChange={handleChange}
                                className="sr-only"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                        <FieldError msg={errors.preferredContact} />
                      </div>

                      {/* 电话 + 邮箱 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                            电话 <span className="text-coral">*</span>
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="04xx xxx xxx"
                            className={inputCls("phone")}
                          />
                          <FieldError msg={errors.phone} />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                            邮箱 <span className="text-coral">*</span>
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={inputCls("email")}
                          />
                          <FieldError msg={errors.email} />
                        </div>
                      </div>

                      {/* 微信号 */}
                      <div>
                        <label htmlFor="wechat" className="block text-sm font-medium text-gray-700 mb-1.5">
                          微信号
                          <span className="text-gray-400 font-normal ml-1.5 text-xs">选填</span>
                        </label>
                        <input
                          id="wechat"
                          name="wechat"
                          type="text"
                          value={form.wechat}
                          onChange={handleChange}
                          placeholder="可选，方便微信联系"
                          className={inputCls("wechat")}
                        />
                      </div>
                    </div>
                  )}

                </div>

                {/* Submit error */}
                {status === "error" && (
                  <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                    提交失败，请稍后重试或直接拨打我们的电话。
                  </div>
                )}

                {/* Navigation */}
                <div className={`flex gap-3 mt-8 ${step === 1 ? "justify-end" : "justify-between"}`}>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={goPrev}
                      className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:border-gray-400 hover:text-gray-800 transition-all duration-150"
                    >
                      ← 上一步
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      type="button"
                      onClick={goNext}
                      className="px-8 py-3 rounded-lg bg-[#1A2B5E] text-white text-sm font-semibold hover:bg-[#1A2B5E]/90 transition-all duration-150"
                    >
                      下一步 →
                    </button>
                  )}
                  {step === 3 && (
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="flex-1 sm:flex-none sm:px-10 py-3 rounded-lg bg-coral hover:bg-coral/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-md"
                    >
                      {status === "submitting" ? "提交中..." : "提交咨询 →"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

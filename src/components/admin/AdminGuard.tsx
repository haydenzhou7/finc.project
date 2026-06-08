"use client";

import { useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "admin_auth";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(STORAGE_KEY) === "true");
    setChecked(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  }

  if (!checked) return null;

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-5" style={{ backgroundColor: "#1A2B5E" }}>
            <h1 className="text-white font-bold text-lg tracking-wide">FINC 后台管理</h1>
            <p className="text-white/50 text-xs mt-0.5">请输入访问密码</p>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                密码
              </label>
              <input
                type="password"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(false); }}
                autoFocus
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                  error
                    ? "border-red-400 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-[#1A2B5E]"
                }`}
                placeholder="输入密码"
              />
              {error && (
                <p className="mt-1.5 text-xs text-red-600">密码错误，请重试</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#E8634A" }}
            >
              进入后台
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

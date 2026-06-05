import { NextRequest, NextResponse } from "next/server";

// ── Types ─────────────────────────────────────────────────────────────────────

interface VariableRateRow {
  owner_pi: string;
  invest_pi: string;
}

interface FixedRateRow {
  y1: string;
  y2: string;
  y3: string;
  y5: string;
}

interface RatesPayload {
  variable: Record<string, VariableRateRow>;
  fixed: Record<string, FixedRateRow>;
}

interface RequestBody {
  password: string;
  month: number;
  year: number;
  rates: RatesPayload;
}

// ── Table builders ────────────────────────────────────────────────────────────

const VARIABLE_BANKS = [
  { key: "cba",     name: "Commonwealth Bank (CBA)" },
  { key: "westpac", name: "Westpac" },
  { key: "anz",     name: "ANZ" },
  { key: "nab",     name: "NAB" },
];

const FIXED_BANKS = [
  { key: "cba",     name: "Commonwealth Bank (CBA)" },
  { key: "westpac", name: "Westpac" },
  { key: "anz",     name: "ANZ" },
  { key: "nab",     name: "NAB" },
];

function fmt(val: string): string {
  const n = parseFloat(val);
  return isNaN(n) ? val : `${n.toFixed(2)}%`;
}

function buildVariableTable(data: Record<string, VariableRateRow>): string {
  const header = [
    "| 银行 | 自住房（还本付息） | 自住房（纯利息） | 投资房（还本付息） | 投资房（纯利息） |",
    "|------|:-----------------:|:---------------:|:-----------------:|:---------------:|",
  ].join("\n");

  const rows = VARIABLE_BANKS.map(({ key, name }) => {
    const r = data[key] ?? { owner_pi: "", invest_pi: "" };
    return `| ${name} | **${fmt(r.owner_pi)}** | [获取利率](/contact) | **${fmt(r.invest_pi)}** | [获取利率](/contact) |`;
  }).join("\n");

  return `${header}\n${rows}`;
}

function buildFixedTable(data: Record<string, FixedRateRow>): string {
  const header = [
    "| 银行 | 1年 | 2年 | 3年 | 5年 |",
    "|------|:---:|:---:|:---:|:---:|",
  ].join("\n");

  const rows = FIXED_BANKS.map(({ key, name }) => {
    const r = data[key] ?? { y1: "", y2: "", y3: "", y5: "" };
    // Bold the 3-year term as it's typically the most competitive
    return `| ${name} | ${fmt(r.y1)} | ${fmt(r.y2)} | **${fmt(r.y3)}** | ${fmt(r.y5)} |`;
  }).join("\n");

  const other = "| 其他银行（ING / Macquarie / St.George 等） | [获取利率](/contact) | [获取利率](/contact) | [获取利率](/contact) | [获取利率](/contact) |";

  return `${header}\n${rows}\n${other}`;
}

// ── Handler ───────────────────────────────────────────────────────────────────

const GITHUB_API = "https://api.github.com";
const FILE_PATH = "src/content/posts/australia-mortgage-rates.mdx";

const CN_MONTHS: Record<number, string> = {
  1: "一月", 2: "二月", 3: "三月", 4: "四月", 5: "五月", 6: "六月",
  7: "七月", 8: "八月", 9: "九月", 10: "十月", 11: "十一月", 12: "十二月",
};

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const body = (await req.json()) as RequestBody;
  const { password, month, year, rates } = body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo  = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    return NextResponse.json({ error: "服务器环境变量未配置" }, { status: 500 });
  }

  // ── Fetch current file from GitHub ───────────────────────────────────────
  const getRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    }
  );

  if (!getRes.ok) {
    const err = await getRes.text();
    return NextResponse.json({ error: `GitHub 读取失败: ${err}` }, { status: 502 });
  }

  const fileData = await getRes.json() as { sha: string; content: string };
  const sha = fileData.sha;
  const raw = Buffer.from(fileData.content, "base64").toString("utf-8");

  // ── Update frontmatter ───────────────────────────────────────────────────
  const monthNum   = Number(month);
  const yearNum    = Number(year);
  const monthLabel = CN_MONTHS[monthNum] ?? `${monthNum}月`;
  const lastModified = `${yearNum}-${String(monthNum).padStart(2, "0")}-01`;
  const newTitle     = `${yearNum}年${monthLabel}澳洲各银行最新房贷利率`;
  const newExcerpt   = `澳洲主要银行${yearNum}年${monthLabel}最新浮动与固定房贷利率汇总，含CBA、Westpac、ANZ、NAB等，每月更新。助您对比利率，找到最优贷款方案。`;

  let updated = raw
    .replace(/^title:.*$/m,        `title: "${newTitle}"`)
    .replace(/^lastModified:.*$/m, `lastModified: "${lastModified}"`)
    .replace(/^excerpt:.*$/m,      `excerpt: "${newExcerpt}"`);

  // ── Replace table sections ───────────────────────────────────────────────
  updated = updated.replace(
    /\{\/\* VARIABLE_START \*\/\}[\s\S]*?\{\/\* VARIABLE_END \*\/\}/,
    `{/* VARIABLE_START */}\n\n${buildVariableTable(rates.variable)}\n\n{/* VARIABLE_END */}`
  );

  updated = updated.replace(
    /\{\/\* FIXED_START \*\/\}[\s\S]*?\{\/\* FIXED_END \*\/\}/,
    `{/* FIXED_START */}\n\n${buildFixedTable(rates.fixed)}\n\n{/* FIXED_END */}`
  );

  // ── Commit to GitHub ─────────────────────────────────────────────────────
  const putRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `chore: update mortgage rates ${yearNum}年${monthLabel}`,
        content: Buffer.from(updated).toString("base64"),
        sha,
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.json() as { message?: string };
    return NextResponse.json({ error: err.message ?? "GitHub 提交失败" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

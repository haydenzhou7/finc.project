#!/usr/bin/env node
// Preview and optionally apply SEO-friendly title rewrites for posts whose
// frontmatter title stacks keywords with " | " separators.
//
// Usage:
//   node scripts/fix-titles.js          # preview only
//   node scripts/fix-titles.js --apply  # write changes to files

const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "../src/content/posts");
const APPLY = process.argv.includes("--apply");

// ── Curated rewrites ──────────────────────────────────────────────────────────
// Key   = exact current title (after normalising ｜ → |)
// Value = new title
// Edit these before running --apply if you want different wording.

const OVERRIDES = {
  "482签证房贷 | 澳洲雇主担保如何申请贷款":
    "482签证持有者如何申请澳洲雇主担保贷款",
  "堪培拉贷款中介 | ACT房贷broker免费服务":
    "堪培拉房贷中介服务指南",
  "阿德莱德买房贷款 | Adelaide broker | 南澳大利亚房贷服务":
    "阿德莱德买房贷款指南",
  "485签证房贷 | 澳洲留学毕业工作如何申请贷款":
    "485签证持有者如何申请澳洲房贷",
  "商业保险比价 | 立减20澳元优惠 | BizCover Partner":
    "澳洲商业保险比价指南",
  "如何利用房产估价进行房产买卖决策 | 房产估价指南":
    "如何利用房产估价做买卖决策",
  "澳洲车贷完全指南 | Complete Guide for Car Loans":
    "澳洲车贷完全指南",
  "布里斯班买房贷款 | Brisbane broker | 昆士兰房贷服务":
    "布里斯班买房贷款指南",
  "利用房产净值进行房产投资的优缺点 | Cash Out for Property Investment":
    "利用房产净值投资的优缺点",
  "澳大利亚房屋贷款初学者词汇表 | Comprehensive Glossary of Mortgage Terms":
    "澳洲房屋贷款术语词汇表",
  "商业贷款详解 | 商业地产 | 设备融资 | 无抵押生意贷款":
    "商业贷款详解：商业地产、设备融资与无抵押生意贷款",
  "悉尼开发贷款详解 | 如何成功申请Development Loans":
    "悉尼开发贷款申请详解",
  "首次置业澳洲政府补贴和印花税减免指南2025 | FHOG and Stamp Duty Concessions":
    "首次置业政府补贴与印花税减免指南2025",
  "建筑贷款指南 | 如何在澳大利亚申请Construction Loan":
    "建筑贷款（Construction Loan）申请指南",
  "如何利用房产净值进行新的投资 |  Equity Release or Cash Out":
    "如何利用房产净值套现再投资",
  "澳洲房贷的真实储蓄指南 | Genuine Savings for Home Loan Applications":
    "澳洲房贷申请中的真实储蓄要求",
  "达尔文买房贷款申请 | Darwin mortgage broker | 北领地房贷服务":
    "达尔文买房贷款指南",
  "黄金海岸买房贷款 | Gold Coast broker | 昆士兰房贷服务":
    "黄金海岸买房贷款指南",
  "霍巴特买房贷款 | Hobart broker | 塔斯马尼亚房贷服务":
    "霍巴特买房贷款指南",
  "澳大利亚自雇人士房屋贷款指南 | Home Loan for Self-Employed":
    "自雇人士房屋贷款申请指南",
  "投资贷款指南 | 如何通过Investment Loans扩展投资组合":
    "投资贷款指南：如何扩展房产投资组合",
  "什么是贷款价值比（LVR）？| Loan-to-Value Ratio | 了解LVR对您的房贷申请的影响":
    "贷款价值比（LVR）详解：对房贷申请的影响",
  "首次购房者常犯的错误及如何避免 | First Home Buyers Should Avoid These Mistakes":
    "首次购房者常犯的错误及如何避免",
  "纽卡斯尔房贷指南 | Newcastle Home Loans":
    "纽卡斯尔买房贷款指南",
  "只付息与本息还款房贷对比 | Interest-Only vs. Principal &amp; Interest":
    "只付息与本息还款对比",
  "了解负扣税和税务优惠 | Negative Gearing Tax Benefits Explained":
    "负扣税与房产投资税务优惠详解",
  "澳大利亚自雇人士少文件贷款详解 | Low Doc Loans for the Self-Employed":
    "自雇人士少文件贷款（Low Doc Loan）详解",
  "澳洲公众责任保险 Public Liability Insurance | 独家20澳元折扣 | BizCover Partner":
    "澳洲公众责任保险（Public Liability Insurance）指南",
  "澳洲专业责任保险 PI Insurance | 独家20澳币折扣 | BizCover Partner":
    "澳洲专业责任保险（PI Insurance）申请指南",
  "住房贷款计算器 | Repayment Mortgage Calculator":
    "澳洲住房贷款还款计算器",
  "提前还清房贷策略 | Pay Off Mortgage Early Tips":
    "提前还清房贷的策略与方法",
  "理解澳大利亚房贷利率与费用 | Mortgage Rates and Fees Explained":
    "澳洲房贷利率与费用详解",
  "悉尼贷款 | 墨尔本贷款 | 布里斯班贷款 | 澳大利亚全境贷款服务":
    "悉尼、墨尔本、布里斯班房贷服务指南",
  "卧龙岗房贷指南 | Wollongong Home Loans":
    "卧龙岗买房贷款指南",
  "BizCover Partner | Save $20 on Business Insurance":
    "澳洲商业保险节省20澳元指南",
  // key stored normalised (single spaces) so lookup always hits
  "澳大利亚偏远地区移民房贷服务 | 凯恩斯贷款 | 汤斯维尔贷款| Tamworth贷款 | Wagga Wagga贷款":
    "偏远地区移民房贷服务指南",
  "珀斯买房贷款 | WA Perth broker | 西澳房贷服务":
    "珀斯买房贷款指南",
  "澳洲转贷利率和返现汇总 | Refinance 贷款重组":
    "澳洲转贷（Refinance）利率与返现汇总",
};

// ── Generic fallback rules ────────────────────────────────────────────────────
// Used only for titles not covered by OVERRIDES.

function isChinese(text) {
  const cjk = (text.match(/[一-鿿]/g) || []).length;
  return cjk / text.replace(/\s/g, "").length > 0.25;
}

function isPromo(text) {
  return /BizCover|独家.*折扣|立减|优惠|Save \$/i.test(text);
}

function autoClean(title) {
  const parts = title.split(/\s*\|\s*/).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return null;

  const useful = parts.filter((p) => !isPromo(p));
  if (!useful.length) return parts[0];

  const chinese = useful.filter(isChinese);
  if (chinese.length === 0) return useful[0]; // all English – keep first

  // Only one Chinese part: return it
  if (chinese.length === 1) return chinese[0];

  // Multiple Chinese parts: pick the one with the most CJK characters
  const cjkCount = (s) => (s.match(/[一-鿿]/g) || []).length;
  return chinese.sort((a, b) => cjkCount(b) - cjkCount(a))[0];
}

// ── Main ─────────────────────────────────────────────────────────────────────

const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

const changes = [];
const unchanged = [];

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) continue;

  const [, fm, body] = fmMatch;
  const titleMatch = fm.match(/^title:\s*"(.*)"\s*$/m);
  if (!titleMatch) continue;

  const oldTitle = titleMatch[1];

  // Normalise full-width pipe for lookup
  const normalised = oldTitle.replace(/｜/g, " | ").replace(/\s{2,}/g, " ");

  if (!normalised.includes(" | ")) {
    unchanged.push(file);
    continue;
  }

  const newTitle = OVERRIDES[normalised] ?? autoClean(normalised);
  if (!newTitle || newTitle === oldTitle) {
    unchanged.push(file);
    continue;
  }

  changes.push({ file, filePath, raw, fm, body, oldTitle, newTitle });
}

// ── Preview ───────────────────────────────────────────────────────────────────

console.log(`\n找到 ${changes.length} 篇需要修改的文章（另有 ${unchanged.length} 篇无需变动）：\n`);
console.log("─".repeat(72));

changes.forEach(({ file, oldTitle, newTitle }, i) => {
  const num = String(i + 1).padStart(2, " ");
  console.log(`${num}. ${file}`);
  console.log(`    旧：${oldTitle}`);
  console.log(`    新：${newTitle}`);
  console.log();
});

// ── Apply ─────────────────────────────────────────────────────────────────────

if (!APPLY) {
  console.log("─".repeat(72));
  console.log("预览模式 — 未写入文件。");
  console.log("确认无误后运行：node scripts/fix-titles.js --apply\n");
  process.exit(0);
}

let written = 0;
for (const { filePath, raw, fm, body, oldTitle, newTitle } of changes) {
  const newFm = fm.replace(
    /^title:\s*".*"\s*$/m,
    `title: "${newTitle.replace(/"/g, "'")}"`
  );
  fs.writeFileSync(filePath, `---\n${newFm}\n---\n${body}`, "utf8");
  written++;
}

console.log("─".repeat(72));
console.log(`✓ 已写入 ${written} 篇文章。\n`);

#!/usr/bin/env node
// Fills in missing/placeholder excerpts in MDX frontmatter by extracting
// the first ~150 chars of readable text from the article body.

const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "../src/content/posts");
const EXCERPT_MAX = 150;

function needsReplacement(val) {
  if (!val) return true;
  const core = val.replace(/[…\.]+$/, "").trim();
  if (core.length < 10) return true;              // too short (covers "Lease…", "背景：…" etc.)
  if (/[a-zA-Z)][…\.]$/.test(val)) return true;  // truncated mid-English-word or after English paren
  if (/&[a-z]+;[…\.]$/.test(val)) return true;   // truncated after HTML entity
  return false;
}

function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")          // headings
    .replace(/!\[.*?\]\(.*?\)/g, "")       // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → text
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // bold/italic
    .replace(/`{1,3}[^`]*`{1,3}/g, "")    // inline code / fences
    .replace(/^```[\s\S]*?^```/gm, "")    // fenced code blocks
    .replace(/^>\s+/gm, "")               // blockquotes
    .replace(/^\s*[-*+]\s+/gm, "")        // list bullets
    .replace(/^\s*\d+\.\s+/gm, "")        // numbered lists
    .replace(/<[^>]+>/g, "")              // HTML tags
    .replace(/\|[^\n]+/g, "")             // table rows
    .replace(/[-=]{3,}/g, "")             // hr / table separators
    .replace(/\[.*?\]/g, "")              // remaining bracket content
    .replace(/[*_~`#]/g, "")              // stray Markdown punctuation
    .replace(/\n{2,}/g, "\n")             // collapse blank lines
    .trim();
}

function extractExcerpt(body) {
  const cleaned = stripMarkdown(body);
  const lines = cleaned.split("\n").map((l) => l.trim()).filter(Boolean);

  let result = "";
  for (const line of lines) {
    if (result.length >= EXCERPT_MAX) break;
    result += (result ? " " : "") + line;
  }

  if (result.length <= EXCERPT_MAX) return result;

  // Trim to EXCERPT_MAX at a word/sentence boundary
  const trimmed = result.slice(0, EXCERPT_MAX);
  const lastPunct = Math.max(
    trimmed.lastIndexOf("。"),
    trimmed.lastIndexOf("，"),
    trimmed.lastIndexOf("、"),
    trimmed.lastIndexOf(" ")
  );
  return lastPunct > EXCERPT_MAX * 0.6
    ? trimmed.slice(0, lastPunct + 1).trimEnd()
    : trimmed.trimEnd() + "…";
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");

  // Split into frontmatter + body
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { skipped: true, reason: "no frontmatter" };

  const [, fm, body] = match;

  // Check whether excerpt needs filling
  const excerptMatch = fm.match(/^excerpt:\s*(.*)$/m);
  if (excerptMatch) {
    const val = excerptMatch[1].trim().replace(/^["']|["']$/g, "");
    if (!needsReplacement(val)) return { skipped: true, reason: "already has excerpt" };
  }

  const excerpt = extractExcerpt(body);
  if (!excerpt) return { skipped: true, reason: "could not extract text" };

  // Escape any double-quotes inside the excerpt
  const safe = excerpt.replace(/"/g, "'");

  let newFm;
  if (excerptMatch) {
    // Replace existing (empty / placeholder) excerpt line
    newFm = fm.replace(/^excerpt:.*$/m, `excerpt: "${safe}"`);
  } else {
    // Insert after the last key before end of frontmatter
    newFm = fm.trimEnd() + `\nexcerpt: "${safe}"`;
  }

  const newContent = `---\n${newFm}\n---\n${body}`;
  fs.writeFileSync(filePath, newContent, "utf8");
  return { skipped: false, excerpt };
}

// ── Main ─────────────────────────────────────────────────────────────────────

const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
let updated = 0;
let skipped = 0;
const errors = [];

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  try {
    const result = processFile(filePath);
    if (result.skipped) {
      skipped++;
    } else {
      updated++;
      console.log(`✓ ${file}\n  → ${result.excerpt.slice(0, 60)}…`);
    }
  } catch (err) {
    errors.push({ file, err: err.message });
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log("\n─────────────────────────────────────");
console.log(`处理完成：更新 ${updated} 篇，已有摘要跳过 ${skipped} 篇${errors.length ? `，错误 ${errors.length} 篇` : ""}。`);

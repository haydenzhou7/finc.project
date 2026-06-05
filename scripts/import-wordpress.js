#!/usr/bin/env node
/**
 * Import WordPress XML export → MDX files in src/content/posts/
 *
 * Usage:
 *   node scripts/import-wordpress.js [path-to-xml]
 *
 * Default XML path: ~/Desktop/finchomeloans.WordPress.*.xml (auto-detected)
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

// ── Config ──────────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(__dirname, "../src/content/posts");

// ── Helpers ──────────────────────────────────────────────────────────────────

function findXml(explicitPath) {
  if (explicitPath) return explicitPath;
  const desktop = path.join(os.homedir(), "Desktop");
  const files = fs.readdirSync(desktop).filter((f) => f.startsWith("finchomeloans") && f.endsWith(".xml"));
  if (files.length === 0) throw new Error("No finchomeloans*.xml found on Desktop");
  return path.join(desktop, files[0]);
}

/** Extract CDATA content or plain text from an XML tag */
function extractTag(str, tag) {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))<\\/${tag}>`, "i");
  const m = str.match(re);
  if (!m) return "";
  return (m[1] ?? m[2] ?? "").trim();
}

/** Extract all category names for an item */
function extractCategories(str) {
  const re = /<category domain="category"[^>]*><!\[CDATA\[(.*?)\]\]>/g;
  const cats = [];
  let m;
  while ((m = re.exec(str)) !== null) cats.push(m[1]);
  return cats;
}

/**
 * Convert WordPress Gutenberg HTML to Markdown (best-effort, no deps).
 * Handles the most common patterns found in FINC blog posts.
 */
function htmlToMarkdown(html) {
  let md = html;

  // Strip Gutenberg block comments
  md = md.replace(/<!-- \/?(wp:[a-z/:-]+)[^>]*?-->/g, "");

  // Headings
  md = md.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
    const text = stripTags(inner).trim();
    return "\n" + "#".repeat(Number(level)) + " " + text + "\n";
  });

  // Bold / italic
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, t) => `**${stripTags(t).trim()}**`);
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, t) => `**${stripTags(t).trim()}**`);
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, t) => `*${stripTags(t).trim()}*`);
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, t) => `*${stripTags(t).trim()}*`);

  // Links
  md = md.replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const label = stripTags(text).trim();
    return `[${label}](${href})`;
  });

  // List items
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${stripTags(t).trim()}`);
  md = md.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");

  // Paragraphs and line breaks
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => "\n" + stripTags(t).trim() + "\n");
  md = md.replace(/<br\s*\/?>/gi, "\n");

  // Tables (flatten to plain text rows)
  md = md.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_, row) => {
    const cells = [];
    row.replace(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi, (__, cell) => cells.push(stripTags(cell).trim()));
    return cells.join(" | ") + "\n";
  });
  md = md.replace(/<\/?(table|thead|tbody|tfoot)[^>]*>/gi, "\n");

  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) => {
    return stripTags(t).trim().split("\n").map((l) => `> ${l}`).join("\n") + "\n";
  });

  // Remove remaining tags
  md = stripTags(md);

  // Decode common HTML entities
  md = md
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8230;/g, "…")
    .replace(/&nbsp;/g, " ");

  // Collapse excessive blank lines
  md = md.replace(/\n{3,}/g, "\n\n").trim();

  return md;
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, "");
}

/** Derive a clean excerpt from the first non-empty paragraph of body HTML */
function deriveExcerpt(html, maxLen = 120) {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!m) return "";
  const text = stripTags(m[1]).replace(/\s+/g, " ").trim();
  return text.length > maxLen ? text.slice(0, maxLen).replace(/[，。！？,.]?\s*\S*$/, "…") : text;
}

/** Sanitize a slug so it's safe as a filename */
function sanitizeSlug(slug) {
  return slug.replace(/[^a-zA-Z0-9一-鿿-]/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
}

/** Build MDX frontmatter string */
function buildFrontmatter(fields) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(fields)) {
    const safe = String(v).replace(/"/g, '\\"');
    lines.push(`${k}: "${safe}"`);
  }
  lines.push("---");
  return lines.join("\n");
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  const xmlPath = findXml(process.argv[2]);
  console.log(`\n📂 Reading: ${xmlPath}`);

  const xml = fs.readFileSync(xmlPath, "utf-8");

  // Split items by looking for <item> tags
  const rawItems = xml.split(/(?=\t\t<item>)/);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let imported = 0;
  let skipped = 0;

  for (const item of rawItems) {
    if (!item.includes("<item>")) continue;

    const postType = extractTag(item, "wp:post_type");
    const status = extractTag(item, "wp:status");
    if (postType !== "post" || status !== "publish") continue;

    const title = extractTag(item, "title");
    const rawSlug = extractTag(item, "wp:post_name");
    const date = extractTag(item, "wp:post_date").slice(0, 10);
    const bodyHtml = extractTag(item, "content:encoded");
    const excerptHtml = extractTag(item, "excerpt:encoded");
    const categories = extractCategories(item);
    const category = categories[0] || "";

    if (!title || !rawSlug || !bodyHtml) {
      skipped++;
      continue;
    }

    const slug = sanitizeSlug(rawSlug);
    const excerpt = excerptHtml ? stripTags(excerptHtml).trim() : deriveExcerpt(bodyHtml);
    const body = htmlToMarkdown(bodyHtml);

    const fm = buildFrontmatter({ title, date, category, excerpt, slug });
    const mdx = `${fm}\n\n${body}\n`;

    const outPath = path.join(OUTPUT_DIR, `${slug}.mdx`);
    fs.writeFileSync(outPath, mdx, "utf-8");
    console.log(`  ✓ ${slug}.mdx`);
    imported++;
  }

  console.log(`\n✅ Done — ${imported} posts imported, ${skipped} skipped.`);
  console.log(`   Output: ${OUTPUT_DIR}\n`);
}

main();

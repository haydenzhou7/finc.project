import fs from "fs";
import path from "path";

export interface PostMeta {
  title: string;
  date: string;
  lastModified?: string;
  category: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  updateFrequency?: string;
  dataSource?: string;
}

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

// ── Category normalisation ────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, string> = {
  "澳洲贷款申请服务和政策": "贷款申请指南",
  "澳洲商业贷款": "商业贷款",
  "澳洲房贷知识": "房贷知识",
  "澳洲房贷新闻": "房贷资讯",
  "澳洲购房政策": "购房政策",
  "澳洲商业保险": "商业保险",
  "澳洲税务知识": "税务知识",
  "Uncategorized": "房贷资讯",
};

export function mapCategory(raw: string): string {
  if (!raw) return "";
  if (CATEGORY_MAP[raw]) return CATEGORY_MAP[raw];
  // Strip leading 澳洲 from anything else
  return raw.startsWith("澳洲") ? raw.slice(2) : raw;
}

// ── Excerpt extraction ────────────────────────────────────────────────────────

function extractExcerpt(body: string, maxLen = 120): string {
  const cleaned = body
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/^>\s*/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\|[^\n]*/g, "")
    .replace(/[-=]{3,}/g, "")
    .replace(/[*_~`#]/g, "")
    .trim();

  let result = "";
  for (const line of cleaned.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    result += (result ? " " : "") + t;
    if (result.length >= maxLen) break;
  }

  if (!result) return "";
  if (result.length <= maxLen) return result + "...";

  const slice = result.slice(0, maxLen);
  const lastPunct = Math.max(
    slice.lastIndexOf("。"),
    slice.lastIndexOf("，"),
    slice.lastIndexOf("、"),
    slice.lastIndexOf(" ")
  );
  const cut = lastPunct > maxLen * 0.6 ? lastPunct + 1 : maxLen;
  return slice.slice(0, cut).trimEnd() + "...";
}

function resolveExcerpt(stored: string, body: string): string {
  const trimmed = stored.trim();
  const core = trimmed.replace(/[…\.]+$/, "").trim();
  const isBad =
    !trimmed ||
    core.length < 10 ||
    /[a-zA-Z)][…\.]$/.test(trimmed) ||
    /&[a-z]+;[…\.]$/.test(trimmed);
  if (!isBad) return trimmed;
  return extractExcerpt(body);
}

// ── Frontmatter parser ────────────────────────────────────────────────────────

function parseFrontmatter(raw: string): { meta: Partial<PostMeta>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const fm: Partial<PostMeta> = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
    (fm as Record<string, string>)[key] = val;
  }
  return { meta: fm, body: match[2] };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      const { meta, body } = parseFrontmatter(raw);
      const slug = meta.slug || file.replace(/\.mdx$/, "");
      return {
        title: meta.title || slug,
        date: meta.date || "",
        ...(meta.lastModified ? { lastModified: meta.lastModified } : {}),
        category: mapCategory(meta.category || ""),
        excerpt: resolveExcerpt(meta.excerpt || "", body),
        slug,
        ...(meta.coverImage ? { coverImage: meta.coverImage } : {}),
        ...(meta.updateFrequency ? { updateFrequency: meta.updateFrequency } : {}),
        ...(meta.dataSource ? { dataSource: meta.dataSource } : {}),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): { meta: PostMeta; body: string } | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { meta, body } = parseFrontmatter(raw);
  return {
    meta: {
      title: meta.title || slug,
      date: meta.date || "",
      ...(meta.lastModified ? { lastModified: meta.lastModified } : {}),
      category: mapCategory(meta.category || ""),
      excerpt: resolveExcerpt(meta.excerpt || "", body),
      slug,
      ...(meta.coverImage ? { coverImage: meta.coverImage } : {}),
      ...(meta.updateFrequency ? { updateFrequency: meta.updateFrequency } : {}),
      ...(meta.dataSource ? { dataSource: meta.dataSource } : {}),
    },
    body,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

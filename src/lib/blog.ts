import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  date: string;
  author: string;
  featured: boolean;
  readingTime: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
  contentHtml: string;
  toc: TocItem[];
};

export type TocItem = { id: string; title: string; level: number };

function ensurePostsDir() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function extractToc(content: string): TocItem[] {
  const lines = content.split("\n");
  const toc: TocItem[] = [];
  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      toc.push({ id: slugifyHeading(title), title, level });
    }
  }
  return toc;
}

function addHeadingIds(htmlContent: string, toc: TocItem[]) {
  let result = htmlContent;
  for (const item of toc) {
    const regex = new RegExp(
      `<h${item.level}>([^<]*${item.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^<]*)</h${item.level}>`,
      "i"
    );
    result = result.replace(
      regex,
      `<h${item.level} id="${item.id}">$1</h${item.level}>`
    );
  }
  return result;
}

export function getAllPostSlugs(): string[] {
  ensurePostsDir();
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllPosts(): BlogPostMeta[] {
  const slugs = getAllPostSlugs();
  return slugs
    .map((slug) => getPostMetaBySlug(slug))
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllCategories(): string[] {
  const cats = new Set(getAllPosts().map((p) => p.category.toLowerCase()));
  return Array.from(cats);
}

export function getAllTags(): string[] {
  const tags = new Set(getAllPosts().flatMap((p) => p.tags.map((t) => t.toLowerCase())));
  return Array.from(tags);
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getPostsByTag(tag: string) {
  return getAllPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getPostMetaBySlug(slug: string): BlogPostMeta | null {
  ensurePostsDir();
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title as string,
    excerpt: data.excerpt as string,
    category: data.category as string,
    tags: (data.tags as string[]) ?? [],
    coverImage: (data.coverImage as string) ?? "/images/blog/default.jpg",
    date: data.date as string,
    author: (data.author as string) ?? "V S bansal & associates",
    featured: Boolean(data.featured),
    readingTime: stats.text,
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const meta = getPostMetaBySlug(slug);
  if (!meta) return null;

  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content } = matter(fileContents);
  const toc = extractToc(content);
  const processed = await remark().use(html).process(content);
  let contentHtml = processed.toString();
  contentHtml = addHeadingIds(contentHtml, toc);

  return { ...meta, content, contentHtml, toc };
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPostMetaBySlug(slug);
  if (!current) return [];
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .filter(
      (p) =>
        p.category === current.category ||
        p.tags.some((t) => current.tags.includes(t))
    )
    .slice(0, limit);
}

export function searchPosts(query: string) {
  const q = query.toLowerCase();
  return getAllPosts().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

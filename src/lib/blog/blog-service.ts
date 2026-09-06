import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  featured_image?: string;
  category_id?: string;
  category_name?: string;
  tags_json?: string;
  author: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  scheduled_at?: string;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_image?: string;
  canonical_url?: string;
  is_ai_generated: number;
  ai_generation_meta?: string;
  created_at: string;
  updated_at: string;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Clean and sanitize string to prevent XSS in client rendering
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/javascript:[^"']*/gi, "");
}

export async function getPublishedPosts(limit = 10): Promise<BlogPost[]> {
  const db = await getDb();
  const rows = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM blog_posts p
    LEFT JOIN blog_categories c ON p.category_id = c.id
    WHERE p.status = 'PUBLISHED'
    ORDER BY p.published_at DESC, p.created_at DESC
    LIMIT ?
  `).all(limit) as BlogPost[];
  return rows;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = await getDb();
  const row = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM blog_posts p
    LEFT JOIN blog_categories c ON p.category_id = c.id
    WHERE p.slug = ? AND p.status = 'PUBLISHED'
  `).get(slug) as BlogPost | undefined;
  return row || null;
}

export async function getAllAdminPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  const rows = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM blog_posts p
    LEFT JOIN blog_categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `).all() as BlogPost[];
  return rows;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const db = await getDb();
  const row = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM blog_posts p
    LEFT JOIN blog_categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).get(id) as BlogPost | undefined;
  return row || null;
}

export async function createPost(data: Partial<BlogPost>): Promise<BlogPost> {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = randomUUID();
  let slug = data.slug ? slugify(data.slug) : slugify(data.title || "post");

  // Ensure unique slug
  const existingSlug = db.prepare("SELECT id FROM blog_posts WHERE slug = ?").get(slug);
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const status = data.status || "DRAFT";
  const publishedAt = status === "PUBLISHED" ? (data.published_at || now) : null;

  db.prepare(`
    INSERT INTO blog_posts (
      id, slug, title, summary, content, featured_image, category_id,
      tags_json, author, status, scheduled_at, published_at,
      seo_title, seo_description, seo_keywords, og_image, canonical_url,
      is_ai_generated, ai_generation_meta, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `).run(
    id,
    slug,
    data.title || "Sem título",
    data.summary || "",
    sanitizeHtml(data.content || ""),
    data.featured_image || null,
    data.category_id || null,
    data.tags_json || "[]",
    data.author || "William Barbosa",
    status,
    data.scheduled_at || null,
    publishedAt,
    data.seo_title || data.title || "",
    data.seo_description || data.summary || "",
    data.seo_keywords || "",
    data.og_image || data.featured_image || null,
    data.canonical_url || null,
    data.is_ai_generated ? 1 : 0,
    data.ai_generation_meta || null,
    now,
    now
  );

  return (await getPostById(id))!;
}

export async function updatePost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
  const db = await getDb();
  const now = new Date().toISOString();

  let slugUpdate = data.slug ? slugify(data.slug) : undefined;
  if (slugUpdate) {
    const existing = db.prepare("SELECT id FROM blog_posts WHERE slug = ? AND id != ?").get(slugUpdate, id);
    if (existing) {
      slugUpdate = `${slugUpdate}-${Date.now().toString().slice(-4)}`;
    }
  }

  let publishedAt = data.published_at;
  if (data.status === "PUBLISHED" && !publishedAt) {
    const current = db.prepare("SELECT published_at FROM blog_posts WHERE id = ?").get(id) as { published_at?: string } | undefined;
    publishedAt = current?.published_at || now;
  }

  db.prepare(`
    UPDATE blog_posts
    SET title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        summary = COALESCE(?, summary),
        content = COALESCE(?, content),
        featured_image = COALESCE(?, featured_image),
        category_id = COALESCE(?, category_id),
        tags_json = COALESCE(?, tags_json),
        author = COALESCE(?, author),
        status = COALESCE(?, status),
        scheduled_at = COALESCE(?, scheduled_at),
        published_at = COALESCE(?, published_at),
        seo_title = COALESCE(?, seo_title),
        seo_description = COALESCE(?, seo_description),
        seo_keywords = COALESCE(?, seo_keywords),
        og_image = COALESCE(?, og_image),
        canonical_url = COALESCE(?, canonical_url),
        updated_at = ?
    WHERE id = ?
  `).run(
    data.title || null,
    slugUpdate || null,
    data.summary || null,
    data.content ? sanitizeHtml(data.content) : null,
    data.featured_image || null,
    data.category_id || null,
    data.tags_json || null,
    data.author || null,
    data.status || null,
    data.scheduled_at || null,
    publishedAt || null,
    data.seo_title || null,
    data.seo_description || null,
    data.seo_keywords || null,
    data.og_image || null,
    data.canonical_url || null,
    now,
    id
  );

  return (await getPostById(id))!;
}

export async function deletePost(id: string): Promise<boolean> {
  const db = await getDb();
  const info = db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
  return info.changes > 0;
}

export async function duplicatePost(id: string): Promise<BlogPost | null> {
  const original = await getPostById(id);
  if (!original) return null;

  return createPost({
    title: `${original.title} (Cópia)`,
    summary: original.summary,
    content: original.content,
    featured_image: original.featured_image,
    category_id: original.category_id,
    tags_json: original.tags_json,
    author: original.author,
    status: "DRAFT",
    seo_title: original.seo_title,
    seo_description: original.seo_description,
    seo_keywords: original.seo_keywords,
    is_ai_generated: original.is_ai_generated,
  });
}

import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";

export interface PageSectionContent {
  id?: string;
  page_slug: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text?: string;
  cta_url?: string;
  image_url?: string;
  content_json?: string;
  is_active: number;
  display_order: number;
  status: "DRAFT" | "PUBLISHED";
  updated_at?: string;
}

export async function getSectionContent(pageSlug: string, sectionKey: string, preview = false): Promise<PageSectionContent | null> {
  try {
    const db = await getDb();
    const query = preview
      ? "SELECT * FROM page_sections WHERE page_slug = ? AND section_key = ?"
      : "SELECT * FROM page_sections WHERE page_slug = ? AND section_key = ? AND status = 'PUBLISHED' AND is_active = 1";

    const row = db.prepare(query).get(pageSlug, sectionKey) as PageSectionContent | undefined;
    return row || null;
  } catch (error) {
    console.error(`Erro ao buscar seção CMS [${pageSlug}/${sectionKey}]:`, error);
    return null;
  }
}

export async function getAllSections(pageSlug = "home"): Promise<PageSectionContent[]> {
  try {
    const db = await getDb();
    const rows = db.prepare("SELECT * FROM page_sections WHERE page_slug = ? ORDER BY display_order ASC").all(pageSlug) as PageSectionContent[];
    return rows;
  } catch (error) {
    console.error(`Erro ao listar seções de [${pageSlug}]:`, error);
    return [];
  }
}

export async function saveSectionContent(data: Partial<PageSectionContent> & { page_slug: string; section_key: string }) {
  const db = await getDb();
  const now = new Date().toISOString();

  const existing = db.prepare("SELECT id FROM page_sections WHERE page_slug = ? AND section_key = ?").get(data.page_slug, data.section_key) as { id: string } | undefined;

  if (existing) {
    db.prepare(`
      UPDATE page_sections
      SET title = COALESCE(?, title),
          subtitle = COALESCE(?, subtitle),
          description = COALESCE(?, description),
          cta_text = COALESCE(?, cta_text),
          cta_url = COALESCE(?, cta_url),
          image_url = COALESCE(?, image_url),
          content_json = COALESCE(?, content_json),
          is_active = COALESCE(?, is_active),
          display_order = COALESCE(?, display_order),
          status = COALESCE(?, status),
          updated_at = ?
      WHERE id = ?
    `).run(
      data.title,
      data.subtitle,
      data.description,
      data.cta_text,
      data.cta_url,
      data.image_url,
      data.content_json,
      data.is_active !== undefined ? data.is_active : null,
      data.display_order !== undefined ? data.display_order : null,
      data.status || null,
      now,
      existing.id
    );
    return { id: existing.id, updated: true };
  } else {
    const newId = randomUUID();
    db.prepare(`
      INSERT INTO page_sections (id, page_slug, section_key, title, subtitle, description, cta_text, cta_url, image_url, content_json, is_active, display_order, status, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newId,
      data.page_slug,
      data.section_key,
      data.title || "",
      data.subtitle || "",
      data.description || "",
      data.cta_text || "",
      data.cta_url || "",
      data.image_url || "",
      data.content_json || "{}",
      data.is_active ?? 1,
      data.display_order ?? 0,
      data.status || "PUBLISHED",
      now
    );
    return { id: newId, created: true };
  }
}

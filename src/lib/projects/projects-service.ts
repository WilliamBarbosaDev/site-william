import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";
import { slugify } from "@/lib/blog/blog-service";

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  client?: string;
  category: string;
  services?: string;
  description: string;
  problem?: string;
  solution?: string;
  technologies_json?: string;
  results_json?: string;
  cover_image: string;
  images_json?: string;
  project_url?: string;
  whatsapp_message?: string;
  is_featured: number;
  display_order: number;
  status: string;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export async function getAllProjects(onlyPublished = false): Promise<ProjectRecord[]> {
  const db = await getDb();
  const query = onlyPublished
    ? "SELECT * FROM projects WHERE status = 'PUBLISHED' ORDER BY display_order ASC, created_at DESC"
    : "SELECT * FROM projects ORDER BY display_order ASC, created_at DESC";
  return db.prepare(query).all() as ProjectRecord[];
}

export async function getProjectById(id: string): Promise<ProjectRecord | null> {
  const db = await getDb();
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as ProjectRecord | undefined;
  return row || null;
}

export async function createProject(data: Partial<ProjectRecord>): Promise<ProjectRecord> {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = randomUUID();
  let slug = data.slug ? slugify(data.slug) : slugify(data.title || "projeto");

  const existingSlug = db.prepare("SELECT id FROM projects WHERE slug = ?").get(slug);
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  db.prepare(`
    INSERT INTO projects (
      id, slug, title, client, category, services, description,
      problem, solution, technologies_json, results_json,
      cover_image, images_json, project_url, whatsapp_message,
      is_featured, display_order, status, seo_title, seo_description,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?
    )
  `).run(
    id,
    slug,
    data.title || "Novo Projeto",
    data.client || null,
    data.category || "Web",
    data.services || "",
    data.description || "",
    data.problem || null,
    data.solution || null,
    data.technologies_json || "[]",
    data.results_json || "[]",
    data.cover_image || "/assets/fotos_projetos/site_verjuris.png",
    data.images_json || "[]",
    data.project_url || null,
    data.whatsapp_message || null,
    data.is_featured ? 1 : 0,
    data.display_order ?? 0,
    data.status || "PUBLISHED",
    data.seo_title || null,
    data.seo_description || null,
    now,
    now
  );

  return (await getProjectById(id))!;
}

export async function updateProject(id: string, data: Partial<ProjectRecord>): Promise<ProjectRecord> {
  const db = await getDb();
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE projects
    SET title = COALESCE(?, title),
        client = COALESCE(?, client),
        category = COALESCE(?, category),
        services = COALESCE(?, services),
        description = COALESCE(?, description),
        problem = COALESCE(?, problem),
        solution = COALESCE(?, solution),
        technologies_json = COALESCE(?, technologies_json),
        results_json = COALESCE(?, results_json),
        cover_image = COALESCE(?, cover_image),
        project_url = COALESCE(?, project_url),
        is_featured = COALESCE(?, is_featured),
        display_order = COALESCE(?, display_order),
        status = COALESCE(?, status),
        updated_at = ?
    WHERE id = ?
  `).run(
    data.title || null,
    data.client || null,
    data.category || null,
    data.services || null,
    data.description || null,
    data.problem || null,
    data.solution || null,
    data.technologies_json || null,
    data.results_json || null,
    data.cover_image || null,
    data.project_url || null,
    data.is_featured !== undefined ? (data.is_featured ? 1 : 0) : null,
    data.display_order !== undefined ? data.display_order : null,
    data.status || null,
    now,
    id
  );

  return (await getProjectById(id))!;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await getDb();
  const info = db.prepare("DELETE FROM projects WHERE id = ?").run(id);
  return info.changes > 0;
}

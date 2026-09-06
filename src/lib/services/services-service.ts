import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";
import { slugify } from "@/lib/blog/blog-service";

export interface ServiceRecord {
  id: string;
  slug: string;
  name: string;
  title: string;
  short_description: string;
  full_description?: string;
  image_url?: string;
  icon?: string;
  benefits_json?: string;
  problems_json?: string;
  price_starting_at?: string;
  price_model: "PROJETO_UNICO" | "MENSAL_RECORRENTE" | "SOB_CONSULTA" | "HORA_CONSULTORIA";
  price_notes?: string;
  deliverables_json?: string;
  estimated_days?: number;
  cta_text?: string;
  cta_url?: string;
  seo_title?: string;
  seo_description?: string;
  display_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export async function getAllServices(onlyActive = false): Promise<ServiceRecord[]> {
  const db = await getDb();
  const query = onlyActive
    ? "SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC"
    : "SELECT * FROM services ORDER BY display_order ASC";
  return db.prepare(query).all() as ServiceRecord[];
}

export async function getServiceById(id: string): Promise<ServiceRecord | null> {
  const db = await getDb();
  const row = db.prepare("SELECT * FROM services WHERE id = ?").get(id) as ServiceRecord | undefined;
  return row || null;
}

export async function createService(data: Partial<ServiceRecord>): Promise<ServiceRecord> {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = randomUUID();
  let slug = data.slug ? slugify(data.slug) : slugify(data.name || "servico");

  const existingSlug = db.prepare("SELECT id FROM services WHERE slug = ?").get(slug);
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  db.prepare(`
    INSERT INTO services (
      id, slug, name, title, short_description, full_description,
      image_url, icon, benefits_json, problems_json, price_starting_at,
      price_model, price_notes, deliverables_json, estimated_days,
      cta_text, cta_url, display_order, is_active, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, 1, ?, ?
    )
  `).run(
    id,
    slug,
    data.name || "Novo Serviço",
    data.title || data.name || "Novo Serviço",
    data.short_description || "",
    data.full_description || null,
    data.image_url || null,
    data.icon || "Sparkles",
    data.benefits_json || "[]",
    data.problems_json || "[]",
    data.price_starting_at || null,
    data.price_model || "PROJETO_UNICO",
    data.price_notes || null,
    data.deliverables_json || "[]",
    data.estimated_days ?? 15,
    data.cta_text || "Solicitar Orçamento",
    data.cta_url || "/diagnostico",
    data.display_order ?? 0,
    now,
    now
  );

  return (await getServiceById(id))!;
}

export async function updateService(id: string, data: Partial<ServiceRecord>): Promise<ServiceRecord> {
  const db = await getDb();
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE services
    SET name = COALESCE(?, name),
        title = COALESCE(?, title),
        short_description = COALESCE(?, short_description),
        full_description = COALESCE(?, full_description),
        image_url = COALESCE(?, image_url),
        icon = COALESCE(?, icon),
        benefits_json = COALESCE(?, benefits_json),
        problems_json = COALESCE(?, problems_json),
        price_starting_at = COALESCE(?, price_starting_at),
        price_model = COALESCE(?, price_model),
        price_notes = COALESCE(?, price_notes),
        deliverables_json = COALESCE(?, deliverables_json),
        estimated_days = COALESCE(?, estimated_days),
        cta_text = COALESCE(?, cta_text),
        cta_url = COALESCE(?, cta_url),
        display_order = COALESCE(?, display_order),
        is_active = COALESCE(?, is_active),
        updated_at = ?
    WHERE id = ?
  `).run(
    data.name || null,
    data.title || null,
    data.short_description || null,
    data.full_description || null,
    data.image_url || null,
    data.icon || null,
    data.benefits_json || null,
    data.problems_json || null,
    data.price_starting_at !== undefined ? data.price_starting_at : null,
    data.price_model || null,
    data.price_notes !== undefined ? data.price_notes : null,
    data.deliverables_json || null,
    data.estimated_days !== undefined ? data.estimated_days : null,
    data.cta_text || null,
    data.cta_url || null,
    data.display_order !== undefined ? data.display_order : null,
    data.is_active !== undefined ? (data.is_active ? 1 : 0) : null,
    now,
    id
  );

  return (await getServiceById(id))!;
}

export async function deleteService(id: string): Promise<boolean> {
  const db = await getDb();
  const info = db.prepare("DELETE FROM services WHERE id = ?").run(id);
  return info.changes > 0;
}

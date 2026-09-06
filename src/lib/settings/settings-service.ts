import { getDb } from "@/lib/db";
import { CONFIG } from "@/data";

export interface SettingRecord {
  key: string;
  value: string;
  category: string;
  updated_at: string;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const db = await getDb();
    const rows = db.prepare("SELECT key, value FROM site_settings").all() as { key: string; value: string }[];
    const result: Record<string, string> = {};
    for (const r of rows) {
      result[r.key] = r.value;
    }
    return result;
  } catch {
    return {
      phone: CONFIG.phone,
      whatsapp: CONFIG.phone,
      email: CONFIG.email,
      location: CONFIG.location,
    };
  }
}

export async function updateSetting(key: string, value: string, category = "general") {
  const db = await getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO site_settings (key, value, category, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(key, value, category, now);
}

export async function updateMultipleSettings(entries: Record<string, string>, category = "general") {
  const db = await getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO site_settings (key, value, category, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `);

  for (const [k, v] of Object.entries(entries)) {
    stmt.run(k, v, category, now);
  }
}

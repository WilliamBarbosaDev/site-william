import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const db = await getDb();
  const automations = db.prepare("SELECT * FROM content_automations ORDER BY created_at DESC").all();
  return NextResponse.json({ success: true, automations });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const db = await getDb();
    const id = body.id || randomUUID();
    const now = new Date().toISOString();

    if (body.id) {
      db.prepare(`
        UPDATE content_automations
        SET name = COALESCE(?, name),
            is_active = COALESCE(?, is_active),
            frequency = COALESCE(?, frequency),
            day_of_week = COALESCE(?, day_of_week),
            time_of_day = COALESCE(?, time_of_day),
            themes_json = COALESCE(?, themes_json),
            keywords_json = COALESCE(?, keywords_json),
            auto_publish = COALESCE(?, auto_publish)
        WHERE id = ?
      `).run(
        body.name,
        body.is_active !== undefined ? (body.is_active ? 1 : 0) : null,
        body.frequency,
        body.day_of_week,
        body.time_of_day,
        body.themes_json,
        body.keywords_json,
        body.auto_publish !== undefined ? (body.auto_publish ? 1 : 0) : null,
        body.id
      );
      return NextResponse.json({ success: true, id: body.id, updated: true });
    } else {
      db.prepare(`
        INSERT INTO content_automations (
          id, name, is_active, frequency, day_of_week, time_of_day,
          themes_json, keywords_json, auto_publish, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        body.name || "Automação Semanal",
        body.is_active ? 1 : 0,
        body.frequency || "WEEKLY",
        body.day_of_week || "MONDAY",
        body.time_of_day || "09:00",
        body.themes_json || "[]",
        body.keywords_json || "[]",
        body.auto_publish ? 1 : 0, // default is 0 (DRAFT) as requested!
        now
      );
      return NextResponse.json({ success: true, id, created: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Erro na automação de conteúdo:", error);
    return NextResponse.json({ success: false, message: "Erro ao configurar automação." }, { status: 500 });
  }
}

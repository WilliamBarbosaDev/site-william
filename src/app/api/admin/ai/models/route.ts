import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const db = await getDb();
  const models = db.prepare(`
    SELECT m.*, p.name as provider_name, p.provider_type
    FROM ai_models m
    JOIN ai_providers p ON m.provider_id = p.id
    ORDER BY p.priority ASC, m.priority ASC
  `).all();

  return NextResponse.json({ success: true, models });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const db = await getDb();
    const now = new Date().toISOString();

    if (body.id) {
      db.prepare(`
        UPDATE ai_models
        SET name = COALESCE(?, name),
            model_id = COALESCE(?, model_id),
            category = COALESCE(?, category),
            is_active = COALESCE(?, is_active),
            priority = COALESCE(?, priority),
            max_tokens = COALESCE(?, max_tokens),
            notes = COALESCE(?, notes)
        WHERE id = ?
      `).run(
        body.name,
        body.model_id,
        body.category,
        body.is_active !== undefined ? (body.is_active ? 1 : 0) : null,
        body.priority,
        body.max_tokens,
        body.notes,
        body.id
      );
      return NextResponse.json({ success: true, updated: true });
    } else {
      const id = randomUUID();
      db.prepare(`
        INSERT INTO ai_models (id, provider_id, name, model_id, category, is_active, priority, max_tokens, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        body.provider_id,
        body.name,
        body.model_id,
        body.category || "GENERAL",
        body.is_active ? 1 : 0,
        body.priority || 1,
        body.max_tokens || 4096,
        body.notes || null,
        now
      );
      return NextResponse.json({ success: true, id }, { status: 201 });
    }
  } catch (error) {
    console.error("Erro ao salvar modelo de IA:", error);
    return NextResponse.json({ success: false, message: "Erro ao salvar modelo." }, { status: 500 });
  }
}

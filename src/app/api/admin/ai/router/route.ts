import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const db = await getDb();
  const routes = db.prepare(`
    SELECT r.*,
           p1.name as primary_provider_name, m1.name as primary_model_name,
           p2.name as fallback1_provider_name, m2.name as fallback1_model_name,
           p3.name as fallback2_provider_name, m3.name as fallback2_model_name
    FROM ai_routes r
    LEFT JOIN ai_providers p1 ON r.primary_provider_id = p1.id
    LEFT JOIN ai_models m1 ON r.primary_model_id = m1.id
    LEFT JOIN ai_providers p2 ON r.fallback1_provider_id = p2.id
    LEFT JOIN ai_models m2 ON r.fallback1_model_id = m2.id
    LEFT JOIN ai_providers p3 ON r.fallback2_provider_id = p3.id
    LEFT JOIN ai_models m3 ON r.fallback2_model_id = m3.id
    ORDER BY r.task_name ASC
  `).all();

  return NextResponse.json({ success: true, routes });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const db = await getDb();
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE ai_routes
      SET primary_provider_id = ?,
          primary_model_id = ?,
          fallback1_provider_id = ?,
          fallback1_model_id = ?,
          fallback2_provider_id = ?,
          fallback2_model_id = ?,
          is_active = ?,
          updated_at = ?
      WHERE id = ?
    `).run(
      body.primary_provider_id,
      body.primary_model_id,
      body.fallback1_provider_id || null,
      body.fallback1_model_id || null,
      body.fallback2_provider_id || null,
      body.fallback2_model_id || null,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      now,
      body.id
    );

    return NextResponse.json({ success: true, updated: true });
  } catch (error) {
    console.error("Erro ao atualizar rotas de IA:", error);
    return NextResponse.json({ success: false, message: "Erro ao atualizar rota." }, { status: 500 });
  }
}

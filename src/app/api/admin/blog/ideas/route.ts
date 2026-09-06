import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const db = await getDb();
  const ideas = db.prepare("SELECT * FROM content_ideas ORDER BY created_at DESC").all();
  return NextResponse.json({ success: true, ideas });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { topic, keyword, category, objective, priority } = await request.json();
    if (!topic) {
      return NextResponse.json({ success: false, message: "O tema da ideia é obrigatório." }, { status: 400 });
    }

    const db = await getDb();
    const id = randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO content_ideas (id, topic, keyword, category, objective, priority, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'IDEA', ?)
    `).run(id, topic, keyword || null, category || "Geral", objective || null, priority || "MEDIUM", now);

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar ideia:", error);
    return NextResponse.json({ success: false, message: "Erro ao salvar ideia." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID é obrigatório" }, { status: 400 });

  const db = await getDb();
  db.prepare("DELETE FROM content_ideas WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}

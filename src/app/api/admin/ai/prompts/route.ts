import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const db = await getDb();
  const prompts = db.prepare("SELECT * FROM ai_prompts ORDER BY name ASC").all();
  return NextResponse.json({ success: true, prompts });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id, prompt_template } = await request.json();
    if (!id || !prompt_template) {
      return NextResponse.json({ success: false, message: "ID e template são obrigatórios." }, { status: 400 });
    }

    const db = await getDb();
    const current = db.prepare("SELECT version, prompt_template FROM ai_prompts WHERE id = ?").get(id) as { version: number; prompt_template: string } | undefined;

    if (!current) {
      return NextResponse.json({ success: false, message: "Prompt não encontrado." }, { status: 404 });
    }

    const now = new Date().toISOString();
    const newVersion = current.version + 1;

    // Save previous version in version history
    db.prepare(`
      INSERT INTO ai_prompt_versions (id, prompt_id, version, prompt_template, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(randomUUID(), id, current.version, current.prompt_template, now);

    // Update active prompt
    db.prepare(`
      UPDATE ai_prompts
      SET prompt_template = ?,
          version = ?,
          updated_at = ?
      WHERE id = ?
    `).run(prompt_template, newVersion, now, id);

    return NextResponse.json({ success: true, version: newVersion });
  } catch (error) {
    console.error("Erro ao atualizar prompt:", error);
    return NextResponse.json({ success: false, message: "Erro ao salvar prompt." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const db = await getDb();
  const providers = db.prepare("SELECT id, name, provider_type, base_url, is_active, priority, status, last_used_at, api_key_encrypted FROM ai_providers ORDER BY priority ASC").all() as Array<{
    id: string;
    name: string;
    provider_type: string;
    base_url?: string;
    is_active: number;
    priority: number;
    status: string;
    last_used_at?: string;
    api_key_encrypted?: string;
  }>;

  // Mask API keys before sending to browser
  const sanitized = providers.map((p) => {
    const hasKey = Boolean(p.api_key_encrypted);
    const maskedKey = hasKey
      ? `${p.api_key_encrypted!.slice(0, 7)}...${p.api_key_encrypted!.slice(-4)}`
      : "";
    return {
      id: p.id,
      name: p.name,
      provider_type: p.provider_type,
      base_url: p.base_url,
      is_active: p.is_active,
      priority: p.priority,
      status: p.status,
      last_used_at: p.last_used_at,
      has_key: hasKey,
      masked_key: maskedKey,
    };
  });

  return NextResponse.json({ success: true, providers: sanitized });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const db = await getDb();
    const now = new Date().toISOString();

    if (body.id) {
      // Update existing
      if (body.api_key && body.api_key.trim() && !body.api_key.includes("...")) {
        db.prepare(`
          UPDATE ai_providers
          SET name = COALESCE(?, name),
              base_url = COALESCE(?, base_url),
              api_key_encrypted = ?,
              is_active = COALESCE(?, is_active),
              priority = COALESCE(?, priority)
          WHERE id = ?
        `).run(body.name, body.base_url, body.api_key.trim(), body.is_active !== undefined ? (body.is_active ? 1 : 0) : null, body.priority, body.id);
      } else {
        db.prepare(`
          UPDATE ai_providers
          SET name = COALESCE(?, name),
              base_url = COALESCE(?, base_url),
              is_active = COALESCE(?, is_active),
              priority = COALESCE(?, priority)
          WHERE id = ?
        `).run(body.name, body.base_url, body.is_active !== undefined ? (body.is_active ? 1 : 0) : null, body.priority, body.id);
      }
      return NextResponse.json({ success: true, updated: true });
    } else {
      // Insert new
      const id = randomUUID();
      db.prepare(`
        INSERT INTO ai_providers (id, name, provider_type, api_key_encrypted, base_url, is_active, priority, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'READY', ?)
      `).run(
        id,
        body.name,
        body.provider_type,
        body.api_key?.trim() || null,
        body.base_url || null,
        body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
        body.priority || 1,
        now
      );

      // Auto-populate popular models for this provider
      const insertModel = db.prepare(`
        INSERT INTO ai_models (id, provider_id, name, model_id, category, is_active, priority, max_tokens, notes, created_at)
        VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
      `);

      if (body.provider_type === "groq") {
        insertModel.run(randomUUID(), id, "Llama 3.3 70B Versatile", "llama-3.3-70b-versatile", "FAST", 1, 8192, "Inferência ultrarrápida via Groq LPU", now);
        insertModel.run(randomUUID(), id, "Llama 3.1 8B Instant", "llama-3.1-8b-instant", "FAST", 2, 8192, "Respostas em milissegundos", now);
        insertModel.run(randomUUID(), id, "Mixtral 8x7B 32k", "mixtral-8x7b-32768", "GENERAL", 3, 32768, "Contexto estendido", now);
      } else if (body.provider_type === "openrouter") {
        insertModel.run(randomUUID(), id, "DeepSeek V3 (Chat)", "deepseek/deepseek-chat", "REASONING", 1, 8192, "Raciocínio avançado de altíssimo custo-benefício", now);
        insertModel.run(randomUUID(), id, "DeepSeek R1", "deepseek/deepseek-r1", "REASONING", 2, 8192, "Modelo de raciocínio profundo", now);
        insertModel.run(randomUUID(), id, "Claude 3.5 Sonnet (OpenRouter)", "anthropic/claude-3.5-sonnet", "REASONING", 3, 8192, "Via OpenRouter", now);
        insertModel.run(randomUUID(), id, "Llama 3.3 70B (OpenRouter)", "meta-llama/llama-3.3-70b-instruct", "FAST", 4, 8192, "Via OpenRouter", now);
        insertModel.run(randomUUID(), id, "GPT-4o Mini (OpenRouter)", "openai/gpt-4o-mini", "FAST", 5, 8192, "Via OpenRouter", now);
      } else if (body.provider_type === "openai") {
        insertModel.run(randomUUID(), id, "GPT-4o", "gpt-4o", "REASONING", 1, 8192, "Modelo emblemático multimodal da OpenAI", now);
        insertModel.run(randomUUID(), id, "GPT-4o Mini", "gpt-4o-mini", "FAST", 2, 8192, "Rápido e econômico para tarefas rotineiras", now);
        insertModel.run(randomUUID(), id, "o1-preview", "o1-preview", "REASONING", 3, 4096, "Raciocínio complexo", now);
      } else if (body.provider_type === "gemini") {
        insertModel.run(randomUUID(), id, "Gemini 2.5 Flash", "gemini-2.5-flash", "FAST", 1, 8192, "Rápido, inteligente com 1M tokens de janela", now);
        insertModel.run(randomUUID(), id, "Gemini 2.5 Pro", "gemini-2.5-pro", "REASONING", 2, 8192, "Raciocínio profundo e análise estratégica", now);
      } else if (body.provider_type === "anthropic") {
        insertModel.run(randomUUID(), id, "Claude 3.5 Sonnet", "claude-3-5-sonnet-20241022", "REASONING", 1, 8192, "Excelente para escrita e raciocínio crítico", now);
        insertModel.run(randomUUID(), id, "Claude 3.5 Haiku", "claude-3-5-haiku-20241022", "FAST", 2, 8192, "Respostas rápidas e precisas", now);
      } else if (body.initial_model_id) {
        insertModel.run(randomUUID(), id, body.initial_model_name || body.initial_model_id, body.initial_model_id, "GENERAL", 1, 4096, "Modelo customizado", now);
      }

      return NextResponse.json({ success: true, id }, { status: 201 });
    }
  } catch (error) {
    console.error("Erro ao salvar provedor de IA:", error);
    return NextResponse.json({ success: false, message: "Erro ao salvar provedor." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const db = await getDb();
    
    // Delete associated models first
    db.prepare("DELETE FROM ai_models WHERE provider_id = ?").run(id);
    
    // Delete provider
    db.prepare("DELETE FROM ai_providers WHERE id = ?").run(id);

    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    console.error("Erro ao excluir provedor:", error);
    return NextResponse.json({ error: "Erro ao excluir provedor" }, { status: 500 });
  }
}

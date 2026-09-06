import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";
import { slugify } from "@/lib/blog/blog-service";
import { executeAIRoute, AITask } from "./router";

export interface AiAgentRecord {
  id: string;
  slug: string;
  name: string;
  role_title: string;
  category: "SALES" | "SDR" | "SUPPORT" | "TECHNICAL" | "CONTENT" | "CUSTOM";
  description: string;
  system_instructions: string;
  provider_id?: string;
  model_id?: string;
  temperature: number;
  max_tokens: number;
  avatar_emoji: string;
  trigger_phrases_json?: string;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export async function getAllAgents(onlyActive = false): Promise<AiAgentRecord[]> {
  const db = await getDb();
  const query = onlyActive
    ? "SELECT * FROM ai_agents WHERE is_active = 1 ORDER BY display_order ASC, created_at ASC"
    : "SELECT * FROM ai_agents ORDER BY display_order ASC, created_at ASC";
  return db.prepare(query).all() as AiAgentRecord[];
}

export async function getAgentById(id: string): Promise<AiAgentRecord | null> {
  const db = await getDb();
  const row = db.prepare("SELECT * FROM ai_agents WHERE id = ?").get(id) as AiAgentRecord | undefined;
  return row || null;
}

export async function getAgentBySlug(slug: string): Promise<AiAgentRecord | null> {
  const db = await getDb();
  const row = db.prepare("SELECT * FROM ai_agents WHERE slug = ?").get(slug) as AiAgentRecord | undefined;
  return row || null;
}

export async function createAgent(data: Partial<AiAgentRecord>): Promise<AiAgentRecord> {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = randomUUID();
  let slug = data.slug ? slugify(data.slug) : slugify(data.name || "agente-ia");

  const existing = db.prepare("SELECT id FROM ai_agents WHERE slug = ?").get(slug);
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  db.prepare(`
    INSERT INTO ai_agents (
      id, slug, name, role_title, category, description,
      system_instructions, provider_id, model_id, temperature,
      max_tokens, avatar_emoji, trigger_phrases_json, is_active,
      display_order, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?
    )
  `).run(
    id,
    slug,
    data.name || "Novo Agente",
    data.role_title || "Consultor Especialista",
    data.category || "CUSTOM",
    data.description || "Agente inteligente treinado para operações digitais.",
    data.system_instructions || "Você é um assistente útil e profissional de William Barbosa.",
    data.provider_id || null,
    data.model_id || null,
    data.temperature ?? 0.7,
    data.max_tokens ?? 4096,
    data.avatar_emoji || "🤖",
    data.trigger_phrases_json || "[]",
    data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
    data.display_order ?? 0,
    now,
    now
  );

  return (await getAgentById(id))!;
}

export async function updateAgent(id: string, data: Partial<AiAgentRecord>): Promise<AiAgentRecord> {
  const db = await getDb();
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE ai_agents
    SET name = COALESCE(?, name),
        role_title = COALESCE(?, role_title),
        category = COALESCE(?, category),
        description = COALESCE(?, description),
        system_instructions = COALESCE(?, system_instructions),
        provider_id = COALESCE(?, provider_id),
        model_id = COALESCE(?, model_id),
        temperature = COALESCE(?, temperature),
        max_tokens = COALESCE(?, max_tokens),
        avatar_emoji = COALESCE(?, avatar_emoji),
        trigger_phrases_json = COALESCE(?, trigger_phrases_json),
        is_active = COALESCE(?, is_active),
        display_order = COALESCE(?, display_order),
        updated_at = ?
    WHERE id = ?
  `).run(
    data.name,
    data.role_title,
    data.category,
    data.description,
    data.system_instructions,
    data.provider_id,
    data.model_id,
    data.temperature,
    data.max_tokens,
    data.avatar_emoji,
    data.trigger_phrases_json,
    data.is_active !== undefined ? (data.is_active ? 1 : 0) : null,
    data.display_order,
    now,
    id
  );

  return (await getAgentById(id))!;
}

export async function deleteAgent(id: string): Promise<boolean> {
  const db = await getDb();
  const res = db.prepare("DELETE FROM ai_agents WHERE id = ?").run(id);
  return res.changes > 0;
}

export async function chatWithAgent(
  agentId: string,
  userMessage: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<{ text: string; provider: string; model: string; durationMs: number }> {
  const agent = await getAgentById(agentId);
  if (!agent) {
    throw new Error("Agente não encontrado");
  }

  // Format conversational context
  let historyText = "";
  if (history.length > 0) {
    historyText = "\n\nHISTÓRICO RECENTE DA CONVERSA:\n" +
      history.slice(-6).map((h) => `${h.role === "user" ? "Cliente" : "Agente"}: ${h.content}`).join("\n");
  }

  const prompt = `${historyText}\n\nCliente: ${userMessage}\n\nAgente (responda com base no seu treinamento):`;

  // Map category to router task or general CHAT
  let task: AITask = "CHAT";
  if (agent.category === "SALES" || agent.category === "SDR") task = "DIAGNOSTIC_INTERVIEW";
  else if (agent.category === "CONTENT") task = "BLOG_WRITING";
  else if (agent.category === "TECHNICAL") task = "BUSINESS_ANALYSIS";

  const response = await executeAIRoute({
    task,
    prompt,
    systemPrompt: agent.system_instructions,
    temperature: agent.temperature,
    maxTokens: agent.max_tokens,
  });

  return {
    text: response.text,
    provider: response.provider,
    model: response.model,
    durationMs: response.durationMs,
  };
}

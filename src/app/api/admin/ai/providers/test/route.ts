import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { providerId, apiKey, providerType, baseUrl, modelId } = await request.json();

    const db = await getDb();
    let keyToTest = apiKey;
    let typeToTest = providerType;
    let urlToTest = baseUrl;
    let modelToTest = modelId;

    if (providerId && (!keyToTest || keyToTest.includes("..."))) {
      const p = db.prepare("SELECT api_key_encrypted, provider_type, base_url FROM ai_providers WHERE id = ?").get(providerId) as {
        api_key_encrypted?: string;
        provider_type: string;
        base_url?: string;
      } | undefined;

      if (p) {
        keyToTest = p.api_key_encrypted;
        typeToTest = typeToTest || p.provider_type;
        urlToTest = urlToTest || p.base_url;
      }
    }

    if (!keyToTest) {
      return NextResponse.json({
        success: false,
        message: "Nenhuma chave informada para teste.",
      }, { status: 400 });
    }

    const startTime = Date.now();

    if (typeToTest === "gemini") {
      const endpoint = `${urlToTest || "https://generativelanguage.googleapis.com/v1beta"}/models/${modelToTest || "gemini-2.5-flash"}:generateContent?key=${keyToTest}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "ping" }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      });

      const elapsed = Date.now() - startTime;
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ success: false, message: `Erro Gemini (${res.status}): ${err}`, elapsed });
      }

      return NextResponse.json({ success: true, message: `Conexão bem-sucedida! (${elapsed}ms)`, elapsed });
    }

    if (typeToTest === "anthropic") {
      const endpoint = `${urlToTest || "https://api.anthropic.com/v1"}/messages`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": keyToTest,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: modelToTest || "claude-3-5-haiku-20241022",
          max_tokens: 5,
          messages: [{ role: "user", content: "ping" }],
        }),
      });

      const elapsed = Date.now() - startTime;
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ success: false, message: `Erro Anthropic (${res.status}): ${err}`, elapsed });
      }

      return NextResponse.json({ success: true, message: `Conexão bem-sucedida! (${elapsed}ms)`, elapsed });
    }

    // OpenAI, Groq, OpenRouter, Custom
    const defaultBase = typeToTest === "groq"
      ? "https://api.groq.com/openai/v1"
      : typeToTest === "openrouter"
      ? "https://openrouter.ai/api/v1"
      : "https://api.openai.com/v1";

    const base = (urlToTest && urlToTest.trim()) ? urlToTest.trim() : defaultBase;
    const endpoint = `${base.replace(/\/+$/, "")}/chat/completions`;

    const defaultModel = typeToTest === "groq"
      ? "llama-3.1-8b-instant"
      : typeToTest === "openrouter"
      ? "deepseek/deepseek-chat"
      : "gpt-4o-mini";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${keyToTest}`,
    };

    if (typeToTest === "openrouter") {
      headers["HTTP-Referer"] = "https://williambdesigner.com.br";
      headers["X-Title"] = "William Barbosa Platform";
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: modelToTest || defaultModel,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 5,
      }),
    });

    const elapsed = Date.now() - startTime;

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({
        success: false,
        message: `Falha na API (${res.status}): ${err.slice(0, 200)}`,
        elapsed,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Conexão bem-sucedida! Resposta em ${elapsed}ms`,
      elapsed,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      success: false,
      message: `Erro na requisição: ${errorMsg}`,
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { chatWithAgent } from "@/lib/ai/agents-service";

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { agentId, message, history } = await request.json();

    if (!agentId || !message || !message.trim()) {
      return NextResponse.json({ error: "Agente e mensagem são obrigatórios" }, { status: 400 });
    }

    const response = await chatWithAgent(agentId, message.trim(), history || []);

    return NextResponse.json({
      success: true,
      text: response.text,
      provider: response.provider,
      model: response.model,
      durationMs: response.durationMs,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Erro no chat com o agente:", error);
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}

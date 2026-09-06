import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAllAgents, createAgent, updateAgent } from "@/lib/ai/agents-service";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const agents = await getAllAgents();
    return NextResponse.json({ success: true, agents });
  } catch (error) {
    console.error("Erro ao buscar agentes:", error);
    return NextResponse.json({ error: "Erro ao buscar agentes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();

    if (body.id) {
      const updated = await updateAgent(body.id, body);
      return NextResponse.json({ success: true, agent: updated });
    }

    const created = await createAgent(body);
    return NextResponse.json({ success: true, agent: created }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar agente:", error);
    return NextResponse.json({ error: "Erro ao salvar agente" }, { status: 500 });
  }
}

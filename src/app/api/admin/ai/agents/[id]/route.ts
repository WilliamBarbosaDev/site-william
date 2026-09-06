import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAgentById, updateAgent, deleteAgent } from "@/lib/ai/agents-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const agent = await getAgentById(id);
  if (!agent) {
    return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ success: true, agent });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await updateAgent(id, body);
    return NextResponse.json({ success: true, agent: updated });
  } catch (error) {
    console.error("Erro ao atualizar agente:", error);
    return NextResponse.json({ error: "Erro ao atualizar agente" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  try {
    const deleted = await deleteAgent(id);
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("Erro ao excluir agente:", error);
    return NextResponse.json({ error: "Erro ao excluir agente" }, { status: 500 });
  }
}

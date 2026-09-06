import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { updateLeadStatus } from "@/lib/leads/leads-service";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  try {
    const { status, notes } = await request.json();
    await updateLeadStatus(id, status, notes);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    return NextResponse.json({ success: false, message: "Erro ao atualizar lead." }, { status: 500 });
  }
}

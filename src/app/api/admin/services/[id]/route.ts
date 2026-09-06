import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getServiceById, updateService, deleteService } from "@/lib/services/services-service";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  const service = await getServiceById(id);
  if (!service) return NextResponse.json({ success: false, message: "Serviço não encontrado" }, { status: 404 });
  return NextResponse.json({ success: true, service });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  try {
    const body = await request.json();
    const updated = await updateService(id, body);
    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return NextResponse.json({ success: false, message: "Erro ao atualizar serviço." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  const success = await deleteService(id);
  return NextResponse.json({ success });
}

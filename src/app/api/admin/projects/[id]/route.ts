import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getProjectById, updateProject, deleteProject } from "@/lib/projects/projects-service";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  const project = await getProjectById(id);
  if (!project) return NextResponse.json({ success: false, message: "Projeto não encontrado" }, { status: 404 });
  return NextResponse.json({ success: true, project });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  try {
    const body = await request.json();
    const updated = await updateProject(id, body);
    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error);
    return NextResponse.json({ success: false, message: "Erro ao atualizar projeto." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  const success = await deleteProject(id);
  return NextResponse.json({ success });
}

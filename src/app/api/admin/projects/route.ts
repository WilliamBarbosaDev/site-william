import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAllProjects, createProject } from "@/lib/projects/projects-service";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const projects = await getAllProjects(false);
  return NextResponse.json({ success: true, projects });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const project = await createProject(body);
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return NextResponse.json({ success: false, message: "Erro ao criar projeto." }, { status: 500 });
  }
}

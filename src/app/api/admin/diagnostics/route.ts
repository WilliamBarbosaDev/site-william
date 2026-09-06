import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAllDiagnostics, getDiagnosticById } from "@/lib/leads/leads-service";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const diag = await getDiagnosticById(id);
    if (!diag) return NextResponse.json({ success: false, message: "Diagnóstico não encontrado" }, { status: 404 });
    return NextResponse.json({ success: true, diagnostic: diag });
  }

  const diagnostics = await getAllDiagnostics();
  return NextResponse.json({ success: true, diagnostics });
}

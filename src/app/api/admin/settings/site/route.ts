import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAllSettings, updateMultipleSettings } from "@/lib/settings/settings-service";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const settings = await getAllSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    await updateMultipleSettings(body, "general");
    return NextResponse.json({ success: true, message: "Configurações salvas com sucesso." });
  } catch (error) {
    console.error("Erro ao salvar configurações do site:", error);
    return NextResponse.json({ success: false, message: "Erro ao salvar configurações." }, { status: 500 });
  }
}

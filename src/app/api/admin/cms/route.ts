import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAllSections, saveSectionContent } from "@/lib/cms/content-service";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "home";
  const sections = await getAllSections(page);
  return NextResponse.json({ success: true, sections });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    if (!body.page_slug || !body.section_key) {
      return NextResponse.json({ success: false, message: "page_slug e section_key são obrigatórios." }, { status: 400 });
    }

    const result = await saveSectionContent(body);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Erro ao salvar seção CMS:", error);
    return NextResponse.json({ success: false, message: "Erro ao salvar seção." }, { status: 500 });
  }
}

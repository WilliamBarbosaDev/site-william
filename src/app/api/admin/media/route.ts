import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAllMedia, saveUploadedFile, deleteMedia } from "@/lib/media/storage";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const media = await getAllMedia();
  return NextResponse.json({ success: true, media });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const saved = await saveUploadedFile(file);
    return NextResponse.json({ success: true, media: saved }, { status: 201 });
  } catch (error) {
    console.error("Erro no upload de mídia:", error);
    return NextResponse.json({ success: false, message: (error as Error).message || "Erro no upload." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID é obrigatório" }, { status: 400 });

  const success = await deleteMedia(id);
  return NextResponse.json({ success });
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getPostById, updatePost, deletePost, duplicatePost } from "@/lib/blog/blog-service";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  const post = await getPostById(id);
  if (!post) {
    return NextResponse.json({ success: false, message: "Post não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ success: true, post });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  try {
    const body = await request.json();
    const updated = await updatePost(id, body);
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    return NextResponse.json({ success: false, message: "Erro ao atualizar post." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  const success = await deletePost(id);
  return NextResponse.json({ success });
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Duplicate post
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await context.params;
  const duplicate = await duplicatePost(id);
  if (!duplicate) {
    return NextResponse.json({ success: false, message: "Falha ao duplicar post." }, { status: 400 });
  }
  return NextResponse.json({ success: true, post: duplicate });
}

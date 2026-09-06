import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAllAdminPosts, createPost } from "@/lib/blog/blog-service";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const posts = await getAllAdminPosts();
  return NextResponse.json({ success: true, posts });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const post = await createPost(body);
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar post do blog:", error);
    return NextResponse.json({ success: false, message: "Erro ao criar post." }, { status: 500 });
  }
}

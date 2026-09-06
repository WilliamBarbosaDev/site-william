import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAllServices, createService } from "@/lib/services/services-service";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const services = await getAllServices(false);
  return NextResponse.json({ success: true, services });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const service = await createService(body);
    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json({ success: false, message: "Erro ao criar serviço." }, { status: 500 });
  }
}

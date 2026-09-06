import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAllLeads } from "@/lib/leads/leads-service";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const leads = await getAllLeads();
  return NextResponse.json({ success: true, leads });
}

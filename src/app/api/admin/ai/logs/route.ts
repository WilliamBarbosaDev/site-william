import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);

  const db = await getDb();
  const logs = db.prepare(`
    SELECT * FROM ai_logs
    ORDER BY created_at DESC
    LIMIT ?
  `).all(limit);

  // Aggregated metrics
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_calls,
      SUM(tokens_prompt + tokens_completion) as total_tokens,
      AVG(duration_ms) as avg_duration,
      SUM(CASE WHEN status = 'FALLBACK' THEN 1 ELSE 0 END) as fallback_count,
      SUM(CASE WHEN status = 'ERROR' THEN 1 ELSE 0 END) as error_count
    FROM ai_logs
  `).get();

  return NextResponse.json({ success: true, logs, stats });
}

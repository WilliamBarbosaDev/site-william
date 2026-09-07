import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      message: "Supabase ainda não configurado no .env.local",
      details: {
        hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      },
    });
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({
        configured: false,
        message: "Chave SUPABASE_SERVICE_ROLE_KEY ausente para conexão administrativa.",
      });
    }

    // Testa consulta em uma tabela essencial criada pelo supabase_schema.sql
    const start = Date.now();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, name, email")
      .limit(1);

    const latencyMs = Date.now() - start;

    if (error) {
      return NextResponse.json({
        configured: true,
        connected: false,
        error: error.message,
        hint: error.code === "42P01" 
          ? "A tabela 'admin_users' não existe. Você executou o supabase_schema.sql no SQL Editor do Supabase?"
          : error.message,
        latencyMs,
      }, { status: 400 });
    }

    return NextResponse.json({
      configured: true,
      connected: true,
      message: "Conexão com Supabase realizada com sucesso!",
      latencyMs,
      usersFound: data?.length ?? 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      configured: true,
      connected: false,
      error: message,
    }, { status: 500 });
  }
}

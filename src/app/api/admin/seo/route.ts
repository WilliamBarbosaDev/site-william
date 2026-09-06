import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { getAllSettings, updateMultipleSettings } from "@/lib/settings/settings-service";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  const all = await getAllSettings();
  const seoSettings = {
    seo_title: all.seo_title || "William Barbosa | Estratégia, Web & IA para Negócios",
    seo_description: all.seo_description || "Desenvolvimento de sites estratégicos de alta conversão e sistemas inteligentes com IA.",
    seo_keywords: all.seo_keywords || "estratégia digital, landing pages, inteligência artificial, automação",
    og_image: all.og_image || "/assets/og-image.png",
    twitter_image: all.twitter_image || "/assets/og-image.png",
    robots_txt: all.robots_txt || "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nSitemap: https://williambdesigner.com.br/sitemap.xml",
    canonical_base: all.canonical_base || "https://williambdesigner.com.br",
  };

  return NextResponse.json({ success: true, seo: seoSettings });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    await updateMultipleSettings(body, "seo");
    return NextResponse.json({ success: true, message: "Configurações de SEO atualizadas." });
  } catch (error) {
    console.error("Erro ao salvar SEO:", error);
    return NextResponse.json({ success: false, message: "Erro ao salvar SEO." }, { status: 500 });
  }
}

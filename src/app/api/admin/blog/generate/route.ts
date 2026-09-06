import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { executeAIRoute } from "@/lib/ai/router";
import { createPost, slugify } from "@/lib/blog/blog-service";

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApi(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { theme, goal, audience, keyword, tone } = await request.json();

    if (!theme) {
      return NextResponse.json({ success: false, message: "O tema do artigo é obrigatório." }, { status: 400 });
    }

    const prompt = `
Escreva um artigo de blog completo e aprofundado com as seguintes diretrizes:
- TEMA: ${theme}
- OBJETIVO: ${goal || "Educar o leitor e demonstrar autoridade técnica gerando oportunidades de negócio"}
- PÚBLICO-ALVO: ${audience || "Empresários, diretores e tomadores de decisão"}
- PALAVRA-CHAVE PRINCIPAL: ${keyword || theme}
- TOM DE VOZ: ${tone || "Profissional, analítico, persuasivo e altamente acessível"}

FORMATO DE RESPOSTA ESPERADO:
Retorne o conteúdo estruturado em Markdown com:
1. Título instigante no topo (# ...)
2. Introdução envolvente com gancho forte
3. Seções bem desenvolvidas com subtítulos (## e ###)
4. Listas de boas práticas e exemplos práticos
5. Um Call to Action (CTA) ao final convidando para o Diagnóstico Estratégico ou contato no WhatsApp.
    `.trim();

    const aiResponse = await executeAIRoute({
      task: "BLOG_WRITING",
      prompt,
      systemPrompt: "Você é o redator sênior de William Barbosa, autoridade em Design Estratégico e IA para Negócios. Produza artigos ricos e bem estruturados.",
      context: { theme, goal, audience, keyword, tone },
    });

    // Extract title from first line if starts with #
    const lines = aiResponse.text.trim().split("\n");
    let title = theme;
    let contentBody = aiResponse.text;

    if (lines[0].startsWith("# ")) {
      title = lines[0].replace(/^#\s*/, "").trim();
      contentBody = lines.slice(1).join("\n").trim();
    }

    const summary = `Descubra como aplicar ${keyword || theme} para acelerar a eficiência e o posicionamento da sua empresa com as melhores práticas de mercado.`;
    const slug = slugify(title);

    // Save as DRAFT in database
    const savedPost = await createPost({
      title,
      slug,
      summary,
      content: contentBody,
      author: "William Barbosa",
      status: "DRAFT", // strictly DRAFT as requested!
      is_ai_generated: 1,
      ai_generation_meta: JSON.stringify({
        provider: aiResponse.provider,
        model: aiResponse.model,
        usedFallback: aiResponse.usedFallback,
        theme,
        keyword,
      }),
      seo_title: `${title} | William Barbosa`,
      seo_description: summary,
      seo_keywords: `${keyword || theme}, inteligência artificial, estratégia empresarial, automação`,
    });

    return NextResponse.json({
      success: true,
      message: "Artigo gerado com sucesso como Rascunho.",
      post: savedPost,
      aiMeta: {
        provider: aiResponse.provider,
        model: aiResponse.model,
        durationMs: aiResponse.durationMs,
        usedFallback: aiResponse.usedFallback,
      },
    });
  } catch (error) {
    console.error("Erro na geração de artigo com IA:", error);
    return NextResponse.json({ success: false, message: "Erro ao gerar artigo com IA." }, { status: 500 });
  }
}

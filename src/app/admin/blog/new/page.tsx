"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Sparkles,
  PenTool,
  CheckCircle2,
  RefreshCw,
  Eye,
  Settings,
  HelpCircle
} from "lucide-react";

export default function AdminNewBlogPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "ai" ? "ai" : "manual";

  const [mode, setMode] = useState<"manual" | "ai">(initialMode);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "SCHEDULED">("DRAFT");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // AI Generation Inputs
  const [aiTheme, setAiTheme] = useState("");
  const [aiGoal, setAiGoal] = useState("Educar e demonstrar autoridade para gerar oportunidades comerciais");
  const [aiAudience, setAiAudience] = useState("Empresários, diretores e gestores de pequenas e médias empresas");
  const [aiKeyword, setAiKeyword] = useState("");
  const [aiTone, setAiTone] = useState("Profissional, analítico e acessível");

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTheme.trim()) {
      alert("Por favor, informe o tema do artigo.");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: aiTheme,
          goal: aiGoal,
          audience: aiAudience,
          keyword: aiKeyword || aiTheme,
          tone: aiTone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erro ao gerar artigo com IA.");
      }

      // Populate editor with draft
      const post = data.post;
      setTitle(post.title);
      setSlug(post.slug);
      setSummary(post.summary || "");
      setContent(post.content || "");
      setSeoTitle(post.seo_title || "");
      setSeoDescription(post.seo_description || "");
      setSeoKeywords(post.seo_keywords || "");
      setStatus("DRAFT"); // always draft as requested!

      // Switch to manual mode for review & editing
      setMode("manual");
      alert("Artigo gerado com sucesso pelo AI Router! Ele foi carregado como RASCUNHO para sua revisão e edição antes de publicar.");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSavePost = async (publishImmediately = false) => {
    if (!title.trim()) {
      alert("O título do artigo é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      const targetStatus = publishImmediately ? "PUBLISHED" : status;
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          summary,
          content,
          featured_image: featuredImage || null,
          status: targetStatus,
          seo_title: seoTitle || title,
          seo_description: seoDescription || summary,
          seo_keywords: seoKeywords,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erro ao salvar artigo.");
      }

      router.push("/admin/blog");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#888] hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Criar Artigo</h2>
            <p className="text-xs text-[#888] mt-0.5">
              Escolha entre produção manual do zero ou geração assistida pelo AI Router
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#111113] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setMode("manual")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              mode === "manual" ? "bg-white/10 text-white font-semibold" : "text-[#777] hover:text-white"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Produção Manual
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              mode === "ai" ? "bg-[#22c55e]/20 text-[#22c55e] font-semibold" : "text-[#777] hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" /> Gerar com IA
          </button>
        </div>
      </div>

      {mode === "ai" ? (
        /* AI Generation Flow */
        <div className="bg-[#0f0f11] border border-white/10 rounded-[28px] p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#22c55e] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            AI Router Assistente de Conteúdo
          </div>
          <h3 className="text-lg font-light text-white">
            Preencha os parâmetros para a Inteligência Artificial gerar o artigo
          </h3>
          <p className="text-xs text-[#888] -mt-4">
            A IA produzirá um rascunho completo com título, slug, corpo formatado em Markdown e tags de SEO. Você poderá revisar e editar tudo antes de publicar.
          </p>

          <form onSubmit={handleGenerateAI} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                Tema / Pauta do Artigo *
              </label>
              <input
                type="text"
                value={aiTheme}
                onChange={(e) => setAiTheme(e.target.value)}
                required
                placeholder="Ex: Como usar Inteligência Artificial no atendimento de pequenas empresas"
                className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Palavra-Chave Principal
                </label>
                <input
                  type="text"
                  value={aiKeyword}
                  onChange={(e) => setAiKeyword(e.target.value)}
                  placeholder="Ex: IA para atendimento"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Tom de Voz
                </label>
                <input
                  type="text"
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  placeholder="Ex: Profissional, persuasivo e acessível"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Objetivo Estratégico
                </label>
                <input
                  type="text"
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  placeholder="Ex: Educar e gerar oportunidade comercial"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Público-Alvo
                </label>
                <input
                  type="text"
                  value={aiAudience}
                  onChange={(e) => setAiAudience(e.target.value)}
                  placeholder="Ex: Pequenos empresários e líderes"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#22c55e] text-black font-semibold text-xs hover:bg-emerald-400 transition cursor-pointer disabled:opacity-50 shadow-lg"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Roteando pelos modelos de IA e escrevendo rascunho...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Gerar Artigo com IA
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Manual & Edit Flow */
        <div className="space-y-6">
          <div className="bg-[#0f0f11] border border-white/10 rounded-[28px] p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                Título do Artigo *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: 5 Maneiras de Usar IA para Reduzir Custos Operacionais"
                className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Slug Amigável (URL)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="gerado-automaticamente-se-vazio"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  URL da Imagem de Capa
                </label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="/assets/fotos_projetos/... ou /uploads/..."
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                Resumo do Artigo (Exibido nos cards e Meta Description)
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Breve síntese do conteúdo para atrair o leitor"
                className="w-full bg-[#161618] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-[#aaa] uppercase">
                  Conteúdo do Artigo (Markdown / Rich Text) *
                </label>
                <span className="text-[11px] text-[#666]">Suporta títulos (#), listas, negrito e links</span>
              </div>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva seu artigo aqui..."
                className="w-full bg-[#161618] border border-white/10 rounded-xl p-4 font-mono text-xs text-[#ddd] leading-relaxed focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          {/* SEO Details Accordion/Panel */}
          <div className="bg-[#0f0f11] border border-white/10 rounded-[28px] p-6 space-y-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#22c55e]" /> Otimização para Buscadores (SEO)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Meta Title (SEO)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Título otimizado para o Google"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Palavras-Chave (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="ia, negocios, produtividade"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Meta Description (SEO)
                </label>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Descrição que aparece nos resultados do Google"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSavePost(false)}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition cursor-pointer disabled:opacity-50"
            >
              Salvar como Rascunho
            </button>
            <button
              type="button"
              onClick={() => handleSavePost(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#22c55e] text-black text-xs font-semibold hover:bg-emerald-400 transition cursor-pointer disabled:opacity-50 shadow-md"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Publicar Agora
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Save, Eye, CheckCircle2, Globe, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

interface SectionContent {
  id?: string;
  page_slug: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text?: string;
  cta_url?: string;
  image_url?: string;
  content_json?: string;
  is_active: number;
  display_order: number;
  status: "DRAFT" | "PUBLISHED";
}

export default function AdminSiteCMSPage() {
  const [sections, setSections] = useState<SectionContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("hero");

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cms?page=home");
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
        if (data.sections.length > 0 && !activeTab) {
          setActiveTab(data.sections[0].section_key);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar seções:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleUpdateField = (key: string, field: keyof SectionContent, value: unknown) => {
    setSections((prev) =>
      prev.map((s) => (s.section_key === key ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async (section: SectionContent) => {
    setSavingKey(section.section_key);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });

      if (!res.ok) throw new Error("Erro ao salvar seção.");

      setSuccessMessage(`Seção "${section.section_key}" atualizada com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSavingKey(null);
    }
  };

  const activeSection = sections.find((s) => s.section_key === activeTab);

  const sectionLabels: Record<string, { label: string; desc: string }> = {
    hero: { label: "Hero (Topo Principal)", desc: "Primeiro impacto visual e chamada de conversão do visitante" },
    solutions: { label: "Soluções Digitais", desc: "Apresentação das competências e serviços estratégicos" },
    projects: { label: "Portfólio & Cases", desc: "Chamada para a seção de projetos e cases desenvolvidos" },
    cta_banner: { label: "Banner CTA Final", desc: "Chamada de encerramento antes do rodapé" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Gerenciamento de Conteúdo do Site (CMS)</h2>
          <p className="text-xs text-[#888] mt-1">
            Edite textos, títulos, chamadas de ação e imagens sem alterar código nem risco de quebrar o layout.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10 transition"
          >
            <Eye className="w-3.5 h-3.5 text-[#22c55e]" /> Visualizar Site
          </a>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4" /> {successMessage}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-sm text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando seções do CMS...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation Sidebar of Sections */}
          <div className="space-y-2">
            {sections.map((sec) => {
              const info = sectionLabels[sec.section_key] || { label: sec.section_key, desc: "" };
              const isSelected = activeTab === sec.section_key;

              return (
                <button
                  key={sec.section_key}
                  onClick={() => setActiveTab(sec.section_key)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/10 border-white/20 text-white shadow-sm"
                      : "bg-[#0f0f11] border-white/5 text-[#888] hover:text-white hover:border-white/10"
                  }`}
                >
                  <div className="text-xs font-medium text-white">{info.label}</div>
                  <div className="text-[11px] text-[#666] truncate mt-0.5">{info.desc}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-mono ${sec.status === "PUBLISHED" ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-amber-500/10 text-amber-400"}`}>
                      {sec.status}
                    </span>
                    <span className="text-[#555] font-mono">Ordem #{sec.display_order}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section Editor Form */}
          <div className="md:col-span-3">
            {activeSection ? (
              <div className="bg-[#0f0f11] border border-white/10 rounded-[24px] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-medium text-white">
                      Editar: {sectionLabels[activeSection.section_key]?.label || activeSection.section_key}
                    </h3>
                    <p className="text-xs text-[#777] mt-0.5">
                      Identificador no sistema: <code className="font-mono text-[#22c55e]">{activeSection.section_key}</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={activeSection.status}
                      onChange={(e) => handleUpdateField(activeSection.section_key, "status", e.target.value)}
                      className="bg-[#18181b] border border-white/10 text-xs rounded-xl px-3 py-2 text-white focus:outline-none"
                    >
                      <option value="PUBLISHED">PUBLICADO (Ao vivo)</option>
                      <option value="DRAFT">RASCUNHO (Oculto)</option>
                    </select>

                    <button
                      onClick={() => handleSave(activeSection)}
                      disabled={savingKey === activeSection.section_key}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-[#22c55e] transition cursor-pointer disabled:opacity-50"
                    >
                      {savingKey === activeSection.section_key ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" /> Salvar Seção
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                      Subtítulo / Eyebrow Badge
                    </label>
                    <input
                      type="text"
                      value={activeSection.subtitle || ""}
                      onChange={(e) => handleUpdateField(activeSection.section_key, "subtitle", e.target.value)}
                      className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                      placeholder="EX: DESIGN ESTRATÉGICO & IA"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                      Título Principal da Seção
                    </label>
                    <input
                      type="text"
                      value={activeSection.title || ""}
                      onChange={(e) => handleUpdateField(activeSection.section_key, "title", e.target.value)}
                      className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                      placeholder="Título de impacto"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                      Descrição / Texto de Apoio
                    </label>
                    <textarea
                      rows={4}
                      value={activeSection.description || ""}
                      onChange={(e) => handleUpdateField(activeSection.section_key, "description", e.target.value)}
                      className="w-full bg-[#161618] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                      placeholder="Texto descritivo com contexto e valor"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                      Texto do Botão CTA
                    </label>
                    <input
                      type="text"
                      value={activeSection.cta_text || ""}
                      onChange={(e) => handleUpdateField(activeSection.section_key, "cta_text", e.target.value)}
                      className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                      placeholder="Ex: Iniciar Diagnóstico"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                      Link de Destino do CTA
                    </label>
                    <input
                      type="text"
                      value={activeSection.cta_url || ""}
                      onChange={(e) => handleUpdateField(activeSection.section_key, "cta_url", e.target.value)}
                      className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                      placeholder="Ex: /diagnostico ou link WhatsApp"
                    />
                  </div>

                  {activeSection.section_key === "hero" && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                        URL da Imagem de Destaque
                      </label>
                      <input
                        type="text"
                        value={activeSection.image_url || ""}
                        onChange={(e) => handleUpdateField(activeSection.section_key, "image_url", e.target.value)}
                        className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                        placeholder="/assets/hero-mockup.png"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#777]">
                  <span>Status atual: <b className="text-white">{activeSection.status}</b></span>
                  <span>Modificações refletem imediatamente na página pública</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#666]">Selecione uma seção para editar.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

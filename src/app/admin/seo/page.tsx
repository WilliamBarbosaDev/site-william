"use client";

import { useEffect, useState } from "react";
import { Search, Save, CheckCircle2, RefreshCw } from "lucide-react";

export default function AdminSEOPage() {
  const [seo, setSeo] = useState<Record<string, string>>({
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    og_image: "",
    twitter_image: "",
    robots_txt: "",
    canonical_base: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadSEO() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/seo");
        const data = await res.json();
        if (data.seo) setSeo(data.seo);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSEO();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      alert("Erro ao salvar SEO");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Configurações Globais de SEO</h2>
          <p className="text-xs text-[#888] mt-1">
            Controle títulos para buscadores, OpenGraph para redes sociais e regras de indexação.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4" /> Configurações de SEO salvas com sucesso!
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando configurações de SEO...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-[28px] bg-[#0f0f11] border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                Título Padrão do Site (Default Title)
              </label>
              <input
                type="text"
                value={seo.seo_title}
                onChange={(e) => setSeo({ ...seo, seo_title: e.target.value })}
                className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                Meta Description Padrão
              </label>
              <textarea
                rows={3}
                value={seo.seo_description}
                onChange={(e) => setSeo({ ...seo, seo_description: e.target.value })}
                className="w-full bg-[#161618] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                Palavras-Chave Padrão (Separadas por vírgula)
              </label>
              <input
                type="text"
                value={seo.seo_keywords}
                onChange={(e) => setSeo({ ...seo, seo_keywords: e.target.value })}
                className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Imagem de Compartilhamento (OpenGraph / Facebook / LinkedIn)
                </label>
                <input
                  type="text"
                  value={seo.og_image}
                  onChange={(e) => setSeo({ ...seo, og_image: e.target.value })}
                  placeholder="/assets/og-image.png"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  URL Canônica Base
                </label>
                <input
                  type="text"
                  value={seo.canonical_base}
                  onChange={(e) => setSeo({ ...seo, canonical_base: e.target.value })}
                  placeholder="https://williambdesigner.com.br"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                Conteúdo do Robots.txt
              </label>
              <textarea
                rows={4}
                value={seo.robots_txt}
                onChange={(e) => setSeo({ ...seo, robots_txt: e.target.value })}
                className="w-full bg-[#161618] border border-white/10 rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#22c55e] transition cursor-pointer disabled:opacity-50 shadow-md"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Salvar Configurações de SEO
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

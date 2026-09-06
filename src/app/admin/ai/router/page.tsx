"use client";

import { useEffect, useState } from "react";
import { Cpu, ArrowRight, Save, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";

interface AIRoute {
  id: string;
  task_name: string;
  primary_provider_id: string;
  primary_model_id: string;
  primary_provider_name?: string;
  primary_model_name?: string;
  fallback1_provider_id?: string;
  fallback1_model_id?: string;
  fallback1_provider_name?: string;
  fallback1_model_name?: string;
  fallback2_provider_id?: string;
  fallback2_model_id?: string;
  fallback2_provider_name?: string;
  fallback2_model_name?: string;
  is_active: number;
}

interface ModelOption {
  id: string;
  provider_id: string;
  provider_name: string;
  name: string;
}

export default function AdminAIRouterPage() {
  const [routes, setRoutes] = useState<AIRoute[]>([]);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resRoutes, resModels] = await Promise.all([
        fetch("/api/admin/ai/router"),
        fetch("/api/admin/ai/models"),
      ]);

      const dataRoutes = await resRoutes.json();
      const dataModels = await resModels.json();

      if (dataRoutes.routes) setRoutes(dataRoutes.routes);
      if (dataModels.models) {
        setModels(
          dataModels.models.map((m: { id: string; provider_id: string; provider_name: string; name: string }) => ({
            id: m.id,
            provider_id: m.provider_id,
            provider_name: m.provider_name,
            name: `${m.name} (${m.provider_name})`,
          }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateRoute = (routeId: string, field: string, value: string) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id !== routeId) return r;

        if (field === "primary_model_id") {
          const selectedModel = models.find((m) => m.id === value);
          return {
            ...r,
            primary_model_id: value,
            primary_provider_id: selectedModel ? selectedModel.provider_id : r.primary_provider_id,
          };
        }

        if (field === "fallback1_model_id") {
          const selectedModel = models.find((m) => m.id === value);
          return {
            ...r,
            fallback1_model_id: value,
            fallback1_provider_id: selectedModel ? selectedModel.provider_id : r.fallback1_provider_id,
          };
        }

        if (field === "fallback2_model_id") {
          const selectedModel = models.find((m) => m.id === value);
          return {
            ...r,
            fallback2_model_id: value,
            fallback2_provider_id: selectedModel ? selectedModel.provider_id : r.fallback2_provider_id,
          };
        }

        return { ...r, [field]: value };
      })
    );
  };

  const handleSaveRoute = async (route: AIRoute) => {
    setSavingId(route.id);
    try {
      const res = await fetch("/api/admin/ai/router", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(route),
      });

      if (res.ok) {
        setSuccessMessage(`Rotas para ${route.task_name} salvas com sucesso!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (e) {
      alert("Erro ao salvar rota");
    } finally {
      setSavingId(null);
    }
  };

  const taskDescriptions: Record<string, string> = {
    CHAT: "Atendimento conversacional geral e respostas rápidas ao visitante",
    DIAGNOSTIC_INTERVIEW: "Entrevista consultiva guiada do agente de negócios (/diagnostico)",
    BUSINESS_ANALYSIS: "Mapeamento aprofundado de maturidade digital e gargalos da empresa",
    FINAL_DIAGNOSIS: "Geração da recomendação estratégica e dossiê final",
    BLOG_IDEATION: "Pesquisa e geração de ideias de artigos com foco em autoridade",
    BLOG_WRITING: "Produção de artigos completos e aprofundados com formatação editorial",
    BLOG_SEO: "Geração de Meta Tags, títulos para o Google e palavras-chave",
    CONTENT_REWRITE: "Ajuste de tom de voz, clareza e persuasão de textos",
    SERVICE_RECOMMENDATION: "Classificação matemática da melhor solução comercial",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">AI Router — Roteamento por Tarefa</h2>
          <p className="text-xs text-[#888] mt-1">
            Defina qual modelo de IA lidera cada tarefa e encadeie até dois modelos de fallback automático.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4" /> {successMessage}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando rotas do AI Router...
        </div>
      ) : (
        <div className="space-y-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className="p-6 rounded-[24px] bg-[#0f0f11] border border-white/10 space-y-4 hover:border-white/20 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#22c55e] px-2.5 py-1 rounded bg-[#22c55e]/10 border border-[#22c55e]/20">
                    {route.task_name}
                  </span>
                  <p className="text-xs text-[#888] mt-2">
                    {taskDescriptions[route.task_name] || "Tarefa de processamento do ecossistema"}
                  </p>
                </div>

                <button
                  onClick={() => handleSaveRoute(route)}
                  disabled={savingId === route.id}
                  className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-xs font-medium hover:bg-[#22c55e] transition cursor-pointer disabled:opacity-50"
                >
                  {savingId === route.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> Salvar Rota
                    </>
                  )}
                </button>
              </div>

              {/* 3 Columns: Primary, Fallback 1, Fallback 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Primary Model */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[10px] font-mono uppercase text-[#22c55e] tracking-wider font-semibold">
                    ★ Modelo Principal
                  </div>
                  <select
                    value={route.primary_model_id}
                    onChange={(e) => handleUpdateRoute(route.id, "primary_model_id", e.target.value)}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fallback 1 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[10px] font-mono uppercase text-[#bbb] tracking-wider">
                    Fallback 1 (Secundário)
                  </div>
                  <select
                    value={route.fallback1_model_id || ""}
                    onChange={(e) => handleUpdateRoute(route.id, "fallback1_model_id", e.target.value)}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="">Nenhum</option>
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fallback 2 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[10px] font-mono uppercase text-[#bbb] tracking-wider">
                    Fallback 2 (Terciário)
                  </div>
                  <select
                    value={route.fallback2_model_id || ""}
                    onChange={(e) => handleUpdateRoute(route.id, "fallback2_model_id", e.target.value)}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="">Nenhum</option>
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

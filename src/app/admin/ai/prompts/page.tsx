"use client";

import { useEffect, useState } from "react";
import { MessageSquareCode, Save, History, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

interface AIPrompt {
  id: string;
  identifier: string;
  name: string;
  prompt_template: string;
  version: number;
  is_active: number;
  updated_at: string;
}

export default function AdminAIPromptsPage() {
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ai/prompts");
      const data = await res.json();
      if (data.prompts && data.prompts.length > 0) {
        setPrompts(data.prompts);
        if (!selectedPromptId) {
          setSelectedPromptId(data.prompts[0].id);
          setCurrentText(data.prompts[0].prompt_template);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleSelectPrompt = (p: AIPrompt) => {
    setSelectedPromptId(p.id);
    setCurrentText(p.prompt_template);
  };

  const handleSavePrompt = async () => {
    if (!selectedPromptId) return;
    setSavingId(selectedPromptId);

    try {
      const res = await fetch("/api/admin/ai/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedPromptId, prompt_template: currentText }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(`Prompt atualizado com sucesso! Nova versão arquivada: v${data.version}`);
        setTimeout(() => setSuccessMessage(null), 4000);
        // update local list
        setPrompts((prev) =>
          prev.map((p) => (p.id === selectedPromptId ? { ...p, prompt_template: currentText, version: data.version } : p))
        );
      }
    } catch (e) {
      alert("Erro ao salvar prompt");
    } finally {
      setSavingId(null);
    }
  };

  const activePrompt = prompts.find((p) => p.id === selectedPromptId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Gerenciamento de Prompts de IA</h2>
          <p className="text-xs text-[#888] mt-1">
            Edite as instruções dos agentes e geradores de conteúdo sem alterar código. Versões anteriores são arquivadas automaticamente.
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
          Carregando templates de prompts...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Prompt Selection List */}
          <div className="space-y-2">
            {prompts.map((p) => {
              const isSelected = p.id === selectedPromptId;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPrompt(p)}
                  className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-white/10 border-white/20 text-white shadow-sm"
                      : "bg-[#0f0f11] border-white/5 text-[#888] hover:text-white hover:border-white/10"
                  }`}
                >
                  <div className="text-xs font-semibold text-white">{p.name}</div>
                  <div className="text-[11px] text-[#22c55e] font-mono mt-1">{p.identifier}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#666]">
                    <span className="font-mono">Versão v{p.version}</span>
                    <History className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Prompt Editor */}
          <div className="md:col-span-3">
            {activePrompt ? (
              <div className="bg-[#0f0f11] border border-white/10 rounded-[24px] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-medium text-white">{activePrompt.name}</h3>
                    <p className="text-xs text-[#777] font-mono mt-0.5">
                      Identificador: <span className="text-[#22c55e]">{activePrompt.identifier}</span> • Versão Atual: v{activePrompt.version}
                    </p>
                  </div>

                  <button
                    onClick={handleSavePrompt}
                    disabled={savingId === activePrompt.id}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-[#22c55e] transition cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {savingId === activePrompt.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" /> Salvar Versão
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-2">
                    Template do Prompt do Sistema (Instruções da IA)
                  </label>
                  <textarea
                    rows={16}
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl p-4 font-mono text-xs text-[#ddd] leading-relaxed focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div className="pt-2 text-xs text-[#666] flex items-center justify-between">
                  <span>As alterações são aplicadas instantaneamente a todas as tarefas conectadas ao AI Router.</span>
                  <span className="font-mono text-[#888]">Auto-Versionamento Ativo</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

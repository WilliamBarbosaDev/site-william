"use client";

import { useEffect, useState } from "react";
import {
  Cpu,
  Plus,
  Key,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Zap,
  Globe,
  Trash2,
  ExternalLink,
  Power,
  Activity,
  AlertTriangle,
  Radio,
} from "lucide-react";

interface Provider {
  id: string;
  name: string;
  provider_type: string;
  base_url?: string;
  is_active: number;
  priority: number;
  status: string;
  has_key: boolean;
  masked_key: string;
}

const PRESETS: Record<
  string,
  {
    name: string;
    type: string;
    baseUrl: string;
    desc: string;
    placeholder: string;
    keyPrefix: string;
    dashboardUrl: string;
  }
> = {
  groq: {
    name: "Groq Cloud (Llama & Mixtral)",
    type: "groq",
    baseUrl: "https://api.groq.com/openai/v1",
    desc: "Inferência ultrarrápida via chips LPU com Llama 3.3 e Mixtral.",
    placeholder: "gsk_...",
    keyPrefix: "gsk_",
    dashboardUrl: "https://console.groq.com/keys",
  },
  openrouter: {
    name: "OpenRouter (Todos os Modelos)",
    type: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1",
    desc: "Acesso unificado a DeepSeek V3/R1, Claude 3.5, GPT-4o e centenas de modelos com uma só chave.",
    placeholder: "sk-or-v1-...",
    keyPrefix: "sk-or-",
    dashboardUrl: "https://openrouter.ai/keys",
  },
  openai: {
    name: "OpenAI (ChatGPT / GPT-4o)",
    type: "openai",
    baseUrl: "https://api.openai.com/v1",
    desc: "Modelos oficiais GPT-4o, GPT-4o Mini e família o1.",
    placeholder: "sk-proj-...",
    keyPrefix: "sk-",
    dashboardUrl: "https://platform.openai.com/api-keys",
  },
  gemini: {
    name: "Google Gemini",
    type: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    desc: "Gemini 2.5 Flash e Gemini 2.5 Pro com visão e grande janela de contexto.",
    placeholder: "AIzaSy...",
    keyPrefix: "AIza",
    dashboardUrl: "https://aistudio.google.com/app/apikey",
  },
  anthropic: {
    name: "Anthropic Claude",
    type: "anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    desc: "Claude 3.5 Sonnet e Haiku para raciocínio e redação avançada.",
    placeholder: "sk-ant-api03-...",
    keyPrefix: "sk-ant-",
    dashboardUrl: "https://console.anthropic.com/settings/keys",
  },
  custom: {
    name: "Provedor Customizado (OpenAI Compatível)",
    type: "custom",
    baseUrl: "https://api.deepseek.com/v1",
    desc: "Conecte DeepSeek direto, Together AI, Mistral, Ollama ou qualquer API compatível com OpenAI.",
    placeholder: "sk-...",
    keyPrefix: "",
    dashboardUrl: "",
  },
};

export default function AdminAIProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Partial<Provider & { api_key?: string }> | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("groq");
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [saving, setSaving] = useState(false);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ai/providers");
      const data = await res.json();
      if (data.providers) setProviders(data.providers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const openNewWithPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = PRESETS[presetKey];
    setEditingProvider({
      name: preset.name,
      provider_type: preset.type,
      base_url: preset.baseUrl,
      api_key: "",
      priority: providers.length + 1,
      is_active: 1,
    });
    setShowModal(true);
  };

  const handleToggleActive = async (p: Provider) => {
    try {
      const nextActive = p.is_active ? 0 : 1;
      const res = await fetch("/api/admin/ai/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, is_active: nextActive }),
      });
      if (res.ok) {
        setProviders((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, is_active: nextActive } : item))
        );
      }
    } catch (e) {
      alert("Erro ao alterar status do provedor");
    }
  };

  const handleDelete = async (p: Provider) => {
    if (!confirm(`Tem certeza que deseja remover o provedor "${p.name}"? Os modelos vinculados também serão removidos.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/ai/providers?id=${p.id}`, { method: "DELETE" });
      if (res.ok) {
        setProviders((prev) => prev.filter((item) => item.id !== p.id));
      } else {
        alert("Erro ao remover provedor.");
      }
    } catch (e) {
      alert("Erro de conexão ao remover provedor.");
    }
  };

  const handleTestConnection = async (providerId: string, providerType: string, baseUrl?: string) => {
    setTestingId(providerId);
    try {
      const res = await fetch("/api/admin/ai/providers/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          providerType,
          baseUrl,
        }),
      });
      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [providerId]: {
          success: data.success,
          message: data.message || (data.success ? "Conexão ativa!" : "Falha na conexão"),
        },
      }));
    } catch (e) {
      setTestResults((prev) => ({
        ...prev,
        [providerId]: { success: false, message: "Erro de rede ao testar." },
      }));
    } finally {
      setTestingId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/ai/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProvider),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingProvider(null);
        fetchProviders();
      } else {
        const d = await res.json();
        alert(d.message || "Erro ao salvar provedor");
      }
    } catch (e) {
      alert("Erro ao salvar provedor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white tracking-tight">Provedores & Chaves de Inteligência Artificial</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
              Multi-Chave Ativo
            </span>
          </div>
          <p className="text-xs text-[#888] mt-1">
            Adicione quantas chaves de API quiser: <strong>Groq, OpenRouter, OpenAI, Google Gemini, Anthropic Claude</strong> ou <strong>qualquer endpoint compatível</strong>.
          </p>
        </div>

        <button
          onClick={() => openNewWithPreset("groq")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-[#22c55e] transition shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar Nova Chave
        </button>
      </div>

      {/* Quick Preset Shortcuts */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono uppercase text-[#777] tracking-wider flex items-center gap-2">
          <span>Adicionar com 1 clique (Presets prontos)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => openNewWithPreset(key)}
              className="p-3 rounded-xl bg-[#0f0f11] border border-white/5 hover:border-[#22c55e]/40 hover:bg-white/[0.03] text-left transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="text-xs font-semibold text-white group-hover:text-[#22c55e] transition flex items-center justify-between">
                <span>{p.type.toUpperCase()}</span>
                <Plus className="w-3 h-3 text-[#555] group-hover:text-[#22c55e]" />
              </div>
              <div className="text-[10px] text-[#777] truncate mt-1">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando provedores...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {providers.map((p) => {
            const result = testResults[p.id];
            const isTesting = testingId === p.id;

            return (
              <div
                key={p.id}
                className={`p-6 rounded-[24px] bg-[#0f0f11] border transition flex flex-col justify-between space-y-4 ${
                  p.is_active ? "border-white/10 hover:border-white/20" : "border-white/5 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 text-[#bbb]">
                      {p.provider_type}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(p)}
                        title={p.is_active ? "Desativar provedor" : "Ativar provedor"}
                        className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                          p.is_active
                            ? "bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20"
                            : "bg-white/5 text-[#666] hover:text-white"
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(p)}
                        title="Excluir provedor"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[#666] hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-white tracking-tight">{p.name}</h3>

                  <div className="mt-3 space-y-1.5 text-xs text-[#888]">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <Key className="w-3.5 h-3.5 text-[#22c55e]" />
                      <span className="text-white/90">
                        {p.has_key ? p.masked_key : "Sem chave no banco (usando .env ou padrão)"}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#666] truncate font-mono" title={p.base_url || "Padrão oficial"}>
                      Endpoint: {p.base_url || "Padrão oficial"}
                    </div>
                  </div>

                  {/* Test result box */}
                  {result && (
                    <div
                      className={`mt-3 p-2.5 rounded-xl text-[11px] font-mono border flex items-start gap-2 ${
                        result.success
                          ? "bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]"
                          : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      )}
                      <span className="break-all">{result.message}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTestConnection(p.id, p.provider_type, p.base_url)}
                    disabled={isTesting || !p.has_key}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#bbb] hover:text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-[#22c55e]" />
                        <span>Testando...</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-3 h-3 text-[#22c55e]" />
                        <span>Testar Ping</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setEditingProvider(p);
                      setShowModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white text-xs text-white hover:text-black font-semibold transition cursor-pointer"
                  >
                    Editar Chave
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Configure Provider */}
      {showModal && editingProvider && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-[28px] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {editingProvider.id ? "Editar Chave de API" : "Adicionar Provedor de IA"}
                </h3>
                <p className="text-[11px] text-[#888] mt-0.5">
                  A chave é gravada com segurança no banco SQLite e fica imediatamente disponível no Roteador de IA.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Nome do Provedor</label>
                <input
                  type="text"
                  value={editingProvider.name || ""}
                  onChange={(e) => setEditingProvider({ ...editingProvider, name: e.target.value })}
                  required
                  placeholder="Ex: Groq Cloud, OpenRouter, OpenAI..."
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Tipo de Conector</label>
                <select
                  value={editingProvider.provider_type || "openai"}
                  onChange={(e) => {
                    const t = e.target.value;
                    const preset = PRESETS[t];
                    setEditingProvider({
                      ...editingProvider,
                      provider_type: t,
                      name: editingProvider.name || (preset ? preset.name : t),
                      base_url: preset ? preset.baseUrl : editingProvider.base_url,
                    });
                  }}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="groq">Groq Cloud (Llama 3.3 / Mixtral)</option>
                  <option value="openrouter">OpenRouter (DeepSeek / Claude / GPT / Llama)</option>
                  <option value="openai">OpenAI (GPT-4o / ChatGPT)</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="custom">Provedor Customizado (OpenAI Compatível)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-[#aaa] uppercase">
                    Chave de API (API Key / Token) *
                  </label>
                  {PRESETS[editingProvider.provider_type || ""]?.dashboardUrl && (
                    <a
                      href={PRESETS[editingProvider.provider_type || ""].dashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#22c55e] hover:underline inline-flex items-center gap-1"
                    >
                      Obter chave aqui <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  value={editingProvider.api_key || ""}
                  onChange={(e) => setEditingProvider({ ...editingProvider, api_key: e.target.value })}
                  placeholder={
                    editingProvider.has_key
                      ? "•••••••••••••••••••••••• (Preencha somente para alterar)"
                      : "Cole aqui sua chave de API..."
                  }
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Base URL do Endpoint</label>
                <input
                  type="text"
                  value={editingProvider.base_url || ""}
                  onChange={(e) => setEditingProvider({ ...editingProvider, base_url: e.target.value })}
                  placeholder="https://api.groq.com/openai/v1 ou https://openrouter.ai/api/v1"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#22c55e]"
                />
                <span className="text-[10px] text-[#666] mt-1 block">
                  Para Groq, OpenRouter ou OpenAI, a Base URL padrão já está pré-preenchida. Para provedores customizados (DeepSeek, Together, etc.), indique a URL base compatível.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#888] hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#22c55e] text-black text-xs font-semibold hover:bg-emerald-400 transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar Chave & Provedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

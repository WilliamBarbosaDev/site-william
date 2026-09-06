"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Send,
  User,
  Power,
  Zap,
  HelpCircle,
  Copy,
  BookOpen,
  CheckCircle2,
  X,
} from "lucide-react";
import { AiAgentRecord } from "@/lib/ai/agents-service";
import { AGENT_PROMPTS, COMPANY_PRICING_CATALOG, COMPANY_IDENTITY } from "@/lib/ai/company-knowledge";

export default function AdminAiAgentsPage() {
  const [agents, setAgents] = useState<AiAgentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Partial<AiAgentRecord> | null>(null);
  const [triggerInput, setTriggerInput] = useState("");
  const [saving, setSaving] = useState(false);

  // Live chat playground state
  const [activeChatAgent, setActiveChatAgent] = useState<AiAgentRecord | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string; durationMs?: number }>>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ai/agents");
      const data = await res.json();
      if (data.agents) setAgents(data.agents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const openModal = (agent?: AiAgentRecord) => {
    if (agent) {
      setEditingAgent(agent);
      let triggers: string[] = [];
      try {
        if (agent.trigger_phrases_json) triggers = JSON.parse(agent.trigger_phrases_json);
      } catch (e) {}
      setTriggerInput(triggers.join("\n"));
    } else {
      setEditingAgent({
        name: "",
        role_title: "Consultor Comercial",
        category: "SALES",
        description: "Agente inteligente treinado para conduzir clientes e negociar serviços.",
        system_instructions: AGENT_PROMPTS.closer,
        temperature: 0.7,
        max_tokens: 4096,
        avatar_emoji: "💼",
        is_active: 1,
      });
      setTriggerInput("Quanto custa um site?\nQual a diferença para uma agência?\nQual o prazo de entrega?");
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    setSaving(true);
    try {
      const triggers = triggerInput
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...editingAgent,
        trigger_phrases_json: JSON.stringify(triggers),
      };

      const res = await fetch("/api/admin/ai/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingAgent(null);
        fetchAgents();
      } else {
        alert("Erro ao salvar agente.");
      }
    } catch (e) {
      alert("Erro ao salvar agente");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o agente "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/ai/agents/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAgents((prev) => prev.filter((a) => a.id !== id));
        if (activeChatAgent?.id === id) setActiveChatAgent(null);
      }
    } catch (e) {
      alert("Erro ao excluir agente");
    }
  };

  const handleToggleActive = async (agent: AiAgentRecord) => {
    const nextActive = agent.is_active ? 0 : 1;
    try {
      const res = await fetch("/api/admin/ai/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agent.id, is_active: nextActive }),
      });
      if (res.ok) {
        setAgents((prev) =>
          prev.map((a) => (a.id === agent.id ? { ...a, is_active: nextActive } : a))
        );
      }
    } catch (e) {
      alert("Erro ao alternar status do agente");
    }
  };

  const openChatPlayground = (agent: AiAgentRecord) => {
    setActiveChatAgent(agent);
    let initialGreeting = `Olá! Sou o **${agent.name}** (${agent.role_title}). Como posso te ajudar hoje?`;
    if (agent.category === "SALES") {
      initialGreeting = `Olá! Sou o **${agent.name}**, especialista em soluções digitais de William Barbosa. Em que posso te ajudar para alavancar os resultados da sua empresa hoje?`;
    } else if (agent.category === "SDR") {
      initialGreeting = `Olá! Bem-vindo. Sou o **${agent.name}**. Me conte qual o ramo da sua empresa para recomendarmos a solução digital perfeita!`;
    }

    setChatMessages([
      {
        role: "assistant",
        content: initialGreeting,
      },
    ]);
  };

  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || messageInput;
    if (!activeChatAgent || !textToSend.trim() || sendingChat) return;

    const newHistory = [...chatMessages, { role: "user" as const, content: textToSend.trim() }];
    setChatMessages(newHistory);
    setMessageInput("");
    setSendingChat(true);

    try {
      const res = await fetch("/api/admin/ai/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: activeChatAgent.id,
          message: textToSend.trim(),
          history: newHistory,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.text,
            durationMs: data.durationMs,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ Erro ao obter resposta: ${data.message || "Tente novamente."}`,
          },
        ]);
      }
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Erro de conexão com o servidor de IA.",
        },
      ]);
    } finally {
      setSendingChat(false);
    }
  };

  const injectCompanyKnowledge = () => {
    if (!editingAgent) return;
    const pricingSummary = COMPANY_PRICING_CATALOG.map(
      (p) => `- ${p.name}: ${p.startingPrice} (~${p.estimatedDays} dias úteis). ${p.differentials}`
    ).join("\n");

    const appended = `\n\n--- BASE DE CONHECIMENTO INJETADA DA EMPRESA WILLIAM BARBOSA ---
Contato Oficial: ${COMPANY_IDENTITY.phoneDisplay} (${COMPANY_IDENTITY.whatsappLink})
Metodologia: ${COMPANY_IDENTITY.methodology.join(" | ")}

SERVIÇOS E VALORES OFICIAIS:
${pricingSummary}
`;

    setEditingAgent({
      ...editingAgent,
      system_instructions: (editingAgent.system_instructions || "") + appended,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white tracking-tight">Agentes Especializados de Inteligência Artificial</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
              5 Agentes Treinados
            </span>
          </div>
          <p className="text-xs text-[#888] mt-1">
            Agentes comerciais, SDRs, suporte e copywriters treinados com todo o conhecimento, portfólio e valores da sua empresa. Crie novos agentes a qualquer momento.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-[#22c55e] transition shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Criar Novo Agente de IA
        </button>
      </div>

      {/* Main Grid & Playground Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agents List (Col 7 or 12) */}
        <div className={activeChatAgent ? "lg:col-span-7 space-y-4" : "lg:col-span-12 space-y-4"}>
          {loading ? (
            <div className="p-12 text-center text-xs text-[#777]">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
              Carregando agentes treinados...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => {
                let triggers: string[] = [];
                try {
                  if (agent.trigger_phrases_json) triggers = JSON.parse(agent.trigger_phrases_json);
                } catch (e) {}

                const isSelectedForChat = activeChatAgent?.id === agent.id;

                return (
                  <div
                    key={agent.id}
                    className={`p-5 rounded-[24px] bg-[#0f0f11] border transition flex flex-col justify-between space-y-4 ${
                      isSelectedForChat
                        ? "border-[#22c55e] shadow-lg shadow-[#22c55e]/5"
                        : agent.is_active
                        ? "border-white/10 hover:border-white/20"
                        : "border-white/5 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{agent.avatar_emoji || "🤖"}</span>
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-white/5 text-[#bbb]">
                              {agent.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleActive(agent)}
                            title={agent.is_active ? "Desativar agente" : "Ativar agente"}
                            className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                              agent.is_active
                                ? "bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20"
                                : "bg-white/5 text-[#666] hover:text-white"
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openModal(agent)}
                            title="Editar instruções e regras"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(agent.id, agent.name)}
                            title="Excluir agente"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[#666] hover:text-rose-400 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-semibold text-white tracking-tight">{agent.name}</h3>
                      <p className="text-[11px] font-mono text-[#22c55e] mt-0.5">{agent.role_title}</p>
                      <p className="text-xs text-[#888] mt-2 line-clamp-2">{agent.description}</p>

                      {/* Triggers Preview */}
                      {triggers.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {triggers.slice(0, 2).map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[10px] text-[#777] truncate max-w-[200px]">
                              "{t}"
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#666]">
                        Temp: {agent.temperature} | Max: {agent.max_tokens}
                      </span>

                      <button
                        onClick={() => openChatPlayground(agent)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                          isSelectedForChat
                            ? "bg-[#22c55e] text-black font-semibold"
                            : "bg-white/5 hover:bg-white/10 text-white"
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isSelectedForChat ? "Conversando" : "Testar Agente"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Chat Playground (Col 5) */}
        {activeChatAgent && (
          <div className="lg:col-span-5 bg-[#0f0f11] border border-white/10 rounded-[28px] p-5 flex flex-col h-[700px] justify-between shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeChatAgent.avatar_emoji}</span>
                <div>
                  <h4 className="text-sm font-semibold text-white leading-tight">{activeChatAgent.name}</h4>
                  <p className="text-[10px] font-mono text-[#22c55e]">{activeChatAgent.role_title}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveChatAgent(null)}
                className="p-1 rounded-lg text-[#666] hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {activeChatAgent.avatar_emoji}
                    </span>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#22c55e] text-black font-medium"
                        : "bg-white/5 text-white border border-white/5"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.durationMs && (
                      <span className="block text-[9px] font-mono text-[#666] mt-1 text-right">
                        {msg.durationMs}ms
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {sendingChat && (
                <div className="flex gap-2 items-center text-[#777] text-[11px] font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#22c55e]" />
                  <span>{activeChatAgent.name} está digitando...</span>
                </div>
              )}
            </div>

            {/* Quick Trigger Buttons */}
            {activeChatAgent.trigger_phrases_json && (
              <div className="pb-2 border-t border-white/5 pt-2">
                <div className="text-[10px] font-mono uppercase text-[#666] mb-1">Perguntas rápidas de teste:</div>
                <div className="flex flex-wrap gap-1">
                  {(() => {
                    try {
                      const arr = JSON.parse(activeChatAgent.trigger_phrases_json);
                      return arr.slice(0, 3).map((phrase: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleSendChatMessage(phrase)}
                          disabled={sendingChat}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-[#aaa] hover:text-white transition cursor-pointer text-left truncate max-w-full"
                        >
                          "{phrase}"
                        </button>
                      ));
                    } catch (e) {
                      return null;
                    }
                  })()}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="flex items-center gap-2 pt-2 border-t border-white/10"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Converse com ${activeChatAgent.name}...`}
                disabled={sendingChat}
                className="flex-1 bg-[#161618] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-[#555] focus:outline-none focus:border-[#22c55e]"
              />
              <button
                type="submit"
                disabled={sendingChat || !messageInput.trim()}
                className="p-2.5 rounded-xl bg-[#22c55e] text-black hover:bg-emerald-400 transition cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Modal Create / Edit Agent */}
      {showModal && editingAgent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-[28px] max-w-2xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {editingAgent.id ? "Editar Agente de IA" : "Criar Novo Agente de IA"}
                </h3>
                <p className="text-[11px] text-[#888] mt-0.5">
                  Configure a personalidade, o papel no funil de vendas e as instruções mestras de treinamento.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Emoji</label>
                  <input
                    type="text"
                    value={editingAgent.avatar_emoji || "🤖"}
                    onChange={(e) => setEditingAgent({ ...editingAgent, avatar_emoji: e.target.value })}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-center text-base text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Nome do Agente *</label>
                  <input
                    type="text"
                    value={editingAgent.name || ""}
                    onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                    required
                    placeholder="Ex: William Closer AI"
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Categoria / Função</label>
                  <select
                    value={editingAgent.category || "CUSTOM"}
                    onChange={(e) =>
                      setEditingAgent({
                        ...editingAgent,
                        category: e.target.value as AiAgentRecord["category"],
                      })
                    }
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="SALES">Comercial / Fechamento</option>
                    <option value="SDR">SDR / Triagem de Leads</option>
                    <option value="SUPPORT">Suporte & Atendimento</option>
                    <option value="TECHNICAL">Técnico / Engenharia</option>
                    <option value="CONTENT">Copywriter / Conteúdo</option>
                    <option value="CUSTOM">Customizado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Cargo / Especialidade</label>
                <input
                  type="text"
                  value={editingAgent.role_title || ""}
                  onChange={(e) => setEditingAgent({ ...editingAgent, role_title: e.target.value })}
                  placeholder="Ex: Consultor Comercial & Fechamento de Vendas"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Descrição Curta</label>
                <input
                  type="text"
                  value={editingAgent.description || ""}
                  onChange={(e) => setEditingAgent({ ...editingAgent, description: e.target.value })}
                  placeholder="Ex: Especialista em entender o modelo de negócio e fechar no WhatsApp."
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              {/* Instructions Editor with Inject Knowledge button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-[#aaa] uppercase">
                    Instruções de Treinamento (System Prompt) *
                  </label>
                  <button
                    type="button"
                    onClick={injectCompanyKnowledge}
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-[#22c55e] hover:underline cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" /> Injetar Conhecimento & Preços da Empresa
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={editingAgent.system_instructions || ""}
                  onChange={(e) => setEditingAgent({ ...editingAgent, system_instructions: e.target.value })}
                  required
                  placeholder="Instrua o agente detalhadamente sobre sua personalidade, regras e informações da empresa..."
                  className="w-full bg-[#161618] border border-white/10 rounded-xl p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">
                    Temperatura ({editingAgent.temperature ?? 0.7})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={editingAgent.temperature ?? 0.7}
                    onChange={(e) => setEditingAgent({ ...editingAgent, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-[#22c55e]"
                  />
                  <div className="flex justify-between text-[10px] text-[#666] font-mono">
                    <span>0.0 (Preciso)</span>
                    <span>1.0 (Criativo)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Max Tokens</label>
                  <input
                    type="number"
                    value={editingAgent.max_tokens ?? 4096}
                    onChange={(e) => setEditingAgent({ ...editingAgent, max_tokens: parseInt(e.target.value, 10) || 4096 })}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">
                  Perguntas de Gatilho / Exemplos de Teste (uma por linha)
                </label>
                <textarea
                  rows={3}
                  value={triggerInput}
                  onChange={(e) => setTriggerInput(e.target.value)}
                  placeholder={"Quanto custa um site?\nQual o prazo de entrega?\nComo funciona o pagamento?"}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#22c55e]"
                />
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
                  {saving ? "Salvando..." : "Salvar Agente de IA"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

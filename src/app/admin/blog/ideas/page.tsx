"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lightbulb, Plus, Trash2, ArrowRight, Sparkles, RefreshCw } from "lucide-react";

interface Idea {
  id: string;
  topic: string;
  keyword?: string;
  category: string;
  objective?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "IDEA" | "PLANNED" | "GENERATED" | "PUBLISHED";
  created_at: string;
}

export default function AdminBlogIdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New idea form
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Inteligência Artificial");
  const [objective, setObjective] = useState("");
  const [priority, setPriority] = useState<Idea["priority"]>("MEDIUM");

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blog/ideas");
      const data = await res.json();
      if (data.ideas) setIdeas(data.ideas);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/blog/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keyword, category, objective, priority }),
      });
      if (res.ok) {
        setShowModal(false);
        setTopic("");
        setKeyword("");
        setObjective("");
        fetchIdeas();
      }
    } catch (e) {
      alert("Erro ao salvar ideia");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir ideia?")) return;
    try {
      await fetch(`/api/admin/blog/ideas?id=${id}`, { method: "DELETE" });
      setIdeas((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      alert("Erro ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Banco de Ideias de Conteúdo</h2>
          <p className="text-xs text-[#888] mt-1">
            Fila estratégica de pautas e palavras-chave prontas para geração futura com IA.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-medium hover:bg-[#22c55e] transition shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar Pauta
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando ideias...
        </div>
      ) : ideas.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0f0f11] border border-white/5 text-center text-xs text-[#777]">
          Nenhuma pauta cadastrada ainda. Clique em "Adicionar Pauta" para alimentar a fila.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="p-5 rounded-2xl bg-[#0f0f11] border border-white/10 flex flex-col justify-between hover:border-white/20 transition space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-[#bbb]">
                    {idea.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      idea.priority === "HIGH"
                        ? "bg-rose-500/10 text-rose-400"
                        : idea.priority === "MEDIUM"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {idea.priority}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-white">{idea.topic}</h3>
                {idea.keyword && (
                  <p className="text-[11px] text-[#22c55e] font-mono mt-1">
                    Keyword: {idea.keyword}
                  </p>
                )}
                {idea.objective && (
                  <p className="text-xs text-[#777] mt-2 line-clamp-2">
                    {idea.objective}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <Link
                  href={`/admin/blog/new?mode=ai&theme=${encodeURIComponent(idea.topic)}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] hover:underline font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Gerar Artigo com IA
                </Link>
                <button
                  onClick={() => handleDelete(idea.id)}
                  className="p-1.5 text-[#666] hover:text-red-400 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Idea */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-[28px] max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">Cadastrar Nova Ideia de Conteúdo</h3>
            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Tema / Pauta *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  placeholder="Ex: Como agentes de IA aceleram vendas em 2026"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Palavra-Chave</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: agentes de IA, automacao de vendas"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Categoria</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Idea["priority"])}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="HIGH">Alta</option>
                    <option value="MEDIUM">Média</option>
                    <option value="LOW">Baixa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Objetivo</label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Ex: Atrair diretores de marketing e vender CRM com IA"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#888] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#22c55e] text-black text-xs font-semibold hover:bg-emerald-400 transition cursor-pointer shadow-md"
                >
                  Salvar Pauta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Sparkles,
  Search,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw
} from "lucide-react";
import { BlogPost } from "@/lib/blog/blog-service";

export default function AdminBlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error("Erro ao carregar posts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "POST" });
      if (res.ok) {
        fetchPosts();
      }
    } catch (e) {
      alert("Erro ao duplicar post");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este artigo permanentemente?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      alert("Erro ao excluir post");
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.summary && p.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Artigos do Blog</h2>
          <p className="text-xs text-[#888] mt-1">
            Gerencie, crie manualmente ou produza conteúdos estratégicos assistidos por IA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog/new?mode=ai"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-medium hover:bg-[#22c55e]/20 transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Gerar com IA
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-medium hover:bg-[#22c55e] transition shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Novo Artigo
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { key: "ALL", label: "Todos" },
            { key: "PUBLISHED", label: "Publicados" },
            { key: "DRAFT", label: "Rascunhos" },
            { key: "SCHEDULED", label: "Agendados" },
            { key: "ARCHIVED", label: "Arquivados" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                filterStatus === tab.key
                  ? "bg-white/10 text-white font-semibold"
                  : "text-[#777] hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#666]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full bg-[#111113] border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
          />
        </div>
      </div>

      {/* Posts Table / Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando artigos...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0f0f11] border border-white/5 text-center text-xs text-[#777]">
          Nenhum artigo encontrado com os filtros selecionados.
        </div>
      ) : (
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/10 text-[#777] font-mono uppercase text-[10px]">
              <tr>
                <th className="p-4">Título do Artigo</th>
                <th className="p-4">Status</th>
                <th className="p-4">Autor / Origem</th>
                <th className="p-4">Data</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4">
                    <div className="font-medium text-white max-w-md truncate">{post.title}</div>
                    <div className="text-[11px] text-[#666] font-mono mt-0.5 truncate">
                      /blog/{post.slug}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        post.status === "PUBLISHED"
                          ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20"
                          : post.status === "DRAFT"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#888]">
                    <div className="flex items-center gap-1.5">
                      {post.is_ai_generated ? (
                        <span className="inline-flex items-center gap-1 text-[#22c55e] text-[11px]">
                          <Sparkles className="w-3 h-3" /> IA + William
                        </span>
                      ) : (
                        <span>{post.author}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-[#666] font-mono text-[11px]">
                    {new Date(post.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === "PUBLISHED" && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          title="Visualizar Artigo"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-[#777] hover:text-white transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <button
                        onClick={() => handleDuplicate(post.id)}
                        title="Duplicar"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-[#777] hover:text-white transition cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        title="Editar"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-[#777] hover:text-white transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        title="Excluir"
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#777] hover:text-red-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

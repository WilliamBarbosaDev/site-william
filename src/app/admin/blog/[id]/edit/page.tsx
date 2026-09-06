"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  RefreshCw,
  Eye,
  Settings,
  Trash2,
  ExternalLink
} from "lucide-react";
import { BlogPost } from "@/lib/blog/blog-service";

export default function AdminEditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/blog/${id}`);
        const data = await res.json();
        if (data.post) {
          setPost(data.post);
        }
      } catch (e) {
        console.error("Erro ao carregar post:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erro ao atualizar post.");
      }

      alert("Artigo atualizado com sucesso!");
      router.push("/admin/blog");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#777]">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
        Carregando artigo...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-12 text-center text-xs text-red-400">
        Artigo não encontrado.
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-6 max-w-5xl mx-auto">
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
            <h2 className="text-xl font-semibold text-white tracking-tight">Editar Artigo</h2>
            <p className="text-xs text-[#888] mt-0.5">
              ID: <code className="font-mono text-[#22c55e]">{post.id}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {post.status === "PUBLISHED" && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Ver no Site
            </Link>
          )}

          <select
            value={post.status}
            onChange={(e) => setPost({ ...post, status: e.target.value as BlogPost["status"] })}
            className="bg-[#18181b] border border-white/10 text-xs rounded-xl px-3 py-2 text-white focus:outline-none"
          >
            <option value="DRAFT">RASCUNHO</option>
            <option value="PUBLISHED">PUBLICADO</option>
            <option value="SCHEDULED">AGENDADO</option>
            <option value="ARCHIVED">ARQUIVADO</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#22c55e] text-black text-xs font-semibold hover:bg-emerald-400 transition cursor-pointer disabled:opacity-50 shadow-md"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="bg-[#0f0f11] border border-white/10 rounded-[28px] p-6 space-y-4">
        <div>
          <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
            Título do Artigo
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-[#22c55e]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
              Slug Amigável (URL)
            </label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
              URL da Imagem de Capa
            </label>
            <input
              type="text"
              value={post.featured_image || ""}
              onChange={(e) => setPost({ ...post, featured_image: e.target.value })}
              className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
            Resumo do Artigo
          </label>
          <textarea
            rows={2}
            value={post.summary || ""}
            onChange={(e) => setPost({ ...post, summary: e.target.value })}
            className="w-full bg-[#161618] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#22c55e]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
            Conteúdo do Artigo (Markdown)
          </label>
          <textarea
            rows={18}
            value={post.content || ""}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="w-full bg-[#161618] border border-white/10 rounded-xl p-4 font-mono text-xs text-[#ddd] leading-relaxed focus:outline-none focus:border-[#22c55e]"
          />
        </div>
      </div>

      {/* SEO Settings */}
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
              value={post.seo_title || ""}
              onChange={(e) => setPost({ ...post, seo_title: e.target.value })}
              className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
              Palavras-Chave
            </label>
            <input
              type="text"
              value={post.seo_keywords || ""}
              onChange={(e) => setPost({ ...post, seo_keywords: e.target.value })}
              className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
              Meta Description (SEO)
            </label>
            <input
              type="text"
              value={post.seo_description || ""}
              onChange={(e) => setPost({ ...post, seo_description: e.target.value })}
              className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

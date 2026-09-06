"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Briefcase, Plus, Star, Trash2, Edit, Save, RefreshCw, ExternalLink } from "lucide-react";
import { ProjectRecord } from "@/lib/projects/projects-service";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<ProjectRecord> | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const isNew = !editingProject.id;
      const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${editingProject.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingProject(null);
        fetchProjects();
      }
    } catch (e) {
      alert("Erro ao salvar projeto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      alert("Erro ao excluir projeto");
    }
  };

  const handleToggleFeatured = async (project: ProjectRecord) => {
    try {
      await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: project.is_featured ? 0 : 1 }),
      });
      fetchProjects();
    } catch (e) {
      alert("Erro ao alterar destaque");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Projetos & Portfólio</h2>
          <p className="text-xs text-[#888] mt-1">
            Cadastre e edite os cases do site com capas reais de fotos, descrições e resultados.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProject({
              title: "",
              category: "Web & Conversão",
              services: "Landing Page • UX/UI Design",
              description: "",
              cover_image: "/assets/fotos_projetos/site_verjuris.png",
              is_featured: 0,
              status: "PUBLISHED",
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-medium hover:bg-[#22c55e] transition shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar Projeto
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando projetos...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-[#0f0f11] border border-white/10 rounded-[24px] overflow-hidden flex flex-col justify-between hover:border-white/20 transition"
            >
              <div>
                {/* Image Cover Preview */}
                <div className="relative aspect-[16/10] bg-black/40 border-b border-white/5 overflow-hidden">
                  <Image
                    src={project.cover_image}
                    alt={project.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/70 backdrop-blur-md text-white border border-white/10">
                      {project.category}
                    </span>
                    {project.is_featured === 1 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#22c55e] text-black font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" /> Destaque
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white tracking-tight">{project.title}</h3>
                    <span className="text-[10px] font-mono text-[#666]">#{project.display_order}</span>
                  </div>
                  <p className="text-[11px] text-[#22c55e] font-mono">{project.services}</p>
                  <p className="text-xs text-[#888] line-clamp-2">{project.description}</p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                <button
                  onClick={() => handleToggleFeatured(project)}
                  className={`text-xs flex items-center gap-1 font-mono cursor-pointer transition ${
                    project.is_featured ? "text-[#22c55e]" : "text-[#666] hover:text-white"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${project.is_featured ? "fill-[#22c55e]" : ""}`} />
                  {project.is_featured ? "Em Destaque" : "Destacar"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowModal(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-[#666] hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {showModal && editingProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-[28px] max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-white">
              {editingProject.id ? "Editar Projeto" : "Novo Projeto"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Título do Projeto *</label>
                <input
                  type="text"
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  required
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Categoria</label>
                  <input
                    type="text"
                    value={editingProject.category || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Serviços Prestados</label>
                  <input
                    type="text"
                    value={editingProject.services || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, services: e.target.value })}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Caminho da Imagem de Capa</label>
                <input
                  type="text"
                  value={editingProject.cover_image || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, cover_image: e.target.value })}
                  required
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
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
                  Salvar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowUpRight, Bell, Shield, Menu } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === "/admin") return "Dashboard Geral";
    if (path.startsWith("/admin/site")) return "CMS — Conteúdo e Seções do Site";
    if (path.startsWith("/admin/blog/new")) return "Blog — Criar Novo Artigo";
    if (path.startsWith("/admin/blog/ideas")) return "Blog — Banco de Ideias";
    if (path.startsWith("/admin/blog/automation")) return "Blog — Automação com IA";
    if (path.startsWith("/admin/blog")) return "Blog — Gerenciamento de Artigos";
    if (path.startsWith("/admin/projects")) return "Portfólio & Cases de Projetos";
    if (path.startsWith("/admin/services")) return "Serviços & Soluções";
    if (path.startsWith("/admin/ai/providers")) return "Inteligência Artificial — Provedores";
    if (path.startsWith("/admin/ai/models")) return "Inteligência Artificial — Modelos";
    if (path.startsWith("/admin/ai/router")) return "Inteligência Artificial — AI Router";
    if (path.startsWith("/admin/ai/prompts")) return "Inteligência Artificial — Prompts";
    if (path.startsWith("/admin/ai/logs")) return "Inteligência Artificial — Logs e Métricas";
    if (path.startsWith("/admin/diagnostics")) return "Diagnósticos Estratégicos com IA";
    if (path.startsWith("/admin/leads")) return "Pipeline de Leads Comerciais";
    if (path.startsWith("/admin/media")) return "Biblioteca de Mídia";
    if (path.startsWith("/admin/seo")) return "Configurações Globais de SEO";
    if (path.startsWith("/admin/settings")) return "Configurações Gerais do Site";
    return "Painel Administrativo";
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a0b]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
            aria-label="Abrir menu do painel"
          >
            <Menu className="w-4 h-4 text-[#22c55e]" />
          </button>
        )}
        <h1 className="text-sm sm:text-base font-medium text-white tracking-tight truncate max-w-[200px] sm:max-w-none">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/diagnostico"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 text-xs font-medium hover:bg-[#22c55e]/20 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Testar Agente de IA ↗
        </Link>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2 text-xs font-mono text-[#888] bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
          <Shield className="w-3 h-3 text-[#22c55e]" />
          <span>Sessão Segura</span>
        </div>
      </div>
    </header>
  );
}

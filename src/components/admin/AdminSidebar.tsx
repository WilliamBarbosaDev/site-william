"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  FileText,
  Briefcase,
  Layers,
  Cpu,
  Activity,
  Users,
  Image as ImageIcon,
  Search,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Bot
} from "lucide-react";

interface AdminSidebarProps {
  user: { name: string; email: string };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  };

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      label: "Site (CMS)",
      href: "/admin/site",
      icon: Globe,
    },
    {
      label: "Blog",
      href: "/admin/blog",
      icon: FileText,
      subItems: [
        { label: "Todos os Posts", href: "/admin/blog" },
        { label: "Novo Post", href: "/admin/blog/new" },
        { label: "Banco de Ideias", href: "/admin/blog/ideas" },
        { label: "Automação com IA", href: "/admin/blog/automation" },
      ],
    },
    { label: "Projetos", href: "/admin/projects", icon: Briefcase },
    { label: "Serviços", href: "/admin/services", icon: Layers },
    {
      label: "Inteligência Artificial",
      href: "/admin/ai/router",
      icon: Cpu,
      subItems: [
        { label: "Agentes Treinados", href: "/admin/ai/agents" },
        { label: "AI Router", href: "/admin/ai/router" },
        { label: "Provedores", href: "/admin/ai/providers" },
        { label: "Modelos", href: "/admin/ai/models" },
        { label: "Prompts", href: "/admin/ai/prompts" },
        { label: "Logs & Métricas", href: "/admin/ai/logs" },
      ],
    },
    { label: "Diagnósticos IA", href: "/admin/diagnostics", icon: Activity },
    { label: "Leads", href: "/admin/leads", icon: Users },
    { label: "Mídia", href: "/admin/media", icon: ImageIcon },
    { label: "SEO", href: "/admin/seo", icon: Search },
    { label: "Configurações", href: "/admin/settings/site", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0b] border-r border-white/10 flex flex-col justify-between h-screen sticky top-0 text-[#a3a3a3] select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#22c55e] to-emerald-400 flex items-center justify-center text-black font-bold text-sm shadow-md">
            WB
          </div>
          <div>
            <div className="text-white text-sm font-medium tracking-tight">William Barbosa</div>
            <div className="text-[11px] text-[#22c55e] font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              Painel Central
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <div key={item.label} className="space-y-1">
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white font-semibold shadow-sm"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#22c55e]" : "text-[#777]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.subItems && (
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? "rotate-90 text-[#22c55e]" : "text-[#555]"}`} />
                )}
              </Link>

              {/* Sub-items if active */}
              {item.subItems && isActive && (
                <div className="pl-7 pr-2 py-1 space-y-1 border-l border-white/10 ml-4">
                  {item.subItems.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                          isSubActive
                            ? "text-[#22c55e] font-medium bg-[#22c55e]/10"
                            : "text-[#888] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Profile & Quick Links */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-[#0d0d0e]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#bbb] hover:text-white transition"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#22c55e]" />
            Ver Site Público
          </span>
          <ExternalLink className="w-3 h-3 text-[#777]" />
        </Link>

        <div className="flex items-center justify-between pt-1">
          <div className="truncate pr-2">
            <div className="text-xs text-white truncate font-medium">{user.name}</div>
            <div className="text-[10px] text-[#666] truncate">{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Encerrar Sessão"
            className="p-2 rounded-lg hover:bg-red-500/10 text-[#777] hover:text-red-400 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import Link from "next/link";
import {
  Users,
  Activity,
  FileText,
  Briefcase,
  Layers,
  Cpu,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const db = await getDb();

  // Fetch summary counts
  const leadsCount = (db.prepare("SELECT COUNT(*) as c FROM leads").get() as { c: number }).c;
  const newLeadsCount = (db.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'NEW'").get() as { c: number }).c;
  const diagCount = (db.prepare("SELECT COUNT(*) as c FROM diagnostics").get() as { c: number }).c;
  const publishedPostsCount = (db.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'PUBLISHED'").get() as { c: number }).c;
  const draftPostsCount = (db.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'DRAFT'").get() as { c: number }).c;
  const projectsCount = (db.prepare("SELECT COUNT(*) as c FROM projects").get() as { c: number }).c;
  const servicesCount = (db.prepare("SELECT COUNT(*) as c FROM services WHERE is_active = 1").get() as { c: number }).c;
  const aiCallsCount = (db.prepare("SELECT COUNT(*) as c FROM ai_logs").get() as { c: number }).c;

  // Recent leads
  const recentLeads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 5").all() as Array<{
    id: string;
    name: string;
    company?: string;
    phone: string;
    status: string;
    created_at: string;
  }>;

  // Recent diagnostics
  const recentDiagnostics = db.prepare("SELECT * FROM diagnostics ORDER BY created_at DESC LIMIT 5").all() as Array<{
    id: string;
    client_name: string;
    company_name?: string;
    recommended_solution?: string;
    is_custom_need: number;
    created_at: string;
  }>;

  const statCards = [
    {
      title: "Total de Leads",
      value: leadsCount,
      sub: `${newLeadsCount} novos contatos`,
      icon: Users,
      color: "text-[#22c55e]",
      bg: "bg-[#22c55e]/10",
      href: "/admin/leads",
    },
    {
      title: "Diagnósticos IA",
      value: diagCount,
      sub: "Atendimentos automáticos",
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      href: "/admin/diagnostics",
    },
    {
      title: "Artigos no Blog",
      value: publishedPostsCount,
      sub: `${draftPostsCount} em rascunho`,
      icon: FileText,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      href: "/admin/blog",
    },
    {
      title: "Projetos no Portfólio",
      value: projectsCount,
      sub: "Cases e trabalhos ativos",
      icon: Briefcase,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      href: "/admin/projects",
    },
    {
      title: "Serviços no Catálogo",
      value: servicesCount,
      sub: "Soluções ativas no site",
      icon: Layers,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      href: "/admin/services",
    },
    {
      title: "Requisições de IA",
      value: aiCallsCount,
      sub: "AI Router ativo",
      icon: Cpu,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      href: "/admin/ai/logs",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-[28px] bg-gradient-to-r from-[#111113] via-[#141416] to-[#0f1712] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Painel Central Operacional
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">
            Olá, <span className="font-semibold text-white">{user.name}</span>
          </h2>
          <p className="text-sm text-[#888] mt-1">
            Seu ecossistema está operando normalmente com banco de dados autônomo e roteador de IA sincronizado.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-[#22c55e] transition shadow-md"
          >
            <FileText className="w-4 h-4" /> Novo Artigo
          </Link>
          <Link
            href="/admin/site"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/10"
          >
            Editar CMS do Site
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="p-5 rounded-2xl bg-[#0f0f11] border border-white/10 hover:border-white/20 transition group block"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#555] group-hover:text-white transition" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-white tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs font-medium text-[#ccc] mt-0.5">{card.title}</div>
                <div className="text-[11px] text-[#777] mt-1">{card.sub}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Columns: Recent Leads & Recent Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="p-6 rounded-[24px] bg-[#0f0f11] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-white">Últimos Leads Comerciais</h3>
              <p className="text-xs text-[#777]">Contatos recebidos através do site e IA</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs text-[#22c55e] hover:underline flex items-center gap-1 font-mono"
            >
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.length === 0 ? (
              <div className="text-xs text-[#666] py-6 text-center">Nenhum lead registrado ainda.</div>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition"
                >
                  <div>
                    <div className="text-xs font-medium text-white">{lead.name}</div>
                    <div className="text-[11px] text-[#888]">
                      {lead.company || "Empresa não informada"} • {lead.phone}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Diagnostics */}
        <div className="p-6 rounded-[24px] bg-[#0f0f11] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-white">Últimos Diagnósticos da IA</h3>
              <p className="text-xs text-[#777]">Consultorias realizadas em tempo real</p>
            </div>
            <Link
              href="/admin/diagnostics"
              className="text-xs text-[#22c55e] hover:underline flex items-center gap-1 font-mono"
            >
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentDiagnostics.length === 0 ? (
              <div className="text-xs text-[#666] py-6 text-center">Nenhum atendimento realizado ainda.</div>
            ) : (
              recentDiagnostics.map((diag) => (
                <div
                  key={diag.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition"
                >
                  <div className="truncate pr-3">
                    <div className="text-xs font-medium text-white">{diag.client_name}</div>
                    <div className="text-[11px] text-[#888] truncate">
                      Recomendado: {diag.recommended_solution || "Sistema Sob Medida"}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                    diag.is_custom_need ? "bg-amber-500/10 text-amber-400" : "bg-cyan-500/10 text-cyan-400"
                  }`}>
                    {diag.is_custom_need ? "Sob Medida" : "Catálogo"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Users, Phone, Mail, Building, RefreshCw, MessageSquare, Search, ArrowRight } from "lucide-react";
import { Lead } from "@/lib/leads/leads-service";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: Lead["status"]) => {
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch (e) {
      alert("Erro ao atualizar status do lead");
    }
  };

  const filtered = leads.filter((l) => {
    const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(search.toLowerCase())) ||
      l.phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const statuses: Array<{ key: Lead["status"]; label: string; color: string }> = [
    { key: "NEW", label: "Novo Lead", color: "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20" },
    { key: "CONTACTED", label: "Contatado", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { key: "QUALIFIED", label: "Qualificado", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { key: "PROPOSAL", label: "Proposta Enviada", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { key: "CLIENT", label: "Cliente Fechado", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { key: "LOST", label: "Perdido", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Pipeline de Leads Comerciais</h2>
          <p className="text-xs text-[#888] mt-1">
            Gerencie contatos qualificados e avance os estágios no funil comercial.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Atualizar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              statusFilter === "ALL" ? "bg-white/10 text-white font-semibold" : "text-[#777] hover:text-white"
            }`}
          >
            Todos ({leads.length})
          </button>
          {statuses.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                statusFilter === s.key ? "bg-white/10 text-white font-semibold" : "text-[#777] hover:text-white"
              }`}
            >
              {s.label} ({leads.filter((l) => l.status === s.key).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, empresa ou fone..."
            className="w-full bg-[#111113] border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e]"
          />
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando leads...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0f0f11] border border-white/5 text-center text-xs text-[#777]">
          Nenhum lead encontrado com os filtros selecionados.
        </div>
      ) : (
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/10 text-[#777] font-mono uppercase text-[10px]">
              <tr>
                <th className="p-4">Lead / Contato</th>
                <th className="p-4">Empresa</th>
                <th className="p-4">Origem</th>
                <th className="p-4">Fase do Funil</th>
                <th className="p-4">Data</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4">
                    <div className="font-semibold text-white">{lead.name}</div>
                    <div className="text-[11px] text-[#22c55e] font-mono mt-0.5">{lead.phone}</div>
                    {lead.email && <div className="text-[10px] text-[#666]">{lead.email}</div>}
                  </td>
                  <td className="p-4 text-[#aaa]">{lead.company || "—"}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-[#bbb]">
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead["status"])}
                      className="bg-[#18181b] border border-white/10 text-[11px] font-mono rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-[#22c55e]"
                    >
                      {statuses.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-[#666] font-mono text-[11px]">
                    {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-4 text-right">
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#22c55e]/10 text-[#22c55e] text-xs hover:bg-[#22c55e]/20 transition"
                    >
                      <Phone className="w-3 h-3" /> WhatsApp
                    </a>
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

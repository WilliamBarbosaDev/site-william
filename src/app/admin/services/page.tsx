"use client";

import { useEffect, useState } from "react";
import { Layers, Plus, Edit, Trash2, CheckCircle2, Sparkles, RefreshCw, DollarSign, Clock, Tag } from "lucide-react";
import { ServiceRecord } from "@/lib/services/services-service";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Partial<ServiceRecord> | null>(null);
  const [deliverablesText, setDeliverablesText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.services) setServices(data.services);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openModal = (service?: ServiceRecord) => {
    if (service) {
      setEditingService(service);
      let dList: string[] = [];
      try {
        if (service.deliverables_json) dList = JSON.parse(service.deliverables_json);
      } catch (e) {}
      setDeliverablesText(dList.join("\n"));
    } else {
      setEditingService({
        name: "",
        title: "",
        short_description: "",
        full_description: "",
        price_starting_at: "R$ 3.500,00",
        price_model: "PROJETO_UNICO",
        price_notes: "50% entrada + 50% na entrega ou até 12x no cartão",
        estimated_days: 15,
        icon: "Sparkles",
        is_active: 1,
        cta_text: "Solicitar Orçamento",
        cta_url: "/diagnostico",
      });
      setDeliverablesText("Diagnóstico estratégico\nPrototipação no Figma\nDesenvolvimento Next.js\nGarantia de 30 dias");
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSaving(true);
    try {
      const deliverables = deliverablesText
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean);

      const payload = {
        ...editingService,
        deliverables_json: JSON.stringify(deliverables),
      };

      const isNew = !editingService.id;
      const url = isNew ? "/api/admin/services" : `/api/admin/services/${editingService.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingService(null);
        fetchServices();
      } else {
        alert("Erro ao salvar serviço.");
      }
    } catch (e) {
      alert("Erro ao salvar serviço");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      alert("Erro ao excluir serviço");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white tracking-tight">Catálogo de Serviços & Precificação</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
              Valores & Prazos Ativos
            </span>
          </div>
          <p className="text-xs text-[#888] mt-1">
            Defina valores oficiais, modelos de contratação, entregáveis e prazos. Essas informações alimentam automaticamente o Agente Comercial e o SDR de IA.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-[#22c55e] transition shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar Serviço
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando catálogo de serviços...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            let deliverables: string[] = [];
            try {
              if (service.deliverables_json) deliverables = JSON.parse(service.deliverables_json);
            } catch (e) {}

            return (
              <div
                key={service.id}
                className="p-6 rounded-[24px] bg-[#0f0f11] border border-white/10 flex flex-col justify-between hover:border-white/20 transition space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-[#22c55e] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> {service.slug}
                    </span>
                    <span className="text-[10px] font-mono text-[#666]">Ordem #{service.display_order}</span>
                  </div>

                  <h3 className="text-base font-semibold text-white tracking-tight">{service.name}</h3>
                  <p className="text-xs text-[#888] mt-1 line-clamp-2">{service.short_description}</p>

                  {/* Pricing Box */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-mono text-[#777] uppercase">Valor Referência:</span>
                      <span className="text-sm font-semibold text-[#22c55e] font-mono">
                        {service.price_starting_at || "Sob Consulta"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#666]">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#888]" />
                        {service.price_model === "PROJETO_UNICO"
                          ? "Projeto Único"
                          : service.price_model === "MENSAL_RECORRENTE"
                          ? "Mensalidade"
                          : service.price_model === "SOB_CONSULTA"
                          ? "Sob Demanda"
                          : "Hora Técnica"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#888]" />
                        ~{service.estimated_days || 15} dias úteis
                      </span>
                    </div>

                    {service.price_notes && (
                      <p className="text-[10px] text-[#777] border-t border-white/5 pt-1.5 line-clamp-1 italic">
                        {service.price_notes}
                      </p>
                    )}
                  </div>

                  {/* Deliverables snippet */}
                  {deliverables.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="text-[10px] font-mono uppercase text-[#666]">Entregáveis inclusos:</div>
                      <div className="flex flex-wrap gap-1">
                        {deliverables.slice(0, 3).map((d, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-[#aaa]">
                            {d}
                          </span>
                        ))}
                        {deliverables.length > 3 && (
                          <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-[#666]">
                            +{deliverables.length - 3} itens
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono ${
                      service.is_active ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-white/5 text-[#666]"
                    }`}
                  >
                    {service.is_active ? "ATIVO NO SITE & IA" : "PAUSADO"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(service)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition cursor-pointer"
                      title="Editar serviço e valores"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 rounded-xl hover:bg-red-500/10 text-[#666] hover:text-red-400 transition cursor-pointer"
                      title="Excluir serviço"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Edit Service */}
      {showModal && editingService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-[28px] max-w-xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {editingService.id ? "Editar Serviço & Precificação" : "Novo Serviço"}
                </h3>
                <p className="text-[11px] text-[#888] mt-0.5">
                  Estes valores são utilizados pelo Agente Comercial e pelo SDR de IA para informar os clientes.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Nome do Serviço *</label>
                <input
                  type="text"
                  value={editingService.name || ""}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  required
                  placeholder="Ex: Landing Page Estratégica de Alta Conversão"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Valor de Referência</label>
                  <input
                    type="text"
                    value={editingService.price_starting_at || ""}
                    onChange={(e) => setEditingService({ ...editingService, price_starting_at: e.target.value })}
                    placeholder="Ex: R$ 2.800,00"
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Modelo de Cobrança</label>
                  <select
                    value={editingService.price_model || "PROJETO_UNICO"}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price_model: e.target.value as ServiceRecord["price_model"],
                      })
                    }
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="PROJETO_UNICO">Projeto Único</option>
                    <option value="MENSAL_RECORRENTE">Mensal Recorrente</option>
                    <option value="SOB_CONSULTA">Sob Consulta</option>
                    <option value="HORA_CONSULTORIA">Hora de Consultoria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Prazo Médio (Dias úteis)</label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={editingService.estimated_days ?? 15}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        estimated_days: parseInt(e.target.value, 10) || 15,
                      })
                    }
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Condições de Pagamento / Observações</label>
                <input
                  type="text"
                  value={editingService.price_notes || ""}
                  onChange={(e) => setEditingService({ ...editingService, price_notes: e.target.value })}
                  placeholder="Ex: 50% entrada + 50% na entrega ou até 12x no cartão de crédito"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">
                  Entregáveis Inclusos no Pacote (um item por linha)
                </label>
                <textarea
                  rows={4}
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  placeholder={"Diagnóstico estratégico\nPrototipação no Figma\nDesenvolvimento Next.js\nGarantia de 30 dias"}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Descrição Curta / Tagline</label>
                <input
                  type="text"
                  value={editingService.short_description || ""}
                  onChange={(e) => setEditingService({ ...editingService, short_description: e.target.value })}
                  required
                  placeholder="Ex: Estrutura focada em transformar visitantes e anúncios em clientes pagantes."
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Descrição Completa</label>
                <textarea
                  rows={3}
                  value={editingService.full_description || ""}
                  onChange={(e) => setEditingService({ ...editingService, full_description: e.target.value })}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#22c55e]"
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
                  {saving ? "Salvando..." : "Salvar Serviço & Valores"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

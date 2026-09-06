"use client";

import { useEffect, useState } from "react";
import { Clock, Plus, Sparkles, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  is_active: number;
  frequency: string;
  day_of_week?: string;
  time_of_day?: string;
  themes_json?: string;
  keywords_json?: string;
  auto_publish: number;
  last_run_at?: string;
  next_run_at?: string;
}

export default function AdminBlogAutomationPage() {
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New rule form
  const [name, setName] = useState("Artigo Semanal Estratégico");
  const [frequency, setFrequency] = useState("WEEKLY");
  const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
  const [timeOfDay, setTimeOfDay] = useState("09:00");
  const [themes, setThemes] = useState("Inteligência Artificial, Automação Empresarial, Landing Pages");
  const [autoPublish, setAutoPublish] = useState(false);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blog/automation");
      const data = await res.json();
      if (data.automations) setAutomations(data.automations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, []);

  const handleToggle = async (rule: AutomationRule) => {
    try {
      await fetch("/api/admin/blog/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rule.id, is_active: rule.is_active ? 0 : 1 }),
      });
      fetchAutomations();
    } catch (e) {
      alert("Erro ao alterar status da regra");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/blog/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          frequency,
          day_of_week: dayOfWeek,
          time_of_day: timeOfDay,
          themes_json: JSON.stringify(themes.split(",").map((s) => s.trim())),
          auto_publish: autoPublish ? 1 : 0,
          is_active: 1,
        }),
      });
      setShowModal(false);
      fetchAutomations();
    } catch (e) {
      alert("Erro ao criar automação");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Automação de Conteúdo com IA</h2>
          <p className="text-xs text-[#888] mt-1">
            Configure agendamentos automáticos para o AI Router produzir rascunhos periodicamente.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-medium hover:bg-[#22c55e] transition shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Nova Regra de Automação
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Segurança de Publicação Ativa</span>
          Por padrão, todos os conteúdos gerados por automação nascem com o status <b>RASCUNHO (DRAFT)</b>. A publicação direta só ocorre se você habilitar explicitamente a opção nas configurações da regra.
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando automações...
        </div>
      ) : automations.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0f0f11] border border-white/5 text-center text-xs text-[#777]">
          Nenhuma automação configurada. Clique em "Nova Regra de Automação" para começar.
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map((rule) => (
            <div
              key={rule.id}
              className="p-5 rounded-2xl bg-[#0f0f11] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-white">{rule.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      rule.is_active ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-white/5 text-[#666]"
                    }`}
                  >
                    {rule.is_active ? "ATIVA" : "PAUSADA"}
                  </span>
                </div>
                <div className="text-xs text-[#888] flex items-center gap-3">
                  <span>Frequência: {rule.frequency}</span>
                  <span>•</span>
                  <span>{rule.day_of_week} às {rule.time_of_day}</span>
                  <span>•</span>
                  <span>
                    Status gerado:{" "}
                    <b className={rule.auto_publish ? "text-amber-400" : "text-[#22c55e]"}>
                      {rule.auto_publish ? "PUBLICADO AUTOMATICAMENTE" : "RASCUNHO (DRAFT)"}
                    </b>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(rule)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    rule.is_active
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20"
                  }`}
                >
                  {rule.is_active ? "Pausar" : "Ativar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Automation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-[28px] max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">Criar Regra de Automação de Conteúdo</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Nome da Regra</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Frequência</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="WEEKLY">Semanal</option>
                    <option value="DAILY">Diário</option>
                    <option value="BIWEEKLY">Quinzenal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Dia da Semana</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="MONDAY">Segunda-feira</option>
                    <option value="TUESDAY">Terça-feira</option>
                    <option value="WEDNESDAY">Quarta-feira</option>
                    <option value="THURSDAY">Quinta-feira</option>
                    <option value="FRIDAY">Sexta-feira</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Horário (HH:MM)</label>
                <input
                  type="text"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">Temas Prioritários (Separados por vírgula)</label>
                <input
                  type="text"
                  value={themes}
                  onChange={(e) => setThemes(e.target.value)}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoPub"
                  checked={autoPublish}
                  onChange={(e) => setAutoPublish(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#22c55e] focus:ring-0"
                />
                <label htmlFor="autoPub" className="text-xs text-white cursor-pointer select-none">
                  Publicar direto no site (Desmarcado = Gera como Rascunho seguro)
                </label>
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
                  Criar Regra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

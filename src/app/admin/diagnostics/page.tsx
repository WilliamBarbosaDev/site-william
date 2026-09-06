"use client";

import { useEffect, useState } from "react";
import { Activity, Search, RefreshCw, Eye, MessageSquare, Phone, Building, Sparkles } from "lucide-react";
import { DiagnosticRecord } from "@/lib/leads/leads-service";

export default function AdminDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiag, setSelectedDiag] = useState<DiagnosticRecord | null>(null);

  const fetchDiagnostics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/diagnostics");
      const data = await res.json();
      if (data.diagnostics) setDiagnostics(data.diagnostics);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Diagnósticos Estratégicos com IA</h2>
          <p className="text-xs text-[#888] mt-1">
            Consultorias realizadas pelo Agente de IA em tempo real com mapeamento de gargalos e soluções recomendadas.
          </p>
        </div>

        <button
          onClick={fetchDiagnostics}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Atualizar
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando atendimentos de diagnóstico...
        </div>
      ) : diagnostics.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0f0f11] border border-white/5 text-center text-xs text-[#777]">
          Nenhum diagnóstico registrado ainda. Os atendimentos realizados na rota pública /diagnostico aparecerão aqui.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diagnostics.map((diag) => (
            <div
              key={diag.id}
              className="p-5 rounded-[24px] bg-[#0f0f11] border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold ${
                    diag.is_custom_need ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20"
                  }`}>
                    {diag.is_custom_need ? "Demanda Sob Medida" : "Grade de Serviços"}
                  </span>
                  <span className="text-[10px] text-[#666] font-mono">
                    Score: {diag.maturity_score}%
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">{diag.client_name}</h3>
                  <div className="text-xs text-[#888] flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-[#666]" />
                    <span>{diag.company_name || "Empresa não informada"}</span>
                  </div>
                  <div className="text-xs text-[#888] flex items-center gap-1.5 mt-1">
                    <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span className="font-mono text-[#aaa]">{diag.phone}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1">
                  <div className="text-[10px] uppercase font-mono text-[#666]">Solução Recomendada</div>
                  <div className="font-semibold text-white">{diag.recommended_solution || "Consultoria Personalizada"}</div>
                </div>

                {diag.challenge && (
                  <p className="text-xs text-[#777] line-clamp-2">
                    <b>Desafio:</b> {diag.challenge}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-[#555] font-mono">
                  {new Date(diag.created_at).toLocaleDateString("pt-BR")}
                </span>

                <button
                  onClick={() => setSelectedDiag(diag)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Ver Dossiê
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Diagnostic Modal */}
      {selectedDiag && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-[28px] max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Dossiê de Diagnóstico do Lead</h3>
                <p className="text-xs text-[#888] mt-0.5">
                  Atendimento gerado pelo Agente de IA com recomendações estruturadas
                </p>
              </div>
              <button
                onClick={() => setSelectedDiag(null)}
                className="px-3 py-1.5 rounded-xl bg-white/5 text-xs text-[#888] hover:text-white"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#666] block text-[10px] uppercase font-mono">Cliente</span>
                <b className="text-white text-sm block mt-0.5">{selectedDiag.client_name}</b>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#666] block text-[10px] uppercase font-mono">Empresa</span>
                <b className="text-white text-sm block mt-0.5">{selectedDiag.company_name || "Não informado"}</b>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#666] block text-[10px] uppercase font-mono">WhatsApp</span>
                <b className="text-[#22c55e] font-mono text-sm block mt-0.5">{selectedDiag.phone}</b>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#666] block text-[10px] uppercase font-mono">E-mail</span>
                <b className="text-white text-sm block mt-0.5">{selectedDiag.email || "Não informado"}</b>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {selectedDiag.segment && (
                <div>
                  <span className="text-[#777] font-mono text-[10px] uppercase block">Segmento da Empresa</span>
                  <div className="text-white bg-white/[0.02] p-3 rounded-xl border border-white/5 mt-1">
                    {selectedDiag.segment}
                  </div>
                </div>
              )}

              {selectedDiag.challenge && (
                <div>
                  <span className="text-[#777] font-mono text-[10px] uppercase block">Principal Gargalo / Desafio</span>
                  <div className="text-white bg-white/[0.02] p-3 rounded-xl border border-white/5 mt-1">
                    {selectedDiag.challenge}
                  </div>
                </div>
              )}

              {selectedDiag.goal && (
                <div>
                  <span className="text-[#777] font-mono text-[10px] uppercase block">Objetivo Principal Desejado</span>
                  <div className="text-white bg-white/[0.02] p-3 rounded-xl border border-white/5 mt-1">
                    {selectedDiag.goal}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#22c55e]/5 border border-[#22c55e]/20 space-y-1.5">
                <span className="text-[#22c55e] font-mono text-[10px] uppercase tracking-wider block font-semibold">
                  Solução Recomendada pela IA
                </span>
                <div className="text-white font-semibold text-base">
                  {selectedDiag.recommended_solution}
                </div>
                {selectedDiag.summary && (
                  <p className="text-[#bbb] text-xs leading-relaxed mt-2 pt-2 border-t border-white/5">
                    {selectedDiag.summary}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={`https://wa.me/${selectedDiag.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22c55e] text-black text-xs font-semibold hover:bg-emerald-400 transition"
              >
                <Phone className="w-3.5 h-3.5" /> Chamar Lead no WhatsApp
              </a>

              <span className="text-[11px] font-mono text-[#666]">
                Modelo utilizado: {selectedDiag.model_used || "gemini-2.5-flash"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

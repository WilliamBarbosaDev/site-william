"use client";

import { useEffect, useState } from "react";
import { Cpu, RefreshCw, AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react";

interface AILog {
  id: string;
  task_name: string;
  provider_used: string;
  model_used: string;
  tokens_prompt: number;
  tokens_completion: number;
  duration_ms: number;
  status: "SUCCESS" | "FALLBACK" | "ERROR";
  error_message?: string;
  created_at: string;
}

interface LogStats {
  total_calls: number;
  total_tokens: number;
  avg_duration: number;
  fallback_count: number;
  error_count: number;
}

export default function AdminAILogsPage() {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ai/logs");
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
      if (data.stats) setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Logs & Telemetria do AI Router</h2>
          <p className="text-xs text-[#888] mt-1">
            Auditoria de execuções de Inteligência Artificial, latência, consumo de tokens e fallbacks acionados.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Atualizar
        </button>
      </div>

      {/* Aggregate Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0f0f11] border border-white/10">
            <div className="text-[11px] text-[#777] font-mono uppercase">Total de Requisições</div>
            <div className="text-xl font-semibold text-white mt-1">{stats.total_calls}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0f0f11] border border-white/10">
            <div className="text-[11px] text-[#777] font-mono uppercase">Tokens Processados</div>
            <div className="text-xl font-semibold text-[#22c55e] mt-1">
              {(stats.total_tokens || 0).toLocaleString("pt-BR")}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0f0f11] border border-white/10">
            <div className="text-[11px] text-[#777] font-mono uppercase">Latência Média</div>
            <div className="text-xl font-semibold text-cyan-400 mt-1">
              {Math.round(stats.avg_duration || 0)} ms
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0f0f11] border border-white/10">
            <div className="text-[11px] text-[#777] font-mono uppercase">Fallbacks / Erros</div>
            <div className="text-xl font-semibold text-amber-400 mt-1">
              {stats.fallback_count} / {stats.error_count}
            </div>
          </div>
        </div>
      )}

      {/* Logs Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando registros...
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0f0f11] border border-white/5 text-center text-xs text-[#777]">
          Nenhum log registrado ainda. As chamadas do AI Router aparecerão automaticamente aqui.
        </div>
      ) : (
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/10 text-[#777] font-mono uppercase text-[10px]">
              <tr>
                <th className="p-4">Tarefa</th>
                <th className="p-4">Provedor / Modelo</th>
                <th className="p-4">Tokens (Prompt + Resposta)</th>
                <th className="p-4">Duração</th>
                <th className="p-4">Status</th>
                <th className="p-4">Horário</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4 font-semibold text-white">{log.task_name}</td>
                  <td className="p-4 text-[#aaa]">
                    {log.provider_used} <span className="text-[#666]">({log.model_used})</span>
                  </td>
                  <td className="p-4 text-[#888]">
                    {log.tokens_prompt} + {log.tokens_completion} ={" "}
                    <b className="text-white">{log.tokens_prompt + log.tokens_completion}</b>
                  </td>
                  <td className="p-4 text-[#aaa]">{log.duration_ms} ms</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        log.status === "SUCCESS"
                          ? "bg-[#22c55e]/10 text-[#22c55e]"
                          : log.status === "FALLBACK"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#666]">
                    {new Date(log.created_at).toLocaleTimeString("pt-BR")}
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

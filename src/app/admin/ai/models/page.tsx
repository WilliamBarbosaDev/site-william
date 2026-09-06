"use client";

import { useEffect, useState } from "react";
import { Cpu, Plus, Edit, RefreshCw } from "lucide-react";

interface AIModel {
  id: string;
  provider_id: string;
  provider_name: string;
  provider_type: string;
  name: string;
  model_id: string;
  category: string;
  is_active: number;
  priority: number;
  max_tokens: number;
  notes?: string;
}

export default function AdminAIModelsPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ai/models");
      const data = await res.json();
      if (data.models) setModels(data.models);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Modelos de Inteligência Artificial</h2>
          <p className="text-xs text-[#888] mt-1">
            Modelos ativos registrados no ecossistema sem fixação de nomes no código (zero hardcoded).
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando modelos...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-[#0f0f11] border border-white/10 space-y-3 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-[#bbb]">
                  {m.provider_name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#22c55e]/10 text-[#22c55e]">
                  {m.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">{m.name}</h3>
                <div className="text-xs font-mono text-[#22c55e] mt-0.5">{m.model_id}</div>
              </div>

              {m.notes && <p className="text-xs text-[#888]">{m.notes}</p>}

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#666] font-mono">
                <span>Max Tokens: {m.max_tokens}</span>
                <span>Prioridade #{m.priority}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

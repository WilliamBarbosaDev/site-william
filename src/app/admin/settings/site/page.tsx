"use client";

import { useEffect, useState } from "react";
import { Settings, Save, CheckCircle2, RefreshCw, Phone, Mail, Globe, MapPin } from "lucide-react";

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: "",
    company_name: "",
    phone: "",
    whatsapp: "",
    email: "",
    location: "",
    service_area: "",
    instagram: "",
    linkedin: "",
    behance: "",
    footer_bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/settings/site");
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      alert("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Configurações Gerais do Site</h2>
          <p className="text-xs text-[#888] mt-1">
            Informações institucionais, contatos de WhatsApp, redes sociais e textos do rodapé.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4" /> Configurações salvas com sucesso!
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando dados institucionais...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-[28px] bg-[#0f0f11] border border-white/10 space-y-4">
            <h3 className="text-sm font-medium text-white">Dados da Empresa & Marca</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Nome da Empresa / Profissional
                </label>
                <input
                  type="text"
                  value={settings.company_name || ""}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Título Global da Marca
                </label>
                <input
                  type="text"
                  value={settings.site_name || ""}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[28px] bg-[#0f0f11] border border-white/10 space-y-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#22c55e]" /> Contatos & Canais Oficiais
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Número de WhatsApp Oficial
                </label>
                <input
                  type="text"
                  value={settings.whatsapp || ""}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value, phone: e.target.value })}
                  placeholder="5592982824592"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#22c55e]"
                />
                <span className="text-[10px] text-[#666] mt-1 block">Número oficial: 5592982824592</span>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  E-mail de Contato
                </label>
                <input
                  type="email"
                  value={settings.email || ""}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Localização / Base
                </label>
                <input
                  type="text"
                  value={settings.location || ""}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Área de Atendimento
                </label>
                <input
                  type="text"
                  value={settings.service_area || ""}
                  onChange={(e) => setSettings({ ...settings, service_area: e.target.value })}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[28px] bg-[#0f0f11] border border-white/10 space-y-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#22c55e]" /> Redes Sociais & Rodapé
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">Instagram</label>
                <input
                  type="text"
                  value={settings.instagram || ""}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">LinkedIn</label>
                <input
                  type="text"
                  value={settings.linkedin || ""}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">Behance</label>
                <input
                  type="text"
                  value={settings.behance || ""}
                  onChange={(e) => setSettings({ ...settings, behance: e.target.value })}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-mono text-[#aaa] uppercase mb-1.5">
                  Texto Biográfico do Rodapé
                </label>
                <textarea
                  rows={3}
                  value={settings.footer_bio || ""}
                  onChange={(e) => setSettings({ ...settings, footer_bio: e.target.value })}
                  className="w-full bg-[#161618] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#22c55e] transition cursor-pointer disabled:opacity-50 shadow-md"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Salvar Configurações
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

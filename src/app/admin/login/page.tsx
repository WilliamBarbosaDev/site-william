"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@williambdesigner.com.br");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erro ao efetuar login.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#ededed] flex items-center justify-center p-6 selection:bg-[#22c55e] selection:text-black">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-[#22c55e]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#22c55e] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Acesso Restrito
          </div>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
            Painel Central <span className="font-serif italic font-normal text-[#22c55e]">William Barbosa</span>
          </h1>
          <p className="text-sm text-[#888] mt-2">
            Controle de CMS, Blog, Leads, Diagnósticos e AI Router
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#0f0f10] border border-white/10 rounded-[28px] p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#aaa] mb-2">
                E-mail Administrativo
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@williambdesigner.com.br"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#aaa] mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#22c55e] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-medium text-sm hover:bg-[#22c55e] transition-all duration-300 disabled:opacity-50 shadow-lg cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  Entrar no Painel <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-[#666] flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
            Sistema operacional protegido com criptografia de ponta a ponta
          </div>
        </div>
      </div>
    </div>
  );
}

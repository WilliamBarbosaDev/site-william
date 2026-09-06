"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload, Trash2, Copy, CheckCircle2, RefreshCw } from "lucide-react";
import { MediaRecord } from "@/lib/media/storage";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.media) setMediaList(data.media);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erro no upload");
      }

      fetchMedia();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este arquivo de mídia permanentemente?")) return;
    try {
      await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      alert("Erro ao excluir arquivo");
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Biblioteca de Mídia</h2>
          <p className="text-xs text-[#888] mt-1">
            Faça upload de imagens e copie as URLs para utilizar em páginas, blog ou portfólio.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-medium hover:bg-[#22c55e] transition shadow-md cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? "Enviando arquivo..." : "Fazer Upload de Imagem"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#777]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#22c55e]" />
          Carregando mídia...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-16 rounded-[28px] bg-[#0f0f11] border border-white/5 text-center space-y-3">
          <ImageIcon className="w-8 h-8 text-[#555] mx-auto" />
          <div className="text-sm font-medium text-white">Nenhum arquivo enviado ainda</div>
          <p className="text-xs text-[#666] max-w-sm mx-auto">
            Faça upload de imagens em formato JPG, PNG, WEBP ou SVG (máximo 10MB por arquivo).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="group bg-[#0f0f11] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition"
            >
              <div className="relative aspect-square bg-black/40">
                <Image
                  src={item.url}
                  alt={item.original_name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  unoptimized
                />
              </div>

              <div className="p-3 space-y-2">
                <div className="text-[11px] font-medium text-white truncate" title={item.original_name}>
                  {item.original_name}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#666] font-mono">
                  <span>{(item.file_size / 1024).toFixed(0)} KB</span>
                  <span>{item.mime_type.split("/")[1]?.toUpperCase()}</span>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => copyUrl(item.url, item.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#22c55e] hover:underline cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copiar URL
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-[#666] hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

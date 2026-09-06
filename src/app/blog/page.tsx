import { getPublishedPosts } from "@/lib/blog/blog-service";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionEyebrow from "@/components/SectionEyebrow";
import { ArrowRight, Clock, Sparkles, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Artigos Estratégicos | William Barbosa",
  description: "Artigos práticos sobre Inteligência Artificial aplicada a negócios, arquitetura web de alta conversão e estratégias de automação.",
};

export default async function PublicBlogPage() {
  const posts = await getPublishedPosts(30);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans antialiased selection:bg-[#22c55e] selection:text-black">
      <Header />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Blog Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <SectionEyebrow number="01" label="CONHECIMENTO & ESTRATÉGIA" />
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
            Ideias, Engenharia de IA &{" "}
            <span className="font-serif italic font-normal text-[#22c55e]">Estratégia Digital</span>
          </h1>
          <p className="text-sm sm:text-base text-[#888] max-w-2xl mx-auto leading-relaxed">
            Publicações aprofundadas sobre como transformar gargalos empresariais em operações inteligentes com design refinado e tecnologia de ponta.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="p-16 rounded-[32px] bg-[#121212] border border-white/5 text-center space-y-4 max-w-xl mx-auto">
            <Sparkles className="w-8 h-8 text-[#22c55e] mx-auto animate-pulse" />
            <h2 className="text-lg font-medium text-white">Novos artigos sendo produzidos</h2>
            <p className="text-xs text-[#888]">
              Em breve publicaremos novidades sobre agentes de IA e posicionamento de marcas.
            </p>
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-medium text-xs hover:bg-[#22c55e] transition"
            >
              Fazer Diagnóstico com IA <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col justify-between bg-[#111113] border border-white/5 hover:border-white/15 rounded-[28px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div>
                  {/* Cover Image */}
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] bg-black/40 overflow-hidden">
                    <Image
                      src={post.featured_image || "/assets/fotos_projetos/site_verjuris.png"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#22c55e] border border-white/10">
                        {post.category_name || "Estratégia & IA"}
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-[#666] font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#22c55e]" />
                        {post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : "Recente"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.max(3, Math.ceil(post.content.length / 800))} min de leitura
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight group-hover:text-[#22c55e] transition line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-xs text-[#888] line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-[#22c55e] transition"
                  >
                    Ler Artigo Completo <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

import { getPostBySlug } from "@/lib/blog/blog-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Clock, Calendar, Sparkles, Share2, Phone, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado" };

  return {
    title: post.seo_title || `${post.title} | William Barbosa`,
    description: post.seo_description || post.summary,
    keywords: post.seo_keywords ? post.seo_keywords.split(",").map((s) => s.trim()) : undefined,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.summary,
      images: post.og_image ? [{ url: post.og_image }] : undefined,
    },
  };
}

// Lightweight secure markdown renderer
function renderMarkdownContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-4 space-y-2 pl-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-[#ccc] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("- ") || line.startsWith("* ")) {
      inList = true;
      listItems.push(line.substring(2));
      continue;
    } else {
      flushList();
    }

    if (!line) {
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-2xl sm:text-3xl font-light text-white tracking-tight mt-8 mb-4">
          {line.substring(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl sm:text-2xl font-semibold text-white tracking-tight mt-8 mb-3">
          {line.substring(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-medium text-white tracking-tight mt-6 mb-2">
          {line.substring(4)}
        </h3>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={i}
          className="my-6 p-4 rounded-2xl bg-[#22c55e]/5 border-l-2 border-[#22c55e] text-sm text-[#ddd] italic leading-relaxed"
        >
          {line.substring(2)}
        </blockquote>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="my-8 border-white/10" />);
    } else {
      elements.push(
        <p key={i} className="my-4 text-sm sm:text-base text-[#bbb] leading-relaxed font-light">
          {line}
        </p>
      );
    }
  }

  flushList();
  return elements;
}

export default async function PublicBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readingTime = Math.max(3, Math.ceil(post.content.length / 800));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans antialiased selection:bg-[#22c55e] selection:text-black">
      <Header />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#888] hover:text-[#22c55e] transition mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para todos os artigos
        </Link>

        {/* Article Header */}
        <header className="space-y-6 mb-12">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#777]">
            <span className="px-3 py-1 rounded-full bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 uppercase">
              {post.category_name || "Estratégia & IA"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : "Recente"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {readingTime} min de leitura
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-base sm:text-lg text-[#aaa] font-light leading-relaxed">
              {post.summary}
            </p>
          )}

          {/* Author Badge */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#22c55e] to-emerald-400 flex items-center justify-center text-black font-bold text-sm">
              WB
            </div>
            <div>
              <div className="text-sm font-medium text-white">{post.author}</div>
              <div className="text-xs text-[#777]">Estrategista Digital & Especialista em IA</div>
            </div>
          </div>
        </header>

        {/* Featured Cover Image if exists */}
        {post.featured_image && (
          <div className="relative aspect-[16/9] w-full rounded-[32px] overflow-hidden mb-12 border border-white/10 bg-black/40">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Article Body */}
        <article className="prose prose-invert max-w-none text-[#ededed]">
          {renderMarkdownContent(post.content)}
        </article>

        {/* Strategic CTA Box */}
        <div className="mt-16 p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-[#111113] via-[#161618] to-[#0d1611] border border-white/10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Diagnóstico de IA William Barbosa
          </div>

          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Quer entender como aplicar essas inovações na realidade do seu negócio?
          </h2>

          <p className="text-sm text-[#888] max-w-2xl leading-relaxed">
            Faça um diagnóstico consultivo gratuito com nosso Agente de IA em 2 minutos ou converse diretamente com William Barbosa pelo WhatsApp.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-[#22c55e] transition shadow-lg"
            >
              Iniciar Diagnóstico com IA <Sparkles className="w-3.5 h-3.5 text-black" />
            </Link>

            <a
              href={`https://wa.me/5592982824592?text=${encodeURIComponent(`Olá William! Li o artigo "${post.title}" no seu blog e gostaria de conversar sobre meu negócio.`)}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] font-semibold text-xs hover:bg-[#22c55e]/20 transition"
            >
              <Phone className="w-3.5 h-3.5" /> Conversar no WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, CONFIG, Project } from "@/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import { ArrowLeft, ArrowUpRight, MessageCircle, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CategoryFilter = "all" | "sites" | "landing" | "systems" | "portals";

interface FilterTab {
  id: CategoryFilter;
  label: string;
}

const FILTER_TABS: FilterTab[] = [
  { id: "all", label: "Todos" },
  { id: "sites", label: "Sites Institucionais" },
  { id: "landing", label: "Landing Pages & Vendas" },
  { id: "systems", label: "Sistemas & IA" },
  { id: "portals", label: "Portais & Plataformas" },
];

export default function ProjetosPage() {
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      // Category matching
      let matchesCategory = true;
      const cat = project.category.toLowerCase();
      const services = project.services.toLowerCase();

      if (activeTab === "sites") {
        matchesCategory = cat.includes("site") || cat.includes("corporativo");
      } else if (activeTab === "landing") {
        matchesCategory = cat.includes("landing") || cat.includes("vendas") || cat.includes("evento") || cat.includes("saúde") || cat.includes("arquitetura");
      } else if (activeTab === "systems") {
        matchesCategory = cat.includes("ia") || cat.includes("automação") || cat.includes("sistema") || cat.includes("financeira") || services.includes("ia") || services.includes("automação");
      } else if (activeTab === "portals") {
        matchesCategory = cat.includes("portal") || cat.includes("e-commerce") || cat.includes("plataforma");
      }

      // Search matching
      let matchesSearch = true;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        matchesSearch =
          project.title.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          project.services.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query);
      }

      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-bg-light text-text-dark flex flex-col selection:bg-accent selection:text-black">
      <ScrollProgress />
      <Header />

      <main className="flex-grow pt-8 pb-24 md:pb-32">
        {/* Top Header & Breadcrumb */}
        <section className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10 mb-12 lg:mb-16">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-light hover:text-text-dark transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Voltar para o início</span>
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200/80 mb-5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-700">
                Portfólio Completo & Cases
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-text-dark leading-[1.12] mb-5">
              Projetos desenvolvidos com foco em{" "}
              <AnimatedHighlight variant="box">
                posicionamento
              </AnimatedHighlight>{" "}
              e resultado.
            </h1>

            <p className="text-[15px] md:text-[17px] text-muted-light leading-relaxed max-w-2xl">
              Navegue pela seleção completa de sites institucionais, landing pages de alta conversão, portais e sistemas inteligentes construídos sob medida.
            </p>
          </div>
        </section>

        {/* Filters & Search Toolbar */}
        <section className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10 mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-6 border-b border-zinc-200/80">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "bg-[#09090b] text-white shadow-sm"
                        : "bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.id === "all" && (
                      <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-600"
                      }`}>
                        {PROJECTS.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-full text-[13px] placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-[12px] font-mono text-zinc-500">
            <span>Mostrando {filteredProjects.length} de {PROJECTS.length} projetos</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-zinc-700 underline hover:text-black"
              >
                Limpar busca
              </button>
            )}
          </div>
        </section>

        {/* Projects Grid */}
        <section className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10 mb-20">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 rounded-[36px] bg-zinc-50 border border-dashed border-zinc-300">
              <p className="text-zinc-500 text-[15px] mb-4">Nenhum projeto encontrado para este filtro.</p>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 rounded-full bg-text-dark text-white text-[13px] font-medium hover:bg-black transition-colors"
              >
                Ver todos os projetos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="group rounded-[36px] bg-white border border-zinc-200/80 p-5 md:p-6 overflow-hidden flex flex-col justify-between hover:border-zinc-300 hover:shadow-card-hover transition-all duration-300"
                  >
                    <div>
                      {/* Project Image Preview */}
                      <div className="aspect-[16/10] rounded-[24px] overflow-hidden relative bg-zinc-100 mb-5 border border-zinc-100">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-white">
                          Case {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>

                      {/* Meta Tags */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-mono text-[11px]">
                          {project.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-[19px] md:text-[20px] font-semibold text-text-dark tracking-tight mb-2 group-hover:text-black transition-colors">
                        {project.title}
                      </h2>

                      {/* Services Pill / Info */}
                      <p className="font-mono text-[11px] text-zinc-400 uppercase tracking-wide mb-3">
                        {project.services}
                      </p>

                      {/* Description */}
                      <p className="text-[13px] text-zinc-600 font-normal leading-relaxed line-clamp-3 mb-6">
                        {project.description}
                      </p>
                    </div>

                    {/* Action CTA */}
                    <div className="pt-4 border-t border-zinc-100">
                      <a
                        href={`https://api.whatsapp.com/send?phone=${CONFIG.phone}&text=${encodeURIComponent(project.whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-[14px] bg-zinc-100 hover:bg-text-dark hover:text-white text-zinc-800 text-[13px] font-medium transition-all duration-200 group/btn"
                      >
                        <MessageCircle className="w-4 h-4 text-zinc-500 group-hover/btn:text-accent transition-colors" />
                        <span>Quero um projeto similar</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Bottom Editorial Banner CTA */}
        <section className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10">
          <div className="rounded-[36px] bg-[#09090b] text-white p-8 md:p-12 lg:p-16 relative overflow-hidden border border-white/10">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[11px] uppercase tracking-wider mb-6">
                Próximo Passo
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-4 leading-snug">
                Tem um projeto específico em mente?
              </h2>
              <p className="text-[14px] md:text-[16px] text-zinc-400 mb-8 leading-relaxed">
                Vamos conversar sobre o momento da sua empresa e definir a melhor estratégia para sua presença digital ou automação de processos.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://api.whatsapp.com/send?phone=${CONFIG.phone}&text=${encodeURIComponent("Olá William! Vi seu portfólio completo de projetos e gostaria de conversar sobre uma solução para minha empresa.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-[14px] bg-accent text-text-dark text-[14px] font-medium hover:bg-[#c8ff00] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Conversar no WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-[14px] bg-white/10 text-white text-[14px] font-medium hover:bg-white/20 transition-all duration-200"
                >
                  <span>Voltar para a Home</span>
                </Link>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute right-0 bottom-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

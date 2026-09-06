"use client";

import { AI_SYSTEMS, CONFIG, AiSystemItem } from "@/data";
import SectionEyebrow from "../SectionEyebrow";
import AnimatedHighlight from "../AnimatedHighlight";
import { 
  Database, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  Bot, 
  MessageSquare, 
  Layers, 
  Workflow, 
  ArrowUpRight, 
  Sparkles 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AiSystems() {
  const getSystemIcon = (iconName: AiSystemItem["icon"], isHighlighted?: boolean) => {
    const iconClass = isHighlighted 
      ? "w-5 h-5 text-accent" 
      : "w-5 h-5 text-muted-dark group-hover:text-text-light transition-colors";

    switch (iconName) {
      case "database":
        return <Database className={iconClass} />;
      case "calendar":
        return <Calendar className={iconClass} />;
      case "user-check":
        return <UserCheck className={iconClass} />;
      case "trending-up":
        return <TrendingUp className={iconClass} />;
      case "bot":
        return <Bot className={iconClass} />;
      case "message-square":
        return <MessageSquare className={iconClass} />;
      case "layers":
        return <Layers className={iconClass} />;
      case "workflow":
        return <Workflow className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const getSystemWhatsAppUrl = (system: AiSystemItem) => {
    const base = "https://api.whatsapp.com/send";
    const text = encodeURIComponent(system.whatsappMessage);
    return `${base}?phone=${CONFIG.phone}&text=${text}`;
  };

  return (
    <section id="ia-sistemas" className="relative w-full bg-bg-dark text-text-light py-24 lg:py-36 overflow-hidden">
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 tech-grid-dark opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-40 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10 relative z-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-16 items-end">
          <div className="lg:col-span-8">
            <SectionEyebrow number="03" label="IA & SISTEMAS" theme="dark" />
            <h2 className="font-section-title text-text-light mb-6">
              Sistemas sob medida e IA para automatizar <br className="hidden md:inline" />
              operações e{" "}
              <AnimatedHighlight variant="text">
                acelerar resultados.
              </AnimatedHighlight>
            </h2>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <p className="font-body text-muted-dark max-w-sm mb-2 leading-relaxed">
              Tecnologia aplicada onde realmente importa: organizando operações, qualificando leads 24h e eliminando gargalos manuais na sua empresa.
            </p>
          </div>
        </div>

        {/* 8-Card Editorial Grid (4 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {AI_SYSTEMS.map((system, idx) => {
            const isHighlight = system.isHighlighted;
            const borderClass = isHighlight
              ? "border-[#d4ff00]/40 hover:border-[#d4ff00]/70 shadow-[0_0_24px_rgba(212,255,0,0.06)]"
              : "border-white/10 hover:border-white/20";
            const iconWrapper = isHighlight
              ? "bg-[#1a230c] border border-accent/40"
              : "bg-white/5 border border-white/5 group-hover:border-white/15";

            return (
              <motion.a
                key={system.id}
                href={getSystemWhatsAppUrl(system)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className={`group bg-[#141416] border ${borderClass} rounded-[36px] p-7 lg:p-8 flex flex-col justify-between min-h-[250px] transition-all duration-200 hover:-translate-y-0.5`}
              >
                <div>
                  {/* Top Row: Icon and Optional Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center ${iconWrapper}`}>
                      {getSystemIcon(system.icon, isHighlight)}
                    </div>
                    {system.badge ? (
                      <span className="rounded-[12px] bg-[#d4ff00] text-text-dark px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
                        {system.badge}
                      </span>
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-muted-dark opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-semibold text-text-light text-[18px] md:text-[20px] mb-2 leading-snug group-hover:text-white transition-colors">
                    {system.title}
                  </h3>
                  <p className="text-[14px] leading-[1.5] text-muted-dark">
                    {system.description}
                  </p>
                </div>

                {/* Bottom Arrow Indicator */}
                <div className="pt-4 mt-2 flex items-center gap-1 text-[12px] font-medium text-muted-dark group-hover:text-accent transition-colors">
                  <span>Saber mais</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Bottom Banner Card (36px radius, hairline border) */}
        <div className="mt-10 bg-[#141416] border border-white/10 rounded-[36px] p-7 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-[12px] font-medium uppercase tracking-wider text-accent">
                Sistemas Sob Medida
              </span>
            </div>
            <h4 className="font-semibold text-text-light text-[20px] md:text-[22px] leading-snug mb-1">
              Tem um fluxo interno específico ou ideia de sistema com IA?
            </h4>
            <p className="text-[14px] text-muted-dark max-w-xl">
              Construímos a arquitetura, interface (UX/UI) e integrações personalizadas para o seu modelo de negócio.
            </p>
          </div>

          <a
            href="https://api.whatsapp.com/send?phone=5592999999999&text=Ol%C3%A1%20William!%20Gostaria%20de%20conversar%20sobre%20um%20sistema%20personalizado%20com%20IA%20para%20minha%20empresa."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 h-12 rounded-[14px] bg-accent text-text-dark text-[14px] font-medium shadow-dark-btn hover:bg-accent-hover hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
          >
            <span>Falar sobre seu sistema</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { CONFIG, getWhatsAppLink } from "@/data";
import SectionEyebrow from "../SectionEyebrow";
import AnimatedHighlight from "../AnimatedHighlight";
import { ArrowUpRight, Instagram, Linkedin, MessageCircle, Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function SocialContact() {
  const cards = [
    {
      title: "WhatsApp",
      desktopTitle: "WhatsApp Direto",
      description: "Atendimento imediato para tirar dúvidas ou estimativa comercial.",
      desktopDescription: "Atendimento imediato para tirar dúvidas, alinhar requisitos de projeto ou solicitar uma estimativa comercial.",
      cta: "WHATSAPP",
      desktopCta: "CONVERSAR NO WHATSAPP",
      url: getWhatsAppLink("general"),
      icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      theme: "dark",
      isInternal: false,
    },
    {
      title: "Instagram",
      desktopTitle: "Instagram",
      description: "Conteúdos, bastidores e estudos sobre design e negócios.",
      desktopDescription: "Conteúdos, opiniões, estudos e bastidores sobre estratégia, design, tecnologia e negócios.",
      cta: "INSTAGRAM",
      desktopCta: "ACOMPANHAR NO INSTAGRAM",
      url: CONFIG.socials.instagram,
      icon: <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />,
      theme: "light",
      isInternal: false,
    },
    {
      title: "LinkedIn",
      desktopTitle: "LinkedIn",
      description: "Reflexões sobre estratégia, processos e tecnologia.",
      desktopDescription: "Reflexões sobre negócios, tecnologia, processos, experiência e desenvolvimento profissional.",
      cta: "LINKEDIN",
      desktopCta: "CONECTAR NO LINKEDIN",
      url: CONFIG.socials.linkedin,
      icon: <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />,
      theme: "light",
      isInternal: false,
    },
    {
      title: "Diagnóstico IA",
      desktopTitle: "Diagnóstico com IA",
      description: "Descubra oportunidades digitais para seu negócio.",
      desktopDescription: "Pode estar na presença digital, na experiência do cliente, em um processo interno ou em uma ideia que precisa ganhar forma.",
      cta: "INICIAR IA",
      desktopCta: "INICIAR DIAGNÓSTICO",
      url: "/diagnostico",
      icon: <Bot className="w-4 h-4 sm:w-5 sm:h-5" />,
      theme: "accent",
      isInternal: true,
    },
  ];

  return (
    <section id="contato" className="relative w-full bg-bg-light text-text-dark py-14 sm:py-24 lg:py-36 overflow-hidden tech-grid">
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 mb-10 sm:mb-16 lg:mb-20 items-end">
          <div className="lg:col-span-8">
            <SectionEyebrow number="07" label="CANAIS & CONTEÚDO" theme="light" />
            <h2 className="text-2xl sm:text-4xl lg:text-[48px] font-medium tracking-tight text-text-dark mb-4 sm:mb-6 leading-[1.12]">
              Ideias, estudos e contato direto <br className="hidden sm:inline" />
              para o seu{" "}
              <AnimatedHighlight variant="box">
                próximo projeto.
              </AnimatedHighlight>
            </h2>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <p className="font-body text-muted-light text-sm sm:text-base max-w-sm mb-2 leading-relaxed">
              Fale pelo WhatsApp oficial, acompanhe os bastidores de desenvolvimento ou consulte nosso assistente de IA.
            </p>
          </div>
        </div>

        {/* Social Cards Grid - Exactly 2x2 on mobile (2 columns, 2 rows), 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-8">
          {cards.map((card, idx) => {
            const isAccent = card.theme === "accent";
            const isDark = card.theme === "dark";
            const bgClass = isAccent
              ? "bg-[#d4ff00] text-text-dark border border-black/10 hover:bg-[#c8ff00]"
              : isDark
              ? "bg-[#09090b] text-white border border-white/10 hover:border-accent/40 shadow-sm"
              : "bg-surface-light text-text-dark border border-border-light hover:border-black/20 hover:bg-[#FAFAFA]";
            const iconBg = isAccent 
              ? "bg-text-dark text-[#d4ff00]" 
              : isDark
              ? "bg-white/10 text-accent border border-white/10"
              : "bg-[#F4F4F5] text-text-dark border border-border-light";
            const descColor = isAccent ? "text-text-dark/80 font-medium" : isDark ? "text-white/70" : "text-muted-light";
            const ctaClass = isAccent
              ? "inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-5 sm:h-11 rounded-[8px] sm:rounded-[14px] bg-text-dark text-text-light text-[10px] sm:text-[13px] font-semibold shadow-dark-btn hover:bg-black transition-all duration-200"
              : isDark
              ? "inline-flex items-center gap-1 text-[10px] sm:text-[13px] font-semibold text-accent group-hover:text-white transition-colors duration-200"
              : "inline-flex items-center gap-1 text-[10px] sm:text-[13px] font-semibold text-text-dark group-hover:text-muted-light transition-colors duration-200";

            const cardContent = (
              <>
                {/* Top header */}
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-5">
                    <div className={`w-7 h-7 sm:w-11 sm:h-11 rounded-[8px] sm:rounded-[14px] flex items-center justify-center shrink-0 ${iconBg}`}>
                      {card.icon}
                    </div>
                    {!isAccent && <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-light group-hover:text-text-dark transition-colors duration-200" />}
                  </div>
                  
                  {/* Title (Mobile vs Desktop) */}
                  <h3 className="sm:hidden font-semibold text-[13px] text-inherit leading-tight mb-1">
                    {card.title}
                  </h3>
                  <h3 className="hidden sm:block font-semibold text-[18px] lg:text-[21px] mb-2 leading-snug">
                    {card.desktopTitle}
                  </h3>

                  {/* Description (Mobile vs Desktop) */}
                  <p className={`sm:hidden text-[10px] leading-[1.3] line-clamp-2 ${descColor}`}>
                    {card.description}
                  </p>
                  <p className={`hidden sm:block text-[14px] leading-[1.5] ${descColor}`}>
                    {card.desktopDescription}
                  </p>
                </div>

                {/* Bottom CTA (Mobile vs Desktop) */}
                <div className="mt-3 sm:mt-6">
                  <span className={ctaClass}>
                    <span className="sm:hidden">{card.cta}</span>
                    <span className="hidden sm:inline">{card.desktopCta}</span>
                    <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  </span>
                </div>
              </>
            );

            if (card.isInternal) {
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  <Link
                    href={card.url}
                    className={`group border rounded-[18px] sm:rounded-[30px] lg:rounded-[36px] p-3 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[165px] sm:min-h-[260px] lg:min-h-[310px] transition-all duration-200 h-full ${bgClass}`}
                  >
                    {cardContent}
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.a
                key={card.title}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className={`group border rounded-[18px] sm:rounded-[30px] lg:rounded-[36px] p-3 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[165px] sm:min-h-[260px] lg:min-h-[310px] transition-all duration-200 h-full ${bgClass}`}
              >
                {cardContent}
              </motion.a>
            );
          })}
        </div>

      </div>
    </section>
  );
}

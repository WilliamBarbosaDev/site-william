"use client";

import Link from "next/link";
import { CONFIG } from "@/data";
import SectionEyebrow from "../SectionEyebrow";
import AnimatedHighlight from "../AnimatedHighlight";
import { ArrowUpRight, Instagram, Linkedin, MessageSquare, Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function SocialContact() {
  const cards = [
    {
      title: "Instagram",
      description: "Conteúdos, opiniões, estudos e bastidores sobre estratégia, design, tecnologia e negócios.",
      cta: "ACOMPANHAR NO INSTAGRAM",
      url: CONFIG.socials.instagram,
      icon: <Instagram className="w-5 h-5" />,
      theme: "light",
      isInternal: false,
    },
    {
      title: "LinkedIn",
      description: "Reflexões sobre negócios, tecnologia, processos, experiência e desenvolvimento profissional.",
      cta: "CONECTAR NO LINKEDIN",
      url: CONFIG.socials.linkedin,
      icon: <Linkedin className="w-5 h-5" />,
      theme: "light",
      isInternal: false,
    },
    {
      title: "Tem algo na sua empresa que poderia funcionar melhor?",
      description: "Pode estar na presença digital, na experiência do cliente, em um processo interno ou em uma ideia que ainda precisa ganhar forma.",
      cta: "VAMOS ENTENDER",
      url: "/diagnostico",
      icon: <Bot className="w-5 h-5" />,
      theme: "accent",
      isInternal: true,
    },
  ];

  return (
    <section className="relative w-full bg-bg-light text-text-dark py-24 lg:py-36 overflow-hidden tech-grid">
      <div className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20 items-end">
          <div className="lg:col-span-8">
            <SectionEyebrow number="07" label="CONTEÚDO" theme="light" />
            <h2 className="font-section-title text-text-dark mb-6 leading-tight">
              Ideias, estudos e bastidores sobre <br />
              <AnimatedHighlight variant="box">
                negócios e tecnologia.
              </AnimatedHighlight>
            </h2>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <p className="font-body text-muted-light max-w-sm mb-2 leading-relaxed">
              Conteúdos sobre estratégia, UX, design, tecnologia, IA, processos e as decisões por trás de projetos digitais.
            </p>
          </div>
        </div>

        {/* Social Cards Grid (36px radius, hairline border) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => {
            const isAccent = card.theme === "accent";
            const bgClass = isAccent
              ? "bg-[#d4ff00] text-text-dark border border-black/10 hover:bg-[#c8ff00]"
              : "bg-surface-light text-text-dark border border-border-light hover:border-black/20 hover:bg-[#FAFAFA]";
            const iconBg = isAccent 
              ? "bg-text-dark text-[#d4ff00]" 
              : "bg-[#F4F4F5] text-text-dark border border-border-light";
            const descColor = isAccent ? "text-text-dark/80 font-medium" : "text-muted-light";
            const ctaClass = isAccent
              ? "inline-flex items-center gap-2 px-5 h-11 rounded-[14px] bg-text-dark text-text-light text-[13px] font-medium shadow-dark-btn hover:bg-black transition-all duration-200"
              : "inline-flex items-center gap-1.5 text-[13px] font-medium text-text-dark group-hover:text-muted-light transition-colors duration-200";

            const cardContent = (
              <>
                {/* Top header */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center ${iconBg}`}>
                      {card.icon}
                    </div>
                    {!isAccent && <ArrowUpRight className="w-4 h-4 text-muted-light group-hover:text-text-dark transition-colors duration-200" />}
                  </div>
                  
                  <h3 className="font-semibold text-[19px] md:text-[21px] mb-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className={`text-[14px] leading-[1.5] ${descColor}`}>
                    {card.description}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="mt-6">
                  <span className={ctaClass}>
                    <span>{card.cta}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                >
                  <Link
                    href={card.url}
                    className={`group border rounded-[36px] p-7 lg:p-8 flex flex-col justify-between min-h-[320px] transition-all duration-200 ${bgClass}`}
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
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`group border rounded-[36px] p-7 lg:p-8 flex flex-col justify-between min-h-[320px] transition-all duration-200 ${bgClass}`}
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

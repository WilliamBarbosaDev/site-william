"use client";

import Image from "next/image";
import { CONFIG, getWhatsAppLink } from "@/data";
import AnimatedHighlight from "./AnimatedHighlight";
import { ArrowUp, ArrowUpRight, Mail, MapPin, CheckCircle } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const links = [
    { label: "Projetos", href: "/#projetos" },
    { label: "Soluções", href: "/#solucoes" },
    { label: "Blog", href: "/blog" },
    { label: "Processo", href: "/#processo" },
    { label: "Sobre", href: "/#sobre" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contato", href: "/#contato" },
  ];

  return (
    <footer id="contato" className="relative bg-bg-dark text-text-light border-t border-border-dark overflow-hidden py-24 lg:py-36">
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 tech-grid-dark opacity-[0.06] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full border border-accent/10 opacity-30 pointer-events-none" />
      
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10 z-10">
        
        {/* Large Editorial CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 lg:pb-24 border-b border-border-dark">
          
          <div className="lg:col-span-8 flex flex-col justify-between">
            <h2 className="font-section-title text-text-light mb-8 leading-tight">
              Antes de falar em ferramenta, <br />
              vamos falar sobre o{" "}
              <AnimatedHighlight variant="text">
                problema.
              </AnimatedHighlight>
            </h2>
            <p className="font-body-large text-muted-dark max-w-xl mb-10 leading-relaxed">
              Conte o que está acontecendo na empresa, o que precisa melhorar ou a ideia que ainda precisa ganhar forma. A partir disso, fica mais fácil entender qual caminho realmente faz sentido.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={getWhatsAppLink("general")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-[14px] bg-[#d4ff00] text-text-dark text-[14px] font-medium shadow-dark-btn hover:bg-[#c8ff00] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none"
              >
                <span>Vamos conversar</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${CONFIG.email}`}
                className="inline-flex items-center gap-2 px-6 h-12 rounded-[14px] bg-[#18181B] border border-white/10 text-text-light text-[14px] font-medium hover:bg-white/10 transition-all duration-200 focus-visible:outline-none"
              >
                <span>Enviar um e-mail</span>
                <Mail className="w-4 h-4 text-muted-dark" />
              </a>
            </div>
          </div>

          {/* Information & Service Area Card (36px radius, hairline border) */}
          <div className="lg:col-span-4 bg-[#141416] border border-white/10 p-7 lg:p-8 rounded-[36px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 select-none">
                <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-ping" />
                <span className="rounded-[12px] bg-[#d4ff00]/10 border border-[#d4ff00]/25 text-[#d4ff00] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider">
                  Disponível para Novos Projetos
                </span>
              </div>
              <h3 className="font-semibold text-text-light text-[20px] mb-2">Diagnóstico inicial</h3>
              <p className="text-[14px] leading-[1.5] text-muted-dark mb-6">
                Conversa direta para entender o momento do seu negócio e identificar o melhor caminho.
              </p>
            </div>
            
            <div className="space-y-3.5 pt-5 border-t border-white/10 text-[13px] text-muted-dark font-medium">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4ff00] shrink-0" />
                <span>{CONFIG.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#d4ff00] shrink-0" />
                <span>{CONFIG.serviceArea}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Navigation and Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-12 py-16 border-b border-border-dark/50">
          
          {/* Column 1: Official Logo & Signature */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Image
                src="/assets/MINHA ID/LOGOS SEM FUNDO/Group 60.png"
                alt="William Barbosa Logo"
                width={240}
                height={60}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="font-body text-sm text-muted-dark max-w-sm leading-relaxed">
              Estratégia, UX/UI, design e tecnologia aplicados à construção de soluções digitais para empresas.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-4 md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <span className="font-label text-text-light/50 tracking-widest block mb-4">Navegação</span>
              <ul className="space-y-3">
                {links.slice(0, 3).map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="font-small text-muted-dark hover:text-[#d4ff00] transition-colors duration-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-label text-text-light/50 tracking-widest block mb-4">Informações</span>
              <ul className="space-y-3">
                {links.slice(3).map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="font-small text-muted-dark hover:text-[#d4ff00] transition-colors duration-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Social Network */}
          <div className="lg:col-span-4">
            <span className="font-label text-text-light/50 tracking-widest block mb-4">Conectar</span>
            <div className="flex flex-col gap-3">
              <a
                href={CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-small text-muted-dark hover:text-text-light flex items-center gap-1.5 transition-colors duration-200"
              >
                Instagram
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
              <a
                href={CONFIG.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-small text-muted-dark hover:text-text-light flex items-center gap-1.5 transition-colors duration-200"
              >
                LinkedIn
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
              <a
                href={CONFIG.socials.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="font-small text-muted-dark hover:text-text-light flex items-center gap-1.5 transition-colors duration-200"
              >
                Behance
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs font-mono text-muted-dark">
          <span>© 2026 William Barbosa. Todos os direitos reservados.</span>
          <span>{CONFIG.location}</span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[#d4ff00] transition-colors duration-200"
            aria-label="Voltar para o topo"
          >
            <span>Voltar ao topo</span>
            <span className="w-6 h-6 rounded-full border border-border-dark flex items-center justify-center bg-surface-dark">
              <ArrowUp className="w-3 h-3" />
            </span>
          </button>
        </div>

      </div>
    </footer>
  );
}

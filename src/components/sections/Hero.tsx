"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import AnimatedHighlight from "../AnimatedHighlight";

interface HeroProps {
  cmsContent?: {
    subtitle?: string;
    title?: string;
    description?: string;
    cta_text?: string;
    cta_url?: string;
  } | null;
}

export default function Hero({ cmsContent }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const FloatingBadge = ({ children, className, delay = 0, duration = 6, dotColor = "bg-accent" }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 0.9, 
        scale: 1,
        y: [0, -6, 0],
        x: [0, 3, 0]
      }}
      transition={{
        opacity: { duration: 0.6, delay: delay * 0.1 + 0.2 },
        scale: { duration: 0.6, delay: delay * 0.1 + 0.2 },
        y: { duration: duration, repeat: Infinity, ease: "easeInOut", delay: delay },
        x: { duration: duration * 1.2, repeat: Infinity, ease: "easeInOut", delay: delay }
      }}
      className={`hidden xl:flex absolute items-center gap-2 px-3 py-1.5 rounded-[12px] border border-border-light bg-surface-light/95 backdrop-blur-md shadow-xs text-[11px] font-medium uppercase tracking-wider text-text-dark select-none pointer-events-none z-10 ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {children}
    </motion.div>
  );

  return (
    <section className="relative w-full bg-bg-light overflow-hidden py-12 md:py-20 min-h-[calc(100vh-80px)] flex items-center justify-center tech-grid">
      
      {/* Background SVG Wave Lines */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none opacity-25">
        <svg className="w-full h-full stroke-border-light/40 fill-none" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M -100 450 C 300 250, 500 700, 900 500 C 1200 350, 1300 800, 1600 650" strokeWidth="1" />
          <path d="M -100 500 C 300 300, 500 750, 900 550 C 1200 400, 1300 850, 1600 700" strokeWidth="0.8" />
          <path d="M -100 550 C 300 350, 500 800, 900 600 C 1200 450, 1300 900, 1600 750" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Floating Badges */}
      <FloatingBadge className="left-[4%] 2xl:left-[8%] top-[22%]" delay={0} duration={6.5}>
        ESTRATÉGIA
      </FloatingBadge>
      <FloatingBadge className="left-[4%] 2xl:left-[8%] bottom-[20%]" delay={0.6} duration={5.5} dotColor="bg-text-dark">
        UX/UI & DESIGN
      </FloatingBadge>
      <FloatingBadge className="right-[4%] 2xl:right-[8%] top-[24%]" delay={1} duration={7}>
        WEB DESIGN
      </FloatingBadge>
      <FloatingBadge className="right-[4%] 2xl:right-[8%] bottom-[18%]" delay={1.4} duration={6} dotColor="bg-text-dark">
        SISTEMAS & IA
      </FloatingBadge>

      <div className="mx-auto max-w-[1200px] px-5 md:px-8 relative z-10 w-full flex flex-col items-center text-center">
        
        {/* Availability Status Badge (12px radius, hairline border) */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[12px] border border-border-light bg-surface-light shadow-xs text-[12px] font-medium tracking-normal text-text-dark mb-6 select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span>Disponível para novos projetos</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-text-dark font-semibold tracking-[-0.04em] max-w-[1040px] text-center mx-auto text-[38px] sm:text-[50px] md:text-[64px] lg:text-[76px] leading-[1.08] mb-6"
          >
            Soluções digitais pensadas para <br className="hidden md:inline" />
            o que sua empresa{" "}
            <AnimatedHighlight
              variant="rotate"
              words={[
                "realmente precisa.",
                "busca alcançar.",
                "precisa estruturar.",
                "quer transformar.",
              ]}
            />
          </motion.h1>

          {/* Supporting Text (15px compact editorial style) */}
          <motion.p
            variants={itemVariants}
            className="text-muted-light max-w-xl mx-auto mb-8 leading-[1.5] text-center font-normal text-[15px] md:text-[16px]"
          >
            {cmsContent?.description || "Estratégia, UX/UI, design e tecnologia trabalhando juntos para resolver problemas de posicionamento, experiência e operação."}
          </motion.p>

          {/* CTA Buttons (14px radius, hairline border, inset highlight) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-8"
          >
            <a
              href={cmsContent?.cta_url || "/diagnostico"}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 h-12 rounded-[14px] bg-text-dark text-text-light text-[14px] font-medium shadow-dark-btn border border-white/12 hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none"
            >
              <span>{cmsContent?.cta_text || "Vamos entender seu desafio"}</span>
              <ArrowUpRight className="w-4 h-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#projetos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 rounded-[14px] border border-border-light bg-surface-light text-text-dark text-[14px] font-medium shadow-light-btn hover:bg-[#FAFAFA] hover:border-black/15 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none"
            >
              <span>Ver projetos</span>
              <ArrowDown className="w-3.5 h-3.5 text-muted-light" />
            </a>
          </motion.div>
        </motion.div>

      </div>

      {/* Scroll indicator at the bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="hidden md:flex absolute bottom-2.5 left-1/2 -translate-x-1/2 flex-col items-center gap-1 z-10 select-none pointer-events-none"
      >
        <span className="font-mono text-[9px] tracking-[0.25em] text-muted-light uppercase">
          Role para explorar
        </span>
        <div className="w-[1px] h-4 bg-gradient-to-b from-muted-light/50 to-transparent relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1.5 bg-accent"
          />
        </div>
      </motion.div>

    </section>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import { SOLUTIONS, getWhatsAppLink } from "@/data";
import SectionEyebrow from "../SectionEyebrow";
import AnimatedHighlight from "../AnimatedHighlight";
import { ArrowUpRight, Globe, TrendingUp, Palette, Megaphone, Cpu, Handshake } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const getIcon = (title: string) => {
  switch (title) {
    case "Sites estratégicos":
      return <Globe className="w-5 h-5 text-text-dark" />;
    case "Landing pages":
      return <TrendingUp className="w-5 h-5 text-text-dark" />;
    case "Identidade visual":
      return <Palette className="w-5 h-5 text-text-dark" />;
    case "Conteúdo digital":
      return <Megaphone className="w-5 h-5 text-text-dark" />;
    case "Automações":
      return <Cpu className="w-5 h-5 text-text-dark" />;
    case "Parceria para agências":
      return <Handshake className="w-5 h-5 text-text-dark" />;
    default:
      return <Globe className="w-5 h-5 text-text-dark" />;
  }
};

export default function Solutions() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Calculate vertical translation of cards track across page scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const step = Math.min(
        Math.floor(latest * SOLUTIONS.length),
        SOLUTIONS.length - 1
      );
      setActiveStep(Math.max(0, step));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section
      id="solucoes"
      ref={sectionRef}
      className="relative w-full bg-bg-light text-text-dark lg:h-[260vh] tech-grid"
    >
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10 lg:sticky lg:top-0 lg:h-screen lg:flex lg:items-center py-20 lg:py-0">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full">
          
          {/* Left Column: Fixed Headline, Narrative, and Active Step Indicator */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <SectionEyebrow number="02" label="Soluções" theme="light" />
            
            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-medium tracking-tight text-text-dark mb-6 leading-[1.14]">
              <span className="block">A solução</span>
              <span className="block">sempre depende do</span>
              <span className="block mt-2">
                <AnimatedHighlight variant="box">
                  problema real.
                </AnimatedHighlight>
              </span>
            </h2>

            <p className="font-body text-muted-light max-w-md mb-8 leading-relaxed">
              Cada negócio possui contexto, objetivos e desafios próprios. As competências aplicadas em cada projeto acompanham exatamente essa necessidade.
            </p>

            {/* Scroll Active Step Indicator (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 mb-8 select-none">
              {SOLUTIONS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeStep === i ? "w-8 bg-accent" : "w-2 bg-black/15"
                  }`}
                />
              ))}
              <span className="font-mono text-[12px] font-medium text-text-dark ml-2">
                0{activeStep + 1} / 0{SOLUTIONS.length}
              </span>
            </div>

            {/* UX/UI & Design Narrative Box */}
            <div className="hidden lg:block bg-surface-light border border-border-light p-6 rounded-[24px] max-w-md shadow-xs">
              <span className="font-mono text-[11px] text-text-dark uppercase tracking-wider block mb-2 font-semibold">
                Estratégia → UX → UI → Tecnologia
              </span>
              <h4 className="font-medium text-text-dark text-[15px] mb-2 leading-snug">
                Não basta funcionar. Precisa ser fácil de entender, usar e confiar.
              </h4>
              <p className="text-[14px] text-muted-light leading-[1.5]">
                Estratégia define o objetivo. UX organiza a experiência. UI e design transformam essa estrutura em uma interface clara. A tecnologia torna tudo funcional.
              </p>
            </div>
          </div>

          {/* Right Column: Scroll-Driven Cards Showcase */}
          <div className="lg:col-span-7 relative">
            
            {/* Desktop: Pinned Viewport Window with Animated Scroll Track */}
            <div className="hidden lg:block h-[580px] overflow-hidden relative rounded-[36px]">
              
              {/* Gradient mask on top and bottom for smooth entry/exit */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-bg-light via-bg-light/80 to-transparent z-20" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-light via-bg-light/80 to-transparent z-20" />

              {/* Animated Sliding Track */}
              <motion.div style={{ y }} className="flex flex-col gap-5 py-8">
                {SOLUTIONS.map((solution, idx) => {
                  const isActive = activeStep === idx;
                  const stepNumber = `0${idx + 1} / 0${SOLUTIONS.length}`;

                  return (
                    <a
                      key={solution.title}
                      href={getWhatsAppLink(solution.cta_message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative flex flex-row items-center justify-between gap-6 bg-surface-light border p-7 lg:p-8 rounded-[36px] transition-all duration-300 ${
                        isActive 
                          ? "border-black/25 shadow-md scale-[1.01]" 
                          : "border-border-light opacity-65 hover:opacity-100 hover:border-black/20"
                      }`}
                    >
                      {/* Left Card Info */}
                      <div className="flex items-start gap-5 flex-grow">
                        <div className="w-12 h-12 rounded-[14px] bg-[#F4F4F5] border border-border-light flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                          {getIcon(solution.title)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="rounded-[12px] border border-border-light bg-[#FAFAFA] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-light">
                              {solution.indicator}
                            </span>
                            <span className="font-mono text-[11px] text-muted-dark tracking-wider">
                              {stepNumber}
                            </span>
                          </div>
                          <h3 className="font-semibold text-text-dark text-[19px] md:text-[21px] mb-1.5 leading-snug group-hover:text-black transition-colors">
                            {solution.title}
                          </h3>
                          <p className="text-[14px] text-muted-light max-w-md leading-[1.5]">
                            {solution.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Card Action */}
                      <div className="flex items-center justify-end shrink-0">
                        <span className="w-11 h-11 rounded-full border border-border-light flex items-center justify-center bg-[#F4F4F5] group-hover:bg-text-dark group-hover:border-transparent transition-all duration-200">
                          <ArrowUpRight className="w-4 h-4 text-text-dark group-hover:text-accent transition-colors" />
                        </span>
                      </div>
                    </a>
                  );
                })}
              </motion.div>
            </div>

            {/* Mobile View: Natural responsive card stack without pin traps */}
            <div className="lg:hidden flex flex-col gap-4">
              {SOLUTIONS.map((solution, idx) => (
                <a
                  key={solution.title}
                  href={getWhatsAppLink(solution.cta_message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-surface-light border border-border-light p-6 rounded-[28px] shadow-xs hover:border-black/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-[14px] bg-[#F4F4F5] border border-border-light flex items-center justify-center shrink-0">
                      {getIcon(solution.title)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="rounded-[10px] border border-border-light bg-[#FAFAFA] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-light">
                          {solution.indicator}
                        </span>
                        <span className="font-mono text-[10px] text-muted-dark">
                          0{idx + 1} / 0{SOLUTIONS.length}
                        </span>
                      </div>
                      <h3 className="font-semibold text-text-dark text-[17px] mb-1 leading-snug">
                        {solution.title}
                      </h3>
                      <p className="text-[13px] text-muted-light leading-[1.5]">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2 sm:pt-0">
                    <span className="w-9 h-9 rounded-full border border-border-light flex items-center justify-center bg-[#F4F4F5] group-hover:bg-text-dark">
                      <ArrowUpRight className="w-3.5 h-3.5 text-text-dark group-hover:text-accent" />
                    </span>
                  </div>
                </a>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

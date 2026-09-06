"use client";

import Image from "next/image";
import Link from "next/link";
import { PROJECTS, CONFIG, getWhatsAppLink } from "@/data";
import SectionEyebrow from "../SectionEyebrow";
import AnimatedHighlight from "../AnimatedHighlight";
import { ArrowUpRight, Plus, Grid } from "lucide-react";
import { motion } from "framer-motion";

export default function Projects() {
  // Present top 6 highlighted projects for speed and clarity
  const featuredProjects = PROJECTS.slice(0, 6);
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
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section id="projetos" className="relative w-full bg-bg-dark text-text-light py-20 lg:py-28 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 tech-grid-dark opacity-[0.03] pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-16 items-end">
          <div className="lg:col-span-8">
            <SectionEyebrow number="01" label="Projetos / Cases" theme="dark" />
            <h2 className="font-section-title text-text-light mb-6">
              Projetos que começam no problema <br className="hidden md:inline" />
              e terminam em{" "}
              <AnimatedHighlight variant="text">
                solução.
              </AnimatedHighlight>
            </h2>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <p className="font-body text-muted-dark max-w-sm mb-2 leading-relaxed">
              Cada projeto nasce de uma necessidade diferente. A estratégia, a experiência, o design e a tecnologia são definidos a partir daquilo que realmente precisa ser resolvido.
            </p>
          </div>
        </div>

        {/* Projects Grid with Rhythm */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {featuredProjects.map((project, idx) => {
            const isFeatured = idx === 0;
            return (
              <motion.a
                key={project.title}
                variants={itemVariants}
                href={`https://api.whatsapp.com/send?phone=${CONFIG.phone}&text=${encodeURIComponent(project.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col ${
                  isFeatured ? "md:col-span-2 lg:grid lg:grid-cols-12" : ""
                } bg-[#141416] border border-white/10 rounded-[36px] overflow-hidden transition-all duration-300 hover:border-white/25`}
              >
                {/* Image Container */}
                <div
                  className={`relative w-full ${
                    isFeatured
                      ? "lg:col-span-7 aspect-[16/9] lg:aspect-[16/10]"
                      : "aspect-[16/10]"
                  } overflow-hidden bg-[#0d0d0f] border-b lg:border-b-0 lg:border-r border-white/10`}
                >
                  <div className="absolute inset-0 bg-black/20 z-10 transition-opacity duration-300 group-hover:opacity-0" />
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes={isFeatured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 50vw"}
                  />
                </div>

                {/* Card Meta Content (28px padding) */}
                <div
                  className={`p-7 lg:p-8 flex flex-col justify-between flex-grow ${
                    isFeatured ? "lg:col-span-5" : ""
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="rounded-[12px] bg-[#d4ff00] text-[#111111] px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase">
                        {project.category}
                      </span>
                      <span className="rounded-[12px] border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-muted-dark uppercase tracking-wider">
                        {project.services}
                      </span>
                    </div>
                    <h3 className="font-semibold text-text-light text-[20px] lg:text-[22px] mb-3 flex items-center justify-between gap-2 group-hover:text-white transition-colors">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="text-[14px] leading-[1.5] text-muted-dark">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            );
          })}

          {/* Final Call to Action Card (36px radius, hairline border) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col bg-[#141416] border border-accent/40 rounded-[36px] overflow-hidden p-7 md:p-10 justify-between min-h-[360px] hover:border-accent/70 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span className="rounded-[12px] bg-accent/15 border border-accent/30 text-accent px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider">
                  Próximo Passo
                </span>
              </div>
              <h3 className="text-text-light font-semibold text-[26px] sm:text-[32px] md:text-[36px] leading-[1.15] mb-4">
                Tem um problema <br />
                que precisa virar solução?
              </h3>
            </div>
            
            <div>
              <p className="text-[15px] leading-[1.5] text-muted-dark max-w-sm mb-6">
                Vamos entender o cenário, identificar o que realmente precisa ser resolvido e definir juntos o melhor caminho.
              </p>
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-[14px] bg-accent text-text-dark text-[14px] font-medium shadow-dark-btn hover:bg-accent-hover hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
              >
                <span>Falar com Assistente de IA</span>
                <Plus className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

        </motion.div>

        {/* Action Banner to Full Projects Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-7 sm:p-9 rounded-[36px] bg-[#141416] border border-white/10"
        >
          <div>
            <span className="rounded-[12px] bg-white/5 border border-white/10 text-text-light/70 px-3 py-1 text-[11px] font-mono uppercase tracking-wider inline-block mb-2.5">
              Portfólio Expandido
            </span>
            <h4 className="text-text-light font-semibold text-[19px] sm:text-[21px] leading-snug">
              Quer ver mais cases em outras áreas de atuação?
            </h4>
            <p className="text-[14px] text-muted-dark mt-1 max-w-xl leading-[1.5]">
              Explore o catálogo completo com mais de 14 projetos em saúde, direito, finanças, tecnologia e serviços.
            </p>
          </div>

          <Link
            href="/projetos"
            className="shrink-0 inline-flex items-center gap-2 px-6 h-12 rounded-[14px] bg-surface-light text-text-dark text-[14px] font-medium shadow-light-btn hover:bg-[#FAFAFA] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
          >
            <Grid className="w-4 h-4 text-muted-light" />
            <span>Ver todos os projetos (+14)</span>
            <ArrowUpRight className="w-4 h-4 text-text-dark" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

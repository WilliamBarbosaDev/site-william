"use client";

import Image from "next/image";
import { getWhatsAppLink } from "@/data";
import SectionEyebrow from "../SectionEyebrow";
import AnimatedHighlight from "../AnimatedHighlight";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="sobre" className="relative w-full bg-bg-light text-text-dark py-24 lg:py-36 overflow-hidden tech-grid">
      <div className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Editorial Headline & Biography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <SectionEyebrow number="04" label="SOBRE" theme="light" />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-medium tracking-tight text-text-dark mb-8 leading-[1.12]">
              <span className="block">Trabalhar com o cliente.</span>
              <span className="block mt-2">
                <AnimatedHighlight variant="box">
                  Não apenas para ele.
                </AnimatedHighlight>
              </span>
            </h2>

            <div className="space-y-4 max-w-2xl mb-10">
              <p className="text-text-dark font-medium text-xl lg:text-2xl tracking-tight leading-snug">
                Eu sou o William Barbosa.
              </p>
              <p className="text-muted-light text-[15px] lg:text-[17px] leading-relaxed">
                Há mais de nove anos conecto <strong className="text-text-dark font-semibold">estratégia, design e tecnologia</strong> para transformar a presença digital e a operação de empresas e profissionais.
              </p>
              <p className="text-muted-light text-[15px] lg:text-[17px] leading-relaxed">
                Minhas entregas combinam <strong className="text-text-dark font-semibold">sites institucionais de alta autoridade</strong>, <strong className="text-text-dark font-semibold">landing pages de conversão</strong> e <strong className="text-text-dark font-semibold">sistemas sob medida com automações e Inteligência Artificial</strong> — sempre focados em resolver o problema real do negócio com máxima eficiência e clareza.
              </p>
            </div>

            <div>
              <a
                href={getWhatsAppLink("Olá William! Li sobre sua trajetória e gostaria de conversar sobre um projeto digital para minha empresa.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 h-12 rounded-[14px] bg-text-dark text-text-light text-[14px] font-medium shadow-dark-btn border border-white/12 hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none"
              >
                <span>Vamos conversar</span>
                <ArrowUpRight className="w-4 h-4 text-accent" />
              </a>
            </div>
          </div>

          {/* Right Column: Premium Portrait Frame (36px radius, hairline border) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="bg-surface-light border border-border-light p-3.5 rounded-[36px] relative overflow-hidden"
            >
              <div className="relative aspect-[3/4] w-full rounded-[26px] overflow-hidden bg-bg-dark">
                <Image
                  src="/assets/minhafoto02.jpeg"
                  alt="William Barbosa — Estratégia, Web & IA"
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-500 object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between font-mono text-[11px] text-white/90 bg-black/60 backdrop-blur-md py-2 px-3.5 rounded-[12px] border border-white/10 uppercase tracking-wider">
                  <span>William Barbosa</span>
                  <span className="text-[#d4ff00]">Manaus / BR</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}

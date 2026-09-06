"use client";

import { PROCESS_STEPS } from "@/data";
import SectionEyebrow from "../SectionEyebrow";
import AnimatedHighlight from "../AnimatedHighlight";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Process() {
  return (
    <section id="processo" className="relative w-full bg-bg-dark text-text-light py-24 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 tech-grid-dark opacity-[0.02] pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20 items-end">
          <div className="lg:col-span-8">
            <SectionEyebrow number="03" label="PROCESSO" theme="dark" />
            <h2 className="font-section-title text-text-light mb-6">
              Do problema à{" "}
              <AnimatedHighlight variant="text">
                solução.
              </AnimatedHighlight>
            </h2>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <p className="font-body text-muted-dark max-w-sm mb-2 leading-relaxed">
              Um processo colaborativo que começa entendendo o negócio e só depois chega ao design e à tecnologia.
            </p>
          </div>
        </div>

        {/* Process Cards Grid — 4 cards in a single aligned row on desktop */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {PROCESS_STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-[#141416] border border-white/10 rounded-[32px] p-6 lg:p-6 xl:p-7 flex flex-col justify-between transition-all duration-300 hover:border-accent/40 group h-full"
            >
              <div>
                {/* Step number and badge */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span className="text-[32px] lg:text-[36px] font-semibold text-accent leading-none group-hover:scale-105 transition-transform origin-left">
                    {step.number}
                  </span>
                  <span className="rounded-[10px] border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] xl:text-[11px] font-medium text-text-light/80 uppercase tracking-wider">
                    {step.label}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-semibold text-text-light text-[18px] lg:text-[19px] xl:text-[21px] mb-2.5 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-[1.55] text-muted-dark mb-6">
                  {step.description}
                </p>
              </div>

              {/* Deliverables (tag pills) */}
              <div className="pt-4 border-t border-white/10 mt-auto">
                <span className="text-[10px] text-muted-dark uppercase tracking-wider block mb-2.5 font-medium">
                  Entregáveis
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {step.deliverables.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-[10px] border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-text-light/85"
                    >
                      <Check className="w-2.5 h-2.5 text-accent shrink-0" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

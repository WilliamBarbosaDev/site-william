"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/data";
import SectionEyebrow from "../SectionEyebrow";
import AnimatedHighlight from "../AnimatedHighlight";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative w-full bg-bg-light text-text-dark py-24 lg:py-36 overflow-hidden tech-grid">
      <div className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column Title */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <SectionEyebrow number="06" label="FAQ" theme="light" />
            <h2 className="font-section-title text-text-dark mb-6 leading-tight max-w-sm">
              Respostas diretas sobre como <br className="hidden sm:inline" />
              o trabalho é{" "}
              <AnimatedHighlight variant="box">
                estruturado.
              </AnimatedHighlight>
            </h2>
            <p className="font-body text-muted-light max-w-sm mb-4 leading-relaxed">
              Perguntas fundamentais sobre método, diagnóstico, escopo e acompanhamento.
            </p>
          </div>

          {/* Right Column Accordions (Hairline bordered cards) */}
          <div className="lg:col-span-8 flex flex-col gap-3.5">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-[20px] border border-border-light bg-surface-light overflow-hidden transition-colors hover:border-black/15"
                >
                  <button
                    onClick={() => toggleItem(idx)}
                    className="w-full p-6 lg:p-7 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-button-${idx}`}
                  >
                    <h3 className="font-semibold text-[17px] md:text-[19px] text-text-dark pr-6 leading-snug">
                      {item.question}
                    </h3>
                    <span
                      className="w-9 h-9 rounded-full border border-border-light flex items-center justify-center shrink-0 bg-[#F4F4F5] group-hover:bg-text-dark group-hover:text-white transition-all duration-300"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      <Plus className="w-4 h-4 text-text-dark group-hover:text-white transition-colors" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${idx}`}
                        role="region"
                        aria-labelledby={`faq-button-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.25, ease: "linear" },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 lg:px-7 lg:pb-7 text-[15px] text-muted-light leading-[1.55]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

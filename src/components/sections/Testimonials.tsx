"use client";

import { useRef } from "react";
import { TESTIMONIALS } from "@/data";
import SectionEyebrow from "../SectionEyebrow";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="depoimentos" className="relative w-full bg-bg-dark text-text-light py-24 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 tech-grid-dark opacity-[0.02] pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10">
        
        {/* Header Block with navigation controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <SectionEyebrow number="05" label="DEPOIMENTOS" theme="dark" />
            <h2 className="font-section-title text-text-light mb-6 leading-tight">
              O resultado também aparece <br />
              na experiência de quem <span className="text-accent italic font-normal tracking-tight">participa do processo.</span>
            </h2>
            <p className="font-body text-muted-dark max-w-md leading-relaxed">
              Clientes e parceiros compartilham como foi construir essas soluções juntos.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border border-border-dark bg-surface-dark flex items-center justify-center text-text-light hover:text-accent hover:border-accent transition-all cursor-pointer focus-visible:outline-none"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border border-border-dark bg-surface-dark flex items-center justify-center text-text-light hover:text-accent hover:border-accent transition-all cursor-pointer focus-visible:outline-none"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel with Snap */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar py-4 cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none" }}
        >
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="w-[88vw] sm:w-[50vw] lg:w-[32vw] shrink-0 snap-start bg-surface-dark/30 border border-border-dark/50 p-8 lg:p-10 rounded-large flex flex-col justify-between min-h-[420px] hover:border-border-dark/80 transition-colors duration-300"
            >
              {/* Top rating */}
              <div>
                <div className="flex items-center gap-1.5 mb-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-accent font-semibold ml-2">
                    {testimonial.rating.toFixed(1)}
                  </span>
                </div>

                {/* Text quote */}
                <p className="font-body text-text-light/90 italic leading-relaxed mb-8">
                  "{testimonial.text}"
                </p>
              </div>

              {/* Author profile */}
              <div className="flex items-center gap-4 pt-6 border-t border-border-dark/40">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-border-dark/60 bg-bg-dark flex items-center justify-center shrink-0 shadow-sm">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <h4 className="font-medium-title text-base text-text-light font-semibold mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="font-mono text-[9px] text-muted-dark uppercase tracking-widest">
                    {testimonial.role}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

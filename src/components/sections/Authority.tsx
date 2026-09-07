"use client";

import { motion } from "framer-motion";

export default function Authority() {
  const cards = [
    {
      number: "+100",
      title: "Clientes atendidos",
      description:
        "Experiência construída trabalhando com diferentes empresas, profissionais e desafios.",
      theme: "dark",
    },
    {
      number: "+9",
      title: "Anos de experiência",
      description:
        "Uma trajetória prática entre design, web, interfaces, conteúdo, estratégia e tecnologia.",
      theme: "dark",
    },
    {
      number: "360°",
      title: "Visão integrada",
      description:
        "Estratégia, experiência, design e tecnologia conectados dentro da mesma solução.",
      theme: "accent",
    },
  ];

  return (
    <section className="relative w-full bg-bg-dark text-text-light py-16 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
          {cards.map((card, idx) => {
            const isAccent = card.theme === "accent";
            const bgClass = isAccent
              ? "bg-[#141416] border-accent/40 hover:border-accent/70 shadow-[0_0_16px_rgba(200,255,54,0.06)]"
              : "bg-[#141416] border-white/10 hover:border-white/20";
            const numColor = isAccent ? "text-accent" : "text-white";

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className={`border rounded-[20px] sm:rounded-[28px] lg:rounded-[36px] p-3 sm:p-5 lg:p-9 flex flex-col justify-between min-h-[140px] sm:min-h-[220px] lg:min-h-[300px] transition-all duration-300 ${bgClass}`}
              >
                {/* Large typography stat header */}
                <div className="flex items-start justify-between">
                  <span className={`text-[24px] sm:text-[38px] lg:text-[64px] font-semibold tracking-tight leading-none ${numColor}`}>
                    {card.number}
                  </span>
                  <span className="hidden sm:inline-block rounded-[10px] border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] lg:text-[11px] font-mono text-muted-dark uppercase">
                    0{idx + 1}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-2 sm:mt-6 lg:mt-8">
                  <h3 className="font-semibold text-[11px] sm:text-[15px] lg:text-[22px] text-text-light leading-tight mb-1">
                    {card.title}
                  </h3>
                  <p className="hidden md:block text-[11px] lg:text-[14px] leading-[1.45] text-muted-dark">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => {
            const isAccent = card.theme === "accent";
            const bgClass = isAccent
              ? "bg-[#141416] border-accent/40 hover:border-accent/70"
              : "bg-[#141416] border-white/10 hover:border-white/20";
            const numColor = isAccent ? "text-accent" : "text-white";

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`border rounded-[36px] p-7 lg:p-9 flex flex-col justify-between min-h-[300px] transition-all duration-300 ${bgClass}`}
              >
                {/* Large typography stat header */}
                <div className="flex items-start justify-between">
                  <span className={`text-[56px] lg:text-[64px] font-semibold tracking-tight leading-none ${numColor}`}>
                    {card.number}
                  </span>
                  <span className="rounded-[12px] border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-muted-dark uppercase">
                    0{idx + 1}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-8">
                  <h3 className="font-semibold text-[20px] lg:text-[22px] mb-2 text-text-light">
                    {card.title}
                  </h3>
                  <p className="text-[14px] leading-[1.5] text-muted-dark">
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

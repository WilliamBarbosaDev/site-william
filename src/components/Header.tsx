"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CONFIG } from "@/data";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { label: "Projetos", href: "/#projetos" },
    { label: "Soluções", href: "/#solucoes" },
    { label: "IA & Sistemas", href: "/#ia-sistemas" },
    { label: "Blog", href: "/blog" },
    { label: "Processo", href: "/#processo" },
    { label: "Sobre", href: "/#sobre" },
  ];

  const mobileNavLinks = [
    ...navLinks,
    { label: "FAQ", href: "/#faq" },
    { label: "Contato", href: "/#contato" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "h-16 lg:h-18 bg-bg-light/95 backdrop-blur-md shadow-sm border-b border-border-light"
            : "h-20 lg:h-22 bg-bg-light/80 backdrop-blur-[14px] border-b border-border-light/60"
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-5 md:px-7 lg:px-10 h-full flex items-center justify-between">
          {/* Left: Official Brand logo */}
          <a
            href="/"
            className="flex items-center gap-3 group transition-opacity hover:opacity-90"
            aria-label="William Barbosa — Voltar para o início"
          >
            <Image
              src="/assets/MINHA ID/LOGOS SEM FUNDO/Group 57.png"
              alt="William Barbosa — Designer e Web Designer"
              width={220}
              height={55}
              priority
              className="h-8 md:h-10 w-auto object-contain"
            />
          </a>

          {/* Center: Desktop Nav links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Menu principal">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[14px] font-medium text-muted-light hover:text-text-dark transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Desktop CTA */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href={`mailto:${CONFIG.email}`}
              className="text-[13px] font-mono text-muted-light hover:text-text-dark transition-colors duration-200"
            >
              {CONFIG.email}
            </a>
            <a
              href="/#contato"
              className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-text-dark text-text-light text-[13px] font-medium tracking-wide shadow-dark-btn border border-white/10 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none"
            >
              <span>Vamos conversar</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
            </a>
          </div>

          {/* Mobile Right: Menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[12px] border border-border-light bg-surface-light text-text-dark hover:bg-bg-light transition-colors"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 top-[64px] z-40 lg:hidden bg-bg-light flex flex-col justify-between border-t border-border-light p-6 h-[calc(100vh-64px)] overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 pt-8" aria-label="Menu móvel">
              {mobileNavLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="font-medium-title text-text-dark border-b border-border-light/40 pb-4 flex items-center justify-between hover:text-muted-light"
                >
                  {link.label}
                  <span className="text-accent text-sm font-mono">0{idx + 1}</span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-4 mt-8 pb-10"
            >
              <a
                href={`mailto:${CONFIG.email}`}
                className="font-body text-center text-muted-light hover:text-text-dark py-2 transition-colors"
              >
                {CONFIG.email}
              </a>
              <a
                href="#contato"
                onClick={() => setIsMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-pill bg-text-dark text-text-light font-label hover:bg-accent hover:text-text-dark transition-all duration-300"
              >
                Vamos conversar
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedHighlightProps {
  children?: React.ReactNode;
  words?: string[];
  variant?: "box" | "text" | "rotate";
  className?: string;
  delay?: number;
}

export default function AnimatedHighlight({
  children,
  words,
  variant = "box",
  className = "",
  delay = 0.2,
}: AnimatedHighlightProps) {
  // Rotating words state for Hero
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    if (variant !== "rotate" || !words || words.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 3400);

    return () => clearInterval(interval);
  }, [variant, words]);

  // Variant 1: Rotating keywords (Hero)
  if (variant === "rotate" && words && words.length > 0) {
    return (
      <span className={`relative inline-flex items-center overflow-hidden px-2.5 py-0.5 my-1 bg-[#d4ff00] text-text-dark rounded-[8px] leading-[1.05] align-middle ${className}`}>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentWordIndex}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block whitespace-nowrap"
          >
            {words[currentWordIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    );
  }

  // Variant 2: Animated Highlighter Pen Drawing Box
  if (variant === "box") {
    return (
      <span className={`relative inline-block px-2 py-0.5 my-0.5 rounded-[6px] text-text-dark ${className}`}>
        {/* Animated highlighter background */}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{
            duration: 0.55,
            delay: delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 bg-[#d4ff00] rounded-[6px] origin-left -z-0"
        />
        {/* Text on top */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: delay + 0.15 }}
          className="relative z-10"
        >
          {children}
        </motion.span>
      </span>
    );
  }

  // Variant 3: Animated Text Accent (Italic / Shimmer Glow)
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className={`inline-block text-accent italic font-normal tracking-tight ${className}`}
    >
      {children}
    </motion.span>
  );
}

"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // Apply a smooth spring to the scroll progress
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[2px] z-50 pointer-events-none hidden lg:block bg-border-light/20">
      <motion.div
        className="w-full bg-accent origin-top h-full"
        style={{ scaleY }}
      />
    </div>
  );
}

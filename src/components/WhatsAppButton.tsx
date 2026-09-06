"use client";

import { useState, useEffect } from "react";
import { getWhatsAppLink } from "@/data";
import { PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    
    // Auto show tooltip briefly after 5 seconds to draw attention
    const timer = setTimeout(() => {
      setShowTooltip(true);
      const hideTimer = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(hideTimer);
    }, 5000);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                className="absolute right-16 mr-2 bg-text-dark text-text-light text-[13px] font-medium py-2 px-3.5 rounded-[12px] border border-white/15 whitespace-nowrap shadow-dark-btn pointer-events-none hidden md:block"
              >
                Vamos conversar? 👋
                {/* Arrow pointing to the right */}
                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-text-dark border-r border-t border-white/15" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Icon */}
          <motion.a
            href={getWhatsAppLink("general")}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-[52px] h-[52px] md:w-14 md:h-14 rounded-full bg-accent hover:bg-accent-hover text-text-dark flex items-center justify-center border border-black/10 shadow-dark-btn transition-colors focus-visible:outline-none"
            aria-label="Conversar com William pelo WhatsApp"
          >
            {/* Pulsing glow ring around the button */}
            <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping pointer-events-none" />
            
            {/* Custom WhatsApp Icon or SVG */}
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.63 2.012 14.156.993 11.536.993c-5.442 0-9.87 4.372-9.874 9.802-.001 1.774.475 3.5 1.378 5.011L2.09 19.986l4.557-1.189L6.647 19.16zM17.38 14.61c-.316-.157-1.874-.913-2.162-1.017-.289-.104-.5-.157-.712.158-.21.314-.813 1.017-.996 1.226-.184.21-.367.236-.683.078-1.564-.72-2.735-1.28-3.793-3.077-.28-.475.28-.44.802-1.472.086-.174.043-.326-.02-.484-.065-.158-.512-1.218-.702-1.67-.184-.44-.372-.38-.512-.387-.132-.007-.284-.008-.437-.008-.153 0-.403.057-.613.284-.21.226-.803.774-.803 1.887 0 1.113.82 2.19 1.004 2.43.183.24 1.614 2.434 3.91 3.41 1.71.726 2.413.805 3.282.678.532-.078 1.873-.755 2.137-1.488.263-.733.263-1.36.184-1.488-.078-.127-.29-.184-.604-.34z" />
            </svg>
          </motion.a>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { motion, AnimatePresence } from "framer-motion";

interface AdminShellProps {
  user: { name: string; email: string };
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Fecha a sidebar mobile automaticamente ao mudar de rota
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar (Fixa lateral) */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar user={user} />
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[85vw] h-full z-10 flex flex-col bg-[#0a0a0b] shadow-2xl"
            >
              <AdminSidebar user={user} onClose={() => setIsMobileSidebarOpen(false)} isMobile />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

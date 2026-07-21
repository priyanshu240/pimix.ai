"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname === "/admin") return null;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/#portfolio" },
    { name: "Agency", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
    >
      <nav 
        className={`flex items-center justify-between px-2 py-2 rounded-full overflow-hidden w-full relative transition-all duration-500 ${
          isScrolled 
            ? "bg-[#080808]/96 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl" 
            : "glass-panel"
        }`}
        onMouseLeave={() => setHoveredPath(null)}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          const isHovered = hoveredPath === link.path;
          
          return (
            <Link
              key={link.path}
              href={link.path}
              onMouseEnter={() => setHoveredPath(link.path)}
              className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 z-10 ${
                isActive || isHovered ? "text-[var(--primary)] font-bold" : "text-[var(--foreground)]/80"
              } hover:text-[var(--primary)]`}
            >
              {(isActive || isHovered) && (
                <motion.div
                  layoutId="spotlight"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent z-0"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-4 bg-[var(--primary)] blur-[12px] opacity-60 rounded-full" />
                </motion.div>
              )}
              <span className="relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}

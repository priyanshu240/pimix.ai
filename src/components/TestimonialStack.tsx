"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  image: string;
  title: string;
  description: string;
}

interface TestimonialStackProps {
  testimonials: Testimonial[];
}

export default function TestimonialStack({ testimonials }: TestimonialStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24 py-12">
      {/* Cards Stack Container */}
      <div className="relative w-[300px] h-[350px] md:w-[350px] md:h-[400px] perspective-[1000px]">
        <AnimatePresence mode="popLayout">
          {testimonials.map((testi, index) => {
            const isActive = index === activeIndex;
            // Calculate how far back this card is
            let distance = index - activeIndex;
            if (distance < 0) {
              distance += testimonials.length;
            }

            // Only show the active card and the next 2 in the stack
            if (distance > 2) return null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{
                  opacity: isActive ? 1 : 1 - distance * 0.3,
                  x: distance * 40,
                  y: distance * 20,
                  scale: 1 - distance * 0.05,
                  zIndex: testimonials.length - distance,
                  rotateZ: distance * 2,
                }}
                exit={{ opacity: 0, x: -100, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl glass-panel border border-[var(--primary)]/20 p-1"
                style={{
                  transformOrigin: "center right",
                }}
              >
                <div className="relative w-full h-full filter grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Using a placeholder if the image fails, otherwise the actual image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${testi.image}')` }}
                  />
                  {/* Subtle inner shadow overlay */}
                  <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center text-center md:items-start md:text-left glass-panel p-8 md:p-12 rounded-3xl border border-[var(--primary)]/10">
        <div className="flex w-full justify-end font-mono text-sm tracking-widest text-muted-foreground mb-4">
          {activeIndex + 1} / {testimonials.length}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight">
              {testimonials[activeIndex].title}
            </h2>
            <p className="text-muted-foreground md:text-lg leading-relaxed max-w-md font-medium">
              {testimonials[activeIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-4 mt-10">
          <button
            onClick={handlePrev}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted hover:border-foreground transition-all duration-300 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted hover:border-foreground transition-all duration-300 shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

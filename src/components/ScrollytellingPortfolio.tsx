"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

const projects = [
  {
    title: "AI Autonomous Outreach",
    category: "[ AI Integration ]",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Neon Horizon Platform",
    category: "[ Web Development ]",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Global Conversion Funnel",
    category: "[ Marketing & SEO ]",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ScrollytellingPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const content = useContent();

  // We set the container to 300vh so there is plenty of scroll distance.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate the horizontal translation based on scroll progress.
  // We have 3 projects. The total width is 300%. To show the last one, we translate by -66.66% (2/3).
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-transparent">
      {/* Changed justify-center to pt-32 to prevent top clipping on short screens, removed overflow-hidden */}
      <div className="sticky top-0 h-screen flex flex-col items-center pt-24 md:pt-32">
        
        {/* Header Text */}
        <div className="relative z-10 w-full px-6 text-center mb-8 md:mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-extrabold text-white uppercase tracking-tighter">
            {content.portfolio.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">{content.portfolio.titleHighlight}</span>
          </h2>
          <p className="text-zinc-400 mt-2 md:mt-4 font-sans max-w-lg mx-auto text-sm md:text-base">
            {content.portfolio.description}
          </p>
        </div>

        {/* MacBook Frame - Scaled max width down to 900px to ensure it fits vertically on laptops */}
        <div className="relative w-[85vw] max-w-[900px] aspect-[16/10] perspective-[1000px]">
          {/* Laptop Body SVG */}
          <div className="absolute inset-0 z-10 pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <svg viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Outer screen shell (Metal) */}
              <rect x="10" y="10" width="980" height="580" rx="20" fill="#222" stroke="#444" strokeWidth="2"/>
              {/* Inner Bezel (Glass) */}
              <rect x="25" y="25" width="950" height="550" rx="10" fill="#000" />
              {/* Camera Notch */}
              <circle cx="500" cy="32" r="5" fill="#111" />
              {/* Laptop Base (Hinge) */}
              <path d="M10 590 H990 Q1000 595 990 600 H10 Q0 595 10 590 Z" fill="#1a1a1a"/>
            </svg>
          </div>

          {/* Scrolling Content (Positioned perfectly inside the screen and placed ABOVE the SVG) */}
          <div 
            className="absolute z-20 overflow-hidden bg-[#050505] rounded-md"
            style={{
                top: "6.66%",
                left: "4%",
                width: "92%",
                height: "83.33%"
            }}
          >
            <motion.div 
              className="flex w-[300%] h-full"
              style={{ x }}
            >
              {projects.map((project, index) => (
                <div key={index} className="relative w-full h-full group overflow-hidden">
                   <img 
                     src={project.image} 
                     alt={project.title}
                     className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                   
                   <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-30 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     <span className="text-emerald-400 font-mono text-xs md:text-sm mb-3 block border border-emerald-500/30 w-max px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                       {project.category}
                     </span>
                     <h3 className="text-3xl md:text-5xl font-display font-bold text-white">
                       {project.title}
                     </h3>
                     <div className="mt-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <button className="px-6 py-2.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-zinc-200 transition-colors">
                            View Case Study
                        </button>
                     </div>
                   </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        
      </div>
    </section>
  );
}

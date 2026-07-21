"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  functionality: string;
  image: string;
}

const teamData: TeamMember[] = [
  {
    name: "Alex Rivera",
    role: "Chief AI Architect",
    functionality: "Designs and orchestrates autonomous multi-agent pipelines and custom LLM interfaces.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Elena Vance",
    role: "UI/UX Creative Lead",
    functionality: "Crafts premium glassmorphic designs, Three.js spatial interactions, and web branding aesthetics.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Marcus Chen",
    role: "Principal Systems Engineer",
    functionality: "Architects high-performance edge database pipelines, API gateways, and Next.js structures.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
  },
];

export default function TeamShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-12">
      {/* Left Side: Interactive Photo Stack */}
      <div className="relative w-[280px] h-[340px] md:w-[320px] md:h-[380px] perspective-[1000px] flex-shrink-0">
        <AnimatePresence mode="popLayout">
          {teamData.map((member, index) => {
            const isActive = index === activeIndex;
            // Calculate distance in stack order
            let distance = index - activeIndex;
            if (distance < 0) {
              distance += teamData.length;
            }

            // Render active card and back cards
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isActive ? 1 : 1 - distance * 0.35,
                  x: isActive ? 0 : distance * 25,
                  y: isActive ? 0 : distance * 15,
                  scale: isActive ? 1 : 1 - distance * 0.05,
                  zIndex: teamData.length - distance,
                  rotateZ: isActive ? 0 : distance * 2,
                }}
                exit={{ opacity: 0, x: -100, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl glass-panel border border-white/10 p-1"
                style={{
                  transformOrigin: "center right",
                }}
              >
                <div className="relative w-full h-full filter grayscale hover:grayscale-0 transition-all duration-500">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${member.image}')` }}
                  />
                  {/* Outer gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Label on active image for mobile accessibility */}
                  {isActive && (
                    <div className="absolute bottom-4 left-4 z-10 block lg:hidden">
                      <p className="text-white font-bold text-lg">{member.name}</p>
                      <p className="text-primary text-xs font-semibold uppercase">{member.role}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Right Side: 3 UI Cards for Team Members */}
      <div className="flex-1 flex flex-col gap-4 w-full">
        {teamData.map((member, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={index}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`cursor-pointer transition-all duration-300 p-6 rounded-2xl glass-panel border text-left ${
                isActive
                  ? "border-primary/40 bg-white/5 shadow-[0_0_30px_rgba(139,92,246,0.15)] translate-x-2"
                  : "border-white/5 bg-transparent hover:bg-white/[0.01]"
              }`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`text-lg md:text-xl font-bold transition-colors ${isActive ? "text-white" : "text-white/80"}`}>
                    {member.name}
                  </h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider mt-0.5">
                    {member.role}
                  </p>
                </div>
                {isActive && (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-pulse" />
                )}
              </div>
              <p className={`text-xs md:text-sm leading-relaxed transition-colors ${isActive ? "text-zinc-300" : "text-zinc-500"}`}>
                {member.functionality}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

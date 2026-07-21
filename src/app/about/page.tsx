"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, Network, Activity, Globe, Send, ShieldAlert } from "lucide-react";

interface Milestone {
  phase: string;
  year: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const milestones: Milestone[] = [
  {
    phase: "Phase 01",
    year: "2023",
    title: "Escape Velocity",
    desc: "Broke away from basic LLM APIs. Configured high-performance local environments to directly run open model weights with raw tensor manipulations.",
    icon: <Compass className="h-5 w-5" />,
  },
  {
    phase: "Phase 02",
    year: "2024",
    title: "Swarm Autonomy",
    desc: "Developed a custom reactive event-bus orchestration, enabling clusters of over 50+ autonomous agents to synchronize multi-step reasoning processes.",
    icon: <Network className="h-5 w-5" />,
  },
  {
    phase: "Phase 03",
    year: "2025",
    title: "Edge Gravity reduction",
    desc: "Deployed custom quantization models onto edge clusters (NVIDIA Jetson, TensorRT), reducing memory footprints and CPU gravity by 70% with zero loss in fidelity.",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    phase: "Phase 04",
    year: "2026",
    title: "Orbital Networks",
    desc: "Achieved direct integration in aerospace telemetry networks, proving autonomous agent logic in severe compute-constrained satellite systems.",
    icon: <Globe className="h-5 w-5" />,
  },
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking to provide dynamic depth feeling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen w-full bg-[#02000a] pt-32 pb-24 px-6 overflow-hidden">
      
      {/* Dynamic ambient backdrop */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10"
      />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Core Narrative / Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5 flex flex-col gap-5">
            <span className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> Philosophy Telemetry
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-tight leading-[1.1]">
              Defying Standard <br />
              <span className="text-gradient">Constraints</span>
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mt-2" />
          </div>

          <div className="md:col-span-7 flex flex-col gap-6">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light">
              Conventional software engineering operates within rigid borders. At pimix.ai, we believe that AI architectures must defy the gravitational pull of simple REST endpoints and pre-configured templates.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light">
              We construct custom, deep-integrated neural networks and decentralized swarm protocols. Our systems operate dynamically, adapting in real time to complex environments, proving that when constraints are removed, intelligence rises naturally.
            </p>
          </div>
        </div>

        {/* Interactive Horizontal Scroll Timeline */}
        <div className="mt-10 flex flex-col gap-6">
          <div>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-white uppercase tracking-wider">
              Orbits of Evolution
            </h2>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">
              Scroll horizontally to navigate our developmental vectors
            </p>
          </div>

          {/* Timeline slider container */}
          <div className="relative w-full overflow-x-auto pb-12 pt-16 scrollbar-thin select-none snap-x snap-mandatory">
            
            {/* Base timeline trajectory line */}
            <div className="absolute top-[230px] left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/30 to-pink-500/20 -z-10" />

            {/* Scrolling track */}
            <div className="flex gap-8 md:gap-12 min-w-[1000px] px-6">
              {milestones.map((item, index) => {
                // Undulate height offsets to create a wave layout along the timeline line
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={index}
                    className="w-[280px] snap-center shrink-0 flex flex-col items-center text-center relative"
                    initial={{ opacity: 0, y: isEven ? 20 : -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                  >
                    {/* Event bubble */}
                    <motion.div
                      className={`h-12 w-12 rounded-full border flex items-center justify-center bg-[#0d0a21] ${
                        isEven ? "border-primary/40 text-primary" : "border-accent/40 text-accent"
                      } shadow-[0_0_15px_rgba(139,92,246,0.1)] mb-6 relative z-10`}
                      whileHover={{
                        scale: 1.2,
                        rotate: 360,
                        backgroundColor: "#8b5cf6",
                        color: "#ffffff",
                        borderColor: "#ffffff",
                        boxShadow: "0 0 20px rgba(139,92,246,0.5)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    >
                      {item.icon}
                    </motion.div>

                    {/* Timeline connection vertical dot */}
                    <div className={`absolute top-[48px] w-0.5 h-[134px] border-l border-dashed -z-20 ${
                      isEven ? "border-primary/20" : "border-accent/20"
                    }`} />

                    {/* Content Card (placed above or below the trajectory line) */}
                    <div className="glass-panel hover:glass-panel-glow p-6 rounded-2xl border border-white/5 flex flex-col gap-3 min-h-[190px] w-full text-left transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                          {item.phase}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white">
                          {item.year}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA banner link */}
        <div className="glass-panel-glow rounded-3xl p-8 md:p-12 mt-4 text-center flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-white tracking-wide">
            Ready to initiate flight protocols?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg font-light">
            We collaborate with visionaries and enterprise pioneers. Partner with us to lift your digital assets beyond the standard pull of mainstream computing constraints.
          </p>
          <Link href="/contact">
            <button className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-transparent hover:text-white border border-white hover:border-primary/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2">
              <Send className="h-3.5 w-3.5" /> Initiate Uplink
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

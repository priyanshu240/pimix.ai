"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Cpu, Bot, Eye, Terminal, Layers, ArrowRight, ShieldCheck } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

// Load 3D icons component dynamically
const ServiceIconCanvas = dynamic(
  () => import("@/components/three/ServiceIconCanvas"),
  { ssr: false }
);

interface ServiceCardProps {
  id: string;
  title: string;
  desc: string;
  specs: string[];
}

function ServiceCard({ id, title, desc, specs }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);

  const iconsMap: Record<string, React.ReactNode> = {
    llm: <Cpu className="h-5 w-5" />,
    agents: <Bot className="h-5 w-5" />,
    vision: <Eye className="h-5 w-5" />
  };

  const icon = iconsMap[id] || <Cpu className="h-5 w-5" />;

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass-panel hover:glass-panel-glow rounded-3xl p-8 transition-all duration-500 relative flex flex-col justify-between group overflow-hidden border border-white/5"
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 15 } }}
    >
      {/* Decorative neon backlights inside card */}
      <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500 ${
        id === "llm" ? "bg-primary" : id === "agents" ? "bg-accent" : "bg-pink-500"
      }`} />

      <div>
        {/* Floating 3D WebGL Icon Canvas container */}
        <div className="w-full flex justify-center mb-6 relative">
          <div className="w-24 h-24">
            <ServiceIconCanvas type={id as any} hovered={hovered} />
          </div>
        </div>

        {/* Text Area */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-accent group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors duration-300">
            {icon}
          </div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-wide">
            {title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-light">
          {desc}
        </p>

        {/* Technical Specification Lists */}
        <div className="border-t border-white/10 pt-6 mb-8">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest block mb-3">
            Technical Integrations
          </span>
          <ul className="flex flex-col gap-2.5">
            {specs.map((spec, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs text-foreground/80">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  id === "llm" ? "bg-primary" : id === "agents" ? "bg-accent" : "bg-pink-500"
                }`} />
                {spec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Link */}
      <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-semibold text-white tracking-wide group-hover:text-accent transition-colors mt-auto">
        Request Architecture Review
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
      </Link>
    </motion.div>
  );
}

export default function Services() {
  const { services } = useContent();

  return (
    <div className="relative min-h-screen w-full bg-[#02000a] pt-32 pb-24 px-6 overflow-hidden">
      {/* Background glow graphics */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-widest text-primary"
          >
            <Layers className="h-3 w-3" /> Core Offerings Node
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white"
          >
            Technical <span className="text-gradient">Specifications</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light"
          >
            We supply high-efficiency neural pipelines and autonomous computing layers built to overcome the limitations of off-the-shelf consumer solutions.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {services.map((card) => (
            <ServiceCard key={card.id} {...card} />
          ))}
        </div>

        {/* Trust telemetries block */}
        <div className="glass-panel rounded-3xl p-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-accent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm sm:text-base text-white">
                Guaranteed Deployment SLA & Encryption
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-md leading-relaxed">
                All client clusters are deployed inside dedicated sandboxes with SOC2 compliance and zero data retention models for model tuning nodes.
              </p>
            </div>
          </div>
          <Link href="/contact">
            <button className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-transparent hover:text-white border border-white transition-all duration-300 shrink-0">
              Read Security Protocol
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

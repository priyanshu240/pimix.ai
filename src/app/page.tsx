"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Box, ChevronRight, Zap } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import HeroScene from "@/components/three/HeroScene";
import TeamShowcase from "@/components/TeamShowcase";
import AsciiGlitchText from "@/components/AsciiGlitchText";
import ImageTrail from "@/components/ImageTrail";
import HorizontalGallery from "@/components/HorizontalGallery";
import PlayfulCat from "@/components/PlayfulCat";
import LiquidMercuryLogo from "@/components/LiquidMercuryLogo";
import InteractiveSandbox from "@/components/InteractiveSandbox";
import ScrollytellingPortfolio from "@/components/ScrollytellingPortfolio";
import PerformanceAudit from "@/components/PerformanceAudit";
import AgentChat from "@/components/AgentChat";
import ScrollThemeBackground from "@/components/ScrollThemeBackground";
import ZeroGravityIntro from "@/components/ZeroGravityIntro";
import { useContent } from "@/contexts/ContentContext";



export default function Home() {
  const [isRevealed, setIsRevealed] = useState(false);
  const content = useContent();

  return (
    <div className="min-h-screen text-white font-sans selection:bg-emerald-500/30">
      <ZeroGravityIntro onComplete={() => setIsRevealed(true)} />
      <ScrollThemeBackground />
      
      {/* Hero Section */}
      <section 
        className="relative w-full h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden cursor-crosshair bg-transparent"
        onClick={() => setIsRevealed(!isRevealed)}
      >
        
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
            <HeroScene />
          </Canvas>
        </div>

        {/* Liquid Mask Overlay */}
        <motion.div 
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black mix-blend-multiply"
          animate={{ scale: isRevealed ? 150 : 1, opacity: isRevealed ? 0 : 1 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <h1 className="font-display text-[15vw] leading-[0.85] font-extrabold uppercase tracking-tighter text-white text-center whitespace-nowrap" dangerouslySetInnerHTML={{ __html: content.hero.title }}>
          </h1>
        </motion.div>

        {/* Revealed Content (Visible after click) */}
        <motion.div 
          className="relative z-30 pointer-events-auto flex flex-col items-center text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-[80vw] max-w-4xl opacity-90 drop-shadow-2xl">
            <LiquidMercuryLogo />
          </div>
          <p className="text-lg sm:text-2xl text-white/80 max-w-2xl mt-12 font-medium drop-shadow-md">
            {content.hero.subtitle}
          </p>
        </motion.div>



        {/* piMix Text & Animated Cat - Moved to upper left */}
        <div className="absolute top-8 left-8 md:left-12 z-40 pointer-events-auto flex items-center mix-blend-difference text-white">
          <h1 className="font-display font-extrabold tracking-tighter uppercase leading-none text-2xl sm:text-3xl md:text-4xl pr-2">
            piMix
          </h1>
          <PlayfulCat />
        </div>
      </section>

      {/* Interactive Sandbox Section (Phase 1) */}
      <div className="relative z-30">
        <InteractiveSandbox />
      </div>

      {/* Cinematic Scrollytelling Portfolio (Phase 2) */}
      <div className="relative z-40">
        <ScrollytellingPortfolio />
      </div>

      {/* The Lighthouse Roast Lead Magnet (Phase 3) */}
      <div className="relative z-30">
        <PerformanceAudit />
      </div>

      {/* The Living Agent Chatbot (Phase 4) */}
      <div className="relative z-20">
        <AgentChat />
      </div>

      {/* Image Trail Section */}
      <div className="relative z-20">
        <ImageTrail />
      </div>

      {/* Horizontal Scrollytelling Gallery */}
      <div className="relative z-20">
        <HorizontalGallery />
      </div>

      {/* Our Team Section */}
      <section className="relative w-full z-20 pt-20 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[var(--foreground)]">
              Our Team
            </h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full" />
            <p className="text-xs sm:text-sm text-[var(--foreground)]/60 max-w-md font-medium">
              The masterminds behind the zero-gravity autonomous marketing ecosystem.
            </p>
          </div>

          <TeamShowcase />
        </div>
      </section>
    </div>
  );
}

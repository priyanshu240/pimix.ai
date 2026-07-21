"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function ZeroGravityIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if the user has already seen the intro in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setStage(4); // Skip intro completely
      onComplete(); // Immediately trigger completion if skipped
      return;
    }

    setStage(1); // Start Stage 1

    // Stage 1: Preloader Progress Simulation
    let start = Date.now();
    const duration = 2500; // 2.5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setStage(2); // Move to Stage 2 (Modal)
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  const playSciFiSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Main oscillator for the "warp/engage" tone
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Sci-fi sweeping pitch
      osc.type = "sine";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.6);

      // Amplitude envelope (fade in and out)
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      // Gracefully ignore if audio context is blocked by browser policies
      console.log("Audio not supported or blocked");
    }
  };

  const handleEnterExperience = () => {
    playSciFiSound();
    setStage(3); // Stage 3: Exit animation
    sessionStorage.setItem("hasSeenIntro", "true");
    
    // Call onComplete after the exit animation completes (1 second)
    setTimeout(() => {
      setStage(4); // Hidden
      onComplete();
    }, 1000);
  };

  // If stage is 4, don't render anything
  if (stage === 4 || stage === 0) return null;

  return (
    <AnimatePresence>
      {(stage === 1 || stage === 2 || stage === 3) && (
        <motion.div
          key="zero-gravity-container"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#02000a] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={stage === 3 ? { opacity: 0, transition: { duration: 0.8, delay: 0.2 } } : { opacity: 1 }}
        >
          {/* Animated Background Gradients (Zero Gravity Feel) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
              animate={{ 
                x: [0, 50, -30, 0], 
                y: [0, -50, 20, 0] 
              }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"
              animate={{ 
                x: [0, -40, 20, 0], 
                y: [0, 40, -30, 0] 
              }}
              transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            />
          </div>

          <AnimatePresence mode="wait">
            {/* STAGE 1: PRELOADER */}
            {stage === 1 && (
              <motion.div
                key="stage-1"
                className="relative z-10 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Levitating Orb Particle */}
                <motion.div
                  className="w-16 h-16 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.8)] flex items-center justify-center mb-8"
                  animate={{ y: [-15, 15] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 2, 
                    ease: "easeInOut" 
                  }}
                >
                  <Sparkles className="w-6 h-6 text-black" />
                </motion.div>

                {/* Progress Text */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-mono tracking-[0.3em] uppercase text-white/50">
                    Initializing Zero-G Environment...
                  </span>
                  <div className="font-display text-4xl font-extrabold text-white">
                    {progress}%
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 2 & 3: MODAL */}
            {(stage === 2 || stage === 3) && (
              <motion.div
                key="stage-2"
                className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg px-6"
                initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
                animate={stage === 3 
                  ? { opacity: 0, y: -200, filter: "blur(20px)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } } 
                  : { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } }
                }
              >
                {/* Floating Modal (CSS/Framer Float Effect) */}
                <motion.div
                  className="w-full glass-panel border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-md"
                  animate={stage === 2 ? { y: [-10, 10] } : {}}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 4, 
                    ease: "easeInOut" 
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  
                  <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
                    Welcome to <span className="text-gradient">piMix</span>
                  </h2>
                  
                  <p className="text-white/70 font-medium text-sm md:text-base leading-relaxed mb-10 max-w-xs">
                    Prepare to experience an autonomous zero-gravity marketing ecosystem.
                  </p>

                  <button
                    onClick={handleEnterExperience}
                    className="group relative w-full overflow-hidden rounded-xl bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    Enter Experience
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

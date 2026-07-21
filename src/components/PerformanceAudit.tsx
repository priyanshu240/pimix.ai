"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Flame, AlertTriangle, CheckCircle, XCircle, Search, Activity, Cpu, Zap, ShieldAlert, ArrowRight } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

type AuditState = "idle" | "scanning" | "results";

export default function PerformanceAudit() {
  const [url, setUrl] = useState("");
  const [auditState, setAuditState] = useState<AuditState>("idle");
  const [scanStep, setScanStep] = useState(0);
  const content = useContent();

  const startAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setAuditState("scanning");
    setScanStep(0);

    // Simulate scanning sequence
    const steps = 4;
    for (let i = 1; i <= steps; i++) {
      setTimeout(() => {
        setScanStep(i);
        if (i === steps) {
          setTimeout(() => setAuditState("results"), 800);
        }
      }, i * 1200); // Wait a bit longer for each step to build suspense
    }
  };

  const scanLabels = [
    "Initializing Headless Engine...",
    "Analyzing DOM Tree & CSS Object Model...",
    "Executing Lighthouse Protocols...",
    "Calculating Paint Times & TTI...",
    "Finalizing Performance Report..."
  ];

  let displayHost = url;
  try {
    if (url.startsWith("http")) {
      displayHost = new URL(url).hostname;
    }
  } catch (e) {
    displayHost = url;
  }

  return (
    <section className="relative w-full pt-56 pb-32 bg-transparent overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0 opacity-40">
         {/* Grid Background */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center">
        
        <div className="text-center mb-16">
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Flame className="w-4 h-4" />
            {content.roast.badge}
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter mb-6">
            {content.roast.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">{content.roast.titleHighlight}</span>
          </h2>
          
          <p className="text-zinc-400 max-w-2xl mx-auto mb-12">
            {content.roast.description}
          </p>
        </div>

        <div className="w-full max-w-2xl glass-panel rounded-3xl p-2 md:p-8 relative min-h-[300px] flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            
            {/* IDLE STATE */}
            {auditState === "idle" && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full px-4 py-8"
              >
                <form onSubmit={startAudit} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <input 
                      type="text"
                      required
                      placeholder="e.g. your-competitor.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 text-white rounded-2xl pl-14 pr-4 py-4 md:py-5 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-white text-black px-8 py-4 md:py-5 rounded-2xl font-bold hover:bg-zinc-200 transition-colors whitespace-nowrap shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    Run Audit
                  </button>
                </form>
              </motion.div>
            )}

            {/* SCANNING STATE */}
            {auditState === "scanning" && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col items-center justify-center py-12"
              >
                <div className="relative w-24 h-24 mb-8">
                  {/* Rotating rings */}
                  <div className="absolute inset-0 border-2 border-red-500/20 rounded-full" />
                  <div className="absolute inset-0 border-2 border-t-red-500 rounded-full animate-spin" style={{ animationDuration: '1s' }} />
                  <div className="absolute inset-2 border-2 border-orange-500/20 rounded-full" />
                  <div className="absolute inset-2 border-2 border-b-orange-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-red-400">
                    {Math.min(100, Math.round((scanStep / 4) * 100))}%
                  </div>
                </div>

                <div className="h-8 overflow-hidden flex flex-col items-center justify-center font-mono text-sm text-zinc-400 text-center px-4">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={scanStep}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                    >
                      {scanLabels[scanStep]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* RESULTS STATE */}
            {auditState === "results" && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full p-4 md:p-6"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  
                  {/* Score Ring */}
                  <div className="flex flex-col items-center gap-2 shrink-0 mx-auto md:mx-0">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                       {/* Background circle */}
                       <svg className="w-full h-full transform -rotate-90">
                         <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                         {/* Foreground circle (approx 32% of 351 circumference) = ~112. We stroke-dasharray="351" and stroke-dashoffset="239" */}
                         <motion.circle 
                           cx="64" cy="64" r="56" 
                           stroke="currentColor" 
                           strokeWidth="8" 
                           fill="transparent" 
                           strokeDasharray="351" 
                           initial={{ strokeDashoffset: 351 }}
                           animate={{ strokeDashoffset: 239 }}
                           transition={{ duration: 1.5, ease: "easeOut" }}
                           className="text-red-500" 
                           strokeLinecap="round"
                         />
                       </svg>
                       <div className="absolute flex flex-col items-center justify-center">
                         <span className="text-4xl font-display font-black text-red-500 leading-none">32</span>
                       </div>
                    </div>
                    <span className="font-mono text-xs text-red-500 uppercase tracking-widest font-bold">Performance</span>
                  </div>

                  {/* Roast Data */}
                  <div className="flex-1 space-y-5">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Report: <span className="text-zinc-400">{displayHost || "Unknown URL"}</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <Zap className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-red-400 font-bold text-sm">LCP: 4.8s (Critical)</div>
                          <div className="text-zinc-400 text-xs mt-1">Your users are leaving before the hero image even finishes loading.</div>
                        </div>
                      </motion.div>
                      
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-orange-400 font-bold text-sm">Unused JavaScript: 1.2MB</div>
                          <div className="text-zinc-400 text-xs mt-1">Bloated framework detected. This is killing your mobile conversion rate.</div>
                        </div>
                      </motion.div>

                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }} className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-yellow-400 font-bold text-sm">DOM Size: 2,450 Nodes</div>
                          <div className="text-zinc-400 text-xs mt-1">Spaghetti code architecture. The browser is struggling to render your layouts.</div>
                        </div>
                      </motion.div>
                    </div>

                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 }}
                      onClick={() => { setAuditState("idle"); setUrl(""); }}
                      className="mt-6 group flex items-center gap-2 text-white bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform w-max shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                    >
                      Let piMix Fix This
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}

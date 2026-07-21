"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHARS = "!@#$%^&*()_+{}[]|:;?/><~`";

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"typing" | "glitching" | "done">("typing");
  const [displayText, setDisplayText] = useState("");
  const fullText = "> system.initialize();\n> building_the_web...";

  // Typing effect
  useEffect(() => {
    if (phase !== "typing") return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("glitching"), 500); // Wait half a second before glitching
      }
    }, 40); // typing speed

    return () => clearInterval(interval);
  }, [phase]);

  // Glitch effect
  useEffect(() => {
    if (phase !== "glitching") return;

    let iteration = 0;
    const maxIterations = 20;

    const interval = setInterval(() => {
      setDisplayText(
        fullText
          .split("")
          .map((char) => {
            if (char === "\n" || char === " ") return char;
            return Math.random() > 0.5 ? char : CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      iteration++;
      if (iteration > maxIterations) {
        clearInterval(interval);
        setPhase("done");
        setTimeout(onComplete, 400); // give it a moment before unmounting
      }
    }, 50);

    return () => clearInterval(interval);
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro-sequence"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] text-[#00ffcc] font-mono text-xl sm:text-2xl md:text-4xl p-8"
        >
          <div className="w-full max-w-3xl text-left">
            <pre className="whitespace-pre-wrap tracking-wider leading-relaxed shadow-lg">
              {displayText}
              {phase === "typing" && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-3 h-6 sm:h-8 bg-[#00ffcc] ml-1 align-middle"
                />
              )}
            </pre>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

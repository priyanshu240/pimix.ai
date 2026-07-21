"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CHARS = "!@#$%^&*()_+{}[]|:;?/><~`";

interface AsciiGlitchTextProps {
  text: string;
  textClassName?: string;
}

export default function AsciiGlitchText({ text, textClassName }: AsciiGlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isHovered) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const maxIterations = text.length * 4;

    const animate = () => {
      setDisplayText((prev) =>
        prev
          .split("")
          .map((char, index) => {
            // If the ripple has passed this character, return the original
            if (index < iteration / 4 - 2) {
              return text[index];
            }
            // If the ripple hasn't reached it yet, leave it as is (or also scramble it)
            if (index > iteration / 4 + 4) {
              return text[index];
            }
            // Otherwise, it's in the "ripple zone" – scramble it!
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      iteration++;

      if (iteration < maxIterations) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHovered, text]);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-crosshair select-none"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <h1 
        className={`font-display font-extrabold tracking-tighter uppercase leading-none ${textClassName || "text-[12vw] text-[var(--foreground)]"}`}
        style={{
          textShadow: `
            3px 3px 0px var(--background),
            6px 6px 0px var(--primary),
            9px 9px 0px rgba(0,0,0,0.5),
            12px 12px 20px rgba(0,0,0,0.3)
          `
        }}
      >
        {displayText}
      </h1>
    </motion.div>
  );
}

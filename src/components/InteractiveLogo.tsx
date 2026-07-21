"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function InteractiveLogo() {
  const letters = ["p", "i", "M", "i", "x"];
  
  return (
    <div className="flex justify-center select-none perspective-1000">
      {letters.map((char, index) => (
        <Letter key={index} char={char} />
      ))}
    </div>
  );
}

function Letter({ char }: { char: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  
  // Spring settings for super smooth, springy physics
  const springConfig = { damping: 15, stiffness: 100, mass: 0.6 };
  
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const x = useSpring(useMotionValue(0), springConfig);
  const y = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Limit interaction radius to 600px
      if (distance < 600) {
        const intensity = (600 - distance) / 600; // 1 at center, 0 at edge
        
        // 3D Tilt: rotate on X and Y axis based on relative mouse position
        rotateX.set(-dy * 0.06 * intensity); // Tilt toward cursor
        rotateY.set(dx * 0.06 * intensity);
        
        // Parallax Offset: shift position slightly
        x.set(dx * 0.02 * intensity);
        y.set(dy * 0.02 * intensity);
      } else {
        // Reset to original position
        rotateX.set(0);
        rotateY.set(0);
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rotateX, rotateY, x, y]);

  return (
    <motion.span
      ref={ref}
      style={{
        rotateX,
        rotateY,
        x,
        y,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ 
        scale: 1.15, 
        z: 40,
        transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 10 }
      }}
      className="font-display text-[15vw] leading-[0.8] font-extrabold uppercase tracking-tighter mix-blend-overlay cursor-pointer text-transparent flex justify-center items-center h-[20vw] sm:h-[16vw]"
    >
      <span 
        className="block select-none"
        style={{
          WebkitTextStroke: "2px rgba(255, 255, 255, 0.75)",
          color: "rgba(255, 255, 255, 0.15)",
          textShadow: `
            0 15px 30px rgba(0, 0, 0, 0.9), 
            0 0 20px rgba(6, 182, 212, 0.25),
            0 0 40px rgba(236, 72, 153, 0.25)
          `
        }}
      >
        {char}
      </span>
    </motion.span>
  );
}

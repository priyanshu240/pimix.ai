"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400",
];

interface TrailImage {
  id: number;
  url: string;
  x: number;
  y: number;
  rotation: number;
}

export default function ImageTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<TrailImage[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const indexRef = useRef(0);
  const idCounter = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastMousePos.current.x;
    const dy = y - lastMousePos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Drop a new image every 100 pixels moved
    if (distance > 100) {
      lastMousePos.current = { x, y };
      
      const newImage: TrailImage = {
        id: idCounter.current++,
        url: images[indexRef.current % images.length],
        x,
        y,
        rotation: Math.random() * 30 - 15,
      };

      setTrail((prev) => [...prev, newImage]);
      indexRef.current++;

      // Remove the image after a delay
      setTimeout(() => {
        setTrail((prev) => prev.filter((img) => img.id !== newImage.id));
      }, 1000);
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[60vh] bg-transparent flex flex-col items-center justify-center overflow-hidden cursor-crosshair"
    >
      <div className="relative z-50 text-center pointer-events-none mix-blend-difference text-white select-none">
        <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight">
          Leave a mark
        </h2>
        <p className="mt-4 text-sm sm:text-base font-medium opacity-70">
          Move your cursor across this space
        </p>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {trail.map((item) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute rounded-xl overflow-hidden shadow-2xl pointer-events-none"
              style={{
                left: item.x,
                top: item.y,
                x: "-50%",
                y: "-50%",
                rotate: item.rotation,
                width: "160px",
                height: "220px",
                zIndex: item.id,
              }}
            >
              {/* The image is rendered small and scaled up to create a pixelated look */}
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ 
                  backgroundImage: `url('${item.url}')`,
                  imageRendering: "pixelated",
                  filter: "contrast(120%) saturate(110%) sepia(20%)"
                }}
              />
              <div className="absolute inset-0 border border-white/20 rounded-xl" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

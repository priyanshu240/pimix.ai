"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const images = [
  {
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    startRot: 0,
    endRot: -15,
    startPos: { x: 0, y: 0 },
    endPos: { x: "-40vw", y: "-20vh" },
    width: "250px",
    height: "350px",
  },
  {
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600",
    startRot: 0,
    endRot: 20,
    startPos: { x: 0, y: 0 },
    endPos: { x: "40vw", y: "-30vh" },
    width: "280px",
    height: "280px",
  },
  {
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600",
    startRot: 0,
    endRot: -25,
    startPos: { x: 0, y: 0 },
    endPos: { x: "-30vw", y: "30vh" },
    width: "220px",
    height: "300px",
  },
  {
    url: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&q=80&w=600",
    startRot: 0,
    endRot: 10,
    startPos: { x: 0, y: 0 },
    endPos: { x: "35vw", y: "25vh" },
    width: "260px",
    height: "360px",
  },
  {
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=600",
    startRot: 0,
    endRot: -5,
    startPos: { x: 0, y: 0 },
    endPos: { x: "-10vw", y: "-35vh" },
    width: "200px",
    height: "250px",
  },
  {
    url: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=600",
    startRot: 0,
    endRot: 15,
    startPos: { x: 0, y: 0 },
    endPos: { x: "15vw", y: "35vh" },
    width: "240px",
    height: "240px",
  }
];

export default function ImageScatter() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={sectionRef} className="relative w-full h-[300vh] bg-transparent">
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        
        {/* Central Text with Glassmorphism */}
        <motion.div 
          className="relative z-30 text-center px-8 py-10 sm:px-16 sm:py-12 max-w-3xl pointer-events-none rounded-3xl glass-panel shadow-2xl"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
            scale: useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0.8, 1, 1, 0.8]),
            willChange: "transform, opacity"
          }}
        >
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-[var(--foreground)] leading-tight">
            Each<br />
            moment<br />
            scatters as<br />
            another<br />
            takes its<br />
            place
          </h2>
        </motion.div>

        {/* Scattered Images */}
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          {images.map((img, idx) => {
            // Fast scatter over [0, 0.3], then slowly drift further over [0.3, 1] to keep in motion without lagging
            const x = useTransform(scrollYProgress, [0, 0.3, 1], [
              img.startPos.x, 
              img.endPos.x, 
              `calc(${img.endPos.x} * 1.3)`
            ]);
            const y = useTransform(scrollYProgress, [0, 0.3, 1], [
              img.startPos.y, 
              img.endPos.y, 
              `calc(${img.endPos.y} * 1.3)`
            ]);
            const rotate = useTransform(scrollYProgress, [0, 1], [img.startRot, img.endRot * 1.5]);
            const scale = useTransform(scrollYProgress, [0, 0.2, 1], [0.3, 1, 1.1]);
            const opacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);

            return (
              <motion.div
                key={idx}
                className="absolute rounded-2xl overflow-hidden border-[8px] border-[#151515] shadow-2xl"
                style={{
                  width: img.width,
                  height: img.height,
                  x,
                  y,
                  rotate,
                  scale,
                  opacity,
                  willChange: "transform, opacity"
                }}
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${img.url}')` }}
                />
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}

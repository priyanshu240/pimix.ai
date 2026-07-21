"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const images = [
  {
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
    title: "DIGITAL MASTERY",
    desc: "Engineering the impossible."
  },
  {
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200",
    title: "PERFORMANCE",
    desc: "Speed that converts."
  },
  {
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200",
    title: "AESTHETICS",
    desc: "Design that demands attention."
  },
  {
    url: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&q=80&w=1200",
    title: "INNOVATION",
    desc: "Always one step ahead."
  }
];

export default function HorizontalGallery() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate the total track width translation based on the number of items
  // Since we have an intro block and 4 massive images, -80% brings the last item into view
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-transparent">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-16 px-[10vw] items-center h-full">
          
          {/* Intro Title Block */}
          <div className="w-[80vw] sm:w-[40vw] flex-shrink-0 flex flex-col justify-center">
            <h2 className="font-display text-6xl sm:text-8xl md:text-9xl font-extrabold text-white tracking-tighter uppercase leading-[0.9]">
              Selected <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Works</span>
            </h2>
            <p className="text-white/50 font-mono tracking-[0.3em] mt-8 uppercase text-sm">
              Scroll to explore &rarr;
            </p>
          </div>

          {/* Image Cards */}
          {images.map((img, idx) => {
            return (
              <div 
                key={idx} 
                className="group relative w-[85vw] sm:w-[60vw] h-[60vh] sm:h-[75vh] flex-shrink-0 flex flex-col justify-end overflow-hidden rounded-[2rem] bg-[#111] border border-white/10"
              >
                
                {/* Background Image with Hover Scale */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-100"
                  style={{ backgroundImage: `url('${img.url}')` }}
                />
                
                {/* Deep gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-1000 group-hover:opacity-90" />
                
                {/* Text Overlay */}
                <div className="relative z-10 p-12 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                  <h3 className="font-display text-5xl sm:text-6xl font-extrabold text-white tracking-tighter uppercase drop-shadow-2xl">
                    {img.title}
                  </h3>
                  <p className="text-white/80 font-medium text-lg sm:text-xl mt-3 drop-shadow-md">
                    {img.desc}
                  </p>
                </div>
              </div>
            );
          })}
          
        </motion.div>
      </div>
    </section>
  );
}

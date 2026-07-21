"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

export default function CreatureHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);
  const [hasMoved, setHasMoved] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse values for parallax
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Move the creature towards the cursor slightly (parallax)
  const moveX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
  const moveY = useTransform(smoothMouseY, [-0.5, 0.5], [-30, 30]);
  // Keep a bit of 3D tilt
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);

  useEffect(() => {
    let animationFrameId: number;
    let currentMouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;

      mouseX.set(x / rect.width);
      mouseY.set(y / rect.height);
      
      currentMouse = { x: e.clientX, y: e.clientY };
      if (!hasMoved) setHasMoved(true);
    };

    const updateLaser = () => {
      if (hasMoved && eyeRef.current && laserRef.current) {
        const eyeRect = eyeRef.current.getBoundingClientRect();
        // Calculate the exact screen position of the eyes
        const originX = eyeRect.left + eyeRect.width / 2;
        const originY = eyeRect.top + eyeRect.height / 2;

        const dx = currentMouse.x - originX;
        const dy = currentMouse.y - originY;
        const distance = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Directly update DOM for maximum performance and perfect sync
        laserRef.current.style.width = `${distance}px`;
        laserRef.current.style.transform = `rotate(${angle}deg)`;
        laserRef.current.style.left = `${originX}px`;
        laserRef.current.style.top = `${originY}px`;
      }
      animationFrameId = requestAnimationFrame(updateLaser);
    };

    window.addEventListener("mousemove", handleMouseMove);
    updateLaser();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY, hasMoved]);

  return (
    <div 
      className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden"
      ref={containerRef}
      style={{ perspective: 1000 }}
    >
      {/* Continuous Laser Beam - Positioned fixed to viewport but inside container */}
      {hasMoved && (
        <div
          ref={laserRef}
          className="fixed z-10 pointer-events-none"
          style={{
            height: '4px',
            backgroundColor: '#ff003c',
            boxShadow: '0 0 20px #ff003c, 0 0 40px #ff003c, 0 0 60px #ff003c',
            transformOrigin: 'left center',
            opacity: 0.9,
            top: 0,
            left: 0,
            willChange: 'transform, width, top, left'
          }}
        />
      )}

      {/* Floating and Tracking Creature */}
      <motion.div
        className="w-full h-full max-w-2xl max-h-[80vh] flex items-center justify-center relative"
        animate={{
          y: [0, -20, 0], // Floating animation
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          x: moveX,
          y: moveY,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        <img 
          src="/creature_bg.png" 
          alt="Creature Background" 
          className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,0,0,0.3)] opacity-90" 
          style={{ 
            transform: "translateZ(50px)",
            WebkitMaskImage: "radial-gradient(circle at center, black 35%, transparent 65%)",
            maskImage: "radial-gradient(circle at center, black 35%, transparent 65%)"
          }}
        />

        {/* Invisible Eye Target - positioned where the eyes roughly are */}
        <div 
          ref={eyeRef}
          className="absolute w-4 h-4 bg-transparent"
          style={{ 
            top: '52%', 
            left: '50%', 
            transform: 'translate(-50%, -50%) translateZ(50px)' 
          }} 
        />
        
        {/* Glow effect that tracks the mouse slightly */}
        <motion.div 
           className="absolute inset-0 bg-red-500/10 rounded-full blur-[100px] pointer-events-none"
           style={{
             x: useTransform(smoothMouseX, [-0.5, 0.5], [-50, 50]),
             y: useTransform(smoothMouseY, [-0.5, 0.5], [-50, 50]),
             transform: "translateZ(-20px)"
           }}
        />
      </motion.div>
    </div>
  );
}

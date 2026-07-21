"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollThemeBackground() {
  const { scrollYProgress } = useScroll();

  // Smoothly interpolate the global background color based on vertical scroll progress.
  // 0.0: Top (Hero) -> Pure Black
  // 0.2: Interactive Sandbox -> Deep Slate / Midnight Blue
  // 0.5: Scrollytelling Portfolio -> Pure Black
  // 0.8: Performance Roast -> Deep Burgundy / Dark Red
  // 1.0: Footer/Agent -> Pure Black
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [
      "#000000", 
      "#020617", 
      "#000000", 
      "#1a0505", 
      "#000000"
    ]
  );

  return (
    <motion.div
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ backgroundColor }}
    />
  );
}

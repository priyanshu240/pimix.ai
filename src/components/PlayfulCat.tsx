"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

type CatState = "hidden" | "peeking" | "walking" | "sitting" | "running";

export default function PlayfulCat() {
  const controls = useAnimation();
  const [catState, setCatState] = useState<CatState>("hidden");
  const stateRef = useRef<CatState>("hidden");
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const updateState = (newState: CatState) => {
    setCatState(newState);
    stateRef.current = newState;
  };
  
  // Define animation variants
  const variants = {
    hidden: { x: -80, opacity: 0, scaleX: 1 },
    peeking: { x: -30, opacity: 1, scaleX: 1, transition: { duration: 0.8, ease: "easeOut" } },
    walking: { x: 80, opacity: 1, scaleX: 1, transition: { duration: 1.5, ease: "linear" } },
    sitting: { x: 80, opacity: 1, scaleX: 1 },
    running: { x: -80, opacity: 0, scaleX: -1, transition: { duration: 0.6, ease: "easeIn" } }, // Flipped to run backwards
  };

  const tailVariants = {
    wag: { rotate: [0, 15, -10, 0], transition: { duration: 1.5, repeat: Infinity } },
    sit: { rotate: -40, transition: { duration: 0.3 } },
    still: { rotate: 0 }
  };

  const bodyVariants = {
    bob: { y: [0, -3, 0], transition: { duration: 0.3, repeat: Infinity } },
    sit: { y: 5, transition: { duration: 0.3 } },
    still: { y: 0 }
  };

  const legVariants = {
    walkingFront: { rotate: [0, 20, -20, 0], scaleY: 1, y: 0, transition: { duration: 0.3, repeat: Infinity } },
    walkingBack: { rotate: [0, -20, 20, 0], scaleY: 1, y: 0, transition: { duration: 0.3, repeat: Infinity, delay: 0.15 } },
    sittingFront: { rotate: 0, scaleY: 0.3, y: 1, transition: { duration: 0.3 } },
    sittingBack: { rotate: -75, scaleY: 0.4, y: 1, x: 1, transition: { duration: 0.3 } },
    still: { rotate: 0, scaleY: 1, y: 0 }
  };

  const handleScare = async () => {
    if (!isMounted.current || stateRef.current === "running" || stateRef.current === "hidden") return;
    updateState("running");
    await controls.start("running");
    if (!isMounted.current) return;
    updateState("hidden");
  };

  useEffect(() => {
    let activeTimeoutId: NodeJS.Timeout | null = null;

    const runSequence = async () => {
      if (!isMounted.current) return;
      
      // 1. Peek
      updateState("peeking");
      await controls.start("peeking");
      
      // Wait 1.5 seconds peeking
      await new Promise(r => setTimeout(r, 1500));
      if (!isMounted.current || stateRef.current === "running" || stateRef.current === "hidden") return;
      
      // 2. Walk
      updateState("walking");
      await controls.start("walking");
      
      if (!isMounted.current || stateRef.current === "running" || stateRef.current === "hidden") return;
      
      // 3. Sit
      updateState("sitting");
      await controls.start("sitting");
      
      // Sit for 5 seconds
      await new Promise(r => setTimeout(r, 5000));
      if (!isMounted.current || stateRef.current === "running" || stateRef.current === "hidden") return;
      
      // 4. Run away
      await handleScare();
    };

    const loop = () => {
      if (!isMounted.current) return;
      
      const randomDelay = Math.random() * 10000 + 5000; // 5-15s
      activeTimeoutId = setTimeout(async () => {
        await runSequence();
        // Setup next loop only AFTER the previous cat has fully completed its lifecycle
        loop();
      }, randomDelay);
    };

    loop();

    return () => {
      if (activeTimeoutId) clearTimeout(activeTimeoutId);
    };
  }, [controls]);

  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 left-full ml-4 z-10 cursor-pointer hidden md:block"
      initial="hidden"
      animate={controls}
      variants={variants}
      onMouseEnter={handleScare} // Run away on hover
      title="Meow!"
    >
      <div className="relative text-gray-500 hover:text-gray-300 transition-colors">
        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tail */}
          <motion.g
            animate={catState === "walking" || catState === "peeking" ? "wag" : (catState === "sitting" ? "sit" : "still")}
            variants={tailVariants}
            style={{ originX: "10px", originY: "20px" }}
          >
            <path d="M10 20 Q 2 20 4 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </motion.g>

          {/* Bobbing Body parts */}
          <motion.g
            animate={catState === "walking" || catState === "running" ? "bob" : (catState === "sitting" ? "sit" : "still")}
            variants={bodyVariants}
          >
            {/* Body */}
            <rect x="8" y="16" width="22" height="14" rx="7" fill="currentColor" />
            
            {/* Front Leg */}
            <motion.rect 
               x="24" y="25" width="4" height="10" rx="2" fill="currentColor" 
               animate={
                 catState === "walking" || catState === "running" 
                   ? "walkingFront" 
                   : (catState === "sitting" ? "sittingFront" : "still")
               }
               variants={legVariants}
               style={{ originX: "26px", originY: "25px" }}
            />
            {/* Back Leg */}
            <motion.rect 
               x="10" y="25" width="4" height="10" rx="2" fill="currentColor" 
               animate={
                 catState === "walking" || catState === "running" 
                   ? "walkingBack" 
                   : (catState === "sitting" ? "sittingBack" : "still")
               }
               variants={legVariants}
               style={{ originX: "12px", originY: "25px" }}
            />
            
            {/* Head */}
            <circle cx="28" cy="14" r="7" fill="currentColor" />
            {/* Left Ear */}
            <polygon points="23,9 25,2 29,8" fill="currentColor" />
            {/* Right Ear */}
            <polygon points="28,7 33,3 34,10" fill="currentColor" />
            
            {/* Eyes */}
            <circle cx="30" cy="13" r="1.5" fill="#000" />
            <circle cx="33" cy="13" r="1.5" fill="#000" />
          </motion.g>
        </svg>
      </div>
    </motion.div>
  );
}

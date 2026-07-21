"use client";

import React, { useRef, useEffect } from "react";

interface Point {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
}

export default function InteractiveSVGLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Define points for all letters in a 500x150 coordinate space
  // We use references so we can mutate coordinates directly at 60fps
  const pointsRef = useRef<{ [key: string]: Point }>({
    // 'p' Stem
    p_s0: { x: 50, y: 30, baseX: 50, baseY: 30, vx: 0, vy: 0 },
    p_s1: { x: 50, y: 65, baseX: 50, baseY: 65, vx: 0, vy: 0 },
    p_s2: { x: 50, y: 100, baseX: 50, baseY: 100, vx: 0, vy: 0 },
    // 'p' Loop
    p_l0: { x: 50, y: 30, baseX: 50, baseY: 30, vx: 0, vy: 0 },
    p_l1: { x: 90, y: 30, baseX: 90, baseY: 30, vx: 0, vy: 0 },
    p_l2: { x: 90, y: 65, baseX: 90, baseY: 65, vx: 0, vy: 0 },
    p_l3: { x: 50, y: 65, baseX: 50, baseY: 65, vx: 0, vy: 0 },

    // 'i' Dot
    i1_d: { x: 120, y: 30, baseX: 120, baseY: 30, vx: 0, vy: 0 },
    // 'i' Stem
    i1_s0: { x: 120, y: 50, baseX: 120, baseY: 50, vx: 0, vy: 0 },
    i1_s1: { x: 120, y: 75, baseX: 120, baseY: 75, vx: 0, vy: 0 },
    i1_s2: { x: 120, y: 100, baseX: 120, baseY: 100, vx: 0, vy: 0 },

    // 'M' ZigZag
    m_0: { x: 160, y: 100, baseX: 160, baseY: 100, vx: 0, vy: 0 },
    m_1: { x: 160, y: 30, baseX: 160, baseY: 30, vx: 0, vy: 0 },
    m_2: { x: 200, y: 75, baseX: 200, baseY: 75, vx: 0, vy: 0 },
    m_3: { x: 240, y: 30, baseX: 240, baseY: 30, vx: 0, vy: 0 },
    m_4: { x: 240, y: 100, baseX: 240, baseY: 100, vx: 0, vy: 0 },

    // 'i' (second) Dot
    i2_d: { x: 280, y: 30, baseX: 280, baseY: 30, vx: 0, vy: 0 },
    // 'i' (second) Stem
    i2_s0: { x: 280, y: 50, baseX: 280, baseY: 50, vx: 0, vy: 0 },
    i2_s1: { x: 280, y: 75, baseX: 280, baseY: 75, vx: 0, vy: 0 },
    i2_s2: { x: 280, y: 100, baseX: 280, baseY: 100, vx: 0, vy: 0 },

    // 'x' Diagonal 1
    x_d1_0: { x: 310, y: 35, baseX: 310, baseY: 35, vx: 0, vy: 0 },
    x_d1_1: { x: 335, y: 65, baseX: 335, baseY: 65, vx: 0, vy: 0 },
    x_d1_2: { x: 360, y: 100, baseX: 360, baseY: 100, vx: 0, vy: 0 },
    // 'x' Diagonal 2
    x_d2_0: { x: 360, y: 35, baseX: 360, baseY: 35, vx: 0, vy: 0 },
    x_d2_1: { x: 335, y: 65, baseX: 335, baseY: 65, vx: 0, vy: 0 },
    x_d2_2: { x: 310, y: 100, baseX: 310, baseY: 100, vx: 0, vy: 0 },
  });

  // Track mouse coordinates relative to the SVG container
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      
      // Map screen mouse position to SVG viewBox (0-500 scale)
      const scaleX = 420 / rect.width;
      const scaleY = 130 / rect.height;

      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Dynamic animation loop at 60fps
    let animId: number;
    const physicsLoop = () => {
      const points = pointsRef.current;
      const mouse = mouseRef.current;

      const radius = 90; // Attraction field radius
      const pullFactor = 0.55; // Magnetic pull strength
      const springTension = 0.08; // Return strength
      const damping = 0.82; // Friction

      // 1. Calculate physics for all control points
      for (const key in points) {
        const p = points[key];
        
        // Calculate distance to mouse
        const dx = mouse.x - p.baseX;
        const dy = mouse.y - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = p.baseX;
        let targetY = p.baseY;

        if (dist < radius) {
          const force = (radius - dist) / radius; // 1 at center, 0 at edge
          targetX = p.baseX + dx * force * pullFactor;
          targetY = p.baseY + dy * force * pullFactor;
        }

        // Spring animation formula
        const ax = (targetX - p.x) * springTension;
        const ay = (targetY - p.y) * springTension;

        p.vx = (p.vx + ax) * damping;
        p.vy = (p.vy + ay) * damping;

        p.x += p.vx;
        p.y += p.vy;
      }

      // 2. Direct DOM mutation of the path attributes for absolute smoothness
      if (svgRef.current) {
        // 'p' Path
        const pPath = svgRef.current.querySelector("#path-p");
        if (pPath) {
          pPath.setAttribute(
            "d",
            `M ${points.p_s0.x} ${points.p_s0.y} 
             L ${points.p_s1.x} ${points.p_s1.y} 
             L ${points.p_s2.x} ${points.p_s2.y} 
             M ${points.p_l0.x} ${points.p_l0.y} 
             C ${points.p_l1.x} ${points.p_l1.y}, ${points.p_l2.x} ${points.p_l2.y}, ${points.p_l3.x} ${points.p_l3.y}`
          );
        }

        // 'i' Path 1
        const i1Path = svgRef.current.querySelector("#path-i1");
        const i1Dot = svgRef.current.querySelector("#dot-i1");
        if (i1Path) {
          i1Path.setAttribute(
            "d",
            `M ${points.i1_s0.x} ${points.i1_s0.y} 
             L ${points.i1_s1.x} ${points.i1_s1.y} 
             L ${points.i1_s2.x} ${points.i1_s2.y}`
          );
        }
        if (i1Dot) {
          i1Dot.setAttribute("cx", points.i1_d.x.toString());
          i1Dot.setAttribute("cy", points.i1_d.y.toString());
        }

        // 'M' Path
        const mPath = svgRef.current.querySelector("#path-m");
        if (mPath) {
          mPath.setAttribute(
            "d",
            `M ${points.m_0.x} ${points.m_0.y} 
             C ${points.m_0.x} ${points.m_0.y}, ${points.m_1.x} ${points.m_1.y}, ${points.m_1.x} ${points.m_1.y}
             L ${points.m_2.x} ${points.m_2.y} 
             L ${points.m_3.x} ${points.m_3.y}
             C ${points.m_3.x} ${points.m_3.y}, ${points.m_4.x} ${points.m_4.y}, ${points.m_4.x} ${points.m_4.y}`
          );
        }

        // 'i' Path 2
        const i2Path = svgRef.current.querySelector("#path-i2");
        const i2Dot = svgRef.current.querySelector("#dot-i2");
        if (i2Path) {
          i2Path.setAttribute(
            "d",
            `M ${points.i2_s0.x} ${points.i2_s0.y} 
             L ${points.i2_s1.x} ${points.i2_s1.y} 
             L ${points.i2_s2.x} ${points.i2_s2.y}`
          );
        }
        if (i2Dot) {
          i2Dot.setAttribute("cx", points.i2_d.x.toString());
          i2Dot.setAttribute("cy", points.i2_d.y.toString());
        }

        // 'x' Path
        const xPath = svgRef.current.querySelector("#path-x");
        if (xPath) {
          xPath.setAttribute(
            "d",
            `M ${points.x_d1_0.x} ${points.x_d1_0.y} 
             Q ${points.x_d1_1.x} ${points.x_d1_1.y} ${points.x_d1_2.x} ${points.x_d1_2.y}
             M ${points.x_d2_0.x} ${points.x_d2_0.y} 
             Q ${points.x_d2_1.x} ${points.x_d2_1.y} ${points.x_d2_2.x} ${points.x_d2_2.y}`
          );
        }
      }

      animId = requestAnimationFrame(physicsLoop);
    };

    physicsLoop();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full flex justify-center py-6 select-none mix-blend-difference">
      <svg
        ref={svgRef}
        viewBox="0 0 420 130"
        className="w-[90%] max-w-4xl h-auto pointer-events-auto"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* Dynamic interconnected glowing vector paths */}
        <g
          stroke="url(#neonGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#glow)"
        >
          <path id="path-p" />
          <circle id="dot-i1" r="4.5" fill="url(#neonGradient)" stroke="none" />
          <path id="path-i1" />
          <path id="path-m" />
          <circle id="dot-i2" r="4.5" fill="url(#neonGradient)" stroke="none" />
          <path id="path-i2" />
          <path id="path-x" />
        </g>
      </svg>
    </div>
  );
}

"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export default function SceneCanvas({ children, className = "" }: SceneCanvasProps) {
  return (
    <div className={`canvas-container ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "auto" }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}

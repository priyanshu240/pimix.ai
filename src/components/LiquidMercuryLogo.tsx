"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function LiquidMercuryLogo() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6 select-none relative h-[25vh]">
      {/* 3D Liquid Mercury Canvas */}
      <div className="w-full h-full absolute inset-0 z-0 pointer-events-auto">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4.5], fov: 45 }}>
          <LiquidBlob />
        </Canvas>
      </div>

      {/* Typography Overlay - position absolutely in center */}
      <div className="relative z-10 pointer-events-none flex flex-col items-center">
        <h2 
          className="font-display text-8xl sm:text-9xl md:text-[10rem] font-extrabold tracking-tighter mix-blend-overlay"
          style={{
            color: "rgba(255, 255, 255, 0.12)",
            WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.5)",
            textShadow: "0 20px 40px rgba(0, 0, 0, 0.9)"
          }}
        >
          piMix
        </h2>
      </div>
    </div>
  );
}

function LiquidBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);
  const light3 = useRef<THREE.PointLight>(null);

  // Detail level 4 for smooth liquid ripples
  const detail = 4;
  const baseGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.2, detail), []);
  const originalPositions = useMemo(() => {
    return baseGeometry.attributes.position.clone();
  }, [baseGeometry]);

  // Track mouse coordinates for physical pull
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { pointer } = state;

    // Orbiting point lights to simulate liquid chrome reflections
    if (light1.current) {
      light1.current.position.x = Math.sin(time * 1.5) * 3;
      light1.current.position.y = Math.cos(time * 1.2) * 3;
      light1.current.position.z = Math.sin(time * 0.9) * 2;
    }
    if (light2.current) {
      light2.current.position.x = Math.cos(time * 2.0) * 3;
      light2.current.position.y = Math.sin(time * 1.5) * 3;
      light2.current.position.z = Math.cos(time * 1.2) * 2;
    }
    if (light3.current) {
      light3.current.position.x = Math.sin(time * 1.1) * -3;
      light3.current.position.y = Math.cos(time * 1.8) * 3;
      light3.current.position.z = Math.sin(time * 1.4) * -2;
    }

    // Slowly rotate the mesh
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.15;
      meshRef.current.rotation.x = time * 0.08;

      // Scale transition based on pointer proximity
      const distToCenter = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
      targetScale.current = distToCenter < 0.4 ? 1.25 : 1.0;
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, 0.1);
      meshRef.current.scale.setScalar(currentScale.current);

      // Vertex noise deformation (Liquid displacement)
      const geo = meshRef.current.geometry;
      const posAttr = geo.attributes.position;
      const count = posAttr.count;

      // Displacement settings: hover makes the liquid ripple aggressively
      const isHovered = distToCenter < 0.4;
      const amplitude = isHovered ? 0.28 : 0.14;
      const frequency = isHovered ? 3.5 : 2.2;

      for (let i = 0; i < count; i++) {
        const ox = originalPositions.getX(i);
        const oy = originalPositions.getY(i);
        const oz = originalPositions.getZ(i);

        // Vector from center
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const dx = ox / len;
        const dy = oy / len;
        const dz = oz / len;

        // Composed sine-noise wave for liquid mercury ripples
        const wave = 
          Math.sin(ox * frequency + time * 2.5) * 
          Math.cos(oy * frequency + time * 2.2) * 
          Math.sin(oz * frequency + time * 1.8);
          
        const displacement = wave * amplitude;

        posAttr.setXYZ(i, ox + dx * displacement, oy + dy * displacement, oz + dz * displacement);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Background Lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Bright moving neon lights to reflect off the chrome surface */}
      <pointLight ref={light1} intensity={3.5} color="#00ffff" distance={10} /> {/* Cyan */}
      <pointLight ref={light2} intensity={3.5} color="#d946ef" distance={10} /> {/* Magenta */}
      <pointLight ref={light3} intensity={2.5} color="#ffffff" distance={10} /> {/* White highlight */}

      <mesh ref={meshRef} geometry={baseGeometry}>
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.0}       // Perfectly reflective
          metalness={1.0}       // Pure chrome/metal
          clearcoat={1.0}       // High lacquer coating
          clearcoatRoughness={0.0}
          reflectivity={1.0}
          flatShading={false}   // Smooth shading
        />
      </mesh>
    </>
  );
}

"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, TorusKnot, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface ServiceIconCanvasProps {
  type: "llm" | "agents" | "vision";
  hovered: boolean;
}

// 1. LLM Neural Net Sphere Geometry
function LlmIcon({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = hovered ? 1.8 : 0.4;
    
    if (meshRef.current) {
      meshRef.current.rotation.y = t * speed;
      meshRef.current.rotation.x = t * speed * 0.5;
      
      // Floating pulse
      const pulse = 1 + Math.sin(t * (hovered ? 6 : 2)) * (hovered ? 0.08 : 0.03);
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * speed * 1.3;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#8b5cf6" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ec4899" />
      
      {/* Outer Wireframe Sphere */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.5, 14, 14]} />
        <meshBasicMaterial
          color={hovered ? "#ec4899" : "#a78bfa"}
          wireframe={true}
          transparent={true}
          opacity={hovered ? 0.85 : 0.4}
        />
      </mesh>

      {/* Inner Glowing Solid Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshPhysicalMaterial
          color={hovered ? "#8b5cf6" : "#6366f1"}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1.0}
        />
      </mesh>
    </group>
  );
}

// 2. Autonomous Agents Torus Knot
function AgentsIcon({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = hovered ? 2.5 : 0.5;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = t * speed;
      meshRef.current.rotation.y = t * speed * 0.7;
      
      // Pulse scale
      const scaleVal = hovered ? 1.15 : 0.95;
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, scaleVal, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, scaleVal, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, scaleVal, 0.1);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={2.0} color="#06b6d4" />
      <pointLight position={[-3, -3, -3]} intensity={0.8} color="#8b5cf6" />
      
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.85, 0.22, 90, 8]} />
        <meshPhysicalMaterial
          color={hovered ? "#06b6d4" : "#3b82f6"}
          roughness={0.15}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
}

// 3. Vision Icosahedron Geometric Mesh
function VisionIcon({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = hovered ? 2.2 : 0.35;
    
    if (meshRef.current) {
      meshRef.current.rotation.y = t * speed;
      meshRef.current.rotation.z = t * speed * 0.6;
      
      // Geometric breathing
      const scaleVal = hovered ? 1.25 : 1.0;
      meshRef.current.scale.set(scaleVal, scaleVal, scaleVal);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 2, 5]} intensity={1.8} color="#ec4899" />
      <pointLight position={[-5, -2, -5]} intensity={0.6} color="#06b6d4" />
      
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshPhysicalMaterial
          color={hovered ? "#ec4899" : "#d946ef"}
          roughness={0.05}
          metalness={0.95}
          wireframe={!hovered}
          clearcoat={1.0}
        />
      </mesh>
    </group>
  );
}

export default function ServiceIconCanvas({ type, hovered }: ServiceIconCanvasProps) {
  return (
    <div className="w-[130px] h-[130px] relative flex items-center justify-center pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        {type === "llm" && <LlmIcon hovered={hovered} />}
        {type === "agents" && <AgentsIcon hovered={hovered} />}
        {type === "vision" && <VisionIcon hovered={hovered} />}
      </Canvas>
    </div>
  );
}

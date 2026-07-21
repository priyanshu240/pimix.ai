"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MorphGlobeSceneProps {
  activeField: "name" | "email" | "phone" | null;
  textLength: number;
  isValid: boolean;
}

export default function MorphGlobeScene({ activeField, textLength, isValid }: MorphGlobeSceneProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Define original sphere vertices structure for displacement
  const detail = 3; // icosahedron detail level
  const baseGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.6, detail), []);
  const originalPositions = useMemo(() => {
    return baseGeometry.attributes.position.clone();
  }, [baseGeometry]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Determine rotation speed based on text length
    const speedMultiplier = 1 + textLength * 0.08;
    const baseRotationSpeed = time * 0.3 * speedMultiplier;

    // Apply rotation to meshes
    if (coreRef.current) {
      coreRef.current.rotation.y = baseRotationSpeed;
      coreRef.current.rotation.x = baseRotationSpeed * 0.4;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -baseRotationSpeed * 1.2;
      shellRef.current.rotation.z = baseRotationSpeed * 0.6;
    }

    // 2. Animate outer gravity rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.8) * 0.1;
      ring1Ref.current.rotation.y = time * 0.5 * speedMultiplier;
      // Change ring scale depending on focused field
      const targetScale = activeField === "phone" ? 1.4 : 1.15;
      ring1Ref.current.scale.x = THREE.MathUtils.lerp(ring1Ref.current.scale.x, targetScale, 0.1);
      ring1Ref.current.scale.y = THREE.MathUtils.lerp(ring1Ref.current.scale.y, targetScale, 0.1);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 3 + Math.cos(time * 0.9) * 0.15;
      ring2Ref.current.rotation.y = -time * 0.4 * speedMultiplier;
      const targetScale = activeField === "email" ? 1.3 : 1.1;
      ring2Ref.current.scale.x = THREE.MathUtils.lerp(ring2Ref.current.scale.x, targetScale, 0.1);
      ring2Ref.current.scale.y = THREE.MathUtils.lerp(ring2Ref.current.scale.y, targetScale, 0.1);
    }

    // 3. Vertex displacement morphing (Simulated gravity well / black hole ripple)
    if (shellRef.current) {
      const geo = shellRef.current.geometry;
      const posAttr = geo.attributes.position;
      const count = posAttr.count;

      // Displacement properties driven by input field focus & text length
      let amplitude = 0.08;
      let frequency = 2.0;

      if (activeField === "name") {
        amplitude = 0.18;
        frequency = 1.5; // slow undulating wave
      } else if (activeField === "email") {
        amplitude = 0.12;
        frequency = 5.0; // high frequency vibrations
      } else if (activeField === "phone") {
        amplitude = 0.22;
        frequency = 2.5;
      }

      // Add text length impact
      amplitude += Math.min(textLength * 0.005, 0.2);

      // Mutate vertices
      for (let i = 0; i < count; i++) {
        const ox = originalPositions.getX(i);
        const oy = originalPositions.getY(i);
        const oz = originalPositions.getZ(i);

        // Compute direction vector from center
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const dx = ox / len;
        const dy = oy / len;
        const dz = oz / len;

        // Apply noise-like sine wave displacement based on coordinates
        const displacement =
          Math.sin(ox * frequency + time * 3.5) *
          Math.cos(oy * frequency + time * 2.8) *
          Math.sin(oz * frequency + time * 1.5) *
          amplitude;

        posAttr.setXYZ(i, ox + dx * displacement, oy + dy * displacement, oz + dz * displacement);
      }
      posAttr.needsUpdate = true;
    }

    // 4. Smoothly scale core mesh
    if (coreRef.current) {
      const targetCoreScale = activeField ? 1.05 : 0.95;
      coreRef.current.scale.x = THREE.MathUtils.lerp(coreRef.current.scale.x, targetCoreScale, 0.1);
      coreRef.current.scale.y = THREE.MathUtils.lerp(coreRef.current.scale.y, targetCoreScale, 0.1);
      coreRef.current.scale.z = THREE.MathUtils.lerp(coreRef.current.scale.z, targetCoreScale, 0.1);
    }
  });

  // Color dynamics: cyan/violet by default, electric pink/purple when typing, bright neon green when form is valid
  const materialColor = useMemo(() => {
    if (isValid) return new THREE.Color("#10b981"); // neon green
    if (activeField === "message") return new THREE.Color("#ec4899"); // pink
    if (activeField === "email") return new THREE.Color("#06b6d4"); // cyan
    if (activeField === "company") return new THREE.Color("#f43f5e"); // rose
    if (activeField === "name") return new THREE.Color("#a855f7"); // purple
    return new THREE.Color("#6366f1"); // default indigo
  }, [activeField, isValid]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={1.8} color={materialColor} />
      <pointLight position={[-6, -6, -6]} intensity={0.6} color="#06b6d4" />
      <spotLight position={[0, 10, 5]} intensity={2.0} color="#ffffff" angle={0.4} penumbra={1} />

      {/* 3D Morphing Elements */}
      
      {/* 1. Core Solid Sphere */}
      <mesh ref={coreRef} geometry={baseGeometry}>
        <meshPhysicalMaterial
          color={materialColor}
          roughness={0.08}
          metalness={0.92}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={1.0}
        />
      </mesh>

      {/* 2. Outer Wireframe Ripple Shell */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.7, detail]} />
        <meshBasicMaterial
          color={materialColor}
          wireframe={true}
          transparent={true}
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Equatorial Orbit Ring 1 (Thin flat ring) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.02, 8, 80]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent={true}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Polar Orbit Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.015, 8, 80]} />
        <meshBasicMaterial
          color={materialColor}
          transparent={true}
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

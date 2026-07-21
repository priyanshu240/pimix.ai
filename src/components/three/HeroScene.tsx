"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function HeroScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const icosahedronRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const { viewport } = useThree();

  // Particle configuration
  const count = 1200;
  const { positions, velocities, originalPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Scatter particles in a box
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 6;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      // Random float speeds (mainly upward to simulate anti-gravity)
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = Math.random() * 0.015 + 0.005; // upward speed
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions: pos, velocities: vel, originalPositions: orig };
  }, []);

  // Ripple state refs (to avoid component re-renders)
  const rippleActiveRef = useRef(false);
  const rippleRadiusRef = useRef(0);
  const rippleCenterRef = useRef(new THREE.Vector3());
  const rippleStrengthRef = useRef(1);

  // Scroll tracking refs
  const scrollYRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Track click to initiate ripples
    const handleClick = (e: MouseEvent) => {
      // Project click coordinate to NDC (-1 to 1)
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Project onto Z=0 plane based on camera distance (roughly 8)
      const targetX = (mouseX * viewport.width) / 2;
      const targetY = (mouseY * viewport.height) / 2;

      rippleCenterRef.current.set(targetX, targetY, 0);
      rippleRadiusRef.current = 0;
      rippleStrengthRef.current = 2.5;
      rippleActiveRef.current = true;
    };

    // Track scroll velocity
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;
      scrollVelocityRef.current = diff * 0.02; // scale velocity
      lastScrollY = currentScrollY;
      scrollYRef.current = currentScrollY;
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [viewport]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Camera Parallax Effect
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 2,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 2 + 0.5,
      0.05
    );
    state.camera.lookAt(0, 0, 0);

    // 2. Light following mouse pointer for dynamic metallic reflections
    if (lightRef.current) {
      const targetX = (state.pointer.x * viewport.width) / 2;
      const targetY = (state.pointer.y * viewport.height) / 2;
      lightRef.current.position.x = THREE.MathUtils.lerp(
        lightRef.current.position.x,
        targetX,
        0.1
      );
      lightRef.current.position.y = THREE.MathUtils.lerp(
        lightRef.current.position.y,
        targetY,
        0.1
      );
    }

    // 3. Update floating metallic shapes
    if (torusRef.current) {
      // Sine wave floating displacement
      torusRef.current.position.y = 1 + Math.sin(time * 0.8) * 0.3;
      torusRef.current.rotation.x = time * 0.2;
      torusRef.current.rotation.y = time * 0.35;
      // Scroll velocity influence
      torusRef.current.rotation.z += scrollVelocityRef.current * 0.1;
    }
    if (icosahedronRef.current) {
      icosahedronRef.current.position.y = -1.5 + Math.cos(time * 1.1) * 0.4;
      icosahedronRef.current.rotation.x = time * 0.3;
      icosahedronRef.current.rotation.y = -time * 0.15;
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = 2.2 + Math.sin(time * 1.5) * 0.2;
      sphereRef.current.position.x = 2 + Math.sin(time * 0.5) * 0.5;
    }

    // Decay scroll velocity
    scrollVelocityRef.current = THREE.MathUtils.lerp(scrollVelocityRef.current, 0, 0.05);

    // 4. Update Particle positions in BufferGeometry
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posAttr = geo.attributes.position;
      const mouseX = (state.pointer.x * viewport.width) / 2;
      const mouseY = (state.pointer.y * viewport.height) / 2;

      // Handle Ripple expansion
      if (rippleActiveRef.current) {
        rippleRadiusRef.current += 0.15;
        rippleStrengthRef.current *= 0.95; // decay force over time
        if (rippleRadiusRef.current > 15 || rippleStrengthRef.current < 0.02) {
          rippleActiveRef.current = false;
        }
      }

      for (let i = 0; i < count; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        // Standard drift upwards
        y += velocities[i * 3 + 1] + Math.abs(scrollVelocityRef.current) * 0.05;
        x += velocities[i * 3];
        z += velocities[i * 3 + 2];

        // Reset particle if it drifts off the top of viewport
        const boundaryY = viewport.height / 2 + 1;
        if (y > boundaryY) {
          y = -boundaryY;
          x = (Math.random() - 0.5) * 15;
          z = (Math.random() - 0.5) * 6;
        }

        // Apply mouse pointer repulsion (anti-gravity push)
        const dx = x - mouseX;
        const dy = y - mouseY;
        const d2 = dx * dx + dy * dy;
        const dist = Math.sqrt(d2);

        if (dist < 2.5) {
          const pushForce = (1.0 - dist / 2.5) * 0.08;
          x += (dx / dist) * pushForce;
          y += (dy / dist) * pushForce;
        }

        // Apply click ripple wave push
        if (rippleActiveRef.current) {
          const rx = x - rippleCenterRef.current.x;
          const ry = y - rippleCenterRef.current.y;
          const rdist = Math.sqrt(rx * rx + ry * ry);

          // Wave pulse width window
          const rippleWidth = 1.0;
          const distFromWave = Math.abs(rdist - rippleRadiusRef.current);

          if (distFromWave < rippleWidth) {
            // Push outwards along direction vector
            const rippleForce = (1.0 - distFromWave / rippleWidth) * rippleStrengthRef.current * 0.15;
            x += (rx / (rdist || 1)) * rippleForce;
            y += (ry / (rdist || 1)) * rippleForce;
          }
        }

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.2} />
      <pointLight ref={lightRef} intensity={2.0} color="#06b6d4" distance={15} />
      
      {/* High-contrast neon colored spotlights to get premium reflections */}
      <spotLight
        position={[-8, 6, 8]}
        angle={0.4}
        penumbra={1}
        intensity={3.0}
        color="#8b5cf6"
      />
      <spotLight
        position={[8, -6, 5]}
        angle={0.5}
        penumbra={1}
        intensity={2.5}
        color="#ec4899"
      />
      <directionalLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" />

      {/* Floating Metallic Shapes */}
      {/* 1. Torus Knot (Liquid Violet Chrome) */}
      <mesh ref={torusRef} position={[-2.5, 1, 0]}>
        <torusKnotGeometry args={[0.7, 0.22, 120, 16]} />
        <meshPhysicalMaterial
          color="#9333ea"
          roughness={0.05}
          metalness={0.95}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={1.0}
          transmission={0}
        />
      </mesh>

      {/* 2. Icosahedron (Electric Cyan Metallic) */}
      <mesh ref={icosahedronRef} position={[2.8, -1.5, 0.5]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshPhysicalMaterial
          color="#06b6d4"
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={0.8}
        />
      </mesh>

      {/* 3. Small Floating Sphere (Hot Pink Metallic) */}
      <mesh ref={sphereRef} position={[2, 2.2, -1.5]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshPhysicalMaterial
          color="#ec4899"
          roughness={0.02}
          metalness={0.98}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
      </mesh>

      {/* Dynamic Interactive Particle Field */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#a78bfa"
          size={0.045}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

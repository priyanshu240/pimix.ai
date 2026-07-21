"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function MagneticNodesScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Create a 2D Grid of points
  const gridSize = 100;
  const count = gridSize * gridSize;
  const spacing = 0.2; // space between nodes

  const originalPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const offset = (gridSize * spacing) / 2;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = (i * gridSize + j) * 3;
        pos[index] = i * spacing - offset;       // x
        pos[index + 1] = j * spacing - offset;   // y
        pos[index + 2] = 0;                      // z (flat grid initially)
      }
    }
    return pos;
  }, [count, gridSize]);

  // We need a cloned array for the actual rendered positions
  const initialPositions = useMemo(() => {
    return new Float32Array(originalPositions);
  }, [originalPositions]);

  // Variables for dynamic interactions
  const mouseVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const lastMousePos = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;

    // Convert normalized mouse coordinates (-1 to +1) to world units
    const mouseX = (state.pointer.x * viewport.width) / 2;
    const mouseY = (state.pointer.y * viewport.height) / 2;
    const currentMousePos = new THREE.Vector3(mouseX, mouseY, 0);

    // Calculate mouse velocity for more dynamic attraction
    mouseVelocity.current.subVectors(currentMousePos, lastMousePos.current).divideScalar(delta);
    lastMousePos.current.copy(currentMousePos);

    // Magnetic radius
    const radius = 4.0;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const index = i * 3;
      const baseX = originalPositions[index];
      const baseY = originalPositions[index + 1];
      const baseZ = originalPositions[index + 2];

      let targetX = baseX;
      let targetY = baseY;
      let targetZ = baseZ;

      // Distance from base point to mouse
      const dx = baseX - mouseX;
      const dy = baseY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // The node is within the magnetic field
        const force = Math.pow(1 - dist / radius, 2); // Exponential dropoff for smoother pull
        
        // Attract toward mouse
        targetX = THREE.MathUtils.lerp(baseX, mouseX, force * 0.8);
        targetY = THREE.MathUtils.lerp(baseY, mouseY, force * 0.8);
        
        // Lift towards the camera slightly for a 3D magnetic pop effect
        targetZ = force * 2.0; 
        
        // Add a bit of chaotic swirl if moving fast
        if (mouseVelocity.current.length() > 5) {
          targetX += Math.sin(time * 10 + i) * force * 0.2;
          targetY += Math.cos(time * 10 + i) * force * 0.2;
        }
      } else {
        // Organic idle breathing for nodes outside the magnetic field
        const noise = Math.sin(time * 2 + baseX * 2 + baseY * 2) * 0.05;
        targetZ = baseZ + noise;
      }

      // Current positions
      let cx = posAttr.getX(i);
      let cy = posAttr.getY(i);
      let cz = posAttr.getZ(i);

      // Spring physics (lerp current position towards target position)
      // Faster recovery if far away from mouse, tighter pull if near
      const springTension = dist < radius ? 0.2 : 0.05;

      cx = THREE.MathUtils.lerp(cx, targetX, springTension);
      cy = THREE.MathUtils.lerp(cy, targetY, springTension);
      cz = THREE.MathUtils.lerp(cz, targetZ, springTension);

      posAttr.setXYZ(i, cx, cy, cz);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <>
      <color attach="background" args={["#030303"]} />
      
      {/* Lighting for the nodes if we want them to reflect */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 5]} intensity={2} color="#00ffcc" />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[initialPositions, 3]}
            count={count}
            array={initialPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#06b6d4" // Cyan core color
          size={0.035}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

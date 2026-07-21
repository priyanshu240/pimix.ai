"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const GRID_SIZE = 60; // Larger grid to fill the screen
const SPACING = 1.0;
const MOUSE_RADIUS = 6;
const RIPPLE_SPEED = 8;
const RIPPLE_AMP = 0.5;

function InstancedGrid() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { pointer, camera } = useThree();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Initialize positions
  const count = GRID_SIZE * GRID_SIZE;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    let i = 0;
    const offset = (GRID_SIZE * SPACING) / 2;
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        pos[i * 3] = x * SPACING - offset;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = z * SPACING - offset;
        i++;
      }
    }
    return pos;
  }, [count]);

  const targetPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseWorldPos = useRef(new THREE.Vector3(0, 0, 0));
  const globalPointer = useRef(new THREE.Vector2(0, 0));

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      globalPointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalPointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Raycast to find mouse position on the XZ plane using global pointer
    raycaster.setFromCamera(globalPointer.current, camera);
    const intersect = raycaster.ray.intersectPlane(targetPlane, mouseWorldPos.current);

    const time = state.clock.elapsedTime;
    let i = 0;
    
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const px = positions[i * 3];
        const pz = positions[i * 3 + 2];
        
        // Base subtle wave
        let py = Math.sin(px * 0.2 + time * 0.5) * Math.cos(pz * 0.2 + time * 0.5) * 0.2;

        // Mouse interaction wave
        if (intersect) {
          const dx = px - mouseWorldPos.current.x;
          const dz = pz - mouseWorldPos.current.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          
          if (dist < MOUSE_RADIUS) {
            // Ripple equation
            const ripple = Math.sin(dist * 2 - time * RIPPLE_SPEED) * (MOUSE_RADIUS - dist) * 0.15;
            py += ripple;
          }
        }

        dummy.position.set(px, py, pz);
        // Box shape
        dummy.scale.set(0.95, 0.4, 0.95);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        i++;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#875c4c" 
        roughness={0.2}
        metalness={0.3}
      />
    </instancedMesh>
  );
}

export default function WaveGrid() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-auto">
      <Canvas shadows camera={{ position: [0, 15, 20], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        
        {/* Adjusted lighting for a clean, light aesthetic */}
        <ambientLight intensity={1.2} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow 
        />
        <directionalLight 
          position={[-10, 10, -10]} 
          intensity={0.8} 
          color="#9a0002" // subtle cherry cola tint from back
        />
        
        <InstancedGrid />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

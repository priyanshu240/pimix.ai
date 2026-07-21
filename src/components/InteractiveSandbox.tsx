"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Sphere, Box, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useContent } from "@/contexts/ContentContext";

type Mode = "idle" | "optimize" | "deploy" | "ai";

const CODE_SNIPPETS: Record<Mode, string> = {
  idle: `// System standby
// Awaiting execution command...
const system = new PiMixCore();
system.initialize();`,
  optimize: `// [Execute]: Speed Optimization
async function optimizePerformance() {
  const mesh = await getGeometry();
  mesh.snapToGrid();
  mesh.reduceDrawCalls({ target: 0.1 });
  return { status: 200, fps: 120 };
}`,
  deploy: `// [Execute]: Deploy 3D Architecture
function buildArchitecture() {
  const scene = new THREE.Scene();
  const structure = generateComplexGeo();
  scene.add(structure);
  renderer.render(scene, camera);
  console.log("Deployed successfully.");
}`,
  ai: `// [Execute]: Inject AI Agents
const ai = new AgentNetwork();
ai.connectNodes(architecture);
ai.initiateNeuralPulse();
ai.listen("user_intent");`,
};

function Typewriter({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20); // typing speed
    return () => clearInterval(interval);
  }, [text]);

  return (
    <pre className="font-sans text-sm sm:text-base text-green-400 p-6 bg-black/50 border border-green-500/30 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.1)] h-[250px] overflow-hidden whitespace-pre-wrap">
      <code>{displayedText}</code>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-5 bg-green-400 align-middle ml-1"
      />
    </pre>
  );
}

// 3D Scene Component
function SandboxVisualizer({ mode }: { mode: Mode }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Smoothly interpolate positions and colors based on mode
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Idle: Slow rotation
    if (mode === "idle") {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
      if (coreRef.current) {
         coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, 0, 0.1));
      }
    }

    // Optimize: Snap to grid, spin fast then slow down
    if (mode === "optimize") {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.05);
       if (coreRef.current) {
         coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, 0, 0.1));
      }
    }

    // Deploy: Expand and rotate complexly
    if (mode === "deploy") {
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.rotation.z += delta * 0.2;
       if (coreRef.current) {
         coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, 1, 0.05));
         coreRef.current.material.color.setHex(0x0088ff);
      }
    }

    // AI: Pulsating core, fast rotation
    if (mode === "ai") {
      groupRef.current.rotation.y += delta;
      groupRef.current.scale.setScalar(1 + Math.sin(t * 10) * 0.05); // heartbeat
       if (coreRef.current) {
         coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, 1.5, 0.1));
         // Pulsate core color
         const pulse = (Math.sin(t * 8) + 1) / 2;
         const color = new THREE.Color().setHSL(0.8, 1, 0.5 + pulse * 0.3); // Purple/Pink
         coreRef.current.material.color.copy(color);
      }
    } else {
        if (groupRef.current) groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.1));
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer geometry */}
      {mode === "idle" || mode === "optimize" ? (
        <Sphere args={[2, 32, 32]}>
          <MeshDistortMaterial
            ref={materialRef}
            color={mode === "optimize" ? "#10b981" : "#3b82f6"}
            wireframe
            distort={mode === "optimize" ? 0 : 0.4}
            speed={mode === "optimize" ? 1 : 3}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ) : (
        <Box args={[2.5, 2.5, 2.5]}>
          <meshStandardMaterial
            color={mode === "ai" ? "#a855f7" : "#0ea5e9"}
            wireframe
            transparent
            opacity={0.5}
          />
        </Box>
      )}

      {/* Inner Core */}
      <Sphere ref={coreRef} args={[1, 32, 32]} scale={0}>
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} toneMapped={false} />
      </Sphere>
    </group>
  );
}

export default function InteractiveSandbox() {
  const [mode, setMode] = useState<Mode>("idle");
  const content = useContent();

  const buttons: { label: string; id: Mode; color: string }[] = [
    { label: content.sandbox.button1, id: "optimize", color: "bg-emerald-500" },
    { label: content.sandbox.button2, id: "deploy", color: "bg-blue-500" },
    { label: content.sandbox.button3, id: "ai", color: "bg-purple-500" },
  ];

  return (
    <section className="relative w-full py-24 px-6 md:px-12 lg:px-24 bg-transparent overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left: Controls & Editor */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8 z-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
              {content.sandbox.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{content.sandbox.titleHighlight}</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-md">
              {content.sandbox.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {buttons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setMode(btn.id)}
                className={`px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  mode === btn.id
                    ? `${btn.color} border-transparent text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]`
                    : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="w-full relative">
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-white/20" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-white/20" />
            <Typewriter text={CODE_SNIPPETS[mode]} />
          </div>
        </div>

        {/* Right: R3F Canvas */}
        <div className="w-full lg:w-1/2 h-[500px] relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 flex items-center justify-center">
            {/* Background Glow based on mode */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className={`w-[300px] h-[300px] blur-[100px] transition-colors duration-1000 ${
                    mode === 'idle' ? 'bg-blue-500/20' :
                    mode === 'optimize' ? 'bg-emerald-500/30' :
                    mode === 'deploy' ? 'bg-cyan-500/30' :
                    'bg-purple-500/40'
                 }`} />
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="city" />
                <SandboxVisualizer mode={mode} />
                <OrbitControls enableZoom={false} autoRotate={mode === 'idle'} autoRotateSpeed={0.5} />
            </Canvas>

            {/* Overlays */}
            <div className="absolute top-4 left-4 font-mono text-xs text-white/40">
                // RENDER_TARGET: PRIMARY_VIEW
                <br/>
                // FPS: 120
            </div>
        </div>

      </div>
    </section>
  );
}

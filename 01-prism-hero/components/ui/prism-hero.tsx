"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Text } from "@react-three/drei";
import { useScroll, useTransform, motion } from "framer-motion";
import * as THREE from "three";

export function PrismHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="h-[260vh] w-full relative">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Title Behind Crystal */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
          <h1 className="text-[15vw] font-display font-bold text-transparent tracking-tighter opacity-80" 
              style={{ WebkitTextStroke: "2px rgba(237,232,223,0.3)" }}>
            REFRACTION
          </h1>
        </div>

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <Crystal scrollYProgress={scrollYProgress} />
            <Environment preset="city" />
          </Canvas>
        </div>

        {/* Foreground Content */}
        <div className="z-10 mt-auto mb-20 flex gap-4">
          <button className="px-8 py-3 rounded-full bg-foreground text-background font-mono font-medium hover:opacity-90 transition-opacity">
            Explore
          </button>
          <button className="px-8 py-3 rounded-full border border-foreground/30 text-foreground font-mono font-medium hover:bg-foreground/10 transition-colors">
            Documentation
          </button>
        </div>
      </div>
    </div>
  );
}

function Crystal({ scrollYProgress }: { scrollYProgress: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      const scroll = scrollYProgress.get();
      meshRef.current.rotation.y = scroll * Math.PI * 4;
      meshRef.current.rotation.x = scroll * Math.PI * 2;
      const scale = 1 + scroll * 1.5;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 0]} />
      <MeshTransmissionMaterial 
        thickness={0.5}
        roughness={0}
        transmission={1}
        ior={1.5}
        chromaticAberration={0.06}
        backside
      />
    </mesh>
  );
}

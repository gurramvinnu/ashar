import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Premium Dual-Color Capsule Pill Component
function DetailedCapsule({ position, scale = [1, 1, 1], speed = 0.8, orbitRadius = [2.2, 1.5] }) {
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    
    // Slow independent rotation
    groupRef.current.rotation.x = time * 0.4;
    groupRef.current.rotation.y = time * 0.3;
    
    // Orbiting motion around the main tablet
    groupRef.current.position.x = position[0] + Math.sin(time * speed) * orbitRadius[0];
    groupRef.current.position.y = position[1] + Math.cos(time * speed) * orbitRadius[1];
    groupRef.current.position.z = position[2] + Math.cos(time * speed) * 0.5;
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* --- TOP CYAN HALF --- */}
      {/* Top Cap */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>
      {/* Top Body Cylinder */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* --- BOTTOM DEEP-BLUE HALF --- */}
      {/* Bottom Cap */}
      <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#1d4ed8"
          emissiveIntensity={0.2}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>
      {/* Bottom Body Cylinder */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 32]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#1d4ed8"
          emissiveIntensity={0.2}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Sealed Joint Ring */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.255, 0.255, 0.04, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

// Premium Small Orbiting Round Tablet
function OrbitingRoundTablet({ position, scale = [1, 1, 1], speed = 0.6, orbitRadius = [3, 2], color = '#10b981' }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!meshRef.current) return;

    // Rotate tablet on its flat face
    meshRef.current.rotation.x = time * 0.5;
    meshRef.current.rotation.z = time * 0.2;

    // Outer orbit
    meshRef.current.position.x = position[0] + Math.cos(time * speed) * orbitRadius[0];
    meshRef.current.position.y = position[1] + Math.sin(time * speed) * orbitRadius[1];
    meshRef.current.position.z = position[2] + Math.sin(time * speed) * 0.6;
  });

  return (
    <mesh ref={meshRef} scale={scale} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
      <cylinderGeometry args={[0.3, 0.3, 0.12, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.25}
        roughness={0.15}
        metalness={0.8}
      />
    </mesh>
  );
}

// Premium Detailed Circular Tablet (Grooved Pill) Component with Seams
function DetailedCircularTablet() {
  const groupRef = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    
    // Y-axis slow rotation
    groupRef.current.rotation.y = time * 0.3;
    
    // Up/down bobbing
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.25;
    
    // Interactive mouse follow tilt (very clean 3D response)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.y * 0.4 + 0.3,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -mouse.x * 0.3,
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      {/* Main Pressed Tablet Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.45, 64, 4]} />
        <meshStandardMaterial
          color="#0891b2"
          emissive="#06b6d4"
          emissiveIntensity={0.25}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Realistic Pressed Mold Seam (The tiny protruding center rim where the pill halves compressed) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.04, 64]} />
        <meshStandardMaterial
          color="#0891b2"
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Front Bevel Cap */}
      <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.15, 1.2, 0.02, 64]} />
        <meshStandardMaterial
          color="#0891b2"
          emissive="#06b6d4"
          emissiveIntensity={0.25}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Back Bevel Cap */}
      <mesh position={[0, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.15, 0.02, 64]} />
        <meshStandardMaterial
          color="#0891b2"
          emissive="#06b6d4"
          emissiveIntensity={0.25}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Central Pressed Groove (Dividing crevice) */}
      <mesh position={[0, 0, 0.23]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 2.38, 0.02]} />
        <meshStandardMaterial
          color="#030712"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Back Pressed Groove */}
      <mesh position={[0, 0, -0.23]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 2.38, 0.02]} />
        <meshStandardMaterial
          color="#030712"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

export default function MedicalModel() {
  return (
    <group>
      {/* Center-Stage Grooved Pressed Tablet */}
      <DetailedCircularTablet />

      {/* Primary Orbiting Capsule (Cyan/Blue) */}
      <DetailedCapsule position={[2, 0, 0]} scale={[1.2, 1.2, 1.2]} speed={0.8} orbitRadius={[2.2, 1.5]} />

      {/* Secondary Orbiting Micro-Tablet (Emerald Green) */}
      <OrbitingRoundTablet position={[2, 0, 0]} scale={[1, 1, 1]} speed={0.5} orbitRadius={[3.2, 2.2]} color="#10b981" />

      {/* Tertiary Orbiting Micro-Tablet (Amber Gold) */}
      <OrbitingRoundTablet position={[2, 0, 0]} scale={[0.8, 0.8, 0.8]} speed={-0.6} orbitRadius={[2.6, 1.8]} color="#f59e0b" />
    </group>
  );
}

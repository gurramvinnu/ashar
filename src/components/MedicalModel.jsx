import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Premium Dual-Color Capsule Pill Component
function DetailedCapsule({ position, scale = [1, 1, 1] }) {
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    
    // Slow independent rotation
    groupRef.current.rotation.x = time * 0.4;
    groupRef.current.rotation.y = time * 0.3;
    
    // Orbiting motion around the main tablet
    groupRef.current.position.x = position[0] + Math.sin(time * 0.8) * 2.2;
    groupRef.current.position.y = position[1] + Math.cos(time * 0.8) * 1.5;
    groupRef.current.position.z = position[2] + Math.cos(time * 0.8) * 0.5;
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

      {/* Sealed Joint Ring (The thin band where the two capsule halves overlap) */}
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

// Premium Detailed Circular Tablet (Grooved Pill) Component
function DetailedCircularTablet() {
  const groupRef = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    
    // Rotate slowly on multiple axes to show the bevels and groove
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.rotation.z = Math.sin(time * 0.15) * 0.2;
    
    // Subtle up/down bobbing
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.25;
    
    // Interactive tilt following the mouse pointer
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.y * 0.4 + 0.3, // slight tilt forward default
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

      {/* Front Bevel Cap (Adds rounding to the front face edge) */}
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

      {/* Back Bevel Cap (Adds rounding to the back face edge) */}
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

      {/* Central Split Crevice / Groove (Pill Divider)
          Placed slightly recessed intersecting the front face to create a perfect grooved visual */}
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
      
      {/* Back Crevice / Groove */}
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
      {/* Center-Stage Rotating Pressed Circular Tablet */}
      <DetailedCircularTablet />

      {/* Orbiting Capsule Pill */}
      <DetailedCapsule position={[2, 0, 0]} scale={[1.3, 1.3, 1.3]} />
    </group>
  );
}

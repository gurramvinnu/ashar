import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import MedicalModel from './MedicalModel';

// Custom 3D capsule pill component
function CapsulePill({ position, speed, rotationSpeed, color }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!meshRef.current) return;
    
    // Rotate slowly on multiple axes
    meshRef.current.rotation.x += rotationSpeed.x;
    meshRef.current.rotation.y += rotationSpeed.y;
    
    // Slow organic drift / bobbing
    meshRef.current.position.y = position[1] + Math.sin(time * speed + position[0]) * 0.4;
    meshRef.current.position.x = position[0] + Math.cos(time * (speed * 0.5) + position[2]) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <capsuleGeometry args={[0.15, 0.35, 8, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.25}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

// Custom round medical tablet component
function RoundTablet({ position, speed, rotationSpeed, color }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x += rotationSpeed.x;
    meshRef.current.rotation.z += rotationSpeed.z;
    
    meshRef.current.position.y = position[1] + Math.cos(time * speed + position[0]) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      {/* Cylindrical flat shape representing a circular tablet pill */}
      <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

// Particle field representing sterile molecular dust
function FloatingParticles({ count = 100 }) {
  const pointsRef = useRef();
  
  const [positions, velocities] = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() + 0.1) * 0.01; 
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3] += velocities[i * 3];
      posAttr.array[i * 3 + 1] += velocities[i * 3 + 1];
      posAttr.array[i * 3 + 2] += velocities[i * 3 + 2];
      
      if (posAttr.array[i * 3 + 1] > 8) {
        posAttr.array[i * 3 + 1] = -8;
        posAttr.array[i * 3] = (Math.random() - 0.5) * 16;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points pointsRef={pointsRef} ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#06b6d4"
        size={0.05}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Background3D() {
  // Generate coordinates and parameters for a set of floating capsules and round tablet pills
  const floatingPills = React.useMemo(() => {
    const pills = [];
    const colors = ['#06b6d4', '#3b82f6', '#14b8a6', '#0891b2', '#2563eb'];
    
    // Let's create 10 floating elements distributed across the 3D viewport
    for (let i = 0; i < 10; i++) {
      pills.push({
        id: i,
        type: i % 2 === 0 ? 'capsule' : 'round',
        position: [
          (Math.random() - 0.5) * 12, // distributed on X
          (Math.random() - 0.5) * 10, // distributed on Y
          (Math.random() - 0.7) * 4,   // Z depth (foreground/background)
        ],
        speed: 0.3 + Math.random() * 0.5,
        rotationSpeed: {
          x: 0.002 + Math.random() * 0.005,
          y: 0.002 + Math.random() * 0.005,
          z: 0.002 + Math.random() * 0.005,
        },
        color: colors[i % colors.length]
      });
    }
    return pills;
  }, []);

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#030712']} />
        
        <fog attach="fog" args={['#030712', 4, 15]} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 8, 8]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[-8, -8, -8]} intensity={1.0} color="#3b82f6" />
        <directionalLight position={[0, 4, 4]} intensity={1.0} color="#ffffff" />
        
        <Suspense fallback={null}>
          <FloatingParticles count={100} />
          
          {/* Render individual 3D pill objects floating in the scene */}
          {floatingPills.map((pill) => 
            pill.type === 'capsule' ? (
              <CapsulePill
                key={pill.id}
                position={pill.position}
                speed={pill.speed}
                rotationSpeed={pill.rotationSpeed}
                color={pill.color}
              />
            ) : (
              <RoundTablet
                key={pill.id}
                position={pill.position}
                speed={pill.speed}
                rotationSpeed={pill.rotationSpeed}
                color={pill.color}
              />
            )
          )}

          {/* DNA Helix signifying biotech engineering and formulation quality */}
          <MedicalModel />
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}

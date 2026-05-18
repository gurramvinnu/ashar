import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Number of stations on the rotary press turret
const STATIONS_COUNT = 16;
// Angle where compression rollers squeeze the punch dies
const COMPRESSION_ANGLE = Math.PI / 2; // ~90 degrees
// Angle where the tablet is ejected from the die
const EJECTION_ANGLE = Math.PI; // ~180 degrees
// Angle where the physical ejection chute sits
const CHUTE_ANGLE = Math.PI * 1.1; // slightly past ejection

export default function RotaryTurret3D({ rpm, isStopped }) {
  const turretGroupRef = useRef();
  const particlesRef = useRef([]);
  const meshesRef = useRef([]);
  const spawnTimer = useRef(0);
  const currentRotation = useRef(0);
  const actualSpeed = useRef(0);

  // Initialize tablet particles pool
  const particlesPool = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      rotation: new THREE.Vector3(),
      rotVelocity: new THREE.Vector3(),
      scale: 0.15,
      age: 0,
      maxAge: 1.5,
    }));
  }, []);

  // Set up 16 punch stations on the turret
  const stations = useMemo(() => {
    return Array.from({ length: STATIONS_COUNT }, (_, i) => {
      const angle = (i / STATIONS_COUNT) * Math.PI * 2;
      const radius = 1.05;
      return {
        id: i,
        angleOffset: angle,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
      };
    });
  }, []);

  // Create a mesh-holder ref for particles to bypass React updates during useFrame
  const setParticleMeshRef = (index, element) => {
    if (element) {
      meshesRef.current[index] = element;
    }
  };

  useFrame((state, delta) => {
    // 1. Smoothly interpolate turret actual speed (acceleration/deceleration)
    const targetSpeed = isStopped ? 0 : (rpm / 60) * Math.PI * 2; // rad/sec
    // Quick deceleration brake on E-Stop, normal acceleration
    const lerpFactor = isStopped ? 0.15 : 0.05;
    actualSpeed.current = THREE.MathUtils.lerp(actualSpeed.current, targetSpeed, lerpFactor);

    // Update current turret cumulative rotation angle
    currentRotation.current += actualSpeed.current * delta;
    if (turretGroupRef.current) {
      turretGroupRef.current.rotation.y = currentRotation.current;
    }

    // 2. Animate local punch station cylinder offsets (compression and ejection waves)
    stations.forEach((station, index) => {
      const group = turretGroupRef.current?.children[index + 3]; // offset by 3 base parts (shaft, die plate, eject tray)
      if (!group) return;

      // Absolute angle of station in world space
      const worldAngle = (station.angleOffset + currentRotation.current) % (Math.PI * 2);

      // Squeeze punches at COMPRESSION_ANGLE
      const distToCompression = Math.abs(worldAngle - COMPRESSION_ANGLE);
      const normalizedDist = Math.min(distToCompression, Math.PI * 2 - distToCompression);
      const isCompressing = normalizedDist < Math.PI / 4;
      const compressFactor = isCompressing 
        ? Math.cos((normalizedDist / (Math.PI / 4)) * (Math.PI / 2))
        : 0;

      // Raise lower punch at EJECTION_ANGLE to eject tablet
      const distToEjection = Math.abs(worldAngle - EJECTION_ANGLE);
      const normalizedEjectDist = Math.min(distToEjection, Math.PI * 2 - distToEjection);
      const isEjecting = normalizedEjectDist < Math.PI / 6;
      const ejectFactor = isEjecting
        ? Math.cos((normalizedEjectDist / (Math.PI / 6)) * (Math.PI / 2))
        : 0;

      // Upper punch moves DOWN during compression
      const upperPunch = group.children[0];
      if (upperPunch) {
        upperPunch.position.y = 0.55 - (0.18 * compressFactor);
      }

      // Lower punch moves UP during compression AND ejects tablet even higher at ejection point
      const lowerPunch = group.children[1];
      if (lowerPunch) {
        lowerPunch.position.y = -0.55 + (0.05 * compressFactor) + (0.15 * ejectFactor);
      }

      // Floating tablet on die plate (visible before ejection and compression)
      const dieTablet = group.children[2];
      if (dieTablet) {
        // Tablet moves up with the lower punch
        dieTablet.position.y = 0.01 + (-0.55 + (0.05 * compressFactor) + (0.15 * ejectFactor)) + 0.55;
        // Make it disappear right after ejection angle (when it becomes a floating particle)
        const isPastEjection = worldAngle > EJECTION_ANGLE && worldAngle < EJECTION_ANGLE + Math.PI;
        dieTablet.visible = !isPastEjection;
      }
    });

    // 3. Tablet Particle Spawn System
    if (rpm > 0 && !isStopped) {
      spawnTimer.current += delta;
      // Spawn interval proportional to RPM speed (more speed = faster spawns)
      const spawnInterval = 0.8 / (rpm / 10);
      if (spawnTimer.current > spawnInterval) {
        spawnTimer.current = 0;
        
        // Find inactive particle in the pool
        const particle = particlesPool.find(p => !p.active);
        if (particle) {
          particle.active = true;
          particle.age = 0;

          // Spawn at physical ejection chute angle
          const radius = 1.05;
          particle.position.set(
            Math.cos(CHUTE_ANGLE) * radius,
            0.15,
            Math.sin(CHUTE_ANGLE) * radius
          );

          // Eject tangent direction (chute is sliding off front-right)
          const tangentX = -Math.sin(CHUTE_ANGLE);
          const tangentZ = Math.cos(CHUTE_ANGLE);
          
          // Velocity: outwards along tangent, slightly outwards, and downward slope
          particle.velocity.set(
            (tangentX * 1.5 + Math.cos(CHUTE_ANGLE) * 0.5) * (1 + (rpm / 120) * 0.5),
            -0.2,
            (tangentZ * 1.5 + Math.sin(CHUTE_ANGLE) * 0.5) * (1 + (rpm / 120) * 0.5)
          );

          // Give a random tumble spin
          particle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
          particle.rotVelocity.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
          );
        }
      }
    }

    // 4. Update Particle physics and local meshes
    particlesPool.forEach((particle, idx) => {
      const mesh = meshesRef.current[idx];
      if (!mesh) return;

      if (particle.active) {
        mesh.visible = true;
        particle.age += delta;

        // Apply physics updates
        particle.position.addScaledVector(particle.velocity, delta);
        // Apply gravity acceleration
        particle.velocity.y -= 3.5 * delta;

        // Apply rotation spin
        particle.rotation.addScaledVector(particle.rotVelocity, delta);

        // Update mesh matrices
        mesh.position.copy(particle.position);
        mesh.rotation.set(particle.rotation.x, particle.rotation.y, particle.rotation.z);

        // Fade scale near end of life
        if (particle.age > particle.maxAge) {
          particle.active = false;
        } else {
          const scaleLife = 1 - (particle.age / particle.maxAge);
          const currentScale = particle.scale * Math.min(1, scaleLife * 3);
          mesh.scale.set(currentScale, currentScale, currentScale);
        }
      } else {
        mesh.visible = false;
      }
    });
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* 3D TURRET GROUP ROTATED BY useFrame */}
      <group ref={turretGroupRef}>
        {/* Central Rotary Shaft */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 1.8, 24]} />
          <meshStandardMaterial
            color="#4b5563"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>

        {/* Central Die Plate Disk (Holds tablets) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.08, 32]} />
          <meshStandardMaterial
            color="#1f2937"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>

        {/* Top Roller Pressure Ring */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.05, 32]} />
          <meshStandardMaterial
            color="#374151"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* individual Punch Stations */}
        {stations.map((st, index) => (
          <group key={st.id} position={[st.x, 0, st.z]}>
            {/* Upper Punch (Acts up/down) */}
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.35, 12]} />
              <meshStandardMaterial
                color="#e5e7eb"
                roughness={0.15}
                metalness={0.85}
              />
            </mesh>

            {/* Lower Punch (Acts up/down) */}
            <mesh position={[0, -0.55, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.35, 12]} />
              <meshStandardMaterial
                color="#9ca3af"
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* Compressed Die Tablet (Inside/atop die plate hole) */}
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.04, 16]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#06b6d4"
                emissiveIntensity={0.4}
                roughness={0.1}
                metalness={0.7}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* STATIC MECHANICAL HOUSING & EJECTION CHUTE SLIDE */}
      {/* Upper Compression Roller Wheel */}
      <mesh position={[0, 0.95, 1.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 24]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Lower Compression Roller Wheel */}
      <mesh position={[0, -0.95, 1.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 24]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Ejection Chute Collector Slide Tray */}
      <group position={[Math.cos(CHUTE_ANGLE) * 1.3, -0.06, Math.sin(CHUTE_ANGLE) * 1.3]} rotation={[0.1, -CHUTE_ANGLE - Math.PI/2, 0.25]}>
        {/* Chute Slide Tray */}
        <mesh>
          <boxGeometry args={[0.3, 0.02, 1.2]} />
          <meshStandardMaterial
            color="#374151"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        
        {/* Left Side Rail */}
        <mesh position={[-0.15, 0.04, 0]}>
          <boxGeometry args={[0.02, 0.08, 1.2]} />
          <meshStandardMaterial
            color="#4b5563"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>

        {/* Right Side Rail */}
        <mesh position={[0.15, 0.04, 0]}>
          <boxGeometry args={[0.02, 0.08, 1.2]} />
          <meshStandardMaterial
            color="#4b5563"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      </group>

      {/* WEBGL POOLED TABLET EJECTION PARTICLES */}
      {particlesPool.map((p, idx) => (
        <mesh
          key={p.id}
          ref={(el) => setParticleMeshRef(idx, el)}
          visible={false}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.25, 16]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

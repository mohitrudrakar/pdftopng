import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Float, Sparkles, Trail } from '@react-three/drei';
import * as THREE from 'three';

// Quadratic Bezier curve function
function quadraticBezier(p0, p1, p2, t) {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

// Get point on curve
function getPointOnCurve(p0, p1, p2, t) {
  return new THREE.Vector3(
    quadraticBezier(p0.x, p1.x, p2.x, t),
    quadraticBezier(p0.y, p1.y, p2.y, t),
    quadraticBezier(p0.z, p1.z, p2.z, t)
  );
}

// SVG Icons Component
const PDFIcon = () => (
  <svg viewBox="0 0 200 200" width={200} height={200} className="filter drop-shadow-2xl">
    {/* Red background */}
    <rect x="20" y="20" width="160" height="160" rx="15" fill="#ef4444" />
    {/* Folded corner */}
    <polygon points="180,20 180,60 140,20" fill="#dc2626" />
    {/* PDF Text */}
    <text x="100" y="115" fontSize="55" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial">PDF</text>
  </svg>
);

const PNGIcon = () => (
  <svg viewBox="0 0 200 200" width={200} height={200} className="filter drop-shadow-2xl">
    {/* Yellow background circle */}
    <circle cx="100" cy="100" r="95" fill="#fde047" opacity="0.3" />
    {/* White document background */}
    <rect x="30" y="30" width="140" height="140" rx="15" fill="#e0e7ff" stroke="#4c51bf" strokeWidth="3" />
    {/* Blue folded corner */}
    <polygon points="170,30 170,70 130,30" fill="#3b82f6" stroke="#4c51bf" strokeWidth="2" />
    {/* PNG Text */}
    <text x="100" y="110" fontSize="40" fontWeight="bold" fill="#1f2937" textAnchor="middle" fontFamily="Arial">PNG</text>
    {/* Decorative dots */}
    <circle cx="160" cy="50" r="6" fill="#fbbf24" />
    <circle cx="175" cy="80" r="4" fill="#ec4899" />
    <circle cx="170" cy="160" r="5" fill="#fbbf24" />
    <circle cx="40" cy="150" r="4" fill="#ec4899" />
  </svg>
);

// Rotating rings component
function RotatingRings({ position, color, rotationSpeed = 1 }) {
  const ringsRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z = time * (rotationSpeed * (i + 1) * 0.5) * (i % 2 === 0 ? 1 : -1);
      }
    });
  });

  const ringColors = [
    { color, opacity: 0.3 },
    { color, opacity: 0.2 },
    { color, opacity: 0.1 },
  ];

  return (
    <group position={position}>
      {ringColors.map((ring, i) => (
        <mesh key={i} ref={(el) => (ringsRef.current[i] = el)} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.8 + i * 0.6, 0.08, 16, 32]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            emissive={ring.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Pulsing energy waves
function EnergyWaves({ position, color }) {
  const wavesRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    wavesRef.current.forEach((wave, i) => {
      if (wave) {
        const scale = 1 + Math.sin(time * 2 + i * 0.5) * 0.3;
        wave.scale.set(scale, scale, scale);
        wave.material.opacity = Math.sin(time * 2 + i * 0.5) * 0.2 + 0.1;
      }
    });
  });

  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (wavesRef.current[i] = el)}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

// Animated orbiting particles component
function OrbitingParticles({ position, color = "#ffffff", speed = 1 }) {
  const particlesRef = useRef([]);
  const particleCount = 8;

  useMemo(() => {
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      radius: 2,
      speed: speed + Math.random() * 0.3,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    particlesRef.current.forEach((p, i) => {
      p.angle += 0.015 * p.speed;
    });
  });

  return (
    <group position={position}>
      {particlesRef.current.map((p, i) => {
        const x = Math.cos(p.angle) * p.radius;
        const y = Math.sin(p.angle) * p.radius;
        return (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.7}
              emissive={color}
              emissiveIntensity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Light rays/beams
function LightBeams({ position, color }) {
  const beamsRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    beamsRef.current.forEach((beam, i) => {
      if (beam) {
        beam.rotation.z = time * (i % 2 === 0 ? 1 : -1) * 0.5;
        beam.material.opacity = Math.sin(time * 3 + i) * 0.15 + 0.1;
      }
    });
  });

  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (beamsRef.current[i] = el)} rotation={[0, 0, (i * Math.PI) / 3]}>
          <planeGeometry args={[0.5, 4]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Animated dots traveling along the curve
function AnimatedDots({ p0, p1, p2 }) {
  const dotsRef = useRef([]);
  const dotCount = 8;

  useMemo(() => {
    dotsRef.current = Array.from({ length: dotCount }, (_, i) => ({
      offset: i / dotCount,
      speed: 0.5,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.5;
    dotsRef.current.forEach((dot) => {
      const t = (time + dot.offset) % 1;
      const point = getPointOnCurve(p0, p1, p2, t);
      dot.position = point;
    });
  });

  return (
    <group>
      {dotsRef.current.map((dot, i) => (
        <mesh key={i} position={dot.position || [0, 0, 0]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.9}
            emissive="#3b82f6"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Morphing geometric background
function MorphingGeometry({ position, color, rotationSpeed, isDark }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = time * rotationSpeed;
      meshRef.current.rotation.y = time * (rotationSpeed * 0.7);
      meshRef.current.rotation.z = time * (rotationSpeed * 0.3);
      
      const scale = 1 + Math.sin(time * 1.5) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[3, 2]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={isDark ? 0.02 : 0.04}
        wireframe
      />
    </mesh>
  );
}

export default function MorphScene({ isDark = true }) {
  const lineRef = useRef();
  const pdfPosRef = useRef(new THREE.Vector3(-5, 3, 0));
  const pngPosRef = useRef(new THREE.Vector3(5, -3, 0));

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Animate PDF position (top-left - slight floating)
    pdfPosRef.current.y = 3 + Math.sin(time * 0.3) * 0.3;

    // Animate PNG position (bottom-right - slight floating with offset)
    pngPosRef.current.y = -3 + Math.cos(time * 0.3 + 0.5) * 0.3;

    // Create curved dotted line using Bezier curve
    const resolution = 100;
    const linePositions = [];
    
    // Control point for the curve
    const controlPoint = new THREE.Vector3(0, 2, 0);
    
    for (let i = 0; i <= resolution; i++) {
      const t = i / resolution;
      
      // Calculate point on Bezier curve
      const x = quadraticBezier(pdfPosRef.current.x, controlPoint.x, pngPosRef.current.x, t);
      const y = quadraticBezier(pdfPosRef.current.y, controlPoint.y, pngPosRef.current.y, t);
      const z = quadraticBezier(pdfPosRef.current.z, controlPoint.z, pngPosRef.current.z, t);
      
      linePositions.push(x, y, z);
    }

    if (lineRef.current) {
      lineRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(linePositions), 3)
      );
      lineRef.current.geometry.attributes.position.needsUpdate = true;
      lineRef.current.computeLineDistances();
    }
  });

  return (
    <group>
      {/* Morphing geometric background elements */}
      <MorphingGeometry position={[-6, 3, -6]} color="#ef4444" rotationSpeed={0.3} isDark={isDark} />
      <MorphingGeometry position={[6, -3, -6]} color="#8b5cf6" rotationSpeed={0.4} isDark={isDark} />
      <MorphingGeometry position={[0, 0, -7]} color="#60a5fa" rotationSpeed={0.25} isDark={isDark} />

      {/* Glowing animated line */}
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineDashedMaterial 
          color="#ffffff" 
          dashSize={0.5} 
          gapSize={0.3}
          transparent 
          opacity={1}
          linewidth={3}
          depthWrite={false}
        />
      </lineSegments>

      {/* Animated dots traveling along the line */}
      <AnimatedDots 
        p0={pdfPosRef.current} 
        p1={new THREE.Vector3(0, 2, 0)} 
        p2={pngPosRef.current} 
      />

      {/* PDF Icon (Top-Left) */}
      <Float 
        speed={1.5} 
        rotationIntensity={0.5} 
        floatIntensity={0.4} 
        position={[-5, 3, -3]}
      >
        <group>
          {/* Energy waves - pulsing spheres */}
          <EnergyWaves position={[0, 0, 0]} color="#ef4444" />

          {/* Light rays */}
          <LightBeams position={[0, 0, -0.1]} color="#ef4444" />

          {/* Rotating rings */}
          <RotatingRings position={[0, 0, 0.2]} color="#ef4444" rotationSpeed={2} />

          {/* Large glowing halo */}
          <mesh position={[0, 0, -0.5]}>
            <circleGeometry args={[2.8, 64]} />
            <meshBasicMaterial 
              color="#ef4444" 
              transparent 
              opacity={0.1}
              emissive="#ef4444"
              emissiveIntensity={0.2}
              depthWrite={false}
            />
          </mesh>

          {/* Shadow/Glow */}
          <mesh position={[0, 0, -0.2]}>
            <planeGeometry args={[3.5, 3.5]} />
            <meshBasicMaterial 
              color="#ef4444" 
              transparent 
              opacity={0.15}
              emissive="#ef4444"
              emissiveIntensity={0.1}
              depthWrite={false}
            />
          </mesh>
          
          {/* Icon */}
          <Html>
            <div className="w-48 -translate-x-24 -translate-y-24">
              <PDFIcon />
            </div>
          </Html>
        </group>

        {/* Orbiting particles with trail */}
        <OrbitingParticles position={[0, 0, 0]} color="#ef4444" speed={0.9} />
      </Float>

      {/* PNG Icon (Bottom-Right) */}
      <Float 
        speed={1.5} 
        rotationIntensity={0.5} 
        floatIntensity={0.4} 
        position={[5, -3, -3]}
        delay={0.5}
      >
        <group>
          {/* Energy waves - pulsing spheres */}
          <EnergyWaves position={[0, 0, 0]} color="#8b5cf6" />

          {/* Light rays */}
          <LightBeams position={[0, 0, -0.1]} color="#8b5cf6" />

          {/* Rotating rings */}
          <RotatingRings position={[0, 0, 0.2]} color="#8b5cf6" rotationSpeed={2} />

          {/* Large glowing halo */}
          <mesh position={[0, 0, -0.5]}>
            <circleGeometry args={[2.8, 64]} />
            <meshBasicMaterial 
              color="#8b5cf6" 
              transparent 
              opacity={0.1}
              emissive="#8b5cf6"
              emissiveIntensity={0.2}
              depthWrite={false}
            />
          </mesh>

          {/* Shadow/Glow */}
          <mesh position={[0, 0, -0.2]}>
            <planeGeometry args={[3.5, 3.5]} />
            <meshBasicMaterial 
              color="#8b5cf6" 
              transparent 
              opacity={0.15}
              emissive="#8b5cf6"
              emissiveIntensity={0.1}
              depthWrite={false}
            />
          </mesh>

          {/* Icon */}
          <Html>
            <div className="w-48 -translate-x-24 -translate-y-24">
              <PNGIcon />
            </div>
          </Html>
        </group>

        {/* Orbiting particles with trail */}
        <OrbitingParticles position={[0, 0, 0]} color="#8b5cf6" speed={0.9} />
      </Float>

      {/* Enhanced ambient sparkles */}
      <Sparkles 
        count={80} 
        speed={0.8} 
        scale={30} 
        size={2}
        opacity={0.2}
        noise={[3, 3, 3]}
      />
    </group>
  );
}
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import '../styles/ContactCharacter3D.css';

// Modern Humanoid Character Component (Icons8/Humaaans style)
const HumanoidCharacter = ({ position = [0, -1.5, 0], scale = 1 }) => {
  const groupRef = useRef();
  
  // Animation for the character
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Gentle floating animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    
    // Subtle head tilt
    if (groupRef.current.children[0]) {
      groupRef.current.children[0].rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Head */}
      <group position={[0, 2.7, 0]}>
        {/* Head shape */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#f4d1c6" roughness={0.7} />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
        </mesh>
        
        {/* Face features */}
        {/* Eyes */}
        <mesh position={[-0.15, 0.05, 0.4]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        <mesh position={[0.15, 0.05, 0.4]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        
        {/* Smile */}
        <mesh position={[0, -0.1, 0.4]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.15, 0.03, 16, 16, Math.PI]} />
          <meshBasicMaterial color="#333" />
        </mesh>
      </group>
      
      {/* Neck */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#f4d1c6" roughness={0.7} />
      </mesh>
      
      {/* Body */}
      <group position={[0, 1.3, 0]}>
        {/* Torso */}
        <mesh position={[0, 0.3, 0]}>
          <capsuleGeometry args={[0.4, 1.2, 8, 16]} />
          <meshStandardMaterial color="#4a80b5" roughness={0.7} />
        </mesh>
        
        {/* Shirt collar */}
        <mesh position={[0, 0.9, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 16, Math.PI]} />
          <meshStandardMaterial color="#3a6ca5" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Arms - Folded position */}
      <group position={[0, 1.5, 0.2]}>
        {/* Left upper arm */}
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
          <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
          <meshStandardMaterial color="#4a80b5" roughness={0.7} />
        </mesh>
        
        {/* Right upper arm */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI * 0.1]}>
          <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
          <meshStandardMaterial color="#4a80b5" roughness={0.7} />
        </mesh>
        
        {/* Left forearm - folded across chest */}
        <mesh position={[0.1, -0.1, 0.3]} rotation={[0, 0, Math.PI * 0.5]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial color="#4a80b5" roughness={0.7} />
        </mesh>
        
        {/* Right forearm - folded across chest */}
        <mesh position={[-0.1, -0.3, 0.3]} rotation={[0, 0, Math.PI * 0.5]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial color="#4a80b5" roughness={0.7} />
        </mesh>
        
        {/* Hands */}
        <mesh position={[0.4, -0.1, 0.3]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#f4d1c6" roughness={0.7} />
        </mesh>
        
        <mesh position={[-0.4, -0.3, 0.3]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#f4d1c6" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Lower body */}
      <group position={[0, 0, 0]}>
        {/* Pants */}
        <mesh position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.42, 0.8, 8, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        
        {/* Belt */}
        <mesh position={[0, 0.9, 0]}>
          <torusGeometry args={[0.42, 0.05, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>
      
      {/* Legs */}
      <group position={[0, -0.5, 0]}>
        {/* Left Leg */}
        <mesh position={[-0.22, 0, 0]}>
          <capsuleGeometry args={[0.15, 1.2, 8, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        
        {/* Right Leg */}
        <mesh position={[0.22, 0, 0]}>
          <capsuleGeometry args={[0.15, 1.2, 8, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        
        {/* Shoes */}
        <mesh position={[-0.22, -0.7, 0.1]} rotation={[Math.PI * 0.1, 0, 0]}>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        
        <mesh position={[0.22, -0.7, 0.1]} rotation={[Math.PI * 0.1, 0, 0]}>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Shadow */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

// Floating particles
const Particles = ({ count = 15 }) => {
  const mesh = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  
  // Generate random positions
  const dummy = new THREE.Object3D();
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);
  
  // Update particle positions
  useFrame((state) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      dummy.scale.set(s * 0.3, s * 0.3, s * 0.3);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial color="#f47cb4" transparent opacity={0.2} />
    </instancedMesh>
  );
};

// Main scene component
const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f47cb4" />
      
      <HumanoidCharacter position={[0, -1.5, 0]} scale={1.2} />
      
      <Particles count={15} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
};

// Main component
const ContactCharacter3D = () => {
  return (
    <div className="character-scene-container">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default ContactCharacter3D;
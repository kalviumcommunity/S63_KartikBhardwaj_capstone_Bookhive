import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import '../styles/BookScene3D.css';

// Book component with pages
const Book = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, onHover }) => {
  const bookRef = useRef();
  const pagesRef = useRef([]);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [openAngle, setOpenAngle] = useState(0);
  
  // Load textures with error handling
  let coverTexture, pageTexture;
  try {
    coverTexture = useTexture('/book-covers/book-cover-texture.jpg');
    pageTexture = useTexture('/book-covers/page-texture.jpg');
  } catch (error) {
    console.warn('Failed to load textures:', error);
    // Will use fallback colors defined below
  }
  
  // If textures aren't available, use these colors
  const coverColor = new THREE.Color('#f5a142');
  const pageColor = new THREE.Color('#f5f5f5');
  const spineColor = new THREE.Color('#d48a38');
  
  // Handle animation
  useFrame((state, delta) => {
    if (!bookRef.current) return;
    
    // Gentle floating animation
    bookRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    
    // Rotate slightly when hovered
    if (hovered && !active) {
      bookRef.current.rotation.y = THREE.MathUtils.lerp(
        bookRef.current.rotation.y,
        rotation[1] + 0.2,
        0.1
      );
    } else if (!active) {
      bookRef.current.rotation.y = THREE.MathUtils.lerp(
        bookRef.current.rotation.y,
        rotation[1],
        0.1
      );
    }
    
    // Open book animation when active
    if (active) {
      setOpenAngle(THREE.MathUtils.lerp(openAngle, Math.PI * 0.5, 0.05));
    } else {
      setOpenAngle(THREE.MathUtils.lerp(openAngle, 0, 0.1));
    }
    
    // Animate pages
    pagesRef.current.forEach((page, i) => {
      if (page) {
        const targetAngle = active ? Math.min(openAngle, (i / pagesRef.current.length) * Math.PI) : 0;
        page.rotation.y = THREE.MathUtils.lerp(page.rotation.y, targetAngle, 0.1);
      }
    });
  });
  
  // Number of pages
  const pageCount = 5;
  
  // Create pages
  const pages = Array(pageCount).fill().map((_, i) => {
    const thickness = 0.02;
    const pageWidth = 1;
    const pageHeight = 1.5;
    const pageDepth = thickness;
    
    return (
      <mesh
        key={i}
        ref={el => pagesRef.current[i] = el}
        position={[pageWidth / 2 - (i * thickness * 0.5), 0, 0]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[pageWidth, pageHeight, pageDepth]} />
        <meshStandardMaterial 
          map={pageTexture}
          color={pageTexture && pageTexture.image ? null : pageColor}
          roughness={0.7}
        />
      </mesh>
    );
  });
  
  return (
    <group
      ref={bookRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      onClick={() => setActive(!active)}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (onHover) onHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        if (onHover) onHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Book cover */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial 
          map={coverTexture}
          color={coverTexture && coverTexture.image ? null : coverColor}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      
      {/* Book spine */}
      <mesh position={[-0.55, 0, -0.05]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial 
          color={spineColor}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      
      {/* Book title */}
      <Text
        position={[0, 0, 0.06]}
        rotation={[0, 0, 0]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.8}
        lineHeight={1.2}
      >
        BookHive
      </Text>
      
      {/* Book pages */}
      <group position={[-0.5, 0, -0.05]}>
        {pages}
      </group>
    </group>
  );
};

// Floating particles
const Particles = ({ count = 50 }) => {
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
      <meshStandardMaterial color="#f5a142" transparent opacity={0.3} />
    </instancedMesh>
  );
};

// Main scene component
const Scene = () => {
  const [bookHovered, setBookHovered] = useState(false);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f5a142" />
      
      <Book 
        position={[0, 0, 0]} 
        rotation={[0, -0.3, 0]} 
        scale={1.5}
        onHover={setBookHovered}
      />
      
      <Particles count={30} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        rotateSpeed={0.5}
      />
    </>
  );
};

// Main component
const BookScene3D = () => {
  return (
    <div className="book-scene-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
      <div className="scene-overlay">
        <h3>Interactive 3D Book</h3>
        <p>Click to open the book</p>
      </div>
    </div>
  );
};

export default BookScene3D;
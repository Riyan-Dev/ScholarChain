// "use client";

// // This file is no longer used, replaced by network-background.tsx
// // Keeping it for reference but it's not imported anywhere

// import { useRef, useState } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { Environment, Float, Text3D } from "@react-three/drei";
// import * as THREE from "three";

// // Block component representing a single blockchain block
// function Block({ position, scale, color, speed, rotationFactor }) {
//   const meshRef = useRef();
//   const [hovered, setHovered] = useState(false);

//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.x =
//         Math.sin(state.clock.elapsedTime * speed * 0.2) * 0.1;
//       meshRef.current.rotation.y =
//         Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.1 * rotationFactor;
//       meshRef.current.position.y =
//         position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1;
//     }
//   });

//   return (
//     <mesh
//       ref={meshRef}
//       position={position}
//       scale={hovered ? scale.map((s) => s * 1.1) : scale}
//       onPointerOver={() => setHovered(true)}
//       onPointerOut={() => setHovered(false)}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial
//         color={hovered ? "#ffffff" : color}
//         metalness={0.6}
//         roughness={0.3}
//         emissive={hovered ? color : "#000000"}
//         emissiveIntensity={hovered ? 0.4 : 0}
//       />
//     </mesh>
//   );
// }

// // AI Node component
// function AINode({ position }) {
//   const meshRef = useRef();

//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += 0.01;
//       meshRef.current.position.y =
//         position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
//     }
//   });

//   return (
//     <group position={position}>
//       <mesh ref={meshRef}>
//         <sphereGeometry args={[0.7, 32, 32]} />
//         <meshStandardMaterial
//           color="#00ffff"
//           metalness={0.3}
//           roughness={0.2}
//           emissive="#00ffff"
//           emissiveIntensity={0.4}
//         />
//       </mesh>
//       <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
//         <Text3D
//           font="/fonts/Inter_Bold.json"
//           size={0.3}
//           height={0.05}
//           position={[-0.4, 1, 0]}
//           rotation={[0, 0, 0]}
//         >
//           AI
//           <meshStandardMaterial
//             color="#ffffff"
//             emissive="#00ffff"
//             emissiveIntensity={0.5}
//           />
//         </Text3D>
//       </Float>
//     </group>
//   );
// }

// // Connection lines between blocks
// function Connections({ blocks, aiPosition }) {
//   const linesRef = useRef();

//   useFrame((state) => {
//     if (linesRef.current) {
//       linesRef.current.rotation.y =
//         Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
//     }
//   });

//   return (
//     <group ref={linesRef}>
//       {blocks.map((block, index) => {
//         if (index < blocks.length - 1) {
//           return (
//             <line key={`line-${index}`}>
//               <bufferGeometry
//                 attach="geometry"
//                 onUpdate={(self) => {
//                   const positions = new Float32Array([
//                     block.position[0],
//                     block.position[1],
//                     block.position[2],
//                     blocks[index + 1].position[0],
//                     blocks[index + 1].position[1],
//                     blocks[index + 1].position[2],
//                   ]);
//                   self.setAttribute(
//                     "position",
//                     new THREE.BufferAttribute(positions, 3)
//                   );
//                 }}
//               />
//               <lineBasicMaterial
//                 attach="material"
//                 color="#80d8ff"
//                 linewidth={1}
//                 opacity={0.7}
//                 transparent
//               />
//             </line>
//           );
//         }
//         return null;
//       })}

//       {/* AI connections to blocks */}
//       {blocks
//         .filter((_, i) => i % 3 === 0)
//         .map((block, index) => (
//           <line key={`ai-line-${index}`}>
//             <bufferGeometry
//               attach="geometry"
//               onUpdate={(self) => {
//                 const positions = new Float32Array([
//                   aiPosition[0],
//                   aiPosition[1],
//                   aiPosition[2],
//                   block.position[0],
//                   block.position[1],
//                   block.position[2],
//                 ]);
//                 self.setAttribute(
//                   "position",
//                   new THREE.BufferAttribute(positions, 3)
//                 );
//               }}
//             />
//             <lineBasicMaterial
//               attach="material"
//               color="#00ffff"
//               linewidth={1}
//               opacity={0.5}
//               transparent
//               dashSize={0.2}
//               gapSize={0.1}
//             />
//           </line>
//         ))}
//     </group>
//   );
// }

// // Main scene component
// function BlockchainScene() {
//   // Define blocks data with lower Y positions
//   const blocks = [
//     {
//       position: [-4, -3, 0],
//       scale: [1.2, 1.2, 1.2],
//       color: "#0288d1",
//       speed: 0.5,
//       rotationFactor: 1,
//     },
//     {
//       position: [-2, -2.5, 1],
//       scale: [1, 1, 1],
//       color: "#039be5",
//       speed: 0.7,
//       rotationFactor: 0.8,
//     },
//     {
//       position: [0, -3, 0],
//       scale: [1.3, 1.3, 1.3],
//       color: "#03a9f4",
//       speed: 0.4,
//       rotationFactor: 1.2,
//     },
//     {
//       position: [2, -2.5, -1],
//       scale: [1.1, 1.1, 1.1],
//       color: "#29b6f6",
//       speed: 0.6,
//       rotationFactor: 0.9,
//     },
//     {
//       position: [4, -3, 0],
//       scale: [1, 1, 1],
//       color: "#4fc3f7",
//       speed: 0.5,
//       rotationFactor: 1,
//     },
//     {
//       position: [6, -2.5, 1],
//       scale: [0.9, 0.9, 0.9],
//       color: "#81d4fa",
//       speed: 0.8,
//       rotationFactor: 0.7,
//     },
//   ];

//   const aiPosition = [-1, -1, -3]; // Also adjust AI position to be lower

//   return (
//     <>
//       <ambientLight intensity={0.4} />
//       <pointLight position={[10, 10, 10]} intensity={0.8} />

//       {/* Render blocks */}
//       {blocks.map((block, index) => (
//         <Block
//           key={`block-${index}`}
//           position={block.position}
//           scale={block.scale}
//           color={block.color}
//           speed={block.speed}
//           rotationFactor={block.rotationFactor}
//         />
//       ))}

//       {/* AI Node */}
//       <AINode position={aiPosition} />

//       {/* Connections */}
//       <Connections blocks={blocks} aiPosition={aiPosition} />

//       {/* Environment */}
//       <Environment preset="night" />
//     </>
//   );
// }

// // Adjust the camera position to make the blocks appear lower
// export default function BlockchainBackground() {
//   return (
//     <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
//       <BlockchainScene />
//     </Canvas>
//   );
// }

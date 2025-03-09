import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function NetworkBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const basePositions = new Float32Array(particlesCount * 3);
    const velocities = [];
    const sizes = new Float32Array(particlesCount);

    // Create connections
    const connectionsGeometry = new THREE.BufferGeometry();
    const connectionsPositions = new Float32Array(particlesCount * 6);
    const connectionsIndices = [];

    // Initialize particles
    for (let i = 0; i < particlesCount; i++) {
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05,
      });

      sizes[i] = Math.random() * 0.5 + 0.5;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Particle material - updated to grayscale
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xcccccc, // Light gray color
      size: 0.5,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Line material for connections - updated to grayscale
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x888888, // Medium gray color
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });

    function updateConnections() {
      let connectionIndex = 0;

      for (let i = 0; i < particlesCount; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];

        for (let j = i + 1; j < particlesCount; j++) {
          const x2 = positions[j * 3];
          const y2 = positions[j * 3 + 1];
          const z2 = positions[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 5) {
            connectionsPositions[connectionIndex * 6] = x1;
            connectionsPositions[connectionIndex * 6 + 1] = y1;
            connectionsPositions[connectionIndex * 6 + 2] = z1;
            connectionsPositions[connectionIndex * 6 + 3] = x2;
            connectionsPositions[connectionIndex * 6 + 4] = y2;
            connectionsPositions[connectionIndex * 6 + 5] = z2;

            connectionIndex++;

            if (connectionIndex >= particlesCount - 1) break;
          }
        }

        if (connectionIndex >= particlesCount - 1) break;
      }

      const connectionLines = new THREE.BufferGeometry();
      connectionLines.setAttribute(
        "position",
        new THREE.BufferAttribute(
          connectionsPositions.slice(0, connectionIndex * 6),
          3
        )
      );

      scene.children.forEach((child) => {
        if (child instanceof THREE.LineSegments) {
          scene.remove(child);
        }
      });

      const lines = new THREE.LineSegments(connectionLines, lineMaterial);
      scene.add(lines);
    }

    const animate = () => {
      requestAnimationFrame(animate);

      for (let i = 0; i < particlesCount; i++) {
        const baseX = basePositions[i * 3];
        const baseY = basePositions[i * 3 + 1];
        const baseZ = basePositions[i * 3 + 2];

        const time = Date.now() * 0.001;
        const hoverX = Math.sin(time * 0.5 + i * 0.1) * 0.05;
        const hoverY = Math.sin(time * 0.3 + i * 0.05) * 0.05;
        const hoverZ = Math.sin(time * 0.7 + i * 0.02) * 0.05;

        positions[i * 3] = baseX + hoverX;
        positions[i * 3 + 1] = baseY + hoverY;
        positions[i * 3 + 2] = baseZ + hoverZ;
      }

      particles.attributes.position.needsUpdate = true;

      if (Math.random() < 0.05) {
        updateConnections();
      }

      particleSystem.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    updateConnections();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }

      particles.dispose();
      particleMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";

interface WaveMorphProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

export default function WaveMorph({
  width = "100%",
  height = "100vh",
  color = "#bb77ff",
}: WaveMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { frequency, speed, amount } = useControls("Deform", {
    frequency: { value: 4, min: 1, max: 10, step: 1 },
    speed: { value: 2, min: 0, max: 10, step: 0.1 },
    amount: { value: 0.2, min: 0, max: 2, step: 0.01 },
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Create mesh with wave effect
    const geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Position camera and mesh
    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);
    mesh.rotation.x = -Math.PI / 2;

    // Animation loop
    const animate = () => {
      const positions = geometry.attributes.position;
      const time = Date.now() * 0.001;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = Math.sin(frequency * (x + y) + time * speed) * amount;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [frequency, speed, amount, color]);

  return (
    <div style={{ width, height }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}

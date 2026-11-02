"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points } from "@react-three/drei";
import * as THREE from "three";

function ParticleCloud() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(210 * 3);
    for (let index = 0; index < 210; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 12;
      values[index * 3 + 1] = (Math.random() - 0.5) * 8;
      values[index * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return values;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * 0.018 + pointer.x * 0.025;
    points.current.rotation.x = pointer.y * 0.025;
  });

  return <Points ref={points} positions={positions} stride={3} frustumCulled>
    <pointsMaterial color="#7bffbb" size={0.018} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
  </Points>;
}

export default function ParticleField() {
  const [webglAvailable, setWebglAvailable] = useState(true);

  return <div className={`particle-canvas ${webglAvailable ? "" : "is-unavailable"}`} aria-hidden="true">
    <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.4]} gl={{ alpha: true, antialias: false, powerPreference: "low-power" }} onCreated={({ gl }) => {
      gl.setClearColor(new THREE.Color("#030504"), 0);
      const container = gl.domElement.closest(".particle-canvas");
      gl.domElement.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        container?.classList.add("is-unavailable");
        setWebglAvailable(false);
      });
      gl.domElement.addEventListener("webglcontextrestored", () => {
        container?.classList.remove("is-unavailable");
        setWebglAvailable(true);
      });
    }}>
      <ParticleCloud />
    </Canvas>
  </div>;
}

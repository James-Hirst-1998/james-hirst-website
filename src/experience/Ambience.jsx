import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const SNOW_COUNT = 700;
const BUBBLE_COUNT = 110;

// "Marine snow": slowly sinking particulate filling the whole water column.
export const MarineSnow = () => {
  const points = useRef();
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(SNOW_COUNT * 3);
    const speeds = new Float32Array(SNOW_COUNT);
    for (let i = 0; i < SNOW_COUNT; i++) {
      positions[i * 3] = THREE.MathUtils.randFloatSpread(80);
      positions[i * 3 + 1] = THREE.MathUtils.randFloat(-118, 12);
      // Straddles the camera (z=10) so snow surrounds you when looking around.
      positions[i * 3 + 2] = THREE.MathUtils.randFloat(-28, 44);
      speeds[i] = THREE.MathUtils.randFloat(0.15, 0.55);
    }
    return { positions, speeds };
  }, []);

  useFrame((state, delta) => {
    const pos = points.current.geometry.attributes.position;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < SNOW_COUNT; i++) {
      let y = pos.array[i * 3 + 1] - speeds[i] * delta;
      if (y < -118) y = 12;
      pos.array[i * 3 + 1] = y;
      pos.array[i * 3] += Math.sin(t * 0.4 + i) * delta * 0.12;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={SNOW_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color="#a8d8ea"
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

// Columns of bubbles rising through the scene.
export const Bubbles = () => {
  const points = useRef();
  const { positions, meta } = useMemo(() => {
    const positions = new Float32Array(BUBBLE_COUNT * 3);
    const meta = [];
    const columns = [-24, -11, -3, 7, 16, 26];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const cx = columns[i % columns.length];
      const x = cx + THREE.MathUtils.randFloatSpread(2.5);
      const y = THREE.MathUtils.randFloat(-118, 10);
      const z = THREE.MathUtils.randFloat(-18, 36);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      meta.push({ baseX: x, speed: THREE.MathUtils.randFloat(1.2, 2.6), phase: Math.random() * Math.PI * 2 });
    }
    return { positions, meta };
  }, []);

  useFrame((state, delta) => {
    const pos = points.current.geometry.attributes.position;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      let y = pos.array[i * 3 + 1] + meta[i].speed * delta;
      if (y > 10) y = -118;
      pos.array[i * 3 + 1] = y;
      pos.array[i * 3] = meta[i].baseX + Math.sin(t * 1.6 + meta[i].phase) * 0.35;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={BUBBLE_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        color="#d9f2fb"
        transparent
        opacity={0.65}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { scroll, pointer, depthToWorldY } from "./scrollState";
import { depthColor } from "./palette";
import { WaterSurface, GodRays } from "./Surface";
import { MarineSnow, Bubbles } from "./Ambience";
import { FishSchool, Shark, JellyfishBloom } from "./Creatures";
import { Seabed } from "./Seabed";

// Drives the camera down the water column with scroll, plus gentle
// pointer parallax so the world feels alive under the cursor.
const CameraRig = () => {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const ease = 1 - Math.pow(0.001, delta);
    const goalY = depthToWorldY(scroll.progress);
    camera.position.y += (goalY - camera.position.y) * ease;
    camera.position.x += (pointer.x * 1.6 - camera.position.x) * ease * 0.6;
    target.set(pointer.x * 3, camera.position.y + pointer.y * -1.2, -12);
    camera.lookAt(target);
  });
  return null;
};

// Background colour, fog and light all deepen as you descend.
const Environment = () => {
  const { scene } = useThree();
  const sun = useRef();
  const ambient = useRef();
  const glow = useRef();
  const color = useMemo(() => new THREE.Color(), []);
  const fog = useMemo(() => new THREE.Fog("#63bfe4", 10, 58), []);

  useFrame(({ camera }) => {
    const p = scroll.progress;
    depthColor(p, color);
    scene.background = color;
    fog.color = color;
    fog.far = 58 - p * 16;
    scene.fog = fog;
    if (sun.current) sun.current.intensity = THREE.MathUtils.lerp(1.6, 0.25, Math.min(p * 1.6, 1));
    if (ambient.current) ambient.current.intensity = THREE.MathUtils.lerp(0.9, 0.3, Math.min(p * 1.4, 1));
    if (glow.current) {
      glow.current.intensity = THREE.MathUtils.smoothstep(p, 0.35, 0.8) * 30;
      glow.current.position.set(camera.position.x, camera.position.y + 2, 2);
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.9} color="#cfeefc" />
      <directionalLight ref={sun} position={[12, 30, 8]} intensity={1.6} color="#eaf8ff" />
      <pointLight ref={glow} intensity={0} distance={40} color="#4fb3d9" />
    </>
  );
};

const Scene = () => (
  <>
    <CameraRig />
    <Environment />
    <WaterSurface />
    <GodRays />
    <MarineSnow />
    <Bubbles />
    <FishSchool center={[-4, -13, -10]} count={46} radius={9} speed={0.32} color="#c7d9e4" />
    <FishSchool center={[8, -26, -8]} count={28} radius={6} speed={0.45} color="#e8b46a" scale={0.7} direction={-1} />
    <FishSchool center={[-6, -38, -12]} count={36} radius={8} speed={0.28} color="#7fa8d9" scale={0.9} />
    <Shark center={[0, -50, -10]} radius={15} speed={0.13} />
    <JellyfishBloom />
    <FishSchool center={[6, -75, -9]} count={22} radius={5.5} speed={0.3} color="#9fb8c8" scale={0.75} />
    <FishSchool center={[-5, -89, -10]} count={20} radius={5} speed={0.35} color="#8fb0a4" scale={0.65} direction={-1} />
    <Seabed />
  </>
);

const OceanCanvas = () => (
  <div className="ocean-canvas" aria-hidden="true">
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 60, near: 0.1, far: 220, position: [0, 0, 10] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Scene />
    </Canvas>
  </div>
);

export default OceanCanvas;

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { scroll, pointer, look, depthToWorldY } from "./scrollState";
import { depthColor } from "./palette";
import { WaterSurface, GodRays } from "./Surface";
import { MarineSnow, Bubbles } from "./Ambience";
import {
  FishSchool,
  Shark,
  JellyfishBloom,
  Anglerfish,
  Whale,
  Turtle,
  MantaRay,
  Octopus,
  Orca,
  Hammerhead,
  Sunfish,
  GiantSquid,
  GulperEel,
  DumboOctopus,
  DolphinPod,
} from "./Creatures";
import { Seabed } from "./Seabed";

// Drives the camera down the water column with scroll. Look-around works
// like a submersible: past a central deadzone the view keeps turning, so
// holding the cursor at a screen edge sweeps a full 360°. Mouse height
// tilts the view, and the camera banks gently into turns.
const YAW_DEADZONE = 0.3;
const YAW_MAX_RATE = 1.1; // rad/s with the cursor at the screen edge

const CameraRig = () => {
  const { camera } = useThree();
  const rig = useRef({ yaw: 0, yawVel: 0, pitch: 0 });

  useFrame((_, delta) => {
    const r = rig.current;
    const ease = 1 - Math.pow(0.001, delta);
    const goalY = depthToWorldY(scroll.progress);
    camera.position.y += (goalY - camera.position.y) * ease;
    camera.position.x += (0 - camera.position.x) * ease * 0.6;

    if (look.active) {
      // Phone: swipes and/or the gyroscope set yaw/pitch targets — ease onto
      // them, banking slightly into the turn for a touch of submersible feel.
      const prevYaw = r.yaw;
      r.yaw += (look.yaw - r.yaw) * ease;
      r.pitch += (look.pitch - r.pitch) * ease;
      const bank = (r.yaw - prevYaw) * 2.2;
      camera.rotation.set(r.pitch, r.yaw, bank, "YXZ");
    } else {
      const overshoot = Math.abs(pointer.x) - YAW_DEADZONE;
      const drive =
        overshoot > 0
          ? Math.sign(pointer.x) * (overshoot / (1 - YAW_DEADZONE)) ** 2
          : 0;
      r.yawVel += (drive * YAW_MAX_RATE - r.yawVel) * ease;
      r.yaw -= r.yawVel * delta;
      r.pitch += (pointer.y * -0.3 - r.pitch) * ease * 0.7;
      camera.rotation.set(r.pitch, r.yaw, r.yawVel * 0.16, "YXZ");
    }
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
  const forward = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const p = scroll.progress;
    depthColor(p, color);
    scene.background = color;
    fog.color = color;
    fog.far = 58 - p * 16;
    scene.fog = fog;
    if (sun.current) sun.current.intensity = THREE.MathUtils.lerp(1.6, 0.2, Math.min(p * 2.1, 1));
    if (ambient.current) ambient.current.intensity = THREE.MathUtils.lerp(0.9, 0.26, Math.min(p * 1.8, 1));
    if (glow.current) {
      // The submersible's headlamp: sits ahead of the camera along the view
      // direction so it lights whatever you have turned to face.
      glow.current.intensity = THREE.MathUtils.smoothstep(p, 0.28, 0.7) * 30;
      camera.getWorldDirection(forward);
      glow.current.position.copy(camera.position).addScaledVector(forward, 6);
      glow.current.position.y += 2;
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
    {/* surface — a pod of dolphins porpoising overhead when you look up */}
    <DolphinPod center={[0, 9, -6]} count={5} radius={16} speed={0.32} />
    <FishSchool center={[-4, -13, -10]} count={46} radius={9} speed={0.32} color="#c7d9e4" />
    <Turtle center={[0, -10, 4]} radius={13} speed={0.09} />
    {/* sunlit zone — a lone sunfish sculling past */}
    <Sunfish center={[-6, -22, 8]} radius={13} speed={0.06} />
    <FishSchool center={[8, -26, -8]} count={28} radius={6} speed={0.45} color="#e8b46a" scale={0.7} direction={-1} />
    <FishSchool center={[-2, -22, 26]} count={24} radius={6} speed={0.36} color="#b9d3a8" scale={0.8} />
    <FishSchool center={[-6, -38, -12]} count={36} radius={8} speed={0.28} color="#7fa8d9" scale={0.9} />
    <FishSchool center={[7, -42, 24]} count={18} radius={5} speed={0.4} color="#d9c17f" scale={0.7} direction={-1} />
    {/* twilight zone — big predators cruising wide, slow circles */}
    <Hammerhead center={[4, -45, 8]} radius={13} speed={0.13} />
    <Shark center={[0, -50, -10]} radius={15} speed={0.13} />
    <Orca center={[-3, -54, -4]} radius={19} speed={0.09} />
    <MantaRay center={[0, -60, 5]} radius={15} speed={0.11} />
    <Whale />
    <JellyfishBloom />
    <FishSchool center={[6, -75, -9]} count={22} radius={5.5} speed={0.3} color="#6f8898" scale={0.75} />
    <FishSchool center={[-4, -80, 25]} count={14} radius={4.5} speed={0.26} color="#5f7484" scale={0.6} direction={-1} />
    {/* the deep dark — squid, anglerfish, gulper eel, dumbo octopus */}
    <GiantSquid center={[5, -82, -7]} radius={9} speed={0.07} />
    <Anglerfish center={[-4, -86, -8]} radius={6.5} speed={0.16} />
    <GulperEel center={[-5, -92, 6]} radius={8} speed={0.09} />
    <DumboOctopus position={[7, -97, -6]} />
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

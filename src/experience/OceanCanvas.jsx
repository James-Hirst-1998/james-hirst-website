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
  SpermWhale,
  Swordfish,
} from "./Creatures";
import { Seabed } from "./Seabed";
import { getSpotTargets, isSpotted, markSpotted } from "./diveLog";

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
      // Phone: the gyroscope steers. Raw sensor readings jitter, so ease onto
      // the target with a very short (~70 ms) time constant - enough to soak
      // up the shake, too quick to read as lag. (The old ~300 ms ease was the
      // laggy-look bug; don't slow this back down.)
      const smooth = 1 - Math.pow(0.000001, delta);
      const prevYaw = r.yaw;
      r.yaw += (look.yaw - r.yaw) * smooth;
      r.pitch += (look.pitch - r.pitch) * smooth;
      const bank = THREE.MathUtils.clamp((r.yaw - prevYaw) * 1.6, -0.3, 0.3);
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
  // Dev-only scene handle for poking at culling/lights from the console,
  // same spirit as window.__dive in scrollState.js.
  if (import.meta.env.DEV && typeof window !== "undefined") window.__scene = scene;
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

// Marks a creature as spotted once it has been properly *seen*: its whole
// bounding box inside the middle of the viewport (no one-pixel edge clips),
// near enough to be more than a speck in the fog, and held there for a beat.
// Targets are checked round-robin, two per frame, so the per-frame cost stays
// flat however many creatures register.
const SPOT_MARGIN = 0.85; // NDC |x|,|y| limit - "comfortably on screen"
const SPOT_MAX_DIST = 48; // beyond this it's fog-shrouded, not a sighting
const SPOT_MIN_SPAN = 0.04; // NDC size floor - excludes distant specks
const SPOT_DWELL_S = 0.75; // how long it must stay framed
const SPOT_GAP_S = 1.0; // dwell forgiveness between round-robin passes

const framed = (object, camera, box, corner, center) => {
  // Depth-culled creatures (or their pod/bloom root) aren't rendered, so
  // they can't be seen - walk up to the scene checking visibility.
  for (let o = object; o; o = o.parent) if (o.visible === false) return false;
  box.setFromObject(object);
  if (box.isEmpty()) return false;
  box.getCenter(center);
  if (center.distanceTo(camera.position) > SPOT_MAX_DIST) return false;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < 8; i++) {
    corner
      .set(
        i & 1 ? box.max.x : box.min.x,
        i & 2 ? box.max.y : box.min.y,
        i & 4 ? box.max.z : box.min.z
      )
      .applyMatrix4(camera.matrixWorldInverse);
    if (corner.z > -0.5) return false; // behind (or grazing) the camera
    corner.applyMatrix4(camera.projectionMatrix);
    if (Math.abs(corner.x) > SPOT_MARGIN || Math.abs(corner.y) > SPOT_MARGIN)
      return false;
    minX = Math.min(minX, corner.x);
    maxX = Math.max(maxX, corner.x);
    minY = Math.min(minY, corner.y);
    maxY = Math.max(maxY, corner.y);
  }
  return Math.max(maxX - minX, maxY - minY) >= SPOT_MIN_SPAN;
};

// Only creatures within (roughly) spotting distance get the full bounding-box
// test - squared distance straight off the world matrix costs nothing, and at
// any given depth all but a handful of creatures fail it.
const SPOT_PREGATE_SQ = (SPOT_MAX_DIST + 15) ** 2;

const SpotTracker = () => {
  const dwell = useMemo(() => new Map(), []);
  const frame = useRef(0);
  const box = useMemo(() => new THREE.Box3(), []);
  const corner = useMemo(() => new THREE.Vector3(), []);
  const center = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock }, delta) => {
    const targets = getSpotTargets();
    if (!targets.length) return;
    const now = clock.elapsedTime;
    frame.current += 1;
    // Dropped frames must not break a dwell: the forgiveness window scales
    // with the actual frame delta so slow devices can still complete one.
    const gap = Math.max(SPOT_GAP_S, delta * 8);
    for (let i = 0; i < targets.length; i++) {
      const { id, object } = targets[i];
      if (isSpotted(id)) continue;
      const e = object.matrixWorld.elements;
      const dx = e[12] - camera.position.x;
      const dy = e[13] - camera.position.y;
      const dz = e[14] - camera.position.z;
      if (dx * dx + dy * dy + dz * dz > SPOT_PREGATE_SQ) continue;
      // In-range targets take the full bounding-box test on every third
      // frame, staggered so they don't all land on the same one.
      if ((frame.current + i) % 3 !== 0) continue;
      if (!framed(object, camera, box, corner, center)) continue;
      const d = dwell.get(id);
      if (!d || now - d.last > gap) {
        dwell.set(id, { since: now, last: now });
      } else {
        d.last = now;
        if (now - d.since >= SPOT_DWELL_S) markSpotted(id);
      }
    }
  });
  return null;
};

const Scene = () => (
  <>
    <CameraRig />
    <Environment />
    <SpotTracker />
    <WaterSurface />
    <GodRays />
    <MarineSnow />
    <Bubbles />
    {/* surface - a pod of dolphins porpoising overhead when you look up */}
    <DolphinPod center={[0, 9, -6]} count={5} radius={16} speed={0.32} />
    <FishSchool center={[-4, -13, -10]} count={46} radius={9} speed={0.32} color="#c7d9e4" />
    <Turtle center={[0, -10, 4]} radius={13} speed={0.09} />
    {/* sunlit zone - a lone sunfish sculling past */}
    <Sunfish center={[-6, -22, 8]} radius={13} speed={0.06} />
    <FishSchool center={[8, -26, -8]} count={28} radius={6} speed={0.45} color="#e8b46a" scale={0.7} direction={-1} />
    <FishSchool center={[-2, -22, 26]} count={24} radius={6} speed={0.36} color="#b9d3a8" scale={0.8} />
    {/* a swordfish flashing past on the edge of the blue */}
    <Swordfish center={[4, -32, -2]} radius={16} speed={0.38} />
    <FishSchool center={[-6, -38, -12]} count={36} radius={8} speed={0.28} color="#7fa8d9" scale={0.9} />
    <FishSchool center={[7, -42, 24]} count={18} radius={5} speed={0.4} color="#d9c17f" scale={0.7} direction={-1} />
    {/* twilight zone - big predators cruising wide, slow circles */}
    <Hammerhead center={[4, -45, 8]} radius={13} speed={0.13} />
    <Shark center={[0, -50, -10]} radius={15} speed={0.13} />
    <Orca center={[-3, -54, -4]} radius={19} speed={0.09} />
    <MantaRay center={[0, -60, 5]} radius={15} speed={0.11} />
    <Whale />
    <JellyfishBloom />
    <FishSchool center={[6, -75, -9]} count={22} radius={5.5} speed={0.3} color="#6f8898" scale={0.75} />
    <FishSchool center={[-4, -80, 25]} count={14} radius={4.5} speed={0.26} color="#5f7484" scale={0.6} direction={-1} />
    {/* the deep dark - squid, anglerfish, gulper eel, dumbo octopus */}
    {/* the sperm whale hunts a wide circle above the giant squid */}
    <SpermWhale center={[-4, -74, -14]} radius={18} speed={0.045} />
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

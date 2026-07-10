import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// ---------------------------------------------------------------------------
// Every creature is authored twice over: a *Model* renders it at the origin
// facing +z with only its own idle motion (a tail swish, a wing beat, a
// pulse), and a scene wrapper carries that model along an orbit through the
// dive. The viewer page renders the models directly. One shape, two homes.
// ---------------------------------------------------------------------------

// Low-poly fish built from primitives, nose pointing along +z so lookAt works.
const buildFishGeometry = () => {
  const body = new THREE.SphereGeometry(0.5, 8, 6);
  body.scale(0.24, 0.42, 1);
  const tail = new THREE.ConeGeometry(0.26, 0.55, 4);
  tail.rotateX(Math.PI / 2);
  tail.scale(0.3, 1, 1);
  tail.translate(0, 0, -0.62);
  return mergeGeometries([body, tail]);
};

let fishGeometry = null;
const getFishGeometry = () => {
  if (!fishGeometry) fishGeometry = buildFishGeometry();
  return fishGeometry;
};

// A school of instanced fish circling a centre point with individual wobble.
export const FishSchool = ({
  center = [0, -20, -8],
  count = 40,
  radius = 8,
  speed = 0.3,
  color = "#b8ccd8",
  scale = 1,
  direction = 1,
}) => {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const fish = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        r: radius * THREE.MathUtils.randFloat(0.6, 1.25),
        phase: Math.random() * Math.PI * 2,
        bob: THREE.MathUtils.randFloat(0.4, 1.4),
        bobSpeed: THREE.MathUtils.randFloat(1.2, 2.4),
        size: THREE.MathUtils.randFloat(0.7, 1.25) * scale,
        squish: THREE.MathUtils.randFloat(0.55, 0.8),
      });
    }
    return list;
  }, [count, radius, scale]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < fish.length; i++) {
      const f = fish[i];
      const a = (t * speed + f.phase) * direction;
      const x = center[0] + Math.cos(a) * f.r;
      const z = center[2] + Math.sin(a) * f.r * f.squish;
      const y = center[1] + Math.sin(t * f.bobSpeed + f.phase) * f.bob;
      dummy.position.set(x, y, z);
      const aheadA = a + 0.1 * direction;
      target.set(
        center[0] + Math.cos(aheadA) * f.r,
        y,
        center[2] + Math.sin(aheadA) * f.r * f.squish
      );
      dummy.lookAt(target);
      const s = f.size;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[getFishGeometry(), null, count]} frustumCulled={false}>
      <meshStandardMaterial color={color} flatShading roughness={0.6} metalness={0.25} />
    </instancedMesh>
  );
};

// ===========================================================================
// Models — origin-centred, nose along +z, self-contained idle animation.
// ===========================================================================

// A stylised shark: stretched body, pale belly, a fan of cone fins.
export const SharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 2.2) * 0.45;
  });
  const bodyColor = "#6b8a9c";
  const bellyColor = "#a9c2cd";
  const bodyMat = (
    <meshStandardMaterial color={bodyColor} emissive="#1c3140" emissiveIntensity={0.5} flatShading roughness={0.55} />
  );
  return (
    <group>
      <mesh scale={[0.5, 0.55, 1.75]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* tapered snout */}
      <mesh position={[0, -0.02, 1.55]} scale={[0.3, 0.32, 0.55]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      {/* pale belly tucked under the body line, stopping short of the head */}
      <mesh position={[0, -0.2, 0.15]} scale={[0.38, 0.32, 0.95]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={bellyColor} flatShading roughness={0.6} />
      </mesh>
      {/* white lower jaw with a dark mouth line at the seam */}
      <mesh position={[0, -0.22, 1.42]} scale={[0.21, 0.16, 0.42]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={bellyColor} flatShading roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.3, 1.62]} rotation-x={0.3} scale={[0.17, 0.022, 0.13]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#131c23" roughness={0.8} />
      </mesh>
      {/* eyes on the sides of the snout */}
      <mesh position={[0.27, 0.12, 1.45]} scale={0.055}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.27, 0.12, 1.45]} scale={0.055}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* dorsal fin swept back */}
      <mesh position={[0, 0.68, -0.05]} rotation-x={-0.45} geometry={finGeometry}>
        {bodyMat}
      </mesh>
      {/* pectorals angled down and back */}
      <mesh position={[0.55, -0.2, 0.45]} rotation-z={-2.1} rotation-x={0.5} geometry={finGeometry}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.55, -0.2, 0.45]} rotation-z={2.1} rotation-x={0.5} geometry={finGeometry}>
        {bodyMat}
      </mesh>
      {/* tail: a tapering peduncle carrying the two-lobed caudal fin */}
      <group ref={tail} position={[0, 0, -1.6]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.24, 0.7, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.3, -0.42]} rotation-x={-2.45} geometry={finGeometry} scale={1.1}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.2, -0.38]} rotation-x={2.65} geometry={finGeometry} scale={0.65}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// A hammerhead: shark build with the signature wide sensory head bar.
export const HammerheadModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 2.0) * 0.4;
  });
  const bodyColor = "#7c8f8a";
  const bellyColor = "#cdd8cf";
  const mat = (
    <meshStandardMaterial color={bodyColor} emissive="#20302c" emissiveIntensity={0.4} flatShading roughness={0.6} />
  );
  return (
    <group>
      <mesh scale={[0.44, 0.5, 1.7]}>
        <sphereGeometry args={[1, 12, 9]} />
        {mat}
      </mesh>
      <mesh position={[0, -0.2, 0.3]} scale={[0.36, 0.32, 1.1]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={bellyColor} flatShading roughness={0.65} />
      </mesh>
      {/* cephalofoil — the flattened head bar, rounded caps and eyes at the tips */}
      <mesh position={[0, -0.02, 1.28]} scale={[1.1, 0.14, 0.3]}>
        <boxGeometry args={[1, 1, 1]} />
        {mat}
      </mesh>
      <mesh position={[0.55, -0.02, 1.28]} scale={[0.09, 0.07, 0.15]}>
        <sphereGeometry args={[1, 8, 6]} />
        {mat}
      </mesh>
      <mesh position={[-0.55, -0.02, 1.28]} scale={[0.09, 0.07, 0.15]}>
        <sphereGeometry args={[1, 8, 6]} />
        {mat}
      </mesh>
      <mesh position={[0.6, -0.02, 1.28]} scale={0.07}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#101518" roughness={0.35} />
      </mesh>
      <mesh position={[-0.6, -0.02, 1.28]} scale={0.07}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#101518" roughness={0.35} />
      </mesh>
      {/* dorsal + pectorals swept back */}
      <mesh position={[0, 0.64, 0.05]} rotation-x={-0.4} geometry={finGeometry} scale={1.1}>
        {mat}
      </mesh>
      <mesh position={[0.5, -0.18, 0.5]} rotation-z={-2.1} rotation-x={0.5} geometry={finGeometry}>
        {mat}
      </mesh>
      <mesh position={[-0.5, -0.18, 0.5]} rotation-z={2.1} rotation-x={0.5} geometry={finGeometry}>
        {mat}
      </mesh>
      {/* tail: tapering peduncle into the two-lobed caudal fin */}
      <group ref={tail} position={[0, 0, -1.55]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.22, 0.65, 6]} />
          {mat}
        </mesh>
        <mesh position={[0, 0.32, -0.42]} rotation-x={-2.45} geometry={finGeometry} scale={1.2}>
          {mat}
        </mesh>
        <mesh position={[0, -0.18, -0.36]} rotation-x={2.65} geometry={finGeometry} scale={0.6}>
          {mat}
        </mesh>
      </group>
    </group>
  );
};

// An orca: blunt black body, white belly and eye patches, tall dorsal and
// horizontal tail flukes that beat up and down.
export const OrcaModel = () => {
  const flukes = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flukes.current) flukes.current.rotation.x = Math.sin(t * 1.7) * 0.16;
  });
  const black = "#12161c";
  const white = "#eef4f5";
  const blackMat = (
    <meshStandardMaterial color={black} flatShading roughness={0.45} metalness={0.1} />
  );
  return (
    <group scale={1.1}>
      <mesh scale={[0.52, 0.58, 1.65]}>
        <sphereGeometry args={[1, 14, 10]} />
        {blackMat}
      </mesh>
      {/* snout with a white chin underneath */}
      <mesh position={[0, -0.06, 1.2]} scale={[0.34, 0.36, 0.55]}>
        <sphereGeometry args={[1, 12, 9]} />
        {blackMat}
      </mesh>
      <mesh position={[0, -0.22, 1.22]} scale={[0.24, 0.22, 0.45]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={white} flatShading roughness={0.5} />
      </mesh>
      {/* white belly, tucked so only the underside shows */}
      <mesh position={[0, -0.34, 0.1]} scale={[0.3, 0.28, 1.1]}>
        <sphereGeometry args={[1, 12, 9]} />
        <meshStandardMaterial color={white} flatShading roughness={0.5} />
      </mesh>
      {/* oval eye patches lying along the flanks above the eye line */}
      <mesh position={[0.38, 0.16, 0.9]} rotation-x={-0.35} rotation-z={-0.5} scale={[0.06, 0.09, 0.24]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={white} roughness={0.5} />
      </mesh>
      <mesh position={[-0.38, 0.16, 0.9]} rotation-x={-0.35} rotation-z={0.5} scale={[0.06, 0.09, 0.24]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={white} roughness={0.5} />
      </mesh>
      {/* grey saddle hugging the back behind the dorsal */}
      <mesh position={[0, 0.44, -0.5]} scale={[0.32, 0.07, 0.42]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#4a5a66" flatShading />
      </mesh>
      {/* tall dorsal fin */}
      <mesh position={[0, 0.62, -0.05]} rotation-x={-0.22} scale={[0.14, 1, 0.5]}>
        <coneGeometry args={[0.42, 1.3, 4]} />
        {blackMat}
      </mesh>
      {/* paddle-shaped pectoral fins */}
      <mesh position={[0.5, -0.28, 0.55]} rotation-z={-0.55} rotation-x={0.4} scale={[0.36, 0.06, 0.26]}>
        <sphereGeometry args={[1, 8, 6]} />
        {blackMat}
      </mesh>
      <mesh position={[-0.5, -0.28, 0.55]} rotation-z={0.55} rotation-x={0.4} scale={[0.36, 0.06, 0.26]}>
        <sphereGeometry args={[1, 8, 6]} />
        {blackMat}
      </mesh>
      {/* tail stock into notched horizontal flukes */}
      <group ref={flukes} position={[0, 0, -1.6]}>
        <mesh position={[0, 0, 0.1]} rotation-x={-Math.PI / 2} scale={[0.8, 1, 1]}>
          <coneGeometry args={[0.2, 0.6, 6]} />
          {blackMat}
        </mesh>
        <mesh position={[0.32, 0, -0.16]} rotation-y={0.4} scale={[0.42, 0.06, 0.26]}>
          <sphereGeometry args={[1, 8, 6]} />
          {blackMat}
        </mesh>
        <mesh position={[-0.32, 0, -0.16]} rotation-y={-0.4} scale={[0.42, 0.06, 0.26]}>
          <sphereGeometry args={[1, 8, 6]} />
          {blackMat}
        </mesh>
      </group>
    </group>
  );
};

// A bottlenose dolphin — sleek grey body, hooked dorsal, a beak up front and
// horizontal flukes it beats as it swims.
export const DolphinModel = () => {
  const flukes = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flukes.current) flukes.current.rotation.x = Math.sin(t * 3.2) * 0.22;
  });
  const grey = "#8b98a3";
  const pale = "#dfe7ea";
  const greyMat = (
    <meshStandardMaterial color={grey} flatShading roughness={0.5} metalness={0.08} />
  );
  return (
    <group>
      {/* body */}
      <mesh scale={[0.4, 0.44, 1.3]}>
        <sphereGeometry args={[1, 14, 10]} />
        {greyMat}
      </mesh>
      {/* pale belly tucked under the body line */}
      <mesh position={[0, -0.24, 0.05]} scale={[0.26, 0.26, 0.95]}>
        <sphereGeometry args={[1, 12, 9]} />
        <meshStandardMaterial color={pale} flatShading roughness={0.55} />
      </mesh>
      {/* melon blending off the body into a protruding beak */}
      <mesh position={[0, 0.01, 1.0]} scale={[0.3, 0.33, 0.52]}>
        <sphereGeometry args={[1, 12, 9]} />
        {greyMat}
      </mesh>
      <mesh position={[0, -0.06, 1.48]} scale={[0.13, 0.1, 0.3]}>
        <sphereGeometry args={[1, 10, 8]} />
        {greyMat}
      </mesh>
      {/* pale lower jaw giving it the bottlenose smile */}
      <mesh position={[0, -0.13, 1.42]} scale={[0.11, 0.07, 0.27]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={pale} flatShading roughness={0.55} />
      </mesh>
      {/* eyes just behind the beak crease */}
      <mesh position={[0.26, -0.02, 1.15]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#12161b" roughness={0.3} />
      </mesh>
      <mesh position={[-0.26, -0.02, 1.15]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#12161b" roughness={0.3} />
      </mesh>
      {/* hooked dorsal fin, swept back */}
      <mesh position={[0, 0.48, -0.05]} rotation-x={-0.5} scale={[0.08, 0.85, 0.5]}>
        <coneGeometry args={[0.36, 1, 4]} />
        {greyMat}
      </mesh>
      {/* pectoral fins */}
      <mesh position={[0.36, -0.16, 0.45]} rotation-z={-0.7} rotation-x={0.3} scale={[0.34, 0.05, 0.22]}>
        <sphereGeometry args={[1, 8, 6]} />
        {greyMat}
      </mesh>
      <mesh position={[-0.36, -0.16, 0.45]} rotation-z={0.7} rotation-x={0.3} scale={[0.34, 0.05, 0.22]}>
        <sphereGeometry args={[1, 8, 6]} />
        {greyMat}
      </mesh>
      {/* tail stock tapering into two-lobed flukes */}
      <group ref={flukes} position={[0, 0, -1.2]}>
        <mesh position={[0, 0, 0.02]} rotation-x={-Math.PI / 2} scale={[0.75, 1, 1]}>
          <coneGeometry args={[0.17, 0.55, 6]} />
          {greyMat}
        </mesh>
        <mesh position={[0.26, 0, -0.22]} rotation-y={0.42} scale={[0.34, 0.05, 0.2]}>
          <sphereGeometry args={[1, 8, 6]} />
          {greyMat}
        </mesh>
        <mesh position={[-0.26, 0, -0.22]} rotation-y={-0.42} scale={[0.34, 0.05, 0.2]}>
          <sphereGeometry args={[1, 8, 6]} />
          {greyMat}
        </mesh>
      </group>
    </group>
  );
};

// A humpback whale — long dark body, pale grooved throat, the signature long
// white flippers, and a broad two-lobed fluke on a tapering tail stock.
export const WhaleModel = () => {
  const tail = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.x = Math.sin(t * 1.1) * 0.18;
  });
  const dark = "#16303f";
  const darkMat = <meshStandardMaterial color={dark} flatShading roughness={0.7} />;
  return (
    <group scale={2.6}>
      <mesh scale={[0.6, 0.62, 2.4]}>
        <sphereGeometry args={[1, 14, 10]} />
        {darkMat}
      </mesh>
      {/* rounded head tapering to the snout */}
      <mesh position={[0, -0.06, 1.8]} scale={[0.44, 0.42, 0.85]}>
        <sphereGeometry args={[1, 12, 9]} />
        {darkMat}
      </mesh>
      {/* pale pleated throat tucked under the jaw */}
      <mesh position={[0, -0.28, 1.35]} scale={[0.38, 0.3, 0.95]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#41606f" flatShading roughness={0.75} />
      </mesh>
      {/* eyes low on the jaw line */}
      <mesh position={[0.42, -0.16, 1.85]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0b1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.42, -0.16, 1.85]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0b1216" roughness={0.35} />
      </mesh>
      {/* the long white flippers, swept back like wings */}
      <mesh position={[1.05, -0.3, 0.55]} rotation-z={-0.3} rotation-y={0.5} scale={[0.75, 0.045, 0.22]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#c3d2d8" flatShading roughness={0.6} />
      </mesh>
      <mesh position={[-1.05, -0.3, 0.55]} rotation-z={0.3} rotation-y={-0.5} scale={[0.75, 0.045, 0.22]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#c3d2d8" flatShading roughness={0.6} />
      </mesh>
      {/* the stubby dorsal hump */}
      <mesh position={[0, 0.56, -0.85]} rotation-x={-0.5} scale={[0.08, 0.35, 0.4]}>
        <coneGeometry args={[0.5, 1, 4]} />
        {darkMat}
      </mesh>
      {/* tail stock tapering into broad two-lobed flukes */}
      <group ref={tail} position={[0, 0.04, -2.3]}>
        <mesh position={[0, 0, -0.25]} rotation-x={-Math.PI / 2} scale={[0.7, 1, 1]}>
          <coneGeometry args={[0.3, 0.9, 6]} />
          {darkMat}
        </mesh>
        <mesh position={[0.42, 0, -0.68]} rotation-y={0.45} scale={[0.52, 0.05, 0.28]}>
          <sphereGeometry args={[1, 8, 6]} />
          {darkMat}
        </mesh>
        <mesh position={[-0.42, 0, -0.68]} rotation-y={-0.45} scale={[0.52, 0.05, 0.28]}>
          <sphereGeometry args={[1, 8, 6]} />
          {darkMat}
        </mesh>
      </group>
    </group>
  );
};

// A manta ray — flat diamond body with wings that beat gently.
export const MantaModel = () => {
  const wingL = useRef();
  const wingR = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flap = Math.sin(t * 1.3);
    if (wingL.current) wingL.current.rotation.z = flap * 0.45;
    if (wingR.current) wingR.current.rotation.z = -flap * 0.45;
  });
  return (
    <group scale={1.5}>
      <mesh scale={[0.42, 0.16, 0.9]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#33505e" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.06, 0.2]} scale={[0.36, 0.1, 0.7]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#9fb6bd" flatShading roughness={0.75} />
      </mesh>
      <group ref={wingL}>
        <mesh position={[0.85, 0, -0.05]} rotation-y={-0.25} scale={[0.85, 0.05, 0.55]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#33505e" flatShading roughness={0.7} />
        </mesh>
      </group>
      <group ref={wingR}>
        <mesh position={[-0.85, 0, -0.05]} rotation-y={0.25} scale={[0.85, 0.05, 0.55]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#33505e" flatShading roughness={0.7} />
        </mesh>
      </group>
      {/* cephalic fins curling forward either side of the mouth */}
      <mesh position={[0.17, -0.03, 0.92]} rotation-x={-0.35} rotation-z={0.15} scale={[0.05, 0.07, 0.2]}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#33505e" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[-0.17, -0.03, 0.92]} rotation-x={-0.35} rotation-z={-0.15} scale={[0.05, 0.07, 0.2]}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#33505e" flatShading roughness={0.7} />
      </mesh>
      {/* eyes out on the sides of the head */}
      <mesh position={[0.3, 0.02, 0.62]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#10181c" roughness={0.35} />
      </mesh>
      <mesh position={[-0.3, 0.02, 0.62]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#10181c" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, -1.25]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.015, 0.05, 0.9, 4]} />
        <meshStandardMaterial color="#33505e" roughness={0.8} />
      </mesh>
    </group>
  );
};

// A sea turtle cruising the shallows, front flippers flapping together.
export const TurtleModel = () => {
  const flipperL = useRef();
  const flipperR = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const beat = Math.sin(t * 1.6) * 0.3;
    if (flipperL.current) flipperL.current.rotation.z = -0.15 + beat;
    if (flipperR.current) flipperR.current.rotation.z = 0.15 - beat;
  });
  const skinMat = <meshStandardMaterial color="#8fae7e" flatShading roughness={0.8} />;
  return (
    <group scale={1.15}>
      {/* carapace with a paler rim ring, pale plastron tucked underneath */}
      <mesh position={[0, 0.08, 0]} scale={[0.6, 0.32, 0.82]}>
        <sphereGeometry args={[1, 12, 9]} />
        <meshStandardMaterial color="#3f6a4c" flatShading roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.04, 0]} scale={[0.68, 0.18, 0.92]}>
        <sphereGeometry args={[1, 12, 6]} />
        <meshStandardMaterial color="#5b8760" flatShading roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.12, 0]} scale={[0.56, 0.13, 0.8]}>
        <sphereGeometry args={[1, 10, 6]} />
        <meshStandardMaterial color="#cfc290" flatShading roughness={0.85} />
      </mesh>
      {/* neck reaching forward into a head with eyes on the sides */}
      <mesh position={[0, -0.03, 0.9]} rotation-x={Math.PI / 2 - 0.25} scale={[0.13, 0.24, 0.12]}>
        <cylinderGeometry args={[0.85, 1, 1, 8]} />
        {skinMat}
      </mesh>
      <mesh position={[0, 0.03, 1.06]} scale={[0.14, 0.14, 0.2]}>
        <sphereGeometry args={[1, 10, 8]} />
        {skinMat}
      </mesh>
      <mesh position={[0.11, 0.07, 1.1]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#1a221c" roughness={0.4} />
      </mesh>
      <mesh position={[-0.11, 0.07, 1.1]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#1a221c" roughness={0.4} />
      </mesh>
      {/* long front flippers sweeping back from under the shell rim */}
      <group ref={flipperL} position={[0.5, -0.06, 0.5]}>
        <mesh position={[0.36, -0.02, -0.14]} rotation-y={0.6} rotation-z={-0.08} scale={[0.46, 0.05, 0.16]}>
          <sphereGeometry args={[1, 8, 6]} />
          {skinMat}
        </mesh>
      </group>
      <group ref={flipperR} position={[-0.5, -0.06, 0.5]}>
        <mesh position={[-0.36, -0.02, -0.14]} rotation-y={-0.6} rotation-z={0.08} scale={[0.46, 0.05, 0.16]}>
          <sphereGeometry args={[1, 8, 6]} />
          {skinMat}
        </mesh>
      </group>
      {/* rear flippers and a stubby tail */}
      <mesh position={[0.4, -0.08, -0.72]} rotation-y={-0.75} scale={[0.28, 0.045, 0.13]}>
        <sphereGeometry args={[1, 8, 6]} />
        {skinMat}
      </mesh>
      <mesh position={[-0.4, -0.08, -0.72]} rotation-y={0.75} scale={[0.28, 0.045, 0.13]}>
        <sphereGeometry args={[1, 8, 6]} />
        {skinMat}
      </mesh>
      <mesh position={[0, -0.05, -0.9]} scale={[0.06, 0.045, 0.13]}>
        <sphereGeometry args={[1, 6, 5]} />
        {skinMat}
      </mesh>
    </group>
  );
};

// An ocean sunfish — a tall laterally-flattened disc with towering dorsal and
// anal fins it sculls side to side, and a stubby rudder for a tail.
export const SunfishModel = () => {
  const dorsal = useRef();
  const anal = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sway = Math.sin(t * 1.5) * 0.22;
    if (dorsal.current) dorsal.current.rotation.y = sway;
    if (anal.current) anal.current.rotation.y = -sway;
  });
  const body = "#9aa7ad";
  return (
    <group scale={1.3}>
      {/* disc body — thin across x, tall in y */}
      <mesh scale={[0.17, 0.95, 0.8]}>
        <sphereGeometry args={[1, 14, 12]} />
        <meshStandardMaterial color={body} flatShading roughness={0.7} />
      </mesh>
      {/* pale underside */}
      <mesh position={[0, -0.4, 0.05]} scale={[0.16, 0.5, 0.6]}>
        <sphereGeometry args={[1, 12, 9]} />
        <meshStandardMaterial color="#c4ccce" flatShading roughness={0.75} />
      </mesh>
      {/* towering dorsal fin, swept slightly back */}
      <group ref={dorsal} position={[0, 0.85, -0.12]} rotation-x={0.12}>
        <mesh scale={[0.09, 1, 0.6]}>
          <coneGeometry args={[0.4, 1.15, 3]} />
          <meshStandardMaterial color={body} flatShading roughness={0.7} />
        </mesh>
      </group>
      {/* mirrored anal fin below */}
      <group ref={anal} position={[0, -0.85, -0.12]} rotation-x={-0.12}>
        <mesh rotation-z={Math.PI} scale={[0.09, 1, 0.6]}>
          <coneGeometry args={[0.4, 1.15, 3]} />
          <meshStandardMaterial color={body} flatShading roughness={0.7} />
        </mesh>
      </group>
      {/* clavus — a vertical rudder band merged into the body's rear edge */}
      <mesh position={[0, 0, -0.58]} scale={[0.11, 0.68, 0.32]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color="#8b989e" flatShading roughness={0.75} />
      </mesh>
      {/* small pectoral fins just behind the head */}
      <mesh position={[0.15, 0.12, 0.3]} rotation-z={-0.9} rotation-y={0.3} scale={[0.05, 0.2, 0.12]}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#8b989e" flatShading roughness={0.75} />
      </mesh>
      <mesh position={[-0.15, 0.12, 0.3]} rotation-z={0.9} rotation-y={-0.3} scale={[0.05, 0.2, 0.12]}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#8b989e" flatShading roughness={0.75} />
      </mesh>
      {/* eyes sitting on the flanks + small puckered mouth at the front */}
      <mesh position={[0.11, 0.16, 0.56]} scale={0.055}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0e1417" />
      </mesh>
      <mesh position={[-0.11, 0.16, 0.56]} scale={0.055}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0e1417" />
      </mesh>
      <mesh position={[0, 0.02, 0.79]} scale={[0.06, 0.05, 0.06]}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#5f6a6d" />
      </mesh>
    </group>
  );
};

// Softly pulsing jellyfish body — bell breathes, tentacles sway. Drift is the
// wrapper's job.
export const JellyfishModel = ({ tint = "#c9a2e8", phase = 0 }) => {
  const bell = useRef();
  const tentacles = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.9 + phase) * 0.13;
    if (bell.current) bell.current.scale.set(pulse, 1.9 - pulse * 0.75, pulse);
    if (tentacles.current) {
      tentacles.current.rotation.x = Math.sin(t * 0.9 + phase) * 0.12;
      tentacles.current.rotation.z = Math.cos(t * 0.7 + phase) * 0.12;
    }
  });
  return (
    <group>
      <mesh ref={bell}>
        <sphereGeometry args={[0.55, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={tint}
          emissive={tint}
          emissiveIntensity={0.35}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>
      {/* faint glow inside the bell */}
      <mesh position={[0, 0.12, 0]} scale={[0.3, 0.22, 0.3]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={tint} emissive={tint} emissiveIntensity={0.9} transparent opacity={0.35} />
      </mesh>
      <group ref={tentacles}>
        {/* a skirt of fine tentacles around the rim, each its own length and drift */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const len = 0.85 + ((i * 37) % 5) * 0.11;
          const lean = 0.12 + ((i * 13) % 3) * 0.05;
          return (
            <group
              key={i}
              position={[Math.cos(a) * 0.42, -0.02, Math.sin(a) * 0.42]}
              rotation-x={Math.sin(a) * lean}
              rotation-z={-Math.cos(a) * lean}
            >
              <mesh position={[0, -len / 2, 0]}>
                <cylinderGeometry args={[0.008, 0.02, len, 4]} />
                <meshStandardMaterial color={tint} transparent opacity={0.45} />
              </mesh>
            </group>
          );
        })}
        {/* four thicker frilly oral arms trailing from the centre */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + 0.4;
          return (
            <mesh
              key={`arm-${i}`}
              position={[Math.cos(a) * 0.1, -0.4, Math.sin(a) * 0.1]}
              rotation-x={Math.sin(a) * 0.08}
              rotation-z={-Math.cos(a) * 0.08}
            >
              <cylinderGeometry args={[0.015, 0.055, 0.8, 5]} />
              <meshStandardMaterial color={tint} emissive={tint} emissiveIntensity={0.2} transparent opacity={0.55} flatShading />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

// An anglerfish, all but invisible except the glowing lure ahead of its jaws.
export const AnglerfishModel = () => {
  const lure = useRef();
  const lureLight = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lure.current) lure.current.position.y = 0.78 + Math.sin(t * 2.6) * 0.06;
    if (lureLight.current)
      lureLight.current.intensity = 5.5 + Math.sin(t * 5.3) * 1.4 + Math.sin(t * 11.7) * 0.6;
  });
  const hide = "#1b242d";
  const hideMat = (
    <meshStandardMaterial color={hide} emissive="#0e1a24" emissiveIntensity={0.4} flatShading roughness={0.85} />
  );
  const toothMat = (
    <meshStandardMaterial color="#e8f0f2" emissive="#b8c8cc" emissiveIntensity={0.3} roughness={0.4} />
  );
  return (
    <group>
      <mesh scale={[0.55, 0.62, 0.85]}>
        <sphereGeometry args={[1, 10, 8]} />
        {hideMat}
      </mesh>
      {/* the gaping maw: dark cavity between the upper lip and an open lower jaw */}
      <mesh position={[0, -0.15, 0.58]} scale={[0.37, 0.24, 0.3]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#04060a" roughness={1} />
      </mesh>
      <mesh position={[0, -0.38, 0.52]} rotation-x={0.45} scale={[0.42, 0.14, 0.45]}>
        <sphereGeometry args={[1, 8, 6]} />
        {hideMat}
      </mesh>
      {/* needle teeth — a row hanging from the lip, a row rising off the jaw */}
      {[-0.21, -0.07, 0.07, 0.21].map((x) => (
        <mesh key={`ut-${x}`} position={[x, -0.14, 0.74]} rotation-x={Math.PI - 0.25}>
          <coneGeometry args={[0.022, 0.17, 5]} />
          {toothMat}
        </mesh>
      ))}
      {[-0.26, -0.13, 0, 0.13, 0.26].map((x) => (
        <mesh key={`lt-${x}`} position={[x, -0.27, 0.8]} rotation-x={-0.35}>
          <coneGeometry args={[0.022, 0.19, 5]} />
          {toothMat}
        </mesh>
      ))}
      {/* small pale eyes catching the lure light */}
      <mesh position={[0.33, 0.2, 0.6]} scale={0.07}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#cfe2e6" emissive="#8fb6bd" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[-0.33, 0.2, 0.6]} scale={0.07}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#cfe2e6" emissive="#8fb6bd" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
      {/* stubby pectoral fins + tail fin */}
      <mesh position={[0.5, -0.1, 0.05]} rotation-z={-1.2} rotation-x={0.3} scale={[0.06, 0.28, 0.2]}>
        <sphereGeometry args={[1, 6, 5]} />
        {hideMat}
      </mesh>
      <mesh position={[-0.5, -0.1, 0.05]} rotation-z={1.2} rotation-x={0.3} scale={[0.06, 0.28, 0.2]}>
        <sphereGeometry args={[1, 6, 5]} />
        {hideMat}
      </mesh>
      <mesh position={[0, 0.05, -0.95]} rotation-x={Math.PI / 2} scale={[0.16, 1, 1]}>
        <coneGeometry args={[0.45, 0.8, 4]} />
        {hideMat}
      </mesh>
      {/* the lure: a curved stalk with the light at its tip */}
      <group position={[0, 0.45, 0.55]} rotation-x={-0.7}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.015, 0.03, 0.6, 4]} />
          <meshStandardMaterial color="#1a232c" roughness={0.9} />
        </mesh>
        <group ref={lure} position={[0, 0.78, 0]}>
          <pointLight ref={lureLight} color="#a8f2ff" intensity={5.5} distance={9} />
          <mesh>
            <sphereGeometry args={[0.09, 8, 6]} />
            <meshStandardMaterial
              color="#d9fbff"
              emissive="#9beeff"
              emissiveIntensity={3.2}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// A gulper eel — two long pelican jaws hinged wide open, a tiny head, and a
// body that tapers away to a whip tail tipped with a bioluminescent glow.
export const GulperEelModel = () => {
  const tail = useRef();
  const jawTop = useRef();
  const jawBottom = useRef();
  const tipLight = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.4) * 0.3;
    const gape = Math.sin(t * 0.8) * 0.06;
    if (jawTop.current) jawTop.current.rotation.x = -0.3 - gape;
    if (jawBottom.current) jawBottom.current.rotation.x = 0.55 + gape;
    if (tipLight.current) tipLight.current.intensity = 1.6 + Math.sin(t * 3.1) * 0.7;
  });
  const dark = "#20272f";
  const darkMat = (
    <meshStandardMaterial color={dark} emissive="#0d141c" emissiveIntensity={0.5} flatShading roughness={0.85} />
  );
  return (
    <group>
      {/* small head around the jaw hinge, tiny glowing eyes near the snout */}
      <mesh position={[0, 0, 0]} scale={[0.2, 0.18, 0.3]}>
        <sphereGeometry args={[1, 10, 8]} />
        {darkMat}
      </mesh>
      <mesh position={[0.12, 0.08, 0.16]} scale={0.045}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#cbe6e0" emissive="#8fd6c8" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.12, 0.08, 0.16]} scale={0.045}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#cbe6e0" emissive="#8fd6c8" emissiveIntensity={0.8} />
      </mesh>
      {/* upper jaw — a long thin blade hinged upward */}
      <group ref={jawTop} rotation-x={-0.3}>
        <mesh position={[0, 0.03, 0.62]} scale={[0.26, 0.06, 0.68]}>
          <sphereGeometry args={[1, 10, 6]} />
          {darkMat}
        </mesh>
      </group>
      {/* lower jaw — the huge pouch hinged down */}
      <group ref={jawBottom} rotation-x={0.55}>
        <mesh position={[0, -0.08, 0.6]} scale={[0.32, 0.18, 0.72]}>
          <sphereGeometry args={[1, 10, 8]} />
          {darkMat}
        </mesh>
        {/* paler pouch throat showing inside the gape */}
        <mesh position={[0, 0.02, 0.55]} scale={[0.26, 0.1, 0.6]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#39434e" flatShading roughness={0.9} />
        </mesh>
      </group>
      {/* body tapering back, then the long whip tail */}
      <mesh position={[0, 0, -0.55]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.15, 0.08, 1.1, 6]} />
        {darkMat}
      </mesh>
      <group ref={tail} position={[0, 0, -1.05]}>
        <mesh position={[0, 0.02, -0.65]} rotation-x={Math.PI / 2 - 0.06}>
          <cylinderGeometry args={[0.075, 0.015, 1.35, 5]} />
          {darkMat}
        </mesh>
        {/* glowing tail tip */}
        <group position={[0, 0.06, -1.32]}>
          <pointLight ref={tipLight} color="#9ff5d8" intensity={1.6} distance={5} />
          <mesh>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshStandardMaterial color="#daffee" emissive="#9ff5d8" emissiveIntensity={3} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// A giant squid — long mantle with a fin flick at the tail, an outsized eye,
// and a crown of arms with two longer feeding tentacles reaching ahead.
export const GiantSquidModel = () => {
  const arms = useRef();
  const feeders = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (arms.current) arms.current.rotation.x = Math.sin(t * 1.1) * 0.12;
    if (feeders.current) feeders.current.rotation.x = Math.sin(t * 0.9 + 0.6) * 0.16;
  });
  const flesh = "#9c3a48";
  const pale = "#c76b74";
  const armMat = (
    <meshStandardMaterial color={flesh} flatShading roughness={0.7} />
  );
  // An arm reaching forward along +z from a ring around the head, flared
  // outward by `flare` in the direction of its ring angle `a`.
  const arm = (i, a, len, flare, thick = 0.05) => (
    <group key={i} rotation-z={a}>
      <group position={[0.12, 0, 0]} rotation-y={flare}>
        <mesh position={[0, 0, len / 2]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.015, thick, len, 5]} />
          {armMat}
        </mesh>
      </group>
    </group>
  );
  return (
    <group>
      {/* mantle, tapering to a point at -z */}
      <mesh position={[0, 0, -0.75]} scale={[0.3, 0.3, 1.35]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={flesh} flatShading roughness={0.65} />
      </mesh>
      {/* diamond fins at the mantle tip */}
      <mesh position={[0.26, 0, -1.7]} rotation-y={-0.35} scale={[0.4, 0.045, 0.42]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={pale} flatShading roughness={0.7} />
      </mesh>
      <mesh position={[-0.26, 0, -1.7]} rotation-y={0.35} scale={[0.4, 0.045, 0.42]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={pale} flatShading roughness={0.7} />
      </mesh>
      {/* head + dinner-plate eyes */}
      <mesh position={[0, 0, 0.35]} scale={[0.28, 0.28, 0.4]}>
        <sphereGeometry args={[1, 12, 9]} />
        <meshStandardMaterial color={pale} flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0.24, 0.04, 0.5]} scale={0.14}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#0c0e12" emissive="#20303a" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.24, 0.04, 0.5]} scale={0.14}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#0c0e12" emissive="#20303a" emissiveIntensity={0.5} />
      </mesh>
      {/* eight arms trailing ahead of the head in a loose bundle */}
      <group ref={arms} position={[0, 0, 0.6]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
          arm(i, (i / 8) * Math.PI * 2, 0.95 + (i % 3) * 0.12, 0.3 + (i % 2) * 0.12)
        )}
      </group>
      {/* two long feeding tentacles reaching furthest, tipped with clubs */}
      <group ref={feeders} position={[0, 0, 0.6]}>
        {[0.9, Math.PI - 0.9].map((a, i) => (
          <group key={i} rotation-z={-a}>
            <group position={[0.12, 0, 0]} rotation-y={0.12}>
              <mesh position={[0, 0, 0.9]} rotation-x={Math.PI / 2}>
                <cylinderGeometry args={[0.012, 0.04, 1.8, 5]} />
                {armMat}
              </mesh>
              <mesh position={[0, 0, 1.85]} scale={[0.05, 0.07, 0.2]}>
                <sphereGeometry args={[1, 8, 6]} />
                <meshStandardMaterial color={pale} flatShading roughness={0.7} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
};

// A dumbo octopus — a soft bell with two ear-like fins it flaps, and a fringe
// of stubby webbed arms below. Sits upright; forward is +z (its eyes).
export const DumboOctopusModel = () => {
  const earL = useRef();
  const earR = useRef();
  const arms = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flap = Math.sin(t * 1.6);
    if (earL.current) earL.current.rotation.z = -0.5 + flap * 0.3;
    if (earR.current) earR.current.rotation.z = 0.5 - flap * 0.3;
    if (arms.current) arms.current.rotation.x = Math.sin(t * 0.9) * 0.1;
  });
  const skin = "#d98a6a";
  const deep = "#b96a4f";
  return (
    <group scale={1.1}>
      {/* domed body */}
      <mesh position={[0, 0.1, 0]} scale={[0.6, 0.66, 0.6]}>
        <sphereGeometry args={[1, 14, 11]} />
        <meshStandardMaterial color={skin} emissive="#3a1c14" emissiveIntensity={0.35} flatShading roughness={0.7} />
      </mesh>
      {/* ear fins */}
      <group ref={earL} position={[0.5, 0.4, 0]}>
        <mesh position={[0.28, 0, 0]} scale={[0.34, 0.12, 0.26]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={deep} flatShading roughness={0.7} />
        </mesh>
      </group>
      <group ref={earR} position={[-0.5, 0.4, 0]}>
        <mesh position={[-0.28, 0, 0]} scale={[0.34, 0.12, 0.26]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={deep} flatShading roughness={0.7} />
        </mesh>
      </group>
      {/* big glossy eyes with a catchlight */}
      <mesh position={[0.2, 0.16, 0.53]} scale={0.09}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#241017" roughness={0.25} />
      </mesh>
      <mesh position={[-0.2, 0.16, 0.53]} scale={0.09}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#241017" roughness={0.25} />
      </mesh>
      <mesh position={[0.23, 0.19, 0.6]} scale={0.025}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#f6e8da" emissive="#f6e8da" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.17, 0.19, 0.6]} scale={0.025}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#f6e8da" emissive="#f6e8da" emissiveIntensity={0.6} />
      </mesh>
      {/* short webbed arms hanging below */}
      <group ref={arms} position={[0, -0.28, 0]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(a) * 0.26, 0, Math.sin(a) * 0.26]} rotation-y={-a}>
              <mesh position={[0, -0.32, 0.05]} rotation-x={0.4}>
                <coneGeometry args={[0.08, 0.7, 5]} />
                <meshStandardMaterial color={deep} flatShading roughness={0.75} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

// ===========================================================================
// Scene wrappers — carry a model along an orbit through the dive.
// ===========================================================================

// Generic swimmer: circles a centre, bobs, and turns to face where it's going.
const Orbiter = ({
  center,
  radius,
  speed,
  squish = 0.7,
  bob = 0.9,
  bobSpeed = 0.45,
  scale = 1,
  children,
}) => {
  const group = useRef();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = t * speed;
    const x = center[0] + Math.cos(a) * radius;
    const z = center[2] + Math.sin(a) * radius * squish;
    const y = center[1] + Math.sin(t * bobSpeed) * bob;
    group.current.position.set(x, y, z);
    const ahead = a + 0.1;
    target.set(
      center[0] + Math.cos(ahead) * radius,
      y + Math.sin(t * bobSpeed + 0.2) * bob,
      center[2] + Math.sin(ahead) * radius * squish
    );
    group.current.lookAt(target);
  });
  return (
    <group ref={group} scale={scale}>
      {children}
    </group>
  );
};

// Gentle floater for creatures that hang in the water rather than cruise.
const Drifter = ({ position, speed = 0.3, scale = 1, children }) => {
  const group = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.position.set(
      position[0] + Math.sin(t * 0.2 * speed * 3) * 1.4,
      position[1] + Math.sin(t * 0.3) * 1.2,
      position[2] + Math.cos(t * 0.16) * 1.2
    );
    group.current.rotation.y = Math.sin(t * 0.25) * 0.6;
  });
  return (
    <group ref={group} scale={scale}>
      {children}
    </group>
  );
};

export const Turtle = ({ center = [0, -10, 4], radius = 13, speed = 0.09 }) => (
  <Orbiter center={center} radius={radius} speed={speed} squish={0.8} bob={0.9} bobSpeed={0.5}>
    <TurtleModel />
  </Orbiter>
);

export const MantaRay = ({ center = [0, -57, 5], radius = 15, speed = 0.11 }) => (
  <Orbiter center={center} radius={radius} speed={speed} squish={0.85} bob={1.6} bobSpeed={0.35}>
    <MantaModel />
  </Orbiter>
);

// The shark keeps a little extra flair: a steady bank and a yaw wobble on top
// of facing its heading.
export const Shark = ({ center = [0, -58, -10], radius = 15, speed = 0.14 }) => {
  const group = useRef();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = t * speed;
    const x = center[0] + Math.cos(a) * radius;
    const z = center[2] + Math.sin(a) * radius * 0.7;
    const y = center[1] + Math.sin(t * 0.4) * 1.2;
    group.current.position.set(x, y, z);
    const ahead = a + 0.08;
    target.set(
      center[0] + Math.cos(ahead) * radius,
      y + Math.sin(t * 0.4 + 0.2) * 1.2,
      center[2] + Math.sin(ahead) * radius * 0.7
    );
    group.current.lookAt(target);
    group.current.rotation.z += 0.14;
    group.current.rotation.y += Math.sin(t * 2.2) * 0.04;
  });
  return (
    <group ref={group}>
      <SharkModel />
    </group>
  );
};

export const Hammerhead = ({ center = [2, -46, 6], radius = 13, speed = 0.14 }) => (
  <Orbiter center={center} radius={radius} speed={speed} squish={0.75} bob={1} bobSpeed={0.4}>
    <HammerheadModel />
  </Orbiter>
);

export const Orca = ({ center = [-2, -44, -6], radius = 18, speed = 0.1 }) => (
  <Orbiter center={center} radius={radius} speed={speed} squish={0.8} bob={1.3} bobSpeed={0.35} scale={1.2}>
    <OrcaModel />
  </Orbiter>
);

export const Sunfish = ({ center = [-4, -20, 7], radius = 12, speed = 0.07 }) => (
  <Orbiter center={center} radius={radius} speed={speed} squish={0.85} bob={0.7} bobSpeed={0.3}>
    <SunfishModel />
  </Orbiter>
);

export const GiantSquid = ({ center = [3, -82, -6], radius = 8, speed = 0.08 }) => (
  <Orbiter center={center} radius={radius} speed={speed} squish={0.7} bob={1.1} bobSpeed={0.3} scale={1.15}>
    <GiantSquidModel />
  </Orbiter>
);

export const GulperEel = ({ center = [-3, -92, 5], radius = 7, speed = 0.09 }) => (
  <Orbiter center={center} radius={radius} speed={speed} squish={0.7} bob={0.8} bobSpeed={0.35}>
    <GulperEelModel />
  </Orbiter>
);

export const DumboOctopus = ({ position = [6, -96, -5] }) => (
  <Drifter position={position}>
    <DumboOctopusModel />
  </Drifter>
);

// A pod of dolphins near the surface, porpoising — arcing up out of the water
// and back under as they circle. Centred on the surface plane (y≈9) so they're
// only in view near the top of the dive, when you look up.
export const DolphinPod = ({ center = [0, 9, -6], count = 5, radius = 16, speed = 0.32 }) => {
  const target = useMemo(() => new THREE.Vector3(), []);
  const pod = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        ref: React.createRef(),
        phase: (i / count) * Math.PI * 2,
        arcOffset: i * 1.7,
        radius: radius * (0.82 + (i % 3) * 0.12),
        squish: 0.85,
        arcFreq: 5,
        arcAmp: 3.1 + (i % 2) * 0.9,
        size: 0.9 + (i % 3) * 0.12,
        laneZ: (i - count / 2) * 1.3,
      })),
    [count, radius]
  );

  const posOf = (d, a, out) => {
    out.set(
      center[0] + Math.cos(a) * d.radius,
      center[1] + Math.sin(a * d.arcFreq + d.arcOffset) * d.arcAmp,
      center[2] + Math.sin(a) * d.radius * d.squish + d.laneZ
    );
    return out;
  };

  const here = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    pod.forEach((d) => {
      if (!d.ref.current) return;
      const a = t * speed + d.phase;
      posOf(d, a, here);
      d.ref.current.position.copy(here);
      posOf(d, a + 0.04, target);
      d.ref.current.lookAt(target);
    });
  });

  return (
    <group>
      {pod.map((d, i) => (
        <group key={i} ref={d.ref} scale={d.size}>
          <DolphinModel />
        </group>
      ))}
    </group>
  );
};

// The whale swims a long straight pass through the twilight haze, then loops
// back while hidden in the fog.
export const Whale = ({ y = -40, z = -32, span = 110, speed = 3.2 }) => {
  const group = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const cycle = (span * 2) / speed;
    const phase = (t % cycle) / cycle;
    const x = -span + phase * span * 2;
    group.current.position.set(x, y + Math.sin(t * 0.3) * 2.2, z);
    group.current.rotation.z = Math.sin(t * 0.3) * 0.05;
  });
  return (
    <group ref={group} rotation-y={Math.PI / 2}>
      <WhaleModel />
    </group>
  );
};

// A drifting jellyfish rising slowly through the twilight zone.
const Jellyfish = ({ position, phase, tint }) => {
  const group = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const y = position[1] + ((t * 0.5 + phase * 6) % 26);
    group.current.position.set(
      position[0] + Math.sin(t * 0.25 + phase) * 1.6,
      y,
      position[2]
    );
  });
  return (
    <group ref={group}>
      <JellyfishModel tint={tint} phase={phase} />
    </group>
  );
};

export const JellyfishBloom = () => (
  <group>
    <Jellyfish position={[-10, -66, -9]} phase={0.4} tint="#c9a2e8" />
    <Jellyfish position={[-6, -72, -14]} phase={2.1} tint="#a2b8e8" />
    <Jellyfish position={[9, -68, -7]} phase={4.2} tint="#e8a2d5" />
    <Jellyfish position={[14, -76, -12]} phase={1.3} tint="#b3a2e8" />
    <Jellyfish position={[2, -80, -16]} phase={3.3} tint="#c9a2e8" />
    {/* a few drift behind the camera for the look-around */}
    <Jellyfish position={[-8, -70, 24]} phase={5.1} tint="#a2b8e8" />
    <Jellyfish position={[10, -78, 28]} phase={2.7} tint="#e8a2d5" />
  </group>
);

export const Anglerfish = ({ center = [0, -86, -8], radius = 6, speed = 0.16 }) => (
  <Orbiter center={center} radius={radius} speed={speed} squish={0.6} bob={0.8} bobSpeed={0.7}>
    <AnglerfishModel />
  </Orbiter>
);

// An octopus perched on the seabed, tentacles swaying in the current.
export const Octopus = ({ position = [7, 0, 15] }) => {
  const body = useRef();
  const tentacles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        phase: i * 0.9,
        ref: React.createRef(),
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (body.current) {
      const breathe = 1 + Math.sin(t * 1.1) * 0.05;
      body.current.scale.set(0.55 * breathe, 0.62 * breathe, 0.55 * breathe);
    }
    tentacles.forEach((tc) => {
      if (tc.ref.current) {
        tc.ref.current.rotation.x = 0.85 + Math.sin(t * 0.8 + tc.phase) * 0.14;
      }
    });
  });

  return (
    <group position={position}>
      <mesh ref={body} position={[0, 0.55, 0]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#8a4250" emissive="#2b0f16" emissiveIntensity={0.4} flatShading roughness={0.7} />
      </mesh>
      {/* eyes catch the headlamp */}
      <mesh position={[0.2, 0.72, 0.48]} scale={0.08}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#f2e9c9" emissive="#f2e9c9" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.2, 0.72, 0.48]} scale={0.08}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#f2e9c9" emissive="#f2e9c9" emissiveIntensity={0.5} />
      </mesh>
      {tentacles.map((tc, i) => (
        <group
          key={i}
          position={[Math.cos(tc.angle) * 0.34, 0.28, Math.sin(tc.angle) * 0.34]}
          rotation-y={-tc.angle}
        >
          <group ref={tc.ref} rotation-x={0.85}>
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.035, 0.09, 1.1, 5]} />
              <meshStandardMaterial color="#7a3944" flatShading roughness={0.75} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

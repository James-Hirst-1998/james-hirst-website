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
      {/* tapered snout — tucked inside the body line so it runs straight out
          to a point instead of bulging past the head */}
      <mesh position={[0, -0.02, 1.45]} scale={[0.26, 0.28, 0.7]}>
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

// A sperm whale — a third of it is that great squared-off head. Dark grey
// all over, a narrow pale underslung jaw, stubby paddle fins, and no true
// dorsal — just a low hump and knuckles running down to broad flukes.
export const SpermWhaleModel = () => {
  const tail = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.x = Math.sin(t * 0.9) * 0.16;
  });
  const grey = "#57616c";
  const greyMat = (
    <meshStandardMaterial color={grey} emissive="#1a222b" emissiveIntensity={0.45} flatShading roughness={0.7} />
  );
  return (
    <group scale={2.4}>
      {/* body, sitting behind the head block */}
      <mesh position={[0, 0, -0.5]} scale={[0.52, 0.6, 1.6]}>
        <sphereGeometry args={[1, 14, 10]} />
        {greyMat}
      </mesh>
      {/* the huge blunt head — a third of the whale. A cylinder gives the
          squared-off front without box corners; world y/z swap under the
          rotation, so scale-y runs along the body. */}
      <mesh position={[0, 0.05, 1.15]} rotation-x={Math.PI / 2} scale={[1.12, 1, 1.32]}>
        <cylinderGeometry args={[0.5, 0.54, 1.5, 12]} />
        {greyMat}
      </mesh>
      {/* rounded brow easing the front edge */}
      <mesh position={[0, 0.18, 1.5]} scale={[0.42, 0.44, 0.44]}>
        <sphereGeometry args={[1, 12, 9]} />
        {greyMat}
      </mesh>
      {/* rounded shoulders easing the box into the body */}
      <mesh position={[0, 0.04, 0.55]} scale={[0.46, 0.56, 0.7]}>
        <sphereGeometry args={[1, 12, 9]} />
        {greyMat}
      </mesh>
      {/* narrow pale lower jaw hanging just below the head line */}
      <mesh position={[0, -0.64, 1.35]} scale={[0.14, 0.07, 0.58]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#b9c6cb" flatShading roughness={0.65} />
      </mesh>
      {/* eyes low on the head sides, just proud of the curve */}
      <mesh position={[0.5, -0.3, 1.45]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0b1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.5, -0.3, 1.45]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0b1216" roughness={0.35} />
      </mesh>
      {/* stubby paddle pectorals */}
      <mesh position={[0.52, -0.36, 0.2]} rotation-z={-0.5} rotation-x={0.3} scale={[0.3, 0.05, 0.17]}>
        <sphereGeometry args={[1, 8, 6]} />
        {greyMat}
      </mesh>
      <mesh position={[-0.52, -0.36, 0.2]} rotation-z={0.5} rotation-x={0.3} scale={[0.3, 0.05, 0.17]}>
        <sphereGeometry args={[1, 8, 6]} />
        {greyMat}
      </mesh>
      {/* low dorsal hump, then knuckles stepping down the tail stock */}
      <mesh position={[0, 0.56, -0.85]} scale={[0.1, 0.15, 0.32]}>
        <sphereGeometry args={[1, 8, 6]} />
        {greyMat}
      </mesh>
      <mesh position={[0, 0.44, -1.35]} scale={[0.07, 0.09, 0.16]}>
        <sphereGeometry args={[1, 8, 6]} />
        {greyMat}
      </mesh>
      <mesh position={[0, 0.31, -1.75]} scale={[0.06, 0.07, 0.13]}>
        <sphereGeometry args={[1, 8, 6]} />
        {greyMat}
      </mesh>
      {/* tail stock tapering into broad flukes */}
      <group ref={tail} position={[0, 0.05, -2.0]}>
        <mesh position={[0, 0, -0.15]} rotation-x={-Math.PI / 2} scale={[0.6, 1, 1]}>
          <coneGeometry args={[0.22, 0.7, 6]} />
          {greyMat}
        </mesh>
        <mesh position={[0.38, 0, -0.52]} rotation-y={0.45} scale={[0.48, 0.05, 0.26]}>
          <sphereGeometry args={[1, 8, 6]} />
          {greyMat}
        </mesh>
        <mesh position={[-0.38, 0, -0.52]} rotation-y={-0.45} scale={[0.48, 0.05, 0.26]}>
          <sphereGeometry args={[1, 8, 6]} />
          {greyMat}
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

// A swordfish — a streamlined steel-blue sprinter: long flattened bill, a
// tall sickle of a first dorsal, keeled tail stock and a big crescent tail.
export const SwordfishModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 3.4) * 0.32;
  });
  const bodyMat = (
    <meshStandardMaterial color="#3d5570" emissive="#15202e" emissiveIntensity={0.45} flatShading roughness={0.45} metalness={0.3} />
  );
  return (
    <group scale={1.1}>
      {/* body */}
      <mesh scale={[0.3, 0.44, 1.45]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* silvery belly */}
      <mesh position={[0, -0.15, 0.05]} scale={[0.2, 0.28, 1.1]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#c3d1d9" flatShading roughness={0.4} metalness={0.35} />
      </mesh>
      {/* head tapering toward the bill */}
      <mesh position={[0, 0.02, 1.35]} scale={[0.18, 0.26, 0.55]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      {/* the sword — a long flattened bill */}
      <mesh position={[0, 0.05, 2.45]} rotation-x={Math.PI / 2} scale={[1.6, 1, 1]}>
        <cylinderGeometry args={[0.012, 0.05, 1.5, 5]} />
        {bodyMat}
      </mesh>
      {/* big eyes for hunting in the dim */}
      <mesh position={[0.16, 0.06, 1.42]} scale={0.07}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.3} />
      </mesh>
      <mesh position={[-0.16, 0.06, 1.42]} scale={0.07}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.3} />
      </mesh>
      {/* tall sickle dorsal swept hard back */}
      <mesh position={[0, 0.72, 0.35]} rotation-x={-0.6} geometry={finGeometry} scale={[1, 1.25, 1]}>
        {bodyMat}
      </mesh>
      {/* small second dorsal near the tail */}
      <mesh position={[0, 0.32, -1.15]} rotation-x={-0.7} geometry={finGeometry} scale={0.35}>
        {bodyMat}
      </mesh>
      {/* long swept pectorals held low */}
      <mesh position={[0.3, -0.16, 0.5]} rotation-z={-2.2} rotation-x={0.7} geometry={finGeometry} scale={0.85}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.3, -0.16, 0.5]} rotation-z={2.2} rotation-x={0.7} geometry={finGeometry} scale={0.85}>
        {bodyMat}
      </mesh>
      {/* caudal keels either side of the tail stock */}
      <mesh position={[0.1, 0, -1.42]} scale={[0.08, 0.03, 0.2]}>
        <sphereGeometry args={[1, 6, 5]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.1, 0, -1.42]} scale={[0.08, 0.03, 0.2]}>
        <sphereGeometry args={[1, 6, 5]} />
        {bodyMat}
      </mesh>
      {/* tail: slim peduncle into a big near-symmetric crescent */}
      <group ref={tail} position={[0, 0, -1.5]}>
        <mesh position={[0, 0, -0.05]} rotation-x={-Math.PI / 2} scale={[0.5, 1, 1]}>
          <coneGeometry args={[0.16, 0.5, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.3, -0.35]} rotation-x={-2.4} geometry={finGeometry} scale={1.15}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.3, -0.35]} rotation-x={2.4} geometry={finGeometry} scale={1.05}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// A crab — a flat oval shell, stalked eyes, two claws held up ready, and four
// pairs of skittering legs. Faces +z; walking sideways is the wrapper's job.
export const CrabModel = () => {
  const clawL = useRef();
  const clawR = useRef();
  const legs = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        ref: React.createRef(),
        side: i < 4 ? 1 : -1,
        idx: i % 4,
      })),
    []
  );
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (clawL.current) clawL.current.rotation.x = -0.5 + Math.sin(t * 1.6) * 0.18;
    if (clawR.current) clawR.current.rotation.x = -0.5 + Math.sin(t * 1.6 + 1.1) * 0.18;
    legs.forEach((l) => {
      if (l.ref.current) l.ref.current.rotation.z = l.side * (0.55 + Math.sin(t * 5 + l.idx * 1.3 + l.side) * 0.12);
    });
  });
  const shell = "#c05a3e";
  const shellMat = (
    <meshStandardMaterial color={shell} emissive="#38140b" emissiveIntensity={0.4} flatShading roughness={0.7} />
  );
  return (
    <group>
      {/* carapace, wider than it is long, with a paler underside */}
      <mesh scale={[0.62, 0.24, 0.46]}>
        <sphereGeometry args={[1, 12, 9]} />
        {shellMat}
      </mesh>
      <mesh position={[0, -0.1, 0]} scale={[0.5, 0.16, 0.36]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#e0a583" flatShading roughness={0.75} />
      </mesh>
      {/* stalked eyes peering forward */}
      {[0.14, -0.14].map((x) => (
        <group key={x} position={[x, 0.16, 0.36]}>
          <mesh rotation-x={0.5}>
            <cylinderGeometry args={[0.025, 0.035, 0.18, 5]} />
            {shellMat}
          </mesh>
          <mesh position={[0, 0.1, 0.06]} scale={0.055}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#12161b" roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* claws held up in front, hinged at the shoulder */}
      {[
        { x: 0.42, ref: clawL, flip: 1 },
        { x: -0.42, ref: clawR, flip: -1 },
      ].map(({ x, ref, flip }) => (
        <group key={flip} position={[x, 0, 0.32]} rotation-y={flip * 0.5}>
          <group ref={ref} rotation-x={-0.5}>
            <mesh position={[0, 0, 0.16]} rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.04, 0.055, 0.3, 5]} />
              {shellMat}
            </mesh>
            <mesh position={[0, 0.02, 0.38]} scale={[0.11, 0.09, 0.16]}>
              <sphereGeometry args={[1, 8, 6]} />
              {shellMat}
            </mesh>
            {/* the pincer's fixed finger */}
            <mesh position={[0, 0.06, 0.52]} rotation-x={Math.PI / 2} scale={[0.5, 1, 1]}>
              <coneGeometry args={[0.045, 0.16, 4]} />
              {shellMat}
            </mesh>
          </group>
        </group>
      ))}
      {/* four walking legs per side, kicked out and down */}
      {legs.map((l, i) => (
        <group key={i} position={[l.side * 0.5, -0.04, 0.24 - l.idx * 0.18]}>
          <group ref={l.ref} rotation-z={l.side * 0.55}>
            <mesh position={[l.side * 0.2, -0.08, 0]} rotation-z={l.side * 1.2}>
              <cylinderGeometry args={[0.02, 0.035, 0.42, 4]} />
              {shellMat}
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

// ===========================================================================
// Shark collection — species-specific builds in the same primitive style as
// the great white and hammerhead: origin-centred, nose along +z, tail sway.
// They appear only in the /creatures viewer (grouped under "Sharks"), never
// in the dive.
// ===========================================================================

// Tiger Shark · Galeocerdo cuvier — blunt squared-off snout, dark vertical
// bars over the back that fade toward the tail, long upper caudal lobe.
export const TigerSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 2.1) * 0.42;
  });
  const bodyMat = (
    <meshStandardMaterial color="#67755c" emissive="#181f14" emissiveIntensity={0.45} flatShading roughness={0.6} />
  );
  const bellyMat = <meshStandardMaterial color="#cdd1c2" flatShading roughness={0.6} />;
  const stripeMat = <meshStandardMaterial color="#333d2b" flatShading roughness={0.7} />;
  // [z, x, y] — each bar is a thin ring sized to hug the body's taper there.
  const stripes = [
    [0.85, 0.47, 0.5],
    [0.5, 0.51, 0.55],
    [0.15, 0.53, 0.57],
    [-0.2, 0.53, 0.57],
    [-0.55, 0.51, 0.55],
    [-0.9, 0.46, 0.5],
    [-1.2, 0.39, 0.42],
  ];
  return (
    <group>
      <mesh scale={[0.52, 0.56, 1.75]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* broad, squared-off snout — far blunter than a great white's */}
      <mesh position={[0, -0.04, 1.52]} scale={[0.4, 0.3, 0.5]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.2, 0.15]} scale={[0.4, 0.34, 0.95]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      {/* pale chin with a wide mouth line under the flat snout */}
      <mesh position={[0, -0.2, 1.42]} scale={[0.28, 0.15, 0.42]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      <mesh position={[0, -0.28, 1.6]} rotation-x={0.3} scale={[0.23, 0.022, 0.15]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#131c23" roughness={0.8} />
      </mesh>
      <mesh position={[0.35, 0.07, 1.44]} scale={0.055}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.35, 0.07, 1.44]} scale={0.055}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* tiger bars wrapped over the back, boldest mid-body */}
      {stripes.map(([z, sx, sy], i) => (
        <mesh key={i} position={[0, 0.02, z]} scale={[sx, sy, 0.045]}>
          <sphereGeometry args={[1, 12, 9]} />
          {stripeMat}
        </mesh>
      ))}
      <mesh position={[0, 0.68, -0.05]} rotation-x={-0.45} geometry={finGeometry}>
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.46, -1.2]} rotation-x={-0.5} geometry={finGeometry} scale={0.4}>
        {bodyMat}
      </mesh>
      <mesh position={[0.55, -0.2, 0.45]} rotation-z={-2.1} rotation-x={0.5} geometry={finGeometry}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.55, -0.2, 0.45]} rotation-z={2.1} rotation-x={0.5} geometry={finGeometry}>
        {bodyMat}
      </mesh>
      {/* strongly asymmetric tail — the long upper lobe is the tiger's cruiser */}
      <group ref={tail} position={[0, 0, -1.6]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.24, 0.7, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.34, -0.48]} rotation-x={-2.3} geometry={finGeometry} scale={[1, 1.5, 1]}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.2, -0.36]} rotation-x={2.65} geometry={finGeometry} scale={0.6}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Whale Shark · Rhincodon typus — broad flattened head with a wide terminal
// mouth, a chequerboard of pale spots, ridged flanks and a tall crescent tail.
export const WhaleSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  // Spots laid out in loose staggered rows over the back — every whale shark's
  // pattern is unique, this one included.
  const spots = useMemo(() => {
    const pts = [];
    for (let row = 0; row < 7; row++) {
      const z = -1.35 + row * 0.42;
      const f = Math.sqrt(Math.max(0.1, 1 - (z / 1.82) ** 2));
      for (let i = 0; i < 5; i++) {
        const a = 0.35 + (i / 4) * (Math.PI - 0.7) + (row % 2 ? 0.16 : 0);
        pts.push([Math.cos(a) * 0.63 * f, Math.sin(a) * 0.53 * f, z]);
      }
    }
    return pts;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.2) * 0.35;
  });
  const bodyMat = (
    <meshStandardMaterial color="#3d566a" emissive="#14222c" emissiveIntensity={0.45} flatShading roughness={0.6} />
  );
  const bellyMat = <meshStandardMaterial color="#b8c4cc" flatShading roughness={0.6} />;
  const spotMat = <meshStandardMaterial color="#dfe9ec" flatShading roughness={0.55} />;
  const ridgeMat = <meshStandardMaterial color="#54707f" flatShading roughness={0.6} />;
  return (
    <group scale={1.15}>
      <mesh scale={[0.6, 0.5, 1.8]}>
        <sphereGeometry args={[1, 14, 10]} />
        {bodyMat}
      </mesh>
      {/* broad flattened head ending in a near-vertical face */}
      <mesh position={[0, -0.04, 1.55]} scale={[0.52, 0.3, 0.55]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* the huge terminal mouth wraps around the front of the snout */}
      <mesh position={[0, -0.08, 1.88]} scale={[0.44, 0.04, 0.3]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#101820" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.22, 0.1]} scale={[0.46, 0.3, 1.05]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      {/* tiny eyes tucked into the corners of the head */}
      <mesh position={[0.48, 0, 1.72]} scale={0.04}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.48, 0, 1.72]} scale={0.04}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* longitudinal ridges running down the back and flanks */}
      <mesh position={[0, 0.5, -0.15]} scale={[0.035, 0.035, 1.15]}>
        <sphereGeometry args={[1, 6, 5]} />
        {ridgeMat}
      </mesh>
      <mesh position={[0.33, 0.42, -0.15]} scale={[0.035, 0.035, 1.1]}>
        <sphereGeometry args={[1, 6, 5]} />
        {ridgeMat}
      </mesh>
      <mesh position={[-0.33, 0.42, -0.15]} scale={[0.035, 0.035, 1.1]}>
        <sphereGeometry args={[1, 6, 5]} />
        {ridgeMat}
      </mesh>
      <mesh position={[0.53, 0.24, -0.15]} scale={[0.035, 0.035, 1.05]}>
        <sphereGeometry args={[1, 6, 5]} />
        {ridgeMat}
      </mesh>
      <mesh position={[-0.53, 0.24, -0.15]} scale={[0.035, 0.035, 1.05]}>
        <sphereGeometry args={[1, 6, 5]} />
        {ridgeMat}
      </mesh>
      {spots.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} scale={0.045}>
          <sphereGeometry args={[1, 6, 5]} />
          {spotMat}
        </mesh>
      ))}
      {/* dorsal set well back; broad pectorals for a slow cruiser */}
      <mesh position={[0, 0.55, -0.55]} rotation-x={-0.5} geometry={finGeometry} scale={1.1}>
        {bodyMat}
      </mesh>
      <mesh position={[0.6, -0.2, 0.3]} rotation-z={-2.1} rotation-x={0.5} geometry={finGeometry} scale={1.3}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.6, -0.2, 0.3]} rotation-z={2.1} rotation-x={0.5} geometry={finGeometry} scale={1.3}>
        {bodyMat}
      </mesh>
      {/* tall, near-symmetric crescent tail */}
      <group ref={tail} position={[0, 0, -1.6]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.28, 0.75, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.32, -0.45]} rotation-x={-2.4} geometry={finGeometry} scale={[1, 1.6, 1]}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.24, -0.4]} rotation-x={2.55} geometry={finGeometry} scale={[1, 1, 1]}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Bull Shark · Carcharhinus leucas — stocky and thick-set with a short blunt
// snout, small eyes and a big broad first dorsal fin.
export const BullSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.9) * 0.4;
  });
  const bodyMat = (
    <meshStandardMaterial color="#858980" emissive="#22251f" emissiveIntensity={0.45} flatShading roughness={0.6} />
  );
  const bellyMat = <meshStandardMaterial color="#d6d8d0" flatShading roughness={0.6} />;
  return (
    <group>
      {/* short, deep, muscular barrel of a body */}
      <mesh scale={[0.56, 0.6, 1.55]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* very blunt, rounded snout */}
      <mesh position={[0, -0.04, 1.32]} scale={[0.42, 0.36, 0.45]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.2, 0.1]} scale={[0.46, 0.38, 0.95]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      {/* pale chin and a wide mouth under the stubby snout */}
      <mesh position={[0, -0.24, 1.25]} scale={[0.3, 0.16, 0.38]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      <mesh position={[0, -0.32, 1.42]} rotation-x={0.3} scale={[0.24, 0.022, 0.15]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#131c23" roughness={0.8} />
      </mesh>
      {/* famously small eyes for murky water */}
      <mesh position={[0.38, 0.06, 1.3]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.38, 0.06, 1.3]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* oversized, broad triangular first dorsal */}
      <mesh position={[0, 0.72, 0.05]} rotation-x={-0.35} geometry={finGeometry} scale={[1.5, 1.25, 1.5]}>
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.46, -1.15]} rotation-x={-0.5} geometry={finGeometry} scale={0.45}>
        {bodyMat}
      </mesh>
      <mesh position={[0.58, -0.22, 0.4]} rotation-z={-2.1} rotation-x={0.45} geometry={finGeometry} scale={1.15}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.58, -0.22, 0.4]} rotation-z={2.1} rotation-x={0.45} geometry={finGeometry} scale={1.15}>
        {bodyMat}
      </mesh>
      {/* stout tail to shove that bulk through shallow water */}
      <group ref={tail} position={[0, 0, -1.45]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.27, 0.7, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.3, -0.42]} rotation-x={-2.45} geometry={finGeometry} scale={1.05}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.2, -0.38]} rotation-x={2.65} geometry={finGeometry} scale={0.6}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Blue Shark · Prionace glauca — slender indigo body, long conical snout,
// big eyes and hugely elongated sickle-shaped pectoral fins.
export const BlueSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  // Extra-long blades for the signature sickle pectorals.
  const longFinGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.9, 4);
    geo.scale(0.13, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 2.3) * 0.45;
  });
  const bodyMat = (
    <meshStandardMaterial color="#2e55b0" emissive="#0e1c48" emissiveIntensity={0.45} flatShading roughness={0.55} />
  );
  const flankMat = <meshStandardMaterial color="#4f7fd6" flatShading roughness={0.55} />;
  const bellyMat = <meshStandardMaterial color="#e6edf5" flatShading roughness={0.6} />;
  return (
    <group>
      {/* long, slim torpedo of a body */}
      <mesh scale={[0.38, 0.42, 1.85]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* long conical snout */}
      <mesh position={[0, -0.02, 1.72]} scale={[0.2, 0.22, 0.8]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      {/* bright blue flank band above the white belly */}
      <mesh position={[0, -0.08, 0.15]} scale={[0.4, 0.28, 1.4]}>
        <sphereGeometry args={[1, 10, 8]} />
        {flankMat}
      </mesh>
      <mesh position={[0, -0.22, 0.2]} scale={[0.34, 0.26, 1.2]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      {/* big round eyes */}
      <mesh position={[0.2, 0.06, 1.55]} scale={0.07}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.2, 0.06, 1.55]} scale={0.07}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* modest dorsal set slightly back */}
      <mesh position={[0, 0.56, -0.25]} rotation-x={-0.45} geometry={finGeometry} scale={0.85}>
        {bodyMat}
      </mesh>
      {/* the sickle pectorals — nearly half the body length, swept hard back */}
      <mesh position={[0.4, -0.16, 0.6]} rotation-z={-2.3} rotation-x={0.7} geometry={longFinGeometry}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.4, -0.16, 0.6]} rotation-z={2.3} rotation-x={0.7} geometry={longFinGeometry}>
        {bodyMat}
      </mesh>
      {/* slim tail with a long upper lobe */}
      <group ref={tail} position={[0, 0, -1.7]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.19, 0.65, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.3, -0.44]} rotation-x={-2.35} geometry={finGeometry} scale={[1, 1.35, 1]}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.18, -0.36]} rotation-x={2.65} geometry={finGeometry} scale={0.6}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Shortfin Mako · Isurus oxyrinchus — metallic-blue torpedo: sharp conical
// snout, short pectorals, caudal keels and a near-symmetric crescent tail.
export const MakoSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 3.2) * 0.5;
  });
  const bodyMat = (
    <meshStandardMaterial
      color="#3565c8"
      emissive="#0c1e44"
      emissiveIntensity={0.45}
      flatShading
      roughness={0.35}
      metalness={0.5}
    />
  );
  const bellyMat = <meshStandardMaterial color="#eef3f8" flatShading roughness={0.55} />;
  return (
    <group>
      {/* perfect spindle body — built for speed */}
      <mesh scale={[0.46, 0.5, 1.7]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* sharply pointed conical snout */}
      <mesh position={[0, -0.02, 1.6]} scale={[0.24, 0.26, 0.62]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.18, 0.1]} scale={[0.36, 0.3, 1.05]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      {/* white chin running up under the point of the snout */}
      <mesh position={[0, -0.14, 1.55]} scale={[0.17, 0.14, 0.42]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      <mesh position={[0, -0.2, 1.72]} rotation-x={0.35} scale={[0.13, 0.02, 0.12]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#131c23" roughness={0.8} />
      </mesh>
      <mesh position={[0.21, 0.07, 1.5]} scale={0.06}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.21, 0.07, 1.5]} scale={0.06}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.62, -0.15]} rotation-x={-0.45} geometry={finGeometry} scale={0.95}>
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.42, -1.2]} rotation-x={-0.5} geometry={finGeometry} scale={0.3}>
        {bodyMat}
      </mesh>
      {/* the "shortfin" — noticeably stubby pectorals */}
      <mesh position={[0.5, -0.2, 0.5]} rotation-z={-2.15} rotation-x={0.45} geometry={finGeometry} scale={0.8}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.5, -0.2, 0.5]} rotation-z={2.15} rotation-x={0.45} geometry={finGeometry} scale={0.8}>
        {bodyMat}
      </mesh>
      {/* lunate tail with strong keels on the peduncle, like a tuna's */}
      <group ref={tail} position={[0, 0, -1.55]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.22, 0.65, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0.16, 0, -0.05]} scale={[0.16, 0.03, 0.3]}>
          <sphereGeometry args={[1, 8, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[-0.16, 0, -0.05]} scale={[0.16, 0.03, 0.3]}>
          <sphereGeometry args={[1, 8, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.3, -0.42]} rotation-x={-2.5} geometry={finGeometry} scale={[1, 1.3, 1]}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.26, -0.4]} rotation-x={2.5} geometry={finGeometry} scale={[1, 1.15, 1]}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Thresher Shark · Alopias vulpinus — big eyes, short snout and the show
// piece: a scythe-like upper tail lobe nearly as long as the body itself.
export const ThresherSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  const longFinGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.6, 4);
    geo.scale(0.14, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.8) * 0.5;
  });
  const bodyMat = (
    <meshStandardMaterial color="#4e6377" emissive="#1a2831" emissiveIntensity={0.45} flatShading roughness={0.6} />
  );
  const bellyMat = <meshStandardMaterial color="#dae2e6" flatShading roughness={0.6} />;
  return (
    // Body sits forward so the whole shark — whip included — spins centred.
    <group>
      <mesh position={[0, 0, 0.65]} scale={[0.44, 0.5, 1.45]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* short rounded snout */}
      <mesh position={[0, -0.02, 2.0]} scale={[0.26, 0.28, 0.42]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.18, 0.7]} scale={[0.36, 0.32, 0.9]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      {/* huge eyes for hunting in dim water */}
      <mesh position={[0.22, 0.1, 1.95]} scale={0.085}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.22, 0.1, 1.95]} scale={0.085}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.62, 0.65]} rotation-x={-0.45} geometry={finGeometry} scale={0.9}>
        {bodyMat}
      </mesh>
      {/* long curved pectorals */}
      <mesh position={[0.42, -0.18, 1.0]} rotation-z={-2.25} rotation-x={0.6} geometry={longFinGeometry}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.42, -0.18, 1.0]} rotation-z={2.25} rotation-x={0.6} geometry={longFinGeometry}>
        {bodyMat}
      </mesh>
      <mesh position={[0.2, -0.3, 0.1]} rotation-z={-2.4} rotation-x={0.5} geometry={finGeometry} scale={0.5}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.2, -0.3, 0.1]} rotation-z={2.4} rotation-x={0.5} geometry={finGeometry} scale={0.5}>
        {bodyMat}
      </mesh>
      {/* the whip: an enormous upper caudal lobe sweeping up and back */}
      <group ref={tail} position={[0, 0, -0.7]}>
        <mesh position={[0, 0, -0.2]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.18, 0.6, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.58, -1.0]} rotation-x={0.35} scale={[0.045, 0.15, 1.05]}>
          <sphereGeometry args={[1, 8, 8]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.16, -0.3]} rotation-x={2.65} geometry={finGeometry} scale={0.5}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Oceanic Whitetip · Carcharhinus longimanus — bronze body with huge rounded
// paddle fins, every one dipped in white at the tip.
export const OceanicWhitetipModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.9) * 0.4;
  });
  const bodyMat = (
    <meshStandardMaterial color="#857a63" emissive="#211d14" emissiveIntensity={0.45} flatShading roughness={0.6} />
  );
  const bellyMat = <meshStandardMaterial color="#d8d3c2" flatShading roughness={0.6} />;
  const tipMat = <meshStandardMaterial color="#e8e4d8" flatShading roughness={0.5} />;
  return (
    <group>
      <mesh scale={[0.48, 0.52, 1.65]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* short, broadly rounded snout */}
      <mesh position={[0, -0.03, 1.5]} scale={[0.3, 0.26, 0.5]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.2, 0.15]} scale={[0.4, 0.32, 1.0]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      <mesh position={[0, -0.18, 1.45]} scale={[0.2, 0.14, 0.36]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      <mesh position={[0.29, 0.07, 1.45]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.29, 0.07, 1.45]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* big rounded dorsal paddle with its white cap */}
      <group position={[0, 0.55, -0.05]} rotation-x={-0.25}>
        <mesh position={[0, 0.28, 0]} scale={[0.06, 0.44, 0.24]}>
          <sphereGeometry args={[1, 10, 8]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.62, 0]} scale={[0.065, 0.15, 0.2]}>
          <sphereGeometry args={[1, 8, 6]} />
          {tipMat}
        </mesh>
      </group>
      {/* long paddle pectorals — the "longimanus" — also white-tipped */}
      <group position={[0.5, -0.15, 0.5]} rotation-z={-2.05} rotation-x={0.35}>
        <mesh position={[0, 0.3, 0]} scale={[0.055, 0.5, 0.2]}>
          <sphereGeometry args={[1, 10, 8]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.68, 0]} scale={[0.06, 0.16, 0.17]}>
          <sphereGeometry args={[1, 8, 6]} />
          {tipMat}
        </mesh>
      </group>
      <group position={[-0.5, -0.15, 0.5]} rotation-z={2.05} rotation-x={0.35}>
        <mesh position={[0, 0.3, 0]} scale={[0.055, 0.5, 0.2]}>
          <sphereGeometry args={[1, 10, 8]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.68, 0]} scale={[0.06, 0.16, 0.17]}>
          <sphereGeometry args={[1, 8, 6]} />
          {tipMat}
        </mesh>
      </group>
      <mesh position={[0, 0.42, -1.15]} rotation-x={-0.5} geometry={finGeometry} scale={0.35}>
        {bodyMat}
      </mesh>
      <mesh position={[0.22, -0.32, -0.3]} rotation-z={-2.4} rotation-x={0.5} geometry={finGeometry} scale={0.5}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.22, -0.32, -0.3]} rotation-z={2.4} rotation-x={0.5} geometry={finGeometry} scale={0.5}>
        {bodyMat}
      </mesh>
      {/* tail lobes get white tips too */}
      <group ref={tail} position={[0, 0, -1.55]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.23, 0.68, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.3, -0.42]} rotation-x={-2.45} geometry={finGeometry} scale={1.1}>
          {bodyMat}
        </mesh>
        <mesh position={[0, 1.0, -0.5]} scale={[0.05, 0.14, 0.14]}>
          <sphereGeometry args={[1, 8, 6]} />
          {tipMat}
        </mesh>
        <mesh position={[0, -0.2, -0.38]} rotation-x={2.65} geometry={finGeometry} scale={0.65}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.52, -0.22]} scale={[0.045, 0.1, 0.1]}>
          <sphereGeometry args={[1, 8, 6]} />
          {tipMat}
        </mesh>
      </group>
    </group>
  );
};

// Zebra Shark · Stegostoma tigrinum — adult colours: leopard spots on tan,
// ridged flanks, barbels on the snout and a very long, low caudal fin.
export const ZebraSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  // Leopard spotting over the back and flanks.
  const spots = useMemo(() => {
    const pts = [];
    for (let row = 0; row < 5; row++) {
      const z = -0.3 + row * 0.55;
      const f = Math.sqrt(Math.max(0.15, 1 - ((z - 0.75) / 1.28) ** 2));
      for (let i = 0; i < 3; i++) {
        const a = 0.55 + i * 1.0 + (row % 2 ? 0.3 : 0);
        pts.push([Math.cos(a) * 0.41 * f, Math.sin(a) * 0.43 * f, z]);
      }
    }
    // A few trailing spots down the tail trunk.
    pts.push([0.16, 0.14, -0.85], [-0.13, 0.17, -1.05], [0.1, 0.15, -1.3]);
    return pts;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.5) * 0.35;
  });
  const bodyMat = (
    <meshStandardMaterial color="#c2a05e" emissive="#2a2312" emissiveIntensity={0.45} flatShading roughness={0.6} />
  );
  const bellyMat = <meshStandardMaterial color="#e8dcbd" flatShading roughness={0.6} />;
  const spotMat = <meshStandardMaterial color="#4b3a1c" flatShading roughness={0.65} />;
  return (
    // Nudged forward so the long tail spins around the middle.
    <group position={[0, 0, 0.3]}>
      <mesh position={[0, 0, 0.75]} scale={[0.4, 0.42, 1.25]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* blunt rounded head with little barbels under the snout */}
      <mesh position={[0, -0.04, 1.95]} scale={[0.3, 0.24, 0.4]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0.07, -0.24, 2.22]} scale={[0.012, 0.05, 0.012]}>
        <sphereGeometry args={[1, 6, 5]} />
        {bellyMat}
      </mesh>
      <mesh position={[-0.07, -0.24, 2.22]} scale={[0.012, 0.05, 0.012]}>
        <sphereGeometry args={[1, 6, 5]} />
        {bellyMat}
      </mesh>
      <mesh position={[0, -0.21, 2.15]} rotation-x={0.3} scale={[0.12, 0.018, 0.09]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#131c23" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.16, 0.8]} scale={[0.32, 0.3, 1.0]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      <mesh position={[0.24, 0.08, 1.9]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.24, 0.08, 1.9]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* the ridges that run along the back and flanks */}
      <mesh position={[0, 0.4, 0.55]} scale={[0.03, 0.03, 1.0]}>
        <sphereGeometry args={[1, 6, 5]} />
        {bodyMat}
      </mesh>
      <mesh position={[0.28, 0.3, 0.55]} scale={[0.03, 0.03, 0.95]}>
        <sphereGeometry args={[1, 6, 5]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.28, 0.3, 0.55]} scale={[0.03, 0.03, 0.95]}>
        <sphereGeometry args={[1, 6, 5]} />
        {bodyMat}
      </mesh>
      {spots.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} scale={0.04}>
          <sphereGeometry args={[1, 6, 5]} />
          {spotMat}
        </mesh>
      ))}
      {/* rounded paddle pectorals it rests on */}
      <mesh position={[0.34, -0.2, 1.05]} scale={[0.18, 0.045, 0.24]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.34, -0.2, 1.05]} scale={[0.18, 0.045, 0.24]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      {/* two small dorsals set well back */}
      <mesh position={[0, 0.42, 0]} rotation-x={-0.5} geometry={finGeometry} scale={0.6}>
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.3, -0.55]} rotation-x={-0.55} geometry={finGeometry} scale={0.45}>
        {bodyMat}
      </mesh>
      {/* tapering tail trunk flowing into the long low caudal fin */}
      <mesh position={[0, 0, -0.55]} scale={[0.22, 0.24, 0.85]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <group ref={tail} position={[0, 0, -1.3]}>
        <mesh position={[0, 0.07, -0.8]} rotation-x={0.1} scale={[0.04, 0.13, 0.95]}>
          <sphereGeometry args={[1, 8, 8]} />
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Goblin Shark · Mitsukurina owstoni — pink flabby body, flat blade of a
// rostrum over protruding needle-toothed jaws, low fins, long upper tail.
export const GoblinSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.4) * 0.35;
  });
  const bodyMat = (
    <meshStandardMaterial color="#cf95a0" emissive="#351d20" emissiveIntensity={0.45} flatShading roughness={0.65} />
  );
  const bellyMat = <meshStandardMaterial color="#eedadb" flatShading roughness={0.65} />;
  const jawMat = <meshStandardMaterial color="#b6707c" flatShading roughness={0.6} />;
  const toothMat = <meshStandardMaterial color="#efe9e2" roughness={0.4} />;
  return (
    <group position={[0, 0, 0.25]}>
      {/* soft, flabby deep-sea body */}
      <mesh scale={[0.42, 0.46, 1.5]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, 0, 1.5]} scale={[0.24, 0.26, 0.45]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.18, 0.1]} scale={[0.34, 0.3, 0.95]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      {/* the flattened blade-like rostrum jutting over the jaws */}
      <mesh position={[0, 0.18, 1.95]} rotation-x={0.12} scale={[0.13, 0.03, 0.5]}>
        <sphereGeometry args={[1, 8, 8]} />
        {bodyMat}
      </mesh>
      {/* slingshot jaws caught mid-protrusion, studded with nail teeth */}
      <mesh position={[0, -0.06, 1.8]} scale={[0.12, 0.09, 0.28]}>
        <sphereGeometry args={[1, 10, 8]} />
        {jawMat}
      </mesh>
      <mesh position={[0.04, -0.12, 2.0]} rotation-x={Math.PI}>
        <coneGeometry args={[0.018, 0.07, 4]} />
        {toothMat}
      </mesh>
      <mesh position={[-0.04, -0.12, 2.0]} rotation-x={Math.PI}>
        <coneGeometry args={[0.018, 0.07, 4]} />
        {toothMat}
      </mesh>
      <mesh position={[0.08, -0.1, 1.94]} rotation-x={Math.PI}>
        <coneGeometry args={[0.018, 0.07, 4]} />
        {toothMat}
      </mesh>
      <mesh position={[-0.08, -0.1, 1.94]} rotation-x={Math.PI}>
        <coneGeometry args={[0.018, 0.07, 4]} />
        {toothMat}
      </mesh>
      {/* small pale eyes — it hunts by electro-sense, not sight */}
      <mesh position={[0.16, 0.12, 1.6]} scale={0.04}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#2a1c20" roughness={0.35} />
      </mesh>
      <mesh position={[-0.16, 0.12, 1.6]} scale={0.04}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#2a1c20" roughness={0.35} />
      </mesh>
      {/* low, rounded fins — no speed needed in the deep */}
      <mesh position={[0, 0.48, -0.1]} scale={[0.045, 0.2, 0.28]}>
        <sphereGeometry args={[1, 8, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.36, -0.9]} scale={[0.04, 0.15, 0.22]}>
        <sphereGeometry args={[1, 8, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0.4, -0.2, 0.5]} rotation-z={-2.0} scale={[0.05, 0.3, 0.16]}>
        <sphereGeometry args={[1, 8, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.4, -0.2, 0.5]} rotation-z={2.0} scale={[0.05, 0.3, 0.16]}>
        <sphereGeometry args={[1, 8, 8]} />
        {bodyMat}
      </mesh>
      {/* asymmetric tail — long low upper lobe, barely any lower one */}
      <group ref={tail} position={[0, 0, -1.5]}>
        <mesh position={[0, 0, -0.05]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.18, 0.55, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.4, -0.6]} rotation-x={0.45} scale={[0.04, 0.13, 0.95]}>
          <sphereGeometry args={[1, 8, 8]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.14, -0.25]} rotation-x={2.65} geometry={finGeometry} scale={0.35}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Tasselled Wobbegong · Eucrossorhinus dasypogon — a flattened living carpet:
// broad fringed head, mottled camouflage and a fringe of tassels round the rim.
export const WobbegongModel = () => {
  const tail = useRef();
  // The beard: little dermal lobes fringing the head margin.
  const tassels = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 15; i++) {
      const a = -2.0 + (i / 14) * 4.0;
      pts.push([Math.sin(a) * 0.66, 1.2 + Math.cos(a) * 0.52, a]);
    }
    return pts;
  }, []);
  // Camouflage blotches scattered over the top. [x, z, size]
  const blotches = [
    [0, 0.9, 0.2],
    [0.35, 0.55, 0.17],
    [-0.4, 0.5, 0.16],
    [0.15, 0.1, 0.2],
    [-0.25, -0.05, 0.15],
    [0.3, -0.35, 0.14],
    [-0.15, -0.6, 0.15],
    [0.08, -1.0, 0.11],
    [-0.05, 1.25, 0.13],
  ];
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 0.8) * 0.18;
  });
  const bodyMat = (
    <meshStandardMaterial color="#8a7a54" emissive="#241d10" emissiveIntensity={0.45} flatShading roughness={0.7} />
  );
  const blotchMat = <meshStandardMaterial color="#4e4330" flatShading roughness={0.75} />;
  return (
    <group>
      {/* pancake-flat body */}
      <mesh position={[0, 0, 0.35]} scale={[0.72, 0.16, 1.0]}>
        <sphereGeometry args={[1, 14, 10]} />
        {bodyMat}
      </mesh>
      {/* even broader flattened head */}
      <mesh position={[0, 0, 1.2]} scale={[0.62, 0.14, 0.5]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* pale underside */}
      <mesh position={[0, -0.05, 0.35]} scale={[0.64, 0.1, 0.9]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#cdbf9a" flatShading roughness={0.7} />
      </mesh>
      {/* wide ambush mouth across the front */}
      <mesh position={[0, -0.04, 1.62]} scale={[0.38, 0.035, 0.1]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#1a140c" roughness={0.8} />
      </mesh>
      {/* eyes sit on top of the flat head */}
      <mesh position={[0.2, 0.12, 1.15]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.2, 0.12, 1.15]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* the tasselled beard around the head rim */}
      {tassels.map(([x, z, a], i) => (
        <group key={i} position={[x, -0.02, z]} rotation-y={a}>
          <mesh rotation-x={Math.PI / 2}>
            <coneGeometry args={[0.025, 0.14, 4]} />
            {bodyMat}
          </mesh>
        </group>
      ))}
      {/* camouflage blotches breaking up the outline */}
      {blotches.map(([x, z, s], i) => (
        <mesh key={i} position={[x, 0.1, z]} scale={[s, 0.06, s * 0.85]}>
          <sphereGeometry args={[1, 8, 6]} />
          {blotchMat}
        </mesh>
      ))}
      {/* wing-like pectoral flaps merging into the body outline */}
      <mesh position={[0.68, -0.01, 0.25]} scale={[0.3, 0.05, 0.45]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.68, -0.01, 0.25]} scale={[0.3, 0.05, 0.45]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0.42, -0.01, -0.55]} scale={[0.22, 0.045, 0.32]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.42, -0.01, -0.55]} scale={[0.22, 0.045, 0.32]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      {/* tapering tail trunk with two low dorsals near the back */}
      <mesh position={[0, 0, -0.75]} scale={[0.34, 0.11, 0.75]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.14, -0.85]} rotation-x={-0.5} scale={[0.03, 0.14, 0.16]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.12, -1.15]} rotation-x={-0.5} scale={[0.028, 0.12, 0.14]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      {/* low flat caudal fin */}
      <group ref={tail} position={[0, 0, -1.35]}>
        <mesh position={[0, 0.02, -0.35]} scale={[0.09, 0.08, 0.5]}>
          <sphereGeometry args={[1, 8, 8]} />
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Frilled Shark · Chlamydoselachus anguineus — an eel of a shark: long thin
// body, blunt snake-like head, ruffled gill frills, fins pushed far back.
export const FrilledSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.7) * 0.55;
  });
  const bodyMat = (
    <meshStandardMaterial color="#5e4c3c" emissive="#1c150e" emissiveIntensity={0.45} flatShading roughness={0.65} />
  );
  const frillMat = <meshStandardMaterial color="#7a6047" flatShading roughness={0.7} />;
  return (
    <group position={[0, 0, 0.35]}>
      {/* long serpentine trunk */}
      <mesh position={[0, 0, -0.15]} scale={[0.21, 0.23, 1.85]}>
        <sphereGeometry args={[1, 12, 10]} />
        {bodyMat}
      </mesh>
      {/* slightly paler underside */}
      <mesh position={[0, -0.08, -0.2]} scale={[0.17, 0.15, 1.5]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#8a7460" flatShading roughness={0.65} />
      </mesh>
      {/* blunt, rounded snake head with the mouth right at the front */}
      <mesh position={[0, 0, 1.6]} scale={[0.25, 0.21, 0.5]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.06, 2.02]} scale={[0.14, 0.025, 0.08]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#17100c" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.05, 1.85]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.15, 0.05, 1.85]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* the frills — ruffled gill collars behind the head */}
      <mesh position={[0, 0, 1.32]} scale={[0.3, 0.27, 0.09]}>
        <sphereGeometry args={[1, 12, 9]} />
        {frillMat}
      </mesh>
      <mesh position={[0, 0, 1.18]} scale={[0.28, 0.25, 0.08]}>
        <sphereGeometry args={[1, 12, 9]} />
        {frillMat}
      </mesh>
      <mesh position={[0, 0, 1.05]} scale={[0.26, 0.24, 0.07]}>
        <sphereGeometry args={[1, 12, 9]} />
        {frillMat}
      </mesh>
      {/* small paddle pectorals just behind the frills */}
      <mesh position={[0.18, -0.08, 0.85]} rotation-z={-1.9} scale={[0.04, 0.14, 0.16]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.18, -0.08, 0.85]} rotation-z={1.9} scale={[0.04, 0.14, 0.16]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      {/* everything else crowds the back end, eel-style */}
      <mesh position={[0, 0.24, -1.15]} rotation-x={-0.5} geometry={finGeometry} scale={0.45}>
        {bodyMat}
      </mesh>
      <mesh position={[0.14, -0.15, -0.75]} rotation-z={-2.3} scale={[0.04, 0.12, 0.18]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.14, -0.15, -0.75]} rotation-z={2.3} scale={[0.04, 0.12, 0.18]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.16, -1.3]} rotation-x={2.6} geometry={finGeometry} scale={0.35}>
        {bodyMat}
      </mesh>
      {/* long low ribbon of a tail */}
      <group ref={tail} position={[0, 0, -1.95]}>
        <mesh position={[0, 0.02, -0.4]} rotation-x={0.12} scale={[0.035, 0.09, 0.55]}>
          <sphereGeometry args={[1, 8, 8]} />
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Greenland Shark · Somniosus microcephalus — a heavy, sluggish barrel with
// stunted fins, tiny eyes trailing parasitic copepods, and mottled grey skin.
export const GreenlandSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // The slowest tail-beat in the collection, fittingly.
    if (tail.current) tail.current.rotation.y = Math.sin(t * 0.8) * 0.3;
  });
  const bodyMat = (
    <meshStandardMaterial color="#565b60" emissive="#14181b" emissiveIntensity={0.45} flatShading roughness={0.7} />
  );
  const bellyMat = <meshStandardMaterial color="#8f959a" flatShading roughness={0.7} />;
  const mottleMat = <meshStandardMaterial color="#676d72" flatShading roughness={0.7} />;
  return (
    <group>
      {/* massive cylindrical bulk */}
      <mesh scale={[0.55, 0.55, 1.7]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* short, bluntly rounded snout */}
      <mesh position={[0, -0.03, 1.45]} scale={[0.36, 0.32, 0.45]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.2, 0.05]} scale={[0.44, 0.36, 1.0]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      <mesh position={[0, -0.26, 1.4]} rotation-x={0.3} scale={[0.18, 0.02, 0.12]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#131c23" roughness={0.8} />
      </mesh>
      {/* mottled patches on the old, scarred hide */}
      <mesh position={[0.3, 0.35, 0.5]} scale={[0.16, 0.1, 0.22]}>
        <sphereGeometry args={[1, 8, 6]} />
        {mottleMat}
      </mesh>
      <mesh position={[-0.35, 0.25, -0.3]} scale={[0.14, 0.1, 0.2]}>
        <sphereGeometry args={[1, 8, 6]} />
        {mottleMat}
      </mesh>
      <mesh position={[0.2, 0.45, -0.7]} scale={[0.13, 0.09, 0.18]}>
        <sphereGeometry args={[1, 8, 6]} />
        {mottleMat}
      </mesh>
      <mesh position={[-0.2, 0.42, 0.9]} scale={[0.12, 0.09, 0.16]}>
        <sphereGeometry args={[1, 8, 6]} />
        {mottleMat}
      </mesh>
      {/* tiny eyes, each trailing its pale parasitic copepod */}
      <mesh position={[0.3, 0.04, 1.42]} scale={0.035}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.3, 0.04, 1.42]} scale={0.035}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[0.3, -0.05, 1.44]}>
        <cylinderGeometry args={[0.01, 0.01, 0.14, 5]} />
        <meshStandardMaterial color="#d8d2b8" roughness={0.6} />
      </mesh>
      <mesh position={[-0.3, -0.05, 1.44]}>
        <cylinderGeometry args={[0.01, 0.01, 0.14, 5]} />
        <meshStandardMaterial color="#d8d2b8" roughness={0.6} />
      </mesh>
      {/* comically small fins for the body size */}
      <mesh position={[0, 0.58, -0.3]} rotation-x={-0.45} geometry={finGeometry} scale={0.5}>
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.42, -1.2]} rotation-x={-0.5} geometry={finGeometry} scale={0.3}>
        {bodyMat}
      </mesh>
      <mesh position={[0.52, -0.2, 0.5]} rotation-z={-2.1} rotation-x={0.45} geometry={finGeometry} scale={0.75}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.52, -0.2, 0.5]} rotation-z={2.1} rotation-x={0.45} geometry={finGeometry} scale={0.75}>
        {bodyMat}
      </mesh>
      {/* short, stubby tail */}
      <group ref={tail} position={[0, 0, -1.55]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.26, 0.6, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.26, -0.38]} rotation-x={-2.45} geometry={finGeometry} scale={0.9}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.18, -0.32]} rotation-x={2.65} geometry={finGeometry} scale={0.55}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Cookiecutter Shark · Isistius brasiliensis — a small cigar of a shark:
// blunt head, big green eyes, dark collar and a glowing belly lure.
export const CookiecutterSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 2.4) * 0.4;
  });
  const bodyMat = (
    <meshStandardMaterial color="#6b4f3e" emissive="#1d130c" emissiveIntensity={0.45} flatShading roughness={0.6} />
  );
  return (
    // Rendered small on purpose — it really is a ~50 cm shark.
    <group scale={0.72}>
      {/* cigar-shaped body */}
      <mesh scale={[0.32, 0.32, 1.5]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* short blunt head */}
      <mesh position={[0, -0.02, 1.42]} scale={[0.24, 0.2, 0.3]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      {/* the round suctorial mouth it plugs into prey with */}
      <mesh position={[0, -0.12, 1.6]} rotation-x={0.5} scale={[0.12, 0.1, 0.04]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#17100c" roughness={0.8} />
      </mesh>
      {/* big green reflective eyes */}
      <mesh position={[0.19, 0.09, 1.35]} scale={0.08}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#355e42" emissive="#2d7a4a" emissiveIntensity={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[-0.19, 0.09, 1.35]} scale={0.08}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#355e42" emissive="#2d7a4a" emissiveIntensity={0.9} roughness={0.3} />
      </mesh>
      {/* the dark collar band — the "dog collar" behind the gills */}
      <mesh position={[0, 0, 0.95]} scale={[0.26, 0.26, 0.08]}>
        <sphereGeometry args={[1, 12, 9]} />
        <meshStandardMaterial color="#241812" flatShading roughness={0.7} />
      </mesh>
      {/* bioluminescent belly that hides its silhouette from below */}
      <mesh position={[0, -0.12, 0]} scale={[0.26, 0.22, 1.0]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial
          color="#b9d9c4"
          emissive="#4a7a5c"
          emissiveIntensity={0.5}
          flatShading
          roughness={0.5}
        />
      </mesh>
      {/* small fins crowded toward the back */}
      <mesh position={[0, 0.3, -0.85]} rotation-x={-0.5} geometry={finGeometry} scale={0.35}>
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.26, -1.15]} rotation-x={-0.55} geometry={finGeometry} scale={0.3}>
        {bodyMat}
      </mesh>
      <mesh position={[0.26, -0.12, 0.85]} scale={[0.1, 0.03, 0.14]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.26, -0.12, 0.85]} scale={[0.1, 0.03, 0.14]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      {/* small paddle tail */}
      <group ref={tail} position={[0, 0, -1.45]}>
        <mesh position={[0, 0, -0.05]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.14, 0.4, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.15, -0.25]} rotation-x={-2.5} geometry={finGeometry} scale={0.55}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.12, -0.22]} rotation-x={2.55} geometry={finGeometry} scale={0.5}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Epaulette Shark · Hemiscyllium ocellatum — slender little walker: paddle
// fins like legs, a bold white-ringed eyespot on each shoulder, spotted tan.
export const EpauletteSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  // Scatter of small dark freckles. [x, y, z]
  const spots = [
    [0.14, 0.26, 1.3],
    [-0.18, 0.24, 1.1],
    [0.2, 0.22, 0.8],
    [-0.12, 0.28, 0.55],
    [0.16, 0.25, 0.3],
    [-0.2, 0.22, 0.05],
    [0.1, 0.28, -0.2],
    [-0.14, 0.19, -0.5],
    [0.13, 0.17, -0.8],
    [-0.1, 0.16, -1.1],
    [0.26, 0.1, 0.45],
    [-0.27, 0.08, 0.9],
  ];
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.6) * 0.4;
  });
  const bodyMat = (
    <meshStandardMaterial color="#b89a66" emissive="#281f10" emissiveIntensity={0.45} flatShading roughness={0.6} />
  );
  const bellyMat = <meshStandardMaterial color="#e0d2ac" flatShading roughness={0.6} />;
  const spotMat = <meshStandardMaterial color="#4a3a22" flatShading roughness={0.65} />;
  return (
    <group scale={0.9} position={[0, 0, 0.2]}>
      {/* slim, flexible body */}
      <mesh position={[0, 0, 0.55]} scale={[0.32, 0.34, 1.25]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* short rounded head with high-set eyes */}
      <mesh position={[0, -0.04, 1.7]} scale={[0.24, 0.2, 0.4]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.14, 0.5]} scale={[0.26, 0.24, 1.0]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      <mesh position={[0, -0.18, 1.85]} rotation-x={0.3} scale={[0.1, 0.016, 0.08]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#131c23" roughness={0.8} />
      </mesh>
      <mesh position={[0.17, 0.1, 1.75]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.17, 0.1, 1.75]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* the epaulettes: big black ocelli ringed in white on each shoulder */}
      <mesh position={[0.3, 0.02, 0.75]} scale={[0.02, 0.13, 0.13]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#e8e0c8" flatShading roughness={0.55} />
      </mesh>
      <mesh position={[0.31, 0.02, 0.75]} scale={[0.02, 0.08, 0.08]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#17120c" roughness={0.4} />
      </mesh>
      <mesh position={[-0.3, 0.02, 0.75]} scale={[0.02, 0.13, 0.13]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#e8e0c8" flatShading roughness={0.55} />
      </mesh>
      <mesh position={[-0.31, 0.02, 0.75]} scale={[0.02, 0.08, 0.08]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#17120c" roughness={0.4} />
      </mesh>
      {spots.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} scale={0.035}>
          <sphereGeometry args={[1, 6, 5]} />
          {spotMat}
        </mesh>
      ))}
      {/* the walking paddles — muscular rounded pectorals and pelvics */}
      <mesh position={[0.3, -0.22, 1.05]} scale={[0.17, 0.05, 0.22]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.3, -0.22, 1.05]} scale={[0.17, 0.05, 0.22]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0.24, -0.2, 0.15]} scale={[0.14, 0.045, 0.18]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.24, -0.2, 0.15]} scale={[0.14, 0.045, 0.18]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      {/* two small dorsals pushed back over the tail trunk */}
      <mesh position={[0, 0.3, -0.45]} rotation-x={-0.5} geometry={finGeometry} scale={0.5}>
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.26, -0.9]} rotation-x={-0.55} geometry={finGeometry} scale={0.45}>
        {bodyMat}
      </mesh>
      {/* long tail trunk — almost half the shark */}
      <mesh position={[0, 0, -0.55]} scale={[0.19, 0.21, 0.85]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <group ref={tail} position={[0, 0, -1.35]}>
        <mesh position={[0, 0.04, -0.45]} rotation-x={0.1} scale={[0.035, 0.1, 0.6]}>
          <sphereGeometry args={[1, 8, 8]} />
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Angel Shark · Squatina squatina — flattened like a ray: huge wing-like
// pectorals, eyes on top of a broad flat head, sandy mottled camouflage.
export const AngelSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  // Sandy mottling over the upper surface. [x, z, size]
  const mottles = [
    [0.15, 0.9, 0.13],
    [-0.22, 0.7, 0.12],
    [0.3, 0.35, 0.14],
    [-0.35, 0.2, 0.12],
    [0.05, 0.05, 0.13],
    [0.55, 0.45, 0.11],
    [-0.6, 0.4, 0.11],
    [0.12, -0.9, 0.09],
    [-0.08, -0.45, 0.1],
  ];
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.2) * 0.25;
  });
  const bodyMat = (
    <meshStandardMaterial color="#a5977a" emissive="#24200f" emissiveIntensity={0.45} flatShading roughness={0.7} />
  );
  const mottleMat = <meshStandardMaterial color="#6b5f42" flatShading roughness={0.75} />;
  return (
    <group position={[0, 0, 0.3]}>
      {/* flattened trunk */}
      <mesh position={[0, 0, 0.35]} scale={[0.5, 0.15, 0.95]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* broad flat head, eyes and spiracles on top */}
      <mesh position={[0, 0, 1.15]} scale={[0.44, 0.13, 0.45]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.02, 1.58]} scale={[0.26, 0.03, 0.08]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#1a140c" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.11, 1.25]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.15, 0.11, 1.25]} scale={0.045}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* pale underside */}
      <mesh position={[0, -0.04, 0.4]} scale={[0.44, 0.11, 0.85]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#ccc6ac" flatShading roughness={0.7} />
      </mesh>
      {/* the giant pectoral "wings" spread flat to the sides */}
      <mesh position={[0.6, -0.02, 0.35]} rotation-z={0.06} scale={[0.42, 0.05, 0.6]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.6, -0.02, 0.35]} rotation-z={-0.06} scale={[0.42, 0.05, 0.6]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* smaller pelvic wings behind them */}
      <mesh position={[0.38, -0.02, -0.5]} scale={[0.26, 0.04, 0.4]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.38, -0.02, -0.5]} scale={[0.26, 0.04, 0.4]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      {mottles.map(([x, z, s], i) => (
        <mesh key={i} position={[x, 0.09, z]} scale={[s, 0.05, s * 0.85]}>
          <sphereGeometry args={[1, 8, 6]} />
          {mottleMat}
        </mesh>
      ))}
      {/* muscular tail trunk with both dorsals pushed right back */}
      <mesh position={[0, 0, -1.0]} scale={[0.2, 0.11, 0.75]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.14, -1.05]} rotation-x={-0.5} geometry={finGeometry} scale={0.35}>
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.12, -1.4]} rotation-x={-0.55} geometry={finGeometry} scale={0.3}>
        {bodyMat}
      </mesh>
      {/* small caudal fin */}
      <group ref={tail} position={[0, 0, -1.7]}>
        <mesh position={[0, 0, -0.25]} scale={[0.06, 0.16, 0.3]}>
          <sphereGeometry args={[1, 8, 8]} />
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Port Jackson Shark · Heterodontus portusjacksoni — blunt pig-like head with
// crests over the eyes, dark harness straps, and a spine before each dorsal.
export const PortJacksonSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.6) * 0.35;
  });
  const bodyMat = (
    <meshStandardMaterial color="#93876f" emissive="#211c14" emissiveIntensity={0.45} flatShading roughness={0.65} />
  );
  const bellyMat = <meshStandardMaterial color="#d2c9b6" flatShading roughness={0.65} />;
  const harnessMat = <meshStandardMaterial color="#453b2c" flatShading roughness={0.7} />;
  const spineMat = <meshStandardMaterial color="#d8d0c0" roughness={0.45} />;
  return (
    <group>
      {/* tapering body, deepest at the shoulders */}
      <mesh scale={[0.48, 0.52, 1.4]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      {/* tall blunt forehead with the ridged crests above each eye */}
      <mesh position={[0, 0.05, 1.25]} scale={[0.34, 0.4, 0.5]}>
        <sphereGeometry args={[1, 12, 9]} />
        {bodyMat}
      </mesh>
      <mesh position={[0.16, 0.42, 1.2]} scale={[0.08, 0.07, 0.24]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      <mesh position={[-0.16, 0.42, 1.2]} scale={[0.08, 0.07, 0.24]}>
        <sphereGeometry args={[1, 8, 6]} />
        {bodyMat}
      </mesh>
      <mesh position={[0.29, 0.24, 1.25]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.29, 0.24, 1.25]} scale={0.05}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* pale pig-like muzzle with a small underslung mouth */}
      <mesh position={[0, -0.12, 1.6]} scale={[0.2, 0.15, 0.28]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      <mesh position={[0, -0.18, 1.78]} rotation-x={0.35} scale={[0.12, 0.02, 0.08]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#131c23" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.2, 0.1]} scale={[0.4, 0.34, 0.9]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bellyMat}
      </mesh>
      {/* the harness — dark bar across the eyes, a shoulder band, and a
          diagonal strap running down each flank */}
      <mesh position={[0, 0.34, 1.3]} scale={[0.32, 0.05, 0.06]}>
        <sphereGeometry args={[1, 10, 8]} />
        {harnessMat}
      </mesh>
      <mesh position={[0, 0.02, 0.55]} scale={[0.46, 0.5, 0.05]}>
        <sphereGeometry args={[1, 12, 9]} />
        {harnessMat}
      </mesh>
      <mesh position={[0.465, -0.02, 0.25]} rotation-z={0.5} scale={[0.02, 0.32, 0.07]}>
        <sphereGeometry args={[1, 8, 6]} />
        {harnessMat}
      </mesh>
      <mesh position={[-0.465, -0.02, 0.25]} rotation-z={-0.5} scale={[0.02, 0.32, 0.07]}>
        <sphereGeometry args={[1, 8, 6]} />
        {harnessMat}
      </mesh>
      {/* both dorsals carry a defensive spine on the leading edge */}
      <mesh position={[0, 0.68, 0.12]} rotation-x={-0.15}>
        <coneGeometry args={[0.035, 0.28, 5]} />
        {spineMat}
      </mesh>
      <mesh position={[0, 0.62, -0.05]} rotation-x={-0.5} geometry={finGeometry} scale={0.85}>
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.5, -0.85]} rotation-x={-0.2}>
        <coneGeometry args={[0.03, 0.22, 5]} />
        {spineMat}
      </mesh>
      <mesh position={[0, 0.42, -1.0]} rotation-x={-0.55} geometry={finGeometry} scale={0.55}>
        {bodyMat}
      </mesh>
      {/* broad pectorals it props itself on, plus small pelvics */}
      <mesh position={[0.52, -0.22, 0.45]} rotation-z={-2.1} rotation-x={0.45} geometry={finGeometry}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.52, -0.22, 0.45]} rotation-z={2.1} rotation-x={0.45} geometry={finGeometry}>
        {bodyMat}
      </mesh>
      <mesh position={[0.24, -0.3, -0.45]} rotation-z={-2.4} rotation-x={0.5} geometry={finGeometry} scale={0.5}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.24, -0.3, -0.45]} rotation-z={2.4} rotation-x={0.5} geometry={finGeometry} scale={0.5}>
        {bodyMat}
      </mesh>
      <group ref={tail} position={[0, 0, -1.45]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.22, 0.65, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.28, -0.4]} rotation-x={-2.45} geometry={finGeometry} scale={0.95}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.18, -0.34]} rotation-x={2.65} geometry={finGeometry} scale={0.55}>
          {bodyMat}
        </mesh>
      </group>
    </group>
  );
};

// Basking Shark · Cetorhinus maximus — the second-largest fish alive:
// grey-brown, a cavernous gaping mouth, gill slits that nearly ring the
// head, and a tall crescent tail pushing it slowly through the plankton.
export const BaskingSharkModel = () => {
  const tail = useRef();
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 0.9) * 0.3;
  });
  const bodyMat = (
    <meshStandardMaterial color="#6a6157" emissive="#241f19" emissiveIntensity={0.4} flatShading roughness={0.7} />
  );
  return (
    <group scale={1.2}>
      {/* heavy barrel body */}
      <mesh scale={[0.52, 0.55, 1.8]}>
        <sphereGeometry args={[1, 14, 10]} />
        {bodyMat}
      </mesh>
      {/* pale belly */}
      <mesh position={[0, -0.22, -0.1]} scale={[0.4, 0.32, 1.15]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#b0aa9c" flatShading roughness={0.7} />
      </mesh>
      {/* the whole head is the mouth: cheeks flare out to one open rim, with
          a flat black disc recessed inside — a clean gaping scoop, no lumps.
          (rotation-x swaps y/z, so the cheek cone's scale-z is world height) */}
      <mesh position={[0, -0.02, 1.3]} rotation-x={Math.PI / 2} scale={[1, 1, 1.08]}>
        <cylinderGeometry args={[0.38, 0.46, 0.8, 12]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.02, 1.68]} scale={[1, 1.1, 1]}>
        <torusGeometry args={[0.34, 0.055, 8, 18]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, -0.02, 1.64]}>
        <circleGeometry args={[0.36, 18]} />
        <meshStandardMaterial color="#12100d" roughness={0.9} />
      </mesh>
      {/* the small pointed snout overhanging the gape */}
      <mesh position={[0, 0.32, 1.6]} scale={[0.17, 0.13, 0.3]}>
        <sphereGeometry args={[1, 10, 8]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.32, 1.95]} rotation-x={Math.PI / 2} scale={[1, 1, 0.8]}>
        <coneGeometry args={[0.13, 0.45, 8]} />
        {bodyMat}
      </mesh>
      {/* small eyes tucked either side of the snout base */}
      <mesh position={[0.16, 0.28, 1.78]} scale={0.04}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      <mesh position={[-0.16, 0.28, 1.78]} scale={0.04}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0d1216" roughness={0.35} />
      </mesh>
      {/* five huge gill slits nearly encircling the head */}
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} position={[0, -0.02, 1.05 - i * 0.16]}>
          <mesh position={[0.44, 0, 0]} rotation-z={0.1} scale={[0.025, 0.42, 0.06]}>
            <sphereGeometry args={[1, 6, 5]} />
            <meshStandardMaterial color="#332d26" roughness={0.85} />
          </mesh>
          <mesh position={[-0.44, 0, 0]} rotation-z={-0.1} scale={[0.025, 0.42, 0.06]}>
            <sphereGeometry args={[1, 6, 5]} />
            <meshStandardMaterial color="#332d26" roughness={0.85} />
          </mesh>
        </group>
      ))}
      {/* tall triangular dorsal */}
      <mesh position={[0, 0.68, -0.2]} rotation-x={-0.35} geometry={finGeometry} scale={1.2}>
        {bodyMat}
      </mesh>
      {/* broad pectorals */}
      <mesh position={[0.55, -0.22, 0.45]} rotation-z={-2.1} rotation-x={0.5} geometry={finGeometry} scale={1.15}>
        {bodyMat}
      </mesh>
      <mesh position={[-0.55, -0.22, 0.45]} rotation-z={2.1} rotation-x={0.5} geometry={finGeometry} scale={1.15}>
        {bodyMat}
      </mesh>
      {/* tail: thick peduncle into a tall crescent */}
      <group ref={tail} position={[0, 0, -1.65]}>
        <mesh position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[0.55, 1, 1]}>
          <coneGeometry args={[0.26, 0.7, 6]} />
          {bodyMat}
        </mesh>
        <mesh position={[0, 0.34, -0.45]} rotation-x={-2.4} geometry={finGeometry} scale={[1, 1.5, 1]}>
          {bodyMat}
        </mesh>
        <mesh position={[0, -0.26, -0.4]} rotation-x={2.55} geometry={finGeometry} scale={0.95}>
          {bodyMat}
        </mesh>
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

// The sperm whale patrols a huge slow circle above the giant squid's haunt,
// mostly a silhouette drifting in and out of the fog.
export const SpermWhale = ({ center = [-4, -74, -14], radius = 18, speed = 0.045 }) => (
  <Orbiter center={center} radius={radius} speed={speed} squish={0.75} bob={1.8} bobSpeed={0.25}>
    <SpermWhaleModel />
  </Orbiter>
);

// The swordfish is the opposite: a small, fast blade flashing past.
export const Swordfish = ({ center = [4, -32, -2], radius = 16, speed = 0.38 }) => (
  <Orbiter center={center} radius={radius} speed={speed} squish={0.75} bob={1.2} bobSpeed={0.5}>
    <SwordfishModel />
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
        prevY: null,
      })),
    [count, radius]
  );

  // A small pool of reusable splashes, fired whenever a dolphin dives back
  // through the surface plane: an expanding foam ring and ripple, a spray
  // plume, and a crown of droplets that leap up and fall away.
  const SPLASH_DURATION = 1.15;
  const splashes = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        group: React.createRef(),
        ring: React.createRef(),
        ripple: React.createRef(),
        foam: React.createRef(),
        plume: React.createRef(),
        drops: Array.from({ length: 9 }, (_, j) => {
          // Deterministic per-droplet jitter so the pool never re-randomises.
          const rnd = (n) => {
            const v = Math.sin((i * 9 + j) * 12.9898 + n * 78.233) * 43758.5453;
            return v - Math.floor(v);
          };
          return {
            ref: React.createRef(),
            theta: (j / 9) * Math.PI * 2 + rnd(1) * 0.8,
            out: 0.9 + rnd(2) * 1.1,
            up: 2.4 + rnd(3) * 1.6,
          };
        }),
        start: -1,
        spray: true,
        strength: 1,
      })),
    []
  );
  const nextSplash = useRef(0);

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
      // Crossing the surface plane fires a splash there: the full show with
      // spray on the way down, just a soft ripple on the way out.
      if (d.prevY !== null) {
        const dive = d.prevY >= center[1] && here.y < center[1];
        const breach = d.prevY < center[1] && here.y >= center[1];
        if (dive || breach) {
          const s = splashes[nextSplash.current++ % splashes.length];
          s.start = t;
          s.spray = dive;
          s.strength = dive ? 1 : 0.55;
          if (s.group.current) {
            s.group.current.position.set(here.x, center[1] + 0.03, here.z);
            s.group.current.scale.setScalar(d.size * (dive ? 1 : 0.7));
            s.group.current.visible = true;
          }
        }
      }
      d.prevY = here.y;
      d.ref.current.position.copy(here);
      posOf(d, a + 0.04, target);
      d.ref.current.lookAt(target);
    });

    splashes.forEach((s) => {
      if (s.start < 0 || !s.group.current) return;
      const k = (t - s.start) / SPLASH_DURATION;
      if (k >= 1) {
        s.group.current.visible = false;
        s.start = -1;
        return;
      }
      const ease = 1 - (1 - k) * (1 - k);
      if (s.ring.current) {
        s.ring.current.scale.setScalar(0.5 + 2.4 * ease);
        s.ring.current.material.opacity = 0.7 * s.strength * (1 - k) * (1 - k);
      }
      // The second ripple chases the first after a beat.
      const k2 = Math.max(0, Math.min(1, (k * SPLASH_DURATION - 0.15) / (SPLASH_DURATION - 0.15)));
      if (s.ripple.current) {
        const e2 = 1 - (1 - k2) * (1 - k2);
        s.ripple.current.scale.setScalar(0.3 + 1.7 * e2);
        s.ripple.current.material.opacity = k2 <= 0 ? 0 : 0.5 * s.strength * (1 - k2);
      }
      if (s.foam.current) {
        s.foam.current.scale.setScalar(0.4 + 1.4 * ease);
        s.foam.current.material.opacity = 0.3 * s.strength * (1 - k);
      }
      if (s.plume.current) {
        const sp = Math.sin(Math.min(1, k * 2.1) * Math.PI);
        s.plume.current.visible = s.spray;
        s.plume.current.scale.set(0.5 + 0.3 * sp, 0.15 + 1.05 * sp, 0.5 + 0.3 * sp);
        s.plume.current.position.y = 0.45 * (0.15 + 1.05 * sp);
        s.plume.current.material.opacity = 0.75 * (1 - k);
      }
      const age = k * SPLASH_DURATION;
      s.drops.forEach((dp) => {
        if (!dp.ref.current) return;
        const y = dp.up * age - 5.2 * age * age;
        dp.ref.current.visible = s.spray && y > -0.15;
        dp.ref.current.position.set(
          Math.cos(dp.theta) * dp.out * (0.15 + age),
          y,
          Math.sin(dp.theta) * dp.out * (0.15 + age)
        );
        dp.ref.current.scale.setScalar(0.09 * (1 - 0.5 * k));
        dp.ref.current.material.opacity = 0.9 * (1 - k);
      });
    });
  });

  return (
    <group>
      {pod.map((d, i) => (
        <group key={i} ref={d.ref} scale={d.size}>
          <DolphinModel />
        </group>
      ))}
      {splashes.map((s, i) => (
        <group key={`splash-${i}`} ref={s.group} visible={false}>
          <mesh ref={s.ring} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.72, 1, 20]} />
            <meshBasicMaterial color="#dff3fb" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh ref={s.ripple} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.55, 0.8, 16]} />
            <meshBasicMaterial color="#bfe4f2" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh ref={s.foam} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[0.7, 16]} />
            <meshBasicMaterial color="#eaf7fc" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh ref={s.plume}>
            <coneGeometry args={[0.3, 0.9, 7]} />
            <meshBasicMaterial color="#eaf7fc" transparent opacity={0} depthWrite={false} />
          </mesh>
          {s.drops.map((dp, j) => (
            <mesh key={j} ref={dp.ref}>
              <sphereGeometry args={[1, 6, 5]} />
              <meshBasicMaterial color="#eaf7fc" transparent opacity={0} depthWrite={false} />
            </mesh>
          ))}
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

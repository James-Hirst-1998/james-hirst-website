import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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

// A stylised shark cruising a wide, slow circle. The signature resident.
export const Shark = ({ center = [0, -58, -10], radius = 15, speed = 0.14 }) => {
  const group = useRef();
  const tail = useRef();
  const target = useMemo(() => new THREE.Vector3(), []);
  const finGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.1, 4);
    geo.scale(0.18, 1, 1);
    return geo;
  }, []);

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
    if (tail.current) tail.current.rotation.y = Math.sin(t * 2.2) * 0.45;
  });

  const bodyColor = "#6b8a9c";
  const bellyColor = "#a9c2cd";

  return (
    <group ref={group}>
      <mesh scale={[0.5, 0.55, 1.75]}>
        <sphereGeometry args={[1, 12, 9]} />
        <meshStandardMaterial color={bodyColor} emissive="#1c3140" emissiveIntensity={0.5} flatShading roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.22, 0.35]} scale={[0.42, 0.35, 1.15]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={bellyColor} flatShading roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.72, 0.1]} rotation-x={-0.35} geometry={finGeometry}>
        <meshStandardMaterial color={bodyColor} emissive="#1c3140" emissiveIntensity={0.5} flatShading roughness={0.55} />
      </mesh>
      <mesh position={[0.55, -0.15, 0.45]} rotation-z={-1.9} rotation-x={0.25} geometry={finGeometry}>
        <meshStandardMaterial color={bodyColor} emissive="#1c3140" emissiveIntensity={0.5} flatShading roughness={0.55} />
      </mesh>
      <mesh position={[-0.55, -0.15, 0.45]} rotation-z={1.9} rotation-x={0.25} geometry={finGeometry}>
        <meshStandardMaterial color={bodyColor} emissive="#1c3140" emissiveIntensity={0.5} flatShading roughness={0.55} />
      </mesh>
      <group ref={tail} position={[0, 0, -1.75]}>
        <mesh position={[0, 0.35, -0.25]} rotation-x={-2.5} geometry={finGeometry} scale={1.25}>
          <meshStandardMaterial color={bodyColor} emissive="#1c3140" emissiveIntensity={0.5} flatShading roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.25, -0.18]} rotation-x={2.7} geometry={finGeometry} scale={0.8}>
          <meshStandardMaterial color={bodyColor} emissive="#1c3140" emissiveIntensity={0.5} flatShading roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
};

// Softly pulsing jellyfish drifting upward through the twilight zone.
const Jellyfish = ({ position, phase, tint }) => {
  const group = useRef();
  const bell = useRef();
  const tentacles = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.9 + phase) * 0.13;
    if (bell.current) bell.current.scale.set(pulse, 1.9 - pulse * 0.75, pulse);
    let y = position[1] + ((t * 0.5 + phase * 6) % 26);
    group.current.position.set(
      position[0] + Math.sin(t * 0.25 + phase) * 1.6,
      y,
      position[2]
    );
    if (tentacles.current) {
      tentacles.current.rotation.x = Math.sin(t * 0.9 + phase) * 0.12;
      tentacles.current.rotation.z = Math.cos(t * 0.7 + phase) * 0.12;
    }
  });

  return (
    <group ref={group}>
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
      <group ref={tentacles}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.26, -0.55, Math.sin(a) * 0.26]}>
              <cylinderGeometry args={[0.012, 0.03, 1.1, 4]} />
              <meshStandardMaterial color={tint} transparent opacity={0.4} />
            </mesh>
          );
        })}
      </group>
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

// An anglerfish stalking the abyssal dark, all but invisible except for the
// glowing lure bobbing ahead of its jaws.
export const Anglerfish = ({ center = [0, -86, -8], radius = 6, speed = 0.16 }) => {
  const group = useRef();
  const lure = useRef();
  const lureLight = useRef();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = t * speed;
    const x = center[0] + Math.cos(a) * radius;
    const z = center[2] + Math.sin(a) * radius * 0.6;
    const y = center[1] + Math.sin(t * 0.7) * 0.8;
    group.current.position.set(x, y, z);
    const ahead = a + 0.12;
    target.set(
      center[0] + Math.cos(ahead) * radius,
      y + Math.sin(t * 0.7 + 0.3) * 0.8,
      center[2] + Math.sin(ahead) * radius * 0.6
    );
    group.current.lookAt(target);
    if (lure.current) lure.current.position.y = 0.78 + Math.sin(t * 2.6) * 0.06;
    if (lureLight.current)
      lureLight.current.intensity = 5.5 + Math.sin(t * 5.3) * 1.4 + Math.sin(t * 11.7) * 0.6;
  });

  return (
    <group ref={group}>
      <mesh scale={[0.55, 0.62, 0.85]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#131b22" flatShading roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.18, 0.62]} rotation-x={0.5} scale={[0.42, 0.2, 0.35]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#0c1218" flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.1, -0.95]} rotation-x={Math.PI / 2} scale={[0.16, 1, 1]}>
        <coneGeometry args={[0.45, 0.8, 4]} />
        <meshStandardMaterial color="#131b22" flatShading roughness={0.85} />
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

// A sea turtle cruising the sunlit shallows. Its orbit straddles the camera,
// so it drifts past whichever way you happen to be looking.
export const Turtle = ({ center = [0, -10, 4], radius = 13, speed = 0.09 }) => {
  const group = useRef();
  const flippers = useRef();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = t * speed;
    const x = center[0] + Math.cos(a) * radius;
    const z = center[2] + Math.sin(a) * radius * 0.8;
    const y = center[1] + Math.sin(t * 0.5) * 0.9;
    group.current.position.set(x, y, z);
    const ahead = a + 0.1;
    target.set(
      center[0] + Math.cos(ahead) * radius,
      y + Math.sin(t * 0.5 + 0.25) * 0.9,
      center[2] + Math.sin(ahead) * radius * 0.8
    );
    group.current.lookAt(target);
    if (flippers.current) flippers.current.rotation.z = Math.sin(t * 1.6) * 0.35;
  });

  return (
    <group ref={group} scale={1.15}>
      {/* shell */}
      <mesh scale={[0.72, 0.4, 0.95]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#4f7a58" flatShading roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.18, 0]} scale={[0.66, 0.22, 0.88]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#c9c08a" flatShading roughness={0.85} />
      </mesh>
      {/* head */}
      <mesh position={[0, -0.02, 0.98]} scale={[0.2, 0.18, 0.3]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#7ba374" flatShading roughness={0.8} />
      </mesh>
      {/* front flippers flap together; rear ones trail */}
      <group ref={flippers}>
        <mesh position={[0.78, -0.08, 0.42]} rotation-z={-0.5} rotation-y={0.5} scale={[0.55, 0.08, 0.24]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#7ba374" flatShading roughness={0.8} />
        </mesh>
        <mesh position={[-0.78, -0.08, 0.42]} rotation-z={0.5} rotation-y={-0.5} scale={[0.55, 0.08, 0.24]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#7ba374" flatShading roughness={0.8} />
        </mesh>
      </group>
      <mesh position={[0.42, -0.08, -0.75]} rotation-y={-0.6} scale={[0.34, 0.07, 0.18]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#7ba374" flatShading roughness={0.8} />
      </mesh>
      <mesh position={[-0.42, -0.08, -0.75]} rotation-y={0.6} scale={[0.34, 0.07, 0.18]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#7ba374" flatShading roughness={0.8} />
      </mesh>
    </group>
  );
};

// A manta ray sweeping wide, slow circles around the twilight zone,
// wings beating gently. Orbit surrounds the camera like the turtle's.
export const MantaRay = ({ center = [0, -57, 5], radius = 15, speed = 0.11 }) => {
  const group = useRef();
  const wingL = useRef();
  const wingR = useRef();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = t * speed;
    const x = center[0] + Math.cos(a) * radius;
    const z = center[2] + Math.sin(a) * radius * 0.85;
    const y = center[1] + Math.sin(t * 0.35) * 1.6;
    group.current.position.set(x, y, z);
    const ahead = a + 0.09;
    target.set(
      center[0] + Math.cos(ahead) * radius,
      y + Math.sin(t * 0.35 + 0.2) * 1.6,
      center[2] + Math.sin(ahead) * radius * 0.85
    );
    group.current.lookAt(target);
    const flap = Math.sin(t * 1.3);
    if (wingL.current) wingL.current.rotation.z = flap * 0.45;
    if (wingR.current) wingR.current.rotation.z = -flap * 0.45;
  });

  return (
    <group ref={group} scale={1.5}>
      {/* body */}
      <mesh scale={[0.42, 0.16, 0.9]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#33505e" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.06, 0.2]} scale={[0.36, 0.1, 0.7]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#9fb6bd" flatShading roughness={0.75} />
      </mesh>
      {/* wings hinge at the body */}
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
      {/* tail */}
      <mesh position={[0, 0, -1.25]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.015, 0.05, 0.9, 4]} />
        <meshStandardMaterial color="#33505e" roughness={0.8} />
      </mesh>
    </group>
  );
};

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

// A whale crossing far in the twilight haze — mostly silhouette, felt more
// than seen. It swims a long straight pass, then loops around off-screen.
export const Whale = ({ y = -40, z = -32, span = 110, speed = 3.2 }) => {
  const group = useRef();
  const tail = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const cycle = (span * 2) / speed;
    const phase = (t % cycle) / cycle;
    // Out along the pass, then teleport back while hidden in the fog.
    const x = -span + phase * span * 2;
    group.current.position.set(x, y + Math.sin(t * 0.3) * 2.2, z);
    group.current.rotation.z = Math.sin(t * 0.3) * 0.05;
    if (tail.current) tail.current.rotation.x = Math.sin(t * 1.1) * 0.22;
  });

  return (
    <group ref={group} rotation-y={Math.PI / 2} scale={2.6}>
      <mesh scale={[0.62, 0.68, 2.6]}>
        <sphereGeometry args={[1, 12, 9]} />
        <meshStandardMaterial color="#16303f" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.3, 1.4]} scale={[0.5, 0.4, 1.3]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#1d3c4e" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0.7, -0.1, 0.9]} rotation-z={-2.2} rotation-y={0.3} scale={[0.12, 0.9, 0.45]}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#16303f" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[-0.7, -0.1, 0.9]} rotation-z={2.2} rotation-y={-0.3} scale={[0.12, 0.9, 0.45]}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial color="#16303f" flatShading roughness={0.7} />
      </mesh>
      <group ref={tail} position={[0, 0.05, -2.5]}>
        <mesh rotation-y={Math.PI / 2} scale={[0.5, 0.1, 1.5]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#16303f" flatShading roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

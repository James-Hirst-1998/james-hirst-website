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
  </group>
);

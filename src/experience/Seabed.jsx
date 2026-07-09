import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Octopus } from "./Creatures";

const FLOOR_Y = -107;

const Kelp = ({ position, height, phase }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.55 + phase) * 0.09;
    ref.current.rotation.x = Math.cos(t * 0.4 + phase) * 0.05;
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.16, height, 5]} />
        <meshStandardMaterial color="#2f6b4d" flatShading roughness={0.8} />
      </mesh>
      <mesh position={[0, height * 0.98, 0]} scale={[0.5, 1.6, 0.5]}>
        <coneGeometry args={[0.35, 1.4, 5]} />
        <meshStandardMaterial color="#3b8560" flatShading roughness={0.8} />
      </mesh>
    </group>
  );
};

const Rock = ({ position, scale, tone }) => (
  <mesh position={position} scale={scale} rotation={[position[0], position[2], 0]}>
    <icosahedronGeometry args={[1, 0]} />
    <meshStandardMaterial color={tone} flatShading roughness={0.9} />
  </mesh>
);

// The easter egg: a glass fishbowl glowing gently on the seabed.
const Fishbowl = () => {
  const fish = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    fish.current.position.set(Math.cos(t * 1.4) * 0.32, 0.15 + Math.sin(t * 2.2) * 0.08, Math.sin(t * 1.4) * 0.32);
    fish.current.rotation.y = -t * 1.4 + Math.PI / 2;
  });
  return (
    <group position={[4.5, FLOOR_Y + 0.85, -2]}>
      <pointLight color="#ffb45e" intensity={6} distance={7} />
      <mesh>
        <sphereGeometry args={[0.85, 16, 12]} />
        <meshStandardMaterial color="#bfe8f0" transparent opacity={0.18} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.45, 0]} scale={[1, 0.35, 1]}>
        <sphereGeometry args={[0.68, 12, 8]} />
        <meshStandardMaterial color="#c9b98a" flatShading roughness={1} />
      </mesh>
      <group ref={fish}>
        <mesh scale={[0.12, 0.16, 0.4]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#f5923e" emissive="#f5923e" emissiveIntensity={0.6} flatShading />
        </mesh>
      </group>
    </group>
  );
};

export const Seabed = () => {
  const floorGeometry = useMemo(() => {
    // Big enough that a full 360° look-around never reveals an edge.
    const geo = new THREE.PlaneGeometry(220, 220, 56, 56);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.35) * Math.cos(y * 0.3) * 0.9 + Math.sin(x * 0.11 + y * 0.17) * 1.4);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const kelp = useMemo(() => {
    const list = [];
    for (let i = 0; i < 16; i++) {
      const x = -30 + i * 4 + ((i * 7) % 5);
      const z = -16 + ((i * 5) % 12);
      list.push({
        position: [x, FLOOR_Y, z],
        height: 5 + ((i * 3) % 6),
        phase: i * 0.7,
      });
    }
    return list;
  }, []);

  return (
    <group>
      <mesh geometry={floorGeometry} rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, 0]}>
        <meshStandardMaterial color="#8d8368" flatShading roughness={1} />
      </mesh>
      {kelp.map((k, i) => (
        <Kelp key={i} {...k} />
      ))}
      <Rock position={[-8, FLOOR_Y + 0.4, -6]} scale={[1.8, 1.1, 1.4]} tone="#4a5a63" />
      <Rock position={[10, FLOOR_Y + 0.3, -9]} scale={[1.2, 0.8, 1]} tone="#41505a" />
      <Rock position={[-16, FLOOR_Y + 0.5, -14]} scale={[2.4, 1.5, 1.8]} tone="#3c4a52" />
      <Rock position={[1, FLOOR_Y + 0.25, -4]} scale={[0.8, 0.5, 0.7]} tone="#4a5a63" />
      {/* behind the camera — reward for a look back at the bottom */}
      <Rock position={[9, FLOOR_Y - 0.9, 16]} scale={[1.6, 1, 1.3]} tone="#41505a" />
      <Octopus position={[7, FLOOR_Y - 1.1, 15]} />
      <Fishbowl />
    </group>
  );
};

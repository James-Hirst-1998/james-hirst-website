import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scroll } from "./scrollState";

// The underside of the water surface: a shimmering plane of moving ripples.
export const WaterSurface = () => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uFade: { value: 1 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uFade;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv * 40.0;
            float w = 0.0;
            w += sin(p.x * 1.1 + uTime * 0.9) * sin(p.y * 1.3 - uTime * 0.7);
            w += sin((p.x + p.y) * 0.7 + uTime * 1.3) * 0.6;
            w += sin(length(p - 20.0) * 1.7 - uTime * 1.1) * 0.4;
            w = smoothstep(0.15, 1.6, w);
            float edge = smoothstep(0.5, 0.12, distance(vUv, vec2(0.5)));
            vec3 tint = mix(vec3(0.55, 0.85, 0.95), vec3(1.0), w);
            gl_FragColor = vec4(tint, w * 0.5 * edge * uFade);
          }
        `,
      }),
    []
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uFade.value = THREE.MathUtils.clamp(1 - scroll.progress * 3.2, 0, 1);
  });

  return (
    <mesh position={[0, 9, -10]} rotation-x={Math.PI / 2} material={material}>
      <planeGeometry args={[220, 160]} />
    </mesh>
  );
};

// Volumetric-looking light shafts near the surface: tall quads with a soft
// vertical + horizontal alpha falloff, additively blended.
const rayMaterialFactory = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uFade: { value: 1 },
      uSeed: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uFade;
      uniform float uSeed;
      varying vec2 vUv;
      void main() {
        float vertical = smoothstep(0.0, 0.35, vUv.y) * pow(vUv.y, 1.6);
        float horizontal = smoothstep(0.0, 0.45, vUv.x) * smoothstep(1.0, 0.55, vUv.x);
        float pulse = 0.75 + 0.25 * sin(uTime * 0.35 + uSeed * 12.0);
        gl_FragColor = vec4(0.75, 0.93, 1.0, vertical * horizontal * pulse * 0.22 * uFade);
      }
    `,
  });

export const GodRays = () => {
  const group = useRef();
  const rays = useMemo(() => {
    const list = [];
    for (let i = 0; i < 9; i++) {
      list.push({
        x: -26 + i * 6.2 + (i % 3) * 1.4,
        z: -14 + (i % 4) * 3.5,
        width: 2.2 + (i % 3) * 1.6,
        tilt: -0.28 + (i % 5) * 0.12,
        seed: i / 9,
        material: rayMaterialFactory(),
      });
    }
    return list;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const fade = THREE.MathUtils.clamp(1 - scroll.progress * 2.4, 0, 1);
    rays.forEach((ray) => {
      ray.material.uniforms.uTime.value = t;
      ray.material.uniforms.uFade.value = fade;
      ray.material.uniforms.uSeed.value = ray.seed;
    });
    if (group.current) {
      group.current.children.forEach((child, i) => {
        child.rotation.z = rays[i].tilt + Math.sin(t * 0.13 + i * 2.1) * 0.03;
      });
    }
  });

  return (
    <group ref={group}>
      {rays.map((ray, i) => (
        <mesh key={i} position={[ray.x, -9, ray.z]} rotation-z={ray.tilt} material={ray.material}>
          <planeGeometry args={[ray.width, 42]} />
        </mesh>
      ))}
    </group>
  );
};

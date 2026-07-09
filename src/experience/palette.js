import * as THREE from "three";

const stops = [
  [0.0, new THREE.Color("#63bfe4")],
  [0.16, new THREE.Color("#3d9ac6")],
  [0.36, new THREE.Color("#206d99")],
  [0.56, new THREE.Color("#114a75")],
  [0.76, new THREE.Color("#082c50")],
  [0.92, new THREE.Color("#041a30")],
  [1.0, new THREE.Color("#020f1e")],
];

export const depthColor = (progress, out) => {
  const p = Math.min(Math.max(progress, 0), 1);
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i][0]) {
      const [p0, c0] = stops[i - 1];
      const [p1, c1] = stops[i];
      return out.copy(c0).lerp(c1, (p - p0) / (p1 - p0));
    }
  }
  return out.copy(stops[stops.length - 1][1]);
};

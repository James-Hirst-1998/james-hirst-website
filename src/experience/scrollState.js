// Shared mutable state written by DOM listeners and read inside useFrame,
// so scroll/pointer never trigger React re-renders.
export const scroll = { progress: 0 };
export const pointer = { x: 0, y: 0 };

// On phones the view is steered by touch swipes and/or the gyroscope instead
// of the mouse. Both write to this shared look target — yaw/pitch in radians,
// relative to the scene's forward so the dive always starts facing ahead.
export const look = { active: false, yaw: 0, pitch: 0 };

if (import.meta.env.DEV && typeof window !== "undefined") {
  window.__dive = { scroll, pointer, look };
}

// World-space: the camera travels from y=0 (surface) to y=-CAMERA_TRAVEL (seabed).
export const CAMERA_TRAVEL = 100;

export const depthToWorldY = (progress) => -progress * CAMERA_TRAVEL;

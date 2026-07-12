// The dive log: which creatures the visitor has actually seen swim past in
// the dive. Sightings persist in localStorage; the badge on the dive page and
// the locked silhouettes in /creatures both read from here.
//
// Three parts:
// - DIVE_CREATURE_IDS: the gallery ids that swim in the dive - the log's
//   denominator, and the set /creatures locks behind a sighting.
// - the spot-target registry: scene wrappers register their moving group so
//   SpotTracker (OceanCanvas.jsx) can test what's actually framed on screen.
// - the spotted set + subscribe, consumed from React via useSyncExternalStore.

import { useEffect } from "react";
import { track } from "../analytics";

export const DIVE_CREATURE_IDS = [
  "dolphin",
  "turtle",
  "sunfish",
  "swordfish",
  "hammerhead",
  "shark",
  "orca",
  "manta",
  "whale",
  "jellyfish",
  "spermwhale",
  "giantsquid",
  "anglerfish",
  "gulpereel",
  "dumbo",
  "crab",
];

const STORAGE_KEY = "divelog.spotted";

const load = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw)
      ? raw.filter((id) => DIVE_CREATURE_IDS.includes(id))
      : [];
  } catch {
    return [];
  }
};

const spotted = new Set(typeof window === "undefined" ? [] : load());
let version = spotted.size; // useSyncExternalStore snapshot - bumped per spot
const listeners = new Set();

export const subscribeSpotted = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getSpotVersion = () => version;
export const getSpottedCount = () => spotted.size;
export const isSpotted = (id) => spotted.has(id);

export const markSpotted = (id) => {
  if (spotted.has(id) || !DIVE_CREATURE_IDS.includes(id)) return;
  spotted.add(id);
  version += 1;
  // Called from inside useFrame - push the storage write, the analytics
  // capture and the React re-renders off the frame so the sighting never
  // costs a visible hitch mid-scroll.
  setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...spotted]));
    } catch {
      // Private browsing etc. - the log just won't survive a reload.
    }
    track("creature_spotted", {
      id,
      count: spotted.size,
      total: DIVE_CREATURE_IDS.length,
    });
    listeners.forEach((fn) => fn());
  }, 0);
};

// The gallery only locks creatures when unlocking is actually possible: no
// WebGL or reduced motion means no 3D dive, so nothing would ever be
// spottable and everything stays open.
export const diveLogAvailable = () => {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

// --- Spot targets: the moving scene objects that count as "seeing" one ---
// Pods and blooms register each member under the same id, so framing any one
// dolphin spots "dolphin".

const targets = [];
export const getSpotTargets = () => targets;

export const registerSpotTarget = (id, object) => {
  const entry = { id, object };
  targets.push(entry);
  return () => {
    const i = targets.indexOf(entry);
    if (i !== -1) targets.splice(i, 1);
  };
};

// Convenience for scene wrappers: register `ref.current` for its lifetime.
export const useSpotTarget = (id, ref) => {
  useEffect(() => {
    if (!id || !ref.current) return undefined;
    return registerSpotTarget(id, ref.current);
  }, [id, ref]);
};

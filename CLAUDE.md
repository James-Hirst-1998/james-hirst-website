# CLAUDE.md

James Hirst's personal site: a scroll-driven 3D underwater "dive" built with React + Three.js.

## Stack
- Vite + React 18, `react-router-dom` for routing, `@react-three/fiber` (R3F) + `three` for 3D.
- `npm run dev` to develop (port 3000), `npm run build` to build, `npm run preview` to serve the build.

## Layout
- `src/pages/Dive.jsx` — the home dive page (hero, scroll sections, mobile look-around handlers).
- `src/pages/Creatures.jsx` — the `/creatures` gallery: the `CREATURES` data array + the drag-to-rotate viewer.
- `src/experience/Creatures.jsx` — all the 3D creature geometry/components (large file).
- `src/experience/OceanCanvas.jsx` — the dive scene: camera rig, environment, and where creatures are placed to swim.
- `src/experience/scrollState.js` — shared mutable `scroll` / `pointer` / `look` state, written by DOM listeners and read in `useFrame` (never React state, to avoid re-renders).
- `src/styles/` — global + per-page CSS.

## How creatures are made
- Each creature is authored twice: a `XxxModel` (sits at the origin, faces +z, only idle motion) and a scene wrapper (carries it along an orbit in the dive).
- Models are hand-built from Three.js primitives with a `useFrame` idle animation; `SharkModel` in `src/experience/Creatures.jsx` is the reference example.
- Gallery catalog lives in the `CREATURES` array in `src/pages/Creatures.jsx` — each entry: `{ id, emoji, name, latin, zone, Model, distance, tagline, facts[], category?, offset? }`.
- `category: "shark"` routes an entry into the "🦈 Sharks" filter tab; `offset` recentres a model so it spins about its middle.
- To add a creature: add a `XxxModel` in `src/experience/Creatures.jsx`, import it + add a `CREATURES` entry in `src/pages/Creatures.jsx`, and optionally place its scene wrapper in `Scene` in `OceanCanvas.jsx` to have it swim in the dive.

## Interaction model
- Dive look-around: desktop steers by cursor position (`pointer`), mobile by touch swipes + gyroscope — both write to `look` and the camera follows in `CameraRig` (`OceanCanvas.jsx`).
- Creature viewer: pointer events (mouse + touch) drag to rotate; idle auto-spin when not dragging (`CreatureStage` / `Turntable`).

## Web + mobile gotchas
- `touch-action: none` is required on any element a touch-drag starts on (including the R3F `<canvas>`, not just its wrapper) or the browser eats the gesture as a scroll on mobile.
- Don't trust pointer events for touch drags — real devices cancel the stream mid-drag; use native touch listeners (`addEventListener`, `{ passive: false }` + `preventDefault`) and skip `pointerType === "touch"` in the pointer handlers.
- React's synthetic `onTouchMove` is registered passive — `preventDefault` inside it does nothing; native listeners only.
- Gyroscope input must be applied as per-event deltas, never absolute values, or it stomps whatever a swipe set and the view rubber-bands; pause gyro while a finger is down.
- Touch/gyro already move smoothly — apply their values to the camera directly; extra `useFrame` easing on top just adds visible lag.
- Mobile touch listeners on the dive are `{ passive: true }` so vertical swipes still scroll/dive the page (the creature stage is the exception — it never scrolls).

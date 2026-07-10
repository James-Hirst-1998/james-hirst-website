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
- Dive look-around: desktop steers by cursor position (`pointer`), mobile by moving the phone (gyroscope only — swipes are left to page scroll); both write to `look` and the camera follows in `CameraRig` (`OceanCanvas.jsx`).
- Creature viewer: mouse drags via pointer events, mobile drags via native touch listeners; idle auto-spin when not dragging (`CreatureStage` / `Turntable`).

## Web + mobile gotchas
- `touch-action: none` is required on any element a touch-drag starts on (including the R3F `<canvas>`, not just its wrapper) or the browser eats the gesture as a scroll on mobile.
- Don't trust pointer events for touch drags — real devices cancel the stream mid-drag; use native touch listeners (`addEventListener`, `{ passive: false }` + `preventDefault`) and skip `pointerType === "touch"` in the pointer handlers.
- React's synthetic `onTouchMove` is registered passive — `preventDefault` inside it does nothing; native listeners only.
- Gyroscope input must be applied as per-event deltas, never absolute values (absolute overrides rubber-band the view); don't mix it with swipe steering — the two fight and the loser is whoever the user was using.
- Raw gyro readings jitter — ease the camera onto the `look` target with a very short (~70 ms) time constant; long easing (~300 ms) reads as lag, none reads as shake.
- iOS needs `DeviceOrientationEvent.requestPermission()` from a user gesture (we ask on first `touchend`); only set `look.active` once the sensor actually reports.

## Performance gotchas
- Never hide/show a light (or a group containing one) at runtime — changing the scene's light count makes three.js recompile every shader program, which freezes the page for a beat. The depth culling in `Creatures.jsx` (`cullByDepth`) exempts light-carrying creatures (`cull={false}`) and the seabed keeps its two lamps outside the culled group.
- Depth-culled objects render for the first ~1.5 s of the dive (`WARMUP_S`) so all geometry uploads to the GPU during the hero; without it each creature hitches on first un-cull mid-scroll.
- Only write to the DOM from rAF loops when the displayed value changed (see `DepthMeter`) — same-value `textContent` writes still replace the text node, forcing layout work and (before we disabled it) flooding PostHog's session recorder into periodic main-thread stalls. Keep `disable_session_recording: true` in `analytics.js`.

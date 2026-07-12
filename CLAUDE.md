# CLAUDE.md

James Hirst's personal site: a scroll-driven 3D underwater "dive" built with React + Three.js.

## Stack
- Vite + React 18, `react-router-dom` for routing, `@react-three/fiber` (R3F) + `three` for 3D.
- `npm run dev` to develop (port 3000), `npm run build` to build, `npm run preview` to serve the build.

## Layout
- `src/pages/Dive.jsx` - the home dive page (hero, scroll sections, mobile look-around handlers).
- `src/pages/Creatures.jsx` - the `/creatures` gallery: the `CREATURES` data array + the drag-to-rotate viewer.
- `src/experience/Creatures.jsx` - all the 3D creature geometry/components (large file).
- `src/experience/OceanCanvas.jsx` - the dive scene: camera rig, environment, and where creatures are placed to swim.
- `src/experience/scrollState.js` - shared mutable `scroll` / `pointer` / `look` state, written by DOM listeners and read in `useFrame` (never React state, to avoid re-renders).
- `src/styles/` - global + per-page CSS.

## How creatures are made
- Each creature is authored twice: a `XxxModel` (sits at the origin, faces +z, only idle motion) and a scene wrapper (carries it along an orbit in the dive).
- Models are hand-built from Three.js primitives with a `useFrame` idle animation; `SharkModel` in `src/experience/Creatures.jsx` is the reference example.
- Gallery catalog lives in the `CREATURES` array in `src/pages/Creatures.jsx` - each entry: `{ id, emoji, name, latin, zone, Model, distance, tagline, facts[], category?, offset? }`.
- `category: "shark"` routes an entry into the "🦈 Sharks" filter tab; `offset` recentres a model so it spins about its middle.
- To add a creature: add a `XxxModel` in `src/experience/Creatures.jsx`, import it + add a `CREATURES` entry in `src/pages/Creatures.jsx`, and optionally place its scene wrapper in `Scene` in `OceanCanvas.jsx` to have it swim in the dive.

## The dive log
- Creatures that swim in the dive are locked in `/creatures` (dark silhouette + "???") until spotted mid-dive; sightings persist in localStorage and fill the ring badge in the dive's top-right corner (`DiveLogBadge` in `Dive.jsx`). All state lives in `src/experience/diveLog.js`.
- A sighting = the creature's whole bounding box inside the middle 85% of the viewport, within 48 world units, held for ~0.75 s (`SpotTracker` in `OceanCanvas.jsx`). Pods/blooms register each member under one id, so framing any one dolphin spots "dolphin".
- When adding a dive-swimming creature: pass `spotId="<gallery id>"` to its `Orbiter`/`Drifter` (or call `useSpotTarget(id, ref)` in a custom wrapper) AND add the id to `DIVE_CREATURE_IDS` in `diveLog.js` - the badge total and the gallery locks both derive from that list. Gallery-only creatures need nothing and show as "Gallery exclusive".
- `markSpotted` is called from inside `useFrame`, so its side effects (localStorage, analytics, listener re-renders) are deferred via `setTimeout` - keep it that way or spotting hitches mid-scroll.

## Interaction model
- Dive look-around: desktop steers by cursor position (`pointer`), mobile by moving the phone (gyroscope only - swipes are left to page scroll); both write to `look` and the camera follows in `CameraRig` (`OceanCanvas.jsx`).
- Creature viewer: mouse drags via pointer events, mobile drags via native touch listeners; idle auto-spin when not dragging (`CreatureStage` / `Turntable`).

## Web + mobile gotchas
- `touch-action: none` is required on any element a touch-drag starts on (including the R3F `<canvas>`, not just its wrapper) or the browser eats the gesture as a scroll on mobile.
- Don't trust pointer events for touch drags - real devices cancel the stream mid-drag; use native touch listeners (`addEventListener`, `{ passive: false }` + `preventDefault`) and skip `pointerType === "touch"` in the pointer handlers.
- React's synthetic `onTouchMove` is registered passive - `preventDefault` inside it does nothing; native listeners only.
- Gyroscope input must be applied as per-event deltas, never absolute values (absolute overrides rubber-band the view); don't mix it with swipe steering - the two fight and the loser is whoever the user was using.
- Never read yaw/pitch from raw `alpha`/`beta` - upright portrait is the Euler gimbal lock, where alpha/gamma trade sudden 180° flips (erratic yaw, looking up "fights back"). Build the device rotation `Rz(α)·Rx(β)·Ry(γ)`, take the forward vector, and derive yaw/pitch from that (continuous through the flips, screen-orientation-proof).
- iOS parks `deviceorientation` events for the duration of a scroll (finger-down and momentum). On resume, re-baseline when the inter-event gap exceeds ~200 ms instead of applying the accumulated delta - otherwise the view snaps the moment a free scroll ends. Looking around *during* a momentum scroll is not fixable in JS; make the resume seamless instead.
- Raw gyro readings jitter - ease the camera onto the `look` target with a very short (~70 ms) time constant; long easing (~300 ms) reads as lag, none reads as shake.
- iOS needs `DeviceOrientationEvent.requestPermission()` from a real tap - a scroll swipe's `touchend` rejects it, so never spend the one-and-only ask on the first `touchend`. We ask from the top-of-screen hint button or any non-swipe tap (< 12 px of travel) and keep retrying until the dialog actually answers; only set `look.active` once the sensor actually reports.
- iOS also fires pointer events for touches - the dive's `pointermove` handler must skip `pointerType === "touch"`, or a swipe ending near a screen edge parks `pointer.x` past the yaw deadzone and the desktop steering path spins the camera indefinitely.

## Performance gotchas
- Never hide/show a light (or a group containing one) at runtime - changing the scene's light count makes three.js recompile every shader program, which freezes the page for a beat. The depth culling in `Creatures.jsx` (`cullByDepth`) exempts light-carrying creatures (`cull={false}`) and the seabed keeps its two lamps outside the culled group.
- Depth-culled objects render for the first ~1.5 s of the dive (`WARMUP_S`) so all geometry uploads to the GPU during the hero; without it each creature hitches on first un-cull mid-scroll.
- Only write to the DOM from rAF loops when the displayed value changed (see `DepthMeter`) - same-value `textContent` writes still replace the text node, forcing layout work and (before we disabled it) flooding PostHog's session recorder into periodic main-thread stalls. Keep `disable_session_recording: true` in `analytics.js`.

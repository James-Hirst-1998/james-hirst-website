# James Hirst — personal website

An interactive CV you scroll through like a dive: the page descends from the sunlit
surface to the seabed at -200m, with each depth revealing a chapter (Mozaic Earth,
Microsoft, Cambridge research, the Shark Trust, education, skills). The ocean is a
real-time 3D scene — procedural fish schools, a cruising shark, jellyfish, god rays
and a kelp-covered seabed — rendered with three.js behind glass content panels.

## Stack

- [Vite](https://vitejs.dev/) + React 18
- [three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- All 3D is procedural (no modelled assets); the scene is driven by scroll progress

## Develop

```bash
npm install
npm run dev      # dev server on http://localhost:3000
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

## Structure

- `src/data/cv.js` — all CV content lives here; edit this to update the site
- `src/experience/` — the 3D ocean (camera rig, creatures, seabed, ambience)
- `src/pages/Dive.jsx` — page layout, glass panels, depth meter, section nav
- `src/pages/BowlOfFish.jsx` — the Bowl of Fish game (find it on the seabed)

Users with `prefers-reduced-motion` or no WebGL get a static gradient fallback;
all content stays fully readable without the 3D scene.

## Deployment

Hosted on [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/overview).
Merging to `main` triggers the workflow in `.github/workflows/`, which builds the
site and serves `dist/`. No manual steps required.

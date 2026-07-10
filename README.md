# James Hirst — personal website

An interactive CV you scroll through like a dive: the page descends from the sunlit
surface to Challenger Deep at -10,935m, with each depth revealing a chapter (Mozaic
Earth, Microsoft, Cambridge research, the Shark Trust, education, skills). The ocean
is a real-time 3D scene — procedural fish schools, a cruising shark, jellyfish, a
distant whale, an anglerfish in the abyss and a kelp-covered seabed — rendered with
three.js behind glass content panels, with submersible-style mouse look-around.

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

Hosted on [Vercel](https://vercel.com/), connected to this GitHub repo. Pushing to
`Main` auto-deploys to production; every pull request gets its own preview URL. Vercel
auto-detects the Vite preset (`npm run build` → `dist/`), so no manual steps are needed.

`vercel.json` rewrites all paths to `/index.html` so client-side routes (`react-router`
`BrowserRouter`, e.g. `/creatures`) resolve on direct load and refresh.

### Domain

`jamesjhirst.com` is registered and its DNS is managed at **Squarespace** (a former
Google Domains registration, so its zone still runs on Google's nameservers —
`ns-cloud-*.googledomains.com`. Vercel refers to this as "Google Cloud DNS", but it's
edited from the Squarespace DNS panel). Two records point it at Vercel:

| Type  | Name  | Value                                  |
| ----- | ----- | -------------------------------------- |
| A     | `@`   | `76.76.21.21`                          |
| CNAME | `www` | `316a946600c09e33.vercel-dns-017.com`  |

`www.jamesjhirst.com` is the canonical domain; the apex `jamesjhirst.com` 308-redirects
to `www` (configured in Vercel → Settings → Domains).

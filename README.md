# Genesis

An interactive React experience built with Three.js, Framer Motion, GSAP, Lenis, and an adaptive 3D asset pipeline.

## Project structure

```mermaid
flowchart TD
    Entry["index.js"] --> App["app: providers and router"]
    App --> Pages["pages: route composition"]
    Pages --> Widgets["widgets: shared page chrome"]
    Pages --> Features["features: product experiences"]
    Widgets --> Shared["shared: UI, hooks, data, styles"]
    Features --> Shared
    Features --> Infra["infrastructure: performance and 3D quality"]
```

Source code lives in `frontend/src`. Routes are `/`, `/gallery`, and `/events`.

## Start locally

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`.

## Commands

```bash
npm start                 # development server
npm test                  # test runner
npm run build             # production build
npm run optimize:models   # generate adaptive GLB tiers
npm run optimize:models:ktx2
```

## Documentation

Start with [`docs/README.md`](docs/README.md). It links to architecture, contribution workflow, code standards, performance rules, and UI/animation/3D practices.

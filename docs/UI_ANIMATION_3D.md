# UI, animation, and 3D guidelines

## UI implementation

Build from the smallest supported viewport upward.

For every interface:

- preserve readable contrast over animated backgrounds;
- use minimum comfortable touch targets (about 44px);
- test long labels and narrow screens;
- avoid hover-only information;
- keep focus states visible;
- prevent layout shifts during media loading;
- use `100dvh` and safe-area insets for full-screen mobile experiences;
- verify overlays have an opaque or sufficiently contrasted surface.

Use the existing typography, color, spacing, border, and surface tokens before adding new values. New tokens belong in global styles and should solve a repeated need.

## Animation policy

Animation must clarify hierarchy, state, or spatial continuity. Remove movement that does not serve the experience.

Preferred properties:

- `transform`;
- `opacity`.

Avoid animating layout-heavy properties continuously. Coordinate one interaction with one animation owner—do not mix CSS, Framer Motion, and GSAP on the same property.

### Framer Motion

Use for component transitions, gestures, and declarative scroll transforms. Global `MotionConfig reducedMotion="user"` must remain active.

### GSAP

Use for complex timelines, pinning, or tightly controlled scroll choreography. Scope triggers, kill them on cleanup, and pause ticker work when hidden.

### Lenis

Use only where smooth scrolling materially improves the experience. Native mobile scrolling remains the default. Never create multiple competing Lenis instances for the same page.

### Canvas/WebGL loops

Use `createPlayGate`, cancel RAF on teardown, reset timing after resume, and avoid React renders per frame.

## Reduced motion

Reduced motion is a supported experience, not an afterthought:

- remove non-essential parallax and inertia;
- replace continuous animation with a static frame;
- preserve content, navigation, and hierarchy;
- do not hide important information with the effect.

## Three.js and 3D models

### Asset workflow

Place the high-fidelity source in `frontend/public/model/` using the source priority documented by the optimizer. Generate delivery tiers from `frontend/`:

```bash
npm run optimize:models
npm run optimize:models:ktx2
```

Expected adaptive outputs:

- `Hero-Ultra`;
- `Hero-High`;
- `Hero-Medium`;
- `Hero-Low`;
- KTX2 variants when enabled.

Do not hand-edit generated tiers. Change the source or optimizer recipe and regenerate all tiers consistently. Do not commit private backups or oversized source files unless the repository explicitly tracks them.

### Scene rules

- Use the adaptive loader and quality manager.
- Keep lighting cinematic but bounded; more lights increase fragment cost.
- Reuse geometry and materials where possible.
- Enable frustum culling.
- Avoid real-time shadows on low/medium tiers.
- Cap DPR according to the quality preset.
- Keep post-processing disabled unless measured and budgeted.
- Use Draco/KTX2-capable loaders and provide a reliable fallback.
- The hero model currently mounts only at `min-width: 768px`; do not reintroduce mobile hero WebGL without a measured budget and fallback.

### Cleanup

When replacing or unmounting a scene, dispose:

- geometries;
- materials;
- textures and environment maps;
- render targets;
- loaders/decoders where applicable;
- the renderer and animation loop.

### Visual QA

Test models across:

- low and high quality tiers;
- mobile portrait and desktop ultrawide;
- slow network;
- WebGL capability failure;
- route enter/leave cycles;
- reduced motion;
- bright and dark display conditions.

The page's copy and navigation must remain usable if 3D loading fails.

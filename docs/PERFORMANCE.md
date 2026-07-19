# Performance and optimization

Performance is a feature. Optimize for consistent interaction and frame time, not only a high desktop benchmark.

## Runtime rules

- Pause continuous work when its element is offscreen or the document is hidden.
- Use `createPlayGate` for imperative RAF/WebGL loops.
- Respect `prefers-reduced-motion` and Save-Data.
- Cap device pixel ratio; do not render at unrestricted DPR.
- Avoid React state updates inside frame loops unless the visible value changed.
- Throttle resize, scroll, pointer, and canvas-redraw work to animation frames.
- Prefer passive scroll listeners when cancellation is unnecessary.
- Dispose all Three.js resources and cancel all scheduled work on unmount.

## Loading rules

- Keep route pages lazy-loaded.
- Lazy-load below-the-fold images and use `decoding="async"`.
- Give layout-critical media stable dimensions or aspect ratios.
- Do not eagerly load desktop-only media on mobile.
- Reuse decoded assets and atlases instead of loading duplicate sources.
- Review every new dependency for bundle and runtime cost.

## Adaptive quality

The source of truth is:

`frontend/src/infrastructure/performance/config/quality.config.js`

The quality manager considers GPU, device, network, display, browser, user preferences, and runtime FPS. New 3D or canvas features should integrate with this system rather than inventing separate device detection.

Current principles:

- mobile is capped below desktop quality;
- Save-Data and weak networks impose hard caps;
- reduced motion and battery constraints lower the budget;
- FPS hysteresis prevents rapid quality oscillation;
- renderer DPR, shadows, anisotropy, and asset tier follow the chosen preset.

## Frame-budget checklist

For continuous animation:

- target 60 FPS on capable devices;
- preserve a usable 30+ FPS fallback;
- avoid per-frame object/array allocation in hot loops;
- cache geometry, gradients, and repeated calculations;
- keep DOM reads separate from DOM writes;
- avoid sorting large collections every frame;
- stop rendering when the scene is visually unchanged.

## Image checklist

- request an appropriate source size;
- use modern formats where available;
- include `srcSet`/`sizes` for responsive raster content;
- never ship a full-resolution source where a thumbnail is displayed;
- use eager loading only for above-the-fold/LCP media.

## Verification

Before merging performance-sensitive work:

```bash
cd frontend
npm run build
```

Then inspect:

1. production bundle output;
2. Chrome Performance recording during the interaction;
3. Network with cache disabled and mobile throttling;
4. mobile viewport and a high-DPR viewport;
5. hidden-tab and offscreen behavior;
6. reduced-motion and Save-Data behavior;
7. memory after entering/leaving the route repeatedly.

Use `?perfDebug=1` or local storage key `dezhub:perfDebug=1` when performance debug output is required.

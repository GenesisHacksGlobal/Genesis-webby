# Release checklist

## Code

- [ ] Change follows architecture boundaries.
- [ ] Effects, listeners, observers, timers, RAF loops, and GPU resources clean up.
- [ ] No secrets, local paths, debug logs, generated build output, or backup assets are committed.
- [ ] New dependencies and assets are justified.

## Functional

- [ ] `/`, `/gallery`, and `/events` load directly and through navigation.
- [ ] Hash navigation works.
- [ ] Loading, empty, and failure states are usable.
- [ ] Browser back/forward behavior is correct.

## Responsive and accessibility

- [ ] Mobile portrait, mobile landscape, tablet, desktop, and ultrawide tested.
- [ ] Keyboard navigation and visible focus tested.
- [ ] Touch targets and overlay contrast tested.
- [ ] Reduced-motion experience tested.
- [ ] Content remains usable without hover.
- [ ] Images have correct alt behavior.

## Performance

- [ ] `npm run build` succeeds.
- [ ] No unexpected initial bundle increase.
- [ ] Below-the-fold media is lazy-loaded.
- [ ] Continuous animations pause offscreen and in hidden tabs.
- [ ] DPR and quality tiers are bounded.
- [ ] No obvious memory growth after repeated route navigation.
- [ ] Slow network and lower-powered mobile behavior checked.

## Visual

- [ ] Typography and spacing use existing tokens.
- [ ] No content clipping or horizontal overflow.
- [ ] 3D/canvas effects do not obscure essential text.
- [ ] Screenshots or recordings are attached to the pull request.

## Commands

```bash
cd frontend
npm test
npm run build
```

For model changes:

```bash
npm run optimize:models
npm run optimize:models:ktx2
```

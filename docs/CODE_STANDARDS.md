# Clean code policy

## Design goals

Code should be easy to locate, safe to change, and inexpensive to run. Prefer explicit ownership and small public APIs over clever abstractions.

## Components

- Keep route composition in `pages`, domain behavior in `features`, and generic primitives in `shared`.
- A component should have one primary responsibility.
- Extract a component when it has independent behavior, meaningful reuse, or a clear testing boundary—not merely to shorten a file.
- Keep state as close as possible to where it is consumed.
- Derive values during render instead of duplicating them in state.
- Use semantic HTML first; add ARIA only when native semantics are insufficient.
- Use buttons for actions and links for navigation.

## Hooks and effects

Effects synchronize with external systems; they are not a substitute for derived state.

Every effect that creates work must clean it up:

- event listeners;
- `requestAnimationFrame`;
- timers;
- observers;
- Lenis/GSAP instances;
- Three.js textures, geometry, materials, renderers, and loaders.

Respect hook dependency warnings. Stabilize objects with `useMemo` or callbacks with `useCallback` only when identity matters.

## Naming

- React components: `PascalCase`.
- Hooks: `useSomething`.
- Functions and variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- Feature folders: lowercase kebab-case.
- Prefer domain names over visual names: `EventCard` instead of `PurpleBox`.

## Imports

- Follow the layer aliases documented in `ARCHITECTURE.md`.
- Import from a feature/widget barrel when consuming its public API.
- Avoid circular dependencies and broad catch-all barrels.
- Do not import page code into features, widgets, or shared modules.

## Styling

- Reuse tokens from `shared/styles/globals.css`.
- Build mobile-first; add complexity at larger breakpoints.
- Avoid unexplained magic numbers. Name repeated layout or rendering constants.
- Prefer transform and opacity for animation.
- Keep `backdrop-filter`, large blur, fixed blend layers, and heavy shadows limited.
- Account for safe areas and dynamic viewport units on mobile.

## Data and configuration

- Shared content belongs in `shared/data`.
- Rendering budgets and adaptive thresholds belong in the performance config, not scattered through components.
- Do not duplicate URLs, quality cutoffs, or device rules.

## Error and fallback behavior

- Lazy routes need a loading state.
- Remote images need useful alt text or an empty alt for decoration.
- Expensive visual effects need a static/reduced fallback.
- A failed 3D asset must not make navigation or page content unusable.

## Definition of done

A change is done when it is understandable without author context, passes the production build, handles cleanup, works responsively, respects accessibility preferences, and does not introduce avoidable runtime or asset cost.

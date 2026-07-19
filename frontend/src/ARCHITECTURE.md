# Frontend architecture

Layered studio layout. Import downward only.

```
app/            → shell: providers, router
pages/          → route screens (home, gallery, events)
widgets/        → cross-page chrome (layout)
features/       → domain UI (hero, about, gallery, …)
shared/         → ui, hooks, lib, data, styles, constants
infrastructure/ → performance / device quality stack
```

## Aliases

| Alias | Path |
|-------|------|
| `@` | `src/` |
| `@app` | `src/app/` |
| `@pages` | `src/pages/` |
| `@widgets` | `src/widgets/` |
| `@features` | `src/features/` |
| `@shared` | `src/shared/` |
| `@infra` | `src/infrastructure/` |

## Rules

- `pages` may import widgets, features, shared
- `widgets` / `features` may import shared, infrastructure
- `shared` must not import features or widgets
- Prefer named barrels (`index.js`) per feature; avoid deep cross-feature imports

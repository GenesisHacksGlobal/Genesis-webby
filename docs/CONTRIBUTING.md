# Contributing

## Local setup

```bash
cd frontend
npm install
npm start
```

Useful routes:

- `/` — landing experience;
- `/gallery` — infinite WebGL gallery;
- `/events` — event experience.

Before opening a pull request:

```bash
npm run build
npm test
```

## Workflow

1. Sync the target branch.
2. Create a focused branch: `feat/gallery-filters`, `fix/mobile-nav`, or `perf/hero-loader`.
3. Read the relevant docs before coding.
4. Keep the change narrow; avoid unrelated cleanup.
5. Verify desktop, mobile, keyboard, reduced motion, and slow-device behavior.
6. Run the production build.
7. Review the diff for generated files, secrets, debug logs, and accidental assets.
8. Open a pull request with summary, screenshots/video for visual work, and a test plan.

## Commit practice

Use Conventional Commit-style subjects:

```text
feat: add event category filtering
fix: prevent gallery drag from blocking mobile navigation
perf: pause hero rendering outside the viewport
refactor: isolate route providers from page composition
docs: document adaptive model workflow
```

Rules:

- keep the subject imperative and under roughly 72 characters;
- one logical concern per commit;
- explain the reason and user impact in the body for non-trivial work;
- do not commit `build/`, caches, debug captures, local environment files, or source backups;
- do not mix formatting-only edits with behavioral changes;
- never skip failing hooks or checks to force a commit through.

## Pull request template

```markdown
## Summary
- What changed
- Why it changed

## Visual impact
- Screenshots or video
- Viewports tested

## Performance impact
- New assets/dependencies
- Rendering or bundle implications

## Test plan
- [ ] Production build
- [ ] Desktop
- [ ] Mobile
- [ ] Keyboard
- [ ] Reduced motion
```

## Review expectations

Reviewers should check architecture boundaries, accessibility, cleanup, responsive behavior, performance budgets, visual consistency, and failure/fallback states—not only the happy path.

# Offline model sources (NOT publicly served)

These files are inputs for `npm run optimize:models` / `optimize:models:ktx2`.

They live **outside** `public/` so CRA/Vercel will never expose them at
`/model/...`.

Runtime ships only:

- `public/model/Hero-{Ultra,High,Medium,Low}.glb`
- `public/model/Hero-{Ultra,High,Medium,Low}-KTX2.glb`

Do not move backups (`.bak`) or raw sources back into `public/model/`.

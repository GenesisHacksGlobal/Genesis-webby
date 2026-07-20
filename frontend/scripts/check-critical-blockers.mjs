#!/usr/bin/env node
/**
 * Smoke checks for production audit critical blockers.
 * Covers #1 404, #2 encoding, #4 ErrorBoundary, #5 router pin,
 * #6 security headers, #7 no leaked public models.
 *
 * Run: npm run check:critical
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPO = path.join(ROOT, "..");
const src = (...parts) => path.join(ROOT, "src", ...parts);

function mustExist(file, label) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${label}: ${path.relative(ROOT, file)}`);
  }
}

function mustInclude(file, needle, label) {
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes(needle)) {
    throw new Error(
      `${label} — expected to find ${JSON.stringify(needle)} in ${path.relative(ROOT, file)}`,
    );
  }
}

function mustNotExist(file, label) {
  if (fs.existsSync(file)) {
    throw new Error(`${label} still present: ${path.relative(ROOT, file)}`);
  }
}

const failures = [];

try {
  // #1 — 404 catch-all
  mustExist(src("pages", "not-found", "NotFoundPage.jsx"), "NotFoundPage");
  mustInclude(src("app", "router", "AppRouter.jsx"), 'path="*"', "Catch-all route");
  mustInclude(
    src("app", "router", "AppRouter.jsx"),
    "NotFoundPage",
    "NotFoundPage wired in router",
  );

  // #4 — ErrorBoundary layers
  mustExist(src("shared", "ui", "ErrorBoundary.jsx"), "ErrorBoundary");
  mustInclude(
    src("shared", "ui", "ErrorBoundary.jsx"),
    "getDerivedStateFromError",
    "ErrorBoundary API",
  );
  mustInclude(
    src("app", "providers", "AppProviders.jsx"),
    "ErrorBoundary",
    "App-level ErrorBoundary",
  );
  mustInclude(src("app", "router", "AppRouter.jsx"), "PageBoundary", "Per-route ErrorBoundary");
  mustInclude(src("features", "hero", "Hero.jsx"), "ErrorBoundary", "Hero canvas ErrorBoundary");
  mustInclude(
    src("features", "hero", "HeroCanvas.jsx"),
    "webglFailed",
    "HeroCanvas WebGL fallback state",
  );

  // #5 — patched react-router-dom
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const rrd = pkg.dependencies?.["react-router-dom"] || "";
  const match = String(rrd).match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) throw new Error(`react-router-dom version unreadable: ${rrd}`);
  const [maj, min] = [Number(match[1]), Number(match[2])];
  if (maj < 7 || (maj === 7 && min < 18)) {
    throw new Error(
      `react-router-dom must be >= 7.18.0 for CVE fixes (found ${rrd})`,
    );
  }

  // #6 — security headers
  const vercelPath = path.join(REPO, "vercel.json");
  mustExist(vercelPath, "vercel.json");
  const vercel = fs.readFileSync(vercelPath, "utf8");
  for (const header of [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
  ]) {
    mustInclude(vercelPath, header, `Security header ${header}`);
  }
  if (!vercel.includes("/index.html")) {
    throw new Error('vercel.json SPA rewrite should destination "/index.html"');
  }

  // #7 — no leaked/dead sources in public/model
  const publicModel = path.join(ROOT, "public", "model");
  const banned = [
    "genesis-original.bak",
    "genesis-model.glb",
    "genesis-compressed.glb",
    "genesis",
  ];
  for (const name of banned) {
    mustNotExist(path.join(publicModel, name), `Leaked public model ${name}`);
  }
  const requiredHero = [
    "Hero-Low.glb",
    "Hero-Medium.glb",
    "Hero-High.glb",
    "Hero-Ultra.glb",
    "Hero-Low-KTX2.glb",
    "Hero-Medium-KTX2.glb",
    "Hero-High-KTX2.glb",
    "Hero-Ultra-KTX2.glb",
  ];
  for (const name of requiredHero) {
    mustExist(path.join(publicModel, name), `Required runtime model ${name}`);
  }
  mustInclude(
    src("infrastructure", "performance", "config", "quality.config.js"),
    'fallback: "/model/Hero-Low.glb"',
    "ASSET_PATHS fallback points at Hero-Low",
  );

  // #2 — encoding (delegate)
  const enc = spawnSync(
    process.execPath,
    [path.join(__dirname, "check-encoding.mjs")],
    { cwd: ROOT, encoding: "utf8" },
  );
  if (enc.status !== 0) {
    failures.push((enc.stdout || "") + (enc.stderr || "") || "Encoding check failed");
  }
} catch (err) {
  failures.push(err.message);
}

if (failures.length) {
  console.error("Critical blocker smoke check FAILED:\n");
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

console.log(
  "Critical blocker smoke check passed (#1 404, #2 encoding, #4 ErrorBoundary, #5 router, #6 headers, #7 models).",
);

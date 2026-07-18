/**
 * Production asset pipeline — generates Hero-{Ultra,High,Medium,Low}.glb
 *
 * Usage (from frontend/):
 *   node scripts/optimize-hero-models.mjs
 *   node scripts/optimize-hero-models.mjs --ktx2   # also emit *-KTX2.glb
 *
 * Requires: npx @gltf-transform/cli (downloaded on demand)
 *
 * Source priority:
 *   1) public/model/genesis-original.bak  (highest fidelity)
 *   2) public/model/genesis-compressed.glb
 */

import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const modelDir = path.join(root, "public", "model");

const sourceCandidates = [
  path.join(modelDir, "genesis-original.bak"),
  path.join(modelDir, "genesis-compressed.glb"),
  path.join(modelDir, "genesis"),
];

const source = sourceCandidates.find((p) => existsSync(p));
if (!source) {
  console.error("No source GLB found in public/model/");
  process.exit(1);
}

mkdirSync(modelDir, { recursive: true });

const withKtx2 = process.argv.includes("--ktx2");
const CLI = ["--yes", "@gltf-transform/cli@4.1.2"];

function run(args) {
  // Quote paths that may contain spaces (Windows usernames).
  const quoted = args.map((arg) =>
    /[\s]/.test(arg) && !arg.startsWith("--") ? `"${arg}"` : arg,
  );
  console.log(`\n> npx ${CLI.join(" ")} ${quoted.join(" ")}`);
  const result = spawnSync("npx", [...CLI, ...quoted], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error(`gltf-transform failed: ${quoted.join(" ")}`);
  }
}

function mb(filePath) {
  return (statSync(filePath).size / (1024 * 1024)).toFixed(2);
}

/**
 * Tier recipes — mesh ratio + texture resize + Draco bitrate.
 * Ultra keeps closest to source; Low is aggressive mobile.
 */
const tiers = [
  {
    name: "Hero-Ultra.glb",
    // Near-source: light Draco only, keep large textures
    steps: (input, output) => {
      run([
        "optimize",
        input,
        output,
        "--compress=draco",
        "--texture-compress=webp",
        "--texture-size=2048",
        "--simplify=false",
      ]);
    },
  },
  {
    name: "Hero-High.glb",
    steps: (input, output) => {
      run([
        "optimize",
        input,
        output,
        "--compress=draco",
        "--texture-compress=webp",
        "--texture-size=1024",
        "--simplify=true",
        "--simplify-ratio=0.75",
        "--simplify-error=0.001",
      ]);
    },
  },
  {
    name: "Hero-Medium.glb",
    steps: (input, output) => {
      run([
        "optimize",
        input,
        output,
        "--compress=draco",
        "--texture-compress=webp",
        "--texture-size=512",
        "--simplify=true",
        "--simplify-ratio=0.35",
        "--simplify-error=0.02",
      ]);
    },
  },
  {
    name: "Hero-Low.glb",
    steps: (input, output) => {
      run([
        "optimize",
        input,
        output,
        "--compress=draco",
        "--texture-compress=webp",
        "--texture-size=256",
        "--simplify=true",
        "--simplify-ratio=0.15",
        "--simplify-error=0.08",
      ]);
    },
  },
];

// Prefer relative paths so Windows shells don't split on spaces in usernames.
const sourceRel = path.relative(root, source);
console.log(`Source: ${sourceRel} (${mb(source)} MB)`);

for (const tier of tiers) {
  const out = path.join(modelDir, tier.name);
  const outRel = path.relative(root, out);
  console.log(`\n=== Building ${tier.name} ===`);
  tier.steps(sourceRel, outRel);
  console.log(`✓ ${tier.name}: ${mb(out)} MB`);
}

// Keep legacy path as Low alias — safest fallback for failed tier loads
const low = path.join(modelDir, "Hero-Low.glb");
const compressedAlias = path.join(modelDir, "genesis-compressed.glb");
if (existsSync(low)) {
  copyFileSync(low, compressedAlias);
  console.log(`\nSynced genesis-compressed.glb ← Hero-Low.glb`);
}

if (withKtx2) {
  console.log("\n=== Building KTX2 GPU-texture variants ===");
  const ktx2Tiers = [
    {
      name: "Hero-Ultra-KTX2.glb",
      flags: [
        "--compress=draco",
        "--texture-compress=ktx2",
        "--texture-size=2048",
        "--simplify=false",
      ],
    },
    {
      name: "Hero-High-KTX2.glb",
      flags: [
        "--compress=draco",
        "--texture-compress=ktx2",
        "--texture-size=1024",
        "--simplify=true",
        "--simplify-ratio=0.75",
        "--simplify-error=0.001",
      ],
    },
    {
      name: "Hero-Medium-KTX2.glb",
      flags: [
        "--compress=draco",
        "--texture-compress=ktx2",
        "--texture-size=512",
        "--simplify=true",
        "--simplify-ratio=0.35",
        "--simplify-error=0.02",
      ],
    },
    {
      name: "Hero-Low-KTX2.glb",
      flags: [
        "--compress=draco",
        "--texture-compress=ktx2",
        "--texture-size=256",
        "--simplify=true",
        "--simplify-ratio=0.15",
        "--simplify-error=0.08",
      ],
    },
  ];

  for (const tier of ktx2Tiers) {
    const outRel = path.relative(root, path.join(modelDir, tier.name));
    console.log(`\n=== Building ${tier.name} ===`);
    run(["optimize", sourceRel, outRel, ...tier.flags]);
    console.log(`✓ ${tier.name}: ${mb(path.join(modelDir, tier.name))} MB`);
  }

  console.log(
    "\nKTX2 assets ready. Set PREFER_KTX2_ASSETS = true in quality.config.js to use them.",
  );
}

console.log("\nAsset pipeline complete.");

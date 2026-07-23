/**
 * Single source of truth for adaptive quality thresholds.
 * Tune weights / cutoffs here — nowhere else.
 */

export const QUALITY_LEVELS = Object.freeze([
  "low",
  "medium",
  "high",
  "ultra",
]);

/** Ordered from lightest → heaviest for clamp / step helpers */
export const QUALITY_ORDER = QUALITY_LEVELS;

export const ASSET_PATHS = Object.freeze({
  ultra: "/model/Hero-Ultra.glb",
  high: "/model/Hero-High.glb",
  medium: "/model/Hero-Medium.glb",
  low: "/model/Hero-Low.glb",
  /** Fallback if a tier file is missing at runtime */
  fallback: "/model/Hero-Low.glb",
});

/**
 * Weighted scoring — total of weights should stay ~1.0 for readability.
 * Final score is 0–100.
 */
export const SCORE_WEIGHTS = Object.freeze({
  gpu: 0.34,
  device: 0.22,
  network: 0.2,
  display: 0.12,
  browser: 0.07,
  preference: 0.05,
});

/** Map composite score → initial quality tier */
export const SCORE_THRESHOLDS = Object.freeze({
  ultra: 78,
  high: 58,
  medium: 36,
  low: 0,
});

/** Network / Save-Data hard caps (never exceed these tiers) */
export const NETWORK_CAPS = Object.freeze({
  "slow-2g": "low",
  "2g": "low",
  "3g": "medium",
  "4g": "high",
  wifi: "ultra",
  unknown: "high",
});

export const SAVE_DATA_CAP = "medium";

/** FPS adaptive hysteresis (prevents oscillation) */
export const FPS_POLICY = Object.freeze({
  sampleWindowMs: 5000,
  rollingSamples: 120,
  downgradeBelow: 45,
  upgradeAbove: 80,
  /** Minimum time between quality changes */
  cooldownMs: 8000,
  /** Require N consecutive windows before changing */
  confirmWindows: 2,
  /** Never auto-upgrade past this until cooldown clears */
  maxAutoUpgradeSteps: 1,
});

/** Soft caps by device class */
export const DEVICE_CAPS = Object.freeze({
  mobile: "medium",
  tablet: "high",
  desktop: "ultra",
});

/** Reduced motion / battery saver caps */
export const PREFERENCE_CAPS = Object.freeze({
  reducedMotion: "medium",
  batterySaver: "low",
  lowBatteryThreshold: 0.2,
});

/**
 * Per-tier renderer + scene budget.
 * Expected VRAM/RAM/FPS are engineering targets, not guarantees.
 */
export const QUALITY_PRESETS = Object.freeze({
  ultra: {
    id: "ultra",
    modelKey: "ultra",
    textureResolution: 2048,
    hdriResolution: 1024,
    shadows: { enabled: true, mapSize: 2048, type: "pcfsoft" },
    bloom: { enabled: false, strength: 0.35 },
    ssao: { enabled: false },
    dof: { enabled: false },
    pixelRatioMax: 2,
    msaa: true,
    anisotropy: "max",
    particleCount: 0,
    animationQuality: 1,
    lodDistance: [0, 12, 28],
    frustumCulling: true,
    toneMappingExposure: 1.2,
    expectedVramMB: 180,
    expectedRamMB: 220,
    expectedFps: 60,
  },
  high: {
    id: "high",
    modelKey: "high",
    textureResolution: 1024,
    hdriResolution: 512,
    shadows: { enabled: true, mapSize: 1024, type: "pcf" },
    bloom: { enabled: false, strength: 0.25 },
    ssao: { enabled: false },
    dof: { enabled: false },
    pixelRatioMax: 1.75,
    msaa: true,
    anisotropy: 8,
    particleCount: 0,
    animationQuality: 1,
    lodDistance: [0, 10, 24],
    frustumCulling: true,
    toneMappingExposure: 1.2,
    expectedVramMB: 110,
    expectedRamMB: 160,
    expectedFps: 60,
  },
  medium: {
    id: "medium",
    modelKey: "medium",
    textureResolution: 512,
    hdriResolution: 256,
    shadows: { enabled: false, mapSize: 512, type: "basic" },
    bloom: { enabled: false, strength: 0 },
    ssao: { enabled: false },
    dof: { enabled: false },
    pixelRatioMax: 1.5,
    msaa: true,
    anisotropy: 4,
    particleCount: 0,
    animationQuality: 0.85,
    lodDistance: [0, 8, 20],
    frustumCulling: true,
    toneMappingExposure: 1.15,
    expectedVramMB: 70,
    expectedRamMB: 110,
    expectedFps: 55,
  },
  low: {
    id: "low",
    modelKey: "low",
    textureResolution: 256,
    hdriResolution: 128,
    shadows: { enabled: false, mapSize: 256, type: "basic" },
    bloom: { enabled: false, strength: 0 },
    ssao: { enabled: false },
    dof: { enabled: false },
    pixelRatioMax: 1,
    msaa: false,
    anisotropy: 1,
    particleCount: 0,
    animationQuality: 0.7,
    lodDistance: [0, 6, 16],
    frustumCulling: true,
    toneMappingExposure: 1.1,
    expectedVramMB: 35,
    expectedRamMB: 70,
    expectedFps: 50,
  },
});

/**
 * Per-tier light budgets for the hero scene.
 * low/medium: ambient + key only (cheapest fragment lighting).
 * high/ultra: full cinematic rig (fill, rims, catch, under-bounce).
 */
export const LIGHT_RIGS = Object.freeze({
  low: {
    ambient: { enabled: true, color: 0x26262e, intensity: 0.75 },
    key: {
      enabled: true,
      color: 0xffffff,
      intensity: 2.6,
      position: [4.5, 6.5, 5.5],
    },
    fill: { enabled: false },
    rim: { enabled: false },
    kick: { enabled: false },
    catch: { enabled: false },
    under: { enabled: false },
  },
  medium: {
    ambient: { enabled: true, color: 0x26262e, intensity: 0.65 },
    key: {
      enabled: true,
      color: 0xffffff,
      intensity: 2.9,
      position: [4.5, 6.5, 5.5],
    },
    fill: {
      enabled: true,
      color: 0xb9a8ff,
      intensity: 0.85,
      position: [-5.5, 2.2, 4],
    },
    rim: { enabled: false },
    kick: { enabled: false },
    catch: { enabled: false },
    under: { enabled: false },
  },
  high: {
    ambient: { enabled: true, color: 0x26262e, intensity: 0.55 },
    key: {
      enabled: true,
      color: 0xffffff,
      intensity: 3.0,
      position: [4.5, 6.5, 5.5],
    },
    fill: {
      enabled: true,
      color: 0xb9a8ff,
      intensity: 1.2,
      position: [-5.5, 2.2, 4],
    },
    rim: {
      enabled: true,
      color: 0xd97ef9,
      intensity: 4.2,
      position: [-3.5, 4.5, -6],
    },
    kick: {
      enabled: true,
      color: 0x5eead4,
      intensity: 3.0,
      position: [5.5, 3, -5],
    },
    catch: {
      enabled: true,
      color: 0xe6ecff,
      intensity: 1.1,
      position: [0.4, 1.8, 5.5],
    },
    under: {
      enabled: true,
      color: 0x6d51c9,
      intensity: 0.55,
      position: [0, -3.2, 2.5],
    },
  },
  ultra: {
    ambient: { enabled: true, color: 0x26262e, intensity: 0.55 },
    key: {
      enabled: true,
      color: 0xffffff,
      intensity: 3.0,
      position: [4.5, 6.5, 5.5],
    },
    fill: {
      enabled: true,
      color: 0xb9a8ff,
      intensity: 1.2,
      position: [-5.5, 2.2, 4],
    },
    rim: {
      enabled: true,
      color: 0xd97ef9,
      intensity: 4.6,
      position: [-3.5, 4.5, -6],
    },
    kick: {
      enabled: true,
      color: 0x5eead4,
      intensity: 3.4,
      position: [5.5, 3, -5],
    },
    catch: {
      enabled: true,
      color: 0xe6ecff,
      intensity: 1.3,
      position: [0.4, 1.8, 5.5],
    },
    under: {
      enabled: true,
      color: 0x6d51c9,
      intensity: 0.7,
      position: [0, -3.2, 2.5],
    },
  },
});

export const DRACO_DECODER_PATH =
  "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

/**
 * Optional override for Basis/KTX2 transcoder folder.
 * Leave empty to use three.js default (bundler resolves via import.meta.url).
 * Example CDN:
 * https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/libs/basis/
 */
export const KTX2_TRANSCODER_PATH = "";

/**
 * When true, prefer KTX2-compressed GLB paths if present in ASSET_PATHS_KTX2.
 * Generated from assets/model-source/genesis-model.glb via: npm run optimize:models:ktx2
 */
export const PREFER_KTX2_ASSETS = true;

export const ASSET_PATHS_KTX2 = Object.freeze({
  ultra: "/model/Hero-Ultra-KTX2.glb",
  high: "/model/Hero-High-KTX2.glb",
  medium: "/model/Hero-Medium-KTX2.glb",
  low: "/model/Hero-Low-KTX2.glb",
  fallback: "/model/Hero-Low-KTX2.glb",
});

/**
 * Perf debug overlay / verbose logs.
 * Production builds ignore localStorage + ?perfDebug=1 entirely so the
 * toggle cannot be flipped by end users on the public site.
 */
export const DEBUG_PERFORMANCE =
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  (window.localStorage?.getItem("genesis_hacks:perfDebug") === "1" ||
    /[?&]perfDebug=1/.test(window.location?.search || ""));

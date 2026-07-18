import {
  ASSET_PATHS,
  ASSET_PATHS_KTX2,
  DEBUG_PERFORMANCE,
  DEVICE_CAPS,
  FPS_POLICY,
  NETWORK_CAPS,
  PREFERENCE_CAPS,
  PREFER_KTX2_ASSETS,
  QUALITY_PRESETS,
  SAVE_DATA_CAP,
  SCORE_THRESHOLDS,
  SCORE_WEIGHTS,
} from "../config/quality.config";
import { detectBattery, detectDevice } from "../device/detectDevice";
import { scoreDevice } from "../device/scoreDevice";
import { detectNetwork, resolveNetworkClass } from "../network/detectNetwork";
import { scoreNetwork } from "../network/scoreNetwork";
import { detectGPU } from "../gpu/detectGPU";
import { gpuTierToQualityCap, scoreGPU } from "../gpu/scoreGPU";
import {
  clampQualityToCap,
  minQuality,
  qualityIndex,
  stepQuality,
} from "../utils/clampQuality";

function scoreToQuality(score) {
  if (score >= SCORE_THRESHOLDS.ultra) return "ultra";
  if (score >= SCORE_THRESHOLDS.high) return "high";
  if (score >= SCORE_THRESHOLDS.medium) return "medium";
  return "low";
}

function scoreDisplay(device) {
  let score = 55;
  const dpr = device.devicePixelRatio || 1;
  if (dpr >= 3) score -= 10;
  else if (dpr >= 2) score -= 4;
  else score += 6;

  const w = device.screenWidth || 0;
  if (w >= 2560) score += 8;
  else if (w >= 1920) score += 4;
  else if (w > 0 && w < 1280) score -= 6;

  return Math.min(100, Math.max(0, score));
}

function scoreBrowser(device) {
  switch (device.browser) {
    case "Chrome":
    case "Edge":
      return 80;
    case "Firefox":
      return 70;
    case "Safari":
      return 72;
    default:
      return 55;
  }
}

function scorePreference(device, battery) {
  let score = 80;
  if (device.prefersReducedMotion) score -= 35;
  if (battery?.saverLikely) score -= 40;
  return Math.min(100, Math.max(0, score));
}

/**
 * Orchestrates profiling → initial quality → runtime upgrades/downgrades.
 */
export class QualityManager {
  constructor() {
    this.profile = null;
    this.currentQuality = "medium";
    this.ceiling = "ultra";
    this.floor = "low";
    this._lastChangeAt = 0;
    this._listeners = new Set();
  }

  onChange(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _emit(reason) {
    const payload = {
      quality: this.currentQuality,
      preset: QUALITY_PRESETS[this.currentQuality],
      modelUrl: this.getModelUrl(this.currentQuality),
      ceiling: this.ceiling,
      floor: this.floor,
      profile: this.profile,
      reason,
    };
    this._listeners.forEach((fn) => fn(payload));
    if (DEBUG_PERFORMANCE) {
      // eslint-disable-next-line no-console
      console.info("[QualityManager]", payload);
    }
    return payload;
  }

  /**
   * Full async profile used before first model load.
   */
  async evaluate() {
    const device = detectDevice();
    const network = detectNetwork();
    const gpu = detectGPU();
    const battery = await detectBattery();

    const scores = {
      gpu: scoreGPU(gpu),
      device: scoreDevice(device, battery),
      network: scoreNetwork(network),
      display: scoreDisplay(device),
      browser: scoreBrowser(device),
      preference: scorePreference(device, battery),
    };

    const composite = Math.round(
      scores.gpu * SCORE_WEIGHTS.gpu +
        scores.device * SCORE_WEIGHTS.device +
        scores.network * SCORE_WEIGHTS.network +
        scores.display * SCORE_WEIGHTS.display +
        scores.browser * SCORE_WEIGHTS.browser +
        scores.preference * SCORE_WEIGHTS.preference,
    );

    let quality = scoreToQuality(composite);
    let ceiling = "ultra";

    ceiling = minQuality(ceiling, DEVICE_CAPS[device.formFactor] || "ultra");
    ceiling = minQuality(ceiling, gpuTierToQualityCap(gpu.tier));

    const netClass = resolveNetworkClass(network);
    ceiling = minQuality(ceiling, NETWORK_CAPS[netClass] || "high");

    if (network.saveData) {
      ceiling = minQuality(ceiling, SAVE_DATA_CAP);
    }
    if (device.prefersReducedMotion) {
      ceiling = minQuality(ceiling, PREFERENCE_CAPS.reducedMotion);
    }
    if (battery?.saverLikely) {
      ceiling = minQuality(ceiling, PREFERENCE_CAPS.batterySaver);
    }

    quality = clampQualityToCap(quality, ceiling);

    this.profile = {
      device,
      network,
      gpu,
      battery,
      scores,
      composite,
      networkClass: netClass,
      evaluatedAt: Date.now(),
    };
    this.ceiling = ceiling;
    this.floor = "low";
    this.currentQuality = quality;
    this._lastChangeAt = Date.now();

    return this._emit("initial");
  }

  getPreset(level = this.currentQuality) {
    return QUALITY_PRESETS[level] || QUALITY_PRESETS.medium;
  }

  getModelUrl(level = this.currentQuality) {
    const table = PREFER_KTX2_ASSETS ? ASSET_PATHS_KTX2 : ASSET_PATHS;
    return table[level] || table.fallback || ASSET_PATHS.fallback;
  }

  getFallbackUrl() {
    if (PREFER_KTX2_ASSETS) {
      return ASSET_PATHS_KTX2.fallback || ASSET_PATHS.fallback;
    }
    return ASSET_PATHS.fallback;
  }

  canChange() {
    return Date.now() - this._lastChangeAt >= FPS_POLICY.cooldownMs;
  }

  /**
   * Apply FPS hysteresis recommendation.
   * @returns {{ changed: boolean, quality: string, reason: string }}
   */
  applyFpsRecommendation(recommendation) {
    if (recommendation === "hold" || !this.canChange()) {
      return { changed: false, quality: this.currentQuality, reason: "hold" };
    }

    if (recommendation === "downgrade") {
      if (qualityIndex(this.currentQuality) <= qualityIndex(this.floor)) {
        return {
          changed: false,
          quality: this.currentQuality,
          reason: "at-floor",
        };
      }
      this.currentQuality = stepQuality(this.currentQuality, -1);
      this._lastChangeAt = Date.now();
      this._emit("fps-downgrade");
      return {
        changed: true,
        quality: this.currentQuality,
        reason: "fps-downgrade",
      };
    }

    if (recommendation === "upgrade") {
      const next = stepQuality(this.currentQuality, 1);
      if (qualityIndex(next) > qualityIndex(this.ceiling)) {
        return {
          changed: false,
          quality: this.currentQuality,
          reason: "at-ceiling",
        };
      }
      if (next === this.currentQuality) {
        return {
          changed: false,
          quality: this.currentQuality,
          reason: "at-max",
        };
      }
      this.currentQuality = next;
      this._lastChangeAt = Date.now();
      this._emit("fps-upgrade");
      return {
        changed: true,
        quality: this.currentQuality,
        reason: "fps-upgrade",
      };
    }

    return { changed: false, quality: this.currentQuality, reason: "hold" };
  }
}

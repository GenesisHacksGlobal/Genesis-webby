import { QUALITY_ORDER } from "../config/quality.config";

export function qualityIndex(level) {
  const idx = QUALITY_ORDER.indexOf(level);
  return idx === -1 ? 1 : idx;
}

export function minQuality(a, b) {
  return qualityIndex(a) <= qualityIndex(b) ? a : b;
}

export function maxQuality(a, b) {
  return qualityIndex(a) >= qualityIndex(b) ? a : b;
}

export function stepQuality(level, delta) {
  const next = qualityIndex(level) + delta;
  return QUALITY_ORDER[Math.min(QUALITY_ORDER.length - 1, Math.max(0, next))];
}

export function clampQualityToCap(level, cap) {
  return minQuality(level, cap);
}

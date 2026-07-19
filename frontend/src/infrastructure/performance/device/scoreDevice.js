import { PREFERENCE_CAPS } from "../config/quality.config";

/**
 * Device score 0–100 from CPU/RAM/display/form-factor.
 */
export function scoreDevice(device, battery = {}) {
  let score = 50;

  const cores = device.hardwareConcurrency;
  if (cores != null) {
    if (cores >= 12) score += 22;
    else if (cores >= 8) score += 16;
    else if (cores >= 6) score += 10;
    else if (cores >= 4) score += 4;
    else score -= 12;
  }

  const mem = device.deviceMemoryGB;
  if (mem != null) {
    if (mem >= 16) score += 22;
    else if (mem >= 8) score += 14;
    else if (mem >= 4) score += 4;
    else score -= 16;
  } else {
    // Safari often omits deviceMemory — mild neutral penalty on mobile only
    if (device.formFactor === "mobile") score -= 6;
  }

  if (device.formFactor === "mobile") score -= 18;
  else if (device.formFactor === "tablet") score -= 8;
  else score += 6;

  const px = device.pixelCount || 0;
  if (px > 8_000_000) score -= 8; // heavy retina tax
  else if (px > 4_000_000) score -= 3;

  if (device.prefersReducedMotion) score -= 15;
  if (battery?.saverLikely) score -= 20;
  if (
    battery?.supported &&
    !battery.charging &&
    battery.level != null &&
    battery.level < PREFERENCE_CAPS.lowBatteryThreshold
  ) {
    score -= 12;
  }

  return clamp(score, 0, 100);
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

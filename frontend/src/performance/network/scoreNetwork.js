import { resolveNetworkClass } from "./detectNetwork";

/**
 * Network score 0–100. Save-Data heavily penalizes.
 */
export function scoreNetwork(network) {
  if (!network?.supported) {
    // Unknown network: assume decent broadband (desktop-first creative sites)
    return 62;
  }

  let score = 40;
  const klass = resolveNetworkClass(network);

  switch (klass) {
    case "wifi":
      score = 92;
      break;
    case "4g":
      score = 72;
      break;
    case "3g":
      score = 38;
      break;
    case "2g":
      score = 18;
      break;
    case "slow-2g":
      score = 8;
      break;
    default:
      score = 55;
  }

  if (network.downlink != null) {
    if (network.downlink >= 20) score += 10;
    else if (network.downlink >= 10) score += 6;
    else if (network.downlink >= 5) score += 2;
    else if (network.downlink < 1.5) score -= 18;
    else if (network.downlink < 3) score -= 8;
  }

  if (network.rtt != null) {
    if (network.rtt <= 50) score += 6;
    else if (network.rtt <= 100) score += 2;
    else if (network.rtt >= 400) score -= 16;
    else if (network.rtt >= 250) score -= 8;
  }

  if (network.saveData) score = Math.min(score, 28);

  return clamp(score, 0, 100);
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

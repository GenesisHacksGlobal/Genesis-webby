/**
 * Network Information API profiling.
 */

export function detectNetwork() {
  const connection =
    typeof navigator !== "undefined"
      ? navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection
      : null;

  if (!connection) {
    return {
      supported: false,
      effectiveType: "unknown",
      downlink: null,
      rtt: null,
      saveData: false,
      type: "unknown",
    };
  }

  const effectiveType = normalizeEffectiveType(connection.effectiveType);
  const downlink =
    typeof connection.downlink === "number" ? connection.downlink : null;
  const rtt = typeof connection.rtt === "number" ? connection.rtt : null;
  const saveData = Boolean(connection.saveData);
  const type = connection.type || "unknown";

  return {
    supported: true,
    effectiveType,
    downlink,
    rtt,
    saveData,
    type,
  };
}

function normalizeEffectiveType(value) {
  const v = String(value || "unknown").toLowerCase();
  if (v === "slow-2g" || v === "2g" || v === "3g" || v === "4g") return v;
  return "unknown";
}

/**
 * Infer WiFi-ish conditions when type API is sparse.
 * Effective-type alone cannot prove WiFi; we treat high downlink + low RTT
 * as wifi-equivalent for asset selection.
 */
export function resolveNetworkClass(network) {
  if (!network) return "unknown";
  if (network.saveData) return network.effectiveType || "unknown";

  const type = String(network.type || "").toLowerCase();
  if (type === "wifi" || type === "ethernet") return "wifi";

  if (
    network.effectiveType === "4g" &&
    network.downlink != null &&
    network.downlink >= 10 &&
    network.rtt != null &&
    network.rtt <= 80
  ) {
    return "wifi";
  }

  return network.effectiveType || "unknown";
}

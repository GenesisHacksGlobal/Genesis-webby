/**
 * Collects device / browser / preference signals (no scoring).
 */

export function detectDevice() {
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const win = typeof window !== "undefined" ? window : {};
  const screenObj = typeof screen !== "undefined" ? screen : {};

  const ua = nav.userAgent || "";
  const uaData = nav.userAgentData || null;

  const isTouch =
    (nav.maxTouchPoints || 0) > 0 ||
    (typeof matchMedia === "function" &&
      matchMedia("(pointer: coarse)").matches);

  const isMobileUA =
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    (uaData?.mobile ?? false);

  const isTabletUA = /iPad|Tablet/i.test(ua) || (isTouch && !isMobileUA);

  let formFactor = "desktop";
  if (isMobileUA) formFactor = "mobile";
  else if (isTabletUA) formFactor = "tablet";

  const prefersReducedMotion =
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dpr = win.devicePixelRatio || 1;
  const screenWidth = screenObj.width || win.innerWidth || 0;
  const screenHeight = screenObj.height || win.innerHeight || 0;

  return {
    userAgent: ua,
    brands: uaData?.brands || null,
    platform: uaData?.platform || nav.platform || "unknown",
    deviceMemoryGB: nav.deviceMemory ?? null,
    hardwareConcurrency: nav.hardwareConcurrency ?? null,
    devicePixelRatio: dpr,
    screenWidth,
    screenHeight,
    pixelCount: screenWidth * screenHeight * dpr * dpr,
    isTouch,
    formFactor,
    prefersReducedMotion,
    browser: detectBrowser(ua, uaData),
    os: detectOS(ua, uaData),
  };
}

function detectBrowser(ua, uaData) {
  if (uaData?.brands?.length) {
    const brand = uaData.brands.find(
      (b) => !/Not.?A.?Brand/i.test(b.brand),
    );
    if (brand) return brand.brand;
  }
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "Safari";
  if (/Firefox\//.test(ua)) return "Firefox";
  return "unknown";
}

function detectOS(ua, uaData) {
  const platform = (uaData?.platform || "").toLowerCase();
  if (platform.includes("mac")) return "macOS";
  if (platform.includes("win")) return "Windows";
  if (platform.includes("android")) return "Android";
  if (platform.includes("ios") || platform.includes("iphone")) return "iOS";
  if (platform.includes("linux")) return "Linux";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Mac OS X|Macintosh/i.test(ua)) return "macOS";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iOS/i.test(ua)) return "iOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "unknown";
}

/**
 * Battery API — optional, never throws.
 */
export async function detectBattery() {
  try {
    if (typeof navigator === "undefined" || !navigator.getBattery) {
      return { supported: false };
    }
    const battery = await navigator.getBattery();
    return {
      supported: true,
      charging: battery.charging,
      level: battery.level,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      saverLikely: !battery.charging && battery.level < 0.2,
    };
  } catch {
    return { supported: false };
  }
}

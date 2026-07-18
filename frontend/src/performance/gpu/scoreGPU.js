/**
 * GPU score 0–100 from category + WebGL capability envelope.
 */
export function scoreGPU(gpu) {
  if (!gpu?.supported) return 20;

  let score = 45;

  switch (gpu.tier) {
    case "high-end":
      score = 92;
      break;
    case "mid-range":
      score = 70;
      break;
    case "integrated":
      score = 42;
      break;
    case "low-end":
      score = 18;
      break;
    default:
      score = 55;
  }

  // Category fine-tuning
  switch (gpu.category) {
    case "apple_silicon":
      score = Math.max(score, 88);
      break;
    case "nvidia_rtx":
      score = Math.max(score, 94);
      break;
    case "intel_uhd":
      score = Math.min(score, 48);
      break;
    case "software":
      score = 8;
      break;
    default:
      break;
  }

  if (gpu.isWebGL2) score += 6;
  else score -= 10;

  if (gpu.maxTextureSize >= 16384) score += 6;
  else if (gpu.maxTextureSize >= 8192) score += 3;
  else if (gpu.maxTextureSize > 0 && gpu.maxTextureSize < 4096) score -= 12;

  if (gpu.maxAnisotropy >= 16) score += 3;
  else if (gpu.maxAnisotropy <= 1) score -= 4;

  if (gpu.extensionCount >= 30) score += 4;
  else if (gpu.extensionCount > 0 && gpu.extensionCount < 15) score -= 6;

  if (gpu.extensionSupport?.WEBGL_compressed_texture_astc) score += 2;
  if (gpu.extensionSupport?.KHR_parallel_shader_compile) score += 2;

  return clamp(score, 0, 100);
}

/** Map GPU tier → quality ceiling */
export function gpuTierToQualityCap(tier) {
  switch (tier) {
    case "high-end":
      return "ultra";
    case "mid-range":
      return "high";
    case "integrated":
      return "medium";
    case "low-end":
      return "low";
    default:
      return "high";
  }
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

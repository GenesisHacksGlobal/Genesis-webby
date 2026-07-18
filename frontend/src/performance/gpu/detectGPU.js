/**
 * WebGL GPU fingerprinting via WEBGL_debug_renderer_info (+ fallbacks).
 */

export function detectGPU() {
  const canvas =
    typeof document !== "undefined" ? document.createElement("canvas") : null;

  if (!canvas) {
    return emptyGPU("no-document");
  }

  let gl = null;
  try {
    gl =
      canvas.getContext("webgl2", { powerPreference: "high-performance" }) ||
      canvas.getContext("webgl", { powerPreference: "high-performance" }) ||
      canvas.getContext("experimental-webgl");
  } catch {
    gl = null;
  }

  if (!gl) {
    return emptyGPU("no-webgl");
  }

  const isWebGL2 = typeof WebGL2RenderingContext !== "undefined" &&
    gl instanceof WebGL2RenderingContext;

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const vendor = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
    : gl.getParameter(gl.VENDOR);
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : gl.getParameter(gl.RENDERER);

  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
  const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 0;
  const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) || 0;
  const maxAnisotropy = getMaxAnisotropy(gl);

  const extensions = gl.getSupportedExtensions() || [];
  const importantExtensions = [
    "EXT_texture_filter_anisotropic",
    "OES_texture_float",
    "OES_texture_half_float",
    "WEBGL_compressed_texture_s3tc",
    "WEBGL_compressed_texture_astc",
    "WEBGL_compressed_texture_etc",
    "EXT_color_buffer_float",
    "KHR_parallel_shader_compile",
  ];

  const extensionSupport = Object.fromEntries(
    importantExtensions.map((name) => [name, extensions.includes(name)]),
  );

  const category = classifyGPU(renderer, vendor);
  const tier = gpuCategoryToTier(category);

  // Lose context intentionally — we only needed capability probe
  const lose = gl.getExtension("WEBGL_lose_context");
  if (lose) lose.loseContext();

  return {
    supported: true,
    isWebGL2,
    vendor: String(vendor || "unknown"),
    renderer: String(renderer || "unknown"),
    category,
    tier,
    maxTextureSize,
    maxRenderbufferSize,
    maxVertexAttribs,
    maxAnisotropy,
    extensionSupport,
    extensionCount: extensions.length,
  };
}

function emptyGPU(reason) {
  return {
    supported: false,
    reason,
    isWebGL2: false,
    vendor: "unknown",
    renderer: "unknown",
    category: "unknown",
    tier: "low",
    maxTextureSize: 0,
    maxRenderbufferSize: 0,
    maxVertexAttribs: 0,
    maxAnisotropy: 1,
    extensionSupport: {},
    extensionCount: 0,
  };
}

function getMaxAnisotropy(gl) {
  const ext =
    gl.getExtension("EXT_texture_filter_anisotropic") ||
    gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
    gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
  if (!ext) return 1;
  return gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1;
}

/**
 * Broad vendor/family classification used by scoring + caps.
 */
export function classifyGPU(renderer = "", vendor = "") {
  const r = `${renderer} ${vendor}`.toLowerCase();

  if (/apple\s*m[1-4]|apple gpu|metal/i.test(r)) return "apple_silicon";
  if (/nvidia.*(rtx\s*(40|30|20)|geforce rtx)/i.test(r)) return "nvidia_rtx";
  if (/nvidia|geforce|quadro|rtx|gtx/i.test(r)) return "nvidia";
  if (/radeon\s*rx\s*(7|6|5)|radeon pro/i.test(r)) return "amd_radeon_high";
  if (/amd|radeon|ati/i.test(r)) return "amd_radeon";
  if (/adreno\s*(7|6|540|640|650|660|730|740)/i.test(r)) return "adreno_high";
  if (/adreno/i.test(r)) return "adreno";
  if (/mali-g7|mali-g8|mali-g9|immortalis/i.test(r)) return "mali_high";
  if (/mali/i.test(r)) return "mali";
  if (/intel.*(uhd|iris|hd graphics)/i.test(r)) return "intel_uhd";
  if (/intel/i.test(r)) return "intel";
  if (/swiftshader|llvmpipe|software/i.test(r)) return "software";
  if (/powervr|apple/i.test(r)) return "mobile_gpu";

  return "unknown";
}

export function gpuCategoryToTier(category) {
  switch (category) {
    case "apple_silicon":
    case "nvidia_rtx":
    case "amd_radeon_high":
      return "high-end";
    case "nvidia":
    case "amd_radeon":
    case "adreno_high":
    case "mali_high":
      return "mid-range";
    case "adreno":
    case "mali":
    case "intel_uhd":
    case "intel":
    case "mobile_gpu":
      return "integrated";
    case "software":
      return "low-end";
    default:
      return "mid-range";
  }
}

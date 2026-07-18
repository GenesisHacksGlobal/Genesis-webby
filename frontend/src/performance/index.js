export {
  QUALITY_LEVELS,
  QUALITY_PRESETS,
  ASSET_PATHS,
  ASSET_PATHS_KTX2,
  PREFER_KTX2_ASSETS,
  KTX2_TRANSCODER_PATH,
  FPS_POLICY,
  SCORE_WEIGHTS,
  SCORE_THRESHOLDS,
  DEBUG_PERFORMANCE,
} from "./config/quality.config";

export { detectDevice, detectBattery } from "./device/detectDevice";
export { scoreDevice } from "./device/scoreDevice";
export { detectNetwork, resolveNetworkClass } from "./network/detectNetwork";
export { scoreNetwork } from "./network/scoreNetwork";
export { detectGPU, classifyGPU, gpuCategoryToTier } from "./gpu/detectGPU";
export { scoreGPU, gpuTierToQualityCap } from "./gpu/scoreGPU";
export { QualityManager } from "./quality/QualityManager";
export { FPSMonitor } from "./monitor/FPSMonitor";
export { createGLTFLoader, loadGLTF } from "./loaders/createGLTFLoader";
export { AdaptiveModelLoader } from "./loaders/AdaptiveModelLoader";
export { disposeObject3D, applyRendererQuality } from "./utils/disposeObject3D";
export {
  prepareModelGroup,
  applyHeroMaterials,
} from "./utils/prepareModelGroup";

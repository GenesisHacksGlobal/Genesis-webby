import * as THREE from "three";

const TEXTURE_KEYS = [
  "map",
  "normalMap",
  "roughnessMap",
  "metalnessMap",
  "emissiveMap",
  "aoMap",
  "bumpMap",
  "displacementMap",
  "alphaMap",
  "envMap",
  "lightMap",
  "specularMap",
  "clearcoatMap",
  "clearcoatNormalMap",
  "clearcoatRoughnessMap",
  "sheenColorMap",
  "sheenRoughnessMap",
  "transmissionMap",
  "thicknessMap",
];

/**
 * Fully dispose a scene graph subtree and free GPU memory.
 */
export function disposeObject3D(root, { removeFromParent = true } = {}) {
  if (!root) return;

  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();

  root.traverse((child) => {
    if (child.geometry) geometries.add(child.geometry);

    const mats = child.material
      ? Array.isArray(child.material)
        ? child.material
        : [child.material]
      : [];

    mats.forEach((mat) => {
      if (!mat) return;
      materials.add(mat);
      TEXTURE_KEYS.forEach((key) => {
        const tex = mat[key];
        if (tex && tex.isTexture) textures.add(tex);
      });
    });
  });

  geometries.forEach((g) => g.dispose());
  textures.forEach((t) => t.dispose());
  materials.forEach((m) => m.dispose());

  if (removeFromParent && root.parent) {
    root.parent.remove(root);
  }
}

/**
 * Apply renderer pixel ratio / antialias-adjacent settings from a preset.
 * Note: antialias is constructor-only; we approximate with pixelRatio.
 */
export function applyRendererQuality(renderer, preset, gpu) {
  if (!renderer || !preset) return;

  const dpr =
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  renderer.setPixelRatio(Math.min(dpr, preset.pixelRatioMax));

  if (renderer.toneMappingExposure != null) {
    renderer.toneMappingExposure = preset.toneMappingExposure;
  }

  if (preset.shadows?.enabled) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type =
      preset.shadows.type === "pcfsoft"
        ? THREE.PCFSoftShadowMap
        : THREE.PCFShadowMap;
  } else {
    renderer.shadowMap.enabled = false;
  }

  return {
    anisotropy:
      preset.anisotropy === "max"
        ? gpu?.maxAnisotropy || renderer.capabilities.getMaxAnisotropy()
        : preset.anisotropy,
  };
}

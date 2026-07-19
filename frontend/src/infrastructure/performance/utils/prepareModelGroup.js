import * as THREE from "three";

/**
 * Centers meshes, wraps in a Group, scales to target size, and returns
 * layout metrics used by the hero entry animation.
 */
export function prepareModelGroup(gltfScene, { targetSize = 5.7 } = {}) {
  const model = gltfScene;

  const box = new THREE.Box3();
  let hasMesh = false;
  model.traverse((child) => {
    if (child.isMesh) {
      if (!hasMesh) {
        box.setFromObject(child);
        hasMesh = true;
      } else {
        box.expandByObject(child);
      }
    }
  });

  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  if (hasMesh) {
    box.getCenter(center);
    box.getSize(size);
  }

  model.position.x = -center.x;
  model.position.y = -center.y;
  model.position.z = -center.z;

  const group = new THREE.Group();
  group.add(model);

  const maxDim = Math.max(size.x, size.y, size.z, 0.0001);
  const scale = targetSize / maxDim;
  group.scale.setScalar(scale);

  return {
    group,
    size,
    scale,
    center,
    hasMesh,
  };
}

/**
 * Material tuning so cinematic cool lights read with soft specular response.
 */
export function applyHeroMaterials(root, anisotropy = 1) {
  root.traverse((child) => {
    if (!child.isMesh) return;

    child.frustumCulled = true;
    child.castShadow = true;
    child.receiveShadow = true;

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];

    materials.forEach((material) => {
      if (!material) return;

      if (material.map) {
        material.map.anisotropy = anisotropy;
        material.map.minFilter = THREE.LinearMipmapLinearFilter;
        material.map.magFilter = THREE.LinearFilter;
        material.map.generateMipmaps = true;
        material.map.needsUpdate = true;
      }

      // Slightly glossier than flat matte so key/rim catch without looking plastic
      if (material.roughness !== undefined) {
        material.roughness = THREE.MathUtils.clamp(
          material.roughness * 0.85,
          0.42,
          0.72,
        );
      }
      if (material.metalness !== undefined) {
        material.metalness = THREE.MathUtils.clamp(
          material.metalness * 0.45,
          0,
          0.35,
        );
      }
      if (material.envMapIntensity !== undefined) {
        material.envMapIntensity = 0;
      }
      material.needsUpdate = true;
    });
  });
}

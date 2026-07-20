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
 * KTX2 / compressed textures must NOT call generateMipmaps — WebGL throws
 * GL_INVALID_OPERATION for block-compressed formats.
 */
function configureMap(texture, anisotropy = 1) {
  if (!texture) return;

  texture.anisotropy = anisotropy;
  texture.magFilter = THREE.LinearFilter;

  const isCompressed =
    texture.isCompressedTexture === true ||
    texture.isCompressedArrayTexture === true;
  const hasMipmaps =
    Array.isArray(texture.mipmaps) && texture.mipmaps.length > 1;

  if (isCompressed) {
    // Basis/KTX2 already packs GPU mips (or none) — never regenerate
    texture.generateMipmaps = false;
    texture.minFilter = hasMipmaps
      ? THREE.LinearMipmapLinearFilter
      : THREE.LinearFilter;
  } else {
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
  }

  texture.needsUpdate = true;
}

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

      [
        "map",
        "normalMap",
        "roughnessMap",
        "metalnessMap",
        "aoMap",
        "emissiveMap",
        "bumpMap",
        "displacementMap",
        "alphaMap",
      ].forEach((key) => configureMap(material[key], anisotropy));

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
      // Quiet IBL — enough that glasses/metals catch a hint of reflection,
      // low enough that RoomEnvironment does not flatten cinematic lighting.
      if (material.envMapIntensity !== undefined) {
        material.envMapIntensity = 0.18;
      }
      material.needsUpdate = true;
    });
  });
}

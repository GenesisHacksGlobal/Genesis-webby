import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "meshoptimizer/decoder";
import {
  DRACO_DECODER_PATH,
  KTX2_TRANSCODER_PATH,
} from "../config/quality.config";

/**
 * Shared GLTF + DRACO + KTX2 + Meshopt loader factory.
 * - DRACO: existing Google-hosted decoder path (unchanged).
 * - KTX2: Basis transcoder via three.js defaults (bundler) or optional CDN path.
 * - Meshopt: required for gltfpack / EXT_meshopt_compression assets
 *   (e.g. /model/genesis-model.glb).
 * WebP/JPEG textures continue to work without KTX2 present in the GLB.
 */
export function createGLTFLoader({
  decoderPath = DRACO_DECODER_PATH,
  transcoderPath = KTX2_TRANSCODER_PATH,
  renderer = null,
} = {}) {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(decoderPath);

  const ktx2Loader = new KTX2Loader();
  if (transcoderPath) {
    ktx2Loader.setTranscoderPath(transcoderPath);
  }
  if (renderer) {
    ktx2Loader.detectSupport(renderer);
  }

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setKTX2Loader(ktx2Loader);
  loader.setMeshoptDecoder(MeshoptDecoder);

  return {
    loader,
    dracoLoader,
    ktx2Loader,
    bindRenderer(nextRenderer) {
      if (nextRenderer) {
        ktx2Loader.detectSupport(nextRenderer);
      }
    },
    dispose() {
      dracoLoader.dispose();
      if (typeof ktx2Loader.dispose === "function") {
        ktx2Loader.dispose();
      }
    },
  };
}

/**
 * Promise wrapper around GLTFLoader.load
 */
export function loadGLTF(loader, url, { onProgress } = {}) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      resolve,
      onProgress,
      (err) => reject(err || new Error(`Failed to load ${url}`)),
    );
  });
}

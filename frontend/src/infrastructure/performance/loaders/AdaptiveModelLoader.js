import { createGLTFLoader, loadGLTF } from "./createGLTFLoader";
import { disposeObject3D } from "../utils/disposeObject3D";
import {
  applyHeroMaterials,
  prepareModelGroup,
} from "../utils/prepareModelGroup";
import { applyRendererQuality } from "../utils/disposeObject3D";
import { DEBUG_PERFORMANCE } from "../config/quality.config";

/**
 * Loads / swaps hero GLBs with correct disposal and optional crossfade.
 * Crossfade uses opacity on materials when transparent materials are safe;
 * for opaque PBR we do an instant atomic swap after the new asset is ready
 * (studio-standard: no half-loaded flash).
 */
export class AdaptiveModelLoader {
  constructor({
    scene,
    renderer,
    qualityManager,
    targetSize = 5.7,
    onModelReady,
  }) {
    this.scene = scene;
    this.renderer = renderer;
    this.qualityManager = qualityManager;
    this.targetSize = targetSize;
    this.onModelReady = onModelReady;

    this._bundle = createGLTFLoader({ renderer });
    this._currentGroup = null;
    this._currentUrl = null;
    this._loadingUrl = null;
    this._generation = 0;
    this._disposed = false;
  }

  get currentGroup() {
    return this._currentGroup;
  }

  async loadInitial() {
    const decision = this.qualityManager.profile
      ? {
          quality: this.qualityManager.currentQuality,
          preset: this.qualityManager.getPreset(),
          modelUrl: this.qualityManager.getModelUrl(),
        }
      : await this.qualityManager.evaluate();

    applyRendererQuality(
      this.renderer,
      decision.preset,
      this.qualityManager.profile?.gpu,
    );

    return this._loadAndPresent(decision.modelUrl, decision.quality, {
      isInitial: true,
    });
  }

  /**
   * Background upgrade / downgrade. New model fully loads before swap.
   */
  async swapToQuality(quality, { reason = "adaptive" } = {}) {
    if (this._disposed) return null;
    const url = this.qualityManager.getModelUrl(quality);
    if (url === this._currentUrl || url === this._loadingUrl) {
      return this._currentGroup;
    }

    const preset = this.qualityManager.getPreset(quality);
    applyRendererQuality(
      this.renderer,
      preset,
      this.qualityManager.profile?.gpu,
    );

    return this._loadAndPresent(url, quality, { isInitial: false, reason });
  }

  async _loadAndPresent(url, quality, meta) {
    const generation = ++this._generation;
    this._loadingUrl = url;

    let gltf;
    try {
      gltf = await loadGLTF(this._bundle.loader, url);
    } catch (primaryError) {
      if (DEBUG_PERFORMANCE) {
        // eslint-disable-next-line no-console
        console.warn("[AdaptiveModelLoader] primary failed", url, primaryError);
      }
      const fallback = this.qualityManager.getFallbackUrl();
      if (fallback !== url) {
        try {
          gltf = await loadGLTF(this._bundle.loader, fallback);
          url = fallback;
        } catch (fallbackError) {
          this._loadingUrl = null;
          throw fallbackError;
        }
      } else {
        this._loadingUrl = null;
        throw primaryError;
      }
    }

    if (this._disposed || generation !== this._generation) {
      disposeObject3D(gltf.scene, { removeFromParent: false });
      return this._currentGroup;
    }

    const { group, size, scale } = prepareModelGroup(gltf.scene, {
      targetSize: this.targetSize,
    });

    const anisotropy =
      this.qualityManager.getPreset(quality).anisotropy === "max"
        ? this.renderer.capabilities.getMaxAnisotropy()
        : this.qualityManager.getPreset(quality).anisotropy;

    applyHeroMaterials(group, anisotropy);

    // Atomic swap — old disposed only after new is in the scene
    const previous = this._currentGroup;
    this.scene.add(group);
    this._currentGroup = group;
    this._currentUrl = url;
    this._loadingUrl = null;

    if (previous) {
      disposeObject3D(previous);
    }

    const payload = {
      group,
      size,
      scale,
      quality,
      url,
      ...meta,
    };

    if (typeof this.onModelReady === "function") {
      this.onModelReady(payload);
    }

    if (DEBUG_PERFORMANCE) {
      // eslint-disable-next-line no-console
      console.info("[AdaptiveModelLoader] presented", payload);
    }

    return payload;
  }

  dispose() {
    this._disposed = true;
    this._generation += 1;
    if (this._currentGroup) {
      disposeObject3D(this._currentGroup);
      this._currentGroup = null;
    }
    this._bundle.dispose();
  }
}

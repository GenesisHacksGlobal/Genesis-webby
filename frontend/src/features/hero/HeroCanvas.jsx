import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  AdaptiveModelLoader,
  FPSMonitor,
  QualityManager,
  DEBUG_PERFORMANCE,
} from "@infra/performance";
import { createPlayGate } from "@infra/performance/utils/createPlayGate";

export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    // Antialias is a constructor flag — QualityManager may prefer MSAA off
    // on low tiers; we start with antialias true for first paint, then
    // pixelRatio from the selected preset becomes the primary cost control.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // Studio-dark setup tuned for the neutral #181818 background:
    // clean white key, orchid + cyan rims for edge pop, low neutral ambient.
    const ambientLight = new THREE.AmbientLight(0x26262e, 0.55);
    scene.add(ambientLight);

    // Key — clean white from upper front-right for crisp speculars
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4.5, 6.5, 5.5);
    scene.add(keyLight);

    // Fill — soft lavender from left, lifts shadows without flattening
    const fillLight = new THREE.DirectionalLight(0xb9a8ff, 1.2);
    fillLight.position.set(-5.5, 2.2, 4);
    scene.add(fillLight);

    // Rim — orchid backlight (matches the "together" accent) carves the
    // silhouette out of the dark background
    const rimLight = new THREE.DirectionalLight(0xd97ef9, 4.6);
    rimLight.position.set(-3.5, 4.5, -6);
    scene.add(rimLight);

    // Counter-rim — electric cyan from back-right for two-tone edges
    const kickLight = new THREE.DirectionalLight(0x5eead4, 3.4);
    kickLight.position.set(5.5, 3, -5);
    scene.add(kickLight);

    // Soft frontal catch light for face/detail readability
    const catchLight = new THREE.PointLight(0xe6ecff, 1.3, 18, 2);
    catchLight.position.set(0.4, 1.8, 5.5);
    scene.add(catchLight);

    // Subtle under-bounce — muted violet, grounds the silhouette
    const underLight = new THREE.PointLight(0x6d51c9, 0.7, 14, 2);
    underLight.position.set(0, -3.2, 2.5);
    scene.add(underLight);

    let model = null;
    let cancelled = false;
    let entryStartTime = null;
    let startY = -7;
    const pageStartTime = performance.now();
    const ENTRY_DELAY_MS = 2100;
    const ENTRY_DURATION_MS = 1200;
    const REST_Y = -0.15;

    const qualityManager = new QualityManager();
    const fpsMonitor = new FPSMonitor();

    const placeModelForEntry = (group, size, scale, { preserveTransform }) => {
      if (preserveTransform && model) {
        // Keep pose; keep the newly computed uniform scale so LOD swaps
        // stay the same on-screen size even when mesh bounds change.
        group.position.copy(model.position);
        group.rotation.copy(model.rotation);
        model = group;
        return;
      }

      const cameraDistance = Math.abs(camera.position.z);
      const visibleHalfHeight =
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * cameraDistance;
      const scaledModelHalfHeight = (size.y * scale) / 2;
      startY = -visibleHalfHeight - scaledModelHalfHeight - 0.5;

      group.rotation.x = 0.0;
      group.rotation.y = -Math.PI / 2;
      group.position.y = startY;

      entryStartTime = Math.max(
        performance.now(),
        pageStartTime + ENTRY_DELAY_MS,
      );

      model = group;
    };

    const adaptiveLoader = new AdaptiveModelLoader({
      scene,
      renderer,
      qualityManager,
      targetSize: 6.3,
      onModelReady: ({ group, size, scale, isInitial }) => {
        if (cancelled) return;
        placeModelForEntry(group, size, scale, {
          preserveTransform: !isInitial && Boolean(model),
        });
      },
    });

    adaptiveLoader.loadInitial().catch((error) => {
      console.error("Error loading adaptive genesis model:", error);
    });

    // Pointer look — keep it subtle so the mascot feels attentive, not toy-like.
    const BASE_ROT_Y = -Math.PI / 2;
    const LOOK = {
      yawMax: THREE.MathUtils.degToRad(9),
      pitchMax: THREE.MathUtils.degToRad(4.5),
      rollMax: THREE.MathUtils.degToRad(1.4),
      // Spring: target → velocity → rotation (weight / inertia)
      stiffness: 28,
      damping: 7.5,
      // Soften raw pointer so flicks don't yank the model
      pointerEase: 6,
    };

    let pointerX = 0;
    let pointerY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let velX = 0;
    let velY = 0;
    let velZ = 0;

    const onMouseMove = (event) => {
      if (window.scrollY < window.innerHeight) {
        pointerX = (event.clientX / window.innerWidth) * 2 - 1;
        pointerY = -(event.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const onScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        pointerX = 0;
        pointerY = 0;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    let animationFrameId = 0;
    let lastTime = performance.now();
    let swapInFlight = false;
    let playing = true;
    let animate = () => {};

    const gate = createPlayGate(container, { rootMargin: "200px 0px" });
    const unsubGate = gate.subscribe((active) => {
      playing = active;
      if (active && !animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    });

    animate = (time) => {
      if (!playing || !gate.active) {
        animationFrameId = 0;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const fpsReport = fpsMonitor.tick(time);
      if (fpsReport && !swapInFlight && model) {
        const decision = qualityManager.applyFpsRecommendation(
          fpsReport.recommendation,
        );
        if (decision.changed) {
          swapInFlight = true;
          adaptiveLoader
            .swapToQuality(decision.quality, { reason: decision.reason })
            .catch((err) => {
              if (DEBUG_PERFORMANCE) {
                console.warn("[HeroCanvas] quality swap failed", err);
              }
            })
            .finally(() => {
              swapInFlight = false;
              fpsMonitor.reset();
            });
        }
      }

      if (model) {
        let entryComplete = false;

        if (entryStartTime !== null) {
          const rawProgress = (time - entryStartTime) / ENTRY_DURATION_MS;
          const progress = Math.min(Math.max(rawProgress, 0), 1);
          const easedProgress =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          model.position.y = startY + (REST_Y - startY) * easedProgress;
          entryComplete = progress >= 1;
        }

        if (entryComplete) {
          // Ease pointer → spring target (never map mouse 1:1 onto rotation)
          const pointerFactor = 1 - Math.exp(-LOOK.pointerEase * dt);
          smoothX += (pointerX - smoothX) * pointerFactor;
          smoothY += (pointerY - smoothY) * pointerFactor;

          const targetX = -smoothY * LOOK.pitchMax;
          const targetY = BASE_ROT_Y + smoothX * LOOK.yawMax;
          const targetZ = -smoothX * LOOK.rollMax;

          const spring = (current, target, vel) => {
            const force = (target - current) * LOOK.stiffness;
            const nextVel =
              (vel + force * dt) * Math.exp(-LOOK.damping * dt);
            return {
              value: current + nextVel * dt,
              vel: nextVel,
            };
          };

          const sx = spring(model.rotation.x, targetX, velX);
          const sy = spring(model.rotation.y, targetY, velY);
          const sz = spring(model.rotation.z, targetZ, velZ);
          model.rotation.x = sx.value;
          model.rotation.y = sy.value;
          model.rotation.z = sz.value;
          velX = sx.vel;
          velY = sy.vel;
          velZ = sz.vel;
        } else {
          model.rotation.x = 0;
          model.rotation.y = BASE_ROT_Y;
          model.rotation.z = 0;
          velX = 0;
          velY = 0;
          velZ = 0;
        }
      }

      renderer.render(scene, camera);
    };

    if (gate.active) {
      animationFrameId = requestAnimationFrame(animate);
    }

    let resizeRaf = null;
    const onResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        if (!container || cancelled) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        const preset = qualityManager.getPreset();
        renderer.setSize(w, h);
        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, preset.pixelRatioMax),
        );
      });
    };

    window.addEventListener("resize", onResize);

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);
    }

    return () => {
      cancelled = true;
      playing = false;
      unsubGate();
      gate.destroy();
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (resizeObserver) resizeObserver.disconnect();

      adaptiveLoader.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-full max-w-[1150px] h-[850px] md:h-[1000px] z-[5] pointer-events-none"
    />
  );
}

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  AdaptiveModelLoader,
  FPSMonitor,
  QualityManager,
  DEBUG_PERFORMANCE,
} from "../../../performance";
import { createPlayGate } from "../../../performance/utils/createPlayGate";

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
    renderer.toneMappingExposure = 1.28;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // Cinematic cool key/fill/rim — no warm/yellow lights
    const ambientLight = new THREE.AmbientLight(0x1a1248, 0.35);
    scene.add(ambientLight);

    // Key — icy cool white from upper front-right
    const keyLight = new THREE.DirectionalLight(0xdce9ff, 3.4);
    keyLight.position.set(4.5, 6.5, 5.5);
    scene.add(keyLight);

    // Fill — soft violet from left (keeps brand mood, lower contrast side)
    const fillLight = new THREE.DirectionalLight(0xa78bfa, 1.55);
    fillLight.position.set(-5.5, 2.2, 4);
    scene.add(fillLight);

    // Rim / backlight — electric cyan edge separation (replaces orange rim)
    const rimLight = new THREE.DirectionalLight(0x67e8f9, 4.2);
    rimLight.position.set(-1.5, 4.5, -6.5);
    scene.add(rimLight);

    // Hair kick — magenta from back-left for cinematic color contrast
    const kickLight = new THREE.DirectionalLight(0xe879f9, 2.1);
    kickLight.position.set(5.5, 3.5, -4.5);
    scene.add(kickLight);

    // Soft frontal catch light for face/detail readability
    const catchLight = new THREE.PointLight(0xb8c9ff, 1.15, 18, 2);
    catchLight.position.set(0.4, 1.8, 5.5);
    scene.add(catchLight);

    // Subtle under-bounce (deep indigo) — grounds the silhouette
    const underLight = new THREE.PointLight(0x4c1d95, 0.85, 14, 2);
    underLight.position.set(0, -3.2, 2.5);
    scene.add(underLight);

    let model = null;
    let cancelled = false;
    let entryStartTime = null;
    let startY = -7;
    const pageStartTime = performance.now();
    const ENTRY_DELAY_MS = 2100;
    const ENTRY_DURATION_MS = 1200;
    const REST_Y = 0.2;

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
      group.rotation.y = Math.PI;
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
      targetSize: 5.7,
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

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
      if (window.scrollY < window.innerHeight) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const onScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        mouseX = 0;
        mouseY = 0;
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
          const targetRotationX = -mouseY * 0.2;
          const targetRotationY = Math.PI + mouseX * 0.4;
          const rotationFactor = 1 - Math.exp(-3 * dt);

          model.rotation.x +=
            (targetRotationX - model.rotation.x) * rotationFactor;
          model.rotation.y +=
            (targetRotationY - model.rotation.y) * rotationFactor;
        } else {
          model.rotation.x = 0;
          model.rotation.y = Math.PI;
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

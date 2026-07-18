import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GALLERY_PHOTOS } from "@/data/mediaAssets";
import { fragmentShader, vertexShader } from "./shaders";

const CELL_SIZE = 1.15;
const MIN_ZOOM = 0.55;
const MAX_ZOOM = 2.4;
const FRICTION = 0.94;
const LERP = 0.14;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function buildImageAtlas(photos, tileSize = 512) {
  const count = photos.length;
  const atlasGrid = Math.ceil(Math.sqrt(count));
  const canvas = document.createElement("canvas");
  canvas.width = atlasGrid * tileSize;
  canvas.height = atlasGrid * tileSize;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#111018";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const images = await Promise.all(
    photos.map((p) => loadImage(p.src).catch(() => null)),
  );

  images.forEach((img, i) => {
    if (!img) return;
    const col = i % atlasGrid;
    const row = Math.floor(i / atlasGrid);
    const x = col * tileSize;
    const y = row * tileSize;

    const scale = Math.max(tileSize / img.width, tileSize / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, x + (tileSize - w) / 2, y + (tileSize - h) / 2, w, h);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

async function buildTextAtlas(photos, tileSize = 512) {
  const count = photos.length;
  const atlasGrid = Math.ceil(Math.sqrt(count));
  const canvas = document.createElement("canvas");
  canvas.width = atlasGrid * tileSize;
  canvas.height = atlasGrid * tileSize;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  photos.forEach((photo, i) => {
    const col = i % atlasGrid;
    const row = Math.floor(i / atlasGrid);
    const x = col * tileSize;
    const y = row * tileSize;

    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(x, y, tileSize, tileSize);

    ctx.fillStyle = "rgba(245,240,255,0.92)";
    ctx.font = `600 ${Math.floor(tileSize * 0.055)}px Aeonik, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(photo.caption || "", x + tileSize * 0.06, y + tileSize * 0.45);

    ctx.fillStyle = "rgba(245,240,255,0.45)";
    ctx.font = `400 ${Math.floor(tileSize * 0.04)}px Aeonik, sans-serif`;
    ctx.fillText(photo.meta || "", x + tileSize * 0.06, y + tileSize * 0.68);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function cellIndexFromOffset(offset, zoom, resolution, mousePos, cellSize) {
  if (mousePos.x < 0 || resolution.x <= 0) return 0;

  const screenUV = new THREE.Vector2(
    (mousePos.x / resolution.x) * 2 - 1,
    -((mousePos.y / resolution.y) * 2 - 1),
  );
  const radius = screenUV.length();
  const distortion = 1 - 0.08 * radius * radius;
  const distorted = screenUV.clone().multiplyScalar(distortion);
  const aspect = resolution.x / resolution.y;
  const world = new THREE.Vector2(distorted.x * aspect, distorted.y);
  world.multiplyScalar(zoom);
  world.add(offset);

  const cellIdX = Math.floor(world.x / cellSize);
  const cellIdY = Math.floor(world.y / cellSize);
  const count = GALLERY_PHOTOS.length;
  let texIndex = (cellIdX + cellIdY * 3) % count;
  if (texIndex < 0) texIndex += count;
  return texIndex;
}

export default function InfiniteGallery() {
  const mountRef = useRef(null);
  const [activeCaption, setActiveCaption] = useState(GALLERY_PHOTOS[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let cancelled = false;
    let rafId = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    container.appendChild(renderer.domElement);

    const uniforms = {
      uOffset: { value: new THREE.Vector2(0, 0) },
      uResolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
      uBorderColor: { value: new THREE.Vector4(1, 1, 1, 0.08) },
      uHoverColor: { value: new THREE.Vector4(0.88, 0.94, 0.73, 0.12) },
      uBackgroundColor: { value: new THREE.Vector4(0.04, 0.035, 0.08, 1) },
      uMousePos: { value: new THREE.Vector2(-1, -1) },
      uZoom: { value: 1.55 },
      uCellSize: { value: CELL_SIZE },
      uTextureCount: { value: GALLERY_PHOTOS.length },
      uImageAtlas: { value: null },
      uTextAtlas: { value: null },
      uHasTextAtlas: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const offset = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const velocity = new THREE.Vector2(0, 0);
    let zoom = 1.55;
    let targetZoom = 1.55;

    const pointer = {
      active: false,
      id: null,
      lastX: 0,
      lastY: 0,
    };

    const syncCaption = () => {
      const idx = cellIndexFromOffset(
        offset,
        zoom,
        uniforms.uResolution.value,
        uniforms.uMousePos.value,
        CELL_SIZE,
      );
      const photo = GALLERY_PHOTOS[idx] || GALLERY_PHOTOS[0];
      setActiveCaption(photo);
    };

    Promise.all([
      buildImageAtlas(GALLERY_PHOTOS),
      buildTextAtlas(GALLERY_PHOTOS),
    ])
      .then(([imageAtlas, textAtlas]) => {
        if (cancelled) {
          imageAtlas.dispose();
          textAtlas.dispose();
          return;
        }
        uniforms.uImageAtlas.value = imageAtlas;
        uniforms.uTextAtlas.value = textAtlas;
        uniforms.uHasTextAtlas.value = 1;
        material.needsUpdate = true;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });

    const onPointerDown = (event) => {
      event.preventDefault();
      pointer.active = true;
      pointer.id = event.pointerId;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      velocity.set(0, 0);
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
      setIsDragging(true);
    };

    const onPointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      uniforms.uMousePos.value.set(
        event.clientX - rect.left,
        event.clientY - rect.top,
      );

      if (!pointer.active || event.pointerId !== pointer.id) return;
      event.preventDefault();

      const dx = event.clientX - pointer.lastX;
      const dy = event.clientY - pointer.lastY;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;

      // Screen pixels → world offset (tutorial drag)
      const aspect = rect.width / Math.max(rect.height, 1);
      const worldScale = (zoom * 2) / Math.max(rect.height, 1);
      target.x -= dx * worldScale * aspect;
      target.y += dy * worldScale;
      velocity.x = -dx * worldScale * aspect;
      velocity.y = dy * worldScale;
    };

    const endPointer = (event) => {
      if (!pointer.active || (event && event.pointerId !== pointer.id)) return;
      pointer.active = false;
      pointer.id = null;
      renderer.domElement.style.cursor = "grab";
      setIsDragging(false);
    };

    const onWheel = (event) => {
      event.preventDefault();
      // Pinch-zoom feel: ctrl/meta wheel zooms, otherwise pans
      if (event.ctrlKey || event.metaKey) {
        targetZoom = THREE.MathUtils.clamp(
          targetZoom * (1 + event.deltaY * 0.0015),
          MIN_ZOOM,
          MAX_ZOOM,
        );
      } else {
        const rect = renderer.domElement.getBoundingClientRect();
        const aspect = rect.width / Math.max(rect.height, 1);
        const worldScale = (zoom * 2) / Math.max(rect.height, 1);
        target.x += event.deltaX * worldScale * aspect * 0.85;
        target.y -= event.deltaY * worldScale * 0.85;
        velocity.x = event.deltaX * worldScale * aspect * 0.2;
        velocity.y = -event.deltaY * worldScale * 0.2;
      }
    };

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      uniforms.uResolution.value.set(w, h);
    };

    const el = renderer.domElement;
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endPointer);
    el.addEventListener("pointercancel", endPointer);
    el.addEventListener("pointerleave", endPointer);
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    let captionTick = 0;

    const animate = () => {
      if (cancelled) return;
      rafId = requestAnimationFrame(animate);

      if (!pointer.active) {
        target.x += velocity.x;
        target.y += velocity.y;
        velocity.multiplyScalar(FRICTION);
        if (Math.abs(velocity.x) < 0.00001) velocity.x = 0;
        if (Math.abs(velocity.y) < 0.00001) velocity.y = 0;
      }

      offset.x += (target.x - offset.x) * LERP;
      offset.y += (target.y - offset.y) * LERP;
      zoom += (targetZoom - zoom) * 0.1;

      uniforms.uOffset.value.copy(offset);
      uniforms.uZoom.value = zoom;

      captionTick += 1;
      if (captionTick % 10 === 0) syncCaption();

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endPointer);
      el.removeEventListener("pointercancel", endPointer);
      el.removeEventListener("pointerleave", endPointer);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);

      uniforms.uImageAtlas.value?.dispose();
      uniforms.uTextAtlas.value?.dispose();
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0914]">
      <div ref={mountRef} className="absolute inset-0" />

      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
            Loading frames…
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 px-6 pb-8 pt-24 bg-gradient-to-t from-black/75 via-black/25 to-transparent">
        <p className="font-display text-2xl sm:text-3xl text-[var(--heading)] text-center">
          {activeCaption?.caption}
        </p>
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/55">
          {activeCaption?.meta}
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-white/35">
          {isDragging ? "Dragging" : "Drag · Scroll · Ctrl+Scroll zoom"}
        </p>
      </div>
    </div>
  );
}

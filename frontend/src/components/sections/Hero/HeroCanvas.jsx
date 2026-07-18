import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default function HeroCanvas() {
    const mountRef = useRef(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        // 1. Scene Setup
        const scene = new THREE.Scene();

        // 2. Camera Setup
        const width = container.clientWidth;
        const height = container.clientHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 8);

        // 3. Renderer Setup — red background
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.setClearColor(0x000000, 0);
        // Make the canvas fill its parent div at all times
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        container.appendChild(renderer.domElement);

        // 4. Lighting Setup
        // Ambient fill with a very subtle deep indigo tone to keep shadows colored instead of dead black
        const ambientLight = new THREE.AmbientLight(0x181528, 0.8);
        scene.add(ambientLight);

        // Main key light: Electric Cyan
        const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 4.5);
        dirLight1.position.set(6, 5, 5);
        scene.add(dirLight1);

        // Fill light: Hot Pink / Purple
        const dirLight2 = new THREE.DirectionalLight(0xd946ef, 4.0);
        dirLight2.position.set(-6, -2, 2);
        scene.add(dirLight2);

        // Subtle cyan front fill — avoids white specular hotspots
        const pointLight = new THREE.PointLight(0x22d3ee, 0.6, 15);
        pointLight.position.set(0, 0, 4);
        scene.add(pointLight);

        // Bright rim light: Vibrant Gold / Amber to slice the model's silhouette from behind
        const rimLight = new THREE.DirectionalLight(0xff7a00, 6.0);
        rimLight.position.set(0, 5, -5);
        scene.add(rimLight);

        // 5. Load Draco Model
        let model = null;
        let cancelled = false;
        let entryStartTime = null;
        const pageStartTime = performance.now();
        const ENTRY_DELAY_MS = 2100;
        const ENTRY_DURATION_MS = 1200;
        let startY = -7;
        const REST_Y = 0.2;

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            "/model/genesis-compressed.glb",
            (gltf) => {
                if (cancelled) return;

                model = gltf.scene;

                // Center model based on visible meshes bounding box only
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

                // Parent group for positioning
                const group = new THREE.Group();
                group.add(model);
                scene.add(group);
                model = group;

                // Scale to fill screen nicely (zoomed out a bit)
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 5.7 / maxDim;
                model.scale.setScalar(scale);

                // Place the complete model below the camera frustum, including
                // a small safety margin so no pixels are visible before entry.
                const cameraDistance = Math.abs(camera.position.z);
                const visibleHalfHeight =
                    Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
                    cameraDistance;
                const scaledModelHalfHeight = (size.y * scale) / 2;
                startY =
                    -visibleHalfHeight - scaledModelHalfHeight - 0.5;

                // Face the camera and begin fully outside the viewport.
                model.rotation.x = 0.0;
                model.rotation.y = Math.PI;
                model.position.y = startY;
                // Wait for both the model and hero text timing, then run the
                // complete entry animation from its first frame.
                entryStartTime = Math.max(
                    performance.now(),
                    pageStartTime + ENTRY_DELAY_MS,
                );

                // Traverse meshes to apply maximum texture filtering (anisotropy) and enhance materials
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        if (child.material) {
                            const materials = Array.isArray(child.material) ? child.material : [child.material];
                            materials.forEach((material) => {
                                if (material.map) {
                                    material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                                    material.map.minFilter = THREE.LinearMipmapLinearFilter;
                                    material.map.magFilter = THREE.LinearFilter;
                                }

                                // Keep the surface matte so lights add color
                                // without creating bright white reflections.
                                if (material.roughness !== undefined) {
                                    material.roughness = Math.max(0.78, material.roughness);
                                }
                                if (material.metalness !== undefined) {
                                    material.metalness *= 0.2;
                                }
                                if (material.envMapIntensity !== undefined) {
                                    material.envMapIntensity = 0;
                                }
                                material.needsUpdate = true;
                            });
                        }
                    }
                });
            },
            undefined,
            (error) => {
                console.error("Error loading genesis model:", error);
            }
        );

        // 6. Upward entry plus mouse-follow rotation
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

        let animationFrameId;
        let lastTime = performance.now();

        const animate = (time) => {
            animationFrameId = requestAnimationFrame(animate);

            const dt = Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;

            if (model) {
                let entryComplete = false;

                if (entryStartTime !== null) {
                    const rawProgress =
                        (time - entryStartTime) / ENTRY_DURATION_MS;
                    const progress = Math.min(
                        Math.max(rawProgress, 0),
                        1,
                    );
                    const easedProgress =
                        progress < 0.5
                            ? 4 * progress * progress * progress
                            : 1 -
                              Math.pow(-2 * progress + 2, 3) / 2;

                    model.position.y =
                        startY + (REST_Y - startY) * easedProgress;
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

        animationFrameId = requestAnimationFrame(animate);

        // 7. Resize Handler
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

                renderer.setSize(w, h);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            });
        };

        window.addEventListener("resize", onResize);

        let resizeObserver = null;
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(onResize);
            resizeObserver.observe(container);
        }

        // Cleanup
        return () => {
            cancelled = true;
            cancelAnimationFrame(animationFrameId);
            if (resizeRaf) cancelAnimationFrame(resizeRaf);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            if (resizeObserver) resizeObserver.disconnect();

            if (model) {
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry?.dispose();
                        const materials = Array.isArray(child.material)
                            ? child.material
                            : [child.material];
                        materials.forEach((m) => {
                            if (!m) return;
                            m.map?.dispose();
                            m.normalMap?.dispose();
                            m.roughnessMap?.dispose();
                            m.metalnessMap?.dispose();
                            m.emissiveMap?.dispose();
                            m.aoMap?.dispose();
                            m.dispose();
                        });
                    }
                });
            }

            dracoLoader.dispose();
            renderer.dispose();
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-full max-w-[1150px] h-[850px] md:h-[1000px] z-[5] pointer-events-none"
        />
    );
}

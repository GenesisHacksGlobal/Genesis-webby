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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // slightly brighter ambient fill
        scene.add(ambientLight);

        // Main white key light
        const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.0);
        dirLight1.position.set(5, 5, 5);
        scene.add(dirLight1);

        // Rich purple fill light
        const dirLight2 = new THREE.DirectionalLight(0xa855f7, 2.5); // Purple glow light
        dirLight2.position.set(-5, -2, 2);
        scene.add(dirLight2);

        // Front focal point light
        const pointLight = new THREE.PointLight(0xffffff, 2.0, 20);
        pointLight.position.set(0, 0, 4);
        scene.add(pointLight);

        // Bright rim light from behind (separates model edges with clean highlight)
        const rimLight = new THREE.DirectionalLight(0xffffff, 3.5);
        rimLight.position.set(0, 5, -5);
        scene.add(rimLight);

        // 5. Load Draco Model
        let model = null;
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            "/model/genesis",
            (gltf) => {
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

                // Parent group for rotation / animations
                const group = new THREE.Group();
                group.add(model);
                scene.add(group);
                model = group;

                // Scale to fill screen nicely (zoomed out a bit)
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 5.7 / maxDim;
                model.scale.setScalar(scale);

                // Face the camera (rotated 180 degrees on Y)
                model.rotation.x = 0.0;
                model.rotation.y = Math.PI;

                // Shift model slightly upward
                model.position.y += 0.2;

                // Traverse meshes to apply maximum texture filtering (anisotropy) and enhance materials
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        if (child.material) {
                            const materials = Array.isArray(child.material) ? child.material : [child.material];
                            materials.forEach((material) => {
                                // Enhance texture crispness with maximum anisotropic filtering
                                if (material.map) {
                                    material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                                    material.map.minFilter = THREE.LinearMipmapLinearFilter;
                                    material.map.magFilter = THREE.LinearFilter;
                                }

                                // Make metallic/glossy parts pop with shinier, richer reflections
                                if (material.roughness !== undefined) {
                                    material.roughness = Math.max(0.08, material.roughness * 0.65);
                                }
                                if (material.metalness !== undefined) {
                                    material.metalness = Math.min(1.0, material.metalness * 1.25);
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

        // 6. Mouse tracking
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const onMouseMove = (event) => {
            if (window.scrollY < window.innerHeight) {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            } else {
                mouseX = 0;
                mouseY = 0;
            }
        };

        const onScroll = () => {
            if (window.scrollY >= window.innerHeight) {
                mouseX = 0;
                mouseY = 0;
            }
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("scroll", onScroll);

        // 7. Animation Loop
        let animationFrameId;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            if (model) {
                // targetX controls vertical tilt, targetY controls horizontal turn
                targetX = -mouseY * 0.2; // reduced: less tilt when cursor moves up/down
                targetY =  mouseX * 0.4; // normal:   cursor right → model turns right

                // Lerp into the target rotation (Math.PI baseline keeps front facing camera)
                model.rotation.y += (targetY + Math.PI - model.rotation.y) * 0.05;
                model.rotation.x += (targetX - model.rotation.x) * 0.05;
            }

            renderer.render(scene, camera);
        };

        animate();

        // 8. Resize Handler — ResizeObserver watches the container so F11 /
        //    fullscreen / any CSS layout change is detected immediately
        const onResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (!w || !h) return;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        // Also listen to window resize as a fallback for older browsers
        window.addEventListener("resize", onResize);

        // ResizeObserver for reliable fullscreen / panel changes
        let resizeObserver = null;
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(onResize);
            resizeObserver.observe(container);
        }

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            if (resizeObserver) resizeObserver.disconnect();

            // Dispose all GLTF geometries, materials, and textures to prevent GPU memory leak
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

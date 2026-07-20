import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_PHOTOS } from "@shared/data/mediaAssets";

export default function Gallery() {
    const [active, setActive] = useState(null);

    const close = () => setActive(null);

    const lightbox = (
        <AnimatePresence>
            {active !== null && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="fixed inset-0 z-[100] bg-black/90 cursor-zoom-out"
                        onClick={close}
                    />
                    <motion.figure
                        key="lightbox"
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[101] flex flex-col items-center justify-center gap-4 p-6 pointer-events-none"
                        onClick={close}
                    >
                        <img
                            src={GALLERY_PHOTOS[active]?.src}
                            alt={GALLERY_PHOTOS[active]?.caption}
                            className="max-h-[80vh] max-w-[90vw] w-auto object-contain pointer-events-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <figcaption className="overline text-white/70 text-center pointer-events-auto">
                            {GALLERY_PHOTOS[active]?.caption}{" "}
                            <span className="text-white/40">/ {GALLERY_PHOTOS[active]?.meta}</span>
                        </figcaption>
                    </motion.figure>
                    <button
                        onClick={close}
                        aria-label="Close lightbox"
                        className="fixed top-5 right-6 z-[102] text-white/50 hover:text-white text-2xl transition-colors pointer-events-auto"
                    >
                        âœ•
                    </button>
                </>
            )}
        </AnimatePresence>
    );

    return (
        <section id="gallery" className="relative py-24 md:py-36 z-[3] border-t border-border overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="flex items-center gap-3 mb-14">
                    <span className="block w-10 h-px bg-[var(--text-dim)]" />
                    <span className="overline">Chapter 04 · Stills</span>
                </div>
                <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95] text-[var(--heading)] max-w-[22ch] mb-16">
                    Frames from the floor.
                </h2>

                {/* Masonry grid */}
                <div className="columns-2 sm:columns-3 md:columns-4 gap-3 md:gap-4 [column-fill:_balance]">
                    {GALLERY_PHOTOS.map((p, i) => (
                        <motion.button
                            type="button"
                            key={i}
                            onClick={() => setActive(i)}
                            aria-label={`Open ${p.caption} in lightbox`}
                            data-cursor
                            data-cursor-label="Open"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.7, delay: (i % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
                            className="relative block w-full mb-3 md:mb-4 overflow-hidden frame group cursor-zoom-in"
                        >
                            <img
                                src={p.src}
                                alt={p.caption}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-auto object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent md:bg-black/0 md:group-hover:bg-black/30 transition-colors duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                <span className="font-display text-lg md:text-xl text-white leading-tight block">{p.caption}</span>
                                <span className="font-mono text-[10px] text-white/60 mt-0.5 block">{p.meta}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {typeof document !== "undefined" && createPortal(lightbox, document.body)}
        </section>
    );
}

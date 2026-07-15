import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { GALLERY_PHOTOS } from "@/data/photos";

const photos = GALLERY_PHOTOS;

export default function Gallery() {
    const [active, setActive] = useState(null);

    useEffect(() => {
        if (active === null) return;
        const onKey = (e) => {
            if (e.key === "Escape") setActive(null);
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [active]);

    const lightbox = (
        <AnimatePresence>
            {active !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Gallery preview"
                    className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
                    onClick={() => setActive(null)}
                    data-testid="gallery-lightbox"
                >
                    <button
                        type="button"
                        data-testid="gallery-lightbox-close"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActive(null);
                        }}
                        className="absolute top-6 right-6 w-12 h-12 border border-[var(--border)] text-[var(--text)] font-mono hover:bg-white hover:text-black transition-colors z-[1001]"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    <motion.img
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.96, opacity: 0 }}
                        src={photos[active].src}
                        alt={photos[active].caption}
                        className="max-h-[85vh] max-w-[90vw] object-contain border border-[var(--border)]"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                        <div className="font-display text-2xl text-[var(--text)]">{photos[active].caption}</div>
                        <div className="overline mt-2">{photos[active].meta}</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <section
            id="gallery"
            data-testid={LANDING.gallerySection}
            className="relative py-28 md:py-40 z-[3] border-t border-border"
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="block w-10 h-px bg-[var(--text-dim)]" />
                            <span className="overline">Chapter 04 · Stills</span>
                        </div>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.02] text-[var(--text)] max-w-[20ch]">
                            Frames from the floor.
                        </h2>
                    </div>
                    <p className="md:max-w-md text-[var(--text-dim)] leading-relaxed">
                        Hand-picked moments from past editions — slow rooms, candle-lit panels,
                        and the in-between conversations that turn into year-long collabs.
                    </p>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 [column-fill:_balance]">
                    {photos.map((p, i) => (
                        <motion.button
                            type="button"
                            key={i}
                            data-testid={`${LANDING.galleryItem}-${i}`}
                            data-cursor
                            data-cursor-label="Open"
                            onClick={() => setActive(i)}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            className={`mb-3 block w-full text-left frame overflow-hidden group ${p.aspect} relative break-inside-avoid`}
                        >
                            <img src={p.src} alt={p.caption} className="absolute inset-0 w-full h-full object-cover gallery-img" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                <span className="font-display text-lg leading-tight text-[var(--text)]">{p.caption}</span>
                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
                                    {p.meta}
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {typeof document !== "undefined" && createPortal(lightbox, document.body)}
        </section>
    );
}

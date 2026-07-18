import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteGallery from "@/components/gallery/InfiniteGallery";
import { GALLERY_PHOTOS } from "@/data/mediaAssets";

/**
 * Full-viewport Phantom-style infinite gallery.
 * No site footer / chapter chrome — only a minimal escape hatch home.
 */
export default function GalleryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-[#07060f] text-white">
      <InfiniteGallery />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-7">
        <div className="pointer-events-auto flex flex-col gap-3">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 border border-white/20 bg-black/30 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white"
          >
            <span aria-hidden>←</span>
            Home
          </Link>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Stills
            </p>
            <h1 className="font-display text-2xl tracking-tight text-[var(--heading)] sm:text-3xl">
              Gallery
            </h1>
          </div>
        </div>

        <div className="pointer-events-none text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            Frames
          </p>
          <p className="font-display text-xl text-white/80 sm:text-2xl">
            {String(GALLERY_PHOTOS.length).padStart(2, "0")}
          </p>
        </div>
      </header>
    </div>
  );
}

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteGallery from "@features/infinite-gallery/InfiniteGallery";
import { GALLERY_PHOTOS } from "@shared/data/mediaAssets";

/**
 * Full-viewport Phantom-style infinite gallery.
 * No site footer / chapter chrome — only a minimal escape hatch home.
 */
export default function GalleryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    const prevTouchAction = document.body.style.touchAction;
    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.touchAction = "none";
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
      document.body.style.touchAction = prevTouchAction;
      html.style.overflow = prevHtmlOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] overscroll-none bg-[#141414] text-white touch-none">
      <InfiniteGallery />

      <header
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3"
        style={{
          paddingTop: "max(0.875rem, env(safe-area-inset-top, 0px))",
          paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
          paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
        }}
      >
        <div className="pointer-events-auto flex min-w-0 flex-col gap-2 sm:gap-3">
          <Link
            to="/"
            className="inline-flex min-h-11 min-w-11 w-fit items-center gap-2 border border-white/20 bg-black/40 px-3.5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white/85 backdrop-blur-md transition-colors active:border-white/50 active:text-white sm:min-h-0 sm:px-3 sm:py-2 hover:border-white/40 hover:text-white"
          >
            <span aria-hidden>←</span>
            Home
          </Link>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Stills
            </p>
            <h1 className="font-display text-xl tracking-tight text-[var(--heading)] sm:text-3xl">
              Gallery
            </h1>
          </div>
        </div>

        <div className="pointer-events-none shrink-0 text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            Frames
          </p>
          <p className="font-display text-lg text-white/80 sm:text-2xl">
            {String(GALLERY_PHOTOS.length).padStart(2, "0")}
          </p>
        </div>
      </header>
    </div>
  );
}

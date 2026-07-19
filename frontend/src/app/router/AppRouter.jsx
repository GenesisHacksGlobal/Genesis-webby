import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const HomePage = lazy(() => import("@pages/home/HomePage"));
const GalleryPage = lazy(() => import("@pages/gallery/GalleryPage"));
const EventsPage = lazy(() => import("@pages/events/EventsPage"));

function RouteFallback() {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--bg)] text-[var(--text-faint)]"
      role="status"
      aria-live="polite"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.22em]">
        Loading…
      </p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

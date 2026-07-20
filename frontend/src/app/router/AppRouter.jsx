import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@shared/ui/ErrorBoundary";

const HomePage = lazy(() => import("@pages/home/HomePage"));
const GalleryPage = lazy(() => import("@pages/gallery/GalleryPage"));
const EventsPage = lazy(() => import("@pages/events/EventsPage"));
const NotFoundPage = lazy(() => import("@pages/not-found/NotFoundPage"));

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

function PageBoundary({ children, title }) {
  return (
    <ErrorBoundary title={title} compact={false}>
      {children}
    </ErrorBoundary>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <PageBoundary title="Home failed to load.">
                <HomePage />
              </PageBoundary>
            }
          />
          <Route
            path="/gallery"
            element={
              <PageBoundary title="Gallery failed to load.">
                <GalleryPage />
              </PageBoundary>
            }
          />
          <Route
            path="/events"
            element={
              <PageBoundary title="Events failed to load.">
                <EventsPage />
              </PageBoundary>
            }
          />
          {/* Catch-all — never blank-screen unknown URLs */}
          <Route
            path="*"
            element={
              <PageBoundary title="Something went wrong.">
                <NotFoundPage />
              </PageBoundary>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

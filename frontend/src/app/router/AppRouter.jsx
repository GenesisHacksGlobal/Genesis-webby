import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@shared/ui/ErrorBoundary";
import ConsentBanner from "@shared/consent/ConsentBanner";
import Loader from "@/components/ui/loader-15";

const HomePage = lazy(() => import("@pages/home/HomePage"));
const GalleryPage = lazy(() => import("@pages/gallery/GalleryPage"));
const EventsPage = lazy(() => import("@pages/events/EventsPage"));
const AboutPage = lazy(() => import("@pages/about/AboutPage"));
const ValuesPage = lazy(() => import("@pages/values/ValuesPage"));
const ContactPage = lazy(() => import("@pages/contact/ContactPage"));
const CareersPage = lazy(() => import("@pages/careers/CareersPage"));
const PrivacyPage = lazy(() => import("@pages/privacy/PrivacyPage"));
const TermsPage = lazy(() => import("@pages/terms/TermsPage"));
const TeamPage = lazy(() => import("@pages/team/TeamPage"));
const AdminEventsPage = lazy(() => import("@pages/admin/AdminEventsPage"));
const NotFoundPage = lazy(() => import("@pages/not-found/NotFoundPage"));

function RouteFallback() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0c0c0f] text-white"
      role="status"
      aria-live="polite"
    >
      <Loader />
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
          <Route
            path="/about"
            element={
              <PageBoundary title="About failed to load.">
                <AboutPage />
              </PageBoundary>
            }
          />
          <Route
            path="/values"
            element={
              <PageBoundary title="Values failed to load.">
                <ValuesPage />
              </PageBoundary>
            }
          />
          <Route
            path="/contact"
            element={
              <PageBoundary title="Contact failed to load.">
                <ContactPage />
              </PageBoundary>
            }
          />
          <Route
            path="/careers"
            element={
              <PageBoundary title="Careers failed to load.">
                <CareersPage />
              </PageBoundary>
            }
          />
          <Route
            path="/privacy"
            element={
              <PageBoundary title="Privacy failed to load.">
                <PrivacyPage />
              </PageBoundary>
            }
          />
          <Route
            path="/terms"
            element={
              <PageBoundary title="Terms failed to load.">
                <TermsPage />
              </PageBoundary>
            }
          />
          <Route
            path="/team"
            element={
              <PageBoundary title="Team failed to load.">
                <TeamPage />
              </PageBoundary>
            }
          />
          <Route
            path="/admin-events"
            element={
              <PageBoundary title="Admin Portal failed to load.">
                <AdminEventsPage />
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
      <ConsentBanner />
    </BrowserRouter>
  );
}

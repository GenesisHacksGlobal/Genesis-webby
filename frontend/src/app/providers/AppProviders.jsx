import React from "react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import ErrorBoundary from "@shared/ui/ErrorBoundary";

/**
 * Global providers for the Genesis web app.
 * App-level ErrorBoundary is the last line of defence for render crashes.
 */
export default function AppProviders({ children }) {
  return (
    <ErrorBoundary title="Genesis hit an unexpected error.">
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </MotionConfig>
    </ErrorBoundary>
  );
}

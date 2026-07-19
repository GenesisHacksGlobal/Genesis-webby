import React from "react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";

/**
 * Global providers for the Genesis web app.
 * Keep this thin — page-level state stays in pages/features.
 */
export default function AppProviders({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster theme="dark" position="bottom-right" />
    </MotionConfig>
  );
}

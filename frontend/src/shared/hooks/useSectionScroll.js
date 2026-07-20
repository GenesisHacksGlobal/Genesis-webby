import { useLayoutEffect, useRef } from "react";
import { useScroll } from "framer-motion";

function ensureNonStaticPosition(el) {
  if (!el || typeof window === "undefined") return;
  const { position } = window.getComputedStyle(el);
  if (position === "static") {
    el.style.position = "relative";
  }
}

/**
 * Safe wrapper around Framer Motion useScroll for section targets.
 * Ensures the measured element is non-static and disables layoutEffect
 * so scroll offsets stay stable with Lenis + lazy-loaded routes.
 */
export function useSectionScroll({ target, offset, container, ...rest } = {}) {
  const fallbackRef = useRef(null);
  const resolvedTarget = target ?? fallbackRef;

  useLayoutEffect(() => {
    ensureNonStaticPosition(resolvedTarget.current);
  });

  const scroll = useScroll({
    target: resolvedTarget,
    offset,
    container,
    layoutEffect: false,
    ...rest,
  });

  return { ref: fallbackRef, ...scroll };
}

/** Window / document scroll progress (e.g. navbar progress bar). */
export function usePageScroll(options = {}) {
  return useScroll({
    layoutEffect: false,
    ...options,
  });
}

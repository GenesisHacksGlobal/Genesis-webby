import { useEffect, useState } from "react";

/**
 * React-facing animation gate: reduced-motion, tab visibility, and
 * optional IntersectionObserver for offscreen pause.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function useAnimationLifecycle(targetRef, options = {}) {
  const {
    rootMargin = "120px 0px",
    threshold = 0.01,
    observe = true,
  } = options;

  const [reducedMotion, setReducedMotion] = useState(() =>
    prefersReducedMotion(),
  );
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [inView, setInView] = useState(!observe);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const onVisibility = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!observe) {
      setInView(true);
      return undefined;
    }
    const el = targetRef?.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [targetRef, observe, rootMargin, threshold]);

  const shouldAnimate = !reducedMotion && documentVisible && inView;

  return {
    shouldAnimate,
    reducedMotion,
    documentVisible,
    inView,
  };
}

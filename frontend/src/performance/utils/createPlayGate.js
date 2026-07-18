/**
 * Imperative play/pause gate for RAF / WebGL loops.
 * Pauses when: tab hidden, element offscreen, or prefers-reduced-motion.
 */
export function createPlayGate(element, options = {}) {
  const {
    rootMargin = "160px 0px",
    threshold = 0.01,
    respectReducedMotion = true,
  } = options;

  let inView = true;
  let docVisible =
    typeof document === "undefined"
      ? true
      : document.visibilityState !== "hidden";
  let reduced = false;
  let destroyed = false;
  const listeners = new Set();
  let mq = null;

  const getActive = () => !destroyed && inView && docVisible && !reduced;

  const notify = () => {
    if (destroyed) return;
    const active = getActive();
    listeners.forEach((fn) => {
      try {
        fn(active);
      } catch {
        /* ignore */
      }
    });
  };

  const onVisibility = () => {
    docVisible = document.visibilityState !== "hidden";
    notify();
  };

  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibility);
  }

  const onMq = () => {
    reduced = Boolean(mq?.matches);
    notify();
  };

  if (
    respectReducedMotion &&
    typeof window !== "undefined" &&
    window.matchMedia
  ) {
    mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced = mq.matches;
    mq.addEventListener?.("change", onMq);
  }

  let io = null;
  if (element && typeof IntersectionObserver !== "undefined") {
    io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        notify();
      },
      { rootMargin, threshold },
    );
    io.observe(element);
  }

  return {
    get active() {
      return getActive();
    },
    subscribe(fn) {
      listeners.add(fn);
      fn(getActive());
      return () => listeners.delete(fn);
    },
    destroy() {
      destroyed = true;
      listeners.clear();
      io?.disconnect();
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibility);
      }
      mq?.removeEventListener?.("change", onMq);
    },
  };
}

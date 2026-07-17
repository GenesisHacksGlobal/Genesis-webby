/**
 * Lock a stable viewport height so F11 / browser-chrome toggles
 * don't reflow full-viewport sections (100svh/100vh jump).
 * Height is refreshed only when the viewport WIDTH changes.
 */
export function lockStableViewportHeight() {
    if (typeof window === "undefined") return () => {};

    const apply = () => {
        document.documentElement.style.setProperty(
            "--app-height",
            `${window.innerHeight}px`,
        );
    };

    let lastWidth = window.innerWidth;
    apply();

    const onResize = () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        apply();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
}

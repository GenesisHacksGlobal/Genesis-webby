/**
 * Lock a stable viewport height so F11 / browser-chrome toggles
 * don't reflow full-viewport sections (100svh/100vh jump).
 * Height is refreshed only when the viewport WIDTH changes.
 */
export function lockStableViewportHeight() {
    if (typeof window === "undefined") return () => {};

    const WIDTH_CHANGE_THRESHOLD = 120;

    const apply = () => {
        document.documentElement.style.setProperty(
            "--app-height",
            `${window.innerHeight}px`,
        );
    };

    let lastWidth = window.innerWidth;
    apply();

    const onResize = () => {
        // F11 and browser chrome toggles can change the reported width by a
        // few pixels. Ignore those changes so full-height sections do not
        // reflow. Only recalculate for a meaningful window/device resize.
        if (
            Math.abs(window.innerWidth - lastWidth) <
            WIDTH_CHANGE_THRESHOLD
        ) {
            return;
        }

        lastWidth = window.innerWidth;
        apply();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
}

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Sui-style shuffle/scramble on hover — characters cycle then settle.
 */
export function useScrambleText(text, { active = false, duration = 420 } = {}) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    if (!active) {
      setDisplay(text);
      return undefined;
    }

    startRef.current = performance.now();
    const chars = text.split("");

    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const settle = Math.floor(t * chars.length);

      setDisplay(
        chars
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < settle) return ch;
            return GLYPHS[(Math.random() * GLYPHS.length) | 0];
          })
          .join(""),
      );

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, text, duration]);

  return display;
}

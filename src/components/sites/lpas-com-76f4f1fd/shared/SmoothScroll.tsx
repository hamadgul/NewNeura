"use client";

import Lenis from "lenis";
import { useEffect } from "react";

declare global {
  interface Window {
    /**
     * Our Lenis instance. Deliberately NOT `window.lenis` — the lenis package
     * already declares that global (readonly, and for feature detection), so
     * reusing the name collides with its own type.
     */
    __lpasLenis?: Lenis;
  }
}

/**
 * Mounts Lenis, which lpas.com uses for its scroll feel.
 *
 * This is not a nicety — native scrolling next to the original is immediately
 * distinguishable, and the pinned hero was tuned against Lenis's easing. The
 * instance is published on `window.lenis` because the footer's "Back to top"
 * has to scroll through Lenis rather than `window.scrollTo`; running both at
 * once makes them fight over scroll position.
 *
 * Disabled entirely under `prefers-reduced-motion: reduce`, where hijacking
 * scroll is exactly the wrong thing to do.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });
    window.__lpasLenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.__lpasLenis = undefined;
    };
  }, []);

  return null;
}

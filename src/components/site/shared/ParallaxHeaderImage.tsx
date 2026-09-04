"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * The section header's photograph, drifting against the page as it scrolls.
 *
 * The band is `overflow: hidden` and the image is 115% of its height anchored
 * to the top, which leaves 95px of slack — the geometry was already here, and
 * nothing ever moved it, so the picture sat dead in a frame built to let it
 * travel. Measured on the source's market header at 1440x900:
 *
 *   scrollY    0    150   300   450   600   750   900  1050  1200
 *   translateY 0    -10   -20   -30   -40   -50   -60   -70   -72
 *
 * A straight `-scrollY / 15`, running until the band leaves the viewport. The
 * image moves up at a fifteenth of the page's speed, so against the page it
 * reads as sinking — which is the "header image should go down as the user
 * scrolls down" of the report.
 */

/*
  DELIBERATE DIVERGENCE. The source's rate is `scrollY / 15`, measured and
  reproduced first; the user's verdict was "it moves abit slow, make it more
  apperent."

  Doubled to `/ 7.5`. On its own that would finish the travel at scrollY 712 —
  the image would stop dead while the band still had 400px of on-screen life,
  which reads worse than slow. So the band's slack went up to match: the image
  is 124% of the band rather than 115%, giving ~150px to cover instead of 95,
  and at the doubled rate it now runs out just as the band leaves the viewport
  (~1125 against the band's exit at ~1130). Twice the movement, over the whole
  time it is visible.
*/
const SCROLL_DIVISOR = 7.5;

interface ParallaxHeaderImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ParallaxHeaderImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = "100vw",
  priority,
}: ParallaxHeaderImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const band = el?.parentElement;
    if (!el || !band) return;

    if (reduceMotion) {
      el.style.transform = "";
      return;
    }

    const sync = () => {
      // The slack is whatever the image overflows its band by. Reading it
      // rather than hard-coding 95px keeps this honest if the 115% changes.
      const slack = Math.max(0, el.offsetHeight - band.clientHeight);
      const bandTop = band.getBoundingClientRect().top + window.scrollY;
      const travelled = Math.max(0, window.scrollY - (bandTop - band.offsetTop));
      const offset = Math.min(travelled / SCROLL_DIVISOR, slack);
      el.style.transform = offset < 0.5 ? "" : `translate3d(0, ${-offset.toFixed(2)}px, 0)`;
    };

    sync();
    // Lenis emits `scroll` once per frame, so this is already frame-rate.
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      el.style.transform = "";
    };
  }, [reduceMotion]);

  return (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}

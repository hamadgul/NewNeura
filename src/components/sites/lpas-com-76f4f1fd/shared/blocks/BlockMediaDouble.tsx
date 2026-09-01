"use client";

/**
 * `BlockMediaDouble` — a wide image bleeding off the right edge with a narrower
 * one beside it. 2 instances, both on the project detail page, 657px tall.
 *
 * Measured geometry (grid line numbers are `.lpas-grid`'s: 1 = full-start,
 * 2 = main-start, then one line per column, `main-end`, full-end):
 *
 *   1440  big  cols 8 / full-end  (985px)   small cols 2 / 8  (395px)  row 1
 *    768  big  cols 6 / full-end  (495px)   small cols 2 / 6  (223px)  row 1
 *    390  big  full-start/full-end (390px)  small cols 4 / main-end (165px)
 *              row 1                              row 2, +15px above it
 *
 * So the two sit side by side from 768 up — the big one always running off the
 * right edge of the page — and stack at 390 with the small image tucked under
 * the big one's right-hand half.
 *
 * Two details worth spelling out:
 *
 *  - At 1440 the small figure is `position: sticky; top: 450px` inside its
 *    657px-tall grid area, so it lags ~177px behind the big image while the
 *    section scrolls past. Only 1440 was measured, but 768 lays the block out
 *    identically (side by side, small shorter than the row), so the sticky is
 *    kept from `md` up and dropped once the two stack.
 *  - At 390 the source spans the big figure across rows 1-2 and the small
 *    across rows 2-3 with subgrid inside. The extra spans are empty, and the
 *    measured tracks (260.078 / 215.578 / 0) are exactly "big image height"
 *    then "small image height + 15px". Giving each figure a single row
 *    reproduces those tracks without the subgrid indirection — and *with* the
 *    spans, grid would instead split each figure's height across the two
 *    tracks it covers and drift ~20px.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { REVEAL_OBSERVER_INIT } from "../reveal";

export interface BlockMediaDoubleImage {
  /** Local asset path, e.g. `/sites/lpas-com-76f4f1fd/<page-key>/images/<file>.webp`. */
  src: string;
  /** Both source instances ship `alt=""` — these are decorative. */
  alt: string;
  /** Intrinsic size; the ratio drives each figure's height at every breakpoint. */
  width: number;
  height: number;
}

export interface BlockMediaDoubleProps {
  /** The wide image. Bleeds past the right page edge above 768, full-bleed below. */
  large: BlockMediaDoubleImage;
  /** The narrow image. Left column and sticky above 768, below-right when stacked. */
  small: BlockMediaDoubleImage;
  /** Extra placement/spacing classes from the page that assembles the block. */
  className?: string;
}

export function BlockMediaDouble({ large, small, className }: BlockMediaDoubleProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isRevealed = revealed || reduceMotion;

  useEffect(() => {
    // Observe the SECTION, never the `.lpas-image-reveal` wrapper: that wrapper
    // starts at `clip-path: inset(100% 0 0)`, which collapses its visible area
    // to nothing, so IntersectionObserver reports ratio 0 forever and the wipe
    // can never fire — the images would stay permanently blank.
    const node = sectionRef.current;
    if (!node) return;

    // Reduced motion renders the end state on the first paint; nothing to watch.
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          // One-shot, like every other reveal on the site.
          observer.disconnect();
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  // The wipe lives on the image *container* (which shares the image's exact
  // box) rather than the `<img>`, matching `ImageCard` and keeping the clipped
  // element separate from anything that might animate a transform later.
  const revealClass = cn("w-full overflow-hidden lpas-image-reveal", isRevealed && "is-revealed");

  return (
    <section
      ref={sectionRef}
      className={cn("blockMediaDouble lpas-grid my-[100px] xl:my-[120px]", className)}
    >
      <figure
        className={cn(
          "blockMediaDouble__imageFigure blockMediaDouble__imageFigure--big",
          "col-start-[full-start] col-end-[full-end] row-start-1 flex flex-col",
          "md:col-start-[6] xl:col-start-[8]",
        )}
      >
        <div
          className={cn(
            "blockMediaDouble__imageContainer blockMediaDouble__imageContainer--big",
            revealClass,
          )}
        >
          <Image
            src={large.src}
            alt={large.alt}
            width={large.width}
            height={large.height}
            sizes="(min-width: 1280px) 985px, (min-width: 768px) 495px, 100vw"
            className="image h-auto w-full object-cover"
          />
        </div>
      </figure>

      <figure
        className={cn(
          "blockMediaDouble__imageFigure blockMediaDouble__imageFigure--small",
          // 390: right-hand half of the main area, 15px below the big image.
          "col-start-[4] col-end-[main-end] row-start-2 mt-[15px] flex flex-col",
          // 768+: left column, top-aligned so the sticky offset has room to run.
          "md:sticky md:top-[450px] md:col-start-[2] md:col-end-[6] md:row-start-1 md:mt-0 md:self-start",
          "xl:col-end-[8]",
        )}
      >
        <div
          className={cn(
            "blockMediaDouble__imageContainer blockMediaDouble__imageContainer--small",
            revealClass,
          )}
        >
          <Image
            src={small.src}
            alt={small.alt}
            width={small.width}
            height={small.height}
            sizes="(min-width: 1280px) 395px, (min-width: 768px) 223px, 165px"
            className="image h-auto w-full object-cover"
          />
        </div>
      </figure>
    </section>
  );
}

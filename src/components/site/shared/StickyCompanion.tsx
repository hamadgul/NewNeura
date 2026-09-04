"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The lag on the small cards beside a large one: they pin while their row
 * scrolls past, so the column appears to slide down against the big card
 * instead of travelling with it.
 *
 * The source does this with `position: sticky` and a `top` it writes from JS.
 * The offset is not a constant — measured on both the source's home and
 * portfolio pages, at five viewport sizes each:
 *
 *   top + cardHeight = 0.85 x viewport height     (exactly, every time)
 *
 * i.e. the card's BOTTOM edge pins at 85% of the viewport height, so a shorter
 * viewport pins it higher up the page. `top: 505px` is only that value at
 * 1440x900, which is where it was first measured.
 *
 * It cannot be written in CSS. A percentage `top` resolves against the
 * containing block — the tall wrapper — not the card, and moving the card into
 * a box of its own height would leave sticky with no room to travel, since a
 * sticky box can only move inside its containing block. So the height is
 * measured, and re-measured on resize.
 *
 * Below 992px the source turns the whole thing off (measured: `static` at 950,
 * `sticky` at 992). The wrapper hugs its content at those widths, so there is
 * nothing to travel through anyway.
 */

/** Fraction of the viewport height at which the card's bottom edge pins. */
const BOTTOM_FRACTION = 0.85;
/** Below this the source drops back to a plain, unpinned card. */
const STICKY_MIN_WIDTH = 992;

export function StickyCompanion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = () => {
      if (window.innerWidth < STICKY_MIN_WIDTH) {
        setTop(null);
        return;
      }
      // `offsetHeight` and not the sticky-adjusted rect: this reads the card's
      // own height, which is what the offset is measured against.
      setTop(window.innerHeight * BOTTOM_FRACTION - el.offsetHeight);
    };

    sync();
    // The card's height follows its image and its caption's wrap, so a plain
    // resize listener is not enough — a caption going from one line to two
    // changes the offset without changing the viewport.
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "min-w-0 flex-1",
        // `self-start` is what leaves room to travel: stretched to the
        // wrapper's full height the card would fill it and sticky would have
        // nowhere to go.
        "min-[992px]:sticky min-[992px]:self-start",
        className,
      )}
      style={top === null ? undefined : { top }}
    >
      {children}
    </div>
  );
}

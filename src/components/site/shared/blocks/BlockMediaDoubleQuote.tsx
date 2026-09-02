"use client";

/**
 * `BlockMediaDoubleQuote` — a tall media panel on the left, a smaller one top
 * right, and a pull-quote under the small one. 3 instances: about (645px, whose
 * large slot is a looping `<video>`, not an image) and the project detail page
 * (1359px and 854px; only the 854px one carries quote text).
 *
 * Measured grid placement (`.ng-grid` line numbers):
 *
 *          big media               small media              quote
 *   1440   cols 2/13,  rows 2/5    cols 14/main-end, 1/3    cols 14/main-end, row 3
 *    768   cols 2/main-end, row 3  cols 2/10,        row 1   cols 2/10, row 2
 *    390   cols 2/main-end, row 3  cols 2/4,         row 1   cols 2/main-end, row 2
 *
 * Row sizing at 1440 is the interesting part. Rows 1 and 2 are always exactly
 * equal (226.875/226.891, 260.344/260.344, 226.719/226.719) and always sum to
 * `small media height + 100`: the small figure spans both auto tracks and grid
 * splits its outer height evenly between them. The upshot is that the big media
 * starts at the vertical midpoint of the small one plus its 100px gap — that
 * relationship, not a fixed offset, is what the layout has to preserve.
 *
 * The big figure is therefore reproduced structurally rather than approximated:
 * at `xl` it is a subgrid spanning rows 2-5 with its media container pinned to
 * the first two of those tracks, exactly as the source does it. Collapsing that
 * to a plain 2-row span changes how grid distributes the figure's height across
 * the tracks it covers and pushes the section ~18px taller.
 *
 * The 100px gap under the small media moves between breakpoints. At 1440 it is
 * `margin-bottom` on the small figure (rows 1+2 = media + 100). When the block
 * stacks, row 1 is exactly the media height and row 2 is `quote height + 100`,
 * so the gap rides on the blockquote instead. The blockquote is rendered even
 * when there is no quote text — the source does, and its 100px spacer is load
 * bearing for the two instances that have no quote.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { REVEAL_OBSERVER_INIT } from "../reveal";

export interface BlockMediaDoubleQuoteImage {
  type: "image";
  /** Local asset path, e.g. `/site/images/<file>.webp`. */
  src: string;
  /** Every source instance ships `alt=""` — these are decorative. */
  alt: string;
  /** Intrinsic size; the ratio drives the figure's height. */
  width: number;
  height: number;
}

export interface BlockMediaDoubleQuoteVideo {
  type: "video";
  /** Local asset path, e.g. `/site/videos/<file>.mp4`. */
  src: string;
  /** Local poster path; painted until the first frame decodes. */
  poster?: string;
  /** Intrinsic size — 1920x1080 for the about instance. Reserves the box. */
  width: number;
  height: number;
  /** All three default to the source's measured `true`. */
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export type BlockMediaDoubleQuoteMedia = BlockMediaDoubleQuoteImage | BlockMediaDoubleQuoteVideo;

export interface BlockMediaDoubleQuoteProps {
  /** Tall media on the left (bottom when stacked). The about instance is a video. */
  large: BlockMediaDoubleQuoteMedia;
  /** Smaller media, top right (top when stacked). */
  small: BlockMediaDoubleQuoteMedia;
  /**
   * Pull-quote, verbatim and including the source's own quotation marks — e.g.
   * `"The open floor area allows abundant natural light to filter through …"`.
   * Omitted on the about and 1359px project instances.
   */
  quote?: string;
  /** Extra placement/spacing classes from the page that assembles the block. */
  className?: string;
}

/** `sizes` hints per slot, matching the measured column widths. */
const LARGE_SIZES = "(min-width: 1280px) 733px, (min-width: 768px) 688px, calc(100vw - 50px)";
const SMALL_SIZES = "(min-width: 1280px) 530px, (min-width: 768px) 455px, 165px";

interface MediaFrameProps {
  media: BlockMediaDoubleQuoteMedia;
  sizes: string;
  /** Layout classes for the `__imageContainer` box. */
  className: string;
  /** Wipe classes — applied to images only; see below. */
  revealClassName: string;
}

function MediaFrame({ media, sizes, className, revealClassName }: MediaFrameProps) {
  if (media.type === "video") {
    return (
      // The source's `<video>` carries `object-fit: cover` but no `clip-path`,
      // so it is the one piece of media here that is not wiped in. The explicit
      // aspect-ratio replaces the intrinsic sizing an `<img>` gets for free and
      // keeps the grid rows stable before metadata loads.
      <div
        className={cn(className, "overflow-hidden")}
        style={{ aspectRatio: `${media.width} / ${media.height}` }}
      >
        <video
          src={media.src}
          poster={media.poster}
          autoPlay={media.autoPlay ?? true}
          loop={media.loop ?? true}
          muted={media.muted ?? true}
          // Required alongside `muted` for autoplay to start on iOS Safari.
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={cn(className, revealClassName)}>
      <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        className="image h-auto w-full object-cover"
      />
    </div>
  );
}

export function BlockMediaDoubleQuote({
  large,
  small,
  quote,
  className,
}: BlockMediaDoubleQuoteProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isRevealed = revealed || reduceMotion;

  useEffect(() => {
    // Observe the block root, never the `.ng-image-reveal` container: that
    // container starts at `clip-path: inset(100% 0 0)`, so its visible area is
    // zero, IntersectionObserver reports ratio 0 forever, and the wipe would
    // never fire — leaving the images permanently blank.
    const node = rootRef.current;
    if (!node) return;

    // Reduced motion paints the end state immediately; nothing to watch for.
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

  const revealClass = cn("ng-image-reveal", isRevealed && "is-revealed");

  return (
    <div
      ref={rootRef}
      className={cn(
        "blockMediaDoubleQuote ng-grid my-[100px] text-[#111111] xl:my-[120px]",
        className,
      )}
    >
      <figure
        className={cn(
          "blockMediaDoubleQuote__imageFigure blockMediaDoubleQuote__imageFigure--big",
          "col-start-[main-start] col-end-[main-end] row-start-3 flex flex-col",
          // See the header note: the subgrid span is what makes rows 3 and 4
          // resolve the way the source's do.
          "xl:col-start-[2] xl:col-end-[13] xl:row-start-2 xl:row-end-5 xl:grid xl:grid-cols-subgrid xl:grid-rows-subgrid",
        )}
      >
        <MediaFrame
          media={large}
          sizes={LARGE_SIZES}
          // `col-span-full` / `row-start-1 row-end-3` are inert while the figure
          // is a flex column and only bite once it becomes the xl subgrid.
          className="blockMediaDoubleQuote__imageContainer blockMediaDoubleQuote__imageContainer--big w-full overflow-hidden xl:col-span-full xl:row-start-1 xl:row-end-3"
          revealClassName={revealClass}
        />
      </figure>

      <figure
        className={cn(
          "blockMediaDoubleQuote__imageFigure blockMediaDoubleQuote__imageFigure--small",
          "col-start-[main-start] col-end-[4] row-start-1 flex flex-col",
          "md:col-end-[10]",
          // The 100px gap is the small figure's own margin only once the block
          // is side by side; when stacked it belongs to the blockquote instead.
          "xl:col-start-[14] xl:col-end-[main-end] xl:row-start-1 xl:row-end-3 xl:mb-[100px]",
        )}
      >
        <MediaFrame
          media={small}
          sizes={SMALL_SIZES}
          className="blockMediaDoubleQuote__imageContainer blockMediaDoubleQuote__imageContainer--small w-full overflow-hidden"
          revealClassName={revealClass}
        />
      </figure>

      {/* Always rendered, even with no text: the stacked layouts rely on this
          element's 100px bottom margin for the gap above the big media. */}
      <blockquote
        className={cn(
          "blockMediaDoubleQuote__qoute font-M",
          "col-start-[main-start] col-end-[main-end] row-start-2 mb-[100px]",
          "md:col-end-[10]",
          "xl:col-start-[14] xl:col-end-[main-end] xl:row-start-3 xl:mb-0",
        )}
      >
        {quote}
      </blockquote>
    </div>
  );
}

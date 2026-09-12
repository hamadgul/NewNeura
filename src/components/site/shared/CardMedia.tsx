"use client";

/**
 * The media element inside a project card — a still, or a loop when the card
 * has one.
 *
 * Four surfaces show the same project cards (`home/ImageCard`,
 * `BlockProjectsHighlight`'s notched tile and its `layoutFive` banner, and
 * `CollectionProjects`' feed card), and before this they each inlined their own
 * `<Image>`. Adding video to one of them converted exactly one surface, which
 * is how the homepage tile ended up moving while "Where this shipped" and the
 * Work tab did not.
 */
import Image from "next/image";

/**
 * `sizes` for the project-card surfaces, shared because they share `ImageCard`.
 *
 * WHY THESE HAVE TO EXIST: a `next/image` with `width`/`height` and NO `sizes`
 * does not get a viewport-aware `srcset` at all. Next falls back to DPR
 * descriptors (`1x`/`2x`) keyed off the DECLARED width, so the browser picks
 * by device pixel ratio and never looks at how wide the card actually is.
 * These cards declare ~1200px files, so a phone at DPR 2.625 took the `2x`
 * candidate and asked the optimiser for `w=3840` — measured on `/` and
 * `/services/applied-ai/` before this change.
 *
 * Fitted to the cards' measured widths (DPR 1; `sizes` describes CSS layout
 * width). Taken off the built page at fourteen viewport widths on `/`,
 * `/services/applied-ai/` and `/services/web-development/`, and each band
 * carries the WIDEST value any of those routes produced — `layoutOne`'s tile
 * on a service page is 688px at 768 where the homepage's is 572px, and a
 * `sizes` that fits only the narrower one makes the wider one fetch a
 * derivative too small and go soft. Over-fetching is the cheaper mistake, so
 * every clause is rounded up:
 *
 *            393  480  767  768   960  1024  1279 | 1280  1440  1919  1920+
 *   large    343  430  650  688   880   944  1199 |  590   665   908    908
 *   small    343  430  650  339   435   467   595 |  290   328   449    449
 *   five     343  430  650  688   880   944  1199 | 1190  1340  1789   1790
 *   as vw    87%  90%  85%  90%   92%   92%   94% |  46%   46%   47%      -
 *
 * The layout re-columns at exactly 1280 (measured: 1279 -> 1199px, 1280 ->
 * 590px) and stops growing at 1920, where the content column caps — hence the
 * fixed px clause at the top instead of a `vw` that would keep climbing on a
 * 2560 display.
 */
export const CARD_SIZES = {
  /** The `aspect-[665/415.63]` tile. */
  large: "(min-width: 1920px) 908px, (min-width: 1280px) 47vw, (min-width: 768px) 94vw, 90vw",
  /** The `aspect-[328/205]` tile — two of them share a row from 768 up. */
  small: "(min-width: 1920px) 449px, (min-width: 1280px) 24vw, (min-width: 768px) 47vw, 90vw",
  /** `layoutFive`'s full-bleed banner, which keeps its intrinsic ratio. */
  fullBleed: "(min-width: 1920px) 1790px, (min-width: 768px) 94vw, 90vw",
} as const;

export interface CardMediaSource {
  image: { src: string; alt: string; width: number; height: number };
  /** When present, played in place of `image`. `image` is its poster. */
  video?: { src: string };
}

/**
 * Style for the element that WRAPS `CardMedia`, painting the poster underneath
 * a playing video.
 *
 * At every loop point `readyState` drops to 1 (HAVE_METADATA) for a frame or
 * more while the decoder rewinds, and an element with no current frame paints
 * nothing — so whatever is behind it blinks through. On this site that is a
 * white page, which is the "white flash stutter" reported on the homepage.
 * Sampled every animation frame across a wrap:
 *
 *   t=3 rs=4 | t=3 rs=4 | t=0 rs=1 | t=0.037 rs=4
 *
 * The `poster` attribute does NOT cover this: a poster is painted before
 * playback begins, not during a gap mid-playback. A background on the wrapper
 * is always there, so the gap reveals a still of the same frame instead.
 *
 * Costs no extra request — it is the same URL `poster` already fetches. Returns
 * `undefined` for a still card, which would otherwise paint a second copy of
 * its own picture for nothing.
 */
export function posterBackdrop(media: CardMediaSource) {
  if (!media.video) return undefined;
  return {
    backgroundImage: `url(${media.image.src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  } as const;
}

interface CardMediaProps {
  media: CardMediaSource;
  /** Applied to whichever element renders, so hover/scale classes still land. */
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function CardMedia({ media, className, sizes, priority }: CardMediaProps) {
  if (media.video) {
    return (
      <video
        src={media.video.src}
        poster={media.image.src}
        autoPlay
        loop
        muted
        // Required alongside `muted` for autoplay to start on iOS Safari.
        playsInline
        // A <video> has no alt; this is what carries the description a card's
        // still would have supplied.
        aria-label={media.image.alt}
        // Only binds where the wrapper does not already fix both dimensions —
        // `layoutFive`, whose banner is `h-auto`. Everywhere else `h-full`
        // wins and this is inert.
        style={{ aspectRatio: `${media.image.width} / ${media.image.height}` }}
        className={className}
      />
    );
  }

  return (
    <Image
      src={media.image.src}
      alt={media.image.alt}
      width={media.image.width}
      height={media.image.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

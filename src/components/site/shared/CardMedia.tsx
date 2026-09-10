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

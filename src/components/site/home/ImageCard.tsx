"use client";

/**
 * A single project tile used by `BlockProjectsHighlight`'s two mirrored rows.
 *
 * Two independent animations live on this card and are deliberately kept on
 * separate elements so they never fight:
 *  - The scroll reveal (`.ng-image-reveal`) is a one-shot clip-path wipe
 *    driven by an IntersectionObserver, at a slow 1.2s ease. It lives on the
 *    OUTER image wrapper.
 *  - The hover zoom is a fast 0.3s linear scale that can replay indefinitely.
 *    It lives on the INNER `<img>` itself.
 *  If both transforms shared one element, the hover's `scale(1.04)` would
 *  collide with the reveal's `scale(1.02 -> 1)` transition (different
 *  durations/easings racing on the same `transform` property), producing a
 *  visible stutter whenever a visitor hovers before the reveal settles.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ProjectCard } from "@/types/site";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { REVEAL_OBSERVER_INIT } from "../shared/reveal";

interface ImageCardProps {
  project: ProjectCard;
  /** Grid/flex placement supplied by the parent layout (span, order, etc). */
  className?: string;
}

export function ImageCard({ project, className }: ImageCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isRevealed = revealed || reduceMotion;

  useEffect(() => {
    // Observe the card, NOT the image wrapper. The wrapper starts at
    // `clip-path: inset(100%)`, which collapses its visible area to zero —
    // IntersectionObserver then reports ratio 0 forever and the reveal can
    // never fire, leaving every project image permanently invisible.
    const node = cardRef.current;
    if (!node) return;

    // Under reduced motion the card renders revealed from the start, so
    // there is nothing to observe for.
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          // One-shot: the reveal never plays again once a card has entered.
          observer.disconnect();
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const isLarge = project.size === "large";

  return (
    // Large-tile grid placement (`col-span-*`) is decided by the parent layout,
    // not here, since the two rows mirror the large tile's position; small
    // tiles always sit side-by-side in a flex wrapper, so `flex-1` is a safe
    // default for them regardless of which row renders this card.
    <a
      ref={cardRef}
      href={project.href}
      className={cn("imageCard group flex flex-col", !isLarge && "flex-1", className)}
    >
      <div
        className={cn(
          "imageCard__imageWrapper ng-image-reveal flex items-center justify-center overflow-hidden",
          isLarge ? "aspect-[665/415.63]" : "aspect-[328/205]",
          isRevealed && "is-revealed",
        )}
      >
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          className="imageCard__image h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="imageCard__textWrap mt-[15px] flex flex-col gap-[2px]">
        {/*
          `min-h`, not a fixed height: the source's title box is content-driven.
          A one-line title is 21.59px; a title that wraps is 43.19px. A fixed
          `h-[22px]` (which the homepage never exposes, since every title there
          is one line) clipped the second line off on every page with a long
          project name.
        */}
        {/*
          A heading, not a `<p>`. Tailwind's Preflight resets h1-h6 to
          `font-size: inherit; font-weight: inherit` and zeroes their margins,
          so this renders pixel-identically — but a crawler and a screen
          reader's heading list now see the project names as the structure of
          the section rather than as loose text. The section's own title is the `<h2>`, so a card is an `<h3>`.
        */}
        <h3 className="imageCard__title min-h-[22px] overflow-hidden text-[#111111] leading-[21.6px]">
          {project.title}
        </h3>
        <p className="imageCard__location font-XS text-[#747474]">{project.location}</p>
      </div>
    </a>
  );
}

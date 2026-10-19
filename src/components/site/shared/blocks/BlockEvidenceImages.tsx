"use client";

/**
 * `BlockEvidenceImages` — the screenshot(s) that prove the `BlockWysiwyg`
 * directly above it, set in the main column right under that text.
 *
 * Why not the blocks already here: `BlockImageFull` bleeds to the viewport
 * edges, which suits a photograph and drowns a search-results capture, and
 * `BlockMediaDoubleQuote` staggers a large frame low-left against a small one
 * top-right. With a portrait phone capture in the small slot that pushed the
 * large frame ~900px below the text it belonged to (user report, 2026-10-19:
 * "it should be under the relevent text"). Here one image spans the main
 * column, and two sit side by side from `md`, top-aligned, stacked below it.
 *
 * Motion, both borrowed from the rest of the site:
 *   - the `.ng-image-reveal` wipe (clip-path + scale, 1.2s) fires once when the
 *     block crosses the shared 75% line, like `BlockMediaDoubleQuote`'s;
 *   - each image drifts inside its frame as the frame crosses the viewport, the
 *     same idea as `ParallaxHeaderImage` ("the image moves with the scroll").
 *     The frame shows `VISIBLE` of the image's height; the rest is the travel,
 *     spent from frame-enters-bottom to frame-leaves-top, so a reader scrolling
 *     past sees the capture from its top edge to its bottom edge.
 *
 * Reduced motion: no wipe, no drift, and the frame shows the whole image.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { REVEAL_OBSERVER_INIT } from "../reveal";

/** Share of the image's height the frame shows; the remainder is the drift. */
const VISIBLE = 0.9;

export interface BlockEvidenceImage {
  /** Local asset path, e.g. `/site/images/<file>.jpg`. */
  src: string;
  /** These are evidence, not decoration: the alt says what the capture shows. */
  alt: string;
  /** Intrinsic size; the ratio drives the frame's height. */
  width: number;
  height: number;
}

export interface BlockEvidenceImagesProps {
  /** One image spans the column; two sit side by side from `md`. */
  images: [BlockEvidenceImage] | [BlockEvidenceImage, BlockEvidenceImage];
  /** Optional line under the images. */
  caption?: string;
  /** Opt in for an instance near the fold; the rest stay lazy. */
  priority?: boolean;
  className?: string;
}

export function BlockEvidenceImages({
  images,
  caption,
  priority = false,
  className,
}: BlockEvidenceImagesProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isRevealed = revealed || reduceMotion;
  const pair = images.length === 2;

  // The wipe. Observe the root, never the clipped frame: its visible area is
  // zero until revealed, so it would never intersect.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || reduceMotion) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, REVEAL_OBSERVER_INIT);
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  // The drift. One listener for the block; each frame reads its own rect.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const imgs = Array.from(root.querySelectorAll<HTMLImageElement>(".blockEvidenceImages__image"));

    if (reduceMotion) {
      imgs.forEach((img) => (img.style.transform = ""));
      return;
    }

    const sync = () => {
      const vh = window.innerHeight;
      for (const img of imgs) {
        const frame = img.parentElement;
        if (!frame) continue;
        const rect = frame.getBoundingClientRect();
        if (rect.bottom < -50 || rect.top > vh + 50) continue;
        const slack = Math.max(0, img.offsetHeight - frame.clientHeight);
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
        img.style.transform = `translate3d(0, ${(-slack * progress).toFixed(2)}px, 0)`;
      }
    };

    sync();
    // Lenis emits `scroll` once per frame, so this is already frame-rate.
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      imgs.forEach((img) => (img.style.transform = ""));
    };
  }, [reduceMotion]);

  return (
    <div
      ref={rootRef}
      className={cn(
        // The text block above already ends on its own 50/60px margin, so the
        // top here is small: the images read as that text's figure.
        "blockEvidenceImages ng-grid mt-[20px] mb-[100px] xl:mb-[120px]",
        className,
      )}
    >
      <figure className="col-start-[main-start] col-end-[main-end]">
        <div className={cn("grid items-start gap-[20px]", pair && "md:grid-cols-2")}>
          {images.map((image) => (
            <div
              key={image.src}
              className={cn(
                // The hairline keeps a white-background capture (a Google
                // results page) from dissolving into the white page.
                "blockEvidenceImages__frame relative w-full overflow-hidden border border-[#e2e2e2]",
                "ng-image-reveal",
                isRevealed && "is-revealed",
              )}
              style={{
                aspectRatio: reduceMotion
                  ? `${image.width} / ${image.height}`
                  : `${image.width} / ${(image.height * VISIBLE).toFixed(2)}`,
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes={pair ? "(min-width: 768px) 46vw, 100vw" : "(min-width: 768px) 92vw, 100vw"}
                priority={priority}
                className="blockEvidenceImages__image block h-auto w-full will-change-transform"
              />
            </div>
          ))}
        </div>
        {caption ? (
          <figcaption className="font-XS mt-[15px] text-[#747474]">{caption}</figcaption>
        ) : null}
      </figure>
    </div>
  );
}

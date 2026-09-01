/**
 * `BlockImageFull` — one edge-to-edge image, no text.
 *
 * Used 4x across the clone: culture (673px tall at 1440) and three instances on
 * the project detail page (809 / 1003 / 960px). Diffing those heights against
 * the measurements at 1440 / 768 / 390 shows the height is *not* a per-instance
 * constant — it is purely the image's own aspect ratio applied to the viewport:
 *
 *   culture     673.188/1440 = 359.031/768 = 182.312/390 = 0.46749  (1600x748)
 *   project #1  809.094/1440 = 431.516/768 = 219.125/390 = 0.56187  (1600x899)
 *   project #2 1002.590/1440 = 534.719/768 = 271.531/390 = 0.69624  (1600x1114)
 *
 * So there is no `height` prop: the intrinsic `width`/`height` of the image own
 * the block's height at every breakpoint, and `h-auto w-full` on the `<img>`
 * reproduces that without ever needing a hard-coded number.
 *
 * Note this block is deliberately *not* wrapped in `.lpas-image-reveal`. The
 * source's other media blocks carry `clip-path: inset(...)` plus the 1.2s wipe
 * on their `<img>`; the measured styles here show only lazysizes' own
 * `transition: opacity 0.3s` and no `clip-path` at all, so the full-bleed image
 * simply fades in. That also keeps this a server component.
 */
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BlockImageFullImage {
  /** Local asset path, e.g. `/sites/lpas-com-76f4f1fd/<page-key>/images/<file>.webp`. */
  src: string;
  /** Every instance on the source ships `alt=""` — these are decorative. */
  alt: string;
  /** Intrinsic size. The ratio of the two drives the block's height. */
  width: number;
  height: number;
}

export interface BlockImageFullProps {
  image: BlockImageFullImage;
  /** Opt in for an instance that lands above the fold; the rest stay lazy. */
  priority?: boolean;
  /** Extra placement/spacing classes from the page that assembles the block. */
  className?: string;
}

export function BlockImageFull({ image, priority = false, className }: BlockImageFullProps) {
  return (
    // Measured `margin: 120px 0` at 1440. Mobile/tablet run at 100px — derived
    // from the mobile screenshot's block offsets, and matching the 60/50 pair
    // the other blocks use for their smaller 60px desktop margin.
    <div className={cn("blockImageFull lpas-grid my-[100px] xl:my-[120px]", className)}>
      {/* `grid-column: 1 / -1` on the source — full-start to full-end, i.e. it
          swallows both gutters and bleeds to the viewport edges. */}
      <div className="blockImageFull__imageContainer col-start-[full-start] col-end-[full-end] w-full">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="100vw"
          priority={priority}
          className="blockImageFull__image h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}

/**
 * `BlockHeaderPortfolio` — the compact page header used by `/work/`.
 *
 * Unlike the taller grey `BlockHeaderGeneral`, this one is transparent: a
 * full-bleed image sits behind the whole block and every text layer is white
 * on top of it.
 *
 * Geometry (all measured, never estimated):
 *  - The block is `50vh` tall — 450px in the 1440×900 capture and 422px in the
 *    390×844 one — capped at the source's `max-height: 650px`.
 *  - The content layer is a column subgrid of `.ng-grid` with three rows:
 *    `1fr 27px 1fr` ≥768px, which resolves to exactly the measured
 *    `211.5px 27px 211.5px` at 1440×900.
 *  - Row 1 is empty, row 2 holds the two labels (vertically centred in the
 *    27px band), row 3 holds the title and the scroll chip, both bottom-aligned
 *    35px above the block's bottom edge.
 *
 * The block is static by design: the source's circular chip is a scroll-down
 * button, but no scroll or click behaviour belongs to this block, so it renders
 * as a decorative `asStatic` chip. The filter row visible directly beneath it on
 * both pages belongs to `CollectionProjects` / `CollectionPost`.
 */
import Image from "next/image";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { ButtonCircle } from "../buttons";
import { ArrowIcon } from "../icons";

export interface BlockHeaderPortfolioImage {
  /** Local path, e.g. `/site/images/foo.webp`. */
  src: string;
  /** The source ships this image decorative (`alt=""`). */
  alt?: string;
  /** Natural pixel size of the asset. */
  width: number;
  height: number;
}

export interface BlockHeaderPortfolioProps {
  /** Left-hand eyebrow — "Our Work" / "Stay in the know". Cased as authored. */
  eyebrow: string;
  /**
   * Right-hand label — "Overview" / "inspiration and knowledge". The source
   * lowercases it and re-capitalises the first letter, so either casing in
   * equals the same rendering out.
   */
  label: string;
  /**
   * The `<h1>`. The source hard-breaks it with `<br>` rather than relying on
   * wrapping (`/latest/` is `Latest` + `Updates`, and "Latest Updates" would
   * still fit its column at 390px), so pass one string per rendered line.
   */
  title: string | readonly string[];
  /** The full-bleed backdrop. Both pages ship one; paths differ per page. */
  image: BlockHeaderPortfolioImage;
  /** This image is the page's LCP element on both pages. */
  priority?: boolean;
  className?: string;
}

export function BlockHeaderPortfolio({
  eyebrow,
  label,
  title,
  image,
  priority = true,
  className,
}: BlockHeaderPortfolioProps) {
  const lines = typeof title === "string" ? [title] : title;

  return (
    <header
      data-control="BlockHeaderPortfolio"
      className={cn("blockHeaderPortfolio ng-grid", className)}
    >
      {/*
        `z-10` + `relative` reproduces the source's stacking context, which is
        what keeps the image layer's negative z-index behind the copy but still
        in front of the page background.

        Mobile rows: measured at 390×844 (block 422px tall) the label band sits
        at y=103, not at the `1fr 27px 1fr` midpoint — below 768px the first row
        is a fixed 103px and the title row simply takes the remainder.
      */}
      {/*
        EVERY child below carries an explicit `row-start`. Without one, auto
        placement pushed them past the image: the image is `grid-row: 1/-1`, so
        it occupies every column of all three explicit rows, no auto-placed item
        can fit in them, and the grid grows *implicit* rows underneath. Measured
        before the fix, `grid-template-rows` resolved to
        `109.5px 27px 109.5px 18.9px 185px` — five rows — leaving the image
        246px tall and the white `<h1>` sitting at y=265 on the page's white
        ground. The `/work/` title was invisible.
      */}
      <div className="blockHeaderPortfolio__content relative z-10 row-start-1 grid h-[50vh] max-h-[650px] grid-cols-subgrid grid-rows-[103px_27px_1fr] [grid-column:full-start/full-end] md:grid-rows-[1fr_27px_1fr]">
        <div className="blockHeaderPortfolio__image relative -z-10 overflow-hidden [grid-column:full-start/full-end] [grid-row:1/-1]">
          {/*
            The source renders the image at 110% × 110% anchored top-left and
            clips the overflow, so the visible crop is the top-left 91% of a
            cover fit — not a centred one. `max-w-none` is required because
            preflight's `img { max-width: 100% }` would otherwise cancel the
            110% width.
          */}
          <Image
            src={image.src}
            alt={image.alt ?? ""}
            width={image.width}
            height={image.height}
            priority={priority}
            sizes="100vw"
            className="image absolute left-0 top-0 h-[110%] w-[110%] max-w-none object-cover"
          />
          {/*
            Sampling the reference captures against the raw assets gives a flat
            0.50 multiplier on every channel across the whole block — a 50%
            black wash, not a gradient.
          */}
          <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
        </div>

        <span className="blockHeaderPortfolio__textLeft font-S row-start-2 block self-center text-white [grid-column:main-start/span_3]">
          {eyebrow}
        </span>

        {/*
          `justify-self-end` shrink-wraps the label so it hugs `main-end`; the
          source pairs `text-transform: lowercase` with an uppercase first
          letter, which is why "inspiration and knowledge" renders as
          "Inspiration and knowledge". Two main columns below 768px (165px) is
          what forces the two-line wrap seen in the 390px capture; three above.
        */}
        <span className="blockHeaderPortfolio__textRight font-S row-start-2 block self-center justify-self-end text-right lowercase text-white first-letter:uppercase [grid-column:span_2/main-end] md:[grid-column:span_3/main-end]">
          {label}
        </span>

        {/*
          `items-end` + `pb-[35px]`: the last baseline sits 35px above the row's
          bottom edge, which is also the block's bottom edge.
        */}
        <h1 className="blockHeaderPortfolio__title font-3XL row-start-3 flex items-end pb-[35px] text-white [grid-column:main-start/main-end] md:[grid-column:main-start/span_7]">
          <span className="block">
            {lines.map((line, index) => (
              <Fragment key={`${index}-${line}`}>
                {index > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </span>
        </h1>

        <div className="blockHeaderPortfolio__buttonWrapper row-start-3 mb-[35px] flex self-end justify-self-end [grid-column:span_1/main-end]">
          {/* The source rotates the shared 19px arrow 90° so it points down. */}
          <ButtonCircle
            asStatic
            color="white"
            label="Scroll down"
            icon={<ArrowIcon className="h-[19px] w-[19px] rotate-90" />}
          />
        </div>
      </div>
    </header>
  );
}

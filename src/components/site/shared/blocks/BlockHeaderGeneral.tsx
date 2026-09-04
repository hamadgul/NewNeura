/**
 * `BlockHeaderGeneral` — the page header shared by /about/ and /process/.
 *
 * Geometry is a 1:1 port of `getComputedStyle()` at 1440x720; every number
 * below is measured, not estimated.
 *
 * ── Desktop (>=1280px) ──────────────────────────────────────────────────
 * The block is `80vh` tall here (with a 600px floor), not a fixed 720px — 720
 * is simply 80% of the 900px extraction viewport. Measured across six
 * viewports: 1440x900 -> 720, 1440x1200 -> 960, 1440x700 -> 600 (the floor
 * clamping in, which is what keeps the children's `min-height: 600px` from
 * being dead code). Screenshotting at a taller viewport legitimately produces
 * a taller header; the `1fr` first row inside `__content` soaks up the extra.
 *
 * It is a `.ng-grid` (20 main columns of 57.5px + 10px gaps at
 * 1440). The source places its two children with named grid areas
 * (`left` / `right`); since `.ng-grid` publishes line names rather than
 * areas, the same pixels are reproduced with explicit numeric lines:
 *   line 1 = full-start, line 2 = main-start, line 22 = main-end,
 *   line 23 = full-end, so main column N starts at line N + 1.
 *   - `__content`      lines  2 → 12  = main cols 1-10 = 665px (measured 665)
 *   - `__imageWrapper` lines 12 → -1  = main col 11 → full-end = 715px  ✔
 *
 * `__content` is a subgrid of those 10 columns with rows `1fr auto auto`.
 * Only the first row is flexible, which is what makes both instances land
 * on the same total: about's rows measure 350.219 / 64.781 / 140 and
 * /process/'s 415 / 0 / 140 — different intro heights, identical 555px sum
 * (720 - 130 top padding - 35 bottom padding). Rows 2 and 3 are content
 * sized (intro; 65px margin + 75px h1), row 1 absorbs all the slack, which
 * is why the highlight box measures 330px tall while its content is ~194px.
 *
 * ── Tablet / mobile (<1280px) ───────────────────────────────────────────
 * From GRID_AREAS.json the block becomes two stacked rows at both 768 and
 * 390: `__content` on `main`, `__imageWrapper` bleeding to `full`. The
 * recorded row pair is 630px/450px at a 1080px-tall viewport and the 390px
 * reference screenshot measures 591px/422px — the same 7:5 split of a
 * different viewport height, so the rows are proportional. Measurement fixes
 * the total at `120vh` (not 100vh), making the rows exactly 70vh/50vh:
 * 0.7x900=630 / 0.5x900=450, and 0.7x844=590.8 / 0.5x844=422. Verified against the screenshot at 390:
 *   content 0→591, image 591→1013, image top edge at exactly y=591.
 * Padding also drops there — the highlight's top edge sits at y=100 and the
 * content box ends 25px under the title row, i.e. `100px 0 25px`. The
 * 600px `min-height` the spec records on `__content`/`__imageWrapper` is
 * NOT in force below 1280 (it would have forced 600 instead of the measured
 * 591), so it is applied under `xl:` only.
 *
 * Interaction: static. The only motion is `ButtonCircle`'s hover fill.
 */
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ButtonCircle } from "@/components/site/shared/buttons";
import { ArrowIcon } from "@/components/site/shared/icons";

export interface BlockHeaderGeneralImage {
  /** Local path under `/public`, e.g. `/site/images/<file>`. */
  src: string;
  /** Both source instances ship an empty alt — these images are decorative. */
  alt: string;
  width: number;
  height: number;
}

export interface BlockHeaderGeneralProps {
  /** `<h1>` text — "About" / "How we work". */
  title: string;
  /**
   * Body copy in the second row. Optional: /process/ renders the wrapper
   * empty, which collapses row 2 to 0px and hands its space to row 1.
   */
  intro?: string;
  /** Small notched image at the top of the left column (1.6:1 crop). */
  highlightImage: BlockHeaderGeneralImage;
  /** `.font-S` caption under the highlight image. */
  highlightCaption: string;
  /** Full-bleed portrait image filling the right column. */
  image: BlockHeaderGeneralImage;
  /** Target of the circular scroll button — usually an in-page anchor. */
  buttonHref?: string;
  buttonLabel?: string;
  className?: string;
}

/*
 * Grid placement uses arbitrary *properties* rather than `col-start-*` /
 * `col-end-*` so the negative line indices (`-1`, `-2`) survive Tailwind's
 * value parser verbatim — a silently dropped `-2` would push the title and
 * the button into the same track.
 */

export function BlockHeaderGeneral({
  title,
  intro,
  highlightImage,
  highlightCaption,
  image,
  buttonHref,
  buttonLabel = "Scroll to content",
  className,
}: BlockHeaderGeneralProps) {
  return (
    <header
      className={cn(
        // Height is viewport-relative but NOT 100vh, and the ratio changes at
        // the xl breakpoint. Measured on the live /about/ at six viewports:
        //   390x844  -> 1013px   768x900 -> 1080px   1279x900 -> 1080px  (120vh)
        //   1280x900 -> 720px    1440x1200 -> 960px  1440x700 -> 600px   (80vh, min 600)
        // Below xl the block is 120vh split 7fr/5fr, i.e. rows of exactly
        // 70vh/50vh (630/450 at 900; 590.8/422 at 844). At xl it collapses to a
        // single 80vh row with a 600px floor — which is what makes the children's
        // `xl:min-h-[600px]` live rather than dead code.
        "blockHeaderGeneral ng-grid mb-[100px] h-[120vh] grid-rows-[7fr_5fr]",
        "bg-[#ececec] text-[16px] leading-[21.6px] text-[#111111]",
        "xl:h-[80vh] xl:min-h-[600px] xl:grid-rows-[1fr]",
        className,
      )}
    >
      <div
        className={cn(
          "blockHeaderGeneral__content row-start-1 grid grid-cols-subgrid grid-rows-[1fr_auto_auto]",
          "[grid-column-start:2] [grid-column-end:-2]",
          "pt-[100px] pb-[25px]",
          "xl:[grid-column-end:12] xl:min-h-[600px] xl:pt-[130px] xl:pb-[35px]",
        )}
      >
        {/*
          Stretched by the `1fr` row, so the flex column keeps image + caption
          pinned to the top with the measured 30px gap between them. The
          170/300px min/max are what hold the box at 170px wide below 1280,
          where three subgrid columns would otherwise be narrower (768) or
          much wider (390).
        */}
        <div
          className={cn(
            "blockHeaderGeneral__highlight row-start-1 flex min-w-[170px] max-w-[300px] flex-col gap-[30px] pb-[20px] text-[#595656]",
            "[grid-column-start:1] [grid-column-end:3]",
            "md:[grid-column-end:4]",
          )}
        >
          <Image
            src={highlightImage.src}
            alt={highlightImage.alt}
            width={highlightImage.width}
            height={highlightImage.height}
            sizes="(min-width: 1280px) 193px, 170px"
            /* The notch: the bottom-right corner is chamfered by 20px. */
            className="blockHeaderGeneral__highlightImage h-auto w-full object-cover [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_20px),calc(100%_-_20px)_100%,0_100%)]"
          />
          <span className="blockHeaderGeneral__highlightText font-S block">
            {highlightCaption}
          </span>
        </div>

        {/*
          Always rendered, even when empty: the source keeps the wrapper so
          row 2 exists and the title row stays anchored to the bottom of the
          content box (this is the whole difference between the about and
          /process/ row tracks).
        */}
        <div
          className={cn(
            "blockHeaderGeneral__intro row-start-2",
            "[grid-column-start:1] [grid-column-end:-1] xs:[grid-column-start:3]",
            "xl:mr-[30px] xl:[grid-column-start:6]",
          )}
        >
          {intro ? <span>{intro}</span> : null}
        </div>

        <div
          className={cn(
            "blockHeaderGeneral__title row-start-3 mt-[65px]",
            "[grid-column-start:1] [grid-column-end:-2]",
          )}
        >
          {/* `.font-3XL` is the fluid clamp (46px → 75px); never hard-code it. */}
          <h1 className="font-3XL">{title}</h1>
        </div>

        {/*
          Last subgrid column, right- and bottom-aligned: at 1440 that puts
          the 45px circle at x 639.5–684.5 (the 30px right margin pulls it in
          from the 715px content edge) with its baseline flush to the bottom
          of the 140px title row. The margin is dropped below 1280, where the
          button sits flush against `main-end`.
        */}
        <div
          className={cn(
            "blockHeaderGeneral__button row-start-3 self-end justify-self-end",
            "[grid-column-start:-2] [grid-column-end:-1]",
            "xl:mr-[30px]",
          )}
        >
          <ButtonCircle
            href={buttonHref}
            label={buttonLabel}
            className="border-[#111111] text-[#111111]"
            /* 19px arrow turned a quarter-turn clockwise → points down. */
            icon={<ArrowIcon className="h-[19px] w-[19px] rotate-90" />}
          />
        </div>
      </div>

      <div
        className={cn(
          "blockHeaderGeneral__imageWrapper row-start-2",
          "[grid-column-start:1] [grid-column-end:-1]",
          /*
            `min-height: 0` is what keeps the `5fr` row honest below xl.

            A grid item's automatic minimum size is its min-content height, and
            for this one that is the image's intrinsic height at the current
            column width — 16:9, so full-bleed it is `0.5625 * viewport width`.
            Whenever that exceeded the row's `5fr` share (half the 120vh block,
            i.e. `0.5 * viewport height`) the floor won, the row grew past its
            fr size, and the rows summed to more than the `h-[120vh]` the
            container is pinned at. The image then spilled out of the bottom of
            the header and the next section's label printed on top of the photo.

            The condition is `width / height > 0.888`, so it missed every
            portrait viewport in the reference set — 390x844 (0.46) and 768x900
            (0.85) both land under it — and hit every landscape window between
            the md and xl tiers. Measured overflow before this line: +160px at
            1024x768, +180px at 1100x800, +178px at 1279x900, +165px at 900x700,
            on both /about/ and /process/; 0 at 390x844, 768x900 and 1440x900.

            With the floor removed the row takes its `5fr` share and the image's
            own `object-cover` crops to it. `xl:min-h-[600px]` still applies at
            xl, where the single `1fr` row never had the problem.
          */
          "min-h-0",
          "xl:row-start-1 xl:min-h-[600px] xl:[grid-column-start:12]",
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority
          sizes="(min-width: 1280px) 50vw, 100vw"
          className="blockHeaderGeneral__image h-full w-full object-cover"
        />
      </div>
    </header>
  );
}

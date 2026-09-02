/**
 * BlockHeaderProjects — the hero of a project-detail page.
 *
 * Geometry is 1:1 with `getComputedStyle()` at 1440x900 (see
 * `BlockHeaderProjects.styles.md`)
 * and cross-checked against the 390px capture in `mobile-full.png`.
 *
 * SIZING — the measured `height: 1170px / maxHeight: 1170px` and
 * `gridTemplateRows: 900px 270px` are viewport-relative, not fixed:
 *   1440x900 → 1170 = 130vh, rows 900/270 = 100vh/30vh
 *    390x844 → 1097 = 130vh, rows 844/253                (both captures agree)
 * Reproduced as `h-[1170px] max-h-[130vh]` with proportional `1fr / 0.3fr`
 * rows, which lands on the measured pixels at both widths and degrades
 * sensibly on any other viewport height.
 *
 * GRID — the source addresses two named areas, `left` and `right`, that split
 * the main columns in half; `.ng-grid` in globals.css carries the tracks but
 * not the area names, so every span below is the equivalent numeric line for
 * that breakpoint's tier (4 cols → lines 1-7, 12 cols → 1-15, 20 cols → 1-23,
 * with `main-start` = line 2 and `main-end` = the last-but-one line):
 *   left  = 2/6 (base) · 2/8 (md) · 2/12 (xl)
 *   right = 2/6 (base, the areas stack) · 8/14 (md) · 12/22 (xl)
 * Everything hangs off one `grid-cols-subgrid` chain (section → contentWrapper
 * → header) so the inner elements address the page grid directly.
 *
 * ANIMATION — none. The extracted styles record identity transforms and
 * `filter: blur(0px)` on the title/excerpt and no `clip-path` anywhere, i.e.
 * this block's intro has already settled by the time it is measured and there
 * is no scroll wipe to reproduce. That keeps it a server component; the
 * `.ng-image-reveal` IntersectionObserver trap does not apply here.
 */
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ButtonArrow } from "@/components/site/shared/buttons";
import { ChevronIcon } from "@/components/site/shared/icons";

export interface BlockHeaderProjectsImage {
  /** Local path, e.g. `/sites/<site>/<page>/images/<basename>.webp`. */
  src: string;
  alt: string;
  /** Intrinsic size of the source file (hero measured at 1440x960). */
  width: number;
  height: number;
}

export interface BlockHeaderProjectsProps {
  /** Project name — rendered as the page `<h1>` and as the breadcrumb tail. */
  title: string;
  /**
   * One-line project summary shown opposite the back link. This is the
   * project's OUTCOME, not its brief — the brief is the `BlockIntroDouble`
   * statement two blocks further down, and printing it in both slots repeats
   * the same sentence inside two screens.
   */
  lead: string;
  /** The project's meta qualifier, e.g. "2026 · iOS". */
  location: string;
  /** Service line(s), e.g. "Applied AI · Data Intelligence". */
  service: string;
  image: BlockHeaderProjectsImage;
  breadcrumbLabel?: string;
  breadcrumbHref?: string;
  backLabel?: string;
  /** Defaults to `breadcrumbHref` — both point at the work index. */
  backHref?: string;
  /** Bottom-pinned hint, mobile only. */
  scrollPrompt?: string;
  className?: string;
}

export function BlockHeaderProjects({
  title,
  lead,
  location,
  service,
  image,
  breadcrumbLabel = "Work",
  breadcrumbHref = "/work/",
  backLabel = "All work",
  backHref,
  scrollPrompt = "Scroll to explore",
  className,
}: BlockHeaderProjectsProps) {
  return (
    <header
      className={cn(
        "blockHeaderProjects ng-grid relative mb-[100px] h-[1170px] max-h-[130vh] grid-rows-[minmax(0,1fr)_minmax(0,0.3fr)] overflow-hidden",
        className,
      )}
    >
      {/*
        115% tall (measured 1345.5px against a 1170px area) and clipped by the
        section — the source keeps that 15% of headroom so its scroll parallax
        has somewhere to travel. Static here, so only the top 100% is ever seen,
        which is exactly the settled frame the reference screenshot captures.
      */}
      <div className="blockHeaderProjects__image col-span-full row-start-1 row-end-3 h-[115%] max-h-[calc(15%+1170px)]">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="100vw"
          priority
          className="blockHeaderProjects__img h-full w-full object-cover"
        />
      </div>

      <div className="blockHeaderProjects__imageOverlay col-span-full row-start-1 row-end-3 z-[2] bg-[rgba(0,0,0,0.443)]" />

      {/*
        Rows: 1fr (breadcrumb + back link + lead) / auto (location + service) /
        title. Measured at desktop as 581.094 / 18.906 / 300 against a 900px
        wrapper — the first row is the flexible remainder, the last is the
        title's own 225px + 25/50 margins. Below 768px the third row becomes
        flexible too, because the scroll prompt is pinned to the bottom of it
        (its underline sits 20px above the wrapper's bottom edge at 390px).
      */}
      <div className="blockHeaderProjects__contentWrapper col-span-full row-start-1 z-[3] grid grid-cols-subgrid grid-rows-[auto_auto_1fr] text-white md:grid-rows-[minmax(0,1fr)_auto_auto]">
        {/* Hidden below 768px — absent from the 390px capture. */}
        <nav
          aria-label="Breadcrumb"
          className="blockHeaderProjects__breadCrumb row-start-1 mt-[25px] hidden h-[29px] items-center gap-px self-start md:col-start-8 md:col-end-[14] md:flex xl:col-start-[12] xl:col-end-[22]"
        >
          <Link href={breadcrumbHref} className="block">
            {breadcrumbLabel}
          </Link>
          <ChevronIcon className="h-[19px] w-[19px] shrink-0" />
          {/* Clamped to 180px and ellipsised, exactly as measured. */}
          <span className="blockHeaderProjects__breadCrumbPost z-[4] max-w-[180px] truncate text-[#d6d6d6]">
            {title}
          </span>
        </nav>

        {/*
          75px at 390px (the source's `margin-top: 75px` on the back link, which
          measures out to y=91); desktop measures 150px. An earlier 183px here
          dropped the chip level with the fixed wordmark and, with the old
          `minmax(0,1fr)` first row, pushed the lead down over the location and
          service line. (The extracted `align-items: end` on this row is not what
          the reference renders — the chip's top edge lines up with the lead's
          first line, so the row is start-aligned.)
        */}
        <div className="blockHeaderProjects__header col-span-full row-start-1 mt-[75px] grid grid-cols-subgrid self-start pb-[50px] md:mt-[150px]">
          <div className="blockHeaderProjects__backButton col-start-2 row-start-1 h-[27px]">
            <ButtonArrow title={backLabel} href={backHref ?? breadcrumbHref} color="white" />
          </div>

          <span className="blockHeaderProjects__excerpt font-M col-start-2 col-end-[6] row-start-2 mt-[50px] block md:col-start-8 md:col-end-[14] md:row-start-1 md:mt-0 xl:col-start-[12] xl:col-end-[19]">
            {lead}
          </span>
        </div>

        <div className="blockHeaderProjects__location font-S col-start-2 col-end-4 row-start-2">
          {location}
        </div>

        {/* Right-aligned rather than filling its cell (measured 107px in a 260px area). */}
        <div className="blockHeaderProjects__service font-S col-start-2 col-end-[6] row-start-2 justify-self-end md:col-end-[14] xl:col-start-[18] xl:col-end-[22]">
          {service}
        </div>

        <div className="blockHeaderProjects__title font-3XL col-start-2 col-end-[6] row-start-3 z-[2] mt-[25px] mb-[50px] self-start md:col-end-8 xl:col-end-[12]">
          <h1>{title}</h1>
        </div>

        {/*
          Measured 0x0 at 1440 and visible at 390, so it is a small-screen
          affordance only. The source ships both a `--touch` ("Swipe up to
          explore") and a `--scroll` variant; the 390px capture renders the
          scroll one, which is what we reproduce.
        */}
        <div className="blockHeaderProjects__actionPrompt font-S col-start-2 col-end-[6] row-start-3 mb-[20px] w-fit self-end justify-self-start border-b border-white pb-[10px] md:hidden">
          {scrollPrompt}
        </div>
      </div>
    </header>
  );
}

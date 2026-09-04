/**
 * BlockHeaderProjects — the hero of a project-detail page.
 *
 * Geometry is 1:1 with `getComputedStyle()` at 1440x900 (see
 * `BlockHeaderProjects.styles.md`)
 * and cross-checked against the 390px capture in `mobile-full.png`.
 *
 * TEXT ON A GROUND, NOT ON THE IMAGE — the one deliberate departure from the
 * layout this is adapted from.
 *
 * That layout puts the whole header over a full-bleed photograph with a 44%
 * black scrim. It works for architectural photography, which is textless and
 * quiet in the corners. Every image this site owns is a screenshot of a
 * website or an app, and a screenshot is the opposite: it is mostly type, and
 * its type is arranged exactly where ours is. On `/work/vintus/` the client's
 * own nav ("PRODUCERS · TRADE TOOLS · NEWS…") landed on our wordmark's
 * baseline, their search field ran through our `<h1>`, and their headline —
 * "Building a National Wine Import Business From Scratch", set 2.5x oversized
 * by the upscale — read as ours. No amount of scrim fixes that; the collision
 * is structural.
 *
 * So the header is two bands, which is the shape `BlockHeaderServices` already
 * uses on this site and is proven to work: a 500px ground carrying every piece
 * of text, then a 70vh image band with nothing over it. The screenshot gets to
 * be a screenshot, our type gets a guaranteed contrast, and the block keeps its
 * measured internal spacing and column spans.
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
        "blockHeaderProjects ng-grid relative mb-[100px] grid-rows-[500px_70vh] overflow-hidden bg-[#262626]",
        className,
      )}
    >
      {/*
        The image band. Row 2, so nothing is ever laid over it — see the note
        at the top of the file. `object-cover` still crops, but a screenshot
        cropped to a wide band reads as a screenshot rather than as wallpaper,
        and no text competes with the type inside it.
      */}
      <div className="blockHeaderProjects__image col-span-full row-start-2 h-full overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="100vw"
          priority
          // `object-top`, not the default centre. A centred cover crop takes a
          // horizontal slice out of the middle of a website screenshot, which
          // lands mid-paragraph — on /work/landscape-drainage-proz/ it cut
          // through the middle of a line of the client's own body copy. Every
          // screenshot here is top-weighted (nav, then hero), so anchoring the
          // crop to the top shows the part that means something and cuts the
          // bottom, which reads as a cropped screenshot rather than a slice.
          className="blockHeaderProjects__img h-full w-full object-cover object-top"
        />
      </div>

      {/*
        The text band. Three rows — (back link + breadcrumb + lead) / (meta +
        service) / title — with the first taking the slack so the title sits on
        the band's bottom edge, which is where it sat against the image before.
        The band is 500px rather than the old 900px, so the header's top margin
        steps down with it (75/35 rather than 75/150).
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
        <div className="blockHeaderProjects__header col-span-full row-start-1 mt-[75px] grid grid-cols-subgrid self-start pb-[35px] md:mt-[110px]">
          <div className="blockHeaderProjects__backButton col-start-2 row-start-1 h-[27px]">
            <ButtonArrow title={backLabel} href={backHref ?? breadcrumbHref} color="white" />
          </div>

          <span className="blockHeaderProjects__excerpt font-M col-start-2 col-end-[6] row-start-2 mt-[50px] block md:col-start-8 md:col-end-[14] md:row-start-1 md:mt-0 xl:col-start-[12] xl:col-end-[19]">
            {lead}
          </span>
        </div>

        {/*
          Two columns held a city ("Livermore, CA"). Ours holds a meta string —
          "2026 · E-commerce" — which wrapped to "2026 · E-" / "commerce" in
          that width, so the slot runs to line 6.
        */}
        <div className="blockHeaderProjects__location font-S col-start-2 col-end-[6] row-start-2 md:col-end-8">
          {location}
        </div>

        {/*
          Right-aligned rather than filling its cell. Widened from line 18 for
          the same reason: a single market name fitted 270px, but two service
          lines joined with a "·" ("Cloud & Infrastructure · Web Development")
          did not and wrapped onto the title.
        */}
        <div className="blockHeaderProjects__service font-S col-start-2 col-end-[6] row-start-2 justify-self-end text-right md:col-start-8 md:col-end-[14] xl:col-start-[14] xl:col-end-[22]">
          {service}
        </div>

        <div className="blockHeaderProjects__title font-3XL col-start-2 col-end-[-2] row-start-3 z-[2] mt-[25px] mb-[50px] self-start md:col-end-8 xl:col-end-[12]">
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

"use client";

/**
 * `blockProjectsHighlight` — the highlighted-projects block, generalised.
 *
 * The source ships FIVE named tile arrangements and every page composes its own
 * ordered sequence of them, so this component takes `layouts` (an ordered list)
 * rather than hard-coding two rows the way the pass-1 homepage build does.
 * Measured from the live pages (BLOCK_TREE.json + per-page BLOCKS.json):
 *
 *   /                                       one, two
 * The layout sequence is per page, not a constant. The five variants
 * (one · two · three · four · five) are combined in whatever order a page's
 * material justifies, and a page with only two projects to show simply uses a
 * shorter sequence rather than padding the grid.
 *
 * What each variant is (all measured at 1440 / 768 / 390 from GRID_AREAS.json):
 *
 *   one    large tile left  + two stacked small tiles right
 *   two    two small tiles left + large tile right   (one, mirrored)
 *   three  like `two`, plus a "View all X" / Portfolio footer in a second
 *          grid row that deliberately overflows the block at ≥1280
 *   four   two *large* tiles side by side; the left one lives in a
 *          `smallImagesWrapper` that is pinned to 471px tall, which is why the
 *          source leaves ~200px of white below it under 1280px
 *   five   one full-bleed image with a translucent caption card over its
 *          top-left corner; the whole thing is a single link
 *
 * Verbatim header copy per page, for whoever wires the routes up:
 *   housing            "Highlighted projects" · "All Housing"
 *   affordable-housing "Highlighted Projects" · "All Affordable Housing"
 *   Header copy is per page: the title and the "All <service>" button label
 *   both come from the content module.
 *   student-housing    "Highlighted Projects" · "All Student Housing"
 *   senior-housing     "Highlighted projects" · "All Senior Housing"
 *   civic              "Highlighted projects" · "All Civic"
 *   commercial         "Highlighted projects" · "All Commercial"
 *   interiors          "Highlighted projects" · "All Interiors"
 *   higher-education   "Highlighted Projects" · "All Higher  Education"
 *                      (the double space is in the source)
 *   homepage           "A selection of our work" · "All projects"
 *
 * This file is a client component only because `NotchedImageCard` (below) needs
 * an IntersectionObserver; the block itself holds no state.
 */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonArrow } from "@/components/site/shared/buttons";
// Reused as-is: it already gets the two-element animation split right (reveal on
// the wrapper, hover zoom on the <img>) and observes an unclipped ancestor.
import { ImageCard } from "@/components/site/home/ImageCard";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import type { PortfolioFilterItem, ProjectCard } from "@/types/site";
import { REVEAL_OBSERVER_INIT } from "../reveal";

/* ------------------------------------------------------------------ *
 * Props
 * ------------------------------------------------------------------ */

/** `blockProjectsHighlight__layoutThree`'s trailing call-to-action. */
export interface ProjectsHighlightFooter {
  /** e.g. "View all Housing" / "See all Affordable Housing". */
  title: string;
  buttonTitle: string;
  buttonHref: string;
}

/**
 * One tile arrangement plus the projects that fill it. The counts differ per
 * variant, so this is a discriminated union rather than a flat array — a page
 * cannot accidentally hand `layoutOne` four projects.
 */
export type ProjectsHighlightLayout =
  | { variant: "one"; large: ProjectCard; small: [ProjectCard, ProjectCard] }
  | { variant: "two"; small: [ProjectCard, ProjectCard]; large: ProjectCard }
  | {
      variant: "three";
      small: [ProjectCard, ProjectCard];
      large: ProjectCard;
      footer: ProjectsHighlightFooter;
    }
  | { variant: "four"; left: ProjectCard; right: ProjectCard }
  /** `project.image` here is the wide 1340×924-ish crop, not the tile crop. */
  | { variant: "five"; project: ProjectCard };

export interface BlockProjectsHighlightProps {
  /** `blockProjectsHighlight__headerTitle`. */
  title: string;
  /** The `highlightedButton` at the top right. Omitted on pages without one. */
  button?: { title: string; href: string };
  /** The homepage's service pill row. Service pages pass nothing. */
  filters?: { title: string; items: PortfolioFilterItem[] };
  layouts: ProjectsHighlightLayout[];
  className?: string;
}

/* ------------------------------------------------------------------ *
 * Shared class fragments
 * ------------------------------------------------------------------ */

/**
 * Every `__layout` is a subgrid child spanning the main column band.
 *
 * The 50px `gap-y` is the vertical rhythm the source uses while the tiles are
 * stacked (<1280px). At ≥1280 every layout collapses onto a single grid row,
 * so the row gap becomes inert rather than needing a breakpoint reset.
 */
const LAYOUT_ROW =
  "blockProjectsHighlight__layout col-start-2 col-end-[-2] grid grid-cols-subgrid gap-y-[50px]";

/**
 * `blockProjectsHighlight__smallImagesWrapper`: column with a 50px gap under
 * 768px, row with a 10px gap above it. `items-start` keeps each tile at its
 * content height (260px) instead of stretching it to the grid row.
 */
const SMALL_WRAPPER =
  "blockProjectsHighlight__smallImagesWrapper flex flex-col gap-[50px] md:flex-row md:items-start md:gap-[10px]";

/**
 * The small tiles are `position: sticky` in layouts one/two (but NOT three,
 * where the source measures them `relative`). The source's JS writes
 * `top: 765px - elementHeight` — i.e. it pins the tile 135px above the bottom
 * of a 900px viewport — which is what leaves them bottom-aligned against the
 * large tile once you have scrolled past. 395px = 135px + the 260px tile.
 * Only applied at ≥1280, where the wrapper is stretched to 471px and there is
 * actually 211px of travel; below that the wrapper hugs its content.
 */
const STICKY_SMALL = "xl:sticky xl:top-[calc(100vh-395px)]";

/** Two large tiles side by side (layout four) / large + smalls (one..three). */
const HALF_SPAN = "col-span-full xl:col-span-10";

/**
 * Decorative 60px corner bevel on the large tiles. Which corner is cut is a
 * property of the layout, not of the project: layouts one and four cut the top
 * left, layouts two and three cut the bottom right. Written as literal class
 * strings so Tailwind's source scan can see them.
 */
const NOTCH_CLASS = {
  topLeft: "[clip-path:polygon(60px_0,100%_0,100%_100%,0_100%,0_60px)]",
  bottomRight:
    "[clip-path:polygon(0_0,100%_0,100%_calc(100%-60px),calc(100%-60px)_100%,0_100%)]",
} as const;

type NotchCorner = keyof typeof NOTCH_CLASS;

/* ------------------------------------------------------------------ *
 * NotchedImageCard
 * ------------------------------------------------------------------ */

interface NotchedImageCardProps {
  project: ProjectCard;
  notch: NotchCorner;
  className?: string;
}

/**
 * `ImageCard` with the source's bevelled corner.
 *
 * The bevel cannot be added from the outside: in `ImageCard` the image wrapper
 * already owns a `clip-path` (that *is* the reveal), and an element only has
 * one, while clipping the whole `<a>` would eat into the title/location block
 * below the image. So this variant adds ONE extra element between the anchor
 * and the reveal wrapper and hangs the static bevel there. The three-way split
 * that pass 1 established is preserved exactly:
 *
 *   <a>                          ← what the IntersectionObserver watches
 *     <div notch>                ← static decorative clip-path (this variant)
 *       <div .ng-image-reveal> ← 1.2s one-shot clip-path wipe
 *         <img>                  ← 0.3s repeatable hover scale
 *
 * Watching the anchor rather than the reveal wrapper is load-bearing:
 * `.ng-image-reveal` starts at `clip-path: inset(100% 0 0)`, so an observer
 * pointed at it reports ratio 0 forever and the image never appears.
 */
function NotchedImageCard({ project, notch, className }: NotchedImageCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isRevealed = revealed || reduceMotion;

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    // Reduced motion renders revealed from the start — nothing to observe.
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect(); // one-shot
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const isLarge = project.size === "large";

  return (
    <Link
      ref={cardRef}
      href={project.href}
      className={cn("imageCard group flex flex-col", !isLarge && "flex-1", className)}
    >
      <div className={NOTCH_CLASS[notch]}>
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
      </div>
      <div className="imageCard__textWrap mt-[15px] flex flex-col gap-[2px]">
        {/* `min-h`, not `h`: the source's title box is content-driven. A
            one-line title is 21.59px, but "Solano Community College Theatre
            and Arts Building" is 43.19px — a fixed height clipped the second
            line off on every service page. Same fix as ImageCard.tsx. */}
        <p className="imageCard__title min-h-[22px] overflow-hidden text-[#111111] leading-[21.6px]">
          {project.title}
        </p>
        <p className="imageCard__location font-XS text-[#747474]">{project.location}</p>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ *
 * Layout variants
 * ------------------------------------------------------------------ */

interface LayoutProps {
  layout: ProjectsHighlightLayout;
  /** The source pads every layout but the last one by 50px. */
  isLast: boolean;
}

function Layout({ layout, isLast }: LayoutProps) {
  const pad = !isLast && "pb-[50px]";

  switch (layout.variant) {
    /* Large tile left, two small tiles right. Under 1280 the large tile is
       row 1 and the small wrapper row 2, which is already the DOM order. */
    case "one":
      return (
        <div className={cn(LAYOUT_ROW, "blockProjectsHighlight__layoutOne", pad)}>
          <NotchedImageCard project={layout.large} notch="topLeft" className={HALF_SPAN} />
          <div className={cn(SMALL_WRAPPER, HALF_SPAN)}>
            <ImageCard project={layout.small[0]} className={STICKY_SMALL} />
            <ImageCard project={layout.small[1]} className={STICKY_SMALL} />
          </div>
        </div>
      );

    /* Mirror of `one`. The DOM keeps the source's order (smalls first) so the
       desktop auto-placement lands them left, but under 1280 the large tile
       must still lead, hence the order swap up to `xl`. */
    case "two":
      return (
        <div className={cn(LAYOUT_ROW, "blockProjectsHighlight__layoutTwo", pad)}>
          <div className={cn(SMALL_WRAPPER, HALF_SPAN, "order-2 xl:order-1")}>
            <ImageCard project={layout.small[0]} className={STICKY_SMALL} />
            <ImageCard project={layout.small[1]} className={STICKY_SMALL} />
          </div>
          <NotchedImageCard
            project={layout.large}
            notch="bottomRight"
            className={cn(HALF_SPAN, "order-1 xl:order-2")}
          />
        </div>
      );

    /* `two` plus a footer. At ≥1280 the second grid track is a fixed 50px while
       the footer is 141–182px tall, so the source lets it hang past the bottom
       of the block — that overhang is intentional, not a bug. Below 1280 the
       footer becomes a normal third row sitting 80px under the tiles (the 50px
       row gap plus its own 30px offset). */
    case "three":
      return (
        <div
          className={cn(
            LAYOUT_ROW,
            "blockProjectsHighlight__layoutThree xl:grid-rows-[auto_50px]",
            pad,
          )}
        >
          <div className={cn(SMALL_WRAPPER, HALF_SPAN, "order-2 xl:order-1 xl:row-start-1")}>
            <ImageCard project={layout.small[0]} />
            <ImageCard project={layout.small[1]} />
          </div>
          <NotchedImageCard
            project={layout.large}
            notch="bottomRight"
            className={cn(HALF_SPAN, "order-1 xl:order-2 xl:row-start-1")}
          />
          <div className="blockProjectsHighlight__layoutThreeContent order-3 col-start-1 col-end-5 mt-[30px] flex flex-col gap-[30px] xl:mt-0 xl:row-start-2">
            <span className="blockProjectsHighlight__layoutThreeTitle font-L text-[#111111]">
              {layout.footer.title}
            </span>
            <ButtonArrow
              title={layout.footer.buttonTitle}
              href={layout.footer.buttonHref}
              color="slate"
            />
          </div>
        </div>
      );

    /* Two large tiles. The left one is wrapped in a `smallImagesWrapper` that
       the source pins to 471px — at 1440 that matches its content, but at 768
       and 390 the tile is only ~267px tall, so the wrapper keeps ~200px of
       white beneath it. Reproduced deliberately. Unlike one/two/three this
       layout stays side by side at 768 (it uses the grid's 6+6 `left`/`right`
       areas), and it carries a 50px margin on top of its 50px padding. */
    case "four":
      return (
        <div
          className={cn(
            LAYOUT_ROW,
            "blockProjectsHighlight__layoutFour",
            !isLast && "mb-[50px]",
            pad,
          )}
        >
          <div
            className={cn(
              SMALL_WRAPPER,
              "order-2 h-[471px] col-span-full md:order-1 md:col-span-6 xl:col-span-10 xl:h-auto",
            )}
          >
            <ImageCard project={layout.left} className="w-full flex-1" />
          </div>
          <NotchedImageCard
            project={layout.right}
            notch="topLeft"
            className="order-1 col-span-full md:order-2 md:col-span-6 xl:col-span-10"
          />
        </div>
      );

    /* One full-bleed image, the whole layout being a single link. The caption
       card overlays the image's top-left corner from 768 up; under that it
       drops below the image as plain dark-on-white text with no button. The
       image keeps its intrinsic aspect ratio, which is why this layout's
       measured height wanders between 943px and 974px across pages. */
    case "five": {
      const { project } = layout;
      return (
        <Link
          href={project.href}
          className={cn(
            "blockProjectsHighlight__layoutFive col-start-2 col-end-[-2] grid max-h-[1000px] grid-cols-subgrid overflow-hidden",
            pad,
          )}
        >
          <div className="blockProjectsHighlight__layoutFiveImage col-span-full md:row-start-1">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="blockProjectsHighlight__layoutFiveContent col-start-1 col-end-4 flex flex-col md:col-end-7 md:row-start-1 md:mt-[50px] md:ml-[50px] md:bg-[rgba(14,14,14,0.6)] md:p-[20px] md:text-white md:backdrop-blur-[20px] md:[clip-path:polygon(0_0,100%_0,100%_calc(100%-50px),calc(100%-50px)_100%,0_100%)] xl:col-end-6">
            {/* Static: this sits inside the anchor above, so it must not be a
                link of its own. Hidden below 768 — the source drops it when the
                caption stops overlaying the image. */}
            <div className="blockProjectsHighlight__layoutFiveButton hidden md:flex">
              <ButtonArrow asStatic border aria-label={project.title} />
            </div>
            <span className="blockProjectsHighlight__layoutFiveTitle mt-[8px] mb-[2px] md:mt-[30px]">
              {project.title}
            </span>
            <span className="blockProjectsHighlight__layoutFiveLocation font-XS">
              {project.location}
            </span>
          </div>
        </Link>
      );
    }
  }
}

/* ------------------------------------------------------------------ *
 * Block
 * ------------------------------------------------------------------ */

export function BlockProjectsHighlight({
  title,
  button,
  filters,
  layouts,
  className,
}: BlockProjectsHighlightProps) {
  return (
    <section className={cn("blockProjectsHighlight ng-grid my-[100px] text-[#111111]", className)}>
      <header className="blockProjectsHighlight__header col-start-2 col-end-[-2] mb-[25px] grid grid-cols-subgrid border-b border-[#d6d6d6] pb-[17.5px]">
        {/* `1 / -4` at ≥768 leaves the last four columns for the button; under
            768 the two stack and the button goes full-width and left-aligned. */}
        <h2 className="blockProjectsHighlight__headerTitle font-L col-span-full row-start-1 text-[#111111] md:col-start-1 md:col-end-[-4]">
          {title}
        </h2>

        {button ? (
          <div className="highlightedButton z-50 col-span-full row-start-2 mt-[5px] md:col-start-[-5] md:col-end-[-1] md:row-start-1 md:justify-self-end">
            <ButtonArrow title={button.title} href={button.href} color="slate" />
          </div>
        ) : null}

        {filters ? (
          <div className="portfolioFilter col-span-full row-start-3 mt-[25px] flex flex-col items-end gap-[10px] md:row-start-2 md:flex-row md:items-center md:justify-end">
            <div className="portfolioFilter__title whitespace-nowrap text-[#111111]">
              {filters.title}
            </div>
            <div className="portfolioFilter__itemWrapper flex gap-[30px] overflow-x-auto px-[15px]">
              {filters.items.map((filter) => (
                <Link
                  key={filter.label}
                  href={filter.href}
                  className="portfolioFilter__item group relative flex shrink-0 items-baseline gap-[4px] whitespace-nowrap text-[#111111]"
                >
                  <span className="relative">
                    {filter.label}
                    {/* Underline wipe: two stacked bars relayed like ButtonArrow's arrows. */}
                    <span className="pointer-events-none absolute inset-x-0 -bottom-[2px] h-px overflow-hidden">
                      <span className="absolute h-px w-full bg-[#111111] transition-transform duration-300 group-hover:translate-x-[105%]" />
                      <span className="absolute h-px w-full -translate-x-[105%] bg-[#111111] transition-transform delay-300 duration-300 group-hover:translate-x-0" />
                    </span>
                  </span>
                  <span className="font-XS text-[#747474]">{filter.count}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      {layouts.map((layout, index) => (
        <Layout
          // Layout variants can repeat within a page, so the index is part of
          // the identity; the list is static per page, so this is stable.
          key={`${layout.variant}-${index}`}
          layout={layout}
          isLast={index === layouts.length - 1}
        />
      ))}
    </section>
  );
}

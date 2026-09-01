"use client";

/**
 * `CollectionProjects` — the filtered, paginated project grid that fills
 * /portfolio/ (and the market landing pages).
 *
 * WHAT THE SOURCE ACTUALLY DOES (measured, see
 * `docs/research/lpas-com-76f4f1fd/portfolio-81ee5030/PORTFOLIO_PROBE.json`):
 *
 *  - It is **click-driven filtering with pagination**, not infinite scroll.
 *    Scrolling to the bottom ten times left the card count pinned at 14.
 *  - The filter pills are `<button>`s, not links. Clicking one fires
 *    `GET /wp-json/filter/projects?per_page=14&page=1&taxonomy=markets&term=<slug>`
 *    and pushes `?market=<slug>` onto history without a navigation.
 *  - The 14 cards of a page are split across three `collectionProjects__target`
 *    containers with a `projectHighlight` banner interleaved between them:
 *      filterApi → targetOne → highlight → targetTwo → highlight → targetThree
 *      → pagination
 *
 * This clone has no backend, so the same filtering and pagination run
 * client-side over the bundled dataset handed in as `projects`. Nothing is
 * fetched at runtime; only the URL behaviour is reproduced (`?market=<slug>`,
 * pushed, and read back on mount so a deep link lands on the right filter).
 */

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ButtonArrow } from "@/components/sites/lpas-com-76f4f1fd/shared/buttons";
import { ArrowIcon } from "@/components/sites/lpas-com-76f4f1fd/shared/icons";
import { REVEAL_OBSERVER_INIT } from "../reveal";

/* ------------------------------------------------------------------ *
 * Contracts
 * ------------------------------------------------------------------ */

export interface CollectionProjectsImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** One project row of `PROJECTS_DATASET.json`, flattened for rendering. */
export interface CollectionProjectsProject {
  title: string;
  location: string;
  /** Site-relative pathname, e.g. `/portfolio/the-frederic/`. */
  href: string;
  /** Every markets-taxonomy slug on the project, sub-markets included. */
  markets: string[];
  /** Top-tier slugs only (housing · interiors · higher-education · civic · commercial). */
  topMarkets: string[];
  image: CollectionProjectsImage;
}

/**
 * A pill in either filter row. `slug: ""` is the "All" pill; `children` (only
 * Housing has them) become the second row once that market is active.
 */
export interface CollectionProjectsFilter {
  label: string;
  slug: string;
  count?: number;
  children?: CollectionProjectsFilter[];
}

/** The full-bleed banner that sits between two target containers. */
export interface CollectionProjectsHighlight {
  title: string;
  location: string;
  href: string;
  image: CollectionProjectsImage;
}

export interface CollectionProjectsProps {
  /** The whole collection; this block pages through it 14 at a time. */
  projects: CollectionProjectsProject[];
  /** Defaults to the five markets the source renders, with its own counts. */
  filters?: CollectionProjectsFilter[];
  /**
   * Up to two banners, rendered after targetOne and targetTwo. They are page
   * furniture on the source, not results: filtering never changes them.
   */
  highlights?: CollectionProjectsHighlight[];
  className?: string;
}

/**
 * The source's page size, and simultaneously the number of card slots in the
 * five hard-coded layouts below (3 + 3 + 3 + 2 + 3). The two numbers are the
 * same fact, so they share one constant.
 */
export const COLLECTION_PROJECTS_PER_PAGE = 14;

/**
 * The measured filter tiers. The taxonomy is hierarchical — Housing's 27 is
 * the sum of its four children — which is why the sub-markets hang off it
 * rather than sitting in the top row.
 */
export const PORTFOLIO_MARKET_FILTERS: CollectionProjectsFilter[] = [
  { label: "All", slug: "" },
  {
    label: "Housing",
    slug: "housing",
    count: 27,
    children: [
      { label: "All", slug: "housing" },
      { label: "Affordable Housing", slug: "affordable-housing", count: 6 },
      { label: "Student Housing", slug: "student-housing", count: 3 },
      { label: "Market Rate Housing", slug: "market-rate-housing", count: 13 },
      { label: "Senior Housing", slug: "senior-housing", count: 5 },
    ],
  },
  { label: "Interiors", slug: "interiors", count: 13 },
  { label: "Higher Education", slug: "higher-education", count: 12 },
  { label: "Civic", slug: "civic", count: 6 },
  { label: "Commercial", slug: "commercial", count: 14 },
];

/* ------------------------------------------------------------------ *
 * The interleave
 *
 * Five layouts, distributed across three target containers. Each layout pairs
 * one "large" card (half the main column, and the only one that carries the
 * 60px corner notch) with the companions that share its row.
 *
 * `large` is an index into the layout's slice of the feed, and it is genuinely
 * not always 0: the theme picks a different element per layout. Checked
 * against page 1 of the live site, feed order → rendered order is
 *   L1 [1,2,3] large=0 · L2 [4,5,6] large=2 · L3 [7,8,9] large=0
 *   L4 [10,11] large=1 · L5 [12,13,14] large=0
 * which reproduces the reference screenshot card-for-card.
 *
 * `mirrored` flips the row at ≥1280px: the large card moves to the right half
 * and the companion wrapper reverses, so its DOM-first card lands on the right.
 * Below 1280px every layout is a single column in DOM order, which is exactly
 * what the 390px capture shows.
 * ------------------------------------------------------------------ */

interface LayoutSpec {
  /** 0-based index of the target container this layout belongs to. */
  target: number;
  /** How many cards of the page this layout consumes. */
  size: number;
  /** Which of those cards is the large one. */
  large: number;
  mirrored: boolean;
}

const LAYOUT_SPECS: readonly LayoutSpec[] = [
  { target: 0, size: 3, large: 0, mirrored: false },
  { target: 0, size: 3, large: 2, mirrored: true },
  { target: 1, size: 3, large: 0, mirrored: false },
  { target: 1, size: 2, large: 1, mirrored: true },
  { target: 2, size: 3, large: 0, mirrored: true },
];

/** Where each layout's slice of the 14-card page starts. */
const LAYOUT_OFFSETS: readonly number[] = LAYOUT_SPECS.map(
  (_, index) =>
    LAYOUT_SPECS.slice(0, index).reduce((total, spec) => total + spec.size, 0),
);

const TARGET_CLASSES = [
  "collectionProjects__targetOne",
  "collectionProjects__targetTwo",
  "collectionProjects__targetThree",
];

/* ------------------------------------------------------------------ *
 * Card
 * ------------------------------------------------------------------ */

interface ProjectCardProps {
  project: CollectionProjectsProject;
  /** The 60px bottom-right chamfer the source gives each layout's lead card. */
  notch?: boolean;
  className?: string;
  sizes: string;
}

function ProjectCard({ project, notch = false, className, sizes }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isRevealed = revealed || reduceMotion;

  useEffect(() => {
    // Observe the anchor, never the `.lpas-image-reveal` box. That box starts
    // at `clip-path: inset(100% 0 0)`, so its visible area is zero and an
    // observer aimed at it reports ratio 0 forever — the wipe would never fire
    // and every project image would stay blank.
    const node = cardRef.current;
    if (!node || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <Link
      ref={cardRef}
      href={project.href}
      className={cn(
        "collectionProjects__card group block cursor-pointer overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "collectionProjects__cardWrapper flex justify-center overflow-hidden",
          // Measured: polygon(0 0, 100% 0, 100% calc(100% - 60px),
          // calc(100% - 60px) 100%, 0 100%) — a 45° chamfer, same 60px at
          // every breakpoint.
          notch &&
            "[clip-path:polygon(0_0,100%_0,100%_calc(100%-60px),calc(100%-60px)_100%,0_100%)]",
        )}
      >
        {/*
          Two animations, deliberately on two elements. The clip-path wipe is a
          one-shot 1.2s reveal on this box; the hover zoom is a repeatable 0.3s
          scale on the <img>. Sharing one element would race two transitions on
          the same property whenever a visitor hovers mid-reveal.

          Every card in the collection — large, small and the wide companion of
          layout 4 — is the same 1.6 aspect (665/415.625 = 328/204.688).
        */}
        <div
          className={cn(
            "lpas-image-reveal aspect-[665/415.625] w-full overflow-hidden",
            isRevealed && "is-revealed",
          )}
        >
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes={sizes}
            // The source parks the image at scale(1.02) at rest — an
            // overscale that hides the edges as the wipe settles — and eases
            // it up on hover.
            className="collectionProjects__cardImage h-full w-full scale-[1.02] object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.06]"
          />
        </div>
      </div>
      <div className="collectionProjects__cardText mt-[15px] flex flex-col gap-[2px] text-left">
        <span className="collectionProjects__cardTitle block leading-[21.6px] text-[#111111]">
          {project.title}
        </span>
        <span className="collectionProjects__cardLocation font-XS block text-[#747474]">
          {project.location}
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ *
 * Highlight banner
 * ------------------------------------------------------------------ */

function ProjectHighlight({ highlight }: { highlight: CollectionProjectsHighlight }) {
  return (
    <Link
      href={highlight.href}
      className="projectHighlight group col-start-2 col-end-[-2] mb-[50px] grid cursor-pointer grid-cols-subgrid overflow-hidden"
    >
      <div className="projectHighlight__image col-span-full row-start-1 h-[960px] max-h-[1000px] overflow-hidden">
        <Image
          src={highlight.image.src}
          alt={highlight.image.alt}
          width={highlight.image.width}
          height={highlight.image.height}
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </div>
      {/*
        Below 768px the caption drops out of the image and centres underneath
        it in body ink — the 390px capture shows no glass panel at all. From
        768px up it becomes the measured overlay: 317.5px wide, 50px in from
        the top-left, 60%-black behind a 20px blur, with a 50px chamfer.
      */}
      <div
        className={cn(
          "projectHighlight__content col-span-full row-start-2 mt-[15px] flex flex-col text-center",
          "md:col-span-6 md:row-start-1 md:mt-[50px] md:ml-[50px] md:w-[317.5px] md:self-start md:bg-[rgba(14,14,14,0.6)] md:p-[20px] md:text-left md:text-white md:backdrop-blur-[20px]",
          "md:[clip-path:polygon(0_0,100%_0,100%_calc(100%-50px),calc(100%-50px)_100%,0_100%)]",
          "xl:col-span-5",
        )}
      >
        <div className="projectHighlight__buttonWrapper hidden md:flex">
          {/* Inside an anchor, so this must render as a span. */}
          <ButtonArrow asStatic border />
        </div>
        <h2 className="projectHighlight__title leading-[21.6px] text-[#111111] md:mt-[30px] md:mb-[2px] md:text-white">
          {highlight.title}
        </h2>
        <span className="projectHighlight__location font-XS block text-[#747474] md:text-[#a3a3a3]">
          {highlight.location}
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ *
 * Filter pills
 * ------------------------------------------------------------------ */

interface FilterButtonProps {
  filter: CollectionProjectsFilter;
  active: boolean;
  bottom?: boolean;
  onSelect: (slug: string) => void;
}

function FilterButton({ filter, active, bottom = false, onSelect }: FilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(filter.slug)}
      className={cn(
        // `items-start` is what lifts the count into a superscript: it is a
        // 12px span next to a 16px label, top-aligned rather than baselined.
        "filterApi__item z-[3] flex shrink-0 cursor-pointer items-start gap-[2px] whitespace-nowrap transition-colors duration-300 hover:text-[#262626]",
        bottom
          ? "filterApi__item--bottom pt-[20px]"
          : "border-b pb-[15px] " + (active ? "border-[#262626]" : "border-[#d6d6d6]"),
        active ? "text-[#262626]" : "text-[#595656]",
      )}
    >
      <span>{filter.label}</span>
      {filter.count === undefined ? null : <span className="font-XS">{filter.count}</span>}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Block
 * ------------------------------------------------------------------ */

export function CollectionProjects({
  projects,
  filters = PORTFOLIO_MARKET_FILTERS,
  highlights = [],
  className,
}: CollectionProjectsProps) {
  const [market, setMarket] = useState("");
  const [page, setPage] = useState(1);
  const filterRef = useRef<HTMLDivElement>(null);
  // Suppresses the paging scroll on the very first commit, so landing on the
  // page does not yank the viewport down to the grid.
  const hasPaged = useRef(false);

  // Read `?market=` on mount and follow back/forward. Deliberately
  // `window.location` rather than `useSearchParams()`: the source mutates the
  // query with `history.pushState` and never navigates, and reading the hook
  // here would push the whole route into a Suspense boundary for a value the
  // server render does not use.
  useEffect(() => {
    const read = () => {
      setMarket(new URLSearchParams(window.location.search).get("market") ?? "");
      setPage(1);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const selectMarket = useCallback((slug: string) => {
    setMarket(slug);
    setPage(1);
    const url = new URL(window.location.href);
    if (slug) {
      url.searchParams.set("market", slug);
    } else {
      url.searchParams.delete("market");
    }
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  /** The top-row pill that owns the current selection (housing owns its children). */
  const activeTop = useMemo(() => {
    if (!market) return "";
    if (filters.some((filter) => filter.slug === market)) return market;
    return filters.find((filter) => filter.children?.some((child) => child.slug === market))?.slug ?? "";
  }, [filters, market]);

  const subFilters = useMemo(
    () => filters.find((filter) => filter.slug === activeTop)?.children ?? [],
    [filters, activeTop],
  );

  // One expression covers both tiers: a top-market slug matches `topMarkets`,
  // a sub-market slug matches the project's own taxonomy terms.
  //
  // Highlighted projects are dropped from the results, which is what the
  // source's `&exclude=` parameter is for — both banner projects are in the
  // feed, and neither appears among the 14 cards of page 1. The filter counts
  // come from the taxonomy, not from this list, so they stay whole.
  const filtered = useMemo(() => {
    const excluded = new Set(highlights.map((highlight) => highlight.href));
    return projects.filter(
      (project) =>
        !excluded.has(project.href) &&
        (!market ||
          project.topMarkets.includes(market) ||
          project.markets.includes(market)),
    );
  }, [projects, market, highlights]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / COLLECTION_PROJECTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * COLLECTION_PROJECTS_PER_PAGE;
  const pageProjects = filtered.slice(start, start + COLLECTION_PROJECTS_PER_PAGE);

  // The source never shows more than three page numbers (its `.pagination__pages`
  // measures 134px = 3 × 40px + 2 × 7px), so the window slides with the cursor.
  const windowStart = Math.min(Math.max(currentPage - 1, 1), Math.max(totalPages - 2, 1));
  const pageNumbers: number[] = [];
  for (let n = windowStart; n <= Math.min(windowStart + 2, totalPages); n += 1) {
    pageNumbers.push(n);
  }

  useEffect(() => {
    if (!hasPaged.current) {
      hasPaged.current = true;
      return;
    }
    // Jump, never smooth-scroll: Lenis owns smooth scrolling on these pages and
    // animating from here would fight it.
    filterRef.current?.scrollIntoView({ block: "start" });
  }, [currentPage]);

  // Slice the page across the five layouts, then group the layouts by target.
  const layouts = useMemo(() => {
    return LAYOUT_SPECS.map((spec, index) => {
      const offset = LAYOUT_OFFSETS[index];
      const items = pageProjects.slice(offset, offset + spec.size);
      // A short final page can leave a layout with fewer cards than its
      // template expects; clamp so the lead card is always a real project.
      const largeIndex = Math.min(spec.large, items.length - 1);
      return {
        spec,
        large: items[largeIndex],
        companions: items.filter((_, itemIndex) => itemIndex !== largeIndex),
      };
    });
  }, [pageProjects]);

  const targets = TARGET_CLASSES.map((_, index) =>
    layouts.filter((layout) => layout.spec.target === index && layout.large !== undefined),
  );

  return (
    <section
      data-control="CollectionProjects"
      className={cn("collectionProjects lpas-grid min-h-[900px] text-[#111111]", className)}
    >
      {/*
        Full-bleed below 1280px so the pill row can scroll off the screen edge;
        the inner scrollers carry the gutter so the labels still line up with
        the main column.
      */}
      <div
        ref={filterRef}
        className="filterApi col-start-1 col-end-[-1] mt-[150px] xl:col-start-2 xl:col-end-[-2]"
      >
        <div id="filterHeader" className="filterApi__filterWrapper">
          {/* 37.594px = 21.6px line + 15px pill padding + the 1px underline. */}
          <div className="filterApi__Overflow filterApi__Overflow--one relative h-[37.594px] overflow-hidden">
            <div className="filterApi__Wrapper flex gap-[30px] overflow-x-auto whitespace-nowrap px-[15px] [scrollbar-width:none] md:px-[30px] xl:px-0">
              {filters.map((filter) => (
                <FilterButton
                  key={filter.slug || "all"}
                  filter={filter}
                  active={filter.slug === activeTop}
                  onSelect={selectMarket}
                />
              ))}
            </div>
          </div>
          {/* Pulled up 1px so it sits under the pills' own borders rather than beside them. */}
          <div className="filterApi__Line -mt-px h-px w-full bg-[#d6d6d6]" />
          {/*
            Always 55px tall, even with no sub-markets showing — the source
            keeps the empty band so the grid below never shifts when a market
            with children is picked.
          */}
          <div className="filterApi__Overflow relative h-[55px] overflow-hidden">
            <div className="filterApi__Wrapper flex gap-[30px] overflow-x-auto whitespace-nowrap px-[15px] [scrollbar-width:none] md:px-[30px] xl:px-0">
              <div className="filterApi__itemWrapper flex h-[55px] items-start gap-[30px]">
                {subFilters.map((child) => (
                  // The sub-row's "All" carries the parent's own slug, so a
                  // plain slug comparison marks it active for the whole market.
                  <FilterButton
                    key={child.slug + child.label}
                    filter={child}
                    bottom
                    active={child.slug === market}
                    onSelect={selectMarket}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {targets.map((targetLayouts, targetIndex) => {
        const highlight = highlights[targetIndex];
        // The banner only earns its place when there is a target after it with
        // cards in it; a short final page would otherwise end on a 960px image.
        const nextTargetHasCards = targets
          .slice(targetIndex + 1)
          .some((rest) => rest.length > 0);

        return (
          <div key={TARGET_CLASSES[targetIndex]} className="contents">
            {targetLayouts.length === 0 ? null : (
              <div
                className={cn(
                  "collectionProjects__target col-start-1 col-end-[-1] grid grid-cols-subgrid",
                  TARGET_CLASSES[targetIndex],
                )}
              >
                {targetLayouts.map((layout, layoutIndex) => {
                  const { spec, large, companions } = layout;
                  const wide = companions.length === 1;
                  return (
                    <div
                      key={large.href}
                      className={cn(
                        "collectionProjects__layout col-start-2 col-end-[-2] grid grid-cols-subgrid gap-y-[50px] pb-[50px] xl:gap-y-0",
                        `collectionProjects__layout${layoutIndex + 1}`,
                      )}
                    >
                      <ProjectCard
                        project={large}
                        notch
                        sizes="(min-width: 1280px) 50vw, 100vw"
                        className={cn(
                          "col-span-full xl:col-span-10 xl:row-start-1",
                          spec.mirrored ? "xl:col-start-11" : "xl:col-start-1",
                        )}
                      />
                      {companions.length === 0 ? null : (
                        <div
                          className={cn(
                            "collectionProjects__smallImagesWrapper col-span-full flex flex-col gap-y-[90px] md:flex-row md:gap-x-[10px] md:gap-y-0",
                            "xl:col-span-10 xl:row-start-1",
                            spec.mirrored
                              ? "xl:col-start-1 xl:flex-row-reverse"
                              : "xl:col-start-11",
                          )}
                        >
                          {companions.map((project) => (
                            <ProjectCard
                              key={project.href}
                              project={project}
                              sizes={
                                wide ? "(min-width: 1280px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"
                              }
                              // `sticky` is the source's own value, and it is
                              // what pushes the small cards down past the large
                              // one as a row scrolls by. It only has room to
                              // travel from 1280px up, where the wrapper
                              // stretches to the large card's height; below
                              // that the wrapper hugs its content and the
                              // offset is inert.
                              // `self-start` is scoped to xl for two reasons:
                              // a stretched item cannot travel, and in the
                              // column-direction wrapper below md it would
                              // shrink the card to its content width.
                              className="min-w-0 flex-1 xl:sticky xl:top-[505px] xl:self-start"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {highlight && nextTargetHasCards ? <ProjectHighlight highlight={highlight} /> : null}
          </div>
        );
      })}

      {totalPages > 1 ? (
        <div className="pagination col-start-2 col-end-[-2] mx-auto flex w-fit items-center gap-[7px] pt-[50px] md:col-start-3 md:col-end-[-3]">
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="pagination__button pagination__button--back flex h-[30px] w-[40px] cursor-pointer items-center justify-center rounded-[5px] bg-[#f8f8f8] transition-all duration-300 [transition-timing-function:cubic-bezier(0,0,0.13,0.99)] hover:bg-[#ececec] disabled:cursor-default disabled:opacity-40"
          >
            <ArrowIcon className="h-[19px] w-[19px] rotate-180" />
          </button>
          <div className="pagination__pages flex items-center gap-[7px]">
            {pageNumbers.map((number) => (
              <button
                key={number}
                type="button"
                aria-current={number === currentPage ? "page" : undefined}
                onClick={() => setPage(number)}
                className={cn(
                  "pagination__page font-XS flex h-[30px] w-[40px] cursor-pointer items-center justify-center rounded-[5px] border border-[#f8f8f8] transition-all duration-300 [transition-timing-function:cubic-bezier(0,0,0.13,0.99)]",
                  number === currentPage
                    ? "pagination__page--current bg-[#ececec]"
                    : "bg-[#f8f8f8] hover:bg-[#ececec]",
                )}
              >
                {number}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="pagination__button pagination__button--forward flex h-[30px] w-[40px] cursor-pointer items-center justify-center rounded-[5px] bg-[#f8f8f8] transition-all duration-300 [transition-timing-function:cubic-bezier(0,0,0.13,0.99)] hover:bg-[#ececec] disabled:cursor-default disabled:opacity-40"
          >
            <ArrowIcon className="h-[19px] w-[19px]" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

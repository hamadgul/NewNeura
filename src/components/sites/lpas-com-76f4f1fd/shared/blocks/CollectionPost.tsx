"use client";

/**
 * `CollectionPost` — the journal listing on /latest/.
 *
 * Anatomy, from getComputedStyle at 1440px (section 1440×2832, min-height 900):
 *   section.collectionPost           .lpas-grid, rows 408.19 / 2343.36 / 80
 *   ├ div.filterApi                  row 1, margin-top 150px, 258.19px tall
 *   │  ├ .filterApi__header          "Journal" tagline + <h2>, 65px below
 *   │  └ .filterApi__filterWrapper   rows 37.59 / 1px / 55px
 *   ├ div.collectionPost__cardWrapper row 2, row-gap 50px
 *   │  └ a.postCard × 18             flex column, 10px gap, links to Instagram
 *   └ div.pagination                 row 3, 181×80, centred
 *
 * Column counts from GRID_AREAS.json (`collectionPost__cardSize`, the sizing
 * ghost the source leaves in the grid):
 *   1440px → `2 / span 5` of 20 → 4 per row  (18 posts → rows 4/4/4/4/2 ✔)
 *    768px → `2 / span 4` of 12 → 3 per row
 *    390px → `2 / span 2` of  4 → 2 per row  (confirmed in mobile-full.png)
 *
 * Card height is image-driven: the wrapper is `align-items: flex-end` around an
 * auto-height image capped at 410px, so a square post measures 327.5px tall at
 * 1440px and the one 4:5 post (13 Mar 2026) measures 409.375px — which is
 * exactly why the measured row track 2 is 494.17px while every other track is
 * 412.30px. Keeping the intrinsic ratio (rather than forcing a square) is what
 * reproduces that.
 *
 * Every post is in the "Instagram" category, so the pill row resolves to
 * "All" + "Instagram ¹⁸". The filter is real but single-valued: it runs
 * client-side over the bundled data — nothing is fetched at runtime.
 */
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowOutIcon, ChevronIcon, InstagramIcon } from "@/components/sites/lpas-com-76f4f1fd/shared/icons";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { REVEAL_OBSERVER_INIT } from "../reveal";

export interface JournalPost {
  id: number;
  /** `.postCard__title` — body size, clamped to a fixed two-line box. */
  title: string;
  /** Preformatted by the source API, e.g. "May 21, 2026". Never re-derived. */
  date: string;
  /** The card links straight out to Instagram, as the source does. */
  href: string;
  category: string;
  image: { src: string; alt: string; width: number; height: number };
}

export interface CollectionPostProps {
  /** `.filterApi__headerTagline`. */
  tagline?: string;
  /** `.filterApi__headerIntro` `<h2>`. */
  heading?: string;
  posts?: readonly JournalPost[];
  /** Cards per page. 18 = the whole bundled set on one page, as the source shows. */
  perPage?: number;
  className?: string;
}

/**
 * All 18 posts from `latest-f798beeb/POSTS_DATASET.json` (the site's own
 * `/wp-json/filter/latest` payload), with the image pointed at the downloaded
 * 1280px srcset variant the page actually renders.
 */
export const LPAS_JOURNAL_POSTS: readonly JournalPost[] = [
  {
    id: 3871,
    title: "Instagram: 21 May 2026",
    date: "May 21, 2026",
    href: "https://www.instagram.com/p/DYnEV_MCaDg/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/705860006_18427634425120770_8881473772530157572_n-1280x0-c-default.jpg",
      alt: "Instagram: 21 May 2026",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3869,
    title: "Instagram: 12 May 2026",
    date: "May 12, 2026",
    href: "https://www.instagram.com/p/DYPz1AVicrN/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/690281835_18426242710120770_3696790314565088558_n-1280x0-c-default.jpg",
      alt: "Instagram: 12 May 2026",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3860,
    title: "Instagram: 26 Mar 2026",
    date: "March 26, 2026",
    href: "https://www.instagram.com/p/DWXNFWSEmi4/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/656239942_18419359891120770_8400189846813213265_n-1280x0-c-default.jpg",
      alt: "Instagram: 26 Mar 2026",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3856,
    title: "Instagram: 17 Mar 2026",
    date: "March 17, 2026",
    href: "https://www.instagram.com/p/DWASV2TD3bJ/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/653667598_18417016015120770_3431999040994783478_n-1280x0-c-default.jpg",
      alt: "Instagram: 17 Mar 2026",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3854,
    title: "Instagram: 13 Mar 2026",
    date: "March 13, 2026",
    href: "https://www.instagram.com/p/DV1dMSGFFGl/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/650368596_18416242555120770_3751658863105406351_n-1280x0-c-default.jpg",
      alt: "Instagram: 13 Mar 2026",
      width: 1280,
      height: 1600,
    },
  },
  {
    id: 3849,
    title: "Instagram: 06 Mar 2026",
    date: "March 6, 2026",
    href: "https://www.instagram.com/p/DVjXotGlEFs/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/645917596_18415092919120770_3490576865802946849_n-1280x0-c-default.jpg",
      alt: "Instagram: 06 Mar 2026",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3793,
    title: "Instagram: 24 Feb 2026",
    date: "February 24, 2026",
    href: "https://www.instagram.com/p/DVJtJPZkgR4/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/639743620_18413798356120770_3080851034257127091_n-1280x0-c-default.jpg",
      alt: "Instagram: 24 Feb 2026",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3634,
    title: "Instagram: 06 Feb 2026",
    date: "February 6, 2026",
    href: "https://www.instagram.com/p/DUbtrscEmWv/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/629678875_18410494183120770_3806609778747641919_n-1280x0-c-default.jpg",
      alt: "Instagram: 06 Feb 2026",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3573,
    title: "Instagram: 16 Dec 2025",
    date: "December 16, 2025",
    href: "https://www.instagram.com/p/DSVUykjD-pU/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/601371553_18402260404120770_7706348919303463038_n-1280x0-c-default.jpg",
      alt: "Instagram: 16 Dec 2025",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3575,
    title: "Instagram: 30 Oct 2025",
    date: "October 30, 2025",
    href: "https://www.instagram.com/p/DQcodyuk8Ub/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/571152120_18395933872120770_6573167260490544019_n-1280x0-c-default.jpg",
      alt: "Instagram: 30 Oct 2025",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3577,
    title: "Instagram: 23 Sep 2025",
    date: "September 23, 2025",
    href: "https://www.instagram.com/p/DO9ksR7Ej8C/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/552930284_18389008516120770_8254037727060878943_n-1280x0-c-default.jpg",
      alt: "Instagram: 23 Sep 2025",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3579,
    title: "Instagram: 27 Aug 2025",
    date: "August 27, 2025",
    href: "https://www.instagram.com/p/DN3WMCZ4h8O/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/539456341_18385365034120770_5891901945861936066_n-1280x0-c-default.jpg",
      alt: "Instagram: 27 Aug 2025",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3581,
    title: "Instagram: 28 Jul 2025",
    date: "July 28, 2025",
    href: "https://www.instagram.com/p/DMquj6KB9MD/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/525439696_18381762754120770_7192444709184175844_n-1280x0-c-default.jpg",
      alt: "Instagram: 28 Jul 2025",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3583,
    title: "Instagram: 11 Jul 2025",
    date: "July 11, 2025",
    href: "https://www.instagram.com/p/DL-XVMjxwKI/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/518812654_18379608667120770_2189618379795762948_n-1280x0-c-default.jpg",
      alt: "Instagram: 11 Jul 2025",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3585,
    title: "Instagram: 25 Jun 2025",
    date: "June 25, 2025",
    href: "https://www.instagram.com/p/DLVIgpyRi5d/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/513540630_18377666170120770_1710219849275158112_n-1280x0-c-default.jpg",
      alt: "Instagram: 25 Jun 2025",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3591,
    title: "Instagram: 06 Jan 2025",
    date: "January 6, 2025",
    href: "https://www.instagram.com/p/DEff60_vMG9/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/472430631_9541937102483643_5906846837346276025_n-1-1280x0-c-default.jpg",
      alt: "Instagram: 06 Jan 2025",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3593,
    title: "Instagram: 06 Jan 2025",
    date: "January 6, 2025",
    href: "https://www.instagram.com/p/DEff284vqYa/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/472369032_1129992341841948_1222548079553134389_n-1-1280x0-c-default.jpg",
      alt: "Instagram: 06 Jan 2025",
      width: 1280,
      height: 1280,
    },
  },
  {
    id: 3595,
    title: "Instagram: 06 Jan 2025",
    date: "January 6, 2025",
    href: "https://www.instagram.com/p/DEff0EiP9g-/",
    category: "Instagram",
    image: {
      src: "/sites/lpas-com-76f4f1fd/latest-f798beeb/images/472463193_607209958518487_2971062558773180837_n-1-1280x0-c-default.jpg",
      alt: "Instagram: 06 Jan 2025",
      width: 1280,
      height: 1280,
    },
  },
];

const ALL_FILTER = "All";

/** 2 of 4 → 4 of 12 → 5 of 20 tracks, i.e. 2 / 3 / 4 cards per row. */
const CELL_SPAN = "col-span-2 md:col-span-4 xl:col-span-5";

interface PostCardProps {
  post: JournalPost;
}

function PostCard({ post }: PostCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isRevealed = revealed || reduceMotion;

  useEffect(() => {
    if (reduceMotion) return;
    const node = cardRef.current;
    if (!node) return;

    // Observe the anchor, not the wiping element: `.lpas-image-reveal` starts
    // at `clip-path: inset(100% 0 0)`, so its own intersection ratio is pinned
    // at 0 and a reveal driven off it would never fire.
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
    <a
      ref={cardRef}
      href={post.href}
      target="_blank"
      rel="noreferrer"
      className={cn("postCard group relative flex flex-col gap-[10px]", CELL_SPAN)}
    >
      {/* The orange ground is the source's placeholder colour, visible for the
          instant before the image paints. `items-end` + an auto-height image is
          what lets a 4:5 post grow the row while squares stay square. */}
      <div className="postCard__imageWrapper flex items-end overflow-hidden bg-[#ffa500]">
        <div className={cn("lpas-image-reveal w-full", isRevealed && "is-revealed")}>
          <Image
            src={post.image.src}
            alt={post.image.alt}
            width={post.image.width}
            height={post.image.height}
            sizes="(min-width: 1280px) 328px, (min-width: 768px) 223px, 165px"
            className={cn(
              "postCard__image h-auto max-h-[410px] w-full object-cover",
              // Measured resting transform is `matrix(1.02)` with
              // `transition: transform .3s` — the zoom lives on the image so it
              // never races the wrapper's 1.2s clip-path wipe.
              "scale-[1.02] transition-[scale] duration-300 ease-in-out group-hover:scale-[1.06]",
            )}
          />
        </div>
      </div>

      <div className="postCard__textWrapper mt-[15px] flex flex-col">
        <span className="postCard__date font-XS block">{post.date}</span>
        {/* Fixed 43px = two 21.6px lines. The box is two lines tall even when
            the title only needs one, which is what keeps the desktop row
            tracks at a flat 412.30px. */}
        <span className="postCard__title line-clamp-2 h-[43px] leading-[21.6px]">
          {post.title}
        </span>
      </div>

      <div className="postCard__labelWrapper pointer-events-none absolute inset-x-[10px] top-[10px] flex flex-wrap justify-end gap-[10px]">
        <span className="postCard__label--insta font-XS flex h-[30px] w-[45px] items-center justify-center rounded-[5px] bg-[rgba(14,14,14,0.6)] text-[#d6d6d6] backdrop-blur-[20px]">
          <InstagramIcon className="h-[19px] w-[19px] shrink-0 transition-opacity duration-150 ease-[cubic-bezier(0,0,0.13,0.99)]" />
          {/* The source records `transition: transform .3s` on this second
              glyph only — it is the one that moves on hover. */}
          <ArrowOutIcon className="h-[19px] w-[19px] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0,0,0.13,0.99)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
        </span>
      </div>
    </a>
  );
}

interface PaginationProps {
  page: number;
  pageCount: number;
  onSelect: (page: number) => void;
}

/** Measured: four 40×30 chips, 7px apart (181px overall), centred in an 80px row. */
function Pagination({ page, pageCount, onSelect }: PaginationProps) {
  const chip =
    "flex h-[30px] w-[40px] items-center justify-center rounded-[5px] transition-colors duration-300 disabled:cursor-default disabled:opacity-40";

  return (
    <div className="pagination col-start-[main-start] col-end-[main-end] row-start-3 flex h-[80px] items-center justify-center gap-[7px]">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onSelect(page - 1)}
        className={cn(chip, "cursor-pointer bg-[#f8f8f8] text-[#262626]")}
      >
        <ChevronIcon className="h-[19px] w-[19px] rotate-180" />
      </button>

      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          type="button"
          aria-current={number === page ? "page" : undefined}
          onClick={() => onSelect(number)}
          className={cn(
            chip,
            "font-XS cursor-pointer text-[#262626]",
            number === page ? "bg-[#ececec]" : "bg-[#f8f8f8]",
          )}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onSelect(page + 1)}
        className={cn(chip, "cursor-pointer bg-[#f8f8f8] text-[#262626]")}
      >
        <ChevronIcon className="h-[19px] w-[19px]" />
      </button>
    </div>
  );
}

export function CollectionPost({
  tagline = "Journal",
  heading = "Stay up to date with everything that happens at LPAS.",
  posts = LPAS_JOURNAL_POSTS,
  perPage = 18,
  className,
}: CollectionPostProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [headerRevealed, setHeaderRevealed] = useState(false);
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER);
  const [page, setPage] = useState(1);
  const reduceMotion = usePrefersReducedMotion();
  const isHeaderRevealed = headerRevealed || reduceMotion;

  useEffect(() => {
    if (reduceMotion) return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderRevealed(true);
          observer.disconnect();
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  // "All" plus one pill per distinct category, counted — which is where
  // "Instagram 18" comes from. Derived, so it stays honest if the data changes.
  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return [
      { label: ALL_FILTER, count: undefined as number | undefined },
      ...[...counts].map(([label, count]) => ({ label, count })),
    ];
  }, [posts]);

  const filtered = useMemo(
    () =>
      activeCategory === ALL_FILTER
        ? posts
        : posts.filter((post) => post.category === activeCategory),
    [posts, activeCategory],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  // Clamp rather than reset in an effect: switching filters can shrink the set
  // under the current page, and rendering the last valid page immediately beats
  // painting an empty grid for one frame.
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  function selectCategory(label: string) {
    setActiveCategory(label);
    setPage(1);
  }

  return (
    <section
      ref={sectionRef}
      className={cn("collectionPost lpas-grid min-h-[900px] text-[#111111]", className)}
    >
      {/* Below 1280px the pill row bleeds 10px past `main` to the page gutters
          (measured 360px wide at 390px, against the 340px tagline rule above
          it); at 1280px+ both sit flush on `main`. */}
      <div className="filterApi col-start-[main-start] col-end-[main-end] row-start-1 mt-[150px] grid grid-cols-subgrid">
        <div
          className={cn(
            "filterApi__header lpas-reveal col-span-full mb-[65px] grid grid-cols-subgrid",
            isHeaderRevealed && "is-revealed",
          )}
        >
          <div className="filterApi__headerTagline font-XS col-span-full mb-[30px] border-b border-[#d6d6d6] pb-[10px] text-[#595656]">
            <span>{tagline}</span>
          </div>
          <div className="filterApi__headerIntro font-L col-start-1 col-end-[-1] xl:col-end-[-2]">
            <h2>{heading}</h2>
          </div>
        </div>

        <div className="filterApi__filterWrapper col-span-full -mx-[10px] grid grid-rows-[auto_1px_55px] xl:mx-0">
          <div className="filterApi__Overflow filterApi__Overflow--one relative row-start-1 overflow-hidden">
            {/* `pl-[10px]` puts the first pill back on `main-start` while the
                hairline below keeps its wider gutter-to-gutter measure. */}
            <div className="filterApi__Wrapper flex gap-[30px] overflow-x-auto whitespace-nowrap pl-[10px] [scrollbar-width:none] xl:pl-0 [&::-webkit-scrollbar]:hidden">
              {filters.map((filter) => {
                const isActive = filter.label === activeCategory;
                return (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={() => selectCategory(filter.label)}
                    className={cn(
                      "filterApi__item z-[3] flex cursor-pointer items-start gap-[2px] border-b pb-[15px] text-center transition-colors duration-300",
                      isActive
                        ? "border-[#262626] text-[#262626]"
                        : "border-[#d6d6d6] text-[#595656]",
                    )}
                  >
                    <span>{filter.label}</span>
                    {/* `align-items: flex-start` on the button is what raises
                        the count into a superscript — no vertical-align hack. */}
                    {filter.count === undefined ? null : (
                      <span className="font-XS">{filter.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="filterApi__Line z-[2] -mt-px h-px bg-[#d6d6d6]" />
          <div className="filterApi__Overflow relative h-[55px] overflow-hidden" />
        </div>
      </div>

      <div className="collectionPost__cardWrapper col-start-[main-start] col-end-[main-end] row-start-2 grid grid-cols-subgrid gap-y-[50px]">
        {visible.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* The live page draws a two-page control while still serving all 18
          posts on page one — a server-side count quirk we don't reproduce.
          Here the control is real and derived from `perPage`, and the row is
          always rendered because the section's third track is a fixed 80px. */}
      <Pagination page={currentPage} pageCount={pageCount} onSelect={setPage} />
    </section>
  );
}

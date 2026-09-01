"use client";

/**
 * `CollectionTeam` — the 45-cell people grid that closes /about/.
 *
 * Anatomy, from getComputedStyle at 1440px (section 1440×4309):
 *   section.collectionTeam         .lpas-grid, bg #f8f8f8, margin-top 100px,
 *   │                              padding-bottom 100px, rows 408.19 / 3801.11
 *   ├ div.filterApi                row 1, margin-top 150px, 258.19px tall
 *   │  ├ div.filterApi__header     margin-bottom 65px
 *   │  │  ├ .filterApi__headerTagline.font-XS  "Our team", 10px pad + 1px rule,
 *   │  │  │                                     30px bottom margin, #595656
 *   │  │  └ .filterApi__headerIntro.font-L     <h2>, spans main minus one column
 *   │  └ div.filterApi__filterWrapper  rows 37.59 / 1px / 55px
 *   └ div.collectionTeam__cardWrapper  row 2, margin-top 25px, row-gap 50px,
 *      └ a.memberCard × 38 + 7 invisible spacer cells, in source DOM order
 *
 * Column counts, back-solved from GRID_AREAS.json plus the mobile capture
 * (the JSON's heights are a mid-lazy-load snapshot of 25 cards, so the row
 * *counts* are what's load-bearing, not the pixel totals):
 *   1440px → span 4 of 20 → 5 per row  (25 cards resolve to exactly 5 rows)
 *    768px → span 4 of 12 → 3 per row  (9 rows → 3301px measured ✔)
 *    390px → span 2 of  4 → 2 per row  (13 rows → 3896px measured ✔, and the
 *                                       mobile screenshot shows two columns)
 * Since ≥768px and ≥1280px both span 4 tracks, one `md:` step covers both.
 *
 * The cards link to `/team/<slug>/`. Those bio pages are out of scope for this
 * clone and will 404 — the hrefs are kept anyway because dropping them would
 * change the markup, the hover affordance and the 45 measured `linkCount`.
 *
 * The section carries `data-nofilter="true"` yet still *renders* the four
 * pills (All / Leadership / Sacramento / Oakland) — confirmed in
 * `block-CollectionTeam.png`. So the control is drawn, and `nofilter` is what
 * makes it inert: nothing in the recon exposes a per-person taxonomy, so the
 * pills only move their active rule. `onFilterChange` is the hook a later pass
 * can use to wire real filtering without touching this file's markup.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { REVEAL_OBSERVER_INIT } from "../reveal";

export interface TeamMemberItem {
  kind: "member";
  /** `<h3.memberCard__name>` — body size, 8px above the role. */
  name: string;
  /** `<div.memberCard__department.font-XS>` — muted, clamped to two lines. */
  role: string;
  href: string;
  image: { src: string; alt: string; width: number; height: number };
}

/**
 * `a.memberCard--space` in the source: a full-height, `opacity: 0` card that
 * holds a grid cell open. Seven of them punctuate the 45-cell run, and they
 * are what makes the grid read as a scattered mosaic rather than a table.
 */
export interface TeamSpacerItem {
  kind: "spacer";
}

export type TeamGridItem = TeamMemberItem | TeamSpacerItem;

export interface TeamFilterItem {
  label: string;
  /** Rendered as a raised `.font-XS` sibling, e.g. "Instagram ¹⁸". Unused here. */
  count?: number;
}

export interface CollectionTeamProps {
  /** `.filterApi__headerTagline` — the small label above the rule. */
  tagline?: string;
  /** `.filterApi__headerIntro` `<h2>`. */
  heading?: string;
  filters?: readonly TeamFilterItem[];
  /** Index of the initially active pill. */
  initialFilter?: number;
  onFilterChange?: (index: number) => void;
  /** Cards *and* spacers, in source DOM order. */
  items?: readonly TeamGridItem[];
  className?: string;
}

export const LPAS_TEAM_FILTERS: readonly TeamFilterItem[] = [
  { label: "All" },
  { label: "Leadership" },
  { label: "Sacramento" },
  { label: "Oakland" },
];

/**
 * The live grid, verbatim: 38 people and the 7 spacer cells, in the exact
 * order the source ships them. Names, roles and image basenames come from
 * `about-4f10f17b/RECON.json`; the roles the recon truncates were read off
 * `block-CollectionTeam.png`.
 */
export const LPAS_TEAM_ITEMS: readonly TeamGridItem[] = [
  {
    kind: "member",
    name: "Tom Hall",
    role: "Associate, Project Architect",
    href: "/team/tom-hall/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Tom-Hall_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Tom Hall",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Michael Rhoades",
    role: "Associate, Project Manager",
    href: "/team/michael-rhoades/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Michael-Rhoades_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Michael Rhoades",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Melissa Sabala",
    role: "Payroll & Project Accountant",
    href: "/team/melissa-sabala/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Melissa-Sabala_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Melissa Sabala",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Ron Metzker",
    role: "Vice President, Principal",
    href: "/team/ron-metzker/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Ron-Metzker_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Ron Metzker",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Bryan Harry",
    role: "Associate Principal, Senior Project Designer",
    href: "/team/bryan-harry/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Bryan-Harry_LPAS_SMALL-1280x1600-c-default.jpg",
      alt: "Bryan Harry",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Briana Cepeda",
    role: "Bookkeeper",
    href: "/team/briana-cepeda/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Briana-Cepeda_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Briana Cepeda",
      width: 1280,
      height: 1600,
    },
  },
  { kind: "spacer" },
  {
    kind: "member",
    name: "Ray Welter",
    role: "Associate, Senior Project Architect",
    href: "/team/ray-welter/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Ray-Welter_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Ray Welter",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Glenn Ovitt",
    role: "Associate, Project Manager",
    href: "/team/glenn-ovitt/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Glenn_Full-Res-copy-1280x1600-c-default.jpg",
      alt: "Glenn Ovitt",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Yovani Trujillo",
    role: "Job Captain",
    href: "/team/yovani-trujillo/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Yovani-Trujillo_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Yovani Trujillo",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Craig Speck",
    role: "Job Captain",
    href: "/team/craig-speck/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Craig-Speck_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Craig Speck",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Heidi Roseler-Kerby",
    role: "Project Administrator",
    href: "/team/heidi-roseler-kerby/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Heidi-Roseler-Kerby_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Heidi Roseler-Kerby",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Morgan Tauzer",
    role: "Project Coordinator",
    href: "/team/morgan-tauzer/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Morgan-Tauzer_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Morgan Tauzer",
      width: 1280,
      height: 1600,
    },
  },
  { kind: "spacer" },
  {
    kind: "member",
    name: "Mervin Villar",
    role: "Construction Administrator",
    href: "/team/mervin-villar/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Mervin-Villar_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Mervin Villar",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Ryan Townsend",
    role: "Associate Principal, Senior Designer",
    href: "/team/ryan-townsend/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Ryan-Townsend_LPAS.jpg-1280x1600-c-default.jpg",
      alt: "Ryan Townsend",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Christian Montanez",
    role: "Job Captain",
    href: "/team/christian-montanez/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Christian-Montanez_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Christian Montanez",
      width: 1280,
      height: 1600,
    },
  },
  { kind: "spacer" },
  {
    kind: "member",
    name: "Sophie Metzker",
    role: "Accounting Assistant",
    href: "/team/sophie-metzker/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Sophie-Metzker_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Sophie Metzker",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Nick Shanks",
    role: "Project Architect",
    href: "/team/nick-shanks/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Nick-Shanks_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Nick Shanks",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Angelique Dionisio",
    role: "Interior Designer",
    href: "/team/angelique-dionisio/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Angelique-Dionisio_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Angelique Dionisio",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Shaahin Davami",
    role: "Job Captain",
    href: "/team/shaahin-davami/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Shaahin-Davami_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Shaahin Davami",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Pat Walton",
    role: "Project Coordinator",
    href: "/team/pat-walton/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Pat-Walton_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Pat Walton",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "David Oliveira",
    role: "Project Architect",
    href: "/team/david-oliveira/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/David-Oliveira_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "David Oliveira",
      width: 1280,
      height: 1600,
    },
  },
  { kind: "spacer" },
  {
    kind: "member",
    name: "Krista McCord",
    role: "Office & IT Administrator",
    href: "/team/krista-mccord/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Krista-McCord_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Krista McCord",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Ky Huynh",
    role: "Designer",
    href: "/team/ky-huynh/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Ky-Huynh_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Ky Huynh",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Kyle Lamb",
    role: "Senior Interior Designer",
    href: "/team/kyle-lamb/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Kyle-Lamb_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Kyle Lamb",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Chris Kelly",
    role: "Vice President, Principal",
    href: "/team/chris-kelly/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Chris-Kelly_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Chris Kelly",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Matt Dalforno",
    role: "Associate, Director of Marketing",
    href: "/team/matt-dalforno/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Matt-Dalforno_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Matt Dalforno",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Becky McCormick",
    role: "Associate, Senior Project Architect",
    href: "/team/becky-mccormick/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Becky-McCormick_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Becky McCormick",
      width: 1280,
      height: 1600,
    },
  },
  { kind: "spacer" },
  {
    kind: "member",
    name: "Brady Smith",
    role: "President",
    href: "/team/brady-smith/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Brady-Smith_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Brady Smith",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Lacey Oxford",
    role: "Interior Designer",
    href: "/team/lacey-oxford/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Lacey-Oxford_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Lacey Oxford",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Lori Winsor",
    role: "Business Development Manager",
    href: "/team/lori-winsor/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Lori-Winsor_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Lori Winsor",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Laurel Chavez",
    role: "Associate, Contract Manager",
    href: "/team/laurel-chavez/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Laurel-Chavez_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Laurel Chavez",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Kristina Gwinn",
    role: "Vice President, Senior Interior Designer",
    href: "/team/kristina-gwinn/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Kristina-Gwinn_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Kristina Gwinn",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Kim Moore",
    role: "Associate Principal, Director of Human Resources",
    href: "/team/kim-moore/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Kim-Moore_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Kim Moore",
      width: 1280,
      height: 1600,
    },
  },
  { kind: "spacer" },
  {
    kind: "member",
    name: "Bethanie Taylor",
    role: "Project Administrative Assistant",
    href: "/team/bethanie-taylor/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Bethanie-Taylor_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Bethanie Taylor",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Ken Bauer",
    role: "Principal, Director of Quality Control / Senior Project Manager",
    href: "/team/ken-bauer/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Ken-Bauer_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Ken Bauer",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Karina Welch",
    role: "Project Coordinator",
    href: "/team/karina-welch/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Karina-Welch_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Karina Welch",
      width: 1280,
      height: 1600,
    },
  },
  { kind: "spacer" },
  {
    kind: "member",
    name: "Manuel Vivar-Nieto",
    role: "Senior Project Designer",
    href: "/team/manuel-vivar-nieto/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Manuel-Vivar-Nieto_V2_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Manuel Vivar-Nieto",
      width: 1280,
      height: 1600,
    },
  },
  {
    kind: "member",
    name: "Kristopher Maddox",
    role: "Principal, Higher Education",
    href: "/team/kristopher-maddox/",
    image: {
      src: "/sites/lpas-com-76f4f1fd/about-4f10f17b/images/Kristopher-Maddox_LPAS_FULLSIZE-1280x1600-c-default.jpg",
      alt: "Kristopher Maddox",
      width: 1280,
      height: 1600,
    },
  },
];

/**
 * The decorative 20px corner notch, measured on exactly the cards that flank a
 * spacer: the first card of every contiguous run of members gets a clipped
 * top-left corner, the last card of every run gets a clipped bottom-right one.
 * (Verified against all seven notched cards in the styles dump — Tom Hall,
 * Briana Cepeda, Ray Welter, Morgan Tauzer, Mervin Villar, Christian Montanez,
 * Sophie Metzker — and against Ray Welter / Morgan Tauzer in the 390px capture,
 * which proves the notch is per-card DOM state, not per-row geometry.)
 */
const NOTCH_TOP_LEFT = "[clip-path:polygon(20px_0,100%_0,100%_100%,0_100%,0_20px)]";
const NOTCH_BOTTOM_RIGHT =
  "[clip-path:polygon(0_0,100%_0,100%_calc(100%_-_20px),calc(100%_-_20px)_100%,0_100%)]";

/** Both breakpoints below 1280px span 4 tracks; only the base tier differs. */
const CELL_SPAN = "col-span-2 md:col-span-4";

function notchFor(items: readonly TeamGridItem[], index: number): string | undefined {
  if (items[index]?.kind !== "member") return undefined;
  const startsRun = items[index - 1]?.kind !== "member";
  const endsRun = items[index + 1]?.kind !== "member";
  // A one-card run would want both corners; the source has none, and CSS can
  // only carry one clip-path anyway, so the opening notch wins.
  if (startsRun) return NOTCH_TOP_LEFT;
  if (endsRun) return NOTCH_BOTTOM_RIGHT;
  return undefined;
}

interface MemberCardProps {
  member: TeamMemberItem;
  notch?: string;
}

function MemberCard({ member, notch }: MemberCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isRevealed = revealed || reduceMotion;

  useEffect(() => {
    if (reduceMotion) return;
    const node = cardRef.current;
    if (!node) return;

    // Observe the anchor, never the wiping element. `.lpas-image-reveal` starts
    // at `clip-path: inset(100% 0 0)` — zero visible area — so an observer
    // pointed at it reports ratio 0 forever and the headshot never appears.
    // The anchor is the nearest ancestor with no clip-path of its own.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect(); // one-shot, like every reveal on the source
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <a ref={cardRef} href={member.href} className={cn("memberCard group flex flex-col", CELL_SPAN)}>
      {/* Three nested elements because three effects need to not collide:
          the notch owns this element's clip-path, the wipe owns the next
          element's clip-path + transform, and the hover zoom owns the image's
          own `scale`. Two clip-paths cannot share one element at all. */}
      <div className={cn("memberCard__imageWrapper aspect-[4/5] overflow-clip", notch)}>
        <div className={cn("lpas-image-reveal h-full w-full", isRevealed && "is-revealed")}>
          <Image
            src={member.image.src}
            alt={member.image.alt}
            width={member.image.width}
            height={member.image.height}
            sizes="(min-width: 1280px) 260px, (min-width: 768px) 223px, 165px"
            className={cn(
              "memberCard__image h-full w-full object-cover",
              // Measured resting state: `filter: grayscale(1)` on a
              // `matrix(1.02)` base, with `transition: transform .3s, filter .3s`
              // — the transition list is the source's own record that both
              // properties move on hover.
              "scale-[1.02] grayscale transition-[scale,filter] duration-300 ease-in-out",
              "group-hover:scale-[1.06] group-hover:grayscale-0",
            )}
          />
        </div>
      </div>
      <h3 className="memberCard__name mt-[8px] text-[#111111] leading-[21.6px]">{member.name}</h3>
      <div className="memberCard__department font-XS line-clamp-2 text-[#595656]">
        {member.role}
      </div>
    </a>
  );
}

export function CollectionTeam({
  tagline = "Our team",
  heading = "People shape the spaces we design, and how we think.",
  filters = LPAS_TEAM_FILTERS,
  initialFilter = 0,
  onFilterChange,
  items = LPAS_TEAM_ITEMS,
  className,
}: CollectionTeamProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [headerRevealed, setHeaderRevealed] = useState(false);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
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

  function selectFilter(index: number) {
    setActiveFilter(index);
    onFilterChange?.(index);
  }

  return (
    <section
      ref={sectionRef}
      data-nofilter="true"
      className={cn(
        "collectionTeam lpas-grid mt-[100px] bg-[#f8f8f8] pb-[100px] text-[#111111]",
        className,
      )}
    >
      {/* Below 1280px the filter block bleeds out of `main` to the page
          gutters (measured: its rule runs 15…375 of 390, i.e. 360px, against
          the 340px tagline rule directly above it); at 1280px+ both sit on
          `main` (50…1390 of 1440). */}
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
                rule beneath it keeps its wider, gutter-to-gutter measure. */}
            <div className="filterApi__Wrapper flex gap-[30px] overflow-x-auto whitespace-nowrap pl-[10px] [scrollbar-width:none] xl:pl-0 [&::-webkit-scrollbar]:hidden">
              {filters.map((filter, index) => {
                const isActive = index === activeFilter;
                return (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={() => selectFilter(index)}
                    className={cn(
                      "filterApi__item z-[3] flex cursor-pointer items-start gap-[2px] border-b pb-[15px] text-center transition-colors duration-300",
                      isActive
                        ? "border-[#262626] text-[#262626]"
                        : "border-[#d6d6d6] text-[#595656]",
                    )}
                  >
                    <span>{filter.label}</span>
                    {filter.count === undefined ? null : (
                      <span className="font-XS">{filter.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          {/* -1px pulls this hairline under the buttons' own bottom borders, so
              the active pill's dark rule reads as a continuation of it. */}
          <div className="filterApi__Line z-[2] -mt-px h-px bg-[#d6d6d6]" />
          {/* The empty 55px second-level filter row. It carries no controls on
              this page but is part of the block's measured 258.19px height. */}
          <div className="filterApi__Overflow relative h-[55px] overflow-hidden" />
        </div>
      </div>

      <div className="collectionTeam__cardWrapper col-start-[main-start] col-end-[main-end] row-start-2 mt-[25px] grid min-h-[720px] grid-cols-subgrid gap-y-[50px]">
        {items.map((item, index) =>
          item.kind === "spacer" ? (
            <span
              key={`spacer-${index}`}
              aria-hidden="true"
              className={cn("memberCard memberCard--space opacity-0", CELL_SPAN)}
            />
          ) : (
            <MemberCard key={item.href} member={item} notch={notchFor(items, index)} />
          ),
        )}
      </div>
    </section>
  );
}

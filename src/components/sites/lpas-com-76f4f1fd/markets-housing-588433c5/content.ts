/**
 * Verbatim content for `/markets/housing/` — the parent Housing market page.
 * site-key `lpas-com-76f4f1fd` · page-key `markets-housing-588433c5`
 *
 * Every string was read from the live DOM and is reproduced from
 * `docs/research/lpas-com-76f4f1fd/markets-housing-588433c5/CONTENT.json`
 * without paraphrase. Image paths are the `local` fields from that same file;
 * `width`/`height` are the assets' *natural* pixel sizes (verified against the
 * downloaded WebP headers), not the rendered box, because `next/image` wants
 * the intrinsic ratio.
 *
 * ── Template note for the eight sibling market pages ─────────────────────────
 * This file is the pattern the remaining market routes follow. Each export is
 * typed with the *shared block's own props interface*, so a sibling's content
 * file is structurally identical and the compiler catches a mis-shaped layout
 * (e.g. handing `layoutOne` three tiles) before the page ever renders.
 *
 * A sibling changes exactly these things:
 *   1. `IMG` — its own page-key directory.
 *   2. `META` — title/canonical, and `description` once a page has one.
 *   3. `HEADER.market` (drives the accent ground + default tone) and
 *      `HEADER.title` / `subtitle` / `image`. Only Housing has `subPages`;
 *      the other four parent markets omit the key entirely. Child pages swap
 *      `eyebrow` for `backLink`, drop `titleSize`, and mark one sub-page
 *      `current: true`.
 *   4. `INTRO.labels` / `statement` / `body`.
 *   5. `PROJECTS.title` + `button.title` (the block's header comment records
 *      the verbatim per-page casing — "Highlighted projects" vs "Highlighted
 *      Projects", and "All Higher  Education" keeps its double space) and the
 *      `layouts` sequence, which is measured per page and differs on every one.
 *   6. Sub-market pages additionally insert the pinned process block between
 *      `INTRO` and `PROJECTS`; this parent page has none.
 */
import type {
  BlockHeaderMarketsProps,
  MarketSubPageLink,
} from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import type { BlockIntroDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import type { BlockProjectsHighlightProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import type { ProjectCard } from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/markets-housing-588433c5/images";

/**
 * Route metadata. The source serves this title unsuffixed and with an em dash,
 * so it cannot go through the root layout's "%s - LPAS Architecture" template.
 *
 * The live page ships **no** `<meta name="description">` (CONTENT.json records
 * `metaDescription: null`), so none is invented here — see the page module.
 */
export const META = {
  title: "LPAS — Housing",
  canonical: "/markets/housing/",
  /** Absolute, as the source emits it — used for the OG `url`. */
  sourceUrl: "https://lpas.com/markets/housing/",
} as const;

/**
 * The four child markets, in source DOM order (which is *not* alphabetical and
 * is not the order the copy lists them in further down the page).
 *
 * Exported separately because the four sub-market pages render this same list
 * as their sibling nav, with one entry flagged `current: true`.
 */
export const HOUSING_SUB_PAGES: MarketSubPageLink[] = [
  { title: "Affordable Housing", href: "/markets/housing/affordable-housing/" },
  { title: "Student Housing", href: "/markets/housing/student-housing/" },
  { title: "Market Rate Housing", href: "/markets/housing/market-rate-housing/" },
  { title: "Senior Housing", href: "/markets/housing/senior-housing/" },
];

/**
 * Parent-market header: eyebrow (not a back link), `font-3XL` title, and the
 * child-market grid that only Housing has.
 *
 * `market: "housing"` selects the `--lpas-housing` (#625653) ground, which the
 * block's tone table already pairs with white type — matching the measured
 * `rgb(255,255,255)` on `.blockHeaderMarkets__content`. `titleSize` is passed
 * explicitly even though `3XL` is the no-`backLink` default, because the 75px
 * vs 56px step is the single clearest difference between a parent page and a
 * child page and is worth stating at the call site.
 */
export const HEADER: BlockHeaderMarketsProps = {
  market: "housing",
  eyebrow: "Our focus on",
  subtitle: "Residential Housing",
  title: "Housing",
  titleSize: "3XL",
  subPages: HOUSING_SUB_PAGES,
  image: {
    src: `${IMG}/08_The-Emery-1440x955-c-default.webp`,
    // The source ships this decorative (alt=""); it is a crop of The Emery.
    alt: "",
    width: 1440,
    height: 955,
  },
};

/**
 * Single static caption (not the two-tab variant) plus three body paragraphs.
 *
 * The source renders all three inside one `<p>` separated by blank lines; they
 * are split here so the block's `[&>p+p]:mt-[21.6px]` rhythm reproduces the
 * rendered paragraph breaks instead of collapsing them to a single run.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Residential Housing"],
  statement:
    "Every housing market demands a distinct strategy shaped by its community, funding structure, regulatory environment, and long-term vision.",
  body: [
    "At LPAS, we understand that affordable, student, market rate, and senior housing each require a highly targeted approach. From financing complexities and entitlement pathways to resident experience and operational performance, no two sectors are the same. That is why we have developed dedicated focus areas for each housing type, allowing us to tailor our process, design strategies, and partnerships to the specific needs of every market.",
    "Our experience across multiple housing sectors strengthens our expertise within each one. Insights gained from student housing inform efficiencies in market rate developments. Lessons from affordable housing deepen our understanding of funding and community engagement. Senior housing reinforces our focus on livability, wellness, and long-term adaptability. This cross-sector knowledge enables us to deliver housing solutions that are thoughtful, resilient, and responsive to all communities.",
    "Explore the housing markets above to learn more about our approach to Affordable Housing, Student Housing, Market Rate Housing, and Senior Housing, and discover how our targeted strategies create lasting value.",
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — seven tiles across layouts one / five / three
 * ------------------------------------------------------------------ *
 *
 * Locations and hrefs cross-checked against
 * `docs/research/lpas-com-76f4f1fd/portfolio-81ee5030/PROJECTS_DATASET.json`.
 * The images are this page's own crops (from its CONTENT.json), which is why
 * e.g. The Emery appears here at 1440×993 rather than the 1280×800 tile crop
 * the portfolio grid serves.
 *
 * The source ships every one of these with `alt=""`; the pass-1 convention is
 * to restate the project title instead, so the tiles are not silent to screen
 * readers. Kept.
 */

const MADISON_BY_LENNAR: ProjectCard = {
  title: "Madison by Lennar Condominiums",
  location: "San Francisco, CA",
  href: "/portfolio/madison-by-lennar-condominiums/",
  image: {
    src: `${IMG}/09_Block-52_Madison-by-Lennar-1280x800-c-default.webp`,
    alt: "Madison by Lennar Condominiums",
    width: 1280,
    height: 800,
  },
  size: "large",
};

const THE_FREDERIC: ProjectCard = {
  title: "The Frederic",
  location: "Sacramento, CA",
  href: "/portfolio/the-frederic/",
  image: {
    src: `${IMG}/05_FREDERIC_Storefront-1280x800-c-default.webp`,
    alt: "The Frederic",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const ALWELL_PLEASANT_HILL: ProjectCard = {
  title: "Alwell Pleasant Hill",
  location: "Pleasant Hill, CA",
  href: "/portfolio/alwell-pleasant-hill/",
  image: {
    src: `${IMG}/08_Alwell_FULLSIZE-1280x800-c-default.webp`,
    alt: "Alwell Pleasant Hill",
    width: 1280,
    height: 800,
  },
  size: "small",
};

/** Layout five's full-bleed tile — the wide 1440×993 crop, not a grid tile. */
const THE_EMERY: ProjectCard = {
  title: "The Emery",
  location: "Emeryville, CA",
  href: "/portfolio/the-emery/",
  image: {
    src: `${IMG}/11_The-Emery-1440x993-c-default.webp`,
    alt: "The Emery",
    width: 1440,
    height: 993,
  },
  size: "large",
};

const THE_AJ: ProjectCard = {
  title: "The A.J.",
  location: "Sacramento, CA",
  href: "/portfolio/the-a-j/",
  image: {
    src: `${IMG}/02_The-AJ_FULLSIZE-1280x800-c-default.webp`,
    alt: "The A.J.",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const NINE_EIGHTY_CENTRAL: ProjectCard = {
  title: "980 Central",
  location: "West Sacramento, CA",
  href: "/portfolio/980-central/",
  image: {
    src: `${IMG}/04_980-Central-1280x800-c-default.webp`,
    alt: "980 Central",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const PROSPERA_AT_FIDDYMENT_RANCH: ProjectCard = {
  title: "Prospera at Fiddyment Ranch",
  location: "Roseville, CA",
  href: "/portfolio/prospera-at-fiddyment-ranch/",
  image: {
    src: `${IMG}/DJI_0490_1-1280x800-c-default.webp`,
    alt: "Prospera at Fiddyment Ranch",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/**
 * Header copy is verbatim: lowercase "projects", and "All Housing" on the
 * button. Both the header button and layout three's footer button point at the
 * same market-filtered portfolio URL — the query string is part of the href,
 * so the filter row on `/portfolio/` picks it up.
 *
 * Layout order (one → five → three) is measured, not chosen: BLOCKS.json
 * records `__layoutOne` (521px), `__layoutFive` (974px), `__layoutThree`
 * (521px) as this block's three children after its header.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Highlighted projects",
  button: { title: "All Housing", href: "/portfolio/?market=housing" },
  layouts: [
    {
      variant: "one",
      large: MADISON_BY_LENNAR,
      small: [THE_FREDERIC, ALWELL_PLEASANT_HILL],
    },
    { variant: "five", project: THE_EMERY },
    {
      variant: "three",
      small: [THE_AJ, NINE_EIGHTY_CENTRAL],
      large: PROSPERA_AT_FIDDYMENT_RANCH,
      footer: {
        title: "View all Housing",
        buttonTitle: "Portfolio",
        buttonHref: "/portfolio/?market=housing",
      },
    },
  ],
};

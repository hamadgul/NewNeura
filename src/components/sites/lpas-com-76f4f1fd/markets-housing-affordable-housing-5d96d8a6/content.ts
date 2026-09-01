/**
 * Verbatim content for `/markets/housing/affordable-housing/` — a *child* of the
 * Housing market.
 * site-key `lpas-com-76f4f1fd` · page-key `markets-housing-affordable-housing-5d96d8a6`
 *
 * Follows the template established by
 * `markets-housing-588433c5/content.ts`; see that file's header for the list of
 * things a sibling changes. Every string below was read from
 * `docs/research/lpas-com-76f4f1fd/markets-housing-affordable-housing-5d96d8a6/CONTENT.json`
 * without paraphrase.
 *
 * Image `width`/`height` are the assets' *intrinsic* sizes, taken from
 * `docs/research/lpas-com-76f4f1fd/IMAGE_DIMENSIONS.json` (decoded from the
 * downloaded files) — **not** from CONTENT.json's `w`/`h`, which record whatever
 * srcset variant lazysizes happened to have loaded and are wrong for most
 * images. Only the `local` paths come from CONTENT.json.
 */
import {
  HOUSING_SUB_PAGES,
} from "@/components/sites/lpas-com-76f4f1fd/markets-housing-588433c5/content";
import type {
  BlockHeaderMarketsProps,
  MarketSubPageLink,
} from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import type { BlockIntroDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import type { BlockProcessCardSliderProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import type { BlockProjectsHighlightProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
/*
 * The presets live in `content-presets.ts`, not in the block modules: those are
 * `"use client"`, and a plain value imported from a client module reaches a
 * server component as a client-reference proxy, so spreading it spreads nothing.
 */
import {
  AFFORDABLE_HOUSING_WYSIWYG_DIVERSE_NEEDS,
  AFFORDABLE_HOUSING_WYSIWYG_PROVEN_PARTNERS,
  affordableHousingProcess,
} from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/content-presets";
import type { ProjectCard } from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/markets-housing-affordable-housing-5d96d8a6/images";

/**
 * Route metadata.
 *
 * Unlike the five *parent* market pages (whose live titles are em-dashed and
 * unsuffixed), this page ships "Affordable Housing - LPAS Architecture", which
 * is exactly what the root layout's "%s - LPAS Architecture" template produces.
 * So `title` here is the bare page name and the suffix is never restated.
 *
 * The live page ships **no** `<meta name="description">` (CONTENT.json records
 * `metaDescription: null`), so none is invented — see the page module.
 */
export const META = {
  /** Fed through the root layout's title template. */
  title: "Affordable Housing",
  /** What the template resolves to, and what the source `<title>` reads. */
  fullTitle: "Affordable Housing - LPAS Architecture",
  canonical: "/markets/housing/affordable-housing/",
  /** Absolute, as the source emits it — used for the OG `url`. */
  sourceUrl: "https://lpas.com/markets/housing/affordable-housing/",
} as const;

/**
 * The four housing sub-markets, reusing the parent page's single source of
 * truth so the DOM order can never drift between the five pages that render it.
 * This page's own entry carries the `current` dot; matching on `href` against
 * `META.canonical` keeps that automatic rather than hand-flagged.
 */
const SUB_PAGES: MarketSubPageLink[] = HOUSING_SUB_PAGES.map((page) =>
  page.href === META.canonical ? { ...page, current: true } : page,
);

/**
 * Child-page header. Three things separate it from the parent variant:
 * a `backLink` **instead of** an `eyebrow`, no `titleSize` (children take the
 * block's `font-XXL` 56px default rather than the parent's 75px `font-3XL`),
 * and one sub-page flagged `current`.
 *
 * `market: "housing"` is the *parent's* slug — children inherit the
 * `--lpas-housing` (#625653) ground and the white foreground the block's tone
 * table already pairs with it, matching the measured `rgb(255,255,255)` on
 * `.blockHeaderMarkets__content` in this page's BLOCKS.json.
 */
export const HEADER: BlockHeaderMarketsProps = {
  market: "housing",
  backLink: { label: "Back to Housing", href: "/markets/housing/" },
  subtitle: "Building stability, building pride",
  title: "Affordable Housing",
  subPages: SUB_PAGES,
  image: {
    src: `${IMG}/DJI_0485_1-1440x960-c-default.webp`,
    // The source ships this decorative (alt="").
    alt: "",
    width: 1440,
    height: 960,
  },
};

/**
 * Single static caption (not the two-tab variant). The caption repeats the
 * header's right-hand descriptor, exactly as the source does.
 *
 * One body paragraph here, against the parent page's three.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Building stability, building pride"],
  statement:
    "LPAS believes that everyone deserves access to well-designed, dignified housing. Our affordable housing work focuses on creating places that foster stability, connection, and pride for residents and the surrounding community.",
  body: [
    "With extensive experience designing affordable, permanent supportive, and mixed-income housing across California, we bring both technical expertise and deep empathy to every project. We collaborate with developers, housing authorities, and local agencies to bring clarity to complex processes and deliver design excellence within real-world constraints. We navigate TCAC requirements, leverage state incentives like SB 35, and work within the realities of public funding. Every project reflects our commitment to efficiency, equity, and the people who call these communities home.",
  ],
};

/**
 * The pinned process carousel.
 *
 * `affordableHousingProcess` is this page's own content and is reused wholesale
 * rather than retyped — with one correction applied here rather than in the
 * shared module (block files are owned by their builders):
 *
 * Phase 03's body was captured by a probe that truncates at 500 characters, and
 * its final clause was completed by hand as "…make every dollar count." The now
 * un-truncated `innerText` in CONTENT.json ends "…make every dollar count
 * **without compromising design integrity.**" — restored below. The card clamps
 * its body to three lines, so the visible result is unchanged; the string is
 * corrected because it is what the page actually says.
 *
 * Phase 05's caption ("Performance over time") came from a screenshot; it was
 * re-checked against CONTENT.json and is correct as-is. So are the other four.
 */
const PHASE_03_TEXT =
  "LPAS refines each project to deliver high-quality design within budget and schedule goals. Many affordable housing residents have experienced trauma or housing instability, and we employ trauma-informed design principles creating spaces that promote healing, dignity, and joy. We coordinate closely with consultants and contractors to ensure materials, systems, and layouts maximize efficiency and durability. Our process emphasizes creative problem-solving and technical precision to make every dollar count without compromising design integrity.";

/**
 * Each process card is an `<a>` on the source. The shared preset omits the
 * hrefs, so they are restored here from this page's own capture — the other
 * seven market pages carry theirs, and the clone's convention is to keep the
 * source's hrefs verbatim even where the target route is out of scope (as it
 * already does for /careers/, /team/<slug>/ and most /portfolio/<slug>/).
 */
const PHASE_HREFS: Record<string, string> = {
  "01": "/processes/discovery-feasibility/?ids=914%2C925%2C927%2C933%2C936",
  "02": "/processes/community-engagement-visioning/?ids=914%2C925%2C927%2C933%2C936",
  "03": "/processes/design-development-optimization/?ids=914%2C925%2C927%2C933%2C936",
  "04": "/processes/approvals-delivery/?ids=914%2C925%2C927%2C933%2C936",
  "05": "/processes/occupancy-community-evolution/?ids=914%2C925%2C927%2C933%2C936",
};

export const PROCESS: BlockProcessCardSliderProps = {
  ...affordableHousingProcess,
  phases: affordableHousingProcess.phases.map((phase) => ({
    ...phase,
    href: PHASE_HREFS[phase.number],
    ...(phase.number === "03" ? { text: PHASE_03_TEXT } : {}),
  })),
};

/**
 * The two rich-text blocks, in source order. Re-exported under page-local names
 * so the route reads as a straight block sequence; the content itself is the
 * verbatim preset.
 */
export const WYSIWYG_DIVERSE_NEEDS = AFFORDABLE_HOUSING_WYSIWYG_DIVERSE_NEEDS;
export const WYSIWYG_PROVEN_PARTNERS = AFFORDABLE_HOUSING_WYSIWYG_PROVEN_PARTNERS;

/* ------------------------------------------------------------------ *
 * Highlighted projects — four tiles across layouts five / three
 * ------------------------------------------------------------------ *
 *
 * The source ships every one of these with `alt=""`; the pass-1 convention is
 * to restate the project title instead, so the tiles are not silent to screen
 * readers. Kept.
 */

/** Layout five's full-bleed tile — the wide 1440×960 crop, not a grid tile. */
const PROSPERA_AT_FIDDYMENT_RANCH: ProjectCard = {
  title: "Prospera at Fiddyment Ranch",
  location: "Roseville, CA",
  href: "/portfolio/prospera-at-fiddyment-ranch/",
  image: {
    src: `${IMG}/DJI_0490_1-1440x960-c-default.webp`,
    alt: "Prospera at Fiddyment Ranch",
    width: 1440,
    height: 960,
  },
  size: "large",
};

const NELLIE_HANNON_GATEWAY: ProjectCard = {
  title: "Nellie Hannon Gateway",
  location: "Emeryville, CA",
  // The slug is longer than the title — the source links to
  // `/portfolio/nellie-hannon-gateway-affordable-housing/`.
  href: "/portfolio/nellie-hannon-gateway-affordable-housing/",
  image: {
    src: `${IMG}/37th-San-Pabo-corner_night_2-1280x800-c-default.webp`,
    alt: "Nellie Hannon Gateway",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const ON_BROADWAY: ProjectCard = {
  title: "On Broadway",
  location: "Sacramento, CA",
  href: "/portfolio/on-broadway/",
  image: {
    src: `${IMG}/Night_01-1280x800-c-default.webp`,
    alt: "On Broadway",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const SUNRISE_POINTE: ProjectCard = {
  title: "Sunrise Pointe",
  location: "Citrus Heights, CA",
  href: "/portfolio/sunrise-pointe/",
  image: {
    src: `${IMG}/Sunrise-Pointe_25-1280x800-c-default.webp`,
    alt: "Sunrise Pointe",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/**
 * Header copy is verbatim: capital "Projects" here (the parent Housing page
 * uses lowercase "projects" — the casing genuinely differs per page), and
 * "All Affordable Housing" on the button. Both the header button and layout
 * three's footer button point at the same market-filtered portfolio URL.
 *
 * Layout order (five → three) is measured, not chosen: this page's BLOCKS.json
 * records `__layoutFive` (943px) then `__layoutThree` (521px) as the block's
 * two children after its header.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Highlighted Projects",
  button: { title: "All Affordable Housing", href: "/portfolio/?market=affordable-housing" },
  layouts: [
    { variant: "five", project: PROSPERA_AT_FIDDYMENT_RANCH },
    {
      variant: "three",
      small: [NELLIE_HANNON_GATEWAY, ON_BROADWAY],
      large: SUNRISE_POINTE,
      footer: {
        title: "See all Affordable Housing",
        buttonTitle: "Portfolio",
        buttonHref: "/portfolio/?market=affordable-housing",
      },
    },
  ],
};

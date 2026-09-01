/**
 * Verbatim content for `/markets/housing/market-rate-housing/` — a *child* of
 * the Housing market.
 * site-key `lpas-com-76f4f1fd` · page-key `markets-housing-market-rate-housing-264d70ed`
 *
 * Follows the template established by
 * `markets-housing-588433c5/content.ts`; see that file's header for the list of
 * things a sibling changes. Every string below was read from
 * `docs/research/lpas-com-76f4f1fd/markets-housing-market-rate-housing-264d70ed/CONTENT.json`
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
import type { BlockWysiwygProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";
import type { ProjectCard } from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/markets-housing-market-rate-housing-264d70ed/images";

/**
 * Route metadata.
 *
 * Unlike the five *parent* market pages (whose live titles are em-dashed and
 * unsuffixed), this page ships "Market Rate Housing - LPAS Architecture", which
 * is exactly what the root layout's "%s - LPAS Architecture" template produces.
 * So `title` here is the bare page name and the suffix is never restated.
 *
 * The live page ships **no** `<meta name="description">` (CONTENT.json records
 * `metaDescription: null`), so none is invented — see the page module.
 */
export const META = {
  /** Fed through the root layout's title template. */
  title: "Market Rate Housing",
  /** What the template resolves to, and what the source `<title>` reads. */
  fullTitle: "Market Rate Housing - LPAS Architecture",
  canonical: "/markets/housing/market-rate-housing/",
  /** Absolute, as the source emits it — used for the OG `url`. */
  sourceUrl: "https://lpas.com/markets/housing/market-rate-housing/",
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
  subtitle: "Market-smart residential design",
  title: "Market Rate Housing",
  subPages: SUB_PAGES,
  image: {
    // A wider, shorter crop than the other housing pages ship (1440×696).
    src: `${IMG}/08_Block-52_Madison-by-Lennar-1440x696-c-default.webp`,
    // The source ships this decorative (alt="").
    alt: "",
    width: 1440,
    height: 696,
  },
};

/**
 * Single static caption (not the two-tab variant). The caption repeats the
 * header's right-hand descriptor, exactly as the source does.
 *
 * One body paragraph here, against the parent page's three.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Market-smart residential design"],
  statement:
    "LPAS designs housing that balances design excellence with development realities, and performs across time and market conditions. With over 20,000 units completed across 25+ jurisdictions, we understand that successful projects require more than attractive renderings. They demand a partner who thinks in yield, unit mix, and absorption rates from day one.",
  body: [
    "We work closely with developers to identify opportunity, streamline approvals, and bring clarity to complex projects. Our process is strategic and adaptable, aligning every design decision with your pro forma while navigating entitlements, community engagement, and construction logistics. From initial feasibility through certificate of occupancy, LPAS delivers predictable outcomes that maximize your return.",
  ],
};

/**
 * The pinned process carousel. Market Rate Housing has its own five phases —
 * `affordableHousingProcess` in `content-presets.ts` is a different page's
 * content and is deliberately not reused here.
 *
 * ── About the `dark` flags ───────────────────────────────────────────────────
 * `dark` means "the artwork is *light*, so paint the number and caption dark".
 * The block defaults it to `index % 2 === 0`, which is the alternation the
 * affordable-housing page happens to follow. This page does **not**: sampling
 * the five card images shows mean top-band luminance 212 / 214 / 61 / 212 / 61,
 * i.e. light, light, dark, light, dark — so the flags are stated explicitly.
 * Confirmed against `desktop-full.png`, where cards 01 and 02 both carry the
 * dark #595656 number and card 03 carries the light #ececec one.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Workflow",
  intro: "The LPAS Market Rate Housing Design Process",
  title: "Our Process",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      href: "/processes/site-feasibility/?ids=1333%2C1334%2C1335%2C1336%2C1337",
      title: "Site + Feasibility",
      caption: "Feasibility with foresight",
      text: "Every successful housing project begins with a deep understanding of the site and its potential. LPAS explores how context, zoning, and financial goals intersect to create value. By analyzing physical and regulatory constraints early, we help clients make informed decisions about density, yield, and construction type. Our feasibility process connects design insight to development strategy, ensuring that every move is purposeful.",
      dark: true,
      image: {
        src: `${IMG}/image-02-blue-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "02",
      href: "/processes/vision-alignment/?ids=1333%2C1334%2C1335%2C1336%2C1337",
      title: "Vision + Alignment",
      caption: "Purposeful community vision",
      text: "A housing project succeeds when design, market, and purpose align. LPAS facilitates conversations that uncover what makes each community distinct: its brand, target audience, and sense of place. We translate those goals into a design narrative that guides architectural character, amenity programming, and livability from concept through completion.",
      dark: true,
      image: {
        src: `${IMG}/Frame-4470-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "03",
      href: "/processes/community-stakeholder-engagement/?ids=1333%2C1334%2C1335%2C1336%2C1337",
      title: "Community + Stakeholder Engagement",
      caption: "Clear communication, smoother approvals",
      text: "Housing projects often shape more than a site; they shape neighborhoods. LPAS engages city officials, community groups, and local stakeholders through a transparent process that focuses on communication and collaboration. By creating clear visuals and responsive solutions, we help developers earn support and move efficiently through approvals.",
      dark: false,
      image: {
        src: `${IMG}/Frame-4474-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "04",
      href: "/processes/design-development-optimization-2/?ids=1333%2C1334%2C1335%2C1336%2C1337",
      title: "Design Development + Optimization",
      caption: "Distinctive, buildable solutions",
      text: "LPAS refines every project through a process that connects design ambition to development efficiency. We collaborate with consultants and builders early to ensure quality, maintain budgets, and streamline delivery. Through our Integrated Design Studio approach and LEAN coordination, we keep creativity aligned with constructability, producing designs that are both distinctive and practical.",
      dark: true,
      image: {
        src: `${IMG}/Frame-4456-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "05",
      href: "/processes/delivery-evolution-2/?ids=1333%2C1334%2C1335%2C1336%2C1337",
      title: "Delivery + Evolution",
      caption: "Performance beyond completion",
      text: "Our partnership continues through construction and beyond. Through our TAPS methodology (Transparent, Accountable, Predictable, Successful), LPAS provides hands-on support during implementation, ensuring design integrity and responsiveness in the field. We also study completed projects to understand how they perform, using that insight to continually refine how we design for livability, efficiency, and community impact.",
      dark: false,
      image: {
        src: `${IMG}/Frame-4477-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
  ],
};

/**
 * The page's single rich-text block. (Affordable Housing ships two; this one
 * ships one — the count is measured per page, never assumed.)
 *
 * Each paragraph is a bold lead-in, a `<br>`, then the descriptive line, which
 * is why `lead` and `text` are separate fields rather than one HTML string.
 */
export const WYSIWYG: BlockWysiwygProps = {
  tagline: "Designed for performance",
  title: "Why Developers Choose LPAS",
  body: [
    {
      type: "paragraph",
      lead: "Purpose-Built for Your Success:",
      text: "Our people, processes, and technology are designed specifically for multi-family development. We think in yield, FAR, and unit mix, not just aesthetics.",
    },
    {
      type: "paragraph",
      lead: "Speed + Predictability:",
      text: "We reduce risk from day one and maintain momentum through delivery. Our TAPS process ensures predictable outcomes that maximize your return.",
    },
    {
      type: "paragraph",
      lead: "Developer-Aligned Partnership:",
      text: "90% of our clients are repeat clients because we partner around investment goals, not just design preferences. We make your goals our goals.",
    },
    {
      type: "paragraph",
      lead: "Proven Track Record:",
      text: "Over 20,000 units designed, entitled, and built across California. From walk-ups to high-rises, market-rate to affordable, we deliver projects that balance complex requirements with financial realities.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — six tiles across layouts four / five / two
 * ------------------------------------------------------------------ *
 *
 * The source ships every one of these with `alt=""`; the pass-1 convention is
 * to restate the project title instead, so the tiles are not silent to screen
 * readers. Kept.
 */

/** Layout four's left tile — a *large* tile, despite living in the small wrapper. */
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
  size: "large",
};

const CHROMA_AT_INNOVATION: ProjectCard = {
  title: "Chroma at Innovation Condominiums",
  location: "Fremont, CA",
  href: "/portfolio/chroma-at-innovation-condominiums/",
  image: {
    src: `${IMG}/11_Chroma_Warm-Springs-Condos-1280x800-c-default.webp`,
    alt: "Chroma at Innovation Condominiums",
    width: 1280,
    height: 800,
  },
  size: "large",
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

const MURPHY_STATION_APARTMENTS: ProjectCard = {
  title: "Murphy Station Apartments",
  location: "Sunnyvale, CA",
  href: "/portfolio/murphy-station-apartments/",
  image: {
    src: `${IMG}/25_Murphy-Station_Daniel-Gaines-1280x800-c-default.webp`,
    alt: "Murphy Station Apartments",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const THE_1960: ProjectCard = {
  title: "The 1960",
  location: "Walnut Creek, CA",
  href: "/portfolio/the-1960/",
  image: {
    // The asset is named after the project's former identity (AVE Walnut Creek).
    src: `${IMG}/01_AVE-Walnut-Creek-1280x800-c-default.webp`,
    alt: "The 1960",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const PARKER: ProjectCard = {
  title: "Parker",
  location: "Berkeley, CA",
  href: "/portfolio/parker/",
  image: {
    src: `${IMG}/03_Parker-1280x800-c-default.webp`,
    alt: "Parker",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/**
 * Header copy is verbatim: lowercase "projects" here (the sibling Affordable
 * Housing page capitalises it — the casing genuinely differs per page), and
 * "All Market Rate Housing" on the button.
 *
 * There is **no** footer call-to-action on this page: it ends on `layoutTwo`,
 * and only `layoutThree` carries the "View all …" / Portfolio block.
 *
 * Layout order (four → five → two) is measured, not chosen: this page's
 * BLOCKS.json records `__layoutFour` (521px), `__layoutFive` (974px),
 * `__layoutTwo` (471px) as the block's three children after its header.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Highlighted projects",
  button: { title: "All Market Rate Housing", href: "/portfolio/?market=market-rate-housing" },
  layouts: [
    { variant: "four", left: NINE_EIGHTY_CENTRAL, right: CHROMA_AT_INNOVATION },
    { variant: "five", project: THE_EMERY },
    { variant: "two", small: [MURPHY_STATION_APARTMENTS, THE_1960], large: PARKER },
  ],
};

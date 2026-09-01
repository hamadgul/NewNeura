/**
 * Verbatim content for `/markets/housing/senior-housing/` — a Housing **child**
 * market page.
 * site-key `lpas-com-76f4f1fd` · page-key `markets-housing-senior-housing-c6469d9f`
 *
 * Follows `markets-housing-588433c5/content.ts` (the parent Housing page) as its
 * template: every export is typed with the shared block's own props interface, so
 * a mis-shaped layout is a compile error rather than a rendering surprise.
 *
 * Strings come from
 * `docs/research/lpas-com-76f4f1fd/markets-housing-senior-housing-c6469d9f/CONTENT.json`
 * without paraphrase — including the curly apostrophe in "Alzheimer’s" (U+2019)
 * against the straight one in "the project's financial framework" (U+0027), which
 * is genuinely inconsistent in the source.
 *
 * Image `src` values are that file's `local` paths. `width`/`height` are the
 * **decoded file** dimensions taken from `docs/research/lpas-com-76f4f1fd/
 * IMAGE_DIMENSIONS.json` — NOT CONTENT.json's `w`/`h`, which record whichever
 * srcset variant lazysizes had loaded at capture time (see BUILDER_CONVENTIONS
 * trap #4).
 *
 * ── How this differs from the parent template ────────────────────────────────
 *   · `HEADER` swaps the "Our focus on" eyebrow for a `backLink` to
 *     `/markets/housing/`, drops `titleSize` (children take the `font-XXL` 56px
 *     default instead of the parent's 75px `font-3XL`), and keeps
 *     `market: "housing"` so the child inherits the parent's `--lpas-housing`
 *     (#625653) ground and its white foreground.
 *   · `subPages` reuses the parent's exported `HOUSING_SUB_PAGES` — the same four
 *     child markets in the same source DOM order — with this page's own entry
 *     flagged `current: true`.
 *   · A `BlockProcessCardSlider` sits between the intro and the projects, and two
 *     `BlockWysiwyg` instances sit between the slider and the projects. The
 *     parent market pages have none of the three.
 *   · `PROJECTS` is a single `layoutTwo` — measured, `BLOCKS.json` records exactly
 *     one `blockProjectsHighlight__layoutTwo` (1340×471) after the header.
 */
import { HOUSING_SUB_PAGES } from "@/components/sites/lpas-com-76f4f1fd/markets-housing-588433c5/content";
import type {
  BlockHeaderMarketsProps,
  MarketSubPageLink,
} from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import type { BlockIntroDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import type { BlockProcessCardSliderProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import type { BlockProjectsHighlightProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import type { BlockWysiwygProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";
import type { ProjectCard } from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/markets-housing-senior-housing-c6469d9f/images";

/**
 * Route metadata.
 *
 * The live `<title>` is "Senior Housing - LPAS Architecture", which is exactly
 * what the root layout's `"%s - LPAS Architecture"` template produces from
 * "Senior Housing" — so, unlike the parent markets with their em-dash titles,
 * this route feeds the template rather than opting out with an absolute title.
 *
 * `metaDescription` is `null` in CONTENT.json (the live page ships no
 * `<meta name="description">`), so none is declared — see the page module.
 */
export const META = {
  /** Fed through the root layout's title template; never restate the suffix. */
  title: "Senior Housing",
  canonical: "/markets/housing/senior-housing/",
  /** Absolute, as the source emits it — used for the OG `url`. */
  sourceUrl: "https://lpas.com/markets/housing/senior-housing/",
} as const;

/** The sibling this page is. Matched by title against the shared list below. */
const CURRENT_SUB_PAGE = "Senior Housing";

/**
 * The parent's four child markets, reused verbatim (source DOM order, which is
 * not alphabetical), with this page's own entry flagged so the header renders
 * its leading dot marker.
 */
const SUB_PAGES: MarketSubPageLink[] = HOUSING_SUB_PAGES.map((page) =>
  page.title === CURRENT_SUB_PAGE ? { ...page, current: true } : page,
);

/**
 * Child-page header: `backLink` instead of `eyebrow`, no `titleSize` (the block
 * defaults to `XXL` whenever a `backLink` is present, which is the measured 56px
 * step down from the parent's 75px).
 */
export const HEADER: BlockHeaderMarketsProps = {
  market: "housing",
  backLink: { label: "Back to Housing", href: "/markets/housing/" },
  subtitle: "Supporting independence with care",
  title: "Senior Housing",
  subPages: SUB_PAGES,
  image: {
    src: `${IMG}/03_SONRISA-1440x810-c-default.webp`,
    // Decorative in the source (alt=""); it is a dusk crop of Sonrisa Senior Living.
    alt: "",
    width: 1440,
    height: 810,
  },
};

/**
 * The intro's single static caption repeats the header's tagline on this page —
 * unlike `/markets/housing/student-housing/`, where the two differ. Both strings
 * are copied from their own DOM nodes rather than shared, so the coincidence
 * cannot silently propagate.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Supporting independence with care"],
  statement:
    "LPAS designs senior housing that supports dignity, independence, and quality of life. Whether designing independent living, assisted living, memory care, or continuing care retirement communities, we understand these projects must balance safety and support with autonomy and quality of life.",
  body: [
    "With California's aging population and evolving models of senior care, successful senior housing requires deep understanding of both operational needs of care providers and experiential needs of residents and their families. Our approach centers on creating warm, residential environments that support aging in place, foster social connection, and honor the dignity of every resident.",
  ],
};

/**
 * The scroll-pinned process carousel. Five phases, same shape as the worked
 * `affordableHousingProcess` example in `shared/blocks/content-presets.ts`, but
 * every string and every image is this page's own.
 *
 * `dark` is set explicitly on all five. The block's default is `index % 2 === 0`
 * — the pattern the affordable-housing slider happens to have — but the flag
 * really tracks the *artwork*: it goes on when the card image is light, so the
 * number and caption painted over it stay legible. This page's five images are
 * dark / light / light / dark / light (mean luminance 63 / 212 / 210 / 63 / 212,
 * a clean bimodal split), which is NOT the default alternation, and the
 * reference screenshot confirms it: card 01 paints white over its dark artwork
 * while cards 02 and 03 paint dark over their light ones.
 *
 * Each card is an `<a>` in the source, pointing at a `/processes/<slug>/` detail
 * page with the same `?ids=` sibling list on all five. Those hrefs are reproduced
 * verbatim (percent-encoded commas included); `/processes/` is outside this
 * clone's route set, so they are dead links here exactly as the portfolio hrefs
 * on the parent page are.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Workflow",
  intro: "The LPAS Senior Housing Design Process",
  title: "Our Process",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      // Dark artwork (Frame-4479) — light number/caption over it.
      dark: false,
      title: "Discovery + Market Understanding",
      caption: "Grounded in resident needs",
      text: "Senior housing begins with understanding who the community will serve and how their needs translate into design. LPAS collaborates with owners, operators, and care providers to identify priorities around wellness, accessibility, and lifestyle. By analyzing site potential, demographic trends, and operational models, we build a foundation that connects design vision to business objectives.",
      href: "/processes/discovery-market-understanding/?ids=1339%2C1340%2C1341%2C1342%2C1343",
      image: {
        src: `${IMG}/Frame-4479-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "02",
      // Light artwork (Frame-4470) — dark number/caption over it.
      dark: true,
      title: "Visioning + Lifestyle Planning",
      caption: "Designing supportive living",
      text: "LPAS helps clients imagine how residents will live, connect, and thrive. Senior housing must accommodate residents with varying and evolving abilities. Universal design creates environments supporting independence while building in flexibility for increasing care needs, allowing residents to age in place with dignity.",
      href: "/processes/visioning-lifestyle-planning/?ids=1339%2C1340%2C1341%2C1342%2C1343",
      image: {
        src: `${IMG}/Frame-4470-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "03",
      // Light artwork (Frame-4456).
      dark: true,
      title: "Design Development + Integration",
      caption: "Design supporting daily life",
      text: "LPAS refines design concepts into functional, efficient, and comfortable environments. Memory care requires specialized approaches supporting residents with dementia. Beyond specialized needs, all seniors benefit from diverse opportunities for social connection, activities, and wellness. We coordinate closely with consultants and care providers to ensure safety and regulatory compliance while maintaining a warm, residential character.",
      // `-2` on the slug: the source has a second, distinct process page with the
      // same name for /markets/housing/student-housing/. Both are kept verbatim.
      href: "/processes/design-development-integration-2/?ids=1339%2C1340%2C1341%2C1342%2C1343",
      image: {
        src: `${IMG}/Frame-4456-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "04",
      // Dark artwork (Process-slider-20).
      dark: false,
      title: "Technical Coordination + Cost Management",
      caption: "Performance within budget",
      text: "While resident experience is paramount, operational efficiency directly impacts quality of care and project financial performance. LPAS integrates cost management and technical collaboration to ensure performance and constructability. We apply LEAN methods and Target Value Design to achieve high-quality results within the project's financial framework.",
      href: "/processes/technical-coordination-cost-management/?ids=1339%2C1340%2C1341%2C1342%2C1343",
      image: {
        src: `${IMG}/Process-slider-20-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "05",
      // Light artwork (Frame-4467).
      dark: true,
      title: "Implementation + Post-Occupancy Evaluation",
      caption: "Delivered with care",
      text: "LPAS supports the project from construction through occupancy, ensuring design intent is delivered and residents' needs are fully met. Senior housing requires careful coordination of complex systems, specialized equipment, and operational readiness. After completion, we review how spaces perform, using insights to continually enhance future communities.",
      href: "/processes/implementation-post-occupancy-evaluation/?ids=1339%2C1340%2C1341%2C1342%2C1343",
      image: {
        src: `${IMG}/Frame-4467-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
  ],
};

/* ------------------------------------------------------------------ *
 * The two rich-text blocks
 * ------------------------------------------------------------------ *
 *
 * Both use the market-page shape the block documents: `<p><strong>lead</strong>
 * <br>text</p>`, one paragraph per care type. Confirmed against this page's
 * `blocks/BLOCKS.json`, which records a `<strong>` + `<br>` pair inside every
 * `.wysiwyg > p`.
 */

export const WYSIWYG_EXPERTISE: BlockWysiwygProps = {
  tagline: "Experience across care types",
  title: "Specialized Senior Housing Expertise",
  body: [
    {
      type: "paragraph",
      lead: "Independent Living:",
      text: "Active adult communities with social programming and maintenance-free living.",
    },
    {
      type: "paragraph",
      lead: "Assisted Living:",
      text: "Residential care with ADL support, balancing independence with appropriate assistance.",
    },
    {
      type: "paragraph",
      lead: "Memory Care:",
      text: "Specialized dementia and Alzheimer’s care in secure, cognitively supportive environments.",
    },
    {
      type: "paragraph",
      lead: "Skilled Nursing:",
      text: "Higher-acuity care in environments maintaining residential character and resident dignity.",
    },
    {
      type: "paragraph",
      lead: "Continuing Care Retirement Communities (CCRC):",
      text: "Integrated campuses supporting full continuum from independent living through skilled nursing.",
    },
  ],
};

export const WYSIWYG_WHY_LPAS: BlockWysiwygProps = {
  tagline: "Expertise developers trust",
  title: "Why Senior Housing Developers Choose LPAS",
  body: [
    {
      type: "paragraph",
      lead: "Resident-Centered Design:",
      text: "We design for how people want to age, creating environments supporting dignity, independence, and quality of life.",
    },
    {
      type: "paragraph",
      lead: "Specialized Expertise:",
      text: "Deep understanding of senior housing operations, care models, and unique design considerations for aging populations.",
    },
    {
      type: "paragraph",
      lead: "Memory Care Experience:",
      text: "Proven approaches to dementia and Alzheimer’s care environments supporting residents and families.",
    },
    {
      type: "paragraph",
      lead: "Financial Performance:",
      text: "Designs balancing cost-effectiveness with market appeal to drive occupancy and retention.",
    },
    {
      type: "paragraph",
      lead: "Universal Design Commitment:",
      text: "Creating environments supporting residents through changing abilities, allowing aging in place.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — one `layoutTwo`, three tiles
 * ------------------------------------------------------------------ *
 *
 * `layoutTwo` is the mirrored variant: the `smallImagesWrapper` comes first in
 * the DOM, the large tile second. That is the order `BLOCKS.json` records
 * (Elegance Hamilton Hill and Sonrisa in the wrapper, Bruceville Point after it),
 * and the tile crops confirm it — the first two are 1280×800 grid crops rendered
 * at 328×205, the third the 665×415 hero.
 *
 * The source ships all three with `alt=""`; the pass-1 convention restates the
 * project title so the tiles are not silent to screen readers. Kept.
 */

const ELEGANCE_HAMILTON_HILL: ProjectCard = {
  title: "Elegance Hamilton Hill",
  location: "Novato, CA",
  href: "/portfolio/elegance-hamilton-hill/",
  image: {
    src: `${IMG}/02_Elegance-Hamilton-Hill_Novato-1280x800-c-default.webp`,
    alt: "Elegance Hamilton Hill",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const SONRISA_SENIOR_LIVING: ProjectCard = {
  title: "Sonrisa Senior Living",
  location: "Roseville, CA",
  href: "/portfolio/sonrisa-senior-living/",
  image: {
    src: `${IMG}/04_SONRISA-1280x800-c-default.webp`,
    alt: "Sonrisa Senior Living",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const BRUCEVILLE_POINT: ProjectCard = {
  title: "Bruceville Point",
  location: "Elk Grove, CA",
  href: "/portfolio/bruceville-point/",
  image: {
    src: `${IMG}/33_Bruceville-Point-Exterior_FAVORITE-1280x800-c-default.webp`,
    alt: "Bruceville Point",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/**
 * Header copy is verbatim: lowercase "projects" here (the student-housing sibling
 * capitalises it), and "All Senior Housing" on the button. There is no
 * `layoutThree` on this page, so no footer call-to-action either — the header
 * button is the only route out to the filtered portfolio.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Highlighted projects",
  button: { title: "All Senior Housing", href: "/portfolio/?market=senior-housing" },
  layouts: [
    {
      variant: "two",
      small: [ELEGANCE_HAMILTON_HILL, SONRISA_SENIOR_LIVING],
      large: BRUCEVILLE_POINT,
    },
  ],
};

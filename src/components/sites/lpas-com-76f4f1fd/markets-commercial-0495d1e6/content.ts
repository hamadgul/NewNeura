/**
 * Verbatim content for `/markets/commercial/` — the parent Commercial market page.
 * site-key `lpas-com-76f4f1fd` · page-key `markets-commercial-0495d1e6`
 *
 * Every string was read from the live DOM and is reproduced from
 * `docs/research/lpas-com-76f4f1fd/markets-commercial-0495d1e6/CONTENT.json`
 * without paraphrase. Note the apostrophes in "client's", "don't", "it's" and
 * "project's" are plain ASCII `'` in the source on this page (unlike the curly
 * `’` on /markets/housing/affordable-housing/), and are copied as such. Image
 * paths are the `local` fields from that same file, but every `width`/`height`
 * comes from `docs/research/lpas-com-76f4f1fd/IMAGE_DIMENSIONS.json` — the
 * decoded, true intrinsic size, which is what `next/image` needs for the aspect
 * ratio. CONTENT.json's own `w`/`h` are deliberately **not** used: they record
 * whichever srcset variant lazysizes happened to have loaded at capture time,
 * not the file. (Cross-checked here against the downloaded WebP headers; all
 * 11 images on this page agree.)
 *
 * ── How this differs from the `markets-housing-588433c5` template ────────────
 * Same six-step recipe that file documents, with these specifics:
 *   1. `IMG` — this page's own page-key directory.
 *   2. `META` — title/canonical; still no description, for the same reason.
 *   3. `HEADER.market: "commercial"` selects `--lpas-commercial` (#e3c1aa).
 *      That is one of the two *light* grounds, so the block's own `MARKET_TONE`
 *      table already resolves `#262626` type — matching the measured
 *      `rgb(38,38,38)` on `.blockHeaderMarkets__content` — and no `tone`
 *      override is passed. Commercial has no child markets, so `subPages` is
 *      omitted entirely rather than passed as `[]`; the prop is optional and
 *      the sub-nav then vanishes instead of reserving space. There is no back
 *      link: this is a parent.
 *   4. `INTRO.labels` / `statement` / `body`.
 *   5. `PROJECTS.title` + `button.title`, and the measured `layouts` sequence —
 *      four → three here (BLOCKS.json records `__layoutFour` (521px) then
 *      `__layoutThree` (521px) as this block's two children after its header).
 *   6. Unlike the Housing parent, this page **does** carry the pinned process
 *      block, plus two `BlockWysiwyg` instances between it and the projects.
 *      Hence the extra `PROCESS`, `WYSIWYG_SERVICES` and `WYSIWYG_WHY_LPAS`
 *      exports below.
 */
import type { BlockHeaderMarketsProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import type { BlockIntroDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import type { BlockProcessCardSliderProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import type { BlockProjectsHighlightProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import type { BlockWysiwygProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";
import type { ProjectCard } from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/markets-commercial-0495d1e6/images";

/**
 * Route metadata. The source serves this title unsuffixed and with an em dash,
 * so it cannot go through the root layout's "%s - LPAS Architecture" template.
 *
 * The live page ships **no** `<meta name="description">` (CONTENT.json records
 * `metaDescription: null`), so none is invented here — see the page module.
 */
export const META = {
  title: "LPAS — Commercial",
  canonical: "/markets/commercial/",
  /** Absolute, as the source emits it — used for the OG `url`. */
  sourceUrl: "https://lpas.com/markets/commercial/",
} as const;

/**
 * Parent-market header: eyebrow (not a back link), `font-3XL` title, and no
 * sub-page grid at all — Commercial has no children.
 *
 * `titleSize` is passed explicitly even though `3XL` is the no-`backLink`
 * default, because the 75px vs 56px step is the single clearest difference
 * between a parent page and a child page and is worth stating at the call site.
 */
export const HEADER: BlockHeaderMarketsProps = {
  market: "commercial",
  eyebrow: "Our focus on",
  subtitle: "Design for business value",
  title: "Commercial",
  titleSize: "3XL",
  image: {
    src: `${IMG}/20_UCDH_Folsom-MOB_FULLSIZE-1440x960-c-default.webp`,
    // The source ships this decorative (alt=""); it is a crop of the UC Davis
    // Health Folsom medical office building.
    alt: "",
    width: 1440,
    height: 960,
  },
};

/**
 * Single static caption (not the two-tab variant) plus one body paragraph.
 *
 * The source's `<h2>` carries the whole statement; the single `<p>` beneath it
 * is reproduced as a one-element array so the block's `[&>p+p]` rhythm stays
 * available if the copy ever grows, and so the shape matches its siblings.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Design for business value"],
  statement:
    "LPAS designs commercial environments that balance brand identity, performance, and long-term value. From workplace campuses and tenant improvements to retail and mixed-use developments, our process connects business goals to design outcomes.",
  body: [
    "We understand that commercial spaces must deliver on multiple levels: supporting productivity, reflecting brand identity, attracting and retaining talent or customers, and providing measurable return on investment. Our integrated approach combines architecture, interior design, and technical expertise to create environments that respond to evolving workplace trends, changing retail models, and the increasing importance of employee wellbeing and customer experience. We focus on efficiency, adaptability, and experience, creating spaces that reflect each client's culture and enhance the way people work, shop, and connect.",
  ],
};

/* ------------------------------------------------------------------ *
 * Our Process — the scroll-pinned five-card slider
 * ------------------------------------------------------------------ *
 *
 * Phase order, numbers, captions and body copy are transcribed from this
 * page's own CONTENT.json; the card artwork is this page's own
 * `*-1000x1156` crops in DOM order. Note phase 03's file is named
 * `Process-slider-04` upstream — the mismatch is the source's, and the DOM
 * order is what places it.
 *
 * `dark` is passed explicitly on every phase here, because Commercial is the
 * one page where the artwork tones do **not** follow the block's default
 * `index % 2 === 0` alternation. Sampling the mean luminance of the top 270px
 * of each 1000×1156 crop (the band the number and caption sit over) splits
 * cleanly into two groups — ~61 for the near-black artwork and ~210–214 for
 * the pale artwork:
 *
 *   phase   01     02     03     04     05
 *   civic   214    61     210    61     214   → dark = T F T F T  (the default)
 *   comm.    61   214     210    61     214   → dark = F T T F T  (01/02 swapped)
 *
 * `dark` means "the artwork is light, so paint the number and caption dark",
 * which is what the source's own `cardItem__headerWrapper--dark` modifier does,
 * so this is the prop being used for exactly its documented purpose. Confirmed
 * against `docs/design-references/.../markets-commercial-0495d1e6/desktop-full.png`,
 * where card 01 carries white type on black and card 02 dark type on grey —
 * the opposite of Civic at the same two positions.
 *
 * `notch` (the artwork's 40px top-right bevel) is a separate prop and is left
 * unset on every phase. It is positional in the source — cards 02 and 04 carry
 * it on Civic and on Commercial alike, whichever way the artwork tone runs — so
 * the block's odd-index default is already right, and overriding `dark` here
 * does not disturb it. Verified in the DOM: the rendered `clipPath` sits on
 * slides 1 and 3 while `color` follows the F T T F T table above.
 *
 * The source wraps each card in an `<a>` to `/processes/<phase>/?ids=…`.
 * Those routes are outside this clone, and the block's own worked example
 * (`affordableHousingProcess`, now in `shared/blocks/content-presets.ts`)
 * drops them for exactly that reason, so `href`
 * is omitted here too and each card renders as a `<div>`.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Workflow",
  intro: "The LPAS Commercial Design Process",
  title: "Our Process",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      href: "/processes/discovery-brand-alignment/?ids=1100%2C1101%2C1102%2C1103%2C1104",
      title: "Discovery + Brand Alignment",
      caption: "Purpose-led clarity",
      text: "Every successful commercial project starts with clarity. LPAS begins by understanding our client's goals, brand identity, and operational model. We don't apply cookie-cutter solutions; we discover what makes your business unique. We study how people use space and how design can improve their experience. This early discovery phase establishes a strategic foundation that connects business needs with creative direction.",
      /** artwork luminance ~61 (near-black). */
      dark: false,
      image: {
        src: `${IMG}/Frame-4483-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "02",
      href: "/processes/visioning-concept-development/?ids=1100%2C1101%2C1102%2C1103%2C1104",
      title: "Visioning + Concept Development",
      caption: "Expressing identity through space",
      text: "LPAS develops a clear and cohesive design concept that communicates brand story and purpose. We explore how materials, light, and proportion define experience, whether it's a vibrant retail environment or an efficient workplace. Commercial spaces are brand experiences, and we translate brand identity into spatial experiences from grand lobbies to employee break rooms. The concept becomes the project's foundation, aligning stakeholders and guiding future decisions.",
      /** artwork luminance ~214 (pale). */
      dark: true,
      image: {
        src: `${IMG}/Frame-4470-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "03",
      href: "/processes/planning-performance/?ids=1100%2C1101%2C1102%2C1103%2C1104",
      title: "Planning + Performance",
      caption: "Efficiency meets experience",
      text: "We transform the design vision into an efficient and functional plan that supports daily operations. Commercial real estate represents significant investment, and smart space planning maximizes usable space, supports efficient workflows, and creates flexibility for future needs. LPAS creates layouts that promote collaboration, flexibility, and comfort while maintaining clarity of circulation and purpose. Each plan is shaped by how people interact with the space.",
      /** artwork luminance ~210 (pale blue). */
      dark: true,
      image: {
        src: `${IMG}/Process-slider-04-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "04",
      href: "/processes/detailing-technical-coordination/?ids=1100%2C1101%2C1102%2C1103%2C1104",
      title: "Detailing + Technical Coordination",
      caption: "Execution with precision",
      text: "LPAS bridges creativity and constructability by detailing each element with care and precision. Modern workplace design recognizes that employee wellbeing directly impacts productivity, creativity, and retention. We integrate wellness principles, natural light maximization, acoustic design, and technology to create spaces where people do their best work while coordinating across disciplines to maintain design quality.",
      /** artwork luminance ~61 (near-black). */
      dark: false,
      image: {
        src: `${IMG}/Frame-4477-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "05",
      href: "/processes/delivery-evolution/?ids=1100%2C1101%2C1102%2C1103%2C1104",
      title: "Delivery + Evolution",
      caption: "Enduring commercial performance",
      text: "From construction to occupancy, LPAS remains closely involved to ensure the design is delivered as intended. Commercial projects require sophisticated coordination within tight schedules driven by lease obligations. Our integrated technical approach and flexible design thinking ensure everything works together and adapts to future needs. We work with contractors to maintain quality, solve challenges efficiently, and support smooth project completion.",
      /** artwork luminance ~214 (pale). */
      dark: true,
      image: {
        src: `${IMG}/Frame-4468-1000x1156-c-default.webp`,
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
 * Both use the tagline + title + body shape. Each source `<p>` is a bold
 * lead-in, a `<br>`, then the descriptive line — which is exactly the
 * `lead` / `text` split `WysiwygParagraphNode` models, so the `\n` inside
 * CONTENT.json's paragraph strings becomes the node boundary rather than a
 * literal newline.
 */

/** First instance — "Integrated Commercial Expertise". */
export const WYSIWYG_SERVICES: BlockWysiwygProps = {
  tagline: "Integrated Commercial Expertise",
  title: "LPAS Commercial Services",
  body: [
    {
      type: "paragraph",
      lead: "Integrated Architecture + Interior Design:",
      text: "Full-service design with architecture and interior design teams collaborating in the same BIM model.",
    },
    {
      type: "paragraph",
      lead: "Workplace Strategy Expertise:",
      text: "Activity-based working, hybrid work support, and evidence-based design for productivity and wellbeing.",
    },
    {
      type: "paragraph",
      lead: "WELL Building Leadership:",
      text: "WELL AP expertise bringing healthy building principles to commercial projects.",
    },
    {
      type: "paragraph",
      lead: "Sustainable Design:",
      text: "LEED experience and sustainable strategies reducing operating costs and supporting corporate responsibility.",
    },
    {
      type: "paragraph",
      lead: "Fast-Track Delivery:",
      text: "Disciplined project management supporting compressed schedules and lease obligations.",
    },
    {
      type: "paragraph",
      lead: "Real Estate Intelligence:",
      text: "Test fits and feasibility studies supporting site selection and lease negotiations.",
    },
  ],
};

/** Second instance — "Built for business success". Its title keeps the `?`. */
export const WYSIWYG_WHY_LPAS: BlockWysiwygProps = {
  tagline: "Built for business success",
  title: "Why Choose LPAS for Commercial Projects?",
  body: [
    {
      type: "paragraph",
      lead: "Business-First Approach:",
      text: "We design around how you work, not architectural trends. Your success is our measure.",
    },
    {
      type: "paragraph",
      lead: "Integrated Services:",
      text: "Architecture and interior design under one roof, working in the same model from day one.",
    },
    {
      type: "paragraph",
      lead: "Wellness Expertise:",
      text: "WELL AP leadership bringing healthy building principles to support employee wellbeing.",
    },
    {
      type: "paragraph",
      lead: "Technical Excellence:",
      text: "Sophisticated coordination of complex systems within commercial construction timelines.",
    },
    {
      type: "paragraph",
      lead: "Flexible Design:",
      text: "Building adaptability into spaces to protect long-term investment value.",
    },
    {
      type: "paragraph",
      lead: "Proven Delivery:",
      text: "Disciplined process supporting compressed schedules and lease commencement dates.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — five tiles across layouts four / three
 * ------------------------------------------------------------------ *
 *
 * The five projects appear in source DOM order, which is also the order the
 * two layouts consume them: layout four takes the first two (both *large*
 * 665×471 tiles, per BLOCKS.json), layout three takes the two 328×260 smalls
 * and then its own large tile.
 *
 * The source ships every one of these with `alt=""`; the pass-1 convention is
 * to restate the project title instead, so the tiles are not silent to screen
 * readers. Kept.
 */

/** Layout four, left — sits in the 471px-pinned `smallImagesWrapper`. */
const UC_DAVIS_HEALTH_FOLSOM: ProjectCard = {
  title: "UC Davis Health Folsom Medical Care Clinic",
  location: "Folsom, CA",
  href: "/portfolio/uc-davis-health-folsom-medical-care-clinic/",
  image: {
    src: `${IMG}/18_UCDH_Folsom-MOB_FULLSIZE-1280x800-c-default.webp`,
    alt: "UC Davis Health Folsom Medical Care Clinic",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/** Layout four, right — the notched (top-left bevel) tile. */
const CALIFORNIA_LOTTERY_HEADQUARTERS: ProjectCard = {
  title: "California Lottery Headquarters",
  location: "Sacramento, CA",
  href: "/portfolio/california-lottery-headquarters/",
  image: {
    src: `${IMG}/08_CA-Lottery-Headquarter_bldg-1280x800-c-default.webp`,
    alt: "California Lottery Headquarters",
    width: 1280,
    height: 800,
  },
  size: "large",
};

const ONE_HUNDRED_HOWE: ProjectCard = {
  title: "100 Howe Tenant Improvement",
  location: "Sacramento, CA",
  href: "/portfolio/100-howe-tenant-improvement/",
  image: {
    src: `${IMG}/02_100-HOWE-1280x800-c-default.webp`,
    alt: "100 Howe Tenant Improvement",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const MARKET_WEST: ProjectCard = {
  title: "Market West",
  location: "Sacramento, CA",
  href: "/portfolio/market-west/",
  image: {
    src: `${IMG}/MG_0672-1280x800-c-default.webp`,
    alt: "Market West",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const TWENTY_TWENTY_GATEWAY: ProjectCard = {
  title: "2020 Gateway",
  location: "Sacramento, CA",
  href: "/portfolio/2020-gateway/",
  image: {
    src: `${IMG}/30_2020-Gateway_Exterior-1280x800-c-default.webp`,
    alt: "2020 Gateway",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/**
 * Header copy is verbatim: lowercase "projects", and "All Commercial" on the
 * button. Both the header button and layout three's footer button point at the
 * same market-filtered portfolio URL — the query string is part of the href, so
 * the filter row on `/portfolio/` picks it up.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Highlighted projects",
  button: { title: "All Commercial", href: "/portfolio/?market=commercial" },
  layouts: [
    {
      variant: "four",
      left: UC_DAVIS_HEALTH_FOLSOM,
      right: CALIFORNIA_LOTTERY_HEADQUARTERS,
    },
    {
      variant: "three",
      small: [ONE_HUNDRED_HOWE, MARKET_WEST],
      large: TWENTY_TWENTY_GATEWAY,
      footer: {
        title: "View all Commercial",
        buttonTitle: "Portfolio",
        buttonHref: "/portfolio/?market=commercial",
      },
    },
  ],
};

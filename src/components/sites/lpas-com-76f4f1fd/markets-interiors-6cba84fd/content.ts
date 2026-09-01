/**
 * Verbatim content for `/markets/interiors/` — the parent Interiors market page.
 * site-key `lpas-com-76f4f1fd` · page-key `markets-interiors-6cba84fd`
 *
 * Every string was read from the live DOM and is reproduced from
 * `docs/research/lpas-com-76f4f1fd/markets-interiors-6cba84fd/CONTENT.json`
 * without paraphrase — including the one typographic apostrophe the copy
 * actually uses ("We don’t profit from product sales"), where every other
 * apostrophe on the page is the ASCII one. Image paths are the `local` fields
 * from that same file; `width`/`height` come from
 * `docs/research/lpas-com-76f4f1fd/IMAGE_DIMENSIONS.json`, which decodes the
 * downloaded files. CONTENT.json's own `w`/`h` are **not** used: they record
 * whichever srcset variant lazysizes happened to have loaded, not the intrinsic
 * size, and `next/image` needs the intrinsic ratio.
 *
 * Follows `markets-housing-588433c5/content.ts`, the template for the sibling
 * market routes. What differs from Housing:
 *   1. `IMG` / `META` — this page's own directory, title and canonical.
 *   2. `HEADER` omits `subPages` entirely: Interiors is a parent market with no
 *      children, so the sub-nav must not reserve space. `tone` is also not
 *      passed — `BlockHeaderMarkets`' own table already pairs the dark
 *      `--lpas-interiors` (#925434) ground with white type.
 *   3. A `PROCESS` block: unlike `/markets/housing/`, this page pins the
 *      "Our Process" slider between the intro and the rich text.
 *   4. Two `BlockWysiwyg` instances, each with its own tagline/title/body.
 *   5. `PROJECTS` runs layouts one → three (measured), so this page *does*
 *      carry layout three's "View all Interiors" footer.
 */
import type { BlockHeaderMarketsProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import type { BlockIntroDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import type { BlockProcessCardSliderProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import type { BlockProjectsHighlightProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import type { BlockWysiwygProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";
import type { ProjectCard } from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/markets-interiors-6cba84fd/images";

/**
 * Route metadata. The source serves this title unsuffixed and with an em dash,
 * so it cannot go through the root layout's "%s - LPAS Architecture" template.
 *
 * The live page ships **no** `<meta name="description">` (CONTENT.json records
 * `metaDescription: null`), so none is invented here — see the page module.
 */
export const META = {
  title: "LPAS — Interiors",
  canonical: "/markets/interiors/",
  /** Absolute, as the source emits it — used for the OG `url`. */
  sourceUrl: "https://lpas.com/markets/interiors/",
} as const;

/**
 * Parent-market header: eyebrow (not a back link), `font-3XL` title, and — the
 * one structural difference from Housing — **no** `subPages` key at all,
 * because Interiors has no child markets.
 *
 * `market: "interiors"` selects the `--lpas-interiors` (#925434) ground, which
 * the block's tone table already pairs with white type — matching the measured
 * `rgb(255,255,255)` on `.blockHeaderMarkets__content`, so `tone` is left off.
 *
 * `titleSize` is passed explicitly even though `3XL` is the no-`backLink`
 * default, because the 75px vs 56px step is the single clearest difference
 * between a parent page and a child page and is worth stating at the call site.
 */
export const HEADER: BlockHeaderMarketsProps = {
  market: "interiors",
  eyebrow: "Our focus on",
  subtitle: "Design for everyday life",
  title: "Interiors",
  titleSize: "3XL",
  image: {
    src: `${IMG}/12_Block-52_Madison-by-Lennar-1440x982-c-default.webp`,
    // The source ships this decorative (alt=""); it is a crop of Block 52.
    alt: "",
    width: 1440,
    height: 982,
  },
};

/**
 * Single static caption (not the two-tab variant) plus one body paragraph.
 *
 * The source's statement and body are two separate elements (`h2` + `p`), so
 * unlike Housing there is nothing to split here.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Design for everyday life"],
  statement:
    "LPAS Interior Design connects people, purpose, and place. We create spaces that reflect identity, support well-being, and perform beautifully in everyday use.",
  body: [
    "With over 30 years of experience across mixed-use developments, multifamily housing, higher education, and commercial projects, we bring strategy and creativity to every environment we design. What sets us apart is our fully integrated approach. Our interior designers work side-by-side with architects in the same BIM model from project inception, eliminating the disconnect between exterior and interior design. This integration reduces rework and ensures full coordination at every milestone. Whether designing a workplace, learning environment, or public space, we focus on clarity, collaboration, and meaning at every step.",
  ],
};

/* ------------------------------------------------------------------ *
 * The pinned process slider
 * ------------------------------------------------------------------ *
 *
 * RECON.json records this block wrapped in the same 2445px `pin-spacer` as the
 * other market pages, i.e. the block's default 1305px pin distance — so
 * `pinDistance` is left at the component's measured default.
 *
 * Phase 03 is the one card that does not reuse a `Frame-44xx` asset; the source
 * serves `Process-slider-04` there. Order below is the order CONTENT.json lists
 * the images in, which matches the phase order.
 *
 * The source makes each slide a link to `/processes/<slug>/?ids=…`. Those
 * routes are not part of this clone (no `/processes/` segment exists), so
 * `href` is omitted and the cards render as `<div>`s — the same choice the
 * block's own affordable-housing example makes.
 */
/**
 * `dark` is set explicitly on every phase here rather than left to the block's
 * `index % 2 === 0` default. That default happens to match civic,
 * higher-education, affordable-housing and student-housing, but the flag really
 * tracks *artwork lightness*, and interiors' order is F/T/T/F/T — read off the
 * live DOM's `cardItem__headerWrapper--dark` modifier. On the default, cards 01
 * and 02 come out inverted: pale type on pale artwork and dark type on
 * near-black, both illegible.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Workflow",
  intro: "The LPAS Interior Design Process",
  title: "Our Process",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      href: "/processes/discovery-immersion/?ids=1135%2C1136%2C1137%2C1138%2C1139",
      dark: false,
      title: "Discovery + Immersion",
      caption: "Insight shapes direction",
      text: "LPAS begins every interior project by learning about the organization, its culture, and how people use space. We immerse ourselves in your project's market context, target demographic, and competitive landscape. We ask questions, observe patterns, and listen closely to uncover the needs and opportunities that define the project. This discovery process shapes a clear direction that connects aesthetic goals to human experience and operational priorities.",
      image: {
        src: `${IMG}/Frame-4483-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "02",
      href: "/processes/visioning-concept-development-2/?ids=1135%2C1136%2C1137%2C1138%2C1139",
      dark: true,
      title: "Visioning + Concept Development",
      caption: "Story translated into space",
      text: "From early insights, LPAS develops a design concept that captures the essence of the organization. We explore how materials, light, and proportion shape identity and experience. Every successful project has a central concept that unifies architecture, interiors, and landscape into a cohesive experience. This phase transforms strategy into atmosphere, giving form to culture, values, and purpose through thoughtful design language.",
      image: {
        src: `${IMG}/Frame-4470-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "03",
      href: "/processes/programming-space-planning/?ids=1135%2C1136%2C1137%2C1138%2C1139",
      dark: true,
      title: "Programming + Space Planning",
      caption: "Spaces shaped by use",
      text: "LPAS translates project goals into practical, flexible space plans. We organize circulation, daylight, and spatial hierarchy to enhance efficiency and comfort. Working in the same BIM model as architects, our designers develop interiors in parallel with architecture. This is where vision becomes functional, a plan that balances purpose and possibility.",
      image: {
        src: `${IMG}/Process-slider-04-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "04",
      href: "/processes/detailing-materiality/?ids=1135%2C1136%2C1137%2C1138%2C1139",
      dark: false,
      title: "Detailing + Materiality",
      caption: "Experience in every detail",
      text: "Design is realized through the details. LPAS focuses on how each surface, material, and fixture contributes to overall experience and long-term durability. We refine the palette and detailing to create environments that feel timeless, authentic, and easy to maintain. We produce complete construction drawings, specifications, and schedules that integrate seamlessly with architectural documents, all maintained in the same model.",
      image: {
        src: `${IMG}/Frame-4504-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "05",
      href: "/processes/implementation-activation/?ids=1135%2C1136%2C1137%2C1138%2C1139",
      dark: true,
      title: "Implementation + Activation",
      caption: "Design execution with care",
      text: "LPAS remains actively involved throughout construction and installation. We provide comprehensive FF&E services with complete transparency, never profiting from furniture sales. We review shop drawings, collaborate with builders, and resolve challenges quickly to maintain quality and schedule. Once complete, we evaluate how spaces perform, ensuring every detail supports the client's goals and daily experience.",
      image: {
        src: `${IMG}/Frame-4468-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Rich text — two instances
 * ------------------------------------------------------------------ *
 *
 * Both use the housing sub-pages' shape exactly: one `<p>` per item holding a
 * `<strong>` lead-in, a `<br>`, then the descriptive line — which is why
 * CONTENT.json records each item as a single paragraph with an embedded
 * newline, and why `lead` / `text` are split rather than concatenated here.
 */

/** First instance — the six interior specialisms. */
export const WYSIWYG_EXPERTISE: BlockWysiwygProps = {
  tagline: "Specialized interiors, real impact",
  title: "Specialized Interior Design Expertise",
  body: [
    {
      type: "paragraph",
      lead: "Multifamily Housing Interiors:",
      text: "Unit design, amenity spaces, and common areas tailored to target demographics with market-aligned design that drives leasing.",
    },
    {
      type: "paragraph",
      lead: "Higher Education Interiors:",
      text: "Learning spaces, residence halls, student centers, and administrative areas that support student success and campus life.",
    },
    {
      type: "paragraph",
      lead: "Senior Living Interiors:",
      text: "Age-appropriate design with residential aesthetics and environments supporting dignity.",
    },
    {
      type: "paragraph",
      lead: "Affordable Housing Interiors:",
      text: "Creating quality, dignified interiors within constrained budgets.",
    },
    {
      type: "paragraph",
      lead: "Commercial Office Interiors:",
      text: "Productive work environments, collaborative spaces, and branded experiences that attract and retain talent.",
    },
    {
      type: "paragraph",
      lead: "Hospitality & Amenity Spaces:",
      text: "Clubrooms, fitness centers, co-working spaces, and community areas designed to enhance resident experience and retention.",
    },
  ],
};

/** Second instance — the six differentiators. */
export const WYSIWYG_ADVANTAGE: BlockWysiwygProps = {
  tagline: "Integrated. Transparent. Strategic.",
  title: "The LPAS Interior Design Advantage",
  body: [
    {
      type: "paragraph",
      lead: "Fully Integrated with Architecture:",
      text: "Our interior designers work in the same BIM model as architects from day one, eliminating conflicts and ensuring coordination.",
    },
    {
      type: "paragraph",
      lead: "No Furniture Markups:",
      // The one typographic apostrophe on the page; the rest of the copy uses
      // the ASCII one. Left exactly as the source stores it.
      text: "We don’t profit from product sales. Our design fees are separate, ensuring transparent costs and unbiased specifications.",
    },
    {
      type: "paragraph",
      lead: "Sustainable Design Commitment:",
      text: "WELL AP leadership brings expertise in healthy buildings, low-VOC products, and occupant wellbeing.",
    },
    {
      type: "paragraph",
      lead: "Market-Driven Design Intelligence:",
      text: "Our research-based approach ensures interiors align with target demographics and competitive positioning.",
    },
    {
      type: "paragraph",
      lead: "Schedule Alignment:",
      text: "We meet architectural milestones rather than creating separate interior packages, ensuring GMP sets are complete.",
    },
    {
      type: "paragraph",
      lead: "Full-Service Capabilities:",
      text: "From concept through FF&E installation under one roof.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — six tiles across layouts one / three
 * ------------------------------------------------------------------ *
 *
 * Layout order is measured, not chosen: BLOCKS.json records `__layoutOne`
 * (521px) then `__layoutThree` (521px, with its 141px footer overhanging) as
 * this block's two children after its header.
 *
 * The source ships every tile with `alt=""`; the pass-1 convention is to
 * restate the project title instead, so the tiles are not silent to screen
 * readers. Kept.
 */

const SEVENTEENTH_AND_BROADWAY: ProjectCard = {
  title: "17th & Broadway Interiors",
  location: "Oakland, CA",
  href: "/portfolio/17th-broadway-interiors/",
  image: {
    src: `${IMG}/68_17th-Broadway-1280x800-c-default.webp`,
    alt: "17th & Broadway Interiors",
    width: 1280,
    height: 800,
  },
  size: "large",
};

const CAPITOL_650: ProjectCard = {
  title: "Capitol 650 Interiors",
  location: "Milpitas, CA",
  href: "/portfolio/capitol-650-interiors/",
  image: {
    src: `${IMG}/13b_Capitol-650-1280x800-c-default.webp`,
    alt: "Capitol 650 Interiors",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const AYA_INTERIORS: ProjectCard = {
  title: "Aya Interiors",
  location: "Fremont, CA",
  href: "/portfolio/aya-interiors/",
  image: {
    src: `${IMG}/04_AYA-1280x800-c-default.webp`,
    alt: "Aya Interiors",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const MCCLELLAN_JET_SERVICES: ProjectCard = {
  title: "McClellan Jet Services FBO",
  location: "McClellan Park, CA",
  href: "/portfolio/mcclellan-jet-services-fbo/",
  image: {
    src: `${IMG}/08_McClellan-Jet-Services-FBO_FULLSIZE-1280x800-c-default.webp`,
    alt: "McClellan Jet Services FBO",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const EIGHT_HUNDRED_J_LOFTS: ProjectCard = {
  title: "800J Lofts Lobby Renovation",
  location: "Sacramento, CA",
  href: "/portfolio/800j-lofts-lobby-renovation/",
  image: {
    src: `${IMG}/02_800J-Lobby-1280x800-c-default.webp`,
    alt: "800J Lofts Lobby Renovation",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const NOVO_INTERIORS: ProjectCard = {
  title: "Novo Interiors",
  location: "Mountain View, CA",
  href: "/portfolio/novo-interiors/",
  image: {
    src: `${IMG}/01_NOVO-1280x800-c-default.webp`,
    alt: "Novo Interiors",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/**
 * Header copy is verbatim: lowercase "projects" on this page, and "All
 * Interiors" on the button. Layout three's footer repeats that same label —
 * BLOCKS.json measures its `.button__title` as "All Interiors", *not* the
 * "Portfolio" that `/markets/housing/` uses — and both buttons point at the
 * same market-filtered portfolio URL. The query string is part of the href, so
 * the filter row on `/portfolio/` picks it up.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Highlighted projects",
  button: { title: "All Interiors", href: "/portfolio/?market=interiors" },
  layouts: [
    {
      variant: "one",
      large: SEVENTEENTH_AND_BROADWAY,
      small: [CAPITOL_650, AYA_INTERIORS],
    },
    {
      variant: "three",
      small: [MCCLELLAN_JET_SERVICES, EIGHT_HUNDRED_J_LOFTS],
      large: NOVO_INTERIORS,
      footer: {
        title: "View all Interiors",
        buttonTitle: "All Interiors",
        buttonHref: "/portfolio/?market=interiors",
      },
    },
  ],
};
